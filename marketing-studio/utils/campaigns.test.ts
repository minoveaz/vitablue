import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => ({
  auth: { getUser: vi.fn() },
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock('./supabaseClient', () => ({ supabase: mocked }));

import { getCampaigns, saveCampaignToSupabase, syncCampaignsWithSupabase } from './campaigns';

describe('campaign persistence and RLS handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
  });

  it('does not attempt an anonymous campaign write', async () => {
    await expect(saveCampaignToSupabase(getCampaigns()[0]!)).rejects.toMatchObject({
      kind: 'authentication',
      operation: 'write',
    });
    expect(mocked.from).not.toHaveBeenCalled();
  });

  it('surfaces an actionable RLS error instead of returning false', async () => {
    mocked.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mocked.from.mockReturnValue({
      upsert: () => Promise.resolve({ data: null, error: { code: '42501', status: 403 } }),
    });

    await expect(saveCampaignToSupabase(getCampaigns()[0]!)).rejects.toThrow(/rol editor o admin/);
  });

  it('does not bootstrap defaults for an authenticated read-only user', async () => {
    mocked.auth.getUser.mockResolvedValue({ data: { user: { id: 'viewer-1' } }, error: null });
    mocked.from.mockReturnValue({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    });
    mocked.rpc.mockResolvedValue({ data: false, error: null });

    await expect(syncCampaignsWithSupabase()).resolves.toEqual(getCampaigns());
    expect(mocked.rpc).toHaveBeenCalledWith('has_marketing_role', { required_role: 'editor' });
    expect(mocked.from).toHaveBeenCalledTimes(1);
  });
});
