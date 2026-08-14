import { applySiteI18n } from './site-i18n.js';
import { getAccessibilityStore } from '../accessibility/init-a11y.js';

export function initSiteI18n() {
  applySiteI18n();

  const store = getAccessibilityStore();
  if (store) {
    store.subscribe(() => applySiteI18n());
  }
}
