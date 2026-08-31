import type { ReactNode } from 'react';

export type CreativeResourceDomain = 'image' | 'video';
export type CreativeResourceState = 'ready' | 'loading' | 'error' | 'disabled';

export type CreativeResourceBlockId =
  | 'text'
  | 'elements'
  | 'media'
  | 'layers'
  | 'backgrounds'
  | 'layout'
  | 'brand'
  | 'blocks'
  | 'templates'
  | 'prepare-video';

export interface CreativeResourceSelection {
  readonly layerIds: readonly string[];
  readonly sceneId?: string;
}

export interface CreativeResourceSelectOptions {
  readonly additive?: boolean;
}

export interface CreativeResourceActions<TInsert = never, TUpdate = never> {
  insert?: (payload: TInsert) => void;
  upload?: (file: File) => void | Promise<void>;
  update?: (payload: TUpdate) => void;
  remove?: (id: string) => void;
  select?: (id: string, options?: CreativeResourceSelectOptions) => void;
  toggleVisibility?: (id: string) => void;
  toggleLock?: (id: string) => void;
  move?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  reorder?: (ids: readonly string[]) => void;
  rename?: (id: string, title: string) => void;
  duplicate?: (id: string) => void;
}

export interface CreativeResourceContext<
  TState = unknown,
  TActions extends CreativeResourceActions<never, never> = CreativeResourceActions,
> {
  readonly domain: CreativeResourceDomain;
  readonly documentId: string;
  readonly capabilities: readonly string[];
  readonly selection: CreativeResourceSelection;
  readonly state: CreativeResourceState;
  readonly data?: TState;
  readonly actions: TActions;
  /** Optional domain-specific extensions consumed by shared resource blocks. */
  readonly extensions?: Readonly<Record<string, unknown>>;
  readonly error?: string;
}

export interface ResourceActionItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
  readonly onSelect?: () => void;
}

export interface CreativeResourceSlots {
  readonly content?: ReactNode;
  readonly footer?: ReactNode;
}

export interface CreativeResourceComponentProps {
  readonly context: CreativeResourceContext;
  readonly slots?: CreativeResourceSlots;
}
