// DIGITAL MARKET — Business Context Router & Adaptive Specialization Engine
// Integrates Universal Iranian Business Taxonomy 753 (31 Macro Industries IND-01 to IND-31,
// 753 Business Types BT-0001 to BT-0753), 15 Independent Context Axes, 20 Archetypes,
// Active Overlays, and Adaptive Phase 1 to 8 Specialization Rules.

import {
  MACRO_INDUSTRIES,
  BUSINESS_TYPES,
  BUSINESS_TYPES_MAP,
  resolveBusinessType
} from "./businessTaxonomy753.js";
import {
  getIndustryVocabulary,
  getAllowedVocabulary,
  getForbiddenTerms,
  detectCrossDomainLeakage
} from "./industryVocabularyMap.js";

export {
  MACRO_INDUSTRIES,
  BUSINESS_TYPES,
  BUSINESS_TYPES_MAP,
  resolveBusinessType
};

export const BUSINESS_ARCHETYPES = {
  LOCAL_RETAIL: {
    id: "LOCAL_RETAIL",
    titleFa: "فروشگاه و مغازه فیزیکی حضوری",
    focus: ["محدوده دسترسی (Catchment)", "پاخور و ترافیک ورودی", "گوگل‌مپ و جستجوی محلی", "گردش موجودی", "وفاداری و خرید تکراری"],
    metrics: ["foot_traffic", "store_conversion", "average_basket", "inventory_turnover", "local_review_score"],
    risks: ["مکان نامناسب", "خواب سرمایه در انبار", "رقابت آنلاین", "افت فصلی پاخور"]
  },
  PHYSICAL_RETAIL: {
    id: "PHYSICAL_RETAIL",
    titleFa: "خرده‌فروشی فیزیکی، فروشگاهی و زنجیره‌ای",
    focus: ["پاخور مشتریان", "چیدمان و تجربه خرید فروشگاهی", "مدیریت و گردش موجودی کالا", "سیستم صندوق و تسویه POS", "باشگاه مشتریان و تخفیف‌های دوره‌ای"],
    metrics: ["foot_traffic", "store_conversion", "average_basket", "inventory_turnover", "gmv_per_sqm"],
    risks: ["هزینه بالای اجاره تجاری", "افت فصلی ترافیک خریدار", "خواب سرمایه در کالا", "رقابت پلتفرم‌های اینترنتی"]
  },
  ECOMMERCE_DTC: {
    id: "ECOMMERCE_DTC",
    titleFa: "آنلاین‌شاپ و فروش مستقیم اینترنتی",
    focus: ["مسیر ورود ترافیک", "نرخ رهاسازی سبد خرید", "هزینه ارسال و زمان تحویل", "تکرار خرید و بازگشت مشتری", "اعتماد پرداخت"],
    metrics: ["sessions", "conversion_rate", "average_order_value", "cart_abandonment", "repeat_purchase_rate", "CAC"],
    risks: ["وابستگی شدید به اینستاگرام یا کانال منفرد", "افزایش هزینه جذب", "مرجوعی کالا", "نوسان قیمت تامین"]
  },
  LOCAL_SERVICE: {
    id: "LOCAL_SERVICE",
    titleFa: "خدمات حضوری و محلی (کارواش، اتوسرویس، تعمیرگاه، سالن، کلینیک)",
    focus: ["شعاع ارائه خدمت و موقعیت محلی", "سرعت تحویل و کیفیت کار", "تکمیل ظرفیت خط/جک", "نظرات و امتیاز در نشان و بلد و گوگل", "مشتریان بازگشتی"],
    metrics: ["booking_rate", "bay_utilization", "average_ticket", "repeat_rate", "local_maps_rank"],
    risks: ["کندی سرعت و صف‌های طولانی", "نارضایتی از کیفیت کار پرسنل", "فصلی بودن برخی خدمات"]
  },
  PROFESSIONAL_SERVICE: {
    id: "PROFESSIONAL_SERVICE",
    titleFa: "خدمات تخصصی، مشاوره‌ای و پرسونال برندینگ",
    focus: ["تخصص محوری و اعتبار فردی", "فرآیند پروپوزال و مذاکره", "ارزش قرارداد (ACV)", "طول دوره فروش", "قراردادهای ریتاینر"],
    metrics: ["qualified_leads", "win_rate", "average_contract_value", "sales_cycle", "client_retention"],
    risks: ["وابستگی ۱۰۰٪ به بنیان‌گذار", "طولانی شدن زمان تصمیم‌گیری کارفرما", "فرسایش تیم در پروژه‌های سفارشی"]
  },
  B2B_SERVICE: {
    id: "B2B_SERVICE",
    titleFa: "خدمات و راهکارهای سازمانی به شرکت‌ها (B2B)",
    focus: ["کمیته تصمیم‌گیری (DMU)", "توجیه بازگشت سرمایه (ROI)", "امنیت و انطباق فنی", "تیم تدارکات و مالی"],
    metrics: ["pipeline_value", "qualified_opportunities", "win_rate", "sales_cycle", "expansion_revenue"],
    risks: ["دوره وصول مطالبات طولانی", "تغییر مدیران در شرکت مشتری", "پیچیدگی فرآیند استقرار"]
  },
  SAAS_SOFTWARE: {
    id: "SAAS_SOFTWARE",
    titleFa: "نرم‌افزار، اپلیکیشن و سرویس ابری (SaaS)",
    focus: ["فعال‌سازی اولیه (Time-to-Value)", "درآمد ماهانه پایدار (MRR)", "نرخ ریزش مشتری (Churn)", "پذیرش محصول (Product-Led)"],
    metrics: ["MRR", "ARR", "activation_rate", "logo_churn", "revenue_churn", "CAC_payback"],
    risks: ["ریزش کاربر بعد از ثبت‌نام اولیه", "هزینه‌های سرور و توسعه", "چالش پرداخت ارزی در ایران"]
  },
  MARKETPLACE: {
    id: "MARKETPLACE",
    titleFa: "مارکت‌پلیس دوطرفه (خریدار و فروشنده)",
    focus: ["نقدشوندگی و تعادل عرضه و تقاضا", "کارمزد و نرخ مشارکت (Take Rate)", "جلوگیری از دور زدن پلتفرم", "کنترل کیفیت تامین‌کنندگان"],
    metrics: ["GMV", "take_rate", "active_buyers", "active_sellers", "match_rate"],
    risks: ["معامله خارج از پلتفرم (Leakage)", "مسئله مرغ و تخم‌مرغ در روزهای اول", "اختلاف بین خریدار و فروشنده"]
  },
  MANUFACTURER: {
    id: "MANUFACTURER",
    titleFa: "کارخانه، کارگاه تولیدی و صنایع B2B",
    focus: ["ظرفیت اسمی و واقعی تولید", "حداقل سفارش (MOQ)", "زمان تحویل و تلرانس کیفی", "ریسک مواد اولیه", "شبکه نمایندگی و فروش عمده"],
    metrics: ["production_capacity", "capacity_utilization", "defect_rate", "lead_time", "MOQ", "gross_margin"],
    risks: ["نوسان قیمت مواد اولیه", "گلوگاه دستگاه‌ها و خط تولید", "وابستگی به چند پخش‌کننده بزرگ"]
  },
  CREATOR_MEDIA_EDUCATION: {
    id: "CREATOR_MEDIA_EDUCATION",
    titleFa: "کریتور، رسانه، آموزش و دوره‌های مهارتی",
    focus: ["مالکیت مخاطب", "مسیر محتوای رایگان به محصول تخصصی", "اعتبار علمی مدرس", "جامعه و کامیونیتی"],
    metrics: ["owned_audience", "lead_to_paid", "course_completion", "repeat_purchase", "referral_rate"],
    risks: ["فرسایش ناشی از تولید محتوای مداوم", "کپی غیرمجاز دوره‌ها", "تغییر الگوریتم شبکه‌های اجتماعی"]
  },
  RESTAURANT_CAFE_HOSPITALITY: {
    id: "RESTAURANT_CAFE_HOSPITALITY",
    titleFa: "کافه، رستوران و صنایع غذایی/پذیرایی",
    focus: ["کیفیت و ثبات طعم", "گردش میز و ظرفیت پذیرش", "ترکیب سفارش بیرون‌بر", "اتمسفر فضایی و تجربه مشتری", "باشگاه وفاداری"],
    metrics: ["covers", "average_check", "food_cost_percent", "waste_rate", "repeat_guest_rate"],
    risks: ["افزایش قیمت مواد اولیه فاسدشدنی", "افت کیفیت در زمان شلوغی", "نظرات منفی روی پلتفرم‌های سفارش"]
  },
  HEALTH_BEAUTY_WELLNESS: {
    id: "HEALTH_BEAUTY_WELLNESS",
    titleFa: "محصولات یا خدمات سلامت، پوست و زیبایی",
    focus: ["حساسیت اعتماد و اصالت", "مرزهای قانونی ادعاها و تبلیغات", "مشاوره قبل از مصرف", "تکرار مصرف پایدار"],
    metrics: ["consultation_to_purchase", "repeat_rate", "retention", "adverse_issue_rate"],
    risks: ["مقررات سخت‌گیرانه غذا و دارو", "حساسیت روی ادعاهای درمانی", "شایعات حیثیتی"]
  },
  WHOLESALE: {
    id: "WHOLESALE",
    titleFa: "عمده‌فروشی، بنکداری و شبکه توزیع منطقه‌ای",
    focus: ["شبکه مویرگی خرده‌فروشان", "حداقل تیراژ سفارش (MOQ)", "مدیریت چک و اعتبار تجاری", "لجستیک انبار و تحویل حجمی", "تامین مطمئن با قیمت کارخانه"],
    metrics: ["order_volume", "gross_margin", "days_sales_outstanding", "fill_rate", "client_reorder_rate"],
    risks: ["ریسک نکول چک‌های بازار", "نوسانات شدید قیمت ارز و مواد", "تغییر سیاست‌های تولیدکنندگان مادر"]
  },
  AGENCY: {
    id: "AGENCY",
    titleFa: "آژانس تخصصی، استودیو خلاقیت و شرکت ارائه‌دهنده خدمات اجرایی",
    focus: ["کیفیت پورتفولیو و نمونه‌کارها", "بهره‌وری تیم و ظرفیت ساعتی (Utilization)", "قراردادهای ماهانه مداوم (Retainer)", "رضایت و حفظ مشتری سازمانی"],
    metrics: ["billable_utilization", "retainer_mrr", "project_margin", "client_nps", "lead_to_contract"],
    risks: ["فرسایش نیروهای کلیدی تیم", "طولانی شدن تسویه‌حساب‌های کارفرمایان", "تغییرات اسکوپ ناخواسته (Scope Creep)"]
  },
  FINANCIAL_SERVICE: {
    id: "FINANCIAL_SERVICE",
    titleFa: "خدمات مالی، سرمایه‌گذاری، بیمه و فین‌تک",
    focus: ["انطباق با مقررات بانک مرکزی و بیمه مرکزی", "اعتماد، امنیت اطلاعات و شفافیت مالی", "مدیریت ریسک سبد و دارایی‌ها", "کاهش اصطکاک پرداخت و تراکنش"],
    metrics: ["assets_under_management", "transaction_volume", "default_rate", "compliance_score", "retention_rate"],
    risks: ["مقررات دستوری و نوسان نرخ‌ها", "ریسک‌های حراست از امنیت سایبری", "افت اعتماد عمومی ناشی از تورم"]
  },
  EDUCATION: {
    id: "EDUCATION",
    titleFa: "آموزشگاه، موسسه تحصیلی، مهارتی و پژوهشی",
    focus: ["کیفیت متدولوژی آموزشی و اساتید", "خروجی ملموس و استخدام‌پذیری فراگیران", "نرخ تکمیل دوره و رضایت دانشجویان", "ارزیابی و مدارک معتبر مهارتی"],
    metrics: ["enrollment_rate", "course_completion_rate", "learner_nps", "placement_rate", "repeat_course_rate"],
    risks: ["کاهش قدرت خرید شهریه خانوارها", "کپی‌برداری محتوای آموزشی", "تغییر ترجیحات مهارتی بازار کار"]
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    titleFa: "سرگرمی، بازی، تجربه فضایی، گردشگری و ایونت",
    focus: ["تجربه غوطه‌وری و اتمسفر حسی", "نرخ جذب مخاطبان جدید و وایرال ارگانیک", "ضریب اشغال و بلیط‌فروشی سانس‌ها", "خدمات جانبی و یادگاری‌ها"],
    metrics: ["capacity_utilization", "ticket_conversion", "social_shares", "review_rating", "per_capita_spend"],
    risks: ["فصلی بودن و حساسیت به شرایط تعطیلات", "نیاز مداوم به نوسازی جاذبه‌ها", "هزینه‌های سنگین استهلاک تجهیزات"]
  },
  HOLDING: {
    id: "HOLDING",
    titleFa: "هلدینگ، گروه چندشرکتی و سرمایه‌گذاری متمرکز",
    focus: ["هم‌افزایی میان شرکت‌های تابعه (Synergy)", "حاکمیت شرکتی و تخصیص بهینه سرمایه", "ارزش‌گذاری و پایش بازده دارایی‌ها (ROIC)", "مدیریت پرتفوی استراتژیک"],
    metrics: ["roic", "portfolio_nav", "cross_sell_ratio", "overhead_cost_ratio", "aggregate_ebitda"],
    risks: ["بوروکراسی سنگین تصمیم‌گیری", "تداخل منافع زیرمجموعه‌ها", "ریسک‌های سیستمیک اقتصاد کلان"]
  },
  HYBRID_FRONTIER: {
    id: "HYBRID_FRONTIER",
    titleFa: "مدل‌های نوین هیبرید، پیشرو و فناوری‌های مرزی",
    focus: ["نوآوری در نحوه خلق و تحویل ارزش", "سرعت اعتبارسنجی فرضیات محصول", "شبکه‌ای بودن اثرات و چسبندگی مدل", "چابکی عملیاتی و مقیاس‌پذیری الگوریتمی"],
    metrics: ["viral_coefficient", "time_to_scale", "unit_contribution_margin", "platform_retention", "agentic_throughput"],
    risks: ["ابهامات قانونی در رسته‌های نوظهور", "سختی انتقال ارزش به مشتریان سنتی", "هزینه‌های بالای آموزش بازار"]
  },
  OTHER: {
    id: "OTHER",
    titleFa: "مدل ترکیبی یا اختصاصی",
    focus: ["نحوه خلق ارزش", "مسیر ورود پول", "محدودیت‌های گلوگاهی عملیات"],
    metrics: ["gross_margin", "sales_cycle", "repeat_rate"],
    risks: ["پیچیدگی مدل کسب‌وکار", "ناهماهنگی کانال‌ها"]
  }
};

export function classifyBusinessContext(phaseData = {}, rawAnswers = {}) {
  const p1 = phaseData[1] || {};
  const stage = String(p1.stage || rawAnswers.stage || "active").toLowerCase();
  const desc = String(p1.description || rawAnswers.description || "").toLowerCase();
  const descVal = String(p1.descriptionValue || rawAnswers.descriptionValue || "").toLowerCase();
  const geo = String(p1.geography || rawAnswers.geography || "nationwide_iran").toLowerCase();
  const offer = String(p1.coreOffer || rawAnswers.coreOffer || "").toLowerCase();
  const goal = String(p1.primaryGoal || rawAnswers.primaryGoal || "").toLowerCase();
  const taxonomyQuery = String(p1.taxonomyId || p1.taxonomyCode || rawAnswers.taxonomyId || rawAnswers.taxonomyCode || "").toLowerCase();
  const combined = `${desc} ${descVal} ${offer} ${geo} ${goal} ${taxonomyQuery}`;

  // 1. Resolve Universal 753 Taxonomy Business Type
  let resolvedBusiness = null;
  if (taxonomyQuery) {
    resolvedBusiness = resolveBusinessType(taxonomyQuery);
  } else if (descVal.startsWith("bt-") || desc.startsWith("bt-")) {
    const key = (descVal.startsWith("bt-") ? descVal : desc).toUpperCase();
    resolvedBusiness = BUSINESS_TYPES_MAP[key] || resolveBusinessType(key);
  } else if (descVal === "industrial_manufacturing" || descVal === "manufacturer") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0221"] || resolveBusinessType(desc || combined);
  } else if (descVal === "hospitality_cafe_roastery" || descVal === "restaurant_cafe") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0066"] || resolveBusinessType(desc || combined);
  } else if (descVal === "local_automotive_service" || descVal === "local_service") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0136"] || resolveBusinessType(desc || combined);
  } else if (descVal === "b2b_saas_software" || descVal === "saas_software") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0166"] || resolveBusinessType(desc || combined);
  } else if (descVal === "creator_coaching_personal" || descVal === "creator_media") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0496"] || resolveBusinessType(desc || combined);
  } else if (descVal === "ecommerce_products" || descVal === "ecommerce") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0186"] || resolveBusinessType(desc || combined);
  } else if (descVal === "coaching_consulting" || descVal === "professional_service") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0496"] || resolveBusinessType(desc || combined);
  } else if (descVal === "b2b_service") {
    resolvedBusiness = BUSINESS_TYPES_MAP["BT-0431"] || resolveBusinessType(desc || combined);
  } else {
    resolvedBusiness = resolveBusinessType(desc || offer || combined);
  }

  // 2. Determine Archetype (Strict Precedence for 100% Backward Compatibility)
  let archetype = BUSINESS_ARCHETYPES.PROFESSIONAL_SERVICE;

  // Step 2A: Explicit descVal selections take top precedence
  if (descVal === "industrial_manufacturing" || descVal === "manufacturer") {
    archetype = BUSINESS_ARCHETYPES.MANUFACTURER;
  } else if (descVal === "hospitality_cafe_roastery" || descVal === "restaurant_cafe") {
    archetype = BUSINESS_ARCHETYPES.RESTAURANT_CAFE_HOSPITALITY;
  } else if (descVal === "local_automotive_service" || descVal === "local_service") {
    archetype = BUSINESS_ARCHETYPES.LOCAL_SERVICE;
  } else if (descVal === "b2b_saas_software" || descVal === "saas_software") {
    archetype = BUSINESS_ARCHETYPES.SAAS_SOFTWARE;
  } else if (descVal === "creator_coaching_personal" || descVal === "creator_media") {
    archetype = BUSINESS_ARCHETYPES.CREATOR_MEDIA_EDUCATION;
  } else if (descVal === "ecommerce_products" || descVal === "ecommerce") {
    archetype = BUSINESS_ARCHETYPES.ECOMMERCE_DTC;
  } else if (descVal === "coaching_consulting" || descVal === "professional_service") {
    archetype = BUSINESS_ARCHETYPES.PROFESSIONAL_SERVICE;
  } else if (descVal === "b2b_service") {
    archetype = BUSINESS_ARCHETYPES.B2B_SERVICE;
  } else if (
    // Step 2B: Fallback to heuristic keyword matching when descVal is not an explicit canonical choice
    combined.includes("manufacturer") ||
    combined.includes("کارخانه") ||
    combined.includes("قالب") ||
    combined.includes("تولید قطعات") ||
    combined.includes("ماشین‌کاری") ||
    combined.includes("صنعتی") ||
    combined.includes("کارگاه") ||
    (combined.includes("قطعات") && (combined.includes("تولید") || combined.includes("صنعتی") || combined.includes("قالب") || combined.includes("کارخانه")))
  ) {
    archetype = BUSINESS_ARCHETYPES.MANUFACTURER;
  } else if (
    combined.includes("restaurant_cafe") ||
    combined.includes("کافه") ||
    combined.includes("رستوران") ||
    combined.includes("قهوه") ||
    combined.includes("رستری") ||
    combined.includes("فود") ||
    combined.includes("پذیرایی") ||
    combined.includes("قنادی") ||
    combined.includes("کترینگ")
  ) {
    archetype = BUSINESS_ARCHETYPES.RESTAURANT_CAFE_HOSPITALITY;
  } else if (
    combined.includes("local_service") ||
    combined.includes("خودرو") ||
    combined.includes("کارواش") ||
    combined.includes("دیتیلینگ") ||
    combined.includes("تعویض") ||
    combined.includes("روغن") ||
    combined.includes("تعمیر") ||
    combined.includes("مکانیک") ||
    combined.includes("اتوسرویس") ||
    combined.includes("قالیشویی") ||
    combined.includes("خدمات محلی")
  ) {
    archetype = BUSINESS_ARCHETYPES.LOCAL_SERVICE;
  } else if (
    combined.includes("saas_software") ||
    combined.includes("digital_product") ||
    combined.includes("نرم‌افزار") ||
    combined.includes("اپلیکیشن") ||
    combined.includes("ابری") ||
    combined.includes("حسابداری") ||
    combined.includes("مودیان") ||
    combined.includes("پلتفرم") ||
    combined.includes("saas")
  ) {
    archetype = BUSINESS_ARCHETYPES.SAAS_SOFTWARE;
  } else if (
    combined.includes("coaching") ||
    combined.includes("آموزش") ||
    combined.includes("دوره") ||
    combined.includes("کریتور") ||
    combined.includes("مربی") ||
    combined.includes("محتوا")
  ) {
    archetype = BUSINESS_ARCHETYPES.CREATOR_MEDIA_EDUCATION;
  } else if (
    combined.includes("ecommerce") ||
    combined.includes("آنلاین‌شاپ") ||
    combined.includes("فروشگاه") ||
    combined.includes("محصول فیزیکی") ||
    combined.includes("خرده‌فروشی") ||
    combined.includes("کالا")
  ) {
    archetype = BUSINESS_ARCHETYPES.ECOMMERCE_DTC;
  } else if (
    combined.includes("coaching_consulting") ||
    combined.includes("مشاوره") ||
    combined.includes("پرسونال") ||
    combined.includes("استراتژی") ||
    combined.includes("وکیل") ||
    combined.includes("پزشک") ||
    combined.includes("تخصصی")
  ) {
    archetype = BUSINESS_ARCHETYPES.PROFESSIONAL_SERVICE;
  } else if (
    combined.includes("b2b") ||
    combined.includes("سازمان") ||
    combined.includes("شرکت")
  ) {
    archetype = BUSINESS_ARCHETYPES.B2B_SERVICE;
  } else if (geo.includes("local") || combined.includes("حضوری")) {
    archetype = BUSINESS_ARCHETYPES.LOCAL_SERVICE;
  } else if (resolvedBusiness && BUSINESS_ARCHETYPES[resolvedBusiness.primaryArchetype]) {
    archetype = BUSINESS_ARCHETYPES[resolvedBusiness.primaryArchetype];
  }

  // 3. Customer Model
  let customerModel = "B2C";
  if (
    archetype.id === "MANUFACTURER" ||
    archetype.id === "B2B_SERVICE" ||
    archetype.id === "SAAS_SOFTWARE" ||
    descVal === "industrial_manufacturing" ||
    descVal === "b2b_saas_software" ||
    combined.includes("سازمان") ||
    combined.includes("شرکت") ||
    combined.includes("b2b")
  ) {
    customerModel = "B2B";
  } else if (archetype.id === "MARKETPLACE") {
    customerModel = "TWO_SIDED";
  } else if (archetype.id === "LOCAL_SERVICE" || archetype.id === "RESTAURANT_CAFE_HOSPITALITY" || archetype.id === "ECOMMERCE_DTC") {
    customerModel = "B2C";
  } else if (resolvedBusiness?.axes?.customerModel && resolvedBusiness.axes.customerModel !== "MIXED") {
    customerModel = resolvedBusiness.axes.customerModel;
  }

  // 4. Channel & Geography
  const channelModel =
    archetype.id === "LOCAL_SERVICE" || archetype.id === "RESTAURANT_CAFE_HOSPITALITY" || geo.includes("local")
      ? "PHYSICAL_FIRST"
      : archetype.id === "MANUFACTURER"
      ? "DIRECT_SALES_B2B"
      : combined.includes("فروشگاه حضوری")
      ? "HYBRID"
      : (resolvedBusiness?.axes?.channelModel || "ONLINE_FIRST");

  const geographicScope = geo.includes("international")
    ? "REGIONAL_INTERNATIONAL"
    : geo.includes("local") || archetype.id === "LOCAL_SERVICE" || archetype.id === "RESTAURANT_CAFE_HOSPITALITY"
    ? "CITY"
    : (geo.includes("nationwide") ? "NATIONAL" : (resolvedBusiness?.axes?.geography === "CITY" ? "CITY" : "NATIONAL"));

  // 5. Maturity
  let maturity = "EARLY_ACTIVE";
  if (stage.includes("idea")) maturity = "IDEA";
  else if (stage.includes("pre_launch")) maturity = "PRE_LAUNCH";
  else if (stage.includes("rebrand")) maturity = "REBRAND";
  else if (resolvedBusiness?.axes?.maturity) maturity = resolvedBusiness.axes.maturity;

  // 6. Active Overlays
  const overlays = [archetype.id, customerModel, channelModel, maturity, geographicScope];
  if (archetype.id === "LOCAL_SERVICE") {
    overlays.push("LOCAL_GUILD_REGULATION", "CASH_TRANSACTION_FLOW");
  } else if (archetype.id === "RESTAURANT_CAFE_HOSPITALITY") {
    overlays.push("FOOD_SAFETY_REGULATION", "EXPERIENTIAL_SPACE");
  } else if (archetype.id === "MANUFACTURER") {
    overlays.push("HEAVY_CAPEX_SUPPLY_CHAIN", "ISO_STANDARDS_COMPLIANCE", "PROCUREMENT_COMMITTEE");
  } else if (archetype.id === "SAAS_SOFTWARE") {
    overlays.push("RECURRING_SUBSCRIPTION_METRICS", "TAX_SYSTEM_INTEGRATION", "DATA_SECURITY_COMPLIANCE");
  } else if (
    archetype.id === "CREATOR_MEDIA_EDUCATION" ||
    archetype.id === "PROFESSIONAL_SERVICE" ||
    combined.includes("آموزش")
  ) {
    overlays.push("FOUNDER_LED", "COMMUNITY_TRUST");
  }
  if (
    combined.includes("پزشکی") ||
    combined.includes("سلامت") ||
    combined.includes("آرایشی")
  ) {
    overlays.push("REGULATED_HIGH_TRUST");
  }
  if (resolvedBusiness && Array.isArray(resolvedBusiness.activeOverlays)) {
    for (const ov of resolvedBusiness.activeOverlays) {
      if (!overlays.includes(ov)) overlays.push(ov);
    }
  }

  // 7. Orthogonal 15 Context Axes
  const offerType = resolvedBusiness?.axes?.offerType || (
    archetype.id === "MANUFACTURER" || archetype.id === "ECOMMERCE_DTC" || archetype.id === "LOCAL_RETAIL" || archetype.id === "PHYSICAL_RETAIL"
      ? "PHYSICAL_PRODUCT"
      : archetype.id === "SAAS_SOFTWARE"
      ? "DIGITAL_PRODUCT"
      : "SERVICE"
  );
  const revenueModel = resolvedBusiness?.axes?.revenueModel || (archetype.id === "SAAS_SOFTWARE" ? "RECURRING" : "TRANSACTION");
  const scale = resolvedBusiness?.axes?.scale || (archetype.id === "MANUFACTURER" ? "MEDIUM" : "SMALL");
  const salesMotion = resolvedBusiness?.axes?.salesMotion || (
    archetype.id === "MANUFACTURER" ? "FIELD_ENTERPRISE" : archetype.id === "LOCAL_SERVICE" || archetype.id === "RESTAURANT_CAFE_HOSPITALITY" ? "RETAIL" : "INBOUND"
  );
  const branchStructure = resolvedBusiness?.axes?.branchStructure || "SINGLE_LOCATION";
  const founderRole = resolvedBusiness?.axes?.founderRole || (
    archetype.id === "CREATOR_MEDIA_EDUCATION" || archetype.id === "PROFESSIONAL_SERVICE" ? "FOUNDER_LED" : "SUPPORTING"
  );
  const purchaseCycle = resolvedBusiness?.axes?.purchaseCycle || (
    archetype.id === "MANUFACTURER" ? "LONG_MONTHS" : archetype.id === "LOCAL_SERVICE" || archetype.id === "RESTAURANT_CAFE_HOSPITALITY" ? "SHORT_DAYS" : "MEDIUM_WEEKS"
  );
  const relationshipModel = resolvedBusiness?.axes?.relationshipModel || (
    archetype.id === "SAAS_SOFTWARE" ? "CONTRACTUAL_RETAINER" : "REPEAT_HABITUAL"
  );
  const regulatoryProfile = resolvedBusiness?.axes?.regulatoryProfile || (
    archetype.id === "MANUFACTURER" ? "HIGHLY_REGULATED" : "NORMAL"
  );
  const operationalComplexity = resolvedBusiness?.axes?.operationalComplexity || (
    archetype.id === "MANUFACTURER" ? "HIGH" : "MODERATE"
  );
  const brandArchitecture = resolvedBusiness?.axes?.brandArchitecture || "STANDALONE";

  return {
    // 100% Backward-compatible Core Legacy Contract
    archetype: archetype.id,
    primaryArchetype: archetype.id,
    archetypeTitle: archetype.titleFa,
    customerModel,
    channelModel,
    maturity,
    geographicScope,
    activeOverlays: overlays,
    focusAreas: archetype.focus,
    candidateMetrics: archetype.metrics,
    seededRisks: archetype.risks,
    confidence: "USER_CONFIRMED",

    // Universal 753 Taxonomy Identifiers
    taxonomyId: resolvedBusiness?.id || "BT-0753",
    taxonomyTitleFa: resolvedBusiness?.titleFa || archetype.titleFa,
    taxonomyTitleEn: resolvedBusiness?.titleEn || archetype.id,
    iranianGuildCode: resolvedBusiness?.iranianGuildCode || "999999",
    industryId: resolvedBusiness?.industryId || "IND-31",
    industryCode: resolvedBusiness?.industryCode || "EMERGING_HYBRID_FRONTIER_MODELS",

    // 15 Orthogonal Context Axes (Single Source of Truth)
    axes: {
      customerModel,
      offerType,
      channelModel,
      revenueModel,
      maturity,
      scale,
      salesMotion,
      geography: geographicScope,
      branchStructure,
      founderRole,
      purchaseCycle,
      relationshipModel,
      regulatoryProfile,
      operationalComplexity,
      brandArchitecture
    },

    // Top-Level Convenience Accessors
    offerType,
    revenueModel,
    scale,
    salesMotion,
    geography: geographicScope,
    branchStructure,
    founderRole,
    purchaseCycle,
    relationshipModel,
    regulatoryProfile,
    operationalComplexity,
    brandArchitecture
  };
}

/**
 * 8-Tier Business Specialization Hierarchy Resolution Engine (Requirement R5 & R6)
 *
 * Tier 1: Exact Business Type (BT-0001 to BT-0753)
 * Tier 2: Macro Industry Module (IND-01 to IND-31)
 * Tier 3: Primary Archetype (Structural Model)
 * Tier 4: 15 Orthogonal Context Axes
 * Tier 5: Business Stage (IDEA, PRE_LAUNCH, ACTIVE, REBRAND)
 * Tier 6: Prior Answers Accumulator
 * Tier 7: Known Facts & Evidence Ledger
 * Tier 8: Question Generation & Jargon Filtering
 *
 * @param {string|object} businessTypeInput - BT code, Industry code, query string, or context object
 * @param {object} [contextAxes={}] - 15 context axes overrides or partial axes
 * @param {number} [phaseNumber=1] - Phase number (1 to 8)
 * @param {object} [options={}] - Additional specialization options
 * @returns {object} DomainSpecializationResult
 */
export function resolveDomainSpecialization(businessTypeInput, contextAxes = {}, phaseNumber = 1, options = {}) {
  let matchedBt = null;
  let matchedIndustry = null;
  let inputAxes = {};
  let inputOverlays = [];

  if (businessTypeInput && typeof businessTypeInput === "object") {
    const btId = businessTypeInput.taxonomyId || businessTypeInput.id;
    if (btId && typeof btId === "string" && btId.toUpperCase().startsWith("BT-")) {
      matchedBt = BUSINESS_TYPES_MAP[btId.toUpperCase()] || null;
    }

    const indId = businessTypeInput.industryId || businessTypeInput.industryCode;
    if (indId) {
      matchedIndustry = MACRO_INDUSTRIES.find(m => m.id === indId || m.code === indId) || null;
    }

    if (!matchedBt) {
      const q = businessTypeInput.query || businessTypeInput.taxonomyTitleFa || businessTypeInput.archetypeTitle || "";
      if (q) {
        matchedBt = resolveBusinessType(q);
      }
    }

    if (businessTypeInput.axes) {
      inputAxes = businessTypeInput.axes;
    }
    if (Array.isArray(businessTypeInput.activeOverlays)) {
      inputOverlays = businessTypeInput.activeOverlays;
    }
  } else if (typeof businessTypeInput === "string") {
    const rawKey = businessTypeInput.trim();
    const upperKey = rawKey.toUpperCase();
    if (upperKey.startsWith("BT-") && BUSINESS_TYPES_MAP[upperKey]) {
      matchedBt = BUSINESS_TYPES_MAP[upperKey];
    } else if (upperKey.startsWith("IND-") || MACRO_INDUSTRIES.some(m => m.code === upperKey)) {
      matchedIndustry = MACRO_INDUSTRIES.find(m => m.id === upperKey || m.code === upperKey) || null;
    } else {
      matchedBt = resolveBusinessType(rawKey);
    }
  }

  let specializationLevel = "ARCHETYPE_FALLBACK";
  if (matchedBt) {
    specializationLevel = "EXACT_BT";
    if (!matchedIndustry) {
      matchedIndustry = MACRO_INDUSTRIES.find(m => m.id === matchedBt.industryId) || null;
    }
  } else if (matchedIndustry) {
    specializationLevel = "INDUSTRY_OVERLAY";
  }

  const taxonomyId = matchedBt?.id || (typeof businessTypeInput === "object" && businessTypeInput?.taxonomyId) || "BT-0753";
  const tradeTitleFa = matchedBt?.titleFa || (typeof businessTypeInput === "object" && businessTypeInput?.taxonomyTitleFa) || matchedIndustry?.titleFa || (typeof businessTypeInput === "object" && businessTypeInput?.archetypeTitle) || "کسب‌وکار";
  const tradeTitleEn = matchedBt?.titleEn || (typeof businessTypeInput === "object" && businessTypeInput?.taxonomyTitleEn) || matchedIndustry?.titleEn || "Business";
  const iranianGuildCode = matchedBt?.iranianGuildCode || (typeof businessTypeInput === "object" && businessTypeInput?.iranianGuildCode) || "999999";
  const industryId = matchedBt?.industryId || matchedIndustry?.id || (typeof businessTypeInput === "object" && businessTypeInput?.industryId) || "IND-31";
  const industryCode = matchedBt?.industryCode || matchedIndustry?.code || (typeof businessTypeInput === "object" && businessTypeInput?.industryCode) || "EMERGING_HYBRID_FRONTIER_MODELS";
  const industryTitleFa = matchedIndustry?.titleFa || "مدل‌های نوظهور و هیبریدی پیشگام";

  let primaryArchetype = matchedBt?.primaryArchetype || matchedIndustry?.primaryArchetype;
  if (!primaryArchetype && typeof businessTypeInput === "object") {
    primaryArchetype = businessTypeInput.primaryArchetype || businessTypeInput.archetype;
  }
  if (!primaryArchetype) {
    primaryArchetype = contextAxes.archetype || "PROFESSIONAL_SERVICE";
  }
  const archetypeDef = BUSINESS_ARCHETYPES[primaryArchetype] || BUSINESS_ARCHETYPES.PROFESSIONAL_SERVICE;
  const archetypeTitle = archetypeDef.titleFa;

  const defaultAxes = (matchedBt?.axes) || (matchedIndustry?.defaultAxes) || {};
  const mergedAxes = {
    customerModel: contextAxes.customerModel || inputAxes.customerModel || defaultAxes.customerModel || (primaryArchetype === "MANUFACTURER" || primaryArchetype === "B2B_SERVICE" || primaryArchetype === "SAAS_SOFTWARE" ? "B2B" : "B2C"),
    offerType: contextAxes.offerType || inputAxes.offerType || defaultAxes.offerType || (primaryArchetype === "MANUFACTURER" ? "PRODUCT" : primaryArchetype === "SAAS_SOFTWARE" ? "SOFTWARE" : "SERVICE"),
    channelModel: contextAxes.channelModel || inputAxes.channelModel || defaultAxes.channelModel || (primaryArchetype === "LOCAL_SERVICE" || primaryArchetype === "RESTAURANT_CAFE_HOSPITALITY" ? "PHYSICAL_FIRST" : primaryArchetype === "MANUFACTURER" ? "DIRECT_SALES_B2B" : "ONLINE_FIRST"),
    revenueModel: contextAxes.revenueModel || inputAxes.revenueModel || defaultAxes.revenueModel || (primaryArchetype === "SAAS_SOFTWARE" ? "RECURRING" : "TRANSACTION"),
    maturity: options.businessStage || contextAxes.maturity || inputAxes.maturity || defaultAxes.maturity || "ACTIVE",
    scale: contextAxes.scale || inputAxes.scale || defaultAxes.scale || (primaryArchetype === "MANUFACTURER" ? "MEDIUM" : "SMALL"),
    salesMotion: contextAxes.salesMotion || inputAxes.salesMotion || defaultAxes.salesMotion || "RETAIL",
    geography: contextAxes.geography || contextAxes.geographicScope || inputAxes.geography || inputAxes.geographicScope || defaultAxes.geography || "CITY",
    branchStructure: contextAxes.branchStructure || inputAxes.branchStructure || defaultAxes.branchStructure || "SINGLE_LOCATION",
    founderRole: contextAxes.founderRole || inputAxes.founderRole || defaultAxes.founderRole || "SUPPORTING",
    purchaseCycle: contextAxes.purchaseCycle || inputAxes.purchaseCycle || defaultAxes.purchaseCycle || "SHORT_DAYS",
    relationshipModel: contextAxes.relationshipModel || inputAxes.relationshipModel || defaultAxes.relationshipModel || "REPEAT_HABITUAL",
    regulatoryProfile: contextAxes.regulatoryProfile || inputAxes.regulatoryProfile || defaultAxes.regulatoryProfile || "NORMAL",
    operationalComplexity: contextAxes.operationalComplexity || inputAxes.operationalComplexity || defaultAxes.operationalComplexity || "MODERATE",
    brandArchitecture: contextAxes.brandArchitecture || inputAxes.brandArchitecture || defaultAxes.brandArchitecture || "STANDALONE"
  };

  const terminologyAllowlist = getAllowedVocabulary(industryId);
  const forbiddenTerms = getForbiddenTerms(industryId, options);

  const isAutomotive = 
    industryId === "IND-05" ||
    tradeTitleFa.includes("خودرو") ||
    tradeTitleFa.includes("کارواش") ||
    tradeTitleFa.includes("روغن") ||
    tradeTitleFa.includes("مکانیک") ||
    tradeTitleFa.includes("تعمیرگاه") ||
    tradeTitleFa.includes("اتوسرویس");

  const isCafe = 
    options.subDomain === "CAFE" ||
    taxonomyId === "BT-0066" ||
    taxonomyId === "BT-0067" ||
    tradeTitleFa.includes("کافه") ||
    tradeTitleFa.includes("قهوه") ||
    tradeTitleFa.includes("رستری");

  const isDining = 
    options.subDomain === "RESTAURANT" ||
    (!isCafe && (
      industryId === "IND-03" ||
      taxonomyId === "BT-0071" ||
      tradeTitleFa.includes("رستوران") ||
      tradeTitleFa.includes("چلوکباب") ||
      tradeTitleFa.includes("کباب") ||
      tradeTitleFa.includes("دیزی") ||
      tradeTitleFa.includes("طباخی") ||
      tradeTitleFa.includes("فست فود") ||
      tradeTitleFa.includes("غذا")
    ));

  const isMachiningTooling = 
    industryId === "IND-08" ||
    taxonomyId === "BT-0221" ||
    tradeTitleFa.includes("قالب‌سازی") ||
    tradeTitleFa.includes("تراشکاری") ||
    tradeTitleFa.includes("ماشین‌کاری") ||
    tradeTitleFa.includes("قطعات صنعتی");

  const isTextile = 
    industryId === "IND-25" ||
    tradeTitleFa.includes("نساجی") ||
    tradeTitleFa.includes("پوشاک") ||
    tradeTitleFa.includes("دوخت") ||
    tradeTitleFa.includes("تریکو") ||
    tradeTitleFa.includes("پارچه") ||
    tradeTitleFa.includes("چرم");

  const isTaxSaaS = 
    options.subDomain === "TAX_SAAS" ||
    (industryId === "IND-06" && (
      taxonomyId === "BT-0166" ||
      taxonomyId === "BT-0171" ||
      tradeTitleFa.includes("حسابداری") ||
      tradeTitleFa.includes("مالیاتی") ||
      tradeTitleFa.includes("مودیان") ||
      inputOverlays.includes("TAX_SYSTEM_INTEGRATION")
    ));

  const isNonTaxSaaS = 
    options.subDomain === "NON_TAX_SAAS" ||
    options.isNonTaxSaaS === true ||
    (industryId === "IND-06" && !isTaxSaaS) ||
    tradeTitleFa.includes("باشگاه") ||
    tradeTitleFa.includes("crm") ||
    tradeTitleFa.includes("فیتنس");

  const isMedical = 
    (industryId === "IND-04" && (
      tradeTitleFa.includes("پزشکی") ||
      tradeTitleFa.includes("کلینیک") ||
      tradeTitleFa.includes("درمان") ||
      tradeTitleFa.includes("دندانپزشکی") ||
      tradeTitleFa.includes("بیمارستان")
    ));

  const isSalon = 
    (industryId === "IND-04" && !isMedical) ||
    tradeTitleFa.includes("سالن") ||
    tradeTitleFa.includes("زیبایی") ||
    tradeTitleFa.includes("آرایش");

  const p = parseInt(phaseNumber || 1, 10);
  let phaseTitle = `تخصصی‌سازی فاز ${p}`;
  let phaseInstruction = "";

  switch (p) {
    case 1: {
      phaseTitle = "تخصصی‌سازی فاز ۱ (کشف و بنیاد کسب‌وکار)";
      let capacityLabel = "ظرفیت واقعی عملیاتی و مدیریت منابع مالی";
      if (isAutomotive) capacityLabel = "ظرفیت پذیرش روزانه خودرو و باکس‌های فعال سرویس";
      else if (isCafe) capacityLabel = "گردش میزها، بهای تمام‌شده نوشیدنی و خوراک (Food Cost %) و حفظ مواد اولیه تازه";
      else if (isDining) capacityLabel = "گردش میز سالن، بهای تمام‌شده غذا (Food Cost %)، کنترل ضایعات آشپزخانه و سفارشات بیرون‌بر";
      else if (isMachiningTooling) capacityLabel = "ظرفیت اسمی و واقعی دستگاه‌های تراشکاری، حداقل تیراژ سفارش (MOQ) و بهای متریال مهندسی";
      else if (isTextile) capacityLabel = "ظرفیت دوخت و طاقه‌بری، حداقل تیراژ تولید (MOQ)، تامین الیاف و کنترل خواب پارچه در انبار";
      else if (isTaxSaaS) capacityLabel = "سنجه‌های درآمد ماهانه پایدار (MRR)، دوره بازگشت هزینه جذب (CAC Payback) و تطبیق با سامانه‌های مالیاتی";
      else if (isNonTaxSaaS) capacityLabel = "نرخ فعال‌سازی کاربر (Time-to-Value)، درآمد ماهانه پایدار (MRR) و نرخ حفظ مشتریان نرم‌افزار";
      else if (isSalon) capacityLabel = "ظرفیت صندلی‌های سالن، نوبت‌دهی روزانه، گردش مواد مصرفی مرغوب و سودآوری لاین‌های تخصصی";
      else if (primaryArchetype === "PHYSICAL_RETAIL" || primaryArchetype === "LOCAL_RETAIL") capacityLabel = "پاخور فروشگاه، میانگین مبلغ فاکتور، حاشیه سود خرده‌فروشی و گردش موجودی کالا در انبار";
      else if (primaryArchetype === "MANUFACTURER") capacityLabel = "ظرفیت اسمی و واقعی شیفت‌های تولید، حداقل تیراژ سفارش (MOQ) و بهای متریال کارخانه‌ای";

      phaseInstruction = `تمرکز بر اقتصاد واحد در صنف «${tradeTitleFa}»، ${capacityLabel}، گردش نقدینگی و اولویت‌های متناسب با مرحله ${mergedAxes.maturity}.`;
      break;
    }
    case 2: {
      phaseTitle = "تخصصی‌سازی فاز ۲ (هوش بازار و پژوهش مشتری)";
      if (isAutomotive) {
        phaseInstruction = "پژوهش بر رقبا و کارگاه‌های محلی در شعاع شهری، ترس مشتری از قطعات تقلبی و خط و خش و نظرات در نقشه‌ها متمرکز است.";
      } else if (isCafe) {
        phaseInstruction = "تحلیل رقبا در کافه‌های منطقه، ذائقه قهوه و بیزاری مشتری از طعم تلخ سوخته، محیط پرسروصدا و پرسنل متکبر.";
      } else if (isDining) {
        phaseInstruction = "تحلیل رستوران‌ها و غذاخوری‌های منطقه، دغدغه مشتریان از کیفیت و بهداشت مواد اولیه و طعم اصیل غذا.";
      } else if (isMachiningTooling) {
        phaseInstruction = "تحلیل قطعه‌سازان سنتی و واردات چینی، درد کارفرما از تلرانس نادرست و توقف خط مونتاژ و الزامات وندورلیست‌ها.";
      } else if (isTextile) {
        phaseInstruction = "تحلیل بازار پوشاک و کارخانجات نساجی، نگرانی خریداران از آبرفت، ثبات رنگ، کیفیت دوخت و تاخیر در تحویل قواره‌ها.";
      } else if (isTaxSaaS) {
        phaseInstruction = "تحلیل نرم‌افزارهای سنتی دسکتاپی، ترس شدید مدیران از جرایم سامانه مودیان و کشش بازار برای اشتراک ماهانه ابری.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "تحلیل نرم‌افزارهای رقیب، اصطکاک کاربران در استقرار ابزار، ریزش بعد از دوره آزمایشی و سهولت پشتیبانی آنلاین.";
      } else if (isSalon) {
        phaseInstruction = "تحلیل سالن‌های منطقه، ترس مراجعان از آسیب به مو و پوست با مواد نامرغوب، معطلی نوبت‌دهی و عدم شفافیت قیمت.";
      } else if (mergedAxes.geography === "CITY") {
        phaseInstruction = "پژوهش بر رقبا و جستجوی محلی شهر و شعاع دسترسی تمرکز دارد، نه محاسبات کلی ملی.";
      } else {
        phaseInstruction = "تحلیل رقبا و کشش تقاضا در سطح بازار ملی یا آنلاین رصد می‌شود.";
      }
      break;
    }
    case 3: {
      phaseTitle = "تخصصی‌سازی فاز ۳ (استراتژی و جهت‌گیری برند)";
      if (isAutomotive) {
        phaseInstruction = "بیانیه انحصار (Only-ness) بر شستشوی بدون آسیب یا تعویض روغن با فاکتور شفاف و شکستن پلمپ در حضور مشتری متمرکز است.";
      } else if (isCafe) {
        phaseInstruction = "بیانیه انحصار بر برشته‌کاری تازه با شناسنامه خاستگاه دانه، اتمسفر بدون دود و خلق تجربه طعمی منحصر‌به‌فرد استوار است.";
      } else if (isDining) {
        phaseInstruction = "بیانیه انحصار بر کیفیت بی‌قیدوشرط مواد اولیه تازه، طعم اصیل ماندگار و میزبانی محترمانه در سالن و سفارشات بیرون‌بر استوار است.";
      } else if (isMachiningTooling) {
        phaseInstruction = "جایگاه‌یابی بر تعهد تلرانس زیر ۳ میکرون، بیمه توقف خط تولید و شراکت راهبردی بدون خطای زنجیره تامین تمرکز دارد.";
      } else if (isTextile) {
        phaseInstruction = "جایگاه‌یابی بر تضمین دوام بافت و دوخت، تحویل بهنگام تیراژ فصلی بدون تاخیر و تطابق دقیق نمونه اولیه با طاقه تولیدی استوار است.";
      } else if (isTaxSaaS) {
        phaseInstruction = "جایگاه‌یابی بر شروع کار زیر ۵ دقیقه، گارانتی صفر درصد جریمه مالیاتی و رهایی از پیچیدگی سیستم‌های سنتی استوار است.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "جایگاه‌یابی بر تجربه کاربری روان، استقرار بدون وقفه در جریان کاری و پشتیبانی پاسخگو بدون نیاز به آموزش‌های پیچیده استوار است.";
      } else if (isSalon) {
        phaseInstruction = "جایگاه‌یابی بر زیبایی طبیعی و حفظ سلامت پوست و مو، متریال درجه یک تاییدشده و احترام به زمان و آرامش مراجع متمرکز است.";
      } else if (mergedAxes.customerModel === "B2B") {
        phaseInstruction = "جایگاه‌یابی باید منطق توجیه سود، کاهش ریسک و رضایت تصمیم‌گیرندگان فنی و مالی را پوشش دهد.";
      } else {
        phaseInstruction = "جایگاه‌یابی مستقیماً درد و دستاورد ملموس مصرف‌کننده نهایی را نشانه می‌گیرد.";
      }
      break;
    }
    case 4: {
      phaseTitle = "تخصصی‌سازی فاز ۴ (هویت و شخصیت برند - کهن‌الگو)";
      if (isAutomotive) {
        phaseInstruction = "کهن‌الگو: حامی/مراقب (Caregiver ۶۰٪) برای امانت‌داری و آرامش خاطر + قهرمان/تکنسین (Hero ۴۰٪) برای مهارت فنی. مرز حسی: تخصص ملموس و ادب بدون شوآف.";
      } else if (isCafe) {
        phaseInstruction = "کهن‌الگو: خالق/هنرمند (Creator ۶۰٪) برای هنر برشته‌کاری و طعم + حکیم/کاشف (Sage ۴۰٪) برای خاستگاه قهوه. مرز حسی: صمیمیت، اصالت و مهمان‌نوازی.";
      } else if (isDining) {
        phaseInstruction = "کهن‌الگو: میزبان اصیل و رفیق (Everyman ۵۵٪) برای مهمان‌نوازی گرم + آفرینش‌گر (Creator ۴۵٪) برای ذوق در طعم و پخت. مرز حسی: گرم، خودمانی و بدون تکلف.";
      } else if (isMachiningTooling) {
        phaseInstruction = "کهن‌الگو: حاکم مقتدر (Ruler ۵۰٪) برای انضباط مهندسی + قهرمان پایداری (Hero ۵۰٪) برای دقت میکرونی و دوام خط. مرز حسی: وقار صنعتی بدون ادعای شعاری.";
      } else if (isTextile) {
        phaseInstruction = "کهن‌الگو: آفرینش‌گر (Creator ۵۰٪) برای هنر الگو و زیبایی پارچه + قهرمان/تولیدکننده (Hero ۵۰٪) برای دوام کار در تیراژ انبوه. مرز حسی: انگیزه، کیفیت و ظرافت دوخت.";
      } else if (isTaxSaaS) {
        phaseInstruction = "کهن‌الگو: حکیم هوشمند (Sage ۵۵٪) برای تسلط مالیاتی + جادوگر سادگی (Magician ۴۵٪) برای سرعت و سهولت دیجیتال. مرز حسی: چابکی و آرامش‌بخشی مدرن.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "کهن‌الگو: جادوگر سادگی (Magician ۵۵٪) برای حذف کارهای تکراری + همیار امین (Caregiver/Sage ۴۵٪) برای همراهی در رشد کسب‌وکار کاربر.";
      } else if (isMedical) {
        phaseInstruction = "کهن‌الگو: حکیم (Sage ۵۵٪) برای تخصص و دانش پزشکی + مراقب دلسوز (Caregiver ۴۵٪) برای آرامش و امیدبخشیدن به بیمار. مرز حسی: علمی، مطمئن و فاقد ادعاهای اغراق‌آمیز.";
      } else if (isSalon) {
        phaseInstruction = "کهن‌الگو: آفرینش‌گر زیبایی (Creator ۵۵٪) برای ذوق و هنر استایل + حامی صمیمی (Caregiver ۴۵٪) برای مراقبت از سلامت و آرامش مراجع.";
      } else if (primaryArchetype === "MANUFACTURER") {
        phaseInstruction = "کهن‌الگو: حاکم مقتدر (Ruler ۵۰٪) برای انضباط مهندسی + قهرمان پایداری (Hero ۵۰٪) برای دقت و دوام خط. مرز حسی: وقار صنعتی بدون ادعای شعاری.";
      } else if (primaryArchetype === "SAAS_SOFTWARE") {
        phaseInstruction = "کهن‌الگو: حکیم هوشمند (Sage ۵۵٪) + جادوگر سادگی (Magician ۴۵٪) برای سرعت و سهولت دیجیتال. مرز حسی: چابکی و آرامش‌بخشی مدرن.";
      } else if (primaryArchetype === "CREATOR_MEDIA_EDUCATION" || mergedAxes.founderRole === "FOUNDER_LED" || inputOverlays.includes("FOUNDER_LED")) {
        phaseInstruction = "کهن‌الگو: حکیم (Sage ۶۰٪) برای مرجعیت علمی + مربی/حامی (Caregiver ۴۰٪) برای همراهی دلسوزانه. مرز حسی: پرهیز مطلق از زردی و تمرکز بر خروجی مستند.";
      } else {
        phaseInstruction = "کهن‌الگو: حکیم (Sage ۶۰٪) برای مرجعیت علمی + مربی/حامی (Caregiver ۴۰٪) برای همراهی دلسوزانه. مرز حسی: پرهیز مطلق از زردی و تمرکز بر خروجی مستند.";
      }
      break;
    }
    case 5: {
      phaseTitle = "تخصصی‌سازی فاز ۵ (سیستم هویت کلامی و پیام‌رسانی)";
      if (isAutomotive) {
        phaseInstruction = "لحن: شفاف، فنی و خودمانی با حذف اصطلاحات گنگ؛ قلاب ۳۰ ثانیه‌ای متمرکز بر سرعت و تضمین اصالت روغن/شستشو؛ خط قرمز: پرهیز از ادعاهای اغراق‌آمیز بازاری.";
      } else if (isCafe) {
        phaseInstruction = "لحن: حسی، صمیمی، آرامش‌بخش و توصیفی؛ قلاب ۳۰ ثانیه‌ای بر روایت فنجان و رفع خستگی روزمره؛ خط قرمز: واژگان کلیشه‌ای بازاریابی و تحقیر سلیقه مشتری.";
      } else if (isDining) {
        phaseInstruction = "لحن: اشتهاآور، صمیمی و محترمانه؛ قلاب ۳۰ ثانیه‌ای بر طعم لذیذ مواد اولیه تازه و دورهمی خاطره‌انگیز؛ خط قرمز: الفاظ مصنوعی و غلوآمیز تبلیغاتی.";
      } else if (isMachiningTooling) {
        phaseInstruction = "لحن: رسمی، مستند به داده، تلرانس‌های فنی و استانداردهای اندازه‌گیری؛ قلاب ۳۰ ثانیه‌ای بر پیشگیری از توقف خطوط تولید؛ خط قرمز: کلی‌گویی و ابهام در مشخصات فنی.";
      } else if (isTextile) {
        phaseInstruction = "لحن: پرانرژی، معتبر و متمرکز بر کیفیت جنس و دوام؛ قلاب ۳۰ ثانیه‌ای بر تحویل بهنگام تیراژ با تضمین یکنواختی کیفیت؛ خط قرمز: شعارهای مبهم و غیرفنی.";
      } else if (isTaxSaaS) {
        phaseInstruction = "لحن: مدرن، چابک، روشن و رهایی‌بخش از اضطراب ممیزی دارایی؛ قلاب ۳۰ ثانیه‌ای بر ارسال بدون دردسر فاکتور به مودیان؛ خط قرمز: پیچیده‌گویی بوروکراتیک و واژگان نامفهوم.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "لحن: سرراست، کاربرپسند و نوآور؛ قلاب ۳۰ ثانیه‌ای بر حل مستقیم گلوگاه کاری روزمره بدون آموزش اضافه؛ خط قرمز: اصطلاحات نامانوس فنی و وعده‌های غیرعملی.";
      } else if (isSalon) {
        phaseInstruction = "لحن: صمیمانه، ظریف و اطمینان‌بخش؛ قلاب ۳۰ ثانیه‌ای بر تجربه حس شادابی، مراقبت اصیل و ماندگاری نتیجه؛ خط قرمز: وعده‌های فریبنده و ادعاهای تخیلی.";
      } else if (mergedAxes.channelModel === "ONLINE_FIRST") {
        phaseInstruction = "فراخوان‌های عمل (CTA) به سمت خرید مستقیم، مشاوره سریع یا ثبت‌نام آنلاین هدایت می‌شوند.";
      } else {
        phaseInstruction = "فراخوان‌های عمل به سمت رزرو تلفنی، جلسه حضوری یا مراجعه به محل طراحی می‌شوند.";
      }
      break;
    }
    case 6: {
      phaseTitle = "تخصصی‌سازی فاز ۶ (نام‌گذاری، شعار و جهت‌گیری خلاقانه)";
      if (isAutomotive) {
        phaseInstruction = "قلمرو نام: واژگان خوش‌آهنگ، باوقار و کوتاه با تلفظ روان در تابلوی شهری و قابلیت استعلام علامت تجاری؛ شعار متمرکز بر اصالت قطعات و درخشش بدون آسیب.";
      } else if (isCafe) {
        phaseInstruction = "قلمرو نام: اسامی داستانی، حسی و اصیل با پیوند عمیق به مزرعه، رایحه و آرامش؛ شعار متمرکز بر روایت طعم و لحظه آرامش فنجان.";
      } else if (isDining) {
        phaseInstruction = "قلمرو نام: اسامی خوش‌نام، یادآور اصالت، طعم لذیذ و سفره ایرانی با تلفظ ماندگار؛ شعار متمرکز بر طعم ماندگار و کیفیت اصیل مواد غذایی.";
      } else if (isMachiningTooling) {
        phaseInstruction = "قلمرو نام: اسامی صنعتی استوار و پرطنین با ریشه پارسی یا مهندسی بین‌المللی و ثبت دامنه سازمانی؛ شعار متمرکز بر ستون استوار خطوط تولید و دقت میکرونی.";
      } else if (isTextile) {
        phaseInstruction = "قلمرو نام: اسامی پرطنين، پیوندخورده با تار و پود، ظرافت بافت و شیک‌پوشی؛ شعار متمرکز بر دوام بافت و زیبایی طراحی.";
      } else if (isTaxSaaS) {
        phaseInstruction = "قلمرو نام: نام ترکیبی یا ابداعی چابک با قابلیت برندینگ دیجیتال و ثبت دامنه .com و .ir؛ شعار متمرکز بر حسابداری هوشمند و مالیات بی‌دغدغه.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "قلمرو نام: نام مدرن، کوتاه و به یادماندنی در حوزه فناوری و وب؛ شعار متمرکز بر سادگی، سرعت و تحول در مدیریت روزمره.";
      } else if (isSalon) {
        phaseInstruction = "قلمرو نام: اسامی لطیف، درخشان و باوقار مرتبط با طراوت و هنر زیبایی؛ شعار متمرکز بر درخشش طبیعی و مراقبت اصیل.";
      } else {
        phaseInstruction = "قلمرو نام: نام متمایز با بار تخصصی و قابلیت ثبت قانونی؛ شعار حامل وعده اصلی تمایز ملموس.";
      }
      break;
    }
    case 7: {
      phaseTitle = "تخصصی‌سازی فاز ۷ (سیستم طراحی هویت بصری)";
      if (isAutomotive) {
        phaseInstruction = "پالت رنگی: کنتراست بالا برای تابلو و لباس کار (مشکی کربنی #09090b، آبی کبالت #2563eb، کهربایی اخطار #eab308)؛ فونت بولد هندسی؛ لیبل پلمپ و کارت گارانتی فیزیکی.";
      } else if (isCafe) {
        phaseInstruction = "پالت رنگی: تنالیته‌های گرم ارگانیک (قهوه‌ای رست عمیق #1c1917، کرم طبیعی #f5f5f4، تراکوتا #c2410c)؛ فونت انسانی باوقار؛ پاکت کرافت دانه با تاریخ رست و فنجان دوستدار محیط زیست.";
      } else if (isDining) {
        phaseInstruction = "پالت رنگی: تنالیته‌های گرم اشتهاآور و اصیل (زرشکی درباری، آجری، کرم خاکی، سبز زیتونی)؛ تایپوگرافی خوانا و صمیمی؛ طراحی حرفه‌ای منو و بسته‌بندی بهداشتی بیرون‌بر.";
      } else if (isMachiningTooling) {
        phaseInstruction = "پالت رنگی: فام‌های صنعتی سنگین (خاکستری فولادی #334155، نارنجی ایمنی #ea580c، سورمه‌ای متالیک #0f172a)؛ تایپوگرافی مونو صلب؛ پلاک متالیزه لیزری و کاتالوگ مهندسی قطعات.";
      } else if (isTextile) {
        phaseInstruction = "پالت رنگی: فام‌های متناسب با مد و پارچه (سرمه‌ای تیره، کرم نخودی، زرشکی عمیق، خاکی بافت‌دار)؛ برچسب و اتیکت باکیفیت پارچه‌ای و بسته‌بندی طاقه‌ها.";
      } else if (isTaxSaaS) {
        phaseInstruction = "پالت رنگی: تم مدرن تکنولوژی و اعتماد (آبی کبالت #2563eb، اسلیت تیره #0f172a، سبز ملایم تایید مالی #10b981)؛ تایپ‌فیس وزیرمتن/یکان‌بخ با وضوح بالا در داشبورد نرم‌افزار.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "پالت رنگی: تم مدرن تکنولوژی، پویایی و نوآوری دیجیتال (آبی لاجوردی، ارغوانی ملایم یا فیروزه‌ای تیره)؛ فونت استاندارد وب در صفحات داشبورد و اپلیکیشن.";
      } else if (isMedical) {
        phaseInstruction = "پالت رنگی: سفید خالص، آبی آرامش‌بخش، فیروزه‌ای پاکیزه و خاکستری روشن؛ نشانگر استریل و بهداشت محیط بالینی.";
      } else if (isSalon) {
        phaseInstruction = "پالت رنگی: رنگ‌های آرامش‌بخش، شیک و لوکس (رزگلد، بژ مخملی، طلایی مات، سبز درباری ملایم)؛ تابلو و کارت‌های ویزیت با لمس مخملی.";
      } else {
        phaseInstruction = "پالت رنگی: ترکیب رنگ اعتمادساز با کنتراست استاندارد متناسب با روان‌شناسی رنگ؛ تایپوگرافی تمیز و مدرن برای ارائه‌ها و اسناد راهبردی.";
      }
      break;
    }
    case 8: {
      phaseTitle = "تخصصی‌سازی فاز ۸ (فعال‌سازی اجرایی، PR و مدیریت اعتبار)";
      if (isAutomotive) {
        phaseInstruction = "موتور فعال‌سازی: سئوی محلی (گوگل مپ، نشان، بلد)، سامانه پیامکی یادآوری سرویس بر اساس کیلومتر، کمپین‌های فصلی و پاسخگویی مستند به نظرات در نقشه.";
      } else if (isCafe) {
        phaseInstruction = "موتور فعال‌سازی: رویدادهای هفتگی کاپینگ، کلوب اشتراک ماهانه دانه قهوه، روابط عمومی با فعالان صنعت غذا و پایش دقیق رضایت مراجعان در سالن.";
      } else if (isDining) {
        phaseInstruction = "موتور فعال‌سازی: ثبت دقیق در نقشه‌های نشان و بلد، باشگاه مشتریان پیامکی برای مناسبت‌ها و تولدها، همکاری با نقدکنندگان غذای اصیل و پایش رضایت سالن.";
      } else if (isMachiningTooling) {
        phaseInstruction = "موتور فعال‌سازی: ورود به وندورلیست صنایع مادر، تور بازدید مدیران فنی از کارخانه، مقالات سفید مهندسی در لینکدین و پروتکل ۲۴ ساعته حل بحران کیفی خط کارفرما.";
      } else if (isTextile) {
        phaseInstruction = "موتور فعال‌سازی: حضور فعال در نمایشگاه‌های بین‌المللی نساجی و مد، جلسات حضوری با بنکداران و برندهای پوشاک، وندورلیست و کاتالوگ‌های نمونه پارچه.";
      } else if (isTaxSaaS) {
        phaseInstruction = "موتور فعال‌سازی: سئوی ارگانیک بخشنامه‌های مالیاتی، وبینارهای دموی سامانه مودیان، سیستم رشد محصول‌محور (PLG) و داشبورد شفافیت آپ‌تایم سرور.";
      } else if (isNonTaxSaaS) {
        phaseInstruction = "موتور فعال‌سازی: سئوی مقالات حل مسئله کاری، نسخه آزمایشی رایگان (Freemium/Trial)، بازاریابی ارجاعی و ویدیوهای کوتاه معرفی قابلیت‌های کلیدی.";
      } else if (isSalon) {
        phaseInstruction = "موتور فعال‌سازی: مدیریت نظرات در نشان و بلد، باشگاه وفاداری مراجعان برای رزرو مجدد، نمونه‌کارهای قبل و بعد در شبکه‌های اجتماعی و رویدادهای فصلی مراقبت پوست.";
      } else if (mergedAxes.founderRole === "FOUNDER_LED" || inputOverlays.includes("FOUNDER_LED")) {
        phaseInstruction = "رهبری فکری و حضور شخصی بنیان‌گذار در پادکست‌ها، یادداشت‌های تخصصی لینکدین و شبکه نخبگان موتور اصلی توسعه برند است.";
      } else {
        phaseInstruction = "سئوی محلی، رضایت مراجعان و کانال‌های فروش صنعتی یا منطقه‌ای در اولویت قرار دارند.";
      }
      break;
    }
  }

  const activeOverlays = Array.from(new Set([
    primaryArchetype,
    mergedAxes.customerModel,
    mergedAxes.channelModel,
    mergedAxes.maturity,
    mergedAxes.geography,
    ...(matchedBt?.activeOverlays || []),
    ...(matchedIndustry?.activeOverlays || []),
    ...inputOverlays
  ]));

  const kpis = Array.from(new Set([
    ...(archetypeDef.metrics || []),
    ...(matchedIndustry?.defaultAxes?.kpis || [])
  ]));

  const risks = Array.from(new Set([
    ...(archetypeDef.risks || []),
    ...(matchedIndustry?.defaultAxes?.risks || [])
  ]));

  const jargonReplacements = {
    "CAC": "هزینه جذب هر مشتری جدید",
    "LTV": "ارزش کل خرید مشتری در طول زمان",
    "Churn": "نرخ ریزش یا عدم بازگشت مشتری",
    "MRR": "درآمد پایدار ماهانه",
    "ROI": "بازگشت سرمایه",
    "SLA": "تعهد سطح کیفیت خدمات",
    "Funnel": "مسیر تبدیل مخاطب به خریدار"
  };

  const tailoredQuestions = [];

  const hierarchyResolutionTrace = {
    tier1_exactBtMatched: specializationLevel === "EXACT_BT",
    tier2_industryCode: industryCode,
    tier3_archetypeId: primaryArchetype,
    tier4_customerModel: mergedAxes.customerModel,
    tier4_channelModel: mergedAxes.channelModel,
    tier5_businessStage: mergedAxes.maturity,
    tier6_priorAnswersConsidered: Object.keys(options.priorAnswers || {}).length,
    tier7_factsAnchored: (options.knownFacts || []).length,
    tier8_questionsGenerated: tailoredQuestions.length
  };

  return {
    taxonomyId,
    tradeTitleFa,
    tradeTitleEn,
    iranianGuildCode,
    industryId,
    industryCode,
    industryTitleFa,
    primaryArchetype,
    archetype: primaryArchetype,
    archetypeTitle,
    specializationLevel,
    axes: mergedAxes,
    terminologyAllowlist,
    forbiddenTerms,
    jargonReplacements,
    phaseNumber: p,
    phaseTitle,
    phaseInstruction,
    tailoredQuestions,
    kpis,
    risks,
    activeOverlays,
    hierarchyResolutionTrace
  };
}

export function getPhaseAdaptationRules(phaseNum, context) {
  if (!context) return null;
  const p = parseInt(phaseNum, 10);
  const spec = resolveDomainSpecialization(context, context.axes, p);
  return {
    title: spec.phaseTitle,
    instruction: spec.phaseInstruction,
    specializationLevel: spec.specializationLevel,
    kpis: spec.kpis,
    risks: spec.risks
  };
}


export function generateContextProfileMarkdown(context) {
  if (!context) return "";

  const axes = context.axes || {
    customerModel: context.customerModel,
    offerType: context.offerType || "SERVICE",
    channelModel: context.channelModel,
    revenueModel: context.revenueModel || "TRANSACTION",
    maturity: context.maturity,
    scale: context.scale || "SMALL",
    salesMotion: context.salesMotion || "RETAIL",
    geography: context.geographicScope || "NATIONAL",
    branchStructure: context.branchStructure || "SINGLE_LOCATION",
    founderRole: context.founderRole || "SUPPORTING",
    purchaseCycle: context.purchaseCycle || "SHORT_DAYS",
    relationshipModel: context.relationshipModel || "REPEAT_HABITUAL",
    regulatoryProfile: context.regulatoryProfile || "NORMAL",
    operationalComplexity: context.operationalComplexity || "MODERATE",
    brandArchitecture: context.brandArchitecture || "STANDALONE"
  };

  return `# شناسنامه جامع بافتار و مدل کسب‌وکار (Universal Business Context & 15-Axis Profile)

**عنوان رسته طبقه‌بندی ۷۵۳ گانه:** ${context.taxonomyTitleFa || context.archetypeTitle} (\`${context.taxonomyId || "BT-0753"}\`)  
**عنوان انگلیسی رسته:** ${context.taxonomyTitleEn || "Universal Business Model"}  
**کد صنف / ISIC ایران:** \`${context.iranianGuildCode || "999999"}\`  
**صنعت کلان (Macro Industry):** ${context.industryId || "IND-31"} — ${context.industryCode || "EMERGING_HYBRID_FRONTIER_MODELS"}  
**کهن‌الگوی پایه (Archetype):** ${context.archetypeTitle} (${context.archetype})  
**مدل مشتری (Customer Model):** ${axes.customerModel}  
**مدل کانال توزیع (Channel Model):** ${axes.channelModel}  
**مرحله بلوغ (Maturity Stage):** ${axes.maturity}  
**محدوده جغرافیایی (Geographic Scope):** ${context.geographicScope}  
**اورلی‌های فعال (Active Overlays):** ${context.activeOverlays.join(" • ")}  

---

## ۱. محورهای ۱۵ گانه بافتار کسب‌وکار (15 Orthogonal Context Axes)
- 🔹 **نوع خدمت یا محصول (Offer Type):** \`${axes.offerType}\`
- 🔹 **مدل درآمدی (Revenue Model):** \`${axes.revenueModel}\`
- 🔹 **مقیاس کسب‌وکار (Scale):** \`${axes.scale}\`
- 🔹 **حرکت فروش (Sales Motion):** \`${axes.salesMotion}\`
- 🔹 **ساختار شعب (Branch Structure):** \`${axes.branchStructure}\`
- 🔹 **نقش بنیان‌گذار (Founder Role):** \`${axes.founderRole}\`
- 🔹 **چرخه خرید و تصمیم‌گیری (Purchase Cycle):** \`${axes.purchaseCycle}\`
- 🔹 **مدل ارتباط و وفاداری (Relationship Model):** \`${axes.relationshipModel}\`
- 🔹 **پروفایل مقررات و رگولاتوری (Regulatory Profile):** \`${axes.regulatoryProfile}\`
- 🔹 **پیچیدگی عملیاتی (Operational Complexity):** \`${axes.operationalComplexity}\`
- 🔹 **معماری برند (Brand Architecture):** \`${axes.brandArchitecture}\`

---

## ۲. حوزه‌های اختصاصی بررسی (Specialized Focus Areas)
${(context.focusAreas || []).map(f => `- 🎯 **${f}**`).join("\n")}

## ۳. شاخص‌های کلیدی کاندید (Candidate Metrics)
${(context.candidateMetrics || []).map(m => `- 📊 \`${m}\``).join("\n")}

## ۴. ریسک‌های ساختاری نیازمند پایش (Seeded Operational Risks)
${(context.seededRisks || []).map(r => `- ⚠️ ${r}`).join("\n")}

---

### پیکربندی ساخت‌یافته سیستمی (Machine-Readable Routing State)
\`\`\`yaml
business_context:
  version: 2.0.0
  taxonomy_id: ${context.taxonomyId || "BT-0753"}
  industry_id: ${context.industryId || "IND-31"}
  iranian_guild_code: "${context.iranianGuildCode || "999999"}"
  archetype: ${context.archetype}
  customer_model: ${axes.customerModel}
  channel_model: ${axes.channelModel}
  maturity: ${axes.maturity}
  geographic_scope: ${context.geographicScope}
  axes:
    offer_type: ${axes.offerType}
    revenue_model: ${axes.revenueModel}
    scale: ${axes.scale}
    sales_motion: ${axes.salesMotion}
    geography: ${axes.geography}
    branch_structure: ${axes.branchStructure}
    founder_role: ${axes.founderRole}
    purchase_cycle: ${axes.purchaseCycle}
    relationship_model: ${axes.relationshipModel}
    regulatory_profile: ${axes.regulatoryProfile}
    operational_complexity: ${axes.operationalComplexity}
    brand_architecture: ${axes.brandArchitecture}
  active_overlays: [${context.activeOverlays.join(", ")}]
  confidence: ${context.confidence}
\`\`\`
`;
}
