import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Clock, Award, ArrowRight,
  Sparkles, MessageSquare
} from 'lucide-react';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import SanitasTrustSection from '../../components/organisms/SanitasTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import InsuranceProductCard from '../../components/molecules/InsuranceProductCard';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { Button } from '../../components/atoms/Button';
import { WhatsAppIcon } from '../../components/atoms/WhatsAppIcon';
import { useWizard } from '../../context/WizardContext';
import { sanitasConsultProducts, sanitasFeaturedProducts } from '@/domain/products/sanitasCatalog';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';

export const SanitasInsurances: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();
  const sanitasWhatsAppUrl = buildContextualWhatsAppUrl({
    pathname: '/productos/seguros-salud/seguros-sanitas',
    tag: 'LANDING-SANITAS',
  });

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard');
  };

  // Products with their own dedicated page in V2
  const faqs = [
    {
      q: '¿Qué ventajas tiene contratar a través de un Asesor Especialista de Sanitas?',
      a: 'Contratas directamente con el precio oficial de Sanitas y todas sus promociones vigentes. No pagas ningún tipo de comisión ni recargo. La gran ventaja es que obtienes soporte y asesoramiento continuo y humano de VitaBlue para autorizaciones, reembolsos o dudas de cobertura.'
    },
    {
      q: '¿Las pólizas de Sanitas tienen periodos de carencia?',
      a: 'Sí, la mayoría de seguros completos tienen carencias de entre 3 y 10 meses para coberturas complejas como hospitalizaciones o partos. No obstante, las consultas, urgencias y el seguro dental no tienen carencias. Si vienes de otra aseguradora con más de 1 año de antigüedad, Sanitas elimina la mayoría de las carencias.'
    },
    {
      q: '¿Qué es Blua y cómo funciona la telemedicina en Sanitas?',
      a: 'Blua es la plataforma de medicina digital líder de Sanitas. Permite hacer videoconsultas médicas de urgencia 24/7 y con especialistas, recibir recetas electrónicas oficiales válidas en farmacias de toda España, solicitar analíticas a domicilio y usar herramientas digitales de prevención de salud.'
    }
  ];

  const testimonials = [
    {
      author: 'Margarita S.',
      meta: 'Asegurada Sanitas Más Salud (Madrid)',
      comment: 'Teníamos dudas sobre qué plan elegir para la familia. La asesora de VitaBlue nos detalló las diferencias de copagos y nos tramitó el alta en unas horas. Un trato excelente y muy transparente.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Federico L.',
      meta: 'Sanitas Profesionales (Valencia)',
      comment: 'Soy autónomo y buscaba cobertura médica y de baja laboral. Encontré el asesoramiento perfecto en VitaBlue. Me explicaron las coberturas de inmovilización sin rodeos.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Christian H.',
      meta: 'Estudiante de Intercambio (Barcelona)',
      comment: 'Contraté el seguro de estudiantes de Sanitas para mi visado. Súper rápido, el certificado médico oficial llegó a mi correo electrónico al día siguiente y la embajada lo aceptó de inmediato.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

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
            "item": "https://www.vitablue.es"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Seguros de Salud",
            "item": "https://www.vitablue.es/productos/seguros-salud"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Seguros Sanitas"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Qué ventajas tiene contratar a través de un Asesor Especialista de Sanitas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contratas directamente con el precio oficial de Sanitas y todas sus promociones vigentes. No pagas ningún tipo de comisión ni recargo. La gran ventaja es que obtienes soporte y asesoramiento continuo y humano de VitaBlue para autorizaciones, reembolsos o dudas de cobertura."
            }
          },
          {
            "@type": "Question",
            "name": "¿Las pólizas de Sanitas tienen periodos de carencia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, la mayoría de seguros completos tienen carencias de entre 3 y 10 meses para coberturas complejas como hospitalizaciones o partos. No obstante, las consultas, urgencias y el seguro dental no tienen carencias. Si vienes de otra aseguradora con más de 1 año de antigüedad, Sanitas elimina la mayoría de las carencias."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué es Blua y cómo funciona la telemedicina en Sanitas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Blua es la plataforma de medicina digital líder de Sanitas. Permite hacer videoconsultas médicas de urgencia 24/7 y con especialistas, recibir recetas electrónicas oficiales válidas en farmacias de toda España, solicitar analíticas a domicilio y usar herramientas digitales de prevención de salud."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Gama Oficial de Seguros de Salud Sanitas | Catálogo VitaBlue</title>
        <meta name="description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gama Oficial de Seguros de Salud Sanitas | Catálogo VitaBlue" />
        <meta property="og:description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gama Oficial de Seguros de Salud Sanitas | Catálogo VitaBlue" />
        <meta name="twitter:description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-center">

            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                  <Sparkles className="w-4 h-4" /> Especialistas en Sanitas
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-dark">
                  Precios oficiales y promociones
                </span>
              </div>

              <h1 className="text-h1 font-display font-black leading-tight tracking-tight">
                Toda la gama de Seguros Sanitas
              </h1>

              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Compara y filtra el catálogo oficial de pólizas de salud, mascotas y decesos de Sanitas. Consigue el precio oficial sin comisiones adicionales y con soporte humano real.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Calcular mi tarifa online
                </Button>
                <a href={sanitasWhatsAppUrl} className="inline-flex items-center justify-center" target="_blank" rel="noopener noreferrer">
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
                <h3 className="text-lg font-display font-black text-brand-cyan z-10 border-b border-white/10 pb-3">¿Por qué contratar con nosotros?</h3>
                <div className="grid grid-cols-2 gap-4 z-10">
                  <div>
                    <span className="block text-2xl font-black text-white">0€</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">Recargos o comisiones</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">12</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">Pólizas oficiales</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">4.9/5</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">Valoración media</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">24h</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">Gestión de alta</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ProductTrustBar items={[
        { icon: <ShieldCheck />, title: 'Asesoría de Seguros Autorizada', description: 'Precios oficiales garantizados sin recargo comercial.' },
        { icon: <Clock />, title: 'Alta Rápida en 24 Horas', description: 'Gestión rápida del alta y cuestionario médico digital.' },
        { icon: <Award />, title: 'Soporte Continuo VitaBlue', description: 'Te ayudamos en la gestión diaria y autorizaciones.' },
      ]} />

      {/* Section 1: Featured Products with own subpage */}
      <section className="py-16 sm:py-20 bg-white text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">

          <div className="space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Contratación Online Directa</span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              Seguros de Sanitas con Página de Producto
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              Pólizas de salud, mascotas y decesos destacadas con tarificador online, coberturas completas detalladas y contratación digital paso a paso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sanitasFeaturedProducts.map((product) => (
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
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Asesoramiento y Contratación Personalizada</span>
            <h2 className="text-h2 font-display font-black text-text-main leading-tight">
              Otros Seguros y Coberturas Especiales
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              Planes complementarios de Sanitas que requieren un análisis personalizado de preexistencias o condiciones fiscales. Solicita información sin rodeos a nuestros asesores por WhatsApp.
            </p>
          </div>

          {/* WhatsApp Notice Box */}
          <div className="bg-white rounded-3xl border border-primary/15 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-grow">
              <h4 className="text-sm font-black text-text-main">¿Cómo contratar estas pólizas especializadas?</h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Al pulsar en <strong>Consultar por WhatsApp</strong>, nuestro equipo calculará tu prima oficial en menos de 2 minutos. Te resolveremos dudas de carencias, cuestionario de salud y realizaremos el alta digital de forma totalmente gratuita y sin spam comercial.
              </p>
            </div>
            <a href={sanitasWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto shrink-0">
              <Button variant="accent" className="w-full md:w-auto font-bold shadow-md shadow-accent/10 whitespace-nowrap">
                Hablar con un asesor ahora
              </Button>
            </a>
          </div>

          {/* Bento Grid (WhatsApp CTAs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sanitasConsultProducts.map((product) => (
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
        eyebrow="Alta rápida"
        title="Proceso de contratación oficial"
        description="Emitimos tu póliza directamente en Sanitas de forma rápida y 100% digital."
        steps={[
          {
            title: 'Selecciona tu póliza',
            description: 'Compara y elige el seguro médico de Sanitas que mejor se adapte a tus necesidades y presupuesto.'
          },
          {
            title: 'Completa tus datos',
            description: 'Introduce los datos de los asegurados y selecciona el método de pago (mensual o anual con descuento).'
          },
          {
            title: 'Cuestionario de salud',
            description: 'Rellena el cuestionario médico digital obligatorio de Sanitas desde un enlace privado seguro.'
          },
          {
            title: 'Firma y disfruta',
            description: 'Recibe tu contrato por SMS para firma digital. Tu póliza quedará activa al instante y tus tarjetas en tu móvil.'
          }
        ]}
      />

      <SanitasTrustSection />

      <TestimonialGrid eyebrow="Opiniones reales" title="La experiencia de quienes ya confían en nosotros" items={testimonials} />

      {/* Accordion FAQs Section */}
      <FaqSection eyebrow="Dudas Frecuentes" title="Preguntas Frecuentes sobre Seguros Sanitas" items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))} />

      <AdvisorHelpSection
        title="¿Necesitas asesoría personalizada?"
        description="Te ayudamos a comparar las primas de las distintas compañías de forma neutral para proteger a tu familia de la manera más económica. Te asesoramos de forma gratuita."
        whatsappUrl={sanitasWhatsAppUrl}
      />
    </div>
  );
};

export default SanitasInsurances;

