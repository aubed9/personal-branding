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

const DISCOVERY_SOURCE_IDS = [
  'SRC-IR-LAW-ECOM-1382-DISCOVERY',
  'SRC-IR-TAX-TERMINALS-1398-DISCOVERY',
  'SRC-IR-TAX-TERMINALS-EASE-1402-DISCOVERY',
  'SRC-IR-TAX-SPECULATION-1404-DISCOVERY',
  'SRC-IR-TRADE-UNION-1382-DISCOVERY',
  'SRC-IR-TRADE-UNION-AMENDMENT-1403-DISCOVERY',
  'SRC-IR-ENAMAD-RULES-FAMILY',
];

const ECOM_CLAIM = 'KCL-IR-LAW-ECOM-1382-UNVERIFIED';
const TAX_CLAIM = 'KCL-IR-TAX-TERMINALS-1398-UNVERIFIED';
const GUILD_CLAIM = 'KCL-IR-TRADE-UNION-LICENSING-UNVERIFIED';
const ENAMAD_CLAIM = 'KCL-IR-ENAMAD-CURRENT-RULES-UNVERIFIED';

test('discovery-only Iran legal sources remain explicit non-admissible research gaps', () => {
  for (const id of DISCOVERY_SOURCE_IDS) {
    const source = sources[id];
    assert.ok(source, `missing source ${id}`);
    assert.equal(source.status, 'NEEDS_RESEARCH');
    assert.equal(source.verified_at, null);
    assert.ok(['LEGAL', 'TAX', 'REGULATORY'].includes(source.freshness_class));
    assert.ok(source.limitations.length > 60);
  }
});

test('official e-commerce law identity is verified but article-level decision claim remains blocked', () => {
  const source = sources['SRC-IR-LAW-ECOM-1382-QAVANIN-LOCATOR'];
  const claim = claims[ECOM_CLAIM];

  assert.ok(source);
  assert.equal(source.authority_tier, 'A');
  assert.equal(source.status, 'VERIFIED');
  assert.equal(source.verified_at, '2026-09-26');
  assert.match(source.url, /qavanin\.ir\/Law\/Attribute\/\?IDS=15700719202226051269/);
  assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, source.repository_location)));
  assert.match(source.edition_or_version, /1403-03-30/);

  assert.ok(claim.source_ids.includes(source.id));
  assert.equal(claim.status, 'NEEDS_RESEARCH');
  assert.equal(claim.decision_driving, true);

  const admission = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-26T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
  assert.equal(index.entries.some(entry => entry.claim_id === claim.id), false);
});

test('current taxpayer-system claim is primary-verified and admitted only within its captured locator scope', () => {
  const current = sources['SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405'];
  const facilitation = sources['SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN'];
  const article1 = sources['SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN'];
  const claim = claims[TAX_CLAIM];

  for (const source of [current, facilitation, article1]) {
    assert.ok(source);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'A');
    assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
  }

  assert.equal(current.verified_at, '2026-09-26');
  assert.match(current.edition_or_version, /12936955486234542481/);
  assert.match(current.edition_or_version, /1404-04-08/);

  assert.equal(claim.status, 'VERIFIED');
  assert.deepEqual(claim.source_ids, [
    'SRC-IR-TAX-TERMINALS-CURRENT-QAVANIN-1405',
    'SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN',
    'SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN',
  ]);
  assert.equal(claim.locators.length, claim.source_ids.length);
  assert.ok(claim.locators[0].locator.includes('Articles 10, 12, 13 and 14'));

  const admission = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-26T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, true);
  assert.ok(['VERIFIED', 'CANONICAL'].includes(admission.status));
  assert.equal(index.entries.some(entry => entry.claim_id === claim.id), true);
});

test('1403 trade-union amendment is primary-verified with exact licensing/enforcement locator', () => {
  const source = sources['SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN'];
  const claim = claims[GUILD_CLAIM];

  assert.ok(source);
  assert.equal(source.status, 'VERIFIED');
  assert.equal(source.authority_tier, 'A');
  assert.equal(source.verified_at, '2026-09-26');
  assert.equal(source.effective_from, '1403-06-14');
  assert.match(source.edition_or_version, /11646297386230802736/);
  assert.match(source.edition_or_version, /23127/);
  assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, source.repository_location)));

  assert.equal(claim.status, 'VERIFIED');
  assert.deepEqual(claim.source_ids, [source.id]);
  assert.equal(claim.locators.length, 1);
  assert.match(claim.locators[0].locator, /Article 1/);
  assert.match(claim.locators[0].locator, /Article 12/);
  assert.match(claim.locators[0].locator, /Article 27/);

  const admission = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-26T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, true);
  assert.equal(index.entries.some(entry => entry.claim_id === claim.id), true);
});

test('Enamad current-rule claim remains REQUIRES_VERIFICATION', () => {
  const claim = claims[ENAMAD_CLAIM];
  assert.ok(claim);
  assert.equal(claim.status, 'NEEDS_RESEARCH');

  const result = evaluateKnowledgeClaim(claim, sources, {
    asOf: new Date('2026-09-26T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(result.admissible, false);
  assert.ok(result.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
  assert.equal(index.entries.some(entry => entry.claim_id === claim.id), false);
});

test('verified legal claims become stale after the 30-day critical-use window', () => {
  for (const id of [TAX_CLAIM, GUILD_CLAIM]) {
    const result = evaluateKnowledgeClaim(claims[id], sources, {
      asOf: new Date('2026-11-01T00:00:00Z'),
      criticalUse: true,
    });
    assert.equal(result.admissible, false, `${id} must not remain admissible after freshness expiry`);
    assert.ok(result.reasons.some(reason => /STALE|FRESH/i.test(reason)), JSON.stringify(result.reasons));
  }
});

test('regulated Iran retrieval can surface verified legal claims but not unresolved e-commerce/Enamad claims', () => {
  const results = retrieveCanonicalKnowledge(
    'مجوز پروانه کسب سامانه مؤدیان مالیات قانون کسب و کار ایران',
    index.entries,
    claims,
    sources,
    {
      phase: 1,
      moduleIds: ['MOD-REG-HIGH', 'MOD-DOMAIN-TAX-SAAS'],
      jurisdiction: 'IRAN',
      criticalUse: true,
      asOf: new Date('2026-09-26T00:00:00Z'),
      topK: 50,
    }
  );
  const ids = new Set(results.map(result => result.entry.claim_id));

  assert.ok(ids.has(TAX_CLAIM), 'verified taxpayer claim should be retrievable');
  assert.ok(ids.has(GUILD_CLAIM), 'verified guild licensing claim should be retrievable');
  assert.equal(ids.has(ECOM_CLAIM), false);
  assert.equal(ids.has(ENAMAD_CLAIM), false);
});

test('historical 1392 guild amendment remains background-only and cannot replace current 1403 source', () => {
  const historicalSource = sources['SRC-IR-TRADE-UNION-AMENDMENT-1392-GAZETTE'];
  const historicalClaim = claims['KCL-IR-TRADE-UNION-AMENDMENT-1392-HISTORICAL'];
  const currentClaim = claims[GUILD_CLAIM];

  assert.equal(historicalSource.status, 'VERIFIED');
  assert.equal(historicalClaim.status, 'VERIFIED');
  assert.equal(historicalClaim.decision_driving, false);
  assert.ok(index.entries.some(entry => entry.claim_id === historicalClaim.id));

  assert.equal(currentClaim.status, 'VERIFIED');
  assert.equal(currentClaim.source_ids.includes(historicalSource.id), false);
  assert.equal(currentClaim.source_ids.includes('SRC-IR-TRADE-UNION-AMENDMENT-1403-QAVANIN'), true);
});
