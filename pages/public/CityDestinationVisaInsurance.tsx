import React, { useState } from 'react';
import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { 
  ShieldCheck, 
  Clock, 
  Award, 
  MapPin, 
  Building2, 
  GraduationCap, 
  PhoneCall, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';
import CoverageGrid from '@/components/organisms/CoverageGrid';
import GuaranteeRefundSection from '@/components/organisms/GuaranteeRefundSection';
import FaqSection from '@/components/organisms/FaqSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import QuoteEstimator from '@/components/molecules/QuoteEstimator';
import { getDestinationCityBySlug } from '@/utils/destinationCitiesData';
import {
  HealthIllustration,
  PreventionIllustration,
  MedicalAttentionIllustration,
  TravelIllustration,
} from '@/components/illustrations';
import { buildAttributedWhatsAppUrl } from '@/utils/analytics';
import { useWizard } from '@/context/WizardContext';

export const CityDestinationVisaInsurance: React.FC = () => {
  const { city: cityParam, slug: slugParam } = useParams<{ city?: string; slug?: string }>();
  const location = useLocation();
  const { setProfile, setVisaRequired, resetWizard } = useWizard();
  const [selectedInsurerFilter, setSelectedInsurerFilter] = useState<string>('all');

  const pathnameSlug = location.pathname.split('/').filter(Boolean).pop() || '';
  const citySlug = cityParam || slugParam || pathnameSlug;
  const city = getDestinationCityBySlug(citySlug);

  if (!city) {
    return <Navigate to="/productos/seguros-salud/seguro-medico-estudiantes" replace />;
  }


  const canonicalUrl = `https://www.vitablue.es${city.canonicalPath}`;

  const trustBarItems = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Póliza 100% Homologada',
      description: `Sin copagos, sin carencias y válida para la Oficina de Extranjería de ${city.name}.`,
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: 'Certificado en Menos de 24h',
      description: 'Documento oficial en PDF con firma electrónica y código de verificación CSV.',
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: 'Garantía 100% de Devolución',
      description: 'Reembolso total garantizado en caso de denegación consular oficial.',
    },
  ];

  const legalPillars = [
    {
      title: '1. Red Hospitalaria en ' + city.name,
      description: `Acceso preferente directo a los mejores centros privados de ${city.name} (HLA, Sanitas, Quirónsalud) sin adelantar dinero.`,
      illustration: HealthIllustration,
    },
    {
      title: '2. Cero Copagos (0€)',
      description: 'Sin tarifas ni cobros adicionales por acudir a consultas médicas, especialistas, analíticas o urgencias.',
      illustration: PreventionIllustration,
    },
    {
      title: '3. Sin Periodos de Carencia',
      description: 'Todas las coberturas hospitalarias y quirúrgicas están plenamente activas desde tu primer día en España.',
      illustration: MedicalAttentionIllustration,
    },
    {
      title: '4. Repatriación Sanitaria y Funeraria',
      description: 'Traslado médico de emergencia y cobertura completa de repatriación de restos mortales al país de origen.',
      illustration: TravelIllustration,
    },
  ];

  const calculateEstimate = (age: number, option: string) => {
    let base = 35;
    if (option === 'sanitas') base = 45;
    if (option === 'adeslas') base = 49;
    if (age > 30) base += Math.floor((age - 30) * 0.7);
    return `${base} € / mes`;
  };

  const handleStartQuote = () => {
    resetWizard();
    setProfile('student');
    setVisaRequired('yes');
  };

  const filteredHospitals = selectedInsurerFilter === 'all'
    ? city.hospitals
    : city.hospitals.filter((h) => h.insurer === selectedInsurerFilter || h.insurer === 'Multimarca');

  const whatsappUrl = buildAttributedWhatsAppUrl(
    `Hola! Me traslado a estudiar/trabajar en ${city.name} y necesito cotizar un seguro médico sin copagos para mi visado/TIE.`,
    `ciudad_${city.slug}`
  );

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalBusiness',
        name: `Seguro Médico para Visado y Estudiantes en ${city.name} - VitaBlue`,
        url: canonicalUrl,
        image: 'https://www.vitablue.es/vitablue_logo_social.jpg',
        description: city.metaDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city.name,
          addressRegion: city.region,
          addressCountry: 'ES',
        },
        priceRange: '€€',
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
            name: 'Seguro Estudiantes',
            item: 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: city.name,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: city.faqs.map((faq) => ({
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
        <title>{city.metaTitle}</title>
        <meta name="description" content={city.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={city.metaTitle} />
        <meta property="og:description" content={city.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={city.metaTitle} />
        <meta name="twitter:description" content={city.metaDescription} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <ProductBreadcrumbBar
        items={[
          { label: 'Inicio', href: '/' },
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguro Estudiantes', href: '/productos/seguros-salud/seguro-medico-estudiantes' },
          { label: city.name, href: city.canonicalPath },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-dark via-primary to-primary-dark text-white py-14 sm:py-20 px-4 sm:px-6 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-cyan/20 px-4 py-1.5 text-xs font-black text-brand-cyan border border-brand-cyan/30 uppercase tracking-widest">
            <MapPin className="h-4 w-4" />
            Destino Universitario & Expat: {city.name} ({city.region})
          </div>
          <h1 className="text-h1 font-display font-black tracking-tight text-white">
            {city.heroTitle}
          </h1>
          <p className="text-body-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            {city.heroSubtitle}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/wizard"
              onClick={handleStartQuote}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-bold text-primary-dark shadow-xl shadow-accent/20 hover:brightness-105 transition-all"
            >
              Calcular Seguro para {city.name} (Desde 35€/mes)
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Official VitaBlue Trust Bar */}
      <ProductTrustBar items={trustBarItems} />

      {/* Main Content Layout with Quote Estimator and Hospital Directory */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hospital Network & Universities */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                Red Hospitalaria de Referencia
              </span>
              <h2 className="text-h2 font-display font-black text-text-main mt-1">
                Hospitales y Clínicas Concertadas en {city.name}
              </h2>
              <p className="text-body-reg text-text-secondary mt-2 font-medium leading-relaxed">
                Todas nuestras pólizas te permiten acudir directamente a urgencias y especialistas en los centros privados de mayor reputación médica de {city.name}:
              </p>
            </div>

            {/* Insurer Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'all', label: 'Todos los Centros' },
                { id: 'ASISA', label: '🏥 ASISA (HLA)' },
                { id: 'Sanitas', label: '💙 Sanitas (CIMA/La Moraleja)' },
                { id: 'Adeslas', label: '🛡️ Adeslas (Quirónsalud/Ruber)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedInsurerFilter(filter.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    selectedInsurerFilter === filter.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Hospital Cards List */}
            <div className="space-y-4">
              {filteredHospitals.map((hosp, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all text-left space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-1 ${
                        hosp.insurer === 'ASISA' 
                          ? 'bg-sky-100 text-sky-800' 
                          : hosp.insurer === 'Sanitas' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {hosp.insurer}
                      </span>
                      <h3 className="text-base sm:text-lg font-display font-black text-text-main">
                        {hosp.name}
                      </h3>
                    </div>
                    {hosp.hasEmergency24h && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-800">
                        <AlertCircle className="w-3 h-3" /> Urgencias 24h
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-secondary leading-relaxed">
                    {hosp.highlight}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-text-secondary">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {hosp.address} ({hosp.zone})
                    </span>
                    {hosp.englishSupport && (
                      <span className="text-emerald-700 font-bold">🇬🇧 English Support</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Universities in the City */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200/60 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                Universidades y Escuelas de Negocios en {city.name}
              </div>
              <h3 className="text-h3 font-display font-black text-text-main">
                Seguro Aceptado para Matrícula y Admisión
              </h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Nuestros certificados oficiales son validados directamente por las secretarías de alumnos y relaciones internacionales de:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {city.universities.map((uni, idx) => (
                  <div key={idx} className="rounded-xl bg-white border border-slate-200/80 p-3 text-left">
                    <span className="block text-xs font-black text-primary">{uni.shortName}</span>
                    <span className="block text-[11px] font-medium text-text-secondary leading-tight mt-0.5">
                      {uni.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TIE Office & Registration Tips */}
            <div className="rounded-3xl bg-primary/5 border border-primary/20 p-6 sm:p-8 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Trámite de Residencia y TIE en {city.name}
              </span>
              <h3 className="text-h3 font-display font-black text-text-main">
                Oficina de Extranjería y Toma de Huellas
              </h3>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                📍 <strong>Sede Oficial:</strong> {city.tieOfficeInfo.address} ({city.tieOfficeInfo.neighborhood}).
              </p>
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                💡 <strong>Consejo para tu cita:</strong> {city.tieOfficeInfo.tips}
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Quote Estimator */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <QuoteEstimator
              title={`Tarificador de Seguro para ${city.name}`}
              description="Calcula tu precio mensual garantizado según tu edad y aseguradora:"
              initialAge={24}
              options={[
                { id: 'asisa', label: '🏥 ASISA (35€)' },
                { id: 'sanitas', label: '💙 Sanitas (45€)' },
                { id: 'adeslas', label: '🛡️ Adeslas (49€)' },
              ]}
              calculatePrice={calculateEstimate}
              submitLabel={`Contratar Seguro en ${city.name}`}
              onSubmit={handleStartQuote}
            />

            {/* Quick WhatsApp Help Box */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 text-left flex items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950">
                  ¿Prefieres asesoría personalizada?
                </h4>
                <p className="text-xs text-emerald-800 font-medium mt-0.5">
                  Un asesor te ayuda a elegir el hospital más cercano a tu piso o universidad en {city.name}.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Consular Validator Callout Banner */}
      <section className="py-8 px-4 sm:px-6 md:px-8 bg-slate-50 border-y border-slate-150">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-primary-dark via-primary to-primary-dark p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 text-xs font-bold text-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              Herramienta Gratuita
            </span>
            <h3 className="text-h3 font-display font-black text-white">
              ¿Dudas si tu seguro actual es válido para {city.name}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xl">
              Comprueba gratis en 30 segundos si tu póliza cumple con los 4 pilares obligatorios de Extranjería antes de acudir a tu cita.
            </p>
          </div>
          <Link
            to="/validador-visado"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-primary-dark shadow-md shadow-accent/20 hover:brightness-105 transition-all text-center whitespace-nowrap"
          >
            Abrir Validador Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4 Legal Pillars with Official VitaBlue Illustrations (2x2 Grid) */}
      <CoverageGrid
        eyebrow="Garantías Contractuales"
        title={`Cobertura Integral para Estudiar y Vivir en ${city.name}`}
        description={`Todas las pólizas de VitaBlue en ${city.name} incluyen asistencia médica ilimitada, hospitalización privada y repatriación sin copagos:`}
        items={legalPillars}
        columns={2}
      />

      {/* Guaranteed Refund Section */}
      <GuaranteeRefundSection
        eyebrow="Sin Riesgo Económico"
        title="100% de Reembolso si tu Visado es Denegado"
        subtitle={`Contrata tu seguro médico para ${city.name} con total tranquilidad.`}
        description={`Si por cualquier motivo de fuerza mayor tu visado o autorización de estancia es denegada oficialmente, te devolvemos el 100% del dinero pagado.`}
        steps={[
          { title: '1. Notificación Oficial', desc: 'Presenta la carta formal emitida por el consulado o Extranjería.' },
          { title: '2. Validación Express', desc: 'Validamos el trámite con la aseguradora en menos de 24h.' },
          { title: '3. Reembolso Íntegro', desc: 'Recibes la devolución completa en tu cuenta o tarjeta bancaria.' },
        ]}
      />

      {/* FAQs Section */}
      <FaqSection
        eyebrow="Dudas Frecuentes"
        title={`Preguntas Frecuentes sobre el Seguro Médico en ${city.name}`}
        items={city.faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

      {/* Advisor Help Section */}
      <AdvisorHelpSection
        title={`¿Necesitas asesoría para tu estancia en ${city.name}?`}
        description={`Nuestros especialistas te asesoran gratis para elegir la póliza que mejor se adapta a tu facultad o lugar de residencia en ${city.name}.`}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
};

export default CityDestinationVisaInsurance;
