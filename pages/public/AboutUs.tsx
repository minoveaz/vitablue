import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HeartHandshake, Search, ShieldCheck } from 'lucide-react';

const AboutUs: React.FC = () => {
  const isEnglish = window.location.pathname.startsWith('/en');

  const content = isEnglish ? {
    title: 'About VitaBlue | Independent insurance advice',
    description: 'Meet VitaBlue, an independent insurance comparison and advice service focused on helping you choose cover with clarity.',
    eyebrow: 'Insurance advice with a human point of view',
    heading: 'Insurance should feel clear, not complicated.',
    intro: 'VitaBlue helps individuals, families and people moving to Spain compare insurance options and make confident decisions without pressure.',
    valuesTitle: 'What guides our work',
    values: [
      ['Clarity first', 'We explain cover, conditions and next steps in plain language.'],
      ['Independent guidance', 'We help you compare suitable options instead of pushing a single answer.'],
      ['Human support', 'When you need help, a real advisor is available through the channel that suits you.'],
    ],
    processTitle: 'A simpler way to choose',
    process: ['Tell us what you need', 'Compare the relevant options', 'Get support when you are ready to decide'],
    ctaTitle: 'Have questions about your situation?',
    cta: 'Contact our team',
    contactPath: '/en/contact',
  } : {
    title: 'Sobre VitaBlue | Asesoramiento independiente en seguros',
    description: 'Conoce VitaBlue, un servicio independiente de comparación y asesoramiento en seguros para elegir tu cobertura con claridad.',
    eyebrow: 'Asesoramiento en seguros con una mirada humana',
    heading: 'Los seguros deberían ser claros, no complicados.',
    intro: 'VitaBlue ayuda a particulares, familias y personas que se mudan a España a comparar opciones de seguros y tomar decisiones con confianza, sin presión.',
    valuesTitle: 'Lo que guía nuestro trabajo',
    values: [
      ['Claridad primero', 'Explicamos las coberturas, condiciones y siguientes pasos con un lenguaje comprensible.'],
      ['Asesoramiento independiente', 'Te ayudamos a comparar opciones adecuadas en lugar de empujarte hacia una única respuesta.'],
      ['Atención humana', 'Cuando necesitas ayuda, puedes hablar con un asesor real por el canal que prefieras.'],
    ],
    processTitle: 'Una forma más sencilla de elegir',
    process: ['Cuéntanos qué necesitas', 'Compara las opciones relevantes', 'Recibe ayuda cuando estés listo para decidir'],
    ctaTitle: '¿Tienes dudas sobre tu situación?',
    cta: 'Contacta con nuestro equipo',
    contactPath: '/contacto',
  };

  return (
    <div className="w-full bg-background-light text-text-main">
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={`https://www.vitablue.es${isEnglish ? '/en/about-us' : '/sobre-nosotros'}`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: content.title,
          description: content.description,
          url: `https://www.vitablue.es${isEnglish ? '/en/about-us' : '/sobre-nosotros'}`,
          about: { '@type': 'Organization', name: 'VitaBlue', url: 'https://www.vitablue.es' },
        })}</script>
      </Helmet>

      <main>
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-xs font-bold text-text-secondary">VitaBlue <span className="px-2 text-slate-300">/</span> {isEnglish ? 'About us' : 'Sobre nosotros'}</div>
        </div>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-slate-900 px-6 py-16 text-white sm:px-8 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />
          <div className="relative mx-auto max-w-6xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan">{content.eyebrow}</div>
            <h1 className="mt-6 max-w-3xl text-h1 font-black leading-tight">{content.heading}</h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-200">{content.intro}</p>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">VitaBlue</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{content.valuesTitle}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {content.values.map(([title, text], index) => {
                const Icon = [ShieldCheck, Search, HeartHandshake][index];
                return <article key={title} className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-text-secondary">{text}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-6 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-black tracking-tight">{content.processTitle}</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {content.process.map((step, index) => <li key={step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-lg font-black text-primary">{index + 1}</span>
                <span className="pt-2 text-lg font-bold">{step}</span>
              </li>)}
            </ol>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-3xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-primary/5 p-8 sm:flex-row sm:items-center sm:p-10">
            <h2 className="max-w-xl text-2xl font-black sm:text-3xl">{content.ctaTitle}</h2>
            <a href={content.contactPath} className="inline-flex min-h-12 items-center justify-center bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-dark">{content.cta}</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
