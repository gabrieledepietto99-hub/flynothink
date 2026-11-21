/*
 * FlyNoThink — configurazione del modulo di iscrizione (versione pubblicabile, nessuna modalità demo).
 *
 * Il modulo invia nome ed email al modulo «embedded» di MailerLite, che gestisce il double opt-in
 * (email di conferma) e la conservazione dei dati. Questo sito non salva nulla.
 * Dove trovare i due ID: MailerLite → Forms → Embedded forms → il modulo → codice HTML:
 *   l'indirizzo è  https://assets.mailerlite.com/jsonp/<ACCOUNT_ID>/forms/<FORM_ID>/subscribe
 * Non inserire valori inventati: con un campo a null il modulo mostra il messaggio d'errore e
 * scripts/check-publish.mjs blocca la pubblicazione.
 */
window.FNT_CONFIG = Object.freeze({
  provider: 'mailerlite',
  mailerlite: Object.freeze({
    // Tra virgolette di proposito: il formId ha 18 cifre e come numero JavaScript perderebbe le ultime cifre.
    accountId: '2722839',
    formId: '201751821070370540',     // modulo embedded «FNT Landing», gruppo «FNT · Lista d'attesa», double opt-in attivo
    // Nomi dei campi personalizzati in MailerLite (Subscribers → Fields). null = campo non ancora creato: non viene inviato.
    fields: Object.freeze({ fasciaEta: null, interesse: null, compilatoDa: null, promo: null })
  }),
  // FNT 4.0 (anteprima, 21/11/2026): invio spento finché i campi qui sopra non esistono in MailerLite
  // e non è validato il percorso per i minorenni. Con false il modulo verifica i dati ma non invia nulla.
  submitEnabled: true,   // 21/11/2026: produzione, solo 18+ (fasce sotto i 18 nascoste finché la privacy non copre i minori)
  successUrl: 'grazie.html',
  requestTimeoutMs: 12000,
  minAge: 18,              // 21/11/2026: iscrizione solo 18+ in produzione
  parentUnder: 14          // sotto i 14 anni il modulo lo compila un genitore o tutore (da validare)
});
