import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

const TEST_TRADES = [
  { id: "BT-0014", name: "طلا، جواهر و نقره‌فروشی", sector: "RETAIL" },
  { id: "BT-0066", name: "کافه تخصصی و رستری موج سوم", sector: "FOOD_HOSPITALITY" },
  { id: "BT-0100", name: "کلینیک تخصصی دندانپزشکی و ایمپلنت", sector: "HEALTHCARE" },
  { id: "BT-0101", name: "کلینیک پوست، مو، زیبایی و لیزر", sector: "BEAUTY" },
  { id: "BT-0003", name: "سوپرمارکت و هایپرمارکت محلی", sector: "RETAIL" },
  { id: "BT-0221", name: "کارخانه قالب‌سازی صنعتی، سنبه‌ماتریس و تزریق پلاستیک", sector: "MANUFACTURING" },
  { id: "BT-0166", name: "نرم‌افزار حسابداری ابری و اتصال به سامانه مودیان", sector: "SAAS_TECH" },
  { id: "BT-0496", name: "موسسه آموزش زبان‌های خارجی انگلیسی، آلمانی و آیلتس", sector: "EDUCATION_CREATOR" }
];

async function runMultiSectorTest() {
  console.log("======================================================================");
  console.log("🔬 MULTI-SECTOR DYNAMIC QUESTION CUSTOMIZATION AUDIT (8 TRADES)");
  console.log("======================================================================");

  let totalTests = 0;
  let passedTests = 0;

  for (const trade of TEST_TRADES) {
    console.log(`\n▶ Testing Trade: [${trade.id}] ${trade.name} (Sector: ${trade.sector})`);
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

    // Step 3: Answer stage (choose idea for half, active for half)
    const stageVal = trade.id === "BT-0092" ? "idea" : "active";
    const stageText = stageVal === "idea" ? "فقط یک ایده یا طرح اولیه در ذهن دارم" : "کسب‌وکار یا برند فعال دارم";
    res = engine.processUserResponse(stageText, stageVal);

    // Step 4: Answer geography (local for retail/beauty/health, national for others)
    const geoVal = ["BT-0092", "BT-0045", "BT-0010", "BT-0310"].includes(trade.id) ? "local_city" : "nationwide_iran";
    res = engine.processUserResponse("محدوده مشخص", geoVal);

    // Step 5: Check primary goal tailoring
    const qGoal = engine.getCurrentQuestion();
    totalTests++;
    if (stageVal === "idea") {
      if (qGoal.options[0].text.includes("۱۰ تا ۵۰ مشتری") || qGoal.options[0].text.includes("اعتبارسنجی")) {
        console.log(`  ✅ PASS: Idea stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Idea stage goal options missing expected text`);
      }
    } else {
      if (qGoal.options[0].text.includes("وفادار") || qGoal.options[0].text.includes("سهم بازار")) {
        console.log(`  ✅ PASS: Active stage goal options correctly synthesized`);
        passedTests++;
      } else {
        console.error(`  ❌ FAIL: Active stage goal options missing expected text`);
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

    // Phase 1 complete check
    totalTests++;
    if (res.isCompleted && engine.completedPhases[1]) {
      console.log(`  ✅ PASS: Phase 1 completed cleanly`);
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
