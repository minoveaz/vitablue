import type {
  Appearance,
  CreativeDocument,
  CreativeLayer,
  ShapeKind,
} from '../types';
import type {
  AssetRef as LegacyAssetRef,
  AudioTrack,
  Layer as LegacyLayer,
  LayerTiming,
  Scene as LegacyScene,
  VideoFormat,
  VideoProject,
} from '../../../video-studio/src/domain/videoProject';
import {
  clamp,
  finitePositive,
  fromJsonObject,
  geometryFromLegacyCenter,
  legacyCenterFromGeometry,
  legacySource,
  resolveAssetRef,
  toSafeJsonObject,
  toJsonObject,
  withLegacySource,
  type LegacyRecord,
} from './adapterUtils';
import { vectorGeometryFromLegacy, vectorGeometryToLegacyProps } from './vectorGeometryAdapter';

const numberValue = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const stringValue = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);
const recordValue = (value: unknown): LegacyRecord | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as LegacyRecord) : undefined;

const framesToMs = (frames: number, fps: number): number => Math.max(0, Math.round((frames * 1000) / fps));
const msToFrames = (ms: number, fps: number): number => Math.max(0, Math.round((ms * fps) / 1000));

const positionOf = (
  position: { x: number; y: number } | 'top' | 'center' | 'bottom' | undefined,
): { x: number; y: number } => {
  if (typeof position === 'object' && position !== null) {
    return {
      x: Number.isFinite(position.x) ? position.x : 50,
      y: Number.isFinite(position.y) ? position.y : 50,
    };
  }
  if (position === 'top') return { x: 50, y: 15 };
  if (position === 'bottom') return { x: 50, y: 80 };
  return { x: 50, y: 50 };
};

const dimensionsOf = (
  layer: LegacyLayer,
  canvas: { width: number; height: number },
): { width: number; height: number } => {
  const fallback = layer.type === 'text' || layer.type === 'subtitle' ? 200 : 100;
  return {
    width: clamp(finitePositive('width' in layer ? layer.width : undefined, fallback), 1, canvas.width),
    height: clamp(finitePositive('height' in layer ? layer.height : undefined, fallback), 1, canvas.height),
  };
};

const appearanceOf = (layer: LegacyLayer): Appearance | undefined => {
  if (layer.type === 'text' || layer.type === 'subtitle') {
    const backgroundColor = 'backgroundColor' in layer ? layer.backgroundColor : undefined;
    const align = 'align' in layer ? layer.align : undefined;
    return {
      opacity: 1,
      ...(layer.color === undefined && backgroundColor === undefined
        ? {}
        : {
            fill: backgroundColor ? { color: backgroundColor } : undefined,
          }),
      typography: {
        fontFamily: 'sans-serif',
        fontSize: finitePositive(layer.fontSize, 16),
        ...(layer.color === undefined ? {} : { color: layer.color }),
        ...(align === undefined ? {} : { align }),
      },
    };
  }
  if (layer.type === 'shape') {
    return {
      opacity: clamp(layer.opacity ?? 1, 0, 1),
      ...(layer.color === undefined
        ? {}
        : {
            fill: {
              color: layer.color,
              ...(layer.opacity === undefined ? {} : { opacity: clamp(layer.opacity, 0, 1) }),
            },
          }),
    };
  }
  return undefined;
};

const shapeOf = (layer: Extract<LegacyLayer, { type: 'shape' }>): ShapeKind => {
  if (layer.shape === 'circle') return 'ellipse';
  if (layer.shape === 'rectangle' || layer.shape === 'pill' || layer.shape === 'badge' || layer.shape === 'line') return 'rectangle';
  throw new Error(`Unsupported Video Studio shape "${layer.shape}".`);
};

const assetOf = (layer: Extract<LegacyLayer, { type: 'image' | 'video' }>) => {
  const asset = resolveAssetRef(
    [
      { field: 'assetId', value: layer.asset.assetId },
      { field: 'src', value: layer.asset.src },
    ],
    layer.id,
  );
  const alt = layer.asset.alt;
  return alt === undefined ? asset : { ...asset, alt };
};

const audioAssetOf = (track: AudioTrack) =>
  resolveAssetRef([{ field: 'src', value: track.src }], track.id);

const layerExtras = (layer: LegacyLayer): LegacyRecord => {
  const mapped = new Set([
    'id', 'name', 'type', 'timing', 'visible', 'locked', 'zIndex', 'constraints', 'text', 'fontSize',
    'color', 'backgroundColor', 'position', 'align', 'image', 'asset', 'alt', 'width', 'height',
    'shape', 'opacity', 'componentId', 'props', 'src', 'volume', 'fadeInDuration', 'fadeOutDuration',
    'animation', 'highlightWords', 'stylePreset',
  ]);
  return Object.fromEntries(Object.entries(layer).filter(([key]) => !mapped.has(key)));
};

const toCreativeLayer = (
  layer: LegacyLayer,
  canvas: { width: number; height: number },
  fps: number,
  sceneDurationFrames: number,
): CreativeLayer => {
  const dimensions = dimensionsOf(layer, canvas);
  const placement = geometryFromLegacyCenter(
    positionOf('position' in layer ? layer.position : undefined),
    dimensions.width,
    dimensions.height,
    canvas,
  );
  const timing = layer.timing ?? { startFrame: 0, durationInFrames: sceneDurationFrames };
  const source = layer as unknown as LegacyRecord;
  const common = {
    id: layer.id,
    ...(layer.name === undefined ? {} : { name: layer.name }),
    transform: {
      position: placement.position,
      anchor: { x: 0.5, y: 0.5 },
      rotation: 0,
      scale: { x: 1, y: 1 },
    },
    geometry: placement.geometry,
    ...(appearanceOf(layer) === undefined ? {} : { appearance: appearanceOf(layer) }),
    timing: {
      startMs: framesToMs(timing.startFrame, fps),
      durationMs: Math.max(1, framesToMs(timing.durationInFrames, fps)),
    },
    ...(layer.visible === undefined ? {} : { visible: layer.visible }),
    ...(layer.locked === undefined ? {} : { locked: layer.locked }),
    ...(layer.zIndex === undefined ? {} : { zIndex: layer.zIndex }),
    extensions: withLegacySource(source, {
      ...layerExtras(layer),
      ...(layer.constraints === undefined ? {} : { constraints: layer.constraints }),
      ...(layer.type === 'subtitle' ? { subtitle: { highlightWords: layer.highlightWords, stylePreset: layer.stylePreset } } : {}),
    }),
  };
  if (layer.type === 'text' || layer.type === 'subtitle') {
    return { ...common, type: 'text', text: layer.text };
  }
  if (layer.type === 'image') {
    return { ...common, type: 'image', asset: assetOf(layer), ...(layer.alt ? { extensions: withLegacySource(source, { ...layerExtras(layer), alt: layer.alt }) } : {}) };
  }
  if (layer.type === 'video') return { ...common, type: 'video', asset: assetOf(layer) };
  if (layer.type === 'shape') {
    const legacyGeometry = vectorGeometryFromLegacy({
      shape: layer.shape,
      ...(layer.shape === 'pill' ? { shapeType: 'rounded_rect', borderRadius: Math.min(dimensions.width, dimensions.height) / 2 } : {}),
      ...((layer as unknown as Record<string, unknown>).vectorGeometry
        && typeof (layer as unknown as Record<string, unknown>).vectorGeometry === 'object'
        ? { vectorGeometry: (layer as unknown as Record<string, unknown>).vectorGeometry }
        : {}),
    });
    return {
      ...common,
      type: 'shape',
      shape: legacyGeometry?.kind === 'shape' ? legacyGeometry.shape : shapeOf(layer),
      ...(legacyGeometry === undefined ? {} : { vectorGeometry: legacyGeometry }),
    };
  }
  if (layer.type === 'component') {
    return { ...common, type: 'component', componentId: layer.componentId, props: toSafeJsonObject(layer.props) };
  }
  if (layer.type === 'audio') {
    return {
      ...common,
      type: 'audio',
      asset: audioAssetOf({
        id: layer.id,
        name: layer.name,
        src: layer.src,
        startFrame: timing.startFrame,
        durationInFrames: timing.durationInFrames,
        volume: layer.volume,
      }),
      ...(layer.volume === undefined ? {} : { volume: layer.volume }),
    };
  }
  throw new Error('Unsupported legacy layer in VideoProject conversion.');
};

const audioLayer = (
  track: AudioTrack,
  canvas: { width: number; height: number },
  fps: number,
  sceneDurationFrames: number,
): CreativeLayer => {
  const timing = {
    startMs: framesToMs(track.startFrame, fps),
    durationMs: Math.max(1, framesToMs(track.durationInFrames ?? sceneDurationFrames, fps)),
  };
  return {
    id: track.id,
    ...(track.name ? { name: track.name } : {}),
    type: 'audio',
    asset: audioAssetOf(track),
    transform: { position: { x: 0.5, y: 0.5 }, anchor: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 } },
    geometry: { x: 0, y: 0, width: 1 / canvas.width, height: 1 / canvas.height },
    timing,
    ...(track.volume === undefined ? {} : { volume: clamp(track.volume, 0, 1) }),
    extensions: withLegacySource(track as unknown as LegacyRecord, { audioTrack: true }),
  };
};

const projectExtensions = (project: VideoProject): { legacy: ReturnType<typeof toJsonObject> } => ({
  legacy: toJsonObject({ source: project, fps: project.fps, format: project.format, metadata: project.metadata, layout: project.layout }),
});

export const videoProjectToCreativeDocument = (project: VideoProject): CreativeDocument => {
  const canvas = { width: project.width, height: project.height };
  let sceneStartFrames = 0;
  const scenes = project.scenes.map((scene) => {
    const startFrames = sceneStartFrames;
    sceneStartFrames += scene.durationInFrames;
    const layers = scene.layers.map((layer) => toCreativeLayer(layer, canvas, project.fps, scene.durationInFrames));
    return {
      id: scene.id,
      layers,
      timing: {
        startMs: framesToMs(startFrames, project.fps),
        durationMs: Math.max(1, framesToMs(scene.durationInFrames, project.fps)),
      },
      extensions: withLegacySource(scene as unknown as LegacyRecord, {
        templateId: scene.templateId,
        content: scene.content,
        transition: scene.transition,
      }),
    };
  });
  if (project.audio) {
    const firstScene = scenes[0];
    if (firstScene) firstScene.layers.push(...project.audio.map((track) => audioLayer(track, canvas, project.fps, project.scenes[0]?.durationInFrames ?? 1)));
  }
  const assets = scenes.flatMap((scene) =>
    scene.layers.flatMap((layer) => {
      if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') return [layer.asset];
      return [];
    }),
  );
  const uniqueAssets = Array.from(new Map(assets.map((asset) => [asset.assetId, asset])).values());
  return {
    schemaVersion: 1,
    id: project.id,
    name: project.name,
    mode: 'video',
    canvas: { id: `${project.id}-canvas`, width: project.width, height: project.height },
    scenes,
    ...(uniqueAssets.length ? { assets: uniqueAssets } : {}),
    extensions: projectExtensions(project),
  };
};

const legacyTiming = (layer: CreativeLayer, fps: number): LayerTiming => ({
  startFrame: msToFrames(layer.timing?.startMs ?? 0, fps),
  durationInFrames: Math.max(1, msToFrames(layer.timing?.durationMs ?? 1000 / fps, fps)),
});

const toLegacyLayer = (layer: CreativeLayer, canvas: { width: number; height: number }, fps: number): LegacyLayer => {
  const source = legacySource(layer.extensions);
  const placement = legacyCenterFromGeometry(layer.geometry, layer.transform.position, canvas);
  const common: LegacyRecord = {
    ...source,
    id: layer.id,
    name: layer.name ?? stringValue(source.name),
    timing: legacyTiming(layer, fps),
    position: placement.position,
    width: placement.width,
    height: placement.height,
    visible: layer.visible,
    locked: layer.locked,
    zIndex: layer.zIndex,
    constraints: source.constraints,
  };
  if (layer.type === 'text') {
    const subtitle = recordValue(source.subtitle);
    common.type = subtitle ? 'subtitle' : 'text';
    common.text = layer.text;
    common.fontSize = layer.appearance?.typography?.fontSize;
    common.color = layer.appearance?.typography?.color;
    common.align = layer.appearance?.typography?.align === 'justify' ? 'left' : layer.appearance?.typography?.align;
    return common as unknown as LegacyLayer;
  }
  if (layer.type === 'image' || layer.type === 'video') {
    common.type = layer.type;
    common.asset = {
      ...(recordValue(source.asset) ?? {}),
      assetId: layer.asset.assetId,
      src: layer.asset.storagePath,
      alt: layer.asset.alt,
    } satisfies LegacyAssetRef;
    if (layer.type === 'image') common.alt = layer.asset.alt;
    return common as unknown as LegacyLayer;
  }
  if (layer.type === 'shape') {
    common.type = 'shape';
    common.shape = stringValue(source.shape) ?? (layer.shape === 'ellipse' ? 'circle' : layer.shape);
    common.color = layer.appearance?.fill?.color;
    common.opacity = layer.appearance?.opacity;
    if (layer.vectorGeometry) {
      // Video Studio's legacy model has only four shape names. Keep the
      // canonical geometry alongside the legacy approximation until migration.
      common.vectorGeometry = layer.vectorGeometry;
      if (layer.vectorGeometry.kind !== 'shape') common.vectorGeometryCompatibility = 'core-only';
      Object.assign(common, vectorGeometryToLegacyProps(layer.vectorGeometry));
    }
    return common as unknown as LegacyLayer;
  }
  if (layer.type === 'component') {
    common.type = 'component';
    common.componentId = layer.componentId;
    common.props = { ...(recordValue(source.props) ?? {}), ...fromJsonObject(layer.props) };
    return common as unknown as LegacyLayer;
  }
  if (layer.type === 'audio') {
    common.type = 'audio';
    common.src = layer.asset.storagePath;
    common.volume = layer.volume;
    return common as unknown as LegacyLayer;
  }
  throw new Error(`Unsupported layer type "${layer.type}" in VideoProject conversion.`);
};

const formatForCanvas = (width: number, height: number): VideoFormat => {
  if (width === height) return 'square';
  return height > width ? 'vertical' : 'landscape';
};

export const creativeDocumentToVideoProject = (document: CreativeDocument): VideoProject => {
  if (document.mode === 'image') throw new Error('Cannot convert an image CreativeDocument to VideoProject.');
  const documentSource = legacySource(document.extensions);
  const sourceProject = recordValue(documentSource.source);
  const fps = finitePositive(numberValue(sourceProject?.fps) ?? numberValue(documentSource.fps), 30);
  const audioTracks: AudioTrack[] = [];
  const scenes: LegacyScene[] = document.scenes.map((scene) => {
    const sceneSource = legacySource(scene.extensions);
    const sceneRecord = recordValue(sceneSource.source);
    const sceneTimingFrames = Math.max(1, msToFrames(scene.timing?.durationMs ?? 1000, fps));
    const layers = scene.layers.flatMap((layer) => {
      if (layer.type === 'audio') {
        const source = legacySource(layer.extensions);
        const track: AudioTrack = {
          ...(source as Partial<AudioTrack>),
          id: layer.id,
          name: layer.name ?? stringValue(source.name),
          src: layer.asset.storagePath,
          startFrame: msToFrames(layer.timing?.startMs ?? 0, fps),
          durationInFrames: Math.max(1, msToFrames(layer.timing?.durationMs ?? 1000 / fps, fps)),
          ...(layer.volume === undefined ? {} : { volume: layer.volume }),
        };
        audioTracks.push(track);
        return [];
      }
      return [toLegacyLayer(layer, document.canvas, fps)];
    });
    return {
      ...(sceneRecord as Partial<LegacyScene>),
      id: scene.id,
      templateId: (stringValue(sceneSource.templateId) as LegacyScene['templateId'] | undefined) ?? 'text_hook',
      durationInFrames: sceneTimingFrames,
      layers,
      content: (recordValue(sceneSource.content) ?? {}) as Record<string, unknown>,
      ...(sceneSource.transition === undefined ? {} : { transition: sceneSource.transition as LegacyScene['transition'] }),
    };
  });
  const sourceFormat = stringValue(sourceProject?.format);
  return {
    ...(sourceProject as Partial<VideoProject> | undefined),
    schemaVersion: 'video-schema-v1',
    id: document.id,
    name: document.name,
    fps,
    format: (sourceFormat as VideoFormat | undefined) ?? formatForCanvas(document.canvas.width, document.canvas.height),
    width: document.canvas.width,
    height: document.canvas.height,
    scenes,
    ...(audioTracks.length ? { audio: audioTracks } : {}),
  };
};
