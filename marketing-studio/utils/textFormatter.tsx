import React from 'react';

export interface TextHighlightRule {
  id?: string;
  word: string;
  color?: string;
  bgColor?: string;
  fontWeight?: string;
}

/**
 * Parsea y formatea texto para permitir palabras con colores individuales,
 * fondos resaltados y sintaxis enriquecida como [Palabra](#COLOR) o **Palabra**.
 */
export function parseFormattedText(
  rawText: string,
  highlightWords: TextHighlightRule[] = [],
  _defaultColor?: string
): React.ReactNode {
  if (!rawText) return null;

  // 1. Procesar sintaxis de etiquetas [Palabra](#HEX) o [Palabra](#COLOR:#BG) o **Palabra**
  const tokens: Array<{ text: string; color?: string; bgColor?: string; isCustom?: boolean }> = [];
  const tagRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\{color:([^}]+)\}(.*?)\{\/color\}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: rawText.substring(lastIndex, match.index) });
    }

    if (match[1] && match[2]) {
      // [Palabra](#HEX) o [Palabra](#HEX:#BG)
      const content = match[1];
      const params = match[2].split(':');
      tokens.push({
        text: content,
        color: params[0]?.trim() || undefined,
        bgColor: params[1]?.trim() || undefined,
        isCustom: true,
      });
    } else if (match[3]) {
      // **Palabra** -> Resaltado ámbar/dorado de conversión
      tokens.push({
        text: match[3],
        color: '#EE9B00',
        isCustom: true,
      });
    } else if (match[4] && match[5]) {
      // {color:#HEX}Palabra{/color}
      tokens.push({
        text: match[5],
        color: match[4].trim(),
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
      finalNodes.push(
        <span
          key={`custom-tok-${tokIdx}`}
          style={{
            color: tok.color || undefined,
            backgroundColor: tok.bgColor && tok.bgColor !== 'transparent' ? tok.bgColor : undefined,
            padding: tok.bgColor && tok.bgColor !== 'transparent' ? '1px 6px' : undefined,
            borderRadius: tok.bgColor && tok.bgColor !== 'transparent' ? '6px' : undefined,
            display: tok.bgColor && tok.bgColor !== 'transparent' ? 'inline-block' : undefined,
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
