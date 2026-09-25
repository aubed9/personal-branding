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
  'SRC-IR-TAX-TERMINALS-EASE-1402-DISCOVERY',
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

test('1398 base, 1401 Article 15 change and 1404 amendment relationship are primary-verified', () => {
  const base1398 = sources['SRC-IR-TAX-TERMINALS-1398-QAVANIN'];
  const data1401 = sources['SRC-IR-NATIONAL-DATA-1401-TAX-ARTICLE15-QAVANIN'];
  const tax1404 = sources['SRC-IR-TAX-SPECULATION-1404-QAVANIN'];
  const claim = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];

  for (const source of [base1398, data1401, tax1404]) {
    assert.ok(source);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'A');
    assert.equal(source.verified_at, '2026-09-25');
    assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
    assert.ok(claim.source_ids.includes(source.id));
  }

  assert.match(base1398.edition_or_version, /12936955486234542481/);
  assert.match(data1401.edition_or_version, /4060880044189512334/);
  assert.match(data1401.edition_or_version, /Article 12/);
  assert.match(tax1404.edition_or_version, /80519/);
  assert.match(tax1404.edition_or_version, /23416/);

  const article15Snapshot = fs.readFileSync(path.join(root, data1401.repository_location), 'utf8');
  assert.match(article15Snapshot, /ماده15/);
  assert.match(article15Snapshot, /notes are deleted/);

  assert.equal(claim.source_ids.includes('SRC-IR-TAX-TERMINALS-1398-DISCOVERY'), false);
  assert.equal(claim.source_ids.includes('SRC-IR-TAX-SPECULATION-1404-DISCOVERY'), false);
  assert.equal(claim.locators.length, claim.source_ids.length);
  assert.equal(claim.status, 'NEEDS_RESEARCH');

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

test('primary-ready sources do not automatically upgrade an incomplete decision-driving legal claim', () => {
  for (const id of CLAIM_IDS) {
    const claim = claims[id];
    assert.equal(claim.locators.length, claim.source_ids.length);
    for (const sourceId of claim.source_ids) assert.ok(sources[sourceId], `missing source ${sourceId}`);
    assert.equal(claim.status, 'NEEDS_RESEARCH');
  }

  const taxClaim = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];
  const readiness = taxClaim.source_ids.map(sourceId => {
    const source = sources[sourceId];
    return Boolean(
      source.verified_at &&
      source.checksum &&
      source.repository_location &&
      source.status === 'VERIFIED' &&
      source.authority_tier === 'A'
    );
  });
  assert.ok(readiness.every(Boolean), 'known tax amendment-chain sources should all be primary-ready');

  const admission = evaluateKnowledgeClaim(taxClaim, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));
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


test('1402 taxpayer facilitation sources are primary-verified while the current tax-system claim remains blocked', () => {
  const discovery = sources['SRC-IR-TAX-TERMINALS-EASE-1402-DISCOVERY'];
  const base = sources['SRC-IR-TAX-TERMINALS-EASE-1402-QAVANIN'];
  const article1 = sources['SRC-IR-TAX-TERMINALS-EASE-M1-1402-QAVANIN'];
  const currentClaim = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];

  assert.ok(discovery);
  assert.equal(discovery.status, 'NEEDS_RESEARCH');
  assert.equal(discovery.authority_tier, 'C');
  assert.equal(currentClaim.source_ids.includes(discovery.id), false);

  for (const source of [base, article1]) {
    assert.ok(source);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'A');
    assert.equal(source.verified_at, '2026-09-25');
    assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
    assert.ok(currentClaim.source_ids.includes(source.id));
  }

  assert.match(base.edition_or_version, /22942/);
  assert.match(base.edition_or_version, /177609/);
  assert.match(article1.edition_or_version, /22980/);
  assert.match(article1.edition_or_version, /211331/);
  assert.equal(currentClaim.locators.length, currentClaim.source_ids.length);
  assert.equal(currentClaim.status, 'NEEDS_RESEARCH');
  assert.ok(currentClaim.source_ids.includes('SRC-IR-TAX-TERMINALS-1398-QAVANIN'));
  assert.ok(currentClaim.source_ids.includes('SRC-IR-NATIONAL-DATA-1401-TAX-ARTICLE15-QAVANIN'));
  assert.ok(currentClaim.source_ids.includes('SRC-IR-TAX-SPECULATION-1404-QAVANIN'));
  assert.equal(currentClaim.source_ids.includes('SRC-IR-TAX-TERMINALS-1398-DISCOVERY'), false);
  assert.equal(currentClaim.source_ids.includes('SRC-IR-TAX-SPECULATION-1404-DISCOVERY'), false);

  const admission = evaluateKnowledgeClaim(currentClaim, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admission.admissible, false);
  assert.ok(admission.reasons.includes('CLAIM_NOT_ADMISSIBLE'));

  const indexed = new Set(index.entries.map(entry => entry.claim_id));
  assert.equal(indexed.has(currentClaim.id), false);
});


test('verification gate blocks an accidental manual VERIFIED upgrade until legal coverage is complete', () => {
  const current = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];
  assert.equal(current.verification_gate.type, 'LEGAL_AMENDMENT_COVERAGE');
  assert.equal(current.verification_gate.status, 'INCOMPLETE');
  assert.ok(current.verification_gate.blocking_reasons.includes('ARTICLE_LEVEL_CURRENT_MAP_PENDING'));

  const prematurelyPromoted = JSON.parse(JSON.stringify(current));
  prematurelyPromoted.status = 'VERIFIED';

  const blocked = evaluateKnowledgeClaim(prematurelyPromoted, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(blocked.admissible, false);
  assert.equal(blocked.status, 'REQUIRES_VERIFICATION');
  assert.ok(blocked.reasons.includes('VERIFICATION_GATE_INCOMPLETE:LEGAL_AMENDMENT_COVERAGE'));
  assert.ok(blocked.reasons.includes('VERIFICATION_GATE_BLOCKER:ARTICLE_LEVEL_CURRENT_MAP_PENDING'));

  const completed = JSON.parse(JSON.stringify(prematurelyPromoted));
  completed.verification_gate.status = 'COMPLETE';
  completed.verification_gate.blocking_reasons = [];
  const admitted = evaluateKnowledgeClaim(completed, sources, {
    asOf: new Date('2026-09-25T00:00:00Z'),
    criticalUse: true,
  });
  assert.equal(admitted.admissible, true, JSON.stringify(admitted, null, 2));
});


test('selected current taxpayer obligations are verified and retrievable without promoting the umbrella claim', () => {
  const article2 = claims['KCL-IR-TAX-ARTICLE2-CURRENT-POS-INVOICING'];
  const article10 = claims['KCL-IR-TAX-ARTICLE10-CURRENT-COMMERCIAL-ACCOUNTS'];
  const umbrella = claims['KCL-IR-TAX-TERMINALS-1398-UNVERIFIED'];
  const source = sources['SRC-IR-TAX-TERMINALS-CURRENT-ARTICLES-QAVANIN'];

  assert.ok(source);
  assert.equal(source.status, 'VERIFIED');
  assert.equal(source.authority_tier, 'A');
  assert.equal(source.verified_at, '2026-09-25');
  assert.match(source.checksum, /^git-blob:[0-9a-f]{40}$/);
  assert.ok(fs.existsSync(path.join(root, source.repository_location)));

  for (const claim of [article2, article10]) {
    assert.ok(claim);
    assert.equal(claim.status, 'VERIFIED');
    assert.equal(claim.claim_kind, 'LEGAL_REQUIREMENT');
    assert.equal(claim.decision_driving, true);
    const admission = evaluateKnowledgeClaim(claim, sources, {
      asOf: new Date('2026-09-25T00:00:00Z'),
      criticalUse: true,
    });
    assert.equal(admission.admissible, true, JSON.stringify(admission, null, 2));
    assert.ok(index.entries.some(entry => entry.claim_id === claim.id));
  }

  const article2Results = retrieveCanonicalKnowledge(
    'خرده فروشی پایانه فروشگاهی صورتحساب سامانه مؤدیان',
    index.entries, claims, sources,
    {
      phase: 2,
      moduleIds: ['MOD-DOMAIN-TAX-SAAS', 'MOD-REG-HIGH'],
      jurisdiction: 'IRAN',
      criticalUse: true,
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 20,
    }
  );
  assert.ok(article2Results.some(result => result.entry.claim_id === article2.id));

  const article10Results = retrieveCanonicalKnowledge(
    'حساب تجاری کارتخوان درگاه پرداخت',
    index.entries, claims, sources,
    {
      phase: 2,
      moduleIds: ['MOD-DOMAIN-TAX-SAAS', 'MOD-REG-HIGH'],
      jurisdiction: 'IRAN',
      criticalUse: true,
      asOf: new Date('2026-09-25T00:00:00Z'),
      topK: 20,
    }
  );
  assert.ok(article10Results.some(result => result.entry.claim_id === article10.id));

  assert.equal(umbrella.status, 'NEEDS_RESEARCH');
  assert.equal(index.entries.some(entry => entry.claim_id === umbrella.id), false);
  assert.ok(umbrella.verification_gate.completed_requirements.includes('SELECTED_CURRENT_ARTICLE_CLAIMS_DECOMPOSED'));
  assert.equal(umbrella.verification_gate.status, 'INCOMPLETE');
});
