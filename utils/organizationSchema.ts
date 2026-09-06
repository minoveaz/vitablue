export const VITA_BLUE_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['InsuranceAgency', 'Organization'],
  '@id': 'https://www.vitablue.es/#organization',
  name: 'VitaBlue',
  legalName: 'VitaBlue Mediación y Asesoramiento de Seguros',
  url: 'https://www.vitablue.es/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.vitablue.es/favicon.svg',
    caption: 'VitaBlue'
  },
  image: 'https://www.vitablue.es/og-image.jpg',
  description: 'Comparador y asesoría independiente en seguros de salud, estudiantes, expatriados, nómadas y mascotas en España.',
  telephone: '+34 694 58 34 52',
  email: 'info@vitablue.es',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Paseo de la Castellana 95',
    addressLocality: 'Madrid',
    postalCode: '28046',
    addressCountry: 'ES'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.453,
    longitude: -3.6922
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '10:00',
      closes: '14:00'
    }
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+34 694 58 34 52',
      contactType: 'customer support',
      contactOption: 'TollFree',
      areaServed: 'ES',
      availableLanguage: ['Spanish', 'English']
    }
  ],
  sameAs: [
    'https://wa.me/34694583452',
    'https://twitter.com/vitablue_es',
    'https://www.linkedin.com/company/vitablue'
  ],
  priceRange: '€€'
};
