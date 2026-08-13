import {
  type ProjectValidationIssue,
  type SceneTiming,
  type VideoProject,
} from './videoProject';

export const getSceneTimings = (project: VideoProject): SceneTiming[] => {
  let startFrame = 0;

  return project.scenes.map((scene) => {
    const timing = {
      scene,
      startFrame,
      endFrame: startFrame + scene.durationInFrames,
    };

    startFrame = timing.endFrame;
    return timing;
  });
};

export const getProjectDurationInFrames = (project: VideoProject): number =>
  project.scenes.reduce((total, scene) => total + scene.durationInFrames, 0);

export const getActiveSceneTiming = (
  project: VideoProject,
  frame: number,
): SceneTiming | null => {
  if (frame < 0) return null;

  return (
    getSceneTimings(project).find(
      ({ startFrame, endFrame }) => frame >= startFrame && frame < endFrame,
    ) ?? null
  );
};

export const validateVideoProject = (
  project: VideoProject,
): ProjectValidationIssue[] => {
  const issues: ProjectValidationIssue[] = [];
  const sceneIds = new Set<string>();

  if (!project.id.trim()) {
    issues.push({ code: 'empty_project_id', message: 'The project id is required.' });
  }

  if (!Number.isInteger(project.fps) || project.fps <= 0) {
    issues.push({ code: 'invalid_fps', message: 'FPS must be a positive integer.' });
  }

  if (project.width <= 0 || project.height <= 0) {
    issues.push({ code: 'invalid_dimensions', message: 'Video dimensions must be positive.' });
  }

  for (const scene of project.scenes) {
    if (!scene.id.trim()) {
      issues.push({ code: 'empty_scene_id', message: 'Every scene needs an id.' });
    }

    if (sceneIds.has(scene.id)) {
      issues.push({
        code: 'duplicate_scene_id',
        message: `Scene id "${scene.id}" is duplicated.`,
        sceneId: scene.id,
      });
    }
    sceneIds.add(scene.id);

    if (!Number.isInteger(scene.durationInFrames) || scene.durationInFrames <= 0) {
      issues.push({
        code: 'invalid_scene_duration',
        message: 'Scene duration must be a positive integer.',
        sceneId: scene.id,
      });
    }

    if (!scene.templateId.trim()) {
      issues.push({
        code: 'empty_scene_template',
        message: 'Every scene needs a template id.',
        sceneId: scene.id,
      });
    }

    if (
      scene.transition?.durationInFrames !== undefined &&
      (!Number.isInteger(scene.transition.durationInFrames) ||
        scene.transition.durationInFrames < 0)
    ) {
      issues.push({
        code: 'invalid_transition_duration',
        message: 'Transition duration must be a non-negative integer.',
        sceneId: scene.id,
      });
    }
  }

  return issues;
};
