import test from 'node:test';
import assert from 'node:assert/strict';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

const web = {
  step0_description: ['طراحی سایت'],
  step0_diagnostic_probing: ['برای شرکت‌های خدماتی سایت معرفی و ثبت درخواست می‌سازیم؛ مدیر شرکت هزینه می‌دهد'],
  step0_stage: ['فعال', 'active'],
  step0_geography: ['چند شهر ایران', 'nationwide_iran'],
  step1_primary_goal: ['افزایش قراردادهای طراحی سایت در سه ماه'],
  step2_core_offer: ['طراحی سایت شرکتی و فرم ثبت درخواست با آموزش', 'website_company'],
  step2_value_hypothesis: ['مدیر شرکت بتواند درخواست‌ها را ببیند؛ هنوز سنجه عملکرد نداریم'],
  unit_economics: ['قیمت هر پروژه ۳۰ میلیون تومان و هزینه متغیر ۱۲ میلیون تومان'],
  cash_constraint: ['بودجه بازاریابی محدود ۵ میلیون تومان با دو نفر تیم'],
};

const maintenance = {
  ...web,
  step0_description: ['تعمیر و نگهداری دستگاه تصفیه آب مدارس'],
  step0_diagnostic_probing: ['مدیر مدرسه سفارش می‌دهد و هزینه می‌پردازد؛ تکنسین حضوری سرویس می‌کند'],
  step1_primary_goal: ['کاهش خرابی دستگاه‌ها در سه ماه'],
  step2_core_offer: ['سرویس دستگاه، تعویض فیلتر و گزارش کیفیت آب'],
  step2_value_hypothesis: ['گزارش ثبت سرویس و خرابی؛ هنوز نتیجه با مشتری آزموده نشده'],
};

function foundation(answers) {
  const engine = new OrchestratorEngine();
  for (let n = 0; n < 12 && !engine.completedPhases[1]; n++) {
    const q = engine.getCurrentQuestion();
    assert.ok(q && answers[q.id], `Missing foundation answer for ${q?.id}`);
    engine.processUserResponse(...answers[q.id]);
  }
  assert.equal(engine.completedPhases[1], true);
  return engine;
}

test('website design gets relevant choices and grounded questions through all eight phases', () => {
  const engine = foundation(web);
  const selected = {};
  for (let phase = 2; phase <= 8; phase++) {
    engine.startPhase(phase);
    for (let n = 0; n < 16 && !engine.completedPhases[phase]; n++) {
      const q = engine.getCurrentQuestion();
      assert.ok(q, `Phase ${phase} has a question`);
      assert.ok(q.options?.length >= 2, `${q.id} offers meaningful choices`);
      assert.equal(q.allowCustomAnswer, true, `${q.id} also accepts a real answer`);
      assert.doesNotMatch(JSON.stringify(q), /کافه|قهوه|کارواش|روغن موتور|سامانه مودیان|سالن انتظار|بیمار|پادکست تراز اول/);
      selected[q.id] = { text: q.text, options: q.options.map(option => option.text) };
      const option = q.options[0];
      engine.processUserResponse(option.text, option.value);
    }
    assert.equal(engine.completedPhases[phase], true, `Phase ${phase} finishes with user selections`);
  }
  assert.match(selected.p2_step0_competitors.options.join(' '), /آژانس|سایت‌ساز/);
  assert.match(selected.p2_step1_customer_pain.text, /طراحی سایت شرکتی/);
  assert.match(selected.p3_target_segment.options.join(' '), /شرکت خدماتی|ثبت و پیگیری درخواست/);
  assert.match(selected.p3_positioning_frame.text, /مدیر شرکت|سایت/);
  assert.match(selected.p5_elevator_hook.text, /طراحی سایت شرکتی/);
  assert.match(selected.p8_lead_funnel.text, /قرارداد/);
  const output = engine.generateMarkdownText('master');
  assert.match(output, /طراحی سایت شرکتی و فرم ثبت درخواست/);
  assert.equal(engine.generateDeliverableData('master').status, 'CONFIRMED');
});

test('unrelated freeform activity does not inherit website questions or options', () => {
  const webEngine = foundation(web), other = foundation(maintenance);
  webEngine.startPhase(2); other.startPhase(2);
  const webQuestion = webEngine.getCurrentQuestion(), otherQuestion = other.getCurrentQuestion();
  assert.notDeepEqual(webQuestion.options, otherQuestion.options);
  assert.match(webQuestion.options.map(o => o.text).join(' '), /سایت/);
  assert.doesNotMatch(JSON.stringify(otherQuestion), /سایت|آژانس|فریلنسر|فروشگاه اینترنتی/);
  other.processUserResponse('مدرسه فعلاً تعمیرکار موردی می‌گیرد');
  assert.match(other.getCurrentQuestion().text, /سرویس دستگاه/);
  assert.doesNotMatch(JSON.stringify(other.getCurrentQuestion()), /سایت|آژانس/);
});

test('editing an earlier answer updates downstream wording and choices', () => {
  const engine = foundation(web);
  engine.startPhase(2);
  engine.processUserResponse('شرکت‌ها فعلاً از طراح مستقل استفاده می‌کنند');
  const before = engine.getCurrentQuestion();
  assert.match(before.text, /طراحی سایت شرکتی/);
  engine.processUserResponse('تأخیر در تحویل و ابهام محدوده پروژه');
  const pricing = engine.getCurrentQuestion();
  assert.match(pricing.text, /تأخیر در تحویل/);
  assert.ok(pricing.options.some(o => o.detail?.includes('هزینه')));
  engine.goToQuestion(1);
  engine.processUserResponse('نبود آموزش بعد از تحویل سایت');
  assert.match(engine.getCurrentQuestion().text, /نبود آموزش بعد از تحویل سایت/);
  assert.doesNotMatch(engine.getCurrentQuestion().text, /تأخیر در تحویل/);
});

test('the chosen website service changes target segment choices', () => {
  const company = foundation(web);
  const store = foundation({ ...web, step2_core_offer: ['طراحی فروشگاه اینترنتی با سبد خرید و مدیریت سفارش', 'website_store'] });
  company.completedPhases[2] = true;
  store.completedPhases[2] = true;
  company.startPhase(3);
  store.startPhase(3);
  const companyChoices = company.getCurrentQuestion().options.map(o => o.text).join(' ');
  const storeChoices = store.getCurrentQuestion().options.map(o => o.text).join(' ');
  assert.match(companyChoices, /شرکت خدماتی/);
  assert.match(storeChoices, /فروشگاه|سفارش/);
  assert.doesNotMatch(storeChoices, /شرکت خدماتی/);
});

test('an AI suggestion cannot replace freeform business choices with unrelated ones', () => {
  const engine = foundation(web);
  engine.startPhase(2);
  const turn = engine.createAITurn();
  const result = { nextQuestion: {
    targetQuestionId: turn.questionId,
    text: 'کدام نوع قهوه می‌فروشید؟',
    options: [{ label: 'رستری قهوه', value: 'coffee_roastery' }],
  } };
  assert.equal(engine.applyAIResult(turn, result), true);
  const presented = engine.getCurrentQuestion();
  assert.match(presented.text, /سایت/);
  assert.doesNotMatch(JSON.stringify(presented.options), /قهوه|رستری/);
});
