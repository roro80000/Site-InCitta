import { getLocale } from '../accessibility/strings.js';
import { MESSAGES, PAGE_META } from './messages/index.js';
import { GLOBAL_RULES, PAGE_RULES } from './page-rules.js';

const PAGE_ID_MAP = {
  'index.html': 'home',
  '': 'home',
  'a-propos.html': 'about',
  'synergies.html': 'synergies',
  'inconcertta.html': 'inconcertta',
  'contact.html': 'contact',
  'demarche-participative.html': 'participative',
  'programmation-territoriale.html': 'territory',
  'ingenierie-financiere.html': 'finance',
  'evaluation-politiques-publiques.html': 'evaluation',
  'mentions-legales.html': 'legal',
  'actualites.html': 'news',
  'actualite-detail.html': 'newsDetail',
};

/**
 * @param {string} key
 * @param {string} [locale]
 */
export function tSite(key, locale = getLocale()) {
  const entry = MESSAGES[key];
  if (!entry) return null;
  return entry[locale] ?? entry.fr ?? null;
}

export function getPageId() {
  const path = (window.location.pathname || '').split('/').pop() || 'index.html';
  return PAGE_ID_MAP[path] ?? 'home';
}

/**
 * @param {Element} el
 * @param {string} value
 */
function applyValue(el, value) {
  if (el.hasAttribute('data-i18n-html') || el.getAttribute('data-i18n-mode') === 'html') {
    el.innerHTML = value;
    return;
  }
  el.textContent = value;
}

/**
 * @param {Element} el
 * @param {string} value
 */
function applySvgText(el, value) {
  const svg = el.querySelector('svg');
  el.textContent = '';
  if (svg) el.appendChild(svg.cloneNode(true));
  el.appendChild(document.createTextNode(value));
}

/**
 * @param {import('./page-rules.js').PageRule} rule
 * @param {string} locale
 */
function applyRule(rule, locale) {
  const value = tSite(rule.key, locale);
  if (value == null) return;

  document.querySelectorAll(rule.selector).forEach((el, index) => {
    if (rule.index !== undefined && index !== rule.index) return;

    if (rule.mode === 'svgText') {
      applySvgText(el, value);
      return;
    }
    if (rule.attr) {
      el.setAttribute(rule.attr, value);
      return;
    }
    if (rule.html) el.innerHTML = value;
    else el.textContent = value;
  });
}

function applyPageMeta(pageId, locale) {
  const meta = PAGE_META[pageId];
  if (!meta) return;
  if (meta.title?.[locale]) document.title = meta.title[locale];
  const desc = meta.description?.[locale];
  if (desc) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  }
}

function applyDataI18nElements(locale) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    if (el.hasAttribute('data-i18n-attr')) return;
    const value = tSite(key, locale);
    if (value == null) return;
    applyValue(el, value);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    if (!key || !attr) return;
    const value = tSite(key, locale);
    if (value != null) el.setAttribute(attr, value);
  });
}

function syncInconcerttaExpandButton(locale) {
  const host = document.getElementById('inconcertta-live-embed');
  const btn = document.getElementById('inconcertta-embed-expand');
  if (!host || !btn) return;

  const expanded = host.classList.contains('is-fullscreen');
  const label = tSite(expanded ? 'inconcertta.demo.closeShort' : 'inconcertta.demo.expandShort', locale);
  const aria = tSite(expanded ? 'inconcertta.demo.close' : 'inconcertta.demo.expand', locale);
  if (label != null) btn.textContent = label;
  if (aria != null) btn.setAttribute('aria-label', aria);
}

export function applySiteI18n(locale = getLocale()) {
  document.documentElement.lang = locale === 'en' ? 'en' : locale;

  applyDataI18nElements(locale);
  GLOBAL_RULES.forEach((rule) => applyRule(rule, locale));

  const pageId = getPageId();
  (PAGE_RULES[pageId] || []).forEach((rule) => applyRule(rule, locale));

  syncInconcerttaExpandButton(locale);
  applyPageMeta(pageId, locale);
}
