/* Prix & concours, partenaires */
(function () {
  "use strict";
  var U = window.UEV;
  var carte = function (t, st, txt, lien, attente) {
    return '<article class="pcard reveal' + (attente ? " attente" : "") + '"><span class="badge ' + (attente ? "ambre" : "sapin") + '">' + U.esc(st) + "</span><h3>" + U.esc(t) + "</h3><p>" + U.esc(txt) + "</p>" + (lien ? '<a href="' + U.esc(lien) + '" rel="noopener">En savoir plus</a>' : "") + "</article>";
  };
  var p = document.getElementById("liste-prix");
  if (p) U.charger("prix").then(function (d) {
    document.getElementById("prix-intro").textContent = d.intro;
    p.innerHTML = d.prix.map(function (x) { return carte(x.nom, x.statut, x.texte, x.lien); }).join("");
    document.getElementById("liste-concours").innerHTML = d.concours.map(function (x) { return carte(x.nom, x.statut, x.texte, x.lien, true); }).join("");
    document.getElementById("liste-scenes").innerHTML = d.scenes.map(function (x) { return carte(x.nom, "Sans compétition", x.texte, ""); }).join("");
    U.observer();
  });
  var pa = document.getElementById("liste-partenaires");
  if (pa) U.charger("partenaires").then(function (d) {
    pa.innerHTML = d.map(function (x) { return carte(x.nom, x.type, x.texte, x.lien, x.nom === "À renseigner"); }).join("");
    U.observer();
  });
})();
