# DIGITAL MARKET Decision Context

This glossary defines the product concepts used to specialize the eight-phase interview and its strategic outputs. It is the shared language for Wayfinder decisions and later implementation.

## Business classification

**Business Type**:
The most specific catalogued trade/business identity used to seed domain vocabulary and default context, currently represented by a `BT-xxxx` taxonomy entry.
_Avoid_: treating the business type as the complete behavior model.

**Primary Archetype**:
A derived structural summary of the business's dominant operating pattern, used for coarse specialization when more specific context is unavailable.
_Avoid_: Context Axis, Business Type.

**Context Axis**:
One orthogonal dimension of business reality whose confirmed value can causally change questions, evidence requirements, metrics, actions, risks, gates, or output modules.
_Avoid_: tag, label, archetype.

**Canonical Context Axes**:
The fixed 15-axis set: customerModel, offerType, channelModel, revenueModel, maturity, scale, salesMotion, geography, branchStructure, founderRole, purchaseCycle, relationshipModel, regulatoryProfile, operationalComplexity, brandArchitecture.
_Avoid_: including Primary Archetype as an axis.

**Overlay**:
An additional non-exclusive specialization condition that activates domain-specific decision modules alongside the primary archetype and context axes.
_Avoid_: forcing a hybrid business into a single exclusive archetype.

**Business Context**:
The current confirmed/inferred composition of Business Type, Primary Archetype, Context Axes, and active Overlays that governs specialization.
_Avoid_: taxonomy record.

## Evidence and state

**Confirmed Context Value**:
A context value explicitly supplied or confirmed by the user and therefore authoritative over taxonomy defaults.

**Inferred Context Value**:
A context value proposed from taxonomy, free text, prior evidence, or rules and carrying provenance plus confidence until confirmed.

**Causal Effect Contract**:
The declared set of downstream decisions a Context Axis value is allowed or expected to influence, including explicit documented no-op behavior.

**Specialized Decision Module**:
A composable domain module with explicit activation conditions, prerequisites, Decision Nodes, evidence, calculations, metrics, risks, output effects, gates, invalidation edges, and knowledge dependencies.

**Reachable Dependent**:
A downstream question, calculation, decision, metric, action, risk, gate, or output claim connected to changed evidence through the canonical dependency graph.

**Stale Item**:
A previously valid downstream item whose prerequisite evidence changed and therefore requires recomputation or review.

**Provisional Fallback**:
A lower-confidence generic module used only when specialization context is insufficient or no specialized module exists.
_Avoid_: presenting fallback output as fully specialized.

## Interview behavior

**Decision Node**:
A canonical interview decision with explicit prerequisites, evidence requirements, branch conditions, and downstream effects.
_Avoid_: assuming every rendered question is an independent decision.

**Adaptive Branch**:
A change to the active Decision Node topology caused by evidence or Business Context, such as adding, removing, reordering, or skipping a node.
_Avoid_: wording-only personalization.

**Unknown**:
An explicitly missing or uncertain piece of evidence that remains visible and may trigger data collection, accepted-risk continuation, or a critical gate.

**Critical Recommendation**:
A recommendation whose cost, compliance impact, irreversibility, or downstream effect is high enough that its governing high-impact context values must be confirmed first.

## Specialization authority

**Specialization Precedence**:
The canonical conflict order: user-confirmed evidence, then legal/safety/compliance constraint, then exact axis rule, exact Business Type specialization, industry module, Primary Archetype default, and finally generic fallback.
_Avoid_: lower-confidence defaults overriding confirmed evidence.

**Additive Composition**:
The default behavior where all compatible active modules contribute to the decision graph and are deduplicated by canonical Decision Node ID.
_Avoid_: choosing one “winning” module when multiple business realities are simultaneously true.
