# -*- coding: utf-8 -*-
"""
Deep enrichment script for core DIGITAL MARKET knowledge nodes.
Populates academic foundations, Iranian evidence connections, and actionable decision rules,
replacing one-line placeholder stubs and fixing literal escape characters.
"""
import os
import glob
import re

WIKI_DIR = os.path.join(os.path.dirname(__file__), '..', 'wiki')

ENRICHMENT_CATALOG = {
    # 01 - Business Foundation
    "wiki/01-business-foundation/business-model.md": {
        "sources": ["SRC-FOUNDATION-14", "SRC-FOUNDATION-28", "SRC-FOUNDATION-30"],
        "extra_tags": ["osterwalder_vpd", "drucker_management", "business_model_canvas"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **الکساندر استروالدر (SRC-FOUNDATION-14):** منطق مدل کسب‌وکار بر هم‌راستایی ۹ جزء بوم مدل کسب‌وکار استوار است. مدل کسب‌وکار تعریف می‌کند که یک سازمان چگونه ارزش را خلق، ارائه و جذب (Capture) می‌کند.
- **پیتر دراکر (SRC-FOUNDATION-28):** تنها هدف معتبر کسب‌وکار «خلق و نگه‌داشت مشتری» است. بازاریابی و نوآوری تنها مراکز سودآور سازمان هستند؛ مابقی اجزا صرفاً هزینه محسوب می‌شوند.
- **تلفیق مالی و گلوگاه‌ها (SRC-FOUNDATION-30):** پایداری مدل به توانایی تبدیل جریان عملیاتی به جریان نقدینگی آزاد و پوشش هزینه سرمایه وابسته است.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **شوک‌های تورمی و نقدینگی:** در اقتصاد با تورم بالای ۵۰٪ (گزارش مرکز آمار SRC-IR-SCI-CPI-1405-05)، مدل‌های کسب‌وکاری که دوره وصول مطالبات (DSO) طولانی دارند محکوم به نابودی سرمایه در گردش هستند.
- **الزامات سامانه مؤدیان و پایانه‌های فروشگاهی:** شفاف‌سازی جریان مالیاتی (SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405) مدل‌های واسطه‌گری سنتی بدون فاکتور رسمی را با ریسک شدید مالیات بر ارزش افزوده و جرایم ماده ۲۲ مواجه ساخته است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تقدم جریان نقدینگی بر سود دفتری:** مدلی که درآمد تعهدی ایجاد می‌کند ولی جریان نقدی ندارد در فاز ۱ وتو می‌شود.
2. **قاعده حاشیه مشارکت حداقلی:** برای هر واحد محصول/خدمت، حاشیه مشارکت ناخالص باید حداقل ۳۵٪ باشد تا هزینه‌های سربار و تورم اداری را جذب کند."""
    },
    "wiki/01-business-foundation/goals.md": {
        "sources": ["SRC-FOUNDATION-29", "SRC-FOUNDATION-10", "SRC-FOUNDATION-28"],
        "extra_tags": ["okrs", "grove_leverage", "strategic_intent", "paired_indicators"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **اندی گروو (SRC-FOUNDATION-29):** خروجی مدیر تابع اهداف اهرمی است. استفاده از شاخص‌های جفت‌شده (Paired Indicators) مانع فدا شدن کیفیت در ازای دستیابی به کمیت فروش می‌شود.
- **ریچارد روملت (SRC-FOUNDATION-10):** اشتباه گرفتن اهداف جاه‌طلبانه (مانند 'رسیدن به درآمد ۱۰۰ میلیاردی') با استراتژی، بزرگ‌ترین نشانه استراتژی بد است. هدف باید گلوگاه حیاتی را هدف بگیرد.
- **پیتر دراکر (SRC-FOUNDATION-28):** مدیریت بر مبنای هدف (MBO) زمانی کار می‌کند که مرزهای اثربخشی (انجام کار درست) از کارایی (انجام درست کار غلط) تفکیک شوند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **سنجه‌های متناسب با تورم:** اهداف فروش اسمی در ایران باید همواره با نرخ تورم نقطه به نقطه تعدیل شوند؛ رشد فروش کمتر از تورم سالانه، رشد منفی واقعی محسوب می‌شود.
- **ظرفیت جذب سرمایه در گردش:** هدف‌گذاری مقیاس بدون تامین خط اعتباری بانکی یا نقدینگی پیش‌دریافت، بنگاه را دچار بحران قفل‌شدگی سفارش‌ها می‌کند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده سنجه‌های جفت‌شده:** هر هدف کمی درآمدی باید یک شاخص کیفی همراه داشته باشد (مثلاً تعداد مشتریان جدید + نرخ رضایت یا ریزش زیر ۵٪).
2. **قاعده تحدید اهداف:** حداکثر ۱ تا ۲ هدف کلیدی فصلی (OKRs) تعیین شود تا تمرکز تیم متلاشی نگردد."""
    },
    "wiki/01-business-foundation/channels.md": {
        "sources": ["SRC-FOUNDATION-17", "SRC-FOUNDATION-03", "SRC-IR-ECOM-REPORT-1403"],
        "extra_tags": ["physical_availability", "channel_strategy", "byron_sharp", "omnichannel"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **بایرون شارپ (SRC-FOUNDATION-17):** دسترسی‌پذیری فیزیکی (Physical Availability) شرط لازم رشد است. مشتریان راحت‌طلبند و محصولی را می‌خرند که دسترسی و خرید آن کمترین زحمت و اتلاف وقت را داشته باشد.
- **اورت راجرز (SRC-FOUNDATION-03):** کانال‌های ارتباطی باید با عادات پذیرندگان آغازین و اکثریت بازار مطابقت داشته باشند؛ پیچیدگی مسیر خرید نرخ نفوذ را مستقیماً کاهش می‌دهد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **ترکیب کانال حضوری و آنلاین (Omnichannel):** طبق گزارش سالانه تجارت الکترونیکی (SRC-IR-ECOM-REPORT-1403)، بیش از ۳۰۶ هزار کسب‌وکار اینماددار وجود دارند اما کانال‌های شبکه‌های اجتماعی (اینستاگرام و تلگرام) هنوز لایه اول کشف محصول برای مصرف‌کننده هستند.
- **پایداری پرداخت:** استفاده از درگاه‌های پرداخت متصل به شاپرک (SRC-IR-SHAPARAK-REPORT-134) با تسویه پایدار، پیش‌نیاز کانال فروش الکترونیکی است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده کانال غالب:** کسب‌وکار نوپا نباید در ابتدا در بیش از ۲ کانال اصلی انرژی بگذارد (یک کانال کشف + یک کانال تبدیل مستقیم).
2. **قاعده اصطکاک صفر:** مسیر ثبت سفارش و پرداخت در کانال نباید بیش از ۳ کلیک یا ۲ دقیقه طول بکشد."""
    },
    "wiki/01-business-foundation/revenue-models.md": {
        "sources": ["SRC-FOUNDATION-05", "SRC-FOUNDATION-30", "SRC-FOUNDATION-26"],
        "extra_tags": ["revenue_streams", "pricing_model", "subscription", "varian"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **هال واریان (SRC-FOUNDATION-05):** مدل‌های درآمدی از طریق تبعیض قیمتی و تعرفه‌بندی دوسطحی (Two-Part Tariff) مازاد رفاه مصرف‌کننده را به مازاد تولیدکننده تبدیل می‌کنند.
- **دیوید اسکوک و ساس متریکس (SRC-FOUNDATION-30):** مدل درآمدی اشتراکی متوالی (MRR) با تثبیت درآمد پیش‌بینی‌پذیر، ضریب ارزش‌گذاری شرکت را ۳ تا ۵ برابر مدل‌های تک‌فروشی سنتی بالا می‌برد.
- **فرد رایشهلد (SRC-FOUNDATION-26):** تمایز سود خوب (Good Profits ناشی از ارزش واقعی) از سود بد (Bad Profits ناشی از جریمه و گیر انداختن مشتری).""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **مقاومت در برابر اشتراک بلندمدت ریالی:** به دلیل نوسانات ارزش پول، اشتراک سالانه پیش‌پرداخت با تخفیف جذاب، بسیار موفق‌تر از اشتراک ماهانه متکی بر برداشت خودکار بانکی (Direct Debit) عمل می‌کند.
- **رواج مدل‌های اعتباری (BNPL):** داده‌های گزارش اسنپ و دیجی‌کالا نشان می‌دهد مدل‌های خرید اقساطی خرد نرخ تکمیل خرید را به ویژه در کالاهای مصرفی بادوام جهش داده‌اند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده پیش‌بینی‌پذیری جریان درآمد:** مدل‌های درآمدی با حداقل ۴۰٪ درآمد تکرارشونده نسبت به مدل‌های فروش تصادفی اولویت دارند.
2. **قاعده شفافیت قیمت:** هرگونه هزینه پنهان در لحظه پرداخت نهایی باعث انصراف کاربر و باطل شدن گیت اعتماد می‌شود."""
    },

    # 02 - Market Research
    "wiki/02-market-research/competitor-research.md": {
        "sources": ["SRC-FOUNDATION-09", "SRC-FOUNDATION-10", "SRC-FOUNDATION-11"],
        "extra_tags": ["five_forces", "competitor_matrix", "strategic_groups", "porter"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **مایکل پورتر (SRC-FOUNDATION-09):** تحلیل رقبا صرفاً نگاه به رقبای مستقیم فعلی نیست؛ نیروهای پنج‌گانه (تهدید جانشین‌ها، قدرت چانه‌زنی خریداران و تامین‌کنندگان و تازه‌واردان) شدت رقابت را معین می‌کنند.
- **کلیتون کریستنسن (SRC-FOUNDATION-11):** بزرگ‌ترین تهدید رقابتی معمولاً از بازیگران هم‌سطح نمی‌آید، بلکه از تازه‌واردانی می‌آید که از پایین بازار با راهکاری ساده‌تر و ارزان‌تر شروع می‌کنند.
- **ریچارد روملت (SRC-FOUNDATION-10):** تشخیص ضعف ساختاری رقیب و حمله به جایی که توانایی واکنش متقابل ندارد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **جنگ قیمت در بسترهای آنلاین:** داده‌های گزارش دیجی‌کالا و بازارهای تخصصی نشان می‌دهد رقبایی که بر سر قیمت پایین رقابت می‌کنند در دوران تورمی دچار ورشکستگی پنهان و ناتوانی در جایگزینی انبار می‌شوند.
- **شفافیت رقابتی محلی:** در اصناف سنتی ایران، رقابت به شدت وابسته به مکان فیزیکی، اعتبار صنفی قدیمی و روابط خانوادگی/قبیله‌ای در بازار است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده پرهیز از رقابت رودررو:** هرگز در مشخصه‌ای که نقطه قوت تاریخی رقیب اصلی است وارد جنگ تبلیغاتی نشوید؛ زاویه حمله نامتقارن انتخاب کنید.
2. **قاعده دسته‌بندی استراتژیک:** رقبا را به ۳ گروه تفکیک کنید: رقبای سنتی معتبر، استارتاپ‌های سریع، و جانشین‌های غیرمستقیم."""
    },
    "wiki/02-market-research/customer-research.md": {
        "sources": ["SRC-FOUNDATION-12", "SRC-FOUNDATION-13", "SRC-FOUNDATION-07"],
        "extra_tags": ["jtbd", "mom_test", "customer_discovery", "struggling_moment"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **کلیتون کریستنسن (SRC-FOUNDATION-12):** تئوری کارهای انجام‌نشده (Jobs to be Done). مشتریان محصولات را نمی‌خرند، بلکه آنها را استخدام می‌کنند تا در موقعیت کشمکش (Struggling Context) پیشرفتی حاصل نمایند.
- **راب فیتزپاتریک (SRC-FOUNDATION-13):** قوانین سه‌گانه مام‌تست؛ نپرسیدن نظر و فرضیات آینده‌نگرانه از مشتری، پرسش درباره رفتارهای گذشته و تعهدات واقعی مالی.
- **دانیل کانمن (SRC-FOUNDATION-07):** پاسخ‌های مشتریان در پرسشنامه‌های سنتی توسط سیستم ۲ توجیه‌گر تحریف می‌شود؛ باید شواهد رفتاری سیستم ۱ را رصد کرد.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **رفتار صرفه‌جویانه ناشی از تورم:** جهش ۵۱ درصدی جستجوی کالای دست‌دوم (SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST) نشان‌دهنده نیاز مبرم به کارکرد «حفظ قدرت خرید و بقای اقتصادی» در اولویت‌های ذهنی مشتری ایرانی است.
- **تعارفات فرهنگی:** در مصاحبه‌های میدانی در ایران، مشتری به دلیل تعارف از ایده تعریف می‌کند؛ صرفاً تعهد نقدی (پیش‌پرداخت یا خرید تستی) ملاک اعتبارسنجی است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده رد شواهد تعارفی:** هرگونه پاسخ شامل «شاید بخرم» یا «ایده قشنگی است» به عنوان سیگنال عدم نیاز (رد فرضیه) ثبت می‌شود.
2. **قاعده ابعاد سه‌گانه شغل:** برای هر سگمنت مشتری باید کارکردی (Functional)، احساسی (Emotional) و اجتماعی (Social) تعریف و متمایز شود."""
    },
    "wiki/02-market-research/pricing-research.md": {
        "sources": ["SRC-FOUNDATION-05", "SRC-FOUNDATION-07", "SRC-FOUNDATION-20"],
        "extra_tags": ["pricing_strategy", "anchoring", "loss_aversion", "price_elasticity"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **هال واریان (SRC-FOUNDATION-05):** محاسبه کشش قیمتی تقاضا و آستانه شکست درآمدی. در کالاهای پرکشش، حاشیه سود با افزایش قیمت قربانی ریزش شدید حجم می‌شود.
- **دانیل کانمن (SRC-FOUNDATION-07):** اثر لنگراندازی (Anchoring) و رنج از دست دادن (Loss Aversion). اولین قیمتی که مشتری می‌بیند چارچوب ارزیابی منصفانه بودن سایر گزینه‌ها را شکل می‌دهد.
- **فیل باردن (SRC-FOUNDATION-20):** ارزش ادراک‌شده برابر است با پاداش منهای رنج پرداخت (Net Value = Reward - Pain). کاهش رنج روانی پرداخت نرخ تبدیل را تصاعدی می‌کند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **حساسیت شدید به کلمه «ارزان»:** بیش از ۷۴۵ هزار بار جستجوی واژه ارزان در پلتفرم دیجی‌کالا (SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-FULL) اثبات می‌کند حساسیت به ارزش ادراک‌شده در اوج تاریخی خود است.
- **تغییر هفتگی قیمت تامین:** فرمول‌های قیمت‌گذاری ثابت ماهانه به سرعت حاشیه سود را می‌سوزانند؛ سیستم قیمت‌گذاری باید بر مبنای حاشیه مشارکت پویا (Cost-plus شناور) باشد.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده لنگراندازی قیمتی:** همیشه پکیج پرمیوم یا مرجع گران‌قیمت‌تر در ابتدا نمایش داده شود تا پکیج استاندارد ارزش بهتری جلوه کند.
2. **قاعده تفکیک حاشیه سود:** قیمت هرگز نباید کمتر از بهای تمام‌شده جایگزینی کالا (نه بهای خرید قبلی در انبار) تعیین شود."""
    },

    # 03 - Strategy
    "wiki/03-strategy/positioning.md": {
        "sources": ["SRC-FOUNDATION-09", "SRC-FOUNDATION-15", "SRC-FOUNDATION-10"],
        "extra_tags": ["strategic_positioning", "porter", "keller_pop_pod", "onlyness"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **مایکل پورتر (SRC-FOUNDATION-09):** جایگاه‌یابی استراتژیک یعنی انجام فعالیت‌های متفاوت از رقبا یا انجام فعالیت‌های مشابه به شیوه‌ای کاملاً متفاوت. جوهره استراتژی انتخاب کارهایی است که نباید انجام دهیم.
- **کوین لین کلر (SRC-FOUNDATION-15):** تفکیک نقاط اشتراک الزامی (Points-of-Parity) از نقاط تمایز برند (Points-of-Difference). ابتدا باید صلاحیت حضور در صنعت اثبات شود تا ادعای تمایز معتبر تلقی گردد.
- **ریچارد روملت (SRC-FOUNDATION-10):** سیاست راهنما (Guiding Policy) که مسیر هدایت برند را متمرکز می‌کند.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **ادعاهای تکراری و بی‌اثر:** در بازار ایران اکثر برندها مدعی «کیفیت برتر، قیمت مناسب، خدمات پس از فروش» هستند که ادعاهایی کلیشه‌ای و فاقد تمایز واقعی است.
- **اثبات با شواهد عینی:** جایگاه‌یابی باید دارای مدرک اثبات قابل راستی‌آزمایی (RTB) مانند تاییدیه دانشگاهی، مجوز استاندارد، یا سابقه تخصصی صنف باشد.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده آزمون یگانگی (Only-ness Test):** گزاره جایگاه‌یابی باید فرمت «ما تنها [دسته‌بندی] هستیم که [تمایز رادیکال] را برای [مخاطب خاص] فراهم می‌کنیم» را برآورده کند.
2. **قاعده عدم تقارن:** ادعای جایگاه‌یابی نباید توسط رقیب اصلی قابل کپی‌برداری در کمتر از ۶ ماه باشد."""
    },
    "wiki/03-strategy/value-proposition.md": {
        "sources": ["SRC-FOUNDATION-14", "SRC-FOUNDATION-12", "SRC-FOUNDATION-20"],
        "extra_tags": ["value_proposition", "pain_relievers", "gain_creators", "osterwalder"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **الکساندر استروالدر (SRC-FOUNDATION-14):** بوم ارزش پیشنهادی؛ نگاشت محصولات و خدمات، تسکین‌دهنده‌های درد و شادی‌آفرین‌ها بر رنج‌ها و دستاوردهای مشتری.
- **کلیتون کریستنسن (SRC-FOUNDATION-12):** ارزش پیشنهادی پاسخی مستقیم به شغل در دست اقدام مشتری در زمان کشمکش است.
- **فیل باردن (SRC-FOUNDATION-20):** ارزش پیشنهادی باید به کدهای پاداش حسی و روان‌شناختی تبدیل شود.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **تمرکز بر تسکین درد تا خلق شادی تجملی:** در شرایط رکود تورمی، پیشنهادهایی که دردهای حاد مالی، اتلاف وقت و ریسک خرابی را رفع می‌کنند نرخ موفقیت بسیار بالاتری از مزایای لوکس فانتزی دارند.
- **تضمین سلامت و گارانتی:** ضمانت برگشت وجه واقعی یا گارانتی تعویض بی قیدوشرط به نیرومندترین ارزش پیشنهادی تبدیل شده است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تسکین رنج حاد:** ارزش پیشنهادی باید حداقل یک رنج درجه ۱ (شدید و مستمر) مشتری را درمان کند، نه ۱۰ درد کم‌اهمیت.
2. **قاعده شفافیت یک‌جمله‌ای:** ارزش پیشنهادی باید در یک جمله کوتاه بدون واژگان مبهم تخصصی قابل فهم باشد."""
    },
    "wiki/03-strategy/differentiation.md": {
        "sources": ["SRC-FOUNDATION-09", "SRC-FOUNDATION-22", "SRC-FOUNDATION-17"],
        "extra_tags": ["radical_differentiation", "purple_cow", "distinctive_assets", "byron_sharp"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **ست گادین (SRC-FOUNDATION-22):** گاو بنفش؛ در جهانی شلوغ، محصول بسیار خوب دیگر دیده نمی‌شود؛ محصول باید شایسته حرف زدن و گفتگو باشد (Remarkable).
- **بایرون شارپ (SRC-FOUNDATION-17):** متمایز بودن ادراکی خیالی است؛ دارایی‌های بصری و کلامی متمایز (Distinctive Assets) هستند که برند را در ذهن نگاه می‌دارند.
- **مایکل پورتر (SRC-FOUNDATION-09):** تمایز پایدار مستلزم پذیرش هزینه‌های ساختار متمایز و دفاع‌پذیری در برابر کپی‌کاری است.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **کپی‌کاری سریع محصولات:** در بازار ایران نوآوری‌های ظاهری ظرف چند هفته کپی می‌شوند؛ تمایز واقعی باید در شبکه توزیع، فرهنگ سازمانی یا زنجیره تامین اختصاصی ریشه داشته باشد.
- **کدهای بومی تمایز:** استفاده از هویت فرهنگی اصیل و داستان واقعی موسس، تقلیدناپذیرترین المان تمایز در برندهای ایرانی است.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده هزینه تمایز:** اگر ایجاد تمایز هیچ تغییری در اولویت‌ها یا هزینه‌های جاری ایجاد نکند، آن تمایز واقعی نیست.
2. **قاعده مرزهای تمایز:** برای دستیابی به تمایز در یک حوزه، باید آگاهانه در بخش‌های دیگر متوسط یا غایب باشید."""
    },

    # 04 - Brand Identity
    "wiki/04-brand-identity/brand-character.md": {
        "sources": ["SRC-FOUNDATION-16", "SRC-FOUNDATION-18", "SRC-FOUNDATION-04"],
        "extra_tags": ["brand_character", "jungian_archetypes", "aaker_personality", "identity_prism"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دیوید آکر (SRC-FOUNDATION-16):** شخصیت برند ابعاد انسانی برند را می‌سازد (صداقت، هیجان، شایستگی، دل‌ربایی، سرسختی) و پیوند عاطفی ایجاد می‌کند.
- **ژان نوئل کاپفرر (SRC-FOUNDATION-18):** منشور هویت برند؛ شخصیت برند صدای سخنگوی درونی فرهنگ و باورهای سازمانی است.
- **گرت هافستد (SRC-FOUNDATION-04):** تناسب الگوهای کهن‌الگویی با ابعاد فرهنگی جامعه هدف.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **استقبال از کهن‌الگوهای حامی و دانا:** در بازار ایران به دلیل فضای عدم قطعیت اقتصادی، برندهایی که کهن‌الگوی «حامی / مراقب» (Caregiver) یا «دانا / راهنما» (Sage) اتخاذ می‌کنند ضریب اعتماد بالاتری نسبت به کهن‌الگوهای یاغی و ساختارشکن کسب می‌کنند.
- **انطباق رفتار با کلام:** هرگونه تناقض میان ادعای اصالت و رفتار پرسنل فروش در مغازه یا پاسخگویی پشتیبانی، شخصیت برند را تخریب می‌کند.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده کهن‌الگوی مسلط و متمم:** برند حداکثر یک کهن‌الگوی اصلی (۷۰٪ لحن و تصویر) و یک کهن‌الگوی متمم (۳۰٪) دارد.
2. **قاعده ثبات رفتاری:** شخصیت برند نباید با تغییر فصل یا کمپین تغییر کند؛ این ویژگی ستون فقرات پایدار هویت است."""
    },

    # 05 - Verbal Identity
    "wiki/05-verbal-identity/messaging.md": {
        "sources": ["SRC-FOUNDATION-07", "SRC-FOUNDATION-20", "SRC-FOUNDATION-21"],
        "extra_tags": ["message_pillars", "system1_framing", "cialdini_persuasion", "hook"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **دانیل کانمن (SRC-FOUNDATION-07):** سوگیری چارچوب‌بندی (Framing Effect). پیام‌هایی که بر رفع تهدید و پیشگیری از خسران تاکید دارند واکنش فوری سیستم ۱ را برمی‌انگیزند.
- **فیل باردن (SRC-FOUNDATION-20):** کدگذاری صریح در برابر ضمنی؛ پیام باید اهداف انگیزشی امنیت، تسلط یا هیجان را فعال کند.
- **رابرت چالدینی (SRC-FOUNDATION-21):** بهره‌گیری از اهرم‌های اقتدار، اثبات اجتماعی و عمل متقابل در متن پیام‌ها.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **اثربخشی پیامک‌های شخصی‌سازی‌شده:** گزارش سالانه نجوا (SRC-IR-NAJVA-REPORT-1404-FIRST-PARTY) نشان می‌دهد پیام‌های شخصی‌سازی‌شده نرخ کلیکی معادل ۴.۳۹٪ ثبت کرده‌اند که ۸۷٪ بالاتر از پیام‌های عمومی است.
- **ساده‌سازی زبان اداری:** مخاطب ایرانی از متون رسمی و پرطمطراق گریزان است و پیام‌های ساده، مستقیم و صمیمی را ترجیح می‌دهد.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده قلاب ۳ ثانیه‌ای:** تیتر اصلی پیام باید در ۳ ثانیه اول درد یا منفعت ملموس را منتقل کند.
2. **قاعده سه ستون پیام‌رسانی:** پیام‌ها باید حول ۳ ستون موضوعی مشخص سازمان‌دهی شوند و از پرداختن به شاخ‌وبرگ پرهیز گردد."""
    },

    # 06 - Naming
    "wiki/06-naming/naming-strategy.md": {
        "sources": ["SRC-FOUNDATION-17", "SRC-FOUNDATION-15", "SRC-FOUNDATION-20"],
        "extra_tags": ["naming_territories", "brand_salience", "phonetics", "trademark"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **بایرون شارپ (SRC-FOUNDATION-17):** نام برند مهم‌ترین دارایی متمایز برند (Distinctive Brand Asset) است و باید تلفظ آسان و پایداری بلندمدت داشته باشد.
- **کوین لین کلر (SRC-FOUNDATION-15):** معیارهای شش‌گانه انتخاب المان‌های برند: به‌یادماندنی بودن، معنادار بودن، دوست‌داشتنی بودن، انتقال‌پذیری، انطباق‌پذیری و حفاظت‌پذیری حقوقی.
- **فیل باردن (SRC-FOUNDATION-20):** هماهنگی صوتی و تداعی‌های ناخودآگاه آوایی (Sound Symbolism).""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **ضوابط ثبت علائم تجاری:** الزامات اداره مالکیت معنوی ایران (ثبت واژگان مصوب فرهنگستان زبان و ادب فارسی) و عدم امکان ثبت واژگان لاتین بدون کارت بازرگانی.
- **دسترسی به دامنه .ir و آی‌دی شبکه‌های اجتماعی:** بررسی همزمان آزاد بودن نام دامنه ملی و نام کاربری شبکه‌های اجتماعی.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده تلفظ‌پذیری آسان:** نام باید با یک‌بار شنیدن پشت تلفن قابل نوشتن باشد بدون اینکه نیاز به هجی کردن حروف داشته باشد.
2. **قاعده حفاظت حقوقی:** پیش از نهایی‌سازی باید استعلام اولیه در سامانه مالکیت معنوی کشور انجام شود."""
    },

    # 15 - Visual Identity
    "wiki/15-visual-identity/design-system.md": {
        "sources": ["SRC-INT-PHASE7-VISUAL-CONTRACT", "SRC-FOUNDATION-17", "SRC-FOUNDATION-20"],
        "extra_tags": ["design_system", "distinctive_assets", "visual_grammar", "accessibility"],
        "foundations_text": """### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **قرارداد فاز ۷ هویت بصری (SRC-INT-PHASE7-VISUAL-CONTRACT):** الزام به انطباق ساختار بصری با کهن‌الگو و جهت‌گیری استراتژیک برند؛ تولید راهنمای رنگ، فرم، و سیستم تایپوگرافی بدون نقص.
- **بایرون شارپ (SRC-FOUNDATION-17):** دارایی‌های بصری متمایز (پالت رنگی خاص، فرم لوگو، پترن‌های گرافیکی) پایه‌های برجستگی ذهنی برند در شلف فروشگاه و وب هستند.
- **فیل باردن (SRC-FOUNDATION-20):** کدهای بصری و پردازش ناخودآگاه در کسر ثانیه توسط قشر بینایی مغز.""",
        "iran_context_text": """### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **سازگاری تایپوگرافی فارسی:** ضرورت استفاده از تایپ‌فیس‌های استاندارد بومی با پشتیبانی کامل از وزن‌ها و ارقام فارسی (مانند خانواده وزیرمتن، ایران‌یکان، کلمه).
- **کیفیت در چاپخانه‌های محلی:** طراحی اقلام هویت بصری باید با استانداردهای ماشین‌های چاپ افست و بسته‌بندی موجود در بازار ایران سازگار باشد.""",
        "decision_rules_text": """### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده استقلال رنگی:** رنگ هویت اصلی باید در بین ۳ رقیب مستقیم محلی کاملاً منحصربه‌فرد باشد.
2. **قاعده کنتراست و خوانایی:** کنتراست عناصر متنی در وب و چاپ نباید کمتر از استاندارد WCAG AA (نسبت ۴.۵ به ۱) باشد."""
    }
}

def enrich_articles():
    enriched_count = 0
    for rel_path, data in ENRICHMENT_CATALOG.items():
        filepath = os.path.join(os.path.dirname(__file__), '..', rel_path)
        if not os.path.exists(filepath):
            print(f"File not found: {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as fp:
            content = fp.read()

        # Fix literal \n in content
        content = content.replace('\\n', '\n')

        # Update frontmatter sources and tags
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        if frontmatter_match:
            fm_text = frontmatter_match.group(1)
            # Add sources
            sources_repr = str(data['sources'])
            if 'sources:' in fm_text:
                fm_text = re.sub(r'sources:\s*\[.*?\]', f'sources: {sources_repr}', fm_text)
            else:
                fm_text += f"\nsources: {sources_repr}"

            # Add extra tags
            tags_match = re.search(r'tags:\s*\[(.*?)\]', fm_text)
            if tags_match:
                current_tags = [t.strip().strip("'\"") for t in tags_match.group(1).split(',')]
                all_tags = list(dict.fromkeys(current_tags + data.get('extra_tags', [])))
                fm_text = fm_text.replace(tags_match.group(0), f"tags: {str(all_tags)}")

            body = content[frontmatter_match.end():]
        else:
            body = content
            fm_text = f"sources: {str(data['sources'])}\n"

        # Append structured sections to body
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
        # Ensure we don't duplicate if already exists
        if "پایه‌های علمی و مراجع دانشی" not in body:
            body = body.rstrip() + new_sections

        new_content = f"---\n{fm_text.strip()}\n---\n\n{body.lstrip()}"

        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(new_content)

        print(f"Enriched core article: {rel_path}")
        enriched_count += 1

    print(f"\nSuccessfully enriched {enriched_count} core wiki articles with canonical foundations and Iranian evidence!")

if __name__ == '__main__':
    enrich_articles()
