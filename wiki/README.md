# Canonical Wiki and provenance

The root `wiki/` tree is the only authored decision-knowledge plane.

## Authorities

- `registry.yaml` owns Knowledge Node identity, lifecycle and graph relationships.
- `source-registry.json` owns Source Record identity, authority, freshness and lifecycle.
- `claims.json` owns decision-driving Knowledge Claims and claim-level provenance.
- `generated/retrieval-index.json` is derived retrieval data. It is not hand-authored knowledge.

Legacy `knowledge_base/wiki/` and `knowledge_base/rag_chunks.json` are migration inputs only. Compatibility adapters under `knowledge_base/` read the canonical root Wiki/index.

For migrated articles that still contain old frontmatter such as `status: CANONICAL`, the frontmatter status is **not authoritative**. If a node has no explicit lifecycle in `registry.yaml`, `default_status: NEEDS_RESEARCH` applies. This prevents generic legacy provenance from being treated as trusted decision support.

## Admission

A decision-driving claim enters generated retrieval only when:
1. the Knowledge Claim is VERIFIED or CANONICAL;
2. every referenced Source Record exists;
3. every referenced Source Record is VERIFIED or CANONICAL;
4. required locators are present;
5. freshness/authority constraints are satisfied.

AI synthesis is never a source.

## Counts

Source counts are always computed from `source-registry.json`. Knowledge Node count is a separate metric and must never be reported as source count.
