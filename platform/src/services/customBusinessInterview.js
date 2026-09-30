// Questions for activities entered in the user's own words. Suggested answers are
// decisions or hypotheses to test, never claims about the user's business.
const excerpt = (value, fallback, limit = 110) => String(value || fallback).replace(/\s+/g, ' ').slice(0, limit);
const choice = (text, value, detail = '') => ({ text, label: text, value, detail });

export function adaptCustomBusinessQuestion(question, context, phaseData = {}) {
  if (!context?.customBusiness) return question;
  const p1 = phaseData[1] || {}, p2 = phaseData[2] || {}, p3 = phaseData[3] || {};
  const p4 = phaseData[4] || {}, p5 = phaseData[5] || {}, p6 = phaseData[6] || {};
  const activity = excerpt(context.businessDescription || p1.description, 'فعالیت شما', 85);
  const offer = excerpt(p1.coreOffer, activity);
  const buyer = excerpt(p3.targetSegment || p1.diagnosticVision, 'خریدار یا کاربر که باید دقیق‌تر شناسایی شود');
  const pain = excerpt(p2.customerPain, 'مسئله‌ای که هنوز باید از مشتری بررسی شود');
  const promise = excerpt(p3.promise || p1.valueHypothesis, 'نتیجه‌ای که شواهد آن باید بررسی شود');
  const position = excerpt(p3.positioning, 'جایگاهی که هنوز انتخاب نشده');
  const voice = excerpt(p5.voiceStyle || p4.traits, 'لحن انتخاب‌شده در مراحل قبل');
  const name = excerpt(p6.naming, 'جهت نام‌گذاری انتخاب‌شده');
  const channel = excerpt(p2.primaryChannel, 'کانالی که باید آزموده شود');
  const webDesign = /طراحی\s*(?:وب\s*سایت|وبسایت|سایت)|ساخت\s*(?:وب\s*سایت|سایت)|توسعه\s*وب|web\s*design/i.test(`${p1.description || ''} ${p1.coreOffer || ''}`);
  const companyWebsite = webDesign && /شرکت|سایت معرفی|سایت شرکتی|فرم ثبت درخواست/.test(`${p1.diagnosticVision || ''} ${p1.coreOffer || ''}`);
  const storeWebsite = webDesign && /فروشگاه اینترنتی|سایت فروشگاهی|سبد خرید/.test(p1.coreOffer || '');

  const prompts = {
    step0_diagnostic_probing: [`در «${activity}» چه کسی سفارش می‌دهد و هزینه را می‌پردازد؟ مسئله او چیست و دقیقاً چه چیزی از شما تحویل می‌گیرد؟`, []],
    step0_geography: [`خریدار «${activity}» کجاست و کار را حضوری، از راه دور یا به هر دو روش تحویل می‌دهید؟`, [
      choice('یک شهر یا محله', 'local_city'), choice('چند شهر در ایران', 'nationwide_iran'), choice('مشتری خارج از ایران', 'international')
    ]],
    step1_primary_goal: [`در مرحله فعلی «${activity}»، طی سه تا شش ماه چه نتیجه‌ای را با چه عدد یا شاهدی می‌خواهید بسنجید؟`, [
      choice('گرفتن نخستین سفارش‌های واقعی', 'validate_first_orders', `تعداد سفارش و مسئله خریدار «${activity}» را ثبت کنید.`),
      choice('بهبود سود هر سفارش', 'improve_order_margin', 'قیمت، هزینه تحویل و زمان کار را با اعداد خودتان بسنجید.'),
      choice('افزایش سفارش تکراری یا معرفی مشتری', 'improve_repeat_referral', 'فقط اگر مشتری فعلی دارید، مبنا و هدف قابل اندازه‌گیری تعیین کنید.')
    ]],
    step2_core_offer: [`با توجه به توضیح شما «${buyer}»، در «${activity}» دقیقاً چه نوع کاری تحویل می‌دهید؟ محدوده پروژه، پشتیبانی و روش پرداخت را جدا شرح دهید.`, webDesign ? [
      choice('طراحی سایت معرفی کسب‌وکار', 'website_company', 'صفحات، تحویل و مالکیت سایت را دقیق مشخص کنید.'),
      choice('طراحی فروشگاه اینترنتی', 'website_store', 'فرآیند سفارش، پرداخت و مسئولیت نگهداری را روشن کنید.'),
      choice('طراحی سایت با قابلیت‌های سفارشی', 'website_custom', 'قابلیت‌ها، مرز کار و معیار پذیرش را نام ببرید.'),
      choice('نگهداری و توسعه سایت موجود', 'website_maintenance', 'تعهدهای پشتیبانی و دوره پرداخت را جدا ثبت کنید.')
    ] : []],
    step2_value_hypothesis: [`خریدار «${offer}» چه نتیجه‌ای می‌خواهد و چه شاهد واقعی از تحقق آن دارید؟ اگر هنوز شاهد ندارید، چه آزمونی انجام می‌دهید؟`, []],
    p2_step0_competitors: [`خریدار «${offer}» اکنون این کار را با چه جایگزینی انجام می‌دهد؟ گزینه‌های مشاهده‌شده را از حدس جدا کنید.`, webDesign ? [
      choice('آژانس یا تیم طراحی سایت', 'website_agency', 'نمونه و قیمت واقعی را فقط پس از مشاهده ثبت کنید.'),
      choice('طراح مستقل', 'website_freelancer', 'دامنه تحویل و مسئولیت پشتیبانی را مقایسه کنید.'),
      choice('سایت‌ساز یا قالب آماده', 'website_builder', 'هزینه و محدودیت این راه را برای همان خریدار بررسی کنید.'),
      choice('راهکار داخلی یا عقب انداختن کار', 'website_inhouse_delay', 'ببینید خریدار اکنون چه می‌کند.')
    ] : [
      choice('ارائه‌دهنده مستقیم دیگر', 'other_provider', 'نام و شواهد واقعی رقبا را ثبت کنید.'),
      choice('انجام کار توسط خود مشتری', 'customer_diy', 'زمان و هزینه واقعی را بررسی کنید.'),
      choice('راهکار جایگزین یا تعویق کار', 'alternative_or_delay', 'از مشتری بپرسید اکنون چه می‌کند.')
    ]],
    p2_step1_customer_pain: [`برای خریدار «${offer}»، کدام مشکل در مسیر انتخاب، تحویل یا استفاده رخ می‌دهد؟ شاهد مشاهده‌شده چیست؟`, webDesign ? [
      choice('ابهام در محدوده پروژه و هزینه', 'scope_price_uncertainty', 'فرضیه؛ با نمونه قرارداد یا گفت‌وگوی مشتری بررسی کنید.'),
      choice('تأخیر در تحویل یا بازبینی', 'delivery_delay', 'فرضیه؛ زمان واقعی پروژه را ثبت کنید.'),
      choice('مشکل استفاده یا مدیریت سایت پس از تحویل', 'after_delivery_friction', 'فرضیه؛ رفتار مشتری بعد از تحویل را بررسی کنید.')
    ] : [
      choice('ابهام در هزینه یا تعهد', 'scope_uncertainty', 'فرضیه؛ با مصاحبه یا تجربه واقعی بررسی کنید.'),
      choice('دیر رسیدن نتیجه یا تحویل', 'delivery_friction', 'فرضیه؛ شواهد زمانی جمع کنید.'),
      choice('مشکل استفاده پس از تحویل', 'usage_friction', 'فرضیه؛ از کاربر نهایی بپرسید.')
    ]],
    p2_step2_pricing_models: [`برای «${offer}» چه کسی بابت کدام بخش پول می‌دهد؟ قیمت پیشنهادی را با هزینه و توان پرداخت خریدار بسنجید. مسئله ثبت‌شده: «${pain}».`, [
      choice('قیمت پروژه با محدوده و مراحل مشخص', 'project_scope', 'تحویل‌ها، اصلاحات و هزینه هر مرحله را بنویسید.'),
      choice('چند بسته با دامنه و قیمت جدا', 'tiered_scope', 'هر بسته را با هزینه واقعی و نیاز مشتری آزمایش کنید.'),
      choice('پرداخت دوره‌ای برای خدمت مستمر', 'recurring_service', 'فقط برای کار تکرارشونده و با تعهد مشخص بررسی شود.')
    ]],
    p2_step3_primary_channel: [`خریدار «${buyer}» برای پیدا کردن «${offer}» کجا جست‌وجو یا از چه کسی پرس‌وجو می‌کند؟ با بودجه اعلام‌شده کدام کانال را اول آزمایش می‌کنید؟`, [
      choice('معرفی از مشتری یا همکار', 'referral_test', 'تعداد معرفی و تبدیل به گفت‌وگو را ثبت کنید.'),
      choice('نمونه‌کار یا محتوای مسئله مشتری', 'portfolio_content_test', `نمونه مرتبط با «${pain}» را نشان دهید و واکنش را بسنجید.`),
      choice('ارتباط مستقیم با خریدار مشخص', 'direct_outreach_test', 'یک گروه محدود و معیار پاسخ را از قبل تعیین کنید.')
    ]],
    p2_step4_golden_opportunity: [`با توجه به جایگزین‌ها و مسئله «${pain}»، چه تفاوتی را می‌توانید با شاهد واقعی برای «${offer}» آزمایش کنید؟`, [
      choice('تحویل و مراحل روشن', 'transparent_delivery_test', 'پیش از ادعا، نتیجه را در یک پروژه واقعی بسنجید.'),
      choice('تمرکز بر یک مسئله مشخص مشتری', 'focused_problem_test', `مسئله «${pain}» را با خریدار اعتبارسنجی کنید.`),
      choice('پشتیبانی یا آموزش پس از تحویل', 'after_delivery_test', 'دامنه و هزینه آن را پیش از تعهد مشخص کنید.')
    ]],
    p3_target_segment: [`کدام گروه برای «${offer}» مسئله «${pain}» را دارد و اختیار تصمیم و پرداخت هم با چه کسی است؟`, storeWebsite ? [
      choice('فروشگاه بدون مسیر سفارش آنلاین', 'store_without_online_order'),
      choice('فروشگاه دارای سایت با ریزش سفارش', 'store_cart_friction'),
      choice('فروشگاه نیازمند اتصال سفارش به عملیات', 'store_order_operations')
    ] : companyWebsite ? [
      choice('شرکت خدماتی بدون سایت معرفی', 'company_without_site', 'این گروه را با گفت‌وگو و مشاهده واقعی تأیید کنید.'),
      choice('شرکت دارای سایت قدیمی و درخواست‌های کم', 'company_rebuild_site', 'کیفیت درخواست‌ها و علت مشکل را پیش از ادعا بسنجید.'),
      choice('شرکت نیازمند ثبت و پیگیری درخواست در سایت', 'company_request_flow', 'کاربر، تصمیم‌گیرنده و روش پیگیری را جدا بررسی کنید.')
    ] : [
      choice('گروه دارای مسئله فوری و بودجه مشخص', 'urgent_funded_segment', 'نام و نشانه‌های این گروه را با مشتری واقعی ثبت کنید.'),
      choice('گروه دارای نیاز تکرارشونده', 'repeat_need_segment', 'فراوانی نیاز و روش پرداخت را بررسی کنید.'),
      choice('گروه قابل دسترسی از کانال آزموده‌شده', 'reachable_segment', `کانال «${channel}» را با نرخ پاسخ واقعی بسنجید.`)
    ]],
    p3_positioning_frame: [`برای «${buyer}»، «${offer}» باید با کدام تفاوت قابل اثبات شناخته شود؟ شواهد آن نسبت به جایگزین‌ها چیست؟`, [
      choice('شفافیت محدوده و تحویل', 'scope_position', 'فقط تعهد قابل اجرا و مستند را بیان کنید.'),
      choice('تخصص در مسئله ثبت‌شده', 'problem_position', `درباره «${pain}» نمونه واقعی نشان دهید.`),
      choice('پشتیبانی قابل تعریف پس از تحویل', 'support_position', 'زمان، دامنه و هزینه را روشن کنید.')
    ]],
    p3_strategic_boundary: [`برای حفظ جایگاه «${position}» کدام نوع پروژه یا وعده را نمی‌پذیرید؟`, [
      choice('پروژه بیرون از توان یا تخصص', 'outside_capability', 'محدوده خدمت و معیار رد سفارش را ثبت کنید.'),
      choice('مهلت یا نتیجه بدون شاهد', 'unverified_promise', 'به جای تضمین بی‌پشتوانه، شرط سنجش تعیین کنید.'),
      choice('تغییر دامنه بدون توافق جدید', 'scope_change', 'کار افزوده را جدا قیمت‌گذاری و تأیید کنید.')
    ]],
    p3_brand_promise: [`برای «${buyer}» چه تعهد قابل سنجش درباره «${offer}» می‌دهید که با مرزهای انتخاب‌شده سازگار باشد؟`, [
      choice('شفافیت در برنامه و محدوده تحویل', 'delivery_clarity', 'روش اطلاع‌رسانی و سند تحویل را تعریف کنید.'),
      choice('پاسخگویی به مسئله ثبت‌شده', 'problem_response', `راه بررسی «${pain}» را همراه تعهد بیان کنید.`),
      choice('آموزش و پشتیبانی مشخص', 'support_scope', 'تعداد، زمان و هزینه را بر اساس ظرفیت واقعی مشخص کنید.')
    ]],
    p4_archetype: [`برای اجرای تعهد «${promise}» در رابطه با «${buyer}» چه نقش و رفتاری از برند انتظار می‌رود؟`, [
      choice('راهنمای روشن و صبور', 'guide_character'), choice('مجری دقیق و پاسخگو', 'reliable_builder'), choice('همکار خلاق و آزمون‌گر', 'creative_partner')
    ]],
    p4_human_traits: [`از نقش انتخاب‌شده، کدام رفتارهای قابل مشاهده در مذاکره و تحویل «${offer}» باید ثابت بماند؟`, [
      choice('گزارش منظم و شفاف', 'clear_updates'), choice('پرسش دقیق پیش از اجرا', 'discovery_first'), choice('پیگیری مسئله پس از تحویل', 'follow_through')
    ]],
    p4_tone_guardrail: [`در گفت‌وگو با «${buyer}»، کدام نوع لحن با تعهد «${promise}» ناسازگار است؟`, [
      choice('وعده قطعی بدون شاهد', 'avoid_unproven_claim'), choice('اصطلاح نامفهوم برای خریدار', 'avoid_jargon'), choice('پاسخ مبهم درباره هزینه و دامنه', 'avoid_vague_scope')
    ]],
    p5_voice_style: [`برای توضیح «${offer}» به «${buyer}» چه لحنی هم قابل فهم است و هم با رفتار انتخاب‌شده هماهنگ می‌ماند؟`, [
      choice('روشن و مرحله‌به‌مرحله', 'clear_stepwise'), choice('رسمی و مستند', 'formal_evidenced'), choice('صمیمی و دقیق', 'warm_precise')
    ]],
    p5_elevator_hook: [`با لحن «${voice}»، «${offer}» را برای «${buyer}» چگونه در یک جمله و بدون ادعای اثبات‌نشده معرفی می‌کنید؟`, [
      choice('شروع از مسئله مشتری', 'problem_first', `ابتدا «${pain}» را مطرح و سپس دامنه «${offer}» را توضیح دهید.`),
      choice('شروع از شیوه انجام کار', 'process_first', 'مراحل و شاهد تحویل را به زبان خریدار بگویید.'),
      choice('شروع از نتیجه قابل بررسی', 'evidence_first', `فقط بخش قابل اثبات تعهد «${promise}» را بیان کنید.`)
    ]],
    p5_forbidden_words: [`در پیام معرفی «${offer}»، چه واژه یا وعده‌ای فهم خریدار را دشوار یا انتظار نادرست ایجاد می‌کند؟`, [
      choice('بهترین و بی‌رقیب بدون شاهد', 'avoid_superlatives'), choice('تضمین نتیجه بیرون از کنترل ما', 'avoid_unbounded_guarantee'), choice('اصطلاح فنی بدون توضیح', 'explain_technical_terms')
    ]],
    p6_naming_territory: [`با توجه به جایگاه «${position}» و لحن «${voice}»، نام برند «${activity}» باید چه چیزی را به یاد خریدار بیاورد؟`, [
      choice('نام توصیفی از کار واقعی', 'descriptive_name'), choice('نام کوتاه و مستقل از یک خدمت', 'flexible_name'), choice('نام شخصی یا تیمی', 'founder_team_name')
    ]],
    p6_tagline_archetype: [`برای نام یا قلمرو «${name}»، شعار کدام منفعتِ تأییدشده «${offer}» را به «${buyer}» منتقل کند؟`, [
      choice('بیان مسئله و راه‌حل', 'problem_solution_tagline'), choice('بیان شیوه انجام کار', 'process_tagline'), choice('بیان نتیجه قابل اثبات', 'evidenced_result_tagline')
    ]],
    p7_color_palette: [`برای نقاط تماس واقعی «${activity}» و لحن «${voice}»، چه جهت رنگی خوانا و سازگار است؟ پیش از انتخاب با مخاطب آزمایش کنید.`, [
      choice('خنثی و پرکنتراست', 'neutral_contrast'), choice('رنگ اصلی محدود با زمینه ساده', 'focused_accent'), choice('پالت گرم و کم‌تعداد', 'warm_restrained')
    ]],
    p7_typography_mood: [`نام و پیام «${name}» در کدام رسانه دیده می‌شود؟ خوانایی تایپ فارسی را در همان اندازه و صفحه آزمایش کنید.`, [
      choice('حروف ساده و خوانا برای صفحه دیجیتال', 'screen_readability'), choice('حروف رسمی و خوانا برای سند و قرارداد', 'document_readability'), choice('حروف انعطاف‌پذیر برای هر دو', 'cross_channel_readability')
    ]],
    p7_logo_direction: [`نشان «${activity}» بیشتر در کدام نقطه تماس واقعی استفاده می‌شود و در اندازه کوچک چقدر خواناست؟`, [
      choice('نوشتار نام برند', 'wordmark'), choice('نشان ساده همراه نام', 'symbol_with_name'), choice('حروف اختصاری با نام کامل', 'initials_with_name')
    ]],
    p8_thought_leadership: [`برای «${buyer}» کدام محتوای واقعی درباره «${pain}» می‌تواند توان «${offer}» را نشان دهد؟`, [
      choice('نمونه‌کار با مسئله و نتیجه مستند', 'case_evidence'), choice('شرح روش کار و معیار تحویل', 'process_explainer'), choice('پاسخ به پرسش‌های متداول مشتری', 'buyer_questions')
    ]],
    p8_pr_podcast_channels: [`خریدار «${buyer}» را از چه کانالی برای «${offer}» پیدا می‌کنید؟ ابتدا با بودجه ثبت‌شده یک آزمون محدود اجرا کنید.`, [
      choice('معرفی مشتری و همکار', 'referral_pilot'), choice('نمونه‌کار در محل جست‌وجوی خریدار', 'search_portfolio_pilot'), choice('ارتباط مستقیم محدود با خریدار', 'direct_pilot')
    ]],
    p8_lead_funnel: [`از کانال «${channel}» تا قرارداد «${offer}»، چه گام‌هایی لازم است و کجا خریدار منصرف می‌شود؟`, [
      choice('درخواست، ارزیابی نیاز و پیشنهاد محدوده', 'discovery_proposal'), choice('نمونه مرتبط و گفت‌وگوی تصمیم‌گیرنده', 'proof_conversation'), choice('پیشنهاد مرحله‌ای با معیار تحویل', 'milestone_contract')
    ]],
    p8_crisis_reputation: [`اگر خریدار «${offer}» از نتیجه یا زمان تحویل ناراضی شد، چگونه واقعیت را بررسی و پاسخ را ثبت می‌کنید؟`, [
      choice('ثبت مسئله و بررسی با شواهد', 'record_and_verify'), choice('توافق بر اصلاح در دامنه قرارداد', 'scoped_rework'), choice('گزارش شفاف علت و برنامه بعدی', 'transparent_followup')
    ]],
  };

  const definition = prompts[question.id];
  if (!definition) return question;
  const [text, baseOptions] = definition;
  const evidenceBasedPricing = question.id === 'p2_step2_pricing_models' &&
    (question.options || []).some(option => ['tiered_offer', 'review_costs'].includes(option.value));
  const options = evidenceBasedPricing ? question.options : baseOptions;
  // Preserve a calculation warning created from the user's own numbers.
  const warning = question.text?.match(/\nطبق اعداد ثبت‌شده[^\n]*/)?.[0] || '';
  return { ...question, text: text + warning, options, allowCustomAnswer: true,
    isDynamic: true, contextAnchor: [offer, buyer, pain].filter(Boolean).join('؛ ') };
}
