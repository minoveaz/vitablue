import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Clock, Lock, CheckCircle2,
  Shield, GraduationCap, Laptop, Globe, Check,
  User, Phone, Mail,
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Stepper from '@/components/molecules/Stepper';
import {
  useWizard,
  ProfileType, DurationType, StartDateType, VisaRequiredType,
  AgeRangeType, TravelFrequencyType, ResidencyType,
} from '@/context/WizardContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type StepKey =
  | 'intro' | 'profile' | 'duration' | 'startDate' | 'visa'
  | 'ageRange' | 'travelFrequency' | 'continents' | 'residencyType' | 'contact';

interface QuotationWizardProps {
  onComplete?: (data: any) => void;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_TITLES: Record<Exclude<StepKey, 'intro'>, string> = {
  profile:         'Perfil',
  duration:        'Duración',
  startDate:       'Inicio',
  visa:            'Visado',
  ageRange:        'Edad',
  travelFrequency: 'Movilidad',
  continents:      'Destinos',
  residencyType:   'Residencia',
  contact:         'Contacto',
};

const CONTINENT_OPTIONS = [
  { id: 'EU',           label: 'Europa (Unión Europea)' },
  { id: 'Non-EU',       label: 'Resto de Europa' },
  { id: 'Latam',        label: 'América Latina' },
  { id: 'NorthAmerica', label: 'Norteamérica (EE.UU. / Canadá)' },
  { id: 'Asia',         label: 'Asia' },
  { id: 'Oceania',      label: 'Oceanía' },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const slideVariants = {
  initial: { opacity: 0, x: 36 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: -36, transition: { duration: 0.2, ease: 'easeIn' } },
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  multiSelect?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  selected, onClick, title, description, icon, multiSelect = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-150 ${
      selected
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-slate-100 bg-white hover:border-primary/30'
    }`}
  >
    {icon && (
      <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
        selected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400'
      }`}>
        {icon}
      </div>
    )}
    <div className="flex-grow min-w-0">
      <span className={`font-semibold text-sm block ${selected ? 'text-primary' : 'text-text-main'}`}>
        {title}
      </span>
      {description && (
        <p className="text-caption text-text-secondary mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <div className={`shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
      multiSelect ? 'size-5 rounded border-2' : 'size-5 rounded-full border-2'
    } ${selected ? 'bg-primary border-primary' : 'border-slate-200'}`}>
      {selected && (
        multiSelect
          ? <Check className="w-3 h-3 text-white stroke-[3]" />
          : <div className="size-2 rounded-full bg-white" />
      )}
    </div>
  </button>
);

interface StepHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ badge, title, description }) => (
  <div className="flex flex-col gap-2 mb-6">
    {badge && (
      <span className="text-caption font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1">
        <Shield className="w-3 h-3" /> {badge}
      </span>
    )}
    <h2 className="text-h3 font-display font-black text-text-main leading-tight">{title}</h2>
    {description && (
      <p className="text-body-reg text-text-secondary leading-relaxed">{description}</p>
    )}
  </div>
);

// ─── Step Sub-components ──────────────────────────────────────────────────────

// Step 0 – Intro
const IntroStep: React.FC<{ profile: ProfileType; onNext: () => void }> = ({ profile, onNext }) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      {profile && (
        <span className="text-caption font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Asesoría para{' '}
          {profile === 'student' ? 'Estudiantes' : profile === 'nomad' ? 'Nómadas Digitales' : 'Expatriados'}
        </span>
      )}
      <h2 className="text-h3 font-display font-black text-text-main leading-tight">
        Encuentra el seguro médico ideal para tu estancia
      </h2>
      <p className="text-body-reg text-text-secondary leading-relaxed">
        Un proceso transparente diseñado para tu seguridad. Solo verás opciones que realmente cumplen con lo que necesitas.
      </p>
    </div>

    {/* Trust notice */}
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 items-start">
      <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p className="text-caption text-text-secondary leading-relaxed">
        <strong className="text-text-main">Antes de empezar:</strong> No es un proceso de contratación ni implica ningún compromiso.
        No te pediremos datos de contacto hasta el final.
      </p>
    </div>

    {/* Trust badges */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        { Icon: Clock,        title: 'Rápido',  desc: 'Menos de 2 minutos' },
        { Icon: Lock,         title: 'Privado', desc: 'Sin datos personales' },
        { Icon: CheckCircle2, title: 'Útil',    desc: 'Recomendación real' },
      ].map(({ Icon, title, desc }) => (
        <div key={title} className="flex flex-col gap-2 p-4 rounded-xl border border-slate-100 bg-white">
          <Icon className="w-5 h-5 text-primary" />
          <div>
            <p className="font-bold text-sm text-text-main">{title}</p>
            <p className="text-caption text-text-secondary">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <Button
      variant="accent"
      size="lg"
      onClick={onNext}
      rightIcon={<ArrowRight className="w-5 h-5" />}
      className="w-full sm:w-auto"
    >
      Comenzar asesoría
    </Button>
  </div>
);

// Step 1 – Profile
const ProfileStep: React.FC<{
  profile: ProfileType;
  setProfile: (p: ProfileType) => void;
  onNext: () => void;
}> = ({ profile, setProfile, onNext }) => {
  const options: { id: ProfileType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'student',
      label: 'Estudiante',
      icon: <GraduationCap className="w-5 h-5" />,
      desc: 'Vengo a estudiar a una universidad o centro oficial.',
    },
    {
      id: 'nomad',
      label: 'Nómada Digital',
      icon: <Laptop className="w-5 h-5" />,
      desc: 'Trabajo en remoto mientras viajo o resido en España.',
    },
    {
      id: 'expat',
      label: 'Expatriado / Residente',
      icon: <Globe className="w-5 h-5" />,
      desc: 'Voy a residir de forma estable (No Lucrativa, Trabajo, etc.).',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 1"
        title="¿Cuál es el motivo de tu estancia?"
        description="Necesitamos saber tu perfil para filtrar los requisitos de visado correctos."
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={profile === opt.id}
            onClick={() => { setProfile(opt.id); onNext(); }}
            title={opt.label}
            description={opt.desc}
            icon={opt.icon}
          />
        ))}
      </div>
      {profile && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 2 – Duration
const DurationStep: React.FC<{
  duration: DurationType;
  setDuration: (d: DurationType) => void;
  profile: ProfileType;
  onNext: () => void;
}> = ({ duration, setDuration, profile, onNext }) => {
  const options: { id: DurationType; label: string }[] = [
    { id: 'less_6',  label: 'Menos de 6 meses' },
    { id: '6_12',   label: 'Entre 6 y 12 meses' },
    { id: 'more_12', label: 'Más de 12 meses' },
  ];

  const getDesc = () => {
    if (profile === 'student') return 'Los consulados suelen exigir que el seguro cubra todo el periodo lectivo.';
    if (profile === 'nomad')   return 'Define si necesitas una póliza de corta estancia o anual para tu visado de teletrabajo.';
    if (profile === 'expat')   return 'Para residencias de larga duración (NLV, Golden Visa), la póliza debe ser anual.';
    return 'Esto define el tipo de póliza y la validez administrativa necesaria.';
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 2"
        title={profile === 'student' ? '¿Cuánto dura tu curso o programa?' : '¿Cuánto tiempo planeas estar en España?'}
        description={getDesc()}
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={duration === opt.id}
            onClick={() => { setDuration(opt.id); onNext(); }}
            title={opt.label}
          />
        ))}
      </div>
      {duration && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 3 – Start Date
const StartDateStep: React.FC<{
  startDate: StartDateType;
  setStartDate: (s: StartDateType) => void;
  profile: ProfileType;
  onNext: () => void;
}> = ({ startDate, setStartDate, profile, onNext }) => {
  const options: { id: StartDateType; label: string }[] = [
    { id: 'weeks', label: 'En las próximas semanas' },
    { id: 'month', label: 'El próximo mes' },
    { id: 'later', label: 'Más adelante' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 3"
        title="¿Cuándo quieres que empiece tu cobertura?"
        description={
          profile === 'student'
            ? 'Recomendamos que coincida con tu fecha de llegada para el certificado.'
            : 'Nos ayuda a verificar la disponibilidad inmediata de las pólizas.'
        }
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={startDate === opt.id}
            onClick={() => { setStartDate(opt.id); onNext(); }}
            title={opt.label}
          />
        ))}
      </div>
      {startDate && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 4 – Visa
const VisaStep: React.FC<{
  visaRequired: VisaRequiredType;
  setVisaRequired: (v: VisaRequiredType) => void;
  profile: ProfileType;
  onNext: () => void;
}> = ({ visaRequired, setVisaRequired, profile, onNext }) => {
  const options: { id: VisaRequiredType; label: string; desc?: string }[] = [
    { id: 'yes',     label: 'Sí, necesito certificado oficial' },
    { id: 'no',      label: 'No, solo busco cobertura médica' },
    { id: 'unknown', label: 'No lo sé todavía', desc: 'Te mostraremos opciones que cumplen los requisitos estándar.' },
  ];

  const getTitle = () => {
    if (profile === 'student') return '¿Necesitas el seguro para tu Visado de Estudiante?';
    if (profile === 'nomad')   return '¿Es para tu trámite de Nómada Digital?';
    if (profile === 'expat')   return '¿Necesitas el certificado para Residencia o NIE?';
    return '¿Necesitas certificado para el visado?';
  };

  const getDesc = () => {
    if (profile === 'student') return 'Para estudios (Tipo D), Extranjería exige pólizas sin copagos y con repatriación.';
    if (profile === 'nomad')   return 'La Ley de Startups tiene requisitos específicos de cobertura nacional.';
    if (profile === 'expat')   return 'La Residencia No Lucrativa o Golden Visa exigen un seguro equivalente al público.';
    return 'Extranjería exige condiciones muy específicas para aprobar la solicitud.';
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader badge="Paso 4" title={getTitle()} description={getDesc()} />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={visaRequired === opt.id}
            onClick={() => { setVisaRequired(opt.id); onNext(); }}
            title={opt.label}
            description={opt.desc}
          />
        ))}
      </div>
      {visaRequired && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 5 – Age Range
const AgeRangeStep: React.FC<{
  ageRange: AgeRangeType;
  setAgeRange: (a: AgeRangeType) => void;
  onNext: () => void;
}> = ({ ageRange, setAgeRange, onNext }) => {
  const options: { id: AgeRangeType; label: string }[] = [
    { id: '18_24',   label: '18 - 24 años' },
    { id: '25_30',   label: '25 - 30 años' },
    { id: '31_40',   label: '31 - 40 años' },
    { id: 'plus_40', label: '+40 años' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 5"
        title="¿Qué edad tienes?"
        description="La edad influye en la elegibilidad y el tipo de protección más adecuado."
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={ageRange === opt.id}
            onClick={() => { setAgeRange(opt.id); onNext(); }}
            title={opt.label}
          />
        ))}
      </div>
      {ageRange && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 6 (nomad) – Travel Frequency
const TravelFrequencyStep: React.FC<{
  travelFrequency: TravelFrequencyType;
  setTravelFrequency: (f: TravelFrequencyType) => void;
  onNext: () => void;
}> = ({ travelFrequency, setTravelFrequency, onNext }) => {
  const options: { id: TravelFrequencyType; label: string; desc: string }[] = [
    { id: 'low',  label: 'Baja Movilidad',  desc: 'Paso la mayor parte del año en España.' },
    { id: 'high', label: 'Alta Movilidad',  desc: 'Viajo fuera de España más de 60 días al año.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 6"
        title="¿Con qué frecuencia viajas fuera de España?"
        description="Fundamental para decidir si necesitas cobertura internacional reforzada."
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={travelFrequency === opt.id}
            onClick={() => { setTravelFrequency(opt.id); onNext(); }}
            title={opt.label}
            description={opt.desc}
          />
        ))}
      </div>
      {travelFrequency && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Step 7 (nomad) – Continents
const ContinentsStep: React.FC<{
  continents: string[];
  toggleContinent: (id: string) => void;
  onNext: () => void;
}> = ({ continents, toggleContinent, onNext }) => (
  <div className="flex flex-col gap-6">
    <StepHeader
      badge="Paso 7"
      title="¿En qué regiones vas a estar?"
      description="Selecciona todas las que apliquen para verificar tu red médica."
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CONTINENT_OPTIONS.map((opt) => (
        <OptionCard
          key={opt.id}
          selected={continents.includes(opt.id)}
          onClick={() => toggleContinent(opt.id)}
          title={opt.label}
          multiSelect
        />
      ))}
    </div>
    <div className="flex justify-end">
      <Button
        variant="primary"
        size="lg"
        onClick={onNext}
        disabled={continents.length === 0}
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Continuar
      </Button>
    </div>
  </div>
);

// Step 6 (expat) – Residency Type
const ResidencyTypeStep: React.FC<{
  residencyType: ResidencyType;
  setResidencyType: (r: ResidencyType) => void;
  onNext: () => void;
}> = ({ residencyType, setResidencyType, onNext }) => {
  const options: { id: ResidencyType; label: string; desc: string }[] = [
    { id: 'non_lucrative',  label: 'No Lucrativa',           desc: 'Residir sin trabajar. Requisitos médicos muy estrictos.' },
    { id: 'work',           label: 'Cuenta Ajena / Propia',  desc: 'Traslado por trabajo o emprendimiento.' },
    { id: 'golden_visa',    label: 'Golden Visa',            desc: 'Residencia por inversión.' },
    { id: 'reunification',  label: 'Reagrupación Familiar',  desc: 'Unirse a un familiar ya residente en España.' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        badge="Paso 6"
        title="¿Qué tipo de residencia solicitas?"
        description="Cada trámite tiene exigencias de cobertura distintas ante Extranjería."
      />
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.id as string}
            selected={residencyType === opt.id}
            onClick={() => { setResidencyType(opt.id); onNext(); }}
            title={opt.label}
            description={opt.desc}
          />
        ))}
      </div>
      {residencyType && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onNext} rightIcon={<ArrowRight className="w-5 h-5" />}>
            Continuar
          </Button>
        </div>
      )}
    </div>
  );
};

// Final – Contact
interface ContactStepProps {
  fullName: string; setFullName: (v: string) => void;
  phone: string;    setPhone:    (v: string) => void;
  email: string;    setEmail:    (v: string) => void;
  termsAccepted: boolean; setTermsAccepted: (v: boolean) => void;
  isValid: boolean;
  onSubmit: () => void;
}

const ContactStep: React.FC<ContactStepProps> = ({
  fullName, setFullName, phone, setPhone, email, setEmail,
  termsAccepted, setTermsAccepted, isValid, onSubmit,
}) => (
  <div className="flex flex-col gap-6">
    <StepHeader
      badge="Último paso"
      title="¿Dónde te enviamos la comparativa?"
      description="Recibirás las mejores opciones por correo y WhatsApp. Sin compromiso."
    />

    <div className="flex flex-col gap-4">
      {/* Full name */}
      <label className="flex flex-col gap-1.5">
        <span className="text-caption font-semibold text-text-main flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" /> Nombre completo
        </span>
        <input
          type="text"
          value={fullName}
          onChange={(e: { target: { value: string } }) => setFullName(e.target.value)}
          placeholder="Ej: Sofía Martínez"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-text-main placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
        />
      </label>

      {/* Phone */}
      <label className="flex flex-col gap-1.5">
        <span className="text-caption font-semibold text-text-main flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-primary" /> Teléfono / WhatsApp
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e: { target: { value: string } }) => setPhone(e.target.value)}
          placeholder="Ej: +34 600 000 000"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-text-main placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
        />
        <span className="text-caption text-text-secondary">Para enviarte el PDF interactivo con la comparativa.</span>
      </label>

      {/* Email */}
      <label className="flex flex-col gap-1.5">
        <span className="text-caption font-semibold text-text-main flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-primary" /> Correo electrónico
        </span>
        <input
          type="email"
          value={email}
          onChange={(e: { target: { value: string } }) => setEmail(e.target.value)}
          placeholder="Ej: sofia@ejemplo.com"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-text-main placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
        />
      </label>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <div
          onClick={() => setTermsAccepted(!termsAccepted)}
          className={`mt-0.5 size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            termsAccepted ? 'bg-primary border-primary' : 'border-slate-300 bg-white'
          }`}
        >
          {termsAccepted && <Check className="w-3 h-3 text-white stroke-[3]" />}
        </div>
        <span className="text-caption text-text-secondary leading-relaxed">
          Acepto la{' '}
          <a href="/privacidad" className="text-primary font-semibold underline underline-offset-2">
            política de privacidad
          </a>{' '}
          y el tratamiento de mis datos para recibir la comparativa.
        </span>
      </label>
    </div>

    <Button
      variant="accent"
      size="lg"
      onClick={onSubmit}
      disabled={!isValid}
      rightIcon={<ArrowRight className="w-5 h-5" />}
      className="w-full shadow-lg shadow-accent/15"
    >
      Calcular mis precios
    </Button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const QuotationWizard: React.FC<QuotationWizardProps> = ({
  onComplete,
  className = '',
}) => {
  const {
    profile, setProfile,
    duration, setDuration,
    startDate, setStartDate,
    visaRequired, setVisaRequired,
    ageRange, setAgeRange,
    travelFrequency, setTravelFrequency,
    residencyType, setResidencyType,
    continents, setContinents,
  } = useWizard();

  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ── Dynamic step sequence ──
  const getStepKeys = (): StepKey[] => {
    const keys: StepKey[] = ['intro', 'profile', 'duration', 'startDate', 'visa', 'ageRange'];
    if (profile === 'nomad') {
      keys.push('travelFrequency', 'continents');
    } else if (profile === 'expat') {
      keys.push('residencyType');
    }
    keys.push('contact');
    return keys;
  };

  const stepKeys = getStepKeys();
  const currentKey = stepKeys[step] ?? 'intro';

  // Stepper config (excludes intro, 1-indexed to match step.id)
  const stepperSteps = stepKeys
    .filter(k => k !== 'intro')
    .map((k, i) => ({ id: i + 1, title: STEP_TITLES[k as Exclude<StepKey, 'intro'>] }));
  // stepKeys.indexOf(currentKey) gives 0 for intro, 1 for profile, etc. → matches stepper ids perfectly
  const stepperCurrentStep = stepKeys.indexOf(currentKey);

  const goNext = () => setStep((s: number) => Math.min(s + 1, stepKeys.length - 1));
  const goPrev = () => setStep((s: number) => Math.max(s - 1, 0));

  const toggleContinent = (id: string) =>
    setContinents(continents.includes(id) ? continents.filter((c: string) => c !== id) : [...continents, id]);

  const isContactValid =
    fullName.trim().length >= 3 &&
    phone.trim().length >= 7 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    termsAccepted;

  const handleContactSubmit = () => {
    if (!isContactValid) return;
    onComplete?.({
      profile, duration, startDate, visaRequired, ageRange,
      travelFrequency, residencyType, continents,
      fullName, phone, email, termsAccepted,
    });
  };

  const renderStepContent = () => {
    switch (currentKey) {
      case 'intro':
        return <IntroStep profile={profile} onNext={goNext} />;
      case 'profile':
        return <ProfileStep profile={profile} setProfile={setProfile} onNext={goNext} />;
      case 'duration':
        return <DurationStep duration={duration} setDuration={setDuration} profile={profile} onNext={goNext} />;
      case 'startDate':
        return <StartDateStep startDate={startDate} setStartDate={setStartDate} profile={profile} onNext={goNext} />;
      case 'visa':
        return <VisaStep visaRequired={visaRequired} setVisaRequired={setVisaRequired} profile={profile} onNext={goNext} />;
      case 'ageRange':
        return <AgeRangeStep ageRange={ageRange} setAgeRange={setAgeRange} onNext={goNext} />;
      case 'travelFrequency':
        return <TravelFrequencyStep travelFrequency={travelFrequency} setTravelFrequency={setTravelFrequency} onNext={goNext} />;
      case 'continents':
        return <ContinentsStep continents={continents} toggleContinent={toggleContinent} onNext={goNext} />;
      case 'residencyType':
        return <ResidencyTypeStep residencyType={residencyType} setResidencyType={setResidencyType} onNext={goNext} />;
      case 'contact':
        return (
          <ContactStep
            fullName={fullName} setFullName={setFullName}
            phone={phone} setPhone={setPhone}
            email={email} setEmail={setEmail}
            termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted}
            isValid={isContactValid}
            onSubmit={handleContactSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col gap-6 w-full ${className}`}>
      {/* Stepper – hidden on intro step */}
      {currentKey !== 'intro' && (
        <Stepper steps={stepperSteps} currentStep={stepperCurrentStep} />
      )}

      {/* Animated step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${profile}`}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Back button – shown on non-intro, non-contact steps */}
      {currentKey !== 'intro' && currentKey !== 'contact' && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Atrás
          </Button>
          <span className="text-caption text-text-secondary">
            {stepKeys.indexOf(currentKey)} / {stepKeys.length - 1}
          </span>
        </div>
      )}

      {/* Back button on contact step */}
      {currentKey === 'contact' && (
        <div className="flex items-center pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={goPrev}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Atrás
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuotationWizard;
