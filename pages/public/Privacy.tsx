import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="w-full bg-slate-50/50 py-12 px-6 sm:px-8">
      <Helmet>
        <title>Política de Privacidad | VitaBlue</title>
        <meta name="description" content="Política de privacidad de VitaBlue. Cumplimiento estricto de la LOPD y el RGPD para la protección de tus datos de salud." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-6 sm:p-8 lg:p-10 text-left space-y-6">
        <div className="flex items-center gap-3 text-primary pb-4 border-b border-slate-100">
          <ShieldAlert className="w-8 h-8" />
          <h1 className="text-3xl font-display font-black text-text-main tracking-tight">Política de Privacidad</h1>
        </div>
        
        <p className="text-body-reg text-text-secondary leading-relaxed font-semibold">
          Última actualización: 27 de Julio de 2026
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">1. Responsable del Tratamiento</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            El responsable del tratamiento de sus datos personales recolectados a través de esta plataforma es VitaBlue (en adelante, "el portal" o "nosotros"), un servicio operado de forma independiente e inscrito en el registro de la Dirección General de Seguros y Fondos de Pensiones (DGSFP) como mediador de seguros titulado.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">2. Finalidad del Tratamiento de Datos</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            Tratamos sus datos únicamente con las siguientes finalidades:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body-reg text-text-secondary font-medium leading-relaxed">
            <li>Calcular e informarle sobre cotizaciones de seguros de salud solicitadas en el cotizador interactivo.</li>
            <li>Gestionar el contacto y las derivaciones de contratación con las aseguradoras seleccionadas (Adeslas, Sanitas, etc.).</li>
            <li>Resolver sus consultas personalizadas mediante WhatsApp o llamada telefónica con asesores asignados.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">3. Legitimación del Tratamiento</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            La base legal para el tratamiento de sus datos es el consentimiento expreso e informado otorgado al realizar una simulación en el cotizador o ponerse en contacto directo con nosotros vía WhatsApp. No solicitamos datos bancarios ni números de tarjetas de crédito en ningún paso de esta web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">4. Conservación de los Datos</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            Los datos de su cotización se conservan de forma segura durante un plazo máximo de 12 meses para facilitarle la gestión de contratación antes de ser anonimizados, a menos que solicite su cancelación con anterioridad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">5. Derechos del Usuario</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            Tiene derecho a acceder, rectificar, limitar o solicitar la supresión de sus datos personales enviando una solicitud formal a nuestro correo oficial de soporte o escribiendo directamente a nuestro delegado de protección de datos.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
