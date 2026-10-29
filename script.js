/* =========================================================
   CoinSafe — script.js
   Plain JavaScript, no libraries. Each block below is
   independent and checks that its elements exist first,
   so this same file also works on privacy.html / terms.html.
   ========================================================= */


/* ---------------------------------------------------------
   1. Mobile menu (hamburger button)
   --------------------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  // One function opens/closes the menu and keeps the ARIA attributes in sync
  const setMenuOpen = (isOpen) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    siteNav.classList.toggle('is-open', isOpen);
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  // Close the menu after a link is clicked
  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  // Close with the Escape key and give focus back to the button
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });
}


/* ---------------------------------------------------------
   2. Waitlist ("Notify me" buttons + form)
   --------------------------------------------------------- */

/*
 * 👉 HOW TO SAVE EMAILS FOR REAL (Formspree):
 *   1. Create a free account at https://formspree.io
 *   2. Create a new form and copy its endpoint URL,
 *      e.g. "https://formspree.io/f/abcdwxyz"
 *   3. Paste it between the quotes below.
 *
 * While it's empty, the form runs in "demo mode": it validates
 * the email and shows the success message, but sends nothing.
 */
const FORMSPREE_ENDPOINT = '';

// Simple check: something@something.something (with no spaces)
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const dialog = document.getElementById('waitlist-dialog');
const form = document.getElementById('waitlist-form');

if (dialog && form) {
  const formView = dialog.querySelector('[data-waitlist-form-view]');
  const successView = dialog.querySelector('[data-waitlist-success]');
  const successEmail = dialog.querySelector('[data-success-email]');
  const emailInput = form.querySelector('#waitlist-email');
  const emailError = form.querySelector('#waitlist-email-error');
  const appsError = form.querySelector('#waitlist-apps-error');
  const formError = form.querySelector('[data-form-error]');
  const appCheckboxes = form.querySelectorAll('input[name="apps"]');
  const submitButton = form.querySelector('button[type="submit"]');

  let lastTrigger = null; // the button that opened the dialog

  // Put the dialog back to its initial state
  const resetWaitlist = () => {
    form.reset();
    emailInput.removeAttribute('aria-invalid');
    emailError.textContent = '';
    appsError.textContent = '';
    formError.textContent = '';
    formView.hidden = false;
    successView.hidden = true;
  };

  const openWaitlist = (app) => {
    resetWaitlist();
    // Pre-check the app whose button was clicked
    appCheckboxes.forEach((checkbox) => {
      checkbox.checked = checkbox.value === app;
    });
    lastTrigger = document.activeElement;
    dialog.showModal();
    emailInput.focus();
  };

  // Returns { isValid, email, apps } and shows error messages
  const validateForm = () => {
    const email = emailInput.value.trim();
    const apps = [...appCheckboxes].filter((cb) => cb.checked).map((cb) => cb.value);
    let isValid = true;

    if (email === '') {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!EMAIL_PATTERN.test(email)) {
      emailError.textContent = 'Please enter a valid email, like name@example.com.';
      isValid = false;
    } else {
      emailError.textContent = '';
    }
    if (emailError.textContent) {
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.removeAttribute('aria-invalid');
    }

    if (apps.length === 0) {
      appsError.textContent = 'Please choose at least one app.';
      isValid = false;
    } else {
      appsError.textContent = '';
    }

    return { isValid, email, apps };
  };

  // Sends the data to Formspree (or pretends to, in demo mode)
  const sendToWaitlist = async (email, apps) => {
    if (!FORMSPREE_ENDPOINT) {
      console.info('[CoinSafe] Demo mode — nothing was sent:', { email, apps });
      return new Promise((resolve) => setTimeout(resolve, 400));
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        email,
        apps: apps.join(', '),
        _subject: 'New CoinSafe waitlist signup',
      }),
    });

    if (!response.ok) {
      throw new Error(`Formspree responded with status ${response.status}`);
    }
  };

  const showSuccess = (email) => {
    successEmail.textContent = email;
    formView.hidden = true;
    successView.hidden = false;
    successView.focus(); // so screen readers announce the success message
  };

  // Every "Notify me" button opens the dialog
  document.querySelectorAll('[data-notify]').forEach((button) => {
    button.addEventListener('click', () => openWaitlist(button.dataset.notify));
  });

  // Close buttons (the "X" and "Done")
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  // Clicking the dark area outside the box also closes it
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // When the dialog closes (any way, including Esc), return focus
  dialog.addEventListener('close', () => {
    if (lastTrigger) lastTrigger.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // stop the browser from reloading the page

    const { isValid, email, apps } = validateForm();
    if (!isValid) {
      // Move focus to the first problem so the user knows what to fix
      (emailInput.hasAttribute('aria-invalid') ? emailInput : appCheckboxes[0]).focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    formError.textContent = '';

    try {
      await sendToWaitlist(email, apps);
      showSuccess(email);
    } catch (error) {
      console.error(error);
      formError.textContent = 'Something went wrong. Please try again in a moment.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Join the waitlist';
    }
  });
}


/* ---------------------------------------------------------
   3. Current year in the footer (no need to update it every January)
   --------------------------------------------------------- */
document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});


/* ---------------------------------------------------------
   4. Reveal-on-scroll animations
   IntersectionObserver tells us when an element enters the
   screen — much lighter than listening to every scroll event.
   --------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  // No animation: just show everything
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((element) => observer.observe(element));
}
