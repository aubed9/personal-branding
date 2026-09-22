import { PHASES_DATA } from '../../data/phase1Templates.js';
import {
  CLAIM_STATUS,
  CLAIM_TYPES,
  SECTION_STATUS,
  createCanonicalSection,
  validateCanonicalSection,
} from '../../reasoning/contracts.js';
import { DECISION_MODULES_BY_ID } from '../../reasoning/modules/index.js';
import { validatePhaseGate } from '../../services/phaseGateValidator.js';
import { claimPresentation, claimsForPhase } from './claims.js';

const STATUS_RANK = Object.freeze({
  [CLAIM_STATUS.BLOCKED]: 6,
  [CLAIM_STATUS.STALE]: 5,
  [CLAIM_STATUS.NEEDS_REVIEW]: 4,
  [CLAIM_STATUS.DRAFT]: 3,
  [CLAIM_STATUS.PROVISIONAL]: 2,
  [CLAIM_STATUS.CONFIRMED]: 1,
});

function claimGroupStatus(claims, { empty = SECTION_STATUS.NOT_APPLICABLE } = {}) {
  if (!claims.length) return empty;
  const worst = claims.reduce((acc, claim) =>
    (STATUS_RANK[claim.status] || 0) > (STATUS_RANK[acc] || 0) ? claim.status : acc
  , CLAIM_STATUS.CONFIRMED);
  if (worst === CLAIM_STATUS.BLOCKED) return SECTION_STATUS.BLOCKED;
  if (worst === CLAIM_STATUS.STALE) return SECTION_STATUS.STALE;
  if (worst === CLAIM_STATUS.NEEDS_REVIEW) return SECTION_STATUS.NEEDS_REVIEW;
  if (worst === CLAIM_STATUS.CONFIRMED) return SECTION_STATUS.CONFIRMED;
  return SECTION_STATUS.PROVISIONAL;
}

function sectionOrThrow(input, presentation = {}) {
  const section = { ...createCanonicalSection(input), ...presentation };
  const validation = validateCanonicalSection(section);
  if (!validation.valid) throw new Error(`Invalid canonical output section ${section.sectionId}: ${validation.errors.join('; ')}`);
  return section;
}

const TYPES = {
  evidence: new Set([CLAIM_TYPES.USER_FACT, CLAIM_TYPES.ASSUMPTION, CLAIM_TYPES.UNKNOWN, CLAIM_TYPES.EXTERNAL_FACT]),
  decisions: new Set([CLAIM_TYPES.USER_DECISION, CLAIM_TYPES.SYSTEM_INFERENCE]),
  risks: new Set([CLAIM_TYPES.RISK, CLAIM_TYPES.CONTRADICTION]),
  actions: new Set([CLAIM_TYPES.PROPOSAL, CLAIM_TYPES.CALCULATION]),
};

function dedupe(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function dependenciesFor(claims) {
  return dedupe(claims.flatMap(claim => [...(claim.dependencyIds || []), ...(claim.evidenceIds || [])]));
}

function phaseStatus(phase, state, claims) {
  const stale = state.phaseStatus?.[phase] === 'INVALIDATED';
  const blocked = claims.some(claim => claim.status === CLAIM_STATUS.BLOCKED);
  const needsReview = claims.some(claim => [CLAIM_STATUS.STALE, CLAIM_STATUS.NEEDS_REVIEW].includes(claim.status));
  if (blocked) return 'BLOCKED';
  // A graph-invalidated downstream phase explicitly needs review.
  if (stale) return 'NEEDS_REVIEW';
  // The currently edited/incomplete phase remains a draft while exact claims/sections
  // retain NEEDS_REVIEW/STALE, so certainty is never upgraded.
  if (needsReview) return 'DRAFT';
  const gate = validatePhaseGate(phase, state);
  if (state.completedPhases?.[phase] && gate.passed) return 'CONFIRMED';
  return 'DRAFT';
}

function moduleSubsections(phaseClaims, moduleProjection) {
  if (!moduleProjection) return [];
  return moduleProjection.moduleIds.map(moduleId => {
    const def = DECISION_MODULES_BY_ID[moduleId];
    const claims = phaseClaims.filter(claim => claim.moduleId === moduleId && claim.claimType === CLAIM_TYPES.SYSTEM_INFERENCE);
    return {
      id: `MODULE-${moduleId}`,
      title: def?.title || moduleId,
      moduleId,
      activationReason: def ? `${def.axis} در بافتار فعلی، ماژول ${moduleId} را فعال کرده است.` : 'فعال‌شده توسط بافتار فعلی.',
      claimIds: claims.map(claim => claim.claimId),
      items: claims.map(claimPresentation),
      evidenceRequirements: def?.evidenceRequirements || [],
      knowledgeDependencies: def?.knowledgeDependencies || [],
    };
  }).filter(section => section.claimIds.length || section.evidenceRequirements.length);
}

function activeMeasurements(moduleProjection) {
  if (!moduleProjection) return [];
  const metrics = [];
  for (const moduleId of moduleProjection.moduleIds) {
    const def = DECISION_MODULES_BY_ID[moduleId];
    for (const metric of def?.metrics || []) {
      metrics.push({
        metric,
        moduleId,
        formula: null,
        green: 'پس از ثبت baseline و هدف کاربر تعیین شود',
        yellow: 'تعیین نشده',
        red: 'تعیین نشده',
      });
    }
  }
  return [...new Map(metrics.map(item => [`${item.moduleId}:${item.metric}`, item])).values()];
}

export function projectPhaseDeliverable(phase, state, model) {
  const p = Number(phase);
  const phaseClaims = claimsForPhase(model, p);
  const status = phaseStatus(p, state, phaseClaims);
  const gate = validatePhaseGate(p, state);
  const moduleProjection = model.moduleProjections[p];

  const evidenceClaims = phaseClaims.filter(claim => TYPES.evidence.has(claim.claimType));
  const userDecisionClaims = phaseClaims.filter(claim => claim.claimType === CLAIM_TYPES.USER_DECISION);
  const inferenceClaims = phaseClaims.filter(claim => claim.claimType === CLAIM_TYPES.SYSTEM_INFERENCE);
  const riskClaims = phaseClaims.filter(claim => TYPES.risks.has(claim.claimType));
  const actionClaims = phaseClaims.filter(claim => TYPES.actions.has(claim.claimType));

  const sections = [
    sectionOrThrow({
      stableKey: { phase: p, type: 'STATUS_VALIDITY' },
      sectionType: 'STATUS_VALIDITY',
      activationReason: 'این پوسته برای نمایش اعتبار هر سند فاز الزامی است.',
      applicability: 'APPLICABLE',
      status: status === 'CONFIRMED' ? SECTION_STATUS.CONFIRMED
        : status === 'BLOCKED' ? SECTION_STATUS.BLOCKED
          : status === 'NEEDS_REVIEW' ? SECTION_STATUS.NEEDS_REVIEW
            : SECTION_STATUS.PROVISIONAL,
      claimIds: [],
      dependencyIds: [],
      blockerIds: gate.blockingReasons || [],
      contradictionIds: riskClaims.filter(c => c.claimType === CLAIM_TYPES.CONTRADICTION).map(c => c.claimId),
      knowledgeNodeIds: [],
      sourceIds: [],
    }, {
      id: `P${p}_STATUS`,
      title: '۱. وضعیت و اعتبار',
      content: {
        'وضعیت سند': status,
        'گیت فاز': gate.passed ? 'تأیید شده' : 'تأیید نشده',
        'Revision مبنا': state.revision || 0,
        'ماژول‌های تصمیمی فعال': moduleProjection?.moduleIds?.length || 0,
      },
      items: (gate.blockingReasons || []).map(reason => `[BLOCKER] ${reason}`),
    }),

    sectionOrThrow({
      stableKey: { phase: p, type: 'EVIDENCE' },
      sectionType: 'EVIDENCE',
      activationReason: 'نمایش فقط داده‌های ثبت‌شده، فرضیات و مجهولات همین فاز.',
      applicability: evidenceClaims.length ? 'APPLICABLE' : 'NOT_APPLICABLE',
      status: claimGroupStatus(evidenceClaims),
      claimIds: evidenceClaims.map(claim => claim.claimId),
      dependencyIds: dependenciesFor(evidenceClaims),
      blockerIds: [],
      contradictionIds: [],
      omissionReason: evidenceClaims.length ? null : 'هیچ ورودی ثبت‌شده‌ای برای این فاز وجود ندارد.',
      knowledgeNodeIds: [],
      sourceIds: dedupe(evidenceClaims.flatMap(c => c.sourceIds || [])),
    }, {
      id: `P${p}_EVIDENCE`,
      title: '۲. ورودی‌های تأییدشده، فرضیات و مجهولات',
      items: evidenceClaims.length
        ? evidenceClaims.map(claimPresentation)
        : ['[UNKNOWN] هنوز پاسخی ثبت نشده است.'],
    }),

    sectionOrThrow({
      stableKey: { phase: p, type: 'DECISIONS' },
      sectionType: 'DECISIONS',
      activationReason: 'انتخاب‌های کاربر و تمرکزهای تصمیمی فعال از گراف reasoning.',
      applicability: (userDecisionClaims.length || inferenceClaims.length) ? 'APPLICABLE' : 'NOT_APPLICABLE',
      status: claimGroupStatus([...userDecisionClaims, ...inferenceClaims]),
      claimIds: [...userDecisionClaims, ...inferenceClaims].map(claim => claim.claimId),
      dependencyIds: dependenciesFor([...userDecisionClaims, ...inferenceClaims]),
      blockerIds: [],
      contradictionIds: [],
      omissionReason: (userDecisionClaims.length || inferenceClaims.length) ? null : 'هیچ تصمیم یا ماژول تخصصی فعالی برای این بخش وجود ندارد.',
      knowledgeNodeIds: moduleProjection?.knowledgeDependencies || [],
      sourceIds: [],
    }, {
      id: `P${p}_DECISIONS`,
      title: '۳. تصمیم‌ها و تمرکزهای تخصصی فعال',
      items: userDecisionClaims.map(claimPresentation),
      subsections: moduleSubsections(phaseClaims, moduleProjection),
    }),

    sectionOrThrow({
      stableKey: { phase: p, type: 'RISKS' },
      sectionType: 'RISKS',
      activationReason: 'فقط ریسک‌ها و تعارض‌های فعال و قابل‌ردیابی نمایش داده می‌شوند.',
      applicability: riskClaims.length ? 'APPLICABLE' : 'NOT_APPLICABLE',
      status: claimGroupStatus(riskClaims),
      claimIds: riskClaims.map(claim => claim.claimId),
      dependencyIds: dependenciesFor(riskClaims),
      blockerIds: riskClaims.filter(c => c.status === CLAIM_STATUS.BLOCKED).map(c => c.claimId),
      contradictionIds: riskClaims.filter(c => c.claimType === CLAIM_TYPES.CONTRADICTION).map(c => c.claimId),
      omissionReason: riskClaims.length ? null : 'ریسک یا تعارض فعالِ قابل‌ردیابی برای این فاز ثبت نشده است.',
      knowledgeNodeIds: [],
      sourceIds: [],
    }, {
      id: `P${p}_RISKS`,
      title: '۴. ریسک‌ها، موانع و تعارض‌ها',
      items: riskClaims.map(claimPresentation),
    }),

    sectionOrThrow({
      stableKey: { phase: p, type: 'ACTIONS_MEASUREMENT' },
      sectionType: 'ACTIONS_MEASUREMENT',
      activationReason: 'فقط پیشنهادهای evidence-linked، محاسبات معتبر و KPIهای ماژول فعال نمایش داده می‌شوند.',
      applicability: (actionClaims.length || moduleProjection?.metrics?.length) ? 'APPLICABLE' : 'NOT_APPLICABLE',
      status: claimGroupStatus(actionClaims, { empty: SECTION_STATUS.PROVISIONAL }),
      claimIds: actionClaims.map(claim => claim.claimId),
      dependencyIds: dependenciesFor(actionClaims),
      blockerIds: [],
      contradictionIds: [],
      omissionReason: (actionClaims.length || moduleProjection?.metrics?.length) ? null : 'اقدام یا شاخص تصمیم‌ساز فعالی برای این فاز وجود ندارد.',
      knowledgeNodeIds: moduleProjection?.knowledgeDependencies || [],
      sourceIds: [],
    }, {
      id: `P${p}_ACTIONS`,
      title: '۵. اقدام‌های بعدی و سنجش',
      checklist: actionClaims
        .filter(claim => claim.claimType === CLAIM_TYPES.PROPOSAL)
        .map(claimPresentation),
      formulas: actionClaims
        .filter(claim => claim.claimType === CLAIM_TYPES.CALCULATION)
        .map(claim => ({
          name: claim.metadata?.formulaId || claim.ruleId || 'محاسبه',
          formula: claim.statement,
          description: `Claim: ${claim.claimId}`,
        })),
      kpis: activeMeasurements(moduleProjection),
    }),
  ];

  return {
    title: PHASES_DATA[p - 1]?.deliverableName || `سند فاز ${p}`,
    phase: `فاز ${p}`,
    phaseNumber: p,
    version: '5.0.0',
    date: new Date().toLocaleDateString('fa-IR'),
    status,
    sourceRevision: state.revision || 0,
    claimLedger: model.ledger,
    claimIds: phaseClaims.map(claim => claim.claimId),
    evidence: evidenceClaims.map(claim => ({
      statement: claim.statement,
      kind: claim.metadata?.rawKind || claim.claimType,
      evidenceIds: claim.evidenceIds,
      field: claim.metadata?.field || null,
      claimId: claim.claimId,
      status: claim.status,
    })),
    actions: actionClaims.filter(c => c.claimType === CLAIM_TYPES.PROPOSAL).map(claim => ({
      ruleId: claim.ruleId,
      kind: 'PROPOSAL',
      statement: claim.statement,
      evidenceIds: claim.evidenceIds,
      claimId: claim.claimId,
      proposalStatus: claim.proposalStatus,
      successMeasure: claim.metadata?.successMeasure || null,
    })),
    calculations: p === 1 && model.calculation ? [model.calculation] : [],
    sections,
    moduleProjection,
  };
}
