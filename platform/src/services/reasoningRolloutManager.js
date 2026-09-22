import {
  STORAGE_KEY,
  V3_STORAGE_KEY,
} from './persistenceManager.js';
import {
  PRE_V3_BACKUP_KEY,
  V3_REASONING_ENGINE_VERSION,
  V3_STATE_SCHEMA_VERSION,
} from '../state/v3/constants.js';
import { projectLegacyEngineToCanonicalState } from '../state/v3/compatibilityBridge.js';

export const ROLLOUT_STORAGE_KEY = 'dm_reasoning_v3_rollout';

export const ROLLOUT_MODE = Object.freeze({
  LEGACY: 'LEGACY',
  SHADOW: 'SHADOW',
  V3: 'V3',
});

const VALID_MODES = new Set(Object.values(ROLLOUT_MODE));

function nowIso(clock) {
  return typeof clock === 'function' ? clock() : new Date().toISOString();
}

function storageAvailable() {
  return typeof localStorage !== 'undefined';
}

function readJson(key) {
  if (!storageAvailable()) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function writeJson(key, value) {
  if (!storageAvailable()) return false;
  localStorage.setItem(key, JSON.stringify(value));
  return true;
}

export class ReasoningRolloutManager {
  constructor({
    newProjectsUseV3 = true,
    existingProjectsUseShadow = true,
    allowExistingPromotion = true,
    clock = () => new Date().toISOString(),
  } = {}) {
    this.policy = {
      newProjectsUseV3: Boolean(newProjectsUseV3),
      existingProjectsUseShadow: Boolean(existingProjectsUseShadow),
      allowExistingPromotion: Boolean(allowExistingPromotion),
    };
    this.clock = clock;
  }

  getRecord() {
    const record = readJson(ROLLOUT_STORAGE_KEY);
    if (!record || !VALID_MODES.has(record.mode)) return null;
    return record;
  }

  _writeRecord(patch = {}) {
    const current = this.getRecord() || {};
    const next = {
      version: 1,
      mode: patch.mode || current.mode || ROLLOUT_MODE.LEGACY,
      stateSchemaVersion: V3_STATE_SCHEMA_VERSION,
      reasoningEngineVersion: V3_REASONING_ENGINE_VERSION,
      createdAt: current.createdAt || nowIso(this.clock),
      updatedAt: nowIso(this.clock),
      shadow: current.shadow || null,
      migration: current.migration || null,
      promotedAt: current.promotedAt || null,
      rollbackAt: current.rollbackAt || null,
      ...patch,
    };
    if (!VALID_MODES.has(next.mode)) throw new Error(`Invalid rollout mode: ${next.mode}`);
    writeJson(ROLLOUT_STORAGE_KEY, next);
    return next;
  }

  getMode() {
    return this.getRecord()?.mode || null;
  }

  hasLegacyProject() {
    try {
      return storageAvailable() && Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  }

  hasCanonicalProject() {
    try {
      return storageAvailable() && Boolean(localStorage.getItem(V3_STORAGE_KEY));
    } catch {
      return false;
    }
  }

  initializeEngine(engine, persistenceManager) {
    if (!engine || !persistenceManager) {
      return { success: false, reason: 'engine_and_persistence_required' };
    }

    const hasLegacy = this.hasLegacyProject();
    const hasV3 = this.hasCanonicalProject();
    const existingRecord = this.getRecord();

    // Explicit V3 mode always restores canonical state first.
    if (existingRecord?.mode === ROLLOUT_MODE.V3 && hasV3) {
      const loaded = persistenceManager.loadV3ProjectState();
      if (!loaded || !persistenceManager.restoreCanonicalToEngine(engine, loaded.state)) {
        return { success: false, reason: 'canonical_restore_failed', mode: ROLLOUT_MODE.V3 };
      }
      return {
        success: true,
        mode: ROLLOUT_MODE.V3,
        source: 'CANONICAL_V3',
        stateSchemaVersion: loaded.stateSchemaVersion,
        reasoningEngineVersion: loaded.reasoningEngineVersion,
      };
    }

    // Brand-new projects can start directly on canonical persistence.
    if (!hasLegacy && !hasV3) {
      const mode = this.policy.newProjectsUseV3 ? ROLLOUT_MODE.V3 : ROLLOUT_MODE.LEGACY;
      this._writeRecord({ mode, projectKind: 'NEW' });
      return { success: true, mode, source: 'NEW_PROJECT', newProject: true };
    }

    // Existing projects must restore legacy first unless they were explicitly promoted.
    if (hasLegacy) {
      const loaded = persistenceManager.safeLoadOrInitialize(engine);
      if (!loaded?.success) {
        return { success: false, reason: loaded?.reason || 'legacy_restore_failed', mode: ROLLOUT_MODE.LEGACY };
      }

      const mode = existingRecord?.mode === ROLLOUT_MODE.LEGACY
        ? ROLLOUT_MODE.LEGACY
        : this.policy.existingProjectsUseShadow
          ? ROLLOUT_MODE.SHADOW
          : ROLLOUT_MODE.LEGACY;

      let migration = null;
      if (mode === ROLLOUT_MODE.SHADOW) {
        migration = persistenceManager.hasV3ProjectState()
          ? persistenceManager.loadV3ProjectState()?.migrationReport || null
          : persistenceManager.migrateStoredProjectToV3({ migratedAt: nowIso(this.clock) });
      }

      this._writeRecord({
        mode,
        projectKind: 'EXISTING',
        migration: migration?.report || migration || existingRecord?.migration || null,
      });

      return {
        success: true,
        mode,
        source: 'LEGACY_COMPATIBILITY',
        schemaVersion: loaded.schemaVersion,
        migration,
      };
    }

    // A canonical project exists without legacy state. Keep it authoritative.
    if (hasV3) {
      const loaded = persistenceManager.loadV3ProjectState();
      if (!loaded || !persistenceManager.restoreCanonicalToEngine(engine, loaded.state)) {
        return { success: false, reason: 'canonical_restore_failed', mode: ROLLOUT_MODE.V3 };
      }
      this._writeRecord({ mode: ROLLOUT_MODE.V3, projectKind: 'CANONICAL_ONLY' });
      return {
        success: true,
        mode: ROLLOUT_MODE.V3,
        source: 'CANONICAL_V3',
        stateSchemaVersion: loaded.stateSchemaVersion,
        reasoningEngineVersion: loaded.reasoningEngineVersion,
      };
    }

    return { success: false, reason: 'unresolved_rollout_state' };
  }

  saveEngine(engine, persistenceManager) {
    if (!engine || !persistenceManager) return { success: false, reason: 'engine_and_persistence_required' };
    const mode = this.getMode() || (this.policy.newProjectsUseV3 ? ROLLOUT_MODE.V3 : ROLLOUT_MODE.LEGACY);

    if (mode === ROLLOUT_MODE.LEGACY) {
      const legacySaved = persistenceManager.saveProjectState(engine);
      return { success: Boolean(legacySaved), mode, legacySaved, canonicalSaved: false };
    }

    const projected = projectLegacyEngineToCanonicalState(engine, {
      fromSchemaVersion: 2,
      migratedAt: nowIso(this.clock),
    });
    const canonicalSaved = persistenceManager.saveCanonicalProjectState(projected.state, {
      savedAt: nowIso(this.clock),
    });

    if (mode === ROLLOUT_MODE.V3) {
      // Canonical-only write after promotion/cutover.
      return { success: Boolean(canonicalSaved), mode, legacySaved: false, canonicalSaved };
    }

    // Shadow mode is the only temporary dual-write period.
    const legacySaved = persistenceManager.saveProjectState(engine);
    return {
      success: Boolean(legacySaved && canonicalSaved),
      mode,
      legacySaved,
      canonicalSaved,
      temporaryDualWrite: true,
    };
  }

  recordShadowEvidence(results, { acceptanceVersion = 'reasoning-v3' } = {}) {
    const list = Array.isArray(results) ? results : [results].filter(Boolean);
    const regressions = list.filter(result => result?.verdict === 'REGRESSION');
    const shadow = {
      acceptanceVersion,
      evaluatedAt: nowIso(this.clock),
      scenarioCount: list.length,
      regressionIds: regressions.map(item => item.id || 'unknown'),
      passed: list.length > 0 && regressions.length === 0,
    };
    this._writeRecord({ shadow });
    return shadow;
  }

  promoteExistingProject({ engine, persistenceManager, shadowResults = null } = {}) {
    if (!this.policy.allowExistingPromotion) {
      return { success: false, reason: 'existing_project_promotion_disabled' };
    }
    if (!engine || !persistenceManager) {
      return { success: false, reason: 'engine_and_persistence_required' };
    }
    if (!this.hasLegacyProject()) {
      return { success: false, reason: 'legacy_project_required_for_promotion' };
    }

    if (shadowResults) this.recordShadowEvidence(shadowResults);
    const record = this.getRecord();
    if (!record?.shadow?.passed) {
      return { success: false, reason: 'shadow_acceptance_required' };
    }

    let migrationResult = persistenceManager.loadV3ProjectState();
    if (!migrationResult) {
      const migrated = persistenceManager.migrateStoredProjectToV3({ migratedAt: nowIso(this.clock) });
      if (!migrated?.success) return { success: false, reason: migrated?.reason || 'migration_failed', migration: migrated };
      migrationResult = persistenceManager.loadV3ProjectState();
    }

    const report = migrationResult?.migrationReport || migrationResult?.state?.migration?.latestReport || null;
    if ((report?.droppedPaths || []).length > 0) {
      return { success: false, reason: 'migration_data_loss_detected', droppedPaths: report.droppedPaths };
    }
    if (!persistenceManager.getPreV3Backup()) {
      return { success: false, reason: 'pre_v3_backup_required' };
    }

    const projected = projectLegacyEngineToCanonicalState(engine, {
      fromSchemaVersion: 2,
      migratedAt: nowIso(this.clock),
    });
    if (!persistenceManager.saveCanonicalProjectState(projected.state, { savedAt: nowIso(this.clock) })) {
      return { success: false, reason: 'canonical_save_failed' };
    }

    const next = this._writeRecord({
      mode: ROLLOUT_MODE.V3,
      projectKind: 'MIGRATED_EXISTING',
      migration: report,
      promotedAt: nowIso(this.clock),
    });
    return {
      success: true,
      mode: next.mode,
      stateSchemaVersion: V3_STATE_SCHEMA_VERSION,
      reasoningEngineVersion: V3_REASONING_ENGINE_VERSION,
    };
  }

  rollbackToLegacy({ engine = null, persistenceManager } = {}) {
    if (!persistenceManager) return { success: false, reason: 'persistence_required' };
    const restored = persistenceManager.restorePreV3Backup({ clearCanonical: true });
    if (!restored?.success) return restored;

    if (engine && !persistenceManager.safeLoadOrInitialize(engine)?.success) {
      return { success: false, reason: 'rollback_engine_restore_failed' };
    }

    const record = this._writeRecord({
      mode: ROLLOUT_MODE.LEGACY,
      rollbackAt: nowIso(this.clock),
    });
    return { success: true, mode: record.mode, restoredSchemaVersion: restored.restoredSchemaVersion };
  }

  reset(persistenceManager) {
    if (persistenceManager) persistenceManager.resetProjectState();
    try {
      if (storageAvailable()) localStorage.removeItem(ROLLOUT_STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  telemetry() {
    const record = this.getRecord();
    return {
      mode: record?.mode || null,
      stateSchemaVersion: record?.stateSchemaVersion || null,
      reasoningEngineVersion: record?.reasoningEngineVersion || null,
      shadowPassed: Boolean(record?.shadow?.passed),
      hasLegacyProject: this.hasLegacyProject(),
      hasCanonicalProject: this.hasCanonicalProject(),
      hasPreV3Backup: storageAvailable() && Boolean(localStorage.getItem(PRE_V3_BACKUP_KEY)),
    };
  }
}
