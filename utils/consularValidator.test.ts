import { describe, it, expect } from 'vitest';
import { evaluateConsularInsurance, ConsularValidatorInput } from './consularValidator';

describe('Consular Requirements Validator Engine', () => {
  it('diagnoses fully compliant Spanish policy as APPROVED (100% score)', () => {
    const input: ConsularValidatorInput = {
      visaType: 'student',
      country: 'Colombia',
      consulateCity: 'Bogotá',
      insurerCategory: 'spanish_authorized',
      insurerName: 'ASISA',
      copayStatus: 'zero_copay',
      waitingPeriodStatus: 'zero_waiting',
      repatriationStatus: 'included',
    };

    const result = evaluateConsularInsurance(input);
    expect(result.status).toBe('APPROVED');
    expect(result.score).toBe(100);
    expect(result.pillars.every((p) => p.passed)).toBe(true);
    expect(result.whatsappTag).toBe('VALIDADOR-COLOMBIA-APPROVED');
    expect(result.whatsappMessage).toContain('100%');
  });

  it('diagnoses travel assistance insurance as REJECTED with direct rejection warnings', () => {
    const input: ConsularValidatorInput = {
      visaType: 'student',
      country: 'México',
      consulateCity: 'CDMX',
      insurerCategory: 'travel_assistance',
      copayStatus: 'zero_copay',
      waitingPeriodStatus: 'zero_waiting',
      repatriationStatus: 'included',
    };

    const result = evaluateConsularInsurance(input);
    expect(result.status).toBe('REJECTED');
    expect(result.score).toBeLessThan(70);
    expect(result.pillars[0].passed).toBe(false);
    expect(result.rejectionRisks.some((r) => r.toLowerCase().includes('asistencia al viajero'))).toBe(true);
    expect(result.whatsappTag).toBe('VALIDADOR-MXICO-REJECTED');
  });

  it('diagnoses policy with high deductibles or copays as REJECTED or WARNING', () => {
    const inputWithDeductible: ConsularValidatorInput = {
      visaType: 'nomad',
      country: 'Argentina',
      insurerCategory: 'spanish_authorized',
      copayStatus: 'high_deductible',
      waitingPeriodStatus: 'zero_waiting',
      repatriationStatus: 'included',
    };

    const result = evaluateConsularInsurance(inputWithDeductible);
    expect(result.status).toBe('REJECTED');
    expect(result.pillars[1].passed).toBe(false);

    const inputWithLowCopay: ConsularValidatorInput = {
      visaType: 'nomad',
      country: 'Perú',
      insurerCategory: 'spanish_authorized',
      copayStatus: 'low_copay',
      waitingPeriodStatus: 'zero_waiting',
      repatriationStatus: 'included',
    };

    const resultLowCopay = evaluateConsularInsurance(inputWithLowCopay);
    expect(resultLowCopay.status).toBe('WARNING');
    expect(resultLowCopay.pillars[1].status).toBe('warning');
  });

  it('diagnoses missing repatriation as non-compliant for visa applications', () => {
    const input: ConsularValidatorInput = {
      visaType: 'student',
      country: 'Ecuador',
      insurerCategory: 'spanish_authorized',
      copayStatus: 'zero_copay',
      waitingPeriodStatus: 'zero_waiting',
      repatriationStatus: 'not_included',
    };

    const result = evaluateConsularInsurance(input);
    expect(result.pillars[3].passed).toBe(false);
    expect(result.rejectionRisks.some((r) => r.toLowerCase().includes('repatriación'))).toBe(true);
  });
});
