Type: prototype
Status: resolved
Blocked by: none

# Issue 02: Client Consulting Deliverable Formats & Interactive Report Viewer

## Question

What visual presentation and export architecture should be adopted so brand consulting deliverables are presentation-ready for high-value paying clients?

## Answer

### Built Prototype & Export Architecture Decision

A standalone, zero-dependency Persian RTL executive report prototype has been crafted and verified:
- **Asset Link**: [`deliverables/prototype_client_report.html`](file:///d:/personal%20branding/deliverables/prototype_client_report.html)

### Standard Deliverable Specification:
1. **Multi-Format Export Suite**:
   - **Format 1 (Interactive Offline HTML)**: Single-file bundle containing embedded CSS, typography, and responsive layouts. Client can double-click and open in Chrome/Edge/Safari with zero setup.
   - **Format 2 (Print-Ready PDF via `@media print`)**: Instant generation via `Ctrl+P` with page break handling, clean margins, and professional header/footer.
   - **Format 3 (Raw Markdown + JSON Ledger)**: For developers and data portability (`project-state.json`).
2. **Evidence Visual Badging**:
   - Every claim in the client document is prominently tagged with evidence class badges: `FACT` (آبی), `DECISION` (سبز), `CALCULATION` (کهربایی), and `HYPOTHESIS` (بنفش).
3. **Executive Financial Summary**:
   - Embedded top-level cards for Unit Price, Variable Cost, Contribution Margin, and Break-Even Sales target.
