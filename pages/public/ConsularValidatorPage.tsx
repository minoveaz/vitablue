import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Award } from 'lucide-react';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';
import CoverageGrid from '@/components/organisms/CoverageGrid';
import FaqSection from '@/components/organisms/FaqSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import ConsularRequirementsValidator from '@/components/molecules/ConsularRequirementsValidator';
import {
  HealthIllustration,
  PreventionIllustration,
  MedicalAttentionIllustration,
  TravelIllustration,
} from '@/components/illustrations';
import { buildAttributedWhatsAppUrl } from '@/utils/analytics';

export const ConsularValidatorPage: React.FC = () => {
  const canonicalUrl = 'https://www.vitablue.es/validador-visado/';
  const pageTitle = 'Validador de Seguro Médico para Visado de España (2026) | VitaBlue';
  const pageDescription = 'Comprueba gratis en 30 segundos si tu póliza cumple las 4 exigencias del Consulado de España y Extranjería: 0€ copagos, sin carencias, repatriación y DGSFP.';

  const validatorFaqs = [
    {
      question: '¿Por qué el Consulado de España rechaza los seguros de viaje tradicionales?',
      answer: (
        <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
          Los seguros de viaje operan mediante topes máximos de cobertura (por ejemplo 30.000€ o 50.000€) y mediante reembolso diferido. La legislación española de Extranjería (RD 557/2011) exige expresamente un seguro de salud privado completo con cobertura ilimitada en hospitalización médica y quirúrgica y acceso directo a hospitales sin que el asegurado deba adelantar dinero.
        </p>
      ),
    },
    {
      question: '¿Qué significa que la aseguradora deba estar autorizada por la DGSFP?',
      answer: (
        <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
          Significa que la entidad aseguradora debe estar inscrita y regulada por la Dirección General de Seguros y Fondos de Pensiones de España (como ASISA, Sanitas, Adeslas o DKV). Las aseguradoras locales de países extranjeros (como EPS o prepagas latinoamericanas o pólizas estadounidenses) no están autorizadas para emitir certificados oficiales válidos ante Extranjería en España.
        </p>
      ),
    },
    {
      question: '¿Qué es la cláusula "Sin Copagos" y por qué es obligatoria?',
      answer: (
        <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
          El copago es una pequeña tarifa adicional que el asegurado abona cada vez que visita al médico o se realiza una prueba (por ejemplo, 10€ a 25€). El Reglamento de Extranjería prohíbe que el extranjero tenga copagos a su cargo para garantizar que no tendrá barreras económicas para acceder a la atención médica en España.
        </p>
      ),
    },
    {
      question: '¿Cuánto tiempo tarda la emisión del certificado consular con VitaBlue?',
      answer: (
        <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
          Al contratar tu seguro con VitaBlue, recibirás en tu correo y WhatsApp el Certificado Oficial de Cobertura en PDF sellado por la aseguradora con firma electrónica y código seguro de verificación (CSV) en menos de 24 horas laborables.
        </p>
      ),
    },
  ];

  const trustBarItems = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: '100% Gratuito y Sin Registro',
      description: 'Diagnóstico en tiempo real sin introducir datos personales ni tarjetas.',
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: 'Normativa Consular RD 557/2011',
      description: 'Actualizado a los últimos criterios de Extranjería y Ley de Startups.',
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: 'Válido para Extranjería y BLS',
      description: 'Aceptado en consulados y embajadas de España en todo el mundo.',
    },
  ];

  const legalPillars = [
    {
      title: '1. Entidad Autorizada DGSFP',
      description: 'La aseguradora debe operar con ficha oficial en España (ASISA, Sanitas, Adeslas) con acceso directo a hospitales sin reembolsos.',
      illustration: HealthIllustration,
    },
    {
      title: '2. Póliza Sin Copagos (0€)',
      description: 'Prohibición expresa de cualquier franquicia o copago por consulta médica, analítica, prueba diagnóstica o urgencia.',
      illustration: PreventionIllustration,
    },
    {
      title: '3. Sin Periodos de Carencia',
      description: 'Todas las prestaciones sanitarias, hospitalarias y quirúrgicas deben estar activas y disponibles desde el primer día en España.',
      illustration: MedicalAttentionIllustration,
    },
    {
      title: '4. Repatriación Sanitaria Completa',
      description: 'Cobertura obligatoria de traslado sanitario de urgencia y retorno de restos mortales al país de origen.',
      illustration: TravelIllustration,
    },
  ];

  const whatsappConsultationUrl = buildAttributedWhatsAppUrl(
    'Hola! He utilizado el Validador de Visado de VitaBlue y me gustaría consultar mi caso particular con un especialista en visados de España.',
    'validador_page_bottom'
  );

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
            name: 'Seguros de Salud',
            item: 'https://www.vitablue.es/productos/seguros-salud',
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
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: typeof faq.answer === 'string' ? faq.answer : 'Información detallada sobre la normativa de seguros de salud para visado en España.',
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
      <section className="bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white py-14 sm:py-20 px-4 sm:px-6 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/20 px-4 py-1.5 text-xs font-black text-brand-cyan border border-brand-cyan/30 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            Herramienta Gratuita de Auditoría Consular
          </div>
          <h1 className="text-h1 font-display font-black tracking-tight text-white">
            Validador de Seguro Médico para Visados de España
          </h1>
          <p className="text-body-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Evita el rechazo de tu visado de estudiante, nómada digital o residencia. Diagnostica en 30 segundos si tu póliza cumple los 4 pilares obligatorios de Extranjería.
          </p>
        </div>
      </section>

      {/* Main Interactive Tool Container */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 -mt-10 relative z-20 pb-12">
        <ConsularRequirementsValidator />
      </div>

      {/* Official VitaBlue Trust Bar */}
      <ProductTrustBar items={trustBarItems} />

      {/* 4 Legal Pillars with Official VitaBlue Illustrations */}
      <CoverageGrid
        eyebrow="Marco Jurídico Oficial"
        title="¿Qué exige la ley española para autorizar tu seguro médico?"
        description="El Reglamento de Extranjería (RD 557/2011) y la Ley de Startups 28/2022 exigen el cumplimiento estricto de 4 requisitos técnicos en tu póliza:"
        items={legalPillars}
        columns={2}
      />


      {/* Official VitaBlue FAQs Section */}
      <FaqSection
        eyebrow="Dudas Frecuentes"
        title="Preguntas Frecuentes sobre la Validación Consular"
        items={validatorFaqs}
      />

      {/* Official VitaBlue Advisor Help Section */}
      <AdvisorHelpSection
        title="¿Dudas con los requisitos de tu consulado?"
        description="Nuestros especialistas revisan gratuitamente tu documentación y te ayudan a emitir un certificado con 100% de aceptación garantizada."
        whatsappUrl={whatsappConsultationUrl}
      />
    </div>
  );
};

export default ConsularValidatorPage;
