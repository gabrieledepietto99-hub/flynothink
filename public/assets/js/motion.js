/* FNT · R2 — motore del Cinematic Motion System (circa 5 KB non minificato, nessuna dipendenza).
   1. Pausa delle animazioni continue fuori viewport e con la scheda non attiva (da R1).
   2. Attivazione delle scene: un solo IntersectionObserver aggiunge .is-in una volta sola.
      Gli elementi che entrano insieme ricevono un piccolo ritardo a cascata (--m-d).
   3. Profondità su desktop con mouse: parallasse leggera del visual dell'hero e delle onde
      di ascolto, luce dell'hero che segue il puntatore. Mai su touch, mai con movimento ridotto.
   Senza JavaScript, senza IntersectionObserver o con movimento ridotto la classe .m non
   esiste e la pagina resta statica e completa. Se questo file non si carica, lo script nel
   <head> rimuove .m al termine del caricamento della pagina (evento load, massimo 12 s): nessun contenuto
   resta nascosto. R4.1: prima il limite era fisso a 2,5 s e sulle connessioni mobili lente disattivava
   tutte le animazioni anche quando questo file arrivava regolarmente. */
(function () {
  'use strict';
  var d = document, h = d.documentElement, w = window;
  w.__fntMotion = true;
  if (!('IntersectionObserver' in w)) return;

  /* 1 · Animazioni continue: ferme fuori viewport e con la scheda nascosta */
  var loopIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('is-offscreen', !e.isIntersecting); });
  });
  Array.prototype.forEach.call(d.querySelectorAll('.hero-18, .dot'), function (el) { loopIO.observe(el); });
  var syncTab = function () { h.classList.toggle('is-tab-hidden', d.hidden); };
  d.addEventListener('visibilitychange', syncTab); syncTab();

  if (!h.classList.contains('m')) return;

  /* 2 · Scene */
  var SEL = '.reveal, .hero-18, .proposta-1, .ref-photo, .ref-body > *, .ref-bio > p, .ref-facts, .modulo-3 > *, .modulo-14';
  var items = d.querySelectorAll(SEL);
  var show = function (el) { el.classList.add('is-in'); io.unobserve(el); };
  var io = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting; })
      .sort(function (a, b) { return (a.boundingClientRect.top - b.boundingClientRect.top) || (a.boundingClientRect.left - b.boundingClientRect.left); });
    batch.forEach(function (e, i) {
      e.target.style.setProperty('--m-d', Math.min(i * 0.09, 0.45).toFixed(2) + 's');
      show(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
  Array.prototype.forEach.call(items, function (el) { io.observe(el); });

  /* Il focus da tastiera rende subito visibile tutto ciò che contiene l'elemento */
  d.addEventListener('focusin', function (ev) {
    for (var el = ev.target; el && el !== d.body; el = el.parentElement) {
      if (el.matches && el.matches(SEL) && !el.classList.contains('is-in')) { el.classList.add('m-now'); show(el); }
    }
  });
  /* Stampa: tutto visibile */
  w.addEventListener('beforeprint', function () { Array.prototype.forEach.call(items, show); });

  /* 3 · Profondità: solo desktop con puntatore preciso */
  if (!w.matchMedia('(min-width: 901px) and (pointer: fine)').matches) return;
  var layers = [
    { el: d.querySelector('.hero-19'), k: -36 },  /* il visual sale più lentamente del testo */
    { el: d.querySelector('.listen'), k: 70 }      /* le onde scorrono dietro il contenuto */
  ].filter(function (l) { return l.el; });
  var visible = new Set();
  var parIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    queue();
  });
  layers.forEach(function (l) { parIO.observe(l.el.parentElement); });
  var ticking = false;
  var update = function () {
    ticking = false;
    var vh = w.innerHeight;
    var reads = layers.map(function (l) {
      if (!visible.has(l.el.parentElement)) return null;
      var r = l.el.parentElement.getBoundingClientRect();
      return ((r.top + r.height / 2) - vh / 2) / vh;
    });
    layers.forEach(function (l, i) {
      if (reads[i] === null) return;
      var p = Math.max(-1, Math.min(1, reads[i]));
      l.el.style.transform = 'translate3d(0,' + (p * l.k).toFixed(1) + 'px,0)';
    });
  };
  var queue = function () { if (!ticking) { ticking = true; w.requestAnimationFrame(update); } };
  w.addEventListener('scroll', queue, { passive: true });
  w.addEventListener('resize', queue);
  queue();

  var hero = d.querySelector('.hero-1');
  if (hero) {
    var px = 0, py = 0, pending = false;
    hero.addEventListener('pointermove', function (ev) {
      var r = hero.getBoundingClientRect();
      px = ((ev.clientX - r.left) / r.width - 0.5) * 2;
      py = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      if (!pending) {
        pending = true;
        w.requestAnimationFrame(function () {
          pending = false;
          hero.style.setProperty('--mx', px.toFixed(3));
          hero.style.setProperty('--my', py.toFixed(3));
        });
      }
    });
    hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mx', '0'); hero.style.setProperty('--my', '0'); });
  }
})();
