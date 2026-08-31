/**
 * Renderer-neutral creative document contract.
 *
 * Positions and bounds use a top-left origin and normalized values. Pixel
 * dimensions belong to the canvas metadata; visual precision belongs to
 * Appearance and not to Geometry.
 */
import type { VectorGeometry } from './vectorGeometry';

export const CREATIVE_DOCUMENT_SCHEMA_VERSION = 1 as const;
export type CreativeDocumentSchemaVersion = typeof CREATIVE_DOCUMENT_SCHEMA_VERSION;

export type CreativeDocumentMode = 'image' | 'video' | 'mixed';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export interface LegacyExtensions {
  legacy?: JsonObject;
  imageStudio?: JsonObject;
  videoStudio?: JsonObject;
  /** Renderer-neutral escape hatch for temporal editor capabilities. */
  temporal?: TemporalExtensions;
  [extension: string]: unknown;
}

export interface Keyframe {
  timeMs: number;
  value: JsonValue;
  easing?: string;
}

export interface TemporalExtensions {
  keyframes?: { [property: string]: Keyframe[] };
  animation?: JsonObject;
  audio?: JsonObject;
  transition?: JsonObject;
  [extension: string]: unknown;
}

export interface Point {
  x: number;
  y: number;
}

export interface Geometry {
  /** Normalized left edge, with a top-left origin. */
  x: number;
  /** Normalized top edge, with a top-left origin. */
  y: number;
  /** Normalized width. */
  width: number;
  /** Normalized height. */
  height: number;
}

export interface Transform {
  /** Normalized position of the layer's anchor. */
  position: Point;
  /** Explicit normalized anchor, where (0, 0) is the top-left corner. */
  anchor: Point;
  /** Rotation in degrees, clockwise. */
  rotation: number;
  /** Multipliers applied after geometry; these are not canvas coordinates. */
  scale: Point;
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn';

export interface FillAppearance {
  color: string;
  opacity?: number;
}

export type StrokeLineCap = 'butt' | 'round' | 'square';
export type StrokeLineJoin = 'miter' | 'round' | 'bevel';

export interface StrokeAppearance {
  color: string;
  width: number;
  opacity?: number;
  lineCap?: StrokeLineCap;
  lineJoin?: StrokeLineJoin;
  dash?: number[];
}

export interface TypographyAppearance {
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  italic?: boolean;
  underline?: boolean;
}

export interface ShadowAppearance {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread?: number;
  opacity?: number;
}

export interface Appearance {
  opacity: number;
  blendMode?: BlendMode;
  fill?: FillAppearance;
  stroke?: StrokeAppearance;
  typography?: TypographyAppearance;
  shadow?: ShadowAppearance;
  borderRadius?: number;
}

export interface CreativeAssetRef {
  /** Stable asset identity; bytes are resolved outside the document. */
  assetId: string;
  /** Logical storage path, never a data/blob URL or a signed URL. */
  storagePath: string;
  alt?: string;
  mimeType?: string;
}

/** Legacy name kept for adapters and existing editor integrations. */
export type AssetRef = CreativeAssetRef;

export interface Timing {
  /** Milliseconds from the beginning of the containing scene/document. */
  startMs: number;
  /** Positive duration in milliseconds. */
  durationMs: number;
}

export interface CreativeLayerBase {
  id: string;
  name?: string;
  transform: Transform;
  geometry: Geometry;
  appearance?: Appearance;
  timing?: Timing;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  /**
   * Layout constraints are intentionally renderer-neutral.  Image and Video
   * keep their richer legacy constraint payload here while migrating callers
   * to a shared layout contract.
   */
  constraints?: JsonObject;
  extensions?: LegacyExtensions;
}

export interface TextLayer extends CreativeLayerBase {
  type: 'text';
  text: string;
}

export type ShapeKind = 'rectangle' | 'ellipse' | 'line' | 'polygon' | 'star';

export interface ShapeLayer extends CreativeLayerBase {
  type: 'shape';
  shape: ShapeKind;
  /** Optional precise geometry; absent means the legacy primitive shape. */
  vectorGeometry?: VectorGeometry;
}

export interface ImageLayer extends CreativeLayerBase {
  type: 'image';
  asset: AssetRef;
  crop?: Geometry;
}

export interface VideoLayer extends CreativeLayerBase {
  type: 'video';
  asset: AssetRef;
  crop?: Geometry;
}

export interface AudioLayer extends CreativeLayerBase {
  type: 'audio';
  asset: AssetRef;
  volume?: number;
}

export interface ComponentLayer extends CreativeLayerBase {
  type: 'component';
  componentId: string;
  props?: JsonObject;
}

export interface GroupLayer extends CreativeLayerBase {
  type: 'group';
  children: CreativeLayer[];
  clipContent?: boolean;
}

export type CreativeLayer =
  | TextLayer
  | ShapeLayer
  | ImageLayer
  | VideoLayer
  | AudioLayer
  | ComponentLayer
  | GroupLayer;

export interface CreativeCanvas {
  id: string;
  width: number;
  height: number;
  background?: Appearance;
  extensions?: LegacyExtensions;
}

export interface CreativeScene {
  id: string;
  name?: string;
  layers: CreativeLayer[];
  timing?: Timing;
  extensions?: LegacyExtensions;
}

export interface CreativeDocument {
  schemaVersion: CreativeDocumentSchemaVersion;
  id: string;
  name: string;
  mode: CreativeDocumentMode;
  canvas: CreativeCanvas;
  scenes: CreativeScene[];
  assets?: AssetRef[];
  extensions?: LegacyExtensions;
}
