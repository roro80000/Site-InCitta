/**
 * Défilement par glisser dans le volet accessibilité (souris + tactile).
 */

const INTERACTIVE_SELECTOR =
  'input, textarea, select, button, a, label, [role="button"], [role="switch"], [role="radio"], [contenteditable="true"]';

/**
 * Force le corps du volet à occuper l'espace restant et à défiler.
 * @param {HTMLElement} body
 */
export function ensurePanelScrollLayout(body) {
  if (!body) return;
  Object.assign(body.style, {
    flex: '1 1 auto',
    height: '0',
    minHeight: '0',
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    touchAction: 'pan-y',
  });
}

/**
 * @param {HTMLElement} container
 * @param {{
 *   enabled?: boolean;
 *   sensitivity?: number;
 *   dragThresholdPx?: number;
 * }} [options]
 * @returns {() => void}
 */
export function initPanelDragScroll(container, options = {}) {
  if (!container) return () => {};

  const {
    enabled = true,
    sensitivity = 1.15,
    dragThresholdPx = 6,
  } = options;

  if (!enabled) return () => {};

  let pending = false;
  let dragging = false;
  let startPageY = 0;
  let originScrollTop = 0;
  let activePointerId = null;

  const canStartDrag = (target) => {
    if (!(target instanceof Element)) return false;
    if (!container.contains(target)) return false;
    return !target.closest(INTERACTIVE_SELECTOR);
  };

  const endDrag = () => {
    pending = false;
    dragging = false;
    if (activePointerId != null) {
      try {
        container.releasePointerCapture(activePointerId);
      } catch {
        /* ignore */
      }
    }
    activePointerId = null;
    container.classList.remove('display-settings-panel__body--dragging');
    container.style.userSelect = '';
    container.style.touchAction = 'pan-y';
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', onWindowPointerEnd);
    window.removeEventListener('pointercancel', onWindowPointerEnd);
  };

  const onWindowPointerMove = (e) => {
    if (!pending && !dragging) return;
    if (activePointerId != null && e.pointerId !== activePointerId) return;

    if (pending && !dragging) {
      const dy = e.pageY - startPageY;
      if (Math.abs(dy) < dragThresholdPx) return;

      dragging = true;
      pending = false;
      container.classList.add('display-settings-panel__body--dragging');
      container.style.userSelect = 'none';
      container.style.touchAction = 'none';
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    if (!dragging) return;

    container.scrollTop = originScrollTop - (e.pageY - startPageY) * sensitivity;
    e.preventDefault();
  };

  const onWindowPointerEnd = (e) => {
    if (activePointerId != null && e.pointerId !== activePointerId) return;
    endDrag();
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!canStartDrag(e.target)) return;

    pending = true;
    dragging = false;
    activePointerId = e.pointerId;
    startPageY = e.pageY;
    originScrollTop = container.scrollTop;

    window.addEventListener('pointermove', onWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', onWindowPointerEnd);
    window.addEventListener('pointercancel', onWindowPointerEnd);
  };

  const onWheel = (e) => {
    if (!container.contains(e.target)) return;
    if (container.scrollHeight <= container.clientHeight) return;
    e.stopPropagation();
  };

  ensurePanelScrollLayout(container);
  container.classList.add('display-settings-panel__body--drag-scroll');
  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('wheel', onWheel, { passive: true });

  return () => {
    container.removeEventListener('pointerdown', onPointerDown);
    container.removeEventListener('wheel', onWheel);
    endDrag();
    container.classList.remove('display-settings-panel__body--drag-scroll');
  };
}
