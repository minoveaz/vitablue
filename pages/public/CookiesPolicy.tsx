import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';
import ConsentPreferences from '@/components/molecules/ConsentPreferences';

export const CookiesPolicy: React.FC = () => {
  return (
    <div className="w-full bg-slate-50/50 py-12 px-6 sm:px-8">
      <Helmet>
        <title>Política de Cookies | VitaBlue</title>
        <meta name="description" content="Política de cookies de VitaBlue. Conoce los detalles de las cookies técnicas, de sesión y de análisis que empleamos en nuestro portal." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-6 sm:p-8 lg:p-10 text-left space-y-6">
        <div className="flex items-center gap-3 text-primary pb-4 border-b border-slate-100">
          <ShieldAlert className="w-8 h-8" />
          <h1 className="text-3xl font-display font-black text-text-main tracking-tight">Política de Cookies</h1>
        </div>
        
        <p className="text-body-reg text-text-secondary leading-relaxed font-semibold">
          Última actualización: 27 de Julio de 2026
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">1. ¿Qué son las Cookies?</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página, optimizando las preferencias de sesión y la velocidad de carga.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">2. Cookies que utiliza este Sitio Web</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            Siguiendo las directrices de la Agencia Española de Protección de Datos (AEPD), detallamos el uso de cookies de este portal:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body-reg text-text-secondary font-medium leading-relaxed">
            <li><strong>Cookies Técnicas:</strong> Son cookies estrictamente necesarias para el funcionamiento del cotizador y la persistencia de su estado de simulación temporal en el navegador.</li>
            <li><strong>Cookies de Personalización:</strong> Permiten al usuario configurar sus preferencias de idioma o accesibilidad en el portal.</li>
            <li><strong>Cookies Analíticas:</strong> Tratadas por nosotros o por terceros (como Google Analytics), nos permiten cuantificar el número de usuarios y realizar mediciones estadísticas del uso de la web para mejorar la oferta de seguros.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">3. Desactivación o Eliminación de Cookies</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            En cualquier momento podrá ejercitar su derecho de desactivación o eliminación de cookies de este sitio web desde el panel de ajustes de su navegador de internet (Chrome, Safari, Firefox, Edge, etc.).
          </p>
          <ConsentPreferences />
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicy;
