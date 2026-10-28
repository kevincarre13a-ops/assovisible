/* Archives : événements, publications et actions classés par année */
(function () {
  "use strict";
  var U = window.UEV;
  var z = document.getElementById("archives");
  var nav = document.getElementById("annees");
  var lib = { evenement: "Événement", action: "Action", publication: "Publication", repere: "Repère" };
  var q = document.getElementById("q"), t = document.getElementById("type");
  U.charger("archives").then(function (data) {
    data.sort(function (a, b) { return b.annee - a.annee; });
    nav.innerHTML = data.map(function (y) { return '<a href="#a' + y.annee + '">' + y.annee + "</a>"; }).join("");
    var rendre = function () {
      var s = U.norm(q.value), ty = t.value, n = 0;
      z.innerHTML = data.map(function (y) {
        var items = y.items.filter(function (i) { return (!ty || i.type === ty) && (!s || U.norm(i.titre + " " + i.texte + " " + i.lieu).indexOf(s) > -1); })
          .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
        n += items.length;
        if (!items.length) return "";
        return '<section class="year-block reveal" id="a' + y.annee + '"><h2>' + y.annee + '</h2><div class="arch-list">' + items.map(function (i) {
          var quand = i.date ? U.dateLongue(i.date) + (i.dateFin ? " → " + U.dateLongue(i.dateFin) : "") : (i.periode || "");
          return '<article class="arch"><span class="badge">' + U.esc(lib[i.type] || i.type) + "</span><h3>" + U.esc(i.titre) + '</h3><p class="meta">' + U.esc(quand) + (i.lieu ? " · " + U.esc(i.lieu) : "") + "</p><p>" + U.esc(i.texte) + "</p>" +
            (i.lien ? '<a href="' + U.esc(i.lien) + '" rel="noopener">Lire la source</a> ' : "") + '<span class="credit">Source : ' + U.esc(i.source || "") + "</span></article>";
        }).join("") + "</div></section>";
      }).join("") || '<p class="empty">Aucune archive ne correspond à votre recherche.</p>';
      U.observer(z);
    };
    q.addEventListener("input", rendre); t.addEventListener("input", rendre); rendre();
  });
})();
