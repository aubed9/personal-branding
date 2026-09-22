import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphEdge,
  addGraphNode,
  createReasoningGraph,
} from '../graph/index.js';
import { makeNodeId } from '../graph/ids.js';
import { contributeDecisionModulesToGraph, toCanonicalModuleContext } from '../modules/index.js';
import { activeAnswers } from '../../services/interviewSchema.js';
import { DEPENDENCIES } from '../../services/adaptiveInterview.js';
import { materializePhaseExitGate } from './gateProjection.js';
import { projectContradictionsToGraph } from './contradictionProjection.js';
import { applyInvalidation, discoverInvalidation } from './invalidation.js';

export const AXIS_QUESTION_DEPENDENCIES = Object.freeze({
  customerModel: ['p2_step1_customer_pain', 'p2_step3_primary_channel', 'p3_target_segment', 'p3_positioning_frame', 'p3_brand_promise', 'p8_lead_funnel'],
  offerType: ['step2_core_offer', 'p2_step0_competitors', 'p2_step1_customer_pain', 'p3_brand_promise', 'p5_elevator_hook', 'p7_logo_direction', 'p8_lead_funnel'],
  channelModel: ['p2_step3_primary_channel', 'p8_pr_podcast_channels', 'p8_lead_funnel'],
  revenueModel: ['unit_economics', 'p2_step2_pricing_models', 'p2_step4_golden_opportunity', 'p8_lead_funnel'],
  maturity: ['step1_primary_goal', 'step2_value_hypothesis', 'p3_positioning_frame', 'p8_thought_leadership'],
  scale: ['cash_constraint', 'p3_strategic_boundary', 'p8_pr_podcast_channels', 'p8_lead_funnel'],
  salesMotion: ['p2_step3_primary_channel', 'p3_target_segment', 'p3_positioning_frame', 'p8_lead_funnel'],
  geography: ['p2_step0_competitors', 'p2_step3_primary_channel', 'p3_target_segment', 'p8_pr_podcast_channels'],
  branchStructure: ['p3_strategic_boundary', 'p7_color_palette', 'p7_typography_mood', 'p7_logo_direction', 'p8_lead_funnel'],
  founderRole: ['p4_archetype', 'p4_human_traits', 'p5_voice_style', 'p5_elevator_hook', 'p8_thought_leadership'],
  purchaseCycle: ['p2_step1_customer_pain', 'p3_positioning_frame', 'p3_brand_promise', 'p8_lead_funnel'],
  relationshipModel: ['p2_step1_customer_pain', 'p3_brand_promise', 'p8_lead_funnel', 'p8_crisis_reputation'],
  regulatoryProfile: ['p2_step0_competitors', 'p3_strategic_boundary', 'p3_brand_promise', 'p5_forbidden_words', 'p6_naming_territory', 'p8_crisis_reputation'],
  operationalComplexity: ['unit_economics', 'cash_constraint', 'p3_strategic_boundary', 'p8_lead_funnel'],
  brandArchitecture: ['p3_positioning_frame', 'p3_strategic_boundary', 'p6_naming_territory', 'p6_tagline_archetype', 'p7_color_palette', 'p7_typography_mood', 'p7_logo_direction', 'p8_thought_leadership'],
});

export const QUESTION_MODULE_DEPENDENCIES = Object.freeze({
  unit_economics: ['MOD-REV-TRANSACTION', 'MOD-REV-RECURRING', 'MOD-REV-PROJECT'],
  cash_constraint: ['MOD-SCALE-MICRO', 'MOD-SCALE-ENTERPRISE', 'MOD-OPS-HIGH'],
  p2_step1_customer_pain: ['MOD-CUSTOMER-B2B', 'MOD-CUSTOMER-B2C', 'MOD-CUSTOMER-TWO-SIDED'],
  p2_step2_pricing_models: ['MOD-REV-TRANSACTION', 'MOD-REV-RECURRING', 'MOD-REV-PROJECT'],
  p2_step3_primary_channel: ['MOD-CHANNEL-PHYSICAL', 'MOD-CHANNEL-ONLINE', 'MOD-GEO-LOCAL', 'MOD-GEO-CROSSBORDER', 'MOD-SALES-TENDER'],
  p3_target_segment: ['MOD-CUSTOMER-B2B', 'MOD-CUSTOMER-B2C', 'MOD-CUSTOMER-TWO-SIDED', 'MOD-CYCLE-LONG'],
  p3_positioning_frame: ['MOD-CUSTOMER-B2B', 'MOD-CUSTOMER-B2C', 'MOD-GEO-CROSSBORDER', 'MOD-BRAND-PORTFOLIO'],
  p3_brand_promise: ['MOD-REV-RECURRING', 'MOD-REL-RECURRING', 'MOD-REG-HIGH', 'MOD-OFFER-PHYSICAL', 'MOD-OFFER-DIGITAL', 'MOD-OFFER-SERVICE', 'MOD-OFFER-PLATFORM'],
  p4_archetype: ['MOD-FOUNDER-PUBLIC', 'MOD-FOUNDER-INSTITUTIONAL'],
  p5_voice_style: ['MOD-FOUNDER-PUBLIC', 'MOD-FOUNDER-INSTITUTIONAL', 'MOD-GEO-CROSSBORDER'],
  p6_naming_territory: ['MOD-REG-HIGH', 'MOD-BRAND-PORTFOLIO', 'MOD-MATURITY-REBRAND'],
  p7_color_palette: ['MOD-BRANCH-MULTI', 'MOD-SCALE-ENTERPRISE', 'MOD-BRAND-PORTFOLIO', 'MOD-MATURITY-REBRAND'],
  p8_lead_funnel: ['MOD-CHANNEL-PHYSICAL', 'MOD-CHANNEL-ONLINE', 'MOD-SALES-TENDER', 'MOD-CYCLE-LONG', 'MOD-REL-RECURRING'],
  p8_crisis_reputation: ['MOD-REG-HIGH', 'MOD-REL-RECURRING'],
});

function answerNodeStatus(record, reviewRequired) {
  const needsReview = (reviewRequired?.[record.phase] || []).includes(record.questionId);
  if (needsReview || record.kind === 'UNKNOWN') return ENTITY_STATUS.NEEDS_REVIEW;
  return ENTITY_STATUS.CONFIRMED;
}

export function buildRuntimeReasoningGraph({
  projectId = 'RUNTIME',
  revision = 0,
  businessContext = null,
  answerRecords = [],
  reviewRequired = {},
  contradictions = [],
  phaseGateResults = {},
} = {}) {
  const graph = createReasoningGraph({ projectId, revision });
  let moduleContribution = null;

  if (businessContext) {
    moduleContribution = contributeDecisionModulesToGraph(graph, businessContext);
  }

  const answerNodeByQuestionId = {};
  const answerNodeByAnswerId = {};
  const records = activeAnswers(answerRecords);

  for (const record of records) {
    const id = makeNodeId(NODE_TYPES.EVIDENCE, {
      answerId: record.id,
      questionId: record.questionId,
    });
    addGraphNode(graph, {
      id,
      type: NODE_TYPES.EVIDENCE,
      stableKey: { answerId: record.id, questionId: record.questionId },
      status: answerNodeStatus(record, reviewRequired),
      phase: Number(record.phase) || null,
      payload: {
        answerId: record.id,
        questionId: record.questionId,
        field: record.field || null,
        kind: record.kind || 'FACT',
        requiredForCompletion: (reviewRequired?.[record.phase] || []).includes(record.questionId),
      },
      createdRevision: Number(record.revision) || 0,
      lastValidatedRevision: revision,
    }, { bumpRevision: false });
    answerNodeByQuestionId[record.questionId] = id;
    answerNodeByAnswerId[record.id] = id;
  }

  // Canonical question-to-question dependencies.
  for (const [dependentQuestionId, prerequisiteQuestionIds] of Object.entries(DEPENDENCIES)) {
    const dependentId = answerNodeByQuestionId[dependentQuestionId];
    if (!dependentId) continue;
    for (const prerequisiteQuestionId of prerequisiteQuestionIds) {
      const prerequisiteId = answerNodeByQuestionId[prerequisiteQuestionId];
      if (!prerequisiteId) continue;
      addGraphEdge(graph, {
        type: EDGE_TYPES.INVALIDATES,
        from: prerequisiteId,
        to: dependentId,
        qualifier: 'QUESTION_DEPENDENCY',
        metadata: { prerequisiteQuestionId, dependentQuestionId },
      }, { bumpRevision: false });
      addGraphEdge(graph, {
        type: EDGE_TYPES.SUPPORTS,
        from: prerequisiteId,
        to: dependentId,
        qualifier: 'QUESTION_EVIDENCE',
        metadata: { prerequisiteQuestionId, dependentQuestionId },
      }, { bumpRevision: false });
    }
  }

  // Axis changes invalidate only explicitly related answered questions.
  if (businessContext && moduleContribution) {
    const canonicalContext = toCanonicalModuleContext(businessContext);
    for (const [axis, questionIds] of Object.entries(AXIS_QUESTION_DEPENDENCIES)) {
      const axisNodeId = moduleContribution.contributed.contextNodeIds[axis];
      if (!axisNodeId) continue;
      for (const questionId of questionIds) {
        const answerNodeId = answerNodeByQuestionId[questionId];
        if (!answerNodeId) continue;
        addGraphEdge(graph, {
          type: EDGE_TYPES.INVALIDATES,
          from: axisNodeId,
          to: answerNodeId,
          qualifier: 'AXIS_QUESTION_DEPENDENCY',
          metadata: { axis, axisValue: canonicalContext.axes[axis], questionId },
        }, { bumpRevision: false });
      }
    }

    // Answer evidence supports same-phase decisions plus explicitly declared cross-phase
    // module decisions (for example unit economics -> recurring/project economics outputs).
    const decisionNodesByPhase = {};
    for (const id of moduleContribution.contributed.decisionNodeIds) {
      const node = graph.nodes[id];
      if (!node?.phase) continue;
      (decisionNodesByPhase[node.phase] ||= []).push(id);
    }
    for (const record of records) {
      const answerId = answerNodeByQuestionId[record.questionId];
      if (!answerId) continue;

      const targetIds = new Set(decisionNodesByPhase[record.phase] || []);
      for (const moduleId of QUESTION_MODULE_DEPENDENCIES[record.questionId] || []) {
        for (const decisionId of moduleContribution.contributed.moduleNodeIds[moduleId] || []) {
          targetIds.add(decisionId);
        }
      }

      for (const decisionId of [...targetIds].sort()) {
        addGraphEdge(graph, {
          type: EDGE_TYPES.SUPPORTS,
          from: answerId,
          to: decisionId,
          qualifier: 'DECISION_EVIDENCE',
          metadata: {
            questionId: record.questionId,
            phase: record.phase,
            crossPhase: graph.nodes[decisionId]?.phase !== record.phase,
          },
        }, { bumpRevision: false });
      }
    }
  }

  for (const [phaseRaw, result] of Object.entries(phaseGateResults || {})) {
    if (!result) continue;
    materializePhaseExitGate(graph, Number(phaseRaw), result, { revision });
  }

  const contradictionProjection = projectContradictionsToGraph(graph, contradictions, answerNodeByQuestionId);

  // Rebuilds must preserve unresolved review/stale propagation. A graph rebuild is
  // recomputation of topology, not an implicit approval of previously invalidated evidence.
  for (const [questionId, nodeId] of Object.entries(answerNodeByQuestionId)) {
    const node = graph.nodes[nodeId];
    if (node?.status !== ENTITY_STATUS.NEEDS_REVIEW) continue;
    const discovery = discoverInvalidation(graph, [nodeId]);
    applyInvalidation(graph, {
      id: `REVIEW-CARRY-${questionId}-R${revision}`,
      type: 'REVIEW_REQUIRED',
      revision,
      changedNodeIds: [nodeId],
    }, discovery);
  }

  return {
    graph,
    indexes: {
      answerNodeByQuestionId,
      answerNodeByAnswerId,
      contextNodeByAxis: moduleContribution?.contributed?.contextNodeIds || {},
    },
    moduleContribution,
    contradictionProjection,
  };
}
