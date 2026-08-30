import type {
  PathCommand,
  PathGeometry,
  ShapeGeometry,
  VectorGeometry,
  VectorPoint,
} from '../vectorGeometry';
import { normalizeVectorGeometry } from '../vectorGeometry';

const TOKEN = /([AaCcHhLlMmQqSsTtVvZz])|([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)/iy;

/** Parse the deliberately restricted SVG subset used by Image Studio. */
export const parseLegacySvgPath = (value: string): PathCommand[] => {
  const tokens: string[] = [];
  let tokenCursor = 0;
  while (tokenCursor < value.length) {
    if (/[,\s]/.test(value[tokenCursor]!)) {
      tokenCursor += 1;
      continue;
    }
    TOKEN.lastIndex = tokenCursor;
    const match = TOKEN.exec(value);
    if (!match || match.index !== tokenCursor) throw new Error('SVG path contains an invalid token.');
    tokens.push(match[1] ?? match[2]!);
    tokenCursor = TOKEN.lastIndex;
  }
  if (tokens.length === 0) throw new Error('SVG path is empty.');
  let cursor = 0;
  let command = '';
  let current: VectorPoint = { x: 0, y: 0 };
  let first: VectorPoint | undefined;
  const output: PathCommand[] = [];
  const nextNumber = (): number => {
    const token = tokens[cursor++];
    if (!token || !Number.isFinite(Number(token))) throw new Error('SVG path contains an incomplete command.');
    return Number(token);
  };
  const unitPoint = (x: number, y: number): VectorPoint => ({ x: x / 100, y: y / 100 });
  while (cursor < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[cursor] ?? '')) command = tokens[cursor++]!;
    if (!command) throw new Error('SVG path command is missing.');
    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();
    if (upper === 'Z') {
      output.push({ command: 'Z' });
      if (first) current = first;
      command = '';
      continue;
    }
    const xValue = (): number => nextNumber();
    const absolutePoint = (x: number, y: number): VectorPoint => {
      const next = unitPoint(relative ? current.x * 100 + x : x, relative ? current.y * 100 + y : y);
      current = next;
      return next;
    };
    if (upper === 'M' || upper === 'L' || upper === 'T') {
      const next = absolutePoint(xValue(), nextNumber());
      if (upper === 'M') {
        output.push({ command: 'M', point: next });
        first = next;
        command = relative ? 'l' : 'L';
      } else {
        output.push({ command: 'L', point: next });
      }
      continue;
    }
    if (upper === 'H') {
      const x = xValue();
      output.push({ command: 'L', point: absolutePoint(x, relative ? 0 : current.y * 100) });
      continue;
    }
    if (upper === 'V') {
      const y = xValue();
      output.push({ command: 'L', point: absolutePoint(relative ? 0 : current.x * 100, y) });
      continue;
    }
    if (upper === 'C') {
      const p1 = absolutePoint(nextNumber(), nextNumber());
      const p2 = absolutePoint(nextNumber(), nextNumber());
      const end = absolutePoint(nextNumber(), nextNumber());
      output.push({ command: 'C', points: [p1, p2, end] });
      continue;
    }
    if (upper === 'S' || upper === 'Q') {
      const p1 = absolutePoint(nextNumber(), nextNumber());
      const end = absolutePoint(nextNumber(), nextNumber());
      output.push({ command: 'Q', points: [p1, end] });
      continue;
    }
    if (upper === 'A') {
      const rx = nextNumber() / 100;
      const ry = nextNumber() / 100;
      const rotation = nextNumber();
      const largeArc = nextNumber() !== 0;
      const sweep = nextNumber() !== 0;
      const end = absolutePoint(nextNumber(), nextNumber());
      output.push({ command: 'A', radii: { x: rx, y: ry }, rotation, largeArc, sweep, point: end });
      continue;
    }
    throw new Error(`SVG command ${command} is not allowed.`);
  }
  return output;
};

const pathFromCommands = (
  pathKind: PathGeometry['pathKind'],
  commands: PathCommand[],
  closed: boolean,
): PathGeometry => normalizeVectorGeometry({ kind: 'path', pathKind, commands, closed }) as PathGeometry;

const pathFromLegacyGeometry = (value: Record<string, unknown>): PathGeometry | undefined => {
  const sourcePath = typeof value.path === 'string' ? value.path : typeof value.wavePath === 'string' ? value.wavePath : undefined;
  if (sourcePath) {
    const closed = value.closed === true || /[Zz]\s*$/.test(sourcePath.trim());
    const pathKind = value.pathKind === 'blob' || value.pathKind === 'wave' || value.pathKind === 'brace'
      ? value.pathKind
      : 'svg';
    return pathFromCommands(pathKind, parseLegacySvgPath(sourcePath), closed);
  }
  const points = value.points;
  if (Array.isArray(points) && points.length >= 2) {
    const normalized = points.map((item) => {
      if (!item || typeof item !== 'object') throw new Error('Legacy vector point is invalid.');
      const candidate = item as { x?: unknown; y?: unknown };
      if (typeof candidate.x !== 'number' || typeof candidate.y !== 'number') throw new Error('Legacy vector point is invalid.');
      return { x: candidate.x, y: candidate.y };
    });
    const commands: PathCommand[] = normalized.map((item, index) =>
      index === 0 ? { command: 'M', point: item } : { command: 'L', point: item });
    if (value.closed === true) commands.push({ command: 'Z' });
    return pathFromCommands(value.kind === 'bezier' ? 'bezier' : 'polyline', commands, value.closed === true);
  }
  return undefined;
};

const shapeTypes = new Set(['rectangle', 'full-rectangle', 'square', 'rounded_rect', 'circle', 'ellipse', 'polygon-parametric', 'star-parametric', 'star', 'polygon']);

/**
 * Converts the current Image/Video shape props without collapsing advanced
 * resources (blob, wave, brace, arrow, and connector) to a rectangle.
 */
export const vectorGeometryFromLegacy = (value: Record<string, unknown>): VectorGeometry | undefined => {
  const source = value.vectorGeometry && typeof value.vectorGeometry === 'object'
    ? value.vectorGeometry as Record<string, unknown>
    : value;
  if (value.vectorGeometry && typeof value.vectorGeometry === 'object') {
    const canonicalKind = (value.vectorGeometry as Record<string, unknown>).kind;
    if (canonicalKind === 'shape' || canonicalKind === 'arrow' || canonicalKind === 'connector'
      || (canonicalKind === 'path' && Array.isArray((value.vectorGeometry as Record<string, unknown>).commands))) {
      return normalizeVectorGeometry(value.vectorGeometry);
    }
  }
  const shapeType = String(value.shapeType ?? value.shape ?? '');
  if (shapeTypes.has(shapeType)) {
    const shape: ShapeGeometry = {
      kind: 'shape',
      shape: shapeType.includes('circle') ? 'ellipse' : shapeType.includes('star') ? 'star' : shapeType.includes('polygon') ? 'polygon' : 'rectangle',
      closed: true,
      ...(typeof value.borderRadius === 'number' ? { radius: value.borderRadius, radiusUnits: 'px' as const } : {}),
      ...(typeof value.sides === 'number' ? { sides: value.sides } : {}),
      ...(typeof value.points === 'number' ? { points: value.points } : {}),
      ...(typeof value.innerRadius === 'number' ? { innerRadius: value.innerRadius, innerRadiusUnits: 'px' as const } : {}),
    };
    return normalizeVectorGeometry(shape);
  }
  const pathKind = shapeType.startsWith('blob') || shapeType === 'mask-blob' ? 'blob'
    : shapeType.includes('wave') || shapeType === 'carousel-wave' ? 'wave'
      : shapeType.includes('brace') || shapeType.includes('bracket') ? 'brace' : undefined;
  const path = pathFromLegacyGeometry({ ...value, ...source, ...(pathKind ? { pathKind } : {}) });
  if (pathKind && path) return path;
  const start = value.startAnchor;
  const end = value.endAnchor;
  if (shapeType.includes('arrow') || shapeType === 'arrow') {
    if (!start || !end) return path;
    const shaft = path ?? pathFromCommands('line', [
      { command: 'M', point: start as VectorPoint },
      { command: 'L', point: end as VectorPoint },
    ], false);
    return normalizeVectorGeometry({
      kind: 'arrow',
      start,
      end,
      head: { style: value.headStyle === undefined ? 'triangle' : value.headStyle },
      tail: { style: value.tailStyle === undefined ? 'none' : value.tailStyle },
      shaft,
    });
  }
  if (shapeType.startsWith('connector')) {
    if (!start || !end) return path;
    const route = shapeType === 'connector-elbow' ? 'elbow' : shapeType === 'connector-curved' ? 'curved' : 'straight';
    const commands = path?.commands ?? [
      { command: 'M', point: start as VectorPoint },
      { command: 'L', point: end as VectorPoint },
    ];
    return normalizeVectorGeometry({
      kind: 'connector',
      route,
      startAnchor: { point: start },
      endAnchor: { point: end },
      commands,
      closed: false,
    });
  }
  return path;
};

export const vectorGeometryToLegacyProps = (geometry: VectorGeometry): Record<string, unknown> => {
  const normalized = normalizeVectorGeometry(geometry);
  if (normalized.kind === 'shape') {
    return {
      shapeType: normalized.shape,
      ...(normalized.radius === undefined ? {} : { borderRadius: normalized.radius }),
      ...(normalized.sides === undefined ? {} : { sides: normalized.sides }),
      ...(normalized.points === undefined ? {} : { points: normalized.points }),
      ...(normalized.innerRadius === undefined ? {} : { innerRadius: normalized.innerRadius }),
    };
  }
  if (normalized.kind === 'arrow') return {
    shapeType: 'arrow',
    startAnchor: normalized.start,
    endAnchor: normalized.end,
    headStyle: normalized.head.style,
    tailStyle: normalized.tail.style,
  };
  if (normalized.kind === 'connector') return {
    shapeType: `connector-${normalized.route}`,
    startAnchor: normalized.startAnchor.point,
    endAnchor: normalized.endAnchor.point,
  };
  return {
    vectorGeometry: {
      version: 1,
      kind: normalized.pathKind === 'bezier' ? 'bezier' : 'path',
      points: normalized.points?.map(({ x, y }) => ({ x, y })),
      closed: normalized.closed,
    },
  };
};
