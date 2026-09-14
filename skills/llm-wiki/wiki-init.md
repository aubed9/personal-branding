---
name: wiki-init
parent: wiki-skill-v4.2.0
description: >
  Purpose-driven wiki bootstrap. Configures the entire wiki based on the user's primary
  persona (researcher, creator, reporter, learner, strategist) and sets persona-aware
  defaults that cascade through all later operations.
---

# Operation 1: wiki-init (Purpose-Driven Bootstrap)

## Goal
Create a configured wiki instrument, not a blank slate. The initialization process discovers the user's purpose, sets behavior contracts, and pre-structures the wiki for that specific workflow.

## Prerequisites
- None. This is the first operation for any new wiki.

## Step 1: Purpose Discovery Interview

Ask the user the following questions. Do not proceed until all are answered.

### 1.1 Domain
```
What field or topic will this wiki cover?
Examples: "Persian ASR", "AI Ethics in Healthcare", "Iranian Export Markets",
"Content Creation for Negarestan", "Comparative Constitutional Law"
```

### 1.2 Primary Purpose (Select ONE)
```
What is the primary purpose of this wiki?

[ ] 🔬 Academic Research — tracking papers, methods, replications, contributions
[ ] ✍️ Content Creation — building story banks, quote libraries, narrative arcs
[ ] 📰 Reporting/Journalism — fact-checking, tracking claims, source bias, timelines
[ ] 🎓 General Learning — progressive knowledge building, prerequisites, mastery paths
[ ] 🏢 Product/Strategy — competitive analysis, market signals, decision support
```

### 1.3 Source Velocity
```
How many sources do you expect to ingest per week?

[ ] Low (1–3) — quality over speed, deep analysis of each source
[ ] Medium (4–10) — balanced throughput
[ ] High (10+) — aggressive deduplication and filtering required
```

### 1.4 Language
```
Wiki interface language:
[ ] English (default)
[ ] Farsi (Persian)
```

### 1.5 Path
```
Wiki root path (default: ~/wikis/<domain-slug>/)
```

---

## Step 2: Generate PERSONA.md

Create `PERSONA.md` at `<wiki-root>/PERSONA.md`. This is the behavior contract for all future operations.

### Template

```yaml
---
persona: <researcher | creator | reporter | learner | strategist>
source_velocity: <low | medium | high>
lang: <english | farsi>
created: YYYY-MM-DD
---

# Wiki Behavior Configuration

## Phase 0: Chunking Defaults
chunk_strategy:
  target_size: <words>          # researcher: 800-1500; reporter: 400-800; creator: 600-1000
  boundary_rule: <rule>         # section | paragraph | speaker_turn | article
  overlap: <percent>            # researcher: 0%; unstructured: 20%

## Phase 1: Salience & Selectivity
salience_threshold: <1-5>      # researcher: 4 (strict); creator/reporter: 3 (permissive)
novelty_threshold: <1-5>        # auto-expand if both salience and novelty meet this
max_chunk_pages_per_source: <N> # hard cap: researcher 30, creator 40, reporter 50, learner 20
relationship_extraction: true

## Phase 2: Topic Enrichment Gate
gate_policy: <policy>           # conservative | auto | exhaustive | conflict-priority
user_prompt_threshold: <1-5>    # only ask user if ambiguity score exceeds this
default_action_on_silence: <action>  # enrich | skip | link-only

## Phase 3: Cross-Source Pattern Detection
pattern_detection_trigger: <N>  # sources needed to flag cross-source pattern (default: 3)
tension_mapping: true
gap_flagging: true

## Lint Automation
ingest_counter: 0                    # Tracks ingests since last Phase B lint
lint_phase_b_trigger: 3              # Number of ingests before Phase B auto-triggers

## Concept Discovery (Conversation-Driven)
concept_creation: conversation-only  # Concepts created only through wiki-query dialogue
concept_candidate_threshold: 3       # Minimum sources mentioning topic before flagging as candidate

## Metadata Extraction Templates
# These fields are auto-extracted during Phase 0/1 for every source
source_metadata:
  universal:
    - title
    - authors
    - date
    - source_type
    - url_or_doi
  persona_specific:
    # researcher:
    - methodology
    - sample_size
    - peer_reviewed
    - datasets
    - key_contribution
    # creator:
    - story_angles
    - key_quotes
    - audience
    - format
    - tone
    # reporter:
    - claim_date
    - source_bias
    - verification_status
    - urgency
    - primary_source
    # learner:
    - difficulty_level
    - prerequisites
    - estimated_time
    - learning_path_tag
    # strategist:
    - market_signal
    - competitor_mention
    - decision_relevance
    - confidence_level
```

### Persona-Specific Defaults Table

Apply these defaults based on the selected persona:

| Field | Researcher | Creator | Reporter | Learner | Strategist |
|-------|-----------|---------|----------|---------|------------|
| `chunk_strategy.target_size` | 800-1500 | 600-1000 | 400-800 | 600-1200 | 800-1500 |
| `chunk_strategy.boundary_rule` | section | section | paragraph | section | section |
| `chunk_strategy.overlap` | 0% | 10% | 20% | 10% | 0% |
| `salience_threshold` | 4 | 3 | 3 | 3 | 4 |
| `novelty_threshold` | 3 | 3 | 3 | 3 | 3 |
| `max_chunk_pages_per_source` | 30 | 40 | 50 | 20 | 30 |
| `gate_policy` | conservative | auto | conflict-priority | exhaustive | auto |
| `user_prompt_threshold` | 2 | 3 | 2 | 1 | 3 |
| `default_action_on_silence` | enrich | enrich | enrich | skip | enrich |
| `pattern_detection_trigger` | 3 | 3 | 3 | 3 | 3 |
| `lint_phase_b_trigger` | 3 | 3 | 3 | 3 | 3 |
| `concept_candidate_threshold` | 3 | 2 | 2 | 2 | 3 |

---

## Step 3: Create Directory Structure

Create the following directories at `<wiki-root>/`:

```
<wiki-root>/
├── SCHEMA.md
├── PERSONA.md
├── raw/
├── wiki/
│   ├── index.md
│   ├── log.md
│   ├── overview.md
│   ├── queries.md
│   ├── user-journey.md
│   ├── keyword-index.json
│   ├── query-cache.json
│   └── pages/
├── assets/
├── exports/
│   ├── researcher/
│   │   └── literature-reviews/
│   ├── creator/
│   │   └── story-outlines/
│   ├── reporter/
│   │   └── fact-sheets/
│   └── learner/
│       └── study-guides/
```

### keyword-index.json

Create `wiki/keyword-index.json`:
```json
{
  "_meta": {
    "updated": "YYYY-MM-DD",
    "version": 1,
    "total_keywords": 0
  },
  "keywords": {}
}
```

### query-cache.json

Create `wiki/query-cache.json`:
```json
{
  "_meta": {
    "updated": "YYYY-MM-DD",
    "max_entries": 50,
    "ttl_days": 7
  },
  "queries": []
}
```

---

## Step 4: Write SCHEMA.md

Create `SCHEMA.md` at `<wiki-root>/SCHEMA.md`.

### Universal Content (All Personas)

```markdown
---
lang: <english | farsi>
persona: <persona>
wiki_root: <path>
---

# Schema & Conventions

## Core Conventions

### Page Frontmatter
Every wiki page must start with:
```yaml
---
title: <Title>
tags: [tag1, tag2]
sources: [source-slug1]
updated: YYYY-MM-DD
status: <draft | expanded | archived>
---
```

### Language-Aware Naming
| Page Type | English | Farsi |
|-----------|---------|-------|
| Source map | `source-<slug>-map` | `نقشه-منبع-<slug>` |
| Topic | `topic-<slug>-<t>` | `موضوع-<slug>-<t>` |
| Concept | `concept-<name>` | `مفهوم-<name>` |
| Chunk | `chunk-<slug>-<id>` | `بخش-<slug>-<id>` |
| Relations | `relations-<slug>` | `روابط-<slug>` |

### Page Type Property
Every wiki page MUST include a `type` property in frontmatter. Use Farsi values when `lang: farsi`.

| Page Kind | English `type` | Farsi `type` |
|-----------|---------------|-------------|
| Main wiki index | `index` | `فهرست` |
| Source map/index | `source-index` | `فهرست-منبع` |
| Topic page | `topic` | `موضوع` |
| Concept page | `concept` | `مفهوم` |
| Chunk page | `chunk` | `بخش` |
| Relations page | `relations` | `روابط` |
| Query page | `query` | `پرسش` |
| Lint report | `lint` | `بازبینی` |
| Overview | `overview` | `مرور` |
| Log | `log` | `گزارش` |

#### Concept Page Frontmatter
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| synthesis_version | integer | Yes | Maturity level: 0=auto-draft, 1=user-validated, N+1=re-synthesized |

`synthesis_version` is monotonically increasing. Only concept pages carry this field.

### Cross-References
Use `[[slug]]` where slug = filename without `.md`.

### Citations
Three valid targets:
1. **Quote citation**: `[^1]: [[source]] §section — "verbatim quote"`
2. **Synthesis citation**: `[^2]: [[source]] §section [synthesis] — description`
3. **Paragraph-anchor**: `[^3]: [[chunk-<slug>-<id>]] — "verbatim quote"`

Rules:
- Target is `[[chunk-<slug>-<id>]]`, `[[source-slug]]`, `raw/`, `assets/`, or `<url>`. Never cite entity/concept pages.
- Locator present: `§section`, `p.N`, `[HH:MM:SS]`, URL anchor, or `(YYYY-MM-DD)`.
- Either verbatim quote or `[synthesis]` tag plus description.

### AI-SYNTHESIS Marker
```markdown
> [AI-SYNTHESIS]: <explanation text>
```
This is the only permitted location for LLM-generated prose that is not a direct citation.

### Source Chunk Map
Every ingested source must have `raw/<slug>/chunks.json`:
- Array of chunk objects: `{id, text, keywords, section, strategy, stats, relationships}`
- `id`: location-based stable hash (e.g., `m{articleNum}`, `p{startPage}`, `s{sectionNum}`) + sequential index
- `text`: verbatim, immutable
- `keywords`: noun phrases, frequency-ranked, capped at 15
- `section`: heading hierarchy path (e.g., `Chapter 3 > Section 2`)
- `strategy`: detected source type (`legal-articles`, `paged-book`, `transcript`, `markdown-article`, `unstructured`)
- `stats`: `{wordCount, estimatedTokens, pageRange}`
- `relationships`: array of `{to, type, evidence}`

### Chunk Pages
Every chunk that passes the salience filter must have `wiki/pages/chunk-<slug>-<id>.md`:
- Frontmatter: `title: "Chunk <id> — <section>"`, `tags: [chunk, source]`, `sources: [<slug>]`, `status: expanded`
- Body:
  - `## Chunk Text` — verbatim in blockquotes
  - `## Chunk Summary` — 1-2 sentence synthesis
  - `## Extracted Concepts` — `[[concept-slug]]` links (salient only)
  - `## Source Map` — backlink to `[[source-<slug>-map]]`

### Page Status
- `draft` — initial page with partial content, pending expansion
- `expanded` — fully developed
- `archived` — no longer current

### Log Entry Format
```markdown
## [YYYY-MM-DD] <operation> | <title>
```
Operations: init, ingest, query, update, lint, audit, cross-source-synthesis

### Directory Conventions
- `raw/` is immutable
- `log.md` is append-only
- `index.md` updated on every structural change
- All pages flat in `wiki/pages/`
- `overview.md` reflects current synthesis
- `exports/` is write-only for persona outputs
```

### Persona-Specific Additions

Append the relevant section based on the selected persona:

#### For Researcher Wikis
```markdown
### Researcher-Specific Conventions

**Contribution Tagging**: Every topic page must include:
```markdown
## Contribution Assessment
- **Novelty**: High / Medium / Low (relative to corpus)
- **Replication**: Required / Completed / N/A
- **Methodology**: [method name] — [[concept-method]]
- **Key Finding**: One-sentence takeaway
```

**Source Metadata Frontmatter** (auto-extracted to `raw/<slug>/metadata.json`):
```yaml
methodology: [RCT, survey, qualitative, theoretical, mixed-methods]
sample_size: N
peer_reviewed: true | false | preprint
datasets: [dataset-name]
key_contribution: "What this source adds that no previous source did"
```

**Cross-Source Synthesis**: Concept pages must include:
- `Consensus` section where multiple sources agree
- `Contradiction` section where sources disagree (flag as unresolved)
- `Evolution` section for temporal claim changes
- `Gap` section for missing coverage
```

#### For Creator Wikis
```markdown
### Creator-Specific Conventions

**Story Angle Tagging**: Every topic page must include:
```markdown
## Story Angles
- [ ] **Contrarian**: "Why everyone is wrong about X"
- [ ] **Explainer**: "How X actually works"
- [ ] **Human Interest**: "The person behind X"
- [ ] **Trend**: "X is the future of Y"
- [ ] **Practical**: "How to use X today"
```

**Quote Extraction**: Chunk pages must include:
```markdown
## Key Quotes
> "Exact quote" — [[chunk-<slug>-<id>]]
> **Usage**: [ ] Blog post [ ] Social thread [ ] Script [ ] Newsletter
```

**Export Staging**: All publishable content goes to `exports/creator/story-outlines/`
```

#### For Reporter Wikis
```markdown
### Reporter-Specific Conventions

**Temporal & Verification Tagging**: Every topic page must include:
```markdown
## Claim Verification
| Claim | Date | Source Type | Status | Evidence |
|-------|------|-------------|--------|----------|
```

**Source Bias Map**: Source map must include:
```yaml
source_perspective: [government, industry, academic, ngo, eyewitness, expert_opinion]
funding_conflict: none | disclosed | suspected
verification_status: verified | partial | unverified | disputed
urgency: breaking | timely | evergreen | historical
```

**Conflict Detection**: Flag contradictions at ingest time in `relations-<slug>.md`
```

#### For Learner Wikis
```markdown
### Learner-Specific Conventions

**Progressive Disclosure**: Every concept page must include:
```markdown
## Prerequisites
- [[concept-previous-topic-1]]
- [[concept-previous-topic-2]]

## Mastery Check
- [ ] Can explain X in one sentence
- [ ] Can compare X to Y
- [ ] Can apply X to a new problem
- [ ] Can teach X to someone else
```

**Learning Path Tags**: Use `learning_path_tag` in metadata:
```yaml
learning_path_tag: [foundational | intermediate | advanced | specialist]
difficulty_level: 1-5
estimated_time: "2 hours"
```
```

#### For Strategist Wikis
```markdown
### Strategist-Specific Conventions

**Decision Support**: Every topic page must include:
```markdown
## Strategic Implications
- **Market Signal**: [opportunity | threat | neutral]
- **Competitor Mention**: [[concept-competitor]] — how they relate
- **Decision Relevance**: [high | medium | low]
- **Confidence Level**: [certain | probable | speculative]
- **Recommended Action**: 
```

**Signal Tracking**: Use `market_signal` in metadata:
```yaml
market_signal: [emerging | maturing | declining | disruptive]
competitor_mention: [competitor-name | none]
decision_relevance: [strategic | tactical | informational]
confidence_level: [high | medium | low]
```
```

---

## Step 5: Write Initial Pages

### 5.1 index.md

Generate `wiki/index.md` using the persona-specific template below.

#### Researcher Template
```markdown
---
title: Index
type: index
tags: [index]
updated: YYYY-MM-DD
---

# <Domain> Wiki — Research Index

## Sources
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Research Themes
### Methodologies
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

### Datasets
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

### Key Contributions (Auto-Tracked)
| Source | Contribution | Novelty | Status |
|--------|-------------|---------|--------|

## Open Questions
1. 
2. 

## Expanded Concepts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Stubs
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

#### Creator Template
```markdown
---
title: Content Index
type: index
tags: [index]
updated: YYYY-MM-DD
---

# <Domain> Wiki — Content Index

## Source Maps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Story Banks
### Ready to Publish
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

### Story Angles in Development
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Quote Library
| Quote | Source | Topic | Used In |
|-------|--------|-------|---------|

## Content Gaps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Expanded Concepts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

#### Reporter Template
```markdown
---
title: Reporting Index
type: index
tags: [index]
updated: YYYY-MM-DD
---

# <Domain> Wiki — Reporting Index

## Verification Queue
| Claim | Source | Date | Status | Assigned |
|-------|--------|------|--------|----------|

## Active Conflicts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Source Register
| Source | Type | Bias | Last Checked |
|--------|------|------|--------------|

## Follow-up Leads
<!-- User-managed -->

## Expanded Concepts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

#### Learner Template
```markdown
---
title: Learning Index
type: index
tags: [index]
updated: YYYY-MM-DD
---

# <Domain> Wiki — Learning Index

## Learning Paths
### Foundational
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

### Intermediate
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

### Advanced
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Source Maps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Concepts by Difficulty
| Concept | Level | Prerequisites | Time |
|---------|-------|---------------|------|

## Mastery Tracker
<!-- User-managed -->

## Expanded Concepts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

#### Strategist Template
```markdown
---
title: Strategy Index
type: index
tags: [index]
updated: YYYY-MM-DD
---

# <Domain> Wiki — Strategy Index

## Market Signals
| Signal | Source | Confidence | Date |
|--------|--------|------------|------|

## Competitor Intelligence
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Source Maps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Decision Support
| Topic | Relevance | Confidence | Recommended Action |
|-------|-----------|------------|-------------------|

## Expanded Concepts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

### 5.2 overview.md

Generate `wiki/overview.md` using the persona-specific sections below.

#### Researcher
```markdown
---
title: Overview
type: overview
tags: [overview]
updated: YYYY-MM-DD
---

# Overview

## Current Synthesis
> [AI-SYNTHESIS]: [Empty until first ingest]

## Research Questions
1. 
2. 

## Methodological Landscape
| Method | Sources | Strengths | Weaknesses |
|--------|---------|-----------|------------|

## Replication Status
| Claim | Original Source | Replication Attempts | Result |
|-------|-----------------|----------------------|--------|

## Open Questions
<!-- User-managed -->

## Recent Shifts
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

#### Creator
```markdown
---
title: Content Overview
type: overview
tags: [overview]
updated: YYYY-MM-DD
---

# Content Overview

## Content Landscape
> [AI-SYNTHESIS]: [Empty until first ingest]

## Narrative Arcs
1. 

## Publishable Summaries
| Topic | Status | Platform | Due |
|-------|--------|----------|-----|

## Content Gaps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Audience Insights
<!-- User-managed -->
```

#### Reporter
```markdown
---
title: Reporting Overview
type: overview
tags: [overview]
updated: YYYY-MM-DD
---

# Reporting Overview

## Fact Landscape
> [AI-SYNTHESIS]: [Empty until first ingest]

## Verification Backlog
| Claim | Priority | Source | Deadline |
|-------|----------|--------|----------|

## Source Bias Map
| Perspective | Sources | Coverage Gaps |
|-------------|---------|---------------|

## Breaking/Trending
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->

## Follow-up Stories
<!-- User-managed -->
```

#### Learner
```markdown
---
title: Learning Overview
type: overview
tags: [overview]
updated: YYYY-MM-DD
---

# Learning Overview

## Knowledge Landscape
> [AI-SYNTHESIS]: [Empty until first ingest]

## Learning Paths
### Path 1: [Name]
- [[concept-1]] → [[concept-2]] → [[concept-3]]

## Progress Tracker
| Concept | Status | Date Started | Date Mastered |
|---------|--------|--------------|---------------|

## Open Questions
<!-- User-managed -->
```

#### Strategist
```markdown
---
title: Strategy Overview
type: overview
tags: [overview]
updated: YYYY-MM-DD
---

# Strategy Overview

## Market Landscape
> [AI-SYNTHESIS]: [Empty until first ingest]

## Competitive Positioning
| Competitor | Strength | Weakness | Our Position |
|------------|----------|----------|--------------|

## Decision Log
| Date | Decision | Evidence | Outcome |
|------|----------|----------|---------|

## Strategic Gaps
<!-- PENDING: wiki-ingest — will be populated on first source ingestion -->
```

### 5.3 log.md

Generate `wiki/log.md`:
```markdown
---
title: Log
type: log
tags: [log]
updated: YYYY-MM-DD
---

# Operation Log

## [YYYY-MM-DD] init | <Domain> Wiki
- Persona: <persona>
- Language: <lang>
- Source velocity: <velocity>
- Path: <path>
- Configuration: salience_threshold=<N>, gate_policy=<policy>, pattern_detection_trigger=<N>
```

### 5.4 queries.md

Generate `wiki/queries.md`:
```markdown
---
title: Queries
type: query
tags: [queries]
updated: YYYY-MM-DD
---

# Saved Queries

<!-- Query outputs are saved here with date and tags -->
```

### 5.5 user-journey.md

Generate `wiki/user-journey.md`:
```markdown
---
title: User Journey
type: log
tags: [journey, meta]
updated: YYYY-MM-DD
---

# User Journey Log

<!-- This file tracks concept discovery interactions between the user and wiki-query.
     Each entry records a conversation session: what was explored, what insight was
     proposed, and whether it resonated with the user.
     
     Successful discoveries become concept pages.
     Failed attempts are learning memos for improving future conversations. -->
```

---

## Step 6: Confirmation

Report back to the user:

```markdown
Wiki initialized at `<wiki-root>/`

Configuration:
- Domain: <domain>
- Persona: <persona>
- Language: <lang>
- Source velocity: <velocity>
- Expansion policy: <gate_policy>
- Pattern detection trigger: <N> sources
- Concept creation: conversation-driven (via wiki-query)
- Lint automation: Phase A after every ingest, Phase B every <N> ingests
- Chunk target: <size> words (<boundary_rule>-based)
- Max chunk pages per source: <N>

Created:
- SCHEMA.md (with <persona> conventions)
- PERSONA.md (behavior contract)
- wiki/index.md (<persona> template)
- wiki/overview.md (<persona> sections)
- wiki/log.md
- wiki/queries.md
- wiki/user-journey.md (concept discovery log)
- wiki/keyword-index.json (keyword search index)
- wiki/query-cache.json (Q&A response cache)
- exports/<persona>/ staging directories

Next steps:
1. Add sources to `raw/` or run `wiki-ingest` directly
2. The system will auto-extract: <list persona-specific metadata fields>
3. Phase 1 salience threshold: <N>/5 (<strictness>)
4. Run `wiki-query` to explore topics and discover concepts through conversation
```

---

## Common Mistakes to Avoid (Init)

- Do not skip the purpose interview — defaulting to "general" defeats the purpose of the system
- Do not create generic `index.md` without persona-specific sections — the user will not know where to look
- Do not forget `PERSONA.md` — all downstream operations depend on it
- Do not create stub pages during init — the wiki starts empty and grows selectively
- Do not override `gate_policy: exhaustive` for learner personas unless explicitly requested
- Do not mix languages in page names — respect the `lang` setting consistently
- Do not configure concept auto-creation — concepts are conversation-driven through wiki-query
- Do not forget `ingest_counter` and `lint_phase_b_trigger` in PERSONA.md — lint automation depends on them
- Not creating keyword-index.json and query-cache.json during init (required for wiki-ingest and wiki-query)
- Using deprecated placeholder formats (use only `<!-- PENDING: ... -->` or `<!-- NO-DATA: ... -->`)
