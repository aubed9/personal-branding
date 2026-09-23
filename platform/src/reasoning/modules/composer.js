import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphEdge,
  addGraphNode,
} from '../graph/index.js';
import { makeNodeId } from '../graph/ids.js';
import { resolveActiveDecisionModules } from './registry.js';
import { toCanonicalModuleContext } from './contextAdapter.js';

const uniqSorted = values => [...new Set(values.filter(Boolean))].sort();

export function composeDecisionModules(context) {
  const canonicalContext = toCanonicalModuleContext(context);
  const modules = resolveActiveDecisionModules(canonicalContext);
  const decisionNodes = new Map();
  const metrics = new Set();
  const risks = new Set();
  const evidenceRequirements = new Set();
  const calculations = new Set();
  const outputSections = new Set();
  const gates = new Set();
  const knowledgeDependencies = new Set();
  const sourceDependencies = new Set();
  const prerequisites = new Set();
  const invalidationEdges = [];

  for (const module of modules) {
    for (const node of module.decisionNodes) {
      const existing = decisionNodes.get(node.id);
      if (existing && (existing.phase !== node.phase || existing.title !== node.title)) {
        throw new Error(`Incompatible duplicate Decision Node contribution: ${node.id}`);
      }
      decisionNodes.set(node.id, existing
        ? { ...existing, moduleIds: uniqSorted([...existing.moduleIds, module.id]) }
        : { ...node, moduleIds: [module.id] });
    }
    module.metrics.forEach(value => metrics.add(value));
    module.risks.forEach(value => risks.add(value));
    module.evidenceRequirements.forEach(value => evidenceRequirements.add(value));
    module.calculations.forEach(value => calculations.add(value));
    module.outputSections.forEach(value => outputSections.add(value));
    module.gates.forEach(value => gates.add(value));
    module.knowledgeDependencies.forEach(value => knowledgeDependencies.add(value));
    module.sourceDependencies.forEach(value => sourceDependencies.add(value));
    module.prerequisites.forEach(value => prerequisites.add(value));
    invalidationEdges.push(...module.invalidationEdges.map(edge => ({ ...edge, moduleId: module.id })));
  }

  return {
    context: canonicalContext,
    modules,
    moduleIds: modules.map(module => module.id),
    decisionNodes: [...decisionNodes.values()].sort((a, b) => a.phase - b.phase || a.id.localeCompare(b.id)),
    metrics: [...metrics].sort(),
    risks: [...risks].sort(),
    evidenceRequirements: [...evidenceRequirements].sort(),
    calculations: [...calculations].sort(),
    outputSections: [...outputSections].sort(),
    gates: [...gates].sort(),
    knowledgeDependencies: [...knowledgeDependencies].sort(),
    sourceDependencies: [...sourceDependencies].sort(),
    prerequisites: [...prerequisites].sort(),
    invalidationEdges,
  };
}

function addOrReuseNode(graph, spec) {
  const expected = makeNodeId(spec.type, spec.stableKey);
  if (graph.nodes?.[expected]) return graph.nodes[expected];
  return addGraphNode(graph, spec);
}

export function contributeDecisionModulesToGraph(graph, context) {
  const composition = composeDecisionModules(context);
  const contextNodes = {};
  const classificationNodes = {};

  for (const [axis, value] of Object.entries(composition.context.axes)) {
    const node = addOrReuseNode(graph, {
      type: NODE_TYPES.CONTEXT_AXIS_VALUE,
      stableKey: { axis, value },
      status: value === 'UNKNOWN' ? ENTITY_STATUS.NEEDS_REVIEW : ENTITY_STATUS.CONFIRMED,
      payload: { axis, value },
    });
    contextNodes[axis] = node.id;
  }

  const classificationSpecs = [
    ['BUSINESS_TYPE', 'businessTypeId'],
    ['INDUSTRY', 'industryId'],
    ['ARCHETYPE', 'primaryArchetype'],
  ];
  for (const [dimension, key] of classificationSpecs) {
    const value = composition.context[key] || 'UNKNOWN';
    const node = addOrReuseNode(graph, {
      type: NODE_TYPES.CONTEXT_AXIS_VALUE,
      stableKey: { dimension, value },
      status: value === 'UNKNOWN' ? ENTITY_STATUS.NEEDS_REVIEW : ENTITY_STATUS.CONFIRMED,
      payload: { dimension, key, value, classification: true },
    });
    classificationNodes[dimension] = node.id;
  }

  const contributed = {
    contextNodeIds: { ...contextNodes },
    classificationNodeIds: { ...classificationNodes },
    moduleNodeIds: {},
    decisionNodeIds: [],
    calculationNodeIds: [],
    riskNodeIds: [],
    sectionNodeIds: [],
    gateNodeIds: [],
  };

  for (const module of composition.modules) {
    const activationNodeIds = (module.contextDimensions || ['AXIS'])
      .map(dimension => dimension === 'AXIS' ? contextNodes[module.axis] : classificationNodes[dimension])
      .filter(Boolean);
    if (!activationNodeIds.length) throw new Error(`No activation dependency nodes for ${module.id}`);
    contributed.moduleNodeIds[module.id] = [];

    for (const decision of module.decisionNodes) {
      const node = addOrReuseNode(graph, {
        type: NODE_TYPES.DECISION_NODE,
        stableKey: decision.id,
        status: ENTITY_STATUS.ACTIVE,
        phase: decision.phase,
        moduleId: module.id,
        payload: {
          decisionNodeId: decision.id,
          title: decision.title,
          evidenceRequirements: module.evidenceRequirements,
          metrics: module.metrics,
          knowledgeDependencies: module.knowledgeDependencies,
          sourceDependencies: module.sourceDependencies,
          prerequisites: module.prerequisites,
          invalidationEdges: module.invalidationEdges,
          contributingModules: composition.decisionNodes.find(item => item.id === decision.id)?.moduleIds || [module.id],
        },
      });
      contributed.decisionNodeIds.push(node.id);
      contributed.moduleNodeIds[module.id].push(node.id);
      for (const activationNodeId of activationNodeIds) {
        const activationNode = graph.nodes[activationNodeId];
        const dimension = activationNode?.payload?.dimension || 'AXIS';
        addGraphEdge(graph, {
          type: EDGE_TYPES.ACTIVATES,
          from: activationNodeId,
          to: node.id,
          qualifier: module.id,
          metadata: {
            contextDimension: dimension,
            axis: module.axis,
            axisValue: composition.context.axes[module.axis],
            businessTypeId: composition.context.businessTypeId || null,
            industryId: composition.context.industryId || null,
            primaryArchetype: composition.context.primaryArchetype || null,
          },
        });
        addGraphEdge(graph, {
          type: EDGE_TYPES.INVALIDATES,
          from: activationNodeId,
          to: node.id,
          qualifier: module.id,
          metadata: {
            cause: dimension === 'AXIS' ? 'AXIS_VALUE_CHANGED' : `${dimension}_CHANGED`,
            contextDimension: dimension,
            axis: module.axis,
          },
        });
      }

      for (const calculation of module.calculations) {
        const calcNode = addOrReuseNode(graph, {
          type: NODE_TYPES.CALCULATION,
          stableKey: { moduleId: module.id, calculation, phase: decision.phase },
          status: ENTITY_STATUS.ACTIVE,
          phase: decision.phase,
          moduleId: module.id,
          payload: { calculationId: calculation },
        });
        contributed.calculationNodeIds.push(calcNode.id);
        addGraphEdge(graph, {
          type: EDGE_TYPES.DERIVES,
          from: node.id,
          to: calcNode.id,
          qualifier: module.id,
        });
      }

      for (const risk of module.risks) {
        const riskNode = addOrReuseNode(graph, {
          type: NODE_TYPES.RISK,
          stableKey: { moduleId: module.id, risk, phase: decision.phase },
          status: ENTITY_STATUS.ACTIVE,
          phase: decision.phase,
          moduleId: module.id,
          payload: { riskId: risk },
        });
        contributed.riskNodeIds.push(riskNode.id);
        addGraphEdge(graph, {
          type: EDGE_TYPES.INFLUENCES,
          from: node.id,
          to: riskNode.id,
          qualifier: module.id,
        });
      }

      for (const section of module.outputSections) {
        const sectionNode = addOrReuseNode(graph, {
          type: NODE_TYPES.OUTPUT_SECTION,
          stableKey: { moduleId: module.id, section, phase: decision.phase },
          status: ENTITY_STATUS.PROVISIONAL,
          phase: decision.phase,
          moduleId: module.id,
          payload: { sectionType: section },
        });
        contributed.sectionNodeIds.push(sectionNode.id);
        addGraphEdge(graph, {
          type: EDGE_TYPES.DERIVES,
          from: node.id,
          to: sectionNode.id,
          qualifier: module.id,
        });
      }

      for (const gate of module.gates) {
        const gateNode = addOrReuseNode(graph, {
          type: NODE_TYPES.GATE,
          stableKey: { moduleId: module.id, gate, phase: decision.phase },
          status: ENTITY_STATUS.ACTIVE,
          phase: decision.phase,
          moduleId: module.id,
          payload: { gateId: gate },
        });
        contributed.gateNodeIds.push(gateNode.id);
        addGraphEdge(graph, {
          type: EDGE_TYPES.REQUIRES,
          from: node.id,
          to: gateNode.id,
          qualifier: module.id,
        });
      }
    }
  }

  for (const key of ['decisionNodeIds', 'calculationNodeIds', 'riskNodeIds', 'sectionNodeIds', 'gateNodeIds']) {
    contributed[key] = uniqSorted(contributed[key]);
  }
  for (const moduleId of Object.keys(contributed.moduleNodeIds)) {
    contributed.moduleNodeIds[moduleId] = uniqSorted(contributed.moduleNodeIds[moduleId]);
  }

  return { composition, contributed };
}

export function getPhaseModuleProjection(context, phase) {
  const p = Number(phase);
  const composition = composeDecisionModules(context);
  const modules = composition.modules.filter(module => module.phases.includes(p));
  const decisionNodes = composition.decisionNodes.filter(node => node.phase === p);
  return {
    phase: p,
    moduleIds: modules.map(module => module.id),
    decisionNodes,
    evidenceRequirements: uniqSorted(modules.flatMap(module => module.evidenceRequirements)),
    metrics: uniqSorted(modules.flatMap(module => module.metrics)),
    risks: uniqSorted(modules.flatMap(module => module.risks)),
    outputSections: uniqSorted(modules.flatMap(module => module.outputSections)),
    gates: uniqSorted(modules.flatMap(module => module.gates)),
    knowledgeDependencies: uniqSorted(modules.flatMap(module => module.knowledgeDependencies)),
    sourceDependencies: uniqSorted(modules.flatMap(module => module.sourceDependencies)),
    prerequisites: uniqSorted(modules.flatMap(module => module.prerequisites)),
    invalidationEdges: modules.flatMap(module => module.invalidationEdges.map(edge => ({ ...edge, moduleId: module.id }))),
  };
}


export function renderPhaseModuleInstruction(context, phase) {
  const projection = getPhaseModuleProjection(context, phase);
  if (projection.decisionNodes.length === 0) {
    return {
      title: `فاز ${projection.phase} — بدون ماژول تخصصی فعال`,
      instruction: '',
      projection,
    };
  }

  const decisions = projection.decisionNodes.map(node => node.title).join('؛ ');
  const evidence = projection.evidenceRequirements.length
    ? `شواهد موردنیاز: ${projection.evidenceRequirements.join('، ')}.`
    : '';
  const gates = projection.gates.length
    ? `گیت‌های فعال: ${projection.gates.join('، ')}.`
    : '';

  return {
    title: `فاز ${projection.phase} — تصمیم‌های تخصصی فعال`,
    instruction: [`تمرکز تصمیمی این فاز: ${decisions}.`, evidence, gates].filter(Boolean).join(' '),
    projection,
  };
}
