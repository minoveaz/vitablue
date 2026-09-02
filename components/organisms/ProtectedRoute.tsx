import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading, authError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background-light" aria-busy="true" />;
  }

  if (authError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-light px-4 text-center">
        <div>
          <h1 className="text-h2 text-text-main">No se pudo validar la sesión</h1>
          <p className="text-body-reg mt-2 text-text-secondary">{authError}</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Access decisions for each module are enforced by LoopDev RLS permissions.
  // The client only gates on a valid Supabase session.
  return <>{children}</>;
};

export default ProtectedRoute;
