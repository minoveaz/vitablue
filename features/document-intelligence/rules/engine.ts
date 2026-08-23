import type { IdentityDocumentFields } from '../types';
import {
  calculateAgeInYears,
  calculateDaysUntilExpiry,
  parseDateDDMMAAAA,
  validateDniNieModulo23,
} from './algorithms';
import { getDefaultRulesConfig, RULE_DEFINITIONS } from './defaultRules';
import type {
  RuleEvaluationContext,
  RulesConfiguration,
  ValidationAlert,
} from './types';

/**
 * Ejecuta el motor determinista de reglas sobre los datos extraídos de un documento.
 * Totalmente desacoplado de React y del navegador para ejecución transparente en Loopdev / backend.
 */
export function evaluateRules(
  fields: IdentityDocumentFields,
  config: RulesConfiguration = getDefaultRulesConfig(),
  context: RuleEvaluationContext = {},
): ValidationAlert[] {
  const alerts: ValidationAlert[] = [];
  const today = context.today ?? new Date();

  // Helper para verificar si una regla está activa
  const isEnabled = (ruleId: string) => Boolean(config[ruleId]?.enabled ?? true);
  const getSeverity = (ruleId: string) =>
    config[ruleId]?.severity ??
    RULE_DEFINITIONS.find((r) => r.id === ruleId)?.defaultSeverity ??
    'warning';
  const getThreshold = (ruleId: string, fallback: number) =>
    config[ruleId]?.customThresholdValue ?? fallback;

  // -------------------------------------------------------------
  // 1. Capa Core: Letra DNI / NIE (Módulo 23)
  // -------------------------------------------------------------
  if (isEnabled('dni_nie_modulo23') && fields.documentNumber) {
    const res = validateDniNieModulo23(fields.documentNumber);
    if (res.isSpanishId && !res.isValid) {
      alerts.push({
        ruleId: 'dni_nie_modulo23',
        ruleName: 'Letra DNI / NIE (Módulo 23)',
        category: 'core_integrity',
        severity: getSeverity('dni_nie_modulo23'),
        title: 'Letra de control incorrecta',
        message: `El número ${fields.documentNumber} tiene letra '${res.actualLetter}', pero el algoritmo oficial calcula '${res.expectedLetter}'.`,
        recommendation: `Corrige la letra a '${res.expectedLetter}' o verifica la imagen del documento.`,
        affectedFields: ['documentNumber'],
      });
    }
  }

  // -------------------------------------------------------------
  // 2. Capa Core: Vigencia de Documento
  // -------------------------------------------------------------
  if (isEnabled('document_not_expired') && fields.expiryDate) {
    const days = calculateDaysUntilExpiry(fields.expiryDate, today);
    if (days !== null && days < 0) {
      alerts.push({
        ruleId: 'document_not_expired',
        ruleName: 'Vigencia de Documento',
        category: 'core_integrity',
        severity: getSeverity('document_not_expired'),
        title: 'Documento caducado',
        message: `El documento caducó hace ${Math.abs(days)} días (fecha de caducidad: ${fields.expiryDate}).`,
        recommendation: 'Solicita un documento vigente o resguardo de renovación en trámite.',
        affectedFields: ['expiryDate'],
      });
    }
  }

  // -------------------------------------------------------------
  // 3. Capa Core: Coherencia Cronológica de Fechas
  // -------------------------------------------------------------
  if (isEnabled('logical_dates_order')) {
    const birth = parseDateDDMMAAAA(fields.birthDate);
    const issue = parseDateDDMMAAAA(fields.issueDate);
    const expiry = parseDateDDMMAAAA(fields.expiryDate);

    if (birth && birth.getTime() > today.getTime()) {
      alerts.push({
        ruleId: 'logical_dates_order',
        ruleName: 'Coherencia Cronológica',
        category: 'core_integrity',
        severity: getSeverity('logical_dates_order'),
        title: 'Fecha de nacimiento futura',
        message: `La fecha de nacimiento (${fields.birthDate}) es posterior a la fecha actual.`,
        affectedFields: ['birthDate'],
      });
    }

    if (issue && expiry && issue.getTime() >= expiry.getTime()) {
      alerts.push({
        ruleId: 'logical_dates_order',
        ruleName: 'Coherencia Cronológica',
        category: 'core_integrity',
        severity: getSeverity('logical_dates_order'),
        title: 'Fechas de expedición y caducidad incongruentes',
        message: `La fecha de expedición (${fields.issueDate}) es igual o posterior a la fecha de caducidad (${fields.expiryDate}).`,
        affectedFields: ['issueDate', 'expiryDate'],
      });
    }
  }

  // -------------------------------------------------------------
  // 4. Capa Core: Consistencia Visual vs MRZ
  // -------------------------------------------------------------
  if (isEnabled('cross_check_visual_mrz') && fields.mrz) {
    // Si hay MRZ, extraer el número de documento embebido en la 2ª línea o línea 1
    const cleanMrz = fields.mrz.replace(/\r?\n/g, '').toUpperCase();
    if (fields.documentNumber) {
      const cleanDocNum = fields.documentNumber.replace(/[-\s]/g, '').toUpperCase();
      // En pasaportes y DNI, los primeros 8-9 caracteres de la 2ª línea contienen el doc number
      if (cleanDocNum.length >= 6 && !cleanMrz.includes(cleanDocNum)) {
        alerts.push({
          ruleId: 'cross_check_visual_mrz',
          ruleName: 'Consistencia Visual vs MRZ',
          category: 'core_integrity',
          severity: getSeverity('cross_check_visual_mrz'),
          title: 'Discrepancia en número de documento',
          message: `El número visual (${fields.documentNumber}) no coincide con los datos codificados en el código MRZ.`,
          recommendation: 'Verifica si la zona visual o la zona MRZ fue leída con menor nitidez.',
          affectedFields: ['documentNumber', 'mrz'],
        });
      }
    }
  }

  // -------------------------------------------------------------
  // 5. Capa Seguros: Rango de Edad Asegurable & Edad Actuarial
  // -------------------------------------------------------------
  if (isEnabled('actuarial_age_range') && fields.birthDate) {
    const age = calculateAgeInYears(fields.birthDate, today);
    const maxAge = getThreshold('actuarial_age_range', 65);

    if (age !== null && age > maxAge) {
      alerts.push({
        ruleId: 'actuarial_age_range',
        ruleName: 'Rango de Edad Asegurable',
        category: 'insurance_policy',
        severity: getSeverity('actuarial_age_range'),
        title: `Edad actuarial elevada (${age} años)`,
        message: `El asegurado tiene ${age} años, superando el límite estándar de contratación (${maxAge} años).`,
        recommendation: 'Verifica productos senior con cuestionario de salud ampliado.',
        affectedFields: ['birthDate'],
      });
    }
  }

  // -------------------------------------------------------------
  // 6. Capa Seguros: Menor de Edad
  // -------------------------------------------------------------
  if (isEnabled('minor_requires_policyholder') && fields.birthDate) {
    const age = calculateAgeInYears(fields.birthDate, today);
    if (age !== null && age < 18) {
      alerts.push({
        ruleId: 'minor_requires_policyholder',
        ruleName: 'Menor de Edad (Requiere Tomador)',
        category: 'insurance_policy',
        severity: getSeverity('minor_requires_policyholder'),
        title: `Asegurado menor de edad (${age} años)`,
        message: `El asegurado tiene ${age} años. La contratación requerirá un tomador legal mayor de edad.`,
        recommendation: 'Asegúrate de recabar los datos de identidad del padre, madre o tutor legal.',
        affectedFields: ['birthDate'],
      });
    }
  }

  // -------------------------------------------------------------
  // 7. Capa Visados: Vigencia Mínima para Visado / Consulado
  // -------------------------------------------------------------
  if (isEnabled('visa_expiry_threshold') && fields.expiryDate) {
    const days = calculateDaysUntilExpiry(fields.expiryDate, today);
    const minDays = getThreshold('visa_expiry_threshold', 180);

    if (days !== null && days >= 0 && days < minDays) {
      alerts.push({
        ruleId: 'visa_expiry_threshold',
        ruleName: 'Vigencia Mínima para Visado',
        category: 'visa_residency',
        severity: getSeverity('visa_expiry_threshold'),
        title: `Caducidad próxima (${days} días restantes)`,
        message: `El documento caduca en ${days} días. Para trámites de visado o extranjería (Schengen) se exigen al menos ${minDays} días (aprox. ${Math.round(minDays / 30)} meses) de vigencia.`,
        recommendation: 'Informa al solicitante sobre la conveniencia de renovar el pasaporte antes de la cita consular.',
        affectedFields: ['expiryDate'],
      });
    }
  }

  // -------------------------------------------------------------
  // 8. Capa Visados: Asegurado Extranjero con Pasaporte
  // -------------------------------------------------------------
  if (isEnabled('foreigner_passport_iban_requirement')) {
    const isPassport =
      fields.documentType === 'passport' ||
      (!fields.documentType && fields.documentNumber && !validateDniNieModulo23(fields.documentNumber).isSpanishId);

    if (isPassport) {
      alerts.push({
        ruleId: 'foreigner_passport_iban_requirement',
        ruleName: 'Asegurado con Pasaporte Extranjero',
        category: 'visa_residency',
        severity: getSeverity('foreigner_passport_iban_requirement'),
        title: 'Póliza con pasaporte extranjero',
        message: 'Asegurado identificado mediante pasaporte internacional.',
        recommendation: 'Si no dispone de cuenta bancaria IBAN en España, selecciona cobro con tarjeta o pago anual.',
        affectedFields: ['documentNumber'],
      });
    }
  }

  return alerts;
}
