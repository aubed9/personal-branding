# DIGITAL MARKET v2.0 — System Architecture Specification

## ۱. خلاصه‌ی اجرایی و اصول بنیادین معماری (Executive Summary)

**DIGITAL MARKET** یک اکوسیستم جامع مبتنی بر معماری کارگزاران هوشمند (AI-Agent Architecture) است که فرآیند برندسازی تجاری، استراتژی بازار، هویت‌سازی و عملیات اجرایی را از حالت یک فرآیند ذهنی، سلیقه‌ای و متن‌محور خارج کرده و به یک سیستم مهندسی‌شده، مستند، داده‌محور و ردیابی‌پذیر تبدیل می‌کند.

### اصول محوری معماری:
1. **پایگاه دانش محوری (Knowledge-Grounded Execution)**:
   هیچ تصمیم استراتژیک، نام‌گذاری، هویت کلامی یا سیستم بصری نباید ناشی از توهم (Hallucination) مدل‌های زبانی باشد؛ تمامی خروجی‌ها به ۳۶ مقاله مرجع و ۱۶۵ منبع علمی و میدانی گره خورده‌اند.
2. **عدم تقلیل بافتار (Non-Reductionist Context Specialization)**:
   کسب‌وکارها در قالب یک منوی کشویی ساده (مانند خرده‌فروشی یا خدماتی) دسته‌بندی نمی‌شوند. بافتار از ترکیب ۱۵ بعد مستقل ریاضی و بیزنسی بازتولید شده و اورلی‌های عملیاتی را فعال می‌کند.
3. **گیت‌های سخت‌گیرانه فازها (Strict Phase Gates & No-Skip Policy)**:
   سیستم به صورت مطلق اجازه تصمیم‌گیری زودهنگام (مانند تعیین نام، لوگو یا رنگ قبل از تصویب اقتصاد واحد و پرسونای مخاطب) را نمی‌دهد.
4. **ردیابی‌پذیری و دفتر کل شواهد (State & Evidence Ledger)**:
   هر تصمیم باید به شواهد عینی، داده‌های راستی‌آزمایی‌شده یا فرضیات ریسک‌سنجی‌شده متصل باشد. اگر یک تصمیم جدید با داده‌های فازهای قبل تعارض پیدا کند، سیستم پروتکل بازگشت به فاز قبلی (Re-entry) را فعال می‌کند.
5. **ارتباط روان و محترمانه به زبان فارسی (Dignified Persian Engine)**:
   تمامی تعاملات سمت کاربر با زبان فارسی دقیق، فاخر، بدون اصطلاحات گیج‌کننده انگلیسی و متناسب با فرهنگ بازار ایران هدایت می‌شود.

---

## ۲. زنجیره ۱۰ حلقه‌ای تصمیمات بیزنس و برند (The 10-Link Decision Chain)

در ساختار DIGITAL MARKET، فرآیند ساخت برند در ۱۰ حلقه پیوسته مدل‌سازی شده است. شکست در هر حلقه، خروجی حلقه‌های بعدی را باطل می‌کند:

```mermaid
graph TD
    L1["۱. اقتصاد واحد و قیود نقدی (Unit Economics)"] --> L2["۲. هوش بازار و شواهد مشتری (Market Intelligence)"]
    L2 --> L3["۳. استراتژی برند و جایگاه‌سازی انحصاری (Brand Strategy)"]
    L3 --> L4["۴. شخصیت، روانشناسی و کهن‌الگو (Brand Archetype)"]
    L4 --> L5["۵. هویت کلامی و ارکان پیام (Verbal Messaging)"]
    L5 --> L6["۶. نام‌گذاری، شعار و ممیزی حقوقی (Naming & Tagline)"]
    L6 --> L7["۷. دیزاین سیستم و هویت بصری (Visual Design System)"]
    L7 --> L8["۸. ماشین فعال‌سازی و اعتبار تجاری (Executive Activation)"]
    L8 --> L9["۹. سنجش مداوم، سئو و اتریبیوشن (Measurement & Attribution)"]
    L9 --> L10["۱۰. سناریوهای بحران و تاب‌آوری (Crisis & Resilience)"]
```

---

## ۳. مسیریاب بافتار کسب‌وکار و لایه انطباق تخصصی (Business Context Router)

مسیریاب بافتار کسب‌وکار (`digital-market-business-context-router`) در آغاز فرآیند، بافتار را در ۱۵ محور متعامد استخراج می‌کند:

| شماره | محور تخصصی (Axis) | مقادیر نمونه | تأثیر بر فرآیند و سوالات |
|:---|:---|:---|:---|
| ۱ | `primary_business_model` | B2B, B2C, D2C, B2B2C, Marketplace, SaaS | شیوه ارزش‌آفرینی و نوع مشتری طرف حساب |
| ۲ | `channel_mix` | Pure Physical, Omnichannel, Digital Direct, B2B Direct | تمرکز بر لوکیشن فیزیکی یا سئو و پرفورمنس آنلاین |
| ۳ | `business_stage` | Concept, Pre-revenue, Scaling, Established Turnaround | میزان ریسک‌پذیری، بودجه و افق زمانی اقدامات |
| ۴ | `ticket_size_risk` | Low Ticket Habitual, High Ticket Considered, Enterprise Complex | طول چرخه فروش و سطح نیاز به اعتماد فنی |
| ۵ | `market_geography` | Hyper-local, Regional, National, Export International | محدوده تبلیغات و زبان برند |
| ۶ | `category_sector` | Hospitality, Tech, Industrial Manufacturing, Beauty, Healthcare | اصطلاحات صنفی، استانداردهای بهداشتی یا صنعتی |
| ۷ | `regulatory_environment` | Heavy License, Healthcare Med, Standard Commercial, Low | الزامات نماد اعتماد، سیب سلامت، پروانه‌های دولتی |
| ۸ | `operational_footprint` | Single Unit, Multi-branch, Factory, Pure Remote Cloud | مقتضیات فیزیکی تابلوسازی، یونیفرم و معماری فضا |
| ۹ | `asset_intensity` | Asset Light, Heavy Machinery, Inventory Heavy | نیاز به سرمایه در گردش و کشش تخفیف |
| ۱۰ | `margin_structure` | Thin (<15%), Medium (15-40%), High Gross (>70%) | امکان مانور روی هدایا، باشگاه مشتریان یا تبلیغات |
| ۱۱ | `founder_visibility` | Founder-led Face, Behind Scenes, Institutional Corporate | فعال‌سازی یا غیرفعال‌سازی لایه پرسونال برندینگ |
| ۱۲ | `tech_dependency` | Pure Manual, Consumer Basic, Custom Core Proprietary | پیچیدگی ابزارهای ارتباطی و اتوماسیون مارکتینگ |
| ۱۳ | `competition_density` | Monopolistic Blue Ocean, Moderate, Cut-throat Red Ocean | ضرورت تمایز حاد (Sharp Differentiation) |
| ۱۴ | `cultural_community_affinity`| High Cultural Symbolism, Functional Utility, Subculture | پیوند با آیین‌ها، مناسبت‌ها یا ادبیات محلی |
| ۱۵ | `scalability_bottleneck` | Time Labor Bound, Capital Bound, Inventory Bound, Near Infinite | ظرفیت واقعی پذیرش مشتری جدید بدون افت کیفیت |

### ترکیب اورلی‌ها (Composable Overlays):
به جای طراحی صدها اسکیل مجزا، سیستم مجموعه‌ای از اورلی‌ها را به صورت افزونه ترکیب می‌کند:
- **Local / Physical Overlay**: فعال‌سازی سوالات مربوط به پاخور، تابلو، پارکینگ، گوگل مپ و بازاریابی محلی.
- **B2B / Industrial Overlay**: تمرکز بر کمیسیون‌های خرید سازمانی، بروشورهای فنی، تاییدیه‌ها و لینکدین.
- **SaaS / Tech Overlay**: تمرکز بر مدل اشتراکی، نرخ تبدیل لندینگ پیج، زمان رسیدن به ارزش (TTV) و چِرن.
- **Founder Brand Overlay**: تدوین استراتژی تات‌لیدرشیپ، پادکست، روابط عمومی و شبکه ارتباطی ۱۰۰ نفره مدیرعامل.

---

## ۴. ارکستراتور مادر و ماشین حالت ۸ فاز (Master Workflow Orchestration)

ارکستراتور گردش کار (`digital-market-brand-building-orchestrator`) فرآیند را از طریق ۸ گیت متوالی هدایت می‌کند:

```mermaid
stateDiagram-v2
    [*] --> Phase1: ثبت اطلاعات پایه
    Phase1 --> Phase2: عبور از گیت ۱ (اقتصاد واحد تایید شد)
    Phase2 --> Phase3: عبور از گیت ۲ (شواهد بازار و رقبا قفل شد)
    Phase3 --> Phase4: عبور از گیت ۳ (جایگاه‌یابی و ارزش پیشنهادی قفل شد)
    Phase4 --> Phase5: عبور از گیت ۴ (کهن‌الگو و مرزهای رفتار تثبیت شد)
    Phase5 --> Phase6: عبور از گیت ۵ (پیام کلیدی و پیچ آسانسوری نهایی شد)
    Phase6 --> Phase7: عبور از گیت ۶ (نام و استعلام برند تایید شد)
    Phase7 --> Phase8: عبور از گیت ۷ (کتابچه هویت بصری تدوین شد)
    Phase8 --> [*]: تکمیل سند تجاری ۳۶۵ روزه

    Phase3 --> Phase1: تعارض استراتژی با توان مالی (Re-entry)
    Phase6 --> Phase3: بن‌بست نام با جایگاه‌یابی (Re-entry)
```

### پروتکل بازگشت به فاز قبلی (Re-entry Protocol):
اگر در فازی بعدی مشخص شود که فرضیه‌ای غلط بوده (مثلاً نام انتخابی در فاز ۶ با استعلام ثبت علائم تجاری رد شود، یا هویت کلامی فاز ۵ نیازمند سرمایه‌گذاری خارج از کشش مالی فاز ۱ باشد)، سیستم وضعیت تصمیم را به `CONTRADICTED` تغییر داده و پروژه را برای اصلاح به فاز مربوطه بازمی‌گرداند.

---

## ۵. ساختار داده و دفتر کل شواهد (State & Evidence Ledger)

اطلاعات پروژه در فایل ساختاریافته `project-state.json` و مطابق با `schemas/project-state.schema.json` ذخیره می‌شود:

### رده‌بندی شواهد:
1. **FACT**: داده‌های قطعی اثبات‌شده میدانی، مالی یا اسنادی (دارای منبع و زمان).
2. **DECISION**: انتخاب‌های رسمی تصویب‌شده کاربر در جلسات استراتژی (وضعیت: `PROPOSED`, `LOCKED`, `SUPERSEDED`, `CONTRADICTED`).
3. **ASSUMPTION**: حدسیات اولیه که صحت آن‌ها هنوز بررسی نشده و دارای برچسب سطح ریسک و فاز هدف برای راستی‌آزمایی هستند.
4. **UNKNOWN**: مجهولات صریح در بازار یا محصول با تعیین استراتژی کشف داده.
5. **CONTRADICTION**: تعارضات شناسایی‌شده میان دو فاز که مانع عبور از گیت می‌شوند.

---

## ۶. یکپارچگی با پایگاه دانش (Knowledge Wiki & Registry)

پایگاه دانش سیستم شامل ۳۶ مقاله مرجع در دایرکتوری `wiki/` است. کلیه مفاهیم دارای شناسه‌های یکتا و پایدار با پیشوند `KB-` هستند:
- ارجاع سریع از طریق `wiki/registry.yaml` که شناسه‌ها، مقالات، فازها و نوع سوالات را نگاشت می‌کند.
- جستجوی چندگامی و ارتباطی بر اساس منطق GraphRAG.
- هر مقاله شامل ۱۴ بخش استاندارد شامل تعریف به زبان ساده، مبانی نظری، خطاهای رایج، چک‌لیست و سوالات بافتارمحور است.

---

## ۷. موتور تعاملی زبان فارسی (Persian Customer Interaction)

سیستم از الگوریتم تبدیل مفاهیم پیچیده به پرسش‌های صمیمی و ملموس استفاده می‌کند:
- **برای کارواش و تعویض روغنی**: گفتگو درباره میزان رضایت رانندگان از معطلی، شفافیت فاکتور، نظافت قطعات، و تفاوت روغن تقلبی با اصلی.
- **برای کافی‌شاپ**: گفتگو درباره تکرار خرید مشتریان محله، عطر قهوه تازه، رفتار پرسنل پشت بار و پاتوق‌سازی.
- **برای B2B SaaS**: گفتگو درباره چالش‌های مدیران مالی با نرم‌افزارهای سنتی، نرخ ریزش اشتراک و امنیت سرورها.
- **برای کارخانجات تولیدی**: گفتگو درباره ظرفیت خالی خط تولید، تلورانس ابعادی قطعات و تضمین تحویل به‌موقع در قراردادهای پیمانکاری.

---

## ۸. نمودارهای معماری (Architecture Diagrams)

### دیاگرام جامع جریان داده و اجزای سیستم:
```mermaid
graph LR
    User["کاربر / بنیان‌گذار"] <--> Interaction["موتور تعامل فارسی (UI / Agent)"]
    Interaction <--> Router["مسیریاب بافتار (Context Router)"]
    Router <--> Schemas["اسکیماهای اعتبارسنجی (Schemas)"]
    Router --> Orchestrator["ارکستراتور فازهای ۱ تا ۸"]
    Orchestrator <--> State["دفتر کل حالت و شواهد (State Ledger)"]
    Orchestrator <--> Skills["اسکیلهای تخصصی فازها (Skills 1-8)"]
    Skills <--> Registry["رجیستری دانش (registry.yaml)"]
    Registry <--> Wiki["پایگاه دانش ۳۶ مقاله‌ای (Wiki Articles)"]
```

### دیاگرام جریان شواهد و ردیابی تصمیمات:
```mermaid
graph TD
    Input["ورودی‌های اولیه کاربر"] --> A1["ثبت شواهد قطعی (FACT)"]
    Input --> A2["ثبت فرضیات ریسک‌دار (ASSUMPTION)"]
    Input --> A3["ثبت مجهولات کلیدی (UNKNOWN)"]
    A2 --> Validate["راستی‌آزمایی در تحقیقات فاز ۲"]
    Validate -->|اثبات شد| A1
    Validate -->|رد شد| Resolve["اصلاح فرضیه یا بازتعریف"]
    A1 --> Decision["اتخاذ تصمیم استراتژیک (LOCKED DECISION)"]
    Decision --> Affected["تأثیر بر فازهای وابسته (Affected Phases)"]
    Affected --> Audit["ممیزی تعارض و گیت نهایی"]
```
