import { VIDEO_SCHEMA_VERSION, type VideoProject } from './videoProject';
import { createDefaultLayoutMetadata } from './layoutConstraints';

export const defaultVisaRejectionProject: VideoProject = {
  schemaVersion: VIDEO_SCHEMA_VERSION,
  id: 'visa-rejection-reel',
  name: 'Visa rejection reel',
  fps: 30,
  format: 'vertical',
  width: 1080,
  height: 1920,
  layout: createDefaultLayoutMetadata(),
  scenes: [
    {
      id: 'slide_1',
      templateId: 'text_hook',
      durationInFrames: 150,
      content: {
        text: 'Si vas a pedir tu visado para Espana, no cometas el error de contratar un seguro de viaje comun.',
        badge: 'VISA READY',
      },
      layers: [{
        id: 'slide_1-hook',
        type: 'text',
        text: 'Hook principal',
        timing: { startFrame: 0, durationInFrames: 150 },
      }],
    },
    {
      id: 'slide_2',
      templateId: 'provider_logos',
      durationInFrames: 300,
      content: {
        text: 'Las oficinas de Extranjeria exigen polizas emitidas por companias autorizadas en Espana.',
      },
      layers: [],
    },
    {
      id: 'slide_3',
      templateId: 'requirements_list',
      durationInFrames: 450,
      content: {
        title: 'Requisitos Obligatorios:',
        items: ['Cobertura Completa (100%)', 'Sin Copagos (0 EUR)', 'Repatriacion Incluida'],
      },
      layers: [],
    },
    {
      id: 'slide_4',
      templateId: 'advisor_cta',
      durationInFrames: 450,
      content: {
        advisorName: 'Sofia',
        role: 'Asesora experta',
        cta: 'Escribenos por WhatsApp si necesitas verificar tu poliza',
      },
      layers: [],
    },
  ],
};
