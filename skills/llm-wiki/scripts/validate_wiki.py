# -*- coding: utf-8 -*-
import os
import sys
import re
import glob

def validate_wiki(wiki_dir):
    pages_dir = os.path.join(wiki_dir, "wiki", "pages")
    if not os.path.exists(pages_dir):
        pages_dir = os.path.join(wiki_dir, "pages")
    if not os.path.exists(pages_dir):
        pages_dir = wiki_dir

    files = glob.glob(os.path.join(pages_dir, "*.md"))
    print(f"Validating {len(files)} markdown pages in {pages_dir}...")
    errors = 0

    for f in files:
        fname = os.path.basename(f)
        with open(f, "r", encoding="utf-8") as fp:
            content = fp.read()
        
        # Check YAML frontmatter
        if not content.startswith("---"):
            print(f"WARN: Missing frontmatter start in {fname}")
            errors += 1
            continue
        parts = content.split("---", 2)
        if len(parts) < 3:
            print(f"WARN: Malformed frontmatter in {fname}")
            errors += 1
            continue
        
        fm = parts[1]
        for required in ["title", "type", "tags", "sources", "updated"]:
            if required not in fm:
                print(f"WARN: Missing '{required}' field in {fname}")
                errors += 1

    if errors == 0:
        print("PASS: All pages conform to frontmatter schema!")
    else:
        print(f"COMPLETED: Found {errors} warnings/errors.")

if __name__ == "__main__":
    wdir = sys.argv[1] if len(sys.argv) > 1 else "."
    validate_wiki(wdir)
