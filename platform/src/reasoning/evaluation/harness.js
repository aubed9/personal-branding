import { CANONICAL_CONTEXT_AXES } from '../context/businessContextContract.js';
import { captureReasoningSnapshot } from './snapshot.js';
import { mean, roundMetric, summarizeSetDelta } from './metrics.js';

export const AXIS_CAUSAL_PAIRS = Object.freeze({
  customerModel: ['B2B', 'B2C'],
  offerType: ['DIGITAL_PRODUCT', 'PHYSICAL_PRODUCT'],
  channelModel: ['ONLINE_FIRST', 'PHYSICAL_FIRST'],
  revenueModel: ['RECURRING', 'PROJECT_BASED'],
  maturity: ['IDEA', 'REBRAND'],
  scale: ['MICRO', 'ENTERPRISE'],
  salesMotion: ['SELF_SERVE', 'TENDER'],
  geography: ['CITY', 'GLOBAL'],
  branchStructure: ['SINGLE_LOCATION', 'MULTI_BRANCH'],
  founderRole: ['FOUNDER_LED', 'NOT_PUBLIC'],
  purchaseCycle: ['SHORT_DAYS', 'LONG_MONTHS'],
  relationshipModel: ['TRANSACTIONAL', 'CONTRACTUAL_RETAINER'],
  regulatoryProfile: ['NORMAL', 'HIGHLY_REGULATED'],
  operationalComplexity: ['LOW', 'HIGH'],
  brandArchitecture: ['STANDALONE', 'HOUSE_OF_BRANDS'],
});

export const REQUIRED_MATCHED_PAIR_IDS = Object.freeze([
  'positive-vs-negative-unit-economics',
  'b2b-vs-b2c',
  'recurring-vs-project',
  'normal-vs-highly-regulated',
  'founder-led-vs-non-public',
  'micro-vs-enterprise',
  'local-retail-vs-b2b-manufacturing',
]);

function contextWithAxis(axis, value) {
  return {
    schemaVersion: '3.0.0',
    primaryArchetype: null,
    activeOverlays: [],
    confidence: 'USER_CONFIRMED',
    axes: Object.fromEntries(CANONICAL_CONTEXT_AXES.map(name => [name, name === axis ? value : 'UNKNOWN'])),
  };
}

export function compareSnapshots(left, right) {
  const dimensions = {
    modules: summarizeSetDelta(left.moduleIds, right.moduleIds),
    topology: summarizeSetDelta(left.decisionNodeIds, right.decisionNodeIds),
    evidence: summarizeSetDelta(left.evidenceRequirements, right.evidenceRequirements),
    metrics: summarizeSetDelta(left.metrics, right.metrics),
    risks: summarizeSetDelta(left.risks, right.risks),
    outputSections: summarizeSetDelta(left.outputSections, right.outputSections),
    actions: summarizeSetDelta(left.actionRuleIds, right.actionRuleIds),
    substantiveOutput: summarizeSetDelta(left.generatedClaimKeys, right.generatedClaimKeys),
    calculations: summarizeSetDelta(left.calculationStatements, right.calculationStatements),
  };
  const causalScore = mean([
    dimensions.modules.delta,
    dimensions.topology.delta,
    dimensions.evidence.delta,
    dimensions.actions.delta,
    dimensions.substantiveOutput.delta,
  ]);
  return {
    dimensions,
    causalDifferentiationScore: roundMetric(causalScore),
    materiallyDifferent: causalScore > 0,
  };
}

export function evaluateAxisCausalSensitivity(axis, leftValue = null, rightValue = null) {
  const pair = AXIS_CAUSAL_PAIRS[axis];
  if (!pair) throw new Error(`No causal pair registered for axis ${axis}`);
  const [left, right] = [leftValue ?? pair[0], rightValue ?? pair[1]];
  const leftSnapshot = captureReasoningSnapshot({ context: contextWithAxis(axis, left) });
  const rightSnapshot = captureReasoningSnapshot({ context: contextWithAxis(axis, right) });
  const comparison = compareSnapshots(leftSnapshot, rightSnapshot);
  const pass =
    comparison.dimensions.modules.delta > 0 &&
    comparison.dimensions.topology.delta > 0 &&
    comparison.dimensions.evidence.delta > 0 &&
    comparison.dimensions.substantiveOutput.delta > 0;
  return { axis, leftValue: left, rightValue: right, pass, ...comparison };
}

export function evaluateAllAxisCausalSensitivity() {
  const results = CANONICAL_CONTEXT_AXES.map(axis => evaluateAxisCausalSensitivity(axis));
  return {
    passed: results.every(result => result.pass),
    passedCount: results.filter(result => result.pass).length,
    total: results.length,
    results,
  };
}

export function evaluateMatchedPair({
  id,
  left,
  right,
  requiredDimensions = ['substantiveOutput'],
  forbiddenLeftModules = [],
  forbiddenRightModules = [],
} = {}) {
  if (!id) throw new Error('matched pair id is required');
  const leftSnapshot = captureReasoningSnapshot(left);
  const rightSnapshot = captureReasoningSnapshot(right);
  const comparison = compareSnapshots(leftSnapshot, rightSnapshot);
  const missingDimensions = requiredDimensions.filter(name => !(comparison.dimensions[name]?.delta > 0));
  const leakage = [
    ...forbiddenLeftModules.filter(id => leftSnapshot.moduleIds.includes(id)).map(moduleId => `left:${moduleId}`),
    ...forbiddenRightModules.filter(id => rightSnapshot.moduleIds.includes(id)).map(moduleId => `right:${moduleId}`),
  ];
  const invariantFailures = [];
  for (const [side, snapshot] of [['left', leftSnapshot], ['right', rightSnapshot]]) {
    if (snapshot.audit.evidenceCoverageRate !== 1) invariantFailures.push(`${side}:evidenceCoverage`);
    if (snapshot.audit.genericFallbackRatio !== 0) invariantFailures.push(`${side}:genericFallback`);
    if (snapshot.audit.staleConfirmedLeakageCount !== 0) invariantFailures.push(`${side}:staleLeakage`);
    if (snapshot.audit.illegalCertaintyUpgradeCount !== 0) invariantFailures.push(`${side}:certaintyUpgrade`);
    if (snapshot.audit.semanticDuplicateCount !== 0) invariantFailures.push(`${side}:semanticDuplicate`);
  }

  return {
    id,
    pass: missingDimensions.length === 0 && leakage.length === 0 && invariantFailures.length === 0,
    requiredDimensions,
    missingDimensions,
    leakage,
    invariantFailures,
    left: leftSnapshot,
    right: rightSnapshot,
    ...comparison,
  };
}

export function summarizeAcceptance({ axisResults, pairResults, shadowResults = [], invariantFailures = [] } = {}) {
  const axisPass = Boolean(axisResults?.passed);
  const requiredPairIds = new Set(REQUIRED_MATCHED_PAIR_IDS);
  const pairById = new Map((pairResults || []).map(result => [result.id, result]));
  const missingPairs = [...requiredPairIds].filter(id => !pairById.has(id));
  const failedPairs = [...requiredPairIds].filter(id => pairById.has(id) && !pairById.get(id).pass);
  const shadowRegressions = (shadowResults || []).filter(result => result.verdict === 'REGRESSION');

  return {
    passed: axisPass && missingPairs.length === 0 && failedPairs.length === 0 && shadowRegressions.length === 0 && invariantFailures.length === 0,
    axis: {
      passed: axisPass,
      passedCount: axisResults?.passedCount || 0,
      total: axisResults?.total || 0,
    },
    matchedPairs: {
      required: REQUIRED_MATCHED_PAIR_IDS.length,
      supplied: pairResults?.length || 0,
      missing: missingPairs,
      failed: failedPairs,
    },
    shadow: {
      total: shadowResults?.length || 0,
      regressions: shadowRegressions.map(result => result.id),
    },
    invariantFailures: [...invariantFailures],
  };
}
