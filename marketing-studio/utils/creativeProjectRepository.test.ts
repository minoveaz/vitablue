import { describe, expect, it } from 'vitest';
import {
  CreativeProjectConflictError,
  createIndexedDbCreativeProjectRepository,
  createResilientCreativeProjectRepository,
  type CreativeProjectRepository,
} from './creativeProjectRepository';
import type { CreativeScope } from '../contracts/creativePersistence';

const scope: CreativeScope = {
  organizationId: '10000000-0000-4000-8000-000000000101',
  workspaceId: '10000000-0000-4000-8000-000000000102',
  brandId: '10000000-0000-4000-8000-000000000103',
};

const project = {
  ...scope,
  ownerUserId: null,
  name: 'Campaña de prueba',
  creativeType: 'carousel' as const,
  composition: { schemaVersion: 1, layers: [{ id: 'title', type: 'text' }] },
  metadata: {},
};

describe('Creative Studio repository', () => {
  it('creates one version and makes autosave retries idempotent', async () => {
    const repository = createIndexedDbCreativeProjectRepository();
    const clientMutationId = '10000000-0000-4000-8000-000000000104';
    const saved = await repository.save({ ...project, clientMutationId });
    const retry = await repository.save({ ...project, id: saved.id, expectedUpdatedAt: saved.updatedAt, clientMutationId });

    expect(retry.currentVersion).toBe(1);
    expect((await repository.listVersions(saved.id, scope))).toHaveLength(1);
  });

  it('raises a conflict when a stale autosave token is used', async () => {
    const repository = createIndexedDbCreativeProjectRepository();
    const first = await repository.save({ ...project, name: 'Original' });
    const second = await repository.update(first.id, { name: 'Remoto' }, scope);

    await expect(repository.update(first.id, { name: 'Local', expectedUpdatedAt: first.updatedAt }, scope))
      .rejects.toBeInstanceOf(CreativeProjectConflictError);
    expect(second.name).toBe('Remoto');
  });

  it('uses IndexedDB/local fallback for network failures without hiding conflicts', async () => {
    const offline = createIndexedDbCreativeProjectRepository();
    const remote = {
      save: async () => { throw new TypeError('Failed to fetch'); },
    } as unknown as CreativeProjectRepository;
    const resilient = createResilientCreativeProjectRepository(remote, offline);
    const saved = await resilient.save({ ...project });
    expect(saved.name).toBe(project.name);

    const conflictRemote = {
      save: async () => { throw new CreativeProjectConflictError(); },
    } as unknown as CreativeProjectRepository;
    await expect(createResilientCreativeProjectRepository(conflictRemote, offline).save({
      ...project,
      id: saved.id,
      expectedUpdatedAt: '2020-01-01T00:00:00.000Z',
    })).rejects.toBeInstanceOf(CreativeProjectConflictError);
  });
});
