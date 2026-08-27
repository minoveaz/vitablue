const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'H1',
  'H2',
  'H3',
  'STRONG',
  'B',
  'EM',
  'I',
  'U',
  'S',
  'DEL',
  'MARK',
  'SPAN',
  'UL',
  'OL',
  'LI',
  'BLOCKQUOTE',
]);

const ALLOWED_STYLE_PROPERTIES = new Set([
  'color',
  'background-color',
  'font-size',
  'font-family',
  'font-weight',
  'font-style',
  'text-decoration',
  'line-height',
  'text-align',
]);

const SAFE_COLOR = /^(?:#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|transparent|inherit|currentcolor)$/i;
const SAFE_SIZE = /^(?:\d+(?:\.\d+)?)(?:px|pt|em|rem|%)$/i;
const SAFE_LINE_HEIGHT = /^(?:\d+(?:\.\d+)?)(?:px|em|rem|%)?$/i;

function sanitizeStyle(style: string): string {
  return style
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(':');
      if (separator < 0) return null;
      const property = declaration.slice(0, separator).trim().toLowerCase();
      const value = declaration.slice(separator + 1).trim();
      if (!ALLOWED_STYLE_PROPERTIES.has(property)) return null;
      if (property === 'color' || property === 'background-color') {
        return SAFE_COLOR.test(value) ? `${property}: ${value}` : null;
      }
      if (property === 'font-size') return SAFE_SIZE.test(value) ? `${property}: ${value}` : null;
      if (property === 'line-height') return SAFE_LINE_HEIGHT.test(value) ? `${property}: ${value}` : null;
      if (/[<>;]/.test(value) || /url\s*\(|expression\s*\(/i.test(value)) return null;
      return `${property}: ${value}`;
    })
    .filter((value): value is string => Boolean(value))
    .join('; ');
}

/**
 * Sanitizes HTML produced by Tiptap before it reaches a DOM sink.
 * It intentionally allows only the marks/nodes used by Image Studio.
 */
export function sanitizeTiptapHtml(input: string): string {
  if (!input) return '';
  if (typeof DOMParser === 'undefined') {
    return input
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, name: string, attributes: string) => {
        const tag = name.toUpperCase();
        if (!ALLOWED_TAGS.has(tag)) return '';
        if (full.startsWith('</')) return `</${name.toLowerCase()}>`;
        const styleMatch = attributes.match(/\bstyle\s*=\s*["']([^"']*)["']/i);
        const style = styleMatch ? sanitizeStyle(styleMatch[1]) : '';
        return style ? `<${name.toLowerCase()} style="${style}">` : `<${name.toLowerCase()}>`;
      });
  }

  const document = new DOMParser().parseFromString(input, 'text/html');
  const clean = document.createElement('div');
  const visit = (node: Node, parent: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent ?? ''));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as HTMLElement;
    const tag = element.tagName.toUpperCase();
    if (!ALLOWED_TAGS.has(tag)) {
      element.childNodes.forEach((child) => visit(child, parent));
      return;
    }
    const output = document.createElement(tag.toLowerCase());
    if (['SPAN', 'P', 'H1', 'H2', 'H3', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'DEL', 'MARK'].includes(tag)) {
      const style = sanitizeStyle(element.getAttribute('style') ?? '');
      if (style) output.setAttribute('style', style);
      if (tag === 'MARK') {
        const color = element.getAttribute('data-color');
        if (color && SAFE_COLOR.test(color)) output.setAttribute('data-color', color);
      }
    }
    element.childNodes.forEach((child) => visit(child, output));
    parent.appendChild(output);
  };
  document.body.childNodes.forEach((node) => visit(node, clean));
  return clean.innerHTML;
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function legacyInlineToHtml(input: string): string {
  let value = escapeHtml(input);
  value = value.replace(/\[([^\]]+)\]\(#([0-9a-f]{3,8})(?::([^:)]+))?(?::([^:)]+))?\)/gi, (_m, text, color, size, background) => {
    const styles = [`color: #${color}`];
    if (size && SAFE_SIZE.test(size.endsWith('px') ? size : `${size}px`)) styles.push(`font-size: ${size.endsWith('px') ? size : `${size}px`}`);
    if (background && SAFE_COLOR.test(background)) styles.push(`background-color: ${background}`);
    return `<span style="${styles.join('; ')}">${text}</span>`;
  });
  value = value.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/__([^_]+)__/g, '<u>$1</u>');
  value = value.replace(/~~([^~]+)~~/g, '<s>$1</s>');
  value = value.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return value
    .split(/\r?\n/)
    .map((line) => `<p>${line || '<br>'}</p>`)
    .join('');
}

export function legacyTextToTiptapHtml(input: string): string {
  if (!input) return '<p></p>';
  return sanitizeTiptapHtml(/<\s*(?:p|span|strong|em|u|s|mark|h[1-3]|ul|ol|li|br)\b/i.test(input) ? input : legacyInlineToHtml(input));
}

export function isTiptapHtml(input: string): boolean {
  return /<\s*(?:p|span|strong|em|u|s|mark|h[1-3]|ul|ol|li|br)\b/i.test(input);
}

export function htmlToPlainText(input: string): string {
  if (!input) return '';
  if (typeof DOMParser === 'undefined') return input.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
  const document = new DOMParser().parseFromString(sanitizeTiptapHtml(input), 'text/html');
  return (document.body.textContent ?? '').replace(/\u00a0/g, ' ');
}

export function normalizeTiptapHtml(input: string): string {
  return legacyTextToTiptapHtml(input);
}
