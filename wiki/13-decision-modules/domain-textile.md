---
id: KB-DOMAIN-TEXTILE
title: "Textile and apparel production domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-29"
---

# هدف

این Knowledge Node قرارداد داخلی تصمیم‌گیری برای `MOD-DOMAIN-TEXTILE` است. هیچ قانون، عدد بازار یا معیار خارجی را تأیید نمی‌کند.

# فعال‌سازی

هویت کسب‌وکار، صنعت، archetype و محور `offerType` باید با شرط ماژول در `platform/src/reasoning/modules/domainRegistry.js` سازگار باشند. تغییر این ورودی‌ها تصمیم‌های وابسته را دوباره ارزیابی می‌کند.

# Decision Nodes

- `DN-TEXTILE-CAPACITY`
- `DN-TEXTILE-MATERIAL`
- `DN-TEXTILE-PROOF`
- `DN-TEXTILE-MESSAGE`
- `DN-TEXTILE-TOUCHPOINTS`
- `DN-TEXTILE-ORDERS`

# شواهد لازم

- `CUT_SEW_CAPACITY`
- `FABRIC_INVENTORY`
- `SIZE_DEFECT_RATE`
- `MIN_ORDER_QUANTITY`

# سنجه‌های کاندید

- `cut_sew_yield`
- `fabric_inventory_days`
- `size_defect_rate`
- `on_time_delivery`

# ریسک‌های داخلی مدل

- `fabric_shortage`
- `size_variance`
- `seasonal_dead_stock`

# مرز provenance

این node فقط ساختار تصمیم، نیاز به شواهد، سنجه‌های پیشنهادی و دسته‌های ریسک را تعریف می‌کند. هر الزام قانونی، آمار، قیمت، benchmark یا واقعیت بیرونی باید Source Record و Claim جداگانه داشته باشد. در نبود آن، خروجی باید نیاز به راستی‌آزمایی را نشان دهد.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
