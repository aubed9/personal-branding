# Wayfinder Research — Issue #8: Wiki Completeness, Source Fidelity & Registry Audit

## Executive finding

The current root `wiki/` is structurally tidy but **not yet an auditable knowledge base**.

What is good:
- `wiki/registry.yaml` contains 49 nodes.
- There are exactly 49 corresponding article files.
- No registry node points to a missing article.
- No article is unregistered.
- No exact duplicate file exists inside the 49-article root wiki.
- Every sampled/checked article follows the intended multi-section format.

What is not trustworthy enough:
- all 49 articles are marked `CANONICAL`;
- all 49 use the same non-specific source string: `DIGITAL MARKET Knowledge Engine & Academic Foundations`;
- there is no article-level source identity, edition/date/page/URL, claim-level citation, or freshness metadata;
- several articles link to KB IDs that do not exist;
- a second, older knowledge system under `knowledge_base/` coexists with the root wiki and is not unified with it;
- the “165 sources” claim is a category arithmetic claim, not a verifiable source registry.

Therefore “49 valid wiki nodes” currently means **schema/file integrity**, not source fidelity or decision-grade trust.

---

## 1. Root wiki inventory

Audited:
- `wiki/registry.yaml`
- 49 registered KB IDs
- 49 file references
- 49 actual markdown article files
- root `wiki/README.md` and `wiki/INDEX.md`

### Registry parity

- Registered nodes: **49**
- Registry file refs: **49**
- Unique registry file refs: **49**
- Actual article files: **49**
- Missing registry targets: **0**
- Unregistered article files: **0**
- Exact duplicate article SHAs inside root wiki: **0**

This part is healthy.

---

## 2. “14-section article” claim is structurally true but quality is shallow

`wiki/README.md` says each article follows a standard 14-section structure.

The audited articles do contain the expected heading structure, and no empty article was found. However, many nodes are short summary cards rather than extracted source knowledge.

Repository file-size distribution:
- minimum: about **2.4 KB**
- maximum: about **5.6 KB**
- average: about **3.15 KB**
- 28 of 49 articles are below **2.8 KB**

A short article is not automatically bad. The problem is that the canonical status is not backed by traceable sources, so a terse summary can silently become a “truth” node.

Examples of compact canonical nodes include:
- `wiki/05-verbal-identity/voice.md`
- `wiki/03-strategy/target-market.md`
- `wiki/04-brand-identity/personality.md`
- `wiki/02-market-research/market-research.md`
- `wiki/06-naming/tagline.md`

They contain useful definitions/questions/examples, but are closer to operational summaries than source-complete knowledge extraction.

---

## 3. Source fidelity failure: every root article uses the same generic source

Across all 49 root wiki articles:

- status `CANONICAL`: **49 / 49**
- source value `DIGITAL MARKET Knowledge Engine & Academic Foundations`: **49 / 49**
- articles with a source-specific frontmatter citation: **0 / 49**

This means the system cannot answer:
- Which exact source supports a claim?
- Which edition/version?
- Which page/section?
- Is it a primary source, textbook, book summary, internal synthesis, law, regulator page, or platform report?
- When was the external source last verified?
- Which source should win when two claims conflict?

### Example

`wiki/01-business-foundation/unit-economics.md` contains concrete thresholds and Iranian regulatory statements, including LTV/CAC thresholds, capacity-utilization ranges, margin guidance, and references to tax/legal requirements.

But its only frontmatter source is the generic umbrella string. A consumer cannot trace those claims to an authoritative source.

This is a provenance problem even if some claims happen to be correct.

---

## 4. Broken knowledge-graph references

The registry itself has file parity, but article bodies refer to KB IDs absent from the registry.

Observed missing referenced IDs:

- `KB-MSG-CTA-001`
- `KB-NAM-TM-001`
- `KB-KPI-SERV-001`
- `KB-PLAY-GROWTH-001`
- `KB-KPI-RETAIL-001`
- `KB-KPI-B2B-001`
- `KB-KPI-ECOM-001`
- `KB-PLAY-LAUNCH-001`
- `KB-PB-ALIGN-001`

Affected examples include:
- `01-business-foundation/channels.md`
- `05-verbal-identity/messaging.md`
- `06-naming/naming-evaluation.md`
- several `07-business-types/*` nodes
- `08-personal-brand/founder-brand.md`

The current validator checks whether registry nodes point to existing files, but does not fully validate every KB reference embedded in article content.

---

## 5. The “165 sources” claim is not backed by a 165-record source registry

`skills/llm-wiki/SKILL.md` claims:

- 30 academic foundations
- 50 Iranian macro/market works
- 45 regulatory/tax/legal works
- 40 playbooks/blueprints

Total: **165**.

However, there is no canonical 165-entry source registry connected to `wiki/registry.yaml`.

The current `scripts/validate_system.py` “Source Count” audit sets:

`actual_source_count = node_count`

where `node_count` is the count of wiki knowledge nodes (49).

That is a category error:
- a **knowledge node** is not a **source**;
- one node may depend on many sources;
- one source may support many nodes.

The validator correctly emits a warning for 49 vs 165, but it does not actually count sources.

### Required correction

Introduce a separate source registry, e.g.:
- `sources/source-registry.yaml`

with one stable record per source:
- source ID
- type/authority tier
- title
- author/institution
- edition/version
- publication/effective date
- URL/identifier
- jurisdiction
- retrieved/verified date
- supersession/expiry state
- supported KB claims/nodes.

Only then can a “source count” be audited.

---

## 6. Two parallel knowledge systems currently coexist

There is a second knowledge system under `knowledge_base/`:

- `knowledge_base/wiki/`: 12 markdown files
- `knowledge_base/blueprints/`: 13 files
- `knowledge_base/rag_chunks.json`: 74 chunks
- `knowledge_base/wiki_engine.py`
- `knowledge_base/rag_engine.py`

This is separate from the root `wiki/` + `wiki/registry.yaml`.

### Retrieval split

`knowledge_base/wiki_engine.py` loads:

`knowledge_base/wiki/*.md`

It does **not** load the root `wiki/` registry-driven articles.

`knowledge_base/rag_engine.py` searches `rag_chunks.json`, not root wiki nodes.

So “the wiki” is not a single source of truth at runtime/repository level.

### RAG provenance gap

`rag_chunks.json` contains **74 chunks** with fields:
- id
- phase
- title
- tags
- content

Chunks with source/citation metadata: **0**.

Its phases are:
- master
- phase1 through phase6

There is no explicit phase7/phase8 coverage in the chunk metadata.

---

## 7. Exact duplication exists in the legacy knowledge tree

Five large documents are duplicated byte-for-byte between `knowledge_base/wiki/` and `knowledge_base/blueprints/`:

1. business decision chain document
2. 30 canonical foundations
3. GraphRAG ontology document
4. conflict/evidence hierarchy document
5. Iran market/economic sources document

This creates two physical copies of the same primary material and makes future edits prone to drift.

---

## 8. The old foundation material is richer than the root wiki, but not integrated

`knowledge_base/wiki/09_the_30_canonical_foundations.md` contains substantially richer source-oriented summaries of 30 named works.

`knowledge_base/wiki/12_iran_market_and_economic_sources.md` identifies Iranian institutions and platform reports.

Blueprint files also use source-like IDs such as:
- `source-src001-qavanin-ir`
- `source-src003-rrk-ir`
- `source-src091-how-brands-grow-byron-sharp`

But those identifiers are not surfaced as a canonical source registry consumed by the current root wiki.

So useful source work exists, but the current 49-node wiki has flattened it into the generic source string.

---

## 9. “CANONICAL” is currently too permissive

All 49 nodes are marked `CANONICAL`, despite:
- generic provenance;
- broken KB references;
- statements with freshness/legal sensitivity;
- some nodes being short operational summaries.

Recommended trust lifecycle:

- `DRAFT`: useful synthesis, incomplete provenance
- `NEEDS_RESEARCH`: claims require source verification
- `VERIFIED`: sources resolved and claim-level support checked
- `CANONICAL`: verified + accepted as system decision knowledge
- `STALE`: source freshness window expired or superseded
- `DEPRECATED`: replaced

Legal/regulatory and market-data nodes need stricter temporal rules than evergreen branding frameworks.

---

## 10. Replacement coverage model

Do not optimize for “number of articles” or “number of sources”.

Track four different dimensions:

### A. Source coverage
Percentage of decision-critical claims linked to a real source record.

### B. Claim coverage
Percentage of product decision rules that have explicit evidence support.

### C. Context coverage
Which business/revenue/channel/regulatory contexts have decision-useful knowledge modules.

### D. Freshness coverage
Percentage of time-sensitive claims still inside their verification window.

Suggested metrics:

- **Source Traceability Rate**: claim-bearing nodes with specific source IDs / claim-bearing nodes
- **Broken Knowledge Edge Rate**: unresolved KB links / all KB links
- **Canonical Provenance Rate**: canonical nodes with verified source records / canonical nodes
- **Temporal Validity Rate**: non-expired time-sensitive claims / time-sensitive claims
- **Decision Utility Coverage**: required decision modules with questions + evidence requirements + rules + metrics + failure modes
- **Retrieval Consistency**: percentage of active retrieval paths reading the same canonical knowledge plane

---

## Resolution

The root wiki is **complete as a 49-file registry**, but **incomplete as an auditable, decision-grade knowledge system**.

The rebuild should not start by adding more articles. It should first:

1. choose one canonical knowledge plane and retire/migrate the parallel `knowledge_base/wiki` / RAG copies;
2. create a real source registry separate from KB nodes;
3. attach source IDs and claim-level provenance to root wiki content;
4. repair the nine unresolved KB IDs or remove those edges;
5. reclassify current `CANONICAL` nodes until provenance is verified;
6. add temporal/freshness metadata for Iranian legal, regulatory and market claims;
7. rebuild retrieval so questions/actions can query verified decision modules rather than generic article summaries;
8. replace “165 sources / 49 nodes” headline counts with source traceability, claim coverage, context coverage and freshness metrics.

This resolution should feed #9 (specialization contract), #11 (output/evidence contract), and the later architecture decision.
