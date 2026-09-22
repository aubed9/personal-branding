import test from 'node:test';
import assert from 'node:assert/strict';
import { runReasoningV3AcceptanceHarness, HARD_INVARIANTS } from './acceptance/reasoningV3AcceptanceHarness.js';

test('reasoning v3 hard-invariant harness passes all required acceptance layers', () => {
  const report = runReasoningV3AcceptanceHarness();
  assert.equal(Object.keys(report.hardInvariantResults).length, HARD_INVARIANTS.length);
  assert.deepEqual(report.failedInvariants, [], JSON.stringify(report, null, 2));
  assert.equal(report.matchedPairs.length, 7);
  assert.ok(report.matchedPairs.every(pair => pair.passed), JSON.stringify(report.matchedPairs, null, 2));
  assert.ok(report.shadow.every(item => item.passed), JSON.stringify(report.shadow, null, 2));
  assert.equal(report.output.evidenceCoverageRate, 1);
  assert.equal(report.knowledge.traceabilityRate, 1);
  assert.equal(report.migration.droppedPaths.length, 0);
  assert.equal(report.compatibilityCoverage.taxonomy753, 'SEPARATE_SUITE');
});

test('matched pairs change causal topology, not only labels', () => {
  const report = runReasoningV3AcceptanceHarness();
  for (const pair of report.matchedPairs.filter(item => item.moduleDelta)) {
    assert.ok(pair.moduleDelta.onlyA.length + pair.moduleDelta.onlyB.length > 0, pair.id);
    assert.ok(pair.decisionDelta.onlyA.length + pair.decisionDelta.onlyB.length > 0, pair.id);
    assert.equal(pair.outputChanged, true, pair.id);
  }
});

test('shadow mode keeps legacy compatibility surface while exposing differentiated v3 modules', () => {
  const report = runReasoningV3AcceptanceHarness();
  for (const item of report.shadow) {
    assert.equal(item.legacyCompatibilityPresent, true, item.id);
    assert.notDeepEqual(item.v3ModulesA, item.v3ModulesB, item.id);
  }
});
