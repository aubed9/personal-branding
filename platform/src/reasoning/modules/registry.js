import { defineDecisionModule, isModuleActive, validateDecisionModule } from './contract.js';
import { DOMAIN_DECISION_MODULES, validateDomainDecisionModules } from './domainRegistry.js';

const d = defineDecisionModule;

export const DECISION_MODULES = Object.freeze([
  d({
    id: 'MOD-CUSTOMER-B2B',
    title: 'B2B decision-making unit and procurement',
    axis: 'customerModel', values: ['B2B', 'B2B2C', 'B2G', 'MIXED'], phases: [2, 3, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-B2B-DMU', phase: 2, title: 'کمیته تصمیم‌گیری و نقش‌های خرید' },
      { id: 'DN-B2B-BUSINESS-CASE', phase: 3, title: 'منطق ROI و اثبات ارزش سازمانی' },
      { id: 'DN-B2B-PIPELINE', phase: 8, title: 'پایپ‌لاین، مرحله فروش و procurement' },
    ],
    evidenceRequirements: ['DMU_ROLES', 'PROCUREMENT_PROCESS', 'BUSINESS_CASE_PROOF'],
    metrics: ['qualified_pipeline', 'win_rate', 'sales_cycle_days'],
    risks: ['single_champion_dependency', 'procurement_delay'],
    outputSections: ['b2b_buying_system', 'enterprise_proof', 'pipeline_plan'],
    gates: ['GATE-B2B-PROOF-BEFORE-CLAIM'],
    knowledgeDependencies: ['KB-B2B-DMU', 'KB-B2B-PROCUREMENT'],
  }),
  d({
    id: 'MOD-CUSTOMER-B2C',
    title: 'B2C purchase behavior',
    axis: 'customerModel', values: ['B2C', 'B2B2C', 'MIXED'], phases: [2, 3, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-B2C-PURCHASE-TRIGGER', phase: 2, title: 'محرک خرید و اصطکاک فردی' },
      { id: 'DN-B2C-SEGMENT', phase: 3, title: 'سگمنت رفتاری و حساسیت قیمت' },
      { id: 'DN-B2C-CONVERSION', phase: 8, title: 'تبدیل، خرید تکرار و وفاداری' },
    ],
    evidenceRequirements: ['PURCHASE_TRIGGER', 'PRICE_SENSITIVITY', 'REPEAT_BEHAVIOR'],
    metrics: ['conversion_rate', 'repeat_purchase_rate', 'average_order_value'],
    risks: ['discount_dependency', 'trust_friction'],
    outputSections: ['consumer_behavior', 'b2c_positioning', 'conversion_plan'],
    gates: [],
    knowledgeDependencies: ['KB-B2C-BEHAVIOR'],
  }),
  d({
    id: 'MOD-CUSTOMER-TWO-SIDED',
    title: 'Two-sided marketplace',
    axis: 'customerModel', values: ['TWO_SIDED'], phases: [1, 2, 3, 8], priority: 10,
    decisionNodes: [
      { id: 'DN-MKT-SIDES', phase: 1, title: 'تعریف دو سمت بازار' },
      { id: 'DN-MKT-LIQUIDITY', phase: 2, title: 'نقدشوندگی و تعادل عرضه/تقاضا' },
      { id: 'DN-MKT-VALUE-EACH-SIDE', phase: 3, title: 'ارزش پیشنهادی مستقل برای هر سمت' },
      { id: 'DN-MKT-LEAKAGE', phase: 8, title: 'جلوگیری از خروج معامله از پلتفرم' },
    ],
    evidenceRequirements: ['SUPPLY_SIDE', 'DEMAND_SIDE', 'MATCH_RATE', 'LEAKAGE_RATE'],
    metrics: ['match_rate', 'active_buyers', 'active_sellers', 'take_rate', 'leakage_rate'],
    risks: ['cold_start', 'platform_leakage', 'side_imbalance'],
    outputSections: ['marketplace_liquidity', 'two_sided_positioning', 'marketplace_growth'],
    gates: ['GATE-MKT-BOTH-SIDES-EVIDENCE'],
    knowledgeDependencies: ['KB-MARKETPLACE-LIQUIDITY'],
  }),

  d({
    id: 'MOD-OFFER-PHYSICAL',
    title: 'Physical product proof and delivery',
    axis: 'offerType', values: ['PHYSICAL_PRODUCT'], phases: [1, 2, 3, 7, 8], priority: 25,
    decisionNodes: [
      { id: 'DN-OFFER-PHYSICAL-UNIT', phase: 1, title: 'واحد فروش، هزینه و محدودیت موجودی/تامین' },
      { id: 'DN-OFFER-PHYSICAL-PROOF', phase: 2, title: 'کیفیت قابل مشاهده، اصالت و مقایسه محصول' },
      { id: 'DN-OFFER-PHYSICAL-PROMISE', phase: 3, title: 'وعده محصول و شرایط تحویل واقعی' },
      { id: 'DN-OFFER-PHYSICAL-PACKAGING', phase: 7, title: 'کاربرد هویت روی بسته‌بندی و نقطه تماس محصول' },
      { id: 'DN-OFFER-PHYSICAL-DELIVERY', phase: 8, title: 'تامین، تحویل، مرجوعی و خرید تکرار' },
    ],
    evidenceRequirements: ['UNIT_OF_SALE', 'PRODUCT_PROOF', 'SUPPLY_CONSTRAINT', 'DELIVERY_CONDITION'],
    calculations: ['inventory_or_supply_exposure'],
    metrics: ['gross_margin', 'return_rate', 'stockout_rate'],
    risks: ['inventory_or_supply_failure', 'quality_variance'],
    outputSections: ['physical_offer_system'],
    gates: ['GATE-PHYSICAL-DELIVERY-FEASIBLE'],
    knowledgeDependencies: ['KB-PHYSICAL-OFFER'],
  }),
  d({
    id: 'MOD-OFFER-DIGITAL',
    title: 'Digital product adoption',
    axis: 'offerType', values: ['DIGITAL_PRODUCT'], phases: [1, 2, 3, 5, 8], priority: 25,
    decisionNodes: [
      { id: 'DN-OFFER-DIGITAL-VALUE', phase: 1, title: 'واحد ارزش دیجیتال و time-to-value' },
      { id: 'DN-OFFER-DIGITAL-FRICTION', phase: 2, title: 'اصطکاک onboarding و adoption' },
      { id: 'DN-OFFER-DIGITAL-PROMISE', phase: 3, title: 'دستاورد قابل اثبات در محصول دیجیتال' },
      { id: 'DN-OFFER-DIGITAL-EXPLAIN', phase: 5, title: 'توضیح ساده قابلیت بدون jargon فنی' },
      { id: 'DN-OFFER-DIGITAL-ADOPTION', phase: 8, title: 'activation، adoption و support loop' },
    ],
    evidenceRequirements: ['VALUE_EVENT', 'ONBOARDING_FRICTION', 'USAGE_SIGNAL', 'SUPPORT_PATTERN'],
    calculations: ['time_to_value'],
    metrics: ['activation_rate', 'feature_adoption', 'time_to_value'],
    risks: ['activation_failure', 'feature_value_gap'],
    outputSections: ['digital_product_adoption'],
    gates: ['GATE-DIGITAL-VALUE-EVENT'],
    knowledgeDependencies: ['KB-DIGITAL-PRODUCT'],
  }),
  d({
    id: 'MOD-OFFER-SERVICE',
    title: 'Service delivery and proof',
    axis: 'offerType', values: ['SERVICE', 'EXPERIENCE'], phases: [1, 2, 3, 5, 8], priority: 25,
    decisionNodes: [
      { id: 'DN-OFFER-SERVICE-CAPACITY', phase: 1, title: 'ظرفیت خدمت، زمان و هزینه تحویل' },
      { id: 'DN-OFFER-SERVICE-QUALITY', phase: 2, title: 'شاهد کیفیت و تجربه واقعی مشتری' },
      { id: 'DN-OFFER-SERVICE-PROMISE', phase: 3, title: 'مرز وعده خدمت و سطح قابل تحویل' },
      { id: 'DN-OFFER-SERVICE-EXPECTATION', phase: 5, title: 'تنظیم انتظار قبل از خرید' },
      { id: 'DN-OFFER-SERVICE-DELIVERY', phase: 8, title: 'booking/تحویل/feedback و کنترل ظرفیت' },
    ],
    evidenceRequirements: ['SERVICE_CAPACITY', 'DELIVERY_TIME', 'QUALITY_PROOF', 'CUSTOMER_EXPECTATION'],
    calculations: ['service_capacity_utilization'],
    metrics: ['capacity_utilization', 'delivery_on_time', 'repeat_rate'],
    risks: ['service_overpromise', 'quality_variance'],
    outputSections: ['service_delivery'],
    gates: ['GATE-SERVICE-CAPACITY'],
    knowledgeDependencies: ['KB-SERVICE-DELIVERY'],
  }),
  d({
    id: 'MOD-OFFER-PLATFORM',
    title: 'Platform/marketplace product mechanics',
    axis: 'offerType', values: ['PLATFORM', 'MARKETPLACE', 'MIXED'], phases: [1, 2, 3, 8], priority: 25,
    decisionNodes: [
      { id: 'DN-OFFER-PLATFORM-JOB', phase: 1, title: 'job اصلی و نقش پلتفرم در خلق ارزش' },
      { id: 'DN-OFFER-PLATFORM-FRICTION', phase: 2, title: 'اصطکاک interaction و اعتماد' },
      { id: 'DN-OFFER-PLATFORM-PROMISE', phase: 3, title: 'وعده پلتفرم و مرز مسئولیت' },
      { id: 'DN-OFFER-PLATFORM-LOOP', phase: 8, title: 'interaction loop، trust و growth mechanic' },
    ],
    evidenceRequirements: ['PLATFORM_JOB', 'INTERACTION_FRICTION', 'TRUST_MECHANISM'],
    metrics: ['successful_interactions', 'activation_rate'],
    risks: ['platform_trust_gap', 'unclear_responsibility'],
    outputSections: ['platform_mechanics'],
    gates: ['GATE-PLATFORM-VALUE-LOOP'],
    knowledgeDependencies: ['KB-PLATFORM-MECHANICS'],
  }),

  d({
    id: 'MOD-REV-TRANSACTION',
    title: 'Transactional economics',
    axis: 'revenueModel', values: ['TRANSACTION'], phases: [1, 2, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-TXN-UNIT-ECONOMICS', phase: 1, title: 'حاشیه مشارکت هر تراکنش' },
      { id: 'DN-TXN-REPURCHASE', phase: 2, title: 'تکرار خرید و فرکانس' },
      { id: 'DN-TXN-GROWTH', phase: 8, title: 'رشد تراکنش سودآور' },
    ],
    evidenceRequirements: ['UNIT_PRICE', 'VARIABLE_COST', 'REPURCHASE_FREQUENCY'],
    calculations: ['contribution_margin', 'break_even_units'],
    metrics: ['average_order_value', 'contribution_margin', 'repeat_purchase_rate'],
    risks: ['negative_unit_margin', 'promo_margin_erosion'],
    outputSections: ['transaction_economics'],
    gates: ['GATE-POSITIVE-UNIT-MARGIN'],
    knowledgeDependencies: ['KB-UNIT-ECONOMICS'],
  }),
  d({
    id: 'MOD-REV-RECURRING',
    title: 'Recurring/subscription economics',
    axis: 'revenueModel', values: ['RECURRING', 'RETAINER'], phases: [1, 2, 3, 8], priority: 10,
    decisionNodes: [
      { id: 'DN-REC-ACTIVATION', phase: 1, title: 'تعریف activation و time-to-value' },
      { id: 'DN-REC-RETENTION', phase: 2, title: 'علت retention/churn و cohort' },
      { id: 'DN-REC-PROMISE', phase: 3, title: 'وعده تکرارشونده قابل اثبات' },
      { id: 'DN-REC-EXPANSION', phase: 8, title: 'renewal، expansion و payback' },
    ],
    evidenceRequirements: ['ACTIVATION_EVENT', 'RETENTION_COHORT', 'CHURN_REASON', 'RENEWAL_BEHAVIOR'],
    calculations: ['mrr', 'logo_churn', 'revenue_churn', 'ltv_cac', 'cac_payback'],
    metrics: ['activation_rate', 'retention_rate', 'logo_churn', 'mrr', 'cac_payback'],
    risks: ['early_churn', 'false_ltv', 'retention_blindness'],
    outputSections: ['recurring_economics', 'retention_system'],
    gates: ['GATE-REC-RETENTION-EVIDENCE'],
    knowledgeDependencies: ['KB-RETENTION', 'KB-LTV-CAC'],
  }),
  d({
    id: 'MOD-REV-PROJECT',
    title: 'Project-based economics and delivery',
    axis: 'revenueModel', values: ['PROJECT_BASED'], phases: [1, 2, 3, 8], priority: 10,
    decisionNodes: [
      { id: 'DN-PRJ-MARGIN', phase: 1, title: 'حاشیه پروژه و ظرفیت' },
      { id: 'DN-PRJ-SCOPE', phase: 2, title: 'scope و ریسک تغییر دامنه' },
      { id: 'DN-PRJ-PROOF', phase: 3, title: 'اثبات تحویل پروژه' },
      { id: 'DN-PRJ-PIPELINE', phase: 8, title: 'پایپ‌لاین، milestone و وصول' },
    ],
    evidenceRequirements: ['PROJECT_COST', 'UTILIZATION', 'SCOPE_CHANGE', 'MILESTONE_PAYMENT'],
    calculations: ['project_margin', 'billable_utilization'],
    metrics: ['project_margin', 'utilization_rate', 'delivery_variance', 'days_sales_outstanding'],
    risks: ['scope_creep', 'capacity_overcommitment', 'collection_delay'],
    outputSections: ['project_economics', 'delivery_proof'],
    gates: ['GATE-PROJECT-CAPACITY'],
    knowledgeDependencies: ['KB-PROJECT-ECONOMICS'],
  }),

  d({
    id: 'MOD-CHANNEL-PHYSICAL',
    title: 'Physical/local channel',
    axis: 'channelModel', values: ['PHYSICAL_FIRST', 'HYBRID', 'OMNICHANNEL'], phases: [2, 7, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-PHYS-CATCHMENT', phase: 2, title: 'catchment، پاخور یا booking' },
      { id: 'DN-PHYS-TOUCHPOINT', phase: 7, title: 'کاربرد هویت در محیط فیزیکی' },
      { id: 'DN-PHYS-LOCAL-GROWTH', phase: 8, title: 'جست‌وجوی محلی، referral و ظرفیت' },
    ],
    evidenceRequirements: ['CATCHMENT', 'FOOT_TRAFFIC_OR_BOOKINGS', 'LOCAL_REVIEWS'],
    metrics: ['foot_traffic', 'booking_rate', 'store_conversion', 'local_review_score'],
    risks: ['location_dependency', 'capacity_queue'],
    outputSections: ['physical_channel', 'local_activation'],
    gates: [],
    knowledgeDependencies: ['KB-LOCAL-CHANNEL'],
  }),
  d({
    id: 'MOD-CHANNEL-ONLINE',
    title: 'Online funnel',
    axis: 'channelModel', values: ['ONLINE_FIRST', 'HYBRID', 'OMNICHANNEL'], phases: [2, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-ONLINE-ACQUISITION', phase: 2, title: 'منبع ترافیک و هزینه جذب' },
      { id: 'DN-ONLINE-FUNNEL', phase: 8, title: 'فانل، conversion و owned audience' },
    ],
    evidenceRequirements: ['TRAFFIC_SOURCE', 'FUNNEL_STEPS', 'CONVERSION', 'CAC'],
    metrics: ['sessions', 'lead_conversion', 'checkout_conversion', 'cac'],
    risks: ['single_platform_dependency', 'attribution_gap'],
    outputSections: ['online_funnel'],
    gates: [],
    knowledgeDependencies: ['KB-DIGITAL-FUNNEL'],
  }),

  d({
    id: 'MOD-GEO-LOCAL',
    title: 'Local geography',
    axis: 'geography', values: ['NEIGHBORHOOD', 'CITY'], phases: [1, 2, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-LOCAL-CATCHMENT', phase: 1, title: 'شعاع واقعی بازار' },
      { id: 'DN-LOCAL-COMPETITION', phase: 2, title: 'رقابت و رفتار محلی' },
      { id: 'DN-LOCAL-DISCOVERY', phase: 8, title: 'map/referral/local discovery' },
    ],
    evidenceRequirements: ['PRIMARY_LOCATION', 'CATCHMENT_RADIUS', 'LOCAL_COMPETITORS'],
    metrics: ['local_leads', 'maps_rank', 'local_repeat_rate'],
    risks: ['overestimated_catchment'],
    outputSections: ['local_market'],
    gates: [],
    knowledgeDependencies: ['KB-LOCAL-MARKET'],
  }),
  d({
    id: 'MOD-GEO-CROSSBORDER',
    title: 'Regional/global market',
    axis: 'geography', values: ['REGIONAL', 'REGIONAL_INTERNATIONAL', 'GLOBAL'], phases: [1, 2, 3, 5, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-XB-MARKET-ENTRY', phase: 1, title: 'کشور/بازار ورودی و امکان خدمت' },
      { id: 'DN-XB-LOCALIZATION', phase: 2, title: 'زبان، پرداخت و رقیب محلی' },
      { id: 'DN-XB-POSITIONING', phase: 3, title: 'تناسب جایگاه در بازار مقصد' },
      { id: 'DN-XB-LANGUAGE', phase: 5, title: 'زبان و ادعای قابل استفاده' },
      { id: 'DN-XB-OPERATIONS', phase: 8, title: 'تحویل، پشتیبانی و ورود بازار' },
    ],
    evidenceRequirements: ['TARGET_COUNTRY', 'PAYMENT_FEASIBILITY', 'LOCALIZATION', 'CROSS_BORDER_COMPLIANCE'],
    metrics: ['market_entry_leads', 'cross_border_conversion'],
    risks: ['payment_restriction', 'localization_failure', 'cross_border_compliance'],
    outputSections: ['market_entry'],
    gates: ['GATE-XB-FEASIBILITY'],
    knowledgeDependencies: ['KB-MARKET-ENTRY'],
  }),

  d({
    id: 'MOD-REG-HIGH',
    title: 'Regulated/high-trust claims',
    axis: 'regulatoryProfile', values: ['REGULATED', 'HIGHLY_REGULATED', 'HIGH_TRUST'], phases: [1, 2, 3, 5, 6, 8], priority: 5,
    decisionNodes: [
      { id: 'DN-REG-CONSTRAINTS', phase: 1, title: 'مجوز و محدودیت ادعا' },
      { id: 'DN-REG-EVIDENCE', phase: 2, title: 'منبع معتبر و وضعیت freshness' },
      { id: 'DN-REG-POSITIONING', phase: 3, title: 'مرز جایگاه و ادعاهای مجاز' },
      { id: 'DN-REG-MESSAGING', phase: 5, title: 'بازبینی claimهای حساس' },
      { id: 'DN-REG-NAMING', phase: 6, title: 'استعلام و محدودیت حقوقی نام' },
      { id: 'DN-REG-ACTIVATION', phase: 8, title: 'فعال‌سازی منطبق با محدودیت‌ها' },
    ],
    evidenceRequirements: ['AUTHORITATIVE_RULE', 'LICENSE_STATUS', 'CLAIM_SUPPORT'],
    metrics: ['compliance_incidents', 'claim_review_pass_rate'],
    risks: ['unsupported_sensitive_claim', 'stale_regulation', 'license_gap'],
    outputSections: ['compliance_constraints'],
    gates: ['GATE-AUTHORITATIVE-SOURCE-FRESH', 'GATE-SENSITIVE-CLAIM-SUPPORTED'],
    knowledgeDependencies: ['KB-COMPLIANCE'],
  }),

  d({
    id: 'MOD-FOUNDER-PUBLIC',
    title: 'Founder-led/public brand',
    axis: 'founderRole', values: ['FOUNDER_LED', 'PERSONAL_PRIMARY', 'DUAL'], phases: [4, 5, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-FOUNDER-PERSONA', phase: 4, title: 'مرز شخصیت فرد و برند' },
      { id: 'DN-FOUNDER-VOICE', phase: 5, title: 'صدای بنیان‌گذار و صدای سازمان' },
      { id: 'DN-FOUNDER-THOUGHT-LEADERSHIP', phase: 8, title: 'thought leadership و ریسک وابستگی' },
    ],
    evidenceRequirements: ['FOUNDER_VISIBILITY', 'FOUNDER_CREDIBILITY', 'TRANSFERABILITY_RISK'],
    metrics: ['founder_attributed_leads', 'owned_audience'],
    risks: ['founder_dependency', 'succession_risk'],
    outputSections: ['founder_brand'],
    gates: [],
    knowledgeDependencies: ['KB-FOUNDER-BRAND'],
  }),
  d({
    id: 'MOD-FOUNDER-INSTITUTIONAL',
    title: 'Institutional/non-public founder',
    axis: 'founderRole', values: ['NOT_PUBLIC', 'SUPPORTING', 'EXECUTIVE_LED', 'INVESTOR_LED'], phases: [4, 5, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-INST-PERSONA', phase: 4, title: 'شخصیت سازمان مستقل از فرد' },
      { id: 'DN-INST-VOICE', phase: 5, title: 'لحن سازمانی و proof system' },
      { id: 'DN-INST-AUTHORITY', phase: 8, title: 'اعتبار سازمانی، case study و رسانه' },
    ],
    evidenceRequirements: ['ORGANIZATIONAL_PROOF', 'TEAM_AUTHORITY'],
    metrics: ['brand_attributed_leads', 'case_study_conversion'],
    risks: ['weak_institutional_proof'],
    outputSections: ['institutional_brand'],
    gates: [],
    knowledgeDependencies: ['KB-ORGANIZATIONAL-BRAND'],
  }),

  d({
    id: 'MOD-SCALE-MICRO',
    title: 'Solo/micro capacity',
    axis: 'scale', values: ['SOLO', 'MICRO'], phases: [1, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-MICRO-CAPACITY', phase: 1, title: 'ظرفیت فردی، نقدینگی و bottleneck بنیان‌گذار' },
      { id: 'DN-MICRO-PRIORITY', phase: 8, title: 'اولویت محدود و اجرای کم‌هزینه' },
    ],
    evidenceRequirements: ['FOUNDER_CAPACITY', 'AVAILABLE_BUDGET'],
    metrics: ['capacity_utilization', 'cash_runway'],
    risks: ['founder_bottleneck', 'overcommitment'],
    outputSections: ['micro_capacity'],
    gates: ['GATE-MICRO-CAPACITY'],
    knowledgeDependencies: ['KB-MICRO-OPERATIONS'],
  }),
  d({
    id: 'MOD-SCALE-ENTERPRISE',
    title: 'Enterprise/holding governance',
    axis: 'scale', values: ['LARGE', 'ENTERPRISE', 'HOLDING'], phases: [1, 3, 7, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-ENT-GOVERNANCE', phase: 1, title: 'مالکیت تصمیم و governance' },
      { id: 'DN-ENT-PORTFOLIO', phase: 3, title: 'سازگاری استراتژی در واحدها/برندها' },
      { id: 'DN-ENT-ROLLOUT', phase: 7, title: 'rollout و کنترل استاندارد' },
      { id: 'DN-ENT-REPORTING', phase: 8, title: 'گزارش‌گیری، handoff و change management' },
    ],
    evidenceRequirements: ['DECISION_RIGHTS', 'BUSINESS_UNITS', 'ROLLOUT_OWNERS'],
    metrics: ['rollout_compliance', 'approval_cycle_time'],
    risks: ['governance_delay', 'brand_variance'],
    outputSections: ['enterprise_governance'],
    gates: ['GATE-DECISION-RIGHTS'],
    knowledgeDependencies: ['KB-ENTERPRISE-GOVERNANCE'],
  }),

  d({
    id: 'MOD-BRANCH-MULTI',
    title: 'Multi-branch/franchise governance',
    axis: 'branchStructure', values: ['MULTI_BRANCH', 'FRANCHISE', 'DISTRIBUTED', 'MIXED'], phases: [1, 7, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-BRANCH-RIGHTS', phase: 1, title: 'حق تصمیم مرکزی/محلی' },
      { id: 'DN-BRANCH-STANDARDS', phase: 7, title: 'استاندارد هویت و variance مجاز' },
      { id: 'DN-BRANCH-ROLLOUT', phase: 8, title: 'rollout، audit و performance by branch' },
    ],
    evidenceRequirements: ['BRANCH_LIST', 'CENTRAL_LOCAL_RIGHTS', 'BRANCH_VARIANCE'],
    metrics: ['branch_variance', 'rollout_compliance'],
    risks: ['local_drift', 'franchise_noncompliance'],
    outputSections: ['branch_governance'],
    gates: [],
    knowledgeDependencies: ['KB-MULTI-BRANCH'],
  }),

  d({
    id: 'MOD-MATURITY-VALIDATION',
    title: 'Idea/pre-launch validation',
    axis: 'maturity', values: ['IDEA', 'PRE_LAUNCH', 'MVP'], phases: [1, 2, 3, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-VAL-HYPOTHESIS', phase: 1, title: 'فرضیه و شرط ابطال' },
      { id: 'DN-VAL-EVIDENCE', phase: 2, title: 'آزمون بازار و شواهد رفتاری' },
      { id: 'DN-VAL-POSITIONING', phase: 3, title: 'جایگاه موقت تا اثبات' },
      { id: 'DN-VAL-LAUNCH', phase: 8, title: 'launch experiment و stop condition' },
    ],
    evidenceRequirements: ['HYPOTHESIS', 'VALIDATION_SAMPLE', 'BEHAVIORAL_SIGNAL'],
    metrics: ['validation_conversion', 'willingness_to_pay'],
    risks: ['premature_brand_lock_in'],
    outputSections: ['validation_plan'],
    gates: ['GATE-VALIDATE-BEFORE-SCALE'],
    knowledgeDependencies: ['KB-VALIDATION'],
  }),
  d({
    id: 'MOD-MATURITY-REBRAND',
    title: 'Rebrand/transformation',
    axis: 'maturity', values: ['REBRAND', 'TRANSFORMATION'], phases: [1, 2, 3, 6, 7, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-REB-EQUITY', phase: 1, title: 'دارایی فعلی و چیزهایی که نباید از دست برود' },
      { id: 'DN-REB-PERCEPTION', phase: 2, title: 'ادراک فعلی بازار' },
      { id: 'DN-REB-MIGRATION', phase: 3, title: 'فاصله جایگاه فعلی تا هدف' },
      { id: 'DN-REB-NAMING', phase: 6, title: 'ریسک مهاجرت نام' },
      { id: 'DN-REB-VISUAL', phase: 7, title: 'انتقال equity بصری' },
      { id: 'DN-REB-ROLLOUT', phase: 8, title: 'برنامه migration و communication' },
    ],
    evidenceRequirements: ['CURRENT_EQUITY', 'CUSTOMER_RECOGNITION', 'LEGACY_ASSETS'],
    metrics: ['recognition_retention', 'migration_completion'],
    risks: ['equity_loss', 'customer_confusion'],
    outputSections: ['rebrand_migration'],
    gates: ['GATE-REBRAND-EQUITY-REVIEW'],
    knowledgeDependencies: ['KB-REBRAND'],
  }),

  d({
    id: 'MOD-SALES-TENDER',
    title: 'Tender/procurement sales motion',
    axis: 'salesMotion', values: ['TENDER', 'FIELD_ENTERPRISE'], phases: [2, 3, 8], priority: 15,
    decisionNodes: [
      { id: 'DN-TENDER-ELIGIBILITY', phase: 2, title: 'اهلیت، اسناد و procurement' },
      { id: 'DN-TENDER-PROOF', phase: 3, title: 'مدرک فنی و business case' },
      { id: 'DN-TENDER-PIPELINE', phase: 8, title: 'زمان‌بندی مناقصه و follow-up' },
    ],
    evidenceRequirements: ['ELIGIBILITY', 'PROCUREMENT_DOCUMENTS', 'REFERENCE_PROJECTS'],
    metrics: ['qualified_tenders', 'tender_win_rate', 'procurement_cycle'],
    risks: ['eligibility_gap', 'long_procurement_cycle'],
    outputSections: ['tender_motion'],
    gates: ['GATE-TENDER-ELIGIBILITY'],
    knowledgeDependencies: ['KB-TENDER'],
  }),

  d({
    id: 'MOD-CYCLE-LONG',
    title: 'Long purchase cycle',
    axis: 'purchaseCycle', values: ['LONG_MONTHS', 'ANNUAL_MULTI_YEAR'], phases: [2, 3, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-LONG-PROOF', phase: 2, title: 'proof و stakeholder evidence' },
      { id: 'DN-LONG-NURTURE', phase: 3, title: 'پیام و proof برای مراحل تصمیم' },
      { id: 'DN-LONG-PIPELINE', phase: 8, title: 'nurture، stage و next step' },
    ],
    evidenceRequirements: ['STAKEHOLDER_MAP', 'OBJECTIONS', 'PROOF_ASSETS'],
    metrics: ['stage_conversion', 'sales_cycle_days'],
    risks: ['pipeline_stall'],
    outputSections: ['long_cycle_nurture'],
    gates: [],
    knowledgeDependencies: ['KB-LONG-SALES-CYCLE'],
  }),

  d({
    id: 'MOD-REL-RECURRING',
    title: 'Ongoing customer relationship',
    axis: 'relationshipModel', values: ['REPEAT_HABITUAL', 'CONTRACTUAL_RETAINER', 'ACCOUNT_MANAGED', 'MEMBERSHIP', 'COMMUNITY', 'MIXED'], phases: [2, 3, 8], priority: 30,
    decisionNodes: [
      { id: 'DN-REL-REPEAT', phase: 2, title: 'دلیل بازگشت یا renewal' },
      { id: 'DN-REL-PROMISE', phase: 3, title: 'وعده‌ای که در طول رابطه حفظ می‌شود' },
      { id: 'DN-REL-RETENTION', phase: 8, title: 'retention، expansion و referral' },
    ],
    evidenceRequirements: ['REPEAT_OR_RENEWAL', 'RELATIONSHIP_TOUCHPOINTS'],
    metrics: ['retention_rate', 'repeat_rate', 'referral_rate'],
    risks: ['relationship_decay'],
    outputSections: ['relationship_system'],
    gates: [],
    knowledgeDependencies: ['KB-RETENTION'],
  }),

  d({
    id: 'MOD-OPS-HIGH',
    title: 'High operational complexity',
    axis: 'operationalComplexity', values: ['HIGH', 'SEVERE'], phases: [1, 2, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-OPS-BOTTLENECK', phase: 1, title: 'گلوگاه ظرفیت و وابستگی فرایندی' },
      { id: 'DN-OPS-PROOF', phase: 2, title: 'توان تحویل واقعی در مقابل وعده بازار' },
      { id: 'DN-OPS-SCALE', phase: 8, title: 'capacity planning و quality control' },
    ],
    evidenceRequirements: ['PROCESS_CAPACITY', 'BOTTLENECK', 'QUALITY_VARIANCE'],
    metrics: ['capacity_utilization', 'defect_rate', 'lead_time'],
    risks: ['promise_delivery_gap', 'capacity_failure'],
    outputSections: ['operational_constraints'],
    gates: ['GATE-CAPACITY-BEFORE-GROWTH'],
    knowledgeDependencies: ['KB-OPERATIONS'],
  }),

  d({
    id: 'MOD-BRAND-PORTFOLIO',
    title: 'Portfolio brand architecture',
    axis: 'brandArchitecture', values: ['MASTERBRAND', 'SUB_BRAND', 'ENDORSED', 'HOUSE_OF_BRANDS'], phases: [3, 6, 7, 8], priority: 20,
    decisionNodes: [
      { id: 'DN-BA-ROLE', phase: 3, title: 'نقش هر برند در پرتفوی' },
      { id: 'DN-BA-NAMING', phase: 6, title: 'قواعد نام‌گذاری بین برندها' },
      { id: 'DN-BA-VISUAL', phase: 7, title: 'سیستم بصری و endorsement' },
      { id: 'DN-BA-ROLLOUT', phase: 8, title: 'migration و governance پرتفوی' },
    ],
    evidenceRequirements: ['BRAND_PORTFOLIO', 'ENDORSEMENT_RULES'],
    metrics: ['portfolio_consistency'],
    risks: ['portfolio_confusion', 'brand_cannibalization'],
    outputSections: ['brand_architecture'],
    gates: [],
    knowledgeDependencies: ['KB-BRAND-ARCHITECTURE'],
  }),
]);

export const ALL_DECISION_MODULES = Object.freeze([...DECISION_MODULES, ...DOMAIN_DECISION_MODULES]);

const ids = ALL_DECISION_MODULES.map(module => module.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate Decision Module IDs');

export const DECISION_MODULES_BY_ID = Object.freeze(Object.fromEntries(ALL_DECISION_MODULES.map(module => [module.id, module])));

export function validateDecisionModuleRegistry() {
  const errors = [];
  for (const module of ALL_DECISION_MODULES) {
    const validation = validateDecisionModule(module);
    errors.push(...validation.errors.map(error => `${module.id}: ${error}`));
  }

  const decisionNodeIds = [];
  for (const module of DECISION_MODULES) for (const node of module.decisionNodes) decisionNodeIds.push(node.id);
  const duplicates = decisionNodeIds.filter((id, index) => decisionNodeIds.indexOf(id) !== index);
  for (const id of [...new Set(duplicates)]) errors.push(`Duplicate canonical Decision Node ID: ${id}`);

  const domainValidation = validateDomainDecisionModules();
  errors.push(...domainValidation.errors);
  return { valid: errors.length === 0, errors };
}

export function resolveActiveDecisionModules(canonicalContext) {
  return ALL_DECISION_MODULES
    .filter(module => isModuleActive(module, canonicalContext))
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
}
