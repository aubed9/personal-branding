# Specification: DIGITAL MARKET Commercial Release & Client Delivery Machine

**Status**: Approved & Ready for Implementation  
**Effort**: `digital-market-rollout`  
**Derived from Wayfinder Map**: [`.scratch/digital-market-rollout/map.md`](file:///d:/personal%20branding/.scratch/digital-market-rollout/map.md)

---

## 1. Executive Summary

This specification consolidates the architectural decisions resolved through the Wayfinder planning map for the **DIGITAL MARKET** brand building platform. The system transitions from an experimental research prototype to an authoritative, commercially deployable brand consulting machine adapted to the Iranian business landscape.

---

## 2. Core Architecture Specifications

### 2.1. Live AI Key Governance & Deployment Security (Decision 01)
- **Zero-Key Offline Default**: The core application, all 8 phase workflows, 15-axis classifier, dynamic chained questions, and unit economics math run 100% locally in the browser with zero API key requirement.
- **Session BYOK**: Live Gemini AI question rewrites and explanations use an ephemeral in-memory / `sessionStorage` key provided via the Settings modal.
- **Data Export Scrubbing**: All export mechanisms (`exportProjectJSON`, HTML download) actively scrub and exclude any API credentials or session tokens.
- **Enterprise Proxy Endpoint**: An optional `CustomEndpointProvider` points to `/api/v1/ai/rewrite` for server-managed rate-limited AI generation.

### 2.2. Client-Ready Consulting Deliverable Suite (Decision 02)
- **Interactive Offline HTML (`.html`)**: Single-file, zero-dependency client deliverable viewable in any browser. Built on standard CSS grid, Persian typography (Vazirmatn), and responsive containers.
- **Print / PDF Engine (`@media print`)**: Instant high-fidelity PDF output via `Ctrl+P` with page break handling, cover page styling, and crisp tabular layouts.
- **Evidence Badging**: Mandatory visible labels (`FACT`, `DECISION`, `CALCULATION`, `HYPOTHESIS`) on all consulting claims to guarantee intellectual honesty and prevent hallucination.
- **Prototype Reference**: Verified in [`deliverables/prototype_client_report.html`](file:///d:/personal%20branding/deliverables/prototype_client_report.html).

### 2.3. Conversational Financial Parsing & Confirmation Gate (Decision 03)
- **Persian Multipliers**: Deterministic expansion of Persian/Arabic numerals with `هزار` ($10^3$), `میلیون` ($10^6$), `میلیارد` ($10^9$), and `همت` ($10^{12}$).
- **Target Slots**: Regex mapping for `fixedCostMonthly`, `unitPrice`, `unitVariableCost`, `monthlyCapacity`, and `monthlySalesUnits`.
- **Zero-Silent-Guessing Gate**: Extracted numbers are never directly injected into state. An interactive confirmation toast must be explicitly accepted by the user before running mathematical formulas.

### 2.4. 753-Guild National Taxonomy Certification (Decision 04)
- **Complete Verification**: All 753 business taxonomy entries (`BT-0001` to `BT-0753`) across 31 macro industries (`IND-01` to `IND-31`) verified with 0 invalid codes, 0 collisions, and 100% populated 15-axis context profiles.
- **Guild Code Display**: Iranian ISIC guild codes (`iranianGuildCode`) are displayed alongside business titles in client headers to ensure national guild authority.

---

## 3. Verification & Acceptance Criteria

1. **Test Suite Zero Regression**:
   - `npm.cmd test` passes 100% (131/131 suites and tests passing).
   - `validate_system.py` passes schema and article link validation.
2. **Production Bundle Verification**:
   - `npm.cmd run build` completes cleanly with chunking under 1.5MB gzip.
3. **Artifact Integrity**:
   - All Wayfinder map links and issue tickets are closed, validated, and persisted.
