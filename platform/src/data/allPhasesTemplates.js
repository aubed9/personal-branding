import { isAutomotiveService } from './businessDomain.js';
import { INITIAL_QUESTIONS as P1_QUESTIONS } from './phase1Templates.js';
import { getAdaptivePhase2Questions, PHASE2_QUESTIONS } from './phase2Templates.js';

// ============================================================================
// DYNAMIC ADAPTIVE QUESTION ENGINE (PHASES 2 TO 8)
// Adapts terminology, pain points, options, and metrics based on Business Archetype
// ============================================================================

export function getAdaptedPhaseQuestions(phaseNum, context = null) {
  const p = parseInt(phaseNum, 10);
  if (p === 1) return P1_QUESTIONS;

  const arch = context ? (context.archetype || context.primaryArchetype || 'PROFESSIONAL_SERVICE') : 'PROFESSIONAL_SERVICE';

  switch (p) {
    case 2:
      return getPhase2Questions(arch, context);
    case 3:
      return getPhase3Questions(arch, context);
    case 4:
      return getPhase4Questions(arch, context);
    case 5:
      return getPhase5Questions(arch, context);
    case 6:
      return getPhase6Questions(arch, context);
    case 7:
      return getPhase7Questions(arch, context);
    case 8:
      return getPhase8Questions(arch, context);
    default:
      return P3_QUESTIONS;
  }
}

// ----------------------------------------------------------------------------
// PHASE 2: RESEARCH & MARKET INTELLIGENCE
// ----------------------------------------------------------------------------
function getPhase2Questions(arch, context = null) {
  if (arch === 'LOCAL_SERVICE') {
    return [
      {
        id: 'p2_step0_competitors',
        step: 0,
        title: 'شناسایی رقبای محلی در منطقه',
        text: 'در شعاع دسترسی و محله فعالیت شما، مراجعان در حال حاضر نیاز خود به این خدمات را به چه مراکزی می‌سپارند؟',
        options: [
          { text: 'ارائه‌دهندگان سنتی و قدیمی محله با قیمت ارزان اما کیفیت نوسانی و عدم پاسخگویی', value: 'traditional_local', icon: 'Wrench', badge: 'سنتی ارزان' },
          { text: 'مراکز لوکس و پرادعا در مناطق دیگر با هزینه‌های بسیار بالا و مسافت دور', value: 'modern_expensive', icon: 'Clock', badge: 'مراکز دوردست گران' },
          { text: 'انجام دستی یا غیراستاندارد توسط خود فرد یا به تعویق انداختن نیاز', value: 'diy_unstandardized', icon: 'HelpCircle', badge: 'تعویق یا روش غیرتخصصی' },
          { text: 'مرکز تخصصی، معتبر و مطمئنی در این محدوده جغرافیایی وجود ندارد (فرصت بکر)', value: 'blue_ocean_local', icon: 'Compass', badge: 'فرصت بکر محله' }
        ]
      },
      {
        id: 'p2_step1_customer_pain',
        step: 1,
        title: 'بزرگ‌ترین درد و اصطکاک مشتریان در محله',
        text: 'بیشترین شکایت و نارضایتی مراجعان از گزینه‌های موجود در این صنف چیست؟',
        options: [
          { text: 'معطلی زیاد، بدقولی در زمان تحویل و تلف شدن وقت باارزش مشتری', value: 'wasted_time_delay', icon: 'Clock', badge: 'معطلی و اتلاف وقت' },
          { text: 'استفاده از متریال یا مواد بی‌کیفیت و ترس از خسارت یا افت نتیجه مطلوب', value: 'poor_materials_damage', icon: 'AlertTriangle', badge: 'کیفیت نوسانی' },
          { text: 'بی‌نظمی در فضا، برخورد غیرحرفه‌ای پرسنل و محیط غیربهداشتی یا نامناسب', value: 'dirty_details_unclean', icon: 'XCircle', badge: 'محیط نامناسب' },
          { text: 'عدم شفافیت در قیمت‌ها و دریافت مبالغ دلخواه و فاکتورهای غافلگیرکننده', value: 'hidden_fees', icon: 'DollarSign', badge: 'قیمت‌گذاری غیرشفاف' }
        ]
      },
      {
        id: 'p2_step2_pricing_models',
        step: 2,
        title: 'کشش قیمتی و شیوه پرداخت مراجعان',
        text: 'مشتریان محلی ترجیح می‌دهند چگونه و در چه بازه قیمتی هزینه پرداخت کنند؟',
        options: [
          { text: 'خدمات اقتصادی با قیمت منصفانه مصوب و سرعت عمل بالا', value: 'economy_fast', icon: 'TrendingDown', badge: 'اقتصادی سریع' },
          { text: 'پکیج‌های جامع خدمات تکمیلی با ارزش افزوده بالا و تضمین رضایت', value: 'premium_vip_package', icon: 'Crown', badge: 'پرمیوم VIP' },
          { text: 'اشتراک ماهیانه یا کارت مراجعات مکرر با تخفیف وفاداری دائمی', value: 'subscription_loyalty', icon: 'Repeat', badge: 'اشتراک و وفاداری' }
        ]
      },
      {
        id: 'p2_step4_golden_opportunity',
        step: 3,
        title: 'فرصت طلایی تمایز در منطقه',
        text: 'کدام مزیت رقابتی، کسب‌وکار شما را به انتخاب اول مشتریان منطقه تبدیل می‌کند؟',
        options: [
          { text: 'نوبت‌دهی دقیق و منظم بدون حتی یک دقیقه معطلی + محیط استراحت آراسته و محترمانه', value: 'zero_wait_lounge', icon: 'HeartHandshake', badge: 'نظم و بدون معطلی' },
          { text: 'ضمانت ۱۰۰٪ کیفیت کار و عدم دریافت وجه یا جبران کامل در صورت کوچک‌ترین نارضایتی', value: 'satisfaction_guarantee', icon: 'ShieldCheck', badge: 'گارانتی قطعی رضایت' },
          { text: 'تسلط بر جستجوی محلی بلد، نشان و گوگل مپ با نظرات عالی مراجعان محله', value: 'local_maps_dominance', icon: 'MapPin', badge: 'سئوی محلی مپ' },
          { text: 'باشگاه مشتریان پیامکی و پیگیری مستمر وضعیت رضایت پس از انجام کار', value: 'sms_retention', icon: 'Zap', badge: 'باشگاه مشتریان' }
        ]
      }
    ];
  }

  if (arch === 'RESTAURANT_CAFE_HOSPITALITY') {
    const isCafe = context && (
      context.taxonomyId === "BT-0066" ||
      context.taxonomyId === "BT-0067" ||
      (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("قهوه") || context.taxonomyTitleFa.includes("رستری") || context.taxonomyTitleFa.includes("کافه"))) ||
      (context.archetypeTitle && (context.archetypeTitle.includes("قهوه") || context.archetypeTitle.includes("رستری"))) ||
      (context.keywords && (context.keywords.includes("قهوه") || context.keywords.includes("رستری")))
    );
    const isDining = !isCafe && context && (
      context.industryId === "IND-03" ||
      context.industryCode === "IND-03" ||
      (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("رستوران") || context.taxonomyTitleFa.includes("کباب") || context.taxonomyTitleFa.includes("دیزی") || context.taxonomyTitleFa.includes("فست‌فود") || context.taxonomyTitleFa.includes("کترینگ") || context.taxonomyTitleFa.includes("تهیه غذا") || context.taxonomyTitleFa.includes("پیتزا") || context.taxonomyTitleFa.includes("قنادی") || context.taxonomyTitleFa.includes("شیرینی")))
    );

    if (isDining) {
      return [
        {
          id: 'p2_step0_competitors',
          step: 0,
          title: 'شناسایی رستوران‌ها و غذاخوری‌های رقیب',
          text: 'مشتریان هدف در حال حاضر برای صرف وعده‌های غذایی بیشتر به کدام رستوران‌ها مراجعه می‌کنند؟',
          options: [
            { text: 'رستوران‌های زنجیره‌ای یا سنتی قدیمی با برند جاافتاده و شلوغ', value: 'chain_cafes', icon: 'Building', badge: 'سنتی و زنجیره‌ای' },
            { text: 'رستوران‌های لوکس با قیمت‌های بسیار بالا و تشریفات مجلل', value: 'luxury_spots', icon: 'Crown', badge: 'لوکس' },
            { text: 'غذاخوری‌های محلی با کیفیت طعم متوسط و بهداشت نامطمئن', value: 'local_average', icon: 'Coffee', badge: 'محلی معمولی' },
            { text: 'رستوران تخصصی با مواد اولیه تازه، طعم اصیل و قیمت منصفانه در منطقه کم است', value: 'blue_ocean_cafe', icon: 'Compass', badge: 'فرصت بکر' }
          ]
        },
        {
          id: 'p2_step1_customer_pain',
          step: 1,
          title: 'اصلی‌ترین اصطکاک مشتری رستوران و غذاخوری',
          text: 'کلافه‌کننده‌ترین نارضایتی مشتریان از رستوران‌ها و اماکن پذیرایی غذا چیست؟',
          options: [
            { text: 'ثبات نداشتن طعم و افت کیفیت غذا و گوشت در دفعات بعدی', value: 'taste_inconsistency', icon: 'AlertTriangle', badge: 'طعم ناپایدار' },
            { text: 'قیمت غیرمنصفانه در برابر کیفیت و حجم غذا', value: 'overpriced_portion', icon: 'DollarSign', badge: 'گرانی بی‌دلیل' },
            { text: 'بهداشت نامطمئن ظروف و آشپزخانه و تهویه نامناسب سالن', value: 'bad_ambiance_ventilation', icon: 'XCircle', badge: 'اتمسفر نامناسب' },
            { text: 'معطلی طولانی و برخورد سرد و کم‌حوصله پرسنل', value: 'slow_unfriendly_service', icon: 'UserX', badge: 'سرویس‌دهی ضعیف' }
          ]
        },
        {
          id: 'p2_step2_pricing_models',
          step: 2,
          title: 'مدل و بازه قیمتی پذیرایی غذایی',
          text: 'ترکیب اصلی فروش غذایی شما بر چه پایه‌ای برنامه‌ریزی شده است؟',
          options: [
            { text: 'غذای بیرون‌بر (Takeaway/Delivery) با ارسال گرم، سریع و قیمت منصفانه', value: 'daily_takeaway', icon: 'Zap', badge: 'بیرون‌بر سریع' },
            { text: 'پذیرایی در سالن برای قرارهای کاری و دورهمی‌های خانوادگی و دوستانه', value: 'dine_in_experience', icon: 'Users', badge: 'تجربه سالن' },
            { text: 'منوی ویژه سرآشپز با کباب‌ها و غذاهای اصیل دست‌پخت پریمیوم', value: 'specialty_gourmet', icon: 'Sparkles', badge: 'منوی گورمت' }
          ]
        },
        {
          id: 'p2_step4_golden_opportunity',
          step: 3,
          title: 'فرصت طلایی تمایز رستوران',
          text: 'چه ویژگی منحصربه‌فردی باعث وفاداری مشتریان به رستوران شما می‌شود؟',
          options: [
            { text: 'ثبات ۱۰۰٪ کیفیت و طعم غذا با گوشت تازه روز و رسپی اصیل', value: 'flawless_taste_recipe', icon: 'Award', badge: 'طعم اصیل و باثبات' },
            { text: 'سالن آراسته و تمیز با فضای دلنشین خانوادگی و تهویه عالی', value: 'instagrammable_aesthetic', icon: 'Sparkles', badge: 'اتمسفر دیدنی' },
            { text: 'کارت وفاداری هوشمند و آفر ویژه مشتریان ثابت', value: 'loyalty_card_program', icon: 'HeartHandshake', badge: 'وفاداری هوشمند' },
            { text: 'بسته‌بندی عایق حرارتی بدون نشتی برای سفارش‌های بیرون‌بر و اسنپ‌فود', value: 'leakproof_packaging', icon: 'Box', badge: 'بسته‌بندی درجه یک' }
          ]
        }
      ];
    }

    return [
      {
        id: 'p2_step0_competitors',
        step: 0,
        title: 'شناسایی کافه‌ها و پاتوق‌های رقیب',
        text: 'مشتریان هدف منطقه در حال حاضر برای نوشیدن قهوه یا غذا بیشتر به کجا می‌روند؟',
        options: [
          { text: 'کافه‌های زنجیره‌ای معروف با برند جاافتاده و شلوغ', value: 'chain_cafes', icon: 'Building', badge: 'زنجیره‌ای' },
          { text: 'کافه‌رستوران‌های لوکس با قیمت‌های بسیار بالا', value: 'luxury_spots', icon: 'Crown', badge: 'لوکس' },
          { text: 'کافه‌های محلی دنج اما با کیفیت طعم متوسط و بی‌ثبات', value: 'local_average', icon: 'Coffee', badge: 'محلی معمولی' },
          { text: 'گزینه تخصصی با قهوه تازه و فضای کاری مناسب در این منطقه کم است', value: 'blue_ocean_cafe', icon: 'Compass', badge: 'فرصت بکر' }
        ]
      },
      {
        id: 'p2_step1_customer_pain',
        step: 1,
        title: 'اصلی‌ترین اصطکاک مشتری کافه',
        text: 'کلافه‌کننده‌ترین نارضایتی مشتریان از کافه‌ها و اماکن پذیرایی چیست؟',
        options: [
          { text: 'ثبات نداشتن طعم و افت کیفیت سفارش در دفعات بعدی', value: 'taste_inconsistency', icon: 'AlertTriangle', badge: 'طعم ناپایدار' },
          { text: 'قیمت غیرمنصفانه در برابر کیفیت و حجم سفارش', value: 'overpriced_portion', icon: 'DollarSign', badge: 'گرانی بی‌دلیل' },
          { text: 'سروصدای آزاردهنده، دود و تهویه نامناسب محیط', value: 'bad_ambiance_ventilation', icon: 'XCircle', badge: 'اتمسفر نامناسب' },
          { text: 'معطلی طولانی و برخورد سرد و کم‌حوصله پرسنل', value: 'slow_unfriendly_service', icon: 'UserX', badge: 'سرویس‌دهی ضعیف' }
        ]
      },
      {
        id: 'p2_step2_pricing_models',
        step: 2,
        title: 'مدل و بازه قیمتی پذیرایی',
        text: 'ترکیب اصلی فروش شما بر چه پایه‌ای برنامه‌ریزی شده است؟',
        options: [
          { text: 'قهوه روزمره بیرون‌بر (Takeaway) با سرعت بالا و قیمت منصفانه', value: 'daily_takeaway', icon: 'Zap', badge: 'بیرون‌بر سریع' },
          { text: 'پذیرایی در سالن برای قرارهای کاری، مطالعه و دورهمی‌های دوستانه', value: 'dine_in_experience', icon: 'Users', badge: 'تجربه سالن' },
          { text: 'منوی تخصصی باریستا، دانه‌های سینگل اوریجین و کیک‌های روز پخت دست‌ساز', value: 'specialty_gourmet', icon: 'Sparkles', badge: 'منوی گورمت' }
        ]
      },
      {
        id: 'p2_step4_golden_opportunity',
        step: 3,
        title: 'فرصت طلایی تمایز کافه',
        text: 'چه ویژگی منحصربه‌فردی باعث پاتوق شدن کسب‌وکار شما می‌شود؟',
        options: [
          { text: 'ثبات ۱۰۰٪ طعم قهوه با دانه‌های رست تازه و رسپی مهندسی‌شده', value: 'flawless_taste_recipe', icon: 'Award', badge: 'طعم اصیل و باثبات' },
          { text: 'طراحی فضایی چشم‌نواز با نور عالی و امکان عکاسی و اشتراک‌گذاری', value: 'instagrammable_aesthetic', icon: 'Sparkles', badge: 'اتمسفر دیدنی' },
          { text: 'کارت وفاداری هوشمند (مثلاً هفتمین قهوه مهمان کافه)', value: 'loyalty_card_program', icon: 'HeartHandshake', badge: 'وفاداری هوشمند' },
          { text: 'بسته‌بندی عایق حرارتی بدون نشتی برای سفارش‌های بیرون‌بر و اسنپ‌فود', value: 'leakproof_packaging', icon: 'Box', badge: 'بسته‌بندی درجه یک' }
        ]
      }
    ];
  }

  if (arch === 'SAAS_SOFTWARE') {
    return [
      {
        id: 'p2_step0_competitors',
        step: 0,
        title: 'شناسایی راهکارهای رقیب نرم‌افزاری',
        text: 'کاربران هدف شما در حال حاضر این فرآیند را چگونه مدیریت می‌کنند؟',
        options: [
          { text: 'نرم‌افزارهای دسکتاپ قدیمی یا فایل‌های شکننده اکسل با خطای انسانی بالا', value: 'legacy_software_excel', icon: 'FileText', badge: 'اکسل و سنتی' },
          { text: 'سیستم‌های گران‌قیمت خارجی که زبان فارسی و پرداخت ریالی را پشتیبانی نمی‌کنند', value: 'expensive_foreign_tools', icon: 'DollarSign', badge: 'خارجی تحریمی' },
          { text: 'فرایند دستی بدون ساختار با صرف زمان طولانی و سردرگمی', value: 'manual_paperwork', icon: 'HelpCircle', badge: 'دستی و طاقت‌فرسا' },
          { text: 'ابزار ابری بومی، تخصصی، پایدار و ارزان در این حوزه وجود ندارد (فرصت بکر)', value: 'blue_ocean_saas', icon: 'Compass', badge: 'خلاء ابری بومی' }
        ]
      },
      {
        id: 'p2_step1_customer_pain',
        step: 1,
        title: 'اصلی‌ترین اصطکاک و دغدغه کاربر نرم‌افزار',
        text: 'کاربران در استفاده از ابزارهای موجود با چه مانعی روبرو هستند؟',
        options: [
          { text: 'پیچیدگی منوها و نیاز به آموزش‌های طولانی و خسته‌کننده', value: 'steep_learning_curve', icon: 'AlertTriangle', badge: 'پیچیدگی کاربری' },
          { text: 'نگرانی از امنیت، از بین رفتن اطلاعات، قطعی مکرر سرور یا پشتیبانی ضعیف', value: 'security_downtime_fears', icon: 'ShieldAlert', badge: 'قطعی و امنیت' },
          { text: 'قیمت‌گذاری نامشخص و هزینه‌های پنهان ارتقا و راه‌اندازی', value: 'hidden_upgrade_costs', icon: 'DollarSign', badge: 'هزینه‌های پنهان' },
          { text: 'پشتیبانی کند و بی‌حوصله در لحظات حساس کاری و مالیاتی', value: 'slow_support', icon: 'UserX', badge: 'پشتیبانی ضعیف' }
        ]
      },
      {
        id: 'p2_step2_pricing_models',
        step: 2,
        title: 'مدل اشتراک و کشش قیمتی نرم‌افزار',
        text: 'مدل درآمدی شما بر چه پایه‌ای بیشترین پذیرش را در میان مخاطبان دارد؟',
        options: [
          { text: 'پلن‌های ماهانه/سالانه پلکانی بر اساس تعداد کاربر یا حجم عملیات', value: 'tiered_subscription', icon: 'Layers', badge: 'اشتراک پلکانی' },
          { text: 'تست رایگان (Freemium / Free Trial) و سپس تبدیل به اکانت پرداختی', value: 'freemium_trial', icon: 'Zap', badge: 'تست رایگان' },
          { text: 'فروش لایسنس سازمانی اختصاصی با پشتیبانی VIP برای شرکت‌های بزرگ', value: 'enterprise_license', icon: 'Crown', badge: 'سازمانی سفارشی' }
        ]
      },
      {
        id: 'p2_step4_golden_opportunity',
        step: 3,
        title: 'فرصت طلایی تمایز محصول نرم‌افزاری',
        text: 'کدام مزیت تکنولوژیک باعث حفظ مشتریان و کاهش نرخ ریزش (Churn) می‌شود؟',
        options: [
          { text: 'سادگی فوق‌العاده و راه‌اندازی زیر ۳ دقیقه بدون نیاز به حتی ۱ ساعت آموزش', value: 'plug_and_play_simplicity', icon: 'CheckCircle', badge: 'سادگی بدون آموزش' },
          { text: 'داشبورد گزارش‌گیری تحلیلی شفاف و لحظه‌ای برای مدیران', value: 'live_analytics_dashboard', icon: 'BarChart2', badge: 'گزارش تحلیلی زنده' },
          { text: 'اتصال خودکار به درگاه‌ها، سامانه مودیان و سیستم‌های بانکی ایران', value: 'iran_integrations', icon: 'Zap', badge: 'یکپارچگی بومی' },
          { text: 'تولید محتوا و آموزش‌های کاربردی در حل دغدغه‌های روزمره مدیران', value: 'content_product_led', icon: 'BookOpen', badge: 'رشد محتوا‌محور' }
        ]
      }
    ];
  }

  if (arch === 'MANUFACTURER') {
    const isMachining = context && (
      context.industryId === "IND-08" ||
      context.industryCode === "IND-08" ||
      (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("قالب") || context.taxonomyTitleFa.includes("تراش") || context.taxonomyTitleFa.includes("ماشین‌کاری") || context.taxonomyTitleFa.includes("فلز") || context.taxonomyTitleFa.includes("متالورژی")))
    );
    const certOptionText = isMachining || !context
      ? 'نبود گواهینامه‌های رسمی تست متالورژی و استانداردهای صنعتی'
      : (context.industryId === 'IND-25'
          ? 'نبود شناسنامه آنالیز الیاف، تست آبرفت و استانداردهای ثبات رنگ'
          : (context.industryId === 'IND-10'
              ? 'نبود نشان سیب سلامت و استانداردهای بهداشتی غذا و دارو'
              : 'نبود تاییدیه و شناسنامه رسمی کنترل کیفی (QC) و استانداردهای صنعتی'));

    return [
      {
        id: 'p2_step0_competitors',
        step: 0,
        title: 'شناسایی رقبا در زنجیره تامین صنعتی',
        text: 'خریداران صنعتی در حال حاضر نیاز خود به این قطعات یا محصولات را از کجا تامین می‌کنند؟',
        options: [
          { text: 'واردات از چین با خواب سرمایه و چالش ارز و ترخیص طولانی', value: 'china_imports', icon: 'Plane', badge: 'واردات خارجی' },
          { text: 'کارخانجات قدیمی بزرگ با بوروکراسی سنگین و قیمت بالا', value: 'legacy_heavy_plants', icon: 'Factory', badge: 'سازمانی گران' },
          { text: 'کارگاه‌های خرد سنتی با تیراژ محدود و تلرانس کیفی ناپایدار', value: 'small_informal_workshops', icon: 'Wrench', badge: 'کارگاهی سنتی' },
          { text: 'تولیدکننده تخصصی با استانداردهای مدرن در این بخش کم است', value: 'industrial_blue_ocean', icon: 'Compass', badge: 'خلاء صنعتی' }
        ]
      },
      {
        id: 'p2_step1_customer_pain',
        step: 1,
        title: 'اصلی‌ترین اصطکاک خریداران صنعتی',
        text: 'بزرگ‌ترین دردسر و نگرانی مدیران خرید و کارخانجات چیست؟',
        options: [
          { text: 'تاخیر در تحویل محموله و توقف خط تولید خریدار', value: 'delivery_delay_bottleneck', icon: 'Clock', badge: 'تاخیر تحویل' },
          { text: 'عدم تطابق با نقشه مهندسی، تلرانس بالا و درصد ضایعات زیاد', value: 'quality_defect_tolerance', icon: 'AlertTriangle', badge: 'کیفیت ناپایدار' },
          { text: 'نوسانات ناگهانی قیمت و خلف وعده در میانه اجرای قرارداد', value: 'price_fluctuation_default', icon: 'DollarSign', badge: 'عدم ثبات قیمت' },
          { text: certOptionText, value: 'missing_certifications', icon: 'FileX', badge: 'فقدان تاییدیه' }
        ]
      },
      {
        id: 'p2_step2_pricing_models',
        step: 2,
        title: 'مدل قرارداد و تیراژ سفارش',
        text: 'ساختار معمول سفارش‌دهی مشتریان صنعتی شما چگونه است؟',
        options: [
          { text: 'سفارش تیراژ بالا (MOQ) با حداقل قیمت تمام‌شده رقابتی', value: 'high_volume_moq', icon: 'TrendingDown', badge: 'تیراژ بالا اقتصادی' },
          { text: 'تولید دسته‌ای سفارشی بر اساس نقشه فنی مشتری', value: 'custom_batch_engineering', icon: 'Cpu', badge: 'سفارشی دسته‌ای' },
          { text: 'قراردادهای تامین سالانه با تحویل مرحله‌ای و تسویه اعتباری', value: 'annual_supply_retainer', icon: 'Briefcase', badge: 'تامین مستمر سالانه' }
        ]
      },
      {
        id: 'p2_step4_golden_opportunity',
        step: 3,
        title: 'فرصت طلایی تمایز در صنعت',
        text: 'چه تعهدی باعث ورود نام شما به لیست تامین‌کنندگان برگزیده (Vendor List) می‌شود؟',
        options: [
          { text: 'تضمین صفر درصد ضایعات با تعویض بدون قید و شرط قطعات معیوب', value: 'zero_defect_guarantee', icon: 'ShieldCheck', badge: 'ضمانت قطعی کیفیت' },
          { text: 'دقت میلی‌متری و ارائه نتایج آزمایشگاهی تست کنترل کیفی (QC) با محموله', value: 'certified_qc_reports', icon: 'CheckCircle', badge: 'گزارش آزمون فنی' },
          { text: 'تحویل سریع‌تر از تمامی رقبای داخلی به دلیل بهینه‌سازی خط تولید', value: 'superior_lead_time', icon: 'Zap', badge: 'سرعت تحویل بی‌رقیب' },
          { text: 'ارائه نمونه اولیه رایگان جهت تست در خط تولید مشتری قبل از قرارداد نهایی', value: 'free_prototype_testing', icon: 'Box', badge: 'نمونه تست اولیه' }
        ]
      }
    ];
  }

  // DEFAULT / PROFESSIONAL_SERVICE / CONSULTING
  return [
    {
      id: 'p2_step0_competitors',
      step: 0,
      title: 'شناسایی رقبای مستقیم و جایگزین‌ها',
      text: 'در حوزه فعالیت شما، مخاطبان در حال حاضر نیاز خود را چگونه برطرف می‌کنند؟',
      options: [
        { text: 'افراد پرادعا و فعال در شبکه‌های اجتماعی با محتوای سطحی و زرد', value: 'social_influencers', icon: 'Users', badge: 'رقبای فردی زرد' },
        { text: 'موسسات و شرکت‌های سنتی گران‌قیمت با بروکراسی سنگین', value: 'big_companies', icon: 'Building', badge: 'موسسات سنتی' },
        { text: 'مشتری خودآموز پیش می‌رود یا با آزمون‌وخطا متحمل خسارت شده است', value: 'alternatives_diy', icon: 'HelpCircle', badge: 'آزمون‌وخطای شخصی' },
        { text: 'رویکرد تخصصی مدرن و کارآمدی در این حوزه وجود ندارد (فرصت بکر)', value: 'blue_ocean', icon: 'Compass', badge: 'بازار بکر' }
      ]
    },
    {
      id: 'p2_step1_customer_pain',
      step: 1,
      title: 'اصلی‌ترین اصطکاک و درد مخاطب',
      text: 'بیشترین شکایت و نارضایتی مشتریان از خدمات و گزینه‌های موجود چیست؟',
      options: [
        { text: 'کیفیت پایین، سطحی بودن و وعده‌های دروغین بدون نتیجه ملموس', value: 'low_quality_promises', icon: 'AlertTriangle', badge: 'ادعاهای توخالی' },
        { text: 'قیمت‌های نجومی و عدم شفافیت در قراردادها و هزینه‌ها', value: 'high_opaque_price', icon: 'DollarSign', badge: 'قیمت غیرشفاف' },
        { text: 'پشتیبانی ضعیف و رها کردن کارفرما/مشتری بلافاصله پس از پرداخت', value: 'poor_followup_support', icon: 'UserX', badge: 'نبود همراهی' },
        { text: 'پیچیدگی بیش از حد و استفاده از اصطلاحات نامفهوم و غیرکاربردی', value: 'overly_academic_jargon', icon: 'FileQuestion', badge: 'زبان غیرساده' }
      ]
    },
    {
      id: 'p2_step2_pricing_models',
      step: 2,
      title: 'بازه قیمتی و رفتار خرید مخاطب',
      text: 'در بازار هدف شما، مشتریان عموماً چه مدل قیمتی را بهتر می‌پذیرند؟',
      options: [
        { text: 'مدل اقتصادی در دسترس با حجم فروش بالا', value: 'economy_accessible', icon: 'TrendingDown', badge: 'اقتصادی در دسترس' },
        { text: 'قیمت منصفانه بازار متناسب با کیفیت اثبات‌شده (میان‌رده مطمئن)', value: 'mid_range_fair', icon: 'CheckCircle', badge: 'متوسط استاندارد' },
        { text: 'پرمیوم و باارزش بالا برای کارفرمایان ویژه (خدمات VIP های‌تیکت)', value: 'premium_high_ticket', icon: 'Crown', badge: 'پرمیوم VIP' },
        { text: 'مدل اشتراکی دوره‌ای یا پرداخت مبتنی بر پیشرفت پروژه', value: 'retainer_milestone', icon: 'Repeat', badge: 'مستمر / ریتاینر' }
      ]
    },
    {
      id: 'p2_step4_golden_opportunity',
      step: 3,
      title: 'فرصت طلایی تمایز (Opportunity Gap)',
      text: 'کدام مزیت کشف‌نشده در بازار وجود دارد که تمرکز بر آن شما را متمایز می‌کند؟',
      options: [
        { text: 'همراهی اختصاصی تا رسیدن به خروجی ملموس و تضمین رضایت', value: 'hands_on_mentorship', icon: 'HeartHandshake', badge: 'همراهی متعهدانه' },
        { text: 'ساده‌سازی رادیکال و انتقال تجربیات واقعی بدون شعار و حواشی', value: 'radical_simplicity_truth', icon: 'Sparkles', badge: 'صراحت و سادگی' },
        { text: 'سرعت عمل بسیار بالا در پاسخگویی و تحویل دقیق پروژه‌ها', value: 'speed_reliability', icon: 'Zap', badge: 'سرعت و نظم' },
        { text: 'ارائه متدولوژی‌ها و فریم‌ورک‌های عملیاتی اثبات‌شده در میدان', value: 'proven_frameworks', icon: 'Award', badge: 'روش‌شناسی عملی' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 3: STRATEGY & BRAND DIRECTION
// ----------------------------------------------------------------------------
function getPhase3Questions(arch) {
  return [
    {
      id: 'p3_target_segment',
      step: 0,
      title: 'بخش هدف متمرکز (Target Segment)',
      text: 'دقیقاً کدام گروه از مشتریان، بیشترین فوریت، نیاز و ارزش پرداخت را برای خدمت/محصول شما دارند؟',
      options: [
        { text: 'مشتریان کیفیت‌محور که حاضرند برای کار بی‌نقص و مطمئن هزینه عادلانه بپردازند', value: 'quality_first_clients', icon: 'ShieldCheck', badge: 'کیفیت‌محور' },
        { text: 'افراد یا کسب‌وکارهای پرمشغله که سرعت، سهولت و صرفه‌جویی در زمان برایشان حیاتی است', value: 'time_sensitive_busy', icon: 'Zap', badge: 'زمان‌محور' },
        { text: 'سازمان‌ها و کارفرمایانی که از بدقولی و خدمات سنتی خسته شده‌اند', value: 'reliability_seekers', icon: 'Briefcase', badge: 'نظم‌محور' },
        { text: 'نسل جوان و خریداران آگاهی که به تجربه عالی و ظاهر برند اهمیت می‌دهند', value: 'modern_experience_seekers', icon: 'Sparkles', badge: 'تجربه‌محور' }
      ]
    },
    {
      id: 'p3_positioning_frame',
      step: 1,
      title: 'چهارچوب جایگاه‌یابی و انحصار (Only-ness)',
      text: 'می‌خواهید در ذهن مشتری به عنوان چه انتخابی تثبیت شوید؟ (ادعای تمایز منحصربه‌فرد)',
      options: [
        { text: 'تنها گزینه‌ای که نتیجه کار را با شفافیت ۱۰۰٪ و ضمانت واقعی تحویل می‌دهد', value: 'guaranteed_partner', icon: 'ShieldCheck', badge: 'ریسک صفر' },
        { text: 'سریع‌ترین و بی‌دردسرترین راهکار بدون حتی یک دقیقه معطلی و حواشی', value: 'frictionless_fast', icon: 'Zap', badge: 'بدون معطلی' },
        { text: 'عمیق‌ترین تخصص فنی و وسواس در جزئیات با بهترین متریال ممکن', value: 'craftsmanship_expert', icon: 'Award', badge: 'تخصص عمیق' },
        { text: 'باصرفه‌ترین و منصفانه‌ترین ارزش خرید با حفظ احترام کامل مشتری', value: 'smart_fair_value', icon: 'HeartHandshake', badge: 'ارزش هوشمند' }
      ]
    },
    {
      id: 'p3_strategic_boundary',
      step: 2,
      title: 'مرزهای استراتژیک (به چه کارهایی «نه» می‌گویید؟)',
      text: 'یک برند باکیفیت مرزهای مشخصی دارد. خط قرمز قطعی کسب‌وکار شما چیست؟',
      options: [
        { text: 'هرگز کار بی‌کیفیت، مواد نامرغوب و سمبل‌کاری انجام نمی‌دهیم', value: 'no_low_quality_materials', icon: 'AlertTriangle', badge: 'کیفیت خط قرمز است' },
        { text: 'هرگز وعده دروغین نمی‌دهیم و بدون اطمینان از انجام تعهد نمی‌کنیم', value: 'no_false_promises', icon: 'ShieldAlert', badge: 'صداقت مطلق' },
        { text: 'هرگز وارد رقابت منفی قیمت و ارزان‌فروشی غیراستاندارد نمی‌شویم', value: 'no_price_race_to_bottom', icon: 'TrendingDown', badge: 'حفظ ارزش کار' }
      ]
    },
    {
      id: 'p3_brand_promise',
      step: 3,
      title: 'وعده محوری برند (Brand Promise)',
      text: 'مهم‌ترین عهد و قولی که برند شما به صورت تخلف‌ناپذیر به هر مشتری می‌دهد چیست؟',
      options: [
        { text: 'تحویل کار بی‌نقص و درخشان همراه با پاسخگویی کامل تا رضایت ۱۰۰٪', value: 'flawless_satisfaction_promise', icon: 'CheckCircle', badge: 'رضایت قطعی' },
        { text: 'صرفه‌جویی واقعی در زمان شما و ایجاد تجربه‌ای راحت و محترمانه', value: 'time_peace_promise', icon: 'Clock', badge: 'آرامش و زمان' },
        { text: 'شفافیت کامل در هزینه‌ها، روند کار و استفاده از بهترین استانداردهای روز', value: 'transparency_standards_promise', icon: 'FileText', badge: 'شفافیت کامل' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 4: BRAND IDENTITY & CHARACTER
// ----------------------------------------------------------------------------
function getPhase4Questions(arch) {
  return [
    {
      id: 'p4_archetype',
      step: 0,
      title: 'کهن‌الگوی روان‌شناختی برند',
      text: 'اگر برند شما یک انسان بود، چه روحیه‌ای داشت و در ارتباط با مشتری چه نقشی ایفا می‌کرد؟',
      options: [
        { text: 'رفیق کاربلد و مردمی (Everyman) — خودمانی، منصف، دست‌پاک و همیشه در دسترس', value: 'everyman', icon: 'Users', badge: 'رفیق کاربلد' },
        { text: 'حکیم و متخصص راهنما (Sage) — متکی بر علم، داده، مشاوره صبورانه و دقت نظر', value: 'sage', icon: 'BookOpen', badge: 'متخصص حکیم' },
        { text: 'آفرینش‌گر کمال‌گرا (Creator) — وسواسی در تمیزی و زیبایی، نوآور و عاشق کیفیت', value: 'creator', icon: 'Sparkles', badge: 'کمال‌گرا و نوآور' },
        { text: 'مدافع و قهرمان حامی (Hero) — قاطع، غلبه‌کننده بر چالش‌ها و قابل اعتماد در بحران', value: 'hero', icon: 'Shield', badge: 'حامی و مقتدر' }
      ]
    },
    {
      id: 'p4_human_traits',
      step: 1,
      title: 'صفات شخصیتی محوری',
      text: 'مشتریان وفادار، کاراکتر برند شما را با کدام سه ویژگی توصیف خواهند کرد؟',
      options: [
        { text: 'دقیق، متعهد، چشم‌پاک و وسواسی در ارائه کار درست', value: 'disciplined_committed', icon: 'CheckCircle', badge: 'دقیق و متعهد' },
        { text: 'گرم، خوش‌رو، صبور و ایجاد حس آرامش و احترام در مشتری', value: 'warm_respectful', icon: 'Smile', badge: 'خوش‌برخورد و گرم' },
        { text: 'پیشرو، شجاع، مجهز به ابزارهای روز و مدرن', value: 'modern_cutting_edge', icon: 'Zap', badge: 'مدرن و پیشرو' }
      ]
    },
    {
      id: 'p4_tone_guardrail',
      step: 2,
      title: 'گاردریل‌ها و مرزهای لحن برند',
      text: 'رفتار و لحن برند شما در هیچ شرایطی نباید شبیه چه چیزی باشد؟',
      options: [
        { text: 'بدقول، بی‌حوصله با مشتری و فاقد ادب و احترام', value: 'avoid_rude_impatient', icon: 'AlertTriangle', badge: 'پرهیز از بدخلقی' },
        { text: 'مغرور، از بالا به پایین و پر از کلمات سنگین و غیرقابل درک', value: 'avoid_condescending', icon: 'XCircle', badge: 'پرهیز از غرور' },
        { text: 'شوخی‌های سبک، لودگی و رفتارهای غیرحرفه‌ای و جلف', value: 'avoid_cheap_gimmicks', icon: 'ShieldAlert', badge: 'پرهیز از سبک‌سری' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 5: VERBAL IDENTITY & MESSAGING
// ----------------------------------------------------------------------------
function getPhase5Questions(arch) {
  return [
    {
      id: 'p5_voice_style',
      step: 0,
      title: 'سبک صدای برند در ارتباط با مخاطب',
      text: 'لحن اصلی پیام‌ها، نوشته‌ها، مکالمات تلفنی و تعامل با مشتریان چگونه باشد؟',
      options: [
        { text: 'صمیمی، محترمانه، خودمانی و در کمال شفافیت و ادب', value: 'conversational_respectful', icon: 'MessageCircle', badge: 'صمیمی و محترمانه' },
        { text: 'رسمی، استوار، دقیق و متکی بر استانداردهای کارشناسی', value: 'formal_authoritative', icon: 'Briefcase', badge: 'استوار و کارشناسی' },
        { text: 'پرانرژی، الهام‌بخش، خودانگیخته و اشتیاق‌آفرین', value: 'energetic_inspiring', icon: 'Zap', badge: 'پرانرژی و پویا' }
      ]
    },
    {
      id: 'p5_elevator_hook',
      step: 1,
      title: 'قلاب معرفی سریع (معرفی ۳۰ ثانیه‌ای)',
      text: 'وقتی در کمتر از نیم دقیقه از شما می‌پرسند چه کاری انجام می‌دهید، شروع پاسخ روی چه محوری باشد؟',
      options: [
        { text: 'طرح مستقیم درد کلافه‌کننده مشتری و بیان راهکار سریع و بی‌دردسر ما', value: 'pain_solution_hook', icon: 'Target', badge: 'حل مستقیم درد' },
        { text: 'بیان نتیجه و دستاورد شگفت‌انگیز که مشتری بعد از دریافت کار تجربه می‌کند', value: 'outcome_result_hook', icon: 'TrendingUp', badge: 'دستاورد ملموس' },
        { text: 'نقد رویکردهای اشتباه و سنتی بازار و معرفی استاندارد مدرن خودمان', value: 'contrarian_fresh_hook', icon: 'HelpCircle', badge: 'تمایز استاندارد' }
      ]
    },
    {
      id: 'p5_forbidden_words',
      step: 2,
      title: 'واژگان ممنوعه و ادبیات تمیز اختصاصی',
      text: 'کدام کلمات کلیشه‌ای و نخ‌نما باید از تمامی مکالمات، تابلوها و متون شما حذف شوند؟',
      options: [
        { text: 'شعارهای توخالی مثل «بهترین کیفیت»، «با ما بدرخشید»، «نازل‌ترین قیمت»', value: 'ban_generic_fluff', icon: 'Ban', badge: 'حذف شعارهای بی‌معنی' },
        { text: 'اصطلاحات خارجی غیرضروری که مشتری عادی را معذب یا گیج می‌کند', value: 'ban_pretentious_jargon', icon: 'FileX', badge: 'پرهیز از زبان سخت' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 6: NAMING, TAGLINE & CREATIVE DIRECTION
// ----------------------------------------------------------------------------
function getPhase6Questions(arch) {
  return [
    {
      id: 'p6_naming_territory',
      step: 0,
      title: 'قلمرو استراتژیک نام‌گذاری برند',
      text: 'نام برند ظرفی است که در طول زمان با اعتبار و اعتماد پر می‌شود. چه سبکی را ترجیح می‌دهید؟',
      options: [
        { text: 'نام کوتاه، مدرن، خوش‌آوا و پرانرژی (راحت در تلفظ و ماندگار در ذهن)', value: 'modern_short_catchy', icon: 'Sparkles', badge: 'کوتاه و یادمان‌ساز' },
        { text: 'نام استعاره‌ای یا تصویری ریشه‌دار در طبیعت و مفاهیم اصیل ایرانی', value: 'metaphorical_heritage', icon: 'Eye', badge: 'اصیل و تصویری' },
        { text: 'نام توصیفی صریح که دقیقاً صنف و مهارت اصلی را در ثانیه اول نشان دهد', value: 'descriptive_direct', icon: 'FileText', badge: 'توصیفی صریح' },
        { text: 'نام شخصی بنیان‌گذار (Personal Brand) با پشتوانه اعتبار فردی', value: 'founder_eponymous', icon: 'User', badge: 'نام شخصی' }
      ]
    },
    {
      id: 'p6_tagline_archetype',
      step: 1,
      title: 'سبک شعار برند (Tagline)',
      text: 'شعار همراه برند شما بیشتر چه نقشی داشته باشد؟',
      options: [
        { text: 'فراخوان شجاعانه به اقدام و تجربه تمایز و کیفیت خدمت (Action-Driven)', value: 'action_call', icon: 'Zap', badge: 'فراخوان عمل' },
        { text: 'بیان صریح منفعت بزرگ و آرامش مشتری (Benefit-Driven)', value: 'clear_benefit', icon: 'Check', badge: 'منفعت‌محور' },
        { text: 'یک بینش عمیق پیرامون احترام به مشتری و استانداردهای زندگی', value: 'vision_respect', icon: 'Compass', badge: 'چشم‌انداز و احترام' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 7: VISUAL IDENTITY DESIGN SYSTEM
// ----------------------------------------------------------------------------
function getPhase7Questions(arch, context = null) {
  const isAutomotive = context && isAutomotiveService(context);

  const isBeauty = context && (
    context.industryCode === "IND-04" ||
    context.industryId === "IND-04" ||
    arch === "HEALTH_BEAUTY_WELLNESS" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("زیبایی") || context.taxonomyTitleFa.includes("آرایش") || context.taxonomyTitleFa.includes("پوست") || context.taxonomyTitleFa.includes("کلینیک") || context.taxonomyTitleFa.includes("سالن")))
  );

  const isTextile = context && (
    context.industryCode === "IND-25" ||
    context.industryId === "IND-25" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("پوشاک") || context.taxonomyTitleFa.includes("نساجی") || context.taxonomyTitleFa.includes("تریکو") || context.taxonomyTitleFa.includes("پارچه") || context.taxonomyTitleFa.includes("دوخت")))
  );

  const isCafe = context && (
    context.taxonomyId === "BT-0066" ||
    context.taxonomyId === "BT-0067" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("قهوه") || context.taxonomyTitleFa.includes("رستری") || context.taxonomyTitleFa.includes("کافه"))) ||
    (context.archetypeTitle && (context.archetypeTitle.includes("قهوه") || context.archetypeTitle.includes("رستری"))) ||
    (context.keywords && (context.keywords.includes("قهوه") || context.keywords.includes("رستری")))
  );

  const isDining = context && (
    context.industryId === "IND-03" ||
    context.industryCode === "IND-03" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("رستوران") || context.taxonomyTitleFa.includes("کباب") || context.taxonomyTitleFa.includes("دیزی") || context.taxonomyTitleFa.includes("فست‌فود") || context.taxonomyTitleFa.includes("کترینگ") || context.taxonomyTitleFa.includes("تهیه غذا") || context.taxonomyTitleFa.includes("قنادی") || context.taxonomyTitleFa.includes("شیرینی")))
  );

  let paletteOptions = [
    { text: 'سرمه‌ای درباری + طلایی یا سفید (نهایت پرستیژ، اعتماد عمیق و اصالت)', value: 'navy_gold', icon: 'Shield', badge: 'باوقار و مطمئن' },
    { text: 'آبی کبالت نئونی + مشکی مات (فناوری مدرن، سرعت، چابکی و هوشمندی)', value: 'cobalt_black', icon: 'Zap', badge: 'مدرن و پیشرفته' },
    { text: 'سبز زمردی + خاکستری گرم (طبیعت، سرزندگی، آرامش خاطر و رشد)', value: 'emerald_warm_gray', icon: 'Leaf', badge: 'طبیعی و سلامت' },
    { text: 'زرشکی گرم / کهربایی + زغال سنگی (صمیمیت، انرژی گرم، اشتها و نشاط)', value: 'amber_charcoal', icon: 'Flame', badge: 'گرم و پویا' }
  ];

  if (isBeauty) {
    paletteOptions = [
      { text: 'رزگلد شیک + کرم شامپاینی (زیبایی لطیف، لوکس و آرامش‌بخش مراقبتی)', value: 'rosegold_champagne', icon: 'Sparkles', badge: 'لوکس و زیبایی' },
      { text: 'سبز پاستلی نعنایی + یاسی ملایم (طراوت، سلامت پوست و آرامش طبیعی)', value: 'pastel_mint_lilac', icon: 'Leaf', badge: 'طراوت و سلامت' },
      { text: 'زرشکی فاخر + خاکستری نقره‌ای (وقار، جذابیت مدرن و اعتماد بالا)', value: 'crimson_silver', icon: 'Heart', badge: 'جذاب و باوقار' }
    ];
  } else if (isTextile) {
    paletteOptions = [
      { text: 'کرم نود + زیتونی ملایم (بافت طبیعی، استایل مینیمال و زیبایی پایدار پارچه)', value: 'nude_olive_textile', icon: 'Scissors', badge: 'مینیمال و پایدار' },
      { text: 'مشکی کلاسیک + کرم فیلی (وقار مد، شیک‌پوشی و استایل پریمیوم پوشاک)', value: 'classic_black_camel', icon: 'Sparkles', badge: 'شیک‌پوشی و مد' },
      { text: 'نیلی دنیم + خاکستری بتنی (مقاومت الیاف، راحتی کژوال و کاربردی مدرن)', value: 'indigo_gray_denim', icon: 'Shield', badge: 'مدرن و کاربردی' }
    ];
  } else if (arch === 'LOCAL_SERVICE') {
    if (isAutomotive || (!context && arch === 'LOCAL_SERVICE')) {
      paletteOptions = [
        { text: 'آبی اقیانوسی + زرد صنعتی (تداعی‌گر پاکیزگی آب، درخشش و دقت فنی خودرو)', value: 'ocean_yellow_service', icon: 'Shield', badge: 'پاکیزگی و دقت' },
        { text: 'مشکی کربن مات + قرمز آتشین (جسارت، سرعت بالا و قدرت اتومبیل)', value: 'carbon_red_sport', icon: 'Flame', badge: 'انرژی و سرعت' },
        { text: 'سرمه‌ای عمیق + سفید یخچالی (اعتماد، تمیزی مطلق و انضباط کاری)', value: 'navy_ice_clean', icon: 'Zap', badge: 'اعتماد و تمیزی' }
      ];
    } else {
      paletteOptions = [
        { text: 'آبی درباری + نقره‌ای روشن (اعتماد بالا، نظم حرفه‌ای و کیفیت متعهدانه)', value: 'royal_blue_silver', icon: 'Shield', badge: 'اعتماد و تخصص' },
        { text: 'سبز نعنایی + سفید پاک (آرامش، پاکیزگی و سلامت پایدار)', value: 'mint_clean_white', icon: 'Leaf', badge: 'پاکیزگی و آرامش' },
        { text: 'نارنجی پرانرژی + زغالی مدرن (سرعت در خدمات، پویایی و دسترس‌پذیری)', value: 'energetic_orange_slate', icon: 'Zap', badge: 'پویا و سریع' }
      ];
    }
  } else if (arch === 'RESTAURANT_CAFE_HOSPITALITY') {
    if (isDining && !isCafe) {
      paletteOptions = [
        { text: 'قرمز گرم اشتهابرانگیز + زعفرانی و طلایی (حس اصالت طعم، میزبانی گرم ایرانی و اشتها)', value: 'warm_red_saffron', icon: 'Flame', badge: 'اشتها و اصالت طعم' },
        { text: 'سبز زیتونی + کرم بژ خاکی (سلامت غذا، ارگانیک بودن و آرامش سفره)', value: 'olive_cream_nature', icon: 'Leaf', badge: 'سالم و ارگانیک' },
        { text: 'سرمه‌ای فاخر + زرشکی مجلسی (پذیرایی VIP، تشریفات مجلل و میزبانی خاطره‌انگیز)', value: 'navy_royal_banquet', icon: 'Crown', badge: 'مجلل و تشریفاتی' }
      ];
    } else {
      paletteOptions = [
        { text: 'قهوه‌ای اسپرسو + بژ کرمی و خاکی (حس بویایی قهوه تازه، گرما و دنج بودن)', value: 'espresso_cream_cafe', icon: 'Coffee', badge: 'دنج و گرمابخش' },
        { text: 'سبز زیتونی ملایم + چوب طبیعی (اصالت گیاهی، آرامش و کیفیت تازه)', value: 'olive_wood_nature', icon: 'Leaf', badge: 'ارگانیک و تازه' },
        { text: 'مشکی مات + طلایی مینیمال (فضای مدرن، شیک، شبانه و اسپشالتی)', value: 'black_gold_night', icon: 'Sparkles', badge: 'لوکس و مدرن' }
      ];
    }
  }

  return [
    {
      id: 'p7_color_palette',
      step: 0,
      title: 'پالت رنگی اصلی هویت بصری',
      text: 'بر اساس روان‌شناسی رنگ‌ها و صنف شما، کدام ترکیب رنگی بهترین پیام ناخودآگاه را القا می‌کند؟',
      options: paletteOptions
    },
    {
      id: 'p7_typography_mood',
      step: 1,
      title: 'شخصیت تایپوگرافی و فونت فارسی',
      text: 'فونت نوشتاری تابلوها، منو، وب‌سایت یا فاکتورهای شما چه حسی را به چشم بیننده بیاورد؟',
      options: [
        { text: 'سنس‌سریف هندسی مدرن، منظم، تمیز و کاملاً خوانا (مثل وزیرمتن / یکان‌بخ)', value: 'geometric_clean_modern', icon: 'Type', badge: 'مدرن و خوانا' },
        { text: 'حروف دست‌نویس با حس انسانیت، صمیمیت و دوستی', value: 'handwritten_friendly', icon: 'Edit3', badge: 'دست‌نویس صمیمی' },
        { text: 'فونت کلاسیک سنگین با ریشه‌های سنتی و وقار رسمی', value: 'classic_formal_sturdy', icon: 'FileText', badge: 'رسمی و باوقار' }
      ]
    },
    {
      id: 'p7_logo_direction',
      step: 2,
      title: 'جهت‌گیری فرم نشان و لوگو',
      text: 'نشان بصری برند شما بهتر است چه قالبی داشته باشد؟',
      options: [
        { text: 'مونوگرام مینیمال با نماد اختصاصی انتزاعی از خدمت شما', value: 'monogram_abstract', icon: 'PenTool', badge: 'مونوگرام نمادین' },
        { text: 'لوگوتایپ کلمه‌ای با طراحی حروف اختصاصی و متمایز (Custom Wordmark)', value: 'custom_wordmark', icon: 'Type', badge: 'لوگوتایپ کلمه‌ای' },
        { text: 'نشان ترکیبی (آیکون هوشمند + نام نوشتاری) مناسب تابلو و لباس کار', value: 'combination_mark', icon: 'Sparkles', badge: 'نشان ترکیبی همه‌کاره' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 8: EXECUTIVE ACTIVATION & REPUTATION
// ----------------------------------------------------------------------------
function getPhase8Questions(arch, context = null) {
  const isRetail = arch === 'PHYSICAL_RETAIL' || arch === 'LOCAL_RETAIL' || arch === 'RETAIL' || (context && (context.industryId === 'IND-01' || context.industryCode === 'IND-01' || context.primaryArchetype === 'PHYSICAL_RETAIL'));

  const isAutomotive = context && isAutomotiveService(context);

  const isCafe = context && (
    context.taxonomyId === "BT-0066" ||
    context.taxonomyId === "BT-0067" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("قهوه") || context.taxonomyTitleFa.includes("رستری") || context.taxonomyTitleFa.includes("کافه"))) ||
    (context.archetypeTitle && (context.archetypeTitle.includes("قهوه") || context.archetypeTitle.includes("رستری"))) ||
    (context.keywords && (context.keywords.includes("قهوه") || context.keywords.includes("رستری")))
  );

  const isDining = context && (
    context.industryId === "IND-03" ||
    context.industryCode === "IND-03" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("رستوران") || context.taxonomyTitleFa.includes("کباب") || context.taxonomyTitleFa.includes("دیزی") || context.taxonomyTitleFa.includes("فست‌فود") || context.taxonomyTitleFa.includes("کترینگ") || context.taxonomyTitleFa.includes("تهیه غذا") || context.taxonomyTitleFa.includes("قنادی") || context.taxonomyTitleFa.includes("شیرینی")))
  );

  const isBeauty = context && (
    context.industryCode === "IND-04" ||
    context.industryId === "IND-04" ||
    arch === "HEALTH_BEAUTY_WELLNESS" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("زیبایی") || context.taxonomyTitleFa.includes("آرایش") || context.taxonomyTitleFa.includes("پوست") || context.taxonomyTitleFa.includes("کلینیک") || context.taxonomyTitleFa.includes("سالن")))
  );

  if (isRetail) {
    return [
      {
        id: 'p8_thought_leadership',
        step: 0,
        title: 'تجربه حضور در فروشگاه و اعتمادسازی خریدار',
        text: 'در بازار و میان خریداران، چه عاملی فروشگاه شما را به انتخاب اول خرید تبدیل می‌کند؟',
        options: [
          { text: 'چیدمان جذاب ویترین، دکور دعوت‌کننده و تجربه لمس مستقیم کیفیت کالاها', value: 'storefront_visual_appeal', icon: 'ShoppingBag', badge: 'ویترین و تجربه لمسی' },
          { text: 'معرفی صادقانه مشخصات کالاها و مشاوره راهنمایی خرید در شبکه‌های اجتماعی', value: 'transparent_product_demos', icon: 'Camera', badge: 'معرفی شفاف اجناس' },
          { text: 'رضایت خریداران قبلی، نظرات مثبت روی نقشه و وفاداری مشتریان ثابت', value: 'customer_testimonials', icon: 'Star', badge: 'نظرات خریداران' }
        ]
      },
      {
        id: 'p8_pr_podcast_channels',
        step: 1,
        title: 'کانال‌های محلی جذب و وفادارسازی خریداران',
        text: 'مهم‌ترین ابزار برای اطلاع‌رسانی کالکشن‌های جدید و بازگرداندن خریداران چیست؟',
        options: [
          { text: 'باشگاه مشتریان پیامکی برای اطلاع‌رسانی حراج‌های فصلی و اجناس جدید', value: 'sms_loyalty_club', icon: 'MessageSquare', badge: 'باشگاه پیامکی' },
          { text: 'کارت وفاداری یا کش‌بک درصدی از مبلغ خرید برای سفارش‌های بعدی', value: 'loyalty_punch_card', icon: 'HeartHandshake', badge: 'کارت وفاداری' },
          { text: 'اینستاگرام فعال با معرفی روزانه موجودی کالاها و استایل‌های ترند', value: 'retail_instagram_showcase', icon: 'Instagram', badge: 'اینستاگرام ویترینی' }
        ]
      },
      {
        id: 'p8_lead_funnel',
        step: 2,
        title: 'ارتقای میانگین سبد خرید (Basket Size)',
        text: 'چگونه مبلغ فاکتور و تنوع سبد خرید هر مشتری به شکلی ارزش‌افزا افزایش می‌یابد؟',
        options: [
          { text: 'چیدمان هوشمند اقلام مکمل و اکسسوری‌های پرکاربرد نزدیک صندوق (Cross-Sell)', value: 'checkout_cross_sell', icon: 'TrendingUp', badge: 'اکسسوری پای صندوق' },
          { text: 'پیشنهاد بسته‌های تخفیف تجمیعی (مثلاً خرید ۳ قلم با تخفیف ویژه قلم چهارم)', value: 'bundle_volume_discount', icon: 'Layers', badge: 'بسته‌های تخفیفی' },
          { text: 'امکان ثبت سفارش آنلاین و ارسال فوری درب منزل برای مشتریان حضوری و تلفنی', value: 'omnichannel_fast_delivery', icon: 'Truck', badge: 'ارسال فوری تلفنی/آنلاین' }
        ]
      },
      {
        id: 'p8_crisis_reputation',
        step: 3,
        title: 'پلی‌بوک مرجوعی، تعویض و حفظ رضایت خریدار',
        text: 'در صورت نارضایتی خریدار از کیفیت کالا یا اشتباه در سایز/رنگ، پروتکل فوری شما چیست؟',
        options: [
          { text: 'تعویض یا مرجوعی بی‌قیدوشرط کالا تا چند روز با خوش‌رویی کامل و عذرخواهی محترمانه', value: 'unconditional_exchange_return', icon: 'ShieldCheck', badge: 'تعویض بدون قیدوشرط' },
          { text: 'بررسی فوری، جبران خسارت و ارائه کد تخفیف اختصاصی برای خریدهای آینده', value: 'transparent_investigation_gift', icon: 'HeartHandshake', badge: 'جبران سریع + هدیه' }
        ]
      }
    ];
  }

  if (arch === 'LOCAL_SERVICE') {
    if (isBeauty) {
      return [
        {
          id: 'p8_thought_leadership',
          step: 0,
          title: 'اعتمادسازی، بهداشت و هنر تخصصی',
          text: 'در فضای مراقبت و زیبایی، مراجعان چگونه به مهارت و بهداشت کار شما پی می‌برند؟',
          options: [
            { text: 'نمایش نمونه‌کارهای قبل و بعد طبیعی و ظریف بدون فیلتر در شبکه‌های اجتماعی', value: 'natural_before_after', icon: 'Camera', badge: 'نمونه‌کار قبل و بعد' },
            { text: 'شفافیت در باز کردن پک‌های بهداشتی استریل و متریال اورجینال در حضور مراجع', value: 'sterile_hygiene_proof', icon: 'ShieldCheck', badge: 'استریل در حضور مراجع' },
            { text: 'رضایت کتبی و ویدیویی مراجعان قبلی و توصیه‌های دهان‌به‌دهان در محله', value: 'customer_testimonials', icon: 'Star', badge: 'رضایت مراجعان' }
          ]
        },
        {
          id: 'p8_pr_podcast_channels',
          step: 1,
          title: 'کانال‌های یادآوری نوبت و مراقبت مستمر',
          text: 'مهم‌ترین سازوکار برای بازگشت منظم مراجعان و ترمیم دوره‌ای چیست؟',
          options: [
            { text: 'سامانه پیامکی هوشمند یادآوری موعد ترمیم نوبت یا چکاپ دوره‌ای پوست و مو', value: 'appointment_recall_sms', icon: 'MessageSquare', badge: 'یادآوری نوبت ترمیم' },
            { text: 'باشگاه مشتریان VIP با ارائه خدمات تکمیلی هدیه در نوبت‌های خاص سال', value: 'vip_beauty_club', icon: 'HeartHandshake', badge: 'باشگاه VIP' },
            { text: 'ویدیوهای کوتاه آموزش روتین‌های مراقبتی صحیح در منزل (Home Care)', value: 'homecare_tips_video', icon: 'Video', badge: 'آموزش هوم‌کر' }
          ]
        },
        {
          id: 'p8_lead_funnel',
          step: 2,
          title: 'ساختار سبد خدمات و مراقبت تکمیلی',
          text: 'چگونه سبد ارزش مراجعان به شکل حرفه‌ای ارتقا می‌یابد؟',
          options: [
            { text: 'پیشنهاد محصولات مراقبتی خانگی اورجینال (Home Care) متناسب با نوع پوست و مو', value: 'homecare_product_sales', icon: 'ShoppingBag', badge: 'محصولات هوم‌کر' },
            { text: 'پکیج‌های دوره‌ای چندجلسه‌ای با تخفیف تجمیعی به جای تک‌جلسه‌ای', value: 'multi_session_packages', icon: 'Layers', badge: 'پکیج‌های دوره‌ای' },
            { text: 'ارائه خدمات جانبی آرامش‌بخش در طول نوبت مراجعان', value: 'complimentary_comfort_care', icon: 'Sparkles', badge: 'پذیرایی و آرامش' }
          ]
        },
        {
          id: 'p8_crisis_reputation',
          step: 3,
          title: 'پلی‌بوک حل نارضایتی مراجعان',
          text: 'در صورت عدم رضایت مراجع از خروجی کار، پروتکل تخلف‌ناپذیر شما چیست؟',
          options: [
            { text: 'اصلاح و ترمیم مجدد و فوری خدمت به صورت کاملاً رایگان با پذیرایی ویژه', value: 'instant_free_rework', icon: 'ShieldCheck', badge: 'ترمیم رایگان' },
            { text: 'شنیدن صبورانه دغدغه مراجع و استرداد وجه در صورت عدم امکان اصلاح', value: 'transparent_investigation_gift', icon: 'HeartHandshake', badge: 'استرداد محترمانه' }
          ]
        }
      ];
    }

    if (isAutomotive || (!context && arch === 'LOCAL_SERVICE')) {
      return [
        {
          id: 'p8_thought_leadership',
          step: 0,
          title: 'اعتمادسازی محلی و شهرت فردی متخصص',
          text: 'در محدوده و محله شما، مردم چگونه به تخصص و صداقت کار شما پی می‌برند؟',
          options: [
            { text: 'شفافیت کامل در فرآیند کار و آموزش نکات فنی نگهداری به مشتری پای کار', value: 'frontline_education', icon: 'CheckCircle', badge: 'آموزش پای کار' },
            { text: 'نمایش نمونه‌کارهای قبل و بعد در فضای مجازی و شبکه‌های اجتماعی', value: 'before_after_proof', icon: 'Camera', badge: 'شواهد تصویری قبل/بعد' },
            { text: 'تاییدیه و رضایت مشتریان وفادار قبلی و نظرات محلی روی نقشه', value: 'customer_testimonials', icon: 'Star', badge: 'نظرات محلی' }
          ]
        },
        {
          id: 'p8_pr_podcast_channels',
          step: 1,
          title: 'کانال‌های محلی جذب و بازگشت مشتری',
          text: 'مهم‌ترین ابزار برای یادآوری نوبت و بازگرداندن مشتریان راضی چیست؟',
          options: [
            { text: 'سامانه پیامکی هوشمند یادآوری زمان سرویس دوره‌ای بعدی (بر اساس کیلومتر یا تاریخ)', value: 'smart_sms_recall', icon: 'MessageSquare', badge: 'یادآوری پیامکی' },
            { text: 'کارت وفاداری فیزیکی یا دیجیتال (مثلاً هر ۴ سرویس، سرویس پنجم با ۵۰٪ تخفیف)', value: 'loyalty_punch_card', icon: 'HeartHandshake', badge: 'کارت وفاداری' },
            { text: 'ویدیوهای کوتاه آموزش نکات نگهداری خودرو در شبکه‌های اجتماعی برای جلب اعتماد', value: 'educational_short_videos', icon: 'Video', badge: 'آموزش و اعتماد' }
          ]
        },
        {
          id: 'p8_lead_funnel',
          step: 2,
          title: 'ساختار قیف تجاری و خدمات تکمیلی',
          text: 'چگونه فاکتور میانگین هر مشتری بدون ایجاد حس تحمیل افزایش می‌یابد؟',
          options: [
            { text: 'پیشنهاد خدمات تکمیلی مکمل (مثل شستشوی موتور نانو، واکس یا تعویض فیلتر کابین)', value: 'upsell_cross_sell', icon: 'TrendingUp', badge: 'خدمات مکمل' },
            { text: 'اشتراک سالانه یا پکیج جامع نگهداری دوره‌ای با تخفیف ثابت', value: 'annual_maintenance_package', icon: 'Repeat', badge: 'اشتراک سالانه' },
            { text: 'فروش مستقیم شوینده‌ها و اکسسوری‌های مرغوب خودرو در سالن انتظار', value: 'waiting_lounge_retail', icon: 'ShoppingBag', badge: 'فروشگاه مکمل' }
          ]
        },
        {
          id: 'p8_crisis_reputation',
          step: 3,
          title: 'پلی‌بوک حل نارضایتی و حفظ آبرو',
          text: 'در صورت بروز کوچک‌ترین نارضایتی مشتری از کیفیت کار، پروتکل تخلف‌ناپذیر شما چیست؟',
          options: [
            { text: 'انجام مجدد و فوری خدمت به صورت کاملاً رایگان با عذرخواهی محترمانه', value: 'instant_free_rework', icon: 'ShieldCheck', badge: 'خدمت مجدد رایگان' },
            { text: 'بررسی فوری دوربین‌ها، ارائه توضیحات شفاف و جبران خسارت با هدیه معنادار', value: 'transparent_investigation_gift', icon: 'HeartHandshake', badge: 'جبران سریع' }
          ]
        }
      ];
    }

    // General Local Technical / Facility Services (IND-28, etc.)
    return [
      {
        id: 'p8_thought_leadership',
        step: 0,
        title: 'اعتمادسازی محلی و شهرت فنی متخصص',
        text: 'در منطقه و محدوده فعالیت، مشتریان چگونه به صداقت و تخصص کار شما اطمینان می‌یابند؟',
        options: [
          { text: 'شفافیت کامل در اعلام قیمت قطعات مصرفی و ارائه داغی قطعات تعویضی به مشتری', value: 'frontline_education', icon: 'CheckCircle', badge: 'شفافیت قطعات و اجرت' },
          { text: 'ارائه گواهینامه‌ها و مدارک مهارت فنی معتبر سرویس‌کاران و نمایش سوابق کاری', value: 'before_after_proof', icon: 'Award', badge: 'مدارک مهارت فنی' },
          { text: 'تاییدیه و رضایت مشتریان قبلی و نظرات روی نقشه‌های محلی', value: 'customer_testimonials', icon: 'Star', badge: 'نظرات محلی' }
        ]
      },
      {
        id: 'p8_pr_podcast_channels',
        step: 1,
        title: 'کانال‌های محلی جذب و بازگشت مشتری',
        text: 'مهم‌ترین ابزار برای یادآوری زمان بازرسی دوره‌ای و بازگشت مشتریان چیست؟',
        options: [
          { text: 'سامانه پیامکی یادآوری موعد چکاپ دوره‌ای و سرویس‌های فصلی تاسیسات', value: 'smart_sms_recall', icon: 'MessageSquare', badge: 'یادآوری سرویس دوره‌ای' },
          { text: 'کارت اشتراک مشتریان محلی با تخفیف‌های ثابت برای مراجعات بعدی', value: 'loyalty_punch_card', icon: 'HeartHandshake', badge: 'کارت اشتراک' },
          { text: 'برچسب‌های منظم با شماره تماس مستقیم و کد رهگیری روی تجهیزات سرویس‌شده', value: 'equipment_service_tag', icon: 'FileText', badge: 'برچسب سرویس و تماس' }
        ]
      },
      {
        id: 'p8_lead_funnel',
        step: 2,
        title: 'ساختار قراردادها و خدمات تکمیلی',
        text: 'چگونه سبد خدمات ارائه شده به هر مشتری یا ساختمان گسترش می‌یابد؟',
        options: [
          { text: 'پیشنهاد بازرسی جامع فنی و سرویس پیشگیرانه همزمان با رفع مشکل فعلی', value: 'upsell_cross_sell', icon: 'TrendingUp', badge: 'سرویس پیشگیرانه مکمل' },
          { text: 'قراردادهای نگهداری و پشتیبانی سالانه یا فصلی با مجتمع‌ها و سازمان‌ها', value: 'annual_maintenance_package', icon: 'Repeat', badge: 'قرارداد نگهداری سالانه' },
          { text: 'تامین مستقیم قطعات یدکی استاندارد و باکیفیت بدون واسطه', value: 'waiting_lounge_retail', icon: 'Box', badge: 'تامین مستقیم قطعات' }
        ]
      },
      {
        id: 'p8_crisis_reputation',
        step: 3,
        title: 'پلی‌بوک حل نارضایتی و ضمانت خدمت',
        text: 'در صورت بروز مجدد عیب یا نارضایتی مشتری از کیفیت کار، پروتکل فوری شما چیست؟',
        options: [
          { text: 'اعزام مجدد فوری و رفع عیب به صورت کاملاً رایگان همراه با پوزش محترمانه', value: 'instant_free_rework', icon: 'ShieldCheck', badge: 'رفع عیب مجدد رایگان' },
          { text: 'پاسخگویی مستقیم مدیر فنی، بازرسی مجدد و جبران فوری خسارت احتمالی', value: 'transparent_investigation_gift', icon: 'HeartHandshake', badge: 'جبران سریع خسارت' }
        ]
      }
    ];
  }

  if (arch === 'RESTAURANT_CAFE_HOSPITALITY') {
    if (isDining && !isCafe) {
      return [
        {
          id: 'p8_thought_leadership',
          step: 0,
          title: 'هویت حسی، اصالت طعم و بازاریابی رستوران',
          text: 'برای تبدیل رستوران به انتخاب اول وعده‌های غذایی و دورهمی‌ها، کانون اصلی دیده‌شدن برند کجاست؟',
          options: [
            { text: 'اشتراک‌گذاری ویدیوهای شفاف از بهداشت آشپزخانه، تازگی مواد اولیه و هنر طبخ سرآشپز', value: 'behind_bar_coffee_craft', icon: 'Video', badge: 'بهداشت و طبخ سرآشپز' },
            { text: 'حضور فعال در پلتفرم‌های امتیازدهی و نقشه (گوگل مپ، نشان) با پاسخگویی به تک‌تک نظرات', value: 'active_review_management', icon: 'Star', badge: 'مدیریت نظرات' },
            { text: 'میزبانی حرفه‌ای از جشن‌ها، مراسم‌های خانوادگی و دورهمی‌های اختصاصی با چیدمان تشریفاتی', value: 'cupping_events_hosting', icon: 'Users', badge: 'میزبانی رویداد و جشن' }
          ]
        },
        {
          id: 'p8_pr_podcast_channels',
          step: 1,
          title: 'شراکت‌ها و بازاریابی ناهار سازمانی',
          text: 'کدام کانال برای معرفی و توسعه فروش غذایی شما بیشترین بازدهی را خواهد داشت؟',
          options: [
            { text: 'همکاری با ارزیابان و منتقدان خوش‌نام غذا که نقدهای معتبر و صادقانه منتشر می‌کنند', value: 'authentic_food_bloggers', icon: 'Camera', badge: 'منتقدان اصیل غذا' },
            { text: 'پکیج‌های ناهار شرکتی و کترینگ اداری برای شرکت‌ها و سازمان‌های همسایه با تخفیف قراردادی', value: 'corporate_neighbors_package', icon: 'Briefcase', badge: 'ناهار شرکتی و اداری' },
            { text: 'سیستم وفاداری دیجیتال بر پایه شماره موبایل برای اطلاع‌رسانی تخفیف‌ها و غذاهای روز', value: 'sms_loyalty_club', icon: 'Zap', badge: 'باشگاه مشتریان دیجیتال' }
          ]
        },
        {
          id: 'p8_lead_funnel',
          step: 2,
          title: 'توسعه سبد سفارش و میانگین فاکتور',
          text: 'درآمدزایی و افزایش میانگین فاکتور هر سفارش چگونه تقویت می‌شود؟',
          options: [
            { text: 'پیشنهاد پیش‌غذا، نوشیدنی‌های سنتی خنک و دسرهای دست‌ساز خوش‌طعم در کنار غذای اصلی', value: 'packaged_beans_retail', icon: 'Sparkles', badge: 'پیش‌غذا و دسر مکمل' },
            { text: 'سینی‌های چندنفره خانوادگی و اقتصادی با ترکیب محبوب‌ترین کباب‌ها و غذاها', value: 'pastry_pairing_high_margin', icon: 'Layers', badge: 'سینی‌های اقتصادی خانواده' },
            { text: 'ارسال سریع بیرون‌بر با بسته‌بندی عایق حرارتی ویژه از طریق اسنپ‌فود و پیک اختصاصی', value: 'optimized_takeaway_delivery', icon: 'Truck', badge: 'بیرون‌بر بهینه' }
          ]
        },
        {
          id: 'p8_crisis_reputation',
          step: 3,
          title: 'پروتکل برخورد با نارضایتی غذایی',
          text: 'اگر مشتری از کیفیت یا طعم غذا نارضایتی داشت، اقدام فوری تیم رستوران چیست؟',
          options: [
            { text: 'تعویض فوری سفارش بدون هیچ بحثی + دسر یا نوشیدنی هدیه مهمان رستوران', value: 'instant_remake_gift', icon: 'HeartHandshake', badge: 'تعویض آنی + هدیه' },
            { text: 'پاسخگویی محترمانه مدیر سالن و ثبت سلیقه مشتری برای سفارش‌های آینده', value: 'manager_table_care', icon: 'CheckCircle', badge: 'رسیدگی مدیر سالن' }
          ]
        }
      ];
    }

    return [
      {
        id: 'p8_thought_leadership',
        step: 0,
        title: 'هویت حسی و بازاریابی محتوایی کافه',
        text: 'برای تبدیل کافه/رستوران به پاتوق همیشگی، کانون اصلی دیده‌شدن برند کجاست؟',
        options: [
          { text: 'اشتراک‌گذاری ویدیوهای جذاب از پشت صحنه دم‌آوری قهوه، رسپی‌ها و باریستاها', value: 'behind_bar_coffee_craft', icon: 'Coffee', badge: 'هنر باریستا' },
          { text: 'حضور فعال در پلتفرم‌های امتیازدهی و نقشه (گوگل مپ، نشان) با پاسخگویی به تک‌تک نظرات', value: 'active_review_management', icon: 'Star', badge: 'مدیریت نظرات' },
          { text: 'میزبانی رویدادهای دنج فرهنگی، کارگاه‌های چشایی (کاپینگ قهوه) یا ورک‌شاپ‌های کاری', value: 'cupping_events_hosting', icon: 'Users', badge: 'رویداد و ایونت' }
        ]
      },
      {
        id: 'p8_pr_podcast_channels',
        step: 1,
        title: 'شراکت‌ها و بازاریابی همسایگی',
        text: 'کدام کانال برای معرفی کافه شما بیشترین تاثیر را خواهد داشت؟',
        options: [
          { text: 'همکاری با فودبلاگرهای خوش‌نام و اصیل که نقد صادقانه منتشر می‌کنند', value: 'authentic_food_bloggers', icon: 'Camera', badge: 'بلاگرهای اصیل' },
          { text: 'پکیج‌های صبحانه و قهوه عصرانه برای شرکت‌ها و دفاتر همسایه با تخفیف روزانه', value: 'corporate_neighbors_package', icon: 'Briefcase', badge: 'بسته‌های اداری' },
          { text: 'سیستم وفاداری دیجیتال بر پایه شماره موبایل بدون نیاز به کارت پلاستیکی', value: 'sms_loyalty_club', icon: 'Zap', badge: 'باشگاه دیجیتال' }
        ]
      },
      {
        id: 'p8_lead_funnel',
        step: 2,
        title: 'توسعه سبد درآمدی کافه',
        text: 'درآمدزایی فراتر از قهوه روزمره چگونه تقویت می‌شود؟',
        options: [
          { text: 'فروش بسته‌های دانه قهوه رست‌شده اختصاصی با برند خود کافه به مشتریان خانگی', value: 'packaged_beans_retail', icon: 'Box', badge: 'فروش دانه برند' },
          { text: 'ترکیب شیرینی و کیک‌های دست‌ساز اختصاصی با حاشیه سود بالا', value: 'pastry_pairing_high_margin', icon: 'Sparkles', badge: 'پییرینگ کیک' },
          { text: 'ارسال سریع بیرون‌بر با بسته‌بندی ویژه از طریق اسنپ‌فود و سفارش تلفنی مستقیم', value: 'optimized_takeaway_delivery', icon: 'Truck', badge: 'بیرون‌بر بهینه' }
        ]
      },
      {
        id: 'p8_crisis_reputation',
        step: 3,
        title: 'پروتکل برخورد با نارضایتی غذایی',
        text: 'اگر مشتری از طعم نوشیدنی یا غذای خود رضایت نداشت، اقدام فوری تیم چیست؟',
        options: [
          { text: 'تعویض فوری سفارش بدون هیچ بحثی + نوشیدنی یا دسر هدیه مهمان کافه', value: 'instant_remake_gift', icon: 'HeartHandshake', badge: 'تعویض آنی + هدیه' },
          { text: 'پاسخگویی محترمانه مدیر سالن و ثبت سلیقه مشتری برای سفارش‌های آینده', value: 'manager_table_care', icon: 'CheckCircle', badge: 'رسیدگی مدیر سالن' }
        ]
      }
    ];
  }

  // DEFAULT / PROFESSIONAL / EXECUTIVE ACTIVATION
  return [
    {
      id: 'p8_thought_leadership',
      step: 0,
      title: 'ستون رهبری فکری و زاویه دید اختصاصی',
      text: 'ستون اصلی رهبری فکری و تمایز کارشناسی شما در مقالات، لینکدین و گفتگوها روی چه موضوعی است؟',
      options: [
        { text: 'نقد رویکردهای سنتی ناکارآمد و معرفی فریم‌ورک‌های عملیاتی اثبات‌شده', value: 'operational_frameworks', icon: 'TrendingUp', badge: 'فریم‌ورک‌های عملیاتی' },
        { text: 'تحلیل روندهای تحول بازار، اشتباهات رایج کارآفرینان و تصمیمات راهبردی', value: 'industry_disruption', icon: 'BookOpen', badge: 'تحلیل روندهای آینده' },
        { text: 'روایت درس‌آموخته‌های پشت صحنه پروژه‌ها و حل تعارضات ساختاری واقعی', value: 'behind_the_scenes', icon: 'Compass', badge: 'پشت صحنه واقعی' }
      ]
    },
    {
      id: 'p8_pr_podcast_channels',
      step: 1,
      title: 'نقشه حضور در رسانه‌ها، پادکست‌ها و رویدادها',
      text: 'حضور در رسانه‌ها و پادکست‌ها چگونه اعتبار و قدرت برند شما را شتاب می‌دهد؟',
      options: [
        { text: 'حضور به عنوان کارشناس مهمان در پادکست‌های تراز اول کسب‌وکار و تخصصی', value: 'top_tier_podcasts', icon: 'Mic', badge: 'مهمان پادکست' },
        { text: 'انتشار یادداشت‌های تحلیلی و کیس‌استادی‌های عمیق در لینکدین و رسانه‌های تخصصی', value: 'op_eds_pr', icon: 'FileText', badge: 'یادداشت‌های تحلیلی' },
        { text: 'سخنرانی در رویدادها، همایش‌های صنعتی و شبکه‌سازی رو در رو با تصمیم‌گیرندگان', value: 'keynote_speaking', icon: 'Award', badge: 'سخنرانی تخصصی' }
      ]
    },
    {
      id: 'p8_lead_funnel',
      step: 2,
      title: 'ساختار قیف تجاری و تبدیل نفوذ به درآمد',
      text: 'این حجم از نفوذ و اعتبار چگونه مستقیماً به قراردادهای کاری، مشاوره یا سفارش ختم می‌شود؟',
      options: [
        { text: 'مسیر مشاوره یا پروژه اختصاصی با فرم ارزیابی اولیه و فیلتر کارفرمایان مناسب', value: 'high_ticket_consulting', icon: 'Target', badge: 'مشاوره های‌تیکت' },
        { text: 'پکیج‌های دوره‌ای همراهی، قراردادهای ریتاینر سازمانی یا محصولات دانشی', value: 'knowledge_community', icon: 'Layers', badge: 'قراردادهای مستمر' },
        { text: 'معرفی خدمات و ظرفیت شرکت یا کارخانه از طریق اعتبار و پرستیژ شخصی بنیان‌گذار', value: 'corporate_funnel', icon: 'Briefcase', badge: 'رشد کسب‌وکار مادر' }
      ]
    },
    {
      id: 'p8_crisis_reputation',
      step: 3,
      title: 'پلی‌بوک حل بحران و صیانت از اعتبار',
      text: 'در صورت بروز حواشی منفی، نقد رقبا یا نارضایتی در یک پروژه، موضع تخلف‌ناپذیر شما چیست؟',
      options: [
        { text: 'پاسخگویی سریع، متین و مستند به شواهد عینی، بدون ورود به حواشی بی‌ارزش', value: 'evidence_calm', icon: 'Shield', badge: 'آرامش و مستندات' },
        { text: 'شفافیت کامل، پذیرش نقدهای واقعی و جبران فوری با گزارش اصلاحات انجام‌شده', value: 'radical_transparency', icon: 'HeartHandshake', badge: 'شفافیت رادیکال' }
      ]
    }
  ];
}

// ============================================================================
// BACKWARD COMPATIBILITY EXPORT (STATIC PREVIEWS)
// ============================================================================
export const P3_QUESTIONS = getPhase3Questions('PROFESSIONAL_SERVICE');
export const P4_QUESTIONS = getPhase4Questions('PROFESSIONAL_SERVICE');
export const P5_QUESTIONS = getPhase5Questions('PROFESSIONAL_SERVICE');
export const P6_QUESTIONS = getPhase6Questions('PROFESSIONAL_SERVICE');
export const P7_QUESTIONS = getPhase7Questions('PROFESSIONAL_SERVICE');
export const P8_QUESTIONS = getPhase8Questions('PROFESSIONAL_SERVICE');

export const ALL_PHASES_QUESTIONS = {
  1: P1_QUESTIONS,
  2: getPhase2Questions('PROFESSIONAL_SERVICE'),
  3: P3_QUESTIONS,
  4: P4_QUESTIONS,
  5: P5_QUESTIONS,
  6: P6_QUESTIONS,
  7: P7_QUESTIONS,
  8: P8_QUESTIONS
};
