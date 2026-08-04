import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ConsentCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing';
export type ConsentChoices = Record<ConsentCategory, boolean>;

const STORAGE_KEY = 'vitablue-consent-v1';
const defaultChoices: ConsentChoices = { necessary: true, preferences: false, analytics: false, marketing: false };

interface ConsentContextValue {
  choices: ConsentChoices;
  hasDecision: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  updateChoices: (choices: Partial<ConsentChoices>) => void;
  reopen: () => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const readStoredConsent = (): ConsentChoices | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultChoices, ...JSON.parse(stored) };
    const legacy = localStorage.getItem('cookie-consent');
    if (legacy === 'accepted') return { ...defaultChoices, analytics: true, marketing: true };
    if (legacy === 'declined') return defaultChoices;
  } catch (error) {
    console.warn('Unable to read consent preference:', error);
  }
  return null;
};

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
    updateChoices: (updates) => persist({ ...choices, ...updates, necessary: true }),
    reopen: () => setHasDecision(false),
  }), [choices, hasDecision]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsent = (): ConsentContextValue => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
};
