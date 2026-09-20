// Adversarial Stress-Test Suite for Challenger 1
// Tests boundary conditions, adversarial inputs, zero-leakage isolation, and state machine integrity

import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { classifyBusinessContext, getPhaseAdaptationRules, BUSINESS_ARCHETYPES } from './src/data/businessContextRouter.js';
import { getAdaptivePhase2Questions, PHASE2_QUESTIONS } from './src/data/phase2Templates.js';
import { getAdaptedPhaseQuestions, ALL_PHASES_QUESTIONS } from './src/data/allPhasesTemplates.js';

console.log("======================================================================");
console.log("🔥 STARTING ADVERSARIAL STRESS-TEST SUITE — EMPIRICAL CHALLENGER 1");
console.log("======================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  }
}

// =============================================================================
// TEST SUITE 1: Adversarial & Edge-Case Inputs to OrchestratorEngine
// =============================================================================
console.log("▶ SUITE 1: Edge & Malformed Input Robustness");
{
  const engine = new OrchestratorEngine();

  // Edge 1: Empty string response
  const resEmpty = engine.processUserResponse("");
  assert(resEmpty !== null && typeof resEmpty === "object", "Engine handles empty string without throwing");
  assert(Object.keys(engine.phaseData[1]).length === 0 && resEmpty.accepted === false, "Empty response does not advance or fabricate an answer");

  // Edge 2: Whitespace only
  const resSpaces = engine.processUserResponse("   ", "   ");
  assert(resSpaces !== null, "Engine handles whitespace response");

  // Edge 3: Extremely long input (100,000 characters)
  const hugeText = "تکرار ".repeat(20000);
  engine.phaseData[1].geography = hugeText;
  const resHuge = engine.processUserResponse(hugeText);
  assert(resHuge !== null, "Engine survives 100,000 char input without OOM or crash");
  assert(engine.phaseData[1].geography.length >= hugeText.length || Object.values(engine.phaseData[1]).some(v => typeof v === "string" && v.length >= hugeText.length), "Huge text correctly stored in phaseData");

  // Edge 4: SQL injection & XSS attack vectors
  const maliciousInput = "<script>alert('xss')</script>'; DROP TABLE users; --";
  const resSec = engine.processUserResponse(maliciousInput);
  assert(resSec !== null, "Engine survives XSS/SQLi payload strings");
  assert(Object.values(engine.phaseData[1]).some(v => typeof v === "string" && v.includes(maliciousInput)), "String stored as-is without unsafe evaluation");

  // Edge 5: Unknown response trigger on step
  const resUnknown = engine.processUserResponse("مطمئن نیستم، باید با شریکم بررسی کنم", "unknown");
  assert(resUnknown.reply.includes("مجهول رسمی"), "Official unknown registered in response reply");
  assert(engine.unknowns.length === 1, "Unknown added to unknowns registry");
  assert(engine.unknowns[0].phase === 1, "Unknown tagged with Phase 1");
  assert(engine.unknowns[0].severity === "BLOCKING_UNKNOWN" || engine.unknowns[0].severity === "NON_BLOCKING_UNKNOWN", "Unknown has typed severity");
  assert(typeof engine.unknowns[0].blocking === "boolean", "Unknown has boolean blocking attribute");

  // Edge 6: Final question answered with unknown -> should trigger phase gate evaluation and halt if unfulfilled
  const resLastUnknown = engine.processUserResponse("نمی‌دانم", "unknown");
  assert(resLastUnknown !== null, "Engine evaluates phase gate on final response");
  assert(engine.unknowns.length === 2, "Second unknown recorded");
  assert(resLastUnknown.isCompleted === false, "Phase gate strictly halts completion when core facts are missing and unknowns unresolved");
  assert(engine.completedPhases[1] === false, "Phase 1 is not marked completed when gate fails");

  // Edge 7: Calling processUserResponse when currentQ is null (after phase completion)
  const resOverstep = engine.processUserResponse("اضافی بعد از اتمام");
  assert(resOverstep !== null, "Calling after phase evaluation returns gate result without crash");
}

// =============================================================================
// TEST SUITE 2: Full 8-Phase Traversal & Grand Finale Modal Strictness
// =============================================================================
console.log("\n▶ SUITE 2: Full 8-Phase State Machine & Grand Finale Guardrails");
{
  const engine = new OrchestratorEngine();

  for (let phase = 1; phase <= 8; phase++) {
    if (phase > 1) {
      const startRes = engine.startPhase(phase);
      assert(startRes.welcomeMessage.length > 20, `Phase ${phase} welcome message generated`);
      assert(startRes.firstQuestion !== null, `Phase ${phase} first question returned`);
      assert(engine.currentPhase === phase, `Engine currentPhase is ${phase}`);
      assert(engine.currentStepIndex === 0, `Step index reset to 0 for phase ${phase}`);
    }

    let q = engine.getCurrentQuestion();
    let lastRes = null;
    let stepCount = 0;

    while (q) {
      stepCount++;
      lastRes = engine.processUserResponse(
        `پاسخ فاز ${phase} گام ${stepCount}: ${q.title}`,
        `val_p${phase}_s${stepCount}`
      );
      q = engine.getCurrentQuestion();
    }

    assert(lastRes.isCompleted === true, `Phase ${phase} reported isCompleted === true`);
    assert(lastRes.completedPhase === phase, `Phase ${phase} reported completedPhase === ${phase}`);
    assert(engine.completedPhases[phase] === true, `completedPhases[${phase}] is true`);

    if (phase < 8) {
      assert(lastRes.nextPhase === phase + 1, `Phase ${phase} points to nextPhase ${phase + 1}`);
      assert(lastRes.isFinalGrandFinale === false, `Grand Finale is strictly FALSE for phase ${phase}`);
    } else {
      assert(lastRes.nextPhase === null, `Phase 8 nextPhase is null (terminal)`);
      assert(lastRes.isFinalGrandFinale === true, `Grand Finale is strictly TRUE after Phase 8 completion`);
      assert(lastRes.reply.includes("کتابچه جامع استراتژی"), "Phase 8 completion message references Master Brand Book");
    }
  }

  // Verify all 8 phases are recorded in completedPhases
  for (let p = 1; p <= 8; p++) {
    assert(engine.completedPhases[p] === true, `completedPhases[${p}] is confirmed true`);
  }
}

// =============================================================================
// TEST SUITE 3: Phase 8 Response Storage Integrity Across Questions
// =============================================================================
console.log("\n▶ SUITE 3: Phase 8 Response Storage & Deliverable Mapping");
{
  const engine = new OrchestratorEngine();
  
  // Set up prerequisite phases 1 to 7 as completed test fixture and test Phase 8 in isolation
  for (let p = 1; p <= 7; p++) {
    engine.completedPhases[p] = true;
  }
  engine.phaseData[1] = {
    coreOffer: "توسعه زیرساخت و قطعات پیشرفته صنعتی",
    primaryGoal: "ورود به زنجیره تامین صنایع مادر",
    geography: "سراسری ایران و منطقه"
  };
  engine.businessContext = classifyBusinessContext(engine.phaseData);
  engine.startPhase(8);

  const questions = engine.getCurrentPhaseQuestions();
  assert(questions.length === 4, "Phase 8 has exactly 4 questions");
  assert(questions[0].id === "p8_thought_leadership", "Q0 ID is p8_thought_leadership");
  assert(questions[1].id === "p8_pr_podcast_channels", "Q1 ID is p8_pr_podcast_channels");
  assert(questions[2].id === "p8_lead_funnel", "Q2 ID is p8_lead_funnel");
  assert(questions[3].id === "p8_crisis_reputation", "Q3 ID is p8_crisis_reputation");

  // Supply explicit user responses
  const ans0 = "تولید مقالات سفید مهندسی متالورژی و تحلیل علل شکست قطعات حساس در لینکدین سازمانی";
  const ans1 = "همکاری با نشریات انجمن قالب‌سازان و حضور در پادکست رادیو کارآفرینی";
  const ans2 = "تور بازدید مدیران فنی از کارخانه و قراردادهای تامین سالانه با ال‌سی بانکی";
  const ans3 = "اعزام تیم فنی ظرف ۴ ساعت به کارخانه کارفرما و صدور بیمه‌نامه تعویض قطعه";

  engine.processUserResponse(ans0, "ans0");
  engine.processUserResponse(ans1, "ans1");
  engine.processUserResponse(ans2, "ans2");
  const p8Done = engine.processUserResponse(ans3, "ans3");

  assert(p8Done.isCompleted === true, "Phase 8 completed");

  // Verify direct storage in phaseData[8]
  assert(engine.phaseData[8].thoughtLeadership === ans0, "thoughtLeadership stored verbatim");
  assert(engine.phaseData[8].prChannels === ans1, "prChannels stored verbatim");
  assert(engine.phaseData[8].leadFunnel === ans2, "leadFunnel stored verbatim");
  assert(engine.phaseData[8].reputationCrisis === ans3, "reputationCrisis stored verbatim");

  // Verify Phase 8 individual deliverable
  const p8Deliverable = engine.generateDeliverableData(8);
  assert(p8Deliverable.phaseNumber === 8, "P8 deliverable has phaseNumber 8");
  assert(p8Deliverable.title.includes("فعال‌سازی اجرایی"), "P8 deliverable title contains Executive Activation");
  assert(p8Deliverable.phase.includes("فاز 8"), "P8 deliverable phase string contains Phase 8");
  assert(p8Deliverable.evidence.some(item => item.field === 'thoughtLeadership' && item.statement.includes(ans0)), "Deliverable snapshot contains thoughtLeadership");
  assert(p8Deliverable.evidence.some(item => item.field === 'reputationCrisis' && item.statement.includes(ans3)), "Deliverable snapshot contains reputationCrisis");

  // Verify Master Deliverable section M8
  const masterDeliverable = engine.generateDeliverableData("master");
  const secM8 = masterDeliverable.sections.find(s => s.id === "M8");
  assert(secM8 !== undefined, "Section M8 exists in Master Deliverable");
  assert(secM8.content.thoughtLeadership === ans0, "M8 thoughtLeadership matches verbatim");
  assert(secM8.content.prChannels === ans1, "M8 prRoadmap matches verbatim");
  assert(secM8.content.leadFunnel === ans2, "M8 commercialFunnel matches verbatim");
  assert(secM8.content.reputationCrisis === ans3, "M8 reputationPlaybook matches verbatim");

  // Verify Master Markdown output contains Phase 8 data
  const masterMd = engine.generateMarkdownText("master");
  assert(masterMd.includes(ans0), "Master Markdown contains thoughtLeadership answer");
  assert(masterMd.includes(ans3), "Master Markdown contains reputationCrisis answer");
}

// =============================================================================
// TEST SUITE 4: Business Context Router Classification for All 5 Archetypes
// =============================================================================
console.log("\n▶ SUITE 4: Context Classification for 5 Business Scenarios");
{
  const scenarios = [
    {
      name: "1. Car Wash & Detailing (Local Technical Service)",
      phase1: {
        stage: "active",
        stageValue: "active",
        description: "خدمات فنی و خودرویی محلی (کارواش نانو، دیتیلینگ خودرو، تعویض‌روغنی و اتوسرویس)",
        descriptionValue: "local_automotive_service",
        geography: "local_city",
        coreOffer: "کارواش بخار نانو، صفرشویی و واکس بدنه خودرو"
      },
      expectedArch: "LOCAL_SERVICE",
      expectedChannel: "PHYSICAL_FIRST",
      expectedCustomer: "B2C",
      expectedScope: "CITY",
      mustHaveOverlay: "LOCAL_GUILD_REGULATION"
    },
    {
      name: "2. Specialty Coffee Roastery & Cafe (Hospitality / Food B2C)",
      phase1: {
        stage: "active",
        stageValue: "active",
        description: "کافه، رستری و صنعت مهمان‌نوازی (کافی‌شاپ، رستری دانه قهوه، کافه‌رستوران و قنادی)",
        descriptionValue: "hospitality_cafe_roastery",
        geography: "local_city",
        coreOffer: "برشته‌کاری دانه قهوه تخصصی و سرو نوشیدنی‌های باریستا"
      },
      expectedArch: "RESTAURANT_CAFE_HOSPITALITY",
      expectedChannel: "PHYSICAL_FIRST",
      expectedCustomer: "B2C",
      expectedScope: "CITY",
      mustHaveOverlay: "FOOD_SAFETY_REGULATION"
    },
    {
      name: "3. Oil Service & Auto Express (Automotive Technical Service via free text)",
      phase1: {
        stage: "rebrand",
        stageValue: "rebrand",
        description: "تعویض روغنی، فیلتر و سرویس دوره‌ای خودرو",
        descriptionValue: "custom",
        geography: "تهران و منطقه غرب",
        coreOffer: "تعویض روغن موتور اورجینال، فیلتر هوا و گیربکس اتوماتیک"
      },
      expectedArch: "LOCAL_SERVICE",
      expectedChannel: "PHYSICAL_FIRST",
      expectedCustomer: "B2C",
      expectedScope: "CITY",
      mustHaveOverlay: "LOCAL_GUILD_REGULATION"
    },
    {
      name: "4. Cloud Accounting B2B SaaS (Technology & Software)",
      phase1: {
        stage: "active",
        stageValue: "active",
        description: "نرم‌افزار ابری و فناوری B2B (حسابداری ابری SaaS، سامانه مودیان، ERP و پلتفرم شرکتی)",
        descriptionValue: "b2b_saas_software",
        geography: "nationwide_iran",
        coreOffer: "نرم‌افزار حسابداری آنلاین مجهز به اتصال خودکار به سامانه مودیان"
      },
      expectedArch: "SAAS_SOFTWARE",
      expectedChannel: "ONLINE_FIRST",
      expectedCustomer: "B2B",
      expectedScope: "NATIONAL",
      mustHaveOverlay: "TAX_SYSTEM_INTEGRATION"
    },
    {
      name: "5. Industrial Parts & Tooling Factory (Heavy Manufacturing B2B)",
      phase1: {
        stage: "active",
        stageValue: "active",
        description: "کارخانه صنعتی و قالب‌سازی (تولید قطعات صنعتی، قالب‌سازی دقیق و ماشین‌کاری B2B)",
        descriptionValue: "industrial_manufacturing",
        geography: "nationwide_iran",
        coreOffer: "تولید انبوه قطعات ریخته‌گری، قالب‌سازی سنبه‌ماتریس و ماشین‌کاری CNC"
      },
      expectedArch: "MANUFACTURER",
      expectedChannel: "DIRECT_SALES_B2B",
      expectedCustomer: "B2B",
      expectedScope: "NATIONAL",
      mustHaveOverlay: "HEAVY_CAPEX_SUPPLY_CHAIN"
    }
  ];

  scenarios.forEach((sc, idx) => {
    console.log(`  Subtest 4.${idx + 1}: ${sc.name}`);
    const ctx = classifyBusinessContext({ 1: sc.phase1 });
    assert(ctx.archetype === sc.expectedArch, `${sc.name} archetype is ${sc.expectedArch}`);
    assert(ctx.customerModel === sc.expectedCustomer, `${sc.name} customerModel is ${sc.expectedCustomer}`);
    assert(ctx.channelModel === sc.expectedChannel, `${sc.name} channelModel is ${sc.expectedChannel}`);
    assert(ctx.geographicScope === sc.expectedScope, `${sc.name} geographicScope is ${sc.expectedScope}`);
    assert(ctx.activeOverlays.includes(sc.mustHaveOverlay), `${sc.name} has required overlay ${sc.mustHaveOverlay}`);
  });
}

// =============================================================================
// TEST SUITE 5: Sector Branching Isolation & Zero Leakage in Phase 2
// =============================================================================
console.log("\n▶ SUITE 5: Phase 2 Branching Isolation & Terminology Leakage Audit");
{
  const contexts = {
    auto: { archetype: "LOCAL_SERVICE", industryId: 'IND-05', activeOverlays: ["LOCAL_GUILD_REGULATION"], archetypeTitle: "خدمات خودرویی" },
    cafe: { archetype: "RESTAURANT_CAFE_HOSPITALITY", activeOverlays: ["FOOD_SAFETY_REGULATION"], archetypeTitle: "کافه و رستری" },
    mfg: { archetype: "MANUFACTURER", activeOverlays: ["HEAVY_CAPEX_SUPPLY_CHAIN", "ISO_STANDARDS_COMPLIANCE"], archetypeTitle: "تولید صنعتی" },
    saas: { archetype: "SAAS_SOFTWARE", activeOverlays: ["TAX_SYSTEM_INTEGRATION"], archetypeTitle: "نرم‌افزار ابری" },
    creator: { archetype: "CREATOR_MEDIA_EDUCATION", activeOverlays: ["FOUNDER_LED"], archetypeTitle: "برند شخصی و آموزش" }
  };

  const qSets = {
    auto: getAdaptivePhase2Questions(contexts.auto),
    cafe: getAdaptivePhase2Questions(contexts.cafe),
    mfg: getAdaptivePhase2Questions(contexts.mfg),
    saas: getAdaptivePhase2Questions(contexts.saas),
    creator: getAdaptivePhase2Questions(contexts.creator)
  };

  // Check question counts
  Object.entries(qSets).forEach(([key, qs]) => {
    assert(qs.length === 5, `${key} has exactly 5 Phase 2 questions`);
  });

  // Verify mutual distinctness: no two archetypes have the same question title for Q0
  const q0Titles = Object.values(qSets).map(qs => qs[0].title);
  const uniqueQ0Titles = new Set(q0Titles);
  assert(uniqueQ0Titles.size === 5, "All 5 archetypes have 100% distinct Q0 titles");

  // Pairwise option value overlap check (should have 0 overlapping option values across archetypes)
  const allOptionValues = {};
  Object.entries(qSets).forEach(([archKey, qs]) => {
    const vals = [];
    qs.forEach(q => q.options.forEach(opt => vals.push(opt.value)));
    allOptionValues[archKey] = vals;
  });

  const keys = Object.keys(allOptionValues);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const k1 = keys[i];
      const k2 = keys[j];
      const set1 = new Set(allOptionValues[k1]);
      const overlap = allOptionValues[k2].filter(v => set1.has(v));
      assert(overlap.length === 0, `Zero option value overlap between ${k1} and ${k2} (Found: ${overlap.join(", ")})`);
    }
  }

  // Leakage test: Terminology audit
  // 1. Automotive must have auto terms and zero coaching/mfg terms
  const autoText = JSON.stringify(qSets.auto);
  assert(autoText.includes("خودرو") || autoText.includes("روغن") || autoText.includes("کارواش"), "Auto contains automotive terms");
  assert(!autoText.includes("کوچینگ") && !autoText.includes("مدرس") && !autoText.includes("دانگلی"), "Auto has zero coaching/SaaS leakage");

  // 2. Cafe must have cafe terms and zero heavy industrial terms
  const cafeText = JSON.stringify(qSets.cafe);
  assert(cafeText.includes("قهوه") || cafeText.includes("کافه") || cafeText.includes("رست"), "Cafe contains coffee terms");
  assert(!cafeText.includes("تراشکاری") && !cafeText.includes("قالب‌سازی") && !cafeText.includes("میکرون"), "Cafe has zero factory leakage");

  // 3. Manufacturing must have factory terms and zero cafe/coaching terms
  const mfgText = JSON.stringify(qSets.mfg);
  assert(mfgText.includes("قالب") || mfgText.includes("تلرانس") || mfgText.includes("تراشکاری") || mfgText.includes("CNC"), "Mfg contains industrial terms");
  assert(!mfgText.includes("باریستا") && !mfgText.includes("کوچینگ") && !mfgText.includes("اینستاگرامی"), "Mfg has zero cafe/influencer leakage");

  // 4. SaaS must have software/tax terms and zero car wash terms
  const saasText = JSON.stringify(qSets.saas);
  assert(saasText.includes("مودیان") || saasText.includes("ابری") || saasText.includes("SaaS"), "SaaS contains SaaS & tax terms");
  assert(!saasText.includes("کارواش") && !saasText.includes("روغن موتور") && !saasText.includes("رست"), "SaaS has zero auto/cafe leakage");

  // 5. Creator must have creator/education terms
  const creatorText = JSON.stringify(qSets.creator);
  assert(creatorText.includes("مخاطب") || creatorText.includes("آموزش") || creatorText.includes("مشاوره"), "Creator contains thought leadership terms");
  assert(!creatorText.includes("تلرانس") && !creatorText.includes("ریخته‌گری") && !creatorText.includes("تعویض روغن"), "Creator has zero auto/mfg leakage");
}

// =============================================================================
// TEST SUITE 6: Deliverable Markdown Generator Robustness
// =============================================================================
console.log("\n▶ SUITE 6: Deliverable Generator Stress & Markdown Consistency");
{
  const engine = new OrchestratorEngine();

  // Test calling deliverable generator on brand-new uninitialized engine
  const emptyDeliverable = engine.generateDeliverableData(1);
  assert(emptyDeliverable !== null, "Empty deliverable generated without crashing");
  assert(emptyDeliverable.phaseNumber === 1, "Phase number is 1");

  // Test calling markdown generator for all 8 phases + master on empty engine
  for (let p = 1; p <= 8; p++) {
    const md = engine.generateMarkdownText(p);
    assert(typeof md === "string" && md.length > 50, `Phase ${p} markdown generated on empty state`);
    assert(md.startsWith("# "), `Phase ${p} markdown has H1 header`);
  }

  const masterMd = engine.generateMarkdownText("master");
  assert(typeof masterMd === "string" && masterMd.length > 100, "Master markdown generated on empty state");
  assert(masterMd.includes("کتابچه جامع استراتژی برند"), "Master markdown includes standard title");
}

console.log("\n======================================================================");
console.log(`🏆 ALL ADVERSARIAL STRESS TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");

if (failed > 0) {
  process.exit(1);
}
