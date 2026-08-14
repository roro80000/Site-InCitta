/** Lien LinkedIn InCitta — injecté dans le pied de page de chaque page. */

export const LINKEDIN_COMPANY_URL =
  'https://fr.linkedin.com/company/incitta80';

const LINKEDIN_ICON_SRC = 'assets/Logo/LinkedIn_iconblue.webp';

export function injectFooterLinkedIn() {
  document.querySelectorAll('.footer--site').forEach((footer) => {
    if (footer.querySelector('.footer-linkedin')) return;

    const link = document.createElement('a');
    link.className = 'footer-linkedin';
    link.href = LINKEDIN_COMPANY_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'InCitta sur LinkedIn (nouvel onglet)');

    const img = document.createElement('img');
    img.src = LINKEDIN_ICON_SRC;
    img.alt = '';
    img.width = 48;
    img.height = 48;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.className = 'footer-linkedin__icon';
    link.appendChild(img);

    footer.appendChild(link);
  });
}
