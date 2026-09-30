---
id: KB-DOMAIN-AUTOMOTIVE
tags: ['decision_modules', 'domain_automotive']
title: "Automotive local service operations domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 7, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-29"
---

# هدف

این Knowledge Node قرارداد داخلی تصمیم‌گیری برای `MOD-DOMAIN-AUTOMOTIVE` است. هیچ قانون، عدد بازار یا معیار خارجی را تأیید نمی‌کند.

# فعال‌سازی

هویت کسب‌وکار، صنعت، archetype و محور `offerType` باید با شرط ماژول در `platform/src/reasoning/modules/domainRegistry.js` سازگار باشند. تغییر این ورودی‌ها تصمیم‌های وابسته را دوباره ارزیابی می‌کند.

# Decision Nodes

- `DN-AUTO-BAY-CAPACITY`
- `DN-AUTO-DIAGNOSIS`
- `DN-AUTO-PROOF`
- `DN-AUTO-MESSAGE`
- `DN-AUTO-TOUCHPOINTS`
- `DN-AUTO-RETURN`

# شواهد لازم

- `SERVICE_BAY_CAPACITY`
- `DIAGNOSIS_RECORD`
- `PARTS_TRACEABILITY`
- `REWORK_RATE`

# سنجه‌های کاندید

- `bay_utilization`
- `turnaround_time`
- `rework_rate`
- `repeat_service_rate`

# ریسک‌های داخلی مدل

- `misdiagnosis`
- `parts_mismatch`
- `delayed_vehicle_delivery`

# مرز provenance

این node فقط ساختار تصمیم، نیاز به شواهد، سنجه‌های پیشنهادی و دسته‌های ریسک را تعریف می‌کند. هر الزام قانونی، آمار، قیمت، benchmark یا واقعیت بیرونی باید Source Record و Claim جداگانه داشته باشد. در نبود آن، خروجی باید نیاز به راستی‌آزمایی را نشان دهد.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
