import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background-light" aria-busy="true" />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!role) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background-light px-4 text-center">
        <div>
          <h1 className="text-h2 text-text-main">Sin permisos</h1>
          <p className="text-body-reg mt-2 text-text-secondary">Tu usuario no tiene un rol de Marketing Studio asignado.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
