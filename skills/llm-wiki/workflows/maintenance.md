---
name: maintenance
parent: wiki-skill-v4.2.0
description: >
  Workflow for health-checking a wiki. Runs wiki-validate, wiki-lint Phase A
  and Phase B (if due), and produces a single maintenance report. Use when
  the user says "check the wiki", "run maintenance", "is everything healthy?",
  or as a scheduled/recurring check.
---

# Workflow: maintenance

**Goal:** Produce a single health report for a wiki, applying auto-fixes where safe and surfacing manual-fix decisions.

**When to use:** User signals Maintenance intent — "check the wiki", "run maintenance", "is the wiki healthy?", "fix the wiki", or scheduled.

## Steps

### Step 1: Confirm target wiki

`GET /wikis`. If multiple exist, ask which one. If one exists, use it.

### Step 2: Pre-flight — check orchestrator service

```
GET /health
```

If 503 (MongoDB down), note it but continue — maintenance operates on the filesystem.

### Step 3: Run wiki-validate

```yaml
task_id: "validate-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Validate wiki '<slug>' state consistency"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-validate.md"
return_fields:
  - status: valid | drift_detected | critical_error
  - output_data:
      drift_count: <N>
      critical_count: <N>
      auto_fixes_applied: <list>
```

If critical errors, halt and report immediately — auto-fixes cannot resolve critical issues.

### Step 4: Run wiki-lint Phase A

```yaml
task_id: "lint-phase-a-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Run wiki-lint Phase A on wiki '<slug>'"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-lint.md"
return_fields:
  - status: success
  - output_data:
      broken_links_fixed: <N>
      topic_crosslinks_added: <N>
      orphans_connected: <N>
      duplicates_merged: <N>
```

### Step 5: Decide if Phase B is due

Read `ingest_counter` and `lint_phase_b_trigger` from `workspace/wikis/<slug>/PERSONA.md`.

If `ingest_counter >= lint_phase_b_trigger`, run Phase B:

```yaml
task_id: "lint-phase-b-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Run wiki-lint Phase B on wiki '<slug>' (deep cross-link audit)"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-lint.md"
return_fields:
  - status: success
  - output_data:
      errors: <N>
      warnings: <N>
      concept_candidates_ready: <N>
      relations_refinements: <N>
```

If not due, note in the report that Phase B is `<counter>/<trigger>` ingests away.

### Step 6: Optional audit

If the user explicitly asked for a deep audit OR if Phase B surfaced contradictions, dispatch `wiki-audit` on flagged pages.

Skip this step for routine maintenance — it's expensive.

### Step 7: Consolidate report

Merge outputs from validate, lint A, lint B (if run), and audit (if run) into one summary:

```markdown
## Maintenance Report: <slug> — YYYY-MM-DD

### Health
| Check | Status | Notes |
|-------|--------|-------|
| Service | ✅ / ⚠️ / ❌ | MongoDB up/down/unreachable |
| Validate | ✅ / ⚠️ / ❌ | <N> drift auto-fixed, <N> critical |
| Lint Phase A | ✅ | <N> broken links, <N> orphans connected |
| Lint Phase B | ✅ / skipped | <counter>/<trigger> ingests / Phase B ran |
| Audit | ✅ / skipped | <N> pages checked |

### Auto-fixes applied
- <N> broken links fixed
- <N> topic cross-links added
- <N> orphan pages connected
- <N> ingest counter drift corrected
- <N> keyword index entries added

### Manual fixes needed
| Severity | Page | Issue | Suggested Fix |
|----------|------|-------|---------------|
| 🔴 Critical | <page> | <issue> | <fix> |
| 🟡 Warning | <page> | <issue> | <fix> |

### Concept Candidates Ready
- <concept>: appears in <N> sources, ready for Explore workflow

### Next steps
- <N> critical fixes require your attention
- <N> concept candidates ready for exploration
- Next Phase B in <N> ingests
```

### Step 8: Offer to apply manual fixes

If critical fixes exist, use `AskUserQuestion`:

```
question: "Apply the <N> critical fixes now?"
options:
  - label: "Apply all critical fixes"
  - label: "Show diffs first"
  - label: "Skip — I'll handle manually"
```

For each accepted fix, dispatch a focused subagent. Don't try to apply manual fixes inline — they're typically multi-page.

### Step 9: Log and finish

Append to `workspace/wikis/<slug>/wiki/log.md`:
```markdown
## [YYYY-MM-DD] maintenance | <slug>
- Validate: <status>
- Lint Phase A: <N> fixes
- Lint Phase B: <triggered / skipped>
- Audit: <triggered / skipped>
- Critical issues: <N>
- Manual fixes applied: <N>
```

```yaml
POST /operations
{
  "operation": "maintenance",
  "wiki_id": "<slug>",
  "timestamp": "YYYY-MM-DD",
  "summary": "<one-line>"
}
```

## Done Criteria

- [ ] `wiki-validate` completed
- [ ] `wiki-lint Phase A` completed (auto)
- [ ] `wiki-lint Phase B` completed if due
- [ ] Optional audit run if requested
- [ ] Single consolidated report produced
- [ ] Manual fixes surfaced for user decision
- [ ] `wiki/log.md` has maintenance entry
- [ ] `POST /operations` recorded the run

## Failure Handling

| Failure | Action |
|---------|--------|
| MongoDB / orchestrator service down | Skip `/health`, `/operations`; continue with filesystem |
| wiki-validate reports critical errors | Halt; report; do not run lint (lint could compound errors) |
| wiki-lint subagent fails | Run validate-only maintenance; report partial completion |
| Audit subagent fails | Mark page as "audit pending retry" in report; continue |
| Manual fixes rejected | Leave the issues in place; report them at the end |
