/* Espace administrateur — MAQUETTE : toutes les valeurs sont fictives et générées ici */
(function () {
  "use strict";
  var U = window.UEV;
  var login = document.getElementById("login-form");
  var msg = document.getElementById("login-msg");
  login.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.classList.add("show");
    msg.textContent = "Connexion à brancher plus tard (par exemple Netlify Identity). Cette maquette ne vérifie aucun identifiant.";
  });
  var mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  var visites = [820, 760, 940, 1210, 1580, 1720, 1190, 1630, 1050, 980, 1340, 880];
  var max = Math.max.apply(null, visites);
  document.getElementById("bars").innerHTML = visites.map(function (v, i) { return '<div data-v="' + v + '" style="height:' + Math.round(v / max * 100) + "%;animation-delay:" + i * 0.06 + 's"></div>'; }).join("");
  document.getElementById("bars-x").innerHTML = mois.map(function (m) { return "<span>" + m + "</span>"; }).join("");
  var pages = [["Accueil", 100], ["Agenda", 72], ["Auteurs", 64], ["Ouvrages", 51], ["Archives", 28], ["Contact", 22]];
  document.getElementById("hbar").innerHTML = pages.map(function (p) { return "<div><span>" + p[0] + '</span><i style="--w:' + p[1] + '%"></i><b>' + p[1] + "%</b></div>"; }).join("");
  var inscr = [["Atelier d'écriture (exemple)", 18, "Complet"], ["Salon d'automne (exemple)", 42, "Ouvert"], ["Rencontre-dédicace (exemple)", 27, "Ouvert"], ["Veillée d'hiver (exemple)", 9, "Ouvert"]];
  document.getElementById("inscr").innerHTML = inscr.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("");
  var ventes = [["Titre modèle A", 34, "612 €"], ["Titre modèle B", 21, "378 €"], ["Titre modèle C", 12, "204 €"]];
  document.getElementById("ventes").innerHTML = ventes.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("");
  U.compteurs();
})();
