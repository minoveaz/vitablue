import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import InputText from '@/components/atoms/InputText';
import Logo from '@/components/atoms/Logo';
import { useAuth } from '@/context/AuthContext';

const MarketingLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading, authError, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (session) navigate('/backoffice', { replace: true });
  }, [navigate, session]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await signIn(email.trim(), password);
    if (result.error) setError('No se pudo iniciar sesión. Revisa tus credenciales.');
    else navigate((location.state as { from?: string } | null)?.from ?? '/backoffice', { replace: true });
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Acceso | VitaBlue Marketing Studio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-background-light px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <Logo orientation="vertical" iconSize={48} />
            <div>
              <p className="text-caption font-bold uppercase tracking-widest text-primary">Área privada</p>
              <h1 className="text-h2 mt-2 text-text-main">Backoffice VitaBlue</h1>
              <p className="text-body-reg mt-2 text-text-secondary">Inicia sesión para continuar.</p>
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <InputText label="Email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <InputText label="Contraseña" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            {authError && <p className="text-sm font-semibold text-red-600" role="alert">{authError}</p>}
            {error && <p className="text-sm font-semibold text-red-600" role="alert">{error}</p>}
            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting || isLoading}>Entrar</Button>
          </form>

          <Link to="/" className="mt-6 block text-center text-sm font-semibold text-primary hover:underline">Volver a VitaBlue</Link>
        </section>
      </main>
    </>
  );
};

export default MarketingLogin;
