Type: grilling
Status: resolved
Blocked by: none

# Issue 05: Iranian Macroeconomic Sources Architecture & Deterministic Ingestion

## Question

How should live and periodic Iranian macroeconomic and platform data sources (SCI CPI inflation figures, CBI monetary indicators, Shaparak transaction reports, Digikala / Snapp first-party reports, and statutory gazettes) be ingested, versioned, and integrated into the canonical Wiki knowledge plane and Phase 1 unit economics without violating the offline-deterministic execution guarantee, evidence tiering, and freshness contracts?

## Answer

### Locked Strategic Decision: 4-Pillar Source Ingestion Architecture

We lock the following deterministic ingestion and provenance policy across the DIGITAL MARKET knowledge plane:

1. **Source-First Cryptographic Provenance (Evidence Plane Separation)**
   - External data can never directly mutate runtime unit economics or dynamic question logic.
   - Every economic datum must first be admitted to `wiki/source-registry.json` with an explicit authority tier (`Tier A` for official state statistics like SCI and CBI, `Tier B` for academic literature, `Tier C` for verified first-party platform reports), verifiable locator, and immutable checksum (`git-blob` or SHA-256).
   - If an official report is unverified or lacks a reproducible bulletin URL (e.g., `SRC-IR-CBI-CPI-1405-05`), it must remain in `NEEDS_RESEARCH` status and be strictly barred from runtime retrieval ranking.

2. **Offline Deterministic Compilation (`canonicalExternalKnowledge.generated.js`)**
   - Live browser execution operates under a strict **Zero-Network Requirement**. The client app must never perform asynchronous HTTP scraping against Iranian government or platform endpoints at runtime.
   - All admissible verified claims are compiled offline during build time via `python scripts/build_platform_external_knowledge_bundle.py` into a frozen, zero-dependency ES module bundle.
   - This prevents runtime network flakiness, CORS blocks, national intranet (سایت‌های داخلی/فیلترینگ) anomalies, or breaking schema drift during client sessions.

3. **Freshness Contract & Degradation Gates (`max_age_days`)**
   - High-volatility macroeconomic sources carry an explicit expiration threshold (`max_age_days: 90` to `365`).
   - If a source exceeds its freshness window relative to the project's evaluation timestamp (`as_of_date`), the engine does not guess or interpolate synthetic figures. Instead, it surfaces a transparent advisory badge (`STALE_EVIDENCE_WARNING`), prompts the consultant to confirm contemporary shop-floor numbers, and gracefully falls back to local user-provided empirical cost data.

4. **Founder Reality Override Gate (Phase 1 Unit Economics)**
   - Macroeconomic inflation rates (e.g. SCI 89% YoY CPI) provide the contextual baseline and cautionary bounds.
   - When the business founder inputs actual measured purchase costs, supplier invoices, or local markup margins, the founder-provided evidence supersedes the macro baseline for that specific business, badged visibly as `USER_SUPPLIED_EVIDENCE`.
