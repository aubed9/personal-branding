---
name: wiki-ingest
parent: wiki-skill-v4.2.0
description: >
  5-phase selective ingestion pipeline. Adds a source to the wiki through
  progressive refinement: onboarding, selective compilation, intelligent expansion,
  on-demand cross-source synthesis, and maintenance. Respects persona defaults
  from PERSONA.md. No stubs. No bloat. Only high-value pages.
---

# Operation 2: wiki-ingest (5-Phase Selective Pipeline)

## Goal
Add a source to the wiki with minimal token cost and maximum quality. Preserve every paragraph in `chunks.json`, but only create wiki pages for salient, novel content. Extract relationships during ingest, not after. Auto-expand obvious concepts. Only ask the user about ambiguous decisions.

## Prerequisites
- `wiki-init` must have been run
- `PERSONA.md` and `SCHEMA.md` must exist and be readable
- User must provide source: file path, URL, or pasted text

## Pre-Flight Checklist
Before starting Phase 0, read:
1. `PERSONA.md` — extract all thresholds and policies
2. `SCHEMA.md` — confirm naming conventions and language
3. `wiki/index.md` — scan for existing sources and concepts
4. `wiki/overview.md` — check current synthesis state

Do not proceed without reading these four files.

---

## Ingest Mode Selection

Before starting, determine the ingest mode:

| Mode | Phases Run | When to Use |
|------|-----------|-------------|
| **Full** (default) | 0 → 1 → 2 → 3 → 4 → 5 | High-value sources; first 5 sources in a wiki |
| **Lite** | 0 → 1 → 5 | Routine sources; supplementary material; bulk ingestion |

### Lite Mode Criteria (use Lite when ANY apply):
- Source is supplementary/supporting (not a primary research artifact)
- User explicitly requests quick ingestion
- Batch ingestion of 3+ sources in one session
- Source salience is uniformly < 4 (low overall importance)

### Lite Mode Behavior:
- Phase 0: Full execution (chunking, metadata, toc)
- Phase 1: Full execution (selective compilation, relationship mapping, keyword index update)
- Phase 2–4: **SKIPPED entirely**
  - No topic enrichment gate (all decisions are automatic based on salience matrix)
  - No cross-source pattern detection (deferred to next Phase B lint)
  - No progressive knowledge building (adjacent concepts not explored)
- Phase 5: Full execution (maintenance, index updates, lint Phase A)

### Lite Mode Logging:
Log entry uses `ingest-lite` operation name: `## [YYYY-MM-DD] ingest-lite | <Source Title>`

---

## Batch Ingestion Protocol

When ingesting 3+ sources in a single session:

### Step B.1: Source Queue
List all sources to ingest. For each, determine:
- Slug (auto-generated from title)
- Estimated source type (for chunking strategy selection)
- Ingest mode (Full or Lite; default Lite for batch unless user specifies)

### Step B.2: Sequential Processing (No Per-Source User Checkpoints)
Process each source through its selected mode sequentially.
- ALL user suggestions from Phase 2 (topic enrichment) are DEFERRED to a batch summary
- ALL concept candidates are COLLECTED (not presented individually per source)
- Keyword index is updated after EACH source (not batched — ensures novelty scoring is accurate for subsequent sources)

### Step B.3: Single Batch Summary Checkpoint
After ALL sources are processed, present ONE consolidated summary to the user:
```yaml
batch_summary:
  sources_ingested: <N>
  chunks_created: <N>
  topics_created: <N>
  concept_candidates_flagged: <N>
  deferred_suggestions:
    - source: <slug>
      suggestion: "Enrich topic-X with cross-source comparison"
      action: enrich | skip
    - ...
  auto_draft_concepts_created: <N>
```
User responds to deferred suggestions in bulk (accept all / reject all / selective).

### Step B.4: Batch Lint
Run wiki-lint Phase A ONCE after all sources complete (not per-source).
If total ingests since last Phase B >= `lint_phase_b_trigger` threshold, trigger Phase B.

---

## Phase 0: Source Onboarding (Immutable Layer)

### Step 0.1: Accept Source
Accept one of:
- **File path**: Copy to `raw/<slug>/`
- **URL**: Fetch and save to `raw/<slug>/source.html` or `source.txt`
- **Pasted text**: Save to `raw/<slug>/source.txt`

Generate `<slug>` from source title (kebab-case, ASCII-only).

### Step 0.2: Read Source in Full
Read the entire source. Do not skip. You must understand the complete structure before chunking.

### Step 0.3: Analyze Source Structure (Auto-Detection)
Scan the first ~2000 lines for structural signals. Classify into one of:

| Type | Signals |
|------|---------|
| `legal-articles` | `ماده \d+`, `Article \d+`, `بند \d+` patterns |
| `paged-book` | `## صفحه \d+`, `^Page \d+` markers (≥10 triggers auto-select) |
| `transcript` | Speaker labels `^[^:]+:`, timestamps `\[?\d{1,2}:\d{2}\]?` |
| `markdown-article` | `^#{1,3}\s+` headings, clean paragraph structure |
| `unstructured` | No dominant signals, mixed plain text (default) |

### Step 0.4: Select Chunking Strategy
Based on detected type and `PERSONA.md` `chunk_strategy`:

| Source Type | Boundary Rule | Target Size | Overlap | Notes |
|-------------|--------------|-------------|---------|-------|
| `legal-articles` | Article headers (`ماده N`, `Article N`) | 1 article = 1 chunk | 0% | Preserve chapter/section hierarchy |
| `paged-book` | Section boundaries (`فصل`, `Chapter`) | 800–1500 words | 0% | Merge pages, never split mid-page |
| `transcript` | Speaker changes or topic shifts | 1–3 turns | 0% | Include speaker attribution |
| `markdown-article` | `^#{1,3}\s+` headings | 1 section = 1 chunk | 0% | Split oversized sections (>1500w) at paragraphs |
| `unstructured` | Paragraph boundaries | 600–1000 words | 10–20% | Sliding window, split at paragraphs only |

### Step 0.5: Generate `raw/<slug>/chunks.json`

Generate a JSON array of chunk objects. Each object:

```json
{
  "id": "s3.2-001",
  "text": "Full verbatim text of the chunk...",
  "keywords": ["attention mechanism", "query matrix", "key matrix", "value matrix"],
  "section": "Chapter 3 > Section 2 > Multi-Head Attention",
  "strategy": "markdown-article",
  "stats": {
    "wordCount": 450,
    "estimatedTokens": 675,
    "pageRange": "12-14"
  },
  "relationships": []
}
```

**ID Format Rules (Location-Based Stable Hash):**
- `m{articleNum}-{seq}` for legal articles (e.g., `m12-001`)
- `p{startPage}-{seq}` for books (e.g., `p45-001`)
- `s{sectionNum}-{seq}` for markdown/transcripts (e.g., `s3.2-001`)
- `u{windowNum}-{seq}` for unstructured (e.g., `u7-001`)

**Never use content-hash IDs** — they break when source text is corrected.

**Target chunk size:** Respect `PERSONA.md` `chunk_strategy.target_size`. For researcher personas: 800–1500 words. For reporter: 400–800.

**Keywords extraction:**
- Extract noun phrases from the text
- For Persian legal sources: include core legal lexicon terms
- Frequency-ranked, capped at 15
- Include quoted terms and capitalized phrases

### Step 0.6: Generate `raw/<slug>/toc.md`

Generate a human-readable topic tree derived from detected sections and chunk boundaries:

```markdown
# Table of Contents: <Source Title>

## Chapter 1: Introduction
- §1.1 Background — chunks: [[chunk-<slug>-s1.1-001]]
- §1.2 Problem Statement — chunks: [[chunk-<slug>-s1.2-001]], [[chunk-<slug>-s1.2-002]]

## Chapter 2: Methodology
- §2.1 Experimental Design — chunks: [[chunk-<slug>-s2.1-001]]
- §2.2 Data Collection — chunks: [[chunk-<slug>-s2.2-001]]
```

### Step 0.7: Extract Source Metadata

Generate `raw/<slug>/metadata.json` with universal + persona-specific fields:

```json
{
  "title": "Source Title",
  "authors": ["Author One", "Author Two"],
  "date": "2024-03-15",
  "source_type": "research-paper",
  "url_or_doi": "https://doi.org/10.xxxx/xxxxx",
  "persona_specific": {
    "methodology": "RCT",
    "sample_size": 1000,
    "peer_reviewed": true,
    "datasets": ["ImageNet", "COCO"],
    "key_contribution": "First to demonstrate X under condition Y"
  }
}
```

**Persona-specific fields** (extract only those relevant to `PERSONA.md` `persona`):
- **Researcher**: `methodology`, `sample_size`, `peer_reviewed`, `datasets`, `key_contribution`
- **Creator**: `story_angles`, `key_quotes`, `audience`, `format`, `tone`
- **Reporter**: `claim_date`, `source_bias`, `verification_status`, `urgency`, `primary_source`
- **Learner**: `difficulty_level`, `prerequisites`, `estimated_time`, `learning_path_tag`
- **Strategist**: `market_signal`, `competitor_mention`, `decision_relevance`, `confidence_level`

### Phase 0 Error Handling
- If source file cannot be read (encoding error, file not found): log `[ERROR]` in wiki/log.md, skip source, report to user
- If chunks.json generation fails midway: delete partial chunks.json, retry once; if still fails, abort source
- If metadata extraction fails: create minimal metadata.json with `"extraction_status": "partial"`, continue with available data
- If toc.md generation fails: create minimal toc with source title only, continue
- Never leave partial raw/<slug>/ artifacts without a valid chunks.json — either complete or delete entirely

---

## Phase 1: Selective Compilation & Relationship Mapping

### Step 1.1: Salience & Novelty Scoring

For each chunk in `chunks.json`, score on two axes using the **Salience-Novelty Matrix**:

**Source Salience** (1–5): How central is this chunk to the source's main argument?
- 5: Core thesis, key finding, central methodology
- 4: Important supporting evidence, main contribution
- 3: Relevant context, secondary analysis
- 2: Background, related work, tangential
- 1: Boilerplate, acknowledgments, references

**Corpus Novelty** (1–5): How new is this information to the existing wiki?
- 5: Entirely new concept/claim not mentioned anywhere
- 4: New evidence for existing concept, or new sub-topic
- 3: Partial overlap, some new angles
- 2: Mostly covered, minor additions
- 1: Common knowledge, fully covered

### Corpus Novelty Scoring (Efficient Method)

Instead of searching all wiki pages for keyword overlap, use the keyword index:
1. Read `wiki/keyword-index.json`
2. For each chunk's top 5 keywords, count how many existing entries exist in the index
3. Calculate novelty score:
   - 0 matching keyword entries → novelty 5 (completely new to corpus)
   - 1–2 matching entries → novelty 4 (mostly new)
   - 3–4 matching entries → novelty 3 (partially covered)
   - 5–6 matching entries → novelty 2 (well-covered)
   - 7+ matching entries → novelty 1 (highly redundant)
4. Formula: `novelty = 5 - min(4, total_matching_entries / 2)`

This replaces the O(n²) approach of searching all existing pages. The keyword index provides O(1) lookup per keyword.

**Special case:** If no wiki pages exist yet (first source) or keyword-index.json is empty, all chunks score novelty = 5.

**Decision Matrix:**

| Source Salience | Corpus Novelty | Action | Chunk Page | Topic Page | Concept Candidate |
|-----------------|----------------|--------|------------|------------|-------------------|
| 5 | 5 | **Create chunk + topic, flag candidate** | Yes | Yes | Flag |
| 5 | 3 | **Create chunk + topic, flag candidate** | Yes | Yes | Flag |
| 5 | 1 | **Create chunk + topic** | Yes | Yes | — |
| 4 | 4 | **Create chunk + topic, flag candidate** | Yes | Yes | Flag |
| 4 | 2 | **Suggest to user** | Yes | Yes | — |
| 3 | 5 | **Suggest to user** | Yes | Yes | Flag |
| 3 | 1 | **Auto-skip** | No | No | — |
| 1–2 | Any | **Auto-skip** | No | No | — |

**Hard cap**: Never create more than `PERSONA.md` `max_chunk_pages_per_source` chunk pages. If salient chunks exceed the cap, keep the highest-scoring ones and defer the rest.

### Step 1.2: Relationship Extraction

For all chunks scoring salience ≥ 3, extract relationships:

**Intra-source relationships** (within this source):
- Scan chunk summaries for causal, supporting, or contrasting links
- Example: "§3.2 builds on the framework defined in §3.1"

**Cross-source relationships** (against existing corpus):
- Search existing `wiki/pages/chunk-*` for matching keywords
- Check `wiki/pages/relations-*.md` for similar relationship patterns
- Example: "This source claims O(n) complexity, while [[chunk-existing-§2]] claims O(n²)"

**Relationship types:**
- `extends` — builds upon previous work
- `contradicts` — disagrees with previous claim
- `supports` — confirms or replicates
- `refines` — improves or clarifies
- `background-for` — provides context needed to understand another chunk
- `methodologically-similar-to` — uses same or comparable methods

Store relationships in two places:
1. `chunks.json` — add to each chunk's `relationships` array
2. `wiki/pages/relations-<slug>.md` — master relationship table (created in Step 1.5)

### Step 1.2b: Update Keyword Index

After determining which chunks pass the salience threshold:
1. Read `wiki/keyword-index.json`
2. For each chunk page being created, iterate its keyword list:
   - If keyword already exists in index: append new chunk reference `{"chunk": "<filename>", "source": "<slug>", "salience": <score>}`
   - If keyword is new: create new entry with this chunk as first reference
3. Update `_meta.updated` to current date and recalculate `_meta.total_keywords`
4. Write the updated `wiki/keyword-index.json`

**Important:** In Batch Ingestion mode, the keyword index is updated after EACH source (not batched) to ensure accurate novelty scoring for subsequent sources in the queue.

### Step 1.3: Targeted Page Creation (Subagent Dispatch)

**Main Agent filters first. Subagents execute only high-value work.**

#### Subagent A: Chunk Pages (High-Salience Only)
- **Input**: 20–40 chunk objects (not 200) that passed the salience filter
- **Task**: Create `wiki/pages/chunk-<slug>-<id>.md` for each
- **Template per chunk page**:
  ```markdown
  ---
  title: "Chunk <id> — <section>"
  type: chunk
  tags: [chunk, source]
  sources: [<slug>]
  updated: YYYY-MM-DD
  status: expanded
  ---

  ## Chunk Text
  > <verbatim text from chunks.json>

  ## Chunk Summary
  > [AI-SYNTHESIS]: <1-2 sentence synthesis of what this chunk discusses>

  ## Extracted Concepts
  <!-- Only salient concepts, not all keywords -->
  - [[concept-<name>]] — <brief relationship>

  ## Source Map
  Backlink: [[source-<slug>-map]]
  ```
- **Parallelization**: Dispatch up to 5 subagents, each handling 8–10 chunks
- **Verification**: Main agent confirms all chunk pages created, no duplicates, correct frontmatter

#### Subagent B: Topic Pages (Major Sections Only)
- **Input**: Structural outline + high-salience chunks grouped by section
- **Task**: Create `wiki/pages/topic-<slug>-<t>.md` for each major section with salience ≥ 4. For each topic page, include summaries of ALL chunks that belong to that section (not just high-salience ones).
- **Template per topic page**:
  ```markdown
  ---
  title: "<Section Name>"
  type: topic
  tags: [topic, <slug>]
  sources: [<slug>]
  updated: YYYY-MM-DD
  status: expanded
  ---

  # <Section Name>

  > [AI-SYNTHESIS]: <2-3 sentence synthesis of this section's role in the source>

  ## Key Claims
  > "<verbatim quote>"[^1]
  > — [[chunk-<slug>-<id>]]

  ## Section Chunks
  | Chunk | Summary |
  |-------|---------|
  | [[chunk-<slug>-<id>]] | <1-2 sentence summary of this chunk's content> |
  | [[chunk-<slug>-<id>]] | <summary> |

  ## Relationship Map
  | This Section | Relation | Target | Evidence |
  |--------------|----------|--------|----------|
  | §3.2 | extends | §3.1 | Builds on framework |

  ## Extracted Concepts
  - [[concept-<name>]] — <relationship>

  ## Source Metadata
  <!-- PENDING: wiki-ingest — will be populated during this operation -->
  ```
- **Persona-specific additions** (append to topic page):
  - **Researcher**: `Contribution Assessment` section
  - **Creator**: `Story Angles` section
  - **Reporter**: `Claim Verification` table
  - **Learner**: `Prerequisites` and `Mastery Check`
  - **Strategist**: `Strategic Implications` section

#### Subagent C: Concept Candidate Tagging (Flag Only — No Pages Created)
- **Input**: High-salience chunks with cross-source keyword matches
- **Task**: Identify potential concept candidates and write them to the source map's "Concept Candidates" section. **Do NOT create concept pages.**
- **Process**:
  1. For each chunk scoring salience ≥ 4 AND novelty ≥ 4, extract candidate concept names
  2. Search existing `wiki/pages/topic-*` and `wiki/pages/chunk-*` for related keywords across sources
  3. Score each candidate by cross-source presence (how many sources mention it?)
  4. Write candidates to `source-<slug>-map.md` under "## Concept Candidates"
- **Concept Candidate entry format** (in source map):
  ```markdown
  ## Concept Candidates
  | Candidate | Cross-Source Mentions | Related Topics | Salience | Status |
  |-----------|---------------------|----------------|----------|--------|
  | <name> | <N> sources | [[topic-a]], [[topic-b]] | <score> | pending-exploration |
  ```
- **Key rule**: Concept candidates are SEEDS for wiki-query conversation. They are never auto-expanded into pages during ingest.

### Step 1.4: Backlink Audit (Lightweight)

After page creation:
1. Scan all newly created topic pages for broken `[[...]]` links
2. Verify that each linked page exists
3. If a linked page does NOT exist (because it was auto-skipped), remove the link or replace with plain text
4. **Do not create stubs to fix broken links.** Either the content is important enough for a page, or it isn't.

### Step 1.5: Create Relations Page

Create `wiki/pages/relations-<slug>.md`:

```markdown
---
title: "Relations: <Source Title>"
type: relations
tags: [relations, <slug>]
sources: [<slug>]
updated: YYYY-MM-DD
status: expanded
---

# Cross-Source Relations: <Source Title>

## Intra-Source Relationships
| From | Type | To | Evidence |
|------|------|-----|----------|
| [[chunk-<slug>-s3.2-001]] | extends | [[chunk-<slug>-s3.1-001]] | Builds on framework |

## Cross-Source Relationships
| This Source | Type | Existing Source | Evidence |
|-------------|------|-----------------|----------|
| [[chunk-<slug>-s3.2-001]] | contradicts | [[chunk-existing-§2-001]] | Complexity claims differ |

## Conflicts Detected
<!-- Reporter persona: flag for verification -->
| Claim A | Source A | Claim B | Source B | Status |
|---------|----------|---------|----------|--------|

## Novelty Flags
<!-- Researcher persona: what's new -->
| Concept | Previous Coverage | This Source Adds |
|---------|-------------------|------------------|
```

### Step 1.6: Create Source Map

Create `wiki/pages/source-<slug>-map.md` as the **quality dashboard**:

```markdown
---
title: "Source Map: <Source Title>"
type: source-index
tags: [source-map, <slug>]
sources: [<slug>]
updated: YYYY-MM-DD
status: expanded
salience_score: <average across chunks>
---

# Source Map: <Source Title>

## Overview
> [AI-SYNTHESIS]: <One-paragraph summary of the source's contribution and placement in the corpus>

## Metadata
<!-- PENDING: wiki-ingest — will be populated during this operation -->
| Field | Value |
|-------|-------|
| Title | ... |
| Authors | ... |
| Date | ... |
| Type | ... |
| <Persona fields> | ... |

## Structural Index
| Section | Chunks | Salience | Status | Novelty | Created |
|---------|--------|----------|--------|---------|---------|
| Abstract | [[chunk-<slug>-abstract-001]] | 3 | Created | Low | Yes |
| §3.1 Architecture | [[chunk-<slug>-s3.1-001]] | 5 | Created | High | Yes |
| §5 Training Details | — | 2 | Deferred | Low | No |

## Key Relationships
| This Source | Relation | Target | Evidence |
|-------------|----------|--------|----------|
| §3.2 Attention | contradicts | [[chunk-existing-§2-001]] | Complexity claims differ |
| §3.3 Multi-Head | extends | [[chunk-<slug>-s3.2-001]] | Builds on base attention |

## Concepts Extracted
| Concept | Status | Corpus Novelty | Source Salience |
|---------|--------|----------------|-----------------|
| [[concept-transformer-architecture]] | Expanded | High | 5 |
| [[concept-multi-head-attention]] | Expanded | High | 5 |
| [[concept-positional-encoding]] | Expanded | Medium | 4 |

## Deferred Content
The following chunks scored low on salience/novelty and were not compiled into pages:
- §5 Training Details (salience: 2, novelty: 1)
- §7 Related Work (salience: 2, novelty: 1)
> These remain available in [[raw/<slug>/chunks.json]] and can be compiled on demand.
> To compile a deferred chunk, run: `wiki-ingest --compile-chunk <slug> <chunk-id>`

## All Pages from This Source
<!-- MANDATORY: List every page created during this ingest. No page may be left unlinked. -->
| Page | Type | Status |
|------|------|--------|
| [[topic-<slug>-<t>]] | topic | Created |
| [[chunk-<slug>-<id>]] | chunk | Created |
| [[relations-<slug>]] | relations | Created |
```

---

## Phase 2: Topic Enrichment Gate (Non-Blocking)

### Step 2.1: Topic Enrichment Classification

For every topic page created in Phase 1, classify whether it needs additional detail:

| Signal | Source | Use |
|--------|--------|-----|
| **Source Salience** | Phase 1 scoring | How central is this topic to the source? |
| **Corpus Novelty** | Phase 1 scoring | How new is this topic area to the wiki? |

**Classification Matrix:**

| Source Salience | Corpus Novelty | Auto-Action | User Asked? |
|-----------------|----------------|-------------|-------------|
| 5 | 5 | **Auto-enrich topic** | No |
| 5 | 3 | **Auto-enrich topic** | No |
| 4 | 4 | **Auto-enrich topic** | No |
| 4 | 2 | **Suggest enrichment** | Yes |
| 3 | 5 | **Suggest enrichment** | Yes |
| 3 | 1 | **Skip** | No |
| 1–2 | Any | **Skip** | No |

**Respect `PERSONA.md` `gate_policy`:**
- `conservative`: Only auto-enrich if salience = 5 AND novelty ≥ 4
- `auto`: Use matrix above
- `exhaustive`: Ask user for everything
- `conflict-priority`: Auto-enrich if salience ≥ 4 AND contradiction detected

### Step 2.2: Auto-Enrich Execution

For topics classified as auto-enrich:
1. Read existing topic page
2. Add additional detail sections from chunk evidence
3. Add persona-specific sections (contribution assessment, story angles, etc.)
4. Update relationship links
5. Log: "Auto-enriched based on salience <N>, novelty <N>"

### Step 2.3: User Checkpoint (Ambiguous Only)

If topics fall into "Suggest enrichment" category, present a brief decision:

```markdown
## Topic Enrichment Decisions

The following topic pages could use additional detail:

### 1. [[topic-<slug>-<t>]]
- **Salience**: <N> | **Novelty**: <N>
- **Suggested action**: Add persona-specific sections and relationship detail
- **Your call**: [Enrich] [Skip]
```

### Step 2.4: Post-Gate Audit Trail

Append to `wiki/log.md`:

```markdown
## [YYYY-MM-DD] ingest-gate | <Source Title>
- Topics evaluated: <N>
- Auto-enriched: <N>
- User decisions: <N>
- Concept candidates flagged: <N>
- Enrichment policy: <policy> (<persona> profile)
```

---

## Phase 3: Cross-Source Pattern Detection (Feed for Concept Discovery)

### Purpose
Detect patterns, contradictions, and convergences across sources. These patterns are logged as concept candidates for the wiki-query conversation system — they are NEVER auto-materialized as concept pages.

### Trigger Conditions

Phase 3 pattern detection runs when ANY of these conditions are met during ingest:

| Trigger | Condition | Action |
|---------|-----------|--------|
| **Keyword Overlap** | New source shares 3+ keywords with existing source chunks | Log cross-source pattern |
| **Contradiction** | New source evidence contradicts existing topic claims | Flag in relations page + concept candidates |
| **Convergence** | 3+ sources discuss same topic from different angles | Flag as high-priority concept candidate |
| **Temporal Delta** | Sources span >2 years on same topic | Flag evolution pattern |

### Step 3.1: Pattern Scan (Lightweight)

1. Read new source's chunk keywords
2. Search existing `wiki/pages/topic-*` and `wiki/pages/chunk-*` for keyword matches
3. Group matches by theme/topic
4. Score patterns by cross-source breadth

### Step 3.2: Log Patterns to Source Map

Add detected patterns to `wiki/pages/source-<slug>-map.md` under "## Cross-Source Patterns":

```markdown
## Cross-Source Patterns Detected
| Pattern | Type | Sources Involved | Strength | Status |
|---------|------|------------------|----------|--------|
| <topic> | convergence | [[source-a]], [[source-b]], [[source-c]] | 3 sources | pending-exploration |
| <claim> | contradiction | [[source-a]], [[source-c]] | direct conflict | pending-exploration |
| <topic> | evolution | [[source-a]] (2019), [[source-c]] (2024) | temporal | pending-exploration |
```

**Living Document Rule:** After logging patterns to the new source's map, also update ALL existing `relations-*.md` pages for sources involved in the detected pattern. Add entries to their "Cross-Source Relationships" tables referencing the new source. Relations pages are living documents — every operation that discovers new cross-source relationships must update them immediately, not just the new source's relations page.

### Step 3.3: Auto-Draft Concept Creation

When a concept candidate meets ALL of these criteria:
- Referenced by 3+ independent sources (based on keyword index cross-referencing)
- Convergence pattern detected (sources agree on core claim, no contradictions)
- No contradictions found across sources for this concept
- Not already an existing concept page (`concept-<slug>.md` does not exist)

Auto-create `concept-<slug>.md` with:
```yaml
---
title: <Concept Name>
type: concept
status: draft
synthesis_version: 0
tags: [concept, draft, auto-generated]
sources: [<source-1-slug>, <source-2-slug>, <source-3-slug>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Page content structure:**
- H2 "Cross-Source Evidence" — table with citations from each converging source
- H2 "Synthesis" — `> [AI-SYNTHESIS]:` block summarizing the convergence pattern
- H2 "User Experience & Contribution" — `<!-- PENDING: wiki-query — awaiting user conversation for validation -->`
- H2 "Related Concepts" — wikilinks to related topic/concept pages

**Constraints:**
- Maximum 3 auto-draft concepts per ingest (prioritize by source count, then by salience)
- Log each in wiki/log.md with `[AUTO-DRAFT]` prefix: `## [YYYY-MM-DD] auto-draft | concept-<slug>`
- Add to wiki/index.md under a "Draft Concepts" section
- In Lite mode: Phase 3 is SKIPPED, so no auto-drafts are created (deferred to next Full ingest or Phase B lint)

### Step 3.4: Update Concept Candidates

For patterns with strength ≥ 3 sources or type = contradiction:
1. Add to source map's "Concept Candidates" table (from Step 1.3)
2. Add cross-source evidence references
3. Set status to `high-priority` if contradiction or ≥ 3 sources converge

**Key rule**: This phase surfaces WHAT could become a concept. The actual concept creation happens in wiki-query through conversation with the user.

---

## Phase 4: Progressive Knowledge Building

### Step 4.1: Adjacent Concept Analysis

After Phase 2 (and Phase 3 if triggered), identify concepts that were heavily mentioned alongside expanded concepts but are not yet expanded:

```markdown
### Adjacent Concepts from This Ingest
The following concepts were heavily mentioned in the high-salience chunks but are not yet expanded:

| Concept | Mentions in This Source | Current Status | Corpus Sources | Suggested Action |
|---------|------------------------|----------------|----------------|------------------|
| [[concept-positional-encoding]] | 4 chunks | Single-source | 1 | Run Phase 3 when 2nd source ingested |
| [[concept-multi-head-attention]] | 3 chunks | Single-source | 1 | Run Phase 3 when 2nd source ingested |
| [[concept-encoder-decoder]] | 2 chunks | Not a page | 0 | Ingest more sources first |
```

### Step 4.2: User Suggestion (Optional)

Present to user as optional next steps:

```markdown
> **Adjacent concepts ready for expansion:**
> - [[concept-positional-encoding]] (4 mentions, high salience)
> - [[concept-multi-head-attention]] (3 mentions, high salience)
>
> Expand these now? [Yes] [No] [Select individually]
```

**No automatic expansion.** The system suggests, the user decides. But the suggestion is informed by data (mention counts, current status), not generic.

### Step 4.3: Deferred Content Registry

Track deferred chunks in `wiki/pages/source-<slug>-map.md` under "Deferred Content." If a user later queries a concept that only exists in deferred chunks, offer on-demand compilation:

```markdown
> Concept [[concept-X]] was found only in deferred chunks of [[source-<slug>-map]].
> Compile deferred chunk [[chunk-<slug>-<id>]] now? [Yes] [No]
```

---

## Phase 5: Maintenance

### Step 5.1: Update Index Pages (MANDATORY — No Orphans)

#### Main Index (`wiki/index.md`):
Update with ALL of the following:
- Add `[[source-<slug>-map]]` under "Sources" section
- Add ALL newly created topic page links under a source-grouped subsection
- Add concept pages (if any) under "Expanded Concepts"
- Update persona-specific tracked tables (contributions, story angles, verification queue, etc.)
- Any deferred concepts under a "Deferred" section (not Stubs — this system does not use stubs)

#### Source Index (`wiki/pages/source-<slug>-map.md`):
Verify the "Structural Index" table references EVERY topic page and chunk page created from this source.
Verify the "All Pages from This Source" section lists EVERY page created during this ingest.

**Connectivity Rule:** After this step, every page created in this ingest must be reachable from `wiki/index.md` within 2 hops (index → source-map → page). If any page is not connected, fix it now.

### Step 5.2: Update overview.md

Add to `wiki/overview.md`:
- Significant concepts from this source
- Shifts in understanding (if any)
- New open questions
- Update persona-specific sections

### Step 5.3: Append to log.md

```markdown
## [YYYY-MM-DD] ingest | <Source Title>
- Topics: <N> | Concept candidates flagged: <M>
- Chunk pages created: <P> (deferred: <D>) | Topic pages: <T>
- Relationships extracted: <R> (intra: <R1>, cross: <R2>)
- Cross-source patterns: <N>
- Gate policy: <policy> | Auto-enriched: <N>% | User decisions: <N>
- Lint Phase A: auto-triggered | Lint Phase B: <triggered/not-triggered>
- Ingest counter: <N>/<trigger>
- Lang: <lang> | Persona: <persona>
```

### Step 5.4: Report to User

```markdown
Ingest complete for `<Source Title>`

Summary:
- Chunk pages created: <N> (salient) / <N> (deferred)
- Topic pages created: <N>
- Concept candidates flagged: <N> (explore via wiki-query)
- Relationships mapped: <N>
- Auto-enriched topics: <N>%
- Cross-source patterns detected: <N>

Quality Dashboard: [[source-<slug>-map]]
Deferred Content: <N> chunks available in [[raw/<slug>/chunks.json]]

Next Steps:
- Run `wiki-query` to explore concept candidates through conversation
- Lint Phase A auto-triggered after this ingest; Phase B runs every 3 ingests
- Ingest next source or expand adjacent concepts
```

### Step 5.5: Mandatory Output Verification

Before proceeding to lint, verify ALL of the following. If ANY check fails, fix it immediately before continuing.

#### File Existence Checks:
- [ ] `raw/<slug>/chunks.json` exists and is non-empty
- [ ] `raw/<slug>/toc.md` exists and has content
- [ ] `raw/<slug>/metadata.json` exists and has content
- [ ] `wiki/pages/source-<slug>-map.md` exists and has content beyond frontmatter
- [ ] `wiki/pages/relations-<slug>.md` exists and has content beyond frontmatter
- [ ] Every chunk page listed in the salience filter output exists
- [ ] Every topic page listed in the salience filter output exists

#### Content Completeness Checks:
- [ ] Source map has filled "Structural Index" table (not empty/placeholder)
- [ ] Source map has filled "Overview" section (not just AI-SYNTHESIS placeholder)
- [ ] Source map has filled "All Pages from This Source" section
- [ ] Every topic page has filled "Key Claims" section with actual quotes
- [ ] Every chunk page has filled "## Chunk Text" section with verbatim text
- [ ] Every chunk page has filled "## Chunk Summary" section
- [ ] `wiki/index.md` has been updated with new source reference
- [ ] `wiki/overview.md` has been updated with source contribution

#### Index Connectivity Checks:
- [ ] `wiki/index.md` contains `[[source-<slug>-map]]`
- [ ] Source map references ALL created topic and chunk pages
- [ ] No created page is orphaned (unreachable from index within 2 hops)
- [ ] No remaining `<!-- PENDING: wiki-ingest` comments in any page created or modified by this operation
- [ ] `wiki/keyword-index.json` updated with all new chunk keywords
- [ ] If auto-draft concepts created: each has valid frontmatter, is indexed, and logged

#### Placeholder Prohibition:
- [ ] NO section contains only `<!-- خودکار پر میشود -->` or `<!-- Auto-populated -->` or `<!-- PENDING: wiki-ingest ... -->`
- [ ] NO section is left empty after this operation created it
- [ ] ALL tables created by this operation have at least one data row (not just headers)

If a section cannot be filled because no data qualifies, write an explicit note:
`<!-- NO-DATA: no items qualified based on salience threshold -->`
Do NOT leave placeholder comments unfilled.

### Step 5.6: Auto-Trigger Lint Phase A

After reporting to user, automatically run `wiki-lint Phase A` (post-ingest quick fix):
1. Fix any broken links created during this ingest
2. Cross-link similar topic pages from different sources
3. Merge any duplicate pages

### Step 5.7: Increment Ingest Counter & Check Phase B

1. Increment `ingest_counter` in `PERSONA.md`
2. If `ingest_counter >= lint_phase_b_trigger` (default: 3):
   - Auto-trigger `wiki-lint Phase B` after Phase A completes
   - Reset `ingest_counter` to 0
3. Append counter state to log entry

---

## Common Mistakes to Avoid (Ingest)

- **Skipping chunk map generation** — without `chunks.json`, cross-source gathering is impossible
- **Creating chunk pages for low-salience content** — respect the salience threshold and hard cap
- **Forgetting to create chunk pages for high-salience content** — these are the canonical citation targets
- **Inlining chunk text in source maps** — link to chunk pages, don't duplicate
- **Creating stubs** — this system does NOT use stubs. Do not create empty concept pages.
- **Creating concept pages during ingest** — concepts are conversation-driven, created only through wiki-query
- **Skipping lint Phase A after ingest** — it must run automatically to fix structural issues
- **Not flagging concept candidates** — patterns should be logged for wiki-query to explore
- **Mixing AI text with quotes** — never put AI-generated words inside a source quote block
- **Using line numbers instead of paragraph anchors** — line numbers break on reformatting
- **Using one-size-fits-all paragraph splitting** — always detect source type first
- **Generating content-hash-based IDs** — always use location-based IDs
- **Expanding all concepts automatically** — defeats the selectivity principle; respect the gate
- **Appending chronological updates to concept pages** — edit in-place, bump `updated`, log changes
- **Ignoring `PERSONA.md` thresholds** — the hard caps and policies exist to prevent bloat
- **Not updating `relations-<slug>.md`** — relationship extraction is only valuable if persisted
- **Forgetting to read `PERSONA.md` before ingest** — all operations must respect configured defaults
- **Running Full mode for batch ingestion of 3+ routine sources** — use Lite mode instead
- **Skipping keyword index update after chunk creation** — breaks novelty scoring for future ingests
- **Creating more than 3 auto-draft concepts per ingest** — respect the cap
- **Leaving `<!-- PENDING: wiki-ingest ... -->` comments after ingest completes** — fill with content or convert to `<!-- NO-DATA: ... -->`
- **Not checking for `[IN-PROGRESS]` markers in wiki/log.md before starting** — risk of concurrent operation conflict

---

## On-Demand Compilation (Deferred Content)

If a user later needs a deferred chunk, run this lightweight procedure:

1. Read `raw/<slug>/chunks.json`
2. Find the requested chunk by ID
3. Create `wiki/pages/chunk-<slug>-<id>.md` with standard template
4. Update `source-<slug>-map.md` to mark chunk as "Compiled on demand (YYYY-MM-DD)"
5. Append to `log.md`: "compile-deferred | <slug> <id>"

This does NOT trigger Phase 2 or 3 automatically. It simply makes the chunk citable.
