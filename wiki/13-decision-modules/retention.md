---
id: KB-RETENTION
title: "Decision Module knowledge contract: KB-RETENTION"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-REL-RECURRING`، `MOD-REV-RECURRING` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `revenueModel`، `relationshipModel`.

# Decision Nodes
- `DN-REC-ACTIVATION` — فاز 1: تعریف activation و time-to-value
- `DN-REC-RETENTION` — فاز 2: علت retention/churn و cohort
- `DN-REC-PROMISE` — فاز 3: وعده تکرارشونده قابل اثبات
- `DN-REC-EXPANSION` — فاز 8: renewal، expansion و payback
- `DN-REL-REPEAT` — فاز 2: دلیل بازگشت یا renewal
- `DN-REL-PROMISE` — فاز 3: وعده‌ای که در طول رابطه حفظ می‌شود
- `DN-REL-RETENTION` — فاز 8: retention، expansion و referral

# شواهد لازم
- `ACTIVATION_EVENT`
- `CHURN_REASON`
- `RELATIONSHIP_TOUCHPOINTS`
- `RENEWAL_BEHAVIOR`
- `REPEAT_OR_RENEWAL`
- `RETENTION_COHORT`

# سنجه‌های کاندید
- `activation_rate`
- `cac_payback`
- `logo_churn`
- `mrr`
- `referral_rate`
- `repeat_rate`
- `retention_rate`

# ریسک‌های داخلی مدل
- `early_churn`
- `false_ltv`
- `relationship_decay`
- `retention_blindness`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
