# Registro placeholder e contenuti mancanti

Aggiornato alla **Fase R1** (nessuna voce cambiata rispetto alla B3). Nessuna voce è stata riempita con contenuti inventati.
I blocchi nel codice sono marcati con `data-placeholder="…"` o `data-rights="da-confermare"`, e `scripts/check-publish.mjs` li rileva.

## Chiuse in B3

| # | Voce | Come è stata chiusa |
|---|---|---|
| 1 | Hero, riquadro immagine | Composizione grafica originale in SVG (soluzione «riquadro solo grafico» prevista nel registro). Nessuna fotografia, nessun volto, nessun dato personale. La didascalia «Il mondo dentro i guanti» resta |

## Chiuse in B2

| # | Voce | Come è stata chiusa |
|---|---|---|
| 2 | Scheda del referente (nome, ruolo, foto, presentazione, formazione, motivazione) | Contenuti forniti dal founder e integrati alla lettera: Gabriele De Pietto, Consulente in Mindset e Human Performance. I due master sono presentati **in corso**, non come titoli conseguiti. La motivazione è già nel racconto in prima persona, quindi lo slot separato è stato eliminato |

## Aperte

| # | Posizione | Informazione mancante | Impatto sulla pubblicazione | Soluzione possibile | Decisione richiesta al founder |
|---|---|---|---|---|---|
| 3 | Modulo, passo 1 «[da configurare]» (`double-opt-in`) | Modalità di conferma dell'iscrizione | **Bloccante (legale)** | Double opt-in (consigliato), oppure checkbox di consenso | Double opt-in o checkbox? |
| 4 | Modulo, link «informativa privacy» + «[da redigere]» (`informativa-privacy`) | Testo dell'informativa e pagina `/privacy` | **Bloccante (legale)** | Redazione con un professionista | Chi la redige? |
| 5 | FAQ «Cosa succede ai miei dati?» (`informativa-faq`) | Rimando all'informativa | **Bloccante**, insieme al punto 4 | Link alla pagina `/privacy` | Dipende dal punto 4 |
| 6 | Footer (`dati-legali`) | Titolare del trattamento, dati societari o della persona fisica, politica cookie | **Bloccante (legale)** | Inserire i dati | Chi è il titolare? |
| 7 | «Durata e frequenza: da definire» | Durata e frequenza degli incontri | Non bloccante | Lasciare dichiarato | Confermare |
| 8 | FAQ «Quanto costa?» | Prezzo | Non bloccante | Lasciare dichiarato | Confermare |
| 9 | `<head>` — CONFIG PUBBLICAZIONE | Dominio, `canonical`, `og:url`, immagine social 1200×630 | **Bloccante per la condivisione** | Dominio e immagine social | Quale dominio? Chi produce l'immagine? |
| 10 | UVP | — | Rischio di qualità: «ogni portiere / *i tuoi* obiettivi» | Proposta: «*i suoi* obiettivi» | Decisione dell'Analyst |
| 11 | Modulo, blocco errore (nascosto) | Testo approvato | Visibile solo in modalità `live` | Testo provvisorio presente | Approvare |
| 12 | `config.js` — `endpoint` | Servizio di raccolta contatti | **Bloccante** | Servizio con double opt-in, server nell'UE e DPA | Quale servizio? |
| 13 | Hosting | Piattaforma, HTTPS, regola per `/grazie` | **Bloccante** | Riscrittura `/grazie` → `grazie.html` o cartella dedicata | Dove si pubblica? |

## Nuove voci B2 — fotografie

| # | Posizione | Questione | Impatto | Soluzione possibile | Decisione richiesta al founder |
|---|---|---|---|---|---|
| 14 | Scheda referente, ritratto (`data-rights="da-confermare"`) | **Diritti di pubblicazione non documentati.** Autore dello scatto sconosciuto. Sulla maglia sono visibili lo stemma del club e il logo dello sponsor tecnico; in tribuna ci sono spettatori piccoli e non identificabili | **Bloccante** finché l'autore non è noto e non c'è il consenso | Confermare chi ha scattato la foto e ottenere il consenso scritto; verificare che non ci siano vincoli con il club | Chi ha scattato la foto? Hai il consenso a pubblicarla? |
| 15 | Ritratto — risoluzione | L'originale è 1024×765 px. Sugli schermi ad alta densità (retina) la foto viene leggermente ingrandita a 1024 e 1440 px | Non bloccante: qualità visiva | Fornire il file originale ad alta risoluzione: i ritagli si rigenerano senza toccare il codice | Hai l'originale ad alta risoluzione? |
| 16 | Seconda foto (uscita bassa) | **Non utilizzata.** Watermark «©foto francesco cenci», quindi diritti del fotografo, e un attaccante riconoscibile | Nessuno: non è nel sito | Per usarla: licenza scritta del fotografo per l'uso senza watermark (il watermark non va rimosso da noi) e liberatoria dell'attaccante. Valutare poi se aggiunge valore | Vuoi chiedere la licenza al fotografo? |
