/* CLI Issoire — comportements du site (aucune dépendance) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- en-tête : compact au défilement ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-compact', window.scrollY > 90);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.querySelector('.burger__label').textContent = open ? 'Fermer' : 'Menu';
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('menu-open', open);
  }
  if (burger && menu) {
    menu.setAttribute('aria-hidden', 'true');
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1120) setMenu(false);
    });
  }

  /* ---------- apparition douce ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- compteurs animés ---------- */
  function fmt(n, plain) {
    return plain ? String(n) : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var plain = el.getAttribute('data-plain') === '1';
    if (reduce) { el.textContent = fmt(target, plain); return; }
    var start = null, dur = 1800;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased), plain);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = fmt(parseInt(el.getAttribute('data-count'), 10), el.getAttribute('data-plain') === '1'); });
  }

  /* ---------- filtre par activité (actualités et galerie) ---------- */
  function setupFilter(root) {
    var chips = [].slice.call(root.querySelectorAll('[data-filter]'));
    var items = [].slice.call(document.querySelectorAll(root.getAttribute('data-target')));
    var status = document.getElementById(root.getAttribute('data-status') || '');
    var empty = document.getElementById(root.getAttribute('data-empty') || '');
    function apply(slug, pushHash) {
      var shown = 0;
      items.forEach(function (it) {
        var ok = slug === 'tout' || it.getAttribute('data-activite') === slug;
        it.hidden = !ok;
        if (ok) { shown++; it.classList.add('in'); }
      });
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-filter') === slug ? 'true' : 'false');
      });
      if (status) status.textContent = shown + (shown > 1 ? ' éléments affichés' : ' élément affiché');
      if (empty) empty.hidden = shown !== 0;
      if (pushHash && history.replaceState) history.replaceState(null, '', slug === 'tout' ? location.pathname : '#' + slug);
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () { apply(c.getAttribute('data-filter'), true); });
    });
    var h = location.hash.replace('#', '');
    var known = chips.some(function (c) { return c.getAttribute('data-filter') === h; });
    apply(known ? h : 'tout', false);
  }
  [].slice.call(document.querySelectorAll('[data-filter-root]')).forEach(setupFilter);

  /* ---------- visionneuse photo ---------- */
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var current = 0, list = [];
    function show(i) {
      current = (i + list.length) % list.length;
      var b = list[current];
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = b.getAttribute('data-alt') || '';
      lbCap.textContent = b.getAttribute('data-alt') || '';
    }
    [].slice.call(document.querySelectorAll('.photo-btn')).forEach(function (b) {
      b.addEventListener('click', function () {
        list = [].slice.call(document.querySelectorAll('.masonry__item:not([hidden]) .photo-btn:not(.noimg)'));
        var i = list.indexOf(b);
        if (i < 0) return;
        show(i);
        lb.showModal();
      });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lightbox__inner')) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- formulaire : activité pré-sélectionnée ---------- */
  var sel = document.getElementById('f-activite');
  if (sel) {
    var m = /[?&]activite=([a-z0-9-]+)/.exec(location.search);
    if (m) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === m[1]) { sel.selectedIndex = i; break; }
      }
    }
  }
})();
