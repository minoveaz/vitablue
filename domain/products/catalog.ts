import type { Product } from './types';

/** Single source of truth for product facts consumed by pages and recommendation logic. */
export const PRODUCT_CATALOG = {
  adeslas: {
    id: 'adeslas',
    name: 'Adeslas Plena Total',
    providerName: 'Adeslas',
    providerLogo: 'https://static.vitablue.es/logos/adeslas.png',
    price: 'Precio personalizado',
    pricePeriod: 'mes',
    ctaText: 'Ver en VitaBlue',
    ctaHref: '/continuar-a-vitablue/adeslas',
    externalUrl: 'https://vitablue.es/productos/seguro-de-salud.html',
    canonicalUrl: '/productos/seguros-salud',
    inclusions: ['Repatriación sanitaria ilimitada', 'Urgencias 24h y hospitalización', 'Sin copagos (todo incluido)', 'Certificado oficial para visado'],
    exclusions: ['Tratamientos estéticos', 'Reembolso fuera de cuadro médico', 'Carencia de 3 meses para cirugías'],
    highlights: ['Visa Ready', 'Red Médica Nº1', 'Sin Copagos'],
    whyItFits: '',
    disclaimers: ['Precio orientativo sujeto a edad, modalidad y condiciones de contratación.'],
    eligibility: { visaStudent: true, expatriate: true, nomad: true },
    priceStatus: 'pending',
    coverageStatus: 'pending',
    source: 'Pendiente de tarifa y condicionado oficial actualizado',
  },
  sanitas: {
    id: 'sanitas',
    name: 'Sanitas Más Salud',
    providerName: 'Sanitas',
    providerLogo: 'https://static.vitablue.es/logos/sanitas.png',
    price: 'Precio personalizado',
    pricePeriod: 'mes',
    ctaText: 'Ver en VitaBlue',
    ctaHref: '/continuar-a-vitablue/sanitas',
    externalUrl: 'https://vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
    canonicalUrl: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
    inclusions: ['Asistencia médica completa', 'Sin copagos opcional', 'Acceso a videoconsulta 24h (Blua)', 'Cobertura dental ampliada'],
    exclusions: ['Psicoterapia ilimitada', 'Medicamentos fuera de hospital', 'Óptica'],
    highlights: ['Líder Digital', 'Centros Propios', 'Red Bupa'],
    whyItFits: '',
    disclaimers: ['Precio orientativo sujeto a edad, modalidad y condiciones de contratación.'],
    eligibility: { visaStudent: true, expatriate: true, nomad: true },
    priceStatus: 'pending',
    coverageStatus: 'pending',
    source: 'Pendiente de tarifa y condicionado oficial actualizado',
  },
} satisfies Record<string, Product>;

export type CatalogProductId = keyof typeof PRODUCT_CATALOG;

export const getProduct = (id: CatalogProductId): Product => PRODUCT_CATALOG[id];
