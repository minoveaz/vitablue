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
  currencyDisplay: string;
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
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/colombia/',
    consulateName: 'Consulado General de España en Bogotá',
    consulateAddress: 'Calle 94 A N.º 11A-70, Bogotá D.C., Colombia',
    consulateJurisdiction: 'Toda la República de Colombia',
    blsCenter: 'Centro de Solicitud de Visados BLS International Bogotá (Calle 98 # 22-64)',
    heroSubtitle: 'Cumple al 100% las exigencias del Consulado de España en Bogotá y BLS International Colombia. Pólizas autorizadas con Asisa, Sanitas y Adeslas.',
    appointmentLeadTime: '20 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'COP',
    currencyDisplay: 'COP',
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
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/mexico/',
    consulateName: 'Consulado General de España en Ciudad de México',
    consulateAddress: 'Calle Galileo 114 (esq. Horacio), Colonia Polanco, Miguel Hidalgo, 11560 CDMX, México',
    consulateJurisdiction: 'Estados Unidos Mexicanos (incluyendo sedes en Guadalajara y Monterrey)',
    blsCenter: 'Centro BLS Visados España CDMX (Ejército Nacional Mexicano)',
    heroSubtitle: 'Pólizas de salud oficiales para el visado de estudiante, nómada digital y residencia en España tramitados en México. Aprobación 100% garantizada.',
    appointmentLeadTime: '15 a 25 días hábiles',
    priceFromEur: 35,
    currencyCode: 'MXN',
    currencyDisplay: 'MXN',
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
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/peru/',
    consulateName: 'Consulado General de España en Lima',
    consulateAddress: 'Calle Los Ficus 241, San Isidro, Lima 27, Perú',
    consulateJurisdiction: 'Todo el territorio de la República del Perú',
    blsCenter: 'BLS International Centro de Visados Lima (Miraflores)',
    heroSubtitle: 'Pólizas homologadas para visados de estudios, residencia y nómadas digitales en el Consulado de España en San Isidro (Lima). 100% aceptado.',
    appointmentLeadTime: '20 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'PEN',
    currencyDisplay: 'Soles',
    rateEurToLocal: 4.0,
    priceFromLocal: 'Aprox. 140 Soles (S/) / mes',
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
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/argentina/',
    consulateName: 'Consulado General de España en Buenos Aires',
    consulateAddress: 'Calle Guido 1770, Recoleta, C1016AAE Buenos Aires, Argentina',
    consulateJurisdiction: 'Ciudad Autónoma de Buenos Aires y provincia de Buenos Aires (con consulados en Córdoba, Rosario, Bahía Blanca y Mendoza)',
    blsCenter: 'BLS International Centro de Solicitud de Visados Buenos Aires',
    heroSubtitle: 'Pólizas de seguro médico autorizadas para visados de estudios, no lucrativa y nómadas digitales en el Consulado de España en Recoleta (Buenos Aires).',
    appointmentLeadTime: '15 a 30 días hábiles',
    priceFromEur: 35,
    currencyCode: 'ARS',
    currencyDisplay: 'ARS',
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
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/ecuador/',
    consulateName: 'Consulados Generales de España en Quito y Guayaquil',
    consulateAddress: 'Quito: Calle Francisco Salazar E12-73 | Guayaquil: Calle Tungurahua y Av. 9 de Octubre',
    consulateJurisdiction: 'Toda la República del Ecuador',
    blsCenter: 'BLS International Centros de Visados Quito y Guayaquil',
    heroSubtitle: 'Seguro médico oficial homologado para visados de estudios, residencia y nómadas digitales en Ecuador. Aceptación consular 100% garantizada.',
    appointmentLeadTime: '15 a 25 días hábiles',
    priceFromEur: 35,
    currencyCode: 'USD',
    currencyDisplay: 'USD',
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
  {
    slug: 'chile',
    country: 'Chile',
    city: 'Santiago de Chile',
    flag: '🇨🇱',
    title: 'Seguro Médico para Visado de España en Chile (Consulado Santiago 2026)',
    metaDescription: 'Seguro médico homologado para visados de estudios y residencia en el Consulado General de España en Santiago de Chile y BLS. 0€ copagos, sin carencias y certificado en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/chile/',
    consulateName: 'Consulado General de España en Santiago de Chile',
    consulateAddress: 'Av. Once de Septiembre / Av. Nueva Providencia 2353, Providencia, Santiago, Chile',
    consulateJurisdiction: 'Todo el territorio de la República de Chile',
    blsCenter: 'Centro de Visados BLS International Santiago (Av. Vitacura / Providencia)',
    heroSubtitle: 'Póliza oficial admitida por el Consulado General de España en Santiago y centros BLS Chile. Sin copagos, cobertura médica total en España y certificado oficial en 24h.',
    appointmentLeadTime: 'Recomendamos contratar 2 a 4 semanas antes de tu cita consular en Santiago.',
    priceFromEur: 45,
    currencyCode: 'CLP',
    currencyDisplay: 'Pesos Chilenos (CLP)',
    rateEurToLocal: 1040,
    priceFromLocal: '46.800 CLP/mes',
    whatsappTag: '[GADS-CHILE]',
    whatsappMessage: '¡Hola! Estoy tramitando mi visado de España en el Consulado de Santiago de Chile y necesito cotizar el seguro médico obligatorio sin copagos.',
    specificNotices: [
      'El Consulado de España en Santiago exige de forma estricta que la póliza esté emitida por una aseguradora autorizada en España (DGSFP) con cobertura integral idéntica al Sistema Nacional de Salud.',
      'No se admiten seguros de viaje con topes de cobertura en UF o dólares ni pólizas chilenas (Isapres/Fonasa) que operen solo por reembolso tardío.',
      'La vigencia de la póliza debe cubrir la totalidad de la estancia académica o el primer año de residencia.',
    ],
    visaTypes: [
      {
        name: 'Visado de Estancia por Estudios (Grado, Máster, Doctorado)',
        description: 'Para estudiantes chilenos matriculados en universidades, escuelas de negocios o centros de formación en España.',
        validity: 'Periodo completo del curso académico',
      },
      {
        name: 'Visado de Nómada Digital (Teletrabajo Internacional)',
        description: 'Para profesionales y autónomos chilenos que trabajan en remoto para empresas fuera de España.',
        validity: '1 año en consulado / 3 años en España',
      },
      {
        name: 'Visado de Residencia No Lucrativa y Reagrupación Familiar',
        description: 'Para vivir en España demostrando fondos suficientes sin realizar actividad laboral en el país.',
        validity: '1 año renovable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'Aseguradora Autorizada DGSFP en España',
        description: 'Entidad aseguradora autorizada e inscrita en el registro oficial español (Sanitas / Asisa).',
        badge: 'Aseguradora Española DGSFP',
      },
      {
        title: 'Totalmente Sin Copagos ni Deducibles',
        description: 'El asegurado no debe abonar ningún copago ni deducible por consultas, analíticas o cirugías.',
        badge: '0€ Copagos / 0 Deducible',
      },
      {
        title: 'Sin Periodos de Carencia',
        description: 'Todas las prestaciones sanitarias, urgencias e internación cubiertas desde el primer día.',
        badge: 'Cobertura Inmediata Día 1',
      },
      {
        title: 'Repatriación Sanitaria a Chile',
        description: 'Traslado sanitario urgente o repatriación de restos mortales hasta territorio chileno.',
        badge: 'Repatriación a Chile',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Presentar cobertura de Isapre chilena con asistencia en viaje de tarjeta de crédito (límite $30.000 USD).',
        solution: 'El consulado en Santiago rechaza topes en dólares. Exige seguro de salud español con cobertura hospitalaria ilimitada.',
      },
      {
        reason: 'Seguros con deducible o copagos por atención médica.',
        solution: 'Nuestras pólizas de Sanitas International Students y Más Salud cuentan con cláusula expresa de 0€ copagos.',
      },
    ],
    faqs: [
      {
        q: '¿Cómo se paga desde Chile y en qué moneda se procesa?',
        a: 'Puedes pagar de forma 100% segura con cualquier tarjeta de crédito o débito chilena (Visa, Mastercard). Tu banco procesa la conversión automática a Pesos Chilenos (CLP) sin comisiones extra.',
      },
      {
        q: '¿Qué validez tiene el certificado digital ante el Consulado de España en Santiago?',
        a: 'El certificado emitido cuenta con Firma Electrónica Reconocida y Código Seguro de Verificación (CSV) oficial de la aseguradora, 100% admitido por el consulado y por BLS Santiago.',
      },
    ],
  },
  {
    slug: 'estados-unidos',
    country: 'Estados Unidos',
    city: 'Miami, New York, Los Angeles, Chicago & Houston',
    flag: '🇺🇸',
    title: 'Health Insurance for Spain Visa in USA & NALCAP (Official 2026 Guide)',
    metaDescription: 'Official health insurance for Spain Student Visa, NALCAP language assistants, Digital Nomad & Non-Lucrative Visa at Spanish Consulates across USA (Miami, NYC, LA, Houston, Chicago). $0 copay & 24h certificate.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/estados-unidos/',
    consulateName: 'Consulados Generales de España en EE. UU. (BLS Centers)',
    consulateAddress: 'Miami (Coral Gables), New York, Los Angeles, Chicago, Houston, San Francisco, Washington D.C., Boston',
    consulateJurisdiction: 'All 50 US States & Puerto Rico',
    blsCenter: 'BLS Spain Visa Application Centers USA (Miami, NYC, LA, Chicago, Houston, SF, DC, Boston)',
    heroSubtitle: 'Official health insurance approved by Spanish Consulates across the US and BLS centers for Study Abroad, NALCAP Language Assistants, Digital Nomads and Non-Lucrative visas.',
    appointmentLeadTime: 'We recommend securing your policy 3 to 6 weeks before your BLS appointment.',
    priceFromEur: 45,
    currencyCode: 'USD',
    currencyDisplay: 'US Dollars (USD)',
    rateEurToLocal: 1.09,
    priceFromLocal: '$49 USD/mo',
    whatsappTag: '[GADS-USA]',
    whatsappMessage: 'Hello! I am applying for a Spanish visa in the US (Student/NALCAP/Nomad/Non-Lucrative) and need a compliant health insurance quote with 0 copay.',
    specificNotices: [
      'Spanish Consulates across the USA (Miami, NY, LA, Houston, Chicago, SF, DC) strictly reject US health plans (BlueCross, Aetna, Cigna Global, UnitedHealthcare) because they operate through deductibles/copays and out-of-network reimbursements.',
      'For the NALCAP program (North American Language and Culture Assistants), if your regional placement does not include private insurance or for your initial visa processing, you must present a DGSFP-authorized policy with 0€ copay.',
      'The insurance certificate must explicitly state: No copayments, No deductibles, No waiting periods, and full Repatriation of remains to the USA.',
    ],
    visaTypes: [
      {
        name: 'Student Visa & Study Abroad / Master Degrees',
        description: 'For American university students enrolled in semester abroad programs, universities or graduate schools in Spain.',
        validity: 'Full academic year or semester duration',
      },
      {
        name: 'NALCAP Language & Culture Assistants',
        description: 'For North American assistants teaching English in Spain through the Ministry of Education program.',
        validity: 'Academic year (October - May/June)',
      },
      {
        name: 'Digital Nomad Visa (Telework / Remote Workers)',
        description: 'For US remote employees and freelancers working for American clients from Spain.',
        validity: '1 year at consulate / 3 years residency in Spain',
      },
      {
        name: 'Non-Lucrative Residence Visa (Retirees & Expats)',
        description: 'For Americans moving to Spain without conducting local employment activities.',
        validity: '1 year renewable',
      },
    ],
    mandatoryRequirements: [
      {
        title: 'DGSFP-Authorized Spanish Insurer',
        description: 'The insurance provider must be licensed and regulated in Spain by the DGSFP (Sanitas / Asisa).',
        badge: 'Authorized Spanish Provider',
      },
      {
        title: '$0 Deductibles & Zero Copays',
        description: 'Zero out-of-pocket costs for doctor visits, emergency room, diagnostic tests and hospitalization.',
        badge: 'Zero Copay / No Deductible',
      },
      {
        title: 'Zero Waiting Periods (Immediate Coverage)',
        description: 'Full medical and surgical coverage effective from day 1 upon arrival in Spain.',
        badge: 'No Waiting Periods',
      },
      {
        title: 'Repatriation of Remains & Medical Evacuation to USA',
        description: 'Complete coverage for medical transport or repatriation of mortal remains to the United States.',
        badge: 'Full Repatriation to USA',
      },
    ],
    commonRejectionReasons: [
      {
        reason: 'Submitting US domestic insurance (BlueCross/Kaiser/Aetna) or travel insurance with high deductibles (e.g. $500 - $2,500 deductible).',
        solution: 'Consulates reject all deductibles. VitaBlue provides Sanitas International Students with strict 0€ copay certificate.',
      },
      {
        reason: 'Travel policies with capped limits (e.g. $50,000 USD maximum).',
        solution: 'Spain requires comprehensive healthcare coverage equivalent to the Spanish National Health System without monetary caps on medical treatment.',
      },
    ],
    faqs: [
      {
        q: 'Why does the Spanish consulate reject my US health insurance (BlueCross, Aetna, Cigna)?',
        a: 'Spanish immigration law requires the insurer to be authorized in Spain (DGSFP) and offer direct billing to hospitals without copays, deductibles, or reimbursement paperwork. US health plans do not meet these legal criteria.',
      },
      {
        q: 'How fast do I receive the official certificate for my BLS appointment in the US?',
        a: 'Through VitaBlue, your official bilingual certificate signed digitally by Sanitas is issued within 24 business hours via email and WhatsApp.',
      },
      {
        q: 'Can I pay with a US credit or debit card?',
        a: 'Yes. You can pay securely with any US credit card (Visa, Mastercard, Amex). Your bank automatically processes the transaction at the official exchange rate.',
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
