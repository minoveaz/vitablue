import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, ShieldCheck, Clock, Award, CheckCircle2, ArrowRight,
  Sparkle, Sparkles, Layers, Heart, FileText, CreditCard, MessageSquare
} from 'lucide-react';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import AdvisorCard from '../../components/molecules/AdvisorCard';
import Accordion from '../../components/molecules/Accordion';
import TestimonialCard from '../../components/molecules/TestimonialCard';
import { Button } from '../../components/atoms/Button';
import { WhatsAppIcon } from '../../components/atoms/WhatsAppIcon';
import { useWizard } from '../../context/WizardContext';
import { sanitasConsultProducts, sanitasFeaturedProducts } from '@/domain/products/sanitasCatalog';

export const SanitasInsurances: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('individual');
    navigate('/wizard');
  };

  // Products with their own dedicated page in V2
  const faqs = [
    {
      q: 'Ã‚Â¿QuÃƒÂ© ventajas tiene contratar a travÃƒÂ©s de un Asesor Especialista de Sanitas?',
      a: 'Contratas directamente con el precio oficial de Sanitas y todas sus promociones vigentes. No pagas ningÃƒÂºn tipo de comisiÃƒÂ³n ni recargo. La gran ventaja es que obtienes soporte y asesoramiento continuo y humano de VitaBlue para autorizaciones, reembolsos o dudas de cobertura.'
    },
    {
      q: 'Ã‚Â¿Las pÃƒÂ³lizas de Sanitas tienen periodos de carencia?',
      a: 'SÃƒÂ­, la mayorÃƒÂ­a de seguros completos tienen carencias de entre 3 y 10 meses para coberturas complejas como hospitalizaciones o partos. No obstante, las consultas, urgencias y el seguro dental no tienen carencias. Si vienes de otra aseguradora con mÃƒÂ¡s de 1 aÃƒÂ±o de antigÃƒÂ¼edad, Sanitas elimina la mayorÃƒÂ­a de las carencias.'
    },
    {
      q: 'Ã‚Â¿QuÃƒÂ© es Blua y cÃƒÂ³mo funciona la telemedicina en Sanitas?',
      a: 'Blua es la plataforma de medicina digital lÃƒÂ­der de Sanitas. Permite hacer videoconsultas mÃƒÂ©dicas de urgencia 24/7 y con especialistas, recibir recetas electrÃƒÂ³nicas oficiales vÃƒÂ¡lidas en farmacias de toda EspaÃƒÂ±a, solicitar analÃƒÂ­ticas a domicilio y usar herramientas digitales de prevenciÃƒÂ³n de salud.'
    }
  ];

  const testimonials = [
    {
      author: 'Margarita S.',
      meta: 'Asegurada Sanitas MÃƒÂ¡s Salud (Madrid)',
      comment: 'TenÃƒÂ­amos dudas sobre quÃƒÂ© plan elegir para la familia. La asesora de VitaBlue nos detallÃƒÂ³ las diferencias de copagos y nos tramitÃƒÂ³ el alta en unas horas. Un trato excelente y muy transparente.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Federico L.',
      meta: 'Sanitas Profesionales (Valencia)',
      comment: 'Soy autÃƒÂ³nomo y buscaba cobertura mÃƒÂ©dica y de baja laboral. EncontrÃƒÂ© el asesoramiento perfecto en VitaBlue. Me explicaron las coberturas de inmovilizaciÃƒÂ³n sin rodeos.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Christian H.',
      meta: 'Estudiante de Intercambio (Barcelona)',
      comment: 'ContratÃƒÂ© el seguro de estudiantes de Sanitas para mi visado. SÃƒÂºper rÃƒÂ¡pido, el certificado mÃƒÂ©dico oficial llegÃƒÂ³ a mi correo electrÃƒÂ³nico al dÃƒÂ­a siguiente y la embajada lo aceptÃƒÂ³ de inmediato.',
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
        "description": "Compara y contrata los mejores seguros de salud en EspaÃƒÂ±a. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nÃƒÂ³madas y familias.",
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
            "name": "Ã‚Â¿QuÃƒÂ© ventajas tiene contratar a travÃƒÂ©s de un Asesor Especialista de Sanitas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Contratas directamente con el precio oficial de Sanitas y todas sus promociones vigentes. No pagas ningÃƒÂºn tipo de comisiÃƒÂ³n ni recargo. La gran ventaja es que obtienes soporte y asesoramiento continuo y humano de VitaBlue para autorizaciones, reembolsos o dudas de cobertura."
            }
          },
          {
            "@type": "Question",
            "name": "Ã‚Â¿Las pÃƒÂ³lizas de Sanitas tienen periodos de carencia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SÃƒÂ­, la mayorÃƒÂ­a de seguros completos tienen carencias de entre 3 y 10 meses para coberturas complejas como hospitalizaciones o partos. No obstante, las consultas, urgencias y el seguro dental no tienen carencias. Si vienes de otra aseguradora con mÃƒÂ¡s de 1 aÃƒÂ±o de antigÃƒÂ¼edad, Sanitas elimina la mayorÃƒÂ­a de las carencias."
            }
          },
          {
            "@type": "Question",
            "name": "Ã‚Â¿QuÃƒÂ© es Blua y cÃƒÂ³mo funciona la telemedicina en Sanitas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Blua es la plataforma de medicina digital lÃƒÂ­der de Sanitas. Permite hacer videoconsultas mÃƒÂ©dicas de urgencia 24/7 y con especialistas, recibir recetas electrÃƒÂ³nicas oficiales vÃƒÂ¡lidas en farmacias de toda EspaÃƒÂ±a, solicitar analÃƒÂ­ticas a domicilio y usar herramientas digitales de prevenciÃƒÂ³n de salud."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>Gama Oficial de Seguros de Salud Sanitas | CatÃƒÂ¡logo VitaBlue</title>
        <meta name="description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <link rel="canonical" href="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gama Oficial de Seguros de Salud Sanitas | CatÃƒÂ¡logo VitaBlue" />
        <meta property="og:description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <meta property="og:url" content="https://www.vitablue.es/productos/seguros-salud/seguros-sanitas" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gama Oficial de Seguros de Salud Sanitas | CatÃƒÂ¡logo VitaBlue" />
        <meta name="twitter:description" content="Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas." />
        <meta name="twitter:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      {/* Breadcrumbs Bar */}
      <div className="bg-slate-50/50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs 
            items={[
              { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
              { label: 'Seguros Sanitas', href: '/productos/seguros-salud/seguros-sanitas' }
            ]} 
          />
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-primary via-primary-dark to-slate-900 text-white text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            
            {/* Text Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#94D2BD]">
                  <Sparkles className="w-4 h-4" /> Especialistas en Sanitas
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 border border-accent/30 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-light">
                  Precios oficiales y promociones
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight tracking-tight">
                Toda la gama de Seguros Sanitas
              </h1>
              
              <p className="text-lg text-slate-200 leading-relaxed font-medium max-w-xl">
                Compara y filtra el catÃƒÂ¡logo oficial de pÃƒÂ³lizas de salud, mascotas y decesos de Sanitas. Consigue el precio oficial sin comisiones adicionales y con soporte humano real.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" variant="accent" onClick={handleStartQuoting} rightIcon={<ArrowRight size={18} />}>
                  Calcular mi tarifa online
                </Button>
                <a href="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20sobre%20los%20seguros%20de%20Sanitas." className="inline-flex items-center justify-center" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Hablar con un Asesor
                  </Button>
                </a>
              </div>
            </div>

            {/* Micro Stats Widget */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col gap-6 text-left">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 to-white/5 opacity-50" />
                <h3 className="text-lg font-display font-black text-[#94D2BD] z-10 border-b border-white/10 pb-3">Ã‚Â¿Por quÃƒÂ© contratar con nosotros?</h3>
                <div className="grid grid-cols-2 gap-4 z-10">
                  <div>
                    <span className="block text-2xl font-black text-white">0Ã¢â€šÂ¬</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">Recargos o comisiones</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">12</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">PÃƒÂ³lizas oficiales</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">4.9/5</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">ValoraciÃƒÂ³n media</span>
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-white">24h</span>
                    <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block mt-0.5">GestiÃƒÂ³n de alta</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">AsesorÃƒÂ­a de Seguros Autorizada</h4>
              <p className="text-xs text-text-secondary font-semibold">Precios oficiales garantizados sin recargo comercial.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Clock className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Alta RÃƒÂ¡pida en 24 Horas</h4>
              <p className="text-xs text-text-secondary font-semibold">GestiÃƒÂ³n rÃƒÂ¡pida del alta y cuestionario mÃƒÂ©dico digital.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <Award className="w-8 h-8 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-text-main">Soporte Continuo VitaBlue</h4>
              <p className="text-xs text-text-secondary font-semibold">Te ayudamos en la gestiÃƒÂ³n diaria y autorizaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Products with own subpage */}
      <section className="py-16 sm:py-20 bg-white text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">
          
          <div className="space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">ContrataciÃƒÂ³n Online Directa</span>
            <h2 className="text-3xl font-display font-black text-text-main leading-tight">
              Seguros de Sanitas con PÃƒÂ¡gina de Producto
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              PÃƒÂ³lizas de salud, mascotas y decesos destacadas con tarificador online, coberturas completas detalladas y contrataciÃƒÂ³n digital paso a paso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sanitasFeaturedProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-250 transition-all duration-300 relative overflow-hidden"
              >
                {product.badge && (
                  <span className="absolute top-0 right-0 bg-primary/10 text-primary-dark text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl border-l border-b border-primary/5">
                    {product.badge}
                  </span>
                )}
                
                <div className="space-y-4">
                  <div className="size-11 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                    <Activity className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-black text-text-main leading-tight">{product.title}</h3>
                    <p className="text-[10px] font-semibold text-text-secondary/70 uppercase tracking-wider mt-1">{product.tagline}</p>
                  </div>

                  <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                    {product.desc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-50">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-secondary/60 uppercase tracking-wider">Tarifa</span>
                    <span className="text-sm font-sans font-black text-text-main">{product.price}</span>
                  </div>

                  <Link to={product.link} className="shrink-0">
                    <Button variant="primary" size="sm" className="font-bold shadow-sm" rightIcon={<ArrowRight size={14} />}>
                      Ver detalles y cotizar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 2: Other Specific Insurances (WhatsApp Help) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-100 text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-10">
          
          <div className="space-y-3">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Asesoramiento y ContrataciÃƒÂ³n Personalizada</span>
            <h2 className="text-3xl font-display font-black text-text-main leading-tight">
              Otros Seguros y Coberturas Especiales
            </h2>
            <p className="text-sm text-text-secondary font-medium max-w-2xl leading-relaxed">
              Planes complementarios de Sanitas que requieren un anÃƒÂ¡lisis personalizado de preexistencias o condiciones fiscales. Solicita informaciÃƒÂ³n sin rodeos a nuestros asesores por WhatsApp.
            </p>
          </div>

          {/* WhatsApp Notice Box */}
          <div className="bg-white rounded-3xl border border-primary/15 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-grow">
              <h4 className="text-sm font-black text-text-main">Ã‚Â¿CÃƒÂ³mo contratar estas pÃƒÂ³lizas especializadas?</h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Al pulsar en <strong>Consultar por WhatsApp</strong>, nuestro equipo calcularÃƒÂ¡ tu prima oficial en menos de 2 minutos. Te resolveremos dudas de carencias, cuestionario de salud y realizaremos el alta digital de forma totalmente gratuita y sin spam comercial.
              </p>
            </div>
            <a href="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20para%20los%20seguros%20especiales%20de%20Sanitas." target="_blank" rel="noopener noreferrer" className="w-full md:w-auto shrink-0">
              <Button variant="accent" className="w-full md:w-auto font-bold shadow-md shadow-accent/10 whitespace-nowrap">
                Hablar con un asesor ahora
              </Button>
            </a>
          </div>

          {/* Bento Grid (WhatsApp CTAs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sanitasConsultProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300 relative overflow-hidden"
              >
                {product.badge && (
                  <span className="absolute top-0 right-0 bg-slate-100 text-text-secondary text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-bl-2xl border-l border-b border-slate-200">
                    {product.badge}
                  </span>
                )}
                
                <div className="space-y-4">
                  <div className="size-11 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-150">
                    {product.badge === 'Premium' ? (
                      <Sparkle className="w-5 h-5 text-primary" />
                    ) : (
                      <Layers className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-black text-text-main leading-tight">{product.title}</h3>
                    <p className="text-[10px] font-semibold text-text-secondary/70 uppercase tracking-wider mt-1">{product.tagline}</p>
                  </div>

                  <p className="text-xs text-text-secondary font-semibold leading-relaxed min-h-[50px]">
                    {product.desc}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-50">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-semibold text-text-secondary">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-text-secondary/60 uppercase tracking-wider">Tarifa</span>
                    <span className="text-sm font-sans font-black text-text-main">{product.price}</span>
                  </div>

                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-bold border-emerald-500 text-emerald-600 hover:bg-emerald-50/50"
                      leftIcon={<WhatsAppIcon size={14} className="fill-[#25D366]" />}
                    >
                      Consultar WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Onboarding Timeline Section */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Alta rÃƒÂ¡pida</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Proceso de contrataciÃƒÂ³n oficial
          </h2>
          <p className="text-body-reg text-text-secondary font-medium max-w-xl mx-auto">
            Emitimos tu pÃƒÂ³liza directamente en Sanitas de forma rÃƒÂ¡pida y 100% digital.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal dashed line connecting the steps (visible on desktop) */}
          <div className="absolute top-[48px] left-[12%] right-[12%] h-0.5 border-t border-dashed border-slate-200 z-0 hidden lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {[
              { 
                step: '01', 
                title: 'Selecciona tu pÃƒÂ³liza', 
                desc: 'Compara y elige el seguro mÃƒÂ©dico de Sanitas que mejor se adapte a tus necesidades y presupuesto.',
                icon: FileText
              },
              { 
                step: '02', 
                title: 'Completa tus datos', 
                desc: 'Introduce los datos de los asegurados y selecciona el mÃƒÂ©todo de pago (mensual o anual con descuento).',
                icon: CreditCard
              },
              { 
                step: '03', 
                title: 'Cuestionario de salud', 
                desc: 'Rellena el cuestionario mÃƒÂ©dico digital obligatorio de Sanitas desde un enlace privado seguro.',
                icon: Heart
              },
              { 
                step: '04', 
                title: 'Firma y disfruta', 
                desc: 'Recibe tu contrato por SMS para firma digital. Tu pÃƒÂ³liza quedarÃƒÂ¡ activa al instante y tus tarjetas en tu mÃƒÂ³vil.',
                icon: ShieldCheck
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-sans font-black text-primary/20">{item.step}</span>
                    <div className="size-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-text-main">{item.title}</h4>
                  <p className="text-xs text-text-secondary font-semibold leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-slate-50/50 border-y border-slate-100 w-full text-left">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Opiniones reales</span>
            <h2 className="text-h2 font-display font-black text-text-main">La experiencia de quienes ya confÃƒÂ­an en nosotros</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, idx) => (
              <TestimonialCard
                key={idx}
                author={item.author}
                meta={item.meta}
                comment={item.comment}
                stars={item.stars}
                avatarUrl={item.avatarUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section className="py-16 sm:py-20 w-full max-w-4xl mx-auto px-6 sm:px-8 text-left bg-white">
        <div className="text-center space-y-4 mb-12">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Dudas Frecuentes</span>
          <h2 className="text-h2 font-display font-extrabold text-text-main leading-tight tracking-tight">
            Preguntas Frecuentes sobre Seguros Sanitas
          </h2>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-inner divide-y divide-slate-200/60">
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              title={faq.q}
              defaultOpen={index === 0}
            >
              {faq.a}
            </Accordion>
          ))}
        </div>
      </section>

      {/* Human Advisor Help section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100 w-full">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8 text-left">
          <div className="space-y-1">
            <h3 className="text-2xl font-display font-extrabold text-text-main">Ã‚Â¿Necesitas asesorÃƒÂ­a personalizada?</h3>
            <p className="text-body-reg text-text-secondary font-medium">Te ayudamos a comparar las primas de las distintas compaÃƒÂ±ÃƒÂ­as de forma neutral para proteger a tu familia de la manera mÃƒÂ¡s econÃƒÂ³mica. Te asesoramos de forma gratuita.</p>
          </div>
          <AdvisorCard 
            onWhatsAppClick={() => window.open('https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20informaci%C3%B3n%20sobre%20los%20seguros%20de%20Sanitas.', '_blank')}
            onPhoneClick={() => window.open('tel:+34900839240')}
          />
        </div>
      </section>
    </div>
  );
};

export default SanitasInsurances;



