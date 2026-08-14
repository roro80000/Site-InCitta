/**
 * Formulaire contact — état du bouton d’envoi (opacité + blocage).
 */

function isContactFormComplete(form) {
  const firstName = form.querySelector('#firstName')?.value.trim();
  const lastName = form.querySelector('#lastName')?.value.trim();
  const emailEl = form.querySelector('#email');
  const email = emailEl?.value.trim();
  const subject = form.querySelector('#subject')?.value.trim();
  const message = form.querySelector('#message')?.value.trim();
  const consent = form.querySelector('#privacyConsent')?.checked;

  return Boolean(
    firstName
    && lastName
    && email
    && emailEl?.validity.valid
    && subject
    && message
    && consent,
  );
}

function updateContactSubmitState(form, submitBtn) {
  const complete = isContactFormComplete(form);
  submitBtn.classList.toggle('is-incomplete', !complete);
  submitBtn.disabled = !complete;
  submitBtn.setAttribute('aria-disabled', complete ? 'false' : 'true');
}

export function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  const sync = () => updateContactSubmitState(form, submitBtn);
  sync();

  form.addEventListener('input', sync);
  form.addEventListener('change', sync);

  form.addEventListener('submit', (e) => {
    if (!isContactFormComplete(form)) {
      e.preventDefault();
      sync();
    }
  });
}
