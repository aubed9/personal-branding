/**
 * DIGITAL MARKET — Unknowns Manager (Requirement R3)
 * First-Class Typed Unknowns Architecture with Severity, Ownership, and Lifecycle
 */

export const UNKNOWN_SEVERITY = {
  BLOCKING_UNKNOWN: "BLOCKING_UNKNOWN",
  NON_BLOCKING_UNKNOWN: "NON_BLOCKING_UNKNOWN",
  BLOCKING: "BLOCKING_UNKNOWN",
  NON_BLOCKING: "NON_BLOCKING_UNKNOWN"
};

export const UNKNOWN_STATUS = {
  OPEN: "OPEN",
  IN_RESEARCH: "IN_RESEARCH",
  RESOLVED: "RESOLVED",
  ACCEPTED_RISK: "ACCEPTED_RISK"
};

// Map questions to default severity when unknown
export const QUESTION_SEVERITY_MAP = {
  // Phase 1 Foundation: core facts are blocking
  step0_description: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step0_stage: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step0_geography: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step1_primary_goal: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step2_core_offer: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step2_value_hypothesis: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  step0_diagnostic_probing: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  unit_economics: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  pricing_model: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  cash_constraint: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,

  // Phase 2 Research: competitors & customer pains are blocking
  p2_step0_competitors: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p2_step1_customer_pain: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p2_step2_pricing_models: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p2_step3_primary_channel: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p2_step4_golden_opportunity: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,

  // Phase 3 Strategy: positioning & target segment are blocking
  p3_target_segment: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p3_positioning_frame: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p3_strategic_boundary: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p3_brand_promise: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,

  // Phase 4 Identity: archetype is blocking
  p4_archetype: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p4_human_traits: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p4_tone_guardrail: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,

  // Phase 5 Verbal: elevator hook is blocking
  p5_voice_style: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p5_elevator_hook: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p5_forbidden_words: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,

  // Phase 6 Naming: naming territory is blocking
  p6_naming_territory: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p6_tagline_archetype: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,

  // Phase 7 Visual: color palette is blocking
  p7_color_palette: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p7_typography_mood: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p7_logo_direction: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,

  // Phase 8 Activation: lead funnel is blocking
  p8_thought_leadership: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p8_pr_podcast_channels: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN,
  p8_lead_funnel: UNKNOWN_SEVERITY.BLOCKING_UNKNOWN,
  p8_crisis_reputation: UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN
};

export class UnknownsManager {
  static _counter = 0;

  /**
   * Determine whether a question's unknown is blocking
   */
  static determineSeverity(questionId, phase = 1, explicitSeverity = null) {
    if (explicitSeverity) return explicitSeverity;
    if (questionId && QUESTION_SEVERITY_MAP[questionId]) {
      return QUESTION_SEVERITY_MAP[questionId];
    }
    // Default: in early foundation (P1), unknowns default to blocking unless auxiliary
    if (Number(phase) === 1) return UNKNOWN_SEVERITY.BLOCKING_UNKNOWN;
    return UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN;
  }

  /**
   * Create a new 14-field typed Unknown entity
   */
  static createUnknown({
    id = null,
    phase = 1,
    questionId = "unknown_step",
    category = "UNCERTAINTY",
    severity = null,
    blocking = null,
    reason = "",
    hypothesis = "",
    actionItem = "",
    owner = "FOUNDER",
    status = UNKNOWN_STATUS.OPEN,
    source = "USER_INPUT",
    resolution = null,
    resolvedAt = null,
    createdAt = null,
    existingCount = 0
  } = {}) {
    const resolvedSeverity = severity || this.determineSeverity(questionId, phase);
    const isBlocking = (blocking !== null)
      ? Boolean(blocking)
      : (resolvedSeverity === UNKNOWN_SEVERITY.BLOCKING_UNKNOWN);
    const countIndex = Math.max(existingCount > 0 ? (existingCount + 1) : 1, (UnknownsManager._counter || 0) + 1);
    UnknownsManager._counter = countIndex;
    const generatedId = id || `UNK-P${phase}-${String(countIndex).padStart(3, "0")}`;

    return {
      id: generatedId,
      phase: Number(phase),
      questionId: String(questionId),
      category: String(category),
      severity: resolvedSeverity,
      blocking: isBlocking,
      reason: reason || "ثبت به عنوان متغیر مجهول نیازمند سنجش و حقیقت‌یابی",
      hypothesis: hypothesis || `[فرضیه آزمایشی]: داده‌های مربوط به ${questionId} نیازمند آزمون در گام‌های بعدی است.`,
      actionItem: actionItem || "استقرار متدولوژی سنجش یا مصاحبه میدانی برای شفاف‌سازی عدد واقعی",
      owner: owner || "FOUNDER",
      status: status || UNKNOWN_STATUS.OPEN,
      createdAt: createdAt || new Date().toISOString(),
      resolvedAt: resolvedAt || null,
      resolution: resolution || null,
      source: source || "USER_INPUT"
    };
  }

  /**
   * Resolve an unknown by ID
   */
  static resolveUnknown(unknownsList, id, resolution) {
    if (!Array.isArray(unknownsList)) return null;
    const item = unknownsList.find(u => u.id === id);
    if (!item) return null;
    item.status = UNKNOWN_STATUS.RESOLVED;
    item.resolvedAt = new Date().toISOString();
    item.resolution = resolution || "حل‌شده و اعتبارسنجی گردید.";
    return item;
  }

  /**
   * Accept risk for an unknown (allows gate progression despite unknown)
   */
  static acceptRisk(unknownsList, id, justification) {
    if (!Array.isArray(unknownsList)) return null;
    const item = unknownsList.find(u => u.id === id);
    if (!item) return null;
    item.status = UNKNOWN_STATUS.ACCEPTED_RISK;
    item.resolvedAt = new Date().toISOString();
    item.resolution = `ریسک پذیرفته‌شده: ${justification || "پذیرش ریسک با تصمیم بنیان‌گذار"}`;
    return item;
  }

  /**
   * Check if an unknown is actively blocking
   */
  static isBlocking(unknown) {
    if (!unknown) return false;
    if (unknown.severity === UNKNOWN_SEVERITY.NON_BLOCKING_UNKNOWN || unknown.severity === UNKNOWN_SEVERITY.NON_BLOCKING) {
      return false;
    }
    if (unknown.blocking === false && unknown.severity !== UNKNOWN_SEVERITY.BLOCKING_UNKNOWN && unknown.severity !== UNKNOWN_SEVERITY.BLOCKING) {
      return false;
    }
    const isBlockType = unknown.blocking === true || 
                        unknown.severity === UNKNOWN_SEVERITY.BLOCKING_UNKNOWN || 
                        unknown.severity === UNKNOWN_SEVERITY.BLOCKING;
    const isUnresolved = unknown.status !== UNKNOWN_STATUS.RESOLVED && unknown.status !== UNKNOWN_STATUS.ACCEPTED_RISK;
    return isBlockType && isUnresolved;
  }

  /**
   * Get all active unresolved blocking unknowns for a phase (or all phases)
   */
  static getBlockingUnknowns(unknownsList = [], phase = null) {
    if (!Array.isArray(unknownsList)) return [];
    return unknownsList.filter(u => {
      if (phase !== null && Number(u.phase) !== Number(phase)) return false;
      return this.isBlocking(u);
    });
  }

  /**
   * Get all non-blocking unknowns
   */
  static getNonBlockingUnknowns(unknownsList = [], phase = null) {
    if (!Array.isArray(unknownsList)) return [];
    return unknownsList.filter(u => {
      if (phase !== null && Number(u.phase) !== Number(phase)) return false;
      const isBlock = this.isBlocking(u);
      return !isBlock && (u.status === UNKNOWN_STATUS.OPEN || u.status === UNKNOWN_STATUS.IN_RESEARCH);
    });
  }

  /**
   * Get all unknowns for a phase (or all phases)
   */
  static getUnknowns(unknownsList = [], phase = null) {
    if (!Array.isArray(unknownsList)) return [];
    if (phase === null) return [...unknownsList];
    return unknownsList.filter(u => Number(u.phase) === Number(phase));
  }

  /**
   * Update status of an unknown
   */
  static updateUnknownStatus(unknownsList, id, newStatus, resolution = null) {
    if (!Array.isArray(unknownsList)) return null;
    const item = unknownsList.find(u => u.id === id);
    if (!item) return null;
    if (!Object.values(UNKNOWN_STATUS).includes(newStatus)) {
      throw new Error(`وضعیت نامعتبر برای مجهول: ${newStatus}`);
    }
    item.status = newStatus;
    if (newStatus === UNKNOWN_STATUS.RESOLVED || newStatus === UNKNOWN_STATUS.ACCEPTED_RISK) {
      item.resolvedAt = new Date().toISOString();
      if (resolution) item.resolution = resolution;
    }
    return item;
  }
}

