import { tSite } from '../i18n/site-i18n.js';

const ORIGIN = 'https://inconcertta.fr';
const PROJECT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}(?:-[0-9a-f]{12})?$/i;

function buildEmbedSrc(projectId) {
  const params = new URLSearchParams({ ref: 'embed' });
  const from = window.location.hostname || '';
  if (from) params.set('from', from);
  // Route /embed/p/* : headers frame-ancestors (incitta.eu). /p/*/play refuse l’iframe (X-Frame-Options: DENY).
  return `${ORIGIN}/embed/p/${projectId}/play?${params}`;
}

function updateExpandButton(expandBtn, expanded) {
  if (!expandBtn) return;
  expandBtn.setAttribute('aria-pressed', expanded ? 'true' : 'false');
  expandBtn.textContent = tSite(expanded ? 'inconcertta.demo.closeShort' : 'inconcertta.demo.expandShort')
    ?? (expanded ? 'Fermer' : 'Agrandir');
  const aria = tSite(expanded ? 'inconcertta.demo.close' : 'inconcertta.demo.expand');
  if (aria) expandBtn.setAttribute('aria-label', aria);
}

/** Iframe InConcertta inline dans .demo-frame (section #demo-inconcertta). */
export function initInconcerttaEmbed() {
  const host = document.getElementById('inconcertta-live-embed');
  const iframe = host?.querySelector('iframe');
  const expandBtn = document.getElementById('inconcertta-embed-expand');
  if (!host || !iframe || !expandBtn) return;

  const projectId = (host.dataset.project || '').trim();
  if (!PROJECT_ID_RE.test(projectId)) return;

  let embedAnchor = null;

  const load = () => {
    if (iframe.dataset.embedLoaded) return;
    iframe.dataset.embedLoaded = '1';
    iframe.src = buildEmbedSrc(projectId);
  };

  const setExpanded = (expanded) => {
    if (expanded) {
      if (!embedAnchor) {
        embedAnchor = document.createComment('inconcertta-embed-anchor');
        host.parentNode.insertBefore(embedAnchor, host);
      }
      document.body.appendChild(host);
      host.classList.add('is-fullscreen');
      document.body.classList.add('demo-embed-fullscreen');
      document.documentElement.classList.add('demo-embed-fullscreen');
      window.__lenis?.stop();
    } else {
      host.classList.remove('is-fullscreen');
      if (embedAnchor?.parentNode) {
        embedAnchor.parentNode.insertBefore(host, embedAnchor.nextSibling);
      }
      document.body.classList.remove('demo-embed-fullscreen');
      document.documentElement.classList.remove('demo-embed-fullscreen');
      window.__lenis?.start();
    }
    updateExpandButton(expandBtn, expanded);
  };

  expandBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (host.classList.contains('is-fullscreen')) {
      setExpanded(false);
      return;
    }
    load();
    setExpanded(true);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && host.classList.contains('is-fullscreen')) {
      e.preventDefault();
      setExpanded(false);
    }
  });

  const loadTriggers = new Set(['#demo-inconcertta', '#demo-live']);

  const shouldLoad = () => loadTriggers.has(window.location.hash);

  if (shouldLoad()) load();

  window.addEventListener('hashchange', () => {
    if (shouldLoad()) load();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(host);
    return;
  }

  load();
}
