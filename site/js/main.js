/* Cercle d'art de Gentilly — scripts communs + modules par page.
   Les contenus (artistes, ateliers, expositions, galerie, actualités) viennent des fichiers /data/*.json. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  root.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var cache = {};
  function getJSON(name) {
    if (!cache[name]) cache[name] = fetch('data/' + name + '.json').then(function (r) { if (!r.ok) throw new Error(name); return r.json(); });
    return cache[name];
  }
  function fail(el, msg) { if (el) el.innerHTML = '<p class="empty">' + esc(msg || 'Contenu momentanément indisponible. Merci de réessayer.') + '</p>'; }

  /* ---------- En-tête, menu burger ---------- */
  var header = $('.site-header');
  var burger = $('.burger');
  function onScroll() { if (header) header.classList.toggle('on-dark', window.scrollY < 60 && header.dataset.hero === 'true'); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); }
    var mm = $('#mobile-menu'); if (mm) { mm.setAttribute('aria-hidden', String(!open)); if (open) { var f = $('a', mm); f && f.focus({ preventScroll: true }); } }
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger && burger.focus(); } });
  $$('#mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1240) setMenu(false); });

  /* ---------- Apparition au scroll ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  function watchReveal(scope) {
    $$('.reveal:not(.in)', scope).forEach(function (el, i) {
      if (!io) { el.classList.add('in'); return; }
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i % 6, 5) * 0.07 + 's');
      io.observe(el);
    });
  }
  watchReveal();

  /* ---------- Compteurs animés ---------- */
  function animateCounters(scope) {
    var els = $$('[data-count]', scope);
    var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return; cio.unobserve(en.target);
        var el = en.target, to = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) { el.textContent = to; return; }
        var t0 = null, dur = 1800;
        (function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: 0.4 }) : null;
    els.forEach(function (el) { if (cio) cio.observe(el); else el.textContent = el.dataset.count; });
  }

  /* ---------- Visionneuse plein écran ---------- */
  var lb = { el: null, items: [], i: 0, last: null };
  function lbBuild() {
    if (lb.el) return;
    var d = doc.createElement('div');
    d.className = 'lightbox'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Visionneuse d’images');
    d.innerHTML = '<div class="lb-stage"><button class="lb-btn lb-close" aria-label="Fermer">✕</button><button class="lb-btn lb-prev" aria-label="Image précédente">‹</button><img alt=""><button class="lb-btn lb-next" aria-label="Image suivante">›</button></div><div class="lb-cap" aria-live="polite"><b></b><span class="s1"></span><span class="s2"></span></div>';
    body.appendChild(d); lb.el = d;
    $('.lb-close', d).addEventListener('click', lbClose);
    $('.lb-prev', d).addEventListener('click', function () { lbGo(-1); });
    $('.lb-next', d).addEventListener('click', function () { lbGo(1); });
    d.addEventListener('click', function (e) { if (e.target === d || e.target.classList.contains('lb-stage')) lbClose(); });
    doc.addEventListener('keydown', function (e) {
      if (!d.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbGo(-1);
      else if (e.key === 'ArrowRight') lbGo(1);
      else if (e.key === 'Tab') { var f = $$('button', d); var first = f[0], last = f[f.length - 1]; if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); } }
    });
    var x0 = null;
    d.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend', function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1); x0 = null; });
  }
  function lbShow() {
    var it = lb.items[lb.i]; if (!it) return;
    var img = $('img', lb.el); img.src = it.src; img.alt = it.alt || it.title || '';
    $('.lb-cap b', lb.el).textContent = it.title || '';
    $('.s1', lb.el).textContent = it.sub || '';
    $('.s2', lb.el).textContent = it.credit ? 'Crédit : ' + it.credit : '';
    var multi = lb.items.length > 1;
    $('.lb-prev', lb.el).style.display = multi ? '' : 'none'; $('.lb-next', lb.el).style.display = multi ? '' : 'none';
    var nx = lb.items[(lb.i + 1) % lb.items.length]; if (nx) { var p = new Image(); p.src = nx.src; }
  }
  function lbOpen(items, i) { lbBuild(); lb.items = items; lb.i = i; lb.last = doc.activeElement; lbShow(); lb.el.classList.add('open'); body.style.overflow = 'hidden'; $('.lb-close', lb.el).focus(); }
  function lbClose() { lb.el.classList.remove('open'); body.style.overflow = ''; if (lb.last && lb.last.focus) lb.last.focus(); }
  function lbGo(n) { lb.i = (lb.i + n + lb.items.length) % lb.items.length; lbShow(); }

  /* ---------- Accueil ---------- */
  function initHome() {
    var slides = $$('.hero-slide'), dots = $('.dots'), cap = $('.hero-caption'), cur = 0, timer;
    if (slides.length) {
      slides.forEach(function (s, i) {
        var b = doc.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Œuvre ' + (i + 1) + ' sur ' + slides.length);
        b.addEventListener('click', function () { go(i, true); }); dots.appendChild(b);
      });
      var go = function (i, user) {
        cur = (i + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('active', k === cur); });
        $$('button', dots).forEach(function (b, k) { b.removeAttribute('aria-current'); if (k === cur) { void b.offsetWidth; b.setAttribute('aria-current', 'true'); } });
        cap.textContent = slides[cur].dataset.caption || '';
        clearTimeout(timer); if (!reduceMotion) timer = setTimeout(function () { go(cur + 1); }, 6000);
        if (user) return;
      };
      go(0);
      var hero = $('.hero');
      doc.addEventListener('visibilitychange', function () { if (doc.hidden) clearTimeout(timer); else go(cur); });
    }
    getJSON('expositions').then(function (d) {
      var now = Date.now();
      var fut = d.prochains.filter(function (e) { return e.dateISO && Date.parse(e.dateISO) > now; }).sort(function (a, b) { return Date.parse(a.dateISO) - Date.parse(b.dateISO); });
      var ev = fut.filter(function (e) { return e.statut === 'Confirmé'; })[0] || fut[0];
      var box = $('#next-event'); if (!box) return;
      if (!ev) { box.innerHTML = '<p class="lead">Le prochain rendez-vous sera annoncé très bientôt. Suivez-nous sur Facebook ou écrivez-nous.</p>'; return; }
      var poster = ev.affiche ? '<img class="cover" src="' + esc(ev.affiche.replace('-t.jpg', '.jpg')) + '" alt="Affiche : ' + esc(ev.titre) + '">' : '<div class="ph"><img src="img/logo-blanc.png" alt=""><p class="muted">Affiche à venir</p></div>';
      box.innerHTML = '<div class="next-poster">' + poster + '</div><div><p class="kicker">Prochain rendez-vous</p><h2>' + esc(ev.titre) + '</h2>' +
        '<ul class="meta"><li><b>Quand</b><span>' + esc(ev.date) + '</span></li><li><b>Où</b><span>' + esc(ev.lieu) + '</span></li></ul>' +
        '<p class="lead">' + esc(ev.texte) + '</p>' +
        '<div class="countdown" role="timer" aria-label="Compte à rebours"><div class="cd"><b id="cd-d">0</b><span>jours</span></div><div class="cd"><b id="cd-h">0</b><span>heures</span></div><div class="cd"><b id="cd-m">0</b><span>min</span></div><div class="cd"><b id="cd-s">0</b><span>sec</span></div></div>' +
        '<div class="btn-row"><a class="btn solid" href="expositions.html">Tous les rendez-vous <span class="arr">→</span></a></div></div>';
      var target = Date.parse(ev.dateISO);
      var tick = function () {
        var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        var vals = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
        for (var k in vals) { var n = $('#cd-' + k); if (n) n.textContent = String(vals[k]).padStart(k === 'd' ? 1 : 2, '0'); }
      };
      tick(); setInterval(tick, 1000); watchReveal(box);
    }).catch(function () { fail($('#next-event')); });

    Promise.all([getJSON('site'), getJSON('artistes')]).then(function (r) {
      var site = r[0], art = r[1], el = $('#stats'); if (!el) return;
      el.innerHTML = site.chiffres.map(function (c) {
        var v = c.valeur;
        if (c.calcul === 'annees_depuis_creation') v = new Date().getFullYear() - site.annee_creation;
        if (c.calcul === 'nb_artistes') v = art.liste.length;
        return '<div class="stat reveal"><b data-count="' + v + '">0</b><span>' + esc(c.label) + '</span></div>';
      }).join('');
      watchReveal(el); animateCounters(el);
    }).catch(function () { fail($('#stats')); });

    getJSON('actualites').then(function (d) {
      var el = $('#home-news'); if (!el) return;
      el.innerHTML = d.actualites.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 3).map(newsCard).join('');
      watchReveal(el);
    }).catch(function () { fail($('#home-news')); });
  }

  function newsCard(n) {
    var th = n.image ? '<div class="thumb"><img src="' + esc(n.image) + '" alt="' + esc(n.imageAlt || '') + '" loading="lazy"></div>' : '<div class="thumb logo-ph"><img src="img/logo.png" alt=""></div>';
    return '<article class="card reveal">' + th + '<div class="body"><span class="tag">' + esc(n.categorie) + '</span><h3>' + esc(n.titre) + '</h3><span class="date">' + esc(n.dateLabel) + '</span><p>' + esc(n.texte) + '</p>' + (n.lien ? '<a class="link-arrow" href="' + esc(n.lien) + '">En savoir plus</a>' : '') + '</div></article>';
  }

  /* ---------- Artistes ---------- */
  function initArtistes() {
    getJSON('artistes').then(function (d) {
      var grid = $('#flip-grid'), chips = $('#chips'), names = $('#names'), namesWrap = $('#names-wrap');
      chips.innerHTML = ['Tous'].concat(d.disciplines).map(function (x, i) { return '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-f="' + esc(i === 0 ? '' : x) + '">' + esc(x) + '</button>'; }).join('');
      grid.innerHTML = d.cartes.map(function (c, i) {
        var bg = c.oeuvres && c.oeuvres[0] ? '<img class="swatch" src="' + esc(c.oeuvres[0]) + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:top;opacity:.35;filter:grayscale(.4)">' : '<div class="swatch" style="background:linear-gradient(145deg,hsl(' + (8 + i * 9) + ' 55% 26%),#16130f)"></div>';
        var ini = c.nom.split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('');
        var works = (c.oeuvres || []).map(function (o) { return '<img src="' + esc(o) + '" alt="" loading="lazy">'; }).join('');
        return '<article class="flip reveal" tabindex="0" data-d="' + esc(c.disciplines.join('|')) + '" aria-label="' + esc(c.nom + ', ' + c.role) + '"><div class="flip-in">' +
          '<div class="face front">' + bg + '<div class="mono" aria-hidden="true">' + esc(ini) + '</div><span class="hint" aria-hidden="true">Retourner ↻</span><h3>' + esc(c.nom) + '</h3><p class="role">' + esc(c.role) + '</p><div class="tags">' + c.disciplines.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div></div>' +
          '<div class="face back"><div><h3>' + esc(c.nom) + '</h3><p>' + esc(c.bio) + '</p>' + (c.url ? '<p><a class="link-arrow" href="' + esc(c.url) + '" target="_blank" rel="noopener">Son site ↗</a></p>' : '') + '</div>' +
          (works ? '<div><div class="works">' + works + '</div><p class="works-credit">' + esc(c.credit_oeuvres) + '</p></div>' : '<p class="works-credit">Portrait et œuvres à compléter avec l’accord de l’artiste.</p>') + '</div></div></article>';
      }).join('');
      names.innerHTML = d.liste.map(function (p) { return '<li>' + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.nom) + '</a>' : esc(p.nom)) + '</li>'; }).join('');
      $('#names-count').textContent = d.liste.length;
      $$('.flip', grid).forEach(function (f) {
        f.addEventListener('click', function (e) { if (e.target.closest('a')) return; f.classList.toggle('is-flipped'); });
        f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f.classList.toggle('is-flipped'); } });
      });
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('.chip'); if (!b) return;
        $$('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        var f = b.dataset.f, n = 0;
        $$('.flip', grid).forEach(function (c) { var ok = !f || c.dataset.d.split('|').indexOf(f) > -1; c.hidden = !ok; if (ok) n++; c.classList.remove('is-flipped'); });
        namesWrap.hidden = !!f;
        $('#artist-live').textContent = n + ' artiste' + (n > 1 ? 's' : '') + ' affiché' + (n > 1 ? 's' : '');
      });
      watchReveal(grid);
    }).catch(function () { fail($('#flip-grid')); });
  }

  /* ---------- Ateliers ---------- */
  function initAteliers() {
    getJSON('ateliers').then(function (d) {
      $('#disc-nav').innerHTML = d.ateliers.map(function (a) { return '<a href="#' + esc(a.id) + '">' + esc(a.discipline) + '</a>'; }).join('') + '<a href="#tarifs">Tarifs</a><a href="#stages">Stages</a>';
      $('#ateliers-list').innerHTML = d.ateliers.map(function (a) {
        return '<section class="atelier reveal" id="' + esc(a.id) + '"><div><p class="kicker">Atelier</p><h2>' + esc(a.discipline) + '</h2><p>' + esc(a.intro) + '</p><p class="where"><b>Lieu :</b> ' + esc(a.lieu) + '</p>' + (a.image ? '<div class="pic"><img src="' + esc(a.image) + '" alt="" loading="lazy"></div>' : '') + '</div>' +
          '<div class="slots">' + a.groupes.map(function (g) {
            return '<div class="slot"><b>' + esc(g.public) + '</b><span class="when">' + esc(g.jour) + ' · ' + esc(g.horaire) + '</span><span class="who">' + (g.animateur ? esc(g.animateur) : '') + '</span>' + (g.note ? '<span class="note-s">' + esc(g.note) + (g.pdf ? ' — <a href="' + esc(g.pdf) + '" target="_blank" rel="noopener">programme (PDF)</a>' : '') + '</span>' : '') + '</div>';
          }).join('') + '</div></section>';
      }).join('');
      var t = d.tarifs;
      $('#tarifs-body').innerHTML = '<p class="kicker">Tarifs</p><h2>' + esc(t.saison) + '</h2><p class="lead">' + esc(t.adhesion) + '</p><table class="price-table"><tbody>' + t.lignes.map(function (l) { return '<tr><th scope="row">' + esc(l.label) + '</th><td>' + esc(l.prix) + '</td></tr>'; }).join('') + '</tbody></table>' +
        '<ul style="margin-top:1.6rem">' + t.reductions.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul><p>' + esc(t.paiement) + '</p>';
      var s = d.stages;
      $('#stages-body').innerHTML = '<p class="kicker">Stages</p><h2>' + esc(s.titre) + '</h2><p class="lead">' + esc(s.texte) + '</p><p><b>' + esc(s.prix) + '</b><br>' + esc(s.inscription) + '</p>';
      $('#ateliers-note').textContent = d.note;
      watchReveal();
    }).catch(function () { fail($('#ateliers-list')); });
  }

  /* ---------- Expositions ---------- */
  function initExpos() {
    getJSON('expositions').then(function (d) {
      var posters = [];
      function cls(s) { return s === 'Confirmé' ? 'confirm' : (s === 'À confirmer' || s === 'À venir') ? 'tbc' : ''; }
      function full(src) { return src ? src.replace('-t.jpg', '.jpg') : ''; }
      $('#prochains').innerHTML = d.prochains.map(function (e) {
        var idx = -1, p = '';
        if (e.affiche) { idx = posters.length; posters.push({ src: full(e.affiche), title: e.titre, sub: e.date, credit: 'Affiche du Cercle d’art de Gentilly' }); p = '<button class="poster" style="border:0;padding:0;cursor:zoom-in;display:block" data-p="' + idx + '" aria-label="Agrandir l’affiche : ' + esc(e.titre) + '"><img src="' + esc(e.affiche) + '" alt="" loading="lazy"></button>'; }
        else p = '<div class="poster" style="aspect-ratio:3/4;display:grid;place-items:center"><img src="img/logo.png" alt="" style="width:50%;opacity:.25"></div>';
        return '<article class="event reveal"><div class="poster-wrap">' + p + '</div><div><span class="status ' + cls(e.statut) + '">' + esc(e.statut) + '</span><p class="tag" style="margin:0 0 .3rem">' + esc(e.type) + '</p><h3>' + esc(e.titre) + '</h3><ul class="meta" style="margin:.5rem 0"><li><b style="color:var(--accent)">Quand</b><span>' + esc(e.date) + '</span></li><li><b style="color:var(--accent)">Où</b><span>' + esc(e.lieu) + '</span></li></ul><p>' + esc(e.texte) + '</p></div></article>';
      }).join('');
      var years = {}; d.archives.forEach(function (a) { (years[a.annee] = years[a.annee] || []).push(a); });
      $('#archives').innerHTML = Object.keys(years).sort(function (a, b) { return b - a; }).map(function (y) {
        return '<div class="year-block"><h3 class="year-title reveal" aria-label="Année ' + y + '">' + y + '</h3><div class="arch-grid">' + years[y].map(function (a) {
          var p;
          if (a.affiche) { var i = posters.length; posters.push({ src: a.affiche, title: a.titre, sub: a.date + ' — ' + a.lieu, credit: 'Affiche / visuel : Cercle d’art de Gentilly' }); p = '<button class="poster" data-p="' + i + '" aria-label="Agrandir : ' + esc(a.titre) + '"><img src="' + esc(a.affiche.replace('.jpg', '-t.jpg')) + '" alt="" loading="lazy"></button>'; }
          else p = '<div class="poster noimg"><img src="img/logo.png" alt=""></div>';
          return '<article class="arch reveal">' + p + '<span class="tag">' + esc(a.type) + '</span><h4>' + esc(a.titre) + '</h4><p>' + esc(a.date) + '<br>' + esc(a.lieu) + '</p></article>';
        }).join('') + '</div></div>';
      }).join('');
      doc.addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b) lbOpen(posters, parseInt(b.dataset.p, 10)); });
      watchReveal();
    }).catch(function () { fail($('#prochains')); });
  }

  /* ---------- Galerie ---------- */
  function initGalerie() {
    getJSON('galerie').then(function (d) {
      var all = d.oeuvres, shown = all.slice();
      function uniq(f) { var s = {}; all.forEach(function (o) { [].concat(o[f]).forEach(function (v) { if (v) s[v] = 1; }); }); return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, 'fr'); }); }
      function fill(id, list) { $(id).innerHTML = '<option value="">Tous</option>' + list.map(function (v) { return '<option>' + esc(v) + '</option>'; }).join(''); }
      fill('#f-artiste', uniq('artiste')); fill('#f-disc', uniq('disciplines')); fill('#f-expo', uniq('expo'));
      var params = new URLSearchParams(location.search);
      [['artiste', '#f-artiste'], ['discipline', '#f-disc'], ['expo', '#f-expo']].forEach(function (p) { var v = params.get(p[0]); if (v) $(p[1]).value = v; });
      function render() {
        var a = $('#f-artiste').value, di = $('#f-disc').value, ex = $('#f-expo').value;
        shown = all.filter(function (o) { return (!a || o.artiste === a) && (!di || o.disciplines.indexOf(di) > -1) && (!ex || o.expo === ex); });
        $('#g-count').textContent = shown.length + ' œuvre' + (shown.length > 1 ? 's' : '') + ' affichée' + (shown.length > 1 ? 's' : '');
        $('#masonry').innerHTML = shown.length ? shown.map(function (o, i) {
          return '<figure class="work reveal"><button type="button" data-i="' + i + '" aria-label="Agrandir : ' + esc(o.titre) + '"><img src="' + esc(o.thumb) + '" alt="' + esc(o.titre) + '" loading="lazy"></button><figcaption><b>' + esc(o.titre) + '</b>' + esc(o.artiste) + ' · ' + esc(o.annee) + '</figcaption></figure>';
        }).join('') : '<p class="empty">Aucune œuvre ne correspond à ces critères.</p>';
        watchReveal($('#masonry'));
      }
      ['#f-artiste', '#f-disc', '#f-expo'].forEach(function (s) { $(s).addEventListener('change', render); });
      $('#g-reset').addEventListener('click', function () { ['#f-artiste', '#f-disc', '#f-expo'].forEach(function (s) { $(s).value = ''; }); render(); });
      $('#masonry').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-i]'); if (!b) return;
        lbOpen(shown.map(function (o) { return { src: o.image, title: o.titre, sub: o.artiste + ' · ' + o.annee + (o.expo ? ' · ' + o.expo : ''), credit: o.credit, alt: o.titre }; }), parseInt(b.dataset.i, 10));
      });
      render();
    }).catch(function () { fail($('#masonry')); });
  }

  /* ---------- Actualités ---------- */
  function initActus() {
    getJSON('actualites').then(function (d) {
      var items = d.actualites.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      var cats = ['Tout'].concat(Object.keys(items.reduce(function (s, n) { s[n.categorie] = 1; return s; }, {})));
      $('#news-chips').innerHTML = cats.map(function (c, i) { return '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-c="' + esc(i ? c : '') + '">' + esc(c) + '</button>'; }).join('');
      function render(c) { $('#news-list').innerHTML = items.filter(function (n) { return !c || n.categorie === c; }).map(newsCard).join(''); watchReveal($('#news-list')); }
      $('#news-chips').addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (!b) return; $$('.chip', $('#news-chips')).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(b.dataset.c); });
      render('');
    }).catch(function () { fail($('#news-list')); });
  }

  /* ---------- Nous rejoindre ---------- */
  function initContact() {
    if (/[?&]merci=/.test(location.search)) { var m = $('#merci'); if (m) { m.hidden = false; m.focus(); } }
    $$('form[data-netlify]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        if (!window.fetch || !window.URLSearchParams) return;
        e.preventDefault();
        var btn = $('button[type=submit]', f), label = btn.textContent; btn.disabled = true; btn.textContent = 'Envoi en cours\u2026';
        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
          .then(function (r) { if (!r.ok) throw new Error('http'); f.reset(); var m = $('#merci'); m.hidden = false; m.focus(); m.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }); })
          .catch(function () { alert('L\u2019envoi a échoué. Vous pouvez nous écrire directement à cercledartdegentilly@free.fr'); })
          .then(function () { btn.disabled = false; btn.textContent = label; });
      });
    });
    getJSON('site').then(function (s) {
      var el = $('#adhesion-montant'); if (el) el.textContent = s.adhesion.montant;
      var dt = $('#adhesion-detail'); if (dt) dt.textContent = s.adhesion.detail;
      var pdf = $('#adhesion-pdf'); if (pdf) pdf.href = s.adhesion.inscription_pdf;
    }).catch(function () {});
  }

  /* ---------- Le cercle ---------- */
  function initCercle() {
    getJSON('site').then(function (s) {
      $('#timeline').innerHTML = s.historique.map(function (h) { return '<li class="reveal"><b>' + esc(h.annee) + '</b><p>' + esc(h.texte) + '</p></li>'; }).join('');
      $('#bureau').innerHTML = s.bureau.map(function (p) { var ph = /compl/i.test(p.nom); return '<div class="person reveal' + (ph ? ' placeholder' : '') + '"><span class="role">' + esc(p.role) + '</span><b>' + esc(p.nom) + '</b><p class="muted">' + esc(p.note || '') + '</p></div>'; }).join('');
      $('#partners').innerHTML = s.partenaires.map(function (p) { return '<li class="reveal"><b>' + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.nom) + '</a>' : esc(p.nom)) + '</b><span>' + esc(p.role) + '</span></li>'; }).join('');
      watchReveal();
    }).catch(function () { fail($('#bureau')); });
  }

  var page = body.dataset.page;
  var modules = { cercle: initCercle, accueil: initHome, artistes: initArtistes, ateliers: initAteliers, expositions: initExpos, galerie: initGalerie, actualites: initActus, rejoindre: initContact };
  if (modules[page]) modules[page]();
  animateCounters();
})();
