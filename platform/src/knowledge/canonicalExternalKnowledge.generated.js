// GENERATED FILE — DO NOT EDIT BY HAND.
// Run: python scripts/build_platform_external_knowledge_bundle.py
export const CANONICAL_EXTERNAL_KNOWLEDGE_META = Object.freeze({
  "version": "1.0.0",
  "generatedFrom": [
    "wiki/generated/retrieval-index.json",
    "wiki/claims.json",
    "wiki/source-registry.json"
  ],
  "policy": "decision_driving=true and claim_kind!=INTERNAL_NORMATIVE; runtime admissibility is re-evaluated for freshness/authority/scope"
});
export const CANONICAL_EXTERNAL_RETRIEVAL_ENTRIES = Object.freeze([
  {
    "retrieval_id": "RET-KCL-IR-DIGIKALA-1404-DIGITAL-GOLD",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "claim_id": "KCL-IR-DIGIKALA-1404-DIGITAL-GOLD",
    "content": "دیجی‌کالا در اعلام رسمی گزارش سال ۱۴۰۴ گفته است خرید طلای دیجیتال روی پلتفرم آن در سال ۱۴۰۴، ۱۲ برابر شده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-OFFER-DIGITAL-ADOPTION",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-DIGITAL",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "رشد اعلام‌شده مربوط به خرید طلای دیجیتال داخل اکوسیستم دیجی‌کالا است و نباید به کل بازار طلا، سرمایه‌گذاری یا تجارت الکترونیکی ایران تعمیم داده شود."
  },
  {
    "retrieval_id": "RET-KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "claim_id": "KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH",
    "content": "در پلتفرم دیجی‌کالا، جست‌وجوی عبارت «دست دوم» در سال ۱۴۰۴ نسبت به سال قبل ۵۱٪ افزایش یافته است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "این شاخص فقط رفتار جست‌وجوی کاربران دیجی‌کالا را نشان می‌دهد؛ سهم بازار، تقاضای کل ایران، فروش کالای دست‌دوم در کل کشور یا رشد یک کسب‌وکار خاص نیست."
  },
  {
    "retrieval_id": "RET-KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "claim_id": "KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE",
    "content": "دیجی‌کالا در گزارش سال ۱۴۰۴ اعلام کرده است میانگین ارزش دلاری هر سفارش روی پلتفرم از سال ۱۳۹۷ تاکنون به سطح پیش از آن سال بازنگشته است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-TXN-UNIT-ECONOMICS",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "این یک روند ارزش سفارش در پلتفرم دیجی‌کالا است، بدون رقم مطلق در پست رسمی؛ شاخص درآمد واقعی، قدرت خرید کل کشور یا اندازه بازار ایران محسوب نمی‌شود."
  },
  {
    "retrieval_id": "RET-KCL-IR-ECOM-1403",
    "knowledge_node_id": "KB-IR-ECOM-REPORT-001",
    "claim_id": "KCL-IR-ECOM-1403",
    "content": "گزارش تجارت الکترونیکی ایران در سال ۱۴۰۳ ارزش معاملات تجارت الکترونیکی را بیش از 5,500 همت و رشد ارزش معاملات نسبت به سال قبل را حدود 73٪ گزارش می‌کند و بیش از 306 هزار کسب‌وکار دارای اینماد را نشان می‌دهد.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-ECOM-REPORT-1403"
    ],
    "source_authority_floor": "A",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-DIGITAL-ADOPTION",
      "DN-OFFER-PLATFORM-LOOP",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-DIGITAL",
      "MOD-OFFER-PLATFORM",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "گزارش سالانه و کلان است؛ برای CAC/CPC روز، قیمت‌گذاری یک صنعت یا اندازه بازار یک زیرگروه باید منبع تخصصی‌تر استفاده شود."
  },
  {
    "retrieval_id": "RET-KCL-IR-LAW-ECOM-1382-UNVERIFIED",
    "knowledge_node_id": "KB-COMPLIANCE",
    "claim_id": "KCL-IR-LAW-ECOM-1382-UNVERIFIED",
    "content": "در متن تنقیح‌شده جاری قانون تجارت الکترونیکی، برای معاملات از راه دور با مصرف‌کننده، مواد ۳۳ تا ۳۵ بر ارائه و تأیید اطلاعات مؤثر پیش از خرید، مواد ۳۷ تا ۳۹ بر چارچوب حق انصراف/استرداد و عدم امکان تأمین، و مواد ۵۰ تا ۵۵ بر شفافیت و عدم فریب در تبلیغات و هویت عرضه‌کننده تأکید دارند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR"
    ],
    "source_authority_floor": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      5,
      8
    ],
    "decision_node_ids": [
      "DN-REG-CONSTRAINTS",
      "DN-REG-EVIDENCE",
      "DN-REG-MESSAGING",
      "DN-REG-ACTIVATION",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-CUSTOMER-B2C",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "Verified only for the listed article scopes and only where the law's definitions/applicability fit the transaction. Article-specific exceptions, implementing regulations, regulated-product rules and current Enamad/licensing requirements remain separate verification tasks."
  },
  {
    "retrieval_id": "RET-KCL-IR-SCI-CPI-1405-05",
    "knowledge_node_id": "KB-IR-MACRO-SCI-CPI-001",
    "claim_id": "KCL-IR-SCI-CPI-1405-05",
    "content": "مرکز آمار ایران برای مرداد ۱۴۰۵ شاخص قیمت مصرف‌کننده خانوارهای کشور را 700.1، تورم ماهانه را 3.4٪، تورم نقطه‌به‌نقطه را 89.0٪ و تورم دوازده‌ماهه را 69.9٪ گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SCI-CPI-1405-05"
    ],
    "source_authority_floor": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      8
    ],
    "decision_node_ids": [],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-REV-RECURRING",
      "MOD-REV-PROJECT",
      "MOD-GEO-LOCAL",
      "MOD-GEO-CROSSBORDER"
    ],
    "limitations": "این شاخص برای خانوارهای کشور است و نباید با شاخص بانک مرکزی برای مناطق شهری یکسان فرض شود؛ مشاهده تاریخی است و پیش‌بینی آینده نیست."
  },
  {
    "retrieval_id": "RET-KCL-IR-SHAPARAK-134",
    "knowledge_node_id": "KB-IR-PAYMENTS-SHAPARAK-001",
    "claim_id": "KCL-IR-SHAPARAK-134",
    "content": "شاپرک برای مرداد ۱۴۰۵ حدود 4 میلیارد و 651 میلیون تراکنش شبکه پرداخت به ارزش 3 هزار و 654 همت گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SHAPARAK-REPORT-134"
    ],
    "source_authority_floor": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      2,
      8
    ],
    "decision_node_ids": [
      "DN-PHYS-LOCAL-GROWTH",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-CHANNEL-PHYSICAL",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "آمار کل شبکه پرداخت شاپرک است؛ اندازه کل تجارت الکترونیکی یا فروش یک کسب‌وکار خاص نیست."
  },
  {
    "retrieval_id": "RET-KCL-IR-SNAPP-1404-RIDE-HOURS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "claim_id": "KCL-IR-SNAPP-1404-RIDE-HOURS",
    "content": "اسنپ برای سال ۱۴۰۴ بیش از ۴۰۷ میلیون ساعت حضور کاربران در سفرهای اسنپ را گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-OFFER-PLATFORM-LOOP",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-OFFER-PLATFORM",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "این شاخص زمان تجمعی اعلام‌شده در سفرهای اسنپ است؛ زمان سفر کل کشور، تعداد سفر، تعداد کاربر یکتا یا سهم بازار را به‌تنهایی اثبات نمی‌کند."
  },
  {
    "retrieval_id": "RET-KCL-IR-SNAPP-1404-SUPERAPP-VISITS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "claim_id": "KCL-IR-SNAPP-1404-SUPERAPP-VISITS",
    "content": "اسنپ در گزارش سال ۱۴۰۴ از ۸.۲ میلیارد بار مراجعه کاربران به سوپراپلیکیشن اسنپ خبر داده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "این عدد شدت استفاده از سوپراپ اسنپ را نشان می‌دهد و تعداد کاربران یکتا، اندازه کل بازار دیجیتال ایران یا سهم بازار اسنپ نیست."
  },
  {
    "retrieval_id": "RET-KCL-IR-SNAPP-1404-URBAN-TRIPS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "claim_id": "KCL-IR-SNAPP-1404-URBAN-TRIPS",
    "content": "اسنپ در یک پست رسمی گزارش سال ۱۴۰۴ از بیش از ۱.۵ میلیارد سفر شهری در این پلتفرم طی سال ۱۴۰۴ خبر داده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST"
    ],
    "source_authority_floor": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-TXN-GROWTH",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "این رقم سفرهای شهری گزارش‌شده در پلتفرم اسنپ است؛ کل سفرهای شهری ایران یا سهم بازار اسنپ را نشان نمی‌دهد."
  },
  {
    "retrieval_id": "RET-KCL-IR-TAX-TERMINALS-1398-UNVERIFIED",
    "knowledge_node_id": "KB-DOMAIN-TAX-SAAS",
    "claim_id": "KCL-IR-TAX-TERMINALS-1398-UNVERIFIED",
    "content": "متن تنقیح‌شده جاری قانون پایانه‌های فروشگاهی و سامانه مؤدیان در سامانه رسمی qavanin اصلاحات ۱۴۰۴/۰۴/۰۸ را منعکس می‌کند؛ در محدوده ثبت‌شده این منبع، ماده ۱۰ به اعلام حساب‌ها و ابزارهای پرداخت تجاری و مواد ۱۲ تا ۱۴ به تکالیف اطلاع‌رسانی درباره اختلال صدور صورتحساب، توقف فعالیت و تغییرات شغل/محل/مالکیت می‌پردازند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405",
      "SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN",
      "SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN"
    ],
    "source_authority_floor": "A",
    "freshness_class": "TAX",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      5,
      8
    ],
    "decision_node_ids": [
      "DN-TAX-SAAS-COMPLIANCE-SCOPE",
      "DN-TAX-SAAS-PROOF",
      "DN-TAX-SAAS-MESSAGING",
      "DN-TAX-SAAS-UPDATES"
    ],
    "module_ids": [
      "MOD-DOMAIN-TAX-SAAS",
      "MOD-REG-HIGH"
    ],
    "limitations": "Verified only for the captured current article locators and amendment chain noted above. Exact applicability depends on taxpayer status, thresholds, exemptions and implementing rules; other obligations remain REQUIRES_VERIFICATION until separately sourced."
  },
  {
    "retrieval_id": "RET-KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED",
    "knowledge_node_id": "KB-COMPLIANCE",
    "claim_id": "KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED",
    "content": "اصلاحیه ۱۴۰۳ قانون نظام صنفی کشور، ماده ۱۲ را به چارچوب قانون تسهیل صدور مجوزهای کسب‌وکار پیوند می‌دهد و ماده ۲۷ را درباره فعالیت بدون پروانه کسب و فرآیند اخطار/ضمانت اجرا جایگزین می‌کند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN"
    ],
    "source_authority_floor": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-REG-CONSTRAINTS",
      "DN-REG-EVIDENCE",
      "DN-REG-ACTIVATION"
    ],
    "module_ids": [
      "MOD-REG-HIGH"
    ],
    "limitations": "Verified for the 1403 amendment's licensing linkage and Article 27 enforcement structure. Do not hard-code the monetary fine because the law provides for inflation adjustment; activity-specific prerequisites and implementing rules require separate current sources."
  }
]);
export const CANONICAL_EXTERNAL_KNOWLEDGE_CLAIMS = Object.freeze({
  "KCL-IR-DIGIKALA-1404-DIGITAL-GOLD": {
    "id": "KCL-IR-DIGIKALA-1404-DIGITAL-GOLD",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "statement": "دیجی‌کالا در اعلام رسمی گزارش سال ۱۴۰۴ گفته است خرید طلای دیجیتال روی پلتفرم آن در سال ۱۴۰۴، ۱۲ برابر شده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST",
        "locator": "پست رسمی شرکت Digikala درباره انتشار گزارش سال ۱۴۰۴؛ شاخص صریح: خرید طلای دیجیتال در پلتفرم ۱۲ برابر شده است."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-OFFER-DIGITAL-ADOPTION",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-DIGITAL",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "رشد اعلام‌شده مربوط به خرید طلای دیجیتال داخل اکوسیستم دیجی‌کالا است و نباید به کل بازار طلا، سرمایه‌گذاری یا تجارت الکترونیکی ایران تعمیم داده شود."
  },
  "KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH": {
    "id": "KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "statement": "در پلتفرم دیجی‌کالا، جست‌وجوی عبارت «دست دوم» در سال ۱۴۰۴ نسبت به سال قبل ۵۱٪ افزایش یافته است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST",
        "locator": "پست رسمی شرکت Digikala درباره انتشار گزارش سال ۱۴۰۴؛ شاخص صریح: رشد ۵۱٪ جست‌وجوی «دست دوم» در ۱۴۰۴ نسبت به سال قبل."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "این شاخص فقط رفتار جست‌وجوی کاربران دیجی‌کالا را نشان می‌دهد؛ سهم بازار، تقاضای کل ایران، فروش کالای دست‌دوم در کل کشور یا رشد یک کسب‌وکار خاص نیست."
  },
  "KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE": {
    "id": "KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE",
    "knowledge_node_id": "KB-IR-PLATFORM-DIGIKALA-1404",
    "statement": "دیجی‌کالا در گزارش سال ۱۴۰۴ اعلام کرده است میانگین ارزش دلاری هر سفارش روی پلتفرم از سال ۱۳۹۷ تاکنون به سطح پیش از آن سال بازنگشته است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST",
        "locator": "پست رسمی شرکت Digikala درباره انتشار گزارش سال ۱۴۰۴؛ مشاهده روند: میانگین ارزش دلاری سفارش از ۱۳۹۷ تاکنون به سطح قبل از آن سال بازنگشته است."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-TXN-UNIT-ECONOMICS",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "این یک روند ارزش سفارش در پلتفرم دیجی‌کالا است، بدون رقم مطلق در پست رسمی؛ شاخص درآمد واقعی، قدرت خرید کل کشور یا اندازه بازار ایران محسوب نمی‌شود."
  },
  "KCL-IR-ECOM-1403": {
    "id": "KCL-IR-ECOM-1403",
    "knowledge_node_id": "KB-IR-ECOM-REPORT-001",
    "statement": "گزارش تجارت الکترونیکی ایران در سال ۱۴۰۳ ارزش معاملات تجارت الکترونیکی را بیش از 5,500 همت و رشد ارزش معاملات نسبت به سال قبل را حدود 73٪ گزارش می‌کند و بیش از 306 هزار کسب‌وکار دارای اینماد را نشان می‌دهد.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-ECOM-REPORT-1403"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-ECOM-REPORT-1403",
        "locator": "گزارش تجارت الکترونیکی ایران در سال 1403؛ رونمایی رسمی 24 مهر 1404؛ headline indicators / official report release"
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-DIGITAL-ADOPTION",
      "DN-OFFER-PLATFORM-LOOP",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-DIGITAL",
      "MOD-OFFER-PLATFORM",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "گزارش سالانه و کلان است؛ برای CAC/CPC روز، قیمت‌گذاری یک صنعت یا اندازه بازار یک زیرگروه باید منبع تخصصی‌تر استفاده شود."
  },
  "KCL-IR-LAW-ECOM-1382-UNVERIFIED": {
    "id": "KCL-IR-LAW-ECOM-1382-UNVERIFIED",
    "knowledge_node_id": "KB-COMPLIANCE",
    "statement": "در متن تنقیح‌شده جاری قانون تجارت الکترونیکی، برای معاملات از راه دور با مصرف‌کننده، مواد ۳۳ تا ۳۵ بر ارائه و تأیید اطلاعات مؤثر پیش از خرید، مواد ۳۷ تا ۳۹ بر چارچوب حق انصراف/استرداد و عدم امکان تأمین، و مواد ۵۰ تا ۵۵ بر شفافیت و عدم فریب در تبلیغات و هویت عرضه‌کننده تأکید دارند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR",
        "locator": "Official qavanin consolidated text IDS=15700719202226051269 — Article 2 definitions; Articles 33–35 pre-contract/confirmation duties; Articles 37–39 withdrawal/refund framework; Articles 50–55 advertising transparency. Registry status: اصلاحی 1403-03-30; verified 2026-09-27."
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      5,
      8
    ],
    "decision_node_ids": [
      "DN-REG-CONSTRAINTS",
      "DN-REG-EVIDENCE",
      "DN-REG-MESSAGING",
      "DN-REG-ACTIVATION",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-CUSTOMER-B2C",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "Verified only for the listed article scopes and only where the law's definitions/applicability fit the transaction. Article-specific exceptions, implementing regulations, regulated-product rules and current Enamad/licensing requirements remain separate verification tasks.",
    "applicability": {
      "required_module_ids_all": [
        "MOD-CUSTOMER-B2C",
        "MOD-CHANNEL-ONLINE"
      ]
    }
  },
  "KCL-IR-SCI-CPI-1405-05": {
    "id": "KCL-IR-SCI-CPI-1405-05",
    "knowledge_node_id": "KB-IR-MACRO-SCI-CPI-001",
    "statement": "مرکز آمار ایران برای مرداد ۱۴۰۵ شاخص قیمت مصرف‌کننده خانوارهای کشور را 700.1، تورم ماهانه را 3.4٪، تورم نقطه‌به‌نقطه را 89.0٪ و تورم دوازده‌ماهه را 69.9٪ گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SCI-CPI-1405-05"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-SCI-CPI-1405-05",
        "locator": "درگاه ملی آمار، «شاخص قیمت مصرف کننده – مرداد ماه 1405»، منتشرشده 1405/06/05، متن شاخص کل خانوارهای کشور"
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      8
    ],
    "decision_node_ids": [],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-REV-RECURRING",
      "MOD-REV-PROJECT",
      "MOD-GEO-LOCAL",
      "MOD-GEO-CROSSBORDER"
    ],
    "limitations": "این شاخص برای خانوارهای کشور است و نباید با شاخص بانک مرکزی برای مناطق شهری یکسان فرض شود؛ مشاهده تاریخی است و پیش‌بینی آینده نیست."
  },
  "KCL-IR-SHAPARAK-134": {
    "id": "KCL-IR-SHAPARAK-134",
    "knowledge_node_id": "KB-IR-PAYMENTS-SHAPARAK-001",
    "statement": "شاپرک برای مرداد ۱۴۰۵ حدود 4 میلیارد و 651 میلیون تراکنش شبکه پرداخت به ارزش 3 هزار و 654 همت گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SHAPARAK-REPORT-134"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-SHAPARAK-REPORT-134",
        "locator": "خبر رسمی شاپرک، کد SHP-1788764678581، 1405/06/16؛ headline figures for Mordad 1405"
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      2,
      8
    ],
    "decision_node_ids": [
      "DN-PHYS-LOCAL-GROWTH",
      "DN-ONLINE-FUNNEL"
    ],
    "module_ids": [
      "MOD-CHANNEL-PHYSICAL",
      "MOD-CHANNEL-ONLINE"
    ],
    "limitations": "آمار کل شبکه پرداخت شاپرک است؛ اندازه کل تجارت الکترونیکی یا فروش یک کسب‌وکار خاص نیست."
  },
  "KCL-IR-SNAPP-1404-RIDE-HOURS": {
    "id": "KCL-IR-SNAPP-1404-RIDE-HOURS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "statement": "اسنپ برای سال ۱۴۰۴ بیش از ۴۰۷ میلیون ساعت حضور کاربران در سفرهای اسنپ را گزارش کرده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY",
        "locator": "صفحه رسمی شرکت Snapp! درباره گزارش سال ۱۴۰۴؛ متن صریح: بیشتر از ۴۰۷ میلیون ساعت حضور در سفرهای اسنپ."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-OFFER-PLATFORM-LOOP",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-OFFER-PLATFORM",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "این شاخص زمان تجمعی اعلام‌شده در سفرهای اسنپ است؛ زمان سفر کل کشور، تعداد سفر، تعداد کاربر یکتا یا سهم بازار را به‌تنهایی اثبات نمی‌کند."
  },
  "KCL-IR-SNAPP-1404-SUPERAPP-VISITS": {
    "id": "KCL-IR-SNAPP-1404-SUPERAPP-VISITS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "statement": "اسنپ در گزارش سال ۱۴۰۴ از ۸.۲ میلیارد بار مراجعه کاربران به سوپراپلیکیشن اسنپ خبر داده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY",
        "locator": "صفحه رسمی شرکت Snapp! درباره گزارش سال ۱۴۰۴؛ متن صریح: ۸.۲ میلیارد بار مراجعه کاربران به سوپراپ."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-ONLINE-FUNNEL",
      "DN-OFFER-PLATFORM-LOOP"
    ],
    "module_ids": [
      "MOD-CHANNEL-ONLINE",
      "MOD-OFFER-PLATFORM"
    ],
    "limitations": "این عدد شدت استفاده از سوپراپ اسنپ را نشان می‌دهد و تعداد کاربران یکتا، اندازه کل بازار دیجیتال ایران یا سهم بازار اسنپ نیست."
  },
  "KCL-IR-SNAPP-1404-URBAN-TRIPS": {
    "id": "KCL-IR-SNAPP-1404-URBAN-TRIPS",
    "knowledge_node_id": "KB-IR-PLATFORM-SNAPP-1404",
    "statement": "اسنپ در یک پست رسمی گزارش سال ۱۴۰۴ از بیش از ۱.۵ میلیارد سفر شهری در این پلتفرم طی سال ۱۴۰۴ خبر داده است.",
    "claim_kind": "MARKET_OBSERVATION",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST",
        "locator": "پست رسمی Snapp! با عنوان روایت گروه اسنپ در ۱۴۰۴؛ متن صریح: بیشتر از ۱.۵ میلیارد سفر شهری."
      }
    ],
    "authority_requirement": "A_TO_C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-TXN-GROWTH",
      "DN-MKT-LIQUIDITY"
    ],
    "module_ids": [
      "MOD-REV-TRANSACTION",
      "MOD-CUSTOMER-TWO-SIDED"
    ],
    "limitations": "این رقم سفرهای شهری گزارش‌شده در پلتفرم اسنپ است؛ کل سفرهای شهری ایران یا سهم بازار اسنپ را نشان نمی‌دهد."
  },
  "KCL-IR-TAX-TERMINALS-1398-UNVERIFIED": {
    "id": "KCL-IR-TAX-TERMINALS-1398-UNVERIFIED",
    "knowledge_node_id": "KB-DOMAIN-TAX-SAAS",
    "statement": "متن تنقیح‌شده جاری قانون پایانه‌های فروشگاهی و سامانه مؤدیان در سامانه رسمی qavanin اصلاحات ۱۴۰۴/۰۴/۰۸ را منعکس می‌کند؛ در محدوده ثبت‌شده این منبع، ماده ۱۰ به اعلام حساب‌ها و ابزارهای پرداخت تجاری و مواد ۱۲ تا ۱۴ به تکالیف اطلاع‌رسانی درباره اختلال صدور صورتحساب، توقف فعالیت و تغییرات شغل/محل/مالکیت می‌پردازند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405",
      "SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN",
      "SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405",
        "locator": "qavanin IDS 12936955486234542481 — current consolidated Articles 10, 12, 13 and 14; visible amendment markers 1404-04-08."
      },
      {
        "source_id": "SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN",
        "locator": "Official qavanin IDS 4822349448318190655; facilitation law identity/effective date."
      },
      {
        "source_id": "SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN",
        "locator": "Official qavanin IDS 17935142558800059836; Article 1 replacement approved 1402-10-18."
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "TAX",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      3,
      5,
      8
    ],
    "decision_node_ids": [
      "DN-TAX-SAAS-COMPLIANCE-SCOPE",
      "DN-TAX-SAAS-PROOF",
      "DN-TAX-SAAS-MESSAGING",
      "DN-TAX-SAAS-UPDATES"
    ],
    "module_ids": [
      "MOD-DOMAIN-TAX-SAAS",
      "MOD-REG-HIGH"
    ],
    "limitations": "Verified only for the captured current article locators and amendment chain noted above. Exact applicability depends on taxpayer status, thresholds, exemptions and implementing rules; other obligations remain REQUIRES_VERIFICATION until separately sourced."
  },
  "KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED": {
    "id": "KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED",
    "knowledge_node_id": "KB-COMPLIANCE",
    "statement": "اصلاحیه ۱۴۰۳ قانون نظام صنفی کشور، ماده ۱۲ را به چارچوب قانون تسهیل صدور مجوزهای کسب‌وکار پیوند می‌دهد و ماده ۲۷ را درباره فعالیت بدون پروانه کسب و فرآیند اخطار/ضمانت اجرا جایگزین می‌کند.",
    "claim_kind": "LEGAL_REQUIREMENT",
    "decision_driving": true,
    "status": "VERIFIED",
    "source_ids": [
      "SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN"
    ],
    "locators": [
      {
        "source_id": "SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN",
        "locator": "qavanin IDS 11646297386230802736 — Article 1 amending Article 12 and replacing Article 27; approved 1403-05-02; effective 1403-06-14."
      }
    ],
    "authority_requirement": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "jurisdiction_or_scope": "IRAN",
    "phases": [
      1,
      2,
      8
    ],
    "decision_node_ids": [
      "DN-REG-CONSTRAINTS",
      "DN-REG-EVIDENCE",
      "DN-REG-ACTIVATION"
    ],
    "module_ids": [
      "MOD-REG-HIGH"
    ],
    "limitations": "Verified for the 1403 amendment's licensing linkage and Article 27 enforcement structure. Do not hard-code the monetary fine because the law provides for inflation adjustment; activity-specific prerequisites and implementing rules require separate current sources."
  }
});
export const CANONICAL_EXTERNAL_SOURCE_REGISTRY = Object.freeze({
  "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST": {
    "id": "SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST",
    "source_type": "PLATFORM_FIRST_PARTY_ANNOUNCEMENT",
    "title": "گزارش سال ۱۴۰۴ دیجی‌کالا — اعلام رسمی انتشار و شاخص‌های منتخب",
    "author_or_institution": "Digikala",
    "issuing_authority": "Digikala",
    "published_at": null,
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1404",
    "edition_or_version": "1404 annual report official company announcement",
    "url": "https://www.linkedin.com/company/digikala/",
    "repository_location": "wiki/snapshots/iran/digikala-1404-first-party-announcement.txt",
    "accessed_at": "2026-09-25",
    "verified_at": "2026-09-25",
    "jurisdiction_or_scope": "DIGIKALA_PLATFORM",
    "language": "fa",
    "authority_tier": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "status": "VERIFIED",
    "checksum": "git-blob:1bff3c171324e12588291995daac72119943c4ad",
    "limitations": "First-party Digikala platform evidence only. The full annual-report landing behind the LinkedIn short link was not reproducibly retrieved in this run. Admit only metrics explicitly present in Digikala's own company announcement; never interpret them as Iran-wide retail or consumer-market totals."
  },
  "SRC-IR-ECOM-REPORT-1403": {
    "id": "SRC-IR-ECOM-REPORT-1403",
    "source_type": "OFFICIAL_ANNUAL_REPORT",
    "title": "گزارش تجارت الکترونیکی ایران در سال 1403",
    "author_or_institution": "مرکز توسعه تجارت الکترونیکی",
    "issuing_authority": "مرکز توسعه تجارت الکترونیکی / وزارت صمت",
    "published_at": "1404-07-24",
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1403",
    "edition_or_version": "Iran E-Commerce Report 1403",
    "url": "https://www.ecommerce.gov.ir/fa/",
    "repository_location": "wiki/snapshots/iran/ecommerce-1403.txt",
    "accessed_at": "2026-09-24",
    "verified_at": "2026-09-24",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "status": "VERIFIED",
    "checksum": "git-blob:33aeb425af47b6a39770cc95fd71c2653886ab71",
    "limitations": "The official site identifies the report and report-download area, but the report file was not directly fetchable by the verification client. Only headline figures repeatedly tied to the official release are promoted; table-level statistics require direct report locators."
  },
  "SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR": {
    "id": "SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR",
    "source_type": "OFFICIAL_LEGAL_REGISTRY",
    "title": "قانون تجارت الکترونیکی — official qavanin.ir registry record",
    "author_or_institution": "مجلس شورای اسلامی",
    "issuing_authority": "معاونت حقوقی ریاست جمهوری / سامانه ملی قوانین و مقررات",
    "published_at": "1382-11-11",
    "effective_from": "1382-11-27",
    "effective_until": null,
    "observed_period": null,
    "edition_or_version": "مصوب 1382-10-17؛ شناسه qavanin.ir = 15700719202226051269؛ روزنامه رسمی 17167؛ متن تنقیح‌شده با وضعیت اصلاحی 1403-03-30؛ locator scope verified 2026-09-27",
    "url": "https://qavanin.ir/Law/TreeText/?IDS=15700719202226051269",
    "repository_location": "wiki/snapshots/iran/ecommerce-1382-qavanin-consumer-distance-current-1405-07.txt",
    "accessed_at": "2026-09-27",
    "verified_at": "2026-09-27",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "status": "VERIFIED",
    "checksum": "git-blob:5e1522c4008c121c717379f8aede8fe592750cca",
    "limitations": "Current official consolidated qavanin text was verified only for Article 2 definitions and Articles 33–39 and 50–55 consumer/distance-contract and advertising duties. This record does not establish Enamad rules, all implementing regulations, all exceptions, or activity-specific licensing."
  },
  "SRC-IR-SCI-CPI-1405-05": {
    "id": "SRC-IR-SCI-CPI-1405-05",
    "source_type": "OFFICIAL_STATISTICAL_RELEASE",
    "title": "شاخص قیمت مصرف کننده – مرداد ماه 1405",
    "author_or_institution": "مرکز آمار ایران",
    "issuing_authority": "مرکز آمار ایران / درگاه ملی آمار",
    "published_at": "1405-06-05",
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1405-05",
    "edition_or_version": "Mordad 1405 CPI release",
    "url": "https://www.amar.org.ir/",
    "repository_location": "wiki/snapshots/iran/sci-cpi-1405-05.txt",
    "accessed_at": "2026-09-24",
    "verified_at": "2026-09-24",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "status": "VERIFIED",
    "checksum": "git-blob:dab85907905167792325701902b8c13162601927",
    "limitations": "The origin domain timed out during verification. Release identity, publication time and figures were captured from an indexed National Statistics Portal representation and corroborating reporting. Re-capture the direct origin URL/snapshot on the next freshness verification."
  },
  "SRC-IR-SHAPARAK-REPORT-134": {
    "id": "SRC-IR-SHAPARAK-REPORT-134",
    "source_type": "OFFICIAL_PAYMENT_NETWORK_RELEASE",
    "title": "ثبت 4.6 میلیارد تراکنش در مردادماه 1405؛ شبکه پرداخت در مدار پایداری",
    "author_or_institution": "شرکت شبکه الکترونیکی پرداخت کارت (شاپرک)",
    "issuing_authority": "شاپرک",
    "published_at": "1405-06-16",
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1405-05",
    "edition_or_version": "Economic report 134 / news code SHP-1788764678581",
    "url": "https://shaparak.ir/fa/news/SHP-1788764678581",
    "repository_location": "wiki/snapshots/iran/shaparak-134.txt",
    "accessed_at": "2026-09-24",
    "verified_at": "2026-09-24",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "MACRO",
    "max_age_days": 90,
    "status": "VERIFIED",
    "checksum": "git-blob:0d3b089f5a3293ef74b4c499281e67c4973dd23a",
    "limitations": "The origin page was not directly fetchable by the verification client; the indexed official Shaparak representation preserved the official code, date and headline figures. Use only the explicitly captured figures until the report PDF/page is snapshotted directly."
  },
  "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY": {
    "id": "SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY",
    "source_type": "PLATFORM_FIRST_PARTY_ANNOUNCEMENT",
    "title": "گزارش سال ۱۴۰۴ اسنپ — شاخص‌های منتخب در صفحه رسمی شرکت",
    "author_or_institution": "Snapp!",
    "issuing_authority": "Snapp!",
    "published_at": null,
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1404",
    "edition_or_version": "1404 annual report official company announcement",
    "url": "https://www.linkedin.com/company/snapp.ir",
    "repository_location": "wiki/snapshots/iran/snapp-1404-first-party-company.txt",
    "accessed_at": "2026-09-25",
    "verified_at": "2026-09-25",
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "language": "fa",
    "authority_tier": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "status": "VERIFIED",
    "checksum": "git-blob:7ef09428433be25cccea7158b1b8bec5f2440dfd",
    "limitations": "First-party Snapp platform evidence only. The full report behind the published short link was not reproducibly retrieved in this run. Admit only metrics explicitly visible on Snapp's official company page; never interpret them as Iran-wide mobility, commerce, market-share or consumer totals."
  },
  "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST": {
    "id": "SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST",
    "source_type": "PLATFORM_FIRST_PARTY_ANNOUNCEMENT",
    "title": "گزارش سال ۱۴۰۴ اسنپ — پست رسمی سفرهای شهری",
    "author_or_institution": "Snapp!",
    "issuing_authority": "Snapp!",
    "published_at": null,
    "effective_from": null,
    "effective_until": null,
    "observed_period": "1404",
    "edition_or_version": "1404 annual report official urban-trips post",
    "url": "https://www.linkedin.com/posts/snapp.ir_%D8%A7%D8%B3%D9%86%D9%BE-%DA%AF%D8%B2%D8%A7%D8%B1%D8%B4%D8%B3%D8%A7%D9%84-activity-7486751285828960256-Je8Z",
    "repository_location": "wiki/snapshots/iran/snapp-1404-urban-trips-post.txt",
    "accessed_at": "2026-09-25",
    "verified_at": "2026-09-25",
    "jurisdiction_or_scope": "SNAPP_PLATFORM",
    "language": "fa",
    "authority_tier": "C",
    "freshness_class": "INDUSTRY_REPORT",
    "max_age_days": 365,
    "status": "VERIFIED",
    "checksum": "git-blob:1fe872f758c3a832b57bec9526047765379584c6",
    "limitations": "First-party Snapp platform evidence only. The >1.5 billion figure is Snapp-reported urban trips in 1404; it is not the total number of urban trips in Iran and does not by itself establish market share."
  },
  "SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405": {
    "id": "SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405",
    "source_type": "OFFICIAL_LEGAL_REGISTRY",
    "title": "قانون پایانه‌های فروشگاهی و سامانه مؤدیان — متن تنقیح‌شده جاری qavanin",
    "author_or_institution": "مجلس شورای اسلامی",
    "issuing_authority": "سامانه ملی قوانین و مقررات جمهوری اسلامی ایران / معاونت حقوقی ریاست جمهوری",
    "published_at": "1398-08-16",
    "effective_from": null,
    "effective_until": null,
    "observed_period": "current consolidated registry text verified 2026-09-26",
    "edition_or_version": "qavanin IDS 12936955486234542481; current consolidated text includes amendments/additions marked 1404-04-08",
    "url": "https://qavanin.ir/Law/TreeText/?IDS=12936955486234542481",
    "repository_location": "wiki/snapshots/iran/taxpayer-system-current-qavanin-1405-07.txt",
    "accessed_at": "2026-09-26",
    "verified_at": "2026-09-26",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "TAX",
    "max_age_days": 30,
    "status": "VERIFIED",
    "checksum": "git-blob:38f181b784bd8581e69eaf10d87022b9cad85bb8",
    "limitations": "Verified only for the captured current locators (Articles 10 and 12-14) and visible 1404-04-08 amendment markers. Other taxpayer obligations still require their own current primary locators and applicability checks."
  },
  "SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN": {
    "id": "SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN",
    "source_type": "OFFICIAL_LEGAL_REGISTRY",
    "title": "قانون تسهیل تکالیف مؤدیان جهت اجرای قانون پایانه‌های فروشگاهی و سامانه مؤدیان — official qavanin record",
    "author_or_institution": "مجلس شورای اسلامی",
    "issuing_authority": "سامانه ملی قوانین و مقررات جمهوری اسلامی ایران / معاونت حقوقی ریاست جمهوری",
    "published_at": "1402-10-04",
    "effective_from": "1402-10-20",
    "effective_until": null,
    "observed_period": null,
    "edition_or_version": "qavanin IDS 4822349448318190655; promulgation 177609 dated 1402-09-29; Official Gazette 22942",
    "url": "https://qavanin.ir/Law/Attribute/?IDS=4822349448318190655",
    "repository_location": "wiki/snapshots/iran/taxpayer-facilitation-1402-qavanin.txt",
    "accessed_at": "2026-09-25",
    "verified_at": "2026-09-25",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "TAX",
    "max_age_days": 30,
    "status": "VERIFIED",
    "checksum": "git-blob:a6c8a7c6930eceaa313f219608813fd00445ce37",
    "limitations": "Verifies the official identity, promulgation, Official Gazette publication and effective date of the 1402 facilitation law. It does not by itself establish every currently applicable taxpayer-system obligation because Article 1 was replaced on 1402-10-18 and later 1404 amendments affect the wider chain."
  },
  "SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN": {
    "id": "SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN",
    "source_type": "OFFICIAL_LEGAL_REGISTRY",
    "title": "قانون اصلاح ماده (1) قانون تسهیل تکالیف مؤدیان — official qavanin record",
    "author_or_institution": "مجلس شورای اسلامی",
    "issuing_authority": "سامانه ملی قوانین و مقررات جمهوری اسلامی ایران / معاونت حقوقی ریاست جمهوری",
    "published_at": "1402-11-21",
    "effective_from": "1402-12-07",
    "effective_until": null,
    "observed_period": null,
    "edition_or_version": "qavanin IDS 17935142558800059836; promulgation 211331 dated 1402-11-16; Official Gazette 22980; approved 1402-10-18",
    "url": "https://qavanin.ir/Law/TreeText/?IDS=17935142558800059836",
    "repository_location": "wiki/snapshots/iran/taxpayer-facilitation-article1-amendment-1402-qavanin.txt",
    "accessed_at": "2026-09-25",
    "verified_at": "2026-09-25",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "TAX",
    "max_age_days": 30,
    "status": "VERIFIED",
    "checksum": "git-blob:69f70c5f63dca2f3bf963be980a67e385fecb940",
    "limitations": "Verifies the official replacement of Article 1 and its publication metadata. It is one link in the current-law chain and must not be treated as proof of all current taxpayer-system obligations."
  },
  "SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN": {
    "id": "SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN",
    "source_type": "OFFICIAL_LEGAL_REGISTRY",
    "title": "قانون اصلاح قانون نظام صنفی کشور — مصوب 1403/05/02",
    "author_or_institution": "مجلس شورای اسلامی",
    "issuing_authority": "سامانه ملی قوانین و مقررات جمهوری اسلامی ایران / معاونت حقوقی ریاست جمهوری",
    "published_at": "1403-05-29",
    "effective_from": "1403-06-14",
    "effective_until": null,
    "observed_period": null,
    "edition_or_version": "qavanin IDS 11646297386230802736; promulgation 80114 dated 1403-05-24; Official Gazette 23127",
    "url": "https://qavanin.ir/Law/TreeText/?IDS=11646297386230802736",
    "repository_location": "wiki/snapshots/iran/trade-union-amendment-1403-qavanin.txt",
    "accessed_at": "2026-09-26",
    "verified_at": "2026-09-26",
    "jurisdiction_or_scope": "IRAN",
    "language": "fa",
    "authority_tier": "A",
    "freshness_class": "LEGAL",
    "max_age_days": 30,
    "status": "VERIFIED",
    "checksum": "git-blob:48789f41a29fc73633a1b5711376bc23b1f0f47b",
    "limitations": "Verifies the 1403 amendment, including Article 1 changes to licensing provisions and the replacement Article 27 enforcement structure. Activity-specific licensing prerequisites and current implementing rules still require their own primary locators."
  }
});
