const uniqSorted = values => [...new Set((values || []).filter(Boolean))].sort();

export function setDelta(left = [], right = []) {
  const a = new Set(left);
  const b = new Set(right);
  const union = new Set([...a, ...b]);
  if (!union.size) return 0;
  let changed = 0;
  for (const value of union) if (a.has(value) !== b.has(value)) changed += 1;
  return changed / union.size;
}

export function setIntersection(left = [], right = []) {
  const b = new Set(right);
  return uniqSorted(left.filter(value => b.has(value)));
}

export function setOnly(left = [], right = []) {
  const b = new Set(right);
  return uniqSorted(left.filter(value => !b.has(value)));
}

export function summarizeSetDelta(left = [], right = []) {
  return {
    delta: setDelta(left, right),
    shared: setIntersection(left, right),
    leftOnly: setOnly(left, right),
    rightOnly: setOnly(right, left),
  };
}

export function mean(values = []) {
  const finite = values.filter(Number.isFinite);
  return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : 0;
}

export function roundMetric(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(Number(value || 0) * factor) / factor;
}
