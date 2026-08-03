import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import QuotationWizard from '../components/organisms/QuotationWizard';

export const Wizard: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, setAgeRange, setVisaRequired, setResidencyType } = useWizard();

  const handleWizardComplete = (data: any) => {
    // Hydrate the context state with the quoter data
    if (data.profile) setProfile(data.profile);
    if (data.ageRange) setAgeRange(data.ageRange);
    if (data.visaRequired) setVisaRequired(data.visaRequired);
    if (data.residencyType) setResidencyType(data.residencyType);

    // Redirect to the comparative results screen
    navigate('/resultados');
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 bg-slate-50/50 flex justify-center items-center">
      <Helmet>
        <title>Cotizador de Seguros de Salud | VitaBlue</title>
        <meta name="description" content="Calcula y compara los precios de tu seguro médico en segundos. Proceso 100% gratuito y sin compromiso." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/')} 
          className="w-fit flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio
        </button>

        {/* Form Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-lg shadow-slate-950/[0.02] p-6 sm:p-8 lg:p-10 flex flex-col gap-8">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan fill-current" /> Comparador Oficial
            </span>
            <h1 className="text-3xl font-display font-black text-text-main leading-tight tracking-tight">
              Calcula tu seguro de salud
            </h1>
            <p className="text-body-reg text-text-secondary font-medium leading-relaxed">
              Completa el formulario en 3 sencillos pasos para ver las coberturas y precios exactos que corresponden a tu perfil.
            </p>
          </div>

          {/* Wizard component */}
          <QuotationWizard onComplete={handleWizardComplete} />

          {/* Trust Disclaimer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" /> Entorno de datos cifrado
            </span>
            <span>
              Servicio regulado por la DGSFP de España
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
