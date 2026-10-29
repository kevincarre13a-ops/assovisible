(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function load(f) { return fetch('data/' + f).then(function (r) { return r.json(); }); }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; }
  }
  function eur(n) { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); }

  /* Menu mobile */
  var burger = $('.burger'), nav = $('.nav');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
    });
  }

  /* Apparition douce */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function watch() { $$('.reveal:not(.in)').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); }); }

  /* Compte à rebours */
  function countdown(el, iso) {
    var t = new Date(iso).getTime();
    function tick() {
      var d = Math.max(0, t - Date.now()), s = Math.floor(d / 1000);
      var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      var l = ['jours', 'heures', 'minutes', 'secondes'];
      el.innerHTML = v.map(function (x, i) { return '<div><b>' + x + '</b><span>' + l[i] + '</span></div>'; }).join('');
    }
    tick(); if (!reduce) setInterval(tick, 1000);
  }

  function eventCard(ev) {
    return '<article class="card reveal"><span class="tag">' + esc(ev.type || 'Événement') + '</span><h3>' + esc(ev.titre) + '</h3>' +
      '<p><strong>' + esc(ev.date ? fmtDate(ev.date) : (ev.dateTexte || 'Date à annoncer')) + '</strong><br>' + esc(ev.lieu) + '</p>' +
      '<p>' + esc(ev.description) + '</p>' + (ev.lien ? '<a class="more" href="' + esc(ev.lien) + '" rel="noopener">En savoir plus</a>' : '') + '</article>';
  }

  /* Compteurs animés */
  function animateCount(el, target) {
    if (reduce) { el.textContent = target; return; }
    var t0 = null;
    function step(ts) { t0 = t0 || ts; var p = Math.min((ts - t0) / 1400, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }

  var tasks = [];

  var next = $('#next-event');
  if (next) tasks.push(load('events.json').then(function (d) {
    var ev = (d.upcoming || [])[0];
    if (!ev) { next.innerHTML = '<p>Aucun événement programmé pour le moment.</p>'; return; }
    next.innerHTML = '<div><span class="tag">' + esc(ev.type || 'À venir') + '</span><h2>' + esc(ev.titre) + '</h2><p><strong>' +
      esc(ev.date ? fmtDate(ev.date) : (ev.dateTexte || 'Date à annoncer')) + '</strong><br>' + esc(ev.lieu) + '</p><p>' + esc(ev.description) +
      '</p><div class="actions"><a class="btn btn-sun" href="evenements.html">Tous les événements</a></div></div><div id="cd" aria-live="off"></div>';
    var cd = $('#cd', next);
    if (ev.date && new Date(ev.date) > new Date()) { cd.className = 'countdown'; countdown(cd, ev.date); }
    else cd.innerHTML = '<div class="countdown-wait">⏳ Compte à rebours dès que la date sera confirmée.</div>';
  }));

  var evUp = $('#events-upcoming'), evArc = $('#events-archive');
  if (evUp) tasks.push(load('events.json').then(function (d) {
    evUp.innerHTML = (d.upcoming || []).map(eventCard).join('') || '<p>Aucun événement programmé pour le moment.</p>';
    evArc.innerHTML = (d.archive || []).map(eventCard).join('') ||
      '<div class="card wait"><h3>Archives à venir</h3><p>Les éditions passées (tournois, repas, lotos, courses, marchés, concerts, vide-greniers…) seront présentées ici, avec leurs dates et leurs résultats, dès que l\'association les aura renseignées.</p></div>';
  }));

  var newsEl = $('#news-list');
  if (newsEl) tasks.push(load('news.json').then(function (d) {
    var n = +(newsEl.getAttribute('data-limit') || 99);
    newsEl.innerHTML = (d.items || []).slice(0, n).map(function (it) {
      return '<article class="card reveal"><span class="tag">' + esc(it.tag || 'Actualité') + '</span><h3>' + esc(it.titre) + '</h3>' +
        (it.date ? '<p class="note">' + esc(fmtDate(it.date)) + '</p>' : '') + '<p>' + esc(it.texte) + '</p></article>';
    }).join('');
  }));

  var partEl = $('#partners-list');
  if (partEl) tasks.push(load('partners.json').then(function (d) {
    var list = d.partenaires || [];
    if (!list.length) { partEl.innerHTML = '<div class="card wait partner" style="grid-column:1/-1"><p>' + esc(d.textePlaceholder) + '</p></div>'; return; }
    partEl.innerHTML = list.map(function (p) {
      var inner = p.logo ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.nom) + '" loading="lazy" style="max-height:80px;margin:auto">' : '<strong>' + esc(p.nom) + '</strong>';
      return '<div class="card partner reveal">' + (p.url ? '<a href="' + esc(p.url) + '" rel="noopener">' + inner + '</a>' : inner) + '</div>';
    }).join('');
  }));

  var galEl = $('#gallery-list');
  if (galEl) tasks.push(load('gallery.json').then(function (d) {
    galEl.innerHTML = (d.albums || []).map(function (a) {
      var ph = (a.photos || []).map(function (p) { return '<figure class="card" style="padding:10px;margin:0"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || '') + '" loading="lazy" style="border-radius:14px"></figure>'; }).join('');
      return '<section class="reveal" style="padding:24px 0"><h2>' + esc(a.titre) + '</h2><p class="lead">' + esc(a.description) + '</p>' +
        (ph ? '<div class="grid g3">' + ph + '</div>' : '<div class="grid g3"><div class="card wait art" style="min-height:180px;font-size:2.6rem;box-shadow:none;border:2px dashed var(--line)">📷<span class="note" style="font-size:1rem">Photos à ajouter</span></div></div>') + '</section>';
    }).join('');
  }));

  var stats = $('#stats-section') || $('#progress-box');
  if (stats) tasks.push(load('stats.json').then(function (d) {
    var box = $('#progress-box');
    if (box) {
      var c = d.collecte || {}, hasAll = c.montant != null && c.objectif;
      var pct = hasAll ? Math.min(100, Math.round(c.montant / c.objectif * 100)) : 0;
      box.innerHTML = '<h3>' + esc(c.libelle || 'Collecte en cours') + '</h3>' +
        '<div class="bar" role="progressbar" aria-label="Progression de la collecte" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i></i></div>' +
        (hasAll ? '<div class="amounts"><span>' + eur(c.montant) + ' collectés</span><span>Objectif : ' + eur(c.objectif) + '</span></div>'
                : '<p class="todo">' + esc(c.textePlaceholder) + '</p>');
      var fill = $('.bar i', box); setTimeout(function () { fill.style.width = pct + '%'; }, 200);
    }
    var cEl = $('#counters');
    if (cEl) {
      cEl.innerHTML = (d.compteurs || []).map(function (k) {
        var v = k.valeur;
        if (k.depuis) { var ms = Date.now() - new Date(k.depuis).getTime(); v = Math.max(0, +(ms / 3.15576e10).toFixed(1)); }
        return '<div class="counter reveal">' + (v == null ? '<b aria-label="à renseigner">—</b><span>' + esc(k.label) + '</span><small>à renseigner</small>'
          : '<b data-count="' + v + '">0</b><span>' + esc(k.label) + '</span>') + '</div>';
      }).join('');
      $$('[data-count]', cEl).forEach(function (b) {
        var t = parseFloat(b.getAttribute('data-count')), once = false;
        var o = new IntersectionObserver(function (es) { es.forEach(function (e) {
          if (e.isIntersecting && !once) { once = true; if (t % 1) { b.textContent = String(t).replace('.', ','); } else animateCount(b, t); o.disconnect(); }
        }); }, { threshold: .4 });
        o.observe(b);
      });
    }
  }));

  var donBtn = $('#don-externe');
  if (donBtn) tasks.push(load('site.json').then(function (s) {
    if (s.donUrl) { donBtn.href = s.donUrl; donBtn.target = '_blank'; donBtn.rel = 'noopener'; }
    else { donBtn.removeAttribute('href'); donBtn.setAttribute('aria-disabled', 'true'); donBtn.style.opacity = .6; donBtn.style.cursor = 'not-allowed'; var w = $('#don-wait'); if (w) w.hidden = false; }
  }));

  $$('[data-site]').forEach(function () {});
  Promise.all(tasks).then(watch, watch);
  watch();
})();
