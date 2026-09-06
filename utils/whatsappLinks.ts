import { buildAttributedWhatsAppUrl } from './analytics';

export const DEFAULT_WHATSAPP_PHONE = '34694583452';

export interface WhatsAppContextResult {
  tag: string;
  message: string;
}

export interface ContextualWhatsAppOptions {
  phone?: string;
  pathname?: string;
  locale?: 'es' | 'en';
  tag?: string;
  message?: string;
  product?: string;
}

/**
 * Resolves context tag and friendly lead text based on the path, language and product.
 */
export const resolveWhatsAppContext = (
  pathname: string = '',
  locale?: 'es' | 'en'
): WhatsAppContextResult => {
  const cleanPath = pathname.replace(/\/$/, '');
  const isEn = locale === 'en' || cleanPath.startsWith('/en');

  // Blog articles
  if (cleanPath.startsWith('/blog/') || cleanPath.startsWith('/en/blog/')) {
    const slug = cleanPath.split('/').pop() || '';
    if (isEn) {
      return {
        tag: `BLOG-${slug.toUpperCase().slice(0, 24)}`,
        message: 'Hello! I am reading this article on the VitaBlue blog and need some advice on health insurance for Spain.',
      };
    }
    return {
      tag: `BLOG-${slug.toUpperCase().slice(0, 24)}`,
      message: '¡Hola! Estoy leyendo este artículo en el blog de VitaBlue y necesito asesoramiento sobre seguros de salud.',
    };
  }

  // Blog Home/List
  if (cleanPath === '/blog' || cleanPath === '/en/blog') {
    return isEn
      ? {
          tag: 'BLOG-LIST-EN',
          message: 'Hello! I come from the VitaBlue blog. I need personalized guidance on health insurance in Spain.',
        }
      : {
          tag: 'BLOG-LIST-ES',
          message: '¡Hola! Vengo del blog de VitaBlue. Necesito asesoramiento personalizado sobre seguros de salud.',
        };
  }

  // Student Insurance landings (General, English, and Geo-Consulates/Cities)
  if (
    cleanPath === '/productos/seguros-salud/seguro-medico-estudiantes' ||
    cleanPath === '/en/health-insurance-student-visa-spain'
  ) {
    return isEn
      ? {
          tag: 'LANDING-ESTUDIANTES-EN',
          message: 'Hello! I come from the Student Visa Insurance guide on VitaBlue. I need a 100% compliant policy for my Spanish student visa.',
        }
      : {
          tag: 'LANDING-ESTUDIANTES-ES',
          message: '¡Hola! Vengo de la página del Seguro Médico para Estudiantes de VitaBlue. Necesito una póliza homologada para mi visado de estudios en España.',
        };
  }

  if (cleanPath.startsWith('/productos/seguros-salud/seguro-medico-estudiantes/')) {
    const geoSlug = cleanPath.split('/').pop() || 'GEO';
    return {
      tag: `LANDING-ESTUDIANTES-${geoSlug.toUpperCase()}`,
      message: `¡Hola! Vengo de la página de Seguro Médico para Estudiantes en ${geoSlug.charAt(0).toUpperCase() + geoSlug.slice(1)}. Necesito asesoramiento para mi trámite consular.`,
    };
  }

  // Expatriates & Non-Lucrative Visa
  if (
    cleanPath === '/productos/seguros-salud/seguro-expatriados' ||
    cleanPath === '/en/health-insurance-expatriates-spain'
  ) {
    return isEn
      ? {
          tag: 'LANDING-EXPATRIADOS-EN',
          message: 'Hello! I come from the Expat Health Insurance page on VitaBlue. I need advice on full coverage policies without copays for residency.',
        }
      : {
          tag: 'LANDING-EXPATRIADOS-ES',
          message: '¡Hola! Vengo de la página del Seguro para Expatriados y Residentes de VitaBlue. Necesito asesoramiento sobre pólizas sin copagos para extranjería.',
        };
  }

  // Digital Nomads
  if (
    cleanPath === '/productos/seguros-salud/seguro-nomadas-digitales' ||
    cleanPath === '/en/digital-nomad-insurance-spain'
  ) {
    return isEn
      ? {
          tag: 'LANDING-NOMADAS-EN',
          message: 'Hello! I come from the Digital Nomad Health Insurance page on VitaBlue. I need a compliant insurance for my remote work visa in Spain.',
        }
      : {
          tag: 'LANDING-NOMADAS-ES',
          message: '¡Hola! Vengo de la página de Seguro para Nómadas Digitales de VitaBlue. Necesito una póliza de cobertura completa para mi visado nómada.',
        };
  }

  // Foreigners / General Immigrants
  if (cleanPath === '/productos/seguros-salud/seguro-salud-extranjeros') {
    return {
      tag: 'LANDING-EXTRANJEROS',
      message: '¡Hola! Vengo de la página del Seguro Médico para Extranjeros de VitaBlue. Necesito asesoramiento para contratar un seguro sin copagos válido para el NIE.',
    };
  }

  // Pets / Mascotas
  if (cleanPath === '/productos/seguro-mascotas/sanitas-mascotas') {
    return {
      tag: 'LANDING-MASCOTAS',
      message: '¡Hola! Vengo de la página de Sanitas Mascotas de VitaBlue. Quiero información sobre coberturas y precios para mi perro o gato.',
    };
  }

  // Sanitas Mas Salud & General Sanitas
  if (cleanPath === '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud') {
    return {
      tag: 'LANDING-SANITAS-MAS-SALUD',
      message: '¡Hola! Vengo de la página de Sanitas Más Salud en VitaBlue. Deseo conocer precios y condiciones de contratación.',
    };
  }
  if (cleanPath.startsWith('/productos/seguros-salud/seguros-sanitas')) {
    return {
      tag: 'LANDING-SANITAS',
      message: '¡Hola! Vengo del catálogo de seguros Sanitas en VitaBlue. Necesito asesoramiento para comparar los planes disponibles.',
    };
  }

  // Life, Travel, Decesos
  if (cleanPath === '/productos/seguro-vida') {
    return {
      tag: 'LANDING-VIDA',
      message: '¡Hola! Vengo de la página de Seguro de Vida de VitaBlue. Deseo cotizar coberturas y capital protegido.',
    };
  }
  if (cleanPath === '/productos/seguro-viaje') {
    return {
      tag: 'LANDING-VIAJE',
      message: '¡Hola! Vengo de la página de Seguro de Viaje de VitaBlue. Necesito contratar asistencia médica para mi viaje.',
    };
  }
  if (cleanPath === '/productos/seguro-para-decesos/asistencia-familiar') {
    return {
      tag: 'LANDING-DECESOS',
      message: '¡Hola! Vengo de la página de Asistencia Familiar y Decesos de VitaBlue. Deseo recibir asesoramiento sobre la póliza.',
    };
  }

  // Institutional Pages
  if (cleanPath === '/contacto' || cleanPath === '/en/contact') {
    return isEn
      ? {
          tag: 'CONTACT-PAGE-EN',
          message: 'Hello! I am contacting you from the VitaBlue contact page. I need personalized support.',
        }
      : {
          tag: 'CONTACT-PAGE-ES',
          message: '¡Hola! Me comunico desde la página de contacto de VitaBlue. Necesito atención personalizada.',
        };
  }

  if (cleanPath === '/sobre-nosotros' || cleanPath === '/en/about-us') {
    return isEn
      ? {
          tag: 'ABOUT-US-EN',
          message: 'Hello! I am visiting the About Us page on VitaBlue and would like to ask a question.',
        }
      : {
          tag: 'SOBRE-NOSOTROS-ES',
          message: '¡Hola! Estoy visitando la sección Sobre Nosotros de VitaBlue y me gustaría hacer una consulta.',
        };
  }

  if (cleanPath === '/validador-visado') {
    return {
      tag: 'VALIDADOR-VISADO',
      message: '¡Hola! He utilizado el Validador Consular de VitaBlue y tengo dudas sobre si mi seguro cumple los requisitos de extranjería.',
    };
  }

  // Default fallback (Home or generic navigation)
  return isEn
    ? {
        tag: 'WEB-GENERAL-EN',
        message: 'Hello! I come from the VitaBlue website. I need some advice on health insurance for Spain.',
      }
    : {
        tag: 'WEB-GENERAL-ES',
        message: '¡Hola! Vengo de la web de VitaBlue. Necesito asesoramiento general sobre seguros de salud.',
      };
};

/**
 * Builds a standardized contextualized WhatsApp URL with proper attribution tags.
 */
export const buildContextualWhatsAppUrl = (options: ContextualWhatsAppOptions = {}): string => {
  const phone = options.phone || DEFAULT_WHATSAPP_PHONE;
  const inferred = resolveWhatsAppContext(options.pathname || '', options.locale);

  const tag = options.tag || inferred.tag;
  const rawMessage = options.message || inferred.message;

  // Format prefixed tag clearly in the chat: "[TAG] Message..."
  const formattedMessage = rawMessage.startsWith(`[${tag}]`)
    ? rawMessage
    : `[${tag}] ${rawMessage}`;

  return buildAttributedWhatsAppUrl(phone, formattedMessage, tag);
};

// Convenience helpers for main structural components

export const getNavbarWhatsAppUrl = (locale?: 'es' | 'en', pathname?: string): string => {
  const resolved = resolveWhatsAppContext(pathname, locale);
  const tag = `NAVBAR-${resolved.tag}`;
  return buildContextualWhatsAppUrl({
    pathname,
    locale,
    tag,
    message: resolved.message,
  });
};

export const getFooterWhatsAppUrl = (locale?: 'es' | 'en', pathname?: string): string => {
  const resolved = resolveWhatsAppContext(pathname, locale);
  const tag = `FOOTER-${resolved.tag}`;
  return buildContextualWhatsAppUrl({
    pathname,
    locale,
    tag,
    message: resolved.message,
  });
};

export const getFloatingWhatsAppUrl = (pathname?: string, locale?: 'es' | 'en'): string => {
  const resolved = resolveWhatsAppContext(pathname, locale);
  const tag = `FLOAT-${resolved.tag}`;
  return buildContextualWhatsAppUrl({
    pathname,
    locale,
    tag,
    message: resolved.message,
  });
};

export const getBlogWhatsAppUrl = (
  postTitle: string,
  isEnglish: boolean = false,
  customTag?: string
): string => {
  const tag = customTag || (isEnglish ? 'BLOG-ADVISOR-EN' : 'BLOG-ADVISOR-ES');
  const message = isEnglish
    ? `Hello! I am reading "${postTitle}" on VitaBlue and need help with health insurance requirements.`
    : `¡Hola! Estoy leyendo "${postTitle}" en VitaBlue y necesito asesoramiento sobre los requisitos de mi seguro.`;

  return buildContextualWhatsAppUrl({
    locale: isEnglish ? 'en' : 'es',
    tag,
    message,
  });
};

export const getProductWhatsAppUrl = (
  productKey: string,
  isEnglish: boolean = false
): string => {
  const normalizedKey = productKey.toLowerCase().trim();
  let pathname = `/productos/seguros-salud/${normalizedKey}`;

  if (normalizedKey === 'mascotas') {
    pathname = '/productos/seguro-mascotas/sanitas-mascotas';
  } else if (normalizedKey === 'estudiantes') {
    pathname = isEnglish ? '/en/health-insurance-student-visa-spain' : '/productos/seguros-salud/seguro-medico-estudiantes';
  } else if (normalizedKey === 'expatriados') {
    pathname = isEnglish ? '/en/health-insurance-expatriates-spain' : '/productos/seguros-salud/seguro-expatriados';
  } else if (normalizedKey === 'nomadas') {
    pathname = isEnglish ? '/en/digital-nomad-insurance-spain' : '/productos/seguros-salud/seguro-nomadas-digitales';
  }

  return buildContextualWhatsAppUrl({
    pathname,
    locale: isEnglish ? 'en' : 'es',
  });
};
