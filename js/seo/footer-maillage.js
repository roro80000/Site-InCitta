import {
  DEPARTMENTS,
  NATIONAL_FOOTER_LINKS,
  FOOTER_ANCHOR_TEMPLATES,
  pickServiceForCityIndex,
  SERVICES,
} from './seo-data.js';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else if (c) node.appendChild(c);
  });
  return node;
}

function linkLi(href, label) {
  return el('li', {}, [
    el('a', { href, text: label }),
  ]);
}

function buildNationalBlock() {
  const block = el('div', { class: 'footer-semantic__block footer-semantic__block--national' });
  block.appendChild(
    el('p', { class: 'footer-semantic__subtitle', text: 'France — concertation numérique' }),
  );
  const ul = el('ul', { class: 'footer-semantic__links' });
  NATIONAL_FOOTER_LINKS.forEach(({ href, label }) => {
    ul.appendChild(linkLi(href, label));
  });
  block.appendChild(ul);
  return block;
}

function buildDepartmentDetails(dept, cityIndexStart) {
  const details = el('details', { class: 'footer-semantic__dept' });
  const summary = el('summary', {
    class: 'footer-semantic__dept-name',
    text: `${dept.name} (${dept.code})`,
  });
  details.appendChild(summary);
  const ul = el('ul', { class: 'footer-semantic__links footer-semantic__links--cities' });
  let idx = cityIndexStart;
  dept.cities.forEach((city) => {
    const svc = pickServiceForCityIndex(idx);
    const template = FOOTER_ANCHOR_TEMPLATES[idx % FOOTER_ANCHOR_TEMPLATES.length];
    ul.appendChild(linkLi(svc.path, template(svc, city)));
    idx += 1;
  });
  details.appendChild(ul);
  return { node: details, nextIndex: idx };
}

function buildRegionDetails(regionName, depts) {
  const details = el('details', { class: 'footer-semantic__region' });
  details.appendChild(
    el('summary', { class: 'footer-semantic__region-name', text: regionName }),
  );
  const inner = el('div', { class: 'footer-semantic__depts' });
  let idx = 0;
  depts.forEach((dept) => {
    const built = buildDepartmentDetails(dept, idx);
    inner.appendChild(built.node);
    idx = built.nextIndex;
  });
  details.appendChild(inner);
  return details;
}

/** Pied de page léger (toutes les pages sauf index déjà exclu par mentions = full only there). */
export function buildFooterMaillageSoft() {
  const nav = el('nav', {
    class: 'footer-semantic footer-semantic--soft',
    'aria-label': 'Prestations et zones d\'intervention InCitta',
  });

  const ul = el('ul', { class: 'footer-semantic-soft__links' });
  const items = [
    { href: SERVICES.territoire.path, label: 'Aménagement des territoires' },
    { href: SERVICES.concertation.path, label: 'Concertation' },
    { href: SERVICES.evaluation.path, label: 'Évaluation' },
    { href: SERVICES.financement.path, label: 'Ingénierie financière' },
    { href: SERVICES.numerique.path, label: 'InConcertta' },
    {
      href: 'mentions-legales.html#zones-intervention-annexe',
      label: 'Zones d\'intervention',
    },
  ];

  items.forEach(({ href, label }, i) => {
    if (i > 0) {
      const sep = el('li', { class: 'footer-semantic-soft__sep', 'aria-hidden': 'true', text: '·' });
      ul.appendChild(sep);
    }
    ul.appendChild(linkLi(href, label));
  });

  nav.appendChild(ul);
  return nav;
}

export function buildFooterMaillage() {
  const nav = el('nav', {
    class: 'footer-semantic footer-semantic--full',
    'aria-label': 'Zones d\'intervention et expertises InCitta',
  });

  nav.appendChild(
    el('p', {
      class: 'footer-semantic__title',
      text: 'Nos zones d\'intervention',
    }),
  );

  nav.appendChild(buildNationalBlock());

  const grid = el('div', { class: 'footer-semantic__regions' });

  const byRegion = new Map();
  DEPARTMENTS.forEach((d) => {
    if (!byRegion.has(d.region)) byRegion.set(d.region, []);
    byRegion.get(d.region).push(d);
  });

  ['Hauts-de-France', 'Normandie', 'Grand Est', 'Île-de-France'].forEach((region) => {
    const depts = byRegion.get(region);
    if (depts?.length) grid.appendChild(buildRegionDetails(region, depts));
  });

  nav.appendChild(grid);

  const services = el('p', { class: 'footer-semantic__services-hint' });
  services.innerHTML =
    'Prestations : <a href="' +
    SERVICES.territoire.path +
    '">aménagement des territoires</a> · <a href="' +
    SERVICES.concertation.path +
    '">concertation</a> · <a href="' +
    SERVICES.evaluation.path +
    '">évaluation</a> · <a href="' +
    SERVICES.financement.path +
    '">ingénierie financière</a> · <a href="' +
    SERVICES.numerique.path +
    '">InConcertta</a>';

  nav.appendChild(services);
  return nav;
}

export function isMentionsLegalesPage() {
  const path = (window.location.pathname || '').toLowerCase();
  return (
    path.endsWith('mentions-legales.html') ||
    path.endsWith('/mentions-legales') ||
    path.endsWith('/mentions-legales/')
  );
}

export function injectFooterMaillage() {
  const footer = document.querySelector('.footer--site .container');
  if (!footer || footer.querySelector('.footer-semantic')) return;

  const block = isMentionsLegalesPage()
    ? buildFooterMaillage()
    : buildFooterMaillageSoft();

  footer.insertBefore(block, footer.firstElementChild);
}
