import { describe, it, expect } from 'vitest';
import {
  asisaFeaturedProducts,
  asisaConsultProducts,
  asisaFeaturedProductsEn,
  asisaConsultProductsEn,
  getAsisaFeaturedProducts,
  getAsisaConsultProducts
} from './asisaCatalog';

describe('asisaCatalog domain inventory', () => {
  it('should have 4 featured products and 5 consult products (9 total matching official docs)', () => {
    expect(asisaFeaturedProducts).toHaveLength(4);
    expect(asisaConsultProducts).toHaveLength(5);
    const total = asisaFeaturedProducts.length + asisaConsultProducts.length;
    expect(total).toBe(9);
  });

  it('should have unique IDs across all products', () => {
    const allProducts = [...asisaFeaturedProducts, ...asisaConsultProducts];
    const ids = allProducts.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(allProducts.length);
  });

  it('should have valid docCodes matching the official Asisa IPID PDFs', () => {
    const allProducts = [...asisaFeaturedProducts, ...asisaConsultProducts];
    const expectedDocCodes = [
      'AFR01S0125',
      'AFR01S0128',
      'AFR01S0015',
      'AFR01S0080',
      'AFR01S0071',
      'AFR01S0074',
      'AFR01S0035',
      'AFR01S0052',
      'AFR01S0088'
    ];
    allProducts.forEach((p) => {
      expect(p.docCode).toBeDefined();
      expect(expectedDocCodes).toContain(p.docCode);
    });
  });

  it('should have properly formatted WhatsApp contact links for consult products', () => {
    asisaConsultProducts.forEach((p) => {
      expect(p.link).toContain('https://wa.me/34694583452?text=');
      expect(p.features.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('should return English catalog products when requested via helpers', () => {
    const featuredEn = getAsisaFeaturedProducts('en');
    const consultEn = getAsisaConsultProducts('en');

    expect(featuredEn).toBe(asisaFeaturedProductsEn);
    expect(consultEn).toBe(asisaConsultProductsEn);
    expect(featuredEn).toHaveLength(4);
    expect(consultEn).toHaveLength(5);
    expect(featuredEn[0].link).toContain('/en/health-insurance/');
    expect(consultEn[0].link).toContain('Hi!%20I%27m%20visiting%20VitaBlue');
    expect(featuredEn[0].badge).toBe('Best for Student Visa');
  });
});

