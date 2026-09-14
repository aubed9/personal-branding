---
name: wiki-validate
parent: wiki-skill-v4.2.0
description: >
  Verify the structural integrity and state consistency of the entire wiki system.
  Detect drift between PERSONA.md, SCHEMA.md, the file system, index connectivity,
  keyword index, and operation logs. Auto-fix trivial issues; flag non-trivial
  problems for user confirmation.
---

# Operation: wiki-validate (State Consistency Validation)

## Goal

Verify the structural integrity and state consistency of the entire wiki system. Detect drift between PERSONA.md, SCHEMA.md, the file system, index connectivity, keyword index, and operation logs. Auto-fix trivial issues; flag non-trivial problems for user confirmation.

**Trigger:** Automatically before every `wiki-ingest` and `wiki-query` (as a pre-flight check). Also callable manually via `wiki-validate`.

## Prerequisites

- Wiki has been initialized via `wiki-init` (PERSONA.md and SCHEMA.md exist)
- No other write operations are currently in progress

---

## Phase 1: Schema & Persona Integrity

### Step 1.1: Validate PERSONA.md
1. Read `PERSONA.md` and verify it is valid YAML
2. Check required fields exist and have valid types:
   - `persona`: one of `researcher | creator | reporter | learner | strategist`
   - `ingest_counter`: non-negative integer
   - `lint_phase_b_trigger`: positive integer (default 3)
   - `salience_threshold`: integer 1–5
   - `novelty_threshold`: integer 1–5
   - `gate_policy`: one of `conservative | auto | exhaustive | conflict-priority`
   - `max_chunk_pages_per_source`: positive integer
   - `concept_creation`: must be `conversation-only`
3. If any field is missing or invalid type: flag as `drift_detected`
4. If PERSONA.md cannot be parsed: flag as `critical_error`

### Step 1.2: Validate SCHEMA.md
1. Read `SCHEMA.md` and verify it contains:
   - `lang`: valid language code (e.g., `en`, `fa`)
   - `persona`: matches PERSONA.md persona value
   - `wiki_root`: valid directory path that exists
2. If `persona` in SCHEMA.md != `persona` in PERSONA.md: flag as `drift_detected`
3. If any required field is missing: flag as `critical_error`

---

## Phase 2: File System Consistency

### Step 2.1: Directory Structure Verification
1. Verify these directories exist: `raw/`, `wiki/`, `wiki/pages/`, `assets/`, `exports/`
2. Verify these files exist: `wiki/index.md`, `wiki/log.md`, `wiki/overview.md`, `wiki/keyword-index.json`, `wiki/query-cache.json`
3. Missing directories: flag as `critical_error`
4. Missing files: flag as `drift_detected` (can be recreated)

### Step 2.2: Page Frontmatter Validation
1. Scan all files in `wiki/pages/`
2. For each file, verify:
   - Valid YAML frontmatter exists (between `---` delimiters)
   - `type` field is present and is one of: `topic | concept | chunk | relations | source-index | query | lint | overview | log`
   - `status` field is present and is one of: `draft | expanded | archived`
   - `title` field is present and non-empty
   - `updated` field is present and is a valid date
3. Pages with missing/invalid frontmatter: flag as `drift_detected`

### Step 2.3: Raw Source Integrity
1. For each subdirectory in `raw/`:
   - Verify `chunks.json` exists and is valid JSON
   - Verify `toc.md` exists
   - Verify `metadata.json` exists and is valid JSON
   - Verify at least one source file exists
2. Incomplete source directories: flag as `drift_detected`
3. Source directories with no source file: flag as `critical_error`

---

## Phase 3: Index Connectivity

### Step 3.1: Page-to-Index Mapping
1. Read `wiki/index.md`
2. For each file in `wiki/pages/`, verify it appears in `wiki/index.md` (via wikilink or direct reference)
3. Pages NOT in index: flag as `drift_detected` (orphan pages)

### Step 3.2: Index-to-Page Mapping
1. Extract all wikilinks from `wiki/index.md`
2. For each link, verify the target page exists in `wiki/pages/`
3. Broken links (target does not exist): flag as `drift_detected`

### Step 3.3: Cross-Page Link Integrity
1. Scan all pages in `wiki/pages/` for wikilinks (`[[...]]`)
2. For each wikilink, verify target exists
3. Broken wikilinks: flag as `drift_detected`
4. Count total links, broken links, and connectivity ratio

---

## Phase 4: Keyword Index Integrity

### Step 4.1: Validate keyword-index.json Structure
1. Read `wiki/keyword-index.json`
2. Verify valid JSON with required structure: `_meta` object and `keywords` object
3. If invalid: flag as `critical_error` (must be rebuilt)

### Step 4.2: Cross-Reference with Chunk Pages
1. For each keyword entry, verify all referenced chunk pages exist in `wiki/pages/`
2. Orphaned references (pointing to deleted chunks): flag as `drift_detected`
3. Scan all chunk pages' keywords and verify they appear in the index
4. Missing entries (chunk keywords not in index): flag as `drift_detected`

---

## Phase 5: Ingest Counter & Trigger Validation

### Step 5.1: Counter Consistency
1. Read `ingest_counter` from PERSONA.md
2. Count ingest log entries in `wiki/log.md` (entries matching `## [YYYY-MM-DD] ingest` or `## [YYYY-MM-DD] ingest-lite`)
3. If counter != log entry count: flag as `drift_detected`, calculate correct value

### Step 5.2: Lint Trigger Consistency
1. Read `lint_phase_b_trigger` from PERSONA.md
2. Count ingests since last Phase B lint entry in `wiki/log.md`
3. If ingests since last Phase B >= trigger threshold but Phase B hasn't run: flag as `drift_detected` (Phase B overdue)

### Step 5.3: In-Progress Marker Check
1. Search `wiki/log.md` for `[IN-PROGRESS]` markers
2. If found: flag as `critical_error` (interrupted operation; requires manual cleanup or recovery)

---

## Phase 6: Report Generation

### Step 6.1: Compile Validation Report
Generate a structured YAML report:
```yaml
validation_report:
  timestamp: YYYY-MM-DD HH:MM
  overall_status: valid | drift_detected | critical_error
  summary:
    total_checks: <N>
    passed: <N>
    drift_detected: <N>
    critical_errors: <N>
  details:
    critical_errors:
      - phase: <N>
        step: <step>
        description: "<what's wrong>"
        fix: "<suggested fix>"
    drift_detected:
      - phase: <N>
        step: <step>
        description: "<what's wrong>"
        auto_fixable: true | false
        fix: "<auto-fix description or manual fix suggestion>"
```

### Step 6.2: Auto-Fix Trivial Drift
For items marked `auto_fixable: true`:
1. `ingest_counter` mismatch → Update PERSONA.md with correct count
2. Orphaned keyword index entries → Remove from keyword-index.json
3. Missing keyword index entries → Add from chunk page keywords
4. Missing page in index.md → Add link to appropriate section
5. `_meta.updated` timestamps → Update to current date

Apply fixes and append to report: `auto_fixes_applied: [list]`

### Step 6.3: Present Non-Trivial Issues
For items NOT auto-fixable:
- Present to user with suggested fixes
- Wait for user confirmation before applying
- Critical errors BLOCK subsequent operations (wiki-ingest/wiki-query cannot proceed)

### Step 6.4: Log Validation
Append to `wiki/log.md`:
```
## [YYYY-MM-DD] validate | Status: <overall_status> | Checks: <passed>/<total> | Auto-fixes: <N>
```

---

## Common Mistakes to Avoid (Validate)

- Auto-fixing critical errors without user confirmation (only drift_detected with auto_fixable=true can be auto-fixed)
- Running validate during an active write operation (check for [IN-PROGRESS] first)
- Rebuilding keyword-index.json without reading ALL chunks.json files (partial rebuild corrupts the index)
- Treating missing `query-cache.json` as critical (it's drift_detected — recreate with empty skeleton)
- Skipping validation when called as pre-flight (even if last validation was recent — state can change between operations)
- Blocking wiki-query on drift_detected issues (only critical_errors should block; drift is reported but doesn't prevent read operations)
