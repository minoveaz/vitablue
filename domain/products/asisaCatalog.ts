export interface AsisaCatalogCard {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  price: string;
  link: string;
  badge?: string;
  docCode?: string;
}

export const asisaFeaturedProducts: AsisaCatalogCard[] = [
  {
    id: 'asisa-health-students',
    title: 'ASISA Health Students',
    tagline: 'Seguro para Visado de Estudiante y NIE',
    desc: 'Póliza médica homologada exigida por consulados y Extranjería en España. Sin copagos, sin periodos de carencia y con repatriación ilimitada.',
    features: [
      '100% aceptado en consulados y plataforma MERCURIO',
      'Certificado de cobertura en PDF en 24h con CSV oficial',
      'Repatriación sanitaria y de restos incluida de serie'
    ],
    price: 'Desde 35,00€/mes',
    link: '/productos/seguros-salud/seguros-asisa/asisa-health-students/',
    badge: 'Más Vendido Visados',
    docCode: 'AFR01S0125'
  },
  {
    id: 'asisa-health-residents',
    title: 'ASISA Health Residents',
    tagline: 'Seguro para Residencia No Lucrativa y Nómadas',
    desc: 'Diseñado para ciudadanos extranjeros no comunitarios que tramitan su residencia legal en España. Cobertura completa equivalente al Sistema Nacional de Salud.',
    features: [
      'Válido para Residencia No Lucrativa, Nómada Digital y Arraigo',
      'Sin copagos ni franquicias en hospitalizaciones y consultas',
      'Admite pago anual único requerido por consulados'
    ],
    price: 'Desde 45,00€/mes',
    link: '/productos/seguros-salud/seguros-asisa/asisa-health-residents/',
    badge: 'Expatriados & RNL',
    docCode: 'AFR01S0128'
  },
  {
    id: 'asisa-completa-plus',
    title: 'ASISA Completa +',
    tagline: 'Asistencia Médica Integral con Copago Reducido',
    desc: 'Acceso ilimitado a medicina general, especialistas, pruebas diagnósticas, hospitalización y cirugías con copagos mínimos por consulta.',
    features: [
      'Red hospitalaria propia Grupo HLA y centros concertados',
      'Urgencias médicas ambulatorias y hospitalarias 24/7',
      'Copagos reducidos por consulta médica'
    ],
    price: 'Desde 24,90€/mes',
    link: '/productos/seguros-salud/seguros-asisa/asisa-completa/',
    badge: 'Recomendado Familias',
    docCode: 'AFR01S0015'
  },
  {
    id: 'asisa-completa-plus-plus',
    title: 'ASISA Completa ++',
    tagline: 'Máxima Economía Mensual con Hospitalización',
    desc: 'Póliza de cuadro médico completo con una prima mensual altamente reducida a cambio de copagos medios por acto médico.',
    features: [
      'Hospitalización médica y quirúrgica 100% cubierta',
      'Pruebas diagnósticas complejas (TAC, Resonancias)',
      'Cuota mensual muy reducida ideal para jóvenes y parejas'
    ],
    price: 'Desde 19,90€/mes',
    link: '/productos/seguros-salud/seguros-asisa/asisa-completa/',
    badge: 'Económico',
    docCode: 'AFR01S0080'
  }
];

export const asisaConsultProducts: AsisaCatalogCard[] = [
  {
    id: 'asisa-esencial',
    title: 'ASISA Esencial',
    tagline: 'Asistencia Extra-hospitalaria Sin Listas de Espera',
    desc: 'Póliza ambulatoria orientada a consultas médicas con especialistas y pruebas diagnósticas básicas sin cobertura de hospitalización.',
    features: [
      'Medicina general, pediatría y enfermería',
      'Acceso directo a especialistas médicos concertados',
      'Pruebas diagnósticas simples (análisis, radiografías)'
    ],
    price: 'Consultar tarifa',
    link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20informaci%C3%B3n%20sobre%20ASISA%20Esencial.',
    badge: 'Sin Hospitalización',
    docCode: 'AFR01S0071'
  },
  {
    id: 'asisa-esencial-plus',
    title: 'ASISA Esencial +',
    tagline: 'Cobertura Ambulatoria con Copago Ajustado',
    desc: 'Servicios extrahospitalarios con una cuota mensual ajustada y copago reducido en consultas y pruebas clínicas habituales.',
    features: [
      'Consultas ilimitadas de medicina general y especialistas',
      'Pruebas diagnósticas ambulatorias sin carencias',
      'Preparación al parto y videoconsultas AsisaLIVE'
    ],
    price: 'Consultar tarifa',
    link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20informaci%C3%B3n%20sobre%20ASISA%20Esencial%20%2B.',
    docCode: 'AFR01S0074'
  },
  {
    id: 'asisa-ya',
    title: 'ASISA Ya',
    tagline: 'Acceso Ágil y Preventivo a Cuadro Médico',
    desc: 'Producto de contratación ágil enfocado en chequeos de medicina preventiva, consultas inmediatas y telemedicina 24 horas.',
    features: [
      'Acceso rápido a especialistas de primer nivel',
      'Medicina preventiva y chequeos anuales',
      'Telemedicina AsisaLIVE en móvil sin esperas'
    ],
    price: 'Consultar tarifa',
    link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20informaci%C3%B3n%20sobre%20ASISA%20Ya.',
    badge: 'Acceso Inmediato',
    docCode: 'AFR01S0035'
  },
  {
    id: 'asisa-completa-mutualistas',
    title: 'ASISA Completa Mutualistas',
    tagline: 'Cobertura Completa para Colectivos MUFACE / ISFAS',
    desc: 'Seguro médico y hospitalario integral diseñado para mutualistas públicos y beneficiarios que eligen la asistencia privada de Asisa.',
    features: [
      'Atención hospitalaria y quirúrgica preferente',
      'Acceso a centros del Grupo HLA sin autorizaciones previas',
      'Garantías específicas de asistencia en todo el territorio'
    ],
    price: 'Consultar colectivo',
    link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20informaci%C3%B3n%20sobre%20ASISA%20Completa%20Mutualistas.',
    badge: 'Mutualistas',
    docCode: 'AFR01S0052'
  },
  {
    id: 'asisa-esencial-mutualistas',
    title: 'ASISA Esencial Mutualistas',
    tagline: 'Especialistas y Pruebas para Funcionarios',
    desc: 'Modalidad extrahospitalaria complementaria para mutualistas que desean agilidad en consultas y analíticas privadas.',
    features: [
      'Consultas con cuadro de especialistas de referencia',
      'Analíticas clínicas y radiología de diagnóstico',
      'Complemento flexible a la asistencia habitual'
    ],
    price: 'Consultar colectivo',
    link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20informaci%C3%B3n%20sobre%20ASISA%20Esencial%20Mutualistas.',
    badge: 'Mutualistas',
    docCode: 'AFR01S0088'
  }
];

export const asisaFeaturedProductsEn: AsisaCatalogCard[] = [
  {
    id: 'asisa-health-students',
    title: 'ASISA Health Students',
    tagline: 'Student Visa & NIE Health Insurance',
    desc: 'Official certified medical policy required by Spanish consulates and Immigration (Extranjería). Zero copays, zero wait times, and unlimited repatriation.',
    features: [
      '100% accepted by Spanish Consulates and MERCURIO portal',
      'Official PDF certificate issued in <24h with verified digital code (CSV)',
      'Sanitary & mortal remains repatriation fully included'
    ],
    price: 'From €35.00/mo',
    link: '/en/health-insurance/asisa-health-students/',
    badge: 'Best for Student Visa',
    docCode: 'AFR01S0125'
  },
  {
    id: 'asisa-health-residents',
    title: 'ASISA Health Residents',
    tagline: 'Non-Lucrative Visa & Expat Insurance',
    desc: 'Designed for non-EU citizens applying for legal residency in Spain. Full comprehensive coverage equivalent to the Spanish National Health System.',
    features: [
      'Valid for Non-Lucrative Visa, Digital Nomad, and Arraigo applications',
      'Zero copays or deductibles on hospital stays and medical visits',
      'Allows upfront single annual payment as required by consulates'
    ],
    price: 'From €45.00/mo',
    link: '/en/health-insurance/asisa-health-residents/',
    badge: 'Expats & NLV',
    docCode: 'AFR01S0128'
  },
  {
    id: 'asisa-completa-plus',
    title: 'ASISA Completa +',
    tagline: 'Comprehensive Healthcare with Reduced Copays',
    desc: 'Unlimited direct access to general practitioners, specialists, advanced diagnostics, full hospitalization, and surgery with low copays per visit.',
    features: [
      'Proprietary HLA Hospital Group network and contracted clinics across Spain',
      '24/7 outpatient and emergency room hospitalization',
      'Reduced copays per medical appointment'
    ],
    price: 'From €24.90/mo',
    link: '/en/health-insurance/asisa-completa/',
    badge: 'Recommended for Families',
    docCode: 'AFR01S0015'
  },
  {
    id: 'asisa-completa-plus-plus',
    title: 'ASISA Completa ++',
    tagline: 'Maximum Monthly Savings with Hospitalization',
    desc: 'Full medical network policy with a highly discounted monthly premium in exchange for medium copays per medical procedure.',
    features: [
      '100% covered medical and surgical hospitalization',
      'Complex diagnostic tests (CT scans, MRIs, ultrasound)',
      'Ultra-affordable monthly fee ideal for young adults and couples'
    ],
    price: 'From €19.90/mo',
    link: '/en/health-insurance/asisa-completa/',
    badge: 'Budget Friendly',
    docCode: 'AFR01S0080'
  }
];

export const asisaConsultProductsEn: AsisaCatalogCard[] = [
  {
    id: 'asisa-esencial',
    title: 'ASISA Esencial',
    tagline: 'Outpatient Care Without Waiting Lists',
    desc: 'Outpatient policy focused on direct specialist appointments and diagnostic testing without hospital admission.',
    features: [
      'General medicine, pediatrics, and nursing care',
      'Direct access to contracted medical specialists',
      'Standard diagnostic tests (clinical analysis, x-rays)'
    ],
    price: 'Check rates',
    link: 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20Esencial.',
    badge: 'No Hospitalization',
    docCode: 'AFR01S0071'
  },
  {
    id: 'asisa-esencial-plus',
    title: 'ASISA Esencial +',
    tagline: 'Outpatient Coverage with Adjusted Copays',
    desc: 'Outpatient services with an optimized monthly fee and reduced copays on routine consultations and clinical tests.',
    features: [
      'Unlimited GP and specialist consultations',
      'Outpatient diagnostic testing with zero wait times',
      'Childbirth preparation and AsisaLIVE video doctor'
    ],
    price: 'Check rates',
    link: 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20Esencial%20%2B.',
    docCode: 'AFR01S0074'
  },
  {
    id: 'asisa-ya',
    title: 'ASISA Ya',
    tagline: 'Fast Preventive Access to Medical Network',
    desc: 'Quick-enrollment product focused on annual preventive checkups, immediate consultations, and 24/7 telemedicine.',
    features: [
      'Fast track access to top specialists',
      'Preventive health checkups and annual screenings',
      'AsisaLIVE digital telemedicine on smartphone'
    ],
    price: 'Check rates',
    link: 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20Ya.',
    badge: 'Immediate Access',
    docCode: 'AFR01S0035'
  },
  {
    id: 'asisa-completa-mutualistas',
    title: 'ASISA Completa Mutualistas',
    tagline: 'Comprehensive Healthcare for Civil Servants',
    desc: 'Full medical and hospital policy tailored for public sector mutualists (MUFACE, ISFAS, MUGEJU) choosing private care.',
    features: [
      'Priority hospital and surgical admission',
      'HLA Group hospitals without prior approval hurdles',
      'Nationwide assistance guarantees across Spain'
    ],
    price: 'Check group rate',
    link: 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20Completa%20Mutualistas.',
    badge: 'Civil Servants',
    docCode: 'AFR01S0052'
  },
  {
    id: 'asisa-esencial-mutualistas',
    title: 'ASISA Esencial Mutualistas',
    tagline: 'Specialists & Diagnostics for Civil Servants',
    desc: 'Complementary outpatient plan for public mutualists desiring fast consultations and private clinical testing.',
    features: [
      'Consultations with benchmark specialist network',
      'Clinical laboratory analysis and diagnostic imaging',
      'Flexible supplement to standard public coverage'
    ],
    price: 'Check group rate',
    link: 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20Esencial%20Mutualistas.',
    badge: 'Civil Servants',
    docCode: 'AFR01S0088'
  }
];

export const getAsisaFeaturedProducts = (locale: 'es' | 'en' = 'es'): AsisaCatalogCard[] => {
  return locale === 'en' ? asisaFeaturedProductsEn : asisaFeaturedProducts;
};

export const getAsisaConsultProducts = (locale: 'es' | 'en' = 'es'): AsisaCatalogCard[] => {
  return locale === 'en' ? asisaConsultProductsEn : asisaConsultProducts;
};

