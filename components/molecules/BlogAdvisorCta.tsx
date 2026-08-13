import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import Button from '@/components/atoms/Button';

interface BlogAdvisorCtaProps {
  isEnglish: boolean;
  title?: string;
  description?: string;
  postTitle?: string;
  variant?: 'bottom' | 'sidebar' | 'list';
}

const BlogAdvisorCta: React.FC<BlogAdvisorCtaProps> = ({ isEnglish, title = '', description = '', postTitle = '', variant = 'bottom' }) => {
  const href = `https://wa.me/34694583452?text=${encodeURIComponent(isEnglish ? `Hello! I come from the guide ${postTitle}. I need some advice.` : `Hola! Vengo de la guía de ${postTitle}. Necesito asesoramiento para mi seguro.`)}`;

  if (variant === 'list') {
    return <section className="px-4 sm:px-6 lg:px-8 pb-16"><div className="mx-auto w-full max-w-4xl bg-gradient-to-br from-primary to-primary-dark rounded-[40px] p-8 sm:p-12 text-center text-white space-y-6 shadow-lg"><h2 className="text-h2 font-display font-black leading-tight">¿Tienes dudas sobre los requisitos de tu seguro?</h2><p className="text-body-lg text-slate-100 max-w-xl mx-auto leading-relaxed">Nuestros asesores expertos en visados y extranjería revisarán tu caso sin coste alguno y te recomendarán la póliza homologada exacta que necesitas.</p><a href="https://wa.me/34694583452" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-whatsapp-dark hover:bg-whatsapp text-white font-bold rounded-xl text-sm px-6 py-3.5"><WhatsAppIcon size={18} className="fill-white" />Preguntar por WhatsApp</a></div></section>;
  }

  if (variant === 'sidebar') {
    return <div className="bg-gradient-to-br from-primary/10 to-brand-cyan/10 rounded-[32px] border border-primary/10 p-6 space-y-5 text-left"><span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-text-secondary shadow-sm"><Star className="w-3 h-3 fill-accent text-accent" /> {isEnglish ? 'Free Advice' : 'Te asesoramos gratis'}</span><h4 className="text-base font-display font-black text-text-main leading-tight">{title}</h4><p className="text-xs text-text-secondary leading-relaxed">{description}</p><a href={href} target="_blank" rel="noopener noreferrer" className="w-full flex h-11 items-center justify-center gap-1.5 rounded-xl bg-whatsapp-dark hover:bg-whatsapp text-white text-xs font-bold"><WhatsAppIcon size={16} className="fill-white" />{isEnglish ? 'Consult on WhatsApp' : 'Consultar por WhatsApp'}</a><Link to="/wizard" className="w-full block"><Button className="w-full h-11 rounded-xl font-bold px-2 text-xs mt-2" variant="accent" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>{isEnglish ? 'Calculate Insurance Online' : 'Calcular Seguro Online'}</Button></Link></div>;
  }

  return <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-brand-cyan/5 to-white border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"><div className="space-y-2 text-left"><span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[9px] font-black text-text-secondary shadow-sm uppercase tracking-wider">{isEnglish ? 'Immediate Consultation' : 'Consulta Inmediata'}</span><h3 className="text-h3 font-display font-black text-text-main leading-tight">{title}</h3><p className="text-xs text-text-secondary leading-relaxed">{description}</p></div><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-whatsapp-dark hover:bg-whatsapp px-6 py-3.5 text-xs font-black text-white"><WhatsAppIcon size={16} /><span>{isEnglish ? 'Ask on WhatsApp' : 'Preguntar por WhatsApp'}</span></a></div>;
};

export default BlogAdvisorCta;
