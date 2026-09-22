---
id: KB-PROJECT-ECONOMICS
title: "Decision Module knowledge contract: KB-PROJECT-ECONOMICS"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-REV-PROJECT` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `revenueModel`.

# Decision Nodes
- `DN-PRJ-MARGIN` — فاز 1: حاشیه پروژه و ظرفیت
- `DN-PRJ-SCOPE` — فاز 2: scope و ریسک تغییر دامنه
- `DN-PRJ-PROOF` — فاز 3: اثبات تحویل پروژه
- `DN-PRJ-PIPELINE` — فاز 8: پایپ‌لاین، milestone و وصول

# شواهد لازم
- `MILESTONE_PAYMENT`
- `PROJECT_COST`
- `SCOPE_CHANGE`
- `UTILIZATION`

# سنجه‌های کاندید
- `days_sales_outstanding`
- `delivery_variance`
- `project_margin`
- `utilization_rate`

# ریسک‌های داخلی مدل
- `capacity_overcommitment`
- `collection_delay`
- `scope_creep`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
