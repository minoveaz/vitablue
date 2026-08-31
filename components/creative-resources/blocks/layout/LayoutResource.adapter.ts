import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { LayoutResourceProps } from './LayoutResource.contract';

export const createLayoutResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<LayoutResourceProps, 'context'> = {},
): LayoutResourceProps => ({ ...props, context });

