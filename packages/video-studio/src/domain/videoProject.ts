export const VIDEO_SCHEMA_VERSION = 'video-schema-v1' as const;

export type VideoFormat = 'vertical' | 'square' | 'landscape';

export type SceneTemplateId =
  | 'text_hook'
  | 'provider_logos'
  | 'requirements_list'
  | 'advisor_cta';

export type LayerType = 'text' | 'image' | 'video' | 'shape' | 'component' | 'audio';

export type TransitionType = 'none' | 'fade' | 'slide';

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
  timing?: LayerTiming;
  visible?: boolean;
  locked?: boolean;
}

export interface TextLayer extends LayerBase {
  type: 'text';
  text: string;
}

export interface ImageLayer extends LayerBase {
  type: 'image';
  asset: AssetRef;
  alt?: string;
}

export interface VideoLayer extends LayerBase {
  type: 'video';
  asset: AssetRef;
}

export interface ShapeLayer extends LayerBase {
  type: 'shape';
  shape: 'rectangle' | 'circle';
}

export interface ComponentLayer extends LayerBase {
  type: 'component';
  componentId: string;
  props: Record<string, unknown>;
}

export interface AudioLayer extends LayerBase {
  type: 'audio';
  src: string;
  volume?: number;
}

export type Layer =
  | TextLayer
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
}

export interface VideoProjectRepository {
  load(projectId: string): Promise<VideoProject | null>;
  save(project: VideoProject): Promise<void>;
  duplicate(projectId: string): Promise<VideoProject>;
}

export interface SceneTiming {
  scene: Scene;
  startFrame: number;
  endFrame: number;
}

export interface ProjectValidationIssue {
  code:
    | 'empty_project_id'
    | 'empty_scene_id'
    | 'duplicate_scene_id'
    | 'invalid_fps'
    | 'invalid_dimensions'
    | 'invalid_scene_duration'
    | 'empty_scene_template'
    | 'unregistered_scene_template'
    | 'invalid_transition_duration'
    | 'invalid_layer_timing';
  message: string;
  sceneId?: string;
  layerId?: string;
}
