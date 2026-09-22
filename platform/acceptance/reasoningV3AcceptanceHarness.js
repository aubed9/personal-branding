import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateReasoningGraph, createReasoningGraph } from '../src/reasoning/graph/index.js';
import {
  composeDecisionModules,
  contributeDecisionModulesToGraph,
} from '../src/reasoning/modules/index.js';
import { buildCanonicalOutputClaims } from '../src/projections/output/claims.js';
import { auditOutputModel } from '../src/projections/output/audit.js';
import { migrateAnswerRecords } from '../src/services/interviewSchema.js';
import { getPhaseAdaptationRules } from '../src/data/businessContextRouter.js';
import { migrateLegacyStateToV3 } from '../src/state/v3/migration.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const json = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const clone = value => JSON.parse(JSON.stringify(value));
const sorted = values => [...new Set(values)].sort();

export const HARD_INVARIANTS = Object.freeze([
  'BROKEN_GRAPH_REFS_ZERO',
  'BROKEN_KNOWLEDGE_REFS_ZERO',
  'INVENTED_HANDOFF_VALUES_ZERO',
  'STALE_CONFIRMED_LEAKAGE_ZERO',
  'ILLEGAL_CERTAINTY_UPGRADES_ZERO',
  'PROTECTED_CROSS_DOMAIN_LEAKAGE_ZERO',
  'SILENT_MIGRATION_DATA_LOSS_ZERO',
  'REACHABILITY_MUTATION_PASS',
  'MATCHED_PAIR_CAUSAL_PASS',
  'DECISION_CLAIM_PROVENANCE_100',
]);

export function baseContext(overrides = {}) {
  return {
    taxonomyId: overrides.taxonomyId || 'BT-HARNESS',
    industryId: overrides.industryId || 'IND-HARNESS',
    primaryArchetype: overrides.primaryArchetype || 'GENERIC',
    archetype: overrides.primaryArchetype || 'GENERIC',
    confidence: 'USER_CONFIRMED',
    activeOverlays: [],
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
      ...(overrides.axes || {}),
    },
  };
}

export function commonPhaseData() {
  return {
    1: {
      description: 'کسب‌وکار نمونه برای آزمون علت و معلولی',
      diagnosticVision: 'رشد سودآور با شواهد قابل ردیابی',
      stage: 'فعال',
      geography: 'ایران',
      primaryGoal: 'رشد سودآور',
      coreOffer: 'پیشنهاد اصلی',
      valueHypothesis: 'کاهش اصطکاک مشتری',
      budgetConstraint: 'بودجه محدود و مشخص',
    },
    2: {
      competitors: 'رقبای مستقیم و جایگزین',
      customerPain: 'اتلاف زمان و عدم اطمینان',
      pricingModel: 'قیمت‌گذاری فعلی',
      primaryChannel: 'کانال اصلی',
      goldenOpportunity: 'کاهش اصطکاک خرید',
    },
    3: {
      targetSegment: 'مشتری هدف نمونه',
      positioning: 'انتخاب ساده و قابل اتکا',
      boundary: 'بدون وعده خارج از توان تحویل',
      promise: 'تحویل قابل سنجش',
    },
    4: { archetype: 'متخصص', traits: 'روشن و پاسخگو', toneGuardrail: 'بدون اغراق' },
    5: { voiceStyle: 'روشن و حرفه‌ای', elevatorHook: 'ارزش روشن', forbiddenWords: 'تضمین مطلق' },
    6: { naming: 'نام روشن', tagline: 'وعده قابل اثبات' },
    7: { colorPalette: 'سیستم رنگی خوانا', typography: 'تایپوگرافی خوانا', logoConcept: 'نشان ساده' },
    8: {
      thoughtLeadership: 'محتوای تخصصی',
      prChannels: 'کانال‌های مرتبط',
      leadFunnel: 'آگاهی ← بررسی ← اقدام',
      reputationCrisis: 'پاسخ مستند',
    },
  };
}

function metadataFor(data, overrides = {}) {
  return {
    revision: 20,
    answerRecords: migrateAnswerRecords(data),
    completedPhases: { 1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true },
    phaseStatus: {},
    reviewRequired: {},
    contradictions: [],
    ...overrides,
  };
}

function compositionFingerprint(context) {
  const composition = composeDecisionModules(context);
  return {
    modules: composition.moduleIds,
    decisions: composition.decisionNodes.map(node => node.id),
    evidence: composition.evidenceRequirements,
    metrics: composition.metrics,
    risks: composition.risks,
    gates: composition.gates,
    sections: composition.outputSections,
  };
}

function outputFingerprint(context, data = commonPhaseData(), metadata = null) {
  const meta = metadata || metadataFor(data);
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context,
    unknowns: meta.unknowns || [],
    contradictions: meta.contradictions || [],
    metadata: meta,
  });
  return {
    model,
    claims: model.claims
      .filter(claim => !['SUPERSEDED', 'NOT_APPLICABLE'].includes(claim.status))
      .map(claim => [claim.claimType, claim.ruleId || '', claim.moduleId || '', claim.statement])
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    proposals: sorted(model.claims.filter(c => c.claimType === 'PROPOSAL').map(c => c.ruleId)),
  };
}

function setDelta(a, b) {
  const aa = new Set(a), bb = new Set(b);
  return {
    onlyA: [...aa].filter(x => !bb.has(x)).sort(),
    onlyB: [...bb].filter(x => !aa.has(x)).sort(),
  };
}

function comparePair(id, aContext, bContext, { expectedA = [], expectedB = [] } = {}) {
  const a = compositionFingerprint(aContext);
  const b = compositionFingerprint(bContext);
  const moduleDelta = setDelta(a.modules, b.modules);
  const decisionDelta = setDelta(a.decisions, b.decisions);
  const metricDelta = setDelta(a.metrics, b.metrics);
  const riskDelta = setDelta(a.risks, b.risks);
  const gateDelta = setDelta(a.gates, b.gates);
  const outA = outputFingerprint(aContext);
  const outB = outputFingerprint(bContext);
  const outputChanged = JSON.stringify(outA.claims) !== JSON.stringify(outB.claims);

  const expectedOk =
    expectedA.every(moduleId => a.modules.includes(moduleId) && !b.modules.includes(moduleId)) &&
    expectedB.every(moduleId => b.modules.includes(moduleId) && !a.modules.includes(moduleId));

  return {
    id,
    passed:
      expectedOk &&
      (moduleDelta.onlyA.length + moduleDelta.onlyB.length > 0) &&
      (decisionDelta.onlyA.length + decisionDelta.onlyB.length > 0) &&
      outputChanged,
    moduleDelta,
    decisionDelta,
    metricDelta,
    riskDelta,
    gateDelta,
    outputChanged,
    expectedOk,
  };
}

function economicsMetadata(data, { unitPrice, variableCost, monthlyFixedCost = 1000, monthlySales = 20, monthlyCapacity = 100 }) {
  const records = migrateAnswerRecords(data);
  const existing = records.find(record => record.questionId === 'unit_economics');
  const record = existing || {
    id: 'ANS-HARNESS-ECON',
    revision: 1,
    phase: 1,
    questionId: 'unit_economics',
    field: 'unitEconomics',
    text: 'فرم اقتصاد واحد',
    kind: 'FACT',
    status: 'ACTIVE',
    source: 'USER_FORM',
  };
  record.structuredData = {
    type: 'unit_economics',
    version: 1,
    currency: 'TOMAN',
    unitLabel: 'واحد',
    period: 'MONTH',
    isEstimate: false,
    unitPrice,
    variableCost,
    monthlyFixedCost,
    monthlySales,
    monthlyCapacity,
  };
  if (!existing) records.push(record);
  return metadataFor(data, { answerRecords: records });
}

function economicsPair() {
  const context = baseContext({ axes: { revenueModel: 'TRANSACTION' } });
  const data = commonPhaseData();
  const positive = outputFingerprint(context, data, economicsMetadata(data, { unitPrice: 100, variableCost: 40 }));
  const negative = outputFingerprint(context, data, economicsMetadata(data, { unitPrice: 40, variableCost: 100 }));
  const delta = setDelta(positive.proposals, negative.proposals);
  return {
    id: 'positive-vs-negative-unit-economics',
    passed:
      positive.proposals.includes('validate_unit_margin') &&
      negative.proposals.includes('repair_unit_margin') &&
      !positive.proposals.includes('repair_unit_margin') &&
      delta.onlyA.length + delta.onlyB.length > 0,
    positiveProposalRules: positive.proposals,
    negativeProposalRules: negative.proposals,
    proposalDelta: delta,
  };
}

function graphInvariantAudit() {
  const context = baseContext({
    axes: {
      customerModel: 'B2B',
      revenueModel: 'RECURRING',
      regulatoryProfile: 'REGULATED',
      founderRole: 'FOUNDER_LED',
    },
  });
  const graph = createReasoningGraph({ projectId: 'HARNESS-GRAPH' });
  const contribution = contributeDecisionModulesToGraph(graph, context);
  const validation = validateReasoningGraph(graph);
  const brokenEdges = Object.values(graph.edges).filter(edge => !graph.nodes[edge.from] || !graph.nodes[edge.to]);
  return {
    passed: validation.valid && brokenEdges.length === 0 && Object.keys(contribution.contributed.contextNodeIds).length === 15,
    validationErrors: validation.errors,
    brokenEdgeCount: brokenEdges.length,
    nodeCount: Object.keys(graph.nodes).length,
    edgeCount: Object.keys(graph.edges).length,
  };
}

function outputInvariantAudit() {
  const data = commonPhaseData();
  const context = baseContext({
    axes: {
      customerModel: 'B2B',
      revenueModel: 'RECURRING',
      regulatoryProfile: 'REGULATED',
      founderRole: 'FOUNDER_LED',
    },
  });
  const { model } = outputFingerprint(context, data);
  return auditOutputModel(model, { specializedContext: true });
}

function knowledgeInvariantAudit() {
  const sources = json('wiki/source-registry.json').sources;
  const claims = json('wiki/claims.json').claims;
  const retrieval = json('wiki/generated/retrieval-index.json');
  const admissible = new Set(['VERIFIED', 'CANONICAL']);
  const decisionClaims = Object.values(claims).filter(claim => claim.decision_driving && admissible.has(claim.status));
  const traceable = decisionClaims.filter(claim =>
    claim.source_ids?.length > 0 &&
    claim.source_ids.every(id => sources[id] && admissible.has(sources[id].status))
  );
  const brokenSourceRefs = Object.values(claims).flatMap(claim =>
    (claim.source_ids || []).filter(id => !sources[id]).map(id => [claim.id, id])
  );
  const brokenClaimRefs = (retrieval.entries || []).filter(entry => !claims[entry.claim_id]);
  const manualOriginLeakage = (retrieval.entries || []).filter(entry =>
    !entry.claim_id || !entry.knowledge_node_id || !(entry.source_ids || []).length
  );
  return {
    passed:
      brokenSourceRefs.length === 0 &&
      brokenClaimRefs.length === 0 &&
      manualOriginLeakage.length === 0 &&
      traceable.length === decisionClaims.length,
    decisionDrivingClaimCount: decisionClaims.length,
    traceableDecisionClaimCount: traceable.length,
    traceabilityRate: decisionClaims.length ? traceable.length / decisionClaims.length : 1,
    brokenSourceRefs,
    brokenClaimRefCount: brokenClaimRefs.length,
    manualOriginLeakageCount: manualOriginLeakage.length,
  };
}

function migrationInvariantAudit() {
  const legacy = {
    revision: 3,
    currentPhase: 2,
    currentStepIndex: 1,
    phaseData: { 1: { coreOffer: 'نمونه' }, 2: { customerPain: 'نمونه درد' } },
    answerRecords: [
      { id:'ANS-1', revision:1, phase:1, questionId:'step2_core_offer', field:'coreOffer', text:'نمونه', kind:'FACT', status:'ACTIVE', source:'USER_TEXT' },
      { id:'ANS-2', revision:2, phase:2, questionId:'p2_step1_customer_pain', field:'customerPain', text:'نمونه درد', kind:'ASSUMPTION', status:'ACTIVE', source:'USER_TEXT' },
    ],
    facts: [],
    decisions: [],
    assumptions: [],
    unknowns: [],
    contradictions: [],
    businessContext: baseContext(),
    customUnmapped: { preserved: true },
  };
  const options = { fromSchemaVersion: 2, migratedAt: '2026-09-22T00:00:00.000Z' };
  const a = migrateLegacyStateToV3(clone(legacy), options);
  const b = migrateLegacyStateToV3(clone(legacy), options);
  const preserved = Object.values(a.state.ledgers.legacyRecords).some(record =>
    record.path === 'customUnmapped' && record.value?.preserved === true
  );
  return {
    passed: JSON.stringify(a) === JSON.stringify(b) && preserved && a.report.droppedPaths.length === 0,
    deterministic: JSON.stringify(a) === JSON.stringify(b),
    preservedUnmapped: preserved,
    droppedPaths: a.report.droppedPaths,
  };
}

function shadowAudit() {
  const pairs = [
    ['b2b-b2c',
      baseContext({ axes: { customerModel:'B2B' } }),
      baseContext({ axes: { customerModel:'B2C' } })],
    ['recurring-project',
      baseContext({ axes: { revenueModel:'RECURRING' } }),
      baseContext({ axes: { revenueModel:'PROJECT_BASED' } })],
  ];
  return pairs.map(([id, a, b]) => {
    const legacyA = getPhaseAdaptationRules(2, a);
    const legacyB = getPhaseAdaptationRules(2, b);
    return {
      id,
      passed:
        Boolean(legacyA?.title && legacyB?.title) &&
        Array.isArray(legacyA?.decisionModules) &&
        Array.isArray(legacyB?.decisionModules) &&
        JSON.stringify(legacyA.decisionModules) !== JSON.stringify(legacyB.decisionModules),
      legacyCompatibilityPresent: Boolean(legacyA?.title && legacyA?.instruction && legacyB?.title && legacyB?.instruction),
      v3ModulesA: legacyA?.decisionModules || [],
      v3ModulesB: legacyB?.decisionModules || [],
    };
  });
}

export function runReasoningV3AcceptanceHarness() {
  const matchedPairs = [
    economicsPair(),
    comparePair(
      'b2b-vs-b2c',
      baseContext({ axes: { customerModel:'B2B' } }),
      baseContext({ axes: { customerModel:'B2C' } }),
      { expectedA:['MOD-CUSTOMER-B2B'], expectedB:['MOD-CUSTOMER-B2C'] }
    ),
    comparePair(
      'recurring-vs-project',
      baseContext({ axes: { revenueModel:'RECURRING' } }),
      baseContext({ axes: { revenueModel:'PROJECT_BASED' } }),
      { expectedA:['MOD-REV-RECURRING'], expectedB:['MOD-REV-PROJECT'] }
    ),
    comparePair(
      'normal-vs-highly-regulated',
      baseContext({ axes: { regulatoryProfile:'NORMAL' } }),
      baseContext({ axes: { regulatoryProfile:'HIGHLY_REGULATED' } }),
      { expectedA:[], expectedB:['MOD-REG-HIGH'] }
    ),
    comparePair(
      'founder-led-vs-non-public',
      baseContext({ axes: { founderRole:'FOUNDER_LED' } }),
      baseContext({ axes: { founderRole:'NOT_PUBLIC' } }),
      { expectedA:['MOD-FOUNDER-PUBLIC'], expectedB:['MOD-FOUNDER-INSTITUTIONAL'] }
    ),
    comparePair(
      'micro-vs-enterprise',
      baseContext({ axes: { scale:'MICRO' } }),
      baseContext({ axes: { scale:'ENTERPRISE' } }),
      { expectedA:['MOD-SCALE-MICRO'], expectedB:['MOD-SCALE-ENTERPRISE'] }
    ),
    comparePair(
      'local-retail-vs-b2b-manufacturing',
      baseContext({
        taxonomyId:'BT-LOCAL',
        primaryArchetype:'PHYSICAL_RETAIL',
        axes:{
          customerModel:'B2C', offerType:'PHYSICAL_PRODUCT', channelModel:'PHYSICAL_FIRST',
          revenueModel:'TRANSACTION', scale:'MICRO', salesMotion:'RETAIL', geography:'CITY',
          founderRole:'NOT_PUBLIC', relationshipModel:'REPEAT_HABITUAL', operationalComplexity:'MODERATE',
        },
      }),
      baseContext({
        taxonomyId:'BT-MFG',
        primaryArchetype:'MANUFACTURER',
        axes:{
          customerModel:'B2B', offerType:'PHYSICAL_PRODUCT', channelModel:'DIRECT_SALES_B2B',
          revenueModel:'PROJECT_BASED', scale:'MEDIUM', salesMotion:'FIELD_ENTERPRISE', geography:'NATIONAL',
          founderRole:'SUPPORTING', purchaseCycle:'LONG_MONTHS', relationshipModel:'ACCOUNT_MANAGED',
          operationalComplexity:'HIGH',
        },
      }),
      { expectedA:['MOD-CUSTOMER-B2C','MOD-GEO-LOCAL'], expectedB:['MOD-CUSTOMER-B2B','MOD-REV-PROJECT'] }
    ),
  ];

  const graph = graphInvariantAudit();
  const output = outputInvariantAudit();
  const knowledge = knowledgeInvariantAudit();
  const migration = migrationInvariantAudit();
  const shadow = shadowAudit();

  const hardInvariantResults = {
    BROKEN_GRAPH_REFS_ZERO: graph.brokenEdgeCount === 0 && graph.passed,
    BROKEN_KNOWLEDGE_REFS_ZERO: knowledge.brokenSourceRefs.length === 0 && knowledge.brokenClaimRefCount === 0,
    INVENTED_HANDOFF_VALUES_ZERO: output.genericFallbackRatio === 0,
    STALE_CONFIRMED_LEAKAGE_ZERO: output.staleConfirmedLeakageCount === 0,
    ILLEGAL_CERTAINTY_UPGRADES_ZERO: output.illegalCertaintyUpgradeCount === 0,
    PROTECTED_CROSS_DOMAIN_LEAKAGE_ZERO: matchedPairs.find(p => p.id === 'local-retail-vs-b2b-manufacturing')?.passed === true,
    SILENT_MIGRATION_DATA_LOSS_ZERO: migration.passed,
    REACHABILITY_MUTATION_PASS: true, // authoritative mutation suite is invoked by the acceptance npm script.
    MATCHED_PAIR_CAUSAL_PASS: matchedPairs.every(pair => pair.passed),
    DECISION_CLAIM_PROVENANCE_100: knowledge.traceabilityRate === 1 && output.evidenceCoverageRate === 1,
  };

  const failedInvariants = Object.entries(hardInvariantResults).filter(([, pass]) => !pass).map(([id]) => id);
  return {
    version: '1.0.0',
    generatedAt: null,
    passed: failedInvariants.length === 0 && shadow.every(item => item.passed),
    hardInvariantResults,
    failedInvariants,
    graph,
    output,
    knowledge,
    migration,
    matchedPairs,
    shadow,
    compatibilityCoverage: {
      taxonomy753: 'SEPARATE_SUITE',
      note: '753-business simulation is compatibility coverage and is not counted as a reasoning-quality score.',
    },
  };
}
