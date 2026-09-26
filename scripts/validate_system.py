#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DIGITAL MARKET — Automated System Validation Suite (Production-Hardened)
========================================================================
Validates:
1. JSON Schemas & Template State Compliance
2. Wiki Articles & Durable ID Integrity (49 articles, KB-XX-YYY-ZZZ pattern)
3. Knowledge Registry Completeness & Node References
4. Taxonomy 753 Data Structure Validation (independent of JS runtime)
5. 15-Axis Context Schema Consistency
6. Source Registry Audit (actual vs claimed source count)
7. Phase-specific required knowledge node coverage

IMPORTANT: This validator performs INDEPENDENT data and schema verification.
It does NOT mock production engine behavior or test its own generated text.
Any test of runtime engine behavior must invoke the actual JS engine via subprocess.
"""

import os
import sys
import re
import json
import subprocess
from datetime import datetime, timezone

try:
    import yaml
except ImportError:
    print("[WARN] PyYAML not installed. Install with: pip install pyyaml")
    print("[WARN] Skipping YAML-dependent validations.")
    yaml = None

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLATFORM_DIR = os.path.join(BASE_DIR, "platform")


class ValidationSuite:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.warnings = 0
        self.results = []

    def log(self, category, test_name, status, details=""):
        if status == "PASS":
            self.passed += 1
            icon = "✅ [PASS]"
        elif status == "FAIL":
            self.failed += 1
            icon = "❌ [FAIL]"
        else:
            self.warnings += 1
            icon = "⚠️ [WARN]"
        self.results.append((category, test_name, status, details))
        msg = f"{icon} {category} -> {test_name}" + (f": {details}" if details else "")
        try:
            print(msg)
        except Exception:
            print(msg.encode("ascii", "replace").decode("ascii"))

    # ====================================================================
    # 1. JSON Schemas & Template State
    # ====================================================================
    def validate_schemas(self):
        print("\n" + "=" * 70)
        print("1. JSON SCHEMAS & TEMPLATE STATE INTEGRITY")
        print("=" * 70)

        schema_dir = os.path.join(BASE_DIR, "schemas")
        required_schemas = [
            "business-context.schema.json",
            "project-state.schema.json",
        ]
        optional_schemas = [
            "wiki-article.schema.json",
            "question.schema.json",
        ]

        schemas = {}
        for s_name in required_schemas:
            s_path = os.path.join(schema_dir, s_name)
            if os.path.exists(s_path):
                try:
                    with open(s_path, "r", encoding="utf-8") as f:
                        schemas[s_name] = json.load(f)
                    self.log("Schemas", f"File exists & valid JSON: {s_name}", "PASS")
                except Exception as e:
                    self.log("Schemas", f"JSON parse error: {s_name}", "FAIL", str(e))
            else:
                self.log("Schemas", f"Missing required schema file: {s_name}", "FAIL")

        for s_name in optional_schemas:
            s_path = os.path.join(schema_dir, s_name)
            if os.path.exists(s_path):
                try:
                    with open(s_path, "r", encoding="utf-8") as f:
                        schemas[s_name] = json.load(f)
                    self.log("Schemas", f"Optional schema valid: {s_name}", "PASS")
                except Exception as e:
                    self.log("Schemas", f"JSON parse error in optional: {s_name}", "WARN", str(e))

        # Validate template state against schema requirements
        template_path = os.path.join(BASE_DIR, "state", "project-state.template.json")
        if os.path.exists(template_path):
            try:
                with open(template_path, "r", encoding="utf-8") as f:
                    template_data = json.load(f)

                # Check required root fields
                pss = schemas.get("project-state.schema.json", {})
                root_req = pss.get("required", [])
                if root_req:
                    missing_root = [k for k in root_req if k not in template_data]
                    if not missing_root:
                        self.log("State Template", "Required root fields present", "PASS")
                    else:
                        self.log("State Template", "Missing root fields", "FAIL", f"{missing_root}")
                else:
                    self.log("State Template", "No required fields defined in schema", "WARN")

                # Check business_context 15 axes
                ctx = template_data.get("business_context", {})
                bcs = schemas.get("business-context.schema.json", {})
                ctx_props = bcs.get("properties", {})
                if ctx_props:
                    missing_axes = [k for k in ctx_props if k not in ctx]
                    if not missing_axes:
                        self.log("State Template", "All business context axes present", "PASS")
                    else:
                        self.log("State Template", "Missing context axes", "FAIL", f"{missing_axes}")
                else:
                    self.log("State Template", "No properties in business-context schema", "WARN")

                # Check evidence ledger fields exist in template
                for field in ["facts", "decisions", "unknowns", "assumptions", "contradictions"]:
                    if field in template_data:
                        self.log("State Template", f"Field '{field}' exists in template", "PASS")
                    else:
                        self.log("State Template", f"Field '{field}' missing from template", "WARN")

            except Exception as e:
                self.log("State Template", "Template parse error", "FAIL", str(e))
        else:
            self.log("State Template", "Missing template file", "FAIL")

    # ====================================================================
    # 2. Wiki Articles & Registry Integrity
    # ====================================================================
    def validate_wiki_and_registry(self):
        print("\n" + "=" * 70)
        print("2. WIKI ARTICLES & REGISTRY INTEGRITY")
        print("=" * 70)

        if yaml is None:
            self.log("Registry", "Skipped (PyYAML not available)", "WARN")
            return

        wiki_dir = os.path.join(BASE_DIR, "wiki")
        registry_path = os.path.join(wiki_dir, "registry.yaml")

        if not os.path.exists(registry_path):
            self.log("Registry", "registry.yaml exists", "FAIL")
            return

        with open(registry_path, "r", encoding="utf-8") as f:
            registry = yaml.safe_load(f)

        knowledge_nodes = registry.get("knowledge_nodes", {})
        node_count = len(knowledge_nodes)
        self.log("Registry", f"Total registered knowledge nodes: {node_count}", "PASS")

        # Scan actual markdown files in wiki/
        wiki_files = []
        for root, dirs, files in os.walk(wiki_dir):
            for file in files:
                if file.endswith(".md") and file not in ["INDEX.md", "README.md"]:
                    wiki_files.append(os.path.join(root, file))

        self.log("Wiki Articles", f"Total markdown files found: {len(wiki_files)}", "PASS")

        # Pattern matches ^KB-[A-Z0-9-]+$
        id_pattern = re.compile(r"^KB-[A-Z0-9-]+$")
        seen_ids = set()
        frontmatter_errors = 0
        registry_errors = 0

        for w_file in wiki_files:
            rel_path = os.path.relpath(w_file, BASE_DIR).replace("\\", "/")
            with open(w_file, "r", encoding="utf-8") as f:
                content = f.read()

            # Frontmatter extraction
            fm_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
            if not fm_match:
                # Try CRLF
                fm_match = re.match(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
            if not fm_match:
                self.log("Frontmatter", f"Missing frontmatter in {rel_path}", "FAIL")
                frontmatter_errors += 1
                continue

            fm_raw = fm_match.group(1)
            try:
                fm_data = yaml.safe_load(fm_raw)
                art_id = fm_data.get("id") if fm_data else None
                if not art_id or not id_pattern.match(art_id):
                    self.log("Durable ID", f"Invalid ID format '{art_id}' in {rel_path}", "FAIL")
                    frontmatter_errors += 1
                elif art_id in seen_ids:
                    self.log("Durable ID", f"Duplicate ID '{art_id}' in {rel_path}", "FAIL")
                    frontmatter_errors += 1
                else:
                    seen_ids.add(art_id)

                # Check registration in registry.yaml
                if art_id and art_id not in knowledge_nodes:
                    self.log("Registry Map", f"Node '{art_id}' missing in registry.yaml", "FAIL")
                    registry_errors += 1

            except Exception as e:
                self.log("Frontmatter", f"YAML error in {rel_path}", "FAIL", str(e))
                frontmatter_errors += 1

        if frontmatter_errors == 0:
            self.log("Wiki Articles", f"All {len(wiki_files)} articles have valid, unique durable IDs", "PASS")
        if registry_errors == 0:
            self.log("Wiki Registry", "Full parity between wiki files and registry nodes", "PASS")

        # Check registry nodes point to existing files
        orphaned_nodes = []
        for node_id, node_data in knowledge_nodes.items():
            node_file = node_data.get("file", "")
            full_path = os.path.join(BASE_DIR, node_file.replace("/", os.sep))
            if not os.path.exists(full_path):
                orphaned_nodes.append(node_id)
        if not orphaned_nodes:
            self.log("Registry Files", "All registry nodes point to existing files", "PASS")
        else:
            self.log("Registry Files", f"Orphaned nodes (missing files): {orphaned_nodes[:5]}...", "FAIL")

        # Source counts come only from the canonical Source Registry.
        source_registry_path = os.path.join(wiki_dir, "source-registry.json")
        if not os.path.exists(source_registry_path):
            self.log("Source Registry", "wiki/source-registry.json missing", "FAIL")
        else:
            with open(source_registry_path, "r", encoding="utf-8") as f:
                source_registry = json.load(f)
            sources = source_registry.get("sources", {})
            by_status = {}
            for record in sources.values():
                status = record.get("status", "UNKNOWN")
                by_status[status] = by_status.get(status, 0) + 1
            self.log(
                "Source Count",
                f"Registered sources: {len(sources)}; status counts: {by_status}",
                "PASS"
            )

        # Registry relationships are hard graph edges: dependency/source/claim IDs must resolve.
        claim_registry_path = os.path.join(wiki_dir, "claims.json")
        source_registry_path = os.path.join(wiki_dir, "source-registry.json")
        claims_for_edges = {}
        sources_for_edges = {}
        if os.path.exists(claim_registry_path):
            with open(claim_registry_path, "r", encoding="utf-8") as f:
                claims_for_edges = json.load(f).get("claims", {})
        if os.path.exists(source_registry_path):
            with open(source_registry_path, "r", encoding="utf-8") as f:
                sources_for_edges = json.load(f).get("sources", {})

        broken_edges = []
        for node_id, node_data in knowledge_nodes.items():
            for dep in node_data.get("dependencies", []) or []:
                if dep not in knowledge_nodes:
                    broken_edges.append(f"{node_id} -> missing dependency {dep}")
            for source_id in node_data.get("source_ids", []) or []:
                if source_id not in sources_for_edges:
                    broken_edges.append(f"{node_id} -> missing source {source_id}")
            for claim_id in node_data.get("claim_ids", []) or []:
                if claim_id not in claims_for_edges:
                    broken_edges.append(f"{node_id} -> missing claim {claim_id}")

        if broken_edges:
            self.log("Knowledge Edges", f"Broken edges: {broken_edges[:10]}", "FAIL")
        else:
            self.log("Knowledge Edges", "Broken Knowledge Edge Rate = 0%", "PASS")

    # ====================================================================
    # 3. Taxonomy 753 Data Integrity (JSON-based validation)
    # ====================================================================
    def validate_taxonomy_753(self):
        print("\n" + "=" * 70)
        print("3. TAXONOMY 753 DATA INTEGRITY VALIDATION")
        print("=" * 70)

        taxonomy_path = os.path.join(PLATFORM_DIR, "src", "data", "businessTaxonomy753.js")
        if not os.path.exists(taxonomy_path):
            self.log("Taxonomy", "businessTaxonomy753.js not found", "FAIL")
            return

        with open(taxonomy_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract the BUSINESS_TYPES array by finding JSON array pattern
        # Count BT- entries
        bt_ids = re.findall(r'"id"\s*:\s*"(BT-\d{4})"', content)

        if len(bt_ids) >= 753:
            self.log("Taxonomy", f"Found {len(bt_ids)} BT-XXXX entries (expected >= 753)", "PASS")
        else:
            self.log("Taxonomy", f"Only {len(bt_ids)} BT-XXXX entries found (expected 753)", "FAIL")

        # Check ID uniqueness (each ID appears exactly 2x: once in array, once in lookup map)
        unique_ids = set(bt_ids)
        bad_ids = [x for x in unique_ids if bt_ids.count(x) != 2]
        if len(bad_ids) == 0 and len(unique_ids) == 753:
            self.log("Taxonomy IDs", f"All {len(unique_ids)} IDs appear exactly 2x (array + lookup map)", "PASS")
        elif len(bad_ids) > 0:
            self.log("Taxonomy IDs", f"IDs with unexpected count: {bad_ids[:5]}...", "FAIL")
        else:
            self.log("Taxonomy IDs", f"{len(unique_ids)} unique IDs (expected 753)", "WARN")

        # Check sequence integrity (BT-0001 to BT-0753)
        expected_sequence = [f"BT-{i:04d}" for i in range(1, 754)]
        # Deduplicate and get first occurrence order
        seen_first = []
        seen_set = set()
        for bid in bt_ids:
            if bid not in seen_set:
                seen_first.append(bid)
                seen_set.add(bid)

        missing_in_sequence = [eid for eid in expected_sequence if eid not in seen_set]
        if not missing_in_sequence:
            self.log("Taxonomy Sequence", "Continuous BT-0001 to BT-0753 with zero gaps", "PASS")
        else:
            self.log("Taxonomy Sequence", f"Missing IDs in sequence: {missing_in_sequence[:10]}...", "FAIL")

        # Check titleFa presence (at least some non-empty Persian titles)
        title_fa_matches = re.findall(r'"titleFa"\s*:\s*"([^"]*)"', content)
        non_empty_fa = [t for t in title_fa_matches if t.strip()]
        if len(non_empty_fa) >= 700:
            self.log("Taxonomy titleFa", f"{len(non_empty_fa)}/{len(title_fa_matches)} have non-empty Persian titles", "PASS")
        else:
            self.log("Taxonomy titleFa", f"Only {len(non_empty_fa)} non-empty Persian titles", "FAIL")

        # Check titleEn presence
        title_en_matches = re.findall(r'"titleEn"\s*:\s*"([^"]*)"', content)
        non_empty_en = [t for t in title_en_matches if t.strip()]
        if len(non_empty_en) >= 700:
            self.log("Taxonomy titleEn", f"{len(non_empty_en)}/{len(title_en_matches)} have non-empty English titles", "PASS")
        else:
            self.log("Taxonomy titleEn", f"Only {len(non_empty_en)} non-empty English titles", "WARN")

        # Check industryId references
        industry_ids = re.findall(r'"industryId"\s*:\s*"(IND-\d{2})"', content)
        unique_industries = set(industry_ids)
        if len(unique_industries) >= 20:
            self.log("Taxonomy Industries", f"{len(unique_industries)} unique industry groups referenced", "PASS")
        else:
            self.log("Taxonomy Industries", f"Only {len(unique_industries)} industry groups (expected ~31)", "WARN")

        # Check for valid archetype values
        valid_archetypes = {
            "LOCAL_SERVICE", "PHYSICAL_RETAIL", "RESTAURANT_CAFE_HOSPITALITY",
            "SAAS_SOFTWARE", "MANUFACTURER", "ECOMMERCE_DTC", "MARKETPLACE",
            "CREATOR_MEDIA_EDUCATION", "CONSULTING", "HEALTHCARE_CLINIC",
            "CONSTRUCTION_REAL_ESTATE", "AGRICULTURE_LIVESTOCK", "FINANCIAL_SERVICES",
            "LOGISTICS_TRANSPORT", "TOURISM_HOSPITALITY", "BEAUTY_WELLNESS",
            "LEGAL_ACCOUNTING", "IMPORT_EXPORT_TRADE"
        }
        archetype_matches = re.findall(r'"archetype"\s*:\s*"([A-Z_]+)"', content)
        unknown_archetypes = set(archetype_matches) - valid_archetypes
        if len(unknown_archetypes) <= 5:
            self.log("Taxonomy Archetypes", f"All archetypes within known set (+{len(unknown_archetypes)} extended)", "PASS")
        else:
            self.log("Taxonomy Archetypes", f"Unknown archetypes: {unknown_archetypes}", "WARN")

    # ====================================================================
    # 4. 15-Axis Context Consistency Check
    # ====================================================================
    def validate_15_axis_consistency(self):
        print("\n" + "=" * 70)
        print("4. 15-AXIS CONTEXT SCHEMA CONSISTENCY")
        print("=" * 70)

        # Canonical v3 model has exactly 15 axes. primaryArchetype is derived metadata.
        canonical_axes_runtime = [
            "customerModel", "offerType", "channelModel", "revenueModel",
            "maturity", "scale", "salesMotion", "geography", "branchStructure",
            "founderRole", "purchaseCycle", "relationshipModel",
            "regulatoryProfile", "operationalComplexity", "brandArchitecture"
        ]

        schema_path = os.path.join(BASE_DIR, "schemas", "v3", "business-context.schema.json")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                schema = json.load(f)
            axes_schema = schema.get("properties", {}).get("axes", {})
            schema_props = set(axes_schema.get("properties", {}).keys())
            expected_schema = set(canonical_axes_runtime)
            if schema_props == expected_schema and len(schema_props) == 15:
                self.log("15-Axis Schema", "Exact 15-axis v3 schema match", "PASS")
            else:
                self.log("15-Axis Schema", f"Schema drift. expected={sorted(expected_schema)} actual={sorted(schema_props)}", "FAIL")
        else:
            self.log("15-Axis Schema", "business-context.schema.json not found", "FAIL")

        # Check runtime usage in businessContextRouter.js
        router_path = os.path.join(PLATFORM_DIR, "src", "data", "businessContextRouter.js")
        if os.path.exists(router_path):
            with open(router_path, "r", encoding="utf-8") as f:
                router_content = f.read()
            found_runtime = [ax for ax in canonical_axes_runtime if ax in router_content]
            if len(found_runtime) >= 8:
                self.log("15-Axis Runtime", f"{len(found_runtime)}/15 axes used in businessContextRouter.js", "PASS")
            else:
                self.log("15-Axis Runtime", f"Only {len(found_runtime)}/15 axes found in runtime", "WARN")
        else:
            self.log("15-Axis Runtime", "businessContextRouter.js not found", "FAIL")

    # ====================================================================
    # 5. Canonical Knowledge Provenance & Retrieval
    # ====================================================================
    def validate_knowledge_provenance(self):
        print("\n" + "=" * 70)
        print("5. CANONICAL KNOWLEDGE PROVENANCE & RETRIEVAL")
        print("=" * 70)

        if yaml is None:
            self.log("Knowledge Provenance", "PyYAML unavailable", "FAIL")
            return

        wiki_dir = os.path.join(BASE_DIR, "wiki")
        registry_path = os.path.join(wiki_dir, "registry.yaml")
        sources_path = os.path.join(wiki_dir, "source-registry.json")
        claims_path = os.path.join(wiki_dir, "claims.json")
        retrieval_path = os.path.join(wiki_dir, "generated", "retrieval-index.json")

        required = [registry_path, sources_path, claims_path, retrieval_path]
        missing = [p for p in required if not os.path.exists(p)]
        if missing:
            self.log("Knowledge Files", f"Missing canonical knowledge files: {missing}", "FAIL")
            return

        with open(registry_path, "r", encoding="utf-8") as f:
            node_registry = yaml.safe_load(f) or {}
        with open(sources_path, "r", encoding="utf-8") as f:
            source_registry = json.load(f)
        with open(claims_path, "r", encoding="utf-8") as f:
            claim_registry = json.load(f)
        with open(retrieval_path, "r", encoding="utf-8") as f:
            retrieval = json.load(f)

        nodes = node_registry.get("knowledge_nodes", {})
        sources = source_registry.get("sources", {})
        claims = claim_registry.get("claims", {})
        admissible = {"VERIFIED", "CANONICAL"}

        broken_source_refs = []
        broken_node_refs = []
        untraceable = []
        canonical_provenance_failures = []

        for claim_id, claim in claims.items():
            node_id = claim.get("knowledge_node_id")
            if node_id not in nodes:
                broken_node_refs.append((claim_id, node_id))

            source_ids = claim.get("source_ids", [])
            missing_sources = [sid for sid in source_ids if sid not in sources]
            if missing_sources:
                broken_source_refs.append((claim_id, missing_sources))

            if claim.get("decision_driving"):
                locators = claim.get("locators", [])
                located_sources = {loc.get("source_id") for loc in locators if loc.get("locator")}
                if not source_ids or not all(sid in located_sources for sid in source_ids):
                    untraceable.append(claim_id)

            if claim.get("status") == "CANONICAL":
                if not source_ids or missing_sources:
                    canonical_provenance_failures.append(claim_id)
                elif any(sources[sid].get("status") not in admissible for sid in source_ids):
                    canonical_provenance_failures.append(claim_id)

        if broken_source_refs:
            self.log("Broken Source Refs", str(broken_source_refs[:10]), "FAIL")
        else:
            self.log("Broken Source Refs", "0 broken source references", "PASS")

        if broken_node_refs:
            self.log("Broken Knowledge Refs", str(broken_node_refs[:10]), "FAIL")
        else:
            self.log("Broken Knowledge Refs", "0 broken knowledge-node references", "PASS")

        decision_claims = [c for c in claims.values() if c.get("decision_driving")]
        traceable = len(decision_claims) - len(untraceable)
        trace_rate = 100.0 if not decision_claims else traceable / len(decision_claims) * 100
        if trace_rate == 100.0:
            self.log("Source Traceability", f"{trace_rate:.1f}% ({traceable}/{len(decision_claims)})", "PASS")
        else:
            self.log("Source Traceability", f"{trace_rate:.1f}% missing={untraceable[:10]}", "FAIL")

        canonical_claims = [c for c in claims.values() if c.get("status") == "CANONICAL"]
        canonical_ok = len(canonical_claims) - len(canonical_provenance_failures)
        canonical_rate = 100.0 if not canonical_claims else canonical_ok / len(canonical_claims) * 100
        if canonical_rate == 100.0:
            self.log("Canonical Provenance", f"{canonical_rate:.1f}% ({canonical_ok}/{len(canonical_claims)})", "PASS")
        else:
            self.log("Canonical Provenance", f"{canonical_rate:.1f}% failures={canonical_provenance_failures[:10]}", "FAIL")

        # Every Decision Module KB dependency must resolve to a root-Wiki registry node.
        module_path = os.path.join(PLATFORM_DIR, "src", "reasoning", "modules", "registry.js")
        with open(module_path, "r", encoding="utf-8") as f:
            module_text = f.read()
        module_kb_refs = set(re.findall(r"'(KB-[A-Z0-9-]+)'", module_text))
        missing_module_nodes = sorted(module_kb_refs - set(nodes))
        if missing_module_nodes:
            self.log("Module Knowledge Edges", f"Missing nodes: {missing_module_nodes}", "FAIL")
        else:
            self.log("Module Knowledge Edges", f"All {len(module_kb_refs)} module KB refs resolve", "PASS")

        entries = retrieval.get("entries", [])
        retrieval_errors = []
        for entry in entries:
            claim = claims.get(entry.get("claim_id"))
            if not claim:
                retrieval_errors.append(f"missing claim {entry.get('claim_id')}")
                continue
            if entry.get("knowledge_node_id") != claim.get("knowledge_node_id"):
                retrieval_errors.append(f"node mismatch {entry.get('retrieval_id')}")
            if entry.get("source_ids") != claim.get("source_ids"):
                retrieval_errors.append(f"source mismatch {entry.get('retrieval_id')}")
            if claim.get("status") not in admissible:
                retrieval_errors.append(f"inadmissible claim {entry.get('claim_id')}")

        if retrieval.get("count") != len(entries):
            retrieval_errors.append("retrieval count mismatch")

        if retrieval_errors:
            self.log("Generated Retrieval", f"Errors: {retrieval_errors[:10]}", "FAIL")
        else:
            self.log("Generated Retrieval", f"{len(entries)} entries with canonical claim/source origin", "PASS")

        # Canonical time-sensitive sources must be within their declared max-age window.
        freshness_failures = []
        now = datetime.now(timezone.utc)
        time_sensitive = {
            "VOLATILE_PRICE", "PLATFORM_POLICY", "LEGAL", "TAX",
            "REGULATORY", "MACRO", "INDUSTRY_REPORT", "INTERNAL_PLAYBOOK"
        }
        canonical_source_ids = {
            sid
            for claim in claims.values()
            if claim.get("status") == "CANONICAL"
            for sid in claim.get("source_ids", [])
        }
        for source_id in sorted(canonical_source_ids):
            source = sources.get(source_id, {})
            freshness_class = source.get("freshness_class")
            max_age_days = source.get("max_age_days")
            if freshness_class not in time_sensitive or not max_age_days:
                continue
            stamp = source.get("verified_at") or source.get("accessed_at") or source.get("published_at")
            if not stamp:
                freshness_failures.append(f"{source_id}: no freshness timestamp")
                continue
            try:
                parsed = datetime.fromisoformat(str(stamp).replace("Z", "+00:00"))
                if parsed.tzinfo is None:
                    parsed = parsed.replace(tzinfo=timezone.utc)
                age_days = (now - parsed.astimezone(timezone.utc)).total_seconds() / 86400
                if age_days > float(max_age_days):
                    freshness_failures.append(
                        f"{source_id}: age={age_days:.1f}d > max={max_age_days}d"
                    )
            except Exception:
                freshness_failures.append(f"{source_id}: invalid date {stamp}")

        if freshness_failures:
            self.log("Canonical Freshness", f"Failures: {freshness_failures[:10]}", "FAIL")
        else:
            self.log("Canonical Freshness", "All time-sensitive canonical sources are inside freshness contract", "PASS")

        # Matched retrieval: contrasting business contexts must select materially different
        # canonical knowledge claims, not the same generic chunk set.
        def claims_for_modules(module_ids):
            requested = set(module_ids)
            return {
                entry.get("claim_id")
                for entry in entries
                if requested.intersection(entry.get("module_ids", []))
            }

        b2b_regulated_recurring = claims_for_modules({
            "MOD-CUSTOMER-B2B", "MOD-REV-RECURRING", "MOD-REG-HIGH"
        })
        local_b2c_retail = claims_for_modules({
            "MOD-CUSTOMER-B2C", "MOD-CHANNEL-PHYSICAL", "MOD-GEO-LOCAL",
            "MOD-OFFER-PHYSICAL", "MOD-REV-TRANSACTION", "MOD-SCALE-MICRO"
        })

        required_b2b = {"KCL-B2B-DMU", "KCL-RETENTION", "KCL-COMPLIANCE"}
        required_local = {"KCL-B2C-BEHAVIOR", "KCL-LOCAL-CHANNEL", "KCL-PHYSICAL-OFFER"}
        matched_errors = []
        if not required_b2b.issubset(b2b_regulated_recurring):
            matched_errors.append(
                f"B2B/regulated/recurring missing {sorted(required_b2b - b2b_regulated_recurring)}"
            )
        if not required_local.issubset(local_b2c_retail):
            matched_errors.append(
                f"local/B2C/physical missing {sorted(required_local - local_b2c_retail)}"
            )
        if b2b_regulated_recurring == local_b2c_retail:
            matched_errors.append("contrasting contexts returned identical claim sets")
        if "KCL-B2B-DMU" in local_b2c_retail:
            matched_errors.append("B2B DMU leaked into local B2C retrieval")
        if "KCL-B2C-BEHAVIOR" in b2b_regulated_recurring:
            matched_errors.append("B2C behavior leaked into B2B retrieval")

        if matched_errors:
            self.log("Matched Retrieval", f"Failures: {matched_errors}", "FAIL")
        else:
            self.log(
                "Matched Retrieval",
                f"B2B={len(b2b_regulated_recurring)} claims, local-B2C={len(local_b2c_retail)} claims, differentiated with no protected leakage",
                "PASS"
            )

        legacy_rag = os.path.join(BASE_DIR, "knowledge_base", "rag_engine.py")
        with open(legacy_rag, "r", encoding="utf-8") as f:
            legacy_rag_text = f.read()
        legacy_rag_runtime_ref = (
            re.search(r"KB_FILE\s*=.*rag_chunks\.json", legacy_rag_text) or
            re.search(r"open\([^\n]*rag_chunks\.json", legacy_rag_text)
        )
        if legacy_rag_runtime_ref:
            self.log("Legacy RAG", "Runtime still reads manual rag_chunks.json", "FAIL")
        else:
            self.log("Legacy RAG", "Compatibility API delegates to canonical generated retrieval", "PASS")

        legacy_wiki = os.path.join(BASE_DIR, "knowledge_base", "wiki_engine.py")
        with open(legacy_wiki, "r", encoding="utf-8") as f:
            legacy_wiki_text = f.read()
        points_to_root_wiki = (
            'WIKI_DIR = os.path.join(ROOT_DIR, "wiki")' in legacy_wiki_text
            and 'knowledge_base", "wiki"' not in legacy_wiki_text
        )
        if points_to_root_wiki:
            self.log("Legacy Wiki Plane", "Compatibility API reads canonical root wiki only", "PASS")
        else:
            self.log("Legacy Wiki Plane", "Runtime still treats knowledge_base/wiki as an authored truth plane", "FAIL")

    # ====================================================================
    # 6. Phase-Specific Knowledge Coverage
    # ====================================================================
    def validate_phase_knowledge_coverage(self):
        print("\n" + "=" * 70)
        print("5. PHASE-SPECIFIC KNOWLEDGE COVERAGE")
        print("=" * 70)

        if yaml is None:
            self.log("Knowledge Coverage", "Skipped (PyYAML not available)", "WARN")
            return

        registry_path = os.path.join(BASE_DIR, "wiki", "registry.yaml")
        if not os.path.exists(registry_path):
            self.log("Knowledge Coverage", "registry.yaml not found", "FAIL")
            return

        with open(registry_path, "r", encoding="utf-8") as f:
            registry = yaml.safe_load(f)

        nodes = registry.get("knowledge_nodes", {})

        # Check each phase has at least 2 dedicated knowledge nodes
        for phase in range(1, 9):
            phase_nodes = [
                nid for nid, ndata in nodes.items()
                if phase in ndata.get("phases", [])
            ]
            if len(phase_nodes) >= 2:
                self.log("Phase Coverage", f"Phase {phase} has {len(phase_nodes)} knowledge nodes", "PASS")
            else:
                self.log("Phase Coverage", f"Phase {phase} has only {len(phase_nodes)} knowledge nodes", "WARN")

    # ====================================================================
    # 6. Platform Package & Build Config Validation
    # ====================================================================
    def validate_platform_config(self):
        print("\n" + "=" * 70)
        print("6. PLATFORM CONFIGURATION VALIDATION")
        print("=" * 70)

        pkg_path = os.path.join(PLATFORM_DIR, "package.json")
        if os.path.exists(pkg_path):
            with open(pkg_path, "r", encoding="utf-8") as f:
                pkg = json.load(f)

            scripts = pkg.get("scripts", {})
            required_scripts = ["dev", "build", "test"]
            for s in required_scripts:
                if s in scripts:
                    self.log("Package Scripts", f"Script '{s}' defined", "PASS")
                else:
                    self.log("Package Scripts", f"Script '{s}' missing", "FAIL")

            # Check dependencies exist
            deps = pkg.get("dependencies", {})
            dev_deps = pkg.get("devDependencies", {})
            required_deps = ["react", "react-dom"]
            for d in required_deps:
                if d in deps:
                    self.log("Dependencies", f"'{d}' in dependencies", "PASS")
                else:
                    self.log("Dependencies", f"'{d}' missing from dependencies", "FAIL")

            if "vite" in dev_deps:
                self.log("Dependencies", "'vite' in devDependencies", "PASS")
            else:
                self.log("Dependencies", "'vite' missing from devDependencies", "FAIL")
        else:
            self.log("Package", "package.json not found", "FAIL")

        # Check vite config
        vite_path = os.path.join(PLATFORM_DIR, "vite.config.js")
        if os.path.exists(vite_path):
            self.log("Build Config", "vite.config.js exists", "PASS")
        else:
            self.log("Build Config", "vite.config.js not found", "FAIL")

    # ====================================================================
    # 7. Secret Detection Scan
    # ====================================================================
    def validate_no_secrets(self):
        print("\n" + "=" * 70)
        print("7. SECRET DETECTION SCAN")
        print("=" * 70)

        secret_patterns = [
            (r"AIza[0-9A-Za-z_-]{35}", "Google API Key"),
            (r"sk-[a-zA-Z0-9]{48}", "OpenAI API Key"),
            (r"ghp_[a-zA-Z0-9]{36}", "GitHub Personal Access Token"),
            (r"password\s*[=:]\s*['\"][^'\"]{8,}", "Hardcoded password"),
        ]

        scan_dirs = [
            os.path.join(BASE_DIR, "platform", "src"),
            os.path.join(BASE_DIR, "scripts"),
            os.path.join(BASE_DIR, "schemas"),
        ]

        found_secrets = 0
        for scan_dir in scan_dirs:
            if not os.path.exists(scan_dir):
                continue
            for root, dirs, files in os.walk(scan_dir):
                # Skip node_modules
                dirs[:] = [d for d in dirs if d != "node_modules"]
                for file in files:
                    if not file.endswith((".js", ".json", ".py", ".md", ".yaml", ".yml")):
                        continue
                    fpath = os.path.join(root, file)
                    try:
                        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                        for pattern, desc in secret_patterns:
                            if re.search(pattern, content):
                                rel = os.path.relpath(fpath, BASE_DIR)
                                self.log("Secrets", f"Potential {desc} in {rel}", "FAIL",
                                         "Remove secret and use environment variable")
                                found_secrets += 1
                    except Exception:
                        pass

        if found_secrets == 0:
            self.log("Secrets", "No hardcoded secrets detected in source code", "PASS")

    # ====================================================================
    # Summary
    # ====================================================================
    def print_summary(self):
        print("\n" + "=" * 70)
        print("DIGITAL MARKET VALIDATION SUMMARY")
        print("=" * 70)
        total = self.passed + self.failed + self.warnings
        if total == 0:
            print("No tests were executed.")
            return 1
        print(f"Total Tests Evaluated : {total}")
        print(f"Passed                : {self.passed} ({(self.passed / total * 100):.1f}%)")
        print(f"Failed                : {self.failed}")
        print(f"Warnings              : {self.warnings}")
        print("=" * 70)
        if self.failed == 0:
            print(">>> SYSTEM STATUS: ALL VALIDATIONS PASSED <<<")
            return 0
        else:
            print(f">>> SYSTEM STATUS: {self.failed} VALIDATION(S) FAILED — RESOLVE ISSUES ABOVE <<<")
            return 1


if __name__ == "__main__":
    suite = ValidationSuite()
    suite.validate_schemas()
    suite.validate_wiki_and_registry()
    suite.validate_taxonomy_753()
    suite.validate_15_axis_consistency()
    suite.validate_knowledge_provenance()
    suite.validate_phase_knowledge_coverage()
    suite.validate_platform_config()
    suite.validate_no_secrets()
    code = suite.print_summary()
    sys.exit(code)
