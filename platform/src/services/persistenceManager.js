import { migrateAnswerRecords } from "./interviewSchema.js";
import { validateUnitEconomics } from './unitEconomics.js';
import { migrateLegacyStateToV3 } from '../state/v3/migration.js';
import { validateCanonicalProjectState } from '../state/v3/canonicalState.js';
import { projectCanonicalStateToLegacyEngineState } from '../state/v3/compatibilityBridge.js';
import {
  PRE_V3_BACKUP_KEY,
  V3_STATE_SCHEMA_VERSION,
  V3_STORAGE_KEY,
} from '../state/v3/constants.js';
/**
 * DIGITAL MARKET — Versioned State Persistence Manager (Requirement R8.1)
 * 
 * Handles project state save/restore/export/import with versioned schema
 * and strict security (API keys NEVER exported or persisted in project state).
 */

const STORAGE_KEY = 'dm_project_state';
const SCHEMA_VERSION = 2;

// Fields that must NEVER be persisted or exported (all lowercase for case-insensitive matching)
const SENSITIVE_FIELDS = ['apikey', 'api_key', 'token', 'secret', 'password', 'credential', 'auth', 'bearer'];

/**
 * Strips sensitive fields recursively from an object
 */
function sanitizeForPersistence(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForPersistence);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;
    const lower = key.toLowerCase();
    if (SENSITIVE_FIELDS.some(s => lower.includes(s.toLowerCase()))) {
      continue; // Skip sensitive fields
    }
    clean[key] = sanitizeForPersistence(value);
  }
  return clean;
}

/**
 * Validates that a state object has required structural fields
 */
function validateStateStructure(state) {
  const errors = [];

  if (!state || typeof state !== 'object') {
    return { valid: false, errors: ['State is not an object'] };
  }

  const requiredFields = ['currentPhase', 'completedPhases', 'phaseData'];
  for (const field of requiredFields) {
    if (!(field in state)) {
      errors.push(`فیلد الزامی '${field}' در state موجود نیست`);
    }
  }

  if (state.currentPhase !== undefined) {
    const p = Number(state.currentPhase);
    if (!Number.isInteger(p) || p < 1 || p > 8) {
      errors.push(`مقدار currentPhase نامعتبر: ${state.currentPhase}`);
    }
  }

  if (!state.completedPhases || typeof state.completedPhases !== 'object' || Array.isArray(state.completedPhases)) {
    errors.push('completedPhases باید یک object باشد');
  }

  if (!state.phaseData || typeof state.phaseData !== 'object' || Array.isArray(state.phaseData)) {
    errors.push('phaseData باید یک object باشد');
  }

  for (const field of ['facts', 'decisions', 'assumptions', 'unknowns', 'contradictions', 'answerRecords', 'aiInsights', 'dynamicQuestionsHistory']) {
    if (state[field] !== undefined && !Array.isArray(state[field])) errors.push(`${field} باید آرایه باشد`);
  }
  for (const record of Array.isArray(state.answerRecords) ? state.answerRecords : []) {
    if (record?.structuredData && (record.questionId !== 'unit_economics' || !validateUnitEconomics(record.structuredData).valid)) errors.push('اطلاعات مالی پاسخ واردشده معتبر نیست.');
  }
  if (state.phaseData && typeof state.phaseData === 'object') {
    for (const data of Object.values(state.phaseData)) {
      if (!data || typeof data !== 'object' || Array.isArray(data)) errors.push('داده فاز نامعتبر است');
    }
  }
  return { valid: errors.length === 0, errors };
}

export class PersistenceManager {
  constructor() {
    this._autoSaveTimer = null;
    this._autoSaveInterval = 30000; // 30 seconds
  }

  /**
   * Extract persistable state from engine
   */
  extractState(engine) {
    if (!engine) return null;
    return {
      revision: engine.revision || 0,
      answerRecords: engine.answerRecords || [],
      aiInsights: engine.aiInsights || [],
      reviewRequired: engine.reviewRequired || {},
      dynamicQuestion: engine.dynamicQuestion || null,
      dynamicQuestionState: engine.dynamicQuestionState || null,
      dynamicQuestionsHistory: engine.dynamicQuestionsHistory || [],
      isNavigatingBack: engine.isNavigatingBack || false,
      reviewCursor: engine.reviewCursor ?? null,
      currentPhase: engine.currentPhase,
      currentStepIndex: engine.currentStepIndex,
      completedPhases: { ...engine.completedPhases },
      phaseData: JSON.parse(JSON.stringify(engine.phaseData || {})),
      phaseStatus: { ...(engine.phaseStatus || {}) },
      facts: [...(engine.facts || [])],
      decisions: [...(engine.decisions || [])],
      assumptions: [...(engine.assumptions || [])],
      unknowns: [...(engine.unknowns || [])],
      contradictions: [...(engine.contradictions || [])],
      businessContext: engine.businessContext ? { ...engine.businessContext } : null,
    };
  }

  /**
   * Save project state to localStorage
   * API keys are NEVER included.
   */
  saveProjectState(engine) {
    try {
      if (typeof localStorage === 'undefined') return false;

      const state = this.extractState(engine);
      if (!state) return false;

      const envelope = {
        schemaVersion: SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        state: sanitizeForPersistence(state)
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
      return true;
    } catch (err) {
      console.warn('[PersistenceManager] Save failed:', err.message);
      return false;
    }
  }

  /**
   * Load project state from localStorage
   * Returns null if no saved state or validation fails
   */
  loadProjectState() {
    try {
      if (typeof localStorage === 'undefined') return null;

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const envelope = JSON.parse(raw);
      if (!envelope || typeof envelope !== 'object') return null;

      // Schema version migration
      const version = envelope.schemaVersion || 0;
      let state = envelope.state;

      if (version < SCHEMA_VERSION) {
        state = this.migrateState(state, version);
      }

      // Validate structure
      const validation = validateStateStructure(state);
      if (!validation.valid) {
        console.warn('[PersistenceManager] Loaded state validation failed:', validation.errors);
        return null;
      }

      return {
        state,
        savedAt: envelope.savedAt,
        schemaVersion: version
      };
    } catch (err) {
      console.warn('[PersistenceManager] Load failed:', err.message);
      return null;
    }
  }

  /**
   * Safe load with corrupted state recovery (Requirement R11)
   * Recovers from corrupt JSON, invalid schema, or missing fields without crashing.
   */
  safeLoadOrInitialize(engine) {
    try {
      if (typeof localStorage === 'undefined') {
        return { success: false, reason: 'localStorage not available' };
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { success: false, reason: 'no_saved_state' };
      }

      let envelope = null;
      try {
        envelope = JSON.parse(raw);
      } catch (parseErr) {
        console.warn('[PersistenceManager] Corrupted JSON detected. Backing up and resetting:', parseErr.message);
        try {
          localStorage.setItem(`${STORAGE_KEY}_corrupt_backup`, raw);
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
        return { success: false, corrupted: true, reason: 'corrupted_json' };
      }

      if (!envelope || typeof envelope !== 'object' || !envelope.state) {
        console.warn('[PersistenceManager] Malformed state envelope. Resetting.');
        return { success: false, corrupted: true, reason: 'malformed_envelope' };
      }

      const version = envelope.schemaVersion || 0;
      let state = envelope.state;

      if (version < SCHEMA_VERSION) {
        state = this.migrateState(state, version);
      }

      const validation = validateStateStructure(state);
      if (!validation.valid) {
        console.warn('[PersistenceManager] Invalid state structure:', validation.errors);
        return { success: false, corrupted: true, reason: 'validation_failed', errors: validation.errors };
      }

      const restored = this.restoreToEngine(engine, state);
      if (!restored) {
        return { success: false, corrupted: true, reason: 'restore_failed' };
      }

      return {
        success: true,
        savedAt: envelope.savedAt,
        schemaVersion: version
      };
    } catch (err) {
      console.warn('[PersistenceManager] Unexpected error during safe load:', err.message);
      return { success: false, corrupted: true, reason: err.message };
    }
  }

  /**
   * Restore state into engine instance
   */
  restoreToEngine(engine, savedState) {
    if (!engine || !savedState) return false;

    try {
      if (!validateStateStructure(savedState).valid) return false;
      savedState = JSON.parse(JSON.stringify(sanitizeForPersistence(savedState)));
      engine.revision = Math.max(Number(savedState.revision) || 0, ...((savedState.answerRecords || []).map(a => Number(a.revision) || 0))) + 1;
      engine.answerRecords = savedState.answerRecords || migrateAnswerRecords(savedState.phaseData);
      engine.aiInsights = savedState.aiInsights || [];
      engine.reviewRequired = savedState.reviewRequired || {};
      engine.dynamicQuestion = savedState.dynamicQuestion || null;
      engine.dynamicQuestionState = savedState.dynamicQuestionState || null;
      engine.dynamicQuestionsHistory = savedState.dynamicQuestionsHistory || [];
      engine.dynamicQuestionOverride = null;
      engine.isNavigatingBack = Boolean(savedState.isNavigatingBack);
      engine.reviewCursor = Number.isInteger(savedState.reviewCursor) ? savedState.reviewCursor : null;
      engine.currentPhase = Number(savedState.currentPhase) || 1;
      engine.currentStepIndex = savedState.currentStepIndex || 0;
      engine.completedPhases = savedState.completedPhases || {};
      engine.phaseData = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, ...savedState.phaseData };
      engine.phaseStatus = savedState.phaseStatus || {};
      engine.facts = savedState.facts || [];
      engine.decisions = savedState.decisions || [];
      engine.assumptions = savedState.assumptions || [];
      engine.unknowns = savedState.unknowns || [];
      engine.contradictions = savedState.contradictions || [];
      engine.businessContext = savedState.businessContext || null;
      return true;
    } catch (err) {
      console.warn('[PersistenceManager] Restore failed:', err.message);
      return false;
    }
  }

  /**
   * Export state as JSON string (for file download)
   * API keys are NEVER included.
   */
  exportProjectJSON(engine) {
    const state = this.extractState(engine);
    if (!state) return null;

    const envelope = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      platform: 'DIGITAL MARKET',
      state: sanitizeForPersistence(state)
    };

    return JSON.stringify(envelope, null, 2);
  }

  /**
   * Import state from JSON string
   * Validates schema before accepting.
   */
  importProjectJSON(jsonString) {
    try {
      const envelope = JSON.parse(jsonString);
      if (!envelope || typeof envelope !== 'object') {
        return { success: false, error: 'فرمت JSON نامعتبر است' };
      }

      let state = envelope.state;
      if (!state) {
        return { success: false, error: 'فیلد state در فایل وارد شده موجود نیست' };
      }

      // Migrate if needed
      const version = envelope.schemaVersion || 0;
      if (version < SCHEMA_VERSION) {
        state = this.migrateState(state, version);
      }

      // Validate
      const validation = validateStateStructure(state);
      if (!validation.valid) {
        return { success: false, error: `اعتبارسنجی ناموفق: ${validation.errors.join(', ')}` };
      }

      // Sanitize imported state (remove any accidentally included secrets)
      state = sanitizeForPersistence(state);

      return { success: true, state, schemaVersion: version };
    } catch (err) {
      return { success: false, error: `خطا در خواندن فایل: ${err.message}` };
    }
  }

  /**
   * One-way, opt-in migration from the current legacy envelope to canonical v3 state.
   * The legacy storage key is left untouched. A pre-v3 backup is captured once and
   * canonical state is written only to V3_STORAGE_KEY.
   */
  migrateStoredProjectToV3({ projectId = null, migratedAt = new Date().toISOString() } = {}) {
    try {
      if (typeof localStorage === 'undefined') return { success: false, reason: 'localStorage not available' };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { success: false, reason: 'no_saved_state' };

      let envelope;
      try {
        envelope = JSON.parse(raw);
      } catch (err) {
        return { success: false, corrupted: true, reason: 'corrupted_json', error: err.message };
      }
      if (!envelope || typeof envelope !== 'object' || !envelope.state) {
        return { success: false, corrupted: true, reason: 'malformed_envelope' };
      }

      const sourceVersion = Number(envelope.schemaVersion || 0);
      if (sourceVersion > SCHEMA_VERSION) {
        return { success: false, reason: 'unsupported_future_legacy_version', schemaVersion: sourceVersion };
      }

      let sourceState = envelope.state;
      if (sourceVersion < SCHEMA_VERSION) sourceState = this.migrateState(sourceState, sourceVersion);
      const legacyValidation = validateStateStructure(sourceState);
      if (!legacyValidation.valid) {
        return { success: false, corrupted: true, reason: 'validation_failed', errors: legacyValidation.errors };
      }

      if (!localStorage.getItem(PRE_V3_BACKUP_KEY)) {
        localStorage.setItem(PRE_V3_BACKUP_KEY, raw);
      }

      const sanitized = sanitizeForPersistence(sourceState);
      const migrated = migrateLegacyStateToV3(sanitized, {
        fromSchemaVersion: sourceVersion,
        projectId,
        migratedAt,
      });
      const canonicalValidation = validateCanonicalProjectState(migrated.state);
      if (!canonicalValidation.valid) {
        return { success: false, reason: 'canonical_validation_failed', errors: canonicalValidation.errors };
      }

      const v3Envelope = {
        stateSchemaVersion: V3_STATE_SCHEMA_VERSION,
        reasoningEngineVersion: migrated.state.reasoningEngineVersion,
        savedAt: migratedAt,
        sourceSavedAt: envelope.savedAt || null,
        migrationReport: migrated.report,
        state: sanitizeForPersistence(migrated.state),
      };
      localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(v3Envelope));

      return {
        success: true,
        state: migrated.state,
        report: migrated.report,
        backupKey: PRE_V3_BACKUP_KEY,
        storageKey: V3_STORAGE_KEY,
      };
    } catch (err) {
      console.warn('[PersistenceManager] v3 migration failed:', err.message);
      return { success: false, reason: 'migration_failed', error: err.message };
    }
  }

  /**
   * Persist canonical v3 state only. This method never writes the legacy key.
   */
  saveCanonicalProjectState(canonicalState, { savedAt = new Date().toISOString() } = {}) {
    try {
      if (typeof localStorage === 'undefined') return false;
      const validation = validateCanonicalProjectState(canonicalState);
      if (!validation.valid) {
        console.warn('[PersistenceManager] Canonical state validation failed:', validation.errors);
        return false;
      }
      const envelope = {
        stateSchemaVersion: V3_STATE_SCHEMA_VERSION,
        reasoningEngineVersion: canonicalState.reasoningEngineVersion,
        savedAt,
        state: sanitizeForPersistence(canonicalState),
      };
      localStorage.setItem(V3_STORAGE_KEY, JSON.stringify(envelope));
      return true;
    } catch (err) {
      console.warn('[PersistenceManager] Canonical save failed:', err.message);
      return false;
    }
  }

  /**
   * Load canonical v3 state without mutating or projecting it into the legacy engine.
   */
  loadV3ProjectState() {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem(V3_STORAGE_KEY);
      if (!raw) return null;
      const envelope = JSON.parse(raw);
      if (!envelope || envelope.stateSchemaVersion !== V3_STATE_SCHEMA_VERSION || !envelope.state) return null;
      const validation = validateCanonicalProjectState(envelope.state);
      if (!validation.valid) {
        console.warn('[PersistenceManager] Loaded canonical state validation failed:', validation.errors);
        return null;
      }
      return {
        state: envelope.state,
        savedAt: envelope.savedAt || null,
        stateSchemaVersion: envelope.stateSchemaVersion,
        reasoningEngineVersion: envelope.reasoningEngineVersion || envelope.state.reasoningEngineVersion,
        migrationReport: envelope.migrationReport || envelope.state.migration?.latestReport || null,
      };
    } catch (err) {
      console.warn('[PersistenceManager] Canonical load failed:', err.message);
      return null;
    }
  }

  /**
   * Restore canonical v3 state into the current Orchestrator compatibility surface.
   * Canonical state remains authoritative; this is a projection, not a reverse migration.
   */
  restoreCanonicalToEngine(engine, canonicalState) {
    try {
      const validation = validateCanonicalProjectState(canonicalState);
      if (!validation.valid) {
        console.warn('[PersistenceManager] Canonical restore validation failed:', validation.errors);
        return false;
      }
      const legacyView = projectCanonicalStateToLegacyEngineState(canonicalState);
      const restored = this.restoreToEngine(engine, legacyView);
      if (!restored) return false;
      if (typeof engine._syncReasoningGraphV3 === 'function') engine._syncReasoningGraphV3();
      return true;
    } catch (err) {
      console.warn('[PersistenceManager] Canonical restore failed:', err.message);
      return false;
    }
  }

  /**
   * Explicit rollback to the exact pre-v3 envelope.
   * This never attempts to reverse-transform canonical writes.
   */
  restorePreV3Backup({ clearCanonical = true } = {}) {
    try {
      if (typeof localStorage === 'undefined') return { success: false, reason: 'localStorage not available' };
      const raw = localStorage.getItem(PRE_V3_BACKUP_KEY);
      if (!raw) return { success: false, reason: 'no_pre_v3_backup' };

      // Validate the backup before replacing the active legacy key.
      const envelope = JSON.parse(raw);
      if (!envelope || typeof envelope !== 'object' || !envelope.state) {
        return { success: false, reason: 'invalid_pre_v3_backup' };
      }
      const version = Number(envelope.schemaVersion || 0);
      let state = envelope.state;
      if (version < SCHEMA_VERSION) state = this.migrateState(state, version);
      const validation = validateStateStructure(state);
      if (!validation.valid) {
        return { success: false, reason: 'backup_validation_failed', errors: validation.errors };
      }

      localStorage.setItem(STORAGE_KEY, raw);
      if (clearCanonical) localStorage.removeItem(V3_STORAGE_KEY);
      return {
        success: true,
        restoredSchemaVersion: version,
        clearedCanonical: Boolean(clearCanonical),
      };
    } catch (err) {
      console.warn('[PersistenceManager] Pre-v3 rollback failed:', err.message);
      return { success: false, reason: 'rollback_failed', error: err.message };
    }
  }

  clearV3ProjectState({ clearBackup = false } = {}) {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.removeItem(V3_STORAGE_KEY);
      if (clearBackup) localStorage.removeItem(PRE_V3_BACKUP_KEY);
      return true;
    } catch {
      return false;
    }
  }

  hasV3ProjectState() {
    try {
      return typeof localStorage !== 'undefined' && Boolean(localStorage.getItem(V3_STORAGE_KEY));
    } catch {
      return false;
    }
  }

  getPreV3Backup() {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(PRE_V3_BACKUP_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Reset / clear all persisted state
   */
  resetProjectState() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(V3_STORAGE_KEY);
        localStorage.removeItem(PRE_V3_BACKUP_KEY);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * State migration: upgrade old schema versions to current
   */
  migrateState(state, fromVersion) {
    let migrated = { ...state };

    if (fromVersion < 1) {
      // v0 -> v1: ensure all required fields exist
      if (!migrated.unknowns) migrated.unknowns = [];
      if (!migrated.contradictions) migrated.contradictions = [];
      if (!migrated.assumptions) migrated.assumptions = [];
      if (!migrated.phaseStatus) migrated.phaseStatus = {};
      if (!migrated.completedPhases) {
        migrated.completedPhases = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
      }
    }

    if (fromVersion < 2) {
      migrated.answerRecords = migrateAnswerRecords(migrated.phaseData);
      migrated.revision = 0;
      migrated.aiInsights = [];
      migrated.reviewRequired = {};
      migrated.dynamicQuestionsHistory = [];
      migrated.dynamicQuestion = null;
      // Earlier versions could finalize with router defaults and fabricated output.
      // Preserve all responses but ask for review before issuing a new confirmed document.
      migrated.completedPhases = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, false]));
      migrated.phaseStatus = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i + 1, 'INVALIDATED']));
      if (Number.isInteger(Number(migrated.currentPhase)) && Number(migrated.currentPhase) >= 1 && Number(migrated.currentPhase) <= 8) migrated.currentPhase = 1;
    }

    return migrated;
  }

  /**
   * Start auto-save interval
   */
  startAutoSave(engine) {
    this.stopAutoSave();
    this._autoSaveTimer = setInterval(() => {
      this.saveProjectState(engine);
    }, this._autoSaveInterval);
  }

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this._autoSaveTimer) {
      clearInterval(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }
  }
}

export { sanitizeForPersistence, validateStateStructure, SCHEMA_VERSION, STORAGE_KEY, V3_STATE_SCHEMA_VERSION, V3_STORAGE_KEY, PRE_V3_BACKUP_KEY };
