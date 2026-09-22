import { INTERVIEW_FIELDS, activeAnswers, migrateAnswerRecords } from '../../services/interviewSchema.js';
import { getPhaseAdaptationRules } from '../../data/businessContextRouter.js';

const PHASE_TITLES = Object.freeze({
  1: 'کشف و بنیاد کسب‌وکار',
  2: 'هوش بازار و پژوهش مشتری',
  3: 'استراتژی و جهت‌گیری برند',
  4: 'هویت و شخصیت برند',
  5: 'سیستم هویت کلامی و پیام‌رسانی',
  6: 'نام‌گذاری، شعار و جهت‌گیری خلاقانه',
  7: 'سیستم طراحی هویت بصری',
  8: 'برنامه فعال‌سازی اجرایی و مدیریت اعتبار',
});

const HANDOFF_FIELDS = Object.freeze({
  2: ['coreOffer', 'primaryGoal', 'budgetConstraint'],
  3: ['customerPain', 'pricingModel', 'primaryChannel', 'goldenOpportunity'],
  4: ['targetSegment', 'positioning', 'boundary', 'promise'],
  5: ['archetype', 'traits', 'toneGuardrail'],
  6: ['voiceStyle', 'elevatorHook', 'forbiddenWords'],
  7: ['naming', 'tagline'],
  8: ['colorPalette', 'typography', 'logoConcept', 'targetSegment', 'promise', 'primaryChannel'],
});

const FIELD_META = Object.fromEntries(INTERVIEW_FIELDS.map(spec => [spec.field, spec]));
const faNumber = value => new Intl.NumberFormat('fa-IR', { useGrouping: false }).format(Number(value));

export function buildEvidenceDerivedHandoff({
  targetPhase,
  phaseData = {},
  answerRecords = [],
  reviewRequired = {},
  businessContext = null,
} = {}) {
  const phase = Number(targetPhase);
  if (!Number.isInteger(phase) || phase < 1 || phase > 8) throw new Error(`Invalid target phase: ${targetPhase}`);
  if (phase === 1) return { message: '', sourceAnswerIds: [], missingFields: [] };

  const records = activeAnswers(answerRecords.length ? answerRecords : migrateAnswerRecords(phaseData));
  const fields = HANDOFF_FIELDS[phase] || [];
  const lines = [];
  const sourceAnswerIds = [];
  const missingFields = [];

  for (const field of fields) {
    const spec = FIELD_META[field];
    if (!spec) continue;
    const answer = records.find(record => record.phase === spec.phase && record.field === field);
    const stale = (reviewRequired?.[spec.phase] || []).includes(spec.questionId);
    if (!answer || answer.kind === 'UNKNOWN' || stale) {
      missingFields.push(field);
      lines.push(`- [UNKNOWN] ${spec.label}: ${stale ? 'پاسخ قبلی پس از تغییر داده مبنا نیازمند بازبینی است' : 'داده معتبر ثبت نشده است'}.`);
      continue;
    }
    sourceAnswerIds.push(answer.id);
    lines.push(`- [${answer.kind}] ${spec.label}: ${answer.text} [${answer.id}]`);
  }

  const rules = businessContext ? getPhaseAdaptationRules(phase, businessContext) : null;
  const specialization = rules?.v3Instruction
    ? `\n\n[SYSTEM_INFERENCE] انطباق تخصصی — تمرکز تخصصی فعال:\n${rules.v3Instruction}`
    : '';

  const message = [
    `## ورود به فاز ${faNumber(phase)}: ${PHASE_TITLES[phase]}`,
    '',
    '### Handoff مبتنی بر شواهد ثبت‌شده',
    ...(lines.length ? lines : ['- [UNKNOWN] هیچ داده معتبر بالادستی برای Handoff ثبت نشده است.']),
    specialization,
  ].filter(value => value !== '').join('\n');

  return {
    message,
    sourceAnswerIds: [...new Set(sourceAnswerIds)],
    missingFields,
    targetPhase: phase,
  };
}
