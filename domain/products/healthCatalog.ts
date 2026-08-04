export interface HealthLandingPlan {
  id: string;
  name: string;
  subtitle: string;
  desc?: string;
  price?: string;
  priceDetail?: string;
  recommended?: boolean;
  [key: string]: unknown;
}

export const getStudentPlans = (isEnglish: boolean) => isEnglish ? [
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'The preferred choice for student visas. Includes the Blua telemedicine module free forever, unlimited video consults, and immediate official certificate.',
      priceDetail: 'Consular PDF certificate instantly',
      tag: 'Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Extra',
      subtitle: 'Standard Network Insurance',
      desc: 'Excellent national medical coverage from Adeslas with zero copays. Includes repatriation and international reimbursement for emergencies outside Spain.',
      priceDetail: 'Large network of private hospitals',
      tag: 'Alternative',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas International Students',
      subtitle: 'Premium Digital',
      desc: 'La opción predilecta para el visado de estudiantes. Incluye el módulo Blua de telemedicina gratis para siempre, videoconsultas ilimitadas y certificado oficial inmediato.',
      priceDetail: 'Certificado consular en PDF al instante',
      tag: 'Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Extra',
      subtitle: 'Seguro Médico de Cuadro',
      desc: 'Excelente cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y reembolso internacional para emergencias fuera de España en periodos vacacionales.',
      priceDetail: 'Gran red de clínicas concertadas',
      tag: 'Alternativa',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];


export const getExpatPlans = (isEnglish: boolean) => isEnglish ? [
    {
      name: 'Sanitas Más Salud (No Copay)',
      subtitle: 'VIP Digital Coverage',
      desc: 'The leading policy for residence visas. Includes the Blua telemedicine module free forever, premium hospitalization, and immediate consular certificate.',
      priceDetail: 'Consular certificate in 24h included',
      tag: 'Best Seller',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total',
      subtitle: '3-Year Price Lock',
      desc: 'Excellent national medical coverage option from Adeslas with zero copays. Includes repatriation and a protected renewal price during the first three years.',
      priceDetail: 'Expanded Adeslas medical network',
      tag: 'Excellent Quality',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas Más Salud (Sin Copago)',
      subtitle: 'Cobertura VIP Digital',
      desc: 'La póliza líder para visados de residencia. Incluye el módulo Blua de telemedicina gratis para siempre, hospitalización premium y certificado consular de emisión inmediata.',
      priceDetail: 'Certificado consular en 24h incluido',
      tag: 'Más Vendido',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total',
      subtitle: 'Tranquilidad 3 Años',
      desc: 'Excelente opción de cobertura médica nacional de Adeslas sin copagos. Incluye repatriación y un precio de renovación protegido durante los primeros tres años.',
      priceDetail: 'Red médica Adeslas ampliada',
      tag: 'Excelente Calidad',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];


export const getNomadPlans = (isEnglish: boolean) => isEnglish ? [
    {
      name: 'Sanitas International Students / Nomads',
      subtitle: 'Premium Digital',
      desc: 'The ideal digital option for remote workers in Spain. Blua free forever, video consultations in 5 minutes in English, and immediate PDF certificate accepted by UGE.',
      priceDetail: 'Approved coverage certificate in 24h',
      tag: 'Most Recommended',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total (Nomads)',
      subtitle: 'Network Medical Insurance',
      desc: 'Excellent Adeslas national medical policy with zero copays. Includes a large national network of partner hospitals and mandatory sanitary repatriation.',
      priceDetail: 'Adeslas expanded medical network',
      tag: 'Solid Alternative',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ] : [
    {
      name: 'Sanitas International Students / Nomads',
      subtitle: 'Premium Digital',
      desc: 'La opción digital ideal para trabajadores remotos en España. Blua gratis para siempre, videoconsultas en 5 minutos en inglés y certificado inmediato en PDF aceptado por la UGE.',
      priceDetail: 'Certificado de cobertura homologado en 24h',
      tag: 'Más Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Adeslas Plena Total (Nomads)',
      subtitle: 'Seguro Médico de Cuadro',
      desc: 'Excelente póliza médica nacional de Adeslas sin copagos. Incluye gran red nacional de hospitales concertados y repatriación sanitaria obligatoria.',
      priceDetail: 'Red médica Adeslas ampliada',
      tag: 'Alternativa Sólida',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    }
  ];

