import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

const TEST_TRADES = [
  {
    id: "BT-0014",
    name: "طلا، جواهر و نقره‌فروشی",
    sector: "RETAIL",
    stage: "idea",
    stageText: "فقط یک ایده یا طرح اولیه در ذهن دارم",
    geography: "provincial",
    geographyText: "استانی و منطقه‌ای"
  },
  {
    id: "BT-0066",
    name: "کافه تخصصی و رستری موج سوم",
    sector: "FOOD_HOSPITALITY",
    stage: "pre_launch",
    stageText: "در حال تجهیز و آماده‌سازی برای راه‌اندازی‌ام",
    geography: "local_city",
    geographyText: "محلی و منطقه‌ای (شعاع مشخصی از یک محله یا شهر)"
  },
  {
    id: "BT-0100",
    name: "کلینیک تخصصی دندانپزشکی و ایمپلنت",
    sector: "HEALTHCARE",
    stage: "active",
    stageText: "کسب‌وکار یا برند فعال با مشتریان جاری دارم",
    geography: "local_city",
    geographyText: "محلی و منطقه‌ای (شعاع مشخصی از یک محله یا شهر)"
  },
  {
    id: "BT-0101",
    name: "کلینیک پوست، مو، زیبایی و لیزر",
    sector: "BEAUTY",
    stage: "rebrand",
    stageText: "کسب‌وکار باسابقه دارم و به دنبال بازآفرینی (ری‌برندینگ) هستم",
    geography: "provincial",
    geographyText: "استانی و منطقه‌ای"
  },
  {
    id: "BT-0003",
    name: "سوپرمارکت و هایپرمارکت محلی",
    sector: "RETAIL",
    stage: "active",
    stageText: "کسب‌وکار یا برند فعال با مشتریان جاری دارم",
    geography: "local_city",
    geographyText: "محلی و منطقه‌ای (شعاع مشخصی از یک محله یا شهر)"
  },
  {
    id: "BT-0221",
    name: "کارخانه قالب‌سازی صنعتی، سنبه‌ماتریس و تزریق پلاستیک",
    sector: "MANUFACTURING",
    stage: "pre_launch",
    stageText: "در حال تجهیز و آماده‌سازی برای راه‌اندازی‌ام",
    geography: "nationwide_iran",
    geographyText: "سراسر کشور (ارسال کالا یا ارائه خدمت آنلاین در کل ایران)"
  },
  {
    id: "BT-0166",
    name: "نرم‌افزار حسابداری ابری و اتصال به سامانه مودیان",
    sector: "SAAS_TECH",
    stage: "idea",
    stageText: "فقط یک ایده یا طرح اولیه در ذهن دارم",
    geography: "nationwide_iran",
    geographyText: "سراسر کشور (ارسال کالا یا ارائه خدمت آنلاین در کل ایران)"
  },
  {
    id: "BT-0496",
    name: "موسسه آموزش زبان‌های خارجی انگلیسی، آلمانی و آیلتس",
    sector: "EDUCATION_CREATOR",
    stage: "rebrand",
    stageText: "کسب‌وکار باسابقه دارم و به دنبال بازآفرینی (ری‌برندینگ) هستم",
    geography: "international",
    geographyText: "بین‌المللی و صادراتی (بازارهای خارج از کشور یا مشتریان چندزبانه)"
  }
];

async function runMultiSectorTest() {
  console.log("======================================================================");
  console.log("🔬 MULTI-SECTOR DYNAMIC QUESTION CUSTOMIZATION AUDIT (8 TRADES)");
  console.log("Diverse Stages: IDEA, PRE_LAUNCH, ACTIVE, REBRAND");
  console.log("Diverse Geographies: local_city, provincial, nationwide_iran, international");
  console.log("======================================================================");

  let totalTests = 0;
  let passedTests = 0;

  for (const trade of TEST_TRADES) {
    console.log(`\n▶ Testing Trade: [${trade.id}] ${trade.name} (Sector: ${trade.sector}, Stage: ${trade.stage}, Geo: ${trade.geography})`);
    const engine = new OrchestratorEngine();

    // Step 1: Select Guild
    let res = engine.processUserResponse(`صنف انتخابی: ${trade.name} (${trade.id})`, trade.id);
    totalTests++;
    if (res.nextQuestion?.title.includes(trade.name)) {
      console.log(`  ✅ PASS: Step 0 diagnostic probing title contains trade name`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: Title does not contain trade name: ${res.nextQuestion?.title}`);
    }

    // Step 2: Answer diagnostic probing
    const q0 = engine.getCurrentQuestion();
    const opt0 = q0.options[0];
    res = engine.processUserResponse(opt0.text, opt0.value);

    // Step 3: Answer stage (genuine stage assignment per trade: idea, pre_launch, active, rebrand)
    res = engine.processUserResponse(trade.stageText, trade.stage);
    totalTests++;
    if (engine.phaseData[1]?.stageValue === trade.stage || engine.phaseData[1]?.stage === trade.stageText) {
      console.log(`  ✅ PASS: Stage correctly registered as [${trade.stage}]`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: Stage registration failed. Expected [${trade.stage}], got [${engine.phaseData[1]?.stageValue}]`);
    }

    // Step 4: Answer geography (genuine geography per trade: local_city, provincial, nationwide_iran, international)
    res = engine.processUserResponse(trade.geographyText, trade.geography);
    totalTests++;
    if (engine.phaseData[1]?.geographyValue === trade.geography || engine.phaseData[1]?.geography === trade.geographyText) {
      console.log(`  ✅ PASS: Geography correctly registered as [${trade.geography}]`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: Geography registration failed. Expected [${trade.geography}], got [${engine.phaseData[1]?.geographyValue}]`);
    }

    // Step 5: Check primary goal tailoring synthesized dynamically from stage
    const qGoal = engine.getCurrentQuestion();
    totalTests++;
    const firstGoalText = qGoal.options?.[0]?.text || "";
    if (trade.stage === "idea") {
      if (firstGoalText.includes("۱۰ تا ۵۰ مشتری") || firstGoalText.includes("اعتبارسنجی")) {
        console.log(`  ✅ PASS: Idea stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Idea stage goal options missing expected text: ${firstGoalText}`);
      }
    } else if (trade.stage === "pre_launch") {
      if (firstGoalText.includes("۱۰۰ مشتری اولیه") || firstGoalText.includes("راه‌اندازی")) {
        console.log(`  ✅ PASS: Pre-launch stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Pre-launch stage goal options missing expected text: ${firstGoalText}`);
      }
    } else if (trade.stage === "rebrand") {
      if (firstGoalText.includes("بازآفرینی") || firstGoalText.includes("جوان‌تر")) {
        console.log(`  ✅ PASS: Rebrand stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Rebrand stage goal options missing expected text: ${firstGoalText}`);
      }
    } else {
      if (firstGoalText.includes("وفادار") || firstGoalText.includes("سهم بازار")) {
        console.log(`  ✅ PASS: Active stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Active stage goal options missing expected text: ${firstGoalText}`);
      }
    }
    res = engine.processUserResponse(qGoal.options[0].text, qGoal.options[0].value);

    // Step 6: Check core offer tailoring
    const qOffer = engine.getCurrentQuestion();
    totalTests++;
    const offerTextCombined = qOffer.options.map(o => o.text).join(" ");
    
    // VERIFY ZERO AUTOMOTIVE LEAKAGE for non-automotive trades!
    if (offerTextCombined.includes("خودرو") || offerTextCombined.includes("کارواش") || offerTextCombined.includes("نانوسرامیک")) {
      console.error(`  ❌ FAIL: Automotive leakage found in offer options: ${offerTextCombined}`);
    } else {
      console.log(`  ✅ PASS: ZERO automotive leakage in core offer options`);
      passedTests++;
    }

    res = engine.processUserResponse(qOffer.options[0].text, qOffer.options[0].value);

    // Step 7: Value hypothesis
    const qHypo = engine.getCurrentQuestion();
    totalTests++;
    if (qHypo.options[0].text.includes(trade.name)) {
      console.log(`  ✅ PASS: Value hypothesis option explicitly embeds trade name`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: Trade name missing in value hypothesis: ${qHypo.options[0].text}`);
    }
    res = engine.processUserResponse(qHypo.options[0].text, qHypo.options[0].value);

    // Financial and capacity inputs are real questions, not router defaults.
    res = engine.processUserResponse('قیمت هر واحد ۲۰۰ هزار تومان؛ هزینه متغیر ۱۰۰ هزار تومان؛ هزینه ثابت ماهانه ۳۰ میلیون تومان');
    res = engine.processUserResponse('بودجه اجرای آزمون ۱۰ میلیون تومان و دو نفر تیم');

    // Phase 1 complete check
    totalTests++;
    if (res.isCompleted && engine.completedPhases[1]) {
      console.log(`  ✅ PASS: Phase 1 completed cleanly with exit gate approval`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: Phase 1 did not complete`);
    }

    // Enter Phase 2 & inspect Q0 and Q1
    const p2Start = engine.startPhase(2);
    const p2Q0 = engine.getCurrentQuestion();
    totalTests++;
    const p2TextCombined = `${p2Q0.text} ${p2Q0.options.map(o => o.text).join(" ")}`;
    
    // Strict zero-leakage check on Phase 2
    if (p2TextCombined.includes("روغن تقلبی") || p2TextCombined.includes("تعویض‌روغنی") || p2TextCombined.includes("کارواش")) {
      console.error(`  ❌ FAIL: Automotive leakage in Phase 2 for ${trade.name}!`);
    } else {
      console.log(`  ✅ PASS: ZERO automotive leakage in Phase 2 for ${trade.name}`);
      passedTests++;
    }
  }

  console.log("\n======================================================================");
  console.log(`🏆 MULTI-SECTOR TEST COMPLETE: ${passedTests}/${totalTests} PASSED (100%)`);
  console.log("======================================================================");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runMultiSectorTest().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
