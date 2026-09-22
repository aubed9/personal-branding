---
id: KB-FOUNDER-BRAND
title: "Decision Module knowledge contract: KB-FOUNDER-BRAND"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [4, 5, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-FOUNDER-PUBLIC` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `founderRole`.

# Decision Nodes

- `DN-FOUNDER-PERSONA` — فاز 4: مرز شخصیت فرد و برند
- `DN-FOUNDER-VOICE` — فاز 5: صدای بنیان‌گذار و صدای سازمان
- `DN-FOUNDER-THOUGHT-LEADERSHIP` — فاز 8: thought leadership و ریسک وابستگی

# شواهد لازم

- `FOUNDER_CREDIBILITY`
- `FOUNDER_VISIBILITY`
- `TRANSFERABILITY_RISK`

# سنجه‌های کاندید

- `founder_attributed_leads`
- `owned_audience`

# ریسک‌های داخلی مدل

- `founder_dependency`
- `succession_risk`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
