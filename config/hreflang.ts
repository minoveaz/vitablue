import { canonicalRoutes, type RouteDefinition } from './routes';
import { blogPosts } from '../utils/blogData';

export type HreflangLocale = 'es' | 'en';

export interface HreflangPage {
  path: string;
  locale: HreflangLocale;
  alternatePath?: string;
}

const blogPath = (lang: HreflangLocale, slug: string) =>
  `${lang === 'en' ? '/en' : ''}/blog/${slug}`;

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

const blogPages: HreflangPage[] = blogPosts.map((post) => {
  const locale = post.lang === 'en' ? 'en' : 'es';
  return {
    path: blogPath(locale, post.slug),
    locale,
    alternatePath: post.alternateSlug
      ? blogPath(locale === 'en' ? 'es' : 'en', post.alternateSlug)
      : undefined,
  };
});

export const hreflangPages: HreflangPage[] = [...canonicalPages, ...blogPages];

export const HREFLANG_PAGE_MAP: Readonly<Record<string, HreflangPage>> =
  Object.freeze(Object.fromEntries(hreflangPages.map((page) => [page.path, page])));

if (Object.keys(HREFLANG_PAGE_MAP).length !== hreflangPages.length) {
  throw new Error('Hreflang page map contains duplicate paths.');
}
