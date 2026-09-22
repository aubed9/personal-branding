# Wayfinder Research — Issue #4: Adaptive Interview Baseline

**Map:** #3  
**Ticket:** #4 — Reproduce and measure real adaptation failures  
**Branch:** `research/wayfinder-adaptation-baseline`  
**Scope:** source-level reproduction against the current `main` implementation and its executable test contracts.

> Execution note: this research environment could read/write the connected GitHub repository but could not clone GitHub into a local shell because outbound DNS/network access is disabled there. Therefore this pass uses the actual source, existing executable test harnesses, and invariants that are logically guaranteed by function signatures/control flow. Runtime confirmation should be added later as an automated causal-differentiation test, but the failure classes below do not depend on speculation.

## Executive finding

The system is **partly adaptive**, but the current architecture and tests overstate how much of the 15-axis model causally changes the interview and outputs.

The strongest existing adaptive behavior is:
- sector-specific wording/options;
- stage-sensitive goal options;
- a small set of answer-dependent rules (budget, price sensitivity, unit economics, a few later-message rules);
- contradiction prioritization;
- evidence invalidation after edits.

The weakest behavior is:
- structural branching of the interview;
- causal use of most context axes;
- business-context specialization of strategic actions;
- evaluation of substantive output differentiation.

A 100% score in the existing 753/32-scenario harnesses can coexist with materially similar question paths and outputs.

---

## Representative baseline scenarios

These scenarios already exist in the repository's test data and cover the requested classes.

| Class | Existing scenario/input |
|---|---|
| Local physical retail/service | `BT-0003` supermarket / `BT-0014` gold retail, active/local |
| B2B manufacturing/project | `SCN-06` `BT-0180`, B2B, PHYSICAL_FIRST, PROJECT, MEDIUM |
| SaaS/subscription | `SCN-08` `BT-0290`, B2B, ONLINE_FIRST, RECURRING |
| Hospitality | `BT-0066` specialty cafe/roastery, pre-launch/local |
| Creator/professional | `SCN-12` `BT-0460`, B2C, ONLINE_FIRST, RETAINER |
| Ecommerce/online-first | `SCN-16` `BT-0640`, B2C, ONLINE_FIRST, TRANSACTION |
| Hybrid/marketplace | `SCN-32` `BT-0753`, MARKETPLACE, HYBRID, COMMISSION |

The current multi-sector integration test also uses:
`BT-0014`, `BT-0066`, `BT-0100`, `BT-0101`, `BT-0003`, `BT-0221`, `BT-0166`, `BT-0496`.

---

## Failure class 1 — “15-axis adaptation” is not 15-axis causal adaptation

### Reproduction

`composeChainedQuestions()` advertises:

`Base + Industry Module + Customer Model Overlay + Channel Overlay + Revenue Overlay + Maturity Overlay + Founder Role Overlay - Irrelevant - Answered`

But in `dynamicQuestionEngine.js`, direct references to the context axes are highly uneven.

Observed direct-reference counts in that file:

- `customerModel`: 2
- `channelModel`: 4
- `geography`: 9
- `activeOverlays`: 4
- `industryCode`: 4
- `revenueModel`: 0
- `maturity`: 0
- `scale`: 0
- `salesMotion`: 0
- `branchStructure`: 0
- `founderRole`: 0
- `purchaseCycle`: 0
- `relationshipModel`: 0
- `regulatoryProfile`: 0

In `phase2Templates.js` and `allPhasesTemplates.js`, the downstream templates are mainly selected by archetype/sector; the listed axes above are not used to construct separate decision paths.

### Consequence

Two businesses can differ materially on:
- recurring vs transaction revenue;
- founder-led vs investor/supporting;
- micro vs large scale;
- normal vs highly-regulated;
- short vs long purchase cycle;

yet still receive the same question IDs and the same substantive decision structure.

The difference may be limited to title weaving, sector wording, or user-entered text echoed into the question.

### Measurement

**Axis Causal Sensitivity (ACS)**  
For each axis, hold all other context and answers constant, mutate only that axis, and compare:
1. question ID sequence;
2. option values;
3. required evidence fields;
4. strategic action rule IDs;
5. deliverable conditional sections.

An axis should count as “implemented” only if the mutation changes one of the expected downstream decisions, not merely metadata.

---

## Failure class 2 — the “subtract irrelevant questions” layer is effectively inert

### Reproduction

`pruneIrrelevantQuestions()` removes questions only when their IDs contain:

- `tender_procurement`
- `foot_traffic_impulse`
- `server_uptime_cloud`
- `store_parking_interior`

Those IDs do **not** occur in:
- `phase1Templates.js`
- `phase2Templates.js`
- `allPhasesTemplates.js`
- `interviewSchema.js`

Therefore the current relevance-pruning mechanism has no real questions to prune.

### Consequence

The formula says `- Irrelevant`, but the implemented subtractor does not remove actual current questions.

This means context usually changes wording/options while the overall phase skeleton remains fixed.

### Measurement

**Irrelevant Question Avoidance Rate (IQAR)**  
Create matched pairs where a question is definitely irrelevant in one context and required in another. The irrelevant branch must be absent from the question-ID trace, not merely reworded.

---

## Failure class 3 — “chained” adaptation mostly annotates a fixed sequence instead of opening/closing branches

### Reproduction

`adaptQuestionToAnswers()` has a real dependency table, which is useful. But for most dependencies it does this:

1. collect prior answers;
2. prefix the next fixed question with `با توجه به پاسخ‌های شما...`;
3. mark `dependsOn`;
4. leave the same question ID in place.

Only a few cases actually replace options or add extra logic:
- price sensitivity;
- non-positive contribution margin;
- capacity below break-even;
- limited budget for channel selection;
- phase-5 elevator hook.

`getCurrentQuestion()` then walks the first unanswered question in the composed list. Apart from contradiction resolution, it does not traverse a true dynamic decision tree.

### Consequence

The product can feel “aware” of previous answers while still following almost the same interview topology.

A different answer often changes **presentation** but not **what decision is requested next**.

### Measurement

**Branch Topology Delta (BTD)**  
Compare the ordered question-ID trace between matched scenarios. Ignore text changes. A causal branch requires:
- added/removed question IDs;
- changed ordering due to prerequisite logic;
- a newly opened decision;
- or an explicitly skipped decision.

Track this separately from wording/option variation.

---

## Failure class 4 — the current multi-sector and 753 tests can pass on superficial customization

### Reproduction: `test_multi_sector_customization.js`

The test primarily checks:
- diagnostic title contains the trade name;
- stage was stored;
- geography was stored;
- stage-specific first goal option appears;
- no automotive vocabulary leaked;
- value hypothesis option contains the trade name;
- phase completes;
- phase-2 question has no automotive leakage.

It does **not** compare whether two materially different businesses receive different decision structures or different strategic outputs.

Therefore a system that inserts `trade.name` into otherwise shared questions can satisfy much of this test.

### Reproduction: 753 metrics

The 753 M2 “context relevance” score can reach full marks using conditions such as:
- a context exists;
- an archetype exists;
- industry ID matches;
- at least one decision exists;
- at least one question was encountered;
- no forbidden jargon leakage.

None of those assertions requires two businesses to receive substantively different outputs.

M1/M3/M4 are predominantly document/state/identity integrity checks, not differentiation checks.

### Consequence

“753/753 passed” proves compatibility/integrity properties, not personalization quality.

This is already partially acknowledged in the generated report text, but the headline scores still make it easy to over-read the result.

### Measurement

Add a separate **Causal Differentiation Suite** and never fold it into structural compatibility scores.

---

## Failure class 5 — the 32-scenario “pairwise” matrix declares axes that are not actually applied to the engine

### Reproduction

`test_milestone12_pairwise_scenarios.js` defines fields such as:
- `customerModel`
- `channel`
- `revenueModel`
- `scale`
- `founderRole`
- `regulation`

But inside the execution loop:

- `stageValue` is applied as a stage answer;
- `geoValue` is applied as a geography answer;
- `customerModel` is embedded in free-text goal text;
- `revenueModel` is embedded in free-text core-offer text;
- `channel` is not directly applied;
- `scale` is not directly applied;
- `founderRole` is not directly applied;
- `regulation` is not directly applied.

The generated coverage matrix later reports those declared scenario fields as “covered”.

### Consequence

The matrix proves that the **scenario table contains combinations**, but not that the runtime context was mutated across those combinations or that behavior changed because of them.

This is a concrete false-positive coverage mechanism.

### Measurement

For every declared scenario axis:
1. assert the engine state actually equals the scenario value after setup;
2. assert the expected downstream behavior changed;
3. fail the test if an axis exists only in test metadata.

---

## Failure class 6 — strategic actions do not directly receive business context

### Reproduction

`buildStrategicActions()` has the signature:

`buildStrategicActions(phase, rows, economics)`

It does not receive `businessContext`.

Its behavior is driven by:
- evidence rows;
- unit economics;
- generic regex categories such as waiting/time or price sensitivity;
- fixed phase-level action rules.

Therefore two very different businesses with equivalent answer text/financial state can get the same action rule IDs and near-identical recommendations.

### Consequence

The output may quote different evidence while recommending the same substantive 30/60/90-day plan.

This is one of the most direct explanations for the user's observation that outputs remain similar.

### Measurement

**Action Rule Diversity (ARD)**  
For matched business contexts with equal generic answer wording:
- compare action `ruleId` sets;
- compare required evidence;
- compare success measures;
- strip quoted user text and business names before comparing.

If the action set remains identical where operational reality differs, the specialization failed.

---

## Failure class 7 — deliverables are evidence-safe, but structurally generic

### Reproduction

`generateDeliverable()` has meaningful evidence provenance, which is a strength. However every phase is deliberately built into the same five sections:

1. current inputs/classification;
2. decision logic/method;
3. 30/60/90 proposals;
4. metrics/formulas;
5. gates/unknowns/constraints.

The `METHOD`, `WIKI_PATHS`, and `METRICS` tables are phase-level constants, not business-type contracts.

The master book is always nine sections: one summary plus eight phase documents.

### Consequence

Different businesses can have different evidence while still producing a document whose reasoning structure, methods, metrics, and action categories are mostly the same.

This is not automatically bad—consistent document shape is useful—but it must not be counted as substantive personalization.

### Measurement

**Substantive Output Delta (SOD)** should compare:
- decision statements;
- action rule IDs;
- conditional sections;
- metrics selected;
- risks/gates;
- evidence requirements;

after removing:
- business name;
- taxonomy ID;
- direct quotations of user answers;
- fixed section headings;
- fixed method boilerplate.

---

## Failure class 8 — AI rewriting cannot repair missing deterministic branches

### Reproduction

`validateQuestionAdaptation()` requires the AI response to target the current question ID, and the engine restores/preserves the target/base question IDs.

For routing questions, option values must remain from the deterministic allowed set.

This is a good safety boundary, but it means AI can rewrite/rank the current decision; it cannot invent a new canonical branch that the deterministic graph does not already model.

### Consequence

If the deterministic engine fails to represent a dependency or axis, Gemini rewriting cannot make the interview truly structurally adaptive.

### Measurement

Treat AI wording quality separately from decision-graph coverage.

---

## What is genuinely working today

The baseline is not “everything is fake”. Several mechanisms are real and should be preserved:

- explicit answer/evidence records;
- superseding stale answers;
- downstream invalidation after edits;
- unknown handling;
- contradiction prioritization;
- unit-economics-dependent options;
- price-sensitive pricing branch;
- limited-budget channel branch;
- sector-specific vocabulary/options;
- cross-domain leakage protection;
- AI stale-response protection.

The redesign should retain these as primitives rather than discard them.

---

## Baseline metric suite required before implementation

The replacement acceptance suite should include these metrics independently:

1. **ACS — Axis Causal Sensitivity**  
   One-axis mutations must cause expected downstream changes.

2. **BTD — Branch Topology Delta**  
   Compare question-ID sequences, not wording.

3. **IQAR — Irrelevant Question Avoidance Rate**  
   Irrelevant decision nodes must disappear.

4. **ARD — Action Rule Diversity**  
   Contextually different operations should not collapse to the same action rules.

5. **SOD — Substantive Output Delta**  
   Compare outputs after stripping names, quotes, IDs, and boilerplate.

6. **ECP — Evidence Causal Propagation**  
   Editing one answer should invalidate/change exactly its dependents, not unrelated sections.

7. **GFR — Generic Fallback Ratio**  
   Count generic fallback/default sentences in a confirmed output. Target should be near zero for fields that have enough evidence.

8. **Axis Application Integrity**  
   Every scenario dimension declared by a test must be asserted in the runtime engine state.

---

## Recommended matched-pair tests

At minimum, add these pairs:

### Pair A — same sector, different economics
Cafe with positive margin vs same cafe with non-positive margin.
Expected: pricing branch, action rules, and expansion guidance change.

### Pair B — same offer, different customer model
Same software product as B2C vs B2B.
Expected: buying-process evidence, channel/procurement questions, metrics, and actions change.

### Pair C — same business, different revenue model
Same software product as transaction vs recurring.
Expected: retention/churn/renewal evidence and metrics appear only in recurring mode.

### Pair D — same business, different regulatory profile
Same professional service normal vs highly regulated.
Expected: claims/advertising/compliance evidence and output constraints change.

### Pair E — same business, different founder role
Founder-led vs investor-led.
Expected: personal-brand dependency, spokesperson, governance, and reputation questions change.

### Pair F — same answers, different scale
Micro vs large.
Expected: operating capacity, governance, channel execution, and measurement requirements change.

### Pair G — local retail vs B2B manufacturing
Hold generic answers artificially similar.
Expected: substantially different question trace, action rules, and metrics even after removing business-name words.

---

## Resolution

The reproducible failure classes are:

1. most of the 15 axes are not causally consumed by the adaptive question engine;
2. current irrelevant-question pruning targets IDs that do not exist;
3. the dependency system usually changes wording/context anchors, not interview topology;
4. existing 753/multi-sector scores do not measure substantive differentiation;
5. the 32-scenario pairwise test reports axis coverage without applying several axes to runtime state;
6. strategic actions are not directly business-context-aware;
7. deliverables have strong evidence provenance but a largely phase-generic reasoning skeleton;
8. AI rewriting is intentionally unable to create missing decision branches.

These findings should feed #5 (behavioral acceptance criteria), #6 (dependency graph audit), #9 (business-context specialization contract), and #11 (output/provenance contract).
