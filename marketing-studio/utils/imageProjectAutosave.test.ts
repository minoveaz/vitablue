import { describe, expect, it } from 'vitest';
import type { ImageProject } from '../types/imageStudio';
import { CreativeProjectConflictError } from './creativeProjectRepository';
import {
  createImageProjectAutosaveQueue,
  mergeImageProjects,
} from './imageProjectAutosave';

const project = (layers: ImageProject['layers'], updatedAt = '2026-08-28T00:00:00.000Z'): ImageProject => ({
  id: '10000000-0000-4000-8000-000000000001',
  title: 'Inserción de bloques',
  preset: { id: 'square', name: 'Cuadrado', width: 1080, height: 1080, aspectRatio: '1:1' } as ImageProject['preset'],
  background: { type: 'solid', color: '#001219' },
  brandTokens: {} as ImageProject['brandTokens'],
  layers,
  createdAt: '2026-08-27T00:00:00.000Z',
  updatedAt: updatedAt,
  autosaveRevision: 4,
  currentVersionNumber: 4,
});

const layer = (id: string, title: string) => ({
  id,
  type: 'block' as const,
  blockType: 'GeometricShape' as const,
  title,
  props: {},
  position: { x: 50, y: 50 },
  zIndex: 1,
  scale: 1,
});

describe('Image Studio autosave queue', () => {
  it('serializes writes and keeps only the latest pending block insertion', async () => {
    const base = project([]);
    const firstWrite = project([layer('remote', 'Remoto')], '2026-08-28T00:00:01.000Z');
    const latest = project([layer('local-block', 'Bloque local'), layer('local-second', 'Segundo bloque')]);
    const calls: ImageProject[] = [];
    let releaseFirst!: () => void;
    const firstPending = new Promise<void>((resolve) => { releaseFirst = resolve; });
    let activeWrites = 0;
    let maxActiveWrites = 0;
    const savedResponses: ImageProject[] = [];
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        activeWrites += 1;
        maxActiveWrites = Math.max(maxActiveWrites, activeWrites);
        calls.push(next);
        if (calls.length === 1) await firstPending;
        activeWrites -= 1;
        return calls.length === 1 ? firstWrite : { ...next, updatedAt: '2026-08-28T00:00:02.000Z', autosaveRevision: 6 };
      },
      getCurrentProject: () => latest,
      onSaved: (saved) => { savedResponses.push(saved); },
      onConflictMerge: () => {},
      onError: (error) => { throw error; },
    });

    queue.enqueue(project([layer('local-block', 'Bloque local')]));
    const firstDrain = queue.flush();
    await Promise.resolve();
    queue.enqueue(latest);
    releaseFirst();
    await firstDrain;
    await queue.flush();

    expect(maxActiveWrites).toBe(1);
    expect(calls).toHaveLength(2);
    expect(calls[1].layers.map((item) => item.id)).toEqual(['local-block', 'local-second']);
    expect(savedResponses.at(-1)).toMatchObject({
      updatedAt: '2026-08-28T00:00:02.000Z',
      autosaveRevision: 6,
    });
    queue.dispose();
  });

  it('reports saving while a latest-wins snapshot is pending and saved only after the final write', async () => {
    const base = project([]);
    const latest = project([layer('latest', 'Último bloque')]);
    const statuses: string[] = [];
    let releaseFirst!: () => void;
    const firstPending = new Promise<void>((resolve) => { releaseFirst = resolve; });
    let calls = 0;
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        calls += 1;
        if (calls === 1) await firstPending;
        return { ...next, updatedAt: `2026-08-28T00:00:0${calls}.000Z` };
      },
      getCurrentProject: () => latest,
      onSaved: (_saved, _snapshot, { hasPendingChanges }) => {
        statuses.push(hasPendingChanges ? 'saving' : 'saved');
      },
      onConflictMerge: () => {},
      onError: (error) => { throw error; },
    });

    queue.enqueue(project([layer('first', 'Primer bloque')]));
    const firstDrain = queue.flush();
    await Promise.resolve();
    queue.enqueue(latest);
    releaseFirst();
    await firstDrain;
    await queue.flush();

    expect(statuses).toEqual(['saving', 'saved']);
    queue.dispose();
  });

  it('finishes saved after one real edit when the acknowledgement updates persistence metadata', async () => {
    const base = project([]);
    const edit = project([layer('edited', 'Editado')], '2026-08-28T00:00:01.000Z');
    const acknowledgement = {
      ...edit,
      updatedAt: '2026-08-28T00:00:02.000Z',
      autosaveRevision: 5,
      currentVersionNumber: 5,
    };
    const statuses: string[] = [];
    const calls: ImageProject[] = [];
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        calls.push(next);
        return acknowledgement;
      },
      getCurrentProject: () => edit,
      onSaved: (saved, _snapshot, { hasPendingChanges }) => {
        statuses.push(hasPendingChanges ? 'saving' : 'saved');
        // Mirror the editor's state update caused by the server response.
        queue.enqueue(saved);
      },
      onConflictMerge: () => {},
      onError: (error) => { throw error; },
    });

    queue.enqueue(edit);
    await queue.flush();

    expect(calls).toHaveLength(1);
    expect(statuses).toEqual(['saved']);
    queue.dispose();
  });

  it('does not reopen the queue for acknowledgement metadata while a write is in flight', async () => {
    const base = project([]);
    const edit = project([layer('edited', 'Editado')]);
    let release!: () => void;
    const writePending = new Promise<void>((resolve) => { release = resolve; });
    const calls: ImageProject[] = [];
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        calls.push(next);
        await writePending;
        return { ...next, updatedAt: '2026-08-28T00:00:02.000Z', autosaveRevision: 5 };
      },
      getCurrentProject: () => ({ ...edit, updatedAt: '2026-08-28T00:00:03.000Z', autosaveRevision: 5 }),
      onSaved: () => {},
      onConflictMerge: () => {},
      onError: (error) => { throw error; },
    });

    queue.enqueue(edit);
    const drain = queue.flush();
    await Promise.resolve();
    expect(queue.enqueue({ ...edit, updatedAt: '2026-08-28T00:00:01.000Z', autosaveRevision: 5 })).toBe(false);
    release();
    await drain;

    expect(calls).toHaveLength(1);
    queue.dispose();
  });

  it('keeps the failed work available and retries it to a saved state', async () => {
    const base = project([]);
    const edit = project([layer('retry', 'Reintentar')]);
    const statuses: string[] = [];
    let attempts = 0;
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        attempts += 1;
        if (attempts < 4) throw new Error('network');
        return { ...next, updatedAt: '2026-08-28T00:00:04.000Z' };
      },
      getCurrentProject: () => edit,
      onSaved: (_saved, _snapshot, { hasPendingChanges }) => {
        statuses.push(hasPendingChanges ? 'saving' : 'saved');
      },
      onConflictMerge: () => {},
      onError: () => { statuses.push('error'); },
    });

    queue.enqueue(edit);
    await queue.flush();
    expect(statuses).toEqual(['error']);
    expect(queue.retry()).toBe(true);
    await queue.flush();

    expect(statuses).toEqual(['error', 'saved']);
    expect(attempts).toBe(4);
    queue.dispose();
  });

  it('cancels an in-flight write without emitting a stale saved callback', async () => {
    const base = project([]);
    let release!: () => void;
    const writePending = new Promise<void>((resolve) => { release = resolve; });
    let cancelled = 0;
    let saved = 0;
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        await writePending;
        return next;
      },
      getCurrentProject: () => base,
      onSaved: () => { saved += 1; },
      onConflictMerge: () => {},
      onError: (error) => { throw error; },
      onCancelled: () => { cancelled += 1; },
    });

    queue.enqueue(project([layer('pending', 'Pendiente')]));
    const drain = queue.flush();
    await Promise.resolve();
    queue.dispose();
    release();
    await drain;

    expect(cancelled).toBe(1);
    expect(saved).toBe(0);
  });

  it('reloads on conflict and merges a locally inserted block with remote changes', async () => {
    const base = project([]);
    const remote = project([layer('remote', 'Remoto')], '2026-08-28T00:00:01.000Z');
    const local = project([layer('local-block', 'Bloque local')]);
    const saved: ImageProject[] = [];
    let attempts = 0;
    let merged: ImageProject | undefined;
    const queue = createImageProjectAutosaveQueue({
      initialServerProject: base,
      debounceMs: 0,
      save: async (next) => {
        attempts += 1;
        if (attempts === 1) throw new CreativeProjectConflictError();
        saved.push(next);
        return { ...next, updatedAt: '2026-08-28T00:00:02.000Z', autosaveRevision: 6, currentVersionNumber: 6 };
      },
      reload: async () => remote,
      getCurrentProject: () => local,
      onSaved: () => {},
      onConflictMerge: (next) => { merged = next; },
      onError: (error) => { throw error; },
    });

    queue.enqueue(local);
    await queue.flush();

    const conflictMerged = merged as ImageProject;
    expect(saved).toHaveLength(1);
    expect(saved[0].layers.map((item) => item.id)).toEqual(['local-block', 'remote']);
    expect(conflictMerged.layers.map((item) => item.id)).toEqual(['local-block', 'remote']);
    expect(conflictMerged.updatedAt).toBe(remote.updatedAt);
    queue.dispose();
  });

  it('uses local fields in a three-way merge without discarding remote fields', () => {
    const base = project([]);
    const remote = { ...project([layer('remote', 'Remoto')]), title: 'Título remoto' };
    const local = { ...project([layer('local', 'Local')]), title: 'Título local' };
    const merged = mergeImageProjects(base, remote, local);

    expect(merged.title).toBe('Título local');
    expect(merged.layers.map((item) => item.id)).toEqual(['local', 'remote']);
  });
});
