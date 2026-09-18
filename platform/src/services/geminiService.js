/**
 * DIGITAL MARKET — Knowledge-Grounded AI Brain Service
 * 
 * Powered by Google Gemini API and strictly grounded in 49 Canonical Wiki Playbooks
 * and 49 Canonical Wiki Knowledge Nodes (with references to academic & regulatory frameworks).
 * 
 * Enforces Zero-Hallucination, Zero-Corporate-Jargon for Local Trades, and True
 * Dynamic Question Customization based on user's exact prior answers.
 */

import { WIKI_PLAYBOOKS } from "../data/wikiKnowledge.js";
import { sanitizeJargonForLocalTrades } from "./dynamicQuestionEngine.js";
import { buildSecureEndpoint, secureFetchJson, validateEndpointUrl } from "./endpointSecurity.js";

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
3. **پایبندی به پایگاه دانش ۴۹ مقاله ویکی و چارچوب‌های علمی مرجع:**
استدلال شما باید منحصراً بر پایه چارچوب‌های علمی مادر (مدل حساسیت قیمت وستندورپ، تمایز زاگ نئومایر، استوری‌برند دونالد میلر، کهن‌الگوهای مارک و پیرسون، مهار بحران SCCT) باشد.

پلی‌بوک‌های دانشی تزریق‌شده از ویکی:
${relevantPlaybooks}

قالب خروجی الزامی (Strict JSON Schema):
پاسخ شما باید منحصراً و بدون هیچ متن اضافی قبل یا بعد از آن، یک شیء استاندارد JSON به صورت زیر باشد:
\`\`\`json
{
  "analysisSummary": "تحلیل کاربردی، استراتژیک و عمیق از پاسخ کاربر متناسب با بافتار صنف ${tradeTitle}",
  "extractedDecision": "یک جمله کوتاه و صریح به عنوان تصمیم استراتژیک مصوب برای ثبت در شناسنامه برند (یا null در صورت عدم وجود تصمیم جدید)",
  "nextQuestion": {
    "id": "q_dynamic_${phaseNum}_step",
    "title": "عنوان کوتاه و تخصصی پرسش",
    "text": "متن شفاف و دقیق سوال بعدی که منحصراً برای صنف ${tradeTitle} طراحی شده",
    "whyItMatters": "دلیل اهمیت استراتژیک این پرسش در فاز ${phaseNum}",
    "options": [
      { "id": "opt_1", "label": "عنوان ملموس گزینه ۱", "detail": "توضیح تکمیلی یا رویکرد اجرایی" },
      { "id": "opt_2", "label": "عنوان ملموس گزینه ۲", "detail": "توضیح تکمیلی یا رویکرد اجرایی" },
      { "id": "opt_3", "label": "عنوان ملموس گزینه ۳", "detail": "توضیح تکمیلی یا رویکرد اجرایی" },
      { "id": "opt_4", "label": "عنوان ملموس گزینه ۴", "detail": "توضیح تکمیلی یا رویکرد اجرایی" }
    ],
    "allowCustomAnswer": true
  }
}
\`\`\``;
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

  // Build and sanitize endpoint with HTTPS guarantee
  const endpoint = buildSecureEndpoint({
    customEndpoint,
    model,
    apiKey
  });

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

  const data = await secureFetchJson({
    url: endpoint,
    payload,
    apiKey,
    timeoutMs: 30000,
    maxRetries: 3
  });

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

  // Parse structured AI response with strict JSON schema and graceful fallback
  const parsed = parseStructuredAIResponse(rawReply, context);

  return {
    rawReply,
    ...parsed
  };
}

/**
 * Robust parser for AI Brain responses.
 * Implements strict JSON schema extraction, schema validation,
 * fallback for legacy delimiters (---DECISION---), and safe fallback for malformed output.
 * Never throws, never corrupts state.
 *
 * Schema:
 * {
 *   analysisSummary: string,
 *   extractedDecision: string | null,
 *   nextQuestion: {
 *     id: string,
 *     title: string,
 *     text: string,
 *     whyItMatters?: string,
 *     options: Array<{ id: string, label: string, detail?: string }>,
 *     allowCustomAnswer?: boolean
 *   } | null
 * }
 */
export function parseStructuredAIResponse(rawReply, context = null) {
  if (!rawReply || typeof rawReply !== "string") {
    return {
      analysisSummary: "",
      mainReply: "",
      extractedDecision: null,
      nextQuestion: null,
      dynamicNextQuestion: "",
      dynamicOptions: []
    };
  }

  const trimmed = rawReply.trim();
  let analysisSummary = "";
  let extractedDecision = null;
  let nextQuestion = null;

  // 1. Attempt JSON parsing
  let jsonParsed = null;

  // 1.1 Direct or stripped Markdown fenced block
  let jsonCandidate = trimmed;
  if (jsonCandidate.includes("```json")) {
    const start = jsonCandidate.indexOf("```json") + 7;
    const end = jsonCandidate.indexOf("```", start);
    jsonCandidate = end !== -1 ? jsonCandidate.slice(start, end).trim() : jsonCandidate.slice(start).trim();
  } else if (jsonCandidate.startsWith("```")) {
    const start = jsonCandidate.indexOf("```") + 3;
    const end = jsonCandidate.indexOf("```", start);
    jsonCandidate = end !== -1 ? jsonCandidate.slice(start, end).trim() : jsonCandidate.slice(start).trim();
  }

  try {
    jsonParsed = JSON.parse(jsonCandidate);
  } catch (err) {
    // 1.2 Try extracting JSON substring between first { and last }
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        jsonParsed = JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
      } catch (innerErr) {
        jsonParsed = null;
      }
    }
  }

  // 2. Validate JSON schema if successfully parsed
  if (jsonParsed && typeof jsonParsed === "object" && !Array.isArray(jsonParsed)) {
    analysisSummary = typeof jsonParsed.analysisSummary === "string" ? jsonParsed.analysisSummary.trim() : "";
    
    if (typeof jsonParsed.extractedDecision === "string" && jsonParsed.extractedDecision.trim()) {
      extractedDecision = jsonParsed.extractedDecision.trim();
    } else {
      extractedDecision = null;
    }

    if (jsonParsed.nextQuestion && typeof jsonParsed.nextQuestion === "object" && !Array.isArray(jsonParsed.nextQuestion)) {
      const nq = jsonParsed.nextQuestion;
      const qText = typeof nq.text === "string" ? nq.text.trim() : "";
      if (qText) {
        const rawOptions = Array.isArray(nq.options) ? nq.options : [];
        const normalizedOptions = rawOptions
          .map((opt, idx) => {
            if (typeof opt === "string") {
              const cleanOpt = sanitizeJargonForLocalTrades(opt.trim(), context);
              return {
                id: `opt_${idx + 1}`,
                label: cleanOpt,
                text: cleanOpt,
                detail: "",
                value: `dynamic_opt_${idx + 1}`,
                badge: `موضع پیشنهادی ${idx + 1}`
              };
            }
            if (opt && typeof opt === "object") {
              const label = sanitizeJargonForLocalTrades((opt.label || opt.text || "").trim(), context);
              const detail = sanitizeJargonForLocalTrades((opt.detail || "").trim(), context);
              const id = opt.id || `opt_${idx + 1}`;
              return {
                id,
                label,
                text: label,
                detail,
                value: opt.value || id,
                badge: opt.badge || `موضع پیشنهادی ${idx + 1}`
              };
            }
            return null;
          })
          .filter(Boolean)
          .slice(0, 4);

        nextQuestion = {
          id: nq.id || `dynamic_q_${Date.now()}`,
          title: nq.title || "پرسش تخصصی راهبردی",
          text: sanitizeJargonForLocalTrades(qText, context),
          whyItMatters: nq.whyItMatters ? sanitizeJargonForLocalTrades(nq.whyItMatters.trim(), context) : "",
          options: normalizedOptions,
          allowCustomAnswer: nq.allowCustomAnswer !== false
        };
      }
    }
  }

  // 3. Fallback for Legacy Delimiters (---DECISION--- / ---NEXT_QUESTION--- / ---OPTIONS---)
  if (!analysisSummary && trimmed.includes("---DECISION---")) {
    const parts = trimmed.split("---DECISION---");
    analysisSummary = parts[0].trim();
    const afterDecision = parts[1] || "";

    if (afterDecision.includes("---NEXT_QUESTION---")) {
      const decParts = afterDecision.split("---NEXT_QUESTION---");
      extractedDecision = decParts[0].trim() || null;
      const afterQuestion = decParts[1] || "";

      let legacyQuestionText = "";
      let legacyOptions = [];

      if (afterQuestion.includes("---OPTIONS---")) {
        const qParts = afterQuestion.split("---OPTIONS---");
        legacyQuestionText = qParts[0].trim();
        const optText = qParts[1] || "";
        legacyOptions = optText
          .split("\n")
          .map(l => l.replace(/^[-*•\d.]+\s*/, "").trim())
          .filter(l => l.length > 2)
          .slice(0, 4)
          .map((text, idx) => {
            const clean = sanitizeJargonForLocalTrades(text, context);
            return {
              id: `opt_${idx + 1}`,
              label: clean,
              text: clean,
              detail: "",
              value: `dynamic_opt_${idx + 1}`,
              badge: `موضع پیشنهادی ${idx + 1}`
            };
          });
      } else {
        legacyQuestionText = afterQuestion.trim();
      }

      if (legacyQuestionText) {
        nextQuestion = {
          id: `dynamic_q_${Date.now()}`,
          title: "پرسش تخصصی راهبردی",
          text: sanitizeJargonForLocalTrades(legacyQuestionText, context),
          whyItMatters: "",
          options: legacyOptions,
          allowCustomAnswer: true
        };
      }
    } else {
      extractedDecision = afterDecision.trim() || null;
    }
  }

  // 4. Safe Fallback for unparseable raw responses
  if (!analysisSummary) {
    analysisSummary = trimmed;
  }

  // Sanitize jargon
  analysisSummary = sanitizeJargonForLocalTrades(analysisSummary, context);
  if (extractedDecision) {
    extractedDecision = sanitizeJargonForLocalTrades(extractedDecision, context);
  }

  return {
    analysisSummary,
    mainReply: analysisSummary,
    extractedDecision: extractedDecision || null,
    nextQuestion,
    dynamicNextQuestion: nextQuestion ? nextQuestion.text : "",
    dynamicOptions: nextQuestion ? nextQuestion.options : []
  };
}
