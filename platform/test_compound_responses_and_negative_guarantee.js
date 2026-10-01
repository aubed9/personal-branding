/**
 * Test Suite: Compound Response Separation, Zero-Synthetic-Zeros, and Negative Guarantee Safety
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSemanticInput,
  detectUnknownIntent,
  detectNegativeGuaranteeIntent,
  splitCompoundResponse,
  extractProposedFinancials
} from './src/services/semanticParser.js';
import { OrchestratorEngine } from './src/services/orchestratorEngine.js';

test('Compound splitting: separates known fact from unmeasured cost clause', () => {
  const text = 'مرجوعی سایز رو داریم که حدود ۱۵ درصده ولی هزینه ارسال دقیقش هنوز نامعلومه و حساب نکردیم';
  const res = splitCompoundResponse(text);

  assert.equal(res.isCompound, true, 'Detected compound input');
  assert.match(res.knownPart, /۱۵ درصد/, 'Known part contains return rate');
  assert.equal(res.unmeasuredComponent, 'هزینه ارسال', 'Identified unmeasured component');
  assert.equal(res.unknownCategory, 'UNMEASURED_TIMING', 'Identified unmeasured timing category');
});

test('Compound input: parseSemanticInput preserves known fact and does not wipe to UNKNOWN_ANSWER', () => {
  const text = 'قیمت فروش هر واحد رو ۵۰۰ هزار تومن گذاشتیم ولی هزینه متغیر تولید هنوز مشخص نیست و حساب نکردیم';
  const parsed = parseSemanticInput(text);

  assert.equal(parsed.isCompound, true, 'Marked as compound');
  assert.equal(parsed.hasPartialUnknown, true, 'Has partial unknown');
  assert.equal(parsed.isUnknown, false, 'Overall response is NOT marked as complete unknown (so facts are preserved)');
  assert.ok(parsed.proposedFinancials.hasFinancialCandidates, 'Financial candidates detected');
  assert.equal(parsed.proposedFinancials.proposal.unitPrice, 500000, 'Unit price extracted');
  assert.equal(parsed.proposedFinancials.proposal.variableCost, null, 'Variable cost remains NULL (NO synthetic zero!)');
  assert.notEqual(parsed.proposedFinancials.proposal.variableCost, 0, 'Must NOT be synthetic zero');
  assert.match(parsed.hypothesis, /مجهول تفکیک‌شده/, 'Hypothesis notes separated unknown');
});

test('Negative guarantee detection: explicit refusal to guarantee is safe and not an unknown admission', () => {
  const text1 = 'ما نتیجه را تضمین نمی‌کنیم چون متغیرهای رقابتی بازار متغیر هستند';
  assert.equal(detectNegativeGuaranteeIntent(text1), true, 'Detected negative guarantee in text 1');

  const parsed1 = parseSemanticInput(text1);
  assert.equal(parsed1.isNegativeGuarantee, true, 'Flagged isNegativeGuarantee');
  assert.equal(parsed1.isUnknown, false, 'Refusing unsupported guarantee is NOT an unknown admission');

  const text2 = 'بدون تضمین سود غیرواقعی و با ارزیابی مستمر کار می‌کنیم';
  assert.equal(detectNegativeGuaranteeIntent(text2), true, 'Detected negative guarantee in text 2');

  const text3 = 'گارانتی بازگشت وجه نداریم چون خدمات سفارشی و غیرقابل بازگشت است';
  assert.equal(detectNegativeGuaranteeIntent(text3), true, 'Detected negative guarantee in text 3');
});

test('Positive guarantee phrases are NOT marked as negative guarantee', () => {
  const text = 'با تضمین بالاترین کیفیت و گارانتی کتبی خدمات ارائه می‌دهیم';
  assert.equal(detectNegativeGuaranteeIntent(text), false, 'Positive guarantee is not negative');
});

test('OrchestratorEngine preserves user text on compound responses and records partial unknown', () => {
  const engine = new OrchestratorEngine();
  const text = 'فروش ماهانه ما ۳۰۰ واحد است ولی هزینه ارسال هر بسته نامعلومه و هنوز حساب نکردیم';
  
  engine.processUserResponse('کافه و رستوران محلی', 'RETAIL');
  engine.processUserResponse(text, null);

  const lastRecord = engine.answerRecords[engine.answerRecords.length - 1];
  assert.equal(lastRecord.text, text, 'Recorded full user text without wiping to UNKNOWN_ANSWER');
  assert.notEqual(lastRecord.text, 'هنوز مشخص نیست / نیاز به بررسی', 'Did NOT replace user text with generic placeholder');
});
