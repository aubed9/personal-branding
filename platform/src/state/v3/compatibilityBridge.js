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
