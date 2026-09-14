---
name: wiki-update
parent: wiki-skill-v4.2.0
description: >
  Revise existing wiki pages when knowledge changes. Handles raw file changes,
  identifies affected pages, proposes structured changes, runs contradiction sweeps,
  and uses parallel subagent dispatch for multi-page updates. Respects append-only
  log and immutable raw/ conventions.
---

# Operation 6: wiki-update (Knowledge Revision)

## Goal
Revise wiki pages when sources change, new information arrives, or lint/audit
recommendations require action. Handle raw file changes, page updates, downstream
effects, and contradiction sweeps. Use subagents for parallel multi-page updates.

## Prerequisites
- `wiki-init` and at least one `wiki-ingest` completed
- `PERSONA.md` and `SCHEMA.md` readable
- `wiki/index.md` and `wiki/overview.md` current

## Trigger
Run when:
- Raw source file has been modified or updated
- User provides new information for a specific page
- `wiki-lint` or `wiki-audit` recommends changes
- Cross-source synthesis reveals contradictions needing resolution
- User explicitly requests a page update

---

## Phase 1: Identify What to Update (Main Agent)

### Step 1.1: Classify Update Type

Determine the trigger type:

| Trigger Type | Description | Example |
|-------------|-------------|---------|
| **Raw file change** | Source file in `raw/` was modified | Preprint updated to journal version |
| **New information** | User provides new facts for a page | "Add this dataset result to concept-X" |
| **Lint recommendation** | `wiki-lint` flagged an issue | Stale claim needs temporal marker |
| **Audit finding** | `wiki-audit` found unsupported claim | Fix "8 GPUs" to "8 TPU pods" |
| **Contradiction resolution** | Cross-source synthesis found conflict | Reconcile two conflicting claims |
| **Explicit user request** | User asks to update specific page | "Update concept-X with new paper" |

### Step 1.2: Build Affected Page List

Based on trigger type, identify all pages that may need updating:

**For raw file changes:**
1. Read `raw/<slug>/` — compare modification dates
2. If file changed: all pages citing this source are potentially affected
3. Search `wiki/pages/` for `sources: [<slug>]` in frontmatter
4. Search for `[[chunk-<slug>-*]]` citations across all pages
5. Build list: source map, topic pages, chunk pages, concept pages, relations pages, user-journey.md

**For new information / explicit request:**
1. Identify target page(s) from user input
2. Search for `[[target-slug]]` backlinks across all pages
3. Build list: target page + all pages that link to it

**For lint/audit recommendations:**
1. Read the lint/audit report
2. Extract all pages flagged for changes
3. Build list from report recommendations

**For contradiction resolution:**
1. Read the concept page with the contradiction
2. Identify all sources involved in the contradiction
3. Build list: concept page + related concept pages + relations pages

---

## Phase 2: Raw File Change Handling (If Applicable)

### Step 2.1: Detect Changes

If raw file changed:
1. Read old `raw/<slug>/chunks.json` (if backed up) or infer from existing chunk pages
2. Read new source file
3. Run Phase 0 chunking on new file
4. Generate new `chunks.json`

### Step 2.2: Identify Changed Anchors

Compare old vs. new `chunks.json`:

```yaml
anchor_changes:
  stable:
    - id: "s3.2-001"
      old_text: "..."
      new_text: "..."
      change_type: unchanged

  modified:
    - id: "s3.2-001"
      old_text: "The model uses 8 attention heads."
      new_text: "The model uses 16 attention heads."
      change_type: content_changed

  moved:
    - old_id: "s3.2-001"
      new_id: "s3.3-001"
      reason: "Section renumbered"

  deleted:
    - id: "s4.1-003"
      reason: "Section removed in new version"

  added:
    - id: "s5.2-001"
      text: "New section on..."
```

### Step 2.3: Flag Affected Citations

For each changed anchor, find all pages that cite it:

```yaml
affected_citations:
  - anchor: "s3.2-001"
    change: "content_changed"
    cited_by:
      - "wiki/pages/concept-attention.md"
      - "wiki/pages/topic-<slug>-§3.2.md"
      - "wiki/pages/query-2024-01.md"
    action: "Update claim or flag for review"

  - anchor: "s4.1-003"
    change: "deleted"
    cited_by:
      - "wiki/pages/concept-training.md"
    action: "Remove citation or find replacement anchor"
```

**Search strategy:**
- Search all `wiki/pages/*.md` for `[[chunk-<slug>-<id>]]` patterns
- Also search for `[[source-<slug>]] §X` if section numbers changed

### Step 2.4: Update Chunk Pages

For modified anchors:
1. Read existing chunk page
2. Update `## Chunk Text` with new verbatim text
3. Update `## Chunk Summary` if meaning changed significantly
4. Bump `updated` in frontmatter
5. Log: "Chunk updated due to raw file change"

For deleted anchors:
1. Do NOT delete chunk page (append-only convention)
2. Add banner: `> **Note**: This chunk was removed in the updated source. See [[source-<slug>-map]] for current version.`
3. Change `status: archived`
4. Update all citations to point to new anchor or flag as broken

For new anchors:
1. Create new chunk page (standard Phase 1 template)
2. Add to `source-<slug>-map.md` under current structure
3. Run salience scoring — may trigger Phase 2 expansion

### Step 2.5: Regenerate Source Map

Update `wiki/pages/source-<slug>-map.md`:
- Update structural index with new/deleted sections
- Update chunk links
- Add "Version History" section noting what changed
- Bump `updated`

---

## Phase 3: Page Update Proposals (Subagent Dispatch)

For each affected page, the main agent dispatches subagents to propose changes.

### Subagent A: Concept Page Updates

**Input**: Affected concept page + list of changes + new evidence

**Task**:

**Important**: Concept pages are conversation-driven — their insights were validated by the user through wiki-query dialogue. When updating concept pages due to source changes:
- PRESERVE the "## The Insight", "## Why This Matters", and "## User Experience & Contribution" sections unchanged
- Only update "## Source Evidence" sections with corrected citations/quotes
- If a source change fundamentally invalidates the concept's insight, FLAG for user review — do not auto-modify the insight

1. Read current concept page
2. For each change:
   - Propose: `Current / Proposed / Reason / Source`
   - Always include Source (which source prompted the change)
3. Check if change introduces contradiction with existing evidence
4. If contradiction: flag for Phase 4 (Contradiction Sweep)
5. Return structured proposal

**Subagent output format**:
```yaml
page: "concept-<name>.md"
changes:
  - type: update
    section: "Source Evidence"
    current: "The model uses 8 attention heads."
    proposed: "The model uses 16 attention heads (updated version)."
    reason: "Source file was updated; new version specifies 16 heads"
    source: "[[chunk-<slug>-s3.2-001]] (updated 2026-05-30)"
    contradiction: false

  - type: add
    section: "Cross-Source Synthesis"
    current: ""
    proposed: "### Update: Attention Heads (2026-05-30)
> [AI-SYNTHESIS]: The updated source now specifies 16 heads, contradicting the earlier claim of 8."
    reason: "New evidence changes the synthesis"
    source: "[[chunk-<slug>-s3.2-001]]"
    contradiction: true

  - type: flag
    section: "Source Evidence"
    current: "Training used 8 GPUs."
    proposed: "[NEEDS VERIFICATION] Training used 8 GPUs."
    reason: "Audit found this claim says '8 TPU pods' in source, not '8 GPUs'"
    source: "[[audit-concept-<name>-2026-05-30]]"
    contradiction: false
```

**Type field rule**: When updating any page, the `type` frontmatter field MUST be preserved unchanged. If a page is missing the `type` field (legacy page), add it based on the page kind (see Type Property table in SKILL.md).

### Subagent B: Topic Page Updates

**Input**: Affected topic pages + source changes

**Task**:
1. Read current topic page
2. Update `Key Claims` section if source claims changed
3. Update `Relationship Map` if structural changes affect intra-source links
4. Update metadata if `metadata.json` changed
5. Return structured proposal

### Subagent C: Relations Page Updates

**Input**: Affected relations pages + new cross-source findings

**Task**:
1. Read current relations page
2. Update cross-source relationship table if new evidence changes relationships
3. Update conflict table if contradictions were resolved or new ones emerged
4. Return structured proposal

### Subagent D: Index & Overview Updates

**Input**: `wiki/index.md` + `wiki/overview.md` + all changes

**Task**:
1. Read index and overview
2. Update source lists if new source added or old one archived
3. Update concept lists if new concepts created or old ones expanded
4. Update open questions if changes answer or raise new ones
5. Update persona-specific tracked tables
6. Return structured proposal

### Subagent E: User Journey Updates

**Input**: `wiki/user-journey.md` + list of all source changes + affected concept pages

**Task**:
1. Read `wiki/user-journey.md`
2. For each concept discovery session that references an affected source:
   - Add a note: "Source [[<slug>]] was updated on YYYY-MM-DD. Evidence cited in this session may have changed."
3. Do NOT modify the session's conclusions or lessons — they are historical records
4. Return list of affected sessions for user awareness

**Output format**:
```yaml
affected_sessions:
  - date: "YYYY-MM-DD"
    concept: "concept-<name>"
    source_changed: "<slug>"
    impact: "Citation in Source Evidence section may need updating"
```

---

## Phase 4: Contradiction Sweep (If Triggered)

If any subagent flagged `contradiction: true`, run a full contradiction sweep.

### Step 4.1: Identify Contradicted Claims

Search ALL `wiki/pages/*.md` for:
- Claims that match the contradicted claim (even if phrased differently)
- Pages that cite the same source but may have different interpretations
- Pages that build on the contradicted claim (downstream effects)

### Step 4.2: Build Contradiction Map

```yaml
contradiction_map:
  claim: "The model uses 8 attention heads."
  updated_claim: "The model uses 16 attention heads."
  affected_pages:
    - page: "concept-attention.md"
      section: "Source Evidence"
      current_text: "The model uses 8 attention heads."
      action: "Update to 16, note version change"

    - page: "concept-transformer.md"
      section: "Architecture Overview"
      current_text: "With 8 attention heads, the model achieves..."
      action: "Update to 16, recalculate implications"

    - page: "topic-<slug>-§3.2.md"
      section: "Key Claims"
      current_text: "8 attention heads"
      action: "Update to 16"

    - page: "query-2024-01.md"
      section: "Answer"
      current_text: "The model uses 8 attention heads."
      action: "Flag as outdated, add temporal marker"
```

### Step 4.3: Propose Resolution Strategy

For each contradiction, propose one of:

| Resolution Strategy | When to Use |
|--------------------|-------------|
| **Update in-place** | New evidence supersedes old; old was wrong |
| **Append with temporal marker** | Both versions are valid at different times |
| **Add synthesis note** | Both versions coexist; explain the evolution |
| **Archive old claim** | Old claim is definitively wrong |
| **Flag for user decision** | Ambiguous which version is correct |

**Example resolution:**
```markdown
## Resolution: Attention Heads Claim

**Strategy**: Append with temporal marker

**Rationale**: The original paper (2017) specified 8 heads. The updated version (2026)
specifies 16. Both are accurate for their respective versions. The claim should reflect
temporal scope, not be overwritten.

**Proposed change**:
```diff
- The model uses 8 attention heads.[^1]
+ The original model (2017) used 8 attention heads.[^1]
+ The updated version (2026) uses 16 attention heads.[^2]
> [AI-SYNTHESIS]: The architecture was revised to double attention capacity in the 2026 update.
```
```

### Step 4.4: User Confirmation for Contradictions

Present contradiction map to user:
```markdown
## Contradiction Detected

**Claim**: "The model uses 8 attention heads."
**New evidence**: "The model uses 16 attention heads."
**Affected pages**: <N>

**Resolution options**:
[ ] Update all pages to new claim (old claim was wrong)
[ ] Add temporal markers (both versions valid at different times)
[ ] Add synthesis note explaining the change
[ ] Flag for manual review on each page
[ ] Skip — I'll handle this myself
```

---

## Phase 5: Apply Updates (After Confirmation)

### Step 5.1: Apply Confirmed Changes

For each approved change:
1. Read current page
2. Apply change with `Current / Proposed / Reason / Source` documented
3. Bump `updated` in frontmatter
4. If concept page: bump `synthesis_version` if cross-source synthesis changed
5. Log each change

### Step 5.2: Update Downstream Pages

For pages that link to updated pages but were not directly affected:
1. Search for `[[updated-slug]]` across all pages
2. Check if the update affects their claims
3. If yes: flag for review or auto-update if change is minor (e.g., link text)

### Step 5.3: Update Index & Overview

Apply Subagent D's proposals for index and overview updates.

---

## Phase 6: Log & Report

### Step 6.1: Append to log.md

```markdown
## [YYYY-MM-DD] update | <Trigger Description>
- Trigger type: <raw-change | new-info | lint | audit | contradiction | user-request>
- Source affected: <slug> (if applicable)
- Pages updated: <N>
- Pages flagged for review: <N>
- Chunk map regenerated: <yes | no>
- Anchors changed: <N> (stable: <N>, modified: <N>, moved: <N>, deleted: <N>, added: <N>)
- Contradictions found: <N>
- Contradictions resolved: <N>
- Synthesis versions bumped: <N>
- Log entries: <list of specific changes>
```

### Step 6.2: Report to User

```markdown
Update complete.

| Category | Count |
|----------|-------|
| Pages updated | <N> |
| Pages flagged for review | <N> |
| Chunk pages updated | <N> |
| Chunk pages archived | <N> |
| New chunk pages created | <N> |
| Contradictions found | <N> |
| Contradictions resolved | <N> |

**Trigger**: <description>
**Source**: <slug> (if applicable)

**Key changes**:
1. <change 1>
2. <change 2>

**Pages needing review**: <list>

Full log: [[log]]
```

---

## Subagent Dispatch Strategy

### Update Subagent Allocation

| Task | Subagent | Input | Parallelizable |
|------|----------|-------|----------------|
| Concept page updates | A | Affected concept pages + changes | Yes (one per concept) |
| Topic page updates | B | Affected topic pages + source changes | Yes (one per topic) |
| Relations page updates | C | Affected relations pages | Yes (one per relations) |
| Index & overview updates | D | Index + overview + all changes | No (single point of truth) |
| User journey updates | E | user-journey.md + affected sources | Yes (independent) |
| Contradiction sweep | F | All pages + contradicted claim | Yes (by page type) |

### Main Agent Coordination

```
Main Agent:
  1. Classifies trigger type
  2. Builds affected page list
  3. If raw file changed:
     a. Detects anchor changes
     b. Updates chunk pages directly
     c. Regenerates source map
  4. Dispatches subagents A, B, C in parallel for page proposals
     - Subagent E: User journey updates
  5. Receives proposals
  6. If contradictions flagged:
     a. Runs contradiction sweep (Subagent F)
     b. Presents resolution options to user
  7. Presents all changes to user for confirmation
  8. Dispatches subagent D for index/overview updates, subagent E for user journey
  9. Applies confirmed changes
  10. Updates downstream pages
  11. Logs and reports
```

---

## Common Mistakes to Avoid (Update)

- **Modifying raw/ files** — `raw/` is immutable. Generate new chunks.json, don't edit source files.
- **Deleting chunk pages** — append-only convention; archive with banner instead
- **Not documenting the source of change** — every change must include `Reason / Source`
- **Overwriting without temporal markers** — if both old and new are valid, preserve both
- **Ignoring downstream effects** — pages that link to updated pages may need review
- **Not bumping synthesis_version** — if cross-source synthesis changed, increment the version
- **Auto-applying changes without confirmation** — except for trivial link updates, always confirm
- **Not running contradiction sweep** — if one claim changes, search the whole wiki for impacts
- **Forgetting to update index.md** — structural changes must be reflected in the master index
- **Not logging chunk map regeneration** — log must note if chunks.json was rebuilt
- **Skipping overview.md update** — if synthesis shifted, overview must reflect it
- **Not flagging query pages as outdated** — saved queries may contain old claims; add temporal markers
- **Ignoring persona-specific tables** — researcher contribution tables, creator story banks, reporter verification queues must all be updated
- **Overwriting concept page insights** — concept insights are user-validated; only update source evidence citations, never the insight itself
- **Not flagging concept invalidation** — if source changes fundamentally contradict a concept's insight, flag for user review
- **Ignoring user-journey.md** — past concept discovery sessions may reference changed sources; add update notes
- Not preserving the `type` frontmatter field during updates — the `type` field must remain unchanged; if missing (legacy page), add the correct type value
- Not verifying index connectivity after updates — if a page is renamed or a new page is created during update, ensure it remains reachable from `wiki/index.md` within 2 hops
- Using deprecated placeholder comment formats (use `<!-- PENDING: ... -->` or `<!-- NO-DATA: ... -->` only)
- Not checking for `[IN-PROGRESS]` markers before starting update operation
