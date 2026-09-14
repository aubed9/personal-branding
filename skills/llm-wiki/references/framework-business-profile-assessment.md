---
title: "Business Profile Assessment Schema"
type: framework
tags: ["business-profile", "profiling-schema", "compliance-intake", "yaml-schema"]
sources: ["source-src004-mojavez-ir", "source-src007-business-licensing-facilitation-act", "source-src010-trade-union-law"]
updated: 2026-09-05
status: expanded
---

# Business Profile Assessment Schema
## مدل اعتبارسنجی و تشکیل پروفایل کسب‌وکار

مدل هوش مصنوعی هرگز نباید پیش از تشکیل ساختار «پروفایل کسب‌وکار»، به کاربر بگوید «شما به فلان مجوز نیاز دارید». سیستم باید در ابتدا ورودی‌ها را در قالب این ساختار YAML استخراج کند:

```yaml
business:
  activity: string # شرح دقیق فعالیت تخصصی
  product_or_service: string # کالا یا خدمت عرضه شونده
  business_model:
    - retail # خرده‌فروشی
    - ecommerce # فروشگاه آنلاین اختصاصی
    - marketplace # بازارگاه و پلتفرم واسط
    - saas # نرم‌افزار به عنوان خدمت
    - subscription # مدل اشتراکی
    - service # خدمات تخصصی/مشاوره‌ای
    - agency # آژانس دیجیتال یا تبلیغاتی
    - manufacturing # تولیدی
    - import_export # واردات و صادرات
    - distribution # پخش و توزیع
    - franchise # فرانچایز و شعب
    - fintech # فین‌تک و پرداخت
    - restaurant # رستوران و کافه
    - healthcare # سلامت، دارو، مکمل
    - education # آموزشگاه و ادتک
    - tourism # گردشگری و خدمات سفر
    - real_estate # املاک و ساخت‌وساز
    - logistics # حمل‌ونقل و پیک
    - home_business # مشاغل خانگی
  legal_form:
    - individual # شخص حقیقی / آزادکار
    - sole_trader # شخص صنفی دارای جواز کسب
    - LLC # شرکت با مسئولیت محدود
    - private_joint_stock # شرکت سهامی خاص
    - public_joint_stock # شرکت سهامی عام
    - cooperative # تعاونی
  channel:
    - physical # فروشگاه یا دفتر فیزیکی
    - website # وب‌سایت مستقل
    - social_media # شبکه‌های اجتماعی (اینستاگرام، تلگرام)
    - app # اپلیکیشن موبایل
    - marketplace # غرفه در دیجی‌کالا/باسلام
  location:
    province: string # استان
    city: string # شهر
  customer_type:
    - B2C # مصرف‌کننده نهایی
    - B2B # شرکت‌ها و موسسات
    - B2G # نهادهای دولتی
  has_employees: boolean # آیا کارمند یا کارگر بیمه‌ای دارد؟
  imports: boolean # آیا کالای وارداتی دارد؟
  exports: boolean # آیا صادرات دارد؟
  handles_payments: boolean # آیا وجوه مالی کاربران را تسویه یا امانت‌داری می‌کند؟
  stores_customer_data: boolean # آیا اطلاعات هویتی، مالی یا مکانی کاربران ذخیره می‌شود؟
  regulated_product:
    - food # خوراکی و آشامیدنی
    - cosmetics # آرایشی و بهداشتی
    - medicine # دارویی
    - medical # تجهیزات پزشکی
    - financial # خدمات مالی و صرافی
    - insurance # خدمات بیمه‌ای
    - education # مدارک و گواهینامه‌های آموزشی
    - tourism # بلیت و خدمات اقامتی
    - telecom # تجهیزات رادیویی و مخابراتی
    - none # کالای عمومی فاقد رگولاتور ویژه
```

[[framework-national-licensing-portal-flow]]
[[framework-compliance-checklist-generator]]
