export const PHASES_DATA = [
  {
    id: 1,
    title: "فاز ۱: کشف و بنیاد کسب‌وکار",
    subtitle: "Business Foundation & Discovery",
    status: "active",
    icon: "Compass",
    deliverableName: "شناسنامه بنیاد کسب‌وکار (Business Foundation Profile)",
    deliverableId: "01-business-foundation",
    description: "شناخت دقیق صنف و مدل عملیاتی، اهداف ملموس، ساختار خدمات و تفکیک فکت‌ها از فرضیات."
  },
  {
    id: 2,
    title: "فاز ۲: هوش بازار و پژوهش مشتری",
    subtitle: "Research & Market Intelligence",
    status: "locked",
    icon: "Search",
    deliverableName: "گزارش هوش بازار و تحلیل مشتری (Market & Customer Intelligence Report)",
    deliverableId: "02-market-research",
    description: "تحلیل رقبای مستقیم و محلی، اصطکاک و درد مشتری، کشش قیمتی و فرصت طلایی تمایز."
  },
  {
    id: 3,
    title: "فاز ۳: استراتژی و جهت‌گیری برند",
    subtitle: "Strategy & Brand Direction",
    status: "locked",
    icon: "Target",
    deliverableName: "بنیاد استراتژی برند (Brand Strategy Foundation)",
    deliverableId: "03-brand-strategy",
    description: "انتخاب سگمنت هدف، ادعای انحصار (Only-ness)، مرزهای استراتژیک و وعده تخلف‌ناپذیر برند."
  },
  {
    id: 4,
    title: "فاز ۴: هویت و شخصیت برند",
    subtitle: "Brand Identity & Character",
    status: "locked",
    icon: "Sparkles",
    deliverableName: "بنیاد هویت و شخصیت برند (Brand Identity & Character Foundation)",
    deliverableId: "04-brand-identity",
    description: "تبدیل استراتژی به کاراکتر انسانی ملموس، کهن‌الگو، صفات رفتاری و گاردریل‌های حسی."
  },
  {
    id: 5,
    title: "فاز ۵: سیستم هویت کلامی و پیام‌رسانی",
    subtitle: "Verbal Identity & Messaging",
    status: "locked",
    icon: "MessageSquareText",
    deliverableName: "سیستم هویت کلامی و پیام‌رسانی (Verbal Identity & Messaging System)",
    deliverableId: "05-verbal-identity",
    description: "سبک صدای برند، لحن، قلاب معرفی آسانسوری ۳۰ ثانیه‌ای، پیام‌های کلیدی و واژگان ممنوعه."
  },
  {
    id: 6,
    title: "فاز ۶: نام‌گذاری، شعار و جهت‌گیری خلاقانه",
    subtitle: "Naming, Tagline & Creative Direction",
    status: "locked",
    icon: "Flame",
    deliverableName: "بنیاد نام‌گذاری و جهت‌گیری خلاقانه (Naming & Creative Direction Foundation)",
    deliverableId: "06-naming-creative",
    description: "قلمرو استراتژیک نام‌گذاری، روان بودن آوا، سبک شعار محوری و بریف خلاقانه دیزاین."
  },
  {
    id: 7,
    title: "فاز ۷: سیستم طراحی هویت بصری",
    subtitle: "Visual Identity Design System",
    status: "locked",
    icon: "Palette",
    deliverableName: "کتابچه جامع هویت بصری (Visual Identity Design System)",
    deliverableId: "07-visual-identity",
    description: "پالت رنگی روان‌شناختی، تایپوگرافی فارسی، سبک لوگو، یونیفرم و اقلام محیطی و بسته‌بندی."
  },
  {
    id: 8,
    title: "فاز ۸: فعال‌سازی اجرایی، PR و مدیریت اعتبار",
    subtitle: "Executive Activation & Reputation",
    status: "locked",
    icon: "TrendingUp",
    deliverableName: "برنامه فعال‌سازی اجرایی و مدیریت اعتبار (Executive Brand Activation & Reputation System)",
    deliverableId: "08-executive-activation",
    description: "رهبری فکری یا سئوی محلی، نقشه رسانه‌ها و پادکست‌ها، قیف تجاری درآمد و پلی‌بوک حل بحران."
  }
];

export const INITIAL_QUESTIONS = [
  {
    id: "step0_description",
    step: 0,
    title: "صنف و مدل فعالیت",
    text: "سلام! به دستیار هوشمند برندینگ و استراتژی خوش آمدید. 🚀\n\nصنف و زمینه اصلی فعالیت شما چیست؟ (از کاتالوگ جامع ۷۵۳ صنف انتخاب کنید یا در کادر بنویسید)",
    options: [
      { text: "خدمات فنی و خودرویی محلی (کارواش نانو، دیتیلینگ خودرو، تعویض‌روغنی و اتوسرویس)", value: "local_automotive_service", icon: "Wrench", badge: "خدمات خودرویی محلی" },
      { text: "کافه، رستری و صنعت مهمان‌نوازی (کافی‌شاپ، رستری دانه قهوه، کافه‌رستوران و قنادی)", value: "hospitality_cafe_roastery", icon: "Coffee", badge: "پذیرایی و رستری" },
      { text: "کارخانه صنعتی و قالب‌سازی (تولید قطعات صنعتی، قالب‌سازی دقیق و ماشین‌کاری B2B)", value: "industrial_manufacturing", icon: "Factory", badge: "تولید صنعتی B2B" },
      { text: "نرم‌افزار ابری و فناوری B2B (حسابداری ابری SaaS، سامانه مودیان، ERP و پلتفرم شرکتی)", value: "b2b_saas_software", icon: "Code", badge: "نرم‌افزار ابری SaaS" },
      { text: "برند شخصی، کریتور و مربی‌گری (کوچینگ تخصصی، آموزش، مشاوره فردی و تولید محتوا)", value: "creator_coaching_personal", icon: "Briefcase", badge: "برند شخصی و آموزش" },
      { text: "آنلاین‌شاپ یا فروشگاه فیزیکی خرده‌فروشی (پوشاک، اکسسوری، کالای مصرفی)", value: "ecommerce_products", icon: "ShoppingBag", badge: "فروش کالا" }
    ]
  },
  {
    id: "step0_diagnostic_probing",
    step: 0,
    title: "دیدگاه، هویت و تمایز کسب‌وکار از نگاه شما",
    text: "حیطه کاری شما دقیقاً چیست و خودتان کسب‌وکار‌تان را چطور می‌بینید و چه هویت، تمایز و ارزشی برای آن قائلید؟",
    placeholder: "توضیح آزاد درباره زمینه کاری، تمایز، ارزش‌ها و نحوه نگاه خودتان به کسب‌وکار...",
    type: "textarea",
    options: [
      { text: "تمرکز بر کیفیت استثنایی و خروجی بدون نقص که مشتریان وفادار می‌سازد", value: "focus_craft_quality", icon: "ShieldCheck", badge: "کیفیت بی‌قیدوشرط" },
      { text: "سرعت و راحتی بی‌رقیب، تحویل فوری و صرفه‌جویی اساسی در زمان مشتری", value: "focus_speed_convenience", icon: "Zap", badge: "سرعت و سهولت" },
      { text: "نوآوری، ابزارها یا فرمول‌های مدرن و منحصربه‌فردی که رقبا هنوز ارائه نمی‌دهند", value: "focus_modern_innovation", icon: "Sparkles", badge: "نوآوری و مدرن" },
      { text: "ارتباط انسانی و مشاوره دلسوزانه؛ ما مشتری را مثل خانواده خود می‌دانیم", value: "focus_human_connection", icon: "HeartHandshake", badge: "ارتباط و همدلی" }
    ]
  },
  {
    id: "step0_stage",
    step: 0,
    title: "مرحله فعلی کسب‌وکار",
    text: "کسب‌وکار شما در حال حاضر در چه وضعیتی قرار دارد؟",
    options: [
      { text: "فقط یک ایده یا طرح اولیه در ذهن دارم", value: "idea", icon: "Lightbulb", badge: "نقطه صفر" },
      { text: "در حال تجهیز و آماده‌سازی برای راه‌اندازی‌ام", value: "pre_launch", icon: "Rocket", badge: "پیش از عرضه" },
      { text: "کسب‌وکار یا برند فعال با مشتریان جاری دارم", value: "active", icon: "TrendingUp", badge: "فعال" },
      { text: "کسب‌وکار باسابقه دارم و به دنبال بازآفرینی (ری‌برندینگ) هستم", value: "rebrand", icon: "RefreshCw", badge: "ری‌برندینگ" }
    ]
  },
  {
    id: "step0_geography",
    step: 0,
    title: "محدوده جغرافیایی مشتریان",
    text: "مشتریان اصلی شما بیشتر در چه محدوده‌ای حضور دارند؟",
    options: [
      { text: "محلی و منطقه‌ای (شعاع مشخصی از یک محله یا شهر)", value: "local_city", icon: "MapPin", badge: "محلی / حضوری" },
      { text: "سراسر کشور (ارسال کالا یا ارائه خدمت آنلاین در کل ایران)", value: "nationwide_iran", icon: "Globe", badge: "سراسری / ملی" },
      { text: "بین‌المللی و صادراتی (بازارهای خارج از کشور یا مشتریان چندزبانه)", value: "international", icon: "Plane", badge: "صادرات / بین‌المللی" }
    ]
  },
  {
    id: "step1_primary_goal",
    step: 1,
    title: "هدف ملموس کوتاه‌مدت",
    text: "مهم‌ترین دستاورد عینی که می‌خواهید طی ۳ تا ۶ ماه آینده محقق شود چیست؟",
    options: [
      { text: "جذب اولین مشتریان وفادار محلی و اعتبارسنجی سودآوری", value: "first_100_customers", icon: "Users", badge: "جذب و اثبات" },
      { text: "افزایش محسوس حجم فروش و رسیدن به درآمد پایدار ماهانه", value: "stable_monthly_revenue", icon: "DollarSign", badge: "رشد درآمد" },
      { text: "تمایز کیفی، خروج از جنگ تخفیف و افزایش حاشیه سود", value: "premium_differentiation", icon: "ShieldCheck", badge: "تمایز و سود" },
      { text: "تبدیل شدن به معتبرترین نام و مرجع خوش‌نام در منطقه یا صنف", value: "category_authority", icon: "Award", badge: "اعتبار برند" }
    ]
  },
  {
    id: "step2_core_offer",
    step: 2,
    title: "ساختار پیشنهاد اصلی",
    text: "پیشنهاد یا خدمت محوری شما به مشتری دقیقاً چیست؟",
    options: [
      { text: "یک خدمت حضوری یا فنی استاندارد با تحویل سریع و تضمینی", value: "core_service_delivery", icon: "CheckCircle", badge: "خدمت محوری" },
      { text: "منو یا سبد محصولات فیزیکی مشخص با کیفیت اثبات‌شده", value: "physical_catalog_menu", icon: "Box", badge: "محصول / منو" },
      { text: "اشتراک ماهانه، شارژ دوره‌ای یا قرارداد همکاری مستمر", value: "subscription_recurring", icon: "Repeat", badge: "اشتراک / دوره‌ای" },
      { text: "پروژه سفارشی، خط تولید اختصاصی یا بسته مشاوره جامع", value: "custom_solution_project", icon: "Cpu", badge: "راهکار جامع" }
    ]
  },
  {
    id: "step2_value_hypothesis",
    step: 2,
    title: "فرضیه تمایز و ارزش محوری",
    text: "مشتری چرا باید شما را به جای هر رقیب دیگری در بازار انتخاب کند؟",
    options: [
      { text: "کیفیت برتر، متریال درجه یک و تعهد واقعی به تمیزی و دقت", value: "quality_precision", icon: "ShieldCheck", badge: "کیفیت و اصالت" },
      { text: "سرعت بالا، سهولت دسترسی و صرفه‌جویی محسوس در وقت مشتری", value: "speed_convenience", icon: "Zap", badge: "سرعت و راحتی" },
      { text: "تجربه مشتری کم‌نظیر، برخورد صمیمانه و محیطی محترمانه و آراسته", value: "customer_experience", icon: "HeartHandshake", badge: "تجربه مشتری" },
      { text: "قیمت منصفانه و شفاف در کنار تخصص بالای کادر فنی", value: "fair_pricing_expertise", icon: "Tag", badge: "ارزش اقتصادی" }
    ]
  }
];
