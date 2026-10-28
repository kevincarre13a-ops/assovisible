/* Contact : FAQ en accordéon, forum externe */
(function () {
  "use strict";
  var U = window.UEV;
  U.charger("faq").then(function (faq) {
    var cats = [];
    faq.forEach(function (f) { if (cats.indexOf(f.categorie) < 0) cats.push(f.categorie); });
    document.getElementById("faq-liste").innerHTML = cats.map(function (c) {
      return "<h3>" + U.esc(c) + "</h3>" + faq.filter(function (f) { return f.categorie === c; }).map(function (f) {
        return "<details><summary>" + U.esc(f.q) + '</summary><div class="ans"><p>' + U.esc(f.r) + "</p></div></details>";
      }).join("");
    }).join("");
  });
  U.charger("site").then(function (s) {
    var f = document.getElementById("forum-lien");
    if (s.forum && s.forum.url) { f.href = s.forum.url; f.removeAttribute("aria-disabled"); f.textContent = "Rejoindre le forum"; }
    document.getElementById("forum-texte").textContent = s.forum && s.forum.url ? "Échangez avec les autres membres et lecteurs." : s.forum.texte;
  });
})();
