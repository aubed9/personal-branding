import { makeStableId } from './graph/ids.js';

export const CLAIM_TYPES = Object.freeze({
  USER_FACT: 'USER_FACT',
  USER_DECISION: 'USER_DECISION',
  ASSUMPTION: 'ASSUMPTION',
  UNKNOWN: 'UNKNOWN',
  CALCULATION: 'CALCULATION',
  EXTERNAL_FACT: 'EXTERNAL_FACT',
  SYSTEM_INFERENCE: 'SYSTEM_INFERENCE',
  PROPOSAL: 'PROPOSAL',
  RISK: 'RISK',
  CONTRADICTION: 'CONTRADICTION',
});

export const CLAIM_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  PROVISIONAL: 'PROVISIONAL',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  BLOCKED: 'BLOCKED',
  STALE: 'STALE',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  SUPERSEDED: 'SUPERSEDED',
});

export const PROPOSAL_STATUS = Object.freeze({
  CANDIDATE: 'CANDIDATE',
  RECOMMENDED: 'RECOMMENDED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  SUPERSEDED: 'SUPERSEDED',
  STALE: 'STALE',
});

export const SECTION_STATUS = Object.freeze({
  CONFIRMED: 'CONFIRMED',
  PROVISIONAL: 'PROVISIONAL',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  BLOCKED: 'BLOCKED',
  STALE: 'STALE',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
});

const uniq = values => [...new Set((values || []).filter(Boolean))];

export function createCanonicalClaim({
  claimId = null,
  stableKey,
  claimType,
  statement,
  status = CLAIM_STATUS.DRAFT,
  phase = null,
  moduleId = null,
  sectionId = null,
  dependencyIds = [],
  evidenceIds = [],
  sourceClaimIds = [],
  sourceIds = [],
  ruleId = null,
  confidence = null,
  verificationState = null,
  proposalStatus = null,
  createdRevision = 0,
  lastValidatedRevision = createdRevision,
  supersedes = null,
  supersededBy = null,
  metadata = {},
} = {}) {
  const id = claimId || makeStableId('CLM', { claimType, stableKey, phase, moduleId });
  return {
    claimId: id,
    claimType,
    statement: String(statement || ''),
    status,
    phase,
    moduleId,
    sectionId,
    dependencyIds: uniq(dependencyIds),
    evidenceIds: uniq(evidenceIds),
    sourceClaimIds: uniq(sourceClaimIds),
    sourceIds: uniq(sourceIds),
    ruleId,
    confidence,
    verificationState,
    proposalStatus,
    createdRevision,
    lastValidatedRevision,
    supersedes,
    supersededBy,
    metadata: metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? { ...metadata } : {},
  };
}

export function validateCanonicalClaim(claim) {
  const errors = [];
  if (!claim || typeof claim !== 'object') return { valid: false, errors: ['Claim must be an object.'] };
  if (!claim.claimId) errors.push('claimId is required.');
  if (!Object.values(CLAIM_TYPES).includes(claim.claimType)) errors.push(`Invalid claimType: ${claim.claimType}`);
  if (!Object.values(CLAIM_STATUS).includes(claim.status)) errors.push(`Invalid claim status: ${claim.status}`);
  if (!claim.statement?.trim()) errors.push('Claim statement is required.');

  const evidenceCount = claim.evidenceIds?.length || 0;
  const dependencyCount = claim.dependencyIds?.length || 0;
  if ([CLAIM_TYPES.USER_FACT, CLAIM_TYPES.USER_DECISION].includes(claim.claimType) && evidenceCount === 0) {
    errors.push(`${claim.claimType} requires at least one evidenceId.`);
  }
  if (claim.claimType === CLAIM_TYPES.CALCULATION && (evidenceCount === 0 || !claim.ruleId)) {
    errors.push('CALCULATION requires input evidenceIds and a formula/ruleId.');
  }
  if (claim.claimType === CLAIM_TYPES.EXTERNAL_FACT && ((claim.sourceClaimIds?.length || 0) === 0 || (claim.sourceIds?.length || 0) === 0)) {
    errors.push('EXTERNAL_FACT requires sourceClaimIds and sourceIds.');
  }
  if (claim.claimType === CLAIM_TYPES.SYSTEM_INFERENCE && (evidenceCount + dependencyCount === 0 || !(claim.ruleId || claim.moduleId))) {
    errors.push('SYSTEM_INFERENCE requires supporting IDs and a ruleId/moduleId.');
  }
  if (claim.claimType === CLAIM_TYPES.PROPOSAL) {
    if (evidenceCount + dependencyCount === 0) errors.push('PROPOSAL requires supporting evidence/dependency IDs.');
    if (!(claim.ruleId || claim.moduleId)) errors.push('PROPOSAL requires a ruleId/moduleId.');
    if (!Object.values(PROPOSAL_STATUS).includes(claim.proposalStatus)) errors.push('PROPOSAL requires a valid proposalStatus.');
  }
  if ([CLAIM_TYPES.RISK, CLAIM_TYPES.CONTRADICTION].includes(claim.claimType) && evidenceCount + dependencyCount === 0) {
    errors.push(`${claim.claimType} requires supporting/conflicting IDs.`);
  }
  return { valid: errors.length === 0, errors };
}

export function createCanonicalSection({
  sectionId = null,
  stableKey,
  sectionType,
  activationReason,
  applicability = 'APPLICABLE',
  status = SECTION_STATUS.PROVISIONAL,
  claimIds = [],
  dependencyIds = [],
  blockerIds = [],
  contradictionIds = [],
  omissionReason = null,
  knowledgeNodeIds = [],
  sourceIds = [],
} = {}) {
  return {
    sectionId: sectionId || makeStableId('SEC', { sectionType, stableKey }),
    sectionType,
    activationReason: String(activationReason || ''),
    applicability,
    status,
    claimIds: uniq(claimIds),
    dependencyIds: uniq(dependencyIds),
    blockerIds: uniq(blockerIds),
    contradictionIds: uniq(contradictionIds),
    omissionReason,
    knowledgeNodeIds: uniq(knowledgeNodeIds),
    sourceIds: uniq(sourceIds),
  };
}

export function validateCanonicalSection(section) {
  const errors = [];
  if (!section || typeof section !== 'object') return { valid: false, errors: ['Section must be an object.'] };
  if (!section.sectionId) errors.push('sectionId is required.');
  if (!section.sectionType) errors.push('sectionType is required.');
  if (!Object.values(SECTION_STATUS).includes(section.status)) errors.push(`Invalid section status: ${section.status}`);
  if (!section.activationReason?.trim() && section.status !== SECTION_STATUS.NOT_APPLICABLE) errors.push('Active sections require activationReason.');
  if (section.status === SECTION_STATUS.NOT_APPLICABLE && !section.omissionReason?.trim()) errors.push('NOT_APPLICABLE sections require omissionReason.');
  return { valid: errors.length === 0, errors };
}
