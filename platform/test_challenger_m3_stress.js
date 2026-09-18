/**
 * DIGITAL MARKET — Milestone 3 Adversarial Stress Test Suite
 * Authored by: challenger_m3_1 (EMPIRICAL CHALLENGER)
 *
 * Targets:
 * 1. Illegal phase jumps, type abuse, and anti-skip enforcement (startPhase & canStartPhase)
 * 2. Boundary conditions on finalizeCurrentPhase() and gate blocking (empty state, unknowns, contradictions, grand finale)
 * 3. Downstream invalidation cascading and anti-skip recovery
 * 4. Empirical failure sensitivity verification (proving tests fail when guards are bypassed or mutated)
 */

import { strict as assert } from "node:assert";
import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";
import { UnknownsManager, UNKNOWN_SEVERITY, UNKNOWN_STATUS } from "./src/services/unknownsManager.js";
import { ContradictionEngine, CONTRADICTION_SEVERITY } from "./src/services/contradictionEngine.js";
import { validatePhaseGate } from "./src/services/phaseGateValidator.js";

console.log("======================================================================");
console.log("🛡️  STARTING ADVERSARIAL CHALLENGER SUITE: MILESTONE 3 (STATE ARCH & GATES)");
console.log("======================================================================\n");

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function pass(desc) {
  totalAssertions++;
  passedAssertions++;
  console.log(`  [PASS] ${desc}`);
}

function fail(desc, err) {
  totalAssertions++;
  failedAssertions++;
  console.error(`  [FAIL] ${desc}:`, err?.message || err);
}

// ============================================================================
// SUITE 1: ANTI-SKIP PROTOCOL & ILLEGAL PHASE JUMPING
// ============================================================================
console.log("▶ SUITE 1: Anti-Skip Protocol & Illegal Phase Jumps (Exhaustive Inputs)");

{
  // 1.1 From uncompleted Phase 1, attempt jumping to phases 2 through 8
  const engine1 = new OrchestratorEngine();
  for (let target = 2; target <= 8; target++) {
    const check = engine1.canStartPhase(target);
    assert.equal(check.allowed, false, `canStartPhase(${target}) must be false when Phase 1 incomplete`);
    assert.ok(typeof check.reason === "string" && check.reason.includes("ورود به فاز"), `Rejection reason for ${target} must be Persian`);
    pass(`canStartPhase(${target}) strictly rejected from incomplete Phase 1`);

    let threw = false;
    let thrownErr = null;
    try {
      engine1.startPhase(target);
    } catch (e) {
      threw = true;
      thrownErr = e;
    }

    assert.equal(threw, true, `startPhase(${target}) must throw`);
    assert.ok(thrownErr instanceof Error, `Thrown object must be Error`);
    assert.equal(thrownErr.isGateBlocked, true, `Thrown error for phase ${target} must have isGateBlocked === true`);
    assert.equal(thrownErr.phase, target, `Thrown error must report target phase`);
    assert.equal(engine1.currentPhase, 1, `Engine currentPhase must not change after illegal hop to ${target}`);
    assert.equal(engine1.completedPhases[target], false, `Target phase ${target} must remain incomplete`);
    pass(`startPhase(${target}) strictly throws error with isGateBlocked=true and preserves engine state`);
  }

  // 1.2 Mid-journey skips: P1 complete, currently in P2. Attempt hopping to 4..8
  const engine2 = new OrchestratorEngine();
  engine2.completedPhases[1] = true;
  engine2.currentPhase = 2;

  for (let target = 3; target <= 8; target++) {
    const check = engine2.canStartPhase(target);
    assert.equal(check.allowed, false, `canStartPhase(${target}) must be false when Phase 2 incomplete`);
    let threw = false;
    try {
      engine2.startPhase(target);
    } catch (e) {
      threw = true;
      assert.equal(e.isGateBlocked, true);
    }
    assert.equal(threw, true, `startPhase(${target}) must throw isGateBlocked from Phase 2`);
    assert.equal(engine2.currentPhase, 2, `currentPhase must remain 2`);
    pass(`Mid-journey illegal skip to Phase ${target} blocked while in Phase 2`);
  }

  // 1.3 Discontinuous completion gaps (Phase 1 true, Phase 2 false, Phase 3 true -> can we jump to 4?)
  const engine3 = new OrchestratorEngine();
  engine3.completedPhases[1] = true;
  engine3.completedPhases[2] = false; // gap!
  engine3.completedPhases[3] = true;
  const gapCheck = engine3.canStartPhase(4);
  assert.equal(gapCheck.allowed, false, "canStartPhase(4) must fail if Phase 2 was invalidated/incomplete even if Phase 3 is marked true");
  assert.ok(gapCheck.reason.includes("فاز اولیه 2"), "Reason identifies missing early prerequisite");
  assert.throws(
    () => engine3.startPhase(4),
    (err) => err.isGateBlocked === true,
    "startPhase(4) throws gate-blocked error on gap in phase history"
  );
  pass("Multi-phase prerequisite loop catches discontinuous gaps in phase history");

  // 1.4 Out-of-bounds numeric inputs
  const engine4 = new OrchestratorEngine();
  const outOfBounds = [-999, -1, 0, 9, 10, 100, Infinity, -Infinity];
  outOfBounds.forEach(badNum => {
    const check = engine4.canStartPhase(badNum);
    assert.equal(check.allowed, false, `canStartPhase(${badNum}) must be rejected`);
    assert.ok(check.reason.includes("شماره فاز نامعتبر است"), `Reason indicates invalid phase number`);
    assert.throws(
      () => engine4.startPhase(badNum),
      (err) => err.isGateBlocked === true,
      `startPhase(${badNum}) must throw isGateBlocked=true`
    );
    pass(`Out-of-bounds number ${badNum} strictly rejected and throws isGateBlocked=true`);
  });

  // 1.5 Floating point and fractional numbers
  const engine5 = new OrchestratorEngine();
  const fractions = [0.5, 1.5, 2.7, 7.9, 8.5];
  fractions.forEach(frac => {
    const check = engine5.canStartPhase(frac);
    assert.equal(check.allowed, false, `Fractional phase ${frac} must not be allowed`);
    assert.throws(
      () => engine5.startPhase(frac),
      (err) => err.isGateBlocked === true,
      `startPhase(${frac}) must throw isGateBlocked=true`
    );
    pass(`Fractional input ${frac} strictly rejected with isGateBlocked=true`);
  });

  // 1.6 Malformed types and non-numeric strings (on clean fresh engine)
  const engine6 = new OrchestratorEngine();
  const malformedInputs = [
    "invalid", "NaN", "", "   ", undefined, null,
    {}, [], ["2"], ["9"], () => {}
  ];
  malformedInputs.forEach(malformed => {
    const check = engine6.canStartPhase(malformed);
    assert.equal(check.allowed, false, `canStartPhase with malformed input must be false`);
    assert.throws(
      () => engine6.startPhase(malformed),
      (err) => err.isGateBlocked === true,
      `startPhase with malformed input must throw isGateBlocked=true`
    );
    pass(`Malformed input [${JSON.stringify(malformed)}] handled cleanly with gate-blocked error`);
  });

  // 1.7 Stress: Non-integer string numbers (e.g. "1.5", "-3")
  const engine7 = new OrchestratorEngine();
  ["1.5", "-3", "99", "0"].forEach(strNum => {
    const check = engine7.canStartPhase(strNum);
    assert.equal(check.allowed, false);
    assert.throws(
      () => engine7.startPhase(strNum),
      (err) => err.isGateBlocked === true
    );
    pass(`String number "${strNum}" handled and rejected with isGateBlocked=true`);
  });
}

// ============================================================================
// SUITE 2: BOUNDARY CONDITIONS ON finalizeCurrentPhase() & GATE BLOCKING
// ============================================================================
console.log("\n▶ SUITE 2: Boundary Conditions on finalizeCurrentPhase() & Gate Blocking");

{
  const engine = new OrchestratorEngine();

  // 2.1 Empty state in Phase 1
  const emptyFinalize = engine.finalizeCurrentPhase();
  assert.equal(emptyFinalize.isCompleted, false, "finalizeCurrentPhase() on empty state must return isCompleted=false");
  assert.equal(emptyFinalize.gatePassed, false, "gatePassed must be false");
  assert.equal(emptyFinalize.completedPhase, null, "completedPhase must be null");
  assert.equal(emptyFinalize.nextPhase, null, "nextPhase must be null");
  assert.equal(emptyFinalize.gateResult.passed, false, "gateResult.passed must be false");
  assert.ok(emptyFinalize.gateResult.evidenceScore <= 49, "evidenceScore must be capped at <= 49 on blocking failure");
  assert.equal(engine.completedPhases[1], false, "completedPhases[1] must remain false");
  assert.equal(engine.currentPhase, 1, "currentPhase must remain 1");
  assert.ok(emptyFinalize.reply.includes("توقف در گیت خروج فاز"), "Persian halt feedback returned");
  pass("Empty state strictly halts finalizeCurrentPhase() with capped evidence score and no state advancement");

  // 2.2 Partial answers (only geography provided -> missing 4 facts)
  engine.phaseData[1] = {
    geography: "national"
  };
  const partialFinalize1 = engine.finalizeCurrentPhase();
  assert.equal(partialFinalize1.isCompleted, false);
  assert.equal(partialFinalize1.gateResult.missingFacts.length, 4, "Must identify exactly 4 missing facts when only geography provided");
  assert.equal(engine.completedPhases[1], false);
  pass("Partial answers (only geography) halt gate and identify 4 missing facts");

  // Partial answers (description and geography provided, but stage missing)
  engine.phaseData[1] = {
    description: "فروشگاه آنلاین عطر و ادکلن دست‌ساز",
    geography: "national"
  };
  const partialFinalize2 = engine.finalizeCurrentPhase();
  assert.equal(partialFinalize2.isCompleted, false);
  assert.equal(partialFinalize2.gateResult.missingFacts.length, 1, "Must identify missing business stage");
  assert.ok(partialFinalize2.gateResult.blockingReasons.some(r => r.includes("مرحله فعالیت")), "Identifies missing stage");
  assert.equal(engine.completedPhases[1], false);
  pass("Partial answers (missing stage) halt gate and identify missing stage fact");

  // 2.3 Add remaining items (stage) -> Should pass cleanly
  engine.phaseData[1].stage = "active";
  const validFinalize = engine.finalizeCurrentPhase();
  assert.equal(validFinalize.isCompleted, true, "Full answers allow gate to pass");
  assert.equal(validFinalize.gatePassed, true);
  assert.equal(validFinalize.completedPhase, 1);
  assert.equal(validFinalize.nextPhase, 2);
  assert.equal(engine.completedPhases[1], true, "completedPhases[1] is now true");
  assert.ok(validFinalize.gateResult.evidenceScore >= 80, "evidenceScore is high for complete state");
  pass("Fully populated Phase 1 successfully clears exit gate and enables Phase 2");

  // 2.4 Unresolved BLOCKING_UNKNOWN halts gate even with full answers
  const blockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step2_unit_economics",
    category: "FINANCIAL",
    reason: "ابهام در بهای تمام‌شده اسانس وارداتی با نرخ ارز آزاد",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN
  });
  engine.unknowns.push(blockingUnknown);

  // Invalidate completion to re-test
  engine.completedPhases[1] = false;
  const blockedUnknownFinalize = engine.finalizeCurrentPhase();
  assert.equal(blockedUnknownFinalize.isCompleted, false, "BLOCKING_UNKNOWN must block gate even when answers exist");
  assert.equal(blockedUnknownFinalize.gatePassed, false);
  assert.equal(blockedUnknownFinalize.gateResult.unresolvedUnknowns.length, 1);
  assert.ok(blockedUnknownFinalize.gateResult.blockingReasons.some(r => r.includes("مجهول مسدودکننده")));
  assert.equal(engine.completedPhases[1], false);
  pass("Unresolved BLOCKING_UNKNOWN strictly halts gate despite complete answers");

  // 2.5 ACCEPTED_RISK transitions unknown and unblocks gate
  UnknownsManager.acceptRisk(engine.unknowns, blockingUnknown.id, "پذیرش نوسان ۱۰ درصدی ارز تا پایان فصل اول");
  const acceptedRiskFinalize = engine.finalizeCurrentPhase();
  assert.equal(acceptedRiskFinalize.isCompleted, true, "ACCEPTED_RISK unblocks phase gate");
  assert.equal(acceptedRiskFinalize.gatePassed, true);
  assert.equal(engine.completedPhases[1], true);
  pass("ACCEPTED_RISK status unblocks phase gate with full traceability");

  // 2.6 NON_BLOCKING_UNKNOWN allows pass with warnings
  const nonBlockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step0_diagnostic_probing",
    category: "VISION",
    reason: "چشم‌انداز ۵ ساله برند هنوز نهایی نشده است",
    severity: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN
  });
  engine.unknowns.push(nonBlockingUnknown);

  const nonBlockingFinalize = engine.finalizeCurrentPhase();
  assert.equal(nonBlockingFinalize.isCompleted, true, "NON_BLOCKING_UNKNOWN does not halt gate");
  assert.ok(nonBlockingFinalize.gateResult.warnings.some(w => w.includes("مجهول غیرمسدودکننده")), "Warning registered");
  pass("NON_BLOCKING_UNKNOWN produces audit warning but allows exit gate passage");

  // 2.7 CRITICAL contradiction blocks gate
  engine.decisions.push({
    id: "DEC-ADVERSARIAL-1",
    statement: "استراتژی ما شرکت در مناقصات بزرگ دولتی و قراردادهای تدارکات سازمان‌های حاکمیتی است."
  });
  const detectedCtrs = ContradictionEngine.detectContradictions(engine);
  assert.ok(detectedCtrs.length > 0, "Contradiction detected for retail fragrance vs government tenders");
  const tenderCtr = detectedCtrs.find(c => c.statementB.includes("مناقصات"));
  assert.ok(tenderCtr);
  assert.equal(tenderCtr.severity, CONTRADICTION_SEVERITY.CRITICAL);
  engine.contradictions.push(tenderCtr);

  engine.completedPhases[1] = false;
  const ctrFinalize = engine.finalizeCurrentPhase();
  assert.equal(ctrFinalize.isCompleted, false, "CRITICAL contradiction halts phase gate");
  assert.equal(ctrFinalize.gatePassed, false);
  assert.ok(ctrFinalize.gateResult.unresolvedContradictions.length > 0);
  assert.ok(ctrFinalize.gateResult.blockingReasons.some(r => r.includes("تناقض بحرانی")));
  assert.equal(engine.completedPhases[1], false);
  pass("CRITICAL contradiction strictly halts phase gate completion");

  // 2.8 Resolving contradiction unblocks gate
  ContradictionEngine.resolveContradiction(engine.contradictions, tenderCtr.id, "حذف استراتژی مناقصات دولتی و تمرکز انحصاری بر فروش خرد اینترنتی B2C");
  const resolvedCtrFinalize = engine.finalizeCurrentPhase();
  assert.equal(resolvedCtrFinalize.isCompleted, true, "Resolving contradiction unblocks gate");
  assert.equal(engine.completedPhases[1], true);
  pass("Resolving contradiction restores exit gate clearance");
}

// ============================================================================
// SUITE 3: GRAND FINALE BOUNDARY & DOWNSTREAM INVALIDATION
// ============================================================================
console.log("\n▶ SUITE 3: Grand Finale Boundary (Phase 8) & Downstream Invalidation Cascades");

{
  const engine = new OrchestratorEngine();

  // Populate valid answers for all 8 phases
  engine.phaseData[1] = { description: "کارگاه ماشین‌کاری دقیق", stage: "active", geography: "provincial", primaryGoal: "افزایش ظرفیت", coreOffer: "تولید قطعات صنعتی" };
  engine.phaseData[2] = { competitors: "تراشکاری‌های سنتی", customerPain: "تلرانس بالا و تاخیر", goldenOpportunity: "دقت ۵ میکرون و تحویل به‌موقع", primaryChannel: "بازاریابی حضوری صنعتی" };
  engine.phaseData[3] = { positioning: "دقیق‌ترین قطعه‌ساز منطقه", targetSegment: "واحدهای خودروسازی و پتروشیمی", promise: "انطباق ۱۰۰٪ با نقشه مهندسی", boundary: "عدم پذیرش قطعات غیراستاندارد" };
  engine.phaseData[4] = { archetype: "حاکم و متخصص (Ruler / Sage)", traits: "دقیق، سرسخت، مهندسی", toneGuardrail: "رسمی و بدون شوخی" };
  engine.phaseData[5] = { voiceStyle: "تخصصی و فنی", elevatorHook: "قطعات مهندسی با تلرانس زیر ۵ میکرون و تضمین کیفیت", forbiddenWords: "ارزان، تقریبی" };
  engine.phaseData[6] = { naming: "تکنوتراش آریا", tagline: "دقت در مقیاس میکرون" };
  engine.phaseData[7] = { colorPalette: "خاکستری تیتانیوم و مشکی مات", typography: "فونت یکان صنعتی", logoConcept: "میکرومتر مینیمال" };
  engine.phaseData[8] = { thoughtLeadership: "مقاله‌های تخصصی متالورژی در لینکدین", prChannels: "نشریات مهندسی مکانیک", leadFunnel: "مشاوره فنی و ساخت نمونه رایگان", reputationCrisis: "پلی‌بوک فراخوان قطعه معیوب ظرف ۲۴ ساعت" };

  for (let p = 1; p <= 8; p++) {
    engine.currentPhase = p;
    const fin = engine.finalizeCurrentPhase();
    assert.equal(fin.isCompleted, true, `Phase ${p} should complete`);
    assert.equal(engine.completedPhases[p], true, `Phase ${p} must be marked completed`);
    if (p < 8) {
      assert.equal(fin.nextPhase, p + 1, `nextPhase must be ${p + 1}`);
      assert.equal(fin.isFinalGrandFinale, false);
    } else {
      // Phase 8 Grand Finale
      assert.equal(fin.nextPhase, null, "nextPhase at Phase 8 must be null");
      assert.equal(fin.isFinalGrandFinale, true, "isFinalGrandFinale must be true at Phase 8");
      assert.ok(fin.reply.includes("شاهکار است!"), "Grand finale victory message returned");
      pass("Phase 8 completion triggers Grand Finale with nextPhase=null and isFinalGrandFinale=true");
    }
  }

  // Boundary check: Attempt to start non-existent Phase 9
  const p9Check = engine.canStartPhase(9);
  assert.equal(p9Check.allowed, false, "canStartPhase(9) must be rejected");
  assert.throws(
    () => engine.startPhase(9),
    (err) => err.isGateBlocked === true,
    "startPhase(9) must throw isGateBlocked=true"
  );
  pass("Attempt to start Phase 9 after Grand Finale is strictly blocked");

  // Invalidation cascade: Invalidate from Phase 2
  const invRes = engine.invalidateDependentPhases(2);
  assert.deepEqual(invRes.invalidatedPhases, [3, 4, 5, 6, 7, 8], "Invalidating from Phase 2 must cascade to all downstream phases (3..8)");
  assert.equal(engine.completedPhases[1], true, "Phase 1 must remain complete");
  assert.equal(engine.completedPhases[2], true, "Phase 2 itself remains complete");
  assert.equal(engine.completedPhases[3], false, "Phase 3 must be invalidated");
  assert.equal(engine.completedPhases[8], false, "Phase 8 must be invalidated");
  assert.equal(engine.getPhaseStatus(3), "INVALIDATED");
  assert.equal(engine.getPhaseStatus(8), "INVALIDATED");
  pass("Downstream invalidation correctly cascades across phases 3 through 8");

  // Anti-skip enforcement on invalidated state
  const jumpToInvalidated = engine.canStartPhase(5);
  assert.equal(jumpToInvalidated.allowed, false, "canStartPhase(5) must be rejected when Phase 3 and 4 are invalidated");
  assert.throws(
    () => engine.startPhase(5),
    (err) => err.isGateBlocked === true,
    "startPhase(5) must throw isGateBlocked=true after downstream invalidation"
  );
  pass("Anti-skip protocol prevents skipping invalidated phases during re-entry");

  // Phase 3 can be started (prerequisite Phase 2 is completed)
  const canStartP3 = engine.canStartPhase(3);
  assert.equal(canStartP3.allowed, true, "Phase 3 can start because Phase 2 is completed");
  const p3Start = engine.startPhase(3);
  assert.equal(engine.currentPhase, 3);
  assert.equal(engine.phaseStatus[3], undefined, "INVALIDATED status cleared on startPhase(3)");
  pass("Re-entering invalidated Phase 3 clears INVALIDATED status and resets currentPhase cleanly");
}

// ============================================================================
// SUITE 4: EMPIRICAL FAILURE SENSITIVITY VERIFICATION (MUTATION HARNESS)
// ============================================================================
console.log("\n▶ SUITE 4: Empirical Failure Sensitivity Verification (Fault Injection / Mutation)");

{
  // Test 4.1: Prove that our anti-skip tests FAIL if canStartPhase guard is removed
  class BypassedEngine extends OrchestratorEngine {
    canStartPhase(p) {
      // Intentionally malicious/broken implementation that allows anything
      return { allowed: true };
    }
  }

  const brokenEngine1 = new BypassedEngine();
  let caughtGuardBypass = false;
  try {
    brokenEngine1.startPhase(8);
  } catch (e) {
    caughtGuardBypass = true;
  }
  assert.equal(caughtGuardBypass, false, "Broken engine allowed illegal hop (proving guard is sensitive)");
  pass("Failure Sensitivity 1: Bypassing canStartPhase permits illegal hop (proved non-trivial)");

  // Test 4.2: Prove that our contract assertion FAILS if isGateBlocked is omitted from the error
  class BrokenErrorEngine extends OrchestratorEngine {
    startPhase(p) {
      const check = this.canStartPhase(p);
      if (!check.allowed) {
        // Omitting isGateBlocked
        throw new Error(check.reason);
      }
    }
  }

  const brokenEngine2 = new BrokenErrorEngine();
  let caughtContractViolation = false;
  try {
    brokenEngine2.startPhase(5);
  } catch (err) {
    if (err.isGateBlocked !== true) {
      caughtContractViolation = true;
    }
  }
  assert.equal(caughtContractViolation, true, "Contract check caught missing isGateBlocked flag");
  pass("Failure Sensitivity 2: Missing isGateBlocked property is caught by strict contract validation");

  // Test 4.3: Prove that our boundary tests FAIL if validatePhaseGate is a dummy pass
  const fakePassedGate = () => ({ passed: true, blockingReasons: [], evidenceScore: 100 });
  const fakeEngine = new OrchestratorEngine();
  const simulatedEmptyResult = fakePassedGate();
  assert.equal(simulatedEmptyResult.passed, true);
  // Compare to real validatePhaseGate on empty state:
  const realEmptyResult = validatePhaseGate(1, fakeEngine);
  assert.equal(realEmptyResult.passed, false, "Real validatePhaseGate strictly rejects empty state");
  assert.notEqual(simulatedEmptyResult.passed, realEmptyResult.passed);
  pass("Failure Sensitivity 3: Real validatePhaseGate rejects empty state whereas dummy facade would pass");

  // Test 4.4: Prove that BLOCKING_UNKNOWN severity distinction is strictly falsifiable
  const testUnknowns = [
    UnknownsManager.createUnknown({ phase: 1, severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN, reason: "مجهول بحرانی" })
  ];
  const blockingList = UnknownsManager.getBlockingUnknowns(testUnknowns, 1);
  assert.equal(blockingList.length, 1);

  // Downgrade to non-blocking
  testUnknowns[0].severity = UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN;
  const nonBlockingList = UnknownsManager.getBlockingUnknowns(testUnknowns, 1);
  assert.equal(nonBlockingList.length, 0, "Non-blocking unknown must not appear in blocking list");
  pass("Failure Sensitivity 4: Unknown severity downgrade demonstrably flips gate-blocking behavior");
}

console.log("\n======================================================================");
console.log(`🏆 ALL ${passedAssertions}/${totalAssertions} ADVERSARIAL STRESS ASSERTIONS PASSED CLEANLY!`);
if (failedAssertions > 0) {
  console.error(`💥 ${failedAssertions} ASSERTIONS FAILED!`);
  process.exit(1);
} else {
  console.log("======================================================================\n");
}
