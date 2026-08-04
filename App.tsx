import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  Mail, 
  Shield, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  AlertCircle, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

// Import UI atoms
import Logo from '@/components/atoms/Logo';
import Button from '@/components/atoms/Button';
import InputText from '@/components/atoms/InputText';
import InputSelect from '@/components/atoms/InputSelect';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';

// Import organisms
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import CookieBanner from '@/components/organisms/CookieBanner';

// Import molecules
import Card from '@/components/molecules/Card';
import Accordion from '@/components/molecules/Accordion';
import FormField from '@/components/molecules/FormField';
import ProductPromoCard from '@/components/molecules/ProductPromoCard';
import TestimonialCard from '@/components/molecules/TestimonialCard';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';

// Import organisms & layout
import FloatingWhatsApp from '@/components/organisms/FloatingWhatsApp';
import ConversationalHero from '@/components/organisms/ConversationalHero';
import ProtectedRoute from '@/components/organisms/ProtectedRoute';

// Import illustrations copied from Marketing-Studio
import { HealthIllustration, PetIllustration, TravelIllustration } from '@/components/illustrations';

// Import Phase 5 components
import InfiniteMarquee from '@/components/molecules/InfiniteMarquee';
import ReviewWall from '@/components/molecules/ReviewWall';
import ReimbursementCalculator from '@/components/molecules/ReimbursementCalculator';
import Autocomplete from '@/components/molecules/Autocomplete';
import Drawer from '@/components/molecules/Drawer';
import QuotationWizard from '@/components/organisms/QuotationWizard';

// Import trust & transparency components
import ProductCard from '@/components/molecules/ProductCard';
import TransparencyBlock from '@/components/molecules/TransparencyBlock';
import AdvisorCard from '@/components/molecules/AdvisorCard';

// Import new page views (Phase 3 & 4)
const Home = lazy(() => import('@/pages/Home'));
const Wizard = lazy(() => import('@/pages/Wizard'));
const Results = lazy(() => import('@/pages/Results'));
const StudentInsurance = lazy(() => import('@/pages/StudentInsurance'));
const SanitasMasSalud = lazy(() => import('@/pages/SanitasMasSalud'));
const SanitasMascotas = lazy(() => import('@/pages/SanitasMascotas'));
const AsistenciaFamiliar = lazy(() => import('@/pages/AsistenciaFamiliar'));
const HealthInsurance = lazy(() => import('@/pages/HealthInsurance'));
const ExpatInsurance = lazy(() => import('@/pages/ExpatInsurance'));
const NomadInsurance = lazy(() => import('@/pages/NomadInsurance'));
const ForeignerInsurance = lazy(() => import('@/pages/ForeignerInsurance'));
const TravelInsurance = lazy(() => import('@/pages/TravelInsurance'));
const LifeInsurance = lazy(() => import('@/pages/LifeInsurance'));
const SanitasInsurances = lazy(() => import('@/pages/SanitasInsurances'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const CookiesPolicy = lazy(() => import('@/pages/CookiesPolicy'));
const LegalNotice = lazy(() => import('@/pages/AvisoLegal'));
const BlogList = lazy(() => import('@/pages/BlogList'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const MarketingStudio = lazy(() => import('@/marketing-studio/MarketingStudio'));
const MarketingLogin = lazy(() => import('@/pages/MarketingLogin'));
const BackofficeHome = lazy(() => import('@/pages/BackofficeHome'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);

    const isLocalOnlyPath = pathname === '/styleguide'
      || pathname.startsWith('/styleguide/')
      || pathname === '/login'
      || pathname.startsWith('/backoffice')
      || pathname === '/marketing-studio'
      || pathname.startsWith('/marketing-studio/');

    const analyticsWindow = window as unknown as Window & Record<string, boolean>;
    analyticsWindow['ga-disable-G-DCGH16NP2Q'] = isLocalOnlyPath;
    analyticsWindow['ga-disable-AW-515585712'] = isLocalOnlyPath;
  }, [pathname]);
  return null;
};

// Styleguide/Playground view for visual auditing
const Styleguide = () => {
  const [inputTextVal, setInputTextVal] = useState('');
  const [selectVal, setSelectVal] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  
  // Phase 5 local states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autocompleteVal, setAutocompleteVal] = useState('');

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-12">
      <div className="border-b border-slate-200 pb-6 mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-primary mb-2">Manual de Estilos & Componentes</h1>
          <p className="text-text-secondary text-sm">Visualización de los átomos de UI básicos con la Opción de Color 3 (Poppins + Inter).</p>
        </div>
        <Link to="/" className="text-sm font-bold text-primary hover:underline">
          ← Volver a Inicio
        </Link>
      </div>

      <div className="flex flex-col gap-12">
        {/* Section 1: Logo & Colors */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 1. Logotipo y Tokens de Color
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-5 border-r border-slate-100 pr-6">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Variantes de Logo (Rediseñado)</span>
              
              {/* Horizontal layout */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Horizontal (Defecto)</span>
                <Logo iconSize={38} variant="default" orientation="horizontal" />
              </div>

              {/* Vertical layout */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Vertical</span>
                <Logo iconSize={48} variant="default" orientation="vertical" className="bg-slate-50 p-3 rounded-2xl border border-slate-100 max-w-[120px]" />
              </div>

              {/* White on Dark variant */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Variante Blanca Monocromática</span>
                <div className="bg-primary-dark p-4 rounded-xl flex justify-center">
                  <Logo iconSize={36} variant="white" orientation="horizontal" />
                </div>
              </div>

              {/* Colored on Dark variant */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Variante Color sobre Fondo Oscuro (Recomendado)</span>
                <div className="bg-primary-dark p-4 rounded-xl flex justify-center">
                  <Logo iconSize={38} variant="colored-on-dark" orientation="horizontal" />
                </div>
              </div>

              {/* Icon Only */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Icono Solo</span>
                <Logo iconSize={42} showText={false} variant="default" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Mapeo de Colores (Opción 3)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-bold">
                <div className="bg-primary text-white p-4 rounded-xl">
                  Ocean Blue<br />#005F73
                </div>
                <div className="bg-primary-dark text-white p-4 rounded-xl">
                  Midnight<br />#001219
                </div>
                <div className="bg-accent text-background-dark p-4 rounded-xl">
                  Amber Gold<br />#EE9B00
                </div>
                <div className="bg-[#94D2BD] text-[#0f766e] p-4 rounded-xl">
                  Mint Green<br />#94D2BD
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Buttons */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" /> 2. Componentes de Acción (Botones)
          </h2>
          
          <div className="flex flex-col gap-8">
            {/* Variants */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Variantes Semánticas</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Botón Primario</Button>
                <Button variant="accent">Cotizar Seguro (Accent)</Button>
                <Button variant="secondary">Botón Secundario</Button>
                <Button variant="outline">Botón Outline</Button>
                <Button variant="ghost">Botón Ghost</Button>
              </div>
            </div>

            {/* Sizes & Icons */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tamaños e Iconos</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm" leftIcon={<Shield className="w-3.5 h-3.5" />}>Tamaño Pequeño</Button>
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>Tamaño Mediano</Button>
                <Button size="lg" variant="accent" rightIcon={<MessageSquare className="w-5 h-5" />}>WhatsApp Grande</Button>
              </div>
            </div>

            {/* State Management */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Control de Estado (Carga y Deshabilitado)</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button 
                  onClick={() => {
                    setIsBtnLoading(true);
                    setTimeout(() => setIsBtnLoading(false), 2000);
                  }}
                  isLoading={isBtnLoading}
                >
                  Probar Animación Carga
                </Button>
                <Button variant="accent" isLoading>Cargando Accent...</Button>
                <Button disabled>Deshabilitado</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Forms Inputs */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5 text-accent" /> 3. Inputs de Formulario y Campos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Campos de Texto</span>
              <InputText 
                label="Nombre completo" 
                placeholder="Ej: John Doe" 
                value={inputTextVal}
                onChange={(e) => setInputTextVal(e.target.value)}
              />
              <InputText 
                label="Correo electrónico" 
                placeholder="johndoe@email.com" 
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <InputText 
                label="Campo con Error" 
                placeholder="Introduce valor correcto"
                error="Este formato de correo no es válido."
                leftIcon={<AlertCircle className="w-4 h-4" />}
              />
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Desplegables y Selección</span>
              <InputSelect 
                label="Nacionalidad del asegurado"
                placeholder="Selecciona país..."
                options={[
                  { value: 'usa', label: 'Estados Unidos (USA)' },
                  { value: 'uk', label: 'Reino Unido (UK)' },
                  { value: 'colombia', label: 'Colombia' },
                  { value: 'mexico', label: 'México' },
                ]}
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
              />
              
              <div className="flex flex-col gap-4 mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Casillas de Consentimiento (Checkbox)</span>
                <Checkbox 
                  label="Acepto los términos legales y la política de privacidad." 
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Checkbox 
                  label="Quiero recibir información comercial de aseguradoras." 
                  error="Debes aceptar el aviso para continuar."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Badges */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" /> 4. Badges / Etiquetas
          </h2>
          
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tags de estado y clasificación</span>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="primary">Visa Ready</Badge>
              <Badge variant="accent">Más Popular</Badge>
              <Badge variant="success">Sin Copagos</Badge>
              <Badge variant="neutral">Opcional</Badge>
            </div>
          </div>
        </section>

        {/* Section 5: Molecules */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" /> 5. Moléculas (Componentes Compuestos)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cards Showcase */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjetas Estilo Bento (Card)</span>
              <Card>
                <h3 className="font-display font-bold text-lg text-text-main mb-2">Tarjeta Estándar</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Este contenedor tiene bordes muy redondeados y una sombra sutil. Al pasar el ratón, se eleva ligeramente para incentivar el clic.</p>
              </Card>
            </div>

            {/* Accordion Showcase */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Acordeón Desplegable (Accordion)</span>
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                <Accordion title="¿El seguro es válido para el visado de estudiantes?">
                  <p>Sí, todas las opciones que comparamos para estudiantes extranjeros incluyen repatriación sanitaria, no tienen copagos y cuentan con certificado de cobertura inmediato.</p>
                </Accordion>
                <Accordion title="¿Cómo se realiza el pago de la póliza?">
                  <p>Puedes pagar de forma mensual o anual. Recuerda que el pago anual cuenta con un descuento del 4% en la prima del seguro.</p>
                </Accordion>
              </div>
            </div>
          </div>
          
          {/* FormField Composition & Breadcrumbs */}
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Composición de Formulario (FormField)</span>
              <div className="max-w-md">
                <FormField 
                  label="Teléfono de contacto" 
                  description="Introduce tu número con el prefijo internacional (ej: +34...)."
                >
                  <InputText placeholder="+34 600 000 000" />
                </FormField>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Rutas de Navegación (Breadcrumbs)</span>
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex items-center min-h-[80px]">
                <Breadcrumbs 
                  items={[
                    { label: 'Productos', href: '/#productos' },
                    { label: 'Estudiantes Extranjeros' }
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Marketing, Testimonials & Mockups */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 6. Componentes de Conversión y Marketing
          </h2>
          
          <div className="flex flex-col gap-4 mb-10 w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Formulario Conversacional Integrado (ConversationalHero)</span>
            <ConversationalHero onSearch={(data) => alert(`Buscar seguro de ${data.insuranceType} para ${data.age} años con nacionalidad ${data.nationality}`)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Promo Card Showcase */}
            <div className="flex flex-col gap-4 items-center lg:items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjeta de Producto Destacado (ProductPromoCard)</span>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 sm:p-8 w-full flex justify-center items-center relative overflow-hidden">
                {/* Mockup Floating Background Bubbles (exactly matching legacy image background) */}
                <div className="absolute -top-6 -right-6 size-36 rounded-full bg-[#005F73]/5 pointer-events-none"></div>
                <div className="absolute -bottom-8 -left-8 size-44 rounded-full bg-[#94D2BD]/10 pointer-events-none"></div>
                <div className="absolute top-1/3 left-6 size-20 rounded-full bg-[#005F73]/5 pointer-events-none"></div>
                <div className="absolute bottom-1/3 right-10 size-24 rounded-full bg-[#94D2BD]/8 pointer-events-none"></div>
                
                <ProductPromoCard 
                  provider="Sanitas"
                  productName="International Students"
                  badgeText="24/7 ASISTENCIA"
                  onPlusClick={() => alert('Plus clicked')}
                  onCheckClick={() => alert('Check clicked')}
                  onArrowClick={() => alert('Arrow clicked')}
                />
              </div>
            </div>

            {/* Testimonials Showcase */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjetas de Testimonios / Opiniones (TestimonialCard)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TestimonialCard 
                  stars={5}
                  comment="El proceso fue super rápido. Conseguí mi seguro de estudiante para el visado de España en 10 minutos por WhatsApp."
                  author="Sarah Jenkins"
                  meta="Estudiante de EE.UU. en Madrid"
                />
                <TestimonialCard 
                  stars={5}
                  comment="Excelente atención. Me ayudaron a elegir la opción sin copago más barata para mi residencia no lucrativa."
                  author="Chen Wei"
                  meta="Expatriado de China en Barcelona"
                />
              </div>
            </div>
          </div>

          {/* Illustrations Showcase */}
          <div className="flex flex-col gap-4 mt-10 pt-10 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Ilustraciones Vectoriales Adaptativas (Source: Marketing-Studio)</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="w-24 h-20 text-primary">
                  <HealthIllustration />
                </div>
                <span className="text-[10px] font-bold text-text-secondary uppercase">Consulta Médica</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="w-24 h-20 text-primary">
                  <PetIllustration />
                </div>
                <span className="text-[10px] font-bold text-text-secondary uppercase">Mascotas</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="w-24 h-20 text-primary">
                  <TravelIllustration />
                </div>
                <span className="text-[10px] font-bold text-text-secondary uppercase">Viajes & Asistencia</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Interactive Advanced Components (Phase 5) */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 7. Componentes Avanzados e Interactivos (Fase 5)
          </h2>

          <div className="flex flex-col gap-10">
            {/* Infinite Marquee */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Carrusel Infinito de Aseguradoras (InfiniteMarquee)</span>
              <InfiniteMarquee />
            </div>

            {/* Quoter Wizard & Calculator side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Quotation Wizard */}
              <div className="flex flex-col gap-4 w-full">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Cotizador Interactivo Completo (QuotationWizard)</span>
                <QuotationWizard onComplete={(data) => console.log('Wizard submitted:', data)} />
              </div>

              {/* Calculator & Autocomplete/Drawer testing column */}
              <div className="flex flex-col gap-8 w-full">
                {/* Reimbursement Calculator */}
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Calculadora de Reembolso Médico</span>
                  <ReimbursementCalculator onCtaClick={() => alert('Comparar seleccionados')} />
                </div>

                {/* Autocomplete & Drawer controls */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col gap-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Pruebas Auxiliares (Autocomplete / Drawer)</span>
                  
                  <Autocomplete 
                    label="Selector Inteligente de País (Autocomplete)"
                    placeholder="Escribe para buscar un país..."
                    options={['España', 'Estados Unidos', 'Reino Unido', 'Alemania', 'Francia', 'Colombia', 'México']}
                    value={autocompleteVal}
                    onChange={(val) => setAutocompleteVal(val)}
                  />

                  <div className="pt-2 border-t border-slate-200/50">
                    <Button 
                      variant="primary" 
                      onClick={() => setIsDrawerOpen(true)}
                      className="w-full"
                    >
                      Ver Coberturas Detalladas (Abrir Drawer)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Review Wall */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Muro Infinito de Testimonios Verticales (ReviewWall)</span>
              <ReviewWall />
            </div>
          </div>
        </section>

        {/* Section 8: Trust & Transparency Components (Fase 2 - Core Logic Track) */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> 8. Confianza y Transparencia Radical (Fase 2)
          </h2>

          <div className="flex flex-col gap-8">
            {/* Product Card Example */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjeta de Comparación de Seguros (ProductCard - Adeslas Plena Total)</span>
              <ProductCard 
                name="Adeslas Plena Total"
                providerName="Adeslas"
                providerLogo="/images/logo-adeslas.svg"
                whyItFits="Para la residencia no lucrativa, Extranjería exige un seguro equivalente al público. Adeslas es la opción más segura por su aceptación garantizada en consulados y su red nacional."
                price="Desde 35€"
                pricePeriod="mes"
                ctaText="Contratar Online"
                ctaHref="/wizard"
                inclusions={[
                  'Repatriación sanitaria ilimitada',
                  'Urgencias 24h y hospitalización',
                  'Sin copagos (todo incluido)',
                  'Certificado oficial para visado'
                ]}
                exclusions={[
                  'Tratamientos estéticos',
                  'Reembolso fuera de cuadro médico',
                  'Carencia de 3 meses para cirugías'
                ]}
                highlights={['Visa Ready', 'Red Médica Nº1', 'Sin Copagos']}
                isRecommended={true}
                onWhatsAppClick={() => alert('Abrir WhatsApp con mensaje pre-rellenado')}
              />
            </div>

            {/* Human Advisor Profile Card */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjeta del Asesor Asignado (AdvisorCard - Lucía Delgado)</span>
              <AdvisorCard 
                onWhatsAppClick={() => alert('Contacto WhatsApp con Lucía')}
                onPhoneClick={() => alert('Llamando gratis al 900 839 240')}
              />
            </div>

            {/* Transparency Block Example */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Bloque de Transparencia de Coberturas (TransparencyBlock)</span>
              <TransparencyBlock 
                title="Seguro para Visado de Estudiante Extranjero"
                description="Compara de forma neutral los requisitos del consulado y lo que cubren nuestras pólizas seleccionadas."
                inclusions={[
                  'Repatriación ilimitada al país de origen por enfermedad o fallecimiento.',
                  'Sin copagos por acto médico (cobertura médica 100% gratuita al ir a consulta).',
                  'Sin periodos de carencia (cobertura activa desde el primer día para visado).',
                  'Acceso completo a especialidades, hospitalización y cirugías.'
                ]}
                exclusions={[
                  'Tratamientos dentales complejos (ortodoncia, implantes).',
                  'Enfermedades preexistentes no declaradas en el cuestionario de salud.',
                  'Tratamientos de cirugía plástica o medicina estética.'
                ]}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Slide-out Drawer Component test */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Condiciones de Cobertura Sanitas Completa"
        footer={
          <div className="flex justify-end">
            <Button variant="primary" onClick={() => setIsDrawerOpen(false)}>Entendido</Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs font-semibold text-text-secondary">
          <p className="text-text-main font-bold">1. Cobertura Sanitaria Completa:</p>
          <p>Acceso ilimitado a medicina general, especialidades médicas, pediatría y urgencias sanitarias 24h sin ningún tipo de copago por acto médico.</p>
          <p className="text-text-main font-bold">2. Repatriación Sanitaria:</p>
          <p>Garantía de traslado sanitario urgente al país de origen en caso de fallecimiento o enfermedad grave del asegurado extranjero, cumpliendo el 100% de los requisitos del visado de estudios o residencia.</p>
          <p className="text-text-main font-bold">3. Cuadro Médico:</p>
          <p>Acceso a más de 50.000 profesionales de la salud y 1.200 centros sanitarios concertados en toda España.</p>
        </div>
      </Drawer>
    </div>
  );
};

// App Views Setup

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isPrivateArea = pathname === '/login'
    || pathname.startsWith('/backoffice')
    || pathname.startsWith('/marketing-studio');

  return (
    <div className="flex flex-col min-h-screen bg-background-light text-text-main font-sans">
      {!isPrivateArea && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-background-light"></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<Home />} />
            {import.meta.env.DEV && <Route path="/styleguide" element={<Styleguide />} />}
            <Route path="/login" element={<MarketingLogin />} />
            <Route path="/marketing-studio/login" element={<Navigate to="/login" replace />} />
            <Route path="/backoffice" element={<ProtectedRoute><BackofficeHome /></ProtectedRoute>} />
            <Route path="/marketing-studio" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/identidad-de-marca" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/perfiles-sociales" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/campanas" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/campanas/:campaignId" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/conexiones" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            <Route path="/marketing-studio/generador-contenido" element={<ProtectedRoute><MarketingStudio /></ProtectedRoute>} />
            {/* Seguros de Salud - Nueva Estructura Jerárquica */}
            <Route path="/productos/seguros-salud" element={<HealthInsurance />} />
            <Route path="/productos/seguros-salud/seguro-medico-estudiantes" element={<StudentInsurance />} />
            <Route path="/en/health-insurance-student-visa-spain" element={<StudentInsurance />} />
            <Route path="/productos/seguros-salud/seguro-expatriados" element={<ExpatInsurance />} />
            <Route path="/en/health-insurance-expatriates-spain" element={<ExpatInsurance />} />
            <Route path="/productos/seguros-salud/seguro-nomadas-digitales" element={<NomadInsurance />} />
            <Route path="/en/digital-nomad-insurance-spain" element={<NomadInsurance />} />
            <Route path="/productos/seguros-salud/seguro-salud-extranjeros" element={<ForeignerInsurance />} />
            
            {/* Sub-silo: Seguros de Salud de Sanitas */}
            <Route path="/productos/seguros-salud/seguros-sanitas" element={<SanitasInsurances />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud" element={<SanitasMasSalud />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/international-students" element={<StudentInsurance />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud.html" element={<SanitasMasSalud />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mascotas.html" element={<SanitasMascotas />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/asistencia-familiar-iplus.html" element={<AsistenciaFamiliar />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/seguro-medico-estudiantes-extranjeros-espana.html" element={<StudentInsurance />} />

            {/* Seguro de Mascotas (Silo Independiente) */}
            <Route path="/productos/seguro-mascotas/sanitas-mascotas" element={<SanitasMascotas />} />

            {/* Seguro de Decesos (Silo Independiente) */}
            <Route path="/productos/seguro-para-decesos/asistencia-familiar" element={<AsistenciaFamiliar />} />

            {/* Seguro de Viaje (Silo Independiente) */}
            <Route path="/productos/seguro-viaje" element={<TravelInsurance />} />

            {/* Seguro de Vida (Silo Independiente) */}
            <Route path="/productos/seguro-vida" element={<LifeInsurance />} />

            {/* Redirecciones y URLs de Compatibilidad (Legacy) */}
            <Route path="/productos/seguros-salud/sanitas-mas-salud" element={<SanitasMasSalud />} />
            <Route path="/productos/seguro-medico-estudiantes-extranjeros-espana.html" element={<StudentInsurance />} />
            <Route path="/productos/international-students.html" element={<StudentInsurance />} />
            <Route path="/seguros-salud" element={<HealthInsurance />} />
            <Route path="/productos/seguro-de-salud.html" element={<HealthInsurance />} />
            <Route path="/seguro-expatriados" element={<ExpatInsurance />} />
            <Route path="/productos/seguro-medico-expatriados.html" element={<ExpatInsurance />} />
            <Route path="/seguro-nomadas" element={<NomadInsurance />} />
            <Route path="/productos/seguro-nomadas-digitales.html" element={<NomadInsurance />} />
            <Route path="/productos/sanitas-mas-salud.html" element={<SanitasMasSalud />} />
            <Route path="/productos/sanitas-mascotas.html" element={<SanitasMascotas />} />
            <Route path="/productos/asistencia-familiar-iplus.html" element={<AsistenciaFamiliar />} />
            <Route path="/politica-privacidad" element={<Privacy />} />
            <Route path="/politica-cookies" element={<CookiesPolicy />} />
            <Route path="/privacidad.html" element={<Privacy />} />
            <Route path="/politica-cookies.html" element={<CookiesPolicy />} />
            <Route path="/cotizador.html" element={<Wizard />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/aviso-legal" element={<LegalNotice />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/resultados" element={<Results />} />
            
            {/* Blog */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/en/blog" element={<BlogList />} />
            <Route path="/en/blog/:slug" element={<BlogPost />} />
            
            {/* Fallbacks */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Volver a inicio</Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      {!isPrivateArea && (
        <>
          <Footer />
          <CookieBanner />
          <FloatingWhatsApp />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
