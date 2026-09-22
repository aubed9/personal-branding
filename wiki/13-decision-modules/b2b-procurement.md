---
id: KB-B2B-PROCUREMENT
title: "Decision Module knowledge contract: KB-B2B-PROCUREMENT"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CUSTOMER-B2B` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `customerModel`.

# Decision Nodes

- `DN-B2B-DMU` — فاز 2: کمیته تصمیم‌گیری و نقش‌های خرید
- `DN-B2B-BUSINESS-CASE` — فاز 3: منطق ROI و اثبات ارزش سازمانی
- `DN-B2B-PIPELINE` — فاز 8: پایپ‌لاین، مرحله فروش و procurement

# شواهد لازم

- `BUSINESS_CASE_PROOF`
- `DMU_ROLES`
- `PROCUREMENT_PROCESS`

# سنجه‌های کاندید

- `qualified_pipeline`
- `sales_cycle_days`
- `win_rate`

# ریسک‌های داخلی مدل

- `procurement_delay`
- `single_champion_dependency`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
