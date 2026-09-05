import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  
  ArrowRight,
  Star,
  Search,
} from 'lucide-react';
import { useWizard } from '@/context/WizardContext';
import ConversationalHero from '@/components/organisms/ConversationalHero';
import InfiniteMarquee from '@/components/molecules/InfiniteMarquee';
import FaqSection from '@/components/organisms/FaqSection';
import Card from '@/components/molecules/Card';
import ProductCategoryCard, { type ProductCategoryBadgeColor } from '@/components/molecules/ProductCategoryCard';
import TrustCardGrid from '@/components/molecules/TrustCardGrid';
import TestimonialGrid from '@/components/organisms/TestimonialGrid';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import { VITA_BLUE_ORGANIZATION_SCHEMA } from '@/utils/organizationSchema';

import { 
  CoverageIllustration, 
  PiggyBankIllustration, 
  SupportIllustration,
  ProfileIllustration,
  PolicyIllustration,
  AccompanimentIllustration,
  HealthIllustration,
  TravelIllustration,
  FamilyIllustration,
  LifeIllustration,
  PetIllustration
} from '@/components/illustrations';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  
  const { setProfile, setAgeRange, setVisaRequired, resetWizard } = useWizard();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetUrl = isEnglish 
      ? `/en/blog?search=${encodeURIComponent(searchQuery.trim())}`
      : `/blog?search=${encodeURIComponent(searchQuery.trim())}`;
    navigate(targetUrl);
  };

  const handleQuickSearch = (term: string) => {
    const targetUrl = isEnglish 
      ? `/en/blog?search=${encodeURIComponent(term)}`
      : `/blog?search=${encodeURIComponent(term)}`;
    navigate(targetUrl);
  };

  const guides = isEnglish ? [
    {
      title: 'Copays and Waiting Periods Guide: Deciphering the Fine Print',
      desc: 'Understanding the difference between copay (fee per visit) and waiting period (waiting time for certain tests) is key to avoiding surprises with your private health insurance in Spain.',
      readTime: '5 min',
      tag: 'Health',
      bgClass: 'from-primary/5 hover:to-primary/10 border-primary/15',
      url: '/en/blog',
      content: ''
    },
    {
      title: 'Health Insurance Requirements for Spain Visa',
      desc: 'Discover the exact requirements demanded by Spanish consulates: zero copays, zero waiting periods, and repatriation of remains included.',
      readTime: '3 min',
      tag: 'Visas',
      bgClass: 'from-brand-cyan/5 hover:to-brand-cyan/10 border-brand-cyan/20',
      url: '/en/blog/student-visa-spain-health-insurance-requirements',
      content: ''
    },
    {
      title: 'New Pet Welfare Law in Spain',
      desc: 'All the information regarding the mandatory civil liability insurance for dogs and veterinary care.',
      readTime: '4 min',
      tag: 'Pets',
      bgClass: 'from-accent/5 hover:to-accent/10 border-accent/20',
      url: '/productos/seguro-mascotas/sanitas-mascotas',
      content: ''
    }
  ] : [
    {
      title: 'Guía de Copagos y Carencias: Cómo descifrar la letra pequeña',
      desc: 'Entender la diferencia entre copago (pago por consulta) y carencia (tiempo de espera para ciertas pruebas) es clave para no llevarte sorpresas en tu seguro de salud privado.',
      readTime: '5 min',
      tag: 'Salud',
      bgClass: 'from-primary/5 hover:to-primary/10 border-primary/15',
      url: '/blog/que-es-el-copago-seguro-salud',
      content: `Al contratar un seguro de salud privado, es fundamental entender dos términos que afectarán directamente a tu bolsillo y al uso del seguro: los copagos y los periodos de carencia.

#### 1. ¿Qué es el Copago?
El copago es una pequeña cantidad de dinero que el asegurado debe abonar cada vez que visita a un médico o utiliza un servicio médico (pruebas, análisis, urgencias). 
*   **Seguro Sin Copago**: Pagas una prima mensual más alta, pero todas las consultas y pruebas son 100% gratuitas. Es la modalidad recomendada si vas al médico con frecuencia o necesitas cumplir con los requisitos del **visado de estudios español**.
*   **Seguro Con Copago**: La prima mensual es más baja, pero pagas un extra por cada consulta. Adecuado si vas poco al médico.

#### 2. ¿Qué es la Carencia?
La carencia es el periodo de tiempo que transcurre desde que das de alta el seguro hasta que puedes empezar a utilizar ciertos servicios complejos (operaciones, partos, resonancias magnéticas).
*   **¿Por qué existe?** Para evitar que una persona contrate un seguro únicamente para operarse al día siguiente y luego se dé de baja.
*   **Carencias habituales**: Suelen ir desde los 3 meses (pruebas diagnósticas complejas) hasta los 8-10 meses (partos y cirugías).
*   **Importante**: Las consultas básicas de medicina general, especialistas y urgencias vitales **nunca tienen carencia**.`
    },
    {
      title: 'Seguro de salud para Visado en España',
      desc: 'Descubre los requisitos exactos que exige el consulado: sin copagos, sin carencias y con repatriación de restos incluida.',
      readTime: '3 min',
      tag: 'Trámites',
      bgClass: 'from-brand-cyan/5 hover:to-brand-cyan/10 border-brand-cyan/20',
      url: '/blog/requisitos-seguro-medico-visado-estudiante-espana',
      content: `Si vas a solicitar un visado de estudios, residencia no lucrativa o nómada digital para vivir en España, la Oficina de Extranjería y el Consulado te exigirán un seguro médico con unas condiciones muy estrictas.

#### Requisitos Obligatorios del Seguro Consular:
1.  **Sin Copagos**: El seguro no puede requerir que pagues ningún extra por ir a consulta. Debe ser de cobertura total e ilimitada.
2.  **Sin Carencias**: Debes tener acceso a todos los servicios desde el primer día de vigencia del seguro, sin tiempos de espera.
3.  **Cobertura Completa**: Debe equivaler en prestaciones al Sistema Nacional de Salud español (incluyendo hospitalización y cirugías).
4.  **Repatriación de Restos**: Debe incluir obligatoriamente la cobertura de repatriación en caso de fallecimiento.
5.  **Duración**: Debe cubrir toda tu estancia en España (normalmente 1 año).`
    },
    {
      title: 'Nueva Ley de Mascotas en España',
      desc: 'Toda la información sobre el seguro obligatorio de responsabilidad civil para perros y los cuidados veterinarios.',
      readTime: '4 min',
      tag: 'Mascotas',
      bgClass: 'from-accent/5 hover:to-accent/10 border-accent/20',
      url: '/productos/seguro-mascotas/sanitas-mascotas',
      content: `La nueva legislación de Bienestar Animal en España introduce cambios importantes para los propietarios de perros y gatos, enfocándose en su protección y la tenencia responsable.

#### Seguro Obligatorio de Responsabilidad Civil:
*   **Para todos los perros**: Independientemente de su raza o tamaño, es obligatorio contratar un seguro de responsabilidad civil por daños a terceros.
*   **¿Qué cubre?** Los daños materiales o personales que tu mascota pueda ocasionar a otras personas u otros animales.
*   **Seguros de Asistencia Veterinaria**: Aunque la ley solo obliga a la responsabilidad civil, es muy recomendable contar con un seguro médico para tu mascota que cubra vacunas, urgencias y cirugías veterinarias, protegiendo tu economía familiar frente a imprevistos médicos de tu mascota.`
    }
  ];

  const handleHeroSearch = (data: { age: number; needType: string }) => {
    resetWizard();

    const mappedProfile: 'student' | 'expat' | 'nomad' =
      data.needType === 'viaje'
        ? 'nomad'
        : data.needType === 'estudios'
          ? 'student'
          : 'expat';

    let mappedAge: '18_24' | '25_30' | '31_40' | 'plus_40' = '25_30';
    if (data.age >= 18 && data.age <= 24) mappedAge = '18_24';
    else if (data.age >= 25 && data.age <= 30) mappedAge = '25_30';
    else if (data.age >= 31 && data.age <= 40) mappedAge = '31_40';
    else if (data.age > 40) mappedAge = 'plus_40';

    setProfile(mappedProfile);
    setAgeRange(mappedAge);
    setVisaRequired(data.needType === 'estudios' || data.needType === 'residencia' ? 'yes' : data.needType === 'viaje' ? 'unknown' : 'unknown');
    navigate('/wizard');
  };

  const scrollToHowItWorks = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const productCards = isEnglish ? [
    {
      title: 'Health Insurance',
      desc: 'Broad medical coverage for those seeking quality private care, diagnostic tests, and specialists with no waiting.',
      illustration: HealthIllustration,
      href: '/productos/seguros-salud',
      badge: 'Health',
      badgeColor: 'accent',
    },
    {
      title: 'Travel Insurance',
      desc: 'Assistance abroad, international medical coverage, luggage, and repatriation for your getaways or short stays.',
      illustration: TravelIllustration,
      href: '/productos/seguro-viaje',
      badge: 'Travel',
      badgeColor: 'secondary',
    },
    {
      title: 'Family & Life Assistance',
      desc: 'Comprehensive support and management for funeral expenses, transfers, and legal procedures for the family in difficult times.',
      illustration: FamilyIllustration,
      href: '/productos/seguro-para-decesos/asistencia-familiar',
      badge: 'Family',
      badgeColor: 'dark',
    },
    {
      title: 'Life Insurance',
      desc: 'Financial protection for the future of your loved ones, ensuring their stability and covering loans or mortgages.',
      illustration: LifeIllustration,
      href: '/wizard',
      badge: 'Life',
      badgeColor: 'primary',
    },
    {
      title: 'Pet Insurance',
      desc: 'Full veterinary assistance insurance for dogs and cats, covering emergencies, consultations, and vaccines.',
      illustration: PetIllustration,
      href: '/productos/seguro-mascotas/sanitas-mascotas',
      badge: 'Pets',
      badgeColor: 'secondary',
    },
  ] : [
    {
      title: 'Seguros de salud',
      desc: 'Cobertura médica amplia para quien busca atención privada de calidad, pruebas diagnósticas y especialistas sin esperas.',
      illustration: HealthIllustration,
      href: '/productos/seguros-salud',
      badge: 'Salud',
      badgeColor: 'accent',
    },
    {
      title: 'Seguros de viaje',
      desc: 'Asistencia en el extranjero, cobertura médica internacional, equipajes y repatriación para tus escapadas o estancias cortas.',
      illustration: TravelIllustration,
      href: '/productos/seguro-viaje',
      badge: 'Viaje',
      badgeColor: 'secondary',
    },
    {
      title: 'Seguro para decesos',
      desc: 'Apoyo y gestión integral para los gastos funerarios, traslados y trámites jurídicos de la familia en momentos difíciles.',
      illustration: FamilyIllustration,
      href: '/productos/seguro-para-decesos/asistencia-familiar',
      badge: 'Familia',
      badgeColor: 'dark',
    },
    {
      title: 'Seguros de vida',
      desc: 'Protección económica para el futuro de tus seres queridos, asegurando su estabilidad y cubriendo préstamos o hipotecas.',
      illustration: LifeIllustration,
      href: '/wizard',
      badge: 'Vida',
      badgeColor: 'primary',
    },
    {
      title: 'Seguros de mascotas',
      desc: 'Seguro de asistencia veterinaria completa para perros y gatos, cubriendo urgencias, consultas y vacunas.',
      illustration: PetIllustration,
      href: '/productos/seguro-mascotas/sanitas-mascotas',
      badge: 'Mascotas',
      badgeColor: 'secondary',
    },
  ];

  const trustCards = isEnglish ? [
    {
      illustration: CoverageIllustration,
      title: 'We help you choose',
      desc: 'We compare options from several companies so you can see which one fits you best.',
    },
    {
      illustration: PiggyBankIllustration,
      title: 'No extra cost',
      desc: 'Our service does not add fees to the price. If you contract, the fee comes from the insurer.',
    },
    {
      illustration: SupportIllustration,
      title: 'Human support',
      desc: 'If you get stuck, a real advisor helps you on WhatsApp and guides you through the process.',
    },
  ] : [
    {
      illustration: CoverageIllustration,
      title: 'Te ayudamos a elegir',
      desc: 'Comparamos opciones de varias compañías para que veas cuál encaja mejor contigo.',
    },
    {
      illustration: PiggyBankIllustration,
      title: 'Sin coste',
      desc: 'El servicio no añade recargos al precio. Si contratas, la retribución viene de la aseguradora.',
    },
    {
      illustration: SupportIllustration,
      title: 'Soporte humano',
      desc: 'Si te atascas, un asesor real te ayuda por WhatsApp y te acompaña en el trámite.',
    },
  ];

  const faqs = isEnglish ? [
    {
      q: 'What is VitaBlue and how does the comparator work?',
      a: 'VitaBlue is an insurance comparator and a regulated, independent broker. We analyze the best health, travel, pet, and life insurance offers from different companies in Spain to show you the ideal options for your profile in under 30 seconds.',
    },
    {
      q: 'Why is your service free and without extra charges?',
      a: 'Just like other large comparators, our service is 100% free for you. We do not add any surcharge to the price of the insurances; the commission we receive comes directly from the insurer upon facilitating the sale of their policies, guaranteeing you the same official price or even exclusive offers.',
    },
    {
      q: 'Why is registration not required to see prices?',
      a: 'We believe in radical transparency and avoiding phone spam. We want you to compare options with total freedom. Therefore, you can simulate and see the rates directly; we will only ask for your contact details when you decide to proceed with an official contract or if you explicitly request to speak with an advisor.',
    },
    {
      q: 'How do I contract a policy?',
      a: 'You can do it in two ways: by completing the digital application through our step-by-step interactive wizard, or by clicking the WhatsApp button so that one of our advisors fills in the details for you and sends you the official documentation ready for electronic signature.',
    },
    {
      q: 'What support do I have if I have questions about copays or waiting periods?',
      a: 'We do not leave you alone with the fine print. We have a team of dedicated health advisors on WhatsApp to guide you at all times: we explain copays, waiting periods, and complex coverage before you contract, and we remain available to help you throughout the life of your policy.',
    },
  ] : [
    {
      q: '¿Qué es VitaBlue y cómo funciona el comparador?',
      a: 'VitaBlue es un comparador de seguros y una correduría regulada e independiente. Analizamos las mejores ofertas de salud, viaje, decesos, vida y mascotas de distintas compañías en España para mostrarte las opciones idóneas para tu perfil en menos de 30 segundos.',
    },
    {
      q: '¿Por qué vuestro servicio es gratis y no tiene recargos?',
      a: 'Al igual que los grandes comparadores, nuestro servicio es 100% gratuito para ti. No añadimos ningún recargo al precio de los seguros; la remuneración que recibimos viene directamente de la aseguradora al facilitarles la comercialización de sus pólizas, garantizándote el mismo precio oficial o incluso ofertas exclusivas.',
    },
    {
      q: '¿Por qué no es necesario registrarse para ver precios?',
      a: 'Creemos en la transparencia radical y en evitar el spam telefónico. Queremos que compares opciones con total libertad. Por eso, puedes simular y ver las tarifas directamente; solo te pediremos tus datos de contacto cuando decidas avanzar con una contratación oficial o si solicitas expresamente hablar con un asesor.',
    },
    {
      q: '¿Cómo se realiza la contratación de una póliza?',
      a: 'Puedes hacerlo de dos formas: completando la solicitud digital a través de nuestro wizard de contratación interactivo paso a paso, o bien haciendo clic en el botón de WhatsApp para que uno de nuestros asesores rellene los datos por ti y te envíe la documentación oficial lista para firma electrónica.',
    },
    {
      q: '¿Qué soporte tengo si tengo dudas con copagos o exclusiones?',
      a: 'No te dejamos solo con la letra pequeña. Contamos con un equipo de asesores de salud dedicados en WhatsApp para guiarte en todo momento: te explicamos copagos, carencias y coberturas complejas antes de contratar, y seguimos disponibles para ayudarte durante toda la vida útil de tu póliza.',
    },
  ];

  const testimonials = isEnglish ? [
    {
      author: 'Mariana Silva',
      meta: 'Student insurance in Madrid',
      comment: 'I needed an insurance with no copays and no waiting periods for the student visa and was completely lost. They assisted me immediately on WhatsApp, recommended the ideal option, and sent me the consular certificate right away. Visa approved!',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    },
    {
      author: 'Carlos Mendoza',
      meta: 'Health insurance in Barcelona',
      comment: 'I was looking for regular private health insurance. I tried on other comparators and they bombarded me with telemarketing phone calls. On VitaBlue I could see the real prices without registering and contracted at my own pace. Excellent.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    },
    {
      author: 'Lucía and Mateo',
      meta: 'Pet and family insurance',
      comment: 'We compared Sanitas Pets and family assistance policies. The explanations of the fine print that the advisor gave us on WhatsApp were super clear and transparent. You can tell they are in no rush to sell and look out for you.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    },
  ] : [
    {
      author: 'Mariana Silva',
      meta: 'Seguro de estudios en Madrid',
      comment: 'Necesitaba un seguro sin copagos ni carencias para el visado de estudios y estaba perdidísima. Me atendieron al momento por WhatsApp, me recomendaron la opción ideal y me enviaron el certificado consular de inmediato. ¡Visado aprobado!',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    },
    {
      author: 'Carlos Mendoza',
      meta: 'Seguro médico en Barcelona',
      comment: 'Buscaba un seguro de salud privado normal. Probé en otros comparadores y me acribillaron a llamadas telefónicas de telemarketing. En VitaBlue pude ver los precios reales sin registrarme y contraté directamente a mi ritmo. Excelente.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    },
    {
      author: 'Lucía y Mateo',
      meta: 'Seguro de mascotas y familia',
      comment: 'Comparamos la póliza de Sanitas Mascotas y la de decesos. Las explicaciones de la letra pequeña que nos dio la asesora por WhatsApp fueron súper claras y transparentes. Se nota que no tienen prisa por venderte y miran por ti.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    },
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      VITA_BLUE_ORGANIZATION_SCHEMA,
      {
        "@type": "FAQPage",
        "@id": "https://www.vitablue.es/#faq",
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
    <div className="w-full flex flex-col bg-background-light">
      <Helmet>
        <title>{isEnglish ? 'Compare health, travel, and study insurance in Spain | VitaBlue' : 'Comparador de seguros de salud, viaje y estudios en España | VitaBlue'}</title>
        <meta
          name="description"
          content={isEnglish ? 'Find the insurance that fits you best to live, study, or travel in Spain. Compare health, travel, pet, and family policies according to your needs.' : 'Encuentra el seguro que mejor encaja contigo para vivir, estudiar o viajar en España. Compara salud, viaje, mascotas y familia según tus necesidades.'}
        />
        <link rel="canonical" href={isEnglish ? 'https://www.vitablue.es/en/' : 'https://www.vitablue.es/'} />
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={isEnglish ? 'Compare health, travel, and study insurance in Spain | VitaBlue' : 'Comparador de seguros de salud, viaje y estudios en España | VitaBlue'} />
        <meta property="og:description" content={isEnglish ? 'Find the insurance that fits you best to live, study, or travel in Spain. Compare health, travel, pet, and family policies according to your needs.' : 'Encuentra el seguro que mejor encaja contigo para vivir, estudiar o viajar en España. Compara salud, viaje, mascotas y familia según tus necesidades.'} />
        <meta property="og:image" content="https://www.vitablue.es/og-image.jpg" />
        <meta property="og:url" content={isEnglish ? 'https://www.vitablue.es/en/' : 'https://www.vitablue.es/'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={isEnglish ? 'Compare health, travel, and study insurance in Spain | VitaBlue' : 'Comparador de seguros de salud, viaje y estudios en España | VitaBlue'} />
        <meta name="twitter:description" content={isEnglish ? 'Find the insurance that fits you best to live, study, or travel in Spain. Compare health, travel, pet, and family policies according to your needs.' : 'Encuentra el seguro que mejor encaja contigo para vivir, estudiar o viajar en España. Compara salud, viaje, mascotas y familia según tus necesidades.'} />
        <meta name="twitter:image" content="https://www.vitablue.es/og-image.jpg" />

        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8 sm:pb-12 bg-gradient-to-b from-primary/5 via-background-light to-brand-cyan/10">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-primary/10 bg-primary/5 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>{isEnglish ? 'Find your insurance' : 'Encuentra tu seguro'}</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-h1 font-display font-black text-text-main">
                {isEnglish ? 'The insurance that fits you best, whether to live, study, or travel' : 'El seguro que mejor encaja contigo, ya sea para vivir, estudiar o viajar'}
              </h2>
              <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
                {isEnglish ? 'We help you compare health, travel, study, pet, and family options based on your age, visa, and type of stay in Spain.' : 'Te ayudamos a comparar opciones de salud, viaje, estudios, mascotas y familia según tu edad, visado y tipo de estancia en España.'}
              </p>
            </div>

            <ConversationalHero onSearch={handleHeroSearch} />

            <TrustCardGrid items={trustCards.map((item, index) => ({
              title: item.title,
              description: item.desc,
              illustration: item.illustration,
              tone: index === 0 ? 'neutral' : index === 1 ? 'cyan' : 'accent',
            }))} />

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-caption font-semibold text-text-secondary">
                <Star className="w-4 h-4 fill-accent text-accent" />
                {isEnglish ? 'We help you choose wisely' : 'Te ayudamos a elegir con criterio'}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100/50 px-3 py-1 text-caption font-bold text-sky-800">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                {isEnglish ? 'Independent Insurance Advice' : 'Asesoría de Seguros Independiente'}
              </div>
            </div>
          </div>

          <div className="hidden lg:grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-primary/10 bg-white/80 backdrop-blur px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary shadow-sm mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>{isEnglish ? 'Find your insurance' : 'Encuentra tu seguro'}</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-h1 font-display font-black text-text-main">
                  {isEnglish ? 'The insurance that fits you best, whether to live, study, or travel' : 'El seguro que mejor encaja contigo, ya sea para vivir, estudiar o viajar'}
                </h1>
                <p className="text-body-lg text-text-secondary leading-relaxed max-w-2xl">
                  {isEnglish ? 'We help you compare health, travel, study, pet, and family options based on your age, visa, and type of stay in Spain.' : 'Te ayudamos a comparar opciones de salud, viaje, estudios, mascotas y familia según tu edad, visado y tipo de estancia en España.'}
                </p>
              </div>

              <TrustCardGrid items={trustCards.map((item, index) => ({
                title: item.title,
                description: item.desc,
                illustration: item.illustration,
                tone: index === 0 ? 'neutral' : index === 1 ? 'cyan' : 'accent',
              }))} />

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={scrollToHowItWorks} className="inline-flex">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary text-primary px-6 py-3 text-sm font-bold hover:bg-primary/5 transition-all duration-200">
                    Ver cómo funciona
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-caption font-semibold text-text-secondary">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  Te ayudamos a elegir con criterio
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100/50 px-3 py-1 text-caption font-bold text-sky-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  Asesoría de Seguros Independiente
                </div>
              </div>
            </div>

            <ConversationalHero onSearch={handleHeroSearch} />
          </div>
        </div>
      </section>

      <div className="mt-8 bg-white border-y border-slate-100 py-2 shadow-[inset_0_1px_0_rgba(5,95,115,0.06)]">
        <InfiniteMarquee />
      </div>

      <section id="como-funciona" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <span className="text-caption font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'How we help you' : 'Cómo te ayudamos'}</span>
            <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'What we look at to recommend an option' : 'Qué miramos para recomendarte una opción'}</h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
              {isEnglish ? 'Before asking for details, we explain what each option covers, who it fits best, and what you should check before contracting.' : 'Antes de pedirte datos, te explicamos qué cubre cada opción, para quién puede encajar y qué deberías revisar antes de contratar.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isEnglish ? [
              { title: 'Your profile', text: 'We filter options based on your age, situation, and specific medical needs.', illustration: ProfileIllustration },
              { title: 'What it includes', text: 'Clear view of coverages, copays, and limits before proceeding.', illustration: PolicyIllustration },
              { title: 'Accompaniment', text: 'If you prefer, a real advisor will guide you on WhatsApp with no obligation.', illustration: AccompanimentIllustration },
            ] : [
              { title: 'Tu perfil', text: 'Filtramos opciones según tu edad, situación y necesidades médicas particulares.', illustration: ProfileIllustration },
              { title: 'Lo que incluye', text: 'Ves de forma clara coberturas, copagos y límites antes de seguir.', illustration: PolicyIllustration },
              { title: 'Acompañamiento', text: 'Si prefieres, un asesor te ayuda por WhatsApp sin compromiso.', illustration: AccompanimentIllustration },
            ]).map((item) => (
              <Card key={item.title} className={`p-6 sm:p-8 bg-white border ${item.title === 'Tu perfil' || item.title === 'Your profile' ? 'border-primary/15' : item.title === 'Lo que incluye' || item.title === 'What it includes' ? 'border-brand-cyan/20' : 'border-accent/20'}`}>
                <div className="h-16 w-auto aspect-[4/3] mb-4 flex items-center justify-start text-primary">
                  <item.illustration />
                </div>
                <h3 className="text-h3 font-display font-bold text-text-main">{item.title}</h3>
                <p className="mt-2 text-body-reg text-text-secondary leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="productos" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/60 to-brand-cyan/5 border-y border-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="text-left space-y-2 border-l-4 border-primary pl-4 sm:pl-6">
            <span className="text-caption font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Common options' : 'Opciones frecuentes'}</span>
            <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'Insurances based on your travel or residency' : 'Seguros según tu viaje, estancia o residencia'}</h2>
            <p className="text-body-reg text-text-secondary font-medium max-w-2xl">
              {isEnglish ? 'If you are coming to study, live, travel frequently, or care for your family or pets, here is a clear starting point.' : 'Si vienes a estudiar, vivir, viajar con frecuencia o cuidar de tu familia o mascotas, aquí tienes un punto de partida claro.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productCards.map((card) => (
              <ProductCategoryCard
                key={card.title}
                title={card.title}
                description={card.desc}
                badge={card.badge}
                badgeColor={card.badgeColor as ProductCategoryBadgeColor}
                href={card.href}
                illustration={card.illustration}
                detailsLabel={isEnglish ? 'View details' : 'Ver detalle'}
              />
            ))}
          </div>
        </div>
      </section>

      <div id="testimonios">
        <TestimonialGrid
          eyebrow={isEnglish ? 'Real reviews' : 'Opiniones reales'}
          title={isEnglish ? 'The experience of those who already trust us' : 'La experiencia de quienes ya confían en nosotros'}
          description={isEnglish ? 'Hundreds of people have already found their medical or travel insurance without phone spam and with the support of real human advisors.' : 'Cientos de personas ya han encontrado su seguro médico o de viaje sin sufrir spam telefónico y con el respaldo de asesores humanos reales.'}
          items={testimonials}
        />
      </div>

      {/* Blog/Guides Section - Bento Grid */}
      <section id="guias" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-caption font-black text-primary uppercase tracking-[0.25em]">{isEnglish ? 'Advice & Guides' : 'Asesoría y Guías'}</span>
            <h2 className="text-h2 font-display font-black text-text-main">{isEnglish ? 'We explain the fine print' : 'Te explicamos la letra pequeña'}</h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
              {isEnglish ? 'Practical articles written by our team to help you understand your coverages and make informed decisions.' : 'Artículos prácticos redactados por nuestro equipo para ayudarte a entender tus coberturas y tomar decisiones con criterio.'}
            </p>
            
            {/* Search Input for Guides */}
            <div className="pt-4 max-w-md mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  placeholder={isEnglish ? 'Search guides (e.g. visa, copay)...' : 'Buscar guías (ej: visado, copago)...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm font-semibold text-text-main placeholder-slate-400/80 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 h-8 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-colors cursor-pointer border-0"
                >
                  {isEnglish ? 'Search' : 'Buscar'}
                </button>
              </form>
              
              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-[10px] font-bold text-text-secondary">
                <span>{isEnglish ? 'Try:' : 'Sugerencias:'}</span>
                <button 
                  onClick={() => handleQuickSearch(isEnglish ? 'student' : 'visado')}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  {isEnglish ? 'Student visa' : 'Visado'}
                </button>
                <button 
                  onClick={() => handleQuickSearch(isEnglish ? 'copay' : 'copago')}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  {isEnglish ? 'Copays' : 'Copago'}
                </button>
                <button 
                  onClick={() => handleQuickSearch(isEnglish ? 'pre-existing' : 'carencia')}
                  className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  {isEnglish ? 'Waiting periods' : 'Carencia'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Large Featured Card */}
            <Link 
              to={guides[0].url}
              className="lg:col-span-2 group rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-primary/5 hover:to-primary/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                    {guides[0].tag}
                  </span>
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {guides[0].readTime} {isEnglish ? 'read' : 'de lectura'}
                  </span>
                </div>
                <h3 className="text-h3 font-display font-black text-text-main group-hover:text-primary transition-colors leading-tight">
                  {guides[0].title}
                </h3>
                <p className="text-body-reg text-text-secondary leading-relaxed max-w-2xl">
                  {guides[0].desc}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                {isEnglish ? 'Read article' : 'Leer artículo'} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 2: Regular Card */}
            <Link 
              to={guides[1].url}
              className="lg:col-span-1 group rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-brand-cyan/5 hover:to-brand-cyan/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-cyan/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                    {guides[1].tag}
                  </span>
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {guides[1].readTime} {isEnglish ? 'read' : 'de lectura'}
                  </span>
                </div>
                <h3 className="text-lg font-display font-black text-text-main group-hover:text-primary transition-colors leading-snug">
                  {guides[1].title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {guides[1].desc}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                {isEnglish ? 'Read article' : 'Leer artículo'} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 3: Regular Card */}
            <Link 
              to={guides[2].url}
              className="lg:col-span-1 group rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-accent/5 hover:to-accent/10 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer block"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-main">
                    {guides[2].tag}
                  </span>
                  <span className="text-[11px] font-semibold text-text-secondary">
                    {guides[2].readTime} {isEnglish ? 'read' : 'de lectura'}
                  </span>
                </div>
                <h3 className="text-lg font-display font-black text-text-main group-hover:text-primary transition-colors leading-snug">
                  {guides[2].title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {guides[2].desc}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                {isEnglish ? 'Read article' : 'Leer artículo'} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 4: CTA Card */}
            <a 
              href={isEnglish 
                ? 'https://wa.me/34694583452?text=Hello!%20I%20come%20from%20the%20VitaBlue%20website.%20I%20need%20some%20advice%20on%20health%20insurance.'
                : 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20seguros%20de%20salud%20para%20mi%20caso.'}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp"
              onClick={() => {
                if (window.dataLayer) {
                  window.dataLayer.push({ event: 'click_whatsapp', location: 'home_bottom_banner' });
                }
              }}
              className="lg:col-span-2 group rounded-3xl border border-primary/10 bg-gradient-to-br from-primary to-primary-dark p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-white"
            >
              <div className="space-y-2 max-w-lg">
                <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                  {isEnglish ? 'Immediate Support' : 'Soporte Inmediato'}
                </span>
                <h3 className="text-h3 font-display font-black leading-tight">
                  {isEnglish ? 'Have doubts about any terms or coverage?' : '¿Tienes dudas sobre algún término o cobertura?'}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  {isEnglish 
                    ? 'Write to us directly on WhatsApp. A real advisor will explain the fine print without rush or commitments.'
                    : 'Escríbenos directamente por WhatsApp. Una asesora real te explicará la letra pequeña sin prisa ni compromisos de contratación.'}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-whatsapp-dark hover:bg-whatsapp px-6 py-3.5 text-sm font-black text-white shadow-md shadow-whatsapp/20 transition-all duration-200">
                <WhatsAppIcon size={18} />
                {isEnglish ? 'Ask on WhatsApp' : 'Preguntar por WhatsApp'}
              </span>
            </a>
          </div>
        </div>
      </section>

      <FaqSection
        id="faq"
        eyebrow={isEnglish ? 'Frequently asked questions' : 'Preguntas frecuentes'}
        title={isEnglish ? 'Common doubts before choosing insurance' : 'Dudas habituales antes de elegir seguro'}
        items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

    </div>
  );
};

export default Home;
