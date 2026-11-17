// =========================================================
// Espace administrateur — Club Bisontin de Scrabble
// Une seule chose à l'écran à la fois, de grands boutons,
// et un message clair après chaque action.
// =========================================================
(function () {
  "use strict";

  var DEF = window.CONTENU_DEFAUT || {};
  var app = document.getElementById("app");
  var bandeau = document.getElementById("bandeau");
  var barreActions = document.getElementById("barre-actions");
  var principal = document.getElementById("contenu-principal");

  var etat = {
    contenu: null,        // contenus affichés (origine + modifications)
    sale: false,          // un formulaire contient des changements non enregistrés
    ignorerHash: false,
    textesOrigine: {}     // textes d'origine lus dans les pages du site
  };

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var CATEGORIES = [
    { valeur: "tournois", texte: "🏆 Tournois" },
    { valeur: "seances", texte: "📖 Séances" },
    { valeur: "remises", texte: "🥇 Remises de prix" },
    { valeur: "vie", texte: "☕ Vie du club" }
  ];
  var PAGES_LIENS = [
    { valeur: "", texte: "Aucun lien" },
    { valeur: "le-club.html", texte: "Page « Le club »" },
    { valeur: "jouer-avec-nous.html", texte: "Page « Jouer avec nous »" },
    { valeur: "tournois-resultats.html", texte: "Page « Tournois & résultats »" },
    { valeur: "galerie.html", texte: "Page « Galerie »" },
    { valeur: "actualites.html", texte: "Page « Actualités »" },
    { valeur: "adherer-contact.html", texte: "Page « Adhérer / Contact »" }
  ];
  var JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  /* =========================================================
     Outils
     ========================================================= */
  function h(tag, attrs, enfants) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "texte") e.textContent = v;
      else if (k === "classe") e.className = v;
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else if (v === true) e.setAttribute(k, "");
      else e.setAttribute(k, v);
    });
    [].concat(enfants || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return e;
  }
  function vider(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function copie(v) { return JSON.parse(JSON.stringify(v)); }
  function str(v) { return v === undefined || v === null ? "" : String(v); }
  function liste(v) { return Array.isArray(v) ? v : []; }
  function normal(s) { return str(s).replace(/\s+/g, " ").trim(); }
  function idAleatoire(prefixe) {
    var a = new Uint8Array(8);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return prefixe + "-" + Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
  }
  function aujourdhuiIso() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function dateValide(s) { return /^\d{4}-\d{2}-\d{2}$/.test(str(s)); }
  function parseDay(s) { var p = str(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function dateLongue(s) {
    if (!dateValide(s)) return "";
    var d = parseDay(s);
    return JOURS[d.getDay()] + " " + (d.getDate() === 1 ? "1er" : d.getDate()) + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
  }
  function estPasse(ev) {
    var n = new Date(); var auj = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return dateValide(ev.date) && parseDay(ev.dateFin || ev.date) < auj;
  }
  function fichierUrl(id) { return /^[a-z0-9-]{6,64}$/.test(str(id)) ? "/api/fichiers/" + id : ""; }
  function fusion(api) {
    var d = {};
    Object.keys(DEF).forEach(function (k) {
      d[k] = api && Object.prototype.hasOwnProperty.call(api, k) && api[k] !== null ? api[k] : copie(DEF[k]);
    });
    d.contact = Object.assign({}, copie(DEF.contact || {}), (api && api.contact) || {});
    d.textes = Object.assign({}, (api && api.textes) || {});
    return d;
  }

  /* =========================================================
     Messages
     ========================================================= */
  function message(type, texte, lien) {
    vider(bandeau);
    bandeau.className = "bandeau " + type;
    bandeau.appendChild(document.createTextNode(texte));
    if (lien) bandeau.appendChild(h("a", { href: lien.href, target: "_blank", rel: "noopener", texte: lien.texte }));
    bandeau.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function effacerMessage() { bandeau.hidden = true; vider(bandeau); }

  /* =========================================================
     Échanges avec le serveur
     ========================================================= */
  function ErreurSession() { this.message = "session"; }

  function appel(methode, url, corps, entetes) {
    var options = { method: methode, credentials: "same-origin", headers: Object.assign({ "x-cbs": "1" }, entetes || {}) };
    if (corps !== undefined) {
      if (corps instanceof Blob) {
        options.body = corps;
      } else {
        options.body = JSON.stringify(corps);
        options.headers["content-type"] = "application/json";
      }
    }
    return fetch(url, options).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (rep) {
        if (r.status === 401 && url.indexOf("/api/connexion") === -1) {
          montrerConnexion("Votre session a expiré. Merci de vous reconnecter.");
          throw new ErreurSession();
        }
        if (r.status === 429) throw new Error("Trop d'essais en peu de temps. Patientez une minute, puis réessayez.");
        if (!r.ok) throw new Error(rep.erreur || "Une erreur est survenue. Réessayez dans un instant.");
        return rep;
      });
    }, function () {
      throw new Error("Impossible de joindre le site. Vérifiez votre connexion internet, puis réessayez.");
    });
  }

  function enregistrer(section, valeur) {
    return appel("PUT", "/api/contenu/" + section, { valeur: valeur }).then(function (rep) {
      etat.contenu[section] = rep.valeur;
      return rep.valeur;
    });
  }

  function envoyerFichier(blob, nom) {
    return appel("POST", "/api/fichiers", blob, { "content-type": blob.type || "application/octet-stream", "x-cbs-nom": encodeURIComponent(nom || "") });
  }

  function supprimerFichier(id) {
    if (!fichierUrl(id)) return Promise.resolve();
    return appel("DELETE", "/api/fichiers/" + id).catch(function () { /* sans gravité */ });
  }

  function gererErreur(e) {
    if (e instanceof ErreurSession) return;
    message("erreur", "❌ " + (e && e.message ? e.message : "Une erreur est survenue.") + " Vos modifications n'ont pas été enregistrées.");
  }

  /* =========================================================
     Photos : réduction avant envoi (photos de téléphone très lourdes)
     ========================================================= */
  function preparerPhoto(fichier) {
    return new Promise(function (resolve, reject) {
      if (!fichier) return reject(new Error("Aucune photo choisie."));
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        var max = 1600;
        var echelle = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.max(1, Math.round(img.naturalWidth * echelle));
        var hh = Math.max(1, Math.round(img.naturalHeight * echelle));
        var canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = hh;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, hh);
        ctx.drawImage(img, 0, 0, w, hh);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob) return reject(new Error("Cette photo n'a pas pu être préparée."));
          resolve(blob);
        }, "image/jpeg", 0.85);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("Cette photo n'a pas pu être lue. Essayez une photo au format JPG (le format habituel des appareils photo et des téléphones)."));
      };
      img.src = url;
    });
  }

  /* =========================================================
     Champs de formulaire
     ========================================================= */
  function champ(def, valeur, item) {
    var id = "champ-" + def.nom;
    var conteneur = h("div", { classe: "champ" });
    var erreur = h("span", { classe: "erreur-champ", role: "alert", hidden: true });
    var titre = h("label", { classe: "titre-champ", "for": id }, [def.libelle, def.requis ? h("span", { classe: "obligatoire", texte: " *" }) : null]);
    var aide = def.aide ? h("span", { classe: "aide-champ", id: id + "-aide", texte: def.aide }) : null;
    var lire, reinitialiser;

    if (def.type === "textarea") {
      var ta = h("textarea", { id: id, rows: def.lignes || 5, maxlength: def.max || 4000, "aria-describedby": aide ? id + "-aide" : null });
      ta.value = str(valeur);
      conteneur.appendChild(titre); if (aide) conteneur.appendChild(aide); conteneur.appendChild(ta);
      lire = function () { return ta.value.trim(); };
    } else if (def.type === "select") {
      var sel = h("select", { id: id });
      def.options.forEach(function (o) {
        var opt = h("option", { value: o.valeur, texte: o.texte });
        if (o.valeur === str(valeur)) opt.selected = true;
        sel.appendChild(opt);
      });
      conteneur.appendChild(titre); if (aide) conteneur.appendChild(aide); conteneur.appendChild(sel);
      lire = function () { return sel.value; };
    } else if (def.type === "radio") {
      var fs = h("fieldset");
      fs.appendChild(h("legend", {}, [def.libelle]));
      if (aide) fs.appendChild(aide);
      var groupe = h("div", { classe: "choix" });
      def.options.forEach(function (o, i) {
        var r = h("input", { type: "radio", name: id, value: String(o.valeur), id: id + "-" + i });
        if (String(o.valeur) === String(valeur)) r.checked = true;
        groupe.appendChild(h("label", { "for": id + "-" + i }, [r, o.texte]));
      });
      if (!groupe.querySelector("input:checked")) groupe.querySelector("input").checked = true;
      fs.appendChild(groupe);
      conteneur.appendChild(fs);
      lire = function () {
        var c = groupe.querySelector("input:checked");
        var v = c ? c.value : "";
        return def.booleen ? v === "true" : v;
      };
    } else if (def.type === "dateFin") {
      var coche = h("input", { type: "checkbox", id: id + "-case" });
      coche.checked = dateValide(valeur);
      var dateInput = h("input", { type: "date", id: id });
      dateInput.value = dateValide(valeur) ? valeur : "";
      var blocDate = h("div", { hidden: !coche.checked, style: "margin-top:10px" }, [
        h("label", { classe: "titre-champ", "for": id, texte: "Date de fin" }), dateInput]);
      coche.addEventListener("change", function () {
        blocDate.hidden = !coche.checked;
        if (coche.checked && !dateInput.value) dateInput.focus();
      });
      conteneur.appendChild(h("label", { classe: "case", "for": id + "-case" }, [coche, def.libelle]));
      conteneur.appendChild(blocDate);
      lire = function () { return coche.checked ? dateInput.value : ""; };
    } else if (def.type === "photo" || def.type === "pdf") {
      var pdf = def.type === "pdf";
      var actuel = str(valeur);
      var nouveau = null;
      var retire = false;
      var zone = h("div", { classe: "photo-zone" });
      var apercu = h("div");
      var entree = h("input", { type: "file", id: id, accept: pdf ? "application/pdf,.pdf" : "image/*", tabindex: "-1", "aria-hidden": "true" });
      var boutonChoisir = h("button", { type: "button", classe: "bouton bouton-bleu", onclick: function () { entree.click(); } });
      var boutonRetirer = h("button", { type: "button", classe: "bouton bouton-rouge", texte: pdf ? "Retirer ce document" : "Retirer la photo" });
      function rafraichir() {
        vider(apercu);
        var a = null;
        if (nouveau) {
          a = pdf ? h("p", { texte: "📄 " + nouveau.name }) : h("img", { src: URL.createObjectURL(nouveau), alt: "Aperçu de la photo choisie" });
        } else if (actuel && !retire) {
          a = pdf ? h("p", {}, [h("a", { href: fichierUrl(actuel), target: "_blank", rel: "noopener", texte: "📄 Voir le document actuel" })])
                  : h("img", { src: fichierUrl(actuel), alt: "Photo actuelle" });
        } else {
          a = h("p", { texte: pdf ? "Aucun document choisi." : "Aucune photo pour le moment." });
        }
        apercu.appendChild(a);
        boutonChoisir.textContent = (nouveau || (actuel && !retire)) ? (pdf ? "📄 Choisir un autre document" : "📷 Choisir une autre photo") : (pdf ? "📄 Choisir un document PDF" : "📷 Choisir une photo");
        boutonRetirer.hidden = !(nouveau || (actuel && !retire)) || !def.retirable;
      }
      entree.addEventListener("change", function () {
        if (entree.files && entree.files[0]) {
          nouveau = entree.files[0];
          retire = false;
          etat.sale = true;
          rafraichir();
        }
      });
      boutonRetirer.addEventListener("click", function () {
        nouveau = null; retire = true; entree.value = ""; etat.sale = true; rafraichir();
      });
      zone.appendChild(apercu);
      zone.appendChild(h("div", { classe: "boutons" }, [boutonChoisir, boutonRetirer]));
      zone.appendChild(entree);
      conteneur.appendChild(h("span", { classe: "titre-champ", texte: def.libelle + (def.requis ? " *" : "") }));
      if (aide) conteneur.appendChild(aide);
      conteneur.appendChild(zone);
      rafraichir();
      lire = function () { return { actuel: actuel, nouveau: nouveau, retire: retire }; };
    } else {
      var inp = h("input", {
        type: def.type || "text", id: id, maxlength: def.max || 200,
        inputmode: def.inputmode, autocomplete: "off", placeholder: def.exemple || null,
        "aria-describedby": aide ? id + "-aide" : null
      });
      if (def.type === "number") { inp.removeAttribute("maxlength"); inp.min = "0"; inp.max = "9999"; inp.step = "1"; }
      inp.value = str(valeur);
      conteneur.appendChild(titre); if (aide) conteneur.appendChild(aide); conteneur.appendChild(inp);
      lire = function () { return inp.value.trim(); };
    }
    conteneur.appendChild(erreur);

    function montrerErreur(texte) {
      erreur.textContent = texte || "";
      erreur.hidden = !texte;
      conteneur.classList.toggle("en-erreur", !!texte);
    }
    function valider() {
      var v = lire();
      if (def.type === "photo" || def.type === "pdf") {
        if (def.requis && !v.nouveau && (!v.actuel || v.retire)) return montrerErreur(def.type === "pdf" ? "Merci de choisir un document PDF." : "Merci de choisir une photo."), false;
        return montrerErreur(""), true;
      }
      if (def.requis && (v === "" || v === null)) return montrerErreur("Merci de remplir ce champ."), false;
      if (def.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return montrerErreur("Cette adresse e-mail ne semble pas correcte (exemple : prenom.nom@orange.fr)."), false;
      if (def.type === "date" && v && !dateValide(v)) return montrerErreur("Cette date n'est pas valide."), false;
      if (def.type === "dateFin" && v && item && dateValide(item.date) && v <= item.date) return montrerErreur("La date de fin doit être après la date de début."), false;
      if (def.type === "number" && v !== "" && !/^\d{1,4}$/.test(v)) return montrerErreur("Merci d'indiquer un nombre entier."), false;
      montrerErreur("");
      return true;
    }
    // Dès que la personne corrige le champ, le message rouge disparaît
    conteneur.addEventListener("input", function () { etat.sale = true; if (!erreur.hidden) montrerErreur(""); });
    conteneur.addEventListener("change", function () { etat.sale = true; if (!erreur.hidden) montrerErreur(""); });
    return { noeud: conteneur, lire: lire, valider: valider, def: def, erreur: montrerErreur };
  }

  /* =========================================================
     Navigation
     ========================================================= */
  function aller(hash) {
    if (location.hash === hash) afficher();
    else location.hash = hash;
  }

  window.addEventListener("hashchange", function () {
    if (etat.ignorerHash) { etat.ignorerHash = false; return; }
    if (etat.sale && !window.confirm("Vous n'avez pas enregistré vos modifications.\n\nVoulez-vous vraiment quitter cette page sans enregistrer ?")) {
      etat.ignorerHash = true;
      history.back();
      return;
    }
    etat.sale = false;
    effacerMessage();
    afficher();
  });

  window.addEventListener("beforeunload", function (e) {
    if (etat.sale) { e.preventDefault(); e.returnValue = ""; }
  });

  function boutonRetour(hash, texte) {
    return h("button", { type: "button", classe: "retour", onclick: function () { aller(hash); } }, ["← " + (texte || "Retour au menu")]);
  }

  /* =========================================================
     Connexion
     ========================================================= */
  function montrerConnexion(texteInfo) {
    etat.contenu = null;
    etat.sale = false;
    barreActions.hidden = true;
    vider(app);
    effacerMessage();
    if (texteInfo) message("info", "ℹ️ " + texteInfo);

    var champId = h("input", { type: "text", id: "identifiant", autocomplete: "username", autocapitalize: "none", spellcheck: "false", required: true });
    var champMdp = h("input", { type: "password", id: "motdepasse", autocomplete: "current-password", required: true });
    var voir = h("button", { type: "button", classe: "bouton bouton-gris", "aria-pressed": "false", texte: "👁️ Afficher" });
    voir.addEventListener("click", function () {
      var visible = champMdp.type === "password";
      champMdp.type = visible ? "text" : "password";
      voir.textContent = visible ? "🙈 Masquer" : "👁️ Afficher";
      voir.setAttribute("aria-pressed", visible ? "true" : "false");
    });
    var bouton = h("button", { type: "submit", classe: "bouton bouton-vert bouton-large", texte: "Se connecter" });
    var erreur = h("p", { classe: "alerte alerte-erreur", role: "alert", hidden: true });

    var form = h("form", { classe: "formulaire", novalidate: true }, [
      h("div", { classe: "champ" }, [h("label", { classe: "titre-champ", "for": "identifiant", texte: "Identifiant" }), champId]),
      h("div", { classe: "champ" }, [
        h("label", { classe: "titre-champ", "for": "motdepasse", texte: "Mot de passe" }),
        h("div", { classe: "mdp-ligne" }, [champMdp, voir])
      ]),
      erreur,
      bouton
    ]);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      erreur.hidden = true;
      if (!champId.value.trim() || !champMdp.value.trim()) {
        erreur.textContent = "Merci d'indiquer votre identifiant et votre mot de passe.";
        erreur.hidden = false;
        return;
      }
      bouton.disabled = true;
      bouton.textContent = "⏳ Connexion en cours…";
      appel("POST", "/api/connexion", { identifiant: champId.value, motdepasse: champMdp.value })
        .then(function () {
          effacerMessage();
          return demarrer();
        })
        .catch(function (err) {
          erreur.textContent = err.message === "Identifiant ou mot de passe incorrect."
            ? "Identifiant ou mot de passe incorrect. Vérifiez les majuscules et réessayez."
            : err.message;
          erreur.hidden = false;
          bouton.disabled = false;
          bouton.textContent = "Se connecter";
          champMdp.focus();
          champMdp.select();
        });
    });

    app.appendChild(h("div", { classe: "connexion carte" }, [
      h("img", { classe: "logo", src: "../assets/logo.svg", alt: "" }),
      h("h1", { texte: "Bienvenue" }),
      h("p", { classe: "sous-titre", texte: "Connectez-vous pour modifier le site du Club Bisontin de Scrabble." }),
      form,
      h("p", { classe: "oubli", texte: "Mot de passe oublié ? Contactez la personne qui a réalisé votre site." })
    ]));
    setTimeout(function () { champId.focus(); }, 50);
  }

  /* =========================================================
     Démarrage
     ========================================================= */
  function chargerContenu() {
    return fetch("/api/contenu", { cache: "no-store", credentials: "same-origin" })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (rep) { etat.contenu = fusion(rep.sections || {}); })
      .catch(function () { throw new Error("Impossible de charger les contenus du site. Vérifiez votre connexion internet, puis rechargez la page."); });
  }

  function demarrer() {
    vider(app);
    app.appendChild(h("p", { classe: "chargement", texte: "⏳ Chargement…" }));
    return fetch("/api/session", { cache: "no-store", credentials: "same-origin" })
      .then(function (r) { return r.json(); })
      .then(function (s) {
        if (!s.configure) {
          vider(app);
          app.appendChild(h("p", { classe: "alerte alerte-erreur", texte: "L'espace administrateur n'est pas encore configuré. Contactez la personne qui a réalisé votre site." }));
          return;
        }
        if (!s.connecte) { montrerConnexion(); return; }
        return chargerContenu().then(function () {
          barreActions.hidden = false;
          if (!location.hash || location.hash === "#") {
            etat.ignorerHash = true;
            location.hash = "#accueil";
          }
          afficher();
        });
      })
      .catch(function (e) {
        vider(app);
        app.appendChild(h("p", { classe: "alerte alerte-erreur", texte: e.message || "Impossible de joindre le site. Vérifiez votre connexion internet, puis rechargez la page." }));
      });
  }

  document.getElementById("deconnexion").addEventListener("click", function () {
    if (etat.sale && !window.confirm("Vous n'avez pas enregistré vos modifications.\n\nSe déconnecter quand même ?")) return;
    etat.sale = false;
    fetch("/api/deconnexion", { method: "POST", credentials: "same-origin", headers: { "x-cbs": "1" } })
      .catch(function () {})
      .then(function () {
        etat.ignorerHash = location.hash !== "";
        location.hash = "";
        montrerConnexion("Vous êtes bien déconnecté. À bientôt !");
      });
  });

  /* =========================================================
     Tableau de bord
     ========================================================= */
  var TUILES = [
    { hash: "#calendrier", icone: "🗓️", titre: "Calendrier", desc: "Ajouter, modifier ou supprimer un rendez-vous" },
    { hash: "#actualites", icone: "📰", titre: "Actualités", desc: "Publier une nouvelle du club" },
    { hash: "#photos", icone: "📷", titre: "Photos", desc: "Ajouter des photos dans la galerie" },
    { hash: "#textes", icone: "✏️", titre: "Textes du site", desc: "Modifier les textes des pages" },
    { hash: "#seances", icone: "🕒", titre: "Séances", desc: "Jours, horaires et lieu des séances" },
    { hash: "#contact", icone: "📞", titre: "Contact et chiffres", desc: "Coordonnées, adresse, nombre de licenciés" },
    { hash: "#tarifs", icone: "💶", titre: "Tarifs", desc: "Prix des licences" },
    { hash: "#bureau", icone: "👥", titre: "Bureau", desc: "Les membres du bureau" },
    { hash: "#classement", icone: "🏆", titre: "Classement", desc: "Extrait du classement des joueurs" },
    { hash: "#palmares", icone: "🥇", titre: "Palmarès et archives", desc: "Finales interclubs et anciens tournois" }
  ];

  function vueAccueil() {
    app.appendChild(h("h1", { classe: "bonjour", texte: "Bonjour ! Que souhaitez-vous modifier ?" }));
    app.appendChild(h("div", { classe: "aide" }, [
      h("strong", { texte: "Comment ça marche ?" }),
      h("ol", {}, [
        h("li", { texte: "Cliquez sur ce que vous voulez modifier ci-dessous." }),
        h("li", { texte: "Faites vos changements." }),
        h("li", { texte: "Cliquez sur le bouton vert « Enregistrer ». C'est en ligne tout de suite !" })
      ])
    ]));
    var grille = h("div", { classe: "tuiles" });
    TUILES.forEach(function (t) {
      grille.appendChild(h("a", { classe: "tuile", href: t.hash }, [
        h("span", { classe: "icone", "aria-hidden": "true", texte: t.icone }),
        h("span", {}, [h("strong", { texte: t.titre }), h("span", { classe: "desc", texte: t.desc })])
      ]));
    });
    app.appendChild(grille);
  }

  /* =========================================================
     Éditeur de liste générique
     ========================================================= */
  var LISTES = {};

  LISTES.calendrier = {
    section: "calendrier", hash: "#calendrier", page: "tournois-resultats.html",
    titre: "🗓️ Calendrier des rendez-vous",
    aide: "Les rendez-vous « à Besançon » apparaissent sur la page d'accueil et en tête de la page Tournois. Les dates passées sont rangées automatiquement.",
    ajouter: "➕ Ajouter un rendez-vous",
    titreNouveau: "Nouveau rendez-vous", titreModifier: "Modifier le rendez-vous",
    nomElement: "ce rendez-vous",
    tri: function (a, b) { return str(a.date) < str(b.date) ? -1 : str(a.date) > str(b.date) ? 1 : 0; },
    masquerPasses: true,
    nouveau: function () { return { date: "", dateFin: "", titre: "", lieu: "Salle Jean Zay, Besançon", ici: true }; },
    champs: [
      { nom: "date", libelle: "Date", type: "date", requis: true },
      { nom: "dateFin", libelle: "Ce rendez-vous dure plusieurs jours", type: "dateFin" },
      { nom: "titre", libelle: "Intitulé du rendez-vous", requis: true, max: 200, exemple: "Exemple : TH3 de Besançon" },
      { nom: "lieu", libelle: "Lieu", max: 200, exemple: "Exemple : Salle Jean Zay, Besançon" },
      { nom: "ici", libelle: "Où a lieu ce rendez-vous ?", type: "radio", booleen: true, options: [
        { valeur: true, texte: "À Besançon (organisé ou accueilli par le club)" },
        { valeur: false, texte: "Ailleurs en Franche-Comté" }
      ] }
    ],
    resume: function (e) {
      return {
        titre: e.titre,
        lignes: [dateLongue(e.date) + (dateValide(e.dateFin) ? " → " + dateLongue(e.dateFin) : ""), e.lieu ? "📍 " + e.lieu : ""],
        etiquettes: [e.ici ? { classe: "etiquette-ici", texte: "À Besançon" } : null, estPasse(e) ? { classe: "etiquette-passe", texte: "Passé" } : null],
        passe: estPasse(e)
      };
    }
  };

  LISTES.actualites = {
    section: "actualites", hash: "#actualites", page: "actualites.html",
    titre: "📰 Actualités",
    aide: "Les actualités s'affichent de la plus récente à la plus ancienne sur la page Actualités.",
    ajouter: "➕ Publier une actualité",
    titreNouveau: "Nouvelle actualité", titreModifier: "Modifier l'actualité",
    nomElement: "cette actualité",
    tri: function (a, b) { return str(a.date) < str(b.date) ? 1 : str(a.date) > str(b.date) ? -1 : 0; },
    nouveau: function () { return { id: idAleatoire("actu"), date: aujourdhuiIso(), titre: "", texte: "", photo: "", lien: "" }; },
    champs: [
      { nom: "date", libelle: "Date de l'actualité", type: "date", requis: true },
      { nom: "titre", libelle: "Titre", requis: true, max: 200 },
      { nom: "texte", libelle: "Texte", type: "textarea", lignes: 8, max: 6000, aide: "Pour commencer un nouveau paragraphe, laissez une ligne vide." },
      { nom: "photo", libelle: "Photo (facultatif)", type: "photo", retirable: true },
      { nom: "lien", libelle: "Bouton « En savoir plus » vers une page du site (facultatif)", type: "select", options: PAGES_LIENS }
    ],
    resume: function (a) {
      return { titre: a.titre, lignes: [dateLongue(a.date)], vignette: fichierUrl(a.photo) };
    }
  };

  LISTES.seances = {
    section: "seances", hash: "#seances", page: "jouer-avec-nous.html", ordonne: true,
    titre: "🕒 Séances de la semaine",
    aide: "Ces séances apparaissent dans le tableau de la page « Jouer avec nous » et sont résumées sur l'accueil et la page Contact.",
    ajouter: "➕ Ajouter une séance",
    titreNouveau: "Nouvelle séance", titreModifier: "Modifier la séance",
    nomElement: "cette séance",
    nouveau: function () { return { jour: "Mercredi", horaire: "", lieu: "Centre Pierre Mendès-France\n3 rue Beauregard, 25000 Besançon", formule: "Scrabble Duplicate" }; },
    champs: [
      { nom: "jour", libelle: "Jour", type: "select", requis: true, options: JOURS_SEMAINE.map(function (j) { return { valeur: j, texte: j }; }) },
      { nom: "horaire", libelle: "Heure de début", max: 30, exemple: "Exemple : 14h30" },
      { nom: "lieu", libelle: "Lieu", type: "textarea", lignes: 2, max: 300, aide: "Une ligne pour le nom du lieu, une ligne pour l'adresse." },
      { nom: "formule", libelle: "Formule", max: 100, exemple: "Exemple : Scrabble Duplicate" }
    ],
    resume: function (s) { return { titre: s.jour + (s.horaire ? " — " + s.horaire : ""), lignes: [normal(s.lieu), s.formule] }; }
  };

  LISTES.tarifs = {
    section: "tarifs", hash: "#tarifs", page: "adherer-contact.html", ordonne: true,
    titre: "💶 Tarifs des licences",
    aide: "Ces tarifs apparaissent dans le tableau de la page « Adhérer / Contact », dans l'ordre de cette liste.",
    ajouter: "➕ Ajouter un tarif",
    titreNouveau: "Nouveau tarif", titreModifier: "Modifier le tarif",
    nomElement: "ce tarif",
    nouveau: function () { return { libelle: "", precision: "", prix: "" }; },
    champs: [
      { nom: "libelle", libelle: "Nom de la licence", requis: true, max: 100, exemple: "Exemple : Licence Loisir" },
      { nom: "precision", libelle: "Précision (facultatif)", max: 100, exemple: "Exemple : 1ère inscription" },
      { nom: "prix", libelle: "Prix en euros", requis: true, max: 20, inputmode: "decimal", exemple: "Exemple : 60" }
    ],
    resume: function (t) {
      var prix = str(t.prix);
      return { titre: t.libelle + (t.precision ? " (" + t.precision + ")" : ""), lignes: [prix ? (/€/.test(prix) ? prix : prix + " €") : ""] };
    }
  };

  LISTES.bureau = {
    section: "bureau", hash: "#bureau", page: "le-club.html", ordonne: true,
    titre: "👥 Membres du bureau",
    aide: "Ces personnes apparaissent sur la page « Le club », dans l'ordre de cette liste. Téléphone et e-mail sont facultatifs.",
    ajouter: "➕ Ajouter un membre",
    titreNouveau: "Nouveau membre du bureau", titreModifier: "Modifier le membre du bureau",
    nomElement: "ce membre",
    nouveau: function () { return { nom: "", role: "", telephone: "", email: "", note: "" }; },
    champs: [
      { nom: "nom", libelle: "Prénom et nom", requis: true, max: 100 },
      { nom: "role", libelle: "Fonction", max: 60, exemple: "Exemple : Secrétaire" },
      { nom: "telephone", libelle: "Téléphone (facultatif)", type: "tel", max: 30 },
      { nom: "email", libelle: "E-mail (facultatif)", type: "email", max: 120 },
      { nom: "note", libelle: "Remarque (facultatif)", max: 200, exemple: "Exemple : Contact via le président du club." }
    ],
    resume: function (m) { return { titre: m.nom, lignes: [m.role, [m.telephone, m.email].filter(Boolean).join(" · ")] }; }
  };

  LISTES.classement = {
    section: "classement", hash: "#classement", page: "tournois-resultats.html", ordonne: true,
    titre: "🏆 Classement (extrait)",
    aide: "Ce tableau apparaît sur la page « Tournois & résultats », dans l'ordre de cette liste.",
    ajouter: "➕ Ajouter un joueur",
    titreNouveau: "Nouveau joueur", titreModifier: "Modifier le joueur",
    nomElement: "ce joueur",
    nouveau: function () { return { nom: "", serie: "" }; },
    champs: [
      { nom: "nom", libelle: "Nom et prénom du joueur", requis: true, max: 100, exemple: "Exemple : Dupont Marie" },
      { nom: "serie", libelle: "Série", max: 10, exemple: "Exemple : 4B" }
    ],
    resume: function (j) { return { titre: j.nom, lignes: [j.serie ? "Série " + j.serie : ""] }; }
  };

  LISTES.palmares = {
    section: "palmares", hash: "#palmares", page: "tournois-resultats.html", ordonne: true,
    titre: "🥇 Finales nationales interclubs",
    aide: "Les années de qualification pour la finale nationale interclubs. Le nombre total apparaît aussi sur la page d'accueil.",
    ajouter: "➕ Ajouter une année",
    titreNouveau: "Nouvelle qualification", titreModifier: "Modifier l'année",
    nomElement: "cette année",
    nouveau: function () { return { annee: String(new Date().getFullYear()) }; },
    champs: [{ nom: "annee", libelle: "Année", requis: true, max: 20, inputmode: "numeric" }],
    resume: function (p) { return { titre: p.annee, lignes: [] }; }
  };

  LISTES.archives = {
    section: "archives", hash: "#palmares", page: "tournois-resultats.html",
    titre: "🗂️ Archives des tournois organisés",
    aide: "Les tournois passés organisés par le club, du plus récent au plus ancien.",
    ajouter: "➕ Ajouter un tournoi passé",
    titreNouveau: "Nouveau tournoi passé", titreModifier: "Modifier le tournoi",
    nomElement: "ce tournoi",
    tri: function (a, b) { return str(a.date) < str(b.date) ? 1 : str(a.date) > str(b.date) ? -1 : 0; },
    nouveau: function () { return { date: "", tournoi: "", lieu: "" }; },
    champs: [
      { nom: "date", libelle: "Date", type: "date", requis: true },
      { nom: "tournoi", libelle: "Nom du tournoi", requis: true, max: 250 },
      { nom: "lieu", libelle: "Lieu", max: 250 }
    ],
    resume: function (a) { return { titre: a.tournoi, lignes: [dateLongue(a.date), a.lieu ? "📍 " + a.lieu : ""] }; }
  };

  function voirSurLeSite(cfg) {
    return { href: "/" + cfg.page, texte: "Voir sur le site →" };
  }

  // Liste d'éléments avec boutons Modifier / Supprimer (et Monter / Descendre si l'ordre compte)
  function rendreListe(cfg, cible, surligne) {
    var donnees = liste(etat.contenu[cfg.section]);
    var bloc = h("section", { classe: "bloc-liste" });
    bloc.appendChild(h("div", { classe: "entete-section" }, [
      h("h2", { texte: cfg.titre }),
      h("button", { type: "button", classe: "bouton bouton-vert", onclick: function () { aller(cfg.hash + "/" + cfg.section + "/nouveau"); } }, [cfg.ajouter])
    ]));
    bloc.appendChild(h("p", { classe: "intro", texte: cfg.aide }));

    var indices = donnees.map(function (_, i) { return i; });
    if (cfg.tri) indices.sort(function (a, b) { return cfg.tri(donnees[a], donnees[b]); });

    var conteneur = h("div", { classe: "liste" });
    var nbPasses = 0;
    var afficherPasses = !!etat.afficherPasses;
    indices.forEach(function (i, rang) {
      var item = donnees[i];
      var r = cfg.resume(item);
      if (r.passe) {
        nbPasses++;
        if (cfg.masquerPasses && !afficherPasses) return;
      }
      var infos = h("div", { classe: "infos" }, [h("strong", { texte: r.titre || "(sans titre)" })]);
      (r.lignes || []).filter(Boolean).forEach(function (l) { infos.appendChild(h("span", { texte: l })); });
      (r.etiquettes || []).filter(Boolean).forEach(function (t) { infos.appendChild(h("span", { classe: "etiquette " + t.classe, texte: t.texte })); });
      var actions = h("div", { classe: "actions" }, [
        h("button", { type: "button", classe: "bouton bouton-bleu bouton-petit", onclick: function () { aller(cfg.hash + "/" + cfg.section + "/modifier/" + i); } }, ["✏️ Modifier"]),
        h("button", { type: "button", classe: "bouton bouton-rouge bouton-petit", onclick: function () { supprimer(cfg, i); } }, ["🗑️ Supprimer"])
      ]);
      if (cfg.ordonne) {
        actions.insertBefore(h("button", { type: "button", classe: "bouton bouton-gris bouton-petit", disabled: rang === 0, "aria-label": "Monter « " + (r.titre || "") + " »", onclick: function () { deplacer(cfg, i, -1); } }, ["⬆️ Monter"]), actions.firstChild);
        actions.insertBefore(h("button", { type: "button", classe: "bouton bouton-gris bouton-petit", disabled: rang === indices.length - 1, "aria-label": "Descendre « " + (r.titre || "") + " »", onclick: function () { deplacer(cfg, i, 1); } }, ["⬇️ Descendre"]), actions.children[1]);
      }
      var ligne = h("div", { classe: "element" + (r.passe ? " passe" : "") + (surligne === i ? " surligne" : "") });
      if (r.vignette) ligne.appendChild(h("img", { classe: "vignette", src: r.vignette, alt: "" }));
      ligne.appendChild(infos);
      ligne.appendChild(actions);
      conteneur.appendChild(ligne);
    });
    if (!conteneur.children.length) {
      conteneur.appendChild(h("p", { classe: "vide", texte: donnees.length ? "Aucun rendez-vous à venir. Cliquez sur « Afficher aussi les rendez-vous passés » pour voir les anciens." : "La liste est vide pour le moment. Cliquez sur le bouton vert pour ajouter un élément." }));
    }
    bloc.appendChild(conteneur);
    if (cfg.masquerPasses && nbPasses) {
      bloc.appendChild(h("p", { classe: "bascule" }, [h("button", {
        type: "button", classe: "bouton bouton-gris",
        onclick: function () { etat.afficherPasses = !afficherPasses; afficher(); }
      }, [afficherPasses ? "Masquer les rendez-vous passés" : "Afficher aussi les rendez-vous passés (" + nbPasses + ")"])]));
    }
    cible.appendChild(bloc);
  }

  function apresEnregistrement(cfg, texte, surligne) {
    etat.sale = false;
    etat.surligne = { section: cfg.section, index: surligne };
    etat.ignorerHash = location.hash !== cfg.hash;
    if (location.hash !== cfg.hash) location.hash = cfg.hash;
    afficher();
    message("ok", texte, voirSurLeSite(cfg));
  }

  function supprimer(cfg, i) {
    var donnees = liste(etat.contenu[cfg.section]).slice();
    var r = cfg.resume(donnees[i]);
    if (!window.confirm("Voulez-vous vraiment supprimer " + cfg.nomElement + " ?\n\n« " + (r.titre || "") + " »\n\nCette action est définitive.")) return;
    var retire = donnees.splice(i, 1)[0];
    effacerMessage();
    enregistrer(cfg.section, donnees).then(function () {
      if (retire && retire.photo) supprimerFichier(retire.photo);
      apresEnregistrement(cfg, "🗑️ C'est supprimé. Le site est à jour.", -1);
    }).catch(gererErreur);
  }

  function deplacer(cfg, i, sens) {
    var donnees = liste(etat.contenu[cfg.section]).slice();
    var j = i + sens;
    if (j < 0 || j >= donnees.length) return;
    var tmp = donnees[i]; donnees[i] = donnees[j]; donnees[j] = tmp;
    effacerMessage();
    enregistrer(cfg.section, donnees).then(function () {
      apresEnregistrement(cfg, "✅ L'ordre est enregistré. Le site est à jour.", j);
    }).catch(gererErreur);
  }

  // Formulaire d'ajout / de modification d'un élément
  function rendreFormulaire(cfg, index) {
    var donnees = liste(etat.contenu[cfg.section]);
    var nouveau = index === -1;
    if (!nouveau && !donnees[index]) { aller(cfg.hash); return; }
    var item = nouveau ? cfg.nouveau() : copie(donnees[index]);

    app.appendChild(boutonRetour(cfg.hash, "Annuler et revenir à la liste"));
    app.appendChild(h("h1", { texte: nouveau ? cfg.titreNouveau : cfg.titreModifier }));
    app.appendChild(h("p", { classe: "intro" }, ["Les champs marqués d'une ", h("span", { classe: "obligatoire", texte: "*" }), " sont obligatoires."]));

    var champs = [];
    var form = h("form", { classe: "formulaire carte", novalidate: true });
    cfg.champs.forEach(function (def) {
      var c = champ(def, item[def.nom], item);
      champs.push(c);
      form.appendChild(c.noeud);
    });
    var bouton = h("button", { type: "submit", classe: "bouton bouton-vert", texte: "💾 Enregistrer" });
    var etatEnvoi = h("p", { classe: "envoi-en-cours", hidden: true });
    form.appendChild(etatEnvoi);
    form.appendChild(h("div", { classe: "boutons-form" }, [
      bouton,
      h("button", { type: "button", classe: "bouton bouton-gris", texte: "Annuler", onclick: function () { aller(cfg.hash); } })
    ]));

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Lecture + contrôle de chaque champ
      var valeurs = {};
      champs.forEach(function (c) { valeurs[c.def.nom] = c.lire(); });
      var brouillon = Object.assign({}, item);
      champs.forEach(function (c) { if (c.def.type !== "photo") brouillon[c.def.nom] = valeurs[c.def.nom]; });
      var premierEnErreur = null;
      champs.forEach(function (c) {
        if (c.def.type === "dateFin") {
          var v = valeurs[c.def.nom];
          var ok = !v || (dateValide(brouillon.date) && v > brouillon.date);
          c.erreur(ok ? "" : "La date de fin doit être après la date de début.");
          if (!ok && !premierEnErreur) premierEnErreur = c;
          return;
        }
        if (!c.valider() && !premierEnErreur) premierEnErreur = c;
      });
      if (premierEnErreur) {
        message("erreur", "❌ Certaines informations manquent ou sont à corriger (en rouge ci-dessous).");
        var cibleFocus = premierEnErreur.noeud.querySelector("input,textarea,select");
        if (cibleFocus) setTimeout(function () { cibleFocus.focus(); }, 300);
        return;
      }
      effacerMessage();
      bouton.disabled = true;

      // Envoi éventuel de la photo, puis enregistrement de la liste
      var anciennePhoto = item.photo || "";
      var etape = Promise.resolve();
      champs.forEach(function (c) {
        if (c.def.type !== "photo") return;
        var p = valeurs[c.def.nom];
        if (p.nouveau) {
          etape = etape.then(function () {
            etatEnvoi.hidden = false;
            etatEnvoi.textContent = "⏳ Préparation et envoi de la photo… merci de patienter.";
            return preparerPhoto(p.nouveau).then(function (blob) { return envoyerFichier(blob, p.nouveau.name); })
              .then(function (rep) { brouillon[c.def.nom] = rep.id; });
          });
        } else if (p.retire) {
          brouillon[c.def.nom] = "";
        } else {
          brouillon[c.def.nom] = p.actuel;
        }
      });

      etape.then(function () {
        etatEnvoi.hidden = false;
        etatEnvoi.textContent = "⏳ Enregistrement en cours…";
        var nouvelle = donnees.slice();
        var position;
        if (nouveau) {
          if (cfg.ajouterEnTete) { nouvelle.unshift(brouillon); position = 0; }
          else { nouvelle.push(brouillon); position = nouvelle.length - 1; }
        } else {
          nouvelle[index] = brouillon;
          position = index;
        }
        return enregistrer(cfg.section, nouvelle).then(function () {
          if (anciennePhoto && anciennePhoto !== brouillon.photo) supprimerFichier(anciennePhoto);
          apresEnregistrement(cfg, nouveau ? "✅ C'est ajouté ! Le site est à jour." : "✅ C'est enregistré ! Le site est à jour.", position);
        });
      }).catch(function (err) {
        bouton.disabled = false;
        etatEnvoi.hidden = true;
        gererErreur(err);
      });
    });

    app.appendChild(form);
    etat.sale = false;
    var premier = form.querySelector("input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,select");
    if (premier) setTimeout(function () { premier.focus(); }, 60);
  }

  function vueListe(cfg, morceaux) {
    var cible = LISTES[morceaux[1]] && morceaux[1] !== cfg.section ? LISTES[morceaux[1]] : cfg;
    if (morceaux[2] === "nouveau") return rendreFormulaire(cible, -1);
    if (morceaux[2] === "modifier") return rendreFormulaire(cible, parseInt(morceaux[3], 10));
    app.appendChild(boutonRetour("#accueil"));
    var surligne = etat.surligne && etat.surligne.section === cfg.section ? etat.surligne.index : -1;
    rendreListe(cfg, app, surligne);
    if (cfg.section === "calendrier") rendreDocumentCalendrier(app);
  }

  /* =========================================================
     Calendrier complet (PDF)
     ========================================================= */
  function rendreDocumentCalendrier(cible) {
    var doc = etat.contenu.calendrierDoc || {};
    var url = fichierUrl(doc.fichier);
    cible.appendChild(h("hr", { classe: "separateur" }));
    var bloc = h("section", { classe: "carte" });
    bloc.appendChild(h("h2", { texte: "📄 Calendrier complet de la saison (PDF)" }));
    bloc.appendChild(h("p", { classe: "intro", texte: "Le document que les visiteurs peuvent télécharger sur la page « Tournois & résultats ». Quand vous mettez un nouveau PDF, les anciennes images du calendrier sont masquées automatiquement." }));
    var infos = h("div", { classe: "infos" }, [
      h("strong", { texte: url ? "Document actuel : " + (doc.nom || "calendrier.pdf") : "Document actuel : calendrier 2026-2027 (fourni à la création du site)" }),
      h("a", { href: url || "/assets/calendrier-provisoire-2026-2027.pdf", target: "_blank", rel: "noopener", texte: "📄 Ouvrir le document actuel" })
    ]);
    var entree = h("input", { type: "file", accept: "application/pdf,.pdf", id: "nouveau-pdf", tabindex: "-1", "aria-hidden": "true", style: "position:absolute;width:1px;height:1px;opacity:0" });
    var etatEnvoi = h("p", { classe: "envoi-en-cours", hidden: true });
    var actions = h("div", { classe: "actions", style: "display:flex;gap:10px;flex-wrap:wrap" }, [
      h("button", { type: "button", classe: "bouton bouton-bleu", texte: "📄 Mettre un nouveau calendrier PDF", onclick: function () { entree.click(); } }),
      url ? h("button", { type: "button", classe: "bouton bouton-gris", texte: "Revenir au calendrier d'origine", onclick: function () {
        if (!window.confirm("Revenir au calendrier 2026-2027 fourni à la création du site ?")) return;
        effacerMessage();
        enregistrer("calendrierDoc", { fichier: "", nom: "" }).then(function () {
          supprimerFichier(doc.fichier);
          afficher();
          message("ok", "✅ C'est fait. Le calendrier d'origine est de nouveau proposé.", { href: "/tournois-resultats.html#calendrier-complet", texte: "Voir sur le site →" });
        }).catch(gererErreur);
      } }) : null,
      entree
    ]);
    entree.addEventListener("change", function () {
      var f = entree.files && entree.files[0];
      if (!f) return;
      if (!/pdf$/i.test(f.type) && !/\.pdf$/i.test(f.name)) { message("erreur", "❌ Ce fichier n'est pas un document PDF."); entree.value = ""; return; }
      if (f.size > 4 * 1024 * 1024) { message("erreur", "❌ Ce document est trop lourd (4 Mo au maximum)."); entree.value = ""; return; }
      effacerMessage();
      etatEnvoi.hidden = false;
      etatEnvoi.textContent = "⏳ Envoi du document… merci de patienter.";
      envoyerFichier(f, f.name).then(function (rep) {
        return enregistrer("calendrierDoc", { fichier: rep.id, nom: f.name }).then(function () {
          if (doc.fichier) supprimerFichier(doc.fichier);
          afficher();
          message("ok", "✅ Le nouveau calendrier PDF est en ligne. Pensez à mettre à jour la saison dans « Textes du site » → « Tournois & résultats ».", { href: "/tournois-resultats.html#calendrier-complet", texte: "Voir sur le site →" });
        });
      }).catch(function (err) { etatEnvoi.hidden = true; entree.value = ""; gererErreur(err); });
    });
    bloc.appendChild(h("div", { classe: "document" }, [infos]));
    bloc.appendChild(actions);
    bloc.appendChild(etatEnvoi);
    cible.appendChild(bloc);
  }

  /* =========================================================
     Photos de la galerie
     ========================================================= */
  var CFG_PHOTOS = {
    section: "galerie", hash: "#photos", page: "galerie.html", ajouterEnTete: true,
    titre: "📷 Photos de la galerie",
    ajouter: "➕ Ajouter une photo",
    titreNouveau: "Ajouter une photo", titreModifier: "Modifier la photo",
    nomElement: "cette photo",
    nouveau: function () { return { id: idAleatoire("photo"), photo: "", legende: "", categorie: "tournois" }; },
    champs: [
      { nom: "photo", libelle: "Photo", type: "photo", requis: true, aide: "Choisissez une photo sur votre ordinateur ou votre téléphone. Elle sera automatiquement allégée avant l'envoi." },
      { nom: "legende", libelle: "Légende (facultatif)", max: 200, exemple: "Exemple : Remise des prix du TH3 de Besançon" },
      { nom: "categorie", libelle: "Catégorie", type: "radio", options: CATEGORIES }
    ],
    resume: function (p) { return { titre: p.legende || "(sans légende)", lignes: [] }; }
  };

  function vuePhotos(morceaux) {
    if (morceaux[1] === "nouveau") return rendreFormulaire(CFG_PHOTOS, -1);
    if (morceaux[1] === "modifier") return rendreFormulaire(CFG_PHOTOS, parseInt(morceaux[2], 10));
    app.appendChild(boutonRetour("#accueil"));
    var photos = liste(etat.contenu.galerie);
    app.appendChild(h("div", { classe: "entete-section" }, [
      h("h1", { texte: CFG_PHOTOS.titre }),
      h("button", { type: "button", classe: "bouton bouton-vert", onclick: function () { aller("#photos/nouveau"); } }, [CFG_PHOTOS.ajouter])
    ]));
    app.appendChild(h("p", { classe: "intro", texte: "Les photos apparaissent sur la page Galerie, la plus récente en premier. Les visiteurs peuvent les trier par catégorie." }));
    if (!photos.length) {
      app.appendChild(h("p", { classe: "vide", texte: "Aucune photo pour le moment. Cliquez sur le bouton vert « Ajouter une photo » pour commencer." }));
      return;
    }
    var surligne = etat.surligne && etat.surligne.section === "galerie" ? etat.surligne.index : -1;
    var grille = h("div", { classe: "grille-photos" });
    photos.forEach(function (p, i) {
      var cat = CATEGORIES.filter(function (c) { return c.valeur === p.categorie; })[0];
      grille.appendChild(h("div", { classe: "carte-photo" + (surligne === i ? " surligne" : "") }, [
        h("img", { src: fichierUrl(p.photo), alt: p.legende || "Photo", loading: "lazy" }),
        h("div", { classe: "texte" }, [h("strong", { texte: p.legende || "(sans légende)" }), h("span", { texte: cat ? cat.texte : "" })]),
        h("div", { classe: "actions" }, [
          h("button", { type: "button", classe: "bouton bouton-bleu bouton-petit", onclick: function () { aller("#photos/modifier/" + i); } }, ["✏️ Modifier"]),
          h("button", { type: "button", classe: "bouton bouton-rouge bouton-petit", onclick: function () { supprimer(CFG_PHOTOS, i); } }, ["🗑️ Supprimer"])
        ])
      ]));
    });
    app.appendChild(grille);
  }

  /* =========================================================
     Contact et chiffres
     ========================================================= */
  var CHAMPS_CONTACT = [
    { nom: "nom", libelle: "Personne à contacter (prénom et nom)", requis: true, max: 100 },
    { nom: "fonction", libelle: "Sa fonction", max: 60, exemple: "Exemple : Président" },
    { nom: "email", libelle: "Adresse e-mail du club", type: "email", requis: true, max: 120, aide: "C'est l'adresse affichée sur toutes les pages pour vous écrire." },
    { nom: "telephone", libelle: "Téléphone (facultatif)", type: "tel", max: 30, aide: "Laissez vide pour ne pas afficher de téléphone." },
    { nom: "adresse1", libelle: "Lieu des séances", max: 150, exemple: "Exemple : Centre Pierre Mendès-France" },
    { nom: "adresse2", libelle: "Adresse (rue, code postal, ville)", max: 150, exemple: "Exemple : 3 rue Beauregard, 25000 Besançon", aide: "Le plan de la page Contact se met à jour automatiquement avec cette adresse." },
    { nom: "licencies", libelle: "Nombre de licenciés cette saison", type: "number", inputmode: "numeric", max: 4, aide: "Affiché dans les chiffres clés de la page d'accueil et sur la page Tournois." }
  ];

  function vueContact() {
    app.appendChild(boutonRetour("#accueil"));
    app.appendChild(h("h1", { texte: "📞 Contact et chiffres" }));
    app.appendChild(h("p", { classe: "intro", texte: "Ces informations apparaissent sur toutes les pages du site : bas de page, page Contact, page Jouer avec nous…" }));
    var c = etat.contenu.contact || {};
    var champs = [];
    var form = h("form", { classe: "formulaire carte", novalidate: true });
    CHAMPS_CONTACT.forEach(function (def) {
      var x = champ(def, c[def.nom]);
      champs.push(x); form.appendChild(x.noeud);
    });
    var bouton = h("button", { type: "submit", classe: "bouton bouton-vert", texte: "💾 Enregistrer" });
    form.appendChild(h("div", { classe: "boutons-form" }, [bouton]));
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      champs.forEach(function (x) { if (!x.valider()) ok = false; });
      if (!ok) { message("erreur", "❌ Certaines informations manquent ou sont à corriger (en rouge ci-dessous)."); return; }
      var valeur = {};
      champs.forEach(function (x) { valeur[x.def.nom] = x.lire(); });
      valeur.licencies = parseInt(valeur.licencies, 10) || 0;
      effacerMessage();
      bouton.disabled = true;
      enregistrer("contact", valeur).then(function () {
        etat.sale = false;
        bouton.disabled = false;
        message("ok", "✅ C'est enregistré ! Le site est à jour.", { href: "/adherer-contact.html", texte: "Voir sur le site →" });
      }).catch(function (err) { bouton.disabled = false; gererErreur(err); });
    });
    app.appendChild(form);
    etat.sale = false;
  }

  /* =========================================================
     Textes du site
     ========================================================= */
  var PAGES_TEXTES = [
    { id: "accueil", fichier: "index.html", nom: "Accueil", icone: "🏠" },
    { id: "club", fichier: "le-club.html", nom: "Le club", icone: "♟️" },
    { id: "jouer", fichier: "jouer-avec-nous.html", nom: "Jouer avec nous", icone: "🎲" },
    { id: "tournois", fichier: "tournois-resultats.html", nom: "Tournois & résultats", icone: "🏆" },
    { id: "galerie", fichier: "galerie.html", nom: "Galerie", icone: "📷" },
    { id: "actus", fichier: "actualites.html", nom: "Actualités", icone: "📰" },
    { id: "adherer", fichier: "adherer-contact.html", nom: "Adhérer / Contact", icone: "✉️" },
    { id: "mentions", fichier: "mentions-legales.html", nom: "Mentions légales", icone: "⚖️" },
    { id: "pied", fichier: "index.html", nom: "Bas de page (toutes les pages)", icone: "⬇️", seulement: "pied." }
  ];

  function lireTextesPage(page) {
    if (etat.textesOrigine[page.id]) return Promise.resolve(etat.textesOrigine[page.id]);
    return fetch("/" + page.fichier, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var vus = {};
        var champs = [];
        doc.querySelectorAll("[data-edit]").forEach(function (e) {
          var cle = e.getAttribute("data-edit");
          if (vus[cle]) return;
          var estPied = cle.indexOf("pied.") === 0;
          if (page.seulement ? cle.indexOf(page.seulement) !== 0 : estPied) return;
          vus[cle] = true;
          champs.push({ cle: cle, libelle: e.getAttribute("data-edit-label") || cle, origine: normal(e.textContent), masquable: e.hasAttribute("data-edit-vide") });
        });
        etat.textesOrigine[page.id] = champs;
        return champs;
      })
      .catch(function () { throw new Error("Impossible de lire les textes de cette page. Vérifiez votre connexion internet, puis réessayez."); });
  }

  function vueTextes(morceaux) {
    var page = PAGES_TEXTES.filter(function (p) { return p.id === morceaux[1]; })[0];
    if (!page) {
      app.appendChild(boutonRetour("#accueil"));
      app.appendChild(h("h1", { texte: "✏️ Textes du site" }));
      app.appendChild(h("p", { classe: "intro", texte: "Choisissez la page dont vous voulez modifier les textes." }));
      var grille = h("div", { classe: "pages" });
      PAGES_TEXTES.forEach(function (p) {
        grille.appendChild(h("a", { classe: "tuile", href: "#textes/" + p.id }, [
          h("span", { classe: "icone", "aria-hidden": "true", texte: p.icone }),
          h("span", {}, [h("strong", { texte: p.nom })])
        ]));
      });
      app.appendChild(grille);
      return;
    }

    app.appendChild(boutonRetour("#textes", "Retour au choix des pages"));
    app.appendChild(h("h1", { texte: "✏️ Textes — " + page.nom }));
    var zone = h("div", {}, [h("p", { classe: "chargement", texte: "⏳ Chargement des textes…" })]);
    app.appendChild(zone);

    lireTextesPage(page).then(function (champsPage) {
      vider(zone);
      zone.appendChild(h("div", { classe: "aide" }, [
        h("strong", { texte: "Astuce : " }),
        "modifiez les textes ci-dessous puis cliquez sur le bouton vert en bas de la page. Le bouton « Remettre le texte d'origine » annule vos changements sur un texte."
      ]));
      var textes = etat.contenu.textes || {};
      var form = h("form", { classe: "formulaire carte", novalidate: true });
      var lecteurs = [];
      champsPage.forEach(function (f, n) {
        var actuel = Object.prototype.hasOwnProperty.call(textes, f.cle) ? textes[f.cle] : f.origine;
        var id = "texte-" + n;
        var ta = h("textarea", { id: id, rows: Math.min(10, Math.max(2, Math.ceil(actuel.length / 70) + 1)), maxlength: 4000 });
        ta.value = actuel;
        var reinit = h("button", { type: "button", classe: "bouton bouton-gris bouton-petit reinit", texte: "↺ Remettre le texte d'origine" });
        reinit.addEventListener("click", function () { ta.value = f.origine; etat.sale = true; ta.focus(); });
        ta.addEventListener("input", function () { etat.sale = true; });
        form.appendChild(h("div", { classe: "champ" }, [
          h("label", { classe: "titre-champ", "for": id, texte: f.libelle }),
          f.masquable ? h("span", { classe: "aide-champ", texte: "Si vous videz entièrement ce texte, il ne s'affichera plus sur le site." }) : null,
          ta, reinit
        ]));
        var err = h("span", { classe: "erreur-champ", role: "alert", hidden: true });
        ta.parentNode.appendChild(err);
        lecteurs.push({ f: f, ta: ta, err: err });
      });
      if (!lecteurs.length) form.appendChild(h("p", { texte: "Aucun texte modifiable sur cette page." }));
      var bouton = h("button", { type: "submit", classe: "bouton bouton-vert", texte: "💾 Enregistrer les textes de cette page" });
      form.appendChild(h("div", { classe: "boutons-form" }, [bouton]));
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var vides = lecteurs.filter(function (l) {
          var manque = !l.f.masquable && !l.ta.value.trim();
          l.err.textContent = manque ? "Ce texte ne peut pas être vide. Cliquez sur « Remettre le texte d'origine » si besoin." : "";
          l.err.hidden = !manque;
          l.ta.parentNode.classList.toggle("en-erreur", manque);
          return manque;
        });
        if (vides.length) {
          message("erreur", "❌ Certains textes sont vides (en rouge ci-dessous).");
          setTimeout(function () { vides[0].ta.focus(); }, 300);
          return;
        }
        var nouveaux = Object.assign({}, etat.contenu.textes || {});
        lecteurs.forEach(function (l) {
          var v = l.ta.value.replace(/\r\n?/g, "\n").trim();
          if (normal(v) === l.f.origine) delete nouveaux[l.f.cle];
          else nouveaux[l.f.cle] = v;
        });
        effacerMessage();
        bouton.disabled = true;
        enregistrer("textes", nouveaux).then(function () {
          etat.sale = false;
          bouton.disabled = false;
          message("ok", "✅ Les textes sont enregistrés ! Le site est à jour.", { href: "/" + page.fichier, texte: "Voir sur le site →" });
        }).catch(function (err) { bouton.disabled = false; gererErreur(err); });
      });
      zone.appendChild(form);
      etat.sale = false;
    }).catch(function (err) {
      vider(zone);
      zone.appendChild(h("p", { classe: "alerte alerte-erreur", texte: err.message }));
    });
  }

  /* =========================================================
     Palmarès + archives (deux listes sur la même page)
     ========================================================= */
  function vuePalmares(morceaux) {
    if (morceaux[1] === "palmares" || morceaux[1] === "archives") {
      var cfg = LISTES[morceaux[1]];
      if (morceaux[2] === "nouveau") return rendreFormulaire(cfg, -1);
      if (morceaux[2] === "modifier") return rendreFormulaire(cfg, parseInt(morceaux[3], 10));
    }
    app.appendChild(boutonRetour("#accueil"));
    var s = etat.surligne || {};
    rendreListe(LISTES.palmares, app, s.section === "palmares" ? s.index : -1);
    app.appendChild(h("hr", { classe: "separateur" }));
    rendreListe(LISTES.archives, app, s.section === "archives" ? s.index : -1);
  }

  /* =========================================================
     Aiguillage
     ========================================================= */
  function afficher() {
    if (!etat.contenu) return;
    vider(app);
    var morceaux = (location.hash || "#accueil").slice(1).split("/");
    var route = morceaux[0] || "accueil";
    try {
      if (route === "accueil") vueAccueil();
      else if (route === "photos") vuePhotos(morceaux);
      else if (route === "contact") vueContact();
      else if (route === "textes") vueTextes(morceaux);
      else if (route === "palmares") vuePalmares(morceaux);
      else if (LISTES[route]) vueListe(LISTES[route], morceaux);
      else { etat.ignorerHash = true; location.hash = "#accueil"; vueAccueil(); }
    } catch (e) {
      if (window.console) console.error(e);
      app.appendChild(h("p", { classe: "alerte alerte-erreur", texte: "Une erreur inattendue est survenue. Rechargez la page." }));
    }
    etat.surligne = null;
    if (principal) principal.focus({ preventScroll: true });
  }

  demarrer();
})();
