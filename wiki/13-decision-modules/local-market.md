---
id: KB-LOCAL-MARKET
title: "Decision Module knowledge contract: KB-LOCAL-MARKET"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [1, 2, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-GEO-LOCAL` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `geography`.

# Decision Nodes

- `DN-LOCAL-CATCHMENT` — فاز 1: شعاع واقعی بازار
- `DN-LOCAL-COMPETITION` — فاز 2: رقابت و رفتار محلی
- `DN-LOCAL-DISCOVERY` — فاز 8: map/referral/local discovery

# شواهد لازم

- `CATCHMENT_RADIUS`
- `LOCAL_COMPETITORS`
- `PRIMARY_LOCATION`

# سنجه‌های کاندید

- `local_leads`
- `local_repeat_rate`
- `maps_rank`

# ریسک‌های داخلی مدل

- `overestimated_catchment`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
