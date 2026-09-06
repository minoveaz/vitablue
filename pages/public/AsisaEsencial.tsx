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
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaEsencial: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard?flow=health&insurer=asisa&plan=esencial');
  };

  const coverages = [
    {
      title: 'Consultas con Especialistas Sin Esperas',
      desc: 'Acceso directo a más de 40.000 profesionales: dermatología, ginecología, traumatología, oftalmología, urología y medicina general.',
      illustration: HealthIllustration
    },
    {
      title: 'Pruebas Diagnósticas y Análisis',
      desc: 'Ecografías, radiografías simples, análisis de sangre y orina, citologías y electrocardiogramas en centros concertados y clínicas HLA.',
      illustration: PreventionIllustration
    },
    {
      title: 'Medicina General y Pediatría',
      desc: 'Atención primaria rápida para adultos y niños sin listas de espera de la sanidad pública, con libertad de elección de médico.',
      illustration: FamilyIllustration
    },
    {
      title: 'Urgencias Ambulatorias y AsisaLIVE',
      desc: 'Atención de urgencias médicas en centros concertados y videoconsultas médicas inmediatas las 24 horas del día desde el smartphone.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Cobertura Dental Asisa Incluida',
      desc: 'Revisiones periódicas gratuitas, limpiezas de boca anuales, radiografías odontológicas y tarifas con descuento en toda la red dental.',
      illustration: DentalIllustration
    },
    {
      title: 'Sin Hospitalización = Máximo Ahorro',
      desc: 'Al prescindir de la cobertura de ingreso hospitalario e intervenciones quirúrgicas complejas, la prima mensual es sumamente económica.',
      illustration: PreventionIllustration
    }
  ];

  const modalitiesList = [
    {
      name: 'ASISA Esencial Sin Copago',
      subtitle: 'Cuota Fija Ambulatoria',
      desc: 'Disfruta de consultas y pruebas diagnósticas con especialistas sin pagar nada adicional por cada acto médico. Máxima previsibilidad.',
      priceDetail: 'Desde 18,90€/mes (Copago 0€)',
      tag: 'Más Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Esencial +',
      subtitle: 'Copagos Reducidos',
      desc: 'Cuota mensual aún más baja con un pequeño copago por consulta (de 3€ a 6€). Ideal para personas que acuden al médico pocas veces al año.',
      priceDetail: 'Desde 13,90€/mes + copago bajo',
      tag: 'Ahorro Máximo',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'Lucía M.',
      meta: 'Asegurada ASISA Esencial (Madrid)',
      comment: 'Buscaba un seguro que me permitiera ir al dermatólogo y al ginecólogo rápidamente sin tener que pagar un pastizal por la hospitalización. Es justo lo que necesitaba.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos T.',
      meta: 'Asegurado ASISA Esencial + (Valencia)',
      comment: 'Por menos de 15€ al mes tengo especialistas privados cuando los necesito. La relación calidad-precio es imbatible.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Paula S.',
      meta: 'AsisaLIVE y Pediatría (Zaragoza)',
      comment: 'Para consultas rutinarias con mi hijo pequeño y videoconsultas de noche o fines de semana ha sido una bendición. Súper recomendable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Qué cubre exactamente ASISA Esencial?',
      a: 'Cubre todas las consultas de medicina general, pediatría y especialidades médicas (ginecología, dermatología, traumatología, etc.), así como pruebas diagnósticas ambulatorias (análisis, ecografías, radiografías) y urgencias en centros médicos. No incluye hospitalización ni cirugías mayores.'
    },
    {
      q: '¿Para quién está recomendado este seguro?',
      a: 'Es perfecto para personas que ya cuentan con cobertura pública o que no desean pagar por hospitalización, pero quieren evitar las listas de espera de la Seguridad Social para visitar especialistas y hacerse chequeos médicos rápidos.'
    },
    {
      q: '¿Es válido este seguro para solicitar visados de extranjería en España?',
      a: 'No. Las oficinas de Extranjería y Consulados de España exigen obligatoriamente una póliza que incluya hospitalización y cirugías sin copagos (como ASISA Health Students o ASISA Health Residents).'
    },
    {
      q: '¿Tiene periodos de carencia ASISA Esencial?',
      a: 'La medicina general, especialistas y pruebas básicas no tienen periodos de carencia; se pueden utilizar desde el primer día en que entra en vigor la póliza.'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/';
  const title = 'ASISA Esencial | Seguro Médico Sin Hospitalización | VitaBlue';
  const description = 'Seguro de salud ambulatorio ASISA Esencial y Esencial +: especialistas, pruebas diagnósticas y telemedicina sin listas de espera desde 13,90€/mes.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: 'Asesoría independiente de seguros médicos de salud en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Esencial',
        description: 'Seguro médico ambulatorio con especialistas, pruebas diagnósticas y telemedicina sin hospitalización.',
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
            name: 'ASISA Esencial',
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
          { label: 'ASISA Esencial', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={[
          { label: 'Especialistas Sin Esperas', tone: 'brand' },
          { label: 'Cuota Económica', tone: 'accent' },
          { label: 'IPID AFR01S0071' }
        ]}
        title="ASISA Esencial: Acceso Rápido a Especialistas al Mejor Precio"
        description="Póliza médica ambulatoria sin hospitalización. Visita dermatólogos, traumatólogos, ginecólogos y realiza pruebas diagnósticas sin esperas desde 13,90€/mes."
        primaryAction={{
          label: 'Calcular ASISA Esencial',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: 'Preguntar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-ESENCIAL' })
        }}
      >
        <QuoteEstimator
          title="Cotizador ASISA Esencial"
          description="Calcula tu tarifa mensual aproximada según tu edad."
          initialAge={28}
          minAge={18}
          maxAge={65}
          options={[
            { id: 'sin-copago', label: 'Esencial Sin Copago' },
            { id: 'con-copago', label: 'Esencial + (Copago Bajo)' }
          ]}
          calculatePrice={(age, option) => {
            if (option === 'con-copago') {
              if (age <= 30) return '13.90';
              if (age <= 45) return '16.50';
              if (age <= 60) return '21.90';
              return 'Consultar';
            }
            if (age <= 30) return '18.90';
            if (age <= 45) return '23.50';
            if (age <= 60) return '29.90';
            return 'Consultar';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={[
          { icon: <ShieldCheck />, title: '40.000 Médicos Concertados', description: 'Libertad para elegir especialista en toda España.' },
          { icon: <Clock />, title: 'Sin Listas de Espera', description: 'Citas directas con médicos y pruebas clínicas rápidas.' },
          { icon: <Award />, title: 'Dental Básico Incluido', description: 'Limpiezas de boca y revisiones anuales sin sobrecoste.' }
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
        eyebrow="Modalidades Ambulatorias"
        title="Elige tu combinación perfecta entre cuota y copago"
        description="Ambas modalidades incluyen acceso al mismo cuadro médico y servicios de AsisaLIVE."
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel="Seleccionar modalidad"
      />

      <CoverageGrid
        eyebrow="Garantías Médicas"
        title="Coberturas extrahospitalarias incluidas"
        description="Especificaciones técnicas según los IPID oficiales AFR01S0071 y AFR01S0074."
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow="Proceso Rápido"
        title="Empieza a usar tu seguro médico en 4 pasos"
        description="Contratación 100% online y digital con activación inmediata."
        steps={[
          {
            title: 'Cotiza tu edad',
            description: 'Selecciona si prefieres la modalidad con o sin copagos.'
          },
          {
            title: 'Datos personales',
            description: 'Rellena el formulario con tus datos de contacto y pago.'
          },
          {
            title: 'Cuestionario médico',
            description: 'Breve cuestionario de salud online para dar el alta.'
          },
          {
            title: 'Tu tarjeta en el móvil',
            description: 'Accede a la app AsisaLIVE y pide tu primera cita médica.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow="Opiniones de Clientes"
        title="Personas que disfrutan de especialistas privados con ASISA Esencial"
        items={testimonials}
      />

      <AsisaTrustSection />

      <DigitalServicesSection
        eyebrow="Telemedicina AsisaLIVE"
        title="Especialistas y recetas médicas en tu smartphone"
        description="Gestiona citas, consulta con médicos de guardia por videollamada y recibe tus recetas electrónicas directamente en la app."
        benefits={[
          'Videoconsultas de atención primaria sin esperas',
          'Receta médica electrónica homologada',
          'Acceso a cuadro médico geolocalizado en toda España',
          'Tarjeta médica digital siempre disponible'
        ]}
        visual={
          <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
            <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-display font-black leading-snug">AsisaLIVE</h4>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Especialista</span>
                  <p className="text-xs font-bold leading-tight">Consulta Médica Inmediata</p>
                  <p className="text-[9px] text-slate-200">Videollamada en directo</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Dental Asisa</span>
                  <p className="text-xs font-bold leading-tight">Limpiezas y Revisiones</p>
                  <p className="text-[9px] text-slate-200">Sin coste adicional</p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                40.000 Médicos en España
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={[
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Tarifa Mínima</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Sin Hospitalización</span>
        ]}
        title="Especialistas y Pruebas Médicas desde 13,90€/mes"
        description="Contrata a través de VitaBlue y accede al cuadro médico concertado de Asisa con dental y telemedicina AsisaLIVE incluidos."
      />

      <FaqSection
        eyebrow="Preguntas Frecuentes"
        title="Resolvemos tus dudas sobre ASISA Esencial"
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title="¿No estás seguro de si necesitas cobertura con o sin hospitalización?"
        description="Nuestros asesores de VitaBlue comparan tus necesidades de salud de forma transparente y sin compromiso."
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-ESENCIAL-HELP' })}
      />
    </div>
  );
};

export default AsisaEsencial;
