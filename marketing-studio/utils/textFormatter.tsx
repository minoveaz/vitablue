import React from 'react';

export interface TextHighlightRule {
  id?: string;
  word: string;
  color?: string;
  bgColor?: string;
  fontWeight?: string;
}

/**
 * Devuelve el texto limpio sin etiquetas de formato [Palabra](#HEX) o **Palabra** para mostrar al usuario.
 */
export function stripTextFormatting(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]*>/g, '') // Quitar HTML tags de Tiptap
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\{color:[^}]+\}(.*?)\{\/color\}/g, '$1')
    .replace(/\{size:[^}]+\}(.*?)\{\/size\}/g, '$1');
}

/**
 * Parsea y formatea texto para permitir palabras con colores individuales,
 * fondos resaltados y sintaxis enriquecida como HTML de Tiptap o [Palabra](#COLOR).
 */
export function parseFormattedText(
  rawText: string,
  highlightWords: TextHighlightRule[] = [],
  _defaultColor?: string
): React.ReactNode {
  if (!rawText) return null;

  // Si el texto proviene del editor enriquecido Tiptap (HTML nativo), renderizar con fidelidad total
  if (rawText.includes('<p>') || rawText.includes('<span>') || rawText.includes('<mark>') || rawText.includes('<strong>') || rawText.includes('<em>') || rawText.includes('<u>') || rawText.includes('<s>')) {
    return <span className="inline-rich-html [&_p]:inline [&_p]:m-0" dangerouslySetInnerHTML={{ __html: rawText }} />;
  }

  // 1. Procesar sintaxis de etiquetas [Palabra](#HEX) o [Palabra](#HEX:size:bg) o **bold**, *italic*, ~~strike~~, <u>underline</u>, etc.
  interface FormattedToken {
    text: string;
    color?: string;
    bgColor?: string;
    fontSize?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    isCustom?: boolean;
  }

  const tokens: FormattedToken[] = [];
  const tagRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|\*([^*]+)\*|__([^_]+)__|~~([^~]+)~~|<u>(.*?)<\/u>|\{color:([^}]+)\}(.*?)\{\/color\}|\{size:([^}]+)\}(.*?)\{\/size\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: rawText.substring(lastIndex, match.index) });
    }

    if (match[1] && match[2]) {
      // [Palabra](#HEX) o [Palabra](#HEX:fontSize:bgColor)
      const content = match[1];
      const params = match[2].split(':');
      tokens.push({
        text: content,
        color: params[0]?.trim() || undefined,
        fontSize: params[1]?.trim() ? (params[1].endsWith('px') ? params[1] : `${params[1]}px`) : undefined,
        bgColor: params[2]?.trim() || undefined,
        isCustom: true,
      });
    } else if (match[3]) {
      // ***Negrita e Itálica***
      tokens.push({
        text: match[3],
        bold: true,
        italic: true,
        isCustom: true,
      });
    } else if (match[4]) {
      // **Negrita**
      tokens.push({
        text: match[4],
        bold: true,
        color: '#EE9B00',
        isCustom: true,
      });
    } else if (match[5]) {
      // *Cursiva / Itálica*
      tokens.push({
        text: match[5],
        italic: true,
        isCustom: true,
      });
    } else if (match[6]) {
      // __Subrayado__
      tokens.push({
        text: match[6],
        underline: true,
        isCustom: true,
      });
    } else if (match[7]) {
      // ~~Tachado~~
      tokens.push({
        text: match[7],
        strikethrough: true,
        isCustom: true,
      });
    } else if (match[8]) {
      // <u>Subrayado</u>
      tokens.push({
        text: match[8],
        underline: true,
        isCustom: true,
      });
    } else if (match[9] && match[10]) {
      // {color:#HEX}Palabra{/color}
      tokens.push({
        text: match[10],
        color: match[9].trim(),
        isCustom: true,
      });
    } else if (match[11] && match[12]) {
      // {size:40}Palabra{/size}
      tokens.push({
        text: match[12],
        fontSize: match[11].trim().endsWith('px') ? match[11].trim() : `${match[11].trim()}px`,
        isCustom: true,
      });
    }

    lastIndex = tagRegex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    tokens.push({ text: rawText.substring(lastIndex) });
  }

  // 2. Aplicar reglas de highlightWords sobre los tokens de texto plano
  const finalNodes: React.ReactNode[] = [];

  tokens.forEach((tok, tokIdx) => {
    if (tok.isCustom) {
      const textDecorations: string[] = [];
      if (tok.underline) textDecorations.push('underline');
      if (tok.strikethrough) textDecorations.push('line-through');

      finalNodes.push(
        <span
          key={`custom-tok-${tokIdx}`}
          style={{
            color: tok.color || undefined,
            fontSize: tok.fontSize || undefined,
            fontWeight: tok.bold ? '800' : undefined,
            fontStyle: tok.italic ? 'italic' : undefined,
            textDecoration: textDecorations.length > 0 ? textDecorations.join(' ') : undefined,
            backgroundColor: tok.bgColor && tok.bgColor !== 'transparent' ? tok.bgColor : undefined,
            padding: tok.bgColor && tok.bgColor !== 'transparent' ? '1px 6px' : undefined,
            borderRadius: tok.bgColor && tok.bgColor !== 'transparent' ? '6px' : undefined,
            display: (tok.bgColor && tok.bgColor !== 'transparent') || tok.fontSize ? 'inline-block' : undefined,
          }}
        >
          {tok.text}
        </span>
      );
      return;
    }

    if (!highlightWords || highlightWords.length === 0) {
      finalNodes.push(<React.Fragment key={`plain-${tokIdx}`}>{tok.text}</React.Fragment>);
      return;
    }

    // Filtrar reglas válidas
    const validRules = highlightWords.filter((r) => r.word && r.word.trim().length > 0);
    if (validRules.length === 0) {
      finalNodes.push(<React.Fragment key={`plain-${tokIdx}`}>{tok.text}</React.Fragment>);
      return;
    }

    const escapedWords = validRules.map((hw) =>
      hw.word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const wordRegex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
    const parts = tok.text.split(wordRegex);

    parts.forEach((part, pIdx) => {
      const matchedRule = validRules.find(
        (hw) => hw.word.trim().toLowerCase() === part.toLowerCase()
      );

      if (matchedRule) {
        finalNodes.push(
          <span
            key={`tok-${tokIdx}-hw-${pIdx}`}
            style={{
              color: matchedRule.color || undefined,
              backgroundColor:
                matchedRule.bgColor && matchedRule.bgColor !== 'transparent'
                  ? matchedRule.bgColor
                  : undefined,
              padding:
                matchedRule.bgColor && matchedRule.bgColor !== 'transparent'
                  ? '2px 8px'
                  : undefined,
              borderRadius:
                matchedRule.bgColor && matchedRule.bgColor !== 'transparent'
                  ? '8px'
                  : undefined,
              fontWeight: matchedRule.fontWeight || undefined,
              display:
                matchedRule.bgColor && matchedRule.bgColor !== 'transparent'
                  ? 'inline-block'
                  : undefined,
            }}
          >
            {part}
          </span>
        );
      } else {
        finalNodes.push(<React.Fragment key={`tok-${tokIdx}-p-${pIdx}`}>{part}</React.Fragment>);
      }
    });
  });

  return <>{finalNodes}</>;
}
