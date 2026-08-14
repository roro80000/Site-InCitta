/**
 * Chaînes du panneau accessibilité (FR / EN / ES / IT).
 */

import { A11Y_ES, A11Y_IT } from './a11y-locales-es-it.js';

export const SUPPORTED_LOCALES = ['fr', 'en', 'es', 'it'];
export const LOCALE_STORAGE_KEY = 'inconcertta:locale';

const STRINGS = {
  fr: {
    'display.title': 'Affichage sur-mesure',
    'display.openButton': "Options d'affichage et de langue",
    'display.reset': 'Tout réinitialiser',
    'display.section.vision': 'Confort visuel',
    'display.section.reading': 'Lecture',
    'display.section.motion': 'Animations et navigation',
    'display.section.language': 'Langue',
    'display.section.comprehension': 'Lecture vocale',
    'display.fontScale.label': 'Taille du texte',
    'display.fontScale.normal': 'Normal',
    'display.fontScale.large': 'Grand',
    'display.fontScale.xlarge': 'Très grand',
    'display.smartInvert': 'Inversion intelligente',
    'display.smartInvert.desc': 'Inverse les couleurs sans toucher aux images',
    'display.highContrast': 'Renforcer le contraste',
    'display.linkHighlight': 'Souligner les liens',
    'display.largeCursor': 'Agrandir le curseur',
    'display.dyslexia': 'Police adaptée à la dyslexie',
    'display.colorBlindness.label': 'Filtre daltonisme',
    'display.colorBlindness.off': 'Aucun',
    'display.colorBlindness.protanopia': 'Protanopie (rouge)',
    'display.colorBlindness.deuteranopia': 'Deutéranopie (vert)',
    'display.colorBlindness.tritanopia': 'Tritanopie (bleu)',
    'display.colorBlindness.achromatopsia': 'Monochromie',
    'display.reduceMotion': 'Réduire les animations',
    'display.motorAssist': 'Agrandir les zones cliquables',
    'display.focusMode': 'Mode concentration',
    'display.lineSpacing.label': 'Espacement des lignes',
    'display.lineSpacing.normal': 'Normal',
    'display.lineSpacing.loose': 'Aéré',
    'display.lineSpacing.extra': 'Large',
    'display.tts.regionLabel': 'Lecteur de texte à voix haute',
    'display.tts.unsupported': "La lecture vocale n'est pas supportée par ce navigateur.",
    'display.tts.readSelection': 'Lire la sélection',
    'display.tts.newReading': 'Nouvelle lecture',
    'display.tts.readSelectionHint': 'Sélectionnez du texte puis cliquez pour l\'écouter',
    'display.tts.controlsLabel': 'Contrôles de lecture',
    'display.tts.pause': 'Pause',
    'display.tts.resume': 'Reprendre',
    'display.tts.stop': 'Arrêter',
    'display.tts.settingsLabel': 'Réglages de la voix',
    'display.tts.rate.label': 'Vitesse',
    'display.tts.rate.verySlow': 'Très lent',
    'display.tts.rate.slow': 'Lent',
    'display.tts.rate.normal': 'Normal',
    'display.tts.rate.fast': 'Rapide',
    'display.tts.rate.veryFast': 'Très rapide',
    'display.tts.rate.ultraFast': 'Ultra rapide',
    'display.tts.voice.label': 'Voix',
    'display.tts.voice.female': 'Féminine',
    'display.tts.voice.male': 'Masculine',
    'display.tts.voice.neutral': 'Neutre',
    'display.tts.previewLabel': 'Texte lu',
    'display.tts.hint': 'Sélectionnez du texte dans la page, puis cliquez sur « Lire la sélection »',
    'locale.fr': 'Français',
    'locale.en': 'English',
    'locale.es': 'Español',
    'locale.it': 'Italiano',
    'actions.close': 'Fermer',
  },
  en: {
    'display.title': 'Custom display',
    'display.openButton': 'Display and language options',
    'display.reset': 'Reset all',
    'display.section.vision': 'Visual comfort',
    'display.section.reading': 'Reading',
    'display.section.motion': 'Motion and navigation',
    'display.section.language': 'Language',
    'display.section.comprehension': 'Text-to-speech',
    'display.fontScale.label': 'Text size',
    'display.fontScale.normal': 'Normal',
    'display.fontScale.large': 'Large',
    'display.fontScale.xlarge': 'Extra large',
    'display.smartInvert': 'Smart invert',
    'display.smartInvert.desc': 'Inverts colors without affecting images',
    'display.highContrast': 'High contrast',
    'display.linkHighlight': 'Underline links',
    'display.largeCursor': 'Large cursor',
    'display.dyslexia': 'Dyslexia-friendly font',
    'display.colorBlindness.label': 'Color blindness filter',
    'display.colorBlindness.off': 'None',
    'display.colorBlindness.protanopia': 'Protanopia (red)',
    'display.colorBlindness.deuteranopia': 'Deuteranopia (green)',
    'display.colorBlindness.tritanopia': 'Tritanopia (blue)',
    'display.colorBlindness.achromatopsia': 'Achromatopsia',
    'display.reduceMotion': 'Reduce motion',
    'display.motorAssist': 'Larger click targets',
    'display.focusMode': 'Focus mode',
    'display.lineSpacing.label': 'Line spacing',
    'display.lineSpacing.normal': 'Normal',
    'display.lineSpacing.loose': 'Loose',
    'display.lineSpacing.extra': 'Wide',
    'display.tts.regionLabel': 'Text-to-speech player',
    'display.tts.unsupported': 'Text-to-speech is not supported in this browser.',
    'display.tts.readSelection': 'Read selection',
    'display.tts.newReading': 'New reading',
    'display.tts.readSelectionHint': 'Select text then click to listen',
    'display.tts.controlsLabel': 'Playback controls',
    'display.tts.pause': 'Pause',
    'display.tts.resume': 'Resume',
    'display.tts.stop': 'Stop',
    'display.tts.settingsLabel': 'Voice settings',
    'display.tts.rate.label': 'Speed',
    'display.tts.rate.verySlow': 'Very slow',
    'display.tts.rate.slow': 'Slow',
    'display.tts.rate.normal': 'Normal',
    'display.tts.rate.fast': 'Fast',
    'display.tts.rate.veryFast': 'Very fast',
    'display.tts.rate.ultraFast': 'Ultra fast',
    'display.tts.voice.label': 'Voice',
    'display.tts.voice.female': 'Female',
    'display.tts.voice.male': 'Male',
    'display.tts.voice.neutral': 'Neutral',
    'display.tts.previewLabel': 'Text read',
    'display.tts.hint': 'Select text on the page, then click "Read selection"',
    'locale.fr': 'Français',
    'locale.en': 'English',
    'locale.es': 'Español',
    'locale.it': 'Italiano',
    'actions.close': 'Close',
  },
  es: A11Y_ES,
  it: A11Y_IT,
};

let currentLocale = 'fr';

export function getLocale() {
  return currentLocale;
}

export function getStoredLocale() {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && SUPPORTED_LOCALES.includes(raw)) return raw;
  } catch { /* ignore */ }
  try {
    const code = (navigator.language || 'fr').split('-')[0].toLowerCase();
    if (SUPPORTED_LOCALES.includes(code)) return code;
  } catch { /* ignore */ }
  return 'fr';
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;
  currentLocale = locale;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch { /* ignore */ }
  document.documentElement.lang = locale === 'en' ? 'en' : locale;
}

export function initLocale() {
  currentLocale = getStoredLocale();
  document.documentElement.lang = currentLocale === 'en' ? 'en' : currentLocale;
}

export function t(key) {
  const dict = STRINGS[currentLocale] || STRINGS.fr;
  return dict[key] ?? STRINGS.en?.[key] ?? STRINGS.fr[key] ?? key;
}
