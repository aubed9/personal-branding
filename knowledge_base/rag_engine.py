import json
import os
import re
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

KB_FILE = os.path.join(os.path.dirname(__file__), "rag_chunks.json")

def load_chunks():
    if not os.path.exists(KB_FILE):
        return []
    with open(KB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def search_knowledge(query, phase=None, top_k=5):
    chunks = load_chunks()
    tokens = re.findall(r"\w+", query.lower())
    results = []
    for chunk in chunks:
        if phase and chunk.get("phase") not in [phase, "master"]:
            continue
        score = 0
        text = (chunk["title"] + " " + " ".join(chunk.get("tags", [])) + " " + chunk["content"]).lower()
        for token in tokens:
            if token in text:
                score += text.count(token)
                if token in chunk["title"].lower():
                    score += 5
                if token in [t.lower() for t in chunk.get("tags", [])]:
                    score += 3
        if score > 0:
            results.append((score, chunk))
    results.sort(key=lambda x: x[0], reverse=True)
    return [r[1] for r in results[:top_k]]

if __name__ == "__main__":
    import sys
    q = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "deliverable"
    print(f"RAG Search Query: {q}")
    for r in search_knowledge(q):
        print(f"- [{r['id']}] {r['title']}")
