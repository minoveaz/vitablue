export interface SanitasCatalogCard {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  price: string;
  link: string;
  badge?: string;
}

export const sanitasFeaturedProducts = [
    {
      id: 'mas-salud',
      title: 'Sanitas Más Salud',
      tagline: 'Asistencia Sanitaria Completa y Digital',
      desc: 'El seguro de salud de cuadro completo más vendido. Acceso médico total, hospitalización ilimitada y medicina digital Blua.',
      features: [
        'Hospitalización médica y quirúrgica completa',
        'Servicios Blua: videoconsulta y fisio digital',
        'Segunda opinión médica internacional'
      ],
      price: 'Precio personalizado',
      link: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
      badge: 'Más vendido'
    },
    {
      id: 'international-students',
      title: 'Sanitas International Students',
      tagline: 'Seguro para estudiantes extranjeros en España',
      desc: 'Seguro médico obligatorio para visado de estudios o prórrogas en España. Sin copagos, sin carencias y con repatriación.',
      features: [
        'Cumple el 100% de exigencias consulares',
        'Videoconsultas en inglés y español 24/7',
        'Repatriación médica ilimitada incluida'
      ],
      price: 'Precio personalizado',
      link: '/productos/seguros-salud/seguros-sanitas/international-students',
      badge: 'Estudiantes'
    },
    {
      id: 'salud-mascotas',
      title: 'Sanitas Salud Mascotas',
      tagline: 'Seguro Veterinario para Perros y Gatos',
      desc: 'Seguro de asistencia veterinaria completa con vacunas de la rabia, consultas de urgencia y cobertura dental de serie.',
      features: [
        'Consultas veterinarias gratuitas ilimitadas',
        'Vacuna de rabia y desparasitaciones gratuitas',
        'Urgencias y hospitalizaciones concertadas'
      ],
      price: 'Precio personalizado',
      link: '/productos/seguro-mascotas/sanitas-mascotas',
      badge: 'Mascotas'
    },
    {
      id: 'asistencia-familiar-iplus',
      title: 'Asistencia Familiar iPlus',
      tagline: 'Seguro de Decesos y Apoyo Familiar',
      desc: 'Póliza de asistencia de sepelio completa y asesoría familiar para la gestión de herencias, traslados y apoyo psicológico.',
      features: [
        'Gestión integral de sepelio y entierro',
        'Traslado nacional e internacional cubierto',
        'Testamento online y gestoría legal'
      ],
      price: 'Consultar tarifa',
      link: '/productos/seguro-para-decesos/asistencia-familiar',
      badge: 'Decesos'
    }
  ];

  // Products without dedicated pages - WhatsApp consultancy required
export const sanitasConsultProducts = [
    {
      id: 'sanitas-accede',
      title: 'Sanitas Accede',
      tagline: 'Asistencia Extra-hospitalaria y Digital Básica',
      desc: 'Producto de cobertura limitada que excluye la hospitalización e intervenciones complejas, ideal para visitas y consultas rápidas.',
      features: [
        'Especialistas y pruebas diagnósticas simples',
        'Cobertura dental básica incluida',
        'Sin carencias de ningún tipo'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Accede.'
    },
    {
      id: 'sanitas-avanza',
      title: 'Sanitas Avanza',
      tagline: 'Asistencia Limitada con Cirugía Menor',
      desc: 'Asistencia sanitaria limitada que cubre consultas médicas, pruebas complejas y pequeñas cirugías ambulatorias.',
      features: [
        'Pruebas diagnósticas simples y complejas',
        'Cirugías ambulatorias que no requieren ingreso',
        'Límite de copago anual de 350€ por asegurado'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Avanza.'
    },
    {
      id: 'sanitas-unico',
      title: 'Sanitas Único',
      tagline: 'Cobertura para Mayores sin Límite de Edad',
      desc: 'Asistencia médica extrahospitalaria dirigida a mayores de 60 años, garantizando consultas y pruebas sin límite de edad.',
      features: [
        'Sin límite de edad de contratación o permanencia',
        'Ecografía, TAC y resonancias concertadas',
        'Incluye servicios a domicilio senior'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20%C3%9Anico.',
      badge: '+60 años'
    },
    {
      id: 'mas-salud-familias',
      title: 'Sanitas Más Salud Familias',
      tagline: 'Cobertura Completa con Foco Familiar',
      desc: 'Seguro de asistencia sanitaria completa reforzado en el cuidado de familias con logopedia, psicología y programas infantiles.',
      features: [
        'Cobertura total de hospitalización y cirugías',
        'Psicología y Logopedia ampliadas de serie',
        'Programas digitales de nutrición infantil'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20M%C3%A1s%20Salud%20Familias.',
      badge: 'Familias'
    },
    {
      id: 'profesionales',
      title: 'Sanitas Profesionales',
      tagline: 'Asistencia Completa para Autónomos',
      desc: 'Diseñado para trabajadores por cuenta propia. Cobertura médica completa e indemnización de cuotas por incapacidad.',
      features: [
        'Asistencia completa y hospitalización',
        'Protección total frente a bajas por enfermedad',
        'Ventajas fiscales para autónomos en España'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Profesionales.',
      badge: 'Autónomos'
    },
    {
      id: 'top-quantum',
      title: 'Sanitas Top Quantum',
      tagline: 'Salud Premium con Reembolso Familiar',
      desc: 'Póliza premium que combina el acceso a nuestro gran cuadro médico concertado y reembolso de gastos a nivel mundial.',
      features: [
        'Libre elección de especialista fuera de la red',
        'Reembolso de hasta 10.000€ en especialidades',
        'Asistencia urgente en viajes de hasta 15.000€'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Top%20Quantum.',
      badge: 'Premium'
    },
    {
      id: 'international-residents',
      title: 'International Residents',
      tagline: 'Cobertura Integral para Residentes Extranjeros',
      desc: 'Seguro médico de alto nivel para extranjeros residentes, con libre elección de médico y reembolso de gastos de salud en el país de origen.',
      features: [
        'Asistencia completa en España y país de origen',
        'Opción de reembolso para libre elección médica',
        'Repatriación por fallecimiento ilimitada'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20International%20Residents.',
      badge: 'Extranjeros'
    },
    {
      id: 'asistencia-senior-unica',
      title: 'Asistencia Senior Prima Única',
      tagline: 'Decesos para Mayores de 65 años',
      desc: 'Garantiza el servicio fúnebre y el traslado nacional e internacional para mayores de 65 años mediante el pago de un único importe.',
      features: [
        'Sin límite máximo de edad de contratación',
        'Garantiza el servicio fúnebre completo',
        'Pago en una única cuota de por vida'
      ],
      price: 'Precio personalizado',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Asistencia%20Senior%20a%20Prima%20%C3%9Anica%20Sanitas.',
      badge: '+65 años'
    }
  ];

