export const KNOWLEDGE_LIFECYCLE = Object.freeze([
  'DRAFT', 'NEEDS_RESEARCH', 'VERIFIED', 'CANONICAL', 'STALE', 'DEPRECATED',
]);

export const AUTHORITY_RANK = Object.freeze({ A: 1, B: 2, C: 3, D: 4 });

export const FRESHNESS_DEFAULTS_DAYS = Object.freeze({
  VOLATILE_PRICE: 7,
  PLATFORM_POLICY: 30,
  LEGAL: 30,
  TAX: 30,
  REGULATORY: 30,
  MACRO: 90,
  INDUSTRY_REPORT: 365,
  INTERNAL_PLAYBOOK: 365,
  ACADEMIC: 1095,
});

const ADMISSIBLE_STATUS = new Set(['VERIFIED', 'CANONICAL']);
const DAY_MS = 24 * 60 * 60 * 1000;

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function evaluateSourceFreshness(source, { asOf = new Date() } = {}) {
  if (!source) return { admissible: false, state: 'MISSING', reason: 'SOURCE_MISSING' };
  if (source.status === 'DEPRECATED') return { admissible: false, state: 'DEPRECATED', reason: 'SOURCE_DEPRECATED' };
  if (source.status === 'STALE') return { admissible: false, state: 'STALE', reason: 'SOURCE_MARKED_STALE' };
  if (!ADMISSIBLE_STATUS.has(source.status)) {
    return { admissible: false, state: source.status || 'DRAFT', reason: 'SOURCE_NOT_VERIFIED' };
  }

  const now = asOf instanceof Date ? asOf : new Date(asOf);
  const effectiveUntil = parseDate(source.effective_until);
  if (effectiveUntil && effectiveUntil.getTime() < now.getTime()) {
    return { admissible: false, state: 'STALE', reason: 'EFFECTIVE_PERIOD_ENDED' };
  }

  const verifiedAt = parseDate(source.verified_at);
  const maxAgeDays = source.max_age_days ?? FRESHNESS_DEFAULTS_DAYS[source.freshness_class] ?? null;
  if (verifiedAt && maxAgeDays) {
    const ageDays = (now.getTime() - verifiedAt.getTime()) / DAY_MS;
    if (ageDays > maxAgeDays) {
      // Foundational academic concepts get a review-due signal; age alone does not
      // make an otherwise applicable academic source false.
      if (source.freshness_class === 'ACADEMIC') {
        return { admissible: true, state: 'REVIEW_DUE', reason: 'ACADEMIC_REVIEW_DUE', ageDays, maxAgeDays };
      }
      return { admissible: false, state: 'STALE', reason: 'MAX_AGE_EXCEEDED', ageDays, maxAgeDays };
    }
    return { admissible: true, state: 'FRESH', reason: 'WITHIN_MAX_AGE', ageDays, maxAgeDays };
  }

  if (['LEGAL', 'TAX', 'REGULATORY', 'PLATFORM_POLICY', 'VOLATILE_PRICE', 'MACRO'].includes(source.freshness_class)) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'MISSING_VERIFIED_AT' };
  }
  return { admissible: true, state: 'FRESH', reason: 'NO_TIME_BOUND_REQUIRED' };
}

function authorityAllowed(requirement, tier) {
  const rank = AUTHORITY_RANK[tier] ?? 99;
  if (requirement === 'A') return rank <= 1;
  if (requirement === 'A_OR_B') return rank <= 2;
  if (requirement === 'A_TO_C') return rank <= 3;
  return rank <= 4;
}

export function evaluateKnowledgeClaim(claim, sourceRegistry, {
  asOf = new Date(),
  criticalUse = false,
} = {}) {
  if (!claim) return { admissible: false, status: 'MISSING', reasons: ['CLAIM_MISSING'], sources: [] };
  if (!ADMISSIBLE_STATUS.has(claim.status)) {
    return { admissible: false, status: claim.status, reasons: ['CLAIM_NOT_ADMISSIBLE'], sources: [] };
  }

  // Source verification is necessary but not sufficient for claims that declare
  // an explicit verification/completeness gate (for example, mutable legal
  // amendment chains). This prevents a manual status flip to VERIFIED from
  // bypassing required claim-level decomposition or coverage work.
  if (claim.verification_gate && claim.verification_gate.status !== 'COMPLETE') {
    const gateType = claim.verification_gate.type || 'UNSPECIFIED';
    const blockers = claim.verification_gate.blocking_reasons || [];
    return {
      admissible: false,
      status: 'REQUIRES_VERIFICATION',
      reasons: [
        `VERIFICATION_GATE_INCOMPLETE:${gateType}`,
        ...blockers.map(reason => `VERIFICATION_GATE_BLOCKER:${reason}`),
      ],
      sources: [],
    };
  }

  const sourceIds = claim.source_ids || [];
  const evaluations = sourceIds.map(sourceId => {
    const source = sourceRegistry?.[sourceId] || null;
    const freshness = evaluateSourceFreshness(source, { asOf });
    const authority = source ? authorityAllowed(claim.authority_requirement || 'ANY', source.authority_tier) : false;
    return { sourceId, source, freshness, authority };
  });

  const reasons = [];
  if (!sourceIds.length) reasons.push('NO_SOURCES');
  for (const result of evaluations) {
    if (!result.source) reasons.push(`MISSING_SOURCE:${result.sourceId}`);
    else {
      if (!result.authority) reasons.push(`AUTHORITY_TOO_LOW:${result.sourceId}`);
      if (!result.freshness.admissible) reasons.push(`${result.freshness.reason}:${result.sourceId}`);
    }
  }

  if (criticalUse && ['LEGAL_REQUIREMENT', 'EXTERNAL_FACT', 'THRESHOLD'].includes(claim.claim_kind)) {
    if (!evaluations.some(item => item.source?.authority_tier === 'A' && item.freshness.admissible)) {
      reasons.push('CRITICAL_USE_REQUIRES_FRESH_TIER_A');
    }
  }

  return {
    admissible: reasons.length === 0,
    status: reasons.length ? 'REQUIRES_VERIFICATION' : claim.status,
    reasons,
    sources: evaluations,
  };
}

const tokenize = text => String(text || '').toLowerCase().match(/[\p{L}\p{N}_-]+/gu) || [];

export function retrieveCanonicalKnowledge(query, entries, claims, sources, {
  phase = null,
  moduleIds = [],
  decisionNodeIds = [],
  jurisdiction = null,
  criticalUse = false,
  asOf = new Date(),
  topK = 5,
} = {}) {
  const queryTokens = tokenize(query).filter(token => token.length > 1);
  const modules = new Set(moduleIds);
  const decisions = new Set(decisionNodeIds);
  const ranked = [];

  for (const entry of entries || []) {
    const claim = claims?.[entry.claim_id];
    const admission = evaluateKnowledgeClaim(claim, sources, { asOf, criticalUse });
    if (!admission.admissible) continue;
    if (phase && !(entry.phases || []).includes(Number(phase))) continue;
    if (jurisdiction && ![jurisdiction, 'GENERAL', 'PRODUCT_INTERNAL'].includes(entry.jurisdiction_or_scope)) continue;

    const entryModules = new Set(entry.module_ids || []);
    const entryDecisions = new Set(entry.decision_node_ids || []);
    if (modules.size && ![...modules].some(id => entryModules.has(id))) continue;
    if (decisions.size && ![...decisions].some(id => entryDecisions.has(id))) continue;

    const text = tokenize([
      entry.content,
      entry.knowledge_node_id,
      ...(entry.module_ids || []),
      ...(entry.decision_node_ids || []),
    ].join(' '));
    const corpus = text.join(' ');
    let score = queryTokens.reduce((sum, token) => sum + (corpus.split(token).length - 1), 0);
    score += 12 * [...modules].filter(id => entryModules.has(id)).length;
    score += 15 * [...decisions].filter(id => entryDecisions.has(id)).length;
    if (phase && entry.phases?.includes(Number(phase))) score += 5;
    if (jurisdiction && entry.jurisdiction_or_scope === jurisdiction) score += 4;

    if (score > 0 || modules.size || decisions.size) ranked.push({ score, entry, admission });
  }

  ranked.sort((a, b) => b.score - a.score || a.entry.retrieval_id.localeCompare(b.entry.retrieval_id));
  return ranked.slice(0, topK);
}
