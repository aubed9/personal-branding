import { composeDecisionModules } from '../modules/index.js';
import { buildCanonicalOutputClaims } from '../../projections/output/claims.js';
import { auditOutputModel, semanticClaimKey } from '../../projections/output/audit.js';
import { CLAIM_TYPES } from '../contracts.js';

const uniqSorted = values => [...new Set((values || []).filter(Boolean))].sort();

export function captureReasoningSnapshot({
  context,
  phaseData = {},
  metadata = {},
  unknowns = [],
  contradictions = [],
} = {}) {
  const composition = composeDecisionModules(context || {});
  const model = buildCanonicalOutputClaims({
    phaseData,
    businessContext: context,
    unknowns,
    contradictions,
    metadata,
  });
  const audit = auditOutputModel(model, { specializedContext: Boolean(context) });

  const generatedClaims = model.claims.filter(claim =>
    [CLAIM_TYPES.SYSTEM_INFERENCE, CLAIM_TYPES.PROPOSAL, CLAIM_TYPES.RISK, CLAIM_TYPES.CONTRADICTION, CLAIM_TYPES.CALCULATION, CLAIM_TYPES.EXTERNAL_FACT].includes(claim.claimType)
  );

  return {
    moduleIds: uniqSorted(composition.moduleIds),
    decisionNodeIds: uniqSorted(composition.decisionNodes.map(node => node.id)),
    evidenceRequirements: uniqSorted(composition.evidenceRequirements),
    metrics: uniqSorted(composition.metrics),
    risks: uniqSorted(composition.risks),
    outputSections: uniqSorted(composition.outputSections),
    gates: uniqSorted(composition.gates),
    knowledgeDependencies: uniqSorted(composition.knowledgeDependencies),
    actionRuleIds: uniqSorted(model.claims
      .filter(claim => claim.claimType === CLAIM_TYPES.PROPOSAL)
      .map(claim => claim.ruleId)),
    generatedClaimKeys: uniqSorted(generatedClaims.map(semanticClaimKey)),
    calculationStatements: uniqSorted(model.claims
      .filter(claim => claim.claimType === CLAIM_TYPES.CALCULATION)
      .map(claim => claim.statement)),
    audit,
    claimCount: model.claims.length,
  };
}
