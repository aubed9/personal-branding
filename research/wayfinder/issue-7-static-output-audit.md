# Wayfinder Research — Issue #7: Static/Default Content Audit

## Summary

The current output pipeline is much safer than the older version because factual claims are tied to active answer evidence. However, large parts of the **reasoning scaffold** remain phase-generic and several handoff messages use static defaults.

This explains why outputs can be truthful yet still feel “the same”.

## Provenance classification

### Evidence-derived
- answer rows in phase documents;
- factual/decision claims built from active answers;
- dependency quotations;
- unit-economics calculations;
- proposal evidence IDs.

### Rule-derived proposals
- `buildStrategicActions()` recommendations;
- contradiction rules;
- limited-budget / price-sensitivity / economics branches.

### Phase-static content
- `METHOD[phase]`;
- `WIKI_PATHS[phase]`;
- `METRICS[phase]`;
- five-section phase document structure;
- nine-section master structure;
- most handoff framing.

### Generic fallback content
`startPhase()` contains fallbacks such as:
- “خدمات و تخصص محوری”
- “مشتریان ارزش‌محور”
- “رفیق کاربلد و راهنما”
- “صمیمی و حرفه‌ای”
- “برند تخصصی”
- generic pain/opportunity/positioning/promise/tagline fallbacks.

Some gates make these less likely in normal completed flows, but the fallback strings still exist as content-producing behavior.

## Key findings

### 1. Same document topology for every business
Every phase is built into the same five sections:
1. inputs/classification;
2. method/dependencies;
3. 30/60/90 plan;
4. measurement/formulas;
5. gate/unknowns/constraints.

The master document is always one summary + eight phase sections.

Consistency is useful, but topology must not be counted as personalization.

### 2. Phase methods are business-agnostic
`METHOD`, `WIKI_PATHS`, and `METRICS` are selected by phase number, not business context.

For example, phase-8 always exposes conversion and acquisition-cost measurement regardless of whether a context requires additional retention, procurement, utilization, marketplace liquidity, compliance, or long-cycle sales measures.

### 3. Strategic actions have no direct business-context input
`buildStrategicActions(phase, rows, economics)` does not receive `businessContext`.

Therefore specialization can only come indirectly from user text in evidence rows or generic regex/rule triggers.

Two different businesses with equivalent generic answers can receive the same action rule IDs, success measures, and horizons.

### 4. Handoff messages are fixed narratives
`OrchestratorEngine.startPhase()` uses a fixed prose frame for each phase and interpolates a small number of prior fields.

This preserves coherence, but produces strong stylistic sameness across businesses.

### 5. Evidence safety and substantive specificity are different metrics
The current generator can correctly avoid hallucinating facts while still issuing generic proposals.
A proposal with a valid evidence ID is not automatically business-specific.

## Required output contract changes

Future output generation should distinguish:
- **document schema** (stable);
- **conditional reasoning modules** (context-specific);
- **evidence-derived claims**;
- **business-specific metric sets**;
- **business-specific operational action libraries**;
- **optional sections** that only appear when the context requires them.

## Acceptance measurements

1. **Generic Fallback Ratio** — generic fallback sentences in a confirmed document.
2. **Action Rule Diversity** — compare rule IDs after stripping quoted user text.
3. **Metric Relevance Score** — selected metrics must be justified by context/revenue/customer/channel.
4. **Conditional Section Precision** — context-specific sections appear only when relevant.
5. **Boilerplate-normalized output delta** — remove headings, taxonomy names, user quotes and fixed method prose before comparing businesses.

## Resolution

The main remaining sameness is not primarily fabricated facts; it is **generic reasoning scaffolding and generic action selection**.
The redesign should keep a stable document shell but make decision modules, actions, metrics, risks, and evidence requirements context-driven.
