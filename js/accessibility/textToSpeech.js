import {
  DEFAULT_VOICE_PROFILE,
  detectVoiceProfile,
  normalizeVoiceProfile,
  resolveVoiceForProfile,
} from './ttsVoiceProfiles.js';

const STORAGE_KEY = 'inconcerta_tts_prefs';

export const ALLOWED_TTS_RATES = [0.5, 0.75, 0.95, 1.2];

const DEFAULT_PREFS = {
  rate: 0.95,
  pitch: 1.0,
  volume: 1.0,
  voiceProfile: DEFAULT_VOICE_PROFILE,
  voiceURI: null,
  lang: 'fr-FR',
};

function normalizeRate(rate) {
  const n = Number(rate);
  if (!Number.isFinite(n)) return DEFAULT_PREFS.rate;
  if (ALLOWED_TTS_RATES.includes(n)) return n;
  if (n > 1.2) return 1.2;
  return ALLOWED_TTS_RATES.reduce((best, allowed) =>
    Math.abs(allowed - n) < Math.abs(best - n) ? allowed : best,
  ALLOWED_TTS_RATES[0]);
}

function loadPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_PREFS,
        ...parsed,
        rate: normalizeRate(parsed.rate),
        voiceProfile: normalizeVoiceProfile(parsed.voiceProfile),
      };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_PREFS };
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch { /* ignore */ }
}

function resolveProfileFromPrefs(voices, prefs) {
  if (prefs.voiceURI) {
    const saved = voices.find((v) => v.voiceURI === prefs.voiceURI);
    const detected = saved ? detectVoiceProfile(saved) : null;
    if (saved && detected) {
      return { profile: detected, voice: saved };
    }
  }

  const profile = normalizeVoiceProfile(prefs.voiceProfile);
  return {
    profile,
    voice: resolveVoiceForProfile(voices, profile),
  };
}

function sanitizeForSpeech(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,;:!?'"()\-àâäéèêëîïôùûüÿçæœÀÂÄÉÈÊËÎÏÔÙÛÜŸÇÆŒ]/g, ' ')
    .trim()
    .slice(0, 5000);
}

export function createTextToSpeech() {
  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  let status = 'idle';
  let voices = [];
  let selectedVoice = null;
  let preferences = loadPrefs();
  let currentText = '';
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn());

  const setStatus = (next) => {
    status = next;
    notify();
  };

  const setCurrentText = (next) => {
    currentText = next;
    notify();
  };

  const loadVoices = () => {
    if (!isSupported) return;
    const available = window.speechSynthesis.getVoices();
    if (!available.length) return;
    voices = available;
    const { voice } = resolveProfileFromPrefs(available, preferences);
    selectedVoice = voice;
    preferences = {
      ...preferences,
      voiceProfile: normalizeVoiceProfile(preferences.voiceProfile),
      voiceURI: voice?.voiceURI ?? null,
    };
    savePrefs(preferences);
    notify();
  };

  if (isSupported) {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  const speakText = (rawText) => {
    if (!isSupported) return;

    const text = sanitizeForSpeech(rawText);
    if (!text) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = preferences.rate;
    utterance.pitch = preferences.pitch;
    utterance.volume = preferences.volume;
    utterance.lang = preferences.lang;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setStatus('speaking');
      setCurrentText(text);
    };
    utterance.onend = () => {
      setStatus('idle');
      setCurrentText('');
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        setStatus('error');
      } else {
        setStatus('idle');
      }
      setCurrentText('');
    };
    utterance.onpause = () => setStatus('paused');
    utterance.onresume = () => setStatus('speaking');

    synth.speak(utterance);
  };

  return {
    get status() { return status; },
    get isSupported() { return isSupported; },
    get voices() { return voices; },
    get selectedVoice() { return selectedVoice; },
    get voiceProfile() { return normalizeVoiceProfile(preferences.voiceProfile); },
    get preferences() { return preferences; },
    get currentText() { return currentText; },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    speakSelection() {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? '';
      if (text) {
        speakText(text);
        return;
      }
      const main =
        document.querySelector('main')
        || document.querySelector("[role='main']")
        || document.querySelector('.navbar + *')
        || document.body;
      speakText(main?.innerText ?? '');
    },
    speak(text) {
      speakText(text);
    },
    togglePause() {
      if (!isSupported) return;
      const synth = window.speechSynthesis;
      if (synth.speaking && !synth.paused) synth.pause();
      else if (synth.paused) synth.resume();
    },
    stop() {
      if (!isSupported) return;
      window.speechSynthesis.cancel();
      setStatus('idle');
      setCurrentText('');
    },
    setVoiceProfile(profile) {
      const normalized = normalizeVoiceProfile(profile);
      const voice = resolveVoiceForProfile(voices, normalized);
      selectedVoice = voice;
      preferences = {
        ...preferences,
        voiceProfile: normalized,
        voiceURI: voice?.voiceURI ?? null,
      };
      savePrefs(preferences);
      notify();
    },
    setRate(rate) {
      const clamped = normalizeRate(rate);
      preferences = { ...preferences, rate: clamped };
      savePrefs(preferences);
      notify();
    },
    destroy() {
      if (isSupported) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        window.speechSynthesis.cancel();
      }
      listeners.clear();
    },
  };
}
