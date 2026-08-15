import { getProjectDurationInFrames } from '../domain/storyboard';
import type { VideoProject } from '../domain/videoProject';
import { assertRenderableProject } from './renderValidation';
import { createPresetProject } from './templateLibrary';
import type { VideoFormat } from '../domain/videoProject';

export interface RenderPlan {
  projectId: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  outputFileName: string;
}

export const createRenderPlan = (project: VideoProject, format: VideoFormat = project.format): RenderPlan => {
  const renderProject = createPresetProject(project, format);
  assertRenderableProject(renderProject);

  return {
    projectId: renderProject.id,
    durationInFrames: getProjectDurationInFrames(renderProject),
    fps: renderProject.fps,
    width: renderProject.width,
    height: renderProject.height,
    outputFileName: `${renderProject.id}-${renderProject.format}.mp4`,
  };
};