export interface ProductPlan {
  id: string;
  name: string;
  subtitle: string;
  description?: string;
  price?: string;
  priceDetail?: string;
  recommended?: boolean;
  [key: string]: unknown;
}

export const sanitasMascotasPlans = [
    {
      name: 'Mascotas Básica',
      subtitle: 'Solo consultas',
      desc: 'Perfecto para la prevención diaria. Cubre consultas veterinarias gratuitas ilimitadas y la vacuna de la rabia obligatoria, pagando tarifas especiales por cirugías.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Esencial',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    },
    {
      name: 'Mascotas Completa',
      subtitle: 'Clínicas + Cirugía',
      desc: 'El plan más equilibrado. Añade cobertura total de hospitalización veterinaria y cirugías por enfermedad o accidente dentro de la amplia red de Sanitas.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Mascotas Reembolso',
      subtitle: 'Cualquier veterinario',
      desc: 'Máxima libertad de elección. Te permite acudir a cualquier clínica veterinaria de España (incluso fuera del cuadro de Sanitas) y te reembolsamos el 80% de la factura.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Libre Elección',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
    }
  ];


export const travelPlans = [
    {
      name: 'Viaje Estándar',
      subtitle: 'Escapadas y vacaciones',
      desc: 'La cobertura clásica para viajes vacacionales cortos. Cubre asistencia médica de urgencia hasta 50.000€, repatriación ilimitada y pérdida básica de equipaje.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Más Económico',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    },
    {
      name: 'Viaje Estrella',
      subtitle: 'Protección Ampliada',
      desc: 'Perfecto para viajes transoceánicos o fuera de Europa. Eleva la cobertura médica hasta los 150.000€ e incluye cobertura de cancelación de viaje por fuerza mayor.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Más Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Viaje Premium',
      subtitle: 'Larga Estancia / Multiviaje',
      desc: 'Diseñado para nómadas y viajeros frecuentes. Permite cubrir viajes de larga duración o contratar una póliza anual que cubre todos tus viajes del año hasta 90 días por salida.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Alta Cobertura',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
    }
  ];


export const lifePlans = [
    {
      name: 'Vida Esencial',
      subtitle: 'Protección familiar básica',
      desc: 'Perfecto para quienes buscan cubrir el capital mínimo de sepelio y asegurar el sustento básico de sus hijos. Cubre fallecimiento por cualquier causa a coste mínimo.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Más Económico',
      badgeColor: 'bg-slate-100 text-text-secondary border border-slate-200',
      isFeatured: false
    },
    {
      name: 'Vida Completo',
      subtitle: 'Fallecimiento e Invalidez',
      desc: 'El plan recomendado. Une la cobertura de fallecimiento y el pago de invalidez permanente absoluta, protegiendo tanto tu estabilidad futura como la de tus hijos.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Más Recomendado',
      badgeColor: 'bg-primary/10 text-primary-dark border border-primary/20',
      isFeatured: true
    },
    {
      name: 'Vida Hipotecas',
      subtitle: 'Saldo pendiente del préstamo',
      desc: 'Especialmente adaptado para vincularse al préstamo de tu vivienda. En caso de siniestro, el capital se destina a amortizar el saldo pendiente con el banco.',
      priceDetail: 'Consultar coberturas y límites',
      tag: 'Protección Hogar',
      badgeColor: 'bg-accent/10 text-accent-dark border border-accent/25',
      isFeatured: false
    }
  ];
