/* Gan Mémoire et Patrimoine — scripts communs (sans dépendance) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* --- Taille du texte (confort de lecture) --- */
  var fs = parseInt(store('gmp-fs') || '0', 10);
  if (fs > 0 && fs <= 2) root.setAttribute('data-fs', String(fs));
  $$('[data-fs-step]').forEach(function (b) {
    b.addEventListener('click', function () {
      var step = parseInt(b.getAttribute('data-fs-step'), 10);
      fs = step === 0 ? 0 : Math.max(0, Math.min(2, fs + step));
      if (fs === 0) root.removeAttribute('data-fs'); else root.setAttribute('data-fs', String(fs));
      store('gmp-fs', String(fs));
    });
  });

  /* --- Menu mobile --- */
  var burger = $('.burger'), nav = $('#menu');
  function closeNav() { if (!burger) return; burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); doc.body.classList.remove('nav-open'); burger.setAttribute('aria-label', 'Ouvrir le menu'); }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      doc.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeNav(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1400) closeNav(); });
  }

  /* --- En-tête, retour en haut, parallaxe légère --- */
  var header = $('.site-header'), toTop = $('.to-top'), heroBg = $('.hero-bg');
  function onScroll() {
    var y = window.pageYOffset || root.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 900);
    if (heroBg && !reduce && y < window.innerHeight) heroBg.style.transform = 'translate3d(0,' + (y * 0.25) + 'px,0)';
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* --- Apparition douce au défilement --- */
  var revealEls = $$('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('is-in'); }); }

  /* --- Compteurs --- */
  var counters = $$('[data-count]');
  function runCounter(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), dur = 1800, t0 = null;
    if (reduce) { el.textContent = end; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { runCounter(x.target); cio.unobserve(x.target); } }); }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* --- Comparaison avant / après --- */
  $$('[data-compare]').forEach(function (box) {
    var range = $('input[type=range]', box);
    function set(v) { box.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { set(range.value); });
    set(range.value);
    if (!reduce && 'IntersectionObserver' in window) {
      var played = false;
      new IntersectionObserver(function (en, ob) {
        if (en[0].isIntersecting && !played) {
          played = true; ob.disconnect();
          var from = 92, to = 50, t0 = null;
          (function anim(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - p, 3); var v = from + (to - from) * e; range.value = v; set(v); if (p < 1) requestAnimationFrame(anim); })(performance.now());
        }
      }, { threshold: 0.5 }).observe(box);
    }
  });

  /* --- Frise chronologique interactive --- */
  var tlData = $('#tl-data');
  if (tlData) {
    var items = JSON.parse(tlData.textContent), track = $('.tl-track'), panel = $('.tl-panel'), cur = 0, btns = [];
    var prev = $('#tl-prev'), next = $('#tl-next'), count = $('#tl-count');
    items.forEach(function (it, i) {
      var b = doc.createElement('button');
      b.type = 'button'; b.className = 'tl-item'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', 'false'); b.setAttribute('aria-controls', 'tl-panel'); b.tabIndex = -1;
      b.innerHTML = '<span class="yr"></span><span class="dot"></span><span class="lbl"></span>';
      $('.yr', b).textContent = it.year; $('.lbl', b).textContent = it.label;
      b.addEventListener('click', function () { show(i, true); });
      track.appendChild(b); btns.push(b);
    });
    function esc(s) { var d = doc.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
    function show(i, scroll) {
      cur = (i + items.length) % items.length;
      var it = items[cur];
      btns.forEach(function (b, k) { b.setAttribute('aria-selected', k === cur ? 'true' : 'false'); b.tabIndex = k === cur ? 0 : -1; });
      var img = it.img ? '<figure><img src="' + esc(it.img) + '" alt="' + esc(it.alt || '') + '" loading="lazy"><figcaption>' + esc(it.cap || '') + '</figcaption></figure>' : '';
      panel.className = 'tl-panel' + (it.img ? '' : ' no-img');
      panel.innerHTML = '<div><span class="tl-year">' + esc(it.year) + '</span><h3>' + esc(it.title) + '</h3><p>' + esc(it.text) + '</p>' +
        (it.href ? '<p><a class="link-arrow" href="' + esc(it.href) + '" target="_blank" rel="noopener">Lire la fiche complète sur le site de l’association <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>' : '') +
        (it.src ? '<p class="small">Source : ' + esc(it.src) + '</p>' : '') + '</div>' + img;
      if (!reduce) { panel.classList.add('is-anim'); }
      if (count) count.textContent = (cur + 1) + ' / ' + items.length;
      if (scroll && btns[cur].scrollIntoView) {
        var tr = track.getBoundingClientRect(), br = btns[cur].getBoundingClientRect();
        track.scrollTo({ left: track.scrollLeft + (br.left - tr.left) - (tr.width / 2) + (br.width / 2), behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    track.setAttribute('role', 'tablist');
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); btns[cur].focus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); btns[cur].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); btns[cur].focus(); }
      else if (e.key === 'End') { e.preventDefault(); show(items.length - 1, true); btns[cur].focus(); }
    });
    if (prev) prev.addEventListener('click', function () { show(cur - 1, true); });
    if (next) next.addEventListener('click', function () { show(cur + 1, true); });
    show(0, false);
  }

  /* --- Galerie : filtres + visionneuse --- */
  var galChips = $$('[data-gal-filter]');
  if (galChips.length) {
    var groups = $$('.gal-group');
    galChips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-gal-filter');
        galChips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        groups.forEach(function (g) { g.hidden = !(f === 'all' || g.getAttribute('data-type') === f); });
      });
    });
    var lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-cap'), list = [], idx = 0;
    var thumbs = $$('.gal-item');
    function openAt(i) {
      list = thumbs.filter(function (t) { return !t.closest('.gal-group').hidden; });
      idx = list.indexOf(thumbs[i]); if (idx < 0) idx = 0; paint();
      if (typeof lb.showModal === 'function') { if (!lb.open) lb.showModal(); } else { lb.setAttribute('open', ''); }
    }
    function paint() {
      var t = list[idx]; lbImg.src = t.getAttribute('data-full'); lbImg.alt = t.getAttribute('data-alt') || '';
      lbCap.innerHTML = ''; var p = doc.createElement('span'); p.textContent = t.getAttribute('data-cap') || ''; lbCap.appendChild(p);
      var s = doc.createElement('small'); s.textContent = t.getAttribute('data-credit') || ''; lbCap.appendChild(s);
    }
    function move(d) { idx = (idx + d + list.length) % list.length; paint(); }
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { openAt(i); }); });
    $('.lb-close').addEventListener('click', function () { lb.close ? lb.close() : lb.removeAttribute('open'); });
    $('.lb-prev').addEventListener('click', function () { move(-1); });
    $('.lb-next').addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-inner')) { lb.close(); } });
    lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') move(-1); if (e.key === 'ArrowRight') move(1); });
  }

  /* --- Programme : état à venir / passé + filtres --- */
  var evs = $$('.ev');
  if (evs.length) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    evs.forEach(function (ev) {
      var d = ev.getAttribute('data-date'), y = ev.getAttribute('data-year'), st = 'past';
      if (d) st = new Date(d + 'T23:59:59') >= now ? 'upcoming' : 'past';
      else if (y) st = parseInt(y, 10) > now.getFullYear() ? 'upcoming' : 'past';
      ev.setAttribute('data-state', st);
    });
    var up = evs.filter(function (e) { return e.getAttribute('data-state') === 'upcoming'; });
    var upBox = $('#upcoming-count'); if (upBox) upBox.textContent = up.length ? '' : 'Aucun rendez-vous daté n’est encore annoncé : consultez la rubrique « À venir » plus bas ou écrivez-nous.';
    var chips = $$('[data-ev-filter]');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-ev-filter');
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        evs.forEach(function (e) { e.hidden = !(f === 'all' || e.getAttribute('data-kind') === f); });
        $$('.year-block').forEach(function (b) { b.hidden = !$$('.ev', b).some(function (e) { return !e.hidden; }); });
      });
    });
  }

  /* --- Formulaire de contact (Netlify Forms, envoi sans rechargement) --- */
  var form = $('#contact-form');
  if (form && window.fetch) {
    var status = $('#form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('button[type=submit]', form); btn.disabled = true; status.className = 'form-status'; status.textContent = '';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); status.className = 'form-status ok'; status.textContent = 'Merci ! Votre message a bien été transmis. L’association vous répondra dès que possible.'; })
        .catch(function () { status.className = 'form-status err'; status.innerHTML = 'Désolé, l’envoi n’a pas abouti. Vous pouvez nous écrire directement à <a href="mailto:daniel.trallero@orange.fr">daniel.trallero@orange.fr</a>.'; })
        .then(function () { btn.disabled = false; status.focus && status.focus(); });
    });
  }
})();
