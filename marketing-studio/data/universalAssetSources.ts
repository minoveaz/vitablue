export interface UniversalAssetSource {
  id: 'undraw' | 'openmoji';
  label: string;
  license: string;
  attributionRequired: boolean;
  baseUrl: string;
  notes: string;
}

/**
 * External sources are kept as metadata so imported resources retain their
 * provenance and can be reviewed before being added to a customer package.
 */
export const UNIVERSAL_ASSET_SOURCES: UniversalAssetSource[] = [
  {
    id: 'undraw',
    label: 'unDraw',
    license: 'unDraw license',
    attributionRequired: false,
    baseUrl: 'https://undraw.co/illustrations',
    notes: 'Illustrations SVG neutras; recolor mediante tokens del proyecto.',
  },
  {
    id: 'openmoji',
    label: 'OpenMoji',
    license: 'CC BY-SA 4.0',
    attributionRequired: true,
    baseUrl: 'https://openmoji.org/data/',
    notes: 'Iconos y símbolos; conservar atribución al exportar.',
  },
];

