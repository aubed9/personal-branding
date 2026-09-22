---
id: KB-MICRO-OPERATIONS
title: "Decision Module knowledge contract: KB-MICRO-OPERATIONS"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-SCALE-MICRO` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `scale`.

# Decision Nodes

- `DN-MICRO-CAPACITY` — فاز 1: ظرفیت فردی، نقدینگی و bottleneck بنیان‌گذار
- `DN-MICRO-PRIORITY` — فاز 8: اولویت محدود و اجرای کم‌هزینه

# شواهد لازم

- `AVAILABLE_BUDGET`
- `FOUNDER_CAPACITY`

# سنجه‌های کاندید

- `capacity_utilization`
- `cash_runway`

# ریسک‌های داخلی مدل

- `founder_bottleneck`
- `overcommitment`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
