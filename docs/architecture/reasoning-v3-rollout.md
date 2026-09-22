# Reasoning v3 Rollout, Cutover, Rollback & Legacy Retirement

Status: implementation contract for #22  
Depends on: #15–#21

## 1. Rollout modes

The application has three explicit per-project modes:

- `LEGACY` — legacy v2 persistence is authoritative.
- `SHADOW` — legacy state remains the user-visible compatibility authority while canonical v3 is written in parallel temporarily for migration/shadow validation.
- `V3` — canonical v3 state is authoritative and new saves no longer write the legacy project key.

The rollout record stores:
- rollout mode;
- `stateSchemaVersion`;
- `reasoningEngineVersion`;
- project kind;
- migration report;
- shadow acceptance evidence;
- promotion/rollback timestamps.

## 2. New projects

New projects default to `V3`.

On the first save:
- only the canonical v3 key is written;
- no legacy project key is created;
- the state records explicit schema/engine versions;
- the canonical graph and canonical output Claim Ledger are persisted.

The constructor policy can disable v3 for new projects if an emergency rollout stop is required.

## 3. Existing projects

Existing legacy projects never cut over immediately.

Startup sequence:
1. restore the legacy project;
2. enter `SHADOW` by default;
3. create an exact pre-v3 backup if one does not exist;
4. run deterministic one-way migration into a separate canonical v3 key;
5. keep the original legacy key available;
6. collect shadow acceptance evidence.

`SHADOW` is the only allowed temporary dual-write period.

## 4. Promotion gate

An existing project may be promoted to `V3` only when all of these are true:

- existing legacy state is present;
- v3 migration completed;
- migration report has zero `droppedPaths`;
- exact pre-v3 backup exists;
- shadow evidence has at least one scenario and zero `REGRESSION` verdicts;
- canonical state validates;
- canonical save succeeds.

Promotion records:
- `stateSchemaVersion = 3`;
- current `reasoningEngineVersion`;
- shadow acceptance version/results;
- promotion timestamp.

After promotion, all new autosaves are canonical-only. Legacy bytes are intentionally frozen.

## 5. Runtime compatibility

The React/Vite UI and current `OrchestratorEngine` remain the public runtime surface during the strangler transition.

Canonical v3 can be projected into a runtime compatibility view for:
- current phase;
- current question index;
- answer records;
- phase data;
- completed phase compatibility flags;
- review state;
- facts/decisions/assumptions/unknowns/contradictions;
- business context.

This projection is **not** a reverse migration and does not make the compatibility view authoritative.

On canonical save, the system also captures the active v3 reasoning graph and the current canonical Master Claim Ledger so v3 storage is more than a copy of legacy state.

## 6. Rollback

Rollback is intentionally snapshot-based.

For migrated existing projects:
1. load `dm_project_state_pre_v3_backup`;
2. validate the original envelope;
3. restore that envelope byte-for-byte to the legacy key;
4. clear the active canonical v3 key;
5. restore the runtime from the legacy snapshot;
6. set rollout mode to `LEGACY`.

The system never silently reverse-transforms canonical writes back into v2.

A project without a pre-v3 snapshot cannot use migration rollback.

## 7. Import/export

In `V3` mode, project export includes:
- `stateSchemaVersion`;
- `reasoningEngineVersion`;
- canonical state.

A canonical v3 import remains canonical.

A legacy import is restored as legacy and enters `SHADOW` when the existing-project shadow policy is enabled.

## 8. Reset

Full project reset clears:
- legacy project state;
- canonical v3 project state;
- pre-v3 backup;
- rollout-mode record.

Secrets/API keys remain outside project persistence.

## 9. Retired and transitional paths

### Retired as authoritative paths

The following must no longer be authoritative after this rollout:
- direct App-level calls to legacy save/load;
- broad downstream phase invalidation as normal edit behavior;
- whole-phase completion flags as independent truth;
- fixed/generic handoff values;
- manually authored RAG chunks as decision knowledge;
- Knowledge Node count as source count.

### Transitional compatibility only

The following remain temporarily:
- legacy `STORAGE_KEY` for LEGACY/SHADOW projects and rollback snapshots;
- `invalidateDependentPhases()` only as migration/testing fallback;
- compatibility projection from canonical state into current Orchestrator fields;
- legacy import support.

These may be removed only after production rollout evidence shows no remaining supported project depends on them.

## 10. Operational safety rules

- Never promote an existing project without migration + shadow evidence.
- Never delete the pre-v3 backup during normal promotion.
- Never dual-write permanently; dual-write exists only in SHADOW.
- Never infer successful migration from a 753-taxonomy score.
- Never use a rollback that converts new-model writes backward implicitly.
- Keep #21 hard-invariant acceptance green before changing rollout defaults.

## 11. Rollout acceptance

#22 is complete only when automated tests prove:

- brand-new projects can run canonical-only;
- existing projects enter SHADOW first;
- promotion without shadow evidence is rejected;
- a shadow regression blocks promotion;
- migration data loss blocks promotion;
- a pre-v3 backup is mandatory;
- V3 saves freeze legacy bytes after cutover;
- a fresh runtime restores from canonical v3;
- rollback restores the exact legacy envelope;
- schema/engine versions are recorded;
- import/export respect project mode;
- reset clears every persistence/rollout key;
- full #21 acceptance and all existing CI layers remain green.
