import { createReasoningGraph, validateReasoningGraph } from '../../reasoning/graph/index.js';
import { makeStableId } from '../../reasoning/graph/ids.js';
import {
  CANONICAL_CONTEXT_AXES,
  validateCanonicalBusinessContext,
} from '../../reasoning/context/businessContextContract.js';
import {
  V3_REASONING_ENGINE_VERSION,
  V3_STATE_SCHEMA_VERSION,
} from './constants.js';

const emptyLedger = () => ({});

export function createUnknownBusinessContext() {
  return {
    schemaVersion: '3.0.0',
    businessTypeId: null,
    industryId: null,
    primaryArchetype: null,
    axes: Object.fromEntries(CANONICAL_CONTEXT_AXES.map(axis => [axis, 'UNKNOWN'])),
    activeOverlays: [],
    axisProvenance: Object.fromEntries(CANONICAL_CONTEXT_AXES.map(axis => [axis, {
      sourceType: 'MIGRATED_LEGACY',
      evidenceIds: [],
      confidence: null,
      confirmed: false,
    }])),
  };
}

export function createCanonicalProjectState({
  projectId = null,
  projectStableKey = 'UNSCOPED',
  revision = 0,
  businessContext = null,
  session = {},
} = {}) {
  const id = projectId || makeStableId('PRJ', projectStableKey);
  const context = businessContext || createUnknownBusinessContext();
  return {
    stateSchemaVersion: V3_STATE_SCHEMA_VERSION,
    reasoningEngineVersion: V3_REASONING_ENGINE_VERSION,
    projectId: id,
    revision: Number.isInteger(revision) && revision >= 0 ? revision : 0,
    businessContext: context,
    ledgers: {
      evidence: emptyLedger(),
      decisions: emptyLedger(),
      proposals: emptyLedger(),
      claims: emptyLedger(),
      risks: emptyLedger(),
      contradictions: emptyLedger(),
      unknowns: emptyLedger(),
      legacyRecords: emptyLedger(),
    },
    graph: createReasoningGraph({ projectId: id, revision: 0 }),
    session: {
      currentPhase: 1,
      currentStepIndex: 0,
      reviewRequired: {},
      phaseStatus: {},
      navigation: {
        isNavigatingBack: false,
        reviewCursor: null,
      },
      ...session,
    },
    knowledgeRefs: {
      sourceIds: [],
      knowledgeNodeIds: [],
    },
    migration: {
      sourceSchemaVersion: null,
      legacyIdMap: {},
      latestReport: null,
    },
  };
}

export function validateCanonicalProjectState(state) {
  const errors = [];
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return { valid: false, errors: ['Canonical state must be an object.'] };
  }
  if (state.stateSchemaVersion !== V3_STATE_SCHEMA_VERSION) errors.push(`Unsupported stateSchemaVersion: ${state.stateSchemaVersion}`);
  if (!state.reasoningEngineVersion) errors.push('reasoningEngineVersion is required.');
  if (!state.projectId) errors.push('projectId is required.');
  if (!Number.isInteger(state.revision) || state.revision < 0) errors.push('revision must be a non-negative integer.');

  const contextValidation = validateCanonicalBusinessContext(state.businessContext);
  errors.push(...contextValidation.errors.map(error => `businessContext: ${error}`));

  const requiredLedgers = ['evidence', 'decisions', 'proposals', 'claims', 'risks', 'contradictions', 'unknowns', 'legacyRecords'];
  for (const ledger of requiredLedgers) {
    if (!state.ledgers?.[ledger] || typeof state.ledgers[ledger] !== 'object' || Array.isArray(state.ledgers[ledger])) {
      errors.push(`ledgers.${ledger} must be an object keyed by canonical ID.`);
    }
  }

  const graphValidation = validateReasoningGraph(state.graph);
  errors.push(...graphValidation.errors.map(error => `graph: ${error}`));

  const phase = Number(state.session?.currentPhase);
  if (!Number.isInteger(phase) || phase < 1 || phase > 8) errors.push('session.currentPhase must be an integer from 1 to 8.');

  return { valid: errors.length === 0, errors };
}
