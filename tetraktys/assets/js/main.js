/* Tetraktys — comportements communs (sans dépendance) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var todayISO = (function () { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); })();

  /* ---------- en-tête : état au défilement + burger ---------- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('.burger'), nav = $('#nav');
  function setNav(open) {
    if (!burger || !nav) return;
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    doc.body.classList.toggle('nav-open', open);
  }
  if (burger) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020) setNav(false); });
  }

  /* ---------- apparition au défilement ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('.reveal,.reveal-l,.reveal-r').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- compteurs animés ---------- */
  function runCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), dur = 1800, t0 = null;
    if (reduce) { el.textContent = end; return; }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = io && new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { cio ? cio.observe(el) : (el.textContent = el.getAttribute('data-count')); });

  /* ---------- parallaxe légère des bandeaux ---------- */
  var pbg = $('.page-hero-bg');
  if (pbg && !reduce) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY; if (y < 900) pbg.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
    }, { passive: true });
  }

  /* ---------- prochain rendez-vous (accueil) ---------- */
  var nextBox = $('#next-card');
  if (nextBox && window.TK_EVENTS) {
    var up = window.TK_EVENTS.filter(function (e) { return e.date >= todayISO; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
    if (up) {
      var d = new Date(up.date + 'T12:00:00');
      nextBox.innerHTML =
        '<div class="next-date"><b>' + d.getDate() + '</b><span>' + MOIS[d.getMonth()] + ' ' + d.getFullYear() + '</span></div>' +
        '<div><p class="eyebrow">Prochain rendez-vous</p><h2>' + up.title + '</h2><p>' + up.when + ' · ' + up.place + '</p></div>' +
        '<a class="btn btn-gold" href="agenda.html">Voir l\'agenda</a>';
    }
  }

  /* ---------- agenda : à venir / archives ---------- */
  var upList = $('#upcoming-list');
  if (upList) {
    var events = $$('.event[data-date]');
    var ups = events.filter(function (e) { return e.getAttribute('data-date') >= todayISO; })
      .sort(function (a, b) { return a.getAttribute('data-date') < b.getAttribute('data-date') ? -1 : 1; });
    ups.forEach(function (e) { upList.appendChild(e); });
    var empty = $('#upcoming-empty');
    if (empty) empty.hidden = ups.length > 0;
    var tabs = $$('.tabs button[data-year]'), arch = $$('#archives .event');
    function showYear(y) {
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-year') === y ? 'true' : 'false'); });
      arch.forEach(function (e) { e.hidden = e.getAttribute('data-year') !== y; });
    }
    tabs.forEach(function (b) { b.addEventListener('click', function () { showYear(b.getAttribute('data-year')); }); });
    if (tabs.length) showYear(tabs[0].getAttribute('data-year'));
  }

  /* ---------- tétraktys interactive ---------- */
  var lab = $('#tk-lab');
  if (lab) {
    var dots = $$('.tk-dot', lab), out = $('#tk-title'), txt = $('#tk-text'), btns = $$('.tk-ratios button', lab);
    var rows = {
      1: ['1 · Le point', 'L\'unité, l\'origine : un seul point, d\'où tout procède.'],
      2: ['2 · La ligne', 'Deux points déterminent une droite : la première relation, le premier intervalle.'],
      3: ['3 · La surface', 'Trois points dessinent un plan : la forme apparaît.'],
      4: ['4 · Le volume', 'Quatre points ouvrent l\'espace : le solide, le monde sensible.']
    };
    var ratios = {
      octave: { rows: [1, 2], f: 2, t: ['Octave · 2 : 1', 'Rangées 1 et 2 : deux fois plus aigu, la même note à un autre étage.'] },
      quinte: { rows: [2, 3], f: 1.5, t: ['Quinte · 3 : 2', 'Rangées 2 et 3 : l\'intervalle le plus pur après l\'octave.'] },
      quarte: { rows: [3, 4], f: 4 / 3, t: ['Quarte · 4 : 3', 'Rangées 3 et 4 : l\'accord qui lie la quinte à l\'octave.'] },
      double: { rows: [1, 4], f: 4, t: ['Double octave · 4 : 1', 'Rangées 1 et 4 : de l\'unité au solide, deux octaves d\'un seul souffle.'] }
    };
    var actx = null;
    function tone(freq, t0, dur) {
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    }
    function play(f) {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        if (actx.state === 'suspended') actx.resume();
        var t = actx.currentTime + 0.03, base = 220;
        tone(base, t, 1.5); tone(base * f, t, 1.5);
      } catch (e) { /* audio indisponible */ }
    }
    function clearOn() { dots.forEach(function (d) { d.classList.remove('on'); }); btns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); }
    function showRow(r) {
      clearOn();
      dots.forEach(function (d) { if (+d.getAttribute('data-row') === r) d.classList.add('on'); });
      out.textContent = rows[r][0]; txt.textContent = rows[r][1];
    }
    dots.forEach(function (d) {
      var go = function () { showRow(+d.getAttribute('data-row')); };
      d.addEventListener('click', go); d.addEventListener('mouseenter', go); d.addEventListener('focus', go);
      d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var r = ratios[b.getAttribute('data-r')]; clearOn();
        b.setAttribute('aria-pressed', 'true');
        dots.forEach(function (d) { if (r.rows.indexOf(+d.getAttribute('data-row')) > -1) d.classList.add('on'); });
        out.textContent = r.t[0]; txt.textContent = r.t[1]; play(r.f);
      });
    });
  }

  /* ---------- galerie : filtres + visionneuse ---------- */
  var shots = $$('.shot');
  if (shots.length) {
    var fbtns = $$('.filters button');
    fbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.getAttribute('data-cat');
        fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        shots.forEach(function (s) { s.classList.toggle('hide', c !== 'all' && s.getAttribute('data-cat') !== c); });
      });
    });
    var lb = $('#lightbox'), lbi = $('img', lb), lbc = $('p', lb), cur = 0, last = null;
    var vis = function () { return shots.filter(function (s) { return !s.classList.contains('hide'); }); };
    function open(i) {
      var v = vis(); cur = (i + v.length) % v.length; var s = v[cur];
      lbi.src = s.getAttribute('data-full'); lbi.alt = s.getAttribute('data-alt') || '';
      lbc.textContent = s.getAttribute('data-cap') || '';
      lb.classList.add('open'); doc.body.style.overflow = 'hidden';
    }
    function close() { lb.classList.remove('open'); doc.body.style.overflow = ''; if (last) last.focus(); }
    shots.forEach(function (s) { s.addEventListener('click', function () { last = s; open(vis().indexOf(s)); $('.lb-close', lb).focus(); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { open(cur - 1); });
    $('.lb-next', lb).addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') open(cur - 1); if (e.key === 'ArrowRight') open(cur + 1);
    });
  }

  /* ---------- héro : les dix points se déploient puis forment le nom ---------- */
  var hero = $('.hero');
  if (hero) {
    var canvas = $('#hero-canvas'), ctx = canvas.getContext('2d');
    var done = false, raf = 0;
    var finish = function () {
      if (done) return; done = true; cancelAnimationFrame(raf);
      hero.classList.add('ready');
      canvas.style.transition = 'opacity 1.4s'; canvas.style.opacity = '0';
    };
    if (reduce) { finish(); }
    else {
      var start = function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2), W = hero.clientWidth, H = hero.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var hr = hero.getBoundingClientRect();
        var slot = $('.hero-tk', hero).getBoundingClientRect(), h1 = $('.hero h1').getBoundingClientRect();
        var cs = getComputedStyle($('.hero h1')), fs = parseFloat(cs.fontSize);
        var sc = slot.width / 120, ox = slot.left - hr.left, oy = slot.top - hr.top;
        var layout = [[60, 6], [42, 36], [78, 36], [24, 66], [60, 66], [96, 66], [6, 96], [42, 96], [78, 96], [114, 96]];
        var anchors = layout.map(function (p, i) {
          var a = Math.random() * Math.PI * 2, r = Math.max(W, H) * (0.35 + Math.random() * 0.3);
          return { sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r, tx: ox + p[0] * sc, ty: oy + p[1] * sc + 3 * sc, d: i * 0.09 };
        });
        /* échantillonnage du nom */
        var off = document.createElement('canvas'), oc = off.getContext('2d'), word = 'TETRAKTYS', sp = fs * 0.14;
        off.width = Math.ceil(W); off.height = Math.ceil(H);
        oc.font = cs.fontWeight + ' ' + fs + 'px ' + cs.fontFamily; oc.fillStyle = '#fff';
        var widths = word.split('').map(function (c) { return oc.measureText(c).width; });
        var total = widths.reduce(function (a, b) { return a + b; }, 0) + sp * (word.length - 1);
        var m = oc.measureText('H'), fa = m.fontBoundingBoxAscent || fs * 0.9, fd = m.fontBoundingBoxDescent || fs * 0.3;
        var baseY = (h1.top - hr.top) + (h1.height - (fa + fd)) / 2 + fa;
        var x = (h1.left - hr.left) + h1.width / 2 - total / 2 + sp * 0;
        word.split('').forEach(function (c, i) { oc.fillText(c, x, baseY); x += widths[i] + sp; });
        var img = oc.getImageData(0, 0, off.width, off.height).data, pts = [];
        var step = Math.max(3, Math.round(fs / 22 * (W < 700 ? 1.25 : 1)));
        for (var yy = 0; yy < off.height; yy += step) for (var xx = 0; xx < off.width; xx += step) {
          if (img[(yy * off.width + xx) * 4 + 3] > 140) pts.push([xx, yy]);
        }
        var cap = W < 700 ? 520 : 1000; if (pts.length > cap) pts = pts.filter(function () { return Math.random() < cap / pts.length; });
        var minx = Infinity, maxx = -Infinity; pts.forEach(function (p) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); });
        var dust = pts.map(function (p) {
          return { x: Math.random() * W, y: Math.random() * H, tx: p[0], ty: p[1], d: 2.2 + ((p[0] - minx) / (maxx - minx || 1)) * 0.9 + Math.random() * 0.2, ph: Math.random() * 6.28, r: 0.9 + Math.random() * 1.1 };
        });
        var ease = function (t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); };
        var ease2 = function (t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
        var t0 = null, lines = [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5], [3, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 7], [7, 8], [8, 9]];
        var cur = anchors.map(function (a) { return { x: a.sx, y: a.sy }; });
        function frame(ts) {
          if (done) return; if (!t0) t0 = ts; var t = (ts - t0) / 1000;
          ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
          /* poussière d'or */
          dust.forEach(function (p) {
            var k = ease2((t - p.d) / 1.3), fx = p.x + Math.sin(t * 0.7 + p.ph) * 26, fy = p.y + Math.cos(t * 0.5 + p.ph) * 22;
            var px = fx + (p.tx - fx) * k, py = fy + (p.ty - fy) * k;
            var al = Math.min(1, t / 1.2) * (0.25 + 0.75 * k) * (0.75 + 0.25 * Math.sin(t * 5 + p.ph));
            ctx.fillStyle = 'rgba(240,215,150,' + al.toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(px, py, p.r * (1 + (1 - k) * 0.6), 0, 6.283); ctx.fill();
          });
          /* triangle : les dix points convergent */
          anchors.forEach(function (a, i) {
            var k = ease((t - 0.2 - a.d) / 1.5);
            cur[i].x = a.sx + (a.tx - a.sx) * k; cur[i].y = a.sy + (a.ty - a.sy) * k;
          });
          var la = Math.max(0, Math.min(1, (t - 1.9) / 0.8));
          if (la > 0) {
            ctx.strokeStyle = 'rgba(240,215,150,' + (la * 0.55).toFixed(3) + ')'; ctx.lineWidth = 1;
            lines.forEach(function (l) { ctx.beginPath(); ctx.moveTo(cur[l[0]].x, cur[l[0]].y); ctx.lineTo(cur[l[1]].x, cur[l[1]].y); ctx.stroke(); });
          }
          var fade = 1;
          cur.forEach(function (c, i) {
            var k = ease((t - 0.2 - anchors[i].d) / 1.5), r = (3 + 2 * k) * Math.max(1, sc * 0.9), pulse = 1 + 0.25 * Math.sin(t * 4 + i);
            var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r * 4 * pulse);
            g.addColorStop(0, 'rgba(255,240,200,' + (0.9 * fade).toFixed(3) + ')'); g.addColorStop(1, 'rgba(217,178,95,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, r * 4 * pulse, 0, 6.283); ctx.fill();
            ctx.fillStyle = 'rgba(217,178,95,' + fade.toFixed(3) + ')'; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.fill();
          });
          if (t > 4.9) finish();
          if (!done) raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
        window.addEventListener('resize', finish, { once: true });
        setTimeout(finish, 7000);
      };
      var go = function () { try { start(); } catch (e) { finish(); } };
      var ready = (doc.fonts && doc.fonts.ready) ? Promise.race([doc.fonts.ready, new Promise(function (r) { setTimeout(r, 1800); })]) : Promise.resolve();
      ready.then(function () { requestAnimationFrame(go); });
    }
  }
})();
