import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity,
  ArrowRight, 
  CheckCircle2, 
  Globe,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { useWizard } from '@/context/WizardContext';
import ProductTransparencySection from '@/components/organisms/ProductTransparencySection';
import FaqSection from '@/components/organisms/FaqSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import PlanComparisonSection from '@/components/organisms/PlanComparisonSection';
import { Button } from '@/components/atoms/Button';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import RequirementsComparisonTable from '@/components/organisms/RequirementsComparisonTable';
import { 
  HealthIllustration, 
  ProfileIllustration,
  PreventionIllustration,
  PiggyBankIllustration,
  CoverageIllustration,
  MedicalAttentionIllustration
} from '@/components/illustrations';

export const HealthInsurance: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();
  
  // State for interactive age-pricing calculator
  const [selectedAge, setSelectedAge] = useState<'young' | 'adult' | 'senior'>('young');
  
  // State for bento grid products filter
  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard/');
  };

  const inclusions = [
    'Consultas ilimitadas de medicina general, pediatría y especialidades médicas.',
    'Hospitalización médica, obstétrica y quirúrgica en habitación individual.',
    'Urgencias médicas nacionales e internacionales 24 horas.',
    'Acceso a pruebas diagnósticas de alta tecnología (resonancias, TAC, ecografías).'
  ];

  const exclusions = [
    'Tratamientos estéticos, cirugía reconstructiva estética y tratamientos cosméticos.',
    'Medicamentos recetados fuera del ámbito de la hospitalización.',
    'Patologías y lesiones preexistentes a la fecha de contratación no declaradas en el cuestionario.',
    'Tratamientos de medicina alternativa y terapias experimentales.'
  ];

  const faqs = [
    {
      q: '¿Qué diferencia hay entre un seguro con copago y sin copago?',
      a: 'En un seguro sin copago, pagas una cuota mensual fija y tienes acceso a todos los servicios médicos sin cargos adicionales. En el seguro con copago, la cuota mensual es más baja, pero pagas una pequeña tarifa adicional por cada visita médica o prueba diagnóstica que realices.'
    },
    {
      q: '¿Qué es el periodo de carencia?',
      a: 'Es el tiempo que debe transcurrir desde que entra en vigor el seguro hasta que puedes hacer uso de ciertas coberturas complejas, como cirugías, hospitalizaciones o partos (suele ser de 3 a 10 meses). Las consultas básicas de especialistas y urgencias vitales no tienen carencia.'
    },
    {
      q: '¿Cómo sé qué aseguradora elegir (Sanitas, Adeslas, DKV)?',
      a: 'Depende de tus prioridades: Adeslas destaca por tener el cuadro médico más grande de España, Sanitas es líder en videoconsultas y medicina digital (Blua), y DKV destaca por la calidad de su servicio y coberturas dentales. Te ayudamos a decidir de forma personalizada.'
    }
  ];

  // Pricing matrix data based on age
  const pricingData = {
    young: {
      range: '18 a 30 años',
      basic: '12€',
      copago: '22€',
      noCopago: '37€'
    },
    adult: {
      range: '31 a 50 años',
      basic: '18€',
      copago: '30€',
      noCopago: '48€'
    },
    senior: {
      range: 'Más de 50 años',
      basic: '35€',
      copago: '55€',
      noCopago: '89€'
    }
  };

  const modalities = [
    {
      title: 'Seguro Básico',
      subtitle: 'Sin Hospitalización',
      desc: 'Consultas médicas de cabecera, especialistas y pruebas básicas. No cubre ingresos hospitalarios ni cirugías.',
      profile: 'Jóvenes y personas sanas que solo quieren evitar las listas de espera en consultas.',
      priceText: 'El más económico',
      illustration: PreventionIllustration
    },
    {
      title: 'Seguro con Copago',
      subtitle: 'Cuota reducida + copagos',
      desc: 'Acceso médico completo (incluyendo hospitalización). Pagas una cuota mensual muy baja y una pequeña tarifa por visita.',
      profile: 'Personas que acuden al médico pocas veces al año y buscan ahorrar en su mensualidad.',
      priceText: 'Ahorro a largo plazo',
      illustration: PiggyBankIllustration
    },
    {
      title: 'Seguro sin Copago',
      subtitle: 'Tarifa plana mensual',
      desc: 'Cobertura total e ilimitada. No pagas nada extra al usar el seguro, sin importar cuántas veces vayas.',
      profile: 'Familias, uso frecuente de especialistas, y obligatorio para obtener visados consulares.',
      priceText: 'Tranquilidad total',
      illustration: CoverageIllustration
    },
    {
      title: 'Seguro de Reembolso',
      subtitle: 'Libertad de médicos mundial',
      desc: 'Eliges cualquier médico o centro hospitalario en el mundo. La aseguradora te reembolsa del 80% al 90% de la factura.',
      profile: 'Quienes quieren conservar a su médico de confianza o tratarse en el extranjero.',
      priceText: 'Libertad absoluta',
      illustration: MedicalAttentionIllustration
    }
  ];

  const bentoProducts = [
    {
      id: 'international-students',
      category: 'esencial',
      title: 'Sanitas International Students',
      tagline: 'Seguro para estudiantes extranjeros en España',
      desc: 'Seguro médico obligatorio para visado de estudios o prórrogas en España. Sin copagos, sin carencias y con repatriación.',
      features: [
        'Cumple el 100% de exigencias consulares',
        'Videoconsultas en inglés y español 24/7',
        'Repatriación médica ilimitada incluida'
      ],
      price: '38,95€/mes',
      link: '/productos/seguros-salud/seguros-sanitas/international-students/',
      isSubpage: true
    },
    {
      id: 'sanitas-accede',
      category: 'esencial',
      title: 'Sanitas Accede',
      tagline: 'Asistencia Extra-hospitalaria y Digital Básica',
      desc: 'Producto de cobertura limitada que excluye la hospitalización e intervenciones complejas, ideal para visitas y consultas rápidas.',
      features: [
        'Especialistas y pruebas diagnósticas simples',
        'Cobertura dental básica incluida',
        'Sin carencias de ningún tipo'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Accede.',
      isSubpage: false
    },
    {
      id: 'sanitas-avanza',
      category: 'esencial',
      title: 'Sanitas Avanza',
      tagline: 'Asistencia Limitada con Cirugía Menor',
      desc: 'Asistencia sanitaria limitada que cubre consultas médicas, pruebas complejas y pequeñas cirugías ambulatorias.',
      features: [
        'Pruebas diagnósticas simples y complejas',
        'Cirugías ambulatorias que no requieren ingreso',
        'Límite de copago anual de 350€ por asegurado'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Avanza.',
      isSubpage: false
    },
    {
      id: 'sanitas-unico',
      category: 'esencial',
      title: 'Sanitas Único',
      tagline: 'Cobertura para Mayores sin Límite de Edad',
      desc: 'Asistencia médica extrahospitalaria dirigida a mayores de 60 años, garantizando consultas y pruebas sin límite de edad.',
      features: [
        'Sin límite de edad de contratación o permanencia',
        'Ecografía, TAC y resonancias concertadas',
        'Incluye servicios a domicilio senior'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20%C3%9Anico.',
      isSubpage: false,
      badge: '+60 años'
    },
    {
      id: 'mas-salud',
      category: 'completa',
      title: 'Sanitas Más Salud',
      tagline: 'Asistencia Sanitaria Completa y Digital',
      desc: 'El seguro de salud de cuadro completo más vendido. Acceso médico total, hospitalización ilimitada y medicina digital Blua.',
      features: [
        'Hospitalización médica y quirúrgica completa',
        'Servicios Blua: videoconsulta y fisio digital',
        'Segunda opinión médica internacional'
      ],
      price: 'Desde 35,90€/mes',
      link: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/',
      isSubpage: true,
      badge: 'Más vendido'
    },
    {
      id: 'mas-salud-familias',
      category: 'completa',
      title: 'Sanitas Más Salud Familias',
      tagline: 'Cobertura Completa con Foco Familiar',
      desc: 'Seguro de asistencia sanitaria completa reforzado en el cuidado de familias con logopedia, psicología y programas infantiles.',
      features: [
        'Cobertura total de hospitalización y cirugías',
        'Psicología y Logopedia ampliadas de serie',
        'Programas digitales de nutrición infantil'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20M%C3%A1s%20Salud%20Familias.',
      isSubpage: false,
      badge: 'Familias'
    },
    {
      id: 'profesionales',
      category: 'completa',
      title: 'Sanitas Profesionales',
      tagline: 'Asistencia Completa para Autónomos',
      desc: 'Diseñado para trabajadores por cuenta propia. Cobertura médica completa e indemnización de cuotas por incapacidad.',
      features: [
        'Asistencia completa y hospitalización',
        'Protección total frente a bajas por enfermedad',
        'Ventajas fiscales para autónomos en España'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Profesionales.',
      isSubpage: false,
      badge: 'Autónomos'
    },
    {
      id: 'top-quantum',
      category: 'premium',
      title: 'Sanitas Top Quantum',
      tagline: 'Salud Premium con Reembolso Familiar',
      desc: 'Póliza premium que combina el acceso a nuestro gran cuadro médico concertado y reembolso de gastos a nivel mundial.',
      features: [
        'Libre elección de especialista fuera de la red',
        'Reembolso de hasta 10.000€ en especialidades',
        'Asistencia urgente en viajes de hasta 15.000€'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Top%20Quantum.',
      isSubpage: false,
      badge: 'Premium'
    },
    {
      id: 'international-residents',
      category: 'premium',
      title: 'International Residents',
      tagline: 'Cobertura Integral para Residentes Extranjeros',
      desc: 'Seguro médico de alto nivel para extranjeros residentes, con libre elección de médico y reembolso de gastos de salud en el país de origen.',
      features: [
        'Asistencia completa en España y país de origen',
        'Opción de reembolso para libre elección médica',
        'Repatriación por fallecimiento ilimitada'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20International%20Residents.',
      isSubpage: false,
      badge: 'Extranjeros'
    },
    {
      id: 'salud-mascotas',
      category: 'otros',
      title: 'Sanitas Salud Mascotas',
      tagline: 'Seguro Veterinario para Perros y Gatos',
      desc: 'Seguro de asistencia veterinaria completa con vacunas de la rabia, consultas de urgencia y cobertura dental de serie.',
      features: [
        'Consultas veterinarias gratuitas ilimitadas',
        'Vacuna de rabia y desparasitaciones gratuitas',
        'Urgencias y hospitalizaciones concertadas'
      ],
      price: 'Desde 9,90€/mes',
      link: '/productos/seguro-mascotas/sanitas-mascotas/',
      isSubpage: true,
      badge: 'Mascotas'
    },
    {
      id: 'asistencia-familiar-iplus',
      category: 'otros',
      title: 'Asistencia Familiar iPlus',
      tagline: 'Seguro de Decesos y Apoyo Familiar',
      desc: 'Póliza de asistencia de sepelio completa y asesoría familiar para la gestión de herencias, traslados y apoyo psicológico.',
      features: [
        'Gestión integral de sepelio y entierro',
        'Traslado nacional e internacional cubierto',
        'Testamento online y gestoría legal'
      ],
      price: 'Consultar',
      link: '/productos/seguro-para-decesos/asistencia-familiar/',
      isSubpage: true,
      badge: 'Decesos'
    },
    {
      id: 'asistencia-senior-unica',
      category: 'otros',
      title: 'Asistencia Senior Prima Única',
      tagline: 'Decesos para Mayores de 65 años',
      desc: 'Garantiza el servicio fúnebre y el traslado nacional e internacional para mayores de 65 años mediante el pago de un único importe.',
      features: [
        'Sin límite máximo de edad de contratación',
        'Garantiza el servicio fúnebre completo',
        'Pago en una única cuota de por vida'
      ],
      price: 'Prima única',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Asistencia%20Senior%20a%20Prima%20%C3%9Anica%20Sanitas.',
      isSubpage: false,
      badge: '+65 años'
    }
  ];
  void bentoProducts;

  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/';
  const title = 'Seguros de Salud en España | Compara Tarifas y Coberturas | VitaBlue';
  const description = 'Compara los mejores seguros de salud privados de España (Sanitas, Adeslas, DKV, Mapfre). Coberturas con y sin copago, seguros de salud para extranjeros y asesoría.';

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
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
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué diferencia hay entre un seguro con copago y sin copago?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En un seguro sin copago, pagas una cuota mensual fija y tienes acceso a todos los servicios médicos sin cargos adicionales. En el seguro con copago, la cuota mensual es más baja, pero pagas una pequeña tarifa adicional por cada visita médica o prueba diagnóstica que realices."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué es el periodo de carencia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Es el tiempo que debe transcurrir desde que entra en vigor el seguro hasta que puedes hacer uso de ciertas coberturas complejas, como cirugías, hospitalizaciones o partos (suele ser de 3 a 10 meses). Las consultas básicas de especialistas y urgencias vitales no tienen carencia."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cómo sé qué aseguradora elegir (Sanitas, Adeslas, DKV)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Depende de tus prioridades: Adeslas destaca por tener el cuadro médico más grande de España, Sanitas es líder en videoconsultas y medicina digital (Blua), y DKV destaca por la calidad de su servicio y coberturas dentales. Te ayudamos a decidir de forma personalizada."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

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
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }]} />

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            
            {/* Text column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                <Activity className="w-4 h-4" />
                Seguros de Salud Multimarca
              </div>
              
              <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
                El mejor cuadro médico privado, al mejor precio
              </h1>
              
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Comparamos de forma transparente las pólizas de salud líderes de España (Sanitas, Adeslas, DKV, Mapfre). Sin llamadas de spam comercial y con el respaldo de nuestros asesores.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Comparar Precios Online
                </Button>
                <a href="tel:+34694583452" className="inline-flex items-center justify-center">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Llamar Gratis
                  </Button>
                </a>
              </div>
            </div>

            {/* Illustration Card Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex items-center justify-center aspect-[4/3] overflow-hidden text-brand-cyan">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-white/5 opacity-50" />
                <div className="w-full h-full max-h-[220px]">
                  <HealthIllustration />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Modalidades de Seguros Section */}
      <PlanComparisonSection
          eyebrow="Modalidades"
          title="Tipos de Seguros de Salud en España"
          description="No todas las pólizas de salud son iguales. Te explicamos los cuatro tipos de seguros privados para que elijas la estructura ideal."
          plans={modalities}
          columns={4}
      />

      {/* Interactive Age-Pricing Calculator */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="text-center space-y-4 mb-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Estimador de tarifas</span>
            <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
              ¿Cuánto cuesta un seguro médico según tu edad?
            </h2>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
              Selecciona tu grupo de edad para ver un rango de tarifas mensuales aproximadas según las distintas coberturas de las aseguradoras.
            </p>
          </div>

          {/* Age Selector Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-white p-1.5 border border-slate-200 shadow-inner">
              <button
                onClick={() => setSelectedAge('young')}
                className={`rounded-full px-5 py-2 text-xs font-black transition-all duration-200 ${
                  selectedAge === 'young' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                18 a 30 años
              </button>
              <button
                onClick={() => setSelectedAge('adult')}
                className={`rounded-full px-5 py-2 text-xs font-black transition-all duration-200 ${
                  selectedAge === 'adult' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                31 a 50 años
              </button>
              <button
                onClick={() => setSelectedAge('senior')}
                className={`rounded-full px-5 py-2 text-xs font-black transition-all duration-200 ${
                  selectedAge === 'senior' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                Más de 50 años
              </button>
            </div>
          </div>

          {/* Price Cards for Selected Age */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch mt-6">
            {/* Card 1: Seguro Básico */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div className="space-y-6">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-secondary">
                    Básico (Sin Hospitalización)
                  </span>
                  <h3 className="text-h2 font-display font-black text-text-main mt-3">Seguro Básico</h3>
                </div>

                <div className="flex items-baseline gap-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-text-secondary">Desde</span>
                  <span className="text-4xl font-display font-black text-primary">{pricingData[selectedAge].basic}</span>
                  <span className="text-xs font-bold text-text-secondary">/mes</span>
                </div>

                <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Consultas médicas de cabecera</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Todas las especialidades médicas</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pruebas diagnósticas básicas</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <span>✗ Hospitalización ni cirugías</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 border-t border-slate-50 mt-8">
                <Button 
                  onClick={handleStartQuoting} 
                  variant="outline" 
                  className="w-full justify-center border-slate-200 text-text-main hover:bg-slate-50"
                >
                  Calcular Básico
                </Button>
              </div>
            </div>

            {/* Card 2: Seguro con Copago (HIGHLIGHTED) */}
            <div className="rounded-3xl border-2 border-primary bg-gradient-to-b from-white to-primary/5 p-6 sm:p-8 shadow-md text-left flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 md:scale-105 relative z-10">
              <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl">
                Recomendado
              </div>
              <div className="space-y-6">
                <div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                    Completo con Copago
                  </span>
                  <h3 className="text-h2 font-display font-black text-text-main mt-3">Seguro Copago</h3>
                </div>

                <div className="flex items-baseline gap-1 bg-primary/10 p-4 rounded-2xl border border-primary/10">
                  <span className="text-xs font-bold text-primary">Desde</span>
                  <span className="text-4xl font-display font-black text-primary-dark">{pricingData[selectedAge].copago}</span>
                  <span className="text-xs font-bold text-primary">/mes</span>
                </div>

                <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Hospitalización y cirugías</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Urgencias médicas 24h en clínica</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pruebas diagnósticas avanzadas</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cuota reducida + copago bajo</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 border-t border-primary/10 mt-8">
                <Button 
                  onClick={handleStartQuoting} 
                  className="w-full justify-center shadow-md shadow-primary/20"
                >
                  Calcular Copago
                </Button>
              </div>
            </div>

            {/* Card 3: Seguro sin Copago */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div className="space-y-6">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-text-secondary">
                    Completo sin Copago
                  </span>
                  <h3 className="text-h2 font-display font-black text-text-main mt-3">Seguro Sin Copago</h3>
                </div>

                <div className="flex items-baseline gap-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-text-secondary">Desde</span>
                  <span className="text-4xl font-display font-black text-primary">{pricingData[selectedAge].noCopago}</span>
                  <span className="text-xs font-bold text-text-secondary">/mes</span>
                </div>

                <ul className="space-y-3.5 text-xs font-semibold text-text-secondary">
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cobertura total sin copagos (0€)</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Consultas y urgencias ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Válido para Visados / Consulares</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-main">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Seguro dental básico de serie</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 border-t border-slate-50 mt-8">
                <Button 
                  onClick={handleStartQuoting} 
                  variant="outline" 
                  className="w-full justify-center border-slate-200 text-text-main hover:bg-slate-50"
                >
                  Calcular Sin Copago
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expat/Visa Highlight Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-white via-white to-brand-cyan/10 p-6 sm:p-10 shadow-md shadow-primary/5 flex flex-col lg:flex-row items-center gap-10">
            {/* Expat Illustration */}
            <div className="w-48 sm:w-60 shrink-0 aspect-[4/3] text-primary">
              <ProfileIllustration />
            </div>

            {/* Content info */}
            <div className="flex-grow space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                <Globe className="w-3.5 h-3.5" /> Especialidad Extranjería
              </div>
              
              <h2 className="text-h2 font-display font-black text-text-main leading-tight">
                ¿Vienes a España y necesitas un seguro para el Visado?
              </h2>
              
              <p className="text-body-reg text-text-secondary leading-relaxed font-medium">
                Tanto las Oficinas de Extranjería como los Consulados españoles exigen un seguro de salud privado muy específico para conceder visados de estudios, residencia no lucrativa o nómada digital.
              </p>

              {/* Requirement highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-text-main">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Sin Copagos (Garantía Total)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Sin Periodos de Carencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Repatriación Sanitaria Incluida</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Certificado oficial para el visado</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link to="/productos/seguros-salud/seguro-salud-extranjeros/" className="w-full sm:w-auto">
                  <Button 
                    variant="accent" 
                    className="w-full sm:w-auto sm:px-10 font-bold group shadow-md shadow-accent/20 whitespace-nowrap"
                    rightIcon={<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-background-dark shrink-0" />}
                  >
                    Ver Seguros para Visado
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Sanitas Insurance Portal Link */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col lg:flex-row items-center gap-10">
          
          {/* Content Info */}
          <div className="flex-grow space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
              <Sparkle className="w-3.5 h-3.5 text-primary" /> Especialista Sanitas
            </div>
            
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              Seguros de Salud Especializados Sanitas
            </h2>
            
            <p className="text-body-reg text-text-secondary leading-relaxed font-medium">
              Te ayudamos a encontrar y comparar toda la gama oficial de pólizas de salud de Sanitas: desde coberturas básicas extrahospitalarias hasta los planes de reembolso premium más avanzados del mercado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold text-text-main">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Gama completa de 12 pólizas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Filtros interactivos de cobertura</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Planes para estudiantes y autónomos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Asistencia digital Blua incluida</span>
              </div>
            </div>

            <div className="pt-4">
              <Link to="/productos/seguros-salud/seguros-sanitas/">
                <Button 
                  variant="primary" 
                  className="w-full sm:w-auto px-10 font-bold group shadow-md shadow-primary/20 whitespace-nowrap"
                  rightIcon={<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />}
                >
                  Explorar Catálogo Sanitas
                </Button>
              </Link>
            </div>
          </div>

          {/* Specialty Logo Card */}
          <div className="w-48 sm:w-60 shrink-0 order-1 lg:order-2 flex items-center justify-center bg-white rounded-3xl p-8 border border-slate-150 shadow-sm min-h-[140px] hover:shadow-md transition-shadow duration-300">
            <img 
              src="/images/logo-sanitas.svg" 
              alt="Logotipo de Sanitas" 
              className="max-w-full h-10 object-contain" 
            />
          </div>

        </div>
      </section>

      {/* Comparisons Teaser Table */}
      <section className="py-16 sm:py-20 w-full max-w-5xl mx-auto px-6 sm:px-8 border-t border-slate-100">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Comparativa Directa</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Sanitas vs Adeslas vs DKV: ¿Cuál elegir?
          </h2>
          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-xl mx-auto">
            Te resumimos en qué destaca cada una de las principales aseguradoras de salud privadas de España.
          </p>
        </div>

        <RequirementsComparisonTable
          tableClassName="bg-white text-sm font-semibold text-text-secondary"
          headClassName="bg-slate-50 border-b border-slate-100 text-xs text-text-main uppercase font-black tracking-wider"
          bodyClassName="divide-y divide-slate-100"
          columns={[
            { key: 'provider', label: 'Aseguradora', className: 'w-[14%] px-6 py-4' },
            { key: 'plans', label: 'Modalidades', className: 'w-[17%] px-6 py-4' },
            { key: 'strength', label: 'Punto Fuerte', className: 'w-[29%] px-6 py-4' },
            { key: 'video', label: 'Videoconsulta', className: 'w-[23%] px-6 py-4' },
            { key: 'price', label: 'Precio Inicial', className: 'w-[17%] px-6 py-4' },
          ]}
          rows={[
            { key: 'sanitas', className: 'hover:bg-slate-50/50 transition-colors', cells: [<span className="font-bold text-text-main">Sanitas</span>, <span>Con y Sin Copago</span>, <span>Medicina digital y videoconsultas inmediatas (Blua)</span>, <span className="text-emerald-600">✓ Incluido (Líder digital)</span>, <span className="text-text-main font-bold">Desde 35,90€/mes</span>] },
            { key: 'adeslas', className: 'hover:bg-slate-50/50 transition-colors', cells: [<span className="font-bold text-text-main">Adeslas</span>, <span>Con y Sin Copago</span>, <span>El mayor cuadro médico y red de hospitales de España</span>, <span>✓ Incluido</span>, <span className="text-text-main font-bold">Desde 34,00€/mes</span>] },
            { key: 'dkv', className: 'hover:bg-slate-50/50 transition-colors', cells: [<span className="font-bold text-text-main">DKV</span>, <span>Con y Sin Copago</span>, <span>Gran cobertura dental de serie y servicio al cliente</span>, <span className="text-emerald-600">✓ Incluido (Quiero Cuidarme)</span>, <span className="text-text-main font-bold">Desde 32,50€/mes</span>] },
          ]}
        />
      </section>

      {/* Transparency section */}
      <ProductTransparencySection
        title="¿Qué incluye y qué excluye el seguro médico típico?"
        description="Las aseguradoras tienen exclusiones e inclusiones estándar en España. Te las explicamos sin rodeos para que contrates con conocimiento."
        inclusions={inclusions}
        exclusions={exclusions}
        className="bg-slate-50 border-y border-slate-100"
      />

      <AdvisorHelpSection
        title="¿Necesitas ayuda personalizada de salud?"
        description="Nuestros asesores de salud autorizados están a tu disposición por WhatsApp para resolver dudas médicas, analizar preexistencias y gestionar el alta oficial."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Tengo%20dudas%20sobre%20coberturas%20de%20seguros%20de%20salud."
      />

      <FaqSection eyebrow="Dudas Frecuentes" title="Preguntas sobre Seguros de Salud" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />
    </div>
  );
};

export default HealthInsurance;
