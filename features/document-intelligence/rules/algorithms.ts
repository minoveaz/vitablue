/**
 * Algoritmos deterministas puros para validación de documentos de identidad e integridad.
 * Diseñado sin dependencias de entorno para portabilidad total a Loopdev, Edge Functions y Node.js.
 */

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Valida el dígito de control (letra) de un DNI o NIE español mediante el algoritmo Módulo 23.
 */
export function validateDniNieModulo23(value: string | null | undefined): {
  isValid: boolean;
  expectedLetter?: string;
  actualLetter?: string;
  isSpanishId: boolean;
  isNie: boolean;
} {
  if (!value) {
    return { isValid: false, isSpanishId: false, isNie: false };
  }

  const clean = value.trim().toUpperCase().replace(/[-\s]/g, '');

  // NIE: X, Y o Z seguido de 7 dígitos y 1 letra
  const nieMatch = clean.match(/^([XYZ])(\d{7})([A-Z])$/);
  if (nieMatch) {
    const [, prefix, digits, actualLetter] = nieMatch;
    const prefixNum = prefix === 'X' ? '0' : prefix === 'Y' ? '1' : '2';
    const fullNumber = parseInt(`${prefixNum}${digits}`, 10);
    const expectedLetter = DNI_LETTERS[fullNumber % 23];
    return {
      isValid: expectedLetter === actualLetter,
      expectedLetter,
      actualLetter,
      isSpanishId: true,
      isNie: true,
    };
  }

  // DNI: 8 dígitos y 1 letra (o hasta 8 dígitos con padding)
  const dniMatch = clean.match(/^(\d{1,8})([A-Z])$/);
  if (dniMatch) {
    const [, digits, actualLetter] = dniMatch;
    const num = parseInt(digits, 10);
    const expectedLetter = DNI_LETTERS[num % 23];
    return {
      isValid: expectedLetter === actualLetter,
      expectedLetter,
      actualLetter,
      isSpanishId: true,
      isNie: false,
    };
  }

  return { isValid: false, isSpanishId: false, isNie: false };
}

/**
 * Ponderación estándar ICAO 9303 (pesos repetitivos 7, 3, 1).
 */
const ICAO_WEIGHTS = [7, 3, 1];

/**
 * Calcula el dígito de control de una cadena según la especificación ICAO 9303.
 * Caracteres: 0-9 -> 0-9, A-Z -> 10-35, '<' -> 0.
 */
export function computeIcaoCheckDigit(input: string): number {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i].toUpperCase();
    let val = 0;
    if (char >= '0' && char <= '9') {
      val = char.charCodeAt(0) - 48;
    } else if (char >= 'A' && char <= 'Z') {
      val = char.charCodeAt(0) - 65 + 10;
    } else if (char === '<') {
      val = 0;
    }
    const weight = ICAO_WEIGHTS[i % 3];
    sum += val * weight;
  }
  return sum % 10;
}

/**
 * Valida un campo con su dígito de control ICAO 9303.
 */
export function validateIcaoFieldWithCheckDigit(
  data: string,
  checkDigit: string | number,
): boolean {
  if (!data || checkDigit === undefined || checkDigit === null) return false;
  const expected = computeIcaoCheckDigit(data);
  const actual = typeof checkDigit === 'number' ? checkDigit : parseInt(String(checkDigit), 10);
  return expected === actual;
}

/**
 * Convierte una fecha en formato DD/MM/AAAA a un objeto Date (en UTC).
 */
export function parseDateDDMMAAAA(dateStr: string | null | undefined): Date | null {
  if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr.trim())) return null;
  const [day, month, year] = dateStr.trim().split('/').map((v) => parseInt(v, 10));
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Calcula la edad actuarial exacta en años cumplidos a la fecha de referencia.
 */
export function calculateAgeInYears(
  birthDateStr: string | null | undefined,
  referenceDate: Date = new Date(),
): number | null {
  const birth = parseDateDDMMAAAA(birthDateStr);
  if (!birth) return null;

  let age = referenceDate.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = referenceDate.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = referenceDate.getUTCDate() - birth.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Calcula la cantidad de días restantes hasta la fecha de caducidad.
 * Retorna un número negativo si ya está caducado.
 */
export function calculateDaysUntilExpiry(
  expiryDateStr: string | null | undefined,
  referenceDate: Date = new Date(),
): number | null {
  const expiry = parseDateDDMMAAAA(expiryDateStr);
  if (!expiry) return null;

  const todayUtc = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );
  const expiryUtc = Date.UTC(
    expiry.getUTCFullYear(),
    expiry.getUTCMonth(),
    expiry.getUTCDate(),
  );

  const diffMs = expiryUtc - todayUtc;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
