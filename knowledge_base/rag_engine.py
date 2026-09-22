# -*- coding: utf-8 -*-
"""Compatibility adapter for canonical root-Wiki retrieval.

The historical knowledge_base/rag_chunks.json is migration input only and is
never loaded by this runtime.
"""
import json
import os
import re
import sys

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_FILE = os.path.join(ROOT_DIR, "wiki", "generated", "retrieval-index.json")


def load_chunks():
    if not os.path.exists(INDEX_FILE):
        return []
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        payload = json.load(f)
    return payload.get("entries", [])


def _phase_matches(chunk, phase):
    if phase in (None, "", "master"):
        return True
    try:
        phase_num = int(str(phase).replace("phase", "").strip())
    except Exception:
        return False
    return phase_num in chunk.get("phases", [])


def search_knowledge(query, phase=None, top_k=5, module_ids=None, jurisdiction=None):
    chunks = load_chunks()
    tokens = [t for t in re.findall(r"\w+", str(query).lower()) if len(t) > 1]
    requested_modules = set(module_ids or [])
    results = []

    for chunk in chunks:
        if chunk.get("status") not in {"VERIFIED", "CANONICAL"}:
            continue
        if not _phase_matches(chunk, phase):
            continue
        if requested_modules and not requested_modules.intersection(chunk.get("module_ids", [])):
            continue
        scope = chunk.get("jurisdiction_or_scope")
        if jurisdiction and scope not in {jurisdiction, "GENERAL", "PRODUCT_INTERNAL"}:
            continue

        text = " ".join([
            chunk.get("content", ""),
            chunk.get("knowledge_node_id", ""),
            " ".join(chunk.get("module_ids", [])),
            " ".join(chunk.get("decision_node_ids", [])),
        ]).lower()
        score = sum(text.count(token) for token in tokens)
        if requested_modules:
            score += 10 * len(requested_modules.intersection(chunk.get("module_ids", [])))
        if score > 0 or requested_modules:
            results.append((score, chunk))

    results.sort(key=lambda item: (-item[0], item[1].get("retrieval_id", "")))
    return [item[1] for item in results[:top_k]]


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "decision evidence"
    print(f"Canonical RAG Search Query: {q}")
    for r in search_knowledge(q):
        print(f"- [{r['claim_id']}] node={r['knowledge_node_id']} sources={','.join(r['source_ids'])}")
