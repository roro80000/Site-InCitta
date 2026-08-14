/**
 * Menu burger, fermeture (lien, extérieur, resize, swipe, Échap).
 */

let hamburger = null;
let navMenu = null;
let touchStartY = 0;
let touchEndY = 0;

const MOBILE_NAV_MAX_WIDTH = 768;

function isMobileNavViewport() {
  return window.innerWidth <= MOBILE_NAV_MAX_WIDTH;
}

function setMobileNavOpen(open) {
  if (!hamburger || !navMenu) return;

  hamburger.classList.toggle('active', open);
  navMenu.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : 'auto';
  document.body.classList.toggle('nav-mobile-open', open && isMobileNavViewport());

  if (open) {
    document.dispatchEvent(new CustomEvent('incitta:nav-mobile-open'));
  }
}

function closeMobileNav() {
  setMobileNavOpen(false);
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  if (
    diff > swipeThreshold &&
    navMenu &&
    hamburger &&
    navMenu.classList.contains('active')
  ) {
    closeMobileNav();
  }
}

export function initNavMobile() {
  hamburger = document.querySelector('.hamburger');
  navMenu = document.querySelector('.nav-menu');

  if (!hamburger || !navMenu) {
    return;
  }

  hamburger.addEventListener('click', () => {
    setMobileNavOpen(!navMenu.classList.contains('active'));
  });

  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      hamburger.click();
    }
  });

  document.querySelectorAll('.nav-link').forEach((n, index) => {
    n.addEventListener('click', closeMobileNav);
    n.style.setProperty('--i', index);
  });

  document.addEventListener('click', (e) => {
    if (
      hamburger &&
      navMenu &&
      !hamburger.contains(e.target) &&
      !navMenu.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (hamburger && navMenu && window.innerWidth > MOBILE_NAV_MAX_WIDTH) {
      closeMobileNav();
    } else if (!navMenu.classList.contains('active')) {
      document.body.classList.remove('nav-mobile-open');
    }
  });

  document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  });

  document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (navMenu && hamburger && navMenu.classList.contains('active')) {
      closeMobileNav();
    }
  });
}
