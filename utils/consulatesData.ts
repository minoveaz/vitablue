/**
 * Official Consulates and Visa Insurance Data Specification
 * Comprehensive legal and procedural data for Spanish Consulates in Latin America.
 * All URLs strictly follow the hierarchical Silo architecture:
 * /productos/seguros-salud/seguro-medico-estudiantes/:country
 */

export interface ConsulateData {
  slug: string;
  country: string;
  city: string;
  flag: string;
  title: string;
  metaDescription: string;
  canonicalPath: string;
  consulateName: string;
  consulateAddress: string;
  consulateJurisdiction: string;
  blsCenter: string;
  heroSubtitle: string;
  appointmentLeadTime: string;
  priceFromEur: number;
  currencyCode: string;
  rateEurToLocal: number;
  priceFromLocal: string;
  whatsappTag: string;
  whatsappMessage: string;
  specificNotices: string[];
  visaTypes: {
    name: string;
    description: string;
    validity: string;
  }[];
  mandatoryRequirements: {
    title: string;
    description: string;
    badge: string;
  }[];
  commonRejectionReasons: {
    reason: string;
    solution: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const consulatesList: ConsulateData[] = [
  {
    slug: 'colombia',
    country: 'Colombia',
    city: 'Bogotá',
    flag: '🇨🇴',
    title: 'Seguro Médico para Visado de España en Colombia (Consulado de Bogotá 2026)',
    metaDescription: 'Seguro médico 100% homologado para visado en el Consulado de España en Bogotá y BLS Colombia. Sin copagos, sin carencias, repatriación y certificado en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/colombia',
    consulateName: 'Consulado General de España en Bogotá',
    consulateAddress: 'Calle 94 A N.º 11A-70, Bogotá D.C., Colombia',
    consulateJurisdiction: 'Toda la República de Colombia',
    blsCenter: 'Centro de Solicitud de Visados BLS International Bogotá (Calle 98 # 22-64)',
    heroSubtitle: 'Cumple al 100% las exigencias del Consulado de España en Bogotá y BLS International Colombia. Pólizas autorizadas con Asisa, Sanitas y Adeslas.',
    appointmentLeadTime: '20 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'COP',
    rateEurToLocal: 4300,
    priceFromLocal: 'Aprox. 150.000 COP / mes',
    whatsappTag: 'CONS-BOGOTA',
    whatsappMessage: 'Hola! Solicito visado para España en el Consulado de Bogotá (Colombia). Necesito asesoramiento para contratar el seguro médico homologado sin copagos con certificado consular.',
    specificNotices: [
      'El Consulado de España en Bogotá exige obligatoriamente certificado en castellano emitido por aseguradora autorizada en España.',
      'BLS Bogotá no admite seguros de asistencia al viajero con reembolso diferido ni pólizas colombianas locales.',
      'Garantía VitaBlue: Si tu visado es denegado, te reembolsamos el 100% de la prima presentando la resolución consular.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estudiante (Estancia por Estudios / Máster)',
        description: 'Obligatorio para pregrados, posgrados, doctorados o estancias formativas superiores a 90 días en universidades y escuelas españolas.',
        validity: 'De 3 a 12 meses renovable',
      },
      {
        name: 'Visado de Nómada Digital (Ley de Startups)',
        description: 'Para profesionales colombianos que teletrabajan para empresas extranjeras desde territorio español.',
        validity: '1 año inicial (renovable a 3 años)',
      },
      {
        name: 'Visado de Residencia No Lucrativa',
        description: 'Para personas que trasladan su residencia a España y acreditan solvencia económica sin realizar actividades laborales.',
        validity: '1 año prorrogable',
      },
      {
        name: 'Visado de Prácticas Profesionales y Auxiliares NALCAP',
        description: 'Para egresados universitarios y auxiliares de conversación en colegios públicos o privados.',
        validity: 'De 6 a 12 meses',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Entidad Autorizada en España (DGSFP)',
        description: 'La aseguradora debe operar legalmente en España bajo supervisión de la Dirección General de Seguros y Fondos de Pensiones (como ASISA, Sanitas o Adeslas).',
        badge: 'Legalidad DGSFP',
      },
      {
        title: 'Cero Copagos y Cero Franquicias',
        description: 'La póliza no puede exigir abonos por consultas, urgencias, analíticas ni hospitalizaciones.',
        badge: '0€ Copagos',
      },
      {
        title: 'Sin Periodos de Carencia',
        description: 'Cobertura inmediata y activa desde el primer día de llegada a España para urgencias y hospitalización.',
        badge: 'Sin Carencias',
      },
      {
        title: 'Repatriación Sanitaria y Funeraria',
        description: 'Cobertura integral de traslado médico urgente o repatriación de restos mortales al país de origen (Colombia).',
        badge: 'Repatriación Incluida',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Presentar un seguro de viaje o asistencia médica con tope (ej. 30.000€).',
        solution: 'El consulado exige seguro de salud de cuadro completo con hospitalización ilimitada en centros médicos de España.',
      },
      {
        reason: 'Seguros médicos emitidos por aseguradoras colombianas sin sucursal directa en España.',
        solution: 'Contratar pólizas con aseguradoras líderes en España como ASISA o Sanitas con certificado oficial sellado.',
      },
      {
        reason: 'Pólizas con cláusulas de copago de 10€ a 20€ por visita médica.',
        solution: 'En VitaBlue solo emitimos pólizas en su modalidad "Sin Copagos" pre-configuradas para extranjería.',
      },
    ],
    faqs: [
      {
        q: '¿Qué aseguradoras acepta el Consulado de España en Bogotá?',
        a: 'El Consulado de España en Bogotá acepta pólizas de aseguradoras privadas registradas en la DGSFP de España que incluyan hospitalización completa, sin copagos, sin carencias y repatriación. En VitaBlue trabajamos principalmente con ASISA, Sanitas, Adeslas y DKV, todas 100% aceptadas.',
      },
      {
        q: '¿Cuándo debo contratar el seguro médico para mi cita en BLS Bogotá?',
        a: 'Recomendamos contratar el seguro entre 1 y 2 semanas antes de tu cita consular. La fecha de inicio del seguro debe coincidir con tu fecha estimada de viaje a España o el inicio de tu curso académico.',
      },
      {
        q: '¿Qué certificado me entregan para presentar en la cita?',
        a: 'Recibirás un Certificado Consular Oficial en español, firmado y sellado digitalmente por la aseguradora, donde se certifica expresamente la ausencia de copagos, carencias y la inclusión de la repatriación.',
      },
      {
        q: '¿Qué pasa con mi dinero si el consulado deniega mi visado?',
        a: 'Con VitaBlue cuentas con la Garantía de Devolución del 100%. Solo debes enviarnos la carta oficial de denegación consular y la aseguradora te reembolsará el importe íntegro abonado.',
      },
    ],
  },
  {
    slug: 'mexico',
    country: 'México',
    city: 'Ciudad de México',
    flag: '🇲🇽',
    title: 'Seguro Médico para Visado de España en México (CDMX, Guadalajara y Monterrey 2026)',
    metaDescription: 'Seguro médico para visado en el Consulado de España en CDMX, Guadalajara y Monterrey. Sin copagos, hospitalización ilimitada, repatriación y certificado en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/mexico',
    consulateName: 'Consulado General de España en Ciudad de México',
    consulateAddress: 'Calle Galileo 114 (esq. Horacio), Colonia Polanco, Miguel Hidalgo, 11560 CDMX, México',
    consulateJurisdiction: 'Estados Unidos Mexicanos (incluyendo sedes en Guadalajara y Monterrey)',
    blsCenter: 'Centro BLS Visados España CDMX (Ejército Nacional Mexicano)',
    heroSubtitle: 'Pólizas de salud oficiales para el visado de estudiante, nómada digital y residencia en España tramitados en México. Aprobación 100% garantizada.',
    appointmentLeadTime: '15 a 25 días hábiles',
    priceFromEur: 35,
    currencyCode: 'MXN',
    rateEurToLocal: 21.5,
    priceFromLocal: 'Aprox. 750 MXN / mes',
    whatsappTag: 'CONS-MEXICO',
    whatsappMessage: 'Hola! Tramito visado en el Consulado de España en México. Quiero información y cotización del seguro médico sin copagos para visado con certificado oficial.',
    specificNotices: [
      'El Consulado en CDMX y BLS México verifican rigurosamente que la póliza no tenga deducible en dólares ni copago en euros.',
      'Los certificados se emiten en formato digital de alta resolución aceptado directamente en ventanilla consular.',
      'Cobertura médica integral en las principales ciudades universitarias de España: Madrid, Barcelona, Valencia, Salamanca y Sevilla.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estudios y Maestrías',
        description: 'Imprescindible para estudiantes mexicanos inscritos en universidades, escuelas de negocios o centros de investigación españoles.',
        validity: 'Hasta 1 año renovable en España',
      },
      {
        name: 'Visado para Nómadas Digitales y Teletrabajadores',
        description: 'Para profesionales y freelancers que facturan a clientes de México/EE.UU. y desean residir legalmente en España.',
        validity: '1 año en consulado / 3 años UGE',
      },
      {
        name: 'Visado de Residencia No Lucrativa',
        description: 'Para jubilados y familias mexicanas que desean vivir en España con fondos propios.',
        validity: '1 año inicial prorrogable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Compañía Aseguradora en España',
        description: 'Entidad autorizada por la DGSFP para operar en el Sistema Nacional de Salud privado.',
        badge: 'Autorización DGSFP',
      },
      {
        title: 'Sin Deducibles ni Copagos',
        description: 'Prohibido cualquier copago por consulta o intervención médica durante la estancia.',
        badge: 'Sin Deducibles',
      },
      {
        title: 'Hospitalización y Cirugías Ilimitadas',
        description: 'Acceso a especialistas, pruebas de alta resolución, quirófano e internamiento hospitalario completo.',
        badge: 'Cuadro Médico Completo',
      },
      {
        title: 'Repatriación Sanitaria al País de Origen',
        description: 'Traslado del asegurado o repatriación de restos mortales a México en caso de fallecimiento.',
        badge: 'Repatriación México',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Seguros de Gastos Médicos Mayores (SGMM) nacionales con endoso de cobertura en el extranjero.',
        solution: 'El consulado en Polanco no acepta pólizas mexicanas locales; exige seguro contratado con entidad española autorizada.',
      },
      {
        reason: 'Pólizas con deducibles elevados en dólares americanos ($500 a $2,000 USD).',
        solution: 'Emitir póliza en España con 0€ de deducible y 0€ de copago.',
      },
    ],
    faqs: [
      {
        q: '¿Cómo pago el seguro desde México?',
        a: 'Puedes pagar de forma 100% segura con cualquier tarjeta de crédito o débito mexicana (Visa, Mastercard, AMEX) o transferencia internacional. La póliza se emite en euros y tu banco realiza la conversión automáticamente.',
      },
      {
        q: '¿Qué documento entrego en mi cita consular en Galileo 114?',
        a: 'Imprimes el Certificado Oficial de Cobertura que te enviamos en PDF. Viene sellado y con código de verificación digital para que el funcionario consular compruebe la autenticidad al instante.',
      },
      {
        q: '¿El seguro cubre el viaje de ida a España?',
        a: 'La póliza entra en vigor el día que tú elijas (por ejemplo, el día de tu vuelo a España) y te cubre desde el momento en que aterrizas en territorio español.',
      },
    ],
  },
  {
    slug: 'peru',
    country: 'Perú',
    city: 'Lima',
    flag: '🇵🇪',
    title: 'Seguro Médico para Visado de España en Perú (Consulado de Lima 2026)',
    metaDescription: 'Seguro médico para visado en el Consulado de España en Lima y BLS Perú. Sin copagos, sin carencias, repatriación sanitaria y certificado en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/peru',
    consulateName: 'Consulado General de España en Lima',
    consulateAddress: 'Calle Los Ficus 241, San Isidro, Lima 27, Perú',
    consulateJurisdiction: 'Todo el territorio de la República del Perú',
    blsCenter: 'BLS International Centro de Visados Lima (Miraflores)',
    heroSubtitle: 'Pólizas homologadas para visados de estudios, residencia y nómadas digitales en el Consulado de España en San Isidro (Lima). 100% aceptado.',
    appointmentLeadTime: '20 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'PEN',
    rateEurToLocal: 4.0,
    priceFromLocal: 'Aprox. 140 PEN / mes',
    whatsappTag: 'CONS-PERU',
    whatsappMessage: 'Hola! Tramito visado en el Consulado de España en Lima (Perú). Necesito asesoramiento para el seguro médico oficial sin copagos con certificado consular.',
    specificNotices: [
      'El Consulado de España en Lima exige seguro médico con cobertura total en España equivalente a las prestaciones de la Seguridad Social española.',
      'BLS Lima exige documento oficial en original digital sellado por la aseguradora en España.',
      'Reembolso total de la prima en caso de denegación del visado por la autoridad consular.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estudiante (Pregrado y Posgrado)',
        description: 'Para estudiantes peruanos que van a cursar licenciaturas, másteres o doctorados oficiales.',
        validity: 'Hasta 1 año renovable',
      },
      {
        name: 'Visado de Nómada Digital',
        description: 'Para trabajadores remotos peruanos que laboran para empresas fuera de la Unión Europea.',
        validity: '1 año en consulado / 3 años en España',
      },
      {
        name: 'Residencia No Lucrativa',
        description: 'Para ciudadanos peruanos que desean residir en España acreditando ingresos pasivos.',
        validity: '1 año renovable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Aseguradora Española DGSFP',
        description: 'Entidad de seguros autorizada en España (ASISA, Sanitas, Adeslas).',
        badge: 'Homologación DGSFP',
      },
      {
        title: 'Sin Copagos',
        description: 'No se permiten copagos por acto médico ni franquicias.',
        badge: '0€ Copago',
      },
      {
        title: 'Sin Periodos de Carencia',
        description: 'Atención médica disponible desde el primer día de cobertura en España.',
        badge: 'Sin Carencias',
      },
      {
        title: 'Repatriación Sanitaria a Perú',
        description: 'Cobertura de gastos de repatriación sanitaria y de restos mortales a territorio peruano.',
        badge: 'Repatriación a Perú',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Seguros de viaje con límite de 30.000€ que no cubren enfermedades preexistentes ni hospitalización completa.',
        solution: 'Contratar seguro de salud integral con cobertura ilimitada en centros médicos privados en España.',
      },
      {
        reason: 'Certificados emitidos en inglés o por empresas intermediarias no aseguradoras.',
        solution: 'Certificado oficial directo en castellano con número de póliza y sello de ASISA / Sanitas.',
      },
    ],
    faqs: [
      {
        q: '¿Acepta el Consulado de España en Lima seguros con copago?',
        a: 'No. El Consulado de España en San Isidro rechaza estrictamente cualquier póliza que contenga copagos o deducibles.',
      },
      {
        q: '¿Cómo obtengo mi certificado para BLS Miraflores?',
        a: 'Tras completar la contratación en VitaBlue, recibirás en tu correo y WhatsApp el certificado consular oficial en formato PDF listo para imprimir en menos de 24 horas hábiles.',
      },
    ],
  },
  {
    slug: 'argentina',
    country: 'Argentina',
    city: 'Buenos Aires',
    flag: '🇦🇷',
    title: 'Seguro Médico para Visado de España en Argentina (Consulado de Buenos Aires 2026)',
    metaDescription: 'Seguro médico para visado en el Consulado de España en Buenos Aires, Córdoba, Rosario y Mendoza. Sin copagos, repatriación y certificado oficial 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/argentina',
    consulateName: 'Consulado General de España en Buenos Aires',
    consulateAddress: 'Calle Guido 1770, Recoleta, C1016AAE Buenos Aires, Argentina',
    consulateJurisdiction: 'Ciudad Autónoma de Buenos Aires y provincia de Buenos Aires (con consulados en Córdoba, Rosario, Bahía Blanca y Mendoza)',
    blsCenter: 'BLS International Centro de Solicitud de Visados Buenos Aires',
    heroSubtitle: 'Pólizas de seguro médico autorizadas para visados de estudios, no lucrativa y nómadas digitales en el Consulado de España en Recoleta (Buenos Aires).',
    appointmentLeadTime: '15 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'ARS',
    rateEurToLocal: 1150,
    priceFromLocal: 'Aprox. 40.000 ARS / mes',
    whatsappTag: 'CONS-ARGENTINA',
    whatsappMessage: 'Hola! Tramito mi visado de España en el Consulado de Buenos Aires (Argentina). Necesito asesoramiento para el seguro de salud sin copagos obligatorio.',
    specificNotices: [
      'El Consulado de Recoleta exige seguro médico privado de cobertura completa sin copagos emitido por aseguradora autorizada en España.',
      'Las obras sociales y prepagas argentinas (OSDE, Swiss Medical) no son admitidas por el consulado para visados de larga duración.',
      'Certificados digitales válidos para presentación presencial en BLS Buenos Aires.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estudiante / Posgrado / Máster',
        description: 'Para estudiantes argentinos que van a cursar programas académicos universitarios en España.',
        validity: 'De 6 a 12 meses renovable',
      },
      {
        name: 'Visado de Nómada Digital',
        description: 'Para profesionales y freelancers argentinos que trabajan para clientes fuera de España.',
        validity: '1 año en consulado / 3 años en España',
      },
      {
        name: 'Visado de Residencia No Lucrativa',
        description: 'Para argentinos que trasladan su residencia permanente a España con ingresos demostrables.',
        validity: '1 año renovable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Compañía Autorizada DGSFP',
        description: 'Entidad de seguros autorizada en España (ASISA, Sanitas, Adeslas, DKV).',
        badge: 'Aseguradora en España',
      },
      {
        title: 'Sin Copagos ni Franquicias',
        description: 'Póliza sin ningún coste adicional por consultas, análisis ni hospitalizaciones.',
        badge: 'Cero Copagos',
      },
      {
        title: 'Sin Carencias de Urgencia',
        description: 'Cobertura médica disponible y activa desde el primer día de llegada.',
        badge: 'Sin Carencias',
      },
      {
        title: 'Repatriación Sanitaria a Argentina',
        description: 'Cobertura de traslado sanitario urgente o repatriación de restos a la República Argentina.',
        badge: 'Repatriación a Argentina',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Presentar seguro de asistencia al viajero con límite de reintegro.',
        solution: 'Contratar seguro médico de salud privado español de cuadro médico completo con acceso directo a hospitales.',
      },
      {
        reason: 'Seguros con cláusulas de copago de 15€ o 20€ por consulta médica.',
        solution: 'Elegir pólizas en modalidad "Sin Copago" pre-aprobadas para extranjería.',
      },
    ],
    faqs: [
      {
        q: '¿Cómo pago el seguro desde Argentina sin problemas de cambio?',
        a: 'El pago se realiza online con tarjeta internacional de crédito o débito (Visa/Mastercard) en euros de forma segura.',
      },
      {
        q: '¿Qué aseguradora es la más recomendada para el Consulado de Buenos Aires?',
        a: 'ASISA y Sanitas son las opciones más recomendadas por rapidez de emisión del certificado y estabilidad de precios sin subidas en renovaciones.',
      },
    ],
  },
  {
    slug: 'ecuador',
    country: 'Ecuador',
    city: 'Quito y Guayaquil',
    flag: '🇪🇨',
    title: 'Seguro Médico para Visado de España en Ecuador (Quito y Guayaquil 2026)',
    metaDescription: 'Seguro médico para visado en los Consulados de España en Quito y Guayaquil (BLS Ecuador). Sin copagos, sin carencias, repatriación y certificado oficial en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/ecuador',
    consulateName: 'Consulados Generales de España en Quito y Guayaquil',
    consulateAddress: 'Quito: Calle Francisco Salazar E12-73 | Guayaquil: Calle Tungurahua y Av. 9 de Octubre',
    consulateJurisdiction: 'Toda la República del Ecuador',
    blsCenter: 'BLS International Centros de Visados Quito y Guayaquil',
    heroSubtitle: 'Seguro médico oficial homologado para visados de estudios, residencia y nómadas digitales en Ecuador. Aceptación consular 100% garantizada.',
    appointmentLeadTime: '15 a 25 días hábiles',
    priceFromEur: 35,
    currencyCode: 'USD',
    rateEurToLocal: 1.08,
    priceFromLocal: 'Aprox. 38 USD / mes',
    whatsappTag: 'CONS-ECUADOR',
    whatsappMessage: 'Hola! Tramito visado para España en los Consulados de Quito/Guayaquil (Ecuador). Necesito cotizar el seguro médico homologado sin copagos con certificado consular.',
    specificNotices: [
      'Tanto el Consulado en Quito como el de Guayaquil exigen póliza completa sin copagos emitida en España.',
      'Los seguros de viaje de agencias de turismo no son válidos para visados de estancia por estudios ni residencia.',
      'Garantía de reembolso total del 100% de la prima en caso de denegación consular.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estudiante (Grado / Máster / Doctorado)',
        description: 'Obligatorio para ciudadanos ecuatorianos con plaza en universidades y centros formativos de España.',
        validity: 'De 6 a 12 meses renovable',
      },
      {
        name: 'Visado de Nómada Digital',
        description: 'Para teletrabajadores ecuatorianos que prestan servicios a empresas internacionales.',
        validity: '1 año en consulado / 3 años en España',
      },
      {
        name: 'Visado de Residencia No Lucrativa y Reagrupación',
        description: 'Para residir en España sin ejercer actividad económica.',
        validity: '1 año renovable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Aseguradora Autorizada DGSFP',
        description: 'Entidad de seguros registrada y supervisada en España.',
        badge: 'Aseguradora en España',
      },
      {
        title: 'Sin Copagos ni Franquicias',
        description: 'Sin ningún abono extra por consultas médicas, análisis ni hospitalizaciones.',
        badge: 'Cero Copagos',
      },
      {
        title: 'Sin Periodos de Carencia',
        description: 'Cobertura activa de urgencias y hospitalización desde el día 1 en España.',
        badge: 'Sin Carencias',
      },
      {
        title: 'Repatriación Sanitaria a Ecuador',
        description: 'Repatriación médica urgente o de restos mortales a territorio ecuatoriano.',
        badge: 'Repatriación a Ecuador',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Seguro de asistencia al viajero con límite de cobertura en dólares (ej. $30.000 USD).',
        solution: 'El consulado exige seguro de salud español con hospitalización ilimitada y acceso directo a red médica.',
      },
      {
        reason: 'Certificados emitidos por aseguradoras ecuatorianas sin cobertura directa en España.',
        solution: 'Contratar con aseguradoras autorizadas como ASISA o Sanitas con certificado consular oficial sellado.',
      },
    ],
    faqs: [
      {
        q: '¿Puedo pagar en dólares americanos (USD)?',
        a: 'Sí. Al pagar con tarjeta de crédito o débito de Ecuador, el banco procesa el cobro en dólares al tipo de cambio oficial del día.',
      },
      {
        q: '¿Cuánto tarda en llegar el certificado para mi cita en BLS Quito o Guayaquil?',
        a: 'En VitaBlue emitimos tu certificado oficial sellado por la aseguradora en menos de 24 horas hábiles por correo y WhatsApp.',
      },
    ],
  },
];

export const getConsulateBySlug = (slug: string): ConsulateData | undefined => {
  const normalized = slug.toLowerCase();
  return consulatesList.find((c) => 
    c.slug === normalized || 
    normalized.includes(c.slug) ||
    c.slug.includes(normalized)
  );
};
