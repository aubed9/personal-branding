import { INTERVIEW_FIELDS, activeAnswers, migrateAnswerRecords } from '../../services/interviewSchema.js';
import { calculateUnitEconomics } from '../../services/unitEconomics.js';
import { buildStrategicActions } from '../../services/strategicActions.js';
import {
  CLAIM_STATUS,
  CLAIM_TYPES,
  PROPOSAL_STATUS,
  createCanonicalClaim,
  validateCanonicalClaim,
} from '../../reasoning/contracts.js';
import { ENTITY_STATUS, NODE_TYPES } from '../../reasoning/graph/index.js';
import { DECISION_MODULES_BY_ID, getPhaseModuleProjection } from '../../reasoning/modules/index.js';

const ANSWER_KIND_TO_CLAIM = Object.freeze({
  FACT: CLAIM_TYPES.USER_FACT,
  DECISION: CLAIM_TYPES.USER_DECISION,
  ASSUMPTION: CLAIM_TYPES.ASSUMPTION,
  UNKNOWN: CLAIM_TYPES.UNKNOWN,
});

const GRAPH_TO_CLAIM_STATUS = Object.freeze({
  [ENTITY_STATUS.CONFIRMED]: CLAIM_STATUS.CONFIRMED,
  [ENTITY_STATUS.PROVISIONAL]: CLAIM_STATUS.PROVISIONAL,
  [ENTITY_STATUS.NEEDS_REVIEW]: CLAIM_STATUS.NEEDS_REVIEW,
  [ENTITY_STATUS.BLOCKED]: CLAIM_STATUS.BLOCKED,
  [ENTITY_STATUS.STALE]: CLAIM_STATUS.STALE,
  [ENTITY_STATUS.NOT_APPLICABLE]: CLAIM_STATUS.NOT_APPLICABLE,
  [ENTITY_STATUS.SUPERSEDED]: CLAIM_STATUS.SUPERSEDED,
  [ENTITY_STATUS.DEPRECATED]: CLAIM_STATUS.SUPERSEDED,
  [ENTITY_STATUS.ACTIVE]: CLAIM_STATUS.PROVISIONAL,
  [ENTITY_STATUS.DRAFT]: CLAIM_STATUS.DRAFT,
});

const uniq = values => [...new Set((values || []).filter(Boolean))];

export function buildEvidenceRows(phaseData = {}, answerRecords = []) {
  const current = activeAnswers(answerRecords.length ? answerRecords : migrateAnswerRecords(phaseData));
  return INTERVIEW_FIELDS.map(spec => {
    const answer = current.find(item => item.phase === spec.phase && item.questionId === spec.questionId);
    return {
      ...spec,
      answer: answer || null,
      text: answer?.text || null,
      evidenceIds: answer ? [answer.id] : [],
    };
  });
}

function graphEvidenceByAnswerId(graph) {
  const map = {};
  for (const node of Object.values(graph?.nodes || {})) {
    if (node.type === NODE_TYPES.EVIDENCE && node.payload?.answerId) map[node.payload.answerId] = node;
  }
  return map;
}

function fallbackClaimStatus(answer, metadata) {
  if (metadata.phaseStatus?.[answer.phase] === 'INVALIDATED') return CLAIM_STATUS.NEEDS_REVIEW;
  if ((metadata.reviewRequired?.[answer.phase] || []).includes(answer.questionId)) return CLAIM_STATUS.NEEDS_REVIEW;
  if (answer.kind === 'UNKNOWN') {
    const related = (metadata.unknowns || []).find(u =>
      u.answerId === answer.id || (u.phase === answer.phase && u.questionId === answer.questionId)
    );
    return related && ['ACCEPTED_RISK', 'RESOLVED'].includes(related.status)
      ? CLAIM_STATUS.PROVISIONAL
      : CLAIM_STATUS.NEEDS_REVIEW;
  }
  return metadata.completedPhases?.[answer.phase] ? CLAIM_STATUS.CONFIRMED : CLAIM_STATUS.DRAFT;
}

function claimStatusForAnswer(answer, metadata, graphIndex) {
  const node = graphIndex[answer.id];
  return GRAPH_TO_CLAIM_STATUS[node?.status] || fallbackClaimStatus(answer, metadata);
}

function worstStatus(statuses = []) {
  const rank = {
    [CLAIM_STATUS.BLOCKED]: 7,
    [CLAIM_STATUS.STALE]: 6,
    [CLAIM_STATUS.NEEDS_REVIEW]: 5,
    [CLAIM_STATUS.DRAFT]: 4,
    [CLAIM_STATUS.PROVISIONAL]: 3,
    [CLAIM_STATUS.CONFIRMED]: 2,
    [CLAIM_STATUS.NOT_APPLICABLE]: 1,
    [CLAIM_STATUS.SUPERSEDED]: 0,
  };
  return statuses.reduce((worst, value) => (rank[value] || 0) > (rank[worst] || 0) ? value : worst, CLAIM_STATUS.CONFIRMED);
}

function validateOrThrow(claim) {
  const result = validateCanonicalClaim(claim);
  if (!result.valid) throw new Error(`Invalid canonical output claim ${claim.claimId}: ${result.errors.join('; ')}`);
  return claim;
}

function answerClaim(row, metadata, graphIndex) {
  if (!row.answer) return null;
  const answer = row.answer;
  const claimType = ANSWER_KIND_TO_CLAIM[answer.kind] || CLAIM_TYPES.USER_FACT;
  return validateOrThrow(createCanonicalClaim({
    stableKey: { kind: 'ANSWER', answerId: answer.id },
    claimType,
    statement: `${row.label}: ${answer.text}`,
    status: claimStatusForAnswer(answer, metadata, graphIndex),
    phase: row.phase,
    sectionId: null,
    dependencyIds: [],
    evidenceIds: [answer.id],
    confidence: claimType === CLAIM_TYPES.ASSUMPTION ? null : 1,
    verificationState: claimType === CLAIM_TYPES.USER_FACT
      ? 'USER_PROVIDED_NOT_EXTERNALLY_VERIFIED'
      : claimType === CLAIM_TYPES.USER_DECISION
        ? 'USER_APPROVED'
        : claimType === CLAIM_TYPES.UNKNOWN
          ? 'UNKNOWN'
          : 'UNVERIFIED_ASSUMPTION',
    createdRevision: Number(answer.revision) || 0,
    lastValidatedRevision: Number(metadata.revision) || Number(answer.revision) || 0,
    supersedes: answer.supersedes || null,
    supersededBy: answer.supersededBy || null,
    metadata: {
      answerId: answer.id,
      questionId: row.questionId,
      field: row.field,
      label: row.label,
      rawKind: answer.kind,
      optionValue: answer.optionValue ?? null,
    },
  }));
}

function supportStatus(evidenceIds, answerClaimsByEvidenceId) {
  const statuses = evidenceIds.flatMap(id => answerClaimsByEvidenceId[id]?.status ? [answerClaimsByEvidenceId[id].status] : []);
  return statuses.length ? worstStatus(statuses) : CLAIM_STATUS.PROVISIONAL;
}

function buildCalculationClaim(rows, metadata, answerClaimsByEvidenceId) {
  const row = rows.find(item => item.phase === 1 && item.field === 'unitEconomics');
  const calculation = calculateUnitEconomics(row?.answer);
  if (!calculation) return { calculation: null, claim: null };
  const status = supportStatus(calculation.evidenceIds, answerClaimsByEvidenceId);
  const statement = [
    `حاشیه مشارکت هر واحد: ${calculation.contributionPerUnit}`,
    `فروش سربه‌سر ماهانه: ${calculation.breakEvenUnits === null ? 'قابل تعیین نیست' : calculation.breakEvenUnits}`,
    calculation.monthlyOperatingResult === null ? null : `نتیجه عملیاتی ماهانه بر اساس ورودی‌های ثبت‌شده: ${calculation.monthlyOperatingResult}`,
  ].filter(Boolean).join('؛ ');

  const claim = validateOrThrow(createCanonicalClaim({
    stableKey: { kind: 'UNIT_ECONOMICS', evidenceIds: calculation.evidenceIds },
    claimType: CLAIM_TYPES.CALCULATION,
    statement,
    status,
    phase: 1,
    dependencyIds: [],
    evidenceIds: calculation.evidenceIds,
    ruleId: 'FORMULA-UNIT-ECONOMICS-V1',
    confidence: calculation.isEstimate ? null : 1,
    verificationState: calculation.isEstimate ? 'ESTIMATE' : 'DERIVED_FROM_USER_INPUTS',
    createdRevision: Number(row?.answer?.revision) || 0,
    lastValidatedRevision: Number(metadata.revision) || 0,
    metadata: {
      formulaId: 'FORMULA-UNIT-ECONOMICS-V1',
      calculation,
    },
  }));
  return { calculation, claim };
}

function buildProposalClaims(phase, rows, calculation, businessContext, metadata, answerClaimsByEvidenceId) {
  return buildStrategicActions(phase, rows, calculation, businessContext).map(action => {
    const status = supportStatus(action.evidenceIds, answerClaimsByEvidenceId);
    return validateOrThrow(createCanonicalClaim({
      stableKey: { kind: 'PROPOSAL', phase, ruleId: action.ruleId, evidenceIds: [...action.evidenceIds].sort() },
      claimType: CLAIM_TYPES.PROPOSAL,
      statement: action.statement,
      status: [CLAIM_STATUS.BLOCKED, CLAIM_STATUS.STALE, CLAIM_STATUS.NEEDS_REVIEW].includes(status)
        ? status
        : CLAIM_STATUS.PROVISIONAL,
      phase,
      dependencyIds: action.evidenceIds,
      evidenceIds: action.evidenceIds,
      ruleId: action.ruleId,
      moduleId: action.moduleId || null,
      proposalStatus: action.proposalStatus || PROPOSAL_STATUS.RECOMMENDED,
      confidence: null,
      verificationState: 'SYSTEM_RECOMMENDATION',
      createdRevision: Number(metadata.revision) || 0,
      lastValidatedRevision: Number(metadata.revision) || 0,
      metadata: {
        horizonDays: action.horizonDays,
        successMeasure: action.successMeasure,
        objective: action.objective || action.successMeasure,
        invalidationCondition: action.invalidationCondition,
        owner: action.owner ?? null,
      },
    }));
  });
}

function buildModuleClaims(phase, businessContext, metadata) {
  if (!businessContext) return { inferenceClaims: [], riskClaims: [], moduleProjection: null };
  const projection = getPhaseModuleProjection(businessContext, phase);
  const graph = metadata.reasoningGraphV3;
  const graphNodeByDecisionId = {};
  const graphRiskNodes = [];
  for (const node of Object.values(graph?.nodes || {})) {
    if (node.type === NODE_TYPES.DECISION_NODE && node.payload?.decisionNodeId) graphNodeByDecisionId[node.payload.decisionNodeId] = node;
    if (node.type === NODE_TYPES.RISK) graphRiskNodes.push(node);
  }

  const inferenceClaims = projection.decisionNodes.map(node => {
    const moduleId = node.moduleIds?.[0] || projection.moduleIds.find(id =>
      DECISION_MODULES_BY_ID[id]?.decisionNodes?.some(item => item.id === node.id)
    ) || null;
    const graphNode = graphNodeByDecisionId[node.id];
    const status = GRAPH_TO_CLAIM_STATUS[graphNode?.status] || CLAIM_STATUS.PROVISIONAL;
    const axis = moduleId ? DECISION_MODULES_BY_ID[moduleId]?.axis : null;
    return validateOrThrow(createCanonicalClaim({
      stableKey: { kind: 'MODULE_DECISION', decisionNodeId: node.id },
      claimType: CLAIM_TYPES.SYSTEM_INFERENCE,
      statement: `تمرکز تصمیمی فعال: ${node.title}`,
      status,
      phase,
      moduleId,
      dependencyIds: axis ? [`AXIS:${axis}`] : [`MODULE:${moduleId || 'UNKNOWN'}`],
      evidenceIds: [],
      ruleId: moduleId || 'MODULE-PROJECTION',
      confidence: null,
      verificationState: 'RULE_DERIVED_FROM_BUSINESS_CONTEXT',
      createdRevision: Number(metadata.revision) || 0,
      lastValidatedRevision: Number(metadata.revision) || 0,
      metadata: {
        decisionNodeId: node.id,
        contributingModules: node.moduleIds || (moduleId ? [moduleId] : []),
      },
    }));
  });

  const riskGroups = new Map();
  for (const node of graphRiskNodes) {
    const moduleId = node.moduleId || null;
    const riskId = node.payload?.riskId || 'UNSPECIFIED_RISK';
    const key = `${moduleId || 'SYSTEM'}:${riskId}`;
    const group = riskGroups.get(key) || {
      moduleId,
      riskId,
      nodes: [],
      affectedPhases: new Set(),
      statuses: [],
    };
    group.nodes.push(node);
    if (Number.isInteger(node.phase)) group.affectedPhases.add(node.phase);
    group.statuses.push(GRAPH_TO_CLAIM_STATUS[node.status] || CLAIM_STATUS.PROVISIONAL);
    riskGroups.set(key, group);
  }

  const riskClaims = [...riskGroups.values()]
    .filter(group => group.affectedPhases.has(phase))
    .map(group => validateOrThrow(createCanonicalClaim({
      stableKey: { kind: 'MODULE_RISK', moduleId: group.moduleId, riskId: group.riskId },
      claimType: CLAIM_TYPES.RISK,
      statement: `ریسک فعال در ماژول ${group.moduleId || 'سیستم'}: ${group.riskId}`,
      status: worstStatus(group.statuses),
      phase: null,
      moduleId: group.moduleId,
      dependencyIds: group.nodes.map(node => node.id),
      evidenceIds: [],
      ruleId: group.moduleId || 'GRAPH-RISK',
      confidence: null,
      verificationState: 'RULE_DERIVED_RISK',
      createdRevision: Math.min(...group.nodes.map(node => Number(node.createdRevision) || 0)),
      lastValidatedRevision: Math.max(...group.nodes.map(node => Number(node.lastValidatedRevision) || Number(metadata.revision) || 0)),
      metadata: {
        graphNodeIds: group.nodes.map(node => node.id).sort(),
        riskId: group.riskId,
        affectedPhases: [...group.affectedPhases].sort((a, b) => a - b),
      },
    })));

  return { inferenceClaims, riskClaims, moduleProjection: projection };
}

function buildContradictionClaims(contradictions, rows, metadata) {
  const answerByQuestion = Object.fromEntries(rows.filter(row => row.answer).map(row => [row.questionId, row.answer]));
  return (contradictions || [])
    .filter(item => item.resolutionStatus === 'UNRESOLVED')
    .flatMap(item => {
      const evidenceIds = uniq(Object.values(item.resolutionTargets || {}).flatMap(questionId => {
        const answer = answerByQuestion[questionId];
        return answer ? [answer.id] : [];
      }));
      if (!evidenceIds.length) return [];
      const phaseCandidates = Object.keys(item.resolutionTargets || {}).map(Number).filter(Number.isInteger);
      const affectedPhases = [...new Set(phaseCandidates)].sort((a, b) => a - b);
      return [validateOrThrow(createCanonicalClaim({
        stableKey: { kind: 'CONTRADICTION', id: item.id, ruleId: item.ruleId || null },
        claimType: CLAIM_TYPES.CONTRADICTION,
        statement: `${item.statementA || 'ادعای اول'} ↔ ${item.statementB || 'ادعای دوم'}؛ ${item.resolutionQuestion || 'نیازمند رفع تعارض'}`,
        status: CLAIM_STATUS.BLOCKED,
        phase: null,
        dependencyIds: evidenceIds,
        evidenceIds,
        ruleId: item.ruleId || 'CONTRADICTION',
        confidence: 1,
        verificationState: 'UNRESOLVED_CONTRADICTION',
        createdRevision: Number(metadata.revision) || 0,
        lastValidatedRevision: Number(metadata.revision) || 0,
        metadata: {
          contradictionId: item.id,
          severity: item.severity,
          resolutionTargets: item.resolutionTargets || {},
          affectedPhases,
        },
      }))];
    });
}

function buildLedger(claims) {
  const ledger = {};
  for (const claim of claims) {
    const existing = ledger[claim.claimId];
    if (existing && JSON.stringify(existing) !== JSON.stringify(claim)) {
      throw new Error(`Canonical claim collision: ${claim.claimId}`);
    }
    ledger[claim.claimId] = claim;
  }
  return ledger;
}

export function buildCanonicalOutputClaims({
  phaseData = {},
  businessContext = null,
  unknowns = [],
  contradictions = [],
  metadata = {},
} = {}) {
  const rows = buildEvidenceRows(phaseData, metadata.answerRecords || []);
  const graphIndex = graphEvidenceByAnswerId(metadata.reasoningGraphV3);
  const answerClaims = rows.map(row => answerClaim(row, { ...metadata, unknowns }, graphIndex)).filter(Boolean);
  const answerClaimsByEvidenceId = Object.fromEntries(answerClaims.flatMap(claim => claim.evidenceIds.map(id => [id, claim])));
  const { calculation, claim: calculationClaim } = buildCalculationClaim(rows, metadata, answerClaimsByEvidenceId);

  const claims = [...answerClaims];
  if (calculationClaim) claims.push(calculationClaim);

  const moduleProjections = {};
  for (let phase = 1; phase <= 8; phase++) {
    const module = buildModuleClaims(phase, businessContext, metadata);
    moduleProjections[phase] = module.moduleProjection;
    claims.push(...module.inferenceClaims, ...module.riskClaims);
    claims.push(...buildProposalClaims(phase, rows, calculation, businessContext, metadata, answerClaimsByEvidenceId));
  }
  claims.push(...buildContradictionClaims(contradictions, rows, metadata));

  const ledger = buildLedger(claims);
  return {
    rows,
    ledger,
    claims: Object.values(ledger),
    calculation,
    moduleProjections,
    answerClaimsByEvidenceId,
  };
}

export function claimsForPhase(model, phase) {
  const p = Number(phase);
  return model.claims.filter(claim => claim.phase === p || claim.metadata?.affectedPhases?.includes(p));
}

export function claimPresentation(claim) {
  const evidence = claim.evidenceIds?.length ? ` [evidence: ${claim.evidenceIds.join(', ')}]` : '';
  return `[${claim.claimType}/${claim.status}] ${claim.statement} [${claim.claimId}]${evidence}`;
}
