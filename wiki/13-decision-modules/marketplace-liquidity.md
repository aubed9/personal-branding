---
id: KB-MARKETPLACE-LIQUIDITY
title: "Decision Module knowledge contract: KB-MARKETPLACE-LIQUIDITY"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CUSTOMER-TWO-SIDED` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `customerModel`.

# Decision Nodes

- `DN-MKT-SIDES` — فاز 1: تعریف دو سمت بازار
- `DN-MKT-LIQUIDITY` — فاز 2: نقدشوندگی و تعادل عرضه/تقاضا
- `DN-MKT-VALUE-EACH-SIDE` — فاز 3: ارزش پیشنهادی مستقل برای هر سمت
- `DN-MKT-LEAKAGE` — فاز 8: جلوگیری از خروج معامله از پلتفرم

# شواهد لازم

- `DEMAND_SIDE`
- `LEAKAGE_RATE`
- `MATCH_RATE`
- `SUPPLY_SIDE`

# سنجه‌های کاندید

- `active_buyers`
- `active_sellers`
- `leakage_rate`
- `match_rate`
- `take_rate`

# ریسک‌های داخلی مدل

- `cold_start`
- `platform_leakage`
- `side_imbalance`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
