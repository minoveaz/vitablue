import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { asisaFeaturedProducts, asisaConsultProducts } from '@/domain/products/asisaCatalog';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';

export const AsisaInsurances: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = (flow?: string) => {
    resetWizard();
    if (flow === 'students') {
      setProfile('student');
    } else {
      setProfile('individual');
    }
    navigate('/wizard');
  };

  const faqs = [
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

  const testimonials = [
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

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: 'Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias.',
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
            name: 'Inicio',
            item: 'https://www.vitablue.es'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Seguros de Salud',
            item: 'https://www.vitablue.es/productos/seguros-salud'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Seguros Asisa'
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Por qué contratar los seguros de Asisa a través de VitaBlue?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Contratas exactamente al precio oficial de Asisa con todas las promociones vigentes de la aseguradora, sin comisiones ni sobrecostes. Además, en VitaBlue cuentas con un asesor personal colegiado que te asiste en la emisión rápida de certificados para visados en 24h, gestión de autorizaciones médicas y resolución de trámites.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Qué diferencia hay entre ASISA Completa +, Completa ++ y la modalidad sin copago?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'ASISA Completa es la póliza de cobertura médica y quirúrgica total. En su versión Completa + disfrutas de una prima mensual reducida con copagos muy bajos por consulta médica. En Completa ++ la cuota mensual es aún más económica a cambio de copagos intermedios. Para trámites de visado o residencia en Extranjería, se exige contratar la modalidad Sin Copagos.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Qué es el Grupo HLA y qué ventajas ofrece a los asegurados de Asisa?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'El Grupo Hospitalario HLA es la red de clínicas y hospitales propios de Asisa, una de las mayores redes hospitalarias de España con 18 hospitales y 36 centros multiespecialidad. Como asegurado de Asisa accedes de forma preferente y directa a estos centros sin trámites adicionales.'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Gama Oficial de Seguros de Salud Asisa | Catálogo VitaBlue</title>
        <meta
          name="description"
          content="Explora y compara la gama oficial de seguros de salud de Asisa: ASISA Health Students, Residents, Completa +, Esencial y Mutualistas. Precio oficial sin comisiones."
        />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguros-salud/seguros-asisa" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gama Oficial de Seguros de Salud Asisa | Catálogo VitaBlue" />
        <meta
          property="og:description"
          content="Explora y compara la gama oficial de seguros de salud de Asisa: ASISA Health Students, Residents, Completa +, Esencial y Mutualistas. Precio oficial sin comisiones."
        />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguros-salud/seguros-asisa" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gama Oficial de Seguros de Salud Asisa | Catálogo VitaBlue" />
        <meta
          name="twitter:description"
          content="Explora y compara la gama oficial de seguros de salud de Asisa: ASISA Health Students, Residents, Completa +, Esencial y Mutualistas. Precio oficial sin comisiones."
        />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar
        items={[
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
                  <Sparkles className="w-4 h-4" /> Especialistas en Asisa
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  Precios oficiales y promociones
                </span>
              </div>

              <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
                Toda la gama de Seguros Asisa
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Compara y filtra el catálogo oficial de pólizas de salud de Asisa: seguros para visados de estudiantes, residencia, nómadas y asistencia familiar con red hospitalaria propia Grupo HLA.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={() => handleStartQuoting()} rightIcon={<ArrowRight size={18} />}>
                  Calcular mi tarifa online
                </Button>
                <a
                  href="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20los%20seguros%20de%20Asisa."
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
                    Preguntar por WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Micro Stats Widget */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col gap-6 text-left">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-white/5 opacity-50" />
                <h3 className="text-lg font-display font-black text-brand-cyan z-10 border-b border-white/10 pb-3">
                  ¿Por qué contratar Asisa con nosotros?
                </h3>
                <div className="grid grid-cols-2 gap-4 z-10">
                  <div>
                    <span className="block text-2xl font-black text-white">0€</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      Recargos o comisiones
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">9</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      Pólizas oficiales
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">40k+</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      Profesionales HLA
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">24h</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">
                      Certificado consular
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
        items={[
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
              Gama Principal y Visados
            </span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              Pólizas Destacadas de Asisa
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              Pólizas oficiales de cobertura total para visados de extranjería, residencia y asistencia médica completa para familias con el cuadro médico del Grupo HLA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {asisaFeaturedProducts.map((product) => (
              <InsuranceProductCard
                key={product.id}
                title={product.title}
                tagline={product.tagline}
                description={product.desc}
                features={product.features}
                price={product.price}
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
              Modalidades Ambulatorias y Colectivos
            </span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              Otras Coberturas y Planes Especiales Asisa
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              Opciones extrahospitalarias para visitas rápidas a especialistas sin hospitalización y coberturas específicas para funcionarios mutualistas (MUFACE, ISFAS, MUGEJU).
            </p>
          </div>

          {/* WhatsApp Notice Box */}
          <div className="bg-white rounded-3xl border border-primary/15 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-grow">
              <h4 className="text-sm font-black text-text-main">
                ¿Cómo tramitar estas pólizas de Asisa con tu asesor VitaBlue?
              </h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Al pulsar en <strong>Consultar por WhatsApp</strong>, un asesor especialista de VitaBlue revisará tu caso, te facilitará la prima exacta de Asisa y gestionará la tramitación de tu póliza de forma 100% gratuita y sin letra pequeña.
              </p>
            </div>
            <a
              href="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20para%20los%20seguros%20especiales%20de%20Asisa."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto shrink-0"
            >
              <Button variant="accent" className="w-full md:w-auto font-bold shadow-md shadow-accent/10 whitespace-nowrap">
                Hablar con un asesor ahora
              </Button>
            </a>
          </div>

          {/* Bento Grid (WhatsApp CTAs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {asisaConsultProducts.map((product) => (
              <InsuranceProductCard
                key={product.id}
                title={product.title}
                tagline={product.tagline}
                description={product.desc}
                features={product.features}
                price={product.price}
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
        eyebrow="Alta oficial y rápida"
        title="Proceso de contratación en Asisa"
        description="Emitimos tu póliza directamente en Asisa de forma rápida, segura y 100% digital."
        steps={[
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

      <AsisaTrustSection />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes confían en Asisa con VitaBlue" items={testimonials} />

      {/* Accordion FAQs Section */}
      <FaqSection
        eyebrow="Dudas Frecuentes"
        title="Preguntas Frecuentes sobre Seguros Asisa"
        items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
      />

      <AdvisorHelpSection
        title="¿Tienes dudas sobre qué seguro de Asisa elegir?"
        description="Te asesoramos sin coste para encontrar la mejor póliza de Asisa o comparar de forma imparcial con Sanitas y Adeslas."
        whatsappUrl="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20los%20seguros%20de%20Asisa."
      />
    </div>
  );
};

export default AsisaInsurances;
