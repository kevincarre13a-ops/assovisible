/* Comité de Solidarité Chemiré-le-Gaudin – Pengakro
   Interactions communes + rendu des contenus de js/data.js */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var D = window.SITE_DATA || {};
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var MOIS_LONG = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function parseDate(s) { if (!s) return null; var p = s.split(/[-T:]/); return new Date(+p[0], +p[1] - 1, +p[2], +(p[3] || 0), +(p[4] || 0)); }
  function fmtDate(s) { var d = parseDate(s); return d ? d.getDate() + " " + MOIS_LONG[d.getMonth()] + " " + d.getFullYear() : ""; }

  /* ---------- En-tête ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var burger = $(".burger"), menu = $("#mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (open) { var f = $("a", menu); if (f) f.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { burger.click(); burger.focus(); }
    });
  }

  /* ---------- Rendus à partir des données ---------- */
  function statusClass(s) { return s === "encours" ? "status status--encours" : s === "attente" ? "status status--attente" : "status"; }

  function projectCard(p) {
    var media = p.images && p.images.length
      ? '<img src="' + esc(p.images[0]) + '" alt="' + esc(p.alts[0] || p.titre) + '" loading="lazy" width="800" height="600">'
      : '<div class="no-img" aria-hidden="true">' + esc(p.titre) + "</div>";
    return '<a class="card project-card reveal" href="projets.html#' + esc(p.id) + '">' +
      '<div class="project-media">' + media + '<span class="' + statusClass(p.statut) + '">' + esc(p.statutLabel) + "</span>" +
      '<span class="project-year">' + esc(p.annee) + "</span></div>" +
      '<div class="project-body"><h3>' + esc(p.titre) + "</h3><p>" + esc(p.resume) + "</p>" +
      (p.aCompleter ? '<p><span class="tag-edit">Texte d\'attente</span></p>' : "") +
      '<span class="more">Voir la fiche <span aria-hidden="true">→</span></span></div></a>';
  }

  $all("[data-render='projets-phares']").forEach(function (el) {
    var n = +el.getAttribute("data-limit") || 3;
    el.innerHTML = (D.projets || []).filter(function (p) { return !p.aCompleter; }).slice(0, n).map(projectCard).join("");
  });

  $all("[data-render='projets']").forEach(function (el) {
    el.innerHTML = (D.projets || []).map(function (p, i) {
      var imgs = p.images || [];
      var media = imgs.length
        ? '<img src="' + esc(imgs[0]) + '" alt="' + esc(p.alts[0] || p.titre) + '" loading="lazy" data-main>' +
          (imgs.length > 1 ? '<div class="thumbs">' + imgs.map(function (src, k) {
            return '<button type="button" data-src="' + esc(src) + '" data-alt="' + esc(p.alts[k] || "") + '" aria-label="Afficher la photo ' + (k + 1) + ' : ' + esc(p.alts[k] || "") + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
          }).join("") + "</div>" : "")
        : '<div class="no-img" style="position:absolute;inset:0" aria-hidden="true">' + esc(p.titre) + "</div>";
      return '<article class="project-sheet reveal" id="' + esc(p.id) + '" data-statut="' + esc(p.statut) + '">' +
        '<div class="sheet-media">' + media + '<span class="' + statusClass(p.statut) + '">' + esc(p.statutLabel) + "</span></div>" +
        '<div class="sheet-body">' +
        (p.aCompleter ? '<p><span class="tag-edit">Texte d\'attente à compléter</span></p>' : "") +
        "<h2 style=\"font-size:clamp(1.7rem,3vw,2.3rem)\">" + esc(p.titre) + "</h2>" +
        '<p class="lead" style="font-size:1.15rem">' + esc(p.resume) + "</p>" +
        '<dl class="sheet-meta"><div class="meta"><dt>Lieu</dt><dd>' + esc(p.lieu) + '</dd></div><div class="meta"><dt>Période</dt><dd>' + esc(p.periode) + '</dd></div>' +
        '<div class="meta"><dt>Avancement</dt><dd>' + esc(p.statutLabel) + '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + (+p.avancement || 0) + '" aria-label="Avancement"><span data-w="' + (+p.avancement || 0) + '"></span></div></dd></div></dl>' +
        "<h4>Objectif</h4><p>" + esc(p.objectif) + "</p>" +
        (p.details && p.details.length ? "<h4>En détail</h4><ul>" + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" : "") +
        "<h4>Résultats</h4><p>" + esc(p.resultats) + "</p>" +
        (p.reste ? '<p class="placeholder-note"><strong>Besoin actuel :</strong> ' + esc(p.reste) + ' <a href="soutenir.html#parrainer">Parrainer ce besoin</a></p>' : "") +
        '<p class="source">Source : ' + esc(p.source) + "</p></div></article>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-src]"); if (!b) return;
      var main = $("img[data-main]", b.closest(".sheet-media"));
      main.src = b.getAttribute("data-src"); main.alt = b.getAttribute("data-alt");
    });
  });

  function calendar(ev) {
    var d = parseDate(ev.date);
    if (!d) return '<div class="event-cal" aria-hidden="true"><div class="m">Bientôt</div><div class="d">?</div><div class="y">à fixer</div></div>';
    return '<div class="event-cal" aria-hidden="true"><div class="m">' + MOIS[d.getMonth()] + '</div><div class="d">' + (ev.jourIncertain ? "•" : d.getDate()) + '</div><div class="y">' + (ev.anneeIncertaine ? "?" : d.getFullYear()) + "</div></div>";
  }
  function eventRow(ev) {
    return '<article class="event-row reveal">' + calendar(ev) +
      "<div>" + (ev.aCompleter ? '<span class="tag-edit">Texte d\'attente</span> ' : "") +
      "<h3>" + esc(ev.titre) + '</h3><p class="where">' + esc(ev.dateTexte) + (ev.anneeIncertaine ? " (année à confirmer)" : "") + " · " + esc(ev.lieu) + "</p><p>" + esc(ev.texte) + "</p>" +
      (ev.source ? '<p class="source">Source : ' + esc(ev.source) + "</p>" : "") + "</div>" +
      (ev.image ? '<div class="event-thumb"><img src="' + esc(ev.image) + '" alt="' + esc(ev.imageAlt) + '" loading="lazy"></div>' : '<div class="event-thumb"><div class="no-img" aria-hidden="true">Comité Chemiré – Pengakro</div></div>') +
      "</article>";
  }
  $all("[data-render='evenements-a-venir']").forEach(function (el) {
    el.innerHTML = (D.evenements || []).filter(function (e) { return e.a_venir; }).map(eventRow).join("") || "<p>Aucun événement annoncé pour le moment.</p>";
  });
  $all("[data-render='evenements-archives']").forEach(function (el) {
    el.innerHTML = (D.evenements || []).filter(function (e) { return !e.a_venir; })
      .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); }).map(eventRow).join("");
  });

  function newsCard(n) {
    return '<article class="card news-card reveal" data-side="' + esc(n.cote) + '"><div class="news-media"><img src="' + esc(n.image) + '" alt="' + esc(n.imageAlt) + '" loading="lazy">' +
      '<span class="news-side ' + (n.cote === "ci" ? "news-side--ci" : "news-side--fr") + '">' + (n.cote === "ci" ? "À Pengakro" : "À Chemiré") + "</span></div>" +
      '<div class="news-body"><p class="news-date"><time datetime="' + esc(n.date) + '">' + fmtDate(n.date) + "</time></p><h3>" + esc(n.titre) + "</h3><p>" + esc(n.texte) + "</p>" +
      '<p class="source">Source : ' + (n.lien ? '<a href="' + esc(n.lien) + '" target="_blank" rel="noopener">' + esc(n.source) + ' <span class="sr-only">(nouvel onglet)</span></a>' : esc(n.source)) + "</p></div></article>";
  }
  $all("[data-render='actualites']").forEach(function (el) {
    var n = +el.getAttribute("data-limit") || 99, cote = el.getAttribute("data-cote");
    el.innerHTML = (D.actualites || []).filter(function (a) { return !cote || a.cote === cote; })
      .sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, n).map(newsCard).join("");
  });

  $all("[data-render='chiffres']").forEach(function (el) {
    el.innerHTML = (D.chiffres || []).map(function (c, i) {
      return '<div class="stat reveal reveal-delay-' + (i % 4) + '"><div class="stat-num"><span data-count="' + c.valeur + '">0</span>' + (c.unite ? '<span class="unit">' + esc(c.unite) + "</span>" : "") +
        '</div><p class="stat-label">' + esc(c.label) + '<span class="stat-src">' + esc(c.source) + "</span></p></div>";
    }).join("");
  });

  /* Prochain événement + compte à rebours */
  $all("[data-render='prochain-evenement']").forEach(function (el) {
    var ev = D.prochainEvenement; if (!ev) return;
    var d = parseDate(ev.date);
    var future = d && d > new Date();
    el.innerHTML = '<div class="event-feature reveal"><div class="event-feature-media"><img src="' + esc(ev.image) + '" alt="' + esc(ev.imageAlt) + '" loading="lazy"></div>' +
      '<div class="event-feature-body"><span class="event-date">' + (future ? fmtDate(ev.date) : "Date à annoncer") + "</span><h3>" + esc(ev.titre) + "</h3>" +
      '<p style="color:#e9dcc2;font-weight:700">' + esc(ev.lieu) + '</p><p>' + esc(ev.texte) + "</p>" +
      '<div class="countdown" aria-live="off" aria-label="Compte à rebours">' +
      ["Jours", "Heures", "Min.", "Sec."].map(function (l) { return '<div class="cd-box"><div class="cd-num">' + (future ? "00" : "--") + '</div><div class="cd-label">' + l + "</div></div>"; }).join("") + "</div>" +
      (ev.aCompleter && !future ? '<p class="placeholder-note"><strong>À compléter :</strong> indiquez la date dans <code>js/data.js</code> (rubrique « prochainEvenement ») et le compte à rebours démarrera automatiquement.</p>' : "") +
      '<div class="btn-row"><a class="btn btn--primary" href="evenements.html">Voir l\'agenda</a><a class="btn btn--ghost" href="soutenir.html#benevole">Donner un coup de main</a></div></div></div>';
    if (future) {
      var nums = $all(".cd-num", el);
      var tick = function () {
        var s = Math.max(0, Math.floor((d - new Date()) / 1000));
        var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
        nums.forEach(function (n, i) { n.textContent = (v[i] < 10 ? "0" : "") + v[i]; });
      };
      tick(); setInterval(tick, 1000);
    }
  });

  /* Galerie + filtres + visionneuse */
  $all("[data-render='galerie']").forEach(function (el) {
    var items = D.galerie || [];
    el.innerHTML = items.map(function (g, i) {
      return '<button type="button" class="g-item reveal" data-cat="' + esc(g.cat) + '" data-i="' + i + '" aria-label="Agrandir : ' + esc(g.alt) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"><span class="g-cap">' + esc(g.groupe) + " — " + esc(g.alt) + "</span></button>";
    }).join("");
    var lb = $("#lightbox"), lbImg = $("#lightbox img"), lbCap = $("#lightbox figcaption"), cur = 0, lastFocus;
    function visible() { return $all(".g-item", el).filter(function (b) { return !b.hidden; }).map(function (b) { return +b.getAttribute("data-i"); }); }
    function show(i) { cur = i; var g = items[i]; lbImg.src = g.src; lbImg.alt = g.alt; lbCap.textContent = g.groupe + " — " + g.alt; }
    function open(i) { lastFocus = document.activeElement; show(i); lb.classList.add("is-open"); document.body.classList.add("menu-open"); $(".lb-close", lb).focus(); }
    function close() { lb.classList.remove("is-open"); document.body.classList.remove("menu-open"); if (lastFocus) lastFocus.focus(); }
    function step(k) { var v = visible(), p = v.indexOf(cur); show(v[(p + k + v.length) % v.length]); }
    el.addEventListener("click", function (e) { var b = e.target.closest(".g-item"); if (b) open(+b.getAttribute("data-i")); });
    if (lb) {
      $(".lb-close", lb).addEventListener("click", close);
      $(".lb-prev", lb).addEventListener("click", function () { step(-1); });
      $(".lb-next", lb).addEventListener("click", function () { step(1); });
      lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
      document.addEventListener("keydown", function (e) {
        if (!lb.classList.contains("is-open")) return;
        if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1);
      });
    }
  });

  /* Filtres génériques (galerie, projets) */
  $all("[data-filter-target]").forEach(function (bar) {
    var target = $(bar.getAttribute("data-filter-target")), attr = bar.getAttribute("data-filter-attr") || "data-cat";
    bar.addEventListener("click", function (e) {
      var b = e.target.closest(".filter-btn"); if (!b) return;
      $all(".filter-btn", bar).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      var v = b.getAttribute("data-value");
      Array.prototype.forEach.call(target.children, function (c) {
        c.hidden = !(v === "all" || c.getAttribute(attr) === v);
        if (!c.hidden) c.classList.add("is-visible");
      });
    });
  });

  /* ---------- Apparitions douces, compteurs, barres ---------- */
  function countUp(el) {
    var end = +el.getAttribute("data-count"), t0 = null, dur = 1800;
    if (reduce) { el.textContent = end.toLocaleString("fr-FR"); return; }
    function f(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e).toLocaleString("fr-FR"); if (p < 1) requestAnimationFrame(f); }
    requestAnimationFrame(f);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target;
        t.classList.add("is-visible");
        $all("[data-count]", t).concat(t.hasAttribute("data-count") ? [t] : []).forEach(function (c) { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
        $all(".progress span", t).forEach(function (s) { s.style.width = s.getAttribute("data-w") + "%"; });
        io.unobserve(t);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $all(".reveal").forEach(function (r) { io.observe(r); });
  } else {
    $all(".reveal").forEach(function (r) { r.classList.add("is-visible"); });
    $all("[data-count]").forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  /* Année du pied de page */
  $all("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
