# Project: DIGITAL MARKET — Universal Business Taxonomy & 8-Stage Multi-Dimensional Router

## Architecture
DIGITAL MARKET scales from 5 benchmark archetypes to a universal 753-business taxonomy across 31 macro industries (`IND-01` to `IND-31`) and 15 independent context axes.
Data flow:
1. **User Interaction & Freeform Parsing**: User provides input (structured or freeform text).
2. **Universal Business Router**: Maps input to stable code (`BT-0001`..`BT-0753`), assigns 15 axes, activates industry and operational overlays.
3. **Dynamic Chained Question Engine**: Synthesizes questions via `Base + Industry Module + Overlays - Irrelevant - Answered`, with an immediate Open-Ended Diagnostic Probe (`step0_diagnostic_probing`) capturing founder vision.
4. **Unknown-Aware Hypothesis Registry**: Unmeasured or unknown user answers are recorded as formal hypotheses with action items rather than forced fake numbers.
5. **Phase Orchestration & Deliverable Generation**: 8-phase workflow generates 5-layer algorithmic deliverables referencing the 165-source knowledge base, grounding all strategic recommendations.
6. **753 Simulation & Quality Audit Harness**: Autonomous simulation across all 753 business types with 4-metric quality audit (target score >= 96%).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Universal Taxonomy Registry (`BT-0001`..`BT-0753`) | Complete registry of 753 business types across 31 macro industries (`IND-01`..`IND-31`) with guild codes, default 15-axis profiles, KPIs, and risks. | M1 | Survey R1 |
| 2 | 15-Axis Context Classification Model | Multi-dimensional classification across 15 orthogonal axes, preserving 100% backward compatibility for legacy properties (`archetype`, `customerModel`, `channelModel`, `geographicScope`, `activeOverlays`). | M1 | Survey R1 |
| 3 | Emerging & Hybrid Fallback Engine (`BT-0742`..`BT-0753`) | Smart fallback mapping for frontier/hybrid models activating composable overlays without reductionist labeling. | M1 | Survey R1 |
| 4 | Skill Parity across 4 Environments | Full deployment of `digital-market-universal-business-classification-8-stage-router` across `skills/`, `.agents/skills/`, Claude, and Gemini skill trees. | M1 | Survey R1/R4 |
| 5 | Open-Ended Diagnostic Probing Step | Early diagnostic probe (`step0_diagnostic_probing`) immediately after stage 1 exploring founder's exact vision, identity, and values. | M2 | Survey R2 |
| 6 | Dynamic Chained Question Composition | Algorithmic question synthesis: `Base + Industry + Overlays - Irrelevant - Answered`. | M2 | Survey R2 |
| 7 | Dynamic Context-Aware Option Synthesis | Tailored answer options and terminology matching the exact business type without corporate jargon in local trades. | M2 | Survey R2 |
| 8 | Freeform Text Semantic Parser | Out-of-the-box unstructured text extraction for business codes, scale, channels, and pain points without state machine breakdown. | M3 | Survey R3 |
| 9 | Multi-Pattern Unknown-Aware Engine | Detects ignorance, unmeasured timing, uncertainty, and external dependencies; registers hypotheses without forcing fake numbers. | M3 | Survey R3 |
| 10 | 15-Axis & Unknown-Aware Deliverable Generator | Upgraded 5-layer deliverable generator displaying 15 axes, `BT-XXXX` code, founder vision, and hypothesis tracking in Layer 4/5. | M3 | Survey R3/R4 |
| 11 | 165-Source Knowledge Base & Wiki Integration | Grounding deliverables and questions in 165 canonical sources and 49 wiki articles with citation tags. | M3 | Survey R4 |
| 12 | 753-Business Autonomous Simulation Pipeline | Automated end-to-end simulation script (`simulate_753_businesses.js`) executing Phases 0–8 + Master Book across all 753 business types. | M4 | Survey R5 |
| 13 | 4-Metric Quality Audit Engine | Rigorous audit scoring (Practical Problem-Solving, Context Relevance & Zero Jargon, Zero Hallucination/Drift, Exit Gates & Document Integrity) with composite score >= 96%. | M4 | Survey R5 |
| 14 | Deliverable Ledger & Audit Book | Production of `deliverables/753_BUSINESS_SIMULATIONS.md` with complete simulation logs, industry summaries, and quality metrics. | M4 | Survey R5 |
| 15 | Zero-Regression Test Suite & Build Verification | Pass 100% of `npm test` (117/117), `test_adversarial_challenger.js` (185/185), `scripts/validate_system.py` (32/32), and production Vite build. | M5 | Survey Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Universal 753-Business Taxonomy & 15-Axis Router Architecture | Implement `businessTaxonomy753.js`, `business-type-registry.schema.json`, deploy `digital-market-universal-business-classification-8-stage-router` across 4 skill environments, update `businessContextRouter.js` with 15 axes and backward-compatible aliases. | None | DONE |
| 2 | Dynamic Chained Questioning & Open-Ended Diagnostic Probing | Implement `dynamicQuestionEngine.js`, integrate `step0_diagnostic_probing` in `phase1Templates.js` and `orchestratorEngine.js`, compose questions via `Base + Industry + Overlays - Irrelevant - Answered`. | M1 | DONE |
| 3 | Freeform Input Engine, Semantic Parsing & Unknown-Aware System | Implement `semanticParser.js`, multi-pattern unknown detection, multi-slot entity extraction, update `deliverableGenerator.js` with 15 axes and unknown hypothesis tags, update Chat UI quick options. | M2 | DONE |
| 4 | 753-Business Autonomous Simulation & 4-Metric Quality Audit | Implement `simulate_753_businesses.js`, execute batch simulation of all 753 types, evaluate 4 quality metrics (target score >= 96%), emit `deliverables/753_BUSINESS_SIMULATIONS.md`, add npm test:753 script. | M3 | DONE |
| 5 | E2E Harmonization, Zero Regression & Final Victory Audit | Run full regression suite (`npm test`, `test_adversarial_challenger.js`, `scripts/validate_system.py`, `npm run build`, `npm run test:753`), verify 0 jargon leakage, confirm 100% pass and lock all gates. | M4 | IN_PROGRESS (Final Gate Reviewers, Challengers, Auditor) |

## Interface Contracts

### `businessTaxonomy753.js`
- `MACRO_INDUSTRIES`: Array of 31 industry objects `{ id: 'IND-01', code: 'RETAIL_PHYSICAL', titleFa: '...', range: ['BT-0001', 'BT-0035'] }`
- `BUSINESS_TYPES`: Dictionary or array of 753 objects `{ id: 'BT-xxxx', industryId: 'IND-xx', titleFa: '...', titleEn: '...', guildCode: '...', defaultAxes: { customer_model, offer_type, ... }, activeOverlays: [...], kpis: [...], typicalRisks: [...] }`
- `resolveBusinessType(query)`: Returns matched `BT-xxxx` object or fallback hybrid model (`BT-0742`..`BT-0753`).

### `businessContextRouter.js`
- `classifyBusinessContext(phaseData, rawAnswers)`: Returns comprehensive 15-axis object:
  - 15 axes: `taxonomyId`, `industryId`, `customerModel`, `offerType`, `channelModel`, `revenueModel`, `maturity`, `scale`, `salesMotion`, `geography`, `branchStructure`, `founderRole`, `purchaseCycle`, `relationshipModel`, `regulatoryProfile`.
  - Backward-compatible aliases: `archetype`, `archetypeTitle`, `customerModel`, `channelModel`, `maturity`, `geographicScope`, `activeOverlays`, `focusAreas`, `candidateMetrics`, `seededRisks`, `confidence`.

### `semanticParser.js`
- `detectUnknownIntent(text)`: Returns `{ isUnknown: boolean, category: 'EXPLICIT_IGNORANCE' | 'UNMEASURED_TIMING' | 'UNCERTAINTY' | 'EXTERNAL_DEPENDENCY', reason: string }`
- `parseFreeformSemanticSlots(text, currentContext)`: Returns extracted slots `{ businessTypeMatch, customerModel, scale, channels, primaryBottleneck, unmeasuredFields }`

### `dynamicQuestionEngine.js`
- `composeChainedQuestions(phase, businessContext, priorAnswers, unknowns, founderVision)`: Returns ordered array of tailored questions dynamically calculated using the composition formula.

### `deliverableGenerator.js`
- `generateDeliverable(phase, phaseData, businessContext)`: Returns 5-layer Markdown string formatted with 15 axes, `BT-XXXX` code, founder vision, and unknown-aware hypothesis tracking.

## Code Layout
- `platform/src/data/businessTaxonomy753.js`: Universal registry of 753 business types across 31 macro industries.
- `platform/src/data/businessContextRouter.js`: 15-axis classifier and phase adaptation rules.
- `platform/src/services/semanticParser.js`: Freeform parser and Unknown-Aware engine.
- `platform/src/services/dynamicQuestionEngine.js`: Dynamic chained questioning engine.
- `platform/src/services/orchestratorEngine.js`: Master orchestrator engine and state machine.
- `platform/src/services/deliverableGenerator.js`: 5-layer deliverable generator.
- `platform/simulate_753_businesses.js`: End-to-end simulation runner for all 753 business types.
- `deliverables/753_BUSINESS_SIMULATIONS.md`: Complete simulation ledger and 4-metric quality audit report.
- `skills/digital-market-universal-business-classification-8-stage-router/SKILL.md`: Universal router skill definition.
- `schemas/business-type-registry.schema.json`: JSON schema for 753 business registry validation.
