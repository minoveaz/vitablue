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
      title: 'Sanitas MÃ¡s Salud',
      tagline: 'Asistencia Sanitaria Completa y Digital',
      desc: 'El seguro de salud de cuadro completo mÃ¡s vendido. Acceso mÃ©dico total, hospitalizaciÃ³n ilimitada y medicina digital Blua.',
      features: [
        'HospitalizaciÃ³n mÃ©dica y quirÃºrgica completa',
        'Servicios Blua: videoconsulta y fisio digital',
        'Segunda opiniÃ³n mÃ©dica internacional'
      ],
      price: 'Precio personalizado',
      link: '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
      badge: 'MÃ¡s vendido'
    },
    {
      id: 'international-students',
      title: 'Sanitas International Students',
      tagline: 'Seguro para estudiantes extranjeros en EspaÃ±a',
      desc: 'Seguro mÃ©dico obligatorio para visado de estudios o prÃ³rrogas en EspaÃ±a. Sin copagos, sin carencias y con repatriaciÃ³n.',
      features: [
        'Cumple el 100% de exigencias consulares',
        'Videoconsultas en inglÃ©s y espaÃ±ol 24/7',
        'RepatriaciÃ³n mÃ©dica ilimitada incluida'
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
      desc: 'PÃ³liza de asistencia de sepelio completa y asesorÃ­a familiar para la gestiÃ³n de herencias, traslados y apoyo psicolÃ³gico.',
      features: [
        'GestiÃ³n integral de sepelio y entierro',
        'Traslado nacional e internacional cubierto',
        'Testamento online y gestorÃ­a legal'
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
      tagline: 'Asistencia Extra-hospitalaria y Digital BÃ¡sica',
      desc: 'Producto de cobertura limitada que excluye la hospitalizaciÃ³n e intervenciones complejas, ideal para visitas y consultas rÃ¡pidas.',
      features: [
        'Especialistas y pruebas diagnÃ³sticas simples',
        'Cobertura dental bÃ¡sica incluida',
        'Sin carencias de ningÃºn tipo'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Accede.'
    },
    {
      id: 'sanitas-avanza',
      title: 'Sanitas Avanza',
      tagline: 'Asistencia Limitada con CirugÃ­a Menor',
      desc: 'Asistencia sanitaria limitada que cubre consultas mÃ©dicas, pruebas complejas y pequeÃ±as cirugÃ­as ambulatorias.',
      features: [
        'Pruebas diagnÃ³sticas simples y complejas',
        'CirugÃ­as ambulatorias que no requieren ingreso',
        'LÃ­mite de copago anual de 350â‚¬ por asegurado'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Avanza.'
    },
    {
      id: 'sanitas-unico',
      title: 'Sanitas Ãšnico',
      tagline: 'Cobertura para Mayores sin LÃ­mite de Edad',
      desc: 'Asistencia mÃ©dica extrahospitalaria dirigida a mayores de 60 aÃ±os, garantizando consultas y pruebas sin lÃ­mite de edad.',
      features: [
        'Sin lÃ­mite de edad de contrataciÃ³n o permanencia',
        'EcografÃ­a, TAC y resonancias concertadas',
        'Incluye servicios a domicilio senior'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20%C3%9Anico.',
      badge: '+60 aÃ±os'
    },
    {
      id: 'mas-salud-familias',
      title: 'Sanitas MÃ¡s Salud Familias',
      tagline: 'Cobertura Completa con Foco Familiar',
      desc: 'Seguro de asistencia sanitaria completa reforzado en el cuidado de familias con logopedia, psicologÃ­a y programas infantiles.',
      features: [
        'Cobertura total de hospitalizaciÃ³n y cirugÃ­as',
        'PsicologÃ­a y Logopedia ampliadas de serie',
        'Programas digitales de nutriciÃ³n infantil'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20M%C3%A1s%20Salud%20Familias.',
      badge: 'Familias'
    },
    {
      id: 'profesionales',
      title: 'Sanitas Profesionales',
      tagline: 'Asistencia Completa para AutÃ³nomos',
      desc: 'DiseÃ±ado para trabajadores por cuenta propia. Cobertura mÃ©dica completa e indemnizaciÃ³n de cuotas por incapacidad.',
      features: [
        'Asistencia completa y hospitalizaciÃ³n',
        'ProtecciÃ³n total frente a bajas por enfermedad',
        'Ventajas fiscales para autÃ³nomos en EspaÃ±a'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Profesionales.',
      badge: 'AutÃ³nomos'
    },
    {
      id: 'top-quantum',
      title: 'Sanitas Top Quantum',
      tagline: 'Salud Premium con Reembolso Familiar',
      desc: 'PÃ³liza premium que combina el acceso a nuestro gran cuadro mÃ©dico concertado y reembolso de gastos a nivel mundial.',
      features: [
        'Libre elecciÃ³n de especialista fuera de la red',
        'Reembolso de hasta 10.000â‚¬ en especialidades',
        'Asistencia urgente en viajes de hasta 15.000â‚¬'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20Top%20Quantum.',
      badge: 'Premium'
    },
    {
      id: 'international-residents',
      title: 'International Residents',
      tagline: 'Cobertura Integral para Residentes Extranjeros',
      desc: 'Seguro mÃ©dico de alto nivel para extranjeros residentes, con libre elecciÃ³n de mÃ©dico y reembolso de gastos de salud en el paÃ­s de origen.',
      features: [
        'Asistencia completa en EspaÃ±a y paÃ­s de origen',
        'OpciÃ³n de reembolso para libre elecciÃ³n mÃ©dica',
        'RepatriaciÃ³n por fallecimiento ilimitada'
      ],
      price: 'Consultar',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Sanitas%20International%20Residents.',
      badge: 'Extranjeros'
    },
    {
      id: 'asistencia-senior-unica',
      title: 'Asistencia Senior Prima Ãšnica',
      tagline: 'Decesos para Mayores de 65 aÃ±os',
      desc: 'Garantiza el servicio fÃºnebre y el traslado nacional e internacional para mayores de 65 aÃ±os mediante el pago de un Ãºnico importe.',
      features: [
        'Sin lÃ­mite mÃ¡ximo de edad de contrataciÃ³n',
        'Garantiza el servicio fÃºnebre completo',
        'Pago en una Ãºnica cuota de por vida'
      ],
      price: 'Precio personalizado',
      link: 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Asistencia%20Senior%20a%20Prima%20%C3%9Anica%20Sanitas.',
      badge: '+65 aÃ±os'
    }
  ];

