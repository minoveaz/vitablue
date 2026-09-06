import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, GraduationCap
} from 'lucide-react';
import TravelVsHealthComparison from '../../components/organisms/TravelVsHealthComparison';
import ProductPromotionSection from '../../components/organisms/ProductPromotionSection';
import GuaranteeRefundSection from '../../components/organisms/GuaranteeRefundSection';
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
import { getProductWhatsAppUrl } from '@/utils/whatsappLinks';
import LeadMagnetBanner from '@/components/molecules/LeadMagnetBanner';
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
    navigate('/wizard/');
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
    'Comprehensive healthcare including general medicine, specialized doctors, and 24/7 emergencies.',
    '100% full hospital stay and medical/surgical hospitalizations with zero copays.',
    'Official sanitary and funeraria repatriation to country of origin without insufficient caps.',
    'Zero waiting periods for all diagnostic tests and immediate consular certificate emission.'
  ] : [
    'Asistencia sanitaria completa en medicina general, especialistas y urgencias 24/7.',
    'Hospitalización médica y quirúrgica al 100% de cobertura sin copagos ni franquicias.',
    'Repatriación sanitaria y funeraria a tu país de origen sin límites insuficientes.',
    'Sin periodos de carencia en consultas o pruebas y certificado oficial consular para el visado.'
  ];

  const exclusions = isEnglish ? [
    'Elective aesthetic treatments, cosmetic medicine, and non-essential surgery.',
    'Out-of-hospital prescription pharmacy medications.',
    'Pre-existing serious conditions not declared in the initial medical application.',
    'Complex dental prosthetics or advanced orthodontics.'
  ] : [
    'Tratamientos estéticos voluntarios, medicina cosmética y cirugía no esencial.',
    'Medicamentos de farmacia recetados fuera del ámbito de hospitalización.',
    'Patologías y lesiones preexistentes graves no declaradas en la solicitud inicial.',
    'Prótesis dentales complejas o tratamientos avanzados de ortodoncia.'
  ];

  const coverages = isEnglish ? [
    {
      title: 'Zero Copays or Deductibles',
      desc: 'Access GP, specialists, and surgeries with 0€ extra fees, as strictly required by Spanish immigration law (RD 557/2011).',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Zero Wait Times (From Day 1)',
      desc: 'Immediate full access from day one to emergency care, complex diagnostics, and full hospital admission without waiting periods.',
      illustration: PreventionIllustration
    },
    {
      title: 'Sanitary & Funeral Repatriation',
      desc: 'Official guarantee of medical transfer and repatriation of remains to your country of origin in case of accident or illness.',
      illustration: TravelIllustration
    },
    {
      title: 'Official Consular PDF Certificate',
      desc: 'Official stamped certificate issued in Spanish with all required clauses ready to attach to your visa or NIE application.',
      illustration: StudentIllustration
    },
    {
      title: 'National Medical Network',
      desc: 'Direct access to over 50,000 specialist doctors and top private hospitals in Madrid, Barcelona, Valencia and across Spain.',
      illustration: HealthIllustration
    },
    {
      title: 'Telemedicine & Digital Health App',
      desc: 'Medical video consultations in under 5 minutes, official e-prescriptions on your smartphone, and 24/7 digital emergency support.',
      illustration: HealthIllustration
    }
  ] : [
    {
      title: 'Póliza 100% Sin Copagos ni Franquicias',
      desc: 'Accede a consultas, análisis y cirugías sin pagar ningún coste adicional, tal como exige estrictamente la ley de extranjería (RD 557/2011).',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Sin Periodos de Carencia (Día 1)',
      desc: 'Cobertura completa desde el primer día en urgencias, pruebas diagnósticas y hospitalización médica o quirúrgica sin esperas.',
      illustration: PreventionIllustration
    },
    {
      title: 'Repatriación Sanitaria y Funeraria',
      desc: 'Garantía obligatoria de traslado sanitario y repatriación de restos mortales a tu país de origen en caso de fallecimiento o accidente.',
      illustration: TravelIllustration
    },
    {
      title: 'Certificado Consular Oficial en 24h',
      desc: 'Documento oficial sellado en español con las cláusulas exactas que exigen embajadas y oficinas de Extranjería para tu visado o NIE.',
      illustration: StudentIllustration
    },
    {
      title: 'Cuadro Médico Nacional Completo',
      desc: 'Acceso directo a más de 50.000 médicos especialistas y a los mejores hospitales privados de Madrid, Barcelona, Valencia y toda España.',
      illustration: HealthIllustration
    },
    {
      title: 'Telemedicina y Videoconsultas en App',
      desc: 'Consultas médicas online en menos de 5 minutos, receta electrónica oficial en el móvil y urgencias 24/7 sin desplazarte.',
      illustration: HealthIllustration
    }
  ];

  const plansList = isEnglish ? [
    {
      name: 'ASISA Salud Estudiantes',
      subtitle: 'Most Popular & Best Price',
      desc: 'The #1 choice for student visas in Spain. Full coverage with zero copays and zero wait times. Ultra-fast certificate emission in less than 24 hours.',
      priceDetail: 'Official Consular PDF in <24h · From €38/mo',
      tag: 'Best Value',
      isFeatured: true
    },
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'The preferred choice for student visas. Includes the Blua telemedicine module free forever, unlimited video consults, and immediate official certificate.',
      priceDetail: 'Consular PDF certificate instantly · From €45/mo',
      tag: 'Recommended',
      isFeatured: false
    },
    {
      name: 'Adeslas Extranjeros Completo',
      subtitle: 'Standard Network Insurance',
      desc: 'Excellent national medical coverage from Adeslas with zero copays. Includes repatriation and international reimbursement for emergencies outside Spain.',
      priceDetail: 'Large network of private hospitals · From €49/mo',
      tag: 'Alternative',
      isFeatured: false
    },
    {
      name: 'DKV Integral Estudiantes',
      subtitle: 'Eco Health & International Care',
      desc: 'Comprehensive coverage with top eco-friendly digital prevention tools and emergency cover when traveling in Schengen Europe.',
      priceDetail: 'Digital certificate in 48h · From €48/mo',
      tag: 'Alternative',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Salud Estudiantes',
      subtitle: 'La Opción Más Contratada y Ágil',
      desc: 'Nuestra opción #1 más recomendada para visados de estudiantes. Cobertura médica completa 100% homologada sin copagos ni carencias. Emisión de certificado express en menos de 24h.',
      priceDetail: 'Certificado consular en <24h · Desde 38€/mes',
      tag: 'Mejor Precio',
      isFeatured: true
    },
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'La opción predilecta para el visado de estudiantes. Incluye el módulo Blua de telemedicina gratis para siempre, videoconsultas ilimitadas y certificado oficial inmediato.',
      priceDetail: 'Certificado consular en PDF al instante · Desde 45€/mes',
      tag: 'Recomendado',
      isFeatured: false
    },
    {
      name: 'Adeslas Extranjeros Completo',
      subtitle: 'Seguro Médico de Cuadro Nacional',
      desc: 'Excelente cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y asistencia en viajes fuera de España para periodos vacacionales.',
      priceDetail: 'Gran red de clínicas concertadas · Desde 49€/mes',
      tag: 'Alternativa',
      isFeatured: false
    },
    {
      name: 'DKV Integral Estudiantes',
      subtitle: 'Salud Digital y Sostenible',
      desc: 'Póliza médica completa sin copagos con cuadro concertado de primer nivel y asistencia de urgencias para viajes por países del espacio Schengen.',
      priceDetail: 'Certificado digital en 48h · Desde 48€/mes',
      tag: 'Alternativa',
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


  const isLegacy2 = location.pathname.includes('international-students');

  let title = isEnglish
    ? 'Health Insurance for Student Visa Spain | VitaBlue'
    : 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
  let description = isEnglish
    ? 'Compare health insurance for student visas in Spain. Full coverage policies with zero copays, zero wait times, and repatriation included. Oficial certificate in 24h.'
    : 'Compara los seguros médicos para visado de estudiante en España. Pólizas sin copagos, sin carencias y con repatriación obligatoria. Certificados en 24h.';
  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance-student-visa-spain/'
    : isLegacy2
      ? 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students/'
      : 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/';

  if (isLegacy2) {
    title = 'Seguro médico para estudiantes extranjeros en España | VitaBlue';
    description = 'Seguro médico para estudiantes extranjeros en España válido para visado. Cobertura sin copagos (según condiciones), certificado digital en minutos. Asesoramiento independiente por VitaBlue.';
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "InsuranceAgency",
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
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "94",
          "bestRating": "5",
          "worstRating": "1"
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
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://www.vitablue.es/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Seguros de Salud",
            "item": "https://www.vitablue.es/productos/seguros-salud/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Seguro Médico Estudiantes",
            "item": canonicalUrl
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
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance-student-visa-spain/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://www.vitablue.es/og-image.jpg" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://www.vitablue.es/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: isEnglish ? 'Health Insurance' : 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: isEnglish ? 'Student Insurance' : 'Seguro de Estudiantes', href: isEnglish ? '/en/health-insurance-student-visa-spain' : '/productos/seguros-salud/seguro-medico-estudiantes' }]} />

      <ProductHero badges={[{ label: t.heroTag, icon: <GraduationCap className="h-4 w-4" /> }, { label: isEnglish ? '100% Visa Approved' : '100% Homologado', tone: 'accent' }]} title={t.heroTitle} description={t.heroSubtitle} primaryAction={{ label: t.ctaButton, onClick: handleStartQuoting }} secondaryAction={{ label: t.callAdvisor, href: getProductWhatsAppUrl('estudiantes', isEnglish) }} highlights={[isEnglish ? 'Official Certificate in 24h' : 'Certificado oficial en 24h', isEnglish ? 'Repatriation included' : 'Repatriación incluida']}>
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
        title={isEnglish ? 'Official Health Insurance Requirements Mandated by Consulates & Immigration' : 'Requisitos Oficiales del Seguro Médico que Exige el Consulado y Extranjería'}
        description={isEnglish ? 'To successfully process your student visa or student residence card (TIE / NIE) in Spain, the Ministry of Inclusion, Social Security and Migration strictly requires your private health insurance to meet 4 legal conditions. At VitaBlue all our policies are pre-configured to 100% meet these requirements:' : 'Para tramitar con éxito tu visado de estancia por estudios o tu tarjeta de estudiante (TIE / NIE) en España, el Ministerio de Inclusión, Seguridad Social y Migraciones exige que tu seguro médico privado cumpla estrictamente con 4 condiciones legales. En VitaBlue todas nuestras pólizas están preconfiguradas para cumplir el 100% de estos requisitos:'}
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Critical Differentiation: Travel vs Health Insurance */}
      <TravelVsHealthComparison
        eyebrow={isEnglish ? 'Crucial Difference' : 'Diferenciación Crítica'}
        title={isEnglish ? 'Why Standard Travel Insurance is NOT Valid for Student Visas' : '¿Por Qué NO Sirve un Seguro de Viaje para el Visado de Estudios?'}
        description={isEnglish ? 'One of the most frequent mistakes made by international students is purchasing a generic travel assistance policy.' : 'Uno de los errores más comunes de los estudiantes internacionales es contratar un seguro de viaje genérico por ser aparentemente más económico.'}
        alertNotice={isEnglish ? '⚠️ Spanish Consulates (especially in Mexico, Colombia, Peru, Argentina, Ecuador, and the US) systematically reject standard travel insurance for long-term study visas and NIE cards.' : '⚠️ Los consulados de España (especialmente en Colombia, México, Perú, Argentina, Ecuador y EE.UU.) rechazan sistemáticamente los seguros de viaje para estancias académicas y tarjetas TIE/NIE.'}
        travelLabel={isEnglish ? 'Standard Travel Insurance' : 'Seguro de Asistencia en Viaje'}
        healthLabel={isEnglish ? 'Compliant Health Insurance (VitaBlue)' : 'Seguro Médico de Salud (VitaBlue)'}
        items={isEnglish ? [
          { feature: 'Coverage Type', travel: 'Emergency assistance only with low financial limits (e.g. max €30,000).', health: 'Unlimited full healthcare coverage, surgeries, and comprehensive hospital stay.' },
          { feature: 'Consular Validity', travel: 'Rejected by consulates and Spanish immigration offices.', health: '100% accepted and approved under Spanish Royal Decree 557/2011.' },
          { feature: 'How it Works', travel: 'Deferred reimbursement (you must pay upfront from your pocket).', health: 'Direct access with zero out-of-pocket expenses to private hospital networks.' },
          { feature: 'Certificate', travel: 'Standard receipt without mandatory consular legal clauses.', health: 'Official Certificate in Spanish stamped and signed by authorized insurer.' },
        ] : [
          { feature: 'Tipo de Cobertura', travel: 'Solo cubre urgencias puntuales con límites económicos estrictos (ej. hasta 30.000€).', health: 'Cobertura médica ilimitada, especialistas, cirugías y hospitalización completa.' },
          { feature: 'Validez Legal Consular', travel: 'Rechazado sistemáticamente por consulados y oficinas de Extranjería.', health: '100% homologado y aceptado bajo el Real Decreto 557/2011.' },
          { feature: 'Forma de Pago Médico', travel: 'Reembolso diferido (tienes que pagar tú primero de tu propio bolsillo).', health: 'Acceso directo con tarjeta médica en hospitales privados sin adelantar dinero.' },
          { feature: 'Certificado de Póliza', travel: 'Recibo genérico que no incluye las cláusulas obligatorias de extranjería.', health: 'Certificado Consular Oficial sellado y firmado por la aseguradora en 24h.' },
        ]}
      />

      {/* Section 4: Standard Design System Plan Comparison */}
      <PlanComparisonSection
        eyebrow={isEnglish ? 'Multi-Brand Comparison' : 'Comparativa Multimarca'}
        title={isEnglish ? 'Compare Official Student Health Insurances: ASISA vs Sanitas vs Adeslas vs DKV' : 'Comparativa de Pólizas Oficiales: ASISA vs Sanitas vs Adeslas vs DKV'}
        description={isEnglish ? 'We compare the leading authorized insurers in Spain so you can choose the fastest certificate and best price with 100% visa approval guarantee.' : 'Comparamos las mejores aseguradoras de España para que elijas la póliza con emisión más rápida y mejor precio con total garantía consular.'}
        plans={plansList}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
        columns={4}
      />

      {/* Section 5: Transparent Pricing Banner (Structured Grid & Bullets) */}
      <ProductPromotionSection
        badges={[
          <span key="1" className="inline-block rounded-full bg-accent text-primary-dark px-3 py-1 text-caption font-extrabold uppercase tracking-wider">
            {isEnglish ? 'Transparent Pricing' : 'Precios Transparentes'}
          </span>,
          <span key="2" className="inline-block rounded-full bg-white/20 text-white px-3 py-1 text-caption font-semibold">
            {isEnglish ? 'No Hidden Fees' : 'Sin Letra Pequeña ni Comisiones Ocultas'}
          </span>
        ]}
        title={isEnglish ? 'Health Insurance Prices for International Students in Spain' : 'Precios del Seguro Médico para Estudiantes Extranjeros en España'}
        description={isEnglish 
          ? 'Clear and fixed rates without surprises. Price depends on your age and the total duration of your academic stay in Spain:'
          : 'Sin letra pequeña ni sorpresas de última hora. Las tarifas para estudiantes varían principalmente según tu edad y la duración de tu estancia académica:'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-white/10 p-5 border border-white/15 backdrop-blur-sm">
            <span className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider block mb-1">
              {isEnglish ? 'Short Stays (3 - 6 mos)' : 'Estancias Cortas (3 a 6 meses)'}
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">
              {isEnglish ? 'From €120 - €240' : 'Desde 120€ - 240€'}
            </p>
            <p className="text-xs text-slate-200 font-medium">
              {isEnglish ? 'Ideal for language courses, Erasmus, and intensive short programs.' : 'Ideal para cursos de idiomas, Erasmus y programas intensivos.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 p-5 border-2 border-accent/60 backdrop-blur-sm relative shadow-md">
            <span className="text-xs font-extrabold text-accent uppercase tracking-wider block mb-1">
              {isEnglish ? 'Full Academic Year (9 - 12 mos)' : 'Año Completo (9 a 12 meses)'}
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">
              {isEnglish ? 'From €450 - €530' : 'Desde 450€ - 530€'}
            </p>
            <p className="text-xs text-slate-200 font-medium">
              {isEnglish ? 'For Bachelor, Master, PhD degrees, with full consular coverage.' : 'Para Grados, Másteres y Doctorados con certificado oficial incluido.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 border border-white/15 backdrop-blur-sm">
            <span className="text-xs font-extrabold text-brand-cyan uppercase tracking-wider block mb-1">
              {isEnglish ? 'TIE / NIE Renewals' : 'Prórroga de Estancia / NIE'}
            </span>
            <p className="text-2xl font-display font-black text-white mb-2">
              {isEnglish ? 'Same Preferential Rates' : 'Mismas Condiciones'}
            </p>
            <p className="text-xs text-slate-200 font-medium">
              {isEnglish ? 'Without surcharges or penalties for continuing your second year.' : 'Sin recargos ni penalizaciones para renovar tu tarjeta en Extranjería.'}
            </p>
          </div>
        </div>
      </ProductPromotionSection>

      {/* Transparency section */}
      <ProductTransparencyPanel eyebrow={isEnglish ? 'Radical Transparency' : 'Transparencia Radical'} title={isEnglish ? 'What exactly are you buying?' : '¿Qué estás contratando exactamente?'} description={isEnglish ? 'We show you upfront the legally required inclusions and standard exclusions to avoid surprises when applying for your visa.' : 'Te mostramos sin rodeos las inclusiones requeridas legalmente y las exclusiones estándar para evitar sorpresas al solicitar tu visado.'} inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow={isEnglish ? 'Simple Process' : 'Contratación Sencilla'}
        title={isEnglish ? 'How to Contract Online in 4 Steps (From Your Home Country)' : 'Cómo Contratar tu Seguro de Estudiante Online en 4 Pasos (Desde tu País)'}
        description={isEnglish ? '100% digital process without requiring a NIE, Spanish bank account, or physical presence in Spain.' : 'Proceso 100% digital sin necesidad de NIE previo, cuenta bancaria en España ni presencia física previa.'}
        steps={[
          {
            title: isEnglish ? 'Step 1: Choose insurer & stay dates' : 'Paso 1: Elige aseguradora y fechas',
            description: isEnglish ? 'Select your preferred company (ASISA, Sanitas, Adeslas) and specify your course start and end dates.' : 'Selecciona tu aseguradora preferida (ASISA, Sanitas, Adeslas) e indica la fecha de inicio y duración de tu estancia.'
          },
          {
            title: isEnglish ? 'Step 2: Enter details with your Passport' : 'Paso 2: Datos solo con Pasaporte (Sin NIE)',
            description: isEnglish ? 'No Spanish NIE or residence card needed. Simply complete the form using your valid passport number.' : 'No necesitas NIE ni trámites complejos. Rellena tus datos personales utilizando tu número de pasaporte vigente.'
          },
          {
            title: isEnglish ? 'Step 3: Secure international online payment' : 'Paso 3: Pago seguro online internacional',
            description: isEnglish ? 'Pay quickly with international credit/debit card (Visa, Mastercard) with zero hidden transaction fees.' : 'Paga con tarjeta de crédito/débito internacional (Visa, Mastercard) o transferencia sin comisiones ocultas.'
          },
          {
            title: isEnglish ? 'Step 4: Download your consular PDF certificate' : 'Paso 4: Descarga tu certificado consular en PDF',
            description: isEnglish ? 'Receive your official certificate in PDF in <24 hours in your inbox and WhatsApp, ready for the consulate.' : 'Recibe en menos de 24 horas tu certificado oficial firmado en PDF en tu correo y WhatsApp, listo para el visado.'
          }
        ]}
      />

      {/* Section 7: Risk-Free Guarantee & Total Refund */}
      <GuaranteeRefundSection
        eyebrow={isEnglish ? 'Risk-Free Guarantee' : 'Garantía Antirriesgo'}
        title={isEnglish ? '100% Money-Back Guarantee for Visa Rejection' : 'Garantía de Reembolso Total por Denegación de Visado'}
        subtitle={isEnglish ? 'We know how stressful the student visa application process can be. At VitaBlue you enjoy a 100% risk-free guarantee:' : 'Sabemos lo estresante que puede ser el proceso de solicitud de visado. Por eso, en VitaBlue cuentas con garantía de cancelación sin riesgo:'}
        description={isEnglish 
          ? 'If for any unforeseen reason the Spanish Consulate or Immigration Office rejects your student visa, we refund 100% of the money paid for your health insurance policy upon sending the official consular rejection letter.'
          : 'Si por cualquier motivo de fuerza mayor el consulado o Extranjería deniega tu solicitud de visado, te reembolsamos el 100% del importe abonado por tu seguro médico. Solo tendrás que enviarnos la copia de la resolución consular oficial.'}
        steps={isEnglish ? [
          { title: '1. Official Rejection Letter', desc: 'Forward the official rejection notification issued by the Spanish consulate.' },
          { title: '2. Express Validation', desc: 'We validate the document with the insurer in under 24 business hours.' },
          { title: '3. 100% Refund', desc: 'You receive the full reimbursement directly to your original payment card.' }
        ] : [
          { title: '1. Notificación Oficial', desc: 'Envíanos la carta o resolución de denegación emitida por el consulado.' },
          { title: '2. Verificación Express', desc: 'Validamos el documento con la aseguradora en menos de 24 horas laborables.' },
          { title: '3. Reembolso del 100%', desc: 'Recibes la devolución íntegra en la misma tarjeta o cuenta de pago.' }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Real reviews' : 'Opiniones reales'}
        title={isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}
        items={testimonials}
      />

      {/* Official Student Visa Checklist Lead Magnet */}
      <section className="px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full">
        <LeadMagnetBanner
          isEnglish={isEnglish}
          sourceContext={isEnglish ? 'student-landing-en' : 'student-landing-es'}
        />
      </section>

      <FaqSection eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'} title={isEnglish ? 'Clear doubts about Student Insurance' : 'Resolver dudas sobre el Seguro de Estudiante'} items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title={isEnglish ? 'Need help with consulate procedures?' : '¿Necesitas ayuda con los trámites del consulado?'}
        description={isEnglish ? 'Our senior advisors perfectly know the specific requirements of each Spanish consulate and immigration office. They will guide you step by step free of charge.' : 'Nuestros asesores senior conocen perfectamente los requisitos específicos de cada consulado español y delegación de extranjería. Te guiarán paso a paso de manera gratuita.'}
        whatsappUrl={getProductWhatsAppUrl('estudiantes', isEnglish)}
      />
    </div>
  );
};

export default StudentInsurance;
