import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateKnowledgeClaim, retrieveCanonicalKnowledge } from './src/knowledge/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const json = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));

const sources = json('wiki/source-registry.json').sources;
const claims = json('wiki/claims.json').claims;
const index = json('wiki/generated/retrieval-index.json');

test('first external Iran evidence batch preserves verification boundaries', () => {
  for (const id of [
    'SRC-IR-SCI-CPI-1405-05',
    'SRC-IR-SHAPARAK-REPORT-134',
    'SRC-IR-ECOM-REPORT-1403',
  ]) {
    const source = sources[id];
    assert.ok(source, `missing ${id}`);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'A');
    assert.equal(source.verified_at, '2026-09-24');
    assert.match(source.checksum || '', /^git-blob:[0-9a-f]{40}$/);
    assert.ok(source.repository_location?.startsWith('wiki/snapshots/iran/'));
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
  }

  const cbi = sources['SRC-IR-CBI-CPI-1405-05'];
  assert.ok(cbi);
  assert.equal(cbi.status, 'NEEDS_RESEARCH');
  assert.equal(cbi.verified_at, null);
  assert.match(cbi.limitations, /direct CBI bulletin URL\/version was not recovered/i);
});

test('verified Iran claims are indexed while unresolved CBI claim is excluded', () => {
  const ids = new Set(index.entries.map(entry => entry.claim_id));
  for (const id of [
    'KCL-IR-SCI-CPI-1405-05',
    'KCL-IR-SHAPARAK-134',
    'KCL-IR-ECOM-1403',
  ]) assert.ok(ids.has(id), `verified claim missing from retrieval: ${id}`);

  assert.equal(ids.has('KCL-IR-CBI-CPI-1405-05'), false);
  assert.equal(claims['KCL-IR-CBI-CPI-1405-05'].status, 'NEEDS_RESEARCH');

  const admission = evaluateKnowledgeClaim(
    claims['KCL-IR-CBI-CPI-1405-05'],
    sources,
    { asOf: new Date('2026-09-24T00:00:00Z') }
  );
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
});

test('Iran macro retrieval selects SCI national CPI and does not conflate unresolved urban CBI CPI', () => {
  const results = retrieveCanonicalKnowledge(
    'تورم شاخص قیمت مصرف کننده ایران',
    index.entries,
    claims,
    sources,
    {
      phase: 1,
      moduleIds: ['MOD-REV-TRANSACTION'],
      jurisdiction: 'IRAN',
      asOf: new Date('2026-09-24T00:00:00Z'),
      topK: 10,
    }
  );
  const ids = results.map(result => result.entry.claim_id);
  assert.ok(ids.includes('KCL-IR-SCI-CPI-1405-05'));
  assert.equal(ids.includes('KCL-IR-CBI-CPI-1405-05'), false);

  const sci = claims['KCL-IR-SCI-CPI-1405-05'];
  assert.match(sci.limitations, /بانک مرکزی.*مناطق شهری|مناطق شهری/i);
});

test('online-channel retrieval can select exact Shaparak and annual e-commerce evidence', () => {
  const paymentResults = retrieveCanonicalKnowledge(
    'تراکنش پرداخت شبکه پرداخت',
    index.entries,
    claims,
    sources,
    {
      phase: 8,
      moduleIds: ['MOD-CHANNEL-ONLINE'],
      jurisdiction: 'IRAN',
      asOf: new Date('2026-09-24T00:00:00Z'),
      topK: 10,
    }
  );
  assert.ok(paymentResults.some(result => result.entry.claim_id === 'KCL-IR-SHAPARAK-134'));

  const ecomResults = retrieveCanonicalKnowledge(
    'تجارت الکترونیکی بازار آنلاین ایران',
    index.entries,
    claims,
    sources,
    {
      phase: 8,
      moduleIds: ['MOD-CHANNEL-ONLINE'],
      jurisdiction: 'IRAN',
      asOf: new Date('2026-09-24T00:00:00Z'),
      topK: 10,
    }
  );
  assert.ok(ecomResults.some(result => result.entry.claim_id === 'KCL-IR-ECOM-1403'));
});

test('all promoted external claims retain exact locators and explicit applicability limits', () => {
  for (const id of [
    'KCL-IR-SCI-CPI-1405-05',
    'KCL-IR-SHAPARAK-134',
    'KCL-IR-ECOM-1403',
  ]) {
    const claim = claims[id];
    assert.equal(claim.status, 'VERIFIED');
    assert.equal(claim.decision_driving, true);
    assert.equal(claim.authority_requirement, 'A');
    assert.ok(claim.source_ids.length > 0);
    assert.equal(claim.locators.length, claim.source_ids.length);
    assert.ok(claim.locators.every(locator => locator.locator?.length > 20));
    assert.ok(claim.limitations.length > 20);
  }
});

test('Digikala 1404 first-party metrics are verified but strictly platform-scoped', () => {
  const source = sources['SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST'];
  const ids = [
    'KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH',
    'KCL-IR-DIGIKALA-1404-DIGITAL-GOLD',
    'KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE',
  ];

  assert.ok(source);
  assert.equal(source.status, 'VERIFIED');
  assert.equal(source.authority_tier, 'C');
  assert.equal(source.verified_at, '2026-09-25');
  assert.equal(source.jurisdiction_or_scope, 'DIGIKALA_PLATFORM');
  assert.match(source.checksum || '', /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, source.repository_location)));

  const indexed = new Set(index.entries.map(entry => entry.claim_id));
  for (const id of ids) {
    const claim = claims[id];
    assert.ok(claim, id);
    assert.equal(claim.status, 'VERIFIED');
    assert.equal(claim.decision_driving, true);
    assert.equal(claim.authority_requirement, 'A_TO_C');
    assert.equal(claim.jurisdiction_or_scope, 'DIGIKALA_PLATFORM');
    assert.equal(claim.source_ids.length, 1);
    assert.equal(claim.locators.length, 1);
    assert.ok(claim.limitations.length > 50);
    assert.ok(indexed.has(id), `${id} missing from canonical retrieval`);

    const admission = evaluateKnowledgeClaim(claim, sources, {
      asOf: new Date('2026-09-25T00:00:00Z'),
    });
    assert.equal(admission.admissible, true, JSON.stringify(admission, null, 2));
  }
});

test('Digikala platform evidence is retrievable in platform scope and excluded from generic Iran retrieval', () => {
  const platformResults = retrieveCanonicalKnowledge(
    'جستجوی دست دوم خرید طلای دیجیتال ارزش دلاری سفارش',
    index.entries,
    claims,
    sources,
    {
      phase: 2,
      moduleIds: ['MOD-CHANNEL-ONLINE'],
      jurisdiction: 'DIGIKALA_PLATFORM',
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 20,
    }
  );
  const platformIds = new Set(platformResults.map(result => result.entry.claim_id));
  assert.ok(platformIds.has('KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH'));
  assert.ok(platformIds.has('KCL-IR-DIGIKALA-1404-DIGITAL-GOLD'));
  assert.ok(platformIds.has('KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE'));

  const iranResults = retrieveCanonicalKnowledge(
    'جستجوی دست دوم خرید طلای دیجیتال ارزش دلاری سفارش',
    index.entries,
    claims,
    sources,
    {
      phase: 2,
      moduleIds: ['MOD-CHANNEL-ONLINE'],
      jurisdiction: 'IRAN',
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 50,
    }
  );
  const iranIds = new Set(iranResults.map(result => result.entry.claim_id));
  assert.equal(iranIds.has('KCL-IR-DIGIKALA-1404-SECONDHAND-SEARCH'), false);
  assert.equal(iranIds.has('KCL-IR-DIGIKALA-1404-DIGITAL-GOLD'), false);
  assert.equal(iranIds.has('KCL-IR-DIGIKALA-1404-USD-ORDER-VALUE'), false);
});

test('Digikala 1404 admission contains only metrics reproduced on the first-party company announcement', () => {
  const sourceId = 'SRC-IR-DIGIKALA-REPORT-1404-OFFICIAL-POST';
  const admitted = Object.values(claims).filter(claim => claim.source_ids?.includes(sourceId));
  assert.equal(admitted.length, 3);
  assert.ok(admitted.some(claim => /۵۱٪/.test(claim.statement)));
  assert.ok(admitted.some(claim => /۱۲ برابر/.test(claim.statement)));
  assert.ok(admitted.some(claim => /ارزش دلاری/.test(claim.statement)));
  assert.ok(admitted.every(claim => claim.jurisdiction_or_scope === 'DIGIKALA_PLATFORM'));
});

test('Snapp 1404 first-party metrics are verified but strictly platform-scoped', () => {
  const sourceIds = [
    'SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY',
    'SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST',
  ];
  const claimIds = [
    'KCL-IR-SNAPP-1404-SUPERAPP-VISITS',
    'KCL-IR-SNAPP-1404-RIDE-HOURS',
    'KCL-IR-SNAPP-1404-URBAN-TRIPS',
  ];

  for (const id of sourceIds) {
    const source = sources[id];
    assert.ok(source, id);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'C');
    assert.equal(source.verified_at, '2026-09-25');
    assert.equal(source.jurisdiction_or_scope, 'SNAPP_PLATFORM');
    assert.match(source.checksum || '', /^git-blob:[0-9a-f]{40}$/);
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
  }

  const indexed = new Set(index.entries.map(entry => entry.claim_id));
  for (const id of claimIds) {
    const claim = claims[id];
    assert.ok(claim, id);
    assert.equal(claim.status, 'VERIFIED');
    assert.equal(claim.decision_driving, true);
    assert.equal(claim.authority_requirement, 'A_TO_C');
    assert.equal(claim.jurisdiction_or_scope, 'SNAPP_PLATFORM');
    assert.equal(claim.locators.length, claim.source_ids.length);
    assert.ok(claim.limitations.length > 50);
    assert.ok(indexed.has(id), `${id} missing from canonical retrieval`);

    const admission = evaluateKnowledgeClaim(claim, sources, {
      asOf: new Date('2026-09-25T00:00:00Z'),
    });
    assert.equal(admission.admissible, true, JSON.stringify(admission, null, 2));
  }
});

test('Snapp platform evidence is retrievable only in SNAPP_PLATFORM scope, not generic Iran scope', () => {
  const query = 'سوپراپ ۸.۲ میلیارد ۴۰۷ میلیون ساعت ۱.۵ میلیارد سفر شهری';

  const platformResults = retrieveCanonicalKnowledge(
    query,
    index.entries,
    claims,
    sources,
    {
      phase: 2,
      jurisdiction: 'SNAPP_PLATFORM',
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 20,
    }
  );
  const platformIds = new Set(platformResults.map(result => result.entry.claim_id));
  assert.ok(platformIds.has('KCL-IR-SNAPP-1404-SUPERAPP-VISITS'));
  assert.ok(platformIds.has('KCL-IR-SNAPP-1404-RIDE-HOURS'));
  assert.ok(platformIds.has('KCL-IR-SNAPP-1404-URBAN-TRIPS'));

  const iranResults = retrieveCanonicalKnowledge(
    query,
    index.entries,
    claims,
    sources,
    {
      phase: 2,
      jurisdiction: 'IRAN',
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 50,
    }
  );
  const iranIds = new Set(iranResults.map(result => result.entry.claim_id));
  assert.equal(iranIds.has('KCL-IR-SNAPP-1404-SUPERAPP-VISITS'), false);
  assert.equal(iranIds.has('KCL-IR-SNAPP-1404-RIDE-HOURS'), false);
  assert.equal(iranIds.has('KCL-IR-SNAPP-1404-URBAN-TRIPS'), false);
});

test('Snapp 1404 admission contains only first-party reproduced platform metrics', () => {
  const sourceIds = new Set([
    'SRC-IR-SNAPP-REPORT-1404-OFFICIAL-COMPANY',
    'SRC-IR-SNAPP-REPORT-1404-URBAN-TRIPS-POST',
  ]);
  const admitted = Object.values(claims).filter(claim =>
    (claim.source_ids || []).some(sourceId => sourceIds.has(sourceId))
  );

  assert.equal(admitted.length, 3);
  assert.ok(admitted.some(claim => /۸\.۲ میلیارد/.test(claim.statement)));
  assert.ok(admitted.some(claim => /۴۰۷ میلیون ساعت/.test(claim.statement)));
  assert.ok(admitted.some(claim => /۱\.۵ میلیارد سفر شهری/.test(claim.statement)));
  assert.ok(admitted.every(claim => claim.jurisdiction_or_scope === 'SNAPP_PLATFORM'));
});

