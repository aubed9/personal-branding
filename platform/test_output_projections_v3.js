import test from 'node:test';
import assert from 'node:assert/strict';

import { generateDeliverable, deliverableToMarkdown } from './src/services/deliverableGenerator.js';
import { migrateAnswerRecords } from './src/services/interviewSchema.js';
import { buildEvidenceDerivedHandoff } from './src/projections/output/handoffProjection.js';
import { assertOutputAcceptance, auditOutputModel } from './src/projections/output/audit.js';
import { buildCanonicalOutputClaims, claimPresentation } from './src/projections/output/claims.js';
import { CLAIM_TYPES, PROPOSAL_STATUS, validateCanonicalClaim } from './src/reasoning/contracts.js';
import {
  CANONICAL_EXTERNAL_KNOWLEDGE_CLAIMS,
  CANONICAL_EXTERNAL_SOURCE_REGISTRY,
} from './src/knowledge/canonicalExternalKnowledge.generated.js';

const GENERIC_FALLBACKS = [
  'خدمات و تخصص محوری',
  'مشتریان ارزش‌محور',
  'رفیق کاربلد و راهنما',
  'صمیمی و حرفه‌ای',
  'برند تخصصی',
  'کیفیت پایین و عدم همراهی',
  'سادگی و ضمانت واقعی',
  'ارائه باکیفیت و بدون دردسر',
  'صادق، دقیق و متعهد',
  'حل مستقیم درد مخاطب',
  'تعهد پایدار به کیفیت و رضایت',
];

function context(overrides = {}) {
  return {
    taxonomyId: 'BT-0166',
    taxonomyTitleFa: 'نرم‌افزار حسابداری ابری',
    industryId: 'IND-06',
    primaryArchetype: 'SAAS_SOFTWARE',
    archetype: 'SAAS_SOFTWARE',
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
      founderRole: 'FOUNDER_LED',
      purchaseCycle: 'MEDIUM_WEEKS',
      relationshipModel: 'CONTRACTUAL_RETAINER',
      regulatoryProfile: 'NORMAL',
      operationalComplexity: 'MODERATE',
      brandArchitecture: 'STANDALONE',
      ...overrides,
    },
  };
}

function phaseData() {
  return {
    1: {
      description: 'نرم‌افزار حسابداری ابری برای شرکت‌های کوچک',
      diagnosticVision: 'کاهش کار دستی تیم مالی',
      stage: 'فعال',
      geography: 'ایران',
      primaryGoal: 'افزایش تمدید اشتراک',
      coreOffer: 'اشتراک نرم‌افزار حسابداری ابری',
      valueHypothesis: 'کاهش زمان ثبت و خطای انسانی',
      budgetConstraint: 'بودجه سه‌ماهه محدود و تیم دو نفره',
    },
    2: {
      competitors: 'دو نرم‌افزار ابری مشابه',
      customerPain: 'ثبت دستی و دوباره‌کاری',
      pricingModel: 'اشتراک ماهانه',
      primaryChannel: 'ورودی محتوایی و دموی آنلاین',
      goldenOpportunity: 'راه‌اندازی سریع و پشتیبانی روشن',
    },
    3: {
      targetSegment: 'شرکت‌های کوچک با تیم مالی ۲ تا ۵ نفر',
      positioning: 'حسابداری ابری ساده برای تیم‌های کوچک',
      boundary: 'بدون پروژه سفارشی خارج از محصول',
      promise: 'شروع سریع و کاهش دوباره‌کاری',
    },
    4: {
      archetype: 'همیار متخصص',
      traits: 'روشن، دقیق و پاسخگو',
      toneGuardrail: 'بدون ترساندن کاربر با اصطلاحات مالیاتی',
    },
    5: {
      voiceStyle: 'روشن و حرفه‌ای',
      elevatorHook: 'ثبت مالی روزمره با اصطکاک کمتر',
      forbiddenWords: 'تضمین صددرصد، بدون خطا',
    },
    6: {
      naming: 'نام کوتاه فارسی-دیجیتال',
      tagline: 'تمرکز بر سادگی کار روزمره',
    },
    7: {
      colorPalette: 'آبی تیره و سبز تأیید',
      typography: 'فونت فارسی خوانا برای داشبورد',
      logoConcept: 'نشان ساده قابل استفاده در اپ',
    },
    8: {
      thoughtLeadership: 'آموزش کاهش دوباره‌کاری مالی',
      prChannels: 'وبینار و محتوای تخصصی',
      leadFunnel: 'محتوا ← دمو ← آزمون ← اشتراک',
      reputationCrisis: 'پاسخ مستند و ثبت incident',
    },
  };
}

function metadata(data, overrides = {}) {
  const records = migrateAnswerRecords(data);
  return {
    revision: 10,
    answerRecords: records,
    completedPhases: { 1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true },
    phaseStatus: {},
    reviewRequired: {},
    contradictions: [],
    ...overrides,
  };
}

test('phase output keeps stable shell but conditional body is claim-driven', () => {
  const data = phaseData();
  const doc = generateDeliverable(3, data, context(), [], [], [], metadata(data));
  assert.equal(doc.sections.length, 5);
  assert.deepEqual(doc.sections.map(s => s.sectionType), [
    'STATUS_VALIDITY', 'EVIDENCE', 'DECISIONS', 'RISKS', 'ACTIONS_MEASUREMENT'
  ]);
  assert.ok(doc.claimIds.length > 0);
  assert.ok(doc.sections.find(s => s.sectionType === 'DECISIONS').subsections.length > 0);

  const raw = JSON.stringify(doc);
  for (const fallback of GENERIC_FALLBACKS) assert.equal(raw.includes(fallback), false, `generic fallback leaked: ${fallback}`);
  assert.equal(raw.includes('۳۰ روز: داده «'), false, 'missing fields must not become generic 30-day actions');
});

test('admissible Iran external knowledge is projected as source-traceable shared EXTERNAL_FACT claims', () => {
  const data = phaseData();
  const meta = metadata(data, { knowledgeAsOf: '2026-09-26T00:00:00Z' });
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    unknowns: [],
    contradictions: [],
    metadata: meta,
  });

  const external = model.claims.filter(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT);
  assert.ok(external.length > 0, 'explicit Iran context should surface admissible external knowledge');
  assert.ok(external.some(claim => claim.sourceClaimIds.includes('KCL-IR-SCI-CPI-1405-05')));
  const cpi = external.find(claim => claim.sourceClaimIds.includes('KCL-IR-SCI-CPI-1405-05'));
  const cpiSourceId = 'SRC-IR-SCI-CPI-1405-05';
  assert.deepEqual(cpi.metadata.sourceProvenance, [{
    sourceId: cpiSourceId,
    locator: CANONICAL_EXTERNAL_KNOWLEDGE_CLAIMS['KCL-IR-SCI-CPI-1405-05'].locators[0].locator,
    observedPeriod: CANONICAL_EXTERNAL_SOURCE_REGISTRY[cpiSourceId].observed_period,
    verifiedAt: CANONICAL_EXTERNAL_SOURCE_REGISTRY[cpiSourceId].verified_at,
    effectiveFrom: null,
    effectiveUntil: null,
  }]);
  assert.ok(external.some(claim => claim.sourceClaimIds.includes('KCL-IR-ECOM-1403')));
  assert.ok(external.every(claim => claim.status === 'CONFIRMED'));
  assert.ok(external.every(claim => claim.sourceClaimIds.length > 0 && claim.sourceIds.length > 0));
  assert.ok(external.every(claim => claim.metadata.jurisdictionOrScope === 'IRAN'));
  assert.equal(external.some(claim => /DIGIKALA_PLATFORM|SNAPP_PLATFORM/.test(claim.metadata.jurisdictionOrScope)), false);

  const phase2 = generateDeliverable(2, data, context(), [], [], [], meta);
  const externalIds = external
    .filter(claim => claim.metadata.affectedPhases.includes(2))
    .map(claim => claim.claimId);
  const evidenceSection = phase2.sections.find(section => section.sectionType === 'EVIDENCE');
  assert.ok(externalIds.some(id => evidenceSection.claimIds.includes(id)));
  assert.ok(evidenceSection.sourceIds.length > 0);

  const markdown = deliverableToMarkdown(phase2);
  assert.ok(markdown.includes('source-claim:'));
  assert.ok(markdown.includes('sources:'));
  assert.ok(markdown.includes('limitations:'));
  assert.ok(markdown.includes(`source-locator: ${cpiSourceId}:`));
  assert.ok(markdown.includes(`observed: ${cpiSourceId}: 1405-05`));
});

test('scoped e-commerce law claim requires both B2C and online modules', () => {
  const data = phaseData();
  const meta = metadata(data, { knowledgeAsOf: '2026-09-27T00:00:00Z' });
  const claimId = 'KCL-IR-LAW-ECOM-1382-UNVERIFIED';

  const b2cOnline = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ customerModel: 'B2C', channelModel: 'ONLINE_FIRST', revenueModel: 'TRANSACTION' }),
    metadata: meta,
  });
  assert.ok(b2cOnline.claims.some(claim => claim.sourceClaimIds?.includes(claimId)));
  const law = b2cOnline.claims.find(claim => claim.sourceClaimIds?.includes(claimId));
  assert.equal(law.metadata.sourceProvenance[0].effectiveFrom, '1382-11-27');
  assert.ok(claimPresentation(law).includes('effective-from: SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR: 1382-11-27'));

  const b2bOnline = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ customerModel: 'B2B', channelModel: 'ONLINE_FIRST', revenueModel: 'TRANSACTION' }),
    metadata: meta,
  });
  assert.equal(b2bOnline.claims.some(claim => claim.sourceClaimIds?.includes(claimId)), false);

  const b2cPhysical = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ customerModel: 'B2C', channelModel: 'PHYSICAL_FIRST', revenueModel: 'TRANSACTION' }),
    metadata: meta,
  });
  assert.equal(b2cPhysical.claims.some(claim => claim.sourceClaimIds?.includes(claimId)), false);
});

test('Iran external knowledge never leaks into non-Iran or unknown jurisdiction output', () => {
  const data = phaseData();
  data[1].geography = 'بین‌المللی و صادراتی';
  const meta = metadata(data, { knowledgeAsOf: '2026-09-26T00:00:00Z' });
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ geography: 'INTERNATIONAL' }),
    unknowns: [],
    contradictions: [],
    metadata: meta,
  });
  assert.equal(model.claims.some(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT), false);
});

test('the explicit local Iran choice admits national evidence for a local business', () => {
  const data = phaseData();
  data[1].geography = 'مشهد';
  data[1].geographyValue = 'local_city';
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ geography: 'CITY', customerModel: 'B2C', channelModel: 'PHYSICAL_FIRST' }),
    metadata: metadata(data, { knowledgeAsOf: '2026-09-26T00:00:00Z' }),
  });
  const external = model.claims.filter(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT);
  assert.ok(external.some(claim => claim.sourceClaimIds.includes('KCL-IR-SCI-CPI-1405-05')));
  assert.ok(external.every(claim => claim.metadata.jurisdictionOrScope === 'IRAN'));
  assert.equal(external.some(claim => claim.sourceClaimIds.includes('KCL-IR-LAW-ECOM-1382-UNVERIFIED')), false);

  const online = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ geography: 'CITY', customerModel: 'B2C', channelModel: 'ONLINE_FIRST', revenueModel: 'TRANSACTION' }),
    metadata: metadata(data, { knowledgeAsOf: '2026-09-27T00:00:00Z' }),
  });
  assert.ok(online.claims.some(claim => claim.sourceClaimIds?.includes('KCL-IR-LAW-ECOM-1382-UNVERIFIED')));

  const b2b = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context({ geography: 'CITY', customerModel: 'B2B', channelModel: 'ONLINE_FIRST', revenueModel: 'TRANSACTION' }),
    metadata: metadata(data, { knowledgeAsOf: '2026-09-27T00:00:00Z' }),
  });
  assert.equal(b2b.claims.some(claim => claim.sourceClaimIds?.includes('KCL-IR-LAW-ECOM-1382-UNVERIFIED')), false);

  const ambiguous = { ...data, 1: { ...data[1], geography: 'محلی', geographyValue: null } };
  const unknownCountry = buildCanonicalOutputClaims({
    phaseData: ambiguous,
    businessContext: context({ geography: 'CITY' }),
    metadata: metadata(ambiguous, { knowledgeAsOf: '2026-09-27T00:00:00Z' }),
  });
  assert.equal(unknownCountry.claims.some(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT), false);
});

test('stale external sources cannot remain CONFIRMED in generated output', () => {
  const data = phaseData();
  const meta = metadata(data, { knowledgeAsOf: '2030-01-01T00:00:00Z' });
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    unknowns: [],
    contradictions: [],
    metadata: meta,
  });
  assert.equal(model.claims.some(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT), false);
});

test('invalid knowledge evaluation date cannot silently admit current external facts', () => {
  const data = phaseData();
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    metadata: metadata(data, { knowledgeAsOf: 'not-a-date' }),
  });
  assert.equal(model.claims.some(claim => claim.claimType === CLAIM_TYPES.EXTERNAL_FACT), false);
});

test('platform-scoped evidence requires an explicit platform jurisdiction override', () => {
  const data = phaseData();
  const generic = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    metadata: metadata(data, { knowledgeAsOf: '2026-09-26T00:00:00Z' }),
  });
  assert.equal(
    generic.claims.some(claim => claim.metadata?.jurisdictionOrScope === 'DIGIKALA_PLATFORM'),
    false
  );

  const platform = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    metadata: metadata(data, {
      knowledgeAsOf: '2026-09-26T00:00:00Z',
      knowledgeJurisdiction: 'DIGIKALA_PLATFORM',
    }),
  });
  assert.ok(platform.claims.some(claim =>
    claim.claimType === CLAIM_TYPES.EXTERNAL_FACT
    && claim.metadata?.jurisdictionOrScope === 'DIGIKALA_PLATFORM'
  ));
});

test('canonical claims obey evidence/provenance contracts', () => {
  const data = phaseData();
  const master = generateDeliverable('master', data, context(), [], [], [], metadata(data));
  for (const claim of Object.values(master.claimLedger)) {
    const validation = validateCanonicalClaim(claim);
    assert.equal(validation.valid, true, `${claim.claimId}: ${validation.errors.join('; ')}`);

    if ([CLAIM_TYPES.USER_FACT, CLAIM_TYPES.USER_DECISION, CLAIM_TYPES.CALCULATION, CLAIM_TYPES.PROPOSAL, CLAIM_TYPES.CONTRADICTION].includes(claim.claimType)) {
      assert.ok(claim.evidenceIds.length > 0, `${claim.claimType} ${claim.claimId} needs evidence`);
    }
    if (claim.claimType === CLAIM_TYPES.PROPOSAL) {
      assert.equal(claim.proposalStatus, PROPOSAL_STATUS.RECOMMENDED);
      assert.ok(claim.ruleId);
      assert.ok(claim.metadata.successMeasure);
      assert.ok(claim.metadata.invalidationCondition);
    }
  }
});

test('semantic Master contains each canonical claim exactly once and reuses Phase claim IDs', () => {
  const data = phaseData();
  const meta = metadata(data);
  const phase3 = generateDeliverable(3, data, context(), [], [], [], meta);
  const master = generateDeliverable('master', data, context(), [], [], [], meta);

  assert.equal(master.sections.length, 9);
  assert.deepEqual(master.sections.map(s => s.id), ['M0','M1','M2','M3','M4','M5','M6','M7','M8']);

  const masterClaimRefs = master.sections.flatMap(section => section.claimIds || []);
  assert.equal(new Set(masterClaimRefs).size, masterClaimRefs.length, 'Master must not duplicate canonical claims');

  const target = Object.values(phase3.claimLedger).find(claim => claim.metadata?.field === 'targetSegment');
  assert.ok(target);
  assert.ok(master.claimLedger[target.claimId]);
  assert.equal(master.claimLedger[target.claimId].statement, target.statement);
  assert.ok(master.sections.find(s => s.id === 'M3').claimIds.includes(target.claimId));
  assert.ok(master.sections.find(s => s.id === 'M8').items.some(item => item.includes(target.claimId)));
});

test('summary projections never upgrade claim type or stale certainty', () => {
  const data = phaseData();
  const records = migrateAnswerRecords(data);
  const staleTarget = records.find(record => record.questionId === 'p3_target_segment');
  const meta = metadata(data, {
    answerRecords: records,
    phaseStatus: { 3: 'INVALIDATED' },
    reviewRequired: { 3: ['p3_target_segment'] },
  });

  const phase3 = generateDeliverable(3, data, context(), [], [], [], meta);
  const master = generateDeliverable('master', data, context(), [], [], [], meta);
  const phaseClaim = Object.values(phase3.claimLedger).find(claim => claim.evidenceIds.includes(staleTarget.id));
  const masterClaim = master.claimLedger[phaseClaim.claimId];

  assert.equal(phaseClaim.claimType, CLAIM_TYPES.USER_DECISION);
  assert.equal(masterClaim.claimType, CLAIM_TYPES.USER_DECISION);
  assert.equal(phaseClaim.status, 'NEEDS_REVIEW');
  assert.equal(masterClaim.status, 'NEEDS_REVIEW');
  assert.notEqual(masterClaim.status, 'CONFIRMED');
});

test('handoff contains only evidence-linked values or explicit unknowns, never invented fallback', () => {
  const data = phaseData();
  const records = migrateAnswerRecords(data);
  const complete = buildEvidenceDerivedHandoff({
    targetPhase: 3,
    phaseData: data,
    answerRecords: records,
    businessContext: context(),
  });

  assert.ok(complete.sourceAnswerIds.length > 0);
  assert.ok(complete.sourceAnswerIds.every(id => complete.message.includes(id)));
  assert.ok(complete.message.includes('ثبت دستی و دوباره‌کاری'));
  for (const fallback of GENERIC_FALLBACKS) assert.equal(complete.message.includes(fallback), false);

  const missingData = phaseData();
  delete missingData[2].customerPain;
  const missingRecords = migrateAnswerRecords(missingData);
  const missing = buildEvidenceDerivedHandoff({
    targetPhase: 3,
    phaseData: missingData,
    answerRecords: missingRecords,
    businessContext: context(),
  });
  assert.ok(missing.missingFields.includes('customerPain'));
  assert.match(missing.message, /UNKNOWN/);
  assert.equal(missing.message.includes('کیفیت پایین و عدم همراهی'), false);
});

test('material context changes produce different conditional module projections', () => {
  const data = phaseData();
  const meta = metadata(data);
  const b2b = generateDeliverable(2, data, context({
    customerModel: 'B2B',
    revenueModel: 'RECURRING',
    channelModel: 'ONLINE_FIRST',
  }), [], [], [], meta);
  const b2c = generateDeliverable(2, data, context({
    customerModel: 'B2C',
    revenueModel: 'TRANSACTION',
    channelModel: 'PHYSICAL_FIRST',
    geography: 'CITY',
  }), [], [], [], meta);

  assert.notDeepEqual(b2b.moduleProjection.moduleIds, b2c.moduleProjection.moduleIds);
  const b2bSub = b2b.sections.find(s => s.sectionType === 'DECISIONS').subsections.map(s => s.moduleId);
  const b2cSub = b2c.sections.find(s => s.sectionType === 'DECISIONS').subsections.map(s => s.moduleId);
  assert.notDeepEqual(b2bSub, b2cSub);
  assert.ok(b2bSub.includes('MOD-CUSTOMER-B2B'));
  assert.ok(b2cSub.includes('MOD-CUSTOMER-B2C'));
});

test('empty or weak evidence produces short output without filler actions', () => {
  const doc = generateDeliverable(2, {}, null);
  assert.equal(doc.actions.length, 0);
  assert.equal(doc.evidence.length, 0);
  assert.equal(doc.sections.length, 5);
  const raw = JSON.stringify(doc);
  assert.equal(raw.includes('۳۰ روز: داده'), false);
  assert.ok(doc.sections.some(section => section.status === 'NOT_APPLICABLE'));
});

test('markdown renders canonical claim IDs and conditional module subsections', () => {
  const data = phaseData();
  const doc = generateDeliverable(2, data, context(), [], [], [], metadata(data));
  const md = deliverableToMarkdown(doc);
  const claim = Object.values(doc.claimLedger).find(item => item.phase === 2 && item.claimType === CLAIM_TYPES.USER_FACT);
  assert.ok(claim);
  assert.ok(md.includes(claim.claimId));
  assert.ok(md.includes('تمرکز تصمیمی فعال'));
});


test('output acceptance audit reaches all hard #19 invariants on specialized evidence-rich state', () => {
  const data = phaseData();
  const meta = metadata(data);
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: context(),
    unknowns: [],
    contradictions: [],
    metadata: meta,
  });
  const result = assertOutputAcceptance(model, { specializedContext: true });
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.audit.evidenceCoverageRate, 1);
  assert.equal(result.audit.genericFallbackRatio, 0);
  assert.equal(result.audit.staleConfirmedLeakageCount, 0);
  assert.equal(result.audit.illegalCertaintyUpgradeCount, 0);
  assert.equal(result.audit.semanticDuplicateCount, 0);
});

test('shared module risks are one canonical claim referenced by every affected phase view', () => {
  const data = phaseData();
  const meta = metadata(data);
  const ctx = context({
    customerModel: 'B2B',
    revenueModel: 'RECURRING',
    regulatoryProfile: 'REGULATED',
    founderRole: 'FOUNDER_LED',
  });
  const model = buildCanonicalOutputClaims({
    phaseData: data,
    businessContext: ctx,
    unknowns: [],
    contradictions: [],
    metadata: meta,
  });

  const founderRisk = model.claims.find(claim =>
    claim.claimType === CLAIM_TYPES.RISK &&
    claim.moduleId === 'MOD-FOUNDER-PUBLIC' &&
    claim.metadata?.riskId === 'founder_dependency'
  );
  assert.ok(founderRisk);
  assert.equal(founderRisk.phase, null);
  assert.ok(founderRisk.metadata.affectedPhases.includes(4));
  assert.ok(founderRisk.metadata.affectedPhases.includes(5));
  assert.ok(founderRisk.metadata.affectedPhases.includes(8));

  const p4 = generateDeliverable(4, data, ctx, [], [], [], meta);
  const p5 = generateDeliverable(5, data, ctx, [], [], [], meta);
  const p8 = generateDeliverable(8, data, ctx, [], [], [], meta);
  assert.ok(p4.claimIds.includes(founderRisk.claimId));
  assert.ok(p5.claimIds.includes(founderRisk.claimId));
  assert.ok(p8.claimIds.includes(founderRisk.claimId));

  const master = generateDeliverable('master', data, ctx, [], [], [], meta);
  const refs = master.sections.flatMap(section => section.claimIds || []).filter(id => id === founderRisk.claimId);
  assert.equal(refs.length, 1, 'shared risk must appear once in the semantic Master');
});

test('audit detects unsupported generated claims and semantic duplicate regressions', () => {
  const fake = {
    claims: [
      {
        claimId: 'CLM-A',
        claimType: CLAIM_TYPES.PROPOSAL,
        statement: 'اقدام یکسان',
        status: 'PROVISIONAL',
        evidenceIds: [],
        dependencyIds: [],
        ruleId: null,
        moduleId: null,
      },
      {
        claimId: 'CLM-B',
        claimType: CLAIM_TYPES.PROPOSAL,
        statement: 'اقدام یکسان',
        status: 'PROVISIONAL',
        evidenceIds: [],
        dependencyIds: [],
        ruleId: null,
        moduleId: null,
      },
    ],
  };
  const audit = auditOutputModel(fake, { specializedContext: true });
  assert.equal(audit.evidenceCoverageRate, 0);
  assert.ok(audit.genericFallbackRatio > 0);
  assert.equal(audit.semanticDuplicateCount, 1);
});
