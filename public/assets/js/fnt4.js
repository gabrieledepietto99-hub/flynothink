/*
 * FlyNoThink 4.0 · navigazione, comparsa delle sezioni, modulo di interesse.
 * Nessuna libreria. Senza JavaScript la pagina resta completa e leggibile; solo l'invio del modulo richiede JS.
 */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;

  /* ---- barra di navigazione: fondo pieno appena si lascia l'hero ---- */
  var nav = d.querySelector('[data-nav]');
  var onScroll = function () { if (nav) nav.classList.toggle('is-solid', w.scrollY > 40); };
  w.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- comparsa: si nascondono solo gli elementi ancora sotto la piega, e solo se l'osservatore esiste ---- */
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in w && !reduce) {
    root.classList.add('js-motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    Array.prototype.forEach.call(d.querySelectorAll('.rv'), function (el) {
      if (el.getBoundingClientRect().top > w.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  /* ---- modulo ---- */
  var C = w.FNT_CONFIG || {}, ml = C.mailerlite || {};
  var form = d.getElementById('lead-form');
  if (!form) return;
  var $ = function (s) { return form.querySelector(s); };
  var age = $('#f-eta'), nome = $('#f-nome'), email = $('#f-email'), parent = $('#f-genitore'), promo = $('#f-promo'), trap = $('#f-sito');
  var lblNome = $('[data-label-nome]'), lblEmail = $('[data-label-email]');
  var u14 = $('[data-minor="u14"]'), u18 = $('[data-minor="u18"]');
  var btn = $('[data-submit]'), btnLabel = $('[data-submit-label]'), spin = $('[data-spinner]'), msg = $('[data-form-msg]');
  var radios = form.querySelectorAll('input[name="interesse"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var touched = false, busy = false, LABEL = btnLabel.textContent;

  function isU14() { return age.value === '12-13'; }
  function syncAge() {
    u14.hidden = !isU14(); u18.hidden = age.value !== '14-17';
    lblNome.textContent = isU14() ? 'Nome del genitore o tutore' : 'Nome';
    lblEmail.textContent = isU14() ? 'Email del genitore o tutore' : 'Email';
    if (!isU14()) parent.checked = false;
  }
  function interesse() { for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i].value; return ''; }
  function setErr(id, text, input) {
    var p = d.getElementById(id); p.textContent = text; p.hidden = !text;
    if (input) input.setAttribute('aria-invalid', text ? 'true' : 'false');
  }
  function validate() {
    var errs = [];
    var e1 = age.value ? '' : 'Seleziona la tua fascia d\'età.'; setErr('e-eta', e1, age); if (e1) errs.push(age);
    var e2 = isU14() && !parent.checked ? 'Sotto i 14 anni il modulo deve essere compilato da un genitore o tutore.' : ''; setErr('e-genitore', e2, parent); if (e2) errs.push(parent);
    var n = nome.value.trim(); var e3 = !n ? 'Inserisci il nome.' : (n.length < 2 ? 'Il nome sembra troppo corto.' : ''); setErr('e-nome', e3, nome); if (e3) errs.push(nome);
    var m = email.value.trim(); var e4 = !m ? 'Inserisci l\'email.' : (!EMAIL_RE.test(m) ? 'Controlla l\'email: deve essere nel formato nome@email.it' : ''); setErr('e-email', e4, email); if (e4) errs.push(email);
    var e5 = interesse() ? '' : 'Scegli cosa ti interessa di più.'; setErr('e-int', e5); if (e5) errs.push(radios[0]);
    return errs;
  }
  function show(text, isError) { msg.textContent = text; msg.hidden = false; msg.classList.toggle('is-error', !!isError); msg.focus(); }
  function setBusy(b) { busy = b; btn.disabled = b; btn.setAttribute('aria-busy', b ? 'true' : 'false'); spin.hidden = !b; btnLabel.textContent = b ? 'Invio in corso…' : LABEL; }

  function send() {
    if (!/^\d+$/.test(String(ml.accountId)) || !/^\d+$/.test(String(ml.formId))) return Promise.reject(new Error('MailerLite non configurato'));
    var f = ml.fields || {};
    var body = new URLSearchParams();
    body.append('fields[email]', email.value.trim());
    body.append('fields[name]', nome.value.trim());
    if (f.fasciaEta) body.append('fields[' + f.fasciaEta + ']', age.value);
    if (f.interesse) body.append('fields[' + f.interesse + ']', interesse());
    if (f.compilatoDa) body.append('fields[' + f.compilatoDa + ']', isU14() ? 'genitore' : 'interessato');
    if (f.promo) body.append('fields[' + f.promo + ']', promo.checked ? 'si' : 'no');
    body.append('ml-submit', '1'); body.append('anticsrf', 'true'); body.append('ajax', '1');
    var ctl = 'AbortController' in w ? new AbortController() : null;
    var t = ctl ? setTimeout(function () { ctl.abort(); }, C.requestTimeoutMs || 12000) : null;
    var url = 'https://assets.mailerlite.com/jsonp/' + ml.accountId + '/forms/' + ml.formId + '/subscribe';
    return fetch(url, { method: 'POST', body: body, headers: { Accept: 'application/json' }, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (data) {
        if (t) clearTimeout(t);
        if (!r.ok || !data || data.success !== true) throw new Error('Iscrizione non confermata');
      }); });
  }

  age.addEventListener('change', function () { syncAge(); if (touched) validate(); });
  [nome, email].forEach(function (i) { i.addEventListener('input', function () { if (touched) validate(); }); });
  [parent].concat(Array.prototype.slice.call(radios)).forEach(function (i) { i.addEventListener('change', function () { if (touched) validate(); }); });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;
    touched = true; msg.hidden = true;
    var errs = validate();
    if (errs.length) { errs[0].focus(); return; }
    if (trap && trap.value) { w.location.assign(C.successUrl || 'grazie.html'); return; }   // bot: nessun invio
    if (C.submitEnabled !== true) {
      show('Anteprima: il modulo è compilato correttamente, ma l\'invio è disattivato finché i nuovi campi non sono pronti in MailerLite. Nessun dato è stato inviato.');
      return;
    }
    setBusy(true);
    send().then(function () { w.location.assign(C.successUrl || 'grazie.html'); })
      .catch(function () { setBusy(false); show('Non siamo riusciti a completare l\'iscrizione. Riprova tra poco oppure scrivici a flynothink@gmail.com.', true); });
  });

  syncAge();
  btn.disabled = false;   // nasce disabilitato: attivo solo con JavaScript
})();
