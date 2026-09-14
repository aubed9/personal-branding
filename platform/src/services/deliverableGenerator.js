/**
 * DIGITAL MARKET — Dedicated Strategic Deliverable Generator (Phases 1 to 8 + Master)
 * Produces deep, context-aware, highly differentiated 5-layer algorithmic deliverables:
 * Layer 1: Starting Point & Prerequisites
 * Layer 2: Execution Algorithm with Conditionals & Flowcharts
 * Layer 3: Actionable Operational Checklist
 * Layer 4: Mathematical Formulas & Quantitative KPI Thresholds
 * Layer 5: Termination & Hand-off Gate
 */

export function generateDeliverable(phaseNum, phaseData, businessContext, decisions = [], facts = [], unknowns = []) {
  const dateStr = new Date().toLocaleDateString("fa-IR");
  const p = phaseNum === "master" || phaseNum === "all" ? "master" : parseInt(phaseNum, 10) || 1;

  if (p === "master") {
    return generateMasterDeliverable(phaseData, businessContext, dateStr, unknowns, facts);
  }

  switch (p) {
    case 1:
      return generatePhase1Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 2:
      return generatePhase2Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 3:
      return generatePhase3Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 4:
      return generatePhase4Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 5:
      return generatePhase5Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 6:
      return generatePhase6Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 7:
      return generatePhase7Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    case 8:
      return generatePhase8Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
    default:
      return generatePhase1Deliverable(phaseData, businessContext, dateStr, unknowns, facts);
  }
}

// ----------------------------------------------------------------------------
// CONTEXT PROFILE & UNKNOWN-AWARE HELPERS
// ----------------------------------------------------------------------------
function getContextProfileInfo(ctx, phaseData = {}, facts = []) {
  const d1 = phaseData[1] || {};
  const visionFact = facts.find(f => f.id === "FACT-FOUNDER-VISION")?.statement?.replace("دیدگاه و هویت بنیان‌گذار: ", "");
  const founderVision = d1.diagnosticVision || visionFact || "تمرکز بر ارزش اصیل خدمت، تمایز کیفی و اعتمادسازی عمیق در بازار";

  const taxonomyId = ctx?.taxonomyId || (typeof d1.descriptionValue === "string" && d1.descriptionValue.startsWith("BT-") ? d1.descriptionValue : "BT-0001");
  const taxonomyTitleFa = ctx?.taxonomyTitleFa || d1.description || "کسب‌وکار تخصصی";
  const iranianGuildCode = ctx?.iranianGuildCode || "صنف عمومی استاندارد";

  const all15Axes = [
    `صنف: ${taxonomyId} (${taxonomyTitleFa})`,
    `کد اصناف: ${iranianGuildCode}`,
    `مشتری: ${ctx?.customerModel || "B2C"}`,
    `نوع پیشنهاد: ${ctx?.offerType || "SERVICE"}`,
    `کانال توزیع: ${ctx?.channelModel || "PHYSICAL_FIRST"}`,
    `مدل درآمد: ${ctx?.revenueModel || "TRANSACTIONAL"}`,
    `مرحله بلوغ: ${ctx?.maturity || "EARLY_STAGE"}`,
    `مقیاس: ${ctx?.scale || "MICRO"}`,
    `حرکت فروش: ${ctx?.salesMotion || "CONSULTATIVE"}`,
    `قلمرو جغرافیا: ${ctx?.geography || d1.geography || "محلی"}`,
    `ساختار شعب: ${ctx?.branchStructure || "SINGLE_LOCATION"}`,
    `نقش بنیان‌گذار: ${ctx?.founderRole || "OPERATOR"}`,
    `چرخه خرید: ${ctx?.purchaseCycle || "SHORT_DAYS"}`,
    `مدل رابطه: ${ctx?.relationshipModel || "REPEAT_HABITUAL"}`,
    `پروفایل مقرراتی: ${ctx?.regulatoryProfile || "STANDARD_LOCAL_GUILD"}`
  ];

  return {
    founderVision,
    taxonomyId,
    taxonomyTitleFa,
    iranianGuildCode,
    all15Axes
  };
}

function getFactFindingChecklistItems(phaseNum, unknowns = []) {
  const pNum = typeof phaseNum === "number" ? phaseNum : parseInt(phaseNum, 10);
  const matched = unknowns.filter(u => !pNum || u.phase === pNum);
  const targetList = matched.length > 0 ? matched : (pNum === 1 ? unknowns : []);

  if (!targetList || targetList.length === 0) {
    return [
      "🔍 پایش مستمر فرضیات عملیاتی و صحه‌گذاری میدانی سنجه‌ها پیش از ورود به فاز بعدی."
    ];
  }

  return targetList.map(u => {
    const catLabel = u.unknownCategory || "مجهول رسمی";
    const qLabel = u.question || "متغیر ناشناخته";
    const act = u.actionItem || "ثبت دقیق داده‌های میدانی و اجرای آزمون ۳۰ روزه";
    return `🔍 اقدام حقیقت‌یابی مجهول رسمی (${u.id} - ${catLabel}): ${act} در خصوص «${qLabel}»`;
  });
}

function getUnmeasuredMetricsInfo(phaseNum, unknowns = [], phaseData = {}) {
  const pNum = typeof phaseNum === "number" ? phaseNum : parseInt(phaseNum, 10);
  const phaseUnknowns = unknowns.filter(u => !pNum || u.phase === pNum);
  const hasUnmeasured = phaseUnknowns.length > 0 || unknowns.some(u => u.unknownCategory === "UNMEASURED_TIMING" || u.unknownCategory === "UNCERTAINTY");

  return {
    hasUnmeasured,
    unmeasuredTag: "[فرضیه نیازمند تست - مجهول رسمی]",
    unknownList: phaseUnknowns.length > 0 ? phaseUnknowns : unknowns
  };
}

// ----------------------------------------------------------------------------
// PHASE 1: BUSINESS FOUNDATION PROFILE (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase1Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const arch = ctx?.archetypeTitle || "کسب‌وکار تخصصی";
  const offer = d1.coreOffer || "خدمات و محصولات تخصصی";
  const desc = d1.description || "فعالیت تجاری";
  const goal = d1.primaryGoal || "توسعه پایدار و مشتریان وفادار";
  const geo = d1.geography || "محلی و منطقه‌ای";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(1, unknowns, phaseData);

  return {
    title: "شناسنامه بنیاد کسب‌وکار و اقتصاد واحد (Business Foundation Engine)",
    phase: "فاز ۱ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 1,
    date: dateStr,
    sections: [
      {
        id: "P1_SEC_1",
        title: "۱. لایه ورودی: نقطه شروع صفر، داده‌های پایه و پیش‌نیازها (Starting Point & Baseline)",
        type: "snapshot",
        content: {
          "صنف و رسته کاری": desc,
          "آرکی‌تایپ بافتار کسب‌وکار": arch,
          "شناسه صنف (BT)": profile.taxonomyId,
          "کد رسته و شناسه روتینگ (BT-ISIC)": `${profile.taxonomyId} (${profile.taxonomyTitleFa})`,
          "کد نظام صنفی ایران": profile.iranianGuildCode,
          "دیدگاه و هویت بنیان‌گذار (Diagnostic Probing)": profile.founderVision,
          "دیدگاه محوری کارآفرین": profile.founderVision,
          "۱۵ محور بافتار کسب‌وکار": profile.all15Axes,
          "پیشنهاد محوری (Core Offer)": offer,
          "مدل درآمد و فروش": ctx?.revenueModel || "فروش تراکنشی مستقیم با حاشیه ناخالص کنترل‌شده",
          "دامنه نفوذ جغرافیایی": geo,
          "هدف کلیدی ۱۲ ماهه": goal,
          "هدف ملموس کوتاه‌مدت": goal,
          "اقتصاد واحد (Unit Economics)": d1.unitEconomics || "تثبیت حاشیه مشارکت و کنترل هزینه‌های ثابت"
        },
        items: [
          `کد استاندارد صنف: ${profile.taxonomyId} — کد نظام صنفی ایران: ${profile.iranianGuildCode}`,
          `دیدگاه و تمایز محوری بنیان‌گذار: «${profile.founderVision}»`,
          "احراز هویت صنفی و استقرار الزامات اولیه پایانه فروشگاهی متصل به سامانه مودیان.",
          "تثبیت حداقل سرمایه در گردش برای پوشش ۹۰ روز هزینه‌های ثابت بدون نیاز به وام پربهره.",
          "تطبیق کامل مدل عملیاتی با ۱۵ محور مستقل روتر کسب‌وکار بدون تقلیل به یک برچسب تک‌بعدی."
        ]
      },
      {
        id: "P1_SEC_2",
        title: "۲. لایه الگوریتم: درخت تصمیم‌گیری و مسیر گام‌به‌گام حل مسئله (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: استخراج ظرفیت فیزیکی/ساعتی و سقف سرویس‌دهی روزانه]
       │
       ▼
[گام ۱: تفکیک دقیق هزینه‌های ثابت ماهانه (اجاره، حقوق پایه، بیمه) از متغیر (مواد، کمیسیون)]
       │
       ▼
[گام ۲: محاسبه حاشیه مشارکت هر واحد: Contribution Margin = Price - VariableCost]
       │
       ▼
[گام ۳: محاسبه نقطه سربه‌سر تعدادی: BreakEven = FixedCosts / ContributionMargin]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[اگر ظرفیت عملیاتی < نقطه سربه‌سر]             [اگر ظرفیت عملیاتی >= ۱.۵ برابر نقطه سربه‌سر]
    │                                                   │
[اقدام: افزایش قیمت، بازنگری اجاره یا اصلاح منو]        [وضعیت سبز: هدایت مشتریان به ساعات خلوت (Off-Peak)]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
                 [ورود به گیت ارزیابی فاز ۲]`,
        items: [
          "گام ۱: ثبت دقیق تمام ورودی‌های مالی و بستن منافذ پرت هزینه‌های متغیر.",
          "گام ۲: اجرای استراتژی تعدیل صف در ساعات اوج برای جلوگیری از خستگی پرسنل و افت کیفیت."
        ]
      },
      {
        id: "P1_SEC_3",
        title: "۳. لایه چک‌لیست: برنامه اقدام عملیاتی زمان‌بندی‌شده (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): ثبت کلیه فاکتورهای ورودی و خروجی در سیستم حسابداری روزانه تا ساعت ۲۲.",
          "روزانه (صف): کنترل انبار مواد مصرفی و تطبیق موجودی فیزیکی با سیستم جهت مهار کسری.",
          "هفتگی (سرپرستی): محاسبه نسبت اشغال ظرفیت و شناسایی روزهای کم‌بازده جهت اعمال آفر ویژه.",
          "هفتگی (سرپرستی): بازبینی عملکرد پرسنل و ارزیابی زمان میانگین پاسخگویی و تحویل سفارش.",
          "ماهانه (مدیریت): تحلیل صورت سود و زیان (P&L)، کنترل حاشیه سود ناخالص و انطباق با تکالیف مالیاتی.",
          ...getFactFindingChecklistItems(1, unknowns)
        ]
      },
      {
        id: "P1_SEC_4",
        title: "۴. لایه فرمول‌ها: معادلات محاسباتی و آستانه‌های سنجه‌ها (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "نقطه سربه‌سر (BEP)", formula: "Fixed_Costs / (Unit_Price - Variable_Cost)", description: "حداقل تعداد سفارش ماهانه برای جبران هزینه‌ها" },
          { name: "نرخ اشغال ظرفیت (CUR)", formula: "(Actual_Hours_Served / Total_Available_Hours) * 100", description: "بهره‌وری عملیاتی تجهیزات و پرسنل" },
          { name: "نسبت ارزش به جذب (LTV/CAC)", formula: "Customer_Lifetime_Value / Customer_Acquisition_Cost", description: "پایداری اقتصادی رشد" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "سنجه‌های اندازه‌گیری‌نشده مالی و بهره‌وری",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "به علت عدم وجود آمار ثبت‌شده تاریخی، این ارقام به عنوان فرضیه در دوره پایلوت ۳۰ روزه اندازه‌گیری می‌شوند و هیچ عدد ساختگی به سیستم تحمیل نمی‌شود."
          }] : [])
        ],
        kpis: [
          { metric: "حاشیه سود ناخالص (Gross Margin)", formula: "(Revenue - COGS) / Revenue", green: ">= 45%", yellow: "30% - 44%", red: "< 30%" },
          { metric: "نرخ اشغال ظرفیت ساعتی", formula: "Actual / Available Hours", green: "70% - 85%", yellow: "50% - 69%", red: "< 50% یا > 95% (فرسودگی)" },
          { metric: "نسبت LTV به CAC", formula: "LTV / CAC", green: unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی] (آستانه هدف: >= 3.0)" : ">= 3.0", yellow: "1.5 - 2.9", red: "< 1.5 (زیان‌ده)" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت سنجه‌های کمی و مالی",
            formula: "پایش روزانه فاکتورها",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های ناقص یا تخمینی",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P1_SEC_5",
        title: "۵. لایه خاتمه: گیت تایید عبور به فاز ۲ و وتو تریگرها (Readiness Gate 1)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۱": unmeasured.hasUnmeasured ? "تایید مشروط با ثبت مجهولات رسمی و فرضیات مصوب" : "تایید رسمی و قفل بنیاد کسب‌وکار",
          "سند تحویلی (Handoff Artifact)": "پروفایل اقتصاد واحد مصوب همراه با ظرفیت عملیاتی تثبیت‌شده",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی متغیرهای پایه اندازه‌گیری شده‌اند.",
          "شرط وتوی عبور": "در صورتی که کسب‌وکار در نقطه سربه‌سر زیان‌ده باشد یا حاشیه سود متغیر منفی داشته باشد، پیشروی متوقف می‌شود."
        },
        items: [
          "تایید قطعی اقتصاد واحد و پرهیز از سرمایه‌گذاری زودهنگام در تبلیغات بدون توجیه مالی.",
          "تعیین دقیق محدوده جغرافیایی و پیشنهاد محوری به عنوان ورودی اصلی تحقیقات بازار و سنجش رقبا در فاز ۲.",
          unmeasured.hasUnmeasured 
            ? "کلیه سنجه‌های فاقد آمار صراحتاً با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند تا از تحمیل ارقام توخالی جلوگیری شود."
            : "اعتبارسنجی اولیه بدون مغایرت انجام شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 2: MARKET & CUSTOMER INTELLIGENCE REPORT (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase2Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const d2 = phaseData[2] || {};
  const competitors = d2.competitors || "رقبای سنتی و خدمات‌دهندگان پراکنده محلی";
  const pain = d2.customerPain || "معطلی زیاد، افت کیفیت در تکرار و فقدان شفافیت";
  const pricing = d2.pricingModel || "قیمت‌گذاری منصفانه با پکیج‌های ارزش افزوده";
  const opp = d2.goldenOpportunity || "سرعت عمل، تضمین کیفیت واقعی و شفافیت کامل فاکتور";
  const offer = d1.coreOffer || "ارائه خدمات تخصصی";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(2, unknowns, phaseData);

  return {
    title: "گزارش هوش بازار، تحلیل رقبا و کشش تقاضا (Market Intelligence Engine)",
    phase: "فاز ۲ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 2,
    date: dateStr,
    sections: [
      {
        id: "P2_SEC_1",
        title: "۱. لایه ورودی: شواهد میدانی رقبا و وظایف مشتری (Starting Point & JTBD)",
        type: "snapshot",
        content: {
          "آرایش رقبای مستقیم در بازار": competitors,
          "اصلی‌ترین درد و اصطکاک مشتری (Friction Point)": pain,
          "وظیفه کارکردی مورد انتظار (Functional Job)": `انجام بی‌نقص ${offer} بدون اتلاف وقت و بدون هزینه‌تراشی پنهان`,
          "مدل بهینه ارزش‌گذاری و پرداخت": pricing,
          "فرصت طلایی تمایز کشف‌شده": opp,
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه هدایتگر بنیان‌گذار": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — مبنای کشف فرصت طلایی تمایز.`,
          "واکاوی گزینه‌های جایگزین مشتری در صورت عدم خرید و علل ریزش از رقبای سنتی.",
          "ارزیابی کشش قیمتی و سقف پذیرش هزینه در مقایسه با نرخ تورم صنف."
        ]
      },
      {
        id: "P2_SEC_2",
        title: "۲. لایه الگوریتم: فرآیند کشف تمایز و خروج از جنگ قیمت (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: گردآوری شکایات و نظرات ۱ تا ۳ ستاره رقبای صنف در نقشه و اینستاگرام]
       │
       ▼
[گام ۱: دسته‌بندی دردها به سه دسته: تاخیر زمانی، ابهام در هزینه، برخورد غیرحرفه‌ای]
       │
       ▼
[گام ۲: اجرای مدل حساسیت قیمت ون وستندورپ (PSM) جهت تعیین بازه بهینه قیمت]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[کشش قیمتی بالا: بازار حساس به قیمت]          [کشش قیمتی پایین: خریداران کیفیت‌محور]
    │                                                   │
[اقدام: طراحی پکیج اقتصادی + خدمات مکمل اختیاری]       [اقدام: گارانتی قطعی + استاندارد VIP با حاشیه بالا]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
             [مهندسی فرصت طلایی و ورود به گیت استراتژی فاز ۳]`,
        items: [
          "تحلیل نقاط ضعف عملیاتی رقبا و تبدیل آن به تعهدات قطعی و تبلیغاتی برند.",
          "تعیین ساختار پکیج‌های درآمدی بر پایه لنگراندازی قیمتی در ذهن مخاطب."
        ]
      },
      {
        id: "P2_SEC_3",
        title: "۳. چک‌لیست عملیاتی: پژوهش میدانی و رصد هفتگی بازار (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): یادداشت کوتاه علت نارضایتی یا سوال پرتکرار حداقل ۳ مشتری حین تسویه حساب.",
          "هفتگی (سرپرستی): رصد قیمت‌ها و تغییرات کمپین ۳ رقیب اصلی در منطقه/پلتفرم‌های آنلاین.",
          "هفتگی (سرپرستی): پایش نظرات جدید ثبت‌شده در بلد، نشان و Google Maps برای خود و رقبا.",
          "ماهانه (مدیریت): بازبینی ماتریس رقبا و تطبیق سبد خدمات با نیازهای نوظهور فصلی مشتریان.",
          "ماهانه (مدیریت): تحلیل درصد مشتریانی که به علت معرفی دهان‌به‌دهان مراجعه کرده‌اند.",
          ...getFactFindingChecklistItems(2, unknowns)
        ]
      },
      {
        id: "P2_SEC_4",
        title: "۴. لایه فرمول‌ها: سنجه‌های رقابتی و کشش تقاضا (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "ضریب کشش تقاضا (Ed)", formula: "(% Delta Quantity) / (% Delta Price)", description: "میزان حساسیت حجم فروش به تغییرات قیمت" },
          { name: "شاخص خالص مروجان (NPS)", formula: "% Promoters (Score 9-10) - % Detractors (Score 0-6)", description: "پتانسیل رشد ارگانیک و وفاداری" },
          { name: "نرخ سهم بازار محلی (Local SOM)", formula: "(Monthly Active Clients / Total Target Households) * 100", description: "میزان نفوذ جغرافیایی" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "سنجه‌های اندازه‌گیری‌نشده هوش بازار",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "به علت عدم سنجش آماری تا این مرحله، ضرایب کشش در فاز آزمایشی ۳۰ روزه اعتبارسنجی می‌شوند."
          }] : [])
        ],
        kpis: [
          { metric: "شاخص خالص ترویج (NPS)", formula: "Promoters - Detractors", green: ">= +50", yellow: "+20 تا +49", red: "< +20" },
          { metric: "نرخ ریزش مشتری (Churn Rate)", formula: "Lost Clients / Starting Clients", green: "< 5% ماهانه", yellow: "5% - 12%", red: "> 12%" },
          { metric: "مازاد ارزش ادراک‌شده (PVI)", formula: "Perceived Value / Nominal Price", green: ">= 2.0", yellow: "1.2 - 1.9", red: "< 1.2 (ریسک مهاجرت)" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت شواهد کمی بازار",
            formula: "پایش نظرات و ارقام",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P2_SEC_5",
        title: "۵. لایه خاتمه: گیت تایید شواهد و تحویل به استراتژی (Readiness Gate 2)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۲": unmeasured.hasUnmeasured ? "شواهد هوش بازار تایید مشروط با فرضیات مصوب" : "شواهد هوش بازار تایید و قفل شد",
          "سند تحویلی (Handoff Artifact)": "گزارش ماتریس رقبا و فرصت طلایی تمایز",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی شواهد رقابتی مستند گردید.",
          "شرط وتوی عبور": "اگر مزیت اعلامی کپی مستقیم رقیب اصلی باشد یا کشش تقاضا برآورد نشده باشد، ورود به فاز ۳ ممنوع است."
        },
        items: [
          "شواهد هوش بازار اثبات کرد مشتریان حاضر به بازگشت منظم هستند مشروط بر ثبات ۱۰۰٪ کیفیت.",
          "فرصت طلایی تمایز مستقیماً به عنوان زیربنای تدوین بیانیه انحصار زاگ در فاز ۳ تحویل گردید.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "صحت داده‌های رقابتی تایید شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 3: BRAND STRATEGY FOUNDATION (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase3Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const d2 = phaseData[2] || {};
  const d3 = phaseData[3] || {};
  const target = d3.targetSegment || "مشتریان کیفیت‌محور که به وقت و نظم بها می‌دهند";
  const pos = d3.positioning || "سریع‌ترین و مطمئن‌ترین انتخاب با ضمانت ۱۰۰٪ رضایت";
  const boundary = d3.boundary || "عدم استفاده از مواد نامرغوب و پرهیز از تخفیف‌های آسیب‌زننده به کیفیت";
  const promise = d3.promise || "تحویل کار بی‌نقص در زمان تعیین‌شده همراه با احترام کامل";
  const offer = d1.coreOffer || "خدمات تخصصی";
  const opp = d2.goldenOpportunity || "سرعت، کیفیت تضمین‌شده و شفافیت";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(3, unknowns, phaseData);

  return {
    title: "بنیاد استراتژی، جایگاه‌یابی و بیانیه انحصار (Brand Strategy Engine)",
    phase: "فاز ۳ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 3,
    date: dateStr,
    sections: [
      {
        id: "P3_SEC_1",
        title: "۱. لایه ورودی: پرسونای هدف و بیانیه رسمی انحصار (Starting Point & Zag Only-ness)",
        type: "snapshot",
        content: {
          "مشتری ایده‌آل کانونی (Core ICP)": target,
          "بیانیه رسمی انحصار (Zag Statement)": `برند ما تنها ارائه دهنده ${offer} در این محدوده است که با تکیه بر ${opp}، به ${target} آرامش خیال و نتیجه تضمین‌شده می‌دهد.`,
          "ستون تمایز بنیادین (Radical Differentiator)": pos,
          "خط قرمز و مرز استراتژیک": boundary,
          "وعده تخلف‌ناپذیر برند (Unbreakable Promise)": promise,
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — مبنای خطوط قرمز و جایگاه‌یابی.`,
          "تعیین دقیق پرسونای ضدهدف (کسانی که منحصراً دنبال ارزان‌ترین کار هستند و مشتری ما نیستند).",
          "قفل کردن ارزش پیشنهادی یکتا (Unique Value Proposition) منطبق بر بوم استراتژایزر."
        ]
      },
      {
        id: "P3_SEC_2",
        title: "۲. لایه الگوریتم: اعتبارسنجی انحصار و محافظت از جایگاه رقابتی (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: ارزیابی بیانیه انحصار با آزمون ۱۷ مرحله‌ای زاگ مارتی نئومایر]
       │
       ▼
[گام ۱: آیا رقبای منطقه می‌توانند عیناً همین ادعا را مطرح کنند؟]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[بله: ادعا عمومی و شعاری است]                 [خیر: ادعا انحصاری و اثبات‌پذیر است]
    │                                                   │
[اقدام: بازتعریف مزیت تا دستیابی به تمایز قطعی]      [اقدام: تثبیت ارکان سه‌گانه ادله اثبات (RTB)]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
          [گام ۲: تدوین خطوط قرمز عدم سازش و وتوی تخفیف‌های نامتعارف]
                                 │
                                 ▼
                     [ورود به گیت هویت فاز ۴]`,
        items: [
          "اجرای آزمون جایگزینی کلمات: اگر نام برند حذف شود، آیا مشتری فوراً متوجه تمایز ما می‌شود؟",
          "ایجاد سپر محافظتی در برابر جنگ قیمت رقبا از طریق ارتقای ارزش خدمات و نه کاهش تعرفه‌ها."
        ]
      },
      {
        id: "P3_SEC_3",
        title: "۳. چک‌لیست عملیاتی: تعهد به وعده و نظارت بر خطوط قرمز (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): تعهد ۱۰۰٪ به تحویل به موقع کار و اطلاع‌رسانی پیش‌دستانه در صورت هرگونه تاخیر احتمالی.",
          "روزانه (صف): امتناع از پذیرش سفارشی که با خطوط قرمز کیفیت (مانند قطعه نامرغوب مشتری) مغایرت دارد.",
          "هفتگی (سرپرستی): بررسی موارد شکایت یا مرجوعی و ریشه‌یابی مغایرت با وعده برند.",
          "هفتگی (سرپرستی): برگزاری جلسه ۵ دقیقه‌ای با پرسنل صف برای یادآوری ارزش کلیدی تمایز.",
          "ماهانه (مدیریت): کنترل نرخ پایبندی به قیمت‌های مصوب و ممانعت از ارائه‌های تخفیفی خودسرانه.",
          ...getFactFindingChecklistItems(3, unknowns)
        ]
      },
      {
        id: "P3_SEC_4",
        title: "۴. لایه فرمول‌ها: شاخص انحصار و وفاداری به جایگاه برند (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "شاخص انحصار زاگ (Zag Score)", formula: "(Unique Attributes Count / Category Generic Attributes) * 100", description: "درجه رادیکال بودن تمایز" },
          { name: "نرخ پایبندی به وعده (Promise Delivery Rate)", formula: "(Orders with Zero Promised Violations / Total Orders) * 100", description: "صداقت عملیاتی برند" },
          { name: "پرمیوم قیمتی قابل تحمل (Price Premium Tolerated)", formula: "((Our Price - Competitor Price) / Competitor Price) * 100", description: "قدرت برند در بازار" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "شاخص‌های اندازه‌گیری‌نشده تمایز و وفاداری",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "آستانه‌های وفاداری در ۳۰ روز نخست فعالیت به عنوان فرضیه ارزیابی می‌شوند."
          }] : [])
        ],
        kpis: [
          { metric: "نرخ وفاداری به وعده برند", formula: "On-Time & Zero-Defect Orders", green: ">= 98%", yellow: "92% - 97%", red: "< 92%" },
          { metric: "شاخص تمایز زاگ", formula: "Zag 17-Point Audit", green: ">= 14 تیک تایید", yellow: "10 - 13 تیک", red: "< 10 (افتادن در شباهت)" },
          { metric: "سهم فروش بدون تخفیف", formula: "Full-Price Sales Ratio", green: ">= 90%", yellow: "75% - 89%", red: "< 75% (خطر اعتیاد به آفر)" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت شواهد وفاداری و وعده",
            formula: "پایش بازخورد مشتریان",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P3_SEC_5",
        title: "۵. لایه خاتمه: گیت تصویب استراتژی و تحویل به هویت برند (Readiness Gate 3)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۳": unmeasured.hasUnmeasured ? "استراتژی و وعده برند مصوب مشروط با فرضیات ثبت‌شده" : "استراتژی و وعده برند مصوب و قفل شد",
          "سند تحویلی (Handoff Artifact)": "سند بنیاد استراتژی، بیانیه زاگ و خطوط قرمز عملیاتی",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی تعهدات استراتژیک مدون گردید.",
          "شرط وتوی عبور": "اگر بیانیه انحصار توسط رقبای بازار قابل ادعا باشد، اجازه ورود به فاز ۴ داده نمی‌شود."
        },
        items: [
          "وعده برند مصوب شد و تمامی فرآیندهای عملیاتی موظف به همراستایی با آن شدند.",
          "سند استراتژی به عنوان جهت‌نمای انتخاب کهن‌الگو و کاراکتر به فاز ۴ تحویل گردید.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "انحصار استراتژیک احراز گردید."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 4: BRAND IDENTITY & CHARACTER (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase4Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const d4 = phaseData[4] || {};
  const arch = d4.archetype || "رفیق کاربلد و امین (Everyman / Sage)";
  const traits = d4.traits || "صداقت، دقت فنی، خوش‌قولی و برخورد محترمانه";
  const shadow = d4.shadowTrap || "پرهیز از صمیمیت لوس یا رفتارهای خارج از نزاکت کاری";
  const role = d4.relationalRole || "راهنمای دلسوز و متخصص مطمئن در کنار مشتری";
  const offer = d1.coreOffer || "خدمات تخصصی";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(4, unknowns, phaseData);

  return {
    title: "معماری هویت، کهن‌الگو و روح انسانی برند (Brand Character Engine)",
    phase: "فاز ۴ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 4,
    date: dateStr,
    sections: [
      {
        id: "P4_SEC_1",
        title: "۱. لایه ورودی: کهن‌الگوی کانونی و صفات شخصیتی (Starting Point & Archetype)",
        type: "snapshot",
        content: {
          "کهن‌الگوی اصلی برند (Primary Archetype)": arch,
          "نقش ارتباطی با مشتری (Relational Role)": role,
          "ویژگی‌های شخصیتی متمایز": traits,
          "تله سایه شخصیتی (Shadow Trap)": shadow,
          "ماتریس عاطفی برند": "ایجاد احساس امنیت، حس تکریم و اعتماد پایدار در مخاطب",
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — مبنای تعامل و اصول رفتاری.`,
          "انطباق کهن‌الگو با ماتریس ۴ ربعی مارک و پیرسون بر پایه نیاز مشتری به اطمینان و همراهی.",
          "تبدیل کهن‌الگو به اصول رفتاری مدون برای تمام پرسنل دارای تعامل مستقیم با مشتری."
        ]
      },
      {
        id: "P4_SEC_2",
        title: "۲. لایه الگوریتم: درخت تصمیم رفتاری و پیشگیری از تله‌های سایه (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: مواجهه پرسنل صف با مشتری در بدو ورود]
       │
       ▼
[گام ۱: اجرای قانون ۳ ثانیه — لبخند، سلام گرم و ارتباط چشمی بدون معطلی]
       │
       ▼
[گام ۲: کشف نیاز مشتری با لحن کهن‌الگو: شنیدن فعال بدون قطع کلام]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[خطر تله سایه رفیق: لودگی یا بی‌نظمی]         [خطر تله سایه متخصص: غرور و تحقیر مشتری]
    │                                                   │
[اقدام: حفظ حرمت کاری و استانداردهای حرفه‌ای]         [اقدام: توضیح به زبان ساده و قابل فهم برای عموم]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
                     [ورود به گیت هویت کلامی فاز ۵]`,
        items: [
          "قانون ۳ ثانیه‌ای ارتباط اولیه: هیچ مشتری نباید بیش از ۳ ثانیه بدون احوالپرسی محترمانه بلاتکلیف بماند.",
          "مدل‌سازی کاراکتر برند در مکالمات تلفنی، پیامکی و برخورد حضوری."
        ]
      },
      {
        id: "P4_SEC_3",
        title: "۳. چک‌لیست عملیاتی: پروتکل رفتاری پرسنل و ممیزی صوتی-تصویری (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): رعایت آراستگی کامل یونیفرم و رعایت حریم شخصی و محترمانه مشتری.",
          "روزانه (صف): پرهیز قطعی از بگومگو یا مجادله لفظی در فضای عمومی حضور مشتریان.",
          "هفتگی (سرپرستی): گوش دادن تصادفی به مکالمات تلفنی و بررسی پیامک‌های ارسالی با لحن برند.",
          "هفتگی (سرپرستی): قدردانی و پاداش به همکاری که بهترین تجلی صفات کهن‌الگو را داشته است.",
          "ماهانه (مدیریت): برگزاری کارگاه بازآموزی آداب مشتری‌مداری و اصول شخصیتی برند برای پرسنل جدید.",
          ...getFactFindingChecklistItems(4, unknowns)
        ]
      },
      {
        id: "P4_SEC_4",
        title: "۴. لایه فرمول‌ها: شاخص انطباق شخصیتی و رضایت تجربی (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "شاخص تجانس کهن‌الگو (Archetype Alignment Index)", formula: "(Audited Behaviors Matching Brand Voice / Total Audited Touchpoints) * 100", description: "درصد هماهنگی رفتار پرسنل با شخصیت مصوب" },
          { name: "شاخص رضایت تعاملی (CSAT Touchpoint)", formula: "(Positive Emotional Ratings / Total Ratings) * 100", description: "حس مشتری از نحوه برخورد" },
          { name: "شاخص شکایت رفتاری (Behavioral Complaint Rate)", formula: "(Staff Attitude Complaints / Total Served Clients) * 100", description: "سیگنال هشدار لغزش شخصیتی" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "شاخص‌های رفتاری اندازه‌گیری‌نشده پرسنل",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "به علت عدم ممیزی رفتاری قبلی، انطباق با کهن‌الگو در فاز اول به عنوان فرضیه ارزیابی می‌شود."
          }] : [])
        ],
        kpis: [
          { metric: "شاخص تجانس رفتار با کهن‌الگو", formula: "Audited Touchpoints", green: ">= 95%", yellow: "85% - 94%", red: "< 85%" },
          { metric: "شاخص رضایت تعاملی (CSAT)", formula: "Post-Service Rating", green: ">= 94%", yellow: "85% - 93%", red: "< 85%" },
          { metric: "نرخ شکایت رفتاری پرسنل", formula: "Attitude Complaints", green: "0%", yellow: "زیر ۱ مورد در ماه", red: ">= ۲ مورد در ماه (بحران)" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت شواهد رفتاری",
            formula: "ممیزی تعامل پرسنل صف",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P4_SEC_5",
        title: "۵. لایه خاتمه: گیت تایید کاراکتر و تحویل به سیستم کلامی (Readiness Gate 4)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۴": unmeasured.hasUnmeasured ? "هویت و کهن‌الگوی انسانی برند مصوب مشروط با فرضیات ثبت‌شده" : "هویت و کهن‌الگوی انسانی برند مصوب شد",
          "سند تحویلی (Handoff Artifact)": "شناسنامه کاراکتر برند و پروتکل رفتاری پرسنل صف",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "شخصیت و رفتار پرسنل تدوین گردید.",
          "شرط وتوی عبور": "در صورت عدم تعریف دقیق تله‌های سایه و مرزهای رفتاری، عبور به فاز ۵ مجاز نیست."
        },
        items: [
          "کهن‌الگوی برند به عنوان زیرساخت تنظیم لحن و گزینش کلمات به فاز ۵ تحویل شد.",
          "پروتکل رفتاری صف جهت درج در آیین‌نامه داخلی شرکت/فروشگاه آماده‌سازی گردید.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "هویت و کاراکتر تایید شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 5: VERBAL IDENTITY & MESSAGING SYSTEM (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase5Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const d3 = phaseData[3] || {};
  const d5 = phaseData[5] || {};
  const style = d5.voiceStyle || "محترمانه، صمیمی، شفاف و بدون غلو";
  const hook = d5.elevatorHook || "حل مستقیم درد مشتری در ۳۰ ثانیه با گارانتی قطعی";
  const tone = d5.toneMatrix || "رسمی و استوار در قراردادها، صمیمی و پرانرژی در مکالمات حضوری";
  const forbidden = d5.forbiddenWords || "کلمات غیرقابل اثبات مثل: بی‌نظیر، ارزان‌ترین، فوق‌العاده";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(5, unknowns, phaseData);

  return {
    title: "سیستم هویت کلامی، مهندسی پیام و پیچ آسانسوری (Verbal Identity Engine)",
    phase: "فاز ۵ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 5,
    date: dateStr,
    sections: [
      {
        id: "P5_SEC_1",
        title: "۱. لایه ورودی: سبک کلام، قلاب آسانسوری و واژگان مجاز (Starting Point & Hook)",
        type: "snapshot",
        content: {
          "سبک لحن کلامی (Brand Voice)": style,
          "قلاب معرفی ۳۰ ثانیه‌ای (Elevator Hook)": hook,
          "ماتریس تغییر لحن در شرایط مختلف": tone,
          "واژگان ممنوعه و قرمز (Forbidden Words)": forbidden,
          "واژگان کانونی و ترجیحی": "شفاف، دقیق، تضمین‌شده، به وقت، همراه شما",
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — مبنای گزینش لحن و کلمات کلیدی.`,
          "مهندسی پیام محوری بر پایه فریم‌ورک استوری‌برند (StoryBrand) دونالد میلر.",
          "تدوین متون پاسخ به پیامک‌ها، دایرکت‌ها و ارتباطات تلفنی بر مبنای لحن مصوب."
        ]
      },
      {
        id: "P5_SEC_2",
        title: "۲. لایه الگوریتم: مهندسی روایت و حل اختلاف کلامی (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: روایت داستان برند بر پایه ساختار ۷ مرحله‌ای استوری‌برند میلر]
       │
       ▼
[مشتری قهرمان داستان است -> با یک درد کلافه‌کننده روبروست]
       │
       ▼
[برند ما به عنوان راهنمای امین (همدلی + شایستگی فنی) وارد می‌شود]
       │
       ▼
[ارائه برنامه ساده ۳ مرحله‌ای: ۱. تماس یا مراجعه، ۲. انجام کار با گارانتی، ۳. آرامش خیال]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[سناریوی عادی: مکالمه فروش یا جذب]             [سناریوی مشتری ناراضی یا شاکی]
    │                                                   │
[بیان قلاب ۳۰ ثانیه‌ای و فراخوان مستقیم CTA]          [پروتکل ۳ مرحله‌ای آرام‌سازی: شنیدن + پذیرش + جبران فوری]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
                     [ورود به گیت نام‌گذاری فاز ۶]`,
        items: [
          "فرمول قلاب ۳۰ ثانیه‌ای: [بیان درد ملموس مخاطب] + [راهکار انحصاری بدون معطلی] + [ضمانت قطعی].",
          "دستورالعمل صفر مجادله: پذیرش مسئولیت هرگونه خطای احتمالی پیش از هرگونه توجیه فنی."
        ]
      },
      {
        id: "P5_SEC_3",
        title: "۳. چک‌لیست عملیاتی: تمپلیت‌های پیام‌رسانی و ویرایش متون (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): استفاده از تمپلیت تایید سفارش و پیامک یادآوری زمان تحویل با لحن رسمی-صمیمی.",
          "روزانه (صف): بازبینی پیام‌ها قبل از ارسال و حذف هرگونه اصطلاح عامیانه نامناسب یا شعار خالی.",
          "هفتگی (سرپرستی): ارزیابی کیفیت پاسخگویی در شبکه‌های اجتماعی و زمان پاسخ اولیه (زیر ۱۰ دقیقه).",
          "هفتگی (سرپرستی): به‌روزرسانی بانک سوالات متداول (FAQ) و درج پاسخ‌های استاندارد.",
          "ماهانه (مدیریت): ممیزی تمامی بروشورها، بنرها و پست‌ها بر اساس کتابچه هویت کلامی.",
          ...getFactFindingChecklistItems(5, unknowns)
        ]
      },
      {
        id: "P5_SEC_4",
        title: "۴. لایه فرمول‌ها: نرخ نفوذ پیام و تبدیل قلاب کلامی (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "نرخ تبدیل قلاب کلامی (Hook-to-Lead Rate)", formula: "(Qualified Inquiries / Total Hook Impressions) * 100", description: "گیرایی و جذابیت معرفی ۳۰ ثانیه‌ای" },
          { name: "شاخص شفافیت پیام (Message Clarity Index)", formula: "(First-Time Comprehension Responses / Total Surveyed) * 100", description: "سادگی و عدم ابهام پیام" },
          { name: "نرخ حل اختلاف در تماس اول (First Contact Resolution)", formula: "(Resolved Inquiries / Total Inquiries) * 100", description: "سرعت و مهارت ارتباطی" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "شاخص‌های کلامی اندازه‌گیری‌نشده نرخ تبدیل",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "نرخ اثربخشی قلاب ۳۰ ثانیه‌ای در ماه نخست تست خواهد شد."
          }] : [])
        ],
        kpis: [
          { metric: "نرخ تبدیل قلاب ۳۰ ثانیه‌ای", formula: "Qualified Leads / Impressions", green: ">= 18%", yellow: "10% - 17%", red: "< 10%" },
          { metric: "شاخص شفافیت پیام", formula: "Comprehension Rate", green: ">= 90%", yellow: "75% - 89%", red: "< 75% (پیام گنگ است)" },
          { metric: "حل چالش در برخورد اول (FCR)", formula: "Resolved First Touch", green: ">= 85%", yellow: "70% - 84%", red: "< 70%" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت شواهد کلامی",
            formula: "پایش بازخورد قلاب آسانسوری",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P5_SEC_5",
        title: "۵. لایه خاتمه: گیت تصویب کلامی و تحویل به نام‌گذاری (Readiness Gate 5)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۵": unmeasured.hasUnmeasured ? "سیستم هویت کلامی و پیام‌رسانی مصوب مشروط با فرضیات ثبت‌شده" : "سیستم هویت کلامی و پیام‌رسانی قفل شد",
          "سند تحویلی (Handoff Artifact)": "دفترچه لحن کلام، قلاب آسانسوری و بانک پیام‌های استاندارد",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی ساختارهای کلامی تدوین گردید.",
          "شرط وتوی عبور": "اگر پیام حاوی واژگان ممنوعه توخالی یا ساختار مبهم باشد، پیشروی به فاز ۶ متوقف می‌شود."
        },
        items: [
          "دستورالعمل کلامی به عنوان معیار گزینش نام و خلق شعار تبلیغاتی به فاز ۶ تحویل شد.",
          "تمپلیت‌های آماده پاسخگویی در اختیار پرسنل روابط عمومی و فروش قرار گرفت.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "هویت کلامی تایید شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 6: NAMING, TAGLINE & CREATIVE DIRECTION (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase6Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d5 = phaseData[5] || {};
  const d6 = phaseData[6] || {};
  const name = d6.naming || "نام برند مصوب";
  const tagline = d6.tagline || "شعار رسمی و متعهد به نتیجه";
  const rational = d6.creativeRational || "ریشه‌شناسی، سادگی تلفظ و تداعی مثبت ذهنی";
  const check = d6.legalCheck || "استعلام اولیه در طبقات مرتبط و ثبت دامنه و شبکه‌ها";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(6, unknowns, phaseData);

  return {
    title: "سند استراتژی نام‌گذاری، شعار و جهت‌گیری خلاقانه (Naming & Creative Engine)",
    phase: "فاز ۶ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 6,
    date: dateStr,
    sections: [
      {
        id: "P6_SEC_1",
        title: "۱. لایه ورودی: نام نهایی، شعار رسمی و توجیه مفهومی (Starting Point & Naming)",
        type: "snapshot",
        content: {
          "نام رسمی برند (Brand Name)": name,
          "شعار رسمی (Official Tagline)": tagline,
          "توجیه ریشه‌شناختی و مفهومی": rational,
          "وضعیت استعلام حقوقی و ثبتی": check,
          "معادل لاتین و تلفظ بین‌المللی": "روان، بدون حروف دوگانه مبهم و خوانش آسان",
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — معیار خلق نام و لحن شعار.`,
          "غربالگری نام در میان ۳۰ تا ۵۰ گزینه و تطبیق با استانداردهای آواشناسی فارسی.",
          "بررسی وضعیت آزاد بودن دامنه‌های اینترنتی و هندل‌های شبکه‌های اجتماعی."
        ]
      },
      {
        id: "P6_SEC_2",
        title: "۲. لایه الگوریتم: فرآیند ۵ مرحله‌ای غربالگری و ایمن‌سازی حقوقی نام (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: گردآوری فهرست گزینه‌های نام بر اساس سبک‌های توصیفی، تداعی‌گر و ترکیبی]
       │
       ▼
[گام ۱: فیلتر زبانی و آوایی — خوش‌آهنگی، عدم تشابه با کلمات رکیک و آسانی دیکته]
       │
       ▼
[گام ۲: استعلام اولیه تضاد در سامانه اداره مالکیت معنوی (طبقات ۳۵، ۳۷ و طبقه اختصاصی)]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[تشابه با علامت ثبت‌شده قبلی > ۵۰٪]           [نبود علامت مشابه در همان طبقه فعالیت]
    │                                                   │
[وتوی حقوقی -> تغییر نام یا اضافه پسوند تمایزبخش]    [استعلام دامنه‌های اینترنتی و شبکه‌های اجتماعی]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
              [تدوین شعار ریتمیک متصل به وعده فاز ۳ و تحویل به فاز ۷]`,
        items: [
          "فیلتر دیکته تک‌گزینه‌ای: نام نباید حروفی مانند (ز، ذ، ض، ظ) یا (س، ث، ص) داشته باشد که سبب نگارش اشتباه شود.",
          "شعار تبلیغاتی باید بازتاب‌دهنده مزیت رادیکال و بیانیه انحصار زاگ باشد."
        ]
      },
      {
        id: "P6_SEC_3",
        title: "۳. چک‌لیست عملیاتی: اقدامات ثبت رسمی و رزرو دارایی‌های دیجیتال (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "فوری: ثبت اظهارنامه علامت تجاری در سامانه مالکیت معنوی از طریق وکیل مجرب علائم تجاری.",
          "فوری: ثبت و رزرو دامنه‌های ملی (.ir) و بین‌المللی (.com) با نام کامل و پیشوندهای رایج.",
          "فوری: ثبت شناسه در اینستاگرام، تلگرام، بله، ایتا، آپارات و لینکدین جهت جلوگیری از جعل نام.",
          "هفتگی: پیگیری کارتابل ثبت اسناد تا زمان انتشار آگهی نوبت اول در روزنامه رسمی کشور.",
          "ماهانه: رصد بازار جهت جلوگیری از استفاده غیرمجاز یا ثبت نام‌های مشابه توسط رقبا.",
          ...getFactFindingChecklistItems(6, unknowns)
        ]
      },
      {
        id: "P6_SEC_4",
        title: "۴. لایه فرمول‌ها: سنجه یادآوری نام و امتیاز اعتبار فنی (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "امتیاز جامع نام (Naming Composite Score)", formula: "Acoustics(25) + Memorability(25) + Legal_Purity(25) + Brand_Fit(25)", description: "سنجش عددی عیار نام برند" },
          { name: "نرخ یادآوری بدون کمک (Unaided Recall Rate)", formula: "(Respondents Naming Brand Spontaneously / Total Sample) * 100", description: "ماندگاری در حافظه بلندمدت" },
          { name: "ضریب آسانی دیکته (Spelling Accuracy Rate)", formula: "(Correct First-Time Searches / Total Attempts) * 100", description: "به حداقل رساندن خطای سرچ" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "شاخص‌های اندازه‌گیری‌نشده یادآوری نام",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "ماندگاری و بازخورد اولیه مخاطبان به عنوان فرضیه در آزمون ۳۰ روزه سنجیده می‌شود."
          }] : [])
        ],
        kpis: [
          { metric: "امتیاز جامع نام‌گذاری", formula: "Composite Technical Score", green: ">= 88 از 100", yellow: "75 - 87", red: "< 75 (رد نام)" },
          { metric: "ضریب آسانی نگارش و دیکته", formula: "Correct Spelling Attempts", green: ">= 92%", yellow: "80% - 91%", red: "< 80% (ابهام املایی)" },
          { metric: "ماندگاری در ذهن (Recall)", formula: "24h Aided Recall Test", green: ">= 70%", yellow: "50% - 69%", red: "< 50%" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ثبت شواهد یادآوری",
            formula: "نظرسنجی میدانی نام و شعار",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P6_SEC_5",
        title: "۵. لایه خاتمه: گیت تایید حقوقی نام و تحویل به سیستم بصری (Readiness Gate 6)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۶": unmeasured.hasUnmeasured ? "نام و شعار رسمی مصوب مشروط با فرضیات ثبت‌شده" : "نام و شعار رسمی تثبیت و قفل شد",
          "سند تحویلی (Handoff Artifact)": "شناسنامه نام، شعار، پرونده استعلام ثبتی و بریف دیزاین بصری",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی تاییدات حقوقی و مفهومی نام نهایی گردید.",
          "شرط وتوی عبور": "در صورت وجود ریسک رد قطعی در اداره مالکیت معنوی، انتقال به فاز ۷ ممنوع است."
        },
        items: [
          "نام رسمی و تاییدیه آوایی به عنوان مبنای طراحی لوگوتایپ به فاز ۷ تحویل گردید.",
          "شعار رسمی جهت ترکیب با نشان و تابلوهای تبلیغاتی تدوین شد.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "نام و شعار تایید شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 7: VISUAL IDENTITY & DESIGN SYSTEM (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase7Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d4 = phaseData[4] || {};
  const d6 = phaseData[6] || {};
  const d7 = phaseData[7] || {};
  const colors = d7.colorPalette || "پالت با کنتراست بالا و متناسب با روانشناسی صنف";
  const typo = d7.typography || "خانواده فونت رسمی و خوانا (مانند وزیرمتن یا یکان‌بخ)";
  const logo = d7.logoConcept || "طراحی مینیمال، معنادار و قابل پیاده‌سازی در مقیاس‌های خرد تا کلان";
  const touchpoints = d7.touchpoints || "تابلوی محیطی، یونیفرم پرسنل، سربرگ فاکتور و هویت دیجیتال";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(7, unknowns, phaseData);

  return {
    title: "کتابچه جامع سیستم طراحی هویت بصری (Visual Identity Design System)",
    phase: "فاز ۷ — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 7,
    date: dateStr,
    sections: [
      {
        id: "P7_SEC_1",
        title: "۱. لایه ورودی: ماتیف بصری، پالت رنگ و تایپوگرافی (Starting Point & Visual Tokens)",
        type: "snapshot",
        content: {
          "کانسپت و مورفولوژی لوگو": logo,
          "پالت رنگ سازمانی (Color Tokens)": colors,
          "تایپوگرافی و ساختار فونت": typo,
          "نقاط تماس کلیدی بصری (Touchpoints)": touchpoints,
          "زبان طراحی و سبک بصری": "مینیمال، مدرن، بدون شلوغی‌های بصری و متمرکز بر وضوح پیام",
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — مبنای هدایت بصری و المان‌های گرافیکی.`,
          "تعیین کدهای رنگی استاندارد (HEX، RGB، CMYK و Pantone) جهت تضمین ثبات رنگ در چاپ و نمایشگر.",
          "تعیین نسبت‌های طلایی و فضای امن حاشیه لوگو در کاربردهای محیطی و دیجیتال."
        ]
      },
      {
        id: "P7_SEC_2",
        title: "۲. لایه الگوریتم: کنترل کیفی خروجی‌های بصری و اجرای تابلو (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: دریافت اتودهای لوگو و آرت‌ورک‌های بصری]
       │
       ▼
[گام ۱: تست تک‌رنگ (Monochrome) — لوگو باید در حالت سیاه و سفید کامل ۱۰۰٪ خوانا باشد]
       │
       ▼
[گام ۲: تست مقیاس‌پذیری — وضوح لوگو در ابعاد ۱۶ پیکسل (فاوآیکون) تا ۵ متر (تابلوی سردرب)]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[کاهش وضوح در ابعاد کوچک یا جزییات اضافه]      [وضوح کامل در تمام مقیاس‌ها و زمینه تیره/روشن]
    │                                                   │
[اصلاح و ساده‌سازی خطوط مورفولوژیک]                    [تایید کدهای رنگی و آماده‌سازی فایل‌های برداری SVG/PDF]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
                     [ورود به گیت فعال‌سازی اجرایی فاز ۸]`,
        items: [
          "آزمون کنتراست WCAG AAA: تضمین خوانایی متن‌ها و تابلوها از فاصله دور در شب و روز.",
          "تولید فایل‌های استاندارد وکتور بدون افت کیفیت جهت چاپ تابلوی چلنیوم و اقلام تبلیغاتی."
        ]
      },
      {
        id: "P7_SEC_3",
        title: "۳. چک‌لیست عملیاتی: تولید اقلام چاپی، یونیفرم و تابلوسازی (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "فاز نصب: ساخت و نصب تابلوی سردرب بر اساس تاییدیه زاویه دید از فاصله ۵۰ متری خیابان.",
          "فاز چاپ: چاپ فاکتورهای رسمی، کارت‌های ضمانت و هدایای تبلیغاتی با کدهای CMYK تاییدشده.",
          "فاز محیطی: تجهیز پرسنل به لباس کار یکدست گلدوزی‌شده همراه با اتیکت سینه با نام و سمت.",
          "فاز دیجیتال: اصلاح لوگو، کاور و هایلایت‌های پیج اینستاگرام و عکس پروفایل پیام‌رسان‌ها.",
          "ماهانه: کنترل سلامت تابلوهای نوری و تعویض فوری هرگونه لامپ یا تابلوی آسیب‌دیده.",
          ...getFactFindingChecklistItems(7, unknowns)
        ]
      },
      {
        id: "P7_SEC_4",
        title: "۴. لایه فرمول‌ها: سنجه‌های وضوح بصری و تمایز در محیط (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "نسبت کنتراست رنگ (Color Contrast Ratio)", formula: "(L1 + 0.05) / (L2 + 0.05)", description: "خوانایی استاندارد متن روی پس‌زمینه" },
          { name: "شاخص تطابق بصری اقلام (Visual Consistency Index)", formula: "(Compliant Brand Assets / Total Live Assets) * 100", description: "یکدستی تابلوها، چاپ و فضای مجازی" },
          { name: "شعاع تشخیص محیطی (Visual Legibility Radius)", formula: "Letter_Height_cm * 3.5 = Visibility_Meters", description: "خوانایی تابلوی سردرب از فاصله در حال حرکت" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "شاخص‌های اندازه‌گیری‌نشده اثربخشی تابلو",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "شعاع دید تابلو و جذب فیزیکی در روزهای اول نصب مورد سنجش قرار می‌گیرد."
          }] : [])
        ],
        kpis: [
          { metric: "کنتراست رنگی متن و تابلو", formula: "WCAG 2.1 Ratio", green: ">= 7.0:1 (AAA)", yellow: "4.5:1 - 6.9:1", red: "< 4.5:1 (ناخوانا در شب)" },
          { metric: "شاخص یکپارچگی بصری اقلام", formula: "Audit of all touchpoints", green: ">= 95%", yellow: "85% - 94%", red: "< 85% (پراکندگی بصری)" },
          { metric: "خوانایی لوگو در مقیاس کوچک", formula: "16x16 px Legibility", green: "100% شفاف", yellow: "شناسایی با زحمت", red: "ناخوانا و مخدوش" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت ممیزی بصری محیطی",
            formula: "پایش تابلو و هویت بصری",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P7_SEC_5",
        title: "۵. لایه خاتمه: گیت تصویب کتابچه بصری و تحویل به فاز ۸ (Readiness Gate 7)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۷": unmeasured.hasUnmeasured ? "سیستم طراحی بصری مصوب مشروط با فرضیات ثبت‌شده" : "سیستم طراحی بصری مصوب و آماده پیاده‌سازی فیزیکی شد",
          "سند تحویلی (Handoff Artifact)": "کتابچه هویت بصری، فایل‌های سورس برداری و گایدلاین تابلوسازی",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی اقلام بصری تایید و مستند گردید.",
          "شرط وتوی عبور": "در صورت عدم انطباق پالت رنگ یا ناخوانایی تابلوی محیطی، پیشروی به فاز ۸ ممنوع است."
        },
        items: [
          "تمامی دارایی‌های بصری قفل شد و به عنوان ورودی کمپین‌ها و اقلام فیزیکی به فاز ۸ تحویل گردید.",
          "پروژه وارد فاز نهایی و گرند فیناله فعال‌سازی تجاری و مدیریت اعتبار گردید.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "سیستم بصری تایید شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// PHASE 8: EXECUTIVE ACTIVATION & REPUTATION (5 LAYERS)
// ----------------------------------------------------------------------------
function generatePhase8Deliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d8 = phaseData[8] || {};
  const seoStrategy = d8.thoughtLeadership || "تسلط بر سئوی محلی، نقشه و تولید ارزش عینی";
  const prStrategy = d8.prChannels || "باشگاه مشتریان و ارتباطات موثر منطقه‌ای/تخصصی";
  const funnel = d8.leadFunnel || "خدمات تکمیلی، اشتراک و افزایش فاکتور وفاداری";
  const crisis = d8.reputationCrisis || "پاسخگویی سریع، جبران آنی و حفظ آبرو";
  const profile = getContextProfileInfo(ctx, phaseData, facts);
  const unmeasured = getUnmeasuredMetricsInfo(8, unknowns, phaseData);

  return {
    title: "برنامه فعال‌سازی اجرایی، روابط عمومی و مدیریت اعتبار (Executive Activation Engine)",
    phase: "فاز 8 — دیجیتال مارکت",
    version: "3.0.0 Algorithmic",
    phaseNumber: 8,
    date: dateStr,
    sections: [
      {
        id: "P8_SEC_1",
        title: "۱. لایه ورودی: سئوی محلی، نقشه و رهبری فکری (Starting Point & Local SEO)",
        type: "snapshot",
        content: {
          thoughtLeadership: seoStrategy,
          reputationCrisis: crisis,
          "استراتژی نفوذ در جستجو": seoStrategy,
          "ثبت کامل در پلتفرم‌های مکانی": "ثبت رسمی لوکیشن در Google Maps، بلد، نشان و اسنپ همراه با عکس‌های باکیفیت و ساعات کاری دقیق",
          "مدیریت نظرات (Reviews)": "برنامه هدفمند برای دریافت بیش از ۱۰۰ نظر ۵ ستاره از مشتریان راضی در ۳ ماه نخست",
          "کلمات کلیدی با نرخ تبدیل بالا": "تمرکز بر عبارات جستجوی محلی با نیت خرید فوری در محدوده منطقه",
          "شناسه صنف (BT)": profile.taxonomyId,
          "دیدگاه محوری کارآفرین": profile.founderVision
        },
        items: [
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}» — پیشران رهبری فکری و مدیریت اعتبار.`,
          "بهینه‌سازی کامل پروفایل کسب‌وکار در نشان و بلد با ثبت شماره تماس، سایت، کاتالوگ و تصاویر تابلو.",
          "تنظیم پیامک خودکار لینک ثبت نظر بلافاصله پس از اتمام ارائه خدمت."
        ]
      },
      {
        id: "P8_SEC_2",
        title: "۲. لایه الگوریتم: قیف تجاری تبدیل و پروتکل ۴ ساعته مهار بحران (Execution Algorithm)",
        type: "flowchart",
        flowchart: `[شروع: جذب ورودی از تابلوی محیطی، سئوی نقشه و معرفی دهان‌به‌دهان]
       │
       ▼
[گام ۱: تجربه شگفت‌انگیز اولین مراجعه — سرعت، برخورد گرم، تحویل کارت اشتراک]
       │
       ▼
[گام ۲: ارسال پیامک یادآوری هوشمند در چرخه مصرف بعدی (۳۰ تا ۶۰ روز بعد)]
       │
    ┌──┴────────────────────────────────────────────────┐
    ▼                                                   ▼
[مشتری راضی: ثبت نظر ۵ ستاره در نشان/بلد]      [مشتری ناراضی یا شاکی: فعال‌سازی آژیر بحران]
    │                                                   │
[اعطای کد تخفیف معرف برای دوستان]                      [پروتکل ۴ ساعته: تماس مستقیم مدیر + پوزش + جبران ۱۰۰٪ خسارت]
       │                                                   │
       └─────────────────────────┬─────────────────────────┘
                                 ▼
              [تکمیل پیروزمندانه چرخه و دستیابی به مشتریان دائم]`,
        items: [
          "قیف تبدیل ۳ مرحله‌ای: جذب اولیه، وفادارسازی در مراجعه اول، ارسال پیامک دوره‌ای بر مبنای نیاز واقعی.",
          "پلی‌بوک ۴ ساعته بحران: توقف هرگونه مجادله در شبکه‌های اجتماعی و اقدام مستقیم مدیریت برای جلب رضایت قطعی شاکی."
        ]
      },
      {
        id: "P8_SEC_3",
        title: "۳. چک‌لیست عملیاتی: تقویم وظایف روزانه، هفتگی و ماهانه فعال‌سازی (Actionable Checklist)",
        type: "checklist",
        checklist: [
          "روزانه (صف): ارسال پیامک تشکر و نظرسنجی حداکثر ۲ ساعت پس از خروج مشتری از محل خدمت.",
          "روزانه (صف): ثبت دقیق شماره موبایل و کیلومتر/مدل تقاضای هر مشتری جدید در باشگاه مشتریان.",
          "هفتگی (سرپرستی): پاسخگویی به تمام نظرات جدید ثبت‌شده در بلد، نشان و Google Maps بدون استثنا.",
          "هفتگی (سرپرستی): ارتباط تلفنی با مشتریانی که بیش از ۹۰ روز است مراجعه نداشته‌اند با یک آفر بازگشت.",
          "ماهانه (مدیریت): تحلیل نرخ بازگشت (Retention)، سنجش سلامت جریان نقدینگی و اجرای کمپین مشترک با کسب‌وکارهای مکمل محله.",
          ...getFactFindingChecklistItems(8, unknowns)
        ]
      },
      {
        id: "P8_SEC_4",
        title: "۴. لایه فرمول‌ها: سنجه‌های رشد تجاری و بازگشت سرمایه برند (Formulas & KPI Thresholds)",
        type: "kpis",
        formulas: [
          { name: "نرخ بازگشت مشتری (Retention Rate)", formula: "(Repeat Customers / Total Customers) * 100", description: "درصد مشتریانی که به برند وفادار می‌مانند" },
          { name: "میانگین ارزش فاکتور (AOV)", formula: "Total Revenue / Total Orders", description: "میزان خرید در هر بار مراجعه" },
          { name: "بازگشت سرمایه بازاریابی (ROAS)", formula: "(Gross Profit Generated by Ads / Marketing Spend)", description: "سودآوری اقدامات ترویجی" },
          ...(unmeasured.hasUnmeasured ? [{
            name: "سنجه‌های اندازه‌گیری‌نشده جذب و بازگشت",
            formula: "[فرضیه نیازمند تست - مجهول رسمی]",
            description: "نرخ بازگشت و ارزش دوره عمر در طول ۹۰ روز اول به صورت فرضیه پیگیری می‌شود."
          }] : [])
        ],
        kpis: [
          { metric: "نرخ بازگشت مشتریان (Retention)", formula: "Repeat visits / Total", green: ">= 45%", yellow: "30% - 44%", red: "< 30% (نشانه فرار مشتری)" },
          { metric: "میانگین امتیاز در نقشه‌ها (Rating)", formula: "Average Stars (Google/Neshan)", green: ">= 4.6 از 5", yellow: "4.0 - 4.5", red: "< 4.0 (هشدار کاهش فروش)" },
          { metric: "بازگشت سرمایه تبلیغات (ROAS)", formula: "Profit from Leads / Ad Spend", green: ">= 4.0X", yellow: "2.0X - 3.9X", red: "< 2.0X (عدم توجیه مالی)" },
          ...(unmeasured.hasUnmeasured ? [{
            metric: "وضعیت سنجه‌های تجاری و نقشه",
            formula: "پایش نظرات و بازگشت مشتری",
            green: "[فرضیه نیازمند تست - مجهول رسمی] (تکمیل لاگ ۳۰ روزه)",
            yellow: "داده‌های پراکنده",
            red: "عدم ثبت سنجه"
          }] : [])
        ]
      },
      {
        id: "P8_SEC_5",
        title: "۵. لایه خاتمه: نقشه راه ۳۶۵ روزه و تحویل کتابچه جامع (365-Day Roadmap & Finale)",
        type: "gate",
        content: {
          "وضعیت گیت فاز ۸": unmeasured.hasUnmeasured ? "فعال‌سازی تجاری مصوب مشروط با فرضیات ثبت‌شده" : "فعال‌سازی تجاری با موفقیت ۱۰۰٪ کامل شد",
          "سند تحویلی (Handoff Artifact)": "نقشه راه ۳۶۵ روزه تجاری و کتابچه مستر اجرای برند",
          "وضعیت سنجه‌های اندازه‌گیری‌نشده": unmeasured.hasUnmeasured ? "[فرضیه نیازمند تست - مجهول رسمی]: مجهولات در چک‌لیست حقیقت‌یابی پیگیری می‌شوند." : "تمامی تارگت‌های ۳۶۵ روزه مدون گردید.",
          "شرط وتوی عبور": "هیچ مانعی وجود ندارد؛ تمامی فازهای هشتگانه با موفقیت پشت سر گذاشته شدند."
        },
        items: [
          "روز ۱ تا ۹۰: اجرای کامل تابلوی محیطی، چاپ اقلام، راه‌اندازی باشگاه پیامکی و جذب ۱۰۰ نظر ۵ ستاره اولیه.",
          "روز ۹۱ تا ۱۸۰: فعال‌سازی کمپین‌های بازگشت مشتری، اجرای پکیج‌های فصلی و افزایش میانگین فاکتور.",
          "روز ۱۸۱ تا ۳۶۵: تثبیت برند به عنوان گزینه اول صنف در منطقه و ارزیابی توسعه خطوط درآمدی جدید یا تاسیس شعبه.",
          unmeasured.hasUnmeasured
            ? "سنجه‌های فاقد آمار با برچسب [فرضیه نیازمند تست - مجهول رسمی] تفکیک شدند."
            : "فعال‌سازی تجاری با موفقیت تکمیل شد."
        ]
      }
    ]
  };
}

// ----------------------------------------------------------------------------
// MASTER BRAND BOOK (ALL 8 PHASES SYNTHESIS) - 9 SECTIONS (M0 to M8)
// ----------------------------------------------------------------------------
function generateMasterDeliverable(phaseData, ctx, dateStr, unknowns = [], facts = []) {
  const d1 = phaseData[1] || {};
  const d2 = phaseData[2] || {};
  const d3 = phaseData[3] || {};
  const d4 = phaseData[4] || {};
  const d5 = phaseData[5] || {};
  const d6 = phaseData[6] || {};
  const d7 = phaseData[7] || {};
  const d8 = phaseData[8] || {};
  const profile = getContextProfileInfo(ctx, phaseData, facts);

  return {
    title: "کتابچه جامع استراتژی و ماشین اجرای برند (Master Brand Book & Execution Machine)",
    phase: "تمام ۸ فاز راهبردی — دیجیتال مارکت",
    version: "3.0.0 Algorithmic Master",
    phaseNumber: "master",
    date: dateStr,
    sections: [
      {
        id: "M0",
        title: "۰. بافتار و مدل عملیاتی کسب‌وکار (Business Context Profile)",
        type: "snapshot",
        content: {
          archetype: ctx ? ctx.archetypeTitle : "کسب‌وکار تخصصی",
          customerModel: ctx ? ctx.customerModel : "B2C / ترکیبی",
          channelModel: ctx ? ctx.channelModel : "حضوری / آنلاین",
          overlays: ctx ? ctx.activeOverlays.join(" • ") : "توسعه کسب‌وکار و پرسونال برندینگ",
          taxonomyId: profile.taxonomyId,
          taxonomyTitle: profile.taxonomyTitleFa,
          iranianGuildCode: profile.iranianGuildCode,
          founderVision: profile.founderVision,
          all15Axes: profile.all15Axes.join(" | ")
        },
        items: [
          `پروفایل بافتار صنف: ${profile.taxonomyId} (${profile.taxonomyTitleFa}) با رسته اصناف: ${profile.iranianGuildCode}.`,
          `دیدگاه راهبردی بنیان‌گذار: «${profile.founderVision}».`,
          `ماتریس ابعاد ۱۵گانه کسب‌وکار: ${profile.all15Axes.slice(2, 7).join(" • ")}.`,
          ...(unknowns.length > 0
            ? [`تعداد مجهولات ثبت‌شده: ${unknowns.length} مورد با برچسب [فرضیه نیازمند تست - مجهول رسمی] در لایه‌های عملیاتی پیگیری می‌شود.`]
            : ["تمام مفروضات و اطلاعات با شواهد کافی قفل گردیده‌اند."]),
          "استقرار چرخه مداوم یادگیری بر مبنای پایگاه دانش ۱۶۵ منبعی و مقالات رسمی ویکی."
        ]
      },
      {
        id: "M1",
        title: "۱. خلاصه بنیاد کسب‌وکار و اقتصاد واحد (Phase 1 Foundation)",
        type: "snapshot",
        content: {
          offer: d1.coreOffer || "خدمت محوری",
          goal: d1.primaryGoal || "جذب مشتریان وفادار",
          market: d1.geography || "محلی و سراسری",
          unitEconomics: d1.unitEconomics || "تثبیت حاشیه مشارکت و کنترل هزینه‌های ثابت"
        },
        items: [
          "محاسبه نقطه سربه‌سر و پوشش هزینه‌های ثابت بر مبنای حاشیه مشارکت هر سفارش.",
          "تضمین پایداری مالی با رعایت الزامات اصناف و اتصال پایانه فروشگاهی به سامانه مودیان."
        ]
      },
      {
        id: "M2",
        title: "۲. هوش بازار، تحلیل رقبا و فرصت طلایی (Phase 2 Intelligence)",
        type: "snapshot",
        content: {
          competitors: d2.competitors || "رقبای سنتی",
          customerPain: d2.customerPain || "کیفیت نامطمئن و اتلاف وقت",
          opportunity: d2.goldenOpportunity || "سرعت، ضمانت و همراهی واقعی"
        },
        items: [
          "تبدیل بزرگ‌ترین نقاط ضعف رقبا به استاندارد تخلف‌ناپذیر برند.",
          "استفاده از مدل حساسیت قیمت (PSM) جهت بهینه‌سازی حاشیه سود بدون شوک به مشتری."
        ]
      },
      {
        id: "M3",
        title: "۳. هسته استراتژی و وعده برند (Phase 3 Strategy)",
        type: "snapshot",
        content: {
          targetSegment: d3.targetSegment || "مشتریان ارزش‌جو",
          positioning: d3.positioning || "کیفیت برتر با ضمانت واقعی",
          promise: d3.promise || "رضایت ۱۰۰٪ و بدون اتلاف وقت"
        },
        items: [
          "تثبیت بیانیه انحصار زاگ مارتی نئومایر به عنوان جایگاه غیرقابل تقلید.",
          "ترسیم خطوط قرمز شفاف جهت پرهیز از افتادن در ورطه جنگ فرسایشی قیمت."
        ]
      },
      {
        id: "M4",
        title: "۴. هویت و کاراکتر انسانی برند (Phase 4 Character)",
        type: "snapshot",
        content: {
          archetype: d4.archetype || "رفیق کاربلد (Everyman)",
          traits: d4.traits || "صداقت، دقت و خوش‌برخوردی"
        },
        items: [
          "اجرای قانون ۳ ثانیه‌ای ارتباط چشمی و احوالپرسی گرم پرسنل با مخاطب.",
          "کنترل تله‌های سایه شخصیتی و تدوین آیین‌نامه انضباطی رفتار در محیط کار."
        ]
      },
      {
        id: "M5",
        title: "۵. هویت کلامی و معرفی سریع (Phase 5 Verbal)",
        type: "snapshot",
        content: {
          voiceStyle: d5.voiceStyle || "صمیمی و محترمانه",
          hook: d5.elevatorHook || "حل مستقیم درد مخاطب"
        },
        items: [
          "بهره‌گیری از فرمول استوری‌برند ۷ مرحله‌ای برای روایت شفاف ارزش.",
          "استقرار پروتکل کلامی حل سریع نارضایتی مشتری بدون جروبحث."
        ]
      },
      {
        id: "M6",
        title: "۶. نام‌گذاری و شعار رسمی (Phase 6 Naming & Tagline)",
        type: "snapshot",
        content: {
          brandName: d6.naming || "نام کوتاه و ماندگار",
          tagline: d6.tagline || "تعهد پایدار به کیفیت و رضایت"
        },
        items: [
          "استعلام رسمی عدم تشابه در طبقات ۳۵ و ۳۷ مالکیت معنوی.",
          "رزرو فوری دامنه‌های ملی و بین‌المللی و نام‌های کاربری شبکه‌های اجتماعی."
        ]
      },
      {
        id: "M7",
        title: "۷. سیستم هویت بصری (Phase 7 Visual Identity)",
        type: "snapshot",
        content: {
          colorPalette: d7.colorPalette || "آبی و زرد صنعتی / مدرن",
          typography: d7.typography || "سنس‌سریف مدرن وزیرمتن",
          logoConcept: d7.logoConcept || "نشان ترکیبی اختصاصی"
        },
        items: [
          "رعایت استانداردهای کنتراست بالای بصری برای تضمین خوانایی تابلو در محیط خیابان.",
          "تولید فایل‌های وکتور برداری استاندارد برای تابلو، فاکتور، لباس فرم و اقلام دیجیتال."
        ]
      },
      {
        id: "M8",
        title: "۸. فعال‌سازی اجرایی و مدیریت اعتبار (Phase 8 Executive Activation)",
        type: "snapshot",
        content: {
          thoughtLeadership: d8.thoughtLeadership || "تسلط بر سئوی محلی، نقشه و تولید ارزش عینی",
          prRoadmap: d8.prChannels || "باشگاه مشتریان و ارتباطات موثر منطقه‌ای/تخصصی",
          commercialFunnel: d8.leadFunnel || "خدمات تکمیلی، اشتراک و افزایش فاکتور وفاداری",
          reputationPlaybook: d8.reputationCrisis || "پاسخگویی سریع، جبران آنی و حفظ آبرو"
        },
        items: [
          "اجرای قیف تجاری ۳ مرحله‌ای و راه‌اندازی سامانه وفادارسازی پیامکی.",
          "استقرار پروتکل مهار ۴ ساعته بحران اعتبار و نظرات منفی در نقشه‌های آنلاین.",
          "اجرای نقشه راه ۳۶۵ روزه جهت تسلط بر بازار منطقه و توسعه پایدار برند."
        ]
      }
    ]
  };
}
