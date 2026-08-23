import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, GraduationCap
} from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import ProductTransparencyPanel from '../../components/organisms/ProductTransparencyPanel';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductHero from '../../components/organisms/ProductHero';
import { studentTranslations } from '../../utils/translations';
import {
  StudentIllustration,
  TravelIllustration,
  PreventionIllustration,
  HealthIllustration,
  MedicalAttentionIllustration
} from '../../components/illustrations';

export const StudentInsurance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, setVisaRequired, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';
  const t = studentTranslations[lang];

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
  void visaRequirements;

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
      name: 'ASISA Salud Estudiantes',
      subtitle: 'Most Popular & Best Price',
      desc: 'The #1 choice for student visas in Spain. Full coverage with zero copays and zero wait times. Ultra-fast certificate emission in less than 24 hours.',
      priceDetail: 'Official Consular PDF in <24h · From €38/mo',
      tag: 'Best Value',
      badgeColor: 'bg-accent/10 text-accent border border-accent/20',
      isFeatured: true
    },
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'The preferred choice for student visas. Includes the Blua telemedicine module free forever, unlimited video consults, and immediate official certificate.',
      priceDetail: 'Consular PDF certificate instantly · From €45/mo',
      tag: 'Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: false
    },
    {
      name: 'Adeslas Extranjeros Completo',
      subtitle: 'Standard Network Insurance',
      desc: 'Excellent national medical coverage from Adeslas with zero copays. Includes repatriation and international reimbursement for emergencies outside Spain.',
      priceDetail: 'Large network of private hospitals · From €49/mo',
      tag: 'Alternative',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Salud Estudiantes',
      subtitle: 'La Opción Más Contratada y Ágil',
      desc: 'Nuestra opción #1 más recomendada para visados de estudiantes. Cobertura médica completa 100% homologada sin copagos ni carencias. Emisión de certificado express en menos de 24h.',
      priceDetail: 'Certificado consular en <24h · Desde 38€/mes',
      tag: 'Mejor Precio',
      badgeColor: 'bg-accent/10 text-accent border border-accent/20',
      isFeatured: true
    },
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'La opción predilecta para el visado de estudiantes. Incluye el módulo Blua de telemedicina gratis para siempre, videoconsultas ilimitadas y certificado oficial inmediato.',
      priceDetail: 'Certificado consular en PDF al instante · Desde 45€/mes',
      tag: 'Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: false
    },
    {
      name: 'Adeslas Extranjeros Completo',
      subtitle: 'Seguro Médico de Cuadro Nacional',
      desc: 'Excelente cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y asistencia en viajes fuera de España para periodos vacacionales.',
      priceDetail: 'Gran red de clínicas concertadas · Desde 49€/mes',
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
      comment: 'Necesitaba un seguro sin copagos ni carencias para el visado de estudios y estaba perdidísima. Me atendieron al momento por WhatsApp, me recomendaron ASISA y me enviaron el certificado consular en 24h. ¡Visado aprobado!',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos Mendoza',
      meta: 'Estudiante de Grado en Barcelona',
      comment: 'Buscaba un seguro médico para estudiantes en España. En otros comparadores me acribillaron a llamadas. En VitaBlue vi los precios reales de ASISA y Sanitas sin registrarme y contraté por WhatsApp a mi ritmo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Li Wei',
      meta: 'Curso de Idiomas en Sevilla',
      comment: 'Gestión 100% online súper rápida. La documentación en español e inglés llegó a mi correo en horas y fue aceptada por el consulado de España en Pekín sin ningún problema.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'What requirements must health insurance meet for a student visa in Spain?',
      a: 'The policy must meet 4 mandatory conditions: 1) Zero copays or deductibles, 2) Zero wait times (carencias) for medical services, 3) Full coverage equivalent to the Spanish public healthcare system (including hospitalization and surgeries), and 4) Sanitary and funeral repatriation to the country of origin included.'
    },
    {
      q: 'Does travel insurance work for a Spanish student visa?',
      a: 'No. Spanish consulates and immigration offices reject standard travel insurance because it only covers emergency assistance with low financial caps. You must hold comprehensive health insurance from an authorized Spanish insurer (like ASISA or Sanitas).'
    },
    {
      q: 'What is the best health insurance for international students in Spain in 2026?',
      a: 'ASISA Salud Estudiantes is the top-rated choice through VitaBlue for its unbeatable value, comprehensive network across Spain, and fast certificate issuance in less than 24 business hours (starting from approx. €38/month).'
    },
    {
      q: 'Can I purchase the student health insurance before traveling without a NIE or Spanish bank account?',
      a: 'Yes, absolutely. You can apply 100% online from your home country using only your valid Passport and pay securely with an international credit or debit card.'
    },
    {
      q: 'What happens if my student visa is denied by the consulate?',
      a: 'VitaBlue provides a 100% Money-Back Guarantee. If your visa application is rejected, you will receive a full refund upon presenting the official consular rejection letter before the policy start date.'
    },
    {
      q: 'How much does health insurance for international students in Spain cost?',
      a: 'Prices range from €38 to €50 per month (approx. €450 to €550 for a full 12-month academic year), depending on the student\'s age and the chosen insurer (ASISA, Sanitas, or Adeslas).'
    },
    {
      q: 'Does the student health insurance cover accompanying family members?',
      a: 'Yes. Dependents (spouses or children) can be added to the policy or contracted under individual plans, each receiving their official certificate for their visa application.'
    },
    {
      q: 'How long does it take to receive the official consular certificate?',
      a: 'With fast-track insurers like ASISA, the official certificate in PDF is delivered to your email and WhatsApp in less than 24 business hours.'
    },
    {
      q: 'Does the student insurance include dental coverage and European travel assistance?',
      a: 'Yes. Policies include basic dental emergency coverage and emergency travel assistance across Schengen countries (up to €12,000 to €30,000) for leisure trips.'
    },
    {
      q: 'How do I renew my insurance for my student residence card (TIE) extension?',
      a: 'When renewing your TIE/NIE for the next academic year, you can easily renew your existing policy or compare updated rates directly with VitaBlue via WhatsApp.'
    }
  ] : [
    {
      q: '¿Qué requisitos debe tener el seguro médico para el visado de estudiante en España?',
      a: 'Para que el consulado o Extranjería apruebe tu visado de estudiante (o tarjeta TIE), tu seguro debe cumplir 4 requisitos: 1) Sin copagos ni franquicias, 2) Sin periodos de carencia (cobertura desde el primer día), 3) Cobertura sanitaria completa equivalente a la sanidad pública con hospitalización, y 4) Repatriación sanitaria y funeraria al país de origen incluida.'
    },
    {
      q: '¿Sirve un seguro de viaje para solicitar el visado de estudios en España?',
      a: 'No. Los consulados de España (especialmente en Latinoamérica: Colombia, México, Perú, Argentina, Ecuador) rechazan los seguros de viaje estándar porque solo cubren emergencias temporales limitadas. Extranjería exige un seguro médico de salud completo homologado con hospitalización ilimitada.'
    },
    {
      q: '¿Cuál es el mejor seguro médico para estudiantes extranjeros en España en 2026?',
      a: 'ASISA Salud Estudiantes es la opción #1 más recomendada en VitaBlue por su excelente precio (desde 38€/mes), cobertura nacional completa y la emisión más ágil de certificados consulares en menos de 24 horas. Sanitas y Adeslas también son opciones destacadas.'
    },
    {
      q: '¿Puedo contratar el seguro médico antes de viajar y sin tener NIE ni cuenta bancaria en España?',
      a: 'Sí, totalmente. Puedes contratar 100% online desde tu país de origen únicamente con tu número de Pasaporte y pagar con tarjeta internacional (Visa o Mastercard).'
    },
    {
      q: '¿Qué pasa con el dinero del seguro si el consulado me deniega el visado?',
      a: 'En VitaBlue cuentas con Garantía de Reembolso Total. Si el consulado deniega tu visado, te devolvemos el 100% del importe abonado presentando la carta oficial de denegación consular.'
    },
    {
      q: '¿Cuánto cuesta un seguro médico para estudiantes extranjeros en España?',
      a: 'El precio oscila entre 38€ y 50€ al mes (entre 450€ y 550€ por un año académico completo de 12 meses), según la edad y la compañía aseguradora seleccionada.'
    },
    {
      q: '¿El seguro médico para visado cubre a familiares o acompañantes del estudiante?',
      a: 'Sí. Puedes incluir a cónyuges e hijos en la póliza. Cada familiar recibirá su propio certificado consular oficial para tramitar su visado de acompañante.'
    },
    {
      q: '¿Cuánto tiempo tarda en emitirse el certificado consular del seguro médico?',
      a: 'Con aseguradoras ágiles como ASISA, el certificado oficial en PDF se emite y se entrega en tu correo y WhatsApp en menos de 24 horas laborales tras la contratación.'
    },
    {
      q: '¿El seguro médico de estudiante incluye cobertura dental y asistencia en otros países de Europa?',
      a: 'Sí. Incluye revisiones y urgencias dentales básicas, además de asistencia médica en viaje para desplazamientos por Europa y el espacio Schengen (hasta 12.000€ - 30.000€).'
    },
    {
      q: '¿Dónde y cómo puedo renovar mi seguro para prorrogar la estancia por estudios o el NIE?',
      a: 'Para renovar tu tarjeta TIE en Extranjería para el siguiente curso, puedes renovar tu póliza existente o cotizar una mejor tarifa directamente en VitaBlue por WhatsApp.'
    }
  ];


  const isLegacy1 = location.pathname.includes('seguro-medico-estudiantes-extranjeros-espana.html');
  const isLegacy2 = location.pathname.includes('international-students');


  let title = isEnglish
    ? 'Health Insurance for Student Visa Spain | VitaBlue'
    : 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
  let description = isEnglish
    ? 'Compare health insurance for student visas in Spain. Full coverage policies with zero copays, zero wait times, and repatriation included. Oficial certificate in 24h.'
    : 'Compara los seguros médicos para visado de estudiante en España. Pólizas sin copagos, sin carencias y con repatriación obligatoria. Certificados en 24h.';
  let canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance-student-visa-spain'
    : location.pathname.includes('international-students')
      ? 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students'
      : 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes';

  if (isLegacy1) {
    title = 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
    description = 'Seguro médico diseñado para cumplir requisitos habituales de visado de estudiante en España. Sin copagos ni carencias (según condiciones). Certificado oficial en minutos.';
    canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes';
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
        "@type": "FinancialProduct",
        "@id": `${canonicalUrl}#producto`,
        "name": "Sanitas International Students",
        "description": "Seguro médico diseñado para estudiantes extranjeros en España válido para visado. Cobertura sin copagos y sin carencias.",
        "brand": {
          "@type": "Brand",
          "name": "Sanitas"
        },
        "provider": {
          "@id": "https://www.vitablue.es/#organization"
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
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
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
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance-student-visa-spain" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes" />

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
      <ProductBreadcrumbBar items={[{ label: isEnglish ? 'Health Insurance' : 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: isEnglish ? 'Student Insurance' : 'Seguro de Estudiantes', href: isEnglish ? '/en/health-insurance-student-visa-spain' : '/productos/seguros-salud/seguro-medico-estudiantes' }]} />

      <ProductHero badges={[{ label: t.heroTag, icon: <GraduationCap className="h-4 w-4" /> }, { label: isEnglish ? '100% Visa Approved' : '100% Homologado', tone: 'accent' }]} title={t.heroTitle} description={t.heroSubtitle} primaryAction={{ label: t.ctaButton, onClick: handleStartQuoting }} secondaryAction={{ label: t.callAdvisor, href: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20Estudiantes%20Extranjeros.' }} highlights={[isEnglish ? 'Official Certificate in 24h' : 'Certificado oficial en 24h', isEnglish ? 'Repatriation included' : 'Repatriación incluida']}>
        <QuoteEstimator title={isEnglish ? 'Student Price Estimator' : 'Tarificador de Estudiante'} description={isEnglish ? 'Calculate your monthly quote with zero copays.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'} initialAge={22} maxAge={35} options={[{ id: 'undergrad', label: isEnglish ? 'University' : 'Grado/Uni' }, { id: 'master', label: isEnglish ? 'Master/PhD' : 'Máster/Doc' }, { id: 'language', label: isEnglish ? 'Language' : 'Idiomas' }]} initialOption="undergrad" calculatePrice={() => 'Personalizado'} personalizedPriceLabel={isEnglish ? 'Personalized price' : 'Precio personalizado'} priceLabel={isEnglish ? 'Estimated Quote:' : 'Cuota Estimada:'} submitLabel={isEnglish ? 'Start Online Application' : 'Iniciar Contratación Online'} onSubmit={handleStartQuoting} />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: isEnglish ? 'Consular Approval' : 'Homologación Consular', description: isEnglish ? '100% meets Spanish immigration requirements.' : 'Cumple al 100% las exigencias de Extranjería.' },
        { icon: <Clock />, title: isEnglish ? '24-Hour Certificate' : 'Certificado en 24 Horas', description: isEnglish ? 'Receive your official PDF documentation ready to submit.' : 'Recibe tu documentación en PDF lista para presentar.' },
        { icon: <Award />, title: isEnglish ? 'Guaranteed Refund' : 'Devolución Garantizada', description: isEnglish ? '100% refund in case of visa rejection.' : 'Reembolso del 100% en caso de denegación de visado.' },
      ]} />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Approved official insurance companies' : 'Aseguradoras oficiales homologadas'}
        providers={[
          { name: 'ASISA', logoSrc: '/images/logo-asisa.png' },
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Consular Requirements' : 'Requisitos Consulares'}
        title={isEnglish ? 'Official Health Insurance Requirements' : 'Requisitos Oficiales del Seguro Médico'}
        description={isEnglish ? 'All our selected policies strictly comply with the Spanish immigration law for your absolute peace of mind.' : 'Todas nuestras pólizas seleccionadas cumplen estrictamente la ley de extranjería española para tu absoluta tranquilidad.'}
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Plans List section */}
      <PlanComparisonSection
        eyebrow={isEnglish ? 'Multi-Brand Comparison' : 'Comparativa Multimarca'}
        title={isEnglish ? 'Compare Official Student Health Insurances: ASISA vs Sanitas vs Adeslas' : 'Comparativa de Pólizas Oficiales: ASISA vs Sanitas vs Adeslas'}
        plans={plansList}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
        columns={3}
      />

      {/* Transparency section */}
      <ProductTransparencyPanel eyebrow={isEnglish ? 'Radical Transparency' : 'Transparencia Radical'} title={isEnglish ? 'What exactly are you buying?' : '¿Qué estás contratando exactamente?'} description={isEnglish ? 'We show you upfront the legally required inclusions and standard exclusions to avoid surprises when applying for your visa.' : 'Te mostramos sin rodeos las inclusiones requeridas legalmente y las exclusiones estándar para evitar sorpresas al solicitar tu visado.'} inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow={isEnglish ? 'Process' : 'Proceso'}
        title={isEnglish ? 'How to apply in 4 steps' : 'Cómo contratar en 4 pasos'}
        description={isEnglish ? '100% online process, fast and secure with the personalized assistance of VitaBlue.' : 'Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue.'}
        steps={[
          {
            title: isEnglish ? 'Fill in the form' : 'Rellena el formulario',
            description: isEnglish ? 'Enter your age, arrival date in Spain, and select your ideal insurer in our comparator.' : 'Introduce tu edad, fecha de llegada a España y selecciona tu aseguradora ideal en nuestro comparador.'
          },
          {
            title: isEnglish ? 'Choose payment' : 'Elige forma de pago',
            description: isEnglish ? 'Monthly or annual payment; we will show you applicable discounts and current promotions.' : 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción de cuota vigente.'
          },
          {
            title: isEnglish ? 'Health questionnaire' : 'Cuestionario de salud',
            description: isEnglish ? 'Complete a short digital medical questionnaire required for immediate student policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de estudiante.'
          },
          {
            title: isEnglish ? 'Get your policy' : 'Recibe tu póliza',
            description: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present at the consulate.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar en el consulado.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Real reviews' : 'Opiniones reales'}
        title={isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}
        items={testimonials}
      />

      <FaqSection eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'} title={isEnglish ? 'Clear doubts about Student Insurance' : 'Resolver dudas sobre el Seguro de Estudiante'} items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title={isEnglish ? 'Need help with consulate procedures?' : '¿Necesitas ayuda con los trámites del consulado?'}
        description={isEnglish ? 'Our senior advisors perfectly know the specific requirements of each Spanish consulate and immigration office. They will guide you step by step free of charge.' : 'Nuestros asesores senior conocen perfectamente los requisitos específicos de cada consulado español y delegación de extranjería. Te guiarán paso a paso de manera gratuita.'}
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20el%20Seguro%20de%20Salud%20para%20Estudiantes%20Extranjeros."
      />
    </div>
  );
};

export default StudentInsurance;
