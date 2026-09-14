---
name: wiki-query
parent: wiki-skill-v4.2.0
description: >
  Dual-mode wiki interaction: (1) Corpus-grounded Q&A using retrieval cost hierarchy
  and persona-aware formatting, and (2) Concept Discovery Mode — conversation-driven
  concept creation that combines cross-source evidence with user experience to produce
  "AHA moment" insight pages. Always references user-journey.md for conversation context.
---

# Operation 3: wiki-query (Corpus-Grounded Question Answering)

## Goal
Two modes of operation:
1. **Q&A Mode**: Answer user questions using only wiki content. Never answer from general knowledge. Follow retrieval cost hierarchy.
2. **Concept Discovery Mode**: Guide the user through topic exploration, gather their experience and insights through conversation, and synthesize concept pages that produce genuine realizations ("AHA moments").

Both modes always reference `wiki/user-journey.md` for context about past interactions.

## Prerequisites
- `wiki-init` and at least one `wiki-ingest` completed
- `PERSONA.md` and `SCHEMA.md` readable
- `wiki/index.md` and `wiki/overview.md` exist

## Pre-Flight Checklist
1. Read `PERSONA.md` — extract persona for answer formatting
2. Read `SCHEMA.md` — confirm language and naming conventions
3. Read `wiki/index.md` — find relevant pages
4. Read `wiki/overview.md` — check current synthesis state
5. Read `wiki/user-journey.md` — check past concept discovery sessions, lessons learned
6. Scan `source-*-map.md` pages for "Concept Candidates" sections — prioritize exploration topics

---

## Mode Selection: Q&A vs. Concept Discovery

At the start of every wiki-query session, determine the mode:

| Signal | Mode | Action |
|--------|------|--------|
| User asks a specific question | **Q&A Mode** | Proceed to Phase QA-0 (Cache Check) |
| User says "explore", "discover", "what's interesting" | **Concept Discovery** | Proceed to Phase CD-1 |
| User starts session without specific question | **Concept Discovery** | Suggest topics, proceed to Phase CD-1 |
| System detects high-priority concept candidates | **Concept Discovery** | Offer exploration before Q&A |

---

## Concept Discovery Mode (CD)

### Phase CD-1: Topic Suggestion & Session Start

When entering Concept Discovery Mode:

#### Step CD-1.0: Check for Draft Concepts

Before suggesting new topics for exploration:
1. Scan `wiki/pages/concept-*.md` for pages with `status: draft` in frontmatter
2. If draft concepts found:
   - Prioritize these for exploration (evidence already gathered during ingest)
   - Present to user: "There are N draft concepts ready for deeper discussion: [list titles]. These already have cross-source evidence gathered. Would you like to explore one?"
   - If user selects a draft concept → load its existing evidence and proceed to Phase CD-2 with pre-loaded context
   - If user declines → proceed to Step CD-1.1 (standard topic suggestion)
3. If no draft concepts found: proceed to Step CD-1.1 as normal

#### Step CD-1.1: Gather Exploration Context

Read (in order):
1. `wiki/user-journey.md` — what topics were explored before, what worked, what didn't
2. `wiki/index.md` — current wiki state
3. `wiki/overview.md` — current synthesis and open questions
4. All `source-*-map.md` "Concept Candidates" sections — pending candidates with cross-source strength
5. All `source-*-map.md` "Cross-Source Patterns" sections — detected convergences and contradictions

#### Step CD-1.2: Prioritize Topics for Suggestion

Rank potential exploration topics using:

| Priority | Condition | Rationale |
|----------|-----------|----------|
| 1 (highest) | Concept candidate with 3+ sources + contradiction | Tension = insight potential |
| 2 | Concept candidate with 3+ sources + convergence | Multiple angles = rich discussion |
| 3 | Cross-source pattern flagged as "high-priority" | System already detected something |
| 4 | Topic the user has never explored (check user-journey.md) | Fresh territory |
| 5 | Topic partially explored but no concept emerged (check user-journey.md) | Unfinished business |

#### Step CD-1.3: Present Topic Suggestions

Present 3-5 topics to the user:

```markdown
## Concept Clusters Ready for Exploration

Based on your wiki's cross-source patterns and your previous conversations, these concepts are interconnected and best explored together:

### Cluster 1: <Theme Name> (High Priority)
- [[concept-candidate-A]] -- <relationship to B>
- [[concept-candidate-B]] -- <relationship to C>
- [[concept-candidate-C]] -- <relationship to A>
- **Why together**: <explanation of how exploring them together reveals more than separately>
- **Sources**: [[source-a]], [[source-b]], [[source-c]]

### Cluster 2: <Theme Name>
- [[concept-candidate-D]] -- <relationship to E>
- [[concept-candidate-E]] -- <relationship to D>
- **Why together**: <explanation>
- **Sources**: [[source-b]], [[source-d]]

> Pick a cluster to explore, or bring your own topic. You can also pick individual concepts from any cluster.
```

**If no concept candidates exist yet** (early wiki with few sources):
```markdown
## Let's Explore

Your wiki has <N> sources. Here are the most interesting areas:

### Topics with richest coverage:
1. [[topic-<slug>-<t>]] — <brief description>
2. [[topic-<slug>-<t>]] — <brief description>

> What's been on your mind? What connections are you curious about?
> Or tell me about your experience with any of these topics.
```

---

### Phase CD-2: Conversational Context Gathering

#### Language Rule (Mandatory)
All conversation in Concept Discovery Mode follows the user's language. Respond in whatever language the user uses to communicate. This applies to topic suggestions, dialogue, and concept synthesis — all must match the user's language.

#### Step CD-2.1: Pull Cross-Source Evidence

Once the user selects a topic (or brings their own):
1. Read ALL topic pages related to this subject (cross-linked via lint Phase A's "Related Topics" sections)
2. Read the chunk pages cited by those topic pages
3. Read any relations pages that mention contradictions or patterns for this topic
4. Build an internal "evidence map" of what sources say about this topic

#### Step CD-2.2: Present Initial Framing

Present the topic's cross-source landscape to the user:

```markdown
## Here's what your sources say about <Topic>:

**From [[source-a]] ([[topic-a-§3]]):**
> "<key claim or quote>"

**From [[source-b]] ([[topic-b-§2]]):**
> "<different angle or claim>"

**Tension/Pattern I notice:**
> [AI-SYNTHESIS]: <description of interesting pattern, contradiction, or convergence>

---

**Questions for you:**
- How does this relate to your own experience?
- Have you seen this pattern play out differently?
- What surprised you about these perspectives?
```

#### Step CD-2.5: Multi-Concept Parallel Exploration

During the conversation, actively bring in related concepts from the cluster:
- When discussing concept A, surface evidence from related concepts B and C
- Present how the current topic connects to adjacent concepts
- Ask the user: "This connects to <concept-B> — have you noticed that relationship?"
- The goal is to explore a CLUSTER, not a single isolated topic
- Multiple concept pages can emerge from a single session if the conversation reveals distinct insights for each
- Track which concepts in the cluster have been sufficiently explored vs. which need more dialogue

#### Step CD-2.3: Engage in Dialogue

This is the CORE of concept discovery. The system:

1. **Asks probing questions** based on source evidence:
   - "Source A says X, but Source B disagrees. What's your take?"
   - "Have you encountered this in practice?"
   - "What does your experience tell you about why these sources differ?"

2. **Surfaces tensions** the user might not have noticed:
   - "Interesting — Source A was written in 2019 and Source C in 2024. The field shifted between them."
   - "Three sources agree on X, but none of them address Y. Is that a gap you've noticed?"

3. **Accumulates user contributions**:
   - Personal experiences
   - Opinions and reactions
   - Connections the user draws
   - Questions that reveal deeper understanding
   - "AHA" moments that emerge naturally in dialogue

4. **Tracks conversation depth** — internal signals that enough context has been gathered:
   - User has shared personal experience (not just opinions)
   - At least 2-3 source perspectives have been discussed
   - A tension, pattern, or insight has been articulated
   - User shows signs of realization ("oh!", "wait...", "that means...", "I never thought about it that way")

**Guidelines for dialogue:**
- Never lecture. Always ask.
- Present source evidence as conversation starters, not conclusions.
- Follow the user's energy — if they're excited about a tangent, follow it.
- The goal is to HELP THE USER discover an insight, not to TELL them one.
- Keep turns short. Max 2-3 paragraphs per response.
- Reference specific sources to ground the conversation.

#### Step CD-2.4: Recognize Readiness

Move to synthesis when:
- The user has explicitly stated a realization or connection
- OR the conversation has naturally produced an insight through dialogue
- OR the user asks "what does this all mean?" / "can you summarize what we've found?"

Do NOT rush synthesis. A shallow concept is worse than no concept.

---

### Phase CD-3: Concept Synthesis

#### Step CD-3.1: Draft the Concept Page

Combine:
- **(a) Cross-source evidence** — the topic pages, chunk citations, patterns
- **(b) User experience** — what the user contributed during conversation
- **(c) The insight itself** — the "AHA moment" that emerged

**Concept page template:**

```markdown
---
title: "<Concept Name — phrased as an insight>"
type: concept
tags: [concept, insight, <domain-tags>]
sources: [<all-sources-that-contributed>]
updated: YYYY-MM-DD
status: expanded
synthesis_version: 1
discovery_session: YYYY-MM-DD
validated: pending
---

# <Concept Name>

## The Insight
> [AI-SYNTHESIS]: <One paragraph distilling the core realization. This should make someone say "oh!" when reading it. It's not a summary — it's a CONCLUSION that wasn't obvious before the conversation.>

## Why This Matters
> [AI-SYNTHESIS]: <Why this insight is significant. What does it change about how we understand the topic?>

## Source Evidence

### From [[source-a]] ([[topic-a-§3]]):
> "<verbatim quote>"[^1]
> — [[chunk-<slug>-<id>]]

### From [[source-b]] ([[topic-b-§2]]):
> "<verbatim quote>"[^2]
> — [[chunk-<slug>-<id>]]

### Cross-Source Pattern:
> [AI-SYNTHESIS]: <How these sources together reveal something none of them says alone>

## User Experience & Contribution
> **User's perspective**: <What the user shared from their personal experience that contributed to this insight>
>
> **Connection drawn**: <The specific connection or realization the user made during conversation>

## Implications
> [AI-SYNTHESIS]: <What follows from this insight? What questions does it open? What should be explored next?>

## Related
- [[topic-a-§3]] — <relationship>
- [[topic-b-§2]] — <relationship>
- [[concept-<related>]] — <if exists>

---
*This concept emerged from a wiki-query conversation on YYYY-MM-DD.*
*Discovery logged in [[user-journey]].*
```

#### Step CD-3.2: Present to User for Validation

Show the draft and ask:

```markdown
## Here's what emerged from our conversation:

<Show full concept draft>

---

**Does this resonate?**
Does reading this back make you feel something — an "AHA", a "WOW", a new understanding?

[ ] Yes — this captures a genuine insight
[ ] Partially — the direction is right but something is missing
[ ] No — this doesn't feel like a real discovery

> Tell me more about your reaction.
```

---

### Phase CD-4: Validation & User Journey Logging

#### Step CD-4.1: Handle User Response

**If YES (validated):**
1. Write `wiki/pages/concept-<name>.md` with the final content
2. Set `validated: true` in frontmatter
3. Update `wiki/index.md` — add concept to "Expanded Concepts" section
4. Update `wiki/overview.md` — add insight to synthesis
5. Update `wiki/user-journey.md` — log successful discovery

**synthesis_version handling:**
- New concept from conversation: `synthesis_version: 1` (first user-validated synthesis)
- Promoted from draft: bump `synthesis_version: 0 → 1`, set `status: expanded`, remove `auto-generated` tag
- Re-explored concept: bump `synthesis_version` by 1 (user added new insight to existing concept)

#### Post-Creation Verification (MANDATORY):
Before reporting success, verify ALL of the following:
- [ ] Concept page exists at `wiki/pages/concept-<name>.md`
- [ ] All sections have actual content (not just headers or placeholders)
- [ ] `type` field is set in frontmatter (`concept` or `مفهوم` per language setting)
- [ ] Page is referenced in `wiki/index.md` under "Expanded Concepts"
- [ ] Page is referenced in relevant `source-<slug>-map.md` "Concepts Extracted" table
- [ ] `wiki/user-journey.md` has been updated with session log
- [ ] `wiki/overview.md` has been updated with the new insight

If any check fails, fix it before proceeding to Phase CD-5.

**If PARTIALLY:**
1. Ask: "What's missing? What would make this click?"
2. Iterate on the concept draft with user feedback
3. Present revised version
4. Repeat until YES or NO

**If NO (rejected):**
1. Ask: "What went wrong? Why doesn't this feel like a real insight?"
2. Log the full interaction in `wiki/user-journey.md` as a learning memo
3. Do NOT create the concept page
4. Thank the user for the conversation — the exploration still informed future sessions

#### Step CD-4.2: Log to user-journey.md

Append to `wiki/user-journey.md`:

```markdown
## [YYYY-MM-DD] Concept Discovery: <Topic>

### Session Summary
- **Topics explored**: [[topic-a]], [[topic-b]], ...
- **Sources referenced**: [[source-a]], [[source-b]], ...
- **Conversation turns**: <N>
- **User context gathered**: <summary of what the user shared — experiences, opinions, connections>

### Concept Proposed
- **Name**: <concept name>
- **Core insight**: <one sentence>
- **Key evidence**: [[chunk-a]], [[chunk-b]]

### User Reaction
- **Validated**: yes | partial | no
- **User feedback**: "<what the user said about it>"
- **If no — why**: "<user's explanation of what was missing>"

### Lessons Learned
- <What worked well in this conversation>
- <What to do differently next time>
- <Topics or angles to explore in future sessions>

### Status: success | failed | deferred
```

#### Step CD-4.3: Update Concept Candidates

After a successful concept discovery:
1. Remove the candidate from all `source-*-map.md` "Concept Candidates" tables (status → "created")
2. Update related topic pages to add `[[concept-<name>]]` in their "Related" sections

After a failed attempt:
1. Update candidate status in source maps to "attempted — <reason>"
2. Keep for potential future exploration with different approach

#### Step CD-4.4: Update Relations Pages

For every source that contributed to the validated concept:
1. Read `wiki/pages/relations-<slug>.md` for each contributing source
2. Add new cross-source relationships discovered during the conversation to the "Cross-Source Relationships" table
3. If contradictions were discussed, add to the "Conflicts Detected" table
4. Bump `updated` in frontmatter

Relations pages are living documents. Every concept discovery session that reveals new cross-source connections MUST update them.

---

### Phase CD-5: Session Wrap-Up

Always end a concept discovery session with:

```markdown
## Session Complete

**Result**: <Concept created | Exploration logged | Deferred>
**Concept**: [[concept-<name>]] (if created)
**Journey log**: Updated [[user-journey]]

**What's next?**
- Explore another concept candidate? (<N> remaining)
- Ask a question about the wiki?
- Ingest a new source?
```

---

## Phase QA-0: Cache Check

Before executing any Q&A query:
1. Read `wiki/query-cache.json`
2. Search for a matching query (fuzzy match on question text, >85% word overlap similarity)
3. If match found AND entry is NOT stale:
   - Staleness rule: entry is stale if `ingest_count_at_answer < current ingest_counter` in PERSONA.md
   - Return cached answer with note: "Retrieved from cache (originally answered YYYY-MM-DD). Would you like a fresh answer incorporating recent changes?"
   - If user accepts cached answer: done (no further phases)
   - If user requests fresh answer: proceed to Phase QA-1
4. If no match found OR entry is stale: proceed to Phase QA-1

### Cache Write (after Phase QA-5)
After successfully answering a query and completing Phase QA-5:
1. Read `wiki/query-cache.json`
2. Add entry to the `queries` array:
   ```json
   {
     "question": "<normalized question text>",
     "answer_summary": "<first 200 characters of the answer>",
     "pages_consulted": ["page1.md", "page2.md"],
     "answered_at": "YYYY-MM-DD",
     "ingest_count_at_answer": <current ingest_counter from PERSONA.md>
   }
   ```
3. If `queries` array exceeds `_meta.max_entries` (default 50): evict the oldest entry
4. Update `_meta.updated` timestamp
5. Write `wiki/query-cache.json`

**Note:** Cache Check (Phase QA-0) applies ONLY to Q&A mode. Concept Discovery mode always runs fresh (no caching).

---

## Phase QA-1: Query Parsing & Intent Classification

### Step QA-1.1: Parse the Question

Classify the query into one of these types:

| Query Type | Definition | Example | Strategy |
|-----------|------------|---------|----------|
| **Fact lookup** | Specific claim or data point | "What sample size did the Vosk paper use?" | Read chunk page directly |
| **Concept explanation** | Understanding a topic | "Explain multi-head attention" | Read concept page, follow links |
| **Cross-source comparison** | Compare multiple sources | "How do Whisper and Vosk differ on Farsi accuracy?" | Read multiple concept pages, synthesize |
| **Corpus overview** | State of knowledge | "What do we know about Persian ASR?" | Read overview + index + expanded concepts |
| **Source verification** | Check if claim exists | "Does any source claim 95% accuracy?" | Search across chunk pages |
| **Relationship query** | How sources relate | "Which sources contradict each other?" | Read relations pages |
| **Temporal query** | How understanding evolved | "How has attention mechanism changed since 2017?" | Read concept page synthesis sections |

### Step QA-1.2: Extract Keywords & Concepts

From the query, extract:
- **Named entities**: specific concepts, people, methods, datasets
- **Temporal markers**: dates, eras, "since", "before", "latest"
- **Comparative markers**: "vs", "compare", "difference", "similar"
- **Evidential markers**: "evidence", "support", "contradict", "verify"
- **Scope markers**: "all sources", "any source", "which source"

Map these to wiki slugs using `index.md` and `overview.md`.

---

## Phase QA-2: Retrieval (Cost Hierarchy Escalation)

Follow the retrieval cost hierarchy strictly. Escalate only when cheaper primitives are insufficient.

### Step QA-2.1: Read index.md (Cheapest)

Read `wiki/index.md` in full. Look for:
- Relevant source maps: `[[source-*-map]]`
- Relevant concepts: `[[concept-*]]`
- Relevant topics: `[[topic-*]]`
- Relevant relations pages: `[[relations-*]]`

**If index.md answers the query directly** (e.g., "List all sources"), synthesize and return.

### Step QA-2.2: Read Page Summaries (Cheap)

For each relevant page found in index.md, read only the frontmatter:
```yaml
---
title: ...
tags: [...]
sources: [...]
updated: ...
status: expanded | single-source
synthesis_version: N
---
```

**Decision based on status:**
- `status: expanded` with `synthesis_version > 0` → High confidence, cross-source evidence available
- `status: expanded` with `synthesis_version: 0` → Single-source only, limited depth
- `status: single-source` → Only one source represented, flag this limitation
- `status: stub` → **This system does not use stubs.** If encountered, flag as "incomplete ingestion"

### Step QA-2.3: Search for Specific Claims (Medium)

If the query asks for a specific claim, search within relevant pages for:
- The exact phrase or close variants
- Citation markers (`[^N]`)
- `> [AI-SYNTHESIS]:` blocks
- Quote blocks (`>`)

**Search strategy:**
1. Search chunk pages first (verbatim text, highest confidence)
2. Search concept pages second (synthesis + evidence)
3. Search topic pages third (single-source claims)

### Step QA-2.4: Read Full Pages (Expensive — Last Resort)

Only read full pages when:
- The query requires understanding the full argument structure
- Multiple claims need to be synthesized
- The summary/search was insufficient

**Parallelize with subagents:**
```
Main Agent:
  1. Determines which pages need full reading
  2. Dispatches subagents:
     - Subagent A: Read concept page X, extract all claims with citations
     - Subagent B: Read concept page Y, extract all claims with citations
     - Subagent C: Read relations page Z, extract all conflicts
  3. Receives structured summaries from subagents
  4. Synthesizes the answer
```

**Subagent output format:**
```yaml
page: "concept-<name>"
status: expanded
synthesis_version: 2
claims:
  - claim: "..."
    evidence: "..."
    source: "[[chunk-<slug>-<id>]]"
    confidence: high | medium | low
  - claim: "..."
    evidence: "..."
    source: "[[chunk-<slug>-<id>]]"
    confidence: high | medium | low
gaps: "..."
```

---

## Phase QA-2.5: Multi-Concept Expansion (Mandatory)

When retrieving evidence for any query, ALWAYS expand the search to include related concepts. Never answer from a single concept in isolation.

### Step QA-2.5.1: Identify Concept Cluster

From the initial retrieval results (Phase QA-2):
1. Read the "Related" section and "Extracted Concepts" of every page found
2. Follow cross-links to adjacent concepts and topics
3. Read relevant `relations-*.md` pages for relationship context
4. Build a "concept cluster" — a set of 3-7 related concepts/topics relevant to the query

### Step QA-2.5.2: Parallel Evidence Gathering

Dispatch subagents to read ALL pages in the concept cluster simultaneously:
- One subagent per source or per 3-4 pages
- Each extracts claims, relationships, and connections to the query topic
- This is NOT optional — single-concept answers are incomplete by default

### Step QA-2.5.3: Synthesize Cross-Concept Relationships

Before answering, explicitly map:
- How the concepts in the cluster relate to each other
- What relationships exist between them (from relations pages)
- What new connections the query reveals that aren't yet documented

---

## Phase QA-3: Synthesis & Answer Construction

### Language Rule (Mandatory)
Always respond in the same language the user asked their question in, regardless of the wiki's `lang` setting in SCHEMA.md. The `lang` setting controls page naming and internal structure only — it does NOT dictate the language of query answers or conversation. If the user asks in English, answer in English. If they ask in Farsi, answer in Farsi. If they ask in any other language, answer in that language.

### Step QA-3.1: Source Evidence First

Present **verbatim evidence before interpretation**:

```markdown
## Source Evidence
> "Exact verbatim quote from chunk page..."[^1]
> — [[chunk-<slug>-<id>]]

> "Another verbatim quote..."[^2]
> — [[chunk-<slug>-<id>]]
```

### Step QA-3.2: AI-SYNTHESIS Interpretation

Mark all interpretation as AI-generated:
```markdown
> [AI-SYNTHESIS]: <Explanation synthesizing the evidence above>
```

### Step QA-3.3: Flag Limitations Explicitly

Always state what the wiki does NOT know:
```markdown
**Limitations:**
- [[concept-<name>]] is single-source only (synthesis_version: 0)
- No cross-source evidence exists for <sub-topic>
- The wiki has no page on <related concept>
- [[chunk-<slug>-<id>]] is deferred content, not yet compiled
```

### Step QA-3.4: Note Agreements & Disagreements

If multiple sources are cited, explicitly note:
```markdown
**Source Agreement:**
- [[paper-a]] and [[paper-b]] both confirm <claim>

**Source Disagreement:**
- [[paper-c]] claims <X>, while [[paper-d]] claims <Y>
- This contradiction is unresolved in the corpus
```

### Step QA-3.5: Suggest Follow-Up

Always suggest next steps:
```markdown
**Suggested Follow-Up:**
- Ingest [[source-<suggested>]] to fill gap on <topic>
- Run `wiki-ingest` with <source> to resolve the contradiction on <claim>
- Deep expand [[concept-<name>]] for full cross-source synthesis
```

### Step QA-3.6: Update Relations Pages (If New Relationships Found)

If the answer synthesis revealed a new cross-source relationship or contradiction not yet recorded:
1. Identify which `relations-<slug>.md` pages should be updated
2. Add the new relationship entry to the appropriate table (Cross-Source Relationships or Conflicts Detected)
3. Bump `updated` in frontmatter
4. This ensures relations pages stay current even from Q&A interactions

---

## Phase QA-4: Persona-Aware Answer Formatting

Format the final answer based on `PERSONA.md` `persona`:

### Researcher Format
```markdown
# Query: <Question>

## Evidence Summary
| Claim | Source | Method | Confidence |
|-------|--------|--------|------------|

## Synthesis
> [AI-SYNTHESIS]: ...

## Limitations & Gaps
...

## Related Research Questions
1. ...
2. ...
```

### Creator Format
```markdown
# Query: <Question>

## Key Takeaways
- ...

## Quotables
> "..." — [[source]]

## Story Angles
- [ ] **Explainer**: ...
- [ ] **Contrarian**: ...

## Synthesis
> [AI-SYNTHESIS]: ...

## Content Gaps
...
```

### Reporter Format
```markdown
# Query: <Question>

## Verified Claims
| Claim | Status | Source | Date |
|-------|--------|--------|------|

## Unverified / Disputed
| Claim | Conflict | Sources |
|-------|----------|---------|

## Synthesis
> [AI-SYNTHESIS]: ...

## Follow-up Leads
...
```

### Learner Format
```markdown
# Query: <Question>

## Prerequisites Met
- [[concept-1]] ✅
- [[concept-2]] ✅

## Answer
...

## Mastery Check
- [ ] Can you explain this in one sentence?
- [ ] Can you compare this to <related concept>?

## Next Learning Step
→ [[concept-next]]
```

### Strategist Format
```markdown
# Query: <Question>

## Strategic Implications
| Signal | Confidence | Recommended Action |
|--------|------------|-------------------|

## Competitive Context
| Competitor | Position | Our Gap |
|------------|----------|---------|

## Synthesis
> [AI-SYNTHESIS]: ...

## Decision Support
...
```

---

## Phase QA-5: Save Option

Always offer to save the answer:
```markdown
> Save this answer as `wiki/pages/query-<slug>.md` with tags: [query, analysis]?
> [Yes] [No]
```

If saved:
1. Create `wiki/pages/query-<slug>.md` with frontmatter including `type: query` (or `پرسش` when `lang: farsi`), `tags: [query, analysis]`, and the full answer
2. Add `[[query-<slug>]]` to `wiki/queries.md`
3. Update `wiki/index.md` if the query reveals new gaps
4. Append to `wiki/log.md`:
   ```markdown
   ## [YYYY-MM-DD] query | <Question>
   - Pages read: <N>
   - Subagents dispatched: <N>
   - Sources cited: <N>
   - Gaps identified: <N>
   - Saved as: [[query-<slug>]]
   ```

### Step QA-5.2: Concept Discovery Offer

If the Q&A conversation revealed an interesting pattern, insight, or connection:

```markdown
> This conversation touched on something that could become a concept page.
> The connection between <X> and <Y> from your question seems worth exploring deeper.
>
> Want to explore this further in Concept Discovery Mode? [Yes] [No]
```

If user says Yes: transition to Phase CD-2 (Conversational Context Gathering) with the topic pre-loaded.

---

## Subagent Dispatch Strategy

### When to Use Subagents

| Scenario | Subagent Count | Task per Subagent |
|----------|---------------|-------------------|
| Query spans 2–3 concept pages | 2–3 | Read one concept page, extract claims + citations |
| Query requires cross-source comparison | 3–5 | Read one source's evidence on the concept |
| Query asks about relationships/conflicts | 2 | Read relations pages, extract conflict tables |
| Query asks corpus-wide overview | 3–5 | Read one section of index/overview each |
| Simple fact lookup (1 chunk page) | 0 | Main agent handles directly |

### Subagent Coordination

```
Main Agent:
  1. Parses query, identifies required pages
  2. Checks retrieval cost hierarchy (does it need full pages?)
  3. If full pages needed:
     a. Dispatches subagents with specific page slugs + extraction instructions
     b. Waits for structured outputs
     c. Synthesizes answer from subagent outputs
  4. If only summaries needed:
     a. Reads frontmatters directly
     b. Synthesizes without subagents
  5. Formats answer per persona
  6. Offers to save
```

### Concept Discovery Mode Subagent Dispatch

| Scenario | Subagent Count | Task per Subagent |
|----------|---------------|-------------------|
| Gathering evidence for concept cluster | 3-6 | Read all topic + chunk pages for one concept in the cluster |
| Building multi-concept relationship map | 2-3 | Read relations pages, build inter-concept links |
| Post-validation updates | 2-3 | Update index, overview, source maps, relations pages |

**Key difference from Q&A mode**: In Concept Discovery, subagents gather evidence BEFORE the conversation starts. The conversation itself is always handled by the main agent (it requires real-time dialogue with the user).

---

## Common Mistakes to Avoid (Query)

- **Answering from general knowledge** — always read the wiki first
- **Reading full pages when summaries suffice** — respect the cost hierarchy
- **Ignoring `status` and `synthesis_version`** — flag limitations honestly
- **Not citing inline** — every claim must have `[[slug]]` or `[^N]`
- **Presenting AI synthesis as source fact** — always mark `[AI-SYNTHESIS]`
- **Not flagging gaps** — silence about missing coverage is misleading
- **Not offering to save** — queries are reusable knowledge artifacts
- **Dispatching subagents for simple lookups** — one chunk page = main agent only
- **Not checking relations pages** — conflicts are often pre-mapped there
- **Forgetting persona formatting** — a researcher needs tables, a creator needs quotes
- **Rushing concept synthesis** — never synthesize a concept until the user has shared personal experience and a genuine insight has emerged in dialogue
- **Creating concepts without user validation** — every concept must pass the "AHA test" with the user
- **Ignoring user-journey.md** — always read it before starting any session; it contains lessons from past interactions
- **Lecturing instead of asking** — concept discovery is conversational; the system asks questions, the user discovers insights
- **Not logging failed concept attempts** — failures are learning memos; always log to user-journey.md
- **Skipping Phase QA-0 cache check** — wastes tokens on repeated questions
- **Auto-creating concept pages in Q&A mode** — concepts are created only in Concept Discovery mode
- **Not bumping synthesis_version when promoting draft concepts** — must go 0 → 1
- **Caching Concept Discovery conversations** — cache is for Q&A mode only
