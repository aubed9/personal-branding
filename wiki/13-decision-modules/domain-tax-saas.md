---
id: KB-DOMAIN-TAX-SAAS
title: "Iran tax/accounting SaaS domain decision contract"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 5, 8]
related_business_types: ['DOMAIN_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3', 'SRC-IR-TAX-TERMINALS-CURRENT-ARTICLES-QAVANIN']
last_updated: "2026-09-25"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول `MOD-DOMAIN-TAX-SAAS` است. این صفحه منبع قانون، آمار بازار، benchmark، قیمت یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از هویت canonical کسب‌وکار (Business Type / Industry / Archetype) همراه با محور `offerType` می‌آید. تغییر هرکدام باید dependentهای graph-reachable این ماژول را دوباره ارزیابی کند.

# Decision Nodes

- `DN-TAX-SAAS-COMPLIANCE-SCOPE`
- `DN-TAX-SAAS-FAILURE-MODES`
- `DN-TAX-SAAS-PROOF`
- `DN-TAX-SAAS-MESSAGING`
- `DN-TAX-SAAS-UPDATES`

# شواهد لازم

- `TAX_INTEGRATION_COVERAGE`
- `SUBMISSION_SUCCESS_RATE`
- `REGULATION_UPDATE_PROCESS`
- `ERROR_RECOVERY_TIME`

# سنجه‌های کاندید

- `submission_success_rate`
- `compliance_update_latency`
- `mrr`
- `logo_churn`

# ریسک‌های داخلی مدل

- `stale_tax_rule`
- `submission_failure`
- `regulatory_dependency`

# مرز provenance

- این node فقط topology، evidence requirements، KPI candidates و risk categories داخلی را canonical می‌کند.
- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`


# External Knowledge Claims قابل استفاده

این node می‌تواند claimهای خارجی زیر را فقط از مسیر canonical retrieval مصرف کند:

- `KCL-IR-TAX-ARTICLE2-CURRENT-POS-INVOICING` — تکلیف جاری ماده ۲ درباره پایانه فروشگاهی برای خرده‌فروشی/واحد صنفیِ مستقیم با مصرف‌کننده نهایی و صدور صورتحساب از سامانه مؤدیان برای سایر مؤدیان.
- `KCL-IR-TAX-ARTICLE10-CURRENT-COMMERCIAL-ACCOUNTS` — تکلیف جاری ماده ۱۰ درباره اعلام حساب تجاری و شناسه یکتای کارتخوان/درگاه پرداخت مورد استفاده فعالیت شغلی.

claim چتری `KCL-IR-TAX-TERMINALS-1398-UNVERIFIED` همچنان `NEEDS_RESEARCH` است و تا تکمیل `LEGAL_AMENDMENT_COVERAGE` نباید به‌عنوان الزام جاریِ کلی استفاده شود.
