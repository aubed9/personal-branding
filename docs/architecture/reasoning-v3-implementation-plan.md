# DIGITAL MARKET — Reasoning Graph v3 Implementation Plan

Status: implementation handoff  
Source: Wayfinder #3, #5–#13  
Production epic: #14

## 1. Objective

Replace the current overlapping reasoning mechanisms with one causal, auditable, versioned reasoning architecture while preserving the existing React/Vite product surface wherever practical.

The implementation must solve the observed problems:
- materially different inputs producing similar outputs;
- prior answers changing wording without reliably changing decision topology;
- broad downstream invalidation;
- static phase metrics/methods/handoffs;
- generic fallback values;
- parallel Wiki/RAG knowledge planes;
- unverifiable source-count claims;
- completion/quality tests that can pass without proving strategic differentiation.

## 2. Canonical runtime architecture

### reasoning/graph
Owns:
- canonical node types;
- typed edges;
- graph revision;
- reachability;
- dependency indexes;
- graph validation.

Node classes:
- Evidence / Answer
- Context Axis Value
- Decision Node
- Calculation
- External Knowledge Claim
- Proposal / Decision
- Risk
- Contradiction
- Output Claim / Section
- Gate

Minimum edge types:
- REQUIRES
- INFLUENCES
- DERIVES
- ACTIVATES
- INVALIDATES
- CONTRADICTS
- SUPPORTS
- BLOCKS
- SUPERSEDES

### reasoning/modules
Owns composable phase/context specialization.

A module declares:
- activation;
- prerequisites;
- Decision Nodes;
- evidence;
- calculations;
- metrics;
- risks;
- output sections;
- gates;
- invalidation edges;
- knowledge/source dependencies.

Modules contribute to the canonical graph; they do not own private dependency graphs.

### state
Owns canonical ledgers, revisions, events, persistence schema and migrations.

Canonical domains:
- Evidence Ledger
- Business Context Ledger
- Decision / Proposal Ledger
- Claim Ledger
- Contradiction / Risk Ledger
- Knowledge / Source references
- Graph revision and lifecycle metadata

### knowledge
Owns:
- Source Registry
- Knowledge Node Registry
- canonical external claims
- authority/freshness admissibility
- retrieval index generation
- hybrid retrieval and post-validation
- live Research Adapter admission

### reasoning/engine
Owns deterministic:
- activation/deactivation;
- routing;
- gates;
- contradiction rules;
- lifecycle transitions;
- change events;
- exact invalidation;
- deterministic recomputation.

### projections
Derives:
- current/next questions;
- phase status;
- handoffs;
- phase deliverables;
- Master document;
- dashboards;
- audit/trace views.

Derived views are revision-keyed caches, not sources of truth.

### adapters/llm
Allowed:
- free-text interpretation into candidate structured values;
- Persian rewriting/explanation;
- candidate diagnostic questions/actions;
- summarization without increasing certainty.

Forbidden:
- silent graph topology mutation;
- direct locked-decision mutation;
- source-authority changes;
- gate override;
- certainty upgrade.

### adapters/research
Activated only when live/current evidence is required.
External information must become Source Record + External Claim and pass authority/freshness validation before supporting a canonical decision.

## 3. Canonical business-context model

Exactly 15 axes:
1. customerModel
2. offerType
3. channelModel
4. revenueModel
5. maturity
6. scale
7. salesMotion
8. geography
9. branchStructure
10. founderRole
11. purchaseCycle
12. relationshipModel
13. regulatoryProfile
14. operationalComplexity
15. brandArchitecture

`primaryArchetype` is a derived classification layer, not axis 16.

Precedence:
user-confirmed evidence → legal/safety/compliance constraint → exact axis rule → BT specialization → industry module → archetype default → generic provisional fallback.

## 4. Canonical output model

Claim types:
- USER_FACT
- USER_DECISION
- ASSUMPTION
- UNKNOWN
- CALCULATION
- EXTERNAL_FACT
- SYSTEM_INFERENCE
- PROPOSAL
- RISK
- CONTRADICTION

Every substantive claim carries identity, type, status, origin, dependencies, evidence, source references where applicable, rule/module origin, revision and supersession metadata.

Documents are projections of canonical claims.
The same claim is stored once and referenced by phase deliverables, handoffs, Master and trace views.

Conditional sections without active modules/evidence are omitted.

## 5. Canonical knowledge model

Root `wiki/` plus the Source Registry becomes the only authored decision-knowledge plane.

Source records use stable `SRC-...` IDs and preserve authority, version/effective dates, scope, freshness, locators and mutable-page snapshot identity where applicable.

Decision-driving external claims require claim-level provenance.

Retrieval pipeline:
1. deterministic admissibility filter;
2. semantic ranking over admissible canonical claims/modules;
3. graph expansion when useful;
4. deterministic citation/status/applicability validation.

Manual `knowledge_base/rag_chunks.json` cannot remain an independent source of truth.

## 6. Old → new responsibility mapping

| Current component | Target responsibility |
|---|---|
| `platform/src/services/orchestratorEngine.js` | Keep public facade temporarily; delegate canonical state/graph operations to reasoning engine and projections |
| `dynamicQuestionEngine.js` | Move structural branching to Decision Modules + graph; retain only bounded question rendering/adaptation |
| `adaptiveInterview.js` | Fold dependency/branch semantics into canonical graph/modules; remove private dependency ownership |
| `businessContextRouter.js` | Normalize into Context Ledger classifier/default seeding + module activation; BT/archetype cannot override confirmed axes |
| `contradictionEngine.js` | Convert rules to graph-linked contradictions with exact evidence/claim targets |
| `phaseGateValidator.js` | Gate becomes projection over active required nodes/claims, not independent duplicated truth |
| `deliverableGenerator.js` | Replace fixed 5-section generator with claim/section projections and semantic Master synthesis |
| `strategicActions.js` | Move action rules into context-aware Decision Modules producing typed PROPOSAL claims |
| `schemas/business-context.schema.json` | Normalize to canonical 15-axis vocabulary |
| `schemas/project-state.schema.json` | Replace/extend with versioned canonical ledgers + graph/event schema |
| `state/project-state.template.json` | Upgrade to new schema; retain migration fixture only after cutover |
| `wiki/registry.yaml` | Remain Knowledge Node registry; add separate Source Registry and claim mappings |
| `knowledge_base/wiki_engine.py` | Deprecate after canonical Wiki retrieval parity |
| `knowledge_base/rag_engine.py` | Replace with generated retrieval over canonical claims/modules |
| `knowledge_base/rag_chunks.json` | Migration input only; generated index replaces manual content |
| 753 simulation | Compatibility/smoke coverage only |
| pairwise/multi-sector tests | Evolve to semantic causal matched-pair assertions |

## 7. Implementation sequence

### Workstream #15 — Graph/schema foundation
No product cutover.
Deliver canonical schemas, IDs, nodes, edges, indexes and validators first.

### Workstream #16 — State migration
Introduce `stateSchemaVersion` and `reasoningEngineVersion`.
Every migration:
- snapshots original state;
- runs one-way deterministic transform;
- outputs migration report;
- maps stable legacy IDs where possible;
- preserves unmappable values as legacy evidence/unknowns.

### Workstream #17 — Decision Modules
Convert specialization to composable modules.
Do not attempt 753 bespoke flows.
BT taxonomy enriches terminology/evidence expectations; axes and evidence own causal semantics.

### Workstream #18 — Change events/invalidation
Every material mutation emits a typed change event.
Reachability computes affected nodes.
Broad `invalidateDependentPhases` becomes compatibility fallback only.

### Workstream #19 — Output projections
Replace fixed sections/static metrics/generic handoffs.
Handoffs and Master must reuse canonical claims.

### Workstream #20 — Knowledge migration/retrieval
Inventory legacy knowledge, dedupe, create sources, map claims, validate freshness, generate retrieval, prove parity, then deprecate legacy knowledge planes.

### Workstream #21 — Acceptance/shadow
Run old and new engines against identical scenarios before cutover.
Classify differences:
- EXPECTED_IMPROVEMENT
- COMPATIBLE
- REGRESSION

### Workstream #22 — Rollout
New projects first.
Existing projects only after migration + shadow acceptance.
Keep rollback snapshot.
Retire legacy paths after acceptance evidence.

## 8. Acceptance matrix

### Hard invariants
- broken graph refs = 0
- broken source/claim refs = 0
- invented handoff values = 0
- stale-to-CONFIRMED leakage = 0
- illegal certainty upgrades = 0
- protected cross-domain leakage = 0
- silent migration data loss = 0
- decision-driving provenance coverage = 100%
- required reachability mutation tests = 100%
- required matched-pair causal tests = 100%

### Required matched pairs
- same business: positive vs negative contribution economics
- B2B vs B2C
- subscription/recurring vs project
- normal vs highly regulated
- founder-led vs non-public/executive-led
- micro vs enterprise/holding
- local retail vs B2B manufacturing with artificially similar generic answers

### Semantic differentiation
Names, timestamps, direct quotes, shell headings and boilerplate are stripped before comparing:
- active module set
- question/decision topology
- recommendation set
- KPI/formula set
- evidence requirements
- risks/gates
- execution priorities
- invalidation topology

## 9. Deprecation list

Retire only after replacement acceptance:
- broad downstream phase invalidation as primary model;
- private dependency tables that conflict with canonical graph;
- static generic phase handoff fallbacks;
- phase-wide static KPI injection;
- manual RAG chunks as authored knowledge;
- legacy Wiki search as independent knowledge plane;
- hard-coded “165 sources” claim;
- source-count validation based on Knowledge Node count;
- whole-phase completion flags as independent authority.

## 10. Rollback rule

A migrated project keeps its pre-migration snapshot until the migration and shadow checks are accepted.
Rollback restores that snapshot.
New-model writes are not silently reverse-transformed; any backward move requires an explicit reverse migration.

## 11. Non-goals

- no graph database requirement in the first implementation;
- no full React UI rewrite;
- no bespoke workflow for each of 753 taxonomy entries;
- no production use of the accepted HTML prototype;
- no strategic-quality claim derived from one aggregate test percentage.
