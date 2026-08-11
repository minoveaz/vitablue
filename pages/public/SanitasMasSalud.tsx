import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Activity, ShieldCheck, Clock, Award, Check, Smartphone
} from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import SanitasTrustSection from '../../components/organisms/SanitasTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductPromotionSection from '../../components/organisms/ProductPromotionSection';
import DigitalServicesSection from '../../components/organisms/DigitalServicesSection';
import { Button } from '../../components/atoms/Button';
import {
  HealthIllustration,
  MedicalAttentionIllustration,
  DentalIllustration,
  PreventionIllustration,
  FamilyIllustration,
  TravelIllustration
} from '../../components/illustrations';

export const SanitasMasSalud: React.FC = () => {
  const showModalities = false;
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat'); // Standard resident/expat profile
    navigate('/wizard');
  };

  const coverages = [
    {
      title: 'Hospitalización y Cirugía',
      desc: 'Habitación individual con cama de acompañante (salvo UCI), cirugías, anestesia y tratamientos en la red propia de hospitales de Sanitas.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Especialistas e Ilimitado',
      desc: 'Consultas sin restricciones en ginecología, traumatología, cardiología, dermatología y más de 50.000 profesionales.',
      illustration: HealthIllustration
    },
    {
      title: 'Diagnósticos Avanzados',
      desc: 'Acceso prioritario a resonancias, TAC, ecografías, endoscopias y análisis clínicos en laboratorios de primer nivel.',
      illustration: PreventionIllustration
    },
    {
      title: 'Odontología Básica',
      desc: 'Más de 40 servicios incluidos gratis: limpiezas anuales, radiografías, consultas urgentes y tarifas rebajadas en ortodoncia.',
      illustration: DentalIllustration
    },
    {
      title: 'Urgencias en Viaje',
      desc: 'Asistencia médica internacional de urgencias hasta 12.000€ al año por asegurado para viajes de hasta 90 días.',
      illustration: TravelIllustration
    },
    {
      title: 'Planificación Familiar',
      desc: 'Revisiones ginecológicas preventivas anuales, asesoramiento de métodos anticonceptivos y vasectomía o ligadura de trompas.',
      illustration: FamilyIllustration
    }
  ];

  const modalitiesList = [
    {
      name: 'Sin Copago',
      subtitle: 'Cuota fija total',
      desc: 'La opción preferida por quienes quieren máxima tranquilidad sin sorpresas. Pagas tu mensualidad y tienes consultas, pruebas e intervenciones ilimitadas a coste 0€.',
      priceDetail: 'Copago 0€ en todos los actos',
      tag: 'Uso Intensivo',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Copago Reducido',
      subtitle: 'Equilibrio óptimo',
      desc: 'Pagas una cuota fija mensual más económica y un importe muy bajo por cada consulta o prueba médica (entre 3€ y 7€). La hospitalización sigue cubierta al 100% sin copago.',
      priceDetail: 'Copagos de 3€ a 7€ por visita',
      tag: 'Uso Moderado',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    },
    {
      name: 'Copago Progresivo',
      subtitle: 'Cuota de entrada mínima',
      desc: 'La prima mensual más barata disponible. Los copagos son variables y se adaptan según el número de visitas acumuladas que hagas al médico a lo largo del año.',
      priceDetail: 'Copago variable según uso',
      tag: 'Uso Ocasional',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'Laura G.',
      meta: 'Seguro de salud Sanitas Más Salud',
      comment: 'Gestionaron mi alta y la promoción sin sorpresas; Hospitalización y urgencias impecables.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Andrés P.',
      meta: 'Telemedicina Blua',
      comment: 'Uso videoconsultas y programas digitales. Fisio y psicología online funcionan muy bien y me ahorran viajes.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Marta S.',
      meta: 'Modalidad Sin Copago',
      comment: 'Elegí la modalidad sin copago. Habitaciones individuales y trato excelente en el ingreso.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Qué diferencia hay exactamente entre las modalidades de copago?',
      a: 'La diferencia reside en la prima mensual y el coste por visita. En "Sin Copago" la cuota es fija y no pagas nada más. En "Copago Reducido" pagas una cuota menor y un ticket muy bajo (3€ - 7€) por consulta. En "Copago Progresivo" la cuota de entrada es la más baja y el coste de las visitas se ajusta según la frecuencia de uso anual.'
    },
    {
      q: '¿Tiene Sanitas Más Salud períodos de carencia?',
      a: 'La medicina general, pediatría y urgencias médicas están cubiertas desde el primer día sin carencias. Otras coberturas específicas, como hospitalizaciones, partos o tratamientos complejos, tienen períodos de carencia estándar de 8 a 10 meses.'
    },
    {
      q: '¿Cómo funciona la promoción de Blua Digital Gratis?',
      a: 'La contratación de Sanitas Más Salud con VitaBlue incluye el módulo Blua gratis para siempre. Esto te da acceso completo a videoconsultas con especialistas en menos de 5 minutos, receta médica electrónica homologada en la app y planes de nutrición o psicología.'
    },
    {
      q: '¿Qué hospitales de Sanitas están incluidos en España?',
      a: 'Tendrás acceso a toda la red propia de hospitales de Sanitas en Madrid y Barcelona (Hospitales La Zarzuela, La Moraleja, Virgen del Mar y CIMA), así como a los centros concertados de primer nivel (como los del grupo Quirónsalud, Ruber o Vithas) y más de 4.000 clínicas asociadas.'
    }
  ];


  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud';
  const title = 'Sanitas Más Salud | Seguro Médico Completo | VitaBlue';
  const description = 'Detalles, coberturas y modalidades de Sanitas Más Salud. Seguro médico de cuadro completo con hospitalización, 50.000 médicos y Blua digital gratis.';

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
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
        }
      },
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#producto`,
        "name": "Sanitas Más Salud",
        "description": "Seguro médico privado con Hospitalización, urgencias 24/7, red propia de hospitales Sanitas y servicios digitales Blua.",
        "brand": {
          "@type": "Brand",
          "name": "Sanitas"
        },
        "offers": {
          "@type": "Offer",
          "price": "Consultar precio",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.6",
          "reviewCount": "142",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Carlos M."
            },
            "datePublished": "2025-11-20",
            "reviewBody": "Excelente cobertura hospitalaria. La atención en urgencias fue rápida y el servicio digital Blua es muy práctico.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            }
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Laura S."
            },
            "datePublished": "2025-10-05",
            "reviewBody": "Contratación sencilla y acceso inmediato a médicos especialistas. Totalmente recomendable.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            }
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "José R."
            },
            "datePublished": "2025-09-18",
            "reviewBody": "Buena relación calidad-precio. La red de hospitales Sanitas es amplia y moderna.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4",
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
            "name": "Sanitas Más Salud"
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
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' }, { label: 'Sanitas Más Salud', href: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud' }]} />

      <ProductHero
        badges={[
          { label: 'Seguro de Salud Completo', icon: <Activity className="h-4 w-4" /> },
          { label: 'Blua Digital Incluido Gratis', tone: 'accent' },
        ]}
        title="Sanitas Más Salud"
        description="La póliza integral de Sanitas más contratada en España. Cuadro médico de excelencia, hospitalización completa en habitación individual y videoconsultas en 5 minutos."
        primaryAction={{ label: 'Comparar Precios Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34900839240' }}
        highlights={['Sin límite de permanencia', 'Acceso a Hospitales Sanitas']}
      >
        <QuoteEstimator
          title="Estimador de Cuota"
          description="Calcula un precio aproximado según tu edad y modalidad."
          initialAge={30}
          minAge={18}
          maxAge={65}
          options={[
            { id: 'no-copay', label: 'Sin Copago' },
            { id: 'low-copay', label: 'Copago Bajo' },
            { id: 'pro-copay', label: 'Progresivo' },
          ]}
          initialOption="low-copay"
          calculatePrice={(selectedAge, selectedModality) => {
            if (selectedAge < 18) return '21.50';
            if (selectedAge <= 30) {
              if (selectedModality === 'no-copay') return '39.20';
              if (selectedModality === 'low-copay') return '29.50';
              return '24.10';
            }
            if (selectedAge <= 45) {
              if (selectedModality === 'no-copay') return '45.90';
              if (selectedModality === 'low-copay') return '34.80';
              return '28.50';
            }
            if (selectedAge <= 60) {
              if (selectedModality === 'no-copay') return '59.90';
              if (selectedModality === 'low-copay') return '46.20';
              return '37.90';
            }
            return 'Consultar';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar items={[
          { icon: <ShieldCheck />, title: 'Homologación Oficial', description: 'Pólizas oficiales autorizadas por la DGSFP.' },
          { icon: <Clock />, title: 'Gestión Inmediata', description: 'Alta y emisión de tarjetas médicas en 24 horas.' },
          { icon: <Award />, title: 'Asistencia Máxima', description: 'Acceso completo sin copagos o copagos mínimos.' },
      ]} />

      <ProviderLogoBar
        eyebrow="Aseguradoras oficiales homologadas"
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <PlanComparisonSection
        eyebrow="Modalidades"
        title="Elige la estructura de copago a tu medida"
        description="Sanitas Más Salud cuenta con tres alternativas de contratación para equilibrar el coste mensual y el coste por visita."
        plans={modalitiesList.map((item) => ({ name: item.name, subtitle: item.subtitle, desc: item.desc, priceDetail: item.priceDetail, tag: item.tag, isFeatured: item.isFeatured }))}
        onPlanAction={handleStartQuoting}
        actionLabel="Comparar esta opción"
      />

      <CoverageGrid
        eyebrow="Garantías Médicas"
        title="Coberturas Esenciales del Plan"
        description="Descubre las especificaciones técnicas del seguro médico. Coberturas completas sin límites ocultos."
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title="Cómo contratar en 4 pasos"
        description="Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue."
        steps={[
          {
            title: 'Rellena el formulario',
            description: 'Indica tu edad y elige tu modalidad (sin copago, copago reducido o progresivo) en nuestro cotizador.'
          },
          {
            title: 'Elige forma de pago',
            description: 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción vigente en tu cuota.'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Completa un breve cuestionario digital necesario para activar coberturas y valorar carencias médicas.'
          },
          {
            title: 'Recibe tu póliza',
            description: 'Obtén tu documentación oficial y tarjetas médicas digitales listas para empezar a usar desde el primer día.'
          }
        ]}
      />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      <SanitasTrustSection />

      {/* Active Promotion Banner */}
      <ProductPromotionSection
        badges={[
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Promoción Especial</span>,
          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Nuevos Asegurados</span>
        ]}
        title="Blua Gratis para Siempre"
        description="Contrata ahora a través de VitaBlue y llévate gratis para siempre el módulo de medicina digital Blua, valorado en 8€/mes por persona, con videoconsultas ilimitadas y reembolso de farmacia."
      />

      {/* Modalities Comparison Grid */}
      {showModalities && <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Modalidades</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Elige la estructura de copago a tu medida
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Sanitas Más Salud cuenta con tres alternativas de contratación para equilibrar el coste mensual y el coste por visita.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {modalitiesList.map((item, index) => (
            <div
              key={index}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 bg-white hover:shadow-md ${
                item.isFeatured
                  ? 'border-primary shadow-sm shadow-primary/5 ring-2 ring-primary/5'
                  : 'border-slate-150'
              }`}
            >
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                    {item.tag}
                  </span>
                  {item.isFeatured && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary">Más Elegido</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-h2 font-display font-black text-text-main leading-snug">{item.name}</h3>
                  <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">{item.subtitle}</p>
                </div>

                <p className="text-sm text-text-secondary font-semibold leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-8 border-t border-slate-100 mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-primary">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-text-main">{item.priceDetail}</span>
                </div>

                <Button
                  variant={item.isFeatured ? 'primary' : 'outline'}
                  className="w-full font-bold"
                  onClick={handleStartQuoting}
                >
                  Comparar esta opción
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>}

      <DigitalServicesSection
        eyebrow="Telemedicina blua"
        title="Ventajas digitales integradas"
        description="No esperes en salas de urgencias ni te desplaces innecesariamente. Blua pone a todo el equipo médico de Sanitas en la pantalla de tu móvil o tablet."
        benefits={['Videoconsulta urgente 24/7', 'Receta médica oficial', 'Reembolso en farmacia', 'Planes de salud guiados']}
        visual={(
            <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
              <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-display font-black leading-snug">Mi Sanitas App</h4>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-white">Videoconsulta</span>
                    <p className="text-xs font-bold leading-tight">Médico de urgencia</p>
                    <p className="text-[9px] text-slate-200">Espera estimada: &lt; 5 min</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-white">Mi Receta</span>
                    <p className="text-xs font-bold leading-tight">Prescripción médica</p>
                    <p className="text-[9px] text-slate-200">Disponible y homologada</p>
                  </div>
                </div>

                <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                  Cifrado de datos médicos SSL
                </div>
              </div>
            </div>
        )}
      />

      <FaqSection eyebrow="Preguntas Frecuentes" title="Resolver dudas sobre Sanitas Más Salud" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Necesitas ayuda para elegir tu modalidad de copago?"
        description="Sanitas Más Salud está disponible con copago bajo o sin copagos. Te ayudamos a calcular cuál es más rentable para tu nivel de visitas al médico de forma totalmente gratuita."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20Sanitas%20M%C3%A1s%20Salud."
      />
    </div>
  );
};

export default SanitasMasSalud;
