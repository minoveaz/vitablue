import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';
import {
  ShieldCheck, Clock, Award, Shield
} from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import SanitasTrustSection from '../../components/organisms/SanitasTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import ProductTransparencyPanel from '../../components/organisms/ProductTransparencyPanel';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import {
  FamilyIllustration,
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration
} from '../../components/illustrations';

export const AsistenciaFamiliar: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat'); // Standard profile
    navigate('/wizard/');
  };

  const inclusions = [
    'Gestión y cobertura completa de los servicios fúnebres de sepelio o incineración.',
    'Traslado nacional e internacional ilimitado del fallecido hasta el cementerio elegido.',
    'Asesoramiento legal, tramitación de pensiones, viudedad y herencias familiares.',
    'Testamento online gratuito y borrado de la huella digital en internet.'
  ];

  const exclusions = [
    'Indemnización directa si el servicio de decesos es organizado por terceros ajenos a la aseguradora.',
    'Siniestros derivados de conflictos bélicos, catástrofes naturales o radiación nuclear.',
    'Suicidio del asegurado durante el primer año de vigencia de la póliza.',
    'Gastos suntuarios no contemplados en el capital de sepelio contratado.'
  ];

  const coverages = [
    {
      title: 'Servicio de Sepelio',
      desc: 'Gestión integral fúnebre de sepelio o incineración, coche fúnebre, tanatorio, flores y nicho o sepultura seleccionados.',
      illustration: FamilyIllustration
    },
    {
      title: 'Traslado Nacional e Internacional',
      desc: 'Garantía de traslado sanitario y repatriación del asegurado fallecido desde cualquier parte del mundo hasta España o viceversa.',
      illustration: TravelIllustration
    },
    {
      title: 'Asesoramiento Legal',
      desc: 'Gestión y tramitación de pensiones de viudedad, orfandad, auxilio por defunción, declaración de herederos y adjudicación de herencias.',
      illustration: PreventionIllustration
    },
    {
      title: 'Testamento Online',
      desc: 'Acceso gratuito a la firma de testamento vital y testamento online anual guiado por un abogado especializado.',
      illustration: HealthIllustration
    },
    {
      title: 'Apoyo Psicológico',
      desc: 'Asistencia y soporte psicológico telefónico y presencial a la familia por duelo inmediato ante la pérdida.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Asistencia en Viajes',
      desc: 'Gastos médicos de urgencia en el extranjero y repatriación médica en caso de accidente durante viajes internacionales.',
      illustration: TravelIllustration
    }
  ];

  const plansList = [
    {
      name: 'Prima Nivelada',
      subtitle: 'Cuota estable vitalicia',
      desc: 'Pagas una cuota ligeramente superior al inicio pero muy estable. La prima no aumenta con tu edad, solo se actualiza según el IPC y capital de sepelio.',
      priceDetail: 'Cuota protegida frente a la edad',
      tag: 'Estabilidad',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    },
    {
      name: 'Prima Mixta',
      subtitle: 'Equilibrio recomendado',
      desc: 'La modalidad más popular. Comienza con una prima reducida que aumenta de forma progresiva hasta los 65 años, momento en el cual se nivela y se estabiliza.',
      priceDetail: 'Estabilización automática a los 65',
      tag: 'Más Contratado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Prima Natural',
      subtitle: 'Mínimo coste inicial',
      desc: 'La cuota de entrada más económica. El precio se ajusta de forma anual y aumenta progresivamente según cumples años a lo largo del contrato.',
      priceDetail: 'Prima adaptada a tu edad actual',
      tag: 'Ahorro Inicial',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'Elena Gutiérrez',
      meta: 'Asegurada familiar en Madrid',
      comment: 'Trato de máxima sensibilidad en un momento tan duro. Se encargaron de toda la gestión fúnebre, traslados y trámites de herencia sin cobrarnos un euro adicional. Impagable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Manuel Ramón',
      meta: 'Asegurado en Valencia',
      comment: 'Elegimos la modalidad de prima mixta. VitaBlue nos asesoró de forma impecable por WhatsApp, resolviendo todas las dudas sobre la estabilización a los 65 años. Muy transparentes.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Laura Fernández',
      meta: 'Asegurada en Barcelona',
      comment: 'El servicio de testamento online y el borrado de huella digital de mi padre nos facilitó todo enormemente. Un seguro de decesos moderno que va más allá del sepelio.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Qué cubre exactamente la repatriación internacional?',
      a: 'Si el asegurado fallece fuera de España, la póliza cubre los gastos de traslado y acondicionamiento sanitario del cuerpo hasta el aeropuerto más cercano a la localidad de inhumación en España.'
    },
    {
      q: '¿Qué diferencia hay entre la prima nivelada y la prima mixta?',
      a: 'En la prima nivelada, el precio es estable toda la vida (solo sube por el IPC anual). En la prima mixta, pagas una cuota inicial más barata que va aumentando gradualmente con la edad hasta los 65 años, donde se estabiliza y ya no vuelve a subir por edad.'
    },
    {
      q: '¿Puedo incluir a varios miembros de la familia en la misma póliza?',
      a: 'Sí. Asistencia Familiar Iplus permite incluir en un único contrato a todos los miembros de la unidad familiar (padres, hijos y abuelos), aplicando descuentos colectivos en la cuota global.'
    },
    {
      q: '¿En qué consiste el borrado de la huella digital?',
      a: 'Consiste en la tramitación del cierre, borrado y desactivación de todas las cuentas de redes sociales, correos electrónicos y perfiles públicos de internet pertenecientes al asegurado fallecido.'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar/';
  const title = 'Sanitas Asistencia Familiar iPlus | Seguro de Decesos y Traslado | VitaBlue';
  const description = 'Contrata Sanitas Asistencia Familiar iPlus. Seguro de decesos integral con repatriación y traslado nacional e internacional, sepelio y asesoría jurídica familiar.';

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "InsuranceAgency",
        "@id": "https://www.vitablue.es/#organization",
        "name": "VitaBlue",
        "url": "https://www.vitablue.es/",
        "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
        "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y más. Asesoramiento personalizado y contratación 100% online.",
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
          "reviewCount": "76",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": `${canonicalUrl}#producto`,
        "name": "Asistencia Familiar iPlus Sanitas",
        "description": "Seguro de asistencia familiar y decesos: servicios funerarios completos, traslado mundial, apoyo emocional y gestión documental.",
        "brand": {
          "@type": "Brand",
          "name": "Sanitas"
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
            "item": "https://www.vitablue.es/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Seguros",
            "item": "https://www.vitablue.es/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Asistencia Familiar iPlus",
            "item": canonicalUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué incluye el servicio funerario?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Organización, tanatorio, féretro, ceremonia y gestiones básicas."
            }
          },
          {
            "@type": "Question",
            "name": "¿Se cubre repatriación internacional?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, según límites económicos definidos en póliza."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo funciona la prima mixta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Combina ventajas de prima natural y nivelada para suavizar incrementos."
            }
          },
          {
            "@type": "Question",
            "name": "¿Hay carencias?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Aplican carencias específicas por garantía. Confirmar en condiciones particulares."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' }, { label: 'Asistencia Familiar', href: '/productos/seguro-para-decesos/asistencia-familiar' }]} />

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguro de Decesos Familiar', icon: <Shield className="h-4 w-4" /> },
          { label: 'Cobertura de traslado internacional', tone: 'accent' },
        ]}
        title="Asistencia Familiar Iplus"
        description="Protección y tranquilidad total para ti y los tuyos ante cualquier imprevisto. Nos encargamos de todos los trámites legales, sepelio y apoyo psicológico familiar."
        primaryAction={{ label: 'Calcular Cuota Familiar', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
        highlights={['Testamento online gratis', 'Trámites de herencia']}
      >
        <QuoteEstimator
          title="Tarificador de Decesos"
          description="Estima tu prima según tu edad y estructura de pago."
          initialAge={40}
          maxAge={75}
          options={[
            { id: 'levelled', label: 'Nivelada' },
            { id: 'mixed', label: 'Mixta' },
            { id: 'natural', label: 'Natural' },
          ]}
          initialOption="mixed"
          modalityLabel="Tipo de prima"
          calculatePrice={(selectedAge, option) => {
            if (option === 'levelled') return (selectedAge < 30 ? 11.5 : selectedAge < 50 ? 19.8 : 29.5).toFixed(2);
            if (option === 'natural') return (selectedAge < 30 ? 3.9 : selectedAge < 50 ? 6.5 : 12.8).toFixed(2);
            return (selectedAge < 30 ? 5.8 : selectedAge < 50 ? 9.9 : 18.5).toFixed(2);
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: 'Homologación Oficial', description: 'Pólizas oficiales autorizadas por la DGSFP.' },
        { icon: <Clock />, title: 'Gestión Completa', description: 'Servicio fúnebre, traslados y trámites en 24h.' },
        { icon: <Award />, title: 'Asistencia 24/7 Duelo', description: 'Apoyo psicológico y gestores de servicio de guardia.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradoras oficiales homologadas"
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <CoverageGrid
        eyebrow="Garantías Familiares"
        title="Coberturas de Asistencia Familiar"
        description="Máxima cobertura en sepelio, orientación sucesoria y traslados sanitarios para toda la unidad familiar."
        items={coverages.map(({ title, desc, illustration }) => ({
          title,
          description: desc,
          illustration
        }))}
      />

      {/* Modalities Comparison Grid */}
      <PlanComparisonSection eyebrow="Modalidades de Prima" title="Elige tu estructura de pago" description="Compara las tres alternativas de tarificación para equilibrar tu cuota mensual a corto y largo plazo." plans={plansList} onPlanAction={handleStartQuoting} actionLabel="Comparar esta opción" />

      {/* Details and Transparency Section */}
      <ProductTransparencyPanel eyebrow="Transparencia Radical" title="¿Qué incluye y qué excluye Asistencia Familiar Iplus?" description="Te explicamos claramente las exclusiones e inclusiones del seguro de decesos familiar para proteger a los tuyos de manera transparente." inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title="Cómo contratar en 4 pasos"
        description="Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue."
        steps={[
          {
            title: 'Rellena el formulario',
            description: 'Indica los datos de tu familia y selecciona el tipo de prima (Nivelada, Mixta o Natural) en nuestro cotizador.'
          },
          {
            title: 'Elige forma de pago',
            description: 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción vigente en tu cuota.'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Completa un breve cuestionario digital necesario para declarar la salud y activar coberturas del seguro.'
          },
          {
            title: 'Recibe tu póliza',
            description: 'Obtén tu documentación oficial y tarjetas de asistencia familiar listas para empezar a usar desde el primer día.'
          }
        ]}
      />

      <SanitasTrustSection />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      {/* Accordion FAQs Section */}
      <FaqSection eyebrow="Preguntas Frecuentes" title="Resolver dudas sobre Asistencia Familiar Iplus" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Necesitas asesoría personalizada para tu unidad familiar?"
        description="Ofrecemos tarifas colectivas y familiares adaptadas al número de asegurados y edades. Te asesoramos sin ningún coste o compromiso de forma gratuita."
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: '/productos/seguro-para-decesos/asistencia-familiar', tag: 'LANDING-DECESOS' })}
      />
    </div>
  );
};

export default AsistenciaFamiliar;
