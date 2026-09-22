import test from 'node:test';
import assert from 'node:assert/strict';

import { NODE_TYPES, ENTITY_STATUS, validateReasoningGraph } from './src/reasoning/graph/index.js';
import {
  CHANGE_EVENT_TYPES,
  applyInvalidation,
  buildRuntimeReasoningGraph,
  createChangeEvent,
  derivePhaseCompletion,
  discoverInvalidation,
  projectPhaseCompletionCache,
} from './src/reasoning/engine/index.js';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

function context(overrides = {}) {
  return {
    schemaVersion: '3.0.0',
    primaryArchetype: 'SAAS_SOFTWARE',
    activeOverlays: [],
    confidence: 'USER_CONFIRMED',
    axes: {
      customerModel: 'B2B',
      offerType: 'DIGITAL_PRODUCT',
      channelModel: 'ONLINE_FIRST',
      revenueModel: 'RECURRING',
      maturity: 'ACTIVE',
      scale: 'SMALL',
      salesMotion: 'INBOUND',
      geography: 'NATIONAL',
      branchStructure: 'SINGLE_LOCATION',
      founderRole: 'SUPPORTING',
      purchaseCycle: 'MEDIUM_WEEKS',
      relationshipModel: 'CONTRACTUAL_RETAINER',
      regulatoryProfile: 'NORMAL',
      operationalComplexity: 'MODERATE',
      brandArchitecture: 'STANDALONE',
      ...overrides,
    },
  };
}

function answer(id, revision, phase, questionId, field, text, kind = 'FACT', optionValue = null) {
  return {
    id, revision, phase, questionId, field, text, kind, optionValue,
    label: questionId, status: 'ACTIVE', source: 'USER_TEXT',
  };
}

test('question mutation invalidates only graph-reachable answered dependents', () => {
  const answers = [
    answer('ANS-1', 1, 1, 'unit_economics', 'unitEconomics', 'اقتصاد واحد ثبت شد'),
    answer('ANS-2', 2, 2, 'p2_step1_customer_pain', 'customerPain', 'حساسیت به قیمت', 'ASSUMPTION'),
    answer('ANS-3', 3, 2, 'p2_step2_pricing_models', 'pricingModel', 'قیمت‌گذاری فعلی', 'DECISION'),
    answer('ANS-4', 4, 2, 'p2_step3_primary_channel', 'primaryChannel', 'ورودی ارگانیک', 'DECISION'),
    answer('ANS-5', 5, 2, 'p2_step4_golden_opportunity', 'goldenOpportunity', 'فرصت فعلی', 'ASSUMPTION'),
    answer('ANS-6', 6, 3, 'p3_target_segment', 'targetSegment', 'شرکت متوسط', 'DECISION'),
    answer('ANS-7', 7, 3, 'p3_positioning_frame', 'positioning', 'ساده و سریع', 'DECISION'),
  ];

  const built = buildRuntimeReasoningGraph({
    projectId: 'TEST',
    revision: 7,
    businessContext: context(),
    answerRecords: answers,
  });
  const pricingNode = built.indexes.answerNodeByQuestionId.p2_step2_pricing_models;
  const discovery = discoverInvalidation(built.graph, [pricingNode]);

  const affectedQuestions = new Set(discovery.affectedQuestionIds);
  assert.ok(affectedQuestions.has('p2_step4_golden_opportunity'));
  assert.ok(affectedQuestions.has('p3_target_segment'));
  assert.ok(affectedQuestions.has('p3_positioning_frame'));
  assert.equal(affectedQuestions.has('p2_step3_primary_channel'), false, 'independent channel answer must survive pricing edit');
  assert.equal(affectedQuestions.has('unit_economics'), false, 'upstream evidence must never be invalidated by its dependent');

  const channelNode = built.graph.nodes[built.indexes.answerNodeByQuestionId.p2_step3_primary_channel];
  assert.equal(channelNode.status, ENTITY_STATUS.CONFIRMED);

  const event = createChangeEvent({
    type: CHANGE_EVENT_TYPES.ANSWER_CHANGED,
    projectId: 'TEST',
    revision: 8,
    changedNodeIds: [pricingNode],
    changedEntityIds: ['ANS-3', 'ANS-8'],
  });
  applyInvalidation(built.graph, event, discovery);

  assert.equal(built.graph.nodes[built.indexes.answerNodeByQuestionId.p3_target_segment].status, ENTITY_STATUS.NEEDS_REVIEW);
  assert.equal(built.graph.nodes[built.indexes.answerNodeByQuestionId.p2_step3_primary_channel].status, ENTITY_STATUS.CONFIRMED);
});

test('axis mutation follows explicit axis-question edges rather than whole-phase invalidation', () => {
  const answers = [
    answer('ANS-1', 1, 1, 'unit_economics', 'unitEconomics', 'اعداد مالی'),
    answer('ANS-2', 2, 2, 'p2_step0_competitors', 'competitors', 'رقبای تهران'),
    answer('ANS-3', 3, 2, 'p2_step3_primary_channel', 'primaryChannel', 'فروش آنلاین', 'DECISION'),
    answer('ANS-4', 4, 2, 'p2_step2_pricing_models', 'pricingModel', 'قیمت ثابت', 'DECISION'),
  ];
  const built = buildRuntimeReasoningGraph({
    projectId: 'TEST-GEO',
    revision: 4,
    businessContext: context({ geography: 'CITY' }),
    answerRecords: answers,
  });
  const geoNode = built.indexes.contextNodeByAxis.geography;
  const discovery = discoverInvalidation(built.graph, [geoNode]);
  const affected = new Set(discovery.affectedQuestionIds);

  assert.ok(affected.has('p2_step0_competitors'));
  assert.ok(affected.has('p2_step3_primary_channel'));
  assert.equal(affected.has('unit_economics'), false);
  assert.equal(affected.has('p2_step2_pricing_models'), false);
});

test('critical contradiction blocks only direct/reachable graph targets', () => {
  const answers = [
    answer('ANS-1', 1, 2, 'p2_step2_pricing_models', 'pricingModel', 'ارزان‌ترین قیمت', 'DECISION'),
    answer('ANS-2', 2, 2, 'p2_step3_primary_channel', 'primaryChannel', 'فروش حضوری', 'DECISION'),
    answer('ANS-3', 3, 3, 'p3_target_segment', 'targetSegment', 'مشتری عمومی', 'DECISION'),
    answer('ANS-4', 4, 3, 'p3_positioning_frame', 'positioning', 'برند لوکس', 'DECISION'),
  ];
  const contradictions = [{
    id: 'CTR-1',
    ruleId: 'price_position',
    severity: 'MAJOR',
    resolutionStatus: 'UNRESOLVED',
    resolutionTargets: { 2: 'p2_step2_pricing_models', 3: 'p3_positioning_frame' },
    affectedPhases: [2, 3, 8],
    resolutionQuestion: 'قیمت یا جایگاه را اصلاح کنید.',
  }];

  const built = buildRuntimeReasoningGraph({
    projectId: 'TEST-CTR',
    revision: 4,
    businessContext: context(),
    answerRecords: answers,
    contradictions,
  });

  const contradictionNode = Object.values(built.graph.nodes).find(node =>
    node.type === NODE_TYPES.CONTRADICTION && node.payload?.contradictionId === 'CTR-1'
  );
  assert.ok(contradictionNode);

  const blockedTargets = (built.graph.indexes.outgoing[contradictionNode.id] || [])
    .map(id => built.graph.edges[id])
    .filter(edge => edge.type === 'BLOCKS')
    .map(edge => edge.to);

  assert.ok(blockedTargets.includes(built.indexes.answerNodeByQuestionId.p2_step2_pricing_models));
  assert.ok(blockedTargets.includes(built.indexes.answerNodeByQuestionId.p3_positioning_frame));
  assert.equal(blockedTargets.includes(built.indexes.answerNodeByQuestionId.p2_step3_primary_channel), false);
});

test('phase completion is projected from graph gate state, not an independent boolean', () => {
  const passedGraph = buildRuntimeReasoningGraph({
    projectId: 'TEST-GATE',
    revision: 1,
    businessContext: context(),
    phaseGateResults: { 1: { passed: true, blockingReasons: [] } },
  }).graph;
  const passed = derivePhaseCompletion(passedGraph, 1);
  assert.equal(passed.authoritative, true);
  assert.equal(passed.passed, true);

  const cache = projectPhaseCompletionCache(passedGraph, { 1: false });
  assert.equal(cache[1], true, 'graph projection must override stale false cache');

  const blockedGraph = buildRuntimeReasoningGraph({
    projectId: 'TEST-GATE-2',
    revision: 1,
    businessContext: context(),
    phaseGateResults: { 1: { passed: false, blockingReasons: ['missing'] } },
  }).graph;
  assert.equal(derivePhaseCompletion(blockedGraph, 1).passed, false);
});

test('graph rebuild is deterministic for identical runtime inputs', () => {
  const args = {
    projectId: 'TEST-DETERMINISM',
    revision: 9,
    businessContext: context(),
    answerRecords: [
      answer('ANS-1', 1, 1, 'step2_core_offer', 'coreOffer', 'نرم‌افزار'),
      answer('ANS-2', 2, 2, 'p2_step1_customer_pain', 'customerPain', 'اتلاف وقت'),
    ],
    reviewRequired: { 2: ['p2_step1_customer_pain'] },
    phaseGateResults: { 1: { passed: true, blockingReasons: [] } },
  };
  const a = buildRuntimeReasoningGraph(args).graph;
  const b = buildRuntimeReasoningGraph(args).graph;
  assert.deepEqual(a, b);
  assert.equal(validateReasoningGraph(a).valid, true);
});

test('Orchestrator edits use precise graph invalidation and keep unrelated completed phase cache intact', () => {
  const engine = new OrchestratorEngine();
  engine.businessContext = context();
  engine.currentPhase = 2;
  engine.phaseData[2] = {
    customerPain: 'حساسیت به قیمت',
    pricingModel: 'قیمت ثابت',
    primaryChannel: 'ورودی ارگانیک',
    goldenOpportunity: 'سادگی خرید',
  };
  engine.phaseData[3] = {
    targetSegment: 'شرکت متوسط',
    positioning: 'ساده و سریع',
  };
  engine.answerRecords = [
    answer('ANS-1', 1, 2, 'p2_step1_customer_pain', 'customerPain', 'حساسیت به قیمت', 'ASSUMPTION'),
    answer('ANS-2', 2, 2, 'p2_step2_pricing_models', 'pricingModel', 'قیمت ثابت', 'DECISION'),
    answer('ANS-3', 3, 2, 'p2_step3_primary_channel', 'primaryChannel', 'ورودی ارگانیک', 'DECISION'),
    answer('ANS-4', 4, 2, 'p2_step4_golden_opportunity', 'goldenOpportunity', 'سادگی خرید', 'ASSUMPTION'),
    answer('ANS-5', 5, 3, 'p3_target_segment', 'targetSegment', 'شرکت متوسط', 'DECISION'),
    answer('ANS-6', 6, 3, 'p3_positioning_frame', 'positioning', 'ساده و سریع', 'DECISION'),
  ];
  engine.revision = 6;
  engine.completedPhases[4] = true;
  engine._syncReasoningGraphV3();

  const result = engine.processUserResponse('قیمت‌گذاری پلکانی', 'tiered_offer', { questionId: 'p2_step2_pricing_models' });
  assert.ok(result);

  assert.ok(engine.reviewRequired[2]?.includes('p2_step4_golden_opportunity'));
  assert.equal(engine.reviewRequired[2]?.includes('p2_step3_primary_channel') || false, false);
  assert.ok(engine.reviewRequired[3]?.includes('p3_target_segment'));
  assert.ok(engine.reasoningChangeEvents.length >= 1);
  assert.equal(engine.completedPhases[4], true, 'unrelated phase cache must not be broadly invalidated');
});

test('legacy broad invalidation is retained only as an explicit migration fallback', () => {
  const engine = new OrchestratorEngine();
  engine.completedPhases[2] = true;
  engine.completedPhases[3] = true;
  const result = engine.invalidateDependentPhases(1);
  assert.equal(result.mode, 'LEGACY_MIGRATION_FALLBACK');
});
