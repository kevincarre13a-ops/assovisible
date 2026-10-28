/* Agenda : liste filtrable + inscription en ligne (Netlify Forms) */
(function () {
  "use strict";
  var U = window.UEV;
  var liste = document.getElementById("liste-evenements");
  var chips = document.getElementById("filtres-type");
  var dlg = document.getElementById("dlg-inscription");
  var form = document.getElementById("form-inscription");
  var types = { atelier: "Atelier d'écriture", salon: "Salon & dédicaces", rencontre: "Rencontre", spectacle: "Spectacle", conference: "Conférence", concours: "Concours", autre: "Autre" };
  var tous = [], filtre = "tous";

  U.charger("evenements").then(function (evts) {
    var auj = new Date().toISOString().slice(0, 10);
    tous = evts.filter(function (e) { return !e.date || (e.dateFin || e.date) >= auj; }).sort(function (a, b) {
      if (a.date && b.date) return a.date.localeCompare(b.date);
      return a.date ? -1 : b.date ? 1 : 0;
    });
    var presents = {};
    tous.forEach(function (e) { presents[e.type] = 1; });
    chips.innerHTML = '<li><button class="chip" aria-pressed="true" data-t="tous">Tous</button></li>' +
      Object.keys(presents).map(function (t) { return '<li><button class="chip" aria-pressed="false" data-t="' + t + '">' + U.esc(types[t] || t) + "</button></li>"; }).join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      filtre = b.dataset.t;
      chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      rendre();
    });
    rendre();
    if (location.hash) { var c = document.querySelector(location.hash); if (c) c.scrollIntoView(); }
  });

  function rendre() {
    var l = tous.filter(function (e) { return filtre === "tous" || e.type === filtre; });
    if (!l.length) { liste.innerHTML = '<p class="empty">Aucun événement dans cette catégorie pour le moment.</p>'; return; }
    liste.innerHTML = l.map(function (e) {
      var tuile = e.date
        ? (function () { var d = new Date(e.date + "T12:00:00"); return '<div class="date-tile"><b>' + d.getDate() + "</b><span>" + U.mois[d.getMonth()].slice(0, 4) + ". " + d.getFullYear() + "</span></div>"; })()
        : '<div class="date-tile tbd"><b>Date à<br>annoncer</b></div>';
      var meta = [];
      if (e.date) meta.push(U.icone("cal") + U.dateLongue(e.date) + (e.heure ? " · " + U.esc(e.heure) : ""));
      else if (e.periode) meta.push(U.icone("cal") + U.esc(e.periode));
      if (e.lieu) meta.push(U.icone("pin") + U.esc(e.lieu) + (e.ville ? ", " + U.esc(e.ville) : ""));
      if (e.gratuit === true) meta.push("Entrée libre");
      return '<article class="event reveal" id="' + U.esc(e.id) + '">' + tuile + "<div>" +
        '<span class="badge">' + U.esc(types[e.type] || e.type) + "</span>" + (e.statut === "a_confirmer" ? ' <span class="badge ambre">À confirmer</span>' : "") +
        "<h3>" + U.esc(e.titre) + '</h3><div class="meta">' + meta.map(function (m) { return "<span>" + m + "</span>"; }).join("") + "</div><p>" + U.esc(e.description) + "</p>" +
        (e.affiche ? '<img class="event-poster" src="' + U.esc(e.affiche) + '" alt="" loading="lazy" width="160"><p class="credit">' + U.esc(e.afficheCredit || "") + "</p>" : "") +
        "</div>" + (e.inscription ? '<button class="btn ambre" data-ins="' + U.esc(e.id) + '">S\'inscrire</button>' : "") + "</article>";
    }).join("");
    U.observer(liste);
  }

  liste.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ins]"); if (!b) return;
    var ev = tous.filter(function (x) { return x.id === b.dataset.ins; })[0];
    form.elements["evenement"].value = ev.titre + (ev.date ? " (" + U.dateLongue(ev.date) + ")" : " — date à annoncer");
    document.getElementById("dlg-titre-evt").textContent = ev.titre;
    form.querySelector(".form-ok").classList.remove("show"); form.querySelector(".form-err").classList.remove("show");
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    form.elements["nom"].focus();
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  U.formulaire(form);
})();
