import { INTERVIEW_FIELDS, isUnknownAnswer } from "./interviewSchema.js";
/**
 * DIGITAL MARKET — Phase Gate Validator (Requirement R2)
 * Real, Non-Bypassable Exit Gate Validation for Phases 1 to 8
 */

import { UnknownsManager } from "./unknownsManager.js";
import { ContradictionEngine } from "./contradictionEngine.js";

export function validatePhaseGate(phaseNum, projectState) {
  const p = Number(phaseNum);
  const phaseData = projectState?.phaseData || {};
  const data = phaseData[p] || {};
  const unknowns = projectState?.unknowns || [];
  const contradictions = projectState?.contradictions || [];
  const completedPhases = projectState?.completedPhases || {};
  const context = projectState?.businessContext || null;

  const blockingReasons = [];
  if ((projectState?.reviewRequired?.[p] || []).length) blockingReasons.push('پاسخ‌های این فاز پس از تغییر فاز قبلی باید بازبینی شوند.');
  const warnings = [];
  const missingFacts = [];
  const requiredDecisions = [];
  const unresolvedUnknowns = UnknownsManager.getBlockingUnknowns(unknowns, p);
  // In reasoning v3, contradiction blocking is projected through exact graph BLOCKS edges.
  // The legacy affectedPhases filter remains only when no v3 graph is available.
  const unresolvedContradictions = projectState?.reasoningGraphV3
    ? []
    : ContradictionEngine.getBlockingContradictions(contradictions, p);

  // 1. Check prerequisite phase progression
  if (p > 1) {
    for (let prev = 1; prev < p; prev++) {
      if (!completedPhases[prev]) {
        blockingReasons.push(
          `فاز پیش‌نیاز ${prev} تکمیل نشده است. ورود و خروج فاز ${p} منوط به تایید کامل فازهای قبلی است.`
        );
      }
    }
  }

  // 2. Check for unresolved blocking unknowns in the phase being validated
  if (unresolvedUnknowns.length > 0) {
    unresolvedUnknowns.forEach(u => {
      blockingReasons.push(
        `مجهول مسدودکننده حل‌نشده [${u.id}]: «${u.reason}». برای عبور از گیت باید رفع یا به عنوان ریسک پذیرفته شود.`
      );
    });
  }

  // Non-blocking unknowns are tracked as warnings
  const nonBlocking = UnknownsManager.getNonBlockingUnknowns(unknowns, p);
  nonBlocking.forEach(u => {
    warnings.push(
      `مجهول غیرمسدودکننده [${u.id}]: فرضیه آزمایشی در دوسیه ثبت است و مانع عبور از گیت نیست.`
    );
  });

  // 3. Check for unresolved critical or major contradictions
  if (unresolvedContradictions.length > 0) {
    unresolvedContradictions.forEach(c => {
      blockingReasons.push(
        `تناقض ${c.severity === "CRITICAL" ? "بحرانی" : "عمده"} حل‌نشده [${c.id}]: ${c.resolutionQuestion}`
      );
    });
  }

  // 4. Phase-Specific Fact & Decision Requirements
  let requiredItemsCount = 0;
  let fulfilledItemsCount = 0;

  switch (p) {
    case 1: {
      // Phase 1 Requirements:
      // 1. Business model / description / trade
      // 2. Stage
      // 3. Geography
      // 4. Primary Goal
      // 5. Core Offer & Unit Economics / Monetization / Budget

      requiredItemsCount = 5;

      // Item 1: Business model / description / trade
      const hasBizModel = Boolean(
        data.description || data.descriptionValue || data.taxonomyId
      );
      if (hasBizModel) {
        fulfilledItemsCount++;
      } else {
        missingFacts.push("صنف و مدل فعالیت کسب‌وکار (Business Model / Trade)");
        blockingReasons.push("عدم ثبت صنف یا مدل کسب‌وکار: تعیین رسته شغلی و مدل فعالیت برای فاز ۱ الزامی است.");
      }

      // Item 2: Stage of business
      const hasStage = Boolean(data.stage || data.stageValue);
      if (hasStage) {
        fulfilledItemsCount++;
      } else {
        missingFacts.push("مرحله بلوغ کسب‌وکار (Business Stage)");
        blockingReasons.push("عدم تعیین مرحله فعالیت (ایده، راه‌اندازی، فعال، یا ری‌برندینگ).");
      }

      // Item 3: Geography
      const hasGeo = Boolean(
        data.geography || data.geographyValue || data.geographyFromFreeform
      );
      if (hasGeo) {
        fulfilledItemsCount++;
      } else {
        missingFacts.push("محدوده جغرافیایی بازار هدف (Geographic Scope)");
        blockingReasons.push("عدم تعیین محدوده جغرافیایی مشتریان (محلی، استانی، سراسری، یا صادراتی).");
      }

      // Item 4: Primary Goal
      const hasGoal = Boolean(
        data.primaryGoal || data.primaryGoalValue
      );
      if (hasGoal) {
        fulfilledItemsCount++;
      } else {
        missingFacts.push("هدف ملموس کوتاه‌مدت ۳ تا ۶ ماهه (Primary Goal)");
        blockingReasons.push("عدم تعیین هدف ملموس و سنجش‌پذیر در افق کوتاه‌مدت.");
      }

      // Item 5: Core Offer & Unit Economics / Budget
      const hasOffer = Boolean(
        data.coreOffer
      );
      if (hasOffer) {
        fulfilledItemsCount++;
      } else {
        missingFacts.push("ساختار پیشنهاد محوری و اقتصاد واحد (Core Offer & Unit Economics)");
        blockingReasons.push("عدم تعیین ساختار خدمت محوری یا فرضیه ارزش‌آفرینی اولیه.");
      }
      break;
    }

    case 2: {
      requiredItemsCount = 4;
      // Competitors
      if (data.competitors) fulfilledItemsCount++;
      else {
        missingFacts.push("تحلیل و رصد رقبای مستقیم و جایگزین (Competitors Intelligence)");
        blockingReasons.push("عدم شناسایی و تحلیل رقبای بازار در فاز ۲.");
      }
      // Customer pain
      if (data.customerPain) fulfilledItemsCount++;
      else {
        missingFacts.push("اصطکاک، نارضایتی و درد اصلی مشتریان (Customer Pain Points)");
        blockingReasons.push("عدم ثبت دغدغه و درد اصلی مشتریان در فاز ۲.");
      }
      // Golden opportunity or pricing
      if (data.goldenOpportunity || data.pricingModel) fulfilledItemsCount++;
      else {
        missingFacts.push("فرصت طلایی تمایز یا مدل قیمت‌گذاری (Golden Opportunity / Pricing)");
        blockingReasons.push("عدم تعیین فرصت طلایی تمایز یا چارچوب قیمت‌گذاری در بازار.");
      }
      // Primary channel
      if (data.primaryChannel || context?.channelModel) fulfilledItemsCount++;
      else {
        missingFacts.push("کانال اصلی دسترسی به مخاطب (Primary Traction Channel)");
        warnings.push("کانال اصلی دسترسی به مخاطب تعیین نشده و به صورت پیش‌فرض از بافتار خوانده می‌شود.");
      }
      break;
    }

    case 3: {
      requiredItemsCount = 3;
      if (data.positioning) fulfilledItemsCount++;
      else {
        requiredDecisions.push("چارچوب جایگاه‌یابی استراتژیک (Strategic Positioning Frame)");
        blockingReasons.push("عدم اتخاذ تصمیم قطعی پیرامون چارچوب جایگاه‌یابی در فاز ۳.");
      }
      if (data.targetSegment) fulfilledItemsCount++;
      else {
        requiredDecisions.push("بخش‌بندی دقیق مشتری هدف (Target Audience Segment)");
        blockingReasons.push("عدم انتخاب سگمنت هدف مشخص در فاز ۳.");
      }
      if (data.boundary || data.promise) fulfilledItemsCount++;
      else {
        requiredDecisions.push("وعده تخلف‌ناپذیر یا مرزهای استراتژیک (Brand Promise / Boundaries)");
        blockingReasons.push("عدم تعیین وعده محوری یا مرزهای بازدارنده برند در فاز ۳.");
      }
      break;
    }

    case 4: {
      requiredItemsCount = 3;
      if (data.archetype) fulfilledItemsCount++;
      else {
        requiredDecisions.push("کهن‌الگوی روان‌شناختی برند (Brand Archetype)");
        blockingReasons.push("عدم انتخاب کهن‌الگوی هویتی برند در فاز ۴.");
      }
      if (data.traits) fulfilledItemsCount++;
      else {
        requiredDecisions.push("صفات شخصیتی و کاراکتر انسانی (Human Personality Traits)");
        warnings.push("صفات رفتاری کاراکتر برند ثبت نشده است.");
      }
      if (data.toneGuardrail) fulfilledItemsCount++;
      else {
        requiredDecisions.push("گاردریل‌های رفتاری و لحنی (Tone Guardrails)");
        warnings.push("گاردریل‌های رفتاری برای حفظ اصالت ثبت نشده است.");
      }
      break;
    }

    case 5: {
      requiredItemsCount = 3;
      if (data.voiceStyle) fulfilledItemsCount++;
      else {
        requiredDecisions.push("سبک صدای محوری برند (Brand Voice Style)");
        blockingReasons.push("عدم تعیین سبک صدای برند در فاز ۵.");
      }
      if (data.elevatorHook) fulfilledItemsCount++;
      else {
        requiredDecisions.push("قلاب کلامی و پیچ ۳۰ ثانیه‌ای آسانسوری (Elevator Hook)");
        blockingReasons.push("عدم تدوین قلاب کلامی ۳۰ ثانیه‌ای در فاز ۵.");
      }
      if (data.forbiddenWords) fulfilledItemsCount++;
      else {
        requiredDecisions.push("فهرست واژگان ممنوعه و کلیشه‌ای (Forbidden Jargon)");
        warnings.push("فهرست واژگان ممنوعه تدوین نشده است.");
      }
      break;
    }

    case 6: {
      requiredItemsCount = 2;
      if (data.naming) fulfilledItemsCount++;
      else {
        requiredDecisions.push("قلمرو استراتژیک نام‌گذاری (Naming Strategy Territory)");
        blockingReasons.push("عدم تعیین قلمرو یا معیار نام‌گذاری در فاز ۶.");
      }
      if (data.tagline) fulfilledItemsCount++;
      else {
        requiredDecisions.push("معماری و جهت‌گیری شعار برند (Brand Tagline Direction)");
        blockingReasons.push("عدم تعیین شعار یا پیام محوری در فاز ۶.");
      }
      break;
    }

    case 7: {
      requiredItemsCount = 3;
      if (data.colorPalette) fulfilledItemsCount++;
      else {
        requiredDecisions.push("پالت رنگی روان‌شناختی برند (Brand Color Palette)");
        blockingReasons.push("عدم انتخاب سیستم رنگی در فاز ۷.");
      }
      if (data.typography) fulfilledItemsCount++;
      else {
        requiredDecisions.push("مود تایپوگرافی و فونت فارسی (Persian Typography Mood)");
        warnings.push("جهت‌گیری تایپوگرافی ثبت نشده است.");
      }
      if (data.logoConcept) fulfilledItemsCount++;
      else {
        requiredDecisions.push("کانسپت و جهت‌گیری نشان و لوگو (Logo Design Direction)");
        warnings.push("کانسپت لوگو ثبت نشده است.");
      }
      break;
    }

    case 8: {
      requiredItemsCount = 4;
      if (data.thoughtLeadership) fulfilledItemsCount++;
      else {
        requiredDecisions.push("موتور رهبری فکری یا سئوی محلی (Thought Leadership / Local SEO)");
        blockingReasons.push("عدم تعیین برنامه رهبری فکری یا سئو در فاز ۸.");
      }
      if (data.prChannels) fulfilledItemsCount++;
      else {
        requiredDecisions.push("نقشه رسانه‌ها و پادکست‌ها (PR & Media Map)");
        warnings.push("نقشه رسانه‌ای ثبت نشده است.");
      }
      if (data.leadFunnel) fulfilledItemsCount++;
      else {
        requiredDecisions.push("قیف تجاری جذب و تبدیل مشتری (Commercial Lead Funnel)");
        blockingReasons.push("عدم تعریف سازوکار قیف فروش در فاز ۸.");
      }
      if (data.reputationCrisis) fulfilledItemsCount++;
      else {
        requiredDecisions.push("پلی‌بوک مدیریت اعتبار و مهار بحران (Crisis & Reputation Playbook)");
        warnings.push("دستورالعمل حل بحران ثبت نشده است.");
      }
      break;
    }

    default:
      blockingReasons.push(`شماره فاز ${phaseNum} خارج از محدوده مجاز (۱ تا ۸) است.`);
  }

  for (const spec of INTERVIEW_FIELDS.filter(item => item.phase === p)) {
    if (isUnknownAnswer(data[spec.field]) && !unknowns.some(u => u.phase === p && u.questionId === spec.questionId)) {
      blockingReasons.push(`«${spec.label}» مجهول است و برنامه تحقیق آن ثبت نشده است.`);
    }
  }

  // This is completion coverage, not empirical confidence or market validation.
  // Calculate evidenceScore (0 - 100)
  let evidenceScore = 0;
  if (requiredItemsCount > 0) {
    const baseRatio = fulfilledItemsCount / requiredItemsCount;
    evidenceScore = Math.round(baseRatio * 100);

    // Apply deductions for warnings and non-blocking unknowns
    const penalty = (warnings.length * 3) + (nonBlocking.length * 5);
    evidenceScore = Math.max(0, evidenceScore - penalty);

    // If blocking reasons exist, cap the score at 49%
    if (blockingReasons.length > 0) {
      evidenceScore = Math.min(evidenceScore, 49);
    }
  }

  const passed = blockingReasons.length === 0;

  return {
    passed,
    blockingReasons,
    warnings,
    missingFacts,
    unresolvedUnknowns,
    unresolvedContradictions,
    requiredDecisions,
    evidenceScore
  };
}
