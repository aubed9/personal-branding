# Comprehensive Pre-Code Baseline Audit Report (Requirement R1)
**Document**: `AUDIT-BEFORE-REFACTOR.md`  
**Author**: `teamwork_preview_explorer_survey_git_audit`  
**Repository**: `https://github.com/aubed9/personal-branding`  
**Date**: 2026-09-17T01:20:00Z  
**Branch Audited**: `fix/production-hardening` (Commit: `3c34ced`)  
**Target Upstream Branch**: `main` (Commit: `5234839`)  
**Integrity Mode**: Strict Benchmark / Development (Zero test cheats, zero synthetic inflation, empirical facts only)

---

## 1. Executive Summary

This Pre-Code Baseline Audit provides an uncompromising, evidence-based assessment of the DIGITAL MARKET personal branding and business strategy platform prior to any architectural refactoring or UI redesign.

### Key Audit Findings:
1. **Git Repository Status**: The current working branch is `fix/production-hardening`, which contains 3 hardening commits (`eb47cad`, `59228dd`, `3c34ced`) positioned strictly ahead of `main` (`5234839`). The merge base with `main` is identical to `main`'s HEAD (`5234839`), confirming that `fix/production-hardening` can be fast-forward merged into `main` without conflict. Working directory has only 1 uncommitted file (`ORIGINAL_REQUEST.md`), which was updated with the latest user instructions.
2. **Pre-Code Verification Command Baseline**: All verification suites (`npm ci`, `npm test`, `npm run test:adversarial`, `npm run test:integration`, `npm run test:e2e`, `npm run test:taxonomy`, `npm run test:753`, `node simulate_100_businesses.js`, `python scripts/validate_system.py`, `npm run build`, `npm run validate`) execute with **exit code 0**.
3. **Test Integrity & Masked Defects**:
   - **R23 Fixture Flaw in `test_multi_sector_customization.js`**: Line 42 tests `trade.id === "BT-0092" ? "idea" : "active"`, but `BT-0092` does not exist in `TEST_TRADES`. Similarly, line 47 checks IDs that are not present. Consequently, **100% of tested trades run exclusively on `active` stage and `nationwide_iran`**, completely masking stage-specific and local-service bugs.
   - **Simulation 753 Bias**: `simulate_753_businesses.js` evaluates all 753 business types with `stage: 'active'`, providing zero test coverage for `idea`, `pre_launch`, `rebrand`, or other stages. In Metric 4 (M4), lines 251 and 253 double-count phase completion (`completedPhasesCount === 8` and `>= 6`), inflating the assertion count.
   - **Jargon Isolation vs. Domain Leakage**: `test_adversarial_753_jargon.js` only checks 7 corporate English acronyms (`CAC`, `LTV`, `Churn`, `DMU`, `SLA`, `Pipeline`, `Funnel`). It performs **zero validation** against cross-domain Iranian trade leakage (e.g. automotive repair vocabulary leaking into beauty salons, dental clinics, or jewelry shops).
   - **Knowledge Source Discrepancy**: `scripts/validate_system.py` confirms that while documentation claims 165 sources, exactly **49 canonical wiki articles** exist in `wiki/`. The remaining 116 are unregistered external category references.
4. **Architectural & Security Deficits**:
   - **Persistence Disconnection (R11)**: While `platform/src/services/persistenceManager.js` exists, it is **never imported or invoked anywhere in `platform/src/App.jsx`**. All state is held in ephemeral React memory; a browser refresh resets the entire session back to Phase 1 Question 0.
   - **Security Vulnerabilities (R12)**: `App.jsx` and `SettingsModal.jsx` write API keys directly to `localStorage.getItem("gemini_api_key")` in plaintext. `geminiService.js` appends API keys to arbitrary custom endpoints as query parameters (`?key=${apiKey}`) without protocol verification, timeout bounds, or AbortControllers.
   - **Monolithic Bundle (R15)**: `npm run build` generates a single JavaScript chunk of **1,958.52 kB (1.96 MB)**, largely because `businessTaxonomy753.js` (1.88 MB alone) is bundled synchronously into `main.jsx`.
   - **Chat UI Paradigms (R7/R8)**: The interface remains structured around `ChatContainer`, `MessageBubble`, `ChatInput`, bot avatars, typing dots, blue accents (`#2563eb`), and confetti celebrations, directly violating the required monochrome professional strategy workspace.
   - **Domain Specialization Collapse (R5/R6)**: `allPhasesTemplates.js` collapses all 753 trades into 4 coarse archetypes (`LOCAL_SERVICE`, `RESTAURANT_CAFE_HOSPITALITY`, `MANUFACTURER`, `SAAS_SOFTWARE`). In Phase 7 and 8, any `LOCAL_SERVICE` (even a beauty salon, dental clinic, or dry cleaner) is served car wash engine and automotive repair questions.

---

## 2. Git Repository & Branch State Audit

### 2.1 Branch Topology & Commit Log
- **Current Branch**: `fix/production-hardening`
- **Current Commit HEAD**: `3c34ced999cc94217f71098c7602ae36bf3753fa`
- **Upstream Branch**: `origin/fix/production-hardening` (in sync)
- **Base Target Branch**: `main` (`5234839746187eb1047ef0c50e031ff3d6a25477`)

```
* 3c34ced (HEAD -> fix/production-hardening, origin/fix/production-hardening) feat(simulation-hardening): purge synthetic formulas, implement empirical assertions in 753 & 100 simulations, fix dynamic question lifecycle, add React ErrorBoundary
* 59228dd docs: add comprehensive AUDIT-AND-HARDENING-REPORT.md with honest evidence-based findings
* eb47cad feat: production hardening - phase gates, unknowns, contradictions, persistence, LLM adapter, CI
* 5234839 (main) feat: initial commit - Digital Market Brand Building Engine & Platform
```

### 2.2 Detailed Inspection of the 3 Hardening Commits
1. **Commit `eb47cad` (feat: production hardening)**:
   - Introduced `phaseGateValidator.js` (313 lines): non-bypassable gates for Phases 1–8.
   - Introduced `unknownsManager.js` (189 lines): first-class `BLOCKING_UNKNOWN` and `NON_BLOCKING_UNKNOWN` state machine with `OPEN`, `RESOLVED`, `ACCEPTED_RISK` lifecycles.
   - Introduced `contradictionEngine.js` (198 lines): detection of B2C vs B2B enterprise, budget vs billboard, and local vs international scope conflicts.
   - Introduced `llmProvider.js` (267 lines): adapter pattern with `GeminiProvider` and `MockProvider`.
   - Introduced `persistenceManager.js` (296 lines): sanitization of API keys and versioned state serialization.
   - Introduced `persianSearchNormalizer.js` (348 lines): Arabic/Persian character normalization, half-spaces, and guild aliases.
   - Updated `orchestratorEngine.js`: added `canStartPhase()`, `getPhaseStatus()`, and `invalidateDependentPhases()`.
   - Added `.github/workflows/ci.yml` and `test_milestone2_gates_unknowns_contradictions.js`.
2. **Commit `59228dd` (docs: add comprehensive AUDIT-AND-HARDENING-REPORT.md)**:
   - Added documentation detailing before-and-after metrics, eliminated magic guards (`huge_val`, `xss_val`), and logged verified exit codes.
3. **Commit `3c34ced` (feat: simulation-hardening)**:
   - Replaced fixed baseline scores (96, 98.5) in `simulate_753_businesses.js` and `simulate_100_businesses.js` with assertion counts.
   - Added `platform/src/components/ErrorBoundary.jsx` (72 lines) and wrapped `App.jsx` in `main.jsx`.
   - Fixed dynamic question lifecycle flag (`consumed: true`) to avoid repeat loops.

### 2.3 Working Directory Status & Merge Feasibility
- **Uncommitted Changes**:
  ```
  Changes not staged for commit:
    modified:   ORIGINAL_REQUEST.md
  ```
  `ORIGINAL_REQUEST.md` has the latest user follow-up prompt appended.
- **Merge Base Verification**:
  ```bash
  $ git merge-base main fix/production-hardening
  5234839746187eb1047ef0c50e031ff3d6a25477
  ```
  `5234839` is exactly `main`. Therefore, `main..fix/production-hardening` is a **direct fast-forward**.
- **Merge Plan**:
  To cleanly integrate `fix/production-hardening` into `main`:
  1. Commit or stash `ORIGINAL_REQUEST.md`.
  2. Switch to `main`: `git checkout main`.
  3. Execute fast-forward merge: `git merge --ff-only fix/production-hardening`.
  4. Both branches will point to `3c34ced` with 0 merge conflicts.

---

## 3. Pre-Code Baseline Verification Command Ledger

Every required baseline verification command was executed directly on Windows PowerShell / cmd. The exact execution directory, exit code, execution time, stdout, and stderr were recorded.

### 3.1 Summary Table

| Command | Execution Directory | Exit Code | Duration | Output Summary / Findings |
|---|---|---|---|---|
| `npm.cmd ci` | `d:\personal branding\platform` | **0** | 59.1s | 137 added, 138 audited, 0 vulnerabilities |
| `npm.cmd test` | `d:\personal branding\platform` | **0** | 2.4s | 186/186 passed (117 harmonization + 69 gates/unknowns) |
| `npm.cmd run test:unit` | `d:\personal branding\platform` | **0** | 1.2s | 117/117 passed (runtime harmonization suite) |
| `npm.cmd run test:gates` | `d:\personal branding\platform` | **0** | 1.1s | 69/69 passed (milestone 2 gates & contradictions) |
| `npm.cmd run test:adversarial` | `d:\personal branding\platform` | **0** | 8.2s | 206/206 passed (187 challenger + 19 jargon isolation) |
| `npm.cmd run test:integration` | `d:\personal branding\platform` | **0** | 1.9s | 48/48 passed (masks stage bugs due to R23 fixture flaw) |
| `npm.cmd run test:e2e` | `d:\personal branding\platform` | **0** | 2.1s | Full 8-phase journey (car wash BT-0136) passed |
| `npm.cmd run test:taxonomy` | `d:\personal branding\platform` | **0** | 0.9s | 753 entries verified in `businessTaxonomy753.js` |
| `npm.cmd run test:753` | `d:\personal branding\platform` | **0** | 98.8s | 753/753 simulated, all passed (100% active stage bias) |
| `node simulate_100_businesses.js` | `d:\personal branding\platform` | **0** | 14.8s | 100/100 simulated, 900 deliverables generated |
| `python scripts/validate_system.py`| `d:\personal branding` | **0** | 4.1s | 41/42 passed, 1 warning (165 vs 49 wiki sources) |
| `npm.cmd run build` | `d:\personal branding\platform` | **0** | 12.1s | Vite build passed: 1.96 MB JS chunk warning |
| `npm.cmd run validate` | `d:\personal branding\platform` | **0** | 13.5s | All test suites chained passed cleanly |

---

### 3.2 Exact Command Outputs & Logs

#### 1. `npm.cmd ci`
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Execution Log**:
  ```
  added 137 packages, and audited 138 packages in 59s
  26 packages are looking for funding
    run `npm fund` for details
  found 0 vulnerabilities
  ```

#### 2. `npm.cmd test`
- **Command**: `node test_runtime_harmonization.js && node test_milestone2_gates_unknowns_contradictions.js`
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Execution Log Excerpt**:
  ```
  ▶ TEST 1: Full 8-Phase Transition & Artifact Delivery (Local Automotive Service)
    ✅ PASS: P1 Step 0 is step0_description
    ...
    ✅ PASS: Grand Finale is triggered upon Phase 8 completion (BUG FIX VERIFIED!)
    ✅ PASS: Master deliverable contains M0 through M8
  ▶ TEST 2: Specialty Coffee Roastery & Cafe Hospitality (Classified as RESTAURANT_CAFE_HOSPITALITY)
  ▶ TEST 3: Heavy Industrial Parts & Tooling Factory B2B (Classified as MANUFACTURER)
  ▶ TEST 4: B2B Cloud Accounting SaaS Platform (Classified as SAAS_SOFTWARE)
  ▶ TEST 5: Personal Brand, Creator & Coaching (Classified as CREATOR_MEDIA_EDUCATION)
  ▶ TEST 6: Adaptation Rules Completeness (Phases 1 to 8)
  ▶ TEST 7: Precedence Verification: Explicit descVal Overrides Heuristic Keywords
  ======================================================
  🎉 ALL 117/117 HARMONIZATION TESTS PASSED CLEANLY!
  ======================================================
  ▶ SUITE 1: Phase Gate Validator Unit Tests (20 assertions passed)
  ▶ SUITE 2: Anti-Skip Protocol & Phase Progression Enforcement (18 assertions passed)
  ▶ SUITE 3: Contradiction Engine & Semantic Conflict Detection (12 assertions passed)
  ▶ SUITE 4: Downstream Invalidation on Foundational Decisions Change (13 assertions passed)
  ▶ SUITE 5: Verification of Test Magic Guard Purge (2 assertions passed)
  ======================================================
  🏆 ALL MILESTONE 2 TESTS COMPLETED: 69 PASSED, 0 FAILED!
  ======================================================
  ```

#### 3. `npm.cmd run test:adversarial`
- **Command**: `node test_adversarial_challenger.js && node test_adversarial_753_jargon.js`
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Execution Log Excerpt**:
  ```
  ▶ SUITE 1: State Invariant Stress Testing (18 assertions passed)
  ▶ SUITE 2: Adversarial & Boundary Input Handling (28 assertions passed)
  ▶ SUITE 3: Dynamic Adaptive Question Flow Integrity (26 assertions passed)
  ▶ SUITE 4: Multi-Dimensional Context Classification Matrix (25 assertions passed)
  ▶ SUITE 5: Phase 2 Branching Isolation & Terminology Leakage Audit (25 assertions passed)
  ▶ SUITE 6: Deliverable Generator Stress & Markdown Consistency (15 assertions passed)
  ======================================================================
  🏆 ALL ADVERSARIAL STRESS TESTS COMPLETED: 187 PASSED, 0 FAILED!
  ======================================================================
  --- TEST SUITE 1: Taxonomy Registry Completeness & Continuity ---
    ✅ PASS: Exactly 31 macro industries found (actual: 31)
    ✅ PASS: Exactly 753 business types found (actual: 753)
    ✅ PASS: Continuous IDs from BT-0001 to BT-0753 with zero gaps or duplicates
  --- TEST SUITE 2: Deliverables Ledger File Validation ---
    ✅ PASS: Complete 753 business entries present in ledger table
  --- TEST SUITE 3: Rigorous Jargon Isolation Audit ---
    Identified 245 local and traditional trade types for deep jargon isolation audit.
    Total questions/options inspected in local trades: 600
    Total corporate jargon violations detected: 0
  --- TEST SUITE 4: 4 Quality Metrics Verification ---
    Calculated Average M1: 100.00%
    Calculated Average M2: 100.00%
    Calculated Average M3: 100.00%
    Calculated Average M4: 100.00%
  ======================================================================
  🏁 AUDIT FINISHED: 19 PASSED, 0 FAILED
  ======================================================================
  ```

#### 4. `npm.cmd run test:integration` (`node test_multi_sector_customization.js`)
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Output**: 8 trades tested (`BT-0014`, `BT-0066`, `BT-0100`, `BT-0101`, `BT-0003`, `BT-0221`, `BT-0166`, `BT-0496`), 48/48 assertions passed.
- **Audit Observation**: Highlights the fixture masking issue (detailed in Section 4).

#### 5. `npm.cmd run test:753` (`node simulate_753_businesses.js`)
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Duration**: `98.8 seconds`
- **Output Summary**:
  ```
  Total Businesses Simulated       : 753 / 753
  Average M1 (Problem-Solving)     : 100%
  Average M2 (Context & Zero Jargon: 100%
  Average M3 (Zero Hallucination)  : 100%
  Average M4 (Exit Gates & Docs)   : 100%
  Overall Average Composite Score  : 100% (Target: >= 96.0%)
  Pass Rate                        : 100.0% (753/753)
  Local Trades Audited for Jargon  : 216
  Corporate Jargon Violations      : 0 (Zero Tolerance)
  📄 Successfully generated: deliverables/753_BUSINESS_SIMULATIONS.md
  ```

#### 6. `python scripts/validate_system.py`
- **Directory**: `d:\personal branding`
- **Exit Code**: `0`
- **Output Summary**:
  ```
  Total Tests Evaluated : 42
  Passed                : 41 (97.6%)
  Failed                : 0
  Warnings              : 1
  >>> SYSTEM STATUS: ALL VALIDATIONS PASSED <<<
  ```
  - **Warning**: `Source Count -> Documentation claims 165 sources, but only 49 wiki nodes exist. Claim includes 116 unregistered references from llm-wiki categories.`

#### 7. `npm.cmd run build`
- **Directory**: `d:\personal branding\platform`
- **Exit Code**: `0`
- **Duration**: `12.08s`
- **Output**:
  ```
  dist/index.html                     1.36 kB │ gzip:   0.80 kB
  dist/assets/index-Dd9lX0MZ.css     38.69 kB │ gzip:   7.09 kB
  dist/assets/index-Dp5-mNam.js   1,958.52 kB │ gzip: 335.28 kB
  (!) Some chunks are larger than 500 kB after minification.
  ```

---

## 4. Test Suite Quality Audit: Real Behavior vs Circular & Decorative Mocking

| Test File | Status | What It Actually Measures | Circular Mocking / Hardcoded Flaws Identified |
|---|---|---|---|
| `test_runtime_harmonization.js` | Real | End-to-end 8-phase state accumulation on 5 core archetypes | Relies on legacy `descVal` strings (`local_automotive_service`, etc.) rather than purely dynamic `BT-xxxx` resolution |
| `test_milestone2_gates_unknowns_contradictions.js` | Real | Phase gate blockers, unknown severity levels, anti-skip rejections, contradiction engine triggers | Tests memory state of `OrchestratorEngine` only; does not test UI or persistence |
| `test_adversarial_challenger.js` | Real | Adversarial inputs (null, empty, long strings, XSS characters), phase isolation | Relies on hardcoded keywords in Phase 2 option texts |
| `test_adversarial_753_jargon.js` | Decorative/Fragile | Presence of 7 English corporate acronyms in local trades | Checks against generated markdown file `753_BUSINESS_SIMULATIONS.md`, not dynamic user inputs; ignores Persian domain vocabulary leakage |
| `test_multi_sector_customization.js` | Masked Defect (R23) | Tailoring of diagnostic probing titles and options for 8 trades | **Hardcoded unreachable IDs** in lines 42 & 47; 100% of runs execute on `active` and `nationwide_iran` |
| `simulate_753_businesses.js` | Partial Integrity | Full execution of 753 business journeys through Phases 1–8 | Evaluates **only `stage: 'active'`**; M4 assertion double-counts phase completions; M2 assertion for non-local trades only verifies basic object existence |
| `simulate_100_businesses.js` | Partial Integrity | Multi-phase generation for 100 diverse Iranian businesses | Produces identical 100.00% scores across all 100 businesses; zero failure scenario injection |
| `scripts/validate_system.py` | Real | Independent schema, taxonomy continuity, durable ID, and secret scanning | Correctly flags 165 vs 49 source count inflation as a warning |

### Detailed Defect Trace: `test_multi_sector_customization.js` (R23)
In `platform/test_multi_sector_customization.js`:
```javascript
// Line 3-12: Tested trades
const TEST_TRADES = [
  { id: "BT-0014", name: "طلا، جواهر و نقره‌فروشی", sector: "RETAIL" },
  { id: "BT-0066", name: "کافه تخصصی و رستری موج سوم", sector: "FOOD_HOSPITALITY" },
  { id: "BT-0100", name: "کلینیک تخصصی دندانپزشکی و ایمپلنت", sector: "HEALTHCARE" },
  { id: "BT-0101", name: "کلینیک پوست، مو، زیبایی و لیزر", sector: "BEAUTY" },
  { id: "BT-0003", name: "سوپرمارکت و هایپرمارکت محلی", sector: "RETAIL" },
  { id: "BT-0221", name: "کارخانه قالب‌سازی صنعتی", sector: "MANUFACTURING" },
  { id: "BT-0166", name: "نرم‌افزار حسابداری ابری", sector: "SAAS_TECH" },
  { id: "BT-0496", name: "موسسه آموزش زبان‌های خارجی", sector: "EDUCATION_CREATOR" }
];

// Line 41-42:
// Step 3: Answer stage (choose idea for half, active for half)
const stageVal = trade.id === "BT-0092" ? "idea" : "active";

// Line 46-47:
// Step 4: Answer geography (local for retail/beauty/health, national for others)
const geoVal = ["BT-0092", "BT-0045", "BT-0010", "BT-0310"].includes(trade.id) ? "local_city" : "nationwide_iran";
```
Because `BT-0092`, `BT-0045`, `BT-0010`, and `BT-0310` are not in `TEST_TRADES`:
- `stageVal` is `"active"` for **all 8 trades**. The comment claims half are `idea`, but `idea` is never executed.
- `geoVal` is `"nationwide_iran"` for **all 8 trades**, even for neighborhood dental clinics and local supermarkets.

---

## 5. Current Architecture & Dependency Flow Across `platform/src/`

### 5.1 File Map of `platform/src/`

```
platform/src/
├── main.jsx                            # Entry point: renders App inside ErrorBoundary
├── App.jsx                             # Main orchestrator: React state, modal management, chat flow
├── index.css                           # Global styling, Tailwind directives, glassmorphic styles
├── components/
│   ├── ErrorBoundary.jsx               # React 18 class error boundary catching render crashes
│   ├── Header.jsx                      # Top navigation bar: phase progress, wiki/settings triggers
│   ├── Sidebar.jsx                     # Left navigation rail: phase selector, evidence stats
│   ├── ChatContainer.jsx               # Chat timeline: scroll container, bot indicators, options dock
│   ├── MessageBubble.jsx               # Speech bubble renderer (user bubble vs assistant bot bubble)
│   ├── ChatInput.jsx                   # Fixed bottom dock with multiline textarea & send icon
│   ├── QuickOptions.jsx                # Render list of option buttons, unknown trigger, guild modal trigger
│   ├── GuildSelectorModal.jsx          # Search and selector modal for 753 business types
│   ├── DeliverableModal.jsx            # Modal displaying Phase 1-8 markdown deliverables
│   ├── SettingsModal.jsx               # API key, Gemini model, custom endpoint configuration
│   └── WikiModal.jsx                   # 49 canonical playbooks viewer
├── data/
│   ├── businessTaxonomy753.js          # SSOT for 753 business types & 31 macro industries (1.88 MB)
│   ├── businessContextRouter.js        # 15-axis classification engine & phase adaptation rules
│   ├── persianSearchNormalizer.js      # Persian character normalization, aliases, fuzzy matcher (isolated)
│   ├── phase1Templates.js              # Phase 1 question templates and phase metadata
│   ├── phase2Templates.js              # Phase 2 market research adaptive question templates
│   ├── allPhasesTemplates.js           # Phases 2–8 archetype-based question templates
│   └── wikiKnowledge.js               # Runtime subset of canonical wiki playbooks (49 articles)
└── services/
    ├── orchestratorEngine.js           # Core state machine: phase gating, response processing, deliverables
    ├── dynamicQuestionEngine.js        # Question composition formula & dynamic slot injection
    ├── phaseGateValidator.js           # Verification rules for phase completion gates (Phases 1–8)
    ├── unknownsManager.js              # UNKNOWN state entity lifecycle (OPEN, RESOLVED, ACCEPTED_RISK)
    ├── contradictionEngine.js          # Semantic contradiction detector & blocker
    ├── semanticParser.js               # Freeform text slot extraction & intent detector
    ├── persistenceManager.js           # LocalStorage save/restore & project JSON import/export (isolated)
    ├── llmProvider.js                  # Adapter interface (GeminiProvider, MockProvider)
    ├── geminiService.js                # Direct Gemini API integration & delimiter text parser
    └── deliverableGenerator.js         # 5-layer algorithmic deliverable generator (Phases 1–8 + Master)
```

### 5.2 Single Sources of Truth (SSOT) Audit

1. **Business Taxonomy SSOT**:
   - **Canonical Location**: `platform/src/data/businessTaxonomy753.js`.
   - **Exports**: `BUSINESS_TYPES` (753 objects), `BUSINESS_TYPES_MAP` (key-by-ID lookup), `MACRO_INDUSTRIES` (31 industries), `ARCHETYPE_DEFINITIONS`.
   - **Status**: Complete and structurally sound (verified by `scripts/validate_system.py`), but causes severe initial bundle bloat (1.88 MB).
2. **Question Templates SSOT**:
   - **Canonical Locations**:
     - `platform/src/data/phase1Templates.js` (Phase 1 base steps)
     - `platform/src/data/phase2Templates.js` (Phase 2 research steps)
     - `platform/src/data/allPhasesTemplates.js` (Phases 2–8 archetype steps)
     - `platform/src/services/dynamicQuestionEngine.js` (dynamic assembly formula)
   - **Status**: Fragmented. `dynamicQuestionEngine.js` defines dynamic formulas that partially duplicate the questions in `allPhasesTemplates.js`. Furthermore, `allPhasesTemplates.js` discards the specific `taxonomyId` and 15 axes, collapsing questions into only 4 archetypes.
3. **State Management SSOT**:
   - **Canonical Location**: `platform/src/services/orchestratorEngine.js`.
   - **In-Memory Schema**:
     - `currentPhase` (integer 1–8)
     - `currentStepIndex` (integer)
     - `completedPhases` (object `{ 1: bool, ..., 8: bool }`)
     - `phaseStatus` (object `{ [phase]: "COMPLETED" | "IN_PROGRESS" | "LOCKED" | "INVALIDATED" }`)
     - `phaseData` (object `{ 1: {}, ..., 8: {} }`)
     - `facts` (array of `{ id, statement }`)
     - `decisions` (array of `{ id, statement, source, timestamp }`)
     - `assumptions` (array of `{ id, statement, actionItem }`)
     - `unknowns` (array of typed unknown objects)
     - `contradictions` (array of typed contradiction objects)
     - `businessContext` (classified 15-axis profile object)
   - **Status**: Robust state machine within `OrchestratorEngine`, but completely detached from browser persistence.
4. **Knowledge Base SSOT**:
   - **Disk Source**: `wiki/registry.yaml` + 49 markdown articles in `wiki/`.
   - **Runtime Source**: `platform/src/data/wikiKnowledge.js`.
   - **Status**: Disconnected duplication. `wikiKnowledge.js` manually replicates a subset of the wiki articles in JavaScript format instead of using a build-time compilation script.

---

## 6. End-to-End Strategic Flow: From Guild Selection to Master Deliverable

### 6.1 Step-by-Step User Journey

```
[User Launches Platform]
          │
          ▼
[Phase 1: Question 0 — Step 0 Description]
  - User selects guild from 753 catalog (e.g. BT-0136) OR enters freeform text
          │
          ▼
[Phase 1: Question 1 — Step 0 Diagnostic Probing]
  - Probes founder vision: "دیدگاه و هویت بنیان‌گذار در صنف..."
          │
          ▼
[Phase 1: Questions 2 to 6 — Stage, Geography, Primary Goal, Core Offer, Value Hypothesis]
  - 15 Context Axes dynamically classified: classifyBusinessContext()
  - Unknown-aware capture: "نمی‌دانم" registers UNKNOWN hypothesis without fake numbers
          │
          ▼
[Phase 1 Gate Validation: validatePhaseGate(1)]
  - Checks: description, stage, geography, primaryGoal, coreOffer, valueHypothesis
  - Checks: 0 unresolved BLOCKING_UNKNOWN, 0 critical CONTRADICTION
  - If PASSED: completedPhases[1] = true; Phase 2 becomes AVAILABLE
  - If BLOCKED: Phase remains locked; Persian remediation instructions displayed
          │
          ▼
[Phases 2 to 7: Sequential Execution]
  - Phase 2: Market & Competitor Intelligence
  - Phase 3: Brand Strategy & Only-ness Frame
  - Phase 4: Psychological Brand Character & Archetypes
  - Phase 5: Verbal Identity & Elevator Hook
  - Phase 6: Naming, Tagline & Creative Direction
  - Phase 7: Visual Identity & Design Tokens
  * Anti-Skip Protocol: Attempting to call startPhase(N) without Phase N-1 completion throws GateBlockedError
  * Downstream Invalidation: Modifying Phase 1 or 2 resets downstream completedPhases to false with INVALIDATED status
          │
          ▼
[Phase 8: Executive Activation & Commercial Funnel]
  - Thought leadership, PR/podcast roadmap, lead acquisition funnel, crisis playbook
          │
          ▼
[Phase 8 Gate Validation: validatePhaseGate(8)]
  - Grand Finale Trigger: All 8 phases marked true
          │
          ▼
[Master Deliverable Generation: generateDeliverable('master')]
  - Synthesizes sections M0 through M8 into consolidated Markdown & JSON
```

### 6.2 Question Composition Formula & Failure Modes
Dynamic questions are constructed via:
$$\text{Questions} = \text{Base} + \text{Trade Module} + \text{Overlays} - \text{Irrelevant} - \text{Answered}$$
**Current Failure Mode**: In `allPhasesTemplates.js`, the Trade Module is omitted; questions are selected strictly based on `context.archetype`. If a beauty salon or jewelry shop is classified under `LOCAL_SERVICE`, `allPhasesTemplates.js` serves questions about car engines, oil changes, and automotive parts.

### 6.3 Deliverable Provenance Deficit
While `deliverableGenerator.js` successfully outputs 5 algorithmic layers (Prerequisites, Execution Algorithm, Actionable Checklist, Numeric Formulas/KPIs, and Exit Gates), it lacks explicit **provenance tags** on each data point:
- No visual distinction between `FACT_USER_CONFIRMED`, `DECISION_LOCKED`, `HYPOTHESIS_PENDING_TEST`, `UNKNOWN_DATA_GAP`, and `AI_RECOMMENDATION`.
- Objects embedded in content dictionaries risk stringifying to `[object Object]` during Markdown export.

---

## 7. State Management, Schema & Persistence Architecture

### 7.1 The Disconnected Persistence Manager Bug
In `platform/src/services/persistenceManager.js`, a comprehensive persistence layer is implemented:
- `saveProjectState(engine)`: Sanitizes sensitive keys (`apiKey`, `password`, `secret`) and saves to `localStorage["dm_project_state"]`.
- `loadProjectState()`: Retrieves and validates state structure against `SCHEMA_VERSION = 1`.
- `restoreToEngine(engine, state)`: Re-hydrates `phaseData`, `facts`, `decisions`, `unknowns`, and `contradictions`.
- `exportProjectJSON(engine)`: Generates downloadable sanitized project JSON.
- `importProjectJSON(engine, jsonString)`: Validates and imports external state.

**The Reality in `platform/src/App.jsx`**:
```javascript
// Lines 14-15 of App.jsx:
export default function App() {
  const [engine, setEngine] = useState(() => new OrchestratorEngine());
  ...
```
`PersistenceManager` is **never imported in `App.jsx`**. No `useEffect` calls `saveProjectState` on state updates, and no initialization hook calls `loadProjectState()`. When a user refreshes the browser, all work is permanently lost.

### 7.2 Schema Discrepancy: `project-state.schema.json` vs `PersistenceManager`
- `schemas/project-state.schema.json` specifies:
  - Version: `2.0.0`
  - Field naming: `snake_case` (`current_phase`, `completed_phases`, `business_context`, `verified_at`, `risk_level`)
- `persistenceManager.js` specifies:
  - Version: `1`
  - Field naming: `camelCase` (`currentPhase`, `completedPhases`, `businessContext`, `phaseData`)
- **Impact**: Importing a state exported under `persistenceManager.js` will fail validation against `schemas/project-state.schema.json`.

### 7.3 API Key Security Flaws (R12)
1. **Plaintext LocalStorage**:
   In `platform/src/components/SettingsModal.jsx` line 30:
   ```javascript
   localStorage.setItem("gemini_api_key", localKey);
   ```
   Raw API keys are stored in unencrypted browser storage, accessible to any script executing on the origin.
2. **Unsanitized Custom Endpoints**:
   In `platform/src/services/geminiService.js` lines 114–128:
   ```javascript
   if (customEndpoint && customEndpoint.trim()) {
     endpoint = `${base}/v1beta/models/${model}:generateContent?key=${apiKey}`;
   }
   ```
   Custom endpoints are not validated for HTTPS protocol, allowing keys to be broadcast over unencrypted networks or redirected to malicious endpoints without timeouts or AbortControllers.

---

## 8. Fragile Dependencies, Duplicated Logic & Technical Debt

1. **Delimiter-Based LLM Parsing (R13)**:
   `geminiService.js` expects responses formatted with `---DECISION---` and `---NEXT_QUESTION---`. If the LLM produces Markdown headings (`### Decision`) or formatting variations, parsing collapses, silently dropping extracted decisions.
2. **Isolated Persian Search Normalizer (R14)**:
   `persianSearchNormalizer.js` contains complete normalization logic (`normalizePersianText`, `isFuzzyMatch`, `PERSIAN_GUILD_ALIASES`), but `GuildSelectorModal.jsx` completely ignores it, using a primitive `b.titleFa.toLowerCase().includes(q)` substring check.
3. **Chat-Centric UI Overhead (R7, R8, R9)**:
   - `ChatContainer`, `MessageBubble`, `ChatInput`, and `Bot` avatars create an anthropomorphic chat experience rather than an executive strategy workspace.
   - Fixed input docks and message lists push question cards off-screen, failing the 8-viewport no-scroll compliance mandate.
   - Electric cobalt accents (`#2563eb`) conflict with the required black/white monochrome aesthetic.
4. **Monolithic Initial Bundle (R15)**:
   `businessTaxonomy753.js` (1.88 MB) is bundled synchronously into `main.jsx`, causing a 1.96 MB JS chunk warning on every build.

---

## 9. Pre-Refactor Baseline Matrix & Recommendations for Implementation Teams

| Area | Current Baseline State | Required Post-Refactor Target | Priority |
|---|---|---|---|
| **Git Merge** | Branch `fix/production-hardening` ahead of `main` by 3 commits | Fast-forward merge `fix/production-hardening` into `main` | High |
| **Persistence (R11)** | `PersistenceManager` disconnected; all state lost on refresh | Connect `PersistenceManager` to workspace; auto-save to localStorage/IndexedDB | Critical |
| **Security (R12)** | API keys stored in plaintext; endpoints unvalidated | Session-only / BYOK memory mode; validate HTTPS; sanitize custom endpoints | High |
| **UI/UX (R7, R8, R9)** | Chat interface, message bubbles, bot avatars, cobalt blue accents | 2-column monochrome workspace; single Question Card; 100dvh 8-viewport visible | Critical |
| **Guild Selector (R14)** | Dumps 40 cards; primitive substring search; no keyboard nav | Search-first virtualized modal; wire `persianSearchNormalizer.js`; ARIA listbox | High |
| **Specialization (R5, R6)** | 4 coarse archetypes; car wash terms leaked into salons & clinics | Enforce hierarchy: BT $\to$ Industry $\to$ Archetype $\to$ Axes $\to$ Stage $\to$ Prior Answers | High |
| **AI Output (R13)** | Fragile `---DECISION---` string splitting | Structured JSON schema with schema validation and multi-tier fallback | Medium |
| **Test Fixtures (R23)** | `test_multi_sector_customization.js` tests only active/national | Rewrite fixtures to include IDEA, PRE_LAUNCH, ACTIVE, REBRAND + local geography | High |
| **Simulation 753 (R2)** | Evaluates active stage only; M4 double-counts assertions | Evaluate multi-stage combinations; compute metrics strictly from empirical checks | Medium |
| **Bundle Size (R15)** | Monolithic 1.96 MB JS bundle | Code-split and lazy-load `businessTaxonomy753.js` dynamically on modal open | Medium |
| **Provenance (R20)** | Descriptive text without typed tags; risks `[object Object]` | Formal provenance tags (`FACT`, `DECISION`, `UNKNOWN`); clean nested Markdown serialization | Medium |

---

## 10. Audit Certification

This audit was conducted under **Strict Integrity Mode**. All test commands, timings, logs, and branch states were verified empirically against the live file system and Git history. No simulated passes or artificial score inflations were accepted.

**Certified by**: `teamwork_preview_explorer_survey_git_audit`  
**Artifact**: `d:\personal branding\AUDIT-BEFORE-REFACTOR.md`  
**Timestamp**: `2026-09-17T01:20:00Z`
