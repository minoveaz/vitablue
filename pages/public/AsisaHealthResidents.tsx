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

export const AsisaHealthResidents: React.FC = () => {
  const navigate = useNavigate();
  const { setProfile, resetWizard } = useWizard();

  const handleStartQuoting = () => {
    resetWizard();
    setProfile('expat');
    navigate('/wizard?flow=residents&insurer=asisa');
  };

  const coverages = [
    {
      title: 'Homologación para Residencia Legal',
      desc: 'Cumple el 100% de los requisitos de Extranjería para Residencia No Lucrativa (RNL), Nómada Digital, Golden Visa o Arraigo.',
      illustration: HealthIllustration
    },
    {
      title: 'Sin Copagos Ni Franquicias',
      desc: 'Todas las consultas, pruebas, tratamientos y hospitalizaciones a coste 0€, tal como exige la legislación española a extranjeros residentes.',
      illustration: MedicalAttentionIllustration
    },
    {
      title: 'Hospitalización Quirúrgica y Médica',
      desc: 'Ingreso en habitación individual con cama para acompañante en la red hospitalaria Grupo HLA y centros asociados en toda España.',
      illustration: PreventionIllustration
    },
    {
      title: 'Repatriación Sanitaria y Funeraria',
      desc: 'Garantía ilimitada de traslado sanitario de urgencia y repatriación de restos mortales al país de nacionalidad de los asegurados.',
      illustration: TravelIllustration
    },
    {
      title: 'Especialistas y Medicina Preventiva',
      desc: 'Cardiología, oncología, traumatología, ginecología, chequeos anuales y acceso directo a más de 40.000 profesionales sin listas de espera.',
      illustration: FamilyIllustration
    },
    {
      title: 'Cobertura Dental Asisa Incluida',
      desc: 'Revisiones periódicas, extracciones, limpiezas y tarifas preferentes en implantes y ortodoncia en toda la red Asisa Dental.',
      illustration: DentalIllustration
    }
  ];

  const modalitiesList = [
    {
      name: 'ASISA Health Residents Anual',
      subtitle: 'Trámite Consular y Extranjería',
      desc: 'Póliza con pago anual íntegro, el formato legalmente exigido por los consulados y oficinas de extranjería para conceder la residencia inicial.',
      priceDetail: 'Desde 45,00€/mes (Pago Anual)',
      tag: 'Requerido Extranjería',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'ASISA Health Residents Familiar',
      subtitle: 'Titular + Cónyuge e Hijos',
      desc: 'Cobertura conjunta para toda la unidad familiar solicitante de residencia. Mismo certificado con desglose individualizado para el consulado.',
      priceDetail: 'Tarifa familiar bonificada',
      tag: 'Familias',
      badgeColor: 'bg-brand-cyan/10 text-primary border border-brand-cyan/20',
      isFeatured: false
    }
  ];

  const testimonials = [
    {
      author: 'George & Sarah T.',
      meta: 'Residencia No Lucrativa en Valencia (Reino Unido)',
      comment: 'Tramitamos la Non-Lucrative Visa desde Londres. El consulado exigía una póliza sin copagos y con hospitalización ilimitada. Asisa cumplió cada punto y en 24h teníamos los certificados oficiales.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Diego & Mariana P.',
      meta: 'Visado Nómada Digital en Málaga (Argentina)',
      comment: 'Como trabajadores remotos necesitábamos cobertura completa y un certificado rápido para la UGE. La gestión de VitaBlue con Asisa fue impecable.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      author: 'Robert K.',
      meta: 'Golden Visa en Alicante (EE.UU.)',
      comment: 'Acceso directo a la red hospitalaria HLA en Alicante. Atención en inglés desde la app AsisaLIVE y excelente servicio de los asesores.',
      stars: 5,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const faqs = [
    {
      q: '¿Por qué la ley española exige un seguro "sin copagos" para la residencia?',
      a: 'La Ley de Extranjería exige que los extranjeros que residan en España sin cotizar a la Seguridad Social tengan una cobertura médica pública equivalente a la del Sistema Nacional de Salud español, lo cual implica que no existan copagos ni franquicias que limiten el acceso al tratamiento.'
    },
    {
      q: '¿Es válido ASISA Health Residents para el visado de Nómada Digital?',
      a: 'Sí, es 100% válido y aceptado tanto por los Consulados de España en origen como por la Unidad de Grandes Empresas (UGE-CE) en solicitudes tramitadas directamente en España.'
    },
    {
      q: '¿El pago debe ser anual?',
      a: 'Sí. Para la solicitud o renovación de visados de residencia (Residencia No Lucrativa, Nómada Digital o Reagrupación Familiar), las autoridades exigen presentar el justificante de pago íntegro de los 12 meses de cobertura.'
    },
    {
      q: '¿Qué hospitales tengo disponibles en España?',
      a: 'Dispones de acceso preferente a los 18 hospitales del Grupo HLA (como el Hospital Moncloa en Madrid, Clínica El Ángel en Málaga, Santa Isabel en Sevilla, etc.) y a una red concertada con más de 40.000 facultativos en todo el territorio nacional.'
    }
  ];

  const canonicalUrl = 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/';
  const title = 'ASISA Health Residents | Seguro Residencia y Nómadas Digitales | VitaBlue';
  const description = 'Seguro médico oficial ASISA Health Residents para visado de residencia no lucrativa y nómadas digitales en España. Sin copagos, repatriación incluida y certificado 24h.';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'InsuranceAgency',
        '@id': 'https://www.vitablue.es/#organization',
        name: 'VitaBlue',
        url: 'https://www.vitablue.es/',
        logo: 'https://www.vitablue.es/assets/logo-vitablue.svg',
        description: 'Asesoría experta en seguros médicos para residencia legal y extranjería en España.',
        telephone: '+34 694 58 34 52'
      },
      {
        '@type': 'FinancialProduct',
        '@id': `${canonicalUrl}#producto`,
        name: 'ASISA Health Residents',
        description: 'Seguro médico para residencia no lucrativa y nómadas digitales en España. Sin copagos, hospitalización ilimitada y repatriación médica.',
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
            name: 'ASISA Health Residents',
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
          { label: 'ASISA Health Residents', href: canonicalUrl }
        ]}
      />

      <ProductHero
        badges={[
          { label: 'Homologado Residencia España', tone: 'brand', icon: <FileCheck className="w-3.5 h-3.5" /> },
          { label: 'Sin Copagos ni Carencias', tone: 'accent' },
          { label: 'IPID AFR01S0128' }
        ]}
        title="ASISA Health Residents: Seguro Médico para Residencia No Lucrativa y Nómadas"
        description="Póliza completa exigida por consulados y oficinas de extranjería para vivir en España. Sin copagos, con hospitalización completa, repatriación médica y certificado oficial en 24h."
        primaryAction={{
          label: 'Calcular Seguro Residencia',
          onClick: handleStartQuoting
        }}
        secondaryAction={{
          label: 'Hablar con Especialista',
          href: buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'ASISA-RESIDENTS' })
        }}
      >
        <QuoteEstimator
          title="Cotizador ASISA Health Residents"
          description="Calcula tu prima oficial según edad para visados de residencia en España."
          initialAge={38}
          minAge={18}
          maxAge={75}
          options={[
            { id: 'individual', label: 'Titular Individual' },
            { id: 'familiar', label: 'Unidad Familiar' }
          ]}
          calculatePrice={(age) => {
            if (age < 30) return '45.00';
            if (age <= 45) return '54.50';
            if (age <= 55) return '68.00';
            if (age <= 65) return '89.00';
            return 'Consultar';
          }}
          onSubmit={handleStartQuoting}
        />
      </ProductHero>

      <ProductTrustBar
        items={[
          { icon: <ShieldCheck />, title: 'Validez Legal Extranjería', description: 'Garantía total de cumplimiento ante Consulados y UGE-CE.' },
          { icon: <Clock />, title: 'Certificado en 24 Horas', description: 'Documento en PDF con firma electrónica y código CSV oficial.' },
          { icon: <Award />, title: '100% Reembolso por Denegación', description: 'Devolución de la prima anual si el visado resulta rechazado.' }
        ]}
      />

      <ProviderLogoBar
        eyebrow="Aseguradora autorizada para extranjería"
        providers={[
          { name: 'Asisa', logoSrc: '/images/logo-asisa.png' },
          { name: 'Grupo HLA', logoSrc: '/images/logo-asisa.png' }
        ]}
      />

      <PlanComparisonSection
        eyebrow="Modalidades de Residencia"
        title="Opciones para particulares y familias que se trasladan a España"
        description="Adaptado para Residencia No Lucrativa, Nómada Digital, Arraigo o Golden Visa."
        plans={modalitiesList.map((item) => ({
          name: item.name,
          subtitle: item.subtitle,
          desc: item.desc,
          priceDetail: item.priceDetail,
          tag: item.tag,
          isFeatured: item.isFeatured
        }))}
        onPlanAction={handleStartQuoting}
        actionLabel="Cotizar esta modalidad"
      />

      <CoverageGrid
        eyebrow="Garantías Médicas del Visado"
        title="Cobertura equivalente al Sistema Nacional de Salud español"
        description="Especificaciones técnicas y coberturas completas según el IPID oficial AFR01S0128."
        items={coverages.map(({ title: t, desc: d, illustration: ill }) => ({ title: t, description: d, illustration: ill }))}
      />

      <ProductProcessSection
        eyebrow="Tramitación Rápida"
        title="Cómo conseguir tu seguro para la residencia en 4 pasos"
        description="Gestión online sencilla con la supervisión de nuestros especialistas en extranjería."
        steps={[
          {
            title: 'Indica los datos de los solicitantes',
            description: 'Edades y tipo de visado (No Lucrativa, Nómada Digital, Reagrupación Familiar).'
          },
          {
            title: 'Cuestionario de salud digital',
            description: 'Breve declaración de salud requerida para la emisión de la póliza de Asisa.'
          },
          {
            title: 'Abono de la prima anual',
            description: 'Pago mediante tarjeta de crédito o transferencia bancaria en entorno 100% seguro.'
          },
          {
            title: 'Descarga del certificado consular',
            description: 'Recibe en tu email el certificado oficial con código CSV para adjuntar al expediente.'
          }
        ]}
      />

      <TestimonialGrid
        eyebrow="Casos Reales"
        title="Residentes y nómadas digitales que ya viven en España con Asisa"
        items={testimonials}
      />

      <AsisaTrustSection />

      <DigitalServicesSection
        eyebrow="Telemedicina AsisaLIVE"
        title="Atención médica inmediata estés donde estés"
        description="Accede a videoconsultas médicas 24/7 en tu smartphone, recetas electrónicas y gestión de autorizaciones sin desplazamientos."
        benefits={[
          'Videoconsultas con médicos de cabecera y especialistas',
          'Receta médica electrónica válida en todas las farmacias de España',
          'Atención multilingüe para expatriados y residentes',
          'Historial clínico digital accesible en todo momento'
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
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Extranjería</span>
                  <p className="text-xs font-bold leading-tight">Certificado de Residencia</p>
                  <p className="text-[9px] text-slate-200">Emisión digital homologada</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-left space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-cyan">Médico HLA</span>
                  <p className="text-xs font-bold leading-tight">Urgencias y Hospitalización</p>
                  <p className="text-[9px] text-slate-200">18 hospitales en España</p>
                </div>
              </div>
              <div className="text-[9px] font-bold text-center text-white/80 pb-2">
                Sin Copagos • Sin Carencias
              </div>
            </div>
          </div>
        }
      />

      <ProductPromotionSection
        badges={[
          <span key="1" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-background-dark">Compromiso Consular</span>,
          <span key="2" className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">Reembolso 100%</span>
        ]}
        title="Garantía de Devolución por Denegación de Residencia"
        description="Si tu visado de residencia no lucrativa o nómada digital resulta denegado por el consulado o Extranjería, Asisa te devuelve el 100% del dinero pagado."
      />

      <FaqSection
        eyebrow="Preguntas Frecuentes"
        title="Resolvemos tus dudas sobre el seguro de salud para la residencia en España"
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      <AdvisorHelpSection
        title="¿Tienes dudas sobre los requisitos de extranjería para tu expediente?"
        description="Nuestros asesores especializados en visados de residencia en VitaBlue te orientan de forma gratuita sobre la documentación sanitaria exigida."
        whatsappUrl={buildContextualWhatsAppUrl({ pathname: canonicalUrl, tag: 'LANDING-ASISA-RESIDENTS-HELP' })}
      />
    </div>
  );
};

export default AsisaHealthResidents;
