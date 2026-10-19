# Report di test — Fase R1 (B3 → R1)

**Browser:** Chromium 141.0.7390.37 headless (Playwright), su una CPU cloud a 2 core, senza throttling.
**Non disponibili:** Firefox e WebKit/Safari non sono installati nell'ambiente, e scaricarli non è consentito. **Non testati.**
**Metodo:** B3 e R1 servite affiancate da server HTTP locale; stessi script e stesse condizioni per entrambe. Data: 18 ottobre 2026.

## 1. Reveal allo scroll

| | B3 | R1 |
|---|---|---|
| Sorgente della timeline `view()` | `DIV.page-1` (contenitore che non scorre) | `HTML` (documento) |
| Elementi `.reveal` animati durante lo scroll | 0 su 38 | **38 su 38** (390 e 1440 px, campione ogni 6 px) |
| Elementi che occupano più del 35% dello schermo con opacità < 0,9 | 0 | 0 |
| Elementi non pienamente visibili a fine pagina | 0 | 0 |
| Elementi bloccati semitrasparenti dopo il ritorno in cima | 0 | 0 |
| Opacità minima di un elemento con focus da tastiera | 1 | 1 |

- **Campionamento più largo:** con un campione ogni 40 px risultavano 31–33 su 38. Gli elementi mancanti sono bassi e completano il reveal in meno di 40 px di scroll; con il campione a 6 px li ho rilevati tutti.
- **Prima della correzione dell'intervallo:** la scheda del referente risultava al 66–79% di opacità con 300–400 px visibili. Il problema era sulla R1 provvisoria (solo `clip`) ed è stato risolto.
- **Movimento ridotto:** 0 animazioni attive, tutti i reveal a opacità 1, scorrimento non animato. Identico alla B3.

## 2. Animazioni infinite: costo prima e dopo

Mediana di 5 ripetizioni. Finestra di 4 s, misurata dopo 6,5 s dal caricamento (intro dell'hero conclusa), con `prefers-reduced-motion: no-preference`. Fonte: metriche `Performance` del Chrome DevTools Protocol. La finestra include un ciclo `requestAnimationFrame` di misura, che da solo vale circa 0,07–0,08 s.

| Caso | Layout B3 → R1 | Ricalcoli di stile B3 → R1 | Thread principale occupato B3 → R1 |
|---|---|---|---|
| 390 px, in cima (visual dell'hero sotto la piega) | 241 → **0** | 241 → 241 | 0,242 s → **0,132 s** |
| 390 px, fondo pagina | 241 → **0** | 241 → **0** | 0,278 s → **0,076 s** (base) |
| 1440 px, in cima (visual visibile) | 241 → 241 | 241 → 241 | 0,344 s → 0,339 s (invariato) |
| 1440 px, fondo pagina | 241 → **0** | 241 → **0** | 0,290 s → **0,079 s** (base) |

- **Fuori viewport** il lavoro delle animazioni infinite si azzera: resta solo il ciclo di misura. **[V]**
- **Pausa e ripresa** verificate con `getAnimations()`: `paused` fuori viewport, `running` al rientro.
- **Pallino:** non provoca più layout. Restano 60 ricalcoli di stile al secondo, circa 0,014 s ogni 4 s.
- **Con il visual dell'hero visibile il costo non cambia.** Il respiro delle linee (scala su un gruppo SVG) forza un layout a ogni frame. Ricostruito disattivando le animazioni infinite: circa 0,22 s ogni 4 s. Toglierlo richiederebbe di ristrutturare l'SVG dell'hero, vietato in R1: vedi problemi aperti.

## 3. Regressione visiva

Screenshot a pagina intera con movimento ridotto, font reali e tutte le immagini caricate.

| Larghezza | Altezza B3 → R1 | Testo della pagina | Ordine delle sezioni | Pixel diversi |
|---|---|---|---|---|
| 320 | 13.304 → 13.327 | identico | identico | Solo nelle 2 CTA; il resto è spostato in verticale (vedi sotto) |
| 375 | 12.427 → 12.450 | identico | identico | Come 320 |
| 390 | 12.213 → 12.236 | identico | identico | Come 320 |
| 768 | 10.050 → 10.050 | identico | identico | **0** |
| 1024 | 8.128 → 8.128 | identico | identico | **0** |
| 1440 | 9.051 → 9.051 | identico | identico | **0** |

**Mobile, confronto per geometria** (372–383 elementi per larghezza):

- cambiano altezza solo le due CTA (+19,19 px e +4 px) e i contenitori che le includono;
- nessun elemento cambia larghezza o posizione orizzontale;
- tutto il resto è identico oppure solo spostato in verticale di quella quantità;
- le differenze di pixel sotto la prima CTA sono antialiasing dovuto allo spostamento frazionario (19,19 px);
- la parte di pagina sopra la prima CTA è identica pixel per pixel.

## 4. CTA (320 / 375 / 390 px)

| Pulsante | B3 | R1 | Altezza B3 → R1 |
|---|---|---|---|
| «Cosa costruiamo» | 320: «…sul» / «percorso FNT»; 375–390: «…sul percorso» / «**FNT**» | «Tienimi aggiornato» / «sul percorso FNT» | 52 → 71 px |
| Modulo | 320–375: «…sul» / «percorso FNT»; 390: «…sul percorso» / «**FNT**» | «Tienimi aggiornato» / «sul percorso FNT» | 58 → 62 px |
| «Scopri il percorso FNT», «Tienimi aggiornato» | una riga | una riga | 52 → 52 px |

- Tutti i pulsanti restano dentro il proprio contenitore.
- Aree toccabili ≥ 44 px a tutte le larghezze.
- Testo identico.

## 5. Altri controlli su R1

- **Overflow orizzontale:** 0 alle 6 larghezze, con e senza movimento ridotto. `scrollWidth` = viewport; lo scorrimento orizzontale forzato non sposta la pagina.
- **Contrasto AA:** 0 errori (177–178 elementi).
- **Aree cliccabili < 44 px:** 0.
- **Errori JavaScript e console:** 0. Risorse mancanti: 0. Richieste a domini esterni: 0.
- **axe-core** (WCAG 2.0/2.1/2.2 AA + best practice): 0 violazioni su `index.html` e `grazie.html`, a 390 e 1440 px, con e senza movimento ridotto.
- **Tastiera:** 16 elementi, tutti con focus visibile e portati nel viewport. «Salta al contenuto» a 44 px; Invio porta il focus su `<main>`.
- **CLS** con scroll completo a 390 px: B3 0, R1 0.
- **Modulo DEMO:**
    - invio vuoto → `invalid`; dati validi → `demo` con pannello visibile;
    - 0 richieste di rete; localStorage, sessionStorage e cookie vuoti;
    - `formMode: 'demo'`, `endpoint: null`.
- **Senza JavaScript:** 6.919 caratteri visibili (come la B3), pulsante d'invio disabilitato.
- **html-validate:** 0 errori. `node --check motion.js`: OK.
- **check-publish:** BLOCCATA, 13 problemi, identici alla B3.

## Non eseguiti

- Firefox, WebKit/Safari, dispositivi fisici, screen reader reali, Lighthouse.
- Costo su CPU mobile reale.
- Il supporto a `animation-timeline` e `text-wrap: balance` in Safari e Firefox non è verificato qui. In entrambi i casi la pagina ripiega su contenuti statici e pienamente visibili, oppure sul ritorno a capo della B3.
