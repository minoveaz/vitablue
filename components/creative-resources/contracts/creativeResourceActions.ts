import type { CreativeResourceActions } from './creativeResource';

export type CreativeResourceActionPayload<TInsert = unknown, TUpdate = unknown> =
  CreativeResourceActions<TInsert, TUpdate>;

export type ResourceItemAction<T> = (item: T) => void;
