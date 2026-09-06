import { describe, it, expect } from 'vitest';
import { consulatesList, getConsulateBySlug } from './consulatesData';

describe('Consulates Data Specification', () => {
  it('contains the 7 target consulates', () => {
    expect(consulatesList).toHaveLength(7);
    const slugs = consulatesList.map((c) => c.slug);
    expect(slugs).toContain('colombia');
    expect(slugs).toContain('mexico');
    expect(slugs).toContain('peru');
    expect(slugs).toContain('argentina');
    expect(slugs).toContain('ecuador');
    expect(slugs).toContain('chile');
    expect(slugs).toContain('estados-unidos');
  });

  it('retrieves consulate by slug accurately', () => {
    const colombia = getConsulateBySlug('colombia');
    expect(colombia).toBeDefined();
    expect(colombia?.country).toBe('Colombia');
    expect(colombia?.city).toBe('Bogotá');
    expect(colombia?.canonicalPath).toBe('/productos/seguros-salud/seguro-medico-estudiantes/colombia/');

    const chile = getConsulateBySlug('chile');
    expect(chile).toBeDefined();
    expect(chile?.country).toBe('Chile');
    expect(chile?.currencyCode).toBe('CLP');

    const usa = getConsulateBySlug('estados-unidos');
    expect(usa).toBeDefined();
    expect(usa?.country).toBe('Estados Unidos');
    expect(usa?.currencyCode).toBe('USD');

    const unknown = getConsulateBySlug('non-existent');
    expect(unknown).toBeUndefined();
  });

  it('validates each consulate has complete legal and procedural data', () => {
    consulatesList.forEach((c) => {
      expect(c.title).toBeDefined();
      expect(c.title.length).toBeGreaterThan(15);
      expect(c.metaDescription.length).toBeGreaterThan(50);
      expect(c.consulateAddress.length).toBeGreaterThan(10);
      expect(c.blsCenter.length).toBeGreaterThan(5);
      expect(c.visaTypes.length).toBeGreaterThanOrEqual(3);
      expect(c.mandatoryRequirements).toHaveLength(4);
      expect(c.commonRejectionReasons.length).toBeGreaterThanOrEqual(2);
      expect(c.faqs.length).toBeGreaterThanOrEqual(2);
      expect(c.priceFromEur).toBeGreaterThan(0);
      expect(c.whatsappMessage.length).toBeGreaterThan(10);
    });
  });
});
