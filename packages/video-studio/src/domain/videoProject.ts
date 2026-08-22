import type { LayerLayoutConstraints, LayoutProjectMetadata } from './layoutConstraints';

export const VIDEO_SCHEMA_VERSION = 'video-schema-v1' as const;
export type VideoFormat = 'vertical' | 'square' | 'landscape';

export type SceneTemplateId =
  | 'text_hook'
  | 'provider_logos'
  | 'requirements_list'
  | 'advisor_cta';

export type LayerType = 'text' | 'subtitle' | 'image' | 'video' | 'shape' | 'component' | 'audio';

export type TransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'wipe';

export type TextAnimationType = 'none' | 'fade' | 'pop' | 'slide-up' | 'typewriter';
export type SubtitleStylePreset = 'viral-yellow' | 'classic-box' | 'clean-white';

export interface AssetRef {
  assetId?: string;
  src?: string;
  alt?: string;
}

export interface LayerTiming {
  startFrame: number;
  durationInFrames: number;
}

export interface LayerBase {
  id: string;
  name?: string;
  timing?: LayerTiming;
  visible?: boolean;
  locked?: boolean;
  zIndex?: number;
  /** Shared with Image Studio so format changes retain intent, not pixels. */
  constraints?: LayerLayoutConstraints;
}

export interface TextLayer extends LayerBase {
  type: 'text';
  text: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  position?: { x: number; y: number } | 'top' | 'center' | 'bottom';
  align?: 'left' | 'center' | 'right';
  animation?: TextAnimationType;
}

export interface SubtitleLayer extends LayerBase {
  type: 'subtitle';
  text: string;
  highlightWords?: string[];
  stylePreset?: SubtitleStylePreset;
  fontSize?: number;
  color?: string;
  position?: { x: number; y: number } | 'bottom' | 'center' | 'top';
  animation?: TextAnimationType;
}

export interface ImageLayer extends LayerBase {
  type: 'image';
  asset: AssetRef;
  alt?: string;
  position?: { x: number; y: number } | 'top' | 'center' | 'bottom';
  width?: number;
  height?: number;
}

export interface VideoLayer extends LayerBase {
  type: 'video';
  asset: AssetRef;
  position?: { x: number; y: number } | 'top' | 'center' | 'bottom';
  width?: number;
  height?: number;
}

export interface ShapeLayer extends LayerBase {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'pill' | 'badge';
  color?: string;
  opacity?: number;
  width?: number;
  height?: number;
  position?: { x: number; y: number } | 'top' | 'center' | 'bottom';
}

export interface ComponentLayer extends LayerBase {
  type: 'component';
  componentId: string;
  props: Record<string, unknown>;
  position?: { x: number; y: number } | 'top' | 'center' | 'bottom';
}

export interface AudioLayer extends LayerBase {
  type: 'audio';
  src: string;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export type Layer =
  | TextLayer
  | SubtitleLayer
  | ImageLayer
  | VideoLayer
  | ShapeLayer
  | ComponentLayer
  | AudioLayer;

export interface TransitionConfig {
  type: TransitionType;
  durationInFrames?: number;
}

export interface Scene {
  id: string;
  templateId: SceneTemplateId;
  durationInFrames: number;
  layers: Layer[];
  content: Record<string, unknown>;
  transition?: TransitionConfig;
}

export interface AudioTrack {
  id: string;
  name?: string;
  src: string;
  startFrame: number;
  durationInFrames?: number;
  volume?: number;
}

export interface VideoProject {
  schemaVersion: typeof VIDEO_SCHEMA_VERSION;
  id: string;
  name: string;
  fps: number;
  format: VideoFormat;
  width: number;
  height: number;
  scenes: Scene[];
  audio?: AudioTrack[];
  metadata?: Record<string, unknown>;
  layout?: LayoutProjectMetadata;
}

export interface VideoProjectRepository {
  load(projectId: string): Promise<VideoProject | null>;
  save(project: VideoProject): Promise<void>;
  list(): Promise<Array<{ id: string; name: string; updatedAt: string }>>;
}

export interface SceneTiming {
  scene: Scene;
  startFrame: number;
  endFrame: number;
}

export interface ValidationIssue {
  type?: 'error' | 'warning';
  message: string;
  code?: string;
  sceneId?: string;
  layerId?: string;
  field?: string;
}

export type ProjectValidationIssue = ValidationIssue;

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface VideoProjectValidator {
  validate(project: VideoProject): ValidationResult;
}

export interface RenderRequest {
  projectId: string;
  project: VideoProject;
  outputPath?: string;
  quality?: 'draft' | 'production';
}

export interface RenderResult {
  success: boolean;
  outputPath?: string;
  durationSeconds?: number;
  error?: string;
}

export function resolveLayerPosition(position: { x: number; y: number } | string | undefined, defaultY = 50): { x: number; y: number } {
  if (typeof position === 'object' && position !== null) {
    return {
      x: Math.max(0, Math.min(100, position.x)),
      y: Math.max(0, Math.min(100, position.y)),
    };
  }
  if (position === 'top') return { x: 50, y: 15 };
  if (position === 'center') return { x: 50, y: 50 };
  if (position === 'bottom') return { x: 50, y: 80 };
  return { x: 50, y: defaultY };
}
