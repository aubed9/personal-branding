import { getPhaseAdaptationRules } from '../../data/businessContextRouter.js';
import { OrchestratorEngine } from '../../services/orchestratorEngine.js';
import { migrateAnswerRecords } from '../../services/interviewSchema.js';
import { buildRuntimeReasoningGraph, discoverInvalidation } from '../engine/index.js';
import { migrateLegacyStateToV3 } from '../../state/v3/migration.js';
import { captureReasoningSnapshot } from './snapshot.js';
import { summarizeSetDelta } from './metrics.js';

const uniqSorted = values => [...new Set((values || []).filter(Boolean))].sort();

function normalizeMetric(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
}

export function captureShadowPhase(context, phase) {
  const rules = getPhaseAdaptationRules(phase, context);
  if (!rules) {
    return {
      phase: Number(phase),
      legacy: null,
      v3: null,
    };
  }
  return {
    phase: Number(phase),
    legacy: {
      title: rules.title || '',
      instruction: rules.instruction || '',
      metrics: uniqSorted((rules.kpis || []).map(normalizeMetric)),
      risks: uniqSorted((rules.risks || []).map(value => String(value))),
    },
    v3: {
      title: rules.v3Title || '',
      instruction: rules.v3Instruction || '',
      moduleIds: uniqSorted(rules.decisionModules || []),
      decisionNodeIds: uniqSorted((rules.decisionNodes || []).map(node => node.id)),
      evidenceRequirements: uniqSorted(rules.evidenceRequirements || []),
      metrics: uniqSorted((rules.moduleKpis || []).map(normalizeMetric)),
      risks: uniqSorted(rules.moduleRisks || []),
      gates: uniqSorted(rules.gates || []),
      outputSections: uniqSorted(rules.outputSections || []),
      knowledgeDependencies: uniqSorted(rules.knowledgeDependencies || []),
    },
  };
}

export function classifyShadowSnapshot(snapshot, { id = null } = {}) {
  const legacy = snapshot?.legacy;
  const v3 = snapshot?.v3;
  const regressionReasons = [];

  if (!legacy || !v3) regressionReasons.push('MISSING_PROJECTION');
  if (legacy && v3) {
    const specialized = v3.moduleIds.length > 0;
    if (specialized && v3.decisionNodeIds.length === 0) regressionReasons.push('ACTIVE_MODULE_WITHOUT_DECISION_NODE');
    if (specialized && v3.evidenceRequirements.length === 0) regressionReasons.push('ACTIVE_MODULE_WITHOUT_EVIDENCE_CONTRACT');
    if (specialized && v3.knowledgeDependencies.length === 0) regressionReasons.push('ACTIVE_MODULE_WITHOUT_KNOWLEDGE_DEPENDENCY');
    if (legacy.title && !v3.title) regressionReasons.push('LOST_PHASE_TITLE');
  }

  const addsCausalTrace = Boolean(
    v3?.moduleIds?.length &&
    v3?.decisionNodeIds?.length &&
    v3?.evidenceRequirements?.length
  );

  const verdict = regressionReasons.length
    ? 'REGRESSION'
    : addsCausalTrace
      ? 'EXPECTED_IMPROVEMENT'
      : 'COMPATIBLE';

  return {
    id: id || `phase-${snapshot?.phase}`,
    phase: Number(snapshot?.phase),
    verdict,
    regressionReasons,
    legacy,
    v3,
    deltas: legacy && v3 ? {
      metrics: summarizeSetDelta(legacy.metrics, v3.metrics),
      risks: summarizeSetDelta(legacy.risks, v3.risks),
    } : null,
  };
}

export function compareShadowPhase({ id, context, phase } = {}) {
  return classifyShadowSnapshot(captureShadowPhase(context, phase), { id });
}


function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

export function captureOperationalShadowScenario({
  id,
  context,
  phase,
  phaseData = {},
  mutationQuestionId = null,
} = {}) {
  const p = Number(phase);
  const answerRecords = migrateAnswerRecords(phaseData);

  const engine = new OrchestratorEngine();
  engine.currentPhase = p;
  engine.phaseData = clone({
    1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {},
    ...phaseData,
  });
  engine.answerRecords = clone(answerRecords);
  engine.businessContext = clone(context);
  engine.completedPhases = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true };
  engine._syncReasoningGraphV3();

  const legacyQuestions = engine.getCurrentPhaseQuestions().map(question => question.id).sort();
  const legacyFallback = new OrchestratorEngine();
  legacyFallback.phaseData = clone(engine.phaseData);
  legacyFallback.completedPhases = { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true };
  const broadInvalidation = legacyFallback.invalidateDependentPhases(p);

  const built = buildRuntimeReasoningGraph({
    projectId: `SHADOW-${id || p}`,
    revision: 1,
    businessContext: context,
    answerRecords,
    phaseData,
  });
  const mutationId = mutationQuestionId
    ? built.indexes.answerNodeByQuestionId?.[mutationQuestionId]
    : null;
  const exactInvalidation = mutationId
    ? discoverInvalidation(built.graph, [mutationId])
    : { affectedPhases: [], affectedQuestionIds: [], affectedNodeIds: [] };

  const canonical = captureReasoningSnapshot({
    context,
    phaseData,
    metadata: { answerRecords, reasoningGraphV3: built.graph, revision: 1 },
  });

  const deliverable = engine.generateDeliverableData(p);
  const migration = migrateLegacyStateToV3({
    revision: 1,
    currentPhase: p,
    currentStepIndex: 0,
    phaseData,
    answerRecords,
    completedPhases: engine.completedPhases,
    businessContext: context,
  }, {
    fromSchemaVersion: 2,
    migratedAt: '2026-09-23T00:00:00.000Z',
  });

  return {
    id: id || `phase-${p}`,
    phase: p,
    legacy: {
      questionIds: legacyQuestions,
      broadInvalidatedPhases: [...(broadInvalidation.invalidatedPhases || [])].sort((a, b) => a - b),
      deliverableSectionIds: (deliverable.sections || []).map(section => section.id || section.title).filter(Boolean),
    },
    v3: {
      moduleIds: canonical.moduleIds,
      decisionNodeIds: canonical.decisionNodeIds,
      gates: canonical.gates,
      claimCount: canonical.claimCount,
      actionRuleIds: canonical.actionRuleIds,
      generatedClaimKeys: canonical.generatedClaimKeys,
      exactInvalidatedPhases: [...(exactInvalidation.affectedPhases || [])].sort((a, b) => a - b),
      exactInvalidatedQuestionIds: [...(exactInvalidation.affectedQuestionIds || [])].sort(),
      deliverableClaimIds: [...(deliverable.claimIds || [])].sort(),
      deliverableSectionIds: (deliverable.sections || []).map(section => section.id || section.title).filter(Boolean),
      audit: canonical.audit,
    },
    migration: {
      warningCodes: (migration.report?.warnings || []).map(item => item.code).filter(Boolean).sort(),
      droppedPaths: [...(migration.report?.droppedPaths || [])].sort(),
      preservedLegacyPaths: [...(migration.report?.preservedLegacyPaths || [])].sort(),
    },
  };
}

export function classifyOperationalShadowScenario(snapshot) {
  const regressionReasons = [];
  const v3 = snapshot?.v3 || {};
  const legacy = snapshot?.legacy || {};
  const migration = snapshot?.migration || {};

  if ((v3.moduleIds || []).length > 0 && (v3.decisionNodeIds || []).length === 0) {
    regressionReasons.push('ACTIVE_MODULE_WITHOUT_DECISION_TOPOLOGY');
  }
  if ((v3.moduleIds || []).length > 0 && (v3.generatedClaimKeys || []).length === 0) {
    regressionReasons.push('ACTIVE_MODULE_WITHOUT_CANONICAL_CLAIMS');
  }
  if ((v3.deliverableClaimIds || []).length === 0) {
    regressionReasons.push('DELIVERABLE_WITHOUT_CANONICAL_CLAIM_REFS');
  }
  if ((migration.droppedPaths || []).length > 0) {
    regressionReasons.push('MIGRATION_DROPPED_PATHS');
  }
  if (v3.audit?.evidenceCoverageRate !== 1) regressionReasons.push('EVIDENCE_COVERAGE_BELOW_100');
  if (v3.audit?.staleConfirmedLeakageCount !== 0) regressionReasons.push('STALE_CONFIRMED_LEAKAGE');
  if (v3.audit?.illegalCertaintyUpgradeCount !== 0) regressionReasons.push('ILLEGAL_CERTAINTY_UPGRADE');

  const exact = new Set(v3.exactInvalidatedPhases || []);
  const broad = new Set(legacy.broadInvalidatedPhases || []);
  const invalidationEscapedLegacyEnvelope = [...exact].some(value => !broad.has(value) && value > snapshot.phase);
  if (invalidationEscapedLegacyEnvelope) regressionReasons.push('EXACT_INVALIDATION_OUTSIDE_LEGACY_ENVELOPE');

  const expectedImprovement = regressionReasons.length === 0 && (
    (v3.decisionNodeIds || []).length > 0 ||
    (v3.actionRuleIds || []).length > 0 ||
    (legacy.broadInvalidatedPhases || []).length > (v3.exactInvalidatedPhases || []).length
  );

  return {
    id: snapshot?.id,
    phase: snapshot?.phase,
    verdict: regressionReasons.length ? 'REGRESSION' : expectedImprovement ? 'EXPECTED_IMPROVEMENT' : 'COMPATIBLE',
    regressionReasons,
    snapshot,
  };
}
