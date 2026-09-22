---
id: KB-LONG-SALES-CYCLE
title: "Decision Module knowledge contract: KB-LONG-SALES-CYCLE"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CYCLE-LONG` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `purchaseCycle`.

# Decision Nodes

- `DN-LONG-PROOF` — فاز 2: proof و stakeholder evidence
- `DN-LONG-NURTURE` — فاز 3: پیام و proof برای مراحل تصمیم
- `DN-LONG-PIPELINE` — فاز 8: nurture، stage و next step

# شواهد لازم

- `OBJECTIONS`
- `PROOF_ASSETS`
- `STAKEHOLDER_MAP`

# سنجه‌های کاندید

- `sales_cycle_days`
- `stage_conversion`

# ریسک‌های داخلی مدل

- `pipeline_stall`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
