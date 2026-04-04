/**
 * Page InConcertta : GSAP (stagger entrée). Le défilement Lenis + ScrollTrigger est global (lenis-scroll.js).
 */

const STAGGER_DEFAULT_SELECTOR = [
  '.admin-screens-grid > li',
  '.city-guide-bento .feature-card',
].join(', ');

const GSAP_URL = 'https://esm.sh/gsap@3.12.5';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function runStagger(gsap, options = {}) {
  const root = options.root || document;
  const selector = options.selector || STAGGER_DEFAULT_SELECTOR;
  const items = root.querySelectorAll(selector);
  if (!items.length) {
    document.documentElement.classList.remove('ic-stagger-prime');
    return;
  }

  gsap.set(items, { opacity: 0, y: 20 });
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: 'power2.out',
    stagger: 0.08,
    onComplete: () => {
      gsap.set(items, { clearProps: 'opacity,transform' });
      document.documentElement.classList.remove('ic-stagger-prime');
    },
  });
}

export async function initInconcerttaMotion() {
  if (prefersReducedMotion()) return;

  let gsap;
  try {
    const gMod = await import(GSAP_URL);
    gsap = gMod.default;
  } catch {
    document.documentElement.classList.remove('ic-stagger-prime');
    return;
  }

  runStagger(gsap, {});

  window.addEventListener(
    'inconcertta-stagger',
    (e) => {
      const d = e.detail || {};
      runStagger(gsap, {
        root: d.root || document,
        selector: d.selector || STAGGER_DEFAULT_SELECTOR,
      });
    },
    { passive: true }
  );

  window.__inconcerttaStaggerReady = true;
  window.dispatchEvent(new CustomEvent('inconcertta-motion-ready'));
}
