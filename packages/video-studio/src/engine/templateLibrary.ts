import type { VideoFormat, VideoProject } from '../domain/videoProject';
import { defaultVisaRejectionProject } from '../domain/defaultProject';

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
  return { ...project, format, width: preset.width, height: preset.height };
};
