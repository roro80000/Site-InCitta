/**
 * Initialisation accessibilité — site vitrine InCitta.
 */

import { bootstrapAccessibilityScope, createAccessibilityStore } from './store.js';
import { createAccessibilityUI } from './ui.js';

let uiInstance = null;
let storeInstance = null;

const A11Y_STYLESHEETS = [
  'display-settings-panel.css',
  'a11y-effects.css',
  'incitta-a11y-ui.css',
];

/** Charge les CSS a11y via <link> (fiable même si @import échoue ou cache obsolète). */
function ensureA11yStylesheets() {
  for (const file of A11Y_STYLESHEETS) {
    const id = `incitta-a11y-css-${file}`;
    if (document.getElementById(id)) continue;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = new URL(`../../styles/a11y/${file}`, import.meta.url).href;
    document.head.appendChild(link);
  }
}

export function initAccessibility() {
  if (uiInstance) return uiInstance;

  ensureA11yStylesheets();
  bootstrapAccessibilityScope();

  storeInstance = createAccessibilityStore();
  storeInstance.apply();

  uiInstance = createAccessibilityUI(storeInstance);
  return uiInstance;
}

export function getAccessibilityStore() {
  return storeInstance;
}
