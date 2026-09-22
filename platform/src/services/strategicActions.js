// Recommendations are proposals with cited inputs, not assertions about a market.
const short = text => String(text).replace(/\s+/g, ' ').slice(0, 180);
export function buildStrategicActions(phase, rows, economics, businessContext = null) {
  const get = (p, field) => rows.find(r => p <= phase && r.phase === p && r.field === field && r.answer && r.answer.kind !== 'UNKNOWN');
  const text = row => `«${short(row.text)}»`;
  const offer = get(1, 'coreOffer'), goal = get(1, 'primaryGoal'), budget = get(1, 'budgetConstraint');
  const costs = get(1, 'unitEconomics'), pain = get(2, 'customerPain'), channel = get(2, 'primaryChannel');
  const audience = get(3, 'targetSegment'), promise = get(3, 'promise');
  const actions = [];
  const add = (ruleId, days, statement, refs, successMeasure) => {
    const evidenceIds = [...new Set(refs.filter(Boolean).flatMap(row => row.evidenceIds))];
    if (!evidenceIds.length) return;
    actions.push({
      ruleId,
      kind: 'PROPOSAL',
      proposalStatus: 'RECOMMENDED',
      horizonDays: days,
      evidenceIds,
      successMeasure,
      owner: null,
      businessContextKey: businessContext?.taxonomyId || businessContext?.businessTypeId || businessContext?.primaryArchetype || null,
      objective: successMeasure,
      invalidationCondition: 'هر تغییر در شواهد پشتیبان یا بافتار فعال باید این پیشنهاد را دوباره ارزیابی کند.',
      statement: `${days.toLocaleString('fa-IR')} روز: ${statement} معیار بررسی: ${successMeasure}. مسئول اجرا هنوز باید تعیین شود.`
    });
  };

  if (phase === 1) {
    if (offer) add('offer_cost_sheet', 30, `برای ${text(offer)} فهرست مواد، زمان کار، تحویل و هزینه هر فروش را کنار فاکتور واقعی ثبت کنید.`, [offer, costs], 'کامل بودن هزینه متغیر هر واحد، با همان واحد قیمت فروش');
    if (goal) add('goal_baseline', 30, `برای هدف ${text(goal)} مقدار فعلی، تاریخ مبنا و منبع اندازه‌گیری را ثبت کنید.`, [goal], 'وجود مبنای ثبت‌شده و امکان مقایسه در پایان دوره');
    const value = get(1, 'valueHypothesis');
    if (value && offer) add('value_pilot', 30, `فرضیه ${text(value)} را در معرفی ${text(offer)} با مشتری امتحان کنید؛ دلیل خرید یا نخریدن را با عبارت خود مشتری ثبت کنید.`, [value, offer], 'تفاوت ادعای تمایز با دلایل خرید واقعی');
  }

  if ([1, 2, 3, 8].includes(phase) && economics && costs) {
    if (economics.contributionPerUnit <= 0) {
      add('repair_unit_margin', 30, `پیش از افزایش فروش ${offer ? text(offer) : 'پیشنهاد اصلی'}، قیمت و اجزای هزینه متغیر را بازبینی کنید؛ حاشیه مشارکت محاسبه‌شده مثبت نیست. کاهش دامنه خدمت یا اصلاح قیمت را فقط بعد از آزمون پذیرش مشتری بررسی کنید.`, [costs, offer], 'حاشیه مشارکت مثبت پس از ثبت مجدد هزینه‌ها؛ افزایش فروش به‌تنهایی این مسئله را حل نمی‌کند');
    } else if (economics.breakEvenUnits !== null && economics.inputs.monthlyCapacity !== null && economics.breakEvenUnits > economics.inputs.monthlyCapacity) {
      add('capacity_before_acquisition', 30, `برای رسیدن به سربه‌سر، ظرفیت ثبت‌شده کافی نیست. کاهش هزینه ثابت، اصلاح قیمت یا افزایش ظرفیت عملی را با هزینه هر گزینه مقایسه کنید؛ برنامه جذب بیشتر باید با ظرفیت قابل تحویل سازگار باشد.`, [costs, budget], 'رسیدن فروش سربه‌سر به محدوده ظرفیت قابل اجرا');
    } else {
      add('validate_unit_margin', 30, `قیمت و هزینه فرم مالی را با فروش و فاکتورهای ${offer ? text(offer) : 'همان واحد فروش'} تطبیق دهید؛ تخفیف یا افزایش هزینه متغیر را در محاسبه دوباره وارد کنید.`, [costs, offer], 'حفظ حاشیه مشارکت و بررسی فاصله فروش واقعی با سربه‌سر');
    }
  }

  if (phase === 2) {
    const competitors = get(2, 'competitors'), pricing = get(2, 'pricingModel');
    if (competitors && offer) add('competitor_comparison', 30, `برای رقبای معرفی‌شده ${text(competitors)}، قیمت، دامنه خدمت و زمان تحویل قابل مشاهده را کنار ${text(offer)} قرار دهید. مواردی را که ندیده‌اید با برچسب نامشخص نگه دارید.`, [competitors, offer], 'مقایسه پیشنهادهای هم‌دامنه با منبع و تاریخ مشاهده');
    if (pain && /معطلی|صف|زمان انتظار|بدقول|تاخیر|تأخیر/.test(pain.text)) {
      add('measure_waiting', 30, `برای مسئله ${text(pain)}، زمان درخواست، شروع خدمت و تحویل را ثبت کنید. گلوگاه صف را پیش از دادن وعده سرعت پیدا کنید.`, [pain, offer], 'زمان انتظار و سهم تحویل‌های مطابق وعده در همان دوره');
    } else if (pain && /کم.درآمد|گران|قیمت|توان خرید/.test(pain.text)) {
      add('test_affordability', 30, `برای مسئله ${text(pain)}، نسخه پایه ${offer ? text(offer) : 'پیشنهاد'} و دامنه کامل آن را با هزینه جداگانه آزمایش کنید. ${pricing ? `انتخاب ثبت‌شده ${text(pricing)} مبنای آزمون باشد.` : ''}`, [pain, pricing, offer, costs], 'خرید واقعی و حاشیه مشارکت هر نسخه، بدون فرض گرفتن سودآوری گزینه ارزان');
    } else if (pain) {
      add('verify_customer_problem', 30, `برای ${text(pain)}، نمونه آخرین خرید موفق و ناموفق مشتری را ثبت کنید و عامل انتخاب یا انصراف را مشخص کنید.`, [pain, offer], 'شواهد رفتاری خرید در کنار گفته مشتری');
    }
    if (channel) add('single_channel_pilot', 30, `در ${text(channel)} یک پیشنهاد مشخص ${offer ? `برای ${text(offer)}` : ''} منتشر کنید. مسیر تماس تا خرید را برای همین آزمون جدا ثبت کنید.`, [channel, offer, budget], 'تعداد مخاطب، تماس، خرید و هزینه قابل انتساب به همان آزمون');
  }

  if (phase === 3) {
    if (audience && offer) add('segment_offer_fit', 30, `برای ${text(audience)}، ${text(offer)} را با همان قیمت و دامنه قابل تحویل آزمایش کنید. علت رد پیشنهاد را جدا از نداشتن دسترسی به مشتری ثبت کنید.`, [audience, offer, get(2, 'pricingModel')], 'پذیرش پیشنهاد و علت‌های مستند رد آن در گروه هدف');
    if (promise) add('promise_proof', 30, `وعده ${text(promise)} را به یک تعهد قابل مشاهده تبدیل کنید؛ روش اثبات، شرایط اجرا و مسئول پاسخگویی را مشخص کنید.`, [promise, budget], 'امکان اثبات تعهد در تحویل واقعی');
    const boundary = get(3, 'boundary');
    if (boundary) add('enforce_boundary', 30, `در پیشنهاد فروش و درخواست‌های سفارشی، موارد مغایر با ${text(boundary)} را ثبت کنید و برای رد یا اصلاح درخواست پاسخ مشخص بنویسید.`, [boundary, offer], 'تعداد درخواست‌های خارج از دامنه و تصمیم ثبت‌شده برای آن‌ها');
  }
  if (phase === 4) {
    const character = get(4, 'archetype'), traits = get(4, 'traits'), guardrail = get(4, 'toneGuardrail');
    if (character && traits) add('behaviour_examples', 30, `شخصیت ${text(character)} و رفتار ${text(traits)} را در نمونه پاسخ به سؤال، اعتراض و درخواست تخفیف بنویسید.`, [character, traits, audience], 'رفتار قابل مشاهده و قابل تکرار توسط تیم');
    if (guardrail) add('behaviour_review', 30, `نمونه مکالمه‌های واقعی را با مرز رفتاری ${text(guardrail)} مقایسه کنید و عبارت‌های ناسازگار را بازنویسی کنید.`, [guardrail, promise], 'ثبت مورد ناسازگار، اصلاح آن و علت اصلاح');
  }
  if (phase === 5) {
    const voice = get(5, 'voiceStyle'), message = get(5, 'elevatorHook'), forbidden = get(5, 'forbiddenWords');
    if (message && audience) add('message_comprehension', 30, `پیام ${text(message)} را به ${text(audience)} نشان دهید و بدون توضیح اضافه بپرسید چه چیزی، برای چه کسی و با چه تعهدی ارائه می‌شود.`, [message, audience, promise], 'برداشت مخاطب در مقایسه با پیشنهاد و وعده ثبت‌شده');
    if (voice && forbidden) add('copy_review', 30, `متن معرفی و پاسخ به اعتراض را با لحن ${text(voice)} بازنویسی کنید و واژگان ممنوع ${text(forbidden)} را بررسی کنید.`, [voice, forbidden], 'حفظ معنای وعده بدون استفاده از عبارت‌های ممنوع');
  }
  if (phase === 6) {
    const naming = get(6, 'naming'), tagline = get(6, 'tagline');
    if (naming) add('naming_shortlist', 30, `در قلمرو ${text(naming)} چند نام پیشنهادی بسازید. تلفظ، نوشتن پس از شنیدن و شباهت با نام رقبا را برای هر نام ثبت کنید.`, [naming, audience, get(2, 'competitors')], 'خوانایی و تمایز؛ ثبت حقوقی و دامنه نیازمند استعلام جداگانه‌اند');
    if (tagline && promise) add('tagline_proof', 30, `شعار پیشنهادی با جهت ${text(tagline)} را کنار وعده ${text(promise)} بررسی کنید؛ ادعایی که شاهد یا توان اجرای آن موجود نیست حذف شود.`, [tagline, promise], 'هم‌خوانی شعار با تعهد قابل اثبات');
  }
  if (phase === 7) {
    const palette = get(7, 'colorPalette'), typography = get(7, 'typography'), logo = get(7, 'logoConcept');
    if (palette && typography) add('visual_application', 30, `رنگ ${text(palette)} و حروف ${text(typography)} را در نمونه واقعی محل استفاده ${channel ? text(channel) : 'برند'} امتحان کنید. متن، عدد و قیمت باید در اندازه نهایی خوانا باشند.`, [palette, typography, channel], 'خوانایی متن، تمایز رنگ و استفاده در نمایشگر کوچک و چاپ مورد نیاز');
    if (logo) add('logo_variants', 30, `جهت نشان ${text(logo)} را در اندازه کوچک و نسخه تک‌رنگ بررسی کنید؛ جزئیاتی که در کاربرد واقعی از بین می‌روند اصلاح شوند.`, [logo, get(6, 'naming')], 'قابل تشخیص بودن نام و نشان در اندازه استفاده');
  }
  if (phase === 8) {
    const content = get(8, 'thoughtLeadership'), media = get(8, 'prChannels'), funnel = get(8, 'leadFunnel'), crisis = get(8, 'reputationCrisis');
    if (content && media) add('content_distribution', 30, `محتوای ${text(content)} را برای ${audience ? text(audience) : 'مشتری هدف ثبت‌شده'} در ${text(media)} با دعوت مشخص به قدم بعد منتشر کنید.`, [content, media, audience], 'مراجعه و تماس قابل انتساب به هر محتوای منتشرشده');
    if (funnel) add('conversion_steps', 30, `مسیر ${text(funnel)} را از اولین تماس تا خرید و تحویل بنویسید. در هر گام، تعداد ورود، خروج و دلیل توقف را ثبت کنید.`, [funnel, channel, offer], 'افت مخاطب در هر گام و خرید واقعی، با دوره اندازه‌گیری یکسان');
    if (crisis) add('complaint_rehearsal', 30, `برای شیوه رسیدگی ${text(crisis)}، یک شکایت نمونه تمرین کنید. مسئول پاسخ، شواهد لازم، راه‌حل مجاز و زمان پاسخ قابل اجرا را مشخص کنید.`, [crisis, promise, get(4, 'toneGuardrail')], 'ثبت و پیگیری شکایت تا نتیجه، بدون وعده جبران خارج از اختیار');
  }

  // Resource constraints are a foundation decision, not a generic filler action on every phase.
  if (phase === 1 && budget) {
    add('resource_ceiling', 30, `محدودیت ${text(budget)} را به سقف هزینه و زمان اقدام‌های همین دوره تبدیل کنید. تخصیص نهایی باید توسط خودتان تأیید شود.`, [budget], 'جمع هزینه و زمان برنامه در محدوده منابع تأییدشده');
  }

  // No unconditional 60/90-day filler actions. Later review/revision actions must be
  // emitted by an active Decision Module or by measured evidence in a dedicated rule.
  return actions;
}
