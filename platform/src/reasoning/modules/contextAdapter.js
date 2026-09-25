import {
  CANONICAL_CONTEXT_AXES,
  CONTEXT_AXIS_VALUES,
  validateCanonicalBusinessContext,
} from '../context/businessContextContract.js';

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

function normalizeValue(axis, raw) {
  let value = raw;
  if (axis === 'geography' && value && typeof value === 'object') value = value.scope ?? value.value ?? value.geography;
  if (typeof value !== 'string' || !value.trim()) return 'UNKNOWN';
  const upper = value.trim().toUpperCase();
  if (CONTEXT_AXIS_VALUES[axis].includes(upper)) return upper;
  const alias = VALUE_ALIASES[axis]?.[upper];
  return alias && CONTEXT_AXIS_VALUES[axis].includes(alias) ? alias : 'UNKNOWN';
}

export function toCanonicalModuleContext(context = {}) {
  const sourceAxes = context.axes && typeof context.axes === 'object' ? context.axes : {};
  const axes = {};
  for (const axis of CANONICAL_CONTEXT_AXES) {
    const raw = sourceAxes[axis] ?? context[axis] ?? (axis === 'geography' ? context.geographicScope : undefined);
    axes[axis] = normalizeValue(axis, raw);
  }

  const canonical = {
    schemaVersion: '3.0.0',
    businessTypeId: context.businessTypeId || context.taxonomyId || null,
    businessTypeTitleFa: context.businessTypeTitleFa || context.taxonomyTitleFa || null,
    industryId: context.industryId || null,
    industryCode: context.industryCode || null,
    iranianGuildCode: context.iranianGuildCode || null,
    primaryArchetype: context.primaryArchetype || context.archetype || null,
    axes,
    activeOverlays: [...new Set(Array.isArray(context.activeOverlays) ? context.activeOverlays : [])],
    axisProvenance: Object.fromEntries(CANONICAL_CONTEXT_AXES.map(axis => [axis, {
      sourceType: 'RULE_DERIVED',
      evidenceIds: [],
      confidence: context.confidence === 'USER_CONFIRMED' ? 1 : null,
      confirmed: context.confidence === 'USER_CONFIRMED',
    }])),
  };

  const validation = validateCanonicalBusinessContext(canonical);
  if (!validation.valid) throw new Error(`Cannot adapt business context for Decision Modules: ${validation.errors.join('; ')}`);
  return canonical;
}
