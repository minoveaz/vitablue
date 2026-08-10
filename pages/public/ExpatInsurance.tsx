import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, Clock, Award, Check, Heart, ArrowRight,
  FileText, CreditCard, Home
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import TransparencyBlock from '../../components/molecules/TransparencyBlock';
import { Button } from '../../components/atoms/Button';
import { expatTranslations } from '../../utils/translations';
import { 
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const ExpatInsurance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';
  const t = expatTranslations[lang];

  // State for interactive expat pricing estimator
  const [age, setAge] = useState<number>(45);
  const [visaType, setVisaType] = useState<'non-lucrative' | 'golden' | 'regroup'>('non-lucrative');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat');
    navigate('/wizard');
  };

  const visaRequirements = isEnglish ? [
    'Policies with no copays or deductibles (immigration requirement).',
    'Full hospitalization coverage equivalent to the public health system.',
    'No wait times (carencias) for general consultations and emergencies.',
    'Official certificate in Spanish to present at consulates or for NIE.'
  ] : [
    'Pólizas sin copagos ni franquicias (exigencia de Extranjería).',
    'Cobertura de hospitalización completa equivalente a la sanidad pública.',
    'Sin periodos de carencia para consultas generales y urgencias médicas.',
    'Certificado oficial en español para presentar en consulados o NIE.'
  ];

  const inclusions = isEnglish ? [
    'Unlimited access to specialists and high-tech tests in Spain.',
    'Medical and surgical hospitalization in a single private room.',
    '24-hour emergencies and sanitary transport.',
    'Preventive medicine services and annual check-ups.'
  ] : [
    'Acceso ilimitado a especialistas y pruebas de alta tecnología en España.',
    'Hospitalización médica y quirúrgica en habitación individual.',
    'Urgencias 24 horas y traslados sanitarios.',
    'Servicios de medicina preventiva y chequeos anuales.'
  ];

  const exclusions = isEnglish ? [
    'Aesthetic treatments, cosmetic surgery, or elective reconstructive surgery.',
    'Prescribed medications outside the hospital (retail pharmacy).',
    'Pre-existing pathologies not declared in the health questionnaire.',
    'Fertility or assisted reproduction treatments (except in specific plans).'
  ] : [
    'Tratamientos estéticos, cirugía cosmética o reconstructiva electiva.',
    'Medicamentos recetados fuera del hospital (farmacia de calle).',
    'Patologías preexistentes no declaradas en el cuestionario de salud.',
    'Tratamientos de fertilidad o reproducción asistida (salvo en planes específicos).'
  ];

  const coverages = isEnglish ? [
    {
      title: 'No Copays or Deductibles',
      desc: 'Fixed monthly fee policies guaranteeing €0 additional expense on consultations or admissions, complying with consular law.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Full Hospitalization',
      desc: 'Unlimited access to hospital stays in an individual room for a companion and all necessary surgeries.',
      illustration: FamilyIllustration
    },
    {
      title: 'Unlimited Specialists',
      desc: 'Limitless consultations in traumatology, cardiology, dermatology, and over 50,000 national professionals.',
      illustration: HealthIllustration
    },
    {
      title: 'Sanitary Repatriation',
      desc: 'Unlimited legal guarantee of medical transport to the country of origin due to serious illness or death.',
      illustration: TravelIllustration
    },
    {
      title: 'Free Blua Digital Module',
      desc: 'Video consultations with specialists in under 5 minutes and approved e-prescriptions instantly on your mobile app.',
      illustration: HealthIllustration
    },
    {
      title: 'Preventive Medicine',
      desc: 'Guided annual health programs, complete preventive check-ups, and clinical analyses from day one.',
      illustration: PreventionIllustration
    }
  ] : [
    {
      title: 'Sin Copagos ni Franquicias',
      desc: 'Pólizas de cuota fija mensual que garantizan 0€ de gasto adicional en consultas o ingresos, cumpliendo la ley consular.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Hospitalización Completa',
      desc: 'Acceso ilimitado a ingresos hospitalarios en habitación individual para acompañante y todas las cirugías necesarias.',
      illustration: FamilyIllustration
    },
    {
      title: 'Especialistas e Ilimitado',
      desc: 'Consultas sin límites en traumatología, cardiología, dermatología y más de 50.000 profesionales a nivel nacional.',
      illustration: HealthIllustration
    },
    {
      title: 'Repatriación Sanitaria',
      desc: 'Garantía legal ilimitada de repatriación médica al país de origen por enfermedad grave o fallecimiento del asegurado.',
      illustration: TravelIllustration
    },
    {
      title: 'Blua Digital Gratis',
      desc: 'Videoconsultas con especialistas en menos de 5 minutos y receta médica homologada al instante en tu app móvil.',
      illustration: HealthIllustration
    },
    {
      title: 'Medicina Preventiva',
      desc: 'Programas anuales de salud guiados, chequeos preventivos completos y analíticas clínicas desde el primer día.',
      illustration: PreventionIllustration
    }
  ];

  const plansList = isEnglish ? [
    {
      name: 'Sanitas Más Salud (No Copay)',
      subtitle: 'VIP Digital Coverage',
      desc: 'The leading policy for residence visas. Includes the Blua telemedicine module free forever, premium hospitalization, and immediate consular certificate.',
      priceDetail: 'Consular certificate in 24h included',
      tag: 'Best Seller',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total',
      subtitle: '3-Year Price Lock',
      desc: 'Excellent national medical coverage option from Adeslas with zero copays. Includes repatriation and a protected renewal price during the first three years.',
      priceDetail: 'Expanded Adeslas medical network',
      tag: 'Excellent Quality',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas Más Salud (Sin Copago)',
      subtitle: 'Cobertura VIP Digital',
      desc: 'La póliza líder para visados de residencia. Incluye el módulo Blua de telemedicina gratis para siempre, hospitalización premium y certificado consular de emisión inmediata.',
      priceDetail: 'Certificado consular en 24h incluido',
      tag: 'Más Vendido',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total',
      subtitle: 'Tranquilidad 3 Años',
      desc: 'Excelente opción de cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y un precio de renovación protegido durante los primeros tres años.',
      priceDetail: 'Red médica Adeslas ampliada',
      tag: 'Excelente Calidad',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Elena Gutiérrez',
      meta: 'Non-Lucrative Residence (Madrid)',
      comment: 'We contracted family health insurance with VitaBlue for our Non-Lucrative Visa. Super fast, zero copays or carencias, and the medical certificate was accepted at the consulate without any hurdles.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Manuel Ramón',
      meta: 'Golden Visa (Málaga)',
      comment: 'We studied several policies for family reunification and Golden Visa. The VitaBlue advisor helped us wonderfully over WhatsApp, solving all our pre-existing condition queries and sending the approval in 24 hours.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Laura Fernández',
      meta: 'NIE & Residence (Alicante)',
      comment: 'Fantastic express issuance. I needed the policy to renew my residence and they provided it instantly in PDF. Excellent continuous human support.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Elena Gutiérrez',
      meta: 'Residencia No Lucrativa (Madrid)',
      comment: 'Contratamos el seguro médico familiar con VitaBlue para nuestra Residencia No Lucrativa. Súper rápido, sin copagos ni carencias, y el certificado médico fue aceptado en el consulado sin ninguna traba.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Manuel Ramón',
      meta: 'Golden Visa (Málaga)',
      comment: 'Estudiamos varias pólizas para la reagrupación y Golden Visa. La asesora de VitaBlue nos atendió de maravilla por WhatsApp, resolviendo todas nuestras dudas de preexistencias y enviando el alta en 24 horas.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Laura Fernández',
      meta: 'NIE y Residencia (Alicante)',
      comment: 'Emisión express fantástica. Necesitaba la póliza para renovar mi residencia y me la facilitaron al instante en PDF. Excelente soporte humano continuo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'Which insurance is mandatory for the Non-Lucrative Visa?',
      a: 'Immigration requires private health insurance contracted with a company authorized in Spain, providing full coverage (medical and hospital), "without copays" (sin copagos) and "without carencias" (no wait times). Adeslas Plena Total and Sanitas Más Salud comply 100% with these guidelines.'
    },
    {
      q: 'How does the declaration of pre-existing medical conditions work?',
      a: 'Before issuing the insurance, you must fill out a mandatory health questionnaire. If you have any prior medical conditions (e.g., hypertension, diabetes, recent surgeries), the insurer will evaluate it and may accept it, exclude it, or deny the policy. We advise you personally to find the best option.'
    },
    {
      q: 'Can I purchase the insurance before traveling to Spain?',
      a: 'Yes, this is standard and required. You must contract it in advance so that the medical coverage certificate forms part of the documentation you submit to the Consulate of your home country when applying for your visa.'
    }
  ] : [
    {
      q: '¿Qué seguro es obligatorio para la Residencia No Lucrativa?',
      a: 'Extranjería exige un seguro de salud privado contratado con una compañía autorizada en España, que sea de cobertura completa (médica y hospitalaria), "sin copagos" y "sin carencias". Adeslas Plena Total y Sanitas Más Salud cumplen al 100% con estas directrices.'
    },
    {
      q: '¿Cómo funciona la declaración de enfermedades preexistentes?',
      a: 'Antes de emitir el seguro, debes rellenar un cuestionario de salud obligatorio. Si tienes alguna patología previa (ej. hipertensión, diabetes, cirugías recientes), la aseguradora la evaluará y podrá aceptarla, excluirla de la póliza o rechazar el alta. Te asesoramos de forma personalizada para encontrar la compañía idónea.'
    },
    {
      q: '¿Puedo contratar el seguro antes de viajar a España?',
      a: 'Sí, es lo habitual y obligatorio. Debes contratarlo con antelación para que el certificado de cobertura médica forme parte de la documentación que entregues en el Consulado de tu país de origen al solicitar tu visado.'
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
        "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados#producto",
        "name": "Seguro Médico para Expatriados en España",
        "description": "Seguro de salud completo sin copagos y sin carencias para visados de residencia no lucrativa y Golden Visa en España.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
        },
        "offers": {
          "@type": "Offer",
          "price": "Consultar precio",
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "120",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "John D."
            },
            "datePublished": "2025-11-05",
            "reviewBody": "El seguro perfecto para mi Golden Visa. Sin copagos y con todo incluido, la embajada lo aceptó sin ninguna objeción.",
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
            "name": "Expatriados"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué requisitos debe cumplir el seguro para los visados de Residencia No Lucrativa o Golden Visa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Debe ser un seguro de salud completo, sin copagos por consultas, sin periodos de carencia en coberturas (especialmente hospitalización) y con cobertura de repatriación en caso de fallecimiento."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo funciona la declaración de enfermedades preexistentes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Antes de emitir el seguro, debes rellenar un cuestionario de salud obligatorio. Si tienes alguna patología previa (ej. hipertensión, diabetes, cirugías recientes), la aseguradora la evaluará y podrá aceptarla, excluirla de la póliza o rechazar el alta. Te asesoramos de forma personalizada para encontrar la compañía idónea."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo contratar el seguro antes de viajar a España?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, es lo habitual y obligatorio. Debes contratarlo con antelación para que el certificado de cobertura médica forme parte de la documentación que entregues en el Consulado de tu país de origen al solicitar tu visado."
            }
          }
        ]
      }
    ]
  };

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance-expatriates-spain'
    : 'https://www.vitablue.es/productos/seguros-salud/seguro-expatriados';

  const title = isEnglish
    ? 'Health Insurance for Expatriates and Residents in Spain | VitaBlue'
    : 'Seguro Médico para Expatriados y Residentes en España | VitaBlue';

  const description = isEnglish
    ? 'Compare health insurance for expats in Spain. Full coverage with no copays for non-lucrative and Golden Visas with instant certificates.'
    : 'Compara seguros médicos para expatriados en España. Coberturas sin copago para visados de residencia no lucrativa y Golden Visa con certificados inmediatos.';

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Multilingual Alternate Links */}
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-expatriados" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance-expatriates-spain" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-expatriados" />

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
              { label: isEnglish ? 'Expats & Residents' : 'Expatriados', href: isEnglish ? '/en/health-insurance-expatriates-spain' : '/productos/seguros-salud/seguro-expatriados' }
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
                  <Home className="w-4 h-4" /> {t.heroTag}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  {isEnglish ? 'Valid for residency visas' : 'Apto para visados de residencia'}
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
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-cyan" /> {isEnglish ? 'Official certificate in 24h' : 'Certificado oficial en 24h'}</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-cyan" /> {isEnglish ? 'Full coverage with no copays' : 'Cobertura total sin copagos'}</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-h3 font-display font-black text-text-main">
                    {isEnglish ? 'Residency Price Estimator' : 'Tarificador de Residentes'}
                  </h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">
                    {isEnglish ? 'Calculate your monthly quote with zero copays.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Insured Age:' : 'Edad del Asegurado:'} 
                      <span className="text-sm font-sans font-black text-primary ml-1">
                        {age} {isEnglish ? 'years old' : 'años'}
                      </span>
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

                  {/* Visa Type Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Visa / Permit Type' : 'Tipo de Visado / Permiso'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'non-lucrative', label: isEnglish ? 'Non-Lucrative' : 'Residencia NL' },
                        { id: 'golden', label: isEnglish ? 'Golden Visa' : 'Golden Visa' },
                        { id: 'regroup', label: isEnglish ? 'Reunification' : 'Reagrupación' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setVisaType(item.id as typeof visaType)}
                          className={`text-xs font-bold py-2.5 px-1 rounded-xl border text-center transition-all ${
                            visaType === item.id 
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
                    {isEnglish ? 'Estimated Quote:' : 'Cuota Estimada:'}
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
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? 'Consular Approval' : 'Validez Consular'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Absolute guarantee for immigration offices and NIE.' : 'Garantía absoluta ante delegaciones de Extranjería y NIE.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? '24h Express Issuance' : 'Emisión Express 24h'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'We send you the official certificate of coverage on the same day.' : 'Te enviamos el certificado oficial de cobertura en el día.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? '100% Refund' : 'Devolución del 100%'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Full refund guaranteed if the visa is denied.' : 'Reembolso íntegro garantizado si el visado es denegado.'}</p>
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
            {isEnglish ? 'Official Residency Guarantees' : 'Garantías Oficiales para Residencia'}
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
            {isEnglish ? 'Compare expat health insurances' : 'Compara seguros para expatriados'}
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
          <span className="text-xs font-black uppercase tracking-wider text-primary">{isEnglish ? 'Residence & Visa Requirements' : 'Requisitos de Residencia y Visados'}</span>
          <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'What does Immigration require for expats?' : '¿Qué exige Extranjería para expatriados?'}</h2>
          <p className="text-body-reg text-text-secondary leading-relaxed font-medium">
            {isEnglish ? 'If you apply for the Non-Lucrative Visa, Family Reunification or the investor visa (Golden Visa), the contracted insurance in Spain must meet these criteria:' : 'Si solicitas la Residencia No Lucrativa, Reagrupación Familiar o el visado de inversor (Golden Visa), el seguro contratado en España debe cumplir obligatoriamente estos criterios:'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {visaRequirements.map((req, idx) => (
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
              {isEnglish ? 'What does your health insurance include and exclude?' : '¿Qué incluye y qué excluye tu seguro médico?'}
            </h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
              {isEnglish ? 'We detail the real conditions and common exclusions so you can make your decision with complete honesty.' : 'Te detallamos las condiciones reales y exclusiones comunes para que tomes tu decisión con total honestidad.'}
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
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Proceso</span>
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
                desc: isEnglish ? 'Enter your age, arrival date in Spain, and select the visa type (Non-Lucrative, Golden) in our quoting tool.' : 'Introduce tu edad, fecha de llegada a España y selecciona el tipo de visa (No Lucrativa, Golden) en nuestro cotizador.',
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
                desc: isEnglish ? 'Complete a short digital medical questionnaire required for immediate resident policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de residente.',
                icon: Heart
              },
              { 
                step: '04', 
                title: isEnglish ? 'Get your policy' : 'Recibe tu póliza', 
                desc: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present to immigration.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar ante Extranjería.',
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
            {isEnglish ? 'Clear doubts about Expat Insurance' : 'Resolver dudas sobre el Seguro de Expatriados'}
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
            <h3 className="text-h2 font-display font-extrabold text-text-main">{isEnglish ? 'Doubts with Immigration procedures?' : '¿Dudas con los trámites de Extranjería?'}</h3>
            <p className="text-body-reg text-text-secondary font-medium">{isEnglish ? 'Speak directly and free of charge with our advisors. We will clear up your doubts regarding pre-existing conditions, carencias, and policy registrations without any commitment.' : 'Habla con nuestros asesores de forma directa y gratuita. Resolveremos tus dudas sobre preexistencias, carencias y alta de pólizas sin ningún compromiso.'}</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20Expatriados.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default ExpatInsurance;
