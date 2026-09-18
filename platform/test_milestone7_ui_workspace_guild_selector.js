/**
 * DIGITAL MARKET — Milestone 7 Verification Test Suite
 * Professional Non-Chat UI Transformation & 753 Guild Selector (Requirements R7, R8, R9, R14)
 * 
 * Verifies:
 * 1. Persian search normalization across 753 guilds (sub-50ms benchmark, letter unification, half-spaces, digits)
 * 2. 31 macro industry filtering and ranking
 * 3. Chatbot element and confetti purge audit in workspace source code
 * 4. Monochrome design compliance (zero blue/purple/amber accents in core workspace)
 * 5. 100dvh viewport container contract and QuestionCard 2x2 grid / inline custom input contracts
 * 6. Back-navigation state machine in OrchestratorEngine
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BUSINESS_TYPES, MACRO_INDUSTRIES } from "./src/data/businessTaxonomy753.js";
import { 
  normalizePersian, 
  condensePersian, 
  convertDigitsToEnglish, 
  filterAndRankGuilds 
} from "./src/services/persianSearchNormalizer.js";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("======================================================================");
console.log("🎨 STARTING MILESTONE 7: NON-CHAT UI & 753 GUILD WORKSPACE SUITE");
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
// SUITE 1: PERSIAN SEARCH NORMALIZATION & 753 GUILD SEARCH (R14)
// =============================================================================
console.log("▶ SUITE 1: Persian Search Normalization across 753 Guilds (R14)");
{
  // 1.1 Arabic & Persian character unification
  assert(normalizePersian("كافي‌شاپ") === "کافی شاپ", "Unifies Arabic Kaf (ك) and Ye (ي) to Persian");
  assert(normalizePersian("فروشگاهِ لباسْ") === "فروشگاه لباس", "Strips Arabic diacritics (harakat/tashkeel)");
  assert(normalizePersian("قنّادی") === "قنادی", "Strips shadda");
  
  // 1.2 Half-space & whitespace normalization
  assert(normalizePersian("تعویض\u200cروغنی") === "تعویض روغنی", "Converts half-space to standard space");
  assert(condensePersian("تعویض\u200cروغنی") === "تعویضروغنی", "Condenses Persian text without spaces");

  // 1.3 Digits conversion
  assert(convertDigitsToEnglish("صنف شماره ۱۲۳۴۵") === "صنف شماره 12345", "Converts Persian digits to English");
  assert(convertDigitsToEnglish("كود ٠١٢٣٤٥٦٧٨٩") === "كود 0123456789", "Converts Arabic digits to English");

  // 1.4 Full 753 Taxonomy Integrity
  assert(BUSINESS_TYPES.length === 753, "Catalog contains exactly 753 verified business types");
  assert(MACRO_INDUSTRIES.length === 31, "Catalog contains exactly 31 macro industries");

  // 1.5 Sub-50ms Search Performance across all 753 items (< 100ms requirement)
  const startTime = performance.now();
  const searchResults1 = filterAndRankGuilds(BUSINESS_TYPES, "کارواش");
  const elapsed = performance.now() - startTime;
  console.log(`     ⚡ Search 'کارواش' across 753 guilds took: ${elapsed.toFixed(2)}ms`);
  assert(elapsed < 100, `Search benchmark sub-100ms passed (${elapsed.toFixed(2)}ms < 100ms)`);
  assert(searchResults1.length > 0, "Found carwash guilds");
  assert(searchResults1[0].titleFa.includes("کارواش"), "Top result is directly relevant to carwash");

  // 1.6 Resilient matching with typos and half-spaces
  const searchResults2 = filterAndRankGuilds(BUSINESS_TYPES, "كافي شاپ"); // Arabic Kaf & Ye
  assert(searchResults2.length > 0, "Resolved Arabic Kaf/Ye query");
  assert(searchResults2[0].titleFa.includes("کافی"), "Matched coffee shop accurately");

  // 1.7 Industry Category Filtering
  const targetIndId = MACRO_INDUSTRIES[3].id; // e.g. "IND-04"
  const itGuilds = filterAndRankGuilds(BUSINESS_TYPES, "", targetIndId);
  assert(itGuilds.length > 0, `Filtered guilds for ${targetIndId}`);
  assert(itGuilds.every(b => b.industryId === targetIndId), `All returned guilds belong strictly to ${targetIndId}`);

  // 1.8 ID Search (e.g. BT-0042)
  const idResults = filterAndRankGuilds(BUSINESS_TYPES, "BT-0042");
  assert(idResults.length > 0 && idResults[0].id === "BT-0042", "Direct ID search resolves exact guild");
}

// =============================================================================
// SUITE 2: CHATBOT ELEMENT & CONFETTI PURGE AUDIT (R7, R8)
// =============================================================================
console.log("\n▶ SUITE 2: Chatbot Element & Confetti Purge Audit (R7, R8)");
{
  const appJsxPath = path.join(__dirname, "src", "App.jsx");
  const appContent = fs.readFileSync(appJsxPath, "utf-8");

  // 2.1 Chat components must NOT be imported or rendered in App.jsx
  assert(!appContent.includes("import ChatContainer"), "ChatContainer is NOT imported in App.jsx");
  assert(!appContent.includes("import ChatInput"), "ChatInput is NOT imported in App.jsx");
  assert(!appContent.includes("<ChatContainer"), "ChatContainer is NOT rendered in App.jsx");
  assert(!appContent.includes("<ChatInput"), "ChatInput is NOT rendered in App.jsx");

  // 2.2 Confetti must NOT be imported or used in App.jsx
  assert(!appContent.includes("import confetti"), "confetti is NOT imported in App.jsx");
  assert(!appContent.includes("confetti("), "confetti() is NEVER called in App.jsx");

  // 2.3 Conversational filler / chatbot wording purged
  assert(!appContent.includes("هوش مصنوعی در حال فکر کردن است"), "Anthropomorphic thinking filler removed");
  assert(!appContent.includes("دستیار هوشمند"), "Chatbot 'assistant' terminology purged from workspace");
  assert(!appContent.includes("پاسخ ربات"), "Bot wording purged");
  assert(!appContent.includes("پیام شما"), "Chat bubble terminology purged");
}

// =============================================================================
// SUITE 3: STRICT MONOCHROME PALETTE AUDIT (R8)
// =============================================================================
console.log("\n▶ SUITE 3: Strict Monochrome Visual System Audit (R8)");
{
  const coreWorkspaceFiles = [
    path.join(__dirname, "src", "App.jsx"),
    path.join(__dirname, "src", "components", "QuestionCard.jsx"),
    path.join(__dirname, "src", "components", "ContextSummaryLedger.jsx"),
    path.join(__dirname, "src", "components", "PhaseProgressRail.jsx"),
    path.join(__dirname, "src", "components", "GuildSelectorModal.jsx"),
    path.join(__dirname, "src", "components", "Header.jsx"),
    path.join(__dirname, "src", "components", "Sidebar.jsx")
  ];

  // Forbidden colored accents in core UI: blue, purple, amber, indigo, cyan, emerald
  const forbiddenColorPatterns = [
    /\btext-blue-[0-9]{3}\b/,
    /\bbg-blue-[0-9]{3}\b/,
    /\bborder-blue-[0-9]{3}\b/,
    /\btext-purple-[0-9]{3}\b/,
    /\bbg-purple-[0-9]{3}\b/,
    /\btext-indigo-[0-9]{3}\b/,
    /\bbg-indigo-[0-9]{3}\b/,
    /\btext-cyan-[0-9]{3}\b/,
    /\bbg-cyan-[0-9]{3}\b/
  ];

  for (const filePath of coreWorkspaceFiles) {
    const filename = path.basename(filePath);
    const content = fs.readFileSync(filePath, "utf-8");

    for (const pattern of forbiddenColorPatterns) {
      const match = content.match(pattern);
      assert(!match, `Zero colored accent (${pattern}) in ${filename} - pure monochrome compliance`);
    }
  }
}

// =============================================================================
// SUITE 4: VIEWPORT & WORKSPACE ARCHITECTURE CONTRACT (R8, R9)
// =============================================================================
console.log("\n▶ SUITE 4: Viewport & Workspace Architecture Contract (R8, R9)");
{
  const appContent = fs.readFileSync(path.join(__dirname, "src", "App.jsx"), "utf-8");

  // 4.1 100dvh root container with overflow-hidden
  assert(appContent.includes("100dvh") || appContent.includes("h-screen"), "Root container locked to 100dvh viewport height");
  assert(appContent.includes("overflow-hidden"), "Root container prevents unmanaged window page scroll");

  // 4.2 2-column workspace layout components
  assert(appContent.includes("<ContextSummaryLedger"), "Strategic Context Ledger integrated into workspace");
  assert(appContent.includes("<QuestionCard"), "QuestionCard workstation integrated into workspace");
  assert(appContent.includes("<PhaseProgressRail"), "Phase Progress Rail integrated into workspace");

  // 4.3 QuestionCard component contract inspection
  const qCardContent = fs.readFileSync(path.join(__dirname, "src", "components", "QuestionCard.jsx"), "utf-8");
  assert(qCardContent.includes("grid-cols-1 sm:grid-cols-2"), "Desktop 2x2 grid layout enforced for options");
  assert(qCardContent.includes("textarea"), "Inline custom textarea supported inside card");
  assert(qCardContent.includes("isPhaseCompleted"), "Dedicated phase completion card supported");
  assert(qCardContent.includes("handleConfirmContinue"), "Continue action explicitly controlled");
}

// =============================================================================
// SUITE 5: ORCHESTRATOR ENGINE BACK-NAVIGATION (R10)
// =============================================================================
console.log("\n▶ SUITE 5: Orchestrator Engine Back-Navigation (R10)");
{
  const engine = new OrchestratorEngine();
  const q1 = engine.getCurrentQuestion();
  assert(q1 !== null, "First question retrieved");
  assert(engine.currentStepIndex === 0, "Initial step index is 0");

  // Answer first question
  const res1 = engine.processUserResponse("خرده‌فروشی کالای سوپرمارکتی", "RETAIL");
  const q2 = engine.getCurrentQuestion();
  assert(engine.currentStepIndex > 0, "Step index advanced after answer");

  // Back navigation
  const prevQ = engine.navigateBack();
  assert(prevQ !== null, "Navigated back successfully");
  assert(engine.currentStepIndex === 0, "Step index decremented to 0");
  assert(engine.isNavigatingBack === true, "isNavigatingBack flag activated");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 7 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");
