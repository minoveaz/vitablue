import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { MediaResourceAdapter } from './MediaResource.contract';

export const createMediaResourceAdapter = (
  context: CreativeResourceContext,
  media: MediaResourceAdapter = {},
): CreativeResourceContext => ({
  ...context,
  extensions: {
    ...context.extensions,
    media,
  },
});
