import { describe, it, expect } from 'vitest';
import { destinationCities, getDestinationCityBySlug } from './destinationCitiesData';

describe('Destination Cities Data & Hospitals Directory', () => {
  it('contains all 4 key university and expat hubs in Spain', () => {
    const slugs = Object.keys(destinationCities);
    expect(slugs).toContain('madrid');
    expect(slugs).toContain('barcelona');
    expect(slugs).toContain('valencia');
    expect(slugs).toContain('malaga');
  });

  it('provides comprehensive hospital networks and universities for each city', () => {
    Object.values(destinationCities).forEach((city) => {
      expect(city.name).toBeTruthy();
      expect(city.heroTitle).toBeTruthy();
      expect(city.canonicalPath).toBe(`/productos/seguros-salud/seguro-medico-estudiantes/${city.slug}/`);
      expect(city.hospitals.length).toBeGreaterThanOrEqual(3);
      expect(city.universities.length).toBeGreaterThanOrEqual(3);
      expect(city.tieOfficeInfo.address).toBeTruthy();
      expect(city.faqs.length).toBeGreaterThanOrEqual(2);
      expect(city.startingPrice).toBe(35);
    });
  });

  it('retrieves cities accurately via getDestinationCityBySlug', () => {
    const madrid = getDestinationCityBySlug('madrid');
    expect(madrid).toBeDefined();
    expect(madrid?.name).toBe('Madrid');
    expect(madrid?.hospitals.some((h) => h.name.includes('Moncloa'))).toBe(true);

    const barcelona = getDestinationCityBySlug('barcelona');
    expect(barcelona).toBeDefined();
    expect(barcelona?.name).toBe('Barcelona');
    expect(barcelona?.hospitals.some((h) => h.name.includes('CIMA'))).toBe(true);

    const unknown = getDestinationCityBySlug('sevilla');
    expect(unknown).toBeUndefined();
  });
});
