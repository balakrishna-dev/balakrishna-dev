# S3A Campus EDU — Marketing Website

A responsive, lead-generation landing page for **S3A Campus EDU** (school / campus ERP).
Plain HTML + CSS + JS: no build step and no dependencies.

## Sections
Hero with a dashboard mockup · Stats counters · 16 ERP modules · Role tabs (Management / Teachers / Parents / Students) · Mobile apps · Solutions · Why S3A · 4-step onboarding · Pricing plans · Testimonials · FAQ · Demo request form · Footer · Floating WhatsApp button · Timed and exit-intent demo popup

## Run locally
Open `index.html` in a browser, or run:

```bash
cd s3a-campus-edu && python3 -m http.server 8080
```

## Before going live — replace placeholders
| What | Where |
|---|---|
| Phone `+91 99999 99999`, email `info@s3acampusedu.com`, address | `index.html` (search `TODO`) |
| WhatsApp number `919999999999` | `index.html` (`wa-float`) and `assets/js/main.js` (`CONFIG.whatsappNumber`) |
| Stats (250+ institutions, 1,50,000+ students, and so on) | `index.html`, stats section; use your real numbers |
| Testimonials | `index.html`; these are **samples**, so replace them with real client quotes |
| Privacy Policy / Terms links | footer in `index.html` |

## Receiving leads
`assets/js/main.js` → `CONFIG.formEndpoint`:

- **Empty (default):** a submitted form opens WhatsApp with the lead details prefilled.
- **Formspree:** `formEndpoint: "https://formspree.io/f/XXXX"`
- **Web3Forms:** `formEndpoint: "https://api.web3forms.com/submit"` plus `web3formsAccessKey`
- **Google Sheet:** deploy a Google Apps Script web app and paste its URL.

## Deploy
Any static host works: GitHub Pages, Netlify, Vercel, cPanel / Hostinger (upload the folder).
