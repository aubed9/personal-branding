// DIGITAL MARKET — Milestone 4 Adversarial Challenger 2 Test Harness
// Comprehensive Domain Contamination & Epistemic Markers Stress Suite
// Validates Requirements R5 & R6: 8-Tier Specialization & Zero Cross-Domain Leakage

import { getAdaptedPhaseQuestions, ALL_PHASES_QUESTIONS } from "./src/data/allPhasesTemplates.js";
import { getAdaptivePhase2Questions, PHASE2_QUESTIONS } from "./src/data/phase2Templates.js";
import { INITIAL_QUESTIONS } from "./src/data/phase1Templates.js";
import {
  detectCrossDomainLeakage,
  INDUSTRY_VOCABULARY_MAP,
  CROSS_DOMAIN_CONTAMINANT_CATEGORIES
} from "./src/data/industryVocabularyMap.js";
import {
  BUSINESS_TYPES,
  BUSINESS_TYPES_MAP,
  MACRO_INDUSTRIES
} from "./src/data/businessTaxonomy753.js";
import { resolveDomainSpecialization } from "./src/data/businessContextRouter.js";

console.log("======================================================================");
console.log("⚔️ CHALLENGER 2: EMPIRICAL ADVERSARIAL STRESS SUITE (MILESTONE 4)");
console.log("Grounding: Requirements R5 & R6 | Domain Isolation & Epistemic Markers");
console.log("======================================================================\n");

let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedAssertions++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedAssertions++;
  }
}

// ============================================================================
// SUITE 1: DIVERSE BUSINESS PROFILE SAMPLING ACROSS ALL 31 MACRO INDUSTRIES
// ============================================================================
console.log("--- SUITE 1: Representative Multi-Industry Profile Sampling (31 Macro Sectors) ---");

const DIVERSE_PROFILES = [
  { id: "BT-0012", name: "کتابفروشی مستقل و شهر کتاب محلی", ind: "IND-01", arch: "PHYSICAL_RETAIL" },
  { id: "BT-0031", name: "فروشگاه آنلاین پوشاک و اکسسوری DTC", ind: "IND-02", arch: "ECOMMERCE_DTC" },
  { id: "BT-0066", name: "کافه تخصصی و رستری موج سوم", ind: "IND-03", arch: "RESTAURANT_CAFE_HOSPITALITY", subDomain: "CAFE" },
  { id: "BT-0070", name: "رستوران سنتی ایرانی و باغ رستوران", ind: "IND-03", arch: "RESTAURANT_CAFE_HOSPITALITY", subDomain: "RESTAURANT" },
  { id: "BT-0071", name: "چلوکبابی اصیل و کباب‌سرای بازار", ind: "IND-03", arch: "RESTAURANT_CAFE_HOSPITALITY", subDomain: "RESTAURANT" },
  { id: "BT-0072", name: "قنادی و شیرینی‌پزی سنتی", ind: "IND-03", arch: "RESTAURANT_CAFE_HOSPITALITY", subDomain: "RESTAURANT" },
  { id: "BT-0081", name: "کلینیک دندانپزشکی تخصصی و ایمپلنت", ind: "IND-04", arch: "HEALTH_BEAUTY_WELLNESS" },
  { id: "BT-0091", name: "سالن زیبایی و مراقبت پوست بانوان", ind: "IND-04", arch: "HEALTH_BEAUTY_WELLNESS" },
  { id: "BT-0111", name: "مرکز کارواش نانو بخار و دیتیلینگ خودرو", ind: "IND-05", arch: "LOCAL_SERVICE" },
  { id: "BT-0112", name: "اتوسرویس سریع و تعویض روغنی خودرو", ind: "IND-05", arch: "LOCAL_SERVICE" },
  { id: "BT-0168", name: "نرم‌افزار ابری مدیریت باشگاه ورزشی و فیتنس", ind: "IND-06", arch: "SAAS_SOFTWARE", isNonTaxSaaS: true },
  { id: "BT-0166", name: "سامانه ابری حسابداری مالیاتی و مودیان B2B", ind: "IND-06", arch: "SAAS_SOFTWARE", isNonTaxSaaS: false },
  { id: "BT-0181", name: "پلتفرم مارکت‌پلیس خدمات محلی و تعمیرات", ind: "IND-07", arch: "MARKETPLACE_PLATFORM" },
  { id: "BT-0201", name: "کارخانه قالب‌سازی سنبه‌ماتریس و تراشکاری CNC", ind: "IND-08", arch: "MANUFACTURER" },
  { id: "BT-0221", name: "کارگاه تزریق پلاستیک و ظروف مصرفی", ind: "IND-09", arch: "MANUFACTURER" },
  { id: "BT-0241", name: "کارخانه صنایع غذایی، کنسرو و رب گوجه‌فرنگی", ind: "IND-10", arch: "MANUFACTURER" },
  { id: "BT-0251", name: "شرکت پیمانکاری ابنیه و اسکلت بتنی", ind: "IND-11", arch: "CONSTRUCTION_REAL_ESTATE" },
  { id: "BT-0271", name: "عمده‌فروشی و بنکداری آهن‌آلات و مصالح ساختمانی", ind: "IND-12", arch: "WHOLESALE" },
  { id: "BT-0281", name: "شرکت ترابری جاده‌ای و ناوگان باری سنگین", ind: "IND-13", arch: "TRANSPORTATION_LOGISTICS" },
  { id: "BT-0305", name: "مرغداری صنعتی و پرورش طیور گوشتی", ind: "IND-14", arch: "AGRICULTURE" },
  { id: "BT-0331", name: "دفتر وکالت و مشاوره حقوقی تجاری ریتاینر", ind: "IND-15", arch: "PROFESSIONAL_SERVICE" },
  { id: "BT-0341", name: "آژانس تبلیغاتی ۳۶۰ درجه و روابط عمومی PR", ind: "IND-16", arch: "PROFESSIONAL_SERVICE" },
  { id: "BT-0361", name: "استودیو آتلیه معماری و طراحی دکوراسیون داخلی", ind: "IND-16", arch: "PROFESSIONAL_SERVICE" },
  { id: "BT-0381", name: "موسسه سبدگردانی و مدیریت دارایی در بورس", ind: "IND-17", arch: "FINANCIAL_SERVICE" },
  { id: "BT-0401", name: "آموزشگاه آزاد فنی‌وحرفه‌ای و مهارت‌آموزی", ind: "IND-18", arch: "EDUCATION" },
  { id: "BT-0421", name: "تولیدکننده محتوای یوتیوب، ولاگر و پادکستر", ind: "IND-19", arch: "CREATOR_MEDIA_EDUCATION" },
  { id: "BT-0481", name: "اقامتگاه بوم‌گردی و بوتیک هتل سنتی", ind: "IND-20", arch: "HOSPITALITY_TOURISM" },
  { id: "BT-0501", name: "آژانس مسکن و معاملات املاک و مستغلات", ind: "IND-21", arch: "REAL_ESTATE_AGENCY" },
  { id: "BT-0521", name: "معدن استخراج سنگ‌آهن و واحد دانه‌بندی", ind: "IND-22", arch: "MINING_METALS" },
  { id: "BT-0541", name: "شرکت تولید مواد موثره دارویی و شیمیایی API", ind: "IND-23", arch: "PHARMA_CHEMICALS" },
  { id: "BT-0561", name: "کارگاه درودگری، منبت‌کاری و مبلمان راش", ind: "IND-24", arch: "WOOD_FURNITURE" },
  { id: "BT-0601", name: "مزون طراحی مد، دوخت سفارشی و آتلیه لباس", ind: "IND-25", arch: "MANUFACTURER" },
  { id: "BT-0621", name: "چاپخانه صنعتی افست، کارتن‌سازی و جعبه‌سازی", ind: "IND-26", arch: "PRINTING_PACKAGING" },
  { id: "BT-0641", name: "گالری فرش دستباف ابریشمی و صنایع‌دستی اصیل", ind: "IND-27", arch: "HANDICRAFTS_HERITAGE" },
  { id: "BT-0661", name: "نصب و نگهداری تاسیسات، آسانسور و اعلام حریق", ind: "IND-28", arch: "LOCAL_SERVICE" },
  { id: "BT-0681", name: "واحد بازیافت پسماند صنعتی و گرانول‌سازی پلیمر", ind: "IND-29", arch: "RECYCLING_CIRCULAR" },
  { id: "BT-0701", name: "هلدینگ سرمایه‌گذاری چندرشته‌ای صنعتی و مالی", ind: "IND-30", arch: "HOLDING_CONGLOMERATE" },
  { id: "BT-0721", name: "استارتاپ عامل‌های خودمختار هوش مصنوعی و مدل‌های هیبریدی", ind: "IND-31", arch: "EMERGING_HYBRID" }
];

assert(DIVERSE_PROFILES.length >= 31, `Sampled ${DIVERSE_PROFILES.length} diverse profiles covering all 31 macro industries`);
const sampledInds = new Set(DIVERSE_PROFILES.map(p => p.ind));
assert(sampledInds.size === 31, `100% of 31 macro industries represented in diverse benchmark profiles`);

// ============================================================================
// SUITE 2: PHASE 1 ONBOARDING VS POST-SELECTION QUESTION LEAKAGE AUDIT
// ============================================================================
console.log("\n--- SUITE 2: Phase 1 Discovery Architecture & Post-Selection Neutrality ---");

// Test 2.1: step0_description is the unclassified onboarding guild-selector question
const p1Questions = getAdaptedPhaseQuestions(1);
assert(Array.isArray(p1Questions) && p1Questions.length === 7, `Phase 1 has 7 base questions (actual: ${p1Questions.length})`);

const q0 = p1Questions.find(q => q.id === "step0_description");
assert(q0 !== undefined, "Q0 step0_description exists as universal classification gateway");
assert(q0.options && q0.options.length >= 7, "Q0 options enumerate all macro business archetype categories");

// Test 2.2: Post-selection Phase 1 questions are 100% domain-neutral and free from leakage
const p1PostSelectionQuestions = p1Questions.filter(q => q.id !== "step0_description");
let p1PostSelectionViolations = 0;

for (const profile of DIVERSE_PROFILES) {
  for (const q of p1PostSelectionQuestions) {
    const texts = [q.title, q.text];
    if (q.options) q.options.forEach(o => texts.push(o.text, o.badge));
    for (const t of texts) {
      if (!t) continue;
      const res = detectCrossDomainLeakage(t, profile.ind, { allowExemptions: true });
      if (res.hasLeakage) {
        p1PostSelectionViolations++;
        console.error(`P1 post-selection leakage for ${profile.ind} (${profile.name}):`, res.violations);
      }
    }
  }
}
assert(p1PostSelectionViolations === 0, `All post-selection Phase 1 questions (probing, stage, geography, goals, offer, hypothesis) have 0 leakages across all 31 industries`);

// ============================================================================
// SUITE 3: QUESTION GENERATION & CROSS-DOMAIN ISOLATION (PHASES 2 TO 8)
// ============================================================================
console.log("\n--- SUITE 3: Dynamic Question Adaptation & Zero Cross-Domain Leakage (Phases 2-8) ---");

let totalQuestionsScanned = 0;
let totalPhaseLeakages = 0;
const leakageIncidents = [];

for (const profile of DIVERSE_PROFILES) {
  const bt = BUSINESS_TYPES_MAP[profile.id] || {};
  const context = {
    taxonomyId: profile.id,
    taxonomyTitleFa: profile.name,
    industryId: profile.ind,
    industryCode: profile.ind,
    archetype: profile.arch,
    primaryArchetype: profile.arch,
    axes: bt.axes || {},
    activeOverlays: bt.activeOverlays || []
  };

  for (let p = 2; p <= 8; p++) {
    const questions = getAdaptedPhaseQuestions(p, context);
    assert(Array.isArray(questions) && questions.length > 0, `Phase ${p} questions generated for ${profile.name} (${profile.ind})`);

    for (const q of questions) {
      totalQuestionsScanned++;
      const textsToInspect = [q.title, q.text];
      if (Array.isArray(q.options)) {
        for (const opt of q.options) {
          textsToInspect.push(opt.text, opt.badge);
        }
      }

      for (const text of textsToInspect) {
        if (!text) continue;
        const res = detectCrossDomainLeakage(text, profile.ind, {
          subDomain: profile.subDomain,
          isNonTaxSaaS: profile.isNonTaxSaaS,
          specificBtId: profile.id,
          allowExemptions: true
        });

        if (res.hasLeakage) {
          totalPhaseLeakages++;
          leakageIncidents.push({
            profile: profile.name,
            ind: profile.ind,
            phase: p,
            qId: q.id,
            violations: res.violations,
            snippet: text.slice(0, 80)
          });
        }
      }
    }
  }
}

assert(totalPhaseLeakages === 0, `Scanned ${totalQuestionsScanned} generated questions across 38 diverse business profiles with exactly 0 cross-domain leakages`);
if (totalPhaseLeakages > 0) {
  console.error("Leakage incidents:", JSON.stringify(leakageIncidents, null, 2));
}

// ============================================================================
// SUITE 4: QUANTITATIVE CLAIMS & EPISTEMIC MARKERS AUDIT
// ============================================================================
console.log("\n--- SUITE 4: Quantitative Claims & Epistemic Markers Audit ---");

let micronCount = 0;
let micronViolations = 0;
let min20Count = 0;
let min20Violations = 0;
let min45Count = 0;
let min45Violations = 0;
let month6Count = 0;
let month6Violations = 0;

for (const profile of DIVERSE_PROFILES) {
  const bt = BUSINESS_TYPES_MAP[profile.id] || {};
  const context = {
    taxonomyId: profile.id,
    taxonomyTitleFa: profile.name,
    industryId: profile.ind,
    industryCode: profile.ind,
    archetype: profile.arch,
    primaryArchetype: profile.arch,
    axes: bt.axes || {},
    activeOverlays: bt.activeOverlays || []
  };

  // Test across allPhasesTemplates (Phases 2..8)
  for (let p = 2; p <= 8; p++) {
    const qs = getAdaptedPhaseQuestions(p, context);
    for (const q of qs) {
      const texts = [q.title, q.text];
      if (q.options) q.options.forEach(o => texts.push(o.text, o.badge));

      for (const t of texts) {
        if (!t) continue;

        // 1. Check 3-micron precision machining claim
        if (t.includes("میکرون")) {
          micronCount++;
          const isAllowedMachining = profile.ind === "IND-08" || profile.name.includes("قالب") || profile.name.includes("تراش") || profile.name.includes("ماشین‌کاری");
          if (!isAllowedMachining) {
            micronViolations++;
            console.error(`❌ Illegal 3-micron claim in non-machining domain: ${profile.name} (${profile.ind})`);
          }
        }

        // 2. Check 20-minute SLA claim
        if (t.includes("۲۰ دقیقه") || t.includes("20 دقیقه")) {
          min20Count++;
          if (profile.ind !== "IND-05") {
            min20Violations++;
            console.error(`❌ Illegal 20-min claim in non-automotive domain: ${profile.name} (${profile.ind})`);
          }
        }
      }
    }
  }

  // Also test getAdaptivePhase2Questions explicitly
  const p2Adaptive = getAdaptivePhase2Questions(context);
  for (const q of p2Adaptive) {
    if (q.options) {
      for (const opt of q.options) {
        const fullText = opt.text || "";

        // Check 3 microns
        if (fullText.includes("میکرون")) {
          micronCount++;
          const isAllowedMachining = profile.ind === "IND-08" || profile.name.includes("قالب") || profile.name.includes("تراش") || profile.name.includes("ماشین‌کاری");
          if (!isAllowedMachining) {
            micronViolations++;
            console.error(`❌ Illegal 3-micron in Adaptive P2: ${profile.name} (${profile.ind})`);
          }
          if (!fullText.includes("[فرضیه استراتژیک") && !fullText.includes("[هدف")) {
            micronViolations++;
            console.error(`❌ 3-micron missing epistemic marker in ${profile.name}: ${fullText}`);
          }
        }

        // Check 20 minutes
        if (fullText.includes("۲۰ دقیقه") || fullText.includes("20 دقیقه")) {
          min20Count++;
          if (profile.ind !== "IND-05") {
            min20Violations++;
            console.error(`❌ Illegal 20-min in Adaptive P2: ${profile.name}`);
          }
          if (!fullText.includes("[هدف عملیاتی]")) {
            min20Violations++;
            console.error(`❌ 20-min missing epistemic marker in ${profile.name}: ${fullText}`);
          }
        }

        // Check 45 minutes
        if (fullText.includes("۴۵ دقیقه")) {
          min45Count++;
          if (!fullText.includes("[هدف عملیاتی]")) {
            min45Violations++;
            console.error(`❌ 45-min missing epistemic marker in ${profile.name}: ${fullText}`);
          }
        }

        // Check 6 months
        if (fullText.includes("۶ ماه")) {
          month6Count++;
          if (!fullText.includes("[فرضیه استراتژیک]")) {
            month6Violations++;
            console.error(`❌ 6-month warranty missing epistemic marker in ${profile.name}: ${fullText}`);
          }
        }
      }
    }
  }
}

assert(micronViolations === 0, `3-Micron precision machining claims strictly confined to machining domains and carry '[فرضیه استراتژیک / نمونه]' epistemic markers (${micronCount} inspected)`);
assert(min20Violations === 0, `20-Minute SLA claims strictly confined to automotive quick services and carry '[هدف عملیاتی]' epistemic markers (${min20Count} inspected)`);
assert(min45Violations === 0, `45-Minute commitments carry proper '[هدف عملیاتی]' epistemic markers (${min45Count} inspected)`);
assert(month6Violations === 0, `6-Month warranty commitments carry proper '[فرضیه استراتژیک]' epistemic markers (${month6Count} inspected)`);

// ============================================================================
// SUITE 5: REQUIREMENT R6 MANDATORY GOLDEN BENCHMARKS (ALL 6 CASES)
// ============================================================================
console.log("\n--- SUITE 5: Requirement R6 Mandatory Golden Benchmarks ---");

// Benchmark Case 1: Beauty salon vs Automotive terminology
const r6_1 = detectCrossDomainLeakage("ارائه خدمات تعویض روغن و بالانس چرخ", "IND-04");
assert(r6_1.hasLeakage === true, "R6.1: Automotive terms correctly detected and blocked in Beauty Salon (IND-04)");

// Benchmark Case 2: Textile factory vs Machining tolerance
const r6_2 = detectCrossDomainLeakage("بررسی تلرانس ۳ میکرون در خط بافندگی پارچه", "IND-25");
assert(r6_2.hasLeakage === true, "R6.2: Machining 3-micron tolerance correctly detected and blocked in Textile Mill (IND-25)");

// Benchmark Case 3: Gym management SaaS vs Moadian Tax Overkill
const r6_3 = detectCrossDomainLeakage("اتصال اجباری سامانه مودیان و ارسال صورتحساب مودیان", "IND-06", { isNonTaxSaaS: true });
assert(r6_3.hasLeakage === true, "R6.3: Moadian tax overkill correctly detected and blocked in Gym Management SaaS (IND-06)");

// Benchmark Case 4: Traditional Iranian restaurant vs Specialty Coffee Roastery
const r6_4 = detectCrossDomainLeakage("رست تخصصی قهوه و کاپینگ قهوه باریستا", "IND-03", { subDomain: "RESTAURANT" });
assert(r6_4.hasLeakage === true, "R6.4: Coffee roastery terms correctly detected and blocked in Traditional Restaurant (IND-03)");

// Benchmark Case 5: Building materials wholesaler vs Creator Economy
const r6_5 = detectCrossDomainLeakage("تولید ریلز روزانه، ولاگ روزمرگی و ریچ اکسپلور برای جذب مشتری", "IND-12");
assert(r6_5.hasLeakage === true, "R6.5: Creator economy terms correctly detected and blocked in Building Materials Wholesaler (IND-12)");

// Benchmark Case 6: Medical business vs Unsubstantiated Clinical Claims
const r6_6 = detectCrossDomainLeakage("تضمین ۱۰۰ درصدی بهبودی و درمان قطعی بدون بازگشت با داروی معجزه آسا", "IND-04");
assert(r6_6.hasLeakage === true, "R6.6: Unsubstantiated clinical treatment claims correctly detected and blocked in Healthcare/Beauty (IND-04)");

// Benchmark Positive Controls: Actual adapted questions for all 6 cases have 0 violations
const cleanCases = [
  { ind: "IND-04", id: "BT-0091", name: "Beauty Salon" },
  { ind: "IND-25", id: "BT-0601", name: "Textile Mill" },
  { ind: "IND-06", id: "BT-0168", name: "Gym SaaS", isNonTaxSaaS: true },
  { ind: "IND-03", id: "BT-0070", name: "Traditional Restaurant", subDomain: "RESTAURANT" },
  { ind: "IND-12", id: "BT-0271", name: "Building Materials Wholesaler" },
  { ind: "IND-04", id: "BT-0081", name: "Dental Clinic" }
];

let cleanCasesLeakages = 0;
for (const cc of cleanCases) {
  const bt = BUSINESS_TYPES_MAP[cc.id] || {};
  const ctx = {
    taxonomyId: cc.id,
    taxonomyTitleFa: bt.titleFa || cc.name,
    industryId: cc.ind,
    industryCode: cc.ind,
    archetype: bt.primaryArchetype,
    primaryArchetype: bt.primaryArchetype,
    axes: bt.axes,
    activeOverlays: bt.activeOverlays
  };

  for (let p = 2; p <= 8; p++) {
    const qs = getAdaptedPhaseQuestions(p, ctx);
    for (const q of qs) {
      const texts = [q.title, q.text];
      if (q.options) q.options.forEach(o => texts.push(o.text, o.badge));
      for (const t of texts) {
        if (!t) continue;
        const res = detectCrossDomainLeakage(t, cc.ind, {
          subDomain: cc.subDomain,
          isNonTaxSaaS: cc.isNonTaxSaaS,
          specificBtId: cc.id,
          allowExemptions: true
        });
        if (res.hasLeakage) {
          cleanCasesLeakages++;
          console.error(`Clean case leakage for ${cc.name}:`, res.violations);
        }
      }
    }
  }
}
assert(cleanCasesLeakages === 0, "Actual generated question templates for all 6 benchmark cases pass with 0 leakages");

// ============================================================================
// SUITE 6: EXHAUSTIVE SCALE SANITY CHECK ACROSS ALL 753 BUSINESS TYPES
// ============================================================================
console.log("\n--- SUITE 6: Macro Scale Scan Across All 753 Business Types (Phases 2 to 8) ---");

let macroChecks = 0;
let macroLeakages = 0;

for (const bt of BUSINESS_TYPES) {
  const isRestaurant = (bt.industryId === "IND-03" && !bt.titleFa.includes("قهوه") && !bt.titleFa.includes("کافه") && !bt.titleFa.includes("رستری") && bt.id !== "BT-0066" && bt.id !== "BT-0067");
  const isNonTaxSaaS = (bt.industryId === "IND-06" && bt.id !== "BT-0166" && bt.id !== "BT-0171");

  const ctx = {
    taxonomyId: bt.id,
    taxonomyTitleFa: bt.titleFa,
    industryId: bt.industryId,
    industryCode: bt.industryCode,
    archetype: bt.primaryArchetype,
    primaryArchetype: bt.primaryArchetype,
    axes: bt.axes,
    activeOverlays: bt.activeOverlays
  };

  for (let p = 2; p <= 8; p++) {
    const qs = getAdaptedPhaseQuestions(p, ctx);
    for (const q of qs) {
      macroChecks++;
      const texts = [q.title, q.text];
      if (q.options) q.options.forEach(o => texts.push(o.text, o.badge));
      for (const t of texts) {
        if (!t) continue;
        const leak = detectCrossDomainLeakage(t, bt.industryId, {
          subDomain: isRestaurant ? "RESTAURANT" : undefined,
          isNonTaxSaaS: isNonTaxSaaS,
          specificBtId: bt.id,
          allowExemptions: true
        });
        if (leak.hasLeakage) {
          macroLeakages++;
        }
      }
    }
  }
}

assert(macroChecks > 15000, `Macro scale scan executed ${macroChecks} question assertions across all 753 business types`);
assert(macroLeakages === 0, `Zero cross-domain leakages across entire 753 business taxonomy (Phases 2-8)`);

// ============================================================================
// FINAL SUMMARY & VERDICT
// ============================================================================
console.log("\n======================================================================");
console.log(`📊 FINAL RESULT: ${passedAssertions} PASSED, ${failedAssertions} FAILED`);
console.log("======================================================================");

if (failedAssertions === 0) {
  console.log("🎉 ALL ADVERSARIAL STRESS CHECKS PASSED EMPIRICALLY WITH ZERO LEAKAGES.");
  process.exit(0);
} else {
  console.error(`💥 TEST SUITE FAILED WITH ${failedAssertions} ERRORS.`);
  process.exit(1);
}
