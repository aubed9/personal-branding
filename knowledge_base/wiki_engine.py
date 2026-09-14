# -*- coding: utf-8 -*-
import os
import glob
import re
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

WIKI_DIR = os.path.dirname(os.path.abspath(__file__)) + '/wiki'

def get_all_wiki_articles():
    articles = {}
    files = glob.glob(os.path.join(WIKI_DIR, '*.md'))
    for f in files:
        fname = os.path.basename(f)
        with open(f, 'r', encoding='utf-8') as fp:
            articles[fname] = fp.read()
    return articles

def search_wiki(query, top_n=2):
    articles = get_all_wiki_articles()
    results = []
    tokens = [t.lower() for t in re.findall(r'\w+', query) if len(t) > 2]
    
    for fname, text in articles.items():
        score = sum(text.lower().count(token) for token in tokens)
        if score > 0:
            results.append((score, fname, text))
            
    results.sort(key=lambda x: x[0], reverse=True)
    return results[:top_n]

if __name__ == '__main__':
    articles = get_all_wiki_articles()
    print(f'Loaded {len(articles)} wiki articles.')
    res = search_wiki('قیمت گذاری و مدل درآمدی')
    for score, name, txt in res:
        print(f'Match: {name} (score: {score})')
