import { describe, expect, it } from 'vitest';
import {
  CreativeDocumentSchema,
  VECTOR_GEOMETRY_FIXTURES,
  VectorGeometryError,
  createVectorRendererRegistry,
  deserializeVectorGeometry,
  normalizeVectorGeometry,
  serializeVectorGeometry,
  vectorGeometryFromLegacy,
  creativeDocumentToImageProject,
  creativeDocumentToVideoProject,
  imageProjectToCreativeDocument,
  videoProjectToCreativeDocument,
} from './index';

describe('shared vector geometry contract', () => {
  it('round-trips every geometry family without dropping semantics', () => {
    for (const geometry of Object.values(VECTOR_GEOMETRY_FIXTURES)) {
      expect(deserializeVectorGeometry(serializeVectorGeometry(geometry))).toEqual(geometry);
    }
  });

  it('keeps duplicate points and Bézier handles', () => {
    const geometry = normalizeVectorGeometry({
      kind: 'path',
      pathKind: 'bezier',
      closed: false,
      points: [
        { x: 0, y: 0.5, outHandle: { x: 0.2, y: 0.1 } },
        { x: 0, y: 0.5, inHandle: { x: 0.1, y: 0.9 } },
      ],
      commands: [
        { command: 'M', point: { x: 0, y: 0.5 } },
        { command: 'C', points: [{ x: 0.2, y: 0.1 }, { x: 0.1, y: 0.9 }, { x: 0, y: 0.5 }] },
      ],
    });
    expect(geometry).toMatchObject({ points: [{ x: 0 }, { x: 0 }] });
  });

  it('rejects unsafe, unbounded and inconsistent payloads', () => {
    expect(() => normalizeVectorGeometry({ kind: 'path', pathKind: 'svg', closed: false, commands: [{ command: 'X' }] })).toThrow(VectorGeometryError);
    expect(() => CreativeDocumentSchema.parse({
      schemaVersion: 1,
      id: 'invalid',
      name: 'Invalid',
      mode: 'image',
      canvas: { id: 'canvas', width: 100, height: 100 },
      scenes: [{
        id: 'scene',
        layers: [{
          id: 'shape',
          type: 'shape',
          shape: 'rectangle',
          transform: { position: { x: 0, y: 0 }, anchor: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
          geometry: { x: 0, y: 0, width: 1, height: 1 },
          vectorGeometry: {
            kind: 'path',
            pathKind: 'svg',
            closed: false,
            commands: [{ command: 'M', point: { x: Number.NaN, y: 0 } }],
          },
        }],
      }],
    })).toThrow();
  });

  it('maps advanced legacy resources explicitly', () => {
    expect(vectorGeometryFromLegacy({
      shapeType: 'blob-2',
      vectorGeometry: { kind: 'path', path: 'M 0 50 C 20 0 80 0 100 50 Z', closed: true },
    })).toMatchObject({ kind: 'path', pathKind: 'blob', closed: true });
    expect(vectorGeometryFromLegacy({
      shapeType: 'connector-elbow',
      startAnchor: { x: 0.1, y: 0.1 },
      endAnchor: { x: 0.9, y: 0.9 },
    })).toMatchObject({ kind: 'connector', route: 'elbow' });
  });

  it('registers host renderers without importing a rendering runtime', () => {
    const registry = createVectorRendererRegistry<undefined, string>();
    registry.register({ id: 'test', supports: () => true, render: () => 'ok' });
    expect(registry.resolve(VECTOR_GEOMETRY_FIXTURES.rectangle)?.render(VECTOR_GEOMETRY_FIXTURES.rectangle, undefined)).toBe('ok');
    expect(() => registry.register({ id: 'test', supports: () => true, render: () => 'duplicate' })).toThrow();
  });

  it('round-trips semantic geometry through both legacy adapters', () => {
    const imageDocument = {
      schemaVersion: 1 as const,
      id: 'image-vector',
      name: 'Image vector',
      mode: 'image' as const,
      canvas: { id: 'canvas', width: 1000, height: 1000 },
      scenes: [{
        id: 'scene',
        layers: [{
          id: 'arrow',
          type: 'shape' as const,
          shape: 'line' as const,
          vectorGeometry: VECTOR_GEOMETRY_FIXTURES.arrow,
          transform: { position: { x: 0.5, y: 0.5 }, anchor: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 } },
          geometry: { x: 0, y: 0, width: 1, height: 1 },
        }],
      }],
    };
    const imageRoundTrip = imageProjectToCreativeDocument(creativeDocumentToImageProject(imageDocument));
    expect(imageRoundTrip.scenes[0]?.layers[0]).toMatchObject({ vectorGeometry: { kind: 'arrow', head: { style: 'triangle' } } });

    const videoDocument = {
      ...imageDocument,
      id: 'video-vector',
      name: 'Video vector',
      mode: 'video' as const,
      scenes: [{
        ...imageDocument.scenes[0]!,
        timing: { startMs: 0, durationMs: 1000 },
        layers: [{
          ...imageDocument.scenes[0]!.layers[0]!,
          timing: { startMs: 0, durationMs: 1000 },
          vectorGeometry: VECTOR_GEOMETRY_FIXTURES.connector,
        }],
      }],
    };
    const videoRoundTrip = videoProjectToCreativeDocument(creativeDocumentToVideoProject(videoDocument));
    expect(videoRoundTrip.scenes[0]?.layers[0]).toMatchObject({ vectorGeometry: { kind: 'connector', route: 'elbow' } });
  });
});
