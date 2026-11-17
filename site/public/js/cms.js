// =========================================================
// Club Bisontin de Scrabble — affichage des contenus du site.
// Les contenus d'origine viennent de js/contenu.js ; les contenus modifiés
// dans l'espace administrateur viennent de /api/contenu et les remplacent.
// =========================================================
(function () {
  "use strict";

  var DEF = window.CONTENU_DEFAUT || {};
  var SECTIONS = ["contact", "seances", "calendrier", "calendrierDoc", "actualites", "galerie",
    "tarifs", "bureau", "classement", "palmares", "archives", "textes"];

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_COURTS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var CATEGORIES = { tournois: "Tournois", seances: "Séances", remises: "Remises de prix", vie: "Vie du club" };
  var LIENS = {
    "le-club.html": "Découvrir le club →",
    "jouer-avec-nous.html": "Découvrir les séances →",
    "tournois-resultats.html": "Voir les tournois →",
    "galerie.html": "Voir la galerie →",
    "actualites.html": "Voir les actualités →",
    "adherer-contact.html": "Nous contacter →"
  };

  /* ---------- Petits outils ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = String(text);
    return e;
  }
  function str(v) { return v === undefined || v === null ? "" : String(v); }
  function liste(v) { return Array.isArray(v) ? v : []; }
  function dateValide(s) { return /^\d{4}-\d{2}-\d{2}$/.test(str(s)); }
  function parseDay(s) {
    var p = str(s).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function aujourdhui() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function estPasse(ev) { return parseDay(ev.dateFin || ev.date) < aujourdhui(); }
  function jourLabel(d) { return d.getDate() === 1 ? "1er" : String(d.getDate()); }
  function dateLongue(ev) {
    var d = parseDay(ev.date);
    if (!dateValide(ev.dateFin)) {
      return JOURS[d.getDay()] + " " + jourLabel(d) + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
    }
    var f = parseDay(ev.dateFin);
    if (d.getMonth() === f.getMonth() && d.getFullYear() === f.getFullYear()) {
      return "du " + jourLabel(d) + " au " + jourLabel(f) + " " + MOIS[f.getMonth()] + " " + f.getFullYear();
    }
    return "du " + jourLabel(d) + " " + MOIS[d.getMonth()] + " au " + jourLabel(f) + " " + MOIS[f.getMonth()] + " " + f.getFullYear();
  }
  function dateCourte(s) {
    if (!dateValide(s)) return str(s);
    var p = s.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  function parDate(a, b) { return str(a.date) < str(b.date) ? -1 : str(a.date) > str(b.date) ? 1 : 0; }
  function fichierUrl(id) { return /^[a-z0-9-]{6,64}$/.test(str(id)) ? "/api/fichiers/" + id : ""; }
  function lienTel(t) {
    var d = str(t).replace(/[^\d+]/g, "");
    if (/^0\d{9}$/.test(d)) d = "+33" + d.slice(1);
    return d ? "tel:" + d : "";
  }
  function lienCarte(adresse, embed) {
    return "https://www.google.com/maps?q=" + encodeURIComponent(adresse) + (embed ? "&output=embed" : "");
  }
  function lignes(parent, texte) {
    str(texte).split(/\n/).forEach(function (ligne, i) {
      if (i) parent.appendChild(document.createElement("br"));
      parent.appendChild(document.createTextNode(ligne));
    });
  }
  function initiales(nom) {
    var mots = str(nom).trim().split(/[\s-]+/).filter(Boolean);
    if (!mots.length) return "?";
    return (mots[0][0] + (mots.length > 1 ? mots[mots.length - 1][0] : "")).toUpperCase();
  }
  function minuscule(s) { s = str(s); return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- Fusion contenus d'origine + contenus modifiés ---------- */
  function fusion(api) {
    var d = {};
    SECTIONS.forEach(function (k) {
      var v = api && Object.prototype.hasOwnProperty.call(api, k) ? api[k] : undefined;
      d[k] = v !== undefined && v !== null ? v : DEF[k];
    });
    d.contact = Object.assign({}, DEF.contact || {}, (api && api.contact) || {});
    d.textes = Object.assign({}, DEF.textes || {}, (api && api.textes) || {});
    return d;
  }

  /* ---------- Textes (attribut data-edit) ---------- */
  var originaux = new WeakMap();
  function appliquerTextes(textes) {
    document.querySelectorAll("[data-edit]").forEach(function (e) {
      if (!originaux.has(e)) originaux.set(e, e.textContent.replace(/\s+/g, " ").trim());
      var cle = e.getAttribute("data-edit");
      var modifie = Object.prototype.hasOwnProperty.call(textes, cle) && typeof textes[cle] === "string";
      var valeur = modifie ? textes[cle] : originaux.get(e);
      var bloc = e.closest("[data-edit-bloc]") || e;
      if (!str(valeur).trim() && e.hasAttribute("data-edit-vide")) {
        bloc.hidden = true;
        return;
      }
      bloc.hidden = false;
      if (modifie) {
        e.textContent = valeur;
        e.classList.add("texte-modifie");
      }
    });
  }

  /* ---------- Coordonnées et chiffres ---------- */
  function resumeSeances(seances) {
    var morceaux = liste(seances).map(function (s) {
      return (minuscule(s.jour) + " à " + str(s.horaire)).trim();
    });
    if (morceaux.length <= 1) return morceaux.join("");
    return morceaux.slice(0, -1).join(", ") + " et " + morceaux[morceaux.length - 1];
  }
  function appliquerCoordonnees(d) {
    var c = d.contact || {};
    var adresse = [str(c.adresse1), str(c.adresse2)].filter(Boolean).join(", ");
    var valeurs = {
      "contact.nom": str(c.nom),
      "contact.fonction": str(c.fonction),
      "contact.fonction-minuscule": minuscule(c.fonction),
      "contact.email": str(c.email),
      "contact.telephone": str(c.telephone),
      "contact.adresse1": str(c.adresse1),
      "contact.adresse2": str(c.adresse2),
      "contact.licencies": str(c.licencies),
      "seances.resume": resumeSeances(d.seances)
    };
    document.querySelectorAll("[data-cms]").forEach(function (e) {
      var cle = e.getAttribute("data-cms");
      if (Object.prototype.hasOwnProperty.call(valeurs, cle)) e.textContent = valeurs[cle];
    });
    document.querySelectorAll("[data-cms-adresse]").forEach(function (e) {
      e.textContent = "";
      lignes(e, [str(c.adresse1), str(c.adresse2)].filter(Boolean).join("\n"));
    });
    document.querySelectorAll('[data-cms-lien="email"]').forEach(function (e) {
      e.setAttribute("href", "mailto:" + str(c.email));
    });
    document.querySelectorAll('[data-cms-lien="tel"]').forEach(function (e) {
      e.setAttribute("href", lienTel(c.telephone));
    });
    document.querySelectorAll('[data-cms-lien="carte"]').forEach(function (e) {
      e.setAttribute("href", lienCarte(adresse, false));
    });
    document.querySelectorAll("[data-cms-carte]").forEach(function (e) {
      var src = lienCarte(adresse, true);
      if (e.getAttribute("src") !== src) e.setAttribute("src", src);
    });
    document.querySelectorAll("[data-cms-si]").forEach(function (e) {
      e.hidden = !str(valeurs[e.getAttribute("data-cms-si")]).trim();
    });
    var nombres = {
      licencies: parseInt(c.licencies, 10) || 0,
      seances: liste(d.seances).length,
      palmares: liste(d.palmares).length
    };
    document.querySelectorAll("[data-cms-count]").forEach(function (e) {
      var n = nombres[e.getAttribute("data-cms-count")];
      if (n === undefined) return;
      e.setAttribute("data-count", String(n));
      if (window.CMS_PRET) e.textContent = n.toLocaleString("fr-FR");
    });
  }

  /* ---------- Calendrier ---------- */
  function carteEvenement(ev) {
    var d = parseDay(ev.date);
    var passe = estPasse(ev);
    var article = el("article", "event" + (passe ? " is-past" : ""));
    var date = el("div", "news-date");
    date.appendChild(el("span", "d", d.getDate()));
    date.appendChild(el("span", "m", MOIS_COURTS[d.getMonth()] + " " + d.getFullYear()));
    var corps = el("div");
    corps.appendChild(el("h3", "", ev.titre));
    corps.appendChild(el("p", "when-long", dateLongue(ev)));
    if (str(ev.lieu)) corps.appendChild(el("p", "", "📍 " + ev.lieu));
    if (passe) corps.appendChild(el("span", "badge badge-outline", "Terminé"));
    article.appendChild(date);
    article.appendChild(corps);
    return article;
  }
  function remplirCalendrier(conteneur, evenements, montrerPasses) {
    if (!conteneur) return 0;
    conteneur.textContent = "";
    var passes = evenements.filter(estPasse);
    var avenir = evenements.filter(function (e) { return !estPasse(e); });
    var blocPasses = el("div", "event-list past-events");
    blocPasses.hidden = !montrerPasses;
    passes.forEach(function (ev) { blocPasses.appendChild(carteEvenement(ev)); });
    conteneur.appendChild(blocPasses);
    var blocAvenir = el("div", "event-list");
    avenir.forEach(function (ev) { blocAvenir.appendChild(carteEvenement(ev)); });
    conteneur.appendChild(blocAvenir);
    if (!avenir.length) {
      conteneur.appendChild(el("p", "notice", "Aucun rendez-vous à venir pour le moment : les prochaines dates seront publiées ici dès qu'elles seront connues."));
    }
    return passes.length;
  }
  var boutonPassesBranche = false;
  function appliquerCalendrier(d) {
    var cal = liste(d.calendrier).filter(function (e) { return e && dateValide(e.date) && str(e.titre); }).slice().sort(parDate);
    var avenirIci = cal.filter(function (e) { return e.ici && !estPasse(e); });

    var heroNext = document.getElementById("hero-next");
    if (heroNext) {
      heroNext.textContent = "";
      if (avenirIci.length) {
        var prochain = avenirIci[0];
        heroNext.appendChild(document.createTextNode("🗓️ Prochain rendez-vous : "));
        heroNext.appendChild(el("strong", "", prochain.titre + " — " + dateLongue(prochain)));
        if (str(prochain.lieu)) heroNext.appendChild(document.createTextNode(", " + prochain.lieu));
      } else {
        heroNext.appendChild(document.createTextNode("🗓️ Séances : "));
        heroNext.appendChild(el("strong", "", resumeSeances(d.seances)));
        if (str((d.contact || {}).adresse1)) heroNext.appendChild(document.createTextNode(", " + d.contact.adresse1));
      }
    }

    var prochains = document.getElementById("next-events");
    if (prochains) {
      prochains.textContent = "";
      if (avenirIci.length) {
        avenirIci.slice(0, 3).forEach(function (ev) { prochains.appendChild(carteEvenement(ev)); });
      } else {
        prochains.appendChild(el("p", "notice", "Pas de rendez-vous de compétition prévu prochainement à Besançon. Retrouvez-nous lors des séances : " + resumeSeances(d.seances) + "."));
      }
    }

    var ici = document.getElementById("cal-ici");
    var region = document.getElementById("cal-region");
    var bouton = document.getElementById("cal-toggle-past");
    if (ici || region) {
      var montrer = bouton ? bouton.getAttribute("aria-expanded") === "true" : false;
      var nbPasses =
        remplirCalendrier(ici, cal.filter(function (e) { return e.ici; }), montrer) +
        remplirCalendrier(region, cal.filter(function (e) { return !e.ici; }), montrer);
      var blocRegion = document.getElementById("bloc-region");
      if (blocRegion) blocRegion.hidden = !cal.some(function (e) { return !e.ici; });
      if (bouton) {
        bouton.hidden = !nbPasses;
        if (!boutonPassesBranche) {
          boutonPassesBranche = true;
          bouton.addEventListener("click", function () {
            var afficher = bouton.getAttribute("aria-expanded") !== "true";
            document.querySelectorAll(".past-events").forEach(function (b) { b.hidden = !afficher; });
            bouton.setAttribute("aria-expanded", afficher ? "true" : "false");
            bouton.textContent = afficher ? "Masquer les rendez-vous déjà passés" : "Afficher les rendez-vous déjà passés";
          });
        }
      }
    }

    // Document PDF du calendrier complet
    var doc = d.calendrierDoc || {};
    var url = fichierUrl(doc.fichier);
    var lienPdf = document.getElementById("cms-cal-pdf");
    var images = document.getElementById("cms-cal-images");
    if (lienPdf) {
      if (!lienPdf.hasAttribute("data-defaut")) lienPdf.setAttribute("data-defaut", lienPdf.getAttribute("href"));
      lienPdf.setAttribute("href", url || lienPdf.getAttribute("data-defaut"));
    }
    if (images) images.hidden = !!url;
  }

  /* ---------- Séances ---------- */
  function appliquerSeances(d) {
    var corps = document.getElementById("cms-seances");
    if (!corps) return;
    corps.textContent = "";
    liste(d.seances).forEach(function (s) {
      var tr = el("tr");
      var tdJour = el("td");
      tdJour.appendChild(el("span", "badge badge-wood", s.jour));
      tr.appendChild(tdJour);
      tr.appendChild(el("td", "", s.horaire));
      var tdLieu = el("td");
      lignes(tdLieu, s.lieu);
      tr.appendChild(tdLieu);
      tr.appendChild(el("td", "", s.formule));
      corps.appendChild(tr);
    });
  }

  /* ---------- Tarifs ---------- */
  function appliquerTarifs(d) {
    var corps = document.getElementById("cms-tarifs");
    if (!corps) return;
    corps.textContent = "";
    var couleurs = ["badge-pink", "badge-wood", "badge-wood", "badge-blue", "badge-blue"];
    liste(d.tarifs).forEach(function (t, i) {
      var tr = el("tr");
      var td = el("td", "", t.libelle);
      if (str(t.precision)) {
        td.appendChild(document.createTextNode(" "));
        td.appendChild(el("em", "", "(" + t.precision + ")"));
      }
      tr.appendChild(td);
      var tdPrix = el("td");
      var prix = str(t.prix).trim();
      tdPrix.appendChild(el("span", "badge " + couleurs[i % couleurs.length], /€/.test(prix) || !prix ? prix : prix + " €"));
      tr.appendChild(tdPrix);
      corps.appendChild(tr);
    });
  }

  /* ---------- Bureau ---------- */
  function appliquerBureau(d) {
    var grille = document.getElementById("cms-bureau");
    if (!grille) return;
    grille.textContent = "";
    liste(d.bureau).forEach(function (m) {
      var carte = el("div", "board-card");
      carte.appendChild(el("div", "board-avatar", initiales(m.nom)));
      carte.appendChild(el("p", "role", m.role));
      carte.appendChild(el("h3", "", m.nom));
      var p = el("p");
      var morceaux = [];
      if (str(m.telephone)) {
        var t = el("a", "", m.telephone);
        t.setAttribute("href", lienTel(m.telephone));
        morceaux.push(t);
      }
      if (str(m.email)) {
        var a = el("a", "", m.email);
        a.setAttribute("href", "mailto:" + m.email);
        morceaux.push(a);
      }
      if (str(m.note)) morceaux.push(document.createTextNode(m.note));
      morceaux.forEach(function (n, i) {
        if (i) p.appendChild(document.createElement("br"));
        p.appendChild(n);
      });
      if (morceaux.length) carte.appendChild(p);
      grille.appendChild(carte);
    });
  }

  /* ---------- Classement, palmarès, archives ---------- */
  function appliquerClassement(d) {
    var corps = document.getElementById("cms-classement");
    if (corps) {
      corps.textContent = "";
      liste(d.classement).forEach(function (j) {
        var tr = el("tr");
        tr.appendChild(el("td", "", j.nom));
        tr.appendChild(el("td", "", j.serie));
        corps.appendChild(tr);
      });
    }
    var palmares = document.getElementById("cms-palmares");
    if (palmares) {
      palmares.textContent = "";
      liste(d.palmares).forEach(function (p, i) {
        if (i) palmares.appendChild(document.createTextNode(" "));
        var b = el("span", "badge badge-pink", p.annee);
        b.style.fontSize = "1.15rem";
        palmares.appendChild(b);
      });
      var blocPalmares = document.getElementById("bloc-palmares");
      if (blocPalmares) blocPalmares.hidden = !liste(d.palmares).length;
    }
    var archives = document.getElementById("cms-archives");
    if (archives) {
      archives.textContent = "";
      liste(d.archives).slice().sort(parDate).reverse().forEach(function (a) {
        var tr = el("tr");
        tr.appendChild(el("td", "", dateCourte(a.date)));
        tr.appendChild(el("td", "", a.tournoi));
        tr.appendChild(el("td", "", a.lieu));
        archives.appendChild(tr);
      });
      var blocArchives = document.getElementById("bloc-archives");
      if (blocArchives) blocArchives.hidden = !liste(d.archives).length;
    }
  }

  /* ---------- Actualités ---------- */
  function appliquerActualites(d) {
    var conteneur = document.getElementById("cms-actualites");
    if (!conteneur) return;
    conteneur.textContent = "";
    var actus = liste(d.actualites).filter(function (a) { return a && dateValide(a.date) && str(a.titre); })
      .slice().sort(parDate).reverse();
    if (!actus.length) {
      conteneur.appendChild(el("p", "notice", "Aucune actualité pour le moment."));
      return;
    }
    actus.forEach(function (a) {
      var d0 = parseDay(a.date);
      var article = el("article", "news-item");
      var date = el("div", "news-date");
      date.appendChild(el("span", "d", ("0" + d0.getDate()).slice(-2)));
      date.appendChild(el("span", "m", MOIS_COURTS[d0.getMonth()] + " " + d0.getFullYear()));
      article.appendChild(date);
      var corps = el("div");
      corps.appendChild(el("h3", "", a.titre));
      var url = fichierUrl(a.photo);
      if (url) {
        var img = el("img", "news-photo");
        img.setAttribute("src", url);
        img.setAttribute("alt", a.titre);
        img.setAttribute("loading", "lazy");
        corps.appendChild(img);
      }
      str(a.texte).split(/\n\s*\n/).forEach(function (para) {
        if (!para.trim()) return;
        var p = el("p");
        lignes(p, para.trim());
        corps.appendChild(p);
      });
      if (LIENS[a.lien]) {
        var lien = el("a", "preview-link", LIENS[a.lien]);
        lien.setAttribute("href", a.lien);
        corps.appendChild(lien);
      }
      article.appendChild(corps);
      conteneur.appendChild(article);
    });
  }

  /* ---------- Galerie ---------- */
  function appliquerGalerie(d) {
    var grille = document.getElementById("cms-galerie");
    if (!grille) return;
    var photos = liste(d.galerie).filter(function (p) { return p && fichierUrl(p.photo); });
    var attente = document.getElementById("galerie-attente");
    if (attente) attente.hidden = photos.length > 0;
    grille.hidden = photos.length === 0;
    grille.textContent = "";
    photos.forEach(function (p) {
      var carte = el("figure", "photo-card photo-reelle");
      carte.setAttribute("data-category", CATEGORIES[p.categorie] ? p.categorie : "vie");
      var lien = el("a", "photo-lien");
      lien.setAttribute("href", fichierUrl(p.photo));
      lien.setAttribute("target", "_blank");
      lien.setAttribute("rel", "noopener");
      var img = el("img");
      img.setAttribute("src", fichierUrl(p.photo));
      img.setAttribute("alt", str(p.legende) || "Photo du club");
      img.setAttribute("loading", "lazy");
      lien.appendChild(img);
      carte.appendChild(lien);
      var legende = el("figcaption", "cap");
      legende.appendChild(el("strong", "", str(p.legende) || CATEGORIES[p.categorie] || "Photo du club"));
      legende.appendChild(document.createTextNode(CATEGORIES[p.categorie] || "Vie du club"));
      carte.appendChild(legende);
      grille.appendChild(carte);
    });
    // Le filtre actif reste appliqué après un nouvel affichage
    var actif = document.querySelector(".gallery-filters button.active");
    var cat = actif ? actif.getAttribute("data-filter") : "tous";
    document.querySelectorAll(".gallery-grid [data-category]").forEach(function (c) {
      c.style.display = cat === "tous" || c.getAttribute("data-category") === cat ? "" : "none";
    });
  }

  /* ---------- Application de tous les contenus ---------- */
  function appliquer(d) {
    [appliquerTextes.bind(null, d.textes || {}), appliquerCoordonnees, appliquerSeances, appliquerCalendrier,
      appliquerTarifs, appliquerBureau, appliquerClassement, appliquerActualites, appliquerGalerie]
      .forEach(function (f) {
        try { f(d); } catch (err) { if (window.console) console.error("Affichage du contenu :", err); }
      });
  }

  var donnees = fusion(null);
  appliquer(donnees);

  var revele = false;
  function reveler() {
    if (revele) return;
    revele = true;
    window.CMS_PRET = true;
    document.documentElement.classList.remove("cms-attente");
    document.dispatchEvent(new CustomEvent("cms:pret"));
  }
  var secours = setTimeout(reveler, 2500);

  var requete = window.fetch
    ? fetch("/api/contenu", { cache: "no-store", headers: { Accept: "application/json" } })
    : Promise.reject(new Error("fetch indisponible"));
  requete
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rep) {
      if (rep && rep.sections && typeof rep.sections === "object") {
        donnees = fusion(rep.sections);
        appliquer(donnees);
      }
    })
    .catch(function () { /* contenus d'origine conservés */ })
    .then(function () {
      clearTimeout(secours);
      reveler();
    });
})();
