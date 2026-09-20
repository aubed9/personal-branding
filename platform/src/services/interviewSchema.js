// One mapping for answer storage, adaptive questions, gates and document evidence.
// A generated question must keep the identity of the field it is collecting.
const rows = [
  [1, 'step0_description', 'description', 'صنف و مدل فعالیت', 'FACT'],
  [1, 'step0_diagnostic_probing', 'diagnosticVision', 'دیدگاه بنیان‌گذار', 'ASSUMPTION'],
  [1, 'step0_stage', 'stage', 'مرحله فعالیت', 'FACT'],
  [1, 'step0_geography', 'geography', 'محدوده بازار', 'FACT'],
  [1, 'step1_primary_goal', 'primaryGoal', 'هدف کوتاه‌مدت', 'DECISION'],
  [1, 'step2_core_offer', 'coreOffer', 'محصول یا خدمت محوری', 'FACT'],
  [1, 'step2_value_hypothesis', 'valueHypothesis', 'فرضیه ارزش و تمایز', 'ASSUMPTION'],
  [1, 'unit_economics', 'unitEconomics', 'قیمت و هزینه هر فروش', 'FACT'],
  [1, 'cash_constraint', 'budgetConstraint', 'بودجه و محدودیت اجرا', 'FACT'],
  [2, 'p2_step0_competitors', 'competitors', 'رقبای مشاهده‌شده', 'FACT'],
  [2, 'p2_step1_customer_pain', 'customerPain', 'مسئله مشتری و شواهد آن', 'ASSUMPTION'],
  [2, 'p2_step2_pricing_models', 'pricingModel', 'روش قیمت‌گذاری', 'DECISION'],
  [2, 'p2_step3_primary_channel', 'primaryChannel', 'کانال دسترسی به مشتری', 'DECISION'],
  [2, 'p2_step4_golden_opportunity', 'goldenOpportunity', 'فرصت تمایز قابل آزمون', 'ASSUMPTION'],
  [3, 'p3_target_segment', 'targetSegment', 'مشتری هدف', 'DECISION'],
  [3, 'p3_positioning_frame', 'positioning', 'جایگاه برند', 'DECISION'],
  [3, 'p3_strategic_boundary', 'boundary', 'مرزهای استراتژی', 'DECISION'],
  [3, 'p3_brand_promise', 'promise', 'وعده برند', 'DECISION'],
  [4, 'p4_archetype', 'archetype', 'شخصیت برند', 'DECISION'],
  [4, 'p4_human_traits', 'traits', 'رفتارهای برند', 'DECISION'],
  [4, 'p4_tone_guardrail', 'toneGuardrail', 'مرزهای رفتاری', 'DECISION'],
  [5, 'p5_voice_style', 'voiceStyle', 'سبک صدا', 'DECISION'],
  [5, 'p5_elevator_hook', 'elevatorHook', 'پیام معرفی', 'DECISION'],
  [5, 'p5_forbidden_words', 'forbiddenWords', 'واژگان ممنوع', 'DECISION'],
  [6, 'p6_naming_territory', 'naming', 'قلمرو نام‌گذاری', 'DECISION'],
  [6, 'p6_tagline_archetype', 'tagline', 'جهت شعار', 'DECISION'],
  [7, 'p7_color_palette', 'colorPalette', 'پالت رنگ', 'DECISION'],
  [7, 'p7_typography_mood', 'typography', 'تایپوگرافی', 'DECISION'],
  [7, 'p7_logo_direction', 'logoConcept', 'جهت طراحی نشان', 'DECISION'],
  [8, 'p8_thought_leadership', 'thoughtLeadership', 'موضوع محتوای تخصصی', 'DECISION'],
  [8, 'p8_pr_podcast_channels', 'prChannels', 'رسانه‌های منتخب', 'DECISION'],
  [8, 'p8_lead_funnel', 'leadFunnel', 'مسیر تبدیل به خرید', 'DECISION'],
  [8, 'p8_crisis_reputation', 'reputationCrisis', 'رسیدگی به نارضایتی', 'DECISION'],
];

export const INTERVIEW_FIELDS = rows.map(([phase, questionId, field, label, kind]) => ({ phase, questionId, field, label, kind }));
export const FIELD_BY_QUESTION = Object.fromEntries(INTERVIEW_FIELDS.map(spec => [spec.questionId, spec]));
export const UNKNOWN_ANSWER = '[مجهول رسمی: هنوز مشخص نشده]';
export const isUnknownAnswer = value => typeof value === 'string' && /مجهول رسمی|فرضیه نیازمند تست/.test(value);
export const hasAnswer = value => typeof value === 'string' && value.trim().length > 0;

export function activeAnswers(records = []) {
  return records.filter(record => record.status !== 'SUPERSEDED');
}

// Imports from v1 retain their actual answers; no synthetic user answers are added.
export function migrateAnswerRecords(phaseData = {}) {
  return INTERVIEW_FIELDS.flatMap(spec => {
    const data = phaseData[spec.phase] || {};
    const text = data[spec.field] || data[spec.questionId];
    if (!hasAnswer(text)) return [];
    return [{
      ...spec, id: `legacy-P${spec.phase}-${spec.questionId}`, text,
      questionText: spec.label, presentedQuestionId: spec.questionId,
      optionValue: data[`${spec.field}Value`] || data[`${spec.questionId}Value`] || null,
      kind: isUnknownAnswer(text) ? 'UNKNOWN' : spec.kind,
      status: 'ACTIVE', source: 'LEGACY_USER_ANSWER', revision: 0,
    }];
  });
}

export function formatSelectedAnswer(option) {
  const label = option?.text || option?.label || '';
  const detail = option?.detail || option?.description || '';
  return detail && detail !== label ? `${label}\n${detail}` : label;
}

export const FOUNDATION_DETAIL_QUESTIONS = [
  {
    id: 'unit_economics', title: 'قیمت و هزینه یک فروش',
    text: 'برای محصول یا خدمت اصلی، قیمت فروش، هزینه متغیر هر فروش و هزینه ثابت ماهانه چقدر است؟ واحد پول و بازه زمانی را هم بنویسید. اگر برآورد است، صریح بگویید.',
    whyItMatters: 'بدون این اعداد نمی‌توان سود یا نقطه سربه‌سر را محاسبه کرد.',
    options: [], allowCustomAnswer: true,
  },
  {
    id: 'cash_constraint', title: 'بودجه و ظرفیت اجرا',
    text: 'در سه ماه آینده چه بودجه، زمان و ظرفیت تیمی برای رسیدن به هدفتان دارید؟ محدودیت اصلی را با عدد یا مثال بنویسید.',
    whyItMatters: 'انتخاب کانال و برنامه اجرا باید با منابعی که واقعاً دارید سازگار باشد.',
    options: [], allowCustomAnswer: true,
  },
];
