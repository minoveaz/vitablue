/**
 * Motor Inteligente de Corrección Ortográfica y Redacción en Español (RAE & Dominio Asegurador)
 * VitaBlue Marketing Studio
 */

interface ReplacementRule {
  pattern: RegExp;
  replacement: string;
}

// Diccionario de términos frecuentes, marcas y terminología de visados/seguros
const SPELLING_DICTIONARY: Record<string, string> = {
  // Términos de Extranjería y Visados
  extranjeria: 'Extranjería',
  extranjería: 'Extranjería',
  consulado: 'Consulado',
  consulados: 'Consulados',
  poliza: 'póliza',
  polizas: 'pólizas',
  denegacion: 'denegación',
  denegaciones: 'denegaciones',
  aprobacion: 'aprobación',
  aprobaciones: 'aprobaciones',
  repatriacion: 'repatriación',
  repatriaciones: 'repatriaciones',
  autorizacion: 'autorización',
  autorizaciones: 'autorizaciones',
  renovacion: 'renovación',
  renovaciones: 'renovaciones',
  estadia: 'estadía',
  residencia: 'residencia',
  empadronamiento: 'empadronamiento',

  // Términos Médicos y Coberturas
  medica: 'médica',
  medico: 'médico',
  medicos: 'médicos',
  medicas: 'médicas',
  cirugia: 'cirugía',
  psicologia: 'psicología',
  odontologia: 'odontología',
  diagnostico: 'diagnóstico',
  urgencia: 'urgencia',
  urgencias: 'urgencias',
  hospitalizacion: 'hospitalización',

  // Términos Clave de Marketing y Beneficios
  facil: 'fácil',
  faciles: 'fáciles',
  rapido: 'rápido',
  rapida: 'rápida',
  rapidos: 'rápidos',
  rapidas: 'rápidas',
  garantia: 'garantía',
  garantias: 'garantías',
  valido: 'válido',
  valida: 'válida',
  validos: 'válidos',
  validas: 'válidas',
  aqui: 'aquí',
  tambien: 'también',
  ademas: 'además',
  mas: 'más',
  guia: 'guía',
  guias: 'guías',
  atencion: 'atención',
  exclusivo: 'exclusivo',
  exclusiva: 'exclusiva',
  cotizacion: 'cotización',
  informacion: 'información',
  asesoria: 'asesoría',
  asesoramiento: 'asesoramiento',
  numero: 'número',
  numeros: 'números',
  ano: 'año',
  anos: 'años',
  espana: 'España',
  españa: 'España',

  // Marcas e Identidad
  vitablue: 'VitaBlue',
  whatsapp: 'WhatsApp',
  adeslas: 'Adeslas',
  sanitas: 'Sanitas',
  asisa: 'Asisa',
  dkv: 'DKV',
  mapfre: 'MAPFRE',
  axa: 'AXA',
  nie: 'NIE',
  tie: 'TIE',
  dni: 'DNI',
  dnie: 'DNIe',
};

/**
 * Corrige la ortografía, signos de puntuación (¿? ¡!) y mayúsculas de un texto en español.
 * Respeta etiquetas de color personalizadas como [DENEGUEN](#EE9B00) y **negritas**.
 */
export function correctSpanishText(input: string): { correctedText: string; changesCount: number } {
  if (!input || !input.trim()) {
    return { correctedText: input, changesCount: 0 };
  }

  let text = input;
  let changesCount = 0;

  // 1. Proteger bloques especiales formateados como [Palabra](#Color)
  const placeholderMap = new Map<string, string>();
  let placeholderIndex = 0;

  text = text.replace(/\[([^\]]+)\]\((#[A-Fa-f0-9]{3,8}|rgba?\([^)]+\)|transparent)\)/g, (_match, innerText, color) => {
    const placeholder = `___SPECIAL_LINK_PLACEHOLDER_${placeholderIndex++}___`;
    placeholderMap.set(placeholder, { innerText, color } as unknown as string);
    return placeholder;
  });

  // 2. Corrección de palabras según diccionario RAE y Sector Asegurador
  const words = text.split(/(\s+|[.,;:¿?¡!()[\]"]+)/);
  const correctedWords = words.map((token) => {
    if (!token || !/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(token)) {
      return token;
    }

    const lower = token.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(SPELLING_DICTIONARY, lower)) {
      const canonical = SPELLING_DICTIONARY[lower];
      
      // Mantener mayúsculas completas si la palabra original estaba en MAYÚSCULAS
      if (token === token.toUpperCase() && token.length > 1) {
        const upperCanonical = canonical.toUpperCase();
        if (token !== upperCanonical) {
          changesCount++;
          return upperCanonical;
        }
        return token;
      }

      // Si empieza con mayúscula en el original
      if (token[0] === token[0].toUpperCase()) {
        const capitalizedCanonical = canonical.charAt(0).toUpperCase() + canonical.slice(1);
        if (token !== capitalizedCanonical) {
          changesCount++;
          return capitalizedCanonical;
        }
        return token;
      }

      if (token !== canonical) {
        changesCount++;
        return canonical;
      }
    }

    return token;
  });

  text = correctedWords.join('');

  // 3. Restaurar placeholders con texto corregido
  for (const [placeholder, meta] of placeholderMap.entries()) {
    const { innerText, color } = meta as unknown as { innerText: string; color: string };
    const correctedInner = correctSpanishText(innerText).correctedText;
    text = text.replace(placeholder, `[${correctedInner}](${color})`);
  }

  // 4. Corrección de signos de interrogación (¿ ?)
  if (text.includes('?') && !text.includes('¿')) {
    // Si la frase termina en ? o tiene interrogación al final, añadir ¿ al inicio
    const trimmed = text.trim();
    if (trimmed.endsWith('?')) {
      // Si no empieza con ¿, colocarlo al inicio
      const firstLetterIdx = text.search(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/);
      if (firstLetterIdx >= 0) {
        text = text.slice(0, firstLetterIdx) + '¿' + text.slice(firstLetterIdx);
        changesCount++;
      }
    }
  }

  // 5. Corrección de signos de exclamación (¡ !)
  if (text.includes('!') && !text.includes('¡')) {
    const trimmed = text.trim();
    if (trimmed.endsWith('!')) {
      const firstLetterIdx = text.search(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/);
      if (firstLetterIdx >= 0) {
        text = text.slice(0, firstLetterIdx) + '¡' + text.slice(firstLetterIdx);
        changesCount++;
      }
    }
  }

  // 6. Corrección de interrogativos comunes: ¿que...? -> ¿qué...?, ¿como...? -> ¿cómo...?, ¿donde...? -> ¿dónde...?
  const interrogativeRules: ReplacementRule[] = [
    { pattern: /¿\s*que\b/gi, replacement: '¿Qué' },
    { pattern: /¿\s*como\b/gi, replacement: '¿Cómo' },
    { pattern: /¿\s*donde\b/gi, replacement: '¿Dónde' },
    { pattern: /¿\s*cuando\b/gi, replacement: '¿Cuándo' },
    { pattern: /¿\s*cual\b/gi, replacement: '¿Cuál' },
    { pattern: /¿\s*cuales\b/gi, replacement: '¿Cuáles' },
    { pattern: /¿\s*por que\b/gi, replacement: '¿Por qué' },
    { pattern: /¿\s*porque\b/gi, replacement: '¿Por qué' },
  ];

  for (const rule of interrogativeRules) {
    if (rule.pattern.test(text)) {
      text = text.replace(rule.pattern, rule.replacement);
      changesCount++;
    }
  }

  // 7. Capitalizar la primera letra del texto si no es un signo especial
  const matchFirstLetter = text.match(/([¿¡"'\s]*)([a-záéíóúñ])/);
  if (matchFirstLetter && matchFirstLetter.index !== undefined) {
    const prefix = matchFirstLetter[1];
    const letter = matchFirstLetter[2];
    const fullMatch = matchFirstLetter[0];
    const upperLetter = letter.toUpperCase();
    if (letter !== upperLetter) {
      text = text.replace(fullMatch, `${prefix}${upperLetter}`);
      changesCount++;
    }
  }

  return {
    correctedText: text,
    changesCount,
  };
}
