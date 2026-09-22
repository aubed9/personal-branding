/**
 * DIGITAL MARKET — Milestone 14: Comprehensive Regression Pass, Error Handling & Deliverable Integrity (R20, R21, R22)
 * 
 * Verifies:
 * 1. Deliverable Typed Data Provenance Tags ([FACT], [DECISION], [FORMULA], [BENCHMARK], [HYPOTHESIS])
 * 2. Component ErrorBoundary Graceful Degradation, Strict Monochrome UI & User Recovery
 * 3. Network Resilience: 429 Exponential Backoff, Offline Error Handling & Credential Redaction
 * 4. Input Boundary Rejection: Empty / Whitespace-Only Validation at UI & Processing Layers
 * 5. Golden Deliverable Benchmarks across 9 Representative Macro Industries
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { BUSINESS_TYPES, MACRO_INDUSTRIES } from './src/data/businessTaxonomy753.js';
import { classifyBusinessContext } from './src/data/businessContextRouter.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';
import { secureFetchJson, redactSensitiveData, validateEndpointUrl } from './src/services/endpointSecurity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('======================================================================');
console.log('🛡️ STARTING MILESTONE 14: REGRESSION, ERROR HANDLING & DELIVERABLES (R20-R22)');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// =============================================================================
// TEST SUITE 1: Deliverable Typed Data Provenance Tags (R22)
// =============================================================================
console.log('--- TEST SUITE 1: Deliverable Typed Data Provenance Tags (R22) ---');
{
  const engine = new OrchestratorEngine();
  const sampleGuild = BUSINESS_TYPES.find(b => b.id === "BT-0001");
  const ctx = classifyBusinessContext({ guild: sampleGuild.id, stage: "ACTIVE" });
  engine.setBusinessContext(ctx);

  // Record a fact
  engine.processUserResponse("تولید پوشاک رسمی و کت‌وشلوار دست‌دوز با پارچه پشمی اعلا", sampleGuild.id);
  // Record a decision
  engine.addStrategicDecision({
    id: "DEC-P1-01",
    phase: 1,
    title: "موضع قیمت‌گذاری",
    decision: "قیمت‌گذاری پرمیوم با گارانتی تعویض ۲۴ ماهه",
    rationale: "تمرکز بر ارزش دوام و لوکس بودن به جای رقابت قیمتی"
  });
  // Record an unknown
  engine.processUserResponse("هنوز نرخ دقیق بهای تمام‌شده هر متر پارچه مشخص نیست", "unknown");

  const mdP1 = engine.generateMarkdownText(1);

  assert(typeof mdP1 === "string" && mdP1.length > 500, "Phase 1 deliverable markdown generated successfully");
  assert(mdP1.includes("[USER_FACT/"), "Markdown contains canonical USER_FACT provenance for user-provided facts");
  assert(mdP1.includes("[SYSTEM_INFERENCE/"), "Markdown contains canonical SYSTEM_INFERENCE provenance for rule-derived context");
  assert(!mdP1.includes("[FORMULA]"), "Legacy FORMULA provenance tag is not used; calculations appear only when real structured inputs exist");
  assert(mdP1.includes("[UNKNOWN/") || mdP1.includes("[UNKNOWN]"), "Markdown preserves explicit UNKNOWN provenance");
  assert(mdP1.includes("projection از Claimهای canonical"), "Deliverable footer documents canonical Claim projection semantics");

  // Unknowns must NOT be promoted to user facts or confirmed external facts.
  const hasFakePromotion = /\[USER_FACT\/CONFIRMED\].*مجهول رسمی|\[EXTERNAL_FACT\/CONFIRMED\].*مجهول رسمی/.test(mdP1);
  assert(!hasFakePromotion, "Unmeasured unknown is NOT promoted to confirmed fact");
  assert(mdP1.includes("[UNKNOWN/") || mdP1.includes("[UNKNOWN]"), "Unmeasured unknown remains explicitly unknown");
}

// =============================================================================
// TEST SUITE 2: Component ErrorBoundary Graceful Degradation & Monochrome (R20)
// =============================================================================
console.log('\n--- TEST SUITE 2: ErrorBoundary Degradation & Monochrome Recovery (R20) ---');
{
  // 1. Inspect ErrorBoundary source code for lifecycle hooks and state transitions
  const ebSource = fs.readFileSync(path.resolve(__dirname, './src/components/ErrorBoundary.jsx'), 'utf-8');
  assert(ebSource.includes("static getDerivedStateFromError"), "ErrorBoundary defines static getDerivedStateFromError hook");
  assert(ebSource.includes("hasError: true"), "getDerivedStateFromError transitions hasError to true");
  assert(ebSource.includes("componentDidCatch"), "ErrorBoundary defines componentDidCatch logging hook");
  assert(ebSource.includes("bg-black"), "ErrorBoundary root uses pure black (#000000) background");
  assert(ebSource.includes("bg-[#0D0D0D]"), "ErrorBoundary container uses dark surface #0D0D0D");
  assert(ebSource.includes("border-white/20"), "ErrorBoundary borders use white opacity");
  assert(ebSource.includes("تلاش مجدد"), "ErrorBoundary offers user 'تلاش مجدد' recovery action");
  assert(ebSource.includes("بارگذاری مجدد"), "ErrorBoundary offers user 'بارگذاری مجدد' action");

  // Zero colorful styles in ErrorBoundary
  assert(!ebSource.includes("emerald"), "ErrorBoundary has zero emerald green styles");
  assert(!ebSource.includes("rose-400") && !ebSource.includes("rose-500"), "ErrorBoundary has zero colorful rose styles");
  assert(!ebSource.includes("slate-900") && !ebSource.includes("slate-800"), "ErrorBoundary has zero slate blue-grey styles");
}

// =============================================================================
// TEST SUITE 3: Network Resilience, 429 Backoff & Secret Redaction (R20)
// =============================================================================
console.log('\n--- TEST SUITE 3: Network Resilience, 429 Backoff & Secret Redaction (R20) ---');
{
  // 1. Secret redaction test
  const fakeKey = "AIzaSyD-sample-secret-key-123456789";
  const rawError = `Failed to fetch from https://generativelanguage.googleapis.com/v1beta/models?key=${fakeKey} (AIzaSyD-sample-secret-key-123456789)`;
  const cleanError = redactSensitiveData(rawError, fakeKey);
  assert(!cleanError.includes(fakeKey), "redactSensitiveData completely strips raw API key");
  assert(cleanError.includes("[REDACTED_API_KEY]") || cleanError.includes("[REDACTED]"), "redactSensitiveData replaces key with [REDACTED]");

  // 2. Endpoint validation
  const validSecure = validateEndpointUrl("https://api.mycustomgateway.ir/v1");
  assert(validSecure.valid === true, "Valid HTTPS endpoint accepted");

  let threwInsecure = false;
  try {
    validateEndpointUrl("http://insecure-remote.com/api");
  } catch (e) {
    threwInsecure = true;
  }
  assert(threwInsecure, "Insecure HTTP endpoint strictly rejected");

  let threwJavascript = false;
  try {
    validateEndpointUrl("javascript:alert(1)");
  } catch (e) {
    threwJavascript = true;
  }
  assert(threwJavascript, "Pseudo-protocol javascript: strictly rejected");

  // 3. Offline fetch handling simulation
  const originalFetch = globalThis.fetch;
  let offlineCallCaught = false;

  // Mock fetch simulating offline TypeError
  globalThis.fetch = async () => {
    const err = new TypeError("Failed to fetch");
    throw err;
  };

  try {
    await secureFetchJson({
      url: "https://generativelanguage.googleapis.com/test",
      payload: {},
      apiKey: fakeKey,
      timeoutMs: 100,
      maxRetries: 1
    });
  } catch (netErr) {
    offlineCallCaught = true;
    assert(netErr.message.includes("ارتباط با اینترنت یا سرور برقرار نشد"), "Offline TypeError translates to clear Persian network error");
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert(offlineCallCaught, "Offline fetch error caught and safely reported in Persian");

  // 4. Rate Limit (HTTP 429) simulation
  let retryCount = 0;
  globalThis.fetch = async () => {
    retryCount++;
    if (retryCount <= 2) {
      return {
        status: 429,
        ok: false,
        json: async () => ({ error: { message: "Resource exhausted" } })
      };
    }
    return {
      status: 200,
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "Success after 429" }] } }] })
    };
  };

  try {
    const result = await secureFetchJson({
      url: "https://generativelanguage.googleapis.com/test",
      payload: {},
      apiKey: fakeKey,
      timeoutMs: 500,
      maxRetries: 3
    });
    assert(result?.candidates?.length > 0, "secureFetchJson successfully recovers from HTTP 429 after retries");
    assert(retryCount === 3, "secureFetchJson attempted exact retries before succeeding");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

// =============================================================================
// TEST SUITE 4: Input Boundary & Whitespace Validation (R20)
// =============================================================================
console.log('\n--- TEST SUITE 4: Input Boundary & Whitespace Validation (R20) ---');
{
  // 1. Inspect QuestionCard code: verify custom text submit blocks empty or pure whitespace
  const qcSource = fs.readFileSync(path.resolve(__dirname, './src/components/QuestionCard.jsx'), 'utf-8');
  assert(qcSource.includes("if (customText.trim())"), "QuestionCard enforces customText.trim() check before calling submit");

  // 2. Inspect App.jsx code: verify handleSubmitCustomAnswer blocks empty or pure whitespace
  const appSource = fs.readFileSync(path.resolve(__dirname, './src/App.jsx'), 'utf-8');
  assert(appSource.includes("!userText?.trim()"), "Unified submit handler rejects empty or whitespace input");

  // 3. Engine survives adversarial edge inputs
  const engine = new OrchestratorEngine();
  const sampleGuild = BUSINESS_TYPES[0];
  const ctx = classifyBusinessContext({ guild: sampleGuild.id, stage: "ACTIVE" });
  engine.setBusinessContext(ctx);

  // Empty string handling
  const resEmpty = engine.processUserResponse("");
  assert(resEmpty !== null && typeof resEmpty === "object", "Engine survives empty string response without throwing");

  // Whitespace-only handling
  const resSpaces = engine.processUserResponse("     ", "   ");
  assert(resSpaces !== null && typeof resSpaces === "object", "Engine survives whitespace response without throwing");
}

// =============================================================================
// TEST SUITE 5: Golden Deliverable Benchmarks Across 9 Representative Industries (R21)
// =============================================================================
console.log('\n--- TEST SUITE 5: Golden Deliverable Benchmarks across 9 Sectors (R21) ---');
{
  const testSectors = [
    { name: "خرده‌فروشی سنتی و فروشگاهی", id: "BT-0001", macro: "IND-01" },
    { name: "کافه و پذیرایی", id: "BT-0066", macro: "IND-03" },
    { name: "پزشکی و سلامت", id: "BT-0100", macro: "IND-04" },
    { name: "خدمات خودرویی و اتوسرویس", id: "BT-0136", macro: "IND-05" },
    { name: "فناوری و نرم‌افزار ابری", id: "BT-0166", macro: "IND-06" },
    { name: "تولید سنگین و ماشین‌سازی", id: "BT-0221", macro: "IND-08" },
    { name: "عمران و مهندسی ساختمان", id: "BT-0275", macro: "IND-11" },
    { name: "خدمات تخصصی و حقوقی B2B", id: "BT-0380", macro: "IND-15" },
    { name: "آموزشگاه و موسسه مهارت", id: "BT-0496", macro: "IND-18" }
  ];

  for (const sector of testSectors) {
    const bt = BUSINESS_TYPES.find(b => b.id === sector.id);
    assert(!!bt, `Business Type ${sector.id} exists in 753 catalog`);

    const engine = new OrchestratorEngine();
    const ctx = classifyBusinessContext({ guild: bt.id, stage: "ACTIVE" });
    engine.setBusinessContext(ctx);

    engine.processUserResponse(`صنف انتخابی: ${bt.titleFa} (${bt.id})`, bt.id);

    // Drain remaining Phase 1 questions
    while (engine.getCurrentQuestion() && engine.currentPhase === 1) {
      const q = engine.getCurrentQuestion();
      const opt = q.options && q.options.length > 0 ? q.options[0] : { text: "پاسخ پیش‌فرض", value: "opt_val" };
      engine.processUserResponse(opt.text, opt.value);
    }
    engine.completedPhases[1] = true;

    // Run Phases 2 -> 8
    for (let ph = 2; ph <= 8; ph++) {
      engine.startPhase(ph);
      while (engine.getCurrentQuestion() && engine.currentPhase === ph) {
        const q = engine.getCurrentQuestion();
        const opt = q.options && q.options.length > 0 ? q.options[0] : { text: "پاسخ پیش‌فرض", value: "opt_val" };
        engine.processUserResponse(opt.text, opt.value);
      }
      engine.completedPhases[ph] = true;
    }

    // Generate Master Brand Book Deliverable
    const masterData = engine.generateDeliverableData("master");
    const masterMd = engine.generateMarkdownText("master");

    assert(masterData !== null && masterData.title.length > 0, `[${sector.name}] Master deliverable object created`);
    assert(masterMd.length > 3000, `[${sector.name}] Master markdown length (${masterMd.length} chars) > 3000 chars`);

    // Verify Zero malformed strings
    assert(!masterMd.includes("[object Object]"), `[${sector.name}] Zero [object Object] in master markdown`);
    assert(!masterMd.includes(":undefined") && !masterMd.includes("undefined"), `[${sector.name}] Zero undefined in master markdown`);
    assert(!masterMd.includes("NaN"), `[${sector.name}] Zero NaN in master markdown`);

    // Verify ISIC or Guild reference
    assert(masterMd.includes(sector.id), `[${sector.name}] Master markdown includes taxonomy ID ${sector.id}`);
    assert(masterMd.includes(bt.iranianGuildCode), `[${sector.name}] Master markdown includes authentic Iranian guild code ${bt.iranianGuildCode}`);

    // Verify all 5 layers are present
    assert(masterData.sections.length >= 8, `[${sector.name}] Master deliverable contains all phase sections`);
    assert(masterMd.includes("اقتصاد و سنجه‌ها"), `[${sector.name}] Economics/metrics semantic section is present without fabricating formulas`);
    assert(masterMd.includes("[SYSTEM_CONTEXT]"), `[${sector.name}] Classification remains labeled as system context separately from user facts`);
  }
}

console.log('\n======================================================================');
console.log(`🏁 MILESTONE 14 FINISHED: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
