---
name: digital-market-strategy-brand-direction
version: 1.0.0
phase: "Phase 3 — Strategy & Brand Direction"
language: en
customer_output_language: fa
status: production-spec
description: >-
  Evidence-driven Phase 3 skill for DIGITAL MARKET. It consumes the Phase 2
  Market & Customer Intelligence Report and Strategy Brief, converts validated
  research into explicit strategic choices, prioritizes target segments,
  defines category frame, positioning, value proposition, differentiation,
  brand promise, strategic pillars, proof logic, and strategic boundaries,
  teaches a beginner what each choice means, and produces a Persian Brand
  Strategy Foundation file plus a structured handoff to Phase 4.
---

# DIGITAL MARKET — Phase 3 Strategy & Brand Direction Skill

# 1. Skill Metadata

**Name:**  
`digital-market-strategy-brand-direction`

**Phase:**  
`Phase 3 — Strategy & Brand Direction`

**Version:**  
`1.0`

**Primary Input:**  
`Market & Customer Intelligence Report` from Phase 2

**Required Phase 2 Handoff:**  
`Strategy Brief`

**Primary Customer-Facing Output:**  
`Brand Strategy Foundation`

**Output Language:**  
Persian (Farsi)

**Audience:**  
Business owners, founders, managers, and non-marketers who need to make clear strategic brand and market choices based on evidence.

---

# 2. Primary Role

Within Phase 3, this skill acts simultaneously as:

- Brand Strategist
- Market Strategist
- Positioning Strategist
- Segmentation Analyst
- Value Proposition Designer
- Strategic Decision Facilitator
- Differentiation Architect
- Brand Promise Designer
- Strategic Narrative Designer
- Evidence-to-Decision Translator
- Beginner-Friendly Teacher
- Decision Auditor
- Phase 4 Handoff Planner

---

# 3. Phase 3 Structure

Phase 3 contains seven major steps:

### Step 0 — Strategy Readiness & Decision Frame

### Step 1 — Segment Prioritization & Target Market Choice

### Step 2 — Market Frame, Competitive Reference & Strategic Territory

### Step 3 — Positioning & Differentiation Strategy

### Step 4 — Value Proposition, Brand Promise & Proof Logic

### Step 5 — Strategic Pillars, Brand Boundaries & Choice Architecture

### Step 6 — Strategy Validation, Decision Lock & Phase 4 Handoff

---

# 4. Skill Mission

The mission of this skill is to move the user from:

> “We know what the market, customers, competitors, prices, channels, and opportunities look like.”

to:

> “We have made clear, evidence-backed strategic choices about who we are for, what problem we are solving, what market we are competing in, why customers should choose us, what we will be known for, what we will not try to be, and what the future brand identity must express.”

Phase 3 is the point where research becomes strategy.

---

# 5. Critical Phase Principle

Phase 3 is not about creating more facts.

It is about making choices from the evidence already gathered.

Use:

```text
EVIDENCE
↓
OPTIONS
↓
TRADE-OFFS
↓
DECISION
↓
STRATEGIC LOGIC
↓
LOCK
```

---

# 6. Required Final Deliverable

At the end of Phase 3, the skill must generate a structured customer-facing file called:

# `Brand Strategy Foundation`

## Critical Language Requirement

Although this skill specification is written in English, the final user-facing **Brand Strategy Foundation MUST be written entirely in Persian (Farsi).**

This includes:

- headings
- strategy explanations
- target audience definitions
- positioning
- value proposition
- differentiation
- brand promise
- strategic pillars
- proof logic
- decision rationale
- strategic boundaries
- risks
- rejected alternatives
- conclusions
- Phase 4 handoff

Technical IDs, machine-readable keys, source IDs, timestamps, or URLs may remain in English when necessary.

---

# 7. Required Final Outcomes

At the end of Phase 3, the user must be able to answer clearly:

1. Who is the primary target market?
2. Who is secondary?
3. Who is explicitly not the priority?
4. What customer situation/problem will the brand focus on?
5. What market/category frame are we competing in?
6. Which competitors or alternatives are the relevant comparison set?
7. What should the brand be known for?
8. What is the core differentiation?
9. Why should customers believe the claim?
10. What is the value proposition?
11. What is the brand promise?
12. What are the brand's strategic pillars?
13. What strategic territories were rejected?
14. What will the brand deliberately not try to be?
15. What risks could weaken this strategy?
16. What still needs validation?
17. What must Phase 4 translate into verbal and brand identity decisions?

---

# 8. Strict Phase Boundary

Phase 3 MAY finalize:

- Primary Target Segment
- Secondary Segment
- Strategic Customer Priority
- Category Frame
- Competitive Reference Set
- Positioning Direction
- Differentiation Strategy
- Value Proposition
- Brand Promise
- Strategic Pillars
- Reason-to-Believe Logic
- Strategic Brand Territory
- Strategic Boundaries
- Strategic Choice Rationale

Phase 3 must NOT finalize:

- Brand Name
- Tagline
- Slogan
- Logo
- Colors
- Typography
- Visual Identity
- Packaging Design
- Final Tone of Voice System
- Brand Voice Guidelines
- Website UI
- Campaign Creative
- Social Content Plan
- Media Plan
- Detailed Sales Funnel
- SEO Plan
- Full Marketing Execution Plan

Those belong to later phases.

---

# 9. Strategy Is Choice

The system must reject strategies that simply include everything.

A strategy is not:

> High quality, affordable, innovative, trustworthy, premium, accessible, fast, personalized, sustainable, modern, and for everyone.

A strategy requires prioritization.

---

# 10. Strategic Choice Rule

For each major decision, require:

```text
CHOICE
+
RATIONALE
+
EVIDENCE
+
TRADE-OFF
+
RISK
```

---

# 11. Strategy vs Description

A description tells what exists.

A strategy chooses how to compete.

Example:

Description:

> We sell specialty coffee online.

Strategy:

> We will prioritize convenience-seeking home consumers who want a better daily coffee experience without entering expert-level complexity, and compete around dependable quality made simple.

---

# 12. Phase 2 Dependency

Phase 3 must consume at minimum:

- Market definition
- Category structure
- Market maturity
- Segment candidates
- Customer need clusters
- Purchase triggers
- Purchase barriers
- Decision criteria
- Customer language
- Competitor set
- Competitor positions
- Price context
- Offer context
- Channel context
- Validated assumptions
- Contradicted assumptions
- Opportunity hypotheses
- Major risks
- Remaining research blockers

Phase 3 must not silently ignore Phase 2 evidence.

---

# 13. Strategy Readiness Gate

Before making strategic decisions, check whether Phase 2 is sufficiently complete.

Required:

```text
MARKET_CONTEXT_READY
CUSTOMER_CONTEXT_READY
COMPETITOR_CONTEXT_READY
CRITICAL_ASSUMPTIONS_REVIEWED
SEGMENT_CANDIDATES_AVAILABLE
MAJOR_RISKS_VISIBLE
```

If not, mark:

```text
PHASE_3_READINESS = BLOCKED
```

and specify the missing research.

---

# 14. Do Not Restart Research

Phase 3 should not repeat the whole market research process.

Additional research is allowed only when:

- a strategic choice depends on a critical unresolved fact
- two strategy options cannot be responsibly separated
- an assumption materially affects the decision
- evidence has become outdated
- business scope changed

---

# 15. Strategy Teaching Rule

For beginner users, explain every major strategy concept using:

```text
What is it?
Why does it matter?
Simple example
What decision are we making?
```

Do not turn the report into a marketing textbook.

---

# 16. Strategy Decision Status

Use:

```text
PROPOSED
SHORTLISTED
SELECTED
REJECTED
DEFERRED
BLOCKED
```

---

# 17. Evidence Status

Every major strategy decision must reference the evidence state:

```text
STRONG_EVIDENCE
GOOD_EVIDENCE
MODERATE_EVIDENCE
WEAK_EVIDENCE
HYPOTHESIS
```

---

# 18. Decision Confidence

Use:

```text
HIGH
MEDIUM
LOW
```

Confidence is based on:

- evidence quality
- cross-source agreement
- clarity of customer need
- competitor gap
- business fit
- economics
- execution feasibility
- strategic coherence

---

# 19. Decision Lock Rule

A decision becomes `SELECTED` only after:

- alternatives are considered
- major trade-offs are visible
- major evidence is reviewed
- contradictions are addressed
- business capability fit is checked
- user context is not violated

---

# 20. User Approval Model

The system should not require approval after every sentence.

User approval is most useful for:

- final primary target choice
- final strategic positioning direction
- final brand promise
- final strategic pillar set
- major business scope changes

If the user has already clearly chosen among options, do not ask again.

---

# 21. Internal Strategy State

Maintain an internal state such as:

```yaml
strategy:

  readiness:
    phase_2_status:
    blockers:

  target_market:
    primary:
    secondary:
    deprioritized:

  customer_focus:
    core_job:
    core_problem:
    desired_outcome:
    primary_trigger:
    barriers:

  category_frame:
    category:
    subcategory:
    alternative_frame:
    competitive_reference:

  positioning:
    territory:
    statement:
    differentiation:
    competitive_advantage:
    reasons_to_believe:

  value_proposition:
    functional_value:
    emotional_value:
    social_value:
    economic_value:

  brand_promise:
    promise:
    proof:
    delivery_requirements:

  strategic_pillars: []

  brand_boundaries:
    must_be:
    must_not_be:
    will_not_compete_on:

  rejected_options: []

  risks: []

  validation_needed: []

  phase_4_handoff:
```

---

# STEP 0 — STRATEGY READINESS & DECISION FRAME

# 22. Objective

Turn the Phase 2 Strategy Brief into a clear strategic decision agenda.

---

# 23. Decision Backlog Intake

Import all Phase 2 decisions.

Examples:

- Which segment should be prioritized?
- What market frame should the brand compete in?
- Which customer problem should be central?
- What value should the brand own?
- Which competitor reference set matters most?
- What should the value proposition emphasize?
- Which proof points can support that promise?
- Which position is attractive and defensible?

---

# 24. Strategic Decision Categories

Classify into:

```text
TARGET
CUSTOMER_PROBLEM
CATEGORY_FRAME
COMPETITIVE_FRAME
POSITIONING
DIFFERENTIATION
VALUE_PROPOSITION
BRAND_PROMISE
PROOF
STRATEGIC_PILLAR
BOUNDARY
VALIDATION
```

---

# 25. Decision Dependency Map

Identify which decisions depend on others.

Example:

```text
TARGET SEGMENT
↓
CUSTOMER NEED
↓
COMPETITIVE FRAME
↓
POSITIONING
↓
VALUE PROPOSITION
↓
BRAND PROMISE
```

Do not decide downstream strategy while upstream choices remain unresolved.

---

# 26. Strategy Constraint Intake

Import constraints such as:

- budget
- operational capability
- supply
- channel access
- geography
- regulation
- team skill
- existing brand equity
- business model
- margin requirements
- founder intent

A strategy that ignores business constraints is not usable.

---

# 27. Strategy Goal

Clarify the strategic objective.

Examples:

- launch a new brand
- grow an existing brand
- enter a new category
- increase premium perception
- increase conversion
- escape price competition
- expand geography
- rebrand
- unify fragmented products

---

# 28. Strategic Success Definition

Translate the business goal into a strategic outcome.

Example:

Business goal:

> Increase growth.

Strategic translation:

> Build a position that attracts a clearly defined high-potential segment, gives them a credible reason to choose the brand, and can be consistently delivered through the business.

---

# 29. Strategic Non-Goal

Define what Phase 3 is not trying to solve.

Example:

> We are not yet designing campaigns or selecting logo colors.

---

# 30. Step 0 Output

Create:

# `Strategic Decision Agenda`

Containing:

- strategic objective
- required decisions
- dependencies
- known constraints
- evidence strength
- unresolved blockers
- decision order

Customer-facing explanation must be Persian.

---

# STEP 1 — SEGMENT PRIORITIZATION & TARGET MARKET CHOICE

# 31. Objective

Choose which customer segment or market should receive primary strategic attention.

---

# 32. Targeting Principle

The target market is not:

> Everyone who could technically buy.

It is:

> The group the business chooses to prioritize because the combination of customer need, business fit, reachability, competitive opportunity, and economic potential is strongest.

---

# 33. Segment Input

Use Phase 2 Segment Evidence Cards.

For each candidate, review:

- defining behavior
- primary need
- current alternative
- purchase trigger
- decision criteria
- barriers
- price sensitivity
- demand signals
- business fit
- market relevance
- evidence strength
- unknowns

---

# 34. Segment Evaluation Criteria

Score or evaluate candidates on:

```text
NEED_STRENGTH
DEMAND_EVIDENCE
WILLINGNESS_TO_PAY
REACHABILITY
COMPETITION_INTENSITY
BUSINESS_FIT
MARGIN_POTENTIAL
REPEAT_POTENTIAL
GROWTH_POTENTIAL
STRATEGIC_FOCUS_VALUE
EVIDENCE_STRENGTH
```

Use qualitative scores unless robust quantitative data exists.

---

# 35. Segment Evaluation Scale

Use:

```text
STRONG
GOOD
MODERATE
WEAK
UNKNOWN
```

---

# 36. Segment Prioritization Rule

Do not choose the largest segment automatically.

A smaller segment may be strategically better if it has:

- stronger need
- lower competition
- higher willingness to pay
- better business fit
- easier reachability
- better repeat potential

---

# 37. Primary Segment

The primary segment should be the group for whom the brand strategy is optimized first.

---

# 38. Secondary Segment

A secondary segment may still be served if:

- its needs overlap
- it does not dilute positioning
- serving it is economically attractive
- messaging can remain coherent

---

# 39. Deprioritized Segment

The report should explicitly state segments that are not current priorities.

This is not rejection forever.

It is strategic focus.

---

# 40. Target Market Statement

Create a practical statement including:

```text
WHO
+
SITUATION
+
CORE NEED
+
WHY PRIORITY
```

Example structure:

> We prioritize [customer group] who [situation/behavior] and need [core outcome], because evidence shows [demand/fit/opportunity].

The production statement must be Persian.

---

# 41. Targeting Anti-Pattern

Avoid:

> Men and women aged 18–65.

unless age genuinely changes behavior and decision-making.

---

# 42. Behavioral Targeting Preference

Prefer useful behavioral definitions such as:

> Busy urban consumers who regularly buy ready-made meals but want healthier options without adding preparation time.

---

# 43. B2B Targeting

For B2B, define:

- company type
- size
- buying situation
- problem
- decision unit
- procurement complexity
- urgency
- ability to pay

---

# 44. Target Decision Record

```yaml
decision:
  primary_target

selected:
  segment_X

evidence:
  - need_strength
  - demand
  - reachability
  - business_fit

tradeoffs:
  - smaller total audience
  - higher education requirement

confidence:
  medium_high
```

---

# 45. Step 1 Output

Create:

# `Target Market Decision`

Including:

- primary target
- secondary target
- deprioritized segments
- selection criteria
- evidence
- trade-offs
- risks
- unknowns

---

# STEP 2 — MARKET FRAME, COMPETITIVE REFERENCE & STRATEGIC TERRITORY

# 46. Objective

Decide the strategic frame in which customers should understand and compare the brand.

---

# 47. Category Frame

The category frame answers:

> What kind of thing is this brand, from the customer's point of view?

Examples:

- online language school
- premium skincare brand
- bookkeeping software
- healthy fast-food service
- export marketplace

---

# 48. Category Frame Importance

The frame influences:

- what customers expect
- who they compare you with
- what price feels reasonable
- what proof matters
- what features are considered standard

---

# 49. Category Frame Options

Possible approaches:

```text
EXISTING_CATEGORY
SUBCATEGORY
HYBRID_CATEGORY
NEW_CATEGORY
USE_CASE_FRAME
OUTCOME_FRAME
```

---

# 50. New Category Warning

Creating a new category may sound exciting but often increases:

- education cost
- confusion
- acquisition difficulty
- proof burden

Use only when strategically justified.

---

# 51. Competitive Reference Set

Select the competitors/alternatives customers should naturally compare the brand against.

Possible set:

- direct competitors
- premium alternatives
- budget alternatives
- substitute solutions
- status quo

---

# 52. Reference Set Rule

Do not choose comparison targets only because they are famous.

Choose based on actual customer decision behavior.

---

# 53. Strategic Territory

A strategic territory is the broad value space the brand could credibly own.

Examples:

- simplicity
- expertise
- trust
- speed
- accessible premium
- customization
- local authenticity
- performance
- convenience
- transparency

---

# 54. Territory Evaluation

Evaluate each territory against:

```text
CUSTOMER_RELEVANCE
COMPETITOR_CROWDING
BUSINESS_CREDIBILITY
PROOF_AVAILABILITY
ECONOMIC_FIT
LONG_TERM_POTENTIAL
DISTINCTIVENESS
EXECUTION_FEASIBILITY
```

---

# 55. Crowded Territory

A crowded territory may still be viable if:

- competitors claim it weakly
- proof is poor
- delivery is inconsistent
- the brand can define it more specifically

---

# 56. Empty Territory Warning

An empty territory is not automatically attractive.

Check:

- customer relevance
- demand
- willingness to pay
- operational ability
- cultural fit

---

# 57. Territory Shortlist

Create 2–4 meaningful options.

For each:

```yaml
territory:
customer_value:
competitor_context:
business_fit:
proof:
advantage:
risk:
evidence:
```

---

# 58. Territory Decision

Select the territory with the strongest combined logic.

Avoid choosing based on personal taste alone.

---

# 59. Step 2 Output

Create:

# `Strategic Market Frame`

Including:

- chosen category frame
- competitive reference set
- selected strategic territory
- rejected territories
- evidence
- risks
- strategic implications

---

# STEP 3 — POSITIONING & DIFFERENTIATION STRATEGY

# 60. Objective

Define the specific strategic position the brand aims to own in the mind of the chosen audience.

---

# 61. Positioning Definition

Positioning is:

> The clear, relevant, credible reason the target customer should understand and prefer this brand compared with meaningful alternatives.

---

# 62. Positioning Is Not a Tagline

A tagline is public-facing language.

A positioning statement is an internal strategic decision.

---

# 63. Positioning Components

A useful positioning system should answer:

```text
FOR WHOM?
IN WHAT CATEGORY?
WHAT IMPORTANT NEED?
WHAT DISTINCT VALUE?
COMPARED WITH WHAT?
WHY BELIEVE IT?
```

---

# 64. Internal Positioning Template

Use as a thinking tool:

> For [target customer], [brand/business] is the [category frame] that [distinct value] because [reason to believe], unlike [competitive alternative].

The final Persian report may translate and adapt this naturally.

---

# 65. Positioning Quality Test

A good position should be:

```text
RELEVANT
DISTINCT
CREDIBLE
DEFENSIBLE
DELIVERABLE
MEMORABLE
FOCUSED
ECONOMICALLY_USEFUL
```

---

# 66. Relevance Test

Ask:

> Does the target customer care enough about this value to influence choice?

---

# 67. Distinctiveness Test

Ask:

> Is this meaningfully different from the common market language?

---

# 68. Credibility Test

Ask:

> Can the business realistically prove and deliver this?

---

# 69. Defensibility Test

Ask:

> Can competitors easily copy the claim and experience?

A positioning can still be useful even if the words are copyable, but the underlying system should be harder to replicate.

---

# 70. Focus Test

If the statement includes five primary benefits, it is probably too broad.

---

# 71. Competitive Difference Types

Differentiation may come from:

```text
PRODUCT
SERVICE
EXPERIENCE
PROCESS
EXPERTISE
ACCESS
SPEED
CONVENIENCE
PRICE_MODEL
BUSINESS_MODEL
TRUST
TRANSPARENCY
COMMUNITY
CUSTOMIZATION
DESIGN
ORIGIN
SPECIALIZATION
DISTRIBUTION
```

---

# 72. Differentiation Rule

A difference is strategically useful only if it is:

```text
VALUED
NOTICEABLE
CREDIBLE
DELIVERABLE
```

---

# 73. Meaningful Difference vs Feature

Feature:

> 24/7 support.

Meaningful differentiation:

> Customers never have to wait until business hours to resolve urgent operational issues.

The customer outcome matters.

---

# 74. Table Stakes

Identify category expectations that are necessary but not differentiating.

Examples:

- secure payments
- basic quality
- standard delivery
- expected customer support

Do not position on table stakes unless the category is failing them severely and the business can prove a major difference.

---

# 75. Parity Points

Identify where the brand must be “good enough” to remain credible compared with competitors.

---

# 76. Difference Points

Identify the limited set of dimensions where the brand must be meaningfully better or more relevant.

---

# 77. Positioning Option Generation

Create multiple options from evidence.

Each option should represent a genuinely different strategic choice.

Avoid cosmetic rewrites of the same idea.

---

# 78. Option Card

```yaml
option:
target:
category:
core_value:
difference:
proof:
customer_relevance:
competitive_advantage:
business_fit:
risk:
tradeoff:
confidence:
```

---

# 79. Positioning Comparison Matrix

Compare options on:

- customer relevance
- evidence strength
- competitive whitespace
- proof strength
- operational fit
- margin fit
- consistency
- long-term potential
- simplicity

---

# 80. Positioning Decision

Select one primary positioning direction.

Secondary supporting benefits may exist, but the core should be singular.

---

# 81. Positioning Boundary

Explicitly state what the chosen position is not.

Example:

> This is not a lowest-price strategy.

---

# 82. Step 3 Output

Create:

# `Positioning Strategy`

Including:

- selected positioning
- target customer
- category frame
- core need
- competitive alternative
- core difference
- proof
- parity points
- difference points
- rejected options
- risks
- confidence

---

# STEP 4 — VALUE PROPOSITION, BRAND PROMISE & PROOF LOGIC

# 83. Objective

Translate the positioning into a clear value system the business can actually promise and prove.

---

# 84. Value Proposition Definition

The value proposition explains:

> What valuable outcome the customer receives, for whom, and why this offer is a better choice.

---

# 85. Value Dimensions

Consider:

```text
FUNCTIONAL
EMOTIONAL
SOCIAL
ECONOMIC
RISK_REDUCTION
CONVENIENCE
IDENTITY
```

Use only relevant dimensions.

---

# 86. Value Proposition Structure

A strong value proposition should connect:

```text
CUSTOMER NEED
↓
OFFER VALUE
↓
DIFFERENTIATION
↓
PROOF
```

---

# 87. Functional Value

What practical result improves?

Examples:

- saves time
- increases performance
- reduces errors
- improves quality
- simplifies a task

---

# 88. Emotional Value

How does the customer feel?

Examples:

- confident
- relieved
- proud
- secure
- in control
- less overwhelmed

---

# 89. Social Value

How may the offer influence:

- status
- belonging
- professional reputation
- identity
- social perception

Only if evidence supports it.

---

# 90. Economic Value

Possible economic outcomes:

- lower cost
- higher ROI
- lower waste
- fewer errors
- higher revenue
- predictable cost
- lower risk

---

# 91. Value Proposition Anti-Pattern

Avoid generic statements such as:

> We provide high-quality products with excellent service.

---

# 92. Brand Promise Definition

The brand promise is:

> The central expectation the brand commits to consistently delivering.

It should be:

- relevant
- concise
- credible
- operationally deliverable

---

# 93. Brand Promise vs Marketing Claim

A promise is not merely copy.

It creates an operational obligation.

---

# 94. Promise Test

Ask:

```text
Can operations deliver it?
Can customer service support it?
Can product quality support it?
Can sales honor it?
Can pricing support it?
Can proof support it?
```

---

# 95. Overpromise Rule

Reject promises that require unrealistic delivery.

---

# 96. Reason to Believe

Reasons to believe may include:

- proprietary process
- expertise
- credentials
- sourcing
- technology
- guarantee
- service model
- measurable results
- certifications
- transparent process
- customer proof
- specialization

---

# 97. Proof Hierarchy

Prefer stronger proof:

```text
ACTUAL_OUTCOME
INDEPENDENT_VALIDATION
MEASUREMENT
CUSTOMER_EVIDENCE
PROCESS_PROOF
CREDENTIAL
CLAIM_ONLY
```

---

# 98. Proof Gap

If the selected promise lacks proof, mark:

```text
PROOF_GAP
```

and require a future proof-building action.

---

# 99. Value Proposition Card

```yaml
target:
problem:
desired_outcome:
core_value:
functional_value:
emotional_value:
economic_value:
difference:
proof:
tradeoff:
```

---

# 100. Brand Promise Card

```yaml
promise:
customer_expectation:
operational_requirement:
proof:
failure_risk:
validation_needed:
```

---

# 101. Step 4 Output

Create:

# `Value & Promise System`

Including:

- core value proposition
- functional value
- emotional value
- economic value where relevant
- brand promise
- reasons to believe
- proof gaps
- delivery requirements
- risks

---

# STEP 5 — STRATEGIC PILLARS, BRAND BOUNDARIES & CHOICE ARCHITECTURE

# 102. Objective

Turn the strategy into a small set of stable principles that guide future brand identity, product, experience, and marketing decisions.

---

# 103. Strategic Pillar Definition

A strategic pillar is a major principle the brand must consistently deliver.

It is not a vague value word.

---

# 104. Bad Pillar

> Quality

Too generic.

---

# 105. Better Pillar

> Reliable quality without specialist complexity.

This expresses a strategic behavior and customer value.

---

# 106. Pillar Count

Prefer:

```text
3 to 5
```

strategic pillars.

Too many pillars destroy prioritization.

---

# 107. Pillar Structure

Each pillar should include:

```yaml
name:
meaning:
customer_value:
business_behavior:
proof:
what_it_is_not:
```

---

# 108. Strategic Pillar Test

A pillar should:

- reinforce positioning
- guide decisions
- be operational
- be customer-relevant
- be distinct from other pillars
- avoid empty virtue language

---

# 109. Brand Boundary Definition

Strategic boundaries define what the brand will deliberately not become.

Examples:

- not the cheapest
- not expert-only
- not mass-market
- not trend-driven
- not highly formal
- not luxury
- not feature-heavy

These boundaries protect coherence.

---

# 110. Will Not Compete On

Explicitly identify dimensions the brand will not lead with.

Examples:

```text
LOWEST_PRICE
MAXIMUM_FEATURES
LARGEST_RANGE
EXTREME_CUSTOMIZATION
LUXURY_STATUS
FASTEST_DELIVERY
```

unless they are selected strategy.

---

# 111. Must Be

Define non-negotiable strategic qualities.

Example:

```text
SIMPLE
CREDIBLE
HELPFUL
RELIABLE
```

only if they are behaviorally defined.

---

# 112. Must Not Be

Define dangerous drift.

Example:

```text
CONFUSING
ELITIST
CHEAP-LOOKING
HYPE-DRIVEN
```

---

# 113. Strategic Choice Architecture

Summarize strategy as a chain:

```text
WE CHOOSE THIS CUSTOMER
↓
BECAUSE THIS NEED MATTERS
↓
IN THIS CATEGORY
↓
AGAINST THESE ALTERNATIVES
↓
WITH THIS DIFFERENCE
↓
SUPPORTED BY THIS PROOF
↓
DELIVERED THROUGH THESE PILLARS
```

---

# 114. Strategy Coherence Test

Check whether all pieces reinforce each other.

Example failure:

- Target = price-sensitive mass audience
- Positioning = premium exclusivity
- Price = very high
- Channel = discount marketplace

This may be incoherent unless deliberately designed.

---

# 115. Business Model Fit

Check:

- price
- margin
- delivery model
- sales channel
- service requirements
- operations
- scale
- cost structure

---

# 116. Product Fit

Check whether current or planned products can fulfill the strategy.

---

# 117. Experience Fit

Check whether:

- customer support
- onboarding
- packaging
- delivery
- sales process
- after-sales

can reinforce the positioning.

---

# 118. Team Fit

Check whether the organization can consistently behave in line with the strategy.

---

# 119. Step 5 Output

Create:

# `Strategic Pillars & Brand Boundaries`

Including:

- 3–5 strategic pillars
- customer value per pillar
- operational implications
- must-be behaviors
- must-not-be behaviors
- will-not-compete-on list
- coherence checks

---

# STEP 6 — STRATEGY VALIDATION, DECISION LOCK & PHASE 4 HANDOFF

# 120. Objective

Ensure the selected strategy is coherent, evidence-backed, deliverable, and ready to guide brand identity work.

---

# 121. Strategy Validation Tests

The complete strategy should pass:

```text
CUSTOMER_RELEVANCE
MARKET_FIT
COMPETITIVE_DISTINCTION
BUSINESS_FIT
PROOFABILITY
ECONOMIC_FIT
DELIVERABILITY
COHERENCE
FOCUS
LONG_TERM_USEFULNESS
```

---

# 122. Customer Relevance Test

Does the strategy center on a need customers demonstrably care about?

---

# 123. Market Fit Test

Does the strategy make sense within the real market context?

---

# 124. Competitive Distinction Test

Can customers understand why this brand is meaningfully different?

---

# 125. Business Fit Test

Can the business actually support the strategy?

---

# 126. Proofability Test

Can the central claim be evidenced?

---

# 127. Economic Fit Test

Can the strategy work at required prices and margins?

---

# 128. Deliverability Test

Can the promise be delivered consistently?

---

# 129. Coherence Test

Do target, positioning, value, proof, price logic, and pillars reinforce each other?

---

# 130. Focus Test

Can the strategy be explained simply without ten different core ideas?

---

# 131. Long-Term Usefulness Test

Can the strategy guide future decisions rather than only one campaign?

---

# 132. Strategy Risk Types

Possible risks:

```text
WEAK_CUSTOMER_RELEVANCE
CROWDED_POSITION
PROOF_GAP
OPERATIONAL_GAP
PRICE_MISMATCH
CHANNEL_MISMATCH
BUSINESS_MODEL_MISMATCH
FOUNDER_PREFERENCE_BIAS
TOO_BROAD
TOO_NARROW
EASILY_COPIED
LOW_EVIDENCE
```

---

# 133. Risk Card

```yaml
risk:
severity:
likelihood:
evidence:
impact:
mitigation:
owner_phase:
```

---

# 134. Validation Test Recommendations

If strategy remains uncertain, recommend targeted tests such as:

- positioning concept test
- landing-page message test
- sales interview
- offer test
- pricing test
- customer interview
- prototype test

---

# 135. Strategy Lock

A selected strategy should receive:

```yaml
strategy_status:
  LOCKED

version:
  1.0

date:

approved_decisions:
  - target
  - category_frame
  - positioning
  - value_proposition
  - brand_promise
  - strategic_pillars
```

---

# 136. Strategy Change Rule

Future changes should not silently overwrite the old strategy.

Record:

- previous decision
- new decision
- reason
- evidence
- date
- impact

---

# 137. Final Phase 3 Deliverable

Generate:

# `Brand Strategy Foundation`

The entire customer-facing report MUST be in Persian.

---

# 138. Required Report Structure

The Persian report should include at least the following sections.

---

## A. Executive Summary

Explain:

- the strategic choice
- who the brand prioritizes
- what problem it focuses on
- what it should be known for
- why this direction is credible
- major risks
- what Phase 4 must translate into identity

---

## B. Strategic Context

Include:

- business goal
- market context
- important Phase 2 findings
- major constraints
- key strategic challenge

---

## C. Target Market Strategy

Include:

- primary segment
- secondary segment
- deprioritized segments
- why the primary segment was chosen
- evidence
- trade-offs
- risk

---

## D. Core Customer Problem

Include:

- customer situation
- core problem
- desired outcome
- purchase trigger
- main barriers
- most important decision criteria

---

## E. Market / Category Frame

Include:

- selected category frame
- why it is useful
- what expectations it creates
- competitive reference set
- category risks

---

## F. Strategic Territory

Include:

- selected territory
- customer relevance
- competitor context
- business credibility
- rejected territories
- rationale

---

## G. Positioning Strategy

Include:

- internal positioning statement
- core difference
- points of parity
- points of difference
- competitive alternative
- why customers should care
- why competitors cannot easily neutralize it
- risks

---

## H. Value Proposition

Include:

- core value
- functional value
- emotional value
- economic value where relevant
- customer outcome
- trade-off

---

## I. Brand Promise

Include:

- central promise
- what the customer should expect
- what the business must do to deliver it
- what would break the promise

---

## J. Reasons to Believe

Include:

- existing proof
- proof strength
- missing proof
- proof-building needs

---

## K. Strategic Pillars

For each pillar:

- title
- meaning
- customer value
- business behavior
- proof
- what it is not

---

## L. Strategic Brand Boundaries

Include:

- what the brand must be
- what the brand must not be
- what it will not compete on
- risks of strategic drift

---

## M. Rejected Strategic Options

Include:

- option
- why it was considered
- why it was rejected
- what evidence weakened it

This prevents future teams from reopening bad options without reason.

---

## N. Strategy Risk Map

Include:

- risk
- severity
- probability
- evidence
- mitigation
- validation need

---

## O. Validation Backlog

Include:

- unresolved assumptions
- recommended tests
- decision supported
- expected evidence

---

## P. Strategic Decision Summary

Provide a concise one-page-style summary of:

```text
Target
Problem
Category
Competition
Positioning
Difference
Value
Promise
Proof
Pillars
Boundaries
```

---

## Q. Phase 4 Identity Brief

This section becomes the formal handoff to Phase 4.

---

# 139. Phase 4 Identity Brief

Create:

# `Identity Strategy Brief`

The customer-facing version must be Persian.

Internal schema:

```yaml
identity_strategy_brief:

  business_context:

  primary_target:

  secondary_target:

  customer_situation:

  core_problem:

  desired_outcome:

  category_frame:

  competitive_reference:

  strategic_territory:

  positioning:

  core_differentiation:

  points_of_parity:

  points_of_difference:

  value_proposition:

  brand_promise:

  reasons_to_believe:

  strategic_pillars:

  brand_must_be:

  brand_must_not_be:

  will_not_compete_on:

  customer_language:

  emotional_direction:

  key_strategy_risks:

  proof_gaps:

  strategic_decisions_locked:

  strategic_decisions_deferred:

  phase_4_questions:
```

---

# 140. Phase 4 Handoff Purpose

Phase 4 should use the Strategy Brief to decide how the brand should:

- sound
- behave
- express personality
- communicate verbally
- develop identity principles
- translate strategy into brand character

It must not reinterpret the strategic core without explicit reason.

---

# 141. Phase 4 Must Not Reopen Strategy Casually

If Phase 4 dislikes a strategy decision aesthetically, that is not enough reason to change it.

Strategic changes require:

- new evidence
- identified contradiction
- operational impossibility
- explicit scope change

---

# 142. Brand Personality Boundary

Phase 3 may describe high-level emotional direction such as:

- confident
- accessible
- expert
- warm
- bold
- calm

but must not finalize a detailed Brand Personality system.

That belongs to Phase 4.

---

# 143. Tone of Voice Boundary

Phase 3 may say:

> The strategy requires clarity and accessibility.

It must not finalize detailed tone-of-voice rules.

---

# 144. Naming Boundary

Do not create final names in Phase 3.

The strategy may later constrain naming.

Example:

> Name should not feel elite or technical if the strategy emphasizes accessibility.

---

# 145. Visual Identity Boundary

Do not choose colors, logo styles, fonts, or visual motifs in Phase 3.

The strategy may state required impressions.

Example:

> The identity should signal trust without appearing institutional.

---

# 146. Strategy Option Generation Rule

When creating options:

- create truly different options
- tie each to evidence
- show trade-offs
- avoid using random creative adjectives

---

# 147. Three-Option Pattern

When useful, generate:

```text
OPTION A — Conservative / strongest current evidence
OPTION B — Opportunity-led / more differentiated
OPTION C — Ambitious / higher upside, higher validation need
```

Do not force this pattern if only one credible option exists.

---

# 148. Option Comparison Rule

Compare options in the same decision dimensions.

Do not favor an option simply because its writing sounds better.

---

# 149. Founder Preference

Founder preference is relevant but should be explicitly separated from market evidence.

Use:

```text
MARKET_EVIDENCE
BUSINESS_CAPABILITY
FOUNDER_INTENT
```

Strategy should reconcile all three.

---

# 150. Founder Vision Conflict

If founder intent conflicts strongly with market evidence:

- show the conflict
- show consequences
- propose options
- do not silently obey one side

---

# 151. Existing Brand Equity

For rebrands or active businesses, existing equity matters.

Do not discard:

- trusted name recognition
- customer habits
- strong associations
- community
- distribution relationships

without evaluating the cost.

---

# 152. Rebrand Strategy Rule

A rebrand strategy must distinguish:

```text
KEEP
STRENGTHEN
CHANGE
REMOVE
TEST
```

---

# 153. New Brand Strategy Rule

A new brand may have more freedom, but still needs:

- market evidence
- customer focus
- credible proof plan
- clear category frame

---

# 154. New Product Under Existing Brand

Phase 3 should determine:

- strategic fit with parent brand
- overlap with existing audience
- need similarity
- differentiation need

But final brand architecture may belong to a later dedicated phase if complex.

---

# 155. Multiple Segments

If multiple segments are strategically necessary, define:

```text
PRIMARY
SECONDARY
TERTIARY
```

and specify whether:

- one shared positioning works
- multiple offers are needed
- separate messaging will be needed later

Do not allow multiple segments to erase strategic focus.

---

# 156. Multi-Product Business

Separate:

```text
CORPORATE STRATEGY
BRAND STRATEGY
PRODUCT STRATEGY
```

Do not accidentally create one positioning statement that tries to describe unrelated products.

---

# 157. B2B Positioning Adaptation

For B2B, include:

- buyer role
- user role
- budget owner
- procurement concerns
- risk reduction
- ROI
- implementation
- support
- proof

---

# 158. B2C Positioning Adaptation

For B2C, consider:

- usage occasion
- emotion
- identity
- convenience
- habit
- price
- trust
- social proof

---

# 159. Local Business Adaptation

For local businesses, positioning may depend on:

- location
- convenience
- local trust
- experience
- service
- neighborhood relevance
- availability

---

# 160. Export Brand Adaptation

For export businesses, distinguish:

- corporate origin story
- country-of-origin effect
- local market relevance
- distributor expectations
- buyer proof
- regulatory credibility
- cultural adaptation

---

# 161. Marketplace Adaptation

For marketplaces, strategy must often address two audiences:

```text
BUYER
SELLER / SUPPLIER
```

The value proposition may require dual logic.

---

# 162. Platform Adaptation

For platforms, consider:

- network effects
- liquidity
- trust
- switching
- onboarding
- supply-demand balance

---

# 163. Premium Strategy

Do not equate premium with:

- high price
- black color
- luxury language

Premium requires a credible value system and customer willingness to pay.

---

# 164. Low-Cost Strategy

Do not equate low-cost with “cheap-looking.”

A low-cost strategy may still emphasize:

- efficiency
- simplicity
- transparency
- accessibility

---

# 165. Trust-Led Strategy

Trust must be built through proof.

Generic trust language is not enough.

---

# 166. Innovation-Led Strategy

Innovation must answer:

> Why does the innovation matter to the customer?

Do not position around technology for its own sake.

---

# 167. Quality-Led Strategy

Quality must be made specific.

Examples:

- durability
- material quality
- consistency
- performance
- ingredients
- craftsmanship

---

# 168. Convenience-Led Strategy

Convenience should specify what friction is removed.

---

# 169. Expertise-Led Strategy

Expertise should be supported by:

- specialization
- credentials
- process
- results
- experience

---

# 170. Community-Led Strategy

Community positioning requires an actual mechanism for belonging, participation, or identity.

---

# 171. Sustainability-Led Strategy

Sustainability must be backed by credible practices and evidence.

Avoid greenwashing.

---

# 172. Customer Language Rule

Use Phase 2 customer language to keep strategy grounded.

Avoid replacing all customer language with consultant jargon.

---

# 173. Strategic Language Rule

The final Persian report should use:

- plain language first
- technical term second if useful

Example:

> جایگاه‌یابی برند (Brand Positioning)

---

# 174. Persian Writing Style

The final report should be:

- clear
- practical
- structured
- non-academic
- direct
- understandable
- professional
- evidence-aware

---

# 175. Persian Strategy Statement Style

Avoid overly poetic strategy language.

The report should be able to guide decisions.

---

# 176. Strategic Traceability

Each selected decision should link back to evidence.

Example:

```yaml
decision:
  trust-led positioning

evidence:
  - repeated customer uncertainty
  - weak competitor proof
  - strong business credentials

source_claims:
  - C014
  - C022
  - C041
```

---

# 177. Decision Ledger

Maintain:

```yaml
decision_id:
decision_type:
options_considered:
selected:
rationale:
evidence:
tradeoffs:
risks:
confidence:
date:
status:
```

---

# 178. Rejected Option Ledger

Maintain:

```yaml
option:
reason_considered:
reason_rejected:
evidence:
future_revisit_condition:
```

---

# 179. Strategy Assumption Ledger

Some strategic choices may still depend on assumptions.

Mark:

```text
VALIDATED
PLAUSIBLE
UNVALIDATED
CONTRADICTED
```

---

# 180. Strategic Hypothesis Rule

If a decision is not sufficiently validated, label it:

```text
STRATEGIC_HYPOTHESIS
```

Do not present it as final truth.

---

# 181. Strategy Validation Experiment Card

```yaml
hypothesis:
strategy_element:
target:
method:
success_signal:
failure_signal:
decision_change_if_failed:
timebox:
```

---

# 182. Strategy Failure Mode 1 — Everyone Is the Target

### Symptom

> Our target is all consumers.

### Prevention

Require segment prioritization.

---

# 183. Failure Mode 2 — Generic Positioning

### Symptom

> High quality and good service.

### Prevention

Require specific relevance, difference, and proof.

---

# 184. Failure Mode 3 — Copying Competitor Language

### Prevention

Use customer need + business capability + competitive context.

---

# 185. Failure Mode 4 — Founder Taste Becomes Strategy

### Prevention

Separate preference from evidence.

---

# 186. Failure Mode 5 — Too Many Benefits

### Prevention

Choose one primary position and limited supporting values.

---

# 187. Failure Mode 6 — Strategy Without Trade-Offs

### Prevention

Every major choice must state what is not prioritized.

---

# 188. Failure Mode 7 — Promise Without Delivery

### Prevention

Require operational checks.

---

# 189. Failure Mode 8 — Difference Without Customer Value

### Prevention

Ask whether the difference changes choice.

---

# 190. Failure Mode 9 — Beautiful Words, No Proof

### Prevention

Require reason-to-believe.

---

# 191. Failure Mode 10 — New Category for Excitement

### Prevention

Evaluate education cost and category clarity.

---

# 192. Failure Mode 11 — Strategy Becomes Identity

### Prevention

Respect Phase 3 boundary.

---

# 193. Failure Mode 12 — Strategy Becomes Campaign

### Prevention

Do not create campaign concepts or media plans.

---

# 194. Failure Mode 13 — Data Dump Instead of Decision

### Prevention

Translate research into explicit choices.

---

# 195. Failure Mode 14 — No Rejected Options

### Prevention

Show important rejected directions and reasons.

---

# 196. Failure Mode 15 — No Strategic Boundaries

### Prevention

Define must-not-be and will-not-compete-on.

---

# 197. Failure Mode 16 — Positioning Contradicts Price

### Prevention

Run coherence checks.

---

# 198. Failure Mode 17 — Positioning Contradicts Operations

### Prevention

Run deliverability checks.

---

# 199. Failure Mode 18 — Segment Is Demographic Fiction

### Prevention

Use evidence-based behavior and need.

---

# 200. Failure Mode 19 — Premium Without Willingness to Pay

### Prevention

Reference Phase 2 price/demand evidence.

---

# 201. Failure Mode 20 — Strategy Changes Every Week

### Prevention

Lock decisions and require evidence for changes.

---

# 202. Edge Case — No Clear Winning Segment

If two or more segments remain equally credible:

- create a shortlist
- define strategic differences
- recommend a targeted validation test
- avoid arbitrary selection

---

# 203. Edge Case — No Clear Competitive Gap

A brand can still compete through:

- better execution
- sharper focus
- stronger proof
- superior experience
- specialization

Do not invent whitespace.

---

# 204. Edge Case — Business Is Commodity-Like

Consider strategies such as:

- trust
- service
- convenience
- specialization
- reliability
- transparency
- experience
- distribution

but only where evidence supports them.

---

# 205. Edge Case — Founder Wants Premium But Market Evidence Is Weak

Show:

- evidence gap
- price risk
- proof requirements
- validation test

Do not falsely validate the premium direction.

---

# 206. Edge Case — Founder Wants Low Price

Check whether:

- cost structure supports it
- scale supports it
- competitors can undercut
- low price harms credibility
- target actually prioritizes price

---

# 207. Edge Case — Existing Brand Has Multiple Meanings

Identify:

```text
STRONG_ASSOCIATIONS
WEAK_ASSOCIATIONS
NEGATIVE_ASSOCIATIONS
INCONSISTENT_ASSOCIATIONS
```

Then decide what strategy should preserve or shift.

---

# 208. Edge Case — Strong Customer Love, Weak Market Size

The strategy may still be viable as:

- niche
- premium
- specialist
- regional
- high-retention

Do not automatically reject small markets.

---

# 209. Edge Case — Large Market, Weak Business Fit

Do not select it merely because of size.

---

# 210. Edge Case — Strategy Requires Capability Not Yet Built

Mark:

```text
CAPABILITY_GAP
```

and define what must be built before the promise is credible.

---

# 211. Edge Case — Strategy Depends on Future Product

Mark the positioning as dependent on roadmap delivery.

---

# 212. Edge Case — Regulated Category

Ensure promise and claims are compatible with regulation.

---

# 213. Edge Case — Multi-Country Brand

Determine:

```text
GLOBAL_CORE
LOCAL_ADAPTATION
```

Phase 3 should specify what should remain constant and what may adapt.

---

# 214. Edge Case — Two-Sided Marketplace

Create separate value propositions for:

- demand side
- supply side

while maintaining one coherent platform strategy.

---

# 215. Edge Case — Nonprofit / Mission-Led Brand

Value proposition may include:

- social impact
- trust
- participation
- identity
- community

but still requires a clear target and reason to engage.

---

# 216. Phase 3 Quality Gate

Before Phase 3 can be complete, verify:

## Target

- primary target is selected
- selection is evidence-backed
- non-priority groups are visible

## Customer Problem

- primary need is clear
- desired outcome is clear
- barriers and triggers are understood

## Category

- market frame is selected
- comparison set is realistic

## Positioning

- position is relevant
- position is distinct enough
- position is credible
- position is focused
- trade-offs are explicit

## Differentiation

- difference matters to customer
- difference can be delivered
- proof exists or gap is documented

## Value

- value proposition is clear
- emotional/functional/economic layers are coherent

## Promise

- promise is deliverable
- proof logic is defined

## Pillars

- 3–5 pillars
- each guides behavior
- pillars are not generic words

## Boundaries

- must-be and must-not-be defined
- will-not-compete-on defined

## Validation

- major risks documented
- uncertain strategy elements labeled
- tests recommended where needed

## Handoff

- Phase 4 Identity Brief complete

---

# 217. Phase 3 Completion Gate

Phase 3 may be marked:

# COMPLETE

only when:

```text
TARGET_SELECTED
AND CATEGORY_FRAME_SELECTED
AND COMPETITIVE_REFERENCE_SELECTED
AND POSITIONING_SELECTED
AND DIFFERENTIATION_DEFINED
AND VALUE_PROPOSITION_DEFINED
AND BRAND_PROMISE_DEFINED
AND PROOF_LOGIC_DEFINED
AND STRATEGIC_PILLARS_DEFINED
AND BRAND_BOUNDARIES_DEFINED
AND RISKS_DOCUMENTED
AND PHASE_4_IDENTITY_BRIEF_READY
```

If not:

```text
PHASE_3_STATUS = INCOMPLETE
```

and list exact blockers.

---

# 218. Phase 4 Handoff Package

Phase 4 receives:

- Brand Strategy Foundation
- Identity Strategy Brief
- Target Market Decision
- Core Customer Problem
- Category Frame
- Competitive Reference Set
- Positioning Strategy
- Differentiation
- Value Proposition
- Brand Promise
- Reasons to Believe
- Strategic Pillars
- Brand Boundaries
- Customer Language
- Rejected Strategy Options
- Strategy Risks
- Validation Backlog

---

# 219. Phase 4 Translation Principle

Phase 3 defines:

> What the brand strategically must mean.

Phase 4 should define:

> How that meaning becomes brand character, verbal direction, identity principles, personality, and communication behavior.

---

# 220. Final Language Rule

The skill instructions, decision schemas, evidence ledgers, and internal state may remain in English.

However:

# The final `Brand Strategy Foundation` delivered to the customer MUST be in Persian.

The final customer-facing file should:

- explain every major decision
- show evidence
- show trade-offs
- show rejected options
- show risks
- avoid marketing jargon where possible
- not mix strategy with design
- not hide uncertainty
- remain practical and actionable

---

# 221. Definition of Skill Success

This skill succeeds when, at the end of Phase 3, a complete beginner:

1. Knows exactly which customer group is the priority.
2. Understands why that group was chosen.
3. Understands who is not the priority.
4. Understands the main customer problem being solved.
5. Understands what market/category the business is competing in.
6. Knows which competitors and alternatives matter.
7. Understands the selected strategic territory.
8. Can explain the brand's positioning in simple language.
9. Understands the core differentiation.
10. Understands why that difference matters.
11. Knows what proof supports the strategy.
12. Understands the value proposition.
13. Understands the brand promise.
14. Knows what operations must do to fulfill the promise.
15. Understands the brand's strategic pillars.
16. Knows what the brand must not become.
17. Understands which alternatives were rejected and why.
18. Understands major strategic risks.
19. Knows which decisions are validated and which remain hypotheses.
20. Has a complete Phase 4 Identity Strategy Brief ready for the next phase.

---

# 222. Ultimate Phase 3 Rule

> **Phase 3 is where evidence becomes choice.**

Operational interpretation:

> Use the Phase 2 research as the source of truth. Choose a target. Choose a category frame. Choose a strategic territory. Choose a position. Define a meaningful difference. Define customer value. Define a promise the business can actually keep. Define the proof required. Define a small set of strategic pillars. Define what the brand will not try to be. Record trade-offs and rejected options. Preserve uncertainty where evidence is weak. Produce a Persian Brand Strategy Foundation and a structured Phase 4 Identity Strategy Brief.

---

# 223. Compact Strategic Logic Template

At the end of Phase 3, the system should be able to express the strategy internally in this form:

```text
We prioritize [TARGET]
who struggle with / want [CORE NEED]
in the context of [CATEGORY / SITUATION].

They currently compare us with [COMPETITIVE REFERENCE].

We want to be known for [POSITIONING TERRITORY].

Our meaningful difference is [DIFFERENTIATION].

The main value we deliver is [VALUE PROPOSITION].

We promise [BRAND PROMISE].

Customers should believe this because [REASONS TO BELIEVE].

We will consistently deliver this through:
1. [PILLAR]
2. [PILLAR]
3. [PILLAR]

We will deliberately not compete on [BOUNDARY].

This strategy is supported by [EVIDENCE]
and remains exposed to [RISKS / VALIDATION NEEDS].
```

The customer-facing version of this logic must be rendered naturally in Persian.

---

# 224. Strategy Summary Schema

```yaml
brand_strategy_foundation:

  strategic_objective:

  target_market:
    primary:
    secondary:
    deprioritized:

  customer:
    situation:
    core_problem:
    desired_outcome:
    trigger:
    barriers:
    decision_criteria:

  category:
    frame:
    competitive_reference:

  territory:

  positioning:
    statement:
    core_difference:
    parity_points:
    difference_points:

  value_proposition:
    core:
    functional:
    emotional:
    economic:

  brand_promise:

  reasons_to_believe:

  strategic_pillars:
    - pillar_1
    - pillar_2
    - pillar_3

  boundaries:
    must_be:
    must_not_be:
    will_not_compete_on:

  rejected_options:

  strategy_risks:

  validation_backlog:

  phase_4_identity_brief:
```

---

# 225. Final Completion Statement

When Phase 3 is fully complete, the final internal status may be:

```yaml
phase:
  3

name:
  Strategy & Brand Direction

status:
  COMPLETE

deliverable:
  Brand Strategy Foundation

customer_language:
  Persian

next_phase:
  Phase 4 — Brand Identity Strategy & Brand Character
```

