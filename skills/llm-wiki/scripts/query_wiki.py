# -*- coding: utf-8 -*-
import os
import sys
import re
import glob

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def search_wiki(wiki_dir, query, top_k=5):
    pages_dir = os.path.join(wiki_dir, "wiki", "pages")
    if not os.path.exists(pages_dir):
        pages_dir = os.path.join(wiki_dir, "pages")
    if not os.path.exists(pages_dir):
        pages_dir = wiki_dir

    tokens = [t.lower() for t in re.findall(r'\w+', query) if len(t) > 1]
    files = glob.glob(os.path.join(pages_dir, "*.md"))
    results = []

    for f in files:
        fname = os.path.basename(f)
        try:
            with open(f, "r", encoding="utf-8") as fp:
                text = fp.read()
            score = 0
            text_lower = text.lower()
            for token in tokens:
                if token in text_lower:
                    score += text_lower.count(token)
                    if token in fname.lower():
                        score += 5
            if score > 0:
                results.append((score, fname, text[:300].replace('\n', ' ')))
        except Exception:
            continue

    results.sort(key=lambda x: x[0], reverse=True)
    return results[:top_k]

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python query_wiki.py <wiki_directory> <query>")
        sys.exit(1)
    wdir = sys.argv[1]
    q = " ".join(sys.argv[2:])
    print(f"Searching in {wdir} for: {q}")
    matches = search_wiki(wdir, q)
    for score, name, snippet in matches:
        print(f"[{score}] {name} :: {snippet}...")
