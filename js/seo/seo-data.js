/** Données sémantiques partagées (Schema.org + maillage footer). */
export const SITE_ORIGIN = 'https://incitta.eu';

export const ORG = {
  id: `${SITE_ORIGIN}/#organization`,
  name: 'InCitta',
  email: 'contact@incitta.eu',
  telephone: undefined,
  address: {
    streetAddress: '26 rue Jean-Baptiste TRANNOY',
    postalCode: '80000',
    addressLocality: 'Amiens',
    addressRegion: 'Hauts-de-France',
    addressCountry: 'FR',
  },
};

/** Pages prestations (maillage interne). */
export const SERVICES = {
  territoire: {
    key: 'territoire',
    path: 'programmation-territoriale.html',
    name: 'Aménagement des territoires et programmation',
    serviceTypes: [
      'Consultant en aménagement des territoires',
      'Expert aménagement du territoire',
      'Cabinet d\'études territoriales',
      'Bureau d\'études urbanisme',
      'Ingénierie territoriale',
    ],
    short: 'aménagement du territoire',
    national: false,
  },
  concertation: {
    key: 'concertation',
    path: 'demarche-participative.html',
    name: 'Concertation et démocratie participative',
    serviceTypes: [
      'Consultant en concertation',
      'Expert démocratie participative',
      'Animation de démarches participatives',
      'Concertation citoyenne',
    ],
    short: 'concertation participative',
    national: false,
  },
  evaluation: {
    key: 'evaluation',
    path: 'evaluation-politiques-publiques.html',
    name: 'Évaluation des politiques publiques',
    serviceTypes: [
      'Expert évaluation des politiques publiques',
      'Consultant évaluation territoriale',
      'Cabinet d\'études évaluation',
      'Mesure d\'impact territorial',
    ],
    short: 'évaluation des politiques publiques',
    national: false,
  },
  financement: {
    key: 'financement',
    path: 'ingenierie-financiere.html',
    name: 'Ingénierie financière et recherche de subventions',
    serviceTypes: [
      'Consultant ingénierie financière',
      'Expert recherche de financement',
      'Recherche de subventions collectivités',
      'Montage de dossiers AAP et AMI',
    ],
    short: 'ingénierie financière',
    national: false,
  },
  numerique: {
    key: 'numerique',
    path: 'inconcertta.html',
    name: 'Plateforme de concertation numérique InConcertta',
    serviceTypes: [
      'Concertation citoyenne en ligne',
      'E-démocratie',
      'Plateforme de démocratie participative',
      'Concertation numérique à l\'échelle nationale',
    ],
    short: 'concertation numérique',
    national: true,
  },
};

export const REGIONS = [
  { name: 'Hauts-de-France', departments: ['Somme', 'Oise', 'Aisne', 'Nord', 'Pas-de-Calais'] },
  { name: 'Normandie', departments: ['Seine-Maritime'] },
  { name: 'Grand Est', departments: ['Marne'] },
  {
    name: 'Île-de-France',
    departments: ['Paris', 'Seine-et-Marne', 'Yvelines', 'Essonne', 'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', "Val-d'Oise"],
  },
];

export const DEPARTMENTS = [
  { name: 'Somme', code: '80', region: 'Hauts-de-France', cities: ['Amiens', 'Abbeville', 'Albert', 'Péronne', 'Roye', 'Montdidier'] },
  { name: 'Oise', code: '60', region: 'Hauts-de-France', cities: ['Beauvais', 'Compiègne', 'Creil', 'Nogent-sur-Oise', 'Senlis', 'Clermont'] },
  { name: 'Aisne', code: '02', region: 'Hauts-de-France', cities: ['Saint-Quentin', 'Soissons', 'Laon', 'Château-Thierry', 'Tergnier'] },
  { name: 'Nord', code: '59', region: 'Hauts-de-France', cities: ['Lille', 'Dunkerque', 'Valenciennes', 'Douai', 'Cambrai', 'Maubeuge'] },
  { name: 'Pas-de-Calais', code: '62', region: 'Hauts-de-France', cities: ['Calais', 'Boulogne-sur-Mer', 'Arras', 'Lens', 'Saint-Omer', 'Béthune'] },
  { name: 'Marne', code: '51', region: 'Grand Est', cities: ['Reims', 'Châlons-en-Champagne', 'Épernay', 'Vitry-le-François'] },
  { name: 'Seine-Maritime', code: '76', region: 'Normandie', cities: ['Rouen', 'Le Havre', 'Dieppe', 'Sotteville-lès-Rouen', 'Saint-Étienne-du-Rouvray'] },
  { name: 'Paris', code: '75', region: 'Île-de-France', cities: ['Paris'] },
  { name: 'Seine-et-Marne', code: '77', region: 'Île-de-France', cities: ['Meaux', 'Melun', 'Chelles'] },
  { name: 'Yvelines', code: '78', region: 'Île-de-France', cities: ['Versailles', 'Saint-Germain-en-Laye', 'Mantes-la-Jolie'] },
  { name: 'Essonne', code: '91', region: 'Île-de-France', cities: ['Évry-Courcouronnes', 'Corbeil-Essonnes', 'Massy'] },
  { name: 'Hauts-de-Seine', code: '92', region: 'Île-de-France', cities: ['Nanterre', 'Boulogne-Billancourt', 'Courbevoie'] },
  { name: 'Seine-Saint-Denis', code: '93', region: 'Île-de-France', cities: ['Saint-Denis', 'Montreuil', 'Aubervilliers'] },
  { name: 'Val-de-Marne', code: '94', region: 'Île-de-France', cities: ['Créteil', 'Vitry-sur-Seine', 'Champigny-sur-Marne'] },
  { name: "Val-d'Oise", code: '95', region: 'Île-de-France', cities: ['Cergy', 'Argenteuil', 'Sarcelles'] },
];

const REGIONAL_SERVICE_KEYS = ['territoire', 'concertation', 'evaluation', 'financement'];

/** Ancres footer : modèles croisant métier × lieu. */
export const FOOTER_ANCHOR_TEMPLATES = [
  (svc, place) => `Cabinet d'études ${svc.short} ${place}`,
  (svc, place) => `Expert ${svc.short} ${place}`,
  (svc, place) => `Consultant ${svc.short} ${place}`,
  (svc, place) => `Bureau d'études ${place}`,
];

export const NATIONAL_FOOTER_LINKS = [
  { href: SERVICES.numerique.path, label: 'Concertation citoyenne numérique France' },
  { href: SERVICES.numerique.path, label: 'Plateforme e-démocratie nationale' },
  { href: SERVICES.concertation.path, label: 'Démocratie participative sur tout le territoire' },
  { href: SERVICES.numerique.path, label: 'Consultation citoyenne en ligne France' },
];

export function serviceUrl(path) {
  return path.startsWith('http') ? path : path;
}

export function allRegionalServiceKeys() {
  return REGIONAL_SERVICE_KEYS;
}

export function pickServiceForCityIndex(index) {
  return SERVICES[REGIONAL_SERVICE_KEYS[index % REGIONAL_SERVICE_KEYS.length]];
}

export function buildAreaServedPlaces() {
  const places = [];
  const seen = new Set();

  const push = (node) => {
    const key = JSON.stringify(node);
    if (seen.has(key)) return;
    seen.add(key);
    places.push(node);
  };

  REGIONS.forEach((r) => {
    push({ '@type': 'AdministrativeArea', name: r.name, containedInPlace: { '@type': 'Country', name: 'France' } });
  });

  DEPARTMENTS.forEach((d) => {
    push({
      '@type': 'AdministrativeArea',
      name: d.name,
      identifier: `FR-${d.code}`,
      containedInPlace: { '@type': 'AdministrativeArea', name: d.region },
    });
    d.cities.forEach((city) => {
      push({
        '@type': 'City',
        name: city,
        containedInPlace: { '@type': 'AdministrativeArea', name: d.name },
      });
    });
  });

  push({ '@type': 'Country', name: 'France', identifier: 'FR' });
  return places;
}
