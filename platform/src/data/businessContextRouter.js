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

export function getPhaseAdaptationRules(phaseNum, context) {
  if (!context) return null;
  const p = parseInt(phaseNum, 10);
  const arch = context.archetype || "PROFESSIONAL_SERVICE";

  const rules = {
    1: {
      title: "تخصصی‌سازی فاز ۱ (کشف و بنیاد کسب‌وکار)",
      instruction: arch === "LOCAL_SERVICE"
        ? `تمرکز بر اقتصاد واحد هر خودرو/مراجعه، ظرفیت فیزیکی روزانه، گردش نقدینگی و پرهیز از هزینه‌های غیرضروری دفتری.`
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? `تمرکز بر محاسبه دقیق قیمت تمام‌شده غذا/نوشیدنی (Food Cost %)، گردش میز، میانگین فاکتور و حفظ جریان مواد اولیه تازه.`
        : arch === "MANUFACTURER"
        ? `تمرکز بر ظرفیت تولید اسمی در برابر واقعی، حداقل تیراژ سفارش (MOQ)، فرمول بهای متریال و الزامات سرمایه‌ای خطوط صنعتی.`
        : arch === "SAAS_SOFTWARE"
        ? `تمرکز بر سنجه‌های درآمد ماهانه پایدار (MRR)، دوره بازگشت هزینه جذب (CAC Payback) و زمان رسیدن به ارزش (Time-to-Value).`
        : `پرسش‌ها بر اساس ماهیت «${context.archetypeTitle}» و تمرکز روی ${context.focusAreas?.slice(0, 2).join(" و ") || "اهداف و تمایز"} بازآرایی می‌شوند.`
    },
    2: {
      title: "تخصصی‌سازی فاز ۲ (هوش بازار و پژوهش مشتری)",
      instruction: arch === "LOCAL_SERVICE"
        ? "پژوهش بر رقبا و کارگاه‌های محلی در شعاع شهری، ترس مشتری از قطعات تقلبی و خط و خش و نظرات در نقشه‌ها متمرکز است."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "تحلیل رقبا در کافه‌های منطقه، ذائقه قهوه و بیزاری مشتری از طعم تلخ سوخته، محیط پرسروصدا و پرسنل متکبر."
        : arch === "MANUFACTURER"
        ? "تحلیل قطعه‌سازان سنتی و واردات چینی، درد کارفرما از تلرانس نادرست و توقف خط مونتاژ و الزامات وندورلیست‌ها."
        : arch === "SAAS_SOFTWARE"
        ? "تحلیل نرم‌افزارهای سنتی دسکتاپی، ترس شدید مدیران از جرایم سامانه مودیان و کشش بازار برای اشتراک ماهانه ابری."
        : context.geographicScope === "CITY"
        ? "پژوهش بر رقبا و جستجوی محلی شهر و شعاع دسترسی تمرکز دارد، نه محاسبات کلی ملی."
        : "تحلیل رقبا و کشش تقاضا در سطح بازار ملی یا آنلاین رصد می‌شود."
    },
    3: {
      title: "تخصصی‌سازی فاز ۳ (استراتژی و جهت‌گیری برند)",
      instruction: arch === "LOCAL_SERVICE"
        ? "بیانیه انحصار (Only-ness) بر شستشوی بدون آسیب یا تعویض روغن با فاکتور شفاف و شکستن پلمپ در حضور مشتری متمرکز است."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "بیانیه انحصار بر برشته‌کاری تازه با شناسنامه خاستگاه دانه، اتمسفر بدون دود و خلق تجربه طعمی منحصر‌به‌فرد استوار است."
        : arch === "MANUFACTURER"
        ? "جایگاه‌یابی بر تعهد تلرانس زیر ۳ میکرون، بیمه توقف خط تولید و شراکت راهبردی بدون خطای زنجیره تامین تمرکز دارد."
        : arch === "SAAS_SOFTWARE"
        ? "جایگاه‌یابی بر شروع کار زیر ۵ دقیقه، گارانتی صفر درصد جریمه مالیاتی و رهایی از پیچیدگی سیستم‌های سنتی استوار است."
        : context.customerModel === "B2B"
        ? "جایگاه‌یابی باید منطق توجیه سود، کاهش ریسک و رضایت تصمیم‌گیرندگان فنی و مالی را پوشش دهد."
        : "جایگاه‌یابی مستقیماً درد و دستاورد ملموس مصرف‌کننده نهایی را نشانه می‌گیرد."
    },
    4: {
      title: "تخصصی‌سازی فاز ۴ (هویت و شخصیت برند - کهن‌الگو)",
      instruction: arch === "LOCAL_SERVICE"
        ? "کهن‌الگو: حامی/مراقب (Caregiver ۶۰٪) برای امانت‌داری و آرامش خاطر + قهرمان/تکنسین (Hero ۴۰٪) برای مهارت فنی. مرز حسی: تخصص ملموس و ادب بدون شوآف."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "کهن‌الگو: خالق/هنرمند (Creator ۶۰٪) برای هنر برشته‌کاری و طعم + حکیم/کاشف (Sage ۴۰٪) برای خاستگاه قهوه. مرز حسی: صمیمیت، اصالت و مهمان‌نوازی."
        : arch === "MANUFACTURER"
        ? "کهن‌الگو: حاکم مقتدر (Ruler ۵۰٪) برای انضباط مهندسی + قهرمان پایداری (Hero ۵۰٪) برای دقت میکرونی و دوام خط. مرز حسی: وقار صنعتی بدون ادعای شعاری."
        : arch === "SAAS_SOFTWARE"
        ? "کهن‌الگو: حکیم هوشمند (Sage ۵۵٪) برای تسلط مالیاتی + جادوگر سادگی (Magician ۴۵٪) برای سرعت و سهولت دیجیتال. مرز حسی: چابکی و آرامش‌بخشی مدرن."
        : "کهن‌الگو: حکیم (Sage ۶۰٪) برای مرجعیت علمی + مربی/حامی (Caregiver ۴۰٪) برای همراهی دلسوزانه. مرز حسی: پرهیز مطلق از زردی و تمرکز بر خروجی مستند."
    },
    5: {
      title: "تخصصی‌سازی فاز ۵ (سیستم هویت کلامی و پیام‌رسانی)",
      instruction: arch === "LOCAL_SERVICE"
        ? "لحن: شفاف، فنی و خودمانی با حذف اصطلاحات گنگ؛ قلاب ۳۰ ثانیه‌ای متمرکز بر سرعت و تضمین اصالت روغن/شستشو؛ خط قرمز: پرهیز از ادعاهای اغراق‌آمیز بازاری."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "لحن: حسی، صمیمی، آرامش‌بخش و توصیفی؛ قلاب ۳۰ ثانیه‌ای بر روایت فنجان و رفع خستگی روزمره؛ خط قرمز: واژگان کلیشه‌ای بازاریابی و تحقیر سلیقه مشتری."
        : arch === "MANUFACTURER"
        ? "لحن: رسمی، مستند به داده، تلرانس‌های فنی و استانداردهای اندازه‌گیری؛ قلاب ۳۰ ثانیه‌ای بر پیشگیری از توقف خطوط تولید؛ خط قرمز: کلی‌گویی و ابهام در مشخصات فنی."
        : arch === "SAAS_SOFTWARE"
        ? "لحن: مدرن، چابک، روشن و رهایی‌بخش از اضطراب ممیزی دارایی؛ قلاب ۳۰ ثانیه‌ای بر ارسال بدون دردسر فاکتور به مودیان؛ خط قرمز: پیچیده‌گویی بوروکراتیک و واژگان نامفهوم."
        : context.channelModel === "ONLINE_FIRST"
        ? "فراخوان‌های عمل (CTA) به سمت خرید مستقیم، مشاوره سریع یا ثبت‌نام آنلاین هدایت می‌شوند."
        : "فراخوان‌های عمل به سمت رزرو تلفنی، جلسه حضوری یا مراجعه به محل طراحی می‌شوند."
    },
    6: {
      title: "تخصصی‌سازی فاز ۶ (نام‌گذاری، شعار و جهت‌گیری خلاقانه)",
      instruction: arch === "LOCAL_SERVICE"
        ? "قلمرو نام: واژگان خوش‌آهنگ، باوقار و کوتاه با تلفظ روان در تابلوی شهری و قابلیت استعلام علامت تجاری؛ شعار متمرکز بر اصالت قطعات و درخشش بدون آسیب."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "قلمرو نام: اسامی داستانی، حسی و اصیل با پیوند عمیق به مزرعه، رایحه و آرامش؛ شعار متمرکز بر روایت طعم و لحظه آرامش فنجان."
        : arch === "MANUFACTURER"
        ? "قلمرو نام: اسامی صنعتی استوار و پرطنین با ریشه پارسی یا مهندسی بین‌المللی و ثبت دامنه سازمانی؛ شعار متمرکز بر ستون استوار خطوط تولید و دقت میکرونی."
        : arch === "SAAS_SOFTWARE"
        ? "قلمرو نام: نام ترکیبی یا ابداعی چابک با قابلیت برندینگ دیجیتال و ثبت دامنه .com و .ir؛ شعار متمرکز بر حسابداری هوشمند و مالیات بی‌دغدغه."
        : "قلمرو نام: نام متمایز با بار تخصصی و قابلیت ثبت قانونی؛ شعار حامل وعده اصلی تمایز ملموس."
    },
    7: {
      title: "تخصصی‌سازی فاز ۷ (سیستم طراحی هویت بصری)",
      instruction: arch === "LOCAL_SERVICE"
        ? "پالت رنگی: کنتراست بالا برای تابلو و لباس کار (مشکی کربنی #09090b، آبی کبالت #2563eb، کهربایی اخطار #eab308)؛ فونت بولد هندسی؛ لیبل پلمپ و کارت گارانتی فیزیکی."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "پالت رنگی: تنالیته‌های گرم ارگانیک (قهوه‌ای رست عمیق #1c1917، کرم طبیعی #f5f5f4، تراکوتا #c2410c)؛ فونت انسانی باوقار؛ پاکت کرافت دانه با تاریخ رست و فنجان دوستدار محیط زیست."
        : arch === "MANUFACTURER"
        ? "پالت رنگی: فام‌های صنعتی سنگین (خاکستری فولادی #334155، نارنجی ایمنی #ea580c، سورمه‌ای متالیک #0f172a)؛ تایپوگرافی مونو صلب؛ پلاک متالیزه لیزری و کاتالوگ مهندسی قطعات."
        : arch === "SAAS_SOFTWARE"
        ? "پالت رنگی: تم مدرن تکنولوژی و اعتماد (آبی کبالت #2563eb، اسلیت تیره #0f172a، سبز ملایم تایید مالی #10b981)؛ تایپ‌فیس وزیرمتن/یکان‌بخ با وضوح بالا در داشبورد نرم‌افزار."
        : "پالت رنگی: ترکیب رنگ اعتمادساز با کنتراست استاندارد متناسب با روان‌شناسی رنگ؛ تایپوگرافی تمیز و مدرن برای ارائه‌ها و اسناد راهبردی."
    },
    8: {
      title: "تخصصی‌سازی فاز ۸ (فعال‌سازی اجرایی، PR و مدیریت اعتبار)",
      instruction: arch === "LOCAL_SERVICE"
        ? "موتور فعال‌سازی: سئوی محلی (گوگل مپ، نشان، بلد)، سامانه پیامکی یادآوری سرویس بر اساس کیلومتر، کمپین‌های فصلی و پاسخگویی مستند به نظرات در نقشه."
        : arch === "RESTAURANT_CAFE_HOSPITALITY"
        ? "موتور فعال‌سازی: رویدادهای هفتگی کاپینگ، کلوب اشتراک ماهانه دانه قهوه، روابط عمومی با فعالان صنعت غذا و پایش دقیق رضایت مراجعان در سالن."
        : arch === "MANUFACTURER"
        ? "موتور فعال‌سازی: ورود به وندورلیست صنایع مادر، تور بازدید مدیران فنی از کارخانه، مقالات سفید مهندسی در لینکدین و پروتکل ۲۴ ساعته حل بحران کیفی خط کارفرما."
        : arch === "SAAS_SOFTWARE"
        ? "موتور فعال‌سازی: سئوی ارگانیک بخشنامه‌های مالیاتی، وبینارهای دموی سامانه مودیان، سیستم رشد محصول‌محور (PLG) و داشبورد شفافیت آپ‌تایم سرور."
        : context.activeOverlays.includes("FOUNDER_LED")
        ? "رهبری فکری و حضور شخصی بنیان‌گذار در پادکست‌ها، یادداشت‌های تخصصی لینکدین و شبکه نخبگان موتور اصلی توسعه برند است."
        : "سئوی محلی، رضایت مراجعان و کانال‌های فروش صنعتی یا منطقه‌ای در اولویت قرار دارند."
    }
  };

  return rules[p] || null;
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
