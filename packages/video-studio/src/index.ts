import { registerRoot } from 'remotion';
import { Root } from './Root';

export * from './domain';
export * from './engine/brandAdapter';
export * from './engine/templateRegistry';
export * from './engine/renderValidation';
export * from './engine/renderService';
export * from './engine/templateLibrary';
export * from './engine/renderJobs';
export * from './engine/renderHttpClient';
export * from './compositions/SceneRenderer';

registerRoot(Root);
