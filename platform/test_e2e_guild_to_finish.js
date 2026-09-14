import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

async function testFullE2EJourney() {
  console.log("=== STARTING FULL END-TO-END JOURNEY TEST (PHASE 1 TO 8) ===");
  const engine = new OrchestratorEngine();

  // Step 1: User selects guild
  console.log("\n▶ Step 1: Select guild from 753 list");
  let q = engine.getCurrentQuestion();
  console.log("Initial Question ID:", q?.id);
  console.log("Initial Question Text:", q?.text?.slice(0, 60));

  let res = engine.processUserResponse("صنف انتخابی: کارواش نانو بخار، روشویی و صفرشویی خودرو (BT-0136)", "BT-0136");
  console.log("Reply after guild selection:", res.reply?.slice(0, 60));
  console.log("Next Question ID:", res.nextQuestion?.id);
  console.log("Next Question Title:", res.nextQuestion?.title);

  // Loop through all remaining Phase 1 questions
  let p1Step = 1;
  while (!res.isCompleted && engine.currentPhase === 1) {
    p1Step++;
    q = engine.getCurrentQuestion();
    if (!q) {
      console.error("ERROR: Next question is null before Phase 1 completed!");
      process.exit(1);
    }
    console.log(`\n▶ Phase 1 Step ${p1Step}: [${q.id}] ${q.title}`);
    console.log("  Question text:", q.text?.slice(0, 70));
    console.log("  Options count:", q.options?.length || 0);
    const optVal = q.options?.[0]?.value || `val_${q.id}`;
    const optText = q.options?.[0]?.text || `پاسخ انتخابی ${q.title}`;
    console.log(`  Selecting option: "${optText.slice(0, 50)}" (${optVal})`);
    res = engine.processUserResponse(optText, optVal);
  }

  console.log("\n✅ Phase 1 Successfully Completed!");
  console.log("Completed phases:", engine.completedPhases);
  console.log("Business Context Archetype:", engine.businessContext?.archetype);
  console.log("Business Context Taxonomy:", engine.businessContext?.taxonomyId, engine.businessContext?.taxonomyTitleFa);

  // Traverse Phase 2 to 8
  for (let p = 2; p <= 8; p++) {
    console.log(`\n======================================================`);
    console.log(`▶ Starting Phase ${p}`);
    const start = engine.startPhase(p);
    console.log("Welcome message:", start.welcomeMessage?.slice(0, 80));

    let pStep = 0;
    while (true) {
      q = engine.getCurrentQuestion();
      if (!q) break;
      pStep++;
      console.log(`  Phase ${p} Step ${pStep}: [${q.id}] ${q.title} (options: ${q.options?.length || 0})`);
      const optVal = q.options?.[0]?.value || `val_${q.id}`;
      const optText = q.options?.[0]?.text || `پاسخ انتخابی ${q.title}`;
      res = engine.processUserResponse(optText, optVal);
      if (res.isCompleted) {
        console.log(`  ✅ Phase ${p} marked completed!`);
        break;
      }
    }
  }

  console.log("\n======================================================");
  console.log("🏆 GRAND FINALE VERIFICATION");
  console.log("Completed phases:", engine.completedPhases);
  console.log("Is final phase 8 completed:", engine.completedPhases[8]);
  console.log("Total facts collected:", engine.facts.length);
  console.log("Total decisions collected:", engine.decisions.length);

  const masterDeliverable = engine.generateDeliverableData("master");
  console.log("Master Deliverable generated:", !!masterDeliverable);
  console.log("Master Deliverable title:", masterDeliverable?.title);

  const masterMarkdown = engine.generateMarkdownText("master");
  console.log("Master Markdown length:", masterMarkdown.length, "chars");

  if (engine.completedPhases[8] && masterDeliverable && masterMarkdown.length > 500) {
    console.log("\n🎉 ALL 8 PHASES COMPLETED WITH 100% SUCCESS FROM START TO FINISH!");
  } else {
    console.error("FAIL: Workflow did not complete cleanly.");
    process.exit(1);
  }
}

testFullE2EJourney().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
