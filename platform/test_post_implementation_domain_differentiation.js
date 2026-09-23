import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveDomainSpecialization } from './src/data/businessContextRouter.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';
import { migrateAnswerRecords } from './src/services/interviewSchema.js';

function phaseData() {
  return {
    1: {
      description: 'کسب‌وکار فعال با مشتری واقعی و هدف رشد سودآور',
      diagnosticVision: 'کاهش اصطکاک مشتری و رشد قابل سنجش',
      stage: 'فعال',
      geography: 'ایران',
      primaryGoal: 'رشد سودآور',
      coreOffer: 'پیشنهاد اصلی کسب‌وکار',
      valueHypothesis: 'حل مسئله مشتری با تجربه قابل اتکا',
      budgetConstraint: 'بودجه محدود اما قابل برنامه‌ریزی',
    },
    2: {
      competitors: 'رقبای مستقیم و جایگزین‌های فعلی',
      customerPain: 'انتخاب فعلی زمان‌بر و پرریسک است',
      pricingModel: 'قیمت‌گذاری شفاف',
      primaryChannel: 'کانال اصلی فروش',
      goldenOpportunity: 'اثبات نتیجه و کاهش ریسک خرید',
    },
    3: {
      targetSegment: 'مشتری هدف با مسئله روشن',
      positioning: 'راهکار تخصصی و قابل اتکا',
      boundary: 'بدون وعده خارج از توان تحویل',
      promise: 'نتیجه قابل مشاهده با فرایند روشن',
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
      reputationCrisis: 'پاسخ مستند و پیگیری تا نتیجه',
    },
  };
}

function metadata(data) {
  return {
    revision: 77,
    answerRecords: migrateAnswerRecords(data),
    completedPhases: { 1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true },
    phaseStatus: {},
    reviewRequired: {},
    contradictions: [],
  };
}

function context({ taxonomyId, taxonomyTitleFa, industryId, industryCode, primaryArchetype, axes }) {
  return {
    schemaVersion: '3.0.0',
    taxonomyId,
    taxonomyTitleFa,
    industryId,
    industryCode,
    primaryArchetype,
    confidence: 'USER_CONFIRMED',
    activeOverlays: [],
    axes,
  };
}

const LOCAL_AXES = Object.freeze({
  customerModel: 'B2C',
  offerType: 'SERVICE',
  channelModel: 'PHYSICAL_FIRST',
  revenueModel: 'TRANSACTION',
  maturity: 'ACTIVE',
  scale: 'SMALL',
  salesMotion: 'RETAIL',
  geography: 'CITY',
  branchStructure: 'SINGLE_LOCATION',
  founderRole: 'SUPPORTING',
  purchaseCycle: 'SHORT_DAYS',
  relationshipModel: 'REPEAT_HABITUAL',
  regulatoryProfile: 'NORMAL',
  operationalComplexity: 'MODERATE',
  brandArchitecture: 'STANDALONE',
});

const SAAS_AXES = Object.freeze({
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
});

const CLINIC_AXES = Object.freeze({
  customerModel: 'B2C',
  offerType: 'SERVICE',
  channelModel: 'PHYSICAL_FIRST',
  revenueModel: 'TRANSACTION',
  maturity: 'ACTIVE',
  scale: 'SMALL',
  salesMotion: 'RETAIL',
  geography: 'CITY',
  branchStructure: 'SINGLE_LOCATION',
  founderRole: 'SUPPORTING',
  purchaseCycle: 'MEDIUM_WEEKS',
  relationshipModel: 'REPEAT_HABITUAL',
  regulatoryProfile: 'HIGH_TRUST',
  operationalComplexity: 'MODERATE',
  brandArchitecture: 'STANDALONE',
});

const MFG_AXES = Object.freeze({
  customerModel: 'B2B',
  offerType: 'PHYSICAL_PRODUCT',
  channelModel: 'DIRECT_SALES_B2B',
  revenueModel: 'PROJECT_BASED',
  maturity: 'ACTIVE',
  scale: 'MEDIUM',
  salesMotion: 'FIELD_ENTERPRISE',
  geography: 'NATIONAL',
  branchStructure: 'SINGLE_LOCATION',
  founderRole: 'SUPPORTING',
  purchaseCycle: 'LONG_MONTHS',
  relationshipModel: 'ACCOUNT_MANAGED',
  regulatoryProfile: 'NORMAL',
  operationalComplexity: 'HIGH',
  brandArchitecture: 'STANDALONE',
});

const PAIRS = [
  {
    id: 'cafe-vs-local-retail',
    phase: 2,
    left: context({
      taxonomyId: 'BT-0066',
      taxonomyTitleFa: 'کافه تخصصی و رستری موج سوم',
      industryId: 'IND-03',
      industryCode: 'FOOD_HOSPITALITY',
      primaryArchetype: 'RESTAURANT_CAFE_HOSPITALITY',
      axes: LOCAL_AXES,
    }),
    right: context({
      taxonomyId: 'BT-0003',
      taxonomyTitleFa: 'فروشگاه محلی خرده‌فروشی',
      industryId: 'IND-01',
      industryCode: 'RETAIL',
      primaryArchetype: 'LOCAL_RETAIL',
      axes: LOCAL_AXES,
    }),
  },
  {
    id: 'tax-saas-vs-non-tax-saas',
    phase: 2,
    left: context({
      taxonomyId: 'BT-0166',
      taxonomyTitleFa: 'نرم‌افزار حسابداری ابری و اتصال به سامانه مودیان',
      industryId: 'IND-06',
      industryCode: 'SOFTWARE_SAAS',
      primaryArchetype: 'SAAS_SOFTWARE',
      axes: SAAS_AXES,
    }),
    right: context({
      taxonomyId: 'BT-0998',
      taxonomyTitleFa: 'نرم‌افزار مدیریت باشگاه و CRM',
      industryId: 'IND-06',
      industryCode: 'SOFTWARE_SAAS',
      primaryArchetype: 'SAAS_SOFTWARE',
      axes: SAAS_AXES,
    }),
  },
  {
    id: 'medical-vs-salon',
    phase: 7,
    left: context({
      taxonomyId: 'BT-0100',
      taxonomyTitleFa: 'کلینیک تخصصی دندانپزشکی و ایمپلنت',
      industryId: 'IND-04',
      industryCode: 'HEALTH_BEAUTY',
      primaryArchetype: 'LOCAL_SERVICE',
      axes: CLINIC_AXES,
    }),
    right: context({
      taxonomyId: 'BT-0997',
      taxonomyTitleFa: 'سالن زیبایی و مراقبت مو',
      industryId: 'IND-04',
      industryCode: 'HEALTH_BEAUTY',
      primaryArchetype: 'LOCAL_SERVICE',
      axes: CLINIC_AXES,
    }),
  },
  {
    id: 'machining-vs-generic-manufacturer',
    phase: 2,
    left: context({
      taxonomyId: 'BT-0221',
      taxonomyTitleFa: 'کارخانه قالب‌سازی صنعتی، سنبه‌ماتریس و تزریق پلاستیک',
      industryId: 'IND-08',
      industryCode: 'MACHINING_TOOLING',
      primaryArchetype: 'MANUFACTURER',
      axes: MFG_AXES,
    }),
    right: context({
      taxonomyId: 'BT-0996',
      taxonomyTitleFa: 'تولیدکننده محصولات صنعتی عمومی',
      industryId: 'IND-07',
      industryCode: 'GENERAL_MANUFACTURING',
      primaryArchetype: 'MANUFACTURER',
      axes: MFG_AXES,
    }),
  },
];

function setDiff(a, b) {
  const A = new Set(a || []);
  const B = new Set(b || []);
  return [...new Set([...A].filter(x => !B.has(x)).concat([...B].filter(x => !A.has(x))))].sort();
}

function canonicalFingerprint(ctx) {
  const data = phaseData();
  const meta = metadata(data);
  const phases = Array.from({ length: 8 }, (_, i) => generateDeliverable(i + 1, data, ctx, [], [], [], meta));
  const master = generateDeliverable('master', data, ctx, [], [], [], meta);

  const modules = new Set();
  const evidenceRequirements = new Set();
  const metrics = new Set();
  const knowledge = new Set();
  const risks = new Set();
  const actionRules = new Set();

  for (const doc of phases) {
    for (const id of doc.moduleProjection?.moduleIds || []) modules.add(id);
    for (const req of doc.moduleProjection?.evidenceRequirements || []) evidenceRequirements.add(req);
    for (const metric of doc.moduleProjection?.metrics || []) metrics.add(metric);
    for (const kb of doc.moduleProjection?.knowledgeDependencies || []) knowledge.add(kb);
    for (const risk of doc.moduleProjection?.risks || []) risks.add(risk);
    for (const action of doc.actions || []) actionRules.add(action.ruleId);
  }

  const generatedClaims = Object.values(master.claimLedger || {})
    .filter(claim => ['SYSTEM_INFERENCE','PROPOSAL','RISK','CALCULATION'].includes(claim.claimType))
    .map(claim => [claim.claimType, claim.moduleId || '', claim.ruleId || '', claim.metadata?.riskId || ''].join(':'))
    .sort();

  return {
    modules: [...modules].sort(),
    evidenceRequirements: [...evidenceRequirements].sort(),
    metrics: [...metrics].sort(),
    risks: [...risks].sort(),
    knowledge: [...knowledge].sort(),
    actionRules: [...actionRules].sort(),
    generatedClaims,
  };
}

test('legacy exact-domain specialization actually differs for all required near-axis pairs', () => {
  for (const pair of PAIRS) {
    const left = resolveDomainSpecialization(pair.left, pair.left.axes, pair.phase);
    const right = resolveDomainSpecialization(pair.right, pair.right.axes, pair.phase);
    assert.notEqual(
      left.phaseInstruction,
      right.phaseInstruction,
      `${pair.id}: fixture must represent a real exact-domain distinction before auditing canonical output`
    );
  }
});

test('canonical generated outputs preserve exact business-type/domain differentiation beyond names and user text', () => {
  const failures = [];
  for (const pair of PAIRS) {
    const left = canonicalFingerprint(pair.left);
    const right = canonicalFingerprint(pair.right);
    const deltas = {
      modules: setDiff(left.modules, right.modules),
      evidenceRequirements: setDiff(left.evidenceRequirements, right.evidenceRequirements),
      metrics: setDiff(left.metrics, right.metrics),
      risks: setDiff(left.risks, right.risks),
      knowledge: setDiff(left.knowledge, right.knowledge),
      actionRules: setDiff(left.actionRules, right.actionRules),
      generatedClaims: setDiff(left.generatedClaims, right.generatedClaims),
    };
    const substantiveDimensions = Object.entries(deltas).filter(([, values]) => values.length > 0).map(([key]) => key);
    if (substantiveDimensions.length === 0) failures.push({ id: pair.id, deltas });
  }
  assert.deepEqual(failures, [], JSON.stringify(failures, null, 2));
});
