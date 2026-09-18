/**
 * DIGITAL MARKET — Milestone 5 Verification Test Suite
 * Comprehensive Empirical Tests for R13 (Structured AI Output & Dynamic Question Lifecycle)
 * and R17 (Persian Free-Text Robustness across 15 Scenarios)
 */

import { OrchestratorEngine, DYNAMIC_QUESTION_STATE } from "./src/services/orchestratorEngine.js";
import { parseStructuredAIResponse } from "./src/services/geminiService.js";
import { MockProvider } from "./src/services/llmProvider.js";
import {
  normalizePersianText,
  condensePersianText,
  convertPersianDigitsToEnglish,
  detectUnknownIntent,
  parseFreeformSemanticSlots,
  parseSemanticInput,
  UNKNOWN_CATEGORIES
} from "./src/services/semanticParser.js";
import { classifyBusinessContext } from "./src/data/businessContextRouter.js";

console.log("======================================================================");
console.log("🤖 STARTING MILESTONE 5: STRUCTURED AI ENGINE & PERSIAN ROBUSTNESS");
console.log("======================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

// =============================================================================
// SUITE 1: STRUCTURED AI JSON SCHEMA PARSING & VALIDATION (R13)
// =============================================================================
console.log("▶ SUITE 1: Structured AI JSON Schema Parsing & Validation (R13)");
{
  const localContext = {
    taxonomyId: "BT-0111",
    taxonomyTitleFa: "مرکز کارواش نانو بخار",
    archetype: "LOCAL_SERVICE",
    industryId: "IND-05"
  };

  // 1.1 Pure JSON standard payload
  const validJson = JSON.stringify({
    analysisSummary: "تحلیل ورودی کاربر نشان‌دهنده نیاز به خدمات سریع و تضمین‌شده است.",
    extractedDecision: "تصمیم: تمرکز بر شستشوی سریع زیر ۲۰ دقیقه به عنوان مزیت اصلی رقابتی.",
    nextQuestion: {
      id: "q_speed_focus",
      title: "ضمانت سرعت تحویل",
      text: "آیا تمایل دارید تضمین زمان تحویل را به عنوان مزیت اصلی برند اعلام کنید؟",
      whyItMatters: "اعتمادسازی در بین رانندگان شتاب‌زده",
      options: [
        { id: "opt_yes", label: "بله، تضمین زمان مکتوب", detail: "در صورت تاخیر تخفیف داده می‌شود" },
        { id: "opt_no", label: "خیر، تمرکز فقط بر کیفیت متریال", detail: "کیفیت بدون توجه به سرعت" }
      ],
      allowCustomAnswer: true
    }
  });

  const res1 = parseStructuredAIResponse(validJson, localContext);
  assert(res1.analysisSummary.includes("تحلیل ورودی"), "Clean JSON analysisSummary extracted");
  assert(res1.extractedDecision.includes("تمرکز بر شستشوی سریع"), "Clean JSON extractedDecision extracted");
  assert(res1.nextQuestion !== null, "Structured nextQuestion object created");
  assert(res1.nextQuestion.id === "q_speed_focus", "nextQuestion.id preserved");
  assert(res1.nextQuestion.options.length === 2, "2 options normalized");
  assert(res1.nextQuestion.options[0].label === "بله، تضمین زمان مکتوب", "Option label normalized");
  assert(res1.nextQuestion.options[0].value === "opt_yes", "Option value normalized");
  assert(res1.dynamicNextQuestion === res1.nextQuestion.text, "Backwards-compatible dynamicNextQuestion populated");
  assert(res1.dynamicOptions.length === 2, "Backwards-compatible dynamicOptions populated");

  // 1.2 Markdown fenced JSON (```json ... ```)
  const fencedJson = "```json\n" + validJson + "\n```";
  const resFenced = parseStructuredAIResponse(fencedJson, localContext);
  assert(resFenced.nextQuestion !== null, "Markdown fenced JSON parsed correctly");
  assert(resFenced.extractedDecision !== null, "Extracted decision preserved from fenced JSON");

  // 1.3 JSON surrounded by conversational preamble & epilogue
  const preambleJson = "درود بر شما بنیان‌گذار گرامی!\nپس از بررسی داده‌های شما، نتیجه‌گیری راهبردی زیر تدوین شد:\n" +
    validJson + "\nبا آرزوی موفقیت برای کسب‌وکار شما.";
  const resPreamble = parseStructuredAIResponse(preambleJson, localContext);
  assert(resPreamble.nextQuestion !== null, "JSON embedded in conversational filler extracted cleanly");
  assert(resPreamble.extractedDecision.includes("تمرکز بر شستشوی سریع"), "Embedded decision preserved");

  // 1.4 Jargon sanitization in JSON for local trades
  const jargonJson = JSON.stringify({
    analysisSummary: "برای کاهش CAC و افزایش LTV باید قیف فروش Funnel را بهبود دهید.",
    extractedDecision: "تصمیم: بهینه‌سازی Pipeline و کاهش Churn مشتریان.",
    nextQuestion: {
      id: "q_jargon",
      title: "بررسی Funnel",
      text: "آیا برای سنجش CAC برنامه‌ای دارید؟",
      options: [
        { id: "opt_1", label: "محاسبه دقیق CAC", detail: "با آنالیز LTV" }
      ]
    }
  });
  const resJargon = parseStructuredAIResponse(jargonJson, localContext);
  assert(!resJargon.analysisSummary.includes("CAC"), "CAC sanitized from analysisSummary for local trade");
  assert(!resJargon.analysisSummary.includes("LTV"), "LTV sanitized from analysisSummary for local trade");
  assert(!resJargon.extractedDecision.includes("Churn"), "Churn sanitized from extractedDecision");
  assert(!resJargon.nextQuestion.text.includes("CAC"), "CAC sanitized from nextQuestion text");

  // 1.5 Null decision and null nextQuestion handling
  const nullPartsJson = JSON.stringify({
    analysisSummary: "اطلاعات ثبت شد و به فاز بعدی منتقل می‌شویم.",
    extractedDecision: null,
    nextQuestion: null
  });
  const resNullParts = parseStructuredAIResponse(nullPartsJson, localContext);
  assert(resNullParts.extractedDecision === null, "null extractedDecision preserved");
  assert(resNullParts.nextQuestion === null, "null nextQuestion preserved");
  assert(resNullParts.dynamicNextQuestion === "", "dynamicNextQuestion empty when nextQuestion is null");
  assert(resNullParts.dynamicOptions.length === 0, "dynamicOptions empty when nextQuestion is null");
}

// =============================================================================
// SUITE 2: MALFORMED AI OUTPUT RESILIENCE & FALLBACKS (R13)
// =============================================================================
console.log("\n▶ SUITE 2: Malformed AI Output Resilience & Fallbacks (R13)");
{
  const localContext = { taxonomyId: "BT-0012", industryId: "IND-01" };

  // 2.1 Truncated invalid JSON
  const truncated = '{"analysisSummary": "در حال بررسی بازار کتاب...';
  const resTrunc = parseStructuredAIResponse(truncated, localContext);
  assert(typeof resTrunc.analysisSummary === "string", "Truncated JSON returns string analysisSummary");
  assert(resTrunc.extractedDecision === null, "Truncated JSON sets extractedDecision to null");
  assert(resTrunc.nextQuestion === null, "Truncated JSON sets nextQuestion to null without throwing");

  // 2.2 Legacy delimiter format fallback (---DECISION---)
  const legacyReply = `تحلیل اولیه انجام شد و نقاط قوت مشخص گردید.

---DECISION---
تمرکز بر عرضه کتب نایاب به عنوان استراتژی تمایز.
---NEXT_QUESTION---
آیا قصد راه‌اندازی باشگاه کتابخوانی دارید؟
---OPTIONS---
- بله، هفتگی
- بله، ماهانه
- خیر، فقط فروش کتاب
- هنوز تصمیم نگرفته‌ام`;

  const resLegacy = parseStructuredAIResponse(legacyReply, localContext);
  assert(resLegacy.analysisSummary.includes("تحلیل اولیه"), "Legacy analysis extracted cleanly");
  assert(resLegacy.extractedDecision.includes("عرضه کتب نایاب"), "Legacy decision extracted cleanly");
  assert(resLegacy.nextQuestion !== null, "Legacy next question converted into structured object");
  assert(resLegacy.nextQuestion.options.length === 4, "Legacy options normalized to 4 items");
  assert(resLegacy.nextQuestion.options[0].label === "بله، هفتگی", "Legacy option label extracted");

  // 2.3 Empty / null / non-string input safety
  const resEmpty = parseStructuredAIResponse("");
  assert(resEmpty.analysisSummary === "", "Empty string returns empty analysisSummary");
  assert(resEmpty.nextQuestion === null, "Empty string returns null nextQuestion");

  const resNull = parseStructuredAIResponse(null);
  assert(resNull.analysisSummary === "", "Null input handled safely");

  const resUndef = parseStructuredAIResponse(undefined);
  assert(resUndef.analysisSummary === "", "Undefined input handled safely");

  // 2.4 MockProvider returns valid structured JSON
  const mockProvider = new MockProvider();
  const mockOutput = await mockProvider.generateResponse({
    systemPrompt: "test",
    messages: [{ sender: "user", text: "سلام" }]
  });
  const parsedMock = parseStructuredAIResponse(mockOutput, localContext);
  assert(parsedMock.nextQuestion !== null, "MockProvider output parses as valid structured schema");
  assert(parsedMock.extractedDecision !== null, "MockProvider decision extracted");
}

// =============================================================================
// SUITE 3: DYNAMIC QUESTION 4-STATE LIFECYCLE & STATE MACHINE (R13)
// =============================================================================
console.log("\n▶ SUITE 3: Dynamic Question 4-State Lifecycle & State Machine (R13)");
{
  const engine = new OrchestratorEngine();
  engine.phaseData[1] = {
    stage: "active",
    description: "کتابفروشی محلی",
    geography: "تهران",
    primaryGoal: "افزایش فروش",
    coreOffer: "کتاب عمومی و رمان",
    valueHypothesis: "تخفیف و مشاوره"
  };
  engine.businessContext = classifyBusinessContext(engine.phaseData);

  // 3.1 Initially dynamicQuestionState is null
  assert(engine.getDynamicQuestionState() === null, "Initial dynamicQuestionState is null");
  assert(engine.getDynamicQuestionsHistory().length === 0, "Initial dynamicQuestionsHistory is empty");

  // 3.2 setDynamicNextQuestion transitions to PENDING
  const dynQ = {
    id: "dyn_q_book_club",
    title: "باشگاه کتابخوانی",
    text: "آیا تمایل دارید باشگاه مشتریان کتابخوان تاسیس کنید؟",
    whyItMatters: "افزایش مراجعات مجدد مشتریان",
    options: [
      { id: "opt_yes", label: "بله، حتماً" },
      { id: "opt_no", label: "خیر" }
    ]
  };

  const enqueued = engine.setDynamicNextQuestion(dynQ);
  assert(enqueued !== null, "Dynamic question enqueued successfully");
  assert(engine.getDynamicQuestionState() === DYNAMIC_QUESTION_STATE.PENDING, "State is PENDING after enqueue");

  // 3.3 getCurrentQuestion transitions PENDING -> ACTIVE
  const activeQ = engine.getCurrentQuestion();
  assert(activeQ.id === "dyn_q_book_club", "getCurrentQuestion returns the dynamic question");
  assert(engine.getDynamicQuestionState() === DYNAMIC_QUESTION_STATE.ACTIVE, "State transitioned to ACTIVE");

  // 3.4 Repeated getCurrentQuestion calls keep returning active question without advancing step
  const activeQ2 = engine.getCurrentQuestion();
  assert(activeQ2.id === "dyn_q_book_club", "Subsequent getCurrentQuestion still returns dynamic question");
  assert(engine.getDynamicQuestionState() === DYNAMIC_QUESTION_STATE.ACTIVE, "State remains ACTIVE");

  // 3.5 processUserResponse transitions ACTIVE -> CONSUMED -> ARCHIVED
  const reply = engine.processUserResponse("بله، قصد داریم جلسات هفتگی نقد کتاب بگذاریم", "opt_yes");
  
  assert(engine.getDynamicQuestionState() === DYNAMIC_QUESTION_STATE.ARCHIVED, "State transitioned to ARCHIVED after answer");
  assert(engine.dynamicQuestion === null, "Active dynamic question cleared");
  assert(engine.getDynamicQuestionsHistory().length === 1, "Archived to dynamicQuestionsHistory");
  assert(engine.getDynamicQuestionsHistory()[0].id === "dyn_q_book_club", "Archived record has correct ID");
  assert(engine.getDynamicQuestionsHistory()[0].userAnswer.includes("جلسات هفتگی"), "User answer recorded in archive");

  // 3.6 Loop protection: Duplicate question re-enqueue is strictly rejected
  const duplicateAttempt = engine.setDynamicNextQuestion(dynQ);
  assert(duplicateAttempt === null, "Re-enqueuing duplicate question ID rejected to prevent repeat loop");

  const duplicateTextAttempt = engine.setDynamicNextQuestion({
    id: "dyn_q_different_id",
    text: "آیا تمایل دارید باشگاه مشتریان کتابخوان تاسیس کنید؟" // identical text
  });
  assert(duplicateTextAttempt === null, "Re-enqueuing duplicate text rejected to prevent repeat loop");

  // 3.7 After consumption, getCurrentQuestion returns the next regular phase question, not the dynamic one
  const nextRegularQ = engine.getCurrentQuestion();
  assert(nextRegularQ !== null, "Next regular question returned");
  assert(nextRegularQ.id !== "dyn_q_book_club", "Consumed dynamic question is never re-served");

  // 3.8 clearDynamicQuestion cleans up pending question safely
  engine.setDynamicNextQuestion({
    id: "dyn_q_discarded",
    text: "سوال لغوشده"
  });
  assert(engine.getDynamicQuestionState() === DYNAMIC_QUESTION_STATE.PENDING, "Pending question set");
  engine.clearDynamicQuestion();
  assert(engine.getDynamicQuestionState() === null, "Cleared question resets state to null");
  assert(engine.dynamicQuestion === null, "Active dynamic question is null after clear");
}

// =============================================================================
// SUITE 4: 15 PERSIAN FREE-TEXT ADVERSARIAL SCENARIOS (R17)
// =============================================================================
console.log("\n▶ SUITE 4: 15 Persian Free-Text Adversarial Scenarios (R17)");
{
  // 4.1 Scenario 1: Formal Persian (اداری و رسمی)
  const s1 = "اینجانب به عنوان مدیرعامل شرکت، در صدد راه‌اندازی سامانه نرم‌افزاری جهت اتوماسیون سازمانی B2B می‌باشم.";
  const r1 = parseSemanticInput(s1);
  assert(r1.extractedSlots.customerModel === "B2B", "S1: Formal Persian extracted B2B customerModel");
  assert(r1.isUnknown === false, "S1: No false positive unknown");

  // 4.2 Scenario 2: Colloquial Tehrani / Slang (شکسته و عامیانه)
  const s2 = "داش ما یه فست‌فودی تو پیروزی داریم، کارمون پیتزا و ساندویچه، مردم محله میان حضوری میخرن.";
  const r2 = parseSemanticInput(s2);
  assert(r2.extractedSlots.customerModel === "B2C", "S2: Colloquial Persian extracted B2C customerModel");
  assert(r2.extractedSlots.channels === "PHYSICAL_FIRST", "S2: Colloquial extracted PHYSICAL_FIRST channel");

  // 4.3 Scenario 3: Common spelling errors & typos (غلط‌های املایی رایج)
  const s3 = "ما تولیدی موصولات پلاستیکی و ضروف یکبار مصرف با خط تولیده پیشرفته داریم.";
  const r3 = parseSemanticInput(s3);
  assert(r3.businessTypeMatch !== null, "S3: Typos did not crash parser and resolved taxonomy");

  // 4.4 Scenario 4: Half-space variations (نیم‌فاصله و فاصله‌های مجازی)
  const s4_a = "می‌خواهم کسب‌وکار خود را در سطح کشور گسترش دهم";
  const s4_b = "می خواهم کسب و کار خود را در سطح کشور گسترش دهم";
  assert(normalizePersianText(s4_a).includes("گسترش دهم"), "S4: Standard half-space normalized");
  assert(normalizePersianText(s4_b).includes("گسترش دهم"), "S4: Separated space normalized");
  assert(condensePersianText(s4_a) === condensePersianText(s4_b), "S4: Half-space and full-space condense identically");

  // 4.5 Scenario 5: Arabic characters (ي، ك، ة، ؤ، إ)
  const s5 = "شرکة تولیدي با کیفیت عالي و استراتژي مطمئن در کل ایران";
  const r5 = parseSemanticInput(s5);
  assert(r5.extractedSlots.geography === "NATIONAL", "S5: Arabic glyphs normalized; NATIONAL geography extracted");

  // 4.6 Scenario 6: Mixed Persian + English / Finglish
  const s6 = "ما یک پلتفرم b2b saas برای باشگاه‌های ورزشی هستیم و با اشتراک ماهانه recurring کار میکنیم.";
  const r6 = parseSemanticInput(s6);
  assert(r6.extractedSlots.customerModel === "B2B", "S6: Mixed English B2B recognized");
  assert(r6.extractedSlots.channels === "ONLINE_FIRST", "S6: SaaS platform recognized as ONLINE_FIRST");

  // 4.7 Scenario 7: Persian numerals (۱۲۳۴۵۶۷۸۹۰)
  const s7 = "تیم ما ۵ الی ۱۰ نفر پرسنل فنی تمام‌وقت دارد.";
  const r7 = parseSemanticInput(s7);
  assert(r7.extractedSlots.scale === "SMALL", "S7: Persian numerals extracted scale as SMALL (5-10 staff)");

  // 4.8 Scenario 8: English numerals
  const s8 = "کارگاه ما با 2 تا 3 نفر نیروی کارگر خرد اداره می‌شود.";
  const r8 = parseSemanticInput(s8);
  assert(r8.extractedSlots.scale === "MICRO", "S8: English numerals extracted scale as MICRO (2-3 staff)");

  // 4.9 Scenario 9: Very short text
  const r9_a = parseSemanticInput("اره");
  assert(r9_a.isUnknown === false, "S9: Short affirmative handled safely");
  const r9_b = parseSemanticInput("نمیدونم");
  assert(r9_b.isUnknown === true, "S9: Short negative handled as unknown");

  // 4.10 Scenario 10: Very long text (500+ words narrative)
  const longEssay = "ما یک کارخانه تولید قطعات صنعتی هستیم. ".repeat(60) + "مشتریان ما سازمان‌ها و کارخانجات بزرگ هستند.";
  const t0 = Date.now();
  const r10 = parseSemanticInput(longEssay);
  const dur = Date.now() - t0;
  assert(dur < 500, `S10: 500+ word essay parsed safely in ${dur}ms (<500ms, no ReDoS)`);
  assert(r10.extractedSlots.customerModel === "B2B", "S10: Long narrative extracted B2B customerModel");

  // 4.11 Scenario 11: Ambiguous phrasing
  const s11 = "شاید در آینده بریم سمت فروش آنلاین، ولی فعلا قطعی نیست و داریم بررسی می‌کنیم.";
  const r11 = parseSemanticInput(s11);
  assert(r11.isUnknown === true, "S11: Ambiguous statement detected as UNCERTAINTY unknown");
  assert(r11.unknownCategory === UNKNOWN_CATEGORIES.UNCERTAINTY, "S11: Correctly tagged as UNCERTAINTY");

  // 4.12 Scenario 12: Multi-pattern unknown detection
  const unk1 = detectUnknownIntent("اصلا بلد نیستم و هیچ اطلاعی ندارم");
  assert(unk1.category === UNKNOWN_CATEGORIES.EXPLICIT_IGNORANCE, "S12.1: Explicit ignorance detected");

  const unk2 = detectUnknownIntent("هنوز نسنجیدیم و داده آماری ثبت نشده است");
  assert(unk2.category === UNKNOWN_CATEGORIES.UNMEASURED_TIMING, "S12.2: Unmeasured timing detected");

  const unk3 = detectUnknownIntent("حدس می‌زنم حدود ۲۰ درصد باشد اما شک دارم");
  assert(unk3.category === UNKNOWN_CATEGORIES.UNCERTAINTY, "S12.3: Uncertainty detected");

  const unk4 = detectUnknownIntent("باید از حسابدارم بپرسم و استعلام بگیرم");
  assert(unk4.category === UNKNOWN_CATEGORIES.EXTERNAL_DEPENDENCY, "S12.4: External dependency detected");

  // 4.13 Scenario 13: Contradictions with previous answers
  const engineContra = new OrchestratorEngine();
  engineContra.phaseData[1] = {
    customerModel: "B2C",
    primaryGoal: "جذب مشتریان محلی خانوار"
  };
  const r13 = engineContra.processUserResponse("ما منحصراً در مناقصات بزرگ سازمانی و فروش به ارگان‌های دولتی شرکت می‌کنیم.");
  assert(engineContra.contradictions.length > 0, "S13: Contradiction detected when B2C switches to government tender B2B");

  // 4.14 Scenario 14: Hybrid business detection
  const s14 = "ما هم کافه تخصصی و نوشیدنی سرو می‌کنیم و هم آموزش باریستا و دوره‌های حضوری داریم.";
  const r14 = parseSemanticInput(s14);
  assert(r14.isHybrid === true, "S14: Hybrid multi-business detected");

  // 4.15 Scenario 15: Keyword spoofing defense (single stray keyword does NOT flip established context)
  const establishedContext = {
    taxonomyId: "BT-0111",
    taxonomyTitleFa: "مرکز کارواش نانو بخار",
    businessType: { id: "BT-0111", nameFa: "مرکز کارواش نانو بخار" },
    archetype: "LOCAL_SERVICE",
    industryId: "IND-05"
  };
  const s15 = "ما در اتاق انتظار کارواش، قهوه رایگان هم به رانندگان ارائه می‌دهیم.";
  const r15 = parseSemanticInput(s15, establishedContext);
  assert(r15.extractedSlots.businessTypeMatch.id === "BT-0111", "S15: Carwash context preserved despite casual 'قهوه' mention (No keyword spoofing!)");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 5 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================");
