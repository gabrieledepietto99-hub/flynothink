# R2 — Motion Spec (Cinematic Motion System)

**Principio:** ogni movimento mostra qualcosa che il testo dice già: persona prima del ruolo, ascolto, comprensione, orientamento. Nessun effetto senza significato.

## Architettura

| Parte | File | Ruolo |
|---|---|---|
| Interruttore | `index.html`, script nel `<head>` (1 riga) | Aggiunge `.m` all'`<html>` **prima del primo disegno**, solo se esiste `IntersectionObserver` e il sistema non chiede movimento ridotto. Se `motion.js` non si carica entro 2,5 s, toglie `.m`: nulla resta nascosto. |
| Sistema | `assets/css/motion.css` | Token, scene, microinterazioni. Gli stati iniziali nascosti esistono **solo** con `.m` **e** dentro `@media (prefers-reduced-motion: no-preference)`. |
| Motore | `assets/js/motion.js` (4,9 KB non minificato) | Un solo `IntersectionObserver`: aggiunge `.is-in` **una volta** a ogni elemento che entra (margine inferiore −10%). Gli elementi che entrano insieme ricevono una cascata di 90 ms (massimo 450 ms) tramite `--m-d`. Inoltre: pausa delle animazioni continue fuori viewport, pausa con la scheda nascosta, parallasse e luce al puntatore solo su desktop. |

**Cambiamento rispetto alla R1.** Il reveal legato allo scroll in CSS (`animation-timeline: view()`), supportato solo da alcuni browser, è sostituito dal motore `IntersectionObserver`. Le garanzie della R1 restano:

- nessun contenuto nascosto a fine scroll;
- un elemento con il focus da tastiera è sempre visibile;
- la stampa mostra tutto;
- la pausa fuori viewport è mantenuta.

## Token

| Token | Valore | Uso |
|---|---|---|
| `--m-ease` | `cubic-bezier(.16, 1, .3, 1)` | Ingressi: partenza decisa, arrivo lungo e morbido |
| `--m-ease-io` | `cubic-bezier(.65, 0, .35, 1)` | Linee che si disegnano, rivelazioni |
| `--m-spring` | `cubic-bezier(.34, 1.56, .64, 1)` | Punti che «arrivano» (centro della Mappa, punto d'orientamento) |
| `--m-dist` | 32 px desktop · 18 px ≤ 600 px | Distanza di salita |
| Durate | 0,6–1,2 s per gli elementi, 1,4–2,6 s per le linee e la luce | — |

**Proprietà animate:** solo `opacity`, `translate`, `scale`, `clip-path` e `stroke-dashoffset`. Si usano le proprietà individuali `translate` e `scale`, che non sovrascrivono le rotazioni già presenti (fogli della Mappa, seconda storia).

## Effetti per scena

Legenda trigger: **carico** = al primo disegno · **IO** = quando l'elemento entra nel viewport · **hover/focus** = interazione.

| Scena | Effetto | Trigger | Durata · ritardo | Easing | Proprietà | Mobile | Fallback (senza JS · movimento ridotto · stampa) |
|---|---|---|---|---|---|---|---|
| 01 Hero | Navigazione appare | carico | 0,8 s | ease | opacity | uguale | statico |
| 01 Hero | Luce ambientale si apre dietro il visual | carico | 2,4 s | m-ease | opacity, scale | la luce sta dietro il titolo | statica, visibile |
| 01 Hero | Badge, poi «Prima del portiere,» sale | carico | 0,8 s / 1,1 s · 0,05 / 0,15 s | m-ease | opacity, translate (0,3 em) | uguale: il testo resta prioritario | statico |
| 01 Hero | «ci sei tu.» arriva dopo: la persona dopo il ruolo | carico | 1,2 s · 0,7 s | ease | opacity | uguale | statico |
| 01 Hero | Sottotitolo, testo, CTA, meta in cascata | carico | 0,9–1 s · 0,9 / 1 / 1,1 / 1,25 s | m-ease | opacity, translate | uguale; CTA visibile entro ~2 s | statico |
| 01 Hero | Il visual sale e si accende; linee, figura, percorso e luce partono solo ora | IO | 1,1–1,6 s · 0,1 s, poi la sequenza B3 (≈4,8 s) | m-ease | opacity, translate, scale; SVG: tratto | parte quando lo si raggiunge scorrendo: non si consuma fuori schermo | come B3/R1: sequenza al caricamento senza JS; statico con movimento ridotto |
| 01 Hero | Profondità: il visual scorre più lentamente del testo | scroll | continuo, ±36 px | — | transform | **disattivato** (touch) | nessuno |
| 01 Hero | La luce segue il puntatore | puntatore | 0,9 s | m-ease | translate | **disattivato** | luce ferma |
| 01 Hero | Respiro delle linee | dopo l'intro | 14 s × 2 cicli (era infinito) | ease-in-out | transform (SVG) | uguale | nessuno |
| 02 Mondo emotivo | «Quello che non si vede.» si scopre da sinistra: ciò che non si vede diventa visibile | IO | 1,6 s | m-ease-io | clip-path | uguale | statico |
| 02 | Le quattro scene arrivano una dopo l'altra | IO | 0,8–1 s · 0 / 0,16 / 0,32 / 0,48 s | m-ease | opacity, translate | uguale | statico |
| 02 | Una linea scorre sopra le scene, come il tempo che passa | IO | 2,2 s · 0,2 s | m-ease-io | scale X | uguale | assente |
| 02 | Le domande arrivano come pensieri; l'ultima, verde, più lenta | IO | 1–1,5 s · 0,2 / 0,5 / 0,8 / 1,15 s | m-ease | opacity, translate | uguale | statico |
| 02 | Tre storie: le tre forme si disegnano dal centro, ognuna in modo diverso | IO | 1,8 s per linea, sfalsate di 0,1 s; schede sfalsate di 0,15 s | m-ease-io | tratto, opacity, translate | uguale | disegnate |
| 03 Ascolto | Una luce si apre nella sezione scura | IO | 2–2,6 s | m-ease | opacity, scale | uguale | statica |
| 03 | Onde di ascolto: i contorni della Mappa si allargano dal centro | IO | 2,4 s, sfalsate di 0,25 s | m-ease-io | tratto | più piccole e più tenui | disegnate |
| 03 | Profondità delle onde | scroll | ±70 px | — | transform | **disattivata** | nessuna |
| 03 | La frase della proposta: prima la linea, poi le parole | IO | 1,2 s; testo dopo 0,35 s | m-ease-io / m-ease | scale Y, opacity, translate | uguale | statica |
| 03 | Ascolto → Comprensione → Orientamento entrano da sinistra, poi le frecce | IO | 0,8–1 s · 0 / 0,18 / 0,36 s; frecce 0,5 / 0,7 s | m-ease | opacity, translate X | salgono dal basso (colonna) | statico |
| 04 Tre incontri | Una sola linea collega 01 → 02 → 03 | IO | 1,1 s per tratto · 0 / 0,55 / 1,1 s | m-ease-io | scale X | ogni incontro parte quando arriva sullo schermo | bordo statico |
| 04 | Ascolto: i cerchi si aprono | IO | 1 s, sfalsati di 0,15 s | m-ease | scale, opacity | uguale | glifo statico |
| 04 | Comprensione: punti sparsi si organizzano, poi i collegamenti | IO | 1 s; linee 1,2 s · +0,9 s | m-ease / m-ease-io | translate, opacity, tratto | uguale | glifo statico |
| 04 | Orientamento: tre linee convergono verso un punto, che arriva per ultimo | IO | 1,1 s; punto 0,6 s · +1,35 s | m-ease-io / m-spring | tratto, scale | uguale | glifo statico |
| 04 | Testi di ogni incontro | IO | 0,8–1 s · +0,25 / 0,4 / 0,55 s | m-ease | opacity, translate | uguale | statici |
| 05 Mappa | A / B / C in cascata | IO | 0,8–1 s · 0 / 0,14 / 0,28 s | m-ease | opacity, translate | uguale | statico |
| 05 | Il documento e la Mappa arrivano come fogli | IO | 1–1,4 s · 0 / 0,18 s | m-ease | opacity, translate, scale | il documento retrostante è già nascosto su mobile | statici |
| 05 | Le linee della Mappa si disegnano dall'esterno verso il centro | IO | 1,5 s · 0,55 → 1,15 s | m-ease-io | tratto | uguale | disegnate |
| 05 | Storia, Obiettivi, Risorse, Esigenze, Priorità si avvicinano al centro | IO | 0,8–1,1 s · 1,1 → 1,5 s | m-ease | opacity, translate | uguale | statiche |
| 05 | «Tu, oggi» arriva per ultimo; poi le righe si compilano | IO | 0,7 s · 1,85 s; righe 0,9 s · 2,1–2,4 s | m-spring / m-ease | scale | uguale | statiche |
| 06 Referente | La fotografia si scopre dal basso e si assesta; nessun filtro sul volto | IO | 1,4 s; immagine 2,2 s | m-ease-io / m-ease | clip-path; scale 1,08 → 1 | uguale | statica |
| 06 | Titolo, nome, qualifica, paragrafi, formazione: ognuno entra quando arriva | IO (per elemento) | 0,9–1,1 s + cascata | m-ease | opacity, translate | importante: la scheda è alta 3,4 schermate, ogni paragrafo ha il suo trigger | statici |
| 06 | Linea della citazione | IO | 1,1 s · +0,3 s | m-ease-io | scale Y | uguale | bordo statico |
| 07 Conversione | Colonna testo in cascata, poi il modulo | IO | 0,9–1,1 s; modulo +0,15 s, 48 px | m-ease | opacity, translate | uguale | statico |
| 07 | I tre passaggi 1-2-3 si accendono | IO | 0,6 s · 0,3 / 0,45 / 0,6 s | m-spring | scale, opacity | uguale | statici |
| 07 | Etichetta del campo attivo in verde | focus | istantaneo | — | color | uguale | **attivo anche con movimento ridotto** |
| 07 | Alone morbido sul campo attivo, oltre all'outline di 2 px | focus | 0,35 s | m-ease | box-shadow | uguale | outline invariato |
| 07 | Campo non valido: piccola scossa orizzontale | stato | 0,42 s | ease | translate | uguale | solo bordo e messaggio |
| 07 | Messaggi d'errore e pannello DEMO entrano | stato | 0,35 s / 0,7 s | ease / m-ease | opacity, translate | uguale | appaiono |
| Tutte | Pulsanti: sollevamento in hover, pressione al tocco | hover / active | 0,35 s / 0,08 s | m-ease | translate −2 px, scale 0,98 | la pressione funziona al tocco | colore come R1 |
| FAQ | Risposta che entra all'apertura | stato | 0,5 s | m-ease | opacity, translate | uguale | appare |

## Regole di sicurezza

- **Senza JavaScript:** `.m` non esiste, quindi nessuno stato nascosto. La pagina è quella statica; il visual dell'hero si anima come in B3/R1.
- **Movimento ridotto:** `.m` non viene aggiunta e tutte le regole sono comunque dentro `no-preference`. Zero animazioni.
- **Script mancante:** dopo 2,5 s `.m` viene rimossa e tutto è visibile.
- **Focus da tastiera:** l'elemento e i contenitori animati che lo contengono diventano subito visibili, via JS e via `:focus-within`.
- **Stampa:** tutto visibile e fermo.
- **Animazioni continue:** solo luce dell'hero (opacity) e pallino «in progettazione» (transform e opacity su pseudo-elemento). Entrambe in pausa fuori viewport e con la scheda nascosta. Il respiro delle linee, che forzava il layout, è limitato a 2 cicli.
- **Niente scroll-jacking:** lo scroll non viene mai bloccato né guidato; nessuna sequenza obbligatoria.
- **Nessun layout shift:** nessuna animazione cambia le dimensioni. I nuovi segni (onde, glifi, luce) sono posizionati in assoluto e non spostano il contenuto.
