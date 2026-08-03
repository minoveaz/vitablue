import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, ShieldCheck, Clock, Award, Check, ChevronRight, Phone, MessageSquare, 
  Stethoscope, ShieldAlert, Heart, Calendar, ArrowRight, Laptop, Smartphone, HelpCircle,
  FileText, CreditCard, GraduationCap
} from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import Breadcrumbs from '../components/molecules/Breadcrumbs';
import AdvisorCard from '../components/molecules/AdvisorCard';
import Accordion from '../components/molecules/Accordion';
import TestimonialCard from '../components/molecules/TestimonialCard';
import TransparencyBlock from '../components/molecules/TransparencyBlock';
import { Button } from '../components/atoms/Button';
import { studentTranslations } from '../utils/translations';
import { 
  StudentIllustration,
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration,
  FamilyIllustration
} from '../components/illustrations';

export const StudentInsurance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, setVisaRequired, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';
  const t = studentTranslations[lang];

  // State for interactive student pricing estimator
  const [age, setAge] = useState<number>(22);
  const [courseType, setCourseType] = useState<'undergrad' | 'master' | 'language'>('undergrad');

  const calculateStudentPrice = () => {
    let base = 32.50;
    if (age > 28) base += 4.50;
    if (courseType === 'master') base += 2.10;
    return base.toFixed(2);
  };

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('student');
    setVisaRequired('yes');
    navigate('/wizard');
  };

  const visaRequirements = isEnglish ? [
    'Health insurance company authorized to operate in Spain.',
    'Zero copays and zero deductibles of any kind.',
    'Zero wait times (carencias) for emergency cover.',
    'Sanitary repatriation cover to the country of origin included.'
  ] : [
    'Entidad aseguradora autorizada para operar en España.',
    'Sin copagos ni franquicias de ningún tipo.',
    'Sin periodos de carencia para coberturas de urgencia.',
    'Cobertura de repatriación sanitaria al país de origen incluida.'
  ];

  const inclusions = isEnglish ? [
    'Comprehensive healthcare including general medicine, specialties, and emergencies.',
    '100% covered medical and surgical hospitalization.',
    'Official repatriation guarantee to country of origin in case of illness/death.',
    'Zero copays (access any medical consult with no additional fees).'
  ] : [
    'Asistencia sanitaria completa en medicina general, especialidades y urgencias.',
    'Hospitalización médica y quirúrgica al 100% de cobertura.',
    'Garantía de repatriación sanitaria al país de origen en caso de fallecimiento o enfermedad grave.',
    'Sin copagos (acceso a cualquier consulta médica sin pagar cargos adicionales).'
  ];

  const exclusions = isEnglish ? [
    'Aesthetic treatments, elective reconstructive medicine, and cosmetics.',
    'Out-of-hospital prescription medications.',
    'Pre-existing conditions not declared in the health questionnaire.',
    'Complex dental treatments (such as implants or orthodontics).'
  ] : [
    'Tratamientos estéticos, medicina reconstructiva electiva y cosmética.',
    'Medicamentos recetados fuera del ámbito hospitalario.',
    'Patologías y lesiones preexistentes no declaradas en el cuestionario de salud.',
    'Tratamientos dentales complejos (como implantes u ortodoncia).'
  ];

  const coverages = isEnglish ? [
    {
      title: 'No Copays or Deductibles',
      desc: 'Access consultations, tests, and surgeries without paying any extra cost, as strictly required by consular regulations.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Sanitary Repatriation',
      desc: 'Official and unlimited guarantee of medical transport to the country of origin due to serious illness or death.',
      illustration: TravelIllustration
    },
    {
      title: 'Emergencies & Hospitalization',
      desc: '24/7 continuous medical emergency attention and 100% covered hospital stay expenses.',
      illustration: HealthIllustration
    },
    {
      title: 'National Medical Network',
      desc: 'Direct access to over 50,000 specialist doctors and top-tier hospital networks (Quirón, Ruber, Vithas).',
      illustration: StudentIllustration
    },
    {
      title: 'Free Blua Digital Module',
      desc: 'Medical video consultations in under 5 minutes, official e-prescriptions on your phone, and wellness plans.',
      illustration: HealthIllustration
    },
    {
      title: 'Zero Wait Times',
      desc: 'Coverage active from day one for all emergency medical needs required for your visa approval.',
      illustration: PreventionIllustration
    }
  ] : [
    {
      title: 'Sin Copagos ni Franquicias',
      desc: 'Acceso a consultas, análisis y cirugías sin pagar ningún coste adicional, tal como exige la normativa consular.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Repatriación Sanitaria',
      desc: 'Garantía oficial e ilimitada de traslado sanitario al país de origen por enfermedad grave o fallecimiento del estudiante.',
      illustration: TravelIllustration
    },
    {
      title: 'Urgencias y Hospitalización',
      desc: 'Atención médica continuada de urgencia 24/7 y cobertura de ingreso hospitalario completo al 100% de los gastos.',
      illustration: HealthIllustration
    },
    {
      title: 'Cuadro Médico Nacional',
      desc: 'Acceso directo a más de 50.000 médicos especialistas y red de hospitales de primer nivel (Quirón, Ruber, Vithas).',
      illustration: StudentIllustration
    },
    {
      title: 'Blua Digital Gratis',
      desc: 'Videoconsultas médicas en menos de 5 minutos, receta electrónica oficial en el móvil y planes preventivos incluidos.',
      illustration: HealthIllustration
    },
    {
      title: 'Sin Períodos de Carencia',
      desc: 'Coberturas activas desde el primer día para todas las necesidades médicas de urgencia requeridas para tu visado.',
      illustration: PreventionIllustration
    }
  ];

  const plansList = isEnglish ? [
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'The preferred choice for student visas. Includes the Blua telemedicine module free forever, unlimited video consults, and immediate official certificate.',
      priceDetail: 'Consular PDF certificate instantly',
      tag: 'Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Extra',
      subtitle: 'Standard Network Insurance',
      desc: 'Excellent national medical coverage from Adeslas with zero copays. Includes repatriation and international reimbursement for emergencies outside Spain.',
      priceDetail: 'Large network of private hospitals',
      tag: 'Alternative',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'La opción predilecta para el visado de estudiantes. Incluye el módulo Blua de telemedicina gratis para siempre, videoconsultas ilimitadas y certificado oficial inmediato.',
      priceDetail: 'Certificado consular en PDF al instante',
      tag: 'Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Extra',
      subtitle: 'Seguro Médico de Cuadro',
      desc: 'Excelente cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y reembolso internacional para emergencias fuera de España en periodos vacacionales.',
      priceDetail: 'Gran red de clínicas concertadas',
      tag: 'Alternativa',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Mariana Silva',
      meta: 'Master Student in Madrid',
      comment: 'I needed an insurance policy without copays or wait times for my student visa and was completely lost. They helped me instantly via WhatsApp, recommended the ideal option, and sent my certificate immediately. Visa approved!',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos Mendoza',
      meta: 'Undergrad Student in Barcelona',
      comment: 'I was looking for normal private health insurance. I tried other comparison sites and they bombarded me with telemarketing calls. With VitaBlue I could see the real prices without registering and contracted at my own pace. Excellent.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Li Wei',
      meta: 'Language Course in Seville',
      comment: '100% online management, super fast. The documentation in Spanish and English arrived in my email in minutes and was accepted by the Spanish Consulate in Beijing without any problem.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Mariana Silva',
      meta: 'Estudiante de Máster en Madrid',
      comment: 'Necesitaba un seguro sin copagos ni carencias para el visado de estudios y estaba perdidísima. Me atendieron al momento por WhatsApp, me recomendaron la opción ideal y me enviaron el certificado consular de inmediato. ¡Visado aprobado!',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos Mendoza',
      meta: 'Estudiante de Grado en Barcelona',
      comment: 'Buscaba un seguro de salud privado normal. Probé en otros comparadores y me acribillaron a llamadas telefónicas de telemarketing. En VitaBlue pude ver los precios reales sin registrarme y contraté directamente a mi ritmo. Excelente.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Li Wei',
      meta: 'Curso de Idiomas en Sevilla',
      comment: 'Gestión 100% online súper rápida. La documentación en español e inglés llegó a mi correo en minutos y fue aceptada por el consulado de España en Pekín sin ningún problema.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'What does it mean for the insurance to be "without copays" (sin copagos)?',
      a: 'It means you pay a fixed monthly premium and won\'t have to pay any extra amount when you visit a doctor, have lab tests, or undergo surgery. Spanish immigration offices and consulates strictly require that the insurance has zero copays.'
    },
    {
      q: 'When will I receive the certificate for my student visa?',
      a: 'Once you apply online and complete the first payment, the certificate of coverage and policy details in PDF are automatically generated and sent to your email within a maximum of 24 business hours.'
    },
    {
      q: 'What happens if my visa is denied?',
      a: 'Both Adeslas and Sanitas guarantee a full refund of the amount paid if you present the official visa rejection letter issued by the consulate of Spain, provided you request it before the policy start date.'
    }
  ] : [
    {
      q: '¿Qué significa que el seguro sea "sin copagos"?',
      a: 'Significa que pagas una prima mensual fija y no tendrás que abonar ninguna cantidad adicional cuando vayas al médico, te hagas análisis o te sometas a una intervención. Las oficinas de Extranjería y Consulados exigen explícitamente que el seguro no tenga copagos.'
    },
    {
      q: '¿Cuándo recibiré el certificado para mi visado?',
      a: 'Una vez contratada la póliza online y realizado el primer pago, el certificado de cobertura y las condiciones particulares en PDF se generan automáticamente y se envían a tu correo en un plazo máximo de 24 horas laborales.'
    },
    {
      q: '¿Qué pasa si mi visado es denegado?',
      a: 'Tanto Adeslas como Sanitas garantizan la devolución íntegra del importe abonado si presentas la carta oficial de denegación del visado emitida por el consulado de España, siempre que lo solicites antes de la fecha de inicio de la póliza.'
    }
  ];

  const priceEstimate = calculateStudentPrice();
  
  const isLegacy1 = location.pathname.includes('seguro-medico-estudiantes-extranjeros-espana.html');
  const isLegacy2 = location.pathname.includes('international-students');
  const isLegacy = isLegacy1 || isLegacy2;

  let title = isEnglish
    ? 'Health Insurance for Student Visa Spain | VitaBlue'
    : 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
  let description = isEnglish
    ? 'Compare health insurance for student visas in Spain. Full coverage policies with zero copays, zero wait times, and repatriation included. Oficial certificate in 24h.'
    : 'Compara los seguros médicos para visado de estudiante en España. Pólizas sin copagos, sin carencias y con repatriación obligatoria. Certificados en 24h.';
  let canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance-student-visa-spain'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students';

  if (isLegacy1) {
    title = 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
    description = 'Seguro médico diseñado para cumplir requisitos habituales de visado de estudiante en España. Sin copagos ni carencias (según condiciones). Certificado oficial en minutos.';
    canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students';
  } else if (isLegacy2) {
    title = 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
    description = 'Seguro médico para estudiantes extranjeros en España válido para visado. Cobertura sin copagos (según condiciones), certificado digital en minutos. Asesoramiento independiente por VitaBlue.';
    canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students';
  }

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
        "name": "Sanitas International Students",
        "description": "Seguro médico diseñado para estudiantes extranjeros en España válido para visado. Cobertura sin copagos y sin carencias.",
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
          "ratingValue": "4.8",
          "reviewCount": "94",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "David L."
            },
            "datePublished": "2025-11-10",
            "reviewBody": "El certificado para el visado de estudiante llegó súper rápido. Todo el trámite fue online y sin complicaciones.",
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
              "name": "Sophie M."
            },
            "datePublished": "2025-10-22",
            "reviewBody": "No copay and full medical coverage, perfect for my Erasmus semester in Madrid. Very helpful support in English.",
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
            "name": "Seguro Médico Estudiantes"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿El seguro médico de Sanitas es válido para el visado de estudiante en España?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. Sanitas International Students está diseñado específicamente para cumplir con todos los requisitos de los consulados españoles: sin copagos, sin carencias (en servicios sanitarios cubiertos), con repatriación y un capital de cobertura ilimitado."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuánto se tarda en obtener el certificado oficial para el visado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Una vez confirmada la contratación y el pago, el certificado de seguro digital en español (y en inglés si lo solicitas) se emite y envía a tu correo en menos de 24 horas laborables."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué ocurre si deniegan mi visado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En caso de denegación oficial del visado por parte del consulado, Sanitas permite la cancelación de la póliza y la devolución de la prima abonada, siempre que se presente el justificante oficial antes de la fecha de efecto del seguro."
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

        {/* Multilingual Alternate Links */}
        <link rel="alternate" hreflang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students" />
        <link rel="alternate" hreflang="en" href="https://www.vitablue.es/en/health-insurance-student-visa-spain" />
        <link rel="alternate" hreflang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students" />

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
              { label: isEnglish ? 'Sanitas Insurance' : 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' },
              { label: isEnglish ? 'International Students' : 'Estudiantes Extranjeros', href: isEnglish ? '/en/health-insurance-student-visa-spain' : '/productos/seguros-salud/seguros-sanitas/international-students' }
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
                  <GraduationCap className="w-4 h-4" /> {t.heroTag}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  {isEnglish ? '100% Visa Approved Guarantee' : '100% Visado Garantizado'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
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
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> {isEnglish ? 'Certificate in 24 hours' : 'Certificado en 24 horas'}</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#94D2BD]" /> {isEnglish ? 'Repatriation included' : 'Repatriación incluida'}</span>
              </div>
            </div>

            {/* Right Estimator Card Widget */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-text-main rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-xl font-display font-black text-text-main">
                    {isEnglish ? 'Student Price Estimator' : 'Tarificador de Estudiante'}
                  </h3>
                  <p className="text-xs text-text-secondary font-semibold mt-1">
                    {isEnglish ? 'Calculate your monthly quote with zero copays.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Age Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Student Age:' : 'Edad del Estudiante:'} 
                      <span className="text-sm font-sans font-black text-primary ml-1">
                        {age} {isEnglish ? 'years old' : 'años'}
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="18" 
                        max="35" 
                        value={age} 
                        onChange={(e) => setAge(parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>

                  {/* Course Type Selector */}
                  <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-wider block mb-2">
                      {isEnglish ? 'Type of Studies' : 'Tipo de Estudios'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'undergrad', label: isEnglish ? 'University' : 'Grado/Uni' },
                        { id: 'master', label: isEnglish ? 'Master/PhD' : 'Máster/Doc' },
                        { id: 'language', label: isEnglish ? 'Language' : 'Idiomas' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCourseType(item.id as any)}
                          className={`text-xs font-bold py-2.5 px-1 rounded-xl border text-center transition-all ${
                            courseType === item.id 
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
                        {isEnglish ? `From ${priceEstimate}` : `Desde ${priceEstimate}`}
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
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? 'Consular Approval' : 'Homologación Consular'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? '100% meets Spanish immigration requirements.' : 'Cumple al 100% las exigencias de Extranjería.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? '24-Hour Certificate' : 'Certificado en 24 Horas'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? 'Receive your official PDF documentation ready to submit.' : 'Recibe tu documentación en PDF lista para presentar.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">{isEnglish ? 'Guaranteed Refund' : 'Devolución Garantizada'}</h4>
              <p className="text-xs text-text-secondary font-semibold">{isEnglish ? '100% refund in case of visa rejection.' : 'Reembolso del 100% en caso de denegación de visado.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Logos */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary/70">{isEnglish ? 'Approved official insurance companies' : 'Aseguradoras oficiales homologadas'}</p>
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
            {isEnglish ? 'Official Insurance Guarantees' : 'Garantías Oficiales del Seguro'}
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
            {isEnglish ? 'Compare student health insurances' : 'Compara seguros para estudiantes'}
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
                  {isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency section */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 w-full bg-white text-left">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Radical Transparency' : 'Transparencia Radical'}</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            {isEnglish ? 'What exactly are you buying?' : '¿Qué estás contratando exactamente?'}
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
            {isEnglish ? 'We show you upfront the legally required inclusions and standard exclusions to avoid surprises when applying for your visa.' : 'Te mostramos sin rodeos las inclusiones requeridas legalmente y las exclusiones estándar para evitar sorpresas al solicitar tu visado.'}
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
                desc: isEnglish ? 'Enter your age, arrival date in Spain, and select your ideal insurer in our comparator.' : 'Introduce tu edad, fecha de llegada a España y selecciona tu aseguradora ideal en nuestro comparador.',
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
                desc: isEnglish ? 'Complete a short digital medical questionnaire required for immediate student policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de estudiante.',
                icon: Heart
              },
              { 
                step: '04', 
                title: isEnglish ? 'Get your policy' : 'Recibe tu póliza', 
                desc: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present at the consulate.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar en el consulado.',
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
            {isEnglish ? 'Clear doubts about Student Insurance' : 'Resolver dudas sobre el Seguro de Estudiante'}
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
            <h3 className="text-2xl font-display font-extrabold text-text-main">{isEnglish ? 'Need help with consulate procedures?' : '¿Necesitas ayuda con los trámites del consulado?'}</h3>
            <p className="text-body-reg text-text-secondary font-medium">{isEnglish ? 'Our senior advisors perfectly know the specific requirements of each Spanish consulate and immigration office. They will guide you step by step free of charge.' : 'Nuestros asesores senior conocen perfectamente los requisitos específicos de cada consulado español y delegación de extranjería. Te guiarán paso a paso de manera gratuita.'}</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20Estudiantes%20Extranjeros.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default StudentInsurance;
