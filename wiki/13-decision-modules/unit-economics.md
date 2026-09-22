---
id: KB-UNIT-ECONOMICS
title: "Decision Module knowledge contract: KB-UNIT-ECONOMICS"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-REV-TRANSACTION` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `revenueModel`.

# Decision Nodes
- `DN-TXN-UNIT-ECONOMICS` — فاز 1: حاشیه مشارکت هر تراکنش
- `DN-TXN-REPURCHASE` — فاز 2: تکرار خرید و فرکانس
- `DN-TXN-GROWTH` — فاز 8: رشد تراکنش سودآور

# شواهد لازم
- `REPURCHASE_FREQUENCY`
- `UNIT_PRICE`
- `VARIABLE_COST`

# سنجه‌های کاندید
- `average_order_value`
- `contribution_margin`
- `repeat_purchase_rate`

# ریسک‌های داخلی مدل
- `negative_unit_margin`
- `promo_margin_erosion`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
