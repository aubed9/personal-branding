import { classifyBusinessContext } from "../data/businessContextRouter.js";

export const CONTRADICTION_SEVERITY = {
  CRITICAL: "CRITICAL",
  MAJOR: "MAJOR",
  MINOR: "MINOR"
};

export const CONTRADICTION_STATUS = {
  UNRESOLVED: "UNRESOLVED",
  RESOLVED: "RESOLVED",
  DISMISSED: "DISMISSED"
};

export class ContradictionEngine {
  static _counter = 0;

  /**
   * Create a typed contradiction entity
   */
  static createContradiction({
    id = null,
    ruleId = null,
    resolutionTargets = {},
    statementA,
    statementB,
    severity = CONTRADICTION_SEVERITY.MAJOR,
    affectedPhases = [],
    resolutionStatus = CONTRADICTION_STATUS.UNRESOLVED,
    resolutionQuestion = "",
    resolution = null,
    resolvedAt = null,
    createdAt = null,
    existingCount = 0
  } = {}) {
    const countIndex = Math.max(existingCount > 0 ? (existingCount + 1) : 1, (ContradictionEngine._counter || 0) + 1);
    ContradictionEngine._counter = countIndex;
    const generatedId = id || `CTR-${String(countIndex).padStart(3, "0")}`;
    return {
      id: generatedId,
      ruleId, resolutionTargets,
      statementA: String(statementA || ""),
      statementB: String(statementB || ""),
      severity: severity || CONTRADICTION_SEVERITY.MAJOR,
      affectedPhases: Array.isArray(affectedPhases) && affectedPhases.length > 0 ? affectedPhases : [1],
      resolutionStatus: resolutionStatus || CONTRADICTION_STATUS.UNRESOLVED,
      resolutionQuestion: resolutionQuestion || "لطفاً تناقض میان دو گزاره را شفاف‌سازی یا یکی را اصلاح نمایید.",
      createdAt: createdAt || new Date().toISOString(),
      resolvedAt: resolvedAt || null,
      resolution: resolution || null
    };
  }

  /**
   * Detect contradictions across the full project state
   */
  static detectContradictions(projectState) {
    const contradictions = [];
    if (!projectState) return contradictions;

    const phaseData = projectState.phaseData || {};
    const p1 = phaseData[1] || {};
    const p2 = phaseData[2] || {};
    const p3 = phaseData[3] || {};
    const p5 = phaseData[5] || {};
    const p8 = phaseData[8] || {};
    const decisions = Array.isArray(projectState.decisions) ? projectState.decisions : [];
    let context = projectState.businessContext || null;
    if (!context && projectState.phaseData) {
      try {
        context = classifyBusinessContext(projectState.phaseData);
      } catch (e) {
        // fallback
      }
    }

    // Helper to gather all text from decisions, facts, and phase answers
    const allDecisionTexts = decisions.map(d => (typeof d === "string" ? d : d.statement || "")).join(" ");
    const allFactTexts = (projectState.facts || []).map(f => (typeof f === "string" ? f : f.statement || "")).join(" ");
    const allP1NonModel = Object.entries(p1).filter(([k]) => !k.includes("customerModel")).map(([_, v]) => v).join(" ");
    const allP2Text = Object.values(p2).join(" ");
    const allP8Text = Object.values(p8).join(" ");
    const allP5Text = Object.values(p5).join(" ");
    const allP3Text = Object.values(p3).join(" ");
    const stripNegations = text => text.replace(/(?:عدم ورود به|ممنوعیت|بدون|پرهیز از|اجتناب از|نه به)\s+[^،؛.\n]+/g, '');
    const combinedDownstreamText = stripNegations(`${allDecisionTexts} ${allFactTexts} ${allP1NonModel} ${allP2Text} ${allP3Text} ${allP5Text} ${allP8Text}`);

    // RULE 1: Customer Model Conflict (B2C vs B2B Enterprise RFP)
    // If P1 customer model is purely B2C / local walk-in retail, but later states enterprise tenders / RFPs / corporate procurement
    const isB2C = (context?.customerModel === "B2C") || 
                  (p1.customerModel === "B2C") || 
                  (p1.customerModelValue === "b2c") ||
                  (context?.archetype === "LOCAL_SERVICE" && !p1.customerModel?.includes("B2B"));

    const hasEnterpriseB2BTerms = /(مناقصه|مناقصات|تدارکات سازمانی|قراردادهای دولتی|RFP|B2B Enterprise|خرید کلان شرکت‌ها|سامانه ستاد ایران)/i;

    
    if (isB2C && hasEnterpriseB2BTerms.test(combinedDownstreamText)) {
      contradictions.push(this.createContradiction({
        ruleId: 'customer_model', resolutionTargets: { 1: 'step0_description', 2: 'p2_step3_primary_channel', 3: 'p3_target_segment', 5: 'p5_elevator_hook', 8: 'p8_lead_funnel' },
        statementA: "مدل مشتری در فاز ۱ به صورت مصرف‌کننده نهایی (B2C) و مراجعان حضوری ثبت شده است.",
        statementB: "در برنامه‌های استراتژیک یا فعال‌سازی، به مناقصات کلان سازمانی و تدارکات B2B اشاره شده است.",
        severity: CONTRADICTION_SEVERITY.CRITICAL,
        affectedPhases: [1, 3, 8],
        resolutionQuestion: "آیا مدل کسب‌وکار شما B2C است یا B2B سازمانی؟ ورود همزمان به مناقصات شرکتی نیازمند فرآیند فروش و اهلیت حقوقی متفاوت است.",
        existingCount: contradictions.length
      }));
    }

    // RULE 1b: Pure B2B enterprise in P1 vs B2C walk-in / retail consumers downstream
    const isPureB2B = (context?.customerModel === "B2B") || 
                      (p1.customerModel === "B2B") || 
                      (p1.customerModelValue === "b2b");
    const hasImpulseB2CTerms = /(خرید تک‌فروشی گذری|پاخور مراجعان پیاده|فروش خرد به عموم مردم|فروشگاه خرده‌فروشی خیابانی|B2C Retail)/i;
    if (isPureB2B && hasImpulseB2CTerms.test(combinedDownstreamText)) {
      contradictions.push(this.createContradiction({
        ruleId: 'customer_model_retail', resolutionTargets: { 1: 'step0_description', 3: 'p3_target_segment', 8: 'p8_lead_funnel' },
        statementA: "مدل مشتری در فاز ۱ به صورت سازمانی و بنگاه‌به‌بنگاه (B2B) ثبت شده است.",
        statementB: "در استراتژی یا کانال‌ها، به جذب پاخور خرد عمومی و خرده‌فروشی تک‌محصولی B2C اشاره شده است.",
        severity: CONTRADICTION_SEVERITY.CRITICAL,
        affectedPhases: [1, 3, 8],
        resolutionQuestion: "فروش B2B سازمانی با پاخور خرده‌فروشی خیابانی در تضاد کانال توزیع است. کانال اصلی توزیع کدام است؟",
        existingCount: contradictions.length
      }));
    }

    // RULE 2: Budget / Capital Constraint vs Expensive Mass Media
    // If user states low budget / bootstrapped / cash-constrained, but plans TV ads / national billboards / celebrities
    const p1BudgetRaw = `${p1.budgetConstraint || ""} ${p1.cashConstraint || ""} ${p1.stage || ""} ${p1.primaryBottleneck || ""}`.toLowerCase();
    const isCashConstrained = p1BudgetRaw.includes("low") || 
                             p1BudgetRaw.includes("محدود") || 
                             p1BudgetRaw.includes("صفر") || 
                             p1BudgetRaw.includes("bootstrapped") || 
                             p1BudgetRaw.includes("کمبود نقدینگی") ||
                             p1BudgetRaw.includes("کمبود سرمایه") ||
                             p1BudgetRaw.includes("بودجه کم") ||
                             p1BudgetRaw.includes("نقدینگی پایین") ||
                             (p1.stageValue === "idea" && !p1.budgetConstraint);

    const hasMassMediaTerms = /(کمپین تلویزیونی|بیلبورد بزرگراهی|تبلیغات صدا و سیما|تبلیغ تلویزیون|سلبریتی مارکتینگ میلیاردی|بیلبوردهای سراسری|تلویزیون ملی)/i;
    if (isCashConstrained && hasMassMediaTerms.test(combinedDownstreamText)) {
      contradictions.push(this.createContradiction({
        ruleId: 'budget_media', resolutionTargets: { 1: 'cash_constraint', 5: 'p5_elevator_hook', 8: 'p8_pr_podcast_channels' },
        statementA: "بودجه اولیه و نقدینگی کسب‌وکار محدود یا در مرحله ایده/بوت‌استرپ اعلام شده است.",
        statementB: "کانال‌های اجرایی شامل رسانه‌های جمعی پرهزینه (تلویزیون، بیلبورد سراسری) برنامه‌ریزی شده است.",
        severity: CONTRADICTION_SEVERITY.CRITICAL,
        affectedPhases: [1, 5, 8],
        resolutionQuestion: "هزینه رسانه انتخاب‌شده هنوز با بودجه شما تطبیق داده نشده است. چگونه این کانال با قید نقدینگی محدود تامین مالی خواهد شد؟",
        existingCount: contradictions.length
      }));
    }

    // RULE 3: Geographic Scope Conflict (Local 3km radius vs International Export)
    const isLocalScope = (context?.geographicScope === "LOCAL") || 
                         (p1.geographyValue === "local_city") || 
                         (p1.geography === "local_city") ||
                         (typeof p1.geography === "string" && (p1.geography.includes("محلی") || p1.geography.includes("شهری") || p1.geography.includes("local")));
    const hasExportTerms = /(صادرات به کشورهای منطقه|صادرات بین‌المللی|حمل‌ونقل دریایی کانتینری|ارسال به حوزه خلیج فارس|صادرات خارجی|بازار جهانی)/i;
    if (isLocalScope && hasExportTerms.test(combinedDownstreamText)) {
      contradictions.push(this.createContradiction({
        ruleId: 'geography', resolutionTargets: { 1: 'step0_geography', 3: 'p3_target_segment' },
        statementA: "محدوده جغرافیایی کسب‌وکار در فاز ۱ به عنوان خدمت محلی و شهری تعیین شده است.",
        statementB: "در استراتژی یا برنامه‌های توسعه، صادرات خارجی و بازارهای بین‌المللی قید گردیده است.",
        severity: CONTRADICTION_SEVERITY.MAJOR,
        affectedPhases: [1, 3],
        resolutionQuestion: "خدمات محلی و صادرات بین‌المللی دو زنجیره ارزش کاملاً متفاوت دارند. آیا قلمرو بازار باید به بین‌المللی ارتقا یابد؟",
        existingCount: contradictions.length
      }));
    }

    // RULE 4: Pricing vs Value Proposition Conflict (Cheapest Discount vs Luxury Exclusive)
    const p2Pricing = stripNegations(`${p2.pricingModel || ""} ${p2.pricingModelValue || ""}`).toLowerCase();
    const p3Pos = `${p3.positioning || ""} ${p3.positioningValue || ""}`.toLowerCase();
    const isUltraCheap = p2Pricing.includes("تخفیف") || p2Pricing.includes("ارزان") || p2Pricing.includes("حراج") || p2Pricing.includes("lowest_price") || p2Pricing.includes("ارزان‌ترین");
    const isLuxury = p3Pos.includes("لوکس") || p3Pos.includes("اشرافی") || p3Pos.includes("پریمیوم") || p3Pos.includes("گران‌قیمت") || p3Pos.includes("exclusive") || p3Pos.includes("اعیانی");
    if (isUltraCheap && isLuxury) {
      contradictions.push(this.createContradiction({
        ruleId: 'price_position', resolutionTargets: { 2: 'p2_step2_pricing_models', 3: 'p3_positioning_frame' },
        statementA: "استراتژی قیمت‌گذاری بر مبنای تخفیف تهاجمی و ارزان‌ترین نرخ بازار تعریف شده است.",
        statementB: "جایگاه‌یابی برند به عنوان برند لوکس، پرستیژی و پریمیوم ادعا شده است.",
        severity: CONTRADICTION_SEVERITY.MAJOR,
        affectedPhases: [2, 3],
        resolutionQuestion: "جایگاه لوکس با جنگ قیمت و تخفیف تهاجمی در تضاد هویتی است. لطفاً بین رهبری هزینه یا تمایز پرستیژی یکی را برگزینید.",
        existingCount: contradictions.length
      }));
    }

    const target = `${p3.targetSegment || ''}`;
    const premium = /لوکس|پریمیوم|گران.قیمت|premium/.test(p2Pricing);
    const limitedIncome = /کم.درآمد|بودجه محدود|کشش قیمتی محدود|توان خرید محدود/.test(target);
    const tiered = /دو سطح|لایه|بسته پایه|سطح اقتصادی|tiered|affordable_entry/.test(p2Pricing);
    if (premium && limitedIncome && !tiered) {
      contradictions.push(this.createContradiction({
        ruleId: 'price_audience',
        statementA: `روش قیمت‌گذاری: ${p2.pricingModel}`,
        statementB: `مشتری هدف: ${target}`,
        affectedPhases: [2, 3],
        resolutionTargets: { 2: 'p2_step2_pricing_models', 3: 'p3_target_segment' },
        resolutionQuestion: 'قیمت بالا و توان خرید محدود نیازمند بررسی است. آیا شاهدی از خرید واقعی این گروه دارید، یا باید گروه هدف یا دامنه بسته پایه را اصلاح کنید؟',
        existingCount: contradictions.length,
      }));
    }
    return contradictions;
  }

  /**
   * Check if a specific contradiction is actively blocking
   */
  static isBlocking(contradiction) {
    if (!contradiction) return false;
    const isSevere = contradiction.severity === CONTRADICTION_SEVERITY.CRITICAL || 
                     contradiction.severity === CONTRADICTION_SEVERITY.MAJOR;
    const isUnresolved = contradiction.resolutionStatus === CONTRADICTION_STATUS.UNRESOLVED;
    return isSevere && isUnresolved;
  }

  /**
   * Filter active blocking contradictions
   */
  static getBlockingContradictions(contradictionsList = [], phase = null) {
    if (!Array.isArray(contradictionsList)) return [];
    return contradictionsList.filter(c => {
      if (phase !== null && Array.isArray(c.affectedPhases) && !c.affectedPhases.includes(Number(phase))) {
        return false;
      }
      return this.isBlocking(c);
    });
  }

  /**
   * Resolve a contradiction
   */
  static resolveContradiction(contradictionsList, id, resolution) {
    if (!Array.isArray(contradictionsList)) return null;
    const item = contradictionsList.find(c => c.id === id);
    if (!item) return null;
    item.resolutionStatus = CONTRADICTION_STATUS.RESOLVED;
    item.resolvedAt = new Date().toISOString();
    item.resolution = resolution || "رفع تناقض با تصحیح فرضیات انجام شد.";
    return item;
  }

  /**
   * Dismiss a contradiction
   */
  static dismissContradiction(contradictionsList, id, rationale) {
    if (!Array.isArray(contradictionsList)) return null;
    const item = contradictionsList.find(c => c.id === id);
    if (!item) return null;
    item.resolutionStatus = CONTRADICTION_STATUS.DISMISSED;
    item.resolvedAt = new Date().toISOString();
    item.resolution = `رد شده با توجیه: ${rationale || "عدم وجود تناقض واقعی"}`;
    return item;
  }
}
