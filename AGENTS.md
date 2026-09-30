# AGENTS.md — DIGITAL MARKET Platform

Guidance for AI agents operating on this repository.

## Agent skills

### Issue tracker

Issues and wayfinding maps are tracked via Local Markdown under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context domain architecture. See `docs/agents/domain.md`.

### Wayfinding operations

When running `/wayfinder`:
- The map lives at `.scratch/<effort>/map.md`.
- Child tickets live at `.scratch/<effort>/issues/NN-<slug>.md`.
- Rule: **Plan, don't do**. Every ticket holds a question whose resolution is a decision, not a slice of product code to execute.
- Frontier tickets are unblocked, unclaimed tickets. Claim before working (`Status: claimed`).
- On resolution, append answer to `## Answer`, set `Status: resolved`, and append a context pointer to `map.md` Decisions so far.
- Hand off to `/to-spec` once the map is clear.

---

## Core Guidelines & Safety

1. **Persian Communication**: All user-facing communications and UI deliverables are in natural, professional Persian.
2. **Deterministic Evidence**: Never hallucinate business facts or force synthetic financial metrics. Unknowns must be recorded as explicit hypotheses.
3. **Phase Gate Integrity**: Never bypass `validatePhaseGate()`. All 8 phases must satisfy their exit criteria.
4. **API Credential Security**: Never commit or expose API keys in exports, client-side source, or test mocks.
