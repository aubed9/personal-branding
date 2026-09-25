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

const SOURCE_IDS = [
  'SRC-IR-LAW-ECOM-1382-DISCOVERY',
  'SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR',
  'SRC-IR-TAX-TERMINALS-1398-DISCOVERY',
  'SRC-IR-TAX-SPECULATION-1404-DISCOVERY',
  'SRC-IR-TRADE-UNION-1382-DISCOVERY',
  'SRC-IR-TRADE-UNION-AMENDMENT-1403-DISCOVERY',
  'SRC-IR-ENAMAD-RULES-FAMILY',
];

const CLAIM_IDS = [
  'KCL-IR-LAW-ECOM-1382-UNVERIFIED',
  'KCL-IR-TAX-TERMINALS-1398-UNVERIFIED',
  'KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED',
  'KCL-IR-ENAMAD-CURRENT-RULES-UNVERIFIED',
];

test('Iran legal discovery records are explicit non-admissible research gaps', () => {
  for (const id of SOURCE_IDS) {
    const source = sources[id];
    assert.ok(source, `missing source ${id}`);
    assert.equal(source.status, 'NEEDS_RESEARCH');
    assert.equal(source.verified_at, null);
    assert.ok(['LEGAL', 'TAX', 'REGULATORY'].includes(source.freshness_class));
    assert.ok(source.limitations.length > 80);
  }

  assert.equal(sources['SRC-IR-LAW-ECOM-1382-DISCOVERY'].edition_or_version.includes('17167'), true);
  assert.equal(sources['SRC-IR-TAX-TERMINALS-1398-DISCOVERY'].edition_or_version.includes('21741'), true);
  assert.equal(sources['SRC-IR-TRADE-UNION-1382-DISCOVERY'].edition_or_version.includes('17221'), true);
  const amendment1403 = sources['SRC-IR-TRADE-UNION-AMENDMENT-1403-DISCOVERY'];
  assert.equal(amendment1403.edition_or_version.includes('271/27838'), true);
  assert.equal(amendment1403.edition_or_version.includes('80114'), true);
  assert.equal(amendment1403.status, 'NEEDS_RESEARCH');
  assert.equal(amendment1403.verified_at, null);
  assert.equal(amendment1403.repository_location, null);
  assert.equal(amendment1403.checksum, null);
});

test('official qavanin e-commerce locator is Tier A identity but remains non-admissible without complete primary capture', () => {
  const source = sources['SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR'];
  const claim = claims['KCL-IR-LAW-ECOM-1382-UNVERIFIED'];

  assert.ok(source);
  assert.equal(source.authority_tier, 'A');
  assert.equal(source.status, 'NEEDS_RESEARCH');
  assert.equal(source.verified_at, null);
  assert.match(source.url, /qavanin\.ir\/Law\/TreeText\/\?IDS=15700719202226051269/);
  assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, source.repository_location)));

  assert.ok(claim.source_ids.includes(source.id));
  assert.equal(claim.locators.length, claim.source_ids.length);

  const admission = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
});

test('unverified legal claims are excluded from canonical retrieval index', () => {
  const indexed = new Set(index.entries.map(entry => entry.claim_id));
  for (const id of CLAIM_IDS) {
    assert.ok(claims[id], `missing claim ${id}`);
    assert.equal(claims[id].status, 'NEEDS_RESEARCH');
    assert.equal(claims[id].claim_kind, 'LEGAL_REQUIREMENT');
    assert.equal(claims[id].decision_driving, true);
    assert.equal(claims[id].authority_requirement, 'A');
    assert.equal(indexed.has(id), false, `${id} must not enter generated retrieval before primary verification`);
  }
});

test('1404 tax amendment discovery keeps the 1398 taxpayer-system claim blocked until the primary chain is complete', () => {
  const amendment = sources['SRC-IR-TAX-SPECULATION-1404-DISCOVERY'];
  const claim = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];

  assert.ok(amendment);
  assert.equal(amendment.status, 'NEEDS_RESEARCH');
  assert.equal(amendment.authority_tier, 'C');
  assert.equal(amendment.verified_at, null);
  assert.equal(amendment.repository_location, null);
  assert.equal(amendment.checksum, null);
  assert.ok(amendment.edition_or_version.includes('80519'));

  assert.ok(claim.source_ids.includes(amendment.id));
  assert.equal(claim.locators.length, claim.source_ids.length);

  const indexed = new Set(index.entries.map(entry => entry.claim_id));
  assert.equal(indexed.has(claim.id), false);

  const admission = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
});

test('critical-use legal evaluation remains REQUIRES_VERIFICATION', () => {
  for (const id of CLAIM_IDS) {
    const result = evaluateKnowledgeClaim(claims[id], sources, {
      asOf: new Date('2026-09-25T00:00:00Z'),
      criticalUse: true,
    });
    assert.equal(result.admissible, false);
    assert.notEqual(result.status, 'VERIFIED');
    assert.notEqual(result.status, 'CANONICAL');
    assert.ok(result.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
  }
});

test('regulated Iran retrieval cannot surface unverified legal discovery claims', () => {
  const results = retrieveCanonicalKnowledge(
    'مجوز قانون مالیات اینماد الزامات کسب و کار ایران',
    index.entries,
    claims,
    sources,
    {
      phase: 1,
      moduleIds: ['MOD-REG-HIGH', 'MOD-DOMAIN-TAX-SAAS'],
      jurisdiction: 'IRAN',
      criticalUse: true,
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 50,
    }
  );
  const ids = new Set(results.map(result => result.entry.claim_id));
  for (const id of CLAIM_IDS) assert.equal(ids.has(id), false);
});

test('legal promotion requires exact primary-source fields before status can be changed safely', () => {
  for (const id of CLAIM_IDS) {
    const claim = claims[id];
    assert.equal(claim.locators.length, claim.source_ids.length);
    for (const sourceId of claim.source_ids) {
      const source = sources[sourceId];
      assert.ok(source);
      // A record is intentionally incomplete until these are present.
      const primaryReady = Boolean(
        source.verified_at &&
        source.checksum &&
        source.repository_location &&
        source.status === 'VERIFIED' &&
        source.authority_tier === 'A'
      );
      assert.equal(primaryReady, false, `${sourceId} was accidentally made primary-ready`);
    }
  }
});


test('1392 official-gazette amendment is verified historical evidence but does not unlock current licensing claims', () => {
  const historicalSource = sources['SRC-IR-TRADE-UNION-AMENDMENT-1392-GAZETTE'];
  const historicalClaim = claims['KCL-IR-TRADE-UNION-AMENDMENT-1392-HISTORICAL'];
  const currentClaim = claims['KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED'];

  assert.ok(historicalSource);
  assert.equal(historicalSource.status, 'VERIFIED');
  assert.equal(historicalSource.authority_tier, 'A');
  assert.equal(historicalSource.verified_at, '2026-09-25');
  assert.match(historicalSource.checksum, /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, historicalSource.repository_location)));

  assert.ok(historicalClaim);
  assert.equal(historicalClaim.status, 'VERIFIED');
  assert.equal(historicalClaim.decision_driving, false);
  assert.ok(index.entries.some(entry => entry.claim_id === historicalClaim.id));

  assert.equal(currentClaim.status, 'NEEDS_RESEARCH');
  assert.ok(currentClaim.source_ids.includes('SRC-IR-TRADE-UNION-AMENDMENT-1403-DISCOVERY'));
  assert.equal(currentClaim.locators.length, currentClaim.source_ids.length);
  const amendment1403 = sources['SRC-IR-TRADE-UNION-AMENDMENT-1403-DISCOVERY'];
  assert.equal(amendment1403.status, 'NEEDS_RESEARCH');
  assert.equal(amendment1403.authority_tier, 'C');
  assert.equal(amendment1403.repository_location, null);
  assert.equal(amendment1403.checksum, null);
  const currentAdmission = evaluateKnowledgeClaim(currentClaim, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(currentAdmission.admissible, false);
  assert.ok(currentAdmission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
});
