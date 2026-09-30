#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Unit tests for canonical Wiki integrity, admissibility, and source provenance."""
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "wiki" / "source-registry.json"
CLAIM_PATH = ROOT / "wiki" / "claims.json"
INDEX_PATH = ROOT / "wiki" / "generated" / "retrieval-index.json"
REGISTRY_PATH = ROOT / "wiki" / "registry.yaml"

ADMISSIBLE = {"VERIFIED", "CANONICAL"}


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


class TestWikiIntegrity(unittest.TestCase):
    def setUp(self):
        self.sources = load_json(SOURCE_PATH).get("sources", {})
        self.claims = load_json(CLAIM_PATH).get("claims", {})
        self.index = load_json(INDEX_PATH).get("entries", [])

    def test_sources_exist_and_have_required_fields(self):
        """Every source record must have ID, status, and authority tier."""
        self.assertGreater(len(self.sources), 0, "Source registry must not be empty")
        for s_id, source in self.sources.items():
            self.assertEqual(s_id, source.get("id"), f"Source ID mismatch in record {s_id}")
            self.assertIn("status", source, f"Source {s_id} missing status")
            self.assertIn("authority_tier", source, f"Source {s_id} missing authority_tier")
            self.assertIn(source["authority_tier"], ["A", "B", "C", "D"], f"Invalid tier for {s_id}")

    def test_claims_have_valid_source_traceability(self):
        """Every claim in claims.json must point to existing source records."""
        self.assertGreater(len(self.claims), 0, "Claims registry must not be empty")
        for c_id, claim in self.claims.items():
            source_ids = claim.get("source_ids", [])
            self.assertTrue(len(source_ids) > 0, f"Claim {c_id} has no source_ids")
            for s_id in source_ids:
                self.assertIn(s_id, self.sources, f"Claim {c_id} references non-existent source {s_id}")

    def test_retrieval_index_admissibility(self):
        """Generated retrieval index must only contain admissible claims and sources."""
        self.assertGreater(len(self.index), 0, "Retrieval index must not be empty")
        for entry in self.index:
            claim_id = entry["claim_id"]
            self.assertIn(claim_id, self.claims, f"Indexed claim {claim_id} missing from claims.json")
            claim = self.claims[claim_id]
            self.assertIn(claim.get("status"), ADMISSIBLE, f"Indexed claim {claim_id} is not admissible")
            for s_id in claim.get("source_ids", []):
                source = self.sources.get(s_id)
                self.assertIsNotNone(source, f"Indexed claim {claim_id} source {s_id} missing")
                self.assertIn(source.get("status"), ADMISSIBLE, f"Indexed claim {claim_id} source {s_id} not admissible")

    def test_future_verification_date_rejected(self):
        """Sources verified in the future relative to evaluation cannot be accepted."""
        for s_id, source in self.sources.items():
            verified_at = source.get("verified_at")
            if verified_at and verified_at > "2026-09-30":
                # Any source verified after current time cannot be marked CANONICAL or VERIFIED without rejection
                self.assertNotIn(source.get("status"), ADMISSIBLE, f"Future verified source {s_id} is marked admissible")

    def test_no_fabricated_knowledge_nodes(self):
        """Every indexed claim must have a valid knowledge_node_id."""
        for entry in self.index:
            kn_id = entry.get("knowledge_node_id")
            self.assertTrue(bool(kn_id), f"Entry {entry.get('retrieval_id')} has empty knowledge_node_id")
            self.assertTrue(kn_id.startswith("KB-"), f"Invalid knowledge_node_id format: {kn_id}")


if __name__ == "__main__":
    unittest.main()
