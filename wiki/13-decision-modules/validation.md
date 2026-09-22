---
id: KB-VALIDATION
title: "Decision Module knowledge contract: KB-VALIDATION"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-MATURITY-VALIDATION` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `maturity`.

# Decision Nodes
- `DN-VAL-HYPOTHESIS` — فاز 1: فرضیه و شرط ابطال
- `DN-VAL-EVIDENCE` — فاز 2: آزمون بازار و شواهد رفتاری
- `DN-VAL-POSITIONING` — فاز 3: جایگاه موقت تا اثبات
- `DN-VAL-LAUNCH` — فاز 8: launch experiment و stop condition

# شواهد لازم
- `BEHAVIORAL_SIGNAL`
- `HYPOTHESIS`
- `VALIDATION_SAMPLE`

# سنجه‌های کاندید
- `validation_conversion`
- `willingness_to_pay`

# ریسک‌های داخلی مدل
- `premature_brand_lock_in`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
