import { CANONICAL_CONTEXT_AXES } from '../context/businessContextContract.js';

export const EFFECT_KIND = Object.freeze({
  DIRECT_EFFECT: 'DIRECT_EFFECT',
  CONDITIONAL_EFFECT: 'CONDITIONAL_EFFECT',
  NO_EFFECT_WITH_REASON: 'NO_EFFECT_WITH_REASON',
});

const define = (direct = [], conditional = [], noEffectReason) => ({ direct, conditional, noEffectReason });

const AXIS_EFFECT_BLUEPRINTS = Object.freeze({
  customerModel: define([2, 3, 8], [1, 4, 5, 6, 7], 'این فاز به‌تنهایی مدل مشتری را تغییر نمی‌دهد؛ فقط از تصمیمات بالادست استفاده می‌کند.'),
  offerType: define([1, 2, 3], [5, 6, 7, 8], 'نوع پیشنهاد در این فاز اثر مستقیمی ندارد مگر ماژول تخصصی فعال شود.'),
  channelModel: define([2, 8], [1, 3, 5, 7], 'کانال در این فاز تصمیم مستقلی ایجاد نمی‌کند.'),
  revenueModel: define([1, 2, 8], [3, 5], 'مدل درآمد در این فاز اثر مستقیم ندارد و فقط از طریق اقتصاد/فعال‌سازی تخصصی اثر می‌گذارد.'),
  maturity: define([1, 2, 8], [3, 6, 7], 'مرحله بلوغ در این فاز الزام تصمیم مستقلی ایجاد نمی‌کند.'),
  scale: define([1, 8], [2, 3, 4, 5, 7], 'مقیاس در این فاز فقط در صورت فعال‌شدن نیاز حاکمیتی یا ظرفیتی اثر دارد.'),
  salesMotion: define([2, 3, 8], [1, 5, 6], 'حرکت فروش در این فاز تصمیم مستقیمی ایجاد نمی‌کند.'),
  geography: define([1, 2, 8], [3, 5, 6, 7], 'جغرافیا در این فاز فقط در صورت نیاز بازار/زبان/عملیات اثر می‌گذارد.'),
  branchStructure: define([1, 7, 8], [2, 3, 4, 5], 'ساختار شعب در این فاز اثر مستقیمی ندارد مگر مسئله کنترل مرکزی/محلی فعال شود.'),
  founderRole: define([4, 5, 8], [1, 3, 6, 7], 'نقش بنیان‌گذار در این فاز الزام مستقیمی ایجاد نمی‌کند.'),
  purchaseCycle: define([2, 3, 8], [1, 5], 'طول چرخه خرید در این فاز فقط از طریق اثبات، nurture یا فروش اثر می‌گذارد.'),
  relationshipModel: define([2, 3, 8], [1, 4, 5], 'مدل رابطه در این فاز تصمیم مستقلی ایجاد نمی‌کند.'),
  regulatoryProfile: define([1, 2, 3, 5, 6, 8], [4, 7], 'پروفایل رگولاتوری در این فاز فقط اگر ادعا/طراحی حساس باشد اثر می‌گذارد.'),
  operationalComplexity: define([1, 8], [2, 3, 7], 'پیچیدگی عملیاتی در این فاز اثر مستقیمی ندارد مگر ظرفیت/فرایند/تحویل مطرح باشد.'),
  brandArchitecture: define([3, 6, 7], [1, 4, 5, 8], 'معماری برند در این فاز الزام مستقیمی ایجاد نمی‌کند.'),
});

export const AXIS_PHASE_EFFECTS = Object.freeze(Object.fromEntries(
  CANONICAL_CONTEXT_AXES.map(axis => {
    const blueprint = AXIS_EFFECT_BLUEPRINTS[axis];
    if (!blueprint) throw new Error(`Missing phase-effect blueprint for canonical axis: ${axis}`);
    const phases = {};
    for (let phase = 1; phase <= 8; phase++) {
      if (blueprint.direct.includes(phase)) {
        phases[phase] = Object.freeze({ kind: EFFECT_KIND.DIRECT_EFFECT, reason: 'این محور مستقیماً توپولوژی تصمیم یا شواهد این فاز را تغییر می‌دهد.' });
      } else if (blueprint.conditional.includes(phase)) {
        phases[phase] = Object.freeze({ kind: EFFECT_KIND.CONDITIONAL_EFFECT, reason: 'اثر این محور وابسته به مقدار محور یا فعال‌شدن ماژول تخصصی است.' });
      } else {
        phases[phase] = Object.freeze({ kind: EFFECT_KIND.NO_EFFECT_WITH_REASON, reason: blueprint.noEffectReason });
      }
    }
    return [axis, Object.freeze(phases)];
  })
));

export function getAxisPhaseEffect(axis, phase) {
  if (!CANONICAL_CONTEXT_AXES.includes(axis)) throw new Error(`Unknown canonical axis: ${axis}`);
  const p = Number(phase);
  if (!Number.isInteger(p) || p < 1 || p > 8) throw new Error(`Invalid phase: ${phase}`);
  return AXIS_PHASE_EFFECTS[axis][p];
}

export function validateAxisPhaseEffects() {
  const errors = [];
  for (const axis of CANONICAL_CONTEXT_AXES) {
    const phases = AXIS_PHASE_EFFECTS[axis];
    if (!phases) {
      errors.push(`Missing phase effect contract for ${axis}`);
      continue;
    }
    for (let phase = 1; phase <= 8; phase++) {
      const effect = phases[phase];
      if (!effect) errors.push(`Missing effect contract: ${axis} phase ${phase}`);
      else if (!Object.values(EFFECT_KIND).includes(effect.kind)) errors.push(`Invalid effect kind: ${axis} phase ${phase}`);
      else if (!effect.reason?.trim()) errors.push(`Missing effect reason: ${axis} phase ${phase}`);
    }
  }
  return { valid: errors.length === 0, errors };
}
