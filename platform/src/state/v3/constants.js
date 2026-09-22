import { REASONING_ENGINE_VERSION } from '../../reasoning/graph/constants.js';

export const V3_STATE_SCHEMA_VERSION = 3;
export const LEGACY_STATE_SCHEMA_VERSION = 2;
export const V3_REASONING_ENGINE_VERSION = REASONING_ENGINE_VERSION;

export const V3_STORAGE_KEY = 'dm_project_state_v3';
export const PRE_V3_BACKUP_KEY = 'dm_project_state_pre_v3_backup';

export const LEGACY_RECORD_KIND = Object.freeze({
  PHASE_DATA_SNAPSHOT: 'PHASE_DATA_SNAPSHOT',
  BUSINESS_CONTEXT_SNAPSHOT: 'BUSINESS_CONTEXT_SNAPSHOT',
  RUNTIME_FIELD: 'RUNTIME_FIELD',
  UNMAPPED_FIELD: 'UNMAPPED_FIELD',
});
