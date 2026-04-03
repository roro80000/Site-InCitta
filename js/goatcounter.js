/**
 * Mesure d’audience agrégée (GoatCounter) — pas de cookie visiteur pour le comptage.
 * Autre domaine (ex. presentation.inconcertta.fr) : soit le même code ici (stats mélangées),
 * soit un 2e site GoatCounter + un autre fichier goatcounter.js sur l’autre dépôt/site.
 */
export const GOATCOUNTER_SITE = 'ronanottini';

export function initGoatCounter() {
  const site = typeof GOATCOUNTER_SITE === 'string' ? GOATCOUNTER_SITE.trim() : '';
  if (!site) return;

  const endpoint = `https://${site}.goatcounter.com/count`;
  if (document.querySelector(`script[data-goatcounter="${endpoint}"]`)) return;

  const s = document.createElement('script');
  s.async = true;
  s.dataset.goatcounter = endpoint;
  s.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(s);
}
