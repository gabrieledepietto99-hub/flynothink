# FNT R4.1 — Integrazione iubenda (19 ottobre 2026)

**Commit:** `6a8d1ec` su `main`, unito ad `anteprima` (`ae1a9bd`).
**Stato su Vercel:**
- anteprima `flynothink-git-anteprima-me-stesso.vercel.app` → **READY**;
- produzione → bloccata dal controllo di pubblicazione (mancano 3 dati, vedi sotto).

## File modificati

| File | Modifica |
|---|---|
| `public/index.html` | Script ufficiale iubenda (`embeds.iubenda.com/widgets/9ba641eb-…`) all'inizio del `<head>`, subito dopo `charset` e `viewport`, una sola volta. Link Privacy (×3) e Cookie (×1) verso i documenti iubenda |
| `public/grazie.html`, `privacy.html`, `cookie.html`, `termini.html` | Stessi link verso i documenti iubenda (lo script iubenda non è incluso: vedi aperti) |
| `public/assets/js/site-config.js` | URL di Privacy e Cookie Policy; siteId 4724834 e cookiePolicyId 66588632 solo come registro; tracciamento ancora `enabled: false` |
| `public/assets/js/consent.js` | Il pulsante «Preferenze cookie» del footer compare solo se l'API iubenda è caricata e apre le preferenze ufficiali (`_iub.cs.api.openPreferences`). Nessuna seconda copia di iubenda |
| `vercel.json`, `deploy-altri-hosting/*` | CSP (ancora in sola osservazione) estesa a `*.iubenda.com` per script, stili, immagini, connessioni e frame. `/privacy` e `/cookie` reindirizzati (302) ai documenti iubenda |

Testi, design, immagini, animazioni e struttura: invariati.

## Verifiche

| Test | Esito | Come |
|---|---|---|
| Script caricato una sola volta, prima degli altri | PASS | Browser reale (pannello Claude), anteprima |
| Link Privacy e Cookie Policy (footer, modulo, FAQ) | PASS | HTML; documenti iubenda raggiungibili |
| Banner al primo accesso | NON APPLICABILE | iubenda non mostra il banner perché la Cookie Policy contiene solo la categoria «Necessari»: non ci sono consensi facoltativi da chiedere (`getPreferences().purposes = {1: true}`) |
| Accettare / rifiutare consensi facoltativi | NON TESTABILE | Nel pannello «Rifiuta tutto» e «Accetta tutto» ci sono, ma non esistono finalità facoltative su cui agire |
| Personalizzare e salvare le preferenze | PASS | Pannello aperto, «Salva e continua»: preferenza registrata (timestamp) |
| Riaprire o modificare le scelte: pulsante «Preferenze cookie» nel footer | PASS | Apre il pannello ufficiale iubenda |
| Riaprire o modificare le scelte: widget flottante iubenda (in basso a destra) | PASS dopo la prima scelta | Prima della scelta iubenda lo tiene nascosto (`display: none`); dopo appare e apre il pannello |
| Nessun GTM, Clarity, Meta Pixel; nessun tracker | PASS | Domini esterni caricati: solo `embeds.iubenda.com`, `cdn.iubenda.com`, `idb.iubenda.com` (registro consensi) e, solo in anteprima, `vercel.live`. Nessun cookie scritto |
| Blocco preventivo di tecnologie non essenziali | PASS (per assenza) | Non ci sono tecnologie non essenziali da bloccare. L'autoblocco iubenda è attivo |
| CSP | PASS | Nessuna violazione per iubenda. Le uniche violazioni riguardano `vercel.live`, la barra commenti di Vercel presente solo in anteprima |
| Errori JavaScript | PASS | Nessun errore della pagina né di iubenda |
| Scorrimento orizzontale, CTA in prima schermata (512 px e 1440×900) | PASS | |
| Sovrapposizioni | PASS con nota | Il widget flottante (38×38 px, in basso a destra) non copre CTA né navigazione; può passare sopra il testo durante lo scorrimento |
| Sito con iubenda bloccato | PASS | Pagina completa, animazioni attive, pulsante «Preferenze cookie» nascosto, nessun errore, axe 0 |
| Sito con iubenda lento (4 s) | **FAIL** | Lo snippet è sincrono: pagina vuota finché iubenda non risponde (primo contenuto a 4,1–4,9 s invece di 0,16 s) |
| Safari iOS, Firefox, dispositivi reali | NON TESTATO | |

## Problemi aperti

1. **Script sincrono.** Se iubenda è lento o irraggiungibile, la pagina resta vuota. Lo snippet è stato inserito com'è, come richiesto.
   - Con `async` il problema sparisce, e qui non si perde nulla perché non ci sono script di terzi da bloccare prima del consenso.
   - Serve la tua approvazione per modificarlo.
2. **Privacy Policy iubenda** (il contenuto lo controlli tu sul pannello iubenda):
   - nei dati raccolti mancano il **nome** (il modulo lo chiede) e il **trattamento tramite il modulo del sito**;
   - MailerLite risulta con «Dati di utilizzo +1»: vanno indicati **nome ed email**;
   - non c'è il **fornitore di hosting** (Vercel), che tratta i log con l'indirizzo IP;
   - il titolo mostra «Privacy Policy di **4724834**»: in iubenda va impostato il nome del sito;
   - non c'è nulla sull'**età minima di 18 anni** decisa per il modulo.
3. **Normative extra UE attive** (USA, Svizzera, Brasile): il pannello mostra una sezione sui diritti secondo le leggi USA. Se il pubblico è solo italiano si possono disattivare nel pannello iubenda.
4. **Badge «Created with iubenda»** nel pannello: dipende dal piano iubenda.
5. **Lo script è solo in `index.html`**, come richiesto. `grazie.html` e le pagine segnaposto non lo caricano: oggi non cambia nulla, perché non ci sono cookie non essenziali.
6. **Mancano 3 dati** per la produzione: URL dei Termini e Condizioni (o decisione di togliere il link), riga del titolare nel footer, conferma dei diritti sulla foto del referente.
7. **Non è una verifica di conformità GDPR.** La presenza del banner e dei documenti non la dimostra.
