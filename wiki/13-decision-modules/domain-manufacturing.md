---
id: KB-DOMAIN-MANUFACTURING
title: "General manufacturing domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-23"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول `MOD-DOMAIN-MANUFACTURING` است. این صفحه منبع قانون، آمار بازار، benchmark، قیمت یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از هویت canonical کسب‌وکار (Business Type / Industry / Archetype) همراه با محور `offerType` می‌آید. تغییر هرکدام باید dependentهای graph-reachable این ماژول را دوباره ارزیابی کند.

# Decision Nodes

- `DN-MFG-CAPACITY`
- `DN-MFG-QUALITY`
- `DN-MFG-PROOF`
- `DN-MFG-MESSAGE`
- `DN-MFG-VISUAL`
- `DN-MFG-GROWTH`

# شواهد لازم

- `LINE_CAPACITY`
- `YIELD_RATE`
- `LEAD_TIME`
- `QUALITY_RECORD`
- `SUPPLY_RELIABILITY`

# سنجه‌های کاندید

- `yield_rate`
- `on_time_delivery`
- `lead_time`
- `defect_rate`

# ریسک‌های داخلی مدل

- `capacity_shortfall`
- `quality_variance`
- `supplier_dependency`

# مرز provenance

- این node فقط topology، evidence requirements، KPI candidates و risk categories داخلی را canonical می‌کند.
- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
