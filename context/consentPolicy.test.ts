import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CONSENT_CHOICES,
  mergeConsentChoices,
  parseStoredConsent,
} from './consentPolicy';

describe('consent policy', () => {
  it('returns no decision when no stored choice exists', () => {
    expect(parseStoredConsent(null, null)).toBeNull();
  });

  it('restores the legacy accepted decision', () => {
    expect(parseStoredConsent(null, 'accepted')).toEqual({
      ...DEFAULT_CONSENT_CHOICES,
      analytics: true,
      marketing: true,
    });
  });

  it('restores and normalizes stored choices', () => {
    expect(parseStoredConsent('{"analytics":true}', null)).toEqual({
      ...DEFAULT_CONSENT_CHOICES,
      analytics: true,
    });
  });

  it('always keeps necessary cookies enabled', () => {
    expect(mergeConsentChoices(DEFAULT_CONSENT_CHOICES, {
      necessary: false,
      preferences: true,
      analytics: true,
    })).toEqual({
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: false,
    });
  });

  it('ignores malformed stored JSON and falls back to no decision', () => {
    expect(parseStoredConsent('{invalid', null)).toBeNull();
  });
});
