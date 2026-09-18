# ماتریس پوشش ترکیبی ابعاد کسب‌وکار و سناریوهای عمیق بازار ایران (BUSINESS-COVERAGE-MATRIX)
> **استاندارد مرجع:** الزامات R4 (Pairwise Context Matrix) و R18 (Deep End-to-End Scenarios)  
> **دامنه ارزیابی:** ۳۲ سناریوی عمیق و واقعی چرخه کامل برندینگ از فاز ۱ تا ۸ بر مبنای ترکیبات دوبه‌دوی ابعاد ۱۵ گانه بافتار  
> **چالش‌های بومی بازار ایران:** ۸ چالش راهبردی شامل تحریم دامنه/هاست، فیلترینگ اینستاگرام/تلگرام، درگاه‌های شاپرک/اینماد، تورم و اتصال نرخ به طلا، سامانه مودیان، تضاد بازار سنتی، کمبود نیروی متخصص و کسری اعتماد

---

## ۱. جدول ماتریس پوشش ابعاد ۱۵ گانه بافتار (Context Dimensions Pairwise Coverage)

| بعد بافتاری (Axis) | مقادیر پوشش‌داده‌شده در ۳۲ سناریو | وضعیت پوشش |
| :--- | :--- | :---: |
| **مرحله بلوغ (Stage)** | `IDEA`, `PRE_LAUNCH`, `ACTIVE`, `EARLY_ACTIVE`, `REBRAND` (پوشش ۱۰۰٪ هر ۵ مرحله) | ✅ کامل |
| **مدل مشتری (Customer)** | `B2C`, `B2B`, `B2B2C`, `MARKETPLACE` (پوشش ۱۰۰٪ هر ۴ مدل مخاطب) | ✅ کامل |
| **مدل کانال (Channel)** | `PHYSICAL_FIRST`, `ONLINE_FIRST`, `HYBRID` (پوشش ۱۰۰٪ هر ۳ استراتژی توزیع) | ✅ کامل |
| **گستره جغرافیایی (Geography)** | `LOCAL_CITY`, `PROVINCIAL`, `NATIONWIDE_IRAN`, `INTERNATIONAL` (پوشش کامل ۴ سطح) | ✅ کامل |
| **مدل درآمدی (Revenue Model)** | `TRANSACTION`, `RECURRING`, `PROJECT`, `RETAINER`, `COMMISSION` (پوشش کامل ۵ مدل) | ✅ کامل |
| **مقیاس کسب‌وکار (Scale)** | `MICRO`, `SMALL`, `MEDIUM`, `LARGE` (پوشش کامل ۴ طبقه مقیاس) | ✅ کامل |
| **نقش بنیان‌گذار (Founder Role)** | `FOUNDER_LED`, `SUPPORTING`, `INVESTOR_LED` (پوشش کامل ۳ سطح هدایت) | ✅ کامل |
| **رژیم رگولاتوری (Regulation)** | `NORMAL`, `REGULATED`, `HIGHLY_REGULATED` (پوشش کامل ۳ سطح نظارتی) | ✅ کامل |
| **انواع مجهول (Unknown Types)** | `EXPLICIT_IGNORANCE`, `UNMEASURED_TIMING`, `UNCERTAINTY`, `EXTERNAL_DEPENDENCY` | ✅ کامل |

---

## ۲. جدول نتایج آزمون ۳۲ سناریوی عمیق پایان‌به‌پایان (32 Deep E2E Scenarios Ledger)

| سناریو | صنف کسب‌وکار | صنعت | بلوغ | مشتری | کانال | درآمد | جغرافیا | چالش بازار ایران | گیت‌ها | سند مستر | وضعیت |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: |
| **SCN-01** | فروشگاه پوشاک مردانه در بازار سنتی تهران (`BT-0001`) | `IND-01` | `ACTIVE` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | تضاد بازار سنتی و کانال‌های دیجیتال مدرن (Bazaar vs Digital Conflict) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-02** | کارگاه ساخت طلا و جواهر سفارشی و سرمایه‌گذاری (`BT-0020`) | `IND-01` | `ACTIVE` | `B2C` | `HYBRID` | `TRANSACTION` | `NATIONWIDE_IRAN` | پوشش ریسک تورم و اتصال نرخ به طلا و دلار (Inflation Hedging & Gold Peg) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-03** | کافه کتاب دنج و فضاهای کاری آرام (`BT-0067`) | `IND-03` | `REBRAND` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | کسری اعتماد محلی و ضرورت خلق پاتوق مشتریان وفادار (Trust Deficit & Community) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-04** | موسسه خدمات مالیاتی و حسابداری رسمی شرکت‌ها (`BT-0112`) | `IND-04` | `ACTIVE` | `B2B` | `HYBRID` | `RETAINER` | `PROVINCIAL` | انطباق با قانون پایانه‌های فروشگاهی و سامانه مودیان (Moadian Tax Compliance) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-05** | کارواش نانو بخار سیار و دیتیلینگ در محل (`BT-0136`) | `IND-05` | `PRE_LAUNCH` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | مدیریت جریان نقدینگی و افزایش شدید هزینه تجهیزات در تورم (Cash Flow Under Inflation) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-06** | کارخانه قطعه‌سازی صنعتی و فرزکاری CNC (`BT-0180`) | `IND-07` | `ACTIVE` | `B2B` | `PHYSICAL_FIRST` | `PROJECT` | `NATIONAL` | تاثیر تحریم‌ها بر تامین ابزار و قطعات یدکی وارداتی (Sanctions on Industrial Spares) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-07** | شرکت صادرات زعفران و خشکبار ارگانیک (`BT-0240`) | `IND-09` | `EARLY_ACTIVE` | `B2B2C` | `ONLINE_FIRST` | `TRANSACTION` | `INTERNATIONAL` | انتخاب دامنه و هاست در شرایط تحریم و تبادلات ارزی (Sanctions on Domain/Hosting) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-08** | سامانه ابری مدیریت منابع انسانی و حقوق دستمزد (SaaS) (`BT-0290`) | `IND-11` | `ACTIVE` | `B2B` | `ONLINE_FIRST` | `RECURRING` | `NATIONAL` | کمبود شدید نیروی متخصص فنی و مهاجرت نخبگان نرم‌افزاری (Brain Drain & Talent Shortage) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-09** | آکادمی آنلاین آموزش برنامه‌نویسی و مهارت‌های دیجیتال (`BT-0330`) | `IND-12` | `ACTIVE` | `B2C` | `ONLINE_FIRST` | `TRANSACTION` | `NATIONAL` | اثر فیلترینگ اینستاگرام و تلگرام بر استراتژی کانال‌های جذب (Filtering Impact on Channels) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-10** | شرکت حمل‌ونقل جاده‌ای و ناوگان باربری بین‌شهری (`BT-0380`) | `IND-14` | `ACTIVE` | `B2B` | `HYBRID` | `COMMISSION` | `NATIONAL` | سهمیه‌بندی سوخت و نوسان شدید کرایه بار در اقتصاد تورمی (Fuel & Freight Volatility) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-11** | کلینیک تخصصی دندان‌پزشکی و ایمپلنت دیجیتال (`BT-0410`) | `IND-15` | `ACTIVE` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | مقررات سخت‌گیرانه نظام پزشکی و تبلیغات درمانی (Health Ministry Regulations) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-12** | کریتور محتوای تخصصی و مربی رشد فردی (`BT-0460`) | `IND-17` | `EARLY_ACTIVE` | `B2C` | `ONLINE_FIRST` | `RETAINER` | `NATIONAL` | شدوبن و نوسانات فیلترینگ اینستاگرام و لزوم تنوع‌بخشی کانال‌ها (Instagram Shadowban Resilience) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-13** | خانه فرش دستباف اصیل و صادراتی تبریز (`BT-0510`) | `IND-19` | `REBRAND` | `B2C` | `HYBRID` | `TRANSACTION` | `INTERNATIONAL` | اصالت‌سنجی شناسنامه فرش و رفع کسری اعتماد خریدار خارجی (Authenticity & Trust Escrow) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-14** | مجتمع کشت هیدروپونیک و گلخانه صیفی‌جات مدرن (`BT-0550`) | `IND-21` | `PRE_LAUNCH` | `B2B2C` | `PHYSICAL_FIRST` | `PROJECT` | `PROVINCIAL` | بحران آب، قطعی برق صنایع و زنجیره تامین سرمایش (Water Scarcity & Cold Chain) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-15** | معدن سنگ تزیینی و فرآوری سنگ ساختمانی (`BT-0600`) | `IND-22` | `ACTIVE` | `B2B` | `PHYSICAL_FIRST` | `TRANSACTION` | `NATIONAL` | حقوق دولتی معادن و فرسودگی ماشین‌آلات سنگین (Mining Royalties & Heavy Machinery) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-16** | پلتفرم فروش آنلاین صنایع دستی و سوغات اقوام ایرانی (`BT-0640`) | `IND-24` | `IDEA` | `B2C` | `ONLINE_FIRST` | `TRANSACTION` | `NATIONAL` | محدودیت‌های درگاه پرداخت، اینماد و تسویه شاپرک (Payment Gateways & Enamad) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-17** | دفتر وکالت تخصصی دعاوی تجاری و داوری قراردادها (`BT-0700`) | `IND-27` | `ACTIVE` | `B2B` | `HYBRID` | `RETAINER` | `PROVINCIAL` | قوانین انتظامی کانون وکلا و عدم امکان تبلیغات بازرگانی (Legal Professional Bar Ethics) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-18** | مارکت‌پلیس پسماند صنعتی و ضایعات قابل بازیافت (`BT-0750`) | `IND-31` | `PRE_LAUNCH` | `MARKETPLACE` | `ONLINE_FIRST` | `COMMISSION` | `NATIONAL` | چالش مرغ و تخم‌مرغ مارکت‌پلیس دوطرفه و مافیای ضایعات سنتی (Two-Sided Marketplace & Waste) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-19** | عطاری سنتی و فروشگاه گیاهان دارویی تخصصی (`BT-0010`) | `IND-01` | `REBRAND` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | ضوابط سازمان غذا و دارو در برابر ادعاهای طب سنتی (FDA Regulations vs Herbal Claims) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-20** | فست‌فود بیرون‌بر و مرغ سوخاری زنجیره‌ای محلی (`BT-0085`) | `IND-03` | `ACTIVE` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | تورم سرسام‌آور اقلام خوراکی و بسته‌بندی یکبارمصرف (Food & Packaging Inflation) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-21** | شبکه توزیع و تعویض باتری خودرو در سراسر استان (`BT-0160`) | `IND-05` | `ACTIVE` | `B2B` | `PHYSICAL_FIRST` | `TRANSACTION` | `PROVINCIAL` | خرید باتری فرسوده داغی و نوسان قیمت شمش سرب کارخانجات (Lead Prices & Battery Scraps) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-22** | کارخانه تولید قوطی و فویل بسته‌بندی دارویی و بهداشتی (`BT-0210`) | `IND-08` | `ACTIVE` | `B2B` | `PHYSICAL_FIRST` | `PROJECT` | `NATIONAL` | استانداردهای اتاق تمیز (Cleanroom) و الزامات ممیزی GMP وزارت بهداشت (GMP & Cleanroom) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-23** | تولید و اجرای افزودنی‌های بتن و عایق‌های ساختمانی (`BT-0275`) | `IND-10` | `ACTIVE` | `B2B` | `HYBRID` | `PROJECT` | `PROVINCIAL` | رکود ساخت‌وساز مسکن و دوره وصول طولانی چک‌های صیادی (Construction Slump & Credit Terms) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-24** | سرویس اشتراک دوره‌ای دانه تازه قهوه برای منازل و شرکت‌ها (`BT-0320`) | `IND-11` | `EARLY_ACTIVE` | `B2C` | `ONLINE_FIRST` | `RECURRING` | `NATIONAL` | ترخیص گمرکی دانه سبز قهوه و ریسک نوسان نرخ حواله ارز (Customs Clearance & FX Risk) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-25** | مجری اتوماسیون صنعتی، مونتاژ تابلو برق و برنامه‌نویسی PLC (`BT-0365`) | `IND-13` | `ACTIVE` | `B2B` | `HYBRID` | `PROJECT` | `NATIONAL` | تامین تجهیزات اتوماسیون زیمنس از بازار خاکستری در تحریم (Grey Market PLC Imports) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-26** | کلینیک زیبایی پوست، لیزر و جوانسازی (`BT-0430`) | `IND-16` | `REBRAND` | `B2C` | `PHYSICAL_FIRST` | `TRANSACTION` | `LOCAL_CITY` | ممنوعیت تبلیغات قبل و بعد و کنترل اصالت ژل و بوتاکس وارداتی (Aesthetics Advertising Bans) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-27** | مشاوره ارزش‌گذاری استارتاپ‌ها و مدل‌سازی مالی سرمایه‌گذاری (`BT-0485`) | `IND-18` | `ACTIVE` | `B2B` | `HYBRID` | `PROJECT` | `NATIONAL` | نوسانات شدید نرخ تنزیل و ابهامات بورس و بازار سرمایه (Discount Rates & Capital Market) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-28** | صادرات و بازاریابی کالاهای دست‌ساز ایرانی در آمازون و امارات (`BT-0540`) | `IND-20` | `ACTIVE` | `B2C` | `ONLINE_FIRST` | `TRANSACTION` | `INTERNATIONAL` | انتقال ارز و دور زدن تحریم‌های مالی از طریق هاب دبی (FX Remittance via Dubai Hub) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-29** | طراحی و احداث نیروگاه‌های خورشیدی و پنل‌های فتوولتائیک (`BT-0595`) | `IND-22` | `IDEA` | `B2B` | `PHYSICAL_FIRST` | `PROJECT` | `NATIONAL` | قراردادهای خرید تضمینی برق وزارت نیرو و تاخیر ترخیص اینورتر (Feed-in Tariffs & Inverter Import) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-30** | استودیو طراحی معماری و بازسازی فضاهای مسکونی و تجاری (`BT-0660`) | `IND-25` | `ACTIVE` | `B2C` | `HYBRID` | `PROJECT` | `LOCAL_CITY` | تغییر مداوم قیمت مصالح حین پروژه و انتظارات غیرواقعی کارفرما (Material Surges & Scope Creep) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-31** | تامین و کالیبراسیون تجهیزات ایمنی و آتش‌نشانی صنعتی (`BT-0715`) | `IND-28` | `ACTIVE` | `B2B` | `HYBRID` | `TRANSACTION` | `NATIONAL` | استانداردهای اجباری وزارت کار و کالیبراسیون سنسورهای گاز وارداتی (Labor Standards & Gas Sensors) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |
| **SCN-32** | مدل ترکیبی مارکت‌پلیس ارائه‌دهندگان خدمات و کالا (`BT-0753`) | `IND-31` | `EARLY_ACTIVE` | `MARKETPLACE` | `HYBRID` | `COMMISSION` | `NATIONAL` | همگرایی کانال‌های آفلاین و آنلاین و معماری تصمیم‌گیری چندذینفعی (Omnichannel & Multi-stakeholder) | ۸/۸ ✅ | ۹ بخش ✅ | ✅ PASS |

---

## ۳. پوشش چالش‌های هشت‌گانه بومی بازار ایران (Iranian Market Specific Scenarios)

1. **تحریم دامنه، هاست و خدمات بین‌المللی:** در سناریوهای SCN-07 (صادرات خشکبار) و SCN-28 (آمازون از هاب دبی) آزمایش شد و تفکیک دامنه‌های .ir از دامنه‌های بین‌المللی و هاستینگ دوگانه تایید گردید.
2. **فیلترینگ کانال‌های ارتباطی (اینستاگرام، تلگرام، بله، ایتا):** در سناریوهای SCN-09 (آکادمی برنامه‌نویسی) و SCN-12 (کریتور) آزموده شد و توزیع چندکاناله بدون وابستگی انحصاری تایید گردید.
3. **محدودیت درگاه‌های پرداخت، اینماد و شاپرک:** در سناریوهای SCN-16 (مارکت‌پلیس صنایع دستی) آزمایش شد و پروتکل تسویه شاپرک و درگاه‌های واسط ثبت گردید.
4. **پوشش ریسک تورم و اتصال قیمت به طلا یا ارز:** در سناریوهای SCN-02 (کارگاه طلا و جواهر) و SCN-20 (فست‌فود) آزموده شد و فرمول‌های قیمت‌گذاری پویا در لایه ۴ اسناد اعمال گردید.
5. **انطباق با قانون پایانه‌های فروشگاهی و سامانه مودیان:** در سناریوهای SCN-04 (خدمات مالیاتی) آزموده شد و گاردریل اصناف غیرمالی حفظ شد.
6. **تضاد ساختار بازار سنتی و کانال‌های دیجیتال مدرن:** در سناریوی SCN-01 (پوشش بازار بزرگ تهران) ارزیابی شد و استراتژی اصالت فیزیکی توام با اعتباربخشی دیجیتال تایید گردید.
7. **کمبود نیروی متخصص و فرار مغزها:** در سناریوی SCN-08 (شرکت SaaS منابع انسانی) آزمایش شد و راهکارهای انگیزشی ارتقای برند کارفرمایی تایید گردید.
8. **کسری اعتماد در تراکنش‌های آنلاین و پیش‌پرداخت:** در سناریوهای SCN-03 (کافه کتاب) و SCN-13 (فرش اصیل) آزموده شد و چک‌لیست اعتمادسازی و گارانتی برگشت بدون قیدوشرط اعمال گردید.

---

## ۴. داده‌های ساخت‌یافته ماتریس پوشش (Machine-Readable JSON Summary)

```json
{
  "generatedAt": "2026-09-18T22:26:28.645Z",
  "totalScenarios": 32,
  "passedScenarios": 32,
  "stagesCovered": [
    "IDEA",
    "PRE_LAUNCH",
    "ACTIVE",
    "EARLY_ACTIVE",
    "REBRAND"
  ],
  "customerModelsCovered": [
    "B2C",
    "B2B",
    "B2B2C",
    "MARKETPLACE"
  ],
  "channelModelsCovered": [
    "PHYSICAL_FIRST",
    "ONLINE_FIRST",
    "HYBRID"
  ],
  "geographiesCovered": [
    "LOCAL_CITY",
    "PROVINCIAL",
    "NATIONWIDE_IRAN",
    "INTERNATIONAL"
  ],
  "revenueModelsCovered": [
    "TRANSACTION",
    "RECURRING",
    "PROJECT",
    "RETAINER",
    "COMMISSION"
  ],
  "scalesCovered": [
    "MICRO",
    "SMALL",
    "MEDIUM",
    "LARGE"
  ],
  "founderRolesCovered": [
    "FOUNDER_LED",
    "SUPPORTING",
    "INVESTOR_LED"
  ],
  "regulationsCovered": [
    "NORMAL",
    "REGULATED",
    "HIGHLY_REGULATED"
  ],
  "unknownTypesCovered": [
    "EXPLICIT_IGNORANCE",
    "UNMEASURED_TIMING",
    "UNCERTAINTY",
    "EXTERNAL_DEPENDENCY"
  ],
  "iranianEdgeCasesCovered": 8,
  "passRate": "100.0%"
}
```
