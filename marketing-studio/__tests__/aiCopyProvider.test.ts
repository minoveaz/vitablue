import { describe, expect, it } from 'vitest';
import {
  GeminiAiCopyProvider,
  MockAiCopyProvider,
} from '../utils/aiCopyProvider';
import { AiCopyRequest } from '../types/aiCopy';

const request: AiCopyRequest = {
  objective: 'conversion',
  type: 'hook',
  tone: 'warm',
  audience: 'expats',
  format: 'social',
  quantity: 4,
};

describe('AI copy provider contract', () => {
  it('returns deterministic Spanish proposals for the requested quantity', async () => {
    const provider = new MockAiCopyProvider();
    const first = await provider.generate(request);
    const second = await provider.generate(request);

    expect(first).toHaveLength(4);
    expect(first).toEqual(second);
    expect(first.every((proposal) => proposal.isMock)).toBe(true);
    expect(first.map((proposal) => proposal.text).join(' ')).toContain('España');
  });

  it('adapts selected text without requiring a remote service', async () => {
    const provider = new MockAiCopyProvider();
    const proposals = await provider.adapt(request, 'Seguro médico para tu llegada');

    expect(proposals).toHaveLength(4);
    expect(proposals[0].text).toContain('Seguro médico para tu llegada');
    await expect(provider.adapt(request, '  ')).rejects.toThrow('Selecciona una capa');
  });

  it('keeps the Gemini boundary unavailable until a transport is injected', async () => {
    const provider = new GeminiAiCopyProvider();
    await expect(provider.generate(request)).rejects.toThrow('Gemini aún no está configurado');
  });
});
