import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Award, Smartphone, FileCheck } from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import AsisaTrustSection from '../../components/organisms/AsisaTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductPromotionSection from '../../components/organisms/ProductPromotionSection';
import DigitalServicesSection from '../../components/organisms/DigitalServicesSection';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';
import {
  HealthIllustration,
  MedicalAttentionIllustration,
  DentalIllustration,
  PreventionIllustration,
  TravelIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaHealthStudents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('student');
    navigate('/wizard?flow=students&insurer=asisa');
  };

  const coverages = isEnglish ? [
    {
      title: '100% Student Visa Compliance',
      desc: 'Zero copays, zero deductibles, and zero waiting times. Fully accepted by all Spanish Consulates and the MERCURIO immigration portal.',
      illustration: HealthIllustration
    },
    {
      title: 'Sanitary & Mortal Repatriation',
      desc: 'Unlimited guarantee of medical evacuation and mortal remains repatriation to country of origin, an essential Spanish consular requirement.',
      illustration: TravelIllustration
    },
    {
      title: 'Unlimited Hospitalization & Surgeries',
      desc: 'Individual private hospital room across the entire HLA Hospital Group and ASISA partner clinics in Spain with no duration limits.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Medical Specialists Without Wait Lists',
      desc: 'Direct access to over 40,000 specialists: traumatology, dermatology, mental health, gynecology, and general medicine.',
      illustration: PreventionIllustration
    },
    {
      title: '24/7 Emergencies & AsisaLIVE Video Doctor',
      desc: 'Emergency care in HLA clinics throughout Spain and medical video consultations in English & Spanish straight from your smartphone.',
      illustration: FamilyIllustration
    },
    {
      title: 'Basic Dental Coverage Included',
      desc: 'Checkups, periodic consultations, simple tooth extractions, and annual dental cleanings included at no extra cost in the Asisa Dental network.',
      illustration: DentalIllustration
    }
  ] : [
    {
      title: 'Cumplimiento 100% Visado de Estudios',
      desc: 'Póliza sin copagos, sin franquicias y sin carencias. Aceptada por todos los consulados de España y en expedientes de extranjería MERCURIO.',
      illustration: HealthIllustration
    },
    {
      title: 'Repatriación Médica y de Restos',
      desc: 'Garantía ilimitada de traslado sanitario o repatriación al país de origen por enfermedad grave o fallecimiento, requerimiento consular obligatorio.',
      illustration: TravelIllustration
    },
    {
      title: 'Hospitalización y Cirugías Ilimitadas',
      desc: 'Habitación individual para el estudiante en toda la red hospitalaria del Grupo HLA y centros asociados de Asisa en España sin límites de estancia.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Especialistas Médicos Sin Esperas',
      desc: 'Acceso directo a más de 40.000 facultativos: traumatología, dermatología, salud mental, ginecología y medicina general.',
      illustration: PreventionIllustration
    },
    {
      title: 'Urgencias 24/7 y AsisaLIVE',
      desc: 'Atención urgente en clínicas HLA en cualquier provincia de España y videoconsultas médicas en español e inglés desde el smartphone.',
      illustration: FamilyIllustration
    },
    {
      title: 'Garantía Dental Básica',
      desc: 'Consultas, revisiones periódicas, extracciones simples y limpiezas de boca incluidas sin coste en la red odontológica Asisa Dental.',
      illustration: DentalIllustration
    }
  ];

  const modalitiesList = isEnglish ? [
    {
      name: 'ASISA Health Students Annual',
      subtitle: 'Mandatory for Consulates',
      desc: 'Single 12-month upfront payment with immediate delivery of the official certificate with secure verification code (CSV). Required for initial visa applications.',
      priceDetail: 'From €35.00/mo (Single Payment)',
      tag: 'Consulate Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Students Semester',
      subtitle: 'Short Programs / Erasmus',
      desc: 'Tailored for university exchange programs or master semesters (up to 6 months). Includes identical comprehensive coverage and repatriation.',
      priceDetail: 'From €39.00/mo',
      tag: 'Short Stays',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Health Students Anual',
      subtitle: 'Exigido por Consulados',
      desc: 'Pago único de 12 meses con emisión inmediata del certificado oficial con código seguro de verificación (CSV). Imprescindible para solicitud de visado inicial en origen.',
      priceDetail: 'Desde 35,00€/mes (Pago Único)',
      tag: 'Recomendado Visado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Students Semestral',
      subtitle: 'Programas Cortos / Erasmus',
      desc: 'Diseñado para estancias de intercambio o posgrados de un semestre (hasta 6 meses). Incluye idéntica cobertura completa y repatriación.',
      priceDetail: 'Desde 39,00€/mes',
      tag: 'Estancias Cortas',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Camila R.',
      meta: 'Master Student in Madrid (Colombia)',
      comment: 'The consulate in Bogota requested zero copays and repatriation. In less than 24h VitaBlue delivered the ASISA policy with the official certificate and my visa was approved with zero queries.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Mateo V.',
      meta: 'Undergrad in Barcelona (Mexico)',
      comment: 'Outstanding support. I used the AsisaLIVE video doctor app in my very first week in Barcelona. The electronic prescription worked smoothly at the pharmacy.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Valeria M.',
      meta: 'Erasmus Exchange (Peru)',
      comment: 'I compared multiple options and ASISA Students was the most affordable with the entire Moncloa hospital network included. Highly recommended.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Camila R.',
      meta: 'Máster en Madrid (Colombia)',
      comment: 'El consulado en Bogotá me pedía un seguro sin copagos y con repatriación. En menos de 24h VitaBlue me envió la póliza de Asisa con el certificado oficial y me aprobaron la visa sin requerimientos.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Mateo V.',
      meta: 'Grado en Barcelona (México)',
      comment: 'Excelente atención. Pude usar la app AsisaLIVE para una consulta médica en mi primera semana en Barcelona. La receta me sirvió directamente en la farmacia.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Valeria M.',
      meta: 'Intercambio Erasmus (Perú)',
      comment: 'Comparé varias opciones y Asisa Students fue la más económica con toda la red del hospital Moncloa incluida. Súper recomendado.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'Does ASISA Health Students fulfill all Spanish student visa requirements?',
      a: 'Yes, it complies 100% with Spanish Immigration (Extranjería) and consular regulations: full hospitalization cover, €0 copays on all services, zero wait times, and unlimited medical & mortal repatriation.'
    },
    {
      q: 'How quickly do I receive the official certificate for the consulate?',
      a: 'Once your enrollment and premium payment are completed, your official certificate with secure electronic verification code (CSV) and digital signature is emitted within 24 to 48 business hours in PDF format.'
    },
    {
      q: 'What happens if my student visa is denied?',
      a: 'If the consulate denies your visa application, ASISA refunds 100% of the paid premium upon presenting the official consular refusal letter prior to the policy start date.'
    },
    {
      q: 'Can I visit HLA Group hospitals?',
      a: 'Yes, you enjoy direct, unlimited access to HLA Group\'s 18 hospitals and over 36 multi-specialty centers across Spain (including HLA Moncloa in Madrid and HLA Vistahermosa in Alicante).'
    }
  ] : [
    {
      q: '¿Cumple ASISA Health Students con todos los requisitos del visado de estudiante en España?',
      a: 'Sí, cumple el 100% de la normativa legal de Extranjería española y de los Consulados: seguro médico completo con hospitalización, 0€ copagos en todas las prestaciones, sin periodos de carencia y con cobertura de repatriación médica y funeraria ilimitada.'
    },
    {
      q: '¿En cuánto tiempo recibo el certificado para el consulado?',
      a: 'Una vez formalizada la contratación y el pago de la prima, el certificado oficial con código de verificación (CSV) y firma digital se emite en un plazo de 24 a 48 horas laborables en formato PDF.'
    },
    {
      q: '¿Qué ocurre si me deniegan el visado de estudios?',
      a: 'Si el consulado deniega tu solicitud de visado, Asisa te devuelve el 100% del importe pagado presentando la carta oficial de denegación consular antes de la fecha de inicio del seguro.'
    },
    {
      q: '¿Puedo acudir a los hospitales del Grupo HLA?',
      a: 'Sí, tienes acceso directo e ilimitado a los 18 hospitales y más de 36 centros multiespecialidad del Grupo HLA en España (como el Hospital Universitario Moncloa en Madrid o HLA Vistahermosa en Alicante).'
    }
  ];

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance/asisa-health-students/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/';

  const title = isEnglish
    ? 'ASISA Health Students | Student Visa Health Insurance Spain | VitaBlue'
    : 'ASISA Health Students | Seguro Visado de Estudiante España | VitaBlue';

  const description = isEnglish
    ? 'Official ASISA Health Students medical insurance for student visa & NIE in Spain. 0 copays, 0 wait times, medical repatriation included, and 24h certificate.'
    : 'Seguro médico oficial ASISA Health Students para visado de estudios y NIE en España. Sin copagos, sin carencias, repatriación médica incluida y certificado 24h.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: isEnglish
          ? 'Official certified health insurance brokerage for visas and foreign citizens in Spain.'
          : 'Asesoría oficial de seguros de salud homologados para visados y extranjeros en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Health Students',
        description: isEnglish
          ? 'Health insurance for international students required for Spanish study visas: 0 copays, 0 wait times, and full medical repatriation.'
          : 'Seguro médico para estudiantes internacionales exigido para el visado de estudios en España: 0 copagos, 0 carencias y repatriación médica.',
        brand: {
          '@type': 'Brand',
          name: 'ASISA'
        },
        provider: {
          '@id': 'https://www.vitablue.es/#organization'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isEnglish ? 'Home' : 'Inicio',
            item: isEnglish ? 'https://www.vitablue.es/en/' : 'https://www.vitablue.es/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isEnglish ? 'Health Insurance' : 'Seguros de Salud',
            item: isEnglish ? 'https://www.vitablue.es/en/health-insurance-student-visa-spain/' : 'https://www.vitablue.es/productos/seguros-salud/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isEnglish ? 'ASISA Insurance' : 'Seguros Asisa',
            item: isEnglish ? 'https://www.vitablue.es/en/health-insurance/asisa-insurance/' : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'ASISA Health Students',
            item: canonicalUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
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
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance/asisa-health-students/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <ProductBreadcrumbBar
        items={isEnglish ? [
          { label: 'Health Insurance', href: '/en/health-insurance-student-visa-spain' },
          { label: 'ASISA Insurance', href: '/en/health-insurance/asisa-insurance' },
          { label: 'ASISA Health Students', href: canonicalUrl }
        ] : [
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Health Students', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={isEnglish ? [
          { label: 'Official Spanish Visa Policy', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Zero Copays & Zero Wait Times', tone: 'accent' },
          { label: 'IPID AFR01S0125' }
        ] : [
          { label: 'Póliza Oficial Visado España', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Sin Copagos ni Carencias', tone: 'accent' },
          { label: 'IPID AFR01S0125' }
        ]}
        title={isEnglish
          ? 'ASISA Health Students: Health Insurance for Your Spanish Study Visa'
          : 'ASISA Health Students: El Seguro Médico para tu Visado de Estudios'}
        description={isEnglish
          ? 'Full comprehensive medical cover approved by Spanish Consulates and Extranjería. Unlimited medical repatriation, 0 copays, and official PDF certificate with CSV in 24h.'
          : 'Póliza de cobertura sanitaria total homologada por Extranjería y Consulados. Repatriación médica ilimitada, 0 copagos y certificado oficial con CSV para tu expediente en 24h.'}
        primaryAction={{
          label: isEnglish ? 'Calculate Student Quote' : 'Calcular Seguro Estudiante',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: isEnglish ? 'Inquire via WhatsApp' : 'Consultar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-STUDENTS', locale: isEnglish ? 'en' : 'es' })
        }}
      >
        <QuoteEstimator
          title={isEnglish ? 'ASISA Health Students Quote Estimator' : 'Cotizador ASISA Health Students'}
          description={isEnglish
            ? 'Official flat rate for international students aged 18 to 35.'
            : 'Tarifa plana oficial para estudiantes internacionales de 18 a 35 años.'}
          initialAge={22}
          minAge={16}
          maxAge={35}
          ageSuffix={isEnglish ? 'years' : 'años'}
          ageLabel={isEnglish ? 'Insured Age' : 'Edad del Asegurado'}
          modalityLabel={isEnglish ? 'Modality' : 'Modalidad'}
          priceLabel={isEnglish ? 'Estimated Fee:' : 'Cuota Estimada:'}
          priceSuffix={isEnglish ? '€/mo' : '€/mes'}
          submitLabel={isEnglish ? 'Start Online Application' : 'Iniciar Contratación Online'}
          options={isEnglish ? [
            { id: 'anual', label: 'Annual (12-month visa)' },
            { id: 'semestral', label: 'Semester (Up to 6 mos)' }
          ] : [
            { id: 'anual', label: 'Anual (Visado 12 meses)' },
            { id: 'semestral', label: 'Semestral (Hasta 6 meses)' }
          ]}
          calculatePrice={(_age, option) => {
            if (option === 'semestral') return '39.00';
            return '35.00';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={isEnglish ? [
          { icon: <ShieldCheck />, title: '100% Consular Validity', description: 'Guaranteed compliance with all Spanish immigration requirements.' },
          { icon: <Clock />, title: '24-Hour Certificate', description: 'Digital PDF with electronic verification code for your visa application.' },
          { icon: <Award />, title: 'Full Money-Back Guarantee', description: '100% refund of premium if your visa is officially denied.' }
        ] : [
          { icon: <ShieldCheck />, title: '100% Validez Consular', description: 'Garantía de cumplimiento de requisitos de Extranjería.' },
          { icon: <Clock />, title: 'Certificado en 24 Horas', description: 'Documento en PDF con firma electrónica para adjuntar al visado.' },
          { icon: <Award />, title: 'Devolución Garantizada', description: 'Reembolso del 100% de la prima si tu visado resulta denegado.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Official study visa insurer' : 'Aseguradora oficial del visado'}
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow={isEnglish ? 'Official Modalities' : 'Modalidades Oficiales'}
        title={isEnglish ? 'Options tailored to your study duration' : 'Opciones adaptadas a la duración de tus estudios'}
        description={isEnglish
          ? 'Choose the modality that matches your academic acceptance letter in Spain.'
          : 'Elige la modalidad que corresponda con tu carta de admisión académica en España.'}
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Select this plan' : 'Seleccionar este plan'}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Legally Required Coverages' : 'Coberturas Exigidas por Ley'}
        title={isEnglish ? 'Everything immigration requires included as standard' : 'Todo lo que exige Extranjería incluido de serie'}
        description={isEnglish
          ? 'Complete technical specifications and medical guarantees per official IPID AFR01S0125.'
          : 'Especificaciones técnicas y garantías médicas completas según el IPID oficial AFR01S0125.'}
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow={isEnglish ? 'Fast Process' : 'Trámite Rápido'}
        title={isEnglish ? 'Get your consular certificate in 4 steps' : 'Consigue tu certificado consular en 4 pasos'}
        description={isEnglish
          ? '100% online procedure designed for international students with support from our experts.'
          : 'Proceso 100% digital diseñado para estudiantes extranjeros con acompañamiento de nuestros especialistas.'}
        steps={isEnglish ? [
          {
            title: 'Quote your study dates',
            description: 'Provide the start and end dates of your academic course or university exchange program in Spain.'
          },
          {
            title: 'Passport details',
            description: 'Enter your personal details and passport number to issue the official policy in your name.'
          },
          {
            title: 'Secure online payment',
            description: 'Complete the upfront annual premium required by the consulate via card or bank transfer.'
          },
          {
            title: 'Download your Certificate',
            description: 'Receive the official certificate in Spanish with CSV verification code ready for the embassy.'
          }
        ] : [
          {
            title: 'Cotiza tus fechas de estudio',
            description: 'Indica la fecha de inicio y fin de tu curso académico o programa de intercambio en España.'
          },
          {
            title: 'Datos del pasaporte',
            description: 'Ingresa tus datos personales y número de pasaporte para emitir la póliza a tu nombre.'
          },
          {
            title: 'Pago seguro online',
            description: 'Realiza el abono de la prima anual requerida por el consulado mediante tarjeta o transferencia.'
          },
          {
            title: 'Descarga tu Certificado',
            description: 'Recibe en tu correo el certificado oficial en español con código CSV listo para presentar a la embajada.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Testimonials' : 'Testimonios'}
        title={isEnglish
          ? 'International students already studying in Spain with ASISA'
          : 'Estudiantes internacionales que ya estudian en España con Asisa'}
        items={testimonials}
      />

      <AsisaTrustSection
        eyebrow={isEnglish ? 'ASISA & HLA Group Guarantee' : undefined}
        title={isEnglish ? 'Leader in Private Healthcare with Own Hospital Network' : undefined}
        description={isEnglish ? 'ASISA is one of Spain\'s most established health insurers, backed by the Lavinia medical cooperative and HLA Group proprietary hospitals.' : undefined}
        stats={isEnglish ? [
          { value: '40,000+', label: 'Doctors & specialists' },
          { value: '18', label: 'Proprietary HLA hospitals' },
          { value: '36', label: 'Multi-specialty clinics' },
          { value: '45+', label: 'Years of medical expertise' },
        ] : undefined}
        highlights={isEnglish ? [
          {
            title: 'Proprietary Hospital Network (HLA Group)',
            description: 'Direct access to 18 top-tier HLA Group hospitals (Hospital Universitario Moncloa, Clínica El Ángel, HLA Santa Isabel, Vistahermosa, and more) with leading-edge medical tech.',
          },
          {
            title: '24/7 AsisaLIVE Telemedicine',
            description: 'Immediate video doctor consultations with GPs and specialists, digital e-prescriptions, and easy appointment booking via the ASISA smartphone app.',
          },
          {
            title: 'Spain\'s Premier Medical Cooperative',
            description: 'Owned by the Lavinia medical cooperative (formed by doctors), ensuring healthcare profits are reinvested directly into medical technology and patient care.',
          },
        ] : undefined}
      />

      <DigitalServicesSection
        eyebrow={isEnglish ? 'AsisaLIVE Telemedicine' : 'Telemedicina AsisaLIVE'}
        title={isEnglish ? 'Doctor on your mobile phone wherever you are' : 'Médico en tu móvil estés donde estés'}
        description={isEnglish
          ? 'No need to travel if you fall ill during your studies. AsisaLIVE gives you immediate 24/7 access to video doctor consultations in English and Spanish.'
          : 'No te preocupes por desplazarte si enfermas durante tus estudios. Con AsisaLIVE tienes acceso inmediato a videoconsultas médicas 24/7 en español e inglés.'}
        benefits={isEnglish ? [
          'Urgent video doctor appointments with no prior booking',
          'Official electronic prescriptions valid at pharmacies across Spain',
          'Mental health counseling and psychological support specialists',
          'Instant medical test authorizations via the smartphone app'
        ] : [
          'Videoconsultas de urgencia sin cita previa',
          'Receta médica electrónica homologada en farmacias',
          'Especialistas en salud mental y orientación psicológica',
          'Gestión de autorizaciones médicas desde la app'
        ]}
        visual={
          <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
            <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-display font-black leading-snug">AsisaLIVE App</h4>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Telemedicine' : 'Telemedicina'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Urgent Video Consultation' : 'Consulta Médica Urgente'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'Average wait time: < 4 min' : 'Tiempo de espera medio: < 4 min'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Digital Certificate' : 'Certificado Digital'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Policy with Secure Code' : 'Póliza con Código Seguro'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'PDF delivery in 24h' : 'Disponible en PDF 24h'}
                  </p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                {isEnglish ? 'HLA Hospital Network Included' : 'Red Hospitalaria HLA Incluida'}
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={isEnglish ? [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Guaranteed Approval</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Consulates & MERCURIO</span>
        ] : [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Aceptación Garantizada</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Consulados y MERCURIO</span>
        ]}
        title={isEnglish
          ? 'Full Money-Back Guarantee upon Visa Denial'
          : 'Garantía de Devolución por Denegación de Visado'}
        description={isEnglish
          ? 'If your visa application is denied for any consular reason, ASISA reimburses 100% of the premium upon presentation of the official refusal resolution.'
          : 'Si tu visado es denegado por cualquier motivo consular, Asisa te reembolsa el 100% de la prima abonada presentando la resolución oficial.'}
      />

      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
        title={isEnglish
          ? 'We answer all your questions about ASISA Health Students'
          : 'Resolvemos todas tus dudas sobre ASISA Health Students'}
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish
          ? 'Do you have questions about specific requirements for your consulate?'
          : '¿Tienes dudas sobre los requisitos específicos de tu consulado?'}
        description={isEnglish
          ? 'Every embassy or consulate has nuances depending on your country of origin. Our visa advisor team at VitaBlue reviews your file for free.'
          : 'Cada embajada o consulado tiene particularidades según el país de origen. Nuestro equipo de asesores de visado en VitaBlue revisa tu expediente gratis.'}
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-STUDENTS-HELP', locale: isEnglish ? 'en' : 'es' })}
        advisorRole={isEnglish ? 'Senior Student Visa Health Advisor' : undefined}
        advisorBadge={isEnglish ? 'Assigned Advisor' : undefined}
        advisorQuote={isEnglish ? '"Hi, I\'m Lucía. I\'m here to help you get your student visa health certificate in 24h with 0 copays and full compliance. Ask me anything on WhatsApp!"' : undefined}
        advisorSchedule={isEnglish ? 'Monday to Friday: 9:00 - 19:00 (CET)' : undefined}
        advisorResponseTime={isEnglish ? 'Reply in < 15 mins' : undefined}
        advisorCallText={isEnglish ? 'Call Free' : undefined}
        advisorWhatsAppText={isEnglish ? 'Ask via WhatsApp' : undefined}
      />
    </div>
  );
};

export default AsisaHealthStudents;

