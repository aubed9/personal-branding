# DIGITAL MARKET — Knowledge-Driven Brand Building Architecture

منطق اجرایی مصاحبه، علت خروجی‌های تکراری نسخه قبلی، اصلاحات و محدودیت‌های فعلی در [گزارش فارسی منطق پرسش و خروجی](ADAPTIVE-INTERVIEW-FIX.fa.md) توضیح داده شده است. نسخه فعلی پاسخ‌ها را با شناسه شاهد نگه می‌دارد، پرسش بعدی را به پاسخ‌های مرتبط متصل می‌کند و خروجی‌های وابسته به پاسخ ویرایش‌شده را برای بازبینی علامت می‌زند. تست سازگاری ۷۵۳ صنف، تأیید کیفیت مشاوره یا اطلاعات زنده بازار نیست.

**DIGITAL MARKET** یک فریم‌ورک ماژولار، پیشرفته و دانش‌بنیان مبتنی بر هوش مصنوعی (AI-Agent Architecture) برای استراتژی، هویت‌سازی، طراحی و تجاری‌سازی برندها در بازار ایران و خاورمیانه است. این سیستم با گذر از پرامپت‌های سنتی و جنریک، یک موتور هوشمند مبتنی بر پایگاه دانش ۱۶۵ منبعی، مسیریاب ۱۵ محوره بافتار کسب‌وکار و ماشین حالت با گیت‌های ورود و خروج سخت‌گیرانه ارائه می‌دهد.

---

## ویژگی‌های کلیدی معماری (Core Architectural Pillars)

1. **ارکستراسیون یکپارچه در ۸ فاز (Master Workflow Orchestration)**:
   هدایت ترتیبی و گیت‌محور پروژه از تحلیل اقتصاد واحد و مالی تا اجرای تجاری ۳۶۵ روزه.
2. **مسیریاب ۱۵ محوره بافتار کسب‌وکار (Business Context Router)**:
   پرهیز از برچسب‌های تک‌بعدی؛ تشخیص دقیق بافتار بر اساس مدل درآمدی، کانال، بلوغ، جغرافیا، رگولیشن، وابستگی به بنیان‌گذار و...
3. **پایگاه دانش ۳۶ مقاله‌ای ساختاریافته (Knowledge Base & Durable IDs)**:
   ۳۶ مقاله جامع در ۱۲ حوزه با شناسه پایدار (`KB-...`)، ساختار استاندارد ۱۴ بخشی و منطق رفرانس دوطرفه.
4. **رجیستری دانش ماشین‌خوان (`wiki/registry.yaml`)**:
   فهرست متمرکز شناسه‌ها، مقالات، مفاهیم، فازهای مرتبط، نوع کسب‌وکار، وابستگی‌ها و نمونه سوالات بافتار.
5. **ماشین حالت و دفتر کل شواهد (Project State & Evidence Ledger)**:
   جداسازی قطعی داده‌ها در ۷ کلاس مشخص: `FACT`, `DECISION`, `ASSUMPTION`, `UNKNOWN`, `CONTRADICTION`, `RISK`, `BLOCKER`.
6. **لایه هوشمند برند شخصی و بنیان‌گذار (Founder Brand Overlay)**:
   فعال‌سازی شرطی ابعاد برند شخصی مدیرعامل/متخصص بدون آسیب به استراتژی تجاری شرکت.
7. **تعامل کاملاً فارسی، محترمانه و دقیق (Persian Customer Interaction)**:
   ارائه تمامی مفاهیم سنگین برندینگ به زبان فارسی رسا، روان، بدون لفاظی‌های پوچ و متناسب با ادبیات واقعی هر صنف.

---

## ساختار دایرکتوری‌ها (Repository Directory Map)

```text
d:/personal branding/
├── schemas/                         # اسکیماهای سخت‌گیرانه JSON Schema (Draft-07)
│   ├── business-context.schema.json # ساختار ۱۵ محوره بافتار کسب‌وکار
│   ├── project-state.schema.json    # ماشین حالت، دفتر کل تصمیمات و شواهد
│   ├── wiki-article.schema.json     # استاندارد فرانت‌متر مقالات پایگاه دانش
│   └── question.schema.json         # ساختار سوالات بافتارمحور متصل به دانش
├── wiki/                            # پایگاه دانش ۳۶ مقاله‌ای در ۱۳ پوشه
│   ├── 00-system/                   # اصول سیستم، جریان کار، گیت‌ها و شواهد
│   ├── 01-business-foundation/      # مدل کسب‌وکار، کانال‌ها، اقتصاد واحد، اهداف
│   ├── 02-market-research/          # تحقیقات بازار، رقبا، قیمت‌گذاری، بخش‌بندی
│   ├── 03-strategy/                 # جایگاه‌یابی، تمایز، ارزش پیشنهادی، ارکان
│   ├── 04-brand-identity/           # شخصیت برند، کهن‌الگو، اصول رفتار
│   ├── 05-verbal-identity/          # هویت کلامی، لحن، پیام کلیدی، پیچ آسانسوری
│   ├── 06-naming/                   # نام‌گذاری، شعار، احراز علائم تجاری
│   ├── 07-business-types/           # راهنماهای تخصصی اصناف (فروشگاه، کافه، SaaS...)
│   ├── 08-personal-brand/           # برند بنیان‌گذار، رهبری فکری، روابط عمومی
│   ├── 09-metrics/                  # شاخص‌های کلیدی عملکرد برند و مالی
│   ├── 10-playbooks/                # مدیریت بحران و سناریوهای اقتضایی
│   ├── 11-glossary/                 # واژه‌نامه تخصصی برندسازی و اقتصاد
│   ├── 12-governance/               # قوانین یگانه منبع حقیقت (Single Source of Truth)
│   ├── registry.yaml                # رجیستری متمرکز کل مقالات، شناسه‌ها و سوالات
│   ├── INDEX.md                     # نقشه درختی و موضوعی مقالات
│   └── README.md                    # راهنمای پایگاه دانش و استاندارد توسعه
├── skills/                          # ۱۱ اسکیل تخصصی ماژولار (پوشه‌بندی و SKILL.md)
│   ├── digital-market-brand-building-orchestrator/
│   ├── digital-market-business-context-router/
│   ├── digital-market-phase1-business-foundation/
│   ├── digital-market-phase2-research-intelligence/
│   ├── digital-market-phase3-strategy-brand-direction/
│   ├── digital-market-phase4-brand-identity-character/
│   ├── digital-market-phase5-verbal-identity-messaging/
│   ├── digital-market-phase6-naming-tagline-creative-direction/
│   ├── digital-market-phase7-visual-identity-design-system/
│   ├── digital-market-phase8-executive-activation-reputation/
│   └── llm-wiki/
├── state/                           # نمونه‌ها و تاریخچه حالت پروژه‌ها
│   └── project-state.template.json  # قالب استاندارد حالت پروژه
├── scripts/                         # اسکریپت‌های اعتبارسنجی و ممیزی سیستم
│   └── validate_system.py           # اعتبارسنجی اسکیماها، لینک‌ها، رجیستری و سناریوها
├── platform/                        # اپلیکیشن وب و رابط کاربری تعاملی (React/Vite)
├── ARCHITECTURE.md                  # سند مشخصات فنی کامل سیستم
├── INTEGRATION-REPORT.md            # گزارش ادغام، حذف موارد تکراری و رفع تعارضات
├── MIGRATION-PLAN.md                # سند و راهنمای مهاجرت سیستم‌های قبلی به نسخه ۲
└── CHANGELOG.md                     # تاریخچه تغییرات و نسخه‌بندی سیستم
```

---

## راهنمای شروع سریع (Quickstart Guide)

### ۱. اجرای اعتبارسنجی کامل سیستم (Automated Validation)
برای اطمینان از سلامت اسکیماها، شناسه‌های پایدار، سلامت پیوندهای مقالات و اجرای موفق سناریوهای هفت‌گانه:
```powershell
python scripts/validate_system.py
```

### ۲. شروع یک پروژه جدید با ایجنت‌های هوش مصنوعی
1. یک فایل حالت بر اساس `state/project-state.template.json` ایجاد کنید.
2. با فراخوانی اسکیل `digital-market-business-context-router` بافتار کسب‌وکار کاربر را در ۱۵ محور تعیین و اورلی‌های مربوطه را فعال کنید.
3. سوالات بافتارمحور را از `wiki/registry.yaml` واکشی و به زبان فارسی رسا با کاربر مطرح کنید.
4. داده‌های اولیه را در دفتر کل شواهد با تگ‌های `FACT` یا `ASSUMPTION` ثبت کنید.
5. به ترتیب از فاز ۱ تا ۸ حرکت کنید و در پایان هر فاز، شرایط گیت خروج را در متادیتا اعتبارسنجی نمایید.

### ۳. راه‌اندازی پلتفرم وب تعاملی
```powershell
cd platform
npm run dev
```
پلتفرم به صورت زنده روی پورت ۵۱۸۸ در دسترس قرار خواهد گرفت.

---

## اسناد تکمیلی مرجع
- برای درک عمیق سازوکار جریان داده، تصمیم‌گیری و نمودارهای مِرمید به [ARCHITECTURE.md](file:///d:/personal%20branding/ARCHITECTURE.md) مراجعه کنید.
- برای بررسی گزارش حذف موارد تکراری و قوانین یگانه منبع حقیقت به [INTEGRATION-REPORT.md](file:///d:/personal%20branding/INTEGRATION-REPORT.md) مراجعه فرمایید.
- برای دستورالعمل تبدیل فایل‌های قدیمی به ساختار جدید، [MIGRATION-PLAN.md](file:///d:/personal%20branding/MIGRATION-PLAN.md) را مطالعه نمایید.
