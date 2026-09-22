---
id: KB-MULTI-BRANCH
title: "Decision Module knowledge contract: KB-MULTI-BRANCH"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-BRANCH-MULTI` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `branchStructure`.

# Decision Nodes

- `DN-BRANCH-RIGHTS` — فاز 1: حق تصمیم مرکزی/محلی
- `DN-BRANCH-STANDARDS` — فاز 7: استاندارد هویت و variance مجاز
- `DN-BRANCH-ROLLOUT` — فاز 8: rollout، audit و performance by branch

# شواهد لازم

- `BRANCH_LIST`
- `BRANCH_VARIANCE`
- `CENTRAL_LOCAL_RIGHTS`

# سنجه‌های کاندید

- `branch_variance`
- `rollout_compliance`

# ریسک‌های داخلی مدل

- `franchise_noncompliance`
- `local_drift`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
