# Reasoning v3 schemas

These schemas are the side-by-side foundation for the reasoning-v3 migration.

They intentionally do **not** replace the current v2 schemas yet. Workstream #16 owns persisted-state migration and compatibility.

Canonical contracts in this directory:
- `business-context.schema.json`: the approved 15-axis camelCase context model. `primaryArchetype` is derived metadata, not an axis.
- `reasoning-graph.schema.json`: typed graph nodes, edges, revision metadata, and adjacency indexes.
- `claim.schema.json`: canonical output claim shape.
- `proposal.schema.json`: proposal lifecycle specialization of a canonical claim.
- `section.schema.json`: conditional output-section contract.

Runtime vocabulary lives in `platform/src/reasoning/` and the foundation test asserts enum parity to prevent schema/runtime drift.
