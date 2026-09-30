/**
 * DIGITAL MARKET — Business Cases & Scenarios Suite
 *
 * Contains 16 full business scenarios:
 * - 12 baseline scenarios (Cafe, Beauty, Fashion Ecom, Automotive, Tax SaaS, Machining,
 *   Dental Clinic, Restaurant, Textile, Education, Management Consulting, Grocery).
 * - 4 NEW scenarios (Industrial B2B Repair, Legal Services, Agriculture Produce, Hybrid Retail/Online).
 * - Contrast variations for a single guild (budget, capacity, margin, price vs quality sensitivity).
 * - Negative guarantee and compound answer cases.
 */

export const EVALUATION_CATEGORIES = Object.freeze({
  READY_AS_DRAFT: 'قابل استفاده به‌عنوان پیش‌نویس',
  NEEDS_DATA: 'نیازمند داده',
  NEEDS_PROFESSIONAL_REVIEW: 'نیازمند بازبینی حرفه‌ای',
  INADEQUATE: 'نامناسب',
});

export const BUSINESS_CASES = [
  // 1. Cafe & Roastery
  {
    id: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی و رستری موج سوم',
    taxonomyId: 'BT-0066',
    industryId: 'IND-03',
    industryCode: 'FOOD_HOSPITALITY',
    primaryArchetype: 'RESTAURANT_CAFE_HOSPITALITY',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-CAFE',
    expectedKeywords: ['فنجان', 'رست', 'طعم', 'ضایعات'],
    forbiddenKeywords: ['تعمیرگاه خودرو', 'قالب‌سازی', 'پوست و مو'],
    financials: { price: 120000, variableCost: 45000, fixedCost: 35000000, sales: 800, capacity: 1200 },
    answers: {
      1: {
        coreOffer: 'قهوه تخصصی تک‌خاستگاه با رست تازه هفتگی',
        primaryGoal: 'افزایش سهم فروش بسته‌های دانه قهوه به مشتریان حضوری',
        budgetConstraint: 'بودجه محدود ۱۵ میلیون تومان ماهانه و تیم سه نفره',
        valueHypothesis: 'شفافیت پروفایل طعمی و تاریخ رست تازه هفتگی روی پاکت',
      },
      2: {
        competitors: 'کافه‌های بیرون‌بر محله و برندهای صنعتی سوپرمارکتی',
        customerPain: 'کیفیت ناپایدار طعم قهوه و رست‌های کهنه بدون شناسنامه',
        pricingModel: 'قیمت منصفانه فنجان ۱۲۰ هزار تومان و پاکت دانه ۲۵۰ گرمی ۳۵۰ هزار تومان',
        primaryChannel: 'فروش حضوری سالن و صفحه اینستاگرام محلی',
        goldenOpportunity: 'روایت داستان خاستگاه دانه و مزه‌سنجی هفتگی برای مشتریان',
      },
      3: {
        targetSegment: 'متخصصان، دانشجویان و قهوه‌نوش‌های حرفه‌ای منطقه',
        positioning: 'رستری تخصصی با تمرکز بر شفافیت طعم و تازگی بی‌واسطه',
        boundary: 'عدم ورود به منوی غذاهای سنگین و حفظ هویت تخصصی برشته‌کاری',
        promise: 'ارائه فنجان استاندارد با دانه تازه رست‌شده زیر ۱۴ روز',
      },
      4: { archetype: 'خالق و همیار متخصص', traits: 'دقیق، صمیمی و آموزش‌دهنده', toneGuardrail: 'بدون ادعای اغراق‌آمیز و نگاه از بالا به مشتری' },
      5: { voiceStyle: 'روشن، صمیمی و تخصصی', elevatorHook: 'قهوه تازه با طعم اصیل تک‌خاستگاه، بدون واسطه و بدون کهنگی', forbiddenWords: 'بهترین قهوه جهان، ارزان‌ترین' },
      6: { naming: 'برشته‌کاری رایکا', tagline: 'طعم اصیل دانه‌های تازه' },
      7: { colorPalette: 'قهوه‌ای رست تیره، کرم کتان و برنز ملایم', typography: 'پایدار و مدرن خوانا', logoConcept: 'نشان دانه قهوه هندسی مینیمال' },
      8: { thoughtLeadership: 'راهنمای تشخیص قهوه تازه از کهنه', prChannels: 'شبکه‌های اجتماعی و کارگاه‌های عمومی مزه‌شناسی', leadFunnel: 'تجربه فنجان ← ثبت در کلوب ← خرید بسته دانه', reputationCrisis: 'پذیرش فوری نارضایتی از طعم و تعویض بی‌قیدوشرط فنجان' },
    },
  },

  // 2. Beauty Salon
  {
    id: 'case_beauty_salon',
    titleFa: 'سالن زیبایی و مراقبت مو',
    taxonomyId: 'BT-0100',
    industryId: 'IND-04',
    industryCode: 'HEALTH_BEAUTY',
    primaryArchetype: 'LOCAL_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-BEAUTY',
    expectedKeywords: ['احیا', 'مراقبت', 'رزرو', 'مو'],
    forbiddenKeywords: ['تعمیرگاه', 'دیتیلینگ خودرو', 'ضایعات غذا'],
    financials: { price: 650000, variableCost: 200000, fixedCost: 45000000, sales: 180, capacity: 250 },
    answers: {
      1: { coreOffer: 'خدمات تخصصی احیا و مراقبت سلامت مو با مواد ارگانیک', primaryGoal: 'افزایش نرخ رزرو مجدد مشتریان فعلی به بالای ۷۰٪', budgetConstraint: 'بودجه بازاریابی محدود ۱۰ میلیون تومان', valueHypothesis: 'سلامت پایدار مو بدون آسیب شیمیایی و مشاوره قبل از کار' },
      2: { competitors: 'سالن‌های تخفیف‌محور و سالن‌های بزرگ منطقه', customerPain: 'آسیب دیدن مو با مواد بی‌کیفیت و قیمت‌های متغیر غیرشفاف', pricingModel: 'پکیج پایه ۶۵۰ هزار تومان با اعلام قبلی تمام هزینه‌ها', primaryChannel: 'معرفی مشتریان قبلی و نمونه‌کارهای تصویری شفاف', goldenOpportunity: 'مشاوره صادقانه آسیب‌شناسی مو قبل از هرگونه خدمات' },
      3: { targetSegment: 'خانم‌های شاغل و علاقه‌مند به سلامت طبیعی مو', positioning: 'کلینیک تخصصی سلامت و احیای ساقه مو با مواد دارای تاییدیه', boundary: 'عدم انجام کارهای آسیب‌رسان و دکلره‌های مکرر غیرایمن', promise: 'بهبود محسوس بافت مو با تضمین اصالت متریال مصرفی' },
      4: { archetype: 'مراقب و همیار دلسوز', traits: 'صبور، شفاف و محافظ سلامت مشتری', toneGuardrail: 'بدون قضاوت ظاهر و بدون ایجاد اضطراب زیبایی' },
      5: { voiceStyle: 'آرامش‌بخش، محترمانه و دقیق', elevatorHook: 'مراقبت علمی از موی شما، شفاف در قیمت و متعهد به سلامت ساقه مو', forbiddenWords: 'معجزه زیبایی، صددرصد تضمینی' },
      6: { naming: 'استودیو موی هورام', tagline: 'سلامت مو، اصالت زیبایی' },
      7: { colorPalette: 'سبز زیتونی ملایم، شنی و سفید خالص', typography: 'ظریف و چشم‌نواز فارسی', logoConcept: 'ترکیب خطی تار مو و برگ گیاه' },
      8: { thoughtLeadership: 'روتین مراقبت خانگی از موهای آسیب‌دیده', prChannels: 'ویدیوهای آموزشی بدون فیلتر روتوش', leadFunnel: 'مشاوره آنلاین ← ویزیت حضوری ← درمان ← پیگیری هفتگی', reputationCrisis: 'پذیرش هرگونه نارضایتی و درمان ترمیمی رایگان' },
    },
  },

  // 3. Online Fashion E-Commerce
  {
    id: 'case_fashion_ecommerce',
    titleFa: 'فروشگاه آنلاین مد و پوشاک پایدار',
    taxonomyId: 'BT-0001',
    industryId: 'IND-25',
    industryCode: 'FASHION_APPAREL',
    primaryArchetype: 'ECOMMERCE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-TEXTILE',
    expectedKeywords: ['سایز', 'مرجوع', 'پارچه', 'ارسال'],
    forbiddenKeywords: ['تعمیرگاه خودرو', 'چلوکباب', 'دندان‌پزشکی'],
    financials: { price: 850000, variableCost: 480000, fixedCost: 60000000, sales: 450, capacity: 1000 },
    answers: {
      1: { coreOffer: 'پوشاک کژوال الیاف طبیعی زنانه با الگوهای استاندارد ایرانی', primaryGoal: 'کاهش نرخ مرجوعی کالا و افزایش خرید تکرار', budgetConstraint: 'بودجه ۲۵ میلیون تومان و اتکا به فروش آنلاین', valueHypothesis: 'دوخت صنعتی دقیق و جدول تطبیق سایز بر حسب سانتیمتر' },
      2: { competitors: 'برندهای فست‌فشن اینستاگرامی و وارداتی قاچاق', customerPain: 'عدم تطابق سایز دریافتی و کیفیت پایین پارچه پس از شست‌وشو', pricingModel: 'قیمت متوسط ۸۵۰ هزار تومان با ارسال شفاف', primaryChannel: 'سایت فروشگاهی اختصاصی و شبکه‌های اجتماعی', goldenOpportunity: 'سیاست تعویض سایز رایگان در اولین خرید' },
      3: { targetSegment: 'زنان ۲۰ تا ۳۵ سال علاقه‌مند به استایل مینیمال', positioning: 'پوشاک الیاف طبیعی با استانداردهای تن‌خور دقیق', boundary: 'عدم استفاده از پارچه‌های الیاف مصنوعی بازیافتی بی‌کیفیت', promise: 'تطابق کامل کالای ارسالی با تصاویر و جدول سایز' },
      4: { archetype: 'هنرمند و صمیمی', traits: 'زیباشناس، صادق و به‌روز', toneGuardrail: 'بدون شلوغ‌کاری تبلیغاتی و ادعاهای واهی برندینگ خارجی' },
      5: { voiceStyle: 'راحت، صمیمی و شیک', elevatorHook: 'لباسی که روی تنت می‌نشیند؛ پارچه طبیعی و دوخت تمیز با ضمانت سایز', forbiddenWords: 'برند شماره یک جهان، لوکس‌ترین' },
      6: { naming: 'پوشاک کتان‌ماه', tagline: 'راحتی در هر تار و پود' },
      7: { colorPalette: 'خاکی طبیعی، نوک‌مدادی و سفید عاجی', typography: 'مینیمال هندسی', logoConcept: 'نشان مونوگرام ترکیب بافت پارچه' },
      8: { thoughtLeadership: 'راهنمای مراقبت و شست‌وشوی البسه الیاف طبیعی', prChannels: 'همکاری با استایلیست‌های واقعی و نقد صادقانه لباس', leadFunnel: 'محتوای استایل ← بازدید لندینگ ← خرید اول ← ایمیل پیگیری سایز', reputationCrisis: 'پشتیبانی فوری تعویض سایز و مرجوعی وجه بدون پرسش' },
    },
  },

  // 4. Automotive Detailing & Car Wash
  {
    id: 'case_auto_detailing',
    titleFa: 'کارواش و دیتیلینگ تخصصی خودرو',
    taxonomyId: 'BT-0136',
    industryId: 'IND-05',
    industryCode: 'AUTOMOTIVE_SERVICES_SALES',
    primaryArchetype: 'LOCAL_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-AUTOMOTIVE',
    expectedKeywords: ['خودرو', 'باکس', 'سرویس', 'پذیرش'],
    forbiddenKeywords: ['سالن زیبایی زنانه', 'منوی غذا', 'نرم‌افزار ابری'],
    financials: { price: 400000, variableCost: 120000, fixedCost: 28000000, sales: 220, capacity: 300 },
    answers: {
      1: { coreOffer: 'روشویی نانو، صفرشویی کابین و احیای رنگ تخصصی خودرو', primaryGoal: 'پر کردن ظرفیت باکس‌ها در روزهای میانی هفته', budgetConstraint: 'بودجه تبلیغات محلی ۸ میلیون تومان', valueHypothesis: 'عدم استفاده از مواد اسیدی مخرب رنگ و تحویل سر وقت' },
      2: { competitors: 'کارواش‌های سنتی دستی و مراکز متفرقه تعویض روغن', customerPain: 'ایجاد خط و خش با کهنه کثیف و اتلاف وقت طولانی در صف', pricingModel: 'پکیج پایه ۴۰۰ هزار تومان با زمان‌بندی نوبت قطعی', primaryChannel: 'موقعیت محلی و سیستم نوبت‌دهی آنلاین محلی', goldenOpportunity: 'رزرو ساعت مشخص و تحویل مستند با چک‌لیست قبل و بعد' },
      3: { targetSegment: 'مالکان خودروهای شخصی حساس به سلامت بدنه', positioning: 'مرکز نگهداری و زیبایی خودرو با استاندارد مراقبت رنگ', boundary: 'عدم پذیرش خودرو فراتر از ظرفیت باکس‌ها', promise: 'شست‌وشوی بدون سایش با شوینده‌های دارای pH خنثی' },
      4: { archetype: 'متخصص فنی دقیق', traits: 'منظم، مسئولیت‌پذیر و تمیز', toneGuardrail: 'بدون الفاظ بازاری غیرحرفه‌ای و ادعاهای تخیلی آب‌گریزی ابدی' },
      5: { voiceStyle: 'محکم، حرفه‌ای و قابل اتکا', elevatorHook: 'مراقبت علمی از رنگ خودرو شما؛ نوبت‌دهی دقیق بدون اتلاف وقت در صف', forbiddenWords: 'تضمین مادام‌العمر، ضدگلوله' },
      6: { naming: 'اتواسپا پرشین', tagline: 'درخشش ماندگار، مراقبت اصیل' },
      7: { colorPalette: 'خاکستری تیره گرافیتی، مشکی مات و آبی کبالت', typography: 'صنعتی خوانا و مدرن', logoConcept: 'فرم آیرودینامیک بدنه خودرو' },
      8: { thoughtLeadership: 'آسیب‌های مواد شوینده اسیدی به کیلر رنگ خودرو', prChannels: 'نمایش قبل و بعد وضعیت رنگ با نورپردازی بازرسی', leadFunnel: 'رزرو آنلاین ← بازرسی بدنه ← انجام کار ← کارت سابقه سرویس', reputationCrisis: 'پرداخت خسارت احتمالی طبق چک‌لیست پذیرش و دوربین مداربسته' },
    },
  },

  // 5. Cloud Tax/Accounting SaaS
  {
    id: 'case_tax_saas',
    titleFa: 'نرم‌افزار ابری سامانه مودیان و صورتحساب مالیاتی',
    taxonomyId: 'BT-0166',
    industryId: 'IND-06',
    industryCode: 'IT_SOFTWARE',
    primaryArchetype: 'SAAS',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-TAX-SAAS',
    expectedKeywords: ['مودیان', 'ارسال', 'اشتراک', 'قانون'],
    forbiddenKeywords: ['کارواش خودرو', 'منوی رستوران', 'رنگ مو'],
    financials: { price: 3500000, variableCost: 300000, fixedCost: 95000000, sales: 90, capacity: 500 },
    answers: {
      1: { coreOffer: 'پنل صدور و ارسال مستقیم صورتحساب الکترونیکی به سامانه مودیان', primaryGoal: 'کاهش اضطراب جریمه مالیاتی کسب‌وکارهای متوسط', budgetConstraint: 'بودجه ۵۰ میلیون تومان و اتکا به دیجیتال مارکتینگ B2B', valueHypothesis: 'اعتبارسنجی پیش از ارسال با خطای صفر در کارپوشه سازمان امور مالیاتی' },
      2: { competitors: 'نرم‌افزارهای سنتی حسابداری گران‌قیمت و اکسل‌های دستی', customerPain: 'پیچیدگی قوانین پایانه‌های فروشگاهی و خطر رد صورتحساب', pricingModel: 'اشتراک سالانه ۳.۵ میلیون تومان با ارسال نامحدود', primaryChannel: 'وب‌سایت، همایش‌های مالیاتی و معرفی جامعه حسابداران', goldenOpportunity: 'استقرار نیم‌ساعته بدون نیاز به نصب سرور و آموزش پیچیده' },
      3: { targetSegment: 'شرکت‌های بازرگانی و فروشگاه‌های مشمول ماده ۱ قانون تسهیل', positioning: 'ساده‌ترین و پایدارترین راهکار انطباق با سامانه مودیان در ایران', boundary: 'عدم ارائه مشاوره فرار مالیاتی و التزام به قوانین مصوب مجلس', promise: 'پشتیبانی فنی در تمام روزهای ارسال و انطباق مستمر با آخرین بخشنامه‌ها' },
      4: { archetype: 'راهنما و قانون‌مدار', traits: 'دقیق، ایمن و تسکین‌دهنده ریسک مالیاتی', toneGuardrail: 'بدون تضمین معافیت مالیاتی غیرقانونی و ترویج راه‌های دور زدن' },
      5: { voiceStyle: 'تخصصی، اطمینان‌بخش و شفاف', elevatorHook: 'ارسال بی‌دغدغه فاکتورها به سامانه مودیان؛ همیشه منطبق با آخرین اصلاحیه قانون تسهیل', forbiddenWords: 'معافیت صددرصد، دور زدن مالیات' },
      6: { naming: 'ابرپایش مودیان', tagline: 'انطباق مطمئن، آسودگی حسابداری' },
      7: { colorPalette: 'آبی تیره سازمانی، سفید برفی و خاکستری فولادی', typography: 'رسمی و استوار سازمانی', logoConcept: 'سپر ایمنی ترکیب‌شده با نماد ارسال داده' },
      8: { thoughtLeadership: 'تفسیر آخرین بخشنامه‌های قانون پایانه‌های فروشگاهی', prChannels: 'وبینارهای مشترک با اساتید جامعه حسابداران', leadFunnel: 'دموی رایگان ← تماس کارشناسی ← عقد اشتراک ← پشتیبانی استقرار', reputationCrisis: 'شفاف‌سازی قطعی‌های احتمالی سرور سازمان و ارائه لاگ خطا به مشتری' },
    },
  },

  // 6. Industrial Precision Machining
  {
    id: 'case_industrial_machining',
    titleFa: 'قالب‌سازی و ماشین‌کاری دقیق صنعتی CNC',
    taxonomyId: 'BT-0221',
    industryId: 'IND-08',
    industryCode: 'B2B_MANUFACTURING',
    primaryArchetype: 'MANUFACTURER',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-MACHINING',
    expectedKeywords: ['قطعه', 'تلرانس', 'ماشین', 'تحویل'],
    forbiddenKeywords: ['کافه سالن', 'مراقبت پوست', 'فست‌فشن'],
    financials: { price: 18000000, variableCost: 9500000, fixedCost: 80000000, sales: 12, capacity: 18 },
    answers: {
      1: { coreOffer: 'ماشین‌کاری قطعات حساس با تلرانس میکرونی و ساخت قالب‌های دقیق', primaryGoal: 'ورود به وندورلیست صنایع خودروسازی و لوازم خانگی', budgetConstraint: 'بودجه مبتنی بر قراردادهای کارگاهی و سرمایه در گردش محدود', valueHypothesis: 'برگه کنترل کیفی CMM و تکرارپذیری دقیق ابعادی قطعه' },
      2: { competitors: 'کارگاه‌های سنتی تراشکاری و واردات قطعات چینی', customerPain: 'تاخیر در تحویل و عدم انطباق ابعادی که موجب توقف خط مونتاژ می‌شود', pricingModel: 'محاسبه نفرساعت و متریال با پیش‌پرداخت ۴۰٪', primaryChannel: 'بازاریابی صنعتی مستقیم، بازدید فنی از کارخانه و شبکه همکاران', goldenOpportunity: 'تعهد تحویل سر موعد با جریمه دیرکرد در قرارداد' },
      3: { targetSegment: 'مدیران خرید و زنجیره تامین کارخانجات صنعتی', positioning: 'شریک مطمئن ماشین‌کاری دقیق برای خطوط تولید پیوسته', boundary: 'عدم پذیرش سفارشات غیراستاندارد با متریال نامشخص', promise: 'تحویل قطعه منطبق بر نقشه مهندسی با گزارش آزمون ابعادی' },
      4: { archetype: 'مهندس صنعتگر کمال‌گرا', traits: 'سخت‌گیر در کیفیت، متعهد و فنی', toneGuardrail: 'پرهیز از شعارهای تبلیغاتی غیرفنی و کلی‌گویی' },
      5: { voiceStyle: 'فنی، مستند و مهندسی', elevatorHook: 'دقت میکرونی در ابعاد، تحویل قطعی در زمان؛ خط تولید شما متوقف نخواهد شد', forbiddenWords: 'ارزان‌ترین قطعه بازار، بدون عیب تضمینی' },
      6: { naming: 'صنعت‌ابزار پویا', tagline: 'دقت در مقیاس میکرون' },
      7: { colorPalette: 'آبی تیره صنعتی، نقره‌ای متالیک و خاکستری گرافیت', typography: 'فنی و هندسی محکم', logoConcept: 'نشان کولیس مهندسی و مهره شش‌گوش' },
      8: { thoughtLeadership: 'اثر انتخاب متریال در عمر مفید قالب‌های سنبه ماتریس', prChannels: 'نمایشگاه‌های تخصصی صنعت و کاتالوگ‌های مهندسی', leadFunnel: 'ارسال نقشه ← ارزیابی مهندسی ← نمونه اولیه ← تولید سری', reputationCrisis: 'فراخوان و اصلاح فوری قطعات معیوب با اعزام کارشناس فنی' },
    },
  },

  // 7. Specialized Dental Clinic
  {
    id: 'case_dental_clinic',
    titleFa: 'کلینیک تخصصی دندان‌پزشکی دیجیتال',
    taxonomyId: 'BT-0100',
    industryId: 'IND-04',
    industryCode: 'HEALTH_BEAUTY',
    primaryArchetype: 'LOCAL_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-MEDICAL',
    expectedKeywords: ['درمان', 'نوبت', 'مجوز', 'بیمار'],
    forbiddenKeywords: ['تعمیرگاه مکانیکی', 'ضایعات آشپزخانه', 'قالب صنعتی'],
    financials: { price: 4500000, variableCost: 1500000, fixedCost: 110000000, sales: 60, capacity: 90 },
    answers: {
      1: { coreOffer: 'ایمپلنت و ترمیم‌های زیبایی دندان با اسکن سه‌بعدی دیجیتال', primaryGoal: 'افزایش پذیرش پلن‌های درمانی تخصصی توسط مراجعین', budgetConstraint: 'بودجه ۲۵ میلیون تومان با تمرکز بر پرسنال برندینگ پزشکان', valueHypothesis: 'شبیه‌سازی دیجیتال نتیجه درمان قبل از شروع کار و استریلیزاسیون پیشرفته' },
      2: { competitors: 'کلینیک‌های بزرگ زنجیره‌ای و مطب‌های عمومی', customerPain: 'ترس از درد درمان، ابهام در هزینه‌ها و عدم ماندگاری ترمیم‌ها', pricingModel: 'طرح پرداخت اقساطی برای درمان‌های جامع و اعلام قیمت مکتوب', primaryChannel: 'رضایت مراجعین قبلی، وب‌سایت پزشکی و ارجاع متخصصین', goldenOpportunity: 'جلسه مشاوره اولیه با اسکن رایگان و نمایش طرح درمان' },
      3: { targetSegment: 'بزرگسالان نیازمند بازسازی لبخند و کاشت ایمپلنت', positioning: 'مرکز تخصصی دندانپزشکی کم‌تهاجمی با فناوری دیجیتال', boundary: 'عدم انجام درمان‌های غیرضروری و غیرعلمی صرفاً زیبایی', promise: 'درمان اصولی مطابق استانداردهای روز دندانپزشکی بین‌المللی' },
      4: { archetype: 'پزشک دلسوز و دانشمند', traits: 'اخلاق‌مدار، آرامش‌بخش و باصداقت', toneGuardrail: 'رعایت کامل کدهای اخلاق پزشکی و عدم تضمین نتیجه ۱۰۰٪ درمانی' },
      5: { voiceStyle: 'علمی، آرام و تسکین‌دهنده', elevatorHook: 'لبخند شما سرمایه سلامتی شماست؛ درمان دیجیتال دندان با کمترین درد و بالاترین دقت', forbiddenWords: 'تضمین مادام‌العمر دندان، ارزان‌ترین ایمپلنت' },
      6: { naming: 'کلینیک دندانپزشکی درسا', tagline: 'دقت در فناوری، آرامش در لبخند' },
      7: { colorPalette: 'آبی فیروزه‌ای ملایم، سفید استریل و نقره‌ای', typography: 'خوانا، مدرن و آرامش‌بخش', logoConcept: 'ترکیب فرم انتزاعی دندان و لبخند دیجیتال' },
      8: { thoughtLeadership: 'طول عمر واقعی ایمپلنت و راه‌های پیشگیری از تحلیل استخوان', prChannels: 'ویدیوهای آموزشی سلامت دهان و دندان', leadFunnel: 'مشاوره آنلاین ← اسکن دیجیتال ← پلن درمان ← پیگیری سالانه', reputationCrisis: 'پروتکل مشخص ویزیت مجدد و رسیدگی به عوارض احتمالی بیمار' },
    },
  },

  // 8. Traditional Restaurant
  {
    id: 'case_restaurant_traditional',
    titleFa: 'رستوران سنتی و کباب‌سرای بازار',
    taxonomyId: 'BT-0071',
    industryId: 'IND-03',
    industryCode: 'FOOD_HOSPITALITY',
    primaryArchetype: 'RESTAURANT_CAFE_HOSPITALITY',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-RESTAURANT',
    expectedKeywords: ['کباب', 'آشپزخانه', 'ضایعات', 'غذا'],
    forbiddenKeywords: ['سرویس روغن خودرو', 'قالب صنعتی', 'نرم‌افزار ابری'],
    financials: { price: 320000, variableCost: 160000, fixedCost: 90000000, sales: 1200, capacity: 1600 },
    answers: {
      1: { coreOffer: 'چلوکباب سنتی با گوشت گرم گوسفندی تازه و برنج صددرصد ایرانی', primaryGoal: 'افزایش فروش شرکتی در وعده ناهار روزهای کاری', budgetConstraint: 'بودجه بازاریابی ۲۰ میلیون تومان ماهانه', valueHypothesis: 'ثبات طعم اصیل بدون افزودنی و اسانس صنعتی' },
      2: { competitors: 'تهیه‌غذاهای ارزان‌قیمت و رستوران‌های زنجیره‌ای', customerPain: 'کیفیت پایین گوشت و برنج مخلوط در کباب‌های ارزان بازار', pricingModel: 'قیمت متوسط رو به بالا ۳۲۰ هزار تومان به ازای هر پرس', primaryChannel: 'مراجعه حضوری سالن و سفارشات سازمانی اطراف بازار', goldenOpportunity: 'ارائه بسته‌بندی ویژه حفظ حرارت برای سفارشات ارسالی' },
      3: { targetSegment: 'کسبه بازار، مدیران شرکت‌ها و خانواده‌های اصیل', positioning: 'کباب‌سرای معتبر با شفافیت کامل در زنجیره تامین گوشت گرم', boundary: 'عدم استفاده از گوشت منجمد وارداتی یا سنگدان مرغ', promise: 'غذای باکیفیت و اصیل با همان طعم و وزن مشخص همیشگی' },
      4: { archetype: 'میزبان اصیل و متعهد', traits: 'دست‌ودلباز، خوش‌برخورد و امین', toneGuardrail: 'بدون اداهای غیرایرانی و حفظ صمیمیت بازار' },
      5: { voiceStyle: 'گرم، اصیل و مطمئن', elevatorHook: 'کباب اصیل ایرانی با گوشت گرم گوسفندی؛ غذایی که با افتخار سر سفره خانواده می‌برید', forbiddenWords: 'سریع‌ترین فست‌فود، گوشت معجزه‌آسا' },
      6: { naming: 'کباب‌سرای حاج رضا', tagline: 'طعم ماندگار اعتماد' },
      7: { colorPalette: 'زرشکی گرم، طلایی خردلی و سرمه‌ای سنتی', typography: 'فارسی نستعلیق مدرن‌شده خوانا', logoConcept: 'ترنج سنتی ایرانی در قاب مدرن' },
      8: { thoughtLeadership: 'نحوه تشخیص کباب کوبیده سالم از ترکیبات نامرغوب', prChannels: 'تور بازدید از آشپزخانه برای مشتریان شرکتی', leadFunnel: 'غذای سالن ← منوی شرکتی ← قرارداد فصلی تامین ناهار', reputationCrisis: 'توقف فوری سرو و استرداد کامل وجه در صورت نارضایتی از غذا' },
    },
  },

  // 9. Textile & Garment Manufacturing
  {
    id: 'case_textile_manufacturing',
    titleFa: 'تولیدی پوشاک و تریکو تیراژ بالا',
    taxonomyId: 'BT-0221',
    industryId: 'IND-25',
    industryCode: 'FASHION_APPAREL',
    primaryArchetype: 'MANUFACTURER',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-TEXTILE',
    expectedKeywords: ['دوخت', 'پارچه', 'تیراژ', 'سفارش'],
    forbiddenKeywords: ['تعمیرگاه اتومبیل', 'منوی غذا', 'ایمپلنت دندان'],
    financials: { price: 280000, variableCost: 170000, fixedCost: 65000000, sales: 2500, capacity: 4000 },
    answers: {
      1: { coreOffer: 'تولید عمده انواع تیشرت و شلوار راحتی تریکو با پارچه سوپرپنبه', primaryGoal: 'همکاری مستقیم با فروشگاه‌های زنجیره‌ای و بنکداران', budgetConstraint: 'سرمایه در گردش برای خرید نخ و پارچه', valueHypothesis: 'دوخت صنعتی تمیز بدون پرزدهی و آبرفت پارچه' },
      2: { competitors: 'پوشاک استوک بنگلادشی و تولیدی‌های زیرپله‌ای بی‌کیفیت', customerPain: 'آبرفت پارچه پس از اولین شست‌وشو و دوخت نامنظم درزها', pricingModel: 'قیمت عمده ۲۸۰ هزار تومان به ازای هر جین با تخفیف تیراژ', primaryChannel: 'نمایشگاه‌های تخصصی نساجی و دفتر فروش بازار عمده', goldenOpportunity: 'ارائه نمونه شسته شده و آزمون آزمایشگاهی ثبات رنگ' },
      3: { targetSegment: 'بنکداران پوشاک، فروشگاه‌های زنجیره‌ای و برندهای ریتیل', positioning: 'تولیدکننده باثبات تریکو با کنترل کیفی خطی و تحویل منظم', boundary: 'عدم پذیرش سفارش با پارچه‌های پلی‌استر ارزان بدون رضایت خریدار', promise: 'ثبات ابعادی و تضمین عدم آبرفت پارچه‌ها' },
      4: { archetype: 'صنعتگر خستگی‌ناپذیر', traits: 'عملگرا، شفاف و وقت‌شناس', toneGuardrail: 'بدون غلو در تیراژ و صداقت در زمان تحویل' },
      5: { voiceStyle: 'صنعتی، صریح و اطمینان‌بخش', elevatorHook: 'تولید انبوه پوشاک با کیفیت صادراتی؛ دوخت محکم و پارچه پنبه بدون آبرفت', forbiddenWords: 'بهترین تریکو در کهکشان' },
      6: { naming: 'تریکوبافت البرز', tagline: 'تولید پیوسته، کیفیت استوار' },
      7: { colorPalette: 'آبی نیلی، نوک‌مدادی و سفید', typography: 'هندسی سنگین', logoConcept: 'گره دوخت و تار و پود بافته‌شده' },
      8: { thoughtLeadership: 'راهنمای استاندارد انتخاب گرماژ پارچه تریکو برای فصول مختلف', prChannels: 'کاتالوگ متریال و نمونه کالیته پارچه', leadFunnel: 'ارسال کالیته ← سفارش نمونه اولیه ← تولید تیراژ ← قرارداد تامین', reputationCrisis: 'مرجوعی بدون جریمه طاقه‌های معیوب و تعویض رایگان' },
    },
  },

  // 10. Education/Language Institute
  {
    id: 'case_education_academy',
    titleFa: 'آکادمی آموزش زبان‌های خارجی و آیلتس',
    taxonomyId: 'BT-0300',
    industryId: 'IND-14',
    industryCode: 'EDUCATION_TRAINING',
    primaryArchetype: 'LOCAL_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-LOCAL-RETAIL',
    expectedKeywords: ['کلاس', 'آموزش', 'زبان', 'دوره'],
    forbiddenKeywords: ['روغن موتور', 'ضایعات آشپزخانه', 'قالب قطعه'],
    financials: { price: 2200000, variableCost: 750000, fixedCost: 55000000, sales: 85, capacity: 150 },
    answers: {
      1: { coreOffer: 'دوره‌های فشرده آمادگی آیلتس با آزمون‌های ماک هفتگی', primaryGoal: 'افزایش نرخ کسب نمره بالای ۷ توسط زبان‌آموزان', budgetConstraint: 'بودجه ۱۵ میلیون تومان در شبکه‌های اجتماعی', valueHypothesis: 'تحلیل دقیق نقاط ضعف اسپیکینگ و رایتینگ توسط ممتحن سابق' },
      2: { competitors: 'موسسات بزرگ عمومی و پلتفرم‌های خودآموز آنلاین', customerPain: 'کلاس‌های شلوغ با اتلاف وقت و عدم پیشرفت نمره رایتینگ', pricingModel: 'شهریه هر ترم ۲.۲ میلیون تومان در گروه‌های حداکثر ۸ نفره', primaryChannel: 'سایت آموزشی، معرفی دوستان و تولید محتوای تخصصی', goldenOpportunity: 'جلسه تعیین سطح تحلیلی رایگان با نقشه راه شخصی‌سازی شده' },
      3: { targetSegment: 'متقاضیان مهاجرت تحصیلی و کاری نیازمند نمره سریع آیلتس', positioning: 'مرکز تخصصی کوچینگ آیلتس با تمرکز بر مهارت‌های خروجی‌محور', boundary: 'عدم دادن وعده دروغین قبولی بدون مطالعه و آزمون', promise: 'پیگیری هفتگی و بازخورد کتبی روی تمام تمرین‌های رایتینگ' },
      4: { archetype: 'استاد دانشمند و مربی حامی', traits: 'صبور، علمی و ساختاریافته', toneGuardrail: 'بدون فریب مخاطب با عباراتی چون آیلتس در ۱۰ روز' },
      5: { voiceStyle: 'علمی، انگیزه‌بخش و دقیق', elevatorHook: 'نقشه راه واقعی برای نمره آیلتس؛ تمرین هدفمند با گروه‌های کم‌جمعیت و بازخورد فردی', forbiddenWords: 'آیلتس تضمینی بدون تلاش، مدرک فوری' },
      6: { naming: 'آکادمی زبان فراراه', tagline: 'دانش عمیق، نتیجه روشن' },
      7: { colorPalette: 'آبی درباری، نارنجی کدو تنبل و سفید', typography: 'مدرن و خوانا', logoConcept: 'قلم ترکیب‌شده با مسیر رشد صعودی' },
      8: { thoughtLeadership: 'شایع‌ترین خطاهای گرامری داوطلبان ایرانی در آزمون آیلتس', prChannels: 'کانال محتوای تخصصی و پادکست‌های آموزش تلفظ', leadFunnel: 'تعیین سطح ← وبینار استراتژی ← ثبت‌نام دوره ← پشتیبانی تا آزمون', reputationCrisis: 'جلسات رفع اشکال رایگان اختصاصی در صورت عدم رضایت از پیشرفت' },
    },
  },

  // 11. Management Consulting Firm
  {
    id: 'case_management_consulting',
    titleFa: 'دفتر مشاوره مدیریت و سازمان',
    taxonomyId: 'BT-0350',
    industryId: 'IND-17',
    industryCode: 'PROFESSIONAL_SERVICES',
    primaryArchetype: 'B2B_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-MACHINING',
    expectedKeywords: ['سازمان', 'مشاوره', 'فرایند', 'قرارداد'],
    forbiddenKeywords: ['ساندویچ و پیتزا', 'تعویض لنت خودرو', 'دکلره مو'],
    financials: { price: 45000000, variableCost: 15000000, fixedCost: 70000000, sales: 4, capacity: 6 },
    answers: {
      1: { coreOffer: 'عارضه‌یابی ساختار، بازطراحی فرایندها و سیستم پاداش عملکرد', primaryGoal: 'عقد قراردادهای بلندمدت ریتینر سازمانی با صنایع متوسط', budgetConstraint: 'بودجه محدود مبتنی بر نتورک شخصی موسسان', valueHypothesis: 'اتصال تغییر فرایندها به شاخص‌های مالی سودآوری و کاهش هزینه' },
      2: { competitors: 'مشاوران فردی آکادمیک و شرکت‌های بزرگ چندملیتی سابق', customerPain: 'گزارش‌های حجیم غیرعملیاتی که بعد از رفتن مشاور در کشو خاک می‌خورند', pricingModel: 'مرحله‌ای مبتنی بر تحویل پروژه و پاداش موفقیت', primaryChannel: 'روابط سازمانی، سخنرانی در همایش‌های تخصصی و لیندکین', goldenOpportunity: 'مشارکت مستقیم در فاز پیاده‌سازی همراه با مدیران داخلی' },
      3: { targetSegment: 'بنیان‌گذاران و مدیران عامل شرکت‌های در حال رشد ۵۰ تا ۳۰۰ نفره', positioning: 'مشاور همراه برای تبدیل هرج‌ومرج سازمانی به فرایندهای سودآور', boundary: 'عدم پذیرش پروژه‌هایی که مدیر ارشد تمایلی به تغییر ندارد', promise: 'تحویل آیین‌نامه‌ها و شاخص‌های کاملاً عملیاتی و آزمون‌شده' },
      4: { archetype: 'حکیم و معمار استراتژیک', traits: 'کل‌نگر، واقع‌بین و نتیجه‌محور', toneGuardrail: 'بدون اصطلاحات پیچیده مدیریتی بی‌فایده و تئوری‌بافی' },
      5: { voiceStyle: 'پخته، قاطع و ساختاریافته', elevatorHook: 'تبدیل گلوگاه‌های مدیریتی به فرایندهای سودآور؛ ما کنار تیم شما اجرا می‌کنیم', forbiddenWords: 'تحول کوانتومی سازمان، داروی معجزه‌آسای مدیریت' },
      6: { naming: 'مشاوران مدیریت تراز', tagline: 'انضباط در ساختار، تعالی در نتیجه' },
      7: { colorPalette: 'خاکستری ذغالی، آبی سورمه‌ای و طلایی برنز', typography: 'رسمی و سنگین سازمانی', logoConcept: 'اشکال هندسی متوازن بیانگر تعادل ساختار' },
      8: { thoughtLeadership: 'شاخص‌های کلیدی عملکرد که باعث نابودی انگیزه تیم‌ها می‌شوند', prChannels: 'مقالات تحلیلی در نشریات اقتصادی و لینکدین مدیران', leadFunnel: 'جلسه ارزیابی اولیه ← پروپوزال فازبندی ← فاز شناخت ← پیاده‌سازی', reputationCrisis: 'بازنگری در طراحی بدون دریافت هزینه در صورت عدم کارایی فرایند' },
    },
  },

  // 12. Local Grocery Supermarket
  {
    id: 'case_grocery_supermarket',
    titleFa: 'سوپرمارکت محلی و خواربار ارگانیک',
    taxonomyId: 'BT-0003',
    industryId: 'IND-02',
    industryCode: 'RETAIL_WHOLESALE',
    primaryArchetype: 'LOCAL_RETAIL',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-LOCAL-RETAIL',
    expectedKeywords: ['موجود', 'قفسه', 'مشتری', 'خرید'],
    forbiddenKeywords: ['تعمیرگاه مکانیک', 'ایمپلنت دندان', 'قطعه تراشکاری'],
    financials: { price: 95000, variableCost: 72000, fixedCost: 22000000, sales: 2200, capacity: 3500 },
    answers: {
      1: { coreOffer: 'لبنیات سنتی تازه، خواربار روزمره و اقلام پروتئینی باکیفیت محلی', primaryGoal: 'افزایش ارزش سبد خرید و تبدیل خریداران به مشتریان دائم', budgetConstraint: 'بودجه بسیار محدود محلی ۵ میلیون تومان', valueHypothesis: 'تازگی اقلام فاسدنشدنی و تحویل سریع تلفنی در محدوده محله' },
      2: { competitors: 'فروشگاه‌های زنجیره‌ای تخفیفی و سوپرمارکت‌های آنلاین بزرگ', customerPain: 'کیفیت پایین لبنیات صنعتی و عدم دسترسی به سفارشات فوری', pricingModel: 'قیمت مصرف‌کننده مصوب با حاشیه سود منصفانه و ارسال رایگان محلی', primaryChannel: 'مراجعه حضوری اهالی محل و سفارش تلفنی/واتساپی', goldenOpportunity: 'سلام و احوال‌پرسی شخصی با همسایگان و یادآوری نیازهای روزمره' },
      3: { targetSegment: 'خانواده‌ها و ساکنان مجتمع‌های مسکونی اطراف', positioning: 'سوپر خوش‌نام و معتمد محله برای تامین ملزومات تازه روزمره', boundary: 'عدم نگهداری اجناس تاریخ‌گذشته و محصولات غیراستاندارد', promise: 'تازگی کامل اقلام روز و ارسال زیر ۲۰ دقیقه به درب منزل' },
      4: { archetype: 'همسایه مهربان و امین', traits: 'خوش‌برخورد، صادق و پیگیر', toneGuardrail: 'حفظ صمیمیت محلی بدون تظاهر و تشریفات غیرضروری' },
      5: { voiceStyle: 'صمیمی، محلی و امین', elevatorHook: 'مایحتاج تازه خانه با یک تلفن؛ لبنیات ارگانیک و اقلام روزمره درب منزل شما', forbiddenWords: 'بزرگترین هایپرمارکت خاورمیانه' },
      6: { naming: 'سوپر سامان', tagline: 'تازگی هر روز سر سفره شما' },
      7: { colorPalette: 'سبز گیاهی تازه، نارنجی پرتقالی و سفید', typography: 'خوانا، گرم و صمیمی', logoConcept: 'زنبیل خرید پر از اقلام تازه' },
      8: { thoughtLeadership: 'راهنمای تشخیص لبنیات سنتی پاستوریزه سالم', prChannels: 'پیام‌رسان محلی و بنر داخل فروشگاه', leadFunnel: 'خرید دم‌دستی ← پیشنهاد اقلام تازه ← سفارش تلفنی دوره‌ای', reputationCrisis: 'تعویض فوری جنس بدون شرط و پوزش حضوری' },
    },
  },

  // 13. NEW: B2B Industrial Machinery Repair & Overhaul
  {
    id: 'case_industrial_b2b_repair',
    titleFa: 'تعمیرات و اورهال ماشین‌آلات صنعتی B2B',
    taxonomyId: 'BT-0225',
    industryId: 'IND-08',
    industryCode: 'B2B_MANUFACTURING',
    primaryArchetype: 'B2B_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-MACHINING',
    expectedKeywords: ['تعمیر', 'دستگاه', 'خط تولید', 'قطعه'],
    forbiddenKeywords: ['سالن زیبایی بانوان', 'منوی رستوران سنتی', 'رنگ مو'],
    financials: { price: 35000000, variableCost: 14000000, fixedCost: 65000000, sales: 5, capacity: 8 },
    answers: {
      1: { coreOffer: 'تعمیرات تخصصی، بازسازی هیدرولیک و اورهال اساسی خطوط تولید صنعتی', primaryGoal: 'کاهش زمان توقف ناخواسته خطوط تولید کارخانجات طرف قرارداد', budgetConstraint: 'سرمایه در گردش برای قطعات یدکی اورجینال', valueHypothesis: 'گارانتی کارکرد مستند ۳ ماهه روی قطعات تعمیری و گزارش عیب‌یابی ارتعاشاتی' },
      2: { competitors: 'تیم‌های فنی داخلی کارخانجات و تعمیرکاران غیرمتخصص تجربی', customerPain: 'خرابی مجدد قطعه پس از مدت کوتاه و نبود نقشه‌های فنی دستگاه', pricingModel: 'پیش‌پرداخت ۴۰٪ جهت تامین متریال و تسویه پس از تحویل موفق زیر بار', primaryChannel: 'بازدید فنی کارخانه‌ها، معرفی مدیران فنی و پورتال صنعتی', goldenOpportunity: 'ارائه برنامه نگهداری و تعمیرات پیشگیرانه (PM) بعد از هر اورهال' },
      3: { targetSegment: 'مدیران فنی و تولید صنایع بسته‌بندی، نساجی و قطعه‌سازی', positioning: 'تیم تخصصی بازسازی ماشین‌آلات با پشتوانه مهندسی معکوس و استاندارد', boundary: 'عدم تعمیر دستگاه‌های بدون توجیه اقتصادی و فرسوده غیرقابل احیا', promise: 'تست زیر بار کامل قطعه پیش از تحویل با تاییدیه کتبی ناظر فنی' },
      4: { archetype: 'نجات‌بخش فنی و متخصص کارگاهی', traits: 'دقیق، مقاوم و مسئولیت‌پذیر در بحران', toneGuardrail: 'بدون قول‌های زمان‌بندی غیرواقعی هنگام عیب‌یابی اولیه' },
      5: { voiceStyle: 'فنی، مستقیم و اطمینان‌بخش', elevatorHook: 'توقف خط تولید شما را به حداقل می‌رسانیم؛ اورهال استاندارد با ضمانت کارکرد صنعتی', forbiddenWords: 'تعمیر معجزه‌آسا، ارزان‌ترین مکانیک ایران' },
      6: { naming: 'احیاصنعت پارت', tagline: 'تداوم خط تولید، اتکا به مهندسی' },
      7: { colorPalette: 'زرد ایمنی صنعتی، خاکستری فولادی و مشکی روغنی', typography: 'سنگین و صنعتی', logoConcept: 'چرخ‌دنده متصل به آچار مهندسی' },
      8: { thoughtLeadership: 'روش‌های نوین پایش ارتعاشات برای پیشگیری از گیرپاژ گیربکس‌های صنعتی', prChannels: 'ماهنامه‌های صنعت ماشین‌کاری و همایش‌های نگهداری و تعمیرات', leadFunnel: 'بازدید و عیب‌یابی ← پیش‌فاکتور شفاف ← اورهال کارگاهی ← تست زیر بار', reputationCrisis: 'حضور ۲۴ ساعته تیم فنی در محل کارخانه در صورت بروز اشکال' },
    },
  },

  // 14. NEW: Legal Services & Corporate Advocacy
  {
    id: 'case_legal_services',
    titleFa: 'موسسه حقوقی و خدمات داوری قراردادهای تجاری',
    taxonomyId: 'BT-0370',
    industryId: 'IND-18',
    industryCode: 'LEGAL_SERVICES',
    primaryArchetype: 'B2B_SERVICE',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-TAX-SAAS',
    expectedKeywords: ['قرارداد', 'حقوق', 'قانون', 'دعوا'],
    forbiddenKeywords: ['سرویس روغن خودرو', 'کباب کوبیده', 'آرایشگاه مو'],
    financials: { price: 28000000, variableCost: 6000000, fixedCost: 40000000, sales: 6, capacity: 10 },
    answers: {
      1: { coreOffer: 'تنظیم قراردادهای تجاری B2B، داوری اختلافات شرکتی و وکالت دعاوی مالیاتی', primaryGoal: 'جلوگیری از ریسک‌های دعاوی قضایی برای شرکت‌های دانش‌بنیان و تجاری', budgetConstraint: 'توسعه متکی بر شبکه وکلا و ارتباطات حرفه‌ای', valueHypothesis: 'پیش‌بینی دقیق ریسک‌های تفسیری در مراجع قضایی و حل مسالمت‌آمیز اختلافات' },
      2: { competitors: 'وکلای منفرد سنتی و موسسات غیرتخصصی دعاوی خانواده', customerPain: 'قراردادهای تیپ بی‌فایده و ابهام در حق‌الوکاله‌ها و هزینه‌های دادرسی', pricingModel: 'حق‌الوکاله شفاف مرحله‌ای بر اساس پیشرفت دادرسی', primaryChannel: 'شبکه تجاری، اتاق‌های بازرگانی و کارگاه‌های حقوقی برای مدیران', goldenOpportunity: 'ممیزی حقوقی رایگان قراردادهای تیپ شرکت‌ها پیش از امضا' },
      3: { targetSegment: 'اعضای هیئت مدیره و سهامداران شرکت‌های خصوصی', positioning: 'مشاور حقوقی پیشگیرانه برای امنیت معاملات و قراردادهای شرکتی', boundary: 'عدم پذیرش پرونده‌های نامشروع یا راه‌های غیرقانونی دادرسی', promise: 'ارزیابی صادقانه شانس پیروزی دعوا پیش از انعقاد قرارداد وکالت' },
      4: { archetype: 'پاسدار قانون و عدالت', traits: 'راست‌کردار، رازدار، شجاع و منطقی', toneGuardrail: 'رعایت شوونات اخلاقی وکالت و عدم ادعای تضمین نتیجه قضایی' },
      5: { voiceStyle: 'رسمی، استوار و شفاف', elevatorHook: 'امنیت حقوقی تجارت شما؛ قراردادهای مستحکم و همراهی وکلای پایه یک در مراجع داوری', forbiddenWords: 'تضمین صددرصد رای دادگاه، نفوذ در قاضی' },
      6: { naming: 'دادمان اندیشه پارس', tagline: 'استحکام در قرارداد، آرامش در تجارت' },
      7: { colorPalette: 'آبی تیره اقیانوسی، طلایی کهربایی و سفید مات', typography: 'رسمی و باوقار کلاسیک', logoConcept: 'ترازوی عدالت در ترکیبی با ستون مستحکم' },
      8: { thoughtLeadership: 'شروط داوری خطرناک در قراردادهای خرید و فروش صنعتی', prChannels: 'نشریات اتاق بازرگانی و پادکست‌های حقوق کسب‌وکار', leadFunnel: 'جلسه بازخوانی قرارداد ← تنظیم سند نهایی ← همراهی تا امضا', reputationCrisis: 'گزارش‌دهی کتبی و مستند در تمام مراحل دادرسی به موکل' },
    },
  },

  // 15. NEW: Agriculture Produce Sales & Export
  {
    id: 'case_agriculture_produce',
    titleFa: 'سورتینگ، بسته‌بندی و صادرات محصولات کشاورزی و خشکبار',
    taxonomyId: 'BT-0015',
    industryId: 'IND-01',
    industryCode: 'AGRICULTURE_FARMING_LIVESTOCK',
    primaryArchetype: 'MANUFACTURER',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-LOCAL-RETAIL',
    expectedKeywords: ['محصول', 'بسته‌بندی', 'محموله', 'آفلاتوکسین'],
    forbiddenKeywords: ['تعمیرگاه اتوسرویس', 'ایمپلنت دندان', 'سالن زیبایی'],
    financials: { price: 520000, variableCost: 360000, fixedCost: 75000000, sales: 800, capacity: 1500 },
    answers: {
      1: { coreOffer: 'پسته، زعفران و خشکبار دستچین درجه‌یک با آزمایش بقایای سموم و بسته‌بندی خلأ', primaryGoal: 'دستیابی به استانداردهای صادراتی کشورهای همسایه و عرضه در فروشگاه‌های معتبر', budgetConstraint: 'وابستگی شدید به نقدینگی فصل برداشت محصول', valueHypothesis: 'گواهی عدم آلودگی به آفلاتوکسین و یکدستی ابعادی بار ارسالی' },
      2: { competitors: 'دلالان سنتی بازار خشکبار و بارهای بی‌شناسنامه فله‌ای', customerPain: 'عدم یکدستی کیفیت در تمام محموله و رد شدن بار در گمرکات مقصد', pricingModel: 'قیمت‌گذاری مبتنی بر انس پسته و خلوص با تسویه در گمرک خروجی', primaryChannel: 'شرکت‌های بازرگانی صادراتی، نمایشگاه اگروفود و ارتباط مستقیم با باغداران', goldenOpportunity: 'ردیابی بار از باغ تا بسته‌بندی نهایی با کد QR روی بسته‌ها' },
      3: { targetSegment: 'تجار بین‌المللی مواد غذایی و فروشگاه‌های ارگانیک لوکس', positioning: 'تامین‌کننده موثق خشکبار شناسنامه‌دار مطابق ضوابط بهداشتی بین‌المللی', boundary: 'عدم اختلاط ارقام مختلف محصول و پرهیز از تفت‌های غیرمجاز شیمیایی', promise: 'تحویل بار دقیقاً مطابق نمونه تاییدشده با برگه آزمایش معتبر' },
      4: { archetype: 'امین خاک و کشاورز اصیل', traits: 'صبور، سخت‌کوش، صادق و پایبند به طبیعت', toneGuardrail: 'بدون بزرگ‌نمایی‌های پوچ و صداقت در اعلام درجه‌بندی محصول' },
      5: { voiceStyle: 'طبیعی، اصیل و استوار', elevatorHook: 'اصالت طعم خاک ایران در خشکبار صادراتی؛ سورت لیزری دقیق با برگه آزمایش سلامت', forbiddenWords: 'ارزان‌ترین پسته دنیا، زعفران معجزه‌گر' },
      6: { naming: 'خشکبار زرین‌بوم', tagline: 'اصالت طعم، اعتبار کیفیت' },
      7: { colorPalette: 'سبز پسته، قرمز زعفرانی و خاکی گرم', typography: 'طبیعی و محکم فارسی', logoConcept: 'ترکیب فرم بذر و خورشید تابان' },
      8: { thoughtLeadership: 'تاثیر فراوری اصولی بر ماندگاری چربی پسته و حفظ خواص طعمی', prChannels: 'کاتالوگ‌های چندزبانه صادراتی و حضور در نمایشگاه‌های بین‌المللی', leadFunnel: 'ارسال نمونه آزمایشگاهی ← تایید فنی خریدار ← عقد قرارداد صادرات', reputationCrisis: 'پذیرش مرجوعی محموله در صورت هرگونه مغایرت با برگه آنالیز' },
    },
  },

  // 16. NEW: Hybrid Retail & Online Store
  {
    id: 'case_hybrid_retail_online',
    titleFa: 'خرده‌فروشی ترکیبی حضوری و آنلاین عطر و محصولات مراقبتی',
    taxonomyId: 'BT-0005',
    industryId: 'IND-04',
    industryCode: 'HEALTH_BEAUTY',
    primaryArchetype: 'LOCAL_RETAIL',
    evaluationCategory: EVALUATION_CATEGORIES.READY_AS_DRAFT,
    expectedDomainModule: 'MOD-DOMAIN-LOCAL-RETAIL',
    expectedKeywords: ['فروشگاه', 'آنلاین', 'موجودی', 'عطر'],
    forbiddenKeywords: ['تعمیرگاه مکانیکی خودرو', 'قالب‌سازی صنعتی', 'ضایعات آشپزخانه'],
    financials: { price: 1850000, variableCost: 1100000, fixedCost: 55000000, sales: 140, capacity: 250 },
    answers: {
      1: { coreOffer: 'عطرهای اصل نیش و شرکتی با امکان تست حضوری در فروشگاه و سفارش آنلاین با ارسال فوری', primaryGoal: 'یکپارچه‌سازی وفاداری مشتریان بین خرید حضوری و آنلاین', budgetConstraint: 'بودجه ۲۰ میلیون تومان تقسیم‌شده بین تبلیغ محلی و سئو', valueHypothesis: 'ضمانت بازگشت وجه در صورت عدم اصالت کالا و ارسال دکانت تست رایگان' },
      2: { competitors: 'فروشگاه‌های آنلاین بزرگ بدون امکان تست بویایی و آنلاین‌شاپ‌های اینستاگرامی متفرقه', customerPain: 'ترس از خرید عطر تقلبی به قیمت اصل و ابهام در رایحه پیش از استشمام', pricingModel: 'قیمت رقابتی با حاشیه سود منصفانه و سمپل‌های رایگان همراه خرید', primaryChannel: 'بوتیک حضوری در مرکز خرید و وب‌سایت با موجودی یکپارچه انبار', goldenOpportunity: 'باشگاه مشتریان با امتیاز خرید مشترک در شعبه حضوری و درگاه اینترنتی' },
      3: { targetSegment: 'جوانان و شاغلین علاقه‌مند به عطر و استایل شخصی', positioning: 'بوتیک تخصصی رایحه با تجربه لمس عطر در فروشگاه و سهولت خرید اینترنتی', boundary: 'عدم فروش عطرهای فیک و اسانس‌های روغنی مترویی بی‌هویت', promise: 'اصالت ۱۰۰٪ بارکد محصول و ارسال در همان روز در محدوده شهر' },
      4: { archetype: 'راهنمای زیباشناس و همراه خوش‌سلیقه', traits: 'آشنا به دنیای نت‌های بویایی، صبور و شیک', toneGuardrail: 'بدون فخرفروشی و ادعاهای متکبرانه درباره قیمت ادکلن‌ها' },
      5: { voiceStyle: 'ظریف، آراسته و دلنشین', elevatorHook: 'عطر امضای خود را پیدا کنید؛ از تست در بوتیک تا تحویل اکسپرس درب منزل با ضمانت اصالت', forbiddenWords: 'عطر ماندگار تا ابد، ادکلن فوق‌العاده ارزان' },
      6: { naming: 'عطرخانه پرنیان', tagline: 'روایتی ماندگار از رایحه‌ها' },
      7: { colorPalette: 'زرشکی کهربایی، مشکی مخملی و طلایی ملایم', typography: 'ظریف و مدرن', logoConcept: 'شیشه عطر مینیمال با پخش قطرات بو' },
      8: { thoughtLeadership: 'تفاوت واقعی غلظت‌های ادوپرفیوم و ادوتویلت در فصول مختلف', prChannels: 'تولید محتوای نقد و بررسی رایحه در سایت و شبکه‌های اجتماعی', leadFunnel: 'مشاوره آنلاین انتخاب بو ← ارسال دکانت ← خرید بطری اصلی ← ثبت باشگاه', reputationCrisis: 'پذیرش مرجوعی جعبه بازنشده و استرداد آنی وجه' },
    },
  },
];

/**
 * Contrast Variations for a Fixed Guild: "کافه و برشته‌کاری قهوه" (BT-0066)
 * Tests whether strategic outputs and metrics genuinely adapt when underlying inputs change.
 */
export const CONTRAST_CASES = [
  // A. High Budget & Over-Capacity Queue
  {
    id: 'contrast_cafe_high_budget_queue',
    baseId: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی — بودجه بالا، صف طولانی و ظرفیت اشباع',
    financials: { price: 150000, variableCost: 40000, fixedCost: 60000000, sales: 1800, capacity: 1500 },
    expectedDecisionAdjustment: 'توسعه ظرفیت عملیاتی یا افزایش قیمت به جای تبلیغات جذب جدید',
    answersOverride: {
      1: { primaryGoal: 'کنترل صف و بهینه‌سازی فرایند تحویل برای جلوگیری از افت رضایت', budgetConstraint: 'بودجه کافی ۱۰۰ میلیون تومانی جهت توسعه تجهیزات و شعبه دوم' },
      2: { customerPain: 'معطلی و زمان انتظار طولانی در ساعات اوج سفارش' },
    }
  },

  // B. Low Budget & Empty Capacity
  {
    id: 'contrast_cafe_low_budget_empty',
    baseId: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی — بودجه محدود، ظرفیت خالی و نیاز فوری به جذب محلی',
    financials: { price: 90000, variableCost: 35000, fixedCost: 20000000, sales: 200, capacity: 800 },
    expectedDecisionAdjustment: 'تمرکز بر پیشنهادهای کم‌هزینه جذب محلی و بازاریابی چریکی اطراف کافه',
    answersOverride: {
      1: { primaryGoal: 'پر کردن ظرفیت خالی میزها در تمام ساعات روز', budgetConstraint: 'بودجه بسیار محدود ۲ میلیون تومانی' },
      2: { customerPain: 'نبود شناخت از کافه در میان همسایگان' },
    }
  },

  // C. Negative Margin (Contribution <= 0)
  {
    id: 'contrast_cafe_negative_margin',
    baseId: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی — بحران حاشیه مشارکت منفی (هزینه بیشتر از قیمت)',
    financials: { price: 50000, variableCost: 65000, fixedCost: 25000000, sales: 500, capacity: 1000 },
    expectedDecisionAdjustment: 'توقف فوری هزینه‌های جذب و اصلاح اجباری قیمت یا بهای مواد مصرفی',
    answersOverride: {
      1: { primaryGoal: 'افزایش فروش سریع برای فرار از زیان', budgetConstraint: 'بحران شدید نقدینگی' },
    }
  },

  // D. Price-Sensitive vs Quality-Sensitive
  {
    id: 'contrast_cafe_price_sensitive',
    baseId: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی — مخاطب دانشجویی حساس به قیمت',
    financials: { price: 65000, variableCost: 25000, fixedCost: 15000000, sales: 600, capacity: 1000 },
    expectedDecisionAdjustment: 'طراحی پیشنهاد اقتصادی دانشجویی بدون افت کیفیت پایه',
    answersOverride: {
      2: { customerPain: 'گرانی بیش از حد قهوه‌های تخصصی در منطقه دانشگاهی' },
      3: { targetSegment: 'دانشجویان و قشر جوان با بودجه روزانه محدود' },
    }
  },
  {
    id: 'contrast_cafe_quality_sensitive',
    baseId: 'case_cafe_roastery',
    titleFa: 'کافه تخصصی — مخاطب حرفه‌ای حساس به کیفیت و اصالت خاستگاه',
    financials: { price: 220000, variableCost: 70000, fixedCost: 40000000, sales: 400, capacity: 800 },
    expectedDecisionAdjustment: 'تاکید بر گواهی امتیاز کاپینگ تخصصی SCA و اصالت دانه',
    answersOverride: {
      2: { customerPain: 'عدم وجود قهوه با امتیاز کاپینگ بالای ۸۶ در شهر' },
      3: { targetSegment: 'متخصصان قهوه و طعم‌شناسان جویای دانه‌های کمیاب گیشا و اتیوپی' },
    }
  },
];
