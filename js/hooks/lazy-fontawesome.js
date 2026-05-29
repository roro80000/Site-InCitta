/**
 * Chargement lazy de Font Awesome uniquement si la section FAQ est visible.
 */
export function initLazyFontAwesome() {
  const faqSection = document.querySelector('.faq-section');
  if (!faqSection || !('IntersectionObserver' in window)) {
    // Aucune FAQ : ne pas charger Font Awesome
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadFontAwesome();
        io.disconnect();
      }
    },
    { rootMargin: '150px' }
  );
  io.observe(faqSection);
}

function loadFontAwesome() {
  // Vérifier si déjà chargé
  if (document.querySelector('link[href*="font-awesome"]')) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
  link.integrity =
    'sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  document.head.appendChild(link);
}
