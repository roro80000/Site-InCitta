/**
 * Effets accessibilité sur le DOM (classes body + zoom / filtres).
 * Adapté du player InConcertta pour le site vitrine statique.
 */

import {
  FONT_SCALE_NORMAL,
  FONT_SCALE_LARGE,
  FONT_SCALE_XLARGE,
} from './accessibilityPrefs.js';

const SMART_INVERT_FILTER = 'invert(1) hue-rotate(180deg)';

export const A11Y_SVG_FILTERS_CONTAINER_ID = 'inconcertta-a11y-svg-filters';
const A11Y_HTML_FILTER_CLASS = 'inconcertta-a11y-visual-filter';

export const COLOR_BLINDNESS_MODES = [
  'protanopia',
  'deuteranopia',
  'tritanopia',
  'achromatopsia',
];

export const COLOR_BLINDNESS_FILTER_IDS = {
  protanopia: 'a11y-protanopia',
  deuteranopia: 'a11y-deuteranopia',
  tritanopia: 'a11y-tritanopia',
  achromatopsia: 'a11y-achromatopsia',
};

const COLOR_BLINDNESS_MATRICES = {
  protanopia:
    '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
  deuteranopia:
    '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
  tritanopia:
    '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0',
  achromatopsia:
    '0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0',
};

export const A11Y_SCOPE_CLASS = 'a11y-scope';

export const A11Y_BODY_CLASSES = [
  'a11y-font-large',
  'a11y-font-xlarge',
  'a11y-smart-invert',
  'a11y-contrast',
  'a11y-links',
  'a11y-cursor',
  'a11y-dyslexia',
  'a11y-protanopia',
  'a11y-deuteranopia',
  'a11y-tritanopia',
  'a11y-achromatopsia',
  'a11y-safe-motion',
  'a11y-motor',
  'a11y-focus-mode',
];

let svgFiltersReady = false;

export function ensureAllColorBlindnessSvgFilters() {
  if (typeof document === 'undefined') return;
  if (svgFiltersReady && document.getElementById(A11Y_SVG_FILTERS_CONTAINER_ID)) return;

  document.getElementById(A11Y_SVG_FILTERS_CONTAINER_ID)?.remove();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', A11Y_SVG_FILTERS_CONTAINER_ID);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  for (const mode of COLOR_BLINDNESS_MODES) {
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', COLOR_BLINDNESS_FILTER_IDS[mode]);
    filter.setAttribute('color-interpolation-filters', 'linearRGB');

    const matrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    matrix.setAttribute('type', 'matrix');
    matrix.setAttribute('values', COLOR_BLINDNESS_MATRICES[mode]);

    filter.appendChild(matrix);
    defs.appendChild(filter);
  }

  svg.appendChild(defs);
  document.body.insertBefore(svg, document.body.firstChild);
  svgFiltersReady = true;
}

/**
 * @param {import('./accessibilityPrefs.js').DEFAULT_A11Y_PREFS} prefs
 * @returns {string[]}
 */
export function prefsToClasses(prefs) {
  const c = [];
  if (prefs.fontScale >= FONT_SCALE_XLARGE) c.push('a11y-font-xlarge');
  else if (prefs.fontScale >= FONT_SCALE_LARGE) c.push('a11y-font-large');
  if (prefs.smartInvert) c.push('a11y-smart-invert');
  if (prefs.highContrast) c.push('a11y-contrast');
  if (prefs.linkHighlight) c.push('a11y-links');
  if (prefs.largeCursor) c.push('a11y-cursor');
  if (prefs.dyslexia) c.push('a11y-dyslexia');
  if (prefs.colorBlindness !== 'off') c.push(`a11y-${prefs.colorBlindness}`);
  if (prefs.reduceMotion) c.push('a11y-safe-motion');
  if (prefs.motorAssist) c.push('a11y-motor');
  if (prefs.focusMode) c.push('a11y-focus-mode');
  return c;
}

/**
 * @param {import('./accessibilityPrefs.js').DEFAULT_A11Y_PREFS} prefs
 * @returns {string|null}
 */
export function buildRootVisualFilter(prefs) {
  const parts = [];
  if (prefs.smartInvert) parts.push(SMART_INVERT_FILTER);
  if (
    prefs.colorBlindness !== 'off'
    && COLOR_BLINDNESS_FILTER_IDS[prefs.colorBlindness]
  ) {
    parts.push(`url(#${COLOR_BLINDNESS_FILTER_IDS[prefs.colorBlindness]})`);
  }
  return parts.length > 0 ? parts.join(' ') : null;
}

export function clearA11yVisualFilterEffects() {
  if (typeof document === 'undefined') return;

  document.getElementById(A11Y_SVG_FILTERS_CONTAINER_ID)?.remove();
  svgFiltersReady = false;

  const html = document.documentElement;
  html.classList.remove(A11Y_HTML_FILTER_CLASS);
  html.style.removeProperty('filter');

  document.getElementById('root')?.style.removeProperty('filter');
  document.getElementById('root')?.style.removeProperty('zoom');
  document.body?.style.removeProperty('zoom');
  document.querySelector('.admin-page')?.style.removeProperty('zoom');
}

/**
 * @param {HTMLElement} body
 */
export function isA11yEffectsScope(body) {
  return (
    body.classList.contains('incitta-site')
    || body.classList.contains('app-player')
    || body.classList.contains('app-admin')
    || body.getAttribute('data-route-shell') === 'auth'
  );
}

function resolveFontScaleZoomTarget(body) {
  const root = document.getElementById('root');
  const adminPage = document.querySelector('.admin-page');
  if (body.classList.contains('app-admin') && adminPage) return adminPage;
  if (root) return root;
  return body;
}

function applyRootZoom(prefs) {
  const body = document.body;
  const root = document.getElementById('root');
  const adminPage = document.querySelector('.admin-page');

  root?.style.removeProperty('zoom');
  adminPage?.style.removeProperty('zoom');
  body?.style.removeProperty('zoom');

  if (prefs.fontScale <= FONT_SCALE_NORMAL) return;

  const target = resolveFontScaleZoomTarget(body);
  target?.style.setProperty('zoom', String(prefs.fontScale));
}

function applyHtmlVisualFilter(prefs) {
  const html = document.documentElement;
  document.getElementById('root')?.style.removeProperty('filter');

  ensureAllColorBlindnessSvgFilters();

  const filter = buildRootVisualFilter(prefs);

  if (!filter) {
    html.classList.remove(A11Y_HTML_FILTER_CLASS);
    html.style.removeProperty('filter');
    return;
  }

  html.classList.add(A11Y_HTML_FILTER_CLASS);
  html.style.setProperty('filter', filter, 'important');
}

/**
 * @param {import('./accessibilityPrefs.js').DEFAULT_A11Y_PREFS} prefs
 */
export function applyA11yEffects(prefs) {
  if (typeof document === 'undefined') return;

  const body = document.body;
  if (!body) return;

  A11Y_BODY_CLASSES.forEach((cls) => body.classList.remove(cls));
  body.classList.remove(A11Y_SCOPE_CLASS);

  if (!isA11yEffectsScope(body)) {
    clearA11yVisualFilterEffects();
    return;
  }

  body.classList.add(A11Y_SCOPE_CLASS);
  prefsToClasses(prefs).forEach((cls) => body.classList.add(cls));
  applyRootZoom(prefs);
  applyHtmlVisualFilter(prefs);
}
