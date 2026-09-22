import {
  EDGE_TYPES,
  ENTITY_STATUS,
  REASONING_ENGINE_VERSION,
  REASONING_SCHEMA_VERSION,
  canTransitionStatus,
  isEdgeType,
  isEntityStatus,
  isNodeType,
} from './constants.js';
import { makeEdgeId, makeNodeId, makeStableId, stableSerialize } from './ids.js';

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);
const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

export function createReasoningGraph({
  projectId = 'UNSCOPED',
  graphId = null,
  revision = 0,
  schemaVersion = REASONING_SCHEMA_VERSION,
  reasoningEngineVersion = REASONING_ENGINE_VERSION,
} = {}) {
  return {
    graphId: graphId || makeStableId('GRF', { projectId, schemaVersion }),
    schemaVersion,
    reasoningEngineVersion,
    revision,
    nodes: {},
    edges: {},
    indexes: { outgoing: {}, incoming: {} },
  };
}

export function createGraphNode({
  id = null,
  type,
  stableKey,
  status = ENTITY_STATUS.ACTIVE,
  phase = null,
  moduleId = null,
  payload = {},
  createdRevision = 0,
  lastValidatedRevision = createdRevision,
  supersedes = null,
  supersededBy = null,
} = {}) {
  if (!isNodeType(type)) throw new Error(`Invalid node type: ${type}`);
  if (!isEntityStatus(status)) throw new Error(`Invalid node status: ${status}`);
  if (stableKey === undefined || stableKey === null || stableKey === '') throw new Error('stableKey is required for graph nodes.');
  if (phase !== null && (!Number.isInteger(phase) || phase < 1 || phase > 8)) throw new Error(`Invalid phase: ${phase}`);
  if (!isPlainObject(payload)) throw new Error('Node payload must be a plain object.');

  return {
    id: id || makeNodeId(type, stableKey),
    type,
    stableKey: stableSerialize(stableKey),
    status,
    phase,
    moduleId,
    payload: clone(payload),
    createdRevision,
    lastValidatedRevision,
    supersedes,
    supersededBy,
  };
}

export function createGraphEdge({
  id = null,
  type,
  from,
  to,
  qualifier = null,
  metadata = {},
  createdRevision = 0,
} = {}) {
  if (!isEdgeType(type)) throw new Error(`Invalid edge type: ${type}`);
  if (!from || !to) throw new Error('Graph edge requires from and to node IDs.');
  if (from === to) throw new Error('Self-referential graph edges are not allowed.');
  if (!isPlainObject(metadata)) throw new Error('Edge metadata must be a plain object.');
  return {
    id: id || makeEdgeId(type, from, to, qualifier),
    type,
    from,
    to,
    qualifier,
    metadata: clone(metadata),
    createdRevision,
  };
}

function sameEntity(a, b) {
  return stableSerialize(a) === stableSerialize(b);
}

function ensureIndex(index, nodeId) {
  if (!index[nodeId]) index[nodeId] = [];
  return index[nodeId];
}

function insertSortedUnique(list, value) {
  if (!list.includes(value)) {
    list.push(value);
    list.sort();
  }
}

export function rebuildGraphIndexes(graph) {
  const outgoing = {};
  const incoming = {};
  for (const nodeId of Object.keys(graph.nodes || {})) {
    outgoing[nodeId] = [];
    incoming[nodeId] = [];
  }
  for (const edge of Object.values(graph.edges || {})) {
    if (graph.nodes?.[edge.from]) insertSortedUnique(ensureIndex(outgoing, edge.from), edge.id);
    if (graph.nodes?.[edge.to]) insertSortedUnique(ensureIndex(incoming, edge.to), edge.id);
  }
  graph.indexes = { outgoing, incoming };
  return graph.indexes;
}

export function addGraphNode(graph, node, { bumpRevision = true } = {}) {
  if (!isPlainObject(graph?.nodes)) throw new Error('Invalid reasoning graph.');
  const canonical = createGraphNode(node);
  const existing = graph.nodes[canonical.id];
  if (existing && !sameEntity(existing, canonical)) throw new Error(`Node ID collision: ${canonical.id}`);
  if (!existing) {
    graph.nodes[canonical.id] = canonical;
    ensureIndex(graph.indexes.outgoing, canonical.id);
    ensureIndex(graph.indexes.incoming, canonical.id);
    if (bumpRevision) graph.revision += 1;
  }
  return canonical;
}

export function addGraphEdge(graph, edge, { bumpRevision = true } = {}) {
  if (!isPlainObject(graph?.edges)) throw new Error('Invalid reasoning graph.');
  const canonical = createGraphEdge(edge);
  if (!graph.nodes[canonical.from]) throw new Error(`Broken edge source: ${canonical.from}`);
  if (!graph.nodes[canonical.to]) throw new Error(`Broken edge target: ${canonical.to}`);

  const existing = graph.edges[canonical.id];
  if (existing && !sameEntity(existing, canonical)) throw new Error(`Edge ID collision: ${canonical.id}`);
  if (!existing) {
    graph.edges[canonical.id] = canonical;
    insertSortedUnique(ensureIndex(graph.indexes.outgoing, canonical.from), canonical.id);
    insertSortedUnique(ensureIndex(graph.indexes.incoming, canonical.to), canonical.id);
    if (bumpRevision) graph.revision += 1;
  }
  return canonical;
}

export function transitionNodeStatus(graph, nodeId, nextStatus, { bumpRevision = true } = {}) {
  const node = graph?.nodes?.[nodeId];
  if (!node) throw new Error(`Unknown node: ${nodeId}`);
  if (!isEntityStatus(nextStatus)) throw new Error(`Invalid node status: ${nextStatus}`);
  if (!canTransitionStatus(node.status, nextStatus)) throw new Error(`Illegal status transition: ${node.status} -> ${nextStatus}`);
  if (node.status !== nextStatus) {
    node.status = nextStatus;
    node.lastValidatedRevision = graph.revision + (bumpRevision ? 1 : 0);
    if (bumpRevision) graph.revision += 1;
  }
  return node;
}

export function getReachableNodeIds(graph, startIds, {
  direction = 'outgoing',
  edgeTypes = null,
  includeStart = false,
} = {}) {
  if (!['outgoing', 'incoming'].includes(direction)) throw new Error(`Invalid direction: ${direction}`);
  const starts = [...new Set(Array.isArray(startIds) ? startIds : [startIds])].filter(Boolean);
  for (const id of starts) if (!graph.nodes?.[id]) throw new Error(`Unknown start node: ${id}`);

  const allowed = edgeTypes ? new Set(edgeTypes) : null;
  if (allowed) for (const type of allowed) if (!isEdgeType(type)) throw new Error(`Invalid edge type filter: ${type}`);

  const visited = new Set(starts);
  const result = new Set(includeStart ? starts : []);
  const queue = [...starts].sort();

  while (queue.length) {
    const current = queue.shift();
    const edgeIds = [...(graph.indexes?.[direction]?.[current] || [])].sort();
    for (const edgeId of edgeIds) {
      const edge = graph.edges[edgeId];
      if (!edge || (allowed && !allowed.has(edge.type))) continue;
      const next = direction === 'outgoing' ? edge.to : edge.from;
      if (visited.has(next)) continue;
      visited.add(next);
      result.add(next);
      queue.push(next);
      queue.sort();
    }
  }
  return [...result].sort();
}

export function validateReasoningGraph(graph, { checkIndexes = true } = {}) {
  const errors = [];
  if (!graph || typeof graph !== 'object') return { valid: false, errors: ['Graph must be an object.'] };
  if (!graph.graphId) errors.push('graphId is required.');
  if (graph.schemaVersion !== REASONING_SCHEMA_VERSION) errors.push(`Unsupported schemaVersion: ${graph.schemaVersion}`);
  if (!Number.isInteger(graph.revision) || graph.revision < 0) errors.push('Graph revision must be a non-negative integer.');
  if (!isPlainObject(graph.nodes)) errors.push('nodes must be an object keyed by node ID.');
  if (!isPlainObject(graph.edges)) errors.push('edges must be an object keyed by edge ID.');

  for (const [key, node] of Object.entries(graph.nodes || {})) {
    if (key !== node.id) errors.push(`Node key/id mismatch: ${key}`);
    if (!isNodeType(node.type)) errors.push(`Invalid node type at ${key}: ${node.type}`);
    if (!isEntityStatus(node.status)) errors.push(`Invalid node status at ${key}: ${node.status}`);
  }

  for (const [key, edge] of Object.entries(graph.edges || {})) {
    if (key !== edge.id) errors.push(`Edge key/id mismatch: ${key}`);
    if (!isEdgeType(edge.type)) errors.push(`Invalid edge type at ${key}: ${edge.type}`);
    if (!graph.nodes?.[edge.from]) errors.push(`Broken edge source ${key}: ${edge.from}`);
    if (!graph.nodes?.[edge.to]) errors.push(`Broken edge target ${key}: ${edge.to}`);
    if (edge.from === edge.to) errors.push(`Self-referential edge: ${key}`);
  }

  if (checkIndexes && isPlainObject(graph.nodes) && isPlainObject(graph.edges)) {
    const snapshot = clone(graph.indexes || {});
    const temp = { nodes: graph.nodes, edges: graph.edges, indexes: {} };
    rebuildGraphIndexes(temp);
    if (stableSerialize(snapshot) !== stableSerialize(temp.indexes)) errors.push('Graph adjacency indexes are out of sync.');
  }

  return { valid: errors.length === 0, errors };
}

export { EDGE_TYPES, ENTITY_STATUS };
