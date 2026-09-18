/**
 * DIGITAL MARKET — Milestone 8 Verification Test Suite
 * Persistence, Schema Migrations & Storage Integrity (Requirement R11)
 * 
 * Verifies:
 * 1. Versioned schema envelope format (schemaVersion, savedAt, sanitized state)
 * 2. Corrupted JSON and malformed state graceful recovery without crashes
 * 3. Schema migrations (v0 -> v1)
 * 4. Zero sensitive credentials in exported or persisted states
 * 5. Export / Import round-trip fidelity
 */

import { PersistenceManager, SCHEMA_VERSION } from "./src/services/persistenceManager.js";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";

console.log("======================================================================");
console.log("💾 STARTING MILESTONE 8: PERSISTENCE & STORAGE INTEGRITY SUITE (R11)");
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

// Mock Storage
const localStore = {};
global.window = {
  localStorage: {
    getItem: (k) => localStore[k] || null,
    setItem: (k, v) => { localStore[k] = String(v); },
    removeItem: (k) => { delete localStore[k]; }
  }
};
global.localStorage = global.window.localStorage;

// =============================================================================
// SUITE 1: VERSIONED SCHEMA ENVELOPE FORMAT (R11)
// =============================================================================
console.log("▶ SUITE 1: Versioned Schema Envelope Format (R11)");
{
  const pm = new PersistenceManager();
  const engine = new OrchestratorEngine();
  engine.currentPhase = 2;
  engine.completedPhases[1] = true;
  engine.facts.push({ id: "F-1", statement: "کسب‌وکار خرده‌فروشی است" });
  engine.decisions.push({ id: "D-1", statement: "استراتژی تمرکز بر کیفیت محلی" });

  const saved = pm.saveProjectState(engine);
  assert(saved === true, "State saved successfully to localStorage");

  const raw = localStore.dm_project_state;
  assert(typeof raw === "string", "Saved state exists as string in storage");

  const envelope = JSON.parse(raw);
  assert(envelope.schemaVersion === SCHEMA_VERSION, `Envelope contains schemaVersion (${SCHEMA_VERSION})`);
  assert(typeof envelope.savedAt === "string", "Envelope contains savedAt ISO timestamp");
  assert(typeof envelope.state === "object", "Envelope contains state object");
  assert(envelope.state.currentPhase === 2, "Persisted currentPhase is 2");
  assert(envelope.state.completedPhases[1] === true, "Persisted completedPhases[1] is true");
}

// =============================================================================
// SUITE 2: CORRUPTED STATE RECOVERY & TOLERANCE (R11)
// =============================================================================
console.log("\n▶ SUITE 2: Corrupted State Recovery & Tolerance (R11)");
{
  const pm = new PersistenceManager();

  // 2.1 Truncated/Corrupt JSON
  localStore.dm_project_state = "{\"schemaVersion\": 1, \"state\": { \"currentPhase\": 2, "; // Incomplete syntax
  const engine1 = new OrchestratorEngine();
  const res1 = pm.safeLoadOrInitialize(engine1);
  assert(res1.success === false && res1.corrupted === true, "Corrupted JSON caught gracefully without unhandled exception");
  assert(res1.reason === "corrupted_json", "Corrupted reason identified");
  assert(localStore.dm_project_state === undefined, "Corrupted storage cleared to prevent crash loop");
  assert(localStore.dm_project_state_corrupt_backup !== undefined, "Corrupted data safely backed up for diagnosis");

  // 2.2 Malformed non-object JSON
  localStore.dm_project_state = "\"I am a string, not an envelope object\"";
  const engine2 = new OrchestratorEngine();
  const res2 = pm.safeLoadOrInitialize(engine2);
  assert(res2.success === false && res2.corrupted === true, "Non-object JSON caught safely");

  // 2.3 Missing required structural fields (e.g. missing phaseData)
  localStore.dm_project_state = JSON.stringify({
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    state: {
      currentPhase: 3
      // missing completedPhases and phaseData
    }
  });
  const engine3 = new OrchestratorEngine();
  const res3 = pm.safeLoadOrInitialize(engine3);
  assert(res3.success === false && res3.corrupted === true, "Missing required fields detected by schema validator");
  assert(res3.errors && res3.errors.length > 0, "Validation errors returned with Persian descriptions");

  // 2.4 Invalid phase number (e.g. phase 99)
  localStore.dm_project_state = JSON.stringify({
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    state: {
      currentPhase: 99,
      completedPhases: {},
      phaseData: {}
    }
  });
  const engine4 = new OrchestratorEngine();
  const res4 = pm.safeLoadOrInitialize(engine4);
  assert(res4.success === false && res4.corrupted === true, "Out-of-range phase number (99) rejected safely");
}

// =============================================================================
// SUITE 3: SCHEMA MIGRATIONS (v0 -> v1) (R11)
// =============================================================================
console.log("\n▶ SUITE 3: Schema Migrations (v0 -> v1) (R11)");
{
  const pm = new PersistenceManager();

  // Legacy v0 state lacking unknowns, contradictions, assumptions, phaseStatus
  const legacyV0State = {
    currentPhase: 1,
    currentStepIndex: 2,
    completedPhases: { 1: false },
    phaseData: { 1: { q1: "test" } }
  };

  const migrated = pm.migrateState(legacyV0State, 0);
  assert(Array.isArray(migrated.unknowns), "Migrated state contains initialized unknowns array");
  assert(Array.isArray(migrated.contradictions), "Migrated state contains initialized contradictions array");
  assert(Array.isArray(migrated.assumptions), "Migrated state contains initialized assumptions array");
  assert(typeof migrated.phaseStatus === "object", "Migrated state contains initialized phaseStatus object");
  assert(typeof migrated.completedPhases === "object", "Migrated state contains completedPhases object");
}

// =============================================================================
// SUITE 4: EXPORT / IMPORT ROUND-TRIP FIDELITY & SECRET PURGING (R11)
// =============================================================================
console.log("\n▶ SUITE 4: Export / Import Round-Trip Fidelity & Secret Purging (R11)");
{
  const pm = new PersistenceManager();
  const engine = new OrchestratorEngine();
  engine.currentPhase = 3;
  engine.completedPhases[1] = true;
  engine.completedPhases[2] = true;
  engine.facts = [
    { id: "F-1", statement: "کارواش دارای ۵ پرسنل فعال است" },
    { id: "F-2", statement: "مشتریان عمدتا ساکنان منطقه هستند" }
  ];
  engine.decisions = [
    { id: "D-1", statement: "تاکید بر سرعت و دقت خدمات VIP" }
  ];
  engine.unknowns = [
    { id: "U-1", descriptionFa: "هزینه تمام‌شده هر شستشو دقیق محاسبه نشده", severity: "BLOCKING_UNKNOWN" }
  ];
  // Injected secrets that should NEVER be exported
  engine.phaseData[1] = {
    answer: "پاسخ کاربر",
    apiKey: "DANGEROUS_EXPORT_KEY_123",
    bearerToken: "SECRET_BEARER_999",
    userPassword: "SUPER_SECRET_PASSWORD"
  };

  // 4.1 Export to JSON
  const exportedJson = pm.exportProjectJSON(engine);
  assert(typeof exportedJson === "string", "Exported JSON generated successfully");
  assert(!exportedJson.includes("DANGEROUS_EXPORT_KEY_123"), "API key stripped from exported JSON");
  assert(!exportedJson.includes("SECRET_BEARER_999"), "Bearer token stripped from exported JSON");
  assert(!exportedJson.includes("SUPER_SECRET_PASSWORD"), "Password stripped from exported JSON");

  // 4.2 Import into fresh engine
  const targetEngine = new OrchestratorEngine();
  assert(targetEngine.currentPhase === 1, "Fresh target engine starts at phase 1");
  assert(targetEngine.facts.length === 0, "Fresh target engine has 0 facts");

  const importResult = pm.importProjectJSON(exportedJson);
  assert(importResult.success === true, "Import validated successfully");

  const restored = pm.restoreToEngine(targetEngine, importResult.state);
  assert(restored === true, "Restored state into target engine successfully");

  // Verify round-trip data fidelity
  assert(targetEngine.currentPhase === 3, "Restored engine currentPhase is 3");
  assert(targetEngine.completedPhases[1] === true, "Restored completedPhases[1] is true");
  assert(targetEngine.completedPhases[2] === true, "Restored completedPhases[2] is true");
  assert(targetEngine.facts.length === 2, "Restored engine facts count is 2");
  assert(targetEngine.facts[0].statement.includes("کارواش"), "Fact 1 content preserved accurately");
  assert(targetEngine.decisions.length === 1, "Restored decisions count is 1");
  assert(targetEngine.unknowns.length === 1, "Restored unknowns count is 1");
  assert(targetEngine.unknowns[0].severity === "BLOCKING_UNKNOWN", "Unknown severity preserved accurately");
  assert(targetEngine.phaseData[1].answer === "پاسخ کاربر", "Legitimate user data preserved intact");

  // 4.3 Malformed file import rejection
  const badImport1 = pm.importProjectJSON("{ bad json file ");
  assert(badImport1.success === false, "Bad JSON file rejected cleanly");

  const badImport2 = pm.importProjectJSON("{\"foo\": \"bar\"}"); // Missing state
  assert(badImport2.success === false, "JSON missing state envelope rejected cleanly");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 8 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");
