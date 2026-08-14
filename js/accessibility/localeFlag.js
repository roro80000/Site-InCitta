/**
 * Drapeaux SVG pour le sélecteur de langue (aligné sur LocaleFlag.jsx du player).
 */

import { SUPPORTED_LOCALES } from './strings.js';

const FLAG_ASPECT = 4 / 3;
let flagIdCounter = 0;

function nextFlagIdSuffix() {
  flagIdCounter += 1;
  return String(flagIdCounter);
}

/**
 * @param {string} locale
 * @param {number} width
 * @param {number} height
 * @param {string} idSuffix
 * @returns {string}
 */
function flagSvgMarkup(locale, width, height, idSuffix) {
  const common = `width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet"`;

  switch (locale) {
    case 'fr':
      return `<svg ${common} viewBox="0 0 4 3"><rect width="1.333" height="3" fill="#002395"/><rect x="1.333" width="1.334" height="3" fill="#ffffff"/><rect x="2.667" width="1.333" height="3" fill="#ed2939"/></svg>`;
    case 'it':
      return `<svg ${common} viewBox="0 0 4 3"><rect width="1.333" height="3" fill="#009246"/><rect x="1.333" width="1.334" height="3" fill="#ffffff"/><rect x="2.667" width="1.333" height="3" fill="#ce2b37"/></svg>`;
    case 'es':
      return `<svg ${common} viewBox="0 0 4 3"><rect width="4" height="3" fill="#c60b1e"/><rect y="0.75" width="4" height="1.5" fill="#ffc400"/></svg>`;
    case 'en': {
      const clipS = `locale-flag-gb-s-${idSuffix}`;
      const clipT = `locale-flag-gb-t-${idSuffix}`;
      return `<svg ${common} viewBox="10 0 40 30"><clipPath id="${clipS}"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="${clipT}"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#${clipS})"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#${clipT})" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#ffffff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;
    }
    default:
      return '';
  }
}

/**
 * @param {string} locale
 * @param {number} [size=18]
 * @returns {HTMLElement | null}
 */
export function createLocaleFlag(locale, size = 18) {
  if (!SUPPORTED_LOCALES.includes(locale)) return null;

  const height = size;
  const width = Math.round(size * FLAG_ASPECT * 10) / 10;
  const markup = flagSvgMarkup(locale, width, height, nextFlagIdSuffix());
  if (!markup) return null;

  const wrap = document.createElement('span');
  wrap.className = 'locale-flag';
  wrap.setAttribute('aria-hidden', 'true');
  Object.assign(wrap.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    width: `${width}px`,
    height: `${height}px`,
    lineHeight: '0',
  });
  wrap.innerHTML = markup;
  return wrap;
}
