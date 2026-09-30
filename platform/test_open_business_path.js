import test from 'node:test';
import assert from 'node:assert/strict';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { resolveDomainSpecialization, generateContextProfileMarkdown } from './src/data/businessContextRouter.js';
import { toCanonicalModuleContext } from './src/reasoning/modules/contextAdapter.js';

const drone = 'سامانه اجاره پهپاد پایش مزرعه با اپراتور و اشتراک داده برای تعاونی‌ها';
const school = 'اشتراک تعمیر و نگهداری دستگاه تصفیه آب برای مدارس';

test('an unlisted mixed business retains its own identity and asks about the buyer', () => {
  const e = new OrchestratorEngine();
  e.selectGuild({ custom: true, titleFa: drone });
  assert.equal(e.phaseData[1].description, drone);
  assert.equal(e.businessContext.taxonomyId, null);
  assert.equal(e.businessContext.iranianGuildCode, null);
  assert.equal(e.businessContext.customerModel, 'B2B');
  assert.equal(e.businessContext.axes.offerType, 'MIXED');
  assert.equal(e.businessContext.axes.revenueModel, 'UNKNOWN', 'sharing data does not establish subscription billing');
  assert.equal(e.getCurrentQuestion().id, 'step0_diagnostic_probing');
  assert.match(e.getCurrentQuestion().text, /چه کسی هزینه را می‌پردازد/);
  assert.deepEqual(e.getCurrentQuestion().options, []);
  assert.equal(toCanonicalModuleContext(e.businessContext).businessTypeId, null);
  const spec = resolveDomainSpecialization(e.businessContext, e.businessContext.axes, 1);
  assert.equal(spec.specializationLevel, 'ARCHETYPE_FALLBACK');
  assert.equal(spec.taxonomyId, null);
  assert.doesNotMatch(spec.phaseInstruction, /رستری|سامانه مودیان|کارواش/);
  const profile = generateContextProfileMarkdown(e.businessContext);
  assert.match(profile, /سامانه اجاره پهپاد/);
  assert.doesNotMatch(profile, /BT-0753|999999|IND-31/);
});

test('later answers alter the questions and outputs of a second unlisted business', () => {
  const e = new OrchestratorEngine();
  e.processUserResponse(school);
  assert.equal(e.businessContext.taxonomyId, null);
  assert.notEqual(e.getCurrentQuestion().text.includes(drone), true);
  e.processUserResponse('مدیر مدرسه هزینه را می‌دهد تا آب سالم داشته باشد؛ تکنسین حضوری دستگاه را سرویس می‌کند');
  assert.match(e.getCurrentQuestion().text, /مرحله/);
  e.processUserResponse('فعال', 'active');
  e.processUserResponse('مدارس تهران و سرویس حضوری', 'local_city');
  e.processUserResponse('کاهش خرابی دستگاه در سه ماه');
  const offerQuestion = e.getCurrentQuestion();
  assert.equal(offerQuestion.id, 'step2_core_offer');
  assert.match(offerQuestion.text, /مدیر مدرسه/);
  assert.deepEqual(offerQuestion.options, []);
  e.processUserResponse('اشتراک ماهانه سرویس حضوری و تعویض فیلتر با گزارش کیفیت آب');
  assert.equal(e.businessContext.axes.revenueModel, 'RECURRING');
  assert.equal(e.businessContext.taxonomyId, null);
  assert.match(e.getCurrentQuestion().text, /شاهد واقعی/);
  const md = e.generateMarkdownText(1);
  assert.match(md, /تصفیه آب/);
  assert.match(md, /اشتراک ماهانه سرویس حضوری/);
  assert.doesNotMatch(md, /رستری|سامانه مودیان|کارواش|BT-0753/);
});

test('selecting a catalog guild after freeform description replaces the custom context', () => {
  const e = new OrchestratorEngine();
  e.processUserResponse(drone);
  e.selectGuild({ id: 'BT-0066', titleFa: 'کافه تخصصی و رستری موج سوم' });
  assert.equal(e.businessContext.taxonomyId, 'BT-0066');
  assert.equal(e.businessContext.customBusiness, undefined);
  assert.equal(e.phaseData[1].descriptionValue, 'BT-0066');
});

test('an unlisted business completes the foundation and advances to evidence-led market questions', () => {
  const e = new OrchestratorEngine();
  const answers = {
    step0_description: [school],
    step0_diagnostic_probing: ['مدیر مدرسه هزینه را می‌دهد و تکنسین سرویس حضوری انجام می‌دهد'],
    step0_stage: ['فعال', 'active'],
    step0_geography: ['مدارس تهران', 'local_city'],
    step1_primary_goal: ['کاهش خرابی دستگاه در سه ماه'],
    step2_core_offer: ['اشتراک ماهانه سرویس و تعویض فیلتر با گزارش کیفیت آب'],
    step2_value_hypothesis: ['ثبت زمان خرابی و تأیید تحویل سرویس در هر مراجعه'],
    unit_economics: ['قیمت ماهانه ۵۰۰ هزار تومان، هزینه متغیر ۲۵۰ هزار تومان'],
    cash_constraint: ['بودجه ۲ میلیون تومان با یک تکنسین'],
  };
  for (let i = 0; i < 12 && e.getCurrentQuestion(); i++) {
    const question = e.getCurrentQuestion();
    assert.ok(answers[question.id], `Unexpected foundation question ${question.id}`);
    e.processUserResponse(...answers[question.id]);
  }
  assert.equal(e.completedPhases[1], true);
  assert.equal(e.businessContext.axes.geography, 'CITY');
  assert.equal(e.generateDeliverableData(1).status, 'CONFIRMED');
  e.startPhase(2);
  assert.match(e.getCurrentQuestion().text, /چه جایگزین‌هایی استفاده می‌کند/);
  assert.match(e.generateMarkdownText('master'), /مدیر مدرسه/);
  assert.doesNotMatch(e.generateMarkdownText('master'), /BT-0753|999999|مودیان/);
});
