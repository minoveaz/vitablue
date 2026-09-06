import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, Home
} from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import ProductRequirementsSection from '../../components/organisms/ProductRequirementsSection';
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
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import { expatTranslations } from '../../utils/translations';
import { getProductWhatsAppUrl } from '@/utils/whatsappLinks';
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

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat');
    navigate('/wizard/');
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
        "@type": "InsuranceAgency",
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
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "120",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/#producto",
        "name": "Seguro Médico para Expatriados en España",
        "description": "Seguro de salud completo sin copagos y sin carencias para visados de residencia no lucrativa y Golden Visa en España.",
        "brand": {
          "@type": "Brand",
          "name": "VitaBlue"
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
            "name": "Expatriados",
            "item": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/"
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
    ? 'https://www.vitablue.es/en/health-insurance-expatriates-spain/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/';

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
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance-expatriates-spain/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/" />

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
      <ProductBreadcrumbBar items={[{ label: isEnglish ? 'Health Insurance' : 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: isEnglish ? 'Expats & Residents' : 'Expatriados', href: isEnglish ? '/en/health-insurance-expatriates-spain' : '/productos/seguros-salud/seguro-expatriados' }]} />

      <ProductHero badges={[{ label: t.heroTag, icon: <Home className="h-4 w-4" /> }, { label: isEnglish ? 'Residency Visa Ready' : 'Apto para visados', tone: 'accent' }]} title={t.heroTitle} description={t.heroSubtitle} primaryAction={{ label: t.ctaButton, onClick: handleStartQuoting }} secondaryAction={{ label: t.callAdvisor, href: 'tel:+34694583452' }} highlights={[isEnglish ? 'Official certificate in 24h' : 'Certificado oficial en 24h', isEnglish ? 'Full coverage with no copays' : 'Cobertura total sin copagos']}>
        <QuoteEstimator title={isEnglish ? 'Residency Price Estimator' : 'Tarificador de Residentes'} description={isEnglish ? 'Calculate your monthly quote with zero copays.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'} initialAge={45} options={[{ id: 'non-lucrative', label: isEnglish ? 'Non-Lucrative' : 'Residencia NL' }, { id: 'golden', label: 'Golden Visa' }, { id: 'regroup', label: isEnglish ? 'Reunification' : 'Reagrupación' }]} initialOption="non-lucrative" calculatePrice={() => 'Personalizado'} personalizedPriceLabel={isEnglish ? 'Personalized price' : 'Precio personalizado'} priceSuffix={isEnglish ? '€/month' : '€/mes'} onSubmit={handleStartQuoting} />
      </ProductHero>

      <ProductTrustBar items={[
          { icon: <ShieldCheck />, title: isEnglish ? 'Consular Approval' : 'Validez Consular', description: isEnglish ? 'Absolute guarantee for immigration offices and NIE.' : 'Garantía absoluta ante delegaciones de Extranjería y NIE.' },
          { icon: <Clock />, title: isEnglish ? '24h Express Issuance' : 'Emisión Express 24h', description: isEnglish ? 'We send you the official certificate of coverage on the same day.' : 'Te enviamos el certificado oficial de cobertura en el día.' },
          { icon: <Award />, title: isEnglish ? '100% Refund' : 'Devolución del 100%', description: isEnglish ? 'Full refund guaranteed if the visa is denied.' : 'Reembolso íntegro garantizado si el visado es denegado.' },
      ]} />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Approved official insurance companies' : 'Aseguradoras oficiales homologadas'}
        providers={[
          { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
          { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
        ]}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Required Conditions' : 'Condiciones Exigidas'}
        title={isEnglish ? 'Official Residency Guarantees' : 'Garantías Oficiales para Residencia'}
        description={isEnglish ? 'All our selected policies strictly comply with the Spanish immigration law for your absolute peace of mind.' : 'Todas nuestras pólizas seleccionadas cumplen estrictamente la ley de extranjería española para tu absoluta tranquilidad.'}
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Plans List section */}
      <PlanComparisonSection
        eyebrow={isEnglish ? 'Available Options' : 'Opciones Disponibles'}
        title={isEnglish ? 'Compare expat health insurances' : 'Compara seguros para expatriados'}
        plans={plansList}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
        columns={2}
      />
      <ProductRequirementsSection
        eyebrow={isEnglish ? 'Residence & Visa Requirements' : 'Requisitos de Residencia y Visados'}
        title={isEnglish ? 'What does Immigration require for expats?' : '¿Qué exige Extranjería para expatriados?'}
        description={isEnglish ? 'If you apply for the Non-Lucrative Visa, Family Reunification or the investor visa (Golden Visa), the contracted insurance in Spain must meet these criteria:' : 'Si solicitas la Residencia No Lucrativa, Reagrupación Familiar o el visado de inversor (Golden Visa), el seguro contratado en España debe cumplir obligatoriamente estos criterios:'}
        items={visaRequirements.map((req) => ({ label: req }))}
      />

      {/* Transparency section */}
      <ProductTransparencyPanel surface="band" eyebrow={isEnglish ? 'Radical Transparency' : 'Transparencia Radical'} title={isEnglish ? 'What does your health insurance include and exclude?' : '¿Qué incluye y qué excluye tu seguro médico?'} description={isEnglish ? 'We detail the real conditions and common exclusions so you can make your decision with complete honesty.' : 'Te detallamos las condiciones reales y exclusiones comunes para que tomes tu decisión con total honestidad.'} inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title={isEnglish ? 'How to apply in 4 steps' : 'Cómo contratar en 4 pasos'}
        description={isEnglish ? '100% online process, fast and secure with the personalized assistance of VitaBlue.' : 'Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue.'}
        steps={[
          {
            title: isEnglish ? 'Fill in the form' : 'Rellena el formulario',
            description: isEnglish ? 'Enter your age, arrival date in Spain, and select the visa type (Non-Lucrative, Golden) in our quoting tool.' : 'Introduce tu edad, fecha de llegada a España y selecciona el tipo de visa (No Lucrativa, Golden) en nuestro cotizador.'
          },
          {
            title: isEnglish ? 'Choose payment' : 'Elige forma de pago',
            description: isEnglish ? 'Monthly or annual payment; we will show you applicable discounts and current promotions.' : 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción de cuota vigente.'
          },
          {
            title: isEnglish ? 'Health questionnaire' : 'Cuestionario de salud',
            description: isEnglish ? 'Complete a short digital medical questionnaire required for immediate resident policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de residente.'
          },
          {
            title: isEnglish ? 'Get your policy' : 'Recibe tu póliza',
            description: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present to immigration.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar ante Extranjería.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Real reviews' : 'Opiniones reales'}
        title={isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}
        items={testimonials}
      />

      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
        title={isEnglish ? 'Clear doubts about Expat Insurance' : 'Resolver dudas sobre el Seguro de Expatriados'}
        items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish ? 'Doubts with Immigration procedures?' : '¿Dudas con los trámites de Extranjería?'}
        description={isEnglish ? 'Speak directly and free of charge with our advisors. We will clear up your doubts regarding pre-existing conditions, carencias, and policy registrations without any commitment.' : 'Habla con nuestros asesores de forma directa y gratuita. Resolveremos tus dudas sobre preexistencias, carencias y alta de pólizas sin ningún compromiso.'}
        whatsappUrl={getProductWhatsAppUrl('expatriados', isEnglish)}
      />
    </div>
  );
};

export default ExpatInsurance;
