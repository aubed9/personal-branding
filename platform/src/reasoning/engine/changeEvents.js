import { makeStableId, stableSerialize } from '../graph/ids.js';

export const CHANGE_EVENT_TYPES = Object.freeze({
  ANSWER_CHANGED: 'ANSWER_CHANGED',
  CONTEXT_AXIS_CHANGED: 'CONTEXT_AXIS_CHANGED',
  SOURCE_STATUS_CHANGED: 'SOURCE_STATUS_CHANGED',
  CONTRADICTION_CHANGED: 'CONTRADICTION_CHANGED',
});

export function createChangeEvent({
  type,
  projectId = 'RUNTIME',
  revision,
  changedNodeIds = [],
  changedEntityIds = [],
  before = null,
  after = null,
  metadata = {},
  occurredAt = null,
} = {}) {
  if (!Object.values(CHANGE_EVENT_TYPES).includes(type)) throw new Error(`Invalid change event type: ${type}`);
  if (!Number.isInteger(Number(revision)) || Number(revision) < 0) throw new Error('Change event revision must be a non-negative integer.');

  const nodeIds = [...new Set(changedNodeIds.filter(Boolean))].sort();
  const entityIds = [...new Set(changedEntityIds.filter(Boolean))].sort();
  if (nodeIds.length === 0 && entityIds.length === 0) throw new Error('Change event requires at least one changed node/entity.');

  const id = makeStableId('EVT', {
    type,
    projectId,
    revision: Number(revision),
    changedNodeIds: nodeIds,
    changedEntityIds: entityIds,
    before,
    after,
    metadata,
  });

  return {
    id,
    type,
    projectId,
    revision: Number(revision),
    changedNodeIds: nodeIds,
    changedEntityIds: entityIds,
    before,
    after,
    metadata,
    occurredAt,
  };
}

export function validateChangeEvent(event) {
  const errors = [];
  if (!event || typeof event !== 'object') return { valid: false, errors: ['Change event must be an object.'] };
  if (!Object.values(CHANGE_EVENT_TYPES).includes(event.type)) errors.push(`Invalid type: ${event.type}`);
  if (!event.id) errors.push('id is required');
  if (!Number.isInteger(event.revision) || event.revision < 0) errors.push('revision must be non-negative integer');
  if ((!Array.isArray(event.changedNodeIds) || event.changedNodeIds.length === 0) &&
      (!Array.isArray(event.changedEntityIds) || event.changedEntityIds.length === 0)) {
    errors.push('at least one changed node/entity is required');
  }
  return { valid: errors.length === 0, errors };
}

export function sameChangePayload(a, b) {
  return stableSerialize(a) === stableSerialize(b);
}
