import { CLAIM_STATUS, CLAIM_TYPES } from '../../reasoning/contracts.js';

const BAD_CERTAINTY = new Set([CLAIM_STATUS.BLOCKED, CLAIM_STATUS.STALE, CLAIM_STATUS.NEEDS_REVIEW]);
const normalize = value => String(value || '')
  .toLowerCase()
  .replace(/[\u200c\u200f\u202a-\u202e]/g, ' ')
  .replace(/[\[\]{}()«»"'.,:;!?؟،؛|/_\\-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function hasSupport(claim) {
  const evidence = claim.evidenceIds?.length || 0;
  const deps = claim.dependencyIds?.length || 0;
  switch (claim.claimType) {
    case CLAIM_TYPES.USER_FACT:
    case CLAIM_TYPES.USER_DECISION:
    case CLAIM_TYPES.ASSUMPTION:
    case CLAIM_TYPES.UNKNOWN:
      return evidence > 0;
    case CLAIM_TYPES.CALCULATION:
      return evidence > 0 && Boolean(claim.ruleId);
    case CLAIM_TYPES.EXTERNAL_FACT:
      return (claim.sourceClaimIds?.length || 0) > 0 && (claim.sourceIds?.length || 0) > 0;
    case CLAIM_TYPES.SYSTEM_INFERENCE:
      return evidence + deps > 0 && Boolean(claim.ruleId || claim.moduleId);
    case CLAIM_TYPES.PROPOSAL:
      return evidence + deps > 0 && Boolean(claim.ruleId || claim.moduleId);
    case CLAIM_TYPES.RISK:
    case CLAIM_TYPES.CONTRADICTION:
      return evidence + deps > 0;
    default:
      return false;
  }
}

export function semanticClaimKey(claim) {
  // User facts/decisions from different canonical fields are intentionally distinct even
  // when wording happens to match. Generated claims should not duplicate semantically.
  if ([CLAIM_TYPES.USER_FACT, CLAIM_TYPES.USER_DECISION, CLAIM_TYPES.ASSUMPTION, CLAIM_TYPES.UNKNOWN].includes(claim.claimType)) {
    return `${claim.claimType}:${claim.metadata?.field || claim.claimId}`;
  }
  return [
    claim.claimType,
    claim.ruleId || '',
    claim.moduleId || '',
    normalize(claim.statement),
  ].join(':');
}

export function auditOutputModel(model, { specializedContext = false } = {}) {
  const claims = model?.claims || [];
  const decisionDriving = claims.filter(claim => claim.status !== CLAIM_STATUS.SUPERSEDED && claim.status !== CLAIM_STATUS.NOT_APPLICABLE);
  const supported = decisionDriving.filter(hasSupport);
  const unsupported = decisionDriving.filter(claim => !hasSupport(claim));

  const generated = decisionDriving.filter(claim =>
    [CLAIM_TYPES.SYSTEM_INFERENCE, CLAIM_TYPES.PROPOSAL, CLAIM_TYPES.RISK, CLAIM_TYPES.CONTRADICTION, CLAIM_TYPES.CALCULATION, CLAIM_TYPES.EXTERNAL_FACT].includes(claim.claimType)
  );
  const genericFallbacks = generated.filter(claim => {
    if (claim.claimType !== CLAIM_TYPES.PROPOSAL) return false;
    return !claim.ruleId || claim.ruleId === 'GENERIC_FALLBACK' || claim.moduleId === 'GENERIC_FALLBACK';
  });

  const staleConfirmed = decisionDriving.filter(claim =>
    claim.status === CLAIM_STATUS.CONFIRMED &&
    (claim.verificationState === 'STALE' || claim.metadata?.sourceStatus === 'STALE' || claim.metadata?.upstreamStatus === 'STALE')
  );

  const certaintyUpgrades = decisionDriving.filter(claim => {
    const upstream = claim.metadata?.upstreamStatus;
    return claim.status === CLAIM_STATUS.CONFIRMED && upstream && BAD_CERTAINTY.has(upstream);
  });

  const semantic = new Map();
  const semanticDuplicates = [];
  for (const claim of decisionDriving) {
    const key = semanticClaimKey(claim);
    const prior = semantic.get(key);
    if (prior && prior.claimId !== claim.claimId) semanticDuplicates.push([prior.claimId, claim.claimId]);
    else semantic.set(key, claim);
  }

  return {
    totalDecisionDrivingClaims: decisionDriving.length,
    evidenceCoveredClaims: supported.length,
    evidenceCoverageRate: decisionDriving.length ? supported.length / decisionDriving.length : 1,
    unsupportedClaimIds: unsupported.map(claim => claim.claimId),
    genericFallbackCount: specializedContext ? genericFallbacks.length : 0,
    genericFallbackRatio: specializedContext && generated.length ? genericFallbacks.length / generated.length : 0,
    staleConfirmedLeakageCount: staleConfirmed.length,
    staleConfirmedClaimIds: staleConfirmed.map(claim => claim.claimId),
    illegalCertaintyUpgradeCount: certaintyUpgrades.length,
    illegalCertaintyUpgradeClaimIds: certaintyUpgrades.map(claim => claim.claimId),
    semanticDuplicateCount: semanticDuplicates.length,
    semanticDuplicatePairs: semanticDuplicates,
  };
}

export function assertOutputAcceptance(model, options = {}) {
  const audit = auditOutputModel(model, options);
  const errors = [];
  if (audit.evidenceCoverageRate !== 1) errors.push(`Evidence Coverage must be 100%; unsupported: ${audit.unsupportedClaimIds.join(', ')}`);
  if (audit.genericFallbackRatio !== 0) errors.push(`Generic Fallback Ratio must be 0%; count=${audit.genericFallbackCount}`);
  if (audit.staleConfirmedLeakageCount !== 0) errors.push(`Stale-to-CONFIRMED leakage must be 0; claims=${audit.staleConfirmedClaimIds.join(', ')}`);
  if (audit.illegalCertaintyUpgradeCount !== 0) errors.push(`Illegal certainty upgrades must be 0; claims=${audit.illegalCertaintyUpgradeClaimIds.join(', ')}`);
  if (audit.semanticDuplicateCount !== 0) errors.push(`Semantic duplicate count must be 0; pairs=${JSON.stringify(audit.semanticDuplicatePairs)}`);
  return { valid: errors.length === 0, errors, audit };
}
