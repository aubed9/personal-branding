---
id: KB-DOMAIN-RESTAURANT
tags: ['decision_modules', 'domain_restaurant']
title: "Restaurant and dining operations domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-29"
---

# هدف

این Knowledge Node قرارداد داخلی تصمیم‌گیری برای `MOD-DOMAIN-RESTAURANT` است. هیچ قانون، عدد بازار یا معیار خارجی را تأیید نمی‌کند.

# فعال‌سازی

هویت کسب‌وکار، صنعت، archetype و محور `offerType` باید با شرط ماژول در `platform/src/reasoning/modules/domainRegistry.js` سازگار باشند. تغییر این ورودی‌ها تصمیم‌های وابسته را دوباره ارزیابی می‌کند.

# Decision Nodes

- `DN-REST-KITCHEN`
- `DN-REST-DINING`
- `DN-REST-POSITIONING`
- `DN-REST-MESSAGE`
- `DN-REST-TOUCHPOINTS`
- `DN-REST-RETENTION`

# شواهد لازم

- `KITCHEN_CAPACITY`
- `FOOD_COST_PCT`
- `WASTE_RATE`
- `ORDER_WAIT_TIME`

# سنجه‌های کاندید

- `food_cost_pct`
- `waste_rate`
- `order_wait_time`
- `repeat_order_rate`

# ریسک‌های داخلی مدل

- `food_quality_variance`
- `kitchen_bottleneck`
- `food_waste`

# مرز provenance

این node فقط ساختار تصمیم، نیاز به شواهد، سنجه‌های پیشنهادی و دسته‌های ریسک را تعریف می‌کند. هر الزام قانونی، آمار، قیمت، benchmark یا واقعیت بیرونی باید Source Record و Claim جداگانه داشته باشد. در نبود آن، خروجی باید نیاز به راستی‌آزمایی را نشان دهد.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
