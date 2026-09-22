# Reasoning v3 schemas

These schemas are the side-by-side foundation for the reasoning-v3 migration.

They intentionally do **not** replace the current v2 schemas yet. Workstream #16 owns persisted-state migration and compatibility.

Canonical contracts in this directory:
- `business-context.schema.json`: the approved 15-axis camelCase context model. `primaryArchetype` is derived metadata, not an axis.
- `project-state.schema.json`: canonical ledgers/session/migration envelope for state schema v3.
- `reasoning-graph.schema.json`: typed graph nodes, edges, revision metadata, and adjacency indexes.
- `claim.schema.json`: canonical output claim shape.
- `proposal.schema.json`: proposal lifecycle specialization of a canonical claim.
- `section.schema.json`: conditional output-section contract.

Runtime vocabulary lives in `platform/src/reasoning/` and the foundation test asserts enum parity to prevent schema/runtime drift.

Migration note: `UNKNOWN` is a valid value for every context axis so legacy or incomplete projects can be migrated without inventing a classification. It is a value, never a sixteenth axis.
