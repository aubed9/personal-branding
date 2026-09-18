/**
 * DIGITAL MARKET — Semantic Parser & Multi-Pattern Unknown-Aware Engine
 * 
 * Capabilities:
 * 1. Multi-Pattern Unknown-Aware Engine:
 *    - EXPLICIT_IGNORANCE: نمیدانم, اطلاعی ندارم, بلد نیستم, ...
 *    - UNMEASURED_TIMING: هنوز اندازه نگرفته‌ام, اندازه‌گیری نشده, حساب نکردیم, داده‌ای ندارم, آماری ندارم, ثبت نشده, ...
 *    - UNCERTAINTY: مطمئن نیستم, دقیق نمیدونم, حدودیه, تخمینی ندارم, ...
 *    - EXTERNAL_DEPENDENCY: باید از حسابدار بپرسم, باید با شریکم صحبت کنم, باید بررسی کنم, ...
 * 2. Freeform Unstructured Text Parser:
 *    - Extracts business types (BT-xxxx), macro industries, customer model (B2B/B2C),
 *      scale, channels, geography, and primary bottlenecks without breaking the state machine.
 * 3. Never forces hallucinated fake numbers when user expresses an unknown.
 */

import { BUSINESS_TYPES_MAP, resolveBusinessType } from "../data/businessTaxonomy753.js";

/**
 * Converts Persian and Arabic numerals to standard Latin digits (0-9)
 */
export function convertPersianDigitsToEnglish(str) {
  if (!str) return "";
  const faDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arDigits = "٠١٢٣٤٥٦٧٨٩";
  return String(str)
    .replace(/[۰-۹]/g, d => faDigits.indexOf(d))
    .replace(/[٠-٩]/g, d => arDigits.indexOf(d));
}

/**
 * Normalizes Persian string (unifies letters, converts half-spaces, collapses spaces, handles Arabic glyphs and harakat)
 */
export function normalizePersianText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[\u200c\u200b\u00a0\uFEFF]/g, " ") // half spaces, zero-width spaces, BOM
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/[إأآا]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ی")
    .replace(/[\u064B-\u065F\u0670]/g, "") // tashkeel / harakat (fathe, zamme, tanvin, etc.)
    .replace(/[ـ\r\n\t]/g, " ") // kashida elongation, newlines, tabs
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Condensed Persian text (no spaces, for resilient substring matching)
 */
export function condensePersianText(text) {
  if (!text || typeof text !== "string") return "";
  return normalizePersianText(text).replace(/\s+/g, "");
}

/**
 * Helper to match any term or phrase in text with word boundary awareness
 */
export function hasAnyTerm(text, terms) {
  if (!text || !Array.isArray(terms)) return false;
  const normText = normalizePersianText(text);
  const withLatinDigits = convertPersianDigitsToEnglish(normText);
  const padded = " " + normText + " ";
  const paddedDigits = " " + withLatinDigits + " ";

  return terms.some(t => {
    if (!t) return false;
    const normT = normalizePersianText(t);
    const normTDigits = convertPersianDigitsToEnglish(normT);

    if (normT.includes(" ")) {
      return normText.includes(normT) || withLatinDigits.includes(normTDigits);
    }
    return (
      padded.includes(" " + normT + " ") ||
      normText.includes(normT) ||
      paddedDigits.includes(" " + normTDigits + " ") ||
      withLatinDigits.includes(normTDigits)
    );
  });
}

// ---------------------------------------------------------------------------
// 1. MULTI-PATTERN UNKNOWN-AWARE DETECTORS
// ---------------------------------------------------------------------------

export const UNKNOWN_CATEGORIES = {
  EXPLICIT_IGNORANCE: "EXPLICIT_IGNORANCE",
  UNMEASURED_TIMING: "UNMEASURED_TIMING",
  UNCERTAINTY: "UNCERTAINTY",
  EXTERNAL_DEPENDENCY: "EXTERNAL_DEPENDENCY"
};

// Raw patterns & condensed tokens for each unknown category
const UNKNOWN_PATTERNS = {
  [UNKNOWN_CATEGORIES.EXPLICIT_IGNORANCE]: {
    tokens: [
      "نمیدانم", "نمی دانم", "نمیدونم", "نمی دونم", "نمیدانیم", "نمی دانیم",
      "بلد نیستم", "بلدنیستم", "اطلاعی ندارم", "اطلاع ندارم", "اطلاعی نداریم",
      "اطلاعات دقیقی ندارم", "اطلاعات دقیق ندارم", "اطلاعات ندارم", "اطلاعاتی ندارم",
      "سر در نمی آورم", "سردرنمی آورم", "سر در نمیارم", "سردرنمیارم",
      "سررشته ندارم", "سر رشته ندارم", "بی خبرم", "بیخبرم", "خبر ندارم",
      "ایده ای ندارم", "ایده ندارم", "هیچ ایده ای ندارم"
    ],
    condensed: [
      "نمیدانم", "نمیدونم", "نمیدانیم", "بلدنیستم", "اطلاعندارم", "اطلاعیندارم",
      "اطلاعاتندارم", "اطلاعاتدقیقندارم", "اطلاعاتدقیقیندارم",
      "سردرنمیآورم", "سردرنمیارم", "سررشتهندارم", "بیخبرم", "خبرندارم", "ایدهندارم"
    ],
    reason: "عدم اطلاع مستقیم کاربر — ثبت به عنوان مجهول رسمی جهت بررسی تکمیلی",
    actionItem: "انجام مصاحبه عمیق با مشتریان یا مشاوره صنفی برای شفاف‌سازی این متغیر"
  },
  [UNKNOWN_CATEGORIES.UNMEASURED_TIMING]: {
    tokens: [
      "نسنجیده ایم", "نسنجیده‌ایم", "نسنجیدیم", "نسنجیدم", "نسنجیده ام", "نسنجیده‌ام", "نسنجیده",
      "هنوز نسنجیدیم", "هنوز نسنجیدم", "هنوز نسنجیده",
      "اندازه نگرفته ایم", "اندازه نگرفته‌ایم", "اندازه نگرفته ام", "اندازه نگرفتهام", "اندازه نگرفتم", "اندازه نگرفتیم", "اندازه نگرفته",
      "اندازه گیری نشده", "اندازه‌گیری نشده", "اندازهگیری نشده", "اندازه گیری نکرده ایم", "اندازه‌گیری نکرده‌ایم",
      "حساب نکردیم", "حساب نکردم", "حساب نکرده ایم", "حساب نکرده‌ایم",
      "داده ای ندارم", "داده ندارم", "داده دقیقی ندارم", "داده دقیق ندارم", "داده ای ثبت نشده", "داده ثبت نشده",
      "آماری ندارم", "آمار ندارم", "آمار دقیقی ندارم", "آمار دقیق ندارم", "اطلاعات آماری ندارم", "آماری ثبت نشده", "آمار ثبت نشده",
      "ثبت نشده", "ثبت نکردیم", "ثبت نکرده ایم", "عددی ندارم", "عدد دقیقی ندارم",
      "متریکی نداریم", "متریک نداریم", "دیتایی ندارم", "دیتا ندارم",
      "آمار رسمی ندارم", "محاسبه نشده", "محاسبه نکردیم", "محاسبه نکرده ایم", "محاسبه نکردم",
      "تازه تاسیس", "شروع نکرده ایم", "شروع نکردیم", "راه اندازی نشده", "راه‌اندازی نشده"
    ],
    condensed: [
      "نسنجیدهایم", "نسنجیدیم", "نسنجیدم", "نسنجیده", "هنوزنسنجیدیم",
      "هنوزاندازهنگرفتها", "هنوزاندازهنگرفتم", "هنوزاندازهنگرفتیم", "اندازهگیرینشده", "اندازهنگرفته",
      "اندازهنگرفتیم", "حسابنکردیم", "حسابنکردم", "دادهندارم", "دادهیندارم", "دادهدقیقندارم",
      "آماری ندارم", "آمارندارم", "آماردقیقندارم", "اطلاعاتآماری", "ثبتنشده", "عددیندارم", "عدزندارم",
      "هنوزثبتنکردیم", "متریکندارم", "متریکیندارم", "دیتاندارم", "دیتاییندارم",
      "آمارهندارم", "محاسبهنشده", "محاسبهنکردیم", "تازهتاسیس", "شروعنکرده", "راهاندازینشده"
    ],
    reason: "سنجه یا داده زمانی/مالی تاکنون اندازه‌گیری نشده است — ثبت به عنوان فرضیه نیازمند تست",
    actionItem: "طراحی و استقرار شیت ثبت روزانه داده‌ها در بازه ۳۰ روزه اولیه برای استخراج عدد واقعی"
  },
  [UNKNOWN_CATEGORIES.UNCERTAINTY]: {
    tokens: [
      "مطمئن نیستم", "مطمئن نیستیم", "اطمینان ندارم", "اطمینانی ندارم",
      "دقیق نمی دانم", "دقیق نمیدانم", "دقیق نمی دونم", "دقیق نمیدونم",
      "حدودیه", "حدودی است", "حدودی هست",
      "فرضیه است", "فرضی است",
      "تخمینی ندارم", "تخمینی است", "تقریبیه", "تقریبی است", "حدس می زنم",
      "حدس میزنم", "شک دارم", "با قطعیت نمی توانم بگویم", "با قطعیت نمیتوانم بگویم",
      "حدسی است", "شاید", "احتمالا", "قطعی نیست", "درست نمیدانم", "درست نمی دانم",
      "مشخص نیست", "معلوم نیست"
    ],
    condensed: [
      "مطمئننیستم", "مطمئننیستیم", "اطمینانندارم", "دقیقنمیدانم", "دقیقنمیدونم", "حدودیه", "حدودیاست",
      "فرضیهاست", "فرضیاست", "تخمینیندارم", "تخمینیاست", "تقریبیه", "تقریبیاست", "حدسمیزنم", "شکدارم",
      "باقطعیتنمیتوانم", "حدسیاست", "قطعینیست", "درستنمیدانم", "مشخصنیست", "معلومنیست"
    ],
    reason: "تخمین تقریبی بدون قطعیت آماری یا داده‌های مستند — نیازمند صحه‌گذاری",
    actionItem: "اعتبارسنجی میدانی فرضیه با تحلیل فاکتورهای ۳ ماه اخیر و نمونه‌گیری آماری"
  },
  [UNKNOWN_CATEGORIES.EXTERNAL_DEPENDENCY]: {
    tokens: [
      "وابسته به", "بستگی دارد", "بستگی به", "دست ما نیست", "دست من نیست",
      "باید از حسابدار بپرسم", "باید از حسابدارم بپرسم", "باید با حسابدار صحبت کنم",
      "باید با شریکم صحبت کنم", "باید با شریکم مشورت کنم", "باید از شریکم بپرسم", "تایید شریک",
      "باید بررسی کنم", "باید چک کنم", "باید با مدیر مالی صحبت کنم",
      "باید از مشاور بپرسم", "نیاز به استعلام دارد", "نیاز به استعلام دارم", "نیاز به استعلام",
      "باید استعلام بگیرم", "باید با هیئت مدیره مشورت کنم", "باید مدارک را بررسی کنم",
      "منوط به تایید شریک است", "منوط به", "مجوز اتحادیه", "مجوز اصناف"
    ],
    condensed: [
      "وابستهبه", "بستگیدارد", "بستگیبه", "دستمانست", "دستمننیست",
      "بایدازحسابداربپرسم", "بایدازحسابدارمبپرسم", "بایدباحسابدارصحبتکنم",
      "بایدباشریکمصحبتکنم", "بایدباشریکممشورتکنم", "بایدازشریکمبپرسم", "تاییدشریک",
      "بایدبررسیکنم", "بایدچککنم", "بایدبامدیرمالی", "بایدازمشاوربپرسم",
      "نیازبه استعلامدارد", "نیازبه استعلام", "بایداستعلامبگیرم", "بایدباهیئتمدیره", "بایدمدارکبررسی",
      "منوطبه", "مجوزاتحادیه", "مجوزاصناف"
    ],
    reason: "وابستگی تصمیم به مرجع خارجی (حسابدار، شریک، مدیر مالی یا استعلام اداری)",
    actionItem: "برگزاری جلسه هماهنگی با ذی‌نفعان خارجی و درج داده‌های استعلام‌شده در دوسیه راهبردی"
  }
};

/**
 * Detects if user response expresses an unknown intent across 4 distinct categories.
 * 
 * @param {string} text - User's input text
 * @returns {object} { isUnknown: boolean, category: string|null, reason: string|null, actionItem: string|null, matchedPattern: string|null }
 */
export function detectUnknownIntent(text) {
  if (!text || typeof text !== "string") {
    return { isUnknown: false, category: null, reason: null, actionItem: null, matchedPattern: null };
  }

  const norm = normalizePersianText(text);
  const condensed = condensePersianText(text);

  if (!norm) {
    return { isUnknown: false, category: null, reason: null, actionItem: null, matchedPattern: null };
  }

  // Priority check for External Dependency first (e.g. "مطمئن نیستم، باید با شریکم بررسی کنم")
  for (const catKey of [
    UNKNOWN_CATEGORIES.EXTERNAL_DEPENDENCY,
    UNKNOWN_CATEGORIES.UNMEASURED_TIMING,
    UNKNOWN_CATEGORIES.UNCERTAINTY,
    UNKNOWN_CATEGORIES.EXPLICIT_IGNORANCE
  ]) {
    const config = UNKNOWN_PATTERNS[catKey];

    // Check token list
    for (const token of config.tokens) {
      if (norm.includes(token)) {
        return {
          isUnknown: true,
          category: catKey,
          reason: config.reason,
          actionItem: config.actionItem,
          matchedPattern: token
        };
      }
    }

    // Check condensed list
    for (const cToken of config.condensed) {
      if (condensed.includes(cToken)) {
        return {
          isUnknown: true,
          category: catKey,
          reason: config.reason,
          actionItem: config.actionItem,
          matchedPattern: cToken
        };
      }
    }
  }

  return {
    isUnknown: false,
    category: null,
    reason: null,
    actionItem: null,
    matchedPattern: null
  };
}

// ---------------------------------------------------------------------------
// 2. FREEFORM SEMANTIC SLOT PARSER
// ---------------------------------------------------------------------------

/**
 * Extracts structured slots from freeform unstructured text:
 * - businessTypeMatch: Resolved BT-xxxx object from 753 registry
 * - customerModel: B2B, B2C, B2B2C
 * - scale: SOLO, MICRO, SMALL, MEDIUM, LARGE
 * - channels: PHYSICAL_FIRST, ONLINE_FIRST, HYBRID_OMNICHANNEL, DIRECT_SALES_B2B
 * - geography: HYPER_LOCAL, CITY, REGIONAL, NATIONAL, INTERNATIONAL
 * - primaryBottleneck: Detected operational pain points
 * - unmeasuredFields: Metrics indicated as unmeasured
 */
export function parseFreeformSemanticSlots(text, currentContext = null) {
  if (!text || typeof text !== "string") {
    return {
      businessTypeMatch: null,
      customerModel: null,
      scale: null,
      channels: null,
      geography: null,
      primaryBottleneck: null,
      unmeasuredFields: []
    };
  }

  const norm = normalizePersianText(text);

  // 1. Business Type Resolution (BT-xxxx)
  let businessTypeMatch = null;
  // Keyword spoofing defense (R17): If currentContext already has an established taxonomyId,
  // do not let casual off-hand mentions of secondary goods/services flip the primary business type,
  // unless user explicitly indicates an intent to change or pivot trade.
  const isExplicitPivot = hasAnyTerm(norm, ["تغییر صنف", "تغییر شغل", "تغییر رسته", "پیووت", "شغل جدید", "برند جدید", "صنف جدید"]);
  if (!currentContext || !currentContext.taxonomyId || isExplicitPivot) {
    const resolved = resolveBusinessType(text);
    if (resolved && resolved.id) {
      businessTypeMatch = resolved;
    }
  } else {
    businessTypeMatch = currentContext.businessType || {
      id: currentContext.taxonomyId,
      nameFa: currentContext.taxonomyTitleFa || currentContext.archetypeTitle || ""
    };
  }

  // 1.1 Hybrid Business Detection (R17)
  let isHybrid = false;
  const hybridTokens = ["هم کافه", "هم رستوران", "هم فروشگاه", "هم انلاین", "هم آنلاین", "هم حضوری", "هم خدمات", "هم اموزش", "هم آموزش", "هم تولید", "چند منظوره", "هیبرید", "ترکیبی"];
  if (hasAnyTerm(norm, hybridTokens)) {
    isHybrid = true;
  }

  // 2. Customer Model Extraction (B2B / B2C / Hybrid)
  let customerModel = null;
  const isB2B = hasAnyTerm(norm, ["b2b", "سازمانی", "شرکت ها", "کارخانجات", "عمده", "سازمان ها", "مناقصات", "تامین کننده", "b 2 b", "فروش شرکتی", "دولتی"]);
  const isB2C = hasAnyTerm(norm, ["b2c", "مردم عادی", "عموم مردم", "تک فروشی", "مشتری خانگی", "خرده فروشی", "مصرف کننده", "خانوار", "b 2 c", "مردم", "شهروندان"]);
  if (isB2B && isB2C) {
    customerModel = "B2B2C";
  } else if (isB2B) {
    customerModel = "B2B";
  } else if (isB2C) {
    customerModel = "B2C";
  }

  // 3. Scale Extraction
  let scale = null;
  if (hasAnyTerm(norm, ["یک نفره", "تک نفره", "فریلنسر", "تنهایی", "تک نفری", "یک نفری", "تک‌نفره"])) {
    scale = "SOLO";
  } else if (hasAnyTerm(norm, ["خرد", "۱ تا ۲ نفر", "۲ تا ۳ نفر", "۲ الی ۳ نفر", "زیر ۵ نفر", "مغازه کوچک", "۱-۲ نفر", "۲-۳ نفر", "۱ الی ۳ نفر"])) {
    scale = "MICRO";
  } else if (hasAnyTerm(norm, ["کوچک", "۵ تا ۱۰ نفر", "۵ الی ۱۰ نفر", "5 تا 10 نفر", "5 الی 10 نفر", "۵-۱۰ نفر", "5-10 نفر", "۱۰ تا ۲۰ نفر", "۱۰ الی ۲۰ نفر", "تیم کوچک", "کارگاه کوچک", "۳ تا ۵ نفر", "۳ الی ۵ نفر", "زیر ۲۰ نفر", "زیر ۱۰ نفر"])) {
    scale = "SMALL";
  } else if (hasAnyTerm(norm, ["متوسط", "۲۰ تا ۵۰ نفر", "۵۰ تا ۱۰۰ نفر", "شرکت در حال رشد", "کارگاه متوسط"])) {
    scale = "MEDIUM";
  } else if (hasAnyTerm(norm, ["بزرگ", "کارخانه بزرگ", "بیش از ۱۰۰ نفر", "سازمان بزرگ", "هلدینگ", "بزرگ مقیاس"])) {
    scale = "LARGE";
  }

  // 4. Channels Extraction
  let channels = null;
  const hasPhysical = hasAnyTerm(norm, ["مغازه", "فروشگاه فیزیکی", "حضوری", "محل کارگاه", "مکان ثابت", "تابلو خیابان", "مطب", "تعمیرگاه", "دفتر کار", "فروشگاه", "نمایشگاه"]);
  const hasOnline = hasAnyTerm(norm, ["آنلاین", "اینترنتی", "سایت", "وبسایت", "پیج اینستاگرام", "اینستاگرام", "اپلیکیشن", "سامانه ابری", "فروشگاه اینترنتی", "مجازی", "saas", "پلتفرم", "نرم افزار ابری", "نرم‌افزار ابری", "cloud"]);
  const hasDirectB2B = hasAnyTerm(norm, ["مذاکره حضوری سازمانی", "ویزیتوری", "جلسات b2b", "مناقصات", "تیم فروش سازمانی", "فروش مستقیم سازمانی", "فروش مستقیم"]);

  if (hasPhysical && hasOnline) {
    channels = "HYBRID_OMNICHANNEL";
  } else if (hasDirectB2B) {
    channels = "DIRECT_SALES_B2B";
  } else if (hasPhysical) {
    channels = "PHYSICAL_FIRST";
  } else if (hasOnline) {
    channels = "ONLINE_FIRST";
  }

  // 5. Geography Extraction
  let geography = null;
  if (hasAnyTerm(norm, ["محله", "منطقه ای", "شعاع ۲ کیلومتر", "شعاع ۳ کیلومتر", "همسایگی", "کوچه", "سعادت آباد", "تجریش", "محلی"])) {
    geography = "HYPER_LOCAL";
  } else if (hasAnyTerm(norm, ["سطح شهر", "شهر تهران", "تهران", "اصفهان", "مشهد", "شیراز", "تبریز", "کرج", "شهری", "در شهر", "کل شهر", "در یک شهر"])) {
    geography = "CITY";
  } else if (hasAnyTerm(norm, ["استانی", "سطح استان", "منطقه شمال", "غرب کشور"])) {
    geography = "REGIONAL";
  } else if (hasAnyTerm(norm, ["سراسری", "کل ایران", "تمام کشور", "پستی به کل کشور", "ملی", "کشوری", "سراسر کشور"])) {
    geography = "NATIONAL";
  } else if (hasAnyTerm(norm, ["صادراتی", "خارج از کشور", "بین المللی", "صادرات", "ارزی", "بین‌المللی"])) {
    geography = "INTERNATIONAL";
  }

  // 6. Primary Bottleneck / Pain Points Extraction
  let primaryBottleneck = null;
  const pains = [
    { key: "اعتماد و اصالت کالا", terms: ["روغن تقلبی", "تقلبی", "بی کیفیت", "عدم اعتماد", "اعتماد مشتری", "ضمانت اصالت"] },
    { key: "معطلی و اتلاف وقت", terms: ["معطلی", "اتلاف وقت", "صف طولانی", "بدقولی", "تاخیر در تحویل", "نوبت دهی"] },
    { key: "شفافیت قیمت", terms: ["قیمت بالا", "گران", "عدم شفافیت قیمت", "تعرفه مبهم", "فاکتور رسمی"] },
    { key: "تکالیف مالیاتی و سامانه مودیان", terms: ["سامانه مودیان", "مالیات", "پایانه فروشگاهی", "ارزش افزوده", "دفاتر مالیاتی"] },
    { key: "جذب و بازگشت مشتری", terms: ["کمبود مشتری", "ریزش مشتری", "عدم بازگشت", "جذب مشتری", "وفاداری"] },
    { key: "پایداری مالی و نقدینگی", terms: ["کمبود نقدینگی", "چک برگشتی", "سرمایه در گردش", "وام", "تنگنای مالی"] },
    { key: "ضایعات و پرت تولید", terms: ["پرت متریال", "ضایعات", "استهلاک دستگاه", "خطای قالب"] }
  ];

  for (const p of pains) {
    if (hasAnyTerm(norm, p.terms)) {
      primaryBottleneck = p.key;
      break;
    }
  }

  // 7. Unmeasured Fields Detection
  const unmeasuredFields = [];
  const metrics = [
    { field: "CAC (هزینه جذب مشتری)", terms: ["هزینه جذب", "تبلیغات", "cac", "جذب مشتری"] },
    { field: "LTV (ارزش دوره عمر مشتری)", terms: ["ارزش مشتری", "وفاداری", "ltv", "مراجعات مکرر"] },
    { field: "حاشیه سود ناخالص", terms: ["حاشیه سود", "سود ناخالص", "gross margin"] },
    { field: "نرخ بازگشت مشتری (Retention)", terms: ["نرخ بازگشت", "retention", "برگشت مشتری"] },
    { field: "نقطه سربه‌سر (Break-Even)", terms: ["نقطه سربه سر", "سربه‌سر", "break-even", "پوشش هزینه"] }
  ];

  const unknownDetection = detectUnknownIntent(text);
  if (unknownDetection.isUnknown) {
    for (const m of metrics) {
      if (hasAnyTerm(norm, m.terms)) {
        unmeasuredFields.push(m.field);
      }
    }
    if (unmeasuredFields.length === 0) {
      unmeasuredFields.push("داده‌های مالی و سنجه‌های عملکردی این مرحله");
    }
  }

  return {
    businessTypeMatch,
    customerModel,
    scale,
    channels,
    geography,
    primaryBottleneck,
    unmeasuredFields,
    isHybrid
  };
}

// ---------------------------------------------------------------------------
// 3. MASTER SEMANTIC PARSER INTERFACE
// ---------------------------------------------------------------------------

/**
 * Master semantic input parser: combines multi-pattern unknown detection
 * and unstructured entity slot extraction into a single structured response.
 * 
 * @param {string} text - Raw input from user
 * @param {object} currentContext - Current business context profile
 * @returns {object} Structured extraction
 */
export function parseSemanticInput(text, currentContext = null) {
  const unknown = detectUnknownIntent(text);
  const slots = parseFreeformSemanticSlots(text, currentContext);

  let hypothesis = null;
  if (unknown.isUnknown) {
    const unmeasuredStr = slots.unmeasuredFields.length > 0 
      ? slots.unmeasuredFields.join("، ") 
      : "داده‌های این حوزه";
    hypothesis = `[فرضیه نیازمند تست - مجهول رسمی]: ${unmeasuredStr} هنوز به طور دقیق اندازه‌گیری نشده و در فاز ۳۰ روزه اولیه سنجیده خواهد شد.`;
  }

  return {
    isUnknown: unknown.isUnknown,
    unknownCategory: unknown.category,
    unknownReason: unknown.reason,
    unknownActionItem: unknown.actionItem,
    hypothesis: hypothesis,
    extractedSlots: slots,
    businessTypeMatch: slots.businessTypeMatch,
    isHybrid: slots.isHybrid
  };
}
