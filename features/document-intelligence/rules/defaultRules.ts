import type { RuleDefinition, RulesConfiguration } from './types';

export const RULE_DEFINITIONS: RuleDefinition[] = [
  // 1. Capa Core: Integridad de Identidad
  {
    id: 'dni_nie_modulo23',
    category: 'core_integrity',
    name: 'Letra DNI / NIE (Módulo 23)',
    description: 'Verifica matemáticamente que la letra de control coincida con el número de documento español.',
    defaultSeverity: 'error',
    defaultEnabled: true,
  },
  {
    id: 'document_not_expired',
    category: 'core_integrity',
    name: 'Vigencia de Documento',
    description: 'Comprueba si el documento ya ha caducado a la fecha actual.',
    defaultSeverity: 'error',
    defaultEnabled: true,
  },
  {
    id: 'cross_check_visual_mrz',
    category: 'core_integrity',
    name: 'Consistencia Visual vs MRZ',
    description: 'Comprueba que los datos visuales (número de documento, nacimiento) concuerden con la zona de lectura óptica MRZ.',
    defaultSeverity: 'warning',
    defaultEnabled: true,
  },
  {
    id: 'logical_dates_order',
    category: 'core_integrity',
    name: 'Coherencia Cronológica de Fechas',
    description: 'Verifica que la fecha de expedición sea anterior a la caducidad y que la fecha de nacimiento no sea futura.',
    defaultSeverity: 'error',
    defaultEnabled: true,
  },

  // 2. Capa Seguros & Pólizas
  {
    id: 'actuarial_age_range',
    category: 'insurance_policy',
    name: 'Rango de Edad Asegurable',
    description: 'Alerta si la edad del asegurado está fuera del rango estándar de contratación sin sobreprima médica.',
    defaultSeverity: 'warning',
    defaultEnabled: true,
    configurableThreshold: {
      key: 'maxAge',
      label: 'Edad Máxima Estándar',
      unit: 'años',
      defaultValue: 65,
      min: 50,
      max: 85,
      step: 1,
    },
  },
  {
    id: 'minor_requires_policyholder',
    category: 'insurance_policy',
    name: 'Menor de Edad (Requiere Tomador)',
    description: 'Notifica que para asegurados menores de 18 años la póliza debe ser contratada por un tomador/tutor legal.',
    defaultSeverity: 'info',
    defaultEnabled: true,
  },

  // 3. Capa Visados & Extranjería
  {
    id: 'visa_expiry_threshold',
    category: 'visa_residency',
    name: 'Vigencia Mínima para Visado / Consulado',
    description: 'Comprueba si el pasaporte tiene la vigencia mínima requerida por consulados (Regla Schengen).',
    defaultSeverity: 'warning',
    defaultEnabled: true,
    configurableThreshold: {
      key: 'minDays',
      label: 'Vigencia Mínima',
      unit: 'días',
      defaultValue: 180,
      min: 30,
      max: 365,
      step: 15,
    },
  },
  {
    id: 'foreigner_passport_iban_requirement',
    category: 'visa_residency',
    name: 'Asegurado Extranjero con Pasaporte',
    description: 'Informa si el documento es pasaporte para recordar requisitos de pago anual o tarjeta bancaria.',
    defaultSeverity: 'info',
    defaultEnabled: true,
  },
];

export function getDefaultRulesConfig(): RulesConfiguration {
  const config: RulesConfiguration = {};
  for (const def of RULE_DEFINITIONS) {
    config[def.id] = {
      enabled: def.defaultEnabled,
      severity: def.defaultSeverity,
      customThresholdValue: def.configurableThreshold?.defaultValue,
    };
  }
  return config;
}
