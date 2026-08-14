/**
 * Intro théâtre : blanc + logo (scène), volets teal superposés ~1 s puis glissière.
 */
const CURTAIN_HOLD_MS = 1000;

export function initCurtainReveal() {
  const el = document.getElementById('curtain-reveal');
  if (!el) return;

  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  if (reduceMotion) {
    el.remove();
    return;
  }

  const doors = el.querySelectorAll('.curtain-reveal__door');
  if (!doors.length) {
    el.remove();
    return;
  }

  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';

  const cleanup = () => {
    document.documentElement.style.overflow = prevOverflow || '';
    el.remove();
  };

  const fallback = window.setTimeout(cleanup, CURTAIN_HOLD_MS + 2200);

  let doorsDone = 0;
  const onDoorTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    if (!e.target.classList?.contains('curtain-reveal__door')) return;
    doorsDone += 1;
    if (doorsDone < doors.length) return;
    window.clearTimeout(fallback);
    cleanup();
  };

  doors.forEach((door) => {
    door.addEventListener('transitionend', onDoorTransitionEnd);
  });

  window.setTimeout(() => {
    requestAnimationFrame(() => {
      el.classList.add('curtain-reveal--open');
    });
  }, CURTAIN_HOLD_MS);
}
