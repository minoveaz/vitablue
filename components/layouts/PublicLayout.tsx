import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { routeRegistry } from '@/config/routes';
import { buildHreflangAlternates } from '@/config/hreflang';
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

  const withSlash = (p: string) => (p === '/' ? p : `${p.replace(/\/+$/, '')}/`);
  const origin = 'https://www.vitablue.es';
  const locale = definition?.locale === 'en' || pathname === '/en' || pathname.startsWith('/en/')
    ? 'en'
    : 'es';
  const canonicalPath = definition?.indexable
    ? withSlash(definition.canonical ?? pathname)
    : undefined;
  const alternates = definition?.indexable
    ? buildHreflangAlternates(normalizedPath)
    : [];

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      {canonicalPath && <link rel="canonical" href={`${origin}${canonicalPath}`} />}
      {alternates.map(({ hreflang, href }) => (
        <link key={`${hreflang}:${href}`} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
      {definition?.indexable && (
        <>
          <meta property="og:image" content={`${origin}/og-image.jpg`} />
          <meta name="twitter:image" content={`${origin}/og-image.jpg`} />
        </>
      )}
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
