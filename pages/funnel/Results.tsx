import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  MessageSquare,
  PlaneLanding,
  RefreshCw,
  School,
  ShieldCheck,
  Smartphone,
  User,
  Video,
  MapPin,
} from 'lucide-react';
import { useWizard } from '@/context/WizardContext';
import { getRecommendations } from '@/utils/recommendationEngine';
import { getWhatsAppLink } from '@/utils/whatsappRedirect';
import ProductCard from '@/components/molecules/ProductCard';
import AdvisorCard from '@/components/molecules/AdvisorCard';
import ProductTransparencySection from '@/components/organisms/ProductTransparencySection';
import Button from '@/components/atoms/Button';

const profileTitles: Record<string, string> = {
  student: 'Estudiante internacional',
  expat: 'Residente / expatriado',
  nomad: 'Nómada digital',
};

const Results: React.FC = () => {
  const navigate = useNavigate();
  const state = useWizard();
  const { resetWizard, profile, visaRequired, duration, ageRange, startDate, travelFrequency, residencyType, continents, isComplete } = state;

  const hasSession = Boolean(isComplete && profile && ageRange && visaRequired && duration && startDate);

  const recommendations = useMemo(() => {
    if (!hasSession) return [];
    return getRecommendations({
      profile,
      visaRequired,
      duration,
      ageRange,
      travelFrequency,
      residencyType,
      continents,
    });
  }, [hasSession, profile, visaRequired, duration, ageRange, travelFrequency, residencyType, continents]);

  const handleWhatsAppRedirect = () => {
    window.open(getWhatsAppLink(state), '_blank', 'noopener,noreferrer');
  };

  const handleRecalculate = () => {
    resetWizard();
    navigate('/wizard');
  };

  const getProfileLabel = () => {
    if (!profile) return 'Sin definir';
    return profileTitles[profile] ?? 'Perfil';
  };

  const getDurationLabel = () => {
    switch (duration) {
      case 'less_6':
        return 'Menos de 6 meses';
      case '6_12':
        return '6 - 12 meses';
      case 'more_12':
        return 'Más de 12 meses';
      default:
        return 'Sin definir';
    }
  };

  const getStartDateLabel = () => {
    switch (startDate) {
      case 'weeks':
        return 'En las próximas semanas';
      case 'month':
        return 'El próximo mes';
      case 'later':
        return 'Más adelante';
      default:
        return 'Sin definir';
    }
  };

  const getAgeLabel = () => {
    switch (ageRange) {
      case '18_24':
        return '18 - 24 años';
      case '25_30':
        return '25 - 30 años';
      case '31_40':
        return '31 - 40 años';
      case 'plus_40':
        return '+ 40 años';
      default:
        return 'Sin definir';
    }
  };

  const getVisaLabel = () => {
    switch (visaRequired) {
      case 'yes':
        return 'Necesario';
      case 'no':
        return 'No necesario';
      case 'unknown':
        return 'No lo sé';
      default:
        return 'Sin definir';
    }
  };

  const getTravelLabel = () => {
    switch (travelFrequency) {
      case 'low':
        return 'Baja movilidad';
      case 'high':
        return 'Alta movilidad';
      default:
        return 'No aplica';
    }
  };

  const getResidencyLabel = () => {
    switch (residencyType) {
      case 'non_lucrative':
        return 'Residencia no lucrativa';
      case 'work':
        return 'Trabajo';
      case 'golden_visa':
        return 'Golden Visa';
      case 'reunification':
        return 'Reagrupación familiar';
      default:
        return 'No aplica';
    }
  };

  const getContinentLabel = () => {
    if (!continents.length) return 'No seleccionado';
    return continents.length === 1 ? continents[0] : `${continents.length} regiones`;
  };

  const criteriaCards = [
    { label: 'Perfil', value: getProfileLabel(), icon: School },
    { label: 'Edad', value: getAgeLabel(), icon: User },
    { label: 'Estancia', value: getDurationLabel(), icon: PlaneLanding },
    { label: 'Inicio', value: getStartDateLabel(), icon: Calendar },
    { label: 'Visado', value: getVisaLabel(), icon: ShieldCheck },
    ...(profile === 'nomad'
      ? [
          { label: 'Movilidad', value: getTravelLabel(), icon: Globe },
          { label: 'Regiones', value: getContinentLabel(), icon: MapPin },
        ]
      : []),
    ...(profile === 'expat'
      ? [{ label: 'Residencia', value: getResidencyLabel(), icon: Clock }]
      : []),
  ];

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background-light px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
        <Helmet>
          <title>Comparativa de Seguros de Salud | VitaBlue</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="w-full max-w-2xl text-center flex flex-col items-center gap-6">
          <div className="size-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-text-secondary shadow-sm">
            <RefreshCw className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-3 max-w-xl">
            <h1 className="text-h1 font-display font-black text-text-main">No tienes cotizaciones activas</h1>
            <p className="text-body-lg text-text-secondary font-medium leading-relaxed">
              Completa el cotizador para calcular una comparativa real y ver solo pólizas compatibles con tu perfil.
            </p>
          </div>
          <Link to="/wizard">
            <Button size="lg" className="shadow-md">
              Comenzar cotización
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light pb-20">
      <Helmet>
        <title>Tus recomendaciones de seguro | VitaBlue</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </button>

            <button
              onClick={handleRecalculate}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recalcular seguro
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-caption font-black text-primary uppercase tracking-[0.25em] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent fill-current" /> Comparativa realizada
              </span>
              <h1 className="text-h1 font-display font-black text-text-main">
                Tus opciones de seguro para {getProfileLabel()}
              </h1>
              <p className="text-body-lg text-text-secondary font-medium leading-relaxed max-w-3xl">
                Hemos analizado tus respuestas para mostrar solo aseguradoras que encajan con tu perfil y con la lógica de recomendación real.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-white p-5 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {criteriaCards.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-caption uppercase tracking-widest text-text-secondary">{item.label}</p>
                      <p className="text-body-reg font-bold text-text-main break-words">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-primary-dark text-white shadow-xl">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-h2 font-display font-black tracking-tight">Criterio de recomendación</h2>
                  <p className="text-body-lg font-medium leading-relaxed text-slate-300">
                    Solo mostramos pólizas que cumplen con los requisitos clave de tu perfil: cobertura suficiente, claridad en la contratación y condiciones coherentes con visado o residencia.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-caption font-bold uppercase tracking-wider text-primary">Asesoría neutral</span>
                  <span className="rounded-full bg-brand-cyan/15 px-3 py-1 text-caption font-bold uppercase tracking-wider text-brand-cyan">100% gratis</span>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-caption font-bold uppercase tracking-wider text-accent">Soporte humano</span>
                </div>
              </div>

              <div className="relative min-h-[220px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=900')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-transparent lg:bg-gradient-to-l" />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 max-w-3xl">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-whatsapp/10 text-whatsapp flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-h3 font-display font-black text-text-main">¿Prefieres que te ayudemos por WhatsApp?</h2>
                    <p className="text-body-reg text-text-secondary font-medium">
                      Un asesor real puede resolver tus dudas sobre visado, coberturas y contratación sin coste ni compromiso.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-caption font-bold uppercase tracking-wider text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-whatsapp" /> Respuesta humana
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-primary" /> WhatsApp directo
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-accent" /> Sin bots
                  </span>
                </div>
              </div>

              <div className="w-full">
                <AdvisorCard onWhatsAppClick={handleWhatsAppRedirect} onPhoneClick={() => window.open('tel:+34694583452')} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-h2 font-display font-black text-text-main">Las opciones que mejor encajan</h2>
            <div className="flex flex-col gap-12">
              {recommendations.map((product, index) => (
                <React.Fragment key={product.id}>
                  {index === 1 && (
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-background-light px-4 text-caption font-black uppercase tracking-[0.2em] text-text-secondary">
                          O tal vez te interese...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    <ProductCard {...product} onWhatsAppClick={handleWhatsAppRedirect} />

                    {profile === 'nomad' && index === 0 && (
                      <div className="bg-white rounded-[2rem] border border-slate-200/70 p-6 sm:p-8 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                          <Video className="text-primary w-6 h-6" />
                          <h3 className="text-h3 font-display font-black text-text-main">Tu experiencia real con este seguro</h3>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-3">
                          {[
                            {
                              title: 'Consulta en Bangkok',
                              icon: Smartphone,
                              desc: 'Dolor leve. Chat médico en 15 min. Receta digital válida en farmacia local.',
                            },
                            {
                              title: 'Urgencia en Argentina',
                              icon: MapPin,
                              desc: 'Accidente. Geolocalización de hospital concertado. Pago directo del seguro.',
                            },
                            {
                              title: 'Control en Portugal',
                              icon: Clock,
                              desc: 'Seguimiento médico. Video-consulta programada. Continuidad total.',
                            },
                          ].map((caseItem) => (
                            <div key={caseItem.title} className="flex flex-col gap-3">
                              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <caseItem.icon className="w-5 h-5" />
                              </div>
                              <p className="text-body-reg font-bold text-text-main">{caseItem.title}</p>
                              <p className="text-caption text-text-secondary leading-relaxed">{caseItem.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <ProductTransparencySection
                      className="px-2"
                        title={`Transparencia: ${product.name}`}
                        inclusions={product.inclusions}
                        exclusions={product.exclusions}
                        description="Es importante que sepas tanto lo que está cubierto como lo que queda fuera, para evitar sorpresas."
                      />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                resetWizard();
                navigate('/wizard');
              }}
              className="text-sm font-bold text-text-secondary hover:text-primary transition-colors underline underline-offset-4"
            >
              Reiniciar consulta desde el principio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
