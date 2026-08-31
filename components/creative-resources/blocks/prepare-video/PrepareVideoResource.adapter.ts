import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { PrepareVideoResourceProps } from './PrepareVideoResource.contract';

export const createPrepareVideoResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<PrepareVideoResourceProps, 'context'> = {},
): PrepareVideoResourceProps => ({ ...props, context });

