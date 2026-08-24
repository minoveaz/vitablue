import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';

import ConsularRequirementsValidator from '@/components/molecules/ConsularRequirementsValidator';

import Accordion from '@/components/molecules/Accordion';

export const ConsularValidatorPage: React.FC = () => {
  const canonicalUrl = 'https://www.vitablue.es/validador-visado';
  const pageTitle = 'Validador de Seguro Médico para Visado de España (2026) | VitaBlue';
  const pageDescription = 'Comprueba gratis en 30 segundos si tu póliza cumple las 4 exigencias del Consulado de España y Extranjería: 0€ copagos, sin carencias, repatriación y DGSFP.';

  const validatorFaqs = [
    {
      q: '¿Por qué el Consulado de España rechaza los seguros de viaje tradicionales?',
      a: 'Los seguros de viaje operan mediante topes máximos de cobertura (por ejemplo 30.000€ o 50.000€) y mediante reembolso diferido. La legislación española de Extranjería (RD 557/2011) exige expresamente un seguro de salud privado completo con cobertura ilimitada en hospitalización médica y quirúrgica y acceso directo a hospitales sin que el asegurado deba adelantar dinero.',
    },
    {
      q: '¿Qué significa que la aseguradora deba estar autorizada por la DGSFP?',
      a: 'Significa que la entidad aseguradora debe estar inscrita y regulada por la Dirección General de Seguros y Fondos de Pensiones de España (como ASISA, Sanitas, Adeslas o DKV). Las aseguradoras locales de países extranjeros (como EPS o prepagas latinoamericanas o pólizas estadounidenses) no están autorizadas para emitir certificados oficiales válidos ante Extranjería en España.',
    },
    {
      q: '¿Qué es la cláusula "Sin Copagos" y por qué es obligatoria?',
      a: 'El copago es una pequeña tarifa adicional que el asegurado abona cada vez que visita al médico o se realiza una prueba (por ejemplo, 10€ a 25€). El Reglamento de Extranjería prohíbe que el extranjero tenga copagos a su cargo para garantizar que no tendrá barreras económicas para acceder a la atención médica en España.',
    },
    {
      q: '¿Cuánto tiempo tarda la emisión del certificado consular con VitaBlue?',
      a: 'Al contratar tu seguro con VitaBlue, recibirás en tu correo y WhatsApp el Certificado Oficial de Cobertura en PDF sellado por la aseguradora con firma electrónica y código seguro de verificación (CSV) en menos de 24 horas laborables.',
    },
  ];

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Validador de Requisitos Consulares de Seguro Médico',
        url: canonicalUrl,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
        description: pageDescription,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: 'https://www.vitablue.es',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Herramientas',
            item: 'https://www.vitablue.es#herramientas',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Validador de Visado',
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: validatorFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <ProductBreadcrumbBar
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Validador de Visado', href: '/validador-visado' },
        ]}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white py-12 sm:py-16 px-4 sm:px-6 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/20 px-3.5 py-1 text-xs font-bold text-brand-cyan border border-brand-cyan/30">
            <ShieldCheck className="h-4 w-4" />
            Herramienta Gratuita de Auditoría Consular
          </div>
          <h1 className="text-h1 font-display font-black tracking-tight text-white">
            Validador de Seguro Médico para Visados de España
          </h1>
          <p className="text-body-lg text-white/90 font-medium max-w-2xl mx-auto">
            Evita el rechazo de tu visado de estudiante, nómada digital o residencia. Diagnostica en 30 segundos si tu póliza cumple los 4 pilares obligatorios de Extranjería.
          </p>
        </div>
      </section>

      {/* Main Interactive Tool Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 -mt-8 relative z-20 pb-16">
        <ConsularRequirementsValidator />

        {/* Educational Content & Guidelines */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-150 p-6 sm:p-10 shadow-sm space-y-8 text-left">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-primary">Marco Jurídico Oficial</span>
            <h2 className="text-h2 font-display font-black text-text-main mt-1">
              ¿Qué exige la ley española para autorizar tu seguro médico?
            </h2>
            <p className="text-body-reg text-text-secondary mt-2 leading-relaxed">
              El Real Decreto 557/2011 (Reglamento de la Ley Orgánica de Extranjería) y la Ley de Startups 28/2022 establecen que los extranjeros que soliciten visado o autorización de residencia en España deben contar con un seguro público o privado de enfermedad concertado con una entidad aseguradora autorizada para operar en España, con cobertura equivalente a la prestada por el Sistema Nacional de Salud.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2.5 text-primary font-black text-sm">
                <CheckCircle2 className="h-5 w-5" />
                1. Aseguradora Homologada DGSFP
              </div>
              <p className="text-xs text-text-secondary mt-2 font-medium leading-relaxed">
                La compañía debe tener sucursal registrada en España (como ASISA, Sanitas o Adeslas) y proveer acceso directo a hospitales sin reembolsos.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2.5 text-primary font-black text-sm">
                <CheckCircle2 className="h-5 w-5" />
                2. Póliza Sin Copagos (0€)
              </div>
              <p className="text-xs text-text-secondary mt-2 font-medium leading-relaxed">
                Queda expresamente prohibido cualquier copago o franquicia a cargo del titular por acudir al médico, analíticas o intervenciones.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2.5 text-primary font-black text-sm">
                <CheckCircle2 className="h-5 w-5" />
                3. Sin Periodos de Carencia
              </div>
              <p className="text-xs text-text-secondary mt-2 font-medium leading-relaxed">
                Todas las coberturas esenciales de urgencias, hospitalización y cirugías deben estar activas y disponibles desde el día 1 en España.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex items-center gap-2.5 text-primary font-black text-sm">
                <CheckCircle2 className="h-5 w-5" />
                4. Repatriación Sanitaria
              </div>
              <p className="text-xs text-text-secondary mt-2 font-medium leading-relaxed">
                Obligación de cubrir el traslado médico de emergencia o la repatriación de restos mortales al país de origen en caso de fallecimiento.
              </p>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-h3 font-display font-black text-text-main mb-4">
              Preguntas Frecuentes sobre la Validación Consular
            </h3>
            <div className="space-y-3">
              {validatorFaqs.map((faq, index) => (
                <Accordion key={index} title={faq.q}>
                  <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConsularValidatorPage;
