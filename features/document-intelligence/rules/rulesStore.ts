import { useEffect, useState } from 'react';
import { getDefaultRulesConfig } from './defaultRules';
import type { RulesConfiguration } from './types';

const STORAGE_KEY = 'vitablue.document-intelligence.rules.config';

export function loadRulesConfig(): RulesConfiguration {
  if (typeof window === 'undefined') return getDefaultRulesConfig();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultRulesConfig();
    const parsed = JSON.parse(raw) as RulesConfiguration;
    return {
      ...getDefaultRulesConfig(),
      ...parsed,
    };
  } catch {
    return getDefaultRulesConfig();
  }
}

export function saveRulesConfig(config: RulesConfiguration): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving rules config:', error);
  }
}

export function resetRulesConfig(): RulesConfiguration {
  const defaults = getDefaultRulesConfig();
  saveRulesConfig(defaults);
  return defaults;
}

export function useRulesConfig(): {
  config: RulesConfiguration;
  updateRule: (
    ruleId: string,
    updates: Partial<RulesConfiguration[string]>,
  ) => void;
  resetToDefaults: () => void;
} {
  const [config, setConfig] = useState<RulesConfiguration>(loadRulesConfig);

  useEffect(() => {
    setConfig(loadRulesConfig());
  }, []);

  const updateRule = (
    ruleId: string,
    updates: Partial<RulesConfiguration[string]>,
  ) => {
    setConfig((prev) => {
      const next = {
        ...prev,
        [ruleId]: {
          ...(prev[ruleId] ?? { enabled: true, severity: 'warning' as const }),
          ...updates,
        },
      };
      saveRulesConfig(next);
      return next;
    });
  };

  const resetToDefaults = () => {
    const defaults = resetRulesConfig();
    setConfig(defaults);
  };

  return { config, updateRule, resetToDefaults };
}
