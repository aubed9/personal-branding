---
id: KB-TENDER
title: "Decision Module knowledge contract: KB-TENDER"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-SALES-TENDER` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `salesMotion`.

# Decision Nodes
- `DN-TENDER-ELIGIBILITY` — فاز 2: اهلیت، اسناد و procurement
- `DN-TENDER-PROOF` — فاز 3: مدرک فنی و business case
- `DN-TENDER-PIPELINE` — فاز 8: زمان‌بندی مناقصه و follow-up

# شواهد لازم
- `ELIGIBILITY`
- `PROCUREMENT_DOCUMENTS`
- `REFERENCE_PROJECTS`

# سنجه‌های کاندید
- `procurement_cycle`
- `qualified_tenders`
- `tender_win_rate`

# ریسک‌های داخلی مدل
- `eligibility_gap`
- `long_procurement_cycle`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
