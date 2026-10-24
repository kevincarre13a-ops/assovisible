/* ELSCSL — comportements communs + rendu des données (dossier /data) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function todo(v) { return v ? esc(v) : '<span class="todo">À compléter</span>'; }
  function getJSON(name) { return fetch('data/' + name + '.json').then(function (r) { if (!r.ok) throw new Error(name); return r.json(); }); }
  function parts(iso) { var p = iso.split('-'); return { y: +p[0], m: +p[1] - 1, d: +p[2] }; }

  /* en-tête : fond au défilement + menu burger */
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('solid', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  var toggle = $('.nav-toggle');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  $$('.site-nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1040) setMenu(false); });

  /* apparition douce */
  function observeReveal(root) {
    var els = $$('.reveal:not(.in)', root);
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e, i) { e.style.setProperty('--d', (i % 4) * 0.08 + 's'); io.observe(e); });
  }

  /* héro : parallaxe douce */
  var layers = $$('[data-speed]');
  if (layers.length && !reduce) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) layers.forEach(function (l) { l.style.transform = 'translate3d(0,' + (y * l.dataset.speed) + 'px,0)'; });
        tick = false;
      });
    }, { passive: true });
  }

  /* compteurs animés */
  function runCounters() {
    var els = $$('[data-count]');
    function go(el) {
      var end = +el.dataset.count, t0 = null, dur = 1600;
      if (reduce) { el.textContent = end; return; }
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * e);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(go); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { go(x.target); io.unobserve(x.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* données du club (héro photo, chiffres) */
  var club = null;
  function withClub(cb) {
    if (club) return cb(club);
    getJSON('club').then(function (c) { club = c; cb(c); }).catch(function () { });
  }

  var stats = $('#stats');
  if (stats) {
    withClub(function (c) {
      stats.innerHTML = c.chiffres.map(function (s) {
        return '<div class="stat reveal"><b data-count="' + esc(s.valeur) + '">0</b><span>' + esc(s.label) + '</span><small>' + esc(s.note) + '</small></div>';
      }).join('');
      observeReveal(stats); runCounters();
    });
  }
  var heroPhoto = $('.hero-photo');
  if (heroPhoto) withClub(function (c) {
    if (c.heroPhoto) { var img = new Image(); img.onload = function () { heroPhoto.style.backgroundImage = 'url("' + c.heroPhoto + '")'; heroPhoto.classList.add('on'); }; img.src = c.heroPhoto; }
  });

  /* prochain match + compte à rebours */
  var band = $('#next-match');
  if (band) {
    getJSON('matchs').then(function (m) {
      var n = m.prochainMatch, box = $('#cd-box'), title = $('#nm-title'), meta = $('#nm-meta');
      if (!n || !n.date) {
        title.textContent = 'Calendrier en cours de publication';
        meta.textContent = 'Les prochaines rencontres de l\'entente apparaîtront ici avec leur compte à rebours.';
        box.innerHTML = '<div class="cd-wait"><span class="pulse"></span>Date à confirmer</div>';
        return;
      }
      title.textContent = n.equipe + ' · ' + (n.domicile === false ? 'à ' : 'face à ') + n.adversaire;
      meta.textContent = (n.competition || '') + (n.lieu ? ' — ' + n.lieu : '');
      var target = new Date(n.date + 'T' + (n.heure || '15:00') + ':00');
      function render() {
        var s = Math.max(0, Math.floor((target - new Date()) / 1000));
        var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60], l = ['jours', 'heures', 'min', 'sec'];
        box.innerHTML = v.map(function (x, i) { return '<div class="cd"><b>' + String(x).padStart(2, '0') + '</b><span>' + l[i] + '</span></div>'; }).join('');
      }
      render(); setInterval(render, 1000);
    }).catch(function () { });
  }

  /* équipes : cartes qui se retournent */
  var teams = $('#teams');
  if (teams) {
    getJSON('equipes').then(function (d) {
      teams.innerHTML = d.groupes.map(function (g) {
        return '<div class="group reveal" id="' + esc(g.id) + '"><h2>' + esc(g.titre) + '</h2><p>' + esc(g.intro) + '</p><div class="grid c3">' +
          g.equipes.map(function (t) {
            return '<button class="team" type="button" aria-label="' + esc(t.nom) + ' : afficher les détails"><span class="team-in">' +
              '<span class="face front"><span><span class="cat">' + esc(t.categorie) + '</span></span><span><span class="nm">' + esc(t.nom) + '</span><br><span class="comp">' + esc(t.competition) + '</span><br><span class="hint">Survolez ou touchez</span></span></span>' +
              '<span class="face back"><dl><dt>Éducateur</dt><dd>' + todo(t.educateur) + '</dd><dt>Jours</dt><dd>' + todo(t.jours) + '</dd><dt>Horaires</dt><dd>' + todo(t.horaires) + '</dd><dt>Lieu</dt><dd>' + todo(t.lieu) + '</dd></dl></span>' +
              '</span></button>';
          }).join('') + '</div></div>';
      }).join('');
      $$('.team', teams).forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('flip'); }); });
      observeReveal(teams);
    }).catch(function () { teams.innerHTML = '<p class="notice">Données équipes indisponibles.</p>'; });
  }

  /* matchs & résultats */
  var fx = $('#fixtures');
  if (fx) {
    getJSON('matchs').then(function (m) {
      var today = new Date().toISOString().slice(0, 10), mode = 'tous';
      function draw() {
        var list = m.rencontres.filter(function (r) { return mode === 'tous' || (mode === 'avenir' ? r.date >= today : r.date < today); })
          .sort(function (a, b) { return mode === 'avenir' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date); });
        fx.innerHTML = list.length ? list.map(function (r) {
          var p = parts(r.date), past = r.date < today;
          return '<article class="fx reveal"><div class="fx-date"><b>' + p.d + '</b><span>' + MOIS[p.m] + ' ' + p.y + '</span></div>' +
            '<div><h3>' + esc(r.equipe) + ' · ' + (r.adversaire ? 'face à ' + esc(r.adversaire) : 'adversaire <span class="todo">à confirmer</span>') + '</h3><p>' + esc(r.competition) + '</p></div>' +
            '<span class="badge">' + (r.score ? esc(r.score) : (past ? 'Score à renseigner' : 'À venir')) + '</span></article>';
        }).join('') : '<p class="notice">Aucune rencontre dans cette vue pour le moment.</p>';
        observeReveal(fx);
      }
      $$('.tab').forEach(function (t) {
        t.addEventListener('click', function () {
          mode = t.dataset.mode; $$('.tab').forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); }); draw();
        });
      });
      draw();
      var c = m.classement, box = $('#classement');
      if (box) box.innerHTML = '<p>' + esc(c.texte) + '</p><p>' + c.liens.map(function (l) { return '<a class="btn btn-pitch" rel="noopener" target="_blank" href="' + esc(l.url) + '">' + esc(l.label) + '</a>'; }).join(' ') + '</p>';
    }).catch(function () { fx.innerHTML = '<p class="notice">Calendrier indisponible.</p>'; });
  }

  /* actualités */
  var news = $('#news');
  if (news) {
    getJSON('actualites').then(function (d) {
      var limit = +news.dataset.limit || 99, filter = news.dataset.type || '';
      var items = d.elements.filter(function (e) { return !filter || e.type === filter; }).slice(0, limit);
      news.innerHTML = items.map(function (e) {
        var date = '';
        if (e.date) { var p = parts(e.date); date = '<time datetime="' + esc(e.date) + '">' + p.d + ' ' + MOIS[p.m] + ' ' + p.y + '</time>'; }
        return '<article class="post reveal"><div class="post-top ' + (e.type === 'evenement' ? 'evt' : '') + '"><span class="badge">' + (e.type === 'evenement' ? 'Événement' : 'Actualité') + '</span></div>' +
          '<div class="post-body">' + date + '<h3>' + esc(e.titre) + '</h3><p>' + esc(e.extrait) + '</p>' + (e.attente ? '<p style="margin-top:10px"><span class="todo">Texte d\'attente</span></p>' : '') + '</div></article>';
      }).join('');
      observeReveal(news);
      var arc = $('#archives');
      if (arc) arc.innerHTML = d.archives.map(function (a) { return '<li><b>' + esc(a.annee) + '</b><br>' + esc(a.texte) + '</li>'; }).join('');
    }).catch(function () { news.innerHTML = '<p class="notice">Actualités indisponibles.</p>'; });
  }

  /* partenaires */
  var logos = $('#logos');
  if (logos) {
    getJSON('partenaires').then(function (d) {
      var n = $('#partner-intro'); if (n) n.textContent = d.intro;
      var html = d.partenaires.map(function (p) {
        var inner = p.logo ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.nom) + '" loading="lazy">' : esc(p.nom);
        return '<div class="logo-slot reveal">' + (p.url ? '<a href="' + esc(p.url) + '" rel="noopener" target="_blank">' + inner + '</a>' : inner) + '</div>';
      }).join('');
      var empty = Math.max(0, +logos.dataset.min - d.partenaires.length);
      for (var i = 0; i < empty; i++) html += '<div class="logo-slot reveal">Votre logo ici</div>';
      logos.innerHTML = html; observeReveal(logos);
    }).catch(function () { });
  }

  /* galerie + lightbox */
  var gal = $('#gallery');
  if (gal) {
    getJSON('galerie').then(function (d) {
      var cats = ['Tout'].concat(d.albums.map(function (a) { return a.titre; })), cur = 'Tout';
      var tabs = $('#gal-tabs');
      tabs.innerHTML = cats.map(function (c, i) { return '<button type="button" class="tab" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>'; }).join('');
      function draw() {
        var html = '';
        d.albums.forEach(function (a) {
          if (cur !== 'Tout' && cur !== a.titre) return;
          if (!a.photos.length) { for (var i = 0; i < 4; i++) html += '<div class="shot ph reveal" role="img" aria-label="Emplacement photo : ' + esc(a.titre) + '"><span>' + esc(a.titre) + '<br><small>Photo à venir</small></span></div>'; }
          a.photos.forEach(function (p) { html += '<button class="shot reveal" type="button" data-src="' + esc(p.src) + '"><img loading="lazy" src="' + esc(p.src) + '" alt="' + esc(p.alt || a.titre) + '"></button>'; });
        });
        gal.innerHTML = html; observeReveal(gal);
        $$('.shot[data-src]', gal).forEach(function (b) { b.addEventListener('click', function () { var lb = $('#lightbox'); $('img', lb).src = b.dataset.src; lb.classList.add('open'); }); });
      }
      $$('.tab', tabs).forEach(function (t, i) { t.addEventListener('click', function () { cur = cats[i]; $$('.tab', tabs).forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); }); draw(); }); });
      draw();
    }).catch(function () { });
    var lb = $('#lightbox');
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
  }

  observeReveal(document);
})();
