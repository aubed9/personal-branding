---
id: KB-OPERATIONS
title: "Decision Module knowledge contract: KB-OPERATIONS"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-OPS-HIGH` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `operationalComplexity`.

# Decision Nodes

- `DN-OPS-BOTTLENECK` — فاز 1: گلوگاه ظرفیت و وابستگی فرایندی
- `DN-OPS-PROOF` — فاز 2: توان تحویل واقعی در مقابل وعده بازار
- `DN-OPS-SCALE` — فاز 8: capacity planning و quality control

# شواهد لازم

- `BOTTLENECK`
- `PROCESS_CAPACITY`
- `QUALITY_VARIANCE`

# سنجه‌های کاندید

- `capacity_utilization`
- `defect_rate`
- `lead_time`

# ریسک‌های داخلی مدل

- `capacity_failure`
- `promise_delivery_gap`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
