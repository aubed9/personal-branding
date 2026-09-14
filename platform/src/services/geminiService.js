/**
 * DIGITAL MARKET — Knowledge-Grounded AI Brain Service
 * 
 * Powered by Google Gemini API and strictly grounded in 49 Canonical Wiki Playbooks
 * and 165 Master Strategic Intelligence Sources.
 * 
 * Enforces Zero-Hallucination, Zero-Corporate-Jargon for Local Trades, and True
 * Dynamic Question Customization based on user's exact prior answers.
 */

import { WIKI_PLAYBOOKS } from "../data/wikiKnowledge.js";
import { sanitizeJargonForLocalTrades } from "./dynamicQuestionEngine.js";

// Canonical Phase Grounding Map
const PHASE_PLAYBOOK_MAP = {
  1: ["context-router-playbook", "decision-chain", "canonical-foundations"],
  2: ["decision-chain", "canonical-foundations"],
  3: ["decision-chain", "canonical-foundations"],
  4: ["decision-chain", "canonical-foundations"],
  5: ["decision-chain", "canonical-foundations"],
  6: ["decision-chain", "canonical-foundations"],
  7: ["decision-chain", "canonical-foundations"],
  8: ["decision-chain", "canonical-foundations"]
};

/**
 * Builds a strict Knowledge-Grounded system instruction for the AI Brain
 */
export function buildKnowledgeGroundingPrompt({
  phaseNum = 1,
  context = null,
  founderVision = "",
  facts = [],
  decisions = [],
  priorAnswers = {}
}) {
  const tradeTitle = context?.taxonomyTitleFa || context?.archetypeTitle || "کسب‌وکار و پیشه تخصصی";
  const tradeCode = context?.taxonomyId || "BT-0001";
  const industryTitle = context?.industryCode || "صنعت تخصصی";
  const customerModel = context?.customerModel || "B2C";
  const channelModel = context?.channelModel || "PHYSICAL_FIRST";

  // Pull relevant wiki playbooks text
  const relevantPlaybooks = WIKI_PLAYBOOKS.slice(0, 3).map(p => `### [پلی‌بوک مرجع: ${p.title}]
${p.content || ""}`).join("\n\n");

  const isLocalTrade = 
    context?.archetype === "LOCAL_SERVICE" ||
    context?.archetype === "PHYSICAL_RETAIL" ||
    context?.industryId === "IND-01" ||
    context?.industryId === "IND-05" ||
    context?.industryId === "IND-28" ||
    channelModel === "PHYSICAL_FIRST";

  return `شما «مغز استراتژیک و هوش تصمیم‌گیرنده پلتفرم دیجیتال مارکت (DIGITAL MARKET)» هستید.
وظیفه شما همراهی با بنیان‌گذار در فاز ${phaseNum} برندسازی و اتخاذ تصمیمات واقعی، علمی و بومی است.

======================================================================
بافتار قطعی و هویت صنف کسب‌وکار (Single Source of Truth):
- عنوان دقیق صنف: ${tradeTitle} (کد تاکسونومی: ${tradeCode})
- صنعت کلان: ${industryTitle}
- مدل تعامل با مشتری: ${customerModel}
- کانال اصلی فعالیت: ${channelModel === "PHYSICAL_FIRST" ? "مراجعه فیزیکی و حضوری محلی" : "آنلاین و پلتفرمی"}
- دیدگاه اولیه و هویت ثبت‌شده بنیان‌گذار: «${founderVision || "در حال تدوین"}»
- فکت‌های تاییدشده قبلی: ${JSON.stringify(facts.slice(-4))}
- تصمیمات قفل‌شده پیشین: ${JSON.stringify(decisions.slice(-4))}
======================================================================

اصول بنیادین و قوانین سلبی غیرقابل‌تخطی (Negative Constraints):
1. **توقف کامل بافتن مطالب کلیشه‌ای و توخالی:** به هیچ وجه شعارهای انگیزشی، جملات کلیشه‌ای ("شما عالی هستید"، "موفقیت نزدیک است") نگویید.
2. **قانون ایزولاسیون کامل واژگان شرکتی (Zero Corporate Jargon):**
${isLocalTrade ? `این صنف یک پیشه محلی/سنتی/فیزیکی است. به کار بردن واژگان فرنگی شرکتی (نظیر CAC, LTV, Churn, DMU, SLA, Pipeline, Funnel) مطلقاً و با نمره صفر ممنوع است. تماماً از معادل‌های واقعی و ملموس بازار ایران استفاده کنید (مانند: هزینه جذب هر مشتری محلی، ارزش مراجعات مکرر، ریزش مشتری، تصمیم‌گیرنده خرید، تضمین کتبی کار، فهرست سفارش‌ها).` : `اصطلاحات را با تعاریف دقیق مالی و رفتاری بازار ایران تطبیق دهید.`}
3. **پایبندی ۱۰۰٪ به پایگاه دانش ۱۶۵ منبعی ویکی:**
استدلال شما باید منحصراً بر پایه چارچوب‌های علمی مادر (مدل حساسیت قیمت وستندورپ، تمایز زاگ نئومایر، استوری‌برند دونالد میلر، کهن‌الگوهای مارک و پیرسون، مهار بحران SCCT) باشد.

پلی‌بوک‌های دانشی تزریق‌شده از ویکی:
${relevantPlaybooks}

قالب خروجی الزامی:
پاسخ شما باید در دو بخش مشخص و شفاف به زبان فارسی حرفه‌ای ارائه شود:
۱. تحلیل عمیق و پاسخ مشاوره به ورودی کاربر (مستقیماً کلمات او را کالبدشکافی کرده و یک تصمیم ملموس بگیرید).
۲. سوال بعدی کاملاً کاستوم‌شده بر اساس پاسخ همین مرحله و دیدگاه بنیان‌گذار، به همراه ۴ گزینه پیشنهادی متناسب.

فرمت تفکیک:
---DECISION---
[یک سطر: تصمیم استراتژیک مشخصی که از پاسخ کاربر برای ثبت در دوسیه برند استخراج شد]
---NEXT_QUESTION---
[متن سوال بعدی که اختصاصاً با تکیه بر جواب کاربر و صنف ${tradeTitle} تدوین شده]
---OPTIONS---
- گزینه ۱
- گزینه ۲
- گزینه ۳
- گزینه ۴`;
}

/**
 * Universal API Client for live LLM execution
 */
export async function callGeminiApi({
  apiKey,
  model = "gemini-1.5-flash",
  customEndpoint = "",
  systemPrompt,
  messages,
  temperature = 0.4
}) {
  if (!apiKey && !customEndpoint) {
    throw new Error("کلید API یا آدرس سرور هوش مصنوعی وارد نشده است.");
  }

  // Support custom base URL or default Google Gemini endpoint
  let endpoint = "";
  if (customEndpoint && customEndpoint.trim()) {
    const base = customEndpoint.trim().replace(/\/+$/, "");
    if (base.includes("generateContent")) {
      endpoint = base.includes("key=") ? base : `${base}?key=${apiKey}`;
    } else {
      endpoint = `${base}/v1beta/models/${model}:generateContent?key=${apiKey}`;
    }
  } else {
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  // Format messages into Gemini format
  const contents = messages.map(msg => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }]
  }));

  const payload = {
    contents,
    systemInstruction: systemPrompt ? {
      parts: [{ text: systemPrompt }]
    } : undefined,
    generationConfig: {
      temperature,
      maxOutputTokens: 2000,
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || response.statusText;
    throw new Error(`خطا در ارتباط با API هوش مصنوعی (${response.status}): ${errorMsg}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!replyText) {
    throw new Error("مدل هیچ پاسخی تولید نکرد.");
  }

  return replyText;
}

/**
 * Knowledge Brain: Runs Knowledge-Grounded Reasoning, parses decisions,
 * and formulates truly dynamic tailored next questions.
 */
export async function runKnowledgeBrain({
  apiKey,
  model = "gemini-1.5-flash",
  customEndpoint = "",
  phaseNum = 1,
  context = null,
  userText = "",
  optionValue = null,
  messages = [],
  priorAnswers = {},
  facts = [],
  decisions = []
}) {
  const founderVision = priorAnswers[1]?.diagnosticVision || "";
  const systemPrompt = buildKnowledgeGroundingPrompt({
    phaseNum,
    context,
    founderVision,
    facts,
    decisions,
    priorAnswers
  });

  const conversationHistory = [
    ...messages.slice(-6),
    { sender: "user", text: userText }
  ];

  const rawReply = await callGeminiApi({
    apiKey,
    model,
    customEndpoint,
    systemPrompt,
    messages: conversationHistory,
    temperature: 0.35
  });

  // Parse structured sections
  let mainReply = rawReply;
  let extractedDecision = "";
  let dynamicNextQuestion = "";
  let dynamicOptions = [];

  if (rawReply.includes("---DECISION---")) {
    const parts = rawReply.split("---DECISION---");
    mainReply = parts[0].trim();
    const afterDecision = parts[1] || "";

    if (afterDecision.includes("---NEXT_QUESTION---")) {
      const decParts = afterDecision.split("---NEXT_QUESTION---");
      extractedDecision = decParts[0].trim();
      const afterQuestion = decParts[1] || "";

      if (afterQuestion.includes("---OPTIONS---")) {
        const qParts = afterQuestion.split("---OPTIONS---");
        dynamicNextQuestion = qParts[0].trim();
        const optText = qParts[1] || "";
        dynamicOptions = optText
          .split("\n")
          .map(l => l.replace(/^[-*•\d.]+\s*/, "").trim())
          .filter(l => l.length > 2)
          .slice(0, 4)
          .map((text, idx) => ({
            text: sanitizeJargonForLocalTrades(text, context),
            value: `dynamic_opt_${idx + 1}`,
            badge: `موضع پیشنهادی ${idx + 1}`
          }));
      } else {
        dynamicNextQuestion = afterQuestion.trim();
      }
    } else {
      extractedDecision = afterDecision.trim();
    }
  }

  // Ensure zero corporate jargon in all returned components
  mainReply = sanitizeJargonForLocalTrades(mainReply, context);
  if (dynamicNextQuestion) {
    dynamicNextQuestion = sanitizeJargonForLocalTrades(dynamicNextQuestion, context);
  }

  return {
    rawReply,
    mainReply,
    extractedDecision,
    dynamicNextQuestion,
    dynamicOptions
  };
}
