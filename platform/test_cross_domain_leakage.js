// DIGITAL MARKET — Cross-Domain Leakage Test Harness (Milestone 4 / Requirement R6)
// Verifies 31-Industry Vocabulary Allowlists and Cross-Domain Contaminant Isolation.
// Target location: platform/test_cross_domain_leakage.js

import {
  INDUSTRY_VOCABULARY_MAP,
  CROSS_DOMAIN_CONTAMINANT_CATEGORIES,
  getIndustryVocabulary,
  getAllowedVocabulary,
  getForbiddenTerms,
  detectCrossDomainLeakage
} from "./src/data/industryVocabularyMap.js";
import { MACRO_INDUSTRIES, BUSINESS_TYPES } from "./src/data/businessTaxonomy753.js";

console.log("======================================================================");
console.log("🛡️ TEST HARNESS: 31-INDUSTRY CROSS-DOMAIN LEAKAGE ISOLATION AUDIT (R6)");
console.log("======================================================================\n");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// ============================================================================
// SUITE 1: 31-INDUSTRY REGISTRY COMPLETENESS & SCHEMA INTEGRITY
// ============================================================================
console.log("--- SUITE 1: 31-Industry Vocabulary Registry Completeness ---");

const registeredKeys = Object.keys(INDUSTRY_VOCABULARY_MAP);
assert(registeredKeys.length === 31, `Exactly 31 macro industries mapped in vocabulary registry (actual: ${registeredKeys.length})`);

let allIndValid = true;
for (let i = 1; i <= 31; i++) {
  const indId = `IND-${String(i).padStart(2, "0")}`;
  const ind = INDUSTRY_VOCABULARY_MAP[indId];
  if (!ind) {
    allIndValid = false;
    console.error(`Missing vocabulary entry for ${indId}`);
    continue;
  }
  if (!ind.titleFa || !ind.titleEn || !ind.code || !ind.primaryArchetype) {
    allIndValid = false;
    console.error(`Incomplete metadata in ${indId}`);
  }
  if (!Array.isArray(ind.allowedTerms) || ind.allowedTerms.length < 10) {
    allIndValid = false;
    console.error(`${indId} has fewer than 10 allowed terms (actual: ${ind.allowedTerms?.length})`);
  }
  if (!Array.isArray(ind.allowedConcepts) || ind.allowedConcepts.length < 3) {
    allIndValid = false;
    console.error(`${indId} has fewer than 3 allowed concepts (actual: ${ind.allowedConcepts?.length})`);
  }
  if (!Array.isArray(ind.forbiddenContaminantCategories) || ind.forbiddenContaminantCategories.length === 0) {
    allIndValid = false;
    console.error(`${indId} has empty forbiddenContaminantCategories`);
  }
  // Validate referenced category IDs
  for (const catId of ind.forbiddenContaminantCategories) {
    if (!CROSS_DOMAIN_CONTAMINANT_CATEGORIES[catId]) {
      allIndValid = false;
      console.error(`${indId} references unknown category: ${catId}`);
    }
  }
}
assert(allIndValid, "All 31 industries (IND-01 to IND-31) have complete, valid schemas and non-empty allowlists/forbidden rules");

// ============================================================================
// SUITE 2: REQUIREMENT R6 MANDATORY BENCHMARK CASES (THE 6 GOLDEN SCENARIOS)
// ============================================================================
console.log("\n--- SUITE 2: Requirement R6 Mandatory Golden Benchmark Scenarios ---");

// Case 1: Beauty salon must NOT reference automotive terms
const case1 = detectCrossDomainLeakage(
  "آیا در سالن زیبایی و کلینیک پوست شما، خدمات تعویض روغن و تنظیم جک هیدرولیک خودرو ارائه می‌شود؟",
  "IND-04"
);
assert(case1.hasLeakage === true, "R6 Case 1: Beauty salon receiving automotive terms is detected as leakage");
assert(
  case1.violations.some(v => v.term.includes("تعویض روغن") || v.term.includes("جک هیدرولیک")),
  "R6 Case 1: Specific automotive violation terms identified"
);

// Case 2: Textile factory must NOT get machining tolerance questions
const case2 = detectCrossDomainLeakage(
  "در خط بافندگی و تریکودوزی کارخانه نساجی، آیا تلرانس ۳ میکرون قطعات با فرزکاری cnc کنترل می‌شود؟",
  "IND-25"
);
assert(case2.hasLeakage === true, "R6 Case 2: Textile factory receiving machining tolerance is detected as leakage");
assert(
  case2.violations.some(v => v.term.includes("تلرانس ۳ میکرون") || v.term.includes("فرزکاری")),
  "R6 Case 2: Specific machining tolerance violation terms identified"
);

// Case 3: Gym management SaaS must NOT default to Moadian tax compliance
const case3 = detectCrossDomainLeakage(
  "مهم‌ترین ارزش پیشنهادی نرم‌افزار مدیریت باشگاه بدنسازی و فیتنس شما اتصال اجباری سامانه مودیان و ارسال فاکتور ماده ۱۶۹ مکرر است؟",
  "IND-06",
  { isNonTaxSaaS: true }
);
assert(case3.hasLeakage === true, "R6 Case 3: Gym management SaaS forced into Moadian tax compliance is detected as leakage");
assert(
  case3.violations.some(v => v.term.includes("سامانه مودیان")),
  "R6 Case 3: Specific Moadian tax overkill violation identified"
);

// Case 4: Iranian restaurant must NOT be assumed to be a coffee roastery
const case4 = detectCrossDomainLeakage(
  "در منوی رستوران سنتی و چلوکبابی شما، آیا از دانه سبز قهوه با رست تخصصی قهوه و کالیبراسیون آسیاب قهوه توسط باریستا استفاده می‌شود؟",
  "IND-03",
  { subDomain: "RESTAURANT" }
);
assert(case4.hasLeakage === true, "R6 Case 4: Traditional Iranian restaurant assumed to be a coffee roastery is detected as leakage");
assert(
  case4.violations.some(v => v.term.includes("رست") || v.term.includes("دانه سبز") || v.term.includes("آسیاب قهوه")),
  "R6 Case 4: Specific coffee roastery violation terms identified"
);

// Case 5: Wholesaler must NOT receive Creator Economy vocabulary
const case5 = detectCrossDomainLeakage(
  "استراتژی بازاریابی و فروش عمده آهن‌آلات و مصالح ساختمانی شما تمرکز بر تولید ولاگ روزمرگی و ریچ اکسپلور در شبکه‌های اجتماعی است؟",
  "IND-12"
);
assert(case5.hasLeakage === true, "R6 Case 5: Building materials wholesaler receiving Creator Economy terms is detected as leakage");
assert(
  case5.violations.some(v => v.term.includes("ولاگ") || v.term.includes("اکسپلور")),
  "R6 Case 5: Specific Creator Economy violation terms identified"
);

// Case 6: Medical business must NOT generate unsubstantiated treatment claims
const case6 = detectCrossDomainLeakage(
  "کلینیک پوست و موی ما تضمین ۱۰۰ درصدی بهبودی و درمان قطعی بدون بازگشت را با داروی معجزه آسا بدون نیاز به تاییدیه ارائه می‌دهد.",
  "IND-04"
);
assert(case6.hasLeakage === true, "R6 Case 6: Medical business generating unsubstantiated treatment claims is detected as leakage");
assert(
  case6.violations.some(v => v.term.includes("تضمین") || v.term.includes("درمان قطعی") || v.term.includes("معجزه")),
  "R6 Case 6: Specific unsubstantiated clinical claim violation terms identified"
);

// ============================================================================
// SUITE 3: NEGATIVE CONTROLS (CLEAN DOMAIN TEXTS ACROSS ALL 31 INDUSTRIES)
// ============================================================================
console.log("\n--- SUITE 3: Negative Controls (Clean Domain Texts Across All 31 Industries) ---");

const CLEAN_INDUSTRY_SAMPLES = {
  "IND-01": "چیدمان ویترین فروشگاه و کنترل پاخور مشتریان حضوری همراه با سیستم pos و فاکتور فروش صندوق",
  "IND-02": "بهینه‌سازی نرخ تبدیل سبد خرید آنلاین در آنلاین‌شاپ با اتصال درگاه پرداخت و ارسال پست پیشتاز",
  "IND-03": "کنترل فودکاست منوی غذا و افزایش سرعت گردش میزها با حفظ کیفیت طعم سرآشپز در رستوران",
  "IND-04": "مشاوره تخصصی پوست و ثبت پرونده سلامت مراجعان با رعایت پروتکل بهداشتی و استریلیزاسیون کلینیک",
  "IND-05": "تعویض روغنی و اتوسرویس با جک هیدرولیک و تعویض لنت ترمز و روغن موتور در کمترین زمان",
  "IND-06": "ارائه نرم‌افزار ابری با اشتراک ماهانه mrr و کاهش زمان فعال‌سازی کاربر با امنیت داده بالا",
  "IND-07": "پلتفرم مارکت‌پلیس دوطرفه برای تسهیل معامله بین خریدار و فروشنده با کمیسیون شفاف و کارمزد پلتفرم",
  "IND-08": "ماشین‌کاری سنگین و تراشکاری cnc با کنترل کیفیت قطعه و استاندارد iso در تولید صنعتی b2b",
  "IND-09": "تزریق پلاستیک در خط مونتاژ کارگاهی و عرضه کالا از طریق شبکه پخش مویرگی با حداقل تیراژ moq",
  "IND-10": "تولید مواد غذایی با نشان سیب سلامت و بسته‌بندی بهداشتی اسپتیک تحت نظارت سازمان غذا و دارو",
  "IND-11": "پیمانکاری پروژه عمرانی با اجرای اسکلت بتنی و آرماتوربندی مطابق نقشه‌های مهندس ناظر و پروانه نظام مهندسی",
  "IND-12": "بنکداری آهن‌آلات، میلگرد ساختمانی و تیرآهن با فروش اعتباری و تحویل پای کار پروژه ساختمانی",
  "IND-13": "ترابری جاده‌ای و ناوگان حمل‌ونقل با صدور بارنامه دولتی و مدیریت انبارداری با سیستم wms",
  "IND-14": "کشت مکانیزه در گلخانه هیدروپونیک با آبیاری قطره‌ای و اصلاح بذر تحت نظارت جهاد کشاورزی",
  "IND-15": "ارائه خدمات مشاوره مدیریت و تنظیم لوایح حقوقی و قراردادهای تجاری ریتاینر برای شرکت‌ها",
  "IND-16": "اجرای کمپین ۳۶۰ درجه تبلیغاتی و روابط عمومی pr با پورتفولیو دیزاین هویت برند و سئو",
  "IND-17": "سبدگردانی اختصاصی در بورس اوراق بهادار و مدیریت ریسک دارایی‌ها تحت نظارت بانک مرکزی",
  "IND-18": "آموزش دوره‌های مهارتی با ارائه مدرک معتبر سازمان آموزش فنی و حرفه‌ای و سیستم lms",
  "IND-19": "تولید محتوای ویدئویی در یوتیوب و انتشار منظم پادکست برای کامیونیتی وفادار و جذب اسپانسر",
  "IND-20": "رزرو هتل و اقامتگاه بوم‌گردی با ارائه تورهای سیاحتی و ترانسفر فرودگاهی برای گردشگران",
  "IND-21": "مشاوره املاک و تنظیم مبایعه‌نامه رسمی با استعلام کد رهگیری سامانه املاک و سند تک‌برگ",
  "IND-22": "اکتشاف و استخراج ماده معدنی سنگ‌آهن با خط خردایش و رعایت کامل ایمنی معادن hse",
  "IND-23": "تولید مواد موثره دارویی api با رعایت استاندارد gmp در اتاق تمیز کلین‌روم سازمان غذا و دارو",
  "IND-24": "ساخت مبلمان کلاف چوب راش و منبت‌کاری ظریف همراه با کابینت‌سازی ام‌دی‌اف در شوروم کارخانه",
  "IND-25": "کارخانه نساجی بافندگی پارچه و تریکودوزی صنعتی پوشاک با الگوی برش دقیق و طاقه پارچه پنبه‌ای",
  "IND-26": "چاپخانه افست مدرن با زینک چاپ و کارتن‌سازی سه‌لایه کنگره‌ای همراه با دایکات جعبه",
  "IND-27": "گالری فرش دستباف اصیل با رنگرزی سنتی خامه و ارائه شناسنامه معتبر صنایع دستی فاخر",
  "IND-28": "نصب دوربین مداربسته ip و نگهداری سیستم اعلام حریق اماکن با تاییدیه سازمان آتش‌نشانی",
  "IND-29": "بازیافت پسماند و تفکیک ضایعات از مبدا جهت تولید پرک پت و گرانول با مجوز محیط‌زیست",
  "IND-30": "حاکمیت شرکتی هلدینگ چندرشته‌ای و بودجه‌بندی استراتژیک برای ایجاد هم‌افزایی در شرکت‌های تابعه",
  "IND-31": "مدل کسب‌وکار نوآورانه هیبرید با اعتبارسنجی سریع فرضیات mvp و استفاده از عامل‌های هوش مصنوعی"
};

let allCleanPass = true;
for (const [indId, text] of Object.entries(CLEAN_INDUSTRY_SAMPLES)) {
  const result = detectCrossDomainLeakage(text, indId);
  if (result.hasLeakage) {
    allCleanPass = false;
    console.error(`False positive leakage in clean sample for ${indId}:`, result.violations);
  }
  if (result.allowedTermsCount === 0) {
    allCleanPass = false;
    console.error(`Zero allowed terms matched for clean sample in ${indId}`);
  }
}
assert(allCleanPass, "Zero false positives across all 31 macro industries on legitimate domain text");

// ============================================================================
// SUITE 4: CROSS-DOMAIN CONTAMINANT INJECTION STRESS MATRIX (ALL 31 INDUSTRIES)
// ============================================================================
console.log("\n--- SUITE 4: Cross-Domain Contaminant Injection Matrix (100% Recall) ---");

const INJECTION_TESTS = [
  { ind: "IND-01", contaminant: "تعویض روغن گیربکس اتوماتیک", label: "Automotive in Retail" },
  { ind: "IND-02", contaminant: "تلرانس ابعادی ۳ میکرون", label: "Machining in E-Commerce" },
  { ind: "IND-03", contaminant: "سبدگردانی بورس اوراق بهادار", label: "Stock Market in Restaurant" },
  { ind: "IND-04", contaminant: "جک هیدرولیک خودرو", label: "Automotive in Beauty/Health" },
  { ind: "IND-05", contaminant: "کاشت ناخن و فیشیال پوست", label: "Beauty salon in Auto Repair" },
  { ind: "IND-06", contaminant: "بتن ریزی فونداسیون مسلح", label: "Civil construction in SaaS" },
  { ind: "IND-07", contaminant: "تراشکاری سنگین فلزات", label: "Machining in Marketplace" },
  { ind: "IND-08", contaminant: "استوری لایف استایل روزمرگی", label: "Vlogging in Heavy Machinery" },
  { ind: "IND-09", contaminant: "درمان قطعی بدون بازگشت", label: "Medical claim in Light Goods" },
  { ind: "IND-10", contaminant: "روغن موتور خودرو دیزلی", label: "Motor oil in Food Processing" },
  { ind: "IND-11", contaminant: "رست دانه سبز قهوه تخصصی", label: "Coffee roastery in Construction" },
  { ind: "IND-12", contaminant: "تولید ریلز روزانه و چالش رقص", label: "Influencer in Wholesale" },
  { ind: "IND-13", contaminant: "تراشکاری سنبه ماتریس دقیق", label: "Machining in Logistics" },
  { ind: "IND-14", contaminant: "بالانس چرخ و لاستیک سواری", label: "Car mechanic in Agriculture" },
  { ind: "IND-15", contaminant: "تعویض فیلتر روغن خودرو", label: "Automotive in Legal/Consulting" },
  { ind: "IND-16", contaminant: "ماشین کاری قطعات چدنی با تلرانس ۳ میکرون", label: "Machining in PR/Ad Agency" },
  { ind: "IND-17", contaminant: "کارواش نانو بخار خودرو", label: "Carwash in Financial Services" },
  { ind: "IND-18", contaminant: "کوره ذوب آهن و متالورژی", label: "Blast furnace in Education" },
  { ind: "IND-19", contaminant: "ریخته گری فولاد آلیاژی سنگین", label: "Heavy metallurgy in Creator Media" },
  { ind: "IND-20", contaminant: "بخش مراقبت های ویژه ccu", label: "Intensive hospital care in Tourism" },
  { ind: "IND-21", contaminant: "تعویض روغن موتور پراید", label: "Oil change in Real Estate" },
  { ind: "IND-22", contaminant: "فیشیال پوست صورت و مزوتراپی", label: "Skin facial in Mining" },
  { ind: "IND-23", contaminant: "تعویض لنت ترمز خودرو پژو", label: "Brake pads in Pharma/Chemicals" },
  { ind: "IND-24", contaminant: "ریخته گری فولاد مذاب صنعتی", label: "Molten steel in Woodwork" },
  { ind: "IND-25", contaminant: "تلرانس ۳ میکرون ابعادی", label: "Machining tolerance in Textiles" },
  { ind: "IND-26", contaminant: "تعویض فیلتر روغن موتور خودرو", label: "Automotive in Printing" },
  { ind: "IND-27", contaminant: "خط اکستروژن فلزات سنگین", label: "Heavy extrusion in Handicrafts" },
  { ind: "IND-28", contaminant: "کاشت ناخن ژلیش و اکستنشن", label: "Nails cosmetic in Building Safety" },
  { ind: "IND-29", contaminant: "اقامت هتل ۵ ستاره تشریفاتی", label: "Luxury hotel in Recycling" },
  { ind: "IND-30", contaminant: "تعویض روغن درجا اتومبیل", label: "Street auto mechanic in Holding" },
  { ind: "IND-31", contaminant: "کوره ذوب بلند سنتی با تلرانس ۳ میکرون", label: "Traditional heavy smelting in Frontier" }
];

let allInjectionsDetected = true;
for (const test of INJECTION_TESTS) {
  const dirtyText = `متن عملیاتی کسب‌وکار ما شامل ${test.contaminant} می‌باشد.`;
  const res = detectCrossDomainLeakage(dirtyText, test.ind);
  if (!res.hasLeakage) {
    allInjectionsDetected = false;
    console.error(`Failed to detect contaminant in ${test.ind} (${test.label})`);
  }
}
assert(allInjectionsDetected, "100% of injected cross-domain contaminants detected across all 31 industries");

// ============================================================================
// SUITE 5: EXEMPTION & CONTRAST HANDLING
// ============================================================================
console.log("\n--- SUITE 5: Contrast & Exemption Boundary Handling ---");

const contrastText = "برخلاف تعویض روغن و خدمات خودرویی، فعالیت سالن زیبایی ما منحصراً در زمینه مراقبت پوست و مو می‌باشد.";
const contrastRes = detectCrossDomainLeakage(contrastText, "IND-04", { allowExemptions: true });
assert(contrastRes.hasLeakage === false, "Explicit contrast ('برخلاف تعویض روغن') is gracefully exempted when allowExemptions is true");

const withoutExemptRes = detectCrossDomainLeakage(contrastText, "IND-04", { allowExemptions: false });
assert(withoutExemptRes.hasLeakage === true, "When allowExemptions is false, raw word occurrence is strictly detected");

// ============================================================================
// SUITE 6: SAFETY, INPUT RESILIENCE & API CONTRACTS
// ============================================================================
console.log("\n--- SUITE 6: API Resilience & Input Safety ---");

assert(detectCrossDomainLeakage("", "IND-01").hasLeakage === false, "Empty string returns clean object without throwing");
assert(detectCrossDomainLeakage(null, "IND-01").hasLeakage === false, "Null text returns clean object without throwing");
assert(detectCrossDomainLeakage("test", "NON_EXISTENT_IND").hasLeakage === false, "Unknown industry handles gracefully with error property");

const ind05Terms = getAllowedVocabulary("IND-05");
assert(Array.isArray(ind05Terms) && ind05Terms.includes("تعویض روغنی"), "getAllowedVocabulary returns populated array for valid industry");

const ind04Forbidden = getForbiddenTerms("IND-04");
assert(Array.isArray(ind04Forbidden) && ind04Forbidden.includes("تعویض روغن"), "getForbiddenTerms compiles category and specific terms");

// ============================================================================
// SUMMARY & AUDIT CERTIFICATION
// ============================================================================
console.log("\n======================================================================");
console.log(`📊 FINAL RESULT: ${passCount} PASSED, ${failCount} FAILED`);
console.log("======================================================================");

if (failCount === 0) {
  console.log("🎉 ALL 31-INDUSTRY LEAKAGE ISOLATION TESTS PASSED OBJECTIVELY WITH ZERO REGRESSIONS.");
  process.exit(0);
} else {
  console.error("❌ TEST FAILURES DETECTED.");
  process.exit(1);
}
