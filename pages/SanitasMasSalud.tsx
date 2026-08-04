import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, ShieldCheck, Clock, Award, Check, Heart, ArrowRight, Smartphone,
  FileText, CreditCard
} from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import AdvisorCard from '../components/molecules/AdvisorCard';
import Accordion from '../components/molecules/Accordion';
import TestimonialCard from '../components/molecules/TestimonialCard';
import { Button } from '../components/atoms/Button';
import { 
  HealthIllustration, 
  MedicalAttentionIllustration, 
  DentalIllustration, 
  PreventionIllustration,
  FamilyIllustration,
  TravelIllustration
} from '../components/illustrations';

export const SanitasMasSalud: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  // State for interactive pricing estimator widget
  const [age, setAge] = useState<number>(30);
  const [modality, setModality] = useState<'no-copay' | 'low-copay' | 'pro-copay'>('low-copay');

  const calculateEstimatePrice = () => {
    if (age < 18) return '21.50';
    if (age >= 18 && age <= 30) {
      if (modality === 'no-copay') return '39.20';
      if (modality === 'low-copay') return '29.50';
      return '24.10';
    }
    if (age > 30 && age <= 45) {
      if (modality === 'no-copay') return '45.90';
      if (modality === 'low-copay') return '34.80';
      return '28.50';
    }
    if (age > 45 && age <= 60) {
      if (modality === 'no-copay') return '59.90';
      if (modality === 'low-copay') return '46.20';
      return '37.90';
    }
    return 'Consultar';
  };

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
      badgeColor: 'bg-[#94D2BD]/10 text-primary border border-[#94D2BD]/20',
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

  const priceEstimate = calculateEstimatePrice();
  
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
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
              { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' },
              { label: 'Sanitas Más Salud', href: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud' }
            ]} 
          />
        </div>
      </div>

      {/* Hero Banner with Estimator card on the right */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Content column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#94D2BD]">
                  <Activity className="w-4 h-4" /> Seguro de Salud Completo
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  Blua Digital Incluido Gratis
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
                Sanitas Más Salud
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                La póliza integral de Sanitas más contratada en España. Cuadro médico de excelencia, hospitalización completa en habitación individual y videoconsultas en 5 minutos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Comparar Precios Online
                </Button>
                <a href="tel:+34900839240" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Llamar Gratis
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Sin límite de permanencia</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Acceso a Hospitales Sanitas</span>
              </div>
            </div>

            {/* Right Estimator Card Widget (Perfect V1 layout) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main">Estimador de Cuota</h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">Calcula un precio aproximado según tu edad y modalidad.</p>
                </div>

                <div className="space-y-4">
                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Edad del Asegurado: <span className="text-sm font-sans font-black text-primary ml-1">{age} años</span></label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="18" 
                        max="65" 
                        value={age} 
                        onChange={(e) => setAge(parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>

                  {/* Modality Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Modalidad de Copago</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'no-copay', label: 'Sin Copago' },
                        { id: 'low-copay', label: 'Copago Bajo' },
                        { id: 'pro-copay', label: 'Progresivo' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setModality(item.id as any)}
                          className={`text-xs font-bold py-2.5 px-1 rounded-xl border text-center transition-all ${
                            modality === item.id 
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
                    {priceEstimate === 'Consultar' ? (
                      <span className="text-sm font-black text-primary">Consultar asesor</span>
                    ) : (
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-2xl font-sans font-black text-text-main">Desde {priceEstimate}</span>
                        <span className="text-[10px] font-bold text-text-secondary">€/mes</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="accent" className="w-full font-bold shadow-md shadow-accent/15" onClick={handleStartQuoting}>
                  Iniciar Contratación Online
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
              <h4 className="text-sm font-bold text-text-main">Homologación Oficial</h4>
              <p className="text-xs text-text-secondary font-semibold">Pólizas oficiales autorizadas por la DGSFP.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Gestión Inmediata</h4>
              <p className="text-xs text-text-secondary font-semibold">Alta y emisión de tarjetas médicas en 24 horas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Asistencia Máxima</h4>
              <p className="text-xs text-text-secondary font-semibold">Acceso completo sin copagos o copagos mínimos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authorized Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary/70">Aseguradoras oficiales homologadas</p>
          <div className="flex justify-center items-center gap-12 sm:gap-16">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
            <img src="/images/logo-adeslas.svg" alt="Adeslas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales (Symmetric standard grid with clean illustrations) */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantías Médicas</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas Esenciales del Plan
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Descubre las especificaciones técnicas del seguro médico. Coberturas completas sin límites ocultos.
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
                  {/* Clean illustration container (h-16, direct rendering without heavy boxes) */}
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
                desc: 'Indica tu edad y elige tu modalidad (sin copago, copago reducido o progresivo) en nuestro cotizador.',
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
                desc: 'Completa un breve cuestionario digital necesario para activar coberturas y valorar carencias médicas.',
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

      {/* Sanitas & Bupa Trust Stats Section */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantía Sanitas & Bupa</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Líder en salud con respaldo internacional
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Sanitas es la compañía líder en España con más de 70 años de experiencia, respaldada por el grupo global Bupa.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 text-center mb-12">
          {[
            { val: '50.000+', desc: 'Médicos y profesionales' },
            { val: '4.200+', desc: 'Centros médicos asociados' },
            { val: '190+', desc: 'Países de cobertura Bupa' },
            { val: '70+', desc: 'Años de experiencia médica' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col gap-1 shadow-sm">
              <span className="text-3xl font-sans font-black text-primary">{item.val}</span>
              <span className="text-xs font-bold text-text-secondary">{item.desc}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Hospitales Propios de Prestigio', text: 'Acceso a los hospitales La Zarzuela, La Moraleja, CIMA Barcelona y Virgen del Mar con tecnología médica avanzada.' },
            { title: 'Todo Digital con App Mi Sanitas', text: 'Gestiona videoconsultas de urgencia 24/7, autorizaciones médicas, reembolsos y recetas desde tu móvil en segundos.' },
            { title: 'Respaldo del Grupo Bupa', text: 'Con el soporte de una red de salud internacional que cuida a más de 38 millones de clientes en todo el mundo.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-150 rounded-3xl p-6 space-y-2 shadow-sm">
              <h4 className="text-base font-bold text-text-main">{item.title}</h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Active Promotion Banner */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-10 text-white text-left relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(148,210,189,0.12),transparent_50%)] pointer-events-none" />
            <div className="flex flex-wrap gap-2.5 mb-4">
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Promoción Especial</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Nuevos Asegurados</span>
            </div>
            <h3 className="text-3xl font-display font-black leading-tight tracking-tight mb-2">Blua Gratis para Siempre</h3>
            <p className="text-sm text-slate-200 font-medium leading-relaxed max-w-2xl">
              Contrata ahora a través de VitaBlue y llévate gratis para siempre el módulo de medicina digital Blua, valorado en 8€/mes por persona, con videoconsultas ilimitadas y reembolso de farmacia.
            </p>
          </div>
        </div>
      </section>

      {/* Modalities Comparison Grid */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
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
                  Comparar esta opción
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Digital Services & Blua Features */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100 w-full text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid gap-12 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Telemedicina blua</span>
            <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
              Ventajas digitales integradas
            </h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
              No esperes en salas de urgencias ni te desplaces innecesariamente. Blua pone a todo el equipo médico de Sanitas en la pantalla de tu móvil o tablet.
            </p>

            <ul className="grid gap-4 sm:grid-cols-2 text-sm font-semibold text-text-main">
              <li className="flex gap-2.5"><Check className="w-5 h-5 text-primary shrink-0" /> Videoconsulta urgente 24/7</li>
              <li className="flex gap-2.5"><Check className="w-5 h-5 text-primary shrink-0" /> Receta médica oficial</li>
              <li className="flex gap-2.5"><Check className="w-5 h-5 text-primary shrink-0" /> Reembolso en farmacia</li>
              <li className="flex gap-2.5"><Check className="w-5 h-5 text-primary shrink-0" /> Planes de salud guiados</li>
            </ul>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            {/* Phone Mockup rendering digital dashboard */}
            <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
              <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="text-lg font-display font-black leading-snug">Mi Sanitas App</h4>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Videoconsulta</span>
                    <p className="text-xs font-bold leading-tight">Médico de urgencia</p>
                    <p className="text-[9px] text-slate-200">Espera estimada: &lt; 5 min</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Mi Receta</span>
                    <p className="text-xs font-bold leading-tight">Prescripción médica</p>
                    <p className="text-[9px] text-slate-200">Disponible y homologada</p>
                  </div>
                </div>
                
                <div className="text-[9px] font-bold text-center text-slate-200/60 pb-2">
                  Cifrado de datos médicos SSL
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section className="py-16 sm:py-20 w-full max-w-4xl mx-auto px-6 sm:px-8 text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Preguntas Frecuentes</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Resolver dudas sobre Sanitas Más Salud
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
            <h3 className="text-2xl font-display font-extrabold text-text-main">¿Necesitas ayuda para elegir tu modalidad de copago?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Sanitas Más Salud está disponible con copago bajo o sin copagos. Te ayudamos a calcular cuál es más rentable para tu nivel de visitas al médico de forma totalmente gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20Sanitas%20M%C3%A1s%20Salud.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default SanitasMasSalud;
