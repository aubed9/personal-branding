---
id: KB-DIGITAL-PRODUCT
title: "Decision Module knowledge contract: KB-DIGITAL-PRODUCT"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-OFFER-DIGITAL` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `offerType`.

# Decision Nodes

- `DN-OFFER-DIGITAL-VALUE` — فاز 1: واحد ارزش دیجیتال و time-to-value
- `DN-OFFER-DIGITAL-FRICTION` — فاز 2: اصطکاک onboarding و adoption
- `DN-OFFER-DIGITAL-PROMISE` — فاز 3: دستاورد قابل اثبات در محصول دیجیتال
- `DN-OFFER-DIGITAL-EXPLAIN` — فاز 5: توضیح ساده قابلیت بدون jargon فنی
- `DN-OFFER-DIGITAL-ADOPTION` — فاز 8: activation، adoption و support loop

# شواهد لازم

- `ONBOARDING_FRICTION`
- `SUPPORT_PATTERN`
- `USAGE_SIGNAL`
- `VALUE_EVENT`

# سنجه‌های کاندید

- `activation_rate`
- `feature_adoption`
- `time_to_value`

# ریسک‌های داخلی مدل

- `activation_failure`
- `feature_value_gap`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
