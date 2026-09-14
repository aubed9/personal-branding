import { INITIAL_QUESTIONS as P1_QUESTIONS } from './phase1Templates.js';
import { getAdaptivePhase2Questions, PHASE2_QUESTIONS } from './phase2Templates.js';

// ============================================================================
// DYNAMIC ADAPTIVE QUESTION ENGINE (PHASES 2 TO 8)
// Adapts terminology, pain points, options, and metrics based on Business Archetype
// ============================================================================

export function getAdaptedPhaseQuestions(phaseNum, context = null) {
  const p = parseInt(phaseNum, 10);
  if (p === 1) return P1_QUESTIONS;

  const arch = context ? context.archetype : 'PROFESSIONAL_SERVICE';

  switch (p) {
    case 2:
      return getPhase2Questions(arch);
    case 3:
      return getPhase3Questions(arch);
    case 4:
      return getPhase4Questions(arch);
    case 5:
      return getPhase5Questions(arch);
    case 6:
      return getPhase6Questions(arch);
    case 7:
      return getPhase7Questions(arch);
    case 8:
      return getPhase8Questions(arch);
    default:
      return P3_QUESTIONS;
  }
}

// ----------------------------------------------------------------------------
// PHASE 2: RESEARCH & MARKET INTELLIGENCE
// ----------------------------------------------------------------------------
function getPhase2Questions(arch) {
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
          { text: 'نرم‌افزارهای سنتی دسکتاپ قدیمی، سنگین و پر از باگ', value: 'legacy_desktop', icon: 'Code', badge: 'سیستم‌های قدیمی' },
          { text: 'اکسل‌های دستی و فرم‌های کاغذی پراشتباه و پراکنده', value: 'excel_manual', icon: 'FileText', badge: 'روش دستی' },
          { text: 'نرم‌افزارهای خارجی کرک‌شده بدون پشتیبانی و انطباق با قوانین ایران', value: 'cracked_foreign', icon: 'Globe', badge: 'کرک خارجی' },
          { text: 'پلتفرم‌های ابری موجود با پشتیبانی ضعیف و رابط کاربری سخت', value: 'existing_cloud_poor_ux', icon: 'Layers', badge: 'رقبای ابری' }
        ]
      },
      {
        id: 'p2_step1_customer_pain',
        step: 1,
        title: 'بزرگ‌ترین درد و مانع کاربر نرم‌افزار',
        text: 'بیشترین عامل مقاومت یا شکست مشتریان در استفاده از نرم‌افزارها چیست؟',
        options: [
          { text: 'پیچیدگی بالای رابط کاربری و نیاز به روزها آموزش پرسنل', value: 'complex_ux_steep_learning', icon: 'AlertTriangle', badge: 'پیچیدگی بالا' },
          { text: 'نگرانی شدید از امنیت داده‌ها، قطعی سرور و از دست رفتن اسناد', value: 'data_security_uptime', icon: 'ShieldAlert', badge: 'امنیت و پایداری' },
          { text: 'سختی انتقال داده‌ها از سیستم‌های قبلی به سامانه جدید', value: 'migration_friction', icon: 'RefreshCw', badge: 'مهاجرت داده' },
          { text: 'پشتیبانی کند و بی‌حوصله در لحظات حساس کاری و مالیاتی', value: 'slow_support_tickets', icon: 'UserX', badge: 'پشتیبانی ضعیف' }
        ]
      },
      {
        id: 'p2_step2_pricing_models',
        step: 2,
        title: 'مدل قیمت‌گذاری اشتراک نرم‌افزار',
        text: 'بهترین مدل درآمدی برای جذب و حفظ کاربران کسب‌وکاری شما چیست؟',
        options: [
          { text: 'دوره تست رایگان (Free Trial) ۱۴ روزه و سپس اشتراک ماهانه/سالانه', value: 'free_trial_recurring', icon: 'Repeat', badge: 'تست رایگان + اشتراک' },
          { text: 'مدل پایه رایگان (Freemium) با امکان ارتقا برای قابلیت‌های پیشرفته', value: 'freemium_tier', icon: 'TrendingUp', badge: 'فری‌میوم' },
          { text: 'قیمت‌گذاری بر اساس مصرف یا تعداد کاربران همزمان (Seat/Usage)', value: 'per_seat_usage', icon: 'Users', badge: 'پرداخت به میزان مصرف' },
          { text: 'نسخه سازمانی اختصاصی با پشتیبانی VIP و SLA رسمی', value: 'enterprise_custom', icon: 'Building', badge: 'سازمانی Enterprise' }
        ]
      },
      {
        id: 'p2_step4_golden_opportunity',
        step: 3,
        title: 'فرصت طلایی رشد نرم‌افزار ابری',
        text: 'چه مزیتی نرم‌افزار شما را به انتخاب قطعی بازار تبدیل می‌کند؟',
        options: [
          { text: 'شروع کار در ۳ دقیقه بدون نیاز به آموزش و پیچیدگی (Instant Value)', value: 'instant_time_to_value', icon: 'Zap', badge: 'شروع آنی' },
          { text: 'پشتیبانی چت آنلاین زیر ۳ دقیقه و مشاوره گام‌به‌گام استقرار', value: 'lightning_support', icon: 'HeartHandshake', badge: 'پشتیبانی رعدآسا' },
          { text: 'اتصال خودکار به درگاه‌ها، سامانه مودیان و سیستم‌های بانکی ایران', value: 'iran_integrations', icon: 'CheckCircle', badge: 'یکپارچگی بومی' },
          { text: 'تولید محتوا و آموزش‌های کاربردی در حل دغدغه‌های روزمره مدیران', value: 'content_product_led', icon: 'BookOpen', badge: 'رشد محتوا‌محور' }
        ]
      }
    ];
  }

  if (arch === 'MANUFACTURER') {
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
          { text: 'نبود گواهینامه‌های رسمی تست متالورژی و استانداردهای صنعتی', value: 'missing_certifications', icon: 'FileX', badge: 'فقدان تاییدیه' }
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
        { text: 'فراخوان شجاعانه به اقدام و تجربه تمیزی/خدمت (Action-Driven)', value: 'action_call', icon: 'Zap', badge: 'فراخوان عمل' },
        { text: 'بیان صریح منفعت بزرگ و آرامش مشتری (Benefit-Driven)', value: 'clear_benefit', icon: 'Check', badge: 'منفعت‌محور' },
        { text: 'یک بینش عمیق پیرامون احترام به مشتری و استانداردهای زندگی', value: 'vision_respect', icon: 'Compass', badge: 'چشم‌انداز و احترام' }
      ]
    }
  ];
}

// ----------------------------------------------------------------------------
// PHASE 7: VISUAL IDENTITY DESIGN SYSTEM
// ----------------------------------------------------------------------------
function getPhase7Questions(arch) {
  let paletteOptions = [
    { text: 'سرمه‌ای درباری + طلایی یا سفید (نهایت پرستیژ، اعتماد عمیق و اصالت)', value: 'navy_gold', icon: 'Shield', badge: 'باوقار و مطمئن' },
    { text: 'آبی کبالت نئونی + مشکی مات (فناوری مدرن، سرعت، چابکی و هوشمندی)', value: 'cobalt_black', icon: 'Zap', badge: 'مدرن و پیشرفته' },
    { text: 'سبز زمردی + خاکستری گرم (طبیعت، سرزندگی، آرامش خاطر و رشد)', value: 'emerald_warm_gray', icon: 'Leaf', badge: 'طبیعی و سلامت' },
    { text: 'زرشکی گرم / کهربایی + زغال سنگی (صمیمیت، انرژی گرم، اشتها و نشاط)', value: 'amber_charcoal', icon: 'Flame', badge: 'گرم و پویا' }
  ];

  if (arch === 'LOCAL_SERVICE') {
    paletteOptions = [
      { text: 'آبی اقیانوسی + زرد صنعتی (تداعی‌گر پاکیزگی آب، درخشش و دقت فنی خودرو)', value: 'ocean_yellow_service', icon: 'Shield', badge: 'پاکیزگی و دقت' },
      { text: 'مشکی کربن مات + قرمز آتشین (جسارت، سرعت بالا و قدرت اتومبیل)', value: 'carbon_red_sport', icon: 'Flame', badge: 'انرژی و سرعت' },
      { text: 'سرمه‌ای عمیق + سفید یخچالی (اعتماد، تمیزی مطلق و انضباط کاری)', value: 'navy_ice_clean', icon: 'Zap', badge: 'اعتماد و تمیزی' }
    ];
  } else if (arch === 'RESTAURANT_CAFE_HOSPITALITY') {
    paletteOptions = [
      { text: 'قهوه‌ای اسپرسو + بژ کرمی و خاکی (حس بویایی قهوه تازه، گرما و دنج بودن)', value: 'espresso_cream_cafe', icon: 'Coffee', badge: 'دنج و گرمابخش' },
      { text: 'سبز زیتونی ملایم + چوب طبیعی (اصالت گیاهی، آرامش و کیفیت تازه)', value: 'olive_wood_nature', icon: 'Leaf', badge: 'ارگانیک و تازه' },
      { text: 'مشکی مات + طلایی مینیمال (فضای مدرن، شیک، شبانه و اسپشالتی)', value: 'black_gold_night', icon: 'Sparkles', badge: 'لوکس و مدرن' }
    ];
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
function getPhase8Questions(arch) {
  if (arch === 'LOCAL_SERVICE' || arch === 'LOCAL_RETAIL' || arch === 'PHYSICAL_RETAIL' || arch === 'RETAIL') {
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

  if (arch === 'RESTAURANT_CAFE_HOSPITALITY') {
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
