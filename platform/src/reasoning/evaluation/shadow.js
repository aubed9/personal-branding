import { getPhaseAdaptationRules } from '../../data/businessContextRouter.js';
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
