import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { BlocksResourceProps } from './BlocksResource.contract';

export const createBlocksResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<BlocksResourceProps, 'context'> = {},
): BlocksResourceProps => ({ ...props, context });

