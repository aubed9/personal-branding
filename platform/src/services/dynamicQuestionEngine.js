// DIGITAL MARKET — Dynamic Chained Question Engine
// Implements mathematical question composition:
// ActiveQuestions = Base + Industry Module + Customer Model Overlay + Channel Overlay + Revenue Overlay + Maturity Overlay + Founder Role Overlay - Irrelevant - Answered
// Grounded in the 165-Source Knowledge Base & Iranian Market Canonical Works

import { INITIAL_QUESTIONS } from "../data/phase1Templates.js";
import { getAdaptivePhase2Questions, PHASE2_QUESTIONS } from "../data/phase2Templates.js";
import { getAdaptedPhaseQuestions } from "../data/allPhasesTemplates.js";
import { BUSINESS_TYPES_MAP, resolveBusinessType } from "../data/businessTaxonomy753.js";

export const DYNAMIC_QUESTION_FORMULA = 
  "ActiveQuestions = Base + Industry Module + Customer Model Overlay + Channel Overlay + Revenue Overlay + Maturity Overlay + Founder Role Overlay - Irrelevant - Answered";

// Canonical references registry for question guidance (165-source knowledge base)
export const QUESTION_KNOWLEDGE_BASE = {
  // Phase 1
  step0_stage: {
    nodeId: "KB-BIZ-STAGE-001",
    canonicalSource: "Steve Blank (Four Steps to the Epiphany) & Alexander Osterwalder (Business Model Generation)",
    framework: "مدل مراحل بلوغ کسب‌وکار و درجه قطعیت اعتبارسنجی فرضیات",
    decisionChainLink: "حلقه ۱: تحلیل موقعیت بنیادین و بلوغ",
    insight: "تشخیص دقیق مرحله بلوغ، مانع از سوختن زودهنگام سرمایه در کمپین‌های بازاریابی قبل از اثبات تقاضا می‌شود."
  },
  step0_diagnostic_probing: {
    nodeId: "KB-SYS-ARCH-001",
    canonicalSource: "Peter Drucker (Management Challenges) & Simon Sinek (Start With Why)",
    framework: "آزمون تشخیصی دیدگاه بنیان‌گذار و فلسفه خلق ارزش پایدار",
    decisionChainLink: "حلقه ۰: چشمانداز و هویت ذهنی کارآفرین",
    insight: "درک مستقیم نگاه بنیان‌گذار به تمایز و ارزش، پایه ساخت تمامی استراتژی‌ها، کهن‌الگوها و پیام‌های بعدی است."
  },
  step0_description: {
    nodeId: "KB-BIZ-MODEL-001",
    canonicalSource: "قانون نظام صنفی کشور و طبقه‌بندی جامع ۷۵۳ صنف ایران (ISIC)",
    framework: "تطبیق رسته شغلی با ۱۵ محور بافتار کسب‌وکار و کدهای استاندارد اصناف",
    decisionChainLink: "حلقه ۲: تحلیل صنف و مدل عملیاتی",
    insight: "صنف مشخص می‌کند که ساختار هزینه‌ها، زنجیره تامین و الگوهای اعتماد بازار چگونه باید هدایت شود."
  },
  step0_geography: {
    nodeId: "KB-BIZ-SALES-001",
    canonicalSource: "Byron Sharp (How Brands Grow: Physical & Mental Availability)",
    framework: "دسترس‌پذیری فیزیکی و محدوده جغرافیایی دسترسی به مشتری",
    decisionChainLink: "حلقه ۳: قلمرو توزیع و دسترس‌پذیری فیزیکی",
    insight: "کسب‌وکارهای محلی بر شعاع ۳ تا ۵ کیلومتری متمرکزند؛ خدمات ملی نیازمند اعتمادسازی دیجیتال و توزیع هستند."
  },
  step1_primary_goal: {
    nodeId: "KB-BIZ-ECON-001",
    canonicalSource: "Eliyahu M. Goldratt (The Goal: Theory of Constraints)",
    framework: "تئوری محدودیت‌ها و تمرکز روی یک گلوگاه سودآور در افق ۳ تا ۶ ماهه",
    decisionChainLink: "حلقه ۴: اهداف ملموس عملیاتی و اقتصاد واحد",
    insight: "تعیین یک هدف شفاف و سنجش‌پذیر، مانع از هدررفت منابع در فعالیت‌های پراکنده و بی‌نتیجه می‌شود."
  },
  step2_core_offer: {
    nodeId: "KB-BIZ-REV-001",
    canonicalSource: "Clayton Christensen (Competing Against Luck: Jobs to be Done)",
    framework: "طراحی پیشنهاد محوری بر اساس کارِ مشتری (Jobs-to-be-Done)",
    decisionChainLink: "حلقه ۵: ساختار خدمت و ارزش پیشنهادی",
    insight: "مشتری محصول یا خدمت نمی‌خرد؛ پیشرفتی در زندگی یا کار خود را با پیشنهاد شما به دست می‌آورد."
  },
  step2_value_hypothesis: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "Marty Neumeier (Zag: The #1 Strategy of High-Performance Brands)",
    framework: "فرضیه تمایز رادیکال و دلیل انتخاب در بازار شلوغ",
    decisionChainLink: "حلقه ۶: فرضیه تمایز و انحصار",
    insight: "اگر دلیلی ملموس و قطعی برای انتخاب شدن توسط مشتری ندارید، رقابت بر سر تخفیف کسب‌وکار را ضعیف می‌کند."
  },

  // Phase 2
  p2_step0_competitors: {
    nodeId: "KB-MKT-COMP-001",
    canonicalSource: "Michael Porter (Five Competitive Forces That Shape Strategy)",
    framework: "تحلیل رقبای مستقیم، غیرمستقیم و گزینه‌های جایگزین در شعاع بازار",
    decisionChainLink: "حلقه ۲: تحلیل ساختار صنعت و رقابت",
    insight: "شناخت دقیق رقبا کمک می‌کند نقاط کور آنها را کشف کرده و وارد جنگ فرسایشی نشوید."
  },
  p2_step1_customer_pain: {
    nodeId: "KB-MKT-JTBD-001",
    canonicalSource: "Clayton Christensen & Tony Ulwick (Outcome-Driven Innovation)",
    framework: "شناسایی دردها، اصطکاک‌ها و اضطراب‌های برطرف‌نشده مشتری در بازار",
    decisionChainLink: "حلقه ۳: نیازهای پنهان و موانع خرید",
    insight: "بزرگ‌ترین فرصت رشد برند دقیقاً در همان نقطه‌ای است که رقبا مشتری را معطل، نگران یا کلافه می‌کنند."
  },
  p2_step2_pricing_models: {
    nodeId: "KB-BIZ-REV-001",
    canonicalSource: "Hermann Simon (Confessions of the Pricing Man: Value-Based Pricing)",
    framework: "کشش قیمتی، لنگراندازی ذهنی و مدل‌های درآمدی پایدار",
    decisionChainLink: "حلقه ۴: استراتژی قیمت‌گذاری و درآمد",
    insight: "قیمت‌گذاری باید بر مبنای ارزش خلق‌شده برای مشتری باشد، نه صرفاً جمع هزینه‌ها به اضافه سود."
  },
  p2_step3_primary_channel: {
    nodeId: "KB-BIZ-SALES-001",
    canonicalSource: "Gabriel Weinberg & Justin Mares (Traction: A Startup Guide)",
    framework: "ماتریس کانال‌های دسترسی با بالاترین نرخ تبدیل در بازار ایران",
    decisionChainLink: "حلقه ۷: کانال‌های نفوذ و توزیع",
    insight: "تسلط عمیق بر ۱ یا ۲ کانال اصلی، به مراتب موثرتر از حضور سطحی در تمامی کانال‌هاست."
  },
  p2_step4_golden_opportunity: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "W. Chan Kim & Renée Mauborgne (Blue Ocean Strategy)",
    framework: "خلق اقیانوس آبی و کشف شکاف خدماتی رقبای سنتی",
    decisionChainLink: "حلقه ۵: فرصت طلایی تمایز و خلاء بازار",
    insight: "تمرکز بر یک مزیت انحصاری حل‌کننده درد مشتری، شما را از مقایسه مستقیم قیمتی بی‌نیاز می‌کند."
  },

  // Phase 3
  p3_target_segment: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "Geoffrey Moore (Crossing the Chasm: Beachhead Segment)",
    framework: "سگمنت‌بندی متمرکز و تصاحب سرپل اول بازار",
    decisionChainLink: "حلقه ۴: انتخاب مخاطب آرمانی",
    insight: "تلاش برای راضی نگه داشتن همه، سریع‌ترین مسیر برای بی‌اثر شدن برند است."
  },
  p3_positioning_frame: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "Al Ries & Jack Trout (Positioning: The Battle for Your Mind)",
    framework: "چارچوب جایگاه‌یابی در ذهن مخاطب و تمایز قطعی",
    decisionChainLink: "حلقه ۵: جایگاه‌یابی استراتژیک",
    insight: "جایگاه‌یابی یعنی اشغال یک کلمه یا مفهوم روشن در ذهن مشتری که هیچ رقیبی مالک آن نیست."
  },
  p3_strategic_boundary: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "Richard Rumelt (Good Strategy / Bad Strategy)",
    framework: "مرزهای استراتژیک و قدرت «نه» گفتن به کارهای خارج از تمرکز",
    decisionChainLink: "حلقه ۶: مرزها و گاردریل‌های استراتژیک",
    insight: "استراتژی خوب با کارهایی که تصمیم می‌گیرید انجام ندهید تعریف می‌شود."
  },
  p3_brand_promise: {
    nodeId: "KB-STR-ONLY-001",
    canonicalSource: "David Aaker (Building Strong Brands: Brand Promise)",
    framework: "وعده تخلف‌ناپذیر برند و گارانتی ارزش",
    decisionChainLink: "حلقه ۷: تعهد و وفاداری به مشتری",
    insight: "وعده برند تعهدی است که حتی در شرایط سخت عملیاتی هرگز زیر پا گذاشته نمی‌شود."
  },

  // Phase 4
  p4_archetype: {
    nodeId: "KB-ID-ARCH-001",
    canonicalSource: "Margaret Mark & Carol S. Pearson (The Hero and the Outlaw)",
    framework: "۱۲ کهن‌الگوی روان‌شناختی یونگ در ساخت هویت برند",
    decisionChainLink: "حلقه ۸: روان‌شناسی و کاراکتر برند",
    insight: "کهن‌الگوها به برند روح انسانی می‌بخشند و ایجاد پیوند عاطفی ناخودآگاه با مشتری را ممکن می‌سازند."
  },
  p4_human_traits: {
    nodeId: "KB-ID-ARCH-001",
    canonicalSource: "Jennifer Aaker (Dimensions of Brand Personality)",
    framework: "ابعاد ۵ گانه شخصیت برند و صفات رفتاری ملموس",
    decisionChainLink: "حلقه ۸: صفات شخصیتی",
    insight: "صفات رفتاری شفاف به پرسنل و محتوا جهت می‌دهند تا برند همواره رفتاری یکدست داشته باشد."
  },
  p4_tone_guardrail: {
    nodeId: "KB-ID-ARCH-001",
    canonicalSource: "Robert Cialdini (Influence) & Robert McKee (Story)",
    framework: "گاردریل‌های لحن و مرزهای بازدارنده رفتاری",
    decisionChainLink: "حلقه ۸: محافظت از اصالت کاراکتر",
    insight: "دانستن اینکه برند چگونه نباید رفتار کند، از تخریب ناخواسته اعتبار جلوگیری می‌کند."
  },

  // Phase 5
  p5_voice_style: {
    nodeId: "KB-VERB-HOOK-001",
    canonicalSource: "Donald Miller (Building a StoryBrand)",
    framework: "سبک صدای برند و شیوه سخن گفتن با مخاطب",
    decisionChainLink: "حلقه ۹: لحن و کلام برند",
    insight: "مشتری قهرمان داستان است؛ برند شما راهنمای کاربلد و امین اوست."
  },
  p5_elevator_hook: {
    nodeId: "KB-VERB-HOOK-001",
    canonicalSource: "Carmine Gallo (The Presentation Secrets) & Chip Heath (Made to Stick)",
    framework: "فرمول قلاب معرفی ۳۰ ثانیه‌ای آسانسوری",
    decisionChainLink: "حلقه ۹: کپی‌رایتینگ و قلاب کلامی",
    insight: "اگر نتوانید ارزش کسب‌وکار را در ۳۰ ثانیه ساده بگویید، مخاطب فرصت شنیدن را از شما می‌گیرد."
  },
  p5_forbidden_words: {
    nodeId: "KB-VERB-HOOK-001",
    canonicalSource: "George Orwell (Politics and the English Language) & Marty Neumeier",
    framework: "پاکسازی واژگان کلیشه‌ای و پرهیز از اصطلاحات توخالی",
    decisionChainLink: "حلقه ۹: واژگان و انضباط زبانی",
    insight: "حذف کلمات کلیشه‌ای مانند «بهترین کیفیت»، باورپذیری پیام شما را چندین برابر می‌کند."
  },

  // Phase 6
  p6_naming_territory: {
    nodeId: "KB-NAM-TERR-001",
    canonicalSource: "Alexandra Watkins (Hello, My Name Is Awesome: SMILE & SCRATCH)",
    framework: "قلمروهای نام‌گذاری استراتژیک و آزمون تلفظ‌پذیری",
    decisionChainLink: "حلقه ۱۰: معماری نام و علائم تجاری",
    insight: "نام خوب یادآور ارزش محوری است و در مکالمه تلفنی نیازی به دیکته کردن حروف ندارد."
  },
  p6_tagline_archetype: {
    nodeId: "KB-NAM-TERR-001",
    canonicalSource: "Chip & Dan Heath (Made to Stick)",
    framework: "معماری شعارهای ماندگار و گزاره‌های اقدام‌محور",
    decisionChainLink: "حلقه ۱۰: شعار محوری",
    insight: "شعار اثرگذار یا به نفع نهایی مشتری اشاره دارد یا موضع جهان‌بینی برند را اعلام می‌کند."
  },

  // Phase 7
  p7_color_palette: {
    nodeId: "KB-VIS-TOKEN-001",
    canonicalSource: "Eva Heller (Psychology of Color) & Josef Albers (Interaction of Color)",
    framework: "روان‌شناسی رنگ‌ها و هارمونی ۶۰-۳۰-۱۰ در هویت بصری",
    decisionChainLink: "حلقه ۱۱: زبان رنگ و ادراک بصری",
    insight: "رنگ‌ها پیش از کلمات پردازش می‌شوند و بار روانی و موقعیت کیفی برند را ناخودآگاه القا می‌کنند."
  },
  p7_typography_mood: {
    nodeId: "KB-VIS-TOKEN-001",
    canonicalSource: "Ellen Lupton (Thinking with Type) & استانداردهای تایپوگرافی دیجیتال فارسی",
    framework: "خوانایی فونت فارسی، وزن حروف و هندسه حروف‌نگاری",
    decisionChainLink: "حلقه ۱۱: تایپوگرافی و فرم کلمات",
    insight: "تایپوگرافی آبرومند و خوانا، حس احترام به وقت مخاطب و حرفه‌ای بودن را منتقل می‌کند."
  },
  p7_logo_direction: {
    nodeId: "KB-VIS-TOKEN-001",
    canonicalSource: "Paul Rand (Design, Form, and Chaos) & Sagi Haviv (Identify)",
    framework: "اصول طراحی نشان ماندگار: سادگی، تمایز و انطباق‌پذیری محیطی",
    decisionChainLink: "حلقه ۱۱: نشان و هویت بصری",
    insight: "لوگو قرار نیست تمام داستان کسب‌وکار را بازگو کند؛ لوگو باید ساده، خوانا و به یادماندنی باشد."
  },

  // Phase 8
  p8_thought_leadership: {
    nodeId: "KB-EXEC-ACT-001",
    canonicalSource: "Dorie Clark (Stand Out: How to Find Your Breakthrough Idea)",
    framework: "موتور رهبری فکری و نقطه نظر متمایز (POV Engine)",
    decisionChainLink: "حلقه ۱۲: فعال‌سازی تجاری و رهبری فکری",
    insight: "رهبری فکری یعنی تبدیل تخصص خام به دیدگاه‌های شفافی که مسیر پیش روی صنعت را روشن می‌کند."
  },
  p8_pr_podcast_channels: {
    nodeId: "KB-EXEC-ACT-001",
    canonicalSource: "Ryan Holiday (Trust Me, I'm Lying) & استانداردهای رسانه‌ای ایران",
    framework: "نقشه راه روابط عمومی، حضور در پادکست‌ها و توزیع چندکاناله",
    decisionChainLink: "حلقه ۱۲: رسانه‌ها و روابط عمومی",
    insight: "یک مصاحبه عمیق یا حضور در پادکست معتبر، بیش از ده‌ها تبلیغ پولی اعتماد ایجاد می‌کند."
  },
  p8_lead_funnel: {
    nodeId: "KB-EXEC-ACT-001",
    canonicalSource: "Chet Holmes (The Ultimate Sales Machine: Core Commercial Engine)",
    framework: "قیف جذب تجاری و تبدیل مخاطب علاقه‌مند به مشتری سودآور",
    decisionChainLink: "حلقه ۱۲: معماری فروش و درآمد",
    insight: "قیف فروش منظم، مراجعات را از حالت شانس و تصادف به جریان درآمدی پیش‌بینی‌پذیر تبدیل می‌کند."
  },
  p8_crisis_reputation: {
    nodeId: "KB-EXEC-ACT-001",
    canonicalSource: "W. Timothy Coombs (Ongoing Crisis Communication: SCCT Framework)",
    framework: "پلی‌بوک مدیریت اعتبار و مهار بحران‌های نارضایتی مشتری",
    decisionChainLink: "حلقه ۱۲: مدیریت ریسک و حفظ اعتبار",
    insight: "پاسخگویی سریع، مستند به شواهد و پذیرش مسئولیت، بحران را به نمایش قدرت برند تبدیل می‌کند."
  }
};

// Jargon blacklist and replacements for traditional local trades
const CORPORATE_JARGON_TERMS = [
  { term: "CAC", replacement: "هزینه جذب مشتری محلی" },
  { term: "LTV", replacement: "ارزش مراجعات مکرر مشتری" },
  { term: "Churn", replacement: "ریزش یا قطع مراجعه مشتری" },
  { term: "DMU", replacement: "تصمیم‌گیرنده نهایی خرید" },
  { term: "Pipeline", replacement: "فهرست سفارش‌ها و مشتریان" },
  { term: "SLA", replacement: "تعهد کتبی و ضمانت کار" },
  { term: "Funnel", replacement: "مسیر ورود و جذب مشتری" }
];

/**
 * Filter corporate jargon from question text for traditional local trades
 */
export function sanitizeJargonForLocalTrades(text, context) {
  if (!text || typeof text !== "string") return text;
  if (!context) return text;

  const isLocalTrade = 
    context.archetype === "LOCAL_SERVICE" ||
    context.archetype === "PHYSICAL_RETAIL" ||
    context.primaryArchetype === "LOCAL_SERVICE" ||
    context.primaryArchetype === "PHYSICAL_RETAIL" ||
    context.industryId === "IND-01" ||
    context.industryId === "IND-05" ||
    context.industryId === "IND-28" ||
    context.channelModel === "PHYSICAL_FIRST" ||
    context.axes?.channelModel === "PHYSICAL_FIRST";

  if (!isLocalTrade) return text;

  let sanitized = text;
  for (const item of CORPORATE_JARGON_TERMS) {
    const reg = new RegExp(`\\b${item.term}\\b`, "gi");
    sanitized = sanitized.replace(reg, item.replacement);
  }
  return sanitized;
}

/**
 * Synthesizes tailored context-aware options matching the exact business trade (BT-xxxx)
 * and 15-axis profile.
 */
export function detectTradeSector(context, priorAnswers = {}) {
  const p1 = priorAnswers[1] || {};
  const tradeTitle = context?.taxonomyTitleFa || p1.description || "";
  const industryId = context?.industryId || context?.industryCode || "";
  const arch = context?.archetype || "";
  const combined = `${tradeTitle} ${p1.description || ""} ${p1.descriptionValue || ""} ${context?.archetypeTitle || ""}`.toLowerCase();

  // Automotive
  if (
    industryId === "IND-05" ||
    combined.includes("خودرو") || combined.includes("کارواش") || combined.includes("اتوسرویس") ||
    combined.includes("دیتیلینگ") || combined.includes("تعویض روغنی") || combined.includes("مکانیک") ||
    combined.includes("آپاراتی") || combined.includes("پنچرگیری") || combined.includes("تیونینگ") ||
    combined.includes("لوازم یدکی")
  ) {
    return "AUTOMOTIVE";
  }

  // Food, Cafe & Hospitality
  if (
    industryId === "IND-03" || arch === "RESTAURANT_CAFE_HOSPITALITY" ||
    combined.includes("کافه") || combined.includes("قهوه") || combined.includes("رستوران") ||
    combined.includes("رستری") || combined.includes("فست‌فود") || combined.includes("پیتزا") ||
    combined.includes("قنادی") || combined.includes("شیرینی") || combined.includes("نانوایی") ||
    combined.includes("کترینگ") || combined.includes("آبمیوه") || combined.includes("بستنی") ||
    combined.includes("طباخی") || combined.includes("غذا")
  ) {
    return "FOOD_HOSPITALITY";
  }

  // Healthcare, Medical, Dental, Clinic
  if (
    industryId === "IND-04" || combined.includes("پزشک") || combined.includes("مطب") ||
    combined.includes("دندانپزشک") || combined.includes("داروخانه") || combined.includes("کلینیک") ||
    combined.includes("فیزیوتراپی") || combined.includes("روانشناس") || combined.includes("مشاوره روان") ||
    combined.includes("ارتوپد") || combined.includes("چشم‌پزشک") || combined.includes("بینایی‌سنج") ||
    combined.includes("شنوایی‌سنج") || combined.includes("آزمایشگاه") || combined.includes("دامپزشک")
  ) {
    return "HEALTHCARE";
  }

  // Beauty, Hair, Salon, Spa
  if (
    combined.includes("سالن زیبایی") || combined.includes("آرایشگاه") || combined.includes("اسپا") ||
    combined.includes("میکاپ") || combined.includes("ناخن") || combined.includes("مژه") ||
    combined.includes("پوست و مو") || combined.includes("فیشیال") || combined.includes("کراتین") ||
    combined.includes("تاتو") || combined.includes("ماساژ")
  ) {
    return "BEAUTY";
  }

  // Manufacturing & Industrial B2B
  if (
    industryId === "IND-08" || industryId === "IND-09" || arch === "MANUFACTURER" ||
    combined.includes("کارخانه") || combined.includes("کارگاه صنعتی") || combined.includes("تولید قطعات") ||
    combined.includes("قالب‌سازی") || combined.includes("ماشین‌کاری") || combined.includes("تراشکاری") ||
    combined.includes("صنعتی") || combined.includes("صنایع فلزی") || combined.includes("تزریق پلاستیک") ||
    combined.includes("متالورژی") || combined.includes("ریخته‌گری")
  ) {
    return "MANUFACTURING";
  }

  // SaaS, Software, Cloud & Tech
  if (
    industryId === "IND-06" || industryId === "IND-07" || arch === "SAAS_SOFTWARE" ||
    combined.includes("نرم‌افزار") || combined.includes("اپلیکیشن") || combined.includes("سامانه") ||
    combined.includes("ابری") || combined.includes("saas") || combined.includes("طراحی سایت") ||
    combined.includes("پلتفرم") || combined.includes("سئو") || combined.includes("هوش مصنوعی")
  ) {
    return "SAAS_TECH";
  }

  // Education, Coaching, Media & Content Creator
  if (
    industryId === "IND-12" || arch === "CREATOR_MEDIA_EDUCATION" ||
    combined.includes("آموزش") || combined.includes("کوچینگ") || combined.includes("مربی") ||
    combined.includes("تدریس") || combined.includes("آکادمی") || combined.includes("دوره آموزشی") ||
    combined.includes("پادکست") || combined.includes("کریتور") || combined.includes("تولید محتوا") ||
    combined.includes("زبان") || combined.includes("کنکور")
  ) {
    return "EDUCATION_CREATOR";
  }

  // Real Estate, Interior Design & Construction
  if (
    industryId === "IND-10" || industryId === "IND-11" ||
    combined.includes("املاک") || combined.includes("مسکن") || combined.includes("معماری") ||
    combined.includes("دکوراسیون") || combined.includes("ساختمان") || combined.includes("پیمانکاری") ||
    combined.includes("تأسیسات") || combined.includes("آسانسور") || combined.includes("لوله کشی") ||
    combined.includes("نقاشی ساختمان")
  ) {
    return "REAL_ESTATE";
  }

  // Home Services, Repair & Maintenance
  if (
    combined.includes("قالیشویی") || combined.includes("نظافت") || combined.includes("خشکشویی") ||
    combined.includes("تعمیر لوازم خانگی") || combined.includes("کلیدسازی") || combined.includes("خدمات منزل")
  ) {
    return "HOME_SERVICES";
  }

  // Logistics & Transport
  if (
    industryId === "IND-15" ||
    combined.includes("باربری") || combined.includes("پیک") || combined.includes("حمل‌ونقل") ||
    combined.includes("لجستیک") || combined.includes("پخش") || combined.includes("انبارداری")
  ) {
    return "LOGISTICS";
  }

  // Retail & E-Commerce
  if (
    industryId === "IND-01" || industryId === "IND-02" || arch === "PHYSICAL_RETAIL" || arch === "ECOMMERCE_DTC" ||
    combined.includes("فروشگاه") || combined.includes("آنلاین‌شاپ") || combined.includes("بوتیک") ||
    combined.includes("طلا") || combined.includes("جواهر") || combined.includes("پوشاک") ||
    combined.includes("لباس") || combined.includes("کیف و کفش") || combined.includes("آرایشی") ||
    combined.includes("عطر") || combined.includes("سوپرمارکت") || combined.includes("هایپرمارکت") ||
    combined.includes("موبایل") || combined.includes("کتاب") || combined.includes("اسباب‌بازی") ||
    combined.includes("مبلمان")
  ) {
    return "RETAIL";
  }

  // Default Professional Consulting
  return "PROFESSIONAL";
}

/**
 * Synthesizes tailored context-aware options matching the exact business trade (BT-xxxx),
 * 12 macro-sectors, and user's prior answers across all phases.
 */
export function synthesizeContextOptions(question, context, founderVision = "", priorAnswers = {}) {
  if (!question) return question;
  const q = { ...question };

  const p1 = priorAnswers[1] || {};
  const p2 = priorAnswers[2] || {};
  const p3 = priorAnswers[3] || {};

  const tradeTitle = context?.taxonomyTitleFa || p1.description || "";
  const sector = detectTradeSector(context, priorAnswers);
  const stage = p1.stageValue || p1.stage || "active";
  const geo = p1.geographyValue || p1.geography || "local_city";
  const vision = founderVision || p1.diagnosticVision || "";

  // 1. DYNAMIC TRADE-TITLE WEAVING (Replacing generic phrases with exact trade title)
  if (tradeTitle) {
    if (q.id === "step0_diagnostic_probing" && !q.text.includes(tradeTitle)) {
      q.text = `حیطه کاری شما در صنف «${tradeTitle}» دقیقاً چیست و خودتان این کسب‌وکار را چطور می‌بینید و چه تمایز و ارزشی برای مشتریان قائلید؟`;
      q.title = `دیدگاه و تمایز شما در ${tradeTitle}`;
    } else if (q.id === "step0_stage" && !q.text.includes(tradeTitle)) {
      q.text = `کسب‌وکار شما در صنف «${tradeTitle}» در حال حاضر در چه مرحله‌ای از فعالیت قرار دارد؟`;
      q.title = `مرحله فعالیت ${tradeTitle}`;
    } else if (q.id === "step0_geography" && !q.text.includes(tradeTitle)) {
      q.text = `مشتریان اصلی شما در صنف «${tradeTitle}» بیشتر در چه محدوده‌ای حضور دارند؟`;
      q.title = `محدوده جغرافیایی ${tradeTitle}`;
    } else if (q.id === "step1_primary_goal") {
      q.title = `هدف ملموس کوتاه‌مدت (${tradeTitle})`;
      if (!q.text.includes(tradeTitle)) {
        q.text = `مهم‌ترین دستاورد عینی که می‌خواهید طی ۳ تا ۶ ماه آینده برای «${tradeTitle}» محقق شود چیست؟`;
      }
    } else if (q.id === "step2_core_offer") {
      q.title = `ساختار پیشنهاد اصلی (${tradeTitle})`;
      if (!q.text.includes(tradeTitle)) {
        q.text = `خدمات و محصولات محوری شما در «${tradeTitle}» چگونه به مشتری ارائه و تحویل می‌گردد؟`;
      }
    } else if (q.id === "step2_value_hypothesis") {
      q.title = `فرضیه تمایز و ارزش محوری (${tradeTitle})`;
      if (!q.text.includes(tradeTitle)) {
        q.text = `چرا مشتری باید «${tradeTitle}» شما را به جای هم‌صنفی‌ها و رقبای دیگر انتخاب کند؟`;
      }
    }
  }

  // 2. SYNTHESIZE OPTIONS FOR STEP 0: DIAGNOSTIC PROBING (Tailored per Sector)
  if (q.id === "step0_diagnostic_probing") {
    if (sector === "AUTOMOTIVE") {
      q.options = [
        { text: "شستشو و خدمات تخصصی با متریال درجه یک نانو و تضمین عدم خط و خش", value: "quality_excellence_guarantee", icon: "Award", badge: "تضمین کیفیت" },
        { text: "سرعت بالا، به حداقل رساندن معطلی مراجعان و تعرفه شفاف مصوب", value: "speed_fair_pricing", icon: "TrendingUp", badge: "سرعت و شفافیت" },
        { text: "احترام و تکریم مشتری، فضای استراحت پاکیزه و برخورد حرفه‌ای پرسنل", value: "customer_experience_relationship", icon: "Sparkles", badge: "تجربه مشتری" },
        { text: "خدمات تکمیلیVIP نظیر واکس نانو، صفرشویی عمیق و احیای رنگ", value: "deep_specialization_innovation", icon: "Layers", badge: "خدمات ویژه" }
      ];
    } else if (sector === "FOOD_HOSPITALITY") {
      q.options = [
        { text: "برشته‌کاری دانه تازه، عصاره‌گیری استاندارد و ثبات طعم در تمام سفارش‌ها", value: "quality_excellence_guarantee", icon: "Award", badge: "اصالت طعم" },
        { text: "سرویس‌دهی سریع، قیمت‌گذاری متناسب و حفظ کیفیت در ساعات شلوغی", value: "speed_fair_pricing", icon: "TrendingUp", badge: "سرعت سرویس" },
        { text: "خلق اتمسفر گرم، موسیقی ملایم و ایجاد فضایی آرام برای کار و گفتگو", value: "customer_experience_relationship", icon: "Sparkles", badge: "اتمسفر فضایی" },
        { text: "ارائه نوشیدنی‌های دمی تخصصی، ترکیبات باریستایی نوآورانه و قنادی تازه", value: "deep_specialization_innovation", icon: "Layers", badge: "منوی تخصصی" }
      ];
    } else if (sector === "RETAIL") {
      q.options = [
        { text: "عرضه اجناس دست‌چین، ترند و باکیفیت ممتاز که در بازار کمیاب است", value: "quality_excellence_guarantee", icon: "Award", badge: "دست‌چین و ترند" },
        { text: "قیمت منصفانه و اقتصادی همراه با تنوع بالا و تخفیف‌های دوره‌ای", value: "speed_fair_pricing", icon: "TrendingUp", badge: "قیمت منصفانه" },
        { text: "تجربه خرید لذت‌بخش، احترام کامل، مشاوره صادقانه و بسته‌بندی شکیل", value: "customer_experience_relationship", icon: "Sparkles", badge: "تجربه خرید" },
        { text: "ضمانت قطعی اصالت کالا و امکان تعویض یا مرجوعی بدون قید و شرط", value: "deep_specialization_innovation", icon: "Layers", badge: "ضمانت اصالت" }
      ];
    } else if (sector === "HEALTHCARE") {
      q.options = [
        { text: "تشخیص دقیق علمی، استفاده از تجهیزات استریل و تعهد به سلامت بیمار", value: "quality_excellence_guarantee", icon: "Award", badge: "تعهد بالینی" },
        { text: "نوبت‌دهی منظم بدون معطلی و احترام واقعی به وقت بیمار", value: "speed_fair_pricing", icon: "TrendingUp", badge: "نظم نوبت‌دهی" },
        { text: "برخورد صمیمانه، ایجاد آرامش و پیگیری مستمر وضعیت پس از درمان", value: "customer_experience_relationship", icon: "Sparkles", badge: "آرامش و پیگیری" },
        { text: "ارائه به‌روزترین متدهای درمانی و زیبایی با تعرفه شفاف مصوب", value: "deep_specialization_innovation", icon: "Layers", badge: "روش‌های مدرن" }
      ];
    } else if (sector === "BEAUTY") {
      q.options = [
        { text: "استفاده از متریال اصل و برندهای جهانی بدون کوچک‌ترین آسیب به مو و پوست", value: "quality_excellence_guarantee", icon: "Award", badge: "متریال بدون آسیب" },
        { text: "اجرای جدیدترین تکنیک‌های روز متناسب با سلیقه و فرم چهره مشتری", value: "deep_specialization_innovation", icon: "Layers", badge: "سبک‌های مدرن" },
        { text: "فضای شیک و تمیز، رفتار محترمانه پرسنل و حس آرامش در طول خدمات", value: "customer_experience_relationship", icon: "Sparkles", badge: "محیط آرامش‌بخش" },
        { text: "وقت‌شناسی دقیق در شروع و تحویل کار و ماندگاری تضمینی خدمات", value: "speed_fair_pricing", icon: "TrendingUp", badge: "وقت‌شناسی و دوام" }
      ];
    } else if (sector === "MANUFACTURING") {
      q.options = [
        { text: "دقت بالای تلرانس قطعات، انطباق ۱۰۰٪ با نقشه مهندسی و آلیاژ استاندارد", value: "quality_excellence_guarantee", icon: "Award", badge: "دقت صنعتی" },
        { text: "تحویل به موقع تیراژ قراردادها و ثبات قیمت در سفارش‌های دوره‌ای", value: "speed_fair_pricing", icon: "TrendingUp", badge: "تعهد زمانی" },
        { text: "ارتباط فنی مستقیم مهندسان با خریدار سازمانی و شفافیت در آزمون کنترل کیفیت", value: "customer_experience_relationship", icon: "Sparkles", badge: "همراهی فنی" },
        { text: "توان ساخت قالب‌های پیچیده و قطعات سفارشی با ماشین‌کاری پیشرفته", value: "deep_specialization_innovation", icon: "Layers", badge: "ظرفیت سفارشی" }
      ];
    } else if (sector === "SAAS_TECH") {
      q.options = [
        { text: "رابط کاربری ساده و بدون پیچیدگی که کاربر در کمتر از ۱۰ دقیقه راه بیفتد", value: "quality_excellence_guarantee", icon: "Award", badge: "سادگی رابط" },
        { text: "اتصال پایدار و خودکار به سامانه‌های دولتی، بانکی و مودیان بدون قطعی", value: "speed_fair_pricing", icon: "TrendingUp", badge: "اتصال پایدار" },
        { text: "پشتیبانی پاسخگو در کمتر از ۵ دقیقه و آموزش گام‌به‌گام اختصاصی به تیم مشتری", value: "customer_experience_relationship", icon: "Sparkles", badge: "پشتیبانی سریع" },
        { text: "گزارش‌های تحلیلی هوشمند از سود و زیان و جریان نقدینگی بلادرنگ", value: "deep_specialization_innovation", icon: "Layers", badge: "هوش مدیریتی" }
      ];
    } else if (sector === "EDUCATION_CREATOR") {
      q.options = [
        { text: "آموزش کاربردی و انتقال تجربیات واقعی بازار به دور از تئوری‌های خسته‌کننده", value: "quality_excellence_guarantee", icon: "Award", badge: "تجربه عملی" },
        { text: "پیگیری انفرادی پیشرفت دانش‌پذیر و پاسخگویی و رفع اشکال مستقیم", value: "customer_experience_relationship", icon: "Sparkles", badge: "منتورینگ مستقیم" },
        { text: "ارائه ابزارها، قالب‌ها و فریم‌ورک‌های آماده برای اجرای سریع و نتیجه فوری", value: "speed_fair_pricing", icon: "TrendingUp", badge: "نتیجه سریع" },
        { text: "طراحی مسیر یادگیری مدرن و مهارت‌های ثروت‌آفرین آینده‌دار", value: "deep_specialization_innovation", icon: "Layers", badge: "مهارت‌های آینده" }
      ];
    } else {
      q.options = [
        { text: "تعهد به کیفیت بی‌قیدوشرط، دقت بالا در جزئیات و خروجی بدون نقص", value: "quality_excellence_guarantee", icon: "Award", badge: "کیفیت بی‌نقص" },
        { text: "سرعت عمل بالا، پاسخگویی فوری و نظم دقیق در تحویل تعهدات", value: "speed_fair_pricing", icon: "TrendingUp", badge: "سرعت و نظم" },
        { text: "مشاوره دلسوزانه و ساخت رابطه بلندمدت و مبتنی بر اعتماد با مشتری", value: "customer_experience_relationship", icon: "Sparkles", badge: "ارتباط و اعتماد" },
        { text: "نوآوری، روش‌های مدرن و راهکارهای کارآمدی که رقبا هنوز ارائه نمی‌دهند", value: "deep_specialization_innovation", icon: "Layers", badge: "نوآوری و تمایز" }
      ];
    }
  }

  // 3. SYNTHESIZE OPTIONS FOR STEP 1: PRIMARY GOAL (Tailored based on STAGE)
  if (q.id === "step1_primary_goal") {
    if (stage.includes("idea")) {
      q.options = [
        { text: "اعتبارسنجی فرضیه ارزش با جذب اولین ۱۰ تا ۵۰ مشتری واقعی و تست بازار", value: "first_100_customers", icon: "Lightbulb", badge: "تست و اعتبارسنجی" },
        { text: "طراحی هویت متمایز و برآورد دقیق مدل سودآوری و هزینه‌های اولیه", value: "stable_monthly_revenue", icon: "DollarSign", badge: "مدل سودآوری" },
        { text: "تعریف جایگاه انحصاری در بازار تا از روز اول از رقابت منفی خارج شویم", value: "premium_differentiation", icon: "ShieldCheck", badge: "تمایز از روز اول" },
        { text: "تکمیل زیرساخت‌ها، اخذ مجوزها و آماده‌سازی برای ورود پرقدرت", value: "category_authority", icon: "Award", badge: "آمادگی لانچ" }
      ];
    } else if (stage.includes("pre_launch")) {
      q.options = [
        { text: "جذب ۱۰۰ مشتری اولیه در ماه اول راه‌اندازی و تست فرآیندهای خدمت‌رسانی", value: "first_100_customers", icon: "Rocket", badge: "جذب ۱۰۰ مشتری اول" },
        { text: "رسیدن سریع به نقطه سربه‌سر هزینه‌ها و ایجاد جریان نقدینگی مثبت ماهانه", value: "stable_monthly_revenue", icon: "TrendingUp", badge: "جریان نقدینگی مثبت" },
        { text: "تثبیت برند به عنوان انتخابی باکیفیت‌تر و مدرن‌تر از گزینه‌های سنتی منطقه", value: "premium_differentiation", icon: "Crown", badge: "تصویر مدرن و برتر" },
        { text: "اجرای موفق افتتاحیه و ثبت بالاترین میزان رضایت در مراجعات اولیه", value: "category_authority", icon: "CheckCircle", badge: "افتتاحیه موفق" }
      ];
    } else if (stage.includes("rebrand")) {
      q.options = [
        { text: "بازآفرینی تصویر برند برای جذب مشتریان جوان‌تر و طبقه درآمدی بالاتر", value: "premium_differentiation", icon: "RefreshCw", badge: "تغییر جایگاه ذهنی" },
        { text: "افزایش محسوس حاشیه سود و خروج قطعی از جنگ فرسایشی تخفیف و ارزان‌فروشی", value: "stable_monthly_revenue", icon: "TrendingUp", badge: "افزایش حاشیه سود" },
        { text: "تبدیل شدن به مرجع شماره یک و نام معتبر بدون رقیب در صنف و منطقه", value: "category_authority", icon: "Award", badge: "مرجعیت مطلق صنف" },
        { text: "فعال‌سازی مشتریان قدیمی و افزایش مراجعات مجدد با پیشنهادهای نوین", value: "first_100_customers", icon: "Users", badge: "وفادارسازی مجدد" }
      ];
    } else {
      q.options = [
        { text: "جذب پیوسته مشتریان وفادار جدید و افزایش سهم بازار در صنف", value: "first_100_customers", icon: "Users", badge: "رشد سهم بازار" },
        { text: "افزایش محسوس حجم فروش و پایدارسازی جریان درآمد ماهانه", value: "stable_monthly_revenue", icon: "DollarSign", badge: "درآمد پایدار" },
        { text: "تمایز کیفی، خروج از مقایسه قیمتی و تثبیت قیمت‌گذاری باارزش", value: "premium_differentiation", icon: "ShieldCheck", badge: "تمایز کیفی" },
        { text: "تبدیل شدن به خوش‌نام‌ترین و معتبرترین برند صنف در منطقه یا کشور", value: "category_authority", icon: "Award", badge: "اعتبار برند" }
      ];
    }
  }

  // 4. SYNTHESIZE OPTIONS FOR STEP 2: CORE OFFER (Tailored per Sector)
  if (q.id === "step2_core_offer") {
    if (sector === "RETAIL") {
      q.options = [
        { text: "سبد کالاهای پرفروش و مصرفی روزمره با تنوع بالا و تحویل فوری", value: "core_service_delivery", icon: "ShoppingBag", badge: "کالاهای روزمره" },
        { text: "اجناس دست‌چین، لوکس یا سفارشی با بسته‌بندی شکیل و هدیه‌ای", value: "physical_catalog_menu", icon: "Box", badge: "کالای لوکس و خاص" },
        { text: "پکیج‌های اقتصادی و بسته‌های خرید تجمیعی با تخفیف خانواده", value: "custom_solution_project", icon: "Layers", badge: "پکیج‌های اقتصادی" },
        { text: "کارت اشتراک خرید دوره‌ای با شارژ تخفیف و ارسال رایگان ماهانه", value: "subscription_recurring", icon: "Repeat", badge: "اشتراک و وفاداری" }
      ];
    } else if (sector === "FOOD_HOSPITALITY") {
      q.options = [
        { text: "سرو حضوری منوی روزمره با طعم تازه، کیفیت یکنواخت و سرویس سریع", value: "core_service_delivery", icon: "Coffee", badge: "سرو حضوری روزمره" },
        { text: "بسته‌بندی بیرون‌بر استاندارد و دلیوری گرم و بهداشتی در محل مشتری", value: "physical_catalog_menu", icon: "Box", badge: "دلیوری بیرون‌بر" },
        { text: "آیتم‌های دمی و تخصصی پریمیوم (دانه‌های تازه، ترکیبات خاص دست‌ساز)", value: "custom_solution_project", icon: "Sparkles", badge: "منوی تخصصی VIP" },
        { text: "پکیج‌های کیترینگ اداری، مراسم و تأمین مستمر قهوه/شیرینی شرکت‌ها", value: "subscription_recurring", icon: "Briefcase", badge: "کیترینگ و اداری" }
      ];
    } else if (sector === "HEALTHCARE") {
      q.options = [
        { text: "معاینه، ویزیت بالینی و تشخیص دقیق تخصصی در مطب یا مرکز", value: "core_service_delivery", icon: "CheckCircle", badge: "معاینه و تشخیص" },
        { text: "پکیج‌های جامع درمان، ترمیم یا زیبایی با پروتکل‌های استریل کامل", value: "custom_solution_project", icon: "ShieldCheck", badge: "پکیج‌های درمانی" },
        { text: "چکاپ‌های دوره‌ای سلامت، پیشگیری و پیگیری اختصاصی پرونده بیمار", value: "subscription_recurring", icon: "Repeat", badge: "چکاپ و پیشگیری" },
        { text: "خدمات سرپایی یا جراحی‌های تخصصی با پیشرفته‌ترین دستگاه‌های روز", value: "physical_catalog_menu", icon: "Cpu", badge: "اقدامات تخصصی" }
      ];
    } else if (sector === "BEAUTY") {
      q.options = [
        { text: "خدمات تخصصی مو، پوست و ناخن با مرغوب‌ترین متریال خارجی بدون آسیب", value: "core_service_delivery", icon: "Sparkles", badge: "خدمات تخصصی" },
        { text: "پکیج‌های کامل VIP عروس و مناسبت‌ها همراه با مشاوره استایل اختصاصی", value: "custom_solution_project", icon: "Crown", badge: "پکیج کامل VIP" },
        { text: "اشتراک ماهانه رسیدگی، احیا و مراقبت دوره‌ای پوست و مو", value: "subscription_recurring", icon: "Repeat", badge: "اشتراک مراقبت دوره‌ای" },
        { text: "خدمات اکسپرس و سریع ویژه مشتریان پرمشغله با کیفیت تضمینی", value: "physical_catalog_menu", icon: "Zap", badge: "خدمات اکسپرس سریع" }
      ];
    } else if (sector === "MANUFACTURING") {
      q.options = [
        { text: "تولید انبوه قطعات صنعتی استاندارد طبق سفارش و نقشه مهندسی", value: "core_service_delivery", icon: "Factory", badge: "تولید انبوه استاندارد" },
        { text: "طراحی و ساخت قالب‌های دقیق صنعتی و قطعات سفارشی تیراژ محدود", value: "custom_solution_project", icon: "Cpu", badge: "قالب و قطعات سفارشی" },
        { text: "تأمین مستمر قطعات در قالب قراردادهای تامین بلندمدت با کارخانجات", value: "subscription_recurring", icon: "Briefcase", badge: "قرارداد تامین مستمر" },
        { text: "خدمات تخصصی ماشین‌کاری، عملیات حرارتی، تست آزمایشگاهی و QC", value: "physical_catalog_menu", icon: "Award", badge: "خدمات فنی تکمیلی" }
      ];
    } else if (sector === "SAAS_TECH") {
      q.options = [
        { text: "پنل نرم‌افزاری ابری سلف‌سرویس با اشتراک دوره‌ای و شروع آنی", value: "subscription_recurring", icon: "Repeat", badge: "اشتراک ابری SaaS" },
        { text: "استقرار نسخه سفارشی شرکتی با اتصال به سامانه‌های مالی و مودیان", value: "custom_solution_project", icon: "Code", badge: "نسخه سفارشی سازمانی" },
        { text: "بسته کامل راهکار نرم‌افزاری به همراه آموزش تیم و پشتیبانی ۲۴ ساعته", value: "core_service_delivery", icon: "CheckCircle", badge: "راهکار کامل سازمانی" },
        { text: "ماژول‌های تخصصی جانبی نظیر انبارداری، هوش تجاری و باشگاه مشتریان", value: "physical_catalog_menu", icon: "Layers", badge: "ماژول‌های الحاقی" }
      ];
    } else if (sector === "AUTOMOTIVE") {
      q.options = [
        { text: "سرویس‌های دوره‌ای سریع (تعویض، شستشو، چکاپ) با مواد درجه یک نانو", value: "core_service_delivery", icon: "CheckCircle", badge: "سرویس دوره‌ای استاندارد" },
        { text: "تعمیرات تخصصی، احیا، نانوسرامیک و دیتیلینگ عمیق با گارانتی کتبی", value: "custom_solution_project", icon: "ShieldCheck", badge: "دیتیلینگ و تعمیر تخصصی" },
        { text: "اشتراک فصلی نگهداری خودرو و پکیج‌های چندگانه با تخفیف وفاداری", value: "subscription_recurring", icon: "Repeat", badge: "اشتراک نگهداری فصلی" },
        { text: "خدمات VIP به همراه سالن انتظار اختصاصی و پذیرایی از مالک خودرو", value: "physical_catalog_menu", icon: "Crown", badge: "پکیج VIP با سالن مدرن" }
      ];
    } else {
      q.options = [
        { text: "خدمت حضوری یا تخصصی استاندارد با تحویل سریع و تضمینی", value: "core_service_delivery", icon: "CheckCircle", badge: "خدمت محوری استاندارد" },
        { text: "پروژه سفارشی، راهکار جامع اختصاصی یا پکیج مشاوره کامل", value: "custom_solution_project", icon: "Cpu", badge: "راهکار جامع سفارشی" },
        { text: "اشتراک ماهانه، شارژ دوره‌ای یا قرارداد همکاری و پشتیبانی مستمر", value: "subscription_recurring", icon: "Repeat", badge: "همکاری مستمر دوره‌ای" },
        { text: "سبد کالا یا خدمات تخصصی منتخب با بالاترین استاندارد کیفی", value: "physical_catalog_menu", icon: "Box", badge: "سبد خدمات تخصصی" }
      ];
    }
  }

  // 5. SYNTHESIZE OPTIONS FOR STEP 2: VALUE HYPOTHESIS (Tailored based on Vision)
  if (q.id === "step2_value_hypothesis") {
    q.options = [
      { text: `کیفیت برتر متریال و وسواس فنی؛ تعهد کتبی به اینکه کار در «${tradeTitle || "کسب‌وکار"}» بی‌نقص تحویل شود`, value: "quality_precision", icon: "ShieldCheck", badge: "کیفیت و اصالت قطعی" },
      { text: "سرعت تحویل فوق‌العاده، احترام به زمان و حذف کامل هرگونه معطلی و بدقولی", value: "speed_convenience", icon: "Zap", badge: "سرعت و بدون معطلی" },
      { text: "برخورد گرم، احترام عمیق به مراجعان و ایجاد حس آرامش و امنیت خاطر ۱۰۰٪", value: "customer_experience", icon: "HeartHandshake", badge: "تجربه مشتری و همدلی" },
      { text: "قیمت‌گذاری شفاف و منصفانه بدون دریافت کوچک‌ترین هزینه پنهان یا اضافی", value: "fair_pricing_expertise", icon: "Tag", badge: "شفافیت مالی و ارزش واقعی" }
    ];
  }

  // 6. PHASE 3 WEAVING: TARGET SEGMENT & ONLY-NESS
  if (q.id === "p3_target_segment" && tradeTitle) {
    q.title = `بخش هدف متمرکز در ${tradeTitle}`;
    q.text = `در میان مراجعان «${tradeTitle}»، کدام گروه بیشترین ارزش، فوریت و آمادگی پرداخت منصفانه را دارند؟`;
  }

  // 7. PHASE 5 WEAVING: ELEVATOR HOOK TAILORED FORMULATION
  if (q.id === "p5_elevator_hook" && tradeTitle) {
    q.title = `قلاب معرفی ۳۰ ثانیه‌ای برای ${tradeTitle}`;
    q.text = `وقتی از شما می‌پرسند «در ${tradeTitle} چه کار می‌کنید؟»، کدام قلاب کلامی بیشترین اثر را دارد؟`;
    q.options = [
      { text: `ما در «${tradeTitle}» به مراجعان کمک می‌کنیم با بالاترین کیفیت و بدون معطلی به بهترین نتیجه برسند.`, value: "pain_solution_hook", icon: "Target", badge: "حل مستقیم درد" },
      { text: `برخلاف روال سنتی بازار، ما در «${tradeTitle}» کیفیت کار را ۱۰۰٪ با ضمانت کتبی تحویل می‌دهیم.`, value: "contrarian_fresh_hook", icon: "ShieldCheck", badge: "تمایز تضمینی" },
      { text: `ما تخصصی‌ترین مرجع «${tradeTitle}» در منطقه هستیم که تجربه خریدی لوکس، شفاف و مطمئن خلق می‌کند.`, value: "outcome_result_hook", icon: "Crown", badge: "مرجعیت تخصصی" }
    ];
  }

  // 8. PHASE 8 WEAVING: ACTIVATION CHANNELS (Local vs National)
  if (q.id === "p8_pr_podcast_channels") {
    if (geo.includes("local") || geo.includes("city")) {
      q.title = `کانال‌های جذب محلی و پاخور منطقه‌ای (${tradeTitle || "کسب‌وکار"})`;
      q.text = `برای یک کسب‌وکار محلی در صنف «${tradeTitle || "شما"}»، کدام کانال‌های جذب بیشترین بازدهی را دارند؟`;
      q.options = [
        { text: "تسلط بر نقشه‌های بلد، نشان و گوگل مپ با نظرات عالی مراجعان و سئوی محلی", value: "local_maps_geography", icon: "MapPin", badge: "سئوی نقشه‌های محلی" },
        { text: "اینستاگرام محلی با نمایش روزمره محیط کار، رضایت مراجعان و ولاگ‌های واقعی", value: "local_instagram_vlogs", icon: "Instagram", badge: "اینستاگرام محلی" },
        { text: "معرفی دهان‌به‌دهان محله و کمپین‌های پیامکی مناسبتی به مشتریان سابق", value: "sms_referral_local", icon: "Users", badge: "پیامک و ارجاع محلی" }
      ];
    } else {
      q.title = `کانال‌های سراسری جذب، روابط عمومی و رسانه‌ها (${tradeTitle || "کسب‌وکار"})`;
      q.text = `برای پوشش در سطح ملی در صنف «${tradeTitle || "شما"}»، کدام بسترها اولویت سرمایه‌گذاری دارند؟`;
      q.options = [
        { text: "سئوی ارگانیک گوگل، مقالات تخصصی حل مسئله و رتبه یک عبارات کلیدی صنف", value: "google_search_seo", icon: "Search", badge: "سئو و جستجوی گوگل" },
        { text: "حضور در پادکست‌های معتبر تخصصی، مصاحبه‌های رسانه‌ای و گزارش‌های خبری", value: "podcast_pr_features", icon: "Mic", badge: "پادکست و رسانه" },
        { text: "همکاری با اینفلوئنسرهای معتبر صنف و حضور پرقدرت در لینکدین و اینستاگرام", value: "influencer_social_campaigns", icon: "Share2", badge: "سوشال مدیا و لینکدین" }
      ];
    }
  }

  // Weave founder vision anchor
  if (vision && typeof vision === "string" && vision.trim().length > 5) {
    const visionSnippet = vision.trim().slice(0, 75).replace(/[\r\n]+/g, " ");
    if (q.text && !q.text.includes("دیدگاه شما")) {
      q.visionAnchor = visionSnippet;
    }
  }

  // Sanitize title and text for traditional local trades
  if (q.title) {
    q.title = sanitizeJargonForLocalTrades(q.title, context);
  }
  if (q.text) {
    q.text = sanitizeJargonForLocalTrades(q.text, context);
  }

  // Ensure zero jargon in all option texts and badges
  if (Array.isArray(q.options) && q.options.length > 0) {
    q.options = q.options.map(opt => ({
      ...opt,
      text: sanitizeJargonForLocalTrades(opt.text, context),
      ...(opt.badge ? { badge: sanitizeJargonForLocalTrades(opt.badge, context) } : {})
    }));
  }

  return q;
}


export function pruneIrrelevantQuestions(questions, context) {
  if (!Array.isArray(questions)) return [];
  if (!context) return questions;

  const isPureB2C = context.customerModel === "B2C";
  const isPureB2B = context.customerModel === "B2B";
  const isPhysicalOnly = context.channelModel === "PHYSICAL_FIRST";
  const isDigitalOnly = context.channelModel === "ONLINE_FIRST";

  return questions.filter(q => {
    const qId = q.id || "";
    // If pure B2C, prune B2B tender/procurement questions if any exist
    if (isPureB2C && qId.includes("tender_procurement")) return false;
    // If pure B2B, prune impulse retail foot traffic questions if any exist
    if (isPureB2B && qId.includes("foot_traffic_impulse")) return false;
    // If physical only, prune server uptime/cloud SaaS questions
    if (isPhysicalOnly && qId.includes("server_uptime_cloud")) return false;
    // If digital only, prune physical parking/store decor questions
    if (isDigitalOnly && qId.includes("store_parking_interior")) return false;

    return true;
  });
}

/**
 * Prunes questions that have already been answered in prior answers or founder vision
 */
export function pruneAnsweredQuestions(questions, priorAnswers = {}, facts = []) {
  if (!Array.isArray(questions)) return [];

  return questions.map(q => {
    const qId = q.id;
    let isAnswered = false;
    let answeredValue = null;

    for (let p = 1; p <= 8; p++) {
      const pData = priorAnswers[p];
      if (!pData) continue;

      // Direct qId check
      if (pData[qId] !== undefined && pData[qId] !== null && pData[qId] !== "") {
        isAnswered = true;
        answeredValue = pData[qId];
        break;
      }

      // Semantic property mappings per phase
      if (p === 1) {
        if (qId === "step0_stage" && pData.stage) { isAnswered = true; answeredValue = pData.stage; break; }
        if (qId === "step0_diagnostic_probing" && (pData.diagnosticVision || pData.diagnosticVisionValue)) { isAnswered = true; answeredValue = pData.diagnosticVision; break; }
        if (qId === "step0_description" && (pData.description || pData.descriptionValue)) { isAnswered = true; answeredValue = pData.description || pData.descriptionValue; break; }
        if (qId === "step0_geography" && (pData.geography || pData.geographyValue)) { isAnswered = true; answeredValue = pData.geography; break; }
        if (qId === "step1_primary_goal" && (pData.primaryGoal || pData.primaryGoalValue)) { isAnswered = true; answeredValue = pData.primaryGoal; break; }
        if (qId === "step2_core_offer" && (pData.coreOffer || pData.coreOfferValue)) { isAnswered = true; answeredValue = pData.coreOffer; break; }
        if (qId === "step2_value_hypothesis" && (pData.valueHypothesis || pData.valueHypothesisValue)) { isAnswered = true; answeredValue = pData.valueHypothesis; break; }
      } else if (p === 2) {
        if (qId === "p2_step0_competitors" && pData.competitors) { isAnswered = true; answeredValue = pData.competitors; break; }
        if (qId === "p2_step1_customer_pain" && pData.customerPain) { isAnswered = true; answeredValue = pData.customerPain; break; }
        if (qId === "p2_step2_pricing_models" && pData.pricingModel) { isAnswered = true; answeredValue = pData.pricingModel; break; }
        if (qId === "p2_step3_primary_channel" && pData.primaryChannel) { isAnswered = true; answeredValue = pData.primaryChannel; break; }
        if (qId === "p2_step4_golden_opportunity" && pData.goldenOpportunity) { isAnswered = true; answeredValue = pData.goldenOpportunity; break; }
      } else if (p === 3) {
        if (qId === "p3_target_segment" && pData.targetSegment) { isAnswered = true; answeredValue = pData.targetSegment; break; }
        if (qId === "p3_positioning_frame" && pData.positioning) { isAnswered = true; answeredValue = pData.positioning; break; }
        if (qId === "p3_strategic_boundary" && pData.boundary) { isAnswered = true; answeredValue = pData.boundary; break; }
        if (qId === "p3_brand_promise" && pData.promise) { isAnswered = true; answeredValue = pData.promise; break; }
      } else if (p === 4) {
        if (qId === "p4_archetype" && pData.archetype) { isAnswered = true; answeredValue = pData.archetype; break; }
        if (qId === "p4_human_traits" && pData.traits) { isAnswered = true; answeredValue = pData.traits; break; }
        if (qId === "p4_tone_guardrail" && pData.toneGuardrail) { isAnswered = true; answeredValue = pData.toneGuardrail; break; }
      } else if (p === 5) {
        if (qId === "p5_voice_style" && pData.voiceStyle) { isAnswered = true; answeredValue = pData.voiceStyle; break; }
        if (qId === "p5_elevator_hook" && pData.elevatorHook) { isAnswered = true; answeredValue = pData.elevatorHook; break; }
        if (qId === "p5_forbidden_words" && pData.forbiddenWords) { isAnswered = true; answeredValue = pData.forbiddenWords; break; }
      } else if (p === 6) {
        if (qId === "p6_naming_territory" && pData.naming) { isAnswered = true; answeredValue = pData.naming; break; }
        if (qId === "p6_tagline_archetype" && pData.tagline) { isAnswered = true; answeredValue = pData.tagline; break; }
      } else if (p === 7) {
        if (qId === "p7_color_palette" && pData.colorPalette) { isAnswered = true; answeredValue = pData.colorPalette; break; }
        if (qId === "p7_typography_mood" && pData.typography) { isAnswered = true; answeredValue = pData.typography; break; }
        if (qId === "p7_logo_direction" && pData.logoConcept) { isAnswered = true; answeredValue = pData.logoConcept; break; }
      } else if (p === 8) {
        if (qId === "p8_thought_leadership" && pData.thoughtLeadership) { isAnswered = true; answeredValue = pData.thoughtLeadership; break; }
        if (qId === "p8_pr_podcast_channels" && pData.prChannels) { isAnswered = true; answeredValue = pData.prChannels; break; }
        if (qId === "p8_lead_funnel" && pData.leadFunnel) { isAnswered = true; answeredValue = pData.leadFunnel; break; }
        if (qId === "p8_crisis_reputation" && pData.reputationCrisis) { isAnswered = true; answeredValue = pData.reputationCrisis; break; }
      }
    }

    return {
      ...q,
      isAnswered,
      answeredValue
    };
  });
}

/**
 * Master Chained Question Composition Function
 * Formula: ActiveQuestions = Base + Industry Module + Customer Model Overlay + Channel Overlay + Revenue Overlay + Maturity Overlay + Founder Role Overlay - Irrelevant - Answered
 */
export function composeChainedQuestions(
  phase,
  businessContext,
  priorAnswers = {},
  unknowns = [],
  founderVision = "",
  options = {}
) {
  const p = parseInt(phase, 10);
  const context = businessContext || null;
  const vision = founderVision || priorAnswers[1]?.diagnosticVision || "";

  // 1. BASE QUESTIONS (Q_base)
  let baseQuestions = [];
  if (p === 1) {
    baseQuestions = [...INITIAL_QUESTIONS];
  } else if (p === 2) {
    baseQuestions = getAdaptivePhase2Questions(context);
  } else {
    baseQuestions = getAdaptedPhaseQuestions(p, context);
  }

  // 2. INDUSTRY MODULE & OVERLAYS INTEGRATION (Q_industry + sum(Q_overlays))
  const industryCode = context?.industryCode || "GENERAL";
  const activeOverlays = Array.isArray(context?.activeOverlays) ? context.activeOverlays : [];

  let composed = baseQuestions.map(q => {
    // Clone question object
    let question = { ...q };

    // Inject canonical knowledge guidance
    const guidance = QUESTION_KNOWLEDGE_BASE[question.id] || {
      nodeId: `KB-P${p}-001`,
      canonicalSource: "پایگاه دانش ۱۶۵ منبعی و فریم‌ورک‌های تصمیم‌گیری بازاریابی دیجیتال مارکت",
      framework: "نردبان شواهد علمی و استراتژی یکپارچه برندسازی",
      decisionChainLink: `فاز ${p}: حلقه تصمیم‌گیری اختصاصی`,
      insight: "تمام خروجی‌ها بر مبنای داده‌های اعتبارسنجی‌شده و منطبق با بافتار صنف طراحی می‌شوند."
    };
    question.knowledgeGuidance = guidance;

    // Record Applied Formula metadata
    question.appliedFormula = {
      formula: DYNAMIC_QUESTION_FORMULA,
      base: true,
      industryModule: industryCode,
      overlays: activeOverlays,
      founderVisionIntegrated: !!vision,
      phase: p
    };

    // Apply context-aware options and jargon sanitization
    question = synthesizeContextOptions(question, context, vision, priorAnswers);

    return question;
  });

  // 3. SUBTRACT IRRELEVANT ( - Q_irrelevant )
  composed = pruneIrrelevantQuestions(composed, context);

  // 4. SUBTRACT ANSWERED ( - Q_answered )
  // Tag answered status
  composed = pruneAnsweredQuestions(composed, priorAnswers);

  // Only filter out answered questions if explicitly requested via options.filterAnswered
  if (options.filterAnswered === true) {
    composed = composed.filter(q => !q.isAnswered);
  }

  return composed;
}
