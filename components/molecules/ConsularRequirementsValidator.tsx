import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  MessageCircle, 
  FileCheck, 
  Building,
  Globe,
  Coins,
  Clock,
  HeartHandshake
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
  { id: 'Colombia', label: '🇨🇴 Colombia (Bogotá)' },
  { id: 'México', label: '🇲🇽 México (CDMX, GDL, MTY)' },
  { id: 'Perú', label: '🇵🇪 Perú (Lima)' },
  { id: 'Argentina', label: '🇦🇷 Argentina (Buenos Aires)' },
  { id: 'Ecuador', label: '🇪🇨 Ecuador (Quito, GYE)' },
  { id: 'Estados Unidos', label: '🇺🇸 Estados Unidos' },
  { id: 'Reino Unido', label: '🇬🇧 Reino Unido' },
  { id: 'Chile', label: '🇨🇱 Chile' },
  { id: 'Otro', label: '🌎 Otro País' },
];

export const ConsularRequirementsValidator: React.FC<ConsularRequirementsValidatorProps> = ({
  initialCountry = 'Colombia',
  initialVisaType = 'student',
  className = '',
  onComplete,
}) => {
  const [visaType, setVisaType] = useState<VisaType>(initialVisaType);
  const [country, setCountry] = useState<string>(initialCountry);
  const [insurerCategory, setInsurerCategory] = useState<InsurerCategory>('spanish_authorized');
  const [copayStatus, setCopayStatus] = useState<CopayStatus>('zero_copay');
  const [waitingPeriodStatus, setWaitingPeriodStatus] = useState<WaitingPeriodStatus>('zero_waiting');
  const [repatriationStatus, setRepatriationStatus] = useState<RepatriationStatus>('included');
  const [result, setResult] = useState<ConsularDiagnosisResult | null>(null);


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
  };


  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 text-left text-text-main shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">
            <ShieldCheck className="h-4 w-4" />
            Validador Oficial de Requisitos Consulares (2026)
          </div>
          <h2 className="text-h3 font-display font-black text-text-main">
            ¿Tu seguro médico cumple las exigencias de Extranjería y el Consulado?
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-1">
            Diagnóstico gratuito en 30 segundos según el Reglamento de Extranjería (RD 557/2011) y Ley de Startups (28/2022).
          </p>
        </div>
        {result && (
          <button
            onClick={handleReset}
            type="button"
            className="self-start sm:self-center inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors border border-slate-200 rounded-xl px-3 py-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Nuevo test
          </button>
        )}
      </div>

      {!result ? (
        <div className="mt-6 space-y-6">
          {/* Step 1: Visa & Country */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-primary" />
              1. Tipo de Visado y País de Origen
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'student', label: '🎓 Estudiante / Máster' },
                { id: 'nomad', label: '💻 Nómada Digital' },
                { id: 'non_lucrative', label: '🏖️ No Lucrativa' },
                { id: 'other', label: '📋 Otro Trámite' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVisaType(v.id as VisaType)}
                  className={`min-h-11 rounded-xl border px-3 py-2 text-xs font-bold text-left transition-all ${
                    visaType === v.id
                      ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="mt-2">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs sm:text-sm font-bold text-text-main focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {countriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2: Insurer Entity */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Building className="h-4 w-4 text-primary" />
              2. ¿Dónde está contratada o registrada la póliza?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'spanish_authorized',
                  title: 'Aseguradora en España (DGSFP)',
                  desc: 'ASISA, Sanitas, Adeslas, DKV u otra entidad con registro oficial en España.',
                },
                {
                  id: 'travel_assistance',
                  title: 'Seguro de Asistencia al Viajero',
                  desc: 'SafetyWing, Assist Card, World Nomads o seguros turísticos con límite de reintegro.',
                },
                {
                  id: 'foreign_local',
                  title: 'Seguro Médico de mi País',
                  desc: 'EPS/Prepaga local (ej. Sura, OSDE, Colmédica) con endoso internacional.',
                },
                {
                  id: 'credit_card',
                  title: 'Cobertura de Tarjeta Bancaria',
                  desc: 'Asistencia médica de emergencia incluida en Visa/Mastercard (máx 90 días).',
                },
              ].map((ins) => (
                <button
                  key={ins.id}
                  type="button"
                  onClick={() => setInsurerCategory(ins.id as InsurerCategory)}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    insurerCategory === ins.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`text-xs font-black ${insurerCategory === ins.id ? 'text-primary' : 'text-text-main'}`}>
                    {ins.title}
                  </div>
                  <div className="text-[11px] font-semibold text-text-secondary mt-0.5">{ins.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Copays and Waiting periods */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-primary" />
              3. ¿Pagas Copagos o Deducibles por usar el seguro?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'zero_copay', label: '✅ 0€ Sin Copagos', sub: 'Sin franquicias ni abonos' },
                { id: 'low_copay', label: '⚠️ Con Copagos', sub: '10€ a 25€ por consulta' },
                { id: 'high_deductible', label: '❌ Con Deducible', sub: '$500+ a mi cargo' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCopayStatus(c.id as CopayStatus)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    copayStatus === c.id
                      ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{c.label}</div>
                  <div className="text-[10px] text-text-secondary font-medium mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>

            <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5 pt-3">
              <Clock className="h-4 w-4 text-primary" />
              ¿Tiene Periodos de Carencia (Tiempo de espera)?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'zero_waiting', label: '✅ Sin Carencias (Desde Día 1)', sub: 'Urgencias y hospitalización activas de inmediato' },
                { id: 'has_waiting', label: '⚠️ Con Carencias (6 a 10 meses)', sub: 'Espera para hospitalización o intervenciones' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWaitingPeriodStatus(w.id as WaitingPeriodStatus)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    waitingPeriodStatus === w.id
                      ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{w.label}</div>
                  <div className="text-[10px] text-text-secondary font-medium mt-0.5">{w.sub}</div>
                </button>
              ))}
            </div>
          </div>


          {/* Step 4: Repatriation */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-black uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-primary" />
              4. Repatriación Sanitaria al País de Origen
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'included', label: '✅ Incluida Expresamente', sub: 'Traslado y restos mortales' },
                { id: 'not_included', label: '❌ No Incluida', sub: 'Sin cobertura de repatriación' },
                { id: 'unknown', label: '❓ No lo Sé / Por Verificar', sub: 'Pendiente de comprobar' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRepatriationStatus(r.id as RepatriationStatus)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    repatriationStatus === r.id
                      ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-text-secondary font-medium mt-0.5">{r.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant="accent"
              className="w-full py-4 text-base font-bold shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
              onClick={handleRunDiagnosis}
            >
              Comprobar Mi Seguro Ahora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Diagnosis Results View */
        <div className="mt-6 space-y-6 animate-fadeIn">
          {/* Result Status Banner */}
          <div
            className={`rounded-2xl p-5 sm:p-6 border ${
              result.status === 'APPROVED'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : result.status === 'WARNING'
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {result.status === 'APPROVED' ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0 mt-0.5" />
                ) : result.status === 'WARNING' ? (
                  <AlertTriangle className="h-8 w-8 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-8 w-8 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-h3 font-display font-black leading-tight">
                    {result.statusTitle}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium opacity-90 mt-1">
                    {result.statusSubtitle}
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-center flex flex-col items-center justify-center rounded-2xl bg-white/90 px-4 py-2.5 shadow-sm border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Puntaje</span>
                <span className={`text-2xl font-black ${
                  result.status === 'APPROVED' ? 'text-emerald-600' : result.status === 'WARNING' ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {result.score}%
                </span>
              </div>
            </div>
          </div>

          {/* 4 Pillars Status Cards */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-text-secondary mb-3">
              Auditoría de los 4 Pilares de Extranjería
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.pillars.map((p, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    p.status === 'pass'
                      ? 'border-emerald-100 bg-emerald-50/30'
                      : p.status === 'warning'
                      ? 'border-amber-100 bg-amber-50/30'
                      : 'border-rose-100 bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-text-main">{p.label}</span>
                    {p.status === 'pass' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Apto
                      </span>
                    ) : p.status === 'warning' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <AlertTriangle className="h-3 w-3" /> Precaución
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                        <XCircle className="h-3 w-3" /> No Apto
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-secondary mt-1.5 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <h5 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4" />
                Riesgos Identificados
              </h5>
              <ul className="space-y-1.5 text-xs font-medium text-text-secondary">
                {result.rejectionRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <h5 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
                <FileCheck className="h-4 w-4" />
                Plan de Acción Recomendado
              </h5>
              <ul className="space-y-1.5 text-xs font-medium text-text-secondary">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Direct CTA Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={result.recommendedPlan.actionUrl}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-bold text-primary-dark shadow-md shadow-accent/20 hover:brightness-105 transition-all text-center"
            >
              Contratar Seguro Homologado ({result.recommendedPlan.startingPrice})
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/34694583452?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 px-6 py-3.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition-all text-center"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              Revisar mi caso en WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsularRequirementsValidator;
