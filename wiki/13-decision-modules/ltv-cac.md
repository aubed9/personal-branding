---
id: KB-LTV-CAC
title: "Decision Module knowledge contract: KB-LTV-CAC"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-REV-RECURRING` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `revenueModel`.

# Decision Nodes

- `DN-REC-ACTIVATION` — فاز 1: تعریف activation و time-to-value
- `DN-REC-RETENTION` — فاز 2: علت retention/churn و cohort
- `DN-REC-PROMISE` — فاز 3: وعده تکرارشونده قابل اثبات
- `DN-REC-EXPANSION` — فاز 8: renewal، expansion و payback

# شواهد لازم

- `ACTIVATION_EVENT`
- `CHURN_REASON`
- `RENEWAL_BEHAVIOR`
- `RETENTION_COHORT`

# سنجه‌های کاندید

- `activation_rate`
- `cac_payback`
- `logo_churn`
- `mrr`
- `retention_rate`

# ریسک‌های داخلی مدل

- `early_churn`
- `false_ltv`
- `retention_blindness`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
