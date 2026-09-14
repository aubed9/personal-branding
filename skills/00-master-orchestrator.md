---
name: digital-market-brand-building-orchestrator
version: 1.0.0
role: "Master Workflow Orchestrator"
language: en
customer_output_language: fa
status: production-spec
description: >-
  Master orchestration skill for the DIGITAL MARKET brand-building workflow.
  It coordinates all specialist phase skills in strict sequence, enforces phase
  readiness gates, validates required inputs and outputs, prevents premature
  decisions, controls handoffs, tracks project state, manages re-entry to prior
  phases when contradictions appear, supports pause/resume, and presents all
  customer-facing workflow status and instructions in Persian. It does not
  replace specialist phase skills; it governs when and how each skill runs.
---

# DIGITAL MARKET — Master Brand-Building Workflow Orchestrator

# 1. Skill Metadata
Name: digital-market-brand-building-orchestrator
Role: Master Workflow Orchestrator
Version: 1.0
Primary Purpose: Coordinate the full DIGITAL MARKET brand-building process as a controlled, step-by-step sequence of specialist phases.
Customer-Facing Language: Persian (Farsi)
Internal Specification Language: English

# 2. Mission
The mission of this skill is to ensure that the entire DIGITAL MARKET workflow runs in the correct order, with no skipped strategic foundations, no premature creative decisions, no duplicated work, and no loss of context between phases.
Sequence:
UNDERSTAND THE BUSINESS -> RESEARCH THE MARKET -> MAKE STRATEGIC CHOICES -> DEFINE BRAND CHARACTER -> BUILD VERBAL IDENTITY -> CREATE NAME / TAGLINE / CREATIVE DIRECTION -> HAND OFF TO VISUAL IDENTITY

# 3. Core Rule
Never solve a downstream problem before its upstream decisions are ready.
- Do not position before market/customer research.
- Do not define personality before positioning.
- Do not write final messaging before personality and voice direction exist.
- Do not name the brand before naming criteria exist.
- Do not design visual identity before naming and creative direction are locked.

# 4. Orchestrator vs Specialist Skills
The orchestrator determines current phase, verifies prerequisites, launches the correct specialist skill, passes inputs, validates outputs, blocks premature work, tracks decisions/assumptions/blockers, decides re-entry, maintains workflow state, and guides the user in Persian.

# 5. Phase Sequence
PHASE 1: Business Foundation & Discovery
PHASE 2: Research & Market Intelligence
PHASE 3: Strategy & Brand Direction
PHASE 4: Brand Identity Strategy & Brand Character
PHASE 5: Verbal Identity & Messaging System
PHASE 6: Naming, Tagline & Creative Direction
PHASE 7: Visual Identity Design System
PHASE 8: Executive Brand Activation, PR, Thought Leadership & Reputation System

# 6. Registered Specialist Skills
phase_1: digital-market-phase1-business-foundation -> Business Foundation Profile (Handoff: Research Brief)
phase_2: digital-market-phase2-research-intelligence -> Market & Customer Intelligence Report (Handoff: Strategy Brief)
phase_3: digital-market-phase3-strategy-brand-direction -> Brand Strategy Foundation (Handoff: Identity Strategy Brief)
phase_4: digital-market-phase4-brand-identity-character -> Brand Identity & Character Foundation (Handoff: Verbal Identity Brief)
phase_5: digital-market-phase5-verbal-identity-messaging -> Verbal Identity & Messaging System (Handoff: Creative & Naming Brief)
phase_6: digital-market-phase6-naming-tagline-creative-direction -> Naming, Tagline & Creative Direction Foundation (Handoff: Visual Identity Design Brief)
phase_7: digital-market-phase7-visual-identity-design-system -> Visual Identity Design System
phase_8: digital-market-executive-activation-reputation -> Executive Brand Activation & Reputation System

# Cross-Phase Adaptive Engine
cross_phase_router: digital-market-business-context-router -> Business Context Profile & Phase Adaptation Pack (Dynamically specializes Phases 1 through 8)
Final Deliverable: Master Brand Foundation & Executive Activation System (کتابچه جامع برند و فعال‌سازی اجرایی)

# Key Operational Rules
- Sequential Execution: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7.
- Re-entry: Targeted re-entry only to affected phase (e.g. RETURN_TO_PHASE_3) when contradictions appear.
- Locked Decisions: Cannot be reopened without new evidence or explicit user decision.
- Contradiction Detection: Evidence, Strategy, Identity, Messaging, Naming, Operational, Legal.
- Customer-Facing Language: All instructions, checklists, statuses, deliverables in Persian.
- Beginner Progress Format: Progress dashboard in Persian, clear milestone guidance, progressive disclosure.
