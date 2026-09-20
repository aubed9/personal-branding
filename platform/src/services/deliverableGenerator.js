import { INTERVIEW_FIELDS, activeAnswers, migrateAnswerRecords } from './interviewSchema.js';
import { validatePhaseGate } from './phaseGateValidator.js';
import { PHASES_DATA } from '../data/phase1Templates.js';

const MISSING = 'هنوز پاسخی ثبت نشده است';
const STATUS_LABELS = { FACT: 'گفته کاربر، تأیید مستقل نشده', DECISION: 'انتخاب کاربر', ASSUMPTION: 'فرضیه نیازمند آزمون', UNKNOWN: 'مجهول' };
const METHOD = {
  1: 'تفکیک درآمد و هزینه هر فروش و تعیین محدودیت منابع قبل از برنامه رشد',
  2: 'مقایسه شواهد مشتری و رقبا و آزمون تقاضا با خرید واقعی',
  3: 'انتخاب مشتری، جایگاه و وعده‌ای که با توان اجرا سازگار باشد',
  4: 'تبدیل شخصیت انتخابی به رفتار قابل مشاهده در برخورد با مشتری',
  5: 'آزمون درک پیام با مشتری هدف و حذف ادعاهای بدون شاهد',
  6: 'بررسی تلفظ، یادآوری و تمایز نام؛ نیاز به استعلام مستقل پیش از ثبت',
  7: 'آزمون خوانایی و کاربرد رنگ، حروف و نشان در محل استفاده واقعی',
  8: 'آزمون محدود کانال منتخب، ثبت نتیجه و تعریف مسئول رسیدگی به شکایت',
};
const WIKI_PATHS = {
  1: 'wiki/01-business-foundation/unit-economics.md', 2: 'wiki/02-market-research/evidence-quality.md',
  3: 'wiki/03-strategy/positioning.md', 4: 'wiki/04-brand-identity/brand-character.md',
  5: 'wiki/05-verbal-identity/messaging.md', 6: 'wiki/06-naming/naming-evaluation.md',
  7: 'wiki/00-system/decision-traceability.md', 8: 'wiki/10-playbooks/crisis.md',
};
const METRICS = {
  1: [['حاشیه مشارکت هر فروش', 'قیمت فروش - هزینه متغیر همان فروش'], ['تعداد فروش سربه‌سر', 'هزینه ثابت دوره / حاشیه مشارکت هر فروش']],
  2: [['نرخ خرید در آزمون پیشنهاد', 'خریدهای واقعی / افراد دریافت‌کننده پیشنهاد']],
  3: [['نرخ پذیرش پیشنهاد در گروه هدف', 'خریداران گروه هدف / افراد آزموده‌شده همان گروه']],
  4: [['اجرای رفتار توافق‌شده', 'تعامل‌های مطابق رفتار / تعامل‌های بررسی‌شده']],
  5: [['درک درست پیام', 'افراد با برداشت درست / افراد آزموده‌شده']],
  6: [['یادآوری درست نام', 'یادآوری‌های درست / افراد آزموده‌شده']],
  7: [['خوانایی در محل استفاده', 'کاربران موفق در خواندن / کاربران آزموده‌شده']],
  8: [['تبدیل به خرید', 'خریداران / مخاطبان همان کانال'], ['هزینه جذب مشتری', 'هزینه قابل انتساب به کانال / مشتری جدید همان کانال']],
};

function evidenceRows(phaseData, records) {
  const current = activeAnswers(records.length ? records : migrateAnswerRecords(phaseData));
  return INTERVIEW_FIELDS.map(spec => {
    const answer = current.find(item => item.phase === spec.phase && item.questionId === spec.questionId);
    return { ...spec, answer, text: answer?.text || MISSING, evidenceIds: answer ? [answer.id] : [] };
  });
}
const sourceNote = row => row.answer ? `[${row.answer.kind}] ${row.text} [${row.answer.id}]` : `[UNKNOWN] ${MISSING}`;
const quote = value => String(value).replace(/\s+/g, ' ').slice(0, 260);

function buildPhase(phase, state, rows) {
  const own = rows.filter(row => row.phase === phase);
  const available = own.filter(row => row.answer && row.answer.kind !== 'UNKNOWN');
  const gate = validatePhaseGate(phase, state);
  const stale = state.phaseStatus?.[phase] === 'INVALIDATED';
  const confirmed = !stale && state.completedPhases?.[phase] && gate.passed;
  const status = stale ? 'NEEDS_REVIEW' : confirmed ? 'CONFIRMED' : 'DRAFT';
  const statusFa = stale ? 'نیازمند بازبینی پس از تغییر داده مبنا' : confirmed ? 'پاسخ‌های فاز تکمیل شده؛ فرضیه‌ها همچنان نیازمند آزمون‌اند' : 'پیش‌نویس؛ گیت فاز تأیید نشده';
  const value = (p, field) => rows.find(row => row.phase === p && row.field === field);
  const offer = value(1, 'coreOffer');
  const goal = value(1, 'primaryGoal');
  const budget = value(1, 'budgetConstraint');
  const channel = value(2, 'primaryChannel');
  const audience = value(3, 'targetSegment');
  const promise = value(3, 'promise');
  const dependencies = [offer, goal, budget, channel, audience, promise].filter(row => row && row.phase < phase && row.answer);
  const missing = own.filter(row => !row.answer || row.answer.kind === 'UNKNOWN');
  const decisions = own.filter(row => row.answer?.kind === 'DECISION');
  const claims = available.map(row => ({
    statement: `${row.label}: ${row.text}`, kind: row.answer.kind,
    evidenceIds: row.evidenceIds, field: row.field,
  }));
  const actions = [];
  for (const row of missing) {
    actions.push({ statement: `۳۰ روز: داده «${row.label}» را جمع‌آوری کنید. مسئول و مهلت دقیق هنوز باید تعیین شود.`, kind: 'PROPOSAL', evidenceIds: row.evidenceIds });
  }
  for (const row of available) {
    actions.push({
      statement: `۳۰ روز: «${row.label}: ${quote(row.text)}» را ${row.answer.kind === 'FACT' ? 'با سند یا مشاهده واقعی بررسی و ثبت کنید' : 'در یک آزمون محدود با مشتری بررسی کنید'}.`,
      kind: 'PROPOSAL', evidenceIds: row.evidenceIds,
    });
  }
  if (budget?.answer && /محدود|کمبود|بدون بودجه|صفر/.test(budget.text)) {
    actions.push({ statement: `پیش از هزینه: برای هر آزمون سقف هزینه و شرط توقف تعیین کنید. محدودیت اعلام‌شده شما «${quote(budget.text)}» است؛ توسعه کانال تا تأیید نتیجه آزمون پیشنهاد نمی‌شود.`, kind: 'PROPOSAL', evidenceIds: budget.evidenceIds });
  }
  if (phase >= 3 && channel?.answer) {
    actions.push({ statement: `۶۰ روز: نتیجه آزمون را در کانال منتخب «${quote(channel.text)}» با مبنای دوره اول مقایسه کنید.`, kind: 'PROPOSAL', evidenceIds: channel.evidenceIds });
  } else {
    actions.push({ statement: '۶۰ روز: نتیجه آزمون‌های دوره اول را ثبت کنید؛ بدون اندازه‌گیری اولیه، درصد رشد یا موفقیت تعیین نکنید.', kind: 'PROPOSAL', evidenceIds: available.flatMap(row => row.evidenceIds) });
  }
  actions.push({ statement: `۹۰ روز: بر اساس نتیجه آزمون‌ها، ادامه یا اصلاح «${quote(goal?.text || MISSING)}» را تصمیم بگیرید. افزایش بودجه مشروط به شواهد است.`, kind: 'PROPOSAL', evidenceIds: goal?.evidenceIds || [] });

  const framework = [`[METHOD] ${METHOD[phase]}`, `[METHOD] مرجع داخلی روش: ${WIKI_PATHS[phase]}. این مرجع شاهد اختصاصی کسب‌وکار یا منبع زنده بازار نیست.`];
  if (dependencies.length) framework.push(...dependencies.map(row => `[DEPENDENCY] ${row.label}: ${sourceNote(row)}`));
  if (phase >= 3 && offer?.answer && audience?.answer && promise?.answer) {
    framework.push(`[PROPOSAL] بریف مبتنی بر انتخاب‌های شما: ارائه «${quote(offer.text)}» برای «${quote(audience.text)}» با تعهد «${quote(promise.text)}». این ترکیب باید با شواهد مشتری آزموده شود. [${[...offer.evidenceIds, ...audience.evidenceIds, ...promise.evidenceIds].join(', ')}]`);
  }
  framework.push(...decisions.map(row => `[DECISION] ${row.label}: ${row.text} [${row.answer.id}]`));
  if (!decisions.length) framework.push('[UNKNOWN] هنوز انتخاب مصوبی برای این فاز ثبت نشده است.');

  const openUnknowns = (state.unknowns || []).filter(u => u.phase <= phase && ['OPEN', 'IN_RESEARCH'].includes(u.status));
  const constraints = [
    `[STATUS] ${statusFa}`,
    '[GUARDRAIL] ادعای کاربر با واقعیت تأییدشده مستقل یکسان نیست؛ هر عدد برآوردی باید پیش از تصمیم مالی آزموده شود.',
    '[GUARDRAIL] نام، شعار و جهت بصری انتخابی تا تولید و بررسی مصداق نهایی، طرح یا علامت ثبت‌شده محسوب نمی‌شوند.',
    ...gate.blockingReasons.map(reason => `[BLOCKER] ${reason}`),
    ...gate.warnings.map(warning => `[UNKNOWN] ${warning}`),
    ...openUnknowns.map(u => `[UNKNOWN] ${u.reason}؛ اقدام: ${u.actionItem} [${u.answerId || u.id}]`),
  ];
  const formulas = METRICS[phase].map(([name, formula]) => ({ name, formula, description: 'روش محاسبه؛ مقدار واقعی محاسبه نشده است. دوره‌ها و واحدها باید یکسان و مخرج غیرصفر باشد. حاشیه مشارکت غیرمثبت، نقطه سربه‌سر قابل دستیابی نمی‌دهد.' }));
  return {
    title: PHASES_DATA[phase - 1].deliverableName, phase: `فاز ${phase}`, phaseNumber: phase,
    version: '4.0.0', date: new Date().toLocaleDateString('fa-IR'), status,
    evidence: claims, actions, sourceRevision: state.revision || 0,
    sections: [
      { id: `P${phase}_SEC_1`, title: '۱. پاسخ‌های ثبت‌شده و منشأ آن‌ها', type: 'snapshot',
        content: Object.fromEntries(own.map(row => [row.label, sourceNote(row)])),
        items: [`[CLASSIFICATION] صنف: ${state.businessContext?.taxonomyTitleFa || MISSING}؛ شناسه: ${state.businessContext?.taxonomyId || MISSING}؛ کد روتینگ داخلی: ${state.businessContext?.iranianGuildCode || MISSING}`, '[METHOD] طبقه‌بندی صنف پیشنهاد اولیه است؛ جایگزین پاسخ کاربر یا استعلام رسمی نیست.'] },
      { id: `P${phase}_SEC_2`, title: '۲. منطق تصمیم و وابستگی به فازهای قبل', items: framework },
      { id: `P${phase}_SEC_3`, title: '۳. برنامه پیشنهادی ۳۰، ۶۰ و ۹۰ روزه', checklist: actions.map(a => `[PROPOSAL] ${a.statement} ${a.evidenceIds.length ? `[${a.evidenceIds.join(', ')}]` : '[داده لازم هنوز ثبت نشده]'}`) },
      { id: `P${phase}_SEC_4`, title: '۴. روش سنجش و اطلاعات لازم', formulas,
        kpis: METRICS[phase].map(([metric, formula]) => ({ metric, formula, green: 'پس از ثبت مبنا و تأیید کاربر تعیین شود', yellow: 'هنوز تعیین نشده', red: 'هنوز تعیین نشده' })),
        items: ['[UNKNOWN] داده عددی ساختاریافته و هم‌دوره برای محاسبه خودکار ثبت نشده؛ فرمول‌ها صرفاً روش محاسبه‌اند.'] },
      { id: `P${phase}_SEC_5`, title: '۵. گیت، مجهولات و محدودیت‌های اجرا', items: constraints },
    ],
  };
}

export function generateDeliverable(phaseNum, phaseData = {}, businessContext = null, decisions = [], facts = [], unknowns = [], metadata = {}) {
  const phase = ['master', 'all'].includes(phaseNum) ? 'master' : Number(phaseNum);
  if (phase !== 'master' && (!Number.isInteger(phase) || phase < 1 || phase > 8)) throw new Error('شماره فاز نامعتبر است.');
  const state = { ...metadata, phaseData, businessContext, decisions, facts, unknowns };
  const rows = evidenceRows(phaseData, metadata.answerRecords || []);
  if (phase !== 'master') return buildPhase(phase, state, rows);
  const phases = Array.from({ length: 8 }, (_, i) => buildPhase(i + 1, state, rows));
  return {
    title: 'کتابچه جامع استراتژی برند', phase: 'مجموع ۸ فاز', phaseNumber: 'master',
    version: '4.0.0', date: new Date().toLocaleDateString('fa-IR'),
    status: phases.every(doc => doc.status === 'CONFIRMED') ? 'CONFIRMED' : 'DRAFT',
    sourceRevision: state.revision || 0,
    evidence: phases.flatMap(doc => doc.evidence), actions: phases.flatMap(doc => doc.actions),
    sections: [
      { id: 'M0', title: 'خلاصه و وضعیت اعتبار کتابچه', content: {
        'صنف': businessContext?.taxonomyTitleFa || MISSING,
        'شناسه طبقه‌بندی': businessContext?.taxonomyId || MISSING,
        'وضعیت': phases.every(doc => doc.status === 'CONFIRMED') ? 'پاسخ‌های همه فازها تکمیل شده است' : 'کتابچه شامل فازهای ناتمام یا نیازمند بازبینی است',
      }, items: Object.entries(STATUS_LABELS).map(([kind, label]) => `[${kind}] ${label}`) },
      ...phases.map(doc => ({
        id: `M${doc.phaseNumber}`, title: `فاز ${doc.phaseNumber}: ${doc.title}`,
        content: Object.fromEntries(rows.filter(row => row.phase === doc.phaseNumber).map(row => [row.field, row.text])),
        items: doc.sections.flatMap(section => [
          ...(section.content ? Object.entries(section.content).map(([label, value]) => `${label}: ${value}`) : []),
          ...(section.items || []),
        ]),
        checklist: doc.sections.flatMap(section => section.checklist || []),
        formulas: doc.sections.flatMap(section => section.formulas || []),
        kpis: doc.sections.flatMap(section => section.kpis || []),
      })),
    ],
  };
}

export function deliverableToMarkdown(data) {
  const escape = value => String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
  let text = `# ${data.title}\n\nنسخه ${data.version} | ${data.date} | وضعیت: ${data.status}\n\n`;
  for (const section of data.sections) {
    text += `## ${section.title}\n\n`;
    for (const [key, value] of Object.entries(section.content || {})) text += `- ${key}: ${value}\n`;
    for (const item of section.items || []) text += `- ${item}\n`;
    for (const item of section.checklist || []) text += `- [ ] ${item}\n`;
    if (section.formulas?.length) text += '\n### فرمول‌های محاسباتی\n\n';
    for (const formula of section.formulas || []) text += `- [FORMULA] ${formula.name}: ${formula.formula}. ${formula.description}\n`;
    if (section.kpis?.length) {
      text += '\n| شاخص | روش محاسبه | هدف |\n|---|---|---|\n';
      for (const kpi of section.kpis) text += `| ${escape(kpi.metric)} | ${escape(kpi.formula)} | ${escape(kpi.green)} |\n`;
    }
    text += '\n';
  }
  text += 'شناسه ANS به پاسخ ثبت‌شده در فایل پروژه اشاره دارد. پیشنهادهای اجرایی و چارچوب‌های روش، واقعیت اندازه‌گیری‌شده نیستند.\n';
  return text;
}
