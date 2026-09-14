---
name: wiki-orchestrator
parent: wiki-skill-v4.2.0
description: >
  Reference for the wiki-orchestrator service: endpoints, request/response schemas,
  subagent dispatch templates, and fallback rules. Loaded by the main orchestrator agent.
---

# Wiki Orchestrator Reference

## Service

- Base URL: `http://localhost:3032`
- Env: `ORCHESTRATOR_PORT`

## Endpoints

### `GET /health`
Response: `{ ok: true }` or 503 if MongoDB unreachable.

### `GET /workspace/discover`
Scans `./workspace/wikis/` and upserts wiki records.
Response: `{ wikis: Wiki[] }`

### `GET /wikis`
Response: `{ wikis: Wiki[] }`

### `POST /wikis`
Body: `Wiki` object. Upserts by `_id`.

### `GET /chats?userId=me&limit=20`
Response: `{ chats: Chat[] }`

### `POST /chats`
Body: `Chat` object. Requires `messageCount >= 4`.

### `GET /profiles/:userId`
Response: `{ profile: Profile }`

### `POST /profiles/:userId`
Body: `Profile` object. Upserts by `userId`.

### `POST /operations`
Body: `Operation` object. Inserts a new operation log entry.

## Operations Requiring User Interaction

Some wiki operations need to ask the user questions. Subagents cannot use the chat UI's `ask_user_question` tool, so the **main agent must conduct the interview** and then dispatch a subagent with the answers.

### `wiki-init` — Purpose Discovery Interview

1. Read `wiki-init.md`.
2. Use `ask_user_question` to ask the user:
   - Purpose / what the wiki is for
   - Target audience
   - Preferred persona (researcher, creator, reporter, learner, strategist)
   - Language (english or farsi)
   - Any sources or themes to prioritize
3. Pick a wiki name (slug) and target path `workspace/wikis/<slug>/`.
4. Dispatch the subagent with the interview answers included in the objective:

```yaml
task_id: "wiki-init-<slug>-<timestamp>"
scope:
  - "workspace/wikis/<slug>/**"
objective: "Initialize wiki '<slug>' at workspace/wikis/<slug>/ with persona=<persona>, lang=<lang>, purpose=<purpose>, audience=<audience>. DO NOT ask the user questions; all required answers are provided here."
output_format: "yaml"
context_files:
  - ".claude/skills/wiki-skill-v4.2.0/wiki-init.md"
constraints:
  - "Follow wiki-init.md but skip the interview — answers are in the objective."
  - "Create SCHEMA.md, PERSONA.md, and the full initial directory structure."
  - "Return files_created, files_modified, and status."
```

5. After the subagent succeeds, call `POST /wikis` to register the new wiki.

## Subagent Dispatch Template (Headless Operations)

For operations that do not need user input (e.g. `wiki-ingest`, `wiki-query`, `wiki-lint`):

```yaml
task_id: "wiki-<operation>-<wiki>-<timestamp>"
scope:
  - "workspace/wikis/<wiki>/SCHEMA.md"
  - "workspace/wikis/<wiki>/PERSONA.md"
  - "workspace/wikis/<wiki>/wiki/**"
objective: "Run wiki-<operation> on wiki '<wiki>' for: <user request>"
output_format: "yaml"
context_files:
  - "workspace/wikis/<wiki>/SCHEMA.md"
  - "workspace/wikis/<wiki>/PERSONA.md"
  - "workspace/wikis/<wiki>/wiki/index.md"
constraints:
  - "Follow the corresponding wiki-<operation>.md operation file exactly."
  - "Do not create stubs."
  - "Return files_created, files_modified, and status."
```

## Fallback Rules

1. If `GET /workspace/discover` fails, read `./workspace/wikis/*/SCHEMA.md` directly.
2. If `POST /chats` fails, log a warning and continue; do not block the user.
3. If the profile-update subagent fails, log the error; the previous profile remains valid.
