/* Auteurs : trombinoscope filtrable + fiche */
(function () {
  "use strict";
  var U = window.UEV;
  var zone = document.getElementById("grille-auteurs");
  if (zone) return trombi();
  if (document.getElementById("fiche-auteur")) return fiche();

  function trombi() {
    var q = document.getElementById("q"), g = document.getElementById("genre"), v = document.getElementById("ville"), cpt = document.getElementById("compte"), raz = document.getElementById("raz");
    U.charger("auteurs").then(function (auteurs) {
      var genres = {}, villes = {};
      auteurs.forEach(function (a) { (a.genres || []).forEach(function (x) { genres[x] = 1; }); if (a.ville) villes[a.ville] = 1; });
      var opt = function (o) { return Object.keys(o).sort().map(function (k) { return '<option value="' + U.esc(k) + '">' + U.esc(k) + "</option>"; }).join(""); };
      g.insertAdjacentHTML("beforeend", opt(genres)); v.insertAdjacentHTML("beforeend", opt(villes));
      var rendre = function () {
        var t = U.norm(q.value);
        var l = auteurs.filter(function (a) {
          return (!t || U.norm(a.nom).indexOf(t) > -1) && (!g.value || (a.genres || []).indexOf(g.value) > -1) && (!v.value || a.ville === v.value);
        });
        cpt.textContent = l.length + " auteur" + (l.length > 1 ? "s" : "") + (l.length === auteurs.length ? "" : " sur " + auteurs.length);
        zone.innerHTML = l.length ? l.map(carte).join("") : '<p class="empty" style="grid-column:1/-1">Aucun auteur ne correspond à votre recherche.</p>';
      };
      [q, g, v].forEach(function (e) { e.addEventListener("input", rendre); });
      raz.addEventListener("click", function () { q.value = g.value = v.value = ""; rendre(); });
      rendre();
    });
    function carte(a) {
      var t = U.teinte(a.nom);
      var nbOuv = (a.ouvrages || []).length;
      var presences = (a.presences || []).length;
      return '<article class="flip"><a class="flip-link" href="auteur.html?id=' + U.esc(a.id) + '" aria-label="Fiche de ' + U.esc(a.nom) + '"><div class="flip-inner">' +
        '<div class="face front" style="--g1:' + t[0] + ";--g2:" + t[1] + '">' +
        (a.photo ? '<img src="' + U.esc(a.photo) + '" alt="Portrait de ' + U.esc(a.nom) + '" loading="lazy">' + (a.photoCredit ? '<span class="credit-ph">© ' + U.esc(a.photoCredit) + "</span>" : "") : '<span class="monogram" aria-hidden="true">' + U.esc(a.initiales) + "</span>") +
        "<h3>" + U.esc(a.nom) + "</h3>" + (a.role ? '<span class="role">' + U.esc(a.role) + "</span>" : "") + "</div>" +
        '<div class="face back"><div><h3>' + U.esc(a.nom) + "</h3><p>" + U.esc(a.bio ? a.bio.slice(0, 110) + (a.bio.length > 110 ? "…" : "") : "Biographie à compléter.") + "</p>" +
        "<p><strong>" + presences + "</strong> rencontre" + (presences > 1 ? "s" : "") + " · <strong>" + nbOuv + "</strong> ouvrage" + (nbOuv > 1 ? "s" : "") + " référencé" + (nbOuv > 1 ? "s" : "") + '</p></div><span class="more">Voir la fiche ' + U.icone("fleche") + "</span></div>" +
        "</div></a></article>";
    }
  }

  function fiche() {
    var id = new URLSearchParams(location.search).get("id");
    var z = document.getElementById("fiche-auteur");
    Promise.all([U.charger("auteurs"), U.charger("ouvrages")]).then(function (d) {
      var a = d[0].filter(function (x) { return x.id === id; })[0];
      if (!a) { z.innerHTML = '<p class="empty">Cette fiche n\'existe pas. <a href="auteurs.html">Retour au trombinoscope</a></p>'; return; }
      document.title = a.nom + " — Union des Écrivains Vosgiens";
      var h1 = document.getElementById("titre-page"); if (h1) h1.textContent = a.nom;
      var ouv = d[1].filter(function (o) { return o.auteurId === a.id; });
      var t = U.teinte(a.nom);
      z.innerHTML = '<div class="fiche"><div class="fiche-visual"><div class="fiche-portrait" style="background:linear-gradient(160deg,' + t[0] + "," + t[1] + ')">' +
        (a.photo ? '<img src="' + U.esc(a.photo) + '" alt="Portrait de ' + U.esc(a.nom) + '">' : "<span aria-hidden=\"true\">" + U.esc(a.initiales) + "</span>") + "</div>" +
        (a.photo && a.photoCredit ? '<p class="credit">Photo : ' + U.esc(a.photoCredit) + "</p>" : '<p class="credit">Portrait à ajouter, avec l\'accord de l\'auteur·e et un crédit photo.</p>') + "</div><div>" +
        (a.role ? '<p class="eyebrow">' + U.esc(a.role) + "</p>" : '<p class="eyebrow">Auteur·e de l\'UEV</p>') +
        "<h2>Biographie</h2><p class=\"lead\">" + U.esc(a.bio || "Biographie à compléter par l'auteur·e ou le bureau de l'UEV.") + "</p>" +
        ((a.genres || []).length ? '<ul class="pills">' + a.genres.map(function (g) { return '<li><span class="badge sapin">' + U.esc(g) + "</span></li>"; }).join("") + "</ul>" : "") +
        "<dl><dt>Ville</dt><dd>" + U.esc(a.ville || "À renseigner") + "</dd><dt>Site / réseaux</dt><dd>" + (a.lien ? '<a href="' + U.esc(a.lien) + '" rel="noopener">' + U.esc(a.lien) + "</a>" : "À renseigner") + "</dd></dl>" +
        ((a.presences || []).length ? "<h3>Rencontré·e à</h3><ul>" + a.presences.map(function (p) { return "<li>" + U.esc(p) + "</li>"; }).join("") + "</ul>" : "") +
        "<h2>Ouvrages</h2>" +
        (ouv.length ? '<div class="list-books">' + ouv.map(function (o) { return '<a class="book" href="ouvrage.html?id=' + U.esc(o.id) + '">' + U.couvertureHtml(o) + "<h3>" + U.esc(o.titre) + "</h3></a>"; }).join("") + "</div>" : '<p class="empty">Aucun ouvrage n\'est encore référencé pour cet·te auteur·e. <a href="contact.html">Proposez une fiche d\'ouvrage</a>.</p>') +
        '<p style="margin-top:28px"><a class="btn fantome" href="auteurs.html">&larr; Tous les auteurs</a></p></div></div>';
    });
  }
})();
