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
  const unitPoint = (x: number, y: number): VectorPoint => ({
    // Legacy SVG resources use a 0–100 viewBox and a few intentionally bleed
    // outside it. Canonical geometry is bounded to the unit square.
    x: Math.max(0, Math.min(1, x / 100)),
    y: Math.max(0, Math.min(1, y / 100)),
  });
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
      const rx = Math.max(0, Math.min(1, nextNumber() / 100));
      const ry = Math.max(0, Math.min(1, nextNumber() / 100));
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

const STATIC_LEGACY_PATHS: Record<string, { pathKind: PathGeometry['pathKind']; path: string; closed?: boolean }> = {
  'triangle': { pathKind: 'svg', path: 'M50 4 L96 96 L4 96 Z', closed: true },
  'triangle-up': { pathKind: 'svg', path: 'M50 4 L96 96 L4 96 Z', closed: true },
  'triangle-down': { pathKind: 'svg', path: 'M50 96 L96 4 L4 4 Z', closed: true },
  'diamond': { pathKind: 'svg', path: 'M50 3 L97 50 L50 97 L3 50 Z', closed: true },
  'speech_bubble': { pathKind: 'svg', path: 'M10 8 H90 Q97 8 97 18 V66 Q97 76 87 76 H48 L25 94 L29 76 H10 Q3 76 3 66 V18 Q3 8 10 8 Z', closed: true },
  'heart': { pathKind: 'svg', path: 'M50 91 C20 68 4 47 4 29 C4 14 15 4 29 4 C39 4 46 10 50 19 C54 10 61 4 71 4 C85 4 96 14 96 29 C96 47 80 68 50 91 Z', closed: true },
  'shield': { pathKind: 'svg', path: 'M50 3 L92 20 V54 C92 79 50 97 50 97 C50 97 8 79 8 54 V20 Z', closed: true },
  'blob-1': { pathKind: 'blob', path: 'M17 21 C31 5 62 2 81 16 C99 30 97 62 80 80 C63 98 28 95 12 75 C-2 57 2 37 17 21 Z', closed: true },
  'blob-2': { pathKind: 'blob', path: 'M9 35 C14 12 38 1 61 8 C85 15 100 36 92 59 C84 82 64 99 39 93 C14 88 3 60 9 35 Z', closed: true },
  'blob-3': { pathKind: 'blob', path: 'M19 14 C35 2 51 10 62 9 C82 7 97 22 94 43 C91 62 100 74 82 88 C67 100 53 90 39 93 C17 98 3 82 7 61 C10 44 1 28 19 14 Z', closed: true },
  'blob-4': { pathKind: 'blob', path: 'M10 28 C15 7 39 4 55 11 C70 17 84 6 94 24 C105 44 89 56 92 70 C95 88 73 99 57 91 C42 83 31 101 16 87 C2 74 14 55 8 43 C5 37 8 32 10 28 Z', closed: true },
  'blob-5': { pathKind: 'blob', path: 'M21 8 C39 -1 54 12 68 8 C86 3 99 20 93 38 C87 54 101 66 87 82 C73 98 57 84 43 94 C24 108 6 91 11 70 C14 56 -1 43 8 27 C11 19 16 12 21 8 Z', closed: true },
  'blob-6': { pathKind: 'blob', path: 'M7 41 C3 21 23 6 43 10 C59 13 71 1 86 12 C101 23 91 42 96 57 C102 78 80 91 61 88 C44 85 28 101 14 84 C3 71 11 56 7 41 Z', closed: true },
  'brace-left': { pathKind: 'brace', path: 'M36 4 C20 4 24 24 24 34 C24 43 16 45 10 50 C16 55 24 57 24 66 C24 76 20 96 36 96', closed: false },
  'brace-right': { pathKind: 'brace', path: 'M64 4 C80 4 76 24 76 34 C76 43 84 45 90 50 C84 55 76 57 76 66 C76 76 80 96 64 96', closed: false },
  'brace-pair': { pathKind: 'brace', path: 'M36 4 C20 4 24 24 24 34 C24 43 16 45 10 50 C16 55 24 57 24 66 C24 76 20 96 36 96 M64 4 C80 4 76 24 76 34 C76 43 84 45 90 50 C84 55 76 57 76 66 C76 76 80 96 64 96', closed: false },
  'bracket-square-left': { pathKind: 'brace', path: 'M74 5 H26 V95 H74', closed: false },
  'bracket-square-right': { pathKind: 'brace', path: 'M26 5 H74 V95 H26', closed: false },
  'bracket-square-pair': { pathKind: 'brace', path: 'M34 5 H12 V95 H34 M66 5 H88 V95 H66', closed: false },
  'bracket-curly-pair': { pathKind: 'brace', path: 'M36 4 C20 4 24 24 24 34 C24 43 16 45 10 50 C16 55 24 57 24 66 C24 76 20 96 36 96 M64 4 C80 4 76 24 76 34 C76 43 84 45 90 50 C84 55 76 57 76 66 C76 76 80 96 64 96', closed: false },
  'separator-wave': { pathKind: 'wave', path: 'M2 50 C14 20 26 20 38 50 S62 80 74 50 S88 20 98 50', closed: false },
  'separator-curve': { pathKind: 'bezier', path: 'M2 68 C28 68 34 22 58 30 C76 36 80 64 98 64', closed: false },
  'separator-zigzag': { pathKind: 'polyline', path: 'M2 62 L18 38 L34 62 L50 38 L66 62 L82 38 L98 62', closed: false },
  'separator-dots': { pathKind: 'polyline', path: 'M18 50 L34 50 L50 50 L66 50 L82 50', closed: false },
  'separator-diamond': { pathKind: 'polyline', path: 'M2 50 L38 50 M62 50 L98 50 M50 34 L66 50 L50 66 L34 50 L50 34', closed: false },
  'top-semicircle': { pathKind: 'svg', path: 'M0 0 H100 A50 50 0 0 1 0 0 Z', closed: true },
  'frame-simple': { pathKind: 'svg', path: 'M5 5 H95 V95 H5 Z', closed: true },
  'frame-rounded': { pathKind: 'svg', path: 'M5 5 H95 V95 H5 Z', closed: true },
  'frame-circle': { pathKind: 'svg', path: 'M94 50 A44 44 0 1 1 6 50 A44 44 0 1 1 94 50', closed: false },
  'frame-corners': { pathKind: 'brace', path: 'M35 7 H7 V35 M65 7 H93 V35 M93 65 V93 H65 M35 93 H7 V65', closed: false },
  'frame-polaroid': { pathKind: 'svg', path: 'M5 5 H95 V95 H5 Z M16 16 V69 H84 V16 Z', closed: true },
  'frame-film': { pathKind: 'svg', path: 'M3 10 H97 V90 H3 Z', closed: true },
  'mask-circle': { pathKind: 'svg', path: 'M96 50 A46 46 0 1 1 4 50 A46 46 0 1 1 96 50', closed: false },
  'mask-rounded': { pathKind: 'svg', path: 'M3 3 H97 V97 H3 Z', closed: true },
  'mask-hexagon': { pathKind: 'svg', path: 'M50 3 L90 27 L90 73 L50 97 L10 73 L10 27 Z', closed: true },
  'mask-arch': { pathKind: 'svg', path: 'M5 97 V48 C5 22 25 3 50 3 C75 3 95 22 95 48 V97 Z', closed: true },
  'mask-heart': { pathKind: 'svg', path: 'M50 91 C20 68 4 47 4 29 C4 14 15 4 29 4 C39 4 46 10 50 19 C54 10 61 4 71 4 C85 4 96 14 96 29 C96 47 80 68 50 91 Z', closed: true },
  'mask-blob': { pathKind: 'blob', path: 'M17 21 C31 5 62 2 81 16 C99 30 97 62 80 80 C63 98 28 95 12 75 C-2 57 2 37 17 21 Z', closed: true },
  'line': { pathKind: 'line', path: 'M2 50 L98 50', closed: false },
  'line-dashed': { pathKind: 'line', path: 'M2 50 L98 50', closed: false },
  'line-dotted': { pathKind: 'line', path: 'M2 50 L98 50', closed: false },
  'line-arrow-right': { pathKind: 'line', path: 'M2 50 L98 50', closed: false },
  'line-arrow-both': { pathKind: 'line', path: 'M2 50 L98 50', closed: false },
  'curve': { pathKind: 'bezier', path: 'M4 82 C24 8 76 8 96 82', closed: false },
  'arc': { pathKind: 'svg', path: 'M8 50 A42 42 0 0 1 92 50', closed: false },
  'ring': { pathKind: 'svg', path: 'M92 50 A42 42 0 1 1 8 50 A42 42 0 1 1 92 50', closed: false },
  'connector-elbow': { pathKind: 'line', path: 'M6 16 L52 16 L52 84 L94 84', closed: false },
  'connector-curved': { pathKind: 'bezier', path: 'M6 16 C62 16 38 84 94 84', closed: false },
  'connector-straight': { pathKind: 'line', path: 'M6 16 L94 84', closed: false },
  'arrow': { pathKind: 'svg', path: 'M2 32 L55 32 L55 12 L98 50 L55 88 L55 68 L2 68 Z', closed: true },
  'arrow-right': { pathKind: 'svg', path: 'M2 32 L55 32 L55 12 L98 50 L55 88 L55 68 L2 68 Z', closed: true },
  'arrow-left': { pathKind: 'svg', path: 'M98 32 L45 32 L45 12 L2 50 L45 88 L45 68 L98 68 Z', closed: true },
  'arrow-up': { pathKind: 'svg', path: 'M32 98 L32 45 L12 45 L50 2 L88 45 L68 45 L68 98 Z', closed: true },
  'arrow-down': { pathKind: 'svg', path: 'M32 2 L32 55 L12 55 L50 98 L88 55 L68 55 L68 2 Z', closed: true },
  'arrow-both': { pathKind: 'svg', path: 'M24 20 L2 50 L24 80 L24 66 L76 66 L76 80 L98 50 L76 20 L76 34 L24 34 Z', closed: true },
};

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
  const shapeType = String(value.shapeType ?? value.shape ?? (value.blockType === 'GeometricShape' ? 'rectangle' : ''));
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
  const staticPath = STATIC_LEGACY_PATHS[shapeType];
  const hasAnchors = value.startAnchor !== undefined && value.endAnchor !== undefined;
  if (staticPath && !(hasAnchors && (shapeType.startsWith('connector') || shapeType.includes('arrow')))) {
    return pathFromCommands(
      staticPath.pathKind,
      parseLegacySvgPath(staticPath.path),
      staticPath.closed ?? false,
    );
  }
  if (shapeType === 'carousel-wave') {
    const start = typeof value.waveStartY === 'number' ? value.waveStartY : 48;
    const end = typeof value.waveEndY === 'number' ? value.waveEndY : 48;
    const amplitude = typeof value.waveAmplitude === 'number' ? value.waveAmplitude : 24;
    const cycles = Math.max(1, Math.min(8, Math.round(typeof value.waveCycles === 'number' ? value.waveCycles : 2)));
    const middle = (start + end) / 2;
    const control = Math.max(4, Math.min(96, middle - amplitude));
    const reverseControl = Math.max(4, Math.min(96, middle + amplitude));
    const wave = Array.from({ length: cycles }, (_, index) =>
      `C${(index * 100 / cycles) + 25 / cycles} ${control} ${(index * 100 / cycles) + 25 / cycles} ${control} ${(index + 0.5) * 100 / cycles} ${middle} C${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index * 100 / cycles) + 75 / cycles} ${reverseControl} ${(index + 1) * 100 / cycles} ${end}`,
    ).join(' ');
    const path = value.waveAnchor === 'top'
      ? `M0 0 L0 ${start} ${wave} L100 0 Z`
      : `M0 ${start} ${wave} L100 100 L0 100 Z`;
    return pathFromCommands('wave', parseLegacySvgPath(path), true);
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
  // GeometricShape is a legacy container, not a canonical primitive. Unknown
  // variants retain their complete props in `extensions.legacy.source` while
  // receiving a safe editable geometry so autosave never drops the layer.
  if (value.blockType === 'GeometricShape') {
    return normalizeVectorGeometry({ kind: 'shape', shape: 'rectangle', closed: true });
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
