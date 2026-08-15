import { validateVideoProject } from '../domain/storyboard';
import type { ProjectValidationIssue, VideoProject } from '../domain/videoProject';
import { isRegisteredVideoTemplate } from './templateRegistry';

export const validateRenderProject = (project: VideoProject): ProjectValidationIssue[] => {
  const issues = validateVideoProject(project);

  for (const scene of project.scenes) {
    if (!isRegisteredVideoTemplate(scene.templateId)) {
      issues.push({
        code: 'unregistered_scene_template',
        message: `Scene template "${scene.templateId}" is not registered.`,
        sceneId: scene.id,
      });
    }
  }

  return issues;
};

export const assertRenderableProject = (project: VideoProject): void => {
  const issues = validateRenderProject(project);

  if (issues.length > 0) {
    throw new Error(`Video project is not renderable:\n${issues.map(({ message }) => `- ${message}`).join('\n')}`);
  }
};