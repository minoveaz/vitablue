import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

/** Private application shell. Wraps authenticated backoffice and login flows with AuthProvider. */
const PrivateLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <AuthProvider>
    <div className="min-h-screen bg-background-light font-sans text-text-main">
      {children}
    </div>
  </AuthProvider>
);

export default PrivateLayout;
