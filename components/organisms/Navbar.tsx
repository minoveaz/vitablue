import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, Phone, ChevronRight, ChevronDown, BookOpen, Shield, GraduationCap, Globe2, Laptop, Star, PawPrint, House } from 'lucide-react';
import Logo from '@/components/atoms/Logo';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import { navbarTranslations } from '@/utils/translations';
import { getNavbarWhatsAppUrl } from '@/utils/whatsappLinks';

// Custom Premium SVG Illustrations (VitaBlue Style)
const LegacySaludGeneralIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-health)" />
    <path d="M20 8C14 10 12 12 12 17V23C12 28 17 31 20 32C23 31 28 28 28 23V17C28 12 26 10 20 8Z" fill="url(#sg-grad)" opacity="0.12" />
    <path d="M20 8C14 10 12 12 12 17V23C12 28 17 31 20 32C23 31 28 28 28 23V17C28 12 26 10 20 8Z" stroke="url(#sg-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 20H17L18.5 14L20.5 25L22 18.5H26" stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="sg-grad" x1="12" y1="8" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--illustration-cyan)" />
        <stop offset="100%" stopColor="var(--color-primary)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacyEstudiantesIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-student)" />
    <path d="M20 10L10 15L20 20L30 15L20 10Z" fill="url(#est-grad)" opacity="0.2" />
    <path d="M20 10L10 15L20 20L30 15L20 10Z" stroke="url(#est-grad)" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 17.5V22.5C14 24.5 16.7 26 20 26C23.3 26 26 24.5 26 22.5V17.5" stroke="url(#est-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="29" cy="23" r="2" fill="var(--illustration-cyan)" />
    <path d="M29 23V18" stroke="var(--illustration-cyan)" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="est-grad" x1="10" y1="10" x2="30" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--color-pastel)" />
        <stop offset="100%" stopColor="var(--illustration-cyan)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacyExpatriadosIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-expat)" />
    <circle cx="20" cy="20" r="9" fill="url(#exp-grad)" opacity="0.12" />
    <circle cx="20" cy="20" r="9" stroke="url(#exp-grad)" strokeWidth="2" />
    <path d="M11 20H29" stroke="url(#exp-grad)" strokeWidth="1.5" />
    <path d="M20 11C22.2 13.5 23 16.5 23 20C23 23.5 22.2 26.5 20 29" stroke="url(#exp-grad)" strokeWidth="1.5" />
    <path d="M20 11C17.8 13.5 17 16.5 17 20C17 23.5 17.8 26.5 20 29" stroke="url(#exp-grad)" strokeWidth="1.5" />
    <path d="M24 13.5L26 11.5M26 11.5H23M26 11.5V14.5" stroke="var(--illustration-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="exp-grad" x1="11" y1="11" x2="29" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--illustration-cyan)" />
        <stop offset="100%" stopColor="var(--illustration-cyan-light)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacyNomadasIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-nomad)" />
    <rect x="13" y="14" width="14" height="9" rx="1.5" stroke="url(#nom-grad)" strokeWidth="2" />
    <path d="M10 25H30" stroke="url(#nom-grad)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M17 10C18.2 10.8 19 12 19 12" stroke="var(--color-pastel)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M23 10C21.8 10.8 21 12 21 12" stroke="var(--color-pastel)" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="nom-grad" x1="10" y1="12" x2="30" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--color-pastel)" />
        <stop offset="100%" stopColor="var(--color-primary)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacySanitasIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-expat)" />
    <path d="M20 9L23 14H29L25 18L27.5 24L22 22L20 26L18 22L12.5 24L15 18L11 14H17L20 9Z" fill="url(#san-grad)" opacity="0.15" />
    <path d="M20 9L23 14H29L25 18L27.5 24L22 22L20 26L18 22L12.5 24L15 18L11 14H17L20 9Z" stroke="url(#san-grad)" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="20" cy="18" r="1.5" fill="var(--illustration-blue)" />
    <defs>
      <linearGradient id="san-grad" x1="11" y1="9" x2="29" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--illustration-cyan)" />
        <stop offset="100%" stopColor="var(--illustration-blue)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacyMascotasIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-pet)" />
    {/* Metacarpal pad: typical three-lobed bottom shape */}
    <path 
      d="M20 19C16 19 13.5 21.5 13.5 24.5C13.5 27.2 15 28.5 17.5 28.5C18.8 28.5 19.5 27.8 20 27.8C20.5 27.8 21.2 28.5 22.5 28.5C25 28.5 26.5 27.2 26.5 24.5C26.5 21.5 24 19 20 19Z" 
      fill="url(#masc-grad)" 
      opacity="0.15" 
    />
    <path 
      d="M20 19C16 19 13.5 21.5 13.5 24.5C13.5 27.2 15 28.5 17.5 28.5C18.8 28.5 19.5 27.8 20 27.8C20.5 27.8 21.2 28.5 22.5 28.5C25 28.5 26.5 27.2 26.5 24.5C26.5 21.5 24 19 20 19Z" 
      stroke="url(#masc-grad)" 
      strokeWidth="2" 
      strokeLinejoin="round" 
    />
    {/* Four toes - arranged in a tight natural arc */}
    <circle cx="12" cy="19.5" r="2.2" fill="url(#masc-grad)" />
    <circle cx="16.5" cy="14" r="2.5" fill="url(#masc-grad)" />
    <circle cx="23.5" cy="14" r="2.5" fill="url(#masc-grad)" />
    <circle cx="28" cy="19.5" r="2.2" fill="url(#masc-grad)" />
    <defs>
      <linearGradient id="masc-grad" x1="12" y1="11" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--illustration-coral)" />
        <stop offset="100%" stopColor="var(--illustration-red)" />
      </linearGradient>
    </defs>
  </svg>
);

const LegacyFamiliarIcon: React.FC = () => (
  <svg className="w-10 h-10 shrink-0 product-menu-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="var(--illustration-surface-family)" />
    <path d="M12 21V28C12 29.1 12.9 30 14 30H26C27.1 30 28 29.1 28 28V21" stroke="url(#fam-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 21L20 13L30 21" stroke="url(#fam-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 25.5C19.5 25.5 18.5 24.5 18.5 23.5C18.5 22.7 19.1 22 19.8 22C20.2 22 20.5 22.2 20.5 22.2C20.5 22.2 20.8 22 21.2 22C21.9 22 22.5 22.7 22.5 23.5C22.5 24.5 21.5 25.5 20 25.5Z" fill="url(#fam-grad)" />
    <defs>
      <linearGradient id="fam-grad" x1="10" y1="13" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="var(--illustration-cyan)" />
        <stop offset="100%" stopColor="var(--illustration-indigo)" />
      </linearGradient>
    </defs>
  </svg>
);

void LegacySaludGeneralIcon;
void LegacyEstudiantesIcon;
void LegacyExpatriadosIcon;
void LegacyNomadasIcon;
void LegacySanitasIcon;
void LegacyMascotasIcon;
void LegacyFamiliarIcon;

type ProductIconProps = { icon: React.ElementType; surface: string };

const ProductIcon: React.FC<ProductIconProps> = ({ icon: Icon, surface }) => (
  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${surface}`}>
    <Icon className="size-5 text-primary" strokeWidth={2.2} aria-hidden="true" />
  </span>
);

const SaludGeneralIcon = () => <ProductIcon icon={Shield} surface="bg-illustration-surface-health" />;
const EstudiantesIcon = () => <ProductIcon icon={GraduationCap} surface="bg-illustration-surface-student" />;
const ExpatriadosIcon = () => <ProductIcon icon={Globe2} surface="bg-illustration-surface-expat" />;
const NomadasIcon = () => <ProductIcon icon={Laptop} surface="bg-illustration-surface-nomad" />;
const SanitasIcon = () => <ProductIcon icon={Star} surface="bg-illustration-surface-expat" />;
const MascotasIcon = () => <ProductIcon icon={PawPrint} surface="bg-illustration-surface-pet" />;
const FamiliarIcon = () => <ProductIcon icon={House} surface="bg-illustration-surface-family" />;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const location = useLocation();

  const isEnglish = location.pathname.startsWith('/en');
  const lang = isEnglish ? 'en' : 'es';
  const t = navbarTranslations[lang];
  const navbarWhatsAppUrl = getNavbarWhatsAppUrl(isEnglish ? 'en' : 'es', location.pathname);

  const getLanguageTogglePath = () => {
    const path = location.pathname;
    
    // Mapping dictionary for ES -> EN and EN -> ES
    const routeMap: Record<string, string> = {
      '/': '/en/',
      '/en/': '/',
      '/sobre-nosotros/': '/en/about-us/',
      '/en/about-us/': '/sobre-nosotros/',
      '/contacto/': '/en/contact/',
      '/en/contact/': '/contacto/',
      '/productos/seguros-salud/': '/productos/seguros-salud/',
      '/productos/seguros-salud/seguro-medico-estudiantes/': '/en/health-insurance-student-visa-spain/',
      '/productos/seguros-salud/seguros-sanitas/international-students/': '/en/health-insurance-student-visa-spain/',
      '/productos/seguros-salud/seguro-expatriados/': '/en/health-insurance-expatriates-spain/',
      '/productos/seguros-salud/seguro-nomadas-digitales/': '/en/digital-nomad-insurance-spain/',
      '/blog/': '/en/blog/',
      
      '/en/health-insurance-student-visa-spain/': '/productos/seguros-salud/seguro-medico-estudiantes/',
      '/en/health-insurance-expatriates-spain/': '/productos/seguros-salud/seguro-expatriados/',
      '/en/digital-nomad-insurance-spain/': '/productos/seguros-salud/seguro-nomadas-digitales/',
      '/en/blog/': '/blog/',
    };

    const normalizedPath = path.endsWith('/') ? path : `${path}/`;

    if (routeMap[normalizedPath]) {
      return routeMap[normalizedPath];
    }

    const blogPostMap: Record<string, string> = {
      'requisitos-seguro-medico-visado-estudiante-espana': 'student-visa-spain-health-insurance-requirements',
      'student-visa-spain-health-insurance-requirements': 'requisitos-seguro-medico-visado-estudiante-espana',
      'seguro-medico-residencia-no-lucrativa-espana': 'health-insurance-spain-non-lucrative-visa-requirements',
      'health-insurance-spain-non-lucrative-visa-requirements': 'seguro-medico-residencia-no-lucrativa-espana'
    };

    if (path.startsWith('/en/blog/')) {
      const slug = path.replace('/en/blog/', '').replace(/\/$/, '');
      const alt = blogPostMap[slug];
      return alt ? `/blog/${alt}/` : '/blog/';
    }

    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '').replace(/\/$/, '');
      const alt = blogPostMap[slug];
      return alt ? `/en/blog/${alt}/` : '/en/blog/';
    }

    return path.startsWith('/en') ? '/' : '/en/';
  };

  // Detect scroll to style the header dynamically
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setIsMobileProductsOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  return (
    <>
      <header 
        className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/60 shadow-md shadow-slate-900/5 py-3' 
            : 'bg-white border-b border-slate-100 py-4'
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Logo & Agent Badge */}
          <div className="flex items-center gap-3 z-[110]">
            <Link to={isEnglish ? "/en/" : "/"} aria-label="VitaBlue - Ir al inicio">
              <Logo iconSize={38} showTagline={false} />
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-100/60 px-2.5 py-1 text-[9px] font-black text-sky-800 uppercase tracking-wider select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{t.agentBadge}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" role="navigation">
            {/* Link 1: Productos Dropdown */}
            <div className="relative group">
              <button className="font-sans text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-1.5 py-2 cursor-pointer focus:outline-none">
                <span>{t.products}</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-text-secondary/70 group-hover:text-primary" />
              </button>
              
              {/* Dropdown Menu Container */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[92vw] max-w-5xl sm:w-[760px] bg-white border border-slate-200/80 rounded-3xl shadow-xl p-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-[120] grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                {/* Column 1: Seguros de Salud */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] border-b border-slate-50 pb-2">
                    {isEnglish ? 'Health Insurance' : 'Seguros de Salud'}
                  </h4>
                  <div className="flex flex-col gap-3.5">
                    <Link to="/productos/seguros-salud/" className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <SaludGeneralIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'General Health' : 'Salud General'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Coverage with and without copays' : 'Coberturas con y sin copagos'}
                        </span>
                      </div>
                    </Link>
                    
                    <Link to={isEnglish ? "/en/health-insurance-student-visa-spain/" : "/productos/seguros-salud/seguro-medico-estudiantes/"} className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <EstudiantesIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'International Students' : 'Estudiantes Extranjeros'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Mandatory for Spanish visa' : 'Obligatorio para visados españoles'}
                        </span>
                      </div>
                    </Link>

                    <Link to={isEnglish ? "/en/health-insurance-expatriates-spain/" : "/productos/seguros-salud/seguro-expatriados/"} className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <ExpatriadosIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Expats & Residents' : 'Expatriados y Residentes'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Policies for consular procedures' : 'Pólizas para trámites consulares'}
                        </span>
                      </div>
                    </Link>

                    <Link to={isEnglish ? "/en/digital-nomad-insurance-spain/" : "/productos/seguros-salud/seguro-nomadas-digitales/"} className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <NomadasIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Digital Nomads' : 'Nómadas Digitales'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Flexible cover in Spain' : 'Asistencia flexible en España'}
                        </span>
                      </div>
                    </Link>

                  </div>
                </div>

                {/* Column 2: Seguros de Viaje */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] border-b border-slate-50 pb-2">
                    {isEnglish ? 'Travel Insurance' : 'Seguros de Viaje'}
                  </h4>
                  <div className="flex flex-col gap-3.5">
                    <Link to="/productos/seguro-viaje/" className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <Globe2 className="mt-0.5 size-10 shrink-0 rounded-xl bg-brand-cyan/20 p-2 text-primary" />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Travel Insurance' : 'Seguro de Viaje'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Medical assistance and repatriation' : 'Asistencia médica y repatriación'}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Otros Ramos */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.25em] border-b border-slate-50 pb-2">
                    {isEnglish ? 'Specialties' : 'Especialidades'}
                  </h4>
                  <div className="flex flex-col gap-3.5">
                    <Link to="/productos/seguros-salud/seguros-sanitas/" className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <SanitasIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Sanitas Insurances' : 'Seguros Sanitas'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Access the full official range' : 'Accede a toda la gama oficial'}
                        </span>
                      </div>
                    </Link>

                    <Link to="/productos/seguro-mascotas/sanitas-mascotas/" className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <MascotasIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Pet Insurance' : 'Seguro de Mascotas'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Veterinary clinics and consults' : 'Clínicas veterinarias y consultas'}
                        </span>
                      </div>
                    </Link>

                    <Link to="/productos/seguro-para-decesos/asistencia-familiar/" className="group/item flex items-start gap-3 rounded-xl p-1.5 hover:bg-slate-50 transition-colors">
                      <FamiliarIcon />
                      <div>
                        <p className="text-xs font-black text-text-main group-hover/item:text-primary transition-colors leading-none">
                          {isEnglish ? 'Family Assistance' : 'Asistencia Familiar'}
                        </p>
                        <span className="text-[10px] font-semibold text-text-secondary/80 mt-1 block leading-tight">
                          {isEnglish ? 'Funeral cover and protection' : 'Seguro de decesos y protección'}
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Link 2: Sobre Nosotros */}
            <Link to={isEnglish ? "/en/about-us/" : "/sobre-nosotros/"} className="font-sans text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200">
              {t.aboutUs}
            </Link>

            {/* Link 3: Blog */}
            <Link to={isEnglish ? "/en/blog/" : "/blog/"} className="font-sans text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200">
              {t.blog}
            </Link>

            {/* Link 4: Contacto */}
            <Link to={isEnglish ? "/en/contact/" : "/contacto/"} className="font-sans text-sm font-bold text-text-secondary hover:text-primary transition-colors duration-200">
              {t.contact}
            </Link>

            {/* Language Switcher Desktop */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 text-[10px] font-black tracking-wider select-none">
              <Link 
                to={isEnglish ? getLanguageTogglePath() : '#'}
                className={`flex items-center gap-1 py-1 px-2 rounded-lg transition-all ${!isEnglish ? 'bg-primary/10 text-primary font-black border border-primary/25' : 'text-text-secondary hover:text-primary'}`}
              >
                <span>ES</span>
              </Link>
              <span className="text-slate-300">|</span>
              <Link 
                to={!isEnglish ? getLanguageTogglePath() : '#'}
                className={`flex items-center gap-1 py-1 px-2 rounded-lg transition-all ${isEnglish ? 'bg-primary/10 text-primary font-black border border-primary/25' : 'text-text-secondary hover:text-primary'}`}
              >
                <span>EN</span>
              </Link>
            </div>
          </nav>

          {/* Desktop & Tablet CTA Call Button */}
          <div className="hidden sm:flex items-center gap-4 z-[110]">
            <a 
              href={navbarWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp"
              onClick={() => {
                if (window.dataLayer) {
                  window.dataLayer.push({ event: 'click_whatsapp', location: 'navbar_desktop' });
                }
              }}
              className="inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] bg-whatsapp-dark hover:bg-whatsapp text-white shadow-sm shadow-whatsapp/10 text-xs px-3.5 py-2 gap-1.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20 cursor-pointer"
            >
              <WhatsAppIcon size={16} />
              <span>{t.whatsappCta}</span>
            </a>
          </div>

          {/* Mobile Menu Toggler */}
          <button 
            className="flex sm:hidden p-2.5 rounded-xl bg-slate-50 text-text-main hover:bg-slate-100 transition-colors z-[110]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] bg-white sm:hidden flex flex-col justify-between overflow-y-auto animate-fadeIn">
          {/* Top Header of Drawer */}
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <Logo iconSize={38} showTagline={false} />
              
              <div className="flex items-center gap-4">
                {/* Mobile Language Switcher */}
                <div className="flex items-center gap-1.5 text-[10px] font-black tracking-wider select-none">
                  <Link 
                    to={isEnglish ? getLanguageTogglePath() : '#'}
                    className={`flex items-center gap-1 py-1 px-2 rounded-lg ${!isEnglish ? 'bg-primary/10 text-primary border border-primary/25' : 'text-text-secondary'}`}
                  >
                    <span>ES</span>
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link 
                    to={!isEnglish ? getLanguageTogglePath() : '#'}
                    className={`flex items-center gap-1 py-1 px-2 rounded-lg ${isEnglish ? 'bg-primary/10 text-primary border border-primary/25' : 'text-text-secondary'}`}
                  >
                    <span>EN</span>
                  </Link>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-50 text-text-main hover:bg-slate-100 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation list in Sanitas style: full-width rows with borders */}
            <nav className="flex flex-col" role="navigation">
              {/* Product link with Collapsible Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="w-full flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-primary shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="text-base font-black text-text-main tracking-tight">
                      {t.products}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-text-secondary/40 shrink-0 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                
                {/* Collapsible Submenu */}
                {isMobileProductsOpen && (
                  <div className="bg-slate-50/50 border-b border-slate-100 flex flex-col">
                    <Link to="/productos/seguros-salud/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <SaludGeneralIcon />
                        <span>{isEnglish ? 'General Health' : 'Salud General'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to={isEnglish ? "/en/health-insurance-student-visa-spain/" : "/productos/seguros-salud/seguros-sanitas/international-students/"} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <EstudiantesIcon />
                        <span>{isEnglish ? 'International Students' : 'Estudiantes Extranjeros'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to={isEnglish ? "/en/health-insurance-expatriates-spain/" : "/productos/seguros-salud/seguro-expatriados/"} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <ExpatriadosIcon />
                        <span>{isEnglish ? 'Expats & Residents' : 'Expatriados y Residentes'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to="/productos/seguros-salud/seguro-nomadas-digitales/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <NomadasIcon />
                        <span>{isEnglish ? 'Digital Nomads' : 'Nómadas Digitales'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <div className="border-b border-slate-100/60 px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                      {isEnglish ? 'Travel Insurance' : 'Seguros de Viaje'}
                    </div>
                    <Link to="/productos/seguro-viaje/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <Globe2 className="size-10 rounded-xl bg-brand-cyan/20 p-2 text-primary" />
                        <span>{isEnglish ? 'Travel Insurance' : 'Seguro de Viaje'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to="/productos/seguros-salud/seguros-sanitas/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <SanitasIcon />
                        <span>{isEnglish ? 'Sanitas Insurances' : 'Seguros Sanitas'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to="/productos/seguro-mascotas/sanitas-mascotas/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 border-b border-slate-100/60 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <MascotasIcon />
                        <span>{isEnglish ? 'Pet Insurance' : 'Seguro de Mascotas'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                    <Link to="/productos/seguro-para-decesos/asistencia-familiar/" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-6 py-4 hover:bg-slate-100 text-left text-sm font-bold text-text-main">
                      <div className="flex items-center gap-3">
                        <FamiliarIcon />
                        <span>{isEnglish ? 'Family Assistance' : 'Asistencia Familiar'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-secondary/30" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Link 2: Sobre Nosotros */}
              <Link
                to={isEnglish ? "/en/about-us/" : "/sobre-nosotros/"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-base font-black text-text-main tracking-tight">
                    {t.aboutUs}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary/40 shrink-0" />
              </Link>

              {/* Link 3: Blog */}
              <Link
                to={isEnglish ? "/en/blog/" : "/blog/"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-base font-black text-text-main tracking-tight">
                    {t.blog}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary/40 shrink-0" />
              </Link>

              {/* Link 4: Contacto */}
              <Link
                to={isEnglish ? "/en/contact/" : "/contacto/"}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-base font-black text-text-main tracking-tight">
                    {t.contact}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary/40 shrink-0" />
              </Link>
            </nav>
          </div>

          {/* Bottom Human Advisor Box: Padded at the bottom of full viewport */}
          <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden border-2 border-primary/20 p-0.5 bg-gradient-to-tr from-primary to-brand-cyan">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120" 
                    alt="Lucía Delgado" 
                    className="w-full h-full object-cover rounded-full bg-white" 
                  />
                </div>
                <span className="absolute bottom-0 right-0 size-3.5 rounded-full bg-whatsapp border-2 border-white shadow-sm animate-pulse" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-black text-text-main leading-tight">Lucía Delgado</p>
                <p className="text-[9px] font-bold text-text-secondary/80 uppercase tracking-widest leading-none">Asesora Senior de Salud</p>
                <p className="text-xs font-semibold text-text-secondary mt-1 leading-normal italic">
                  "Hola, te ayudo con tus dudas de visado o coberturas sin compromiso."
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href={navbarWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp"
                onClick={() => {
                  setIsOpen(false);
                  if (window.dataLayer) {
                    window.dataLayer.push({ event: 'click_whatsapp', location: 'navbar_mobile' });
                  }
                }}
                className="w-full flex h-12 items-center justify-center gap-2.5 rounded-xl bg-whatsapp-dark hover:bg-whatsapp text-white text-sm font-bold shadow-md shadow-whatsapp/20 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20"
              >
                <WhatsAppIcon size={18} />
                Preguntar por WhatsApp
              </a>
              
              <a 
                href="tel:+34694583452"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                <button className="w-full flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-text-main hover:bg-slate-50 text-sm font-bold transition-all duration-200 active:scale-[0.98]">
                  <Phone size={16} />
                  Llamar Gratis
                </button>
              </a>
            </div>
            
            <div className="text-center">
              <span className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest leading-none">
                +34 694 58 34 52
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
