/**
 * DIGITAL MARKET — Milestone 2 Verification Test Suite
 * Comprehensive Unit & Integration Tests for R2 (Phase Gates & Anti-Skip) and R3 (Unknowns & Contradictions)
 */

import { OrchestratorEngine } from "./src/services/orchestratorEngine.js";
import { validatePhaseGate } from "./src/services/phaseGateValidator.js";
import { UnknownsManager, UNKNOWN_SEVERITY, UNKNOWN_STATUS } from "./src/services/unknownsManager.js";
import { ContradictionEngine, CONTRADICTION_SEVERITY, CONTRADICTION_STATUS } from "./src/services/contradictionEngine.js";
import { classifyBusinessContext } from "./src/data/businessContextRouter.js";

console.log("======================================================================");
console.log("🛡️ STARTING MILESTONE 2: PHASE GATES, UNKNOWNS & CONTRADICTIONS SUITE");
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
// SUITE 1: validatePhaseGate Unit Tests (Requirement R2)
// =============================================================================
console.log("▶ SUITE 1: Phase Gate Validator (validatePhaseGate) Unit Tests");
{
  // 1.1 Empty engine must FAIL Phase 1 gate
  const emptyEngine = new OrchestratorEngine();
  const resEmpty = validatePhaseGate(1, emptyEngine);
  assert(resEmpty.passed === false, "Empty state fails Phase 1 gate");
  assert(resEmpty.blockingReasons.length > 0, "Empty state has blocking reasons");
  assert(resEmpty.missingFacts.length > 0, "Empty state lists missing facts");
  assert(resEmpty.evidenceScore <= 49, `Empty state evidence score is capped (got ${resEmpty.evidenceScore})`);

  // 1.2 Fully populated Phase 1 must PASS gate
  const validEngine = new OrchestratorEngine();
  validEngine.phaseData[1] = {
    stage: "کسب‌وکار فعال",
    stageValue: "active",
    description: "خدمات فنی و دیتیلینگ خودرو",
    descriptionValue: "local_automotive_service",
    geography: "تهران و منطقه غرب",
    geographyValue: "local_city",
    primaryGoal: "جذب ۱۰۰ مشتری اولیه پایدار",
    primaryGoalValue: "first_100_customers",
    coreOffer: "شستشوی بخار نانو و سرامیک بدنه",
    coreOfferValue: "core_service_delivery",
    valueHypothesis: "کیفیت بدون نقص و تعهد کتبی"
  };
  validEngine.businessContext = classifyBusinessContext(validEngine.phaseData);
  const resValid = validatePhaseGate(1, validEngine);
  assert(resValid.passed === true, "Fully populated Phase 1 passes gate");
  assert(resValid.blockingReasons.length === 0, "No blocking reasons on valid state");
  assert(resValid.missingFacts.length === 0, "No missing facts on valid state");
  assert(resValid.evidenceScore === 100, `Evidence score is 100% for full state (got ${resValid.evidenceScore})`);

  // 1.3 Phase 1 with BLOCKING_UNKNOWN must FAIL gate
  const blockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step2_core_offer",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
    blocking: true,
    reason: "مدل خدمت محوری مشخص نیست",
    status: UNKNOWN_STATUS.OPEN
  });
  validEngine.unknowns.push(blockingUnknown);
  const resBlockedByUnknown = validatePhaseGate(1, validEngine);
  assert(resBlockedByUnknown.passed === false, "BLOCKING_UNKNOWN strictly halts Phase 1 completion");
  assert(resBlockedByUnknown.unresolvedUnknowns.length === 1, "Unresolved unknown registered in gate result");
  assert(resBlockedByUnknown.blockingReasons.some(r => r.includes("مسدودکننده")), "Blocking reason explicitly details blocking unknown");

  // 1.4 Resolving the unknown allows passing
  UnknownsManager.resolveUnknown(validEngine.unknowns, blockingUnknown.id, "شستشوی تخصصی موتور و بدنه با مواد ایتالیایی تعیین شد");
  const resResolved = validatePhaseGate(1, validEngine);
  assert(resResolved.passed === true, "Resolved unknown allows Phase 1 gate to pass");

  // 1.5 Accepting risk on unknown allows passing
  const blockingUnknown2 = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step1_primary_goal",
    severity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
    blocking: true,
    reason: "تعداد دقیق مشتری هدف نیازمند تست است",
    status: UNKNOWN_STATUS.OPEN,
    existingCount: validEngine.unknowns.length
  });
  validEngine.unknowns.push(blockingUnknown2);
  assert(validatePhaseGate(1, validEngine).passed === false, "Second blocking unknown halts gate");
  UnknownsManager.acceptRisk(validEngine.unknowns, blockingUnknown2.id, "پذیرش ریسک با بازه تخمینی اولیه");
  const resRiskAccepted = validatePhaseGate(1, validEngine);
  assert(resRiskAccepted.passed === true, "ACCEPTED_RISK status allows Phase 1 gate to pass");

  // 1.6 NON_BLOCKING_UNKNOWN allows progression with warning
  const nonBlockingUnknown = UnknownsManager.createUnknown({
    phase: 1,
    questionId: "step0_diagnostic_probing",
    severity: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
    blocking: false,
    reason: "چشم‌انداز ۵ ساله هنوز قطعی نیست",
    status: UNKNOWN_STATUS.OPEN,
    existingCount: validEngine.unknowns.length
  });
  validEngine.unknowns.push(nonBlockingUnknown);
  const resNonBlocking = validatePhaseGate(1, validEngine);
  assert(resNonBlocking.passed === true, "NON_BLOCKING_UNKNOWN allows gate to pass");
  assert(resNonBlocking.warnings.length > 0, "NON_BLOCKING_UNKNOWN creates warning record in validation object");

  // 1.7 Phase 2 Gate Validation
  validEngine.completedPhases[1] = true;
  validEngine.phaseData[2] = {};
  const resP2Empty = validatePhaseGate(2, validEngine);
  assert(resP2Empty.passed === false, "Empty Phase 2 fails Phase 2 gate");
  assert(resP2Empty.missingFacts.some(f => f.includes("رقبا")), "Phase 2 requires competitor intelligence");
  assert(resP2Empty.missingFacts.some(f => f.includes("درد")), "Phase 2 requires customer pain points");

  validEngine.phaseData[2] = {
    competitors: "تعمیرگاه‌ها و کارواش‌های سنتی محله",
    customerPain: "کیفیت نوسانی و خط و خش روی بدنه",
    pricingModel: "تعرفه ثابت و شفاف",
    goldenOpportunity: "تضمین کتبی اصالت و کیفیت متریال"
  };
  const resP2Valid = validatePhaseGate(2, validEngine);
  assert(resP2Valid.passed === true, "Populated Phase 2 passes Phase 2 gate");
}

// =============================================================================
// SUITE 2: Anti-Skip Protocol & Strict Progression (Requirement R2)
// =============================================================================
console.log("\n▶ SUITE 2: Anti-Skip Protocol & Phase Progression Enforcement");
{
  const engine = new OrchestratorEngine();

  // 2.1 Phase 1 is always allowed
  const canStart1 = engine.canStartPhase(1);
  assert(canStart1.allowed === true, "canStartPhase(1) is always true");
  assert(engine.getPhaseStatus(1) === "IN_PROGRESS", "Initial phase status is IN_PROGRESS");

  // 2.2 Phase 2 is locked when Phase 1 is not complete
  const canStart2 = engine.canStartPhase(2);
  assert(canStart2.allowed === false, "canStartPhase(2) is false when Phase 1 incomplete");
  assert(canStart2.reason.includes("پیش‌نیاز"), "Rejection reason mentions prerequisite");
  assert(engine.getPhaseStatus(2) === "LOCKED", "Phase 2 status is LOCKED");

  // 2.3 Arbitrary phase jumping (1 to 5 or 8) is strictly prevented
  assert(engine.canStartPhase(5).allowed === false, "canStartPhase(5) is strictly rejected from Phase 1");
  assert(engine.canStartPhase(8).allowed === false, "canStartPhase(8) is strictly rejected from Phase 1");

  // 2.4 startPhase throws when calling locked phase
  let threwOnHop = false;
  try {
    engine.startPhase(5);
  } catch (err) {
    threwOnHop = true;
    assert(err.isGateBlocked === true, "Error has isGateBlocked flag");
    assert(err.message.includes("جلوگیری"), "Error message contains Persian anti-skip notice");
  }
  assert(threwOnHop === true, "startPhase(5) throws error on illegal skip");
  assert(engine.currentPhase === 1, "currentPhase remained 1 after failed jump");

  // 2.5 finalizeCurrentPhase halts when gate fails (not just because questions run out)
  const emptyFinalize = engine.finalizeCurrentPhase();
  assert(emptyFinalize.isCompleted === false, "finalizeCurrentPhase fails when gate does not pass");
  assert(emptyFinalize.gatePassed === false, "gatePassed is false");
  assert(engine.completedPhases[1] === false, "completedPhases[1] remains false");
  assert(emptyFinalize.reply.includes("توقف در گیت خروج"), "Reply contains exit gate halt feedback in Persian");

  // 2.6 When Phase 1 passes, Phase 2 becomes AVAILABLE
  engine.phaseData[1] = {
    stage: "active",
    description: "local_automotive_service",
    geography: "local_city",
    primaryGoal: "first_100_customers",
    coreOffer: "core_service_delivery",
    valueHypothesis: "quality"
  };
  engine.businessContext = classifyBusinessContext(engine.phaseData);
  const finishP1 = engine.finalizeCurrentPhase();
  assert(finishP1.isCompleted === true, "finalizeCurrentPhase succeeds on valid state");
  assert(engine.completedPhases[1] === true, "completedPhases[1] is now true");
  assert(engine.getPhaseStatus(1) === "COMPLETED", "Phase 1 status is COMPLETED");
  assert(engine.getPhaseStatus(2) === "AVAILABLE", "Phase 2 status is now AVAILABLE");

  // 2.7 Transitioning to Phase 2 succeeds
  const startP2 = engine.startPhase(2);
  assert(startP2.welcomeMessage.length > 20, "Phase 2 welcome message returned");
  assert(engine.currentPhase === 2, "Current phase is now 2");
  assert(engine.getPhaseStatus(2) === "IN_PROGRESS", "Phase 2 status is IN_PROGRESS");
}

// =============================================================================
// SUITE 3: Contradiction Engine & Semantic Conflict Detection (Requirement R3)
// =============================================================================
console.log("\n▶ SUITE 3: Contradiction Engine & Semantic Conflict Detection");
{
  // 3.1 Customer Model Contradiction: B2C in P1 vs Enterprise Tender in P3/P8
  const stateB2C = {
    phaseData: {
      1: {
        stage: "active",
        description: "کارواش نانو محلی و دیتیلینگ خودرو",
        customerModel: "B2C",
        geography: "local_city",
        primaryGoal: "جذب مراجعان محلی"
      },
      8: {
        leadFunnel: "شرکت در مناقصه های کلان دولتی و قراردادهای تدارکات سازمانی B2B"
      }
    },
    decisions: [
      { statement: "ورود به مناقصات بزرگ دولتی از طریق سامانه ستاد ایران" }
    ],
    businessContext: { customerModel: "B2C", archetype: "LOCAL_SERVICE" }
  };

  const contradictions1 = ContradictionEngine.detectContradictions(stateB2C);
  assert(contradictions1.length > 0, "Contradiction detected for B2C vs B2B enterprise tender");
  assert(contradictions1[0].severity === CONTRADICTION_SEVERITY.CRITICAL, "B2C vs Enterprise tender is CRITICAL");
  assert(contradictions1[0].statementA.includes("B2C"), "statementA mentions B2C");
  assert(contradictions1[0].statementB.includes("مناقصات"), "statementB mentions tenders");

  // 3.2 Budget vs Mass Media Billboard Contradiction
  const stateBudget = {
    phaseData: {
      1: {
        stage: "idea",
        budgetConstraint: "بودجه محدود و نقدینگی صفر (bootstrapped)",
        description: "فروشگاه آنلاین صنایع دستی",
        geography: "nationwide_iran"
      },
      8: {
        thoughtLeadership: "اجرای کمپین تلویزیونی و نصب بیلبورد بزرگراهی در تهران"
      }
    },
    decisions: [
      { statement: "رزرو بیلبورد بزرگراهی مدرس و همت برای ماه آینده" }
    ],
    businessContext: { archetype: "ECOMMERCE_DTC" }
  };

  const contradictions2 = ContradictionEngine.detectContradictions(stateBudget);
  assert(contradictions2.length > 0, "Contradiction detected for low budget vs mass media billboards");
  assert(contradictions2[0].severity === CONTRADICTION_SEVERITY.CRITICAL, "Budget vs billboard is CRITICAL");

  // 3.3 Geography Conflict: Local 3km vs International Export
  const stateGeo = {
    phaseData: {
      1: {
        stage: "active",
        geographyValue: "local_city",
        geography: "شعاع ۳ کیلومتری محله سعادت‌آباد",
        description: "کافی‌شاپ و رستری دانه قهوه"
      },
      3: {
        positioning: "برند اول قهوه در محله",
        targetSegment: "صادرات به کشورهای منطقه و حوزه خلیج فارس با کشتی"
      }
    },
    decisions: [],
    businessContext: { geographicScope: "LOCAL", archetype: "RESTAURANT_CAFE_HOSPITALITY" }
  };

  const contradictions3 = ContradictionEngine.detectContradictions(stateGeo);
  assert(contradictions3.length > 0, "Contradiction detected for local scope vs international export");
  assert(contradictions3[0].severity === CONTRADICTION_SEVERITY.MAJOR, "Scope conflict is MAJOR");

  // 3.4 Contradiction Blocks Phase Gate
  const engineWithContradiction = new OrchestratorEngine();
  engineWithContradiction.phaseData[1] = {
    stage: "active",
    description: "کارواش محلی",
    customerModel: "B2C",
    geography: "local_city",
    primaryGoal: "first_100",
    coreOffer: "carwash",
    valueHypothesis: "quality"
  };
  engineWithContradiction.businessContext = classifyBusinessContext(engineWithContradiction.phaseData);
  engineWithContradiction.contradictions.push(contradictions1[0]);

  const gateResult = validatePhaseGate(1, engineWithContradiction);
  assert(gateResult.passed === false, "CRITICAL contradiction blocks Phase Gate completion");
  assert(gateResult.unresolvedContradictions.length === 1, "Contradiction listed in gate result");
  assert(gateResult.blockingReasons.some(r => r.includes("بحرانی")), "Blocking reasons cite critical contradiction");

  // 3.5 Resolving contradiction unblocks gate
  ContradictionEngine.resolveContradiction(engineWithContradiction.contradictions, contradictions1[0].id, "تمرکز ۱۰۰٪ بر مدل B2C و حذف خدمات مناقصه‌ای");
  const gateResultResolved = validatePhaseGate(1, engineWithContradiction);
  assert(gateResultResolved.passed === true, "Resolved contradiction unblocks Phase Gate");
}

// =============================================================================
// SUITE 4: Downstream Invalidation (Requirement R3)
// =============================================================================
console.log("\n▶ SUITE 4: Downstream Invalidation on Foundational Decisions Change");
{
  const engine = new OrchestratorEngine();

  // Set up phases 1, 2, 3 as completed
  engine.completedPhases[1] = true;
  engine.completedPhases[2] = true;
  engine.completedPhases[3] = true;

  assert(engine.getPhaseStatus(1) === "COMPLETED", "P1 is COMPLETED");
  assert(engine.getPhaseStatus(2) === "COMPLETED", "P2 is COMPLETED");
  assert(engine.getPhaseStatus(3) === "COMPLETED", "P3 is COMPLETED");

  // Invalidate from Phase 1
  const invalRes1 = engine.invalidateDependentPhases(1);
  assert(invalRes1.invalidatedPhases.includes(2), "Phase 2 invalidated");
  assert(invalRes1.invalidatedPhases.includes(3), "Phase 3 invalidated");
  assert(engine.completedPhases[2] === false, "completedPhases[2] is now false");
  assert(engine.completedPhases[3] === false, "completedPhases[3] is now false");
  assert(engine.getPhaseStatus(2) === "INVALIDATED", "Phase 2 status is INVALIDATED");
  assert(engine.getPhaseStatus(3) === "INVALIDATED", "Phase 3 status is INVALIDATED");
  assert(invalRes1.message.includes("هشدار ابطال"), "Invalidation message rendered in Persian");

  // Re-complete Phase 2 and 3
  engine.completedPhases[2] = true;
  engine.completedPhases[3] = true;
  delete engine.phaseStatus[2];
  delete engine.phaseStatus[3];

  // Invalidate from Phase 2 (Phase 1 must remain untouched)
  const invalRes2 = engine.invalidateDependentPhases(2);
  assert(engine.completedPhases[1] === true, "Phase 1 is untouched when invalidating from Phase 2");
  assert(invalRes2.invalidatedPhases.includes(3), "Phase 3 invalidated from Phase 2 change");
  assert(!invalRes2.invalidatedPhases.includes(2), "Phase 2 is not in downstream list of itself");
}

// =============================================================================
// SUITE 5: Zero Test Magic Guards in Production Logic
// =============================================================================
console.log("\n▶ SUITE 5: Verification of Test Magic Guard Purge");
{
  const engine = new OrchestratorEngine();

  // Passing optionValue "huge_val" should NOT bypass or magically assign to geography
  engine.processUserResponse("متن تستی", "huge_val");
  assert(engine.phaseData[1].geography === undefined || engine.phaseData[1].geography !== "متن تستی" || engine.getCurrentQuestion()?.id === "step0_geography", "huge_val magic guard is eliminated");

  // Passing optionValue "xss_val" should NOT bypass or magically assign to primaryGoal
  engine.processUserResponse("متن تستی ۲", "xss_val");
  assert(engine.phaseData[1].primaryGoal === undefined || engine.phaseData[1].primaryGoal !== "متن تستی ۲", "xss_val magic guard is eliminated");
}

console.log("\n======================================================================");
console.log(`🏆 ALL MILESTONE 2 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED!`);
console.log("======================================================================\n");

if (failed > 0) {
  process.exit(1);
}
