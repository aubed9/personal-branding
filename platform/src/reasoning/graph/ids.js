import { NODE_TYPES } from './constants.js';

const PREFIX_BY_NODE_TYPE = Object.freeze({
  [NODE_TYPES.EVIDENCE]: 'EVD',
  [NODE_TYPES.CONTEXT_AXIS_VALUE]: 'CTX',
  [NODE_TYPES.DECISION_NODE]: 'DND',
  [NODE_TYPES.CALCULATION]: 'CAL',
  [NODE_TYPES.EXTERNAL_KNOWLEDGE_CLAIM]: 'KCL',
  [NODE_TYPES.PROPOSAL]: 'PRP',
  [NODE_TYPES.DECISION]: 'DEC',
  [NODE_TYPES.RISK]: 'RSK',
  [NODE_TYPES.CONTRADICTION]: 'CTR',
  [NODE_TYPES.OUTPUT_CLAIM]: 'CLM',
  [NODE_TYPES.OUTPUT_SECTION]: 'SEC',
  [NODE_TYPES.GATE]: 'GAT',
});

export function stableSerialize(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value);
  if (Array.isArray(value)) return '[' + value.map(stableSerialize).join(',') + ']';
  if (typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableSerialize(value[key])).join(',') + '}';
  }
  throw new TypeError(`Unsupported stable ID value: ${typeof value}`);
}

function fnv1a64(input) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (const ch of String(input)) {
    hash ^= BigInt(ch.codePointAt(0));
    hash = (hash * prime) & mask;
  }
  return hash.toString(16).padStart(16, '0');
}

function normalizePrefix(prefix) {
  const value = String(prefix || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!/^[A-Z][A-Z0-9]{1,9}$/.test(value)) throw new Error(`Invalid stable ID prefix: ${prefix}`);
  return value;
}

export function makeStableId(prefix, stableKey) {
  if (stableKey === undefined || stableKey === null || stableKey === '') throw new Error('stableKey is required');
  return `${normalizePrefix(prefix)}-${fnv1a64(stableSerialize(stableKey))}`;
}

export function makeNodeId(nodeType, stableKey) {
  const prefix = PREFIX_BY_NODE_TYPE[nodeType];
  if (!prefix) throw new Error(`Unsupported node type for ID generation: ${nodeType}`);
  return makeStableId(prefix, { nodeType, stableKey });
}

export function makeEdgeId(edgeType, from, to, qualifier = null) {
  return makeStableId('EDG', { edgeType, from, to, qualifier });
}
