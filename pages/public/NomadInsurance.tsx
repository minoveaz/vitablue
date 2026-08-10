import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Check, Heart, ArrowRight, Laptop,
  FileText, CreditCard, Globe
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import TransparencyBlock from '../../components/molecules/TransparencyBlock';
import { Button } from '../../components/atoms/Button';
import { nomadTranslations } from '../../utils/translations';
import { 
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const NomadInsurance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';
  const t = nomadTranslations[lang];

  // State for interactive nomad pricing estimator
  const [age, setAge] = useState<number>(32);
  const [stayArea, setStayArea] = useState<'major' | 'coasts' | 'rest'>('major');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('nomad');
    navigate('/wizard');
  };

  const nomadRequirements = isEnglish ? [
    'Full hospitalization coverage and medical consultations in Spain.',
    'Policy with international coverage for your periods outside the country.',
    'No copays (official requirement for the Digital Nomad Visa in Spain).',
    'Instant access to telemedicine and multilingual medical support.'
  ] : [
    'Cobertura de hospitalización completa y consultas médicas en España.',
    'Póliza con cobertura internacional para tus periodos fuera del país.',
    'Sin copagos (requisito oficial para el visado de Nómada Digital en España).',
    'Acceso instantáneo a telemedicina y soporte médico multilingüe.'
  ];

  const inclusions = isEnglish ? [
    'Comprehensive medical assistance with free choice of specialists.',
    '24h medical video consultations via the insurance app (Blua/Quiero Cuidarme).',
    'Medical and surgical hospitalization at 100% coverage.',
    'International travel coverage (emergencies and repatriation).'
  ] : [
    'Asistencia médica integral con libre elección de especialistas.',
    'Videoconsultas médicas 24h a través de la app del seguro (Blua/Quiero Cuidarme).',
    'Hospitalización médica y quirúrgica al 100% de cobertura.',
    'Cobertura internacional en viajes (urgencias y repatriación).'
  ];

  const exclusions = isEnglish ? [
    'Aesthetic treatments, cosmetic surgery, or elective reconstructive surgery.',
    'Prescribed medications outside the hospital.',
    'Pre-existing pathologies not previously declared.',
    'Accidents produced under the practice of high-risk sports without hired supplement.'
  ] : [
    'Tratamientos estéticos, cirugía cosmética o reconstructiva electiva.',
    'Medicamentos recetados fuera del hospital.',
    'Patologías preexistentes no declaradas previamente.',
    'Accidentes producidos bajo la práctica de deportes de alto riesgo sin suplemento contratado.'
  ];

  const coverages = isEnglish ? [
    {
      title: 'No Copays or Deductibles',
      desc: 'Approved policies with zero cost per medical act, guaranteeing approval of the digital nomad telework visa.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Global Assistance',
      desc: 'Emergency medical coverage in international travel of up to 90 days per trip anywhere in the world.',
      illustration: TravelIllustration
    },
    {
      title: 'Telemedicine & English',
      desc: '24/7 urgent video consultations and appointments with specialists digitally with option of English care.',
      illustration: HealthIllustration
    },
    {
      title: 'Full Hospitalization',
      desc: 'Hospital admissions covered 100% in a single room with a companion bed and surgeries.',
      illustration: FamilyIllustration
    },
    {
      title: 'Digital E-Prescription',
      desc: 'Approved prescription of medications directly on your mobile, accepted in any pharmacy in Spain.',
      illustration: HealthIllustration
    },
    {
      title: 'Preventive Medicine',
      desc: 'Complete annual health check-ups, analyses, and direct visits to specialists without delays.',
      illustration: PreventionIllustration
    }
  ] : [
    {
      title: 'Sin Copagos ni Franquicias',
      desc: 'Pólizas homologadas sin coste por acto médico, garantizando la aprobación del visado de teletrabajo de nómada.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Asistencia Global',
      desc: 'Cobertura médica de urgencias en viajes internacionales de hasta 90 días por salida en cualquier parte del mundo.',
      illustration: TravelIllustration
    },
    {
      title: 'Telemedicina e Inglés',
      desc: 'Videoconsultas urgentes 24/7 y cita con especialistas de forma digital con opción de atención en inglés.',
      illustration: HealthIllustration
    },
    {
      title: 'Hospitalización Completa',
      desc: 'Ingresos hospitalarios cubiertos al 100% en habitación individual con cama para acompañante e intervenciones.',
      illustration: FamilyIllustration
    },
    {
      title: 'Receta Médica Digital',
      desc: 'Prescripción de medicamentos homologada directamente en tu móvil, aceptada en cualquier farmacia de España.',
      illustration: HealthIllustration
    },
    {
      title: 'Medicina Preventiva',
      desc: 'Chequeos anuales completos de salud, analíticas y visitas al especialista de forma directa y sin demoras.',
      illustration: PreventionIllustration
    }
  ];

  const plansList = isEnglish ? [
    {
      name: 'Sanitas International Students / Nomads',
      subtitle: 'Premium Digital',
      desc: 'The ideal digital option for remote workers in Spain. Blua free forever, video consultations in 5 minutes in English, and immediate PDF certificate accepted by UGE.',
      priceDetail: 'Approved coverage certificate in 24h',
      tag: 'Most Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total (Nomads)',
      subtitle: 'Network Medical Insurance',
      desc: 'Excellent Adeslas national medical policy with zero copays. Includes a large national network of partner hospitals and mandatory sanitary repatriation.',
      priceDetail: 'Adeslas expanded medical network',
      tag: 'Solid Alternative',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas International Students / Nomads',
      subtitle: 'Premium Digital',
      desc: 'La opción digital ideal para trabajadores remotos en España. Blua gratis para siempre, videoconsultas en 5 minutos en inglés y certificado inmediato en PDF aceptado por la UGE.',
      priceDetail: 'Certificado de cobertura homologado en 24h',
      tag: 'Más Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total (Nomads)',
      subtitle: 'Seguro Médico de Cuadro',
      desc: 'Excelente póliza médica nacional de Adeslas sin copagos. Incluye gran red nacional de hospitales concertados y repatriación sanitaria obligatoria.',
      priceDetail: 'Red médica Adeslas ampliada',
      tag: 'Alternativa Sólida',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Thomas K.',
      meta: 'Digital Nomad from Germany (Madrid)',
      comment: 'Needed a full coverage medical insurance for the digital nomad visa in Spain. The WhatsApp help from VitaBlue was incredible: fast, in English, and they sent the consular certificate in hours. Approved on first try!',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Sarah L.',
      meta: 'Remote Worker from UK (Gran Canaria)',
      comment: 'The best part is having Blua. I can consult a doctor in English in 5 minutes via videocall from my phone and get my official prescriptions digitally. Zero copays and no hidden fees.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Mateo D.',
      meta: 'Consultant from USA (Barcelona)',
      comment: 'Great multibrand advice. They compared Sanitas and Adeslas for my specific nomad profile. Standard timeline connecting steps, simple medical checklist, and super professional service.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Thomas K.',
      meta: 'Nómada Digital de Alemania (Madrid)',
      comment: 'Needed a full coverage medical insurance for the digital nomad visa in Spain. The WhatsApp help from VitaBlue was incredible: fast, in English, and they sent the consular certificate in hours. Approved on first try!',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Sarah L.',
      meta: 'Teletrabajadora de UK (Gran Canaria)',
      comment: 'The best part is having Blua. I can consult a doctor in English in 5 minutes via videocall from my phone and get my official prescriptions digitally. Zero copays and no hidden fees.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Mateo D.',
      meta: 'Consultor de USA (Barcelona)',
      comment: 'Great multibrand advice. They compared Sanitas and Adeslas for my specific nomad profile. Standard timeline connecting steps, simple medical checklist, and super professional service.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'Does the health insurance comply with the Digital Nomad Visa requirements?',
      a: 'Yes, the official policies with no copays from Sanitas and Adeslas are approved and comply 100% with the requirements of the UGE (Unidad de Grandes Empresas) and Spanish consulates to process and grant the digital nomad telework visa.'
    },
    {
      q: 'Am I covered if I travel outside of Spain?',
      a: 'Yes. Unlike a traditional local private health insurance, our special plans for digital nomads include emergency travel assistance worldwide, backed by top-tier networks (such as Sanitas Bupa) to protect you wherever you work.'
    },
    {
      q: 'How does telemedicine work in the insurance?',
      a: 'You have access to 24/7 general medicine and emergency videoconsultations, and specialist bookings. Doctors can issue e-prescriptions and referrals for analyses or diagnostics that you can use directly at authorized labs.'
    }
  ] : [
    {
      q: '¿El seguro médico cumple con los requisitos del Visado de Nómada Digital?',
      a: 'Sí, las pólizas oficiales sin copagos de Sanitas y Adeslas están homologadas y cumplen al 100% con los requisitos que exige la UGE (Unidad de Grandes Empresas) y los consulados de España para tramitar y conceder el visado de teletrabajo de nómadas digitales.'
    },
    {
      q: '¿Tengo cobertura si viajo fuera de España?',
      a: 'Sí. A diferencia de un seguro médico privado tradicional local, nuestros planes especiales para nómadas digitales incluyen cobertura de asistencia en viaje internacional de urgencia en todo el mundo, respaldada por redes de primer nivel (como Bupa de Sanitas) para protegerte donde teletrabajes.'
    },
    {
      q: '¿Cómo funciona la telemedicina en el seguro?',
      a: 'Tienes acceso a videoconsultas médicas 24/7 de medicina general y urgencias, y programación de especialistas. Los médicos pueden emitir recetas electrónicas y volantes para análisis o pruebas diagnósticas que podrás usar en laboratorios autorizados directamente.'
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
        "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales#producto",
        "name": "Seguro Médico para Nómadas Digitales",
        "description": "Seguro médico de cobertura completa sin copagos y con asistencia global en viaje para el visado de nómada digital en España.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "offers": {
          "@type": "Offer",
          "price": "Consultar precio",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "88",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Markus K."
            },
            "datePublished": "2025-11-12",
            "reviewBody": "El seguro ideal para nómadas. Cumple los requisitos del visado español, asistencia en viaje global y la atención al cliente de VitaBlue en inglés fue fantástica.",
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
            "name": "Seguros de Salud",
            "item": "https://www.vitablue.es/productos/seguros-salud"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Nómadas Digitales"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Tengo cobertura si viajo fuera de España?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. A diferencia de un seguro médico privado tradicional local, nuestros planes especiales para nómadas digitales incluyen cobertura de asistencia en viaje internacional de urgencia en todo el mundo, respaldada por redes de primer nivel (como Bupa de Sanitas) para protegerte donde teletrabajes."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo funciona la telemedicina en el seguro?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tienes acceso a videoconsultas médicas 24/7 de medicina general y urgencias, y programación de especialistas. Los médicos pueden emitir recetas electrónicas y volantes para análisis o pruebas diagnósticas que podrás usar en laboratorios autorizados directamente."
            }
          }
        ]
      }
    ]
  };

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/digital-nomad-insurance-spain'
    : 'https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales';

  const title = isEnglish
    ? 'Health Insurance for Digital Nomads and Remote Workers | VitaBlue'
    : 'Seguro Médico para Nómadas Digitales y Remotos | VitaBlue';

  const description = isEnglish
    ? 'Compare health insurance for digital nomads and remote workers in Spain. Full compliant medical coverage with zero copays and global travel assistance.'
    : 'Compara seguros médicos para nómadas digitales y teletrabajadores remotos en España. Cobertura médica completa homologada sin copagos y con asistencia global.';

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Multilingual Alternate Links */}
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/digital-nomad-insurance-spain" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales" />

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
              { label: isEnglish ? 'Health Insurance' : 'Seguros de Salud', href: '/productos/seguros-salud' },
              { label: isEnglish ? 'Digital Nomads' : 'Nómadas Digitales', href: isEnglish ? '/en/digital-nomad-insurance-spain' : '/productos/seguros-salud/seguro-nomadas-digitales' }
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
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                  <Laptop className="w-4 h-4" /> {t.heroTag}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  {isEnglish ? 'Valid for UGE & telework visa' : 'Apto para visado UGE y teletrabajo'}
                </span>
              </div>
              
              <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  {t.ctaButton}
                </Button>
                <a href="tel:+34900839240" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    {t.callAdvisor}
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-cyan" /> {isEnglish ? '24/7 Telemedicine in English' : 'Telemedicina 24/7 en inglés'}</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-cyan" /> {isEnglish ? 'Travel assistance coverage' : 'Cobertura en viajes'}</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-h3 font-display font-black text-text-main">
                    {isEnglish ? 'Digital Nomad Estimator' : 'Tarificador Nómada'}
                  </h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">
                    {isEnglish ? 'Calculate your monthly quote with zero copays immediately.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Nomad Age:' : 'Edad del Nómada:'} <span className="text-sm font-sans font-black text-primary ml-1">{age} {isEnglish ? 'years old' : 'años'}</span>
                    </label>
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

                  {/* Main Stay Area Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Primary Stay Location' : 'Zona de Estancia Principal'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'major', label: 'Madrid / Bcn' },
                        { id: 'coasts', label: isEnglish ? 'Islands/Coasts' : 'Islas/Costas' },
                        { id: 'rest', label: isEnglish ? 'Other' : 'Resto' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStayArea(item.id as typeof stayArea)}
                          className={`text-xs font-bold py-2.5 px-1 rounded-xl border text-center transition-all ${
                            stayArea === item.id 
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
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {isEnglish ? 'Estimated Premium:' : 'Cuota Estimada:'}
                  </span>
                  <div className="text-right">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-sans font-black text-text-main">
                        {isEnglish ? 'Personalized price' : 'Precio personalizado'}
                      </span>
                      <span className="text-[10px] font-bold text-text-secondary">
                        {isEnglish ? '€/month' : '€/mes'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="accent" className="w-full font-bold shadow-md shadow-accent/15" onClick={handleStartQuoting}>
                  {isEnglish ? 'Start Online Application' : 'Iniciar Contratación Online'}
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
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? 'Global Assistance' : 'Asistencia Global'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Emergency medical coverage on all your travels.' : 'Cobertura de urgencias médicas en todos tus viajes.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? 'UGE Approved' : 'Homologación UGE'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Zero-copay guarantee compliant with telework visa law.' : 'Garantía sin copagos aceptada por la ley de teletrabajo.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Laptop className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? '24/7 Telemedicine' : 'Telemedicina 24/7'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Video consultation and e-prescription in seconds.' : 'Videoconsulta y receta médica electrónica en segundos.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">{isEnglish ? 'Approved official insurance companies' : 'Aseguradoras oficiales homologadas'}</p>
          <div className="flex justify-center items-center gap-12 sm:gap-16">
            <img src="/images/logo-sanitas.svg" alt="Sanitas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
            <img src="/images/logo-adeslas.svg" alt="Adeslas" className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200" />
          </div>
        </div>
      </section>

      {/* Coberturas Esenciales */}
      <section className="py-16 sm:py-20 w-full max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Required Conditions' : 'Condiciones Exigidas'}</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            {isEnglish ? 'Medical Guarantees for Nomads' : 'Garantías Médicas para Nómadas'}
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            {isEnglish ? 'All our selected policies strictly comply with the Spanish immigration law for your absolute peace of mind.' : 'Todas nuestras pólizas seleccionadas cumplen estrictamente la ley de extranjería española para tu absoluta tranquilidad.'}
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

      {/* Plans List section */}
      <section className="py-16 sm:py-20 w-full max-w-5xl mx-auto px-6 sm:px-8 text-left bg-slate-50/50 border-t border-b border-slate-100">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Available Options' : 'Opciones Disponibles'}</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            {isEnglish ? 'Compare nomad health insurances' : 'Compara seguros para nómadas'}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
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
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary">{isEnglish ? 'Recommended' : 'Recomendado'}</span>
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
                  {isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 bg-white text-left">
        <div className="rounded-3xl border border-slate-150 bg-slate-50/50 p-6 sm:p-10 space-y-6 shadow-inner">
          <span className="text-xs font-black uppercase tracking-wider text-primary">{isEnglish ? 'Coverage Specifications' : 'Especificaciones de Cobertura'}</span>
          <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'What requirements must the nomad insurance meet?' : '¿Qué requisitos debe cumplir el seguro de nómada?'}</h2>
          <p className="text-body-reg text-text-secondary leading-relaxed font-medium">
            {isEnglish ? 'The international telework law in Spain requires private health insurance with solid features to approve legal stay:' : 'La ley del teletrabajo internacional en España exige un seguro médico privado con características sólidas para aprobar la estancia legal:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {nomadRequirements.map((req, idx) => (
              <div key={idx} className="flex gap-3 text-sm font-bold text-text-main leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency section */}
      <section className="py-16 sm:py-20 bg-slate-50/50 border-t border-b border-slate-100 w-full text-left">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 w-full">
          <div className="text-center space-y-4 mb-12">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Radical Transparency' : 'Transparencia Radical'}</span>
            <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
              {isEnglish ? 'What does your telework insurance include and exclude?' : '¿Qué incluye y qué excluye tu seguro de teletrabajo?'}
            </h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
              {isEnglish ? 'We show you with crystal clarity the real scope of the remote worker medical insurance so you can contract with security.' : 'Te mostramos con claridad cristalina el alcance real del seguro médico de teletrabajador para que contrates con seguridad.'}
            </p>
          </div>

          <TransparencyBlock 
            inclusions={inclusions}
            exclusions={exclusions}
          />
        </div>
      </section>

      {/* How to hire in 4 steps Onboarding timeline */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 text-left border-t border-slate-100">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Process' : 'Proceso'}</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            {isEnglish ? 'How to apply in 4 steps' : 'Cómo contratar en 4 pasos'}
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            {isEnglish ? '100% online process, fast and secure with the personalized assistance of VitaBlue.' : 'Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue.'}
          </p>
        </div>

        <div className="relative">
          {/* Horizontal dashed line connecting the steps (visible on desktop) */}
          <div className="absolute top-[48px] left-[12%] right-[12%] h-0.5 border-t border-dashed border-slate-200 z-0 hidden lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {[
              { 
                step: '01', 
                title: isEnglish ? 'Fill in the form' : 'Rellena el formulario', 
                desc: isEnglish ? 'Enter your age, arrival date in Spain, and select if traveling with family in our comparator.' : 'Introduce tu edad, fecha de llegada a España y detalla si viajas con familia en nuestro comparador.',
                icon: FileText
              },
              { 
                step: '02', 
                title: isEnglish ? 'Choose payment' : 'Elige forma de pago', 
                desc: isEnglish ? 'Monthly or annual payment; we will show you applicable discounts and current promotions.' : 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción de cuota vigente.',
                icon: CreditCard
              },
              { 
                step: '03', 
                title: isEnglish ? 'Health questionnaire' : 'Cuestionario de salud', 
                desc: isEnglish ? 'Complete a short digital medical questionnaire required for immediate nomad policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de nómada.',
                icon: Heart
              },
              { 
                step: '04', 
                title: isEnglish ? 'Get your policy' : 'Recibe tu póliza', 
                desc: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present to the UGE.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar ante la UGE.',
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
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Real reviews' : 'Opiniones reales'}</span>
            <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}</h2>
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            {isEnglish ? 'Clear doubts about Nomad Insurance' : 'Resolver dudas sobre el Seguro de Nómadas'}
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
            <h3 className="text-h2 font-display font-extrabold text-text-main">{isEnglish ? 'Doubts with coverage outside Spain?' : '¿Dudas con la cobertura fuera de España?'}</h3>
            <p className="text-body-reg text-text-secondary font-medium">{isEnglish ? 'Ask our advisors over WhatsApp directly and free of charge. You will get fast answers on how the medical network works in your travel destinations without any commitment.' : 'Pregunta a nuestros asesores por WhatsApp de forma directa y gratuita. Obtendrás respuestas rápidas sobre cómo funciona la red médica en tus destinos de viaje sin ningún compromiso.'}</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20N%C3%B3madas%20Digitales.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default NomadInsurance;
