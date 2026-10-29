(function () {
  'use strict';
  var TZ = 'Europe/Paris';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var cache = {};
  function data(name) {
    if (!cache[name]) cache[name] = fetch('data/' + name + '.json').then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
    return cache[name];
  }
  var fmt = function (iso, opts) { return new Intl.DateTimeFormat('fr-FR', Object.assign({ timeZone: TZ }, opts)).format(new Date(iso)); };
  var evDate = function (e) { return e.date + 'T' + (e.time || '12:00') + ':00' + parisOffset(e.date); };
  function parisOffset(d) { // CET/CEST approximation based on EU rules
    var y = +d.slice(0, 4), lastSun = function (m) { var x = new Date(Date.UTC(y, m + 1, 0)); return x.getUTCDate() - x.getUTCDay(); };
    var s = Date.UTC(y, 2, lastSun(2)), e = Date.UTC(y, 9, lastSun(9)), t = Date.parse(d + 'T12:00:00Z');
    return t >= s && t < e ? '+02:00' : '+01:00';
  }
  var ICONS = {
    clef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 2 3 6 0 9s-3 6 0 8"/><path d="M9 17a3 3 0 1 0 3-3"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 22l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg>',
    wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8a2.5 2.5 0 1 1-2.5 2.5"/></svg>'
  };

  /* header / nav */
  var header = $('.site-header'), burger = $('.burger'), nav = $('#nav');
  function onScroll() { header.classList.toggle('solid', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* reveal */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  function reveal(root) { $$('.rv:not(.in)', root).forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); }); }

  /* counters */
  function counters(root) {
    $$('[data-count]', root).forEach(function (el) {
      var to = +el.dataset.count, suf = el.dataset.suffix || '';
      if (reduce || !io) { el.textContent = to + suf; return; }
      var obs = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; obs.disconnect();
        var t0 = performance.now(), dur = 1800;
        (function step(t) { var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = v + suf; if (p < 1) requestAnimationFrame(step); })(t0);
      }, { threshold: .5 });
      obs.observe(el);
    });
  }

  /* wind canvas: notes and leaves carried by the mistral */
  function wind(canvas) {
    var ctx = canvas.getContext('2d'), W, H, parts = [], glyphs = ['♪', '♫', '♩', '𝄞', '✦'];
    var colors = ['#e8cd8a', '#ffffff', '#7cc4ec', '#c9b8f0'];
    function size() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    function mk(init) {
      return { x: init ? Math.random() * W : -40, y: Math.random() * H, s: 14 + Math.random() * 26, v: .6 + Math.random() * 1.8, a: Math.random() * 6, w: .01 + Math.random() * .02, g: glyphs[Math.floor(Math.random() * glyphs.length)], c: colors[Math.floor(Math.random() * colors.length)], o: .25 + Math.random() * .5, leaf: Math.random() < .25 };
    }
    size(); window.addEventListener('resize', size);
    var n = Math.min(34, Math.round(W / 40)); for (var i = 0; i < n; i++) parts.push(mk(true));
    var run = true; document.addEventListener('visibilitychange', function () { run = !document.hidden; if (run) loop(); });
    function loop() {
      if (!run) return; ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p, i) {
        p.x += p.v; p.a += p.w; p.y += Math.sin(p.a * 3) * .7 - .08;
        if (p.x > W + 40) parts[i] = mk(false);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.a) * .6); ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
        if (p.leaf) { ctx.beginPath(); ctx.ellipse(0, 0, p.s * .5, p.s * .2, 0, 0, 6.3); ctx.fill(); }
        else { ctx.font = p.s + 'px serif'; ctx.fillText(p.g, 0, 0); }
        ctx.restore();
      });
      requestAnimationFrame(loop);
    }
    if (!reduce) loop();
  }
  $$('canvas.wind').forEach(wind);

  /* hero parallax */
  var bg = $('.hero .bg');
  if (bg && !reduce) window.addEventListener('scroll', function () { var y = window.scrollY; if (y < 1400) bg.style.transform = 'translate3d(0,' + (y * .25) + 'px,0)'; }, { passive: true });

  /* lightbox */
  var lb, lbItems = [], lbI = 0;
  function openLb(items, i) {
    lbItems = items; lbI = i;
    if (!lb) {
      lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<button class="x" aria-label="Fermer">×</button><button class="p" aria-label="Précédent">‹</button><img alt=""><button class="n" aria-label="Suivant">›</button><p></p>';
      document.body.appendChild(lb);
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target.className === 'x') closeLb(); });
      $('.p', lb).onclick = function () { show(lbI - 1); }; $('.n', lb).onclick = function () { show(lbI + 1); };
      document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') show(lbI - 1); if (e.key === 'ArrowRight') show(lbI + 1); });
    }
    show(i); lb.classList.add('open');
  }
  function show(i) { lbI = (i + lbItems.length) % lbItems.length; var it = lbItems[lbI]; $('img', lb).src = it.src; $('img', lb).alt = it.alt || ''; $('p', lb).textContent = it.alt || ''; var one = lbItems.length < 2; $('.p', lb).style.display = $('.n', lb).style.display = one ? 'none' : ''; }
  function closeLb() { lb.classList.remove('open'); }
  document.addEventListener('click', function (e) { var z = e.target.closest('[data-zoom]'); if (z) { e.preventDefault(); openLb([{ src: z.dataset.zoom, alt: z.getAttribute('alt') || z.dataset.alt || '' }], 0); } });

  /* renderers */
  function evCard(e, past) {
    var d = evDate(e), dt = new Date(d);
    var when = fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (e.time ? ' à ' + e.time.replace(':', ' h ') : '');
    return '<article class="ev rv' + (past ? ' past' : '') + '" data-tags="' + esc((e.tags || []).join(',')) + '">' +
      '<div class="d"><b>' + fmt(d, { day: 'numeric' }) + '</b><span>' + fmt(d, { month: 'short' }) + ' ' + dt.getUTCFullYear() + '</span></div>' +
      '<div class="body"><div><span class="tag">' + esc((e.tags || ['Concert'])[0]) + '</span><h3>' + esc(e.title) + '</h3>' +
      (e.subtitle ? '<p style="margin:0 0 .5rem;color:var(--muted)">' + esc(e.subtitle) + '</p>' : '') +
      '<ul class="meta"><li>' + esc(when) + '</li><li>' + esc(e.place) + '</li>' + (e.price ? '<li>' + esc(e.price) + '</li>' : '') + '</ul>' +
      '<p>' + esc(e.description || '') + '</p>' +
      (e.link ? '<a class="btn btn-dark" href="' + esc(e.link.url) + '" target="_blank" rel="noopener">' + esc(e.link.label) + '</a>' : '') + '</div>' +
      (e.image ? '<img src="' + esc(e.image) + '" alt="Affiche : ' + esc(e.title) + '" loading="lazy" data-zoom="' + esc(e.image) + '">' : '') + '</div></article>';
  }
  function newsCard(n) {
    var contain = /logo|affiche/.test(n.image || '');
    return '<article class="ncard rv"><div class="im' + (contain ? ' contain' : '') + '" role="img" aria-label="' + esc(n.title) + '" style="background-image:url(' + esc(n.image) + ')"></div><div class="bd"><span class="tag">' + esc(n.tag) + '</span><time datetime="' + n.date + '">' + fmt(n.date + 'T12:00:00Z', { day: 'numeric', month: 'long', year: 'numeric' }) + '</time><h3>' + esc(n.title) + '</h3><p>' + esc(n.text) + '</p></div></article>';
  }
  function actCard(a) {
    return '<article class="acard rv" tabindex="0"><div class="ico">' + (ICONS[a.icon] || ICONS.note) + '</div><h3>' + esc(a.title) + '</h3><p>' + esc(a.short) + '</p><div class="more"><p>' + esc(a.details) + '</p><dl>' +
      (a.when ? '<dt>Quand</dt><dd>' + esc(a.when) + '</dd>' : '') + (a.where ? '<dt>Où</dt><dd>' + esc(a.where) + '</dd>' : '') +
      (a.price ? '<dt>Tarif</dt><dd>' + (/à compléter/.test(a.price) ? '<span class="placeholder">' + esc(a.price) + '</span>' : esc(a.price)) + '</dd>' : '') + '</dl></div></article>';
  }
  var upcoming = function (list) { var now = Date.now(); return list.filter(function (e) { return Date.parse(evDate(e)) + 4 * 36e5 > now; }).sort(function (a, b) { return Date.parse(evDate(a)) - Date.parse(evDate(b)); }); };
  var past = function (list) { var u = upcoming(list).map(function (e) { return e.id; }); return list.filter(function (e) { return u.indexOf(e.id) < 0; }).sort(function (a, b) { return Date.parse(evDate(b)) - Date.parse(evDate(a)); }); };

  function on(sel, name, fn) { var el = $(sel); if (el) data(name).then(function (d) { fn(el, d); }); }
  on('#next-event', 'events', function (el, list) {
    var n = upcoming(list)[0];
    if (!n) { el.innerHTML = '<div class="wrap"><h2>Prochain rendez-vous</h2><p class="lead">Les prochaines dates seront annoncées prochainement.</p></div>'; return; }
    var target = Date.parse(evDate(n));
    var when = fmt(evDate(n), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (n.time ? ' à ' + n.time.replace(':', ' h ') : '');
    el.innerHTML = '<div class="wrap next-grid"><div class="rv"><span class="eyebrow">Prochain rendez-vous</span><h2>' + esc(n.title) + '</h2><p style="opacity:.9;font-size:1.15rem">' + esc(n.subtitle || '') + '</p>' +
      '<div class="countdown" role="timer" aria-live="off"><div><b id="cd-d">0</b><span>jours</span></div><div><b id="cd-h">0</b><span>heures</span></div><div><b id="cd-m">0</b><span>minutes</span></div><div><b id="cd-s">0</b><span>secondes</span></div></div>' +
      '<ul class="meta"><li>' + esc(when) + '</li><li>' + esc(n.place) + '</li>' + (n.price ? '<li>' + esc(n.price) + '</li>' : '') + '</ul>' +
      '<div class="cta-row"><a class="btn btn-gold" href="agenda.html">Tout l\'agenda</a>' + (n.link ? '<a class="btn btn-line" target="_blank" rel="noopener" href="' + esc(n.link.url) + '">' + esc(n.link.label) + '</a>' : '') + '</div></div>' +
      (n.image ? '<img class="poster rv d2" src="' + esc(n.image) + '" alt="Affiche : ' + esc(n.title) + '" data-zoom="' + esc(n.image) + '">' : '') + '</div>';
    var set = function (id, v) { $('#' + id).textContent = v; };
    (function tick() {
      var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      set('cd-d', Math.floor(s / 86400)); set('cd-h', Math.floor(s % 86400 / 3600)); set('cd-m', Math.floor(s % 3600 / 60)); set('cd-s', s % 60);
      if (s > 0) setTimeout(tick, 1000);
    })();
    reveal(el);
  });

  on('#stats', 'site', function (el, s) {
    el.innerHTML = s.stats.map(function (x) { return '<div class="stat rv"><b data-count="' + x.value + '" data-suffix="' + esc(x.suffix) + '">0</b><span>' + esc(x.label) + '</span></div>'; }).join('');
    reveal(el); counters(el);
  });
  on('#home-news', 'news', function (el, l) { el.innerHTML = l.slice(0, 3).map(newsCard).join(''); reveal(el); });
  on('#news-list', 'news', function (el, l) { el.innerHTML = l.map(newsCard).join(''); reveal(el); });
  on('#activities-list', 'activities', function (el, l) { el.innerHTML = l.map(actCard).join(''); reveal(el); });
  on('#home-activities', 'activities', function (el, l) { el.innerHTML = l.slice(0, 3).map(actCard).join(''); reveal(el); });
  on('#events-upcoming', 'events', function (el, l) {
    var u = upcoming(l);
    el.innerHTML = u.length ? u.map(function (e) { return evCard(e, false); }).join('') : '<p class="note">Pas de date annoncée pour le moment. Suivez-nous sur Facebook ou écrivez-nous.</p>';
    reveal(el);
  });
  on('#events-archive', 'events', function (el, l) {
    var p = past(l), tags = {}; p.forEach(function (e) { (e.tags || []).forEach(function (t) { tags[t] = 1; }); });
    var f = $('#filters');
    if (f) { f.innerHTML = '<button class="chip" aria-pressed="true" data-t="">Tous</button>' + Object.keys(tags).map(function (t) { return '<button class="chip" aria-pressed="false" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join(''); }
    el.innerHTML = p.map(function (e) { return evCard(e, true); }).join(''); reveal(el);
    if (f) f.addEventListener('click', function (ev) {
      var b = ev.target.closest('.chip'); if (!b) return;
      $$('.chip', f).forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
      $$('.ev', el).forEach(function (c) { c.hidden = !!b.dataset.t && (c.dataset.tags || '').split(',').indexOf(b.dataset.t) < 0; });
    });
  });
  on('#gallery', 'gallery', function (el, albums) {
    var all = []; albums.forEach(function (a) { a.photos.forEach(function (p) { all.push({ src: p.src, alt: a.title + ' : ' + p.alt }); }); });
    var f = $('#gfilters');
    f.innerHTML = '<button class="chip" aria-pressed="true" data-a="">Tout</button>' + albums.map(function (a) { return '<button class="chip" aria-pressed="false" data-a="' + a.id + '">' + esc(a.title) + '</button>'; }).join('');
    function draw(id) {
      var set = albums.filter(function (a) { return !id || a.id === id; }), items = [], html = '';
      set.forEach(function (a) { html += '<h2 class="rv" style="margin:2.2rem 0 .3rem">' + esc(a.title) + '</h2><p class="rv" style="color:var(--muted);margin:0 0 1.2rem">' + esc(a.sub) + '</p><div class="masonry">';
        a.photos.forEach(function (p) { html += '<button class="rv" data-i="' + items.length + '" aria-label="Agrandir : ' + esc(p.alt) + '"><img src="' + esc(p.thumb) + '" alt="' + esc(p.alt) + '" loading="lazy"></button>'; items.push({ src: p.src, alt: a.title + ' : ' + p.alt }); });
        html += '</div>'; });
      el.innerHTML = html; el._items = items; reveal(el);
    }
    draw('');
    f.addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; $$('.chip', f).forEach(function (c) { c.setAttribute('aria-pressed', c === b); }); draw(b.dataset.a); });
    el.addEventListener('click', function (e) { var b = e.target.closest('button[data-i]'); if (b) openLb(el._items, +b.dataset.i); });
  });
  on('#team', 'team', function (el, t) {
    var P = function (p) { return '<div class="person"><i>' + esc(p.name.charAt(0)) + '</i><div><strong>' + esc(p.name) + '</strong><span>' + esc(p.role) + '</span></div></div>'; };
    el.innerHTML = '<div><h3>Direction musicale</h3><div class="grid">' + t.direction.map(P).join('') + '</div></div><div><h3>Bureau</h3><div class="grid">' + t.bureau.map(P).join('') + '<div class="person"><i>+</i><div><strong>Autres membres du bureau</strong><span class="placeholder">À compléter par l\'association</span></div></div></div></div><div><h3>Ils ont fait l\'histoire</h3><div class="grid">' + t.histoire.map(P).join('') + '</div></div>';
    var pa = $('#partners'); if (pa) pa.innerHTML = t.partenaires.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  });

  reveal(document); counters(document);
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
