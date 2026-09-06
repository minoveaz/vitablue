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

export const AsisaHealthResidents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat');
    navigate('/wizard?flow=residents&insurer=asisa');
  };

  const coverages = isEnglish ? [
    {
      title: 'Accredited for Spanish Legal Residency',
      desc: 'Complies 100% with Immigration (Extranjería) regulations for Non-Lucrative Visa (NLV), Digital Nomad Visa, Golden Visa, and Arraigo.',
      illustration: HealthIllustration
    },
    {
      title: 'Zero Copays & Zero Deductibles',
      desc: 'All consultations, diagnostic tests, treatments, and hospitalizations at €0 extra cost, as strictly required by Spanish law for foreign residents.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Comprehensive Surgical & Medical Hospitalization',
      desc: 'Individual private room with companion bed across the HLA Group hospital network and partner centers throughout Spain.',
      illustration: PreventionIllustration
    },
    {
      title: 'Sanitary & Mortal Repatriation',
      desc: 'Unlimited guarantee for emergency medical evacuation and mortal remains repatriation back to the home country of all insured members.',
      illustration: TravelIllustration
    },
    {
      title: 'Direct Specialist Access & Preventive Health',
      desc: 'Cardiology, oncology, traumatology, gynecology, annual checkups, and direct access to 40,000+ medical doctors with zero waiting lists.',
      illustration: FamilyIllustration
    },
    {
      title: 'ASISA Dental Network Included',
      desc: 'Periodic dental exams, simple tooth extractions, routine dental cleanings, and preferential pricing on implants and orthodontics.',
      illustration: DentalIllustration
    }
  ] : [
    {
      title: 'Homologación para Residencia Legal',
      desc: 'Cumple el 100% de los requisitos de Extranjería para Residencia No Lucrativa (RNL), Nómada Digital, Golden Visa o Arraigo.',
      illustration: HealthIllustration
    },
    {
      title: 'Sin Copagos Ni Franquicias',
      desc: 'Todas las consultas, pruebas, tratamientos y hospitalizaciones a coste 0€, tal como exige la legislación española a extranjeros residentes.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Hospitalización Quirúrgica y Médica',
      desc: 'Ingreso en habitación individual con cama para acompañante en la red hospitalaria Grupo HLA y centros asociados en toda España.',
      illustration: PreventionIllustration
    },
    {
      title: 'Repatriación Sanitaria y Funeraria',
      desc: 'Garantía ilimitada de traslado sanitario de urgencia y repatriación de restos mortales al país de nacionalidad de los asegurados.',
      illustration: TravelIllustration
    },
    {
      title: 'Especialistas y Medicina Preventiva',
      desc: 'Cardiología, oncología, traumatología, ginecología, chequeos anuales y acceso directo a más de 40.000 profesionales sin listas de espera.',
      illustration: FamilyIllustration
    },
    {
      title: 'Cobertura Dental Asisa Incluida',
      desc: 'Revisiones periódicas, extracciones, limpiezas y tarifas preferentes en implantes y ortodoncia en toda la red Asisa Dental.',
      illustration: DentalIllustration
    }
  ];

  const modalitiesList = isEnglish ? [
    {
      name: 'ASISA Health Residents Annual',
      subtitle: 'Consulate & Immigration Process',
      desc: 'Full upfront 12-month policy payment, the legally required format by consulates and Extranjería offices to grant initial Spanish residency.',
      priceDetail: 'From €45.00/mo (Annual Payment)',
      tag: 'Immigration Required',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Residents Family',
      subtitle: 'Principal + Spouse & Children',
      desc: 'Joint coverage for the entire family unit applying for residency. Single policy with individualized certificates for consular presentation.',
      priceDetail: 'Discounted family package',
      tag: 'Families',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Health Residents Anual',
      subtitle: 'Trámite Consular y Extranjería',
      desc: 'Póliza con pago anual íntegro, el formato legalmente exigido por los consulados y oficinas de extranjería para conceder la residencia inicial.',
      priceDetail: 'Desde 45,00€/mes (Pago Anual)',
      tag: 'Requerido Extranjería',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Residents Familiar',
      subtitle: 'Titular + Cónyuge e Hijos',
      desc: 'Cobertura conjunta para toda la unidad familiar solicitante de residencia. Mismo certificado con desglose individualizado para el consulado.',
      priceDetail: 'Tarifa familiar bonificada',
      tag: 'Familias',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'George & Sarah T.',
      meta: 'Non-Lucrative Visa in Valencia (UK)',
      comment: 'We applied for the Non-Lucrative Visa from London. The consulate required zero copays and unlimited hospital care. ASISA ticked every box and VitaBlue delivered our official certificates in 24 hours.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Diego & Mariana P.',
      meta: 'Digital Nomad Visa in Malaga (Argentina)',
      comment: 'As remote workers, we needed comprehensive private coverage and a fast certificate for the UGE in Spain. VitaBlue\'s management of our ASISA policy was flawless.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Robert K.',
      meta: 'Golden Visa in Alicante (USA)',
      comment: 'Direct access to the HLA hospital network in Alicante. English-language care via the AsisaLIVE video doctor and exemplary guidance from the VitaBlue team.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'George & Sarah T.',
      meta: 'Residencia No Lucrativa en Valencia (Reino Unido)',
      comment: 'Tramitamos la Non-Lucrative Visa desde Londres. El consulado exigía una póliza sin copagos y con hospitalización ilimitada. Asisa cumplió cada punto y en 24h teníamos los certificados oficiales.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Diego & Mariana P.',
      meta: 'Visado Nómada Digital en Málaga (Argentina)',
      comment: 'Como trabajadores remotos necesitábamos cobertura completa y un certificado rápido para la UGE. La gestión de VitaBlue con Asisa fue impecable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Robert K.',
      meta: 'Golden Visa en Alicante (EE.UU.)',
      comment: 'Acceso directo a la red hospitalaria HLA en Alicante. Atención en inglés desde la app AsisaLIVE y excelente servicio de los asesores.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'Why does Spanish immigration law require insurance "without copays" for residency?',
      a: 'Spanish Immigration Law requires foreign nationals residing in Spain without Social Security contributions to hold private healthcare equivalent to the Spanish National Health System, which strictly forbids copays or deductibles that might restrict healthcare access.'
    },
    {
      q: 'Is ASISA Health Residents valid for the Digital Nomad Visa?',
      a: 'Yes, it is 100% valid and officially approved both at Spanish Consulates abroad and at the Large Business and Strategic Collectives Unit (UGE-CE) for applications submitted directly within Spain.'
    },
    {
      q: 'Does the policy need to be paid annually upfront?',
      a: 'Yes. For residency visa applications or renewals (Non-Lucrative Visa, Digital Nomad, or Family Reunification), authorities require proof of full payment for the 12 months of coverage.'
    },
    {
      q: 'Which hospitals can I access in Spain?',
      a: 'You enjoy direct access to all 18 hospitals of the HLA Hospital Group (such as HLA Moncloa in Madrid, Clínica El Ángel in Malaga, HLA Santa Isabel in Seville, etc.) and a contracted national network of over 40,000 specialists across Spain.'
    }
  ] : [
    {
      q: '¿Por qué la ley española exige un seguro "sin copagos" para la residencia?',
      a: 'La Ley de Extranjería exige que los extranjeros que residan en España sin cotizar a la Seguridad Social tengan una cobertura médica pública equivalente a la del Sistema Nacional de Salud español, lo cual implica que no existan copagos ni franquicias que limiten el acceso al tratamiento.'
    },
    {
      q: '¿Es válido ASISA Health Residents para el visado de Nómada Digital?',
      a: 'Sí, es 100% válido y aceptado tanto por los Consulados de España en origen como por la Unidad de Grandes Empresas (UGE-CE) en solicitudes tramitadas directamente en España.'
    },
    {
      q: '¿El pago debe ser anual?',
      a: 'Sí. Para la solicitud o renovación de visados de residencia (Residencia No Lucrativa, Nómada Digital o Reagrupación Familiar), las autoridades exigen presentar el justificante de pago íntegro de los 12 meses de cobertura.'
    },
    {
      q: '¿Qué hospitales tengo disponibles en España?',
      a: 'Dispones de acceso preferente a los 18 hospitales del Grupo HLA (como el Hospital Moncloa en Madrid, Clínica El Ángel en Málaga, Santa Isabel en Sevilla, etc.) y a una red concertada con más de 40.000 facultativos en todo el territorio nacional.'
    }
  ];

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance/asisa-health-residents/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/';

  const title = isEnglish
    ? 'ASISA Health Residents | Spanish Residency & Digital Nomad Insurance | VitaBlue'
    : 'ASISA Health Residents | Seguro Residencia y Nómadas Digitales | VitaBlue';

  const description = isEnglish
    ? 'Official ASISA Health Residents insurance for Non-Lucrative Visa and Digital Nomads in Spain. Zero copays, repatriation included, and 24h certificate.'
    : 'Seguro médico oficial ASISA Health Residents para visado de residencia no lucrativa y nómadas digitales en España. Sin copagos, repatriación incluida y certificado 24h.';

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
          ? 'Official insurance brokerage for residency visas, non-lucrative expats, and nomads in Spain.'
          : 'Asesoría oficial de seguros de salud homologados para visados y extranjeros en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Health Residents',
        description: isEnglish
          ? 'Comprehensive health insurance for non-EU foreign residents in Spain: Non-Lucrative Visa, Digital Nomad, and Family Reunification.'
          : 'Seguro médico completo para extranjeros no comunitarios en España: Residencia No Lucrativa, Nómada Digital y Reagrupación Familiar.',
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
            name: 'ASISA Health Residents',
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

        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance/asisa-health-residents/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/" />

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
          { label: 'ASISA Health Residents', href: canonicalUrl }
        ] : [
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Health Residents', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={isEnglish ? [
          { label: 'Spanish Residency Visa Homologated', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Zero Copays & Zero Deductibles', tone: 'accent' },
          { label: 'IPID AFR01S0128' }
        ] : [
          { label: 'Homologado Extranjería España', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Sin Copagos ni Franquicias', tone: 'accent' },
          { label: 'IPID AFR01S0128' }
        ]}
        title={isEnglish
          ? 'ASISA Health Residents: Insurance for Spanish Residency & Digital Nomads'
          : 'ASISA Health Residents: Seguro para Residencia y Nómadas en España'}
        description={isEnglish
          ? 'Full comprehensive medical coverage policy required by Spanish Consulates and Extranjería for Non-Lucrative Visa (NLV), Digital Nomad, and Arraigo. 0 copays, full hospitalization, and 24h official certificate.'
          : 'Póliza de cuadro completo exigida por Extranjería para Residencia No Lucrativa, Nómadas Digitales y Arraigo. Cobertura médica y quirúrgica sin copagos, repatriación ilimitada y certificado para el expediente en 24h.'}
        primaryAction={{
          label: isEnglish ? 'Calculate Residency Quote' : 'Calcular Seguro Residencia',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: isEnglish ? 'Inquire via WhatsApp' : 'Consultar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-RESIDENTS', locale: isEnglish ? 'en' : 'es' })
        }}
      >
        <QuoteEstimator
          title={isEnglish ? 'ASISA Health Residents Estimator' : 'Cotizador ASISA Health Residents'}
          description={isEnglish
            ? 'Estimate your premium based on the primary applicant\'s age.'
            : 'Calcula tu prima estimada según la edad del solicitante.'}
          initialAge={42}
          minAge={18}
          maxAge={70}
          ageSuffix={isEnglish ? 'years' : 'años'}
          ageLabel={isEnglish ? 'Insured Age' : 'Edad del Asegurado'}
          modalityLabel={isEnglish ? 'Modality' : 'Modalidad'}
          priceLabel={isEnglish ? 'Estimated Fee:' : 'Cuota Estimada:'}
          priceSuffix={isEnglish ? '€/mo' : '€/mes'}
          submitLabel={isEnglish ? 'Start Online Application' : 'Iniciar Contratación Online'}
          options={isEnglish ? [
            { id: 'individual', label: 'Single Applicant' },
            { id: 'familiar', label: 'Family Package' }
          ] : [
            { id: 'individual', label: 'Individual' },
            { id: 'familiar', label: 'Familiar' }
          ]}
          calculatePrice={(age, option) => {
            let base = 45;
            if (age > 50) base = 65;
            if (age > 60) base = 95;
            if (option === 'familiar') base = Math.round(base * 1.8);
            return `${base}.00`;
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={isEnglish ? [
          { icon: <ShieldCheck />, title: '100% Extranjería Approval', description: 'Zero copays and full hospital care matching National Health System.' },
          { icon: <Clock />, title: 'Annual Certificate in 24h', description: 'Official PDF with digital verification code (CSV) for embassies.' },
          { icon: <Award />, title: 'HLA Hospital Network', description: '18 proprietary hospitals and over 36 medical clinics across Spain.' }
        ] : [
          { icon: <ShieldCheck />, title: '100% Válido en Extranjería', description: 'Póliza sin copagos equivalente al Sistema Nacional de Salud.' },
          { icon: <Clock />, title: 'Certificado Anual en 24h', description: 'Documento con CSV oficial exigido para solicitud de residencia.' },
          { icon: <Award />, title: 'Red de Hospitales HLA', description: '18 hospitales propios y más de 36 clínicas en toda España.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Official healthcare provider' : 'Aseguradora oficial homologada'}
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow={isEnglish ? 'Tailored Modalities' : 'Modalidades a Medida'}
        title={isEnglish ? 'Select the policy that fits your application' : 'Elige la opción adecuada para tu expediente'}
        description={isEnglish
          ? 'Both modalities include zero copays and unlimited medical repatriation.'
          : 'Ambas opciones cuentan con cobertura sin copagos y repatriación ilimitada requerida por la ley.'}
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Select this modality' : 'Seleccionar modalidad'}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Spanish Immigration Guarantees' : 'Garantías de Extranjería'}
        title={isEnglish ? 'Everything your residency application requires' : 'Todo lo que tu expediente de residencia necesita'}
        description={isEnglish
          ? 'Comprehensive medical specs conforming to official IPID doc AFR01S0128.'
          : 'Especificaciones médicas completas según el documento contractual IPID AFR01S0128.'}
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow={isEnglish ? 'Simple Procedure' : 'Trámite Sencillo'}
        title={isEnglish ? 'Get your residency certificate in 4 steps' : 'Tramita tu póliza de residencia en 4 pasos'}
        description={isEnglish
          ? 'Guided by licensed insurance advisors with expertise in Spanish immigration procedures.'
          : 'Acompañamiento especializado de nuestros asesores expertos en visados y extranjería.'}
        steps={isEnglish ? [
          {
            title: 'Quote & select coverage',
            description: 'Enter your age and residency type (Non-Lucrative Visa, Digital Nomad, Golden Visa, or Arraigo).'
          },
          {
            title: 'Applicant personal details',
            description: 'Provide your passport details and legal address for official policy generation.'
          },
          {
            title: 'Medical questionnaire',
            description: 'Fill out the confidential online medical declaration directly via ASISA secure systems.'
          },
          {
            title: 'Receive official certificate',
            description: 'Get your stamped certificate with CSV verification code in 24h ready to submit to the consulate or UGE.'
          }
        ] : [
          {
            title: 'Cotización personalizada',
            description: 'Indica la edad de los miembros de la familia y el tipo de permiso de residencia a solicitar.'
          },
          {
            title: 'Datos de los asegurados',
            description: 'Ingresa los números de pasaporte y domicilio para la emisión del contrato oficial.'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Completa la declaración de salud online de forma confidencial a través del enlace seguro de Asisa.'
          },
          {
            title: 'Emisión del Certificado 24h',
            description: 'Recibe en tu correo el certificado oficial con CSV sellado para adjuntar a tu expediente consular o telemático.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Resident Reviews' : 'Casos de Éxito'}
        title={isEnglish ? 'Expats and Nomads Already Living in Spain with ASISA' : 'Extranjeros que ya residen legalmente en España con Asisa'}
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
        eyebrow={isEnglish ? 'AsisaLIVE Telemedicine' : 'Atención Digital'}
        title={isEnglish ? 'Healthcare from your smartphone anywhere in Spain' : 'Asistencia médica en tu idioma y en cualquier ciudad'}
        description={isEnglish
          ? 'AsisaLIVE provides 24/7 access to video doctor consultations, official e-prescriptions, and English-speaking medical professionals throughout Spain.'
          : 'AsisaLIVE te da acceso a consultas médicas por videollamada 24/7, recetas electrónicas y gestión de autorizaciones sin desplazarte.'}
        benefits={isEnglish ? [
          'Direct consultation with general doctors and pediatricians 24/7',
          'Electronic prescriptions accepted at all pharmacies across Spain',
          'Fast appointment scheduling at HLA Group hospitals',
          'English-speaking medical support options'
        ] : [
          'Consultas directas con médicos de familia y pediatras 24/7',
          'Receta médica electrónica con validez en farmacias de toda España',
          'Gestión inmediata de citas en hospitales del Grupo HLA',
          'Atención multilingüe para asegurados internacionales'
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
                    {isEnglish ? 'Residency Certificate' : 'Certificado Residencia'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'CSV Code for Immigration' : 'Código CSV para Extranjería'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'Official PDF emitted in 24h' : 'Disponible en PDF oficial 24h'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Telemedicine' : 'Telemedicina'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Immediate Doctor Video Call' : 'Videoconsulta Médica Inmediata'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? '24/7 in English & Spanish' : 'Atención 24/7 sin esperas'}
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
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">100% Compliant</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Consulates & UGE</span>
        ] : [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">100% Homologado</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Consulados y UGE</span>
        ]}
        title={isEnglish
          ? 'Guaranteed Compliance with Spanish Residency Requirements'
          : 'Garantía de Aceptación para tu Permiso de Residencia'}
        description={isEnglish
          ? 'ASISA Health Residents is engineered to fulfill every legal criterion under Spanish immigration law: zero copays, zero deductibles, and comprehensive coverage throughout Spain.'
          : 'ASISA Health Residents está diseñado para cumplir de forma exhaustiva con los criterios exigidos por Extranjería: póliza sin copagos, sin franquicias y con cobertura integral en toda España.'}
      />

      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
        title={isEnglish ? 'Everything you need to know about ASISA Health Residents' : 'Todo lo que necesitas saber sobre ASISA Health Residents'}
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish
          ? 'Do you have questions about your residency visa requirements?'
          : '¿Tienes dudas sobre los requisitos de tu trámite de residencia?'}
        description={isEnglish
          ? 'Every consulate and Extranjería office can apply specific rules. Our specialized visa advisory team at VitaBlue reviews your requirements for free.'
          : 'Cada consulado u oficina de extranjería aplica matices según el tipo de residencia. Nuestro equipo en VitaBlue revisa tu caso de forma personalizada y sin coste.'}
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-RESIDENTS-HELP', locale: isEnglish ? 'en' : 'es' })}
        advisorRole={isEnglish ? 'Senior Residency & Expat Health Advisor' : undefined}
        advisorBadge={isEnglish ? 'Assigned Advisor' : undefined}
        advisorQuote={isEnglish ? '"Hi, I\'m Lucía. I will help you obtain your Non-Lucrative or Nomad Visa health policy with zero copays and full compliance. Reach out to me via WhatsApp!"' : undefined}
        advisorSchedule={isEnglish ? 'Monday to Friday: 9:00 - 19:00 (CET)' : undefined}
        advisorResponseTime={isEnglish ? 'Reply in < 15 mins' : undefined}
        advisorCallText={isEnglish ? 'Call Free' : undefined}
        advisorWhatsAppText={isEnglish ? 'Ask via WhatsApp' : undefined}
      />
    </div>
  );
};

export default AsisaHealthResidents;
