---
name: wiki-audit
parent: wiki-skill-v4.2.0
description: >
  Fact-check a single wiki page against its cited sources. Uses parallel subagent
  dispatch — one subagent per source file. Two-phase audit: uncited claim detection
  and cited claim verification. Writes structured verdict report.
---

# Operation 5: wiki-audit (Fact-Check Against Sources)

## Goal
Verify that a specific wiki page's claims are supported by its cited sources.
Exclude AI-SYNTHESIS blocks from audit (they are non-factual by design).
Use parallel subagent dispatch — one subagent per source file for efficiency.

## Prerequisites
- `wiki-init` and at least one `wiki-ingest` completed
- Target page exists in `wiki/pages/`
- Cited sources exist in `raw/` with `chunks.json`

## Trigger
Run when:
- User asks "Verify this page"
- A source has been updated and may affect existing claims
- Before publishing/exporting content based on the wiki
- After `wiki-lint` flags unfootnoted claims or contradictions

---

## Phase 1: Target Page Analysis (Main Agent)

### Step 1.1: Read Target Page

Read the full target page. Identify:
- `sources:` frontmatter list
- All footnote markers (`[^N]`)
- All `[[chunk-<slug>-<id>]]` citations
- All `> [AI-SYNTHESIS]:` blocks (mark for exclusion)
- All `## User Experience & Contribution` sections (mark for exclusion — user-contributed, not source-verifiable)
- All verbatim quote blocks (`>`)
- All factual claims (not common knowledge)

### Step 1.2: Build Claim Inventory

Parse the page into a structured claim list:

```yaml
page: "concept-<name>.md"
title: "<Title>"
status: <status>
synthesis_version: <N>
claims:
  - id: 1
    text: "The model uses 8 attention heads."
    type: factual
    citation: "[^1]"
    citation_target: "[[chunk-<slug>-<id>]]"
    ai_synthesis: false

  - id: 2
    text: "Attention is the most important mechanism in modern NLP."
    type: interpretive
    citation: null
    ai_synthesis: true

  - id: 3
    text: "The architecture was first proposed in 2017."
    type: factual
    citation: "[^2]"
    citation_target: "[[attention-is-all-you-need]] §1"
    ai_synthesis: false

  - id: 4
    text: "In my experience, the attention mechanism works differently in low-resource languages."
    type: user-experience
    citation: null
    ai_synthesis: false
    user_contributed: true
```

**Exclusion rules:**
- Skip `> [AI-SYNTHESIS]:` blocks entirely
- Skip `## User Experience & Contribution` sections entirely (user-contributed knowledge from wiki-query conversations)
- Skip `## The Insight` section in concept pages (conversation-derived synthesis, not source-verifiable)
- Skip common knowledge (e.g., "Python is a programming language")
- Skip definitions that are direct quotes from sources
- Skip meta-commentary ("This section discusses...")

---

## Phase 2: Uncited Claim Detection (Phase A)

### Step 2.1: Identify Uncited Factual Claims

For each claim in the inventory:
- If `type: factual` AND `citation: null` → flag as **uncited**
- If `type: interpretive` AND `citation: null` → flag as **unsubstantiated interpretation**
- If `type: user-experience` AND `user_contributed: true` → **skip** (not auditable against sources)

### Step 2.2: Classify Uncited Claims

| Severity | Condition |
|----------|-----------|
| 🔴 Critical | Central claim of the page, no citation |
| 🟡 Warning | Supporting claim, no citation |
| 🔵 Info | Background/context claim, no citation |

### Step 2.3: Suggest Citations

For each uncited claim, search the wiki for potential sources:
1. Search `chunks.json` files for matching keywords
2. Search existing chunk pages for similar claims
3. Suggest: "Add citation to [[chunk-<slug>-<id>]] or [[source-<slug>]] §X"

---

## Phase 3: Cited Claim Verification (Phase B)

### Step 3.1: Group Claims by Source

For all cited claims, group by `citation_target` source slug:

```yaml
source_groups:
  <slug-1>:
    - claim_id: 1
      citation_target: "[[chunk-<slug-1>-<id>]]"
      claim_text: "The model uses 8 attention heads."
    - claim_id: 5
      citation_target: "[[chunk-<slug-1>-<id-2>]]"
      claim_text: "Training used 8 GPUs."

  <slug-2>:
    - claim_id: 3
      citation_target: "[[attention-is-all-you-need]] §1"
      claim_text: "The architecture was first proposed in 2017."
```

### Step 3.2: Dispatch Subagents (One Per Source)

For each source group, dispatch one subagent:

```
Subagent for Source <slug>:
  Input:
    - Target page claims referencing this source
    - raw/<slug>/chunks.json
    - wiki/pages/chunk-<slug>-*.md (if exist)

  Task:
    1. Resolve each citation_target:
       - If [[chunk-<slug>-<id>]]: Read chunk page, verify verbatim text
       - If [[source-<slug>]] §X: Read chunks.json, find section X, verify
       - If raw/<slug>/: Read source file, search for claim

    2. For each claim, return verdict:
       - ✅ supported: Verbatim text or clear paraphrase found in source
       - ❌ unsupported: Source says something different or opposite
       - ⚠️ partial: Source supports part of the claim, but not all
       - 🚫 source-missing: Source file or chunks.json not found
       - ❌ chunk-page-missing: Chunk page doesn't exist but chunk ID is valid
       - ❌ anchor-missing: Section/chunk ID not found in source's chunk map

    3. Return structured output
```

**Subagent output format:**
```yaml
source: "<slug>"
claims_verified:
  - claim_id: 1
    verdict: "✅ supported"
    evidence: "Exact quote from source: 'We employ h = 8 parallel attention layers'"
    location: "[[chunk-<slug>-<id>]] §3.2.2"
    confidence: high

  - claim_id: 5
    verdict: "⚠️ partial"
    evidence: "Source mentions '8 TPU pods' not '8 GPUs'"
    location: "[[chunk-<slug>-<id-2>]] §4.1"
    confidence: medium
    note: "Hardware type differs from claim"

  - claim_id: 3
    verdict: "❌ unsupported"
    evidence: "Source says 'submitted in 2017' but claim says 'first proposed in 2017' — submission ≠ first proposal"
    location: "[[attention-is-all-you-need]] §1"
    confidence: high
```

### Step 3.3: Merge Subagent Verdicts

Main agent merges all subagent outputs into a unified verdict table.

---

## Phase 4: Audit Report Generation

### Step 4.1: Write Audit Report

Create `wiki/pages/audit-<page>-<YYYY-MM-DD>.md`:

```markdown
---
title: "Audit: <Page Title> — YYYY-MM-DD"
tags: [audit, verification]
sources: [<slug-1>, <slug-2>]
updated: YYYY-MM-DD
status: expanded
---

# Audit Report: [[<page>]]

## Audit Summary
| Metric | Count |
|--------|-------|
| Total claims checked | <N> |
| Cited claims | <N> |
| Uncited claims | <N> |
| ✅ Supported | <N> |
| ⚠️ Partial | <N> |
| ❌ Unsupported | <N> |
| 🚫 Source Missing | <N> |
| ❌ Chunk Page Missing | <N> |
| ❌ Anchor Missing | <N> |

## Phase A: Uncited Claims

### 🔴 Critical (Uncited Central Claims)
| Claim ID | Claim Text | Suggested Source |
|----------|------------|------------------|
| 2 | "Attention is the most important mechanism..." | [[chunk-<slug>-<id>]] or add [synthesis] tag |

### 🟡 Warnings (Uncited Supporting Claims)
| Claim ID | Claim Text | Suggested Source |
|----------|------------|------------------|
| 7 | "Training took 3.5 days" | [[chunk-<slug>-<id>]] |

## Phase B: Cited Claim Verification

### Source: [[<slug-1>]]
| Claim ID | Verdict | Evidence | Location |
|----------|---------|----------|----------|
| 1 | ✅ supported | "We employ h = 8 parallel attention layers" | [[chunk-<slug-1>-<id>]] §3.2.2 |
| 5 | ⚠️ partial | "8 TPU pods" ≠ "8 GPUs" | [[chunk-<slug-1>-<id-2>]] §4.1 |

### Source: [[<slug-2>]]
| Claim ID | Verdict | Evidence | Location |
|----------|---------|----------|----------|
| 3 | ❌ unsupported | "submitted in 2017" ≠ "first proposed in 2017" | [[<slug-2>]] §1 |

## Overall Assessment

**Verdict**: <pass | partial | fail>

**Pass**: All critical claims supported, ≤1 partial, 0 unsupported  
**Partial**: Some critical claims partial, or minor claims unsupported  
**Fail**: Critical claim unsupported, or multiple claims failed

## Recommended Fixes

### Immediate
1. **Claim 3**: Change "first proposed in 2017" to "submitted in 2017" or add [synthesis] tag
2. **Claim 5**: Change "8 GPUs" to "8 TPU pods" or add [synthesis] tag noting hardware difference

### This Week
3. **Claim 2**: Add [synthesis] tag or find supporting source
4. **Claim 7**: Add citation to [[chunk-<slug>-<id>]]

## Fix Diffs

### Claim 3 Fix
```diff
- The architecture was first proposed in 2017.[^2]
+ The architecture was submitted for publication in 2017.[^2]
```

### Claim 5 Fix
```diff
- Training used 8 GPUs.[^3]
+ Training used 8 TPU pods.[^3]
> [AI-SYNTHESIS]: The original paper specifies TPU pods, not consumer GPUs.
```
```

### Step 4.2: Offer Fixes

Present to user:
```markdown
## Apply Fixes?

[ ] Apply all suggested fixes (<N> changes)
[ ] Show diffs for each fix individually
[ ] Apply only critical fixes
[ ] Skip fixes, I'll handle manually
```

**Only apply after confirmation.** Never auto-fix audit findings.

---

## Phase 5: Log & Report

### Step 5.1: Append to log.md

```markdown
## [YYYY-MM-DD] audit | <Page Title>
- Claims checked: <N>
- Cited: <N> | Uncited: <N>
- Verdicts: ✅ <N> | ⚠️ <N> | ❌ <N> | 🚫 <N> | ❌ chunk-missing <N> | ❌ anchor-missing <N>
- Overall: <pass | partial | fail>
- Fixes applied: <N>
- Fixes pending: <N>
- Report: [[audit-<page>-YYYY-MM-DD]]
```

### Step 5.2: Report to User

```markdown
Audit complete for [[<page>]].

| Category | Count |
|----------|-------|
| ✅ Supported | <N> |
| ⚠️ Partial | <N> |
| ❌ Unsupported | <N> |
| 🚫 Source Issues | <N> |

**Overall**: <pass | partial | fail>

**Critical issues**: <N>  
**Suggested fixes**: <N>

Full report: [[audit-<page>-YYYY-MM-DD]]
```

---

## Subagent Dispatch Strategy

### Audit Subagent Allocation

| Source | Subagent | Input | Task |
|--------|----------|-------|------|
| Source 1 | A | Claims group + chunks.json + chunk pages | Verify all claims citing this source |
| Source 2 | B | Claims group + chunks.json + chunk pages | Verify all claims citing this source |
| Source 3 | C | Claims group + chunks.json + chunk pages | Verify all claims citing this source |

**Why one subagent per source?**
- Each source is independent — no cross-source dependency during verification
- Natural parallelization: N sources = N subagents
- Each subagent only needs one `chunks.json` and relevant chunk pages
- Reduces total time from O(total_claims) to O(max_claims_per_source)

### Main Agent Coordination

```
Main Agent:
  1. Reads target page in full
  2. Builds claim inventory (excluding AI-SYNTHESIS)
  3. Runs Phase A (uncited detection) — no subagents needed
  4. Groups cited claims by source
  5. Dispatches N subagents in parallel (one per source)
  6. Receives verdicts from all subagents
  7. Merges into unified report
  8. Presents fix options to user
  9. Applies confirmed fixes
  10. Logs and reports
```

---

## Common Mistakes to Avoid (Audit)

- **Auditing AI-SYNTHESIS blocks** — these are non-factual by design; exclude them
- **Not checking chunk pages first** — always read `[[chunk-<slug>-<id>]]` before falling back to `chunks.json`
- **Not falling back to chunks.json** — if chunk page is missing but chunk ID is valid, read the raw JSON
- **Treating paraphrase as unsupported** — a claim can be supported even if wording differs; check semantic equivalence
- **Not flagging partial support** — "8 GPUs" vs "8 TPU pods" is partial, not fully supported
- **Auto-fixing without confirmation** — audit findings must be human-verified
- **Not logging the audit** — every audit must be traceable in log.md
- **Running audit on every page** — only audit pages before publication or when source updates
- **Ignoring source-missing verdicts** — if a source file is gone, the claim is unverifiable, not automatically wrong
- **Not suggesting citations for uncited claims** — the audit should help, not just criticize
- **Auditing user-contributed sections in concept pages** — "User Experience & Contribution" and "The Insight" sections are conversation-derived; they are not source claims and should not be fact-checked against sources
- **Using deprecated placeholder comment formats** — use `<!-- PENDING: ... -->` or `<!-- NO-DATA: ... -->` only
