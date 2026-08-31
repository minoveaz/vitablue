import type { CreativeResourceContext } from '../../contracts/creativeResource';
import type { ElementsResourceProps } from './ElementsResource.contract';

export const createElementsResourceAdapter = (
  context: CreativeResourceContext,
  props: Omit<ElementsResourceProps, 'context'> = {},
): ElementsResourceProps => ({ ...props, context });

