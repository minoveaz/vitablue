export type ConsentCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing';
export type ConsentChoices = Record<ConsentCategory, boolean>;

export const DEFAULT_CONSENT_CHOICES: ConsentChoices = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const parseStoredConsent = (stored: string | null, legacy: string | null): ConsentChoices | null => {
  if (stored) {
    try {
      return { ...DEFAULT_CONSENT_CHOICES, ...JSON.parse(stored) };
    } catch {
      return null;
    }
  }
  if (legacy === 'accepted') return { ...DEFAULT_CONSENT_CHOICES, analytics: true, marketing: true };
  if (legacy === 'declined') return { ...DEFAULT_CONSENT_CHOICES };
  return null;
};

export const mergeConsentChoices = (
  current: ConsentChoices,
  updates: Partial<ConsentChoices>,
): ConsentChoices => ({ ...current, ...updates, necessary: true });
