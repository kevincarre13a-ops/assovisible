/* Alternatif Concept — comportements communs (aucune dépendance) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- en-tête : devient plein au défilement ---- */
  var header = doc.querySelector('.site-header');
  var totop = doc.querySelector('.totop');
  var heroBg = doc.querySelector('.hero__bg, .page-hero__bg');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (totop) totop.classList.toggle('is-on', y > 700);
    if (heroBg && !reduce && y < window.innerHeight * 1.2) {
      heroBg.style.translate = '0 ' + (y * 0.18).toFixed(1) + 'px';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---- menu burger ---- */
  var burger = doc.querySelector('.burger');
  var nav = doc.getElementById('nav');
  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    doc.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && nav) {
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1060) setMenu(false); });
  }

  /* ---- apparition au défilement ---- */
  var revealEls = [].slice.call(doc.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- compteurs animés ---- */
  var counters = [].slice.call(doc.querySelectorAll('[data-count]'));
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = target; return; }
    var dur = 1600, start = null;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { co.observe(c); });
    } else {
      counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
    }
  }

  /* ---- galerie : filtres + visionneuse ---- */
  var gallery = doc.getElementById('gallery');
  if (gallery) {
    var figs = [].slice.call(gallery.querySelectorAll('figure'));
    var filterBtns = [].slice.call(doc.querySelectorAll('.filters button'));
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-filter');
        filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        figs.forEach(function (f) {
          var show = cat === 'all' || f.getAttribute('data-cat') === cat;
          f.hidden = !show;
          if (show) f.classList.add('is-in');
        });
        var live = doc.getElementById('gallery-count');
        if (live) live.textContent = figs.filter(function (f) { return !f.hidden; }).length + ' photo(s) affichée(s)';
      });
    });

    var lb = doc.getElementById('lightbox');
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var current = 0, lastFocus = null;
    function visible() { return figs.filter(function (f) { return !f.hidden; }); }
    function show(i) {
      var list = visible(); if (!list.length) return;
      current = (i + list.length) % list.length;
      var btn = list[current].querySelector('button');
      lbImg.src = btn.getAttribute('data-full');
      lbImg.alt = btn.getAttribute('data-alt') || '';
      lbCap.textContent = btn.getAttribute('data-cap') || '';
    }
    function open(fig) {
      lastFocus = doc.activeElement;
      show(visible().indexOf(fig));
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
      doc.body.style.overflow = 'hidden';
      lb.querySelector('.lb-x').focus();
    }
    function close() {
      lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
      doc.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    figs.forEach(function (f) { f.querySelector('button').addEventListener('click', function () { open(f); }); });
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.querySelector('.lb-p').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lb-n').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---- carte OpenStreetMap chargée seulement à la demande ---- */
  var mapBtn = doc.getElementById('load-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = doc.getElementById('map');
      var f = doc.createElement('iframe');
      f.title = 'Carte : Maison des Associations, impasse des Aires, Simiane-Collongue';
      f.loading = 'lazy';
      f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=5.4285%2C43.4285%2C5.4385%2C43.4345&layer=mapnik&marker=43.43143%2C5.43352';
      box.innerHTML = '';
      box.appendChild(f);
    });
  }

  /* ---- formulaire Netlify : envoi sans rechargement (repli : envoi classique) ---- */
  var form = doc.getElementById('contact-form');
  if (form && window.fetch) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = doc.getElementById('form-msg');
      var btn = form.querySelector('button[type=submit]');
      var data = new URLSearchParams(new FormData(form)).toString();
      btn.disabled = true; btn.style.opacity = '.7';
      msg.className = 'form-msg'; msg.textContent = '';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
        .then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          form.reset();
          msg.className = 'form-msg ok';
          msg.textContent = 'Merci ! Votre message est bien parti. Béatrice vous répondra très vite.';
          msg.setAttribute('tabindex', '-1'); msg.focus();
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.textContent = 'Oups, l’envoi n’a pas fonctionné. Vous pouvez nous écrire à beatrice.blancpetro@free.fr ou appeler le 06 86 16 01 98.';
        })
        .then(function () { btn.disabled = false; btn.style.opacity = ''; });
    });
  }
})();
