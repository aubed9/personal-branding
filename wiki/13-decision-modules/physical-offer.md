---
id: KB-PHYSICAL-OFFER
title: "Decision Module knowledge contract: KB-PHYSICAL-OFFER"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-OFFER-PHYSICAL` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `offerType`.

# Decision Nodes
- `DN-OFFER-PHYSICAL-UNIT` — فاز 1: واحد فروش، هزینه و محدودیت موجودی/تامین
- `DN-OFFER-PHYSICAL-PROOF` — فاز 2: کیفیت قابل مشاهده، اصالت و مقایسه محصول
- `DN-OFFER-PHYSICAL-PROMISE` — فاز 3: وعده محصول و شرایط تحویل واقعی
- `DN-OFFER-PHYSICAL-PACKAGING` — فاز 7: کاربرد هویت روی بسته‌بندی و نقطه تماس محصول
- `DN-OFFER-PHYSICAL-DELIVERY` — فاز 8: تامین، تحویل، مرجوعی و خرید تکرار

# شواهد لازم
- `DELIVERY_CONDITION`
- `PRODUCT_PROOF`
- `SUPPLY_CONSTRAINT`
- `UNIT_OF_SALE`

# سنجه‌های کاندید
- `gross_margin`
- `return_rate`
- `stockout_rate`

# ریسک‌های داخلی مدل
- `inventory_or_supply_failure`
- `quality_variance`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
