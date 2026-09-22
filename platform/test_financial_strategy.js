import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFinancialNumber, validateUnitEconomics, calculateUnitEconomics, formatUnitEconomics } from './src/services/unitEconomics.js';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { InterviewController } from './src/services/interviewController.js';
import { PersistenceManager } from './src/services/persistenceManager.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';
import { activeAnswers } from './src/services/interviewSchema.js';

const data = { type: 'unit_economics', version: 1, period: 'MONTH', unitLabel: 'فنجان', currency: 'TOMAN', unitPrice: 100000, variableCost: 40000, monthlyFixedCost: 20000000, monthlySales: 500, monthlyCapacity: 600, isEstimate: false };
const record = (overrides = {}) => ({ id: 'ANS-8', kind: 'FACT', structuredData: { ...data, ...overrides } });
function toFinance() {
  const e = new OrchestratorEngine();
  const answers = [
    ['کافه و برشته‌کاری قهوه', 'hospitality_cafe_roastery'], ['کیفیت ثابت برای مشتریان محله'], ['فعال', 'active'], ['شرق تهران', 'local_city'],
    ['افزایش سفارش‌های هفتگی'], ['قهوه تازه با رست هفتگی'], ['تاریخ رست مشخص روی بسته'],
  ];
  for (const args of answers) e.processUserResponse(...args);
  assert.equal(e.getCurrentQuestion().id, 'unit_economics');
  return e;
}
function submitFinance(e, input = data) {
  return e.processUserResponse(formatUnitEconomics(input), null, { expectedQuestionId: e.getCurrentQuestion().id, structuredData: input });
}
function complete(input = data) {
  const e = toFinance(); submitFinance(e, input); e.processUserResponse('بودجه محدود ۵ میلیون تومان، دو نفر تیم');
  assert.equal(e.completedPhases[1], true); return e;
}
function editFinance(e, text, structuredData) {
  e.startPhase(1); e.goToQuestion(e.getCurrentPhaseQuestions().findIndex(q => q.id === 'unit_economics'));
  return e.processUserResponse(text, null, { expectedQuestionId: e.getCurrentQuestion().id, structuredData });
}

test('Persian, Arabic and ASCII numbers preserve amounts and decimal separators', () => {
  assert.equal(parseFinancialNumber('۱۰۰٬۰۰۰'), 100000);
  assert.equal(parseFinancialNumber('١٢٣٫٤٥'), 123.45);
  assert.equal(parseFinancialNumber('100,000.25'), 100000.25);
  assert.equal(parseFinancialNumber('۰'), 0);
  assert.equal(parseFinancialNumber('', { optional: true }), null);
});
test('invalid, negative, ambiguous and unsafe amounts are rejected', () => {
  for (const input of ['100 هزار', '-1', '1,00', '1,2,3', '1e5', '1.234', 'Infinity', NaN, true, {}, '9007199254740992']) assert.throws(() => parseFinancialNumber(input), String(input));
  assert.throws(() => parseFinancialNumber('1.5', { integer: true }));
});
test('all mandatory units, periods, values and provenance must be explicit', () => {
  for (const bad of [{ currency: 'USD' }, { unitLabel: '' }, { period: 'YEAR' }, { isEstimate: undefined }, { monthlyFixedCost: '' }, { version: 2 }, { monthlySales: -1 }]) assert.equal(validateUnitEconomics({ ...data, ...bad }).valid, false);
});
test('contribution, rounded break-even and operating result use the stated numbers', () => {
  const c = calculateUnitEconomics(record());
  assert.equal(c.contributionPerUnit, 60000);
  assert.equal(c.breakEvenUnits, 334);
  assert.equal(c.monthlyOperatingResult, 10000000);
  assert.deepEqual(c.evidenceIds, ['ANS-8']);
});
test('rial and toman retain their explicit units without a hidden exchange conversion', () => {
  const toman = calculateUnitEconomics(record());
  const rial = calculateUnitEconomics(record({ currency: 'IRR', unitPrice: 1000000, variableCost: 400000, monthlyFixedCost: 200000000 }));
  assert.equal(rial.breakEvenUnits, toman.breakEvenUnits);
  assert.equal(rial.contributionPerUnit, toman.contributionPerUnit * 10);
  assert.equal(rial.monthlyOperatingResult, toman.monthlyOperatingResult * 10);
});
test('decimal money does not round a whole-unit break-even up accidentally', () => {
  const c = calculateUnitEconomics(record({ unitPrice: 0.3, variableCost: 0.2, monthlyFixedCost: 0.3, monthlySales: 3 }));
  assert.equal(c.contributionPerUnit, 0.1); assert.equal(c.breakEvenUnits, 3); assert.equal(c.monthlyOperatingResult, 0);
});
test('large decimal inputs preserve exact cents through storage and break-even arithmetic', () => {
  assert.throws(() => parseFinancialNumber('90071992547409.91'));
  assert.equal(parseFinancialNumber('90071992547409.90'), 90071992547409.9);
  const c = calculateUnitEconomics(record({ unitPrice: '40000000000000.02', variableCost: '40000000000000.01', monthlyFixedCost: '0.03', monthlySales: '', monthlyCapacity: '' }));
  assert.equal(c.contributionPerUnit, 0.01); assert.equal(c.breakEvenUnits, 3);
  assert.equal(validateUnitEconomics({ ...data, unitPrice: '40000000000000.01', variableCost: 0, monthlyFixedCost: '0.01', monthlySales: 2, monthlyCapacity: '' }).valid, false);
});
test('zero and negative margins never produce infinite or misleading break-even', () => {
  for (const price of [0, 40000]) {
    const c = calculateUnitEconomics(record({ unitPrice: price, monthlySales: 0 }));
    assert.equal(c.breakEvenUnits, null); assert.equal(c.monthlyOperatingResult, -20000000); assert.ok(c.warnings.length);
    assert.doesNotMatch(JSON.stringify(c), /Infinity|NaN/);
  }
  assert.equal(calculateUnitEconomics(record({ monthlyFixedCost: 0 })).breakEvenUnits, 0);
});
test('missing volume stays unknown and capacity contradictions are visible', () => {
  const c = calculateUnitEconomics(record({ monthlySales: '', monthlyCapacity: 200 }));
  assert.equal(c.monthlyOperatingResult, null); assert.ok(c.warnings.some(w => w.includes('ظرفیت')));
  assert.ok(calculateUnitEconomics(record({ monthlySales: 800 })).warnings.some(w => w.includes('تعداد فروش')));
});
test('no financial values are inferred from free prose or an unknown answer', () => {
  assert.equal(calculateUnitEconomics({ id: 'ANS-1', kind: 'FACT', text: 'قیمت 100000 هزینه 40000' }), null);
  assert.equal(calculateUnitEconomics({ ...record(), kind: 'UNKNOWN' }), null);
  assert.equal(calculateUnitEconomics(record({ period: 'YEAR' })), null);
});
test('structured answers are recorded atomically and malformed input does not advance', () => {
  const e = toFinance(), revision = e.revision;
  assert.throws(() => submitFinance(e, { ...data, currency: '' }));
  assert.equal(e.revision, revision); assert.equal(e.getCurrentQuestion().id, 'unit_economics');
  submitFinance(e, { ...data, monthlySales: '', monthlyCapacity: '' });
  assert.equal(e.answerRecords.at(-1).kind, 'FACT');
  assert.equal(e.answerRecords.at(-1).structuredData.monthlySales, null);
  assert.ok(e.generateDeliverableData(1).calculations.length);
});
test('structured data attached to the wrong question is rejected before mutation', () => {
  const e = new OrchestratorEngine();
  assert.throws(() => e.processUserResponse('مالی', null, { structuredData: data }));
  assert.equal(e.answerRecords.length, 0);
});
test('estimates remain estimates in evidence and calculations', () => {
  const e = complete({ ...data, isEstimate: true });
  const answer = activeAnswers(e.answerRecords).find(a => a.questionId === 'unit_economics');
  assert.equal(answer.kind, 'ASSUMPTION'); assert.equal(e.generateDeliverableData(1).calculations[0].isEstimate, true);
});
test('a limited budget is not mislabeled as an estimate just because محدود contains حدود', () => {
  const e = complete();
  assert.equal(activeAnswers(e.answerRecords).find(a => a.questionId === 'cash_constraint').kind, 'FACT');
});
test('controller, export and restore preserve identical validated calculations', async () => {
  const e = toFinance(), controller = new InterviewController(e);
  await controller.submit({ userText: formatUnitEconomics(data), structuredData: data, questionId: 'unit_economics' }, { engineMode: 'local' });
  const pm = new PersistenceManager(), saved = JSON.parse(pm.exportProjectJSON(e)), restored = new OrchestratorEngine();
  assert.equal(pm.restoreToEngine(restored, saved.state), true);
  assert.deepEqual(restored.generateDeliverableData(1).calculations, e.generateDeliverableData(1).calculations);
  saved.state.answerRecords.at(-1).structuredData.period = 'YEAR';
  assert.equal(pm.restoreToEngine(new OrchestratorEngine(), saved.state), false);
});
test('editing to free text removes old calculations and invalidates dependent reports', () => {
  const e = complete(); e.startPhase(2); e.processUserResponse('کافه محله');
  const oldId = e.generateDeliverableData(1).calculations[0].evidenceIds[0];
  editFinance(e, 'هزینه‌ها در حال بازبینی است');
  assert.deepEqual(e.generateDeliverableData(1).calculations, []);
  assert.equal(e.phaseStatus[2], 'INVALIDATED');
  assert.ok(!activeAnswers(e.answerRecords).some(a => a.id === oldId));
});
test('an unknown replacement cannot retain a financial result', () => {
  const e = complete(); editFinance(e, 'نمی‌دانم');
  assert.deepEqual(e.generateDeliverableData('master').calculations, []);
});
test('phase and master reports contain the same calculation with active provenance', () => {
  const e = complete(); const p = e.generateDeliverableData(1), m = e.generateDeliverableData('master');
  assert.deepEqual(m.calculations, p.calculations);
  assert.ok(e.generateMarkdownText('master').includes('۳۳۴'));
  const updated = { ...data, variableCost: 50000 };
  editFinance(e, formatUnitEconomics(updated), updated);
  assert.equal(e.generateDeliverableData(1).calculations[0].breakEvenUnits, 400);
  assert.ok(!e.generateMarkdownText(1).includes('۳۳۴ واحد'));
});
test('negative economics changes both pricing options and action recommendations', () => {
  const e = complete({ ...data, variableCost: 120000 });
  assert.ok(e.generateDeliverableData(1).actions.some(a => a.ruleId === 'repair_unit_margin'));
  e.startPhase(2); e.processUserResponse('کافه محلی'); e.processUserResponse('زمان انتظار زیاد');
  assert.ok(e.getCurrentQuestion().options.some(o => o.value === 'pause_expansion'));
  assert.match(e.getCurrentQuestion().text, /هزینه متغیر/);
});
test('capacity shortfall changes the immediate next question and the plan', () => {
  const e = toFinance(); submitFinance(e, { ...data, monthlyCapacity: 200, monthlySales: 150 });
  assert.match(e.getCurrentQuestion().text, /۳۳۴/); assert.match(e.getCurrentQuestion().text, /۲۰۰/);
  assert.ok(e.generateDeliverableData(1).actions.some(a => a.ruleId === 'capacity_before_acquisition'));
});
test('same guild with a different problem gets different concrete actions', () => {
  const a = complete(), b = complete();
  for (const e of [a, b]) { e.startPhase(2); e.processUserResponse('کافه‌های محله'); }
  a.processUserResponse('معطلی طولانی در صف'); b.processUserResponse('قیمت بالا و توان خرید محدود');
  const actionsA = a.generateDeliverableData(2).actions, actionsB = b.generateDeliverableData(2).actions;
  assert.ok(actionsA.some(x => x.ruleId === 'measure_waiting'));
  assert.ok(actionsB.some(x => x.ruleId === 'test_affordability'));
  assert.ok(!actionsA.some(x => x.ruleId === 'test_affordability'));
  assert.ok(!actionsB.some(x => x.ruleId === 'measure_waiting'));
  for (const [engine, actions] of [[a, actionsA], [b, actionsB]]) {
    const ids = new Set(activeAnswers(engine.answerRecords).map(r => r.id));
    for (const action of actions.filter(x => x.ruleId)) assert.ok(action.evidenceIds.length && action.evidenceIds.every(id => ids.has(id)));
  }
});
test('future answers do not leak into earlier action plans', () => {
  const a = { 1: { coreOffer: 'قهوه', primaryGoal: 'فروش بیشتر' } };
  const b = { ...a, 2: { primaryChannel: 'کانال آینده' }, 3: { promise: 'وعده آینده' }, 8: { leadFunnel: 'مسیر آینده' } };
  assert.deepEqual(generateDeliverable(1, a).actions, generateDeliverable(1, b).actions);
});
