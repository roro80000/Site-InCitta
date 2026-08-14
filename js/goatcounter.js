/**
 * Mesure d’audience GoatCounter — Incitta (chargé uniquement après consentement analytics).
 */
export const GOATCOUNTER_SITE = 'incitta';

export function initGoatCounter() {
  const site = typeof GOATCOUNTER_SITE === 'string' ? GOATCOUNTER_SITE.trim() : '';
  if (!site) return false;

  const endpoint = `https://${site}.goatcounter.com/count`;
  if (document.querySelector(`script[data-goatcounter="${endpoint}"]`)) return true;

  const script = document.createElement('script');
  script.async = true;
  script.dataset.goatcounter = endpoint;
  script.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(script);
  return true;
}
