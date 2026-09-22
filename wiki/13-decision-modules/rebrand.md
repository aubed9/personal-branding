---
id: KB-REBRAND
title: "Decision Module knowledge contract: KB-REBRAND"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 6, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-MATURITY-REBRAND` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `maturity`.

# Decision Nodes
- `DN-REB-EQUITY` — فاز 1: دارایی فعلی و چیزهایی که نباید از دست برود
- `DN-REB-PERCEPTION` — فاز 2: ادراک فعلی بازار
- `DN-REB-MIGRATION` — فاز 3: فاصله جایگاه فعلی تا هدف
- `DN-REB-NAMING` — فاز 6: ریسک مهاجرت نام
- `DN-REB-VISUAL` — فاز 7: انتقال equity بصری
- `DN-REB-ROLLOUT` — فاز 8: برنامه migration و communication

# شواهد لازم
- `CURRENT_EQUITY`
- `CUSTOMER_RECOGNITION`
- `LEGACY_ASSETS`

# سنجه‌های کاندید
- `migration_completion`
- `recognition_retention`

# ریسک‌های داخلی مدل
- `customer_confusion`
- `equity_loss`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
