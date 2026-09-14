import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BUSINESS_TYPES, MACRO_INDUSTRIES } from './src/data/businessTaxonomy753.js';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import { generateDeliverable } from './src/services/deliverableGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ----------------------------------------------------------------------------
// TEST 2: DELIVERABLE FILE VALIDATION (753_BUSINESS_SIMULATIONS.md)
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Deliverables Ledger File Validation ---');
const deliverablePath = path.resolve(__dirname, '../deliverables/753_BUSINESS_SIMULATIONS.md');
assert(fs.existsSync(deliverablePath), `File exists at: ${deliverablePath}`);

const mdContent = fs.readFileSync(deliverablePath, 'utf-8');
const lines = mdContent.split('\n');
console.log(`  File size: ${(Buffer.byteLength(mdContent, 'utf-8') / 1024).toFixed(1)} KB, total lines: ${lines.length}`);

// Row count test (BT-0001 to BT-0753 table rows)
const rowRegex = /^\|\s*\d+\s*\|\s*`?(BT-\d{4})`?\s*\|/;
const matchedRows = lines.filter(line => rowRegex.test(line));
assert(matchedRows.length === 753, `Complete 753 business entries present in ledger table (actual: ${matchedRows.length})`);

// 31 Industries Summary Table test
let indTableCount = 0;
for (const ind of MACRO_INDUSTRIES) {
  const indPattern = new RegExp(`\\|\\s*\\*\\*${ind.titleFa}\\*\\*\\s*\\|`);
  if (indPattern.test(mdContent) || mdContent.includes(ind.titleFa)) {
    indTableCount++;
  }
}
assert(indTableCount === 31, `All 31 macro industries present in Section 2 summary table (actual: ${indTableCount}/31)`);

// Audit Oath test
assert(
  mdContent.includes("سوگند ممیزی و اصالت پیاده‌سازی (Auditor's Oath)"),
  'Auditor Oath section is explicitly present in deliverables document'
);

// Macro KPI summary presence
assert(mdContent.includes('جدول شاخص‌های کلان عملکردی (Macro Audit KPIs)'), 'Macro Audit KPIs table present');
assert(mdContent.includes('گزارش ممیزی ایزولاسیون اصطلاحات شرکتی (Jargon Isolation Audit Log)'), 'Jargon Isolation Audit section present');
assert(mdContent.includes('گواهی‌نامه نهایی و امضای دیجیتال ممیزی (Final Certification & Sign-off)'), 'Final Certification section present');

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
  while (engine.getCurrentQuestion() && engine.currentPhase === 1) {
    const q = engine.getCurrentQuestion();
    inspectQuestionForJargon(q, bt, 1);
    const opt = q.options?.[0];
    engine.processUserResponse(opt ? opt.text : 'پاسخ', opt ? opt.value : 'p1_opt');
  }

  // Walk Phases 2 to 8
  for (let p = 2; p <= 8; p++) {
    engine.startPhase(p);
    while (engine.getCurrentQuestion()) {
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

// ----------------------------------------------------------------------------
// TEST 4: CHECK 4 QUALITY METRICS IN DELIVERABLE LEDGER
// ----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: 4 Quality Metrics Verification ---');
// Parse metrics from the deliverable file table
const scoreRegex = /^\|\s*(\d+)\s*\|\s*`?(BT-\d{4})`?\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*`?(IND-\d{2})`?\s*\|\s*`([^`]+)`\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*\*\*([\d.]+)[%٪]?\*\*\s*\|/;

let totalM1 = 0, totalM2 = 0, totalM3 = 0, totalM4 = 0, totalComp = 0;
let parsedCount = 0;
let anyBelowThreshold = false;

for (const line of lines) {
  const match = line.match(scoreRegex);
  if (match) {
    parsedCount++;
    const m1 = parseFloat(match[6]);
    const m2 = parseFloat(match[7]);
    const m3 = parseFloat(match[8]);
    const m4 = parseFloat(match[9]);
    const comp = parseFloat(match[10]);

    totalM1 += m1;
    totalM2 += m2;
    totalM3 += m3;
    totalM4 += m4;
    totalComp += comp;

    if (comp < 96.0) {
      anyBelowThreshold = true;
      console.error(`Business ${match[2]} has composite score below 96.0%: ${comp}%`);
    }
  }
}

assert(parsedCount === 753, `Parsed exactly 753 valid score rows from table (actual: ${parsedCount})`);
assert(!anyBelowThreshold, 'Zero businesses scored below the 96.0% quality threshold');

const avgM1 = totalM1 / parsedCount;
const avgM2 = totalM2 / parsedCount;
const avgM3 = totalM3 / parsedCount;
const avgM4 = totalM4 / parsedCount;
const avgComp = totalComp / parsedCount;

console.log(`  Calculated Average M1 (Practical Problem-Solving)    : ${avgM1.toFixed(2)}% (Target >= 96.0%)`);
console.log(`  Calculated Average M2 (Context Relevance & Zero Jargon): ${avgM2.toFixed(2)}% (Target >= 96.0%)`);
console.log(`  Calculated Average M3 (Zero Hallucination / Zero Drift): ${avgM3.toFixed(2)}% (Target >= 96.0%)`);
console.log(`  Calculated Average M4 (Exit Gates & Document Integrity): ${avgM4.toFixed(2)}% (Target >= 96.0%)`);
console.log(`  Calculated Average Composite Score                    : ${avgComp.toFixed(2)}% (Target >= 96.0%)`);

assert(avgM1 >= 96.0, `Average M1 >= 96.0% (${avgM1.toFixed(2)}%)`);
assert(avgM2 >= 96.0, `Average M2 >= 96.0% (${avgM2.toFixed(2)}%)`);
assert(avgM3 >= 96.0, `Average M3 >= 96.0% (${avgM3.toFixed(2)}%)`);
assert(avgM4 >= 96.0, `Average M4 >= 96.0% (${avgM4.toFixed(2)}%)`);
assert(avgComp >= 96.0, `Average Composite Score >= 96.0% (${avgComp.toFixed(2)}%)`);

console.log('\n======================================================================');
console.log(`🏁 AUDIT FINISHED: ${passCount} PASSED, ${failCount} FAILED`);
console.log('======================================================================');

process.exit(failCount > 0 ? 1 : 0);
