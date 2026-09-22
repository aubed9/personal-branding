import test from 'node:test';
import assert from 'node:assert/strict';

import { createReasoningGraph, validateReasoningGraph } from './src/reasoning/graph/index.js';
import {
  CANONICAL_CONTEXT_AXES,
  CONTEXT_AXIS_VALUES,
} from './src/reasoning/context/businessContextContract.js';
import {
  AXIS_PHASE_EFFECTS,
  EFFECT_KIND,
  composeDecisionModules,
  contributeDecisionModulesToGraph,
  getPhaseModuleProjection,
  resolveActiveDecisionModules,
  toCanonicalModuleContext,
  validateAxisPhaseEffects,
  validateDecisionModuleRegistry,
} from './src/reasoning/modules/index.js';
import { DECISION_MODULES } from './src/reasoning/modules/registry.js';
import { getPhaseAdaptationRules } from './src/data/businessContextRouter.js';

function makeContext(overrides = {}, extra = {}) {
  const axes = Object.fromEntries(CANONICAL_CONTEXT_AXES.map(axis => [axis, 'UNKNOWN']));
  for (const [axis, value] of Object.entries(overrides)) axes[axis] = value;
  return {
    schemaVersion: '3.0.0',
    primaryArchetype: extra.primaryArchetype || null,
    taxonomyId: extra.taxonomyId || null,
    industryId: extra.industryId || null,
    activeOverlays: extra.activeOverlays || [],
    confidence: extra.confidence || 'USER_CONFIRMED',
    axes,
    ...extra,
  };
}

test('all 15 axes have explicit effects for all 8 phases', () => {
  const validation = validateAxisPhaseEffects();
  assert.equal(validation.valid, true, validation.errors.join('\n'));
  assert.equal(CANONICAL_CONTEXT_AXES.length, 15);

  for (const axis of CANONICAL_CONTEXT_AXES) {
    assert.ok(AXIS_PHASE_EFFECTS[axis], `missing axis contract for ${axis}`);
    assert.equal(Object.keys(AXIS_PHASE_EFFECTS[axis]).length, 8);
    for (let phase = 1; phase <= 8; phase++) {
      const effect = AXIS_PHASE_EFFECTS[axis][phase];
      assert.ok(Object.values(EFFECT_KIND).includes(effect.kind));
      assert.ok(effect.reason.length > 10);
    }
  }
});

test('Decision Module registry is contract-valid and every module declares causal dependencies', () => {
  const validation = validateDecisionModuleRegistry();
  assert.equal(validation.valid, true, validation.errors.join('\n'));
  assert.ok(DECISION_MODULES.length >= 15);

  assert.deepEqual(
    new Set(DECISION_MODULES.map(module => module.axis)),
    new Set(CANONICAL_CONTEXT_AXES),
    'every canonical axis must have at least one executable Decision Module'
  );

  for (const module of DECISION_MODULES) {
    assert.ok(module.prerequisites.length > 0, `${module.id} missing prerequisites`);
    assert.ok(module.decisionNodes.length > 0, `${module.id} missing Decision Nodes`);
    assert.ok(module.evidenceRequirements.length > 0, `${module.id} missing evidence requirements`);
    assert.ok(module.outputSections.length > 0, `${module.id} missing output sections`);
    assert.ok(module.knowledgeDependencies.length > 0, `${module.id} missing knowledge dependencies`);
    assert.equal(module.invalidationEdges.length, module.decisionNodes.length, `${module.id} must invalidate each Decision Node on axis change`);
  }
});

test('every migrated specialization has a positive activation and a negative no-leakage case', () => {
  for (const module of DECISION_MODULES) {
    const positiveContext = makeContext({ [module.axis]: module.values[0] });
    const positiveIds = resolveActiveDecisionModules(positiveContext).map(item => item.id);
    assert.ok(positiveIds.includes(module.id), `${module.id} did not activate on ${module.axis}=${module.values[0]}`);

    const negativeValue = CONTEXT_AXIS_VALUES[module.axis].find(value => value !== 'UNKNOWN' && !module.values.includes(value));
    assert.ok(negativeValue, `test requires a negative value for ${module.id}`);
    const negativeContext = makeContext({ [module.axis]: negativeValue });
    const negativeIds = resolveActiveDecisionModules(negativeContext).map(item => item.id);
    assert.equal(negativeIds.includes(module.id), false, `${module.id} leaked into ${module.axis}=${negativeValue}`);
  }
});

test('B2B recurring regulated online context composes modules additively', () => {
  const context = makeContext({
    customerModel: 'B2B',
    offerType: 'DIGITAL_PRODUCT',
    channelModel: 'ONLINE_FIRST',
    revenueModel: 'RECURRING',
    maturity: 'ACTIVE',
    scale: 'MEDIUM',
    salesMotion: 'FIELD_ENTERPRISE',
    geography: 'NATIONAL',
    branchStructure: 'SINGLE_LOCATION',
    founderRole: 'FOUNDER_LED',
    purchaseCycle: 'LONG_MONTHS',
    relationshipModel: 'CONTRACTUAL_RETAINER',
    regulatoryProfile: 'HIGHLY_REGULATED',
    operationalComplexity: 'MODERATE',
    brandArchitecture: 'STANDALONE',
  });

  const composition = composeDecisionModules(context);
  for (const expected of [
    'MOD-CUSTOMER-B2B',
    'MOD-REV-RECURRING',
    'MOD-CHANNEL-ONLINE',
    'MOD-REG-HIGH',
    'MOD-FOUNDER-PUBLIC',
    'MOD-SALES-TENDER',
    'MOD-CYCLE-LONG',
    'MOD-REL-RECURRING',
  ]) {
    assert.ok(composition.moduleIds.includes(expected), `missing additive module ${expected}`);
  }
  assert.equal(composition.moduleIds.includes('MOD-CUSTOMER-B2C'), false);
  assert.equal(composition.moduleIds.includes('MOD-REV-PROJECT'), false);
  assert.ok(composition.decisionNodes.some(node => node.id === 'DN-B2B-DMU'));
  assert.ok(composition.decisionNodes.some(node => node.id === 'DN-REC-RETENTION'));
  assert.ok(composition.decisionNodes.some(node => node.id === 'DN-REG-MESSAGING'));
});

test('local B2C transactional retail does not inherit B2B or recurring topology', () => {
  const composition = composeDecisionModules(makeContext({
    customerModel: 'B2C',
    offerType: 'PHYSICAL_PRODUCT',
    channelModel: 'PHYSICAL_FIRST',
    revenueModel: 'TRANSACTION',
    maturity: 'ACTIVE',
    scale: 'MICRO',
    salesMotion: 'RETAIL',
    geography: 'CITY',
    branchStructure: 'SINGLE_LOCATION',
    founderRole: 'NOT_PUBLIC',
    purchaseCycle: 'SHORT_DAYS',
    relationshipModel: 'REPEAT_HABITUAL',
    regulatoryProfile: 'NORMAL',
    operationalComplexity: 'MODERATE',
    brandArchitecture: 'STANDALONE',
  }));

  for (const expected of ['MOD-CUSTOMER-B2C', 'MOD-REV-TRANSACTION', 'MOD-CHANNEL-PHYSICAL', 'MOD-GEO-LOCAL', 'MOD-SCALE-MICRO']) {
    assert.ok(composition.moduleIds.includes(expected), `missing local retail module ${expected}`);
  }
  for (const forbidden of ['MOD-CUSTOMER-B2B', 'MOD-REV-RECURRING', 'MOD-SALES-TENDER', 'MOD-REG-HIGH']) {
    assert.equal(composition.moduleIds.includes(forbidden), false, `cross-domain module leak: ${forbidden}`);
  }
});

test('project manufacturing topology differs materially from recurring SaaS with similar generic context', () => {
  const base = {
    customerModel: 'B2B',
    channelModel: 'ONLINE_FIRST',
    maturity: 'ACTIVE',
    scale: 'MEDIUM',
    geography: 'NATIONAL',
    branchStructure: 'SINGLE_LOCATION',
    founderRole: 'SUPPORTING',
    purchaseCycle: 'LONG_MONTHS',
    relationshipModel: 'ACCOUNT_MANAGED',
    regulatoryProfile: 'NORMAL',
    operationalComplexity: 'HIGH',
    brandArchitecture: 'STANDALONE',
  };
  const project = composeDecisionModules(makeContext({
    ...base,
    offerType: 'PHYSICAL_PRODUCT',
    revenueModel: 'PROJECT_BASED',
    salesMotion: 'FIELD_ENTERPRISE',
  }));
  const recurring = composeDecisionModules(makeContext({
    ...base,
    offerType: 'DIGITAL_PRODUCT',
    revenueModel: 'RECURRING',
    salesMotion: 'FIELD_ENTERPRISE',
  }));

  assert.ok(project.moduleIds.includes('MOD-REV-PROJECT'));
  assert.equal(project.moduleIds.includes('MOD-REV-RECURRING'), false);
  assert.ok(recurring.moduleIds.includes('MOD-REV-RECURRING'));
  assert.equal(recurring.moduleIds.includes('MOD-REV-PROJECT'), false);

  const projectDecisionIds = new Set(project.decisionNodes.map(node => node.id));
  const recurringDecisionIds = new Set(recurring.decisionNodes.map(node => node.id));
  assert.ok([...projectDecisionIds].some(id => !recurringDecisionIds.has(id)), 'project topology should add unique Decision Nodes');
  assert.ok([...recurringDecisionIds].some(id => !projectDecisionIds.has(id)), 'recurring topology should add unique Decision Nodes');
});

test('founder-role and scale matched pairs switch substantive modules rather than wording', () => {
  const common = {
    customerModel: 'B2B',
    offerType: 'SERVICE',
    channelModel: 'ONLINE_FIRST',
    revenueModel: 'RETAINER',
    maturity: 'ACTIVE',
    salesMotion: 'INBOUND',
    geography: 'NATIONAL',
    branchStructure: 'SINGLE_LOCATION',
    purchaseCycle: 'MEDIUM_WEEKS',
    relationshipModel: 'CONTRACTUAL_RETAINER',
    regulatoryProfile: 'NORMAL',
    operationalComplexity: 'MODERATE',
    brandArchitecture: 'STANDALONE',
  };

  const founder = composeDecisionModules(makeContext({ ...common, founderRole: 'FOUNDER_LED', scale: 'MICRO' }));
  const institutional = composeDecisionModules(makeContext({ ...common, founderRole: 'NOT_PUBLIC', scale: 'ENTERPRISE' }));

  assert.ok(founder.moduleIds.includes('MOD-FOUNDER-PUBLIC'));
  assert.ok(founder.moduleIds.includes('MOD-SCALE-MICRO'));
  assert.equal(founder.moduleIds.includes('MOD-FOUNDER-INSTITUTIONAL'), false);

  assert.ok(institutional.moduleIds.includes('MOD-FOUNDER-INSTITUTIONAL'));
  assert.ok(institutional.moduleIds.includes('MOD-SCALE-ENTERPRISE'));
  assert.equal(institutional.moduleIds.includes('MOD-FOUNDER-PUBLIC'), false);
});

test('user-confirmed axes take precedence over conflicting legacy convenience fields', () => {
  const context = makeContext({ customerModel: 'B2B' }, { customerModel: 'B2C', confidence: 'USER_CONFIRMED' });
  const canonical = toCanonicalModuleContext(context);
  assert.equal(canonical.axes.customerModel, 'B2B');

  const ids = resolveActiveDecisionModules(canonical).map(module => module.id);
  assert.ok(ids.includes('MOD-CUSTOMER-B2B'));
  assert.equal(ids.includes('MOD-CUSTOMER-B2C'), false);
});

test('module contributions create a valid graph with all 15 context nodes and typed causal edges', () => {
  const context = makeContext({
    customerModel: 'B2B',
    offerType: 'DIGITAL_PRODUCT',
    channelModel: 'ONLINE_FIRST',
    revenueModel: 'RECURRING',
    maturity: 'ACTIVE',
    scale: 'MEDIUM',
    salesMotion: 'FIELD_ENTERPRISE',
    geography: 'NATIONAL',
    branchStructure: 'SINGLE_LOCATION',
    founderRole: 'FOUNDER_LED',
    purchaseCycle: 'LONG_MONTHS',
    relationshipModel: 'CONTRACTUAL_RETAINER',
    regulatoryProfile: 'REGULATED',
    operationalComplexity: 'MODERATE',
    brandArchitecture: 'STANDALONE',
  });
  const graph = createReasoningGraph({ projectId: 'PRJ-MODULE-TEST' });
  const { composition, contributed } = contributeDecisionModulesToGraph(graph, context);

  assert.equal(Object.keys(contributed.contextNodeIds).length, 15);
  assert.equal(validateReasoningGraph(graph).valid, true);
  assert.ok(contributed.decisionNodeIds.length > 0);
  assert.ok(composition.moduleIds.length > 5);

  const activationEdges = Object.values(graph.edges).filter(edge => edge.type === 'ACTIVATES');
  const invalidationEdges = Object.values(graph.edges).filter(edge => edge.type === 'INVALIDATES');
  assert.ok(activationEdges.length >= contributed.decisionNodeIds.length);
  assert.ok(invalidationEdges.length >= contributed.decisionNodeIds.length);
  for (const edge of activationEdges) {
    assert.ok(graph.nodes[edge.from]);
    assert.ok(graph.nodes[edge.to]);
  }
});

test('phase projections expose different module/KPI/risk/evidence sets by context', () => {
  const b2bRecurring = makeContext({
    customerModel: 'B2B', revenueModel: 'RECURRING', regulatoryProfile: 'REGULATED',
    channelModel: 'ONLINE_FIRST', salesMotion: 'FIELD_ENTERPRISE', purchaseCycle: 'LONG_MONTHS',
  });
  const b2cLocal = makeContext({
    customerModel: 'B2C', revenueModel: 'TRANSACTION', regulatoryProfile: 'NORMAL',
    channelModel: 'PHYSICAL_FIRST', geography: 'CITY', scale: 'MICRO',
  });

  const a = getPhaseModuleProjection(b2bRecurring, 2);
  const b = getPhaseModuleProjection(b2cLocal, 2);

  assert.notDeepEqual(a.moduleIds, b.moduleIds);
  assert.notDeepEqual(a.metrics, b.metrics);
  assert.notDeepEqual(a.evidenceRequirements, b.evidenceRequirements);
  assert.ok(a.moduleIds.includes('MOD-CUSTOMER-B2B'));
  assert.ok(b.moduleIds.includes('MOD-CUSTOMER-B2C'));
});

test('current businessContextRouter exposes v3 module projection without removing legacy fields', () => {
  const context = makeContext({
    customerModel: 'B2B',
    offerType: 'DIGITAL_PRODUCT',
    channelModel: 'ONLINE_FIRST',
    revenueModel: 'RECURRING',
    maturity: 'ACTIVE',
    scale: 'MEDIUM',
    salesMotion: 'FIELD_ENTERPRISE',
    geography: 'NATIONAL',
    branchStructure: 'SINGLE_LOCATION',
    founderRole: 'FOUNDER_LED',
    purchaseCycle: 'LONG_MONTHS',
    relationshipModel: 'CONTRACTUAL_RETAINER',
    regulatoryProfile: 'REGULATED',
    operationalComplexity: 'MODERATE',
    brandArchitecture: 'STANDALONE',
  }, { primaryArchetype: 'SAAS_SOFTWARE' });

  const rules = getPhaseAdaptationRules(2, context);
  assert.equal(typeof rules.title, 'string');
  assert.equal(typeof rules.instruction, 'string');
  assert.ok(Array.isArray(rules.kpis));
  assert.ok(Array.isArray(rules.risks));

  assert.ok(rules.decisionModules.includes('MOD-CUSTOMER-B2B'));
  assert.ok(rules.decisionModules.includes('MOD-REV-RECURRING'));
  assert.ok(rules.decisionModules.includes('MOD-REG-HIGH'));
  assert.ok(rules.decisionNodes.some(node => node.id === 'DN-REC-RETENTION'));
  assert.ok(rules.evidenceRequirements.includes('RETENTION_COHORT'));
  assert.equal(typeof rules.v3Instruction, 'string');
  assert.ok(rules.v3Instruction.includes('تمرکز تصمیمی'));
});
