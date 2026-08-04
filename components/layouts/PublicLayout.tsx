import React from 'react';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import CookieBanner from '@/components/organisms/CookieBanner';
import FloatingWhatsApp from '@/components/organisms/FloatingWhatsApp';

/** Shell shared by indexable pages and the public quote funnel. */
const PublicLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-background-light font-sans text-text-main">
    <Navbar />
    {children}
    <Footer />
    <CookieBanner />
    <FloatingWhatsApp />
  </div>
);

export default PublicLayout;
