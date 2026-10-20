/* Association Yin Yang — interactions (aucune dépendance) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : état au défilement + menu burger */
  var header = d.querySelector('.site-header');
  var burger = d.querySelector('.burger');
  var nav = d.getElementById('menu');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    d.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width:1021px)').addEventListener('change', function () { setMenu(false); });
  }

  /* Apparition au défilement */
  var revealEls = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Compteurs animés */
  var counters = d.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1800, t0 = null;
    if (reduce) { el.textContent = target + suffix; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
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
      counters.forEach(function (c) { c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || ''); });
    }
  }

  /* Légère parallaxe du héros */
  var art = d.querySelector('.hero__art');
  if (art && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        art.querySelectorAll('[data-speed]').forEach(function (el) {
          el.style.setProperty('--py', (-y * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px');
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* Filtres génériques (puces) */
  function chipGroup(group, onChange) {
    var chips = group.querySelectorAll('.chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        onChange(chip.getAttribute('data-filter'));
      });
    });
  }

  /* Planning des cours */
  var table = d.getElementById('planning-table');
  if (table) {
    var state = { practice: 'all', moment: 'all' };
    var rows = table.querySelectorAll('tbody tr[data-practice]');
    var empty = d.getElementById('planning-empty');
    var apply = function () {
      var shown = 0;
      rows.forEach(function (r) {
        var ok = (state.practice === 'all' || r.getAttribute('data-practice').indexOf(state.practice) > -1) &&
                 (state.moment === 'all' || r.getAttribute('data-moment') === state.moment);
        r.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      table.hidden = shown === 0;
    };
    d.querySelectorAll('[data-group]').forEach(function (g) {
      chipGroup(g, function (v) { state[g.getAttribute('data-group')] = v; apply(); });
    });
  }

  /* Actualités : filtre par catégorie */
  var newsList = d.getElementById('news-list');
  if (newsList) {
    var cards = newsList.querySelectorAll('[data-cat]');
    var nf = d.querySelector('[data-group="news"]');
    if (nf) chipGroup(nf, function (v) {
      cards.forEach(function (c) { c.hidden = !(v === 'all' || c.getAttribute('data-cat') === v); });
    });
  }

  /* Galerie : filtre + visionneuse */
  var gallery = d.getElementById('gallery');
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery__item'));
    var gf = d.querySelector('[data-group="gallery"]');
    if (gf) chipGroup(gf, function (v) {
      items.forEach(function (it) { it.hidden = !(v === 'all' || it.getAttribute('data-cat').split(' ').indexOf(v) > -1); });
    });
    var dlg = d.getElementById('lightbox');
    var lbImg = dlg.querySelector('img');
    var lbCap = dlg.querySelector('.lightbox__cap');
    var idx = 0, lastFocus = null;
    var visible = function () { return items.filter(function (i) { return !i.hidden; }); };
    var show = function (list, i) {
      idx = (i + list.length) % list.length;
      var it = list[idx];
      lbImg.src = it.getAttribute('data-full');
      lbImg.alt = it.querySelector('img').alt;
      lbCap.textContent = it.getAttribute('data-caption');
    };
    items.forEach(function (it) {
      it.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); it.click(); }
      });
      it.addEventListener('click', function () {
        lastFocus = it;
        var list = visible();
        show(list, list.indexOf(it));
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      });
    });
    dlg.querySelector('.lightbox__prev').addEventListener('click', function () { show(visible(), idx - 1); });
    dlg.querySelector('.lightbox__next').addEventListener('click', function () { show(visible(), idx + 1); });
    dlg.querySelector('.lightbox__close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lightbox__inner')) dlg.close(); });
    dlg.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(visible(), idx - 1);
      if (e.key === 'ArrowRight') show(visible(), idx + 1);
    });
  }

  /* Carte : chargée au clic (pas de requête tierce avant) */
  var mapBtn = d.getElementById('load-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.closest('.map');
      var f = d.createElement('iframe');
      f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=5.9650%2C47.2250%2C6.0700%2C47.2650&layer=mapnik';
      f.title = 'Carte de Besançon (OpenStreetMap)';
      f.loading = 'lazy';
      box.innerHTML = '';
      box.appendChild(f);
    });
  }

  /* Année du pied de page */
  var y = d.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
