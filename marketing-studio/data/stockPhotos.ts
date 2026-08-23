export interface StockPhotoItem {
  id: string;
  title: string;
  category: 'students' | 'health' | 'travel' | 'family' | 'nomad' | 'advisors';
  categoryLabel: string;
  url: string;
  thumbnailUrl: string;
  author: string;
  authorUrl?: string;
  tags: string[];
  aspectRatio?: '4:5' | '1:1' | '16:9' | '9:16';
}

export const STOCK_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: '🌟' },
  { id: 'students', name: 'Estudiantes & Visados', icon: '🎓' },
  { id: 'health', name: 'Salud & Médicos', icon: '🏥' },
  { id: 'travel', name: 'Viajes & Extranjería', icon: '✈️' },
  { id: 'family', name: 'Familia & Hogar', icon: '👨‍👩‍👧‍👦' },
  { id: 'nomad', name: 'Nómadas & Trabajo', icon: '💼' },
  { id: 'advisors', name: 'Asesoras Oficiales', icon: '👩‍⚕️' },
] as const;

export const CURATED_STOCK_PHOTOS: StockPhotoItem[] = [
  // 🎓 1. ESTUDIANTES & UNIVERSIDAD
  {
    id: 'stock-student-campus-1',
    title: 'Estudiante con Libros en Campus Universitario',
    category: 'students',
    categoryLabel: 'Estudiantes & Visados',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&auto=format&fit=crop',
    author: 'Priscilla Du Preez',
    tags: ['estudiante', 'universidad', 'campus', 'libros', 'amigos', 'visado', 'españa'],
  },
  {
    id: 'stock-student-laptop-2',
    title: 'Estudiante Internacional con Portátil en Madrid',
    category: 'students',
    categoryLabel: 'Estudiantes & Visados',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=400&auto=format&fit=crop',
    author: 'Brooke Cagle',
    tags: ['estudio', 'laptop', 'cafeteria', 'master', 'grado', 'universitario'],
  },
  {
    id: 'stock-student-group-3',
    title: 'Grupo de Estudiantes Extranjeros en la Universidad',
    category: 'students',
    categoryLabel: 'Estudiantes & Visados',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop',
    author: 'Alexis Brown',
    tags: ['amigos', 'estudiantes', 'intercambio', 'erasmus', 'felices'],
  },
  {
    id: 'stock-student-grad-4',
    title: 'Graduación y Título Universitario',
    category: 'students',
    categoryLabel: 'Estudiantes & Visados',
    url: 'https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?q=80&w=400&auto=format&fit=crop',
    author: 'MD Duran',
    tags: ['graduacion', 'birrete', 'exito', 'diploma', 'futuro'],
  },
  {
    id: 'stock-student-library-5',
    title: 'Estudiando en Biblioteca Histórica Española',
    category: 'students',
    categoryLabel: 'Estudiantes & Visados',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop',
    author: 'Kimberly Farmer',
    tags: ['biblioteca', 'lectura', 'concentracion', 'españa', 'libros'],
  },

  // 🏥 2. SALUD & MÉDICOS
  {
    id: 'stock-health-doctor-1',
    title: 'Doctora Amable en Consulta Sanitaria',
    category: 'health',
    categoryLabel: 'Salud & Médicos',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
    author: 'Bruno Rodrigues',
    tags: ['doctora', 'medico', 'consulta', 'estetoscopio', 'confianza', 'salud'],
  },
  {
    id: 'stock-health-hospital-2',
    title: 'Hospital Moderno y Centro de Especialidades',
    category: 'health',
    categoryLabel: 'Salud & Médicos',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop',
    author: 'Martha Dominguez',
    tags: ['hospital', 'clinica', 'cuadro medico', 'instalaciones', 'sanitas'],
  },
  {
    id: 'stock-health-consult-3',
    title: 'Atención Médica Personalizada y Chequeo',
    category: 'health',
    categoryLabel: 'Salud & Médicos',
    url: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=400&auto=format&fit=crop',
    author: 'National Cancer Institute',
    tags: ['paciente', 'medico', 'diagnostico', 'sin copagos', 'atencion'],
  },
  {
    id: 'stock-health-wellbeing-4',
    title: 'Bienestar, Vitalidad y Cuidado Personal',
    category: 'health',
    categoryLabel: 'Salud & Médicos',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop',
    author: 'Espanol Santurce',
    tags: ['bienestar', 'salud mental', 'vida sana', 'vitalidad'],
  },

  // ✈️ 3. VIAJES & EXTRANJERÍA
  {
    id: 'stock-travel-passport-1',
    title: 'Pasaporte, Billetes de Avión y Visado',
    category: 'travel',
    categoryLabel: 'Viajes & Extranjería',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop',
    author: 'ConvertKit',
    tags: ['pasaporte', 'viaje', 'vuelo', 'visado', 'extranjeria', 'repatriacion'],
  },
  {
    id: 'stock-travel-airport-2',
    title: 'Viajera en Aeropuerto con Maleta rumbo a España',
    category: 'travel',
    categoryLabel: 'Viajes & Extranjería',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    author: 'Sean Oulashin',
    tags: ['maleta', 'viaje', 'llegada', 'aventura', 'aeropuerto'],
  },
  {
    id: 'stock-travel-madrid-3',
    title: 'Ciudad de Madrid y Gran Vía',
    category: 'travel',
    categoryLabel: 'Viajes & Extranjería',
    url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=400&auto=format&fit=crop',
    author: 'Florian Wehde',
    tags: ['madrid', 'españa', 'gran via', 'ciudad', 'destino'],
  },
  {
    id: 'stock-travel-barcelona-4',
    title: 'Barcelona Arquitectura y Estilo de Vida',
    category: 'travel',
    categoryLabel: 'Viajes & Extranjería',
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400&auto=format&fit=crop',
    author: 'Enes',
    tags: ['barcelona', 'sagrada familia', 'españa', 'mediterraneo'],
  },

  // 👨‍👩‍👧‍👦 4. FAMILIA & HOGAR
  {
    id: 'stock-family-happy-1',
    title: 'Familia Feliz en Casa Protegida',
    category: 'family',
    categoryLabel: 'Familia & Hogar',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=400&auto=format&fit=crop',
    author: 'Tyler Nix',
    tags: ['familia', 'padres', 'hijos', 'seguro familiar', 'proteccion'],
  },
  {
    id: 'stock-family-pet-2',
    title: 'Joven con Perro / Mascota en el Parque',
    category: 'family',
    categoryLabel: 'Familia & Hogar',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=400&auto=format&fit=crop',
    author: 'Chewy',
    tags: ['mascota', 'perro', 'veterinario', 'hogar', 'cariño'],
  },
  {
    id: 'stock-family-couple-3',
    title: 'Pareja Joven Disfrutando de su Nuevo Hogar',
    category: 'family',
    categoryLabel: 'Familia & Hogar',
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400&auto=format&fit=crop',
    author: 'Kelly Sikkema',
    tags: ['pareja', 'hogar', 'mudanza', 'piso', 'alquiler'],
  },

  // 💼 5. NÓMADAS DIGITALES & TRABAJO
  {
    id: 'stock-nomad-coffee-1',
    title: 'Nómada Digital Trabajando en Cafetería',
    category: 'nomad',
    categoryLabel: 'Nómadas & Trabajo',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop',
    author: 'Brooke Cagle',
    tags: ['nomada digital', 'remoto', 'coworking', 'laptop', 'visado nomada'],
  },
  {
    id: 'stock-nomad-terrace-2',
    title: 'Profesional Trabajando en Terraza Soleada',
    category: 'nomad',
    categoryLabel: 'Nómadas & Trabajo',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop',
    author: 'Hunters Race',
    tags: ['negocios', 'finanzas', 'profesional', 'autonomo'],
  },

  // 👩‍⚕️ 6. ASESORAS OFICIALES VITABLUE
  {
    id: 'stock-advisor-lucia',
    title: 'Lucía Delgado · Especialista en Visados de Estudiante',
    category: 'advisors',
    categoryLabel: 'Asesoras Oficiales',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    author: 'VitaBlue Staff',
    tags: ['asesora', 'lucia', 'visados', 'estudiante', 'atencion'],
  },
  {
    id: 'stock-advisor-sofia',
    title: 'Sofía Martínez · Asesora de Extranjería y Sanitas',
    category: 'advisors',
    categoryLabel: 'Asesoras Oficiales',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop',
    author: 'VitaBlue Staff',
    tags: ['asesora', 'sofia', 'sanitas', 'salud', 'repatriacion'],
  },
  {
    id: 'stock-advisor-carlos',
    title: 'Carlos Méndez · Consultor de Pólizas Internacionales',
    category: 'advisors',
    categoryLabel: 'Asesoras Oficiales',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    author: 'VitaBlue Staff',
    tags: ['asesor', 'carlos', 'internacional', 'seguros', 'expat'],
  },
];
