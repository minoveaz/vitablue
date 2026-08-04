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
  const definition = routeRegistry.find((route) => route.path === pathname)
    ?? routeRegistry.find((route) => route.path.includes(':') && pathname.startsWith(route.path.split('/:')[0]));
  if (!definition?.indexable || typeof window === 'undefined') return null;

  const origin = window.location.origin;
  const canonicalPath = definition.canonical ?? pathname;
  const alternatePath = definition.alternate;
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
