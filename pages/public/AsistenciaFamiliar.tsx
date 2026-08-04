import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Clock, Award, Check, Heart, ArrowRight,
  FileText, CreditCard, Shield
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import TransparencyBlock from '../../components/molecules/TransparencyBlock';
import { Button } from '../../components/atoms/Button';
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

  // State for interactive pricing estimator
  const [age, setAge] = useState<number>(40);
  const [premiumType, setPremiumType] = useState<'levelled' | 'natural' | 'mixed'>('mixed');

  const calculateDecesosPrice = () => {
    let base: number;
    
    if (premiumType === 'levelled') {
      base = age < 30 ? 11.50 : age < 50 ? 19.80 : 29.50;
    } else if (premiumType === 'natural') {
      base = age < 30 ? 3.90 : age < 50 ? 6.50 : 12.80;
    } else {
      // Mixed
      base = age < 30 ? 5.80 : age < 50 ? 9.90 : 18.50;
    }
    return base.toFixed(2);
  };

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat'); // Standard profile
    navigate('/wizard');
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

  const priceEstimate = calculateDecesosPrice();
  
  const canonicalUrl = 'https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar';
  const title = 'Asistencia Familiar Iplus | Seguro de Decesos | VitaBlue';
  const description = 'Protege a tu familia frente a imprevistos con Asistencia Familiar Iplus. Seguro de decesos completo con cobertura de traslado, asesoramiento legal y testamento.';

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
        "name": "Asistencia Familiar iPlus Sanitas",
        "description": "Seguro de asistencia familiar y decesos: servicios funerarios completos, traslado mundial, apoyo emocional y gestión documental.",
        "brand": {
          "@type": "Brand",
          "name": "Sanitas"
        },
        "isSimilarTo": {
          "@type": "Brand",
          "name": "Santalucía"
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
          "ratingValue": "4.8",
          "reviewCount": "76",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Ana B."
            },
            "datePublished": "2025-11-15",
            "reviewBody": "En un momento muy difícil, el servicio fue impecable. Gestionaron todo y nos ayudaron con el traslado internacional.",
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
              "name": "Roberto C."
            },
            "datePublished": "2025-10-08",
            "reviewBody": "Excelente cobertura funeraria y el apoyo emocional fue muy valioso. Totalmente recomendable.",
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
              "name": "Isabel M."
            },
            "datePublished": "2025-09-25",
            "reviewBody": "Contratación sencilla y tranquilidad para toda la familia. El coaseguro con Santalucía es una garantía.",
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
            "name": "Asistencia Familiar iPlus"
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
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
              { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' },
              { label: 'Asistencia Familiar', href: '/productos/seguro-para-decesos/asistencia-familiar' }
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
                  <Shield className="w-4 h-4" /> Seguro de Decesos Familiar
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  Cobertura de traslado internacional
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
                Asistencia Familiar Iplus
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Protección y tranquilidad total para ti y los tuyos ante cualquier imprevisto. Nos encargamos de todos los trámites legales, sepelio y apoyo psicológico familiar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Calcular Cuota Familiar
                </Button>
                <a href="tel:+34900839240" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Llamar Gratis
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Testamento online gratis</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> Trámites de herencia</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main">Tarificador de Decesos</h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">Estima tu prima según tu edad y estructura de pago.</p>
                </div>

                <div className="space-y-4">
                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Edad del Asegurado: <span className="text-sm font-sans font-black text-primary ml-1">{age} años</span></label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="18" 
                        max="75" 
                        value={age} 
                        onChange={(e) => setAge(parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>

                  {/* Premium Type Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">Tipo de Prima</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'levelled', label: 'Nivelada' },
                        { id: 'mixed', label: 'Mixta' },
                        { id: 'natural', label: 'Natural' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPremiumType(item.id as typeof premiumType)}
                          className={`text-xs font-bold py-2.5 px-1 rounded-xl border text-center transition-all ${
                            premiumType === item.id 
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
                      <span className="text-[10px] font-bold text-text-secondary">€/mes</span>
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
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Homologación Oficial</h4>
              <p className="text-xs text-text-secondary font-semibold">Pólizas oficiales autorizadas por la DGSFP.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Gestión Completa</h4>
              <p className="text-xs text-text-secondary font-semibold">Servicio fúnebre, traslados y trámites en 24h.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Asistencia 24/7 Duelo</h4>
              <p className="text-xs text-text-secondary font-semibold">Apoyo psicológico y gestores de servicio de guardia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Garantías Familiares</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Coberturas de Asistencia Familiar
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Máxima cobertura en sepelio, orientación sucesoria y traslados sanitarios para toda la unidad familiar.
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Modalidades de Prima</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Elige tu estructura de pago
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Compara las tres alternativas de tarificación para equilibrar tu cuota mensual a corto y largo plazo.
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
            ¿Qué incluye y qué excluye Asistencia Familiar Iplus?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Te explicamos claramente las exclusiones e inclusiones del seguro de decesos familiar para proteger a los tuyos de manera transparente.
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
                desc: 'Indica los datos de tu familia y selecciona el tipo de prima (Nivelada, Mixta o Natural) en nuestro cotizador.',
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
                desc: 'Completa un breve cuestionario digital necesario para declarar la salud y activar coberturas del seguro.',
                icon: Heart
              },
              { 
                step: '04', 
                title: 'Recibe tu póliza', 
                desc: 'Obtén tu documentación oficial y tarjetas de asistencia familiar listas para empezar a usar desde el primer día.',
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
            Resolver dudas sobre Asistencia Familiar Iplus
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
            <h3 className="text-2xl font-display font-extrabold text-text-main">¿Necesitas asesoría personalizada para tu unidad familiar?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Ofrecemos tarifas colectivas y familiares adaptadas al número de asegurados y edades. Te asesoramos sin ningún coste o compromiso de forma gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20el%20Seguro%20Asistencia%20Familiar%20Iplus.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default AsistenciaFamiliar;
