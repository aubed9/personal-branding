import test from 'node:test';
import assert from 'node:assert/strict';

import { validateReasoningGraph } from './src/reasoning/graph/index.js';
import { CANONICAL_CONTEXT_AXES } from './src/reasoning/context/businessContextContract.js';
import { validateCanonicalProjectState } from './src/state/v3/canonicalState.js';
import { migrateLegacyStateToV3 } from './src/state/v3/migration.js';
import {
  PRE_V3_BACKUP_KEY,
  V3_STATE_SCHEMA_VERSION,
  V3_STORAGE_KEY,
} from './src/state/v3/constants.js';
import {
  PersistenceManager,
  SCHEMA_VERSION,
  STORAGE_KEY,
} from './src/services/persistenceManager.js';

function makeLegacyState() {
  return {
    revision: 7,
    currentPhase: 3,
    currentStepIndex: 2,
    completedPhases: { 1: true, 2: true, 3: false },
    phaseStatus: { 3: 'INVALIDATED' },
    reviewRequired: { 3: ['p3_target_segment'] },
    phaseData: {
      1: { coreOffer: 'نرم‌افزار حسابداری ابری' },
      2: { customerPain: 'ثبت دستی اطلاعات زمان‌بر است' },
      3: {},
    },
    answerRecords: [
      {
        id: 'ANS-1',
        revision: 1,
        phase: 1,
        questionId: 'core_offer',
        field: 'coreOffer',
        text: 'نرم‌افزار حسابداری ابری',
        kind: 'FACT',
        status: 'ACTIVE',
        source: 'USER_TEXT',
      },
    ],
    facts: [
      { id: 'FACT-1', answerId: 'ANS-1', phase: 1, statement: 'پیشنهاد اصلی نرم‌افزار ابری است', kind: 'FACT' },
    ],
    assumptions: [
      { id: 'ASM-1', phase: 1, assumption: 'مدیر مالی حاضر به مهاجرت است', risk_level: 'MEDIUM' },
    ],
    decisions: [
      {
        id: 'DEC-1',
        phase: 3,
        statement: 'تمرکز روی شرکت‌های متوسط',
        evidenceIds: ['ANS-1', 'LEGACY-MISSING-EVIDENCE'],
      },
    ],
    unknowns: [
      { id: 'UNK-1', phase: 2, reason: 'نرخ تبدیل واقعی هنوز اندازه‌گیری نشده', status: 'OPEN' },
    ],
    contradictions: [
      {
        id: 'CTR-1',
        ruleId: 'sample_conflict',
        severity: 'MAJOR',
        resolutionStatus: 'UNRESOLVED',
        affectedPhases: [2, 3],
        statementA: 'بودجه محدود',
        statementB: 'کانال بسیار پرهزینه',
      },
    ],
    businessContext: {
      taxonomyId: 'BT-0290',
      industryId: 'IND-11',
      primaryArchetype: 'SAAS_SOFTWARE',
      activeOverlays: ['B2B', 'RECURRING_SUBSCRIPTION_METRICS'],
      axes: {
        customerModel: 'B2B',
        offerType: 'SOFTWARE',
        channelModel: 'ONLINE_FIRST',
        revenueModel: 'SUBSCRIPTION',
        maturity: 'ACTIVE',
        scale: 'SMALL',
        salesMotion: 'FIELD_SALES',
        geography: 'NATIONWIDE_IRAN',
        branchStructure: 'SINGLE_LOCATION',
        founderRole: 'FOUNDER_LED',
        purchaseCycle: 'LONG_MONTHS',
        relationshipModel: 'RELATIONAL_RETAINER',
        regulatoryProfile: 'REGULATED',
        operationalComplexity: 'MODERATE',
        brandArchitecture: 'STANDALONE',
      },
    },
    aiInsights: [{ id: 'AI-1', text: 'legacy insight' }],
    dynamicQuestion: { id: 'DQ-1', text: 'legacy dynamic question' },
    dynamicQuestionState: 'ACTIVE',
    dynamicQuestionsHistory: [{ id: 'DQ-0' }],
    customFutureField: { keepMe: true, nested: { value: 42 } },
  };
}

test('legacy v2 migration creates valid canonical state with exactly 15 context axes', () => {
  const legacy = makeLegacyState();
  const { state, report } = migrateLegacyStateToV3(legacy, {
    fromSchemaVersion: 2,
    migratedAt: '2026-09-22T17:00:00.000Z',
  });

  assert.equal(state.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(Object.keys(state.businessContext.axes).length, 15);
  assert.deepEqual(Object.keys(state.businessContext.axes), [...CANONICAL_CONTEXT_AXES]);
  assert.equal(state.businessContext.axes.offerType, 'DIGITAL_PRODUCT');
  assert.equal(state.businessContext.axes.revenueModel, 'RECURRING');
  assert.equal(state.businessContext.axes.salesMotion, 'FIELD_ENTERPRISE');
  assert.equal(state.businessContext.axes.geography, 'NATIONAL');
  assert.equal(state.businessContext.axes.relationshipModel, 'CONTRACTUAL_RETAINER');
  assert.equal(state.businessContext.axes.customerModel, 'B2B');

  assert.equal(validateCanonicalProjectState(state).valid, true);
  assert.equal(validateReasoningGraph(state.graph).valid, true);
  assert.deepEqual(report.droppedPaths, []);
  assert.equal(report.counts.placeholders, 1);
});

test('migration preserves unmapped legacy data and converts broken evidence references to explicit placeholders', () => {
  const { state, report } = migrateLegacyStateToV3(makeLegacyState(), {
    fromSchemaVersion: 2,
    migratedAt: '2026-09-22T17:00:00.000Z',
  });

  const legacyRecords = Object.values(state.ledgers.legacyRecords);
  assert.ok(legacyRecords.some(record => record.path === 'phaseData'));
  assert.ok(legacyRecords.some(record => record.path === 'businessContext'));
  assert.ok(legacyRecords.some(record => record.path === 'customFutureField' && record.value.keepMe === true));
  assert.ok(report.preservedLegacyPaths.includes('customFutureField'));

  const placeholder = Object.values(state.ledgers.evidence).find(item => item.sourceKind === 'MIGRATION_PLACEHOLDER');
  assert.ok(placeholder);
  assert.equal(placeholder.legacyId, 'LEGACY-MISSING-EVIDENCE');

  const decision = Object.values(state.ledgers.decisions)[0];
  assert.equal(decision.supportingEvidenceIds.length, 2);
  assert.ok(decision.supportingEvidenceIds.includes(placeholder.id));
  assert.ok(Object.values(state.ledgers.unknowns).some(item => item.kind === 'MIGRATION_REFERENCE_GAP'));
});

test('migration is deterministic for identical input and fixed migration metadata', () => {
  const options = { fromSchemaVersion: 2, migratedAt: '2026-09-22T17:00:00.000Z' };
  const first = migrateLegacyStateToV3(makeLegacyState(), options);
  const second = migrateLegacyStateToV3(makeLegacyState(), options);

  assert.deepEqual(first.state, second.state);
  assert.deepEqual(first.report, second.report);
});

test('explicit UNKNOWN values preserve incomplete legacy context without inventing defaults', () => {
  const legacy = makeLegacyState();
  delete legacy.businessContext.axes.branchStructure;
  legacy.businessContext.axes.regulatoryProfile = 'SOMETHING_UNSUPPORTED';

  const { state, report } = migrateLegacyStateToV3(legacy, {
    fromSchemaVersion: 2,
    migratedAt: '2026-09-22T17:00:00.000Z',
  });

  assert.equal(state.businessContext.axes.branchStructure, 'UNKNOWN');
  assert.equal(state.businessContext.axes.regulatoryProfile, 'UNKNOWN');
  assert.ok(report.warnings.some(w => w.code === 'UNMAPPED_AXIS_VALUE' && w.axis === 'regulatoryProfile'));
  assert.equal(validateCanonicalProjectState(state).valid, true);
});

test('PersistenceManager v3 migration snapshots legacy storage and never overwrites the legacy key', () => {
  const store = {};
  global.window = {
    localStorage: {
      getItem: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: key => { delete store[key]; },
    },
  };
  global.localStorage = global.window.localStorage;

  const legacyEnvelope = {
    schemaVersion: SCHEMA_VERSION,
    savedAt: '2026-09-22T16:00:00.000Z',
    state: makeLegacyState(),
  };
  const rawLegacy = JSON.stringify(legacyEnvelope);
  store[STORAGE_KEY] = rawLegacy;

  const pm = new PersistenceManager();
  const result = pm.migrateStoredProjectToV3({ migratedAt: '2026-09-22T17:00:00.000Z' });

  assert.equal(result.success, true);
  assert.equal(store[STORAGE_KEY], rawLegacy, 'legacy key must remain byte-for-byte unchanged');
  assert.equal(store[PRE_V3_BACKUP_KEY], rawLegacy, 'pre-v3 backup must contain original envelope');
  assert.ok(store[V3_STORAGE_KEY], 'canonical v3 envelope must be written separately');

  const loaded = pm.loadV3ProjectState();
  assert.ok(loaded);
  assert.equal(loaded.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(validateCanonicalProjectState(loaded.state).valid, true);

  const legacyBeforeCanonicalSave = store[STORAGE_KEY];
  loaded.state.revision += 1;
  assert.equal(pm.saveCanonicalProjectState(loaded.state, { savedAt: '2026-09-22T18:00:00.000Z' }), true);
  assert.equal(store[STORAGE_KEY], legacyBeforeCanonicalSave, 'canonical save must not dual-write the legacy key');
  assert.equal(pm.hasV3ProjectState(), true);
  assert.equal(pm.getPreV3Backup(), rawLegacy);
});
