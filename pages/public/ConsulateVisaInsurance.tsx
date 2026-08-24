import React from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Clock,
  Award,
  FileCheck,
  MapPin,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import ProductHero from '@/components/organisms/ProductHero';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';
import ProviderLogoBar from '@/components/organisms/ProviderLogoBar';
import CoverageGrid from '@/components/organisms/CoverageGrid';
import TravelVsHealthComparison from '@/components/organisms/TravelVsHealthComparison';
import PlanComparisonSection, { PlanComparisonSectionPlan } from '@/components/organisms/PlanComparisonSection';
import ProductPromotionSection from '@/components/organisms/ProductPromotionSection';
import GuaranteeRefundSection from '@/components/organisms/GuaranteeRefundSection';
import FaqSection from '@/components/organisms/FaqSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import QuoteEstimator from '@/components/molecules/QuoteEstimator';
import { useWizard } from '@/context/WizardContext';
import { getConsulateBySlug } from '@/utils/consulatesData';
import { buildAttributedWhatsAppUrl } from '@/utils/analytics';
import {
  StudentIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
} from '@/components/illustrations';

export const ConsulateVisaInsurance: React.FC = () => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { resetWizard, setProfile, setVisaRequired } = useWizard();

  const currentSlug = paramSlug || location.pathname.split('/').filter(Boolean).pop() || '';
  const consulate = getConsulateBySlug(currentSlug);

  if (!consulate) {
    return <Navigate to="/productos/seguros-salud/seguro-medico-estudiantes" replace />;
  }


  const handleStartQuoting = () => {
    resetWizard();
    setProfile('student');
    setVisaRequired('yes');
    navigate('/wizard');
  };

  const whatsappHref = buildAttributedWhatsAppUrl(
    '34694583452',
    consulate.whatsappMessage,
    consulate.whatsappTag
  );

  const coverages = [
    {
      title: 'Aseguradora Autorizada en España',
      description: 'Póliza suscrita con entidad española inscrita en la DGSFP (ASISA, Sanitas, Adeslas). Cumple el 100% de la normativa del Ministerio de Asuntos Exteriores.',
      illustration: PreventionIllustration,
    },
    {
      title: 'Sin Copagos ni Franquicias',
      description: 'Acceso total a consultas, especialistas, análisis y hospitalización con 0€ de coste adicional por visita médica durante toda tu estancia.',
      illustration: HealthIllustration,
    },
    {
      title: 'Sin Periodos de Carencia',
      description: 'Todas las coberturas de urgencias médicas, intervenciones quirúrgicas e internamiento hospitalario activas desde tu primer día en España.',
      illustration: MedicalAttentionIllustration,
    },
    {
      title: `Repatriación a ${consulate.country}`,
      description: `Cobertura obligatoria de traslado sanitario y repatriación de restos mortales a ${consulate.country} incluida en el certificado oficial.`,
      illustration: StudentIllustration,
    },
  ];

  const plansList: PlanComparisonSectionPlan[] = [
    {
      title: 'ASISA',
      subtitle: 'Póliza Oficial Visado',
      tag: 'Opción Recomendada',
      isFeatured: true,
      description: `Póliza líder para visado en ${consulate.city}. Red médica cooperativa (Lavinia), certificado inmediato y tarifas estables sin subidas abusivas.`,
      priceText: `Desde ${consulate.priceFromEur}€ / mes`,
    },
    {
      title: 'Sanitas',
      subtitle: 'International Students',
      tag: 'Sanitas Students',
      description: `Póliza bilingüe de Sanitas con app digital, videoconsultas en 24h y red hospitalaria de primer nivel en Madrid y Barcelona.`,
      priceText: 'Desde 42€ / mes',
    },
    {
      title: 'Adeslas',
      subtitle: 'Plena Plus Extranjería',
      tag: 'Adeslas Plena',
      description: `Amplio cuadro médico privado en toda España con acceso a miles de especialistas y centros médicos concertados.`,
      priceText: 'Desde 45€ / mes',
    },
  ];

  const canonicalUrl = `https://www.vitablue.es${consulate.canonicalPath}`;

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GovernmentService',
        name: consulate.title,
        serviceType: 'Seguro Médico Homologado para Visados en España',
        provider: {
          '@type': 'InsuranceAgency',
          name: 'VitaBlue Correduría de Seguros',
          url: 'https://www.vitablue.es',
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: consulate.country,
        },
        description: consulate.metaDescription,
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
            name: 'Seguro Médico Estudiantes',
            item: 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${consulate.flag} ${consulate.city}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: consulate.faqs.map((faq) => ({
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
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{consulate.title} | VitaBlue</title>
        <meta name="description" content={consulate.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${consulate.title} | VitaBlue`} />
        <meta property="og:description" content={consulate.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${consulate.title} | VitaBlue`} />
        <meta name="twitter:description" content={consulate.metaDescription} />

        {/* Structured JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <ProductBreadcrumbBar
        items={[
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguro Estudiantes', href: '/productos/seguros-salud/seguro-medico-estudiantes' },
          { label: `${consulate.flag} ${consulate.city}`, href: consulate.canonicalPath },
        ]}
      />

      {/* Hero Section */}
      <ProductHero
        badges={[
          { label: `${consulate.flag} Consulado de España en ${consulate.city}`, icon: <Building2 className="h-4 w-4" /> },
          { label: '100% Homologado', tone: 'accent' },
        ]}
        title={consulate.title}
        description={consulate.heroSubtitle}
        primaryAction={{ label: 'Calcular Seguro Online', onClick: handleStartQuoting }}
        secondaryAction={{
          label: 'Consultar con Asesor',
          href: whatsappHref,
        }}
        highlights={[
          'Certificado oficial sellado en 24h',
          'Sin copagos ni carencias',
          'Devolución 100% por denegación',
        ]}
      >
        <QuoteEstimator
          title={`Tarificador ${consulate.country}`}
          description={`Calcula tu cuota oficial sin copagos en ${consulate.currencyCode} (${consulate.priceFromLocal}).`}
          initialAge={22}
          maxAge={35}
          options={[
            { id: 'grado', label: 'Grado / Uni' },
            { id: 'master', label: 'Máster / PhD' },
            { id: 'nomada', label: 'Nómada / Remoto' },
          ]}
          initialOption="grado"
          priceSuffix={`${consulate.currencyCode}/mes`}
          calculatePrice={(age, option) => {
            let eur = consulate.priceFromEur;
            if (option === 'master') eur += 3;
            if (option === 'nomada') eur += 10;
            if (age > 26) eur += Math.floor((age - 26) * 0.8);
            const local = Math.round(eur * consulate.rateEurToLocal);
            return local.toLocaleString('es-ES');
          }}
          calculateSecondaryPrice={(age, option) => {
            let eur = consulate.priceFromEur;
            if (option === 'master') eur += 3;
            if (option === 'nomada') eur += 10;
            if (age > 26) eur += Math.floor((age - 26) * 0.8);
            return `(Aprox. ${eur} €/mes)`;
          }}
          personalizedPriceLabel="Tarifa homologada"
          priceLabel="Cuota Estimada:"
          submitLabel="Iniciar Contratación Online"
          onSubmit={handleStartQuoting}
        />


      </ProductHero>

      {/* Trust & Guarantee Bar */}
      <ProductTrustBar
        items={[
          {
            icon: <ShieldCheck />,
            title: 'Aprobación Consular',
            description: `Cumple los requisitos del Consulado de España en ${consulate.city} y BLS.`,
          },
          {
            icon: <Clock />,
            title: 'Certificado en 24h',
            description: 'Documento en PDF sellado por la aseguradora listo para presentar.',
          },
          {
            icon: <Award />,
            title: 'Reembolso Garantizado',
            description: 'Devolución del 100% en caso de denegación de visado.',
          },
        ]}
      />

      {/* Consulate & BLS Specific Notice Card */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MapPin className="size-7" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-primary-dark uppercase tracking-wider">
                  {consulate.consulateName}
                </span>
                <span className="text-xs text-text-secondary font-medium">
                  Jurisdicción: {consulate.consulateJurisdiction}
                </span>
              </div>
              <h2 className="text-h3 font-display font-bold text-text-main">
                Especificaciones de Presentación para Solicitantes en {consulate.country}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-secondary pt-2">
                <div className="flex items-start gap-2">
                  <Building2 className="size-4 shrink-0 text-primary mt-0.5" />
                  <span><strong>Sede Consular:</strong> {consulate.consulateAddress}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FileCheck className="size-4 shrink-0 text-primary mt-0.5" />
                  <span><strong>Centro de Visados:</strong> {consulate.blsCenter}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="size-4 shrink-0 text-primary mt-0.5" />
                  <span><strong>Tiempo de Cita:</strong> {consulate.appointmentLeadTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-accent mt-0.5" />
                  <span><strong>Formato Aceptado:</strong> Certificado digital firmado y sellado por ASISA / Sanitas</span>
                </div>
              </div>
              <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-text-secondary">
                {consulate.specificNotices.map((notice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent font-bold">•</span>
                    <span>{notice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Official Provider Logos */}
      <ProviderLogoBar
        eyebrow={`Aseguradoras homologadas en el Consulado de España en ${consulate.city}`}
        providers={[
          { name: 'ASISA', logoSrc: '/images/logo-asisa.png' },
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      {/* Visa Types Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Tipos de Visado</span>
            <h2 className="text-h2 font-display font-bold text-text-main">
              Trámites de Visado que Exigen Seguro Médico en {consulate.city}
            </h2>
            <p className="text-body-reg text-text-secondary">
              Nuestras pólizas están pre-configuradas para superar la revisión consular en cualquiera de estas modalidades:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consulate.visaTypes.map((visa, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="inline-block rounded-md bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5">
                    {visa.validity}
                  </span>
                  <h3 className="text-sm font-bold text-text-main leading-snug">{visa.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{visa.description}</p>
                </div>
                <button
                  onClick={handleStartQuoting}
                  className="text-xs font-bold text-primary hover:text-primary-dark text-left inline-flex items-center gap-1"
                >
                  Cotizar este visado →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Requirements Grid */}
      <CoverageGrid
        eyebrow="Exigencias Consulares Obligatorias"
        title={`Los 4 Requisitos del Seguro Médico en el Consulado de España en ${consulate.city}`}
        description={`Para que el funcionario consular o BLS en ${consulate.city} apruebe tu expediente, la póliza debe cumplir estrictamente las siguientes 4 condiciones:`}
        items={coverages}
      />

      {/* Travel vs Health Comparison */}
      <TravelVsHealthComparison
        eyebrow="Diferenciación Crítica"
        title={`¿Por Qué el Consulado en ${consulate.city} Rechaza los Seguros de Viaje?`}
        description={`Uno de los motivos más frecuentes de requerimiento o denegación en ${consulate.city} es presentar asistencias al viajero genéricas (Assist Card, seguros de tarjetas de crédito o seguros locales sin sede en España).`}
        alertNotice={`⚠️ El Consulado General de España en ${consulate.city} rechaza de forma tajante las pólizas con reembolso diferido o con tope de 30.000€.`}
        travelLabel="Seguro de Asistencia en Viaje"
        healthLabel="Seguro Médico de Salud (VitaBlue)"
        items={[
          {
            feature: 'Tipo de Cobertura',
            travel: 'Solo cubre urgencias puntuales con límite económico estricto (ej. 30.000€).',
            health: 'Cobertura médica ilimitada, especialistas, cirugías y hospitalización completa en España.',
          },
          {
            feature: 'Validez Consular',
            travel: `Rechazado sistemáticamente por el Consulado en ${consulate.city}.`,
            health: '100% homologado y aceptado bajo el Real Decreto 557/2011.',
          },
          {
            feature: 'Pago de Gastos Médicos',
            travel: 'Reembolso diferido (tienes que pagar de tu bolsillo primero).',
            health: 'Acceso directo con tarjeta médica en hospitales privados sin adelantar dinero.',
          },
          {
            feature: 'Certificado de Póliza',
            travel: 'Recibo genérico que no incluye las cláusulas obligatorias de extranjería.',
            health: 'Certificado Consular Oficial sellado y firmado por la aseguradora en 24h.',
          },
        ]}
      />

      {/* Plan Comparison Section */}
      <PlanComparisonSection
        eyebrow="Comparativa Multimarca"
        title={`Pólizas Oficiales Aceptadas en ${consulate.city}: ASISA vs Sanitas vs Adeslas`}
        description={`Comparamos las mejores aseguradoras de España para que elijas la póliza con mejor precio y emisión más rápida para tu cita consular:`}
        plans={plansList}
        onPlanAction={handleStartQuoting}
        actionLabel="Comparar y contratar"
        columns={3}
      />

      {/* Common Rejections & Solutions */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Evita Errores Frecuentes</span>
            <h2 className="text-h2 font-display font-bold text-text-main">
              Motivos de Denegación de Seguro en el Consulado de {consulate.city}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consulate.commonRejectionReasons.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">Error común #{idx + 1}</h3>
                    <p className="text-xs text-red-700 mt-1 font-medium">{item.reason}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-green-50/80 p-3.5 border border-green-200 text-xs text-green-900 flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-green-600 mt-0.5" />
                  <span><strong>Solución VitaBlue:</strong> {item.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Promotion */}
      <ProductPromotionSection
        badges={[
          <span key="1" className="inline-block rounded-full bg-accent text-primary-dark px-3 py-1 text-caption font-extrabold uppercase tracking-wider">
            {consulate.flag} Tarifas Oficiales
          </span>,
          <span key="2" className="inline-block rounded-full bg-white/20 text-white px-3 py-1 text-caption font-semibold">
            Sin Comisiones Ocultas
          </span>,
        ]}
        title={`Precios del Seguro Médico para Visado en ${consulate.country}`}
        description={`Tarifas directas de aseguradora en euros (€) con pago online seguro en tarjeta o divisa local (${consulate.priceFromLocal}):`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-white/10 p-5 border border-white/15 backdrop-blur-sm">
            <span className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider block mb-1">
              Estancias Cortas (3 a 6 meses)
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">Desde 120€ - 240€</p>
            <p className="text-xs text-slate-200 font-medium">
              Ideal para cursos de idiomas, intercambios y programas intensivos.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 border-2 border-accent/60 backdrop-blur-sm relative shadow-md">
            <span className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-1">
              Año Académico Completo (9 a 12 meses)
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">Desde 35€ / mes</p>
            <p className="text-xs text-slate-200 font-medium">
              La tarifa más contratada para grados universitarios, másteres oficiales y visados de nómada digital.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 border border-white/15 backdrop-blur-sm">
            <span className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider block mb-1">
              Mayores de 65 / Residencia No Lucrativa
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">Desde 95€ / mes</p>
            <p className="text-xs text-slate-200 font-medium">
              Pólizas especiales para jubilados y reagrupación familiar sin límite de edad.
            </p>
          </div>
        </div>
      </ProductPromotionSection>

      {/* Guaranteed Refund Section */}
      <GuaranteeRefundSection
        eyebrow="Garantía de Devolución"
        title="100% de Reembolso si tu Visado es Denegado"
        subtitle={`Presentar tu solicitud en el Consulado de España en ${consulate.city} no conlleva ningún riesgo económico.`}
        description={`Si por cualquier causa tu visado es denegado, la aseguradora te reembolsa el 100% del dinero pagado.`}
        steps={[
          { title: '1. Notificación Oficial', desc: `Envíanos la carta oficial de denegación emitida por el consulado en ${consulate.city}.` },
          { title: '2. Verificación Express', desc: 'Validamos el documento con la aseguradora en menos de 24 horas laborables.' },
          { title: '3. Reembolso del 100%', desc: 'Recibes la devolución íntegra en la misma tarjeta o cuenta de pago.' },
        ]}
      />


      {/* FAQs Section */}
      <FaqSection
        eyebrow="Dudas Frecuentes"
        title={`Preguntas Frecuentes sobre el Seguro para el Consulado de España en ${consulate.city}`}
        items={consulate.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

      {/* Advisor Final CTA */}
      <AdvisorHelpSection
        title={`¿Tienes dudas sobre los requisitos en el Consulado de ${consulate.city}?`}
        description={`Nuestros asesores expertos en extranjería revisarán tu expediente y te recomendarán la póliza homologada exacta de Asisa, Sanitas o Adeslas.`}
        whatsappUrl={whatsappHref}
      />
    </div>
  );
};

export default ConsulateVisaInsurance;
