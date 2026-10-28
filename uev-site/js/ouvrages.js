/* Ouvrages : catalogue avec recherche/filtres + fiche avec bouton « Acheter » (lien externe) */
(function () {
  "use strict";
  var U = window.UEV;
  var zone = document.getElementById("grille-ouvrages");
  if (zone) return catalogue();
  if (document.getElementById("fiche-ouvrage")) return fiche();

  function catalogue() {
    var q = document.getElementById("q"), g = document.getElementById("genre"), an = document.getElementById("annee"), au = document.getElementById("auteur"), cpt = document.getElementById("compte"), raz = document.getElementById("raz");
    Promise.all([U.charger("ouvrages"), U.charger("auteurs")]).then(function (d) {
      var ouv = d[0], aut = d[1], genres = {}, annees = {}, auteurs = {};
      ouv.forEach(function (o) { if (o.genre) genres[o.genre] = 1; if (o.annee) annees[o.annee] = 1; auteurs[U.auteurNom(o, aut)] = 1; });
      var opt = function (o, tri) { return Object.keys(o).sort(tri).map(function (k) { return '<option value="' + U.esc(k) + '">' + U.esc(k) + "</option>"; }).join(""); };
      g.insertAdjacentHTML("beforeend", opt(genres)); an.insertAdjacentHTML("beforeend", opt(annees, function (a, b) { return b - a; })); au.insertAdjacentHTML("beforeend", opt(auteurs));
      var rendre = function () {
        var t = U.norm(q.value);
        var l = ouv.filter(function (o) {
          var nom = U.auteurNom(o, aut);
          return (!t || U.norm(o.titre + " " + nom + " " + o.resume).indexOf(t) > -1) && (!g.value || o.genre === g.value) && (!an.value || String(o.annee) === an.value) && (!au.value || nom === au.value);
        });
        cpt.textContent = l.length + " ouvrage" + (l.length > 1 ? "s" : "");
        zone.innerHTML = l.length ? l.map(function (o) {
          return '<a class="book reveal" href="ouvrage.html?id=' + U.esc(o.id) + '">' + U.couvertureHtml(o) + "<h3>" + U.esc(o.titre) + "</h3><p>" + U.esc(U.auteurNom(o, aut)) + (o.annee ? " · " + U.esc(o.annee) : "") + "</p></a>";
        }).join("") : '<p class="empty" style="grid-column:1/-1">Aucun ouvrage ne correspond à votre recherche.</p>';
        U.observer(zone);
      };
      [q, g, an, au].forEach(function (e) { e.addEventListener("input", rendre); });
      raz.addEventListener("click", function () { q.value = g.value = an.value = au.value = ""; rendre(); });
      rendre();
    });
  }

  function fiche() {
    var id = new URLSearchParams(location.search).get("id");
    var z = document.getElementById("fiche-ouvrage");
    Promise.all([U.charger("ouvrages"), U.charger("auteurs")]).then(function (d) {
      var o = d[0].filter(function (x) { return x.id === id; })[0];
      if (!o) { z.innerHTML = '<p class="empty">Cet ouvrage n\'existe pas. <a href="ouvrages.html">Retour au catalogue</a></p>'; return; }
      document.title = o.titre + " — Union des Écrivains Vosgiens";
      var h1 = document.getElementById("titre-page"); if (h1) h1.textContent = o.titre;
      var nom = U.auteurNom(o, d[1]);
      var lienAuteur = o.auteurId ? '<a href="auteur.html?id=' + U.esc(o.auteurId) + '">' + U.esc(nom) + "</a>" : U.esc(nom);
      var achat = o.lienAchat
        ? '<a class="btn ambre" href="' + U.esc(o.lienAchat) + '" target="_blank" rel="noopener noreferrer">Acheter ' + U.icone("lien") + '</a><p class="note" style="margin-top:14px">Vous serez redirigé·e vers un site externe. Aucun paiement n\'est géré sur ce site.</p>'
        : '<button class="btn" disabled>Acheter</button><p class="note" style="margin-top:14px">Lien d\'achat à renseigner (librairie en ligne, éditeur, site de l\'auteur…). Aucun paiement n\'est géré sur ce site.</p>';
      z.innerHTML = '<div class="fiche"><div class="fiche-visual">' + U.couvertureHtml(o, true) + "</div><div>" +
        '<p class="eyebrow">' + U.esc(o.genre || "Ouvrage") + (o.exemple ? " · fiche modèle" : "") + "</p><h2>Résumé</h2><p class=\"lead\">" + U.esc(o.resume || "Résumé à renseigner.") + "</p>" +
        "<dl><dt>Auteur·e</dt><dd>" + lienAuteur + "</dd><dt>Éditeur</dt><dd>" + U.esc(o.editeur || "À renseigner") + "</dd><dt>Année</dt><dd>" + U.esc(o.annee || "À renseigner") + "</dd><dt>Prix</dt><dd>" + (o.prix ? U.esc(o.prix) : "À renseigner") + "</dd></dl>" +
        achat + '<p style="margin-top:28px"><a class="btn fantome" href="ouvrages.html">&larr; Tout le catalogue</a></p></div></div>';
    });
  }
})();
