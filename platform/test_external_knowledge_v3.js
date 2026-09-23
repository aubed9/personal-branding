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
