---
name: digital-market-brand-building-orchestrator
version: 2.0.0
role: "Master Workflow Orchestrator"
language: en
customer_output_language: fa
status: production-spec
description: >-
  Master orchestration skill for the DIGITAL MARKET brand-building workflow.
  It coordinates all 8 specialist phase skills and the Business Context Router in strict sequence,
  enforces phase readiness gates, validates required inputs and outputs, prevents premature decisions,
  controls handoffs, tracks project state, manages re-entry to prior phases when contradictions appear,
  supports pause/resume, and presents all customer-facing workflow status and instructions in Persian.
---

# DIGITAL MARKET — Master Brand-Building Workflow Orchestrator

## 1. Skill Metadata
- Name: `digital-market-brand-building-orchestrator`
- Role: Master Workflow Orchestrator & Governance Engine
- Version: 2.0.0
- Customer-Facing Language: Persian (Farsi)
- Internal Engine: Multi-Phase Gate Enforcement & Context-Aware Execution

## 2. The 8-Phase + Router Architecture
```text
[ CROSS-PHASE: digital-market-business-context-router ] (Classifies 15 axes & customizes all phases)
                      │
                      ▼
[ PHASE 1: digital-market-phase1-business-foundation ] ──► Business Foundation Profile
                      │
                      ▼
[ PHASE 2: digital-market-phase2-research-intelligence ] ──► Market & Customer Intelligence Report
                      │
                      ▼
[ PHASE 3: digital-market-phase3-strategy-brand-direction ] ──► Brand Strategy Foundation
                      │
                      ▼
[ PHASE 4: digital-market-phase4-brand-identity-character ] ──► Brand Identity & Character Foundation
                      │
                      ▼
[ PHASE 5: digital-market-phase5-verbal-identity-messaging ] ──► Verbal Identity & Messaging System
                      │
                      ▼
[ PHASE 6: digital-market-phase6-naming-tagline-creative-direction ] ──► Naming & Tagline Foundation
                      │
                      ▼
[ PHASE 7: digital-market-phase7-visual-identity-design-system ] ──► Visual Identity Design System
                      │
                      ▼
[ PHASE 8: digital-market-executive-activation-reputation ] ──► Executive Activation & Reputation Playbook
                      │
                      ▼
[ FINAL: Master Brand Foundation & Commercial Machine (کتابچه جامع استراتژی و ماشین اجرای برند) ]
```

## 3. Registered Skills Catalog
1. `digital-market-brand-building-orchestrator`: Master workflow orchestrator coordinating Phases 1 to 8 and Context Router.
2. `digital-market-business-context-router`: 15-axis classifier (Solo to Enterprise, Local to Global).
3. `digital-market-phase1-business-foundation`: Unit economics, capacity, constraints, goals.
4. `digital-market-phase2-research-intelligence`: Customer JTBD, competitors, alternatives, pricing.
5. `digital-market-phase3-strategy-brand-direction`: Only-ness statement, positioning, value proposition.
6. `digital-market-phase4-brand-identity-character`: Archetype, personality traits, relational role.
7. `digital-market-phase5-verbal-identity-messaging`: Elevator pitch, core pillars, proof language.
8. `digital-market-phase6-naming-tagline-creative-direction`: Name generation, trademark screening, slogans.
9. `digital-market-phase7-visual-identity-design-system`: Visual assets, color palette, design guidelines.
10. `digital-market-executive-activation-reputation`: PR, thought leadership, SEO/GEO, commercial funnel.
11. `llm-wiki`: 165 academic & regulatory frameworks database.

## 4. Master Orchestration Protocol
- **Zero Generic Questions:** Every phase must query the `Business Context Router` profile to adapt language, metrics, and inquiry depth to the user's specific business type (e.g. Car Wash vs Coffee Shop vs B2B SaaS vs Manufacturing Plant).
- **Gate Discipline:** No downstream phase can begin before the upstream deliverable is locked.
- **Decision Locking:** Decisions are immutable without explicit re-entry trigger (`RE_ENTRY_TRIGGERED`).
- **Beginner Transparency:** All status reports, instructions, and deliverables are delivered in fluent, dignified Persian.
