/**
 * UI accessibilité — bouton demi-cercle + volet latéral (vanilla JS).
 */

import {
  FONT_SCALE_NORMAL,
  FONT_SCALE_LARGE,
  FONT_SCALE_XLARGE,
  LINE_SPACING_NORMAL,
  LINE_SPACING_LOOSE,
  LINE_SPACING_EXTRA,
  normalizeFontScale,
} from './accessibilityPrefs.js';
import { LINE_SPACING_CONFIG } from './applyA11yLiteracyEffects.js';
import { SUPPORTED_LOCALES, t } from './strings.js';
import { VOICE_PROFILES } from './ttsVoiceProfiles.js';
import { initPanelDragScroll, ensurePanelScrollLayout } from './initPanelDragScroll.js';
import { createLocaleFlag } from './localeFlag.js';

const TTS_RATES = [0.5, 0.75, 0.95, 1.2];

/** Styles critiques inline — fallback minimal si CSS externe en retard. */
function applyCriticalDrawerStyles(drawer, shell) {
  Object.assign(drawer.style, {
    position: 'fixed',
    right: '0',
    zIndex: '29100',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    pointerEvents: 'none',
  });
  Object.assign(shell.style, {
    flex: '1 1 auto',
    alignSelf: 'stretch',
    minHeight: '0',
    height: '100%',
    maxHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'auto',
  });
}

function accessibilityIconSvg(size = 22) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 12s3.6-6.5 10-6.5 10 6.5 10 6.5-3.6 6.5-10 6.5S2 12 2 12z"/><circle class="incitta-a11y-trigger__pupil" cx="12" cy="12" r="2.75" fill="currentColor" stroke="none"/></svg>`;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([key, value]) => {
    if (value == null) return;
    if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value);
  });
  return node;
}

function buildToggleSwitch(id, label, description, checked, onChange) {
  const row = el('div', 'display-settings-panel__row');
  const textWrap = el('div', 'display-settings-panel__row-text');
  const labelId = `${id}-label`;
  textWrap.appendChild(el('span', 'display-settings-panel__row-label', { id: labelId, text: label }));
  if (description) {
    textWrap.appendChild(el('span', 'display-settings-panel__row-desc', { text: description }));
  }
  const btn = el('button', 'display-settings-panel__switch', {
    type: 'button',
    role: 'switch',
    'aria-checked': checked ? 'true' : 'false',
    'aria-labelledby': labelId,
  });
  btn.appendChild(el('span', 'display-settings-panel__switch-thumb', { 'aria-hidden': 'true' }));
  btn.addEventListener('click', () => onChange());
  row.append(textWrap, btn);
  return row;
}

function buildSection(title, children) {
  const section = el('section', 'display-settings-panel__section');
  if (title) section.appendChild(el('h3', 'display-settings-panel__section-title', { text: title }));
  children.forEach((child) => section.appendChild(child));
  return section;
}

function buildSegmentGroup(labelId, label, options, value, onChange) {
  const field = el('div', 'display-settings-panel__field');
  if (label) field.appendChild(el('span', 'display-settings-panel__label', { id: labelId, text: label }));
  const group = el('div', 'display-settings-panel__segmented', {
    role: 'group',
    'aria-labelledby': labelId,
  });
  options.forEach((opt) => {
    const selected = value === opt.value;
    const btn = el('button', `display-settings-panel__segment${selected ? ' display-settings-panel__segment--active' : ''}`, {
      type: 'button',
      'aria-pressed': selected ? 'true' : 'false',
      text: opt.label,
    });
    btn.addEventListener('click', () => onChange(opt.value));
    group.appendChild(btn);
  });
  field.appendChild(group);
  return field;
}

function buildRadioList(id, groupLabel, options, value, onChange) {
  const field = el('div', 'display-settings-panel__field');
  const list = el('div', 'display-settings-panel__option-list', {
    role: 'radiogroup',
    'aria-label': groupLabel,
  });
  options.forEach((opt) => {
    const selected = value === opt.value;
    const btn = el('button', `display-settings-panel__segment display-settings-panel__option${selected ? ' display-settings-panel__segment--active' : ''}`, {
      type: 'button',
      role: 'radio',
      'aria-checked': selected ? 'true' : 'false',
    });
    if (opt.leading) {
      const leadingWrap = el('span', 'display-settings-panel__option-leading');
      leadingWrap.appendChild(opt.leading);
      btn.appendChild(leadingWrap);
    }
    btn.appendChild(el('span', 'display-settings-panel__option-label', { text: opt.label }));
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (opt.value !== value) onChange(opt.value);
    });
    list.appendChild(btn);
  });
  field.appendChild(list);
  return field;
}

function buildTtsSection(store) {
  const { tts } = store;
  const region = el('div', 'display-settings-panel__tts a11y-no-invert', {
    role: 'region',
    'aria-label': t('display.tts.regionLabel'),
  });

  if (!tts.isSupported) {
    region.classList.add('display-settings-panel__tts--unsupported');
    region.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>${t('display.tts.unsupported')}</span>`;
    return { element: region, sync: () => {} };
  }

  const live = el('span', 'sr-only', { 'aria-live': 'polite', 'aria-atomic': 'true' });
  const controlsWrap = el('div', 'display-settings-panel__segmented display-settings-panel__tts-controls', {
    role: 'group',
    'aria-label': t('display.tts.controlsLabel'),
  });
  const preview = el('div', 'display-settings-panel__tts-preview', { 'aria-hidden': 'true' });
  preview.appendChild(el('span', 'display-settings-panel__tts-preview-label', { text: t('display.tts.previewLabel') }));
  const previewText = el('p', 'display-settings-panel__tts-preview-text');
  preview.appendChild(previewText);

  const playBtn = el('button', 'display-settings-panel__segment display-settings-panel__tts-play display-settings-panel__segment--active', {
    type: 'button',
    'aria-describedby': 'a11y-tts-hint',
    title: t('display.tts.readSelectionHint'),
  });
  playBtn.innerHTML = `<span class="display-settings-panel__tts-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85"><path d="M4 4l7.07 17 2.51-7.39L21 11.07z" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="display-settings-panel__tts-play-label">${t('display.tts.readSelection')}</span>`;
  playBtn.addEventListener('click', () => tts.speakSelection());

  const hint = el('p', 'display-settings-panel__row-desc display-settings-panel__tts-hint', {
    id: 'a11y-tts-hint',
    text: t('display.tts.hint'),
  });

  const settings = el('div', 'display-settings-panel__tts-settings');
  const rateField = el('div', 'display-settings-panel__field');
  rateField.appendChild(el('label', 'display-settings-panel__label', { for: 'a11y-tts-rate', text: t('display.tts.rate.label') }));
  const rateSelect = el('select', 'display-settings-panel__select', { id: 'a11y-tts-rate' });
  TTS_RATES.forEach((rate) => {
    const opt = el('option', '', { value: String(rate) });
    const labelKey =
      rate === 0.5 ? 'display.tts.rate.verySlow'
      : rate === 0.75 ? 'display.tts.rate.slow'
      : rate === 0.95 ? 'display.tts.rate.normal'
      : 'display.tts.rate.fast';
    opt.textContent = t(labelKey);
    rateSelect.appendChild(opt);
  });
  rateSelect.addEventListener('change', () => tts.setRate(Number(rateSelect.value)));
  rateField.appendChild(rateSelect);

  const voiceField = buildSegmentGroup(
    'a11y-tts-voice-label',
    t('display.tts.voice.label'),
    VOICE_PROFILES.map((profile) => ({
      value: profile,
      label: t(`display.tts.voice.${profile}`),
    })),
    tts.voiceProfile,
    (profile) => tts.setVoiceProfile(profile),
  );
  settings.append(rateField, voiceField);

  const pauseBtn = el('button', 'display-settings-panel__segment display-settings-panel__tts-control', { type: 'button' });
  const stopBtn = el('button', 'display-settings-panel__segment display-settings-panel__tts-control display-settings-panel__tts-control--stop', {
    type: 'button',
    'aria-label': t('display.tts.stop'),
  });
  stopBtn.innerHTML = `<span class="display-settings-panel__tts-control-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg></span><span>${t('display.tts.stop')}</span>`;
  stopBtn.addEventListener('click', () => tts.stop());

  const sync = () => {
    const isSpeaking = tts.status === 'speaking';
    const isPaused = tts.status === 'paused';
    const isActive = isSpeaking || isPaused;

    controlsWrap.replaceChildren();
    if (isActive) {
      pauseBtn.className = 'display-settings-panel__segment display-settings-panel__tts-control';
      pauseBtn.setAttribute('aria-label', isPaused ? t('display.tts.resume') : t('display.tts.pause'));
      pauseBtn.innerHTML = `<span class="display-settings-panel__tts-control-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="${isPaused ? 'M8 5v14l11-7z' : 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'}"/></svg></span><span>${isPaused ? t('display.tts.resume') : t('display.tts.pause')}</span>`;
      pauseBtn.onclick = () => tts.togglePause();
      controlsWrap.append(pauseBtn, stopBtn);
    }

    playBtn.classList.toggle('display-settings-panel__tts-play--live', isSpeaking);
    playBtn.classList.toggle('display-settings-panel__segment--active', !isActive);
    playBtn.querySelector('.display-settings-panel__tts-play-label').textContent =
      isActive ? t('display.tts.newReading') : t('display.tts.readSelection');
    playBtn.setAttribute('aria-label', isActive ? t('display.tts.newReading') : t('display.tts.readSelection'));

    hint.hidden = isActive;
    preview.hidden = !isActive || !tts.currentText;
    if (tts.currentText) {
      previewText.textContent =
        tts.currentText.slice(0, 120) + (tts.currentText.length > 120 ? '…' : '');
    }

    rateSelect.value = String(tts.preferences.rate);

    voiceField.querySelectorAll('.display-settings-panel__segment').forEach((btn, index) => {
      const profile = VOICE_PROFILES[index];
      const selected = tts.voiceProfile === profile;
      btn.classList.toggle('display-settings-panel__segment--active', selected);
      btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  };

  region.append(live, controlsWrap, playBtn, preview, settings, hint);
  return { element: region, sync };
}

function renderPanelBody(store, bodyEl, ttsBlock) {
  const { prefs } = store;
  bodyEl.replaceChildren();

  const fontScaleOptions = [
    { value: FONT_SCALE_NORMAL, label: t('display.fontScale.normal') },
    { value: FONT_SCALE_LARGE, label: t('display.fontScale.large') },
    { value: FONT_SCALE_XLARGE, label: t('display.fontScale.xlarge') },
  ];

  const colorBlindnessOptions = [
    { value: 'off', label: t('display.colorBlindness.off') },
    { value: 'protanopia', label: t('display.colorBlindness.protanopia') },
    { value: 'deuteranopia', label: t('display.colorBlindness.deuteranopia') },
    { value: 'tritanopia', label: t('display.colorBlindness.tritanopia') },
    { value: 'achromatopsia', label: t('display.colorBlindness.achromatopsia') },
  ];

  const lineSpacingOptions = [
    { value: LINE_SPACING_NORMAL, label: t(LINE_SPACING_CONFIG.normal.labelKey) },
    { value: LINE_SPACING_LOOSE, label: t(LINE_SPACING_CONFIG.loose.labelKey) },
    { value: LINE_SPACING_EXTRA, label: t(LINE_SPACING_CONFIG.extra.labelKey) },
  ];

  const localeOptions = SUPPORTED_LOCALES.map((loc) => ({
    value: loc,
    label: t(`locale.${loc}`),
    leading: createLocaleFlag(loc, 18),
  }));

  bodyEl.append(
    buildSection(t('display.section.vision'), [
      buildSegmentGroup(
        'a11y-font-scale-label',
        t('display.fontScale.label'),
        fontScaleOptions,
        normalizeFontScale(prefs.fontScale),
        (value) => store.setPref('fontScale', value),
      ),
      buildToggleSwitch('a11y-smart-invert', t('display.smartInvert'), t('display.smartInvert.desc'), prefs.smartInvert, () => store.togglePref('smartInvert')),
      buildToggleSwitch('a11y-contrast', t('display.highContrast'), null, prefs.highContrast, () => store.togglePref('highContrast')),
      buildToggleSwitch('a11y-links', t('display.linkHighlight'), null, prefs.linkHighlight, () => store.togglePref('linkHighlight')),
      buildToggleSwitch('a11y-cursor', t('display.largeCursor'), null, prefs.largeCursor, () => store.togglePref('largeCursor')),
    ]),
    buildSection(t('display.section.reading'), [
      buildToggleSwitch('a11y-dyslexia', t('display.dyslexia'), null, prefs.dyslexia, () => store.togglePref('dyslexia')),
      buildToggleSwitch('a11y-focus', t('display.focusMode'), null, prefs.focusMode, () => store.togglePref('focusMode')),
      buildSegmentGroup(
        'a11y-line-spacing-label',
        t('display.lineSpacing.label'),
        lineSpacingOptions,
        prefs.lineSpacing,
        (value) => store.setPref('lineSpacing', value),
      ),
    ]),
    buildSection(t('display.section.comprehension'), [
      ttsBlock.element,
    ]),
    buildSection(t('display.colorBlindness.label'), [
      buildRadioList('a11y-colorblind', t('display.colorBlindness.label'), colorBlindnessOptions, prefs.colorBlindness, (value) => store.setPref('colorBlindness', value)),
    ]),
    buildSection(t('display.section.motion'), [
      buildToggleSwitch('a11y-motion', t('display.reduceMotion'), null, prefs.reduceMotion, () => store.togglePref('reduceMotion')),
      buildToggleSwitch('a11y-motor', t('display.motorAssist'), null, prefs.motorAssist, () => store.togglePref('motorAssist')),
    ]),
    buildSection(t('display.section.language'), [
      buildRadioList('a11y-locale', t('display.section.language'), localeOptions, store.locale, (value) => store.setLocale(value)),
    ]),
  );
}

function renderPanelFooter(store, footerEl) {
  footerEl.replaceChildren();
  if (!store.isAnyEnabled) {
    footerEl.hidden = true;
    return;
  }
  footerEl.hidden = false;
  const resetBtn = el('button', 'display-settings-panel__reset', {
    type: 'button',
    text: t('display.reset'),
  });
  resetBtn.addEventListener('click', () => store.resetPrefs());
  footerEl.appendChild(resetBtn);
}

/**
 * @param {ReturnType<import('./store.js').createAccessibilityStore>} store
 */
export function createAccessibilityUI(store) {
  let open = false;
  let openedAt = 0;

  const trigger = el('button', 'incitta-a11y-trigger a11y-no-invert', {
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
    'aria-controls': 'incitta-a11y-panel',
    title: t('display.openButton'),
    'aria-label': t('display.openButton'),
    html: accessibilityIconSvg(24),
  });

  const badge = el('span', 'incitta-a11y-trigger__badge', { 'aria-hidden': 'true' });
  trigger.appendChild(badge);

  const drawer = el('div', 'incitta-a11y-drawer a11y-no-invert');

  const backdrop = el('div', 'display-settings-panel__backdrop a11y-no-invert', { 'aria-hidden': 'true' });
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '29000',
    background: 'rgba(0, 0, 0, 0.48)',
    pointerEvents: 'auto',
  });

  const shell = el('div', 'display-settings-panel display-settings-panel__shell incitta-a11y-panel a11y-no-invert', {
    id: 'incitta-a11y-panel',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': t('display.title'),
    hidden: '',
  });

  const body = el('div', 'display-settings-panel__body scroll-drag-only');
  const footer = el('footer', 'display-settings-panel__footer');
  shell.append(body, footer);

  shell.addEventListener('pointerdown', (e) => e.stopPropagation());
  shell.addEventListener('mousedown', (e) => e.stopPropagation());
  shell.addEventListener('click', (e) => e.stopPropagation());

  const destroyDragScroll = initPanelDragScroll(body);
  drawer.append(trigger, shell);
  applyCriticalDrawerStyles(drawer, shell);
  shell.hidden = true;
  backdrop.hidden = true;
  shell.style.display = 'none';
  backdrop.style.display = 'none';

  const ttsBlock = buildTtsSection(store);
  ttsBlock.sync();
  store.tts.subscribe(ttsBlock.sync);

  const mount = el('div', 'incitta-a11y-root');
  Object.assign(mount.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '29000',
    pointerEvents: 'none',
  });
  mount.append(backdrop, drawer);
  document.body.append(mount);

  const syncTrigger = () => {
    const label = open ? t('actions.close') : t('display.openButton');
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.setAttribute('aria-label', label);
    trigger.title = label;
    shell.setAttribute('aria-label', t('display.title'));
    drawer.classList.toggle('incitta-a11y-drawer--open', open);
    trigger.classList.toggle('incitta-a11y-trigger--active', open);
    trigger.classList.toggle('incitta-a11y-trigger--configured', store.isAnyEnabled);
    badge.hidden = !store.isAnyEnabled;
  };

  const refresh = () => {
    renderPanelBody(store, body, ttsBlock);
    renderPanelFooter(store, footer);
    ttsBlock.sync();
    syncTrigger();
    if (open) ensurePanelScrollLayout(body);
  };

  const setOpen = (next) => {
    open = next;
    openedAt = open ? performance.now() : 0;
    shell.hidden = !open;
    backdrop.hidden = !open;
    shell.style.display = open ? 'flex' : 'none';
    backdrop.style.display = open ? 'block' : 'none';
    document.body.classList.toggle('incitta-a11y-panel-open', open);
    syncTrigger();
    if (open) {
      refresh();
      ensurePanelScrollLayout(body);
      body.querySelector('button, select, input, [tabindex]')?.focus?.();
    } else {
      trigger.focus();
    }
  };

  trigger.addEventListener('click', () => setOpen(!open));
  backdrop.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    setOpen(false);
  });

  const onKeyDown = (e) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const onPointerDownOutside = (e) => {
    if (!open || performance.now() - openedAt < 80) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (drawer.contains(target)) return;
    setOpen(false);
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('pointerdown', onPointerDownOutside, true);

  const onNavMobileOpen = () => {
    if (open) setOpen(false);
  };
  document.addEventListener('incitta:nav-mobile-open', onNavMobileOpen);

  store.subscribe(() => {
    if (open) refresh();
    else syncTrigger();
  });
  syncTrigger();

  return {
    open: () => setOpen(true),
    close: () => setOpen(false),
    destroy() {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDownOutside, true);
      document.removeEventListener('incitta:nav-mobile-open', onNavMobileOpen);
      destroyDragScroll();
      unsubStore();
      mount.remove();
      document.body.classList.remove('incitta-a11y-panel-open');
    },
  };
}
