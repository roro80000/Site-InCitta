/**
 * Fondu de l’image hero accueil quand moins de 50 % visible (évite script inline).
 */
export function initHeroHomeFade() {
  const img = document.querySelector('.hero .hero-full-image');
  if (!img || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      const ratio = entries[0].intersectionRatio;
      img.classList.toggle('half-faded', ratio < 0.5);
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  io.observe(img);
}
