# CoinSafe — website

Landing page for **CoinSafe**, an AI money assistant that lives inside messaging apps.
Set a monthly budget, text your expenses to the bot, and get a daily summary with the
% of your budget already used. Launching on Telegram; WhatsApp, iMessage and Messenger
are coming soon.

Built with plain **HTML, CSS and JavaScript** — no frameworks, no build step.

## Structure

```
coinsafe-site/
├── index.html      # Home page (all sections)
├── privacy.html    # Privacy Policy (placeholder)
├── terms.html      # Terms of Service (placeholder)
├── styles.css      # Styles: design tokens, layout, dark mode, animations
├── script.js       # Mobile menu, waitlist form, footer year, scroll animations
├── images/
│   ├── logo.png      # Original logo (full size)
│   └── logo-256.png  # Smaller copy used on the site + favicon
└── assets/
    └── icons/        # Simple SVG icons
```

## Run locally

Open `index.html` in your browser, or start a small local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before launch — things to replace

- [ ] `https://t.me/SEU_BOT_AQUI` → your bot link (3 places in `index.html`, search for `SEU_BOT_AQUI`)
- [ ] `FORMSPREE_ENDPOINT` in `script.js` → your Formspree form URL
- [x] Contact email → `golden_group11@outlook.com` (`index.html`, `privacy.html`, `terms.html`)
- [ ] `privacy.html` and `terms.html` → real legal text (and the "Last updated" date)
- [ ] FAQ answers in `index.html` (pricing, data handling) → confirm they match how the product actually works

## Deploy

Hosted with GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
