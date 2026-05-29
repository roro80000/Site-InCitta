/**
 * Rideau plein écran qui se soulève au chargement (accueil uniquement).
 * Respecte prefers-reduced-motion : pas d’animation, suppression immédiate.
 */
export function initCurtainReveal() {
  const el = document.getElementById('curtain-reveal');
  if (!el) return;

  /* Mobile : pas de rideau (LCP + TBT) — contenu visible tout de suite */
  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  if (reduceMotion) {
    el.remove();
    return;
  }

  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';

  const cleanup = () => {
    document.documentElement.style.overflow = prevOverflow || '';
    el.remove();
  };

  const fallback = window.setTimeout(cleanup, 2500);

  el.addEventListener(
    'transitionend',
    (e) => {
      if (e.propertyName !== 'transform') return;
      window.clearTimeout(fallback);
      cleanup();
    },
    { once: true }
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('curtain-reveal--open');
    });
  });
}
