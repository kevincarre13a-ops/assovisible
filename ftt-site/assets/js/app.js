/* Football Terrasses du Tarn — interactions et rendu des données (data/*.json) */
(function () {
  "use strict";
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var MOIS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function get(name) { return fetch("data/" + name + ".json").then(function (r) { if (!r.ok) throw new Error(name); return r.json(); }); }
  var cache = {};
  function data(name) { return cache[name] || (cache[name] = get(name)); }
  function fmtDate(iso) { var d = new Date(iso); return JOURS[d.getDay()] + " " + d.getDate() + " " + MOIS_LONG[d.getMonth()] + " " + d.getFullYear(); }
  function fmtHour(iso) { var d = new Date(iso); var h = d.getHours(), m = d.getMinutes(); return h + "h" + (m ? (m < 10 ? "0" : "") + m : ""); }
  function fmtShort(s) { var p = s.split("-"); return parseInt(p[2], 10) + " " + MOIS[parseInt(p[1], 10) - 1] + " " + p[0]; }

  /* ---- Menu ---- */
  var header = $(".site-header"), burger = $(".burger"), nav = $("#nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", open);
      nav.classList.toggle("open", open);
      doc.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { burger.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); doc.body.style.overflow = ""; }); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) burger.click(); });
  }
  function onScroll() { header.classList.toggle("solid", window.scrollY > 40); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Apparitions douces ---- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12 }) : null;
  function watch(root) { $$(".reveal:not(.in)", root).forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }
  watch();

  /* ---- Compteurs ---- */
  function runCounter(el) {
    var end = parseFloat(el.dataset.value), dur = 1600, t0 = null;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = end; return; }
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var cio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } }); }, { threshold: .5 }) : null;

  /* ---- Rendus ---- */
  var renderers = {
    counters: function (el) {
      return data("club").then(function (c) {
        el.innerHTML = c.compteurs.map(function (k) {
          var v = k.calcul === "annees_depuis_fondation" ? new Date().getFullYear() - c.fondation : k.value;
          return '<div class="counter reveal"><b data-value="' + v + '">' + v + '</b><span>' + esc(k.label) + "</span></div>";
        }).join("");
        $$("b[data-value]", el).forEach(function (b) { b.textContent = "0"; cio ? cio.observe(b) : (b.textContent = b.dataset.value); });
      });
    },
    next: function (el) {
      return Promise.all([data("matchs"), data("evenements")]).then(function (r) {
        var now = Date.now(), list = [];
        r[0].prochains.forEach(function (m) { list.push({ date: m.date, kind: "Prochain match", titre: m.categorie + " · " + m.domicile + " – " + m.exterieur, lieu: m.lieu, lien: "matchs-resultats.html" }); });
        r[1].evenements.forEach(function (e) { if (!e.fin_date) list.push({ date: e.date, kind: "Prochain rendez-vous", titre: e.titre + " · " + e.lieu.split(",").pop().trim(), lieu: e.lieu, lien: "actualites-evenements.html#evenements" }); });
        list = list.filter(function (x) { return new Date(x.date).getTime() > now; }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
        if (!list.length) { el.innerHTML = '<div class="next-card"><div><div class="label">Prochain rendez-vous</div><h2>Le calendrier arrive bientôt</h2><p class="where">Suivez les actualités du club.</p></div><a class="btn btn-dark" href="actualites-evenements.html">Actualités</a></div>'; return; }
        var n = list[0];
        el.innerHTML = '<div class="next-card"><div><div class="label">' + esc(n.kind) + '</div><h2>' + esc(n.titre) + '</h2><p class="where">' + esc(fmtDate(n.date)) + " · " + esc(fmtHour(n.date)) + " · " + esc(n.lieu) + '</p><a href="' + n.lien + '">Tous les rendez-vous →</a></div><div class="countdown" role="timer" aria-label="Compte à rebours"><div><b data-u="d">0</b><small>jours</small></div><div><b data-u="h">0</b><small>heures</small></div><div><b data-u="m">0</b><small>min</small></div><div><b data-u="s">0</b><small>sec</small></div></div></div>';
        var target = new Date(n.date).getTime();
        function tick() {
          var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
          var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
          Object.keys(v).forEach(function (k) { var b = $('[data-u="' + k + '"]', el); if (b) b.textContent = k === "d" ? v[k] : String(v[k]).padStart(2, "0"); });
        }
        tick(); setInterval(tick, 1000);
      });
    },
    news: function (el) {
      var limit = parseInt(el.dataset.limit || "99", 10);
      return data("actualites").then(function (d) {
        var items = d.actualites.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        var cats = []; items.forEach(function (i) { if (cats.indexOf(i.categorie) < 0) cats.push(i.categorie); });
        var f = el.dataset.filters ? $(el.dataset.filters) : null;
        function draw(cat) {
          var sel = items.filter(function (i) { return !cat || i.categorie === cat; }).slice(0, limit);
          el.innerHTML = sel.map(function (i) {
            var ext = i.lien && /^https?:/.test(i.lien);
            return '<article class="news-card reveal"><div class="thumb">' + (i.image ? '<img src="' + esc(i.image) + '" alt="" loading="lazy">' : '<img class="logo" src="assets/img/logo.png" alt="">') + '</div><div class="body"><div><time datetime="' + esc(i.date) + '">' + esc(fmtShort(i.date)) + '</time><span class="tag">' + esc(i.categorie) + "</span></div><h3>" + esc(i.titre) + "</h3><p>" + esc(i.texte) + "</p>" + (i.lien ? '<a class="more" href="' + esc(i.lien) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(i.lien_label || "En savoir plus") + " →</a>" : "") + (i.credit ? '<span class="credit">' + esc(i.credit) + "</span>" : "") + "</div></article>";
          }).join("");
          watch(el);
        }
        if (f) { f.innerHTML = ['<button aria-pressed="true" data-c="">Tout</button>'].concat(cats.map(function (c) { return '<button aria-pressed="false" data-c="' + esc(c) + '">' + esc(c) + "</button>"; })).join(""); f.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("button", f).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); draw(b.dataset.c); }); }
        draw("");
      });
    },
    events: function (el) {
      var mode = el.dataset.mode || "upcoming", limit = parseInt(el.dataset.limit || "99", 10);
      return data("evenements").then(function (d) {
        var now = Date.now();
        var items = d.evenements.filter(function (e) { var end = e.fin_date ? new Date(e.fin_date + "T23:59:59").getTime() : new Date(e.date).getTime() + 6 * 3600e3; return mode === "past" ? end < now : end >= now; });
        items.sort(function (a, b) { return mode === "past" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date); });
        if (!items.length) { el.innerHTML = '<div class="empty">' + (mode === "past" ? "Les archives apparaîtront ici au fil de la saison." : "Aucun rendez-vous programmé pour le moment : revenez bientôt, ou suivez le club sur Facebook.") + "</div>"; return; }
        el.innerHTML = items.slice(0, limit).map(function (e) {
          var dt = new Date(e.date), rose = e.type === "Solidarité";
          return '<article class="event reveal' + (mode === "past" ? " past" : "") + (rose ? " rose" : "") + '"><div class="date"><b>' + dt.getDate() + "</b><span>" + MOIS[dt.getMonth()] + (mode === "past" ? " " + dt.getFullYear() : "") + '</span></div><div><span class="tag" style="margin:0 0 .3rem">' + esc(e.type) + "</span><h3>" + esc(e.titre) + '</h3><div class="meta">' + (e.fin_date ? "Tout le mois · " : esc(fmtDate(e.date)) + " · " + esc(fmtHour(e.date)) + (e.fin ? " – " + esc(e.fin) : "") + " · ") + esc(e.lieu) + "</div><p>" + esc(e.texte) + "</p>" + (e.affiche ? '<a href="' + esc(e.affiche) + '" target="_blank" rel="noopener">Voir l\'affiche →</a>' : "") + "</div></article>";
        }).join("");
        watch(el);
      });
    },
    teams: function (el) {
      return Promise.all([data("equipes")]).then(function (r) {
        var d = r[0], f = $("#team-filters");
        function draw(g) {
          el.innerHTML = d.equipes.filter(function (t) { return !g || t.groupe === g; }).map(function (t) {
            var seances = t.seances.length ? "<ul>" + t.seances.map(function (s) { return "<li><b>" + esc(s.jour) + "</b> · " + esc(s.heure) + "<br>" + esc(s.lieu) + (s.note ? " <small>(" + esc(s.note) + ")</small>" : "") + "</li>"; }).join("") + "</ul>" : '<p class="pending">Horaires à confirmer</p>';
            return '<button class="team reveal' + (t.attente ? " attente" : "") + '" type="button" aria-label="' + esc(t.nom) + ' : afficher les détails">' + (t.photo ? '<img class="ph" src="' + esc(t.photo) + '" alt="" loading="lazy">' : '<img class="fallback" src="assets/img/logo.png" alt="">') + '<div class="front"><span>' + esc((d.groupes.filter(function (g) { return g.id === t.groupe; })[0] || {}).titre) + "</span><h3>" + esc(t.nom) + '</h3></div><div class="back"><h3>' + esc(t.nom) + "</h3>" + (t.note ? "<p>" + esc(t.note) + "</p>" : "") + seances + '<div class="edu">Éducateur : ' + (t.educateur ? esc(t.educateur) : '<span class="pending">à compléter</span>') + "</div></div></button>";
          }).join("");
          $$(".team", el).forEach(function (b) { b.addEventListener("click", function () { b.classList.toggle("open"); }); });
          watch(el);
        }
        if (f) { f.innerHTML = '<button aria-pressed="true" data-g="">Toutes</button>' + d.groupes.map(function (g) { return '<button aria-pressed="false" data-g="' + g.id + '">' + esc(g.titre) + "</button>"; }).join(""); f.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("button", f).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); draw(b.dataset.g); }); }
        draw("");
      });
    },
    schedule: function (el) {
      return data("equipes").then(function (d) {
        el.innerHTML = '<table class="sched"><thead><tr><th>Équipe</th><th>Jours et horaires</th><th>Lieu</th></tr></thead><tbody>' + d.equipes.map(function (t) {
          var s = t.seances.length ? t.seances.map(function (x) { return esc(x.jour) + " · " + esc(x.heure) + (x.note ? " <small>(" + esc(x.note) + ")</small>" : ""); }).join("<br>") : '<span class="pending">à confirmer</span>';
          var l = t.seances.length ? t.seances.map(function (x) { return esc(x.lieu); }).join("<br>") : "—";
          return "<tr><th scope=\"row\">" + esc(t.nom) + "</th><td>" + s + "</td><td>" + l + "</td></tr>";
        }).join("") + "</tbody></table>";
      });
    },
    matches: function (el) {
      return data("matchs").then(function (d) {
        el.innerHTML = d.prochains.length ? d.prochains.map(function (m) { return '<div class="result reveal"><span class="d">' + esc(fmtDate(m.date)) + "<br>" + esc(fmtHour(m.date)) + "</span><div><b>" + esc(m.domicile) + " – " + esc(m.exterieur) + "</b><small>" + esc(m.categorie) + " · " + esc(m.lieu) + "</small></div><span></span></div>"; }).join("") : '<div class="empty pending">' + esc(d.prochains_attente) + "</div>";
        var r = $("#results"); if (r) r.innerHTML = d.resultats.map(function (m) { return '<div class="result reveal"><span class="d">' + esc(fmtShort(m.date)) + "</span><div><b>" + esc(m.equipes) + "</b><small>" + esc(m.categorie) + " · saison " + esc(m.saison) + " · source " + esc(m.source) + '</small></div><span class="score">' + esc(m.score) + "</span></div>"; }).join("");
        var c = $("#ranking"); if (c) c.textContent = d.classement_attente;
        var l = $("#match-links"); if (l) l.innerHTML = d.liens.map(function (x) { return '<a class="btn btn-outline" target="_blank" rel="noopener" href="' + esc(x.url) + '">' + esc(x.label) + "</a>"; }).join(" ");
        watch(el);
      });
    },
    bureau: function (el) {
      return data("club").then(function (c) {
        el.innerHTML = c.bureau.map(function (p) { var ini = p.nom.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join(""); return '<div class="person reveal"><div class="av" aria-hidden="true">' + esc(ini) + "</div><div><b>" + esc(p.nom) + "</b><span>" + esc(p.role) + "</span></div></div>"; }).join("");
        var e = $("#educateurs"); if (e) e.innerHTML = c.educateurs ? "" : '<p class="pending">' + esc(c.educateurs_attente) + "</p>";
        var v = $("#valeurs"); if (v) v.innerHTML = c.valeurs.map(function (x) { return '<div class="card reveal"><h3>' + esc(x.titre) + "</h3><p>" + esc(x.texte) + "</p></div>"; }).join("");
        watch(el);
      });
    },
    partners: function (el) {
      return data("partenaires").then(function (d) {
        el.innerHTML = d.partenaires.length ? d.partenaires.map(function (p) { var inner = p.logo ? '<img src="' + esc(p.logo) + '" alt="' + esc(p.nom) + '" loading="lazy">' : esc(p.nom); return p.url ? '<a class="partner" target="_blank" rel="noopener sponsored" href="' + esc(p.url) + '">' + inner + "</a>" : '<div class="partner">' + inner + "</div>"; }).join("") : [1, 2, 3, 4, 5, 6].map(function () { return '<div class="partner slot">Votre logo ici</div>'; }).join("");
        var n = $("#partners-note"); if (n) n.textContent = d.partenaires.length ? "" : d.attente;
        var s = $("#soutiens"); if (s) s.innerHTML = d.soutiens.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      });
    },
    stades: function (el) {
      return data("club").then(function (c) {
        el.innerHTML = c.stades.map(function (s) {
          var q = encodeURIComponent(s.requete);
          return '<div class="stade"><div><b>' + esc(s.nom) + "</b><small>" + esc(s.commune) + (s.note ? " · " + esc(s.note) : "") + "</small></div>" + (s.requete ? '<span class="maplinks"><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/search?query=' + q + '">Plan</a><a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + q + '">Itinéraire</a></span>' : '<span class="pending"></span>') + "</div>";
        }).join("");
      });
    },
    inscription: function (el) {
      return data("club").then(function (c) {
        el.innerHTML = '<p class="' + (c.inscription.statut === "attente" ? "pending" : "") + '">' + esc(c.inscription.texte) + "</p><p>" + esc(c.inscription.essai) + "</p>" + (c.inscription.tarifs ? "<p>" + esc(c.inscription.tarifs) + "</p>" : "") + "<p>" + esc(c.boutique) + "</p>";
      });
    },
    gallery: function (el) {
      return data("galerie").then(function (d) {
        var f = $("#gallery-filters"), shown = [];
        function draw(g) {
          shown = d.photos.filter(function (p) { return !g || p.groupe === g; });
          el.innerHTML = shown.map(function (p, i) { return '<figure class="reveal"><button type="button" data-i="' + i + '" aria-label="Agrandir : ' + esc(p.titre) + '"><img src="' + esc(p.src) + '" alt="' + esc(p.titre) + '" loading="lazy"></button><figcaption>' + esc(p.titre) + "<br><small>" + esc(p.credit || d.credit_defaut) + "</small></figcaption></figure>"; }).join("");
          watch(el);
        }
        el.addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (b) openBox(shown, +b.dataset.i, d.credit_defaut); });
        if (f) { f.innerHTML = '<button aria-pressed="true" data-g="">Tout</button>' + d.groupes.map(function (g) { return '<button aria-pressed="false" data-g="' + esc(g) + '">' + esc(g) + "</button>"; }).join(""); f.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("button", f).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); draw(b.dataset.g); }); }
        draw("");
      });
    },
    hero: function (el) {
      return data("galerie").then(function (d) {
        var imgs = d.photos.filter(function (p) { return /photos\//.test(p.src); }).map(function (p) { return p.src; });
        function row(off) { var a = imgs.slice(off).concat(imgs.slice(0, off)); return '<div class="row">' + a.concat(a).map(function (s) { return '<img src="' + s + '" alt="" loading="eager" decoding="async">'; }).join("") + "</div>"; }
        el.innerHTML = row(0) + row(5) + row(10);
      });
    }
  };
  $$("[data-render]").forEach(function (el) { var fn = renderers[el.dataset.render]; if (fn) fn(el).catch(function () { el.innerHTML = '<div class="empty">Contenu momentanément indisponible.</div>'; }); });

  /* ---- Visionneuse ---- */
  var box, cur = [], idx = 0, defCredit = "";
  function buildBox() {
    box = doc.createElement("div"); box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Visionneuse photo");
    box.innerHTML = '<button class="x" aria-label="Fermer">×</button><button class="prev" aria-label="Précédente">‹</button><img alt=""><div class="cap"></div><button class="next-b" aria-label="Suivante">›</button>';
    doc.body.appendChild(box);
    $(".x", box).onclick = closeBox; $(".prev", box).onclick = function () { go(-1); }; $(".next-b", box).onclick = function () { go(1); };
    box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
    doc.addEventListener("keydown", function (e) { if (!box.classList.contains("open")) return; if (e.key === "Escape") closeBox(); if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); });
    var x0 = null; box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0 = null; });
  }
  function show() { var p = cur[idx]; $("img", box).src = p.src; $("img", box).alt = p.titre; $(".cap", box).innerHTML = esc(p.titre) + "<small>" + esc(p.credit || defCredit) + " · " + (idx + 1) + "/" + cur.length + "</small>"; }
  function go(n) { idx = (idx + n + cur.length) % cur.length; show(); }
  function openBox(list, i, credit) { if (!box) buildBox(); cur = list; idx = i; defCredit = credit; show(); box.classList.add("open"); doc.body.style.overflow = "hidden"; $(".x", box).focus(); }
  function closeBox() { box.classList.remove("open"); doc.body.style.overflow = ""; }
  $$("[data-lightbox]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); openBox([{ src: a.getAttribute("href"), titre: a.dataset.title || "", credit: a.dataset.credit }], 0, ""); }); });
})();
