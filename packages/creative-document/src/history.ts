export interface HistoryEntry<T> {
  readonly state: T;
  readonly label?: string;
}

export interface SemanticHistoryOptions<T> {
  limit?: number;
  clone?: (state: T) => T;
  equals?: (left: T, right: T) => boolean;
}

export interface HistoryApplyOptions {
  label?: string;
}

const cloneValue = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map((item) => cloneValue(item)) as T;
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneValue(item)]),
    ) as T;
  }
  return value;
};
const same = <T>(left: T, right: T): boolean => Object.is(left, right);

/**
 * Renderer/React-neutral semantic snapshot history. A group is deliberately
 * explicit so pointer gestures can commit one semantic operation.
 */
export class SemanticHistory<T> {
  private readonly limit: number;
  private readonly clone: (state: T) => T;
  private readonly equals: (left: T, right: T) => boolean;
  private entries: HistoryEntry<T>[];
  private index = 0;
  private groupDepth = 0;
  private groupStart: T | undefined;
  private groupLabel: string | undefined;
  private groupLatest: T | undefined;

  constructor(initial: T, options: SemanticHistoryOptions<T> = {}) {
    this.limit = Math.max(1, Math.floor(options.limit ?? 50));
    this.clone = options.clone ?? cloneValue;
    this.equals = options.equals ?? same;
    this.entries = [{ state: this.clone(initial) }];
  }

  get present(): T {
    return this.clone(this.entries[this.index].state);
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.entries.length - 1;
  }

  get length(): number {
    return this.entries.length;
  }

  get position(): number {
    return this.index;
  }

  apply(next: T, options: HistoryApplyOptions = {}): T {
    const snapshot = this.clone(next);
    if (this.groupDepth > 0) {
      if (this.groupStart === undefined) this.groupStart = this.entries[this.index].state;
      this.groupLatest = snapshot;
      this.groupLabel = options.label ?? this.groupLabel;
      return this.clone(snapshot);
    }
    if (this.equals(this.entries[this.index].state, snapshot)) return this.present;
    this.entries = [
      ...this.entries.slice(0, this.index + 1),
      { state: snapshot, label: options.label },
    ];
    if (this.entries.length > this.limit) this.entries = this.entries.slice(this.entries.length - this.limit);
    this.index = this.entries.length - 1;
    return this.present;
  }

  beginGroup(label?: string): void {
    if (this.groupDepth === 0) {
      this.groupStart = this.entries[this.index].state;
      this.groupLatest = undefined;
      this.groupLabel = label;
    }
    this.groupDepth += 1;
  }

  endGroup(): T {
    if (this.groupDepth === 0) return this.present;
    this.groupDepth -= 1;
    if (this.groupDepth > 0) return this.present;
    const start = this.groupStart;
    const latest = this.groupLatest;
    const label = this.groupLabel;
    this.groupStart = undefined;
    this.groupLatest = undefined;
    this.groupLabel = undefined;
    if (start !== undefined && latest !== undefined && !this.equals(start, latest)) {
      this.apply(latest, { label });
    }
    return this.present;
  }

  group<R>(label: string | undefined, operation: () => R): R {
    this.beginGroup(label);
    try {
      return operation();
    } finally {
      this.endGroup();
    }
  }

  undo(): T {
    if (this.canUndo) this.index -= 1;
    return this.present;
  }

  redo(): T {
    if (this.canRedo) this.index += 1;
    return this.present;
  }

  clear(): void {
    this.entries = [this.entries[this.index]];
    this.index = 0;
  }

  entriesSnapshot(): readonly HistoryEntry<T>[] {
    return this.entries.map((entry) => ({ ...entry, state: this.clone(entry.state) }));
  }
}

export const createSemanticHistory = <T>(
  initial: T,
  options?: SemanticHistoryOptions<T>,
): SemanticHistory<T> => new SemanticHistory(initial, options);

export const canUndo = <T>(history: SemanticHistory<T>): boolean => history.canUndo;
export const canRedo = <T>(history: SemanticHistory<T>): boolean => history.canRedo;
