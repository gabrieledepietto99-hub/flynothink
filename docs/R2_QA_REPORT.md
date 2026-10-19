# R2 — QA Report

**Browser:** Chromium 141.0.7390.37 headless (Playwright), su CPU cloud a 2 core, senza throttling. Pagine servite da server HTTP locale. R1 in parallelo come riferimento. Data: 18 ottobre 2026.
**Non disponibili nell'ambiente:** Firefox, WebKit/Safari, dispositivi fisici, screen reader reali (vedi in fondo).
**Script e dati grezzi:** `evidenze/6-dati/` (`qa_r2.py`, `qa_r2.json`).

## Esito

| Controllo | Esito |
|---|---|
| Animazioni realmente visibili (prima / durante / dopo) | ✔ 8 scene × 2 larghezze, fotogrammi e 2 video |
| Nessun elemento lasciato nascosto dopo lo scroll | ✔ 0 su tutte le 6 larghezze |
| Testi, sezioni, titoli, link, campi uguali alla R1 | ✔ identici alle 6 larghezze; altezze delle pagine identiche |
| Movimento ridotto | ✔ 0 animazioni, 0 elementi nascosti |
| Senza JavaScript · script di motion bloccato | ✔ tutto visibile |
| Overflow orizzontale | ✔ 0 alle 6 larghezze |
| Contrasto AA | ✔ 0 errori (177–178 elementi) |
| Aree toccabili < 44 px | ✔ 0 |
| axe-core (WCAG 2.0/2.1/2.2 AA + best practice) | ✔ 0 violazioni (390 e 1440, con e senza movimento) |
| Tastiera | ✔ 16 elementi, focus visibile, opacità piena al focus |
| Console JavaScript | ✔ 0 errori in tutte le prove |
| Layout shift (CLS) durante lo scroll | ✔ 0 (R1: 0) |
| Fluidità durante lo scroll | ✔ 0 frame > 50 ms; p95 16,7 ms (identico alla R1) |
| Modulo DEMO | ✔ nessuna richiesta, nessun dato salvato |
| Blocco di pubblicazione | ✔ BLOCCATA, 13 problemi, identici alla R1 |

## 1. Le animazioni si vedono

Metodo: ogni scena viene portata nel viewport e lasciata girare fino in fondo. Poi viene riportata allo stato iniziale con le transizioni disattivate (fotogramma **prima**, stessa inquadratura) e riattivata: fotogrammi **durante** a 0,5 s e 1,2 s, poi **dopo**. Le strisce sono in `evidenze/3-prima-durante-dopo/STRISCIA_*`.

| Scena | Schermo cambiato fra prima e dopo: 1440 px | 390 px |
|---|---|---|
| 01 Hero (dal caricamento) | sequenza completa nelle strisce | idem; visual ripreso quando entra (`01-hero_390_visual-*`) |
| 02 Mondo emotivo | 3,4% | 7,0% |
| 02b Tre storie | 0,7% (linee sottili) | 1,5% |
| 03 Ascolto | 3,7% | 7,8% |
| 04 Tre incontri | 1,4% | 5,4% |
| 05 Mappa | 7,4% | 18,7% |
| 06 Referente | 17,2% | 31,4% |
| 07 Conversione | 21,4% | 6,6% |

Le percentuali misurano quanta superficie cambia, non quanto si nota. Le linee sottili delle storie occupano poco spazio ma si leggono bene: i fotogrammi sono la prova, i numeri solo un controllo.

**Video:** `evidenze/4-video/R2_sequenze_1440.mp4` (55 s) e `R2_sequenze_390.mp4` (59 s). Caricamento dell'hero e percorso nelle sezioni con pause di 3 s, registrati da Playwright nello stesso browser. La velocità di scorrimento è scriptata, non manuale.

## 2. Nessun contenuto perso o nascosto

| Larghezza | Altezza R1 = R2 | Elementi non attivati dopo lo scroll | Elementi semitrasparenti | Linee non disegnate | Glifi sovrapposti al testo |
|---|---|---|---|---|---|
| 320 | 13.327 = 13.327 | 0 | 0 | 0 | no |
| 375 | 12.450 = 12.450 | 0 | 0 | 0 | no |
| 390 | 12.236 = 12.236 | 0 | 0 | 0 | no |
| 768 | 10.050 = 10.050 | 0 | 0 | 0 | no |
| 1024 | 8.128 = 8.128 | 0 | 0 | 0 | no |
| 1440 | 9.051 = 9.051 | 0 | 0 | 0 | no |

- **Testi** (`innerText` di tutta la pagina), ordine delle sezioni, titoli H1–H3, link e destinazioni, campi del modulo: **identici alla R1** a tutte e 6 le larghezze.
- **Movimento ridotto** (390 e 1440): classe `.m` assente, 0 animazioni, 0 elementi nascosti, linee tutte disegnate, nessun ritaglio.
- **Senza JavaScript** (390): tutto visibile, 6.919 caratteri come la R1, pulsante d'invio disabilitato. Il visual dell'hero si anima come in R1: 19 animazioni attive al momento del controllo.
- **`motion.js` bloccato di proposito:** `.m` presente a 0,4 s, rimossa dalla protezione a 2,5 s. Poi 0 elementi nascosti.

## 3. Interazioni

- **Tastiera** (390 e 1440): 16 elementi, outline ≥ 2 px, ognuno portato nel viewport. Opacità effettiva al momento del focus: **1** in tutti i casi. «Salta al contenuto»: 44 px, Invio porta su `<main>`.
- **Modulo:**
  - invio vuoto → stato `invalid` e scossa del campo (`m-nudge`);
  - al focus: etichetta verde `#1E6B66`, alone `0 0 0 8px`, outline mantenuto;
  - dati validi → stato `demo`, il pannello entra con `m-rise`;
  - 0 richieste di rete; localStorage, sessionStorage e cookie vuoti.
- **Pulsante in hover:** `translate` da `none` a `0 −2px`.

## 4. Prestazioni

**Scroll completo** (CLS e intervalli tra frame):

| | CLS | Frame > 50 ms | p95 |
|---|---|---|---|
| R1 · 390 | 0 | 0 / 660 | 16,8 ms |
| R2 · 390 | 0 | 0 / 660 | 16,7 ms |
| R1 · 1440 | 0 | 0 / 528 | 16,8 ms |
| R2 · 1440 | 0 | 0 / 528 | 16,7 ms |

**Costo a riposo**, dopo la fine di tutte le intro: mediana di 3 prove su una finestra di 4 s, metriche del Chrome DevTools Protocol.

| | Layout | Ricalcoli di stile | Thread principale occupato |
|---|---|---|---|
| R1 · 1440 in cima | 241 | 241 | 0,192 s |
| **R2 · 1440 in cima** | **0** | 241 | **0,101 s** |
| R1 · 390 in cima | 0 | 241 | 0,099 s |
| R2 · 390 in cima | 0 | 241 | 0,077 s |
| R1 · fondo pagina | 0 | 0 | 0,054–0,057 s |
| R2 · fondo pagina | 0 | 0 | 0,028 s |

- **Problema aperto della R1 risolto:** con il visual visibile non c'è più layout a ogni frame, perché il respiro delle linee è ora limitato a 2 cicli.
- **Restano** 60 ricalcoli di stile al secondo, dovuti al pallino e alla luce (opacità e transform), solo quando sono visibili.
- **Scheda nascosta (simulata):** la classe `is-tab-hidden` viene applicata e luce e pallini risultano in pausa. La simulazione ridefinisce `document.hidden`; non è un vero cambio di scheda.

**Peso:** `motion.css` 20 KB e `motion.js` 4,9 KB, non minificati e senza compressione. Nessuna libreria e nessuna richiesta esterna.

## 5. Bug trovati durante il QA e corretti

1. **Coda del «Q» corsivo visibile prima della rivelazione del titolo.** Era un puntino isolato, dovuto al ritaglio iniziale.
2. **Il titolo «Quello che non si vede.» poteva non attivarsi mai** (768 e 1024 px). La correzione del punto 1 lasciava l'elemento con un'area visibile nulla e l'observer lo mancava. **Sostituito il ritaglio con una «tenda»** del colore dello sfondo: il titolo non è mai ritagliato. Ora 0 elementi non attivati a tutte le larghezze.
3. **Glifi dei tre incontri sovrapposti all'etichetta** a 768 px (colonne di circa 214 px). Fra 601 e 960 px ora stanno sopra la linea, a 36 px.
4. **Opacità 0,93 al focus** su un elemento in transizione. Ora, quando un elemento riceve il focus, la comparsa è istantanea.

## Non eseguiti

- **Firefox, WebKit/Safari:** non installati e non scaricabili nell'ambiente. Il sistema usa solo API supportate da tutti i browser moderni (`IntersectionObserver`, `translate` e `scale` individuali, `clip-path inset`), ma la resa non è verificata.
- **Dispositivi fisici** (iPhone, Android), touch reale, **screen reader reali**, **Lighthouse**, rete mobile reale.
- **Effetti al puntatore** (luce che segue il mouse): implementati ma non registrati nei video.
- **Valutazione con portieri reali:** se le animazioni li fanno sentire compresi è un'ipotesi da verificare, non un risultato.
