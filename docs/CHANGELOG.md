# Changelog

## B3 → R1 — Technical & Motion Fix

Riferimento: `FNT_B3_landing.zip` (non modificato). Correzioni dei tre difetti P0 dell'audit «FNT — Creative, Visual & Motion Audit (B3)». Nessun redesign; R2 e R3 non implementati.

### 1. Reveal allo scroll riattivati

**Causa confermata.** `.page-1` aveva `overflow-x:hidden`. Per specifica, se un asse è `hidden` l'altro (`visible`) viene calcolato come `auto`: `.page-1` diventava quindi uno scroll container. Siccome non scorre (altezza automatica), `animation-timeline: view()` si agganciava a `DIV.page-1` invece che al documento. La timeline restava ferma all'83%, stato «finished», sui 38 elementi `.reveal` (l'audit ne contava 37: il 38° è un elemento senza testo).

**Correzioni** (`landing.css`):

| Intervento | Prima (B3) | Ora (R1) | Perché |
|---|---|---|---|
| Ritaglio orizzontale | `overflow-x:hidden` | `overflow-x:hidden;overflow-x:clip` | `clip` ritaglia come prima ma **non** crea uno scroll container. I browser senza `clip` leggono `hidden` e, non supportando nemmeno `view()`, mostrano la pagina statica. |
| Intervallo del reveal | `entry 0% entry 55%` | `entry 0% entry min(160px, 100%)` | Con il 55% dell'altezza, la scheda del referente (fino a 2.089 px su mobile) restava al 66–79% di opacità mentre se ne leggevano già 300–400 px. Ora ogni reveal si completa entro 160 px di scroll, o entro l'ingresso completo se l'elemento è più basso. Movimento e curva sono invariati. |
| Focus da tastiera | — | `.reveal:focus-within{animation:none}` | Un elemento raggiunto col Tab che compare al bordo inferiore non resta mai dentro un reveal trasparente. |
| Stampa | — | `@media print` → reveal disattivati | Nessun contenuto trasparente su carta o in PDF. |

**Ripiego statico.** Il reveal resta dentro `@supports (animation-timeline: view())` e `prefers-reduced-motion: no-preference`. Senza supporto, con movimento ridotto o in stampa, i contenuti sono pienamente visibili fin dall'inizio. Il reveal è solo CSS: funziona anche senza JavaScript.

### 2. Animazioni infinite

| Animazione | Prima (B3) | Ora (R1) |
|---|---|---|
| Pallino «Percorso in progettazione» (2 istanze) | Alone animato con `box-shadow`, ridisegnato a ogni frame | Stesso aspetto, ottenuto con uno pseudo-elemento `::after` animato in `transform` + `opacity` |
| Respiro delle linee dell'hero, luce dell'hero, pallini | Sempre in esecuzione, anche fuori schermo | In pausa (`animation-play-state: paused`) quando l'elemento è fuori viewport; ripartono al rientro |

La pausa è impostata da `assets/js/motion.js` (nuovo, circa 1 KB) con `IntersectionObserver`. Senza JavaScript o senza `IntersectionObserver` il comportamento resta quello della B3.

**Le animazioni d'ingresso dell'hero non sono state toccate.** Avviarle quando il visual entra in vista è l'intervento 4 dell'audit (R2).

### 3. CTA su mobile

| Larghezza | Prima (B3) | Ora (R1) |
|---|---|---|
| 375 e 390 px, «Cosa costruiamo» | «Tienimi aggiornato sul percorso» / «FNT» in 52 px | «Tienimi aggiornato» / «sul percorso FNT» in 71 px |
| 390 px, pulsante del modulo | «… sul percorso» / «FNT» in 58 px | «Tienimi aggiornato» / «sul percorso FNT» in 62 px |
| 320 px | due righe sbilanciate, compresse in 52 / 58 px | due righe bilanciate, 71 / 62 px |

- `.btn{text-wrap:balance}` bilancia le righe, con lo stesso testo.
- 10 px di padding verticale, con l'altezza minima ricalcolata, danno respiro solo quando il testo va a capo. **Su una riga ogni pulsante resta di 52 px (58 px il pulsante del modulo), come nella B3.**
- `<a>` e `<button>` hanno regole distinte perché il browser assegna ai `<button>` `box-sizing: border-box`.

### File modificati

| File | Modifica |
|---|---|
| `index.html` | +1 riga: `<script src="assets/js/motion.js" defer></script>` |
| `assets/css/landing.css` | `.page-1` (clip), intervallo del reveal, pallino, 4 blocchi R1 in fondo (stampa, pausa, CTA, focus) |
| `assets/js/motion.js` | Nuovo |
| `README.md`, `docs/*` | Documentazione |

**Non modificati:** testi, ordine delle sezioni, H1, UVP, SVG dell'hero, palette, font, foto e scheda del referente, destinazioni delle CTA, modulo DEMO (`config.js`, `main.js`), FAQ, footer, `/grazie`, protezioni di pubblicazione.

---

## B2 → B3 — Visual dell'hero «Lo spazio dell'ascolto»

Riferimento: `FNT_B2_landing.zip` (non modificato).

### Modificato: solo il riquadro visivo dell'hero

| Prima (B2) | Ora (B3) |
|---|---|
| Contorni concentrici decorativi + riquadro «Placeholder · Foto da produrre» con la descrizione dello scatto | Composizione grafica originale in SVG (8,4 KB, nel file HTML) |
| `data-placeholder="foto-hero"` | Rimosso: il segnaposto è chiuso |
| SVG decorativo nascosto agli screen reader | SVG con `role="img"` e titolo descrittivo |

**Didascalia «Il mondo dentro i guanti»:** invariata.

### La composizione

- **Persona:** sagoma stilizzata in controluce, senza volto né tratti riconoscibili, nella posizione di attesa del portiere. È l'unico segno del ruolo, insieme alla porta.
- **Porta:** pali e traversa a filo, sfumati verso il terreno, con la base della rete appena accennata. La porta è il "mondo" del portiere, ma resta in secondo piano: la persona viene prima del ruolo, come dice il titolo.
- **Ascolto:** le linee concentriche organiche (lo stesso segno dei contorni della B2) partono dalla persona e si allargano oltre i pali.
- **Orientamento:** una linea sottile parte dai piedi della figura, esce dalla porta e sale verso un punto di luce. Lungo il percorso ci sono tre punti senza etichette.
- **Palette:** verde petrolio desaturato, turchese FNT `#6CC3BB` a bassa opacità, accenti crema `#F3F1EC`. Nessun colore nuovo nel brand.
- **Spazio negativo:** circa un terzo della card resta vuoto.
- **Ritagli:** la composizione si legge sia in 4:5 (desktop e tablet) sia nel ritaglio 4:3 del mobile. Nessuna regola di layout è cambiata.

### Movimento (solo senza `prefers-reduced-motion: reduce`)

- Le linee si disegnano in sequenza (3 s), poi "respirano" lentamente (scala 1 → 1,035, 14 s, avanti e indietro).
- La figura compare in dissolvenza (1,4 s).
- Il percorso si disegna dopo 1,2 s.
- I tre punti compaiono uno alla volta.
- Il punto di luce pulsa lentamente (7 s).
- Con movimento ridotto la composizione è statica e completa fin dal primo istante.

### CSS

- Aggiunte le classi `.hv-*`.
- Rimosse le regole del segnaposto: `.hero-20`–`.hero-33`, `.contour`, `@keyframes drift`.
- Riusato `@keyframes draw`, già esistente.

### Non modificato

Testi (titolo, sottotitoli, CTA, UVP, didascalia), struttura HTML fuori dal riquadro, dimensioni del riquadro, sezione referente, modulo DEMO, JavaScript, font, `/grazie`, protezioni di anteprima. Verificato: 0 pixel diversi fuori dal riquadro a 5 larghezze (vedi report di test).

---

## B1 → B2 — Referente reale

Riferimento: `FNT_B1_landing.zip` (non modificato).

### Modificato: solo la scheda del referente (sezione «Persone e visione»)

| Prima (B1) | Ora (B2) |
|---|---|
| Avviso «NON PUBBLICABILE FINO ALLA COMPILAZIONE» | Rimosso: i contenuti sono stati forniti |
| Riquadro foto segnaposto | Ritratto reale in `<picture>`, con ritagli diversi per dispositivo (vedi sotto) |
| «[Nome e Cognome]» come titolo | Titolo «Prima di accompagnare un portiere, sono stato uno di loro.», poi nome **Gabriele De Pietto** e qualifica *Consulente in Mindset e Human Performance* |
| «[Presentazione professionale…]» + slot «Perché questo progetto» | Biografia completa in cinque paragrafi, testo fornito invariato. Il terzo paragrafo (la distanza tra il portiere in campo e la persona fuori) è evidenziato come citazione: è la motivazione del progetto, quindi lo slot separato non serve più |
| «Qualifiche: [ente, anno]» | «Formazione»: laurea e formazione specialistica; i due master con l'etichetta **«In corso»**, non come titoli conseguiti |
| «Il suo ruolo: conduce i tre incontri…» | «Referente iniziale del percorso FNT: conduce i tre incontri…». "Iniziale" lascia aperta l'evoluzione senza presentare un team che non esiste |

### Composizione

- **Desktop (≥ 901 px):** griglia a due colonne. A sinistra foto 4:5, sotto la formazione e il ruolo; a destra titolo e racconto. Le due colonne si bilanciano. Una prima versione con solo la foto a sinistra lasciava un vuoto sotto l'immagine ed è stata scartata.
- **Tablet (601–900 px):** scheda in colonna, foto orizzontale 3:2 a tutta larghezza, poi racconto e formazione.
- **Mobile (≤ 600 px):** scheda in colonna, foto **verticale 4:5** a tutta larghezza. Il 3:2 del segnaposto B1 rendeva il volto di circa 40 px a 320 px.
- Ordine di lettura per gli screen reader: foto, titolo e racconto, formazione e ruolo.

### Fotografie

- **Ritratto:** ritagli 4:5 (400, 612 px) e 3:2 (640, 1024 px) in AVIF e WebP, fallback JPEG. Solo ritaglio e compressione: nessun ritocco, filtro o modifica di volto, corpo o contenuto sportivo.
- `width`/`height` espliciti su `<img>` e `<source>`, contenitore con `aspect-ratio`: CLS misurato 0.
- `loading="lazy"`, `decoding="async"`, testo alternativo descrittivo.
- Marcato `data-rights="da-confermare"`: `check-publish.mjs` blocca la pubblicazione finché i diritti non sono confermati.
- **Seconda foto (uscita bassa): non utilizzata.** Watermark del fotografo e attaccante riconoscibile. Il watermark non è stato toccato.

### CSS

- Aggiunte le classi `.ref-*` in fondo a `landing.css`.
- Rimosse 16 classi `persone-*` della vecchia scheda, non più usate.
- La regola mobile `.ref-photo` passa da 3:2 a 4:5. È l'unica regola mobile toccata e riguarda solo questa scheda.

### Controllo di pubblicazione

`check-publish.mjs` verifica anche `data-rights="da-confermare"`.

### Non modificato

HTML di tutte le altre sezioni: **identico byte per byte** alla B1. CSS delle altre sezioni, JavaScript, modulo DEMO, font, metadati, `/grazie`, avvisi di anteprima, `noindex`, `robots.txt`.

---

## V3.2 → B1

*(Vedi il changelog B1 nella consegna precedente: ricostruzione in HTML statico, CSS a classi, font locali, modulo predisposto in DEMO, protezioni dell'anteprima.)*
