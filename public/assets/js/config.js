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
    formId: '201751821070370540'      // modulo embedded «FNT Landing», gruppo «FNT · Lista d'attesa», double opt-in attivo
  }),
  successUrl: 'grazie.html',
  requestTimeoutMs: 12000,
  // Decisione sull'età minima per iscriversi (es. 14). Finché è null la pubblicazione resta bloccata.
  minAge: null
});
