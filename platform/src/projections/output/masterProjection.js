import { CLAIM_TYPES } from '../../reasoning/contracts.js';
import { claimPresentation } from './claims.js';

const FINANCIAL_RULES = new Set([
  'FORMULA-UNIT-ECONOMICS-V1',
  'offer_cost_sheet',
  'repair_unit_margin',
  'capacity_before_acquisition',
  'validate_unit_margin',
  'resource_ceiling',
]);

function themeFor(claim) {
  if ([CLAIM_TYPES.RISK, CLAIM_TYPES.CONTRADICTION, CLAIM_TYPES.UNKNOWN].includes(claim.claimType)) return 'M7';
  if (claim.claimType === CLAIM_TYPES.CALCULATION || FINANCIAL_RULES.has(claim.ruleId)) return 'M6';
  if (claim.phase === 1) return 'M1';
  if (claim.phase === 2) return 'M2';
  if (claim.phase === 3) return 'M3';
  if (claim.phase >= 4 && claim.phase <= 7) return 'M4';
  if (claim.phase === 8) return 'M5';
  return 'M7';
}

const THEME_META = Object.freeze({
  M1: ['بافتار کسب‌وکار و محدودیت‌ها', 'Business Context & Constraints'],
  M2: ['شواهد مشتری و بازار', 'Customer & Market Evidence'],
  M3: ['انتخاب‌های استراتژیک', 'Strategic Choices'],
  M4: ['سیستم برند', 'Brand System'],
  M5: ['ورود به بازار و فعال‌سازی', 'Go-to-market & Activation'],
  M6: ['اقتصاد و سنجه‌ها', 'Economics & Metrics'],
  M7: ['ریسک‌ها، تعارض‌ها و مجهولات باز', 'Risks, Contradictions & Unknowns'],
});

export function projectSemanticMaster(state, model, phaseDocuments) {
  const buckets = Object.fromEntries(Object.keys(THEME_META).map(id => [id, []]));
  const assigned = {};

  for (const claim of model.claims) {
    if (claim.status === 'SUPERSEDED' || claim.status === 'NOT_APPLICABLE') continue;
    const theme = themeFor(claim);
    if (assigned[claim.claimId]) throw new Error(`Master semantic duplicate: ${claim.claimId}`);
    assigned[claim.claimId] = theme;
    buckets[theme].push(claim);
  }

  const allConfirmed = phaseDocuments.every(doc => doc.status === 'CONFIRMED');
  const sections = [
    {
      id: 'M0',
      title: 'وضعیت اعتبار و دامنه کتابچه',
      sectionType: 'MASTER_STATUS',
      status: allConfirmed ? 'CONFIRMED' : 'PROVISIONAL',
      claimIds: [],
      content: {
        'وضعیت کل': allConfirmed ? 'CONFIRMED' : 'DRAFT_OR_REVIEW_REQUIRED',
        'Revision مبنا': state.revision || 0,
        'تعداد Claimهای یکتا': Object.keys(assigned).length,
        'فازهای تأییدشده': phaseDocuments.filter(doc => doc.status === 'CONFIRMED').map(doc => doc.phaseNumber).join('، ') || 'هیچ‌کدام',
      },
      items: Object.keys(assigned).length
        ? []
        : ['[UNKNOWN] هنوز پاسخی ثبت نشده است.'],
    },
    ...Object.entries(THEME_META).map(([id, [title]]) => ({
      id,
      title,
      sectionType: 'MASTER_THEME',
      status: buckets[id].some(claim => ['BLOCKED', 'STALE', 'NEEDS_REVIEW'].includes(claim.status))
        ? 'NEEDS_REVIEW'
        : buckets[id].length ? 'PROVISIONAL' : 'NOT_APPLICABLE',
      claimIds: buckets[id].map(claim => claim.claimId),
      items: buckets[id].map(claimPresentation),
      omissionReason: buckets[id].length ? null : 'Claim قابل‌نمایشی برای این موضوع وجود ندارد.',
    })),
    {
      id: 'M8',
      title: 'ردیابی تصمیم و Provenance',
      sectionType: 'DECISION_TRACE',
      status: 'PROVISIONAL',
      claimIds: [],
      content: {
        'Claimهای یکتا': Object.keys(assigned).length,
        'Claimهای دارای Evidence': model.claims.filter(c => c.evidenceIds?.length).length,
        'Claimهای نیازمند بازبینی': model.claims.filter(c => ['BLOCKED', 'STALE', 'NEEDS_REVIEW'].includes(c.status)).length,
      },
      items: Object.entries(assigned)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([claimId, theme]) => `[TRACE] ${claimId} → ${theme}; type=${model.ledger[claimId]?.claimType}; status=${model.ledger[claimId]?.status}`),
    },
  ];

  const ids = sections.flatMap(section => section.claimIds || []);
  if (new Set(ids).size !== ids.length) throw new Error('Semantic Master contains duplicate canonical claims.');

  return {
    title: 'کتابچه جامع استراتژی برند',
    phase: 'مجموع ۸ فاز',
    phaseNumber: 'master',
    version: '5.0.0',
    date: new Date().toLocaleDateString('fa-IR'),
    status: allConfirmed ? 'CONFIRMED' : 'DRAFT',
    sourceRevision: state.revision || 0,
    claimLedger: model.ledger,
    claimIds: Object.keys(assigned),
    evidence: model.claims
      .filter(claim => [CLAIM_TYPES.USER_FACT, CLAIM_TYPES.USER_DECISION, CLAIM_TYPES.ASSUMPTION, CLAIM_TYPES.EXTERNAL_FACT].includes(claim.claimType))
      .map(claim => ({
        statement: claim.statement,
        kind: claim.metadata?.rawKind || claim.claimType,
        evidenceIds: claim.evidenceIds,
        field: claim.metadata?.field || null,
        claimId: claim.claimId,
        status: claim.status,
      })),
    actions: model.claims.filter(c => c.claimType === CLAIM_TYPES.PROPOSAL).map(claim => ({
      ruleId: claim.ruleId,
      kind: 'PROPOSAL',
      statement: claim.statement,
      evidenceIds: claim.evidenceIds,
      claimId: claim.claimId,
      proposalStatus: claim.proposalStatus,
      successMeasure: claim.metadata?.successMeasure || null,
    })),
    calculations: model.calculation ? [model.calculation] : [],
    sections,
    semanticAssignment: assigned,
    phaseBacklinks: Object.fromEntries(phaseDocuments.map(doc => [doc.phaseNumber, doc.claimIds])),
  };
}
