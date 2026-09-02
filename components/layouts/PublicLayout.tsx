import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { routeRegistry } from '@/config/routes';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import CookieBanner from '@/components/organisms/CookieBanner';
import FloatingWhatsApp from '@/components/organisms/FloatingWhatsApp';

const PublicRouteSeo: React.FC = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/$/, '');
  const definition = routeRegistry.find((route) => (
    route.path === pathname || route.path.replace(/\/$/, '') === normalizedPath
  ))
    ?? routeRegistry.find((route) => route.path.includes(':') && pathname.startsWith(route.path.split('/:')[0]));
  if (!definition?.indexable) return null;

  // Hostinger CDN añade trailing slash a todas las rutas (excecto "/").
  // Normalizamos canonical y alternate para que coincidan con la URL real
  // que sirve el servidor (200 OK) y Google no detecte un redirect.
  const withSlash = (p: string) => (p === '/' ? p : `${p}/`);

  const origin = 'https://www.vitablue.es';
  const canonicalPath = withSlash(definition.canonical ?? pathname);
  const alternatePath = definition.alternate ? withSlash(definition.alternate) : undefined;
  return (
    <Helmet>
      <link rel="canonical" href={`${origin}${canonicalPath}`} />
      {alternatePath && <link rel="alternate" hrefLang={definition.locale === 'en' ? 'es' : 'en'} href={`${origin}${alternatePath}`} />}
      {alternatePath && <link rel="alternate" hrefLang="x-default" href={`${origin}${definition.locale === 'en' ? alternatePath : canonicalPath}`} />}
    </Helmet>
  );
};

/** Shell shared by indexable pages and the public quote funnel. */
const PublicLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-background-light font-sans text-text-main">
    <PublicRouteSeo />
    <Navbar />
    {children}
    <Footer />
    <CookieBanner />
    <FloatingWhatsApp />
  </div>
);

export default PublicLayout;
