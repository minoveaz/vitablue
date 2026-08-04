export type ProductCategory = 'health' | 'pet' | 'life' | 'travel' | 'funeral';
export type InventoryStatus = 'catalogued' | 'landing-only';

export interface ProductInventoryEntry {
  id: string;
  name: string;
  category: ProductCategory;
  provider: string;
  canonicalPath: string;
  status: InventoryStatus;
  /** Facts still to be moved from the landing into the typed catalog. */
  sourcePage: string;
}

/** Audit inventory: every product family currently exposed by the public pages. */
export const PRODUCT_INVENTORY: ProductInventoryEntry[] = [
  { id: 'adeslas-plena-total', name: 'Adeslas Plena Total', category: 'health', provider: 'Adeslas', canonicalPath: '/productos/seguros-salud', status: 'catalogued', sourcePage: 'pages/public/HealthInsurance.tsx' },
  { id: 'sanitas-mas-salud', name: 'Sanitas Más Salud', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud', status: 'catalogued', sourcePage: 'pages/public/SanitasMasSalud.tsx' },
  { id: 'health-basico', name: 'Seguro Básico', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud', status: 'landing-only', sourcePage: 'pages/public/HealthInsurance.tsx' },
  { id: 'health-copago', name: 'Seguro con Copago', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud', status: 'landing-only', sourcePage: 'pages/public/HealthInsurance.tsx' },
  { id: 'health-sin-copago', name: 'Seguro sin Copago', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud', status: 'landing-only', sourcePage: 'pages/public/HealthInsurance.tsx' },
  { id: 'health-reembolso', name: 'Seguro de Reembolso', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud', status: 'landing-only', sourcePage: 'pages/public/HealthInsurance.tsx' },
  { id: 'sanitas-international-students', name: 'Sanitas International Students', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas/international-students', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'adeslas-plena-extra', name: 'Adeslas Plena Extra', category: 'health', provider: 'Adeslas', canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes', status: 'landing-only', sourcePage: 'pages/public/StudentInsurance.tsx' },
  { id: 'sanitas-accide', name: 'Sanitas Accede', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-avanza', name: 'Sanitas Avanza', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-unico', name: 'Sanitas Único', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-mas-salud-familias', name: 'Sanitas Más Salud Familias', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-profesionales', name: 'Sanitas Profesionales', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-top-quantum', name: 'Sanitas Top Quantum', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-senior-prima-unica', name: 'Asistencia Senior Prima Única', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'international-residents', name: 'International Residents', category: 'health', provider: 'Sanitas', canonicalPath: '/productos/seguros-salud/seguros-sanitas', status: 'landing-only', sourcePage: 'pages/public/SanitasInsurances.tsx' },
  { id: 'sanitas-mascotas', name: 'Sanitas Mascotas', category: 'pet', provider: 'Sanitas', canonicalPath: '/productos/seguro-mascotas/sanitas-mascotas', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'sanitas-mascotas-basica', name: 'Mascotas Básica', category: 'pet', provider: 'Sanitas', canonicalPath: '/productos/seguro-mascotas/sanitas-mascotas', status: 'landing-only', sourcePage: 'pages/public/SanitasMascotas.tsx' },
  { id: 'sanitas-mascotas-completa', name: 'Mascotas Completa', category: 'pet', provider: 'Sanitas', canonicalPath: '/productos/seguro-mascotas/sanitas-mascotas', status: 'landing-only', sourcePage: 'pages/public/SanitasMascotas.tsx' },
  { id: 'sanitas-mascotas-reembolso', name: 'Mascotas Reembolso', category: 'pet', provider: 'Sanitas', canonicalPath: '/productos/seguro-mascotas/sanitas-mascotas', status: 'landing-only', sourcePage: 'pages/public/SanitasMascotas.tsx' },
  { id: 'asistencia-familiar-iplus', name: 'Asistencia Familiar iPlus', category: 'funeral', provider: 'Sanitas', canonicalPath: '/productos/seguro-para-decesos/asistencia-familiar', status: 'catalogued', sourcePage: 'domain/products/sanitasCatalog.ts' },
  { id: 'seguro-extranjeros', name: 'Seguro de Salud para Extranjeros', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud/seguro-salud-extranjeros', status: 'landing-only', sourcePage: 'pages/public/ForeignerInsurance.tsx' },
  { id: 'seguro-expatriados', name: 'Seguro Médico para Expatriados', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud/seguro-expatriados', status: 'landing-only', sourcePage: 'pages/public/ExpatInsurance.tsx' },
  { id: 'seguro-nomadas', name: 'Seguro para Nómadas Digitales', category: 'health', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguros-salud/seguro-nomadas-digitales', status: 'landing-only', sourcePage: 'pages/public/NomadInsurance.tsx' },
  { id: 'seguro-viaje', name: 'Seguro de Viaje', category: 'travel', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-viaje', status: 'landing-only', sourcePage: 'pages/public/TravelInsurance.tsx' },
  { id: 'viaje-estandar', name: 'Viaje Estándar', category: 'travel', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-viaje', status: 'landing-only', sourcePage: 'pages/public/TravelInsurance.tsx' },
  { id: 'viaje-estrella', name: 'Viaje Estrella', category: 'travel', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-viaje', status: 'landing-only', sourcePage: 'pages/public/TravelInsurance.tsx' },
  { id: 'viaje-premium', name: 'Viaje Premium', category: 'travel', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-viaje', status: 'landing-only', sourcePage: 'pages/public/TravelInsurance.tsx' },
  { id: 'seguro-vida', name: 'Seguro de Vida Familiar', category: 'life', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-vida', status: 'landing-only', sourcePage: 'pages/public/LifeInsurance.tsx' },
  { id: 'vida-esencial', name: 'Vida Esencial', category: 'life', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-vida', status: 'landing-only', sourcePage: 'pages/public/LifeInsurance.tsx' },
  { id: 'vida-completo', name: 'Vida Completo', category: 'life', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-vida', status: 'landing-only', sourcePage: 'pages/public/LifeInsurance.tsx' },
  { id: 'vida-hipotecas', name: 'Vida Hipotecas', category: 'life', provider: 'VitaBlue marketplace', canonicalPath: '/productos/seguro-vida', status: 'landing-only', sourcePage: 'pages/public/LifeInsurance.tsx' },
];

export const getLandingOnlyProducts = () => PRODUCT_INVENTORY.filter((product) => product.status === 'landing-only');
