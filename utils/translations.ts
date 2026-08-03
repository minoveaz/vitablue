// Translations dictionary for multilingual support in VitaBlue V2

export interface NavigationTranslations {
  products: string;
  aboutUs: string;
  blog: string;
  contact: string;
  whatsappCta: string;
  agentBadge: string;
}

export interface StudentTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  callAdvisor: string;
  featuresTitle: string;
  reqTitle: string;
  reqSubtitle: string;
  cardSanitasTitle: string;
  cardSanitasPrice: string;
}

export interface ExpatTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  featuresTitle: string;
}

export interface NomadTranslations {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  callAdvisor: string;
  featuresTitle: string;
}

export const navbarTranslations: Record<'es' | 'en', NavigationTranslations> = {
  es: {
    products: 'Productos',
    aboutUs: 'Sobre Nosotros',
    blog: 'Blog',
    contact: 'Contacto',
    whatsappCta: 'Consultar WhatsApp',
    agentBadge: 'Asesoría Independiente'
  },
  en: {
    products: 'Products',
    aboutUs: 'About Us',
    blog: 'Blog',
    contact: 'Contact',
    whatsappCta: 'WhatsApp Chat',
    agentBadge: 'Independent Advice'
  }
};

export const studentTranslations: Record<'es' | 'en', StudentTranslations> = {
  es: {
    heroTag: 'Seguro Médico Estudiantes',
    heroTitle: 'El seguro médico que exige Extranjería para tu Visado',
    heroSubtitle: 'Consigue tu certificado de cobertura completa en menos de 24 horas. Póliza 100% homologada sin copagos ni carencias.',
    ctaButton: 'Calcular Seguro Online',
    callAdvisor: 'Llamar Gratis',
    featuresTitle: 'Ventajas de Sanitas International Students',
    reqTitle: 'Requisitos Obligatorios del Visado de Estudios',
    reqSubtitle: 'El consulado de España exige que tu seguro médico cumpla estrictamente con las siguientes directrices:',
    cardSanitasTitle: 'Sanitas International Students',
    cardSanitasPrice: 'Desde 39€/mes'
  },
  en: {
    heroTag: 'Student Health Insurance',
    heroTitle: 'The Health Insurance Required by Spanish Consulates',
    heroSubtitle: 'Get your full coverage certificate in less than 24 hours. 100% compliant policy with zero copays and zero waiting periods.',
    ctaButton: 'Calculate Insurance Online',
    callAdvisor: 'Call Toll-Free',
    featuresTitle: 'Advantages of Sanitas International Students',
    reqTitle: 'Mandatory Student Visa Requirements',
    reqSubtitle: 'The Spanish consulate requires your health insurance to strictly comply with these guidelines:',
    cardSanitasTitle: 'Sanitas International Students',
    cardSanitasPrice: 'From 39€/month'
  }
};

export const expatTranslations: Record<'es' | 'en', ExpatTranslations> = {
  es: {
    heroTag: 'Seguro Médico Expatriados',
    heroTitle: 'Seguro Médico para Expatriados y Residentes en España',
    heroSubtitle: 'Compara y contrata la póliza perfecta para tu visado de residencia no lucrativa, Golden Visa o reagrupación. Cobertura completa sin copagos.',
    ctaButton: 'Calcular Seguro Online',
    featuresTitle: 'Coberturas de Sanitas Más Salud Expatriados'
  },
  en: {
    heroTag: 'Expat Health Insurance',
    heroTitle: 'Health Insurance for Expats and Residents in Spain',
    heroSubtitle: 'Compare and contract the perfect policy for your Non-Lucrative Visa, Golden Visa, or family reunification. Full coverage with zero copays.',
    ctaButton: 'Calculate Insurance Online',
    featuresTitle: 'Sanitas Más Salud Expat Coverages'
  }
};

export const nomadTranslations: Record<'es' | 'en', NomadTranslations> = {
  es: {
    heroTag: 'Nómadas Digitales',
    heroTitle: 'Seguro Médico para Nómadas Digitales y Remotos en España',
    heroSubtitle: 'Compara seguros médicos para trabajadores remotos en España. Cobertura médica completa homologada sin copagos y con asistencia global en viajes.',
    ctaButton: 'Calcular Seguro Online',
    callAdvisor: 'Llamar Gratis',
    featuresTitle: 'Garantías Oficiales para Nómadas Digitales'
  },
  en: {
    heroTag: 'Digital Nomads',
    heroTitle: 'Health Insurance for Digital Nomads and Remotes in Spain',
    heroSubtitle: 'Compare health insurance for remote workers in Spain. Full compliant medical coverage with zero copays and global travel assistance.',
    ctaButton: 'Calculate Insurance Online',
    callAdvisor: 'Call Toll-Free',
    featuresTitle: 'Official Guarantees for Digital Nomads'
  }
};
