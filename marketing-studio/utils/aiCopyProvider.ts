import {
  AiCopyAudience,
  AiCopyFormat,
  AiCopyObjective,
  AiCopyProposal,
  AiCopyProvider,
  AiCopyRequest,
  AiCopyTone,
  AiCopyType,
  GeminiAiCopyTransport,
} from '../types/aiCopy';

const OBJECTIVE_LABELS: Record<AiCopyObjective, string> = {
  conversion: 'contratar',
  awareness: 'conocer tus opciones',
  education: 'entender el proceso',
  trust: 'sentirte acompañado',
  retention: 'seguir protegido',
};

const TYPE_LABELS: Record<AiCopyType, string> = {
  hook: 'gancho',
  headline: 'titular',
  cta: 'llamada a la acción',
  body: 'texto explicativo',
  script: 'guion',
};

const TONE_LABELS: Record<AiCopyTone, string> = {
  professional: 'profesional',
  warm: 'cercano',
  direct: 'directo',
  inspiring: 'inspirador',
  urgent: 'urgente',
};

const AUDIENCE_LABELS: Record<AiCopyAudience, string> = {
  students: 'estudiantes',
  families: 'familias',
  'digital-nomads': 'nómadas digitales',
  companies: 'empresas',
  expats: 'personas extranjeras',
};

const FORMAT_LABELS: Record<AiCopyFormat, string> = {
  short: 'texto breve',
  social: 'publicación social',
  story: 'story o reel',
  carousel: 'carrusel',
  email: 'email',
};

const clampQuantity = (quantity: number | undefined) =>
  Math.min(5, Math.max(1, Math.round(quantity ?? 3)));

const requestKey = (request: AiCopyRequest) =>
  [
    request.objective,
    request.type,
    request.tone,
    request.audience,
    request.format,
  ].join('-');

const getTextForProposal = (request: AiCopyRequest, index: number): string => {
  const audience = AUDIENCE_LABELS[request.audience];
  const objective = OBJECTIVE_LABELS[request.objective];
  const tone = TONE_LABELS[request.tone];
  const format = FORMAT_LABELS[request.format];

  const templates: Record<AiCopyType, string[]> = {
    hook: [
      `¿Buscas un seguro de salud para ${audience}? Empieza con claridad.`,
      `Tu próximo paso en España puede ser más fácil: protección pensada para ${audience}.`,
      `Menos dudas, más tranquilidad: descubre tu seguro para ${audience}.`,
      `Llegar preparado cambia todo. Asegúrate sin complicaciones.`,
      `Una póliza clara hoy te da más libertad mañana.`,
    ],
    headline: [
      `Protección médica clara para ${audience}`,
      `Tu seguro para ${objective}, sin letra pequeña`,
      `Todo lo que necesitas para vivir tranquilo en España`,
      `Un seguro que entiende tu camino`,
      `Da el paso con la cobertura adecuada`,
    ],
    cta: [
      'Compara opciones y elige con confianza',
      'Calcula tu seguro en pocos minutos',
      'Habla con una asesora hoy',
      'Recibe tu certificado sin complicaciones',
      'Empieza ahora tu camino protegido',
    ],
    body: [
      `Compara seguros médicos pensados para ${audience} y encuentra una opción clara para ${objective}. Te acompañamos desde la primera duda hasta tu certificado.`,
      `Tu tiempo importa. Revisa coberturas, condiciones y compañías en un solo lugar para tomar una decisión ${tone} y segura.`,
      `Una buena póliza no debería ser difícil de entender. Te ayudamos a elegir la cobertura que encaja contigo y con tus planes en España.`,
      `Con información sencilla y asesoramiento humano, puedes avanzar con la tranquilidad de tener tus requisitos en orden.`,
      `Elige protección real para tu día a día, con opciones transparentes y acompañamiento cuando lo necesites.`,
    ],
    script: [
      `Si eres parte de ${audience} y buscas ${objective}, guarda este consejo: compara antes de contratar. En pocos pasos tendrás una opción clara.`,
      `¿Tienes dudas sobre tu seguro? Primero revisa la cobertura, después compara alternativas y termina hablando con una asesora. Así de sencillo.`,
      `Llegas a España con muchos planes. Haz que la parte del seguro sea fácil: descubre tus opciones y sigue avanzando.`,
      `No dejes tu tranquilidad para el último momento. Infórmate, compara y elige una póliza que te acompañe.`,
      `Tu historia merece empezar con seguridad. Encuentra la cobertura que necesitas y da el siguiente paso.`,
    ],
  };

  const base = templates[request.type][index % templates[request.type].length];
  return format === 'email' && request.type === 'headline'
    ? `Asunto: ${base}`
    : base;
};

export class MockAiCopyProvider implements AiCopyProvider {
  readonly id = 'mock';

  async generate(request: AiCopyRequest): Promise<AiCopyProposal[]> {
    const quantity = clampQuantity(request.quantity);
    const key = requestKey(request);
    return Array.from({ length: quantity }, (_, index) => ({
      id: `mock-${key}-${index + 1}`,
      text: getTextForProposal(request, index),
      title: `${TYPE_LABELS[request.type]} ${index + 1}`,
      rationale: `Propuesta ${index + 1} en tono ${TONE_LABELS[request.tone]} para ${FORMAT_LABELS[request.format]}.`,
      request: { ...request, quantity },
      isMock: true,
    }));
  }

  async adapt(request: AiCopyRequest, sourceText: string): Promise<AiCopyProposal[]> {
    const source = sourceText.trim();
    if (!source) {
      throw new Error('Selecciona una capa de texto para poder adaptarla.');
    }

    const quantity = clampQuantity(request.quantity);
    const key = requestKey(request);
    const endings = [
      ` Ahora puedes ${OBJECTIVE_LABELS[request.objective]} con más claridad.`,
      ` Una opción ${TONE_LABELS[request.tone]} para ${AUDIENCE_LABELS[request.audience]}.`,
      ` Descubre una forma sencilla de avanzar en España.`,
      ` Compara tus opciones y decide con tranquilidad.`,
      ` Da el siguiente paso con información clara.`,
    ];

    return Array.from({ length: quantity }, (_, index) => ({
      id: `mock-adapt-${key}-${index + 1}`,
      text: `${source.replace(/[.!?]+$/, '')}.${endings[index % endings.length]}`,
      title: `Adaptación ${index + 1}`,
      rationale: `Reescritura ${TONE_LABELS[request.tone]} para ${AUDIENCE_LABELS[request.audience]}.`,
      request: { ...request, quantity },
      sourceText: source,
      isMock: true,
    }));
  }
}

/**
 * Placeholder for the future Gemini implementation. It deliberately has no
 * key lookup and makes no network calls until an adapter is supplied.
 */
export class GeminiAiCopyProvider implements AiCopyProvider {
  readonly id = 'gemini';

  constructor(private readonly transport?: GeminiAiCopyTransport) {}

  generate(request: AiCopyRequest): Promise<AiCopyProposal[]> {
    if (!this.transport) {
      return Promise.reject(new Error('El proveedor Gemini aún no está configurado.'));
    }
    return this.transport.generate(request);
  }

  adapt(request: AiCopyRequest, sourceText: string): Promise<AiCopyProposal[]> {
    if (!this.transport) {
      return Promise.reject(new Error('El proveedor Gemini aún no está configurado.'));
    }
    return this.transport.adapt(request, sourceText);
  }
}

export const mockAiCopyProvider = new MockAiCopyProvider();
