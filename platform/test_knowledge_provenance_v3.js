import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateKnowledgeClaim, evaluateSourceFreshness, retrieveCanonicalKnowledge } from './src/knowledge/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));

function registryNodeIds() {
  return new Set([...read('wiki/registry.yaml').matchAll(/^  (KB-[A-Z0-9-]+):\s*$/gm)].map(m => m[1]));
}

function registryDependencyEdges() {
  const lines = read('wiki/registry.yaml').split(/\r?\n/);
  const edges = [];
  let current = null;
  let inDependencies = false;
  for (const line of lines) {
    const node = line.match(/^  (KB-[A-Z0-9-]+):\s*$/);
    if (node) {
      current = node[1];
      inDependencies = false;
      continue;
    }
    if (current && /^    dependencies:\s*\[\]\s*$/.test(line)) {
      inDependencies = false;
      continue;
    }
    if (current && /^    dependencies:\s*$/.test(line)) {
      inDependencies = true;
      continue;
    }
    if (inDependencies) {
      const dep = line.match(/^    -\s+(KB-[A-Z0-9-]+)/);
      if (dep) edges.push([current, dep[1]]);
      else if (!/^    -/.test(line)) inDependencies = false;
    }
  }
  return edges;
}

function expectedRetrievalEntries(sources, claims) {
  const admissible = new Set(['VERIFIED', 'CANONICAL']);
  const authorityRank = { A: 1, B: 2, C: 3, D: 4 };
  return Object.values(claims)
    .filter(claim => admissible.has(claim.status))
    .filter(claim => claim.source_ids.length > 0)
    .filter(claim => claim.source_ids.every(id => sources[id] && admissible.has(sources[id].status)))
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(claim => {
      const sourceRecords = claim.source_ids.map(id => sources[id]);
      const authorityFloor = sourceRecords
        .map(record => record.authority_tier)
        .sort((a, b) => authorityRank[b] - authorityRank[a])[0] || 'D';
      return {
        retrieval_id: `RET-${claim.id}`,
        knowledge_node_id: claim.knowledge_node_id,
        claim_id: claim.id,
        content: claim.statement,
        claim_kind: claim.claim_kind,
        decision_driving: claim.decision_driving,
        status: claim.status,
        source_ids: claim.source_ids,
        source_authority_floor: authorityFloor,
        freshness_class: claim.freshness_class,
        max_age_days: claim.max_age_days,
        jurisdiction_or_scope: claim.jurisdiction_or_scope,
        phases: claim.phases,
        decision_node_ids: claim.decision_node_ids,
        module_ids: claim.module_ids,
        limitations: claim.limitations,
      };
    })
    .sort((a, b) => a.retrieval_id.localeCompare(b.retrieval_id));
}

test('Source Registry is independent from Knowledge Node count and uses the approved lifecycle', () => {
  const sourceRegistry = json('wiki/source-registry.json');
  const sources = sourceRegistry.sources;
  const nodes = registryNodeIds();

  assert.ok(Object.keys(sources).length > 0);
  assert.notEqual(Object.keys(sources).length, nodes.size, 'source count must not be derived from Knowledge Node count');

  const lifecycle = new Set(['DRAFT', 'NEEDS_RESEARCH', 'VERIFIED', 'CANONICAL', 'STALE', 'DEPRECATED']);
  for (const [id, source] of Object.entries(sources)) {
    assert.equal(source.id, id);
    assert.match(id, /^SRC-[A-Z0-9-]+$/);
    assert.ok(['A', 'B', 'C', 'D'].includes(source.authority_tier));
    assert.ok(lifecycle.has(source.status), `${id}: invalid lifecycle ${source.status}`);
    assert.ok(source.freshness_class);
    assert.ok(source.title);
  }
});

test('decision-driving Knowledge Claims have 100% source traceability and canonical provenance', () => {
  const sources = json('wiki/source-registry.json').sources;
  const claims = json('wiki/claims.json').claims;
  const nodes = registryNodeIds();
  const admissible = new Set(['VERIFIED', 'CANONICAL']);

  const decisionClaims = Object.values(claims).filter(claim => claim.decision_driving);
  assert.ok(decisionClaims.length > 0);

  for (const claim of decisionClaims) {
    assert.ok(nodes.has(claim.knowledge_node_id), `${claim.id}: broken knowledge node ${claim.knowledge_node_id}`);
    assert.ok(claim.source_ids.length > 0, `${claim.id}: missing source_ids`);
    const located = new Set(claim.locators.filter(x => x.locator).map(x => x.source_id));
    for (const sourceId of claim.source_ids) {
      assert.ok(sources[sourceId], `${claim.id}: broken source ${sourceId}`);
      assert.ok(located.has(sourceId), `${claim.id}: missing locator for ${sourceId}`);
    }

    if (claim.status === 'CANONICAL') {
      assert.ok(claim.source_ids.every(id => admissible.has(sources[id].status)), `${claim.id}: canonical claim depends on inadmissible source`);
    }
  }
});

test('all Knowledge Node dependency edges and Decision Module KB references resolve', () => {
  const nodes = registryNodeIds();
  const brokenRegistryEdges = registryDependencyEdges().filter(([, to]) => !nodes.has(to));
  assert.deepEqual(brokenRegistryEdges, []);

  const moduleText = read('platform/src/reasoning/modules/registry.js');
  const moduleRefs = new Set([...moduleText.matchAll(/'(KB-[A-Z0-9-]+)'/g)].map(m => m[1]));
  const missingModuleRefs = [...moduleRefs].filter(id => !nodes.has(id)).sort();
  assert.deepEqual(missingModuleRefs, []);
});

test('generated retrieval is deterministic and every entry carries canonical claim/source origin', () => {
  const sources = json('wiki/source-registry.json').sources;
  const claims = json('wiki/claims.json').claims;
  const generated = json('wiki/generated/retrieval-index.json');
  const expected = expectedRetrievalEntries(sources, claims);

  assert.equal(generated.count, generated.entries.length);
  assert.deepEqual(generated.entries, expected);

  for (const entry of generated.entries) {
    const claim = claims[entry.claim_id];
    assert.ok(claim);
    assert.equal(entry.knowledge_node_id, claim.knowledge_node_id);
    assert.deepEqual(entry.source_ids, claim.source_ids);
    assert.ok(entry.source_ids.length > 0);
    assert.ok(['VERIFIED', 'CANONICAL'].includes(entry.status));
  }
});

test('legacy runtime cannot use manually-authored rag_chunks.json as a knowledge plane', () => {
  const ragEngine = read('knowledge_base/rag_engine.py');
  const wikiEngine = read('knowledge_base/wiki_engine.py');

  assert.equal(/KB_FILE\s*=.*rag_chunks\.json/.test(ragEngine), false);
  assert.equal(/open\([^\n]*rag_chunks\.json/.test(ragEngine), false);
  assert.ok(ragEngine.includes('wiki'));
  assert.ok(ragEngine.includes('retrieval-index.json'));
  assert.ok(wikiEngine.includes('ROOT_DIR'));
  assert.ok(wikiEngine.includes('wiki'));
});

test('source-count claims are registry-derived, not hard-coded 165-source marketing claims', () => {
  const project = read('PROJECT.md');
  const skill = read('skills/llm-wiki/SKILL.md');
  const validator = read('scripts/validate_system.py');

  assert.equal(/165[- ]Source|165[- ]source|165 master/.test(project), false);
  assert.equal(/165[- ]Source|165[- ]source|165 master/.test(skill), false);
  assert.equal(validator.includes('claimed_source_count = 165'), false);
  assert.ok(validator.includes('source-registry.json'));
});

test('legacy article lifecycle is safely downgraded unless registry explicitly promotes it', () => {
  const registry = read('wiki/registry.yaml');
  assert.ok(registry.includes('default_status: NEEDS_RESEARCH'));
  assert.ok(registry.includes('article_frontmatter_status_authoritative: false'));

  const legacyArticle = read('wiki/03-strategy/positioning.md');
  assert.ok(legacyArticle.includes('status: "CANONICAL"'), 'fixture documents the legacy frontmatter mismatch');
  // The registry contract explicitly prevents this stale frontmatter from granting decision admissibility.
  assert.ok(registry.includes('default_status: NEEDS_RESEARCH'));
});


test('freshness contract blocks stale critical sources while academic age only triggers review', () => {
  const legal = {
    status: 'CANONICAL',
    freshness_class: 'LEGAL',
    max_age_days: 30,
    verified_at: '2026-07-01',
    effective_until: null,
    authority_tier: 'A',
  };
  const academic = {
    status: 'CANONICAL',
    freshness_class: 'ACADEMIC',
    max_age_days: 1095,
    verified_at: '2020-01-01',
    effective_until: null,
    authority_tier: 'B',
  };
  const asOf = new Date('2026-09-22T00:00:00Z');

  const legalFreshness = evaluateSourceFreshness(legal, { asOf });
  assert.equal(legalFreshness.admissible, false);
  assert.equal(legalFreshness.state, 'STALE');

  const academicFreshness = evaluateSourceFreshness(academic, { asOf });
  assert.equal(academicFreshness.admissible, true);
  assert.equal(academicFreshness.state, 'REVIEW_DUE');
});

test('critical claims require fresh Tier A evidence and retrieval filters before ranking', () => {
  const sources = {
    'SRC-A': {
      status: 'CANONICAL', freshness_class: 'LEGAL', max_age_days: 30,
      verified_at: '2026-09-20', effective_until: null, authority_tier: 'A',
    },
    'SRC-C': {
      status: 'CANONICAL', freshness_class: 'INDUSTRY_REPORT', max_age_days: 365,
      verified_at: '2026-09-20', effective_until: null, authority_tier: 'C',
    },
  };
  const legalClaim = {
    id: 'KCL-LEGAL', status: 'CANONICAL', claim_kind: 'LEGAL_REQUIREMENT',
    authority_requirement: 'A', source_ids: ['SRC-A'],
  };
  assert.equal(evaluateKnowledgeClaim(legalClaim, sources, {
    asOf: new Date('2026-09-22'), criticalUse: true,
  }).admissible, true);

  const weakClaim = { ...legalClaim, id: 'KCL-WEAK', source_ids: ['SRC-C'] };
  assert.equal(evaluateKnowledgeClaim(weakClaim, sources, {
    asOf: new Date('2026-09-22'), criticalUse: true,
  }).admissible, false);

  const claims = {
    'KCL-LEGAL': legalClaim,
    'KCL-WEAK': weakClaim,
  };
  const entries = [
    {
      retrieval_id: 'RET-KCL-LEGAL', claim_id: 'KCL-LEGAL', knowledge_node_id: 'KB-COMPLIANCE',
      content: 'مجوز و انطباق', module_ids: ['MOD-REG-HIGH'], decision_node_ids: ['DN-REG-CONSTRAINTS'],
      phases: [1], jurisdiction_or_scope: 'IRAN',
    },
    {
      retrieval_id: 'RET-KCL-WEAK', claim_id: 'KCL-WEAK', knowledge_node_id: 'KB-COMPLIANCE',
      content: 'مجوز و انطباق ضعیف', module_ids: ['MOD-REG-HIGH'], decision_node_ids: ['DN-REG-CONSTRAINTS'],
      phases: [1], jurisdiction_or_scope: 'IRAN',
    },
  ];
  const results = retrieveCanonicalKnowledge('مجوز', entries, claims, sources, {
    phase: 1, moduleIds: ['MOD-REG-HIGH'], jurisdiction: 'IRAN',
    criticalUse: true, asOf: new Date('2026-09-22'), topK: 10,
  });
  assert.deepEqual(results.map(result => result.entry.claim_id), ['KCL-LEGAL']);
});


test('legacy RAG migration inventory accounts for every chunk with zero silent loss', () => {
  const legacyChunks = json('knowledge_base/rag_chunks.json');
  const inventory = json('wiki/migration/legacy-rag-inventory.json');
  const parity = json('wiki/migration/retrieval-parity-report.json');
  const generated = json('wiki/generated/retrieval-index.json');

  assert.equal(inventory.legacy_chunk_count, legacyChunks.length);
  assert.equal(inventory.entries.length, legacyChunks.length);

  const expectedIds = legacyChunks.map((chunk, index) =>
    chunk.id || `LEGACY-RAG-${String(index + 1).padStart(3, '0')}`
  );
  assert.deepEqual(inventory.entries.map(entry => entry.legacy_id), expectedIds);
  assert.ok(inventory.entries.every(entry =>
    entry.status === 'NEEDS_RESEARCH' &&
    Array.isArray(entry.canonical_claim_ids) &&
    typeof entry.migration_reason === 'string' &&
    entry.migration_reason.length > 0
  ));

  assert.equal(parity.legacy_rag_chunks, legacyChunks.length);
  assert.equal(parity.legacy_chunks_accounted_for, legacyChunks.length);
  assert.equal(parity.silently_dropped_legacy_chunks, 0);
  assert.equal(
    parity.directly_mapped_legacy_chunks + parity.needs_research_legacy_chunks,
    legacyChunks.length
  );
  assert.equal(parity.canonical_retrieval_entries, generated.count);

  const legacyIds = new Set(expectedIds);
  assert.equal(
    generated.entries.some(entry => legacyIds.has(entry.claim_id) || legacyIds.has(entry.retrieval_id)),
    false,
    'unsourced legacy chunks must not enter canonical retrieval by identity'
  );
});

test('legacy Wiki migration inventory accounts for every legacy authored markdown file', () => {
  const inventory = json('wiki/migration/legacy-wiki-inventory.json');
  const legacyDir = path.join(root, 'knowledge_base', 'wiki');
  const actual = fs.readdirSync(legacyDir)
    .filter(name => name.endsWith('.md'))
    .map(name => `knowledge_base/wiki/${name}`)
    .sort();

  assert.equal(inventory.legacy_wiki_file_count, actual.length);
  assert.deepEqual(inventory.files.map(item => item.path).sort(), actual);
  assert.ok(inventory.files.every(item => item.status === 'MIGRATION_INPUT'));
  assert.ok(inventory.files.every(item => typeof item.blob_sha === 'string' && item.blob_sha.length >= 40));
});


test('verified foundational publisher editions remain bibliographic evidence until claim-level locators exist', () => {
  for (const id of ['SRC-FOUNDATION-03', 'SRC-FOUNDATION-15']) {
    const source = sources[id];
    assert.ok(source, id);
    assert.equal(source.status, 'VERIFIED');
    assert.equal(source.authority_tier, 'B');
    assert.equal(source.source_type, 'OFFICIAL_PUBLISHER_EDITION');
    assert.equal(source.verified_at, '2026-09-26');
    assert.match(source.checksum || '', /^git-blob:[0-9a-f]{40}$/);
    assert.ok(source.repository_location?.startsWith('wiki/snapshots/foundations/'));
    assert.ok(fs.existsSync(path.join(root, source.repository_location)));
    assert.match(source.limitations, /decision-driving propositions.*require.*locator/i);
  }

  assert.match(sources['SRC-FOUNDATION-03'].edition_or_version, /5th Edition.*9780743222099/i);
  assert.match(sources['SRC-FOUNDATION-15'].edition_or_version, /5th Edition.*9780135641316/i);

  const indexedSourceIds = new Set(index.entries.flatMap(entry => entry.source_ids || []));
  assert.equal(indexedSourceIds.has('SRC-FOUNDATION-03'), false);
  assert.equal(indexedSourceIds.has('SRC-FOUNDATION-15'), false);
});
