import type { Recommendation, RecommendationCriteria, RecommendationDecision } from '@/domain/products/types';
import { PRODUCT_CATALOG } from '@/domain/products/catalog';
import { evaluateEligibility } from '@/domain/products/eligibility';
import { rankRecommendations } from '@/domain/products/ranking';

export type { Product, Recommendation, RecommendationDecision } from '@/domain/products/types';

export const PRODUCTS_BASE = PRODUCT_CATALOG;

type FilterCriteria = RecommendationCriteria;

export const getRecommendations = (criteria: FilterCriteria): Recommendation[] => {
  const { profile, visaRequired, ageRange, travelFrequency, residencyType, continents = [] } = criteria;

  // LOGIC: Drivers based on Marketing Research
  // 1. ADESLAS Driver: Administrative security (Visa) and Large Network (Families/Traditional)
  // 2. SANITAS Driver: Digital Experience (Youth/Nomads) and Premium Services (Exclusive Centers)

  const isVisaHighPriority = visaRequired === 'yes';
  const isDigitalPriority = profile === 'nomad' || ageRange === '18_24';
  const isNomadHighMobility = profile === 'nomad' && travelFrequency === 'high';
  const isNonLucrativeExpat = profile === 'expat' && residencyType === 'non_lucrative';
  const isGoldenVisaExpat = profile === 'expat' && residencyType === 'golden_visa';
  const isWorkerExpat = profile === 'expat' && residencyType === 'work';
  const includesUSA = continents.includes('NorthAmerica');

  if (isNonLucrativeExpat) {
    // Priority: ADESLAS (The standard for Non-Lucrative Visa)
    return [
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: true,
        whyItFits: 'Para la residencia no lucrativa, Extranjería exige un seguro equivalente al público. Adeslas es la opción más segura por su aceptación garantizada en consulados y su red nacional.'
      },
      { 
        ...PRODUCTS_BASE.sanitas, 
        isRecommended: false,
        whyItFits: 'Una alternativa de alta calidad con servicios digitales premium que también cumple los requisitos legales para tu residencia.'
      }
    ];
  }

  if (isGoldenVisaExpat) {
    // Priority: SANITAS (Premium/Exclusive Service)
    return [
      { 
        ...PRODUCTS_BASE.sanitas, 
        isRecommended: true,
        whyItFits: 'Para inversores y Golden Visa, Sanitas ofrece el nivel de servicio y exclusividad que buscas, con acceso a sus propios hospitales premium y gestión digital VIP.'
      },
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: false,
        whyItFits: 'La opción con la red de especialistas más extensa de España, ideal si prefieres tener la máxima libertad de elección de centros físicos.'
      }
    ];
  }

  if (isWorkerExpat) {
    // Priority: Balanced / Potential Savings
    return [
      { 
        ...PRODUCTS_BASE.sanitas, 
        isRecommended: true,
        whyItFits: 'Como trabajador en España ya tendrás acceso a la sanidad pública. Te recomendamos esta opción para agilizar tus visitas a especialistas y pruebas médicas con el mejor soporte digital.'
      },
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: false,
        price: 'Precio personalizado',
        whyItFits: 'Si buscas ahorro, esta alternativa con copagos te permite acceder a la red médica líder por una cuota mensual mínima, ideal como complemento a la Seguridad Social.'
      }
    ];
  }

  if (isNomadHighMobility) {
    // Priority: SANITAS (Best global support through Bupa)
    const sanitasResult = { 
      ...PRODUCTS_BASE.sanitas, 
      isRecommended: true,
      whyItFits: `Al viajar con frecuencia${includesUSA ? ' (incluyendo Norteamérica)' : ''}, necesitas el respaldo de una red global. Sanitas, junto a Bupa, te ofrece la mejor asistencia internacional y telemedicina 24/7 estés donde estés.`
    };

    if (includesUSA) {
      sanitasResult.price = 'Precio personalizado';
      sanitasResult.highlights = [...(sanitasResult.highlights || []), 'Cobertura USA'];
    }

    return [
      sanitasResult,
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: false,
        whyItFits: 'Una opción sólida si buscas la mayor red de médicos físicos en España para cuando regreses de tus viajes.'
      }
    ];
  }

  if (isVisaHighPriority) {
    // Priority: ADESLAS (The standard for Visas)
    return [
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: true,
        whyItFits: 'Es la opción más robusta para trámites de extranjería. Su certificado es aceptado sin excepciones y ofrece la red de médicos más amplia de España.'
      },
      { 
        ...PRODUCTS_BASE.sanitas, 
        isRecommended: false,
        whyItFits: 'Una excelente alternativa si además del visado buscas la mejor experiencia digital y videoconsultas médicas 24/7.'
      }
    ];
  }

  if (isDigitalPriority) {
    // Priority: SANITAS (Digital/Nomad leader)
    return [
      { 
        ...PRODUCTS_BASE.sanitas, 
        isRecommended: true,
        whyItFits: 'Ideal por su liderazgo en telemedicina y su red internacional. Perfecto si prefieres gestionar todo desde el móvil y acceder a hospitales propios premium.'
      },
      { 
        ...PRODUCTS_BASE.adeslas, 
        isRecommended: false,
        whyItFits: 'La alternativa sólida si buscas tener el máximo número de especialistas y clínicas disponibles en cualquier rincón del país.'
      }
    ];
  }

  // DEFAULT: Balanced (Adeslas first for its generalist network)
  return [
    { 
      ...PRODUCTS_BASE.adeslas, 
      isRecommended: true,
      whyItFits: 'Nuestra recomendación general por equilibrio entre precio y cobertura en la red médica más grande del país.'
    },
    { 
      ...PRODUCTS_BASE.sanitas, 
      isRecommended: false,
      whyItFits: 'Una opción superior en servicios digitales y acceso a centros médicos exclusivos de alta calidad.'
    }
  ];
};

/**
 * Explainable adapter for consumers that need ranking metadata instead of UI copy.
 * It intentionally reuses the proven ranking above until eligibility rules are split out.
 */
export const getRecommendationDecisions = (criteria: FilterCriteria): RecommendationDecision[] =>
  rankRecommendations(getRecommendations(criteria)).map(({ product, score }) => {
    const eligibility = evaluateEligibility(product, criteria);
    return ({
    productId: product.id,
    eligible: eligibility.eligible,
    score,
    reasons: [product.whyItFits],
    restrictions: [...eligibility.restrictions, ...(product.priceStatus === 'pending' || product.coverageStatus === 'pending'
      ? ['Precio y coberturas pendientes de verificación oficial']
      : [])],
    dataStatus: product.priceStatus === 'verified' && product.coverageStatus === 'verified'
      ? 'verified'
      : 'pending',
    });
  });
