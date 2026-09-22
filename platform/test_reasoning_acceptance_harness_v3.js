import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AXIS_CAUSAL_PAIRS,
  REQUIRED_MATCHED_PAIR_IDS,
  classifyShadowSnapshot,
  compareShadowPhase,
  evaluateAllAxisCausalSensitivity,
  evaluateMatchedPair,
  summarizeAcceptance,
} from './src/reasoning/evaluation/index.js';
import { CANONICAL_CONTEXT_AXES } from './src/reasoning/context/businessContextContract.js';
import { buildRuntimeReasoningGraph, discoverInvalidation } from './src/reasoning/engine/index.js';
import { validateReasoningGraph } from './src/reasoning/graph/index.js';
import { migrateAnswerRecords } from './src/services/interviewSchema.js';
import { buildEvidenceDerivedHandoff } from './src/projections/output/handoffProjection.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';
import { migrateLegacyStateToV3 } from './src/state/v3/migration.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

function context(overrides = {}, extra = {}) {
  const defaults = {
    customerModel: 'B2B',
    offerType: 'SERVICE',
    channelModel: 'ONLINE_FIRST',
    revenueModel: 'RETAINER',
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
  };
  return {
    schemaVersion: '3.0.0',
    taxonomyId: extra.taxonomyId || 'BT-EVAL',
    industryId: extra.industryId || 'IND-EVAL',
    primaryArchetype: extra.primaryArchetype || 'PROFESSIONAL_SERVICE',
    activeOverlays: extra.activeOverlays || [],
    confidence: 'USER_CONFIRMED',
    axes: { ...defaults, ...overrides },
  };
}

function genericPhaseData() {
  return {
    1: {
      description: 'کسب‌وکار نمونه با پیشنهاد مشخص و تیم محدود',
      diagnosticVision: 'کاهش اصطکاک مشتری و رشد قابل سنجش',
      stage: 'فعال',
      geography: 'ایران',
      primaryGoal: 'رشد فروش پایدار',
      coreOffer: 'راهکار اصلی کسب‌وکار',
      valueHypothesis: 'کاهش زمان و پیچیدگی برای مشتری',
      budgetConstraint: 'بودجه سه‌ماهه محدود و تیم کوچک',
    },
    2: {
      competitors: 'دو رقیب مستقیم با پیشنهاد مشابه',
      customerPain: 'فرایند فعلی زمان‌بر و پرخطاست',
      pricingModel: 'قیمت‌گذاری شفاف با دامنه مشخص',
      primaryChannel: 'ترکیب معرفی و کانال آنلاین',
      goldenOpportunity: 'اثبات نتیجه و تجربه ساده‌تر',
    },
    3: {
      targetSegment: 'مشتریانی با مسئله تکرارشونده و نیاز روشن',
      positioning: 'راهکار تخصصی و قابل اتکا برای مسئله اصلی',
      boundary: 'بدون وعده خارج از توان تحویل',
      promise: 'کاهش اصطکاک با فرایند قابل اندازه‌گیری',
    },
    4: {
      archetype: 'همیار متخصص',
      traits: 'روشن، دقیق و پاسخگو',
      toneGuardrail: 'بدون اغراق و ادعای اثبات‌نشده',
    },
    5: {
      voiceStyle: 'روشن و حرفه‌ای',
      elevatorHook: 'حل مسئله اصلی با فرایند ساده‌تر',
      forbiddenWords: 'تضمین صددرصد، بهترین بازار',
    },
    6: {
      naming: 'نام کوتاه و قابل تلفظ',
      tagline: 'تمرکز بر نتیجه قابل مشاهده',
    },
    7: {
      colorPalette: 'پالت خوانا و کاربردی',
      typography: 'تایپوگرافی فارسی خوانا',
      logoConcept: 'نشان ساده و مقیاس‌پذیر',
    },
    8: {
      thoughtLeadership: 'آموزش مسئله اصلی مشتری',
      prChannels: 'محتوای تخصصی و همکاری رسانه‌ای',
      leadFunnel: 'محتوا ← تماس ← ارزیابی ← خرید',
      reputationCrisis: 'پاسخ مستند، مسئول مشخص و پیگیری تا نتیجه',
    },
  };
}

function metadata(data, overrides = {}) {
  return {
    revision: 20,
    answerRecords: migrateAnswerRecords(data),
    completedPhases: { 1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true },
    phaseStatus: {},
    reviewRequired: {},
    contradictions: [],
    ...overrides,
  };
}

function financialMetadata(data, id, unitPrice, variableCost) {
  const answerRecords = migrateAnswerRecords(data);
  answerRecords.push({
    id,
    revision: 20,
    phase: 1,
    questionId: 'unit_economics',
    field: 'unitEconomics',
    label: 'قیمت و هزینه هر فروش',
    text: `قیمت ${unitPrice}، هزینه متغیر ${variableCost}`,
    questionText: 'قیمت و هزینه هر فروش',
    presentedQuestionId: 'unit_economics',
    optionValue: null,
    kind: 'FACT',
    status: 'ACTIVE',
    source: 'USER_STRUCTURED_FORM',
    structuredData: {
      type: 'unit_economics',
      version: 1,
      currency: 'TOMAN',
      unitLabel: 'سفارش',
      period: 'MONTH',
      isEstimate: false,
      unitPrice,
      variableCost,
      monthlyFixedCost: 1000,
      monthlySales: 50,
      monthlyCapacity: 100,
    },
  });
  return metadata(data, { answerRecords });
}

const baseData = genericPhaseData();

const b2b = context({ customerModel: 'B2B' });
const b2c = context({ customerModel: 'B2C', relationshipModel: 'REPEAT_HABITUAL' });
const recurring = context({ revenueModel: 'RECURRING', offerType: 'DIGITAL_PRODUCT' }, { primaryArchetype: 'SAAS_SOFTWARE' });
const project = context({ revenueModel: 'PROJECT_BASED', offerType: 'SERVICE' });
const normal = context({ regulatoryProfile: 'NORMAL' });
const regulated = context({ regulatoryProfile: 'HIGHLY_REGULATED' });
const founder = context({ founderRole: 'FOUNDER_LED' });
const nonPublic = context({ founderRole: 'NOT_PUBLIC' });
const micro = context({ scale: 'MICRO' });
const enterprise = context({ scale: 'ENTERPRISE' });
const localRetail = context({
  customerModel: 'B2C',
  offerType: 'PHYSICAL_PRODUCT',
  channelModel: 'PHYSICAL_FIRST',
  revenueModel: 'TRANSACTION',
  scale: 'MICRO',
  salesMotion: 'RETAIL',
  geography: 'CITY',
  branchStructure: 'SINGLE_LOCATION',
  founderRole: 'NOT_PUBLIC',
  purchaseCycle: 'SHORT_DAYS',
  relationshipModel: 'REPEAT_HABITUAL',
  regulatoryProfile: 'NORMAL',
  operationalComplexity: 'MODERATE',
}, { primaryArchetype: 'LOCAL_RETAIL' });
const b2bManufacturing = context({
  customerModel: 'B2B',
  offerType: 'PHYSICAL_PRODUCT',
  channelModel: 'DIRECT_SALES_B2B',
  revenueModel: 'PROJECT_BASED',
  scale: 'MEDIUM',
  salesMotion: 'FIELD_ENTERPRISE',
  geography: 'NATIONAL',
  branchStructure: 'SINGLE_LOCATION',
  founderRole: 'SUPPORTING',
  purchaseCycle: 'LONG_MONTHS',
  relationshipModel: 'ACCOUNT_MANAGED',
  regulatoryProfile: 'NORMAL',
  operationalComplexity: 'HIGH',
}, { primaryArchetype: 'MANUFACTURER' });

function requiredPairs() {
  return [
    evaluateMatchedPair({
      id: 'positive-vs-negative-unit-economics',
      left: {
        context: context({ customerModel: 'B2C', offerType: 'PHYSICAL_PRODUCT', revenueModel: 'TRANSACTION' }),
        phaseData: baseData,
        metadata: financialMetadata(baseData, 'ANS-UE-POS', 100, 40),
      },
      right: {
        context: context({ customerModel: 'B2C', offerType: 'PHYSICAL_PRODUCT', revenueModel: 'TRANSACTION' }),
        phaseData: baseData,
        metadata: financialMetadata(baseData, 'ANS-UE-NEG', 30, 40),
      },
      requiredDimensions: ['actions', 'substantiveOutput', 'calculations'],
    }),
    evaluateMatchedPair({
      id: 'b2b-vs-b2c',
      left: { context: b2b, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: b2c, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-CUSTOMER-B2C'],
      forbiddenRightModules: ['MOD-CUSTOMER-B2B'],
    }),
    evaluateMatchedPair({
      id: 'recurring-vs-project',
      left: { context: recurring, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: project, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-REV-PROJECT'],
      forbiddenRightModules: ['MOD-REV-RECURRING'],
    }),
    evaluateMatchedPair({
      id: 'normal-vs-highly-regulated',
      left: { context: normal, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: regulated, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'risks', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-REG-HIGH'],
    }),
    evaluateMatchedPair({
      id: 'founder-led-vs-non-public',
      left: { context: founder, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: nonPublic, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-FOUNDER-INSTITUTIONAL'],
      forbiddenRightModules: ['MOD-FOUNDER-PUBLIC'],
    }),
    evaluateMatchedPair({
      id: 'micro-vs-enterprise',
      left: { context: micro, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: enterprise, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-SCALE-ENTERPRISE'],
      forbiddenRightModules: ['MOD-SCALE-MICRO'],
    }),
    evaluateMatchedPair({
      id: 'local-retail-vs-b2b-manufacturing',
      left: { context: localRetail, phaseData: baseData, metadata: metadata(baseData) },
      right: { context: b2bManufacturing, phaseData: baseData, metadata: metadata(baseData) },
      requiredDimensions: ['modules', 'topology', 'evidence', 'metrics', 'risks', 'substantiveOutput'],
      forbiddenLeftModules: ['MOD-CUSTOMER-B2B', 'MOD-SALES-TENDER', 'MOD-REV-RECURRING'],
      forbiddenRightModules: ['MOD-CUSTOMER-B2C', 'MOD-GEO-LOCAL'],
    }),
  ];
}

test('all 15 canonical axes show causal sensitivity, not wording-only adaptation', () => {
  assert.deepEqual(new Set(Object.keys(AXIS_CAUSAL_PAIRS)), new Set(CANONICAL_CONTEXT_AXES));
  const result = evaluateAllAxisCausalSensitivity();
  const failures = result.results.filter(item => !item.pass).map(item => ({
    axis: item.axis,
    values: [item.leftValue, item.rightValue],
    deltas: Object.fromEntries(Object.entries(item.dimensions).map(([key, value]) => [key, value.delta])),
  }));
  assert.equal(result.total, 15);
  assert.equal(result.passedCount, 15, JSON.stringify(failures, null, 2));
  assert.equal(result.passed, true);
});

test('all seven required matched pairs create substantive causal differences with no protected-domain leakage', () => {
  const pairs = requiredPairs();
  assert.deepEqual(new Set(pairs.map(pair => pair.id)), new Set(REQUIRED_MATCHED_PAIR_IDS));
  const failures = pairs.filter(pair => !pair.pass).map(pair => ({
    id: pair.id,
    missingDimensions: pair.missingDimensions,
    leakage: pair.leakage,
    invariantFailures: pair.invariantFailures,
    score: pair.causalDifferentiationScore,
  }));
  assert.equal(pairs.every(pair => pair.pass), true, JSON.stringify(failures, null, 2));
});

test('positive versus negative unit economics changes action rule and calculated output, not business topology', () => {
  const pair = requiredPairs().find(item => item.id === 'positive-vs-negative-unit-economics');
  assert.ok(pair.left.actionRuleIds.includes('validate_unit_margin'));
  assert.ok(pair.right.actionRuleIds.includes('repair_unit_margin'));
  assert.equal(pair.dimensions.modules.delta, 0);
  assert.equal(pair.dimensions.topology.delta, 0);
  assert.ok(pair.dimensions.actions.delta > 0);
  assert.ok(pair.dimensions.calculations.delta > 0);
  assert.ok(pair.dimensions.substantiveOutput.delta > 0);
});

test('shadow mode reports expected improvement for specialized contexts and detects malformed v3 projection as regression', () => {
  const scenarios = [
    ['b2b-phase2', b2b, 2],
    ['b2c-phase2', b2c, 2],
    ['recurring-phase1', recurring, 1],
    ['project-phase1', project, 1],
    ['regulated-phase2', regulated, 2],
    ['founder-phase4', founder, 4],
    ['enterprise-phase1', enterprise, 1],
    ['local-retail-phase2', localRetail, 2],
    ['manufacturing-phase2', b2bManufacturing, 2],
  ];
  const results = scenarios.map(([id, ctx, phase]) => compareShadowPhase({ id, context: ctx, phase }));
  assert.equal(results.some(result => result.verdict === 'REGRESSION'), false, JSON.stringify(results, null, 2));
  assert.ok(results.some(result => result.verdict === 'EXPECTED_IMPROVEMENT'));

  const malformed = classifyShadowSnapshot({
    phase: 2,
    legacy: { title: 'legacy', instruction: 'legacy', metrics: ['x'], risks: [] },
    v3: {
      title: 'v3', instruction: '', moduleIds: ['MOD-X'], decisionNodeIds: [],
      evidenceRequirements: [], metrics: [], risks: [], gates: [], outputSections: [],
      knowledgeDependencies: [],
    },
  }, { id: 'synthetic-regression' });
  assert.equal(malformed.verdict, 'REGRESSION');
  assert.ok(malformed.regressionReasons.includes('ACTIVE_MODULE_WITHOUT_DECISION_NODE'));
});

test('graph invariant and mutation layer preserve unrelated evidence during exact invalidation', () => {
  const records = migrateAnswerRecords(baseData);
  const built = buildRuntimeReasoningGraph({
    projectId: 'ACCEPTANCE-GRAPH',
    revision: 20,
    businessContext: recurring,
    answerRecords: records,
  });
  const validation = validateReasoningGraph(built.graph);
  assert.equal(validation.valid, true, validation.errors.join('\n'));

  const pricingNode = built.indexes.answerNodeByQuestionId.p2_step2_pricing_models;
  const channelNode = built.indexes.answerNodeByQuestionId.p2_step3_primary_channel;
  const discovery = discoverInvalidation(built.graph, [pricingNode]);
  assert.ok(discovery.affectedQuestionIds.includes('p3_target_segment'));
  assert.equal(discovery.affectedNodeIds.includes(channelNode), false, 'independent channel evidence must survive pricing edit');
});

test('handoff layer never invents missing upstream values', () => {
  const records = migrateAnswerRecords(baseData);
  const handoff = buildEvidenceDerivedHandoff({
    targetPhase: 3,
    phaseData: baseData,
    answerRecords: records,
    businessContext: b2b,
  });
  assert.ok(handoff.sourceAnswerIds.length > 0);
  assert.ok(handoff.sourceAnswerIds.every(id => handoff.message.includes(id)));

  const missing = structuredClone(baseData);
  delete missing[2].customerPain;
  const missingHandoff = buildEvidenceDerivedHandoff({
    targetPhase: 3,
    phaseData: missing,
    answerRecords: migrateAnswerRecords(missing),
    businessContext: b2b,
  });
  assert.ok(missingHandoff.missingFields.includes('customerPain'));
  assert.match(missingHandoff.message, /UNKNOWN/);
});

test('semantic Master has no broken or duplicate Claim refs and preserves stale certainty', () => {
  const meta = metadata(baseData);
  const master = generateDeliverable('master', baseData, recurring, [], [], [], meta);
  const sectionRefs = master.sections.flatMap(section => section.claimIds || []);
  assert.equal(new Set(sectionRefs).size, sectionRefs.length);
  assert.ok(sectionRefs.every(id => master.claimLedger[id]));

  const records = migrateAnswerRecords(baseData);
  const stale = records.find(record => record.questionId === 'p3_target_segment');
  const staleMaster = generateDeliverable('master', baseData, recurring, [], [], [], metadata(baseData, {
    answerRecords: records,
    phaseStatus: { 3: 'INVALIDATED' },
    reviewRequired: { 3: ['p3_target_segment'] },
  }));
  const staleClaim = Object.values(staleMaster.claimLedger).find(claim => claim.evidenceIds?.includes(stale.id));
  assert.ok(staleClaim);
  assert.equal(staleClaim.status, 'NEEDS_REVIEW');
  assert.notEqual(staleClaim.status, 'CONFIRMED');
});

test('state migration remains deterministic and preserves unknown legacy fields', () => {
  const legacy = {
    revision: 3,
    currentPhase: 2,
    currentStepIndex: 1,
    phaseData: { 1: { coreOffer: 'پیشنهاد قدیمی' }, 2: {} },
    answerRecords: [{
      id: 'ANS-LEGACY-1', revision: 1, phase: 1, questionId: 'step2_core_offer',
      field: 'coreOffer', text: 'پیشنهاد قدیمی', kind: 'FACT', status: 'ACTIVE', source: 'USER_TEXT',
    }],
    businessContext: { axes: b2b.axes },
    customUnmappedPayload: { mustSurvive: true },
  };
  const options = { fromSchemaVersion: 2, migratedAt: '2026-09-22T21:00:00.000Z' };
  const first = migrateLegacyStateToV3(legacy, options);
  const second = migrateLegacyStateToV3(legacy, options);
  assert.deepEqual(first, second);
  assert.deepEqual(first.report.droppedPaths, []);
  assert.ok(Object.values(first.state.ledgers.legacyRecords).some(record =>
    record.path === 'customUnmappedPayload' && record.value.mustSurvive === true
  ));
});

test('knowledge provenance hard invariants remain green inside the reasoning acceptance harness', () => {
  const sources = readJson('wiki/source-registry.json').sources;
  const claims = readJson('wiki/claims.json').claims;
  const retrieval = readJson('wiki/generated/retrieval-index.json');
  const migration = readJson('wiki/migration/retrieval-parity-report.json');

  const decisionClaims = Object.values(claims).filter(claim => claim.decision_driving);
  const brokenSources = decisionClaims.flatMap(claim => claim.source_ids.filter(id => !sources[id]));
  const traceFailures = decisionClaims.filter(claim => {
    const located = new Set((claim.locators || []).filter(item => item.locator).map(item => item.source_id));
    return !claim.source_ids.length || claim.source_ids.some(id => !located.has(id));
  });

  assert.deepEqual(brokenSources, []);
  assert.deepEqual(traceFailures, []);
  assert.equal(retrieval.count, retrieval.entries.length);
  assert.equal(migration.silently_dropped_legacy_chunks, 0);
});

test('aggregate reasoning-v3 acceptance report passes hard gates and keeps 753 compatibility separate', () => {
  const axisResults = evaluateAllAxisCausalSensitivity();
  const pairResults = requiredPairs();
  const shadowContexts = [
    ['b2b-phase2', b2b, 2],
    ['b2c-phase2', b2c, 2],
    ['regulated-phase2', regulated, 2],
    ['founder-phase4', founder, 4],
    ['enterprise-phase1', enterprise, 1],
    ['local-retail-phase2', localRetail, 2],
    ['manufacturing-phase2', b2bManufacturing, 2],
  ];
  const shadowResults = shadowContexts.map(([id, ctx, phase]) => compareShadowPhase({ id, context: ctx, phase }));

  const invariantFailures = [];
  const sources = readJson('wiki/source-registry.json').sources;
  const claims = readJson('wiki/claims.json').claims;
  if (Object.values(claims).some(claim => claim.source_ids.some(id => !sources[id]))) invariantFailures.push('BROKEN_SOURCE_REF');
  if (readJson('wiki/migration/retrieval-parity-report.json').silently_dropped_legacy_chunks !== 0) invariantFailures.push('SILENT_MIGRATION_LOSS');

  const report = summarizeAcceptance({ axisResults, pairResults, shadowResults, invariantFailures });
  assert.equal(report.passed, true, JSON.stringify(report, null, 2));
  assert.equal(report.axis.passedCount, 15);
  assert.equal(report.matchedPairs.required, 7);
  assert.deepEqual(report.matchedPairs.failed, []);
  assert.deepEqual(report.shadow.regressions, []);

  const printable = {
    ...report,
    compatibilityCoverage: {
      suite: 'simulate_753_businesses.js',
      role: 'SEPARATE_COMPATIBILITY_COVERAGE_NOT_STRATEGIC_QUALITY_SCORE',
    },
    matchedPairScores: Object.fromEntries(pairResults.map(pair => [pair.id, pair.causalDifferentiationScore])),
  };
  console.log('[REASONING_V3_ACCEPTANCE]', JSON.stringify(printable));
});
