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
const PERSIAN_DATE_FORMATTER = new Intl.DateTimeFormat('en-US-u-ca-persian', {
  timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit',
});

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function persianDateParts(date) {
  return Object.fromEntries(PERSIAN_DATE_FORMATTER.formatToParts(date)
    .filter(part => ['year', 'month', 'day'].includes(part.type))
    .map(part => [part.type, Number(part.value)]));
}

function validEffectiveDay(year, month, day, persian) {
  if (month < 1 || month > 12 || day < 1) return false;
  if (!persian) {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
  }
  if (day <= (month <= 6 ? 31 : month <= 11 ? 30 : 29)) return true;
  if (month !== 12 || day !== 30) return false;
  // The Persian leap day is determined by the calendar itself, not by a Gregorian leap-year rule.
  return [18, 19, 20, 21, 22].some(marchDay => {
    const date = new Date(Date.UTC(year + 622, 2, marchDay, 12));
    const parts = persianDateParts(date);
    return parts.year === year && parts.month === 12 && parts.day === 30;
  });
}

function parseVerifiedAt(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2}))?$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  // Verification timestamps are Gregorian ISO dates, never Solar Hijri effective dates.
  if (Number(year) < 1600 || !validEffectiveDay(Number(year), Number(month), Number(day), false)) return null;
  if (hour !== undefined && (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59)) return null;
  return parseDate(value);
}

function compareEffectiveDate(value, asOf) {
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!dateOnly) {
    const timestampDate = /^(\d{4})-(\d{2})-(\d{2})T/.exec(value);
    if (!timestampDate) return null;
    const [year, month, day] = timestampDate.slice(1).map(Number);
    // Persian effective dates are date-only; a timestamp must have a real Gregorian date.
    if ((year >= 1300 && year <= 1499) || !validEffectiveDay(year, month, day, false)) return null;
    const instant = parseDate(value);
    return instant ? instant.getTime() - asOf.getTime() : null;
  }

  const [year, month, day] = dateOnly.slice(1).map(Number);
  const persian = year >= 1300 && year <= 1499;
  if (!validEffectiveDay(year, month, day, persian)) return null;
  let asOfYear;
  let asOfMonth;
  let asOfDay;
  if (persian) {
    const parts = persianDateParts(asOf);
    ({ year: asOfYear, month: asOfMonth, day: asOfDay } = parts);
  } else {
    asOfYear = asOf.getUTCFullYear();
    asOfMonth = asOf.getUTCMonth() + 1;
    asOfDay = asOf.getUTCDate();
  }
  // Date-only effective periods include both boundary days in their own calendar.
  return (year * 10000 + month * 100 + day) - (asOfYear * 10000 + asOfMonth * 100 + asOfDay);
}

export function evaluateSourceFreshness(source, { asOf = new Date() } = {}) {
  if (!source) return { admissible: false, state: 'MISSING', reason: 'SOURCE_MISSING' };
  if (source.status === 'DEPRECATED') return { admissible: false, state: 'DEPRECATED', reason: 'SOURCE_DEPRECATED' };
  if (source.status === 'STALE') return { admissible: false, state: 'STALE', reason: 'SOURCE_MARKED_STALE' };
  if (!ADMISSIBLE_STATUS.has(source.status)) {
    return { admissible: false, state: source.status || 'DRAFT', reason: 'SOURCE_NOT_VERIFIED' };
  }

  const now = asOf instanceof Date ? asOf : new Date(asOf);
  if (Number.isNaN(now.getTime())) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'INVALID_AS_OF' };
  }
  const effectiveFrom = compareEffectiveDate(source.effective_from, now);
  const effectiveUntil = compareEffectiveDate(source.effective_until, now);
  if (source.effective_from && effectiveFrom === null) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'INVALID_EFFECTIVE_FROM' };
  }
  if (source.effective_until && effectiveUntil === null) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'INVALID_EFFECTIVE_UNTIL' };
  }
  if (effectiveFrom !== null && effectiveFrom > 0) {
    return { admissible: false, state: 'NOT_EFFECTIVE', reason: 'EFFECTIVE_PERIOD_NOT_STARTED' };
  }
  if (effectiveUntil !== null && effectiveUntil < 0) {
    return { admissible: false, state: 'STALE', reason: 'EFFECTIVE_PERIOD_ENDED' };
  }

  const verifiedAt = parseVerifiedAt(source.verified_at);
  if (source.verified_at !== null && source.verified_at !== undefined && !verifiedAt) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'INVALID_VERIFIED_AT' };
  }
  if (verifiedAt && verifiedAt.getTime() > now.getTime()) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'VERIFIED_AFTER_AS_OF' };
  }
  const maxAgeDays = source.max_age_days ?? FRESHNESS_DEFAULTS_DAYS[source.freshness_class] ?? null;
  if (!verifiedAt && maxAgeDays !== null) {
    return { admissible: false, state: 'REQUIRES_VERIFICATION', reason: 'MISSING_VERIFIED_AT' };
  }
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

  const sourceIds = claim.source_ids || [];
  const evaluations = sourceIds.map(sourceId => {
    const source = sourceRegistry?.[sourceId] || null;
    const freshness = evaluateSourceFreshness(source, { asOf });
    const authority = source ? authorityAllowed(claim.authority_requirement || 'ANY', source.authority_tier) : false;
    return { sourceId, source, freshness, authority };
  });

  const reasons = [];
  if (!sourceIds.length) reasons.push('NO_SOURCES');
  const claimMaxAgeDays = claim.max_age_days;
  const timeBoundClaim = Number.isFinite(claimMaxAgeDays)
    && claimMaxAgeDays >= 0 && claim.freshness_class !== 'ACADEMIC';
  const evaluationDate = asOf instanceof Date ? asOf : new Date(asOf);
  for (const result of evaluations) {
    if (!result.source) reasons.push(`MISSING_SOURCE:${result.sourceId}`);
    else {
      if (!result.authority) reasons.push(`AUTHORITY_TOO_LOW:${result.sourceId}`);
      if (!result.freshness.admissible) reasons.push(`${result.freshness.reason}:${result.sourceId}`);
      else if (timeBoundClaim) {
        const verifiedAt = parseVerifiedAt(result.source.verified_at);
        if (!verifiedAt) reasons.push(`CLAIM_MISSING_VERIFIED_AT:${result.sourceId}`);
        else if (evaluationDate.getTime() - verifiedAt.getTime() > claimMaxAgeDays * DAY_MS) {
          reasons.push(`CLAIM_MAX_AGE_EXCEEDED:${result.sourceId}`);
        }
      }
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
    // An inapplicable claim must not consume a ranked retrieval slot.
    const requiredModules = claim?.applicability?.required_module_ids_all;
    if (Array.isArray(requiredModules) && requiredModules.some(id => !modules.has(id))) continue;
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
