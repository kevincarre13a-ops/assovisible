/* ATLACE — script commun : en-tête, pied de page, contenus issus du dossier /data, animations. */
(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.remove("no-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = doc.body.getAttribute("data-page") || "";

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function getJSON(name) {
    return fetch("data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(name);
      return r.json();
    });
  }
  function img(file) { return file ? "assets/img/" + encodeURI(file) : ""; }
  function parseDate(s) { var p = String(s).split("-"); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function fmtDate(s) { var d = parseDate(s); return d.getDate() + " " + MOIS[d.getMonth()] + " " + d.getFullYear(); }

  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    up: '<path d="M6 14l6-6 6 6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>',
    phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r=".8" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.500 8.500l-2 5-5 2 2-5z"/>',
    star: '<path d="M12 3l2.600 5.600 6 .8-4.400 4.200 1.100 6L12 16.700 6.700 19.600l1.100-6L3.400 9.400l6-.8z"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 8v2h18v-2a2 2 0 0 1 0-8V6H3z"/><path d="M13 6v12" stroke-dasharray="2 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z"/>',
    users: '<circle cx="9" cy="8" r="3.500"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><path d="M16 4.500a3.500 3.500 0 0 1 0 7M18 14c2.500.7 4 2.500 4 6"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21h15"/>'
  };
  function icon(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[n] || "") + "</svg>";
  }
  window.ATLACE_ICON = icon;

  /* ---------- Révélation à l'apparition ---------- */
  var io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;
  function reveal(root) {
    $$(".reveal", root).forEach(function (el, i) {
      if (!io) { el.classList.add("is-in"); return; }
      el.style.transitionDelay = Math.min(i % 6, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---------- En-tête & pied de page ---------- */
  function buildChrome(site) {
    var c = site.contact;
    var hd = $("#site-header");
    if (hd) {
      var links = site.menu.map(function (m) {
        var cur = m.page === (doc.body.getAttribute("data-file") || "") ? ' aria-current="page"' : "";
        return '<li><a href="' + esc(m.page) + '"' + cur + ">" + esc(m.titre) + "</a></li>";
      }).join("");
      hd.className = "site-header";
      hd.innerHTML = '<div class="wrap"><a class="brand" href="index.html" aria-label="ATLACE, retour à l\'accueil"><img src="assets/img/logo-atlace.png" srcset="assets/img/logo-atlace.png 1x, assets/img/logo-atlace@2x.png 2x" width="40" height="46" alt=""><b>ATLACE</b></a>' +
        '<button class="burger" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Ouvrir le menu">' + icon("menu") + "</button>" +
        '<nav class="nav" id="main-nav" aria-label="Navigation principale"><ul>' + links + "</ul></nav></div>";
      var burger = $(".burger", hd), nav = $("#main-nav", hd);
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        hd.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open);
        burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
        burger.innerHTML = icon(open ? "close" : "menu");
        doc.body.style.overflow = open ? "hidden" : "";
      });
      doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) burger.click(); });
      var onScroll = function () {
        hd.classList.toggle("is-solid", window.scrollY > 24);
        var bt = $(".back-top"); if (bt) bt.classList.toggle("is-on", window.scrollY > 700);
      };
      window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    }
    var ft = $("#site-footer");
    if (ft) {
      ft.className = "site-footer";
      var fl = site.menu.map(function (m) { return '<li><a href="' + esc(m.page) + '">' + esc(m.titre) + "</a></li>"; }).join("");
      var adr = site.adresses.map(function (a) { return esc(a.adresse) + ", " + esc(a.cp) + " " + esc(a.ville); }).join("<br>");
      var soc = site.reseaux.map(function (r) {
        return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" aria-label="' + esc(r.nom) + '">' + icon(r.icone) + "</a>";
      }).join("");
      ft.innerHTML = '<div class="wrap"><div class="foot">' +
        '<div><a class="brand" href="index.html"><img src="assets/img/logo-atlace@2x.png" width="56" height="64" alt=""><b>ATLACE</b></a>' +
        '<p style="margin-top:14px">' + esc(site.nomComplet) + ". Association loi 1901 à but non lucratif, créée à Noël " + site.creation + ".</p>" +
        '<div class="social">' + soc + "</div></div>" +
        "<div><h3>Le site</h3><ul>" + fl + '<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>' +
        "<div><h3>Contact</h3><address><p><a href=\"mailto:" + esc(c.email) + '">' + esc(c.email) + "</a><br>" +
        '<a href="tel:' + esc(c.mobileLien) + '">' + esc(c.mobile) + '</a> (' + esc(c.responsable.split(" ")[0]) + ")<br>" +
        '<a href="tel:' + esc(c.fixeLien) + '">' + esc(c.fixe) + "</a><br><small>" + esc(c.horaires) + "</small></p></address></div>" +
        "<div><h3>Nous rencontrer</h3><address><p>" + adr + '</p></address><p><small>Sur rendez-vous uniquement.</small></p></div>' +
        '</div><div class="legal"><span>© ' + new Date().getFullYear() + " ATLACE — Tous droits réservés.</span>" +
        '<span><a href="mentions-legales.html">Mentions légales</a> · <a href="contact.html">Nous rejoindre</a></span></div></div>';
    }
    var bt = doc.createElement("button");
    bt.className = "back-top"; bt.type = "button"; bt.setAttribute("aria-label", "Revenir en haut de la page"); bt.innerHTML = icon("up");
    bt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    doc.body.appendChild(bt);
  }

  /* ---------- Chiffres animés ---------- */
  function counters(site) {
    var host = $("#stats"); if (!host) return;
    var years = new Date().getFullYear() - site.creation;
    host.innerHTML = site.chiffres.map(function (s) {
      var v = s.valeur === "AUTO_ANNEES" ? years : s.valeur;
      return '<div class="stat reveal"><b data-to="' + v + '" data-suffix="' + esc(s.suffixe) + '">' + v + esc(s.suffixe) + "</b><span>" + esc(s.libelle) + "</span></div>";
    }).join("");
    reveal(host);
    var els = $$("b[data-to]", host);
    function run(el) {
      var to = +el.getAttribute("data-to"), suf = el.getAttribute("data-suffix"), t0 = null;
      if (reduce) return;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = "0" + suf; requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (en) {
        en.forEach(function (x) { if (x.isIntersecting) { run(x.target); o.unobserve(x.target); } });
      }, { threshold: 0.6 });
      els.forEach(function (e) { o.observe(e); });
    }
  }

  /* ---------- Héros : diaporama ---------- */
  function hero() {
    var slides = $$(".hero__slides span"); if (slides.length < 2) { if (slides[0]) slides[0].classList.add("is-on"); return; }
    var i = 0; slides[0].classList.add("is-on");
    if (reduce) return;
    setInterval(function () {
      slides[i].classList.remove("is-on"); i = (i + 1) % slides.length; slides[i].classList.add("is-on");
    }, 6500);
  }

  /* ---------- Événements ---------- */
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function split(evs) {
    var t = today();
    var up = evs.filter(function (e) { return parseDate(e.dateFin || e.date) >= t; }).sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    var past = evs.filter(function (e) { return parseDate(e.dateFin || e.date) < t; }).sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
    return { up: up, past: past };
  }
  function evLink(e) {
    if (!e.lien) return "";
    var ext = /^https?:/.test(e.lien) ? ' target="_blank" rel="noopener"' : "";
    return '<p><a class="btn btn--line" href="' + esc(e.lien) + '"' + ext + ">" + esc(e.lienTexte || "En savoir plus") + " " + icon("arrow") + "</a></p>";
  }
  function evCard(e) {
    return '<article class="ev reveal" id="' + esc(e.id) + '"><div class="ev__date">' + esc(e.dateTexte || fmtDate(e.date)) + "</div>" +
      '<div class="ev__img"' + (e.image ? ' style="background-image:url(\'' + img(e.image) + "')\"" : ' style="background:linear-gradient(135deg,var(--teal),var(--ocean))"') + ' role="img" aria-label="' + esc(e.titre) + '"></div>' +
      '<div class="ev__body"><span class="tag">' + esc(e.categorie || "Événement") + "</span><h3>" + esc(e.titre) + "</h3>" +
      '<div class="meta">' + (e.lieu ? "<span>" + icon("pin") + esc(e.lieu) + "</span>" : "") + (e.tarif ? "<span>" + icon("ticket") + esc(e.tarif) + "</span>" : "") + "</div>" +
      "<p>" + esc(e.resume) + "</p>" + evLink(e) + "</div></article>";
  }
  function nextEvent(up) {
    var host = $("#next-event"); if (!host) return;
    var e = up[0];
    if (!e) {
      host.innerHTML = '<div class="empty"><h3>Le prochain rendez-vous arrive bientôt</h3><p>Écrivez-nous pour recevoir les programmes en avant-première.</p><a class="btn btn--dark" href="contact.html">Nous contacter</a></div>';
      return;
    }
    var approx = /confirm/i.test(e.dateTexte || "");
    host.innerHTML = '<div class="next reveal"><div class="next__img" style="background-image:linear-gradient(0deg,rgba(11,53,82,.4),transparent),url(\'' + (e.image ? img(e.image) : img("hero-alpes.jpg")) + '\')" role="img" aria-label="' + esc(e.titre) + '"></div>' +
      '<div class="next__body"><span class="kicker">Prochain rendez-vous</span><h2>' + esc(e.titre) + "</h2>" +
      '<div class="meta"><span>' + icon("cal") + esc(e.dateTexte || fmtDate(e.date)) + "</span>" + (e.lieu ? "<span>" + icon("pin") + esc(e.lieu) + "</span>" : "") + "</div>" +
      '<div class="countdown" id="cd" role="timer" aria-live="off"><div><b data-u="d">0</b><small>jours</small></div><div><b data-u="h">0</b><small>heures</small></div><div><b data-u="m">0</b><small>min</small></div><div><b data-u="s">0</b><small>sec</small></div></div>' +
      (approx ? '<p class="note">Compte à rebours indicatif : les dates exactes seront confirmées.</p>' : "") +
      "<p>" + esc(e.resume) + '</p><a class="btn btn--primary" href="' + esc(e.lien || "contact.html") + '">' + (e.lien ? "Voir le détail" : "Je m'informe") + " " + icon("arrow") + '</a> <a class="btn btn--ghost" href="agenda.html">Tout l\'agenda</a></div></div>';
    reveal(host);
    var target = parseDate(e.date).getTime();
    function tick() {
      var ms = Math.max(target - Date.now(), 0), s = Math.floor(ms / 1000);
      var v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      Object.keys(v).forEach(function (k) { var b = $('[data-u="' + k + '"]', host); if (b) b.textContent = v[k]; });
    }
    tick(); setInterval(tick, 1000);
  }
  function posters(evs) {
    var host = $("#posters"); if (!host) return;
    var list = split(evs); var all = list.up.concat(list.past).filter(function (e) { return e.image; }).slice(0, 10);
    host.innerHTML = '<div class="carousel__btns"><button type="button" data-d="-1" aria-label="Affiches précédentes">' + icon("left") + '</button><button type="button" data-d="1" aria-label="Affiches suivantes">' + icon("right") + "</button></div>" +
      '<div class="carousel__track" tabindex="0" aria-label="Carrousel d\'affiches">' + all.map(function (e) {
        return '<a class="poster" href="agenda.html#' + esc(e.id) + '" style="background-image:url(\'' + img(e.image) + '\')"><div><small>' + esc(e.dateTexte || "") + "</small><b>" + esc(e.titre) + "</b></div></a>";
      }).join("") + "</div>";
    var tr = $(".carousel__track", host);
    $$("button", host).forEach(function (b) { b.addEventListener("click", function () { tr.scrollBy({ left: (+b.getAttribute("data-d")) * 320, behavior: reduce ? "auto" : "smooth" }); }); });
  }
  function agenda(evs) {
    var up = $("#events-upcoming"), arch = $("#events-archive"); if (!up && !arch) return;
    var l = split(evs);
    if (up) {
      up.innerHTML = l.up.length ? l.up.map(evCard).join("") : '<div class="empty"><h3>Pas d\'événement annoncé pour le moment</h3><p>Le prochain programme arrive bientôt. Écrivez-nous pour le recevoir en avant-première.</p><a class="btn btn--dark" href="contact.html">Nous contacter</a></div>';
    }
    if (arch) {
      var cats = ["Tout"]; l.past.forEach(function (e) { if (e.categorie && cats.indexOf(e.categorie) < 0) cats.push(e.categorie); });
      var f = $("#archive-filters");
      function draw(cat) {
        arch.innerHTML = l.past.filter(function (e) { return cat === "Tout" || e.categorie === cat; }).map(evCard).join("");
        reveal(arch);
        $$(".chip", f).forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-c") === cat); });
      }
      f.innerHTML = cats.map(function (c) { return '<button type="button" class="chip" data-c="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      f.addEventListener("click", function (ev) { var b = ev.target.closest(".chip"); if (b) draw(b.getAttribute("data-c")); });
      draw("Tout");
    }
    reveal(doc);
    if (location.hash) { var t = doc.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  /* ---------- Activités, équipe, locations ---------- */
  function activities(d) {
    var host = $("#activities"); if (!host) return;
    host.innerHTML = d.activites.map(function (a) {
      return '<article class="act reveal" id="' + esc(a.id) + '"><div class="act__img" style="background-image:url(\'' + img(a.image) + '\')"><span class="act__ico">' + icon(a.icone) + "</span></div>" +
        '<div class="act__body"><h2>' + esc(a.titre) + "</h2><p>" + esc(a.texte) + "</p><dl>" +
        "<div><dt>Quand</dt><dd>" + esc(a.quand) + "</dd></div><div><dt>Où</dt><dd>" + esc(a.lieu) + "</dd></div><div><dt>Tarif</dt><dd>" + esc(a.tarif) + "</dd></div></dl>" +
        '<p style="margin-top:20px"><a class="btn btn--dark" href="contact.html">Je m\'inscris / Je me renseigne ' + icon("arrow") + "</a></p></div></article>";
    }).join("");
    reveal(host);
  }
  function team(d) {
    var h = $("#team"), p = $("#partners");
    if (h) {
      h.innerHTML = d.equipe.map(function (m) {
        return '<article class="card reveal"><div class="card__img">' + (m.photo ? '<img src="' + img(m.photo) + '" alt="' + esc(m.nom) + '" loading="lazy">' : icon("users")) + '</div><div class="card__body"><span class="tag">' + esc(m.role) + "</span><h3>" + esc(m.nom) + "</h3><p>" + esc(m.texte) + "</p></div></article>";
      }).join("");
      reveal(h);
    }
    if (p) {
      p.innerHTML = d.partenaires.map(function (m) {
        return '<a class="card card--link reveal" href="' + esc(m.url) + '" target="_blank" rel="noopener"><div class="card__body"><h3>' + esc(m.nom) + "</h3><p>" + esc(m.texte) + '</p><span class="more">Visiter le site ' + icon("arrow") + "</span></div></a>";
      }).join("");
      reveal(p);
    }
  }
  function locations(d) {
    var h = $("#locations"); if (!h) return;
    h.innerHTML = d.locations.map(function (l) {
      return '<article class="loc reveal"><span class="tag">' + esc(l.type) + "</span><b>" + esc(l.lieu) + "</b><span>" + esc(l.capacite) + '</span><span class="price">' + esc(l.prix) + "</span><span>" + esc(l.texte) + "</span></article>";
    }).join("");
    reveal(h);
  }

  /* ---------- Actualités ---------- */
  function news(d) {
    var h = $("#news"); if (!h) return;
    var lim = +h.getAttribute("data-limit") || 99;
    h.innerHTML = d.actualites.slice(0, lim).map(function (n) {
      return '<article class="card reveal">' + (n.image ? '<div class="card__img"><img src="' + img(n.image) + '" alt="" loading="lazy"></div>' : "") +
        '<div class="card__body"><span class="tag">' + esc(n.categorie || "Actualité") + "</span>" + (n.date ? '<span class="meta"><span>' + icon("cal") + fmtDate(n.date) + "</span></span>" : "") +
        "<h3>" + esc(n.titre) + "</h3><p>" + esc(n.texte) + "</p></div></article>";
    }).join("");
    reveal(h);
  }

  /* ---------- Galerie ---------- */
  function gallery(d) {
    var h = $("#gallery"); if (!h) return;
    var f = $("#gallery-filters");
    function draw(id) {
      h.innerHTML = d.groupes.filter(function (g) { return id === "all" || g.id === id; }).map(function (g) {
        return '<section class="gallery-group" aria-labelledby="g-' + esc(g.id) + '"><h2 id="g-' + esc(g.id) + '">' + esc(g.titre) + '</h2><div class="masonry">' + g.photos.map(function (p) {
          return '<figure class="reveal" style="margin:0"><button type="button" class="shot" data-src="' + img(p.fichier) + '" data-cap="' + esc(p.legende) + '" aria-label="Agrandir : ' + esc(p.legende) + '"><img src="' + img(p.fichier) + '" alt="' + esc(p.legende) + '" loading="lazy"><figcaption>' + esc(p.legende) + "</figcaption></button></figure>";
        }).join("") + "</div></section>";
      }).join("");
      $$(".chip", f).forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-c") === id); });
      reveal(h);
    }
    f.innerHTML = '<button type="button" class="chip" data-c="all">Tout</button>' + d.groupes.map(function (g) { return '<button type="button" class="chip" data-c="' + esc(g.id) + '">' + esc(g.titre) + "</button>"; }).join("");
    f.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) draw(b.getAttribute("data-c")); });
    draw("all");
    var lb = $("#lightbox");
    h.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-src]"); if (!b) return;
      $("img", lb).src = b.getAttribute("data-src"); $("img", lb).alt = b.getAttribute("data-cap"); $("p", lb).textContent = b.getAttribute("data-cap");
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest("button")) lb.close(); });
  }

  /* ---------- Formulaire de contact (Netlify Forms) ---------- */
  function form() {
    var f = $("#contact-form"); if (!f) return;
    var p = new URLSearchParams(location.search).get("sujet");
    if (p && f.sujet) f.sujet.value = p;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var st = $("#form-status"), btn = $("button[type=submit]", f);
      btn.disabled = true; st.className = "status"; st.textContent = "Envoi en cours…";
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(function (r) { if (!r.ok) throw new Error(r.status); location.href = "merci.html"; })
        .catch(function () {
          btn.disabled = false; st.className = "status ko";
          st.innerHTML = "L'envoi n'a pas abouti. Écrivez-nous directement à <a href=\"mailto:atlace@orange.fr\">atlace@orange.fr</a> ou appelez-nous.";
        });
    });
  }

  /* ---------- Démarrage ---------- */
  function start() {
    reveal(doc); hero(); form();
    getJSON("site").then(function (s) { buildChrome(s); counters(s); }).catch(function () {
      var hd = $("#site-header"); if (hd) { hd.className = "site-header is-solid"; hd.innerHTML = '<div class="wrap"><a class="brand" href="index.html"><b>ATLACE</b></a></div>'; }
    });
    if ($("#next-event,#posters,#events-upcoming,#events-archive")) getJSON("events").then(function (d) { var l = split(d.evenements); nextEvent(l.up); posters(d.evenements); agenda(d.evenements); }).catch(function () {});
    if ($("#activities")) getJSON("activities").then(activities).catch(function () {});
    if ($("#team,#partners")) getJSON("team").then(team).catch(function () {});
    if ($("#locations")) getJSON("locations").then(locations).catch(function () {});
    if ($("#news")) getJSON("news").then(news).catch(function () {});
    if ($("#gallery")) getJSON("gallery").then(gallery).catch(function () {});
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start); else start();
})();
