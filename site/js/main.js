/* Habitants du Quartier Notre-Dame Viosne — interactions et rendu des données (data/*.json) */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_C = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var cache = {};
  function data(name) {
    if (!cache[name]) {
      cache[name] = fetch("data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error(name);
        return r.json();
      });
    }
    return cache[name];
  }
  function parseDate(s) { var p = String(s).split(/[-T:]/); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1, +p[3] || 0, +p[4] || 0); }
  function longDate(s) { var d = parseDate(s); return d.getDate() + (d.getDate() === 1 ? "er" : "") + " " + MOIS[d.getMonth()] + " " + d.getFullYear(); }
  function ext(url) { return /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : ""; }
  function fail(el) { el.innerHTML = '<p class="note">Les contenus n’ont pas pu être chargés. Rechargez la page ou revenez dans un instant.</p>'; }
  var ICONS = {
    fete: '<path d="M4 20l5-12 7 7-12 5zM14 4l1 3M18 6l-2 2M20 10l-3 0M12 9l3-3"/>',
    maison: '<path d="M3 11l9-7 9 7v9H3zM9 20v-6h6v6"/>',
    note: '<path d="M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM20 16a3 3 0 11-6 0 3 3 0 016 0z"/>',
    coeur: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
    arbre: '<path d="M12 22v-7M12 15c-4 0-6-3-5-6-2-2-1-6 3-6 1-2 5-2 6 0 4 0 5 4 3 6 1 3-1 6-7 6z"/>',
    boussole: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || ICONS.boussole) + "</svg>"; }

  /* Menu mobile */
  var tg = $(".nav-toggle"), nav = $("#menu");
  if (tg && nav) {
    tg.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      tg.setAttribute("aria-expanded", o);
      tg.querySelector("span").textContent = o ? "Fermer" : "Menu";
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { tg.click(); tg.focus(); } });
  }

  /* Apparitions douces */
  function reveal() {
    var els = $$(".rev:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Compteurs animés */
  function counters() {
    var els = $$("[data-count]");
    if (!els.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function run(el) {
      var end = +el.getAttribute("data-count"), sep = el.getAttribute("data-sep") !== "none";
      var fmt = function (n) { return sep ? n.toLocaleString("fr-FR") : String(n); };
      if (reduce) { el.textContent = fmt(end); return; }
      var t0 = null, dur = 1800;
      (function step(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(end * e));
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Événements */
  function splitEvents(d) {
    var now = new Date(), up = (d.prochains || []).slice(), past = (d.archives || []).slice();
    var keep = [];
    up.forEach(function (e) { (parseDate(e.date) >= now ? keep : past).push(e); });
    keep.sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    past.sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
    return { up: keep, past: past };
  }
  function eventHtml(e, past) {
    var d = parseDate(e.date), hasTime = String(e.date).indexOf("T") > -1;
    var h = hasTime ? " à " + String(d.getHours()).padStart(2, "0") + "h" + String(d.getMinutes()).padStart(2, "0") : "";
    return '<article class="card event rev' + (past ? " passe" : "") + '" data-type="' + esc(e.type || "autre") + '">' +
      '<div class="jour" aria-hidden="true"><b>' + d.getDate() + "</b><span>" + MOIS_C[d.getMonth()] + " " + d.getFullYear() + "</span></div>" +
      "<div><h3>" + esc(e.titre) + "</h3><p><strong>" + esc(longDate(e.date)) + esc(h) + "</strong>" + (e.lieu ? " · " + esc(e.lieu) : "") + "</p>" +
      (e.description ? "<p>" + esc(e.description) + "</p>" : "") +
      (e.lien ? '<p><a href="' + esc(e.lien) + '"' + ext(e.lien) + ">" + esc(e.lien_texte || "En savoir plus") + "</a>" + (e.source ? " <small>(" + esc(e.source) + ")</small>" : "") + "</p>" : "") +
      "</div></article>";
  }
  function renderEvents() {
    var up = $("[data-render=events-up]"), past = $("[data-render=events-past]");
    if (!up && !past) return Promise.resolve();
    return data("events").then(function (d) {
      var s = splitEvents(d);
      if (up) up.innerHTML = s.up.length ? s.up.map(function (e) { return eventHtml(e, false); }).join("") :
        '<div class="card attente"><span class="pill attente">À venir</span><h3>Aucun rendez-vous annoncé pour le moment</h3><p>Les prochaines dates seront publiées ici dès qu’elles seront confirmées par l’association. Vous pouvez nous écrire pour être prévenu(e).</p><p><a class="btn btn-vert" href="contact.html">Nous contacter</a></p></div>';
      if (past) past.innerHTML = s.past.map(function (e) { return eventHtml(e, true); }).join("");
      var reg = $("[data-render=reunions]");
      if (reg && d.reunions_regulieres) reg.textContent = d.reunions_regulieres.texte.replace("a_completer", "à compléter par l’association.");
      reveal();
    }).catch(function () { if (up) fail(up); });
  }
  function renderNextRdv() {
    var box = $("[data-render=next-rdv]");
    if (!box) return;
    data("events").then(function (d) {
      var s = splitEvents(d), n = s.up[0];
      if (!n) {
        box.innerHTML = "<div><p class=\"pill\">Prochain rendez-vous</p><h2>Date à annoncer</h2><p>L’agenda se remplit dès que l’association confirme ses prochaines rencontres. Retrouvez aussi les moments passés dans les archives.</p><div class=\"btn-row\"><a class=\"btn btn-vert\" href=\"agenda.html\">Voir l’agenda</a></div></div>" +
          '<div class="rdv-vide"><strong>Envie d’être prévenu(e) ?</strong><p style="margin:.4rem 0 0">Écrivez-nous : nous vous tiendrons informé(e) des prochaines réunions et animations du quartier.</p></div>';
        return;
      }
      var end = parseDate(n.date);
      box.innerHTML = "<div><p class=\"pill\">Prochain rendez-vous</p><h2>" + esc(n.titre) + "</h2><p><strong>" + esc(longDate(n.date)) + "</strong>" + (n.lieu ? " · " + esc(n.lieu) : "") + "</p><div class=\"btn-row\"><a class=\"btn btn-terre\" href=\"agenda.html\">Tous les rendez-vous</a></div></div>" +
        '<div class="countdown" role="timer" aria-label="Compte à rebours"><div><b data-u="j">0</b><span>jours</span></div><div><b data-u="h">0</b><span>heures</span></div><div><b data-u="m">0</b><span>min</span></div><div><b data-u="s">0</b><span>sec</span></div></div>';
      function tick() {
        var ms = Math.max(0, end - new Date()), s = Math.floor(ms / 1000);
        var v = { j: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
        Object.keys(v).forEach(function (k) { var el = $('[data-u="' + k + '"]', box); if (el) el.textContent = v[k]; });
      }
      tick(); setInterval(tick, 1000);
    }).catch(function () { box.innerHTML = '<p class="note">Agenda momentanément indisponible.</p>'; });
  }

  /* Actions */
  function renderActions() {
    var box = $("[data-render=actions]");
    if (!box) return;
    data("actions").then(function (d) {
      var limit = +box.getAttribute("data-limit") || 0, cats = {};
      d.categories.forEach(function (c) { cats[c.id] = c; });
      var list = d.actions.slice();
      if (limit) list = list.filter(function (a) { return a.statut === "confirme"; }).slice(0, limit);
      var filt = $("[data-render=actions-filtres]");
      if (filt) {
        filt.innerHTML = '<button type="button" aria-pressed="true" data-f="all">Toutes</button>' + d.categories.map(function (c) { return '<button type="button" aria-pressed="false" data-f="' + esc(c.id) + '">' + esc(c.nom) + "</button>"; }).join("");
        filt.addEventListener("click", function (e) {
          var b = e.target.closest("button"); if (!b) return;
          $$("button", filt).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
          $$("[data-cat]", box).forEach(function (c) { c.hidden = b.dataset.f !== "all" && c.dataset.cat !== b.dataset.f; });
        });
      }
      box.innerHTML = list.map(function (a) {
        var c = cats[a.categorie] || {}, att = a.statut === "a_completer";
        return '<article class="card rev' + (att ? " attente" : "") + '" data-cat="' + esc(a.categorie) + '"><div class="ico">' + icon(c.icone) + "</div>" +
          '<span class="pill' + (att ? " attente" : "") + '">' + esc(c.nom || "") + (att ? " · texte d’attente" : "") + "</span>" +
          "<h3>" + esc(a.titre) + "</h3><p>" + esc(a.texte) + "</p>" +
          (a.lien ? '<p><a href="' + esc(a.lien) + '"' + ext(a.lien) + ">" + esc(a.lien_texte || "En savoir plus") + "</a></p>" : "") + "</article>";
      }).join("");
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Actualités */
  var TYPES = { association: "L’association", presse: "Dans la presse", ville: "Ville de Pontoise" };
  function renderNews() {
    var box = $("[data-render=news]");
    if (!box) return;
    data("news").then(function (d) {
      var limit = +box.getAttribute("data-limit") || 0;
      var list = d.actualites.slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
      if (limit) list = list.slice(0, limit);
      box.innerHTML = list.map(function (n) {
        return '<article class="card actu rev"><span class="pill">' + esc(TYPES[n.type] || "Actualité") + '</span><p class="meta">' + esc(longDate(n.date)) + (n.source ? " · " + esc(n.source) : "") + "</p>" +
          "<h3>" + esc(n.titre) + "</h3><p>" + esc(n.resume) + "</p>" +
          (n.lien ? '<p><a class="more" href="' + esc(n.lien) + '"' + ext(n.lien) + ">Lire la source<span class=\"sr\"> : " + esc(n.titre) + "</span> →</a></p>" : "") + "</article>";
      }).join("");
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Frise */
  function renderTimeline() {
    var box = $("[data-render=timeline]");
    if (!box) return;
    data("timeline").then(function (d) {
      box.innerHTML = d["repères"].map(function (t) {
        return '<li class="rev' + (t.attente ? " attente" : "") + '"><div class="date">' + esc(t.date) + "</div><h3>" + esc(t.titre) + "</h3><p>" + esc(t.texte) + "</p>" +
          (t.source ? '<p class="src">Source : ' + (t.lien ? '<a href="' + esc(t.lien) + '"' + ext(t.lien) + ">" + esc(t.source) + "</a>" : esc(t.source)) + "</p>" : "") + "</li>";
      }).join("");
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Bureau */
  function renderBureau() {
    var box = $("[data-render=bureau]");
    if (!box) return;
    data("bureau").then(function (d) {
      box.innerHTML = d.membres.map(function (m) {
        var att = m.nom === "a_completer";
        return '<div class="card rev' + (att ? " attente" : "") + '"><span class="pill' + (att ? " attente" : "") + '">' + esc(m.role) + "</span><h3>" + (att ? "À compléter" : esc(m.nom)) + "</h3>" +
          (att ? "<p>Texte d’attente : le nom sera ajouté une fois confirmé par l’association.</p>" : "") + "</div>";
      }).join("");
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Liens utiles */
  function renderLinks() {
    var box = $("[data-render=links]");
    if (!box) return;
    data("links").then(function (d) {
      box.innerHTML = d.groupes.map(function (g) {
        return '<div class="rev"><h2>' + esc(g.titre) + '</h2><div class="grid g3">' + g.liens.map(function (l) {
          if (l.attente) return '<div class="card attente"><span class="pill attente">Texte d’attente</span><h3>' + esc(l.nom) + "</h3><p>" + esc(l.texte) + "</p></div>";
          return '<a class="card" href="' + esc(l.url) + '"' + ext(l.url) + "><h3>" + esc(l.nom) + "</h3><p>" + esc(l.texte) + '</p><span class="more">Ouvrir' + (/^https?:/.test(l.url) ? " (nouvel onglet)" : "") + " →</span></a>";
        }).join("") + "</div></div>";
      }).join("");
      $$("[data-render=links] > div").forEach(function (x) { x.style.marginBottom = "3rem"; });
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Galerie + lightbox */
  function renderGallery() {
    var box = $("[data-render=gallery]");
    if (!box) return;
    data("gallery").then(function (d) {
      var filt = $("[data-render=gallery-filtres]");
      filt.innerHTML = '<button type="button" aria-pressed="true" data-f="all">Toutes</button>' + d.categories.map(function (c) { return '<button type="button" aria-pressed="false" data-f="' + esc(c.id) + '">' + esc(c.nom) + "</button>"; }).join("");
      var photos = d.photos.filter(function (p) { return !p.attente; });
      box.innerHTML = d.photos.map(function (p) {
        if (p.attente) return '<div class="tile attente rev" data-cat="' + esc(p.categorie) + '"><div><strong>' + esc(p.legende) + "</strong><br>Envoyez-nous vos photos via la page Contact.</div></div>";
        return '<button type="button" class="tile rev" data-cat="' + esc(p.categorie) + '" data-i="' + photos.indexOf(p) + '"><img src="' + esc(p.mini || p.fichier) + '" alt="' + esc(p.alt) + '" loading="lazy" width="800" height="600"><span class="cap">' + esc(p.legende) + "</span></button>";
      }).join("");
      filt.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        $$("button", filt).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        $$("[data-cat]", box).forEach(function (c) { c.hidden = b.dataset.f !== "all" && c.dataset.cat !== b.dataset.f; });
      });
      var lb = $("#lightbox"), cur = 0, opener = null;
      function show(i) {
        cur = (i + photos.length) % photos.length; var p = photos[cur];
        $("img", lb).src = p.fichier; $("img", lb).alt = p.alt;
        $("p", lb).innerHTML = esc(p.legende) + "<br><small>Crédit : " + (p.credit_lien ? '<a href="' + esc(p.credit_lien) + '" target="_blank" rel="noopener">' + esc(p.credit) + "</a>" : esc(p.credit || "")) + "</small>";
      }
      function close() { lb.classList.remove("open"); document.body.style.overflow = ""; if (opener) opener.focus(); }
      box.addEventListener("click", function (e) {
        var t = e.target.closest("button.tile"); if (!t) return;
        opener = t; show(+t.dataset.i); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".close", lb).focus();
      });
      $(".close", lb).addEventListener("click", close);
      $(".prev", lb).addEventListener("click", function () { show(cur - 1); });
      $(".next", lb).addEventListener("click", function () { show(cur + 1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
      });
      reveal();
    }).catch(function () { fail(box); });
  }

  /* Carte interactive (Leaflet chargé à la demande) */
  var LIEUX = [
    { id: "eglise", nom: "Église Notre-Dame", lat: 49.04941, lon: 2.09236, texte: "Au cœur du faubourg Notre-Dame, place Notre-Dame. Son clocher à lanternon domine le quartier." },
    { id: "gare", nom: "Gare de Pontoise", lat: 49.04705, lon: 2.09530, texte: "Place du Général-de-Gaulle. Le nouveau quartier de la gare, livré en 2022, jouxte le faubourg Notre-Dame." },
    { id: "lavandieres", nom: "Jardin des Lavandières", lat: 49.05183, lon: 2.08799, texte: "Jardin au bord de la Viosne, avec d’anciens lavoirs. Un lieu de promenade et de mémoire de l’eau." }
  ];
  function initMap() {
    var el = $("#carte");
    if (!el) return;
    var list = $("[data-render=lieux]");
    list.innerHTML = LIEUX.map(function (l) { return '<li><button type="button" aria-pressed="false" data-id="' + l.id + '"><strong>' + esc(l.nom) + "</strong>" + esc(l.texte) + "</button></li>"; }).join("");
    function osmLink(l) { return "https://www.openstreetmap.org/?mlat=" + l.lat + "&mlon=" + l.lon + "#map=17/" + l.lat + "/" + l.lon; }
    function load(cb) {
      if (window.L) return cb();
      var css = document.createElement("link"); css.rel = "stylesheet"; css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"; document.head.appendChild(css);
      var s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"; s.onload = cb;
      s.onerror = function () { el.innerHTML = '<p class="note" style="margin:1rem">La carte n’a pas pu se charger. Consultez <a href="https://www.openstreetmap.org/?mlat=49.04941&mlon=2.09236#map=16/49.04941/2.09236" target="_blank" rel="noopener">le quartier sur OpenStreetMap</a>.</p>'; };
      document.head.appendChild(s);
    }
    load(function () {
      var map = L.map(el, { scrollWheelZoom: false }).setView([49.0500, 2.0920], 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© les contributeurs d’<a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>" }).addTo(map);
      var marks = {};
      LIEUX.forEach(function (l) {
        var m = L.marker([l.lat, l.lon], { title: l.nom, alt: l.nom }).addTo(map);
        m.bindPopup("<strong>" + esc(l.nom) + "</strong><br>" + esc(l.texte) + '<br><a href="' + osmLink(l) + '" target="_blank" rel="noopener">Ouvrir sur OpenStreetMap</a>');
        m.on("click", function () { mark(l.id); });
        marks[l.id] = m;
      });
      function mark(id) { $$("button", list).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.id === id); }); }
      list.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        var l = LIEUX.filter(function (x) { return x.id === b.dataset.id; })[0];
        mark(l.id); map.flyTo([l.lat, l.lon], 17, { duration: 1.2 }); marks[l.id].openPopup();
      });
      map.once("focus", function () { map.scrollWheelZoom.enable(); });
    });
  }

  /* Formulaire */
  function initForm() {
    var f = $("#form-contact");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", f), msg = $("#form-msg");
      btn.disabled = true; btn.textContent = "Envoi en cours…";
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(function (r) { if (!r.ok) throw new Error(); window.location.href = "merci.html"; })
        .catch(function () { msg.hidden = false; msg.textContent = "L’envoi n’a pas abouti. Écrivez-nous directement par e-mail ou par téléphone (coordonnées ci-contre)."; btn.disabled = false; btn.textContent = "Envoyer mon message"; });
    });
  }

  reveal(); counters(); renderNextRdv(); renderEvents(); renderActions(); renderNews(); renderTimeline(); renderBureau(); renderLinks(); renderGallery(); initMap(); initForm();
})();
