/* Actualités & revue de presse */
(function () {
  "use strict";
  var U = window.UEV;
  U.charger("actualites").then(function (d) {
    document.getElementById("liste-actus").innerHTML = d.actualites.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(function (a) {
      return '<article class="news reveal"><span class="badge ambre">' + U.esc(a.categorie) + '</span><time datetime="' + a.date + '">' + U.dateLongue(a.date) + "</time><h3>" + U.esc(a.titre) + "</h3><p>" + U.esc(a.texte) + '</p><a href="' + U.esc(a.lien) + '" rel="noopener">Lire l\'article d\'origine</a><span class="src">Source : ' + U.esc(a.source) + "</span></article>";
    }).join("");
    document.getElementById("liste-presse").innerHTML = d.presse.map(function (a) {
      return '<article class="news reveal"><span class="badge sapin">' + U.esc(a.media) + '</span><time datetime="' + a.date + '">' + U.dateLongue(a.date) + "</time><h3>" + U.esc(a.titre) + "</h3><p>" + U.esc(a.texte) + '</p><a href="' + U.esc(a.lien) + '" rel="noopener">Voir la publication</a></article>';
    }).join("") + '<article class="news pcard attente reveal"><span class="badge ambre">À compléter</span><h3>Revue de presse</h3><p>Aucun article de presse écrite n\'a pu être vérifié lors de la refonte. Ajoutez ici les articles de Vosges Matin, L\'Est républicain, La Liberté de l\'Est ou des médias locaux (fichier data/actualites.json, rubrique « presse »).</p></article>';
    U.observer();
  });
})();
