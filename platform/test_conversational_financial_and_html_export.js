/**
 * Test Suite: Conversational Persian Financial Parser & HTML Deliverable Exporter
 */

import { extractProposedFinancials, parseSemanticInput } from "./src/services/semanticParser.js";
import { generateClientHtmlReport } from "./src/services/htmlReportExporter.js";

console.log("\n======================================================================");
console.log("🚀 STARTING TESTS: CONVERSATIONAL FINANCIAL PARSER & HTML EXPORTER");
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
  }
}

// ---------------------------------------------------------------------------
// SUITE 1: extractProposedFinancials
// ---------------------------------------------------------------------------
console.log("▶ SUITE 1: extractProposedFinancials & Multiplier Expansion");

const testText1 = "قیمت هر واحد رو ۶۵۰ هزار تومن گذاشتیم و هزینه تولیدش ۲۵۰ هزار تومنه و هزینه ثابت ماهانه هم ۴۰ میلیون تومنه";
const res1 = extractProposedFinancials(testText1);

assert(res1.hasFinancialCandidates === true, "Detected financial candidates in conversational text");
assert(res1.proposal.currency === "TOMAN", "Detected TOMAN currency");
assert(res1.proposal.unitPrice === 650000, `Unit price parsed as 650,000 (got: ${res1.proposal.unitPrice})`);
assert(res1.proposal.variableCost === 250000, `Variable cost parsed as 250,000 (got: ${res1.proposal.variableCost})`);
assert(res1.proposal.monthlyFixedCost === 40000000, `Fixed cost parsed as 40,000,000 (got: ${res1.proposal.monthlyFixedCost})`);
assert(res1.extractedSummaryFa.includes("۶۵۰٬۰۰۰"), "Persian summary formatted properly");

const testText2 = "ماهانه ظرفیت تولید ۵۰۰۰ دونه کالا رو داریم و ماهی ۳۰۰ تا فروش داریم";
const res2 = extractProposedFinancials(testText2);
assert(res2.hasFinancialCandidates === true, "Detected capacity and sales");
assert(res2.proposal.monthlyCapacity === 5000, `Monthly capacity parsed as 5,000 (got: ${res2.proposal.monthlyCapacity})`);
assert(res2.proposal.monthlySales === 300, `Monthly sales parsed as 300 (got: ${res2.proposal.monthlySales})`);

const testText3 = "سلام، ما یک کسب‌وکار در حوزه طراحی لباس هستیم و در مشهد فعالیت داریم";
const res3 = extractProposedFinancials(testText3);
assert(res3.hasFinancialCandidates === false, "Non-financial message returns hasFinancialCandidates: false");
assert(res3.proposal === null, "Proposal is null when no numbers present");

const testText4 = "خرج ماهانه ۲ میلیارد ریال هست";
const res4 = extractProposedFinancials(testText4);
assert(res4.hasFinancialCandidates === true, "Detected IRR billion multiplier");
assert(res4.proposal.currency === "IRR", "Detected IRR currency");
assert(res4.proposal.monthlyFixedCost === 2000000000, `Fixed cost parsed as 2,000,000,000 (got: ${res4.proposal.monthlyFixedCost})`);

// ---------------------------------------------------------------------------
// SUITE 2: parseSemanticInput Integration
// ---------------------------------------------------------------------------
console.log("\n▶ SUITE 2: parseSemanticInput Integration with proposedFinancials");

const fullParsed = parseSemanticInput(testText1);
assert(fullParsed.proposedFinancials !== undefined, "proposedFinancials exposed on parseSemanticInput");
assert(fullParsed.proposedFinancials.hasFinancialCandidates === true, "parseSemanticInput detected candidates");
assert(fullParsed.proposedFinancials.proposal.unitPrice === 650000, "parseSemanticInput carries correct unitPrice");

// ---------------------------------------------------------------------------
// SUITE 3: generateClientHtmlReport
// ---------------------------------------------------------------------------
console.log("\n▶ SUITE 3: generateClientHtmlReport Generator");

const mockDeliverable = {
  title: "کتابچه راهبردی صنف فناوری",
  phase: "فاز ۳: استراتژی برند",
  version: "1.2.0",
  date: "۱۴۰۳/۰۷/۰۵",
  sections: [
    {
      id: "sec-1",
      title: "بیانیه جایگاه‌یابی",
      type: "استراتژی تمایز",
      items: [
        "جایگاه‌یابی مبتنی بر کیفیت و دانش عمیق",
        "تمرکز بر مشتریان سازمانی B2B با قراردادهای بلندمدت"
      ]
    },
    {
      id: "sec-2",
      title: "اقتصاد واحد و نقطه سربه‌سر",
      type: "تحلیل مالی",
      text: "حاشیه مشارکت هر واحد ۶۷٪ و فروش سربه‌سر ماهانه ۱۰۸ واحد محاسبه گردید."
    }
  ]
};

const htmlOutput = generateClientHtmlReport(mockDeliverable, "مارک‌داون پیش‌فرض");

assert(typeof htmlOutput === "string", "HTML output is string");
assert(htmlOutput.includes("<!DOCTYPE html>"), "Contains DOCTYPE html");
assert(htmlOutput.includes('dir="rtl"'), "RTL direction configured");
assert(htmlOutput.includes("کتابچه راهبردی صنف فناوری"), "Contains deliverable title");
assert(htmlOutput.includes("جایگاه‌یابی مبتنی بر کیفیت"), "Contains section items");
assert(htmlOutput.includes("@media print"), "Contains print media stylesheet");
assert(!htmlOutput.includes("undefined"), "Zero undefined strings in HTML");
assert(!htmlOutput.includes("NaN"), "Zero NaN strings in HTML");
assert(!htmlOutput.includes("[object Object]"), "Zero [object Object] in HTML");

console.log("\n======================================================================");
console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("======================================================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
