import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Laptop, Globe
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
import { nomadTranslations } from '../../utils/translations';
import { getProductWhatsAppUrl } from '@/utils/whatsappLinks';
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

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('nomad');
    navigate('/wizard/');
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
          "ratingValue": "4.9",
          "reviewCount": "88",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FinancialProduct",
        "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/#producto",
        "name": "Seguro Médico para Nómadas Digitales",
        "description": "Seguro médico de cobertura completa sin copagos y con asistencia global en viaje para el visado de nómada digital en España.",
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
            "name": "Nómadas Digitales",
            "item": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/"
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
    ? 'https://www.vitablue.es/en/digital-nomad-insurance-spain/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/';

  const title = isEnglish
    ? 'Best Health Insurance for Digital Nomads in Spain (2026) | VitaBlue'
    : 'Seguro Médico para Nómadas Digitales y Remotos | VitaBlue';

  const description = isEnglish
    ? 'Official health insurance for Spain Digital Nomad Visa. Full coverage, 0€ copays, international travel assistance and approved consular certificate in 24h.'
    : 'Compara seguros médicos para nómadas digitales y teletrabajadores remotos en España. Cobertura médica completa homologada sin copagos y con asistencia global.';

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Multilingual Alternate Links */}
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/digital-nomad-insurance-spain/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/" />

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
      <ProductBreadcrumbBar items={[{ label: isEnglish ? 'Health Insurance' : 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: isEnglish ? 'Digital Nomads' : 'Nómadas Digitales', href: isEnglish ? '/en/digital-nomad-insurance-spain' : '/productos/seguros-salud/seguro-nomadas-digitales' }]} />

      <ProductHero badges={[{ label: t.heroTag, icon: <Laptop className="h-4 w-4" /> }, { label: isEnglish ? 'Digital Nomad Visa' : 'Visado Nómada Digital', tone: 'accent' }]} title={t.heroTitle} description={t.heroSubtitle} primaryAction={{ label: t.ctaButton, onClick: handleStartQuoting }} secondaryAction={{ label: t.callAdvisor, href: 'tel:+34694583452' }} highlights={[isEnglish ? 'International assistance' : 'Asistencia internacional', isEnglish ? 'No copays' : 'Sin copagos']}>
        <QuoteEstimator title={isEnglish ? 'Digital Nomad Estimator' : 'Tarificador Nómada'} description={isEnglish ? 'Calculate your monthly quote with zero copays immediately.' : 'Calcula tu cuota mensual sin copagos de forma inmediata.'} initialAge={32} options={[{ id: 'major', label: isEnglish ? 'Major cities' : 'Grandes ciudades' }, { id: 'coasts', label: isEnglish ? 'Coasts' : 'Costas' }, { id: 'rest', label: isEnglish ? 'Rest of Spain' : 'Resto de España' }]} initialOption="major" calculatePrice={() => 'Personalizado'} personalizedPriceLabel={isEnglish ? 'Personalized price' : 'Precio personalizado'} priceSuffix={isEnglish ? '€/month' : '€/mes'} onSubmit={handleStartQuoting} />
      </ProductHero>

      <ProductTrustBar items={[
        { icon: <Globe />, title: isEnglish ? 'Global Assistance' : 'Asistencia Global', description: isEnglish ? 'Emergency medical coverage on all your travels.' : 'Cobertura de urgencias médicas en todos tus viajes.' },
        { icon: <ShieldCheck />, title: isEnglish ? 'UGE Approved' : 'Homologación UGE', description: isEnglish ? 'Zero-copay guarantee compliant with telework visa law.' : 'Garantía sin copagos aceptada por la ley de teletrabajo.' },
        { icon: <Laptop />, title: isEnglish ? '24/7 Telemedicine' : 'Telemedicina 24/7', description: isEnglish ? 'Video consultation and e-prescription in seconds.' : 'Videoconsulta y receta médica electrónica en segundos.' },
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
        title={isEnglish ? 'Medical Guarantees for Nomads' : 'Garantías Médicas para Nómadas'}
        description={isEnglish ? 'All our selected policies strictly comply with the Spanish immigration law for your absolute peace of mind.' : 'Todas nuestras pólizas seleccionadas cumplen estrictamente la ley de extranjería española para tu absoluta tranquilidad.'}
        items={coverages.map(({ title, desc, illustration }) => ({ title, description: desc, illustration }))}
      />

      {/* Plans List section */}
      <PlanComparisonSection
        eyebrow={isEnglish ? 'Available Options' : 'Opciones Disponibles'}
        title={isEnglish ? 'Compare nomad health insurances' : 'Compara seguros para nómadas'}
        plans={plansList}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Compare this policy' : 'Comparar esta póliza'}
        columns={2}
      />
      <ProductRequirementsSection
        eyebrow={isEnglish ? 'Coverage Specifications' : 'Especificaciones de Cobertura'}
        title={isEnglish ? 'What requirements must the nomad insurance meet?' : '¿Qué requisitos debe cumplir el seguro de nómada?'}
        description={isEnglish ? 'The international telework law in Spain requires private health insurance with solid features to approve legal stay:' : 'La ley del teletrabajo internacional en España exige un seguro médico privado con características sólidas para aprobar la estancia legal:'}
        items={nomadRequirements.map((req) => ({ label: req }))}
      />

      {/* Transparency section */}
      <ProductTransparencyPanel surface="band" eyebrow={isEnglish ? 'Radical Transparency' : 'Transparencia Radical'} title={isEnglish ? 'What does your telework insurance include and exclude?' : '¿Qué incluye y qué excluye tu seguro de teletrabajo?'} description={isEnglish ? 'We show you with crystal clarity the real scope of the remote worker medical insurance so you can contract with security.' : 'Te mostramos con claridad cristalina el alcance real del seguro médico de teletrabajador para que contrates con seguridad.'} inclusions={inclusions} exclusions={exclusions} />

      {/* How to hire in 4 steps Onboarding timeline */}
      <ProductProcessSection
        eyebrow="Proceso"
        title={isEnglish ? 'How to apply in 4 steps' : 'Cómo contratar en 4 pasos'}
        description={isEnglish ? '100% online process, fast and secure with the personalized assistance of VitaBlue.' : 'Proceso 100% online, rápido y seguro con el acompañamiento personalizado de VitaBlue.'}
        steps={[
          {
            title: isEnglish ? 'Fill in the form' : 'Rellena el formulario',
            description: isEnglish ? 'Enter your age, arrival date in Spain, and select if traveling with family in our comparator.' : 'Introduce tu edad, fecha de llegada a España y detalla si viajas con familia en nuestro comparador.'
          },
          {
            title: isEnglish ? 'Choose payment' : 'Elige forma de pago',
            description: isEnglish ? 'Monthly or annual payment; we will show you applicable discounts and current promotions.' : 'Pago mensual o pago anual; te indicamos los descuentos aplicables y la promoción de cuota vigente.'
          },
          {
            title: isEnglish ? 'Health questionnaire' : 'Cuestionario de salud',
            description: isEnglish ? 'Complete a short digital medical questionnaire required for immediate nomad policy issuance.' : 'Completa un breve cuestionario digital necesario para la emisión inmediata de tu póliza de nómada.'
          },
          {
            title: isEnglish ? 'Get your policy' : 'Recibe tu póliza',
            description: isEnglish ? 'Get your official coverage certificate in PDF in 24 business hours, ready to present to the UGE.' : 'Obtén tu certificado oficial de cobertura en PDF en 24h laborales, listo para presentar ante la UGE.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Real reviews' : 'Opiniones reales'}
        title={isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}
        items={testimonials}
      />

      {/* Accordion FAQs Section */}
      <FaqSection eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'} title={isEnglish ? 'Clear doubts about Nomad Insurance' : 'Resolver dudas sobre el Seguro de Nómadas'} items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title={isEnglish ? 'Doubts with coverage outside Spain?' : '¿Dudas con la cobertura fuera de España?'}
        description={isEnglish ? 'Ask our advisors over WhatsApp directly and free of charge. You will get fast answers on how the medical network works in your travel destinations without any commitment.' : 'Pregunta a nuestros asesores por WhatsApp de forma directa y gratuita. Obtendrás respuestas rápidas sobre cómo funciona la red médica en tus destinos de viaje sin ningún compromiso.'}
        whatsappUrl={getProductWhatsAppUrl('nomadas', isEnglish)}
      />
    </div>
  );
};

export default NomadInsurance;
