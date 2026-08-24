import { buildAttributedWhatsAppUrl } from '@/utils/analytics';

export interface RedirectState {
  profile: 'student' | 'expat' | 'nomad' | 'individual' | 'pet' | null;
  ageRange: '18_24' | '25_30' | '31_40' | 'plus_40' | null;
  visaRequired: 'yes' | 'no' | 'unknown' | null;
  residencyType?: 'non_lucrative' | 'work' | 'golden_visa' | 'reunification' | null;
  nationality?: string; // Autocomplete nationality string
  duration?: 'less_6' | '6_12' | 'more_12' | null;
}

export const getWhatsAppLink = (state: RedirectState): string => {
  const phone = '34694583452';
  let message = 'Hola! Vengo de la web de VitaBlue. Necesito asesoramiento general sobre seguros de salud.';

  // Map user-friendly labels
  const ageLabels: Record<string, string> = {
    '18_24': 'entre 18 y 24',
    '25_30': 'entre 25 y 30',
    '31_40': 'entre 31 y 40',
    'plus_40': 'más de 40'
  };

  const residencyLabels: Record<string, string> = {
    'non_lucrative': 'Residencia No Lucrativa',
    'work': 'Visado de Trabajo',
    'golden_visa': 'Golden Visa',
    'reunification': 'Reagrupación Familiar'
  };

  const ageText = state.ageRange ? ageLabels[state.ageRange] : '';
  const nationalityText = state.nationality ? ` de nacionalidad ${state.nationality}` : '';

  if (state.profile === 'student') {
    const visaText = state.visaRequired === 'yes' ? 'válido para visado' : 'sin copago';
    message = `Hola! Acabo de cotizar un seguro médico para estudiante extranjero ${nationalityText} en VitaBlue. Tengo ${ageText || 'edad de estudiante'} años y busco un seguro ${visaText}. ¿Podríais pasarme información?`;
  } else if (state.profile === 'expat') {
    const resText = state.residencyType ? residencyLabels[state.residencyType] : 'residencia';
    message = `Hola! Acabo de cotizar un seguro de salud para expatriados en VitaBlue. Tengo ${ageText || 'edad de expatriado'} años${nationalityText} y busco cobertura para trámite de ${resText}. ¿Me enviáis opciones?`;
  } else if (state.profile === 'nomad') {
    message = `Hola! Acabo de cotizar un seguro para nómada digital en VitaBlue. Tengo ${ageText || 'edad de nómada'} años${nationalityText} y busco cobertura médica flexible para España y viajes. ¿Me pasáis precios?`;
  }

  return buildAttributedWhatsAppUrl(phone, message, state.profile || 'COTIZADOR');
};

