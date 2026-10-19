/*
 * FlyNoThink — modulo di iscrizione agli aggiornamenti (versione pubblicabile).
 * Stati: idle → (validazione) → submitting → success (vai a /grazie) | error.
 * Invio al modulo embedded di MailerLite; successo SOLO se MailerLite risponde success: true.
 * Senza JavaScript il pulsante resta disabilitato.
 */
(function () {
  'use strict';

  var config = window.FNT_CONFIG || {};
  var ml = config.mailerlite || {};
  var form = document.getElementById('lead-form');
  if (!form) return;

  var nameInput = form.querySelector('#f-nome');
  var emailInput = form.querySelector('#f-email');
  var trap = form.querySelector('#f-sito');
  var submitBtn = form.querySelector('[data-submit]');
  var submitLabel = form.querySelector('[data-submit-label]');
  var spinner = form.querySelector('[data-spinner]');
  var formError = form.querySelector('[data-form-error]');

  var LABEL_IDLE = submitLabel.textContent.trim();
  var LABEL_BUSY = 'Invio in corso…';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var touched = false, busy = false;

  function validateName(v) { v = v.trim(); if (!v) return 'Inserisci il tuo nome.'; if (v.length < 2) return 'Il nome sembra troppo corto.'; return ''; }
  function validateEmail(v) { v = v.trim(); if (!v) return 'Inserisci la tua email.'; if (!EMAIL_RE.test(v)) return 'Controlla l’email: deve essere nel formato nome@email.it'; return ''; }

  function setFieldError(input, message) {
    var box = document.getElementById(input.getAttribute('aria-describedby'));
    var p = box && box.querySelector('.field-error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!p) return;
    p.querySelector('[data-error-text]').textContent = message;
    p.hidden = !message;
  }
  function validateAll() {
    var a = validateName(nameInput.value), b = validateEmail(emailInput.value);
    setFieldError(nameInput, a); setFieldError(emailInput, b);
    return { ok: !a && !b, firstInvalid: a ? nameInput : (b ? emailInput : null) };
  }
  function setState(s) { form.setAttribute('data-state', s); }
  function setBusy(b) {
    busy = b; submitBtn.disabled = b; submitBtn.setAttribute('aria-busy', b ? 'true' : 'false');
    spinner.hidden = !b; submitLabel.textContent = b ? LABEL_BUSY : LABEL_IDLE;
  }
  function showError() { setState('error'); formError.hidden = false; formError.focus && formError.focus(); }

  function configured() { return /^\d+$/.test(String(ml.accountId)) && /^\d+$/.test(String(ml.formId)); }

  function sendLead(nome, email) {
    if (!configured()) return Promise.reject(new Error('MailerLite non configurato'));
    var url = 'https://assets.mailerlite.com/jsonp/' + ml.accountId + '/forms/' + ml.formId + '/subscribe';
    var body = new URLSearchParams();
    body.append('fields[email]', email);
    body.append('fields[name]', nome);
    body.append('ml-submit', '1');
    body.append('anticsrf', 'true');
    var controller = 'AbortController' in window ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, config.requestTimeoutMs || 12000) : null;
    return fetch(url, { method: 'POST', body: body, headers: { 'Accept': 'application/json' }, signal: controller ? controller.signal : undefined })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) {
        if (timer) clearTimeout(timer);
        if (!res.ok || !data || data.success !== true) throw new Error('Iscrizione non confermata');
        return data;
      }); });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (busy) return;
    touched = true;
    formError.hidden = true;
    var r = validateAll();
    if (!r.ok) { setState('invalid'); r.firstInvalid.focus(); return; }
    if (trap && trap.value) { setState('success'); window.location.assign(config.successUrl || 'grazie.html'); return; } // bot: nessun invio
    setState('submitting'); setBusy(true);
    sendLead(nameInput.value.trim(), emailInput.value.trim())
      .then(function () { setState('success'); window.location.assign(config.successUrl || 'grazie.html'); })
      .catch(function () { setBusy(false); showError(); });
  });

  [nameInput, emailInput].forEach(function (input) {
    input.addEventListener('input', function () { if (touched) validateAll(); });
  });

  submitBtn.disabled = false;   // nasce disabilitato: attivo solo con JavaScript
})();
