import {
  SITE_ORIGIN,
  ORG,
  SERVICES,
  buildAreaServedPlaces,
} from './seo-data.js';

const REGIONAL_AREA = buildAreaServedPlaces();

function governmentService(id, service, areaServed) {
  return {
    '@type': 'GovernmentService',
    '@id': id,
    name: service.name,
    serviceType: service.serviceTypes,
    url: `${SITE_ORIGIN}/${service.path}`,
    provider: { '@id': ORG.id },
    areaServed,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${SITE_ORIGIN}/${service.path}`,
      serviceType: 'OnSite',
    },
  };
}

export function buildSchemaGraph(pageUrl) {
  const regionalServices = [
    SERVICES.territoire,
    SERVICES.concertation,
    SERVICES.evaluation,
    SERVICES.financement,
  ].map((svc) =>
    governmentService(
      `${SITE_ORIGIN}/#service-${svc.key}`,
      svc,
      REGIONAL_AREA,
    ),
  );

  const nationalDigital = governmentService(
    `${SITE_ORIGIN}/#service-numerique`,
    SERVICES.numerique,
    { '@type': 'Country', name: 'France', identifier: 'FR' },
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN + '/',
        name: ORG.name,
        description:
          'Cabinet d\'études : aménagement des territoires, concertation, évaluation des politiques publiques, ingénierie financière. Hauts-de-France, Normandie, Grand Est, Île-de-France.',
        inLanguage: 'fr-FR',
        publisher: { '@id': ORG.id },
      },
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': ORG.id,
        name: ORG.name,
        url: SITE_ORIGIN + '/',
        logo: `${SITE_ORIGIN}/assets/Logo/Logo%20InCitta.png`,
        image: `${SITE_ORIGIN}/assets/Logo/Logo%20InCitta.png`,
        email: ORG.email,
        description:
          'Consultant et cabinet d\'études en aménagement des territoires, démocratie participative, concertation, évaluation des politiques publiques et recherche de financement pour collectivités.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: ORG.address.streetAddress,
          postalCode: ORG.address.postalCode,
          addressLocality: ORG.address.addressLocality,
          addressRegion: ORG.address.addressRegion,
          addressCountry: ORG.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 49.894,
          longitude: 2.295,
        },
        areaServed: REGIONAL_AREA,
        knowsAbout: [
          'aménagement des territoires',
          'démocratie participative',
          'concertation',
          'évaluation des politiques publiques',
          'ingénierie financière',
          'recherche de subventions',
          'e-démocratie',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Prestations InCitta',
          itemListElement: [
            ...regionalServices.map((s, i) => ({
              '@type': 'Offer',
              position: i + 1,
              itemOffered: { '@id': s['@id'] },
            })),
            {
              '@type': 'Offer',
              position: 5,
              itemOffered: { '@id': nationalDigital['@id'] },
            },
          ],
        },
      },
      ...regionalServices,
      nationalDigital,
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': ORG.id },
        inLanguage: 'fr-FR',
      },
    ],
  };
}

export function injectSchemaLd() {
  if (document.querySelector('script[data-incitta-schema]')) return;

  const pageUrl = new URL(
    document.querySelector('link[rel="canonical"]')?.href ||
      window.location.pathname,
    SITE_ORIGIN,
  ).href;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-incitta-schema', 'graph');
  script.textContent = JSON.stringify(buildSchemaGraph(pageUrl));
  document.head.appendChild(script);
}
