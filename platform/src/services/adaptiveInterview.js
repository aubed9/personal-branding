import { FIELD_BY_QUESTION, isUnknownAnswer, activeAnswers } from './interviewSchema.js';
import { calculateUnitEconomics } from './unitEconomics.js';

// These are question dependencies, not an invitation for the model to skip a phase.
const DEPENDENCIES = {
  step0_stage: ['step0_diagnostic_probing'],
  step0_geography: ['step0_description'],
  step1_primary_goal: ['step0_stage', 'step0_diagnostic_probing'],
  step2_core_offer: ['step1_primary_goal'],
  step2_value_hypothesis: ['step2_core_offer'],
  unit_economics: ['step2_core_offer'],
  cash_constraint: ['step1_primary_goal', 'unit_economics'],
  p2_step0_competitors: ['step2_core_offer', 'step0_geography'],
  p2_step1_customer_pain: ['p2_step0_competitors', 'step2_value_hypothesis'],
  p2_step2_pricing_models: ['unit_economics', 'p2_step1_customer_pain'],
  p2_step3_primary_channel: ['step0_geography', 'cash_constraint', 'p2_step1_customer_pain'],
  p2_step4_golden_opportunity: ['p2_step0_competitors', 'p2_step1_customer_pain', 'p2_step2_pricing_models'],
  p3_target_segment: ['p2_step1_customer_pain', 'p2_step2_pricing_models'],
  p3_positioning_frame: ['p3_target_segment', 'p2_step4_golden_opportunity'],
  p3_strategic_boundary: ['p3_positioning_frame', 'cash_constraint'],
  p3_brand_promise: ['p3_target_segment', 'p3_positioning_frame', 'step2_core_offer'],
  p4_archetype: ['p3_target_segment', 'p3_positioning_frame'],
  p4_human_traits: ['p4_archetype', 'p3_brand_promise'],
  p4_tone_guardrail: ['p4_human_traits', 'p3_strategic_boundary'],
  p5_voice_style: ['p4_archetype', 'p3_target_segment'],
  p5_elevator_hook: ['p3_target_segment', 'p3_brand_promise', 'p5_voice_style'],
  p5_forbidden_words: ['p5_voice_style', 'p4_tone_guardrail'],
  p6_naming_territory: ['p3_positioning_frame', 'p5_voice_style'],
  p6_tagline_archetype: ['p6_naming_territory', 'p3_brand_promise'],
  p7_color_palette: ['p4_archetype', 'p3_positioning_frame'],
  p7_typography_mood: ['p5_voice_style', 'p7_color_palette'],
  p7_logo_direction: ['p6_naming_territory', 'p7_color_palette'],
  p8_thought_leadership: ['p3_target_segment', 'p3_positioning_frame'],
  p8_pr_podcast_channels: ['cash_constraint', 'p2_step3_primary_channel'],
  p8_lead_funnel: ['p2_step3_primary_channel', 'p3_brand_promise', 'p8_pr_podcast_channels'],
  p8_crisis_reputation: ['p3_brand_promise', 'p4_tone_guardrail'],
};

const short = text => String(text).replace(/\s+/g, ' ').slice(0, 220);
const option = (label, value, detail) => ({ label, text: label, value, detail });

export function adaptQuestionToAnswers(question, context, phaseData, answerRecords = []) {
  const q = { ...question };
  const dependencies = (DEPENDENCIES[q.id] || []).flatMap(id => {
    const spec = FIELD_BY_QUESTION[id];
    const value = phaseData[spec.phase]?.[spec.field] || phaseData[spec.phase]?.[id];
    return value && !isUnknownAnswer(value) ? [{ ...spec, text: value }] : [];
  });
  if (!dependencies.length) return q;
  q.dependsOn = dependencies.map(item => item.questionId);
  q.contextAnchor = dependencies.map(item => `${item.label}: «${short(item.text)}»`).join('؛ ');
  q.text = `با توجه به پاسخ‌های شما، ${q.contextAnchor}\n\n${q.text}`;
  q.isDynamic = true;

  const p1 = phaseData[1] || {};
  const p2 = phaseData[2] || {};
  const p3 = phaseData[3] || {};
  const isLimitedBudget = /محدود|بودجه کم|بدون بودجه|کمبود|صفر/.test(p1.budgetConstraint || '');
  const priceSensitive = /کم.درآمد|اقتصادی|توان خرید|حساس.*قیمت|کشش قیمتی محدود/.test(`${p2.customerPain || ''} ${p3.targetSegment || ''}`);
  const local = p1.geographyValue === 'local_city' || /محلی|محله/.test(p1.geography || '');
  const economics = calculateUnitEconomics(activeAnswers(answerRecords).find(a => a.questionId === 'unit_economics'));

  if (economics && ['cash_constraint', 'p2_step2_pricing_models'].includes(q.id)) {
    if (economics.contributionPerUnit <= 0) q.text += '\nطبق اعداد ثبت‌شده، قیمت هر واحد از هزینه متغیر بیشتر نیست. برای اصلاح قیمت، دامنه خدمت یا هزینه چه تغییری قابل اجراست؟';
    else if (economics.breakEvenUnits !== null && economics.inputs.monthlyCapacity !== null && economics.breakEvenUnits > economics.inputs.monthlyCapacity) {
      q.text += `\nفروش سربه‌سر محاسبه‌شده ${economics.breakEvenUnits.toLocaleString('fa-IR')} واحد در ماه است، اما ظرفیت اعلامی ${economics.inputs.monthlyCapacity.toLocaleString('fa-IR')} واحد است. کدام محدودیت را می‌توانید اصلاح کنید؟`;
    }
  }

  if (q.id === 'p2_step2_pricing_models' && priceSensitive) {
    q.text += '\nبا این محدودیت توان خرید، کدام روش را برای آزمون قیمت انتخاب می‌کنید؟ هزینه هر گزینه باید پیش از اجرا بررسی شود.';
    q.options = [
      option('بسته پایه با دامنه محدود', 'affordable_entry', 'خدمت پایه را کوچک‌تر می‌کنیم؛ قیمت نهایی بعد از محاسبه هزینه تعیین می‌شود.'),
      option('دو سطح اقتصادی و تخصصی', 'tiered_offer', 'برای هر سطح، هزینه و تقاضا را جدا می‌سنجیم تا سطح اقتصادی زیان‌ده نباشد.'),
      option('آزمون خرید واقعی پیش از تغییر', 'price_experiment', 'ابتدا پیشنهاد محدود را با مشتریان فعلی آزمایش می‌کنیم.'),
      option('بازبینی مشتری هدف', 'review_target', 'اگر قیمت لازم با توان خرید این گروه سازگار نیست، مشتری هدف را بازبینی می‌کنیم.'),
    ];
  }
  if (q.id === 'p2_step2_pricing_models' && economics?.contributionPerUnit <= 0) {
    q.options = [
      option('بازبینی اجزای هزینه', 'review_costs', 'هزینه متغیر هر واحد را با فاکتور و هزینه تحویل دوباره ثبت می‌کنیم.'),
      option('آزمون قیمت قابل اجرا', 'test_viable_price', 'قیمتی با حاشیه مشارکت مثبت را با مشتری آزمایش می‌کنیم؛ پذیرش آن هنوز معلوم نیست.'),
      option('کاهش دامنه پیشنهاد', 'reduce_scope', 'اجزای خدمت و هزینه هر نسخه را جدا می‌کنیم و نسخه محدودتر را آزمایش می‌کنیم.'),
      option('توقف توسعه تا اصلاح اعداد', 'pause_expansion', 'تا روشن شدن هزینه و قیمت، افزایش فروش و هزینه تبلیغ را تعهد نمی‌کنیم.'),
    ];
  }

  if (['p2_step3_primary_channel', 'p8_pr_podcast_channels'].includes(q.id) && isLimitedBudget) {
    q.text += '\nبا بودجه محدود اعلام‌شده، اولین آزمون کم‌هزینه شما کدام است؟';
    q.options = [
      option('ارجاع مشتریان فعلی', 'customer_referral', `از مشتری راضی برای معرفی «${short(p1.coreOffer || p1.description || 'پیشنهاد اصلی')}» کمک می‌گیریم و نتیجه را ثبت می‌کنیم.`),
      option(local ? 'همکاری با کسب‌وکارهای محله' : 'همکاری با مخاطبان هم‌گروه', 'partner_pilot', 'یک همکاری محدود و قابل اندازه‌گیری را قبل از هزینه بیشتر امتحان می‌کنیم.'),
      option('محتوای پاسخ به مسئله مشتری', 'focused_content', `محتوا را درباره «${short(p2.customerPain || 'مسئله‌ای که هنوز باید از مشتری بپرسیم')}» می‌سازیم.`),
      option('آزمون تبلیغ با سقف هزینه', 'capped_experiment', 'مبلغ سقف و شرط توقف را قبل از اجرا تعیین می‌کنیم؛ بودجه‌ای خودکار فرض نمی‌شود.'),
    ];
  }

  if (q.id === 'p5_elevator_hook' && p3.targetSegment && p3.promise) {
    const audience = short(p3.targetSegment);
    const promise = short(p3.promise);
    const offer = short(p1.coreOffer || 'پیشنهاد اصلی');
    q.options = [
      option('شروع از مسئله مشتری', 'problem_first', `برای «${audience}»، «${offer}» را با این تعهد ارائه می‌کنیم: «${promise}».`),
      option('شروع از تعهد قابل اثبات', 'proof_first', `تعهد ما «${promise}» است. در معرفی «${offer}» به «${audience}»، فقط شواهد واقعی این تعهد را نشان می‌دهیم.`),
      option('آزمون پیام با مشتری', 'message_test', `دو پیام برای «${audience}» آزمایش می‌کنیم و از او می‌پرسیم از تعهد «${promise}» چه فهمیده است.`),
    ];
  }
  return q;
}

export function validateQuestionAdaptation(proposed, target) {
  if (!proposed || !target || proposed.targetQuestionId !== target.id || typeof proposed.text !== 'string' || !proposed.text.trim()) return null;
  if (!Array.isArray(proposed.options) || proposed.options.length > 4) return null;
  const options = proposed.options;
  if (options.some(opt => !opt || typeof opt.label !== 'string' || !opt.label.trim() || typeof opt.value !== 'string' || !opt.value.trim())) return null;
  if (new Set(options.map(opt => opt.value)).size !== options.length) return null;
  // Routing codes carry meaning. The model can reword them, not replace them.
  if (['step0_description', 'step0_stage', 'step0_geography'].includes(target.id)) {
    const allowed = new Set((target.options || []).map(opt => opt.value));
    if (options.length !== allowed.size || options.some(opt => !allowed.has(opt.value))) return null;
  }
  return {
    ...target, ...proposed, id: target.id, baseQuestionId: target.id,
    targetQuestionId: target.id, phase: FIELD_BY_QUESTION[target.id]?.phase,
    isDynamic: true, allowCustomAnswer: true, options,
    // The engine owns these identifiers; model-generated values cannot change them.
    resolutionFor: target.resolutionFor, dependsOn: target.dependsOn,
  };
}
