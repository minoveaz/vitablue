import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, ArrowRight,
  Sparkles, MessageSquare
} from 'lucide-react';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import FaqSection from '@/components/organisms/FaqSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import AsisaTrustSection from '@/components/organisms/AsisaTrustSection';
import TestimonialGrid from '@/components/organisms/TestimonialGrid';
import InsuranceProductCard from '@/components/molecules/InsuranceProductCard';
import ProductProcessSection from '@/components/organisms/ProductProcessSection';
import { Button } from '@/components/atoms/Button';
import { WhatsAppIcon } from '@/components/atoms/WhatsAppIcon';
import { useWizard } from '@/context/WizardContext';
import { getAsisaFeaturedProducts, getAsisaConsultProducts } from '@/domain/products/asisaCatalog';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';

export const AsisaInsurances: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setProfile, resetWizard } = useWizard();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';

  const handleStartQuoting = (flow?: string) => {
    resetWizard();
    if (flow === 'students') {
      setProfile('student');
    } else {
      setProfile('individual');
    }
    navigate('/wizard');
  };

  const featuredProducts = getAsisaFeaturedProducts(lang);
  const consultProducts = getAsisaConsultProducts(lang);

  const faqs = isEnglish ? [
    {
      q: 'Why contract ASISA insurance through VitaBlue?',
      a: 'You get the exact official ASISA price including all active promotional discounts from the insurer, with zero broker markups or commissions. In addition, VitaBlue provides you with a licensed personal advisor who expedites your 24h consular certificate with CSV code, coordinates medical pre-authorizations, and provides continuous post-sale support in English.'
    },
    {
      q: 'What is the difference between ASISA Completa +, Completa ++, and No Copay?',
      a: 'ASISA Completa is the comprehensive medical and surgical hospital policy. In Completa + you enjoy a lower monthly fee with small copays per visit. Completa ++ offers the most economical premium in exchange for medium copays per procedure. For student or residency visa applications at Spanish consulates and Immigration, the No Copay (Sin Copagos) modality is strictly mandatory.'
    },
    {
      q: 'What is HLA Hospital Group and what advantages does it offer?',
      a: 'HLA Hospital Group is ASISA\'s proprietary network of clinics and hospitals—one of Spain\'s largest healthcare groups with 18 full-service hospitals and 36 multi-specialty centers. As an ASISA insured member, you enjoy direct and priority access to these top-tier hospitals without bureaucratic authorization hurdles.'
    }
  ] : [
    {
      q: '¿Por qué contratar los seguros de Asisa a través de VitaBlue?',
      a: 'Contratas exactamente al precio oficial de Asisa con todas las promociones vigentes de la aseguradora, sin comisiones ni sobrecostes. Además, en VitaBlue cuentas con un asesor personal colegiado que te asiste en la emisión rápida de certificados para visados en 24h, gestión de autorizaciones médicas y resolución de trámites.'
    },
    {
      q: '¿Qué diferencia hay entre ASISA Completa +, Completa ++ y la modalidad sin copago?',
      a: 'ASISA Completa es la póliza de cobertura médica y quirúrgica total. En su versión Completa + disfrutas de una prima mensual reducida con copagos muy bajos por consulta médica. En Completa ++ la cuota mensual es aún más económica a cambio de copagos intermedios. Para trámites de visado o residencia en Extranjería, se exige contratar la modalidad Sin Copagos.'
    },
    {
      q: '¿Qué es el Grupo HLA y qué ventajas ofrece a los asegurados de Asisa?',
      a: 'El Grupo Hospitalario HLA es la red de clínicas y hospitales propios de Asisa, una de las mayores redes hospitalarias de España con 18 hospitales y 36 centros multiespecialidad. Como asegurado de Asisa accedes de forma preferente y directa a estos centros sin trámites adicionales.'
    }
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Camila R.',
      meta: 'ASISA Health Students Insured (Madrid)',
      comment: 'I needed health insurance for my Spanish student visa in record time. With VitaBlue I enrolled in ASISA Health Students for €35/mo and the very next morning I had my official bilingual certificate with digital verification code (CSV). The consulate approved my visa without any queries.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Javier M.',
      meta: 'ASISA Completa + Insured (Seville)',
      comment: 'We were looking for comprehensive family healthcare with direct access to HLA Santa Isabel Hospital. The VitaBlue advisor explained the minimal copays with total transparency and setup was 100% smooth.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Alejandro G.',
      meta: 'Non-Lucrative Visa Resident (Malaga)',
      comment: 'I chose ASISA Health Residents for my Non-Lucrative Visa application after comparing quotes with Sanitas. I saved over €200 per year and VitaBlue\'s support in issuing the prepaid annual policy required by the consulate was phenomenal.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ] : [
    {
      author: 'Camila R.',
      meta: 'Asegurada ASISA Health Students (Madrid)',
      comment: 'Necesitaba el seguro para el visado de estudiante en tiempo récord. Con VitaBlue contraté Asisa Health Students por 35€/mes y al día siguiente tenía el certificado oficial bilingüe con CSV. El consulado lo admitió sin requerimientos.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Javier M.',
      meta: 'Asegurado ASISA Completa + (Sevilla)',
      comment: 'Buscábamos cobertura integral para la familia con acceso al hospital HLA Santa Isabel. La asesora de VitaBlue nos explicó con total claridad los copagos mínimos y la gestión del alta fue impecable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Alejandro G.',
      meta: 'Residencia No Lucrativa (Málaga)',
      comment: 'Elegí ASISA Health Residents para mi visado no lucrativo tras comparar con Sanitas. Me ahorré más de 200€ al año y el trato de VitaBlue para emitir la póliza anual prepagada fue extraordinario.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const canonicalUrl = isEnglish
    ? 'https://www.vitablue.es/en/health-insurance/asisa-insurance/'
    : 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/';

  const pageTitle = isEnglish
    ? 'Official ASISA Health Insurance Range | VitaBlue Catalog'
    : 'Gama Oficial de Seguros de Salud Asisa | Catálogo VitaBlue';

  const pageDescription = isEnglish
    ? 'Explore and compare the official range of ASISA health insurance plans: Health Students, Residents, Completa +, Esencial, and Mutualists. Official prices with zero commissions.'
    : 'Explora y compara la gama oficial de seguros de salud de Asisa: ASISA Health Students, Residents, Completa +, Esencial y Mutualistas. Precio oficial sin comisiones.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: isEnglish
          ? 'Compare and contract top health insurance plans in Spain. 100% free and independent advice for students, expats, digital nomads, and families.'
          : 'Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+34 694 58 34 52',
          areaServed: 'ES',
          availableLanguage: ['es', 'en']
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
            item: canonicalUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  const trustStatsEn = [
    { value: '40,000+', label: 'Doctors & specialists' },
    { value: '18', label: 'Proprietary HLA hospitals' },
    { value: '36', label: 'Multi-specialty clinics' },
    { value: '45+', label: 'Years of medical expertise' },
  ];

  const trustHighlightsEn = [
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
  ];

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Multilingual Alternate Links */}
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/health-insurance/asisa-insurance/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar
        items={isEnglish ? [
          { label: 'Health Insurance', href: '/en/health-insurance-student-visa-spain' },
          { label: 'ASISA Insurance', href: '/en/health-insurance/asisa-insurance' }
        ] : [
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' }
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-center">

            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                  <Sparkles className="w-4 h-4" /> {isEnglish ? 'ASISA Insurance Experts' : 'Especialistas en Asisa'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  {isEnglish ? 'Official Prices & Discounts' : 'Precios oficiales y promociones'}
                </span>
              </div>

              <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
                {isEnglish ? 'Full Range of ASISA Insurance' : 'Toda la gama de Seguros Asisa'}
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                {isEnglish
                  ? 'Compare and filter the official catalog of ASISA healthcare policies: student visa, residency, digital nomads, and family coverage with HLA proprietary hospital network.'
                  : 'Compara y filtra el catálogo oficial de pólizas de salud de Asisa: seguros para visados de estudiantes, residencia, nómadas y asistencia familiar con red hospitalaria propia Grupo HLA.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={() => handleStartQuoting()} rightIcon={<ArrowRight size={18} />}>
                  {isEnglish ? 'Calculate my quote online' : 'Calcular mi tarifa online'}
                </Button>
                <a
                  href={isEnglish
                    ? 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20expert%20advice%20on%20ASISA%20insurance%20policies.'
                    : 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20los%20seguros%20de%20Asisa.'}
                  className="inline-flex items-center justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="primary"
                    className="bg-whatsapp-dark text-white hover:bg-whatsapp"
                    leftIcon={<WhatsAppIcon size={20} className="shrink-0" />}
                  >
                    {isEnglish ? 'Inquire via WhatsApp' : 'Preguntar por WhatsApp'}
                  </Button>
                </a>
              </div>
            </div>

            {/* Micro Stats Widget */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col gap-6 text-left">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-white/5 opacity-50" />
                <h3 className="text-lg font-display font-black text-brand-cyan z-10 border-b border-white/10 pb-3">
                  {isEnglish ? 'Why contract ASISA with us?' : '¿Por qué contratar Asisa con nosotros?'}
                </h3>
                <div className="grid grid-cols-2 gap-4 z-10">
                  <div>
                    <span className="block text-2xl font-black text-white">0€</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      {isEnglish ? 'Markups or fees' : 'Recargos o comisiones'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">9</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      {isEnglish ? 'Official policies' : 'Pólizas oficiales'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">40k+</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      {isEnglish ? 'HLA medical staff' : 'Profesionales HLA'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">24h</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      {isEnglish ? 'Consular certificate' : 'Certificado consular'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <ProductTrustBar
        items={isEnglish ? [
          { icon: <ShieldCheck />, title: 'Official ASISA Advisory', description: 'Guaranteed official insurer prices with zero extra fees.' },
          { icon: <Clock />, title: '24h Consular Certificate', description: 'Fast delivery of verified PDF certificates with CSV codes.' },
          { icon: <Award />, title: 'Proprietary HLA Network', description: '18 hospitals and 36 multi-specialty centers across Spain.' }
        ] : [
          { icon: <ShieldCheck />, title: 'Asesoría Colegiada Asisa', description: 'Precios oficiales garantizados sin recargo comercial.' },
          { icon: <Clock />, title: 'Certificado Consular 24h', description: 'Emisión rápida de certificados con CSV para visados.' },
          { icon: <Award />, title: 'Red Propia Grupo HLA', description: '18 hospitales y 36 centros multiespecialidad propios.' }
        ]}
      />

      {/* Section 1: Featured Products */}
      <section className="py-16 sm:py-20 bg-white text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">

          <div className="space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">
              {isEnglish ? 'Core Range & Visas' : 'Gama Principal y Visados'}
            </span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              {isEnglish ? 'Featured ASISA Policies' : 'Pólizas Destacadas de Asisa'}
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              {isEnglish
                ? 'Official comprehensive coverage policies for student visas, residency, and full family healthcare with the HLA Group medical network.'
                : 'Pólizas oficiales de cobertura total para visados de extranjería, residencia y asistencia médica completa para familias con el cuadro médico del Grupo HLA.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <InsuranceProductCard
                key={product.id}
                title={product.title}
                tagline={product.tagline}
                description={product.desc}
                features={product.features}
                price={product.price}
                priceLabel={isEnglish ? 'Price' : 'Tarifa'}
                actionLabel={isEnglish ? 'View details & quote' : 'Ver detalles y cotizar'}
                badge={product.badge}
                link={product.link}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Section 2: Other Specific Insurances (WhatsApp Help) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-100 text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">

          <div className="space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">
              {isEnglish ? 'Outpatient Modalities & Groups' : 'Modalidades Ambulatorias y Colectivos'}
            </span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              {isEnglish ? 'Other Coverage & Special ASISA Plans' : 'Otras Coberturas y Planes Especiales Asisa'}
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              {isEnglish
                ? 'Outpatient options for direct specialist consultations without hospital stays and tailored plans for public mutualists (MUFACE, ISFAS, MUGEJU).'
                : 'Opciones extrahospitalarias para visitas rápidas a especialistas sin hospitalización y coberturas específicas para funcionarios mutualistas (MUFACE, ISFAS, MUGEJU).'}
            </p>
          </div>

          {/* WhatsApp Notice Box */}
          <div className="bg-white rounded-3xl border border-primary/15 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-grow">
              <h4 className="text-sm font-black text-text-main">
                {isEnglish
                  ? 'How to contract these ASISA policies with your VitaBlue advisor?'
                  : '¿Cómo tramitar estas pólizas de Asisa con tu asesor VitaBlue?'}
              </h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                {isEnglish
                  ? 'When clicking Inquire via WhatsApp, a certified VitaBlue advisor will review your case, give you the exact ASISA quote, and handle your enrollment 100% free of charge.'
                  : 'Al pulsar en Consultar por WhatsApp, un asesor especialista de VitaBlue revisará tu caso, te facilitará la prima exacta de Asisa y gestionará la tramitación de tu póliza de forma 100% gratuita y sin letra pequeña.'}
              </p>
            </div>
            <a
              href={isEnglish
                ? 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20guidance%20on%20special%20ASISA%20insurance%20plans.'
                : 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20para%20los%20seguros%20especiales%20de%20Asisa.'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto shrink-0"
            >
              <Button variant="accent" className="w-full md:w-auto font-bold shadow-md shadow-accent/10 whitespace-nowrap">
                {isEnglish ? 'Talk to an advisor now' : 'Hablar con un asesor ahora'}
              </Button>
            </a>
          </div>

          {/* Bento Grid (WhatsApp CTAs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultProducts.map((product) => (
              <InsuranceProductCard
                key={product.id}
                title={product.title}
                tagline={product.tagline}
                description={product.desc}
                features={product.features}
                price={product.price}
                priceLabel={isEnglish ? 'Rate' : 'Tarifa'}
                actionLabel={isEnglish ? 'Inquire via WhatsApp' : 'Consultar por WhatsApp'}
                badge={product.badge}
                link={product.link}
                external
              />
            ))}
          </div>

        </div>
      </section>

      {/* Onboarding Timeline Section */}
      <ProductProcessSection
        className="border-t-0 bg-white"
        eyebrow={isEnglish ? 'Fast & Official Enrollment' : 'Alta oficial y rápida'}
        title={isEnglish ? 'How to Contract ASISA Insurance' : 'Proceso de contratación en Asisa'}
        description={isEnglish
          ? 'We issue your policy directly with ASISA quickly, securely, and 100% digitally.'
          : 'Emitimos tu póliza directamente en Asisa de forma rápida, segura y 100% digital.'}
        steps={isEnglish ? [
          {
            title: 'Select your ASISA policy',
            description: 'Compare and select among visa options (Health Students / Residents), comprehensive, or outpatient.'
          },
          {
            title: 'Policyholder details',
            description: 'Enter your basic contact details and select your payment frequency (monthly or upfront annual as required for your visa).'
          },
          {
            title: 'Health questionnaire',
            description: 'Complete the short online medical questionnaire securely through the company\'s official confidential link.'
          },
          {
            title: 'Issuance & 24h certificate',
            description: 'Receive your official policy by SMS/email with digital signature and your stamped Consular Certificate for your visa or NIE.'
          }
        ] : [
          {
            title: 'Selecciona tu póliza Asisa',
            description: 'Compara y elige entre las modalidades de visado (Health Students/Residents), completa o extrahospitalaria.'
          },
          {
            title: 'Datos del asegurado',
            description: 'Introduce tus datos personales y escoge la modalidad de pago (mensual o anual según los requisitos de tu trámite).'
          },
          {
            title: 'Cuestionario médico',
            description: 'Cumplimenta el cuestionario de salud digital desde un enlace confidencial y seguro de la compañía.'
          },
          {
            title: 'Emisión y certificado 24h',
            description: 'Recibe tu contrato oficial por SMS/email con firma digital y tu Certificado Oficial de Cobertura para el consulado o Extranjería.'
          }
        ]}
      />

      <AsisaTrustSection
        eyebrow={isEnglish ? 'ASISA & HLA Group Guarantee' : undefined}
        title={isEnglish ? 'Leader in Private Healthcare with Own Hospital Network' : undefined}
        description={isEnglish ? 'ASISA is one of Spain\'s most established health insurers, backed by the Lavinia medical cooperative and HLA Group proprietary hospitals.' : undefined}
        stats={isEnglish ? trustStatsEn : undefined}
        highlights={isEnglish ? trustHighlightsEn : undefined}
      />

      <TestimonialGrid
        eyebrow={isEnglish ? 'Real Reviews' : 'Opiniones reales'}
        title={isEnglish ? 'Experiences of Those Who Trust ASISA with VitaBlue' : 'La experiencia de quienes confían en Asisa con VitaBlue'}
        items={testimonials}
      />

      {/* Accordion FAQs Section */}
      <FaqSection
        eyebrow={isEnglish ? 'Frequently Asked Questions' : 'Dudas Frecuentes'}
        title={isEnglish ? 'FAQs about ASISA Health Insurance' : 'Preguntas Frecuentes sobre Seguros Asisa'}
        items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

      <AdvisorHelpSection
        title={isEnglish ? 'Need help deciding on the right ASISA insurance?' : '¿Tienes dudas sobre qué seguro de Asisa elegir?'}
        description={isEnglish
          ? 'We advise you at zero cost to find the ideal ASISA plan or compare impartially with Sanitas and Adeslas.'
          : 'Te asesoramos sin coste para encontrar la mejor póliza de Asisa o comparar de forma imparcial con Sanitas y Adeslas.'}
        whatsappUrl={isEnglish
          ? 'https://wa.me/34694583452?text=Hi!%20I%27m%20visiting%20VitaBlue.%20I%27d%20like%20information%20about%20ASISA%20insurance.'
          : 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20los%20seguros%20de%20Asisa.'}
        advisorRole={isEnglish ? 'Senior Health Insurance Advisor in Spain' : undefined}
        advisorBadge={isEnglish ? 'Assigned Advisor' : undefined}
        advisorQuote={isEnglish ? '"Hi, I\'m Lucía. I\'m here to answer your questions about visas, copays, and waiting times. I will guide you neutrally with zero obligations."' : undefined}
        advisorSchedule={isEnglish ? 'Monday to Friday: 9:00 - 19:00 (CET)' : undefined}
        advisorResponseTime={isEnglish ? 'Reply in < 15 mins' : undefined}
        advisorCallText={isEnglish ? 'Call Free' : undefined}
        advisorWhatsAppText={isEnglish ? 'Ask via WhatsApp' : undefined}
      />
    </div>
  );
};

export default AsisaInsurances;

