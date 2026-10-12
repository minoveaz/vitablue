import { canonicalRoutes, type RouteDefinition } from './routes';
import { blogPosts, isPostPublished } from '../utils/blogData';

export type HreflangLocale = 'es' | 'en';

export interface HreflangPage {
  path: string;
  locale: HreflangLocale;
  alternatePath?: string;
}

const blogPath = (lang: HreflangLocale, slug: string) =>
  `${lang === 'en' ? '/en' : ''}/blog/${slug}`;

const spanishOnlyPaths = new Set([
  '/productos/seguro-mascotas/sanitas-mascotas',
  '/productos/seguro-vida',
  '/productos/seguro-viaje',
  '/productos/seguro-para-decesos/asistencia-familiar',
]);

const isHreflangLocale = (locale: string): locale is HreflangLocale =>
  locale === 'es' || locale === 'en';

const toHreflangPage = (route: RouteDefinition): HreflangPage | undefined => {
  if (!route.sitemap || !isHreflangLocale(route.locale)) return undefined;
  return {
    path: route.path,
    locale: route.locale,
    alternatePath: route.alternate,
  };
};

const canonicalPages: HreflangPage[] = canonicalRoutes.flatMap((route) => {
  const page = toHreflangPage(route);
  return page ? [page] : [];
});

const publishedBlogPosts = blogPosts.filter((post) => isPostPublished(post));
const publishedBlogPostKeys = new Set(
  publishedBlogPosts.map((post) => `${post.lang ?? 'es'}:${post.slug}`),
);

const blogPages: HreflangPage[] = publishedBlogPosts.map((post) => {
  const locale = post.lang === 'en' ? 'en' : 'es';
  const alternateLocale = locale === 'en' ? 'es' : 'en';
  const alternateSlug = post.alternateSlug;
  const alternateExists = Boolean(
    alternateSlug && publishedBlogPostKeys.has(`${alternateLocale}:${alternateSlug}`),
  );
  return {
    path: blogPath(locale, post.slug),
    locale,
    alternatePath: alternateSlug && alternateExists
      ? blogPath(alternateLocale, alternateSlug)
      : undefined,
  };
});

export const hreflangPages: HreflangPage[] = [...canonicalPages, ...blogPages];

export const HREFLANG_PAGE_MAP: Readonly<Record<string, HreflangPage>> =
  Object.freeze(Object.fromEntries(hreflangPages.map((page) => [page.path, page])));

if (Object.keys(HREFLANG_PAGE_MAP).length !== hreflangPages.length) {
  throw new Error('Hreflang page map contains duplicate paths.');
}

const absolute = (path: string) =>
  `https://www.vitablue.es${path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`}`;

export const buildHreflangAlternates = (path: string) => {
  const normalizedPath = path === '/' ? path : path.replace(/\/+$/, '');
  const page = HREFLANG_PAGE_MAP[normalizedPath]
    ?? HREFLANG_PAGE_MAP[normalizedPath === '/' ? '/' : `${normalizedPath}/`];
  if (!page) return [];

  const spanishPage = page.locale === 'es'
    ? page
    : page.alternatePath
      ? HREFLANG_PAGE_MAP[page.alternatePath]
      : undefined;
  const englishPage = page.locale === 'en'
    ? page
    : page.alternatePath
      ? HREFLANG_PAGE_MAP[page.alternatePath]
      : undefined;
  const alternates: Array<{ hreflang: string; href: string }> = [];

  if (spanishPage) {
    alternates.push({ hreflang: 'es-ES', href: absolute(spanishPage.path) });
    const spanishPath = spanishPage.path === '/' ? '/' : spanishPage.path.replace(/\/+$/, '');
    if (!spanishOnlyPaths.has(spanishPath)) {
      alternates.push({ hreflang: 'es-419', href: absolute(spanishPage.path) });
    }
  }
  if (englishPage) {
    alternates.push({ hreflang: 'en', href: absolute(englishPage.path) });
  }
  if (spanishPage && englishPage) {
    alternates.push({ hreflang: 'x-default', href: absolute(spanishPage.path) });
  }

  return alternates;
};
