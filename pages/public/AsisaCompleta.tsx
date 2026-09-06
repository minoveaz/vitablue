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
  TravelIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaCompleta: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard?flow=health&insurer=asisa');
  };

  const coverages = isEnglish ? [
    {
      title: 'Unlimited Hospitalization & Surgeries',
      desc: 'Individual room with companion bed (excluding ICU), surgical interventions, and advanced treatments across the HLA Hospital Group network.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Medical Network with 40,000+ Specialists',
      desc: 'Direct consultations without waiting lists in cardiology, traumatology, gynecology, dermatology, oncology, and general medicine.',
      illustration: HealthIllustration
    },
    {
      title: 'Advanced Diagnostic Technology',
      desc: 'Full access to MRIs, CT scans, endoscopies, ultrasounds, and comprehensive clinical laboratory tests at benchmark medical centers.',
      illustration: PreventionIllustration
    },
    {
      title: '24/7 Emergencies & Telemedicine',
      desc: 'Immediate outpatient and inpatient emergency medical attention in contracted clinics and on-demand video consultations via AsisaLIVE.',
      illustration: FamilyIllustration
    },
    {
      title: 'ASISA Dental Care Included',
      desc: 'Over 50 complimentary dental services: annual dental cleanings, diagnostic x-rays, emergency consultations, and discounts on orthodontics.',
      illustration: DentalIllustration
    },
    {
      title: 'Worldwide Travel Emergency Assistance',
      desc: 'Emergency medical assistance coverage abroad up to €14,000 per year per insured person for international trips up to 90 consecutive days.',
      illustration: TravelIllustration
    }
  ] : [
    {
      title: 'Hospitalización y Cirugías Ilimitadas',
      desc: 'Habitación individual con cama de acompañante (excepto UCI), intervenciones quirúrgicas y tratamientos en la red de hospitales del Grupo HLA.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Cuadro Médico con 40.000+ Especialistas',
      desc: 'Consultas directas sin listas de espera en cardiología, traumatología, ginecología, dermatología, oncología y medicina general.',
      illustration: HealthIllustration
    },
    {
      title: 'Pruebas Diagnósticas Avanzadas',
      desc: 'Acceso a resonancias magnéticas, TAC, endoscopias, ecografías y analíticas clínicas completas en centros de referencia.',
      illustration: PreventionIllustration
    },
    {
      title: 'Urgencias 24 Horas y Telemedicina',
      desc: 'Atención médica urgente ambulatoria y hospitalaria en clínicas concertadas y videoconsultas médicas inmediatas con AsisaLIVE.',
      illustration: FamilyIllustration
    },
    {
      title: 'Seguro Dental Asisa Incluido',
      desc: 'Más de 50 servicios odontológicos gratuitos: limpiezas dentales anuales, radiografías, consultas urgentes y descuentos en ortodoncia.',
      illustration: DentalIllustration
    },
    {
      title: 'Asistencia en Viajes Internacionales',
      desc: 'Cobertura médica de urgencias en el extranjero hasta 14.000€ al año por asegurado para viajes de hasta 90 días por salida.',
      illustration: TravelIllustration
    }
  ];

  const modalitiesList = isEnglish ? [
    {
      name: 'ASISA Completa +',
      subtitle: 'Reduced Copays (Most Popular)',
      desc: 'The best balance between an affordable monthly premium and low copays (€2.50 to €5.00 per visit). Hospital stays and surgeries are 100% copay-free.',
      priceDetail: 'From €24.90/mo + low copay',
      tag: 'Most Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Completa ++',
      subtitle: 'Maximum Monthly Savings',
      desc: 'Ultra-low monthly premium for individuals who see doctors occasionally but require full security against major surgical or hospital events.',
      priceDetail: 'From €19.90/mo + medium copay',
      tag: 'Budget',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    },
    {
      name: 'ASISA Completa No Copay',
      subtitle: 'Fixed Flat Rate',
      desc: 'Pay a fixed monthly fee and enjoy unlimited access to doctors, clinical tests, and full hospitalization with €0 extra charges.',
      priceDetail: 'From €39.90/mo (0€ Copay)',
      tag: 'Total Peace of Mind',
      badgeColor: 'bg-slate-100 text-text-main border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'ASISA Completa +',
      subtitle: 'Copagos Reducidos (Más Elegido)',
      desc: 'El mejor equilibrio entre una cuota mensual económica y copagos muy bajos (de 2,50€ a 5€ por consulta). Hospitalización y cirugías sin copago.',
      priceDetail: 'Desde 24,90€/mes + copago bajo',
      tag: 'Más Popular',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Completa ++',
      subtitle: 'Máxima Economía Mensual',
      desc: 'Prima mensual muy reducida para quienes utilizan el seguro de forma puntual pero desean cobertura total de hospitalización y cirugías.',
      priceDetail: 'Desde 19,90€/mes + copago medio',
      tag: 'Económico',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    },
    {
      name: 'ASISA Completa Sin Copago',
      subtitle: 'Cuota Fija Total',
      desc: 'Pagas una cuota mensual fija y disfrutas de acceso ilimitado a médicos, consultas, pruebas y hospitalización sin coste adicional.',
      priceDetail: 'Desde 39,90€/mes (Copago 0€)',
      tag: 'Tranquilidad Total',
      badgeColor: 'bg-slate-100 text-text-main border border-slate-200',
      isFeatured: false
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Francisco J.',
      meta: 'ASISA Completa + Insured (Madrid)',
      comment: 'We have had ASISA Completa for the entire family for 3 years. We go to Hospital Universitario Moncloa and the speed and friendliness of the staff are second to none.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Elena B.',
      meta: 'ASISA Completa ++ Insured (Seville)',
      comment: 'I selected Completa ++ because I rarely go to the doctor, but wanted full protection for hospital emergencies. I pay very little monthly and have complete peace of mind.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Marcos R.',
      meta: 'AsisaLIVE and Specialists (Alicante)',
      comment: 'The AsisaLIVE app works wonderfully. I have had dermatology and GP consultations in under 5 minutes right from my office.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Francisco J.',
      meta: 'Asegurado ASISA Completa + (Madrid)',
      comment: 'Llevamos 3 años con Asisa Completa para toda la familia. Acudimos al Hospital Universitario Moncloa y la rapidez y el trato del cuadro médico son excepcionales.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Elena B.',
      meta: 'Asegurada ASISA Completa ++ (Sevilla)',
      comment: 'Elegí la modalidad Completa ++ porque casi nunca voy al médico pero quería estar protegida ante cualquier operación o ingreso. Pago muy poco al mes y estoy tranquila.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Marcos R.',
      meta: 'AsisaLIVE y Especialistas (Alicante)',
      comment: 'La app AsisaLIVE funciona fenomenal. He tenido consultas de dermatología y medicina general en menos de 5 minutos desde el trabajo.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = isEnglish ? [
    {
      q: 'What is the difference between ASISA Completa + and Completa ++?',
      a: 'The key distinction lies in monthly premiums and copay amounts. In ASISA Completa + the monthly fee is slightly higher with very low copays (€2.50 to €5.00). In ASISA Completa ++ the monthly fee is discounted (from €19.90/mo) in exchange for medium copays per consultation or test.'
    },
    {
      q: 'Does ASISA Completa have waiting periods (carencias)?',
      a: 'Specialist consultations, general medicine, emergency room visits, and routine diagnostics are covered from day one. Complex services such as planned hospitalizations or surgeries typically carry a 6 to 8 month waiting period. If you switch from another insurer with over 1 year of tenure, ASISA waives most waiting periods.'
    },
    {
      q: 'Which hospitals are included with this policy?',
      a: 'You have direct access to all 18 proprietary HLA Group hospitals and 36 clinics in Spain (like HLA Moncloa in Madrid and HLA Santa Isabel in Seville) plus hundreds of contracted private clinics across Spain.'
    },
    {
      q: 'Can I include the whole family in the same policy?',
      a: 'Yes, ASISA Completa offers family multi-policy discounts starting with 3 or more insured members, with unified billing and individual digital medical cards on each phone.'
    }
  ] : [
    {
      q: '¿Qué diferencia hay entre ASISA Completa + y Completa ++?',
      a: 'La diferencia principal está en la prima mensual y el importe del copago. En ASISA Completa + la cuota mensual es ligeramente superior pero los copagos son mínimos (de 2,50€ a 5€). En ASISA Completa ++ la cuota mensual es muy reducida (desde 19,90€) a cambio de copagos medios por consulta médica y pruebas diagnósticas.'
    },
    {
      q: '¿Tiene periodos de carencia ASISA Completa?',
      a: 'Las consultas de especialistas, medicina general, urgencias y analíticas básicas están cubiertas desde el primer día. Coberturas complejas como hospitalizaciones programadas o intervenciones quirúrgicas tienen una carencia habitual de 6 a 8 meses. Si vienes de otra aseguradora con más de 1 año de antigüedad, Asisa elimina la mayoría de carencias.'
    },
    {
      q: '¿Qué hospitales tengo incluidos con esta póliza?',
      a: 'Accedes a toda la red propia de hospitales y clínicas del Grupo HLA (18 hospitales y 36 centros en España) y a cientos de hospitales concertados de primer nivel en todo el país.'
    },
    {
      q: '¿Puedo incluir a toda mi familia en la misma póliza?',
      a: 'Sí, ASISA Completa ofrece descuentos familiares por número de asegurados (a partir de 3 miembros) con una única gestión de pago y tarjetas digitales independientes en el móvil.'
    }
  ];

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance/asisa-completa/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/';

  const title = isEnglish
    ? 'ASISA Completa (+ / ++) | Comprehensive Health Insurance in Spain | VitaBlue'
    : 'ASISA Completa (+ / ++) | Seguro de Salud Completo con Hospitalización | VitaBlue';

  const description = isEnglish
    ? 'Official ASISA Completa (+ / ++) healthcare insurance in Spain. Full hospitalization, 40,000+ medical doctors, HLA hospital network, dental cover, and 24/7 video doctor.'
    : 'Seguro médico oficial ASISA Completa (+ / ++). Hospitalización quirúrgica, más de 40.000 especialistas, red de hospitales propios Grupo HLA, dental y telemedicina 24h.';

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
          ? 'Independent private health insurance comparator in Spain. Official rates and expert advice.'
          : 'Asesoría independiente de seguros de salud en España. Precios oficiales y asesoramiento profesional sin comisiones.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Completa',
        description: isEnglish
          ? 'Comprehensive private health insurance in Spain with full medical and surgical hospitalization, proprietary HLA network, and low copay tiers.'
          : 'Póliza de seguro médico integral con hospitalización médica y quirúrgica, red hospitalaria Grupo HLA y opciones con copago reducido.',
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
            name: 'ASISA Completa',
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

        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance/asisa-completa/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/" />

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
          { label: 'ASISA Completa', href: canonicalUrl }
        ] : [
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Completa', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={isEnglish ? [
          { label: 'Full Medical & Surgical Cover', tone: 'brand', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { label: 'Proprietary HLA Network', tone: 'accent' },
          { label: 'IPID AFR01S0015 / 80' }
        ] : [
          { label: 'Cobertura Integral con Hospitalización', tone: 'brand', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { label: 'Red Hospitalaria Grupo HLA', tone: 'accent' },
          { label: 'IPID AFR01S0015 / 80' }
        ]}
        title={isEnglish
          ? 'ASISA Completa: Comprehensive Private Health Insurance in Spain'
          : 'ASISA Completa: Asistencia Sanitaria Integral con Hospitalización'}
        description={isEnglish
          ? 'Direct access to Spain\'s top medical specialists, diagnostic imaging, and private hospitalization. Choose between Completa + (reduced copays) and Completa ++ (maximum monthly savings).'
          : 'Acceso directo a especialistas médicos de prestigio, pruebas diagnósticas y hospitalización médica y quirúrgica sin esperas. Elige entre Completa + (copago reducido) y Completa ++ (máximo ahorro mensual).'}
        primaryAction={{
          label: isEnglish ? 'Calculate Health Quote' : 'Calcular Tarifa Completa',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: isEnglish ? 'Inquire via WhatsApp' : 'Consultar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-COMPLETA', locale: isEnglish ? 'en' : 'es' })
        }}
      >
        <QuoteEstimator
          title={isEnglish ? 'ASISA Completa Quote Estimator' : 'Cotizador ASISA Completa'}
          description={isEnglish
            ? 'Estimate your monthly fee by age and copay preference.'
            : 'Calcula tu cuota mensual estimada según edad y modalidad de copago.'}
          initialAge={32}
          minAge={0}
          maxAge={65}
          ageSuffix={isEnglish ? 'years' : 'años'}
          ageLabel={isEnglish ? 'Insured Age' : 'Edad del Asegurado'}
          modalityLabel={isEnglish ? 'Copay Tier' : 'Modalidad'}
          priceLabel={isEnglish ? 'Estimated Fee:' : 'Cuota Estimada:'}
          priceSuffix={isEnglish ? '€/mo' : '€/mes'}
          submitLabel={isEnglish ? 'Start Online Application' : 'Iniciar Contratación Online'}
          options={isEnglish ? [
            { id: 'completa-plus', label: 'Completa +' },
            { id: 'completa-plus-plus', label: 'Completa ++' },
            { id: 'sin-copago', label: 'No Copay' }
          ] : [
            { id: 'completa-plus', label: 'Completa +' },
            { id: 'completa-plus-plus', label: 'Completa ++' },
            { id: 'sin-copago', label: 'Sin Copago' }
          ]}
          calculatePrice={(age, option) => {
            let base = 24.90;
            if (option === 'completa-plus-plus') base = 19.90;
            if (option === 'sin-copago') base = 39.90;

            if (age > 40) base += 8;
            if (age > 50) base += 18;
            if (age > 60) base += 35;
            return base.toFixed(2);
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={isEnglish ? [
          { icon: <ShieldCheck />, title: '40,000+ Specialists', description: 'Direct appointments with leading doctors without gatekeeper delays.' },
          { icon: <Clock />, title: 'Zero Wait Times', description: 'Immediate consultations, diagnostic tests, and emergencies from day one.' },
          { icon: <Award />, title: 'HLA Hospital Network', description: '18 proprietary hospitals and 36 multi-specialty centers across Spain.' }
        ] : [
          { icon: <ShieldCheck />, title: '40.000+ Especialistas', description: 'Consultas directas sin pasar por el médico de cabecera.' },
          { icon: <Clock />, title: 'Sin Listas de Espera', description: 'Atención ágil en consultas, pruebas y urgencias médicas.' },
          { icon: <Award />, title: 'Red Propia Grupo HLA', description: '18 hospitales propios y 36 centros multiespecialidad en España.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow={isEnglish ? 'Official Healthcare Network' : 'Red asistencial médica oficial'}
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow={isEnglish ? 'Copay Comparison' : 'Comparativa de Modalidades'}
        title={isEnglish ? 'Find the balance between monthly fee and copay' : 'Encuentra el equilibrio ideal entre cuota mensual y copago'}
        description={isEnglish
          ? 'All modalities include full medical and surgical hospitalization across Spain.'
          : 'Todas las modalidades incluyen la misma cobertura de hospitalización y cuadro médico completo en toda España.'}
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel={isEnglish ? 'Select this plan' : 'Elegir esta modalidad'}
      />

      <CoverageGrid
        eyebrow={isEnglish ? 'Comprehensive Guarantees' : 'Garantías Médicas Completas'}
        title={isEnglish ? 'Full protection for you and your family' : 'Todo lo que necesitas para tu salud y la de tu familia'}
        description={isEnglish
          ? 'Complete technical specs based on official IPID documents AFR01S0015 and AFR01S0080.'
          : 'Especificaciones técnicas oficiales según las notas informativas previas AFR01S0015 y AFR01S0080.'}
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow={isEnglish ? 'Quick Setup' : 'Alta Sencilla'}
        title={isEnglish ? 'How to contract ASISA Completa in 4 steps' : 'Cómo contratar tu seguro ASISA Completa'}
        description={isEnglish
          ? '100% digital process with official insurer prices and personal support from VitaBlue.'
          : 'Proceso 100% digital con tarifas oficiales de Asisa y acompañamiento de tu asesor.'}
        steps={isEnglish ? [
          {
            title: 'Choose your modality',
            description: 'Select Completa +, Completa ++, or No Copay based on your expected doctor visits.'
          },
          {
            title: 'Insured details',
            description: 'Provide basic info for each family member to apply multi-policy group discounts.'
          },
          {
            title: 'Digital medical declaration',
            description: 'Fill out the confidential online health questionnaire securely on ASISA\'s official platform.'
          },
          {
            title: 'Policy activation',
            description: 'Receive your contract and digital card on your phone to access specialists immediately.'
          }
        ] : [
          {
            title: 'Elige tu modalidad',
            description: 'Selecciona Completa +, Completa ++ o Sin Copago según la frecuencia con la que acudes al médico.'
          },
          {
            title: 'Datos de los asegurados',
            description: 'Introduce los datos de los miembros a incluir para aplicar los descuentos por familia numerosa.'
          },
          {
            title: 'Cuestionario de salud digital',
            description: 'Completa la declaración médica de forma confidencial y segura a través de Asisa.'
          },
          {
            title: 'Activación y tarjeta digital',
            description: 'Recibe tu póliza y tarjeta médica digital en el móvil para acudir a las consultas desde el día 1.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Insured Opinions' : 'Experiencias Reales'}
        title={isEnglish ? 'Families and individuals who trust ASISA Completa' : 'Familias y particulares que ya confían en ASISA Completa'}
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
        eyebrow={isEnglish ? 'AsisaLIVE App' : 'Servicios Digitales'}
        title={isEnglish ? 'Digital healthcare on your phone 24/7' : 'Tu salud en la palma de la mano con AsisaLIVE'}
        description={isEnglish
          ? 'Connect with general practitioners and pediatricians in under 5 minutes without appointments. Manage electronic prescriptions, medical authorizations, and virtual cards.'
          : 'Conéctate con médicos de cabecera y pediatras en menos de 5 minutos sin cita previa. Gestiona recetas electrónicas, autorizaciones y tu tarjeta sanitaria digital.'}
        benefits={isEnglish ? [
          'Immediate video consultations with general doctors 24/7',
          'Digital electronic prescriptions ready at any pharmacy',
          'Search directory of 40,000+ medical specialists',
          'Direct appointment scheduling at HLA Group hospitals'
        ] : [
          'Videoconsultas de urgencia 24/7 sin cita previa',
          'Receta médica electrónica con validez nacional',
          'Buscador del cuadro médico con más de 40.000 profesionales',
          'Cita online directa en los hospitales del Grupo HLA'
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
                    {isEnglish ? 'General Medicine' : 'Medicina General'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? 'Urgent Video Consultation' : 'Videoconsulta Inmediata'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'Average response: 3 mins' : 'Tiempo medio: 3 mins'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">
                    {isEnglish ? 'Specialists' : 'Especialistas'}
                  </span>
                  <p className="text-xs font-bold leading-tight">
                    {isEnglish ? '40,000+ Doctors' : '40.000+ Facultativos'}
                  </p>
                  <p className="text-[9px] text-slate-200">
                    {isEnglish ? 'Direct booking in app' : 'Cita directa en app'}
                  </p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                {isEnglish ? 'HLA Proprietary Network' : 'Red Propia Grupo HLA'}
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={isEnglish ? [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Family Savings</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Multi-Insured Discount</span>
        ] : [
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Ahorro Familiar</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Descuento Multi-asegurado</span>
        ]}
        title={isEnglish
          ? 'Special Family Pricing on ASISA Completa'
          : 'Descuentos por Inclusión de Nuevos Miembros en la Póliza'}
        description={isEnglish
          ? 'Insure your family and receive multi-insured discounts from 3 members upwards. Official promotions applicable with zero commission.'
          : 'Asegura a tu familia con Asisa y benefíciate de tarifas bonificadas a partir de 3 miembros. Todas las promociones vigentes de la aseguradora aplicadas directamente.'}
      />

      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
        title={isEnglish ? 'Everything you need to know about ASISA Completa' : 'Todo lo que necesitas saber sobre ASISA Completa'}
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish
          ? 'Still unsure which ASISA Completa tier fits you best?'
          : '¿Dudas entre Completa +, Completa ++ o Sin Copago?'}
        description={isEnglish
          ? 'Our health insurance advisors at VitaBlue review your medical frequency to calculate the most cost-effective option for you.'
          : 'Nuestros asesores colegiados en VitaBlue analizan la frecuencia con la que acudes al médico para decirte qué modalidad te sale más a cuenta.'}
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-COMPLETA-HELP', locale: isEnglish ? 'en' : 'es' })}
        advisorRole={isEnglish ? 'Senior Health Insurance Advisor' : undefined}
        advisorBadge={isEnglish ? 'Assigned Advisor' : undefined}
        advisorQuote={isEnglish ? '"Hi, I\'m Lucía. I\'ll help you evaluate copays vs monthly premium to choose the smartest ASISA plan for your household."' : undefined}
        advisorSchedule={isEnglish ? 'Monday to Friday: 9:00 - 19:00 (CET)' : undefined}
        advisorResponseTime={isEnglish ? 'Reply in < 15 mins' : undefined}
        advisorCallText={isEnglish ? 'Call Free' : undefined}
        advisorWhatsAppText={isEnglish ? 'Ask via WhatsApp' : undefined}
      />
    </div>
  );
};

export default AsisaCompleta;
