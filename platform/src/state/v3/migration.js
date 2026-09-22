import {
  EDGE_TYPES,
  ENTITY_STATUS,
  NODE_TYPES,
  addGraphEdge,
  addGraphNode,
} from '../../reasoning/graph/index.js';
import { makeNodeId, makeStableId, stableSerialize } from '../../reasoning/graph/ids.js';
import {
  CANONICAL_CONTEXT_AXES,
  CONTEXT_AXIS_VALUES,
} from '../../reasoning/context/businessContextContract.js';
import { createCanonicalProjectState } from './canonicalState.js';
import {
  LEGACY_RECORD_KIND,
  V3_STATE_SCHEMA_VERSION,
} from './constants.js';

const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const LEGACY_AXIS_KEYS = Object.freeze({
  customerModel: ['customerModel', 'customer_model'],
  offerType: ['offerType', 'offer_type'],
  channelModel: ['channelModel', 'channel_model'],
  revenueModel: ['revenueModel', 'revenue_model'],
  maturity: ['maturity', 'business_stage'],
  scale: ['scale'],
  salesMotion: ['salesMotion', 'sales_motion'],
  geography: ['geography', 'geographicScope', 'market_geography'],
  branchStructure: ['branchStructure', 'branch_structure'],
  founderRole: ['founderRole', 'founder_role'],
  purchaseCycle: ['purchaseCycle', 'purchase_cycle'],
  relationshipModel: ['relationshipModel', 'relationship_model'],
  regulatoryProfile: ['regulatoryProfile', 'regulatory_profile'],
  operationalComplexity: ['operationalComplexity', 'operational_complexity'],
  brandArchitecture: ['brandArchitecture', 'brand_architecture'],
});

const VALUE_ALIASES = Object.freeze({
  customerModel: Object.freeze({ MARKETPLACE: 'TWO_SIDED' }),
  offerType: Object.freeze({ PRODUCT: 'PHYSICAL_PRODUCT', SOFTWARE: 'DIGITAL_PRODUCT' }),
  channelModel: Object.freeze({ DIRECT_SALES: 'DIRECT_SALES_B2B', B2B_DIRECT: 'DIRECT_SALES_B2B' }),
  revenueModel: Object.freeze({ SUBSCRIPTION: 'RECURRING', PROJECT: 'PROJECT_BASED' }),
  maturity: Object.freeze({ CONCEPT: 'IDEA', PRE_REVENUE: 'PRE_LAUNCH', ESTABLISHED: 'MATURE' }),
  salesMotion: Object.freeze({ FIELD_SALES: 'FIELD_ENTERPRISE', ENTERPRISE_SALES: 'FIELD_ENTERPRISE' }),
  geography: Object.freeze({
    LOCAL: 'CITY',
    LOCAL_CITY: 'CITY',
    CITY_REGIONAL: 'REGIONAL',
    PROVINCIAL: 'PROVINCE',
    NATIONWIDE_IRAN: 'NATIONAL',
    INTERNATIONAL: 'REGIONAL_INTERNATIONAL',
  }),
  founderRole: Object.freeze({ INVESTOR: 'INVESTOR_LED' }),
  relationshipModel: Object.freeze({ RELATIONAL_RETAINER: 'CONTRACTUAL_RETAINER' }),
});

function firstDefined(obj, keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null && obj?.[key] !== '') return obj[key];
  }
  return undefined;
}

function normalizeAxisRaw(axis, rawValue) {
  let value = rawValue;
  if (axis === 'geography' && value && typeof value === 'object') value = value.scope ?? value.value ?? value.geography;
  if (typeof value !== 'string') return { value: 'UNKNOWN', aliased: false, rawValue };
  const upper = value.trim().toUpperCase();
  if (CONTEXT_AXIS_VALUES[axis].includes(upper)) return { value: upper, aliased: false, rawValue };
  const aliased = VALUE_ALIASES[axis]?.[upper];
  if (aliased && CONTEXT_AXIS_VALUES[axis].includes(aliased)) return { value: aliased, aliased: true, rawValue };
  return { value: 'UNKNOWN', aliased: false, rawValue };
}

export function normalizeLegacyBusinessContext(legacyContext = {}) {
  const sourceAxes = legacyContext?.axes && typeof legacyContext.axes === 'object' ? legacyContext.axes : {};
  const axes = {};
  const axisProvenance = {};
  const warnings = [];

  for (const axis of CANONICAL_CONTEXT_AXES) {
    const rawValue = firstDefined(sourceAxes, LEGACY_AXIS_KEYS[axis]) ?? firstDefined(legacyContext, LEGACY_AXIS_KEYS[axis]);
    const normalized = normalizeAxisRaw(axis, rawValue);
    axes[axis] = normalized.value;
    axisProvenance[axis] = {
      sourceType: 'MIGRATED_LEGACY',
      evidenceIds: [],
      confidence: null,
      confirmed: false,
    };
    if (normalized.aliased) {
      warnings.push({ code: 'LEGACY_AXIS_ALIAS', axis, from: normalized.rawValue, to: normalized.value });
    } else if (normalized.value === 'UNKNOWN' && rawValue !== undefined && String(rawValue).toUpperCase() !== 'UNKNOWN') {
      warnings.push({ code: 'UNMAPPED_AXIS_VALUE', axis, value: clone(rawValue) });
    }
  }

  return {
    context: {
      schemaVersion: '3.0.0',
      businessTypeId: legacyContext.taxonomyId || legacyContext.businessTypeId || legacyContext.business_type_id || null,
      industryId: legacyContext.industryId || legacyContext.industry_id || null,
      primaryArchetype: legacyContext.primaryArchetype || legacyContext.archetype || legacyContext.primary_archetype || null,
      axes,
      activeOverlays: [...new Set(Array.isArray(legacyContext.activeOverlays)
        ? legacyContext.activeOverlays
        : Array.isArray(legacyContext.active_overlays) ? legacyContext.active_overlays : [])],
      axisProvenance,
    },
    warnings,
  };
}

function createLegacyRecord(state, kind, path, value, mappedTo = null) {
  const id = makeStableId('LGC', { kind, path, value });
  state.ledgers.legacyRecords[id] = {
    id,
    kind,
    path,
    readOnly: true,
    mappedTo,
    value: clone(value),
  };
  return id;
}

function registerEvidence(state, legacyIdMap, sourceKind, record, index) {
  const legacyId = record?.id || record?.answerId || `${sourceKind}-${index + 1}`;
  const phase = Number(record?.phase);
  const canonicalId = makeNodeId(NODE_TYPES.EVIDENCE, {
    sourceKind,
    legacyId,
    questionId: record?.questionId || null,
    revision: record?.revision || 0,
  });

  state.ledgers.evidence[canonicalId] = {
    id: canonicalId,
    legacyId,
    sourceKind,
    phase: Number.isInteger(phase) && phase >= 1 && phase <= 8 ? phase : null,
    questionId: record?.questionId || null,
    field: record?.field || null,
    statement: String(record?.statement || record?.text || record?.assumption || record?.reason || ''),
    evidenceKind: record?.kind || sourceKind,
    source: record?.source || 'MIGRATED_LEGACY',
    status: record?.status || 'ACTIVE',
    structuredData: clone(record?.structuredData ?? null),
    raw: clone(record),
  };
  legacyIdMap[`${sourceKind}:${legacyId}`] = canonicalId;
  if (!legacyIdMap[legacyId]) legacyIdMap[legacyId] = canonicalId;

  addGraphNode(state.graph, {
    id: canonicalId,
    type: NODE_TYPES.EVIDENCE,
    stableKey: { sourceKind, legacyId, questionId: record?.questionId || null, revision: record?.revision || 0 },
    status: ENTITY_STATUS.ACTIVE,
    phase: state.ledgers.evidence[canonicalId].phase,
    payload: { ledger: 'evidence', legacyId, sourceKind },
  });
  return canonicalId;
}

function ensurePlaceholderEvidence(state, legacyIdMap, legacyRef, report) {
  if (legacyIdMap[legacyRef]) return legacyIdMap[legacyRef];
  const canonicalId = makeNodeId(NODE_TYPES.EVIDENCE, { missingLegacyRef: legacyRef });
  if (!state.ledgers.evidence[canonicalId]) {
    state.ledgers.evidence[canonicalId] = {
      id: canonicalId,
      legacyId: legacyRef,
      sourceKind: 'MIGRATION_PLACEHOLDER',
      phase: null,
      questionId: null,
      field: null,
      statement: `Legacy evidence reference ${legacyRef} could not be mapped automatically.`,
      evidenceKind: 'UNKNOWN',
      source: 'MIGRATION',
      status: 'NEEDS_REVIEW',
      structuredData: null,
      raw: { legacyRef },
    };
    addGraphNode(state.graph, {
      id: canonicalId,
      type: NODE_TYPES.EVIDENCE,
      stableKey: { missingLegacyRef: legacyRef },
      status: ENTITY_STATUS.NEEDS_REVIEW,
      payload: { ledger: 'evidence', legacyId: legacyRef, sourceKind: 'MIGRATION_PLACEHOLDER' },
    });
    const unknownId = makeStableId('UNK', { missingLegacyRef: legacyRef });
    state.ledgers.unknowns[unknownId] = {
      id: unknownId,
      kind: 'MIGRATION_REFERENCE_GAP',
      statement: `مرجع قدیمی ${legacyRef} نیازمند تطبیق دستی است.`,
      blocking: false,
      legacyRef,
      status: 'OPEN',
    };
    report.warnings.push({ code: 'MISSING_LEGACY_REFERENCE', legacyRef, placeholderId: canonicalId });
  }
  legacyIdMap[legacyRef] = canonicalId;
  return canonicalId;
}

function resolveEvidenceRefs(record) {
  const refs = [
    ...(record?.evidence_refs || []),
    ...(record?.evidenceIds || []),
    ...(record?.evidence_ids || []),
    ...(record?.answerId ? [record.answerId] : []),
  ];
  return [...new Set(refs.filter(Boolean).map(String))];
}

function registerDecision(state, legacyIdMap, record, index, report) {
  const legacyId = record?.id || `DECISION-${index + 1}`;
  const phase = Number(record?.phase);
  const canonicalId = makeNodeId(NODE_TYPES.DECISION, { legacyId, phase: Number.isInteger(phase) ? phase : null });
  const supportingEvidenceIds = resolveEvidenceRefs(record).map(ref => legacyIdMap[ref] || ensurePlaceholderEvidence(state, legacyIdMap, ref, report));

  state.ledgers.decisions[canonicalId] = {
    id: canonicalId,
    legacyId,
    phase: Number.isInteger(phase) && phase >= 1 && phase <= 8 ? phase : null,
    statement: String(record?.decision || record?.statement || ''),
    status: record?.status || 'MIGRATED',
    supportingEvidenceIds,
    raw: clone(record),
  };
  legacyIdMap[`DECISION:${legacyId}`] = canonicalId;
  if (!legacyIdMap[legacyId]) legacyIdMap[legacyId] = canonicalId;

  addGraphNode(state.graph, {
    id: canonicalId,
    type: NODE_TYPES.DECISION,
    stableKey: { legacyId, phase: state.ledgers.decisions[canonicalId].phase },
    status: ENTITY_STATUS.NEEDS_REVIEW,
    phase: state.ledgers.decisions[canonicalId].phase,
    payload: { ledger: 'decisions', legacyId },
  });

  for (const evidenceId of supportingEvidenceIds) {
    addGraphEdge(state.graph, {
      type: EDGE_TYPES.SUPPORTS,
      from: evidenceId,
      to: canonicalId,
      qualifier: 'migrated-evidence',
    });
  }
  return canonicalId;
}

function registerUnknown(state, legacyIdMap, record, index) {
  const legacyId = record?.id || `UNKNOWN-${index + 1}`;
  const id = makeStableId('UNK', { legacyId, phase: record?.phase || null });
  state.ledgers.unknowns[id] = {
    id,
    legacyId,
    phase: Number.isInteger(Number(record?.phase)) ? Number(record.phase) : null,
    statement: String(record?.reason || record?.question || record?.descriptionFa || record?.statement || ''),
    blocking: Boolean(record?.blocking || record?.severity === 'BLOCKING_UNKNOWN'),
    status: record?.status || 'OPEN',
    raw: clone(record),
  };
  legacyIdMap[`UNKNOWN:${legacyId}`] = id;
  return id;
}

function registerContradiction(state, legacyIdMap, record, index) {
  const legacyId = record?.id || `CONTRADICTION-${index + 1}`;
  const phase = Array.isArray(record?.affectedPhases) ? Number(record.affectedPhases[0]) : Number(record?.phase);
  const id = makeNodeId(NODE_TYPES.CONTRADICTION, { legacyId, ruleId: record?.ruleId || null });
  state.ledgers.contradictions[id] = {
    id,
    legacyId,
    ruleId: record?.ruleId || null,
    severity: record?.severity || 'MAJOR',
    status: record?.resolutionStatus || record?.resolution_state || 'UNRESOLVED',
    affectedPhases: clone(record?.affectedPhases || []),
    resolutionTargets: clone(record?.resolutionTargets || {}),
    statementA: record?.statementA || null,
    statementB: record?.statementB || null,
    raw: clone(record),
  };
  legacyIdMap[`CONTRADICTION:${legacyId}`] = id;
  addGraphNode(state.graph, {
    id,
    type: NODE_TYPES.CONTRADICTION,
    stableKey: { legacyId, ruleId: record?.ruleId || null },
    status: ENTITY_STATUS.NEEDS_REVIEW,
    phase: Number.isInteger(phase) && phase >= 1 && phase <= 8 ? phase : null,
    payload: { ledger: 'contradictions', legacyId },
  });
  return id;
}

export function migrateLegacyStateToV3(legacyState, {
  fromSchemaVersion = 2,
  projectId = null,
  migratedAt = null,
} = {}) {
  if (!legacyState || typeof legacyState !== 'object' || Array.isArray(legacyState)) {
    throw new Error('Legacy state must be an object.');
  }

  const contextMigration = normalizeLegacyBusinessContext(legacyState.businessContext || {});
  const stableProjectKey = {
    firstAnswerId: legacyState.answerRecords?.[0]?.id || null,
    taxonomyId: legacyState.businessContext?.taxonomyId || null,
    businessName: legacyState.businessName || legacyState.business_name || null,
    sourceFingerprint: makeStableId('SRC', stableSerialize(legacyState)),
  };
  const state = createCanonicalProjectState({
    projectId,
    projectStableKey: stableProjectKey,
    revision: Number(legacyState.revision) || 0,
    businessContext: contextMigration.context,
    session: {
      currentPhase: Number.isInteger(Number(legacyState.currentPhase)) ? Number(legacyState.currentPhase) : 1,
      currentStepIndex: Number(legacyState.currentStepIndex) || 0,
      reviewRequired: clone(legacyState.reviewRequired || {}),
      phaseStatus: clone(legacyState.phaseStatus || {}),
      navigation: {
        isNavigatingBack: Boolean(legacyState.isNavigatingBack),
        reviewCursor: Number.isInteger(legacyState.reviewCursor) ? legacyState.reviewCursor : null,
      },
    },
  });

  const report = {
    reportId: makeStableId('MIG', { fromSchemaVersion, to: V3_STATE_SCHEMA_VERSION, stableProjectKey }),
    fromSchemaVersion,
    toStateSchemaVersion: V3_STATE_SCHEMA_VERSION,
    migratedAt,
    warnings: [...contextMigration.warnings],
    sourceTopLevelFields: Object.keys(legacyState).sort(),
    mappedTopLevelFields: [],
    preservedLegacyPaths: [],
    droppedPaths: [],
    counts: {
      answerRecords: 0,
      facts: 0,
      assumptions: 0,
      decisions: 0,
      unknowns: 0,
      contradictions: 0,
      placeholders: 0,
    },
  };

  const legacyIdMap = state.migration.legacyIdMap;

  (legacyState.answerRecords || []).forEach((record, index) => {
    registerEvidence(state, legacyIdMap, 'ANSWER', record, index);
    report.counts.answerRecords += 1;
  });
  if ('answerRecords' in legacyState) report.mappedTopLevelFields.push('answerRecords');

  (legacyState.facts || []).forEach((record, index) => {
    if (record?.answerId && legacyIdMap[record.answerId]) {
      createLegacyRecord(state, LEGACY_RECORD_KIND.RUNTIME_FIELD, `facts[${index}]`, record, legacyIdMap[record.answerId]);
    } else {
      registerEvidence(state, legacyIdMap, 'FACT', record, index);
    }
    report.counts.facts += 1;
  });
  if ('facts' in legacyState) report.mappedTopLevelFields.push('facts');

  (legacyState.assumptions || []).forEach((record, index) => {
    if (record?.answerId && legacyIdMap[record.answerId]) {
      createLegacyRecord(state, LEGACY_RECORD_KIND.RUNTIME_FIELD, `assumptions[${index}]`, record, legacyIdMap[record.answerId]);
    } else {
      registerEvidence(state, legacyIdMap, 'ASSUMPTION', record, index);
    }
    report.counts.assumptions += 1;
  });
  if ('assumptions' in legacyState) report.mappedTopLevelFields.push('assumptions');

  (legacyState.decisions || []).forEach((record, index) => {
    registerDecision(state, legacyIdMap, record, index, report);
    report.counts.decisions += 1;
  });
  if ('decisions' in legacyState) report.mappedTopLevelFields.push('decisions');

  (legacyState.unknowns || []).forEach((record, index) => {
    registerUnknown(state, legacyIdMap, record, index);
    report.counts.unknowns += 1;
  });
  if ('unknowns' in legacyState) report.mappedTopLevelFields.push('unknowns');

  (legacyState.contradictions || []).forEach((record, index) => {
    registerContradiction(state, legacyIdMap, record, index);
    report.counts.contradictions += 1;
  });
  if ('contradictions' in legacyState) report.mappedTopLevelFields.push('contradictions');

  // Business context is normalized, while the raw legacy object is retained read-only for audit.
  if ('businessContext' in legacyState) {
    createLegacyRecord(state, LEGACY_RECORD_KIND.BUSINESS_CONTEXT_SNAPSHOT, 'businessContext', legacyState.businessContext);
    report.mappedTopLevelFields.push('businessContext');
    report.preservedLegacyPaths.push('businessContext');
  }

  // phaseData remains available as a read-only migration artifact until Decision Modules own all mappings.
  if ('phaseData' in legacyState) {
    createLegacyRecord(state, LEGACY_RECORD_KIND.PHASE_DATA_SNAPSHOT, 'phaseData', legacyState.phaseData);
    report.mappedTopLevelFields.push('phaseData');
    report.preservedLegacyPaths.push('phaseData');
  }

  const sessionFields = ['revision', 'currentPhase', 'currentStepIndex', 'reviewRequired', 'phaseStatus', 'isNavigatingBack', 'reviewCursor'];
  for (const field of sessionFields) if (field in legacyState) report.mappedTopLevelFields.push(field);

  const preserveRuntimeFields = [
    'completedPhases',
    'aiInsights',
    'dynamicQuestion',
    'dynamicQuestionState',
    'dynamicQuestionsHistory',
  ];
  for (const field of preserveRuntimeFields) {
    if (field in legacyState) {
      createLegacyRecord(state, LEGACY_RECORD_KIND.RUNTIME_FIELD, field, legacyState[field]);
      report.preservedLegacyPaths.push(field);
    }
  }

  const accounted = new Set([...report.mappedTopLevelFields, ...report.preservedLegacyPaths]);
  for (const [field, value] of Object.entries(legacyState)) {
    if (accounted.has(field)) continue;
    createLegacyRecord(state, LEGACY_RECORD_KIND.UNMAPPED_FIELD, field, value);
    report.preservedLegacyPaths.push(field);
    report.warnings.push({ code: 'UNMAPPED_TOP_LEVEL_FIELD_PRESERVED', path: field });
  }

  report.mappedTopLevelFields = [...new Set(report.mappedTopLevelFields)].sort();
  report.preservedLegacyPaths = [...new Set(report.preservedLegacyPaths)].sort();
  report.counts.placeholders = Object.values(state.ledgers.evidence).filter(item => item.sourceKind === 'MIGRATION_PLACEHOLDER').length;

  state.migration.sourceSchemaVersion = fromSchemaVersion;
  state.migration.latestReport = report;
  return { state, report };
}
