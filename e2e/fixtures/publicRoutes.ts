import { canonicalRoutes, legacyRoutes } from '../../config/routes';
import { blogPosts } from '../../utils/blogData';

export interface PublicRoute {
  name: string;
  path: string;
  indexable: boolean;
  expectedCanonical: string;
  legacy?: boolean;
}

const routeName = (path: string) => path === '/' ? 'home-es' : path.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';

const canonicalPublicRoutes: PublicRoute[] = canonicalRoutes.map((route) => ({
  name: routeName(route.path),
  path: route.path,
  indexable: route.indexable,
  expectedCanonical: route.canonical || route.path,
}));

const blogArticleRoutes: PublicRoute[] = blogPosts.map((post) => {
  const prefix = post.lang === 'en' ? '/en' : '';
  const path = `${prefix}/blog/${post.slug}`;
  return { name: routeName(path), path, indexable: true, expectedCanonical: path };
});

export const publicRoutes: PublicRoute[] = [...canonicalPublicRoutes, ...blogArticleRoutes]
  .filter((route, index, routes) => routes.findIndex((candidate) => candidate.path === route.path) === index);

export const indexablePublicRoutes = publicRoutes.filter((route) => route.indexable);

export const legacyPublicRoutes: PublicRoute[] = legacyRoutes.map((route) => ({
  name: routeName(route.path),
  path: route.path,
  indexable: false,
  expectedCanonical: route.redirectTo || route.path,
  legacy: true,
}));
