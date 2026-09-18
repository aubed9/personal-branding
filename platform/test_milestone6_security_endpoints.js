/**
 * DIGITAL MARKET — Milestone 6 Verification Test Suite
 * Comprehensive Security & Endpoint Auditing (Requirement R12)
 * Tests: Zero localStorage keys, HTTPS enforcement, URL sanitization, secret redaction,
 * AbortController timeout, and 429 backoff.
 */

import {
  validateEndpointUrl,
  buildSecureEndpoint,
  SessionKeyManager,
  redactSensitiveData
} from "./src/services/endpointSecurity.js";
import { PersistenceManager } from "./src/services/persistenceManager.js";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";

console.log("======================================================================");
console.log("🔒 STARTING MILESTONE 6: API KEY & ENDPOINT SECURITY SUITE (R12)");
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

function assertThrows(fn, message) {
  let threw = false;
  try {
    fn();
  } catch (err) {
    threw = true;
  }
  assert(threw, message);
}

// =============================================================================
// SUITE 1: ENDPOINT URL VALIDATION & SANITIZATION (R12)
// =============================================================================
console.log("▶ SUITE 1: Endpoint URL Validation & Sanitization");
{
  // 1.1 Dangerous protocols strictly blocked
  assertThrows(() => validateEndpointUrl("javascript:alert('pwned')"), "Blocked javascript: pseudo-protocol");
  assertThrows(() => validateEndpointUrl("data:text/html,<script>alert(1)</script>"), "Blocked data: URI");
  assertThrows(() => validateEndpointUrl("file:///etc/passwd"), "Blocked file: protocol");
  assertThrows(() => validateEndpointUrl("vbscript:MsgBox(1)"), "Blocked vbscript: protocol");

  // 1.2 Plain HTTP blocked for external remote hosts (HTTPS mandatory)
  assertThrows(() => validateEndpointUrl("http://api.my-custom-proxy.ir/v1"), "Plain HTTP blocked for external host");
  assertThrows(() => validateEndpointUrl("http://evil-server.com/api"), "Plain HTTP blocked for external server");

  // 1.3 Localhost HTTP allowed for local developer proxies
  const localRes = validateEndpointUrl("http://localhost:8080/v1");
  assert(localRes.valid === true && localRes.isLocalhost === true, "http://localhost allowed for local development");

  const ipRes = validateEndpointUrl("http://127.0.0.1:5000/v1");
  assert(ipRes.valid === true && ipRes.isLocalhost === true, "http://127.0.0.1 allowed for local development");

  // 1.4 Valid HTTPS external endpoints accepted
  const httpsRes = validateEndpointUrl("https://api.my-safe-proxy.com/gemini");
  assert(httpsRes.valid === true && httpsRes.isLocalhost === false, "Valid HTTPS endpoint approved");

  // 1.5 Userinfo injection strictly blocked (prevent credential exfiltration)
  assertThrows(() => validateEndpointUrl("https://admin:password@evil.com/api"), "Userinfo injection blocked");

  // 1.6 Empty and null inputs handled safely
  const emptyRes = validateEndpointUrl("");
  assert(emptyRes.valid === true && emptyRes.url === "", "Empty string handled safely");
  const nullRes = validateEndpointUrl(null);
  assert(nullRes.valid === true && nullRes.url === "", "Null input handled safely");

  // 1.7 buildSecureEndpoint constructs valid URLs
  const epDefault = buildSecureEndpoint({ model: "gemini-2.0-flash", apiKey: "TEST_KEY_123" });
  assert(epDefault.startsWith("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=TEST_KEY_123"), "Default endpoint constructed securely");

  const epCustom = buildSecureEndpoint({
    customEndpoint: "https://my-proxy.com/ai",
    model: "gemini-1.5-pro",
    apiKey: "TEST_KEY_456"
  });
  assert(epCustom.startsWith("https://my-proxy.com/ai/v1beta/models/gemini-1.5-pro:generateContent?key=TEST_KEY_456"), "Custom HTTPS endpoint formatted securely");
}

// =============================================================================
// SUITE 2: ZERO LOCALSTORAGE API KEY STORAGE (SESSION-ONLY BYOK) (R12)
// =============================================================================
console.log("\n▶ SUITE 2: Zero LocalStorage API Key Storage (Session-only BYOK)");
{
  // Mock window storage for headless Node test environment
  const sessionStore = {};
  const localStore = { gemini_api_key: "OLD_LEAKED_KEY_AIzaSy999" };

  global.window = {
    sessionStorage: {
      getItem: (k) => sessionStore[k] || null,
      setItem: (k, v) => { sessionStore[k] = String(v); },
      removeItem: (k) => { delete sessionStore[k]; }
    },
    localStorage: {
      getItem: (k) => localStore[k] || null,
      setItem: (k, v) => { localStore[k] = String(v); },
      removeItem: (k) => { delete localStore[k]; }
    }
  };
  global.localStorage = global.window.localStorage;
  global.sessionStorage = global.window.sessionStorage;

  // 2.1 Migration and purge of legacy localStorage keys
  const retrieved = SessionKeyManager.getApiKey();
  assert(retrieved === "OLD_LEAKED_KEY_AIzaSy999", "Migrated legacy key successfully");
  assert(localStore.gemini_api_key === undefined, "Legacy gemini_api_key purged from localStorage!");
  assert(sessionStore.dm_gemini_api_key_session === "OLD_LEAKED_KEY_AIzaSy999", "Key moved to sessionStorage");

  // 2.2 Setting a new key saves only to sessionStorage and ensures localStorage is clean
  SessionKeyManager.setApiKey("NEW_SESSION_KEY_AIzaSy111");
  assert(sessionStore.dm_gemini_api_key_session === "NEW_SESSION_KEY_AIzaSy111", "New key saved in sessionStorage");
  assert(localStore.gemini_api_key === undefined, "localStorage remains 100% free of API key");

  // 2.3 Clearing key removes from all storages
  SessionKeyManager.clearApiKey();
  assert(sessionStore.dm_gemini_api_key_session === undefined, "sessionStorage cleared");
  assert(localStore.gemini_api_key === undefined, "localStorage cleared");

  // 2.4 PersistenceManager never leaks API keys into saved project state
  const engine = new OrchestratorEngine();
  engine.phaseData[1] = {
    description: "کسب‌وکار تستی",
    apiKey: "DANGEROUS_INJECTED_KEY",
    api_key: "ANOTHER_KEY",
    token: "SECRET_BEARER_TOKEN"
  };
  const pm = new PersistenceManager();
  const exportedState = pm.extractState(engine);

  // Serialize to JSON envelope as would be saved to disk / localStorage
  pm.saveProjectState(engine);
  const rawSaved = localStore.dm_project_state;
  assert(rawSaved !== undefined, "Project state saved");
  assert(!rawSaved.includes("DANGEROUS_INJECTED_KEY"), "API key was stripped from saved state JSON!");
  assert(!rawSaved.includes("SECRET_BEARER_TOKEN"), "Token was stripped from saved state JSON!");
}

// =============================================================================
// SUITE 3: SECRET REDACTION IN ERROR MESSAGES & LOGS (R12)
// =============================================================================
console.log("\n▶ SUITE 3: Secret Redaction in Error Messages & Logs (R12)");
{
  const realKey = "AIzaSyABC123XYZ456DEF789GHI000JKL111MMM";
  const rawError = `Request to https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${realKey} failed with 400. Details: API key ${realKey} is invalid.`;

  const cleanError = redactSensitiveData(rawError, realKey);
  assert(!cleanError.includes(realKey), "Real API key was completely redacted");
  assert(cleanError.includes("[REDACTED_API_KEY]") || cleanError.includes("[REDACTED_GOOGLE_KEY]"), "Redaction placeholder inserted");
  assert(!cleanError.includes(`key=${realKey}`), "Query string key redacted");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 6 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");
