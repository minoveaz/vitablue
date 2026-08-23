import type { ImageProject, ImageLayer } from '../types/imageStudio';
import type { Layer, Scene, VideoProject } from '../../packages/video-studio/src/domain/videoProject';
import { VIDEO_SCHEMA_VERSION } from '../../packages/video-studio/src/domain/videoProject';

export const IMAGE_VIDEO_HANDOFF_KEY = 'vitablue:image-video-handoff';

const toVideoLayer = (layer: ImageLayer, durationInFrames: number): Layer => {
  const base = {
    id: layer.id,
    name: layer.title,
    timing: { startFrame: 0, durationInFrames },
    visible: layer.visible,
    locked: layer.locked,
    zIndex: layer.zIndex,
    constraints: layer.constraints,
  };
  if (layer.type === 'text') {
    return { ...base, type: 'text', text: String(layer.props.text ?? layer.title), fontSize: layer.fontSize, color: layer.fill, position: layer.position } as Layer;
  }
  if (layer.type === 'image') {
    return { ...base, type: 'image', asset: { src: layer.src, alt: layer.title }, position: layer.position, width: layer.width, height: layer.height } as Layer;
  }
  if (layer.type === 'shape') {
    return { ...base, type: 'shape', shape: 'rectangle', color: layer.fill, position: layer.position, width: layer.width, height: layer.height } as Layer;
  }
  return { ...base, type: 'component', componentId: layer.blockType ?? 'ImageLayer', props: layer.props, position: layer.position } as Layer;
};

export const createVideoProjectFromImage = (project: ImageProject): VideoProject => {
  const durationInFrames = 150;
  const scene: Scene = {
    id: `image-${project.id}`,
    templateId: 'text_hook',
    durationInFrames,
    content: { sourceImageProjectId: project.id, sourceImageProjectUpdatedAt: project.updatedAt },
    layers: project.layers.map((layer) => toVideoLayer(layer, durationInFrames)),
  };
  return {
    schemaVersion: VIDEO_SCHEMA_VERSION,
    id: `video-from-${project.id}`,
    name: `${project.title} · Video`,
    fps: 30,
    format: project.preset.aspectRatio === '9:16' ? 'vertical' : project.preset.aspectRatio === '1:1' ? 'square' : 'landscape',
    width: project.preset.width,
    height: project.preset.height,
    scenes: [scene],
    metadata: { source: 'image-studio', sourceProjectId: project.id, sourceVersion: project.updatedAt, background: project.background, brandTokens: project.brandTokens },
  };
};

export const saveImageVideoHandoff = (project: ImageProject): VideoProject => {
  const videoProject = createVideoProjectFromImage(project);
  localStorage.setItem(IMAGE_VIDEO_HANDOFF_KEY, JSON.stringify(videoProject));
  return videoProject;
};
