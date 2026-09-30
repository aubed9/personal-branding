/**
 * Knowledge Resolver & Proposal Provenance Engine
 *
 * Connects the canonical Wiki decision plane to the interview engine and deliverable outputs:
 * 1. Resolves proposal-to-user-answer evidence links.
 * 2. Emits epistemic classification: فرضیه (HYPOTHESIS), پیشنهاد (RECOMMENDATION),
 *    انتخاب کاربر (USER_CHOICE), داده گزارش‌شده (REPORTED_FACT).
 * 3. Identifies missing data and execution blockers without fabricating synthetic figures.
 * 4. Strictly prevents future-phase knowledge leakage and cross-domain pollution.
 */

import {
  CANONICAL_EXTERNAL_KNOWLEDGE_CLAIMS,
  CANONICAL_EXTERNAL_RETRIEVAL_ENTRIES,
  CANONICAL_EXTERNAL_SOURCE_REGISTRY,
} from '../knowledge/canonicalExternalKnowledge.generated.js';

export const EPISTEMIC_TYPES = Object.freeze({
  HYPOTHESIS: 'فرضیه',
  RECOMMENDATION: 'پیشنهاد',
  USER_CHOICE: 'انتخاب کاربر',
  REPORTED_FACT: 'داده گزارش‌شده',
});

// Domain exclusion keyword dictionary for cross-domain leakage prevention
const DOMAIN_EXCLUSIONS = Object.freeze({
  HEALTH_BEAUTY: ['خودرو', 'تعمیرگاه', 'رستوران', 'تراشکاری', 'قالب‌سازی', 'ماشین‌کاری', 'سرویس روغن'],
  AUTOMOTIVE: ['سالن زیبایی', 'مراقبت مو', 'کافه', 'رستوران', 'چلوکباب', 'پزشکی', 'دندان‌پزشکی'],
  FOOD_HOSPITALITY: ['تعمیرگاه', 'دیتیلینگ', 'نرم‌افزار مودیان', 'تراشکاری', 'لیزر پوست'],
  IT_SOFTWARE: ['ضایعات غذا', 'تعویض روغن', 'سالن زیبایی', 'دوخت تریکو', 'قالب صنعتی'],
  B2B_MANUFACTURING: ['کافه', 'سالن زیبایی', 'رستوران', 'فنجان قهوه', 'آرایشگاه'],
});

/**
 * Parses compound user answers separating known facts from unmeasured unknowns.
 * Example: "مرجوعی به علت سایز است، ولی هزینه برگشت را نمی‌دانم"
 */
export function parseCompoundAnswer(text, fieldName = 'general') {
  if (!text || typeof text !== 'string') {
    return { isCompound: false, knownPart: null, unknownPart: null };
  }

  const trimmed = text.trim();
  const unknownPattern = /(?:اما|ولی|ولی هنوز|اما هنوز|ولی دقیقاً|اما دقیقاً)?\s*(?:نمی‌دانم|نمیدانم|مشخص نیست|معلوم نیست|حساب نکرده‌ام|ثبت نشده|دقیق نیست|نامعلوم)/;
  const match = trimmed.match(unknownPattern);

  if (!match) {
    return { isCompound: false, knownPart: trimmed, unknownPart: null };
  }

  const splitIndex = match.index;
  const beforeText = trimmed.slice(0, splitIndex).replace(/[،,؛;\s]+$/, '').trim();
  const unknownFragment = trimmed.slice(splitIndex).trim();

  // If there is a meaningful known clause before the unknown marker
  if (beforeText.length > 3) {
    let unknownField = 'unmeasured_metric';
    let unknownReason = 'شاخص عددی یا هزینه نامعلوم است';

    // Check both the unknown fragment AND the preceding clause for cost/rate keywords.
    // Example: "هزینه برگشت را نمی‌دانم" — 'هزینه' is in beforeText, 'نمی‌دانم' is the fragment.
    const combinedContext = `${beforeText} ${unknownFragment}`;
    if (/هزینه|قیمت|مبلغ|تومان|ریال/.test(combinedContext)) {
      unknownField = `${fieldName}_cost`;
      unknownReason = 'هزینه یا مبلغ مالی نامعلوم است و نباید با عدد فرضی جایگزین شود';
    } else if (/درصد|نرخ|تعداد|آمار/.test(combinedContext)) {
      unknownField = `${fieldName}_rate`;
      unknownReason = 'نرخ یا کمیت دقیق نامعلوم است';
    }

    return {
      isCompound: true,
      knownPart: {
        field: fieldName,
        value: beforeText,
      },
      unknownPart: {
        field: unknownField,
        isUnknown: true,
        category: 'UNMEASURED_TIMING',
        reason: unknownReason,
        rawFragment: unknownFragment,
      },
    };
  }

  // Purely unknown answer
  return {
    isCompound: false,
    knownPart: null,
    unknownPart: {
      field: fieldName,
      isUnknown: true,
      category: 'EXPLICIT_IGNORANCE',
      reason: trimmed,
    },
  };
}

/**
 * Checks for negative intent to prevent treating disclaimers as promises.
 * Example: "نتیجه را تضمین نمی‌کنیم" must not be treated as a guarantee.
 */
export function detectNegativeIntent(text) {
  if (!text || typeof text !== 'string') return { isNegated: false, hasGuaranteeClaim: false };

  const isNegated = /(?:تضمین\s*(?:نمی‌کنیم|نمیکنیم|نیست|نداریم)|فاقد\s*تضمین|وعده\s*قطعی\s*نمی‌دهیم|بدون\s*ادعای\s*قطعی)/.test(text);
  // Positive guarantee patterns (only when NOT negated):
  // - تضمین می‌کنیم / تضمین میکنیم
  // - صددرصد تضمینی (adjective form, reversed order)
  // - تضمینی و قطعی / تضمینی
  // - ۱۰۰٪ تضمین / ۱۰۰ درصد تضمین
  // - نتیجه قطعی
  const positiveGuarantee = /(?:تضمین\s*(?:می‌کنیم|میکنیم|صددرصد|۱۰۰٪|قطعی)|صددرصد\s*تضمینی|تضمینی\s*و\s*قطعی|۱۰۰\s*(?:درصد|٪)\s*تضمین|نتیجه\s*قطعی)/.test(text) && !isNegated;

  return {
    isNegated,
    hasGuaranteeClaim: positiveGuarantee,
  };
}

/**
 * Resolves full provenance metadata for a strategic proposal or decision node.
 */
export function resolveProposalTrace(proposal, {
  businessContext = null,
  answerRecords = [],
  phaseNumber = 1,
  unknowns = [],
} = {}) {
  const proposalText = proposal?.statement || proposal?.title || '';
  const evidenceIds = proposal?.evidenceIds || [];

  // 1. Identify which active user answers support this proposal
  const supportingAnswers = (answerRecords || []).filter(record =>
    evidenceIds.includes(record.id) ||
    evidenceIds.includes(record.evidenceId) ||
    evidenceIds.includes(record.questionId)
  );

  const activeAnswer = supportingAnswers[0] || null;
  const reliesOnAnswerId = activeAnswer?.id || activeAnswer?.questionId || (evidenceIds[0] ?? 'DIRECT_INPUT');
  const userFactSnippet = activeAnswer?.text || activeAnswer?.optionLabel || null;

  // 2. Resolve matching Wiki article and version
  let wikiNodeId = proposal?.knowledgeNodeId || null;
  let wikiArticle = 'wiki/README.md';
  let wikiVersion = 'v3.0.0-canonical';

  if (!wikiNodeId) {
    if (/ضایعات|غذا|آشپزخانه/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-RESTAURANT';
    else if (/سرویس|خودرو|تعمیرگاه/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-AUTOMOTIVE';
    else if (/پارچه|دوخت|نساجی|سایز/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-TEXTILE';
    else if (/اشتراک|SaaS|نرم‌افزار/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-SAAS-GENERAL';
    else if (/مالیات|مودیان/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-TAX-SAAS';
    else if (/موجودی|انقضا|قفسه/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-LOCAL-RETAIL';
    else if (/تراشکاری|قالب|قطعه|صنعتی/.test(proposalText)) wikiNodeId = 'KB-DOMAIN-MACHINING';
    else wikiNodeId = `KB-PHASE-${phaseNumber}-FOUNDATION`;
  }

  // 3. Epistemic Classification
  let epistemicType = EPISTEMIC_TYPES.RECOMMENDATION;
  if (proposal?.kind === 'USER_CHOICE' || activeAnswer?.sourceKind === 'CHOICE') {
    epistemicType = EPISTEMIC_TYPES.USER_CHOICE;
  } else if (proposal?.kind === 'FACT' || activeAnswer?.sourceKind === 'METRIC' || activeAnswer?.sourceKind === 'FACT') {
    epistemicType = EPISTEMIC_TYPES.REPORTED_FACT;
  } else if (proposal?.isHypothesis || /فرضیه|احتمال|آزمون/.test(proposalText)) {
    epistemicType = EPISTEMIC_TYPES.HYPOTHESIS;
  }

  // 4. Missing data and execution blockers
  const relevantUnknowns = (unknowns || []).filter(u =>
    u.phase === phaseNumber ||
    (u.field && proposalText.includes(u.field))
  );

  const missingData = relevantUnknowns.map(u => u.reason || u.field || 'داده عددی ثبت‌نشده');
  const blockers = [];

  if (proposalText.includes('حاشیه مشارکت') && /منفی/.test(proposalText)) {
    blockers.push('حاشیه مشارکت غیرمثبت؛ اجرای تبلیغات جذب تا اصلاح قیمت یا هزینه متوقف است');
  }
  if (proposalText.includes('ظرفیت') && /کافی نیست/.test(proposalText)) {
    blockers.push('کمبود ظرفیت عملیاتی؛ توسعه فروش تا افزایش ظرفیت متوقف است');
  }

  return {
    proposalId: proposal?.ruleId || proposal?.id || 'PROP-01',
    reliesOnAnswerId,
    userFactSnippet,
    wikiNodeId,
    wikiArticle,
    wikiVersion,
    epistemicType,
    missingData,
    blockers,
    isActionable: blockers.length === 0,
  };
}

/**
 * Prevents future-phase knowledge leakage and cross-domain pollution.
 */
export function filterKnowledgeByDomainAndPhase(entries = [], businessContext = null, currentPhase = 1) {
  const industryId = businessContext?.industryId || '';
  const exclusions = DOMAIN_EXCLUSIONS[industryId] || [];

  return (entries || []).filter(entry => {
    // 1. Never leak future phase knowledge into earlier phases
    const entryPhases = entry.phases || [];
    if (entryPhases.length > 0 && Math.min(...entryPhases) > currentPhase) {
      return false;
    }

    // 2. Prevent cross-domain leakage
    const content = `${entry.content || ''} ${entry.knowledge_node_id || ''}`;
    for (const forbidden of exclusions) {
      if (content.includes(forbidden)) return false;
    }

    return true;
  });
}
