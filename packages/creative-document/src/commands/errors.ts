export type CreativeCommandErrorCode =
  | 'scene-not-found'
  | 'layer-not-found'
  | 'duplicate-layer-id'
  | 'layer-locked'
  | 'invalid-operation'
  | 'invalid-input';

export class CreativeCommandError extends Error {
  readonly code: CreativeCommandErrorCode;
  readonly sceneId?: string;
  readonly layerId?: string;

  constructor(
    code: CreativeCommandErrorCode,
    message: string,
    details: { sceneId?: string; layerId?: string } = {},
  ) {
    super(message);
    this.name = 'CreativeCommandError';
    this.code = code;
    this.sceneId = details.sceneId;
    this.layerId = details.layerId;
  }
}
