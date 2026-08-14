/**
 * Confort formulaires (mobile) + validation basique required.
 */

import { isMobile } from '../utils/device.js';

export function initFormInputs() {
  document.querySelectorAll('input, textarea, select').forEach((input) => {
    if (isMobile) {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    }

    input.addEventListener('blur', () => {
      if (!input.hasAttribute('required')) return;

      const invalid = input.type === 'checkbox'
        ? !input.checked
        : !input.value.trim();

      if (invalid) {
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    input.addEventListener('input', () => {
      input.classList.remove('error');
    });

    if (input.type === 'checkbox') {
      input.addEventListener('change', () => {
        input.classList.remove('error');
      });
    }
  });
}
