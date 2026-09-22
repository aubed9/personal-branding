---
id: KB-LOCAL-CHANNEL
title: "Decision Module knowledge contract: KB-LOCAL-CHANNEL"
category: "13-decision-modules"
version: "1.0.0"
status: "CANONICAL"
related_phases: [2, 7, 8]
related_business_types: ['CONTEXT_DRIVEN']
source_ids: ['SRC-INT-CONTEXT-CONTRACT', 'SRC-INT-ARCH-V3']
last_updated: "2026-09-22"
---

# هدف

این Knowledge Node یک **قرارداد داخلی تصمیم‌گیری** برای ماژول‌های `MOD-CHANNEL-PHYSICAL` است. این صفحه منبع قانون، آمار بازار، قیمت، benchmark یا واقعیت خارجی نیست.

# شرط فعال‌سازی

فعال‌سازی دقیق از Business Context و Decision Module Registry می‌آید. محورهای مرتبط: `channelModel`.

# Decision Nodes

- `DN-PHYS-CATCHMENT` — فاز 2: catchment، پاخور یا booking
- `DN-PHYS-TOUCHPOINT` — فاز 7: کاربرد هویت در محیط فیزیکی
- `DN-PHYS-LOCAL-GROWTH` — فاز 8: جست‌وجوی محلی، referral و ظرفیت

# شواهد لازم

- `CATCHMENT`
- `FOOT_TRAFFIC_OR_BOOKINGS`
- `LOCAL_REVIEWS`

# سنجه‌های کاندید

- `booking_rate`
- `foot_traffic`
- `local_review_score`
- `store_conversion`

# ریسک‌های داخلی مدل

- `capacity_queue`
- `location_dependency`

# مرز provenance

- هر عدد، benchmark، قانون، الزام مجوز، claim پزشکی/مالی/حقوقی یا واقعیت بازار باید از External Knowledge Claim دارای Source Record معتبر بیاید.
- این node فقط topology و نیاز اطلاعاتی داخلی را canonical می‌کند.
- نبود منبع خارجی معتبر باید به `REQUIRES_VERIFICATION` یا `NEEDS_RESEARCH` منجر شود، نه حدس.

# منابع داخلی

- `SRC-INT-CONTEXT-CONTRACT`
- `SRC-INT-ARCH-V3`
