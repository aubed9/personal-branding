# 01: Conversational Persian Financial Parser & Multiplier Expansion

**What to build:**
A deterministic entity extraction module in `semanticParser.js` that extracts Persian currency amounts (`TOMAN`, `IRR`), multiplier words (`هزار`, `میلیون`, `میلیارد`, `همت`), and operational cost/price slots (`unitPrice`, `variableCost`, `monthlyFixedCost`, `monthlyCapacity`) from conversational Persian text, returning a structured proposal with a natural Persian summary string.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] Add `extractProposedFinancials(text)` function in `platform/src/services/semanticParser.js`.
- [x] Support Persian and Arabic digit normalization to ASCII.
- [x] Correctly compute multipliers (`هزار` x1000, `میلیون` x1,000,000, `میلیارد` x1,000,000,000, `همت` x1,000,000,000,000).
- [x] Integrate into `parseSemanticInput()` as `proposedFinancials`.
- [x] Add comprehensive unit tests in a dedicated test suite (`test_conversational_financial_and_html_export.js`).
