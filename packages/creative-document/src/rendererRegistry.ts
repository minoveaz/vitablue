import type { VectorGeometry } from './vectorGeometry';

/** A renderer adapter owns its host (Konva, DOM, Remotion, canvas, ...). */
export interface VectorRenderer<TContext = unknown, TResult = unknown> {
  id: string;
  supports(geometry: VectorGeometry): boolean;
  render(geometry: VectorGeometry, context: TContext): TResult;
}

export interface VectorRendererRegistry<TContext = unknown, TResult = unknown> {
  register(renderer: VectorRenderer<TContext, TResult>): void;
  unregister(id: string): boolean;
  get(id: string): VectorRenderer<TContext, TResult> | undefined;
  resolve(geometry: VectorGeometry): VectorRenderer<TContext, TResult> | undefined;
  list(): readonly VectorRenderer<TContext, TResult>[];
}

export const createVectorRendererRegistry = <TContext = unknown, TResult = unknown>(): VectorRendererRegistry<TContext, TResult> => {
  const renderers = new Map<string, VectorRenderer<TContext, TResult>>();
  return {
    register(renderer) {
      if (!renderer.id.trim()) throw new Error('A vector renderer requires a non-empty id.');
      if (renderers.has(renderer.id)) throw new Error(`Vector renderer "${renderer.id}" is already registered.`);
      renderers.set(renderer.id, renderer);
    },
    unregister: (id) => renderers.delete(id),
    get: (id) => renderers.get(id),
    resolve: (geometry) => Array.from(renderers.values()).find((renderer) => renderer.supports(geometry)),
    list: () => Array.from(renderers.values()),
  };
};
