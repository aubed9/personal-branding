---
id: KB-ENTERPRISE-GOVERNANCE
title: "Decision Module knowledge contract: KB-ENTERPRISE-GOVERNANCE"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 3, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-SCALE-ENTERPRISE` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `scale`.

# Decision Nodes

- `DN-ENT-GOVERNANCE` — فاز 1: مالکیت تصمیم و governance
- `DN-ENT-PORTFOLIO` — فاز 3: سازگاری استراتژی در واحدها/برندها
- `DN-ENT-ROLLOUT` — فاز 7: rollout و کنترل استاندارد
- `DN-ENT-REPORTING` — فاز 8: گزارش‌گیری، handoff و change management

# شواهد لازم

- `BUSINESS_UNITS`
- `DECISION_RIGHTS`
- `ROLLOUT_OWNERS`

# سنجه‌های کاندید

- `approval_cycle_time`
- `rollout_compliance`

# ریسک‌های داخلی مدل

- `brand_variance`
- `governance_delay`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
