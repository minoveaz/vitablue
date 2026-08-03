import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert } from 'lucide-react';

export const LegalNotice: React.FC = () => {
  return (
    <div className="w-full bg-slate-50/50 py-12 px-6 sm:px-8">
      <Helmet>
        <title>Aviso Legal | VitaBlue</title>
        <meta name="description" content="Aviso legal de VitaBlue. Información corporativa y de cumplimiento regulatorio conforme a las leyes españolas." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border border-slate-200/60 shadow-sm p-6 sm:p-8 lg:p-10 text-left space-y-6">
        <div className="flex items-center gap-3 text-primary pb-4 border-b border-slate-100">
          <ShieldAlert className="w-8 h-8" />
          <h1 className="text-3xl font-display font-black text-text-main tracking-tight">Aviso Legal</h1>
        </div>
        
        <p className="text-body-reg text-text-secondary leading-relaxed font-semibold">
          Última actualización: 27 de Julio de 2026
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">1. Información General</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            De conformidad con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE), se facilitan a continuación los siguientes datos informativos generales de este sitio web:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-body-reg text-text-secondary font-medium leading-relaxed">
            <li><strong>Titular del portal:</strong> VitaBlue Mediación de Seguros.</li>
            <li><strong>Contacto:</strong> info@vitablue.es / +34 694 58 34 52.</li>
            <li><strong>Actividad regulatoria:</strong> Bróker y mediador de seguros autorizado e inscrito en el Registro Especial de Mediadores de Seguros de la Dirección General de Seguros y Fondos de Pensiones (DGSFP).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">2. Condiciones Generales de Uso</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            El acceso y uso de este portal atribuyen la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. Las citadas condiciones serán de aplicación independientemente de las Condiciones Generales de Contratación que en su caso resulten de obligado cumplimiento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">3. Propiedad Intelectual e Industrial</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            VitaBlue es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo: logotipos, imágenes, textos, marcas o combinaciones de colores). Quedan expresamente prohibidas la reproducción, distribución y comunicación pública de la totalidad o parte de los contenidos de esta página web con fines comerciales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-display font-bold text-text-main">4. Exclusión de Responsabilidad</h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
            VitaBlue no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNotice;
