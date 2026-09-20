// Runtime Inter-Skill Logic Harmonization & Dynamic Business Specialization Test Suite
// Verifies 5 Archetype Classifications, Dynamic Question Branching, Phase 8 Transitions, and Grand Finale

import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { getPhaseAdaptationRules, classifyBusinessContext } from './src/data/businessContextRouter.js';

console.log("=== STARTING MILESTONE 2 RUNTIME TEST SUITE ===\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function completeFoundation(engine) {
  let result;
  for (let count = 0; count < 20 && engine.getCurrentQuestion(); count++) {
    const question = engine.getCurrentQuestion();
    const option = question.options?.[0];
    result = engine.processUserResponse(option?.text || 'مقدار آزمایشی ثبت‌شده', option?.value || null);
  }
  return result || engine.finalizeCurrentPhase();
}

// -----------------------------------------------------------------------------
// TEST 1: Full 8-Phase State Machine & Phase 8 Transition Test (Archetype: Automotive)
// -----------------------------------------------------------------------------
console.log("▶ TEST 1: Automotive Service Full Phase 1 to 8 Transition & Grand Finale");
{
  const engine = new OrchestratorEngine();
  assert(engine.currentPhase === 1, "Initial phase is 1");
  assert(engine.businessContext === null, "Initial context is null before Phase 1 completion");

  // Answer Phase 1
  engine.processUserResponse("کسب‌وکار / برند شخصی فعال دارم", "active");
  engine.processUserResponse("خدمات فنی و خودرویی محلی (کارواش نانو، دیتیلینگ خودرو، تعویض‌روغنی و اتوسرویس)", "local_automotive_service");
  engine.processUserResponse("محدود به یک شهر خاص (به عنوان مثال تهران یا مشهد)", "local_city");
  engine.processUserResponse("جذب ۱۰۰ مشتری اولیه و اعتبارسنجی تقاضا", "first_100_customers");
  engine.processUserResponse("یک خدمت حضوری یا فنی استاندارد با تحویل سریع و تضمینی", "core_service_delivery");
  engine.processUserResponse("کیفیت بالا و همراهی مداوم، بدون پیچیدگی و سردرگمی", "quality_simplicity");

  const p1Finish = completeFoundation(engine);
  assert(p1Finish.isCompleted === true, "Phase 1 is completed");
  assert(p1Finish.completedPhase === 1, "Completed phase is 1");
  assert(p1Finish.nextPhase === 2, "Next phase is 2");
  assert(p1Finish.isFinalGrandFinale === false, "Grand Finale is not triggered after Phase 1");
  assert(engine.businessContext !== null, "Business context is classified after Phase 1");
  assert(engine.businessContext.archetype === "LOCAL_SERVICE", "Archetype is LOCAL_SERVICE");
  assert(engine.businessContext.channelModel === "PHYSICAL_FIRST", "Channel model is PHYSICAL_FIRST");
  assert(engine.businessContext.customerModel === "B2C", "Customer model is B2C");
  assert(engine.businessContext.activeOverlays.includes("LOCAL_GUILD_REGULATION"), "Includes LOCAL_GUILD_REGULATION overlay");

  // Transition to Phase 2
  const p2Start = engine.startPhase(2);
  assert(engine.currentPhase === 2, "Current phase advanced to 2");
  assert(p2Start.welcomeMessage.includes("فاز ۲"), "Welcome message contains Phase 2");
  assert(p2Start.welcomeMessage.includes("انطباق تخصصی"), "Welcome message includes specialized adaptation notice");
  
  // Verify Phase 2 questions are automotive specific (no influencer leakage!)
  const p2Q0 = engine.getCurrentQuestion();
  assert(p2Q0.title.includes("خودرویی") || p2Q0.title.includes("محلی"), "P2 Q0 title is automotive/local");
  assert(p2Q0.options.some(o => o.text.includes("کارواش") || o.text.includes("تعمیرگاه")), "P2 Q0 contains automotive options");

  // Answer Phase 2
  engine.processUserResponse("کارواش‌ها و تعمیرگاه‌های سنتی با قیمت پایین و کیفیت نامطمئن", "traditional_garages");
  const p2Q1 = engine.getCurrentQuestion();
  assert(p2Q1.options.some(o => o.text.includes("روغن") || o.text.includes("خط و خش")), "P2 Q1 contains automotive pain options (fake oil/swirls)");
  engine.processUserResponse("ترس از روغن تقلبی و فیلتر بی‌کیفیت، خط و خش روی رنگ بدنه", "counterfeit_oil_swirls_damage");
  engine.processUserResponse("تعرفه ثابت و شفاف مصوب با صدور فاکتور رسمی", "transparent_official_invoice");
  engine.processUserResponse("نقشه‌های مسیریابی محلی (نشان، بلد، گوگل مپ)", "local_maps_street_traffic");
  const p2Finish = engine.processUserResponse("شکستن پلمپ اصالت روغن و قطعات دقیقاً در برابر چشمان مالک خودرو", "live_unsealing_guarantee");
  assert(p2Finish.isCompleted === true, "Phase 2 is completed");
  assert(p2Finish.nextPhase === 3, "Next phase is 3");

  // Walk Phases 3 to 7
  for (let phase = 3; phase <= 7; phase++) {
    engine.startPhase(phase);
    assert(engine.currentPhase === phase, `Entered phase ${phase}`);
    let q = engine.getCurrentQuestion();
    let res = null;
    while (q) {
      const option = q.options ? q.options[0] : null;
      res = engine.processUserResponse(option ? option.text : "پاسخ نمونه تاییدشده", option ? option.value : null);
      q = engine.getCurrentQuestion();
    }
    assert(res.isCompleted === true, `Phase ${phase} completed`);
    assert(res.completedPhase === phase, `Completed phase is ${phase}`);
    if (phase < 7) {
      assert(res.nextPhase === phase + 1, `Next phase is ${phase + 1}`);
      assert(res.isFinalGrandFinale === false, `Grand finale is false for phase ${phase}`);
    } else if (phase === 7) {
      // Phase 7 MUST transition to Phase 8, NOT Grand Finale!
      assert(res.nextPhase === 8, "Phase 7 completes and transitions to Phase 8 (BUG FIX VERIFIED!)");
      assert(res.isFinalGrandFinale === false, "Grand Finale is NOT triggered at Phase 7 completion (BUG FIX VERIFIED!)");
    }
  }

  // Transition to Phase 8
  const p8Start = engine.startPhase(8);
  assert(engine.currentPhase === 8, "Current phase is 8");
  assert(p8Start.welcomeMessage.includes("فاز ۸"), "Phase 8 welcome message generated");

  // Answer Phase 8 questions
  const p8Q0 = engine.getCurrentQuestion();
  assert(p8Q0.id === "p8_thought_leadership", "P8 Q0 is p8_thought_leadership");
  engine.processUserResponse("تحلیل نقادانه روندهای آینده صنعت و نقد رویکردهای سنتی ناکارآمد", "industry_disruption");

  const p8Q1 = engine.getCurrentQuestion();
  assert(p8Q1.id === "p8_pr_podcast_channels", "P8 Q1 is p8_pr_podcast_channels");
  engine.processUserResponse("حضور به عنوان مهمان تخصصی در پادکست‌های تراز اول کسب‌وکار و فناوری", "top_tier_podcasts");

  const p8Q2 = engine.getCurrentQuestion();
  assert(p8Q2.id === "p8_lead_funnel", "P8 Q2 is p8_lead_funnel");
  engine.processUserResponse("مسیر مشاوره استراتژیک اختصاصی با فیلتر دقیق و فرم رزرو باکیفیت بالا", "high_ticket_consulting");

  const p8Q3 = engine.getCurrentQuestion();
  assert(p8Q3.id === "p8_crisis_reputation", "P8 Q3 is p8_crisis_reputation");
  const p8Finish = engine.processUserResponse("پاسخگویی سریع، مستند به شواهد عینی، با آرامش و حفظ متانت", "evidence_calm");

  // Verify Phase 8 Completion & Grand Finale Trigger
  assert(p8Finish.isCompleted === true, "Phase 8 is completed");
  assert(p8Finish.completedPhase === 8, "Phase 8 is officially marked complete");
  assert(p8Finish.nextPhase === null, "Next phase is null (workflow finished)");
  assert(p8Finish.isFinalGrandFinale === true, "Grand Finale is triggered upon Phase 8 completion (BUG FIX VERIFIED!)");

  // Verify Phase 8 data was stored in phaseData[8]
  assert(engine.phaseData[8].thoughtLeadership !== undefined, "p8_thought_leadership stored in phaseData[8]");
  assert(engine.phaseData[8].prChannels !== undefined, "p8_pr_podcast_channels stored in phaseData[8]");
  assert(engine.phaseData[8].leadFunnel !== undefined, "p8_lead_funnel stored in phaseData[8]");
  assert(engine.phaseData[8].reputationCrisis !== undefined, "p8_crisis_reputation stored in phaseData[8]");

  // Verify Master Deliverable contains Section M8
  const master = engine.generateDeliverableData("master");
  assert(master.sections.length === 9, "Master deliverable contains M0 through M8");
  const m8 = master.sections.find(s => s.id === "M8");
  assert(m8 !== undefined, "Section M8 exists in Master Deliverable");
  assert(m8.content.thoughtLeadership === "تحلیل نقادانه روندهای آینده صنعت و نقد رویکردهای سنتی ناکارآمد", "M8 contains actual user thoughtLeadership response");
}

// -----------------------------------------------------------------------------
// TEST 2: Specialty Coffee Roastery & Cafe Hospitality Archetype
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 2: Specialty Coffee Roastery & Cafe Hospitality");
{
  const engine = new OrchestratorEngine();
  engine.processUserResponse("کسب‌وکار / برند شخصی فعال دارم", "active");
  engine.processUserResponse("کافه، رستری و صنعت مهمان‌نوازی (کافی‌شاپ، رستری دانه قهوه، کافه‌رستوران و قنادی)", "hospitality_cafe_roastery");
  completeFoundation(engine);

  assert(engine.businessContext.archetype === "RESTAURANT_CAFE_HOSPITALITY", "Classified as RESTAURANT_CAFE_HOSPITALITY");
  assert(engine.businessContext.activeOverlays.includes("FOOD_SAFETY_REGULATION"), "Contains FOOD_SAFETY_REGULATION");

  engine.startPhase(2);
  const q0 = engine.getCurrentQuestion();
  assert(q0.options.some(o => o.text.includes("کافه") || o.text.includes("رستری")), "P2 Q0 has cafe/roastery competitors");
  
  // Check Phase 4 Archetype Rule
  const p4Rule = getPhaseAdaptationRules(4, engine.businessContext);
  assert(p4Rule.instruction.includes("Creator") || p4Rule.instruction.includes("خالق"), "P4 recommends Creator archetype for cafe");

  // Check Phase 7 Visual Rule
  const p7Rule = getPhaseAdaptationRules(7, engine.businessContext);
  assert(p7Rule.instruction.includes("قهوه‌ای") || p7Rule.instruction.includes("#1c1917"), "P7 recommends warm roast palette");
}

// -----------------------------------------------------------------------------
// TEST 3: Industrial Parts & Tooling Factory (B2B Manufacturing)
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 3: Heavy Industrial Parts & Tooling Factory B2B");
{
  const engine = new OrchestratorEngine();
  engine.processUserResponse("کسب‌وکار / برند شخصی فعال دارم", "active");
  engine.processUserResponse("کارخانه صنعتی و قالب‌سازی (تولید قطعات صنعتی، قالب‌سازی دقیق و ماشین‌کاری B2B)", "industrial_manufacturing");
  completeFoundation(engine);

  assert(engine.businessContext.archetype === "MANUFACTURER", "Classified as MANUFACTURER");
  assert(engine.businessContext.customerModel === "B2B", "Customer model is B2B");
  assert(engine.businessContext.activeOverlays.includes("HEAVY_CAPEX_SUPPLY_CHAIN"), "Contains HEAVY_CAPEX_SUPPLY_CHAIN");
  assert(engine.businessContext.activeOverlays.includes("ISO_STANDARDS_COMPLIANCE"), "Contains ISO_STANDARDS_COMPLIANCE");

  engine.startPhase(2);
  const q0 = engine.getCurrentQuestion();
  assert(q0.options.some(o => o.text.includes("تراشکاری") || o.text.includes("چین") || o.text.includes("صنعتی")), "P2 Q0 has industrial machine shop competitors");

  // Check Phase 4 Archetype Rule
  const p4Rule = getPhaseAdaptationRules(4, engine.businessContext);
  assert(p4Rule.instruction.includes("Ruler") || p4Rule.instruction.includes("حاکم"), "P4 recommends Ruler archetype for industrial mfg");

  // Check Phase 6 Naming Rule
  const p6Rule = getPhaseAdaptationRules(6, engine.businessContext);
  assert(p6Rule.instruction.includes("صنعتی") || p6Rule.instruction.includes("میکرونی"), "P6 recommends solid industrial naming & micro tolerance");
}

// -----------------------------------------------------------------------------
// TEST 4: B2B Cloud Accounting SaaS & Technology Platform
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 4: B2B Cloud Accounting SaaS Platform");
{
  const engine = new OrchestratorEngine();
  engine.processUserResponse("کسب‌وکار / برند شخصی فعال دارم", "active");
  engine.processUserResponse("نرم‌افزار ابری و فناوری B2B (حسابداری ابری SaaS، سامانه مودیان، ERP و پلتفرم شرکتی)", "b2b_saas_software");
  completeFoundation(engine);

  assert(engine.businessContext.archetype === "SAAS_SOFTWARE", "Classified as SAAS_SOFTWARE");
  assert(engine.businessContext.customerModel === "B2B", "Customer model is B2B");
  assert(engine.businessContext.activeOverlays.includes("TAX_SYSTEM_INTEGRATION"), "Contains TAX_SYSTEM_INTEGRATION");

  engine.startPhase(2);
  const q1 = engine.getCurrentPhaseQuestions()[1];
  assert(q1.options.some(o => o.text.includes("مودیان") || o.text.includes("مالیاتی")), "P2 Q1 contains Samaneh Moadian tax pain options");

  // Check Phase 4 Archetype Rule
  const p4Rule = getPhaseAdaptationRules(4, engine.businessContext);
  assert(p4Rule.instruction.includes("Sage") && p4Rule.instruction.includes("Magician"), "P4 recommends Sage + Magician for SaaS");

  // Check Phase 7 Visual Rule
  const p7Rule = getPhaseAdaptationRules(7, engine.businessContext);
  assert(p7Rule.instruction.includes("تکنولوژی") && p7Rule.instruction.includes("داشبورد"), "P7 recommends tech UI tokens for SaaS");
}

// -----------------------------------------------------------------------------
// TEST 5: Personal Brand, Creator & Coaching
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 5: Personal Brand, Creator & Coaching");
{
  const engine = new OrchestratorEngine();
  engine.processUserResponse("کسب‌وکار / برند شخصی فعال دارم", "active");
  engine.processUserResponse("برند شخصی، کریتور و مربی‌گری (کوچینگ تخصصی، آموزش، مشاوره فردی و تولید محتوا)", "creator_coaching_personal");
  completeFoundation(engine);

  assert(engine.businessContext.archetype === "CREATOR_MEDIA_EDUCATION", "Classified as CREATOR_MEDIA_EDUCATION");
  assert(engine.businessContext.activeOverlays.includes("FOUNDER_LED"), "Contains FOUNDER_LED");

  // Check Phase 4 Archetype Rule
  const p4Rule = getPhaseAdaptationRules(4, engine.businessContext);
  assert(p4Rule.instruction.includes("Sage"), "P4 recommends Sage archetype for creator/education");

  // Check Phase 8 Rule
  const p8Rule = getPhaseAdaptationRules(8, engine.businessContext);
  assert(p8Rule.instruction.includes("بنیان‌گذار") && p8Rule.instruction.includes("پادکست"), "P8 focuses on founder thought leadership & podcasts");
}

// -----------------------------------------------------------------------------
// TEST 6: All 8 Phases Adaptation Rules Coverage Check
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 6: Adaptation Rules Completeness (Phases 1 to 8)");
{
  const mockContext = {
    archetype: "LOCAL_SERVICE",
    archetypeTitle: "خدمات فنی و خودرویی",
    customerModel: "B2C",
    channelModel: "PHYSICAL_FIRST",
    geographicScope: "CITY",
    activeOverlays: ["LOCAL_GUILD_REGULATION"]
  };

  for (let p = 1; p <= 8; p++) {
    const rule = getPhaseAdaptationRules(p, mockContext);
    assert(rule !== null, `Phase ${p} adaptation rule is defined`);
    assert(typeof rule.title === 'string' && rule.title.length > 0, `Phase ${p} rule has title`);
    assert(typeof rule.instruction === 'string' && rule.instruction.length > 0, `Phase ${p} rule has instruction`);
  }
}

// -----------------------------------------------------------------------------
// TEST 7: Precedence Verification: Explicit descVal Overrides Heuristic Keywords
// -----------------------------------------------------------------------------
console.log("\n▶ TEST 7: Precedence Verification: Explicit descVal Overrides Heuristic Keywords");
{
  // Scenario 1: Industrial Parts Factory producing automotive components
  // Must be MANUFACTURER, NOT LOCAL_SERVICE despite containing "خودرو" and "اتومبیل"
  const mfgWithAutoKeywords = classifyBusinessContext({
    1: {
      stage: "active",
      description: "کارخانه صنعتی و قالب‌سازی قطعات",
      descriptionValue: "industrial_manufacturing",
      geography: "nationwide_iran",
      coreOffer: "تولید قطعات خودرویی، قالب‌های ریخته‌گری و اتصالات موتور اتومبیل"
    }
  });
  assert(mfgWithAutoKeywords.archetype === "MANUFACTURER", "Automotive parts factory correctly classified as MANUFACTURER, NOT LOCAL_SERVICE");
  assert(mfgWithAutoKeywords.customerModel === "B2B", "Automotive parts factory customerModel is B2B");
  assert(mfgWithAutoKeywords.activeOverlays.includes("HEAVY_CAPEX_SUPPLY_CHAIN"), "Contains HEAVY_CAPEX_SUPPLY_CHAIN overlay");

  // Scenario 2: Specialty Cafe offering barista coaching & academy courses
  // Must be RESTAURANT_CAFE_HOSPITALITY, NOT CREATOR_MEDIA_EDUCATION
  const cafeWithCoachingKeywords = classifyBusinessContext({
    1: {
      stage: "active",
      description: "کافه بیکری و رستری تخصصی",
      descriptionValue: "hospitality_cafe_roastery",
      geography: "local_city",
      coreOffer: "سرو قهوه تخصصی، شیرینی تازه و برگزاری دوره‌های آموزش باریستا و مربی‌گری قهوه"
    }
  });
  assert(cafeWithCoachingKeywords.archetype === "RESTAURANT_CAFE_HOSPITALITY", "Cafe with barista academy correctly classified as RESTAURANT_CAFE_HOSPITALITY");
  assert(cafeWithCoachingKeywords.activeOverlays.includes("FOOD_SAFETY_REGULATION"), "Contains FOOD_SAFETY_REGULATION overlay");

  // Scenario 3: B2B SaaS platform for car washes & automotive workshops
  // Must be SAAS_SOFTWARE, NOT LOCAL_SERVICE
  const saasWithAutoKeywords = classifyBusinessContext({
    1: {
      stage: "active",
      description: "نرم‌افزار ابری مدیریت کارواش و اتوسرویس",
      descriptionValue: "b2b_saas_software",
      geography: "nationwide_iran",
      coreOffer: "پلتفرم ابری مدیریت نوبت‌دهی، فاکتور الکترونیک و انبارداری ویژه تعمیرگاه و کارواش خودرو"
    }
  });
  assert(saasWithAutoKeywords.archetype === "SAAS_SOFTWARE", "Auto-shop management SaaS correctly classified as SAAS_SOFTWARE");
  assert(saasWithAutoKeywords.customerModel === "B2B", "SaaS customerModel is B2B");
  assert(saasWithAutoKeywords.activeOverlays.includes("TAX_SYSTEM_INTEGRATION"), "Contains TAX_SYSTEM_INTEGRATION overlay");

  // Scenario 4: Creator / Coach with physical merch / books
  // Must be CREATOR_MEDIA_EDUCATION, NOT ECOMMERCE_DTC
  const creatorWithShopKeywords = classifyBusinessContext({
    1: {
      stage: "active",
      description: "کریتور محتوا و کوچینگ فردی",
      descriptionValue: "creator_coaching_personal",
      geography: "nationwide_iran",
      coreOffer: "دوره‌های آموزشی رشد فردی، پادکست و فروشگاه آنلاین کتاب‌های اختصاصی"
    }
  });
  assert(creatorWithShopKeywords.archetype === "CREATOR_MEDIA_EDUCATION", "Creator with book store correctly classified as CREATOR_MEDIA_EDUCATION");
  assert(creatorWithShopKeywords.activeOverlays.includes("FOUNDER_LED"), "Contains FOUNDER_LED overlay");
}

console.log(`\n======================================================`);
console.log(`🎉 ALL ${passedTests}/${totalTests} HARMONIZATION TESTS PASSED CLEANLY!`);
console.log(`======================================================\n`);
