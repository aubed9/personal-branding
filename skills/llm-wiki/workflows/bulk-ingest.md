---
name: bulk-ingest
parent: wiki-skill-v4.2.0
description: >
  Workflow for ingesting multiple sources into a single wiki in one session.
  Use when the user has 3+ sources to add at once, provides a folder, or says
  "ingest all of these". Operates in Lite mode per source, batches the user
  checkpoint, and runs wiki-lint Phase A once at the end.
---

# Workflow: bulk-ingest

**Goal:** Add N sources to a wiki in one session, with a single user checkpoint instead of N interruptions.

**When to use:** User signals Bulk intent — "ingest all of these", "process this folder", "go through <list>", or has 3+ sources attached.

## Steps

### Step 1: Confirm target wiki

```
GET /wikis
```

If multiple wikis exist, ask which one. If one matches the source domain, use it without asking.

### Step 2: Build the source queue

For each source the user provided:
- Determine the slug (auto-generated from title or filename)
- Determine the source type from a quick peek (article, book, transcript, etc.)
- Validate: does the file exist, is the URL reachable, etc.

If any source can't be located, ask the user before proceeding. Don't silently skip.

### Step 3: Confirm mode

Ask the user:
```
question: "I have <N> sources ready. Process them in Lite mode (fast, deferred synthesis) or Full mode (thorough, includes concept detection)?"
options:
  - label: "Lite (recommended for bulk)"
    description: "Phases 0, 1, 5 only — fast and predictable"
  - label: "Full"
    description: "All 5 phases including cross-source synthesis — slower but more value per source"
```

Default to Lite for bulk unless the user says otherwise.

### Step 4: Pre-flight validation

**Policy:** wiki-validate is **mandatory unless all sources are confirmed duplicates via ≥3 independent signals**.

Signals of duplicate state:
1. Orchestrator registry shows `sourceCount >= queue length`
2. `raw/<slug>/chunks.json` exists for each source
3. `wiki/log.md` has `## [date] ingest` entry for each source
4. `wiki/<index>.md` references each source

**If all 4 signals align:** skip wiki-validate with one-line evidence in the consolidated summary. Document the skip.

**Otherwise:** dispatch `wiki-validate`:

```yaml
task_id: "validate-pre-bulk-<timestamp>"
objective: "Validate wiki '<slug>' state before bulk ingest"
output_format: "yaml"
output_schema:
  type: object
  required: [status]
  properties:
    status: { enum: [valid, drift_detected, critical_error] }
    output_data:
      type: object
      properties:
        drift_count: { type: integer }
        critical_count: { type: integer }
        auto_fixes_applied: { type: array, items: string }
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-validate.md"
verify_dispatch:
  - "status must be one of: valid, drift_detected, critical_error."
```

If critical errors, halt and report. Auto-fixable drift can proceed.

### Step 5: Sequential ingest (parallel within source)

For each source in the queue:

```yaml
task_id: "ingest-<slug>-<source-slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Ingest source '<source-slug>' into wiki '<slug>' (LITE mode)"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-ingest.md"
  - "workspace/wikis/<slug>/SCHEMA.md"
  - "workspace/wikis/<slug>/PERSONA.md"
constraints:
  - "Lite mode: Phases 0, 1, 5 only."
  - "Defer all Phase 2 user suggestions to batch summary."
  - "Update keyword index after each source (not batched)."
return_fields:
  - status: success | partial | failed
  - files_created: <list>
  - files_modified: <list>
  - output_data:
      chunk_pages: <N>
      topic_pages: <N>
      deferred_suggestions: <list>
      concept_candidates: <N>
  - error: <if failed>
  - retry_safe: true
```

Process sources sequentially — never parallelize ingests into the same wiki (race conditions on `wiki/index.md` and `keyword-index.json`).

Between sources, track:
- Per-source status (success / partial / failed)
- Cumulative `ingest_counter` from PERSONA.md
- Concept candidates flagged (collected, not surfaced yet)
- Deferred suggestions (collected, not surfaced yet)

### Step 6: Batch summary checkpoint

After all sources complete (or fail), present a single consolidated summary to the user:

```markdown
## Bulk Ingest Summary: <N> sources

| Source | Status | Chunks | Topics | Suggestions | Candidates |
|--------|--------|--------|--------|-------------|------------|
| <slug-1> | ✅ | <N> | <N> | <N> | <N> |
| <slug-2> | ⚠️ partial | <N> | <N> | <N> | <N> |
| <slug-3> | ❌ failed | — | — | — | — |

### Deferred Enrichment Suggestions
| Source | Topic | Action |
|--------|-------|--------|
| <slug-1> | <topic> | Enrich / Skip |
| <slug-2> | <topic> | Enrich / Skip |

### Concept Candidates Ready for Exploration
- <concept-1>: appears in <N> sources — start wiki-query?
- <concept-2>: appears in <N> sources — start wiki-query?

### Failures
- <slug-3>: <error>

[Accept all enrichment] [Reject all] [Decide per item]
```

Use `AskUserQuestion` for the decisions, or accept free-form "accept all" / "reject all".

### Step 7: Apply accepted enrichments

For each accepted enrichment, dispatch a focused subagent:

```yaml
task_id: "enrich-<slug>-<topic>-<timestamp>"
objective: "Enrich topic <topic> in source <slug> with cross-source comparison"
output_format: "yaml"
context_files:
  - "workspace/wikis/<slug>/wiki/pages/topic-<slug>-<t>.md"
  - ".claude/skills/wiki-skill-v4.2.0/wiki-ingest.md#phase-2"
```

### Step 8: Run wiki-lint Phase A once

After all ingests and enrichments:

```yaml
task_id: "lint-phase-a-post-bulk-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Run wiki-lint Phase A across wiki '<slug>' after bulk ingest"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-lint.md"
return_fields:
  - status: success
  - output_data:
      broken_links_fixed: <N>
      topic_crosslinks_added: <N>
      orphans_connected: <N>
```

Check `ingest_counter` from PERSONA.md — if it crossed `lint_phase_b_trigger`, also run Phase B.

### Step 9: Report

```markdown
Bulk ingest complete.

| Metric | Value |
|--------|-------|
| Sources ingested | <N> |
| Total chunk pages | <N> |
| Total topic pages | <N> |
| Concept candidates | <N> |
| Enrichments applied | <N> |
| Lint Phase A fixes | <N> |
| Lint Phase B | triggered / not-triggered |

Next:
- "explore <top-candidate>" — start concept discovery
- "audit <page>" — verify a specific page
- "check the wiki" — full maintenance
```

## Done Criteria

- [ ] All sources attempted (success, partial, or failed-and-logged)
- [ ] Single user checkpoint completed
- [ ] `wiki-lint Phase A` ran and fixes applied
- [ ] `wiki/index.md` reflects all new sources
- [ ] `wiki/log.md` has one entry per source + lint entry

## Failure Handling

| Failure | Action |
|---------|--------|
| Source file missing | Skip that source, log, continue with others |
| Source parsing fails (encoding) | Skip that source, report in batch summary |
| Ingest subagent fails twice | Skip that source, log, continue with others |
| Lint Phase A fails | Halt — bulk ingest cannot complete with broken connectivity |
| Keyword index corruption | Rebuild from all `raw/*/chunks.json`, continue |
