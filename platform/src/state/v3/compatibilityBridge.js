import { migrateLegacyStateToV3 } from './migration.js';

export function extractLegacyEngineState(engine) {
  if (!engine) throw new Error('Engine is required.');
  return {
    revision: engine.revision || 0,
    answerRecords: engine.answerRecords || [],
    aiInsights: engine.aiInsights || [],
    reviewRequired: engine.reviewRequired || {},
    dynamicQuestion: engine.dynamicQuestion || null,
    dynamicQuestionState: engine.dynamicQuestionState || null,
    dynamicQuestionsHistory: engine.dynamicQuestionsHistory || [],
    isNavigatingBack: Boolean(engine.isNavigatingBack),
    reviewCursor: engine.reviewCursor ?? null,
    currentPhase: engine.currentPhase,
    currentStepIndex: engine.currentStepIndex,
    completedPhases: { ...(engine.completedPhases || {}) },
    phaseData: JSON.parse(JSON.stringify(engine.phaseData || {})),
    phaseStatus: { ...(engine.phaseStatus || {}) },
    facts: [...(engine.facts || [])],
    decisions: [...(engine.decisions || [])],
    assumptions: [...(engine.assumptions || [])],
    unknowns: [...(engine.unknowns || [])],
    contradictions: [...(engine.contradictions || [])],
    businessContext: engine.businessContext ? JSON.parse(JSON.stringify(engine.businessContext)) : null,
  };
}

export function projectLegacyEngineToCanonicalState(engine, options = {}) {
  return migrateLegacyStateToV3(extractLegacyEngineState(engine), options);
}

export function projectCanonicalStateToLegacyReadView(state) {
  if (!state?.ledgers?.legacyRecords) throw new Error('Canonical state with legacyRecords is required.');
  const findRecord = path => Object.values(state.ledgers.legacyRecords).find(record => record.path === path);
  const phaseData = findRecord('phaseData')?.value || {};
  const completedPhases = findRecord('completedPhases')?.value || {};
  return Object.freeze({
    readOnly: true,
    currentPhase: state.session?.currentPhase || 1,
    currentStepIndex: state.session?.currentStepIndex || 0,
    reviewRequired: state.session?.reviewRequired || {},
    phaseStatus: state.session?.phaseStatus || {},
    phaseData,
    completedPhases,
  });
}


function legacyRecordEntries(state, predicate) {
  return Object.values(state?.ledgers?.legacyRecords || {})
    .filter(predicate)
    .sort((a, b) => String(a.path || '').localeCompare(String(b.path || '')));
}

function legacyRecordValue(state, path, fallback = null) {
  return legacyRecordEntries(state, record => record.path === path)[0]?.value ?? fallback;
}

export function projectCanonicalStateToLegacyEngineState(state) {
  if (!state?.ledgers) throw new Error('Canonical state with ledgers is required.');

  const answerRecords = Object.values(state.ledgers.evidence || {})
    .filter(item => item.sourceKind === 'ANSWER' && item.raw && typeof item.raw === 'object')
    .map(item => JSON.parse(JSON.stringify(item.raw)))
    .sort((a, b) => (Number(a.revision) || 0) - (Number(b.revision) || 0) || String(a.id || '').localeCompare(String(b.id || '')));

  const runtimeArray = prefix => legacyRecordEntries(
    state,
    record => String(record.path || '').startsWith(`${prefix}[`)
  ).map(record => JSON.parse(JSON.stringify(record.value)));

  const facts = runtimeArray('facts');
  const assumptions = runtimeArray('assumptions');
  const decisions = Object.values(state.ledgers.decisions || {})
    .map(item => item.raw)
    .filter(Boolean)
    .map(value => JSON.parse(JSON.stringify(value)));
  const unknowns = Object.values(state.ledgers.unknowns || {})
    .map(item => item.raw)
    .filter(Boolean)
    .map(value => JSON.parse(JSON.stringify(value)));
  const contradictions = Object.values(state.ledgers.contradictions || {})
    .map(item => item.raw)
    .filter(Boolean)
    .map(value => JSON.parse(JSON.stringify(value)));

  const legacyContext = legacyRecordValue(state, 'businessContext', null);
  const phaseData = legacyRecordValue(state, 'phaseData', {});
  const completedPhases = legacyRecordValue(state, 'completedPhases', {});
  const aiInsights = legacyRecordValue(state, 'aiInsights', []);
  const dynamicQuestion = legacyRecordValue(state, 'dynamicQuestion', null);
  const dynamicQuestionState = legacyRecordValue(state, 'dynamicQuestionState', null);
  const dynamicQuestionsHistory = legacyRecordValue(state, 'dynamicQuestionsHistory', []);

  return {
    revision: Number(state.revision) || 0,
    answerRecords,
    aiInsights,
    reviewRequired: JSON.parse(JSON.stringify(state.session?.reviewRequired || {})),
    dynamicQuestion,
    dynamicQuestionState,
    dynamicQuestionsHistory,
    isNavigatingBack: Boolean(state.session?.navigation?.isNavigatingBack),
    reviewCursor: Number.isInteger(state.session?.navigation?.reviewCursor)
      ? state.session.navigation.reviewCursor
      : null,
    currentPhase: Number(state.session?.currentPhase) || 1,
    currentStepIndex: Number(state.session?.currentStepIndex) || 0,
    completedPhases: JSON.parse(JSON.stringify(completedPhases || {})),
    phaseData: JSON.parse(JSON.stringify(phaseData || {})),
    phaseStatus: JSON.parse(JSON.stringify(state.session?.phaseStatus || {})),
    facts,
    decisions,
    assumptions,
    unknowns,
    contradictions,
    businessContext: legacyContext
      ? JSON.parse(JSON.stringify(legacyContext))
      : JSON.parse(JSON.stringify(state.businessContext || null)),
  };
}
