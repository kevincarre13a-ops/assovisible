(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { var d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; };
  var get = function (f) { return fetch("data/" + f).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
  var fmt = function (d) {
    if (!d) return null;
    if (/^\d{4}$/.test(d)) return d;
    var x = new Date(d + "T12:00:00");
    return isNaN(x) ? d : x.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };
  var cols = ["", "orange", "yellow"];

  /* burger */
  var b = $(".burger"), nav = $("#nav");
  if (b) {
    b.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
      document.body.style.overflow = o ? "hidden" : "";
    });
    $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); b.setAttribute("aria-expanded", false); document.body.style.overflow = ""; }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { nav.classList.remove("open"); b.setAttribute("aria-expanded", false); document.body.style.overflow = ""; } });
  }

  /* reveal + counters */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in"); io.unobserve(e.target);
      if (e.target.dataset.count) count(e.target);
    });
  }, { threshold: .15 }) : null;
  function watch(root) {
    $$(".rv,[data-count]", root).forEach(function (el) { if (io) io.observe(el); else { el.classList.add("in"); if (el.dataset.count) el.textContent = el.dataset.count + (el.dataset.suffix || ""); } });
  }
  function count(el) {
    var to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = null;
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) { el.textContent = to + suf; return; }
    (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); })(performance.now());
  }

  /* renderers: each page declares <div data-render="..."> */
  var R = {
    activites: function (el) {
      var lim = +el.dataset.limit || 99;
      return get("activites.json").then(function (a) {
        el.innerHTML = a.slice(0, lim).map(function (x, i) {
          var full = !el.dataset.limit;
          return '<article class="card rv ' + esc(x.couleur === "blue" ? "" : x.couleur) + '" id="' + esc(x.id) + '"><span class="pill">' + esc(x.type) + "</span><h3>" + esc(x.titre) + "</h3><p>" + esc(x.texte) + "</p>" +
            (full ? '<ul class="meta"><li><b>Âges :</b> ' + esc(x.ages) + "</li><li><b>Jours :</b> " + esc(x.jours) + "</li><li><b>Horaires :</b> " + esc(x.horaires) + "</li><li><b>Lieu :</b> " + esc(x.lieu) + "</li><li><b>Animateur :</b> " + esc(x.animateur) + "</li></ul>" : '<ul class="meta"><li><b>Âges :</b> ' + esc(x.ages) + "</li></ul>") + "</article>";
        }).join("");
      });
    },
    planning: function (el) {
      return get("planning.json").then(function (p) {
        el.innerHTML = '<p class="todo">' + esc(p.note) + '</p><div class="week">' + p.semaine.map(function (d) {
          return '<div class="day rv"><h3>' + esc(d.jour) + "</h3><div>" + (d.creneaux.length ? d.creneaux.map(function (c) { return '<div class="slot"><b>' + esc(c.heure) + "</b> · " + esc(c.titre) + " <span class=closed>(" + esc(c.lieu) + ")</span></div>"; }).join("") : '<span class="closed">Pas de permanence prévue</span>') + "</div></div>";
        }).join("") + "</div>";
        var a = $("#accueil"); if (a) a.innerHTML = "<p><b>Lieu :</b> " + esc(p.accueil.lieu) + "<br><b>Téléphone :</b> <a href='tel:+33143940404'>" + esc(p.accueil.telephone) + "</a></p><p class=todo>" + esc(p.accueil.horaires) + "</p>";
        var t = $("#tarifs"); if (t) t.innerHTML = p.tarifs.map(function (x) { return '<div class="card rv"><h3>' + esc(x.titre) + '</h3><div class="price">' + esc(x.prix) + "</div><p>" + esc(x.detail) + "</p></div>"; }).join("");
        var s = $("#etapes"); if (s) s.innerHTML = p.inscription.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
        var c = $("#pieces"); if (c) c.innerHTML = p.pieces.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      });
    },
    evenements: function (el) {
      return get("evenements.json").then(function (e) {
        var card = function (x) { var d = fmt(x.date); return '<article class="card rv"><span class="pill">' + esc(x.type) + "</span><h3>" + esc(x.titre) + "</h3>" + (d ? "<p><b>" + esc(d) + "</b></p>" : '<p class="todo">Date à annoncer</p>') + "<p>" + esc(x.texte) + '</p><ul class="meta"><li><b>Lieu :</b> ' + esc(x.lieu) + "</li></ul></article>"; };
        el.innerHTML = '<h2 class="rv">Prochains rendez-vous</h2><div class="grid g3">' + e.prochains.map(card).join("") + '</div><h2 class="rv" style="margin-top:56px">Archives</h2><div class="grid g3">' + e.archives.map(card).join("") + "</div>";
      });
    },
    prochain: function (el) {
      return get("evenements.json").then(function (e) {
        var x = e.prochains[0]; if (!x) return;
        var d = x.date ? new Date(x.date + "T12:00:00") : null;
        el.innerHTML = '<div class="event rv"><div class="date">' + (d ? "<b>" + d.getDate() + "</b>" + d.toLocaleDateString("fr-FR", { month: "short" }) : "<b>?</b>bientôt") + '</div><div><span class="pill">' + esc(x.type) + "</span><h3>" + esc(x.titre) + "</h3><p>" + esc(x.texte) + '</p><a class="btn b-bl" href="agenda.html">Tout l\'agenda</a></div></div>';
      });
    },
    actualites: function (el) {
      var lim = +el.dataset.limit || 99;
      return get("actualites.json").then(function (n) {
        el.innerHTML = n.slice(0, lim).map(function (x, i) {
          var d = fmt(x.date);
          return '<article class="card rv ' + cols[i % 3] + '"><span class="pill">' + esc(x.categorie) + "</span><h3>" + esc(x.titre) + "</h3><p><small>" + esc(d) + "</small></p><p>" + esc(x.texte) + "</p>" + (x.lien ? '<a href="' + esc(x.lien) + '" target="_blank" rel="noopener">' + esc(x.libelle || "En savoir plus") + " ↗</a>" : "") + "</article>";
        }).join("");
      });
    },
    compteurs: function (el) {
      return get("site.json").then(function (s) {
        el.innerHTML = s.compteurs.map(function (c) { return '<div class="stat"><div class="n" data-count="' + c.valeur + '" data-suffix="' + esc(c.suffixe) + '">0</div><p>' + esc(c.libelle) + "</p></div>"; }).join("");
      });
    },
    galerie: function (el) {
      return get("galerie.json").then(function (g) {
        var cur = "all";
        el.innerHTML = '<p class="ph-note">' + esc(g.note) + '</p><div class="filters" role="group" aria-label="Filtrer par thème"></div><div class="grid g3" id="gal"></div>';
        var f = $(".filters", el), gal = $("#gal", el);
        var cats = [{ id: "all", titre: "Tout" }].concat(g.categories);
        function draw() {
          f.innerHTML = cats.map(function (c) { return '<button type="button" data-c="' + c.id + '" aria-pressed="' + (c.id === cur) + '">' + esc(c.titre) + "</button>"; }).join("");
          gal.innerHTML = g.photos.filter(function (p) { return cur === "all" || p.cat === cur; }).map(function (p) {
            return '<figure class="tile rv in" data-c="' + esc(p.cat) + '" style="margin:0">' + (p.src ? '<img loading="lazy" src="' + esc(p.src) + '" alt="' + esc(p.alt) + '">' : "") + "<span>" + esc(p.titre) + (p.src ? "" : "<small>Photo à venir</small>") + "</span></figure>";
          }).join("");
        }
        f.addEventListener("click", function (e) { var t = e.target.closest("button"); if (!t) return; cur = t.dataset.c; draw(); });
        draw();
      });
    }
  };
  $$("[data-render]").forEach(function (el) {
    var fn = R[el.dataset.render]; if (!fn) return;
    fn(el).then(function () { watch(el); }).catch(function () { el.innerHTML = '<p class="todo">Contenu momentanément indisponible. Contactez-nous au 01 43 94 04 04.</p>'; });
  });
  watch(document);

  /* contact form (AJAX, Netlify Forms) */
  var f = $("form[name=contact]");
  if (f) f.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = $("button[type=submit]", f); btn.disabled = true;
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(f)).toString() })
      .then(function (r) { if (!r.ok) throw 0; location.href = "merci.html"; })
      .catch(function () { btn.disabled = false; $("#fmsg").textContent = "L'envoi a échoué. Écrivez-nous à cite-jeunes@orange.fr ou appelez le 01 43 94 04 04."; });
  });
})();
