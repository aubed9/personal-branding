---
name: digital-market-business-context-router
version: 1.0.0
layer: "Cross-Phase — Business Type, Model & Context Specialization"
role: "Business Context Router & Adaptive Specialization Layer"
language: en
customer_output_language: fa
status: production-spec
description: >-
  Cross-phase context-routing skill for DIGITAL MARKET. It identifies the user's
  business context across multiple independent dimensions instead of forcing one
  simplistic business-type label, activates the correct business-model, channel,
  maturity, scale, sector, regulation, geography, and founder/personal-brand
  overlays, and produces a reusable Business Context Profile plus phase-specific
  adaptation instructions for Phases 1–8. It makes questions, explanations,
  research priorities, metrics, examples, risks, and deliverables specific to the
  actual business while preserving the existing phase order, evidence rules,
  decision traceability, beginner-friendly Persian communication, and phase
  boundaries of the DIGITAL MARKET system.
---

# DIGITAL MARKET — Business Context Router & Adaptive Specialization Skill

# 1. Skill Metadata

**Name:**  
`digital-market-business-context-router`

**Layer:**  
`Cross-Phase — Business Type, Model & Context Specialization`

**Version:**  
`1.0.0`

**Primary Role:**  
`Business Context Router & Adaptive Specialization Layer`

**Primary Customer-Facing Output:**  
`Business Context Profile & Phase Adaptation Pack` (شناسنامه بافتار کسب‌وکار و بسته تطبیق فازها)

**Output Language:**  
Persian (Farsi)

**Audience:**  
Business owners, founders, managers, executives, local shop owners, online sellers,
service businesses, startups, scaleups, enterprises, manufacturers, marketplaces,
platform businesses, founder-led brands, and beginners who need the DIGITAL MARKET
workflow to adapt to the realities of their specific business.

---

# 2. Why This Skill Exists

The DIGITAL MARKET phase skills already contain many useful adaptations for:
- business maturity
- B2B and B2C
- local business
- marketplace / platform
- export
- regulated categories
- founder-led and personal brands
- existing brands and new brands

However, those rules were previously distributed across multiple individual phases.
This skill centralizes the routing logic so that the system knows **which adaptation
rules should be active before asking the user questions or generating phase work.**

---

# 3. Core Problem

A user may say:
> من یک آنلاین‌شاپ هستم.
Another may say:
> من یک استارتاپ هستم.
Another may say:
> من یک شرکت بزرگ B2B هستم که هم فروش حضوری دارد هم آنلاین.

These answers do not describe the same dimension:
- `Online shop` primarily describes channel / transaction behavior.
- `Startup` primarily describes maturity, uncertainty, and organizational stage.
- `Large company` primarily describes scale and governance complexity.
- `B2B` primarily describes customer and buying structure.

The system must therefore **not force all businesses into one flat mutually-exclusive list.**

---

# 4. Core Principle

> **Classify the business on multiple independent dimensions, then combine the active dimensions into one specialized operating context.**

```text
BUSINESS ARCHETYPE
+
CUSTOMER MODEL
+
OFFER TYPE
+
TRANSACTION / CHANNEL MODEL
+
REVENUE MODEL
+
MATURITY
+
SCALE
+
SALES MOTION
+
GEOGRAPHY
+
SECTOR / CATEGORY
+
REGULATION / TRUST LEVEL
+
BRAND ARCHITECTURE
+
FOUNDER / PERSONAL-BRAND ROLE
=
BUSINESS CONTEXT PROFILE
```

---

# 5. Mission

The mission of this skill is to move the system from:
> “We know the user has a business.” or “We selected a generic business type.”
into:
> “We understand the operating shape of this business well enough to ask the right
> questions, explain the right concepts, research the right evidence, use the right
> metrics, identify the right risks, and adapt every later brand phase without
> changing the fundamental DIGITAL MARKET workflow.”

---

# 6. Position in the DIGITAL MARKET Workflow

This skill is **not a new strategic phase that replaces Phase 1.** It is a routing layer.

```text
START / RESUME PROJECT
↓
LOAD EXISTING PROJECT CONTEXT
↓
RUN BUSINESS CONTEXT ROUTER
↓
CREATE / UPDATE BUSINESS CONTEXT PROFILE
↓
ACTIVATE RELEVANT OVERLAYS
↓
PASS ADAPTATION PACK TO CURRENT PHASE
↓
PHASE 1 → PHASE 2 → PHASE 3 → PHASE 4 → PHASE 5 → PHASE 6 → PHASE 7 → PHASE 8
↓
RE-RUN ROUTER ONLY IF MATERIAL BUSINESS CONTEXT CHANGES
```

---

# 7. Relationship to the Master Orchestrator

The Master Orchestrator remains responsible for:
- phase sequence
- phase readiness
- gates
- handoffs
- blockers
- re-entry
- decision traceability
- workflow state

This skill is responsible for:
- context classification
- context-specific branching
- question specialization
- research specialization
- KPI / metric specialization
- concept/example specialization
- sector risk specialization
- phase focus specialization

The router must **never bypass an upstream decision requirement.**

---

# 8. Relationship to Specialist Phase Skills

The router MUST NOT replace specialist phase skills.
It produces adaptation instructions such as:

```yaml
phase_2_adaptation:
  emphasize:
    - local_search_behavior
    - catchment_area
    - local_competitors
    - repeat_purchase
  de_emphasize:
    - national_market_sizing
  add_metrics:
    - foot_traffic
    - store_conversion
    - average_basket
  conditional_research:
    - parking_access
    - local_seasonality
```

The Phase 2 skill still performs the research.

---

# 9. Required Final Deliverable

The skill must generate and maintain:
# `Business Context Profile & Phase Adaptation Pack`
It has two layers:
1. **Customer-facing Persian summary** (خلاصه مدیریتی بافتار کسب‌وکار به زبان ساده فارسی)
2. **Machine-readable internal routing state** (پیکربندی ساخت‌یافته متغیرها و اورلی‌ها به فرمت YAML)

---

# 10. Critical Language Requirement

All customer-facing content MUST be in Persian unless the user explicitly requests another language.
This includes:
- business-type selection
- clarifying questions
- concept explanations
- summaries
- warnings
- active-route explanation
- recommendations
- phase-specific guidance
- uncertainty notes

Technical IDs and machine-readable enums may remain in English.

---

# 11. Multi-Axis Classification Model (15 Independent Axes)

```text
A. PRIMARY BUSINESS ARCHETYPE (20 Archetypes)
B. CUSTOMER MODEL (B2C, B2B, B2B2C, B2G, TWO_SIDED, MULTI_STAKEHOLDER)
C. OFFER TYPE (PHYSICAL, DIGITAL, SERVICE, SOFTWARE, SUBSCRIPTION, PROJECT, EXPERIENCE, ...)
D. CHANNEL / TRANSACTION MODEL (PHYSICAL_FIRST, ONLINE_FIRST, HYBRID, OMNICHANNEL, ...)
E. REVENUE MODEL (ONE_TIME, REPEAT, SUBSCRIPTION, USAGE, RETAINER, COMMISSION, TAKE_RATE, ...)
F. BUSINESS MATURITY (IDEA, VALIDATION, PRE_LAUNCH, EARLY_ACTIVE, ESTABLISHED, GROWTH, SCALEUP, ...)
G. ORGANIZATIONAL SCALE (SOLO, MICRO, SMALL, MEDIUM, LARGE, ENTERPRISE, GROUP_HOLDING)
H. SALES MOTION (SELF_SERVE, ASSISTED, INBOUND, OUTBOUND, FIELD, ENTERPRISE, ...)
I. DELIVERY / FULFILLMENT MODEL (IN_STORE, LOCAL_DELIVERY, SHIPPING, DIGITAL, REMOTE, ...)
J. GEOGRAPHIC SCOPE (NEIGHBORHOOD, CITY, PROVINCE, NATIONAL, MULTI_COUNTRY, GLOBAL)
K. INDUSTRY / CATEGORY (with maturity, trust codes, and regulatory notes)
L. REGULATION / TRUST SENSITIVITY (LOW, NORMAL, HIGH_TRUST, REGULATED, HIGHLY_REGULATED)
M. BRAND ARCHITECTURE (SINGLE, FOUNDER_NAMED, MASTERBRAND, SUB_BRAND, HOUSE_OF_BRANDS)
N. FOUNDER / PERSONAL-BRAND ROLE (NOT_PUBLIC, SUPPORTING, FOUNDER_LED, EXECUTIVE_LED, PERSONAL_PRIMARY, DUAL)
O. GROWTH / CHANGE CONTEXT (NEW_LAUNCH, FIRST_CUSTOMERS, SCALE, REBRAND, FUNDRAISING, ...)
```

---

# 12. Active Overlays System

The router dynamically activates specific overlay packs:
1. `LOCAL_RETAIL`: Catchment area, foot traffic, Google Maps visibility, inventory turnover.
2. `ECOMMERCE_DTC`: CAC, ROAS, checkout completion, cart abandonment, shipping/returns.
3. `LOCAL_SERVICE`: Booking rate, show rate, capacity utilization, review score, local trust.
4. `RESTAURANT_CAFE_HOSPITALITY`: Table turn, covers, food cost %, peak capacity, delivery mix.
5. `PROFESSIONAL_SERVICE`: Qualified leads, win rate, sales cycle, utilization, retainer share.
6. `B2B_SERVICE`: Buying committee, pipeline value, ACV, ROI proof, implementation friction.
7. `SAAS_SOFTWARE`: MRR/ARR, activation rate, logo/revenue churn, NRR, CAC payback, LTV.
8. `MARKETPLACE`: GMV, take rate, liquidity, match rate, supply/demand acquisition balance.
9. `DIGITAL_PLATFORM`: Engagement loops, network density, API ecosystem, multi-sided trust.
10. `MANUFACTURER`: Production capacity, yield, defect rate, MOQ, working capital, certifications.
11. `WHOLESALE_DISTRIBUTION`: Account coverage, fill rate, receivables days, distributor margin.
12. `FRANCHISE_MULTI_BRANCH`: Same-store sales, branch margin, operating compliance, central governance.
13. `IMPORT_EXPORT`: Landed cost, customs, currency risk, distributor margin, localized proof.
14. `CREATOR_MEDIA_EDUCATION`: Owned audience, free-to-paid journey, completion rate, community.
15. `REAL_ESTATE_CONSTRUCTION`: Deal value, visit rate, broker share, legal verification, absorption.
16. `HEALTH_BEAUTY_WELLNESS`: Safety, claims proof, regulatory limits, ingredients, consultation.
17. `FINANCIAL_SERVICE`: Compliance, risk disclosure, security, fiduciary trust, prohibited claims.
18. `OTHER`: Custom multi-axis configuration.

Maturity & Scale Overlays:
- `STARTUP / MVP`: Heavy validation, assumptions testing, problem proof, low-burden metrics.
- `MICRO BUSINESS`: Direct practical focus, no corporate theater.
- `SCALEUP`: Unit economics, retention cohorts, bottleneck relief, operational scaling.
- `ENTERPRISE`: Multi-stakeholder alignment, portfolio governance, first-party data audits.

Category & Context Overlays:
- `REGULATED_CATEGORY`: Actuates Regulatory Feasibility Gate and legal boundaries.
- `PERSONAL_BRAND / FOUNDER_LED`: Business job of personal brand, stakeholder architecture, voice matrix, and founder dependency assessment.

---

# 13. Phase Adaptation Contracts (Phases 1 to 8)

- **Phase 1 Contract:** Specializes discovery questions, filters irrelevant questions, injects known facts, seeds operational realities.
- **Phase 2 Contract:** Focuses research scope (local vs national vs global), specifies competitor classes, sets target audience research dimensions.
- **Phase 3 Contract:** Enforces Business Model Fit Gate (positioning must fit unit economics and operational capacity), configures stakeholder value props.
- **Phase 4 Contract:** Suggests archetype candidates, defines authentic personality boundaries, matches tone with trust level.
- **Phase 5 Contract:** Aligns elevator hook and CTA with sales motion (Buy Now vs Book Demo vs In-store Visit), enforces claim safety and prohibited terms.
- **Phase 6 Contract:** Shapes naming territories according to brand architecture, expansion goals, linguistic usability, and preliminary legal safety.
- **Phase 7 Contract:** Adapts visual identity design brief (corporate prestige vs local friendly vs tech minimal).
- **Phase 8 Contract:** Adapts thought leadership POV, PR channels, SEO/GEO targets, and commercial funnel according to scale and founder visibility.

---


## 13.1 Archetype-Specific Operational Directives
- **For Micro Local Services (e.g. Car Wash, Oil Change):**
  - Phase 1: Focus on bay capacity, daily vehicle throughput, local rent, chemical costs, immediate cash needs.
  - Phase 2: Local 3km radius competitor audit, Google Maps & Balad ranking, trust factors with vehicle owners.
  - Phase 3: Only-ness based on speed, damage-free guarantee, honest pricing, zero hidden costs.
  - Phase 4: Archetype: Everyman / Caregiver (Reliable Neighbor & Honest Technician).
  - Phase 5: Clear service hook, transparent pricing menu, zero technical intimidation.
  - Phase 6: Accessible, memorable local name with clear signage and neighborhood recall.
  - Phase 7: High-visibility outdoor signage, bay wayfinding, clean branded uniforms, vehicle handover checklist.
  - Phase 8: Local SMS marketing, technician training, neighborhood VIP fleet contracts, local reputation management.
- **For Physical Hospitality/Retail (e.g. Specialty Coffee Shop & Roastery):**
  - Phase 1: Seating turnover, coffee bean wholesale vs cup retail, barista wages, aesthetic capital.
  - Phase 2: Neighborhood cafe culture, third-wave connoisseur vs student/worker personas, sensory benchmarks.
  - Phase 3: Positioning around origin roasting transparency, hospitality ritual, community vibe.
  - Phase 4: Archetype: Creator / Explorer (Sensory Artisan & Welcoming Host).
  - Phase 5: Evocative sensory vocabulary, origin storytelling, brewing guide notes.
  - Phase 6: Poetic, evocative name reflecting origin, aroma, or neighborhood heritage.
  - Phase 7: Earthy/warm palette, tactile packaging, cup stamps, cafe interior design language.
  - Phase 8: Instagram visual storytelling, barista masterclasses, local event sponsorships, coffee club CRM.
- **For B2B Cloud Software / SaaS:**
  - Phase 1: Runway, CAC, LTV, self-serve vs enterprise demo, cloud hosting overhead, compliance.
  - Phase 2: Domestic vs foreign alternatives, software feature comparison matrix, migration switching friction.
  - Phase 3: Positioning on time-to-value, seamless local tax compliance (Moadian), zero-installation web cloud.
  - Phase 4: Archetype: Sage / Magician (Intelligent Automator & Trusted Advisor).
  - Phase 5: Benefit-driven feature framing, ROI calculators, developer & CFO tailored elevator hooks.
  - Phase 6: Clean, modern, international phonetic name with available .ir / .com domains.
  - Phase 7: Modern UI design system, digital design tokens, responsive dashboard themes, collateral.
  - Phase 8: Product-led growth, automated onboarding funnels, B2B webinar thought leadership, SEO domination.
- **For Heavy Industrial Manufacturing / B2B:**
  - Phase 1: Machine tonnage, tooling turnaround, minimum order quantity (MOQ), scrap rates, working capital.
  - Phase 2: OEM tier-1/tier-2 ecosystem, tender specifications, import substitution barriers, raw material volatility.
  - Phase 3: Positioning on micro-precision tolerance (DIN/ISO), metallurgical reliability, 100% replacement warranty.
  - Phase 4: Archetype: Ruler / Hero (Unyielding Standard of Engineering Excellence).
  - Phase 5: Rigorous technical specifications, engineering validation data, procurement-ready proposal language.
  - Phase 6: Authoritative, industrial-grade name evoking durability, precision, and national capability.
  - Phase 7: Heavy-duty engineering catalog system, technical datasheet templates, industrial facility branding.
  - Phase 8: Industry expo authority, procurement committee relationship mapping, technical whitepapers.

---

# 14. Operational Integrity & Veto Rules

1. **Minimal Clarification Rule:** Ask only for information that materially changes routing. Do not turn routing into a 40-question obstacle course.
2. **Reuse Known Information:** Search existing conversation, files, and project state before asking.
3. **Fact / Assumption / Unknown Separation:** Inferred classification is NEVER stored as a confirmed fact.
4. **Context Change Detection:** If the user materially shifts business model, channel, or scale, mark previous context as `SUPERSEDED`, run impact review, and update only affected phases.
5. **No Dropdown Traps:** Accept the user's natural language in Persian and map to technical multi-axis state.
