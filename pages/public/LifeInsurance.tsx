import React from 'react';
import { lifePlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, ShieldCheck, Clock, Award, Check, Heart, Stethoscope,
  FileText, CreditCard, Shield
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
        "@type": "Product",
        "@id": "https://www.vitablue.es/productos/seguro-vida#producto",
        "name": "Seguro de Vida Familiar",
        "description": "Seguro de vida familiar para proteger la estabilidad de tus seres queridos y cubrir tu hipoteca frente a imprevistos.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "offers": {
          "@type": "Offer",
          "price": "Consultar precio",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://www.vitablue.es/productos/seguro-vida"
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
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Vida', href: '/productos/seguro-vida' }
            ]} 
          />
        </div>
      </div>

      {/* Reusable ProductHero comparison */}
      <ProductHero
        badges={[
          { label: 'Seguros de Vida', icon: <Shield className="h-4 w-4" /> },
          { label: 'Apto para vinculación hipotecaria', tone: 'accent' },
        ]}
        title="Seguro de Vida Familiar"
        description="Asegura la tranquilidad y el futuro financiero de tus seres queridos. Cubre préstamos, hipotecas y garantiza la estabilidad familiar con cuotas mínimas mensuales."
        primaryAction={{ label: 'Calcular Seguro Online', onClick: handleStartQuoting }}
        secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34900839240' }}
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

      {/* Trust Badges */}
      <section className="py-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Tranquilidad Familiar</h4>
              <p className="text-xs text-text-secondary font-semibold">Asegura la manutención y estudios de tus hijos.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Emisión sin Médicos</h4>
              <p className="text-xs text-text-secondary font-semibold">Cuestionario online sin visitas clínicas ni analíticas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Protección Hipotecaria</h4>
              <p className="text-xs text-text-secondary font-semibold">Cancela la hipoteca pendiente en caso de siniestro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Aseguradoras oficiales colaboradoras</p>
          <div className="flex justify-center items-center gap-12 sm:gap-16">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
            <img src="/images/logo-adeslas.svg" alt="Adeslas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales (Symmetric standard grid with clean illustrations) */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantías de vida</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas del Seguro de Vida
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Protección completa y capitales garantizados para asegurar el bienestar de tu familia ante cualquier imprevisto.
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
                    {typeof Illustration === 'function' ? (
                      <Illustration />
                    ) : (
                      <Activity className="w-8 h-8 text-primary" />
                    )}
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Modalidades</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Elige el plan adaptado a tus necesidades
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Compara las tres alternativas de contratación para proteger tu hipoteca, patrimonio o el sustento de tus hijos.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {lifePlans.map((item, index) => (
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary">Más Recomendado</span>
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
      </section>

      {/* Details and Transparency Section */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 w-full bg-white text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Transparencia Radical</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            ¿Qué incluye y qué excluye tu seguro de vida?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Te mostramos sin rodeos las condiciones reales de la póliza de vida para que decidas de forma clara y transparente.
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
                desc: 'Introduce tu edad, capital deseado y si quieres cobertura de invalidez en nuestro cotizador.',
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Revisa tu prima', 
                desc: 'Revisa tu tarifa mensual estimada y vinculación hipotecaria; te indicamos descuentos por pago anual.',
                icon: CreditCard
              },
              { 
                step: '03', 
                title: 'Cuestionario de salud', 
                desc: 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de vida.',
                icon: Heart
              },
              { 
                step: '04', 
                title: 'Recibe tu póliza',
                desc: 'Obtén tu documentación oficial y contrato de seguro firmado digitalmente al instante en tu correo.',
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
            Resolver dudas sobre el Seguro de Vida
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
            <h3 className="text-h2 font-display font-extrabold text-text-main">¿Necesitas asesoría personalizada para tu seguro de vida?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Te ayudamos a comparar las primas de las distintas compañías de forma neutral para proteger a tu familia de la manera más económica. Te asesoramos de forma gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20de%20Vida.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default LifeInsurance;


