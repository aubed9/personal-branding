---
id: KB-SERVICE-DELIVERY
title: "Decision Module knowledge contract: KB-SERVICE-DELIVERY"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-OFFER-SERVICE` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `offerType`.

# Decision Nodes
- `DN-OFFER-SERVICE-CAPACITY` — فاز 1: ظرفیت خدمت، زمان و هزینه تحویل
- `DN-OFFER-SERVICE-QUALITY` — فاز 2: شاهد کیفیت و تجربه واقعی مشتری
- `DN-OFFER-SERVICE-PROMISE` — فاز 3: مرز وعده خدمت و سطح قابل تحویل
- `DN-OFFER-SERVICE-EXPECTATION` — فاز 5: تنظیم انتظار قبل از خرید
- `DN-OFFER-SERVICE-DELIVERY` — فاز 8: booking/تحویل/feedback و کنترل ظرفیت

# شواهد لازم
- `CUSTOMER_EXPECTATION`
- `DELIVERY_TIME`
- `QUALITY_PROOF`
- `SERVICE_CAPACITY`

# سنجه‌های کاندید
- `capacity_utilization`
- `delivery_on_time`
- `repeat_rate`

# ریسک‌های داخلی مدل
- `quality_variance`
- `service_overpromise`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
