/* Quai Est — Biennale Koltès · comportements communs (aucune dépendance) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---- En-tête : fond au défilement ---- */
  var header = $('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menu burger + sous-menu ---- */
  var toggle = $('.nav-toggle'), nav = $('#nav');
  function closeNav() {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open');
    header.classList.remove('menu-open'); doc.body.style.overflow = '';
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open); header.classList.toggle('menu-open', open);
      doc.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  }
  $$('.has-sub').forEach(function (li) {
    var btn = $('.sub-btn', li);
    btn.addEventListener('click', function () {
      var o = !li.classList.contains('open');
      $$('.has-sub').forEach(function (x) { x.classList.remove('open'); $('.sub-btn', x).setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o));
    });
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeNav();
      $$('.has-sub.open').forEach(function (x) { x.classList.remove('open'); $('.sub-btn', x).setAttribute('aria-expanded', 'false'); });
      closeLightbox();
    }
  });
  doc.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) $$('.has-sub.open').forEach(function (x) { x.classList.remove('open'); $('.sub-btn', x).setAttribute('aria-expanded', 'false'); });
  });

  /* ---- Animation de texte (titre du héros) ---- */
  $$('[data-split]').forEach(function (el) {
    var txt = el.textContent, i = 0; el.setAttribute('aria-label', txt); el.textContent = '';
    txt.split('').forEach(function (ch) {
      var s = doc.createElement('span'); s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i++); s.textContent = ch === ' ' ? ' ' : ch; el.appendChild(s);
    });
    el.classList.add('split');
  });

  /* ---- Révélations au défilement ---- */
  var rv = $$('.rv, .rv-l');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el, i) { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i % 4) * 90 + 'ms'); io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- Compte à rebours (date indicative, modifiable : data-target) ---- */
  var cd = $('[data-countdown]');
  if (cd) {
    var target = new Date(cd.getAttribute('data-countdown')).getTime();
    var cells = { d: $('[data-u="d"]', cd), h: $('[data-u="h"]', cd), m: $('[data-u="m"]', cd), s: $('[data-u="s"]', cd) };
    var pad = function (n) { return n < 10 ? '0' + n : String(n); };
    var tick = function () {
      var t = Math.max(0, target - Date.now());
      cells.d.textContent = Math.floor(t / 864e5);
      cells.h.textContent = pad(Math.floor(t % 864e5 / 36e5));
      cells.m.textContent = pad(Math.floor(t % 36e5 / 6e4));
      cells.s.textContent = pad(Math.floor(t % 6e4 / 1e3));
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---- Frise chronologique interactive ---- */
  var tl = $('.timeline');
  if (tl) {
    var btns = $$('.tl-btn', tl), panels = $$('.tl-panel', tl), rail = $('.tl-rail', tl);
    var sel = function (i, scroll) {
      btns.forEach(function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.classList.toggle('active', k === i); p.hidden = k !== i; });
      if (scroll) btns[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      tl._i = i;
    };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { sel(i, true); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault(); var n = Math.min(btns.length - 1, Math.max(0, i + (e.key === 'ArrowRight' ? 1 : -1))); sel(n, true); btns[n].focus();
        }
      });
    });
    var prev = $('[data-tl="prev"]', tl.parentNode), next = $('[data-tl="next"]', tl.parentNode);
    if (prev) prev.addEventListener('click', function () { sel(Math.max(0, tl._i - 1), true); });
    if (next) next.addEventListener('click', function () { sel(Math.min(btns.length - 1, tl._i + 1), true); });
    sel(btns.length - 1, false);
    rail.scrollLeft = rail.scrollWidth;
  }

  /* ---- Carrousel d'affiches ---- */
  $$('.carousel').forEach(function (c) {
    var tr = $('.car-track', c);
    var step = function (d) { tr.scrollBy({ left: d * Math.max(260, tr.clientWidth * .6), behavior: reduce ? 'auto' : 'smooth' }); };
    var p = $('[data-car="prev"]', c.parentNode), n = $('[data-car="next"]', c.parentNode);
    if (p) p.addEventListener('click', function () { step(-1); });
    if (n) n.addEventListener('click', function () { step(1); });
    // glisser à la souris
    var down = false, sx = 0, sl = 0;
    tr.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = tr.scrollLeft; tr.style.scrollSnapType = 'none'; });
    window.addEventListener('pointerup', function () { if (down) { down = false; tr.style.scrollSnapType = ''; } });
    tr.addEventListener('pointermove', function (e) { if (down) { tr.scrollLeft = sl - (e.clientX - sx); } });
  });

  /* ---- Filtres de l'agenda ---- */
  var chips = $$('.chip[data-f]');
  if (chips.length) {
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        var f = c.getAttribute('data-f');
        $$('.ev').forEach(function (e) { e.hidden = !(f === 'all' || e.getAttribute('data-ed') === f); });
      });
    });
  }

  /* ---- Lightbox ---- */
  var lb = doc.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Agrandissement');
  lb.innerHTML = '<button class="round x" aria-label="Fermer">✕</button><img alt=""><p></p>';
  doc.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('p', lb), lastFocus = null;
  function closeLightbox() { if (lb.classList.contains('open')) { lb.classList.remove('open'); if (lastFocus) lastFocus.focus(); } }
  $$('[data-zoom]').forEach(function (b) {
    b.addEventListener('click', function () {
      lastFocus = b; lbImg.src = b.getAttribute('data-zoom'); lbImg.alt = b.getAttribute('data-alt') || ''; lbCap.textContent = b.getAttribute('data-alt') || '';
      lb.classList.add('open'); $('.x', lb).focus();
    });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('x')) closeLightbox(); });

  /* ---- Année du pied de page ---- */
  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();

/* ---- Carte à la demande (aucune requête tierce avant le clic) ---- */
(function () {
  var b = document.getElementById('map-btn');
  if (!b) return;
  b.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.className = 'map'; f.loading = 'lazy'; f.title = 'Carte : Maison des associations, 1 rue du Coëtlosquet, Metz';
    f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=6.1700%2C49.1125%2C6.1790%2C49.1180&layer=mapnik&marker=49.1152%2C6.1745';
    b.parentNode.replaceChild(f, b);
  });
})();
