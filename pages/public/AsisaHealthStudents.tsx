import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Award, Smartphone, FileCheck } from 'lucide-react';
import ProductProcessSection from '../../components/organisms/ProductProcessSection';
import { useWizard } from '../../context/WizardContext';
import ProductBreadcrumbBar from '../../components/organisms/ProductBreadcrumbBar';
import FaqSection from '../../components/organisms/FaqSection';
import AdvisorHelpSection from '../../components/organisms/AdvisorHelpSection';
import AsisaTrustSection from '../../components/organisms/AsisaTrustSection';
import TestimonialGrid from '../../components/organisms/TestimonialGrid';
import QuoteEstimator from '../../components/molecules/QuoteEstimator';
import CoverageGrid from '../../components/organisms/CoverageGrid';
import ProductHero from '../../components/organisms/ProductHero';
import ProductTrustBar from '../../components/organisms/ProductTrustBar';
import ProviderLogoBar from '../../components/organisms/ProviderLogoBar';
import PlanComparisonSection from '../../components/organisms/PlanComparisonSection';
import ProductPromotionSection from '../../components/organisms/ProductPromotionSection';
import DigitalServicesSection from '../../components/organisms/DigitalServicesSection';
import { buildContextualWhatsAppUrl } from '@/utils/whatsappLinks';
import {
  HealthIllustration,
  MedicalAttentionIllustration,
  DentalIllustration,
  PreventionIllustration,
  TravelIllustration,
  FamilyIllustration
} from '../../components/illustrations';

export const AsisaHealthStudents: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('student');
    navigate('/wizard?flow=students&insurer=asisa');
  };

  const coverages = [
    {
      title: 'Cumplimiento 100% Visado de Estudios',
      desc: 'Póliza sin copagos, sin franquicias y sin carencias. Aceptada por todos los consulados de España y en expedientes de extranjería MERCURIO.',
      illustration: HealthIllustration
    },
    {
      title: 'Repatriación Médica y de Restos',
      desc: 'Garantía ilimitada de traslado sanitario o repatriación al país de origen por enfermedad grave o fallecimiento, requerimiento consular obligatorio.',
      illustration: TravelIllustration
    },
    {
      title: 'Hospitalización y Cirugías Ilimitadas',
      desc: 'Habitación individual para el estudiante en toda la red hospitalaria del Grupo HLA y centros asociados de Asisa en España sin límites de estancia.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Especialistas Médicos Sin Esperas',
      desc: 'Acceso directo a más de 40.000 facultativos: traumatología, dermatología, salud mental, ginecología y medicina general.',
      illustration: PreventionIllustration
    },
    {
      title: 'Urgencias 24/7 y AsisaLIVE',
      desc: 'Atención urgente en clínicas HLA en cualquier provincia de España y videoconsultas médicas en español e inglés desde el smartphone.',
      illustration: FamilyIllustration
    },
    {
      title: 'Garantía Dental Básica',
      desc: 'Consultas, revisiones periódicas, extracciones simples y limpiezas de boca incluidas sin coste en la red odontológica Asisa Dental.',
      illustration: DentalIllustration
    }
  ];

  const modalitiesList = [
    {
      name: 'ASISA Health Students Anual',
      subtitle: 'Exigido por Consulados',
      desc: 'Pago único de 12 meses con emisión inmediata del certificado oficial con código seguro de verificación (CSV). Imprescindible para solicitud de visado inicial en origen.',
      priceDetail: 'Desde 35,00€/mes (Pago Único)',
      tag: 'Recomendado Visado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Students Semestral',
      subtitle: 'Programas Cortos / Erasmus',
      desc: 'Diseñado para estancias de intercambio o posgrados de un semestre (hasta 6 meses). Incluye idéntica cobertura completa y repatriación.',
      priceDetail: 'Desde 39,00€/mes',
      tag: 'Estancias Cortas',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'Camila R.',
      meta: 'Máster en Madrid (Colombia)',
      comment: 'El consulado en Bogotá me pedía un seguro sin copagos y con repatriación. En menos de 24h VitaBlue me envió la póliza de Asisa con el certificado oficial y me aprobaron la visa sin requerimientos.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Mateo V.',
      meta: 'Grado en Barcelona (México)',
      comment: 'Excelente atención. Pude usar la app AsisaLIVE para una consulta médica en mi primera semana en Barcelona. La receta me sirvió directamente en la farmacia.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Valeria M.',
      meta: 'Intercambio Erasmus (Perú)',
      comment: 'Comparé varias opciones y Asisa Students fue la más económica con toda la red del hospital Moncloa incluida. Súper recomendado.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Cumple ASISA Health Students con todos los requisitos del visado de estudiante en España?',
      a: 'Sí, cumple el 100% de la normativa legal de Extranjería española y de los Consulados: seguro médico completo con hospitalización, 0€ copagos en todas las prestaciones, sin periodos de carencia y con cobertura de repatriación médica y funeraria ilimitada.'
    },
    {
      q: '¿En cuánto tiempo recibo el certificado para el consulado?',
      a: 'Una vez formalizada la contratación y el pago de la prima, el certificado oficial con código de verificación (CSV) y firma digital se emite en un plazo de 24 a 48 horas laborables en formato PDF.'
    },
    {
      q: '¿Qué ocurre si me deniegan el visado de estudios?',
      a: 'Si el consulado deniega tu solicitud de visado, Asisa te devuelve el 100% del importe pagado presentando la carta oficial de denegación consular antes de la fecha de inicio del seguro.'
    },
    {
      q: '¿Puedo acudir a los hospitales del Grupo HLA?',
      a: 'Sí, tienes acceso directo e ilimitado a los 18 hospitales y más de 36 centros multiespecialidad del Grupo HLA en España (como el Hospital Universitario Moncloa en Madrid o HLA Vistahermosa en Alicante).'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/';
  const title = 'ASISA Health Students | Seguro Visado de Estudiante España | VitaBlue';
  const description = 'Seguro médico oficial ASISA Health Students para visado de estudios y NIE en España. Sin copagos, sin carencias, repatriación médica incluida y certificado 24h.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: 'Asesoría oficial de seguros de salud homologados para visados y extranjeros en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Health Students',
        description: 'Seguro médico para estudiantes internacionales exigido para el visado de estudios en España: 0 copagos, 0 carencias y repatriación médica.',
        brand: {
          '@type': 'Brand',
          name: 'ASISA'
        },
        provider: {
          '@id': 'https://www.vitablue.es/#organization'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: 'https://www.vitablue.es/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Seguros de Salud',
            item: 'https://www.vitablue.es/productos/seguros-salud/'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Seguros Asisa',
            item: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'ASISA Health Students',
            item: canonicalUrl
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      }
    ]
  };

  return (
    <div className="w-full flex flex-col bg-white">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      <ProductBreadcrumbBar
        items={[
          { label: 'Seguros de Salud', href: '/productos/seguros-salud' },
          { label: 'Seguros Asisa', href: '/productos/seguros-salud/seguros-asisa' },
          { label: 'ASISA Health Students', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={[
          { label: 'Póliza Oficial Visado España', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Sin Copagos ni Carencias', tone: 'accent' },
          { label: 'IPID AFR01S0125' }
        ]}
        title="ASISA Health Students: El Seguro Médico para tu Visado de Estudios"
        description="Póliza de cobertura sanitaria total homologada por Extranjería y Consulados. Repatriación médica ilimitada, 0 copagos y certificado oficial con CSV para tu expediente en 24h."
        primaryAction={{
          label: 'Calcular Seguro Estudiante',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: 'Consultar por WhatsApp',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-STUDENTS' })
        }}
      >
        <QuoteEstimator
          title="Cotizador ASISA Health Students"
          description="Tarifa plana oficial para estudiantes internacionales de 18 a 35 años."
          initialAge={22}
          minAge={16}
          maxAge={35}
          options={[
            { id: 'anual', label: 'Anual (Visado 12 meses)' },
            { id: 'semestral', label: 'Semestral (Hasta 6 meses)' }
          ]}
          calculatePrice={(_age, option) => {
            if (option === 'semestral') return '39.00';
            return '35.00';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={[
          { icon: <ShieldCheck />, title: '100% Validez Consular', description: 'Garantía de cumplimiento de requisitos de Extranjería.' },
          { icon: <Clock />, title: 'Certificado en 24 Horas', description: 'Documento en PDF con firma electrónica para adjuntar al visado.' },
          { icon: <Award />, title: 'Devolución Garantizada', description: 'Reembolso del 100% de la prima si tu visado resulta denegado.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow="Aseguradora oficial del visado"
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow="Modalidades Oficiales"
        title="Opciones adaptadas a la duración de tus estudios"
        description="Elige la modalidad que corresponda con tu carta de admisión académica en España."
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel="Seleccionar este plan"
      />

      <CoverageGrid
        eyebrow="Coberturas Exigidas por Ley"
        title="Todo lo que exige Extranjería incluido de serie"
        description="Especificaciones técnicas y garantías médicas completas según el IPID oficial AFR01S0125."
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow="Trámite Rápido"
        title="Consigue tu certificado consular en 4 pasos"
        description="Proceso 100% digital diseñado para estudiantes extranjeros con acompañamiento de nuestros especialistas."
        steps={[
          {
            title: 'Cotiza tus fechas de estudio',
            description: 'Indica la fecha de inicio y fin de tu curso académico o programa de intercambio en España.'
          },
          {
            title: 'Datos del pasaporte',
            description: 'Ingresa tus datos personales y número de pasaporte para emitir la póliza a tu nombre.'
          },
          {
            title: 'Pago seguro online',
            description: 'Realiza el abono de la prima anual requerida por el consulado mediante tarjeta o transferencia.'
          },
          {
            title: 'Descarga tu Certificado',
            description: 'Recibe en tu correo el certificado oficial en español con código CSV listo para presentar a la embajada.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow="Testimonios"
        title="Estudiantes internacionales que ya estudian en España con Asisa"
        items={testimonials}
      />

      <AsisaTrustSection />

      <DigitalServicesSection
        eyebrow="Telemedicina AsisaLIVE"
        title="Médico en tu móvil estés donde estés"
        description="No te preocupes por desplazarte si enfermas durante tus estudios. Con AsisaLIVE tienes acceso inmediato a videoconsultas médicas 24/7 en español e inglés."
        benefits={[
          'Videoconsultas de urgencia sin cita previa',
          'Receta médica electrónica homologada en farmacias',
          'Especialistas en salud mental y orientación psicológica',
          'Gestión de autorizaciones médicas desde la app'
        ]}
        visual={
          <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-20" />
            <div className="w-full h-full bg-primary rounded-[2rem] overflow-hidden p-4 text-white relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="size-8 rounded-full bg-white/20 flex items-center justify-center mt-3">
                  <Smartphone className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-lg font-display font-black leading-snug">AsisaLIVE App</h4>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Telemedicina</span>
                  <p className="text-xs font-bold leading-tight">Consulta Médica Urgente</p>
                  <p className="text-[9px] text-slate-200">Tiempo de espera medio: &lt; 4 min</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Certificado Digital</span>
                  <p className="text-xs font-bold leading-tight">Póliza con Código Seguro</p>
                  <p className="text-[9px] text-slate-200">Disponible en PDF 24h</p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                Red Hospitalaria HLA Incluida
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={[
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Aceptación Garantizada</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Consulados y MERCURIO</span>
        ]}
        title="Garantía de Devolución por Denegación de Visado"
        description="Si tu visado es denegado por cualquier motivo consular, Asisa te reembolsa el 100% de la prima abonada presentando la resolución oficial."
      />

      <FaqSection
        eyebrow="Preguntas Frecuentes"
        title="Resolvemos todas tus dudas sobre ASISA Health Students"
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title="¿Tienes dudas sobre los requisitos específicos de tu consulado?"
        description="Cada embajada o consulado tiene particularidades según el país de origen. Nuestro equipo de asesores de visado en VitaBlue revisa tu expediente gratis."
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-STUDENTS-HELP' })}
      />
    </div>
  );
};

export default AsisaHealthStudents;
