import fs from 'fs';
import path from 'path';

const registryPath = path.resolve('wiki/source-registry.json');
const data = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const foundationsDoc = fs.readFileSync(path.resolve('knowledge_base/wiki/09_the_30_canonical_foundations.md'), 'utf8');
const sections = foundationsDoc.split(/####\s+/).slice(1);

const tagMap = {
  1: ['sociology', 'cultural_capital', 'habitus', 'symbolic_capital', 'premium_positioning', 'bourdieu'],
  2: ['sociology', 'structuration', 'agency_and_structure', 'routine_behavior', 'giddens'],
  3: ['innovation_diffusion', 'chasm', 'adoption_curve', 'rogers', 'early_adopters'],
  4: ['cultural_dimensions', 'hofstede', 'uncertainty_avoidance', 'collectivism', 'iran_culture'],
  5: ['microeconomics', 'price_elasticity', 'consumer_surplus', 'price_discrimination', 'switching_costs', 'varian'],
  6: ['macroeconomics', 'inflation', 'opportunity_cost', 'disposable_income', 'mankiw'],
  7: ['behavioral_economics', 'cognitive_bias', 'system_1_system_2', 'loss_aversion', 'anchoring', 'peak_end_rule', 'kahneman'],
  8: ['nudge', 'choice_architecture', 'default_bias', 'mental_accounting', 'thaler_sunstein'],
  9: ['competitive_strategy', 'five_forces', 'generic_strategies', 'differentiation', 'cost_leadership', 'value_chain', 'porter'],
  10: ['strategy_kernel', 'diagnosis', 'guiding_policy', 'coherent_actions', 'focus', 'rumelt'],
  11: ['disruptive_innovation', 'low_end_foothold', 'sustaining_innovation', 'christensen'],
  12: ['jobs_to_be_done', 'jtbd', 'customer_struggle', 'functional_emotional_social_jobs', 'christensen'],
  13: ['mom_test', 'customer_validation', 'interviewing', 'evidence_based_validation', 'fitzpatrick'],
  14: ['value_proposition', 'customer_profile', 'value_map', 'pain_relievers', 'gain_creators', 'osterwalder'],
  15: ['brand_equity', 'cbbe_pyramid', 'brand_salience', 'brand_resonance', 'keller'],
  16: ['brand_equity', 'brand_identity_system', 'brand_awareness', 'perceived_quality', 'brand_loyalty', 'aaker'],
  17: ['how_brands_grow', 'mental_availability', 'physical_availability', 'distinctive_assets', 'sharp'],
  18: ['brand_identity_prism', 'physique', 'personality', 'culture', 'relationship', 'reflection', 'self_image', 'kapferer'],
  19: ['marketing_management', 'stp', 'segmentation', 'targeting', 'positioning', 'marketing_mix_4p', 'kotler'],
  20: ['behavioral_science', 'implicit_goals', 'explicit_goals', 'neuro_marketing', 'autopilot', 'barden'],
  21: ['influence', 'persuasion', 'reciprocity', 'social_proof', 'authority', 'scarcity', 'cialdini'],
  22: ['purple_cow', 'remarkable_product', 'permission_marketing', 'smallest_viable_market', 'godin'],
  23: ['spin_selling', 'situation_problem_implication_need_payoff', 'complex_sales', 'b2b_sales', 'rackham'],
  24: ['challenger_sale', 'commercial_teaching', 'tailoring_for_resonance', 'taking_control', 'dixon_adamson'],
  25: ['negotiation', 'tactical_empathy', 'mirroring', 'labeling', 'calibrated_questions', 'voss'],
  26: ['net_promoter_score', 'nps', 'customer_loyalty', 'good_profits_bad_profits', 'reichheld'],
  27: ['customer_centricity', 'customer_lifetime_value', 'clv', 'strategic_customers', 'fader'],
  28: ['management_principles', 'effectiveness_vs_efficiency', 'creating_a_customer', 'innovation_marketing', 'drucker'],
  29: ['high_output_management', 'managerial_leverage', 'paired_indicators', 'okr_mbo', 'grove'],
  30: ['unit_economics', 'cac_payback', 'ltv_cac_ratio', 'theory_of_constraints', 'toc', 'corporate_finance', 'skok_goldratt_brealey']
};

sections.forEach((sec, idx) => {
  const num = idx + 1;
  const id = 'SRC-FOUNDATION-' + String(num).padStart(2, '0');
  const src = data.sources[id];
  if (!src) return;

  const layerMatch = sec.match(/\*\s+\*\*لایه دانشی:\*\*\s*([^\r\n]+)/);
  const conceptMatch = sec.match(/\*\s+\*\*مفهوم کلیدی:\*\*\s*([^\r\n]+)/);
  const ruleMatch = sec.match(/\*\s+\*\*قانون تصمیم‌گیری:\*\*\s*([^\r\n]+)/);
  const appMatch = sec.match(/\*\s+\*\*کاربرد:\*\*\s*([^\r\n]+)/);

  src.knowledge_layer = layerMatch ? layerMatch[1].trim() : (num === 30 ? 'L1/L2/L3 (مالی شرکت‌ها، گلوگاه‌های عملیاتی و اقتصاد واحد مدرن)' : '');
  src.core_concept = conceptMatch ? conceptMatch[1].trim() : (num === 30 ? 'ارزش فعلی خالص (NPV)، تئوری محدودیت‌ها (TOC) و اقتصاد واحد (Unit Economics: LTV, CAC, Payback)' : '');
  src.decision_rule = ruleMatch ? ruleMatch[1].trim() : (num === 30 ? 'نرخ سوزاندن پول و دوره بازگشت هزینه جذب (Payback) تعیین‌کننده بقای کسب‌وکار است؛ کمپین‌های بدون هماهنگی با گلوگاه ارزش برند را تخریب می‌کنند.' : '');
  src.application = appMatch ? appMatch[1].trim() : (num === 30 ? 'راستی‌آزمایی طرح‌های برندینگ در بستر صورت مالی واقعی و امکان‌سنجی حاشیه سود.' : '');
  src.tags = tagMap[num] || [];
  src.summary = `اثر بنیادین «${src.title}» به نویسندگی ${src.author_or_institution}. تمرکز بر مفهوم ${src.core_concept}. قاعده تصمیم‌گیری: ${src.decision_rule}`;
});

// Enrich Iranian source families
const iranFamilies = {
  'SRC-IR-SCI-FAMILY': {
    summary: 'درگاه ملی آمار ایران (amar.org.ir) — مرجع رسمی نرخ تورم، بودجه خانوار دهک‌های درآمدی، هرم جمعیتی و اشتغال کشور.',
    key_indicators: ['نرخ تورم CPI ماهانه و سالانه', 'گزارش هزینه و درآمد خانوار دهک‌های شهری/روستایی', 'ضریب جینی و شکاف طبقاتی', 'هرم سنی و جمعیت فعال اقتصادی'],
    strategic_utility: 'تعیین سهم از جیب (Share of Wallet) دهک‌های هدف و واقع‌سنجی بازار بالقوه در فازهای ۱، ۲ و ۳.',
    tags: ['iran_macro', 'cpi', 'inflation', 'demographics', 'household_budget', 'sci']
  },
  'SRC-IR-CBI-FAMILY': {
    summary: 'بانک مرکزی جمهوری اسلامی ایران (cbi.ir) — مرجع سیاست‌های پولی، پایه پولی، حجم نقدینگی (M2)، نرخ رسمی ارز و شاخص قیمت تولیدکننده (PPI).',
    key_indicators: ['حجم نقدینگی و پایه پولی', 'نرخ ارز رسمی و روند نوسانات بازار', 'شاخص قیمت تولیدکننده (PPI)', 'نرخ بازده بدون ریسک و اعتبارات'],
    strategic_utility: 'سناریونویسی استهلاک ارزش سرمایه، قیمت‌گذاری زنجیره تامین و ضرورت پیش‌فروش یا ذخیره انبار در شرایط تورمی.',
    tags: ['cbi', 'monetary_policy', 'liquidity', 'fx_rates', 'ppi', 'inflation']
  },
  'SRC-IR-CODAL-FAMILY': {
    summary: 'سامانه جامع ناشران بورسی کدال (codal.ir) و بورس اوراق بهادار تهران — مرجع صورت‌های مالی حسابرسی‌شده شرکت‌های صنعتی و بازرگانی ایران.',
    key_indicators: ['حاشیه سود ناخالص و عملیاتی واقعی صنایع', 'دوره وصول مطالبات (DSO)', 'نسبت گردش دارایی‌ها و چرخه تبدیل وجه نقد (CCC)'],
    strategic_utility: 'استخراج بنچ‌مارک‌های واقعی حاشیه سود برای ارزیابی امکان‌پذیری مالی و قیمت‌گذاری در حلقه ۱۰ تصمیم‌گیری.',
    tags: ['codal', 'tsetmc', 'financial_statements', 'operating_margin', 'dso', 'cash_conversion']
  },
  'SRC-IR-ECOM-FAMILY': {
    summary: 'مرکز توسعه تجارت الکترونیکی (enamad.ir) — گزارش‌های سالانه تجارت الکترونیکی و آمار کسب‌وکارهای دارای نماد اعتماد الکترونیکی.',
    key_indicators: ['گردش مالی تجارت الکترونیکی کشور', 'تعداد کسب‌وکارهای دارای اینماد فعال', 'روش‌های تسویه حساب (آنلاین، پرداخت در محل، BNPL)'],
    strategic_utility: 'تدوین استراتژی کانال‌های دیجیتال و پیش‌بینی حجم معاملات آنلاین در فازهای ۱، ۲ و ۸.',
    tags: ['ecommerce', 'enamad', 'online_shopping', 'digital_commerce', 'merchant_trends']
  },
  'SRC-IR-SHAPARAK-FAMILY': {
    summary: 'شرکت شبکه الکترونیکی پرداخت کارت شاپرک (shaparak.ir) — ناشر آمار رسمی کلیه تراکنش‌های کارت‌خوان و درگاه پرداخت آنلاین در سراسر ایران.',
    key_indicators: ['تعداد و ارزش کل تراکنش‌های شاپرک', 'سهم درگاه‌های اینترنتی در برابر پایانه‌های فروشگاهی', 'ارزش اسمی و حقیقی سبد تراکنش'],
    strategic_utility: 'سنجش عمق تراکنش‌های پرداخت دیجیتال و الگوهای مصرف پولی جامعه ایران.',
    tags: ['shaparak', 'payments', 'pos', 'ipg', 'transaction_volume', 'card_payments']
  },
  'SRC-IR-DIGIKALA-FAMILY': {
    summary: 'گزارش‌های جامع سالانه پلتفرم دیجی‌کالا — بزرگ‌ترین پلتفرم خرده‌فروشی آنلاین ایران و سنجه رفتار سبد خرید مصرف‌کننده دیجیتال.',
    key_indicators: ['سهم FMCG در برابر کالای دیجیتال و پوشاک', 'تغییر سبد به سمت کالاهای جایگزین ارزان‌تر (Down-trading)', 'ساعات اوج خرید و الگوهای جستجوی کاربران'],
    strategic_utility: 'سنجش آمادگی مشتری برای خرید آنلاین و حساسیت قیمتی در دسته‌بندی کالاها.',
    tags: ['digikala', 'retail_ecommerce', 'fmcg', 'consumer_behavior', 'down_trading', 'e-commerce']
  },
  'SRC-IR-BAZAAR-FAMILY': {
    summary: 'گزارش‌های عملکرد سالانه کافه‌بازار — بزرگ‌ترین بازارگاه برنامه‌ها و بازی‌های موبایلی اندروید در ایران.',
    key_indicators: ['سهم نسخه‌های سیستم‌عامل اندروید در ایران', 'توزیع جغرافیایی کاربران در استان‌های کشور', 'میانگین هزینه‌کرد خریدهای درون‌برنامه‌ای و اشتراک'],
    strategic_utility: 'فهم دسترسی تکنولوژیک کاربران و محدودیت‌های پهنای باند و دستگاه در طراحی خدمات و محصول.',
    tags: ['cafe_bazaar', 'mobile_apps', 'android_penetration', 'in_app_purchase', 'mobile_audience']
  },
  'SRC-IR-SNAPP-FAMILY': {
    summary: 'گزارش‌های عملکرد سوپراپ گروه اسنپ — داده‌های حمل‌ونقل شهری، سفارش غذای آنلاین و خدمات اعتباری BNPL (اسنپ‌پی).',
    key_indicators: ['حجم سفرهای شهری و الگوهای تردد', 'رفتار سفارش آنلاین غذا (اسنپ‌فود)', 'نفوذ سرویس الان بخر بعداً پرداخت کن (اسنپ‌پی BNPL)'],
    strategic_utility: 'تایید ضرورت افزودن روش‌های پرداخت اعتباری به مدل‌های فروش کسب‌وکارها جهت کاهش اصطکاک خرید در تورم.',
    tags: ['snapp', 'mobility', 'food_delivery', 'bnpl', 'urban_services', 'consumer_credit']
  },
  'SRC-IR-ADTECH-FAMILY': {
    summary: 'گزارش‌های سالانه بازاریابی دیجیتال یکتانت و تپسل — داده‌های بنچ‌مارک تبلیغات کلیکی، وب‌پوش و تبلیغات موبایلی در فضای وب فارسی.',
    key_indicators: ['میانگین نرخ کلیک (CTR) بنری، همسان و ریتارگتینگ', 'هزینه هر کلیک (CPC) به تفکیک صنایع و فصول', 'سهم ترافیک موبایل (+۸۵٪) در برابر دسکتاپ'],
    strategic_utility: 'مبنای محاسبه دقیق هزینه جذب مشتری (CAC) در استراتژی‌های بازاریابی عملکردی (Performance Marketing).',
    tags: ['adtech', 'yektanet', 'tapsell', 'ctr', 'cpc', 'cac', 'digital_advertising', 'performance_marketing']
  }
};

for (const [id, info] of Object.entries(iranFamilies)) {
  const src = data.sources[id];
  if (src) {
    src.summary = info.summary;
    src.key_indicators = info.key_indicators;
    src.strategic_utility = info.strategic_utility;
    src.tags = info.tags;
  }
}

fs.writeFileSync(registryPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully enriched source-registry.json with rich canonical foundation and Iranian data details!');
