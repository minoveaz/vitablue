import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, ArrowRight, Check, HelpCircle, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
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
import { HealthIllustration, PetIllustration, TravelIllustration } from '@/components/illustrations';

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
          <p className="text-text-secondary text-sm">VisualizaciÃ³n de los Ã¡tomos de UI bÃ¡sicos con la OpciÃ³n de Color 3 (Poppins + Inter).</p>
        </div>
        <Link to="/" className="text-sm font-bold text-primary hover:underline">
          â† Volver a Inicio
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
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Variantes de Logo (RediseÃ±ado)</span>
              
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
                <span className="text-[10px] font-bold text-slate-400 uppercase">Variante Blanca MonocromÃ¡tica</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Mapeo de Colores (OpciÃ³n 3)</span>
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
            <Check className="w-5 h-5 text-accent" /> 2. Componentes de AcciÃ³n (Botones)
          </h2>
          
          <div className="flex flex-col gap-8">
            {/* Variants */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Variantes SemÃ¡nticas</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">BotÃ³n Primario</Button>
                <Button variant="accent">Cotizar Seguro (Accent)</Button>
                <Button variant="secondary">BotÃ³n Secundario</Button>
                <Button variant="outline">BotÃ³n Outline</Button>
                <Button variant="ghost">BotÃ³n Ghost</Button>
              </div>
            </div>

            {/* Sizes & Icons */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">TamaÃ±os e Iconos</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm" leftIcon={<Shield className="w-3.5 h-3.5" />}>TamaÃ±o PequeÃ±o</Button>
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>TamaÃ±o Mediano</Button>
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
                  Probar AnimaciÃ³n Carga
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
                label="Correo electrÃ³nico" 
                placeholder="johndoe@email.com" 
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <InputText 
                label="Campo con Error" 
                placeholder="Introduce valor correcto"
                error="Este formato de correo no es vÃ¡lido."
                leftIcon={<AlertCircle className="w-4 h-4" />}
              />
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Desplegables y SelecciÃ³n</span>
              <InputSelect 
                label="Nacionalidad del asegurado"
                placeholder="Selecciona paÃ­s..."
                options={[
                  { value: 'usa', label: 'Estados Unidos (USA)' },
                  { value: 'uk', label: 'Reino Unido (UK)' },
                  { value: 'colombia', label: 'Colombia' },
                  { value: 'mexico', label: 'MÃ©xico' },
                ]}
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
              />
              
              <div className="flex flex-col gap-4 mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Casillas de Consentimiento (Checkbox)</span>
                <Checkbox 
                  label="Acepto los tÃ©rminos legales y la polÃ­tica de privacidad." 
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <Checkbox 
                  label="Quiero recibir informaciÃ³n comercial de aseguradoras." 
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
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tags de estado y clasificaciÃ³n</span>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="primary">Visa Ready</Badge>
              <Badge variant="accent">MÃ¡s Popular</Badge>
              <Badge variant="success">Sin Copagos</Badge>
              <Badge variant="neutral">Opcional</Badge>
            </div>
          </div>
        </section>

        {/* Section 5: Molecules */}
        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-xl font-display font-extrabold text-primary mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" /> 5. MolÃ©culas (Componentes Compuestos)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cards Showcase */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjetas Estilo Bento (Card)</span>
              <Card>
                <h3 className="font-display font-bold text-lg text-text-main mb-2">Tarjeta EstÃ¡ndar</h3>
                <p className="text-sm text-text-secondary leading-relaxed">Este contenedor tiene bordes muy redondeados y una sombra sutil. Al pasar el ratÃ³n, se eleva ligeramente para incentivar el clic.</p>
              </Card>
            </div>

            {/* Accordion Showcase */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">AcordeÃ³n Desplegable (Accordion)</span>
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                <Accordion title="Â¿El seguro es vÃ¡lido para el visado de estudiantes?">
                  <p>SÃ­, todas las opciones que comparamos para estudiantes extranjeros incluyen repatriaciÃ³n sanitaria, no tienen copagos y cuentan con certificado de cobertura inmediato.</p>
                </Accordion>
                <Accordion title="Â¿CÃ³mo se realiza el pago de la pÃ³liza?">
                  <p>Puedes pagar de forma mensual o anual. Recuerda que el pago anual cuenta con un descuento del 4% en la prima del seguro.</p>
                </Accordion>
              </div>
            </div>
          </div>
          
          {/* FormField Composition & Breadcrumbs */}
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">ComposiciÃ³n de Formulario (FormField)</span>
              <div className="max-w-md">
                <FormField 
                  label="TelÃ©fono de contacto" 
                  description="Introduce tu nÃºmero con el prefijo internacional (ej: +34...)."
                >
                  <InputText placeholder="+34 600 000 000" />
                </FormField>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Rutas de NavegaciÃ³n (Breadcrumbs)</span>
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
            <Sparkles className="w-5 h-5 text-accent" /> 6. Componentes de ConversiÃ³n y Marketing
          </h2>
          
          <div className="flex flex-col gap-4 mb-10 w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Formulario Conversacional Integrado (ConversationalHero)</span>
            <ConversationalHero onSearch={(data) => alert(`Buscar seguro de ${data.insuranceType} para ${data.age} aÃ±os con nacionalidad ${data.nationality}`)} />
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
                  comment="El proceso fue super rÃ¡pido. ConseguÃ­ mi seguro de estudiante para el visado de EspaÃ±a en 10 minutos por WhatsApp."
                  author="Sarah Jenkins"
                  meta="Estudiante de EE.UU. en Madrid"
                />
                <TestimonialCard 
                  stars={5}
                  comment="Excelente atenciÃ³n. Me ayudaron a elegir la opciÃ³n sin copago mÃ¡s barata para mi residencia no lucrativa."
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
                <span className="text-[10px] font-bold text-text-secondary uppercase">Consulta MÃ©dica</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Calculadora de Reembolso MÃ©dico</span>
                  <ReimbursementCalculator onCtaClick={() => alert('Comparar seleccionados')} />
                </div>

                {/* Autocomplete & Drawer controls */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col gap-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Pruebas Auxiliares (Autocomplete / Drawer)</span>
                  
                  <Autocomplete 
                    label="Selector Inteligente de PaÃ­s (Autocomplete)"
                    placeholder="Escribe para buscar un paÃ­s..."
                    options={['EspaÃ±a', 'Estados Unidos', 'Reino Unido', 'Alemania', 'Francia', 'Colombia', 'MÃ©xico']}
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
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjeta de ComparaciÃ³n de Seguros (ProductCard - Adeslas Plena Total)</span>
              <ProductCard 
                name="Adeslas Plena Total"
                providerName="Adeslas"
                providerLogo="/images/logo-adeslas.svg"
                whyItFits="Para la residencia no lucrativa, ExtranjerÃ­a exige un seguro equivalente al pÃºblico. Adeslas es la opciÃ³n mÃ¡s segura por su aceptaciÃ³n garantizada en consulados y su red nacional."
                price="Desde 35â‚¬"
                pricePeriod="mes"
                ctaText="Contratar Online"
                ctaHref="/wizard"
                inclusions={[
                  'RepatriaciÃ³n sanitaria ilimitada',
                  'Urgencias 24h y hospitalizaciÃ³n',
                  'Sin copagos (todo incluido)',
                  'Certificado oficial para visado'
                ]}
                exclusions={[
                  'Tratamientos estÃ©ticos',
                  'Reembolso fuera de cuadro mÃ©dico',
                  'Carencia de 3 meses para cirugÃ­as'
                ]}
                highlights={['Visa Ready', 'Red MÃ©dica NÂº1', 'Sin Copagos']}
                isRecommended={true}
                onWhatsAppClick={() => alert('Abrir WhatsApp con mensaje pre-rellenado')}
              />
            </div>

            {/* Human Advisor Profile Card */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Tarjeta del Asesor Asignado (AdvisorCard - LucÃ­a Delgado)</span>
              <AdvisorCard 
                onWhatsAppClick={() => alert('Contacto WhatsApp con LucÃ­a')}
                onPhoneClick={() => alert('Llamando gratis al 900 839 240')}
              />
            </div>

            {/* Transparency Block Example */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/70">Bloque de Transparencia de Coberturas (TransparencyBlock)</span>
              <TransparencyBlock 
                title="Seguro para Visado de Estudiante Extranjero"
                description="Compara de forma neutral los requisitos del consulado y lo que cubren nuestras pÃ³lizas seleccionadas."
                inclusions={[
                  'RepatriaciÃ³n ilimitada al paÃ­s de origen por enfermedad o fallecimiento.',
                  'Sin copagos por acto mÃ©dico (cobertura mÃ©dica 100% gratuita al ir a consulta).',
                  'Sin periodos de carencia (cobertura activa desde el primer dÃ­a para visado).',
                  'Acceso completo a especialidades, hospitalizaciÃ³n y cirugÃ­as.'
                ]}
                exclusions={[
                  'Tratamientos dentales complejos (ortodoncia, implantes).',
                  'Enfermedades preexistentes no declaradas en el cuestionario de salud.',
                  'Tratamientos de cirugÃ­a plÃ¡stica o medicina estÃ©tica.'
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
          <p>Acceso ilimitado a medicina general, especialidades mÃ©dicas, pediatrÃ­a y urgencias sanitarias 24h sin ningÃºn tipo de copago por acto mÃ©dico.</p>
          <p className="text-text-main font-bold">2. RepatriaciÃ³n Sanitaria:</p>
          <p>GarantÃ­a de traslado sanitario urgente al paÃ­s de origen en caso de fallecimiento o enfermedad grave del asegurado extranjero, cumpliendo el 100% de los requisitos del visado de estudios o residencia.</p>
          <p className="text-text-main font-bold">3. Cuadro MÃ©dico:</p>
          <p>Acceso a mÃ¡s de 50.000 profesionales de la salud y 1.200 centros sanitarios concertados en toda EspaÃ±a.</p>
        </div>
      </Drawer>
    </div>
  );
};



export default Styleguide;
