(function () {
  var D = window.DS89 || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  function dateParts(iso) {
    if (!iso) return null;
    var p = iso.split("-");
    return { j: parseInt(p[2], 10), m: MOIS[parseInt(p[1], 10) - 1], a: p[0] };
  }
  function fmt(iso) { var d = dateParts(iso); return d ? d.j + " " + d.m + " " + d.a : "Date à confirmer"; }

  /* Burger */
  var b = $(".burger"), nav = $("#nav");
  if (b && nav) {
    b.addEventListener("click", function () {
      var o = nav.classList.toggle("open");
      b.setAttribute("aria-expanded", o);
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); b.setAttribute("aria-expanded", false); }); });
  }

  /* Rendus pilotés par les données */
  var R = {
    activites: function (el) {
      var lim = parseInt(el.getAttribute("data-limit") || "99", 10), full = el.hasAttribute("data-full");
      el.innerHTML = (D.activites || []).slice(0, lim).map(function (a) {
        var det = full ? '<dl><dt>Public</dt><dd>' + esc(a.public) + '</dd><dt>Jours</dt><dd>' + esc(a.jours) + '</dd><dt>Horaires</dt><dd>' + esc(a.horaires) + '</dd><dt>Lieu</dt><dd>' + esc(a.lieu) + '</dd><dt>Tarif</dt><dd>' + esc(a.tarif) + '</dd></dl>' : "";
        var wait = a.placeholder && full ? '<p class="wait">Informations pratiques en attente de confirmation par le club.</p>' : "";
        return '<article class="card rv"><span class="tag o">' + esc(a.sous) + '</span><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p>' + det + wait + '</article>';
      }).join("");
    },
    agenda: function (el) {
      var arch = el.getAttribute("data-archive") === "true";
      var items = (D.agenda || []).filter(function (e) { return !!e.archive === arch; });
      if (!items.length) { el.innerHTML = '<p class="wait">Aucun rendez-vous pour le moment.</p>'; return; }
      el.innerHTML = items.map(function (e) {
        return '<div class="row rv"><b>' + esc(e.titre) + '</b><span class="meta">' + esc(fmt(e.date)) + ' · ' + esc(e.lieu) + '</span><span>' + esc(e.texte) + '</span>' + (e.placeholder ? '<span class="wait">Texte d\'attente</span>' : "") + '</div>';
      }).join("");
    },
    next: function (el) {
      var e = (D.agenda || []).filter(function (x) { return !x.archive; })[0];
      if (!e) { el.innerHTML = '<p class="wait">Prochain rendez-vous à venir.</p>'; return; }
      var d = dateParts(e.date);
      el.innerHTML = '<div class="next rv"><div class="date">' + (d ? d.j + "<small>" + d.m + " " + d.a + "</small>" : "À venir<small>date à confirmer</small>") + '</div><div class="body"><span class="kicker">Prochain événement</span><h3>' + esc(e.titre) + '</h3><p>' + esc(e.lieu) + ' — ' + esc(e.texte) + '</p><a class="btn" href="agenda.html">Voir l\'agenda</a></div></div>';
    },
    resultats: function (el) {
      var r = D.resultats || [];
      if (!r.length) { el.innerHTML = '<div class="card"><h3>Résultats à venir</h3><p>Les scores, classements et comptes rendus de tournois seront publiés ici dès que le club les aura communiqués.</p><p class="wait">Texte d\'attente — à remplacer dans data/data.js.</p></div>'; return; }
      el.innerHTML = r.map(function (x) { return '<div class="row rv"><b>' + esc(x.score) + '</b><span class="meta">' + esc(fmt(x.date)) + ' · ' + esc(x.competition) + '</span><span>' + esc(x.texte || "") + '</span></div>'; }).join("");
    },
    actus: function (el) {
      var lim = parseInt(el.getAttribute("data-limit") || "99", 10);
      el.innerHTML = (D.actus || []).slice(0, lim).map(function (a) {
        return '<article class="card rv"><span class="tag ' + (a.placeholder ? "g" : "") + '">' + esc(a.date ? fmt(a.date) : "Actualité") + '</span><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p>' +
          (a.lien ? '<a class="more" rel="noopener" target="_blank" href="' + esc(a.lien) + '">' + esc(a.lienTexte || "En savoir plus") + ' →</a>' : "") +
          (a.placeholder ? '<p class="wait">Texte d\'attente</p>' : "") + '</article>';
      }).join("");
    },
    galerie: function (el) {
      var g = D.galerie || [], cats = ["Tout"];
      g.forEach(function (x) { if (cats.indexOf(x.categorie) < 0) cats.push(x.categorie); });
      var f = $("#filters");
      if (f) f.innerHTML = cats.map(function (c, i) { return '<button type="button" class="' + (i ? "" : "on") + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join("");
      el.innerHTML = g.map(function (x) {
        var inner = x.src ? '<img loading="lazy" src="' + esc(x.src) + '" alt="' + esc(x.alt || x.titre) + '">' : '<span class="ph">Photo à ajouter</span>';
        return '<figure class="shot rv" data-c="' + esc(x.categorie) + '" style="margin:0">' + inner + '<figcaption>' + esc(x.categorie) + ' · ' + esc(x.titre) + '</figcaption></figure>';
      }).join("");
      if (f) f.addEventListener("click", function (e) {
        var t = e.target.closest("button"); if (!t) return;
        $$("button", f).forEach(function (x) { x.classList.toggle("on", x === t); });
        $$(".shot", el).forEach(function (s) { s.style.display = (t.dataset.c === "Tout" || s.dataset.c === t.dataset.c) ? "" : "none"; });
      });
    },
    bureau: function (el) {
      el.innerHTML = (D.bureau || []).map(function (m) {
        var ini = m.nom.indexOf("À") === 0 ? "?" : m.nom.split(" ").map(function (w) { return w[0]; }).slice(0, 2).join("");
        return '<div class="card rv"><div class="avatar">' + esc(ini) + '</div><h3>' + esc(m.nom) + '</h3><p>' + esc(m.role) + '</p></div>';
      }).join("");
    },
    chiffres: function (el) {
      el.innerHTML = (D.chiffres || []).map(function (c) {
        return '<div class="stat rv"><div class="n" ' + (c.value == null ? "" : 'data-count="' + c.value + '"') + '>' + (c.value == null ? "—" : "0") + '</div><p>' + esc(c.label) + '</p></div>';
      }).join("");
    }
  };
  $$("[data-render]").forEach(function (el) { var fn = R[el.getAttribute("data-render")]; if (fn) fn(el); });

  /* Apparition + compteurs */
  function count(el) {
    var end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
    function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var els = $$(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        var n = $("[data-count]", e.target); if (n) count(n);
        io.unobserve(e.target);
      });
    }, { threshold: .15 });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add("in"); var n = $("[data-count]", e); if (n) n.textContent = n.getAttribute("data-count"); });
  }

  /* Formulaire Netlify en AJAX */
  var form = $("#contact-form");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var out = $("#form-msg");
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() })
      .then(function (r) { if (!r.ok) throw 0; window.location.href = "/merci"; })
      .catch(function () { out.textContent = "L'envoi a échoué. Écrivez-nous directement à " + (D.club ? D.club.email : "") + "."; });
  });
})();
