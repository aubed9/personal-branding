import { defineDecisionModule, validateDecisionModule } from './contract.js';

const d = defineDecisionModule;
const text = ctx => String(ctx?.businessTypeTitleFa || '').toLowerCase();
const bt = ctx => String(ctx?.businessTypeId || '').toUpperCase();
const ind = ctx => String(ctx?.industryId || '').toUpperCase();
const arch = ctx => String(ctx?.primaryArchetype || '').toUpperCase();

const includesAny = (value, needles) => needles.some(needle => value.includes(needle));

export function isCafeDomain(ctx) {
  return ['BT-0066', 'BT-0067'].includes(bt(ctx)) ||
    includesAny(text(ctx), ['کافه', 'رستری', 'قهوه']);
}

export function isLocalRetailDomain(ctx) {
  if (isCafeDomain(ctx)) return false;
  return ['LOCAL_RETAIL', 'PHYSICAL_RETAIL'].includes(arch(ctx)) || bt(ctx) === 'BT-0003';
}

export function isTaxSaasDomain(ctx) {
  return ['BT-0166', 'BT-0171'].includes(bt(ctx)) ||
    (ind(ctx) === 'IND-06' && includesAny(text(ctx), ['حسابداری', 'مالیاتی', 'مودیان', 'tax']));
}

export function isGeneralSaasDomain(ctx) {
  return ind(ctx) === 'IND-06' && !isTaxSaasDomain(ctx);
}

export function isBeautyDomain(ctx) {
  return ind(ctx) === 'IND-04' &&
    includesAny(text(ctx), ['سالن', 'زیبایی', 'آرایش', 'لیزر', 'پوست و مو', 'مراقبت مو']);
}

export function isMedicalDomain(ctx) {
  if (isBeautyDomain(ctx)) return false;
  return ind(ctx) === 'IND-04' && (
    bt(ctx) === 'BT-0100' ||
    includesAny(text(ctx), ['پزشکی', 'دندانپزشکی', 'درمان', 'بیمارستان', 'کلینیک'])
  );
}

export function isMachiningDomain(ctx) {
  return bt(ctx) === 'BT-0221' || ind(ctx) === 'IND-08' ||
    includesAny(text(ctx), ['قالب‌سازی', 'تراشکاری', 'ماشین‌کاری', 'سنبه', 'قطعات صنعتی']);
}

export function isGeneralManufacturingDomain(ctx) {
  return arch(ctx) === 'MANUFACTURER' && !isMachiningDomain(ctx);
}

const DOMAIN_CONTEXT = Object.freeze(['AXIS', 'BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE']);

export const DOMAIN_DECISION_MODULES = Object.freeze([
  d({
    id: 'MOD-DOMAIN-CAFE',
    title: 'Cafe / specialty coffee operating system',
    axis: 'offerType',
    values: ['SERVICE', 'EXPERIENCE', 'PHYSICAL_PRODUCT', 'MIXED'],
    phases: [1, 2, 3, 5, 7, 8],
    priority: 4,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isCafeDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-CAFE-ECONOMICS', phase: 1, title: 'Food Cost، گردش میز و ظرفیت ساعات اوج' },
      { id: 'DN-CAFE-TASTE-PROOF', phase: 2, title: 'ذائقه، تازگی رست و تجربه واقعی سالن' },
      { id: 'DN-CAFE-POSITIONING', phase: 3, title: 'تمایز طعمی، خاستگاه دانه و اتمسفر' },
      { id: 'DN-CAFE-STORY', phase: 5, title: 'روایت فنجان، خاستگاه و تجربه حسی' },
      { id: 'DN-CAFE-TOUCHPOINTS', phase: 7, title: 'منو، پاکت دانه، فنجان و فضای فیزیکی' },
      { id: 'DN-CAFE-RETENTION', phase: 8, title: 'کلوب مشتری، رویداد tasting و اشتراک دانه' },
    ],
    evidenceRequirements: ['FOOD_COST_PCT', 'TABLE_TURNOVER', 'PEAK_HOUR_CAPACITY', 'ROAST_FRESHNESS', 'ORIGIN_PROOF', 'LOCAL_REVIEW_THEMES'],
    metrics: ['food_cost_pct', 'table_turnover', 'average_ticket', 'repeat_visit_rate', 'bean_subscription_retention'],
    risks: ['taste_inconsistency', 'stale_inventory', 'peak_hour_service_failure'],
    outputSections: ['cafe_economics', 'cafe_experience', 'cafe_retention'],
    gates: ['GATE-CAFE-CAPACITY-ECONOMICS'],
    knowledgeDependencies: ['KB-DOMAIN-CAFE'],
  }),
  d({
    id: 'MOD-DOMAIN-LOCAL-RETAIL',
    title: 'Local physical retail operating system',
    axis: 'offerType',
    values: ['PHYSICAL_PRODUCT', 'SERVICE', 'MIXED'],
    phases: [1, 2, 3, 7, 8],
    priority: 5,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isLocalRetailDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-RETAIL-INVENTORY', phase: 1, title: 'گردش موجودی، حاشیه سود و سرمایه خوابیده' },
      { id: 'DN-RETAIL-ASSORTMENT', phase: 2, title: 'ترکیب کالا، موجودی و دلیل انتخاب فروشگاه' },
      { id: 'DN-RETAIL-POSITIONING', phase: 3, title: 'اعتماد، دسترسی و انتخاب سریع در نقطه فروش' },
      { id: 'DN-RETAIL-TOUCHPOINTS', phase: 7, title: 'قفسه، قیمت، بسته‌بندی و خوانایی نقطه فروش' },
      { id: 'DN-RETAIL-LOYALTY', phase: 8, title: 'خرید تکرار، باشگاه مشتری و مدیریت stockout' },
    ],
    evidenceRequirements: ['INVENTORY_TURN', 'CATEGORY_MARGIN', 'AVERAGE_BASKET', 'STOCKOUT_RATE', 'FOOT_TRAFFIC_CONVERSION'],
    metrics: ['inventory_turnover', 'gross_margin', 'average_order_value', 'stockout_rate', 'foot_traffic_conversion'],
    risks: ['dead_stock', 'stockout_loss', 'discount_dependency'],
    outputSections: ['retail_inventory', 'retail_assortment', 'retail_loyalty'],
    gates: ['GATE-RETAIL-INVENTORY-VISIBILITY'],
    knowledgeDependencies: ['KB-DOMAIN-LOCAL-RETAIL'],
  }),
  d({
    id: 'MOD-DOMAIN-TAX-SAAS',
    title: 'Iran tax/accounting SaaS domain',
    axis: 'offerType',
    values: ['DIGITAL_PRODUCT', 'PLATFORM', 'MIXED'],
    phases: [1, 2, 3, 5, 8],
    priority: 3,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isTaxSaasDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-TAX-SAAS-COMPLIANCE-SCOPE', phase: 1, title: 'دامنه اتصال مالیاتی و مرز مسئولیت محصول' },
      { id: 'DN-TAX-SAAS-FAILURE-MODES', phase: 2, title: 'خطاهای ارسال، اضطراب کاربر و workflow مودیان' },
      { id: 'DN-TAX-SAAS-PROOF', phase: 3, title: 'اثبات کاهش اصطکاک بدون تضمین نتیجه مالیاتی' },
      { id: 'DN-TAX-SAAS-MESSAGING', phase: 5, title: 'پیام روشن درباره قابلیت و محدودیت قانونی' },
      { id: 'DN-TAX-SAAS-UPDATES', phase: 8, title: 'پایش تغییرات مقررات و SLA به‌روزرسانی' },
    ],
    evidenceRequirements: ['TAX_INTEGRATION_COVERAGE', 'SUBMISSION_SUCCESS_RATE', 'REGULATION_UPDATE_PROCESS', 'ERROR_RECOVERY_TIME'],
    metrics: ['submission_success_rate', 'compliance_update_latency', 'mrr', 'logo_churn'],
    risks: ['stale_tax_rule', 'submission_failure', 'regulatory_dependency'],
    outputSections: ['tax_saas_compliance', 'tax_saas_proof', 'tax_saas_operations'],
    gates: ['GATE-TAX-SAAS-CURRENT-AUTHORITATIVE-RULE'],
    knowledgeDependencies: ['KB-DOMAIN-TAX-SAAS'],
  }),
  d({
    id: 'MOD-DOMAIN-SAAS-GENERAL',
    title: 'General SaaS adoption domain',
    axis: 'offerType',
    values: ['DIGITAL_PRODUCT', 'PLATFORM', 'MIXED'],
    phases: [1, 2, 3, 5, 8],
    priority: 6,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isGeneralSaasDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-SAAS-TTV', phase: 1, title: 'Time-to-Value و activation event' },
      { id: 'DN-SAAS-ONBOARDING', phase: 2, title: 'اصطکاک onboarding و ریزش اولیه' },
      { id: 'DN-SAAS-VALUE-PROOF', phase: 3, title: 'اثبات ارزش کاربردی در workflow' },
      { id: 'DN-SAAS-EXPLAIN', phase: 5, title: 'توضیح قابلیت بدون jargon فنی' },
      { id: 'DN-SAAS-ADOPTION', phase: 8, title: 'adoption، expansion و support loop' },
    ],
    evidenceRequirements: ['TIME_TO_VALUE', 'ACTIVATION_FUNNEL', 'FEATURE_ADOPTION', 'SUPPORT_LOAD'],
    metrics: ['activation_rate', 'trial_conversion', 'feature_adoption', 'support_resolution_time'],
    risks: ['onboarding_friction', 'feature_overload', 'weak_adoption'],
    outputSections: ['saas_onboarding', 'saas_adoption'],
    gates: ['GATE-SAAS-VALUE-EVENT'],
    knowledgeDependencies: ['KB-DOMAIN-SAAS-GENERAL'],
  }),
  d({
    id: 'MOD-DOMAIN-MEDICAL',
    title: 'Medical / dental clinic trust and safety',
    axis: 'offerType',
    values: ['SERVICE', 'EXPERIENCE', 'MIXED'],
    phases: [1, 2, 3, 5, 7, 8],
    priority: 2,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isMedicalDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-MEDICAL-SCOPE', phase: 1, title: 'دامنه خدمت، مجوز و ظرفیت درمان' },
      { id: 'DN-MEDICAL-TRUST', phase: 2, title: 'اعتماد بیمار، consent و شواهد درمانی' },
      { id: 'DN-MEDICAL-CLAIMS', phase: 3, title: 'مرز ادعای پزشکی و نتیجه قابل اثبات' },
      { id: 'DN-MEDICAL-MESSAGE', phase: 5, title: 'پیام ایمن، دقیق و بدون ادعای درمانی مطلق' },
      { id: 'DN-MEDICAL-VISUAL', phase: 7, title: 'نشانه‌های پاکیزگی، دسترس‌پذیری و اعتماد بالینی' },
      { id: 'DN-MEDICAL-PATIENT-JOURNEY', phase: 8, title: 'نوبت، انتظار، follow-up و مدیریت شکایت بیمار' },
    ],
    evidenceRequirements: ['LICENSE_SCOPE', 'PATIENT_CONSENT', 'TREATMENT_PROOF', 'STERILITY_PROCESS', 'WAIT_TIME'],
    metrics: ['appointment_show_rate', 'wait_time', 'treatment_plan_acceptance', 'complaint_rate'],
    risks: ['unsupported_medical_claim', 'patient_safety_risk', 'sterility_failure'],
    outputSections: ['medical_claim_safety', 'patient_trust', 'patient_journey'],
    gates: ['GATE-MEDICAL-CLAIM-EVIDENCE'],
    knowledgeDependencies: ['KB-DOMAIN-MEDICAL'],
  }),
  d({
    id: 'MOD-DOMAIN-BEAUTY',
    title: 'Beauty / salon service domain',
    axis: 'offerType',
    values: ['SERVICE', 'EXPERIENCE', 'MIXED'],
    phases: [1, 2, 3, 5, 7, 8],
    priority: 3,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isBeautyDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-BEAUTY-CAPACITY', phase: 1, title: 'ظرفیت صندلی، نوبت و مواد مصرفی' },
      { id: 'DN-BEAUTY-SAFETY', phase: 2, title: 'کیفیت مواد، حساسیت و شفافیت قیمت' },
      { id: 'DN-BEAUTY-PROOF', phase: 3, title: 'نتیجه قابل نمایش بدون اغراق یا آسیب' },
      { id: 'DN-BEAUTY-MESSAGE', phase: 5, title: 'انتظار واقع‌بینانه از نتیجه و مراقبت' },
      { id: 'DN-BEAUTY-VISUAL', phase: 7, title: 'فضای فیزیکی، before/after و هویت حسی' },
      { id: 'DN-BEAUTY-REBOOK', phase: 8, title: 'رزرو مجدد، loyalty و نمونه‌کار رضایت‌محور' },
    ],
    evidenceRequirements: ['CHAIR_CAPACITY', 'MATERIAL_QUALITY_PROOF', 'PRICE_TRANSPARENCY', 'CLIENT_CONSENT', 'REBOOK_RATE'],
    metrics: ['chair_utilization', 'rebook_rate', 'average_service_ticket', 'complaint_rate'],
    risks: ['material_quality_risk', 'overpromised_result', 'appointment_delay'],
    outputSections: ['beauty_capacity', 'beauty_proof', 'beauty_loyalty'],
    gates: ['GATE-BEAUTY-SAFETY-PROOF'],
    knowledgeDependencies: ['KB-DOMAIN-BEAUTY'],
  }),
  d({
    id: 'MOD-DOMAIN-MACHINING',
    title: 'Machining / tooling B2B manufacturing',
    axis: 'offerType',
    values: ['PHYSICAL_PRODUCT', 'SERVICE', 'MIXED'],
    phases: [1, 2, 3, 5, 7, 8],
    priority: 2,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isMachiningDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-MACHINING-CAPACITY', phase: 1, title: 'ظرفیت ماشین، MOQ و بهای متریال' },
      { id: 'DN-MACHINING-TOLERANCE', phase: 2, title: 'تلرانس، QC و ریسک توقف خط مشتری' },
      { id: 'DN-MACHINING-PROOF', phase: 3, title: 'اثبات دقت، تحویل و vendor qualification' },
      { id: 'DN-MACHINING-MESSAGE', phase: 5, title: 'پیام فنی مبتنی بر مشخصات و داده QC' },
      { id: 'DN-MACHINING-VISUAL', phase: 7, title: 'کاتالوگ مهندسی، پلاک و مشخصات قطعه' },
      { id: 'DN-MACHINING-VENDOR', phase: 8, title: 'vendor list، بازدید فنی و پاسخ بحران کیفیت' },
    ],
    evidenceRequirements: ['MACHINE_CAPACITY', 'MOQ', 'TOLERANCE_CAPABILITY', 'QC_RECORD', 'VENDOR_REQUIREMENTS'],
    metrics: ['first_pass_yield', 'on_time_delivery', 'scrap_rate', 'tolerance_nonconformance'],
    risks: ['tolerance_failure', 'line_stop_liability', 'material_variance'],
    outputSections: ['machining_capability', 'engineering_proof', 'vendor_growth'],
    gates: ['GATE-MACHINING-CAPABILITY-PROOF'],
    knowledgeDependencies: ['KB-DOMAIN-MACHINING'],
  }),
  d({
    id: 'MOD-DOMAIN-MANUFACTURING',
    title: 'General B2B manufacturing operations',
    axis: 'offerType',
    values: ['PHYSICAL_PRODUCT', 'SERVICE', 'MIXED'],
    phases: [1, 2, 3, 5, 7, 8],
    priority: 6,
    contextDimensions: DOMAIN_CONTEXT,
    activation: isGeneralManufacturingDomain,
    prerequisites: ['BUSINESS_TYPE', 'INDUSTRY', 'ARCHETYPE', 'AXIS:offerType'],
    decisionNodes: [
      { id: 'DN-MFG-CAPACITY', phase: 1, title: 'ظرفیت خط، yield و بهای تولید' },
      { id: 'DN-MFG-QUALITY', phase: 2, title: 'کیفیت، lead time و نیاز خریدار صنعتی' },
      { id: 'DN-MFG-PROOF', phase: 3, title: 'اثبات کیفیت و قابلیت تحویل پایدار' },
      { id: 'DN-MFG-MESSAGE', phase: 5, title: 'پیام B2B مبتنی بر کیفیت و قابلیت تامین' },
      { id: 'DN-MFG-VISUAL', phase: 7, title: 'کاتالوگ محصول، مشخصات فنی و بسته‌بندی صنعتی' },
      { id: 'DN-MFG-GROWTH', phase: 8, title: 'کانال B2B، distributor و برنامه ظرفیت' },
    ],
    evidenceRequirements: ['LINE_CAPACITY', 'YIELD_RATE', 'LEAD_TIME', 'QUALITY_RECORD', 'SUPPLY_RELIABILITY'],
    metrics: ['yield_rate', 'on_time_delivery', 'lead_time', 'defect_rate'],
    risks: ['capacity_shortfall', 'quality_variance', 'supplier_dependency'],
    outputSections: ['manufacturing_capacity', 'manufacturing_quality', 'b2b_supply_growth'],
    gates: ['GATE-MFG-CAPACITY-QUALITY'],
    knowledgeDependencies: ['KB-DOMAIN-MANUFACTURING'],
  }),
]);

export function validateDomainDecisionModules() {
  const errors = [];
  for (const module of DOMAIN_DECISION_MODULES) {
    const validation = validateDecisionModule(module);
    errors.push(...validation.errors.map(error => `${module.id}: ${error}`));
  }
  return { valid: errors.length === 0, errors };
}
