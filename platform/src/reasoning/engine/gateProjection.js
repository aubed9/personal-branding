import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphNode,
} from '../graph/index.js';
import { makeNodeId } from '../graph/ids.js';

export function materializePhaseExitGate(graph, phase, gateResult, { revision = graph.revision } = {}) {
  const p = Number(phase);
  if (!Number.isInteger(p) || p < 1 || p > 8) throw new Error(`Invalid phase: ${phase}`);
  const stableKey = `PHASE-${p}-EXIT`;
  const id = makeNodeId(NODE_TYPES.GATE, stableKey);
  const status = gateResult?.passed ? ENTITY_STATUS.CONFIRMED : ENTITY_STATUS.BLOCKED;

  if (!graph.nodes[id]) {
    addGraphNode(graph, {
      id,
      type: NODE_TYPES.GATE,
      stableKey,
      phase: p,
      status,
      payload: {
        gateId: `GATE-PHASE-${p}-EXIT`,
        kind: 'PHASE_EXIT_GATE',
        requiredForCompletion: true,
        legacyBridge: true,
        result: gateResult || null,
      },
      createdRevision: revision,
      lastValidatedRevision: revision,
    }, { bumpRevision: false });
  } else {
    graph.nodes[id].status = status;
    graph.nodes[id].lastValidatedRevision = revision;
    graph.nodes[id].payload = {
      ...(graph.nodes[id].payload || {}),
      result: gateResult || null,
      requiredForCompletion: true,
      kind: 'PHASE_EXIT_GATE',
    };
  }
  return graph.nodes[id];
}

function contradictionBlocksPhase(graph, phase) {
  const blockers = [];
  for (const node of Object.values(graph.nodes || {})) {
    if (node.type !== NODE_TYPES.CONTRADICTION || node.status !== ENTITY_STATUS.ACTIVE) continue;
    for (const edgeId of graph.indexes?.outgoing?.[node.id] || []) {
      const edge = graph.edges[edgeId];
      if (edge?.type !== EDGE_TYPES.BLOCKS) continue;
      const target = graph.nodes[edge.to];
      if (target?.phase === phase) {
        blockers.push({ contradictionNodeId: node.id, targetNodeId: target.id });
      }
    }
  }
  return blockers;
}

export function derivePhaseCompletion(graph, phase) {
  const p = Number(phase);
  const phaseNodes = Object.values(graph?.nodes || {}).filter(node => node.phase === p && ![
    ENTITY_STATUS.DEPRECATED,
    ENTITY_STATUS.SUPERSEDED,
    ENTITY_STATUS.NOT_APPLICABLE,
  ].includes(node.status));

  const requiredGates = phaseNodes.filter(node => node.type === NODE_TYPES.GATE && node.payload?.requiredForCompletion === true);
  const phaseExitGate = requiredGates.find(node => node.payload?.kind === 'PHASE_EXIT_GATE') || null;

  const staleOrReview = phaseNodes.filter(node =>
    [ENTITY_STATUS.STALE, ENTITY_STATUS.NEEDS_REVIEW, ENTITY_STATUS.BLOCKED].includes(node.status) &&
    (node.type === NODE_TYPES.EVIDENCE || node.type === NODE_TYPES.GATE || node.payload?.requiredForCompletion === true)
  );
  const contradictionBlocks = contradictionBlocksPhase(graph, p);

  const requiredGateFailures = requiredGates.filter(node => node.status !== ENTITY_STATUS.CONFIRMED);
  const authoritative = Boolean(phaseExitGate);
  const passed = authoritative &&
    requiredGateFailures.length === 0 &&
    staleOrReview.length === 0 &&
    contradictionBlocks.length === 0;

  return {
    phase: p,
    authoritative,
    passed,
    phaseExitGateId: phaseExitGate?.id || null,
    requiredGateIds: requiredGates.map(node => node.id).sort(),
    blockingNodeIds: [...new Set([
      ...requiredGateFailures.map(node => node.id),
      ...staleOrReview.map(node => node.id),
      ...contradictionBlocks.map(item => item.targetNodeId),
    ])].sort(),
    contradictionBlocks,
  };
}

export function projectPhaseCompletionCache(graph, completedPhases = {}) {
  const result = { ...completedPhases };
  for (let phase = 1; phase <= 8; phase++) {
    const projection = derivePhaseCompletion(graph, phase);
    if (projection.authoritative) result[phase] = projection.passed;
  }
  return result;
}
