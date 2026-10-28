/* 1ère Compagnie d'Arc de Chennevières — scripts communs.
   Les contenus viennent des fichiers /data/*.json : il suffit de les modifier pour mettre le site à jour. */
(function () {
  'use strict';
  var NAV = [
    ['index.html', 'Accueil'],
    ['la-compagnie.html', 'La compagnie'],
    ['pratiques-creneaux.html', 'Pratiques & créneaux'],
    ['competitions-resultats.html', 'Compétitions'],
    ['evenements.html', 'Événements'],
    ['galerie.html', 'Galerie'],
    ['actualites.html', 'Actualités'],
    ['nous-rejoindre.html', 'Nous rejoindre']
  ];
  var ALL = NAV.concat([['mentions-legales.html', 'Mentions légales']]);
  var page = document.body.dataset.page || 'index.html';
  var MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var MOIS_C = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var CATS = {competition:'Compétition', tradition:'Tradition', convivialite:'Convivialité', vie:'Vie de la compagnie', portes:'Portes ouvertes'};

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function d(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function longDate(iso) { var x = d(iso); return JOURS[x.getDay()] + ' ' + x.getDate() + (x.getDate() === 1 ? 'er' : '') + ' ' + MOIS[x.getMonth()] + ' ' + x.getFullYear(); }
  function monthYear(iso) { var x = d(iso); return x.getDate() + (x.getDate() === 1 ? 'er' : '') + ' ' + MOIS[x.getMonth()] + ' ' + x.getFullYear(); }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u); return r.json(); }); }

  /* ---------- En-tête & pied de page communs ---------- */
  function navLinks(list) {
    return list.map(function (n) {
      var cur = n[0] === page ? ' aria-current="page"' : '';
      var c = n[0] === 'nous-rejoindre.html' ? ' class="cta"' : '';
      return '<li><a href="' + n[0] + '"' + c + cur + '>' + n[1] + '</a></li>';
    }).join('');
  }
  function buildLayout() {
    var h = document.createElement('header');
    h.className = 'site-header';
    h.innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="index.html" aria-label="1ère Compagnie d\'Arc de Chennevières – accueil"><img src="img/blason.jpg" width="46" height="46" alt="Blason de la compagnie"><span>1ère Compagnie d\'Arc<small>CHENNEVIÈRES · 1854</small></span></a>' +
      '<nav class="nav" aria-label="Navigation principale"><ul>' + navLinks(NAV) + '</ul></nav>' +
      '<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mnav"><i></i><i></i><i></i></button>' +
      '</div>' +
      '<nav class="mobile-nav" id="mnav" aria-label="Menu mobile">' +
      ALL.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join('') +
      '</nav>';
    document.body.insertBefore(h, document.body.firstChild);
    var skip = document.createElement('a'); skip.className = 'skip'; skip.href = '#contenu'; skip.textContent = 'Aller au contenu';
    document.body.insertBefore(skip, document.body.firstChild);

    var btn = $('.burger', h);
    btn.addEventListener('click', function () {
      var o = h.classList.toggle('open');
      btn.setAttribute('aria-expanded', o);
      btn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
      document.body.style.overflow = o ? 'hidden' : '';
    });
    $$('.mobile-nav a', h).forEach(function (a) { a.addEventListener('click', function () { h.classList.remove('open'); document.body.style.overflow = ''; }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { h.classList.remove('open'); document.body.style.overflow = ''; } });
    var onScroll = function () { h.classList.toggle('solid', window.scrollY > 30); };
    onScroll(); window.addEventListener('scroll', onScroll, {passive: true});

    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML =
      '<div class="wrap"><div class="foot-grid">' +
      '<div><div class="foot-brand"><img src="img/blason.jpg" width="60" height="60" alt="Blason" loading="lazy"><b>1ère Compagnie d\'Arc<br>de Chennevières-sur-Marne</b></div>' +
      '<p>Compagnie de tir à l\'arc fondée en 1854. Beursault, tir sur cible, tradition et convivialité.</p></div>' +
      '<div><h4>Coordonnées</h4><ul><li>15 rue des Archers<br>94430 Chennevières-sur-Marne</li><li><a href="tel:+33789234689" data-site="telephone">07 89 23 46 89</a></li><li style="color:#9fb3a8">E-mail : à compléter</li></ul></div>' +
      '<div><h4>Le site</h4><ul>' + ALL.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + '</a></li>'; }).join('') + '</ul></div>' +
      '<div><h4>Liens &amp; réseaux</h4><ul id="f-links"></ul></div>' +
      '</div><div class="copy"><span>© <span id="yr"></span> 1ère Compagnie d\'Arc de Chennevières-sur-Marne</span><span><a href="mentions-legales.html">Mentions légales</a> · Maquette réalisée par AssoVisible</span></div></div>';
    document.body.appendChild(f);
    $('#yr').textContent = new Date().getFullYear();
    getJSON('data/site.json').then(function (s) {
      $('#f-links').innerHTML = s.liens.map(function (l) { return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a></li>'; }).join('');
      $$('[data-site="telephone"]').forEach(function (e) { if (e.tagName === 'A') { e.textContent = s.telephone; e.href = 'tel:' + s.telephoneLien; } });
    }).catch(function () {});
  }

  /* ---------- Apparitions & compteurs ---------- */
  var io = null;
  function reveals() {
    var els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    io = io || new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, {threshold: .12});
    els.forEach(function (e) { io.observe(e); });
  }
  function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    var yearsEl = $('[data-count="years"]');
    if (yearsEl) yearsEl.dataset.count = new Date().getFullYear() - 1854;
    function run(el) {
      var to = +el.dataset.count, dur = 1600, t0 = null, suffix = el.dataset.suffix || '';
      if (matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = to + suffix; return; }
      requestAnimationFrame(function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e) + suffix; if (p < 1) requestAnimationFrame(step); });
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var cio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { run(x.target); cio.unobserve(x.target); } }); }, {threshold: .5});
    els.forEach(function (e) { cio.observe(e); });
  }

  /* ---------- Rendus pilotés par les données ---------- */
  function eventHTML(e, past) {
    var x = d(e.date), fin = e.fin ? d(e.fin) : null;
    var day = fin ? x.getDate() + '–' + fin.getDate() : x.getDate();
    return '<li class="ev' + (past ? ' past' : '') + '" data-cat="' + esc(e.categorie) + '">' +
      '<div class="date-tile"><b>' + day + '</b><span>' + MOIS_C[x.getMonth()] + ' ' + String(x.getFullYear()).slice(2) + '</span></div>' +
      '<div><div class="badges"><span class="badge ' + (e.categorie === 'competition' ? '' : 'green') + '">' + esc(CATS[e.categorie] || e.categorie) + '</span></div>' +
      '<h3>' + esc(e.titre) + '</h3>' +
      (e.lieu ? '<p>📍 ' + esc(e.lieu) + '</p>' : '') +
      (e.description ? '<p>' + esc(e.description) + '</p>' : '') + '</div></li>';
  }
  function eventList(el, items, emptyMsg, past) {
    el.innerHTML = items.length ? items.map(function (e) { return eventHTML(e, past); }).join('') : '<li class="placeholder">' + emptyMsg + '</li>';
  }
  function withFilters(box, listEl) {
    $$('.chip', box).forEach(function (c) {
      c.addEventListener('click', function () {
        $$('.chip', box).forEach(function (o) { o.setAttribute('aria-pressed', o === c); });
        var f = c.dataset.f;
        $$('.ev', listEl).forEach(function (li) { li.hidden = f !== 'all' && li.dataset.cat !== f; });
      });
    });
  }
  function isUp(e, T) { return d(e.fin || e.date) >= T; }

  function renderData() {
    var T = today();

    if ($('#next-event')) getJSON('data/calendrier.json').then(function (c) {
      var up = c.evenements.filter(function (e) { return isUp(e, T); }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
      var box = $('#next-event');
      if (!up.length) { box.innerHTML = '<div class="placeholder" style="grid-column:1/-1">Les prochaines dates seront publiées bientôt. Appelez-nous au 07 89 23 46 89.</div>'; return; }
      var e = up[0], x = d(e.date);
      box.innerHTML = '<div class="date-tile"><b>' + x.getDate() + '</b><span>' + MOIS_C[x.getMonth()] + ' ' + x.getFullYear() + '</span></div>' +
        '<div><span class="badge">Prochain rendez-vous</span><h2 style="margin-top:.5rem">' + esc(e.titre) + '</h2><p>' + longDate(e.date) + (e.lieu ? ' · ' + esc(e.lieu) : '') + (e.description ? '<br>' + esc(e.description) : '') + '</p></div>' +
        '<a class="btn btn-green" href="evenements.html">Tout le calendrier</a>';
    }).catch(function () {});

    if ($('#comp-list')) getJSON('data/calendrier.json').then(function (c) {
      var comps = c.evenements.filter(function (e) { return e.categorie === 'competition'; });
      eventList($('#comp-list'), comps.filter(function (e) { return isUp(e, T); }), 'Les compétitions de la saison à venir seront publiées ici dès que le calendrier 2027 sera disponible.');
      eventList($('#comp-past'), comps.filter(function (e) { return !isUp(e, T); }).reverse(), 'Aucune compétition passée.', true);
      $('#cal-source').textContent = c.source;
    });
    if ($('#res-list')) getJSON('data/resultats.json').then(function (r) {
      $('#res-list').innerHTML = r.resultats.map(function (x) {
        return '<div class="card reveal"><span class="badge gold">' + monthYear(x.date) + '</span><h3 style="margin-top:.7rem">' + esc(x.titre) + '</h3><p style="margin:0">' + esc(x.resultat) + '</p></div>';
      }).join('');
      $('#palmares').innerHTML = r.palmares.map(function (p) { return '<li class="reveal"><div class="yr">' + esc(p.annee) + '</div><p>' + esc(p.texte) + '</p></li>'; }).join('');
      reveals();
    });

    if ($('#ev-up')) getJSON('data/calendrier.json').then(function (c) {
      var every = c.evenements;
      eventList($('#ev-up'), every.filter(function (e) { return isUp(e, T); }), 'Les événements 2027 seront publiés ici dès que le calendrier sera disponible.');
      eventList($('#ev-past'), every.filter(function (e) { return !isUp(e, T); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; }), 'Pas encore d\'archives.', true);
      withFilters($('#ev-filters'), $('#ev-up'));
      $('#cal-source').textContent = c.source;
    });

    if ($('#creneaux')) getJSON('data/creneaux.json').then(function (c) {
      $('#creneaux').innerHTML = c.creneaux.map(function (s) {
        return '<tr><td><b>' + esc(s.jour) + '</b></td><td>' + esc(s.horaire) + '</td><td>' + esc(s.public) + '</td><td><b>' + esc(s.lieu) + '</b><br><span class="note">' + esc(s.adresse) + '</span></td><td>' + esc(s.periode) + '</td></tr>';
      }).join('');
      $('#creneaux-maj').textContent = c.maj;
    });
    if ($('#tarifs')) getJSON('data/tarifs.json').then(function (t) {
      $('#tarifs').innerHTML = t.lignes.map(function (l) {
        return '<tr><td><b>' + esc(l.formule) + '</b><br><span class="note">' + esc(l.detail) + '</span></td><td class="price">' + esc(l.adulte) + '</td><td class="price">' + esc(l.jeune) + '</td></tr>';
      }).join('');
      $('#tarifs-note').textContent = t.note;
      $('#tarifs-pdf').href = t.pdf;
    });
    if ($('#disciplines')) getJSON('data/disciplines.json').then(function (ds) {
      var box = $('#disciplines'), n = box.dataset.limit ? +box.dataset.limit : ds.length;
      box.innerHTML = ds.slice(0, n).map(function (x, i) {
        return '<article class="disc reveal d' + (i % 4) + '" tabindex="0"><img src="' + esc(x.img) + '" alt="" loading="lazy"><div class="in"><span class="tag">' + esc(x.tag) + '</span><h3>' + esc(x.nom) + '</h3><div class="more">' + esc(x.texte) + '</div></div></article>';
      }).join('');
      $$('.disc', box).forEach(function (el) {
        el.addEventListener('click', function () { el.classList.toggle('on'); });
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.classList.toggle('on'); } });
      });
      reveals();
    });

    if ($('#frise')) getJSON('data/histoire.json').then(function (h) {
      $('#frise').innerHTML = h.map(function (x) { return '<li class="reveal"><div class="yr">' + esc(x.annee) + '</div><h3>' + esc(x.titre) + '</h3><p>' + esc(x.texte) + '</p></li>'; }).join('');
      reveals();
    });
    if ($('#bureau')) getJSON('data/bureau.json').then(function (b) {
      function ppl(list) { return list.map(function (p) { var ini = p.nom.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2); return '<div class="card person reveal"><div class="ini">' + esc(ini) + '</div><h3>' + esc(p.nom) + '</h3><p>' + esc(p.role) + '</p></div>'; }).join(''); }
      $('#bureau').innerHTML = ppl(b.bureau);
      $('#entraineurs').innerHTML = ppl(b.entraineurs);
      $('#dignitaires').innerHTML = ppl(b.dignitaires);
      reveals();
    });

    if ($('#news')) getJSON('data/actualites.json').then(function (n) {
      var lim = +($('#news').dataset.limit || n.length);
      $('#news').innerHTML = n.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, lim).map(function (a, i) {
        return '<article class="card news reveal d' + (i % 3) + '"><img src="' + esc(a.img) + '" alt="" loading="lazy"><div class="body"><time datetime="' + a.date + '">' + monthYear(a.date) + '</time><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p></div></article>';
      }).join('');
      reveals();
    });

    if ($('#gallery')) getJSON('data/galerie.json').then(function (g) {
      var cats = ['Tout'].concat(g.map(function (x) { return x.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
      $('#gal-filters').innerHTML = cats.map(function (c, i) { return '<button class="chip" type="button" data-f="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>'; }).join('');
      $('#gallery').innerHTML = g.map(function (x) {
        return '<figure data-cat="' + esc(x.cat) + '" tabindex="0"><img src="' + esc(x.src) + '" alt="' + esc(x.legende) + '" loading="lazy"><figcaption>' + esc(x.legende) + '</figcaption></figure>';
      }).join('');
      var lb = $('#lightbox'), lbi = $('img', lb), lbp = $('p', lb);
      function open(f) { lbi.src = $('img', f).src; lbi.alt = $('img', f).alt; lbp.textContent = $('figcaption', f).textContent; lb.classList.add('on'); }
      $$('figure', $('#gallery')).forEach(function (f) { f.addEventListener('click', function () { open(f); }); f.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(f); }); });
      lb.addEventListener('click', function () { lb.classList.remove('on'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('on'); });
      $$('.chip', $('#gal-filters')).forEach(function (c) {
        c.addEventListener('click', function () {
          $$('.chip', $('#gal-filters')).forEach(function (o) { o.setAttribute('aria-pressed', o === c); });
          $$('figure', $('#gallery')).forEach(function (f) { f.hidden = c.dataset.f !== 'Tout' && f.dataset.cat !== c.dataset.f; });
        });
      });
    });
  }

  /* ---------- Cible du héro : petit « choc » quand la flèche arrive ---------- */
  function hero() {
    var t = $('.target'); if (!t) return;
    setTimeout(function () { t.classList.add('hit'); }, 2100);
  }

  buildLayout();
  reveals(); counters(); renderData(); hero();
})();
