---
id: KB-BRAND-ARCHITECTURE
title: "Decision Module knowledge contract: KB-BRAND-ARCHITECTURE"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [3, 6, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-BRAND-PORTFOLIO` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `brandArchitecture`.

# Decision Nodes

- `DN-BA-ROLE` — فاز 3: نقش هر برند در پرتفوی
- `DN-BA-NAMING` — فاز 6: قواعد نام‌گذاری بین برندها
- `DN-BA-VISUAL` — فاز 7: سیستم بصری و endorsement
- `DN-BA-ROLLOUT` — فاز 8: migration و governance پرتفوی

# شواهد لازم

- `BRAND_PORTFOLIO`
- `ENDORSEMENT_RULES`

# سنجه‌های کاندید

- `portfolio_consistency`

# ریسک‌های داخلی مدل

- `brand_cannibalization`
- `portfolio_confusion`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
