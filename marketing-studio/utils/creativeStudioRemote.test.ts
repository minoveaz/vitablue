import { describe, expect, it } from 'vitest';
import {
  exportCreativeProject,
  getCreativeProjectSaveId,
  getCreativeScope,
  isImageCreativeProject,
  isVideoCreativeProject,
  importCreativeProject,
  isCreativeProjectId,
  archiveCreativeProject,
  restoreCreativeProjectVersion,
} from './creativeStudioRemote';
import type { ImageProject } from '../types/imageStudio';

const project: ImageProject = {
  id: '10000000-0000-4000-8000-000000000001',
  title: 'Proyecto remoto',
  preset: { id: 'square', name: 'Cuadrado', width: 1080, height: 1080, aspectRatio: '1:1' } as ImageProject['preset'],
  background: { type: 'solid', color: '#001219' },
  brandTokens: {} as ImageProject['brandTokens'],
  layers: [{ id: 'text', type: 'text', title: 'Título', props: { text: 'Hola' }, position: { x: 50, y: 50 }, zIndex: 1, scale: 1 }] as ImageProject['layers'],
  createdAt: '2026-08-28T00:00:00.000Z',
  updatedAt: '2026-08-28T00:00:00.000Z',
};

describe('Creative Studio remote adapter', () => {
  it('accepts only UUIDs as remote project route IDs', () => {
    expect(isCreativeProjectId(project.id)).toBe(true);
    expect(isCreativeProjectId('project-1724846400000-ab12cd')).toBe(false);
    expect(isCreativeProjectId('template-instagram-portrait')).toBe(false);
    expect(isCreativeProjectId(null)).toBe(false);
  });

  it('forces fresh designs to receive their remote UUID instead of updating a draft UUID', () => {
    expect(getCreativeProjectSaveId(project.id)).toBe(project.id);
    expect(getCreativeProjectSaveId(project.id, true)).toBeUndefined();
    expect(getCreativeProjectSaveId('project-local-draft')).toBeUndefined();
  });

  it('classifies hub projects from persisted document fields, never their titles', () => {
    const imageRow = {
      type: 'social_post',
      draftDocument: { schemaVersion: 1, imageStudio: { title: 'Vídeo promocional' } },
    } as never;
    const videoRow = {
      type: 'other',
      draftDocument: { schemaVersion: 1, mode: 'video', name: 'Diseño gráfico' },
    } as never;

    expect(isImageCreativeProject(imageRow)).toBe(true);
    expect(isVideoCreativeProject(imageRow)).toBe(false);
    expect(isImageCreativeProject(videoRow)).toBe(false);
    expect(isVideoCreativeProject(videoRow)).toBe(true);
  });

  it('round-trips a JSON-only project package', () => {
    const imported = importCreativeProject(exportCreativeProject(project), project.id);
    expect(imported.title).toBe(project.title);
    expect(imported.layers[0]?.props.text).toBe('Hola');
    expect(JSON.parse(exportCreativeProject(project)).project.imageStudio.updatedAt).toBeUndefined();
  });

  it('rejects inline payloads before a remote save', () => {
    expect(() => exportCreativeProject({
      ...project,
      layers: [{ ...project.layers[0], props: { imageUrl: 'data:image/png;base64,AAA' } }],
    })).toThrow('Storage privado');
  });

  it.each(['owner', 'agent'])('resolves an active %s membership without JWT tenancy claims', async (role) => {
    const organizationId = '10000000-0000-4000-8000-000000000010';
    const workspaceId = '10000000-0000-4000-8000-000000000011';
    const brandId = '10000000-0000-4000-8000-000000000012';
    const calls: string[] = [];
    const resultFor = (table: string) => {
      if (table === 'organization_memberships') return { data: [{ organization_id: organizationId, status: 'active', role }], error: null };
      if (table === 'workspaces') return { data: [{ id: workspaceId, organization_id: organizationId, status: 'active' }], error: null };
      if (table === 'workspace_brands') return { data: [{ workspace_id: workspaceId, organization_id: organizationId, brand_id: brandId }], error: null };
      if (table === 'brands') return { data: [{ id: brandId, organization_id: organizationId }], error: null };
      throw new Error(`Unexpected table ${table}`);
    };
    const client = {
      auth: {
        getSession: async () => { throw new Error('JWT claims must not be read'); },
        getUser: async () => ({ data: { user: { id: project.id, app_metadata: { organization_id: 'not-used' } } }, error: null }),
      },
      from: (table: string) => {
        calls.push(table);
        const result = resultFor(table);
        const query: Record<string, unknown> = {};
        query.select = () => query;
        query.eq = () => query;
        query.in = () => query;
        query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
          Promise.resolve(result).then(resolve, reject);
        return query;
      },
    };
    await expect(getCreativeScope(client as never)).resolves.toMatchObject({
      scope: { organizationId, workspaceId, brandId },
      user: { id: project.id },
    });
    expect(calls).toEqual(['organization_memberships', 'workspaces', 'workspace_brands', 'brands']);
  });

  it('reports missing active membership data instead of reading token claims', async () => {
    const client = {
      auth: {
        getUser: async () => ({ data: { user: { id: project.id } }, error: null }),
      },
      from: () => {
        const query: Record<string, unknown> = {};
        query.select = () => query;
        query.eq = () => query;
        query.then = (resolve: (value: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve);
        return query;
      },
    };
    await expect(getCreativeScope(client as never)).rejects.toThrow('membresía activa');
  });

  it('archives a selected remote UUID without issuing a DELETE request', async () => {
    const organizationId = '10000000-0000-4000-8000-000000000010';
    const workspaceId = '10000000-0000-4000-8000-000000000011';
    const brandId = '10000000-0000-4000-8000-000000000012';
    const projectId = '10000000-0000-4000-8000-000000000013';
    const expectedUpdatedAt = '2026-08-28T00:00:00.000Z';
    const operations: string[] = [];
    const updates: Record<string, unknown>[] = [];
    const projectRow = {
      id: projectId,
      organization_id: organizationId,
      workspace_id: workspaceId,
      brand_id: brandId,
      name: project.title,
      type: 'social_post',
      status: 'draft',
      current_version_number: 1,
      autosave_revision: 4,
      draft_document: { schemaVersion: 1, imageStudio: project },
      created_by: null,
      updated_by: null,
      created_at: expectedUpdatedAt,
      updated_at: expectedUpdatedAt,
    };
    const resultFor = (table: string) => {
      if (table === 'organization_memberships') return { data: [{ organization_id: organizationId, status: 'active' }], error: null };
      if (table === 'workspaces') return { data: [{ id: workspaceId, organization_id: organizationId, status: 'active' }], error: null };
      if (table === 'workspace_brands') return { data: [{ workspace_id: workspaceId, organization_id: organizationId, brand_id: brandId }], error: null };
      if (table === 'brands') return { data: [{ id: brandId, organization_id: organizationId }], error: null };
      return { data: [], error: null };
    };
    const client = {
      auth: { getUser: async () => ({ data: { user: { id: project.id } }, error: null }) },
      from: (table: string) => {
        let operation = 'select';
        const query: Record<string, unknown> = {};
        query.select = () => query;
        query.eq = () => query;
        query.in = () => query;
        query.update = (payload: Record<string, unknown>) => {
          operation = 'update';
          operations.push(operation);
          updates.push(payload);
          return query;
        };
        query.maybeSingle = () => Promise.resolve(
          table === 'marketing_creative_projects'
            ? { data: operation === 'update' ? { id: projectId } : projectRow, error: null }
            : { data: null, error: null },
        );
        query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
          Promise.resolve(resultFor(table)).then(resolve, reject);
        return query;
      },
    };

    await expect(archiveCreativeProject(projectId, expectedUpdatedAt, client as never)).resolves.toBeUndefined();
    expect(updates).toEqual([{
      status: 'archived',
      updated_by: project.id,
      updated_at: expect.any(String),
    }]);
    expect(operations).toEqual(['update']);
  });

  it('returns a safe archive error when the remote rejects the mutation', async () => {
    const organizationId = '10000000-0000-4000-8000-000000000010';
    const workspaceId = '10000000-0000-4000-8000-000000000011';
    const brandId = '10000000-0000-4000-8000-000000000012';
    const resultFor = (table: string) => {
      if (table === 'organization_memberships') return { data: [{ organization_id: organizationId, status: 'active' }], error: null };
      if (table === 'workspaces') return { data: [{ id: workspaceId, organization_id: organizationId, status: 'active' }], error: null };
      if (table === 'workspace_brands') return { data: [{ workspace_id: workspaceId, organization_id: organizationId, brand_id: brandId }], error: null };
      if (table === 'brands') return { data: [{ id: brandId, organization_id: organizationId }], error: null };
      return { data: null, error: { code: '42501', message: 'token=secret-value' } };
    };
    const client = {
      auth: { getUser: async () => ({ data: { user: { id: project.id } }, error: null }) },
      from: (table: string) => {
        const query: Record<string, unknown> = {};
        query.select = () => query;
        query.eq = () => query;
        query.in = () => query;
        query.update = () => query;
        query.maybeSingle = () => Promise.resolve(resultFor(table));
        query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
          Promise.resolve(resultFor(table)).then(resolve, reject);
        return query;
      },
    };

    let captured: unknown;
    try {
      await archiveCreativeProject(project.id, undefined, client as never);
    } catch (reason) {
      captured = reason;
    }
    const error = captured as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('No se pudo archivar');
    expect(error.message).not.toContain('secret-value');
  });

  it('restores a canonical document by writing a new table-backed version', async () => {
    const organizationId = '10000000-0000-4000-8000-000000000010';
    const workspaceId = '10000000-0000-4000-8000-000000000011';
    const brandId = '10000000-0000-4000-8000-000000000012';
    const projectId = '10000000-0000-4000-8000-000000000013';
    const oldProject = { ...project, id: projectId, title: 'Proyecto remoto', layers: [{ ...project.layers[0], props: { text: 'Anterior' } }] };
    const projectRow = {
      id: projectId, organization_id: organizationId, workspace_id: workspaceId, brand_id: brandId,
      name: oldProject.title, type: 'social_post', status: 'draft', current_version_number: 1,
      autosave_revision: 0,
      draft_document: { schemaVersion: 1, imageStudio: oldProject }, created_by: null, updated_by: null,
      created_at: oldProject.createdAt, updated_at: oldProject.updatedAt,
    };
    const versionRows = [{
      id: '10000000-0000-4000-8000-000000000014', project_id: projectId,
      organization_id: organizationId, workspace_id: workspaceId, brand_id: brandId,
      version_number: 1, document: { schemaVersion: 1, imageStudio: { ...oldProject, layers: [{ ...oldProject.layers[0], props: { text: 'Restaurado' } }] } },
      change_summary: null, created_by: null, updated_by: null,
      created_at: oldProject.createdAt, updated_at: oldProject.updatedAt,
    }];
    const tableRows: Record<string, Record<string, unknown>[]> = {
      organization_memberships: [{ user_id: project.id, organization_id: organizationId, status: 'active' }],
      workspaces: [{ id: workspaceId, organization_id: organizationId, status: 'active', suite_key: 'marketing' }],
      workspace_brands: [{ workspace_id: workspaceId, organization_id: organizationId, brand_id: brandId }],
      brands: [{ id: brandId, organization_id: organizationId }],
      marketing_creative_projects: [projectRow],
      marketing_creative_project_versions: versionRows,
    };
    const client = {
      auth: { getUser: async () => ({ data: { user: { id: project.id } }, error: null }) },
      from: (table: string) => {
        let operation = 'select';
        let payload: Record<string, unknown> | undefined;
        const filters: Record<string, unknown> = {};
        const query: Record<string, unknown> = {};
        const rows = () => (tableRows[table] ?? []).filter((row) =>
          Object.entries(filters).every(([key, value]) => Array.isArray(value) ? value.includes(row[key]) : row[key] === value));
        query.select = () => query;
        query.order = () => query;
        query.eq = (key: string, value: unknown) => { filters[key] = value; return query; };
        query.in = (key: string, values: unknown[]) => { filters[key] = values; return query; };
        query.insert = (value: Record<string, unknown>) => { operation = 'insert'; payload = value; return query; };
        query.update = (value: Record<string, unknown>) => { operation = 'update'; payload = value; return query; };
        query.maybeSingle = () => Promise.resolve({ data: rows()[0] ?? null, error: null });
        query.single = () => {
          const matched = rows()[0];
          if (operation === 'update' && payload) {
            if (matched) Object.assign(matched, payload);
          }
          return Promise.resolve({ data: matched ?? null, error: null });
        };
        query.then = (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => {
          if (operation === 'insert' && payload) (tableRows[table] ??= []).push(payload);
          if (operation === 'update' && payload) {
            const row = rows()[0];
            if (row) Object.assign(row, payload);
          }
          return Promise.resolve({ data: rows(), error: null }).then(resolve, reject);
        };
        return query;
      },
    };
    const restored = await restoreCreativeProjectVersion(projectId, 1, client as never);
    expect(restored.layers[0]?.props.text).toBe('Restaurado');
    expect(projectRow.current_version_number).toBe(2);
    expect(versionRows).toHaveLength(2);
    expect(versionRows[1]).toMatchObject({ version_number: 2, document: { schemaVersion: 1 } });
  });
});
