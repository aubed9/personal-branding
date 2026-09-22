---
id: KB-DIGITAL-FUNNEL
title: "Decision Module knowledge contract: KB-DIGITAL-FUNNEL"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CHANNEL-ONLINE` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `channelModel`.

# Decision Nodes

- `DN-ONLINE-ACQUISITION` — فاز 2: منبع ترافیک و هزینه جذب
- `DN-ONLINE-FUNNEL` — فاز 8: فانل، conversion و owned audience

# شواهد لازم

- `CAC`
- `CONVERSION`
- `FUNNEL_STEPS`
- `TRAFFIC_SOURCE`

# سنجه‌های کاندید

- `cac`
- `checkout_conversion`
- `lead_conversion`
- `sessions`

# ریسک‌های داخلی مدل

- `attribution_gap`
- `single_platform_dependency`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
