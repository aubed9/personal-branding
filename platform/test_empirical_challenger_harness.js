// Adversarial Stress-Test Harness for Milestone 2 Test Correctness & Score Integrity
// Authored by teamwork_preview_challenger_m2_2 (EMPIRICAL CHALLENGER)

import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';
import { BUSINESS_TYPES } from './src/data/businessTaxonomy753.js';

console.log('======================================================================');
console.log('EMPIRICAL CHALLENGER HARNESS: MILESTONE 2 TEST INTEGRITY AUDIT');
console.log('======================================================================\n');

var totalChallenges = 0;
var passedChallenges = 0;
var failedChallenges = 0;

function reportChallenge(name, passed, detail) {
  totalChallenges++;
  if (passed) {
    passedChallenges++;
    console.log('  [PASS] ' + name + ': ' + detail);
  } else {
    failedChallenges++;
    console.error('  [FAIL] ' + name + ': ' + detail);
  }
}

// -----------------------------------------------------------------------------
// HELPER: Simulate a complete healthy run for a business type
// -----------------------------------------------------------------------------
function simulateHealthyBusiness(bt) {
  var engine = new OrchestratorEngine();
  
  // Phase 1
  engine.processUserResponse('صنف انتخابی: ' + bt.titleFa + ' (' + bt.id + ')', bt.id);
  var q0 = engine.getCurrentQuestion();
  engine.processUserResponse(q0.options[0].text, q0.options[0].value);
  engine.processUserResponse('کسب‌وکار یا برند فعال با مشتریان جاری دارم', 'active');
  engine.processUserResponse('محلی و منطقه‌ای', 'local_city');
  var qGoal = engine.getCurrentQuestion();
  engine.processUserResponse(qGoal.options[0].text, qGoal.options[0].value);
  var qOffer = engine.getCurrentQuestion();
  engine.processUserResponse(qOffer.options[0].text, qOffer.options[0].value);
  var qHypo = engine.getCurrentQuestion();
  engine.processUserResponse(qHypo.options[0].text, qHypo.options[0].value);

  // Phases 2 through 8
  for (var p = 2; p <= 8; p++) {
    engine.startPhase(p);
    var q = engine.getCurrentQuestion();
    while (q) {
      var opt = q.options && q.options.length > 0 ? q.options[0] : { text: 'پاسخ تستی', value: 'test_val' };
      var res = engine.processUserResponse(opt.text, opt.value);
      if (res.isCompleted) break;
      q = engine.getCurrentQuestion();
    }
  }

  var p1Deliv = generateDeliverable(1, engine.phaseData, engine.businessContext, engine.decisions, engine.facts, engine.unknowns);
  var p8Deliv = generateDeliverable(8, engine.phaseData, engine.businessContext, engine.decisions, engine.facts, engine.unknowns);
  var masterDeliv = generateDeliverable('master', engine.phaseData, engine.businessContext, engine.decisions, engine.facts, engine.unknowns);

  return { engine: engine, p1Deliv: p1Deliv, p8Deliv: p8Deliv, masterDeliv: masterDeliv, bt: bt };
}

// -----------------------------------------------------------------------------
// HELPER: Evaluate 753 Metrics (M1, M2, M3, M4) exactly as in simulate_753
// -----------------------------------------------------------------------------
function evaluate753Metrics(engine, p1Deliv, p8Deliv, masterDeliv, bt, options) {
  options = options || {};
  var injectedJargonCount = options.injectedJargonCount || 0;
  var isUnmeasuredSample = options.isUnmeasuredSample || false;

  // M1
  var m1Passed = 0;
  var m1Total = 8;
  if (engine.completedPhases[1]) m1Passed++;
  if (p1Deliv && typeof p1Deliv.title === 'string' && p1Deliv.title.length > 0) m1Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[0] && p1Deliv.sections[0].items && p1Deliv.sections[0].items.length > 0) m1Passed++;
  if (p1Deliv && Array.isArray(p1Deliv.sections) && p1Deliv.sections.length === 5) m1Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[1] && p1Deliv.sections[1].flowchart) m1Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[2] && (p1Deliv.sections[2].checklist ? p1Deliv.sections[2].checklist.length : 0) >= 5) m1Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[3] && 
      ((p1Deliv.sections[3].formulas ? p1Deliv.sections[3].formulas.length : 0) > 0) &&
      ((p1Deliv.sections[3].kpis ? p1Deliv.sections[3].kpis.length : 0) > 0)) m1Passed++;
  if (engine.facts.length > 0) m1Passed++;
  var m1Score = Number(((m1Passed / m1Total) * 100).toFixed(1));

  // M2 (Local trade branch)
  var m2Passed = 0;
  var m2Total = 5;
  if (injectedJargonCount === 0) m2Passed++;
  if (['LOCAL_SERVICE', 'PHYSICAL_RETAIL', 'RESTAURANT_CAFE_HOSPITALITY', 'LOCAL_RETAIL'].includes(engine.businessContext && engine.businessContext.archetype) || (bt.axes && bt.axes.channelModel === 'PHYSICAL_FIRST')) m2Passed++;
  if (engine.businessContext && engine.businessContext.industryId === bt.industryId) m2Passed++;
  if (engine.decisions.length > 0) m2Passed++;
  if (true) m2Passed++; // questions encountered
  var m2Score = Number(((m2Passed / m2Total) * 100).toFixed(1));

  // M3
  var m3Passed = 0;
  var m3Total = 6;
  if (engine.businessContext && engine.businessContext.taxonomyId === bt.id) m3Passed++;
  if (engine.businessContext && engine.businessContext.industryId === bt.industryId) m3Passed++;
  if (engine.businessContext && (engine.businessContext.taxonomyTitleFa || engine.businessContext.titleFa || engine.businessContext.descriptionOriginal)) m3Passed++;
  if (Object.keys(engine.phaseData[1] || {}).length > 0) m3Passed++;
  if (Object.keys(engine.phaseData[8] || {}).length > 0) m3Passed++;
  if (isUnmeasuredSample) {
    if (engine.unknowns && engine.unknowns.length > 0) m3Passed++;
  } else {
    if (engine.facts && engine.facts.length > 0) m3Passed++;
  }
  var m3Score = Number(((m3Passed / m3Total) * 100).toFixed(1));

  // M4
  var m4Passed = 0;
  var m4Total = 8;
  var completedPhasesCount = Object.values(engine.completedPhases).filter(Boolean).length;
  if (completedPhasesCount === 8) m4Passed++;
  if (masterDeliv && Array.isArray(masterDeliv.sections) && masterDeliv.sections.length === 9) m4Passed++;
  if (p1Deliv && Array.isArray(p1Deliv.sections) && p1Deliv.sections.length === 5) m4Passed++;
  if (p8Deliv && Array.isArray(p8Deliv.sections) && p8Deliv.sections.length > 0) m4Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections.some(function(s) { return Array.isArray(s.checklist) && s.checklist.length > 0; })) m4Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections.some(function(s) { return (Array.isArray(s.formulas) && s.formulas.length > 0) || (Array.isArray(s.kpis) && s.kpis.length > 0); })) m4Passed++;
  var filledPhases = Object.values(engine.phaseData).filter(function(pd) { return pd && Object.keys(pd).length > 0; }).length;
  if (filledPhases === 8) m4Passed++;
  if (engine.businessContext && engine.businessContext.archetype && engine.businessContext.taxonomyId === bt.id) m4Passed++;
  var m4Score = Number(((m4Passed / m4Total) * 100).toFixed(1));

  return { m1Score: m1Score, m2Score: m2Score, m3Score: m3Score, m4Score: m4Score, m1Passed: m1Passed, m2Passed: m2Passed, m3Passed: m3Passed, m4Passed: m4Passed };
}

// -----------------------------------------------------------------------------
// HELPER: Evaluate 100 Lenses (L1..L5) exactly as in simulate_100
// -----------------------------------------------------------------------------
function evaluate100Lenses(engine, p1Deliv, p8Deliv, masterDeliv, biz) {
  // L1
  var l1Passed = 0;
  if (engine.completedPhases[1]) l1Passed++;
  if (engine.decisions.length > 0) l1Passed++;
  if (p1Deliv && Array.isArray(p1Deliv.sections) && p1Deliv.sections.length === 5) l1Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[0] && p1Deliv.sections[0].items && p1Deliv.sections[0].items.length > 0) l1Passed++;
  var l1Score = Number(((l1Passed / 4) * 100).toFixed(1));

  // L2
  var l2Passed = 0;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[2] && Array.isArray(p1Deliv.sections[2].checklist) && p1Deliv.sections[2].checklist.length >= 3) l2Passed++;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[1] && p1Deliv.sections[1].flowchart && typeof p1Deliv.sections[1].flowchart === 'string') l2Passed++;
  if (p8Deliv && Array.isArray(p8Deliv.sections) && p8Deliv.sections.length > 0) l2Passed++;
  if (engine.completedPhases[8]) l2Passed++;
  var l2Score = Number(((l2Passed / 4) * 100).toFixed(1));

  // L3
  var l3Passed = 0;
  if (p1Deliv && p1Deliv.sections && p1Deliv.sections[3] && 
      ((Array.isArray(p1Deliv.sections[3].formulas) && p1Deliv.sections[3].formulas.length > 0) || 
       (Array.isArray(p1Deliv.sections[3].kpis) && p1Deliv.sections[3].kpis.length > 0))) l3Passed++;
  if (engine.facts.length > 0) l3Passed++;
  if (biz.cashflowLogic && biz.cashflowLogic.length > 10) l3Passed++;
  if (engine.businessContext && (engine.businessContext.revenueModel || engine.businessContext.customerModel)) l3Passed++;
  var l3Score = Number(((l3Passed / 4) * 100).toFixed(1));

  // L4
  var l4Passed = 0;
  if (engine.businessContext && engine.businessContext.archetype) l4Passed++;
  if (engine.completedPhases[4]) l4Passed++;
  if (engine.completedPhases[5]) l4Passed++;
  if (masterDeliv && Array.isArray(masterDeliv.sections) && masterDeliv.sections.length === 9) l4Passed++;
  var l4Score = Number(((l4Passed / 4) * 100).toFixed(1));

  // L5
  var l5Passed = 0;
  if (biz.guild && biz.guild.length > 5) l5Passed++;
  if (biz.category && biz.category.length > 3) l5Passed++;
  var completedCount = Object.values(engine.completedPhases).filter(Boolean).length;
  if (completedCount === 8) l5Passed++;
  if ((engine.businessContext && engine.businessContext.regulatoryProfile) || (p1Deliv && p1Deliv.sections && p1Deliv.sections[0] && p1Deliv.sections[0].items && p1Deliv.sections[0].items.length > 0)) l5Passed++;
  var l5Score = Number(((l5Passed / 4) * 100).toFixed(1));

  return { l1Score: l1Score, l2Score: l2Score, l3Score: l3Score, l4Score: l4Score, l5Score: l5Score, l1Passed: l1Passed, l2Passed: l2Passed, l3Passed: l3Passed, l4Passed: l4Passed, l5Passed: l5Passed };
}

// =============================================================================
// SUITE 1: 753 Simulation Metric Adversarial Sensitivity & Failure Detection
// =============================================================================
console.log('▶ SUITE 1: 753 Simulation Metric Adversarial Sensitivity Tests');
{
  var sampleBt = BUSINESS_TYPES.find(function(b) { return b.id === 'BT-0014'; }) || BUSINESS_TYPES[0];
  var baseline = simulateHealthyBusiness(sampleBt);
  var baseScores = evaluate753Metrics(baseline.engine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);

  reportChallenge('Baseline 753 Score is 100%', baseScores.m1Score === 100 && baseScores.m4Score === 100, 
    'M1=' + baseScores.m1Score + '%, M4=' + baseScores.m4Score + '%');

  // Challenge 1.1: Phase 1 Gate Blocked -> M1 drops
  {
    var corruptEngine = Object.assign({}, baseline.engine, { completedPhases: Object.assign({}, baseline.engine.completedPhases, { 1: false }) });
    var scores = evaluate753Metrics(corruptEngine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.1: Blocked P1 Gate Drops M1 Score', scores.m1Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m1Score + '% (passed ' + scores.m1Passed + '/8)');
  }

  // Challenge 1.2: Deliverable Generation Fails (p1Deliv = null) -> M1 drops sharply
  {
    var scores = evaluate753Metrics(baseline.engine, null, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.2: Null P1 Deliverable Drops M1 Score to 25%', scores.m1Score === 25.0,
      'Expected 25.0% (2/8), got ' + scores.m1Score + '% (passed ' + scores.m1Passed + '/8)');
  }

  // Challenge 1.3: Flowchart layer missing from P1 Deliverable -> M1 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    delete corruptDeliv.sections[1].flowchart;
    var scores = evaluate753Metrics(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.3: Missing Flowchart Drops M1 Score', scores.m1Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m1Score + '% (passed ' + scores.m1Passed + '/8)');
  }

  // Challenge 1.4: Checklist has < 5 items -> M1 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    corruptDeliv.sections[2].checklist = ['item1', 'item2', 'item3'];
    var scores = evaluate753Metrics(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.4: Truncated Checklist (<5 items) Drops M1 Score', scores.m1Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m1Score + '% (passed ' + scores.m1Passed + '/8)');
  }

  // Challenge 1.5: Missing Formulas & KPIs -> M1 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    delete corruptDeliv.sections[3].formulas;
    delete corruptDeliv.sections[3].kpis;
    var scores = evaluate753Metrics(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.5: Missing Formulas & KPIs Drops M1 Score', scores.m1Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m1Score + '% (passed ' + scores.m1Passed + '/8)');
  }

  // Challenge 1.6: Corporate Jargon Injected into Local Trade -> M2 drops
  {
    var scores = evaluate753Metrics(baseline.engine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt, { injectedJargonCount: 1 });
    reportChallenge('Fault 1.6: Corporate Jargon Injected into Local Trade Drops M2 Score', scores.m2Score === 80.0,
      'Expected 80.0% (4/5), got ' + scores.m2Score + '% (passed ' + scores.m2Passed + '/5)');
  }

  // Challenge 1.7: Taxonomy ID Mutation/Drift -> M3 and M4 drop
  {
    var corruptContext = Object.assign({}, baseline.engine.businessContext, { taxonomyId: 'BT-DRIFTED-9999' });
    var corruptEngine = Object.assign({}, baseline.engine, { businessContext: corruptContext });
    var scores = evaluate753Metrics(corruptEngine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.7: Taxonomy Drift Drops M3 and M4 Scores', scores.m3Score === 83.3 && scores.m4Score === 87.5,
      'Expected M3=83.3% (5/6), got ' + scores.m3Score + '%; Expected M4=87.5% (7/8), got ' + scores.m4Score + '%');
  }

  // Challenge 1.8: Phase 8 Skipped (p < 8 bug reproduction) -> M4 drops severely
  {
    var corruptCompleted = Object.assign({}, baseline.engine.completedPhases);
    delete corruptCompleted[8];
    var corruptPhaseData = Object.assign({}, baseline.engine.phaseData);
    delete corruptPhaseData[8];
    var corruptEngine = Object.assign({}, baseline.engine, { 
      completedPhases: corruptCompleted,
      phaseData: corruptPhaseData
    });
    var scores = evaluate753Metrics(corruptEngine, baseline.p1Deliv, null, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.8: Skipped Phase 8 Drops M4 Score to 62.5% (No Double Counting)', scores.m4Score === 62.5,
      'Expected 62.5% (5/8 passed: failed P8 gate, failed p8Deliv, failed 8/8 persistence), got ' + scores.m4Score + '%');
  }

  // Challenge 1.9: Master Brand Book Truncated (< 9 sections) -> M4 drops
  {
    var corruptMaster = JSON.parse(JSON.stringify(baseline.masterDeliv));
    corruptMaster.sections = corruptMaster.sections.slice(0, 6);
    var scores = evaluate753Metrics(baseline.engine, baseline.p1Deliv, baseline.p8Deliv, corruptMaster, sampleBt);
    reportChallenge('Fault 1.9: Truncated Master Deliverable Drops M4 Score', scores.m4Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m4Score + '% (passed ' + scores.m4Passed + '/8)');
  }

  // Challenge 1.10: State Loss in Intermediate Phase -> M4 drops
  {
    var corruptPhaseData = Object.assign({}, baseline.engine.phaseData);
    corruptPhaseData[3] = {}; // empty phase 3
    var corruptEngine = Object.assign({}, baseline.engine, { phaseData: corruptPhaseData });
    var scores = evaluate753Metrics(corruptEngine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, sampleBt);
    reportChallenge('Fault 1.10: State Loss in Phase 3 Drops M4 Score', scores.m4Score === 87.5,
      'Expected 87.5% (7/8), got ' + scores.m4Score + '% (passed ' + scores.m4Passed + '/8)');
  }
}

// =============================================================================
// SUITE 2: 100-Business Simulation Lenses Adversarial Sensitivity Tests
// =============================================================================
console.log('\n▶ SUITE 2: 100 Simulation Metric Adversarial Sensitivity Tests');
{
  var sampleBt = BUSINESS_TYPES.find(function(b) { return b.id === 'BT-0014'; }) || BUSINESS_TYPES[0];
  var baseline = simulateHealthyBusiness(sampleBt);
  var mockBiz = {
    guild: 'اتحادیه صنف طلا و جواهر تهران',
    category: 'خرده‌فروشی طلا و مسکوکات',
    pain: 'ریسک نوسان مظنه و طلای آب‌شده',
    solution: 'فرمول سود قانونی ۷٪ و فاکتور رسمی مودیان',
    cashflowLogic: 'فروش روزانه نقدی، تسویه طلا با بنکدار در همان روز، سود ثابت ۷٪ اجرت'
  };

  var baseLenses = evaluate100Lenses(baseline.engine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
  reportChallenge('Baseline 100 Lenses Score is 100% across L1..L5', 
    baseLenses.l1Score === 100 && baseLenses.l2Score === 100 && baseLenses.l3Score === 100 && baseLenses.l4Score === 100 && baseLenses.l5Score === 100,
    'L1=' + baseLenses.l1Score + '%, L2=' + baseLenses.l2Score + '%, L3=' + baseLenses.l3Score + '%, L4=' + baseLenses.l4Score + '%, L5=' + baseLenses.l5Score + '%');

  // Challenge 2.1: Phase 1 Gate Blocked -> L1 drops
  {
    var corruptEngine = Object.assign({}, baseline.engine, { completedPhases: Object.assign({}, baseline.engine.completedPhases, { 1: false }) });
    var lenses = evaluate100Lenses(corruptEngine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
    reportChallenge('Fault 2.1: Blocked P1 Gate Drops L1 Score to 75%', lenses.l1Score === 75.0,
      'Expected 75.0% (3/4), got ' + lenses.l1Score + '%');
  }

  // Challenge 2.2: Checklist < 3 items -> L2 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    corruptDeliv.sections[2].checklist = ['only_one_item'];
    var lenses = evaluate100Lenses(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
    reportChallenge('Fault 2.2: Checklist < 3 Items Drops L2 Score to 75%', lenses.l2Score === 75.0,
      'Expected 75.0% (3/4), got ' + lenses.l2Score + '%');
  }

  // Challenge 2.3: Flowchart missing from P1 deliverable -> L2 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    delete corruptDeliv.sections[1].flowchart;
    var lenses = evaluate100Lenses(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
    reportChallenge('Fault 2.3: Missing Flowchart Drops L2 Score to 75%', lenses.l2Score === 75.0,
      'Expected 75.0% (3/4), got ' + lenses.l2Score + '%');
  }

  // Challenge 2.4: Phase 8 Incomplete -> L2 and L5 drop
  {
    var corruptEngine = Object.assign({}, baseline.engine, { completedPhases: Object.assign({}, baseline.engine.completedPhases, { 8: false }) });
    var lenses = evaluate100Lenses(corruptEngine, baseline.p1Deliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
    reportChallenge('Fault 2.4: Phase 8 Incomplete Drops Both L2 and L5 Scores', lenses.l2Score === 75.0 && lenses.l5Score === 75.0,
      'Expected L2=75%, L5=75%; got L2=' + lenses.l2Score + '%, L5=' + lenses.l5Score + '%');
  }

  // Challenge 2.5: Formulas & KPIs missing -> L3 drops
  {
    var corruptDeliv = JSON.parse(JSON.stringify(baseline.p1Deliv));
    delete corruptDeliv.sections[3].formulas;
    delete corruptDeliv.sections[3].kpis;
    var lenses = evaluate100Lenses(baseline.engine, corruptDeliv, baseline.p8Deliv, baseline.masterDeliv, mockBiz);
    reportChallenge('Fault 2.5: Missing Formulas & KPIs Drops L3 Score to 75%', lenses.l3Score === 75.0,
      'Expected 75.0% (3/4), got ' + lenses.l3Score + '%');
  }

  // Challenge 2.6: Master Deliverable has < 9 sections -> L4 drops
  {
    var corruptMaster = JSON.parse(JSON.stringify(baseline.masterDeliv));
    corruptMaster.sections = corruptMaster.sections.slice(0, 5);
    var lenses = evaluate100Lenses(baseline.engine, baseline.p1Deliv, baseline.p8Deliv, corruptMaster, mockBiz);
    reportChallenge('Fault 2.6: Truncated Master Deliverable Drops L4 Score to 75%', lenses.l4Score === 75.0,
      'Expected 75.0% (3/4), got ' + lenses.l4Score + '%');
  }

  // Challenge 2.7: Total Engine Failure / Empty State -> All lenses drop to 0% (or genuine external data)
  {
    var emptyEngine = new OrchestratorEngine();
    var emptyBiz = {};
    var lenses = evaluate100Lenses(emptyEngine, null, null, null, emptyBiz);
    reportChallenge('Fault 2.7: Empty State Yields 0% Across All Lenses (Zero Artificial Floors)', 
      lenses.l1Score === 0.0 && lenses.l2Score === 0.0 && lenses.l3Score === 0.0 && lenses.l4Score === 0.0 && lenses.l5Score === 0.0,
      'L1=' + lenses.l1Score + '%, L2=' + lenses.l2Score + '%, L3=' + lenses.l3Score + '%, L4=' + lenses.l4Score + '%, L5=' + lenses.l5Score + '%');
  }
}

// =============================================================================
// SUITE 3: Multi-Sector Customization & Failure Injection Tests
// =============================================================================
console.log('\n▶ SUITE 3: Multi-Sector Customization & Fault-Injection Tests');
{
  // Challenge 3.1: Verify Leakage Detection Sensitivity
  var testLeakageDetection = function(text) {
    return text.includes('خودرو') || text.includes('کارواش') || text.includes('نانوسرامیک') || 
           text.includes('روغن تقلبی') || text.includes('تعویض‌روغنی');
  };

  var cleanText = 'تضمین اصالت سنگ‌های قیمتی و صدور شناسنامه بین‌المللی گوهرشناسی';
  var leakedText = 'تضمین نانوسرامیک بدنه و عدم استفاده از روغن تقلبی در کلینیک';
  reportChallenge('Fault 3.1: Leakage Oracle Correctly Distinguishes Clean vs Leaked Content',
    !testLeakageDetection(cleanText) && testLeakageDetection(leakedText),
    'Clean text passed: ' + !testLeakageDetection(cleanText) + ', Leaked text flagged: ' + testLeakageDetection(leakedText));

  // Challenge 3.2: Verify Stage Options Synthesis Differentiation
  var testStageGoals = function() {
    var stages = ['idea', 'pre_launch', 'active', 'rebrand'];
    var results = {};
    for (var i = 0; i < stages.length; i++) {
      var stage = stages[i];
      var eng = new OrchestratorEngine();
      eng.processUserResponse('صنف انتخابی: طلا، جواهر و نقره‌فروشی (BT-0014)', 'BT-0014');
      var q0 = eng.getCurrentQuestion();
      eng.processUserResponse(q0.options[0].text, q0.options[0].value);
      eng.processUserResponse('Stage text', stage);
      eng.processUserResponse('محلی', 'local_city');
      var qGoal = eng.getCurrentQuestion();
      results[stage] = qGoal.options[0].text;
    }
    var values = Object.values(results);
    var uniqueOptions = new Set(values);
    return uniqueOptions.size === 4;
  };

  reportChallenge('Fault 3.2: Distinct Goal Options Synthesized for All 4 Stages (IDEA, PRE_LAUNCH, ACTIVE, REBRAND)',
    testStageGoals(),
    'All 4 stages generated mutually distinct strategic primary goals');

  // Challenge 3.3: Verify Geography Registration Fidelity
  var testGeographies = function() {
    var geos = ['local_city', 'provincial', 'nationwide_iran', 'international'];
    for (var i = 0; i < geos.length; i++) {
      var geo = geos[i];
      var eng = new OrchestratorEngine();
      eng.processUserResponse('صنف انتخابی: طلا، جواهر و نقره‌فروشی (BT-0014)', 'BT-0014');
      var q0 = eng.getCurrentQuestion();
      eng.processUserResponse(q0.options[0].text, q0.options[0].value);
      eng.processUserResponse('active text', 'active');
      eng.processUserResponse('Geo text for ' + geo, geo);
      if (eng.phaseData[1].geographyValue !== geo) return false;
    }
    return true;
  };

  reportChallenge('Fault 3.3: All 4 Geographies Faithfully Registered in phaseData[1]',
    testGeographies(),
    'local_city, provincial, nationwide_iran, international verified');

  // Challenge 3.4: Verify Trade Name Diagnostic Probing Injection
  var testProbingTitle = function() {
    var testIds = ['BT-0014', 'BT-0066', 'BT-0100', 'BT-0221', 'BT-0166', 'BT-0496'];
    for (var i = 0; i < testIds.length; i++) {
      var id = testIds[i];
      var bt = BUSINESS_TYPES.find(function(b) { return b.id === id; });
      var eng = new OrchestratorEngine();
      var res = eng.processUserResponse('صنف انتخابی: ' + bt.titleFa + ' (' + bt.id + ')', bt.id);
      if (!res.nextQuestion || !res.nextQuestion.title || !res.nextQuestion.title.includes(bt.titleFa)) return false;
    }
    return true;
  };

  reportChallenge('Fault 3.4: Diagnostic Probing Title Correctly Injects Exact Trade Name',
    testProbingTitle(),
    'Verified across 6 distinct economic sector trades');
}

console.log('\n======================================================================');
console.log('EMPIRICAL CHALLENGER AUDIT SUMMARY: ' + passedChallenges + '/' + totalChallenges + ' CHALLENGES PASSED');
if (failedChallenges === 0) {
  console.log('ALL ADVERSARIAL STRESS CHALLENGES PASSED! ZERO MASKING DETECTED.');
  process.exit(0);
} else {
  console.error(failedChallenges + ' CHALLENGES FAILED! VULNERABILITY DETECTED.');
  process.exit(1);
}
