/** @typedef {{ fr: string, en: string, es: string, it: string }} LocaleMessage */

/**
 * @param {string} fr
 * @param {string} en
 * @param {string} es
 * @param {string} it
 * @returns {LocaleMessage}
 */
export function tr(fr, en, es, it) {
  return { fr, en, es, it };
}

/**
 * @param {Record<string, LocaleMessage>} entries
 * @returns {Record<string, LocaleMessage>}
 */
export function msg(entries) {
  return entries;
}
