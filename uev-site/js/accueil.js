/* Accueil : prochain événement, ouvrages à la une, actualités, chiffres clés */
(function () {
  "use strict";
  var U = window.UEV;
  Promise.all([U.charger("site"), U.charger("evenements"), U.charger("archives"), U.charger("auteurs"), U.charger("ouvrages"), U.charger("actualites")]).then(function (d) {
    var site = d[0], evts = d[1], arch = d[2], auteurs = d[3], ouvrages = d[4], actus = d[5].actualites;
    prochain(evts, arch);
    une(ouvrages, auteurs);
    actualites(actus);
    chiffres(site, auteurs, arch);
    U.observer(); U.compteurs();
  }).catch(function (e) { console.error(e); });

  function debut(e) { return e.date ? new Date(e.date + "T" + (e.heure || "09:00").replace("h", ":") + ":00") : null; }

  function prochain(evts, arch) {
    var zone = document.getElementById("prochain");
    if (!zone) return;
    var maintenant = new Date();
    var futurs = evts.filter(function (e) { var d = debut(e); return d && d > maintenant; }).sort(function (a, b) { return debut(a) - debut(b); });
    var e = futurs[0];
    if (e) {
      var lieu = [e.lieu, e.ville].filter(Boolean).join(", ");
      zone.innerHTML =
        '<div class="next-body"><p class="eyebrow">Prochain rendez-vous</p><h2>' + U.esc(e.titre) + "</h2>" +
        '<div class="next-meta"><span>' + U.icone("cal") + U.dateLongue(e.date) + (e.heure ? " à " + U.esc(e.heure) : "") + "</span><span>" + U.icone("pin") + U.esc(lieu) + "</span></div>" +
        '<div class="countdown" role="timer" aria-live="off"><div><b data-u="j">0</b><small>jours</small></div><div><b data-u="h">0</b><small>heures</small></div><div><b data-u="m">0</b><small>minutes</small></div><div><b data-u="s">0</b><small>secondes</small></div></div>' +
        '<a class="btn ambre" href="agenda.html#' + U.esc(e.id) + '">Voir et s\'inscrire ' + U.icone("fleche") + "</a></div>" +
        '<div class="next-visual"' + (e.affiche ? ' style="--foto:url(/' + U.esc(e.affiche) + ')"' : "") + ">" + (e.afficheCredit ? '<p class="credit">' + U.esc(e.afficheCredit) + "</p>" : "") + "</div>";
      var cible = debut(e), nb = {};
      zone.querySelectorAll("[data-u]").forEach(function (n) { nb[n.dataset.u] = n; });
      var tic = function () {
        var s = Math.max(0, Math.floor((cible - new Date()) / 1000));
        nb.j.textContent = Math.floor(s / 86400); nb.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
        nb.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0"); nb.s.textContent = String(s % 60).padStart(2, "0");
      };
      tic(); setInterval(tic, 1000);
      return;
    }
    /* Aucun événement daté à venir : on le dit honnêtement et on rappelle le dernier rendez-vous */
    var dernier = null;
    arch.forEach(function (y) { y.items.forEach(function (i) { if (i.date && (!dernier || i.date > dernier.date)) dernier = i; }); });
    var depuis = dernier ? Math.max(0, Math.floor((new Date() - new Date(dernier.date + "T12:00:00")) / 86400000)) : null;
    zone.innerHTML =
      '<div class="next-body"><p class="eyebrow">Prochain rendez-vous</p><h2>Prochaines dates bientôt annoncées</h2>' +
      '<p style="color:#d9dfec;max-width:48ch">L\'agenda se remplit au fil des saisons : ateliers d\'écriture, salons, dédicaces. Dès qu\'une date est publiée, le compte à rebours démarre ici.</p>' +
      (dernier ? '<div class="countdown" aria-label="Depuis le dernier rendez-vous"><div style="grid-column:1/-1"><b>' + depuis + '</b><small>jours depuis « ' + U.esc(dernier.titre.split(" — ")[0]) + " »</small></div></div>" : "") +
      '<div class="hero-actions"><a class="btn ambre" href="agenda.html">Voir l\'agenda ' + U.icone("fleche") + '</a><a class="btn fantome" href="' + U.esc(dernier ? dernier.lien : "archives.html") + '">Revoir le dernier rendez-vous</a></div></div>' +
      '<div class="next-visual" style="--foto:url(/img/imaginales-stand.webp)"><p class="credit">Stand de l\'UEV aux Imaginales — blog officiel de l\'UEV</p></div>';
  }

  function une(ouvrages, auteurs) {
    var piste = document.getElementById("une");
    if (!piste) return;
    piste.innerHTML = ouvrages.map(function (o) {
      return '<a class="book" href="ouvrage.html?id=' + U.esc(o.id) + '">' + U.couvertureHtml(o) + "<h3>" + U.esc(o.titre) + "</h3><p>" + U.esc(U.auteurNom(o, auteurs)) + "</p></a>";
    }).join("");
    var pas = function (s) { piste.scrollBy({ left: s * 270, behavior: "smooth" }); };
    document.getElementById("une-prec").addEventListener("click", function () { pas(-1); });
    document.getElementById("une-suiv").addEventListener("click", function () { pas(1); });
  }

  function actualites(actus) {
    var z = document.getElementById("actus");
    if (!z) return;
    z.innerHTML = actus.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 3).map(function (a) {
      return '<article class="news reveal"><span class="badge ambre">' + U.esc(a.categorie) + "</span><time datetime=\"" + a.date + '">' + U.dateLongue(a.date) + "</time><h3>" + U.esc(a.titre) + "</h3><p>" + U.esc(a.texte) + '</p><a href="' + U.esc(a.lien) + '" rel="noopener">Lire l\'article</a><span class="src">Source : ' + U.esc(a.source) + "</span></article>";
    }).join("");
  }

  function chiffres(site, auteurs, arch) {
    var z = document.getElementById("chiffres");
    if (!z) return;
    var nbEvts = 0;
    arch.forEach(function (y) { y.items.forEach(function (i) { if (i.type === "evenement") nbEvts++; }); });
    var annees = new Date().getFullYear() - site.depuis;
    var cases = [
      [annees, "", "années d'existence", "depuis " + site.depuis + " — date à confirmer"],
      [auteurs.length, "", "auteurs au trombinoscope", "la liste s'enrichit"],
      [site.chiffres.vosgiotheque, "+", "auteurs à la Vosgiothèque", "selon le blog de l'UEV"],
      [nbEvts, "", "rendez-vous archivés", "depuis 2020 sur ce site"]
    ];
    z.innerHTML = cases.map(function (c) {
      return '<div class="stat reveal"><b data-count="' + c[0] + '" data-suffix="' + c[1] + '">0</b><span>' + c[2] + "</span><small>" + c[3] + "</small></div>";
    }).join("");
  }
})();
