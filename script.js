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
