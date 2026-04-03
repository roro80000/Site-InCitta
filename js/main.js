/**
 * Point d’entrée du site InCitta (statique, autonome).
 * Pas de lien avec le build React du dépôt parent.
 *
 * Accueil : rideau plein écran qui se soulève (voir curtain-reveal.js). Autres pages :
 * pas d’écran de chargement. Ce fichier initialise les hooks au DOMContentLoaded.
 */

import { initNavbarScroll } from './hooks/navbar-scroll.js';
import { initMobileEnv } from './hooks/mobile-env.js';
import { initNavMobile } from './hooks/nav-mobile.js';
import { initAnchorSmoothScroll } from './hooks/anchor-smooth-scroll.js';
import { initFormInputs } from './hooks/form-inputs.js';
import { initLazyImages } from './hooks/lazy-images.js';
import { initHeroParallax } from './hooks/hero-parallax.js';
import { initRevealOnScroll } from './hooks/reveal-on-scroll.js';
import { initInconcerttaDemo } from './pages/inconcertta-demo.js';
import { initGoatCounter } from './goatcounter.js';
import { initCurtainReveal } from './hooks/curtain-reveal.js';
import { initMotflecheDistortion } from './hooks/motfleche-distortion.js';
import { initMagneticCursor } from './hooks/magnetic-cursor.js';

initGoatCounter();
if (document.body.classList.contains('home')) {
  initCurtainReveal();
}
initNavbarScroll();
initMobileEnv();

function boot() {
  initMagneticCursor();
  initNavMobile();
  initAnchorSmoothScroll();
  initFormInputs();
  initLazyImages();
  initHeroParallax();
  initRevealOnScroll();
  initInconcerttaDemo();
  initMotflecheDistortion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
