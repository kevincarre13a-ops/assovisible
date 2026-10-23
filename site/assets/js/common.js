/* Club Photo de Morestel — fonctions communes (menu, apparitions, compteurs, visionneuse) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---- données JSON (dossier /data) ---- */
  const cache = {};
  const loadJSON = (name) => cache[name] || (cache[name] = fetch('data/' + name + '.json', { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error('Données introuvables : ' + name);
    return r.json();
  }));

  /* ---- dates ---- */
  const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const fmtLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const toDate = (iso) => new Date(iso + 'T00:00:00Z');
  const date = (iso) => (iso ? fmt.format(toDate(iso)) : '');
  const dateLong = (iso) => (iso ? fmtLong.format(toDate(iso)) : '');
  const todayISO = () => new Date().toISOString().slice(0, 10);

  /* ---- photos : une photo peut être un simple nom de fichier ou un objet {f,w,h,a,l} ---- */
  const ph = (p) => (typeof p === 'string' ? { f: p } : p);
  const photoSrc = (item, p, thumb) => {
    p = ph(p);
    const base = item.dossier.replace(/\/$/, '') + '/';
    return base + (thumb && item.vignettes ? p.f.replace(/\.(\w+)$/, '-t.$1') : p.f);
  };
  const plural = (n, one, many) => n + ' ' + (n > 1 ? many || one + 's' : one);

  /* ---- en-tête et menu ---- */
  const header = $('.site-header');
  const burger = $('.burger');
  const nav = $('#menu');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const setMenu = (open) => {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  };
  if (burger && nav) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 981px)').addEventListener('change', () => setMenu(false));
  }

  /* ---- animations d'apparition + compteurs ---- */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.dataset.to !== undefined) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }) : null;

  function countUp(el) {
    const to = parseFloat(el.dataset.to);
    const suffix = el.dataset.suffix || '';
    if (reduced || isNaN(to)) { el.textContent = to + suffix; return; }
    const t0 = performance.now(), dur = 1900;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e).toLocaleString('fr-FR') + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function observe(root) {
    $$('.reveal:not(.in), [data-to]:not(.in)', root || document).forEach((el, i) => {
      if (!io) { el.classList.add('in'); if (el.dataset.to !== undefined) countUp(el); return; }
      if (el.classList.contains('reveal') && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i % 6, 5) * 0.06 + 's');
      io.observe(el);
    });
  }

  /* ---- visionneuse plein écran ---- */
  const ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'
  };
  const lightbox = (() => {
    let el, img, count, cap, list = [], i = 0, lastFocus = null, startX = null;
    const build = () => {
      el = document.createElement('div');
      el.className = 'lb';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', 'Visionneuse de photos');
      el.innerHTML =
        '<div class="lb__bar"><span class="lb__count" aria-live="polite"></span><div class="lb__btns">' +
        '<button class="lb__btn" data-a="full" aria-label="Plein écran">' + ICON.full + '</button>' +
        '<button class="lb__btn" data-a="close" aria-label="Fermer la visionneuse">' + ICON.close + '</button></div></div>' +
        '<div class="lb__stage"><button class="lb__btn lb__nav lb__nav--prev" data-a="prev" aria-label="Photo précédente">' + ICON.prev + '</button>' +
        '<img alt=""><button class="lb__btn lb__nav lb__nav--next" data-a="next" aria-label="Photo suivante">' + ICON.next + '</button></div>' +
        '<div class="lb__cap"></div>';
      document.body.appendChild(el);
      img = $('img', el); count = $('.lb__count', el); cap = $('.lb__cap', el);
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-a]');
        if (b) return act(b.dataset.a);
        if (e.target === el || e.target.classList.contains('lb__stage')) close();
      });
      const stage = $('.lb__stage', el);
      stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
      stage.addEventListener('pointerup', (e) => {
        if (startX == null) return;
        const dx = e.clientX - startX; startX = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      });
      img.addEventListener('load', () => img.classList.remove('loading'));
      document.addEventListener('keydown', (e) => {
        if (!el.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') go(1);
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'Home') show(0);
        else if (e.key === 'End') show(list.length - 1);
        else if (e.key === 'Tab') {
          const f = $$('button', el).filter((b) => b.offsetParent !== null);
          if (!f.length) return;
          const first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    };
    const act = (a) => {
      if (a === 'close') close();
      else if (a === 'prev') go(-1);
      else if (a === 'next') go(1);
      else if (a === 'full') {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      }
    };
    const go = (d) => show((i + d + list.length) % list.length);
    const show = (n) => {
      i = n;
      const p = list[i];
      img.classList.add('loading');
      img.src = p.src;
      img.alt = p.alt || p.title || '';
      count.textContent = (i + 1) + ' / ' + list.length;
      cap.innerHTML = '<b>' + esc(p.title || '') + '</b><span>' + esc(p.sub || '') + '</span>' +
        (p.link ? ' <a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.linkLabel || 'Voir la suite ↗') + '</a>' : '');
      $$('.lb__nav', el).forEach((b) => { b.hidden = list.length < 2; });
      [1, -1].forEach((d) => { const q = list[(i + d + list.length) % list.length]; if (q) new Image().src = q.src; });
    };
    const open = (items, index) => {
      if (!items || !items.length) return;
      if (!el) build();
      list = items; lastFocus = document.activeElement;
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
      show(index || 0);
      $('[data-a="close"]', el).focus();
    };
    const close = () => {
      if (!el || !el.classList.contains('open')) return;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      el.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    return { open, close };
  })();

  /* ---- vignette de reportage / sortie (accueil + galerie) ---- */
  const authorNames = (ids, authors) => (ids || []).map((id) => (authors[id] ? authors[id].nom : id)).join(', ');
  const initials = (nom) => nom.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const avatar = (a) => '<span class="avatar">' + (a.portrait ? '<img src="' + esc(a.portrait) + '" alt="" loading="lazy">' : esc(initials(a.nom))) + '</span>';
  const itemTile = (item, kind, ctx, big) => {
    const cover = item.photos[item.couverture || 0] || item.photos[0];
    const cat = ctx.cats[item.categorie] || '';
    return '<a class="tile' + (big ? ' tile--big' : '') + '" href="galerie.html#/' + kind + '/' + encodeURIComponent(item.id) + '">' +
      '<img src="' + esc(photoSrc(item, cover, true)) + '" alt="" loading="lazy" decoding="async">' +
      (cat ? '<span class="tile__chip">' + esc(cat) + '</span>' : '') +
      '<span class="tile__cap"><span class="tile__title" style="display:block">' + esc(item.titre) + '</span>' +
      '<span class="tile__meta" style="display:block">' + esc(date(item.date)) + (item.auteurs && item.auteurs.length ? ' · ' + esc(authorNames(item.auteurs.slice(0, 3), ctx.authors)) + (item.auteurs.length > 3 ? '…' : '') : '') + '</span></span></a>';
  };

  /* ---- textes modifiables : data/club.json -> éléments data-bind (pied de page, appels à rejoindre…) ---- */
  loadJSON('club').then((c) => {
    const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), c);
    $$('[data-bind]').forEach((el) => { const v = get(el.dataset.bind); if (typeof v === 'string' && v) el.textContent = v; });
    $$('[data-bind-href]').forEach((el) => { const v = get(el.dataset.bindHref); if (v) el.href = 'mailto:' + v; });
    const ul = $('#footer-reseaux');
    if (ul && c.reseaux) ul.innerHTML = c.reseaux.map((r) => '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.nom) + '</a></li>').join('');
    const y = $('#annee'); if (y) y.textContent = new Date().getFullYear();
  }).catch(() => {});

  window.CPM = { $, $$, esc, loadJSON, date, dateLong, todayISO, ph, photoSrc, plural, observe, lightbox, ICON, itemTile, authorNames, avatar, initials };
  observe();
})();
