import React, { useState } from 'react';
import { validateUnitEconomics, formatUnitEconomics } from '../services/unitEconomics.js';

const FIELDS = [
  ['unitPrice', 'قیمت هر واحد', false], ['variableCost', 'هزینه متغیر هر واحد', false],
  ['monthlyFixedCost', 'هزینه ثابت ماهانه', false], ['monthlySales', 'تعداد فروش ماهانه', true],
  ['monthlyCapacity', 'ظرفیت ماهانه', true],
];

export default function UnitEconomicsForm({ initialValue, onSubmit, disabled = false }) {
  const [values, setValues] = useState(() => ({ unitLabel: '', currency: '', isEstimate: '',
    ...Object.fromEntries(FIELDS.map(([key]) => [key, ''])), ...initialValue }));
  const [errors, setErrors] = useState({});
  const update = (key, value) => {
    setValues(v => ({ ...v, [key]: value }));
    setErrors(previous => Object.fromEntries(Object.entries(previous).filter(([field]) => field !== key && field !== 'form')));
  };
  const submit = event => {
    event.preventDefault();
    if (disabled) return;
    const validation = validateUnitEconomics(values);
    setErrors(validation.errors);
    if (validation.valid) onSubmit(formatUnitEconomics(validation.value), validation.value);
  };
  const inputClass = 'w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:outline-none focus:border-white';
  return <form onSubmit={submit} className="p-4 rounded-xl border border-white/20 space-y-4" aria-label="ثبت اعداد قیمت و هزینه" onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.stopPropagation(); submit(e); } }}>
    <p className="text-xs text-zinc-300 leading-relaxed">قیمت و هزینه متغیر را برای یک واحد یکسان وارد کنید. هزینه ثابت، فروش و ظرفیت همگی برای یک ماه هستند. مبلغ کامل بنویسید؛ مثلاً ۱۰۰٬۰۰۰، نه «۱۰۰ هزار».</p>
    <fieldset disabled={disabled} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <legend className="sr-only">اطلاعات یک محصول یا سبد ثابت</legend>
      <label className="text-xs text-zinc-300">واحد فروش
        <input className={inputClass} name="unitLabel" maxLength={120} value={values.unitLabel} onChange={e => update('unitLabel', e.target.value)} placeholder="مثلاً یک فنجان یا یک سفارش" aria-invalid={Boolean(errors.unitLabel)} />
      </label>
      <label className="text-xs text-zinc-300">واحد پول همه مبلغ‌ها
        <select className={inputClass} value={values.currency} onChange={e => update('currency', e.target.value)} aria-invalid={Boolean(errors.currency)}>
          <option value="">انتخاب کنید</option><option value="TOMAN">تومان</option><option value="IRR">ریال</option>
        </select>
      </label>
      {FIELDS.map(([key, label, optional]) => <label key={key} className="text-xs text-zinc-300">{label}{optional ? '، اختیاری' : ''}
        <input name={key} className={inputClass} dir="ltr" inputMode={optional ? 'numeric' : 'decimal'} value={values[key] ?? ''} onChange={e => update(key, e.target.value)} aria-invalid={Boolean(errors[key])} />
      </label>)}
      <label className="text-xs text-zinc-300">مبنای عددها
        <select className={inputClass} value={values.isEstimate === '' ? '' : String(values.isEstimate)} onChange={e => update('isEstimate', e.target.value === '' ? '' : e.target.value === 'true')} aria-invalid={Boolean(errors.isEstimate)}>
          <option value="">انتخاب کنید</option><option value="false">از فروش و هزینه ثبت‌شده</option><option value="true">برآورد یا برنامه آینده</option>
        </select>
      </label>
    </fieldset>
    {!!Object.keys(errors).length && <ul role="alert" className="text-xs text-rose-300 space-y-1">{Object.values(errors).map(error => <li key={error}>{error}</li>)}</ul>}
    <button type="submit" disabled={disabled} className="rounded-lg px-4 py-2 bg-white text-black text-sm font-bold disabled:opacity-40">ثبت اعداد و ادامه</button>
  </form>;
}
