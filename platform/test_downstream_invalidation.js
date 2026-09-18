import { strict as assert } from "node:assert";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";
import { UnknownsManager, UNKNOWN_STATUS, UNKNOWN_SEVERITY } from "./src/services/unknownsManager.js";
import { ContradictionEngine, CONTRADICTION_SEVERITY } from "./src/services/contradictionEngine.js";
import { validatePhaseGate } from "./src/services/phaseGateValidator.js";

console.log("======================================================================");
console.log("RUNNING SUITE: DOWNSTREAM INVALIDATION & STATE ARCHITECTURE (M3)");
console.log("======================================================================");

let passedCount = 0;
function pass(desc) {
  passedCount++;
  console.log('  PASS: ' + desc);
}

// 1. Anti-Skip Protocol & Phase Progression Guard
console.log("\nTEST GROUP 1: Anti-Skip Protocol & Phase Progression");

{
  const engine = new OrchestratorEngine();
  
  const p1Check = engine.canStartPhase(1);
  assert.equal(p1Check.allowed, true);
  pass("Phase 1 is allowed to start immediately");

  [2, 3, 5, 8].forEach(target => {
    const check = engine.canStartPhase(target);
    assert.equal(check.allowed, false, 'Phase ' + target + ' should not start when prerequisites incomplete');
    assert.ok(check.reason.includes("ورود به فاز"), "Rejection reason provides actionable Persian message");
    pass('canStartPhase(' + target + ') is strictly rejected when Phase 1 is incomplete');

    assert.throws(
      () => engine.startPhase(target),
      (err) => {
        return err.isGateBlocked === true && err.phase === target;
      },
      'startPhase(' + target + ') must throw error with isGateBlocked=true'
    );
    pass('startPhase(' + target + ') throws gate-blocked error on illegal skip');
  });

  [-1, 0, 9, 99, "invalid"].forEach(badPhase => {
    const check = engine.canStartPhase(badPhase);
    assert.equal(check.allowed, false);
    pass('canStartPhase(' + badPhase + ') handles out-of-bounds cleanly');
  });
}

// 2. Typed Unknowns Manager (BLOCKING vs NON-BLOCKING)
console.log("\nTEST GROUP 2: Typed Unknowns Lifecycle & Phase Gate Impact");

{
  const engine = new OrchestratorEngine();
  engine.setContext({
    archetype: "LOCAL_SERVICE",
    title: "تعمیرات لوازم خانگی",
    customerModel: "B2C"
  });

  engine.phaseData[1] = {
    description: "تعمیرگاه تخصصی لوازم خانگی و یخچال فریزر در شیراز",
    stage: "active",
    geography: "local_city",
    primaryGoal: "افزایش سهم بازار و وفادارسازی مشتریان",
    coreOffer: "سرویس و تعمیرات تخصصی در محل مشتری",
    valueHypothesis: "تکنسین‌های مجرب و ضمانت قطعات اورجینال"
  };

  const blockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step0_unit_economics",
    category: "FINANCIAL",
    reason: "عدم آگاهی از حاشیه سود ناخالص قطعات و هزینه ایاب و ذهاب",
    severity: UNKNOWN_SEVERITY.BLOCKING
  });

  engine.unknowns.push(blockingUnknown);

  const gateBefore = validatePhaseGate(1, engine);
  assert.equal(gateBefore.passed, false, "Phase 1 gate must fail with unresolved BLOCKING_UNKNOWN");
  assert.ok(gateBefore.unresolvedUnknowns.length > 0, "Unresolved unknowns registered in gate");
  assert.ok(gateBefore.blockingReasons.some(r => r.includes("مجهول مسدودکننده")), "Blocking reason cites unknown");
  pass("Unresolved BLOCKING_UNKNOWN halts Phase 1 gate completion");

  UnknownsManager.acceptRisk(engine.unknowns, blockingUnknown.id, "پذیرش ریسک موقت تا پایان ماه اول فعالیت میدانی");
  const gateAfterRisk = validatePhaseGate(1, engine);
  assert.equal(gateAfterRisk.passed, true, "ACCEPTED_RISK allows Phase 1 gate to pass");
  pass("ACCEPTED_RISK status allows phase gate to pass");

  const nonBlockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step0_secondary_channel",
    category: "MARKETING",
    reason: "عدم قطعیت در اثربخشی تراکت‌های تبلیغاتی محله‌ای",
    severity: UNKNOWN_SEVERITY.NON_BLOCKING,
    existingCount: engine.unknowns.length
  });
  assert.notEqual(blockingUnknown.id, nonBlockingUnknown.id, "Unknown IDs must be strictly unique");
  engine.unknowns.push(nonBlockingUnknown);

  const gateWithNonBlocking = validatePhaseGate(1, engine);
  assert.equal(gateWithNonBlocking.passed, true, "NON_BLOCKING_UNKNOWN does not halt gate");
  assert.ok(gateWithNonBlocking.warnings.some(w => w.includes("مجهول غیرمسدودکننده")), "Warning registered for non-blocking unknown");
  pass("NON_BLOCKING_UNKNOWN allows gate to pass with warning record");

  const updated = UnknownsManager.updateUnknownStatus(engine.unknowns, nonBlockingUnknown.id, UNKNOWN_STATUS.RESOLVED, "تراکت حذف و تبلیغات اینستاگرام جایگزین شد");
  assert.equal(updated.status, UNKNOWN_STATUS.RESOLVED);
  assert.equal(nonBlockingUnknown.status, UNKNOWN_STATUS.RESOLVED);
  assert.ok(updated.resolvedAt);
  pass("UnknownsManager.updateUnknownStatus transitions status with resolution timestamp");
}

// 3. Contradiction Resolution & Gate Halt
console.log("\nTEST GROUP 3: Contradiction Detection & Gate Blocking");

{
  const engine = new OrchestratorEngine();
  engine.setContext({
    archetype: "LOCAL_SERVICE",
    title: "نانوایی فانتزی محلی",
    customerModel: "B2C"
  });

  engine.phaseData[1] = {
    description: "نانوایی فانتزی و باگت محلی در محدوده سعادت‌آباد",
    stage: "active",
    geography: "local_city",
    customerModel: "B2C",
    primaryGoal: "جذب اهالی منطقه",
    coreOffer: "پخت روزانه نان‌های حجیم فرانسوی",
    valueHypothesis: "کیفیت آرد و پخت سنتی روزانه"
  };

  engine.decisions.push({
    id: "D-P3-1",
    statement: "استراتژی توسعه ما متکی بر صادرات بین‌المللی و حمل‌ونقل دریایی کانتینری به اروپا است."
  });

  const detected = ContradictionEngine.detectContradictions(engine);
  assert.ok(detected.length > 0, "Contradiction detected for local bakery vs international export");
  const exportConflict = detected.find(c => c.statementB.includes("صادرات"));
  assert.ok(exportConflict, "Found export conflict contradiction");
  assert.equal(exportConflict.severity, CONTRADICTION_SEVERITY.MAJOR);
  pass("ContradictionEngine detects geographic scope conflict");

  engine.contradictions.push(exportConflict);

  engine.decisions.push({
    id: "D-P3-2",
    statement: "کانال اصلی فروش برنده شدن در مناقصات تدارکات سازمانی و قراردادهای دولتی بزرگ است."
  });
  const criticalDetected = ContradictionEngine.detectContradictions(engine);
  const tenderConflict = criticalDetected.find(c => c.statementB.includes("مناقصات"));
  assert.ok(tenderConflict, "Found tender conflict contradiction");
  assert.equal(tenderConflict.severity, CONTRADICTION_SEVERITY.CRITICAL);
  engine.contradictions.push(tenderConflict);

  const gateResult = validatePhaseGate(1, engine);
  assert.equal(gateResult.passed, false, "Critical contradiction strictly halts gate completion");
  assert.ok(gateResult.unresolvedContradictions.length > 0, "Unresolved contradictions listed in gate");
  pass("CRITICAL contradiction halts phase gate completion");
}

// 4. Downstream Invalidation Graph
console.log("\nTEST GROUP 4: Downstream Invalidation Graph (Phases 1 to 8)");

{
  const engine = new OrchestratorEngine();
  
  for (let p = 1; p <= 5; p++) {
    engine.completedPhases[p] = true;
  }

  assert.equal(engine.getPhaseStatus(1), "COMPLETED");
  assert.equal(engine.getPhaseStatus(5), "COMPLETED");
  assert.equal(engine.getPhaseStatus(6), "AVAILABLE");
  assert.equal(engine.getPhaseStatus(7), "LOCKED");
  pass("Initial phase status correctly reported as COMPLETED, AVAILABLE, and LOCKED");

  const invResult1 = engine.invalidateDependentPhases(1);
  assert.deepEqual(invResult1.invalidatedPhases, [2, 3, 4, 5]);
  assert.equal(engine.completedPhases[1], true, "Phase 1 completion preserved");
  assert.equal(engine.completedPhases[2], false, "Phase 2 invalidated");
  assert.equal(engine.completedPhases[3], false, "Phase 3 invalidated");
  assert.equal(engine.completedPhases[4], false, "Phase 4 invalidated");
  assert.equal(engine.completedPhases[5], false, "Phase 5 invalidated");
  assert.equal(engine.getPhaseStatus(2), "INVALIDATED");
  assert.equal(engine.getPhaseStatus(3), "INVALIDATED");
  assert.ok(invResult1.message.includes("هشدار ابطال فازهای وابسته"));
  pass("Invalidating from Phase 1 cascades to all downstream completed phases (2..5)");

  delete engine.phaseStatus[2];
  delete engine.phaseStatus[3];
  delete engine.phaseStatus[4];
  delete engine.phaseStatus[5];
  for (let p = 2; p <= 5; p++) {
    engine.completedPhases[p] = true;
  }

  const invResult3 = engine.invalidateDependentPhases(3);
  assert.deepEqual(invResult3.invalidatedPhases, [4, 5]);
  assert.equal(engine.completedPhases[1], true, "Phase 1 untouched");
  assert.equal(engine.completedPhases[2], true, "Phase 2 untouched");
  assert.equal(engine.completedPhases[3], true, "Phase 3 untouched");
  assert.equal(engine.completedPhases[4], false, "Phase 4 invalidated");
  assert.equal(engine.completedPhases[5], false, "Phase 5 invalidated");
  pass("Invalidating from Phase 3 affects only downstream phases (4 and 5)");

  const invResult7 = engine.invalidateDependentPhases(7);
  assert.deepEqual(invResult7.invalidatedPhases, []);
  assert.ok(invResult7.message.includes("هیچ فاز تکمیلی"));
  pass("Invalidating when no downstream phases completed produces clean message");
}

// 5. Back / Edit Navigation
console.log("\nTEST GROUP 5: Back/Edit Navigation & Dynamic Question Re-answering");

{
  const engine = new OrchestratorEngine();
  engine.setContext({
    archetype: "RESTAURANT_CAFE_HOSPITALITY",
    title: "رستوران سنتی ایرانی",
    customerModel: "B2C"
  });

  const p1Welcome = engine.startPhase(1);
  assert.ok(p1Welcome.firstQuestion);
  const q0 = engine.getCurrentQuestion();
  assert.equal(engine.currentStepIndex, 0);
  pass("Engine starts at step 0");

  engine.processUserResponse("رستوران سنتی با موسیقی زنده و غذاهای اصیل ایرانی", "restaurant_traditional");
  assert.equal(engine.currentStepIndex, 1);
  const q1 = engine.getCurrentQuestion();
  assert.notEqual(q0.id, q1.id);
  pass("Step index advanced to 1 after answering");

  const prevQ = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 0);
  assert.equal(prevQ.id, q0.id);
  pass("previousQuestion() moves index back to 0 and returns original question");

  const prevUnderflow = engine.previousQuestion();
  assert.equal(engine.currentStepIndex, 0);
  assert.equal(prevUnderflow.id, q0.id);
  pass("previousQuestion() at step 0 stays at 0 without underflow");

  engine.processUserResponse("کافه رستوران مدرن با منوی نوشیدنی تخصصی و فضای کاری", "cafe_workspace");
  assert.equal(engine.currentStepIndex, 1);
  pass("Re-answering question 0 works cleanly and updates state");
}

console.log("\n======================================================================");
console.log('ALL ' + passedCount + ' DOWNSTREAM INVALIDATION & STATE ARCH TESTS PASSED!');
console.log("======================================================================\n");
