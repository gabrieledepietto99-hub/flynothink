# FlyNoThink · landing R4.1

Landing statica (HTML, CSS, JS, nessun framework) del percorso FNT per portieri.

- `public/` — il sito pubblicato (questa è l'unica cartella servita).
- `scripts/check-publish.mjs` — controllo di pubblicazione. Su Vercel gira a ogni deploy:
  - **produzione** (ramo `main`): il deploy **fallisce** finché mancano MailerLite, URL iubenda, dati del titolare, età minima e diritti della foto del referente;
  - **anteprima** (altri rami): il deploy riesce e la lista dei dati mancanti compare nel log.
- `docs/R4.1_REPORT.md` — revisione finale, QA e integrazioni rimanenti.
- `deploy-altri-hosting/` — intestazioni equivalenti per Netlify, Cloudflare Pages e Apache (non servono su Vercel).

Le configurazioni da completare sono in `public/assets/js/config.js` (MailerLite, età minima) e `public/assets/js/site-config.js` (URL legali, tracciamento spento).
