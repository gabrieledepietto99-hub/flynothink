/*
 * FlyNoThink — configurazione centralizzata di ambiente, documenti legali, consensi e tracciamento.
 *
 * REGOLE
 * - Non inserire valori inventati o «di prova». Un campo vuoto (null) significa «non configurato».
 * - Con tracking.enabled = false (default) NON viene caricato nessuno script esterno:
 *   né iubenda, né Google Tag Manager, né Clarity, né Meta Pixel.
 * - Clarity e Meta Pixel NON si configurano qui: sono tag dentro il container GTM e partono
 *   solo dopo il consenso (vedi docs/staging/ID_TRACCIAMENTO.md). Gli ID sono qui solo come
 *   registro, per i controlli automatici e per la documentazione.
 * - In staging il tracciamento resta spento anche se configurato, a meno di
 *   tracking.allowOnStaging = true (da usare solo per i test dei consensi).
 */
window.FNT_SITE = Object.freeze({
  env: 'production',                      // 'staging' | 'production'
  domain: 'flynothink.it',                // dominio ufficiale (fornito da Gabriele)

  legal: Object.freeze({
    // URL dei documenti forniti da iubenda. Finché sono null, i link puntano alle pagine segnaposto locali.
    privacyPolicyUrl: 'https://www.iubenda.com/privacy-policy/66588632',
    cookiePolicyUrl: 'https://www.iubenda.com/privacy-policy/66588632/cookie-policy',
    termsUrl: null                        // DA CONFIGURARE
  }),

  // iubenda è caricato dallo script ufficiale «embeds» nel <head> di index.html (banner + preferenze).
  // I dati qui sotto sono solo registro: consent.js NON carica una seconda copia finché tracking.enabled è false.
  iubenda: Object.freeze({
    siteId: 4724834,                      // dal widget iubenda 9ba641eb-…
    cookiePolicyId: 66588632,
    lang: 'it',
    // Script della Cookie Solution: confrontarlo con lo snippet fornito dal pannello iubenda prima dell'uso.
    csScriptUrl: 'https://cdn.iubenda.com/cs/iubenda_cs.js',
    snippetVerificato: true               // 19/10/2026: in uso lo script ufficiale «embeds» fornito dal pannello iubenda (index.html)
  }),

  gtm: Object.freeze({ containerId: 'GTM-TM3ZR5KL' }),  // fornito da Gabriele il 19/10/2026; si carica solo dopo il consenso iubenda (finalità 4 o 5)
  clarity: Object.freeze({ projectId: null }),    // solo registro: il tag vive in GTM — DA CONFIGURARE
  metaPixel: Object.freeze({ pixelId: null }),    // solo registro: il tag vive in GTM — DA CONFIGURARE

  tracking: Object.freeze({
    enabled: true,                        // interruttore generale (19/10/2026): GTM solo dopo consenso a misurazione o marketing
    allowOnStaging: false                 // true solo per i test dei consensi in staging
  })
});
