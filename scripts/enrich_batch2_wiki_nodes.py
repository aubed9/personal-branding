# -*- coding: utf-8 -*-
"""
Batch 2 enrichment script for remaining DIGITAL MARKET knowledge nodes.
Populates academic foundations, Iranian evidence connections, and actionable decision rules
across business-types, personal-brand, metrics, playbooks, strategy, verbal identity, and visual identity.
"""
import os
import re

BATCH2_CATALOG = {
    # 07 - Business Types
    "wiki/07-business-types/ecommerce.md": {
        "sources": ["SRC-IR-ECOM-REPORT-1403", "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-FULL", "SRC-FOUNDATION-17"],
        "extra_tags": ["ecommerce_playbook", "online_retail", "conversion_rate", "cart_abandonment"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **بایرون شارپ (SRC-FOUNDATION-17):** دسترسی‌پذیری فیزیکی و دیجیتال شرط اول رشد است. در ایکامرس، آسانی فرآیند ثبت سفارش و نبود اصطکاک در درگاه پرداخت بیش از ادعاهای تمایز انتزاعی به فروش منجر می‌شود.
- **اورت راجرز (SRC-FOUNDATION-03):** پذیرش خرید آنلاین زمانی به اکثریت بازار سرایت می‌کند که ریسک ادراک‌شده (گارانتی مرجوعی، امنیت پرداخت) به حداقل برسد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **اندازه بازار ۵,۵۰۰ همت:** گزارش تجارت الکترونیکی ۱۴۰۳ (SRC-IR-ECOM-REPORT-1403) گردش مالی کلان را با ۳۰۶ هزار کسب‌وکار اینماددار نشان می‌دهد.
- **رفتار جستجوی ارزان و تخفیف:** گزارش دیجی‌کالا ۱۴۰۴ (SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-FULL) با ثبت بیش از ۷۴۵ هزار جستجوی عبارت «ارزان» نشان می‌دهد پیشنهاد ارزش شفاف اقتصادی محرک اصلی تکمیل خرید آنلاین است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده ثبت سفارش در ۳ مرحله:** فرآیند پرداخت نباید نیازمند ثبت‌نام طولانی باشد؛ ثبت سریع با پیامک OTP الزامی است.
2. **قاعده شفافیت هزینه ارسال:** هزینه ارسال باید در همان ابتدا مشخص باشد؛ نمایش هزینه در مرحله آخر عامل ۵۰٪ ترک سبد خرید است."""
    },
    "wiki/07-business-types/saas.md": {
        "sources": ["SRC-FOUNDATION-30", "SRC-FOUNDATION-27", "SRC-FOUNDATION-26"],
        "extra_tags": ["saas_architecture", "mrr", "churn_rate", "net_dollar_retention"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دیوید اسکوک (SRC-FOUNDATION-30):** معماری اقتصاد واحد SaaS بر دو قانون استوار است: CAC Payback Period باید کمتر از ۱۲ ماه و نسبت LTV/CAC حداقل ۳.۰ باشد.
- **فرد رایشهلد (SRC-FOUNDATION-26):** کاهش ۵٪ در نرخ ریزش (Churn) می‌تواند سودآوری شرکت اشتراکی را بین ۲۵٪ تا ۹۵٪ افزایش دهد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **استقبال از اشتراک سالانه با تخفیف:** به دلیل نوسانات ارزش ریال و نبود زیرساخت برداشت خودکار بین‌بانکی پایدار (Direct Debit عمومی)، فروش پلن‌های سالانه پیش‌پرداخت نقدینگی شرکت را تضمین می‌کند.
- **فرصت سامانه‌های مودیان و اتوماسیون مالیاتی:** با الزام اجرای قانون پایانه‌های فروشگاهی، SaaSهای حسابداری و اتصال به کارپوشه بالاترین نرخ رشد را تجربه می‌کنند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده دوره بازگشت نقدینگی:** اگر هزینه جذب کاربر با درآمد ۶ ماه اول او جبران نشود، رشد کمپین متوقف می‌گردد.
2. **قاعده آنبوردینگ سریع:** کاربر باید در کمتر از ۵ دقیقه اولین ارزش ملموس (Aha Moment) را در نرم‌افزار تجربه کند."""
    },
    "wiki/07-business-types/manufacturing.md": {
        "sources": ["SRC-FOUNDATION-30", "SRC-FOUNDATION-09", "SRC-FOUNDATION-10"],
        "extra_tags": ["manufacturing_strategy", "theory_of_constraints", "value_chain", "capacity"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **الیاهو گلدرات (SRC-FOUNDATION-30):** تئوری محدودیت‌ها (Theory of Constraints). هر خط تولید حداقل یک گلوگاه دارد و هرگونه بهینه‌سازی خارج از گلوگاه توهم افزایش بهره‌وری است.
- **مایکل پورتر (SRC-FOUNDATION-09):** تحلیل زنجیره ارزش تولیدی و صرفه‌جویی ناشی از مقیاس (Economies of Scale).""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **ریسک تامین مواد اولیه و ارز:** نوسان هفتگی قیمت مواد پتروشیمی، فلزات و قطعات وارداتی مستلزم درج بندهای تعدیل قیمت در قراردادهای B2B است.
- **قطعی‌های فصلی انرژی (برق و گاز):** ظرفیت تولید اسمی باید با ضریب امنیت ۸۰٪ برای محاسبات تعهدات تحویل سفارش تعدیل شود.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده حاشیه ایمنی مواد:** حداقل ۳۰ روز موجودی انبار برای مواد اولیه بحرانی الزامی است.
2. **قاعده قراردادهای شناور:** قیمت فروش در تیراژهای بالا باید به نرخ رسمی بورس کالا یا ارز نیما متصل شود."""
    },
    "wiki/07-business-types/restaurant-cafe.md": {
        "sources": ["SRC-FOUNDATION-01", "SRC-FOUNDATION-08", "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY"],
        "extra_tags": ["hospitality", "prime_cost", "bourdieu_taste", "snappfood"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **پیر بوردیو (SRC-FOUNDATION-01):** انتخاب کافه و رستوران ابزار بازتولید تمایز فرهنگی و سلیقه طبقاتی است. طراحی فضا و کدگذاری نمادین هویت مصرف‌کننده را شکل می‌دهد.
- **ریچارد تالر (SRC-FOUNDATION-08):** حسابداری ذهنی؛ هزینه صرف غذا در رستوران در حساب ذهنی 'تفریح و پاداش' قرار دارد نه بقای فیزیولوژیک.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **نفوذ پلتفرم‌های دلیوری:** طبق داده‌های اسنپ‌فود و سفارش آنلاین، رستوران‌ها بدون مدیریت کانال بیرون‌بر سهم بزرگی از بازار ساعات اوج را از دست می‌دهند.
- **کنترل Prime Cost:** مجموع بهای تمام‌شده غذا (Food Cost) و دستمزد پرسنل در بازار ایران نباید از ۵۵٪ تا ۶۰٪ فروش ناخالص فراتر رود.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده فودکاست حداکثر ۳۵٪:** آیتم‌های منو باید به گونه‌ای مهندسی شوند که میانگین هزینه مواد از ۳۵٪ قیمت فروش تجاوز نکند.
2. **قاعده چرخش میز (Table Turnover):** در ساعات پیک، مدت زمان ماندگاری مشتری در سالن باید مدیریت شود."""
    },
    "wiki/07-business-types/local-service.md": {
        "sources": ["SRC-FOUNDATION-21", "SRC-FOUNDATION-17", "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST"],
        "extra_tags": ["local_marketing", "service_radius", "social_proof", "guild_license"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **رابرت چالدینی (SRC-FOUNDATION-21):** اثبات اجتماعی محلی؛ مشتریان به شدت تحت تاثیر توصیه همسایگان و هم‌محله‌ای‌های خود تصمیم می‌گیرند.
- **بایرون شارپ (SRC-FOUNDATION-17):** دسترسی‌پذیری فیزیکی در شعاع جغرافیایی تعیین‌کننده اصلی انتخاب خدمات محلی است.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **شعاع جغرافیایی ترافیک شهری:** داده‌های سفرهای شهری اسنپ (SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST) نشان می‌دهد ترافیک و هزینه جابه‌جایی مشتریان را به انتخاب در شعاع حداکثر ۳ تا ۵ کیلومتری محدود کرده است.
- **اعتبار صنفی و جواز کسب:** الزامات بازرسی اتحادیه‌ها (قانون نظام صنفی) وجود پروانه کسب معتبر را پیش‌شرط اعتماد محلی ساخته است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تمرکز بر شعاع دسترسی:** ۸۰٪ بودجه بازاریابی محلی باید در محدوده شعاع ۱۵ دقیقه‌ای خودرویی متمرکز شود.
2. **قاعده پاسخگویی فوری:** در خدمات محلی، پاسخگویی به تماس یا پیام در کمتر از ۳ دقیقه شانس تبدیل را دو برابر می‌کند."""
    },

    # 08 - Personal Brand
    "wiki/08-personal-brand/founder-brand.md": {
        "sources": ["SRC-FOUNDATION-01", "SRC-FOUNDATION-21", "SRC-FOUNDATION-18"],
        "extra_tags": ["founder_branding", "symbolic_capital", "executive_reputation", "cialdini"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **پیر بوردیو (SRC-FOUNDATION-01):** سرمایه نمادین (Symbolic Capital)؛ اعتبار، شهرت و کاریزمای بنیان‌گذار مستقیماً به عنوان دارایی اقتصادی بنگاه عمل می‌کند.
- **رابرت چالدینی (SRC-FOUNDATION-21):** اصل اقتدار (Authority)؛ مصرف‌کنندگان و شرکای تجاری به صورت ناخودآگاه از متخصصان موثق و صاحب‌نظران رسمی پیروی می‌کنند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **کسری اعتماد عمومی در بازار:** در فضای تجاری ایران، اعتماد به نام و چهره بنیان‌گذار بسیار سریع‌تر از اعتماد به یک شرکت حقوقی بی‌نام‌ونشان شکل می‌گیرد.
- **حضور در لینکدین و رسانه‌های تخصصی:** شبکه‌سازی بنیان‌گذار در لینکدین موثرترین کانال جذب سرمایه‌گذار و قراردادهای کلان B2B در ایران است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تفکیک هویت فرد از شرکت:** برند شخصی باید مکمل برند تجاری باشد نه جانشین آن؛ کسب‌وکار باید بدون حضور فیزیکی موسس نیز قابل واگذاری باشد.
2. **قاعده اصالت در روایت:** برند شخصی باید بر اساس تخصص اثبات‌شده و تجارب واقعی ساخته شود، نه شعارهای توخالی انگیزشی."""
    },
    "wiki/08-personal-brand/thought-leadership.md": {
        "sources": ["SRC-FOUNDATION-24", "SRC-FOUNDATION-22", "SRC-FOUNDATION-10"],
        "extra_tags": ["thought_leadership", "commercial_teaching", "pov", "challenger_sale"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **متیو دیکسون و آدامسون (SRC-FOUNDATION-24):** آموزش تجاری (Commercial Teaching) در مدل فروش چالشگر؛ رهبری فکری یعنی آموختن زوایای پنهان و خطاهای پرهزینه به مشتری در صنعت خودش.
- **ست گادین (SRC-FOUNDATION-22):** داشتن دیدگاه متمایز و شجاعانه (POV) که ارزش بحث و گفتگو را در صنعت برانگیزد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **کمبود محتوای تحلیلی دست‌اول:** انتشار گزارش‌های آماری بومی و تحلیل‌های داده‌محور از صنعت خود، رهبری فکری را بدون نیاز به بودجه سنگین تبلیغاتی تثبیت می‌کند.
- **ارتباط با اکوسیستم استارتاپی و صنعتی:** مصاحبه‌ها، وبینارها و گزارش‌های سالانه معتبرترین ابزار تثبیت جایگاه کارشناسی در بازار ایران است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده زاویه دید چالشگرانه:** محتوای رهبری فکری باید یکی از فرضیات غلط رایج در صنف را با مدرک نقض کند.
2. **قاعده هدایت به قابلیت راهکار:** آموزش باید مخاطب را به این نتیجه برساند که برای حل این چالش ساختاری به توانایی تخصصی ما نیاز است."""
    },

    # 09 - Metrics
    "wiki/09-metrics/brand-kpis.md": {
        "sources": ["SRC-FOUNDATION-15", "SRC-FOUNDATION-16", "SRC-FOUNDATION-17"],
        "extra_tags": ["brand_kpis", "brand_equity_metrics", "salience", "category_entry_points"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **کوین لین کلر (SRC-FOUNDATION-15):** هرم ارزش ویژه برند؛ سنجه‌های برجستگی (Salience)، طنین و وفاداری عمیق (Resonance).
- **بایرون شارپ (SRC-FOUNDATION-17):** سنجش نقاط ورود به دسته‌بندی (CEPs) و سهم ذهنی (Share of Mind) در لحظه احساس نیاز.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **سهم جستجو در بسترهای مسلط:** سنجش حجم جستجوی نام برند در گوگل و فروشگاه‌های پلتفرمی (دیجی‌کالا، بازار) شاخص‌ترین نشانه برجستگی برند است.
- **ارزیابی رضایت مشتری با NPS بومی:** سنجه شاخص مروجان در خریدهای تکراری ابزار پیش‌بینی ریزش مشتری در بازار ایران است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده سنجه‌های رفتاری بر نگرشی:** ارقام خرید تکراری و ترافیک ارگانیک بر نظرسنجی‌های انتزاعی ترجیح دارند.
2. **قاعده پایش فصلی دارایی‌های متمایز:** میزان یادآوری رنگ، لوگو و شعار باید هر فصل ارزیابی شود."""
    },
    "wiki/09-metrics/saas-kpis.md": {
        "sources": ["SRC-FOUNDATION-30", "SRC-FOUNDATION-26", "SRC-FOUNDATION-27"],
        "extra_tags": ["saas_metrics", "skok_framework", "magic_number", "quick_ratio"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دیوید اسکوک و برایان بلفور (SRC-FOUNDATION-30):** شاخص‌های کلیدی اقتصاد اشتراکی؛ LTV, CAC, Net Retention Rate, Magic Number.
- **پیتر فیدر (SRC-FOUNDATION-27):** تمرکز بر مشتریان با بیشترین ارزش طول عمر (High-CLV).""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **سنجش ران‌وی مالی (Cash Runway):** با تورم بالای ۵۰٪، ماه‌های باقی‌مانده از بقای مالی با فرمول نقدینگی تقسیم بر نرخ سوزاندن خالص (Net Burn Rate) بررسی می‌شود.
- **نرخ تمدید اشتراک در شرایط تحریمی:** بررسی پایداری ابزارهای زیرساختی و هزینه‌های دلاری سرورها در برابر درآمدهای ریالی.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده Quick Ratio بالاتر از ۴:** نسبت رشد درآمدهای جدید به درآمدهای از دست رفته (Churn) باید بالای ۴ باشد.
2. **قاعده بازگشت زیر ۱۲ ماه:** دوره بازگشت هزینه جذب هر مشتری نباید از ۱ سال فراتر رود."""
    },

    # 10 - Playbooks
    "wiki/10-playbooks/crisis.md": {
        "sources": ["SRC-FOUNDATION-07", "SRC-FOUNDATION-25", "SRC-FOUNDATION-26"],
        "extra_tags": ["crisis_management", "pr_protocol", "damage_control", "tactical_empathy"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دانیل کانمن (SRC-FOUNDATION-07):** قاعده اوج-پایان (Peak-End Rule)؛ پایان‌بندی بحران و جبران خسارت نحوه قضاوت نهایی مشتری را تعیین می‌کند.
- **کریس واس (SRC-FOUNDATION-25):** همدلی تاکتیکی (Tactical Empathy) و برچسب‌زنی احساسات منفی برای خلع سلاح خشم مخاطب.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **بحران‌های ناشی از قطعی خدمات یا گرانی:** شفافیت صریح و جبران خسارت ملموس (کد تخفیف، بازگشت وجه، تمدید اشتراک) مانع از موج منفی در شبکه‌های اجتماعی می‌شود.
- **مسئولیت‌پذیری در رسانه‌ها:** هرگونه لاپوشانی یا انداختن تقصیر به گردن مشتری در فضای مجازی ایران نتیجه معکوس داشته و بحران را تشدید می‌کند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده پاسخ در ۲ ساعت اول:** بیانیه اولیه عذرخواهی و تایید مشکل باید ظرف حداکثر ۲ ساعت منتشر شود.
2. **قاعده جبران پیش‌دستانه:** پیشنهاد جبران خسارت باید قبل از درخواست مشتری ارائه گردد."""
    },

    # 03 - Strategy
    "wiki/03-strategy/brand-promise.md": {
        "sources": ["SRC-FOUNDATION-15", "SRC-FOUNDATION-16", "SRC-FOUNDATION-21"],
        "extra_tags": ["brand_promise", "consistency", "customer_trust", "commitment"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **کوین لین کلر (SRC-FOUNDATION-15):** وعده برند جوهره تعهد عملیاتی سازمان به مشتری است.
- **رابرت چالدینی (SRC-FOUNDATION-21):** اصل تعهد و ثبات (Commitment & Consistency)؛ پایداری بر وعده‌ها شرط بنیادی اعتماد است.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **بی‌اعتمادی ناشی از وعده‌های محقق‌نشده:** وعده‌ای که با تاخیر یا تبصره‌های پنهان همراه شود برند را به ورطه نابودی اعتبار می‌کشاند.
- **گارانتی رسمی و ثبت‌شده:** وعده باید در قالب ضمانت کتبی، نماد اعتماد یا قرارداد معتبر به مشتری عرضه شود.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تعهد بدون تبصره:** وعده برند نباید با شروط دست‌وپاگیر و تبصره‌های خاکستری مشروط شود.
2. **قاعده جبران فوری در صورت شکست وعده:** پروتکل جبران خطای بدقولی باید شفاف و خودکار باشد."""
    },
    "wiki/03-strategy/proof.md": {
        "sources": ["SRC-FOUNDATION-21", "SRC-FOUNDATION-15", "SRC-FOUNDATION-13"],
        "extra_tags": ["reasons_to_believe", "rtb", "social_proof", "verification"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **رابرت چالدینی (SRC-FOUNDATION-21):** شواهد اثبات اجتماعی و مراجع رسمی قدرتمندترین شتاب‌دهنده تبدیل هستند.
- **کوین لین کلر (SRC-FOUNDATION-15):** دلایل باورپذیری (Reasons to Believe - RTBs) پایه عقلانی تمایز عاطفی هستند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **مدارک اثبات در بازار ایران:** اینماد معتبر، کد رهگیری مالیاتی، جواز صنف، گواهینامه‌های استاندارد، و ویدیوهای رضایت مشتریان قبلی.
- **اثبات با ارقام دقیق:** استفاده از آمارهای دقیق (مثلاً 'پردازش ۴۵,۰۰۰ سفارش موفق') به جای صفات کلی مانند 'تعداد زیادی مشتری'.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده پیوند هر ادعا به یک سند:** هر ادعای تمایز در فاز ۳ باید حداقل یک مدرک اثبات قابل راستی‌آزمایی داشته باشد.
2. **قاعده رضایت‌نامه همتا:** گواهی مشتریان باید از کسب‌وکارها یا افرادی با شرایط دقیقاً مشابه مشتری هدف باشد."""
    },
    "wiki/03-strategy/strategic-pillars.md": {
        "sources": ["SRC-FOUNDATION-10", "SRC-FOUNDATION-28", "SRC-FOUNDATION-09"],
        "extra_tags": ["strategic_pillars", "coherent_actions", "focus", "tradeoffs"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **ریچارد روملت (SRC-FOUNDATION-10):** ستون‌های استراتژیک همان اقدامات منسجم (Coherent Actions) هستند که با یکدیگر هم‌افزایی داشته و انرژی سازمان را متمرکز می‌کنند.
- **پیتر دراکر (SRC-FOUNDATION-28):** استراتژی یعنی تصمیم‌گیری درباره آنچه نباید انجام دهیم.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **پراکندگی منابع در بنگاه‌های کوچک:** تلاش برای انجام همه کارها همزمان در شرایط کمبود نقدینگی و تورم، عامل شکست پروژه‌ها در ایران است.
- **انتخاب حداکثر ۳ اولویت محوری:** تمرکز کلیه واحدهای سازمان بر ۳ ستون راهبردی در هر سال.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده وتوی پروژه‌های خارج از ستون‌ها:** هر پیشنهادی که به یکی از ۳ ستون استراتژیک متصل نباشد فوراً رد می‌شود.
2. **قاعده هماهنگی چندبخشی:** هر ستون باید حداقل دو بخش عملیاتی، بازاریابی و فروش را درگیر کند."""
    },
    "wiki/03-strategy/target-market.md": {
        "sources": ["SRC-FOUNDATION-19", "SRC-FOUNDATION-22", "SRC-FOUNDATION-27"],
        "extra_tags": ["target_market", "smallest_viable_market", "icp", "segmentation"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **ست گادین (SRC-FOUNDATION-22):** کوچک‌ترین بازار قابل اتکا (Smallest Viable Market)؛ محصول را برای گروهی کوچک و پرشور طراحی کنید.
- **فیلیپ کاتلر (SRC-FOUNDATION-19):** فرآیند STP؛ ارزیابی جذابیت و دسترسی‌پذیری سگمنت‌ها.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **دهک‌های درآمدی مرکز آمار ایران:** تفاوت فاحش سبد مصرفی دهک‌های ۱ تا ۳ با دهک‌های ۸ تا ۱۰ (SRC-IR-SCI-CPI-1405-05) بازاریابی یکنواخت برای کل جامعه را غیرممکن ساخته است.
- **خوشه‌های جغرافیایی کلان‌شهرها:** تمرکز بر مراکز پرجمعیت و شهرهای استان‌های بزرگ به عنوان فاز اول ورود.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده وضوح مشتری نامناسب:** پروفایل مشتری باید دقیقاً مشخص کند چه کسانی مشتری ما نیستند.
2. **قاعده توانایی پرداخت:** بازار هدف باید انگیزه بالا، فوریت در نیاز و بودجه نقد کافی داشته باشد."""
    },

    # 04 - Brand Identity
    "wiki/04-brand-identity/identity-guardrails.md": {
        "sources": ["SRC-FOUNDATION-18", "SRC-FOUNDATION-10", "SRC-FOUNDATION-16"],
        "extra_tags": ["brand_guardrails", "culture_physics", "veto_rules", "integrity"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **ژان نوئل کاپفرر (SRC-FOUNDATION-18):** فرهنگ و مرزهای تغییرناپذیر برند مانع از قربانی شدن هویت در کمپین‌های هیجانی کوتاه‌مدت می‌شوند.
- **ریچارد روملت (SRC-FOUNDATION-10):** سیاست‌های راهنما که مرزهای مشخصی برای کارهای ممنوعه تعیین می‌کنند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **حفظ خط قرمز در کمپین‌های وایرال:** دوری از شوخی‌های سخیف اینستاگرامی که در کوتاه‌مدت ویو می‌آورند اما اعتبار برند صنعتی یا پزشکی را تخریب می‌کنند.
- **محدودیت‌های قانونی و نظارتی:** انطباق با ضوابط تبلیغاتی کشور و هنجارهای عرفی بازار.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده لیست سیاه برند:** تدوین ۵ خط قرمز مطلق در رفتار، لحن و تخفیف‌گذاری برند.
2. **قاعده وتوی مدیر برند:** هرگونه محتوا یا پیشنهاد متضاد با گاردریل‌ها باید توسط متولی برند وتو شود."""
    },
    "wiki/04-brand-identity/personality.md": {
        "sources": ["SRC-FOUNDATION-16", "SRC-FOUNDATION-20", "SRC-FOUNDATION-04"],
        "extra_tags": ["brand_personality", "aaker_5_dimensions", "emotional_connection", "barden"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دیوید آکر (SRC-FOUNDATION-16):** ابعاد پنج‌گانه شخصیت برند (صداقت، هیجان، شایستگی، دل‌ربایی، سرسختی).
- **فیل باردن (SRC-FOUNDATION-20):** نقش ابعاد شخصیتی در تحریک ناخودآگاه انگیزه‌های امنیت، استقلال یا هیجان در مغز.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **تقاضای بالا برای شایستگی و صداقت:** در فضای اقتصادی پرنوسان، برندهایی با شخصیت باصداقت (Sincerity) و شایسته (Competence) بیشترین سهم اعتماد را به خود اختصاص می‌دهند.
- **پرهیز از شخصیت‌های متناقض:** همخوانی لحن پشتیبانی و ادبیات بسته‌بندی با شخصیت ادعایی.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده نسبت ۶۰ به ۴۰ ابعاد:** انتخاب یک بعد اصلی (۶۰٪) و حداکثر یک بعد کمکی (۴۰٪).
2. **قاعده ترجمه شخصیتی به رفتار:** هر بعد شخصیتی باید یک نمونه رفتار عینی در خدمات پس از فروش داشته باشد."""
    },

    # 05 - Verbal Identity
    "wiki/05-verbal-identity/tone.md": {
        "sources": ["SRC-FOUNDATION-04", "SRC-FOUNDATION-16", "SRC-FOUNDATION-21"],
        "extra_tags": ["tone_of_voice", "hofstede_culture", "situational_tone", "persian_etiquette"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **گرت هافستد (SRC-FOUNDATION-04):** انطباق لحن ارتباطی با ابعاد فرهنگی فاصله قدرت و جمع‌گرایی در جامعه هدف.
- **رابرت چالدینی (SRC-FOUNDATION-21):** هم‌زبانی و مشابهت کلامی با مخاطب نرخ همراهی و پذیرش را تقویت می‌کند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **مدیریت تعارف و صمیمیت در فارسی:** لحن برند ایرانی باید مرز بین صمیمیت مدرن و احترام سنتی را رعایت کند؛ صمیمیت زننده دافعه ایجاد می‌کند.
- **تغییر لحن در لحظات بحران:** لحن در حل شکایت مشتری باید قاطع، عذرخواهانه و پاسخگو باشد نه شوخ‌طبع.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده ماتریس لحن چهارگانه:** تنظیم لحن در ۴ حالت (معرفی، فروش، پشتیبانی، بحران).
2. **قاعده پرهیز از لحن دوپهلوی تصنعی:** پرهیز از جملات رسمی سنگین اداری به نفع شفافیت روان."""
    },
    "wiki/05-verbal-identity/vocabulary.md": {
        "sources": ["SRC-FOUNDATION-01", "SRC-FOUNDATION-20", "SRC-FOUNDATION-17"],
        "extra_tags": ["brand_vocabulary", "power_words", "bourdieu_language", "jargon"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **پیر بوردیو (SRC-FOUNDATION-01):** سرمایه زبانی؛ انتخاب دایره واژگان نشان‌دهنده پایگاه اجتماعی و سطح تخصص برند است.
- **فیل باردن (SRC-FOUNDATION-20):** اثرگذاری واژگان حسی و ملموس بر کدگذاری پاداش در سیستم ۱ مغز.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **اصطلاحات تخصصی صنف:** استفاده درست از واژگان کلیدی صنف خود (مثلاً در صنف طلا، مکانیک یا قهوه) نشان‌دهنده اصالت و خاک بازار خوردن است.
- **فهرست واژگان ممنوعه:** حذف کلمات فریبنده و کلیشه‌ای مانند 'بی‌نظیر'، 'تک'، 'ارزان‌ترین در خاورمیانه'.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده واژگان اختصاصی:** تدوین لیست ۱۰ واژه کلیدی برند که باید در تمام محتواها تکرار شوند.
2. **قاعده کلمات ممنوعه:** ثبت لیست سیاه واژگانی که استفاده از آنها در تبلیغات اکیداً ممنوع است."""
    },
    "wiki/05-verbal-identity/voice.md": {
        "sources": ["SRC-FOUNDATION-18", "SRC-FOUNDATION-22", "SRC-FOUNDATION-16"],
        "extra_tags": ["brand_voice", "consistency", "personality_projection", "kapferer"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **ژان نوئل کاپفرر (SRC-FOUNDATION-18):** صدای برند امضای شنیداری و متنی شخصیت سازمان است.
- **ست گادین (SRC-FOUNDATION-22):** داشتن صدایی شفاف و متمایز که بدون لوگو هم برای مخاطب قابل شناسایی باشد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **یکدستی صدا در تمام کانال‌ها:** متنی که در اینستاگرام منتشر می‌شود باید همان صدای پاسخگوی تلفنی یا بسته‌بندی را داشته باشد.
- **پرهیز از تقلید لحن برندهای ترند:** تقلید صدای دیجی‌کالا یا اسنپ توسط کسب‌وکارهای B2B یا سنتی هویت آنها را مخدوش می‌کند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده پایداری صدا در برابر تغییر لحن:** صدا هویت ثابت است؛ لحن بر اساس موقعیت تعدیل می‌شود.
2. **قاعده آزمون شناسایی بدون امضا:** اگر نام برند را از متن حذف کنیم، مخاطب باید حس کند این متن متعلق به کیست."""
    },

    # 06 - Naming
    "wiki/06-naming/naming-evaluation.md": {
        "sources": ["SRC-FOUNDATION-15", "SRC-FOUNDATION-17", "SRC-FOUNDATION-20"],
        "extra_tags": ["naming_scorecard", "phonetics", "trademark_screening", "keller"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **کوین لین کلر (SRC-FOUNDATION-15):** معیارهای شش‌گانه ارزیابی نام برند: ماندگاری در حافظه، بار معنایی، جذابیت عاطفی، انتقال‌پذیری، انطباق‌پذیری و حفاظت‌پذیری.
- **بایرون شارپ (SRC-FOUNDATION-17):** نام باید به عنوان یک دارایی متمایز (Distinctive Asset) تثبیت شود.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **استعلام در سامانه اداره مالکیت معنوی:** بررسی تشابه طبقاتی در سامانه ثبت اسناد و املاک کشور پیش از هرگونه سرمایه‌گذاری روی تابلو و لوگو.
- **سهولت تایپ در کیبورد فارسی و انگلیسی:** نبود حروف چندگانه مبهم (مانند ز/ض/ظ/ذ یا س/ص/ث) که سرچ نام را در گوگل یا اینستاگرام دچار خطا کند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده امتیاز ۸۰ از ۱۰۰:** نام باید در ماتریس ۶ فاکتوری کلر حداقل نمره ۸۰ کسب کند.
2. **قاعده آزمون رادیویی:** نام باید با یک‌بار شنیدن در تماس صوتی، بدون غلط املایی نوشته شود."""
    },
    "wiki/06-naming/tagline.md": {
        "sources": ["SRC-FOUNDATION-07", "SRC-FOUNDATION-22", "SRC-FOUNDATION-17"],
        "extra_tags": ["tagline_design", "slogan", "cognitive_ease", "kahneman_rhyme"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دانیل کانمن (SRC-FOUNDATION-07):** سهولت شناختی (Cognitive Ease) و اثر ریتم/قافیه؛ ذهن جملات موزون و ساده را حقیقی‌تر و ماندگارتر می‌داند.
- **ست گادین (SRC-FOUNDATION-22):** شعار باید تمایز رادیکال محصول را در کلماتی کوتاه بازگو کند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **استفاده از وزن و ریتم در فرهنگ زبانی ایران:** شعارهایی که دارای توازن آوایی یا طنین متقارن هستند ماندگاری چندین دهه‌ای پیدا می‌کنند.
- **پرهیز از ادعاهای اغراق‌آمیز:** شعارهای مانند 'همیشه در اوج' به سرعت توسط مخاطب باهوش به عنوان پوچ رد می‌شوند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده حداکثر ۵ واژه:** شعار نباید طولانی باشد؛ باید در یک بازدم قابل بیان باشد.
2. **قاعده آزمون جایگزینی رقیب:** اگر بتوان شعار را زیر لوگوی رقیب اصلی گذاشت و معنی داد، آن شعار به درد نمی‌خورد."""
    },

    # 15 - Visual Identity
    "wiki/15-visual-identity/color-system.md": {
        "sources": ["SRC-INT-PHASE7-VISUAL-CONTRACT", "SRC-FOUNDATION-20", "SRC-FOUNDATION-17"],
        "extra_tags": ["color_psychology", "color_palette", "sensory_branding", "barden"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **قرارداد فاز ۷ هویت بصری (SRC-INT-PHASE7-VISUAL-CONTRACT):** الزام به انطباق رنگ با شخصیت، کهن‌الگو و استانداردهای کنتراست.
- **فیل باردن (SRC-FOUNDATION-20):** رنگ‌ها میانبرهای غیرکلامی هستند که مستقیماً مغز ناخودآگاه را تحریک می‌کنند (قرمز: انرژی/فوریت، آبی: امنیت/اعتماد).""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **تمایز از رقبای مسلط بازار:** در صنوف مختلف نباید رنگ کلیشه‌ای بازار را کورکورانه تکرار کرد (مثلاً آبی در بانک‌ها و صرافی‌ها).
- **کیفیت در چاپخانه‌های محلی:** کدهای رنگی پالت باید دارای معادل‌های استاندارد CMYK، RGB و Pantone باشند تا در چاپ به هم نریزند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده ۶۰-۳۰-۱۰ پالت:** ۶۰٪ رنگ پایه، ۳۰٪ رنگ ثانویه، و ۱۰٪ رنگ آکسان برای دکمه‌های اقدام (CTA).
2. **قاعده کنتراست WCAG:** متن روی پس‌زمینه رنگی باید کنتراست حداقل ۴.۵:۱ داشته باشد."""
    },
    "wiki/15-visual-identity/logo-system.md": {
        "sources": ["SRC-INT-PHASE7-VISUAL-CONTRACT", "SRC-FOUNDATION-17", "SRC-FOUNDATION-16"],
        "extra_tags": ["logo_system", "brand_mark", "distinctive_assets", "scalability"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **بایرون شارپ (SRC-FOUNDATION-17):** لوگو نمادی است که باید با تکرار مداوم به یک نشانه بازیابی سریع در مغز خریدار تبدیل شود.
- **دیوید آکر (SRC-FOUNDATION-16):** لوگو به مثابه دارایی نمادین برند و ظرف انتقال ارزش ادراک‌شده.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **مقیاس‌پذیری در ابعاد کوچک موبایل:** لوگو باید در اندازه آیکون اپلیکیشن یا پروفایل اینستاگرام (ابعاد ۳۲ در ۳۲ پیکسل) کاملاً واضح باشد.
- **انطباق با فرهنگ بصری خط فارسی:** لوگوتایپ‌های فارسی باید تناسبات خوشنویسی و ضوابط کرنینگ حروف متصل فارسی را رعایت کنند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تک‌رنگ (Monochrome Test):** لوگو باید در نسخه کاملاً سیاه و سفید نیز هویت خود را حفظ کند.
2. **قاعده پرهیز از المان‌های پیچیده:** جزئیات مینیاتوری در نمایشگرهای موبایل محو می‌شوند؛ سادگی هندسی شرط اول است."""
    },
    "wiki/15-visual-identity/typography-system.md": {
        "sources": ["SRC-INT-PHASE7-VISUAL-CONTRACT", "SRC-FOUNDATION-01", "SRC-FOUNDATION-17"],
        "extra_tags": ["persian_typography", "webfonts", "readability", "vazirmatn"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **قرارداد فاز ۷ هویت بصری (SRC-INT-PHASE7-VISUAL-CONTRACT):** تدوین ساختار سلسله‌مراتبی تایپوگرافی (H1 تا H4، بدنه، پانوشت) با پشتیبانی کامل از کاراکترها و اعداد فارسی.
- **پیر بوردیو (SRC-FOUNDATION-01):** فونت انتخابی پیام‌های ناملموس از اصالت، مدرنیته یا سنت را منتقل می‌کند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **استفاده از تایپ‌فیس‌های بومی استاندارد:** بهره‌گیری از خانواده فونت‌های حرفه‌ای (وزیرمتن، ایران‌یکان، کلمه، انجمن) با رندرهایی بی‌نقص در ویندوز، مک، اندروید و iOS.
- **اعداد فارسی در مبالغ مالی:** ارقام در قیمت‌ها و فاکتورها باید اجباراً با گلیف‌های استاندارد فارسی نمایش داده شوند نه ارقام انگلیسی.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده حداکثر ۲ خانواده فونت:** یک فونت برای تیترها و عناوین، و یک فونت خوانا برای متن‌های طولانی.
2. **قاعده لایسنس رسمی:** حقوق کپی‌رایت طراح فونت باید پیش از استفاده تجاری خریداری و مستند شود."""
    }
}

def run_enrichment():
    count = 0
    for rel_path, data in BATCH2_CATALOG.items():
        filepath = os.path.join(os.path.dirname(__file__), '..', rel_path)
        if not os.path.exists(filepath):
            print(f"Skipping missing file: {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as fp:
            content = fp.read()

        # Fix literal \n
        content = content.replace('\\n', '\n')

        # Update frontmatter
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        if frontmatter_match:
            fm_text = frontmatter_match.group(1)
            sources_repr = str(data['sources'])
            if 'sources:' in fm_text:
                fm_text = re.sub(r'sources:\s*\[.*?\]', f'sources: {sources_repr}', fm_text)
            else:
                fm_text += f"\nsources: {sources_repr}"

            tags_match = re.search(r'tags:\s*\[(.*?)\]', fm_text)
            if tags_match:
                current_tags = [t.strip().strip("'\"") for t in tags_match.group(1).split(',')]
                all_tags = list(dict.fromkeys(current_tags + data.get('extra_tags', [])))
                fm_text = fm_text.replace(tags_match.group(0), f"tags: {str(all_tags)}")

            body = content[frontmatter_match.end():]
        else:
            body = content
            fm_text = f"sources: {str(data['sources'])}\n"

        new_sections = f"""

---

## پایه‌های علمی و مراجع دانشی (Scientific Foundations & Sourced Evidence)
{data['foundations_text']}

---

## شواهد و بستر تجاری ایران (Iranian Market Context & Evidence)
{data['iran_context_text']}

---

## قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
{data['decision_rules_text']}
"""
        if "پایه‌های علمی و مراجع دانشی" not in body:
            body = body.rstrip() + new_sections

        new_content = f"---\n{fm_text.strip()}\n---\n\n{body.lstrip()}"

        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(new_content)

        print(f"Enriched: {rel_path}")
        count += 1

    print(f"\nSuccessfully enriched {count} additional wiki articles in Batch 2!")

if __name__ == '__main__':
    run_enrichment()
