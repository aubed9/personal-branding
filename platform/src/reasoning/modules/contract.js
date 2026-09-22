import { CANONICAL_CONTEXT_AXES, CONTEXT_AXIS_VALUES } from '../context/businessContextContract.js';
import { EFFECT_KIND } from './axisPhaseEffects.js';

export const MODULE_EFFECT_TYPES = Object.freeze({
  DECISION_NODE: 'DECISION_NODE',
  EVIDENCE_REQUIREMENT: 'EVIDENCE_REQUIREMENT',
  CALCULATION: 'CALCULATION',
  KPI: 'KPI',
  RISK: 'RISK',
  OUTPUT_SECTION: 'OUTPUT_SECTION',
  GATE: 'GATE',
  KNOWLEDGE_DEPENDENCY: 'KNOWLEDGE_DEPENDENCY',
});

const uniq = values => [...new Set((values || []).filter(Boolean))];

export function defineDecisionModule(definition) {
  const mod = {
    id: definition.id,
    title: definition.title || definition.id,
    axis: definition.axis,
    values: uniq(definition.values),
    phases: uniq(definition.phases).map(Number).sort((a, b) => a - b),
    activation: definition.activation || null,
    prerequisites: definition.prerequisites || [],
    decisionNodes: definition.decisionNodes || [],
    evidenceRequirements: definition.evidenceRequirements || [],
    calculations: definition.calculations || [],
    metrics: definition.metrics || [],
    risks: definition.risks || [],
    outputSections: definition.outputSections || [],
    gates: definition.gates || [],
    knowledgeDependencies: definition.knowledgeDependencies || [],
    sourceDependencies: definition.sourceDependencies || [],
    invalidationEdges: definition.invalidationEdges || [],
    priority: Number(definition.priority || 100),
  };
  Object.freeze(mod.values);
  Object.freeze(mod.phases);
  return Object.freeze(mod);
}

export function validateDecisionModule(mod) {
  const errors = [];
  if (!mod?.id) errors.push('module id is required');
  if (!CANONICAL_CONTEXT_AXES.includes(mod?.axis)) errors.push(`invalid module axis: ${mod?.axis}`);
  if (!Array.isArray(mod?.values) || mod.values.length === 0) errors.push('module values are required');
  else for (const value of mod.values) if (!CONTEXT_AXIS_VALUES[mod.axis]?.includes(value)) errors.push(`invalid activation value ${value} for ${mod.axis}`);
  if (!Array.isArray(mod?.phases) || mod.phases.some(p => !Number.isInteger(p) || p < 1 || p > 8)) errors.push('module phases must be 1..8');
  if (!Array.isArray(mod?.prerequisites)) errors.push('prerequisites must be an array');
  if (!Array.isArray(mod?.decisionNodes)) errors.push('decisionNodes must be an array');
  if (!Array.isArray(mod?.evidenceRequirements)) errors.push('evidenceRequirements must be an array');
  if (!Array.isArray(mod?.metrics)) errors.push('metrics must be an array');
  if (!Array.isArray(mod?.risks)) errors.push('risks must be an array');
  if (!Array.isArray(mod?.outputSections)) errors.push('outputSections must be an array');
  if (!Array.isArray(mod?.gates)) errors.push('gates must be an array');
  if (!Array.isArray(mod?.knowledgeDependencies)) errors.push('knowledgeDependencies must be an array');
  if (!Array.isArray(mod?.sourceDependencies)) errors.push('sourceDependencies must be an array');
  if (!Array.isArray(mod?.invalidationEdges)) errors.push('invalidationEdges must be an array');

  for (const node of mod?.decisionNodes || []) {
    if (!node.id || !node.phase) errors.push(`decision node missing id/phase in ${mod?.id}`);
    if (!mod.phases.includes(node.phase)) errors.push(`decision node ${node.id} phase is outside module phases`);
  }
  return { valid: errors.length === 0, errors };
}

export function isModuleActive(mod, canonicalContext) {
  const value = canonicalContext?.axes?.[mod.axis];
  if (!value || value === 'UNKNOWN') return false;
  if (!mod.values.includes(value)) return false;
  return typeof mod.activation === 'function' ? Boolean(mod.activation(canonicalContext)) : true;
}

export function describeModuleEffect(mod, phase) {
  if (!mod.phases.includes(Number(phase))) {
    return { kind: EFFECT_KIND.NO_EFFECT_WITH_REASON, reason: `ماژول ${mod.id} در فاز ${phase} خروجی تصمیمی ندارد.` };
  }
  return { kind: EFFECT_KIND.DIRECT_EFFECT, reason: `ماژول ${mod.id} برای این فاز فعال است.` };
}
