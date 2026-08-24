import React from 'react';
import { lifePlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, Shield, Stethoscope
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
  FamilyIllustration,
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration
} from '../../components/illustrations';

export const LifeInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat'); // Standard profile fits general life insurance wizard
    navigate('/wizard');
  };

  const inclusions = [
    'Fallecimiento por cualquier causa (enfermedad o accidente) con abono del capital a beneficiarios.',
    'Invalidez absoluta y permanente que impida realizar cualquier actividad profesional.',
    'Anticipo de capital para el pago del Impuesto sobre Sucesiones y Donaciones.',
    'Servicio gratuito de testamento online y orientación jurídica familiar.'
  ];

  const exclusions = [
    'Fallecimiento derivado de deportes extremos o de alto riesgo no declarados previamente.',
    'Suicidio del asegurado durante el primer año de vigencia de la póliza.',
    'Siniestros producidos por conflictos armados, motines o catástrofes nucleares.',
    'Invalidez derivada de autolesiones voluntarias o adicciones.'
  ];

  const coverages = [
    {
      title: 'Fallecimiento por Cualquier Causa',
      desc: 'Abono íntegro del capital asegurado a los beneficiarios designados en caso de defunción por enfermedad o accidente.',
      illustration: FamilyIllustration
    },
    {
      title: 'Invalidez Permanente y Absoluta',
      desc: 'Pago anticipado del 100% del capital si sufres una incapacidad irreversible que te impida trabajar en el futuro.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Doble Capital por Accidente',
      desc: 'Se duplica el importe de indemnización cobrado por los beneficiarios si la causa del fallecimiento es un accidente de tráfico o laboral.',
      illustration: TravelIllustration
    },
    {
      title: 'Anticipo para Sucesiones',
      desc: 'Adelanto inmediato de hasta 10.000€ del capital para hacer frente al Impuesto de Sucesiones y desbloquear la herencia.',
      illustration: PreventionIllustration
    },
    {
      title: 'Testamento Online Gratis',
      desc: 'Gestión anual de redacción y firma de testamento vital guiado por un equipo legal especializado sin coste adicional.',
      illustration: HealthIllustration
    },
    {
      title: 'Segunda Opinión Médica',
      desc: 'Acceso a diagnósticos e informes médicos contrastados por expertos internacionales ante enfermedades graves.',
      illustration: Stethoscope
    }
  ];


  const testimonials = [
    {
      author: 'Ricardo Jiménez',
      meta: 'Asegurado Vida Hipotecas (Madrid)',
      comment: 'Buscaba un seguro para desvincularme del banco. Encontré una cuota a mitad de precio que la que me ofrecían con la hipoteca y el cambio fue facilísimo. VitaBlue gestionó todo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Laura Muñoz',
      meta: 'Asegurada Vida Completo (Sevilla)',
      comment: 'El cuestionario de salud online fue rápido, sin necesidad de visitas médicas ni analíticas. Los asesores por WhatsApp resolvieron mis dudas sobre el capital de invalidez.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Andrés Pastrana',
      meta: 'Asegurado Familiar (Zaragoza)',
      comment: 'Tranquilidad absoluta para mi familia. Poder duplicar el capital en caso de accidente de tráfico y tener el testamento gratuito son extras de un valor tremendo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Es obligatorio pasar una revisión médica para contratar?',
      a: 'Para la mayoría de los capitales (hasta 150.000€) y edades normales, solo se exige completar un cuestionario de salud digital de 5 minutos al contratar. No requiere analíticas ni visitas médicas en clínicas.'
    },
    {
      q: '¿Cómo puedo cambiar mi seguro de vida de la hipoteca a VitaBlue?',
      a: 'Es tu derecho legal. Puedes dar de baja el seguro de vida del banco avisando con 30 días de antelación al vencimiento y presentar la nueva póliza de VitaBlue con el banco como beneficiario hipotecario. Te ayudamos gratis con todo el trámite.'
    },
    {
      q: '¿Quién recibe el capital en caso de fallecimiento?',
      a: 'El capital asegurado lo reciben los beneficiarios expresamente designados por el asegurado en la póliza (ej. cónyuge, hijos). En caso de no designarse beneficiarios específicos, se abonará a los herederos legales según ley.'
    }
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
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
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": "https://www.vitablue.es/productos/seguro-vida#producto",
        "name": "Seguro de Vida Familiar",
        "description": "Seguro de vida familiar para proteger la estabilidad de tus seres queridos y cubrir tu hipoteca frente a imprevistos.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "provider": {
          "@id": "https://www.vitablue.es/#organization"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "82",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Pedro M."
            },
            "datePublished": "2025-11-08",
            "reviewBody": "Cambié mi seguro de vida vinculado al banco por el de VitaBlue y me ahorro más de un 40% al año con mejores coberturas. Ellos se encargaron de toda la gestión.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            }
          }
        ]
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
            "name": "Seguro de Vida"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cómo puedo cambiar mi seguro de vida de la hipoteca a VitaBlue?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Es tu derecho legal. Puedes dar de baja el seguro de vida del banco avisando con 30 días de antelación al vencimiento y presentar la nueva póliza de VitaBlue con el banco como beneficiario hipotecario. Te ayudamos gratis con todo el trámite."
            }
          },
          {
            "@type": "Question",
            "name": "¿Quién recibe el capital en caso de fallecimiento?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "El capital asegurado lo reciben los beneficiarios expresamente designados por el asegurado en la póliza (ej. cónyuge, hijos). En caso de no designarse beneficiarios específicos, se abonará a los herederos legales según ley."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Seguro de Vida Familiar | Cobertura e Hipoteca | VitaBlue</title>
        <meta name="description" content="Compara y contrata tu seguro de vida familiar. Protege la estabilidad de tu familia y asegura tu hipoteca con cuotas económicas sin revisiones médicas complejas." />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguro-vida" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seguro de Vida Familiar | Cobertura e Hipoteca | VitaBlue" />
        <meta property="og:description" content="Compara y contrata tu seguro de vida familiar. Protege la estabilidad de tu familia y asegura tu hipoteca con cuotas económicas sin revisiones médicas complejas." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguro-vida" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Seguro de Vida Familiar | Cobertura e Hipoteca | VitaBlue" />
        <meta name="twitter:description" content="Compara y contrata tu seguro de vida familiar. Protege la estabilidad de tu familia y asegura tu hipoteca con cuotas económicas sin revisiones médicas complejas." />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Vida', href: '/productos/seguro-vida' }]} />

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguros de Vida', icon: <Shield className="h-4 w-4" /> },
          { label: 'Apto para vinculación hipotecaria', tone: 'accent' },
        ]}
        title="Seguro de Vida Familiar"
        description="Asegura la tranquilidad y el futuro financiero de tus seres queridos. Cubre préstamos, hipotecas y garantiza la estabilidad familiar con cuotas mínimas mensuales."
        primaryAction={{ label: 'Calcular Seguro Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
        highlights={['Sin reconocimientos médicos', 'Cobertura de invalidez']}
      >
        <QuoteEstimator
          title="Tarificador de Vida"
          description="Estima tu cuota según edad y capital asegurado."
          options={[
            { id: '100000', label: '100.000 €' },
            { id: '150000', label: '150.000 €' },
            { id: '250000', label: '250.000 €' },
          ]}
          initialOption="100000"
          modalityLabel="Capital a asegurar"
          calculatePrice={(selectedAge, option) => {
            const selectedCapital = Number(option);
            let factor = 0.00012;
            if (selectedAge > 30) factor = 0.00018;
            if (selectedAge > 45) factor = 0.00038;
            if (selectedAge > 55) factor = 0.00085;
            return ((selectedCapital * factor) / 12).toFixed(2);
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: 'Tranquilidad Familiar', description: 'Asegura la manutención y estudios de tus hijos.' },
        { icon: <Clock />, title: 'Emisión sin Médicos', description: 'Cuestionario online sin visitas clínicas ni analíticas.' },
        { icon: <Award />, title: 'Protección Hipotecaria', description: 'Cancela la hipoteca pendiente en caso de siniestro.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradoras oficiales colaboradoras"
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <CoverageGrid
        eyebrow="Garantías de vida"
        title="Coberturas del Seguro de Vida"
        description="Protección completa y capitales garantizados para asegurar el bienestar de tu familia ante cualquier imprevisto."
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Modalities Comparison Grid */}
      <PlanComparisonSection eyebrow="Modalidades" title="Elige el plan adaptado a tus necesidades" description="Compara las tres alternativas de contratación para proteger tu hipoteca, patrimonio o el sustento de tus hijos." plans={lifePlans} onPlanAction={handleStartQuoting} actionLabel="Comparar esta opción" />
      {/* Details and Transparency Section */}
      <ProductTransparencyPanel eyebrow="Transparencia Radical" title="¿Qué incluye y qué excluye tu seguro de vida?" description="Te mostramos sin rodeos las condiciones reales de la póliza de vida para que decidas de forma clara y transparente." inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title="Cómo contratar en 4 pasos"
        description="Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue."
        steps={[
          {
            title: 'Rellena el formulario',
            description: 'Introduce tu edad, capital deseado y si quieres cobertura de invalidez en nuestro cotizador.'
          },
          {
            title: 'Revisa tu prima',
            description: 'Revisa tu tarifa mensual estimada y vinculación hipotecaria; te indicamos descuentos por pago anual.'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de vida.'
          },
          {
            title: 'Recibe tu póliza',
            description: 'Obtén tu documentación oficial y contrato de seguro firmado digitalmente al instante en tu correo.'
          }
        ]}
      />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      {/* Accordion FAQs Section */}
      <FaqSection eyebrow="Preguntas Frecuentes" title="Resolver dudas sobre el Seguro de Vida" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Necesitas asesoría personalizada para tu seguro de vida?"
        description="Te ayudamos a comparar las primas de las distintas compañías de forma neutral para proteger a tu familia de la manera más económica. Te asesoramos de forma gratuita."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20de%20Vida."
      />
    </div>
  );
};

export default LifeInsurance;


