# Checklist dei requisiti bloccanti per la pubblicazione

Tutte le voci vanno chiuse prima di rimuovere l'avviso di anteprima. Stato attuale: **non pubblicabile**.

## Contenuti
- [x] Visual dell'hero: composizione grafica originale (registro #1, chiusa in B3)
- [ ] Consigliato: test di 5 secondi della prima schermata con 5–8 portieri reali (cosa hanno capito? per chi è?)
- [x] Scheda referente compilata con contenuti forniti dal founder (registro #2, chiusa in B2)
- [ ] Diritti del ritratto del referente confermati: autore e consenso scritto; poi rimuovere `data-rights="da-confermare"` (registro #14)
- [ ] Consigliato: ritratto originale ad alta risoluzione (registro #15)
- [ ] Titoli del referente documentabili su richiesta (laurea, chinesiologo)
- [ ] Seconda foto: non usare senza licenza del fotografo e liberatoria dell'attaccante (registro #16)
- [ ] UVP: decisione dell'Analyst registrata (registro #10)
- [ ] Testo dell'errore del modulo approvato (registro #11)

## Privacy e legale
- [ ] Titolare del trattamento e dati nel footer (registro #6)
- [ ] Informativa privacy redatta e pubblicata su `/privacy`; link aggiornati nel modulo e nelle FAQ (registro #4, #5)
- [ ] Base giuridica scelta: double opt-in o checkbox (registro #3)
- [ ] Contratto di trattamento (DPA) con il servizio di raccolta contatti
- [ ] Se si usano strumenti di analisi: gestione del consenso prima di qualsiasi tracciamento

## Backend del modulo
- [ ] Servizio di raccolta contatti scelto e configurato (registro #12)
- [ ] `config.js`: `formMode: 'live'` e `endpoint` reale
- [ ] Validazione lato server, protezione anti-spam (honeypot o rate limit)
- [ ] Email di conferma (se double opt-in) e procedura di disiscrizione funzionanti
- [ ] Redirect a `/grazie` solo dopo una risposta positiva del server; test dello stato di errore
- [ ] Rimuovere il banner DEMO dal modulo e il pannello demo

## SEO, condivisione e hosting
- [ ] Dominio definitivo e HTTPS
- [ ] `canonical`, `og:url`, `og:image` (1200×630) e `og:image:alt`; `twitter:card` → `summary_large_image` (registro #9)
- [ ] `/grazie` servito correttamente (regola di riscrittura o cartella) e sempre `noindex` (registro #13)

## Misurazione
- [ ] Strumento scelto; eventi `hero_cta_click`, `form_view` e `generate_lead` (quest'ultimo solo dopo conferma del server), senza dati personali, subordinati al consenso
- [ ] Soglia di successo dello smoke test definita prima del lancio

## Sblocco finale (in quest'ordine)
- [ ] `node scripts/check-publish.mjs` termina senza errori
- [ ] Rimuovere l'avviso di anteprima da `index.html` e `grazie.html`
- [ ] Rimuovere `noindex` da `index.html` (lasciarlo su `grazie.html`)
- [ ] Aggiornare `robots.txt` (consentire `/`, escludere `/grazie`)
- [ ] Prova finale su iPhone (Safari) e Android (Chrome) sul dominio definitivo
