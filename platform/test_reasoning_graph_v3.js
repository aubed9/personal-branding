import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphEdge,
  addGraphNode,
  createGraphEdge,
  createReasoningGraph,
  getReachableNodeIds,
  transitionNodeStatus,
  validateReasoningGraph,
} from './src/reasoning/graph/index.js';
import { makeNodeId, makeStableId } from './src/reasoning/graph/ids.js';
import {
  CANONICAL_CONTEXT_AXES,
  CONTEXT_AXIS_VALUES,
  validateCanonicalBusinessContext,
} from './src/reasoning/context/businessContextContract.js';
import {
  CLAIM_STATUS,
  CLAIM_TYPES,
  PROPOSAL_STATUS,
  SECTION_STATUS,
  createCanonicalClaim,
  createCanonicalSection,
  validateCanonicalClaim,
  validateCanonicalSection,
} from './src/reasoning/contracts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('canonical business context has exactly the approved 15 axes and schema mirrors runtime vocabulary', () => {
  assert.equal(CANONICAL_CONTEXT_AXES.length, 15);
  assert.equal(new Set(CANONICAL_CONTEXT_AXES).size, 15);
  assert.equal(CANONICAL_CONTEXT_AXES.includes('primaryArchetype'), false);

  const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../schemas/v3/business-context.schema.json'), 'utf8'));
  const schemaAxes = Object.keys(schema.properties.axes.properties);
  assert.deepEqual(schemaAxes, [...CANONICAL_CONTEXT_AXES]);

  for (const axis of CANONICAL_CONTEXT_AXES) {
    assert.deepEqual(schema.properties.axes.properties[axis].enum, [...CONTEXT_AXIS_VALUES[axis]], `enum drift for ${axis}`);
  }

  const context = {
    schemaVersion: '3.0.0',
    primaryArchetype: 'SAAS_SOFTWARE',
    activeOverlays: ['B2B', 'RECURRING_SUBSCRIPTION_METRICS'],
    axes: Object.fromEntries(CANONICAL_CONTEXT_AXES.map(axis => [axis, CONTEXT_AXIS_VALUES[axis][0]])),
  };
  assert.deepEqual(validateCanonicalBusinessContext(context), { valid: true, errors: [] });
});

test('stable IDs are deterministic across object key ordering', () => {
  const a = makeStableId('TST', { phase: 2, field: 'customerPain', nested: { b: 2, a: 1 } });
  const b = makeStableId('TST', { nested: { a: 1, b: 2 }, field: 'customerPain', phase: 2 });
  const c = makeStableId('TST', { phase: 3, field: 'customerPain', nested: { a: 1, b: 2 } });

  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.match(makeNodeId(NODE_TYPES.EVIDENCE, 'answer:phase1:goal'), /^EVD-[0-9a-f]{16}$/);
});

test('graph primitives keep exact adjacency indexes and deterministic reachability', () => {
  const graph = createReasoningGraph({ projectId: 'PRJ-TEST-001' });

  const evidence = addGraphNode(graph, {
    type: NODE_TYPES.EVIDENCE,
    stableKey: 'ANS-1',
    phase: 1,
    payload: { answerId: 'ANS-1' },
  });
  const decision = addGraphNode(graph, {
    type: NODE_TYPES.DECISION_NODE,
    stableKey: 'phase3:target-segment',
    phase: 3,
    payload: { decisionNodeId: 'target-segment' },
  });
  const output = addGraphNode(graph, {
    type: NODE_TYPES.OUTPUT_CLAIM,
    stableKey: 'claim:target-segment',
    phase: 3,
    payload: {},
  });

  addGraphEdge(graph, { type: EDGE_TYPES.SUPPORTS, from: evidence.id, to: decision.id });
  addGraphEdge(graph, { type: EDGE_TYPES.DERIVES, from: decision.id, to: output.id });

  assert.deepEqual(getReachableNodeIds(graph, evidence.id), [decision.id, output.id].sort());
  assert.deepEqual(getReachableNodeIds(graph, evidence.id, { edgeTypes: [EDGE_TYPES.SUPPORTS] }), [decision.id]);
  assert.equal(validateReasoningGraph(graph).valid, true);
  assert.equal(graph.indexes.outgoing[evidence.id].length, 1);
  assert.equal(graph.indexes.incoming[output.id].length, 1);
});

test('broken graph references are hard validation failures', () => {
  const graph = createReasoningGraph({ projectId: 'PRJ-BROKEN' });
  const evidence = addGraphNode(graph, {
    type: NODE_TYPES.EVIDENCE,
    stableKey: 'ANS-9',
    phase: 1,
    payload: {},
  });

  const broken = createGraphEdge({
    type: EDGE_TYPES.SUPPORTS,
    from: evidence.id,
    to: 'CLM-does-not-exist',
  });
  graph.edges[broken.id] = broken;
  graph.indexes.outgoing[evidence.id] = [broken.id];

  const result = validateReasoningGraph(graph, { checkIndexes: false });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('Broken edge target')));
});

test('entity status transitions are deterministic and terminal states cannot silently reactivate', () => {
  const graph = createReasoningGraph({ projectId: 'PRJ-STATUS' });
  const node = addGraphNode(graph, {
    type: NODE_TYPES.DECISION,
    stableKey: 'DEC-1',
    phase: 3,
    payload: {},
  });

  transitionNodeStatus(graph, node.id, ENTITY_STATUS.CONFIRMED);
  assert.equal(graph.nodes[node.id].status, ENTITY_STATUS.CONFIRMED);
  assert.throws(() => transitionNodeStatus(graph, node.id, ENTITY_STATUS.ACTIVE), /Illegal status transition/);

  transitionNodeStatus(graph, node.id, ENTITY_STATUS.DEPRECATED);
  assert.throws(() => transitionNodeStatus(graph, node.id, ENTITY_STATUS.ACTIVE), /Illegal status transition/);
});

test('claim contracts enforce provenance by claim type', () => {
  const external = createCanonicalClaim({
    stableKey: 'market:cpi:1405-06',
    claimType: CLAIM_TYPES.EXTERNAL_FACT,
    statement: 'نمونه ادعای خارجی برای تست قرارداد.',
    status: CLAIM_STATUS.CONFIRMED,
    sourceClaimIds: ['KCL-001'],
    sourceIds: ['SRC-IR-SCI-001'],
    createdRevision: 1,
  });
  assert.equal(validateCanonicalClaim(external).valid, true);

  const brokenExternal = createCanonicalClaim({
    stableKey: 'market:missing-source',
    claimType: CLAIM_TYPES.EXTERNAL_FACT,
    statement: 'این ادعا منبع ندارد.',
    status: CLAIM_STATUS.CONFIRMED,
  });
  assert.equal(validateCanonicalClaim(brokenExternal).valid, false);

  const proposal = createCanonicalClaim({
    stableKey: 'proposal:retention-pilot',
    claimType: CLAIM_TYPES.PROPOSAL,
    statement: 'یک پایلوت نگهداشت محدود اجرا شود.',
    status: CLAIM_STATUS.PROVISIONAL,
    dependencyIds: ['CTX-001'],
    moduleId: 'MOD-RETENTION',
    proposalStatus: PROPOSAL_STATUS.RECOMMENDED,
  });
  assert.equal(validateCanonicalClaim(proposal).valid, true);
});

test('section contract requires an omission reason for not-applicable modules', () => {
  const omitted = createCanonicalSection({
    stableKey: 'section:procurement',
    sectionType: 'PROCUREMENT',
    activationReason: '',
    applicability: 'NOT_APPLICABLE',
    status: SECTION_STATUS.NOT_APPLICABLE,
    omissionReason: 'مدل مشتری B2C است و ماژول procurement فعال نیست.',
  });
  assert.equal(validateCanonicalSection(omitted).valid, true);

  const invalid = createCanonicalSection({
    stableKey: 'section:procurement:bad',
    sectionType: 'PROCUREMENT',
    status: SECTION_STATUS.NOT_APPLICABLE,
  });
  assert.equal(validateCanonicalSection(invalid).valid, false);
});
