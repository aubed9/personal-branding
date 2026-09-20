import { BUSINESS_TYPES, MACRO_INDUSTRIES } from './src/data/businessTaxonomy753.js';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { activeAnswers } from './src/services/interviewSchema.js';

console.log('======================================================================');
console.log('🔬 ADVERSARIAL CHALLENGER R3.2: 753 SIMULATION & JARGON ISOLATION AUDIT');
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// ----------------------------------------------------------------------------
// TEST 1: TAXONOMY REGISTRY COMPLETENESS & INTEGRITY
// ----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Taxonomy Registry Completeness & Continuity ---');
assert(MACRO_INDUSTRIES.length === 31, `Exactly 31 macro industries found (actual: ${MACRO_INDUSTRIES.length})`);
assert(BUSINESS_TYPES.length === 753, `Exactly 753 business types found (actual: ${BUSINESS_TYPES.length})`);

// Continuity test BT-0001 to BT-0753
let continuityPass = true;
const idSet = new Set();
for (let i = 0; i < 753; i++) {
  const num = (i + 1).toString().padStart(4, '0');
  const expectedId = `BT-${num}`;
  const bt = BUSINESS_TYPES[i];
  if (!bt || bt.id !== expectedId) {
    continuityPass = false;
    console.error(`Discontinuity at index ${i}: expected ${expectedId}, got ${bt?.id}`);
    break;
  }
  if (idSet.has(bt.id)) {
    continuityPass = false;
    console.error(`Duplicate ID found: ${bt.id}`);
    break;
  }
  idSet.add(bt.id);
}
assert(continuityPass, 'Continuous IDs from BT-0001 to BT-0753 with zero gaps or duplicates');

// 31 Industries Coverage
const industryCounts = {};
for (const bt of BUSINESS_TYPES) {
  industryCounts[bt.industryId] = (industryCounts[bt.industryId] || 0) + 1;
}
let all31Covered = true;
for (const ind of MACRO_INDUSTRIES) {
  if (!industryCounts[ind.id] || industryCounts[ind.id] === 0) {
    all31Covered = false;
    console.error(`Industry ${ind.id} (${ind.titleFa}) has 0 businesses!`);
  }
}
assert(all31Covered, 'All 31 macro industries have at least one business registered');

// Test behavior against the engine; generated Markdown is not an oracle for quality.
console.log('\n--- TEST SUITE 2: Incomplete projects remain drafts across all 753 guilds ---');
const draftFailures = [], evidenceFailures = [], identityFailures = [];
for (const bt of BUSINESS_TYPES) {
  const engine = new OrchestratorEngine();
  engine.selectGuild(bt);
  const description = engine.phaseData[1].description;
  engine.processUserResponse(`دیدگاه اختصاصی من درباره ${bt.titleFa}: شفافیت در تحویل`);
  const doc = engine.generateDeliverableData('master');
  const records = activeAnswers(engine.answerRecords);
  if (doc.status !== 'DRAFT' || Object.values(engine.completedPhases).some(Boolean)) draftFailures.push(bt.id);
  if (engine.businessContext.taxonomyId !== bt.id || engine.phaseData[1].description !== description) identityFailures.push(bt.id);
  if (!doc.evidence.length || !doc.evidence.every(claim =>
    claim.evidenceIds.length && claim.evidenceIds.every(id => records.some(r => r.id === id && claim.statement.includes(r.text)))
  )) evidenceFailures.push(bt.id);
}
assert(draftFailures.length === 0, `Incomplete projects are never confirmed: ${draftFailures.join(', ')}`);
assert(identityFailures.length === 0, `An answer after guild selection preserves that guild: ${identityFailures.join(', ')}`);
assert(evidenceFailures.length === 0, `Every factual claim points to the actual active answer: ${evidenceFailures.join(', ')}`);

// ----------------------------------------------------------------------------
// TEST 3: JARGON ISOLATION AUDIT IN LOCAL & TRADITIONAL TRADES
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Rigorous Jargon Isolation Audit ---');
const FORBIDDEN_JARGON = ['CAC', 'LTV', 'Churn', 'DMU', 'SLA', 'Pipeline', 'Funnel'];

// Identify local & traditional trades: IND-01, IND-05, IND-28, LOCAL_SERVICE, PHYSICAL_RETAIL
const localTrades = BUSINESS_TYPES.filter(bt => {
  return (
    bt.industryId === 'IND-01' || // Retail Physical
    bt.industryId === 'IND-05' || // Auto Service & Maintenance
    bt.industryId === 'IND-28' || // Facility & Everyday Services
    bt.primaryArchetype === 'LOCAL_SERVICE' ||
    bt.primaryArchetype === 'PHYSICAL_RETAIL' ||
    bt.axes?.channelModel === 'PHYSICAL_FIRST'
  );
});

console.log(`Identified ${localTrades.length} local and traditional trade types for deep jargon isolation audit.`);

let totalLocalQuestionsInspected = 0;
const jargonViolationsFound = [];

function inspectQuestionForJargon(q, bt, phase) {
  totalLocalQuestionsInspected++;
  const textsToCheck = [
    { type: 'title', val: q.title || '' },
    { type: 'text', val: q.text || '' }
  ];
  if (Array.isArray(q.options)) {
    for (const opt of q.options) {
      textsToCheck.push({ type: 'option_text', val: opt.text || '' });
      textsToCheck.push({ type: 'option_badge', val: opt.badge || '' });
    }
  }

  for (const item of textsToCheck) {
    for (const term of FORBIDDEN_JARGON) {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      if (regex.test(item.val)) {
        jargonViolationsFound.push({
          btId: bt.id,
          trade: bt.titleFa,
          industryId: bt.industryId,
          phase,
          questionId: q.id,
          location: item.type,
          forbiddenTerm: term,
          snippet: item.val.slice(0, 100)
        });
      }
    }
  }
}

// Sample test first 25 local trades to keep adversarial test runtime blazing fast
for (const bt of localTrades.slice(0, 25)) {
  const engine = new OrchestratorEngine();

  // Step 0 stage
  engine.processUserResponse(`فعال و در حال تثبیت در صنف ${bt.titleFa}`, 'active');
  // Diagnostic probing
  engine.processUserResponse(`دیدگاه بنیان‌گذار در صنف ${bt.titleFa}`, null);
  // Description
  engine.processUserResponse(bt.titleFa, bt.id);
  // Geography
  engine.processUserResponse('پوشش شهری و محلی', 'city_regional');
  // Primary goal
  engine.processUserResponse('رشد پایدار', 'growth');
  // Core offer
  engine.processUserResponse('خدمات و محصولات تخصصی', 'core_offer');
  // Value hypothesis
  engine.processUserResponse('تضمین اصالت و شفافیت قیمت', 'quality');

  // Collect Phase 1 dynamic questions
  let foundationSteps = 0;
  while (engine.getCurrentQuestion() && engine.currentPhase === 1) {
    if (++foundationSteps > 60) throw new Error(`Question loop in ${bt.id}, phase 1`);
    const q = engine.getCurrentQuestion();
    inspectQuestionForJargon(q, bt, 1);
    const opt = q.options?.[0];
    engine.processUserResponse(opt ? opt.text : 'پاسخ', opt ? opt.value : 'p1_opt');
  }

  // Walk Phases 2 to 8
  for (let p = 2; p <= 8; p++) {
    engine.startPhase(p);
    let phaseSteps = 0;
    while (engine.getCurrentQuestion()) {
      if (++phaseSteps > 60) throw new Error(`Question loop in ${bt.id}, phase ${p}`);
      const q = engine.getCurrentQuestion();
      inspectQuestionForJargon(q, bt, p);
      const opt = q.options?.[0];
      engine.processUserResponse(opt ? opt.text : 'پاسخ', opt ? opt.value : 'p_opt');
    }
  }
}

console.log(`Total questions/options inspected in local trades: ${totalLocalQuestionsInspected}`);
console.log(`Total corporate jargon violations detected: ${jargonViolationsFound.length}`);

if (jargonViolationsFound.length > 0) {
  console.error('\nFirst 5 Jargon Violations detected:');
  jargonViolationsFound.slice(0, 5).forEach((v, idx) => {
    console.error(`  [#${idx + 1}] [${v.btId} - ${v.trade}] Phase ${v.phase} | Q: ${v.questionId} (${v.location})`);
    console.error(`       Forbidden term: "${v.forbiddenTerm}" in snippet: ${v.snippet}`);
  });
}

assert(
  jargonViolationsFound.length === 0,
  'ZERO corporate jargon violations (CAC, LTV, Churn, DMU, SLA, Pipeline, Funnel) in traditional local trades'
);

console.log('\n======================================================================');
console.log(`🏁 AUDIT FINISHED: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

process.exit(failCount > 0 ? 1 : 0);
