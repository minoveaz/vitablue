import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { BackgroundsResourceProps } from './BackgroundsResource.contract';

export const createBackgroundsResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<BackgroundsResourceProps, 'context'> = {},
): BackgroundsResourceProps => ({ ...props, context });

