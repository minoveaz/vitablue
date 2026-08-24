/**
 * Consular Requirements Validator - Diagnostic Engine
 * Evaluates whether an insurance policy satisfies Spanish Immigration and Consular regulations (RD 557/2011, Ley 28/2022).
 */

export type VisaType = 'student' | 'nomad' | 'non_lucrative' | 'other';
export type InsurerCategory = 'spanish_authorized' | 'foreign_local' | 'travel_assistance' | 'credit_card';
export type CopayStatus = 'zero_copay' | 'low_copay' | 'high_deductible' | 'unknown';
export type WaitingPeriodStatus = 'zero_waiting' | 'has_waiting' | 'unknown';
export type RepatriationStatus = 'included' | 'not_included' | 'unknown';

export interface ConsularValidatorInput {
  visaType: VisaType;
  country: string;
  consulateCity?: string;
  insurerCategory: InsurerCategory;
  insurerName?: string;
  copayStatus: CopayStatus;
  waitingPeriodStatus: WaitingPeriodStatus;
  repatriationStatus: RepatriationStatus;
  hasCertificateInSpanish?: boolean;
}

export type DiagnosisStatus = 'APPROVED' | 'WARNING' | 'REJECTED';

export interface DiagnosisPillarResult {
  pillar: string;
  label: string;
  passed: boolean;
  status: 'pass' | 'warning' | 'fail';
  description: string;
}

export interface ConsularDiagnosisResult {
  status: DiagnosisStatus;
  statusTitle: string;
  statusSubtitle: string;
  score: number; // 0 to 100
  pillars: DiagnosisPillarResult[];
  rejectionRisks: string[];
  recommendations: string[];
  recommendedPlan: {
    name: string;
    startingPrice: string;
    actionUrl: string;
  };
  whatsappTag: string;
  whatsappMessage: string;
}

export const evaluateConsularInsurance = (input: ConsularValidatorInput): ConsularDiagnosisResult => {
  const risks: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Pillar 1: Licensed Spanish Insurer (DGSFP)
  let pillar1Status: 'pass' | 'warning' | 'fail' = 'pass';
  let pillar1Desc = 'Aseguradora autorizada por la DGSFP en España con acceso directo a hospitales.';
  if (input.insurerCategory === 'travel_assistance') {
    pillar1Status = 'fail';
    score -= 40;
    pillar1Desc = 'Los seguros de viaje operan por reembolso y son sistemáticamente rechazados por consulados y Extranjería.';
    risks.push('Motivo de denegación directo: Póliza de asistencia al viajero con tope de cobertura en lugar de seguro médico completo de salud.');
    recommendations.push('Sustituir por una póliza médica privada española (ASISA, Sanitas o Adeslas) con certificado oficial.');
  } else if (input.insurerCategory === 'foreign_local') {
    pillar1Status = 'fail';
    score -= 35;
    pillar1Desc = 'Las pólizas emitidas en el país de origen sin sucursal directa en España no son admitidas por ventanilla consular.';
    risks.push('Riesgo de inadmisión: La entidad no está registrada en la Dirección General de Seguros y Fondos de Pensiones (DGSFP) de España.');
    recommendations.push('Emitir póliza con entidad autorizada en España con certificado consular nominal en castellano.');
  } else if (input.insurerCategory === 'credit_card') {
    pillar1Status = 'fail';
    score -= 45;
    pillar1Desc = 'Las coberturas de tarjetas bancarias solo cubren estancias turísticas cortas (máx 90 días) y no sirven para visados.';
    risks.push('Denegación segura: Cobertura bancaria sin validez jurídica para visados ni tarjetas de residencia (TIE).');
    recommendations.push('Contratar seguro médico de salud de larga duración específico para estancia o residencia.');
  }

  // Pillar 2: Zero Copays
  let pillar2Status: 'pass' | 'warning' | 'fail' = 'pass';
  let pillar2Desc = 'Póliza sin copagos ni franquicias (0€ por acto médico). Cumple normativa al 100%.';
  if (input.copayStatus === 'high_deductible') {
    pillar2Status = 'fail';
    score -= 30;
    pillar2Desc = 'Póliza con deducible en dólares o euros. Prohibido expresamente por el Reglamento de Extranjería.';
    risks.push('Requerimiento o rechazo: El consulado exige que la póliza no tenga deducibles a cargo del solicitante.');
    recommendations.push('Cambiar la póliza a modalidad "Sin Copagos" con cobertura sanitaria completa ilimitada.');
  } else if (input.copayStatus === 'low_copay') {
    pillar2Status = 'warning';
    score -= 20;
    pillar2Desc = 'Póliza con copagos por consulta (10€ - 25€). Genera requerimiento de subsanación en consulados estrictos.';
    risks.push('Riesgo en consulado: Algunas oficinas consulares rechazan pólizas con cualquier copago por consulta.');
    recommendations.push('Asegurar que el certificado emitido declare expresamente "Póliza sin copagos ni franquicias".');
  } else if (input.copayStatus === 'unknown') {
    pillar2Status = 'warning';
    score -= 10;
    pillar2Desc = 'Verifica en las condiciones particulares que la modalidad contratada sea expresamente "Sin Copago".';
  }

  // Pillar 3: No Waiting Periods
  let pillar3Status: 'pass' | 'warning' | 'fail' = 'pass';
  let pillar3Desc = 'Coberturas médicas y hospitalarias activas desde el primer día de vigencia en España.';
  if (input.waitingPeriodStatus === 'has_waiting') {
    pillar3Status = 'warning';
    score -= 15;
    pillar3Desc = 'La póliza contiene periodos de carencia para hospitalización o cirugías. Puede ser observada en extranjería.';
    risks.push('Observación consular: Exigen que las prestaciones de urgencia y hospitalización estén activas desde el día 1.');
    recommendations.push('Solicitar certificado consular especial que acredite la activación inmediata de coberturas de urgencia.');
  } else if (input.waitingPeriodStatus === 'unknown') {
    pillar3Status = 'warning';
    score -= 5;
    pillar3Desc = 'Comprueba que no apliquen carencias para hospitalizaciones ni pruebas de alta resolución.';
  }

  // Pillar 4: Repatriation
  let pillar4Status: 'pass' | 'warning' | 'fail' = 'pass';
  let pillar4Desc = 'Cobertura completa de repatriación sanitaria urgente y de restos mortales al país de origen.';
  if (input.repatriationStatus === 'not_included') {
    pillar4Status = 'fail';
    score -= 20;
    pillar4Desc = 'Sin cláusula de repatriación. Requisito obligatorio según el Ministerio de Asuntos Exteriores.';
    risks.push('Motivo frecuente de requerimiento: Ausencia del suplemento obligatorio de repatriación de restos mortales.');
    recommendations.push('Añadir la cobertura de repatriación (incluida por defecto en pólizas de estudiantes y nómadas de VitaBlue).');
  } else if (input.repatriationStatus === 'unknown') {
    pillar4Status = 'warning';
    score -= 10;
    pillar4Desc = 'Revisa que en el certificado aparezca explícitamente la cobertura de repatriación.';
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine overall status
  let status: DiagnosisStatus = 'APPROVED';
  let statusTitle = '¡Tu seguro médico es 100% Apto para el Visado!';
  let statusSubtitle = 'Cumple rigurosamente los 4 requisitos legales exigidos por los Consulados de España y la Oficina de Extranjería.';

  if (score < 60 || pillar1Status === 'fail' || pillar2Status === 'fail') {
    status = 'REJECTED';
    statusTitle = 'Alto Riesgo de Denegación Consular';
    statusSubtitle = 'Tu póliza actual presenta irregularidades técnicas que motivan el rechazo inmediato de la solicitud de visado.';
  } else if (score < 85 || pillar2Status === 'warning' || pillar3Status === 'warning' || pillar4Status === 'warning') {
    status = 'WARNING';
    statusTitle = 'Póliza con Riesgo de Requerimiento';
    statusSubtitle = 'Tu seguro cumple de forma parcial, pero requiere ajustes o un certificado con cláusulas específicas para evitar demoras.';
  }

  const countryNormalized = (input.country || 'ESP').toUpperCase().replace(/[^A-Z]/g, '');
  const whatsappTag = `VALIDADOR-${countryNormalized}-${status}`;

  const whatsappMessage = status === 'APPROVED'
    ? `Hola! He realizado el test en el Validador de Visado de VitaBlue para ${input.country} y mi perfil está al 100%. Quiero asesoramiento para tramitar el certificado consular oficial en 24h.`
    : `Hola! He realizado el test en el Validador de Visado de VitaBlue para ${input.country} y mi póliza dio resultado de ${status === 'REJECTED' ? 'Alto Riesgo' : 'Advertencia'}. Necesito ayuda urgente con un asesor para contratar una póliza homologada sin copagos.`;

  const recommendedPlan = input.visaType === 'nomad'
    ? { name: 'ASISA Nómadas Digitales', startingPrice: 'Desde 35€/mes', actionUrl: '/productos/seguros-salud/seguro-nomadas-digitales' }
    : input.visaType === 'non_lucrative'
    ? { name: 'Sanitas Más Salud (Residencia No Lucrativa)', startingPrice: 'Desde 45€/mes', actionUrl: '/productos/seguros-salud/seguro-expatriados' }
    : { name: 'ASISA / Sanitas Internacional Estudiantes', startingPrice: 'Desde 35€/mes', actionUrl: '/productos/seguros-salud/seguro-medico-estudiantes' };

  return {
    status,
    statusTitle,
    statusSubtitle,
    score,
    pillars: [
      {
        pillar: 'Aseguradora DGSFP',
        label: 'Aseguradora Autorizada en España',
        passed: pillar1Status === 'pass',
        status: pillar1Status,
        description: pillar1Desc,
      },
      {
        pillar: 'Sin Copagos',
        label: 'Cero Copagos y Cero Franquicias',
        passed: pillar2Status === 'pass',
        status: pillar2Status,
        description: pillar2Desc,
      },
      {
        pillar: 'Sin Carencias',
        label: 'Sin Periodos de Carencia',
        passed: pillar3Status === 'pass',
        status: pillar3Status,
        description: pillar3Desc,
      },
      {
        pillar: 'Repatriación',
        label: 'Repatriación Sanitaria y Funeraria',
        passed: pillar4Status === 'pass',
        status: pillar4Status,
        description: pillar4Desc,
      },
    ],
    rejectionRisks: risks.length > 0 ? risks : ['Ningún riesgo detectado. Tu documentación se ajusta al marco legal de Extranjería.'],
    recommendations: recommendations.length > 0 ? recommendations : ['Solicitar el Certificado Oficial Consular con firma electrónica y presentarlo en tu cita.'],
    recommendedPlan,
    whatsappTag,
    whatsappMessage,
  };
};
