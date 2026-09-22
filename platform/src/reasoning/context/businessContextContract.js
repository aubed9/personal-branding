export const CANONICAL_CONTEXT_AXES = Object.freeze([
  'customerModel',
  'offerType',
  'channelModel',
  'revenueModel',
  'maturity',
  'scale',
  'salesMotion',
  'geography',
  'branchStructure',
  'founderRole',
  'purchaseCycle',
  'relationshipModel',
  'regulatoryProfile',
  'operationalComplexity',
  'brandArchitecture',
]);

export const CONTEXT_AXIS_VALUES = Object.freeze({
  customerModel: Object.freeze(['B2C', 'B2B', 'B2B2C', 'B2G', 'TWO_SIDED', 'MIXED']),
  offerType: Object.freeze(['PHYSICAL_PRODUCT', 'DIGITAL_PRODUCT', 'SERVICE', 'PLATFORM', 'MARKETPLACE', 'EXPERIENCE', 'MIXED']),
  channelModel: Object.freeze(['PHYSICAL_FIRST', 'ONLINE_FIRST', 'HYBRID', 'OMNICHANNEL', 'DIRECT_SALES_B2B', 'CHANNEL_FIRST', 'MIXED']),
  revenueModel: Object.freeze(['TRANSACTION', 'RECURRING', 'PROJECT_BASED', 'RETAINER', 'COMMISSION', 'WHOLESALE', 'LICENSING', 'USAGE_BASED', 'ADVERTISING', 'FRANCHISE', 'MIXED']),
  maturity: Object.freeze(['IDEA', 'PRE_LAUNCH', 'MVP', 'EARLY_ACTIVE', 'ACTIVE', 'GROWTH', 'SCALEUP', 'MATURE', 'REBRAND', 'TRANSFORMATION']),
  scale: Object.freeze(['SOLO', 'MICRO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE', 'HOLDING']),
  salesMotion: Object.freeze(['SELF_SERVE', 'RETAIL', 'INBOUND', 'INSIDE_SALES', 'FIELD_ENTERPRISE', 'CHANNEL_SALES', 'DISTRIBUTOR', 'TENDER', 'MIXED']),
  geography: Object.freeze(['NEIGHBORHOOD', 'CITY', 'PROVINCE', 'NATIONAL', 'REGIONAL_INTERNATIONAL', 'GLOBAL']),
  branchStructure: Object.freeze(['SINGLE_LOCATION', 'MULTI_BRANCH', 'FRANCHISE', 'DISTRIBUTED', 'REMOTE', 'MIXED']),
  founderRole: Object.freeze(['NOT_PUBLIC', 'SUPPORTING', 'FOUNDER_LED', 'EXECUTIVE_LED', 'PERSONAL_PRIMARY', 'INVESTOR_LED', 'DUAL']),
  purchaseCycle: Object.freeze(['IMPULSE', 'SHORT_DAYS', 'MEDIUM_WEEKS', 'LONG_MONTHS', 'ANNUAL_MULTI_YEAR']),
  relationshipModel: Object.freeze(['TRANSACTIONAL', 'REPEAT_HABITUAL', 'CONTRACTUAL_RETAINER', 'ACCOUNT_MANAGED', 'MEMBERSHIP', 'COMMUNITY', 'MIXED']),
  regulatoryProfile: Object.freeze(['LOW', 'NORMAL', 'HIGH_TRUST', 'REGULATED', 'HIGHLY_REGULATED']),
  operationalComplexity: Object.freeze(['LOW', 'MODERATE', 'HIGH', 'SEVERE']),
  brandArchitecture: Object.freeze(['STANDALONE', 'MASTERBRAND', 'SUB_BRAND', 'ENDORSED', 'HOUSE_OF_BRANDS', 'FOUNDER_NAMED']),
});

export function validateCanonicalBusinessContext(context, { partial = false } = {}) {
  const errors = [];
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return { valid: false, errors: ['Business context must be an object.'] };
  }

  const axes = context.axes;
  if (!axes || typeof axes !== 'object' || Array.isArray(axes)) {
    return { valid: false, errors: ['businessContext.axes must be an object.'] };
  }

  for (const axis of CANONICAL_CONTEXT_AXES) {
    const value = axes[axis];
    if (value === undefined || value === null || value === '') {
      if (!partial) errors.push(`Missing canonical context axis: ${axis}`);
      continue;
    }
    if (!CONTEXT_AXIS_VALUES[axis].includes(value)) {
      errors.push(`Invalid value for ${axis}: ${value}`);
    }
  }

  for (const axis of Object.keys(axes)) {
    if (!CANONICAL_CONTEXT_AXES.includes(axis)) errors.push(`Unknown context axis: ${axis}`);
  }

  if ('primaryArchetype' in axes) errors.push('primaryArchetype is derived metadata and must not be stored as a context axis.');
  return { valid: errors.length === 0, errors };
}
