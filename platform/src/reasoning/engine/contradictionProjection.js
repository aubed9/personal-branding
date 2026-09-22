import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphEdge,
  addGraphNode,
  getReachableNodeIds,
} from '../graph/index.js';
import { makeNodeId } from '../graph/ids.js';

const BLOCK_TRAVERSAL = Object.freeze([
  EDGE_TYPES.INVALIDATES,
  EDGE_TYPES.SUPPORTS,
  EDGE_TYPES.DERIVES,
  EDGE_TYPES.INFLUENCES,
  EDGE_TYPES.REQUIRES,
]);

const isBlocking = contradiction =>
  contradiction &&
  contradiction.resolutionStatus === 'UNRESOLVED' &&
  ['CRITICAL', 'MAJOR'].includes(contradiction.severity);

export function projectContradictionsToGraph(graph, contradictions = [], answerNodeByQuestionId = {}) {
  const projected = [];

  for (const contradiction of contradictions.filter(isBlocking)) {
    const stableKey = contradiction.ruleId || contradiction.id;
    const nodeId = makeNodeId(NODE_TYPES.CONTRADICTION, stableKey);
    if (!graph.nodes[nodeId]) {
      addGraphNode(graph, {
        id: nodeId,
        type: NODE_TYPES.CONTRADICTION,
        stableKey,
        status: ENTITY_STATUS.ACTIVE,
        phase: null,
        payload: {
          contradictionId: contradiction.id,
          ruleId: contradiction.ruleId || null,
          severity: contradiction.severity,
          resolutionQuestion: contradiction.resolutionQuestion || '',
        },
      }, { bumpRevision: false });
    }

    const directlyTargeted = [];
    const allBlocked = new Set();

    for (const [phaseRaw, questionId] of Object.entries(contradiction.resolutionTargets || {})) {
      const targetId = answerNodeByQuestionId[questionId];
      if (!targetId || !graph.nodes[targetId]) continue;
      directlyTargeted.push(targetId);
      allBlocked.add(targetId);

      const reachable = getReachableNodeIds(graph, targetId, {
        edgeTypes: BLOCK_TRAVERSAL,
        includeStart: false,
      });
      for (const id of reachable) {
        const target = graph.nodes[id];
        const expectedPhase = Number(phaseRaw);
        // Direct graph causality is authoritative. affectedPhases is only a legacy hint;
        // phase match is used here only to avoid unrelated branches from a shared evidence node.
        if (!Number.isInteger(expectedPhase) || target?.phase === expectedPhase || target?.phase > expectedPhase) {
          allBlocked.add(id);
        }
      }
    }

    for (const targetId of [...allBlocked].sort()) {
      const target = graph.nodes[targetId];
      if (!target) continue;
      addGraphEdge(graph, {
        type: EDGE_TYPES.BLOCKS,
        from: nodeId,
        to: targetId,
        qualifier: contradiction.ruleId || contradiction.id,
        metadata: {
          contradictionId: contradiction.id,
          severity: contradiction.severity,
          direct: directlyTargeted.includes(targetId),
        },
      }, { bumpRevision: false });
    }

    projected.push({
      contradictionId: contradiction.id,
      nodeId,
      directTargetNodeIds: directlyTargeted.sort(),
      blockedNodeIds: [...allBlocked].sort(),
    });
  }

  return projected;
}
