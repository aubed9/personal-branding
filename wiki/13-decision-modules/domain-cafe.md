---
id: KB-DOMAIN-CAFE
title: "Cafe / specialty coffee domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-23"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول `MOD-DOMAIN-CAFE` است. این صفحه منبع قانون، آمار بازار، benchmark، قیمت یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از هویت canonical کسب‌وکار (Business Type / Industry / Archetype) همراه با محور `offerType` می‌آید. تغییر هرکدام باید dependentهای graph-reachable این ماژول را دوباره ارزیابی کند.

# Decision Nodes

- `DN-CAFE-ECONOMICS`
- `DN-CAFE-TASTE-PROOF`
- `DN-CAFE-POSITIONING`
- `DN-CAFE-STORY`
- `DN-CAFE-TOUCHPOINTS`
- `DN-CAFE-RETENTION`

# شواهد لازم

- `FOOD_COST_PCT`
- `TABLE_TURNOVER`
- `PEAK_HOUR_CAPACITY`
- `ROAST_FRESHNESS`
- `ORIGIN_PROOF`
- `LOCAL_REVIEW_THEMES`

# سنجه‌های کاندید

- `food_cost_pct`
- `table_turnover`
- `average_ticket`
- `repeat_visit_rate`
- `bean_subscription_retention`

# ریسک‌های داخلی مدل

- `taste_inconsistency`
- `stale_inventory`
- `peak_hour_service_failure`

# مرز provenance

- این node فقط topology، evidence requirements، KPI candidates و risk categories داخلی را canonical می‌کند.
- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
