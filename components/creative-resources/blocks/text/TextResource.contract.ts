import type { ResourceBlockProps } from '../ResourceBlockProps';
import type { TextPresetItem } from './textPresets';

/**
 * The text block accepts the complete preset shape, while keeping the small
 * label/preview shape used by generic resource callers compatible.
 */
export type TextResourceItem = Partial<TextPresetItem> & {
  id: string;
  label?: string;
  preview?: string;
  description?: string;
  payload?: unknown;
  locked?: boolean;
  disabledReason?: string;
};

export type TextResourceProps = ResourceBlockProps<TextResourceItem>;

export interface TextResourceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface TextResourceAdapter {
  getPresets?: () => readonly TextResourceItem[];
  getSavedPresets?: () => readonly TextResourceItem[];
  categories?: readonly TextResourceCategory[];
}
