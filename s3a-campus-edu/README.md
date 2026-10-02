# S3A Campus EDU — Marketing Website

A responsive, lead-generation landing page for **S3A Campus EDU** (school / campus ERP).
Plain HTML + CSS + JS: no build step and no dependencies.

## Pages
White and orange theme. Every page shares the header, footer, WhatsApp button and demo popup.

| Page | What's on it |
|---|---|
| `index.html` | Home: hero with dashboard mock-up, stats, top modules, role tabs, apps, solutions, why S3A, testimonials |
| `modules.html` | All 24 modules with category filters, plus 4 detailed feature sections and the onboarding steps |
| `solutions.html` | K-12 schools, colleges, multi-branch groups and coaching centres, each with its own section |
| `mobile-apps.html` | Parent, Teacher, Student and Management apps, a phone mock-up and features parents love |
| `about.html` | Company story, mission / vision / values, why S3A, onboarding steps, testimonials |
| `contact.html` | Contact cards, demo request form, FAQ (the popup is turned off on this page) |

## Run locally
Open `index.html` in a browser, or run:

```bash
cd s3a-campus-edu && python3 -m http.server 8080
```

## Before going live — replace placeholders
| What | Where |
|---|---|
| Phone `+91 99999 99999`, email `info@s3acampusedu.com`, address | every `.html` file (topbar, footer, contact page; search `TODO`) |
| WhatsApp number `919999999999` | every `.html` file and `assets/js/main.js` (`CONFIG.whatsappNumber`) |
| Stats (250+ institutions, 1,50,000+ students, and so on) | `index.html` stats and `about.html` tiles; use your real numbers |
| Testimonials | `index.html`, `about.html`; these are **samples**, so replace them with real client quotes |
| Company story | `about.html` ("Who We Are") |
| Privacy Policy / Terms links | footer on every page |

Tip: to change a phone number or email on every page at once, use your editor's "find and replace in files".

## Receiving leads
`assets/js/main.js` → `CONFIG.formEndpoint`:

- **Empty (default):** a submitted form opens WhatsApp with the lead details prefilled.
- **Formspree:** `formEndpoint: "https://formspree.io/f/XXXX"`
- **Web3Forms:** `formEndpoint: "https://api.web3forms.com/submit"` plus `web3formsAccessKey`
- **Google Sheet:** deploy a Google Apps Script web app and paste its URL.

## Deploy
Any static host works: GitHub Pages, Netlify, Vercel, cPanel / Hostinger (upload the folder).
