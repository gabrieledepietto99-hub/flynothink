# R2 — Changelog (R1 → R2 · Cinematic Motion System)

Base: `FNT_R1_landing.zip` (intatta, checksum verificate). Testi, ordine delle sezioni, CTA e destinazioni, modulo DEMO, protezioni di anteprima e logo: invariati.

## In sintesi

R1 aveva un solo momento animato (l'intro dell'hero) e reveal tutti uguali. R2 introduce un sistema unico in cui ogni sezione ha un gesto proprio, legato a ciò che il testo dice:

| Scena | Gesto | Significato |
|---|---|---|
| 01 Hero | «Prima del portiere,» poi «ci sei tu.»; la luce si apre; il visual si accende quando è visibile | Prima il ruolo, poi la persona |
| 02 Mondo emotivo | Il titolo si scopre da sinistra; le scene arrivano in sequenza con una linea-tempo sopra; le domande arrivano lente | Ciò che non si vede diventa visibile; la pressione che si accumula |
| 02b Storie | Tre forme che si disegnano in modo diverso | Ogni storia è diversa |
| 03 Ascolto | Luce che si apre nella sezione scura; onde che si allargano; la frase della proposta preceduta dalla sua linea | Dalla pressione alla possibilità di essere ascoltati |
| 04 Tre incontri | Una linea unica 01 → 02 → 03; glifi: cerchi che si aprono, punti che si collegano, linee che convergono | Ascolto → Comprensione → Orientamento come percorso |
| 05 Mappa | Fogli che arrivano, linee che si chiudono verso il centro, voci che si avvicinano, «Tu, oggi» per ultimo | Elementi separati che diventano chiari e collegati |
| 06 Referente | La fotografia si scopre, poi le parole; nessun filtro sulla persona | Una persona reale, presentata con misura |
| 07 Conversione | Il modulo arriva per ultimo; campi e pulsanti rispondono al tocco | Semplice e rassicurante |

## File

| File | Modifica |
|---|---|
| `index.html` | Script di una riga nel `<head>` (attiva `.m` prima del primo disegno, con protezione di 2,5 s). Link a `motion.css`. `pathLength="1"` sui contorni esistenti (storie, Mappa). Un SVG decorativo `aria-hidden` in «Uno spazio personale», che **riusa i contorni della Mappa**. Tre glifi SVG `aria-hidden` nei tre incontri. **Nessun testo aggiunto, tolto o modificato.** |
| `assets/css/motion.css` | **Nuovo.** Tutto il sistema: token, scene, microinterazioni, protezioni. |
| `assets/js/motion.js` | **Riscritto** (era il file R1 di pausa delle animazioni). Motore unico `IntersectionObserver`, pausa fuori viewport e con la scheda nascosta (R1 conservato e esteso), parallasse e luce al puntatore solo su desktop. |
| `assets/css/landing.css` | Rimosso il reveal R1 basato su `animation-timeline: view()`, sostituito dal motore unico. Rimosse le regole R1 di stampa e focus, spostate ed estese in `motion.css`. Il respiro delle linee dell'hero passa da infinito a 2 cicli. Le correzioni R1 (`overflow-x:clip`, pallino in `transform`, pausa fuori viewport, CTA bilanciate) restano. |
| `docs/R2_*.md` | Changelog, specifica motion, report QA |

## Decisioni da conoscere

- **Il reveal della R1 non usa più `animation-timeline: view()`**, perché non è supportato da tutti i browser e il brief chiede di non dipendere da API non universali. Il nuovo motore offre le stesse garanzie: nulla resta nascosto, il focus è sempre visibile, la stampa mostra tutto.
- **Tre segni grafici nuovi, tutti `aria-hidden` e senza testo.**
  - **Onde di ascolto:** sono le stesse linee della Mappa.
  - **Glifi dei tre incontri:** derivano dal linguaggio dell'hero (cerchi, punti, linee verso un punto).
  - **Luce ambientale:** un gradiente radiale nella palette FNT, nell'hero e in «Uno spazio personale».

  Sono visibili anche senza animazione. Se li ritieni un'alterazione dell'identità, si tolgono senza toccare il resto.
- **Su mobile il visual dell'hero resta dopo testo e CTA.** Come chiede il brief, il messaggio resta prioritario. La sua sequenza ora parte quando lo si raggiunge, non più al caricamento fuori schermo.
- **Parallasse e luce al puntatore solo su desktop con mouse.** Su touch non ci sono effetti legati al dito o allo scroll, solo gli ingressi delle scene.
