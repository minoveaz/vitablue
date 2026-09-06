import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Award, Smartphone } from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import AsisaTrustSection from '../../components/organisms/AsisaTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductPromotionSection from '../../components/organisms/ProductPromotionSection';
import DigitalServicesSection from '../../components/organisms/DigitalServicesSection';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';
import {
  HealthIllustration,
  MedicalAttentionIllustration,
  DentalIllustration,
  PreventionIllustration,
  TravelIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaCompleta: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard?flow=health&insurer=asisa');
  };

  const coverages = [
    {
      title: 'Hospitalización y Cirugías Ilimitadas',
      desc: 'Habitación individual con cama de acompañante (excepto UCI), intervenciones quirúrgicas y tratamientos en la red de hospitales del Grupo HLA.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Cuadro Médico con 40.000+ Especialistas',
      desc: 'Consultas directas sin listas de espera en cardiología, traumatología, ginecología, dermatología, oncología y medicina general.',
      illustration: HealthIllustration
    },
    {
      title: 'Pruebas Diagnósticas Avanzadas',
      desc: 'Acceso a resonancias magnéticas, TAC, endoscopias, ecografías y analíticas clínicas completas en centros de referencia.',
      illustration: PreventionIllustration
    },
    {
      title: 'Urgencias 24 Horas y Telemedicina',
      desc: 'Atención médica urgente ambulatoria y hospitalaria en clínicas concertadas y videoconsultas médicas inmediatas con AsisaLIVE.',
      illustration: FamilyIllustration
    },
    {
      title: 'Seguro Dental Asisa Incluido',
      desc: 'Más de 50 servicios odontológicos gratuitos: limpiezas dentales anuales, radiografías, consultas urgentes y descuentos en ortodoncia.',
      illustration: DentalIllustration
    },
    {
      title: 'Asistencia en Viajes Internacionales',
      desc: 'Cobertura médica de urgencias en el extranjero hasta 14.000€ al año por asegurado para viajes de hasta 90 días por salida.',
      illustration: TravelIllustration
    }
  ];

  const modalitiesList = [
    {
      name: 'ASISA Completa +',
      subtitle: 'Copagos Reducidos (Más Elegido)',
      desc: 'El mejor equilibrio entre una cuota mensual económica y copagos muy bajos (de 2,50€ a 5€ por consulta). Hospitalización y cirugías sin copago.',
      priceDetail: 'Desde 24,90€/mes + copago bajo',
      tag: 'Más Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Completa ++',
      subtitle: 'Máxima Economía Mensual',
      desc: 'Prima mensual muy reducida para quienes utilizan el seguro de forma puntual pero desean cobertura total de hospitalización y cirugías.',
      priceDetail: 'Desde 19,90€/mes + copago medio',
      tag: 'Económico',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    },
    {
      name: 'ASISA Completa Sin Copago',
      subtitle: 'Cuota Fija Total',
      desc: 'Pagas una cuota mensual fija y disfrutas de acceso ilimitado a médicos, consultas, pruebas y hospitalización sin coste adicional.',
      priceDetail: 'Desde 39,90€/mes (Copago 0€)',
      tag: 'Tranquilidad Total',
      badgeColor: 'bg-slate-100 text-text-main border border-slate-200',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'Francisco J.',
      meta: 'Asegurado ASISA Completa + (Madrid)',
      comment: 'Llevamos 3 años con Asisa Completa para toda la familia. Acudimos al Hospital Universitario Moncloa y la rapidez y el trato del cuadro médico son excepcionales.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Elena B.',
      meta: 'Asegurada ASISA Completa ++ (Sevilla)',
      comment: 'Elegí la modalidad Completa ++ porque casi nunca voy al médico pero quería estar protegida ante cualquier operación o ingreso. Pago muy poco al mes y estoy tranquila.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Marcos R.',
      meta: 'AsisaLIVE y Especialistas (Alicante)',
      comment: 'La app AsisaLIVE funciona fenomenal. He tenido consultas de dermatología y medicina general en menos de 5 minutos desde el trabajo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Qué diferencia hay entre ASISA Completa + y Completa ++?',
      a: 'La diferencia principal está en la prima mensual y el importe del copago. En ASISA Completa + la cuota mensual es ligeramente superior pero los copagos son mínimos (de 2,50€ a 5€). En ASISA Completa ++ la cuota mensual es muy reducida (desde 19,90€) a cambio de copagos medios por consulta médica y pruebas diagnósticas.'
    },
    {
      q: '¿Tiene periodos de carencia ASISA Completa?',
      a: 'Las consultas de especialistas, medicina general, urgencias y analíticas básicas están cubiertas desde el primer día. Coberturas complejas como hospitalizaciones programadas o intervenciones quirúrgicas tienen una carencia habitual de 6 a 8 meses. Si vienes de otra aseguradora con más de 1 año de antigüedad, Asisa elimina la mayoría de carencias.'
    },
    {
      q: '¿Qué hospitales tengo incluidos con esta póliza?',
      a: 'Accedes a toda la red propia de hospitales y clínicas del Grupo HLA (18 hospitales y 36 centros en España) y a cientos de hospitales concertados de primer nivel en todo el país.'
    },
    {
      q: '¿Incluye cobertura dental?',
      a: 'Sí, ASISA Dental viene integrada en la póliza e incluye revisiones anuales, extracciones simples, radiografías y limpiezas sin coste adicional, además de tarifas franquiciadas reducidas en tratamientos de ortodoncia e implantología.'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/';
  const title = 'ASISA Completa + | Seguro Médico Integral con Hospitalización | VitaBlue';
  const description = 'Descubre ASISA Completa + y ++: seguro de salud con hospitalización, 40.000 médicos, red hospitalaria Grupo HLA y telemedicina AsisaLIVE 24/7.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: 'Asesoría independiente autorizada de seguros médicos Asisa en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Completa +',
        description: 'Seguro médico integral con hospitalización médica y quirúrgica, cuadro médico del Grupo HLA y telemedicina AsisaLIVE.',
        brand: {
          '@type': 'Brand',
          name: 'ASISA'
        },
        provider: {
          '@id': 'https://www.vitablue.es/#organization'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: 'https://www.vitablue.es/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Seguros de Salud',
            item: 'https://www.vitablue.es/productos/seguros-salud/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Seguros Asisa',
            item: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'ASISA Completa',
            item: canonicalUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <ProductBreadcrumbBar
        items={[
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Completa', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={[
          { label: 'Cuadro Médico Integral HLA', tone: 'brand' },
          { label: 'Hospitalización y Cirugías', tone: 'accent' },
          { label: 'IPID AFR01S0015' }
        ]}
        title="ASISA Completa: Asistencia Sanitaria Integral con Hospitalización"
        description="El seguro de salud más completo de Asisa. Acceso ilimitado a más de 40.000 profesionales médicos, 18 hospitales del Grupo HLA, telemedicina AsisaLIVE y dental incluido."
        primaryAction={{
          label: 'Calcular mi Cuota',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: 'Asesoría por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-COMPLETA' })
        }}
      >
        <QuoteEstimator
          title="Cotizador ASISA Completa"
          description="Calcula tu tarifa estimada según edad y modalidad de copago."
          initialAge={32}
          minAge={18}
          maxAge={65}
          options={[
            { id: 'completa-plus', label: 'Completa + (Copago Bajo)' },
            { id: 'completa-plus-plus', label: 'Completa ++ (Económico)' },
            { id: 'sin-copago', label: 'Sin Copago (Cuota Fija)' }
          ]}
          calculatePrice={(age, option) => {
            if (option === 'completa-plus-plus') {
              if (age <= 30) return '19.90';
              if (age <= 45) return '25.50';
              if (age <= 60) return '34.90';
              return 'Consultar';
            }
            if (option === 'completa-plus') {
              if (age <= 30) return '24.90';
              if (age <= 45) return '31.20';
              if (age <= 60) return '42.50';
              return 'Consultar';
            }
            if (age <= 30) return '39.90';
            if (age <= 45) return '48.90';
            if (age <= 60) return '65.00';
            return 'Consultar';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={[
          { icon: <ShieldCheck />, title: 'Red HLA Propia', description: 'Acceso directo y preferente a 18 hospitales de primer nivel.' },
          { icon: <Clock />, title: 'Sin Carencias de Urgencias', description: 'Atención urgente y consultas médicas cubiertas desde el día 1.' },
          { icon: <Award />, title: 'Dental Incluido de Serie', description: 'Limpiezas, revisiones y urgencias odontológicas sin coste extra.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow="Aseguradora oficial"
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow="Modalidades Disponibles"
        title="Elige tu nivel de copago según la frecuencia de uso médico"
        description="Tres modalidades con la misma calidad de cuadro médico y hospitalización."
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel="Calcular esta opción"
      />

      <CoverageGrid
        eyebrow="Garantías Médicas del Plan"
        title="Todo lo que incluye ASISA Completa"
        description="Especificaciones técnicas y coberturas médicas según los IPID oficiales AFR01S0015 y AFR01S0080."
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow="Proceso Digital"
        title="Contrata tu seguro médico en 4 sencillos pasos"
        description="Sin papeleos físicos, con soporte continuo de nuestros asesores en VitaBlue."
        steps={[
          {
            title: 'Cotiza tu seguro',
            description: 'Indica las edades de los asegurados y elige la modalidad de copago que prefieras.'
          },
          {
            title: 'Revisa tu presupuesto',
            description: 'Te mostramos la prima oficial de Asisa con todas las promociones y descuentos aplicados.'
          },
          {
            title: 'Cuestionario de salud online',
            description: 'Responde un breve cuestionario digital para dar de alta la póliza sin desplazamientos.'
          },
          {
            title: 'Comienza a disfrutarlo',
            description: 'Recibe tu número de póliza y tarjetas digitales en la app AsisaLIVE para acudir al médico.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow="Opiniones Reales"
        title="Familias y particulares protegidos con ASISA Completa"
        items={testimonials}
      />

      <AsisaTrustSection />

      <DigitalServicesSection
        eyebrow="Medicina Digital"
        title="AsisaLIVE: tu médico en la palma de tu mano"
        description="Ahorra tiempo y evita desplazamientos innecesarios con la plataforma de telemedicina oficial de Asisa."
        benefits={[
          'Videoconsultas inmediatas de medicina general 24/7',
          'Receta médica electrónica válida en farmacias de toda España',
          'Especialistas en pediatría, ginecología y nutrición',
          'Gestión ágil de volantes y autorizaciones médicas'
        ]}
        visual={
          <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
            <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-display font-black leading-snug">AsisaLIVE App</h4>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Videoconsulta</span>
                  <p className="text-xs font-bold leading-tight">Médico de Guardia 24h</p>
                  <p className="text-[9px] text-slate-200">Espera media: &lt; 3 minutos</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Tarjeta Digital</span>
                  <p className="text-xs font-bold leading-tight">Acceso a Clínicas HLA</p>
                  <p className="text-[9px] text-slate-200">Disponible en Wallet</p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                18 Hospitales Propios • Grupo HLA
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={[
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Promoción Oficial</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Nuevos Asegurados</span>
        ]}
        title="Asisa Dental y AsisaLIVE Gratis de Serie"
        description="Al contratar ASISA Completa a través de VitaBlue, disfrutas del módulo dental completo y de la telemedicina AsisaLIVE incluidos sin sobrecoste en tu mensualidad."
      />

      <FaqSection
        eyebrow="Preguntas Frecuentes"
        title="Resolvemos tus dudas sobre ASISA Completa"
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title="¿Dudas entre copago bajo o cuota sin copagos?"
        description="Nuestros asesores de salud en VitaBlue analizan tu historial y el de tu familia para recomendarte la opción con mayor ahorro anual real."
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-COMPLETA-HELP' })}
      />
    </div>
  );
};

export default AsisaCompleta;
