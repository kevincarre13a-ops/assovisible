/* Union des Écrivains Vosgiens — scripts communs */
(function () {
  "use strict";
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilitaires partagés ---------- */
  var UEV = (window.UEV = {});
  var cache = {};
  UEV.charger = function (nom) {
    if (!cache[nom]) {
      cache[nom] = fetch("data/" + nom + ".json").then(function (r) {
        if (!r.ok) throw new Error("Données introuvables : " + nom);
        return r.json();
      });
    }
    return cache[nom];
  };
  UEV.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  UEV.norm = function (s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  };
  UEV.mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  UEV.dateLongue = function (iso) {
    var d = new Date(iso + "T12:00:00");
    return d.getDate() + (d.getDate() === 1 ? "er " : " ") + UEV.mois[d.getMonth()] + " " + d.getFullYear();
  };
  UEV.icone = function (id, cls) {
    return '<svg class="ico ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
  };
  var teintes = [["#3d5ca8", "#1d2f58"], ["#1f4a3a", "#10281f"], ["#9a521a", "#4f2a0e"], ["#6b4d8a", "#32224a"], ["#2a7f86", "#12404a"], ["#b34a5a", "#5a2030"]];
  UEV.teinte = function (txt) {
    var h = 0;
    for (var i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) >>> 0;
    return teintes[h % teintes.length];
  };
  UEV.couvertureHtml = function (o, avecCredit) {
    var t = UEV.teinte(o.genre || o.titre);
    var corps = o.couverture
      ? '<img src="' + UEV.esc(o.couverture) + '" alt="Couverture de ' + UEV.esc(o.titre) + '" loading="lazy">'
      : '<span class="c-genre">' + UEV.esc(o.genre || "Ouvrage") + '</span><span class="c-titre">' + UEV.esc(o.titre) + '</span><span class="c-auteur">' + UEV.esc(o.auteurLabel || "") + "</span>";
    var cred = o.couverture && avecCredit && o.couvertureCredit ? '<p class="credit">Couverture : ' + UEV.esc(o.couvertureCredit) + "</p>" : "";
    return '<div class="cover" style="--cv:' + t[0] + '">' + (o.exemple ? '<span class="c-modele">Modèle</span>' : "") + corps + "</div>" + cred;
  };
  UEV.auteurNom = function (o, auteurs) {
    if (o.auteurId && auteurs) {
      var a = auteurs.filter(function (x) { return x.id === o.auteurId; })[0];
      if (a) return a.nom;
    }
    return o.auteurLabel || "Auteur·e à renseigner";
  };

  /* ---------- Menu mobile + en-tête ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("menu");
  var entete = document.querySelector(".site-header");
  if (burger && nav) {
    var fermer = function () {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
      nav.classList.remove("open");
      document.body.style.overflow = "";
    };
    burger.addEventListener("click", function () {
      var ouvert = burger.getAttribute("aria-expanded") === "true";
      if (ouvert) return fermer();
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Fermer le menu");
      nav.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermer(); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) fermer(); });
    window.matchMedia("(min-width: 1141px)").addEventListener("change", fermer);
  }
  var surScroll = function () { if (entete) entete.classList.toggle("scrolled", window.scrollY > 10); };
  surScroll();
  window.addEventListener("scroll", surScroll, { passive: true });

  /* ---------- Apparition au défilement ---------- */
  UEV.observer = function (racine) {
    var els = (racine || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduit) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e, i) { if (!e.style.getPropertyValue("--d")) e.style.setProperty("--d", (i % 4) * 0.08 + "s"); io.observe(e); });
  };
  UEV.observer();

  /* ---------- Compteurs animés ---------- */
  UEV.compteurs = function (racine) {
    var els = (racine || document).querySelectorAll("[data-count]");
    var lancer = function (el) {
      var cible = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffixe = el.getAttribute("data-suffix") || "";
      if (reduit) { el.textContent = cible + suffixe; return; }
      var t0 = null, duree = 1600;
      var pas = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / duree, 1);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(cible * e) + (p === 1 ? suffixe : "");
        if (p < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(lancer); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { lancer(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- Plumes et pages qui dérivent (héro) ---------- */
  var drift = document.querySelector(".drift");
  if (drift && !reduit) {
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("i");
      s.style.left = Math.round(Math.random() * 100) + "%";
      s.style.width = s.style.height = 14 + Math.round(Math.random() * 22) + "px";
      s.style.animationDuration = 14 + Math.random() * 18 + "s";
      s.style.animationDelay = -Math.random() * 20 + "s";
      s.style.setProperty("--dx", Math.round(Math.random() * 200 - 100) + "px");
      s.style.setProperty("--rot", Math.round(Math.random() * 600 - 300) + "deg");
      drift.appendChild(s);
    }
  }

  /* ---------- Formulaires Netlify en AJAX (avec repli classique) ---------- */
  UEV.formulaire = function (form, surSucces) {
    form.addEventListener("submit", function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var ok = form.querySelector(".form-ok"), err = form.querySelector(".form-err"), bouton = form.querySelector("[type=submit]");
      if (ok) ok.classList.remove("show");
      if (err) err.classList.remove("show");
      if (bouton) bouton.disabled = true;
      var corps = new URLSearchParams(new FormData(form)).toString();
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: corps })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          if (ok) ok.classList.add("show");
          form.reset();
          if (surSucces) surSucces();
        })
        .catch(function () { if (err) err.classList.add("show"); })
        .then(function () { if (bouton) bouton.disabled = false; });
    });
  };
  document.querySelectorAll("form[data-ajax]").forEach(function (f) { UEV.formulaire(f); });

  /* ---------- Année du pied de page ---------- */
  var an = document.getElementById("annee");
  if (an) an.textContent = new Date().getFullYear();
})();
