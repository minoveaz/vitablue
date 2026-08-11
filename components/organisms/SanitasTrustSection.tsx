import React from 'react';

export interface SanitasTrustSectionProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const stats = [
  { value: '50.000+', label: 'Médicos y profesionales' },
  { value: '4.200+', label: 'Centros médicos asociados' },
  { value: '190+', label: 'Países de cobertura Bupa' },
  { value: '70+', label: 'Años de experiencia médica' },
];

const highlights = [
  {
    title: 'Hospitales Propios de Prestigio',
    description: 'Acceso a los hospitales La Zarzuela, La Moraleja, CIMA Barcelona y Virgen del Mar con tecnología médica avanzada.',
  },
  {
    title: 'Todo Digital con App Mi Sanitas',
    description: 'Gestiona videoconsultas de urgencia 24/7, autorizaciones médicas, reembolsos y recetas desde tu móvil en segundos.',
  },
  {
    title: 'Respaldo del Grupo Bupa',
    description: 'Con el soporte de una red de salud internacional que cuida a más de 38 millones de clientes en todo el mundo.',
  },
];

const SanitasTrustSection: React.FC<SanitasTrustSectionProps> = ({ eyebrow = 'Garantía Sanitas & Bupa', title = 'Líder en salud con respaldo internacional', description = 'Sanitas es la compañía líder en España con más de 70 años de experiencia, respaldada por el grupo global Bupa.' }) => (
  <section className="mx-auto max-w-6xl px-6 py-16 text-left sm:px-8 sm:py-20">
    <div className="mb-12 space-y-4 text-center">
      <img src="/images/logo-sanitas.svg" alt="Sanitas" className="mx-auto h-10 w-auto object-contain" />
      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
      <h2 className="text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h2>
      <p className="mx-auto max-w-xl text-body-reg font-medium text-text-secondary">{description}</p>
    </div>
    <div className="mb-12 grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
          <span className="text-3xl font-black text-primary">{stat.value}</span>
          <span className="text-xs font-bold text-text-secondary">{stat.label}</span>
        </div>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {highlights.map((highlight) => (
        <div key={highlight.title} className="space-y-2 rounded-3xl border border-slate-150 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-text-main">{highlight.title}</h3>
          <p className="text-xs font-semibold leading-relaxed text-text-secondary">{highlight.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default SanitasTrustSection;
