import { describe, expect, it } from 'vitest';
import {
  CreativeStudioScopeError,
  exportCreativeProject,
  getCreativeScope,
  importCreativeProject,
  scopeFromUser,
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
  it('round-trips a JSON-only project package', () => {
    const imported = importCreativeProject(exportCreativeProject(project), project.id);
    expect(imported.title).toBe(project.title);
    expect(imported.layers[0]?.props.text).toBe('Hola');
  });

  it('rejects inline payloads before a remote save', () => {
    expect(() => exportCreativeProject({
      ...project,
      layers: [{ ...project.layers[0], props: { imageUrl: 'data:image/png;base64,AAA' } }],
    })).toThrow('Storage privado');
  });

  it('requires all tenancy claims', () => {
    expect(() => scopeFromUser({ id: project.id, app_metadata: {} } as never)).toThrow(CreativeStudioScopeError);
    expect(scopeFromUser({
      id: project.id,
      app_metadata: {
        organization_id: '10000000-0000-4000-8000-000000000010',
        workspace_id: '10000000-0000-4000-8000-000000000011',
        brand_id: '10000000-0000-4000-8000-000000000012',
      },
    } as never).organizationId).toBe('10000000-0000-4000-8000-000000000010');
  });

  it('reads tenancy from the access-token claim shape used by RLS', async () => {
    const claims = {
      organization_id: '10000000-0000-4000-8000-000000000010',
      workspace_id: '10000000-0000-4000-8000-000000000011',
      brand_id: '10000000-0000-4000-8000-000000000012',
    };
    const encoded = btoa(JSON.stringify(claims)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const client = {
      auth: {
        getSession: async () => ({ data: { session: { access_token: `header.${encoded}.signature` } }, error: null }),
        getUser: async () => ({ data: { user: { id: project.id, app_metadata: {} } }, error: null }),
      },
    };
    await expect(getCreativeScope(client as never)).resolves.toMatchObject({
      scope: {
        organizationId: claims.organization_id,
        workspaceId: claims.workspace_id,
        brandId: claims.brand_id,
      },
    });
  });
});
