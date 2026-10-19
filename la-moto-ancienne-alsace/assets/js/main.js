// La Moto Ancienne d'Alsace — scripts communs à toutes les pages
(function () {
  "use strict";

  // Menu burger (mobile)
  var burger = document.querySelector(".bouton-burger");
  var nav = document.querySelector(".nav-principale");

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var ouvert = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!ouvert));
      nav.classList.toggle("ouverte");
      document.body.style.overflow = !ouvert ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (lien) {
      lien.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        nav.classList.remove("ouverte");
        document.body.style.overflow = "";
      });
    });
  }

  // Mise en évidence du lien de menu actif
  var page = (document.body.getAttribute("data-page") || "").trim();
  if (page) {
    document.querySelectorAll(".nav-principale a[data-cible]").forEach(function (lien) {
      if (lien.getAttribute("data-cible") === page) {
        lien.classList.add("actif");
        lien.setAttribute("aria-current", "page");
      }
    });
  }

  // Apparition au défilement
  var elementsReveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && elementsReveal.length) {
    var observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            observateur.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    elementsReveal.forEach(function (el, index) {
      el.style.setProperty("--retard", index % 6);
      observateur.observe(el);
    });
  } else {
    elementsReveal.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // Compteurs animés façon compteur de vitesse
  var compteurs = document.querySelectorAll("[data-compteur]");
  if (compteurs.length) {
    var animerCompteur = function (element) {
      var cible = parseFloat(element.getAttribute("data-compteur"), 10) || 0;
      var suffixe = element.getAttribute("data-suffixe") || "";
      var duree = 1600;
      var debut = null;

      var etape = function (horodatage) {
        if (!debut) debut = horodatage;
        var progres = Math.min((horodatage - debut) / duree, 1);
        var ease = 1 - Math.pow(1 - progres, 3);
        var valeur = Math.floor(ease * cible);
        element.textContent = valeur + suffixe;
        if (progres < 1) {
          window.requestAnimationFrame(etape);
        } else {
          element.textContent = cible + suffixe;
        }
      };
      window.requestAnimationFrame(etape);
    };

    if ("IntersectionObserver" in window) {
      var observateurCompteurs = new IntersectionObserver(
        function (entrees) {
          entrees.forEach(function (entree) {
            if (entree.isIntersecting) {
              animerCompteur(entree.target);
              observateurCompteurs.unobserve(entree.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      compteurs.forEach(function (el) {
        observateurCompteurs.observe(el);
      });
    } else {
      compteurs.forEach(animerCompteur);
    }
  }

  // Filtres de la galerie
  var boutonsFiltre = document.querySelectorAll(".filtre-galerie button");
  var cartesGalerie = document.querySelectorAll("[data-categorie]");
  if (boutonsFiltre.length && cartesGalerie.length) {
    boutonsFiltre.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        boutonsFiltre.forEach(function (b) {
          b.classList.remove("actif");
        });
        bouton.classList.add("actif");
        var filtre = bouton.getAttribute("data-filtre");
        cartesGalerie.forEach(function (carte) {
          var categorie = carte.getAttribute("data-categorie");
          carte.style.display = filtre === "tout" || filtre === categorie ? "" : "none";
        });
      });
    });
  }

  // Année courante dans le pied de page
  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // En-tête : légère ombre une fois le défilement commencé
  var entete = document.querySelector(".entete");
  if (entete) {
    var onScroll = function () {
      entete.style.boxShadow = window.scrollY > 10 ? "0 8px 24px rgba(0,0,0,0.3)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
