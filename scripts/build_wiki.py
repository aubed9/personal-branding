#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Canonical Wiki build and validation runner.

Supports:
  python scripts/build_wiki.py          # rebuild retrieval-index.json
  python scripts/build_wiki.py --check  # verify index is fresh without modifying disk
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

# Safe stdout/stderr encoding on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "wiki" / "source-registry.json"
CLAIM_PATH = ROOT / "wiki" / "claims.json"
OUTPUT_PATH = ROOT / "wiki" / "generated" / "retrieval-index.json"
PARITY_PATH = ROOT / "wiki" / "migration" / "retrieval-parity-report.json"

ADMISSIBLE = {"VERIFIED", "CANONICAL"}
AUTHORITY_RANK = {"A": 1, "B": 2, "C": 3, "D": 4}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def build_index():
    sources = load_json(SOURCE_PATH).get("sources", {})
    claims = load_json(CLAIM_PATH).get("claims", {})
    entries = []

    for claim_id in sorted(claims):
        claim = claims[claim_id]
        if claim.get("status") not in ADMISSIBLE:
            continue
        source_ids = claim.get("source_ids", [])
        source_records = [sources.get(source_id) for source_id in source_ids]
        if not source_ids or any(record is None for record in source_records):
            raise ValueError(f"{claim_id}: broken source reference")
        if any(record.get("status") not in ADMISSIBLE for record in source_records):
            continue

        authority_floor = max(
            (record.get("authority_tier", "D") for record in source_records),
            key=lambda tier: AUTHORITY_RANK.get(tier, 99),
        )
        entries.append({
            "retrieval_id": f"RET-{claim_id}",
            "knowledge_node_id": claim["knowledge_node_id"],
            "claim_id": claim_id,
            "content": claim["statement"],
            "claim_kind": claim["claim_kind"],
            "decision_driving": bool(claim["decision_driving"]),
            "status": claim["status"],
            "source_ids": source_ids,
            "source_authority_floor": authority_floor,
            "freshness_class": claim["freshness_class"],
            "max_age_days": claim.get("max_age_days"),
            "jurisdiction_or_scope": claim.get("jurisdiction_or_scope"),
            "phases": claim.get("phases", []),
            "decision_node_ids": claim.get("decision_node_ids", []),
            "module_ids": claim.get("module_ids", []),
            "limitations": claim.get("limitations", ""),
        })

    return {
        "version": "1.0.0",
        "generated_from": {
            "source_registry": "wiki/source-registry.json",
            "claim_registry": "wiki/claims.json",
            "policy": "Only VERIFIED/CANONICAL claims whose referenced sources are VERIFIED/CANONICAL are indexed.",
        },
        "count": len(entries),
        "entries": entries,
    }


def main():
    parser = argparse.ArgumentParser(description="Build or check canonical Wiki retrieval index.")
    parser.add_argument("--check", action="store_true", help="Check if generated index is strictly up to date.")
    args = parser.parse_args()

    computed = build_index()

    if args.check:
        if not OUTPUT_PATH.exists():
            print(f"[FAIL] Missing generated retrieval index: {OUTPUT_PATH}")
            sys.exit(1)
        existing = load_json(OUTPUT_PATH)
        if json.dumps(computed, sort_keys=True) != json.dumps(existing, sort_keys=True):
            print(f"[FAIL] Retrieval index {OUTPUT_PATH} is out of sync with registries (computed {computed['count']}, existing {existing.get('count')}).")
            sys.exit(1)

        if PARITY_PATH.exists():
            parity = load_json(PARITY_PATH)
            if parity.get("canonical_retrieval_entries") != computed["count"]:
                print(f"[FAIL] Parity report count mismatch: {parity.get('canonical_retrieval_entries')} != {computed['count']}")
                sys.exit(1)

        print(f"[PASS] Canonical Wiki retrieval index is up to date ({computed['count']} entries).")
        sys.exit(0)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(computed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if PARITY_PATH.exists():
        parity = load_json(PARITY_PATH)
        parity["canonical_retrieval_entries"] = computed["count"]
        PARITY_PATH.write_text(json.dumps(parity, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[OK] Generated {computed['count']} canonical retrieval entries -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
