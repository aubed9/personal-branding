---
id: KB-VIS-COLOR-001
tags: ['color_system', 'color_psychology', 'palette_tokens', 'wcag_contrast', 'monochrome_hierarchy', 'color_palette', 'sensory_branding', 'barden']
title: "معماری پالت و توکن‌های رنگ"
category: "15-visual-identity"
version: "1.0.0"
status: "CANONICAL"
related_phases: [7]
related_nodes: ['KB-VIS-DSYS-001', 'KB-IDN-CHAR-001']
related_business_types: ['ALL']
related_metrics: ['palette_consistency', 'contrast_verification_status']
related_concepts: ['COLOR_SYSTEM', 'DESIGN_TOKENS', 'VISUAL_HIERARCHY']
source: "SRC-INT-PHASE7-VISUAL-CONTRACT"
last_updated: "2026-09-27"
sources: ['SRC-INT-PHASE7-VISUAL-CONTRACT', 'SRC-FOUNDATION-20', 'SRC-FOUNDATION-17']
---

# هدف

تعریف نقش‌های رنگی سیستم به‌صورت قابل اجرا و قابل بازبینی؛ نه انتخاب رنگ صرفاً بر اساس سلیقه یا ادعاهای اثبات‌نشده.

# سؤال‌های تصمیم‌ساز

- کدام تصمیم هویتی باید در پالت منعکس شود؟
- کدام نقاط تماس به رنگ‌های عملکردی، accent و neutral نیاز دارند؟
- چه محدودیت‌هایی از چاپ، رابط دیجیتال، محیط فیزیکی یا دسترس‌پذیری وجود دارد؟
- چه بخشی از انتخاب رنگ تصمیم داخلی است و چه بخشی به شواهد خارجی نیاز دارد؟

# خروجی داخلی

- نقش‌های `primary`، `secondary`، `accent`، `neutral` و رنگ‌های عملکردی.
- tokenهای نام‌دار و موارد استفادهٔ هر token.
- حالت‌های پس‌زمینه، متن، CTA، وضعیت‌ها و کاربردهای فیزیکی در صورت مرتبط بودن.
- ثبت موارد نیازمند آزمون یا منبع بیرونی به‌عنوان unknown/verification item.

# مرز provenance

این node هیچ اثر روان‌شناختی مشخصی را برای یک رنگ تضمین نمی‌کند و هیچ نسبت کنتراست یا threshold فنی را بدون Source/Claim معتبر canonical نمی‌کند.

# وابستگی‌ها

- `KB-VIS-DSYS-001`
- `KB-IDN-CHAR-001`
- `KB-IDN-GUARD-001`

---

## پایه‌های علمی و مراجع دانشی (Scientific Foundations & Sourced Evidence)
### پایه‌های علمی و مراجع دانشی (Scientific Foundations)
- **قرارداد فاز ۷ هویت بصری (SRC-INT-PHASE7-VISUAL-CONTRACT):** الزام به انطباق رنگ با شخصیت، کهن‌الگو و استانداردهای کنتراست.
- **فیل باردن (SRC-FOUNDATION-20):** رنگ‌ها میانبرهای غیرکلامی هستند که مستقیماً مغز ناخودآگاه را تحریک می‌کنند (قرمز: انرژی/فوریت، آبی: امنیت/اعتماد).

---

## شواهد و بستر تجاری ایران (Iranian Market Context & Evidence)
### شواهد و بستر تجاری ایران (Iranian Market Realities)
- **تمایز از رقبای مسلط بازار:** در صنوف مختلف نباید رنگ کلیشه‌ای بازار را کورکورانه تکرار کرد (مثلاً آبی در بانک‌ها و صرافی‌ها).
- **کیفیت در چاپخانه‌های محلی:** کدهای رنگی پالت باید دارای معادل‌های استاندارد CMYK، RGB و Pantone باشند تا در چاپ به هم نریزند.

---

## قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
### قواعد تصمیم‌گیری و گاردریل‌های اجرایی (Actionable Decision Rules)
1. **قاعده ۶۰-۳۰-۱۰ پالت:** ۶۰٪ رنگ پایه، ۳۰٪ رنگ ثانویه، و ۱۰٪ رنگ آکسان برای دکمه‌های اقدام (CTA).
2. **قاعده کنتراست WCAG:** متن روی پس‌زمینه رنگی باید کنتراست حداقل ۴.۵:۱ داشته باشد.
