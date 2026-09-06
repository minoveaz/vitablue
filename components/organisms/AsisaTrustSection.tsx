import React from 'react';

export interface AsisaTrustSectionProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const stats = [
  { value: '40.000+', label: 'Médicos y profesionales' },
  { value: '18', label: 'Hospitales propios Grupo HLA' },
  { value: '36', label: 'Centros médicos multiespecialidad' },
  { value: '45+', label: 'Años de experiencia médica' },
];

const highlights = [
  {
    title: 'Red Hospitalaria Propia (Grupo HLA)',
    description: 'Acceso preferente a 18 hospitales de primer nivel del Grupo HLA (Hospital Universitario Moncloa, Clínica El Ángel, HLA Santa Isabel, Vistahermosa, entre otros) equipados con tecnología de vanguardia.',
  },
  {
    title: 'Telemedicina AsisaLIVE 24/7',
    description: 'Videoconsultas médicas inmediatas con médicos de cabecera y especialistas, receta médica electrónica y gestión de citas desde la app oficial de Asisa.',
  },
  {
    title: 'La Gran Cooperativa Médica de España',
    description: 'Propiedad de la cooperativa médica Lavinia (formada por los propios médicos), lo que garantiza que los beneficios se reinvierten directamente en la mejora asistencial y tecnológica.',
  },
];

const AsisaTrustSection: React.FC<AsisaTrustSectionProps> = ({
  eyebrow = 'Garantía Asisa & Grupo HLA',
  title = 'Líder en sanidad privada con red hospitalaria propia',
  description = 'Asisa es una de las aseguradoras de salud más sólidas de España, respaldada por la cooperativa médica Lavinia y su red hospitalaria propia Grupo HLA.',
}) => (
  <section className="mx-auto max-w-6xl px-6 py-16 text-left sm:px-8 sm:py-20">
    <div className="mb-12 space-y-4 text-center">
      <img
        src="/images/logo-asisa.png"
        alt="Asisa"
        width="160"
        height="40"
        className="mx-auto h-10 w-auto object-contain"
        loading="lazy"
        decoding="async"
      />
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

export default AsisaTrustSection;
