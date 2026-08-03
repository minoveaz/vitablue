import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, ShieldCheck, Clock, Award, Check, ChevronRight, Phone, MessageSquare, 
  Stethoscope, ShieldAlert, Heart, Calendar, ArrowRight, Laptop, Smartphone, HelpCircle,
  FileText, CreditCard, Globe
} from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import AdvisorCard from '../components/molecules/AdvisorCard';
import Accordion from '../components/molecules/Accordion';
import TestimonialCard from '../components/molecules/TestimonialCard';
import TransparencyBlock from '../components/molecules/TransparencyBlock';
import { Button } from '../components/atoms/Button';
import { 
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
  FamilyIllustration
} from '../components/illustrations';

export const TravelInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, setVisaRequired, resetWizard } = useWizard();

  // State for interactive travel pricing estimator
  const [duration, setDuration] = useState<'escapade' | 'short' | 'long' | 'annual'>('escapade');
  const [destination, setDestination] = useState<'europe' | 'world-no-usa' | 'world-all'>('europe');

  const calculateTravelPrice = () => {
    let base = 18.50;
    if (duration === 'short') base = 32.20;
    if (duration === 'long') base = 59.90;
    if (duration === 'annual') base = 124.00;
    
    if (destination === 'world-no-usa') base *= 1.4;
    if (destination === 'world-all') base *= 1.8;
    return base.toFixed(2);
  };

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

  const plansList = [
    {
      name: 'Viaje Estándar',
      subtitle: 'Escapadas y vacaciones',
      desc: 'La cobertura clásica para viajes vacacionales cortos. Cubre asistencia médica de urgencia hasta 50.000€, repatriación ilimitada y pérdida básica de equipaje.',
      priceDetail: 'Hasta 50.000€ de asistencia médica',
      tag: 'Más Económico',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    },
    {
      name: 'Viaje Estrella',
      subtitle: 'Protección Ampliada',
      desc: 'Perfecto para viajes transoceánicos o fuera de Europa. Eleva la cobertura médica hasta los 150.000€ e incluye cobertura de cancelación de viaje por fuerza mayor.',
      priceDetail: 'Hasta 150.000€ de asistencia médica',
      tag: 'Más Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Viaje Premium',
      subtitle: 'Larga Estancia / Multiviaje',
      desc: 'Diseñado para nómadas y viajeros frecuentes. Permite cubrir viajes de larga duración o contratar una póliza anual que cubre todos tus viajes del año hasta 90 días por salida.',
      priceDetail: 'Póliza anual multiviaje disponible',
      tag: 'Alta Cobertura',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
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

  const priceEstimate = calculateTravelPrice();

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
        "@id": "https://www.vitablue.es/productos/seguro-viaje#producto",
        "name": "Seguro de Viaje Internacional",
        "description": "Seguro de asistencia en viaje internacional con cobertura de gastos médicos, repatriación y anulación.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "offers": {
          "@type": "Offer",
          "price": "Consultar precio",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://www.vitablue.es/productos/seguro-viaje"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "104",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "María T."
            },
            "datePublished": "2025-11-14",
            "reviewBody": "Contraté el seguro de viaje Estrella y tuve que usarlo en Nueva York por una otitis. La asistencia fue rápida y pagaron todo directamente al hospital.",
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
        <link rel="canonical" href="https://www.vitablue.es/productos/seguro-viaje" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seguro de Viaje Internacional | Cobertura Médica | VitaBlue" />
        <meta property="og:description" content="Compara y contrata tu seguro de viaje internacional. Cobertura de gastos médicos, repatriación, pérdida de equipaje y anulación para tus viajes vacacionales o de larga estancia." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguro-viaje" />
        
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
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Viaje', href: '/productos/seguro-viaje' }
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
                  <Globe className="w-4 h-4" /> Seguros de Viaje
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  Asistencia médica mundial 24h
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
                Seguro de Viaje Internacional
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Viaja protegido ante cualquier imprevisto de salud, equipaje o vuelos. Cobertura de gastos médicos internacionales de urgencia y repatriación con soporte continuo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Calcular Seguro Online
                </Button>
                <a href="tel:+34900839240" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Llamar Gratis
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Cobertura de equipaje</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Opción de anulación</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main">Tarificador de Viaje</h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">Estima la prima de tu seguro de viaje al instante.</p>
                </div>

                <div className="space-y-4">
                  {/* Duration Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Duración del Viaje</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'escapade', label: 'Escapada (<15d)' },
                        { id: 'short', label: 'Viaje Corto (<30d)' },
                        { id: 'long', label: 'Larga Estancia' },
                        { id: 'annual', label: 'Anual Multiviaje' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDuration(item.id as any)}
                          className={`text-xs font-bold py-2 px-1 rounded-xl border text-center transition-all ${
                            duration === item.id 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-slate-150 bg-white text-text-secondary hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Destino</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'europe', label: 'Europa/Schengen' },
                        { id: 'world-no-usa', label: 'Mundo (sin USA)' },
                        { id: 'world-all', label: 'Mundo Completo' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDestination(item.id as any)}
                          className={`text-xs font-bold py-2 px-0.5 rounded-xl border text-center transition-all ${
                            destination === item.id 
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
                      <span className="text-[10px] font-bold text-text-secondary">€</span>
                    </div>
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
            <Globe className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Asistencia Mundial 24h</h4>
              <p className="text-xs text-text-secondary font-semibold">Soporte médico continuado en cualquier país.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Emisión Digital Inmediata</h4>
              <p className="text-xs text-text-secondary font-semibold">Recibe tu póliza y justificantes al instante en tu correo.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Garantía de Cancelación</h4>
              <p className="text-xs text-text-secondary font-semibold">Reembolso de gastos de billete por fuerza mayor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary/70">Aseguradoras colaboradoras oficiales</p>
          <div className="flex justify-center items-center gap-12 sm:gap-16">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
            <img src="/images/logo-adeslas.svg" alt="Adeslas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales (Symmetric standard grid with clean illustrations) */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantías en viaje</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas de Asistencia en Viaje
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Disfruta de tu aventura con la máxima protección en cobertura sanitaria, pérdidas de equipaje y anulaciones.
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Modalidades</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Elige el nivel de protección para tu viaje
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Compara nuestras tres alternativas de seguro de viaje internacional según la duración y el destino elegidos.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plansList.map((item, index) => (
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

      {/* Details and Transparency Section */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 w-full bg-white text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Transparencia Radical</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            ¿Qué incluye y qué excluye tu seguro de viaje?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Te mostramos sin rodeos las condiciones de la póliza de viaje para que contrates con absoluta claridad.
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
                desc: 'Introduce tu destino, fechas de viaje y número de viajeros en nuestro cotizador de viajes.',
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Elige tu modalidad', 
                desc: 'Selecciona el plan ideal (Estándar, Estrella o Premium) y revisa las opciones de anulación.',
                icon: CreditCard
              },
              { 
                step: '03', 
                title: 'Completa los datos', 
                desc: 'Introduce los nombres y documentos de identidad de los viajeros de forma rápida digital.',
                icon: Heart
              },
              { 
                step: '04', 
                title: 'Recibe tu póliza', 
                desc: 'Obtén tu documentación oficial y tarjetas médicas digitales al instante en tu correo electrónico.',
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

      {/* Accordion FAQs Section */}
      <section className="py-16 sm:py-20 w-full max-w-4xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Preguntas Frecuentes</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Resolver dudas sobre el Seguro de Viaje
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
            <h3 className="text-2xl font-display font-extrabold text-text-main">¿Necesitas asistencia en la contratación?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Te ayudamos a contratar tu póliza de viaje o a tramitar coberturas de grupo para estancias de larga duración. Te asesoramos sin compromiso de forma gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20de%20Viaje.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default TravelInsurance;
