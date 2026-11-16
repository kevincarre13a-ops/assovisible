/* IB Academy — interactions & rendu des données (aucune dépendance) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var D = window.IB || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]; }); };
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var parseDate = function (d, h) { return new Date(d + "T" + (h || "12:00") + ":00"); };
  var fmtLong = function (d) { return parseDate(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- En-tête / menu ---------- */
  var header = $(".site-header"), burger = $(".burger");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { header.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("open")) burger.click(); });
  }
  var toTop = $(".to-top");
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 30);
    if (toTop) toTop.classList.toggle("show", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- Données club dans le DOM ---------- */
  $$("[data-club]").forEach(function (el) { var v = D.club && D.club[el.getAttribute("data-club")]; if (v) el.textContent = v; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Réseaux sociaux : n'affiche que les liens renseignés */
  var ICONS = {
    facebook: '<path d="M14 9h3V5h-3c-2.8 0-4 1.8-4 4v2H8v4h2v8h4v-8h3l1-4h-4V9.5c0-.3.2-.5.5-.5z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/>',
    tiktok: '<path d="M16 3c.4 2.3 1.9 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6v3.3a2.7 2.7 0 1 0 2.7 2.7V3z"/>',
    youtube: '<path d="M22 8.2s-.2-1.6-.9-2.3c-.8-.9-1.8-.9-2.2-1C15.9 4.7 12 4.7 12 4.7s-3.9 0-6.9.2c-.4.1-1.4.1-2.2 1C2.2 6.6 2 8.2 2 8.2S1.8 10 1.8 11.9v1.7c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.8.9 1.9.8 2.4.9 1.7.2 6.7.2 6.7.2s3.9 0 6.9-.2c.4-.1 1.4-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.7C22.2 10 22 8.2 22 8.2zM9.8 15.4V8.9l5.6 3.3-5.6 3.2z"/>'
  };
  $$("[data-socials]").forEach(function (box) {
    var r = (D.club && D.club.reseaux) || {}, html = "";
    Object.keys(ICONS).forEach(function (k) { if (r[k]) html += '<a href="' + esc(r[k]) + '" target="_blank" rel="noopener" aria-label="IB Academy sur ' + k + '"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + ICONS[k] + "</svg></a>"; });
    if (html) box.innerHTML = html; else box.remove();
  });

  /* ---------- Prochain match + compte à rebours ---------- */
  var now = new Date();
  var upcoming = (D.matchs || []).filter(function (m) { return m.statut !== "annule" && parseDate(m.date, m.heure) > now; })
    .sort(function (a, b) { return parseDate(a.date, a.heure) - parseDate(b.date, b.heure); });
  var nm = $("[data-next-match]");
  if (nm) {
    var m = upcoming[0];
    var logo = '<img src="assets/img/logo-ib.svg" alt="" width="70" height="82">';
    var teamHtml = function (n) { var ib = /ib academy/i.test(n); return '<div class="team"><div class="team__logo">' + (ib ? logo : esc((n || "?").charAt(0))) + '</div><div class="team__name">' + esc(n) + "</div></div>"; };
    if (m) {
      nm.innerHTML = teamHtml(m.domicile) + '<div class="vs">VS</div>' + teamHtml(m.exterieur) +
        '<div class="match-meta"><span><b class="hl">' + esc(m.categorie) + "</b></span><span>" + esc(fmtLong(m.date)) + " · " + esc(m.heure) + "</span><span>" + esc(m.lieu || "") + "</span><span>" + esc(m.competition || "") + "</span>" + (m.statut === "reporte" ? '<span class="tag tag--alert">Reporté</span>' : "") + "</div>" +
        '<div class="countdown" role="timer" aria-live="off"><div><b data-cd="j">00</b><small>Jours</small></div><div><b data-cd="h">00</b><small>Heures</small></div><div><b data-cd="m">00</b><small>Min</small></div><div><b data-cd="s">00</b><small>Sec</small></div></div>';
      var target = parseDate(m.date, m.heure).getTime();
      var tick = function () {
        var d = Math.max(0, target - Date.now());
        var p = function (n) { return String(n).padStart(2, "0"); };
        var set = function (k, v) { var el = $('[data-cd="' + k + '"]', nm); if (el) el.textContent = p(v); };
        set("j", Math.floor(d / 864e5)); set("h", Math.floor(d / 36e5) % 24); set("m", Math.floor(d / 6e4) % 60); set("s", Math.floor(d / 1e3) % 60);
      };
      tick(); setInterval(tick, 1000);
    } else {
      nm.innerHTML = teamHtml("IB Academy") + '<div class="vs">VS</div>' + '<div class="team"><div class="team__logo">?</div><div class="team__name">Adversaire à annoncer</div></div>' +
        '<div class="match-meta"><span>Le calendrier de la saison sera publié ici dès sa confirmation.</span></div>' +
        '<div class="countdown pending" aria-hidden="true"><div><b>--</b><small>Jours</small></div><div><b>--</b><small>Heures</small></div><div><b>--</b><small>Min</small></div><div><b>--</b><small>Sec</small></div></div>';
    }
  }

  /* ---------- Résultats ---------- */
  var results = (D.resultats || []).slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  var renderScores = function (box, list) {
    if (!list.length) { box.innerHTML = '<div class="empty-state"><span class="big">Résultats à venir</span>Les scores de chaque équipe s’afficheront ici après les premiers matchs officiels.</div>'; return; }
    box.innerHTML = list.map(function (r, i) {
      var ibDom = /ib academy/i.test(r.domicile), ibs = ibDom ? r.scoreDom : r.scoreExt, adv = ibDom ? r.scoreExt : r.scoreDom;
      var cls = ibs > adv ? "win" : ibs < adv ? "lose" : "draw";
      return '<div class="score-row ' + cls + '" style="transition-delay:' + (i * 0.08) + 's"><span class="cat">' + esc(r.categorie) + '</span><span class="t">' + esc(r.domicile) + '</span><span class="score" data-score="' + r.scoreDom + "-" + r.scoreExt + '">0 - 0</span><span class="t">' + esc(r.exterieur) + "</span></div>";
    }).join("");
  };
  $$("[data-results]").forEach(function (box) {
    var lim = parseInt(box.getAttribute("data-results"), 10) || 99;
    var cat = box.getAttribute("data-cat");
    renderScores(box, results.filter(function (r) { return !cat || r.categorie === cat; }).slice(0, lim));
  });
  var animateScores = function (box) {
    $$("[data-score]", box).forEach(function (s) {
      var parts = s.getAttribute("data-score").split("-").map(Number), k = 0, steps = 14;
      var t = setInterval(function () { k++; var a = Math.round(parts[0] * k / steps), b = Math.round(parts[1] * k / steps); s.textContent = a + " - " + b; if (k >= steps) clearInterval(t); }, 60);
    });
  };

  /* Filtre résultats par catégorie (page matchs) */
  var rf = $("[data-results-filter]");
  if (rf) {
    var cats = [];
    results.forEach(function (r) { if (cats.indexOf(r.categorie) < 0) cats.push(r.categorie); });
    if (cats.length > 1) {
      rf.innerHTML = '<button class="filter" aria-pressed="true" data-c="">Toutes</button>' + cats.map(function (c) { return '<button class="filter" aria-pressed="false" data-c="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      rf.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        $$("button", rf).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        var box = $("[data-results-all]"); var c = b.getAttribute("data-c");
        renderScores(box, results.filter(function (r) { return !c || r.categorie === c; }));
        box.classList.add("in"); animateScores(box);
      });
    } else rf.remove();
  }
  var ra = $("[data-results-all]"); if (ra) renderScores(ra, results);

  /* ---------- Calendrier ---------- */
  var fx = $("[data-fixtures]");
  if (fx) {
    var all = (D.matchs || []).slice().sort(function (a, b) { return parseDate(a.date, a.heure) - parseDate(b.date, b.heure); });
    var alerts = all.filter(function (m) { return m.statut === "reporte" || m.statut === "annule"; });
    var al = $("[data-alerts]");
    if (al) {
      if (alerts.length) al.innerHTML = alerts.map(function (m) { return '<div class="fixture ' + m.statut + '"><div class="date"><b>' + parseDate(m.date).getDate() + "</b>" + MOIS[parseDate(m.date).getMonth()] + '</div><div class="teams"><strong>' + esc(m.domicile) + " – " + esc(m.exterieur) + '</strong><br><span class="muted">' + esc(m.categorie) + " · " + esc(m.competition || "") + '</span></div><span class="tag tag--alert">' + (m.statut === "annule" ? "Annulé" : "Reporté") + "</span></div>"; }).join("");
      else al.innerHTML = '<div class="placeholder">✅ <strong>Aucun report ni annulation</strong> signalé pour le moment.</div>';
    }
    if (!all.length) fx.innerHTML = '<div class="card empty-state"><span class="big">Calendrier en préparation</span>Les dates des matchs et plateaux seront publiées ici dès leur confirmation par le club et les instances.</div>';
    else fx.innerHTML = all.map(function (m) {
      var d = parseDate(m.date, m.heure);
      return '<div class="fixture ' + (m.statut || "") + '"><div class="date"><b>' + d.getDate() + "</b>" + MOIS[d.getMonth()] + " · " + esc(m.heure) + '</div><div class="teams"><strong>' + esc(m.domicile) + " – " + esc(m.exterieur) + '</strong><br><span class="muted">' + esc(m.categorie) + " · " + esc(m.competition || "") + " · " + esc(m.lieu || "") + "</span></div>" +
        (m.statut === "reporte" ? '<span class="tag tag--alert">Reporté</span>' : m.statut === "annule" ? '<span class="tag tag--alert">Annulé</span>' : '<span class="tag">' + (d < now ? "Joué" : "À venir") + "</span>") + "</div>";
    }).join("");
  }

  /* ---------- Catégories ---------- */
  var cats = D.categories || [];
  $$("[data-cat-flip]").forEach(function (box) {
    var lim = parseInt(box.getAttribute("data-cat-flip"), 10) || 99;
    box.innerHTML = cats.slice(0, lim).map(function (c, i) {
      return '<div class="flip reveal" tabindex="0" role="group" data-delay="' + (i % 3) + '" aria-label="' + esc(c.nom) + ' — survolez ou touchez pour voir les détails">' +
        '<div class="flip__inner"><div class="flip__face flip__front" style="background-image:url(' + esc(c.image) + ')"><span class="hint" aria-hidden="true">↻</span>' +
        '<span class="cat-sub">' + esc(c.surnom) + '</span><span class="cat-name">' + esc(c.nom) + '</span><span class="muted">' + esc(c.ages) + "</span></div>" +
        '<div class="flip__face flip__back"><h3>' + esc(c.nom) + "</h3><p>" + esc(c.objectif) + "</p><dl>" +
        "<dt>Âges</dt><dd>" + esc(c.ages) + "</dd><dt>Nés en</dt><dd>" + esc(c.naissance) + "</dd><dt>Jours</dt><dd>" + esc(c.jours) + "</dd><dt>Horaires</dt><dd>" + esc(c.horaires) + "</dd><dt>Lieu</dt><dd>" + esc(c.lieu) + "</dd></dl>" +
        '<a class="btn btn--dark" style="margin-top:auto" href="categories.html#' + esc(c.id) + '">Voir la fiche</a></div></div></div>';
    }).join("");
    box.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var f = e.target.closest(".flip"); if (f) f.classList.toggle("flipped");
    });
    box.addEventListener("keydown", function (e) {
      var f = e.target.classList && e.target.classList.contains("flip") ? e.target : null;
      if (f && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); f.classList.toggle("flipped"); }
    });
  });
  var sheets = $("[data-cat-sheets]");
  if (sheets) sheets.innerHTML = cats.map(function (c) {
    return '<article class="cat-sheet reveal" id="' + esc(c.id) + '"><div class="cat-sheet__img" style="background-image:url(' + esc(c.image) + ')">' + (c.projet ? '<span class="tag tag--alert">En projet</span>' : "") + '</div><div class="cat-sheet__body"><span class="tag">' + esc(c.surnom) + "</span><h3>" + esc(c.nom) + "</h3><p class=\"muted\">" + esc(c.objectif) + '</p><div class="facts">' +
      [["Âges", c.ages], ["Années de naissance", c.naissance], ["Jours", c.jours], ["Horaires", c.horaires], ["Lieu", c.lieu], ["Éducateur", c.educateur]].map(function (f) { return '<div class="fact"><small>' + f[0] + "</small><span>" + esc(f[1]) + "</span></div>"; }).join("") +
      '</div><a class="btn" href="inscriptions.html?categorie=' + encodeURIComponent(c.nom) + '">Pré-inscrire en ' + esc(c.nom) + "</a></div></article>";
  }).join("");
  var tb = $("[data-schedule]");
  if (tb) tb.innerHTML = cats.map(function (c) {
    var td = function (v) { return '<td class="' + (/confirmer/i.test(v) ? "tbc" : "") + '">' + esc(v) + "</td>"; };
    return '<tr><td class="cat-cell">' + esc(c.nom) + "</td>" + td(c.ages) + td(c.jours) + td(c.horaires) + td(c.lieu) + td(c.educateur) + "</tr>";
  }).join("");
  $$("select[data-cat-options]").forEach(function (sel) {
    sel.insertAdjacentHTML("beforeend", cats.map(function (c) { return '<option value="' + esc(c.nom) + '">' + esc(c.nom) + " (" + esc(c.ages) + ")</option>"; }).join("") + '<option value="Je ne sais pas">Je ne sais pas</option>');
    var q = new URLSearchParams(location.search).get("categorie");
    if (q) sel.value = q;
  });

  /* ---------- Actualités ---------- */
  var news = (D.actualites || []).slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  $$("[data-news]").forEach(function (box) {
    var lim = parseInt(box.getAttribute("data-news"), 10) || 99;
    var list = news.slice(0, lim);
    if (!list.length) { box.innerHTML = '<div class="card empty-state"><span class="big">Bientôt</span>Les premières actualités arrivent.</div>'; return; }
    box.innerHTML = list.map(function (n, i) {
      return '<article class="news-card reveal" data-delay="' + (i % 3) + '"><div class="news-card__img"><img src="' + esc(n.image) + '" alt="" loading="lazy" width="800" height="500"></div><div class="news-card__body"><span class="tag">' + esc(n.categorie) + '</span><time datetime="' + esc(n.date) + '">' + esc(fmtLong(n.date)) + "</time><h3>" + esc(n.titre) + "</h3><p>" + esc(n.resume) + "</p>" + (n.source ? '<a class="more" href="' + esc(n.source) + '" target="_blank" rel="noopener">Lire la source →</a>' : "") + "</div></article>";
    }).join("");
  });

  /* ---------- Événements ---------- */
  var ev = $("[data-events]");
  if (ev) {
    var evs = (D.evenements || []).slice().sort(function (a, b) { return parseDate(a.dateDebut) - parseDate(b.dateDebut); });
    if (!evs.length) ev.innerHTML = '<div class="card empty-state" style="grid-column:1/-1"><span class="big">Programme en préparation</span>Stages de vacances, tournois et journées portes ouvertes seront annoncés ici. Écrivez-nous pour être prévenu en priorité.</div>';
    else ev.innerHTML = evs.map(function (e) {
      return '<article class="card reveal"><span class="tag">' + esc(e.type) + "</span><h3 style=\"margin-top:.8rem\">" + esc(e.titre) + '</h3><p class="muted">' + esc(fmtLong(e.dateDebut)) + (e.dateFin && e.dateFin !== e.dateDebut ? " → " + esc(fmtLong(e.dateFin)) : "") + "</p><p>" + esc(e.description || "") + "</p><p><b>Public :</b> " + esc(e.public || "—") + "<br><b>Lieu :</b> " + esc(e.lieu || "—") + (e.tarif ? "<br><b>Tarif :</b> " + esc(e.tarif) : "") + "</p>" + (e.inscription ? '<a class="btn" href="contact.html?sujet=' + encodeURIComponent(e.titre) + '">S’inscrire</a>' : "") + "</article>";
    }).join("");
  }

  /* ---------- Galerie + visionneuse ---------- */
  var gal = $("[data-gallery]");
  if (gal) {
    var items = D.galerie || [], current = items;
    var gf = $("[data-gallery-filter]");
    var albums = []; items.forEach(function (g) { if (albums.indexOf(g.album) < 0) albums.push(g.album); });
    var draw = function (list) {
      current = list;
      gal.innerHTML = list.map(function (g, i) { return '<figure><button type="button" data-i="' + i + '" aria-label="Agrandir : ' + esc(g.alt) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy"></button><figcaption>' + esc(g.alt) + " · <b>" + esc(g.album) + "</b></figcaption></figure>"; }).join("");
    };
    draw(items);
    if (gf) {
      gf.innerHTML = '<button class="filter" aria-pressed="true" data-a="">Tout</button>' + albums.map(function (a) { return '<button class="filter" aria-pressed="false" data-a="' + esc(a) + '">' + esc(a) + "</button>"; }).join("");
      gf.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; $$("button", gf).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); var a = b.getAttribute("data-a"); draw(items.filter(function (g) { return !a || g.album === a; })); });
    }
    var lb = $(".lightbox"), lbImg = $("img", lb), lbTxt = $("p", lb), idx = 0, lastFocus;
    var show = function (i) { idx = (i + current.length) % current.length; lbImg.src = current[idx].src; lbImg.alt = current[idx].alt; lbTxt.textContent = current[idx].alt + " — " + current[idx].album; };
    gal.addEventListener("click", function (e) { var b = e.target.closest("button[data-i]"); if (!b) return; lastFocus = b; show(+b.getAttribute("data-i")); lb.classList.add("open"); $(".lb-close", lb).focus(); });
    var close = function () { lb.classList.remove("open"); if (lastFocus) lastFocus.focus(); };
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", function () { show(idx - 1); });
    $(".lb-next", lb).addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
  }

  /* ---------- Partenaires ---------- */
  $$("[data-partners]").forEach(function (box) {
    var p = D.partenaires || [];
    var slots = p.map(function (x) { return '<a class="partner-logo" href="' + esc(x.url || "#") + '" target="_blank" rel="noopener"><img src="' + esc(x.logo) + '" alt="' + esc(x.nom) + '" loading="lazy"></a>'; }).join("");
    var free = Math.max(0, 4 - p.length);
    for (var i = 0; i < free; i++) slots += '<a class="partner-slot" href="partenaires.html#devenir">Votre logo ici<br>Devenez partenaire</a>';
    box.innerHTML = slots;
  });

  /* Pré-remplissage du sujet de contact */
  var sujet = new URLSearchParams(location.search).get("sujet");
  var sf = $("#sujet"); if (sujet && sf) sf.value = sujet;

  /* ---------- Apparitions & compteurs ---------- */
  var count = function (el) {
    var end = parseFloat(el.getAttribute("data-count")), dur = 1600, start = null, from = parseFloat(el.getAttribute("data-from") || 0);
    if (reduce) { el.textContent = end; return; }
    var step = function (t) { if (!start) start = t; var p = Math.min(1, (t - start) / dur); var e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(from + (end - from) * e); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target; t.classList.add("in");
      if (t.hasAttribute("data-count")) count(t);
      if (t.classList.contains("scoreboard")) animateScores(t);
      io.unobserve(t);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
  $$(".reveal,[data-count],.scoreboard").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });
})();
