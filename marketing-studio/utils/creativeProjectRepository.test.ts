import { describe, expect, it } from 'vitest';
import {
  CreativeProjectConflictError,
  createIndexedDbCreativeProjectRepository,
  createResilientCreativeProjectRepository,
  createSupabaseCreativeProjectRepository,
  getCreativePersistenceErrorDetails,
  serializeCreativePersistenceError,
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
  type: 'social_post' as const,
  draftDocument: { schemaVersion: 1, layers: [{ id: 'title', type: 'text' }] },
};

describe('Creative Studio repository', () => {
  it('maps canonical LoopDev rows and writes project/version tables without an RPC', async () => {
    const projectId = '10000000-0000-4000-8000-000000000105';
    const supabaseTimestamp = '2026-08-28T14:36:07.790123+00:00';
    const now = '2026-08-28T14:36:07.790Z';
    const rows = [{
      id: projectId,
      organization_id: scope.organizationId,
      workspace_id: scope.workspaceId,
      brand_id: scope.brandId,
      name: project.name,
      type: 'social_post',
      status: 'draft',
      current_version_number: 1,
      draft_document: project.draftDocument,
      autosave_revision: 4,
      created_by: null,
      updated_by: null,
      created_at: supabaseTimestamp,
      updated_at: supabaseTimestamp,
    }];
    const versions: Record<string, unknown>[] = [];
    const calls: {
      table: string;
      operation: string;
      payload?: Record<string, unknown>;
      filters?: Record<string, unknown>;
    }[] = [];
    const client = {
      from: (table: string) => {
        let operation = 'select';
        let payload: Record<string, unknown> | undefined;
        const filters: Record<string, unknown> = {};
        const query: Record<string, unknown> = {};
        query.select = () => query;
        query.order = () => query;
        query.eq = (column: string, value: unknown) => { filters[column] = value; return query; };
        query.insert = (value: Record<string, unknown>) => { operation = 'insert'; payload = value; return query; };
        query.update = (value: Record<string, unknown>) => { operation = 'update'; payload = value; return query; };
        query.single = () => {
          calls.push({ table, operation, payload, filters: { ...filters } });
          if (operation === 'update' && table === 'marketing_creative_projects') {
            const row = rows.find((candidate) => Object.entries(filters).every(([key, value]) =>
              candidate[key as keyof typeof candidate] === value));
            if (row) Object.assign(row, payload);
            if (!row) return Promise.resolve({
              data: null,
              error: { code: 'PGRST116', status: 406, message: 'No rows found' },
            });
          }
          return Promise.resolve({
            data: table === 'marketing_creative_projects' ? rows[0] : null,
            error: null,
          });
        };
        query.maybeSingle = () => Promise.resolve({
          data: rows.find((row) => Object.entries(filters).every(([key, value]) => row[key as keyof typeof row] === value)) ?? null,
          error: null,
        });
        query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => {
          calls.push({ table, operation, payload, filters: { ...filters } });
          if (operation === 'update' && table === 'marketing_creative_projects') {
            const row = rows.find((candidate) => Object.entries(filters).every(([key, value]) =>
              candidate[key as keyof typeof candidate] === value));
            if (row) Object.assign(row, payload);
          }
          if (operation === 'insert' && table === 'marketing_creative_project_versions') {
            versions.push(payload ?? {});
          }
          return Promise.resolve({ data: table === 'marketing_creative_project_versions' ? null : rows, error: null }).then(resolve, reject);
        };
        return query;
      },
    };
    const repository = createSupabaseCreativeProjectRepository(client as never);
    await expect(repository.list(scope)).resolves.toMatchObject([{
      createdAt: now,
      updatedAt: now,
    }]);
    const saved = await repository.save({ ...project, id: projectId, name: 'Campaña actualizada', expectedUpdatedAt: now });
    expect(saved.type).toBe('social_post');
    expect(calls.some((call) => call.operation === 'insert' && call.table === 'marketing_creative_project_versions')).toBe(true);
    const updateCall = calls.find((call) => call.table === 'marketing_creative_projects' && call.operation === 'update');
    expect(updateCall?.filters).toMatchObject({ autosave_revision: 4 });
    expect(updateCall?.filters).not.toHaveProperty('updated_at');
    expect(updateCall?.payload).toMatchObject({
      autosave_revision: 5,
      autosaved_at: expect.any(String),
    });
    expect(versions[0]).toMatchObject({
      project_id: projectId,
      version_number: 2,
      document: project.draftDocument,
    });
    expect(calls.some((call) => call.table === 'marketing_creative_projects' && call.operation === 'rpc')).toBe(false);
    await expect(repository.list(scope)).resolves.toHaveLength(1);
    const callsBeforeNoop = calls.length;
    await expect(repository.save({
      ...project,
      id: projectId,
      name: 'Campaña actualizada',
      expectedUpdatedAt: saved.updatedAt,
    })).resolves.toMatchObject({ updatedAt: saved.updatedAt });
    expect(calls).toHaveLength(callsBeforeNoop);
    expect(calls.some((call) => call.operation === 'update' && call.filters?.autosave_revision === saved.autosaveRevision)).toBe(false);
  });

  it('creates one version and makes autosave retries idempotent', async () => {
    const repository = createIndexedDbCreativeProjectRepository();
    const clientMutationId = '10000000-0000-4000-8000-000000000104';
    const saved = await repository.save({ ...project, clientMutationId });
    const retry = await repository.save({ ...project, id: saved.id, expectedUpdatedAt: saved.updatedAt, clientMutationId });

    expect(retry.currentVersionNumber).toBe(1);
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

  it('exposes only safe persistence error fields for diagnostics', () => {
    expect(getCreativePersistenceErrorDetails({
      code: 'PGRST116',
      status: 406,
      message: 'No rows found',
      details: 'Authorization header',
    })).toEqual({
      code: 'PGRST116',
      status: '406',
      message: 'No rows found',
      details: 'Authorization header',
    });
  });

  it('does not issue destructive project deletes against the LoopDev repository contract', async () => {
    const repository = createSupabaseCreativeProjectRepository({} as never);

    await expect(repository.remove('10000000-0000-4000-8000-000000000105', scope))
      .rejects.toThrow('LoopDev no admite DELETE');
  });

  it('preserves the PostgREST cause when an optimistic update becomes a conflict', () => {
    expect(getCreativePersistenceErrorDetails(new CreativeProjectConflictError('El proyecto fue modificado.', {
      code: 'PGRST116',
      status: 406,
      message: 'Cannot coerce the result to a single JSON object',
      details: 'The result contains 0 rows',
    }))).toEqual({
      code: 'PGRST116',
      status: '406',
      message: 'Cannot coerce the result to a single JSON object',
      details: 'The result contains 0 rows',
    });
  });

  it('serializes PostgREST diagnostics as JSON without leaking credentials', () => {
    const serialized = serializeCreativePersistenceError({
      code: '42501',
      status: 403,
      message: 'Request failed with Bearer eyJheader.payload.signature',
      details: {
        hint: 'retry with access_token=secret-token',
        password: 'super-secret',
        nested: 'refresh_token: another-secret',
      },
      token: 'must-not-be-included',
    });

    expect(serialized).toBe(JSON.stringify({
      code: '42501',
      status: '403',
      message: 'Request failed with Bearer [REDACTED]',
      details: '{"hint":"retry with access_token=[REDACTED]","password":"[REDACTED]","nested":"refresh_token: [REDACTED]"}',
    }));
    expect(serialized).not.toContain('super-secret');
    expect(serialized).not.toContain('another-secret');
    expect(serialized).not.toContain('eyJheader.payload.signature');
    expect(JSON.parse(serialized)).not.toHaveProperty('token');
  });
});
