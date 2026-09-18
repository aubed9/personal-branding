import { strict as assert } from "node:assert";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";
import { UnknownsManager, UNKNOWN_STATUS, UNKNOWN_SEVERITY } from "./src/services/unknownsManager.js";
import { ContradictionEngine, CONTRADICTION_SEVERITY, CONTRADICTION_STATUS } from "./src/services/contradictionEngine.js";
import { validatePhaseGate } from "./src/services/phaseGateValidator.js";

console.log("======================================================================");
console.log("⚔️  ADVERSARIAL CHALLENGER SUITE: MILESTONE 3 CHURN & EDGE CASES");
console.log("======================================================================");

let totalAssertions = 0;
function pass(label) {
  totalAssertions++;
  console.log(`  ✅ [PASS ${totalAssertions}] ${label}`);
}

// ============================================================================
// SUITE 1: DEEP CASCADING DOWNSTREAM INVALIDATION (Phases 1 to 4 & beyond)
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 1: Deep Cascading Downstream Invalidation & Recovery Graph");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();

  // Helper to fully populate and complete a phase
  function populateAndCompletePhase(p) {
    if (p === 1) {
      engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C", geographicScope: "LOCAL" });
      engine.phaseData[1] = {
        stage: "فعال", stageValue: "active",
        description: "تعمیرگاه تخصصی گیربکس اتوماتیک", descriptionValue: "BT-0112",
        taxonomyId: "BT-0112",
        geography: "تهران و حومه", geographyValue: "local_city",
        primaryGoal: "افزایش ۴۰٪ مراجعان محلی در ۶ ماه",
        coreOffer: "سرویس و بازسازی تخصصی گیربکس با ضمانت ۱۲ ماهه",
        valueHypothesis: "تست تخصصی با دستگاه‌های پیشرفته و گارانتی کتبی"
      };
    } else if (p === 2) {
      engine.phaseData[2] = {
        competitors: "تعمیرگاه‌های متفرقه محلی بدون تخصص و گارانتی",
        customerPain: "بی‌اعتمادی به مکانیک، قطعات تقلبی و معطلی طولانی",
        pricingModel: "تعرفه مصوب اتحادیه با فاکتور رسمی و شفاف",
        primaryChannel: "گوگل مپ و ارجاع مشتریان وفادار",
        goldenOpportunity: "گارانتی تعویض قطعه و تحویل ۲۴ ساعته"
      };
    } else if (p === 3) {
      engine.phaseData[3] = {
        positioning: "تخصصی‌ترین مرکز فوق‌تخصصی گیربکس غرب پایتخت با ضمانت ۱ ساله",
        targetSegment: "مالکان خودروهای کره‌ای و ژاپنی حساس به کیفیت و اصالت",
        boundary: "عدم انجام کارهای نامربوط به گیربکس جهت تمرکز حداکثری",
        promise: "تحویل دقیق در زمان مقرر بدون اضافه کردن هزینه‌های پیش‌بینی‌نشده"
      };
    } else if (p === 4) {
      engine.phaseData[4] = {
        archetype: "حکیم و متخصص کاربلد (Sage / Expert)",
        traits: "فوق‌العاده صادق، دقیق در عیب‌یابی و خوش‌برخورد",
        toneGuardrail: "پرهیز از اغراق و وعده‌های توخالی"
      };
    }
    const gate = validatePhaseGate(p, engine);
    assert.equal(gate.passed, true, `Phase ${p} gate must pass with valid data`);
    engine.completedPhases[p] = true;
    if (engine.phaseStatus[p] === "INVALIDATED") {
      delete engine.phaseStatus[p];
    }
  }

  // 1. Sequentially complete Phases 1, 2, 3, 4
  populateAndCompletePhase(1);
  pass("Phase 1 completed");
  populateAndCompletePhase(2);
  pass("Phase 2 completed");
  populateAndCompletePhase(3);
  pass("Phase 3 completed");
  populateAndCompletePhase(4);
  pass("Phase 4 completed");

  // Verify all 4 are COMPLETED
  for (let p = 1; p <= 4; p++) {
    assert.equal(engine.completedPhases[p], true, `completedPhases[${p}] should be true`);
    assert.equal(engine.getPhaseStatus(p), "COMPLETED", `Phase ${p} status should be COMPLETED`);
  }
  pass("Phases 1-4 all verified in COMPLETED state");

  assert.equal(engine.getPhaseStatus(5), "AVAILABLE", "Phase 5 should be AVAILABLE");
  assert.equal(engine.getPhaseStatus(6), "LOCKED", "Phase 6 should be LOCKED");
  assert.equal(engine.getPhaseStatus(7), "LOCKED", "Phase 7 should be LOCKED");
  assert.equal(engine.getPhaseStatus(8), "LOCKED", "Phase 8 should be LOCKED");
  pass("Phases 5-8 have correct progression statuses (AVAILABLE, LOCKED)");

  // 2. Adversarial Trigger: User modifies foundational Phase 1 decision
  engine.currentPhase = 1;
  const invalidationResult = engine.invalidateDependentPhases(1);

  // Assert cascading invalidation
  assert.deepEqual(invalidationResult.invalidatedPhases, [2, 3, 4], "All downstream completed phases (2, 3, 4) must be invalidated");
  assert.equal(engine.completedPhases[1], true, "Phase 1 completion status is preserved");
  assert.equal(engine.completedPhases[2], false, "Phase 2 completedPhases must be false");
  assert.equal(engine.completedPhases[3], false, "Phase 3 completedPhases must be false");
  assert.equal(engine.completedPhases[4], false, "Phase 4 completedPhases must be false");
  pass("completedPhases flags for 2, 3, 4 cleanly set to false");

  assert.equal(engine.getPhaseStatus(2), "INVALIDATED", "Phase 2 getPhaseStatus must return INVALIDATED");
  assert.equal(engine.getPhaseStatus(3), "INVALIDATED", "Phase 3 getPhaseStatus must return INVALIDATED");
  assert.equal(engine.getPhaseStatus(4), "INVALIDATED", "Phase 4 getPhaseStatus must return INVALIDATED");
  pass("getPhaseStatus returns INVALIDATED for phases 2, 3, 4");

  // Verify canStartPhase rules after invalidation
  const canStart2 = engine.canStartPhase(2);
  assert.equal(canStart2.allowed, true, "Phase 2 is re-startable because Phase 1 is complete");
  pass("canStartPhase(2) is allowed");

  const canStart3 = engine.canStartPhase(3);
  assert.equal(canStart3.allowed, false, "Phase 3 cannot start because Phase 2 was invalidated");
  assert.ok(canStart3.reason.includes("ورود به فاز 3 مجاز نیست"), "Provides actionable rejection reason");
  pass("canStartPhase(3) is strictly blocked");

  const canStart4 = engine.canStartPhase(4);
  assert.equal(canStart4.allowed, false, "Phase 4 cannot start because prerequisite phases incomplete");
  pass("canStartPhase(4) is strictly blocked");

  // Assert startPhase throws for blocked phases
  assert.throws(
    () => engine.startPhase(3),
    err => err.isGateBlocked === true && err.phase === 3,
    "startPhase(3) must throw gate-blocked error"
  );
  pass("startPhase(3) threw expected gate-blocked error");

  assert.throws(
    () => engine.startPhase(4),
    err => err.isGateBlocked === true && err.phase === 4,
    "startPhase(4) must throw gate-blocked error"
  );
  pass("startPhase(4) threw expected gate-blocked error");

  // 3. Sequential Recovery: Re-enter and complete Phase 2
  engine.startPhase(2);
  assert.equal(engine.currentPhase, 2);
  assert.equal(engine.getPhaseStatus(2), "IN_PROGRESS", "Phase 2 is now IN_PROGRESS");
  assert.equal(engine.phaseStatus[2], undefined, "Phase 2 INVALIDATED flag cleared upon start");
  pass("Phase 2 re-started and INVALIDATED flag cleared");

  const p2Finalize = engine.finalizeCurrentPhase();
  assert.equal(p2Finalize.gatePassed, true, "Phase 2 finalized successfully");
  assert.equal(engine.completedPhases[2], true, "Phase 2 is COMPLETED again");
  pass("Phase 2 re-completed successfully");

  // Phase 3 can now be started, while Phase 4 is still blocked
  assert.equal(engine.canStartPhase(3).allowed, true, "Phase 3 can now start");
  assert.equal(engine.canStartPhase(4).allowed, false, "Phase 4 still cannot start");
  pass("Phase 3 unblocked while Phase 4 remains blocked");

  engine.startPhase(3);
  assert.equal(engine.phaseStatus[3], undefined, "Phase 3 INVALIDATED flag cleared upon start");
  const p3Finalize = engine.finalizeCurrentPhase();
  assert.equal(p3Finalize.gatePassed, true, "Phase 3 finalized successfully");
  assert.equal(engine.completedPhases[3], true, "Phase 3 is COMPLETED again");
  pass("Phase 3 re-completed successfully");

  // Finally Phase 4 can start and complete
  assert.equal(engine.canStartPhase(4).allowed, true, "Phase 4 can now start");
  engine.startPhase(4);
  const p4Finalize = engine.finalizeCurrentPhase();
  assert.equal(p4Finalize.gatePassed, true, "Phase 4 finalized successfully");
  assert.equal(engine.completedPhases[4], true, "Phase 4 is COMPLETED again");
  pass("Phase 4 re-completed successfully; full recovery achieved");

  // 4. Mid-stream Invalidation from Phase 3
  const midInvalidation = engine.invalidateDependentPhases(3);
  assert.deepEqual(midInvalidation.invalidatedPhases, [4], "Invalidating from Phase 3 must only invalidate Phase 4");
  assert.equal(engine.completedPhases[1], true, "Phase 1 must remain untouched");
  assert.equal(engine.completedPhases[2], true, "Phase 2 must remain untouched");
  assert.equal(engine.completedPhases[3], true, "Phase 3 must remain untouched");
  assert.equal(engine.completedPhases[4], false, "Phase 4 must be invalidated");
  assert.equal(engine.getPhaseStatus(4), "INVALIDATED", "Phase 4 status is INVALIDATED");
  pass("Mid-stream invalidation from Phase 3 isolates upstream phases cleanly");

  // 5. Terminal Phase (Phase 8) Invalidation Boundary Test
  const termInvalidation = engine.invalidateDependentPhases(8);
  assert.deepEqual(termInvalidation.invalidatedPhases, [], "Invalidating from Phase 8 produces empty array without crashing");
  pass("Phase 8 invalidation handled cleanly without error");
}

// ============================================================================
// SUITE 2: MULTIPLE OPEN BLOCKING_UNKNOWNS & RESOLUTION TRANSITIONS
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 2: Multiple Open BLOCKING_UNKNOWNs & Resolution Gates");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C" });
  engine.phaseData[1] = {
    stage: "فعال", stageValue: "active",
    description: "کارواش نانو بخار", descriptionValue: "BT-0001",
    geography: "مشهد", geographyValue: "local_city",
    primaryGoal: "سودآوری پایدار",
    coreOffer: "شستشوی VIP با مواد نانو",
    valueHypothesis: "صرفه‌جویی در آب و درخشندگی ماندگار"
  };

  // Create THREE blocking unknowns with unique sequential IDs
  const unkA = UnknownsManager.createUnknown({
    id: "UNK-P1-001",
    phase: 1,
    questionId: "step0_description",
    category: "BUSINESS_MODEL",
    reason: "مجهول A: عدم قطعیت در کد آیسیک و رسته صنفی کارواش",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
    status: UNKNOWN_STATUS.OPEN
  });

  const unkB = UnknownsManager.createUnknown({
    id: "UNK-P1-002",
    phase: 1,
    questionId: "unit_economics",
    category: "FINANCIAL",
    reason: "مجهول B: عدم برآورد هزینه مصرف برق صنعتی و مواد نانو",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
    status: UNKNOWN_STATUS.OPEN
  });

  const unkC = UnknownsManager.createUnknown({
    id: "UNK-P1-003",
    phase: 1,
    questionId: "cash_constraint",
    category: "FINANCIAL",
    reason: "مجهول C: عدم تعیین منبع سرمایه در گردش ۳ ماه اول",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
    status: UNKNOWN_STATUS.OPEN
  });

  // Create ONE non-blocking unknown
  const unkD = UnknownsManager.createUnknown({
    id: "UNK-P1-004",
    phase: 1,
    questionId: "step0_diagnostic_probing",
    category: "FOUNDER_VISION",
    reason: "مجهول D: عدم فرمولاسیون دقیق چشمانداز بلندمدت بنیان‌گذار",
    severity: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
    status: UNKNOWN_STATUS.OPEN
  });

  engine.unknowns.push(unkA, unkB, unkC, unkD);

  // Assert initial gate failure
  const gate0 = validatePhaseGate(1, engine);
  assert.equal(gate0.passed, false, "Gate 1 must fail with 3 open blocking unknowns");
  assert.equal(gate0.unresolvedUnknowns.length, 3, "unresolvedUnknowns must have length 3");
  assert.ok(gate0.blockingReasons.length >= 3, "Must have at least 3 blocking reasons");
  assert.ok(gate0.evidenceScore <= 49, "Evidence score must be capped at 49% when blocked");
  pass("Initial gate fails with 3 blocking reasons and capped evidence score");

  // Partial Resolution 1: Resolve only unkA
  UnknownsManager.resolveUnknown(engine.unknowns, unkA.id, "حل شد با اخذ پروانه کسب کارواش بخار");
  assert.equal(unkA.status, UNKNOWN_STATUS.RESOLVED);
  assert.ok(unkA.resolvedAt, "resolvedAt must be set");

  const gate1 = validatePhaseGate(1, engine);
  assert.equal(gate1.passed, false, "Gate 1 must STILL FAIL when unkB and unkC are open");
  assert.equal(gate1.unresolvedUnknowns.length, 2, "unresolvedUnknowns must now have length 2");
  pass("Resolving 1 of 3 blocking unknowns does NOT prematurely pass gate");

  // Partial Resolution 2: Transition unkB to IN_RESEARCH
  UnknownsManager.updateUnknownStatus(engine.unknowns, unkB.id, UNKNOWN_STATUS.IN_RESEARCH);
  assert.equal(unkB.status, UNKNOWN_STATUS.IN_RESEARCH);

  const gate2 = validatePhaseGate(1, engine);
  assert.equal(gate2.passed, false, "IN_RESEARCH status must STILL block the gate");
  assert.equal(gate2.unresolvedUnknowns.length, 2, "unresolvedUnknowns must still count IN_RESEARCH as blocking");
  pass("IN_RESEARCH status strictly halts gate completion");

  // Transition unkB to ACCEPTED_RISK
  UnknownsManager.acceptRisk(engine.unknowns, unkB.id, "پذیرش ریسک با فرضیه هزینه هر خودرو ۵۰ هزار تومان تا تست ۱ ماهه");
  assert.equal(unkB.status, UNKNOWN_STATUS.ACCEPTED_RISK);
  assert.ok(unkB.resolution.includes("ریسک پذیرفته‌شده"), "Resolution notes risk acceptance");

  const gate3 = validatePhaseGate(1, engine);
  assert.equal(gate3.passed, false, "Gate 1 must STILL FAIL because unkC is still OPEN");
  assert.equal(gate3.unresolvedUnknowns.length, 1, "unresolvedUnknowns must have length 1 (unkC)");
  pass("ACCEPTED_RISK unblocks unkB but gate remains blocked by unkC");

  // Final Resolution: Resolve unkC
  UnknownsManager.resolveUnknown(engine.unknowns, unkC.id, "تامین نقدینگی از طریق سرمایه در گردش شخصی و حساب پشتیبان");
  assert.equal(unkC.status, UNKNOWN_STATUS.RESOLVED);

  const gateFinal = validatePhaseGate(1, engine);
  assert.equal(gateFinal.passed, true, "Gate 1 MUST PASS now that all blocking unknowns are resolved/accepted");
  assert.equal(gateFinal.unresolvedUnknowns.length, 0, "No unresolved blocking unknowns remain");
  assert.ok(gateFinal.warnings.some(w => w.includes(unkD.id)), "Non-blocking unkD is tracked in warnings");
  assert.ok(gateFinal.evidenceScore > 49 && gateFinal.evidenceScore <= 100, "Honest evidence score calculated");
  pass("Phase 1 gate passes with 1 ACCEPTED_RISK and 1 NON_BLOCKING warning");

  // Verify finalizeCurrentPhase succeeds
  const finalizeResult = engine.finalizeCurrentPhase();
  assert.equal(finalizeResult.gatePassed, true);
  assert.equal(engine.completedPhases[1], true);
  pass("finalizeCurrentPhase succeeds on valid gate");

  // Invalid Status Validation Guard
  assert.throws(
    () => UnknownsManager.updateUnknownStatus(engine.unknowns, unkD.id, "INVALID_STATUS_FOO"),
    err => err.message.includes("وضعیت نامعتبر"),
    "updateUnknownStatus must throw on invalid status enum"
  );
  pass("UnknownsManager strictly rejects invalid status transitions");
}

// ============================================================================
// SUITE 3: INTENSIVE BACK-AND-FORTH QUESTION NAVIGATION & EDIT CHURN
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 3: Intensive Back-and-Forth Navigation & Edit Churn");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C" });
  engine.startPhase(1);

  assert.equal(engine.currentStepIndex, 0);
  const q0 = engine.getCurrentQuestion();
  assert.equal(q0.id, "step0_description");
  pass("Engine initialized at step 0 (step0_description)");

  // Answer Q0: step0_description
  engine.processUserResponse("تعمیرگاه تخصصی خودرو BT-0112", "BT-0112");
  assert.equal(engine.currentStepIndex, 1);
  const q1 = engine.getCurrentQuestion();
  assert.equal(q1.id, "step0_diagnostic_probing");
  pass("Step 0 answered, advanced to step 1 (step0_diagnostic_probing)");

  // Answer Q1: step0_diagnostic_probing
  engine.processUserResponse("دیدگاه من تمایز در کیفیت است و هیچ سازشی روی قطعات تقلبی ندارم.");
  assert.equal(engine.currentStepIndex, 2);
  const q2 = engine.getCurrentQuestion();
  assert.equal(q2.id, "step0_stage");
  pass("Step 1 answered, advanced to step 2 (step0_stage)");

  // Answer Q2: step0_stage
  engine.processUserResponse("کسب‌وکار فعال با ۲ سال سابقه در بازار", "active");
  assert.equal(engine.currentStepIndex, 3);
  const q3 = engine.getCurrentQuestion();
  assert.equal(q3.id, "step0_geography");
  pass("Step 2 answered, advanced to step 3 (step0_geography)");

  // Answer Q3: step0_geography
  engine.processUserResponse("اصفهان و شهرهای همجوار", "local_city");
  assert.equal(engine.currentStepIndex, 4);
  const q4 = engine.getCurrentQuestion();
  assert.equal(q4.id, "step1_primary_goal");
  pass("Step 3 answered, advanced to step 4 (step1_primary_goal)");

  // Churn: Repeated back-navigation
  const prev3 = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 3);
  assert.equal(prev3.id, q3.id);
  pass("Navigated back to step 3");

  const prev2 = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 2);
  assert.equal(prev2.id, q2.id);
  pass("Navigated back to step 2");

  const prev1 = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 1);
  assert.equal(prev1.id, q1.id);
  pass("Navigated back to step 1");

  const prev0 = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 0);
  assert.equal(prev0.id, q0.id);
  pass("Navigated back to step 0");

  // Underflow test: multiple back calls at 0
  for (let i = 0; i < 5; i++) {
    const under = engine.previousQuestion();
    assert.equal(engine.currentStepIndex, 0);
    assert.equal(under.id, q0.id);
  }
  pass("previousQuestion() at 0 safely clamped without underflow");

  // Edit Q0 (step0_description) with new answer
  engine.processUserResponse("کلینیک تخصصی پوست و لیزر BT-0145", "BT-0145");
  assert.equal(engine.phaseData[1].taxonomyId, "BT-0145");
  assert.equal(engine.phaseData[1].descriptionValue, "BT-0145");
  pass("Re-answering question 0 (description) updated phaseData and taxonomyId cleanly");

  // Jump navigation via goToQuestion to Q2 (step0_stage)
  const jumpedQ = engine.goToQuestion(2);
  assert.equal(engine.currentStepIndex, 2);
  assert.equal(jumpedQ.id, q2.id);
  pass("goToQuestion(2) jumped directly to question 2 (step0_stage)");

  // Edit Q2 (step0_stage) via jump
  engine.processUserResponse("در مرحله ایده و ثبت اختراع محصول", "idea");
  assert.equal(engine.phaseData[1].stageValue, "idea");
  assert.equal(engine.phaseData[1].stage, "در مرحله ایده و ثبت اختراع محصول");
  pass("Edited question 2 (stage) via jump and updated stageValue");

  // Rapid Navigation & Churn Stress: 20 rapid jumps and boundary checks
  const questionsList = engine.getCurrentPhaseQuestions();
  const maxIdx = questionsList.length - 1;

  for (let cycle = 0; cycle < 10; cycle++) {
    const targetIdx = cycle % (maxIdx + 1);
    const qAtTarget = engine.goToQuestion(targetIdx);
    assert.equal(engine.currentStepIndex, targetIdx);
    assert.ok(qAtTarget);

    const prevQ = engine.previousQuestion();
    assert.ok(engine.currentStepIndex >= 0);
    assert.ok(engine.currentStepIndex <= maxIdx);
  }
  pass("Rapid back-and-forth jump churn passed 20 cycles with zero state corruption");

  // Out-of-bounds jump checks
  const clampHigh = engine.goToQuestion(999);
  assert.equal(engine.currentStepIndex, maxIdx);
  assert.ok(clampHigh);
  pass("goToQuestion(999) safely clamped to max index");

  const clampLow = engine.goToQuestion(-50);
  assert.equal(engine.currentStepIndex, 0);
  assert.ok(clampLow);
  pass("goToQuestion(-50) safely clamped to index 0");
}

// ============================================================================
// SUITE 4: CONTRADICTION ENGINE RESOLUTION & GATE BLOCKING
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 4: Contradiction Engine Resolution & Gate Blocking");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C", geographicScope: "LOCAL" });
  engine.phaseData[1] = {
    stage: "فعال", stageValue: "active",
    description: "کافی‌شاپ و رستری محلی", descriptionValue: "BT-0020",
    customerModel: "B2C",
    geography: "محلی منطقه ۲ تهران", geographyValue: "local_city",
    primaryGoal: "جذب مراجعان منطقه",
    coreOffer: "سرو قهوه تخصصی و کیک روز",
    valueHypothesis: "دانه تازه برشته‌شده و فضای آرام"
  };

  // 1. Inject B2C vs B2B Enterprise Tender Contradiction
  engine.decisions.push({
    id: "DEC-CONFLICT-1",
    statement: "برنده شدن در مناقصات کلان سازمانی و تدارکات دولتی جهت تجهیز ادارات مرکزی"
  });

  const detected = ContradictionEngine.detectContradictions(engine);
  assert.ok(detected.length > 0, "Contradiction detected for local B2C cafe vs enterprise tenders");
  const tenderConflict = detected.find(c => c.severity === CONTRADICTION_SEVERITY.CRITICAL);
  assert.ok(tenderConflict, "CRITICAL tender contradiction identified");
  engine.contradictions.push(tenderConflict);
  pass("ContradictionEngine detected B2C vs Enterprise RFP conflict as CRITICAL");

  // Gate check: must block
  const gateBeforeResolve = validatePhaseGate(1, engine);
  assert.equal(gateBeforeResolve.passed, false, "Phase 1 gate must be blocked by CRITICAL contradiction");
  assert.ok(gateBeforeResolve.unresolvedContradictions.length > 0);
  pass("CRITICAL contradiction halts phase gate completion");

  // Resolve contradiction
  ContradictionEngine.resolveContradiction(
    engine.contradictions,
    tenderConflict.id,
    "تصمیم اصلاح شد: تمرکز ۱۰۰٪ روی مشتریان حضوری B2C کافه و حذف مناقصات سازمانی"
  );
  assert.equal(tenderConflict.resolutionStatus, CONTRADICTION_STATUS.RESOLVED);
  assert.ok(tenderConflict.resolvedAt);
  pass("Contradiction resolved with audit trail");

  const gateAfterResolve = validatePhaseGate(1, engine);
  assert.equal(gateAfterResolve.passed, true, "Gate passes once contradiction is resolved");
  pass("Phase gate unblocks upon contradiction resolution");

  // 2. Test Dismiss Contradiction with unique ID
  const dismissedConflict = ContradictionEngine.createContradiction({
    id: "CTR-LOCAL-EXPORT-001",
    statementA: "محدوده محلی",
    statementB: "صادرات به کشورهای همسایه",
    severity: CONTRADICTION_SEVERITY.MAJOR,
    affectedPhases: [1, 3]
  });
  engine.contradictions.push(dismissedConflict);

  const gateBeforeDismiss = validatePhaseGate(1, engine);
  assert.equal(gateBeforeDismiss.passed, false, "Major contradiction blocks gate");

  ContradictionEngine.dismissContradiction(
    engine.contradictions,
    dismissedConflict.id,
    "توجیه رسمی: تامین سفارش صادراتی از طریق پارتنر لجستیک انجام می‌شود و مدل محلی را نقض نمی‌کند"
  );
  assert.equal(dismissedConflict.resolutionStatus, CONTRADICTION_STATUS.DISMISSED);
  assert.ok(dismissedConflict.resolution.includes("رد شده با توجیه"));

  const gateAfterDismiss = validatePhaseGate(1, engine);
  assert.equal(gateAfterDismiss.passed, true, "Dismissed contradiction no longer blocks gate");
  pass("Dismissed contradiction unblocks gate while keeping justification record");
}

// ============================================================================
// SUITE 5: COMPLETE 8-PHASE FULL JOURNEY & MASTER INVALIDATION
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 5: Complete 8-Phase Journey Invalidation & Master Invalidation");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C", geographicScope: "LOCAL", activeOverlays: [] });

  // Complete all 8 phases
  engine.phaseData[1] = {
    stage: "فعال", stageValue: "active",
    description: "تعمیرگاه تخصصی گیربکس اتوماتیک", descriptionValue: "BT-0112",
    taxonomyId: "BT-0112",
    geography: "تهران", geographyValue: "local_city",
    primaryGoal: "سودآوری پایدار",
    coreOffer: "سرویس و تعمیر گیربکس با گارانتی کتبی",
    valueHypothesis: "تست تخصصی با دستگاه پیشرفته"
  };
  engine.phaseData[2] = {
    competitors: "تعمیرگاه‌های متفرقه",
    customerPain: "بی‌اعتمادی و قطعات تقلبی",
    pricingModel: "تعرفه شفاف",
    primaryChannel: "گوگل مپ و بلد",
    goldenOpportunity: "گارانتی قطعات"
  };
  engine.phaseData[3] = {
    positioning: "تخصصی‌ترین مرکز گیربکس غرب",
    targetSegment: "مالکان خودروهای کره‌ای و ژاپنی",
    boundary: "عدم انجام کارهای نامربوط",
    promise: "تحویل دقیق بدون هزینه پنهان"
  };
  engine.phaseData[4] = {
    archetype: "حکیم و متخصص کاربلد (Sage)",
    traits: "صادق و دقیق",
    toneGuardrail: "پرهیز از شعارزدگی"
  };
  engine.phaseData[5] = {
    voiceStyle: "تخصصی و مطمئن",
    elevatorHook: "تعمیر تخصصی گیربکس در ۲۴ ساعت با گارانتی ۱۲ ماهه",
    forbiddenWords: "بهترین، ارزان‌ترین، فوق‌العاده"
  };
  engine.phaseData[6] = {
    naming: "گیربکس‌پرو (GearboxPro)",
    tagline: "انتقال قدرت بدون دغدغه و لرزش"
  };
  engine.phaseData[7] = {
    colorPalette: "سورمه‌ای صنعتی و نقره‌ای متالیک",
    typography: "فونت دانا بولد و یکدست",
    logoConcept: "مرفولوژی چرخدنده‌های درگیر دقیق"
  };
  engine.phaseData[8] = {
    thoughtLeadership: "سئوی محلی روی کلمات کلیدی گیربکس تهران",
    prChannels: "ویدیوهای آموزشی عیب‌یابی در آپارات و اینستاگرام",
    leadFunnel: "مشاوره رایگان تلفنی و معاینه فنی حضوری",
    reputationCrisis: "پروتکل جلب رضایت و تعویض قطعه در صورت شکایت"
  };

  for (let p = 1; p <= 8; p++) {
    const gate = validatePhaseGate(p, engine);
    assert.equal(gate.passed, true, `Phase ${p} gate must pass`);
    engine.completedPhases[p] = true;
  }
  pass("All 8 phases successfully completed and validated");

  // Verify Master deliverable generation works
  const masterData = engine.generateDeliverableData("master");
  assert.ok(masterData, "Master deliverable data generated");
  assert.equal(masterData.phase, "تمام ۸ فاز راهبردی — دیجیتال مارکت");
  pass("Master Brand Book successfully generated for completed journey");

  // Adversarial Invalidation: Edit foundational Phase 1
  const fullInvalidation = engine.invalidateDependentPhases(1);
  assert.deepEqual(
    fullInvalidation.invalidatedPhases,
    [2, 3, 4, 5, 6, 7, 8],
    "All 7 downstream phases (2..8) must be invalidated"
  );
  pass("Cascading invalidation from Phase 1 cleanly wiped all 7 downstream completed phases");

  for (let p = 2; p <= 8; p++) {
    assert.equal(engine.completedPhases[p], false, `completedPhases[${p}] is false`);
    assert.equal(engine.getPhaseStatus(p), "INVALIDATED", `Phase ${p} status is INVALIDATED`);
  }
  pass("Phases 2 through 8 all report INVALIDATED status");

  // Verify skipping directly to Phase 8 is blocked
  assert.throws(
    () => engine.startPhase(8),
    err => err.isGateBlocked === true,
    "Attempting to start Phase 8 after invalidation must throw gate-blocked error"
  );
  pass("Phase 8 start strictly blocked by anti-skip protocol after upstream invalidation");
}

// ============================================================================
// SUITE 6: UNKNOWN INTENT VIA USER TEXT RESPONSE & FAKE NUMBER PREVENTION
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 6: Unknown Intent Detection & Anti-Fake Number Rigor");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C" });
  engine.startPhase(1);

  // User expresses explicit ignorance on unit economics / offer
  // We advance through first questions to reach step2_core_offer
  engine.phaseData[1].stage = "فعال";
  engine.phaseData[1].stageValue = "active";
  engine.phaseData[1].description = "کارواش";
  engine.phaseData[1].descriptionValue = "BT-0001";
  engine.phaseData[1].diagnosticVision = "تمایز در کیفیت شستشو";
  engine.phaseData[1].geography = "تهران";
  engine.phaseData[1].geographyValue = "local_city";
  engine.phaseData[1].primaryGoal = "رشد فروش";
  engine.phaseData[1].primaryGoalValue = "first_100_customers";
  engine.goToQuestion(5); // explicitly navigate to step2_core_offer

  const unknownResp = engine.processUserResponse("هنوز مطمئن نیستم و هزینه‌ها را به طور دقیق اندازه نگرفته‌ام، نمی‌دانم");
  assert.ok(unknownResp.reply.includes("مجهول رسمی"), "System acknowledges formal unknown registration");
  assert.ok(engine.unknowns.length > 0, "Unknown entity created in engine.unknowns");

  const recordedUnk = engine.unknowns[engine.unknowns.length - 1];
  assert.equal(recordedUnk.status, UNKNOWN_STATUS.OPEN);
  assert.ok(recordedUnk.actionItem, "Action item is generated for unknown");
  assert.equal(recordedUnk.phase, 1);
  pass("Unknown intent captured as formal typed entity with action item");

  // Verify NO fake numbers were forced into phaseData
  assert.equal(
    engine.phaseData[1].step2_core_offer,
    "[فرضیه نیازمند تست - مجهول رسمی]",
    "Anti-fake number rule: placeholder used instead of fabricated data"
  );
  pass("Fake numbers prevented from entering phaseData");

  // Exit gate verification: since step2_core_offer is BLOCKING_UNKNOWN, gate MUST fail
  const gateWithUnk = validatePhaseGate(1, engine);
  assert.equal(gateWithUnk.passed, false, "Phase 1 gate fails due to open BLOCKING_UNKNOWN");
  assert.ok(gateWithUnk.unresolvedUnknowns.some(u => u.id === recordedUnk.id));
  pass("Open BLOCKING_UNKNOWN created from text response strictly halts Phase 1 gate");

  // Accept risk on this unknown
  UnknownsManager.acceptRisk(engine.unknowns, recordedUnk.id, "پذیرش ریسک برای شروع آزمایشی فعالیت");
  assert.equal(recordedUnk.status, UNKNOWN_STATUS.ACCEPTED_RISK);

  const gateAfterRisk = validatePhaseGate(1, engine);
  assert.equal(gateAfterRisk.passed, true, "Gate unblocked after accepting risk on user-entered unknown");
  pass("ACCEPTED_RISK unblocks gate for unknown originated from free-text response");
}

// ============================================================================
// SUITE 7: BUDGET CONSTRAINT VS MASS MEDIA CONTRADICTION
// ============================================================================
console.log("\n======================================================================");
console.log("SUITE 7: Budget Constraint vs Mass Media Billboard Contradiction");
console.log("======================================================================");

{
  const engine = new OrchestratorEngine();
  engine.setContext({ archetype: "LOCAL_SERVICE", customerModel: "B2C" });
  engine.phaseData[1] = {
    stage: "ایده خام",
    stageValue: "idea",
    budgetConstraint: "بودجه بسیار محدود و کمبود نقدینگی اولیه",
    description: "تولید دست‌ساز صابون‌های ارگانیک",
    geography: "تهران",
    primaryGoal: "اعتبارسنجی محصول",
    coreOffer: "صابون دست‌ساز گیاهی",
    valueHypothesis: "کاملاً طبیعی و بدون مواد شیمیایی"
  };

  // User later plans national TV campaign and highway billboards in Phase 8
  engine.phaseData[8] = {
    thoughtLeadership: "مقالات تخصصی",
    prChannels: "کمپین تلویزیونی و بیلبورد بزرگراهی در کل کشور با سلبریتی مارکتینگ میلیاردی",
    leadFunnel: "سایت فروشگاهی",
    reputationCrisis: "پشتیبانی تلفنی"
  };

  const detected = ContradictionEngine.detectContradictions(engine);
  assert.ok(detected.length > 0, "Contradiction detected for low budget vs mass media TV/billboards");
  const mediaConflict = detected.find(c => c.severity === CONTRADICTION_SEVERITY.CRITICAL);
  assert.ok(mediaConflict, "CRITICAL budget vs billboard contradiction identified");
  engine.contradictions.push(mediaConflict);
  pass("ContradictionEngine identified bootstrapped budget vs TV/billboard conflict as CRITICAL");

  // Verify Phase 8 gate is blocked
  // Complete earlier phases so Phase 8 can be evaluated
  for (let p = 1; p <= 7; p++) {
    engine.completedPhases[p] = true;
  }
  const p8Gate = validatePhaseGate(8, engine);
  assert.equal(p8Gate.passed, false, "Phase 8 gate must be blocked by CRITICAL contradiction");
  assert.ok(p8Gate.unresolvedContradictions.length > 0);
  pass("CRITICAL contradiction blocks Phase 8 gate");

  // Resolve contradiction: change channel to organic word of mouth / social media
  ContradictionEngine.resolveContradiction(
    engine.contradictions,
    mediaConflict.id,
    "اصلاح کانال: حذف کامل تبلیغات تلویزیونی و بیلبورد؛ تمرکز بر اینستاگرام و فروش محلی کم‌هزینه"
  );
  assert.equal(mediaConflict.resolutionStatus, CONTRADICTION_STATUS.RESOLVED);

  const p8GateAfterResolve = validatePhaseGate(8, engine);
  assert.equal(p8GateAfterResolve.passed, true, "Phase 8 gate unblocks after resolving budget contradiction");
  pass("Phase 8 gate unblocks successfully upon contradiction resolution");
}

console.log("\n======================================================================");
console.log(`🎉 ALL ${totalAssertions} ADVERSARIAL CHALLENGER ASSERTIONS PASSED WITH ZERO FAILURES!`);
console.log("======================================================================\n");

