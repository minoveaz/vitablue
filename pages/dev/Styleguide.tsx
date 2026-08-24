import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, ArrowRight, Check, HelpCircle, AlertCircle, Sparkles, MessageSquare, Phone, Copy, CheckCheck, ShieldCheck, Clock, Award } from 'lucide-react';
import Logo from '@/components/atoms/Logo';
import Button from '@/components/atoms/Button';
import InputText from '@/components/atoms/InputText';
import InputSelect from '@/components/atoms/InputSelect';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/molecules/Card';
import Accordion from '@/components/molecules/Accordion';
import FormField from '@/components/molecules/FormField';
import ProductPromoCard from '@/components/molecules/ProductPromoCard';
import TestimonialCard from '@/components/molecules/TestimonialCard';
import Breadcrumbs from '@/components/molecules/Breadcrumbs';
import InfiniteMarquee from '@/components/molecules/InfiniteMarquee';
import ReviewWall from '@/components/molecules/ReviewWall';
import ReimbursementCalculator from '@/components/molecules/ReimbursementCalculator';
import Autocomplete from '@/components/molecules/Autocomplete';
import Drawer from '@/components/molecules/Drawer';
import QuotationWizard from '@/components/organisms/QuotationWizard';
import ConversationalHero from '@/components/organisms/ConversationalHero';
import ProductCard from '@/components/molecules/ProductCard';
import TransparencyBlock from '@/components/molecules/TransparencyBlock';
import AdvisorCard from '@/components/molecules/AdvisorCard';
import ProductCategoryCard from '@/components/molecules/ProductCategoryCard';
import BlogHeader from '@/components/molecules/BlogHeader';
import BlogFilterBar from '@/components/molecules/BlogFilterBar';
import BlogPostCard from '@/components/molecules/BlogPostCard';
import ArticleHeader from '@/components/molecules/ArticleHeader';
import ArticleToc from '@/components/molecules/ArticleToc';
import BlogSectionRenderer from '@/components/molecules/BlogSectionRenderer';
import BlogAdvisorCta from '@/components/molecules/BlogAdvisorCta';
import { blogPosts } from '@/utils/blogData';
import TrustCardGrid from '@/components/molecules/TrustCardGrid';
import SectionIntro from '@/components/molecules/SectionIntro';
import ProcessSteps from '@/components/molecules/ProcessSteps';
import ContactChannelCard from '@/components/molecules/ContactChannelCard';
import CtaBanner from '@/components/molecules/CtaBanner';
import CoverageCard from '@/components/molecules/CoverageCard';
import InsuranceProductCard from '@/components/molecules/InsuranceProductCard';
import PlanCard from '@/components/molecules/PlanCard';
import PlanComparisonSection from '@/components/organisms/PlanComparisonSection';
import QuoteEstimator from '@/components/molecules/QuoteEstimator';
import BrandHero from '@/components/organisms/BrandHero';
import CoverageGrid from '@/components/organisms/CoverageGrid';
import ProductHero from '@/components/organisms/ProductHero';
import ProductBreadcrumbBar from '@/components/organisms/ProductBreadcrumbBar';
import RequirementsComparisonTable from '@/components/organisms/RequirementsComparisonTable';
import ProductTransparencySection from '@/components/organisms/ProductTransparencySection';
import ProductProcessSection from '@/components/organisms/ProductProcessSection';
import ProductRequirementsSection from '@/components/organisms/ProductRequirementsSection';
import ProductPromotionSection from '@/components/organisms/ProductPromotionSection';
import DigitalServicesSection from '@/components/organisms/DigitalServicesSection';
import TestimonialGrid from '@/components/organisms/TestimonialGrid';
import FaqSection from '@/components/organisms/FaqSection';
import SanitasTrustSection from '@/components/organisms/SanitasTrustSection';
import AdvisorHelpSection from '@/components/organisms/AdvisorHelpSection';
import ProductTrustBar from '@/components/organisms/ProductTrustBar';
import ProviderLogoBar from '@/components/organisms/ProviderLogoBar';
import IllustrationGallery from '@/components/organisms/IllustrationGallery';
import { CoverageIllustration, HealthIllustration, TravelIllustration, PiggyBankIllustration, SupportIllustration } from '@/components/illustrations';

interface ComponentReferenceProps {
  name: string;
  path: string;
}

const ComponentReference = ({ name, path }: ComponentReferenceProps) => {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">{name}</p>
        <code className="text-[11px] text-text-secondary">{path}</code>
      </div>
      <button
        type="button"
        onClick={copyPath}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 px-2.5 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label={`Copiar ruta de ${name}`}
        title="Copiar ruta del componente"
      >
        {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copiado' : 'Copiar ruta'}
      </button>
    </div>
  );
};

const Styleguide = () => {
  void [BlogHeader, BlogFilterBar, ArticleHeader, ArticleToc, BlogSectionRenderer, BlogAdvisorCta];
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
          → Volver a Inicio
        </Link>
      </div>

      <div className="flex flex-col gap-12">
        <div className="border-l-4 border-success-strong bg-success-strong/5 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-success-strong">Bloque 1</p>
          <h2 className="mt-1 text-2xl font-display font-extrabold text-primary">Componentes consolidados</h2>
          <p className="mt-2 text-sm text-text-secondary">Catálogo visual de todos los componentes reutilizables disponibles en VitaBlue.</p>
        </div>

        {/* Section 1: Logo & Colors */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 1. Logotipo y Tokens de Color
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-5 border-r border-slate-100 pr-6">
              <ComponentReference name="Logo" path="components/atoms/Logo.tsx" />
              
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
                <div className="bg-brand-cyan text-success-strong p-4 rounded-xl">
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
              <ComponentReference name="Button" path="components/atoms/Button.tsx" />
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
              <ComponentReference name="InputText" path="components/atoms/InputText.tsx" />
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
              <ComponentReference name="InputSelect" path="components/atoms/InputSelect.tsx" />
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
                <ComponentReference name="Checkbox" path="components/atoms/Checkbox.tsx" />
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
            <ComponentReference name="Badge" path="components/atoms/Badge.tsx" />
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
              <ComponentReference name="Card" path="components/molecules/Card.tsx" />
              <Card>
                <h3 className="font-display font-bold text-lg text-text-main mb-2">Tarjeta Estándar</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Este contenedor tiene bordes muy redondeados y una sombra sutil. Al pasar el ratón, se eleva ligeramente para incentivar el clic.</p>
              </Card>
            </div>

            {/* Accordion Showcase */}
            <div className="flex flex-col gap-4">
              <ComponentReference name="Accordion" path="components/molecules/Accordion.tsx" />
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
              <ComponentReference name="FormField" path="components/molecules/FormField.tsx" />
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
              <ComponentReference name="Breadcrumbs" path="components/molecules/Breadcrumbs.tsx" />
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
            <ComponentReference name="ConversationalHero" path="components/organisms/ConversationalHero.tsx" />
            <ConversationalHero onSearch={(data) => alert(`Buscar seguro de ${data.insuranceType} para ${data.age} años con nacionalidad ${data.nationality}`)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Promo Card Showcase */}
            <div className="flex flex-col gap-4 items-center lg:items-start">
              <ComponentReference name="ProductPromoCard" path="components/molecules/ProductPromoCard.tsx" />
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
              <ComponentReference name="TestimonialCard" path="components/molecules/TestimonialCard.tsx" />
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
            <ComponentReference name="ProductPromotionSection" path="components/organisms/ProductPromotionSection.tsx" />
            <ProductPromotionSection
              badges={[
                <span key="promotion" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Promoción Especial</span>,
                <span key="insured" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Nuevos Asegurados</span>
              ]}
              title="Blua Gratis para Siempre"
              description="Contrata ahora a través de VitaBlue y disfruta de medicina digital incluida para siempre."
            />
          </div>

          <div className="flex flex-col gap-4 mt-10 pt-10 border-t border-slate-100">
            <ComponentReference name="IllustrationGallery" path="components/organisms/IllustrationGallery.tsx" />
            <IllustrationGallery />
          </div>
        </section>

        {/* Section 7: VitaBlue reusable composition patterns */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 7. Patrones reutilizables VitaBlue
          </h2>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <ComponentReference name="BrandHero" path="components/organisms/BrandHero.tsx" />
              <BrandHero
                eyebrow="Asesoramiento independiente"
                title="Encuentra una opción clara para tu situación"
                description="Comparamos alternativas de salud, viaje y protección familiar para ayudarte a decidir con información sencilla y acompañamiento humano."
                action={{ label: 'Ver opciones', href: '/productos/seguros-salud' }}
              >
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-brand-cyan">
                  <CoverageIllustration />
                </div>
              </BrandHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="SectionIntro" path="components/molecules/SectionIntro.tsx" />
              <SectionIntro
                eyebrow="Cómo te ayudamos"
                title="Una explicación clara antes de contratar"
                description="Usa este patrón para presentar el contexto de una sección con jerarquía tipográfica consistente, tanto alineado a la izquierda como centrado."
                align="center"
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductCategoryCard" path="components/molecules/ProductCategoryCard.tsx" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductCategoryCard
                  title="Seguros de salud"
                  description="Cobertura médica amplia para atención privada, especialistas y pruebas diagnósticas sin esperas."
                  badge="Salud"
                  badgeColor="accent"
                  href="/productos/seguros-salud"
                  illustration={HealthIllustration}
                  detailsLabel="Ver detalle"
                />
                <ProductCategoryCard
                  title="Seguro médico internacional para estudiantes extranjeros"
                  description="Texto largo de prueba para comprobar que la tarjeta conserva su composición cuando el título y la descripción ocupan más líneas."
                  badge="Estudios"
                  badgeColor="secondary"
                  href="/wizard"
                  illustration={TravelIllustration}
                  detailsLabel="View details"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="TrustCardGrid" path="components/molecules/TrustCardGrid.tsx" />
              <TrustCardGrid
                items={[
                  { title: 'Te ayudamos a elegir', description: 'Comparamos opciones de varias compañías para que veas cuál encaja mejor contigo.', illustration: CoverageIllustration, tone: 'neutral' },
                  { title: 'Sin coste', description: 'El servicio no añade recargos al precio. Si contratas, la retribución viene de la aseguradora.', illustration: PiggyBankIllustration, tone: 'cyan' },
                  { title: 'Soporte humano', description: 'Si te atascas, un asesor real te ayuda por WhatsApp y te acompaña en el trámite.', illustration: SupportIllustration, tone: 'accent' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProcessSteps" path="components/molecules/ProcessSteps.tsx" />
              <ComponentReference name="ContactChannelCard" path="components/molecules/ContactChannelCard.tsx" />
              <ProcessSteps steps={['Cuéntanos tu perfil y necesidades', 'Comparamos las opciones disponibles', 'Te acompañamos hasta contratar']} />
              <ComponentReference name="ProductProcessSection" path="components/organisms/ProductProcessSection.tsx" />
              <ProductProcessSection
                eyebrow="Proceso"
                title="Contrata en tres pasos"
                description="Un recorrido breve y acompañado para elegir tu póliza."
                steps={['Cuéntanos tu perfil', 'Comparamos opciones', 'Te acompañamos hasta contratar']}
              />
              <ComponentReference name="ProductRequirementsSection" path="components/organisms/ProductRequirementsSection.tsx" />
              <ProductRequirementsSection
                eyebrow="Requisitos"
                title="Condiciones claras"
                description="Los puntos esenciales de una póliza adecuada."
                items={[{ label: 'Sin copagos inesperados' }, { label: 'Cobertura desde el primer día' }]}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContactChannelCard href="mailto:info@vitablue.es" icon={<Mail className="h-5 w-5" />} title="Email" description="info@vitablue.es" />
                <ContactChannelCard href="tel:+34694583452" icon={<Phone className="h-5 w-5" />} title="Teléfono" description="+34 694 58 34 52" />
                <ContactChannelCard href="https://wa.me/34694583452" icon={<MessageSquare className="h-5 w-5" />} title="WhatsApp" description="Habla con un asesor" external />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="CtaBanner" path="components/molecules/CtaBanner.tsx" />
              <CtaBanner
                title="¿Todavía tienes dudas?"
                description="Un asesor puede ayudarte a comparar sin compromiso y resolver la letra pequeña."
                action={{ label: 'Contactar', href: '/contacto' }}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="DigitalServicesSection" path="components/organisms/DigitalServicesSection.tsx" />
              <DigitalServicesSection
                eyebrow="Servicios digitales"
                title="Tu salud también puede estar en tu móvil"
                description="Una composición reutilizable para presentar servicios digitales junto a sus beneficios y una demostración visual específica del producto."
                benefits={['Videoconsulta médica', 'Receta electrónica', 'Seguimiento desde la app', 'Programas de bienestar']}
                visual={(
                  <div className="flex aspect-[9/12] w-full max-w-[180px] items-center justify-center rounded-[2rem] bg-primary p-5 text-center text-sm font-bold text-white shadow-xl">
                    Demo visual del servicio
                  </div>
                )}
              />
            </div>
          </div>
        </section>

        {/* Section 8: Interactive Advanced Components (Phase 5) */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 8. Componentes Avanzados e Interactivos (Fase 5)
          </h2>

          <div className="flex flex-col gap-10">
            {/* Infinite Marquee */}
            <div className="flex flex-col gap-4">
              <ComponentReference name="InfiniteMarquee" path="components/molecules/InfiniteMarquee.tsx" />
              <InfiniteMarquee />
            </div>

            {/* Quoter Wizard & Calculator side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Quotation Wizard */}
              <div className="flex flex-col gap-4 w-full">
                <ComponentReference name="QuotationWizard" path="components/organisms/QuotationWizard.tsx" />
                <QuotationWizard onComplete={(data) => console.log('Wizard submitted:', data)} />
              </div>

              {/* Calculator & Autocomplete/Drawer testing column */}
              <div className="flex flex-col gap-8 w-full">
                {/* Reimbursement Calculator */}
                <div className="flex flex-col gap-4">
                  <ComponentReference name="ReimbursementCalculator" path="components/molecules/ReimbursementCalculator.tsx" />
                  <ReimbursementCalculator onCtaClick={() => alert('Comparar seleccionados')} />
                </div>

                {/* Autocomplete & Drawer controls */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col gap-5">
                  <ComponentReference name="Autocomplete" path="components/molecules/Autocomplete.tsx" />
                  
                  <Autocomplete 
                    label="Selector Inteligente de País (Autocomplete)"
                    placeholder="Escribe para buscar un país..."
                    options={['España', 'Estados Unidos', 'Reino Unido', 'Alemania', 'Francia', 'Colombia', 'México']}
                    value={autocompleteVal}
                    onChange={(val) => setAutocompleteVal(val)}
                  />

                  <div className="pt-2 border-t border-slate-200/50">
                    <div className="mb-4">
                      <ComponentReference name="Drawer" path="components/molecules/Drawer.tsx" />
                    </div>
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
              <ComponentReference name="ReviewWall" path="components/molecules/ReviewWall.tsx" />
              <ReviewWall />
            </div>
          </div>
        </section>

        {/* Section 8: Trust & Transparency Components (Fase 2 - Core Logic Track) */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> 9. Confianza y Transparencia Radical (Fase 2)
          </h2>

          <div className="flex flex-col gap-8">
            {/* Product Card Example */}
            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductCard" path="components/molecules/ProductCard.tsx" />
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
              <ComponentReference name="AdvisorCard" path="components/molecules/AdvisorCard.tsx" />
              <AdvisorCard 
                onWhatsAppClick={() => alert('Contacto WhatsApp con Lucía')}
                onPhoneClick={() => alert('Llamando gratis al +34 694 58 34 52')}
              />
            </div>

            {/* Transparency Block Example */}
            <div className="flex flex-col gap-4">
              <ComponentReference name="TransparencyBlock" path="components/molecules/TransparencyBlock.tsx" />
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
              <ComponentReference name="ProductTransparencySection" path="components/organisms/ProductTransparencySection.tsx" />
              <ProductTransparencySection
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

            <div className="flex flex-col gap-4 md:col-span-2">
              <ComponentReference name="ProductTrustBar" path="components/organisms/ProductTrustBar.tsx" />
              <ProductTrustBar
                items={[
                  { icon: <ShieldCheck />, title: 'Homologación oficial', description: 'Pólizas autorizadas y revisadas.' },
                  { icon: <Clock />, title: 'Gestión en 24 horas', description: 'Recibe tu documentación rápidamente.' },
                  { icon: <Award />, title: 'Soporte continuo', description: 'Te acompañamos durante todo el proceso.' },
                ]}
              />
              <ComponentReference name="ProviderLogoBar" path="components/organisms/ProviderLogoBar.tsx" />
              <ProviderLogoBar
                eyebrow="Aseguradoras oficiales homologadas"
                providers={[
                  { name: 'Sanitas', logoSrc: '/images/logo-sanitas.svg' },
                  { name: 'Adeslas', logoSrc: '/images/logo-adeslas.svg' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Section 9: Pending reusable patterns */}
        <div className="border-l-4 border-accent bg-accent/10 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Bloque 2</p>
          <h2 className="mt-1 text-2xl font-display font-extrabold text-primary">Patrones pendientes de extracción</h2>
          <p className="mt-2 text-sm text-text-secondary">Composiciones repetidas en las páginas públicas que todavía necesitan convertirse en componentes propios.</p>
        </div>

        <section className="bg-white rounded-2xl border border-accent/25 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-8 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> 10. Patrones de páginas de producto
          </h2>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductHero" path="components/organisms/ProductHero.tsx" />
              <ProductHero
                badges={[
                  { label: 'Seguro médico para estudiantes', icon: <Shield className="h-4 w-4" /> },
                  { label: 'Visado garantizado', tone: 'accent' },
                ]}
                title="Encuentra una cobertura que cumple con tu visado"
                description="Una composición de producto con contexto, beneficios principales, doble acción y un panel de cálculo en el mismo recorrido."
                primaryAction={{ label: 'Calcular mi seguro', href: '/wizard' }}
                secondaryAction={{ label: 'Hablar con un asesor', href: 'tel:+34694583452' }}
                highlights={['Certificado en 24 horas', 'Repatriación incluida']}
              >
                <div className="flex flex-col gap-3">
                  <ComponentReference name="QuoteEstimator" path="components/molecules/QuoteEstimator.tsx" />
                  <QuoteEstimator
                    title="Estimador de Cuota"
                    options={[
                      { id: 'no-copay', label: 'Sin Copago' },
                      { id: 'low-copay', label: 'Copago Bajo' },
                      { id: 'progressive', label: 'Progresivo' },
                    ]}
                    initialOption="low-copay"
                    calculatePrice={(age, option) => {
                      if (age > 60) return 'Consultar';
                      if (option === 'no-copay') return age > 45 ? '59.90' : '39.20';
                      if (option === 'progressive') return age > 45 ? '37.90' : '24.10';
                      return age > 45 ? '46.20' : '29.50';
                    }}
                    onSubmit={() => alert('Iniciar contratación')}
                  />
                </div>
              </ProductHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductHero · Seguro de Vida" path="components/organisms/ProductHero.tsx" />
              <ProductHero
                badges={[
                  { label: 'Seguros de Vida', icon: <Shield className="h-4 w-4" /> },
                  { label: 'Apto para vinculación hipotecaria', tone: 'accent' },
                ]}
                title="Seguro de Vida Familiar"
                description="Asegura la tranquilidad y el futuro financiero de tus seres queridos. Cubre préstamos, hipotecas y garantiza la estabilidad familiar con cuotas mínimas mensuales."
                primaryAction={{ label: 'Calcular Seguro Online', href: '/wizard' }}
                secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
                highlights={['Sin reconocimientos médicos', 'Cobertura de invalidez']}
              >
                <QuoteEstimator
                  title="Tarificador de Vida"
                  description="Estima tu cuota según edad y capital asegurado."
                  options={[{ id: '100000', label: '100.000 €' }, { id: '150000', label: '150.000 €' }, { id: '250000', label: '250.000 €' }]}
                  initialOption="100000"
                  modalityLabel="Capital a asegurar"
                  calculatePrice={(age, option) => {
                    const capital = Number(option);
                    const factor = age > 55 ? 0.00085 : age > 45 ? 0.00038 : age > 30 ? 0.00018 : 0.00012;
                    return ((capital * factor) / 12).toFixed(2);
                  }}
                  onSubmit={() => alert('Iniciar contratación de seguro de vida')}
                />
              </ProductHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductHero · Asistencia Familiar" path="components/organisms/ProductHero.tsx" />
              <ProductHero
                badges={[
                  { label: 'Seguro de Decesos Familiar', icon: <Shield className="h-4 w-4" /> },
                  { label: 'Cobertura de traslado internacional', tone: 'accent' },
                ]}
                title="Asistencia Familiar Iplus"
                description="Protección y tranquilidad total para ti y los tuyos ante cualquier imprevisto. Nos encargamos de todos los trámites legales, sepelio y apoyo psicológico familiar."
                primaryAction={{ label: 'Calcular Cuota Familiar', href: '/wizard' }}
                secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
                highlights={['Testamento online gratis', 'Trámites de herencia']}
              >
                <QuoteEstimator
                  title="Tarificador de Decesos"
                  description="Estima tu prima según tu edad y estructura de pago."
                  initialAge={40}
                  maxAge={75}
                  options={[{ id: 'levelled', label: 'Nivelada' }, { id: 'mixed', label: 'Mixta' }, { id: 'natural', label: 'Natural' }]}
                  initialOption="mixed"
                  modalityLabel="Tipo de prima"
                  calculatePrice={(age, option) => {
                    const base = option === 'levelled' ? (age < 30 ? 11.5 : age < 50 ? 19.8 : 29.5) : option === 'natural' ? (age < 30 ? 3.9 : age < 50 ? 6.5 : 12.8) : (age < 30 ? 5.8 : age < 50 ? 9.9 : 18.5);
                    return base.toFixed(2);
                  }}
                  onSubmit={() => alert('Iniciar contratación de asistencia familiar')}
                />
              </ProductHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductHero · Seguro de Viaje" path="components/organisms/ProductHero.tsx" />
              <ProductHero
                badges={[
                  { label: 'Seguros de Viaje', icon: <Shield className="h-4 w-4" /> },
                  { label: 'Asistencia médica mundial 24h', tone: 'accent' },
                ]}
                title="Seguro de Viaje Internacional"
                description="Viaja protegido ante cualquier imprevisto de salud, equipaje o vuelos. Cobertura de gastos médicos internacionales de urgencia y repatriación con soporte continuo."
                primaryAction={{ label: 'Calcular Seguro Online', href: '/wizard' }}
                secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
                highlights={['Cobertura de equipaje', 'Opción de anulación']}
              >
                <QuoteEstimator
                  title="Tarificador de Viaje"
                  description="Estima la prima de tu seguro de viaje al instante."
                  options={[{ id: 'escapade', label: 'Escapada' }, { id: 'short', label: 'Viaje corto' }, { id: 'long', label: 'Larga estancia' }, { id: 'annual', label: 'Anual' }]}
                  initialOption="escapade"
                  modalityLabel="Duración del viaje"
                  ageLabel="Destino"
                  initialAge={1}
                  minAge={1}
                  maxAge={3}
                  calculatePrice={(_, option) => ({ escapade: '18.50', short: '32.20', long: '59.90', annual: '124.00' })[option] ?? 'Consultar'}
                  priceSuffix="€"
                  onSubmit={() => alert('Iniciar contratación de seguro de viaje')}
                />
              </ProductHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="ProductHero · Sanitas Mascotas" path="components/organisms/ProductHero.tsx" />
              <ProductHero
                badges={[
                  { label: 'Seguro Veterinario Oficial', icon: <Shield className="h-4 w-4" /> },
                  { label: 'Sin exclusión por raza', tone: 'accent' },
                ]}
                title="Sanitas Mascotas"
                description="Cuidado integral veterinario para tu perro o gato. Consultas gratis ilimitadas, vacuna de la rabia incluida y acceso a más de 400 centros de salud animal en España."
                primaryAction={{ label: 'Calcular Póliza Online', href: '/wizard' }}
                secondaryAction={{ label: 'Llamar Gratis', href: 'tel:+34694583452' }}
                highlights={['Limpieza dental anual gratis', 'Urgencias 24h']}
              >
                <QuoteEstimator
                  title="Tarificador de Mascota"
                  description="Calcula la cuota mensual aproximada de tu mascota."
                  ageLabel="Edad de la mascota"
                  initialAge={3}
                  minAge={1}
                  maxAge={9}
                  options={[{ id: 'basic', label: 'Básico' }, { id: 'complete', label: 'Completo' }, { id: 'reimbursement', label: 'Reembolso' }]}
                  initialOption="complete"
                  modalityLabel="Plan veterinario"
                  calculatePrice={(age, option) => {
                    const base = option === 'basic' ? 9.9 : option === 'reimbursement' ? 24.9 : 12.5 + (age > 5 ? 4.5 : 0);
                    return base.toFixed(2);
                  }}
                  onSubmit={() => alert('Iniciar contratación de Sanitas Mascotas')}
                />
              </ProductHero>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="CoverageCard" path="components/molecules/CoverageCard.tsx" />
              <div className="max-w-sm">
                <CoverageCard
                  title="Hospitalización completa"
                  description="Acceso a especialistas, pruebas y hospitalización en una red médica amplia."
                  illustration={HealthIllustration}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="CoverageGrid" path="components/organisms/CoverageGrid.tsx" />
              <CoverageGrid
                eyebrow="Coberturas principales"
                title="Todo lo que incluye tu póliza"
                description="Patrón reutilizable para mostrar las garantías principales de cada producto."
                items={[
                  { title: 'Hospitalización completa', description: 'Acceso a especialistas, pruebas y hospitalización en una red médica amplia.', illustration: HealthIllustration },
                  { title: 'Asistencia 24 horas', description: 'Atención urgente y soporte humano cuando más lo necesitas.', illustration: SupportIllustration },
                  { title: 'Repatriación sanitaria', description: 'Traslado médico incluido para cumplir los requisitos de tu situación.', illustration: TravelIllustration },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="TestimonialGrid" path="components/organisms/TestimonialGrid.tsx" />
              <TestimonialGrid
                eyebrow="Opiniones reales"
                title="La experiencia de quienes ya confían en nosotros"
                items={[
                  { author: 'María García', meta: 'Asegurada VitaBlue', comment: 'Un asesoramiento claro, rápido y muy humano.', stars: 5 },
                  { author: 'Carlos López', meta: 'Cliente desde 2024', comment: 'Encontré la póliza que necesitaba sin llamadas comerciales.', stars: 5 },
                  { author: 'Ana Martín', meta: 'Asegurada familiar', comment: 'Todo el proceso fue sencillo y transparente.', stars: 5 },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="PlanComparisonSection" path="components/organisms/PlanComparisonSection.tsx" />
              <PlanComparisonSection
                eyebrow="Modalidades"
                title="Compara tu protección"
                description="Tres alternativas para elegir con claridad."
                plans={[
                  { name: 'Seguro Básico', subtitle: 'Acceso esencial', desc: 'Cobertura médica para el día a día.', profile: 'Personas que buscan una cuota ajustada.', priceText: 'Consultar' },
                  { name: 'Seguro Completo', subtitle: 'Cobertura amplia', desc: 'Hospitalización y especialistas incluidos.', profile: 'Familias y uso frecuente.', priceText: 'Recomendado', isFeatured: true },
                  { name: 'Seguro Premium', subtitle: 'Máxima libertad', desc: 'Reembolso y elección de centros.', profile: 'Quienes priorizan flexibilidad.', priceText: 'Consultar' },
                ]}
              />
              <ComponentReference name="PlanCard" path="components/molecules/PlanCard.tsx" />
              <SectionIntro eyebrow="Modalidades" title="Elige cómo quieres estar protegido" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PlanCard title="Seguro sin copago" subtitle="Tarifa plana mensual" description="Cobertura total e ilimitada sin pagos adicionales al utilizar el seguro." profile="Familias y personas que usan especialistas con frecuencia." priceText="Tranquilidad total" illustration={HealthIllustration} />
                <PlanCard title="Seguro con copago" subtitle="Cuota reducida" description="Una cuota mensual menor con un pequeño coste por cada visita médica." profile="Personas que acuden al médico pocas veces al año." priceText="Ahorro a largo plazo" illustration={PiggyBankIllustration} />
                <PlanCard title="Seguro de reembolso" subtitle="Libertad de elección" description="Elige cualquier médico o centro y recupera parte del gasto elegible." profile="Quienes priorizan la libertad de médicos y centros." priceText="Consultar" illustration={CoverageIllustration} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="InsuranceProductCard" path="components/molecules/InsuranceProductCard.tsx" />
              <div className="grid max-w-2xl gap-4 md:grid-cols-2">
                <InsuranceProductCard
                  title="Sanitas Más Salud"
                  tagline="Cobertura médica completa"
                  description="Hospitalización, especialistas y servicios digitales en una póliza completa."
                  features={['Hospitalización incluida', 'Blua Digital']}
                  price="Desde 35€/mes"
                  badge="Más vendido"
                  link="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud"
                />
                <InsuranceProductCard
                  title="Sanitas Profesionales"
                  tagline="Protección para autónomos"
                  description="Cobertura especializada con asesoramiento personalizado de VitaBlue."
                  features={['Red médica nacional', 'Asesoramiento humano']}
                  price="Consultar"
                  badge="Premium"
                  link="https://wa.me/34694583452"
                  external
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="FaqSection" path="components/organisms/FaqSection.tsx" />
              <FaqSection
                eyebrow="Preguntas frecuentes"
                title="Resolvemos tus dudas antes de contratar"
                items={[
                  { question: '¿El seguro cumple los requisitos de mi visado?', answer: 'Sí. Mostramos las condiciones relevantes de cada póliza para que puedas comprobar copagos, carencias, hospitalización y repatriación.' },
                  { question: '¿Puedo recibir ayuda antes de decidir?', answer: 'Sí, un asesor puede resolver tus dudas sin compromiso.' },
                  { question: '¿Cuándo recibiré la documentación?', answer: 'La documentación se envía en formato digital después de completar la contratación.' },
                ]}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="SanitasTrustSection" path="components/organisms/SanitasTrustSection.tsx" />
              <SanitasTrustSection />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="AdvisorHelpSection" path="components/organisms/AdvisorHelpSection.tsx" />
              <AdvisorHelpSection
                title="¿Necesitas ayuda para elegir tu seguro?"
                description="Nuestros asesores te orientan de forma gratuita y sin compromiso."
                whatsappUrl="https://wa.me/34694583452?text=Hola%20VitaBlue"
              />
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="TestimonialsSection (candidato)" path="components/organisms/TestimonialsSection.tsx (por extraer)" />
              <SectionIntro eyebrow="Experiencias reales" title="Personas que ya han encontrado su opción" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TestimonialCard stars={5} comment="Me explicaron todas las diferencias y pude contratar sin llamadas comerciales." author="Mariana Silva" meta="Estudiante en Madrid" />
                <TestimonialCard stars={5} comment="El certificado llegó rápido y el acompañamiento por WhatsApp fue excelente." author="Carlos Mendoza" meta="Residente en Barcelona" />
                <TestimonialCard stars={5} comment="Compararon varias alternativas y me ayudaron a elegir con calma." author="Laura Fernández" meta="Nómada digital" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="AdvisorCard" path="components/molecules/AdvisorCard.tsx" />
              <SectionIntro eyebrow="Acompañamiento humano" title="No tienes que decidirlo a solas" />
              <AdvisorCard onWhatsAppClick={() => alert('Contacto WhatsApp')} onPhoneClick={() => alert('Llamada')} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-accent/25 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-8 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" /> 9. Patrones institucionales, contacto y contenido
          </h2>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <ComponentReference name="ContactChannelsGrid (candidato)" path="components/organisms/ContactChannelsGrid.tsx (por extraer)" />
              <SectionIntro eyebrow="Contacto" title="Estamos aquí para ayudarte" description="Canales directos para resolver dudas sobre coberturas, documentación y contratación." />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContactChannelCard href="mailto:info@vitablue.es" icon={<Mail className="h-5 w-5" />} title="Email" description="info@vitablue.es" />
                <ContactChannelCard href="tel:+34694583452" icon={<Phone className="h-5 w-5" />} title="Teléfono" description="+34 694 58 34 52" />
                <ContactChannelCard href="https://wa.me/34694583452" icon={<MessageSquare className="h-5 w-5" />} title="WhatsApp" description="Habla con un asesor" external />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="BlogPostCard" path="components/molecules/BlogPostCard.tsx" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{blogPosts.filter((post) => post.lang !== 'en').slice(0, 3).map((post) => <BlogPostCard key={post.slug} post={post} />)}</div>
            </div>

            <div className="flex flex-col gap-4">
              <ComponentReference name="LegalDocumentPage (candidato)" path="components/layouts/LegalDocumentPage.tsx (por extraer)" />
              <div className="max-w-3xl rounded-[2rem] border border-slate-200/60 bg-slate-50/50 p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 text-primary">
                  <Shield className="h-7 w-7" />
                  <h3 className="text-2xl font-display font-black text-text-main">Política de Privacidad</h3>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-text-secondary">Última actualización: 27 de Julio de 2026</p>
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-text-secondary">
                  <h4 className="font-display font-bold text-text-main">1. Responsable del Tratamiento</h4>
                  <p>El responsable del tratamiento de tus datos personales es VitaBlue.</p>
                  <h4 className="font-display font-bold text-text-main">2. Derechos del usuario</h4>
                  <p>Puedes acceder, rectificar o solicitar la supresión de tus datos personales.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-12 flex flex-col gap-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-display font-extrabold text-primary">Organismos de producto</h2>
        <div className="flex flex-col gap-4">
          <ComponentReference name="ProductBreadcrumbBar" path="components/organisms/ProductBreadcrumbBar.tsx" />
          <ProductBreadcrumbBar items={[{ label: 'Seguros de Salud', href: '/productos/seguros-salud' }, { label: 'Ejemplo de producto' }]} />
        </div>
        <div className="flex flex-col gap-4">
          <ComponentReference name="RequirementsComparisonTable" path="components/organisms/RequirementsComparisonTable.tsx" />
          <RequirementsComparisonTable
            tableClassName="bg-white text-sm text-text-secondary"
            headClassName="bg-slate-50 text-xs font-black uppercase text-text-main"
            bodyClassName="divide-y divide-slate-100"
            columns={[{ key: 'requirement', label: 'Requisito', className: 'p-4' }, { key: 'status', label: 'Estado', className: 'p-4' }]}
            rows={[{ key: 'coverage', cells: [<span className="p-4 font-bold text-text-main">Sin copagos</span>, <span className="p-4 text-success-strong">Incluido</span>] }]}
          />
        </div>
      </section>

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



export default Styleguide;
