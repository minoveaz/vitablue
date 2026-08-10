import React from 'react';
import { sanitasMascotasPlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Clock, Award, Check, Heart,
  FileText, CreditCard, Dog
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import TransparencyBlock from '../../components/molecules/TransparencyBlock';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import ProductHero from '../../components/organisms/ProductHero';
import { Button } from '../../components/atoms/Button';
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

  const canonicalUrl = 'https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas';
  const title = 'Sanitas Mascotas | Seguro Veterinario para Perros y Gatos | VitaBlue';
  const description = 'Protege a tu perro o gato con Sanitas Mascotas. Seguro médico veterinario con consultas ilimitadas, vacunas incluidas y acceso a red nacional.';

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
        "name": "Sanitas Salud Mascotas",
        "description": "Sanitas Mascotas: seguro veterinario con reembolso del 80%, hasta 2.500 €/año. Libre elección de veterinario y gestión 100% digital.",
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
          "ratingValue": "4.7",
          "reviewCount": "52",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Carlos G."
            },
            "datePublished": "2025-11-18",
            "reviewBody": "Excelente servicio veterinario. Nos reembolsaron el 80% de la factura de urgencias en menos de 48 horas.",
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
              "name": "Marta F."
            },
            "datePublished": "2025-10-12",
            "reviewBody": "Muy contenta con las videoconsultas veterinarias gratuitas y las vacunas incluidas. Muy recomendable para perros.",
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
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
              { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' },
              { label: 'Seguro de Mascotas', href: '/productos/seguro-mascotas/sanitas-mascotas' }
            ]} 
          />
        </div>
      </div>

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguro Veterinario Oficial', icon: <Dog className="h-4 w-4" /> },
          { label: 'Sin exclusión por raza', tone: 'accent' },
        ]}
        title="Sanitas Mascotas"
        description="Cuidado integral veterinario para tu perro o gato. Consultas gratis ilimitadas, vacuna de la rabia incluida y acceso a más de 400 centros de salud animal en España."
        primaryAction={{ label: 'Calcular Póliza Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34900839240' }}
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

      {/* Trust Badges */}
      <section className="py-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Homologación Oficial</h4>
              <p className="text-xs text-text-secondary font-semibold">Pólizas veterinarias emitidas por Sanitas Seguros.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Emisión en 24 Horas</h4>
              <p className="text-xs text-text-secondary font-semibold">Alta digital inmediata y póliza lista en el día.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Sin Copagos Veterinarios</h4>
              <p className="text-xs text-text-secondary font-semibold">Consultas y revisiones incluidas a coste cero.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Aseguradora veterinaria oficial</p>
          <div className="flex justify-center items-center">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales (Symmetric standard grid with clean illustrations) */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantías Veterinarias</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas Esenciales del Seguro
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Garantizamos la máxima cobertura médica para que cuides a tu perro o gato sin sorpresas económicas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coverages.map((item, index) => {
            const Illustration = item.illustration;
            return (
              <div 
                key={index} 
                className="rounded-3xl border border-slate-150 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
              >
                <div className="space-y-4">
                  {/* Clean illustration container directly in flex */}
                  <div className="h-16 w-auto aspect-[4/3] mb-4 flex items-center justify-start text-primary">
                    <Illustration />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-display font-black text-text-main leading-tight">{item.title}</h3>
                    <p className="text-xs text-text-secondary font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modalities Comparison Grid */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-slate-50/50 border-t border-b border-slate-100">
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
          {sanitasMascotasPlans.map((item, index) => (
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary">Más Popular</span>
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
                  Comparar este plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details and Transparency Section */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 w-full bg-white text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Transparencia Radical</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            ¿Qué incluye y qué excluye Sanitas Mascotas?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Te mostramos sin rodeos las coberturas veterinarias para que cuides a tu mejor amigo con total tranquilidad y conocimiento.
          </p>
        </div>

        <TransparencyBlock 
          inclusions={inclusions}
          exclusions={exclusions}
        />
      </section>

      {/* How to hire in 4 steps Onboarding timeline */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 text-left border-t border-slate-100">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Proceso</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Cómo contratar en 4 pasos
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal dashed line connecting the steps (visible on desktop) */}
          <div className="absolute top-[48px] left-[12%] right-[12%] h-0.5 border-t border-dashed border-slate-200 z-0 hidden lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {[
              { 
                step: '01', 
                title: 'Rellena el formulario', 
                desc: 'Indica los datos de tu perro o gato y selecciona el plan ideal (Básica, Completa o Reembolso) en nuestro cotizador.',
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Elige forma de pago', 
                desc: 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción vigente en tu cuota.',
                icon: CreditCard
              },
              { 
                step: '03', 
                title: 'Cuestionario de salud', 
                desc: 'Completa un breve cuestionario digital necesario para declarar la salud y activar coberturas veterinarias del animal.',
                icon: Heart
              },
              { 
                step: '04', 
                title: 'Recibe tu póliza',
                desc: 'Obtén tu documentación oficial y tarjetas médicas digitales listas para empezar a usar desde el primer día.',
                icon: ShieldCheck
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-sans font-black text-primary/65">{item.step}</span>
                    <div className="size-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-text-main">{item.title}</h4>
                  <p className="text-xs text-text-secondary font-semibold leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-slate-50/50 border-y border-slate-100 w-full text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Opiniones reales</span>
            <h2 className="text-h2 font-display font-black text-text-main">La experiencia de quienes ya confían en nosotros</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, idx) => (
              <TestimonialCard
                key={idx}
                author={item.author}
                meta={item.meta}
                comment={item.comment}
                stars={item.stars}
                avatarUrl={item.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section className="py-16 sm:py-20 w-full max-w-4xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Preguntas Frecuentes</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Resolver dudas sobre Sanitas Mascotas
          </h2>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-inner divide-y divide-slate-200/60">
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              title={faq.q}
              defaultOpen={index === 0}
            >
              {faq.a}
            </Accordion>
          ))}
        </div>
      </section>

      {/* Human Advisor Help section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100 w-full">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8 text-left">
          <div className="space-y-1">
            <h3 className="text-h2 font-display font-extrabold text-text-main">¿Tienes dudas sobre los límites de edad?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Puedes contratar Sanitas Mascotas para perros y gatos desde los 3 meses hasta los 9 años de edad. Te asesoramos sin compromiso sobre cualquier cobertura veterinaria de forma gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20Sanitas%20Mascotas.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default SanitasMascotas;


