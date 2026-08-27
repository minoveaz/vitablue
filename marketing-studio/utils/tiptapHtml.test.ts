import { describe, expect, it } from 'vitest';
import {
  htmlToPlainText,
  legacyTextToTiptapHtml,
  normalizeTiptapHtml,
  sanitizeTiptapHtml,
} from './tiptapHtml';

describe('Tiptap HTML persistence', () => {
  it('migrates legacy markdown-like text into safe Tiptap HTML', () => {
    expect(legacyTextToTiptapHtml('Hola **mundo**')).toContain('<strong>mundo</strong>');
    expect(legacyTextToTiptapHtml('línea 1\nlínea 2')).toBe('<p>línea 1</p><p>línea 2</p>');
  });

  it('keeps supported marks and removes unsafe tags and attributes', () => {
    const html = sanitizeTiptapHtml('<p style="color:#005F73">Hola <mark style="background-color:#EE9B00">mundo</mark></p><img src=x onerror=alert(1)>');
    expect(html).toContain('color: #005F73');
    expect(html).toContain('<mark');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('onerror');
  });

  it('provides plain text for non-HTML renderers and normalizes legacy values', () => {
    const html = normalizeTiptapHtml('**Hola**');
    expect(htmlToPlainText(html)).toBe('Hola');
    expect(normalizeTiptapHtml('<script>alert(1)</script><p>Seguro</p>')).not.toContain('<script');
  });
});
