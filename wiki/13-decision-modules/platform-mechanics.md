---
id: KB-PLATFORM-MECHANICS
title: "Decision Module knowledge contract: KB-PLATFORM-MECHANICS"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 3, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک قرارداد داخلی تصمیم‌گیری برای `MOD-OFFER-PLATFORM` است و به‌تنهایی منبع واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `offerType`.

# Decision Nodes
- `DN-OFFER-PLATFORM-JOB` — فاز 1: job اصلی و نقش پلتفرم در خلق ارزش
- `DN-OFFER-PLATFORM-FRICTION` — فاز 2: اصطکاک interaction و اعتماد
- `DN-OFFER-PLATFORM-PROMISE` — فاز 3: وعده پلتفرم و مرز مسئولیت
- `DN-OFFER-PLATFORM-LOOP` — فاز 8: interaction loop، trust و growth mechanic

# شواهد لازم
- `INTERACTION_FRICTION`
- `PLATFORM_JOB`
- `TRUST_MECHANISM`

# سنجه‌های کاندید
- `activation_rate`
- `successful_interactions`

# ریسک‌های داخلی مدل
- `platform_trust_gap`
- `unclear_responsibility`

# مرز provenance

هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید External Knowledge Claim دارای Source Record معتبر داشته باشد. این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.

# منابع داخلی
- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
