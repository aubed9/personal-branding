---
name: explore
parent: wiki-skill-v4.2.0
description: >
  Workflow for concept discovery — generating new insight pages through
  dialogue. Use when the user wants to explore, brainstorm, or discover
  cross-source patterns. Subagents gather evidence in parallel; the main
  agent runs the conversation itself (subagents cannot use the chat UI).
---

# Workflow: explore

**Goal:** Surface cross-source patterns through dialogue and convert them into validated concept pages.

**When to use:** User signals Explore intent — "explore X", "what's interesting?", "I want to think about Y", or after an ingest that produced ≥3 concept candidates.

## Steps

### Step 1: Confirm target wiki

`GET /wikis`. Pick the wiki whose domain matches the exploration topic. If multiple match, ask the user.

### Step 2: Pre-flight — gather exploration context

Dispatch one subagent to build the candidate landscape:

```yaml
task_id: "explore-context-<topic>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "For exploration topic '<topic>' in wiki '<slug>': list all relevant topic pages, concept candidates, and chunk citations. Include cross-source pattern strength (how many sources mention this?)."
output_format: "yaml"
context_files:
  - "workspace/wikis/<slug>/PERSONA.md"
  - "workspace/wikis/<slug>/wiki/index.md"
  - "workspace/wikis/<slug>/wiki/overview.md"
  - "workspace/wikis/<slug>/wiki/user-journey.md"
constraints:
  - "Read wiki/user-journey.md first to learn what worked in past sessions."
  - "Check for status: draft concepts first — prioritize those."
  - "Return top 3-5 topic clusters ranked by cross-source strength."
return_fields:
  - output_data:
      draft_concepts: <list>
      topic_clusters:
        - theme: <name>
          topics: <list>
          sources: <N>
          strength: convergence | contradiction | temporal
      recommended_starting_cluster: <index>
```

### Step 3: Propose clusters to user

Based on the subagent's output, present 3-5 clusters:

```markdown
## Concept Clusters Ready for Exploration

### Cluster 1: <Theme> (priority: high)
- Topics: [[topic-a]], [[topic-b]], [[topic-c]]
- Sources: <N> sources
- Why together: <1-sentence>
- Strength: <convergence / contradiction / temporal>

### Cluster 2: <Theme>
...

Or bring your own topic.
```

Use `AskUserQuestion`:
```
question: "Which cluster should we explore first?"
options:
  - label: "Cluster 1: <Theme>"
  - label: "Cluster 2: <Theme>"
  - label: "Bring my own topic"
```

### Step 4: Pull evidence for selected cluster

Dispatch parallel subagents (one per source) to gather verbatim evidence:

```yaml
task_id: "evidence-<topic>-<source>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/raw/<source>/**"
  - "workspace/wikis/<slug>/wiki/pages/chunk-<source>-*.md"
  - "workspace/wikis/<slug>/wiki/pages/topic-<source>-*.md"
objective: "For topic '<topic>' in source '<source>': extract verbatim quotes, key claims, and chunk citations. Return as structured list."
output_format: "yaml"
context_files:
  - "workspace/wikis/<slug>/wiki/pages/topic-<source>-*.md"
return_fields:
  - output_data:
      source: <slug>
      evidence:
        - chunk: <chunk-id>
          section: <path>
          quote: <verbatim text>
          claim: <1-sentence interpretation>
```

Number of subagents = number of contributing sources (typically 2-4). Run in parallel.

### Step 5: Conduct the conversation

This is your job. Read `wiki-query.md` "Concept Discovery Mode" (Phase CD-2) for the full procedure. Key rules:

1. **Respond in the user's language.** Always.
2. **Present source evidence first**, then ask probing questions.
3. **Surface tensions**: "Source A says X, Source B disagrees — what's your take?"
4. **Never lecture.** Ask, don't tell.
5. **Keep turns short.** 2-3 paragraphs max.
6. **Accumulate user contributions** — experiences, opinions, connections.

Continue the conversation until either:
- User explicitly states an insight ("AHA moment")
- User asks "what does this all mean?"
- Conversation has explored ≥3 source perspectives and surfaced a tension/pattern

If the conversation goes dry, prompt: "Want to dig into a specific chunk, or shift to another cluster?"

### Step 6: Draft the concept page

When the user has validated an insight (or asked for synthesis), dispatch:

```yaml
task_id: "draft-concept-<name>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/wiki/pages/"
objective: "Draft concept page <name> in wiki <slug>. Inputs: source evidence from <list of contributing sources>, user contribution summary from conversation."
output_format: "markdown"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-query.md#phase-cd-3-concept-synthesis"
  - "workspace/wikis/<slug>/SCHEMA.md"
  - "workspace/wikis/<slug>/PERSONA.md"
constraints:
  - "Follow concept page template exactly."
  - "Frontmatter: title, type: concept, synthesis_version: 1, validated: pending, sources: [list]."
  - "Include verbatim quotes from each contributing source."
  - "AI synthesis sections must use > [AI-SYNTHESIS]: blockquote format."
  - "DO NOT write the page yet — return draft for user validation."
return_fields:
  - status: success
  - files_created: <list of paths in draft state>
  - output_data:
      draft_path: "<wiki>/wiki/pages/concept-<name>.md"
      insight_summary: <one-sentence>
```

### Step 7: Present draft for AHA test

Show the draft to the user and ask:

```markdown
## Here's what emerged from our conversation:

<full draft of concept page>

---

Does this resonate? Reading it back, does it feel like a genuine insight?

[ ] Yes — captures a real insight
[ ] Partially — direction is right, something missing
[ ] No — doesn't feel like a discovery
```

Use `AskUserQuestion` or accept free-form feedback.

### Step 8: Handle validation result

**If YES:**
1. Write the concept page (the draft subagent left it ready)
2. Update frontmatter: `validated: true`
3. Update `wiki/index.md` — add to "Expanded Concepts"
4. Update `wiki/overview.md` — add insight to synthesis
5. Update `wiki/user-journey.md` — log successful session
6. Update related relations pages with new cross-source links

```yaml
task_id: "apply-concept-<name>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/wiki/"
objective: "Apply validated concept <name>: update index.md, overview.md, user-journey.md, and relevant relations-<slug>.md pages."
output_format: "yaml"
context_files:
  - "workspace/wikis/<slug>/wiki/index.md"
  - "workspace/wikis/<slug>/wiki/overview.md"
  - "workspace/wikis/<slug>/wiki/user-journey.md"
```

**If PARTIAL:**
Iterate. Re-dispatch the draft subagent with the user's feedback. Re-present. Repeat until yes or no.

**If NO:**
1. Do NOT create the page.
2. Log the failed attempt to `wiki/user-journey.md` with the user's reasoning — failures are learning memos.
3. Thank the user for the conversation.

```yaml
task_id: "log-failed-explore-<topic>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/wiki/user-journey.md"
objective: "Log failed concept exploration for topic '<topic>' with user feedback and lessons learned."
output_format: "yaml"
constraints:
  - "Use the Lessons Learned template from wiki-query.md Step CD-4.2."
```

### Step 9: Offer next steps

```markdown
Session complete.

Result: <concept created | exploration logged | deferred>
<synthesis_version>: <N> (if concept created)

What's next?
- Explore another cluster? (<N> remaining)
- Ask a question? "what does the wiki say about X?"
- Ingest more sources to strengthen <cluster>?
- Done for now
```

## Done Criteria

- [ ] User selected a cluster or topic
- [ ] Evidence gathered from contributing sources (parallel subagents)
- [ ] Conversation explored ≥3 source perspectives
- [ ] Concept drafted, presented, and validated by user
- [ ] On YES: page written, index/overview/user-journey/relations updated
- [ ] On NO: failure logged to user-journey.md
- [ ] Session summary provided to user

## Failure Handling

| Failure | Action |
|---------|--------|
| No wikis exist | Redirect to `build-wiki` workflow |
| No draft concepts or clusters | Surface this as a finding — wiki needs more sources |
| User abandons mid-conversation | Save partial state to user-journey.md, offer to resume |
| Concept validation loops >3 iterations | Ask user if the topic is right, or offer to log as failed |
| Draft subagent produces non-conforming output | Reject, retry with stricter constraints |
