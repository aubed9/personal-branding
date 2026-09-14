---
name: build-wiki
parent: wiki-skill-v4.2.0
description: >
  Workflow for creating a new wiki from scratch. Goes from "I want a wiki on X" to
  "ready to ingest sources". Use when the user signals Build intent (see SKILL.md
  "Intent Classification Rules"). Conducts the purpose interview, creates
  SCHEMA.md and PERSONA.md, registers the wiki with the orchestrator service,
  and (optionally) ingests the first source.
---

# Workflow: build-wiki

**Goal:** Turn "I want a wiki on X" into a fully initialized wiki that's ready to accept sources.

**When to use:** User signals Build intent — "create / start / set up a new wiki", "I want a wiki about <topic>", no wikis exist yet.

## Steps

### Step 1: Discover existing wikis

```
GET /wikis
```

Read the first paragraph of each existing wiki's `wiki/index.md` (or `wiki/فهرست.md` for Farsi wikis). Classify each by domain match against the user's stated topic.

**Skip the "new vs existing" question when:**
- `GET /wikis` returns zero wikis, OR
- The user's topic has **zero keyword overlap** with any existing wiki's index.md first paragraph (use a fast keyword check — no need to read full files)

**Ask the question only when:**
- Exactly one wiki's domain is a strong match (≥2 shared keywords), OR
- Multiple wikis are plausible matches and the choice is genuinely ambiguous

**Question format when asked:**

```
question: "A wiki already exists for <domain>. Do you want a new one, or were you referring to the existing one?"
options:
  - label: "Use the existing <domain> wiki"
  - label: "Create a new wiki (different topic)"
```

This avoids wasting a question turn on the obvious case where the topic clearly doesn't match any existing wiki.

### Step 2: Conduct the purpose interview

You (the main agent) handle this. Do NOT dispatch a subagent for it — only you can ask the user questions. Read `wiki-init.md` Step 1 for the full question set, but use these compressed options via `AskUserQuestion`:

**Question 1 — Domain**
```
question: "What field or topic will this wiki cover?"
header: "Domain"
options:
  - label: "Academic research"
    description: "Papers, methods, datasets, findings"
  - label: "Content creation"
    description: "Story banks, quotes, narrative material"
  - label: "Reporting / journalism"
    description: "Fact-checking, claim verification, sources"
  - label: "Learning / study"
    description: "Progressive knowledge, prerequisites, mastery"
  - label: "Strategy / markets"
    description: "Competitors, signals, decisions"
```

**Question 2 — Source velocity**
```
question: "How many sources do you expect to ingest per week?"
header: "Velocity"
options:
  - label: "Low (1-3)"
    description: "Quality over speed"
  - label: "Medium (4-10)"
    description: "Balanced"
  - label: "High (10+)"
    description: "Aggressive dedup needed"
```

**Question 3 — Language**
```
question: "What language for page names and internal structure?"
header: "Language"
options:
  - label: "English"
  - label: "Farsi (Persian)"
```

**Question 4 — Path**
Default: `workspace/wikis/<domain-slug>/`. Skip unless the user requests a specific location.

**Question 5 — First source**

This is the value-add — don't skip it:
```
question: "Do you have a first source to add now?"
header: "First source"
options:
  - label: "Yes, I'll provide one"
  - label: "No, I'll add sources later"
```

If yes, capture the file path, URL, or pasted text. If no, the workflow ends after Step 5 (init-only).

### Step 3: Pick the wiki slug

From the domain + a unique suffix if needed. ASCII kebab-case. Example: `persian-asr`, `ai-ethics-healthcare`.

### Step 4: Dispatch wiki-init subagent

```yaml
task_id: "init-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Initialize wiki '<slug>' at workspace/wikis/<slug>/ with persona=<persona>, lang=<lang>, velocity=<velocity>, purpose=<purpose>. All interview answers are provided — DO NOT ask the user questions."
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-init.md"
  - ".claude/skills/wiki-skill-v4.2.0/SKILL.md#persona-defaults"
constraints:
  - "Follow wiki-init.md exactly, but skip the Purpose Discovery Interview (answers are in objective)."
  - "Create SCHEMA.md, PERSONA.md, raw/, wiki/, wiki/pages/, assets/, exports/ with persona-specific defaults."
  - "Generate wiki/index.md and wiki/overview.md using the persona template."
  - "Create wiki/keyword-index.json and wiki/query-cache.json skeletons."
  - "Append init entry to wiki/log.md."
return_fields:
  - status: success | partial | failed
  - files_created: <list>
  - files_modified: <list>
  - error: <if failed>
  - retry_safe: true
```

### Step 5: Register with orchestrator service

After the subagent returns success:

```yaml
POST /wikis
{
  "_id": "<slug>",
  "name": "<domain>",
  "persona": "<persona>",
  "lang": "<lang>",
  "wiki_root": "workspace/wikis/<slug>/",
  "created": "YYYY-MM-DD"
}
```

### Step 6: (Optional) Ingest first source

If the user provided a first source, dispatch `wiki-ingest` (single-source, full mode). Include `wiki-validate` as a pre-flight check.

```yaml
task_id: "validate-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/"
objective: "Validate wiki '<slug>' state before first ingest"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-validate.md"
return_fields:
  - status: valid | drift_detected | critical_error
```

If valid (or auto-fixable drift only), proceed to ingest. If critical error, halt and report.

```yaml
task_id: "ingest-<slug>-<source-slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Ingest source '<source-slug>' into wiki '<slug>' (FULL mode, persona=<persona>)"
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-ingest.md"
  - "workspace/wikis/<slug>/SCHEMA.md"
  - "workspace/wikis/<slug>/PERSONA.md"
  - "workspace/wikis/<slug>/wiki/index.md"
constraints:
  - "Follow wiki-ingest.md Phases 0-5 (Full mode)."
  - "Auto-trigger wiki-lint Phase A after completion."
return_fields:
  - status: success | partial | failed
  - files_created: <list>
  - files_modified: <list>
  - output_data:
      chunk_pages: <N>
      topic_pages: <N>
      concept_candidates: <N>
      auto_enriched: <N>
```

### Step 7: Report and offer next steps

After all dispatches complete, summarize for the user:

```markdown
Wiki `<slug>` is ready.

| Field | Value |
|-------|-------|
| Domain | <domain> |
| Persona | <persona> |
| Language | <lang> |
| Path | `workspace/wikis/<slug>/` |
| Sources ingested | <N> |

What's next?
- Add more sources: "add <file>" or "ingest these <N> files"
- Ask something: "what does the wiki say about <X>?"
- Explore: "explore <topic>" to discover insights through conversation
- Run maintenance: "check the wiki health"
```

## Done Criteria

- [ ] `POST /wikis` returned success
- [ ] `GET /wikis` includes the new wiki
- [ ] `workspace/wikis/<slug>/SCHEMA.md` exists with valid frontmatter
- [ ] `workspace/wikis/<slug>/PERSONA.md` exists with persona-specific defaults
- [ ] `workspace/wikis/<slug>/wiki/index.md` exists and references all created pages
- [ ] If first source was provided: ingest completed, lint Phase A ran, status reported

## Failure Handling

| Failure | Action |
|---------|--------|
| Orchestrator service unreachable | Continue with filesystem-only mode; warn once |
| Subagent returns `partial` | Continue — main agent completes remaining items |
| Subagent returns `failed` (first attempt) | Retry once with same objective |
| Subagent returns `failed` (second attempt) | Log to `wiki/log.md`, report to user, halt workflow |
| Wiki already exists with same slug | Switch to update flow or ask user for new slug |
