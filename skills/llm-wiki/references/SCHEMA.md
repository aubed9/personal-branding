# SCHEMA.md

lang: en
citation_format: apa
page_types:
  - index
  - source-index
  - topic
  - concept
  - chunk
  - relations
  - query
  - lint
  - overview
  - log

frontmatter_required_fields:
  - title
  - type
  - tags
  - sources
  - updated
  - status

citation_rules:
  use_chunks: "[[chunk-slug-id]]"
  use_sources: "[[source-slug]]"
  locators:
    page: "p.N"
    section: "§section"
  example: "[[marketing-research-journal-2023]] p.42" or "[[consumer-behavior-theory]] §2.3"

ai_synthesis:
  notation: "> [AI-SYNTHESIS]:"
  rule: "AI synthesis content must appear ONLY in blocks prefixed with this notation"
