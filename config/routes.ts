import { blogPosts } from '../utils/blogData';

/**
 * Route inventory for the future single source of truth.
 *
 * This file is intentionally not wired into React Router or Vite yet. The
 * first migration step is data parity; the generators will consume this
 * registry only after its output matches the current production URLs.
 */

export type RouteKind = 'canonical' | 'legacy' | 'dynamic' | 'private' | 'development';
export type RouteLocale = 'es' | 'en' | 'neutral';

export interface RouteDefinition {
  path: string;
  kind: RouteKind;
  locale: RouteLocale;
  canonical?: string;
  alternate?: string;
  indexable: boolean;
  prerender: boolean;
  sitemap: boolean;
  redirectTo?: string;
}

const canonical = (
  path: string,
  options: Omit<RouteDefinition, 'path' | 'kind'>,
): RouteDefinition => ({ path, kind: 'canonical', ...options });

const legacy = (path: string, redirectTo: string): RouteDefinition => ({
  path,
  kind: 'legacy',
  locale: 'neutral',
  canonical: redirectTo,
  indexable: false,
  prerender: false,
  sitemap: false,
  redirectTo,
});

/** Public canonical routes currently represented in the app. */
export const canonicalRoutes: RouteDefinition[] = [
  canonical('/', { locale: 'es', canonical: '/', alternate: '/en', indexable: true, prerender: true, sitemap: true }),
  canonical('/en', { locale: 'en', canonical: '/en', alternate: '/', indexable: true, prerender: true, sitemap: true }),
  canonical('/sobre-nosotros', { locale: 'es', canonical: '/sobre-nosotros', alternate: '/en/about-us', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/about-us', { locale: 'en', canonical: '/en/about-us', alternate: '/sobre-nosotros', indexable: true, prerender: true, sitemap: true }),
  canonical('/contacto', { locale: 'es', canonical: '/contacto', alternate: '/en/contact', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/contact', { locale: 'en', canonical: '/en/contact', alternate: '/contacto', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud', { locale: 'es', canonical: '/productos/seguros-salud', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguro-medico-estudiantes', { locale: 'es', canonical: '/productos/seguros-salud/seguro-medico-estudiantes', alternate: '/en/health-insurance-student-visa-spain', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/health-insurance-student-visa-spain', { locale: 'en', canonical: '/en/health-insurance-student-visa-spain', alternate: '/productos/seguros-salud/seguro-medico-estudiantes', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguro-expatriados', { locale: 'es', canonical: '/productos/seguros-salud/seguro-expatriados', alternate: '/en/health-insurance-expatriates-spain', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/health-insurance-expatriates-spain', { locale: 'en', canonical: '/en/health-insurance-expatriates-spain', alternate: '/productos/seguros-salud/seguro-expatriados', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguro-nomadas-digitales', { locale: 'es', canonical: '/productos/seguros-salud/seguro-nomadas-digitales', alternate: '/en/digital-nomad-insurance-spain', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/digital-nomad-insurance-spain', { locale: 'en', canonical: '/en/digital-nomad-insurance-spain', alternate: '/productos/seguros-salud/seguro-nomadas-digitales', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguro-salud-extranjeros', { locale: 'es', canonical: '/productos/seguros-salud/seguro-salud-extranjeros', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguros-sanitas', { locale: 'es', canonical: '/productos/seguros-salud/seguros-sanitas', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud', { locale: 'es', canonical: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguros-salud/seguros-sanitas/international-students', { locale: 'es', canonical: '/productos/seguros-salud/seguros-sanitas/international-students', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguro-mascotas/sanitas-mascotas', { locale: 'es', canonical: '/productos/seguro-mascotas/sanitas-mascotas', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguro-para-decesos/asistencia-familiar', { locale: 'es', canonical: '/productos/seguro-para-decesos/asistencia-familiar', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguro-viaje', { locale: 'es', canonical: '/productos/seguro-viaje', indexable: true, prerender: true, sitemap: true }),
  canonical('/productos/seguro-vida', { locale: 'es', canonical: '/productos/seguro-vida', indexable: true, prerender: true, sitemap: true }),
  canonical('/aviso-legal', { locale: 'es', canonical: '/aviso-legal', indexable: false, prerender: true, sitemap: true }),
  canonical('/politica-privacidad', { locale: 'es', canonical: '/politica-privacidad', indexable: false, prerender: true, sitemap: true }),
  canonical('/politica-cookies', { locale: 'es', canonical: '/politica-cookies', indexable: false, prerender: true, sitemap: true }),
  canonical('/privacidad', { locale: 'es', canonical: '/privacidad', indexable: false, prerender: true, sitemap: true }),
  canonical('/cookies', { locale: 'es', canonical: '/cookies', indexable: false, prerender: true, sitemap: true }),
  canonical('/blog', { locale: 'es', canonical: '/blog', alternate: '/en/blog', indexable: true, prerender: true, sitemap: true }),
  canonical('/en/blog', { locale: 'en', canonical: '/en/blog', alternate: '/blog', indexable: true, prerender: true, sitemap: true }),
];

/** Dynamic routes require content data to generate concrete SSG entries. */
export const dynamicRoutes: RouteDefinition[] = [
  { path: '/blog/:slug', kind: 'dynamic', locale: 'es', indexable: true, prerender: true, sitemap: true },
  { path: '/en/blog/:slug', kind: 'dynamic', locale: 'en', indexable: true, prerender: true, sitemap: true },
  { path: '/backoffice/marketing-studio/campanas/:campaignId', kind: 'development', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/r/:slug', kind: 'dynamic', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
];

/**
 * Legacy aliases remain in the current router until infrastructure redirects
 * are implemented and verified in production.
 */
export const legacyRoutes: RouteDefinition[] = [
  legacy('/estudiantes', '/productos/seguros-salud/seguro-medico-estudiantes'),
  legacy('/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud.html', '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud'),
  legacy('/productos/seguros-salud/seguros-sanitas/sanitas-mascotas.html', '/productos/seguro-mascotas/sanitas-mascotas'),
  legacy('/productos/seguros-salud/seguros-sanitas/asistencia-familiar-iplus.html', '/productos/seguro-para-decesos/asistencia-familiar'),
  legacy('/productos/seguros-salud/seguros-sanitas/seguro-medico-estudiantes-extranjeros-espana.html', '/productos/seguros-salud/seguros-sanitas/international-students'),
  legacy('/productos/seguros-salud/sanitas-mas-salud', '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud'),
  legacy('/productos/seguro-medico-estudiantes-extranjeros-espana.html', '/productos/seguros-salud/seguros-sanitas/international-students'),
  legacy('/productos/international-students.html', '/productos/seguros-salud/seguros-sanitas/international-students'),
  legacy('/seguros-salud', '/productos/seguros-salud'),
  legacy('/productos/seguro-de-salud.html', '/productos/seguros-salud'),
  legacy('/seguro-expatriados', '/productos/seguros-salud/seguro-expatriados'),
  legacy('/productos/seguro-medico-expatriados.html', '/productos/seguros-salud/seguro-expatriados'),
  legacy('/seguro-nomadas', '/productos/seguros-salud/seguro-nomadas-digitales'),
  legacy('/productos/seguro-nomadas-digitales.html', '/productos/seguros-salud/seguro-nomadas-digitales'),
  legacy('/productos/sanitas-mas-salud.html', '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud'),
  legacy('/productos/sanitas-mascotas.html', '/productos/seguro-mascotas/sanitas-mascotas'),
  legacy('/productos/asistencia-familiar-iplus.html', '/productos/seguro-para-decesos/asistencia-familiar'),
  legacy('/privacidad.html', '/privacidad'),
  legacy('/politica-cookies.html', '/politica-cookies'),
];

/** Functional routes that must remain out of search indexes. */
export const privateRoutes: RouteDefinition[] = [
  { path: '/login', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/catalogo', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/marketing-studio/login', kind: 'development', locale: 'neutral', indexable: false, prerender: false, sitemap: false, redirectTo: '/login' },
  { path: '/cotizador.html', kind: 'private', locale: 'es', canonical: '/wizard', indexable: false, prerender: true, sitemap: false },
  { path: '/wizard', kind: 'private', locale: 'es', canonical: '/wizard', indexable: false, prerender: true, sitemap: false },
  { path: '/resultados', kind: 'private', locale: 'es', canonical: '/resultados', indexable: false, prerender: true, sitemap: false },
  { path: '/styleguide', kind: 'development', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/identidad-de-marca', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/perfiles-sociales', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/campanas', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/enlaces', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/conexiones', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
  { path: '/backoffice/marketing-studio/generador-contenido', kind: 'private', locale: 'neutral', indexable: false, prerender: false, sitemap: false },
];

export const routeRegistry = [
  ...canonicalRoutes,
  ...dynamicRoutes,
  ...legacyRoutes,
  ...privateRoutes,
] as const;

/** Concrete paths consumed by the SSG renderer. */
export const prerenderRoutes = [
  ...routeRegistry
    .filter((route) => route.prerender && !route.path.includes(':'))
    .map((route) => route.path),
  ...blogPosts.map((post) => `${post.lang === 'en' ? '/en' : ''}/blog/${post.slug}`),
];
