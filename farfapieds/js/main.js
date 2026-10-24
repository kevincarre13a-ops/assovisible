(function () {
  var F = window.FARFA || {}, S = F.site || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  var COURT = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
  var JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : t; return d.innerHTML; }
  function dateFr(iso) { var p = iso.split("-"); return { j: +p[2], m: MOIS[+p[1] - 1], a: p[0] }; }

  /* menu burger */
  var b = $(".burger"), nav = $("#menu");
  if (b && nav) {
    b.addEventListener("click", function () {
      var o = nav.classList.toggle("ouvert"); b.setAttribute("aria-expanded", o);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { nav.classList.remove("ouvert"); b.setAttribute("aria-expanded", false); } });
  }

  /* prochain rendez-vous : calculé à partir du rythme habituel (mardi, pause juillet-août) */
  function prochainRdv() {
    var r = S.rendezVous; if (!r) return null;
    var d = new Date(); d.setHours(0, 0, 0, 0);
    for (var i = 0; i < 400; i++) {
      var x = new Date(d.getTime() + i * 864e5);
      if (x.getDay() === r.jour && r.pauseMois.indexOf(x.getMonth()) === -1) {
        if (i === 0 && new Date().getHours() >= 10) continue;
        return x;
      }
    }
  }
  var rdvBox = $("#prochain-rdv");
  if (rdvBox) {
    var x = prochainRdv(), r = S.rendezVous;
    if (x) {
      var pause = x.getTime() - Date.now() > 14 * 864e5;
      rdvBox.innerHTML = '<div class="rdv-date" aria-hidden="true"><span>' + MOIS[x.getMonth()].slice(0, 4) + '.</span><strong>' + x.getDate() + '</strong><span>' + JOURS[x.getDay()] + '</span></div>' +
        '<div><span class="etiquette">' + (pause ? "Reprise après la pause d'été" : "Prochain rendez-vous") + '</span><h2>' + JOURS[x.getDay()] + ' ' + x.getDate() + ' ' + MOIS[x.getMonth()] + ' · ' + r.heureRdv + '</h2><p>Départ ' + r.heureDepart + ' · ' + esc(r.lieu) + '. Venez essayer, sans engagement !</p></div>' +
        '<a class="btn" href="contact.html">Je viens essayer</a>';
    }
  }

  /* chiffres animés */
  var ch = $("#chiffres");
  if (ch && S.chiffres) {
    ch.innerHTML = S.chiffres.map(function (c) { return '<div class="chiffre reveal"><div class="n" data-v="' + c.valeur + '" data-s="' + esc(c.suffixe) + '">0' + esc(c.suffixe) + '</div><p>' + esc(c.label) + '</p></div>'; }).join("");
  }
  function compter(el) {
    var v = +el.dataset.v, s = el.dataset.s, t0 = performance.now(), dur = 1600;
    if (reduit) { el.textContent = v + s; return; }
    (function pas(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(v * e) + s;
      if (k < 1) requestAnimationFrame(pas);
    })(t0);
  }

  /* activités */
  var act = $("#liste-activites");
  if (act && F.activites) act.innerHTML = F.activites.map(function (a) {
    return '<article class="carte reveal"><span class="ico" aria-hidden="true">' + a.icone + '</span><h3>' + esc(a.titre) + '</h3><span class="badge">' + esc(a.detail) + '</span><p>' + esc(a.texte) + '</p><p class="meta"><strong>Quand :</strong> ' + esc(a.quand) + '<br><strong>Où :</strong> ' + esc(a.lieu) + '</p></article>';
  }).join("");
  var apercu = $("#apercu-activites");
  if (apercu && F.activites) apercu.innerHTML = F.activites.slice(0, 3).map(function (a) {
    return '<a class="carte carte-lien reveal" href="activites.html"><span class="ico" aria-hidden="true">' + a.icone + '</span><h3>' + esc(a.titre) + '</h3><span class="badge">' + esc(a.detail) + '</span><p>' + esc(a.texte) + '</p></a>';
  }).join("");
  var infos = $("#infos-pratiques");
  if (infos && F.infosPratiques) infos.innerHTML = F.infosPratiques.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");

  /* agenda */
  function evt(e) {
    var d = e.date ? dateFr(e.date) : null;
    return '<article class="evt reveal"><div class="j' + (d ? "" : " na") + '">' + (d ? "<strong>" + d.j + "</strong>" + COURT[MOIS.indexOf(d.m)] : "Date<br>à confirmer") + '</div><div><h3>' + esc(e.titre) + '</h3><p>' +
      (e.heure ? esc(e.heure) + " · " : "") + esc(e.lieu || "") + '</p><p>' + esc(e.texte || "") + '</p></div></article>';
  }
  var ag = $("#liste-agenda");
  if (ag && F.agenda) ag.innerHTML = F.agenda.map(evt).join("");
  var arc = $("#liste-archives");
  if (arc) arc.innerHTML = (F.archives && F.archives.length) ? F.archives.map(evt).join("") : '<p class="attente">Les souvenirs des sorties passées viendront s\'ajouter ici.</p>';

  /* actualités */
  function actu(a) {
    var d = dateFr(a.date);
    return '<article class="carte actu reveal"><span class="badge">' + esc(a.tag || "Actu") + '</span><time datetime="' + a.date + '">' + d.j + " " + d.m + " " + d.a + '</time><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p></article>';
  }
  var an = $("#liste-actus"), ah = $("#actus-accueil");
  if (an && F.actualites) an.innerHTML = F.actualites.map(actu).join("");
  if (ah && F.actualites) ah.innerHTML = F.actualites.slice(0, 3).map(actu).join("");

  /* galerie */
  var gal = $("#photos");
  if (gal && F.galerie) {
    var cats = ["Toutes"]; F.galerie.forEach(function (g) { if (cats.indexOf(g.cat) < 0) cats.push(g.cat); });
    var fil = $("#filtres");
    fil.innerHTML = cats.map(function (c, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + esc(c) + "</button>"; }).join("");
    var rendre = function (c) {
      gal.innerHTML = F.galerie.filter(function (g) { return c === "Toutes" || g.cat === c; }).map(function (g) {
        var cadre = g.src ? '<img src="' + esc(g.src) + '" alt="' + esc(g.titre) + '" loading="lazy">' : scene(g.scene, g.titre);
        return '<figure class="photo reveal"><div class="cadre">' + cadre + '</div><figcaption>' + esc(g.titre) + '<small>' + esc(g.cat) + (g.src ? "" : " · photo à ajouter") + '</small></figcaption></figure>';
      }).join("");
      revel();
    };
    fil.addEventListener("click", function (e) {
      var bt = e.target.closest("button"); if (!bt) return;
      $$("button", fil).forEach(function (x) { x.setAttribute("aria-pressed", x === bt); });
      rendre(bt.textContent);
    });
    rendre("Toutes");
  }
  function scene(k, titre) {
    var c = { bocage: ["#bfe6f7", "#8cc152"], chemin: ["#ffe9a8", "#6fb04a"], pique: ["#ffd9b0", "#7bbf55"], colline: ["#cfe8ff", "#5aa04a"], etoiles: ["#27386b", "#2f6b3a"], groupe: ["#ffe08a", "#8cc152"] }[k] || ["#bfe6f7", "#8cc152"];
    return '<svg viewBox="0 0 400 300" role="img" aria-label="Illustration : ' + esc(titre) + '" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="' + c[0] + '"/>' +
      (k === "etoiles" ? '<circle cx="320" cy="60" r="26" fill="#ffe08a"/><circle cx="60" cy="50" r="3" fill="#fff"/><circle cx="150" cy="90" r="2.5" fill="#fff"/><circle cx="240" cy="40" r="3" fill="#fff"/>' : '<circle cx="320" cy="64" r="34" fill="#ffc93c"/>') +
      '<path d="M0 190 Q100 140 200 180 T400 160 V300 H0Z" fill="' + c[1] + '"/><path d="M0 235 Q120 200 240 235 T400 220 V300 H0Z" fill="#2f6b3a" opacity=".75"/>' +
      '<g fill="#fff" opacity=".9"><use href="#pas" x="120" y="205" width="22" height="34" transform="rotate(-12 131 222)"/><use href="#pas" x="165" y="228" width="22" height="34" transform="rotate(10 176 245)"/><use href="#pas" x="215" y="203" width="22" height="34" transform="rotate(-12 226 220)"/><use href="#pas" x="258" y="226" width="22" height="34" transform="rotate(10 269 243)"/></g></svg>';
  }

  /* hero : petits pas qui se promènent */
  var layer = $(".pas-layer");
  if (layer && !reduit) {
    var n = 0, gauche = true;
    var marche = function () {
      var w = layer.clientWidth, h = layer.clientHeight, i = n++, t = (i % 18) / 18;
      var x = t * (w + 80) - 40, y = h * (0.78 - 0.36 * Math.sin(t * Math.PI * 1.4) ) + (gauche ? -14 : 14);
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("class", "pas"); s.setAttribute("viewBox", "0 0 26 40");
      s.style.left = x + "px"; s.style.top = y + "px"; s.style.setProperty("--rot", (gauche ? 72 : 88) + "deg");
      s.innerHTML = '<use href="#pas"/>'; gauche = !gauche;
      layer.appendChild(s); setTimeout(function () { s.remove(); }, 5600);
    };
    marche(); setInterval(marche, 420);
  }

  /* apparitions + compteurs */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("vu"); io.unobserve(e.target);
      var n = $(".n", e.target); if (n) compter(n);
    });
  }, { threshold: .15 }) : null;
  function revel() { $$(".reveal:not(.vu)").forEach(function (el) { if (io) io.observe(el); else { el.classList.add("vu"); var n = $(".n", el); if (n) compter(n); } }); }
  revel();

  /* photo d'accueil, année du pied de page */
  var hp = $("#hero-photo"); if (hp && S.photoAccueil) hp.style.backgroundImage = "url('" + S.photoAccueil + "')";
  var an2 = $("#annee"); if (an2) an2.textContent = new Date().getFullYear();

  /* formulaire de contact (Netlify Forms) : envoi sans rechargement, repli sur l'envoi classique */
  var m = $("#merci"), fm = $("form.contact");
  function merci() { if (m) { m.hidden = false; m.focus(); } }
  if (/envoye=1/.test(location.search)) merci();
  if (fm && window.fetch) fm.addEventListener("submit", function (e) {
    e.preventDefault();
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(fm)).toString() })
      .then(function (r) { if (!r.ok) throw 0; fm.reset(); merci(); })
      .catch(function () { fm.submit(); });
  });

  /* réseaux sociaux (liens existants uniquement) */
  var rs = $("#reseaux");
  if (rs) rs.innerHTML = (S.reseaux && S.reseaux.length) ? S.reseaux.map(function (r) { return '<li><a href="' + esc(r.url) + '" rel="noopener" target="_blank">' + esc(r.nom) + "</a></li>"; }).join("") : '<li>Pas encore de page en ligne</li>';
})();
