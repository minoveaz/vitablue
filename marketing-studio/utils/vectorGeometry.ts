import type {
  EditableVectorGeometry,
  EditableVectorPoint,
  EditableVectorShapeOptions,
} from '../types/vectorGeometry';

const MAX_POINTS = 64;
const MAX_PATH_LENGTH = 20_000;
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

const normalizePoint = (value: unknown): EditableVectorPoint | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const point = value as Partial<EditableVectorPoint>;
  const x = Number(point.x);
  const y = Number(point.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
};

const normalizePoints = (value: unknown): EditableVectorPoint[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const points = value
    .slice(0, MAX_POINTS)
    .map(normalizePoint)
    .filter((point): point is EditableVectorPoint => Boolean(point));
  return points.length >= 2 ? points : undefined;
};

/**
 * SVG path data is deliberately restricted to path commands and numbers.
 * This keeps persisted geometry JSON-only and prevents attributes or markup
 * from being smuggled into the renderer.
 */
const isSafePathData = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.trim().length <= MAX_PATH_LENGTH &&
  /^[Mm]/.test(value.trim()) &&
  /^[MmZzLlHhVvCcSsQqTtAa0-9.,+\-\s]+$/.test(value);

export const isSafeEditableVectorPath = (value: unknown): value is string =>
  isSafePathData(value);

const normalizeOptionalNumber = (
  value: unknown,
  min: number,
  max: number,
  integer = false,
): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  if (!Number.isFinite(number)) return undefined;
  const bounded = clamp(number, min, max);
  return integer ? Math.round(bounded) : bounded;
};

/**
 * Normalizes configurable built-in shape props without dropping unrelated
 * block props. This is used at insert, edit, load, and render boundaries.
 */
export const normalizeGeometricShapeProps = (
  value: Record<string, unknown> | undefined,
): Record<string, unknown> => {
  if (!value) return {};
  const normalized = { ...value };
  const numericFields: Array<[keyof EditableVectorShapeOptions, number, number, boolean?]> = [
    ['sides', 3, 24, true],
    ['points', 3, 24, true],
    ['innerRadius', 10, 48],
    ['borderRadius', 0, 200],
    ['strokeWidth', 0, 64],
    ['ringRadius', 5, 48],
    ['ringThickness', 1, 50],
    ['arcStartAngle', -360, 360],
    ['arcEndAngle', -360, 360],
    ['waveStartY', 0, 100],
    ['waveEndY', 0, 100],
    ['waveAmplitude', 0, 48],
    ['waveCycles', 1, 8, true],
  ];
  numericFields.forEach(([key, min, max, integer]) => {
    if (!(key in normalized)) return;
    const number = normalizeOptionalNumber(normalized[key], min, max, integer);
    if (number === undefined) delete normalized[key];
    else normalized[key] = number;
  });

  if ('waveAnchor' in normalized && normalized.waveAnchor !== 'top' && normalized.waveAnchor !== 'bottom') {
    delete normalized.waveAnchor;
  }
  if ('wavePath' in normalized) {
    const path = isSafePathData(normalized.wavePath) ? normalized.wavePath.trim() : undefined;
    if (path) normalized.wavePath = path;
    else delete normalized.wavePath;
  }
  if ('vectorGeometry' in normalized) {
    const geometry = normalizeEditableVectorGeometry(normalized.vectorGeometry);
    if (geometry) normalized.vectorGeometry = geometry;
    else delete normalized.vectorGeometry;
  }
  return normalized;
};

export const normalizeEditableVectorGeometry = (
  value: unknown,
): EditableVectorGeometry | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const source = value as Partial<EditableVectorGeometry>;
  const points = normalizePoints(source.points);
  const path = isSafePathData(source.path) ? source.path.trim() : undefined;
  const kind = source.kind === 'path' || source.kind === 'bezier'
    ? source.kind
    : path
      ? 'path'
      : points
        ? 'bezier'
        : undefined;
  if (!kind || (kind === 'path' && !path) || (kind === 'bezier' && !points)) return undefined;
  const closed = source.closed !== undefined
    ? Boolean(source.closed)
    : path
      ? /[Zz]\s*$/.test(path)
      : undefined;

  return {
    version: 1,
    kind,
    ...(points ? { points } : {}),
    ...(path ? { path } : {}),
    ...(closed !== undefined ? { closed } : {}),
    ...(source.fillRule === 'evenodd' || source.fillRule === 'nonzero'
      ? { fillRule: source.fillRule }
      : {}),
  };
};

/** Creates a smooth cubic Bézier path from normalized anchor points. */
export const createEditableVectorBezierPath = (
  points: readonly EditableVectorPoint[],
  closed = false,
): string => {
  const normalized = normalizePoints(points) ?? [
    { x: 0, y: 0.5 },
    { x: 1, y: 0.5 },
  ];
  const first = normalized[0];
  let path = `M ${first.x * 100} ${first.y * 100}`;
  for (let index = 1; index < normalized.length; index += 1) {
    const previous = normalized[index - 1];
    const current = normalized[index];
    const distance = (current.x - previous.x) / 2;
    path += ` C ${(previous.x + distance) * 100} ${previous.y * 100}, ${(current.x - distance) * 100} ${
      current.y * 100
    }, ${current.x * 100} ${current.y * 100}`;
  }
  if (closed) path += ' Z';
  return path;
};

export const getEditableVectorPath = (
  geometry: EditableVectorGeometry,
): string => geometry.kind === 'path' && geometry.path
  ? geometry.path
  : createEditableVectorBezierPath(geometry.points ?? [], geometry.closed);

export const createEditableVectorPathGeometry = (
  path: string,
  options: Pick<EditableVectorGeometry, 'closed' | 'fillRule'> = {},
): EditableVectorGeometry | undefined =>
  normalizeEditableVectorGeometry({
    version: 1,
    kind: 'path',
    path,
    ...options,
  });
