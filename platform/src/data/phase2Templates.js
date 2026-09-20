// DIGITAL MARKET — Phase 2: Market & Customer Intelligence Templates
// Provides dynamic sector-specific question branching and sector-adapted options
// for Automotive Technical Services, Hospitality/Cafes, Heavy Manufacturing, B2B SaaS, and Personal Brands.
import { isAutomotiveService } from './businessDomain.js';

export const PHASE2_QUESTIONS = [
  {
    id: "p2_step0_competitors",
    step: 0,
    title: "شناسایی رقبای مستقیم و جایگزین‌ها",
    text: "به **فاز ۲: هوش بازار و پژوهش مشتری** خوش آمدید! 🔍\n\nدر این فاز فرضیات ثبت‌شده در فاز ۱ را با واقعیت‌های عینی بازار می‌سنجیم.\n\nاولین سوال: در حوزه فعالیت شما، مشتریان در حال حاضر نیاز خود را چگونه رفع می‌کنند و مهم‌ترین رقبای شما چه کسانی هستند؟",
    options: [
      { text: "فروشگاه‌ها، کارگاه‌ها یا ارائه‌دهندگان محلی و سنتی بازار", value: "traditional_local_competitors", icon: "Users", badge: "رقبای سنتی محلی" },
      { text: "شرکت‌ها و کارخانجات بزرگ با ساختارهای سنگین و صلب", value: "big_rigid_enterprises", icon: "Building", badge: "رقبای بزرگ شرکتی" },
      { text: "پلتفرم‌های تخصصی، محصولات ابری و راهکارهای آنلاین مدرن", value: "digital_cloud_competitors", icon: "Code", badge: "رقبای مدرن / آنلاین" },
      { text: "حل دستی و سنتی مسئله توسط خود مشتری یا به تعویق انداختن نیاز", value: "diy_delay_substitutes", icon: "HelpCircle", badge: "جایگزین‌های سنتی" }
    ]
  },
  {
    id: "p2_step1_customer_pain",
    step: 1,
    title: "شناسایی اصلی‌ترین درد و اصطکاک مشتری",
    text: "بر اساس بازخوردها یا مشاهدات شما، بیشترین شکایت و نارضایتی مشتریان از رقبای فعلی یا خدمات موجود در بازار چیست؟",
    options: [
      { text: "کیفیت نوسانی، عدم انطباق استانداردها و ترس از خسارت یا افت عملکرد", value: "quality_deviation_fear", icon: "AlertTriangle", badge: "کیفیت و اصالت" },
      { text: "هزینه‌های پنهان، عدم شفافیت فاکتور و قیمت‌های غافلگیرکننده", value: "hidden_costs_unclear_prices", icon: "DollarSign", badge: "شفافیت مالی" },
      { text: "اتلاف وقت شدید، بدقولی در زمان تحویل و فرآیندهای فرسایشی", value: "lead_time_delays", icon: "Clock", badge: "سرعت و زمان‌بندی" },
      { text: "پشتیبانی ضعیف، پاسخگو نبودن پس از فروش و فقدان ضمانت رسمی", value: "poor_support_no_warranty", icon: "UserX", badge: "پشتیبانی و ضمانت" }
    ]
  },
  {
    id: "p2_step2_pricing_models",
    step: 2,
    title: "تحلیل بازه قیمتی و رفتار خرید",
    text: "در بازار هدف شما، مشتریان عموماً چه بازه قیمتی و الگوی پرداختی را برای این خدمات/محصولات به‌راحتی می‌پذیرند؟",
    options: [
      { text: "تعرفه استاندارد و شفاف متناسب با میانگین بازار با صدور فاکتور رسمی", value: "transparent_standard", icon: "CheckCircle", badge: "تعرفه استاندارد" },
      { text: "پکیج‌های جامع خدمات دوره‌ای یا سبد کالای اقتصادی با تخفیف تجمیعی", value: "bundled_volume_packages", icon: "Layers", badge: "پکیج و دوره" },
      { text: "پریمیوم و تخصصی VIP با تضمین بالاترین درجه کیفیت و گارانتی", value: "premium_exclusive", icon: "Crown", badge: "پریمیوم / VIP" },
      { text: "مدل اشتراکی ماهانه / شارژ دوره‌ای یا تسویه اعتباری قراردادی", value: "subscription_credit_terms", icon: "Repeat", badge: "اشتراکی / اعتباری" }
    ]
  },
  {
    id: "p2_step3_primary_channel",
    step: 3,
    title: "شناسایی موثرترین کانال کشف و ارتباط",
    text: "مشتریان هدف شما بیشتر در کدام کانال‌ها حضور دارند و تصمیم خرید آن‌ها کجا شکل می‌گیرد؟",
    options: [
      { text: "اپلیکیشن‌های نقشه، موقعیت محلی و ثبت جستجوی منطقه‌ای (گوگل‌مپ، نشان، بلد)", value: "local_maps_geography", icon: "MapPin", badge: "نقشه‌های محلی" },
      { text: "جلسات فنی حضوری، شبکه‌سازی سازمانی و حضور در وندورلیست‌ها/مناقصات B2B", value: "b2b_direct_procurement", icon: "Briefcase", badge: "ارتباط مستقیم B2B" },
      { text: "جستجوی ارگانیک گوگل، سئوی وب‌سایت و مقالات تخصصی حل مسئله", value: "google_search_seo", icon: "Search", badge: "سئو و جستجو" },
      { text: "معرفی دهان‌به‌دهان مشتریان وفادار، ارجاع همکاران صنفی و شبکه‌های اجتماعی", value: "referral_social_media", icon: "Share2", badge: "توصیه و شبکه‌ها" }
    ]
  },
  {
    id: "p2_step4_golden_opportunity",
    step: 4,
    title: "کشف فرصت طلایی بازار (Opportunity Gap)",
    text: "کدام «فرصت کشف‌نشده» در بازار وجود دارد که تمرکز روی آن، برند شما را کاملاً متمایز و بی‌رقیب می‌کند؟",
    options: [
      { text: "ارائه گارانتی کتبی قطعی و پذیرش مسئولیت جبران خسارت (ریسک صفر)", value: "guarantee_risk_reversal", icon: "ShieldCheck", badge: "کاهش ریسک ۱۰۰٪" },
      { text: "سرعت عمل بی‌نظیر در تحویل، کاهش چشمگیر معطلی و پاسخگویی آنی", value: "speed_rapid_delivery", icon: "Zap", badge: "سرعت و چابکی" },
      { text: "ساده‌سازی شفاف فرآیندها، حذف اصطلاحات پیچیده و شفافیت کامل در هزینه‌ها", value: "radical_simplicity_transparency", icon: "Sparkles", badge: "شفافیت و سادگی" },
      { text: "همراهی اختصاصی، مشاوره عمیق فنی و پشتیبانی متعهدانه در طول مسیر", value: "dedicated_technical_support", icon: "HeartHandshake", badge: "همراهی متعهدانه" }
    ]
  }
];

// Dynamic Sector-Specific Branching Engine for Phase 2
export function getAdaptivePhase2Questions(context) {
  if (!context || !context.archetype) {
    return PHASE2_QUESTIONS;
  }

  const arch = context.archetype;
  const overlays = context.activeOverlays || [];

  const isAutomotive = isAutomotiveService(context);

  // 1. Local Automotive & Technical Services (Car Wash, Detailing, Oil Change, Auto Repair)
  if (arch === "LOCAL_SERVICE" && isAutomotive) {
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: "تحلیل رقبای خدمات خودرویی و فنی محلی",
        text: "به **فاز ۲: هوش بازار و تحلیل محیط رقابتی (خدمات فنی و خودرویی)** خوش آمدید! 🔍\n\nدر منطقه فعالیت شما، مشتریان در حال حاضر خدمات خودرویی خود را از چه مراکزی دریافت می‌کنند و مهم‌ترین رقبای شما چه کسانی هستند؟",
        options: [
          { text: "کارواش‌ها، اتوسرویس‌ها و تعمیرگاه‌های سنتی محلی بدون استاندارد شفاف و فاکتور رسمی", value: "traditional_garages", icon: "Users", badge: "رقبای سنتی محلی" },
          { text: "نمایندگی‌های مجاز و شرکتی با هزینه‌های بسیار سنگین، نوبت‌دهی کند و معطلی بالا", value: "dealership_service_centers", icon: "Building", badge: "نمایندگی‌های شرکتی" },
          { text: "رانندگان شخصاً دست‌به‌کار می‌شوند یا انجام سرویس را تا لحظه خرابی کامل به تعویق می‌اندازند", value: "driver_delay_risk", icon: "HelpCircle", badge: "تعویق و فرار از هزینه" },
          { text: "مراکز مدرن زنجیره‌ای جدید با تبلیغات فراوان اما پرسنل کم‌تجربه و کیفیت ناپایدار", value: "chain_auto_shops", icon: "Compass", badge: "مراکز زنجیره‌ای جدید" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین ترس و نارضایتی مالکان خودرو",
        text: "بر اساس تجارب و مشاهدات شما، مالکان خودرو بیشترین ترس و شکایت را از کدام رفتارهای سرویس‌کاران فعلی دارند؟",
        options: [
          { text: "ترس از روغن تقلبی و فیلتر بی‌کیفیت، خط و خش روی رنگ بدنه و آسیب به قطعات حساس خودرو", value: "counterfeit_oil_swirls_damage", icon: "AlertTriangle", badge: "ترس از روغن تقلبی و خسارت" },
          { text: "نبود شفافیت قیمت، عدم اعلام هزینه قبل از شروع کار و صدور فاکتورهای غافلگیرکننده", value: "opaque_pricing_surprise_invoices", icon: "DollarSign", badge: "عدم شفافیت قیمت" },
          { text: "اتلاف وقت فراوان، معطلی در صف‌های طولانی و بدقولی در ساعت تحویل خودرو به مالک", value: "wasted_waiting_time", icon: "Clock", badge: "معطلی و اتلاف وقت" },
          { text: "برخورد غیرحرفه‌ای، فضای انتظار نامناسب و نبود ضمانت کتبی برای کار انجام‌شده", value: "unfriendly_no_written_warranty", icon: "UserX", badge: "نبود گارانتی رسمی" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل بازه قیمتی و الگوی پذیرش هزینه مشتریان خودرو",
        text: "در میان رانندگان و مالکان خودرو در این منطقه، کدام ساختار قیمتی بیشترین استقبال و اعتماد را ایجاد می‌کند؟",
        options: [
          { text: "تعرفه ثابت و شفاف مصوب با صدور فاکتور رسمی و ضمانت ۱۰۰٪ اصالت اقلام مصرفی", value: "transparent_official_invoice", icon: "CheckCircle", badge: "فاکتور شفاف مصوب" },
          { text: "پکیج‌های دوره‌ای تجمیعی (سرویس ۱۰ گانه دوره‌ای، نانوسرامیک کامل، تعویض روغن + شستشو)", value: "periodic_bundled_packages", icon: "Layers", badge: "پکیج‌های تجمیعی دوره‌ای" },
          { text: "تعرفه اقتصادی رقابتی برای جلب رانندگان گذری، خودروهای عمومی و ناوگان‌ها", value: "economy_fleet_discount", icon: "TrendingDown", badge: "اقتصادی و ناوگانی" },
          { text: "خدمات پریمیوم VIP با متریال خارجی گرید یک، واکس تخصصی و سالن پذیرایی اختصاصی", value: "premium_vip_detailing", icon: "Crown", badge: "پریمیوم VIP" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیر جذب مشتریان جدید و بازگشت مراجعان",
        text: "تصمیم رانندگان برای مراجعه به خدمات خودرویی شما از کدام کانال‌ها بیشترین اثرپذیری را دارد؟",
        options: [
          { text: "نقشه‌های مسیریابی محلی (نشان، بلد، گوگل مپ)، تابلوهای شهری پرتردد و پاخور خیابان اصلی", value: "local_maps_street_traffic", icon: "MapPin", badge: "نقشه محلی و تابلو" },
          { text: "معرفی دهان‌به‌دهان رانندگان راضی، معرفی تعمیرکاران همکار و توصیه آشنایان در منطقه", value: "local_word_of_mouth", icon: "Users", badge: "معرفی دهان‌به‌دهان" },
          { text: "اینستاگرام محلی با ویدیوهای مقایسه‌ای شفاف قبل و بعد (Before & After) و آموزش نگهداری", value: "instagram_before_after", icon: "Instagram", badge: "ویدیوهای قبل و بعد" },
          { text: "سامانه پیامکی هوشمند یادآوری سرویس روغن بر اساس کیلومتر طی‌شده و باشگاه مشتریان", value: "mileage_crm_sms", icon: "Search", badge: "یادآوری کیلومتری SMS" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز و پیشتازی در منطقه",
        text: "کدام اقدام راهبردی، مرکز شما را به انتخاب اول و بدون تردید رانندگان در این منطقه بدل می‌کند؟",
        options: [
          { text: "شکستن پلمپ اصالت روغن و قطعات دقیقاً در برابر چشمان مالک خودرو همراه با کارت ضمانت کتبی", value: "live_unsealing_guarantee", icon: "ShieldCheck", badge: "شکستن پلمپ در حضور مشتری" },
          { text: "تضمین تحویل در زمان مشخص (مثلاً تعویض روغن زیر ۲۰ دقیقه) [هدف عملیاتی] همراه با سالن انتظار مدرن و تمیز", value: "speed_guarantee_modern_lounge", icon: "Zap", badge: "سرعت تضمینی + سالن مدرن" },
          { text: "ارائه چک‌لیست رایگان بازرسی ۱۰ نقطه‌ای سلامت فنی خودرو در هر نوبت مراجعه", value: "free_10point_inspection", icon: "CheckCircle", badge: "چک‌لیست رایگان سلامت" },
          { text: "طرح اشتراک فصلی نگهداری خودرو با تخفیف شستشو و تعویض رایگان مایعات ضروری", value: "seasonal_maintenance_subscription", icon: "Sparkles", badge: "اشتراک نگهداری فصلی" }
        ]
      }
    ];
  }

  // 1B. Local Building, Facility & Technical Maintenance Services (Locksmith, Plumbing, Elevator, Facility Care)
  const isBeautyLocal =
    arch === "HEALTH_BEAUTY_WELLNESS" ||
    context.industryCode === "IND-04" ||
    context.industryId === "IND-04" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("زیبایی") || context.taxonomyTitleFa.includes("آرایش") || context.taxonomyTitleFa.includes("پوست") || context.taxonomyTitleFa.includes("کلینیک") || context.taxonomyTitleFa.includes("سالن"))) ||
    overlays.includes("HEALTHCARE_COMPLIANCE");

  if (arch === "LOCAL_SERVICE" && !isAutomotive && !isBeautyLocal) {
    const tradeName = context.taxonomyTitleFa || "خدمات فنی و ساختمانی محلی";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل فضای رقابتی در صنف ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و تحلیل محیط رقابتی (${tradeName})** خوش آمدید! 🔍\n\nدر محدوده فعالیت شما، مشتریان و ساکنان در حال حاضر این خدمات را از چه منابعی دریافت می‌کنند؟`,
        options: [
          { text: "سرویس‌کاران سنتی و تجربی محلی بدون گواهینامه معتبر، نرخ شفاف و فاکتور رسمی", value: "traditional_local_handymen", icon: "Users", badge: "سرویس‌کاران سنتی محلی" },
          { text: "اپلیکیشن‌ها و واسطه‌های آنلاین خدماتی با پورسانت‌های بالا و اعزام افراد ناآشنا", value: "online_aggregator_apps", icon: "Building", badge: "واسطه‌های آنلاین" },
          { text: "اقدام خودسرانه یا به تعویق انداختن سرویس تا زمان خرابی کامل و ایجاد خسارت سنگین", value: "delayed_maintenance_risk", icon: "HelpCircle", badge: "تعویق سرویس و ریسک" },
          { text: "شرکت‌های تخصصی بزرگ صنعتی با هزینه‌های بالا که به کارهای خرد مراجعه نمی‌کنند", value: "corporate_heavy_contractors", icon: "Compass", badge: "پیمانکاران بزرگ گران" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین ترس و نارضایتی مراجعان خدمات فنی",
        text: "مشتریان و مدیران ساختمان از کدام معضلات سرویس‌کاران فعلی بیشترین نارضایتی را دارند؟",
        options: [
          { text: "بدقولی در زمان حضور، تاخیرهای طولانی و معطل کردن مشتری در طول روز", value: "chronic_delays_broken_promises", icon: "Clock", badge: "معطلی و بدقولی" },
          { text: "استفاده از قطعات یدکی بی‌کیفیت یا نامطمئن و بازگشت مجدد نقص پس از چند روز", value: "faulty_parts_repeated_failure", icon: "AlertTriangle", badge: "خرابی مجدد قطعات" },
          { text: "قیمت‌های سلیقه‌ای و غافلگیرکننده پس از باز کردن دستگاه بدون هماهنگی قبلی", value: "opaque_inflated_pricing", icon: "DollarSign", badge: "قیمت‌های غیرشفاف" },
          { text: "کثیف‌کاری در محیط، عدم رعایت نظافت و رفتارهای غیرحرفه‌ای و فاقد ادب", value: "messy_unprofessional_conduct", icon: "UserX", badge: "برخورد و محیط نامناسب" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای قیمت‌گذاری و تسویه هزینه خدمات",
        text: "کدام ساختار تعرفه، بالاترین حس آرامش و رضایت را برای مشتریان شما ایجاد می‌کند؟",
        options: [
          { text: "تعرفه شفاف و مصوب همراه با اعلام قطعی هزینه اجرت و قطعه پیش از آغاز کار", value: "transparent_official_estimate", icon: "CheckCircle", badge: "اعلام شفاف قبل از کار" },
          { text: "قراردادهای اشتراک دوره‌ای و بازرسی منظم پیشگیرانه ساختمان با تخفیف ثابت", value: "preventative_periodic_contracts", icon: "Layers", badge: "اشتراک دوره‌ای پیشگیرانه" },
          { text: "تعرفه اقتصادی رقابتی برای کارهای جزئی و خدمات اورژانسی در محدوده محله", value: "economy_emergency_rate", icon: "TrendingDown", badge: "اقتصادی اورژانسی" },
          { text: "خدمات پریمیوم با تامین قطعات اصلی با گارانتی تعویض کتبی و پشتیبانی شبانه‌روزی", value: "premium_guaranteed_parts_service", icon: "Crown", badge: "پریمیوم با گارانتی تعویض" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی موثرترین کانال جذب مشتریان محلی و ساختمانی",
        text: "ساکنان، مالکان و مدیران ساختمان شما را از کدام کانال‌ها پیدا می‌کنند؟",
        options: [
          { text: "حضور قوی در نقشه‌های مسیریابی (نشان، بلد، گوگل مپ) و سئوی جستجوی محلی محله", value: "local_maps_search_seo", icon: "MapPin", badge: "نقشه‌های محلی و مپ" },
          { text: "معرفی دهان‌به‌دهان ساکنان راضی و توصیه‌های مدیران مجتمع‌های همسایه", value: "building_manager_word_of_mouth", icon: "Users", badge: "توصیه مدیران ساختمان" },
          { text: "برچسب‌های استاندارد تمیز با شماره تماس مستقیم و شناسه خدمت روی تاسیسات", value: "equipment_service_stickers", icon: "Search", badge: "برچسب استاندارد تاسیسات" },
          { text: "اینستاگرام یا پیام‌رسان‌های محلی با ویدیوهای آموزشی پیشگیری از خرابی", value: "educational_local_content", icon: "Instagram", badge: "ویدیوهای آموزشی پیشگیری" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز و تبدیل شدن به مرجع خدمات فنی",
        text: "کدام تعهد حرفه‌ای، مرکز شما را به شماره تلفن اول و مطمئن اهالی منطقه تبدیل می‌کند؟",
        options: [
          { text: "تضمین کتبی کیفیت کار با تعهد رفع عیب مجدد رایگان تا ۶ ماه [فرضیه استراتژیک]", value: "six_month_free_rework_warranty", icon: "ShieldCheck", badge: "گارانتی ۶ ماهه رفع عیب" },
          { text: "تعهد حضور سریع در محل کارفرما در کمتر از ۴۵ دقیقه برای خدمات اضطراری [هدف عملیاتی]", value: "rapid_45min_dispatch", icon: "Zap", badge: "اعزام زیر ۴۵ دقیقه" },
          { text: "ارائه فاکتور رسمی دقیق با تفکیک اجرت، شناسه اصالت قطعات و مهر معتبر", value: "itemized_official_invoicing", icon: "FileText", badge: "فاکتور رسمی تفکیک‌شده" },
          { text: "بسته‌بندی و تحویل کامل داغی قطعات فرسوده به مشتری همراه با تست سلامت قطعه جدید", value: "transparent_parts_return_testing", icon: "HeartHandshake", badge: "تحویل قطعات فرسوده و تست" }
        ]
      }
    ];
  }

  // 2. Specialty Coffee Roastery & Cafe Hospitality
  const isSpecialtyCafe =
    (context.industryCode === "IND-03" || context.industryId === "IND-03" || arch === "RESTAURANT_CAFE_HOSPITALITY") &&
    (context.taxonomyId === "BT-0066" ||
     context.taxonomyId === "BT-0067" ||
     (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("کافه") || context.taxonomyTitleFa.includes("قهوه") || context.taxonomyTitleFa.includes("رستری"))) ||
     (context.archetypeTitle && (context.archetypeTitle.includes("کافه") || context.archetypeTitle.includes("قهوه") || context.archetypeTitle.includes("رستری"))) ||
     (context.keywords && (context.keywords.includes("قهوه") || context.keywords.includes("رستری"))));

  const isDiningRestaurant =
    arch === "RESTAURANT_CAFE_HOSPITALITY" ||
    context.industryCode === "IND-03" ||
    context.industryId === "IND-03" ||
    overlays.includes("FOOD_SAFETY_REGULATION") ||
    (context.archetypeTitle && (context.archetypeTitle.includes("رستوران") || context.archetypeTitle.includes("غذا") || context.archetypeTitle.includes("پذیرایی")));

  if (isSpecialtyCafe) {
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: "تحلیل محیط رقابتی کافه، رستری و نوشیدنی تخصصی",
        text: "به **فاز ۲: هوش بازار و رفتار مشتریان کافه و رستری** خوش آمدید! 🔍\n\nعلاقه‌مندان به قهوه و مشتریان کافه‌ها در این منطقه، نیاز و سلیقه خود را با کدام گزینه‌ها تامین می‌کنند؟",
        options: [
          { text: "کافه‌های تجاری سنتی و شلوغ با دانه‌های روبوستای تیره، طعم‌های تلخ سوخته و اتمسفر پرسروصدا", value: "commercial_dark_roast_cafes", icon: "Building", badge: "کافه‌های تجاری سنتی" },
          { text: "رستری‌ها و آنلاین‌شاپ‌های برند دانه قهوه با تمرکز بر فروش عمده و اینترنتی بسته دانه", value: "online_wholesale_roasters", icon: "ShoppingBag", badge: "رستری‌های اینترنتی" },
          { text: "قهوه‌های فوری تجاری یا آماده‌سازی‌های خانگی غیراصولی با تجهیزات ابتدایی", value: "instant_grocery_coffee", icon: "HelpCircle", badge: "قهوه‌های فوری و خانگی" },
          { text: "کافه‌های موج سوم نوساز و رقابت فشرده بر سر طراحی دکوراسیون و نوشیدنی‌های ترند", value: "third_wave_trend_cafes", icon: "Compass", badge: "کافه‌های موج سوم" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین نارضایتی مشتریان قهوه و کافه‌روها",
        text: "مهم‌ترین اصطکاک و دافعه‌ای که علاقه‌مندان به کافه و قهوه از گزینه‌های موجود بازار تجربه می‌کنند چیست؟",
        options: [
          { text: "کیفیت نازل و طعم زننده دانه، کهنگی قهوه و پنهان‌کاری در مشخصات خاستگاه و تاریخ رست", value: "burnt_stale_undisclosed_coffee", icon: "AlertTriangle", badge: "طعم سوخته و کهنگی دانه" },
          { text: "محیط آکنده از دود سیگار، آلودگی صوتی گوش‌خراش و نبود آرامش برای مطالعه، کار یا گفتگوی کاری", value: "smoky_noisy_chaotic_space", icon: "UserX", badge: "فضای دودزده و پرسروصدا" },
          { text: "سرویس‌دهی کند، برخورد متکبرانه یا غیرحرفه‌ای باریستاها و عدم راهنمایی برای انتخاب دانه", value: "slow_snobbish_service", icon: "AlertTriangle", badge: "برخورد نامناسب پرسنل" },
          { text: "قیمت‌های نامتعارف و غیرمنصفانه در منو و بسته‌های دانه بدون تناسب با ارزش واقعی فنجان", value: "overpriced_low_value_cups", icon: "DollarSign", badge: "قیمت‌های غیرمنصفانه" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل رفتار پرداخت و ترکیب سبد درآمدی کافه",
        text: "الگوی درآمدی و ترکیب فروش در مدل کسب‌وکار شما چگونه بیشترین بازدهی را خلق می‌کند؟",
        options: [
          { text: "ترکیب بهینه فروش روزانه فنجانی سالن + سفارشات سریع بیرون‌بر (Takeaway) با قیمت متعادل", value: "balanced_dinein_takeaway", icon: "DollarSign", badge: "سرو سالن و بیرون‌بر" },
          { text: "فروش بسته‌های ۲۵۰ گرمی و ۱ کیلویی دانه‌های تازه‌برشت با حاشیه سود بالا و ارزش سبد مناسب", value: "retail_bean_packs", icon: "Box", badge: "فروش بسته دانه تخصصی" },
          { text: "اشتراک ماهانه تحویل دانه تازه درب منازل و تامین مستمر قهوه شرکت‌ها و دفاتر کار", value: "b2b_home_coffee_subscription", icon: "Repeat", badge: "اشتراک ماهانه دانه" },
          { text: "بار تخصصی دم‌آوری دمی دستی (Manual Brew) و دانه‌های سینگل اوریجین گرید ۸۵+ با قیمت پریمیوم", value: "premium_manual_brew_bar", icon: "Crown", badge: "بار تخصصی سینگل‌اوریجین" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی موثرترین کانال کشف کافه و فروش دانه",
        text: "مشتریان وفادار کافه و خریداران دانه‌های تخصصی شما از کدام مسیرها جذب می‌شوند؟",
        options: [
          { text: "موقعیت فیزیکی ممتاز، پاخور بالا، نمای بیرونی گیرا و اتمسفر بصری دعوت‌کننده خیابان", value: "prime_foot_traffic_facade", icon: "MapPin", badge: "پاخور فیزیکی و نما" },
          { text: "اینستاگرام با محتوای اصیل هنری، معرفی مزارع قهوه، ویدیوهای تخصصی عصاره‌گیری و حس فضا", value: "sensory_curated_instagram", icon: "Instagram", badge: "اینستاگرام حسی و تخصصی" },
          { text: "رویدادهای هفتگی کاپینگ، تست طعم قهوه‌های جهان و میزبانی از جامعه قهوه‌دوستان منطقه", value: "weekly_cupping_community", icon: "Users", badge: "رویدادهای کاپینگ و تست" },
          { text: "وب‌سایت فروش دانه با سیستم پیشنهاد هوشمند انتخاب آسیاب بر اساس ابزار دم‌آوری مشتری", value: "smart_ecommerce_grind_selector", icon: "Search", badge: "سایت دانه با انتخاب آسیاب" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز در صنعت کافه و قهوه",
        text: "کدام پیشنهاد منحصربه‌فرد، کافه شما را به پاتوق محبوب و ماندگار با مراجعان تکراری تبدیل می‌کند؟",
        options: [
          { text: "درج شفاف تاریخ برشته‌کاری (Roast Date)، ارتفاع مزرعه و شناسنامه کامل ژنتیکی روی هر بسته [فرضیه استراتژیک]", value: "roast_date_transparency_passport", icon: "ShieldCheck", badge: "شناسنامه مزرعه و تاریخ رست" },
          { text: "اتمسفر بدون دود با تفکیک هوشمند فضاهای کاری/مطالعه آرام از سالن گپ و دورهمی دوستانه", value: "smokefree_coworking_quiet_zones", icon: "Sparkles", badge: "محیط بدون دود و آرام" },
          { text: "طراحی پروفایل‌های طعمی اختصاصی (Signature Blends) غیرقابل تقلید برای امضای کافه [هدف کیفی]", value: "signature_taste_profiles", icon: "Award", badge: "طعم‌های امضادار انحصاری" },
          { text: "آموزش گام‌به‌گام و رایگان تکنیک‌های دم‌آوری خانگی به مشتریان در ازای هر بار خرید دانه", value: "home_brewing_workshops", icon: "HeartHandshake", badge: "آموزش دم‌آوری خانگی" }
        ]
      }
    ];
  }

  if (isDiningRestaurant) {
    const tradeName = context.taxonomyTitleFa || "رستوران و غذاخوری";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل فضای رقابتی در صنف ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و رفتار مشتریان غذا و مهمان‌نوازی (${tradeName})** خوش آمدید! 🔍\n\nعلاقه‌مندان به صرف غذا و سفارشات غذایی در این منطقه، نیاز خود را با کدام گزینه‌ها تامین می‌کنند؟`,
        options: [
          { text: "رستوران‌های سنتی و چلوکبابی‌های قدیمی با منوی تکراری، دکور فرسوده و افت کیفیت", value: "legacy_traditional_kebab_restaurants", icon: "Building", badge: "رستوران‌های سنتی قدیمی" },
          { text: "فست‌فودها و کترینگ‌های زنجیره‌ای با روغن‌های چندبارمصرف و قیمت‌های اقتصادی", value: "chain_fastfood_caterings", icon: "ShoppingBag", badge: "زنجیره‌ای و کترینگ اقتصادی" },
          { text: "رستوران‌های لوکس و پرادعا با قیمت‌های نجومی و تمرکز صرف بر شوآف دکوراسیون", value: "luxury_showcase_dining", icon: "Crown", badge: "رستوران‌های لوکس گران" },
          { text: "غذاهای خانگی و تهیه غذاهای محلی بدون تاییدیه بهداشتی و بدون فضای سالن", value: "unregulated_home_kitchens", icon: "HelpCircle", badge: "تهیه غذاهای غیررسمی" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین نارضایتی مشتریان رستوران و غذاخوری",
        text: "مهم‌ترین اصطکاک و دافعه‌ای که مشتریان از رستوران‌های فعلی بازار تجربه می‌کنند چیست؟",
        options: [
          { text: "افت کیفیت گوشت و برنج، ثبات نداشتن طعم در دفعات بعدی و استفاده از مواد اولیه نامرغوب", value: "inconsistent_food_quality_stale_meat", icon: "AlertTriangle", badge: "افت کیفیت و طعم ناپایدار" },
          { text: "بهداشت نامطمئن آشپزخانه، بوی نامطبوع در سالن، ظروف کدر و عدم رعایت نظافت پرسنل", value: "unhygienic_kitchen_ambiance", icon: "UserX", badge: "بهداشت نامطمئن" },
          { text: "تاخیر زیاد در آماده‌سازی، رسیدن غذای سرد و بسته‌بندی نشتی‌دار در سفارشات ارسالی", value: "slow_fulfillment_cold_delivery", icon: "Clock", badge: "غذای سرد و تاخیر پیک" },
          { text: "قیمت‌گذاری غیرمنصفانه، حجم کم پرس غذا و فاکتورهای غافلگیرکننده با حق سرویس بالا", value: "overpriced_small_portions_fees", icon: "DollarSign", badge: "قیمت بالا و حجم اندک" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل ترکیب سبد سفارش و الگوی درآمدی رستوران",
        text: "ترکیب فروش و تعرفه‌گذاری در منوی شما چگونه بیشترین سودآوری و استقبال را به همراه دارد؟",
        options: [
          { text: "ترکیب بهینه سالن‌پذیری باکیفیت + سفارشات بیرون‌بر با بسته‌بندی عایق حرارتی اختصاصی", value: "balanced_dinein_insulated_takeaway", icon: "DollarSign", badge: "سالن و بیرون‌بر بهینه" },
          { text: "سینی‌های چندنفره خانوادگی و اقتصادی با ترکیب کباب‌ها و غذاهای محبوب و ارزش خرید بالا", value: "family_platter_value_bundles", icon: "Layers", badge: "سینی‌های اقتصادی خانواده" },
          { text: "قراردادهای تامین ناهار پرسنلی برای شرکت‌ها و سازمان‌های منطقه با تسویه اعتباری منظم", value: "corporate_catering_b2b_contracts", icon: "Repeat", badge: "کترینگ اداری B2B" },
          { text: "منوی تشریفاتی پریمیوم با گوشت تازه گوسفندی روز، برنج صددرصد ایرانی و سرو VIP", value: "premium_iranian_gourmet_menu", icon: "Crown", badge: "منوی اصیل پریمیوم VIP" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی موثرترین کانال جذب مشتریان جدید و سفارشات",
        text: "مشتریان وفادار رستوران و سفارش‌دهندگان غذا از کدام مسیرها شما را انتخاب می‌کنند؟",
        options: [
          { text: "موقعیت محلی عالی، تابلو و نمای دعوت‌کننده خیابان و عطر مطبوع غذای اصیل", value: "prime_street_location_facade", icon: "MapPin", badge: "موقعیت خیابان و نما" },
          { text: "اینستاگرام با ویدیوهای شفاف از طبخ، سیخ‌گیری گوشت تازه و بهداشت مثال‌زدنی آشپزخانه", value: "behind_kitchen_craft_instagram", icon: "Instagram", badge: "پشت صحنه آشپزخانه" },
          { text: "پلتفرم‌های سفارش آنلاین (اسنپ‌فود) با رتبه و امتیاز بالا و پاسخگویی محترمانه به نظرات", value: "snappfood_high_ratings_reviews", icon: "Star", badge: "پلتفرم‌های سفارش آنلاین" },
          { text: "معرفی دهان‌به‌دهان خانواده‌ها و مهمانی‌هایی که به دلیل طعم و پذیرش محترمانه مشتری دائم شدند", value: "family_word_of_mouth_loyalty", icon: "Users", badge: "معرفی خانواده‌ها و مهمانان" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز در صنعت غذا و پذیرایی",
        text: "کدام پیشنهاد منحصربه‌فرد، رستوران شما را به پاتوق محبوب خانواده‌ها و سازمان‌ها تبدیل می‌کند؟",
        options: [
          { text: "تضمین ۱۰۰٪ استفاده از گوشت گرم کشتار روز و برنج ممتاز ایرانی همراه با تست طعم [فرضیه استراتژیک]", value: "fresh_meat_iranian_rice_guarantee", icon: "ShieldCheck", badge: "ضمانت گوشت گرم و برنج اصیل" },
          { text: "بسته‌بندی عایق حرارتی ۳ لایه که غذا را تا ۴۵ دقیقه کاملاً داغ و تازه نگه می‌دارد [هدف عملیاتی]", value: "triple_layer_hot_insulation", icon: "Box", badge: "بسته‌بندی داغ ۳ لایه" },
          { text: "طراحی رسپی‌ها و چاشنی‌های دست‌ساز انحصاری که در هیچ کجای دیگر قابل تجربه نیست", value: "exclusive_secret_sauces_recipes", icon: "Award", badge: "چاشنی‌های دست‌ساز اختصاصی" },
          { text: "پروتکل جبران فوری بدون بحث (تعویض فوری غذا + دسر رایگان هدیه سرآشپز در صورت کوچک‌ترین نارضایتی)", value: "no_questions_instant_dish_replacement", icon: "HeartHandshake", badge: "تعویض آنی غذا + دسر هدیه" }
        ]
      }
    ];
  }

  // 3. Heavy Industrial B2B & Parts/Mold Manufacturing Factory
  const isMachiningTooling =
    context.industryCode === "IND-08" ||
    context.industryId === "IND-08" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("قالب") || context.taxonomyTitleFa.includes("تراش") || context.taxonomyTitleFa.includes("ماشین‌کاری") || context.taxonomyTitleFa.includes("قطعه‌سازی") || context.taxonomyTitleFa.includes("سی‌ان‌سی") || context.taxonomyTitleFa.includes("متالورژی")));

  const isTextileApparel =
    context.industryCode === "IND-25" ||
    context.industryId === "IND-25" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("نساجی") || context.taxonomyTitleFa.includes("پوشاک") || context.taxonomyTitleFa.includes("تریکو") || context.taxonomyTitleFa.includes("بافت") || context.taxonomyTitleFa.includes("پارچه") || context.taxonomyTitleFa.includes("خیاطی") || context.taxonomyTitleFa.includes("دوخت")));

  if (
    (arch === "MANUFACTURER" ||
     context.archetypeTitle?.includes("تولید") ||
     context.archetypeTitle?.includes("کارخانه") ||
     overlays.includes("HEAVY_CAPEX_SUPPLY_CHAIN") ||
     overlays.includes("ISO_STANDARDS_COMPLIANCE")) &&
    isMachiningTooling
  ) {
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: "تحلیل نقشه رقبا در صنعت ساخت و تولید قطعات صنعتی",
        text: "به **فاز ۲: هوش بازار و محیط رقابتی صنایع تولیدی و قالب‌سازی (B2B)** خوش آمدید! 🔍\n\nدر حوزه قطعه‌سازی و تولید صنعتی، کارفرمایان و خریداران سازمانی در حال حاضر نیاز خود را از چه منابعی تامین می‌کنند؟",
        options: [
          { text: "کارگاه‌های سنتی تراشکاری و قالب‌سازی با ماشین‌آلات فرسوده، تلرانس‌های تقریبی و نبود استاندارد", value: "traditional_loose_tolerance_shops", icon: "Building", badge: "کارگاه‌های سنتی متفرقه" },
          { text: "واردات قطعات و قالب‌های آماده از چین و ترکیه با ریسک بالای نوسان ارز، تحریم و تاخیر گمرکی", value: "foreign_import_brokers", icon: "Globe", badge: "واردات پرریسک خارجی" },
          { text: "کارخانجات صنعتی بزرگ با ظرفیت بالا اما صلبیت شدید اداری و عدم پذیرش سفارشات انعطاف‌پذیر", value: "massive_rigid_manufacturers", icon: "TrendingUp", badge: "تولیدکنندگان صلب سازمانی" },
          { text: "تلاش کارفرمایان برای راه‌اندازی واحد فنی داخلی در کارخانه خود با هزینه‌های سنگین بالاسری", value: "inhouse_costly_machining", icon: "HelpCircle", badge: "تولید داخلی پرهزینه کارفرما" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی کشنده‌ترین ریسک‌ها و دردهای کارفرمایان صنعتی",
        text: "مدیران تولید، فنی و تدارکات کارخانجات بزرگ از کدام معضلات قطعه‌سازان بیشترین ضربه مالی را می‌خورند؟",
        options: [
          { text: "خطای ابعادی و انحراف تلرانسی که باعث پس‌زدگی در کنترل کیفیت و توقف خط مونتاژ می‌شود", value: "tolerance_deviation_line_stops", icon: "AlertTriangle", badge: "توقف خط مونتاژ کارفرما" },
          { text: "تاخیرهای مزمن در موعد تحویل و بدقولی‌های مداوم که برنامه زمانی کل کارخانه خریدار را فلج می‌کند", value: "chronic_delivery_leadtime_delays", icon: "Clock", badge: "تاخیر در زمان تحویل" },
          { text: "نبود شناسنامه آنالیز مواد (MTR)، فقدان دستگاه اندازه‌گیری دقیق (CMM) و نبود مدارک استاندارد", value: "missing_mtr_qc_inspection", icon: "FileText", badge: "فقدان شناسنامه متریال و QC" },
          { text: "نوسان مداوم قیمت، شرایط پرداخت غیرمنعطف و شانه خالی کردن از گارانتی عیوب پنهان قطعه یا قالب", value: "unstable_terms_no_defect_warranty", icon: "DollarSign", badge: "شانه خالی کردن از گارانتی" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای قراردادی و مدل تسویه مالی سازمانی",
        text: "در معاملات و مناقصات صنعتی شما، کدام فرمول قیمت‌گذاری و مدل تسویه بیشترین مزیت را دارد؟",
        options: [
          { text: "قراردادهای تیراژ بالا با قیمت تمام‌شده شفاف بر پایه وزن، نرخ متغیر متریال و دستمزد مشخص ماشین", value: "transparent_material_index_contract", icon: "DollarSign", badge: "فرمول شفاف متریال و تیراژ" },
          { text: "قراردادهای پیمانکاری سالانه تامین قطعات با بازپرداخت اعتباری مدت‌دار (ال‌سی یا چک صیادی)", value: "annual_credit_procurement_terms", icon: "Repeat", badge: "تامین سالانه اعتباری B2B" },
          { text: "محاسبه دقیق مهندسی بر مبنای ساعت کار ماشین‌آلات CNC ۵ محوره و استهلاک ابزارهای تخصصی", value: "hourly_precision_machining_rate", icon: "BarChart3", badge: "ساعت‌کار مهندسی CNC" },
          { text: "پیش‌دریافت هزینه ساخت قالب با تضمین کسر مرحله‌ای آن از سفارشات تیراژ آتی قطعه", value: "tooling_cost_amortization", icon: "Crown", badge: "استهلاک قالب در تیراژ" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیر ورود به وندورلیست و ارتباط با تصمیم‌گیرندگان",
        text: "کمیته‌های خرید صنعتی (مدیرعامل، مدیر فنی و مدیر تدارکات) از کدام مجراها شما را اعتبارسنجی می‌کنند؟",
        options: [
          { text: "جلسات فنی حضوری در کارخانه، بازدید مدیران کنترل کیفیت کارفرما از خط و ارزیابی نمونه اولیه", value: "plant_audits_sample_evaluation", icon: "Users", badge: "بازدید کارخانه و نمونه اولیه" },
          { text: "حضور مستقیم در وندورلیست‌های رسمی صنایع مادر (خودروسازی، نفت، نیروگاهی و لوازم خانگی)", value: "approved_vendor_lists_tenders", icon: "FileText", badge: "وندورلیست رسمی صنایع مادر" },
          { text: "لینکدین تخصصی صنعتی با انتشار مستندات مهندسی، کیس‌های حل گلوگاه و تاییدیه‌های کیفی", value: "industrial_linkedin_authority", icon: "Linkedin", badge: "لینکدین مهندسی و اسناد" },
          { text: "حضور در نمایشگاه‌های بین‌المللی تخصصی متالورژی، ماشین‌ابزار، قالب‌سازی و زنجیره تامین", value: "specialized_industrial_expos", icon: "Search", badge: "نمایشگاه‌های تخصصی بین‌المللی" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز غیرقابل رقابت صنعتی",
        text: "کدام مزیت سخت‌افزاری و حقوقی، کارخانه شما را به شریک استراتژیک و بدون جانشین صنایع تبدیل می‌کند؟",
        options: [
          { text: "تضمین کتبی تلرانس زیر ۳ میکرون همراه با بیمه‌نامه معتبر جبران خسارت توقف خط مونتاژ کارفرما [فرضیه استراتژیک / نمونه]", value: "sub_3micron_downtime_insurance", icon: "ShieldCheck", badge: "تعهد زیر ۳ میکرون + بیمه خط" },
          { text: "قابلیت مهندسی معکوس و تحویل نمونه اولیه قطعات پیچیده در نصف زمان معمول بازار", value: "rapid_reverse_engineering_half_time", icon: "Zap", badge: "مهندسی معکوس سریع" },
          { text: "پیاده‌سازی سیستم مدیریت کیفیت خودرویی IATF 16949 و آزمایشگاه مترولوژی مجهز به CMM", value: "iatf_16949_cmm_accreditation", icon: "Award", badge: "گواهینامه IATF و اتاق CMM" },
          { text: "ارائه خدمات نگهداری و تعمیرات اضطراری قالب‌ها در محل کارفرما ظرف کمتر از ۴ ساعت [هدف عملیاتی]", value: "rapid_onsite_die_maintenance", icon: "HeartHandshake", badge: "امداد فنی قالب در محل کارفرما" }
        ]
      }
    ];
  }

  if (isTextileApparel) {
    const tradeName = context.taxonomyTitleFa || "صنایع نساجی و پوشاک";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل فضای رقابتی در ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و زنجیره تامین نساجی و پوشاک (${tradeName})** خوش آمدید! 🔍\n\nبنکداران، برندهای پوشاک و خریداران عمده در حال حاضر سفارشات خود را از چه منابعی تامین می‌کنند؟`,
        options: [
          { text: "کارگاه‌های سنتی خرد با ماشین‌آلات فرسوده، آبرفت بالای پارچه و نبود ثبات رنگ", value: "traditional_loose_sewing_workshops", icon: "Building", badge: "کارگاه‌های سنتی با دوخت نوسانی" },
          { text: "واردات انبوه پوشاک قاچاق از چین و ترکیه با ریسک بالای نوسان ارز و عدم دسترسی دائم", value: "smuggled_foreign_apparel_imports", icon: "Globe", badge: "واردات پرریسک قاچاق" },
          { text: "تولیدکنندگان بزرگ صنعتی با انعطاف پایین در تیراژ و عدم پذیرش اصلاحات سفارشی", value: "rigid_large_apparel_mills", icon: "TrendingUp", badge: "کارخانجات صلب بزرگ" },
          { text: "کارگاه‌های خانگی یا غیررسمی با قیمت ارزان اما فقدان شناسنامه الیاف و بدقولی تحویل", value: "informal_low_cost_sewers", icon: "HelpCircle", badge: "کارگاه‌های ارزان غیررسمی" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین ریسک‌ها و دغدغه‌های خریداران عمده پوشاک و پارچه",
        text: "بنکداران، فروشگاه‌های زنجیره‌ای و طراحان لباس از کدام معضلات تولیدکنندگان بیشترین آسیب را می‌بینند؟",
        options: [
          { text: "آبرفت، پرزدهی، بور شدن رنگ پارچه پس از شستشو و مغایرت با کالیته اولیه", value: "shrinkage_colorfastness_defects", icon: "AlertTriangle", badge: "آبرفت و ثبات رنگ نامرغوب" },
          { text: "ناهمگونی در دوخت، انحراف در الگوی سایزبندی و پرتی بالای طاقه‌های پارچه", value: "pattern_sizing_stitching_defects", icon: "Scissors", badge: "نقص الگوی سایزبندی و دوخت" },
          { text: "تاخیر در تحویل محموله‌های فصلی که باعث از دست رفتن پنجره طلایی فروش نوروز یا پاییز می‌شود", value: "seasonal_leadtime_misses", icon: "Clock", badge: "تاخیر در عرضه فصلی" },
          { text: "نوسان مداوم قیمت نخ و پارچه در میانه تولید و خلف وعده در نرخ نهایی فاکتور", value: "yarn_fabric_cost_volatility", icon: "DollarSign", badge: "نوسان نرخ پارچه و نخ" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای قراردادی و مدل تسویه در صنعت پوشاک و نساجی",
        text: "در سفارشات عمده و تولید انبوه، کدام مدل تسویه بیشترین استقبال را دارد؟",
        options: [
          { text: "قراردادهای تیراژ بالا بر پایه متراژ یا تعداد، با قیمت شفاف بر مبنای نرخ روز الیاف و اجرت دوخت", value: "transparent_yarn_labor_pricing", icon: "DollarSign", badge: "فرمول شفاف الیاف و دوخت" },
          { text: "تولید سفارشی بر اساس نمونه اولیه (Sample Approval) با پیش‌پرداخت تامین پارچه و تسویه تحویل", value: "sample_approval_staged_terms", icon: "CheckCircle", badge: "تایید نمونه + تسویه مرحله‌ای" },
          { text: "تامین پیوسته کالیته و پارت‌های فصلی برای فروشگاه‌ها با شرایط چک صیادی مدت‌دار", value: "seasonal_credit_terms", icon: "Repeat", badge: "تامین فصلی با چک صیادی" },
          { text: "سفارشات پرایوت لیبل (Private Label) با بسته‌بندی، مارک و برچسب اختصاصی مشتری", value: "private_label_full_package", icon: "Crown", badge: "تولید پرایوت‌لیبل کامل" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیر دستیابی به خریداران عمده و بنکداران",
        text: "خریداران سازمانی، برندهای لباس و بنکداران از چه کانال‌هایی تامین‌کننده خود را انتخاب می‌کنند؟",
        options: [
          { text: "ارائه کالیته فیزیکی پارچه، دفترچه الگوها و بررسی حضوری نمونه دوخت نهایی در شوروم", value: "physical_swatch_showroom_audits", icon: "Users", badge: "کالیته حضوری و شوروم کارخانه" },
          { text: "حضور مستقیم در بازارهای اصلی بنکداری (بازار بزرگ، خیابان جمهوری، مولوی) و شبکه دفاتر پخش", value: "bazaar_wholesaler_distribution", icon: "FileText", badge: "ارتباط مستقیم با بنکداران بازار" },
          { text: "حضور فعال در نمایشگاه‌های بین‌المللی نساجی، پوشاک و زنجیره تامین مد ایران (ایران‌تکس)", value: "irantex_apparel_expos", icon: "Search", badge: "نمایشگاه تخصصی ایران‌تکس" },
          { text: "اینستاگرام و کاتالوگ آنلاین تخصصی B2B با نمایش خطوط تولید، بافت پارچه و جزئیات دوخت", value: "b2b_apparel_instagram_catalog", icon: "Instagram", badge: "کاتالوگ دیجیتال و خط تولید" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز در صنعت نساجی و پوشاک",
        text: "کدام قابلیت فنی و کیفی، کارخانه شما را به انتخاب قطعی برندهای مطرح پوشاک تبدیل می‌کند؟",
        options: [
          { text: "تضمین کتبی عدم آبرفت و ثبات رنگ با شناسنامه آزمون آزمایشگاهی پارچه [فرضیه استراتژیک]", value: "zero_shrinkage_colorfast_guarantee", icon: "ShieldCheck", badge: "تضمین ثبات رنگ و عدم آبرفت" },
          { text: "سیستم الگوبرداری صنعتی کامپیوتری (CAD/CAM) با دورریز پارچه زیر ۵٪ [هدف عملیاتی]", value: "cad_cam_minimal_waste", icon: "Scissors", badge: "برش دقیق با ضایعات زیر ۵٪" },
          { text: "تحویل پارت‌های تکمیلی در نصف زمان مرسوم بازار برای جلوگیری از خالی شدن رگال فروشگاه‌ها", value: "rapid_replenishment_cycle", icon: "Zap", badge: "شارژ سریع رگال در نصف زمان" },
          { text: "ارائه نمونه اولیه دوخته‌شده کاملاً رایگان قبل از عقد قرارداد تیراژ بالا", value: "free_fit_sample_testing", icon: "Box", badge: "تست نمونه اولیه رایگان" }
        ]
      }
    ];
  }

  if (
    arch === "MANUFACTURER" ||
    context.archetypeTitle?.includes("تولید") ||
    context.archetypeTitle?.includes("کارخانه") ||
    overlays.includes("HEAVY_CAPEX_SUPPLY_CHAIN") ||
    overlays.includes("ISO_STANDARDS_COMPLIANCE")
  ) {
    const tradeName = context.taxonomyTitleFa || "تولید صنعتی و کارخانه‌ای";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل نقشه رقبا در حوزه ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و محیط رقابتی صنایع تولیدی (${tradeName})** خوش آمدید! 🔍\n\nخریداران صنعتی و کارفرمایان در حال حاضر نیاز خود را از چه منابعی تامین می‌کنند؟`,
        options: [
          { text: "کارگاه‌های سنتی با ماشین‌آلات فرسوده، نوسان کیفی بالا و نبود مدارک استاندارد", value: "traditional_loose_tolerance_shops", icon: "Building", badge: "کارگاه‌های سنتی متفرقه" },
          { text: "واردات محصولات آماده از چین و کشورهای همسایه با ریسک بالای نوسان ارز و تاخیر گمرکی", value: "foreign_import_brokers", icon: "Globe", badge: "واردات پرریسک خارجی" },
          { text: "کارخانجات بزرگ صنعتی با ظرفیت بالا اما صلبیت شدید اداری و عدم انعطاف در سفارش", value: "massive_rigid_manufacturers", icon: "TrendingUp", badge: "تولیدکنندگان صلب سازمانی" },
          { text: "تلاش کارفرمایان برای راه‌اندازی واحد تولیدی داخلی با هزینه‌های سنگین بالاسری", value: "inhouse_costly_machining", icon: "HelpCircle", badge: "تولید داخلی پرهزینه کارفرما" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین ریسک‌ها و دغدغه‌های خریداران صنعتی",
        text: "مدیران خرید، تولید و تدارکات از کدام معضلات تولیدکنندگان بیشترین آسیب مالی را می‌خورند؟",
        options: [
          { text: "عدم تطابق با استانداردهای کیفی توافق‌شده، مغایرت در نمونه‌های پارت انبوه و ضایعات بالا", value: "quality_deviation_line_stops", icon: "AlertTriangle", badge: "ضایعات و افت کیفیت در تیراژ" },
          { text: "تاخیرهای مزمن در موعد تحویل که برنامه زمانی کل زنجیره خریدار را دچار توقف می‌کند", value: "chronic_delivery_leadtime_delays", icon: "Clock", badge: "تاخیر در تحویل محموله" },
          { text: "نبود شناسنامه آنالیز مواد اولیه و فقدان گزارش‌های مدون کنترل کیفی (QC Inspection)", value: "missing_mtr_qc_inspection", icon: "FileText", badge: "فقدان شناسنامه متریال و QC" },
          { text: "نوسان مداوم قیمت در طول اجرای پروژه و شانه خالی کردن از گارانتی عیوب محموله", value: "unstable_terms_no_defect_warranty", icon: "DollarSign", badge: "عدم ثبات قیمت و گارانتی" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای قراردادی و مدل تسویه مالی سازمانی",
        text: "در معاملات و مناقصات صنعتی شما، کدام ساختار قیمت‌گذاری و تسویه بیشترین مزیت را دارد؟",
        options: [
          { text: "قراردادهای تیراژ بالا با قیمت تمام‌شده شفاف بر پایه نرخ متریال اولیه و دستمزد تولید", value: "transparent_material_index_contract", icon: "DollarSign", badge: "فرمول شفاف متریال و دستمزد" },
          { text: "قراردادهای پیمانکاری سالانه تامین با بازپرداخت اعتباری مدت‌دار (چک صیادی یا ضمانت‌نامه)", value: "annual_credit_procurement_terms", icon: "Repeat", badge: "تامین سالانه اعتباری B2B" },
          { text: "تولید دسته‌ای سفارشی بر مبنای مشخصات فنی و استانداردهای مورد نیاز کارفرما", value: "hourly_precision_machining_rate", icon: "BarChart3", badge: "تولید سفارشی دسته‌ای" },
          { text: "پیش‌دریافت هزینه تجهیز خط و ساخت قالب با استهلاک مرحله‌ای در تیراژ سفارشات آتی", value: "tooling_cost_amortization", icon: "Crown", badge: "استهلاک تجهیزات در تیراژ" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیر ورود به وندورلیست و جذب مشتریان صنعتی",
        text: "کمیته‌های خرید و مدیران تدارکات از چه مجراهایی توان تولیدی شما را اعتبارسنجی می‌کنند؟",
        options: [
          { text: "جلسات فنی حضوری، بازدید ارزیابان کنترل کیفی کارفرما از خط تولید و تست نمونه اولیه", value: "plant_audits_sample_evaluation", icon: "Users", badge: "بازدید کارخانه و تست نمونه" },
          { text: "حضور مستقیم در وندورلیست‌های رسمی صنایع و شرکت در مناقصات بزرگ تامین", value: "approved_vendor_lists_tenders", icon: "FileText", badge: "وندورلیست رسمی صنایع" },
          { text: "لینکدین تخصصی و انتشار گزارش‌های فنی، استانداردهای کارگاهی و کیس‌استادی‌های موفق", value: "industrial_linkedin_authority", icon: "Linkedin", badge: "لینکدین صنعتی و اسناد فنی" },
          { text: "حضور در نمایشگاه‌های بین‌المللی تخصصی صنایع مادر و زنجیره تامین مرتبط", value: "specialized_industrial_expos", icon: "Search", badge: "نمایشگاه‌های تخصصی صنعت" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز غیرقابل رقابت صنعتی",
        text: "کدام مزیت کیفی و تعهد اجرایی، کارخانه شما را به شریک استراتژیک مشتریان بدل می‌کند؟",
        options: [
          { text: "تضمین کتبی جبران خسارت و تعویض بدون قیدوشرط هرگونه محموله معیوب [فرضیه استراتژیک]", value: "sub_3micron_downtime_insurance", icon: "ShieldCheck", badge: "ضمانت قطعی تعویض محموله" },
          { text: "تحویل سفارشات در کمتر از میانگین زمان معمول بازار با بهینه‌سازی ظرفیت خط تولید [هدف عملیاتی]", value: "rapid_reverse_engineering_half_time", icon: "Zap", badge: "تحویل سریع با خط بهینه" },
          { text: "استقرار سیستم مدیریت کیفیت یکپارچه (ISO 9001) و آزمایشگاه مجهز کنترل کیفی", value: "iatf_16949_cmm_accreditation", icon: "Award", badge: "استاندارد کیفی ایزو و آزمایشگاه" },
          { text: "ارائه نمونه اولیه جهت آزمون در خط خریدار به صورت کاملاً رایگان قبل از عقد قرارداد نهایی", value: "free_pilot_sample_testing", icon: "Box", badge: "ارائه نمونه تست اولیه رایگان" }
        ]
      }
    ];
  }

  // 4. B2B Cloud Accounting SaaS & Technology Platforms
  const isTaxAccountingSaaS =
    context.taxonomyId === "BT-0166" ||
    context.taxonomyId === "BT-0171" ||
    (context.taxonomyTitleFa && (context.taxonomyTitleFa.includes("مالیاتی") || context.taxonomyTitleFa.includes("حسابداری") || context.taxonomyTitleFa.includes("مودیان") || context.taxonomyTitleFa.includes("فاکتور"))) ||
    overlays.includes("TAX_SYSTEM_INTEGRATION") ||
    (context.keywords && (context.keywords.includes("مالیات") || context.keywords.includes("حسابداری") || context.keywords.includes("مودیان")));

  if (
    (arch === "SAAS_SOFTWARE" ||
     context.archetypeTitle?.includes("نرم‌افزار") ||
     context.archetypeTitle?.includes("ابری") ||
     overlays.includes("RECURRING_SUBSCRIPTION_METRICS") ||
     overlays.includes("TAX_SYSTEM_INTEGRATION")) &&
    isTaxAccountingSaaS
  ) {
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: "تحلیل رقبا در بازار نرم‌افزارهای حسابداری و سامانه‌های ابری",
        text: "به **فاز ۲: هوش بازار و رفتار خرید مشتریان B2B SaaS و نرم‌افزار ابری** خوش آمدید! 🔍\n\nکسب‌وکارها، شرکت‌ها و مدیران مالی در حال حاضر امور مالیاتی و حسابداری خود را چگونه ساماندهی می‌کنند؟",
        options: [
          { text: "نرم‌افزارهای حسابداری سنتی تحت دسکتاپ ویندوز با قفل‌های سخت‌افزاری و رابط کاربری پیچیده و تاریخ‌گذشته", value: "legacy_desktop_dongle_software", icon: "Building", badge: "نرم‌افزارهای سنتی دانگلی" },
          { text: "فایل‌های اکسل پر از فرمول‌های شکننده، محاسبات دستی و دفاتر سنتی با خطای انسانی بالا", value: "excel_manual_worksheets", icon: "FileText", badge: "اکسل و ثبت‌های دستی" },
          { text: "سیستم‌های ERP سنگین شرکتی با هزینه‌های چندصد میلیونی و استقرار طاقت‌فرسای چندماهه", value: "massive_expensive_erps", icon: "TrendingUp", badge: "ERPهای پرهزینه سنگین" },
          { text: "نرم‌افزارهای ابری نوپا که هنوز قطعی‌های سرور مداوم دارند یا با قوانین مالیاتی منطبق نشده‌اند", value: "fragile_nascent_cloud_tools", icon: "Compass", badge: "ابری‌های ناقص نوظهور" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی هولناک‌ترین دردها و دغدغه‌های مدیران مالی و صاحبان کسب‌وکار",
        text: "بزرگ‌ترین کابوس و ریسکی که کاربران نرم‌افزارهای مالیاتی و حسابداری با آن دست‌وپنجه نرم می‌کنند چیست؟",
        options: [
          { text: "ترس دائمی از جریمه‌های سنگین و جبران‌ناپذیر مالیاتی ناشی از نقص اتصال با سامانه مودیان", value: "fear_of_moadian_tax_penalties", icon: "AlertTriangle", badge: "ترس از جرایم سامانه مودیان" },
          { text: "پیچیدگی سرگیجه‌آور منوها و نیاز به ده‌ها جلسه آموزش پرسنل برای صدور یک فاکتور ساده", value: "steep_learning_curve_ui_complexity", icon: "FileQuestion", badge: "پیچیدگی خسته‌کننده سیستم" },
          { text: "کندی سرعت در پایان ماه‌ها، قطعی ناگهانی سرور و نگرانی مداوم از امنیت و نشت داده‌های مالی", value: "cloud_downtime_data_security_fear", icon: "AlertTriangle", badge: "قطعی و امنیت داده‌های مالی" },
          { text: "پشتیبانی تلفنی ضعیف، صف‌های طولانی انتظار و دریافت مبالغ هنگفت بابت هر آپدیت قانونی جدید", value: "costly_slow_phone_support", icon: "UserX", badge: "پشتیبانی کند و هزینه‌های آپدیت" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای درآمد پایدار و بسته‌های اشتراک نرم‌افزار",
        text: "کدام ساختار اشتراک و تعرفه‌گذاری بیشترین نرخ تبدیل کاربر به مشتری پرداختی (Paying Customer) را ایجاد می‌کند؟",
        options: [
          { text: "اشتراک ابری دوره‌ای (ماهانه/سالانه) سطح‌بندی‌شده بر مبنای حجم اسناد و تعداد کاربران فعال", value: "tiered_saas_mrr_arr", icon: "Repeat", badge: "اشتراک پلکانی SaaS" },
          { text: "دوره تست رایگان ۱۴ روزه با تمام امکانات (Full Feature Free Trial) بدون نیاز به اطلاعات کارت", value: "frictionless_14day_free_trial", icon: "CheckCircle", badge: "تست رایگان ۱۴ روزه" },
          { text: "پلن سازمانی سفارشی با اتصال مستقیم به سامانه‌های داخلی کارفرما، سرور اختصاصی و SLA معین", value: "enterprise_custom_license_sla", icon: "Crown", badge: "لایسنس سازمانی اختصاصی" },
          { text: "مدل قیمت‌گذاری مبتنی بر مصرف واقعی (Pay-As-You-Go) متناسب با تعداد فاکتورهای ارسالی", value: "usage_based_transaction_pricing", icon: "BarChart3", badge: "پرداخت مبتنی بر تراکنش" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیرهای رشد و جذب مشتریان B2B برای نرم‌افزار",
        text: "تصمیم خرید مدیران عامل و مدیران مالی برای انتخاب پلتفرم ابری شما از چه کانال‌هایی هدایت می‌شود؟",
        options: [
          { text: "سئوی قدرتمند ارگانیک روی کلیدواژه‌های قوانین مالیاتی، بخشنامه‌های مودیان و راهنمای بستن حساب‌ها", value: "organic_seo_tax_regulations", icon: "Search", badge: "سئوی مقالات مالیاتی" },
          { text: "شبکه‌سازی استراتژیک با جامعه حسابداران، مشاوران مالیاتی و شرکت‌های معتمد ارائه‌دهنده خدمات", value: "accountant_community_advocacy", icon: "Users", badge: "همکاری با جامعه حسابداران" },
          { text: "وبینارهای تخصصی آنلاین انتقال تجربه درباره ترفندهای قانونی دفاع مالیاتی و دموی عملی نرم‌افزار", value: "tax_webinars_product_demo", icon: "TrendingUp", badge: "وبینارهای دمو و انتقال تجربه" },
          { text: "رشد محصول‌محور (PLG) ناشی از معرفی همکاران به دلیل سادگی بی‌نظیر کاربری و تجربه شگفت‌انگیز", value: "plg_viral_accountant_referrals", icon: "Share2", badge: "رشد ارگانیک محصول‌محور" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف مزیت طلایی تمایز و پیشتازی در بازار SaaS",
        text: "کدام ویژگی منحصربه‌فرد، نرخ ریزش (Churn) نرم‌افزار شما را به صفر نزدیک می‌کند؟",
        options: [
          { text: "ارسال مستقیم و ۱ کلیکه فاکتور به سامانه مودیان با تعهد جبران خسارت هرگونه جریمه احتمالی [فرضیه استراتژیک / تعهد تجاری]", value: "zero_fine_moadian_guarantee", icon: "ShieldCheck", badge: "تضمین ۱۰۰٪ سامانه مودیان" },
          { text: "رسیدن به ارزش در کمتر از ۵ دقیقه (Time-to-Value) بدون نیاز به حتی یک دقیقه آموزش اولیه [هدف عملیاتی]", value: "sub_5min_time_to_value", icon: "Zap", badge: "شروع کار در زیر ۵ دقیقه" },
          { text: "موتور هوش مصنوعی کاشف مغایرت‌ها و هشدارهای پیشگیرانه قبل از ارسال اظهارنامه به دارایی", value: "ai_tax_discrepancy_auditor", icon: "Sparkles", badge: "حسابرس خودکار هوش مصنوعی" },
          { text: "داشبورد نقدینگی و سود/زیان زنده روی تلفن همراه مدیرعامل با زبان کاملاً ساده و غیرحسابداری", value: "executive_mobile_cashflow_app", icon: "BarChart3", badge: "داشبورد ساده موبایل مدیران" }
        ]
      }
    ];
  }

  if (
    arch === "SAAS_SOFTWARE" ||
    context.archetypeTitle?.includes("نرم‌افزار") ||
    context.archetypeTitle?.includes("ابری") ||
    overlays.includes("RECURRING_SUBSCRIPTION_METRICS")
  ) {
    const tradeName = context.taxonomyTitleFa || "نرم‌افزار ابری و فناوری B2B SaaS";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل رقبا در بازار ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و رفتار خرید کاربران B2B SaaS (${tradeName})** خوش آمدید! 🔍\n\nکسب‌وکارها و کاربران هدف در حال حاضر این نیاز را چگونه برطرف می‌کنند؟`,
        options: [
          { text: "نرم‌افزارهای سنتی دسکتاپ قدیمی تحت ویندوز با قفل‌های سخت‌افزاری و رابط کاربری خسته‌کننده", value: "legacy_desktop_dongle_software", icon: "Building", badge: "نرم‌افزارهای سنتی دسکتاپ" },
          { text: "فایل‌های شکننده اکسل و فرآیندهای دستی پراشتباه که زمان ارزشمند تیم را هدر می‌دهند", value: "excel_manual_worksheets", icon: "FileText", badge: "اکسل و روش‌های دستی" },
          { text: "سیستم‌های خارجی گران‌قیمت که به دلیل تحریم، عدم پشتیبانی از زبان فارسی و درگاه ریالی نامناسبند", value: "massive_expensive_erps", icon: "Globe", badge: "ابزارهای خارجی تحریمی" },
          { text: "ابزارهای ابری نوپا و شکننده که قطعی‌های مداوم سرور و باگ‌های کلافه‌کننده دارند", value: "fragile_nascent_cloud_tools", icon: "Compass", badge: "ابری‌های ناقص نوظهور" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین اصطکاک‌ها و دردهای کاربران نرم‌افزار",
        text: "بزرگ‌ترین مانع و دغدغه‌ای که کاربران در کار با ابزارهای موجود با آن مواجه هستند چیست؟",
        options: [
          { text: "پیچیدگی سرگیجه‌آور منوها و نیاز به ساعت‌ها آموزش طاقت‌فرسا برای یادگیری سیستم", value: "steep_learning_curve_ui_complexity", icon: "FileQuestion", badge: "پیچیدگی خسته‌کننده کاربری" },
          { text: "کندی سرعت در ساعات اوج مصرف، قطعی ناگهانی سرور و نگرانی دائمی از امنیت و نشت داده‌ها", value: "cloud_downtime_data_security_fear", icon: "AlertTriangle", badge: "قطعی سرور و امنیت داده‌ها" },
          { text: "سختی مهاجرت داده‌ها از سامانه‌های قدیمی به ابزار جدید و ترس از دست رفتن سوابق", value: "data_migration_friction_loss", icon: "RefreshCw", badge: "مهاجرت داده‌های قدیمی" },
          { text: "پشتیبانی تیکتی بسیار کند، عدم پاسخگویی در شرایط بحرانی و هزینه‌های پنهان ارتقا", value: "costly_slow_phone_support", icon: "UserX", badge: "پشتیبانی کند و هزینه‌های پنهان" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوهای درآمد پایدار و اشتراک نرم‌افزار",
        text: "کدام ساختار اشتراک بیشترین نرخ تبدیل کاربر به مشترک پرداختی (Paying Customer) را ایجاد می‌کند؟",
        options: [
          { text: "اشتراک ابری دوره‌ای (ماهانه/سالانه) سطح‌بندی‌شده بر مبنای تعداد کاربر و امکانات فعال", value: "tiered_saas_mrr_arr", icon: "Repeat", badge: "اشتراک پلکانی SaaS" },
          { text: "دوره تست رایگان ۱۴ روزه با تمام امکانات (Full Feature Free Trial) بدون نیاز به پرداخت اولیه", value: "frictionless_14day_free_trial", icon: "CheckCircle", badge: "تست رایگان ۱۴ روزه" },
          { text: "پلن سازمانی سفارشی با سرور اختصاصی، SLA رسمی و پشتیبانی VIP ۲۴ ساعته", value: "enterprise_custom_license_sla", icon: "Crown", badge: "لایسنس سازمانی اختصاصی" },
          { text: "مدل قیمت‌گذاری مبتنی بر مصرف واقعی (Pay-As-You-Go) متناسب با حجم عملیات", value: "usage_based_transaction_pricing", icon: "BarChart3", badge: "پرداخت مبتنی بر مصرف" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی مسیرهای رشد و جذب مشتریان سازمانی",
        text: "تصمیم مدیران برای انتخاب پلتفرم ابری شما از چه کانال‌هایی هدایت می‌شود؟",
        options: [
          { text: "رشد محصول‌محور (PLG) ناشی از تجربه کاربری شگفت‌انگیز و دعوت همکاران در تیم", value: "plg_viral_accountant_referrals", icon: "Share2", badge: "رشد ارگانیک محصول‌محور" },
          { text: "سئوی قوی مقالات تخصصی و ارائه راهکارهای عملیاتی برای مسائل کاری روزمره مدیران", value: "organic_seo_tax_regulations", icon: "Search", badge: "سئوی تخصصی راهکارها" },
          { text: "دموهای تعاملی آنلاین، وبینارهای عملیاتی و مشاوره فنی اختصاصی با کارشناسان استقرار", value: "tax_webinars_product_demo", icon: "TrendingUp", badge: "وبینارهای دمو و استقرار" },
          { text: "روابط عمومی، انتشار دستاوردهای فنی و حضور در جمع اکوسیستم فناوری و استارتاپی", value: "tech_ecosystem_pr_networking", icon: "Users", badge: "شبکه‌سازی اکوسیستم فناوری" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف مزیت طلایی تمایز و کاهش نرخ ریزش (Churn)",
        text: "کدام قابلیت کلیدی، نرم‌افزار شما را به ابزاری جدایی‌ناپذیر در محیط کاری کاربر تبدیل می‌کند؟",
        options: [
          { text: "رسیدن به ارزش در کمتر از ۵ دقیقه (Time-to-Value) بدون نیاز به آموزش اولیه [هدف عملیاتی]", value: "sub_5min_time_to_value", icon: "Zap", badge: "شروع کار در زیر ۵ دقیقه" },
          { text: "تضمین پایداری ۹۹.۹٪ سرور همراه با بک‌آپ‌گیری خودکار لحظه‌ای و امنیت ابری [فرضیه استراتژیک]", value: "uptime_999_backup_guarantee", icon: "ShieldCheck", badge: "پایداری ۹۹.۹٪ و امنیت" },
          { text: "داشبورد تحلیلی هوشمند و نمودارهای زنده عملکردی روی موبایل و وب برای مدیران", value: "executive_mobile_cashflow_app", icon: "BarChart3", badge: "داشبورد تحلیلی مدیران" },
          { text: "اتصال یکپارچه از طریق API به سیستم‌های بانکی، پیامکی و ابزارهای پرکاربرد داخلی", value: "seamless_api_ecosystem_integrations", icon: "Sparkles", badge: "یکپارچگی کامل با وب‌سرویس‌ها" }
        ]
      }
    ];
  }

  // 4B. Retail & Stores (Physical Retail, E-Commerce, Boutiques, Supermarkets)
  if (
    arch === "PHYSICAL_RETAIL" ||
    arch === "ECOMMERCE_DTC" ||
    context.industryCode === "IND-01" ||
    context.industryCode === "IND-02" ||
    context.archetypeTitle?.includes("فروشگاه") ||
    context.archetypeTitle?.includes("خرده‌فروشی") ||
    overlays.includes("LOCAL_RETAIL") ||
    overlays.includes("FOOT_TRAFFIC_DEPENDENT")
  ) {
    const tradeName = context.taxonomyTitleFa || "فروشگاه و خرده‌فروشی";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل فضای رقابتی بازار در صنف ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و تحلیل رفتار خریداران (${tradeName})** خوش آمدید! 🔍\n\nدر حوزه فعالیت شما، خریداران در حال حاضر کالاهای مورد نیاز خود را از چه فروشگاه‌ها یا پلتفرم‌هایی تامین می‌کنند؟`,
        options: [
          { text: "فروشگاه‌های سنتی و بازارهای شلوغ با قیمت‌گذاری نامطمئن و نبود گارانتی اصالت", value: "traditional_stores_bazaar", icon: "Building", badge: "فروشگاه‌های سنتی" },
          { text: "آنلاین‌شاپ‌ها و پلتفرم‌های اینترنتی بزرگ با تاخیر ارسال و عدم امکان بررسی حضوری", value: "big_ecommerce_platforms", icon: "ShoppingBag", badge: "پلتفرم‌های آنلاین" },
          { text: "مراکز لوکس و فروشگاه‌های گران‌قیمت با حباب قیمتی بالا و فاقد توجیه اقتصادی", value: "luxury_malls_expensive", icon: "Crown", badge: "مراکز لوکس گران" },
          { text: "فروشندگان متفرقه و شبکه‌های اجتماعی غیررسمی با اجناس تقلبی و بی‌کیفیت", value: "informal_low_quality_sellers", icon: "HelpCircle", badge: "فروشندگان متفرقه" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین اصطکاک و دغدغه خریداران کالا",
        text: "بیشترین نارضایتی و شکایت خریداران از فروشگاه‌های موجود در بازار چیست؟",
        options: [
          { text: "ترس شدید از جنس تقلبی، بی‌کیفیت یا عدم انطباق با مشخصات اعلام‌شده", value: "counterfeit_subpar_fear", icon: "AlertTriangle", badge: "ترس از جنس تقلبی" },
          { text: "قیمت‌های سلیقه‌ای و نامتعارف و ترس از پرداخت هزینه بالاتر از ارزش واقعی", value: "arbitrary_unclear_pricing", icon: "DollarSign", badge: "قیمت‌گذاری مبهم" },
          { text: "عدم پاسخگویی فروشنده پس از خرید و نبود امکان تعویض، مرجوعی یا گارانتی", value: "no_return_warranty", icon: "UserX", badge: "نبود امکان مرجوعی" },
          { text: "معطلی در خرید، صف صندوق، عدم ارسال به موقع و بسته‌بندی نامناسب کالا", value: "slow_fulfillment_packaging", icon: "Clock", badge: "تاخیر و بسته‌بندی بد" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل الگوی پرداخت و کشش قیمتی خریداران",
        text: "کدام ساختار قیمت‌گذاری بیشترین حجم فروش و اعتماد را میان مشتریان شما ایجاد می‌کند؟",
        options: [
          { text: "قیمت‌گذاری منصفانه و رقابتی متناسب با بازار همراه با صدور فاکتور رسمی معتبر", value: "fair_competitive_pricing", icon: "CheckCircle", badge: "قیمت منصفانه رقابتی" },
          { text: "سبد تخفیف‌های دوره‌ای، خرید اقساطی یا فروش‌های ویژه برای خریدهای خانوادگی", value: "installment_volume_discounts", icon: "Layers", badge: "تخفیف دوره‌ای و اقساط" },
          { text: "کالاهای لوکس و پریمیوم با بسته‌بندی اختصاصی شکیل و اصالت تضمین‌شده", value: "premium_luxury_packaging", icon: "Crown", badge: "پریمیوم با بسته‌بندی هدیه" },
          { text: "باشگاه مشتریان و بازگشت درصدی از مبلغ خرید (کش‌بک) برای خریدهای مکرر بعدی", value: "cashback_loyalty_club", icon: "Repeat", badge: "باشگاه مشتریان و کش‌بک" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی موثرترین کانال دیده‌شدن و جذب خریدار",
        text: "مشتریان هدف شما کالاها را چگونه کشف می‌کنند و تصمیم خرید در کجا شکل می‌گیرد؟",
        options: [
          { text: "ویترین فروشگاهی جذاب، پاخور خیابان اصلی و تابلوهای دعوت‌کننده محیطی", value: "storefront_foot_traffic", icon: "MapPin", badge: "ویترین و پاخور فیزیکی" },
          { text: "اینستاگرام با ویدیوهای لایو معرفی کالا، نمایش جزئیات و رضایت خریداران", value: "instagram_live_product_demo", icon: "Instagram", badge: "اینستاگرام و ویدیو لایو" },
          { text: "وب‌سایت فروشگاهی بهینه‌سازی‌شده در جستجوی گوگل و حضور در موتورهای ترب و ایمالز", value: "ecommerce_torob_seo", icon: "Search", badge: "سایت اینترنتی و ترب" },
          { text: "معرفی دهان‌به‌دهان خریداران راضی و تبلیغات هدفمند در جامعه محلی یا صنفی", value: "local_word_of_mouth_referral", icon: "Users", badge: "معرفی خریداران وفادار" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز و پیشتازی در فروش کالا",
        text: "کدام پیشنهاد استثنایی، فروشگاه شما را به انتخاب اول و دائمی خریداران تبدیل می‌کند؟",
        options: [
          { text: "ضمانت قطعی اصالت کالا همراه با امکان تعویض یا بازگشت ۱۰۰٪ وجه بدون سوال", value: "unconditional_return_moneyback", icon: "ShieldCheck", badge: "ضمانت بازگشت بی‌قیدوشرط" },
          { text: "تنوع دست‌چین‌شده از کالاهای خاص و ترند که در سایر فروشگاه‌ها پیدا نمی‌شود", value: "curated_exclusive_collection", icon: "Sparkles", badge: "اجناس خاص و دست‌چین" },
          { text: "ارسال فوق‌سریع در کمترین زمان با بسته‌بندی ضدضربه و شکیل هدیه‌ای", value: "lightning_fast_delivery_gift", icon: "Zap", badge: "ارسال فوری و بسته‌بندی خاص" },
          { text: "مشاوره صادقانه پیش از خرید و راهنمایی خریدار بر مبنای بودجه و نیاز واقعی او", value: "honest_consultative_selling", icon: "HeartHandshake", badge: "مشاوره صادقانه خرید" }
        ]
      }
    ];
  }

  // 4C. Health, Medical, Beauty & Wellness Clinics
  if (
    arch === "HEALTH_BEAUTY_WELLNESS" ||
    context.industryCode === "IND-04" ||
    context.archetypeTitle?.includes("سلامت") ||
    context.archetypeTitle?.includes("زیبایی") ||
    context.archetypeTitle?.includes("درمان") ||
    overlays.includes("HEALTHCARE_COMPLIANCE")
  ) {
    const tradeName = context.taxonomyTitleFa || "مرکز سلامت و زیبایی";
    return [
      {
        id: "p2_step0_competitors",
        step: 0,
        title: `تحلیل فضای رقابتی در صنف ${tradeName}`,
        text: `به **فاز ۲: هوش بازار و روان‌شناسی مراجعان (${tradeName})** خوش آمدید! 🔍\n\nدر حوزه فعالیت شما، مراجعان در حال حاضر خدمات مورد نیاز خود را از چه مراکزی دریافت می‌کنند؟`,
        options: [
          { text: "مراکز سنتی یا متفرقه با تجهیزات فرسوده، متریال غیراستاندارد و نبود بهداشت دقیق", value: "traditional_unhygienic_centers", icon: "Building", badge: "مراکز سنتی متفرقه" },
          { text: "کلینیک‌های لوکس پرادعا با تعرفه‌های نجومی و برخوردهای متکبرانه از بالا به پایین", value: "luxurious_overpriced_clinics", icon: "Crown", badge: "کلینیک‌های لوکس گران" },
          { text: "درمانگاه‌ها و مراکز بسیار شلوغ با نوبت‌دهی سرسری و معاینه بسیار کوتاه زیر ۳ دقیقه", value: "overcrowded_rushed_centers", icon: "Clock", badge: "مراکز شلوغ با ویزیت شتاب‌زده" },
          { text: "مراجعه به افراد غیرمتخصص یا اقدامات خودسرانه خانگی ناشی از ترس از هزینه‌ها", value: "unqualified_risky_alternatives", icon: "AlertTriangle", badge: "اقدامات پرریسک غیرمتخصص" }
        ]
      },
      {
        id: "p2_step1_customer_pain",
        step: 1,
        title: "شناسایی اصلی‌ترین ترس و اضطراب مراجعان",
        text: "مراجعان در دریافت این خدمات بیش از هر چیز از چه موضوعی هراس یا شکایت دارند؟",
        options: [
          { text: "ترس از عوارض جانبی، آسیب به سلامتی/زیبایی و استفاده از مواد یا داروهای نامرغوب", value: "fear_of_damage_side_effects", icon: "AlertTriangle", badge: "ترس از عوارض و آسیب" },
          { text: "معطلی کلافه‌کننده در اتاق انتظار علیرغم داشتن نوبت قبلی و بی‌احترامی به وقت بیمار", value: "waiting_room_delays", icon: "Clock", badge: "معطلی طولانی اتاق انتظار" },
          { text: "عدم شفافیت در هزینه‌ها و تحمیل خدمات غیرضروری با صدور صورت‌حساب‌های سنگین", value: "unnecessary_upsells_opaque_costs", icon: "DollarSign", badge: "هزینه‌های غیرشفاف" },
          { text: "برخورد سرد و بی‌حوصله پرسنل و متخصص و عدم شنیدن دغدغه‌ها و سوالات مراجع", value: "cold_impatient_staff", icon: "UserX", badge: "برخورد سرد و کم‌حوصله" }
        ]
      },
      {
        id: "p2_step2_pricing_models",
        step: 2,
        title: "تحلیل ساختار تعرفه و الگوی پذیرش هزینه مراجعان",
        text: "کدام الگوی مالی، بالاترین میزان رضایت و پایبندی مراجعان را در این صنف تضمین می‌کند؟",
        options: [
          { text: "تعرفه شفاف مصوب همراه با اعلام دقیق تمام هزینه‌ها قبل از آغاز هرگونه اقدام", value: "upfront_transparent_tariffs", icon: "CheckCircle", badge: "تعرفه شفاف قبل از شروع" },
          { text: "پکیج‌های جامع درمانی و مراقبتی با امکان پرداخت مرحله‌ای و شرایط اقساطی آسان", value: "staged_installment_plans", icon: "Layers", badge: "پرداخت مرحله‌ای و اقساط" },
          { text: "خدمات پریمیوم VIP با وقت اختصاصی، بدون معطلی و با بهترین متریال بین‌المللی", value: "premium_exclusive_vip", icon: "Crown", badge: "خدمات پریمیوم VIP" },
          { text: "طرح‌های چکاپ دوره‌ای و مراقبت مستمر سالانه با تخفیف‌های ویژه برای خانواده‌ها", value: "preventative_family_plans", icon: "Repeat", badge: "مراقبت مستمر سالانه" }
        ]
      },
      {
        id: "p2_step3_primary_channel",
        step: 3,
        title: "شناسایی موثرترین کانال اعتمادسازی و جذب مراجعان",
        text: "تصمیم مراجعان برای سپردن سلامت و زیبایی خود به شما از چه کانال‌هایی اثر می‌پذیرد؟",
        options: [
          { text: "معرفی دهان‌به‌دهان مراجعان راضی، توصیه خانوادگی و حسن شهرت اخلاقی در منطقه", value: "patient_word_of_mouth", icon: "Users", badge: "توصیه مراجعان راضی" },
          { text: "اینستاگرام تخصصی با انتشار ویدیوهای علمی آموزشی، پاسخ به باورهای غلط و رضایت بیماران", value: "evidence_educational_instagram", icon: "Instagram", badge: "اینستاگرام علمی و آموزشی" },
          { text: "پلتفرم‌های آنلاین نوبت‌دهی و ثبت نظر (دکترتو، نوبت‌دات‌آی‌آر) و سئوی محلی نقشه", value: "booking_platforms_local_maps", icon: "MapPin", badge: "پلتفرم نوبت‌دهی و نقشه" },
          { text: "همکاری و ارجاع متقابل با سایر پزشکان و متخصصان مکمل در شبکه درمان", value: "peer_physician_referral", icon: "Share2", badge: "شبکه ارجاع همکاران" }
        ]
      },
      {
        id: "p2_step4_golden_opportunity",
        step: 4,
        title: "کشف فرصت طلایی تمایز و محبوبیت پایدار",
        text: "کدام تعهد اخلاقی و حرفه‌ای، مرکز شما را به پناهگاهی امن و بی‌رقیب برای مراجعان بدل می‌کند؟",
        options: [
          { text: "صرف وقت کافی و شنیدن صبورانه دغدغه‌های مراجع همراه با توضیح کامل فرآیند درمان", value: "empathetic_unrushed_consultation", icon: "HeartHandshake", badge: "ویزیت صبورانه و باآرامش" },
          { text: "باز کردن پلمپ متریال و مواد اصل در برابر چشمان مراجع و ارائه شناسنامه رسمی کیفیت", value: "open_unsealing_materials_guarantee", icon: "ShieldCheck", badge: "پلمپ مواد در حضور مراجع" },
          { text: "پیگیری تلفنی مستمر وضعیت بهبود و حال مراجع پس از ترخیص یا اتمام خدمت", value: "post_treatment_active_followup", icon: "Sparkles", badge: "پیگیری فعال بعد از درمان" },
          { text: "محیطی آرامش‌بخش، تمیز، عاری از اضطراب و احترام مطلق به زمان نوبت مراجعان", value: "serene_stressfree_environment", icon: "Smile", badge: "محیط آرام و بدون استرس" }
        ]
      }
    ];
  }

  // 5. Personal Brand, Creator, Coaching & Professional Services
  return [
    {
      id: "p2_step0_competitors",
      step: 0,
      title: "تحلیل فضای رقبا در حوزه آموزش، مشاوره و برند شخصی",
      text: "به **فاز ۲: هوش بازار و پژوهش مخاطبان برند شخصی و آموزش تخصصی** خوش آمدید! 🔍\n\nمخاطبان هدف شما در حال حاضر نیاز مهارتی، آموزشی یا مشاوره‌ای خود را با چه گزینه‌هایی حل می‌کنند؟",
      options: [
        { text: "پیج‌های زرد اینستاگرامی و مدرسین انگیزشی پرمدعا بدون کارنامه واقعی در بازار", value: "hype_motivational_influencers", icon: "Users", badge: "مدرسین انگیزشی زرد" },
        { text: "آکادمی‌ها و موسسات سنتی آموزشی با دوره‌های حجیم فرسایشی و مدارک بی‌اعتبار در عمل", value: "legacy_diploma_academies", icon: "Building", badge: "موسسات سنتی با مدارک صوری" },
        { text: "آموزش‌های پراکنده و متناقض رایگان در اینترنت و یوتیوب که وقت مخاطب را می‌سوزانند", value: "scattered_youtube_blogs", icon: "HelpCircle", badge: "محتواهای رایگان پراکنده" },
        { text: "مشاوران ارشد قدیمی با تعرفه‌های نجومی و زبان پیچیده شرکتی دور از دسترس عموم", value: "elite_high_fee_consultants", icon: "Compass", badge: "مشاوران شرکتی گران‌قیمت" }
      ]
    },
    {
      id: "p2_step1_customer_pain",
      step: 1,
      title: "شناسایی عمیق‌ترین سرخوردگی‌ها و دردهای دانش‌پذیران و مراجعان",
      text: "بزرگ‌ترین نارضایتی و گلایه مشتریان از آموزش‌ها و مشاوره‌های فعلی بازار چیست؟",
      options: [
        { text: "ادعاهای پوچ توخالی و کلی‌گویی‌های تئوریک بدون ارائه فریم‌ورک‌های بومی و کاربردی در عمل", value: "superficial_empty_claims", icon: "AlertTriangle", badge: "کلی‌گویی تئوریک بدون کاربرد" },
        { text: "تنها ماندن پس از خرید محصول، پاسخ ندادن به اشکالات و نبود منتورشیپ مستقیم شخص مدرس", value: "abandonment_after_purchase", icon: "UserX", badge: "رها شدن پس از پرداخت وجه" },
        { text: "اتلاف وقت شدید در دوره‌های چند ده‌ساعته خسته‌کننده و نرسیدن به هیچ خروجی ملموس درآمدی", value: "wasted_time_no_income_impact", icon: "Clock", badge: "دوره‌های طولانی بدون نتیجه" },
        { text: "قیمت‌های گزاف نامتناسب در ازای ویدیوهای از پیش ضبط‌شده قدیمی فاقد آپدیت و پشتیبانی", value: "overpriced_stale_recordings", icon: "DollarSign", badge: "پکیج‌های قدیمی گران‌قیمت" }
      ]
    },
    {
      id: "p2_step2_pricing_models",
      step: 2,
      title: "تحلیل بازه قیمتی و مدل ارزش‌گذاری تخصص فردی",
      text: "کدام معماری قیمت‌گذاری بیشترین احترام، پذیرش و حاشیه سود را برای برند شخصی شما به همراه دارد؟",
      options: [
        { text: "محصولات دانش‌بنیان متمرکز خودآموز با قیمت دسترس‌پذیر برای جذب مخاطبان جدید و اعتبارسنجی", value: "entry_level_digital_products", icon: "CheckCircle", badge: "محصولات دسترس‌پذیر ورودی" },
        { text: "بوت‌کمپ‌های فشرده تعاملی با ظرفیت محدود، تمرین‌های عملی و بازخورد مستقیم به تمارین", value: "high_impact_cohort_bootcamps", icon: "Layers", badge: "بوت‌کمپ‌های فشرده عملی" },
        { text: "مشاوره اختصاصی ۱ به ۱ با ارزیابی دقیق پروژه و تعرفه پرستیژی های‌تیکت برای مدیران", value: "high_ticket_strategic_advisory", icon: "Crown", badge: "مشاوره ۱ به ۱ های‌تیکت" },
        { text: "عضویت سالانه در کامیونیتی خصوصی نخبگان با جلسات آنلاین مستمر و دسترسی به نتورک ارزشمند", value: "private_community_membership", icon: "Repeat", badge: "عضویت مستمر کامیونیتی" }
      ]
    },
    {
      id: "p2_step3_primary_channel",
      step: 3,
      title: "شناسایی قدرتمندترین تریبون ساخت اعتبار و جذب مخاطب",
      text: "نفوذ، مرجعیت فکری و ارتباط عمیق شما با مخاطبان از چه کانال‌هایی پایدارتر است؟",
      options: [
        { text: "لینکدین با نگارش یادداشت‌های تحلیلی عمیق، انتقال تجارب واقعی پروژه‌ها و شکست‌ها", value: "linkedin_analytical_thought_leadership", icon: "Linkedin", badge: "لینکدین و یادداشت‌های تحلیلی" },
        { text: "اینستاگرام با انتشار محتواهای آموزشی ویدیویی موجز، دقیق، بدون حواشی زرد و مستند به فکت", value: "evidence_based_educational_reels", icon: "Instagram", badge: "ریلزهای تخصصی مستند" },
        { text: "سایت شخصی با مقالات مرجع، خبرنامه هفتگی و بهینه‌سازی برای هوش مصنوعی (GEO/LLM Search)", value: "personal_website_geo_newsletter", icon: "Search", badge: "سایت شخصی و خبرنامه عمیق" },
        { text: "حضور به عنوان مهمان متخصص در پادکست‌های تراز اول کسب‌وکار و سخنرانی در همایش‌ها", value: "top_tier_podcasts_keynotes", icon: "Users", badge: "پادکست‌ها و سخنرانی‌های کلیدی" }
      ]
    },
    {
      id: "p2_step4_golden_opportunity",
      step: 4,
      title: "کشف فرصت طلایی تمایز و تبدیل شدن به تنها انتخاب مخاطب",
      text: "کدام ادعای جسورانه و اصیل، اعتبار برند شخصی شما را در این حوزه دست‌نیافتنی می‌کند؟",
      options: [
        { text: "تضمین عینی دستیابی به نتیجه ملموس با شرط بازپرداخت ۱۰۰٪ وجه در صورت عدم رضایت", value: "unconditional_result_guarantee", icon: "ShieldCheck", badge: "گارانتی قطعی بازگشت وجه" },
        { text: "پشتیبانی مستقیم شخص خودتان و بررسی اختصاصی تمرین‌ها و کیس‌های واقعی مخاطب", value: "direct_founder_mentorship", icon: "HeartHandshake", badge: "منتورشیپ مستقیم خود شما" },
        { text: "تمرکز لیزری روی حل فقط یک درد مشخص با فریم‌ورک اختصاصی و تست‌شده به جای همه چیز دانی", value: "laser_focus_single_framework", icon: "Sparkles", badge: "فریم‌ورک اختصاصی یک مسئله" },
        { text: "شفافیت رادیکال و انتشار عمومی آمارها، درس‌آموخته‌های خطاها و پشت صحنه واقعی تصمیمات", value: "radical_transparency_case_studies", icon: "Award", badge: "شفافیت رادیکال و گزارش مستند" }
      ]
    }
  ];
}
