import { describe, it, expect } from 'vitest';
import { consulatesList, getConsulateBySlug } from './consulatesData';

describe('Consulates Data Specification', () => {
  it('contains the 5 target consulates', () => {
    expect(consulatesList).toHaveLength(5);
    const slugs = consulatesList.map((c) => c.slug);
    expect(slugs).toContain('colombia-bogota');
    expect(slugs).toContain('mexico-cdmx');
    expect(slugs).toContain('peru-lima');
    expect(slugs).toContain('argentina-buenos-aires');
    expect(slugs).toContain('ecuador-quito-guayaquil');
  });

  it('retrieves consulate by slug accurately', () => {
    const bogota = getConsulateBySlug('colombia-bogota');
    expect(bogota).toBeDefined();
    expect(bogota?.country).toBe('Colombia');
    expect(bogota?.city).toBe('Bogotá');
    expect(bogota?.whatsappTag).toBe('CONS-BOGOTA');

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
      expect(c.whatsappMessage).toContain('Consulado');
    });
  });
});
