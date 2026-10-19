/* FNT · R4 — Hero allo scorrimento e frasi che si accendono parola per parola.
   Parte solo se il sistema di movimento R2 è attivo (classe .m). Nessuna dipendenza, nessun cookie. */
(function () {
  'use strict';
  var d = document, w = window, h = d.documentElement;
  if (!h.classList.contains('m') || !('IntersectionObserver' in w)) return;

  /* 1 · Frasi-manifesto: ogni parola in uno <span class="w">, il testo resta identico per gli screen reader */
  var statements = [];
  Array.prototype.forEach.call(d.querySelectorAll('[data-words]'), function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = d.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            var s = d.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    };
    walk(el);
    statements.push({ el: el, words: el.querySelectorAll('.w'), visible: false });
  });

  /* 2 · Hero */
  var hero = d.querySelector('.hx-b-wrap'), heroVisible = true;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.target === hero) heroVisible = e.isIntersecting;
      statements.forEach(function (s) { if (s.el === e.target) s.visible = e.isIntersecting; });
    });
    queue();
  });
  if (hero) io.observe(hero);
  statements.forEach(function (s) { io.observe(s.el); });

  var ticking = false;
  var update = function () {
    ticking = false;
    var vh = w.innerHeight;
    if (hero && heroVisible) {
      var r = hero.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      hero.style.setProperty('--hs', p.toFixed(3));
    }
    statements.forEach(function (s) {
      if (!s.visible) return;
      var r = s.el.getBoundingClientRect();
      // 0 quando la frase entra dal basso (85% dello schermo), 1 quando arriva al 40%
      var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (vh * 0.45)));
      var lit = Math.round(p * s.words.length);
      for (var i = 0; i < s.words.length; i++) s.words[i].classList.toggle('on', i < lit);
    });
  };
  var queue = function () { if (!ticking) { ticking = true; w.requestAnimationFrame(update); } };
  w.addEventListener('scroll', queue, { passive: true });
  w.addEventListener('resize', queue);
  w.addEventListener('beforeprint', function () { statements.forEach(function (s) { for (var i = 0; i < s.words.length; i++) s.words[i].classList.add('on'); }); });
  queue();
})();
