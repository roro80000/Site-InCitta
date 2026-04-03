/**
 * Curseur personnalisé avec attraction magnétique, uniquement sur les cibles interactives.
 * Hors cible : curseur système (flèche). Pas d’anneau + point « cible » au repos.
 * Désactivé : pointeur grossier (touch), prefers-reduced-motion.
 */

/** Règles du plus spécifique au plus général — la première correspondance gagne */
const MAGNETIC_RULES = [
  { sel: '.hamburger', variant: 'compact' },
  { sel: '.nav-link', variant: 'nav' },
  { sel: '.nav-brand', variant: 'nav' },
  { sel: '.nav-logo a', variant: 'nav' },
  { sel: '.btn-primary-ic', variant: 'primary' },
  { sel: '.btn-primary', variant: 'primary' },
  { sel: '.rounded-cta', variant: 'cta' },
  { sel: '.btn-discover-platform', variant: 'accent' },
  { sel: '.btn-outline-ic', variant: 'accent' },
  { sel: '.btn-large', variant: 'accent' },
  { sel: '.page-back-btn', variant: 'cta' },
  { sel: '.feature-card', variant: 'feature' },
  { sel: '.btn', variant: 'btn' },
  { sel: 'input[type="submit"]', variant: 'control' },
  { sel: 'input[type="button"]', variant: 'control' },
  { sel: 'button:not(:disabled)', variant: 'control' },
  { sel: '[role="button"]', variant: 'control' },
  { sel: 'label[for]', variant: 'label' },
];

const PANEL_SELECTOR =
  '.service-block, .contact-block, .form-block, .value-item';

/**
 * pull : force d’attraction max
 * radius : distance (px) au-delà de laquelle l’effet s’atténue
 * ringEase / dotEase : fluidité du suivi
 */
const VARIANTS = {
  nav: { pull: 0.26, radius: 92, ringEase: 0.13, dotEase: 0.19 },
  primary: { pull: 0.34, radius: 118, ringEase: 0.09, dotEase: 0.13 },
  cta: { pull: 0.32, radius: 128, ringEase: 0.085, dotEase: 0.125 },
  accent: { pull: 0.22, radius: 96, ringEase: 0.11, dotEase: 0.16 },
  btn: { pull: 0.19, radius: 86, ringEase: 0.12, dotEase: 0.17 },
  control: { pull: 0.15, radius: 74, ringEase: 0.13, dotEase: 0.18 },
  label: { pull: 0.11, radius: 64, ringEase: 0.14, dotEase: 0.19 },
  compact: { pull: 0.17, radius: 58, ringEase: 0.15, dotEase: 0.2 },
  panel: { pull: 0.09, radius: 155, ringEase: 0.075, dotEase: 0.11 },
  /** Cartes fonctionnalités (InConcertta) : attraction type « panneau » + zoom léger activé */
  feature: { pull: 0.1, radius: 152, ringEase: 0.07, dotEase: 0.1 },
  default: { pull: 0.18, radius: 95, ringEase: 0.12, dotEase: 0.17 },
};

function variantParams(key) {
  return VARIANTS[key] || VARIANTS.default;
}

function findMagnetic(startEl) {
  if (!startEl || startEl.nodeType !== 1) return null;
  if (startEl.closest('.magnetic-cursor')) return null;
  if (startEl.closest('#curtain-reveal')) return null;

  for (const { sel, variant } of MAGNETIC_RULES) {
    const hit = startEl.closest(sel);
    if (hit && !hit.closest('#curtain-reveal')) {
      return { el: hit, variant };
    }
  }

  const panel = startEl.closest(PANEL_SELECTOR);
  if (
    panel &&
    !panel.closest('#curtain-reveal') &&
    !panel.closest('.footer')
  ) {
    return { el: panel, variant: 'panel' };
  }

  return null;
}

export function initMagneticCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.createElement('div');
  root.className = 'magnetic-cursor';
  root.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div');
  ring.className = 'magnetic-cursor__ring';
  const dot = document.createElement('div');
  dot.className = 'magnetic-cursor__dot';
  root.append(ring, dot);
  document.body.appendChild(root);
  document.body.classList.add('is-magnetic-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let dotX = mouseX;
  let dotY = mouseY;
  let magneticState = null;
  let raf = 0;
  let visible = false;
  let isDown = false;
  let zoomEl = null;

  const easeIdle = { ring: 0.12, dot: 0.17 };

  function clearMagneticZoom() {
    if (zoomEl) {
      zoomEl.classList.remove('magnetic-zoom-target');
      zoomEl = null;
    }
  }

  /** Zoom discret sur la cible (sauf grandes cartes « panel ») — échelle dans styles.css */
  function setMagneticZoom(el) {
    if (zoomEl === el) return;
    clearMagneticZoom();
    if (el) {
      zoomEl = el;
      zoomEl.classList.add('magnetic-zoom-target');
    }
  }

  function magneticTarget(mx, my) {
    if (!magneticState?.el) return { x: mx, y: my };
    const params = variantParams(magneticState.variant);
    const r = magneticState.el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = cx - mx;
    const dy = cy - my;
    const dist = Math.hypot(dx, dy);
    const falloff =
      dist >= params.radius ? 0 : 1 - dist / params.radius;
    const pull = params.pull * falloff;
    return {
      x: mx + dx * pull,
      y: my + dy * pull,
    };
  }

  function tick() {
    const p = magneticState ? variantParams(magneticState.variant) : null;
    const ringEase = p ? p.ringEase : easeIdle.ring;
    const dotEase = p ? p.dotEase : easeIdle.dot;

    const t = magneticTarget(mouseX, mouseY);
    ringX += (t.x - ringX) * ringEase;
    ringY += (t.y - ringY) * ringEase;
    dotX += (t.x - dotX) * dotEase;
    dotY += (t.y - dotY) * dotEase;

    const dotScale = isDown ? 0.58 : 1;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;

    raf = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const next = findMagnetic(el);
      magneticState = next;

      if (next) {
        if (!visible) {
          visible = true;
          root.classList.add('is-visible');
        }
        root.classList.add('is-near');
        document.body.classList.add('is-magnetic-cursor--near');
        root.setAttribute('data-magnetic', next.variant);
        if (next.variant !== 'panel') {
          setMagneticZoom(next.el);
        } else {
          clearMagneticZoom();
        }
      } else {
        clearMagneticZoom();
        root.classList.remove('is-near', 'is-visible');
        document.body.classList.remove('is-magnetic-cursor--near');
        root.removeAttribute('data-magnetic');
        visible = false;
      }
    },
    { passive: true }
  );

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    isDown = true;
  });
  document.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') return;
    isDown = false;
  });

  window.addEventListener(
    'mouseout',
    (e) => {
      if (!e.relatedTarget && e.clientY <= 0) {
        clearMagneticZoom();
        root.classList.remove('is-visible', 'is-near');
        document.body.classList.remove('is-magnetic-cursor--near');
        root.removeAttribute('data-magnetic');
        visible = false;
        magneticState = null;
      }
    },
    { passive: true }
  );

  window.addEventListener('blur', () => {
    isDown = false;
    clearMagneticZoom();
    root.classList.remove('is-visible', 'is-near');
    document.body.classList.remove('is-magnetic-cursor--near');
    root.removeAttribute('data-magnetic');
    visible = false;
    magneticState = null;
  });

  startLoop();
}
