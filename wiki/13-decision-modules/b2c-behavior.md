---
id: KB-B2C-BEHAVIOR
title: "Decision Module knowledge contract: KB-B2C-BEHAVIOR"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CUSTOMER-B2C` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `customerModel`.

# Decision Nodes

- `DN-B2C-PURCHASE-TRIGGER` — فاز 2: محرک خرید و اصطکاک فردی
- `DN-B2C-SEGMENT` — فاز 3: سگمنت رفتاری و حساسیت قیمت
- `DN-B2C-CONVERSION` — فاز 8: تبدیل، خرید تکرار و وفاداری

# شواهد لازم

- `PRICE_SENSITIVITY`
- `PURCHASE_TRIGGER`
- `REPEAT_BEHAVIOR`

# سنجه‌های کاندید

- `average_order_value`
- `conversion_rate`
- `repeat_purchase_rate`

# ریسک‌های داخلی مدل

- `discount_dependency`
- `trust_friction`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
