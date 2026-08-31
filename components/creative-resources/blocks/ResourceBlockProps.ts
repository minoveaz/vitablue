import type { CreativeResourceComponentProps, ResourceActionItem } from '../contracts/creativeResource';

export interface ResourceBlockProps<TItem = ResourceActionItem> extends CreativeResourceComponentProps {
  items?: readonly TItem[];
  onInsert?: (item: TItem) => void;
}

