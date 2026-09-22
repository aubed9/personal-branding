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

    // Answer evidence supports only active Decision Nodes in the same phase.
    // Fine-grained downstream invalidation is then controlled by question dependencies.
    const decisionNodesByPhase = {};
    for (const id of moduleContribution.contributed.decisionNodeIds) {
      const node = graph.nodes[id];
      if (!node?.phase) continue;
      (decisionNodesByPhase[node.phase] ||= []).push(id);
    }
    for (const record of records) {
      const answerId = answerNodeByQuestionId[record.questionId];
      if (!answerId) continue;
      for (const decisionId of decisionNodesByPhase[record.phase] || []) {
        addGraphEdge(graph, {
          type: EDGE_TYPES.SUPPORTS,
          from: answerId,
          to: decisionId,
          qualifier: 'PHASE_DECISION_EVIDENCE',
          metadata: { questionId: record.questionId, phase: record.phase },
        }, { bumpRevision: false });
      }
    }
  }

  for (const [phaseRaw, result] of Object.entries(phaseGateResults || {})) {
    if (!result) continue;
    materializePhaseExitGate(graph, Number(phaseRaw), result, { revision });
  }

  const contradictionProjection = projectContradictionsToGraph(graph, contradictions, answerNodeByQuestionId);

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
