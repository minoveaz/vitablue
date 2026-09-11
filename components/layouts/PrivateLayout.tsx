import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Helmet } from 'react-helmet-async';

/** Private application shell. Wraps authenticated backoffice and login flows with AuthProvider. */
const PrivateLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider>
    <div className="min-h-screen bg-background-light font-sans text-text-main">
      <Helmet>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {children}
    </div>
  </AuthProvider>
);

export default PrivateLayout;
