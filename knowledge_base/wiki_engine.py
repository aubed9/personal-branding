# -*- coding: utf-8 -*-
"""Compatibility adapter for the canonical authored root wiki/ tree."""
import os
import glob
import re
import sys

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIKI_DIR = os.path.join(ROOT_DIR, "wiki")


def get_all_wiki_articles():
    articles = {}
    files = glob.glob(os.path.join(WIKI_DIR, "**", "*.md"), recursive=True)
    for f in files:
        rel = os.path.relpath(f, ROOT_DIR).replace("\\", "/")
        if rel in {"wiki/INDEX.md", "wiki/README.md"}:
            continue
        with open(f, "r", encoding="utf-8") as fp:
            articles[rel] = fp.read()
    return articles


def search_wiki(query, top_n=2):
    articles = get_all_wiki_articles()
    results = []
    tokens = [t.lower() for t in re.findall(r"\w+", query) if len(t) > 2]

    for path, text in articles.items():
        score = sum(text.lower().count(token) for token in tokens)
        if score > 0:
            results.append((score, path, text))

    results.sort(key=lambda x: (-x[0], x[1]))
    return results[:top_n]


if __name__ == "__main__":
    articles = get_all_wiki_articles()
    print(f"Loaded {len(articles)} canonical root-Wiki articles.")
    res = search_wiki("قیمت گذاری و مدل درآمدی")
    for score, name, _txt in res:
        print(f"Match: {name} (score: {score})")
