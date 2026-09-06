/**
 * Destination Cities Hospital Network & University Hubs Data (Spain)
 * Used for Local SEO hubs: Madrid, Barcelona, Valencia, Málaga
 */

export interface LocalHospital {
  name: string;
  insurer: 'ASISA' | 'Sanitas' | 'Adeslas' | 'Multimarca';
  address: string;
  zone: string;
  hasEmergency24h: boolean;
  englishSupport: boolean;
  highlight: string;
}

export interface UniversityHub {
  name: string;
  shortName: string;
  type: 'Pública' | 'Privada' | 'Escuela de Negocios';
}

export interface DestinationCityData {
  slug: string;
  name: string;
  region: string;
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  hospitals: LocalHospital[];
  universities: UniversityHub[];
  tieOfficeInfo: {
    address: string;
    neighborhood: string;
    tips: string;
  };
  startingPrice: number;
  faqs: { q: string; a: string }[];
}

export const destinationCities: Record<string, DestinationCityData> = {
  madrid: {
    slug: 'madrid',
    name: 'Madrid',
    region: 'Comunidad de Madrid',
    heroTitle: 'Seguro Médico para Estudiantes y Extranjeros en Madrid',
    heroSubtitle: 'Pólizas homologadas sin copagos ni carencias válidas para Extranjería y Visado. Accede a los mejores hospitales privados de Madrid (HLA Moncloa, Sanitas La Moraleja, Ruber y Cemtro).',
    metaTitle: 'Seguro Médico Estudiantes y Extranjeros Madrid (2026) | VitaBlue',
    metaDescription: 'Seguro de salud para visado de estudiante, nómadas y NIE en Madrid desde 35€/mes. Sin copagos, sin carencias y con acceso a Hospital Moncloa, La Moraleja y Ruber.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/madrid/',
    startingPrice: 35,
    universities: [
      { name: 'Universidad Complutense de Madrid', shortName: 'UCM', type: 'Pública' },
      { name: 'Universidad Autónoma de Madrid', shortName: 'UAM', type: 'Pública' },
      { name: 'Universidad Carlos III de Madrid', shortName: 'UC3M', type: 'Pública' },
      { name: 'Universidad Politécnica de Madrid', shortName: 'UPM', type: 'Pública' },
      { name: 'IE University / Business School', shortName: 'IE', type: 'Escuela de Negocios' },
      { name: 'Universidad CEU San Pablo', shortName: 'CEU', type: 'Privada' },
      { name: 'Universidad Pontificia Comillas', shortName: 'ICADE/ICAI', type: 'Privada' },
      { name: 'Universidad Europea de Madrid', shortName: 'UEM', type: 'Privada' },
    ],
    hospitals: [
      {
        name: 'Hospital HLA Universitario Moncloa',
        insurer: 'ASISA',
        address: 'Av. de Valladolid, 83',
        zone: 'Moncloa - Aravaca',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Hospital insignia de ASISA con todas las especialidades y urgencias 24h de alta resolución.',
      },
      {
        name: 'Hospital Universitario Sanitas La Moraleja',
        insurer: 'Sanitas',
        address: 'Av. de Manuel Azaña, 4',
        zone: 'Sanchinarro / Hortaleza',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Acreditación Joint Commission International y máxima tecnología médica y de hospitalización.',
      },
      {
        name: 'Hospital Universitario Sanitas La Zarzuela',
        insurer: 'Sanitas',
        address: 'Calle Pléyades, 25',
        zone: 'Aravaca',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Centro de referencia quirúrgica y materno-infantil en la zona oeste de Madrid.',
      },
      {
        name: 'Hospital Ruber Internacional',
        insurer: 'Adeslas',
        address: 'Calle de la Masó, 38',
        zone: 'Mirasierra / Fuencarral',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Uno de los centros médicos privados de mayor prestigio internacional de España.',
      },
      {
        name: 'Clínica CEMTRO',
        insurer: 'Multimarca',
        address: 'Av. del Ventisquero de la Condesa, 42',
        zone: 'Miraflores',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Centro de excelencia en traumatología y medicina deportiva de élite.',
      },
    ],
    tieOfficeInfo: {
      address: 'Calle de García de Paredes, 65 / Av. de los Poblados s/n',
      neighborhood: 'Chamberí / Aluche',
      tips: 'En Madrid la cita previa para la toma de huellas (TIE) requiere el certificado de seguro médico original y el volante de empadronamiento con menos de 3 meses de antigüedad.',
    },
    faqs: [
      {
        q: '¿Qué hospitales privados de Madrid puedo usar con este seguro?',
        a: 'Tendrás acceso directo sin copagos a los centros privados de mayor prestigio de Madrid, incluyendo el Hospital HLA Universitario Moncloa, Hospital Sanitas La Moraleja, Hospital Sanitas La Zarzuela, Hospital Quirónsalud Madrid, Ruber Internacional y Clínica CEMTRO.',
      },
      {
        q: '¿El seguro sirve para tramitar la TIE en la Oficina de Extranjería de Madrid?',
        a: 'Sí, al 100%. Te emitimos el Certificado Oficial de Cobertura con firma electrónica y código CSV que cumple de forma estricta los requisitos de la Delegación de Gobierno en Madrid (sin copagos, sin carencias y con repatriación).',
      },
      {
        q: '¿Hay médicos que hablen inglés en Madrid?',
        a: 'Sí. Tanto ASISA como Sanitas cuentan con departamentos internacionales en Madrid con personal y cuadro facultativo bilingüe en inglés, francés y alemán, además de videoconsultas en inglés a través de la app móvil.',
      },
    ],
  },

  barcelona: {
    slug: 'barcelona',
    name: 'Barcelona',
    region: 'Cataluña',
    heroTitle: 'Seguro Médico para Estudiantes y Extranjeros en Barcelona',
    heroSubtitle: 'Pólizas 100% homologadas para visado, NIE y TIE en Barcelona. Cuadro médico concertado de primer nivel: Hospital CIMA Sanitas, Sagrada Família, Dexeus y HLA.',
    metaTitle: 'Seguro Médico Estudiantes y Extranjeros Barcelona (2026) | VitaBlue',
    metaDescription: 'Seguro de salud para estudiantes internacionales y nómadas en Barcelona desde 35€/mes. 0€ copagos, sin carencias y acceso a Hospital CIMA, Sagrada Família y Quirón.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/barcelona/',
    startingPrice: 35,
    universities: [
      { name: 'Universitat de Barcelona', shortName: 'UB', type: 'Pública' },
      { name: 'Universitat Autònoma de Barcelona', shortName: 'UAB', type: 'Pública' },
      { name: 'Universitat Pompeu Fabra', shortName: 'UPF', type: 'Pública' },
      { name: 'Universitat Politècnica de Catalunya', shortName: 'UPC', type: 'Pública' },
      { name: 'ESADE Business School', shortName: 'ESADE', type: 'Escuela de Negocios' },
      { name: 'IESE Business School', shortName: 'IESE', type: 'Escuela de Negocios' },
      { name: 'Universitat Ramon Llull', shortName: 'URL', type: 'Privada' },
      { name: 'EADA Business School', shortName: 'EADA', type: 'Escuela de Negocios' },
    ],
    hospitals: [
      {
        name: 'Hospital CIMA Sanitas',
        insurer: 'Sanitas',
        address: 'Passeig de Manuel Girona, 33',
        zone: 'Sarrià - Sant Gervasi',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Hospital insignia de Sanitas en Cataluña, acreditado por la Joint Commission International.',
      },
      {
        name: 'Clínica Sagrada Família',
        insurer: 'ASISA',
        address: 'Carrer de Torras i Pujalt, 1',
        zone: 'Sarrià - Sant Gervasi',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Centro hospitalario de vanguardia con urgencias 24h concertado con ASISA y Adeslas.',
      },
      {
        name: 'Hospital Universitari Dexeus (Quirónsalud)',
        insurer: 'Multimarca',
        address: 'Carrer de Sabino Arana, 5-19',
        zone: 'Les Corts',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Conocido como el "Hospital del Conocimiento", referente en traumatología y ginecología.',
      },
      {
        name: 'Hospital Quirónsalud Barcelona',
        insurer: 'Adeslas',
        address: 'Plaça d\'Alfonso Comín, 5',
        zone: 'Gràcia / Vallcarca',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Gran centro de alta especialización diagnóstica y oncología médica.',
      },
    ],
    tieOfficeInfo: {
      address: 'Passeig de Sant Joan, 189 / Carrer de Guadalajara, 1',
      neighborhood: 'Eixample / Gràcia',
      tips: 'En Barcelona es imprescindible presentar el certificado nominal en castellano que certifique expresamente 0€ de copago y repatriación para recoger la TIE.',
    },
    faqs: [
      {
        q: '¿Puedo atenderme en el Hospital CIMA o Sagrada Família en Barcelona?',
        a: 'Sí. Las pólizas de Sanitas y ASISA incluyen el acceso directo a estos centros hospitalarios para urgencias 24h, consultas con especialistas y pruebas diagnósticas avanzadas.',
      },
      {
        q: '¿El certificado es válido para la Oficina de Extranjería de Passeig de Sant Joan?',
        a: 'Sí. El documento se emite con firma digital y código de validación CSV aceptado por todas las oficinas de extranjería de la provincia de Barcelona.',
      },
      {
        q: '¿Qué cubre la repatriación en Barcelona?',
        a: 'Cubre el traslado sanitario medicalizado en ambulancia o avión hasta el país de origen y la repatriación completa de restos mortales.',
      },
    ],
  },

  valencia: {
    slug: 'valencia',
    name: 'Valencia',
    region: 'Comunidad Valenciana',
    heroTitle: 'Seguro Médico para Estudiantes y Nómadas en Valencia',
    heroSubtitle: 'Seguro de salud para visado y NIE en Valencia desde 35€/mes. Cobertura completa en el Hospital 9 de Octubre, Casa de Salud y Clínica HLA.',
    metaTitle: 'Seguro Médico Estudiantes y Extranjeros Valencia (2026) | VitaBlue',
    metaDescription: 'Póliza de salud para estudiantes de la UV, UPV y nómadas en Valencia. Sin copagos, sin carencias y certificado consular oficial en 24 horas.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/valencia/',
    startingPrice: 35,
    universities: [
      { name: 'Universitat de València', shortName: 'UV', type: 'Pública' },
      { name: 'Universitat Politècnica de València', shortName: 'UPV', type: 'Pública' },
      { name: 'Universidad CEU Cardenal Herrera', shortName: 'CEU Valencia', type: 'Privada' },
      { name: 'Universidad Católica de Valencia', shortName: 'UCV', type: 'Privada' },
      { name: 'EDEM Escuela de Empresarios', shortName: 'EDEM', type: 'Escuela de Negocios' },
      { name: 'Berklee College of Music Valencia', shortName: 'Berklee', type: 'Privada' },
    ],
    hospitals: [
      {
        name: 'Hospital 9 de Octubre',
        insurer: 'Multimarca',
        address: 'Calle Valle de la Ballestera, 59',
        zone: 'Campanar',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'El hospital privado de referencia en Valencia con UCI pediátrica y urgencias completas.',
      },
      {
        name: 'Hospital Casa de Salud',
        insurer: 'ASISA',
        address: 'Calle Dr. Manuel Candela, 41',
        zone: 'Algirós / Universidades',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Ubicación ideal junto al campus de Tarongers y Blasco Ibáñez con excelente cuadro médico.',
      },
      {
        name: 'Hospital Sanitas Virgen del Consuelo',
        insurer: 'Sanitas',
        address: 'Calle Callosa d\'En Sarrià, 12',
        zone: 'Jesús / Patraix',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Centro hospitalario concertado con servicio médico de urgencias generales y traumatología.',
      },
    ],
    tieOfficeInfo: {
      address: 'Calle dels Motilla del Palancar, 23 / Calle Bailén, 9',
      neighborhood: 'Benicalap / Centro',
      tips: 'Para estudiantes de la UV y UPV, la cita de extranjería se solicita en la sede de Valencia con el seguro médico y la matrícula universitaria oficial.',
    },
    faqs: [
      {
        q: '¿Qué hospital me queda más cerca de la zona universitaria de Valencia?',
        a: 'El Hospital Casa de Salud está ubicado en la calle Manuel Candela, a pocos minutos a pie de las facultades de Blasco Ibáñez y Tarongers.',
      },
      {
        q: '¿Cubre urgencias médicas en toda la Comunidad Valenciana?',
        a: 'Sí, la póliza tiene cobertura nacional completa e ilimitada en Valencia, Alicante y Castellón, así como en toda España.',
      },
    ],
  },

  malaga: {
    slug: 'malaga',
    name: 'Málaga',
    region: 'Andalucía (Costa del Sol)',
    heroTitle: 'Seguro Médico para Estudiantes y Nómadas en Málaga',
    heroSubtitle: 'El seguro de salud líder para el polo tecnológico y universitario de Málaga y la Costa del Sol. Red concertada con Hospital HLA El Ángel, Quirónsalud y Sanitas.',
    metaTitle: 'Seguro Médico Estudiantes y Nómadas Málaga (2026) | VitaBlue',
    metaDescription: 'Seguro médico para visado y nómadas digitales en Málaga desde 35€/mes. Sin copagos, con Hospital HLA El Ángel y certificado express en 24h.',
    canonicalPath: '/productos/seguros-salud/seguro-medico-estudiantes/malaga/',
    startingPrice: 35,
    universities: [
      { name: 'Universidad de Málaga', shortName: 'UMA', type: 'Pública' },
      { name: 'Campus Internacional Teatinos', shortName: 'Teatinos', type: 'Pública' },
      { name: 'Málaga TechPark Hub', shortName: 'PTA Málaga', type: 'Escuela de Negocios' },
      { name: 'Les Roches Marbella', shortName: 'Les Roches', type: 'Privada' },
      { name: 'Marbella International University Centre', shortName: 'MIUC', type: 'Privada' },
    ],
    hospitals: [
      {
        name: 'Hospital HLA El Ángel',
        insurer: 'ASISA',
        address: 'Calle Corregidor Nicolás Isidro, 16',
        zone: 'Cruz de Humilladero / Teatinos',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Hospital insignia del Grupo HLA en Andalucía, referente en cardiología y urgencias 24h.',
      },
      {
        name: 'Hospital Quirónsalud Málaga',
        insurer: 'Adeslas',
        address: 'Av. Imperio Argentina, 1',
        zone: 'Carretera de Cádiz / Martín Carpena',
        hasEmergency24h: true,
        englishSupport: true,
        highlight: 'Centro hospitalario de vanguardia tecnológica en la zona oeste de Málaga.',
      },
      {
        name: 'Centro Médico Sanitas Málaga',
        insurer: 'Sanitas',
        address: 'Calle Martínez de la Rosa, 38',
        zone: 'Bailén - Miraflores',
        hasEmergency24h: false,
        englishSupport: true,
        highlight: 'Centro polivalente con todas las especialidades y pruebas diagnósticas en el centro de Málaga.',
      },
    ],
    tieOfficeInfo: {
      address: 'Calle Mauricio Moro Pareto, 13',
      neighborhood: 'Cruz de Humilladero',
      tips: 'En Málaga la cita de toma de huellas TIE para nómadas y estudiantes se tramita en la Comisaría de Extranjería junto a la estación de tren María Zambrano.',
    },
    faqs: [
      {
        q: '¿El seguro de ASISA sirve para el Hospital HLA El Ángel en Málaga?',
        a: 'Sí. Al contratar ASISA Internacional tendrás acceso preferente y directo sin copagos al Hospital HLA El Ángel, el mayor hospital privado de la capital malagueña.',
      },
      {
        q: '¿Sirve para nómadas digitales trabajando en Málaga TechPark?',
        a: 'Sí, cumple el 100% de las directrices exigidas por la UGE-CE en Madrid para autorizaciones de residencia de nómadas digitales de la Ley de Startups.',
      },
    ],
  },
};

export const getDestinationCityBySlug = (slug: string): DestinationCityData | undefined => {
  return destinationCities[slug.toLowerCase()];
};
