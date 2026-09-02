import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ShieldCheck, Clock, Award, Check } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import RequirementsComparisonTable from '../../components/organisms/RequirementsComparisonTable';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import { Button } from '../../components/atoms/Button';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import { StudentIllustration, ProfileIllustration, TravelIllustration } from '../../components/illustrations';

export const ForeignerInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartWizard = (profileType: 'student' | 'expat' | 'nomad') => {
    resetWizard();
    setProfile(profileType);
    navigate('/wizard');
  };

  const profiles = [
    {
      id: 'student' as const,
      title: 'Estudiantes Internacionales',
      subtitle: 'Visado de Estudios',
      desc: 'Seguro médico completo sin copagos, sin carencias y con repatriación sanitaria incluida al 100%. Cumple los requisitos específicos para Universidades y Escuelas de Negocios.',
      link: '/productos/seguros-salud/seguros-sanitas/international-students',
      linkText: 'Explorar Requisitos de Estudios',
      illustration: StudentIllustration,
      badgeColor: 'bg-brand-cyan/10 text-brand-cyan-dark border border-brand-cyan/20'
    },
    {
      id: 'expat' as const,
      title: 'Expatriados y Residentes',
      subtitle: 'Residencia No Lucrativa & Golden Visa',
      desc: 'Cobertura médica ilimitada en España equivalente al sistema público de salud. Ideal para la obtención del NIE, Golden Visa, residencia no lucrativa o reagrupación familiar.',
      link: '/productos/seguros-salud/seguro-expatriados',
      linkText: 'Explorar Requisitos de Residencia',
      illustration: ProfileIllustration,
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20'
    },
    {
      id: 'nomad' as const,
      title: 'Nómadas Digitales',
      subtitle: 'Visado de Teletrabajo Internacional',
      desc: 'Seguro flexible que combina cobertura médica completa en España (sin copagos exigidos por ley) con asistencia médica de urgencia en tus viajes internacionales.',
      link: '/productos/seguros-salud/seguro-nomadas-digitales',
      linkText: 'Explorar Requisitos de Teletrabajo',
      illustration: TravelIllustration,
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25'
    }
  ];

  const faqs = [
    {
      q: '¿Por qué Extranjería no acepta seguros con copagos o carencias?',
      a: 'La normativa española establece que el seguro de salud privado contratado por extranjeros debe proporcionar una cobertura equivalente a las prestaciones de la Seguridad Social en España. Esto significa que el asegurado no debe abonar cargos adicionales por visitas (sin copagos) y debe tener acceso a hospitalizaciones o cirugías desde el primer día (sin carencias, salvo las preexistencias).'
    },
    {
      q: '¿Es obligatorio que la aseguradora sea española?',
      a: 'Sí. El seguro médico privado debe estar contratado con una entidad aseguradora que esté debidamente registrada y autorizada para operar en España por la Dirección General de Seguros y Fondos de Pensiones (DGSFP). Las aseguradoras extranjeras o de viaje tipo "travel insurance" no suelen ser aceptadas por las oficinas de Extranjería.'
    },
    {
      q: '¿Qué documentación exacta recibiré para mi cita de visado?',
      a: 'Una vez formalizada la póliza, te enviaremos por correo electrónico el Certificado Oficial de Cobertura en castellano, firmado digitalmente, indicando explícitamente que no tiene copagos ni carencias, y que incluye la repatriación. También recibirás las condiciones particulares del seguro.'
    },
    {
      q: '¿Cómo funciona la garantía de devolución por denegación del visado?',
      a: 'Entendemos que los trámites de visado pueden ser complejos. Adeslas y Sanitas garantizan el reembolso del 100% de la prima pagada si presentas el documento oficial de denegación del consulado de España, siempre que lo solicites antes de la fecha de efecto del seguro.'
    }
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "InsuranceAgency",
        "@id": "https://www.vitablue.es/#organization",
        "name": "VitaBlue",
        "url": "https://www.vitablue.es/",
        "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
        "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias.",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "telephone": "+34 694 58 34 52",
          "areaServed": "ES",
          "availableLanguage": ["es", "en"]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "64",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros#producto",
        "name": "Seguro de Salud para Extranjeros en España",
        "description": "Seguro médico completo sin copagos y sin carencias homologado para visados de extranjería en España.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "provider": {
          "@id": "https://www.vitablue.es/#organization"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://www.vitablue.es"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Seguros de Salud",
            "item": "https://www.vitablue.es/productos/seguros-salud"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Seguro para Extranjeros"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué documentación exacta recibiré para mi cita de visado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Una vez formalizada la póliza, te enviaremos por correo electrónico el Certificado Oficial de Cobertura en castellano, firmado digitalmente, indicando explícitamente que no tiene copagos ni carencias, y que incluye la repatriación. También recibirás las condiciones particulares del seguro."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo funciona la garantía de devolución por denegación del visado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Entendemos que los trámites de visado pueden ser complejos. Adeslas y Sanitas garantizan el reembolso del 100% de la prima pagada si presentas el documento oficial de denegación del consulado de España, siempre que lo solicites antes de la fecha de efecto del seguro."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Seguro de Salud para Extranjeros en España | Visados | VitaBlue</title>
        <meta name="description" content="Compara seguros médicos para extranjeros en España. Pólizas homologadas sin copagos para visado de estudiantes, nómadas digitales y expatriados." />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seguro de Salud para Extranjeros en España | Visados | VitaBlue" />
        <meta property="og:description" content="Compara seguros médicos para extranjeros en España. Pólizas homologadas sin copagos para visado de estudiantes, nómadas digitales y expatriados." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seguro de Salud para Extranjeros en España | Visados | VitaBlue" />
        <meta name="twitter:description" content="Compara seguros médicos para extranjeros en España. Pólizas homologadas sin copagos para visado de estudiantes, nómadas digitales y expatriados." />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Seguro para Extranjeros', href: '/productos/seguros-salud/seguro-salud-extranjeros' }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl flex flex-col gap-5">
            <span className="text-xs font-black uppercase tracking-wider text-brand-cyan">Trámites de Extranjería & Consulados</span>
            <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
              Seguros de salud para extranjeros en España
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              Selecciona tu perfil de residencia o visado y descubre las pólizas oficiales (Adeslas y Sanitas) aprobadas al 100% por consulados y oficinas de Extranjería.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Selector Cards */}
      <section className="py-16 max-w-6xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid gap-8 md:grid-cols-3">
          {profiles.map((profile) => {
            const Illustration = profile.illustration;
            return (
              <div 
                key={profile.id} 
                className="flex flex-col justify-between rounded-3xl border border-slate-150 p-6 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] text-left"
              >
                <div>
                  {/* Illustration Container */}
                  <div className="w-full aspect-[16/10] flex items-center justify-center bg-slate-50/50 rounded-2xl p-4 overflow-hidden mb-6 border border-slate-100 relative">
                    <div className="w-full h-full max-h-[145px] text-primary">
                      <Illustration />
                    </div>
                  </div>

                  {/* Info Block */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${profile.badgeColor}`}>
                        {profile.subtitle}
                      </span>
                    </div>
                    <h3 className="text-h2 font-display font-black text-text-main leading-snug">
                      {profile.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed font-semibold">
                      {profile.desc}
                    </p>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="pt-8 flex flex-col gap-4">
                  {/* Clean text link with expandible underline micro-animation */}
                  <Link 
                    to={profile.link} 
                    className="inline-flex items-center justify-center text-sm font-bold text-primary hover:text-primary-dark transition-colors duration-150 gap-1 pb-1 relative group self-center"
                  >
                    <span>{profile.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-primary shrink-0" />
                    {/* Sliding underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>

                  {/* Brand yellow CTA */}
                  <Button 
                    variant="accent" 
                    className="w-full font-bold shadow-md shadow-accent/15" 
                    onClick={() => handleStartWizard(profile.id)}
                  >
                    Calcular Tarifas Online
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: 'Homologación Oficial', description: 'Válido para Extranjería y todos los consulados de España.' },
        { icon: <Clock />, title: 'Gestión en 24 Horas', description: 'Emitimos las pólizas y el certificado oficial en 24h.' },
        { icon: <Award />, title: 'Compromiso de Devolución', description: 'Reembolso del 100% de la prima en caso de denegación.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradoras oficiales homologadas para visado español"
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      {/* Visa Requirements Comparative Table */}
      <section className="py-16 sm:py-20 w-full max-w-5xl mx-auto px-6 sm:px-8 text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Comparativa de Requisitos</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            ¿Qué exige Extranjería para cada perfil?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Los consulados y delegaciones de gobierno son muy estrictos con las pólizas médicas. Compara de un vistazo las directrices legales.
          </p>
        </div>

        <RequirementsComparisonTable
          className="border-slate-150 bg-white"
          tableClassName="w-full text-left border-collapse"
          headClassName=""
          bodyClassName="divide-y divide-slate-150 text-sm font-semibold text-text-main"
          columns={[
            { key: 'criterion', label: 'Criterio Legal', className: 'p-5 text-xs font-black text-text-secondary uppercase tracking-wider bg-slate-50/80 border-b border-slate-150' },
            { key: 'students', label: 'Estudiantes', className: 'p-5 text-xs font-black text-text-secondary uppercase tracking-wider bg-slate-50/80 border-b border-slate-150' },
            { key: 'expats', label: 'Expatriados / Residentes', className: 'p-5 text-xs font-black text-text-secondary uppercase tracking-wider bg-slate-50/80 border-b border-slate-150' },
            { key: 'nomads', label: 'Nómadas Digitales', className: 'p-5 text-xs font-black text-text-secondary uppercase tracking-wider bg-slate-50/80 border-b border-slate-150' },
          ]}
          rows={[
            { key: 'main-process', cells: [<span className="p-5 font-bold text-text-secondary">Trámite Principal</span>, <span className="p-5">Visado de Estudios / Estancia</span>, <span className="p-5">Residencia No Lucrativa / Golden Visa</span>, <span className="p-5">Visado de Teletrabajo Internacional</span>] },
            { key: 'copays', cells: [<span className="p-5 font-bold text-text-secondary">Copagos y Franquicias</span>, <span className="p-5 text-primary flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin copagos (Todo incluido)</span>, <span className="p-5 text-primary"><span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin copagos (Todo incluido)</span></span>, <span className="p-5 text-primary"><span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin copagos (Todo incluido)</span></span>] },
            { key: 'waiting-periods', cells: [<span className="p-5 font-bold text-text-secondary">Carencias de Servicio</span>, <span className="p-5 text-primary flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin carencias (Día 1)</span>, <span className="p-5 text-primary"><span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin carencias (Día 1)</span></span>, <span className="p-5 text-primary"><span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Sin carencias (Día 1)</span></span>] },
            { key: 'repatriation', cells: [<span className="p-5 font-bold text-text-secondary">Repatriación Sanitaria</span>, <span className="p-5 text-primary font-bold">Obligatoria e Incluida</span>, <span className="p-5 text-text-secondary font-medium">No obligatoria (Recomendada)</span>, <span className="p-5 text-text-secondary font-medium">No obligatoria (Recomendada)</span>] },
            { key: 'key-requirement', cells: [<span className="p-5 font-bold text-text-secondary">Requisito Clave</span>, <span className="p-5">Matrícula en centro autorizado</span>, <span className="p-5">Fondos &gt; 28.800€/año o inversión</span>, <span className="p-5">Ingresos remotos &gt; 2.600€/mes</span>] },
          ]}
        />
      </section>

      <FaqSection eyebrow="Preguntas y Respuestas" title="Dudas sobre el seguro médico para extranjeros" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿No estás seguro de qué visado te corresponde?"
        description="Nuestros asesores senior en extranjería te atenderán directamente por WhatsApp o llamada gratuita para guiarte en los requisitos específicos del consulado de tu país de origen."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20Extranjeros."
      />
    </div>
  );
};

export default ForeignerInsurance;
