import { describe, expect, it, vi } from 'vitest';
import { passportExtractionFixture } from './fixtures';
import { uploadAndExtractDocument } from './supabase-service';

const createClientMock = () => {
  const upload = vi.fn().mockResolvedValue({ error: null });
  const remove = vi.fn().mockResolvedValue({ error: null });
  return {
    storage: { from: vi.fn(() => ({ upload, remove })) },
    functions: { invoke: vi.fn() },
    upload,
    remove,
  };
};

describe('supabase document extraction transport', () => {
  it('uploads, extracts with a storage path, and always removes the temporary object', async () => {
    const client = createClientMock();
    const service = { extract: vi.fn().mockResolvedValue(passportExtractionFixture) };
    const file = new File(['document'], 'passport.jpg', { type: 'image/jpeg' });

    await expect(uploadAndExtractDocument(file, 'user-123', service, client)).resolves.toEqual(passportExtractionFixture);

    expect(client.upload).toHaveBeenCalledWith(expect.stringMatching(/^user-123\/.+\.jpg$/), file, {
      contentType: 'image/jpeg',
      upsert: false,
    });
    expect(service.extract).toHaveBeenCalledWith(expect.objectContaining({
      fileName: 'passport.jpg',
      mimeType: 'image/jpeg',
      documentReference: expect.stringMatching(/^user-123\/.+\.jpg$/),
    }));
    expect(client.remove).toHaveBeenCalledWith([expect.stringMatching(/^user-123\/.+\.jpg$/)]);
  });

  it('removes the temporary object when extraction fails', async () => {
    const client = createClientMock();
    const service = { extract: vi.fn().mockRejectedValue(new Error('provider failed')) };
    const file = new File(['document'], 'passport.jpg', { type: 'image/jpeg' });

    await expect(uploadAndExtractDocument(file, 'user-123', service, client)).rejects.toThrow('provider failed');
    expect(client.remove).toHaveBeenCalledTimes(1);
  });
});