import type { VectorGeometry } from '../vectorGeometry';

const line = (pathKind: 'line' | 'polyline' | 'bezier' | 'svg' | 'blob' | 'wave' | 'brace'): VectorGeometry => ({
  kind: 'path',
  pathKind,
  closed: false,
  commands: [
    { command: 'M', point: { x: 0.05, y: 0.5 } },
    { command: 'L', point: { x: 0.95, y: 0.5 } },
  ],
});

export const VECTOR_GEOMETRY_FIXTURES: Readonly<Record<string, VectorGeometry>> = {
  rectangle: { kind: 'shape', shape: 'rectangle', closed: true, radius: 16, radiusUnits: 'px' },
  ellipse: { kind: 'shape', shape: 'ellipse', closed: true },
  polygon: { kind: 'shape', shape: 'polygon', closed: true, sides: 6 },
  star: { kind: 'shape', shape: 'star', closed: true, points: 5, innerRadius: 0.45, innerRadiusUnits: 'normalized' },
  line: line('line'),
  polyline: {
    kind: 'path',
    pathKind: 'polyline',
    closed: false,
    commands: [
      { command: 'M', point: { x: 0, y: 0.5 } },
      { command: 'L', point: { x: 0.35, y: 0.2 } },
      { command: 'L', point: { x: 0.65, y: 0.8 } },
      { command: 'L', point: { x: 1, y: 0.5 } },
    ],
  },
  bezier: {
    kind: 'path',
    pathKind: 'bezier',
    closed: false,
    points: [
      { x: 0.05, y: 0.8, outHandle: { x: 0.25, y: 0.2 } },
      { x: 0.95, y: 0.2, inHandle: { x: 0.75, y: 0.8 } },
    ],
    commands: [
      { command: 'M', point: { x: 0.05, y: 0.8 } },
      { command: 'C', points: [{ x: 0.25, y: 0.2 }, { x: 0.75, y: 0.8 }, { x: 0.95, y: 0.2 }] },
    ],
  },
  svg: line('svg'),
  blob: {
    kind: 'path',
    pathKind: 'blob',
    closed: true,
    commands: [
      { command: 'M', point: { x: 0.08, y: 0.5 } },
      { command: 'C', points: [{ x: 0.1, y: 0.1 }, { x: 0.8, y: 0.05 }, { x: 0.92, y: 0.5 }] },
      { command: 'C', points: [{ x: 0.8, y: 0.95 }, { x: 0.1, y: 0.9 }, { x: 0.08, y: 0.5 }] },
      { command: 'Z' },
    ],
  },
  wave: {
    kind: 'path',
    pathKind: 'wave',
    closed: false,
    commands: [
      { command: 'M', point: { x: 0, y: 0.5 } },
      { command: 'C', points: [{ x: 0.2, y: 0.1 }, { x: 0.3, y: 0.9 }, { x: 0.5, y: 0.5 }] },
      { command: 'C', points: [{ x: 0.7, y: 0.1 }, { x: 0.8, y: 0.9 }, { x: 1, y: 0.5 }] },
    ],
  },
  arrow: {
    kind: 'arrow',
    start: { x: 0.05, y: 0.5 },
    end: { x: 0.95, y: 0.5 },
    head: { style: 'triangle', size: 12, sizeUnits: 'px' },
    tail: { style: 'none' },
    shaft: line('line') as Extract<VectorGeometry, { kind: 'path' }>,
  },
  connector: {
    kind: 'connector',
    route: 'elbow',
    startAnchor: { point: { x: 0.05, y: 0.1 }, nodeId: 'source', side: 'right' },
    endAnchor: { point: { x: 0.95, y: 0.9 }, nodeId: 'target', side: 'left' },
    closed: false,
    commands: [
      { command: 'M', point: { x: 0.05, y: 0.1 } },
      { command: 'L', point: { x: 0.5, y: 0.1 } },
      { command: 'L', point: { x: 0.5, y: 0.9 } },
      { command: 'L', point: { x: 0.95, y: 0.9 } },
    ],
    head: { style: 'triangle' },
  },
  brace: line('brace'),
};
