/* L'Albarelle — comportements communs (menu, animations, données, zoom) */
(function () {
  "use strict";
  var doc = document;
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.documentElement.classList.remove("no-js");

  /* ---------- utilitaires ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var cache = {};
  function donnees(nom) {
    if (!cache[nom]) {
      cache[nom] = fetch("data/" + nom + ".json").then(function (r) {
        if (!r.ok) throw new Error(nom);
        return r.json();
      });
    }
    return cache[nom];
  }
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var MOIS_C = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  function dateObj(iso) { return new Date(iso + "T12:00:00"); }
  function dateLongue(iso) {
    var d = dateObj(iso);
    return d.getDate() + (d.getDate() === 1 ? "er" : "") + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
  }
  function plage(e) {
    if (!e.date) return "Date à confirmer";
    if (e.annee_seule) return "Année " + e.date.slice(0, 4);
    if (e.date_fin && e.date_fin !== e.date) {
      var a = dateObj(e.date), b = dateObj(e.date_fin);
      return "Du " + a.getDate() + (a.getMonth() !== b.getMonth() ? " " + MOIS[a.getMonth()] : "") + " au " + dateLongue(e.date_fin);
    }
    return dateLongue(e.date);
  }
  function aujourdhui() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  var NOMS_CAT = { exposition: "Exposition", conference: "Conférence", atelier: "Atelier", patrimoine: "Patrimoine", concert: "Concert" };
  function erreurDonnees(el) {
    el.innerHTML = '<p class="note">Le contenu n’a pas pu être chargé. Rechargez la page ou contactez l’association.</p>';
  }

  /* ---------- en-tête, menu ---------- */
  var entete = doc.querySelector(".site-header");
  var burger = doc.querySelector(".burger");
  var menu = doc.getElementById("menu-principal");
  function surDefilement() {
    if (!entete) return;
    entete.classList.toggle("solide", window.scrollY > 40);
  }
  surDefilement();
  window.addEventListener("scroll", surDefilement, { passive: true });
  function basculerMenu(ouvrir) {
    var etat = typeof ouvrir === "boolean" ? ouvrir : !entete.classList.contains("ouvert");
    entete.classList.toggle("ouvert", etat);
    burger.setAttribute("aria-expanded", String(etat));
    burger.setAttribute("aria-label", etat ? "Fermer le menu" : "Ouvrir le menu");
    doc.body.style.overflow = etat ? "hidden" : "";
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { basculerMenu(); });
    menu.addEventListener("click", function (e) { if (e.target.tagName === "A") basculerMenu(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && entete.classList.contains("ouvert")) { basculerMenu(false); burger.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1360) basculerMenu(false); });
  }

  /* ---------- apparition douce ---------- */
  var io = "IntersectionObserver" in window && !reduit ? new IntersectionObserver(function (items) {
    items.forEach(function (it) {
      if (it.isIntersecting) { it.target.classList.add("vu"); io.unobserve(it.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  function observer(racine) {
    (racine || doc).querySelectorAll(".reveal:not(.vu)").forEach(function (el) {
      if (io) io.observe(el); else el.classList.add("vu");
    });
  }
  observer();

  /* ---------- compteurs animés ---------- */
  var annee = new Date().getFullYear();
  doc.querySelectorAll("[data-depuis]").forEach(function (el) {
    el.dataset.cible = annee - parseInt(el.dataset.depuis, 10);
  });
  function animer(el) {
    var cible = parseInt(el.dataset.cible, 10);
    if (isNaN(cible)) return;
    if (reduit) { el.textContent = cible; return; }
    var debut = null, duree = 1900;
    function pas(t) {
      if (debut === null) debut = t;
      var p = Math.min((t - debut) / duree, 1);
      el.textContent = Math.round(cible * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }
  var compteurs = doc.querySelectorAll(".compteur strong");
  if (compteurs.length) {
    if ("IntersectionObserver" in window && !reduit) {
      var ioc = new IntersectionObserver(function (items) {
        items.forEach(function (it) { if (it.isIntersecting) { animer(it.target); ioc.unobserve(it.target); } });
      }, { threshold: 0.6 });
      compteurs.forEach(function (c) { c.textContent = "0"; ioc.observe(c); });
    } else compteurs.forEach(animer);
  }

  /* ---------- diaporama du héros ---------- */
  var diapo = doc.querySelectorAll(".hero-fond img");
  if (diapo.length > 1 && !reduit) {
    var i = 0;
    setInterval(function () {
      diapo[i].classList.remove("actif");
      i = (i + 1) % diapo.length;
      diapo[i].classList.add("actif");
    }, 8000);
  }

  /* ---------- zoom (lightbox) ---------- */
  var lb, lbImg, lbTxt, lbListe = [], lbIdx = 0, lbRetour = null;
  function creerLb() {
    lb = doc.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Agrandissement de la photo");
    lb.innerHTML = '<button class="lb-fermer" aria-label="Fermer">×</button><button class="lb-prec" aria-label="Photo précédente">‹</button><img alt=""><p></p><button class="lb-suiv" aria-label="Photo suivante">›</button>';
    doc.body.appendChild(lb);
    lbImg = lb.querySelector("img");
    lbTxt = lb.querySelector("p");
    lb.querySelector(".lb-fermer").addEventListener("click", fermerLb);
    lb.querySelector(".lb-prec").addEventListener("click", function () { montrerLb(lbIdx - 1); });
    lb.querySelector(".lb-suiv").addEventListener("click", function () { montrerLb(lbIdx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fermerLb(); });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) montrerLb(lbIdx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("ouverte")) return;
      if (e.key === "Escape") fermerLb();
      else if (e.key === "ArrowLeft") montrerLb(lbIdx - 1);
      else if (e.key === "ArrowRight") montrerLb(lbIdx + 1);
      else if (e.key === "Tab") {
        var bt = Array.prototype.slice.call(lb.querySelectorAll("button"));
        var k = bt.indexOf(doc.activeElement);
        e.preventDefault();
        bt[(k + (e.shiftKey ? -1 : 1) + bt.length) % bt.length].focus();
      }
    });
  }
  function montrerLb(n) {
    if (!lbListe.length) return;
    lbIdx = (n + lbListe.length) % lbListe.length;
    var el = lbListe[lbIdx];
    lbImg.src = el.dataset.grand || el.dataset.src;
    lbImg.alt = el.dataset.alt || "";
    lbTxt.textContent = el.dataset.legende || "";
    var seul = lbListe.length < 2;
    lb.querySelector(".lb-prec").style.display = seul ? "none" : "";
    lb.querySelector(".lb-suiv").style.display = seul ? "none" : "";
  }
  function fermerLb() {
    lb.classList.remove("ouverte");
    doc.body.style.overflow = "";
    if (lbRetour) lbRetour.focus();
  }
  doc.addEventListener("click", function (e) {
    var z = e.target.closest(".zoomable");
    if (!z) return;
    if (!lb) creerLb();
    var groupe = z.closest("[data-groupe]");
    lbListe = Array.prototype.slice.call((groupe || doc).querySelectorAll(".zoomable")).filter(function (n) { return n.offsetParent !== null; });
    if (!groupe) lbListe = [z];
    lbRetour = z;
    lb.classList.add("ouverte");
    doc.body.style.overflow = "hidden";
    montrerLb(lbListe.indexOf(z));
    lb.querySelector(".lb-fermer").focus();
  });
  var LOUPE = '<span class="loupe" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M10.5 8v5M8 10.5h5"/></svg></span>';

  /* ---------- événements ---------- */
  function trierEvenements(liste) {
    var auj = aujourdhui();
    var avenir = [], passes = [];
    liste.forEach(function (e) {
      var fin = e.date_fin || e.date;
      if (!e.date || fin >= auj) avenir.push(e); else passes.push(e);
    });
    avenir.sort(function (a, b) {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
    passes.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return { avenir: avenir, passes: passes };
  }
  function carteEvenement(e) {
    var d = e.date && !e.annee_seule ? dateObj(e.date) : null;
    var jour = d ? '<div class="jour" aria-hidden="true"><b>' + d.getDate() + "</b><span>" + MOIS_C[d.getMonth()] + "</span></div>" : "";
    var meta = ['<span>' + esc(plage(e)) + "</span>"];
    if (e.heure) meta.push("<span>" + esc(e.heure) + "</span>");
    if (e.lieu) meta.push("<span>" + esc(e.lieu) + "</span>");
    var infos = [e.public, e.prix].filter(Boolean).map(esc).join(" · ");
    var lien = e.lien ? '<a href="' + esc(e.lien) + '"' + (/^https?:/.test(e.lien) ? ' target="_blank" rel="noopener"' : "") + ">En savoir plus<span class=\"sr-only\"> sur " + esc(e.titre) + "</span> →</a>" : "";
    return '<article class="evt reveal' + (e.attente ? " attente-evt" : "") + '" data-cat="' + esc(e.categorie) + '">' +
      '<div class="vig">' + (e.image ? '<img src="' + esc(e.image) + '" alt="" loading="lazy">' : "") + jour + "</div>" +
      '<div class="txt"><span class="etiquette ' + esc(e.categorie) + '">' + esc(NOMS_CAT[e.categorie] || e.categorie) + "</span>" +
      "<h3>" + esc(e.titre) + '</h3><div class="meta">' + meta.join("") + "</div><p>" + esc(e.resume) + "</p>" +
      (infos ? '<p class="note">' + infos + "</p>" : "") + lien + "</div></article>";
  }

  var elProchain = doc.querySelector("[data-prochain]");
  var elListeEvt = doc.querySelector("[data-evenements]");
  if (elProchain || elListeEvt) {
    donnees("events").then(function (data) {
      var t = trierEvenements(data.evenements);
      if (elProchain) {
        var auj = aujourdhui();
        var suivant = t.avenir.filter(function (e) { return e.date && e.date >= auj; })[0] || t.avenir.filter(function (e) { return e.date; })[0];
        var encours = t.avenir.filter(function (e) { return e.date && e.date_fin && e.date <= auj && e !== suivant; })[0];
        var g = elProchain.querySelector(".gauche");
        if (suivant) {
          g.innerHTML = '<p class="date-grande">' + esc(plage(suivant)) + (suivant.heure ? " · " + esc(suivant.heure) : "") + "</p>" +
            "<h2>" + esc(suivant.titre) + "</h2><p>" + esc(suivant.resume) + '</p><p><a class="btn btn-contour" href="evenements.html">Voir tous les rendez-vous</a></p>';
        } else {
          g.innerHTML = "<h2>Programme à venir</h2><p>Les prochains rendez-vous seront annoncés prochainement.</p>" + '<p><a class="btn btn-contour" href="evenements.html">Événements &amp; expositions</a></p>';
        }
        if (encours) {
          var ex = elProchain.querySelector("[data-encours]");
          ex.innerHTML = '<h3>À l’affiche</h3><p><strong>' + esc(encours.titre) + "</strong><br>" + esc(plage(encours)) + "</p>";
        }
      }
      if (elListeEvt) {
        var cats = {};
        t.avenir.forEach(function (e) { cats[e.categorie] = 1; });
        var fb = doc.querySelector("[data-filtres-evt]");
        if (fb) {
          fb.innerHTML = '<li><button type="button" aria-pressed="true" data-f="">Tout</button></li>' +
            Object.keys(cats).map(function (c) { return '<li><button type="button" aria-pressed="false" data-f="' + c + '">' + esc(NOMS_CAT[c] || c) + "</button></li>"; }).join("");
          fb.addEventListener("click", function (ev) {
            var b = ev.target.closest("button");
            if (!b) return;
            fb.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
            elListeEvt.querySelectorAll(".evt").forEach(function (c) { c.hidden = !!b.dataset.f && c.dataset.cat !== b.dataset.f; });
          });
        }
        elListeEvt.innerHTML = t.avenir.length ? t.avenir.map(carteEvenement).join("") : '<p class="note">Aucun rendez-vous annoncé pour le moment.</p>';
        observer(elListeEvt);
      }
      var arch = doc.querySelector("[data-archives]");
      if (arch) {
        var parAn = {};
        t.passes.forEach(function (e) { var a = e.date.slice(0, 4); (parAn[a] = parAn[a] || []).push(e); });
        var ans = Object.keys(parAn).sort().reverse();
        arch.innerHTML = ans.map(function (a, k) {
          return "<details" + (k === 0 ? " open" : "") + "><summary>" + a + ' <span class="etiquette">' + parAn[a].length + (parAn[a].length > 1 ? " rendez-vous" : " rendez-vous") + '</span></summary><div class="liste-arch">' +
            parAn[a].map(function (e) {
              return '<div class="arch">' + (e.image ? '<img src="' + esc(e.image) + '" alt="" loading="lazy" width="90" height="90">' : "<span></span>") +
                '<div><span class="etiquette ' + esc(e.categorie) + '">' + esc(NOMS_CAT[e.categorie] || e.categorie) + "</span><h4>" + esc(e.titre) + "</h4><p><em>" + esc(plage(e)) + "</em> — " + esc(e.resume) +
                (e.lien ? ' <a href="' + esc(e.lien) + '" target="_blank" rel="noopener">Source</a>' : "") + "</p></div></div>";
            }).join("") + "</div></details>";
        }).join("");
      }
    }).catch(function () {
      [elProchain && elProchain.querySelector(".gauche"), elListeEvt].forEach(function (x) { if (x) erreurDonnees(x); });
    });
  }

  /* ---------- actualités ---------- */
  doc.querySelectorAll("[data-actus]").forEach(function (cont) {
    var max = parseInt(cont.dataset.actus, 10) || 99;
    donnees("news").then(function (data) {
      cont.innerHTML = data.actualites.slice(0, max).map(function (a, k) {
        var ext = /^https?:/.test(a.lien || "");
        var tete = '<div class="vignette">' + (a.image ? '<img src="' + esc(a.image) + '" alt="" loading="lazy">' : "") + "</div>";
        var corps = '<div class="corps"><span class="etiquette patrimoine">' + esc(a.periode || "") + "</span><h3 style=\"margin-top:.7rem\">" + esc(a.titre) + "</h3><p>" + esc(a.resume) + "</p>" +
          (a.lien ? '<span class="plus">Lire la suite</span>' : "") + "</div>";
        var attr = ' class="carte reveal" data-d="' + (k % 3) + '"';
        return a.lien ? "<a" + attr + ' href="' + esc(a.lien) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + tete + corps + "</a>" : "<article" + attr + ">" + tete + corps + "</article>";
      }).join("");
      observer(cont);
    }).catch(function () { erreurDonnees(cont); });
  });

  /* ---------- collections, frise chronologique ---------- */
  var elCollec = doc.querySelector("[data-collections]");
  var elChrono = doc.querySelector("[data-chrono]");
  if (elCollec || elChrono) {
    donnees("collections").then(function (data) {
      if (elCollec) {
        elCollec.innerHTML = data.collections.map(function (c, k) {
          return '<article class="carte reveal" data-d="' + (k % 3) + '"><button type="button" class="zoomable vignette" data-src="' + esc(c.image) + '" data-alt="' + esc(c.titre) + '" data-legende="' + esc(c.titre) + '">' +
            '<img src="' + esc(c.image) + '" alt="' + esc(c.titre) + '" loading="lazy"><span class="sr-only">Agrandir la photo : ' + esc(c.titre) + "</span>" + LOUPE + '</button><div class="corps"><h3>' + esc(c.titre) + "</h3><p>" + esc(c.texte) + "</p></div></article>";
        }).join("");
        observer(elCollec);
      }
      if (elChrono) {
        elChrono.innerHTML = data.chronologie.map(function (c) {
          return '<li class="reveal"><div class="an">' + esc(c.annee) + "</div><h3>" + esc(c.titre) + "</h3><p>" + esc(c.texte) + "</p></li>";
        }).join("");
        observer(elChrono);
      }
    }).catch(function () { [elCollec, elChrono].forEach(function (x) { if (x) erreurDonnees(x); }); });
  }

  /* ---------- galerie ---------- */
  var elGal = doc.querySelector("[data-galerie]");
  if (elGal) {
    donnees("gallery").then(function (data) {
      var fb = doc.querySelector("[data-filtres-gal]");
      function afficher(theme) {
        var photos = data.photos.filter(function (p) { return !theme || p.theme === theme; });
        elGal.innerHTML = photos.map(function (p) {
          return '<figure class="reveal"><button type="button" class="zoomable" data-src="' + esc(p.src) + '" data-alt="' + esc(p.alt) + '" data-legende="' + esc(p.legende) + '">' +
            '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy">' + LOUPE + '<span class="sr-only">Agrandir : ' + esc(p.legende) + "</span></button><figcaption>" + esc(p.legende) + "</figcaption></figure>";
        }).join("");
        observer(elGal);
      }
      fb.innerHTML = '<li><button type="button" aria-pressed="true" data-f="">Toutes</button></li>' +
        data.themes.map(function (t) { return '<li><button type="button" aria-pressed="false" data-f="' + esc(t.id) + '">' + esc(t.nom) + "</button></li>"; }).join("");
      fb.addEventListener("click", function (ev) {
        var b = ev.target.closest("button");
        if (!b) return;
        fb.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        afficher(b.dataset.f);
      });
      afficher("");
    }).catch(function () { erreurDonnees(elGal); });
  }

  /* ---------- contenus issus de site.json (horaires, tarifs, bureau) ---------- */
  var lignes = function (l) { return l.map(function (x) { return "<tr><th scope=\"row\">" + esc(x.jour) + "</th><td>" + esc(x.heures) + "</td></tr>"; }).join(""); };
  var elH = doc.querySelector("[data-horaires]");
  var elT = doc.querySelector("[data-tarifs]");
  var elB = doc.querySelector("[data-bureau]");
  var elP = doc.querySelector("[data-prochaine-visite]");
  if (elH || elT || elB || elP) {
    donnees("site").then(function (s) {
      if (elH) {
        var h = s.horaires;
        elH.innerHTML = '<div class="bloc"><h3>Période scolaire</h3><div class="defile-x"><table class="tableau"><caption class="sr-only">Horaires hors vacances scolaires</caption><thead><tr><th scope="col">Jour</th><th scope="col">Horaires</th></tr></thead><tbody>' + lignes(h.hors_vacances) + "</tbody></table></div>" +
          '<p style="margin-top:1rem"><strong>Visite guidée individuelle :</strong> ' + esc(h.visite_guidee_hors_vacances) + "</p></div>" +
          '<div class="bloc bleu-bord"><h3>Vacances scolaires (zone A)</h3><div class="defile-x"><table class="tableau"><caption class="sr-only">Horaires pendant les vacances de la zone A</caption><thead><tr><th scope="col">Jour</th><th scope="col">Horaires</th></tr></thead><tbody>' + lignes(h.vacances_zone_a) + "</tbody></table></div>" +
          '<p style="margin-top:1rem"><strong>Visite guidée individuelle :</strong> ' + esc(h.visite_guidee_vacances) + "</p></div>";
        var n = doc.querySelector("[data-horaires-note]");
        if (n) n.innerHTML = esc(h.annee_note) + " " + esc(h.fermeture);
      }
      if (elT) {
        var t = s.tarifs;
        elT.innerHTML = '<div class="defile-x"><table class="tableau"><caption class="sr-only">Tarifs individuels</caption><thead><tr><th scope="col">Visite</th><th scope="col">Tarif normal</th><th scope="col">Tarif réduit*</th><th scope="col">Moins de 10 ans</th></tr></thead><tbody>' +
          t.individuels.map(function (x) { return "<tr><th scope=\"row\">" + esc(x.libelle) + "</th><td>" + esc(x.normal) + "</td><td>" + esc(x.reduit) + "</td><td>" + esc(x.moins10) + "</td></tr>"; }).join("") +
          '</tbody></table></div><p class="note" style="margin-top:1rem">* ' + esc(t.reduit_conditions) + "</p>";
        var f = doc.querySelector("[data-tarifs-famille]");
        if (f) f.innerHTML = '<ul class="liste-coches">' + t.famille.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><p class="note">' + esc(t.bon_plan) + "</p>";
        var g = doc.querySelector("[data-tarifs-groupes]");
        if (g) g.innerHTML = t.groupes.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
        var sc = doc.querySelector("[data-tarifs-scolaires]");
        if (sc) sc.innerHTML = t.scolaires.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      }
      if (elB) {
        elB.innerHTML = s.bureau.map(function (m, k) {
          return '<div class="bloc reveal" data-d="' + (k % 3) + '"><h3>' + esc(m.nom) + "</h3><p><span class=\"etiquette\">" + esc(m.role) + "</span></p></div>";
        }).join("");
        observer(elB);
        var bn = doc.querySelector("[data-bureau-note]");
        if (bn) bn.textContent = s.bureau_date;
      }
      if (elP) {
        elP.innerHTML = "<li><strong>Visites guidées</strong> (hors vacances) : " + esc(s.horaires.visite_guidee_hors_vacances) + "</li>" +
          "<li><strong>Vacances zone A</strong> : " + esc(s.horaires.visite_guidee_vacances) + "</li>";
      }
    }).catch(function () { [elH, elT, elB, elP].forEach(function (x) { if (x) erreurDonnees(x); }); });
  }

  /* ---------- formulaire de contact (Netlify Forms, envoi sans rechargement) ---------- */
  var form = doc.querySelector("form[data-netlify]");
  if (form && window.fetch) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var statut = doc.getElementById("statut-formulaire");
      var bouton = form.querySelector("button[type=submit]");
      bouton.disabled = true;
      statut.className = "statut";
      statut.textContent = "Envoi en cours…";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        form.reset();
        statut.textContent = "Merci, votre message a bien été envoyé. L’association vous répondra dès que possible.";
        statut.focus();
      }).catch(function () {
        statut.className = "statut erreur";
        statut.textContent = "L’envoi a échoué. Vous pouvez réessayer ou écrire directement à l’adresse indiquée sur cette page.";
      }).then(function () { bouton.disabled = false; });
    });
  }
})();
