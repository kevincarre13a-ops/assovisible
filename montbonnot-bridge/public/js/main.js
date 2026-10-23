(function () {
  "use strict";
  var doc = document;
  doc.documentElement.classList.remove("no-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Menu burger ---- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("menu");
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".label").textContent = open ? "Fermer" : "Menu";
    nav.classList.toggle("open", open);
    doc.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    window.matchMedia("(min-width:1340px)").addEventListener("change", function () { setMenu(false); });
  }

  /* ---- Ombre de l'en-tête ---- */
  var header = doc.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 10); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Apparition au défilement ---- */
  var reveals = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Compteurs animés ---- */
  var counters = doc.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1800, t0 = null;
    if (reduce) { el.textContent = target; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { el.textContent = "0"; co.observe(el); });
  }

  /* ---- Prochain tournoi ---- */
  var box = doc.getElementById("next-event");
  if (box) {
    var jours = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    var mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var now = new Date();
    // Prochaine ronde régulière : lundi (1) ou mercredi (3) ; avant 18 h le jour même, sinon la suivante
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var lastCall = now.getHours() < 18;
    var guard = 0;
    while (guard++ < 10) {
      var wd = d.getDay();
      var isDay = wd === 1 || wd === 3;
      var sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
      if (isDay && (!sameDay || lastCall)) break;
      d.setDate(d.getDate() + 1);
    }
    var regular = { date: d, titre: "Ronde de France", heure: "13 h 45", lieu: "Salle Saint-Exupéry", details: "Tournoi par paires — venez avec votre partenaire. Droits de table : 4 € adhérent · 6 € non-adhérent." };

    // Premier événement exceptionnel à venir (events.js)
    var special = null;
    (window.CLUB_EVENTS || []).forEach(function (ev) {
      var p = ev.date.split("-");
      var ed = new Date(+p[0], +p[1] - 1, +p[2]);
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (ed >= today && (!special || ed < special.date)) special = { date: ed, titre: ev.titre, heure: ev.heure, lieu: ev.lieu, details: ev.details };
    });
    var pick = special && special.date <= regular.date ? special : regular;

    var days = Math.round((pick.date - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
    var when = days === 0 ? "Aujourd'hui" : days === 1 ? "Demain" : "Dans " + days + " jours";
    box.querySelector("[data-ne=day]").textContent = pick.date.getDate();
    box.querySelector("[data-ne=month]").textContent = mois[pick.date.getMonth()];
    box.querySelector("[data-ne=wd]").textContent = jours[pick.date.getDay()];
    box.querySelector("[data-ne=title]").textContent = pick.titre;
    box.querySelector("[data-ne=when]").textContent = when;
    box.querySelector("[data-ne=time]").textContent = pick.heure;
    box.querySelector("[data-ne=place]").textContent = pick.lieu;
    box.querySelector("[data-ne=details]").textContent = pick.details;
    if (special && pick === regular) {
      var more = box.querySelector("[data-ne=special]");
      if (more) more.textContent = "Ensuite : " + special.titre + " le " + special.date.getDate() + " " + mois[special.date.getMonth()];
    }
  }

  /* ---- Galerie : filtres + visionneuse ---- */
  var filters = doc.querySelectorAll(".filters button");
  var albums = doc.querySelectorAll(".album");
  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      filters.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      albums.forEach(function (a) { a.hidden = !(f === "all" || a.getAttribute("data-album") === f); });
    });
  });
  var lb = doc.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p");
    var items = [], idx = 0, lastFocus = null;
    function collect() {
      items = Array.prototype.slice.call(doc.querySelectorAll(".album:not([hidden]) .thumbs button"));
    }
    function show(i) {
      idx = (i + items.length) % items.length;
      var b = items[idx], im = b.querySelector("img");
      lbImg.src = b.getAttribute("data-full") || im.src;
      lbImg.alt = im.alt;
      lbCap.textContent = b.getAttribute("data-cap") || im.alt;
    }
    function open(b) {
      collect(); lastFocus = b; show(items.indexOf(b));
      lb.classList.add("open"); doc.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    }
    function close() { lb.classList.remove("open"); doc.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    doc.querySelectorAll(".thumbs button").forEach(function (b) { b.addEventListener("click", function () { open(b); }); });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Formulaire : sujet pré-rempli (?sujet=cours) ---- */
  var sujet = doc.getElementById("sujet");
  if (sujet) {
    var m = /[?&]sujet=([a-z]+)/.exec(window.location.search);
    if (m) {
      Array.prototype.forEach.call(sujet.options, function (o) { if (o.getAttribute("data-key") === m[1]) sujet.value = o.value; });
    }
  }
})();
