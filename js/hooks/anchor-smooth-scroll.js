/**
 * Ancres internes # — défilement fluide avec offset navbar.
 */

export function initAnchorSmoothScroll() {
  // If loaded with a hash in URL (e.g. index.html#expertises), jump directly to it immediately
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 85;
        window.scrollTo({ top: offsetTop, behavior: 'auto' });
      }, 10);
    }
  }

  // Intercept all links targeting in-page anchors on current page
  const isHomePage =
    document.body.classList.contains('home') ||
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html');

  document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const rawHref = this.getAttribute('href');
      if (!rawHref) return;

      const hashIndex = rawHref.indexOf('#');
      if (hashIndex === -1) return;
      const hash = rawHref.substring(hashIndex);
      if (!hash || hash === '#') return;

      const isInternal = rawHref.startsWith('#') || (isHomePage && rawHref.startsWith('index.html#'));
      if (isInternal) {
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 85;
        window.scrollTo({
          top: offsetTop,
          behavior: 'auto',
        });
        history.pushState(null, '', hash);
      }
    });
  });
}
