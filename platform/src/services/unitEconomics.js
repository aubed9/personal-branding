// Calculations use confirmed form fields only. Free prose is never parsed as money.
// Formula reference: https://legacy.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point
const MAX_MINOR = Number.MAX_SAFE_INTEGER;
export const CURRENCY_LABELS = { TOMAN: 'تومان', IRR: 'ریال' };
const AMOUNTS = ['unitPrice', 'variableCost', 'monthlyFixedCost'];
const COUNTS = ['monthlySales', 'monthlyCapacity'];
const LABELS = {
  unitPrice: 'قیمت هر واحد', variableCost: 'هزینه متغیر هر واحد', monthlyFixedCost: 'هزینه ثابت ماهانه',
  monthlySales: 'تعداد فروش ماهانه', monthlyCapacity: 'ظرفیت ماهانه',
};
// Parse decimal digits directly; multiplying a large floating-point amount by 100
// can change its last cent even when the amount itself survives JSON storage.
const toMinor = value => {
  const text = String(value), negative = text.startsWith('-');
  const [whole, fraction = ''] = (negative ? text.slice(1) : text).split('.');
  return (negative ? -1n : 1n) * (BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0')));
};
const fromMinor = value => {
  const absolute = value < 0n ? -value : value;
  return Number(`${value < 0n ? '-' : ''}${absolute / 100n}.${String(absolute % 100n).padStart(2, '0')}`);
};

export function parseFinancialNumber(value, { optional = false, integer = false } = {}) {
  if (value === '' || value === null || value === undefined) {
    if (optional) return null;
    throw new Error('عدد را وارد کنید.');
  }
  if (!['string', 'number'].includes(typeof value)) throw new Error('عدد معتبر وارد کنید.');
  const text = String(value).trim().replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)).replace(/٬/g, ',').replace(/٫/g, '.');
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text)) throw new Error('فقط عدد نامنفی وارد کنید؛ حداکثر دو رقم اعشار.');
  const decimal = text.replace(/,/g, ''), number = Number(decimal);
  if (!Number.isFinite(number) || number > MAX_MINOR / 100 || (integer && !Number.isSafeInteger(number)) || toMinor(decimal) !== toMinor(number)) {
    throw new Error(integer ? 'تعداد باید عدد صحیح و در محدوده قابل محاسبه باشد.' : 'مبلغ خارج از محدوده قابل محاسبه است.');
  }
  return number;
}

export function validateUnitEconomics(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { valid: false, errors: { form: 'اطلاعات مالی نامعتبر است.' } };
  if ((input.period && input.period !== 'MONTH') || (input.type && input.type !== 'unit_economics') || (input.version && input.version !== 1)) errors.form = 'نوع، نسخه یا دوره اطلاعات مالی پشتیبانی نمی‌شود؛ دوره باید ماهانه باشد.';
  if (!Object.hasOwn(CURRENCY_LABELS, input.currency)) errors.currency = 'واحد پول را انتخاب کنید.';
  const unitLabel = typeof input.unitLabel === 'string' ? input.unitLabel.trim() : '';
  if (!unitLabel || unitLabel.length > 120) errors.unitLabel = 'واحد فروش را مشخص کنید؛ مثلاً یک فنجان یا یک سفارش.';
  if (typeof input.isEstimate !== 'boolean') errors.isEstimate = 'مشخص کنید اعداد ثبت‌شده‌اند یا برآوردی.';
  const value = { type: 'unit_economics', version: 1, currency: input.currency, unitLabel, period: 'MONTH', isEstimate: input.isEstimate };
  for (const key of [...AMOUNTS, ...COUNTS]) {
    try { value[key] = parseFinancialNumber(input[key], { optional: COUNTS.includes(key), integer: COUNTS.includes(key) }); }
    catch (error) { errors[key] = `${LABELS[key]}: ${error.message}`; }
  }
  if (!Object.keys(errors).length) {
    const volume = BigInt(Math.max(value.monthlySales ?? 0, value.monthlyCapacity ?? 0));
    // Keep every monetary result exactly representable in minor units.
    const largest = toMinor(Math.max(value.unitPrice, value.variableCost)) * volume + toMinor(value.monthlyFixedCost);
    if (largest > BigInt(MAX_MINOR)) errors.form = 'ترکیب مبلغ و تعداد از محدوده محاسبه دقیق بیشتر است.';
    const contribution = toMinor(value.unitPrice) - toMinor(value.variableCost);
    const results = [contribution];
    if (value.monthlySales !== null) results.push(contribution * BigInt(value.monthlySales) - toMinor(value.monthlyFixedCost));
    if (!errors.form && results.some(result => toMinor(fromMinor(result)) !== result)) errors.form = 'نتیجه با این بزرگی مبلغ و دقت اعشار قابل ذخیره دقیق نیست؛ واحد فروش یا مقیاس مبلغ را بازبینی کنید.';
  }
  return { valid: Object.keys(errors).length === 0, errors, value };
}

const format = value => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(value);
export function formatUnitEconomics(input) {
  const validation = validateUnitEconomics(input);
  if (!validation.valid) throw new Error(Object.values(validation.errors).join(' '));
  const d = validation.value, money = CURRENCY_LABELS[d.currency];
  return [
    `${d.isEstimate ? 'برآورد کاربر' : 'اعداد ثبت‌شده کاربر'}؛ واحد فروش: ${d.unitLabel}؛ واحد پول: ${money}؛ دوره: ماهانه.`,
    `قیمت هر واحد: ${format(d.unitPrice)} ${money}؛ هزینه متغیر هر واحد: ${format(d.variableCost)} ${money}؛ هزینه ثابت ماهانه: ${format(d.monthlyFixedCost)} ${money}.`,
    `تعداد فروش ماهانه: ${d.monthlySales === null ? 'نامشخص' : format(d.monthlySales)}؛ ظرفیت ماهانه: ${d.monthlyCapacity === null ? 'نامشخص' : format(d.monthlyCapacity)}.`,
  ].join('\n');
}

export function calculateUnitEconomics(answer) {
  if (!answer || answer.kind === 'UNKNOWN' || !answer.structuredData) return null;
  const validation = validateUnitEconomics(answer.structuredData);
  if (!validation.valid) return null;
  const d = validation.value;
  const contribution = toMinor(d.unitPrice) - toMinor(d.variableCost);
  const fixed = toMinor(d.monthlyFixedCost);
  const roundedBreakEven = contribution > 0n ? (fixed + contribution - 1n) / contribution : null;
  const breakEvenUnits = roundedBreakEven !== null && roundedBreakEven <= BigInt(MAX_MINOR) ? Number(roundedBreakEven) : null;
  const monthlyOperatingResult = d.monthlySales === null ? null : fromMinor(contribution * BigInt(d.monthlySales) - fixed);
  const warnings = [];
  if (contribution < 0n) warnings.push('قیمت از هزینه متغیر کمتر است؛ با همین قیمت و هزینه، هر فروش کسری ایجاد می‌کند.');
  if (contribution === 0n) warnings.push('حاشیه مشارکت صفر است؛ فروش بیشتر مبلغی برای پوشش هزینه ثابت ایجاد نمی‌کند.');
  if (breakEvenUnits !== null && d.monthlyCapacity !== null && breakEvenUnits > d.monthlyCapacity) warnings.push('فروش لازم برای سربه‌سر شدن از ظرفیت ماهانه اعلام‌شده بیشتر است.');
  if (d.monthlySales !== null && d.monthlyCapacity !== null && d.monthlySales > d.monthlyCapacity) warnings.push('تعداد فروش از ظرفیت اعلام‌شده بیشتر است؛ واحد یا دوره این دو عدد را بازبینی کنید.');
  return {
    kind: 'CALCULATION', evidenceIds: [answer.id], inputs: d,
    isEstimate: d.isEstimate || answer.kind === 'ASSUMPTION',
    contributionPerUnit: fromMinor(contribution), breakEvenUnits, monthlyOperatingResult, warnings,
    basis: 'برای یک محصول یا میانگین سبد ثابت، با فرض ثابت ماندن قیمت و هزینه متغیر هر واحد؛ فقط هزینه‌های واردشده لحاظ شده‌اند.',
  };
}

export function describeUnitEconomics(calculation) {
  if (!calculation) return [];
  const c = calculation, money = CURRENCY_LABELS[c.inputs.currency];
  const ref = `[${c.evidenceIds.join(', ')}]`;
  return [
    `[CALCULATION] ${c.isEstimate ? 'محاسبه برآوردی' : 'محاسبه از اعداد ثبت‌شده کاربر'}؛ حاشیه مشارکت هر ${c.inputs.unitLabel}: ${format(c.contributionPerUnit)} ${money}. ${ref}`,
    `[CALCULATION] فروش سربه‌سر ماهانه: ${c.breakEvenUnits === null ? 'با حاشیه مشارکت غیرمثبت تعیین نمی‌شود' : `${format(c.breakEvenUnits)} واحد کامل، گرد شده به بالا`}. ${ref}`,
    c.monthlyOperatingResult === null
      ? '[UNKNOWN] تعداد فروش ماهانه ثبت نشده؛ مازاد یا کسری ماهانه محاسبه نشده است.'
      : `[CALCULATION] مازاد یا کسری ماهانه بر اساس هزینه‌های واردشده: ${format(c.monthlyOperatingResult)} ${money}. این عدد سود خالص پس از مالیات، اقساط یا هزینه‌های واردنشده نیست. ${ref}`,
    `[METHOD] ${c.basis}`,
    ...c.warnings.map(warning => `[REVIEW] ${warning} ${ref}`),
  ];
}
