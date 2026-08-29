import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GeometricShapeGraphic } from '../components/image-editor/blocks/ShapeBlocks';
import {
  createEditableVectorBezierPath,
  createEditableVectorPathGeometry,
  getEditableVectorPath,
  normalizeGeometricShapeProps,
  normalizeEditableVectorGeometry,
} from './vectorGeometry';
import { normalizeStoredProject } from './imagePersistence';

describe('reusable vector geometry', () => {
  it('normalizes persisted Bézier anchors into bounded unit coordinates', () => {
    expect(normalizeEditableVectorGeometry({
      kind: 'bezier',
      points: [
        { x: 1.4, y: -1 },
        { x: 0.5, y: 0.4 },
        { x: 0.5, y: 0.9 },
        { x: 'invalid', y: 0.2 },
      ],
      closed: true,
    })).toEqual({
      version: 1,
      kind: 'bezier',
      points: [
        { x: 1, y: 0 },
        { x: 0.5, y: 0.4 },
        { x: 0.5, y: 0.9 },
      ],
      closed: true,
    });
  });

  it('rejects unsafe path payloads while retaining exact safe SVG paths', () => {
    expect(normalizeEditableVectorGeometry({
      kind: 'path',
      path: '<script>alert(1)</script>',
    })).toBeUndefined();
    const geometry = createEditableVectorPathGeometry('M0 0 C25 10 75 10 100 0 Z', {
      closed: true,
      fillRule: 'evenodd',
    });
    expect(geometry).toMatchObject({
      version: 1,
      kind: 'path',
      path: 'M0 0 C25 10 75 10 100 0 Z',
      closed: true,
      fillRule: 'evenodd',
    });
    expect(getEditableVectorPath(geometry!)).toContain('C25');
  });

  it('builds reusable cubic paths and renders them for any vector shape role', () => {
    const points = [{ x: 0, y: 0.2 }, { x: 0.5, y: 0.8 }, { x: 1, y: 0.3 }];
    expect(createEditableVectorBezierPath(points)).toContain('C');
    const markup = renderToStaticMarkup(
      <GeometricShapeGraphic
        shapeType="mask-blob"
        fill="#005F73"
        stroke="#94D2BD"
        strokeWidth={2}
        vectorGeometry={{ version: 1, kind: 'bezier', points, closed: true }}
      />,
    );
    expect(markup).toContain('<path');
    expect(markup).toContain('C');
    expect(markup).not.toContain('data-preview-fallback');
  });

  it('normalizes vector geometry when a project is loaded from persistence', () => {
    const project = normalizeStoredProject({
      id: 'persisted',
      title: 'Persisted',
      preset: { width: 1080, height: 1080 } as never,
      background: { type: 'solid', color: '#fff' },
      brandTokens: {} as never,
      layers: [{
        id: 'frame',
        type: 'block',
        blockType: 'GeometricShape',
        title: 'Frame',
        props: {
          shapeType: 'frame-rounded',
          vectorGeometry: {
            kind: 'bezier',
            points: [{ x: 2, y: 0.1 }, { x: 0.8, y: 1.2 }],
          },
        },
        position: { x: 50, y: 50 },
        zIndex: 1,
        scale: 1,
      }],
      createdAt: '',
      updatedAt: '',
    } as never);
    expect(project.layers[0].props.vectorGeometry).toEqual({
      version: 1,
      kind: 'bezier',
      points: [{ x: 1, y: 0.1 }, { x: 0.8, y: 1 }],
    });
    expect(project.layers[0].vectorGeometry).toEqual(project.layers[0].props.vectorGeometry);
  });

  it('normalizes advanced shape parameters when a project is loaded', () => {
    const project = normalizeStoredProject({
      id: 'advanced-shape',
      title: 'Advanced',
      preset: { width: 1080, height: 1080 } as never,
      background: { type: 'solid', color: '#fff' },
      brandTokens: {} as never,
      layers: [{
        id: 'ring',
        type: 'block',
        blockType: 'GeometricShape',
        title: 'Ring',
        props: { shapeType: 'ring', ringThickness: 999, ringRadius: -2, wavePath: '<svg>' },
        position: { x: 50, y: 50 },
        zIndex: 1,
        scale: 1,
      }],
      createdAt: '',
      updatedAt: '',
    } as never);
    expect(project.layers[0].props).toMatchObject({
      shapeType: 'ring',
      ringThickness: 50,
      ringRadius: 5,
    });
    expect(project.layers[0].props).not.toHaveProperty('wavePath');
  });

  it('drops malformed geometry rather than persisting an unusable layer override', () => {
    const project = normalizeStoredProject({
      id: 'invalid-geometry',
      title: 'Invalid',
      preset: { width: 1080, height: 1080 } as never,
      background: { type: 'solid', color: '#fff' },
      brandTokens: {} as never,
      layers: [{
        id: 'shape',
        type: 'shape',
        title: 'Shape',
        props: { vectorGeometry: { kind: 'path', path: '<bad>' } },
        vectorGeometry: { kind: 'path', path: '<bad>' } as never,
        position: { x: 50, y: 50 },
        zIndex: 1,
        scale: 1,
      }],
      createdAt: '',
      updatedAt: '',
    } as never);
    expect(project.layers[0]).not.toHaveProperty('vectorGeometry');
    expect(project.layers[0].props).not.toHaveProperty('vectorGeometry');
  });

  it('bounds reusable shape parameters and removes unsafe wave paths', () => {
    expect(normalizeGeometricShapeProps({
      sides: 999,
      ringThickness: -4,
      arcStartAngle: 'not-a-number',
      waveCycles: 99,
      waveAnchor: 'diagonal',
      wavePath: '<svg>',
    })).toEqual({
      sides: 24,
      ringThickness: 1,
      waveCycles: 8,
    });
  });

  it('renders configurable rings, arcs, and carousel waves without fallback output', () => {
    const markup = renderToStaticMarkup(
      <>
        <GeometricShapeGraphic shapeType="ring" stroke="#EE9B00" ringRadius={40} ringThickness={12} />
        <GeometricShapeGraphic shapeType="arc" stroke="#94D2BD" arcStartAngle={210} arcEndAngle={330} />
        <GeometricShapeGraphic shapeType="carousel-wave" fill="#005F73" waveCycles={3} waveAmplitude={30} />
      </>,
    );
    expect(markup).toContain('<circle');
    expect(markup).toContain('A 42 42');
    expect(markup).toContain('C');
    expect(markup).not.toContain('data-preview-fallback');
  });
});
