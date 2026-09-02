import React from 'react';
import { travelPlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock, Award, Globe
} from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import ProductTransparencyPanel from '../../components/organisms/ProductTransparencyPanel';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import {
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const TravelInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, setVisaRequired, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('nomad'); // Nomad/traveler profile fits travel wizard
    setVisaRequired('unknown');
    navigate('/wizard');
  };

  const inclusions = [
    'Gastos médicos, farmacéuticos y de hospitalización de urgencia en el extranjero.',
    'Repatriación médica del asegurado enfermo, accidentado o fallecido.',
    'Indemnización por pérdida, robo o daños graves en el equipaje facturado.',
    'Regreso anticipado del asegurado por hospitalización o fallecimiento de un familiar.'
  ];

  const exclusions = [
    'Enfermedades preexistentes o crónicas conocidas previas al inicio del viaje.',
    'Tratamientos dentales complejos o revisiones preventivas ordinarias en viaje.',
    'Siniestros producidos bajo los efectos del alcohol o drogas.',
    'Práctica de deportes de aventura extremos sin contratar el suplemento correspondiente.'
  ];

  const coverages = [
    {
      title: 'Gastos Médicos de Urgencia',
      desc: 'Cobertura de hasta 150.000€ en hospitalización, cirugías, honorarios médicos y farmacia en el extranjero.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Repatriación Sanitaria',
      desc: 'Garantía del 100% de los costes de traslado médico urgente de vuelta a España por enfermedad grave o deceso.',
      illustration: TravelIllustration
    },
    {
      title: 'Pérdida de Equipajes',
      desc: 'Indemnización por daños graves, robo o extravío definitivo del equipaje facturado durante el vuelo.',
      illustration: PreventionIllustration
    },
    {
      title: 'Demoras y Cancelación',
      desc: 'Reembolso de gastos de hotel y manutención por retraso del medio de transporte o pérdida de conexiones.',
      illustration: HealthIllustration
    },
    {
      title: 'Regreso Anticipado',
      desc: 'Billetes de vuelta cubiertos si debes interrumpir tu viaje por fallecimiento o ingreso de un familiar en España.',
      illustration: FamilyIllustration
    },
    {
      title: 'Asistencia 24h Multilingüe',
      desc: 'Teléfono de asistencia internacional permanente para resolver cualquier urgencia médica o legal en tu idioma.',
      illustration: HealthIllustration
    }
  ];


  const testimonials = [
    {
      author: 'Marta Soler',
      meta: 'Contrató Viaje Anual Multiviaje',
      comment: 'Viajo constantemente por trabajo. Contraté la póliza anual multiviaje y es comodísima; te olvidas de hacer un seguro cada vez que vuelas y sale súper rentable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Daniel Rodríguez',
      meta: 'Viaje de 3 semanas a Tailandia',
      comment: 'Tuve una apendicitis en Bangkok y me atendieron al instante por teléfono en español. Asumieron todos los costes hospitalarios directamente sin que yo tuviera que adelantar nada. Increíble.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Sofía K.',
      meta: 'Vacaciones Familiares en USA',
      comment: 'El seguro Estrella con cobertura para USA nos dio total tranquilidad. Además, incluimos el seguro de cancelación y nos salvó el dinero de los vuelos por enfermedad previa.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Cómo funciona la asistencia médica de urgencia en el extranjero?',
      a: 'Si sufres un accidente o enfermedad en viaje, llamas al teléfono de asistencia 24h indicado en tu póliza. Nuestro equipo te derivará al centro médico concertado más cercano y se coordinará con el hospital para asumir el coste de las facturas médicas directamente.'
    },
    {
      q: '¿Qué cubre la garantía de cancelación de viaje?',
      a: 'Te reembolsa los gastos de billetes y reservas de hotel no recuperables (hasta el límite contratado) si tienes que suspender el viaje antes de su inicio por causas justificadas de fuerza mayor (enfermedad grave, despido laboral, etc.).'
    },
    {
      q: '¿El seguro de viaje cubre la práctica de deportes de aventura?',
      a: 'La modalidad Estrella y Premium cubren la práctica de deportes de aventura estándar (senderismo, kayak, bicicleta). Para actividades de alto riesgo (como buceo profundo, esquí o montañismo), se debe añadir el suplemento deportivo específico al contratar.'
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
          "ratingValue": "4.7",
          "reviewCount": "104",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": "https://www.vitablue.es/productos/seguro-viaje#producto",
        "name": "Seguro de Viaje Internacional",
        "description": "Seguro de asistencia en viaje internacional con cobertura de gastos médicos, repatriación y anulación.",
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
            "name": "Productos",
            "item": "https://www.vitablue.es#productos"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Seguro de Viaje"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué cubre la garantía de cancelación de viaje?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Te reembolsa los gastos de billetes y reservas de hotel no recuperables (hasta el límite contratado) si tienes que suspender el viaje antes de su inicio por causas justificadas de fuerza mayor (enfermedad grave, despido laboral, etc.)."
            }
          },
          {
            "@type": "Question",
            "name": "¿El seguro de viaje cubre la práctica de deportes de aventura?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La modalidad Estrella y Premium cubren la práctica de deportes de aventura estándar (senderismo, kayak, bicicleta). Para actividades de alto riesgo (como buceo profundo, esquí o montañismo), se debe añadir el suplemento deportivo específico al contratar."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Seguro de Viaje Internacional | Cobertura Médica | VitaBlue</title>
        <meta name="description" content="Compara y contrata tu seguro de viaje internacional. Cobertura de gastos médicos, repatriación, pérdida de equipaje y anulación para tus viajes vacacionales o de larga estancia." />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguro-viaje/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seguro de Viaje Internacional | Cobertura Médica | VitaBlue" />
        <meta property="og:description" content="Compara y contrata tu seguro de viaje internacional. Cobertura de gastos médicos, repatriación, pérdida de equipaje y anulación para tus viajes vacacionales o de larga estancia." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguro-viaje/" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seguro de Viaje Internacional | Cobertura Médica | VitaBlue" />
        <meta name="twitter:description" content="Compara y contrata tu seguro de viaje internacional. Cobertura de gastos médicos, repatriación, pérdida de equipaje y anulación para tus viajes vacacionales o de larga estancia." />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Viaje', href: '/productos/seguro-viaje' }]} />

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguros de Viaje', icon: <Globe className="h-4 w-4" /> },
          { label: 'Asistencia médica mundial 24h', tone: 'accent' },
        ]}
        title="Seguro de Viaje Internacional"
        description="Viaja protegido ante cualquier imprevisto de salud, equipaje o vuelos. Cobertura de gastos médicos internacionales de urgencia y repatriación con soporte continuo."
        primaryAction={{ label: 'Calcular Seguro Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
        highlights={['Cobertura de equipaje', 'Opción de anulación']}
      >
        <QuoteEstimator
          title="Tarificador de Viaje"
          description="Estima la prima de tu seguro de viaje al instante."
          options={[
            { id: 'escapade', label: 'Escapada' },
            { id: 'short', label: 'Viaje corto' },
            { id: 'long', label: 'Larga estancia' },
            { id: 'annual', label: 'Anual' },
          ]}
          initialOption="escapade"
          modalityLabel="Duración del viaje"
          ageLabel="Referencia de destino"
          initialAge={1}
          minAge={1}
          maxAge={3}
          calculatePrice={(_, option) => {
            if (option === 'short') return '32.20';
            if (option === 'long') return '59.90';
            if (option === 'annual') return '124.00';
            return '18.50';
          }}
          priceSuffix="€"
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <Globe />, title: 'Asistencia Mundial 24h', description: 'Soporte médico continuado en cualquier país.' },
        { icon: <Clock />, title: 'Emisión Digital Inmediata', description: 'Recibe tu póliza y justificantes al instante en tu correo.' },
        { icon: <Award />, title: 'Garantía de Cancelación', description: 'Reembolso de gastos de billete por fuerza mayor.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradoras oficiales homologadas"
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <CoverageGrid
        eyebrow="Garantías en viaje"
        title="Coberturas de Asistencia en Viaje"
        description="Disfruta de tu aventura con la máxima protección en cobertura sanitaria, pérdidas de equipaje y anulaciones."
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Modalities Comparison Grid */}
      <PlanComparisonSection eyebrow="Modalidades" title="Elige el nivel de protección para tu viaje" description="Compara nuestras tres alternativas de seguro de viaje internacional según la duración y el destino elegidos." plans={travelPlans} onPlanAction={handleStartQuoting} actionLabel="Comparar esta opción" />
      <ProductTransparencyPanel eyebrow="Transparencia Radical" title="¿Qué incluye y qué excluye tu seguro de viaje?" description="Te mostramos sin rodeos las condiciones de la póliza de viaje para que contrates con absoluta claridad." inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title="Cómo contratar en 4 pasos"
        description="Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue."
        steps={[
          {
            title: 'Rellena el formulario',
            description: 'Introduce tu destino, fechas de viaje y número de viajeros en nuestro cotizador de viajes.'
          },
          {
            title: 'Elige tu modalidad',
            description: 'Selecciona el plan ideal (Estándar, Estrella o Premium) y revisa las opciones de anulación.'
          },
          {
            title: 'Completa los datos',
            description: 'Introduce los nombres y documentos de identidad de los viajeros de forma rápida digital.'
          },
          {
            title: 'Recibe tu póliza',
            description: 'Obtén tu documentación oficial y tarjetas médicas digitales al instante en tu correo electrónico.'
          }
        ]}
      />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      {/* Accordion FAQs Section */}
      <FaqSection eyebrow="Preguntas Frecuentes" title="Resolver dudas sobre el Seguro de Viaje" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Necesitas asistencia en la contratación?"
        description="Te ayudamos a contratar tu póliza de viaje o a tramitar coberturas de grupo para estancias de larga duración. Te asesoramos sin compromiso de forma gratuita."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20de%20Viaje."
      />
    </div>
  );
};

export default TravelInsurance;
