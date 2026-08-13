import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, Shield } from 'lucide-react';
import Logo from '@/components/atoms/Logo';
import { getSocialProfiles, socialProfilesUpdatedEvent, SocialProfiles } from '@/utils/socialProfiles';

// Social Icon SVGs
const FacebookIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TiktokIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YoutubeIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" fill="currentColor" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  const location = useLocation();
  const isEnglish = location.pathname.startsWith('/en');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfiles>(getSocialProfiles);

  useEffect(() => {
    const handleProfilesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SocialProfiles>;
      setSocialProfiles(customEvent.detail ?? getSocialProfiles());
    };

    window.addEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);
    return () => window.removeEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);
  }, []);

  return (
    <footer className="bg-primary-dark text-white border-t border-slate-900 pt-16 pb-8">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8">
        
        {/* Top bar: Logo & Social Media Icons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 border-b border-slate-800">
          <div className="flex flex-col gap-2">
            <Logo iconSize={44} variant="colored-on-dark" showTagline={false} />
            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
              Comparador independiente de seguros
            </p>
          </div>
          
          {/* Social Networks Row */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mr-1">Síguenos</span>
            
            <a 
              href={socialProfiles.facebook.url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="Facebook"
              aria-label="Ir a nuestro perfil de Facebook"
            >
              <FacebookIcon />
            </a>
            <a 
              href={socialProfiles.instagram.url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="Instagram"
              aria-label="Ir a nuestro perfil de Instagram"
            >
              <InstagramIcon />
            </a>
            <a 
              href={socialProfiles.linkedin.url || '#'} 
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="LinkedIn"
              aria-label="Ir a nuestro perfil de LinkedIn"
              onClick={(e) => e.preventDefault()}
            >
              <LinkedinIcon />
            </a>
            <a 
              href={socialProfiles.tiktok.url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="TikTok"
              aria-label="Ir a nuestro perfil de TikTok"
            >
              <TiktokIcon />
            </a>
            <a 
              href={socialProfiles.youtube.url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="YouTube"
              aria-label="Ir a nuestro canal de YouTube"
            >
              <YoutubeIcon />
            </a>
            <a 
              href={socialProfiles.x.url || '#'} 
              target="_blank"
              rel="noopener noreferrer"
              className="size-9 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-[0.98]"
              title="X (Twitter)"
              aria-label="Ir a nuestro perfil de X"
            >
              <XIcon />
            </a>
          </div>
        </div>

        {/* Main Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12 border-b border-slate-800 text-left">
          
          {/* Col 1: Sobre VitaBlue */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-slate-300">
              {isEnglish ? 'About VitaBlue' : 'Sobre VitaBlue'}
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-300">
              <li>
                <Link to={isEnglish ? "/en/about-us" : "/sobre-nosotros"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'About Us' : 'Quiénes Somos'}
                </Link>
              </li>
              <li>
                <a href={isEnglish ? "/en#opiniones" : "/#opiniones"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'Reviews' : 'Opiniones de Clientes'}
                </a>
              </li>
              <li>
                <a href={isEnglish ? "/en#faq" : "/#faq"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'FAQ' : 'Preguntas Frecuentes'}
                </a>
              </li>
              <li>
                <Link to={isEnglish ? "/en/blog" : "/blog"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'Blog & Guides' : 'Blog y Guías'}
                </Link>
              </li>
              <li>
                <a href="mailto:info@vitablue.es?subject=Careers" className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'Careers' : 'Trabaja con nosotros'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Seguros de Salud */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-slate-300">
              {isEnglish ? 'Health Insurance' : 'Seguros de Salud'}
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-300">
              <li>
                <Link to="/productos/seguros-salud" className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'General Health Insurance' : 'Seguro de Salud General'}
                </Link>
              </li>
              <li>
                <Link to={isEnglish ? "/en/health-insurance-student-visa-spain" : "/productos/seguros-salud/seguros-sanitas/international-students"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'International Students' : 'Estudiantes Extranjeros'}
                </Link>
              </li>
              <li>
                <Link to={isEnglish ? "/en/health-insurance-expatriates-spain" : "/productos/seguros-salud/seguro-expatriados"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'Expats & Residents' : 'Expatriados y Residentes'}
                </Link>
              </li>
              <li>
                <Link to={isEnglish ? "/en/digital-nomad-insurance-spain" : "/productos/seguros-salud/seguro-nomadas-digitales"} className="hover:text-accent transition-colors duration-150">
                  {isEnglish ? 'Digital Nomads' : 'Nómadas Digitales'}
                </Link>
              </li>
              <li>
                <Link to="/productos/seguros-salud/seguros-sanitas" className="hover:text-accent transition-colors duration-150 font-bold text-primary-light">
                  {isEnglish ? 'Sanitas Insurance Catalog' : 'Catálogo Seguros Sanitas'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Especialidades & Herramientas */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-slate-300">
              Herramientas y Más
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-300">
              <li>
                <Link to="/productos/seguro-mascotas/sanitas-mascotas" className="hover:text-accent transition-colors duration-150">
                  Seguro de Mascotas
                </Link>
              </li>
              <li>
                <Link to="/productos/seguro-para-decesos/asistencia-familiar" className="hover:text-accent transition-colors duration-150">
                  Asistencia Familiar
                </Link>
              </li>
              <li>
                <Link to="/productos/seguro-viaje" className="hover:text-accent transition-colors duration-150">
                  Seguro de Viaje
                </Link>
              </li>
              <li>
                <Link to="/wizard" className="hover:text-accent transition-colors duration-150 font-bold text-accent">
                  Cotizador de Seguros Online
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Necesito%20asesoramiento%20general%20sobre%20seguros."
                  target="_blank" 
                  rel="noopener noreferrer" 
                    className="hover:text-whatsapp transition-colors duration-150 flex items-center gap-1.5"
                >
                  <span className="size-2 rounded-full bg-whatsapp animate-pulse" />
                  Asesor WhatsApp Online
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacto & Legal */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-slate-300">
              Contacto y Legal
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm font-semibold text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <a href="tel:+34694583452" className="hover:text-accent transition-colors">
                  +34 694 58 34 52
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <a href="mailto:info@vitablue.es" className="hover:text-accent transition-colors">
                  info@vitablue.es
                </a>
              </li>
              <li className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                <Link to="/aviso-legal" className="inline-flex min-h-6 items-center hover:text-accent transition-colors text-xs text-slate-300">
                  Aviso Legal
                </Link>
                <Link to="/privacidad" className="inline-flex min-h-6 items-center hover:text-accent transition-colors text-xs text-slate-300">
                  Política de Privacidad
                </Link>
                <Link to="/cookies" className="inline-flex min-h-6 items-center hover:text-accent transition-colors text-xs text-slate-300">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer & Credits */}
        <div className="pt-8 flex flex-col gap-4 text-[10px] text-slate-300 leading-relaxed font-medium text-left">
          <div className="flex items-start gap-2.5 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
            <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p>
              <strong>Declaración regulatoria:</strong> VitaBlue es una iniciativa comercial de asesoramiento y mediación independiente. Las pólizas son emitidas y respaldadas directamente por las respectivas compañías aseguradoras autorizadas por la Dirección General de Seguros y Fondos de Pensiones (DGSFP), incluyendo <strong>Sanitas, S.A. de Seguros y Reaseguros (Reg. DGSFP C0038)</strong> y <strong>SegurCaixa Adeslas, S.A. de Seguros y Reaseguros (Reg. DGSFP C0124)</strong>, entre otras. Todos los precios indicados son aproximaciones sujetas a validación de la compañía tras el análisis de edad, historial médico y modalidad.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            <span>© 2026 VitaBlue. Todos los derechos reservados.</span>
            <span>Parte del grupo Estar Protegidos.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
