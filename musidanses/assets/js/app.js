/* Musidanses - le contenu vient des fichiers du dossier /data */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var cache = {};
  function data(name) {
    if (!cache[name]) cache[name] = fetch("data/" + name + ".json").then(function (r) { return r.json(); });
    return cache[name];
  }
  var DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  var fmtDate = function (iso, o) { return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", o || { weekday: "long", day: "numeric", month: "long", year: "numeric" }); };
  var hh = function (t) { return t ? t.replace(":", "h").replace(/h00$/, "h") : ""; };
  function startOf(ev) { return ev.date ? new Date(ev.date + "T" + (ev.debut || "00:00") + ":00") : null; }
  function endOf(ev) { return ev.date ? new Date(ev.date + "T" + (ev.fin || "23:59") + ":00") : null; }
  function isUpcoming(ev) { return !ev.date || endOf(ev) >= new Date(); }
  function season(ev) {
    if (ev.saison) return ev.saison;
    var d = new Date(ev.date + "T12:00:00"), y = d.getFullYear();
    return d.getMonth() >= 8 ? y + "-" + (y + 1) : (y - 1) + "-" + y;
  }
  function dateLabel(ev) {
    if (!ev.date) return ev.date_texte || "Date à confirmer";
    return fmtDate(ev.date) + (ev.debut ? " · " + hh(ev.debut) + (ev.fin ? " - " + hh(ev.fin) : "") : "");
  }

  /* ---------- Affiche : image fournie ou affiche générée ---------- */
  function wrapText(t, n) {
    var w = String(t).split(/\s+/), l = [], c = "";
    w.forEach(function (x) { if ((c + " " + x).trim().length > n) { l.push(c); c = x; } else c = (c + " " + x).trim(); });
    if (c) l.push(c);
    return l.slice(0, 5);
  }
  function posterSVG(ev) {
    var lines = wrapText(ev.titre, 14), y = 430, out = "";
    lines.forEach(function (l, i) { out += '<text x="60" y="' + (y + i * 84) + '" font-size="66" font-weight="900" fill="#fff">' + esc(l) + "</text>"; });
    var ty = y + lines.length * 84 + 20;
    var date = ev.date ? fmtDate(ev.date, { weekday: "long", day: "numeric", month: "long" }) : (ev.date_texte || "Date à confirmer");
    var heure = ev.debut ? hh(ev.debut) + (ev.fin ? " - " + hh(ev.fin) : "") : "";
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 707 1000" font-family="Trebuchet MS,Arial,sans-serif" role="img" aria-label="Affiche : ' + esc(ev.titre) + '">' +
      '<defs><linearGradient id="pg' + esc(ev.id) + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b1450"/><stop offset=".6" stop-color="#e8305f"/><stop offset="1" stop-color="#ffb81f"/></linearGradient></defs>' +
      '<rect width="707" height="1000" fill="url(#pg' + esc(ev.id) + ')"/>' +
      '<g fill="#fff" fill-opacity=".14"><path d="M500 60v190a50 50 0 1 1-28-45V105l-85 22v155a50 50 0 1 1-28-45V90z"/><circle cx="600" cy="800" r="170"/></g>' +
      '<path d="M0 880c150-70 300 40 460-20s180-60 247-30v170H0z" fill="#1d0f2e" fill-opacity=".55"/>' +
      '<text x="60" y="110" font-size="30" font-weight="800" letter-spacing="6" fill="#ffb81f">MUSIDANSES</text>' +
      '<text x="60" y="150" font-size="22" fill="#fff" fill-opacity=".85">Chilly-Mazarin</text>' + out +
      '<text x="60" y="' + ty + '" font-size="38" font-weight="800" fill="#ffb81f">' + esc(date) + "</text>" +
      (heure ? '<text x="60" y="' + (ty + 50) + '" font-size="34" fill="#fff">' + esc(heure) + "</text>" : "") +
      '<text x="60" y="920" font-size="28" fill="#fff">' + esc((ev.lieu || "").slice(0, 38)) + "</text>" +
      '<text x="60" y="962" font-size="26" font-weight="800" fill="#ffb81f">' + esc((ev.tarif || "").slice(0, 38)) + "</text></svg>";
  }
  function poster(ev) {
    return '<div class="poster">' + (ev.affiche ? '<img src="' + esc(ev.affiche) + '" alt="Affiche : ' + esc(ev.titre) + '" loading="lazy" width="707" height="1000">' : posterSVG(ev)) + "</div>";
  }
  function downloadPoster(ev) {
    if (ev.affiche) { var a = document.createElement("a"); a.href = ev.affiche; a.download = ev.id + (ev.affiche.match(/\.\w+$/) || [".jpg"])[0]; document.body.appendChild(a); a.click(); a.remove(); return; }
    var svg = posterSVG(ev).replace("<svg ", '<svg width="1414" height="2000" '), img = new Image();
    img.onload = function () {
      var c = document.createElement("canvas"); c.width = 1414; c.height = 2000; c.getContext("2d").drawImage(img, 0, 0, 1414, 2000);
      c.toBlob(function (b) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "affiche-" + ev.id + ".png"; a.click(); }, "image/png");
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------- En-tête et pied de page communs ---------- */
  var NAV = [["index.html", "Accueil", "accueil"], ["association.html", "L'association", "association"], ["cours.html", "Cours & activités", "cours"], ["evenements.html", "Événements & affiches", "evenements"], ["galerie.html", "Galerie", "galerie"], ["actualites.html", "Actualités", "actualites"], ["contact.html", "Nous rejoindre", "contact"]];
  function layout(site) {
    var page = document.body.dataset.page;
    var links = NAV.map(function (n) { return '<li><a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a></li>"; }).join("");
    $("#site-header").innerHTML = '<div class="wrap nav"><a class="brand" href="index.html" aria-label="Musidanses, accueil"><img src="assets/img/logo.svg" alt="" width="40" height="40">Musi<b>danses</b></a>' +
      '<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span></span></button><ul class="menu" id="menu">' + links + "</ul></div>";
    var h = $("#site-header"), b = $(".burger", h);
    var sc = function () { h.classList.toggle("solid", window.scrollY > 40 || document.body.classList.contains("nav-open")); };
    sc(); window.addEventListener("scroll", sc, { passive: true });
    b.addEventListener("click", function () { var o = document.body.classList.toggle("nav-open"); b.setAttribute("aria-expanded", o); sc(); });
    $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("nav-open"); }); });
    $("#site-footer").innerHTML = '<div class="wrap"><div class="fgrid"><div><a class="brand" href="index.html"><img src="assets/img/logo.svg" alt="" width="40" height="40"><span>Musi<b>danses</b></span></a><p style="margin-top:12px">' + esc(site.accroche) + '.</p></div>' +
      '<div><h4>Le site</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + '<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>' +
      '<div><h4>Où nous trouver</h4><p>' + esc(site.adresse_lieu) + "<br>" + esc(site.ville) + '</p></div>' +
      '<div><h4>Contact</h4><ul><li><a href="tel:' + esc(site.telephone.replace(/\s/g, "")) + '">' + esc(site.telephone) + '</a></li><li><a href="mailto:' + esc(site.email) + '">' + esc(site.email) + '</a></li><li><a href="' + esc(site.facebook) + '" target="_blank" rel="noopener">Facebook Musidanses</a></li></ul></div></div>' +
      '<div class="legal"><span>© ' + new Date().getFullYear() + " Musidanses, association de danse et de musique</span><a href=\"mentions-legales.html\">Mentions légales</a></div></div>";
  }

  /* ---------- Utilitaires d'animation ---------- */
  function reveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }
  function counters() {
    var els = $$("[data-count]");
    if (!els.length) return;
    var run = function (el) {
      var to = +el.dataset.count, t0 = null;
      var step = function (t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.textContent = e.dataset.count; }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }); }, { threshold: .4 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Cours ---------- */
  function slots(cours) {
    var out = [];
    cours.forEach(function (c) { if (c.statut === "actif") c.creneaux.forEach(function (s) { out.push({ c: c, s: s }); }); });
    return out;
  }
  function nextSlot(cours) {
    var now = new Date(), best = null;
    slots(cours).filter(function (x) { return x.c.hebdo !== false; }).forEach(function (x) {
      var d = DAYS.indexOf(x.s.jour);
      for (var i = 0; i < 8; i++) {
        var t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, +x.s.debut.slice(0, 2), +x.s.debut.slice(3));
        if (t.getDay() === d && t > now) { if (!best || t < best.t) best = { t: t, c: x.c, s: x.s }; break; }
      }
    });
    return best;
  }
  function courseCard(c) {
    return '<article class="card reveal"><div class="ph" style="background-image:url(' + esc(c.photo) + ')" role="img" aria-label="' + esc(c.nom) + '"></div><div class="body"><span class="tag ' + (c.statut === "pause" ? "pause" : c.couleur) + '">' + (c.statut === "pause" ? "Pas de cours actuellement" : esc(c.frequence.split(".")[0])) + "</span><h3>" + esc(c.nom) + "</h3><p>" + esc(c.resume) + '</p><a class="link-arrow" href="cours.html#' + esc(c.id) + '">Voir la fiche</a></div></article>';
  }
  function fiche(c) {
    var cr = c.creneaux.length ? "<ul>" + c.creneaux.map(function (s) { return "<li><b>" + s.jour + "</b> " + hh(s.debut) + " - " + hh(s.fin) + " <small>(" + esc(s.niveau) + ")</small></li>"; }).join("") + "</ul>" : "Pas de cours actuellement";
    return '<article class="fiche reveal" id="' + esc(c.id) + '"><div class="ph" style="background-image:url(' + esc(c.photo) + ')" role="img" aria-label="' + esc(c.nom) + '"></div><div class="txt"><span class="tag ' + (c.statut === "pause" ? "pause" : c.couleur) + '">' + esc(c.frequence.split(".")[0]) + "</span><h2>" + esc(c.nom) + "</h2><p>" + esc(c.resume) + "</p><dl>" +
      "<dt>Public</dt><dd>" + esc(c.public) + "</dd><dt>Niveau</dt><dd>" + esc(c.niveau) + "</dd><dt>Jours et horaires</dt><dd>" + cr + "</dd><dt>Lieu</dt><dd>" + esc(c.lieu) + "</dd><dt>Animateur</dt><dd>" + esc(c.animateur) + "</dd><dt>Tarif</dt><dd>" + esc(c.tarif) + "</dd></dl>" +
      (c.frequence.indexOf(".") > -1 ? '<p class="note">' + esc(c.frequence.split(". ").slice(1).join(". ")) + "</p>" : "") + (c.note ? '<p class="note">' + esc(c.note) + "</p>" : "") +
      '<a class="btn btn-primary btn-sm" href="contact.html">Venez essayer</a></div></article>';
  }
  function planning(cours) {
    var order = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], by = {};
    slots(cours).forEach(function (x) { (by[x.s.jour] = by[x.s.jour] || []).push(x); });
    return order.filter(function (d) { return by[d]; }).map(function (d) {
      return '<div class="day reveal"><h3>' + d + "</h3>" + by[d].sort(function (a, b) { return a.s.debut < b.s.debut ? -1 : 1; }).map(function (x) { return '<div class="slot"><b>' + hh(x.s.debut) + " - " + hh(x.s.fin) + "</b>" + esc(x.c.nom) + "<br><small>" + esc(x.s.niveau) + "</small></div>"; }).join("") + "</div>";
    }).join("");
  }

  /* ---------- Événements ---------- */
  function slide(ev) {
    return '<a class="slide" href="evenements.html#' + esc(ev.id) + '">' + poster(ev) + "<figcaption>" + esc(ev.titre) + "<small>" + esc(dateLabel(ev)) + "</small></figcaption></a>";
  }
  function evCard(ev) {
    return '<article class="ev reveal" id="' + esc(ev.id) + '">' + poster(ev) + "<div><span class=\"tag" + (isUpcoming(ev) ? "" : " pause") + '">' + (isUpcoming(ev) ? "À venir" : "Passé") + "</span><h3>" + esc(ev.titre) + '</h3><div class="badges"><span class="badge">📅 ' + esc(dateLabel(ev)) + '</span><span class="badge">📍 ' + esc(ev.lieu) + '</span><span class="badge">🎟 ' + esc(ev.tarif) + "</span></div><p>" + esc(ev.description) + '</p><div class="actions"><button class="btn btn-primary btn-sm" data-dl="' + esc(ev.id) + '">⬇ Télécharger l\'affiche</button></div></div></article>';
  }

  var PAGES = {
    accueil: function (d) {
      var evs = d.ev.filter(isUpcoming);
      var car = evs.length ? evs : d.ev.slice(0, 6);
      $("#carousel-title").textContent = evs.length ? "Les prochaines affiches" : "Les dernières affiches";
      $("#track").innerHTML = car.map(slide).join("");
      var tr = $("#track"), step = function (dir) { tr.scrollBy({ left: dir * 320, behavior: "smooth" }); };
      $("#prev").onclick = function () { step(-1); }; $("#next").onclick = function () { step(1); };
      var auto = setInterval(function () { if (tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4) tr.scrollTo({ left: 0, behavior: "smooth" }); else step(1); }, 5000);
      ["mouseenter", "touchstart", "focusin"].forEach(function (e) { tr.addEventListener(e, function () { clearInterval(auto); }, { passive: true }); });
      // prochain événement + compte à rebours
      var next = d.ev.filter(function (e) { return e.date && isUpcoming(e); }).sort(function (a, b) { return startOf(a) - startOf(b); })[0];
      var box = $("#next-body"), target, html;
      if (next) {
        target = startOf(next);
        html = '<div class="reveal">' + '<span class="eyebrow">Prochain événement</span><h2>' + esc(next.titre) + '</h2><ul class="meta"><li>' + esc(dateLabel(next)) + "</li><li>" + esc(next.lieu) + "</li><li>" + esc(next.tarif) + '</li></ul>__CD__<a class="btn btn-sun" href="evenements.html#' + esc(next.id) + '">Voir l\'affiche</a></div><div class="reveal">' + poster(next) + "</div>";
      } else {
        var ns = nextSlot(d.cours);
        if (ns) {
          target = ns.t;
          html = '<div class="reveal"><span class="eyebrow">Prochain rendez-vous</span><h2>' + esc(ns.c.nom) + '</h2><ul class="meta"><li>' + fmtDate(ns.t.toISOString().slice(0, 10)).replace(/^./, function (c) { return c.toUpperCase(); }) + " · " + hh(ns.s.debut) + "</li><li>" + esc(ns.c.lieu) + "</li><li>" + esc(ns.s.niveau) + '</li></ul>__CD__<p>Les dates des prochains événements seront annoncées ici.</p><a class="btn btn-sun" href="evenements.html">Tous les événements</a></div><div class="reveal">' + poster({ id: "next", titre: ns.c.nom, date: ns.t.toISOString().slice(0, 10), debut: ns.s.debut, fin: ns.s.fin, lieu: ns.c.lieu, tarif: "Venez essayer !" }) + "</div>";
        }
      }
      if (html) {
        box.innerHTML = html.replace("__CD__", '<div class="count" id="cd" role="timer" aria-live="off"><div><b data-u="d">0</b><span>jours</span></div><div><b data-u="h">0</b><span>heures</span></div><div><b data-u="m">0</b><span>min</span></div><div><b data-u="s">0</b><span>sec</span></div></div>');
        var tick = function () { var ms = Math.max(0, target - new Date()), v = { d: Math.floor(ms / 864e5), h: Math.floor(ms / 36e5) % 24, m: Math.floor(ms / 6e4) % 60, s: Math.floor(ms / 1e3) % 60 }; for (var k in v) $('[data-u="' + k + '"]').textContent = v[k]; };
        tick(); setInterval(tick, 1000);
      }
      $("#activities").innerHTML = d.cours.filter(function (c) { return c.statut === "actif"; }).slice(0, 3).map(courseCard).join("");
      var act = d.cours.filter(function (c) { return c.statut === "actif"; });
      $('[data-stat="disciplines"]').dataset.count = act.length;
      $('[data-stat="creneaux"]').dataset.count = slots(d.cours).filter(function (x) { return x.c.hebdo !== false; }).length;
      $('[data-stat="jours"]').dataset.count = Object.keys(slots(d.cours).reduce(function (o, x) { o[x.s.jour] = 1; return o; }, {})).length;
      $("#news-latest").innerHTML = d.news.slice(0, 3).map(newsCard).join("");
    },
    association: function (d) {
      $("#bureau").innerHTML = d.equipe.bureau.map(function (p) { return '<div class="person reveal"><div class="avatar">' + esc(p.nom.charAt(0)) + "</div><h3>" + esc(p.nom) + "</h3><p>" + esc(p.role) + "</p></div>"; }).join("");
      $("#animateurs").innerHTML = d.equipe.animateurs.map(function (p) { return '<div class="person reveal"><div class="avatar">♪</div><h3>' + esc(p.nom) + "</h3><p>" + esc(p.discipline) + "</p></div>"; }).join("");
    },
    cours: function (d) {
      $("#planning").innerHTML = planning(d.cours);
      $("#fiches").innerHTML = d.cours.map(fiche).join("");
    },
    evenements: function (d) {
      var up = d.ev.filter(isUpcoming), past = d.ev.filter(function (e) { return !isUpcoming(e); }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      $("#upcoming").innerHTML = up.length ? up.map(evCard).join("") : '<div class="empty">Aucun événement annoncé pour le moment. Revenez bientôt !</div>';
      var by = {};
      past.forEach(function (e) { (by[season(e)] = by[season(e)] || []).push(e); });
      var keys = Object.keys(by).sort().reverse();
      $("#archives").innerHTML = keys.length ? keys.map(function (k, i) {
        return '<details class="season"' + (i === 0 ? " open" : "") + "><summary>Saison " + esc(k) + '</summary><div class="inside"><div class="mini">' + by[k].map(function (e) { return '<div id="' + esc(e.id) + '">' + poster(e) + "<b>" + esc(e.titre) + "</b><small>" + esc(dateLabel(e)) + '</small><button class="btn btn-ghost btn-sm" data-dl="' + esc(e.id) + '" style="margin-top:8px">⬇ Affiche</button></div>'; }).join("") + "</div></div></details>";
      }).join("") : '<div class="empty">Les affiches passées apparaîtront ici, classées par saison.</div>';
      document.addEventListener("click", function (e) { var b = e.target.closest("[data-dl]"); if (b) downloadPoster(d.ev.filter(function (x) { return x.id === b.dataset.dl; })[0]); });
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) { var det = t.closest("details"); if (det) det.open = true; setTimeout(function () { t.scrollIntoView(); }, 300); } }
    },
    galerie: function (d) {
      var g = d.gal, sel = "all";
      $("#filters").innerHTML = '<button aria-pressed="true" data-f="all">Tout</button>' + g.categories.map(function (c) { return '<button aria-pressed="false" data-f="' + esc(c.id) + '">' + esc(c.nom) + "</button>"; }).join("");
      var draw = function () {
        var list = g.medias.filter(function (m) { return sel === "all" || m.categorie === sel; });
        $("#masonry").innerHTML = list.map(function (m, i) {
          if (m.type === "youtube") return '<figure><iframe src="https://www.youtube-nocookie.com/embed/' + esc(m.id) + '" title="' + esc(m.legende) + '" loading="lazy" allowfullscreen></iframe><figcaption>' + esc(m.legende) + "</figcaption></figure>";
          if (m.type === "video") return '<figure><video src="' + esc(m.fichier) + '" controls preload="none"></video><figcaption>' + esc(m.legende) + "</figcaption></figure>";
          return '<figure data-i="' + i + '" tabindex="0"><img src="' + esc(m.fichier) + '" alt="' + esc(m.legende) + '" loading="lazy"><figcaption>' + esc(m.legende) + "</figcaption></figure>";
        }).join("");
        $$("#masonry figure[data-i]").forEach(function (f) { var open = function () { var m = list[f.dataset.i]; $("#lb img").src = m.fichier; $("#lb img").alt = m.legende; $("#lb p").textContent = m.legende; $("#lb").classList.add("on"); }; f.onclick = open; f.onkeydown = function (e) { if (e.key === "Enter") open(); }; });
      };
      $("#filters").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; sel = b.dataset.f; $$("#filters button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); draw(); };
      $("#lb").onclick = function () { this.classList.remove("on"); };
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("#lb").classList.remove("on"); });
      draw();
    },
    actualites: function (d) { $("#news").innerHTML = d.news.map(newsCard).join(""); },
    contact: function (d) {
      var f = $("#contact-form");
      if (/envoye=1/.test(location.search)) { $("#sent").hidden = false; }
      var sel = $("#discipline"); sel.innerHTML += d.cours.filter(function (c) { return c.statut === "actif"; }).map(function (c) { return "<option>" + esc(c.nom) + "</option>"; }).join("");
      var m = /discipline=([^&]+)/.exec(location.search); if (m) sel.value = decodeURIComponent(m[1]);
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)).toString() })
          .then(function (r) { if (!r.ok) throw 0; f.reset(); $("#sent").hidden = false; $("#sent").scrollIntoView({ behavior: "smooth", block: "center" }); })
          .catch(function () { f.submit(); });
      });
    }
  };
  function newsCard(n) {
    return '<article class="card news-card reveal"><div class="ph" style="background-image:url(' + esc(n.image) + ')" role="img" aria-label=""></div><div class="body"><span class="tag plum">' + esc(n.tag) + "</span><small>" + esc(n.label) + "</small><h3>" + esc(n.titre) + "</h3><p>" + esc(n.texte || n.resume) + "</p></div></article>";
  }

  /* ---------- Démarrage ---------- */
  var page = document.body.dataset.page;
  Promise.all([data("site"), data("cours"), data("evenements"), data("actualites"), data("galerie"), data("equipe")]).then(function (r) {
    layout(r[0]);
    if (PAGES[page]) PAGES[page]({ site: r[0], cours: r[1], ev: r[2], news: r[3], gal: r[4], equipe: r[5] });
    reveal(); counters();
  }).catch(function (e) {
    console.error(e);
    $$(".reveal").forEach(function (x) { x.classList.add("in"); });
  });
})();
