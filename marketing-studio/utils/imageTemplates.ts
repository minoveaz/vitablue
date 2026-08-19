import { ImageProject, IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export const INITIAL_IMAGE_TEMPLATES: ImageProject[] = [
  {
    id: 'template-advisor-portrait',
    title: 'Post Asesora de Visados (4:5)',
    preset: IMAGE_FORMAT_PRESETS[0], // 4:5
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-advisor-main',
        type: 'block',
        blockType: 'MotionAdvisorCard',
        title: 'Tarjeta de Asesora',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          name: 'Sofía',
          role: 'Asesora Especialista en Visados',
          badge: 'ASESORA ASIGNADA · EN DIRECTO',
          message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
          whatsAppText: 'Pregúntanos por WhatsApp',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-trust-square',
    title: 'Garantía Consular 100% (1:1)',
    preset: IMAGE_FORMAT_PRESETS[1], // 1:1
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 30%, rgba(238, 155, 0, 0.45) 0%, #001219 75%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-trust-main',
        type: 'block',
        blockType: 'MotionTrustBadge',
        title: 'Sello de Garantía',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
          subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
          highlight: 'GARANTÍA CONSULAR',
          verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-comparison-portrait',
    title: 'Comparativa Seguro Viaje vs Visado (4:5)',
    preset: IMAGE_FORMAT_PRESETS[0], // 4:5
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 25%, rgba(0, 95, 115, 0.6) 0%, #001219 85%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-comp-main',
        type: 'block',
        blockType: 'MotionComparisonCard',
        title: 'Comparativa Visual',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
          wrongOptionTitle: 'Seguro de Viaje Común',
          wrongOptionDesc: 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
          correctOptionTitle: 'Seguro VitaBlue Extranjería',
          correctOptionDesc: 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-providers-square',
    title: 'Parrilla Aseguradoras Aprobadas (1:1)',
    preset: IMAGE_FORMAT_PRESETS[1], // 1:1
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(148, 210, 189, 0.4) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-providers-main',
        type: 'block',
        blockType: 'MotionProviderGrid',
        title: 'Grid de Aseguradoras',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
          subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
