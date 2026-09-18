// DIGITAL MARKET — Milestone 4 Adversarial Stress Test Suite
// Challenger 1 (challenger_m4_1)
// Rigorously tests 8-Tier Specialization Hierarchy (R5) & 31-Industry Cross-Domain Leakage Prevention (R6)
// Targets: platform/src/data/businessContextRouter.js & platform/src/data/industryVocabularyMap.js

import {
  resolveDomainSpecialization,
  getPhaseAdaptationRules
} from "./src/data/businessContextRouter.js";

import {
  INDUSTRY_VOCABULARY_MAP,
  CROSS_DOMAIN_CONTAMINANT_CATEGORIES,
  detectCrossDomainLeakage,
  isTermAllowedInIndustry,
  getAllowedVocabulary,
  getForbiddenTerms
} from "./src/data/industryVocabularyMap.js";

import { BUSINESS_TYPES_MAP, MACRO_INDUSTRIES } from "./src/data/businessTaxonomy753.js";

console.log("================================================================================");
console.log("🛡️ ADVERSARIAL STRESS TEST HARNESS — MILESTONE 4 (CHALLENGER 1)");
console.log("================================================================================\n");

let passCount = 0;
let failCount = 0;
const vulnerabilities = [];
const observations = [];

function assert(condition, message, failureDetails = "") {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
    return true;
  } else {
    console.error(`  ❌ FAIL: ${message} ${failureDetails ? `[${failureDetails}]` : ""}`);
    failCount++;
    vulnerabilities.push({ message, details: failureDetails });
    return false;
  }
}

// Helper: safe execution wrapper to prevent test runner crashes while recording failures
function safeRun(fn) {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err };
  }
}

// ==============================================================================
// SUITE 1: EDGE-CASE INPUTS TO resolveDomainSpecialization (R5)
// ==============================================================================
console.log("--- SUITE 1: Edge-Case Inputs to resolveDomainSpecialization ---");

// 1.1 Unknown taxonomy IDs
{
  const res1 = safeRun(() => resolveDomainSpecialization("BT-9999"));
  assert(res1.ok, "Unknown BT-9999 does not crash");
  if (res1.ok) {
    assert(res1.value.taxonomyId === "BT-0753" || res1.value.taxonomyId === "BT-9999", "Unknown BT falls back gracefully to frontier BT-0753");
    assert(Array.isArray(res1.value.terminologyAllowlist), "Allowlist is returned as array");
    assert(Array.isArray(res1.value.forbiddenTerms), "Forbidden terms returned as array");
  }

  const res2 = safeRun(() => resolveDomainSpecialization({ taxonomyId: "BT-9999" }));
  assert(res2.ok, "Unknown BT object does not crash");
  if (res2.ok) {
    assert(res2.value.specializationLevel === "ARCHETYPE_FALLBACK", "Unknown BT object falls back to ARCHETYPE_FALLBACK");
  }

  const res3 = safeRun(() => resolveDomainSpecialization("NOT_A_BT_OR_IND"));
  assert(res3.ok, "Malformed string input does not crash");
}

// 1.2 Null and undefined inputs
{
  const resUndef = safeRun(() => resolveDomainSpecialization(undefined));
  assert(resUndef.ok, "Undefined input does not crash");
  if (resUndef.ok) {
    assert(resUndef.value.specializationLevel === "ARCHETYPE_FALLBACK", "Undefined input assigns ARCHETYPE_FALLBACK");
    assert(resUndef.value.industryId === "IND-31", "Undefined input falls back to IND-31");
  }

  const resNull = safeRun(() => resolveDomainSpecialization(null));
  assert(
    resNull.ok,
    "Null businessTypeInput handled gracefully without throwing TypeError",
    resNull.error ? `CRASH: ${resNull.error.message}` : ""
  );

  const resEmptyObj = safeRun(() => resolveDomainSpecialization({}));
  assert(resEmptyObj.ok, "Empty object input does not crash");

  const resNullTaxId = safeRun(() => resolveDomainSpecialization({ taxonomyId: null }));
  assert(resNullTaxId.ok, "Object with null taxonomyId does not crash");

  const resNullAxesProp = safeRun(() => resolveDomainSpecialization({ taxonomyId: "BT-0001", axes: null }));
  assert(resNullAxesProp.ok, "Object with null axes property does not crash");
}

// 1.3 Partial axes and null contextAxes
{
  const resPartial1 = safeRun(() => resolveDomainSpecialization("BT-0001", { customerModel: "B2B" }));
  assert(resPartial1.ok, "Partial axes do not crash");
  if (resPartial1.ok) {
    assert(resPartial1.value.axes.customerModel === "B2B", "Partial axis customerModel override is honored");
    assert(resPartial1.value.axes.offerType === "PRODUCT", "Unspecified axis offerType falls back to BT default");
  }

  const resPartial2 = safeRun(() => resolveDomainSpecialization("BT-0001", { scale: "MICRO" }));
  assert(resPartial2.ok, "Partial scale axis does not crash");
  if (resPartial2.ok) {
    assert(resPartial2.value.axes.scale === "MICRO", "Scale axis override is honored");
  }

  const resNullAxes = safeRun(() => resolveDomainSpecialization("BT-0001", null));
  assert(
    resNullAxes.ok,
    "Explicit null contextAxes parameter handled gracefully without throwing TypeError",
    resNullAxes.error ? `CRASH: ${resNullAxes.error.message}` : ""
  );
}

// 1.4 Invalid / boundary phase numbers
{
  const resPhase0 = safeRun(() => resolveDomainSpecialization("BT-0001", {}, 0));
  assert(resPhase0.ok, "Phase number 0 does not crash");

  const resPhaseNeg = safeRun(() => resolveDomainSpecialization("BT-0001", {}, -1));
  assert(resPhaseNeg.ok, "Negative phase number does not crash");

  const resPhase9 = safeRun(() => resolveDomainSpecialization("BT-0001", {}, 9));
  assert(resPhase9.ok, "Out of range phase 9 does not crash");

  const resPhaseStr = safeRun(() => resolveDomainSpecialization("BT-0001", {}, "invalid"));
  assert(resPhaseStr.ok, "Invalid string phaseNumber does not crash");
  if (resPhaseStr.ok) {
    assert(!Number.isNaN(resPhaseStr.value.phaseNumber), "Invalid string phaseNumber falls back to valid number (not NaN)", `Current phaseNumber is ${resPhaseStr.value.phaseNumber}`);
  }

  const resPhaseNaN = safeRun(() => resolveDomainSpecialization("BT-0001", {}, NaN));
  assert(resPhaseNaN.ok, "NaN phaseNumber does not crash");
  if (resPhaseNaN.ok) {
    assert(!Number.isNaN(resPhaseNaN.value.phaseNumber), "NaN phaseNumber falls back to a valid number (e.g. 1)");
  }

  const resPhaseNull = safeRun(() => resolveDomainSpecialization("BT-0001", {}, null));
  assert(resPhaseNull.ok, "Null phaseNumber does not crash");
}

// 1.5 Null options argument
{
  const resNullOptions = safeRun(() => resolveDomainSpecialization("BT-0001", {}, 1, null));
  assert(
    resNullOptions.ok,
    "Null options argument handled gracefully without throwing TypeError",
    resNullOptions.error ? `CRASH: ${resNullOptions.error.message}` : ""
  );
}

// 1.6 Odd input types
{
  const resNum = safeRun(() => resolveDomainSpecialization(12345));
  assert(resNum.ok, "Number input does not crash");

  const resBool = safeRun(() => resolveDomainSpecialization(true));
  assert(resBool.ok, "Boolean input does not crash");

  const resArr = safeRun(() => resolveDomainSpecialization(["BT-0001"]));
  assert(resArr.ok, "Array input does not crash");
}

// ==============================================================================
// SUITE 2: ADVERSARIAL OBFUSCATED TEXT INJECTIONS INTO detectCrossDomainLeakage (R6)
// ==============================================================================
console.log("\n--- SUITE 2: Adversarial Obfuscation Injections into detectCrossDomainLeakage ---");

// 2.1 Spacing & whitespace manipulations
{
  const multiSpaceText = "ارائه خدمات سالن زیبایی با تعویض        روغن و تنظیم موتور خودرو";
  const rMultiSpace = detectCrossDomainLeakage(multiSpaceText, "IND-04");
  assert(rMultiSpace.hasLeakage === true, "Multi-space obfuscated contaminant is detected ('تعویض   روغن')");

  const tabNewlineText = "ارائه خدمات سالن زیبایی با تعویض\t\nروغن\nموتور خودرو";
  const rTabNewline = detectCrossDomainLeakage(tabNewlineText, "IND-04");
  assert(rTabNewline.hasLeakage === true, "Tab and newline obfuscated contaminant is detected");

  const edgeSpaceText = "   تعویض روغن    ";
  const rEdgeSpace = detectCrossDomainLeakage(edgeSpaceText, "IND-04");
  assert(rEdgeSpace.hasLeakage === true, "Edge whitespace contaminant is detected");
}

// 2.2 Invisible Unicode & Persian Half-Spaces
{
  const zwnjText = "ارائه خدمات کلینیک زیبایی همراه با تعویض‌روغن خودرو و کارواش نانو";
  const rZwnj = detectCrossDomainLeakage(zwnjText, "IND-04");
  assert(rZwnj.hasLeakage === true, "ZWNJ (half-space) separated contaminant is detected ('تعویض‌روغن')");

  const zwspText = "ارائه خدمات کلینیک با تعویض\u200bروغن خودرو";
  const rZwsp = detectCrossDomainLeakage(zwspText, "IND-04");
  assert(rZwsp.hasLeakage === true, "Zero-width space (ZWSP) separated contaminant is detected");

  const bomText = "ارائه خدمات کلینیک با تعویض\ufeffروغن خودرو";
  const rBom = detectCrossDomainLeakage(bomText, "IND-04");
  assert(rBom.hasLeakage === true, "Byte Order Mark (BOM) separated contaminant is detected");

  const rlmText = "ارائه خدمات کلینیک با تعویض\u200fروغن خودرو";
  const rRlm = detectCrossDomainLeakage(rlmText, "IND-04");
  assert(rRlm.hasLeakage === true, "Right-to-Left Mark (RLM) separated contaminant is detected");
}

// 2.3 Persian Harakat / Diacritics
{
  const harakatText = "ارائه خدمات با تَعْوِیضِ رَوْغَن و کَارْوَاش نَانُو در سالن زیبایی";
  const rHarakat = detectCrossDomainLeakage(harakatText, "IND-04");
  assert(rHarakat.hasLeakage === true, "Harakat diacritics (Fatha, Kasra, Damma, Sukun) stripped and detected");
}

// 2.4 Arabic Character Normalization
{
  const arabicYehText = "ارائه خدمات تعويض روغن و تنظيم موتور در كلينيك پوست";
  const rYeh = detectCrossDomainLeakage(arabicYehText, "IND-04");
  assert(rYeh.hasLeakage === true, "Arabic Yeh (ي) normalized and contaminant detected");

  const arabicKafText = "خدمات كارواش نانو در فروشگاه پوشاك";
  const rKaf = detectCrossDomainLeakage(arabicKafText, "IND-01");
  assert(rKaf.hasLeakage === true, "Arabic Kaf (ك) normalized and contaminant detected");
}

// 2.5 English Acronym Case Variations
{
  const cncUpper = "کارخانه نساجی با فرزکاری CNC قطعات فلزی";
  const rCncUpper = detectCrossDomainLeakage(cncUpper, "IND-25");
  assert(rCncUpper.hasLeakage === true, "Uppercase English acronym (CNC) detected as leakage in Textiles");

  const cncLower = "کارخانه نساجی با فرزکاری cnc قطعات فلزی";
  const rCncLower = detectCrossDomainLeakage(cncLower, "IND-25");
  assert(rCncLower.hasLeakage === true, "Lowercase English acronym (cnc) detected as leakage in Textiles");

  const cncMixed = "کارخانه نساجی با فرزکاری Cnc قطعات فلزی";
  const rCncMixed = detectCrossDomainLeakage(cncMixed, "IND-25");
  assert(rCncMixed.hasLeakage === true, "Mixed-case English acronym (Cnc) detected as leakage in Textiles");

  const ndtUpper = "کارگاه تریکو با تست غیرمخرب NDT پارچه";
  const rNdtUpper = detectCrossDomainLeakage(ndtUpper, "IND-25");
  assert(rNdtUpper.hasLeakage === true, "Uppercase NDT detected in Textiles");
}

// 2.6 Punctuation Separators
{
  const underscoreText = "خدمات تعویض_روغن در سالن زیبایی";
  const rUnderscore = detectCrossDomainLeakage(underscoreText, "IND-04");
  assert(rUnderscore.hasLeakage === true, "Underscore separated words ('تعویض_روغن') detected");

  const dashText = "خدمات تعویض-روغن در سالن زیبایی";
  const rDash = detectCrossDomainLeakage(dashText, "IND-04");
  assert(rDash.hasLeakage === true, "Dash separated words ('تعویض-روغن') detected");

  const slashText = "خدمات تعویض/روغن در سالن زیبایی";
  const rSlash = detectCrossDomainLeakage(slashText, "IND-04");
  assert(rSlash.hasLeakage === true, "Slash separated words ('تعویض/روغن') detected");

  // Period / Dot separator (Adversarial test)
  const dotText = "خدمات تعویض.روغن در سالن زیبایی";
  const rDot = detectCrossDomainLeakage(dotText, "IND-04");
  assert(
    rDot.hasLeakage === true,
    "Dot/period separated words ('تعویض.روغن') detected",
    rDot.hasLeakage ? "" : "POTENTIAL EVASION: Period '.' is not normalized to space in normalizePersianText"
  );
}

// 2.7 Number and Persian Word Boundary
{
  const noSpaceNumText = "کنترل قطعات با تلرانس ۳میکرون در کارخانه نساجی";
  const rNoSpaceNum = detectCrossDomainLeakage(noSpaceNumText, "IND-25");
  assert(
    rNoSpaceNum.hasLeakage === true,
    "Unspaced Persian number and unit ('۳میکرون') detected",
    rNoSpaceNum.hasLeakage ? "" : "POTENTIAL EVASION: Unspaced numeral '۳میکرون' misses 'تلرانس ۳ میکرون' substring match"
  );
}

// 2.8 detectCrossDomainLeakage API Safety & Null options
{
  const resNullOpt = safeRun(() => detectCrossDomainLeakage("متن تستی", "IND-01", null));
  assert(
    resNullOpt.ok,
    "detectCrossDomainLeakage handles null options without throwing TypeError",
    resNullOpt.error ? `CRASH: ${resNullOpt.error.message}` : ""
  );
}

// ==============================================================================
// SUITE 3: CONTRAST EXEMPTION BOUNDARY ABUSE (R6)
// ==============================================================================
console.log("\n--- SUITE 3: Contrast Exemption Boundary Abuse ---");

// 3.1 Legitimate contrast exemption (golden behavior)
{
  const legitContrast = "برخلاف تعویض روغن های سنتی، ما در سالن زیبایی مراقبت تخصصی پوست ارائه می‌دهیم.";
  const rLegit = detectCrossDomainLeakage(legitContrast, "IND-04", { allowExemptions: true });
  assert(rLegit.hasLeakage === false, "Legitimate single contrast exemption ('برخلاف تعویض روغن') is not flagged");
}

// 3.2 Contrast prefix with 3 words
{
  const threeWordContrast = "برخلاف تعویض روغن سنتی، سالن ما فقط مراقبت پوست دارد.";
  const rThreeWord = detectCrossDomainLeakage(threeWordContrast, "IND-04", { allowExemptions: true });
  assert(rThreeWord.hasLeakage === false, "3-word contrast phrase is properly exempted");
}

// 3.3 Deeply nested / separated contrast prefix (>3 words distance)
{
  const nestedContrast = "برخلاف تمامی روندهای سنتی بازار خودرو، ما تعویض روغن در سالن زیبایی انجام می‌دهیم.";
  const rNested = detectCrossDomainLeakage(nestedContrast, "IND-04", { allowExemptions: true });
  assert(rNested.hasLeakage === true, "Deeply separated contrast prefix (>3 words) does not blindly exempt distant contaminant");
}

// 3.4 Adversarial Evasion: Duplicate Contaminant (Exempted Prefix + Subsequent Affirmative Occurrence)
{
  const doubleOccurText = "برخلاف تعویض روغن های سنتی، ما سالن زیبایی هستیم و بعد از اصلاح، خدمات تعویض روغن را هم ارائه می‌دهیم.";
  const rDouble = detectCrossDomainLeakage(doubleOccurText, "IND-04", { allowExemptions: true });
  assert(
    rDouble.hasLeakage === true,
    "Affirmative secondary contaminant after contrast prefix is strictly detected",
    rDouble.hasLeakage ? "" : "EVASION BUG: First contrast occurrence ('برخلاف تعویض روغن') erroneously exempted the second affirmative occurrence ('خدمات تعویض روغن را هم ارائه می‌دهیم')"
  );
}

// 3.5 Adversarial Evasion: Negation Prefix with Affirmative Second Occurrence
{
  const negOccurText = "نه به تعویض روغن سنتی، آری به تعویض روغن در مطب پزشکی ما!";
  const rNeg = detectCrossDomainLeakage(negOccurText, "IND-04", { allowExemptions: true });
  assert(
    rNeg.hasLeakage === true,
    "Affirmative contaminant after negation prefix ('نه به ...') is detected",
    rNeg.hasLeakage ? "" : "EVASION BUG: Negation prefix exempted subsequent affirmative contaminant occurrence"
  );
}

// 3.6 Partial contrast with multiple contaminants (only one in prefix)
{
  const multiContaminantText = "برخلاف تعویض روغن سنتی، ما کارواش اتوماتیک و دیاگ موتور در سالن زیبایی داریم.";
  const rMulti = detectCrossDomainLeakage(multiContaminantText, "IND-04", { allowExemptions: true });
  assert(rMulti.hasLeakage === true, "Unexempted contaminants ('کارواش', 'دیاگ موتور') are detected even when one term is in contrast");
  assert(
    rMulti.violations.some(v => v.term.includes("کارواش") || v.term.includes("دیاگ")),
    "Violations specifically identify unexempted terms"
  );
}

// 3.7 Strict mode without exemptions (allowExemptions: false)
{
  const text = "برخلاف تعویض روغن سنتی ما فقط سالن زیبایی هستیم.";
  const rStrict = detectCrossDomainLeakage(text, "IND-04", { allowExemptions: false });
  assert(rStrict.hasLeakage === true, "When allowExemptions is false, term in contrast is strictly flagged");
}

// ==============================================================================
// SUITE 4: HIGH-VOLUME RANDOMIZED CROSS-INDUSTRY STRESS HARNESS
// ==============================================================================
console.log("\n--- SUITE 4: High-Volume Randomized Cross-Industry Stress Harness ---");

// 4.1 Negative Controls (Canonical Clean Domain Texts across ALL 31 Industries)
{
  const CANONICAL_CLEAN_SAMPLES = {
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

  let cleanPasses = 0;
  for (let i = 1; i <= 31; i++) {
    const indId = `IND-${String(i).padStart(2, "0")}`;
    const text = CANONICAL_CLEAN_SAMPLES[indId];
    const res = detectCrossDomainLeakage(text, indId);
    if (!res.hasLeakage && res.allowedTermsCount > 0) {
      cleanPasses++;
    } else {
      console.error(`False positive or zero allowed terms in ${indId}:`, res.violations);
    }
  }
  assert(cleanPasses === 31, `All 31 canonical clean snippets passed with zero false positives (actual: ${cleanPasses}/31)`);
}

// 4.2 Randomized Contaminant Injection Matrix across 25 Diverse Industry Pairs
{
  const RANDOM_PAIRS = [
    { targetInd: "IND-01", cat: "AUTOMOTIVE_SERVICES", term: "تعویض روغن گیربکس اتوماتیک" },
    { targetInd: "IND-01", cat: "HEAVY_MACHINING_TOLERANCE", term: "تلرانس ۳ میکرون" },
    { targetInd: "IND-02", cat: "HEAVY_MACHINING_TOLERANCE", term: "فرزکاری cnc سنگین" },
    { targetInd: "IND-03", cat: "COFFEE_ROASTERY_SPECIALTY", term: "رست دانه سبز قهوه", options: { subDomain: "RESTAURANT" } },
    { targetInd: "IND-03", cat: "AUTOMOTIVE_SERVICES", term: "جک هیدرولیک اتومبیل" },
    { targetInd: "IND-04", cat: "AUTOMOTIVE_SERVICES", term: "تعویض روغن موتور" },
    { targetInd: "IND-04", cat: "CLINICAL_UNSUBSTANTIATED_CLAIMS", term: "درمان قطعی بدون بازگشت" },
    { targetInd: "IND-06", cat: "MOADIAN_TAX_OVERKILL", term: "اتصال اجباری سامانه مودیان", options: { isNonTaxSaaS: true } },
    { targetInd: "IND-06", cat: "CONSTRUCTION_HEAVY_CIVIL", term: "بتن ریزی فونداسیون" },
    { targetInd: "IND-07", cat: "HEAVY_MACHINING_TOLERANCE", term: "تراشکاری سنگین فلزات" },
    { targetInd: "IND-08", cat: "CREATOR_INFLUENCER_ECONOMY", term: "ولاگ روزمرگی اینستاگرام" },
    { targetInd: "IND-09", cat: "CLINICAL_UNSUBSTANTIATED_CLAIMS", term: "داروی معجزه آسا" },
    { targetInd: "IND-10", cat: "AUTOMOTIVE_SERVICES", term: "روغن موتور خودرو" },
    { targetInd: "IND-11", cat: "COFFEE_ROASTERY_SPECIALTY", term: "کاپینگ قهوه تخصصی" },
    { targetInd: "IND-12", cat: "CREATOR_INFLUENCER_ECONOMY", term: "تولید ریلز روزانه و چالش رقص" },
    { targetInd: "IND-13", cat: "HEAVY_MACHINING_TOLERANCE", term: "قالب سازی سنبه ماتریس" },
    { targetInd: "IND-14", cat: "AUTOMOTIVE_SERVICES", term: "بالانس چرخ و لنت ترمز" },
    { targetInd: "IND-15", cat: "AUTOMOTIVE_SERVICES", term: "صافکاری نقاشی خودرو" },
    { targetInd: "IND-16", cat: "HEAVY_MACHINING_TOLERANCE", term: "ریخته گری چدن نشکن" },
    { targetInd: "IND-17", cat: "AUTOMOTIVE_SERVICES", term: "کارواش نانو بخار" },
    { targetInd: "IND-18", cat: "HEAVY_MACHINING_TOLERANCE", term: "متالورژی فولاد آلیاژی" },
    { targetInd: "IND-21", cat: "AUTOMOTIVE_SERVICES", term: "تعویض روغن و پنچرگیری" },
    { targetInd: "IND-23", cat: "AUTOMOTIVE_SERVICES", term: "لنت ترمز خودرو" },
    { targetInd: "IND-24", cat: "HEAVY_MACHINING_TOLERANCE", term: "کوره القایی ذوب فلزات" },
    { targetInd: "IND-25", cat: "HEAVY_MACHINING_TOLERANCE", term: "تلرانس ۳ میکرون ابعادی" }
  ];

  let injectionPasses = 0;
  for (const item of RANDOM_PAIRS) {
    const carrier = `تمرکز اصلی این مجموعه بر ${item.term} جهت ارائه ارزش افزوده به مشتریان است.`;
    const res = detectCrossDomainLeakage(carrier, item.targetInd, item.options || {});
    if (res.hasLeakage) {
      injectionPasses++;
    } else {
      console.error(`Missed contaminant '${item.term}' in ${item.targetInd}`);
    }
  }
  assert(injectionPasses === RANDOM_PAIRS.length, `100% recall on 25 randomized cross-industry contaminant injections (${injectionPasses}/${RANDOM_PAIRS.length})`);
}

// 4.3 High-throughput performance benchmark
{
  const t0 = Date.now();
  for (let i = 0; i < 200; i++) {
    detectCrossDomainLeakage("بررسی سریع متن بدون کلمات ممنوعه برای سنجش کارایی سیستم", "IND-01");
  }
  const durationMs = Date.now() - t0;
  const avgMs = durationMs / 200;
  assert(avgMs < 2.0, `High-throughput leakage detection is performant (200 iterations in ${durationMs}ms, avg ${avgMs.toFixed(3)}ms/call < 2.0ms)`);
}

// ==============================================================================
// SUITE 5: SPECIALIZATION DE-HARDCODING & ARCHETYPE VERIFICATION (R5)
// ==============================================================================
console.log("\n--- SUITE 5: Specialization De-Hardcoding & Archetype Verification ---");

// 5.1 LOCAL_SERVICE specialization branching
{
  // Beauty Salon (IND-04 / BT-0102)
  const salonSpec = resolveDomainSpecialization("BT-0102", {}, 1);
  assert(salonSpec.industryId === "IND-04", "Salon (BT-0102) resolves to IND-04");
  assert(salonSpec.phaseInstruction.includes("سالن") || salonSpec.phaseInstruction.includes("صندلی"), "Phase 1 instruction addresses salon/seats, NOT carwash");
  assert(!salonSpec.phaseInstruction.includes("خودرو"), "Phase 1 instruction does NOT mention automotive");

  // Technical Repair (IND-28 / BT-0711)
  const techSpec = resolveDomainSpecialization("BT-0711", {}, 1);
  assert(techSpec.industryId === "IND-28", "Technical service (BT-0711) resolves to IND-28");
  assert(!techSpec.phaseInstruction.includes("تعویض روغن"), "Technical service does not talk about oil change");
}

// 5.2 RESTAURANT_CAFE_HOSPITALITY branching
{
  // Traditional Restaurant (BT-0071)
  const restSpec = resolveDomainSpecialization("BT-0071", {}, 1);
  assert(restSpec.industryId === "IND-03", "Traditional restaurant (BT-0071) resolves to IND-03");
  assert(restSpec.phaseInstruction.includes("غذا") || restSpec.phaseInstruction.includes("آشپزخانه") || restSpec.phaseInstruction.includes("بیرون‌بر"), "Restaurant P1 addresses food/kitchen, NOT coffee roasting");
  assert(!restSpec.phaseInstruction.includes("رست دانه"), "Restaurant does NOT mention roasting green coffee");

  // Specialty Cafe (BT-0066)
  const cafeSpec = resolveDomainSpecialization("BT-0066", {}, 1);
  assert(cafeSpec.phaseInstruction.includes("نوشیدنی") || cafeSpec.phaseInstruction.includes("میزها"), "Cafe P1 addresses beverage/tables");
}

// 5.3 MANUFACTURER branching
{
  // Textile Factory (IND-25 / BT-0656)
  const textileSpec = resolveDomainSpecialization("BT-0656", {}, 1);
  assert(textileSpec.industryId === "IND-25", "Textile factory (BT-0656) resolves to IND-25");
  assert(textileSpec.phaseInstruction.includes("طاقه‌بری") || textileSpec.phaseInstruction.includes("دوخت") || textileSpec.phaseInstruction.includes("پارچه"), "Textile P1 addresses fabric/sewing, NOT CNC tooling");
  assert(!textileSpec.phaseInstruction.includes("تراشکاری"), "Textile P1 does NOT mention machining/lathing");

  // Tooling Factory (BT-0221)
  const toolingSpec = resolveDomainSpecialization("BT-0221", {}, 1);
  assert(toolingSpec.phaseInstruction.includes("تراشکاری") || toolingSpec.phaseInstruction.includes("دستگاه"), "Tooling factory addresses lathe machines/engineering materials");
}

// 5.4 SAAS_SOFTWARE branching
{
  // Non-tax SaaS CRM (BT-0167)
  const crmSpec = resolveDomainSpecialization("BT-0167", {}, 1);
  assert(!crmSpec.phaseInstruction.includes("سامانه‌های مالیاتی"), "CRM SaaS (BT-0167) P1 does not force tax compliance");
  assert(crmSpec.phaseInstruction.includes("نرخ فعال‌سازی") || crmSpec.phaseInstruction.includes("Time-to-Value") || crmSpec.phaseInstruction.includes("MRR"), "CRM SaaS addresses activation/MRR");

  // Tax Accounting SaaS (BT-0166)
  const taxSpec = resolveDomainSpecialization("BT-0166", {}, 1);
  assert(taxSpec.phaseInstruction.includes("مالیاتی") || taxSpec.phaseInstruction.includes("سامانه"), "Tax SaaS P1 addresses tax systems");
}

// ==============================================================================
// SUMMARY REPORT
// ==============================================================================
console.log("\n================================================================================");
console.log(`📊 ADVERSARIAL CHALLENGER 1 RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log("================================================================================");

if (vulnerabilities.length > 0) {
  console.log("\n⚠️ EMPIRICALLY CONFIRMED VULNERABILITIES & EDGE CASE FAILURES:");
  vulnerabilities.forEach((v, idx) => {
    console.log(`  ${idx + 1}. [FAIL] ${v.message}`);
    if (v.details) console.log(`     Details: ${v.details}`);
  });
}

const exitCode = failCount === 0 ? 0 : 1;
console.log(`\nAdversarial test suite finished. Exit code ${exitCode}.`);
