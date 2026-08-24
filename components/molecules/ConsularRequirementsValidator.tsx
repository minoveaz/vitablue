import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  MessageCircle, 
  FileCheck, 
  Building2, 
  Globe, 
  Coins, 
  Clock, 
  GraduationCap,
  Laptop,
  Check,
  Lock
} from 'lucide-react';

import Button from '@/components/atoms/Button';
import { 
  evaluateConsularInsurance, 
  ConsularValidatorInput, 
  ConsularDiagnosisResult,
  VisaType,
  InsurerCategory,
  CopayStatus,
  WaitingPeriodStatus,
  RepatriationStatus 
} from '@/utils/consularValidator';

export interface ConsularRequirementsValidatorProps {
  initialCountry?: string;
  initialVisaType?: VisaType;
  className?: string;
  onComplete?: (result: ConsularDiagnosisResult) => void;
}

const countriesList = [
  { id: 'Colombia', label: '🇨🇴 Colombia (Consulado General en Bogotá)' },
  { id: 'México', label: '🇲🇽 México (Consulados en CDMX, Guadalajara, Monterrey)' },
  { id: 'Perú', label: '🇵🇪 Perú (Consulado General en Lima)' },
  { id: 'Argentina', label: '🇦🇷 Argentina (Consulados en Buenos Aires, Córdoba, Rosario)' },
  { id: 'Ecuador', label: '🇪🇨 Ecuador (Consulados en Quito y Guayaquil)' },
  { id: 'Estados Unidos', label: '🇺🇸 Estados Unidos (BLS Centers & Consulates)' },
  { id: 'Reino Unido', label: '🇬🇧 Reino Unido (BLS Centers & Consulates)' },
  { id: 'Chile', label: '🇨🇱 Chile (Consulado General en Santiago)' },
  { id: 'Otro', label: '🌎 Otro País de Origen' },
];

const slideVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -24, transition: { duration: 0.18, ease: 'easeIn' } },
};

export const ConsularRequirementsValidator: React.FC<ConsularRequirementsValidatorProps> = ({
  initialCountry = 'Colombia',
  initialVisaType = 'student',
  className = '',
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const [visaType, setVisaType] = useState<VisaType>(initialVisaType);
  const [country, setCountry] = useState<string>(initialCountry);
  const [insurerCategory, setInsurerCategory] = useState<InsurerCategory>('spanish_authorized');
  const [copayStatus, setCopayStatus] = useState<CopayStatus>('zero_copay');
  const [waitingPeriodStatus, setWaitingPeriodStatus] = useState<WaitingPeriodStatus>('zero_waiting');
  const [repatriationStatus, setRepatriationStatus] = useState<RepatriationStatus>('included');
  const [result, setResult] = useState<ConsularDiagnosisResult | null>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleRunDiagnosis();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRunDiagnosis = () => {
    const input: ConsularValidatorInput = {
      visaType,
      country,
      insurerCategory,
      copayStatus,
      waitingPeriodStatus,
      repatriationStatus,
    };
    const diagnosis = evaluateConsularInsurance(input);
    setResult(diagnosis);
    onComplete?.(diagnosis);
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(1);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-[2.5rem] border border-slate-200/80 bg-white p-6 sm:p-10 text-left text-text-main shadow-2xl shadow-slate-950/[0.04] ${className}`}>
      {/* Top Brand Eyebrow & Reset */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Auditoría Consular Oficial (RD 557/2011)
          </span>
        </div>
        {result ? (
          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors border border-slate-200 rounded-xl px-3.5 py-1.5 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar test
          </button>
        ) : (
          <div className="text-xs font-bold text-text-secondary">
            Paso <span className="text-primary font-black">{currentStep}</span> de {totalSteps}
          </div>
        )}
      </div>

      {!result ? (
        <div className="mt-6 flex flex-col gap-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Stepper Content */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Visa Type & Country */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-h2 font-display font-black text-text-main leading-tight">
                    ¿Qué tipo de visado estás tramitando?
                  </h2>
                  <p className="text-body-reg text-text-secondary mt-1 font-medium">
                    Selecciona el propósito de tu estancia en España y el país del consulado donde presentarás tu expediente.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'student',
                      title: 'Visado de Estudiante / Máster',
                      desc: 'Grados, másteres oficiales, doctorados, intercambios o academias de idioma.',
                      icon: <GraduationCap className="w-5 h-5" />,
                    },
                    {
                      id: 'nomad',
                      title: 'Visado de Nómada Digital',
                      desc: 'Teletrabajo internacional y trabajadores remotos (Ley de Startups 28/2022).',
                      icon: <Laptop className="w-5 h-5" />,
                    },
                    {
                      id: 'non_lucrative',
                      title: 'Residencia No Lucrativa',
                      desc: 'Jubilados, inversores o personas con fondos propios sin actividad laboral.',
                      icon: <ShieldCheck className="w-5 h-5" />,
                    },
                    {
                      id: 'other',
                      title: 'Otro Trámite / Reagrupación',
                      desc: 'Arraigo, pareja de hecho, visado de trabajo o estancias de larga duración.',
                      icon: <Building2 className="w-5 h-5" />,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVisaType(item.id as VisaType)}
                      className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-150 relative ${
                        visaType === item.id
                          ? 'border-primary bg-primary/[0.04] shadow-md shadow-primary/5 ring-1 ring-primary/20'
                          : 'border-slate-150 bg-white hover:border-primary/40 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        visaType === item.id ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 pr-6">
                        <h4 className={`text-sm sm:text-base font-bold ${visaType === item.id ? 'text-primary' : 'text-text-main'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      <div className={`size-5 rounded-full border-2 absolute top-5 right-5 flex items-center justify-center transition-all ${
                        visaType === item.id ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {visaType === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label htmlFor="consulate-origin-select" className="text-xs font-black uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-primary" />
                    País y Oficina Consular de Origen
                  </label>
                  <select
                    id="consulate-origin-select"
                    aria-label="País y Oficina Consular de Origen"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-3.5 text-sm font-bold text-text-main focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                  >
                    {countriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

              </motion.div>
            )}

            {/* STEP 2: Insurer Origin */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-h2 font-display font-black text-text-main leading-tight">
                    ¿Dónde está contratada o registrada la póliza?
                  </h2>
                  <p className="text-body-reg text-text-secondary mt-1 font-medium">
                    El marco legal español exige que la entidad cuente con autorización directa ante la DGSFP en España.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      id: 'spanish_authorized',
                      badge: '100% Homologado',
                      title: 'Aseguradora en España (DGSFP)',
                      desc: 'ASISA, Sanitas, Adeslas, DKV u otra entidad con registro directo en el Sistema de Salud español.',
                    },
                    {
                      id: 'travel_assistance',
                      badge: 'Alto Riesgo',
                      title: 'Seguro de Asistencia al Viajero',
                      desc: 'SafetyWing, Assist Card, World Nomads, Heymondo o seguros turísticos con límite de reintegro.',
                    },
                    {
                      id: 'foreign_local',
                      badge: 'No Admitido',
                      title: 'Seguro Médico de mi País',
                      desc: 'EPS o prepaga nacional (ej. Sura, OSDE, Colmédica, BlueCross) con extensión de viaje.',
                    },
                    {
                      id: 'credit_card',
                      badge: 'Rechazo Seguro',
                      title: 'Cobertura de Tarjeta Bancaria',
                      desc: 'Asistencia en viaje incluida en Visa/Mastercard (límite estándar de 90 días turísticos).',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInsurerCategory(item.id as InsurerCategory)}
                      className={`w-full flex flex-col justify-between p-5 rounded-2xl border-2 text-left transition-all duration-150 relative ${
                        insurerCategory === item.id
                          ? 'border-primary bg-primary/[0.04] shadow-md shadow-primary/5 ring-1 ring-primary/20'
                          : 'border-slate-150 bg-white hover:border-primary/40 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          item.id === 'spanish_authorized' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.badge}
                        </span>
                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          insurerCategory === item.id ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {insurerCategory === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <h4 className={`text-sm sm:text-base font-bold ${insurerCategory === item.id ? 'text-primary' : 'text-text-main'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Copays & Waiting Periods */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-h2 font-display font-black text-text-main leading-tight">
                    Copagos y Periodos de Carencia
                  </h2>
                  <p className="text-body-reg text-text-secondary mt-1 font-medium">
                    Extranjería prohíbe deducibles a cargo del asegurado y exige coberturas hospitalarias activas desde el primer día.
                  </p>
                </div>

                {/* Copays */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-primary" />
                    ¿Tienes que pagar copagos o deducibles por usar el seguro?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'zero_copay', title: '0€ Sin Copagos', desc: 'Sin pagos adicionales por consulta o urgencias' },
                      { id: 'low_copay', title: 'Con Copagos', desc: '10€ a 25€ por acto médico o especialista' },
                      { id: 'high_deductible', title: 'Con Deducible', desc: 'Franquicia en dólares ($500+) a mi cargo' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCopayStatus(item.id as CopayStatus)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          copayStatus === item.id
                            ? 'border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/20'
                            : 'border-slate-150 bg-white hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs sm:text-sm font-bold ${copayStatus === item.id ? 'text-primary' : 'text-text-main'}`}>
                            {item.title}
                          </span>
                          {copayStatus === item.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-text-secondary font-medium">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Waiting Periods */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    ¿Tiene Periodos de Carencia (Tiempo de espera)?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'zero_waiting', title: 'Sin Carencias (Desde Día 1)', desc: 'Acceso inmediato a cirugías, pruebas diagnósticas y hospitalización.' },
                      { id: 'has_waiting', title: 'Con Carencias (6 a 10 meses)', desc: 'Periodo de espera obligatorio para intervenciones o partos.' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setWaitingPeriodStatus(item.id as WaitingPeriodStatus)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          waitingPeriodStatus === item.id
                            ? 'border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/20'
                            : 'border-slate-150 bg-white hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs sm:text-sm font-bold ${waitingPeriodStatus === item.id ? 'text-primary' : 'text-text-main'}`}>
                            {item.title}
                          </span>
                          {waitingPeriodStatus === item.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-[11px] text-text-secondary font-medium">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Repatriation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-h2 font-display font-black text-text-main leading-tight">
                    Repatriación Sanitaria y de Restos Mortales
                  </h2>
                  <p className="text-body-reg text-text-secondary mt-1 font-medium">
                    El Ministerio de Asuntos Exteriores exige expresamente la cobertura de repatriación en caso de accidente o fallecimiento.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    {
                      id: 'included',
                      title: 'Incluida en el Certificado',
                      desc: 'Cobertura explícita de traslado sanitario y retorno de restos mortales al país de origen.',
                    },
                    {
                      id: 'not_included',
                      title: 'No Incluida',
                      desc: 'La póliza solo cubre atención médica dentro de España sin traslado internacional.',
                    },
                    {
                      id: 'unknown',
                      title: 'No lo sé / Por Verificar',
                      desc: 'No aparece claro en las condiciones particulares de la póliza.',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRepatriationStatus(item.id as RepatriationStatus)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all relative ${
                        repatriationStatus === item.id
                          ? 'border-primary bg-primary/[0.04] shadow-md shadow-primary/5 ring-1 ring-primary/20'
                          : 'border-slate-150 bg-white hover:border-primary/40 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${repatriationStatus === item.id ? 'text-primary' : 'text-text-main'}`}>
                          {item.title}
                        </span>
                        <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          repatriationStatus === item.id ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {repatriationStatus === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                className="text-text-secondary hover:text-primary font-bold"
              >
                Anterior
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                <Lock className="w-3.5 h-3.5 text-primary" /> Sin registro previo
              </div>
            )}

            <Button
              variant="accent"
              size="lg"
              onClick={handleNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="font-bold shadow-lg shadow-accent/20"
            >
              {currentStep === totalSteps ? 'Analizar Mi Seguro Ahora' : 'Continuar'}
            </Button>
          </div>
        </div>
      ) : (
        /* Results View (Diagnostic Dashboard) */
        <div className="mt-6 space-y-8 animate-fadeIn">
          {/* Result Status Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border-2 shadow-sm ${
              result.status === 'APPROVED'
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : result.status === 'WARNING'
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-rose-50/90 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  result.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : result.status === 'WARNING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {result.status === 'APPROVED' ? (
                    <CheckCircle2 className="h-8 w-8" />
                  ) : result.status === 'WARNING' ? (
                    <AlertTriangle className="h-8 w-8" />
                  ) : (
                    <XCircle className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-h2 font-display font-black leading-tight">
                    {result.statusTitle}
                  </h3>
                  <p className="text-body-reg font-medium opacity-90 mt-1.5 max-w-xl leading-relaxed">
                    {result.statusSubtitle}
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-center flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-3.5 shadow-md border border-slate-100 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Puntaje Oficial</span>
                <span className={`text-3xl font-display font-black ${
                  result.status === 'APPROVED' ? 'text-emerald-600' : result.status === 'WARNING' ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {result.score}%
                </span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Status Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Auditoría Técnica de los 4 Pilares de Extranjería
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {result.pillars.map((p, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border-2 p-5 text-left transition-all ${
                    p.status === 'pass'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : p.status === 'warning'
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-rose-200 bg-rose-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-text-main">{p.label}</span>
                    {p.status === 'pass' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cumple
                      </span>
                    ) : p.status === 'warning' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5" /> Precaución
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                        <XCircle className="h-3.5 w-3.5" /> No Cumple
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-secondary mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
              <h5 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Riesgos Detectados para tu Cita
              </h5>
              <ul className="space-y-2 text-xs font-medium text-text-secondary">
                {result.rejectionRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold leading-none mt-0.5">•</span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">
              <h5 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2.5">
                <FileCheck className="h-4 w-4 text-primary" />
                Plan de Acción Recomendado
              </h5>
              <ul className="space-y-2 text-xs font-medium text-text-secondary">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold leading-none mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct CTA Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={result.recommendedPlan.actionUrl}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm sm:text-base font-bold text-primary-dark shadow-lg shadow-accent/20 hover:brightness-105 transition-all text-center"
            >
              Contratar Seguro Homologado ({result.recommendedPlan.startingPrice})
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/34694583452?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 px-6 py-4 text-sm sm:text-base font-bold text-emerald-900 hover:bg-emerald-100 transition-all text-center"
            >
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              Revisar mi caso en WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsularRequirementsValidator;
