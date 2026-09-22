import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  getReachableNodeIds,
} from '../graph/index.js';

export const INVALIDATION_EDGE_TYPES = Object.freeze([
  EDGE_TYPES.INVALIDATES,
  EDGE_TYPES.SUPPORTS,
  EDGE_TYPES.DERIVES,
  EDGE_TYPES.INFLUENCES,
  EDGE_TYPES.ACTIVATES,
  EDGE_TYPES.REQUIRES,
]);

const TERMINAL = new Set([ENTITY_STATUS.DEPRECATED, ENTITY_STATUS.SUPERSEDED, ENTITY_STATUS.NOT_APPLICABLE]);

function invalidatedStatus(node) {
  if (!node || TERMINAL.has(node.status)) return node?.status;
  if ([NODE_TYPES.CALCULATION, NODE_TYPES.OUTPUT_CLAIM, NODE_TYPES.OUTPUT_SECTION].includes(node.type)) return ENTITY_STATUS.STALE;
  if (node.type === NODE_TYPES.GATE) {
    return node.status === ENTITY_STATUS.CONFIRMED ? ENTITY_STATUS.NEEDS_REVIEW : ENTITY_STATUS.BLOCKED;
  }
  return ENTITY_STATUS.NEEDS_REVIEW;
}

export function discoverInvalidation(graph, changedNodeIds, { edgeTypes = INVALIDATION_EDGE_TYPES } = {}) {
  const starts = [...new Set(changedNodeIds.filter(id => graph?.nodes?.[id]))].sort();
  if (!starts.length) return { changedNodeIds: [], affectedNodeIds: [], affectedPhases: [], affectedQuestionIds: [] };

  const affected = getReachableNodeIds(graph, starts, { edgeTypes, includeStart: false });
  const phases = new Set();
  const questions = new Set();

  for (const id of affected) {
    const node = graph.nodes[id];
    if (!node) continue;
    if (Number.isInteger(node.phase)) phases.add(node.phase);
    if (node.type === NODE_TYPES.EVIDENCE && node.payload?.questionId) questions.add(node.payload.questionId);
  }

  return {
    changedNodeIds: starts,
    affectedNodeIds: affected,
    affectedPhases: [...phases].sort((a, b) => a - b),
    affectedQuestionIds: [...questions].sort(),
  };
}

export function applyInvalidation(graph, event, discovery = null) {
  const result = discovery || discoverInvalidation(graph, event.changedNodeIds);
  for (const id of result.affectedNodeIds) {
    const node = graph.nodes[id];
    if (!node || TERMINAL.has(node.status)) continue;
    node.status = invalidatedStatus(node);
    node.lastValidatedRevision = event.revision;
    node.payload = {
      ...(node.payload || {}),
      invalidation: {
        eventId: event.id,
        eventType: event.type,
        revision: event.revision,
        changedNodeIds: [...event.changedNodeIds],
      },
    };
  }
  return result;
}

export function carryInvalidationToRebuiltGraph(graph, affectedNodeIds, event) {
  const carried = [];
  for (const id of affectedNodeIds || []) {
    const node = graph.nodes?.[id];
    if (!node || TERMINAL.has(node.status)) continue;
    node.status = invalidatedStatus(node);
    node.lastValidatedRevision = event.revision;
    node.payload = {
      ...(node.payload || {}),
      invalidation: {
        eventId: event.id,
        eventType: event.type,
        revision: event.revision,
        changedNodeIds: [...event.changedNodeIds],
      },
    };
    carried.push(id);
  }
  return carried.sort();
}

export function summarizeInvalidation(graph, discovery) {
  const byPhase = {};
  for (const id of discovery?.affectedNodeIds || []) {
    const node = graph.nodes?.[id];
    if (!node || !Number.isInteger(node.phase)) continue;
    const phase = node.phase;
    byPhase[phase] ||= { nodeIds: [], questionIds: [] };
    byPhase[phase].nodeIds.push(id);
    if (node.type === NODE_TYPES.EVIDENCE && node.payload?.questionId) byPhase[phase].questionIds.push(node.payload.questionId);
  }
  for (const value of Object.values(byPhase)) {
    value.nodeIds = [...new Set(value.nodeIds)].sort();
    value.questionIds = [...new Set(value.questionIds)].sort();
  }
  return byPhase;
}
