/**
 * Lenis + GSAP ScrollTrigger — défilement très fluide, synchronisé pour les futures animations.
 * Ancres internes : scroll via Lenis (offset navbar), sans conflit avec l’ancien smooth scroll natif.
 */

const ANCHOR_OFFSET = 80;

const GSAP_URL = 'https://esm.sh/gsap@3.12.5';
const SCROLL_TRIGGER_URL = 'https://esm.sh/gsap@3.12.5/ScrollTrigger';
const LENIS_URL = 'https://esm.sh/lenis@1.1.18';

const ANCHOR_EASING = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function bindAnchorClicks(lenis) {
  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      let id;
      try {
        id = decodeURIComponent(href.substring(hashIndex + 1));
      } catch {
        id = href.substring(hashIndex + 1);
      }
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, {
        offset: -ANCHOR_OFFSET,
        immediate: true,
      });
      history.pushState(null, '', '#' + id);
    });
  });
}

function scrollToHash(lenis) {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return;
  let id;
  try {
    id = decodeURIComponent(raw);
  } catch {
    id = raw;
  }
  const target = document.getElementById(id);
  if (!target) return;
  lenis.scrollTo(target, {
    offset: -ANCHOR_OFFSET,
    immediate: true,
  });
}

/**
 * @returns {Promise<boolean>} true si Lenis est actif (false = fallback ancrages natifs)
 */
export async function initLenisScroll() {
  if (prefersReducedMotion()) return false;
  if (window.__lenis) return true;

  let gsap;
  let ScrollTrigger;
  let LenisCtor;
  try {
    const [gMod, stMod, lMod] = await Promise.all([
      import(GSAP_URL),
      import(SCROLL_TRIGGER_URL),
      import(LENIS_URL),
    ]);
    gsap = gMod.default;
    ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
    LenisCtor = lMod.default;
  } catch {
    return false;
  }

  if (!ScrollTrigger || !LenisCtor) return false;

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new LenisCtor({
    smoothWheel: false,
    lerp: 0.1,
    wheelMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener('hashchange', () => scrollToHash(lenis), { passive: true });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });

  const syncLayoutAndHash = () => {
    ScrollTrigger.refresh();
    scrollToHash(lenis);
  };
  if (document.readyState === 'complete') {
    requestAnimationFrame(syncLayoutAndHash);
  } else {
    window.addEventListener('load', syncLayoutAndHash, { once: true });
  }

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
    },
    { passive: true }
  );

  window.__lenis = lenis;
  window.dispatchEvent(new CustomEvent('lenis-ready', { detail: { lenis } }));

  return true;
}
