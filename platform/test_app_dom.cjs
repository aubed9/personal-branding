// Runs the real React App and DOM event handlers. This is not a layout/browser test.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const { buildSync } = require('esbuild');
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://test.invalid/' });
for (const key of ['window', 'document', 'HTMLElement', 'HTMLTextAreaElement', 'Event', 'MouseEvent', 'localStorage', 'sessionStorage']) global[key] = dom.window[key];
Object.defineProperty(global, 'navigator', { configurable: true, value: dom.window.navigator });
global.IS_REACT_ACT_ENVIRONMENT = true;
window.confirm = () => true;
window.alert = message => { throw new Error(message); };
const React = require('react');
const { act } = React;
const { createRoot } = require('react-dom/client');
const bundle = path.join(__dirname, 'node_modules/.cache/app-dom-test.cjs');
fs.mkdirSync(path.dirname(bundle), { recursive: true });
buildSync({ entryPoints: ['src/App.jsx'], absWorkingDir: __dirname, bundle: true, outfile: bundle, format: 'cjs', platform: 'browser', jsx: 'automatic', external: ['react', 'react-dom', 'react/jsx-runtime'], define: { 'import.meta.env': '{}' }, logLevel: 'error' });
const App = require(bundle).default;
let root;
async function mount({ fresh = true, key = '' } = {}) {
  if (root) await act(async () => root.unmount());
  if (fresh) { localStorage.clear(); sessionStorage.clear(); }
  if (key) sessionStorage.setItem('dm_gemini_api_key_session', key);
  root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(App)); });
}
const state = () => JSON.parse(localStorage.getItem('dm_project_state')).state;
function button(text) {
  const match = [...document.querySelectorAll('button')].find(el => el.textContent.includes(text));
  assert.ok(match, `Missing button: ${text}`); return match;
}
async function click(element) {
  assert.ok(element); assert.equal(element.disabled, false);
  await act(async () => { element.dispatchEvent(new MouseEvent('click', { bubbles: true })); await new Promise(resolve => setImmediate(resolve)); });
}
async function answer(text) {
  await click(button('پاسخ اختصاصی خودم'));
  const input = document.querySelector('textarea');
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await click(document.querySelector('button[aria-label="ثبت پاسخ اختصاصی و ادامه"]'));
}
const answers = [
  'کافه و برشته‌کاری قهوه', 'رست تازه برای دانشجویان شرق تهران', 'کسب‌وکار فعال با مشتری جاری',
  'شرق تهران', 'رسیدن به ۵۰ سفارش هفتگی', 'قهوه با رست هفتگی', 'رست تازه با تاریخ مشخص',
  'هر فنجان ۱۰۰ هزار تومان و هزینه متغیر ۴۰ هزار تومان؛ هزینه ثابت ماهانه ۲۰ میلیون تومان',
  'بودجه محدود ۵ میلیون تومان و دو نفر تیم',
];

test('React: complete foundation, refresh, customize pricing and display matching document', async () => {
  await mount();
  for (const text of answers) await answer(text);
  assert.equal(state().completedPhases[1], true);
  assert.ok(document.body.textContent.includes('دروازه ارزیابی فاز 1 تصویب شد'));
  await click(button('ورود به فاز 2'));
  assert.equal(state().currentPhase, 2);
  await answer('دو کافه نزدیک دانشگاه');
  await mount({ fresh: false });
  assert.equal(state().currentPhase, 2);
  await answer('دانشجویان کم‌درآمد توان خرید محدود دارند');
  assert.ok(document.getElementById('strategic-question-heading').textContent.includes('توان خرید'));
  assert.ok(button('دو سطح اقتصادی و تخصصی'));
  await click(document.querySelector('button[title="مشاهده پیش‌نویس یا سند رسمی فاز"]'));
  assert.ok(document.body.textContent.includes('دانشجویان کم‌درآمد توان خرید محدود دارند'));
  assert.ok(document.body.textContent.includes('پیش‌نویس؛ فاز هنوز تأیید نشده'));
});

test('React: unknown cannot show a successful gate and can be corrected by review', async () => {
  await mount();
  for (const [i, text] of answers.entries()) await answer(i === 5 ? 'نمی‌دانم' : text);
  assert.equal(state().completedPhases[1], false);
  assert.ok(document.body.textContent.includes('این فاز هنوز نیاز به تکمیل دارد'));
  assert.ok(!document.body.textContent.includes('دروازه ارزیابی فاز 1 تصویب شد'));
  await click(button('بازبینی فاز 1'));
  for (const text of answers) await answer(text);
  assert.equal(state().completedPhases[1], true);
  assert.ok(state().unknowns.every(u => u.status === 'RESOLVED'));
});

test('React: model question is displayed only after complete response and detail reaches evidence', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ analysisSummary: 'براساس پاسخ کاربر', nextQuestion: {
    targetQuestionId: 'step0_diagnostic_probing', text: 'برای کافه کنار دانشگاه چه تجربه‌ای می‌سازید؟', title: 'دیدگاه کافه', options: [{ label: 'فضای مطالعه', detail: 'میز آرام برای دانشجویان با سفارش محدود', value: 'study_space' }],
  } }) }] } }] }) });
  try {
    await mount({ key: 'test-key' }); await answer('کافه نزدیک دانشگاه');
    assert.match(document.getElementById('strategic-question-heading').textContent, /کنار دانشگاه/);
    // Switch off network after selecting the generated option: failure should be visible.
    global.fetch = async () => { throw new TypeError('fetch failed'); };
    await click(button('فضای مطالعه')); await click(button('تأیید و ادامه'));
    assert.match(state().phaseData[1].diagnosticVision, /میز آرام برای دانشجویان/);
    assert.match(document.body.textContent, /ادامه با منطق محلی/);
    assert.ok(!state().decisions.some(d => d.source === 'KNOWLEDGE_BRAIN_AI'));
  } finally { global.fetch = originalFetch; }
});

test('React: reset during a pending request cannot resurrect old project state', async () => {
  const originalFetch = global.fetch;
  let finish;
  global.fetch = () => new Promise(resolve => { finish = () => resolve({ ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ nextQuestion: { targetQuestionId: 'step0_diagnostic_probing', text: 'نباید نمایش داده شود', options: [] } }) }] } }] }) }); });
  try {
    await mount({ key: 'test-key' }); await answer('کافه قدیمی');
    assert.equal(state().phaseData[1].description, 'کافه قدیمی');
    assert.ok(document.querySelector('button[aria-label="ثبت پاسخ اختصاصی و ادامه"]').disabled);
    await click(document.querySelector('button[title="تنظیمات سیستم و کلید ارتباطی"]'));
    await click(button('بازنشانی کامل دوسیه'));
    await act(async () => { finish(); await new Promise(resolve => setImmediate(resolve)); });
    assert.equal(state().phaseData[1].description, undefined);
    assert.ok(!document.body.textContent.includes('نباید نمایش داده شود'));
  } finally { global.fetch = originalFetch; }
});

test.after(async () => { if (root) await act(async () => root.unmount()); dom.window.close(); fs.rmSync(bundle, { force: true }); });
