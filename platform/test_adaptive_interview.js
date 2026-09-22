import test from 'node:test';
import assert from 'node:assert/strict';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { InterviewController } from './src/services/interviewController.js';
import { PersistenceManager, validateStateStructure } from './src/services/persistenceManager.js';
import { parseStructuredAIResponse, buildKnowledgeGroundingPrompt, runKnowledgeBrain } from './src/services/geminiService.js';
import { INTERVIEW_FIELDS, activeAnswers, formatSelectedAnswer } from './src/services/interviewSchema.js';
import { validatePhaseGate } from './src/services/phaseGateValidator.js';
import { DEFAULT_GEMINI_API_KEY } from './src/services/endpointSecurity.js';
import { BUSINESS_TYPES_MAP } from './src/data/businessTaxonomy753.js';
import { detectTradeSector } from './src/services/dynamicQuestionEngine.js';
import { detectCrossDomainLeakage } from './src/data/industryVocabularyMap.js';

const foundation = {
  step0_description: ['کافه و برشته‌کاری قهوه', 'hospitality_cafe_roastery'],
  step0_diagnostic_probing: ['رست تازه برای دانشجویان شرق تهران', null],
  step0_stage: ['فعال', 'active'], step0_geography: ['شرق تهران', 'local_city'],
  step1_primary_goal: ['رسیدن به ۵۰ سفارش هفتگی', null],
  step2_core_offer: ['قهوه با رست هفتگی', null],
  step2_value_hypothesis: ['رست تازه و تاریخ مشخص روی بسته', null],
  unit_economics: ['فروش هر فنجان ۱۰۰ هزار تومان، هزینه متغیر ۴۰ هزار تومان و هزینه ثابت ماهانه ۲۰ میلیون تومان', null],
  cash_constraint: ['بودجه محدود ۵ میلیون تومان با دو نفر تیم', null],
};
function fillFoundation(overrides = {}) {
  const e = new OrchestratorEngine();
  const answers = { ...foundation, ...overrides };
  for (let n = 0; n < 20 && e.getCurrentQuestion(); n++) {
    const q = e.getCurrentQuestion();
    assert.ok(answers[q.id], `Unexpected question ${q.id}`);
    e.processUserResponse(...answers[q.id]);
  }
  assert.equal(e.completedPhases[1], true);
  return e;
}
function responseFor(turn, text = 'بر اساس اطلاعاتی که گفتید، این موضوع را دقیق‌تر توضیح می‌دهید؟') {
  const q = turn.snapshot.targetQuestion;
  return { analysisSummary: 'پیشنهاد مبتنی بر پاسخ قبلی', extractedDecision: 'این صرفاً پیشنهاد مدل است', nextQuestion: {
    targetQuestionId: q.id, text, title: q.title,
    options: (q.options || []).slice(0, 4).map((o, i) => ({ label: o.text || o.label, detail: o.detail || '', value: o.value || `v${i}` })),
  } };
}
function edit(e, id, text, value = null) {
  const spec = INTERVIEW_FIELDS.find(s => s.questionId === id);
  e.startPhase(spec.phase);
  e.goToQuestion(e.getCurrentPhaseQuestions().findIndex(q => q.id === id));
  return e.processUserResponse(text, value);
}

// These tests exercise state transitions and generated content, not source-code strings.
test('an explicit guild outranks shared words and generic archetype labels', () => {
  const cases = [
    ['BT-0015', 'PHYSICAL_RETAIL', 'RETAIL'], // Watch repair, not automotive service.
    ['BT-0063', 'ECOMMERCE_DTC', 'RETAIL'], // Argan oil, not engine oil.
    ['BT-0064', 'ECOMMERCE_DTC', 'RETAIL'], // Parts retailer, not garage.
    ['BT-0184', 'SAAS_SOFTWARE', 'SAAS_TECH'], // Fleet software, not garage.
    ['BT-0507', 'EDUCATION', 'EDUCATION_CREATOR'],
    ['BT-0508', 'EDUCATION', 'EDUCATION_CREATOR'],
    ['BT-0536', 'CREATOR_MEDIA_EDUCATION', 'EDUCATION_CREATOR'],
  ];
  for (const [id, archetype, sector] of cases) {
    const e = new OrchestratorEngine(); e.selectGuild(BUSINESS_TYPES_MAP[id]);
    assert.equal(e.businessContext.archetype, archetype, id);
    assert.equal(detectTradeSector(e.businessContext, e.phaseData), sector, id);
    for (const phase of [1, 2, 7, 8]) {
      e.currentPhase = phase;
      const questions = JSON.stringify(e.getCurrentPhaseQuestions().filter(q => q.id !== 'step0_description'));
      assert.doesNotMatch(questions, /کارواش|تعویض روغن/);
    }
  }
});
test('specific cross-industry vocabulary is allowed without allowing unrelated services', () => {
  assert.equal(detectCrossDomainLeakage('فروش آنلاین لنت ترمز', 'BT-0064').hasLeakage, false);
  assert.equal(detectCrossDomainLeakage('تعمیر گیربکس اتوماتیک', 'BT-0508').hasLeakage, false);
  assert.equal(detectCrossDomainLeakage('بسته خدمات کارواش و تعویض روغن', 'BT-0064').hasLeakage, true);
  assert.equal(detectCrossDomainLeakage('تعویض روغن', 'BT-0063').hasLeakage, true);
});
test('same guild: customer pain changes pricing questions and options', () => {
  const a = fillFoundation(), b = fillFoundation();
  for (const e of [a, b]) { e.startPhase(2); e.processUserResponse('دو کافه نزدیک دانشگاه'); }
  a.processUserResponse('دانشجویان کم‌درآمد توان خرید محدود دارند');
  b.processUserResponse('خریداران دنبال کیفیت و تجربه حرفه‌ای‌اند');
  assert.notEqual(a.getCurrentQuestion().text, b.getCurrentQuestion().text);
  assert.notDeepEqual(a.getCurrentQuestion().options, b.getCurrentQuestion().options);
  assert.ok(a.getCurrentQuestion().options.some(o => o.value === 'tiered_offer'));
});
test('same guild: budget changes channel options without any API', () => {
  const a = fillFoundation(), b = fillFoundation({ cash_constraint: ['بودجه تبلیغ ۵۰۰ میلیون تومان با تیم رسانه', null] });
  for (const e of [a, b]) { e.startPhase(2); e.processUserResponse('رقیب محلی'); e.processUserResponse('زمان انتظار بالا'); e.processUserResponse('تعرفه شفاف'); }
  assert.notDeepEqual(a.getCurrentQuestion().options, b.getCurrentQuestion().options);
  assert.ok(a.getCurrentQuestion().options.some(o => o.value === 'capped_experiment'));
});
test('being a student alone does not imply limited purchasing power', () => {
  const e = fillFoundation(); e.startPhase(2);
  e.processUserResponse('کافه‌های نزدیک دانشگاه');
  e.processUserResponse('دانشجویان محیط آرام و کیفیت بهتر می‌خواهند');
  assert.equal(e.getCurrentQuestion().options.some(o => o.value === 'affordable_entry'), false);
});
test('AI question writes the canonical field used by documents', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description);
  const turn = e.createAITurn(); assert.equal(e.applyAIResult(turn, responseFor(turn)), true);
  const dynamicId = e.getCurrentQuestion().id;
  assert.ok(dynamicId.startsWith('ai-'));
  e.processUserResponse('پاتوق آرام برای برنامه‌نویسان');
  assert.equal(e.phaseData[1].diagnosticVision, 'پاتوق آرام برای برنامه‌نویسان');
  assert.ok(e.generateMarkdownText(1).includes('پاتوق آرام برای برنامه‌نویسان'));
  assert.equal(e.answerRecords.at(-1).presentedQuestionId, dynamicId);
  assert.equal(e.decisions.some(d => d.statement.includes('صرفاً پیشنهاد مدل')), false);
});
test('rejects wrong phase, unknown field and unsafe enum adaptations', () => {
  const e = new OrchestratorEngine();
  const turn = e.createAITurn(); const result = responseFor(turn);
  result.nextQuestion.targetQuestionId = 'p8_lead_funnel';
  assert.equal(e.applyAIResult(turn, result), false);
  result.nextQuestion.targetQuestionId = turn.questionId;
  result.nextQuestion.options = [{ label: 'ساختگی', value: 'wrong_route' }];
  assert.equal(e.applyAIResult(turn, result), false);
});
test('duplicate AI option values are rejected', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description);
  const turn = e.createAITurn(), result = responseFor(turn);
  result.nextQuestion.options = [{ label: 'اول', value: 'same' }, { label: 'دوم', value: 'same' }];
  assert.equal(e.applyAIResult(turn, result), false);
});
test('late AI answer cannot overwrite a newer answer, navigation or guild', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description);
  const turn = e.createAITurn(); e.processUserResponse('دیدگاه جدید');
  assert.equal(e.applyAIResult(turn, responseFor(turn)), false);
  const nextTurn = e.createAITurn(); e.navigateBack();
  assert.equal(e.applyAIResult(nextTurn, responseFor(nextTurn)), false);
  const guildTurn = e.createAITurn(); e.selectGuild({ id: 'BT-0136', titleFa: 'کارواش' });
  assert.equal(e.applyAIResult(guildTurn, responseFor(guildTurn)), false);
});
test('serial controller saves before AI and rejects double submit', async () => {
  let finish, calls = 0, saved = false;
  const e = new OrchestratorEngine();
  const controller = new InterviewController(e, snapshot => { calls++; assert.ok(saved); return new Promise(resolve => { finish = () => resolve(responseFor({ snapshot })); }); });
  const questionId = e.getCurrentQuestion().id;
  const first = controller.submit({ userText: foundation.step0_description[0], optionValue: foundation.step0_description[1], questionId }, { engineMode: 'gemini', apiKey: 'test' }, () => { saved = true; });
  const duplicate = await controller.submit({ userText: 'تکراری', questionId }, { engineMode: 'gemini', apiKey: 'test' });
  assert.equal(duplicate.ignored, true); assert.equal(calls, 1); assert.equal(e.answerRecords.length, 1);
  finish(); await first; assert.equal(controller.busy, false);
});
test('cancel ignores a provider that ignores AbortSignal', async () => {
  let finish;
  const e = new OrchestratorEngine();
  const controller = new InterviewController(e, snapshot => new Promise(resolve => { finish = () => resolve(responseFor({ snapshot })); }));
  const promise = controller.submit({ userText: 'کافه', questionId: e.getCurrentQuestion().id }, { engineMode: 'gemini', apiKey: 'test' });
  controller.cancel(); finish();
  assert.equal((await promise).cancelled, true);
  assert.equal(e.dynamicQuestion, null);
});
test('API failure is visible and preserves answer and local next question', async () => {
  const e = new OrchestratorEngine();
  const controller = new InterviewController(e, async () => { throw new Error('خطای شبکه'); });
  const result = await controller.submit({ userText: 'کافه', questionId: e.getCurrentQuestion().id }, { engineMode: 'gemini', apiKey: 'test' });
  assert.equal(result.mode, 'local'); assert.match(result.message, /خطای شبکه/);
  assert.equal(e.phaseData[1].description, 'کافه'); assert.ok(e.getCurrentQuestion());
});
test('custom endpoint is called without requiring a Google key', async () => {
  const e = new OrchestratorEngine(); let called = false;
  const controller = new InterviewController(e, async snapshot => { called = true; return responseFor({ snapshot }); });
  await controller.submit({ userText: 'کافه', questionId: e.getCurrentQuestion().id }, { engineMode: 'gemini', customEndpoint: 'https://example.com' });
  assert.ok(called);
});
test('full option detail survives storage, export and report', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description);
  const text = formatSelectedAnswer({ label: 'آزمون محدود', detail: 'هر هفته فقط ۲۰ بسته برای دانشجویان' });
  e.processUserResponse(text);
  assert.equal(e.phaseData[1].diagnosticVision, text);
  assert.ok(new PersistenceManager().exportProjectJSON(e).includes('۲۰ بسته'));
  assert.ok(e.generateMarkdownText(1).includes('۲۰ بسته'));
});
test('editing removes stale enum values and supersedes evidence', () => {
  const e = fillFoundation();
  edit(e, 'step1_primary_goal', 'کاهش زمان انتظار به ده دقیقه');
  assert.equal(e.phaseData[1].primaryGoalValue, undefined);
  assert.equal(activeAnswers(e.answerRecords).filter(a => a.questionId === 'step1_primary_goal').length, 1);
  assert.ok(e.answerRecords.some(a => a.status === 'SUPERSEDED'));
  assert.ok(!e.generateMarkdownText(1).includes('۵۰ سفارش'));
});
test('known -> unknown invalidates documents and removes obsolete fact', () => {
  const e = fillFoundation(); e.completedPhases[2] = true; e.phaseData[2].competitors = 'رقیب';
  edit(e, 'step2_core_offer', 'نمی‌دانم', 'unknown');
  assert.equal(e.completedPhases[2], false); assert.equal(e.phaseStatus[2], 'INVALIDATED');
  assert.ok(!e.facts.some(f => f.statement.includes('قهوه با رست هفتگی')));
  assert.equal(e.generateDeliverableData(1).status, 'DRAFT');
  assert.equal(e.generateDeliverableData(2).status, 'NEEDS_REVIEW');
});
test('unknown -> known resolves the blocking unknown', () => {
  const e = fillFoundation(); edit(e, 'step2_core_offer', 'نمی‌دانم', 'unknown');
  edit(e, 'step2_core_offer', 'فروش بسته قهوه تازه');
  assert.ok(e.unknowns.filter(u => u.questionId === 'step2_core_offer').every(u => u.status === 'RESOLVED'));
});
test('downstream answers require actual review after upstream edit', () => {
  const e = fillFoundation(); e.phaseData[2] = { competitors: 'رقیب', customerPain: 'انتظار', pricingModel: 'شفاف', primaryChannel: 'محلی', goldenOpportunity: 'سرعت' }; e.completedPhases[2] = true;
  edit(e, 'step1_primary_goal', 'افزایش سفارش بسته به جای فنجان');
  assert.ok(e.reviewRequired[1]?.includes('step2_core_offer'), 'same-phase dependent answer must require review');
  assert.equal(e.phaseStatus[2], 'INVALIDATED', 'only graph-reachable downstream phase data is invalidated');
  const gate = e.finalizeCurrentPhase();
  assert.equal(gate.gatePassed, false, 'phase 1 cannot be re-approved until dependent answers are reviewed');
  assert.throws(() => e.startPhase(2), /فاز پیش‌نیاز 1/);
});
test('unknown output has no invented offer, identity, price or KPI threshold', () => {
  const e = new OrchestratorEngine(); const md = e.generateMarkdownText('master');
  assert.ok(md.includes('هنوز پاسخی ثبت نشده'));
  for (const forbidden of ['رفیق کاربلد و امین', 'توسعه پایدار و مشتریان وفادار', '۳۰٪', '۱.۵ برابر']) assert.ok(!md.includes(forbidden));
  assert.equal(e.generateDeliverableData('master').status, 'DRAFT');
});
test('every factual document claim references an active answer', () => {
  const e = fillFoundation(); const doc = e.generateDeliverableData('master');
  const ids = new Set(activeAnswers(e.answerRecords).map(a => a.id));
  assert.ok(doc.evidence.length > 0);
  for (const claim of doc.evidence) { assert.ok(claim.evidenceIds.length); assert.ok(claim.evidenceIds.every(id => ids.has(id))); }
});
test('same sector with different offers produces different decisions and actions', () => {
  const a = fillFoundation(), b = fillFoundation({ step2_core_offer: ['اشتراک بسته قهوه برای خانه', null], step1_primary_goal: ['افزایش تمدید اشتراک', null] });
  assert.notDeepEqual(a.generateDeliverableData(1).evidence, b.generateDeliverableData(1).evidence);
  assert.notDeepEqual(a.generateDeliverableData(1).actions, b.generateDeliverableData(1).actions);
  assert.ok(b.generateMarkdownText('master').includes('افزایش تمدید اشتراک'));
});
test('state roundtrip retains active dynamic question, history and evidence', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description);
  const turn = e.createAITurn(); e.applyAIResult(turn, responseFor(turn));
  const pm = new PersistenceManager(); const imported = pm.importProjectJSON(pm.exportProjectJSON(e));
  const restored = new OrchestratorEngine(); assert.equal(pm.restoreToEngine(restored, imported.state), true);
  assert.deepEqual(restored.answerRecords, e.answerRecords);
  assert.equal(restored.getCurrentQuestion().id, e.getCurrentQuestion().id);
  restored.processUserResponse('دیدگاه پس از بازیابی');
  assert.equal(restored.phaseData[1].diagnosticVision, 'دیدگاه پس از بازیابی');
  assert.equal(restored.dynamicQuestionsHistory.at(-1).userAnswer, 'دیدگاه پس از بازیابی');
});
test('v1 migration preserves answers and reopens unreliable phase approvals', () => {
  const pm = new PersistenceManager(); const imported = pm.importProjectJSON(JSON.stringify({ schemaVersion: 1, state: { currentPhase: 3, completedPhases: { 1: true, 2: true }, phaseData: { 1: { description: 'کافه قبلی' } } } }));
  assert.equal(imported.success, true); assert.equal(imported.state.currentPhase, 1);
  assert.equal(imported.state.completedPhases[1], false);
  assert.equal(imported.state.answerRecords[0].text, 'کافه قبلی');
});
test('malformed state and malformed AI option types cannot corrupt engine', () => {
  assert.equal(validateStateStructure({ currentPhase: 1.2, completedPhases: [], phaseData: [] }).valid, false);
  assert.doesNotThrow(() => parseStructuredAIResponse(JSON.stringify({ nextQuestion: { text: 'سؤال', title: {}, whyItMatters: 42, options: [{ label: 4, detail: {}, value: [] }] } })));
});
test('context defaults cannot satisfy missing foundation answers', () => {
  const e = new OrchestratorEngine(); e.processUserResponse(...foundation.step0_description); e.processUserResponse('فعال', 'active');
  assert.equal(e.finalizeCurrentPhase().gatePassed, false);
  assert.throws(() => e.startPhase(2));
});
test('pricing conflict is prioritized and correction removes it', () => {
  const e = fillFoundation(); e.phaseData[2] = { pricingModel: 'ارزان‌ترین قیمت با تخفیف' }; e.phaseData[3] = { positioning: 'لوکس و پریمیوم', targetSegment: 'مشتری مرفه' }; e.completedPhases[2] = true; e.currentPhase = 3;
  e.refreshContradictions();
  const q = e.getCurrentQuestion(); assert.ok(q.resolutionFor); assert.equal(q.id, 'p3_positioning_frame');
  e.processUserResponse('خدمت اقتصادی و قابل اعتماد');
  assert.ok(e.contradictions.filter(c => c.ruleId === 'price_position').every(c => c.resolutionStatus === 'RESOLVED'));
});
test('negated discounts do not trigger luxury conflict', () => {
  const e = fillFoundation(); e.phaseData[2] = { pricingModel: 'عدم ورود به جنگ تخفیف' }; e.phaseData[3] = { positioning: 'لوکس' }; e.refreshContradictions();
  assert.ok(!e.contradictions.some(c => c.ruleId === 'price_position'));
});
test('prompt includes question-and-answer pairs, uncertainties and exact target', () => {
  const e = fillFoundation(); e.startPhase(2); const turn = e.createAITurn();
  const prompt = buildKnowledgeGroundingPrompt(turn.snapshot);
  assert.ok(prompt.includes(JSON.stringify(e.answerRecords[0].questionText)));
  assert.ok(prompt.includes('targetQuestionId')); assert.ok(prompt.includes(turn.questionId));
  assert.ok(prompt.includes('هنوز') || prompt.includes('مجهول'));
});
test('API request permits complete JSON and forwards signal; truncated output fails safely', async () => {
  const original = globalThis.fetch;
  let payload;
  globalThis.fetch = async (_url, options) => { payload = JSON.parse(options.body); assert.ok(options.signal); return { ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: '{}' }] } }] }) }; };
  try { await assert.rejects(() => runKnowledgeBrain({ apiKey: 'test', userText: 'پاسخ', targetQuestion: { id: 'test' } }), /کامل نشد/); assert.ok(payload.generationConfig.maxOutputTokens >= 2000); }
  finally { globalThis.fetch = original; }
});
test('no built-in shared API credential remains', () => assert.equal(DEFAULT_GEMINI_API_KEY, ''));
