/**
 * Point d’entrée du site InCitta (statique, autonome).
 * Pas de lien avec le build React du dépôt parent.
 *
 * Accueil : portes coulissantes gauche / droite (voir curtain-reveal.js). Autres pages :
 * pas d’écran de chargement. Ce fichier initialise les hooks au DOMContentLoaded.
 */

import { initNavbarScroll } from './hooks/navbar-scroll.js';
import { initMobileEnv } from './hooks/mobile-env.js';
import { initNavMobile } from './hooks/nav-mobile.js';
import { initAnchorSmoothScroll } from './hooks/anchor-smooth-scroll.js';
import { initLenisScroll } from './hooks/lenis-scroll.js';
import { initFormInputs } from './hooks/form-inputs.js';
import { initContactForm } from './hooks/contact-form.js';
import { initLazyImages } from './hooks/lazy-images.js';
import { initHeroParallax } from './hooks/hero-parallax.js';
import { initRevealOnScroll } from './hooks/reveal-on-scroll.js';
import { initInconcerttaEmbed } from './pages/inconcertta-embed.js';
import { initCurtainReveal } from './hooks/curtain-reveal.js';
import { initMotflecheDistortion } from './hooks/motfleche-distortion.js';
import { initMagneticCursor } from './hooks/magnetic-cursor.js';
import { initCityExploreMap } from './hooks/city-explore-map.js';
import { initLazyFontAwesome } from './hooks/lazy-fontawesome.js';
import { initHeroHomeFade } from './hooks/hero-home-fade.js';
import { initAccessibility } from './accessibility/init-a11y.js';
import { initSiteI18n } from './i18n/init-site-i18n.js';
import { isCoarsePointer, scheduleIdle } from './utils/mobile-perf.js';
import { initCookieBanner } from './cookie-banner.js';
import './seo/init-seo.js';

initCookieBanner();
initAccessibility();

// initCurtainReveal removed
initNavbarScroll();
initMobileEnv();

async function boot() {
  initNavMobile();
  initSiteI18n();
  initAnchorSmoothScroll();

  if (document.body.classList.contains('home')) {
    initHeroHomeFade();
  }

  initFormInputs();
  initContactForm();
  initLazyImages();
  initHeroParallax();
  initCityExploreMap();

  /* Effets non essentiels : après idle (mobile) ou court délai (desktop) */
  const runEnhancements = () => {
    initRevealOnScroll();
    initLazyFontAwesome();
    /* if (!isCoarsePointer()) {
      initMagneticCursor();
    } */
    if (
      document.querySelector('[data-motfleche-distortion]') &&
      !isCoarsePointer()
    ) {
      initMotflecheDistortion();
    }
  };
  scheduleIdle(runEnhancements, isCoarsePointer() ? 3500 : 2200);

  scheduleIdle(async () => {
    try {
      await initLenisScroll();
    } catch {
      /* ancrage léger déjà actif */
    }
  }, 2800);
  if (document.body.classList.contains('page-inconcertta')) {
    initInconcerttaEmbed();
    import('./pages/inconcertta-motion.js').then((m) => m.initInconcerttaMotion());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
