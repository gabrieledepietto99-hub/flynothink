/*
 * FlyNoThink — collegamenti legali, preferenze cookie e caricamento condizionato dei servizi esterni.
 *
 * Ordine garantito (privacy by design):
 *   1. Senza configurazione completa → nessuno script esterno. Fine.
 *   2. Con configurazione completa → si carica SOLO la Cookie Solution di iubenda.
 *      Prima di qualsiasi altro servizio: Google Consent Mode impostato su «denied».
 *   3. Solo dopo una scelta dell'utente che includa misurazione (finalità 4) o marketing (finalità 5)
 *      si carica Google Tag Manager. Se l'utente rifiuta tutto, GTM non viene mai caricato.
 *   4. Dentro GTM: Clarity parte solo con fnt_consent.measurement = true,
 *      Meta Pixel solo con fnt_consent.marketing = true (trigger su evento «fnt_consent_update»).
 * Nessuna libreria, nessun cookie scritto da questo file.
 */
(function () {
  'use strict';
  var w = window, d = document, C = w.FNT_SITE || {};
  var status = w.FNT_CONSENT_STATUS = { configured: false, reasons: [], iubendaLoaded: false, gtmLoaded: false, lastConsent: null };

  /* 1 · Link legali: URL iubenda se configurati, altrimenti pagine segnaposto locali */
  var legal = C.legal || {};
  var map = { privacy: legal.privacyPolicyUrl, cookie: legal.cookiePolicyUrl, terms: legal.termsUrl };
  Array.prototype.forEach.call(d.querySelectorAll('[data-legal]'), function (a) {
    var url = map[a.getAttribute('data-legal')];
    if (typeof url === 'string' && /^https:\/\//.test(url)) a.href = url;
  });

  /* 2 · Verifica della configurazione (nessun valore viene inventato o completato) */
  var iub = C.iubenda || {}, gtm = C.gtm || {}, tr = C.tracking || {};
  var need = function (ok, msg) { if (!ok) status.reasons.push(msg); };
  need(tr.enabled === true, 'tracking.enabled è false');
  need(C.env === 'production' || tr.allowOnStaging === true, 'ambiente di staging senza allowOnStaging');
  need(/^\d+$/.test(String(iub.siteId)), 'iubenda.siteId mancante');
  need(/^\d+$/.test(String(iub.cookiePolicyId)), 'iubenda.cookiePolicyId mancante');
  need(iub.snippetVerificato === true, 'snippet iubenda non verificato');
  need(/^GTM-[A-Z0-9]{4,12}$/.test(String(gtm.containerId)), 'gtm.containerId mancante o non valido');
  status.configured = status.reasons.length === 0;

  /* 3 · Pulsante «Preferenze cookie» */
  var note = d.querySelector('[data-cookie-prefs-note]');
  Array.prototype.forEach.call(d.querySelectorAll('[data-cookie-prefs]'), function (btn) {
    btn.addEventListener('click', function () {
      var api = w._iub && w._iub.cs && w._iub.cs.api;
      if (api && typeof api.openPreferences === 'function') { api.openPreferences(); return; }
      if (note) { note.hidden = false; }
    });
  });

  /* «Preferenze cookie» nel footer: visibile solo se la Cookie Solution di iubenda (script «embeds» nel <head>)
     è davvero caricata e ne espone l'API ufficiale. Se iubenda non si carica, il pulsante resta nascosto. */
  var showPrefsIfIubenda = function (tries) {
    var api = w._iub && w._iub.cs && w._iub.cs.api;
    if (api && typeof api.openPreferences === 'function') {
      status.iubendaLoaded = true;
      Array.prototype.forEach.call(d.querySelectorAll('[data-cookie-prefs]'), function (btn) { btn.hidden = false; });
    } else if (tries > 0) { setTimeout(function () { showPrefsIfIubenda(tries - 1); }, 500); }
  };
  if (d.readyState === 'complete') showPrefsIfIubenda(20); else w.addEventListener('load', function () { showPrefsIfIubenda(20); });

  if (!status.configured) return;            // ← senza tracciamento configurato il file si ferma qui: nessun GTM, Clarity o Meta Pixel.

  /* «Preferenze cookie» compare solo quando esiste davvero una gestione dei consensi */
  Array.prototype.forEach.call(d.querySelectorAll('[data-cookie-prefs]'), function (btn) { btn.hidden = false; });

  /* 4 · Google Consent Mode: tutto negato prima di qualsiasi tag */
  w.dataLayer = w.dataLayer || [];
  var gtag = function () { w.dataLayer.push(arguments); };
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied', personalization_storage: 'denied',
    security_storage: 'granted'
  });

  var loadGTM = function () {
    if (status.gtmLoaded) return;
    status.gtmLoaded = true;
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = d.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtm.containerId);
    d.head.appendChild(s);
  };

  var onPreference = function (pref) {
    var p = (pref && pref.purposes) || {};
    var all = !!(pref && pref.consent === true && !pref.purposes);
    var measurement = all || p[4] === true || p['4'] === true;
    var marketing = all || p[5] === true || p['5'] === true;
    status.lastConsent = { measurement: measurement, marketing: marketing };
    gtag('consent', 'update', {
      analytics_storage: measurement ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
    w.dataLayer.push({ event: 'fnt_consent_update', fnt_consent: { measurement: measurement, marketing: marketing } });
    if (measurement || marketing) loadGTM();   // nessun consenso → GTM non viene caricato
  };

  /* 5 · iubenda Cookie Solution (unico script esterno prima della scelta).
     ATTENZIONE: index.html carica già iubenda con lo script «embeds». Prima di attivare il tracciamento va scelto
     un solo metodo (consigliato: collegare onPreference agli eventi dello script embeds) per non avere due copie. */
  if (d.querySelector('script[src*="embeds.iubenda.com"]')) return;
  w._iub = w._iub || [];
  w._iub.csConfiguration = {
    siteId: Number(iub.siteId),
    cookiePolicyId: Number(iub.cookiePolicyId),
    lang: iub.lang || 'it',
    perPurposeConsent: true,
    reloadOnConsent: true,                    // revoca/modifica: la pagina si ricarica senza i tag non più consentiti (da verificare)
    callback: { onPreferenceExpressedOrNotNeeded: onPreference }
  };
  var s = d.createElement('script');
  s.async = true;
  s.src = iub.csScriptUrl;
  s.onload = function () { status.iubendaLoaded = true; };
  d.head.appendChild(s);
})();
