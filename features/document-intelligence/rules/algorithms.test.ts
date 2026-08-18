import { describe, expect, it } from 'vitest';
import {
  calculateAgeInYears,
  calculateDaysUntilExpiry,
  computeIcaoCheckDigit,
  validateDniNieModulo23,
  validateIcaoFieldWithCheckDigit,
} from './algorithms';

describe('validation algorithms', () => {
  describe('DNI / NIE Módulo 23', () => {
    it('validates correct Spanish DNI', () => {
      // 12345678Z (12345678 % 23 = 14 -> Z)
      const res = validateDniNieModulo23('12345678Z');
      expect(res.isValid).toBe(true);
      expect(res.isSpanishId).toBe(true);
      expect(res.isNie).toBe(false);
      expect(res.expectedLetter).toBe('Z');
    });

    it('rejects Spanish DNI with incorrect letter', () => {
      const res = validateDniNieModulo23('12345678A');
      expect(res.isValid).toBe(false);
      expect(res.isSpanishId).toBe(true);
      expect(res.expectedLetter).toBe('Z');
      expect(res.actualLetter).toBe('A');
    });

    it('validates correct Spanish NIE (X, Y, Z)', () => {
      // X1234567L (01234567 % 23 = 19 -> L)
      const resX = validateDniNieModulo23('X1234567L');
      expect(resX.isValid).toBe(true);
      expect(resX.isNie).toBe(true);

      // Y1234567X (11234567 % 23 = 9 -> X)
      const resY = validateDniNieModulo23('Y1234567X');
      expect(resY.isValid).toBe(true);
      expect(resY.isNie).toBe(true);
    });

    it('handles non-spanish or empty identifiers gracefully', () => {
      expect(validateDniNieModulo23('PASSPORT123').isSpanishId).toBe(false);
      expect(validateDniNieModulo23(null).isValid).toBe(false);
    });
  });

  describe('ICAO 9303 Checksum', () => {
    it('computes correct ICAO 7-3-1 check digit', () => {
      // Sample standard ICAO test: "L898902C3" -> 6
      expect(computeIcaoCheckDigit('L898902C3')).toBe(6);
      expect(validateIcaoFieldWithCheckDigit('L898902C3', '6')).toBe(true);
      expect(validateIcaoFieldWithCheckDigit('L898902C3', '7')).toBe(false);
    });
  });

  describe('Age & Expiry arithmetic', () => {
    const fixedToday = new Date('2026-08-18T12:00:00Z');

    it('calculates exact age from DD/MM/AAAA', () => {
      expect(calculateAgeInYears('18/08/2000', fixedToday)).toBe(26);
      expect(calculateAgeInYears('19/08/2000', fixedToday)).toBe(25); // birthday tomorrow
      expect(calculateAgeInYears('10/01/2010', fixedToday)).toBe(16);
      expect(calculateAgeInYears(null, fixedToday)).toBeNull();
    });

    it('calculates days until expiry', () => {
      expect(calculateDaysUntilExpiry('18/08/2026', fixedToday)).toBe(0);
      expect(calculateDaysUntilExpiry('28/08/2026', fixedToday)).toBe(10);
      expect(calculateDaysUntilExpiry('18/08/2025', fixedToday)).toBe(-365); // expired 1 year ago
    });
  });
});
