import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Award, Smartphone } from 'lucide-react';
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
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaEsencial: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard?flow=health&insurer=asisa&plan=esencial');
  };

  const coverages = isEnglish ? [
    {
      title: 'Direct Specialist Access Without Waits',
      desc: 'Direct consultations with over 40,000 specialists: dermatology, gynecology, traumatology, ophthalmology, cardiology, and general medicine.',
      illustration: HealthIllustration
    },
    {
      title: 'Diagnostic Tests & Clinical Analysis',
      desc: 'Ultrasound scans, simple X-rays, blood and urine analysis, cytologies, and electrocardiograms at partner clinics and HLA centers.',
      illustration: PreventionIllustration
    },
    {
      title: 'General Medicine & Pediatrics',
      desc: 'Fast primary healthcare for adults and children without public system waiting times, with free choice of doctor.',
      illustration: FamilyIllustration
    },
    {
      title: 'Outpatient Emergencies & AsisaLIVE',
      desc: 'Urgent medical attention at partner centers and immediate video consultations 24 hours a day directly from your smartphone.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Basic Asisa Dental Included',
      desc: 'Free periodic dental examinations, annual cleanings, diagnostic X-rays, and discounted treatment fees across the dental network.',
      illustration: DentalIllustration
    },
    {
      title: 'No Hospitalization = Maximum Savings',
      desc: 'By dispensing with inpatient hospitalization and major surgeries, your monthly premium is reduced to an absolute minimum.',
      illustration: PreventionIllustration
    }
  ] : [
    {
      title: 'Consultas con Especialistas Sin Esperas',
      desc: 'Acceso directo a más de 40.000 profesionales: dermatología, ginecología, traumatología, oftalmología, urología y medicina general.',
      illustration: HealthIllustration
    },
    {
      title: 'Pruebas Diagnósticas y Análisis',
      desc: 'Ecografías, radiografías simples, análisis de sangre y orina, citologías y electrocardiogramas en centros concertados y clínicas HLA.',
      illustration: PreventionIllustration
    },
    {
      title: 'Medicina General y Pediatría',
      desc: 'Atención primaria rápida para adultos y niños sin listas de espera de la sanidad pública, con libertad de elección de médico.',
      illustration: FamilyIllustration
    },
    {
      title: 'Urgencias Ambulatorias y AsisaLIVE',
      desc: 'Atención de urgencias médicas en centros concertados y videoconsultas médicas inmediatas las 24 horas del día desde el smartphone.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Cobertura Dental Asisa Incluida',
      desc: 'Revisiones periódicas gratuitas, limpiezas de boca anuales, radiografías odontológicas y tarifas con descuento en toda la red dental.',
      illustration: DentalIllustration
    },
    {
      title: 'Sin Hospitalización = Máximo Ahorro',
      desc: 'Al prescindir de la cobertura de ingreso hospitalario e intervenciones quirúrgicas complejas, la prima mensual es sumamente económica.',
      illustration: PreventionIllustration
    }
  ];

  const modalitiesList = isEnglish ? [
    {
      name: 'ASISA Esencial No Copay',
      subtitle: 'Fixed Outpatient Rate',
      desc: 'Enjoy consultations and diagnostic tests with specialists without paying extra fees per medical visit. Maximum predictability.',
      priceDetail: 'From €18.90/mo (€0 Copay)',
      tag: 'Most Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Esencial +',
      subtitle: 'Reduced Copays',
      desc: 'Ultra-low monthly premium with a minimal copay per visit (€3 to €6). Ideal for individuals who see the doctor only a few times a year.',
      priceDetail: 'From €13.90/mo + low copay',
      tag: 'Max Savings',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Esencial Sin Copago',
      subtitle: 'Cuota Fija Ambulatoria',
      desc: 'Disfruta de consultas y pruebas diagnósticas con especialistas sin pagar nada adicional por cada acto médico. Máxima previsibilidad.',
      priceDetail: 'Desde 18,90€/mes (Copago 0€)',
      tag: 'Más Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Esencial +',
      subtitle: 'Copagos Reducidos',
      desc: 'Cuota mensual aún más baja con un pequeño copago por consulta (de 3€ a 6€). Ideal para personas que acuden al médico pocas veces al año.',
      priceDetail: 'Desde 13,90€/mes + copago bajo',
      tag: 'Ahorro Máximo',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Lucía M.',
      meta: 'ASISA Esencial Insured (Madrid)',
      comment: 'I was looking for insurance allowing me to see dermatologists and gynecologists quickly without having to pay a fortune for hospitalization. It is exactly what I needed.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos T.',
      meta: 'ASISA Esencial + Insured (Valencia)',
      comment: 'For less than €15 a month I have access to private specialists whenever I need them. The value for money is unbeatable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Paula S.',
      meta: 'AsisaLIVE and Pediatrics (Zaragoza)',
      comment: 'For routine visits with my young child and nighttime or weekend video calls, it has been a blessing. Highly recommended.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Lucía M.',
      meta: 'Asegurada ASISA Esencial (Madrid)',
      comment: 'Buscaba un seguro que me permitiera ir al dermatólogo y al ginecólogo rápidamente sin tener que pagar un pastizal por la hospitalización. Es justo lo que necesitaba.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Carlos T.',
      meta: 'Asegurado ASISA Esencial + (Valencia)',
      comment: 'Por menos de 15€ al mes tengo especialistas privados cuando los necesito. La relación calidad-precio es imbatible.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Paula S.',
      meta: 'AsisaLIVE y Pediatría (Zaragoza)',
      comment: 'Para consultas rutinarias con mi hijo pequeño y videoconsultas de noche o fines de semana ha sido una bendición. Súper recomendable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'What exactly does ASISA Esencial cover?',
      a: 'It covers all primary care consultations, pediatric visits, and medical specialties (gynecology, dermatology, traumatology, ophthalmology, etc.), as well as outpatient diagnostic tests (blood tests, ultrasounds, X-rays) and urgent clinic visits. It does not include hospitalization or inpatient surgeries.'
    },
    {
      q: 'Who is this insurance recommended for?',
      a: 'It is ideal for individuals who already have public health coverage or do not wish to pay for hospital stays, but want to bypass long public waiting lists to see medical specialists and obtain swift diagnostic tests.'
    },
    {
      q: 'Can I use this policy for Spanish visa or residency applications?',
      a: 'No. Spanish immigration offices and consulates strictly require comprehensive health insurance with zero copays that includes full hospitalization and surgery (such as ASISA Health Students or ASISA Health Residents).'
    },
    {
      q: 'Does ASISA Esencial have waiting periods (carencias)?',
      a: 'Primary care, specialist consultations, and basic diagnostic tests have zero waiting periods; you can access them from the first day your policy becomes active.'
    }
  ] : [
    {
      q: '¿Qué cubre exactamente ASISA Esencial?',
      a: 'Cubre todas las consultas de medicina general, pediatría y especialidades médicas (ginecología, dermatología, traumatología, etc.), así como pruebas diagnósticas ambulatorias (análisis, ecografías, radiografías) y urgencias en centros médicos. No incluye hospitalización ni cirugías mayores.'
    },
    {
      q: '¿Para quién está recomendado este seguro?',
      a: 'Es perfecto para personas que ya cuentan con cobertura pública o que no desean pagar por hospitalización, pero quieren evitar las listas de espera de la Seguridad Social para visitar especialistas y hacerse chequeos médicos rápidos.'
    },
    {
      q: '¿Es válido este seguro para solicitar visados de extranjería en España?',
      a: 'No. Las oficinas de Extranjería y Consulados de España exigen obligatoriamente una póliza que incluya hospitalización y cirugías sin copagos (como ASISA Health Students o ASISA Health Residents).'
    },
    {
      q: '¿Tiene periodos de carencia ASISA Esencial?',
      a: 'La medicina general, especialistas y pruebas básicas no tienen periodos de carencia; se pueden utilizar desde el primer día en que entra en vigor la póliza.'
    }
  ];

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance/asisa-esencial/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/';

  const title = isEnglish
    ? 'ASISA Esencial | Outpatient Health Insurance in Spain | VitaBlue'
    : 'ASISA Esencial | Seguro Médico Sin Hospitalización | VitaBlue';

  const description = isEnglish
    ? 'Official ASISA Esencial & Esencial + outpatient health insurance in Spain. Fast access to 40,000+ medical specialists, diagnostic tests, dental, and 24/7 video doctor from €13.90/mo.'
    : 'Seguro de salud ambulatorio ASISA Esencial y Esencial +: especialistas, pruebas diagnósticas y telemedicina sin listas de espera desde 13,90€/mes.';

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
          ? 'Independent health insurance comparator in Spain. Official rates and expert advice.'
          : 'Asesoría independiente de seguros médicos de salud en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Esencial',
        description: isEnglish
          ? 'Outpatient private health insurance in Spain with 40,000+ specialists, diagnostic tests, and telemedicine without hospitalization.'
          : 'Seguro médico ambulatorio con especialistas, pruebas diagnósticas y telemedicina sin hospitalización.',
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
            name: 'ASISA Esencial',
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

        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance/asisa-esencial/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/" />

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
          { label: 'ASISA Esencial', href: canonicalUrl }
        ] : [
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Esencial', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={isEnglish ? [
          { label: 'Specialists Without Waits', tone: 'brand' },
          { label: 'Budget Friendly', tone: 'accent' },
          { label: 'IPID AFR01S0071' }
        ] : [
          { label: 'Especialistas Sin Esperas', tone: 'brand' },
          { label: 'Cuota Económica', tone: 'accent' },
          { label: 'IPID AFR01S0071' }
        ]}
        title={isEnglish
          ? 'ASISA Esencial: Fast Access to Medical Specialists at the Best Price'
          : 'ASISA Esencial: Acceso Rápido a Especialistas al Mejor Precio'}
        description={isEnglish
          ? 'Outpatient health policy without hospital stay. Visit dermatologists, traumatologists, gynecologists, and undergo diagnostic tests without waiting from €13.90/month.'
          : 'Póliza médica ambulatoria sin hospitalización. Visita dermatólogos, traumatólogos, ginecólogos y realiza pruebas diagnósticas sin esperas desde 13,90€/mes.'}
        primaryAction={{
          label: isEnglish ? 'Calculate ASISA Esencial' : 'Calcular ASISA Esencial',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: isEnglish ? 'Ask via WhatsApp' : 'Preguntar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-ESENCIAL', locale: isEnglish ? 'en' : 'es' })
        }}
      >
        <QuoteEstimator
          title={isEnglish ? 'ASISA Esencial Quote Estimator' : 'Cotizador ASISA Esencial'}
          description={isEnglish ? 'Calculate your approximate monthly rate based on your age.' : 'Calcula tu tarifa mensual aproximada según tu edad.'}
          initialAge={28}
          minAge={18}
          maxAge={65}
          ageSuffix={isEnglish ? 'years' : 'años'}
          submitLabel={isEnglish ? 'Get Official Quote' : undefined}
          options={isEnglish ? [
            { id: 'sin-copago', label: 'Esencial No Copay' },
            { id: 'con-copago', label: 'Esencial + (Low Copay)' }
          ] : [
            { id: 'sin-copago', label: 'Esencial Sin Copago' },
            { id: 'con-copago', label: 'Esencial + (Copago Bajo)' }
          ]}
          calculatePrice={(age, option) => {
            if (option === 'con-copago') {
              if (age <= 30) return '13.90';
              if (age <= 45) return '16.50';
              if (age <= 60) return '21.90';
              return isEnglish ? 'Consult' : 'Consultar';
            }
            if (age <= 30) return '18.90';
            if (age <= 45) return '23.50';
            if (age <= 60) return '29.90';
            return isEnglish ? 'Consult' : 'Consultar';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={isEnglish ? [
          { icon: <ShieldCheck />, title: '40,000 Network Doctors', description: 'Freedom to choose specialists across all Spain.' },
          { icon: <Clock />, title: 'Zero Waiting Lists', description: 'Direct appointments with doctors and prompt diagnostic tests.' },
          { icon: <Award />, title: 'Basic Dental Included', description: 'Annual mouth cleanings and check-ups without extra fee.' }
        ] : [
          { icon: <ShieldCheck />, title: '40.000 Médicos Concertados', description: 'Libertad para elegir especialista en toda España.' },
          { icon: <Clock />, title: 'Sin Listas de Espera', description: 'Citas directas con médicos y pruebas clínicas rápidas.' },
          { icon: <Award />, title: 'Dental Básico Incluido', description: 'Limpiezas de boca y revisiones anuales sin sobrecoste.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Official Healthcare Provider' : 'Aseguradora oficial'}
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow={isEnglish ? 'Outpatient Options' : 'Modalidades Ambulatorias'}
        title={isEnglish ? 'Choose your ideal balance between monthly fee and copay' : 'Elige tu combinación perfecta entre cuota y copago'}
        description={isEnglish
          ? 'Both tiers grant access to the exact same medical network of 40,000+ doctors and AsisaLIVE telecare.'
          : 'Ambas modalidades incluyen acceso al mismo cuadro médico y servicios de AsisaLIVE.'}
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Select option' : 'Seleccionar modalidad'}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Medical Coverage' : 'Garantías Médicas'}
        title={isEnglish ? 'Outpatient healthcare coverages included' : 'Coberturas extrahospitalarias incluidas'}
        description={isEnglish ? 'Technical specifications based on official IPID AFR01S0071 and AFR01S0074.' : 'Especificaciones técnicas según los IPID oficiales AFR01S0071 y AFR01S0074.'}
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow={isEnglish ? 'Fast Process' : 'Proceso Rápido'}
        title={isEnglish ? 'Start using your health insurance in 4 steps' : 'Empieza a usar tu seguro médico en 4 pasos'}
        description={isEnglish ? '100% online enrollment with immediate digital activation.' : 'Contratación 100% online y digital con activación inmediata.'}
        steps={isEnglish ? [
          {
            title: 'Select your age',
            description: 'Choose whether you prefer no copay or lower monthly fees with copay.'
          },
          {
            title: 'Personal details',
            description: 'Fill out the contact and payment setup form.'
          },
          {
            title: 'Medical statement',
            description: 'Quick online health statement to finalize the registration.'
          },
          {
            title: 'Mobile health card',
            description: 'Log into the AsisaLIVE app and book your first specialist visit.'
          }
        ] : [
          {
            title: 'Cotiza tu edad',
            description: 'Selecciona si prefieres la modalidad con o sin copagos.'
          },
          {
            title: 'Datos personales',
            description: 'Rellena el formulario con tus datos de contacto y pago.'
          },
          {
            title: 'Cuestionario médico',
            description: 'Breve cuestionario de salud online para dar el alta.'
          },
          {
            title: 'Tu tarjeta en el móvil',
            description: 'Accede a la app AsisaLIVE y pide tu primera cita médica.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Customer Reviews' : 'Opiniones de Clientes'}
        title={isEnglish
          ? 'People enjoying private medical specialists with ASISA Esencial'
          : 'Personas que disfrutan de especialistas privados con ASISA Esencial'}
        items={testimonials}
      />

      <AsisaTrustSection
        eyebrow={isEnglish ? 'HLA Hospital Network' : undefined}
        title={isEnglish ? 'Direct Access to 18 Proprietary Hospitals and Over 40,000 Specialists' : undefined}
        description={isEnglish
          ? 'ASISA operates Spain\'s most extensive proprietary healthcare cooperative. Asisa Esencial connects you directly to primary centers and specialized clinics without delays.'
          : undefined}
        stats={isEnglish ? [
          { value: '40K+', label: 'Medical Specialists' },
          { value: '18', label: 'Proprietary HLA Hospitals' },
          { value: '36', label: 'Multispecialty Medical Centers' },
          { value: '100+', label: 'Dental Clinics Across Spain' }
        ] : undefined}
        highlights={isEnglish ? [
          {
            title: 'Direct specialist access',
            description: 'Consult cardiologists, dermatologists, or ophthalmologists directly without requiring a prior GP referral.'
          },
          {
            title: 'Proprietary HLA clinical centers',
            description: 'State-of-the-art outpatient centers for blood tests, X-rays, and ultrasounds with minimal wait.'
          },
          {
            title: 'Integrated dental care',
            description: 'Benefit from preventive dental check-ups and cleanings included at ASISA Dental clinics nationwide.'
          }
        ] : undefined}
      />

      <DigitalServicesSection
        eyebrow={isEnglish ? 'AsisaLIVE Telemedicine' : 'Telemedicina AsisaLIVE'}
        title={isEnglish ? 'Specialists and e-prescriptions on your smartphone' : 'Especialistas y recetas médicas en tu smartphone'}
        description={isEnglish
          ? 'Manage appointments, connect with duty doctors via video call 24/7, and receive electronic prescriptions directly in the app.'
          : 'Gestiona citas, consulta con médicos de guardia por videollamada y recibe tus recetas electrónicas directamente en la app.'}
        benefits={isEnglish ? [
          'Immediate primary care video consultations 24/7',
          'Official digital electronic prescription valid nationwide',
          'Search directory of 40,000+ doctors across Spain',
          'Digital medical card always ready on your phone'
        ] : [
          'Videoconsultas de atención primaria sin esperas',
          'Receta médica electrónica homologada',
          'Acceso a cuadro médico geolocalizado en toda España',
          'Tarjeta médica digital siempre disponible'
        ]}
        visual={
          <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
            <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-display font-black leading-snug">AsisaLIVE</h4>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Specialist' : 'Especialista'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Immediate Doctor Visit' : 'Consulta Médica Inmediata'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'Live video consultation' : 'Videollamada en directo'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Dental Care' : 'Dental Asisa'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Cleanings & Check-ups' : 'Limpiezas y Revisiones'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'No extra cost' : 'Sin coste adicional'}
                  </p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                {isEnglish ? '40,000 Doctors in Spain' : '40.000 Médicos en España'}
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={isEnglish ? [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Lowest Rate</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Outpatient Only</span>
        ] : [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Tarifa Mínima</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Sin Hospitalización</span>
        ]}
        title={isEnglish
          ? 'Medical Specialists and Diagnostic Tests from €13.90/month'
          : 'Especialistas y Pruebas Médicas desde 13,90€/mes'}
        description={isEnglish
          ? 'Enroll through VitaBlue to access Asisa\'s nationwide private network with dental care and AsisaLIVE telemedicine included.'
          : 'Contrata a través de VitaBlue y accede al cuadro médico concertado de Asisa con dental y telemedicina AsisaLIVE incluidos.'}
      />

      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
        title={isEnglish ? 'Everything you need to know about ASISA Esencial' : 'Resolvemos tus dudas sobre ASISA Esencial'}
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish
          ? 'Unsure if you need coverage with or without hospital stay?'
          : '¿No estás seguro de si necesitas cobertura con o sin hospitalización?'}
        description={isEnglish
          ? 'Our health insurance advisors at VitaBlue compare your needs transparently and without obligation.'
          : 'Nuestros asesores de VitaBlue comparan tus necesidades de salud de forma transparente y sin compromiso.'}
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-ESENCIAL-HELP', locale: isEnglish ? 'en' : 'es' })}
        advisorRole={isEnglish ? 'Health Insurance Advisor' : undefined}
        advisorBadge={isEnglish ? 'Assigned Advisor' : undefined}
        advisorQuote={isEnglish ? '"Hi, I\'m Lucía. I\'ll help you evaluate whether an outpatient plan like Esencial fits your routine, or if comprehensive coverage makes more sense."' : undefined}
        advisorSchedule={isEnglish ? 'Monday to Friday: 9:00 - 19:00 (CET)' : undefined}
        advisorResponseTime={isEnglish ? 'Reply in < 15 mins' : undefined}
        advisorCallText={isEnglish ? 'Call Free' : undefined}
        advisorWhatsAppText={isEnglish ? 'Ask via WhatsApp' : undefined}
      />
    </div>
  );
};

export default AsisaEsencial;

