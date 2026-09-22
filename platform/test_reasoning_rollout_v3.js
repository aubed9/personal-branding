import test from 'node:test';
import assert from 'node:assert/strict';

import { OrchestratorEngine } from './src/services/orchestratorEngine.js';
import {
  PersistenceManager,
  STORAGE_KEY,
  V3_STORAGE_KEY,
  PRE_V3_BACKUP_KEY,
} from './src/services/persistenceManager.js';
import {
  ReasoningRolloutManager,
  ROLLOUT_MODE,
  ROLLOUT_STORAGE_KEY,
} from './src/services/reasoningRolloutManager.js';
import {
  V3_REASONING_ENGINE_VERSION,
  V3_STATE_SCHEMA_VERSION,
} from './src/state/v3/constants.js';

function memoryStorage() {
  const store = {};
  return {
    store,
    api: {
      getItem: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: key => { delete store[key]; },
      clear: () => { for (const key of Object.keys(store)) delete store[key]; },
    },
  };
}

function installStorage() {
  const mem = memoryStorage();
  global.localStorage = mem.api;
  global.window = { localStorage: mem.api };
  return mem;
}

function seedEngine() {
  const engine = new OrchestratorEngine();
  engine.revision = 7;
  engine.currentPhase = 2;
  engine.currentStepIndex = 1;
  engine.phaseData[1] = {
    description: 'شرکت خدمات نرم‌افزاری B2B',
    coreOffer: 'سامانه مدیریت مالی',
    primaryGoal: 'رشد فروش سازمانی',
  };
  engine.phaseData[2] = {
    customerPain: 'فرایند فعلی کند و خطاپذیر است',
    primaryChannel: 'فروش مستقیم',
  };
  engine.answerRecords = [
    {
      id: 'ANS-R-1',
      revision: 1,
      phase: 1,
      questionId: 'step0_description',
      field: 'description',
      label: 'شرح کسب‌وکار',
      text: 'شرکت خدمات نرم‌افزاری B2B',
      kind: 'FACT',
      status: 'ACTIVE',
      source: 'USER_TEXT',
    },
    {
      id: 'ANS-R-2',
      revision: 2,
      phase: 2,
      questionId: 'p2_step1_customer_pain',
      field: 'customerPain',
      label: 'درد مشتری',
      text: 'فرایند فعلی کند و خطاپذیر است',
      kind: 'FACT',
      status: 'ACTIVE',
      source: 'USER_TEXT',
    },
  ];
  engine.businessContext = {
    schemaVersion: '3.0.0',
    taxonomyId: 'BT-TEST',
    industryId: 'IND-TEST',
    primaryArchetype: 'SAAS_SOFTWARE',
    activeOverlays: ['B2B'],
    confidence: 'USER_CONFIRMED',
    axes: {
      customerModel: 'B2B',
      offerType: 'DIGITAL_PRODUCT',
      channelModel: 'ONLINE_FIRST',
      revenueModel: 'RECURRING',
      maturity: 'ACTIVE',
      scale: 'SMALL',
      salesMotion: 'FIELD_ENTERPRISE',
      geography: 'NATIONAL',
      branchStructure: 'SINGLE_LOCATION',
      founderRole: 'SUPPORTING',
      purchaseCycle: 'LONG_MONTHS',
      relationshipModel: 'CONTRACTUAL_RETAINER',
      regulatoryProfile: 'NORMAL',
      operationalComplexity: 'MODERATE',
      brandArchitecture: 'STANDALONE',
    },
  };
  engine._syncReasoningGraphV3();
  return engine;
}

function fixedManager(policy = {}) {
  return new ReasoningRolloutManager({
    ...policy,
    clock: () => '2026-09-23T01:00:00.000Z',
  });
}

test('feature policy can stop rollout and keep projects on LEGACY', () => {
  let mem = installStorage();
  let pm = new PersistenceManager();
  let manager = fixedManager({ newProjectsUseV3: false });
  let engine = seedEngine();

  const newInit = manager.initializeEngine(engine, pm);
  assert.equal(newInit.mode, ROLLOUT_MODE.LEGACY);
  let rolloutRecord = JSON.parse(mem.api.getItem(ROLLOUT_STORAGE_KEY));
  assert.equal(rolloutRecord.stateSchemaVersion, 2);
  assert.equal(rolloutRecord.shadowStateSchemaVersion, null);
  assert.equal(rolloutRecord.persistenceAuthority, 'LEGACY_V2');
  const newSave = manager.saveEngine(engine, pm);
  assert.equal(newSave.success, true);
  assert.ok(mem.api.getItem(STORAGE_KEY));
  assert.equal(mem.api.getItem(V3_STORAGE_KEY), null);

  mem = installStorage();
  pm = new PersistenceManager();
  engine = seedEngine();
  pm.saveProjectState(engine);
  manager = fixedManager({ existingProjectsUseShadow: false });

  const existingInit = manager.initializeEngine(new OrchestratorEngine(), pm);
  assert.equal(existingInit.mode, ROLLOUT_MODE.LEGACY);
  rolloutRecord = JSON.parse(mem.api.getItem(ROLLOUT_STORAGE_KEY));
  assert.equal(rolloutRecord.stateSchemaVersion, 2);
  assert.equal(rolloutRecord.persistenceAuthority, 'LEGACY_V2');
  assert.equal(mem.api.getItem(V3_STORAGE_KEY), null);
  assert.equal(mem.api.getItem(PRE_V3_BACKUP_KEY), null);
});

test('brand-new projects start in V3 and canonical save never creates a legacy project', () => {
  const mem = installStorage();
  const pm = new PersistenceManager();
  const manager = fixedManager();
  const engine = seedEngine();

  const init = manager.initializeEngine(engine, pm);
  assert.equal(init.success, true);
  assert.equal(init.mode, ROLLOUT_MODE.V3);
  assert.equal(init.newProject, true);

  const save = manager.saveEngine(engine, pm);
  assert.equal(save.success, true);
  assert.equal(save.mode, ROLLOUT_MODE.V3);
  assert.equal(save.legacySaved, false);
  assert.equal(save.canonicalSaved, true);
  assert.equal(mem.api.getItem(STORAGE_KEY), null);
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));

  const envelope = JSON.parse(mem.api.getItem(V3_STORAGE_KEY));
  assert.equal(envelope.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(envelope.reasoningEngineVersion, V3_REASONING_ENGINE_VERSION);
  assert.equal(envelope.state.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(envelope.state.reasoningEngineVersion, V3_REASONING_ENGINE_VERSION);
  assert.ok(Object.keys(envelope.state.graph.nodes).length > 0);
  assert.ok(Object.keys(envelope.state.ledgers.claims).length > 0);
});

test('existing legacy projects enter SHADOW, create exact backup, and temporarily dual-write', () => {
  const mem = installStorage();
  const pm = new PersistenceManager();
  const legacyEngine = seedEngine();
  assert.equal(pm.saveProjectState(legacyEngine), true);
  const legacyRawBefore = mem.api.getItem(STORAGE_KEY);

  const freshEngine = new OrchestratorEngine();
  const manager = fixedManager();
  const init = manager.initializeEngine(freshEngine, pm);

  assert.equal(init.success, true);
  assert.equal(init.mode, ROLLOUT_MODE.SHADOW);
  const rolloutRecord = JSON.parse(mem.api.getItem(ROLLOUT_STORAGE_KEY));
  assert.equal(rolloutRecord.stateSchemaVersion, 2);
  assert.equal(rolloutRecord.shadowStateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(rolloutRecord.persistenceAuthority, 'LEGACY_V2');
  assert.equal(freshEngine.currentPhase, legacyEngine.currentPhase);
  assert.deepEqual(freshEngine.phaseData[1], legacyEngine.phaseData[1]);
  assert.equal(mem.api.getItem(PRE_V3_BACKUP_KEY), legacyRawBefore);
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));

  freshEngine.phaseData[2].customerPain = 'نسخه ویرایش‌شده در shadow';
  const save = manager.saveEngine(freshEngine, pm);
  assert.equal(save.success, true);
  assert.equal(save.mode, ROLLOUT_MODE.SHADOW);
  assert.equal(save.temporaryDualWrite, true);
  assert.equal(save.legacySaved, true);
  assert.equal(save.canonicalSaved, true);
  assert.notEqual(mem.api.getItem(STORAGE_KEY), legacyRawBefore);
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));
});

test('existing project promotion is blocked until shadow acceptance has no regressions', () => {
  installStorage();
  const pm = new PersistenceManager();
  const engine = seedEngine();
  pm.saveProjectState(engine);

  const manager = fixedManager();
  manager.initializeEngine(engine, pm);

  const missing = manager.promoteExistingProject({ engine, persistenceManager: pm });
  assert.equal(missing.success, false);
  assert.equal(missing.reason, 'shadow_acceptance_required');

  const regression = manager.promoteExistingProject({
    engine,
    persistenceManager: pm,
    shadowResults: [{ id: 'scenario-bad', verdict: 'REGRESSION' }],
  });
  assert.equal(regression.success, false);
  assert.equal(regression.reason, 'shadow_acceptance_required');
  assert.equal(manager.getMode(), ROLLOUT_MODE.SHADOW);
});

test('promotion is blocked by migration data loss or a missing pre-v3 backup', () => {
  let mem = installStorage();
  let pm = new PersistenceManager();
  let engine = seedEngine();
  pm.saveProjectState(engine);

  let manager = fixedManager();
  manager.initializeEngine(engine, pm);
  manager.recordShadowEvidence([{ id: 'shadow-ok', verdict: 'EXPECTED_IMPROVEMENT' }]);

  const envelope = JSON.parse(mem.api.getItem(V3_STORAGE_KEY));
  envelope.migrationReport = {
    ...(envelope.migrationReport || {}),
    droppedPaths: ['customCriticalField'],
  };
  mem.api.setItem(V3_STORAGE_KEY, JSON.stringify(envelope));

  const lost = manager.promoteExistingProject({ engine, persistenceManager: pm });
  assert.equal(lost.success, false);
  assert.equal(lost.reason, 'migration_data_loss_detected');
  assert.deepEqual(lost.droppedPaths, ['customCriticalField']);
  assert.equal(manager.getMode(), ROLLOUT_MODE.SHADOW);

  mem = installStorage();
  pm = new PersistenceManager();
  engine = seedEngine();
  pm.saveProjectState(engine);
  manager = fixedManager();
  manager.initializeEngine(engine, pm);
  manager.recordShadowEvidence([{ id: 'shadow-ok', verdict: 'EXPECTED_IMPROVEMENT' }]);
  mem.api.removeItem(PRE_V3_BACKUP_KEY);

  const noBackup = manager.promoteExistingProject({ engine, persistenceManager: pm });
  assert.equal(noBackup.success, false);
  assert.equal(noBackup.reason, 'pre_v3_backup_required');
  assert.equal(manager.getMode(), ROLLOUT_MODE.SHADOW);
});

test('operator policy can disable existing-project promotion even after shadow passes', () => {
  installStorage();
  const pm = new PersistenceManager();
  const engine = seedEngine();
  pm.saveProjectState(engine);

  const manager = fixedManager({ allowExistingPromotion: false });
  manager.initializeEngine(engine, pm);
  manager.recordShadowEvidence([{ id: 'shadow-ok', verdict: 'EXPECTED_IMPROVEMENT' }]);

  const result = manager.promoteExistingProject({ engine, persistenceManager: pm });
  assert.equal(result.success, false);
  assert.equal(result.reason, 'existing_project_promotion_disabled');
  assert.equal(manager.getMode(), ROLLOUT_MODE.SHADOW);
});

test('promotion requires migration, backup and shadow pass; V3 saves stop legacy writes', () => {
  const mem = installStorage();
  const pm = new PersistenceManager();
  const engine = seedEngine();
  pm.saveProjectState(engine);

  const manager = fixedManager();
  const init = manager.initializeEngine(engine, pm);
  assert.equal(init.mode, ROLLOUT_MODE.SHADOW);
  assert.ok(pm.getPreV3Backup());

  manager.recordShadowEvidence([
    { id: 'b2b', verdict: 'EXPECTED_IMPROVEMENT' },
    { id: 'migration', verdict: 'COMPATIBLE' },
  ]);
  const promoted = manager.promoteExistingProject({ engine, persistenceManager: pm });
  assert.equal(promoted.success, true);
  assert.equal(promoted.mode, ROLLOUT_MODE.V3);
  assert.equal(promoted.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(promoted.reasoningEngineVersion, V3_REASONING_ENGINE_VERSION);

  const legacyRawAtCutover = mem.api.getItem(STORAGE_KEY);
  engine.phaseData[2].customerPain = 'بعد از cutover';
  engine.revision += 1;
  const save = manager.saveEngine(engine, pm);
  assert.equal(save.success, true);
  assert.equal(save.mode, ROLLOUT_MODE.V3);
  assert.equal(save.legacySaved, false);
  assert.equal(mem.api.getItem(STORAGE_KEY), legacyRawAtCutover, 'legacy bytes must freeze after cutover');
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));

  const record = JSON.parse(mem.api.getItem(ROLLOUT_STORAGE_KEY));
  assert.equal(record.mode, ROLLOUT_MODE.V3);
  assert.equal(record.shadow.passed, true);
  assert.equal(record.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(record.reasoningEngineVersion, V3_REASONING_ENGINE_VERSION);
});

test('canonical V3 state restores into a fresh Orchestrator compatibility surface', () => {
  installStorage();
  const pm = new PersistenceManager();
  const manager = fixedManager();
  const original = seedEngine();

  manager.initializeEngine(original, pm);
  assert.equal(manager.saveEngine(original, pm).success, true);

  const restored = new OrchestratorEngine();
  const secondManager = fixedManager();
  const init = secondManager.initializeEngine(restored, pm);
  assert.equal(init.success, true);
  assert.equal(init.mode, ROLLOUT_MODE.V3);
  assert.equal(init.source, 'CANONICAL_V3');
  assert.equal(restored.currentPhase, original.currentPhase);
  assert.deepEqual(restored.phaseData[1], original.phaseData[1]);
  assert.deepEqual(restored.phaseData[2], original.phaseData[2]);
  assert.deepEqual(
    restored.answerRecords.map(item => item.id),
    original.answerRecords.map(item => item.id)
  );
  assert.equal(restored.businessContext.axes.customerModel, 'B2B');
  assert.ok(restored.reasoningGraphV3);
});

test('rollback restores exact pre-v3 envelope, clears canonical state, and returns to LEGACY', () => {
  const mem = installStorage();
  const pm = new PersistenceManager();
  const engine = seedEngine();
  pm.saveProjectState(engine);
  const exactLegacyBeforeMigration = mem.api.getItem(STORAGE_KEY);

  const manager = fixedManager();
  manager.initializeEngine(engine, pm);
  manager.recordShadowEvidence([{ id: 'ok', verdict: 'EXPECTED_IMPROVEMENT' }]);
  assert.equal(manager.promoteExistingProject({ engine, persistenceManager: pm }).success, true);
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));

  const rolled = manager.rollbackToLegacy({ engine, persistenceManager: pm });
  assert.equal(rolled.success, true);
  assert.equal(rolled.mode, ROLLOUT_MODE.LEGACY);
  assert.equal(mem.api.getItem(STORAGE_KEY), exactLegacyBeforeMigration);
  assert.equal(mem.api.getItem(V3_STORAGE_KEY), null);
  assert.equal(manager.getMode(), ROLLOUT_MODE.LEGACY);
});

test('rollback fails safely when no pre-v3 snapshot exists', () => {
  installStorage();
  const pm = new PersistenceManager();
  const manager = fixedManager();
  const result = manager.rollbackToLegacy({ persistenceManager: pm });
  assert.equal(result.success, false);
  assert.equal(result.reason, 'no_pre_v3_backup');
});

test('V3 export/import preserves explicit schema and engine versions', () => {
  installStorage();
  const pm = new PersistenceManager();
  const manager = fixedManager();
  const engine = seedEngine();
  manager.initializeEngine(engine, pm);
  manager.saveEngine(engine, pm);

  const exported = manager.exportProject(engine, pm);
  const envelope = JSON.parse(exported);
  assert.equal(envelope.stateSchemaVersion, V3_STATE_SCHEMA_VERSION);
  assert.equal(envelope.reasoningEngineVersion, V3_REASONING_ENGINE_VERSION);

  // Simulate a separate clean browser storage before import.
  const second = installStorage();
  const importedEngine = new OrchestratorEngine();
  const pm2 = new PersistenceManager();
  const manager2 = fixedManager();
  const result = manager2.importProject(exported, importedEngine, pm2);
  assert.equal(result.success, true);
  assert.equal(result.mode, ROLLOUT_MODE.V3);
  assert.ok(second.api.getItem(V3_STORAGE_KEY));
  assert.equal(second.api.getItem(STORAGE_KEY), null);
  assert.equal(importedEngine.businessContext.axes.customerModel, 'B2B');
});

test('reset clears legacy, canonical, backup, and rollout records', () => {
  const mem = installStorage();
  const pm = new PersistenceManager();
  const engine = seedEngine();
  pm.saveProjectState(engine);

  const manager = fixedManager();
  manager.initializeEngine(engine, pm);
  assert.ok(mem.api.getItem(STORAGE_KEY));
  assert.ok(mem.api.getItem(V3_STORAGE_KEY));
  assert.ok(mem.api.getItem(PRE_V3_BACKUP_KEY));
  assert.ok(mem.api.getItem(ROLLOUT_STORAGE_KEY));

  assert.equal(manager.reset(pm), true);
  for (const key of [STORAGE_KEY, V3_STORAGE_KEY, PRE_V3_BACKUP_KEY, ROLLOUT_STORAGE_KEY]) {
    assert.equal(mem.api.getItem(key), null, `${key} must be cleared`);
  }
});
