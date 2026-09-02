import React from 'react';
import { sanitasMascotasPlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, Dog
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
import CoverageGrid from '../../components/organisms/CoverageGrid';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import {
  PetIllustration,
  PreventionIllustration,
  DentalIllustration,
  HealthIllustration,
  TravelIllustration,
  MedicalAttentionIllustration
} from '../../components/illustrations';

export const SanitasMascotas: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('pet'); // Pet profile
    navigate('/wizard');
  };

  const inclusions = [
    'Consultas de urgencia 24h en clínicas veterinarias concertadas.',
    'Revisiones preventivas, vacunas obligatorias de la rabia y consultas veterinarias gratuitas.',
    'Limpieza bucal anual recomendada por veterinarios para perros y gatos.',
    'Indemnización en caso de fallecimiento por accidente de la mascota.'
  ];

  const exclusions = [
    'Tratamientos de estética canina u operaciones de peluquería veterinaria.',
    'Medicamentos recetados fuera del ámbito hospitalario o vacunas opcionales.',
    'Intervenciones quirúrgicas por enfermedades previas a la contratación.',
    'Gastos por residencia veterinaria o guardería.'
  ];

  const coverages = [
    {
      title: 'Consultas Veterinarias',
      desc: 'Visitas ilimitadas gratis a veterinarios generales, de urgencia y especialistas dentro del cuadro concertado de Sanitas.',
      illustration: PetIllustration
    },
    {
      title: 'Vacunas y Rabia',
      desc: 'Revisión preventiva anual y vacuna obligatoria de la rabia incluida a coste cero en todos los planes.',
      illustration: PreventionIllustration
    },
    {
      title: 'Limpieza Bucal Anual',
      desc: 'Una limpieza de boca gratuita al año en centros autorizados para prevenir infecciones y sarro.',
      illustration: DentalIllustration
    },
    {
      title: 'Urgencias 24 Horas',
      desc: 'Atención telefónica de urgencia permanente y clínicas veterinarias de guardia disponibles a nivel nacional.',
      illustration: HealthIllustration
    },
    {
      title: 'Hospitalización y Cirugía',
      desc: 'Cobertura del 100% de los gastos de quirófano, anestesia e ingresos en clínicas seleccionadas en caso de enfermedad.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Indemnización por Accidente',
      desc: 'Compensación económica por el valor de la mascota en caso de fallecimiento accidental para cubrir gastos imprevistos.',
      illustration: TravelIllustration
    }
  ];


  const testimonials = [
    {
      author: 'Carlos Mendoza',
      meta: 'Asegurado con Golden Retriever (4 años)',
      comment: 'Contraté Sanitas Mascotas y estoy encantado. La vacuna de la rabia y las revisiones anuales son gratis, y el veterinario de urgencia nos atendió genial de madrugada.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Sofía Tejera',
      meta: 'Asegurada con Gato Siamés (2 años)',
      comment: 'Me gustó que no me cobraran recargo por la raza de mi gato. La limpieza bucal anual y las videoconsultas de Blua para dudas rápidas funcionan de maravilla.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Javier Luque',
      meta: 'Asegurado con Pastor Alemán (6 años)',
      comment: 'El trato por WhatsApp de VitaBlue fue súper claro. Comparamos las opciones de reembolso y nos decidimos por la modalidad completa. Contratación online rápida.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Qué límites de edad existen para asegurar a mi perro o gato?',
      a: 'Puedes dar de alta a tu perro o gato a partir de los 3 meses de edad y hasta que cumpla los 9 años. Una vez asegurado, la póliza se renueva anualmente de forma vitalicia sin exclusiones.'
    },
    {
      q: '¿Existen recargos en la cuota según la raza de la mascota?',
      a: 'No. Una de las grandes ventajas de Sanitas Mascotas es que la prima mensual es fija y uniforme. No se aplican recargos adicionales ni variaciones por la raza o tamaño de tu mascota.'
    },
    {
      q: '¿Cómo funciona la modalidad de Reembolso?',
      a: 'En la modalidad "Mascotas Reembolso", tienes la libertad de llevar a tu perro o gato a cualquier clínica veterinaria de España. Abonas la factura y nos la envías digitalmente a través de la app; Sanitas te reembolsará el 80% de los gastos elegibles en un plazo máximo de 10 días.'
    },
    {
      q: '¿Qué cubre la garantía de fallecimiento por accidente?',
      a: 'En caso de que la mascota fallezca debido a un accidente fortuito, la póliza indemniza al propietario con un capital de hasta 1.000€ (según condiciones de póliza) para mitigar los gastos sobrevenidos.'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas/';
  const title = 'Sanitas Mascotas | Seguro Veterinario para Perros y Gatos | VitaBlue';
  const description = 'Protege a tu perro o gato con Sanitas Mascotas. Seguro médico veterinario con consultas ilimitadas, vacunas incluidas y acceso a red nacional.';

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
          "ratingValue": "4.7",
          "reviewCount": "52",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": `${canonicalUrl}#producto`,
        "name": "Sanitas Salud Mascotas",
        "description": "Sanitas Mascotas: seguro veterinario con reembolso del 80%, hasta 2.500 €/año. Libre elección de veterinario y gestión 100% digital.",
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
            "name": "Sanitas Salud Mascotas"
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
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' }, { label: 'Seguro de Mascotas', href: '/productos/seguro-mascotas/sanitas-mascotas' }]} />

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguro Veterinario Oficial', icon: <Dog className="h-4 w-4" /> },
          { label: 'Sin exclusión por raza', tone: 'accent' },
        ]}
        title="Sanitas Mascotas"
        description="Cuidado integral veterinario para tu perro o gato. Consultas gratis ilimitadas, vacuna de la rabia incluida y acceso a más de 400 centros de salud animal en España."
        primaryAction={{ label: 'Calcular Póliza Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
        highlights={['Limpieza dental anual gratis', 'Urgencias 24h']}
      >
        <QuoteEstimator
          title="Tarificador de Mascota"
          description="Calcula la cuota mensual aproximada de tu mascota."
          ageLabel="Edad de la mascota"
          initialAge={3}
          minAge={1}
          maxAge={9}
          options={[
            { id: 'basic', label: 'Básico' },
            { id: 'complete', label: 'Completo' },
            { id: 'reimbursement', label: 'Reembolso' },
          ]}
          initialOption="complete"
          modalityLabel="Plan veterinario"
          calculatePrice={(selectedAge, option) => {
            if (option === 'basic') return '9.90';
            if (option === 'reimbursement') return '24.90';
            return (12.5 + (selectedAge > 5 ? 4.5 : 0)).toFixed(2);
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: 'Homologación Oficial', description: 'Pólizas veterinarias emitidas por Sanitas Seguros.' },
        { icon: <Clock />, title: 'Emisión en 24 Horas', description: 'Alta digital inmediata y póliza lista en el día.' },
        { icon: <Award />, title: 'Sin Copagos Veterinarios', description: 'Consultas y revisiones incluidas a coste cero.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradora veterinaria oficial"
        providers={[{ name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' }]}
      />

      <CoverageGrid
        eyebrow="Garantías Veterinarias"
        title="Coberturas Esenciales del Seguro"
        description="Garantizamos la máxima cobertura médica para que cuides a tu perro o gato sin sorpresas económicas."
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Modalities Comparison Grid */}
      <PlanComparisonSection eyebrow="Planes Veterinarios" title="Elige el nivel de protección ideal" description="Disponemos de tres planes adaptados a las necesidades preventivas y clínicas de tu mascota." plans={sanitasMascotasPlans} onPlanAction={handleStartQuoting} actionLabel="Comparar este plan" />
      <section className="hidden">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Planes Veterinarios</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Elige el nivel de protección ideal
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Disponemos de tres planes adaptados a las necesidades preventivas y clínicas de tu mascota.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {null}
        </div>
      </section>

      {/* Details and Transparency Section */}
      <ProductTransparencyPanel eyebrow="Transparencia Radical" title="¿Qué incluye y qué excluye Sanitas Mascotas?" description="Te mostramos sin rodeos las coberturas veterinarias para que cuides a tu mejor amigo con total tranquilidad y conocimiento." inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title="Cómo contratar en 4 pasos"
        description="Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue."
        steps={[
          {
            title: 'Rellena el formulario',
            description: 'Indica los datos de tu perro o gato y selecciona el plan ideal (Básica, Completa o Reembolso) en nuestro cotizador.'
          },
          {
            title: 'Elige forma de pago',
            description: 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción vigente en tu cuota.'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Completa un breve cuestionario digital necesario para declarar la salud y activar coberturas veterinarias del animal.'
          },
          {
            title: 'Recibe tu póliza',
            description: 'Obtén tu documentación oficial y tarjetas médicas digitales listas para empezar a usar desde el primer día.'
          }
        ]}
      />

      <SanitasTrustSection />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      <FaqSection eyebrow="Preguntas Frecuentes" title="Resolver dudas sobre Sanitas Mascotas" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Tienes dudas sobre los límites de edad?"
        description="Puedes contratar Sanitas Mascotas para perros y gatos desde los 3 meses hasta los 9 años de edad. Te asesoramos sin compromiso sobre cualquier cobertura veterinaria de forma gratuita."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20Sanitas%20Mascotas."
      />
    </div>
  );
};

export default SanitasMascotas;

