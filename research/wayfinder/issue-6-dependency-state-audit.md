# Wayfinder Research — Issue #6: Question Dependency Graph & Stale-State Audit

## Summary

The project has a real dependency table in `adaptiveInterview.js`, but it is **not the canonical state invalidation graph**.

Two different mechanisms coexist:

1. **Question adaptation dependencies** in `DEPENDENCIES`: used to prepend prior-answer context and trigger a handful of special option rules.
2. **Phase invalidation** in `OrchestratorEngine.invalidateDependentPhases()`: when any answer changes, every later phase with data is invalidated wholesale.

This means the system is simultaneously **under-specified** for question branching and **over-broad** for stale-state invalidation.

## Findings

### 1. Dependency table is useful but presentation-oriented
The dependency table links fields such as:
- customer pain -> pricing;
- geography/budget/pain -> primary channel;
- target segment + positioning + offer -> brand promise;
- archetype + promise -> traits;
- target segment + promise + voice -> elevator hook.

However, `adaptQuestionToAnswers()` usually only:
- reads dependency values;
- sets `dependsOn`;
- builds `contextAnchor`;
- prefixes the existing question text.

Only a small subset of questions change options/logic.

### 2. No single dependency graph owns recomputation
The dependency table does not drive `invalidateDependentPhases()`.
Instead, any material edit in phase P invalidates all phases P+1..8 that contain data.

Example:
- editing a phase-1 goal invalidates every later completed phase;
- even downstream fields with no dependency path from that goal are marked for review.

### 3. Review invalidation is phase-wide
For each invalidated later phase, every previously answered field is inserted into `reviewRequired[phase]`.

This is safe but coarse:
- high false-positive review load;
- no explanation of *which upstream answer* invalidated each downstream answer;
- impossible to selectively keep unaffected decisions confirmed.

### 4. Same-phase dependency invalidation is incomplete
When a non-description answer in the current phase is changed:
- that exact answer is superseded;
- downstream phases are invalidated;
- but later answers in the **same phase** are not generally marked stale based on the dependency table.

The special case for editing `step0_description` does mark other phase-1 answers for review, but this is bespoke rather than graph-driven.

### 5. Contradiction graph is separate
`ContradictionEngine` has rule-specific `resolutionTargets` and `affectedPhases`, but those edges are not unified with the adaptive dependency table.

So there are currently at least three relationship systems:
- question dependencies;
- phase invalidation;
- contradiction resolution targets.

### 6. AI lifecycle correctness is strong
Revision/phase/question-ID checks prevent a late AI response from overwriting newer state.
This should be preserved.

## Target model implied by the audit

The redesign should define one canonical directed graph whose nodes are:
- input/evidence fields;
- derived context axes;
- decisions;
- calculations;
- contradictions;
- deliverable claims/actions.

Each edge needs a type, for example:
- `requires`;
- `influences`;
- `invalidates`;
- `contradicts`;
- `derives`.

Then an edit can compute the exact transitive invalidation frontier instead of invalidating every later phase.

## Required tests

1. Editing one answer invalidates only reachable dependents.
2. Same-phase downstream answers are invalidated when their prerequisites change.
3. Unrelated later decisions remain confirmed.
4. Every stale item can explain which changed answer caused invalidation.
5. Contradiction resolution targets are represented in the same graph.
6. AI revisions cannot create edges or bypass graph ownership.

## Resolution

The current system has dependency metadata, but not a unified dependency/state model.
The main structural gap is **split-brain dependency ownership** plus coarse phase-wide invalidation.
