/**
 * Signaux pour alléger le thread principal sur mobile / connexion lente.
 */
export function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

export function isNarrowViewport() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function shouldReduceHomeMotion() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    isCoarsePointer() ||
    isNarrowViewport()
  );
}

export function scheduleIdle(task, timeout = 2800) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => task(), { timeout });
  } else {
    window.setTimeout(task, 900);
  }
}
