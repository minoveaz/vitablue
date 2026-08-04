import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_CONSENT_CHOICES,
  mergeConsentChoices,
  parseStoredConsent,
  type ConsentChoices,
} from './consentPolicy';

export type { ConsentCategory, ConsentChoices } from './consentPolicy';

const STORAGE_KEY = 'vitablue-consent-v1';
const defaultChoices = DEFAULT_CONSENT_CHOICES;

interface ConsentContextValue {
  choices: ConsentChoices;
  hasDecision: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  updateChoices: (choices: Partial<ConsentChoices>) => void;
  reopen: () => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const readStoredConsent = (): ConsentChoices | null =>
  parseStoredConsent(localStorage.getItem(STORAGE_KEY), localStorage.getItem('cookie-consent'));

export const ConsentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [choices, setChoices] = useState<ConsentChoices>(() => readStoredConsent() ?? defaultChoices);
  const [hasDecision, setHasDecision] = useState(() => readStoredConsent() !== null);

  const persist = (next: ConsentChoices) => {
    setChoices(next);
    setHasDecision(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('vitablue:consent-changed', { detail: next }));
  };

  useEffect(() => {
    const handleExternalChange = () => {
      const next = readStoredConsent();
      if (next) { setChoices(next); setHasDecision(true); }
    };
    window.addEventListener('storage', handleExternalChange);
    return () => window.removeEventListener('storage', handleExternalChange);
  }, []);

  const value = useMemo<ConsentContextValue>(() => ({
    choices,
    hasDecision,
    acceptAll: () => persist({ necessary: true, preferences: true, analytics: true, marketing: true }),
    rejectOptional: () => persist(defaultChoices),
    updateChoices: (updates) => persist(mergeConsentChoices(choices, updates)),
    reopen: () => setHasDecision(false),
  }), [choices, hasDecision]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = (): ConsentContextValue => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
};
