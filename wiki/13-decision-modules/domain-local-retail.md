---
id: KB-DOMAIN-LOCAL-RETAIL
title: "Local physical retail domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-23"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول `MOD-DOMAIN-LOCAL-RETAIL` است. این صفحه منبع قانون، آمار بازار، benchmark، قیمت یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از هویت canonical کسب‌وکار (Business Type / Industry / Archetype) همراه با محور `offerType` می‌آید. تغییر هرکدام باید dependentهای graph-reachable این ماژول را دوباره ارزیابی کند.

# Decision Nodes

- `DN-RETAIL-INVENTORY`
- `DN-RETAIL-ASSORTMENT`
- `DN-RETAIL-POSITIONING`
- `DN-RETAIL-TOUCHPOINTS`
- `DN-RETAIL-LOYALTY`

# شواهد لازم

- `INVENTORY_TURN`
- `CATEGORY_MARGIN`
- `AVERAGE_BASKET`
- `STOCKOUT_RATE`
- `FOOT_TRAFFIC_CONVERSION`

# سنجه‌های کاندید

- `inventory_turnover`
- `gross_margin`
- `average_order_value`
- `stockout_rate`
- `foot_traffic_conversion`

# ریسک‌های داخلی مدل

- `dead_stock`
- `stockout_loss`
- `discount_dependency`

# مرز provenance

- این node فقط topology، evidence requirements، KPI candidates و risk categories داخلی را canonical می‌کند.
- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
