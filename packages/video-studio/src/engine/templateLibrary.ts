import type { VideoFormat, VideoProject } from '../domain/videoProject';
import { defaultVisaRejectionProject } from '../domain/defaultProject';
import {
  createDefaultLayoutMetadata,
  resizeLayerForFormat,
} from '../domain/layoutConstraints';

export interface VideoFormatPreset {
  id: string;
  label: string;
  format: VideoFormat;
  width: number;
  height: number;
}

export const videoFormatPresets: Readonly<Record<string, VideoFormatPreset>> = {
  vertical: { id: 'vertical', label: 'Vertical 9:16', format: 'vertical', width: 1080, height: 1920 },
  square: { id: 'square', label: 'Square 1:1', format: 'square', width: 1080, height: 1080 },
  landscape: { id: 'landscape', label: 'Landscape 16:9', format: 'landscape', width: 1920, height: 1080 },
};

export interface VideoTemplatePreset {
  id: string;
  version: number;
  label: string;
  project: VideoProject;
}

export const videoTemplatePresets: Readonly<Record<string, VideoTemplatePreset>> = {
  visa_rejection: {
    id: 'visa_rejection',
    version: 1,
    label: 'Visa rejection reel',
    project: defaultVisaRejectionProject,
  },
};

export const createPresetProject = (project: VideoProject, format: VideoFormat): VideoProject => {
  const preset = videoFormatPresets[format];
  if (!preset) throw new Error(`Unknown video format: ${format}`);
  const layout = {
    ...createDefaultLayoutMetadata(),
    ...(project.layout ?? {}),
  };
  const scenes = project.scenes.map((scene) => ({
    ...scene,
    layers: scene.layers.map((layer) => {
      const candidate = layer as typeof layer & {
        position?: { x: number; y: number };
        width?: number;
        height?: number;
      };
      if (layer.locked || typeof candidate.position !== 'object' || !candidate.position) return layer;
      const resized = resizeLayerForFormat(
        {
          position: candidate.position,
          width: candidate.width,
          height: candidate.height,
          scale: 1,
          ...(typeof layer === 'object' && 'fontSize' in layer ? { fontSize: layer.fontSize } : {}),
        },
        { width: project.width, height: project.height },
        { width: preset.width, height: preset.height },
        layer.constraints,
        layout.defaultLayerConstraints
      );
      return {
        ...layer,
        position: resized.position,
        ...(resized.width === undefined ? {} : { width: resized.width }),
        ...(resized.height === undefined ? {} : { height: resized.height }),
        ...(resized.fontSize === undefined || !('fontSize' in layer) ? {} : { fontSize: resized.fontSize }),
      };
    }),
  }));
  return { ...project, format, width: preset.width, height: preset.height, layout, scenes };
};
