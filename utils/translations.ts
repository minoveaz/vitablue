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
  callAdvisor: string;
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
    heroTitle: 'Seguro Médico para Visado de Estudiante en España',
    heroSubtitle: 'Pólizas 100% homologadas sin copagos, sin carencias y con repatriación incluida. Recibe tu certificado consular oficial en PDF en menos de 24 horas.',
    ctaButton: 'Calcular Seguro Online',
    callAdvisor: 'Asesoría WhatsApp',
    featuresTitle: 'Garantías Oficiales del Seguro de Estudiantes',
    reqTitle: 'Requisitos Oficiales del Seguro Médico que Exige el Consulado y Extranjería',
    reqSubtitle: 'El consulado de España y las delegaciones de Extranjería exigen que tu póliza médica cumpla estrictamente con estas 4 directrices legales:',
    cardSanitasTitle: 'ASISA Salud Estudiantes',
    cardSanitasPrice: 'Desde 38€/mes'
  },
  en: {
    heroTag: 'Student Health Insurance',
    heroTitle: 'Health Insurance for Student Visa in Spain',
    heroSubtitle: '100% approved policies with zero copays, zero wait times, and repatriation included. Get your official consular PDF certificate in under 24 hours.',
    ctaButton: 'Calculate Insurance Online',
    callAdvisor: 'WhatsApp Advice',
    featuresTitle: 'Official Student Insurance Guarantees',
    reqTitle: 'Official Health Insurance Requirements for Student Visas',
    reqSubtitle: 'The Spanish consulate and immigration offices require your health insurance to strictly comply with these 4 legal guidelines:',
    cardSanitasTitle: 'ASISA Health Students',
    cardSanitasPrice: 'From 38€/month'
  }
};

export const expatTranslations: Record<'es' | 'en', ExpatTranslations> = {
  es: {
    heroTag: 'Seguro Médico Expatriados',
    heroTitle: 'Seguro Médico para Expatriados y Residentes en España',
    heroSubtitle: 'Compara y contrata la póliza perfecta para tu visado de residencia no lucrativa, Golden Visa o reagrupación. Cobertura completa sin copagos.',
    ctaButton: 'Calcular Seguro Online',
    callAdvisor: 'Llamar Gratis',
    featuresTitle: 'Coberturas de Sanitas Más Salud Expatriados'
  },
  en: {
    heroTag: 'Expat Health Insurance',
    heroTitle: 'Health Insurance for Expats and Residents in Spain',
    heroSubtitle: 'Compare and contract the perfect policy for your Non-Lucrative Visa, Golden Visa, or family reunification. Full coverage with zero copays.',
    ctaButton: 'Calculate Insurance Online',
    callAdvisor: 'Call Toll-Free',
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
