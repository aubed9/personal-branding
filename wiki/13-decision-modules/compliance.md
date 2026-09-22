---
id: KB-COMPLIANCE
title: "Decision Module knowledge contract: KB-COMPLIANCE"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 6, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-REG-HIGH` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `regulatoryProfile`.

# Decision Nodes

- `DN-REG-CONSTRAINTS` — فاز 1: مجوز و محدودیت ادعا
- `DN-REG-EVIDENCE` — فاز 2: منبع معتبر و وضعیت freshness
- `DN-REG-POSITIONING` — فاز 3: مرز جایگاه و ادعاهای مجاز
- `DN-REG-MESSAGING` — فاز 5: بازبینی claimهای حساس
- `DN-REG-NAMING` — فاز 6: استعلام و محدودیت حقوقی نام
- `DN-REG-ACTIVATION` — فاز 8: فعال‌سازی منطبق با محدودیت‌ها

# شواهد لازم

- `AUTHORITATIVE_RULE`
- `CLAIM_SUPPORT`
- `LICENSE_STATUS`

# سنجه‌های کاندید

- `claim_review_pass_rate`
- `compliance_incidents`

# ریسک‌های داخلی مدل

- `license_gap`
- `stale_regulation`
- `unsupported_sensitive_claim`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
