import type {
  Appearance,
  CreativeDocument,
  CreativeLayer,
  Geometry,
  ImageLayer as CreativeImageLayer,
  ShapeKind,
  TextLayer as CreativeTextLayer,
} from '../types';
import type {
  CanvasBackground,
  ImageLayer as LegacyImageLayer,
  ImageProject,
  ImageFormatPreset,
} from '../../../../marketing-studio/types/imageStudio';
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
import type { VectorGeometry } from '../vectorGeometry';

const DEFAULT_BRAND_TOKENS = {
  brandName: 'VitaBlue',
  primaryColor: '#005F73',
  accentColor: '#EE9B00',
  mintColor: '#94D2BD',
  surfaceBg: '#001219',
  cardBg: 'rgba(15, 23, 42, 0.85)',
  textColor: '#ffffff',
  mutedTextColor: '#94a3b8',
};

const DEFAULT_PRESET = (width: number, height: number): ImageFormatPreset => ({
  id: 'creative-document',
  name: 'Creative document',
  category: 'custom',
  width,
  height,
  aspectRatio: `${width}:${height}`,
  description: 'Imported CreativeDocument canvas',
  iconName: 'Square',
  recommendedFor: 'CreativeDocument',
});

const stringValue = (value: unknown): string | undefined => (typeof value === 'string' ? value : undefined);
const numberValue = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const recordValue = (value: unknown): LegacyRecord | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as LegacyRecord) : undefined;

const legacyExtras = (layer: LegacyImageLayer): LegacyRecord => {
  const mapped = new Set([
    'id', 'type', 'blockType', 'title', 'props', 'position', 'zIndex', 'scale', 'width', 'height',
    'rotation', 'opacity', 'fill', 'stroke', 'strokeWidth', 'cornerRadius', 'fontFamily', 'fontSize',
    'fontWeight', 'fontStyle', 'align', 'letterSpacing', 'lineHeight', 'borderRadius', 'locked', 'visible',
    'crop', 'constraints',
  ]);
  return Object.fromEntries(Object.entries(layer).filter(([key]) => !mapped.has(key)));
};

const shapeKind = (layer: LegacyImageLayer): ShapeKind => {
  const shape = stringValue(layer.props.shape) ?? layer.blockType;
  if (shape === 'circle' || shape === 'ellipse') return 'ellipse';
  if (shape === 'line' || shape === 'polygon' || shape === 'star') return shape;
  if (shape === undefined || shape === 'rectangle' || shape === 'rounded_rect') return 'rectangle';
  throw new Error(`Unsupported Image Studio shape "${shape}"; preserve it as an explicit vector geometry.`);
};

const shapeKindForGeometry = (layer: LegacyImageLayer, geometry: VectorGeometry | undefined): ShapeKind => {
  if (geometry?.kind === 'shape') return geometry.shape;
  if (geometry?.kind === 'path') return 'line';
  return shapeKind(layer);
};

const layerDimensions = (layer: LegacyImageLayer, canvas: { width: number; height: number }): { width: number; height: number } => {
  const fallback = layer.type === 'text' ? Math.max(1, (layer.fontSize ?? 16) * 8) : 100;
  return {
    width: clamp(finitePositive(layer.width, fallback), 1, canvas.width),
    height: clamp(finitePositive(layer.height, fallback), 1, canvas.height),
  };
};

const appearanceFor = (layer: LegacyImageLayer, canvas: { width: number; height: number }): Appearance | undefined => {
  const opacity = clamp(layer.opacity ?? 1, 0, 1);
  const typography =
    layer.type === 'text'
      ? {
          fontFamily: layer.fontFamily ?? 'sans-serif',
          fontSize: finitePositive(layer.fontSize, 16),
          ...(numberValue(Number(layer.fontWeight)) === undefined ? {} : { fontWeight: Number(layer.fontWeight) }),
          ...(layer.lineHeight === undefined ? {} : { lineHeight: finitePositive(layer.lineHeight, 1) }),
          ...(layer.letterSpacing === undefined ? {} : { letterSpacing: layer.letterSpacing }),
          ...(layer.fill === undefined ? {} : { color: layer.fill }),
          ...(layer.align === undefined ? {} : { align: layer.align }),
          ...(layer.fontStyle === undefined ? {} : { italic: layer.fontStyle === 'italic' }),
        }
      : undefined;
  const shadow =
    layer.shadowBlur !== undefined || layer.shadowColor !== undefined
      ? {
          color: layer.shadowColor ?? '#000000',
          offsetX: layer.shadowOffsetX ?? 0,
          offsetY: layer.shadowOffsetY ?? 0,
          blur: Math.max(0, layer.shadowBlur ?? 0),
          ...(layer.shadowOpacity === undefined ? {} : { opacity: clamp(layer.shadowOpacity, 0, 1) }),
        }
      : undefined;
  const borderRadius = layer.borderRadius ?? (typeof layer.cornerRadius === 'number' ? layer.cornerRadius : undefined);
  const appearance: Appearance = {
    opacity,
    ...(layer.fill === undefined || layer.type === 'text' ? {} : { fill: { color: layer.fill } }),
    ...(layer.stroke === undefined ? {} : { stroke: { color: layer.stroke, width: Math.max(0.01, layer.strokeWidth ?? 1) } }),
    ...(typography === undefined ? {} : { typography }),
    ...(shadow === undefined ? {} : { shadow }),
    ...(borderRadius === undefined ? {} : { borderRadius: clamp(borderRadius / Math.min(canvas.width, canvas.height), 0, 1) }),
  };
  return Object.keys(appearance).length > 1 || opacity !== 1 ? appearance : undefined;
};

const imageAsset = (layer: LegacyImageLayer) => {
  const asset = resolveAssetRef(
    [
      { field: 'assetId', value: stringValue(layer.props.assetId) },
      { field: 'src', value: layer.src },
      { field: 'props.imageUrl', value: stringValue(layer.props.imageUrl) },
    ],
    layer.id,
  );
  const alt = stringValue(layer.props.alt);
  const mimeType = stringValue(layer.props.mimeType);
  return {
    ...asset,
    ...(alt === undefined ? {} : { alt }),
    ...(mimeType === undefined ? {} : { mimeType }),
  };
};

const imageCrop = (layer: LegacyImageLayer): Geometry | undefined => {
  const bounds = layer.crop?.bounds;
  if (!bounds) return undefined;
  return {
    x: clamp(bounds.left / 100, 0, 1),
    y: clamp(bounds.top / 100, 0, 1),
    width: clamp((bounds.right - bounds.left) / 100, 1 / 10000, 1),
    height: clamp((bounds.bottom - bounds.top) / 100, 1 / 10000, 1),
  };
};

const groupChildren = (layer: LegacyImageLayer): LegacyImageLayer[] | undefined => {
  if (layer.blockType !== 'CustomGroup') return undefined;
  const children = layer.props.children ?? layer.props.layers;
  return Array.isArray(children) && children.every((child) => recordValue(child)?.id && recordValue(child)?.type)
    ? (children as LegacyImageLayer[])
    : undefined;
};

const toCreativeLayer = (
  layer: LegacyImageLayer,
  canvas: { width: number; height: number },
): CreativeLayer => {
  const dimensions = layerDimensions(layer, canvas);
  const placement = geometryFromLegacyCenter(layer.position, dimensions.width, dimensions.height, canvas);
  const legacy = {
    ...legacyExtras(layer),
    ...(layer.constraints === undefined ? {} : { constraints: layer.constraints }),
    ...(layer.crop === undefined ? {} : { crop: layer.crop }),
  };
  const common = {
    id: layer.id,
    ...(layer.title ? { name: layer.title } : {}),
    transform: {
      position: placement.position,
      anchor: { x: 0.5, y: 0.5 },
      rotation: layer.rotation ?? 0,
      scale: { x: layer.scale || 1, y: layer.scale || 1 },
    },
    geometry: placement.geometry,
    ...(appearanceFor(layer, canvas) === undefined ? {} : { appearance: appearanceFor(layer, canvas) }),
    ...(layer.visible === undefined ? {} : { visible: layer.visible }),
    ...(layer.locked === undefined ? {} : { locked: layer.locked }),
    ...(layer.zIndex === undefined ? {} : { zIndex: layer.zIndex }),
    extensions: withLegacySource(layer as unknown as LegacyRecord, legacy),
  };

  const children = groupChildren(layer);
  if (children) {
    return {
      ...common,
      type: 'group',
      children: children.map((child) => toCreativeLayer(child, canvas)),
    };
  }
  if (layer.type === 'text') {
    const text = stringValue(layer.props.text) ?? stringValue(layer.props.content) ?? layer.title;
    return { ...common, type: 'text', text } satisfies CreativeTextLayer;
  }
  if (layer.type === 'image') {
    return {
      ...common,
      type: 'image',
      asset: imageAsset(layer),
      ...(imageCrop(layer) === undefined ? {} : { crop: imageCrop(layer) }),
    } satisfies CreativeImageLayer;
  }
  const legacyGeometry = vectorGeometryFromLegacy({
    ...layer.props,
    ...(layer.vectorGeometry === undefined ? {} : { vectorGeometry: layer.vectorGeometry }),
  });
  if (layer.type === 'shape' || (layer.type === 'block' && legacyGeometry)) {
    if (!legacyGeometry && layer.type === 'block') {
      return {
        ...common,
        type: 'component',
        componentId: layer.blockType ?? layer.type,
        props: toSafeJsonObject(layer.props),
      };
    }
    return {
      ...common,
      type: 'shape',
      shape: shapeKindForGeometry(layer, legacyGeometry),
      ...(legacyGeometry === undefined ? {} : { vectorGeometry: legacyGeometry }),
    };
  }
  return {
    ...common,
    type: 'component',
    componentId: layer.blockType ?? layer.type,
    props: toSafeJsonObject(layer.props),
  };
};

const projectLegacyExtensions = (project: ImageProject): { legacy: ReturnType<typeof toJsonObject> } => ({
  legacy: toJsonObject({
    source: project,
    ...(project.background.type === 'image' || project.background.type === 'gradient' || project.background.type === 'mesh'
      ? { background: project.background }
      : {}),
  }),
});

export const imageProjectToCreativeDocument = (project: ImageProject): CreativeDocument => {
  const canvas = { width: project.preset.width, height: project.preset.height };
  const layers = project.layers.map((layer) => toCreativeLayer(layer, canvas));
  const collectAssets = (layer: CreativeLayer): CreativeImageLayer['asset'][] => {
    if (layer.type === 'image') return [layer.asset];
    if (layer.type === 'group') return layer.children.flatMap(collectAssets);
    return [];
  };
  const assets = layers.flatMap(collectAssets);
  const uniqueAssets = Array.from(new Map(assets.map((asset) => [asset.assetId, asset])).values());
  return {
    schemaVersion: 1,
    id: project.id,
    name: project.title,
    mode: 'image',
    canvas: {
      id: `${project.id}-canvas`,
      width: canvas.width,
      height: canvas.height,
      ...(project.background.type === 'solid' && project.background.color
        ? { background: { opacity: 1, fill: { color: project.background.color } } }
        : {}),
    },
    scenes: [{ id: `${project.id}-scene`, name: project.title, layers }],
    ...(uniqueAssets.length ? { assets: uniqueAssets } : {}),
    extensions: projectLegacyExtensions(project),
  };
};

const inverseAppearance = (layer: CreativeLayer, canvas: { width: number; height: number }): LegacyRecord => {
  const appearance = layer.appearance;
  const typography = appearance?.typography;
  return {
    ...(appearance?.opacity === undefined ? {} : { opacity: appearance.opacity }),
    ...(appearance?.fill?.color === undefined ? {} : { fill: appearance.fill.color }),
    ...(appearance?.stroke?.color === undefined ? {} : {
      stroke: appearance.stroke.color,
      strokeWidth: appearance.stroke.width,
    }),
    ...(typography === undefined ? {} : {
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      ...(typography.fontWeight === undefined ? {} : { fontWeight: String(typography.fontWeight) }),
      ...(typography.lineHeight === undefined ? {} : { lineHeight: typography.lineHeight }),
      ...(typography.letterSpacing === undefined ? {} : { letterSpacing: typography.letterSpacing }),
      ...(typography.color === undefined ? {} : { fill: typography.color }),
      ...(typography.align === undefined ? {} : { align: typography.align }),
      ...(typography.italic === undefined ? {} : { fontStyle: typography.italic ? 'italic' : 'normal' }),
    }),
    ...(appearance?.shadow === undefined ? {} : {
      shadowColor: appearance.shadow.color,
      shadowBlur: appearance.shadow.blur,
      shadowOffsetX: appearance.shadow.offsetX,
      shadowOffsetY: appearance.shadow.offsetY,
      ...(appearance.shadow.opacity === undefined ? {} : { shadowOpacity: appearance.shadow.opacity }),
    }),
    ...(appearance?.borderRadius === undefined ? {} : {
      borderRadius: Math.round(appearance.borderRadius * Math.min(canvas.width, canvas.height)),
    }),
  };
};

const sourceLayer = (layer: CreativeLayer): LegacyRecord => legacySource(layer.extensions);

const toLegacyLayer = (
  layer: CreativeLayer,
  canvas: { width: number; height: number },
): LegacyImageLayer[] => {
  if (layer.type === 'group') {
    const source = sourceLayer(layer);
    const group: LegacyRecord = {
      ...source,
      id: layer.id,
      type: 'block',
      blockType: 'CustomGroup',
      title: layer.name ?? stringValue(source.title) ?? layer.id,
      props: {
        ...(recordValue(source.props) ?? {}),
        children: layer.children.flatMap((child) => toLegacyLayer(child, canvas)),
      },
      position: legacyCenterFromGeometry(layer.geometry, layer.transform.position, canvas).position,
      zIndex: layer.zIndex ?? numberValue(source.zIndex) ?? 0,
      scale: layer.transform.scale.x,
      width: legacyCenterFromGeometry(layer.geometry, layer.transform.position, canvas).width,
      height: legacyCenterFromGeometry(layer.geometry, layer.transform.position, canvas).height,
      rotation: layer.transform.rotation,
      ...inverseAppearance(layer, canvas),
      ...(layer.visible === undefined ? {} : { visible: layer.visible }),
      ...(layer.locked === undefined ? {} : { locked: layer.locked }),
    };
    return [group as unknown as LegacyImageLayer];
  }
  const source = sourceLayer(layer);
  const placement = legacyCenterFromGeometry(layer.geometry, layer.transform.position, canvas);
  const base: LegacyRecord = {
    ...source,
    id: layer.id,
    title: layer.name ?? stringValue(source.title) ?? layer.id,
    position: placement.position,
    zIndex: layer.zIndex ?? numberValue(source.zIndex) ?? 0,
    scale: layer.transform.scale.x,
    width: placement.width,
    height: placement.height,
    rotation: layer.transform.rotation,
    ...inverseAppearance(layer, canvas),
    ...(layer.visible === undefined ? {} : { visible: layer.visible }),
    ...(layer.locked === undefined ? {} : { locked: layer.locked }),
  };
  if (layer.type === 'text') {
    base.type = 'text';
    base.props = { ...(recordValue(source.props) ?? {}), text: layer.text };
  } else if (layer.type === 'image') {
    base.type = 'image';
    base.src = layer.asset.storagePath;
    base.props = { ...(recordValue(source.props) ?? {}), imageUrl: layer.asset.storagePath };
    if (layer.crop) {
      base.crop = {
        ...(recordValue(source.crop) ?? {}),
        bounds: {
          left: layer.crop.x * 100,
          top: layer.crop.y * 100,
          right: (layer.crop.x + layer.crop.width) * 100,
          bottom: (layer.crop.y + layer.crop.height) * 100,
        },
      };
    }
  } else if (layer.type === 'shape') {
    base.type = 'shape';
    base.props = {
      ...(recordValue(source.props) ?? {}),
      shape: stringValue(recordValue(source.props)?.shape) ?? (layer.shape === 'ellipse' ? 'circle' : layer.shape),
      ...(layer.vectorGeometry === undefined ? {} : vectorGeometryToLegacyProps(layer.vectorGeometry)),
      ...(layer.vectorGeometry === undefined ? {} : { vectorGeometry: layer.vectorGeometry }),
    };
  } else if (layer.type === 'component') {
    const originalType = stringValue(source.type);
    base.type = originalType === 'badge' ? 'badge' : 'block';
    if (stringValue(source.blockType) ?? (originalType === 'block' ? layer.componentId : undefined)) {
      base.blockType = stringValue(source.blockType) ?? layer.componentId;
    }
    base.props = { ...(recordValue(source.props) ?? {}), ...fromJsonObject(layer.props) };
  } else {
    throw new Error(`Unsupported layer type "${layer.type}" in ImageProject conversion.`);
  }
  return [base as unknown as LegacyImageLayer];
};

export const creativeDocumentToImageProject = (document: CreativeDocument): ImageProject => {
  if (document.mode === 'video') {
    throw new Error('Cannot convert a video CreativeDocument to ImageProject.');
  }
  const source = legacySource(document.extensions);
  const sourceProject = recordValue(source.source);
  const background = (sourceProject?.background as CanvasBackground | undefined) ?? { type: 'solid', color: '#ffffff' };
  const layers = document.scenes.flatMap((scene) => scene.layers.flatMap((layer) => toLegacyLayer(layer, document.canvas)));
  const project: ImageProject = {
    ...(sourceProject as Partial<ImageProject> | undefined),
    id: document.id,
    title: document.name,
    preset: (sourceProject?.preset as ImageFormatPreset | undefined) ?? DEFAULT_PRESET(document.canvas.width, document.canvas.height),
    background,
    layers,
    brandTokens: (sourceProject?.brandTokens as ImageProject['brandTokens'] | undefined) ?? DEFAULT_BRAND_TOKENS,
    createdAt: stringValue(sourceProject?.createdAt) ?? new Date(0).toISOString(),
    updatedAt: stringValue(sourceProject?.updatedAt) ?? new Date(0).toISOString(),
  };
  return project;
};
