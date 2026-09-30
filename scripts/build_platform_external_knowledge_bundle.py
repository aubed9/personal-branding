#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate the browser-runtime external knowledge bundle from canonical registries.

Only decision-driving non-internal retrieval entries are bundled. Admission is
still re-evaluated at runtime for freshness, authority and jurisdiction.
"""
from __future__ import annotations

import argparse
import json
import re
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX_PATH = ROOT / "wiki" / "generated" / "retrieval-index.json"
CLAIMS_PATH = ROOT / "wiki" / "claims.json"
SOURCES_PATH = ROOT / "wiki" / "source-registry.json"
OUTPUT_PATH = ROOT / "platform" / "src" / "knowledge" / "canonicalExternalKnowledge.generated.js"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def js_json(value):
    return json.dumps(value, ensure_ascii=False, indent=2)


def validate_verified_dates(sources):
    pattern = re.compile(r"^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$")
    for source_id, source in sources.items():
        if source.get("status") not in {"VERIFIED", "CANONICAL"}:
            continue
        stamp = source.get("verified_at")
        match = pattern.fullmatch(stamp) if isinstance(stamp, str) else None
        if not match:
            raise ValueError(f"{source_id}: verified source needs a Gregorian ISO verified_at date")
        try:
            if int(match.group(1)) < 1600:
                raise ValueError("Solar Hijri year in a Gregorian verification field")
            date.fromisoformat(stamp[:10])
            if "T" in stamp:
                datetime.fromisoformat(stamp.replace("Z", "+00:00"))
        except ValueError as exc:
            raise ValueError(f"{source_id}: invalid verified_at {stamp}") from exc


def build_content():
    index = load_json(INDEX_PATH)
    all_claims = load_json(CLAIMS_PATH).get("claims", {})
    all_sources = load_json(SOURCES_PATH).get("sources", {})

    entries = [
        entry for entry in index.get("entries", [])
        if entry.get("decision_driving") is True
        and entry.get("claim_kind") != "INTERNAL_NORMATIVE"
    ]
    claim_ids = sorted({entry["claim_id"] for entry in entries})
    source_ids = sorted({
        source_id
        for entry in entries
        for source_id in entry.get("source_ids", [])
    })

    claims = {claim_id: all_claims[claim_id] for claim_id in claim_ids}
    sources = {source_id: all_sources[source_id] for source_id in source_ids}
    validate_verified_dates(sources)
    meta = {
        "version": "1.0.0",
        "generatedFrom": [
            "wiki/generated/retrieval-index.json",
            "wiki/claims.json",
            "wiki/source-registry.json",
        ],
        "policy": "decision_driving=true and claim_kind!=INTERNAL_NORMATIVE; runtime admissibility is re-evaluated for freshness/authority/scope",
    }

    return (
        "// GENERATED FILE — DO NOT EDIT BY HAND.\n"
        "// Run: python scripts/build_platform_external_knowledge_bundle.py\n"
        f"export const CANONICAL_EXTERNAL_KNOWLEDGE_META = Object.freeze({js_json(meta)});\n"
        f"export const CANONICAL_EXTERNAL_RETRIEVAL_ENTRIES = Object.freeze({js_json(entries)});\n"
        f"export const CANONICAL_EXTERNAL_KNOWLEDGE_CLAIMS = Object.freeze({js_json(claims)});\n"
        f"export const CANONICAL_EXTERNAL_SOURCE_REGISTRY = Object.freeze({js_json(sources)});\n"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if committed bundle is stale")
    args = parser.parse_args()
    expected = build_content()

    if args.check:
        actual = OUTPUT_PATH.read_text(encoding="utf-8") if OUTPUT_PATH.exists() else ""
        if actual != expected:
            raise SystemExit(
                "Runtime external knowledge bundle is stale. "
                "Run python scripts/build_platform_external_knowledge_bundle.py"
            )
        print("Runtime external knowledge bundle is in sync.")
        return

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(expected, encoding="utf-8")
    print(f"Generated runtime external knowledge bundle -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
