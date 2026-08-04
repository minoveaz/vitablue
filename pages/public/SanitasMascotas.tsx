import React, { useState } from 'react';
import { sanitasMascotasPlans } from '@/domain/products/nonHealthCatalog';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Clock, Award, Check, Heart, ArrowRight,
  FileText, CreditCard, Dog
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import TransparencyBlock from '../../components/molecules/TransparencyBlock';
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

  // State for interactive pricing estimator
  const [mascotType, setMascotType] = useState<'dog' | 'cat'>('dog');
  const [mascotAge, setMascotAge] = useState<number>(3);
  const [mascotPlan, setMascotPlan] = useState<'basic' | 'complete' | 'reimbursement'>('complete');

  const calculateMascotPrice = () => {
    let base = mascotType === 'dog' ? 12.50 : 9.90;
    
    if (mascotPlan === 'basic') {
      base = mascotType === 'dog' ? 9.90 : 7.50;
    } else if (mascotPlan === 'reimbursement') {
      base = mascotType === 'dog' ? 24.90 : 19.95;
    } else {
      // Complete plan
      if (mascotAge > 5) base += 4.50;
    }
    return base.toFixed(2);
  };

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('pet'); // Pet profile
    navigate('/wizard');
  };

  const inclusions = [
    'Consultas de urgencia 24h en clÃƒÂ­nicas veterinarias concertadas.',
    'Revisiones preventivas, vacunas obligatorias de la rabia y consultas veterinarias gratuitas.',
    'Limpieza bucal anual recomendada por veterinarios para perros y gatos.',
    'IndemnizaciÃƒÂ³n en caso de fallecimiento por accidente de la mascota.'
  ];

  const exclusions = [
    'Tratamientos de estÃƒÂ©tica canina u operaciones de peluquerÃƒÂ­a veterinaria.',
    'Medicamentos recetados fuera del ÃƒÂ¡mbito hospitalario o vacunas opcionales.',
    'Intervenciones quirÃƒÂºrgicas por enfermedades previas a la contrataciÃƒÂ³n.',
    'Gastos por residencia veterinaria o guarderÃƒÂ­a.'
  ];

  const coverages = [
    {
      title: 'Consultas Veterinarias',
      desc: 'Visitas ilimitadas gratis a veterinarios generales, de urgencia y especialistas dentro del cuadro concertado de Sanitas.',
      illustration: PetIllustration
    },
    {
      title: 'Vacunas y Rabia',
      desc: 'RevisiÃƒÂ³n preventiva anual y vacuna obligatoria de la rabia incluida a coste cero en todos los planes.',
      illustration: PreventionIllustration
    },
    {
      title: 'Limpieza Bucal Anual',
      desc: 'Una limpieza de boca gratuita al aÃƒÂ±o en centros autorizados para prevenir infecciones y sarro.',
      illustration: DentalIllustration
    },
    {
      title: 'Urgencias 24 Horas',
      desc: 'AtenciÃƒÂ³n telefÃƒÂ³nica de urgencia permanente y clÃƒÂ­nicas veterinarias de guardia disponibles a nivel nacional.',
      illustration: HealthIllustration
    },
    {
      title: 'HospitalizaciÃƒÂ³n y CirugÃƒÂ­a',
      desc: 'Cobertura del 100% de los gastos de quirÃƒÂ³fano, anestesia e ingresos en clÃƒÂ­nicas seleccionadas en caso de enfermedad.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'IndemnizaciÃƒÂ³n por Accidente',
      desc: 'CompensaciÃƒÂ³n econÃƒÂ³mica por el valor de la mascota en caso de fallecimiento accidental para cubrir gastos imprevistos.',
      illustration: TravelIllustration
    }
  ];


  const testimonials = [
    {
      author: 'Carlos Mendoza',
      meta: 'Asegurado con Golden Retriever (4 aÃƒÂ±os)',
      comment: 'ContratÃƒÂ© Sanitas Mascotas y estoy encantado. La vacuna de la rabia y las revisiones anuales son gratis, y el veterinario de urgencia nos atendiÃƒÂ³ genial de madrugada.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'SofÃƒÂ­a Tejera',
      meta: 'Asegurada con Gato SiamÃƒÂ©s (2 aÃƒÂ±os)',
      comment: 'Me gustÃƒÂ³ que no me cobraran recargo por la raza de mi gato. La limpieza bucal anual y las videoconsultas de Blua para dudas rÃƒÂ¡pidas funcionan de maravilla.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Javier Luque',
      meta: 'Asegurado con Pastor AlemÃƒÂ¡n (6 aÃƒÂ±os)',
      comment: 'El trato por WhatsApp de VitaBlue fue sÃƒÂºper claro. Comparamos las opciones de reembolso y nos decidimos por la modalidad completa. ContrataciÃƒÂ³n online rÃƒÂ¡pida.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: 'Ã‚Â¿QuÃƒÂ© lÃƒÂ­mites de edad existen para asegurar a mi perro o gato?',
      a: 'Puedes dar de alta a tu perro o gato a partir de los 3 meses de edad y hasta que cumpla los 9 aÃƒÂ±os. Una vez asegurado, la pÃƒÂ³liza se renueva anualmente de forma vitalicia sin exclusiones.'
    },
    {
      q: 'Ã‚Â¿Existen recargos en la cuota segÃƒÂºn la raza de la mascota?',
      a: 'No. Una de las grandes ventajas de Sanitas Mascotas es que la prima mensual es fija y uniforme. No se aplican recargos adicionales ni variaciones por la raza o tamaÃƒÂ±o de tu mascota.'
    },
    {
      q: 'Ã‚Â¿CÃƒÂ³mo funciona la modalidad de Reembolso?',
      a: 'En la modalidad "Mascotas Reembolso", tienes la libertad de llevar a tu perro o gato a cualquier clÃƒÂ­nica veterinaria de EspaÃƒÂ±a. Abonas la factura y nos la envÃƒÂ­as digitalmente a travÃƒÂ©s de la app; Sanitas te reembolsarÃƒÂ¡ el 80% de los gastos elegibles en un plazo mÃƒÂ¡ximo de 10 dÃƒÂ­as.'
    },
    {
      q: 'Ã‚Â¿QuÃƒÂ© cubre la garantÃƒÂ­a de fallecimiento por accidente?',
      a: 'En caso de que la mascota fallezca debido a un accidente fortuito, la pÃƒÂ³liza indemniza al propietario con un capital de hasta 1.000Ã¢â€šÂ¬ (segÃƒÂºn condiciones de pÃƒÂ³liza) para mitigar los gastos sobrevenidos.'
    }
  ];

  const priceEstimate = calculateMascotPrice();
  
  const canonicalUrl = 'https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas';
  const title = 'Sanitas Mascotas | Seguro Veterinario para Perros y Gatos | VitaBlue';
  const description = 'Protege a tu perro o gato con Sanitas Mascotas. Seguro mÃƒÂ©dico veterinario con consultas ilimitadas, vacunas incluidas y acceso a red nacional.';

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.vitablue.es/#organization",
        "name": "VitaBlue",
        "url": "https://www.vitablue.es/",
        "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
        "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y mÃƒÂ¡s. Asesoramiento personalizado y contrataciÃƒÂ³n 100% online.",
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
        "description": "Sanitas Mascotas: seguro veterinario con reembolso del 80%, hasta 2.500 Ã¢â€šÂ¬/aÃƒÂ±o. Libre elecciÃƒÂ³n de veterinario y gestiÃƒÂ³n 100% digital.",
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

      {/* Hero Banner with Estimator Card on the right */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#94D2BD]">
                  <Dog className="w-4 h-4" /> Seguro Veterinario Oficial
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  Sin exclusiÃƒÂ³n por raza
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
                Sanitas Mascotas
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Cuidado integral veterinario para tu perro o gato. Consultas gratis ilimitadas, vacuna de la rabia incluida y acceso a mÃƒÂ¡s de 400 centros de salud animal en EspaÃƒÂ±a.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Calcular PÃƒÂ³liza Online
                </Button>
                <a href="tel:+34900839240" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Llamar Gratis
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Limpieza dental anual gratis</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Urgencias 24h</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main">Tarificador de Mascota</h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">Calcula la cuota mensual aproximada de tu mascota.</p>
                </div>

                <div className="space-y-4">
                  {/* Mascot Type Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Tipo de Mascota</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMascotType('dog')}
                        className={`text-xs font-bold py-2 px-1 rounded-xl border text-center transition-all ${
                          mascotType === 'dog' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-slate-150 bg-white text-text-secondary hover:bg-slate-50'
                        }`}
                      >
                        Ã°Å¸ÂÂ¶ Perro
                      </button>
                      <button
                        type="button"
                        onClick={() => setMascotType('cat')}
                        className={`text-xs font-bold py-2 px-1 rounded-xl border text-center transition-all ${
                          mascotType === 'cat' 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-slate-150 bg-white text-text-secondary hover:bg-slate-50'
                        }`}
                      >
                        Ã°Å¸ÂÂ± Gato
                      </button>
                    </div>
                  </div>

                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Edad de la Mascota: <span className="text-sm font-sans font-black text-primary ml-1">{mascotAge} {mascotAge === 1 ? 'aÃƒÂ±o' : 'aÃƒÂ±os'}</span></label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="1" 
                        max="9" 
                        value={mascotAge} 
                        onChange={(e) => setMascotAge(parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>

                  {/* Plan Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Plan Veterinario</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'basic', label: 'BÃƒÂ¡sico' },
                        { id: 'complete', label: 'Completo' },
                        { id: 'reimbursement', label: 'Reembolso' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMascotPlan(item.id as any)}
                          className={`text-xs font-bold py-2 px-1 rounded-xl border text-center transition-all ${
                            mascotPlan === item.id 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-slate-150 bg-white text-text-secondary hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Cuota Estimada:</span>
                  <div className="text-right">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-sans font-black text-text-main">Desde {priceEstimate}</span>
                      <span className="text-[10px] font-bold text-text-secondary">Ã¢â€šÂ¬/mes</span>
                    </div>
                  </div>
                </div>

                <Button variant="accent" className="w-full font-bold shadow-md shadow-accent/15" onClick={handleStartQuoting}>
                  Iniciar ContrataciÃƒÂ³n Online
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">HomologaciÃƒÂ³n Oficial</h4>
              <p className="text-xs text-text-secondary font-semibold">PÃƒÂ³lizas veterinarias emitidas por Sanitas Seguros.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">EmisiÃƒÂ³n en 24 Horas</h4>
              <p className="text-xs text-text-secondary font-semibold">Alta digital inmediata y pÃƒÂ³liza lista en el dÃƒÂ­a.</p>
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
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary/70">Aseguradora veterinaria oficial</p>
          <div className="flex justify-center items-center">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales (Symmetric standard grid with clean illustrations) */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">GarantÃƒÂ­as Veterinarias</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas Esenciales del Seguro
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Garantizamos la mÃƒÂ¡xima cobertura mÃƒÂ©dica para que cuides a tu perro o gato sin sorpresas econÃƒÂ³micas.
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
            Elige el nivel de protecciÃƒÂ³n ideal
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Disponemos de tres planes adaptados a las necesidades preventivas y clÃƒÂ­nicas de tu mascota.
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary">MÃƒÂ¡s Popular</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black text-text-main leading-snug">{item.name}</h3>
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
            Ã‚Â¿QuÃƒÂ© incluye y quÃƒÂ© excluye Sanitas Mascotas?
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
            CÃƒÂ³mo contratar en 4 pasos
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Proceso 100% online, rÃƒÂ¡pido y seguro con el acompaÃƒÂ±amiento personalizado de VitaBlue.
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
                desc: 'Indica los datos de tu perro o gato y selecciona el plan ideal (BÃƒÂ¡sica, Completa o Reembolso) en nuestro cotizador.',
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Elige forma de pago', 
                desc: 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promociÃƒÂ³n vigente en tu cuota.',
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
                title: 'Recibe tu pÃƒÂ³liza', 
                desc: 'ObtÃƒÂ©n tu documentaciÃƒÂ³n oficial y tarjetas mÃƒÂ©dicas digitales listas para empezar a usar desde el primer dÃƒÂ­a.',
                icon: ShieldCheck
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-sans font-black text-primary/20">{item.step}</span>
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
            <h2 className="text-h2 font-display font-black text-text-main">La experiencia de quienes ya confÃƒÂ­an en nosotros</h2>
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
            <h3 className="text-2xl font-display font-extrabold text-text-main">Ã‚Â¿Tienes dudas sobre los lÃƒÂ­mites de edad?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Puedes contratar Sanitas Mascotas para perros y gatos desde los 3 meses hasta los 9 aÃƒÂ±os de edad. Te asesoramos sin compromiso sobre cualquier cobertura veterinaria de forma gratuita.</p>
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



