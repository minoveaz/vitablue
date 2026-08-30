/**
 * Renderer-neutral vector geometry.
 *
 * Bounds and points are normalized to the unit square. Stroke widths and
 * radii are intentionally expressed in pixels unless their `units` field says
 * `normalized`; this prevents a renderer from guessing how to scale them.
 */
export type NormalizedNumber = number;
export const VECTOR_GEOMETRY_SCHEMA_VERSION = 1 as const;
export type VectorGeometrySchemaVersion = typeof VECTOR_GEOMETRY_SCHEMA_VERSION;

export interface VectorPoint {
  x: NormalizedNumber;
  y: NormalizedNumber;
}

export type BezierHandle = VectorPoint;

export interface BezierPoint extends VectorPoint {
  inHandle?: BezierHandle;
  outHandle?: BezierHandle;
}

export type VectorStrokeUnits = 'px' | 'normalized';
export type VectorRadiusUnits = 'px' | 'normalized';

export interface VectorStroke {
  width: number;
  units: VectorStrokeUnits;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'miter' | 'round' | 'bevel';
  dash?: number[];
}

export type ShapePrimitive = 'rectangle' | 'ellipse' | 'polygon' | 'star';

export interface ShapeGeometry {
  kind: 'shape';
  shape: ShapePrimitive;
  closed: true;
  radius?: number;
  radiusUnits?: VectorRadiusUnits;
  sides?: number;
  points?: number;
  innerRadius?: number;
  innerRadiusUnits?: VectorRadiusUnits;
  stroke?: VectorStroke;
}

export type PathKind = 'line' | 'polyline' | 'bezier' | 'svg' | 'blob' | 'wave' | 'brace';

export type PathCommand =
  | { command: 'M'; point: VectorPoint }
  | { command: 'L'; point: VectorPoint }
  | { command: 'C'; points: [VectorPoint, VectorPoint, VectorPoint] }
  | { command: 'Q'; points: [VectorPoint, VectorPoint] }
  | { command: 'A'; radii: { x: number; y: number }; rotation: number; largeArc: boolean; sweep: boolean; point: VectorPoint }
  | { command: 'Z' };

export interface PathGeometry {
  kind: 'path';
  pathKind: PathKind;
  commands: PathCommand[];
  closed: boolean;
  points?: BezierPoint[];
  fillRule?: 'nonzero' | 'evenodd';
  stroke?: VectorStroke;
}

export type ArrowheadStyle = 'none' | 'triangle' | 'open' | 'circle' | 'bar';

export interface ArrowTip {
  style: ArrowheadStyle;
  size?: number;
  sizeUnits?: VectorRadiusUnits;
}

export interface ArrowGeometry {
  kind: 'arrow';
  start: VectorPoint;
  end: VectorPoint;
  head: ArrowTip;
  tail: ArrowTip;
  shaft: PathGeometry;
  stroke?: VectorStroke;
}

export type ConnectorRoute = 'straight' | 'elbow' | 'curved';
export type ConnectorSide = 'top' | 'right' | 'bottom' | 'left' | 'center' | 'free';

export interface ConnectorAnchor {
  point: VectorPoint;
  nodeId?: string;
  side?: ConnectorSide;
  offset?: number;
}

export interface ConnectorGeometry {
  kind: 'connector';
  route: ConnectorRoute;
  startAnchor: ConnectorAnchor;
  endAnchor: ConnectorAnchor;
  commands: PathCommand[];
  closed: false;
  head?: ArrowTip;
  tail?: ArrowTip;
  stroke?: VectorStroke;
}

export type VectorGeometry = ShapeGeometry | PathGeometry | ArrowGeometry | ConnectorGeometry;

export class VectorGeometryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VectorGeometryError';
  }
}

export const isFiniteUnit = (value: number): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;

const point = (value: unknown, path: string): VectorPoint => {
  if (!value || typeof value !== 'object') throw new VectorGeometryError(`${path} must be a point.`);
  const candidate = value as { x?: unknown; y?: unknown };
  if (typeof candidate.x !== 'number' || !isFiniteUnit(candidate.x)
    || typeof candidate.y !== 'number' || !isFiniteUnit(candidate.y)) {
    throw new VectorGeometryError(`${path} must contain finite normalized x/y values.`);
  }
  return { x: candidate.x, y: candidate.y };
};

const numberInRange = (value: unknown, min: number, max: number, path: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new VectorGeometryError(`${path} must be finite and between ${min} and ${max}.`);
  }
  return value;
};

const normalizeCommand = (value: unknown, index: number): PathCommand => {
  if (!value || typeof value !== 'object') throw new VectorGeometryError(`commands[${index}] is invalid.`);
  const source = value as Record<string, unknown>;
  const command = source.command;
  if (command === 'Z') {
    if (Object.keys(source).some((key) => key !== 'command')) throw new VectorGeometryError(`commands[${index}] has unknown fields.`);
    return { command: 'Z' };
  }
  if (command === 'M' || command === 'L') {
    if (Object.keys(source).some((key) => !['command', 'point'].includes(key))) throw new VectorGeometryError(`commands[${index}] has unknown fields.`);
    return { command, point: point(source.point, `commands[${index}].point`) };
  }
  if (command === 'C' || command === 'Q') {
    if (Object.keys(source).some((key) => !['command', 'points'].includes(key))) throw new VectorGeometryError(`commands[${index}] has unknown fields.`);
    if (!Array.isArray(source.points) || source.points.length !== (command === 'C' ? 3 : 2)) {
      throw new VectorGeometryError(`commands[${index}].points has the wrong length.`);
    }
    return { command, points: source.points.map((item, itemIndex) => point(item, `commands[${index}].points[${itemIndex}]`)) as [VectorPoint, VectorPoint, VectorPoint] & [VectorPoint, VectorPoint] };
  }
  if (command === 'A') {
    if (Object.keys(source).some((key) => !['command', 'radii', 'rotation', 'largeArc', 'sweep', 'point'].includes(key))) throw new VectorGeometryError(`commands[${index}] has unknown fields.`);
    const radii = source.radii;
    if (!radii || typeof radii !== 'object') throw new VectorGeometryError(`commands[${index}].radii is required.`);
    const radius = radii as { x?: unknown; y?: unknown };
    return {
      command,
      radii: {
        x: numberInRange(radius.x, 0, 1, `commands[${index}].radii.x`),
        y: numberInRange(radius.y, 0, 1, `commands[${index}].radii.y`),
      },
      rotation: numberInRange(source.rotation, -360, 360, `commands[${index}].rotation`),
      largeArc: typeof source.largeArc === 'boolean' ? source.largeArc : (() => { throw new VectorGeometryError(`commands[${index}].largeArc must be boolean.`); })(),
      sweep: typeof source.sweep === 'boolean' ? source.sweep : (() => { throw new VectorGeometryError(`commands[${index}].sweep must be boolean.`); })(),
      point: point(source.point, `commands[${index}].point`),
    };
  }
  throw new VectorGeometryError(`commands[${index}] uses a forbidden SVG command.`);
};

const normalizeStroke = (value: unknown, path: string): VectorStroke | undefined => {
  if (value === undefined) return undefined;
  if (!value || typeof value !== 'object') throw new VectorGeometryError(`${path} must be an object.`);
  const source = value as Record<string, unknown>;
  const allowed = new Set(['width', 'units', 'lineCap', 'lineJoin', 'dash']);
  if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError(`${path} has unknown fields.`);
  const units = source.units === 'px' || source.units === 'normalized' ? source.units : undefined;
  if (!units) throw new VectorGeometryError(`${path}.units must be px or normalized.`);
  const result: VectorStroke = { width: numberInRange(source.width, 0, units === 'normalized' ? 1 : 1000, `${path}.width`), units };
  if (source.lineCap !== undefined) {
    if (!['butt', 'round', 'square'].includes(String(source.lineCap))) throw new VectorGeometryError(`${path}.lineCap is invalid.`);
    result.lineCap = source.lineCap as VectorStroke['lineCap'];
  }
  if (source.lineJoin !== undefined) {
    if (!['miter', 'round', 'bevel'].includes(String(source.lineJoin))) throw new VectorGeometryError(`${path}.lineJoin is invalid.`);
    result.lineJoin = source.lineJoin as VectorStroke['lineJoin'];
  }
  if (source.dash !== undefined) {
    if (!Array.isArray(source.dash) || source.dash.some((item) => typeof item !== 'number' || !Number.isFinite(item) || item < 0)) {
      throw new VectorGeometryError(`${path}.dash must contain finite non-negative numbers.`);
    }
    result.dash = [...source.dash];
  }
  return result;
};

const normalizeTip = (value: unknown, path: string): ArrowTip => {
  if (!value || typeof value !== 'object') throw new VectorGeometryError(`${path} is required.`);
  const source = value as Record<string, unknown>;
  const allowed = new Set(['style', 'size', 'sizeUnits']);
  if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError(`${path} has unknown fields.`);
  if (!['none', 'triangle', 'open', 'circle', 'bar'].includes(String(source.style))) {
    throw new VectorGeometryError(`${path}.style is invalid.`);
  }
  const result: ArrowTip = { style: source.style as ArrowheadStyle };
  if (source.size !== undefined) result.size = numberInRange(source.size, 0, 1000, `${path}.size`);
  if (source.sizeUnits !== undefined) {
    if (source.sizeUnits !== 'px' && source.sizeUnits !== 'normalized') throw new VectorGeometryError(`${path}.sizeUnits is invalid.`);
    result.sizeUnits = source.sizeUnits;
  }
  return result;
};

export function normalizeVectorGeometry(value: unknown): VectorGeometry {
  if (!value || typeof value !== 'object') throw new VectorGeometryError('Vector geometry must be an object.');
  const source = value as Record<string, unknown>;
  if (source.kind === 'shape') {
    const allowed = new Set(['kind', 'shape', 'closed', 'radius', 'radiusUnits', 'sides', 'points', 'innerRadius', 'innerRadiusUnits', 'stroke']);
    if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError('Shape geometry contains unknown fields.');
    if (source.closed !== true) throw new VectorGeometryError('Shape geometry must be closed.');
    if (!['rectangle', 'ellipse', 'polygon', 'star'].includes(String(source.shape))) throw new VectorGeometryError('Unknown shape primitive.');
    const result: ShapeGeometry = { kind: 'shape', shape: source.shape as ShapePrimitive, closed: true };
    for (const [key, min, max] of [['radius', 0, 1000], ['innerRadius', 0, 1000]] as const) {
      if (source[key] !== undefined) (result as unknown as Record<string, unknown>)[key] = numberInRange(source[key], min, max, key);
    }
    if (source.radiusUnits !== undefined) {
      if (source.radiusUnits !== 'px' && source.radiusUnits !== 'normalized') throw new VectorGeometryError('radiusUnits is invalid.');
      if (source.radiusUnits === 'normalized' && result.radius !== undefined && result.radius > 1) throw new VectorGeometryError('Normalized radius cannot exceed 1.');
      result.radiusUnits = source.radiusUnits;
    }
    if (source.innerRadiusUnits !== undefined) {
      if (source.innerRadiusUnits !== 'px' && source.innerRadiusUnits !== 'normalized') throw new VectorGeometryError('innerRadiusUnits is invalid.');
      if (source.innerRadiusUnits === 'normalized' && result.innerRadius !== undefined && result.innerRadius > 1) throw new VectorGeometryError('Normalized inner radius cannot exceed 1.');
      result.innerRadiusUnits = source.innerRadiusUnits;
    }
    if (source.sides !== undefined) result.sides = numberInRange(source.sides, 3, 64, 'sides');
    if (source.points !== undefined) result.points = numberInRange(source.points, 3, 64, 'points');
    if (source.stroke !== undefined) result.stroke = normalizeStroke(source.stroke, 'stroke');
    return result;
  }
  if (source.kind === 'path') {
    const allowed = new Set(['kind', 'pathKind', 'commands', 'closed', 'points', 'fillRule', 'stroke']);
    if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError('Path geometry contains unknown fields.');
    if (!Array.isArray(source.commands) || source.commands.length === 0) throw new VectorGeometryError('Path commands are required.');
    const commands = source.commands.map(normalizeCommand);
    if (typeof source.closed !== 'boolean') throw new VectorGeometryError('Path closed flag is required.');
    const closed = source.closed;
    if (closed !== commands.some((command) => command.command === 'Z')) throw new VectorGeometryError('Path closed flag must match its close command.');
    if (commands[0]?.command !== 'M') throw new VectorGeometryError('A path must start with M.');
    if (source.fillRule !== undefined && source.fillRule !== 'nonzero' && source.fillRule !== 'evenodd') throw new VectorGeometryError('fillRule is invalid.');
    const bezierPoints = source.points === undefined
      ? undefined
      : (() => {
        if (!Array.isArray(source.points) || source.points.length < 2 || source.points.length > 4096) {
          throw new VectorGeometryError('Path points must contain between 2 and 4096 points.');
        }
        return source.points.map((item, index) => {
          if (!item || typeof item !== 'object') throw new VectorGeometryError(`points[${index}] is invalid.`);
          const candidate = item as Record<string, unknown>;
          return {
            ...point(candidate, `points[${index}]`),
            ...(candidate.inHandle === undefined ? {} : { inHandle: point(candidate.inHandle, `points[${index}].inHandle`) }),
            ...(candidate.outHandle === undefined ? {} : { outHandle: point(candidate.outHandle, `points[${index}].outHandle`) }),
          };
        });
      })();
    if (!['line', 'polyline', 'bezier', 'svg', 'blob', 'wave', 'brace'].includes(String(source.pathKind))) {
      throw new VectorGeometryError('pathKind is invalid.');
    }
    const result: PathGeometry = {
      kind: 'path',
      pathKind: source.pathKind as PathKind,
      commands,
      closed,
      ...(bezierPoints === undefined ? {} : { points: bezierPoints }),
      ...(source.fillRule === undefined ? {} : { fillRule: source.fillRule as PathGeometry['fillRule'] }),
      ...(source.stroke === undefined ? {} : { stroke: normalizeStroke(source.stroke, 'stroke') }),
    };
    return result;
  }
  if (source.kind === 'arrow') {
    const allowed = new Set(['kind', 'start', 'end', 'head', 'tail', 'shaft', 'stroke']);
    if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError('Arrow geometry contains unknown fields.');
    const shaft = normalizeVectorGeometry(source.shaft);
    if (shaft.kind !== 'path' || shaft.closed) throw new VectorGeometryError('An arrow shaft must be an open path.');
    return {
      kind: 'arrow',
      start: point(source.start, 'start'),
      end: point(source.end, 'end'),
      head: normalizeTip(source.head, 'head'),
      tail: normalizeTip(source.tail, 'tail'),
      shaft,
      ...(source.stroke === undefined ? {} : { stroke: normalizeStroke(source.stroke, 'stroke') }),
    };
  }
  if (source.kind === 'connector') {
    const allowed = new Set(['kind', 'route', 'startAnchor', 'endAnchor', 'commands', 'closed', 'head', 'tail', 'stroke']);
    if (Object.keys(source).some((key) => !allowed.has(key))) throw new VectorGeometryError('Connector geometry contains unknown fields.');
    if (!Array.isArray(source.commands) || source.commands.length === 0) throw new VectorGeometryError('Connector commands are required.');
    const commands = source.commands.map(normalizeCommand);
    if (source.closed !== false) throw new VectorGeometryError('Connectors must be open.');
    if (commands[0]?.command !== 'M' || commands.some((command) => command.command === 'Z')) throw new VectorGeometryError('Connectors must be open paths starting with M.');
    const anchor = (value: unknown, path: string): ConnectorAnchor => {
      if (!value || typeof value !== 'object') throw new VectorGeometryError(`${path} is required.`);
      const candidate = value as Record<string, unknown>;
      const allowed = new Set(['point', 'nodeId', 'side', 'offset']);
      if (Object.keys(candidate).some((key) => !allowed.has(key))) throw new VectorGeometryError(`${path} has unknown fields.`);
      return {
        point: point(candidate.point, `${path}.point`),
        ...(typeof candidate.nodeId === 'string' && candidate.nodeId.length > 0 ? { nodeId: candidate.nodeId } : {}),
        ...(candidate.side === undefined ? {} : (() => {
          if (!['top', 'right', 'bottom', 'left', 'center', 'free'].includes(String(candidate.side))) throw new VectorGeometryError(`${path}.side is invalid.`);
          return { side: candidate.side as ConnectorSide };
        })()),
        ...(candidate.offset === undefined ? {} : { offset: numberInRange(candidate.offset, 0, 1, `${path}.offset`) }),
      };
    };
    if (!['straight', 'elbow', 'curved'].includes(String(source.route))) throw new VectorGeometryError('connector route is invalid.');
    return {
      kind: 'connector',
      route: source.route as ConnectorRoute,
      startAnchor: anchor(source.startAnchor, 'startAnchor'),
      endAnchor: anchor(source.endAnchor, 'endAnchor'),
      commands,
      closed: false,
      ...(source.head === undefined ? {} : { head: normalizeTip(source.head, 'head') }),
      ...(source.tail === undefined ? {} : { tail: normalizeTip(source.tail, 'tail') }),
      ...(source.stroke === undefined ? {} : { stroke: normalizeStroke(source.stroke, 'stroke') }),
    };
  }
  throw new VectorGeometryError('Unknown vector geometry kind.');
}

export const serializeVectorGeometry = (geometry: VectorGeometry): string =>
  JSON.stringify(normalizeVectorGeometry(geometry));

export const deserializeVectorGeometry = (payload: string): VectorGeometry => {
  let value: unknown;
  try {
    value = JSON.parse(payload) as unknown;
  } catch {
    throw new VectorGeometryError('Vector geometry JSON is invalid.');
  }
  return normalizeVectorGeometry(value);
};
