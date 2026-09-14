---
title: "Temporal Legal Engine & Statutory Chunking Standard"
type: framework
tags: ["temporal-engine", "statutory-chunking", "legal-entity", "validity-dates"]
sources: ["source-src001-qavanin-ir", "source-src024-pos-terminals-taxpayer-system-act", "source-src013-commercial-code-iran"]
updated: 2026-09-05
status: expanded
---

# Temporal Legal Engine & Statutory Chunking Standard
## موتور زمانی قوانین و استاندارد تفکیک هستی‌شناسانه حقوقی

### ۱. اصل تفکیک ماهوی قوانین (عدم خردسازی پاراگرافی)
در متون حقوقی، خرد کردن متن بر اساس پاراگراف‌های متنی اشتباهی فاحش است؛ ساختار تقنینی باید در پایگاه دانش به طور دقیق حفظ شود:

```
Law (قانون مادر)
  └── Chapter (فصل / باب)
        └── Article (ماده قانونی — دارای موجودیت مستقل)
              ├── Paragraph (بند)
              ├── Clause (جزء)
              ├── Note (تبصره)
              └── Amendment (اصلاحیه تنقیحی)
```

هر ماده قانونی دارای یک شناسه مستقل و فرانت‌متر زمانی است:
```yaml
law:
  name: "قانون تجارت الکترونیکی"
  article:
    number: 37
    text: "در هر معامله از راه دور مصرف‌کننده باید حداقل هفت روز کاری وقت برای انصراف از قبول خود بدون تحمل جریمه یا ارائه دلیل داشته باشد..."
    concepts:
      - consumer_protection
      - withdrawal_right
      - distance_contract
    effective_from: "2004-01-07"
    status: "active"
    amendments: []
    related_articles: ["Art_38", "Art_39"]
    source: "source-src017-electronic-commerce-law"
```

---

### ۲. اعتبارسنجی مقید به زمان (Temporal Validity)
قوانین در گذر زمان دائماً اصلاح، منسوخ یا تمدید می‌شوند (مانند اصلاحات مکرر قانون مالیات‌های مستقیم و پایانه‌های فروشگاهی). سیستم باید توانایی پاسخگویی بر مبنای `valid_at` را داشته باشد:

```yaml
legal_fact:
  statement: "الزام شرکت‌ها به ارسال صورتحساب الکترونیکی به سامانه مؤدیان"
  jurisdiction: "IR"
  source: "قانون پایانه‌های فروشگاهی و سامانه مؤدیان"
  regulator: "سازمان امور مالیاتی کشور"
  article: "ماده ۵"
  valid_from: "2023-01-01"
  valid_until: "indefinite"
  status: "active"
  retrieved_at: "2026-09-05"
  confidence: 1.00
```

> [!WARNING]
> هرگز نباید اعدادی چون سقف معافیت مالیات حقوق، نرخ جریمه‌های ثابت ریالی یا مهلت‌های مقطعی را به عنوان گزاره‌های دائمی در پرامپت ثابت نگه داشت؛ سیستم باید با ارجاع به بخشنامه‌های جاری سال مالیاتی مورد سوال پاسخ دهد.

[[framework-authority-scoring-matrix]]
