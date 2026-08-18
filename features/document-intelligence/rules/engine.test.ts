import { describe, expect, it } from 'vitest';
import { emptyIdentityDocumentFields } from '../types';
import { getDefaultRulesConfig } from './defaultRules';
import { evaluateRules } from './engine';

describe('rule evaluation engine', () => {
  const fixedToday = new Date('2026-08-18T12:00:00Z');

  it('triggers DNI letter error on invalid Spanish DNI', () => {
    const fields = {
      ...emptyIdentityDocumentFields(),
      documentNumber: '12345678A', // Expected Z
    };

    const alerts = evaluateRules(fields, getDefaultRulesConfig(), { today: fixedToday });
    const dniAlert = alerts.find((a) => a.ruleId === 'dni_nie_modulo23');

    expect(dniAlert).toBeDefined();
    expect(dniAlert?.severity).toBe('error');
    expect(dniAlert?.message).toContain("calcula 'Z'");
  });

  it('triggers expired document alert on past expiryDate', () => {
    const fields = {
      ...emptyIdentityDocumentFields(),
      expiryDate: '10/05/2024',
    };

    const alerts = evaluateRules(fields, getDefaultRulesConfig(), { today: fixedToday });
    const expiryAlert = alerts.find((a) => a.ruleId === 'document_not_expired');

    expect(expiryAlert).toBeDefined();
    expect(expiryAlert?.severity).toBe('error');
    expect(expiryAlert?.title).toBe('Documento caducado');
  });

  it('triggers visa threshold alert when expiry is under configured days', () => {
    const fields = {
      ...emptyIdentityDocumentFields(),
      expiryDate: '18/10/2026', // ~60 days from today
    };

    const config = getDefaultRulesConfig();
    // Default is 180 days
    const alerts = evaluateRules(fields, config, { today: fixedToday });
    const visaAlert = alerts.find((a) => a.ruleId === 'visa_expiry_threshold');

    expect(visaAlert).toBeDefined();
    expect(visaAlert?.severity).toBe('warning');
    expect(visaAlert?.message).toContain('trámites de visado');
  });

  it('triggers minor policyholder requirement when age < 18', () => {
    const fields = {
      ...emptyIdentityDocumentFields(),
      birthDate: '18/08/2012', // 14 years old
    };

    const alerts = evaluateRules(fields, getDefaultRulesConfig(), { today: fixedToday });
    const minorAlert = alerts.find((a) => a.ruleId === 'minor_requires_policyholder');

    expect(minorAlert).toBeDefined();
    expect(minorAlert?.severity).toBe('info');
    expect(minorAlert?.title).toContain('14 años');
  });

  it('respects disabled rules in configuration', () => {
    const fields = {
      ...emptyIdentityDocumentFields(),
      documentNumber: '12345678A',
    };

    const customConfig = {
      ...getDefaultRulesConfig(),
      dni_nie_modulo23: { enabled: false, severity: 'error' as const },
    };

    const alerts = evaluateRules(fields, customConfig, { today: fixedToday });
    expect(alerts.find((a) => a.ruleId === 'dni_nie_modulo23')).toBeUndefined();
  });
});
