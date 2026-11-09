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

  /* ---- Sous-menus : accordéon (mobile) ou liste déroulante (bureau) ---- */
  var desktop = window.matchMedia("(min-width:1340px)");
  doc.querySelectorAll(".sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = btn.closest(".has-sub");
      var cls = desktop.matches ? "dd-open" : "open";
      var open = !li.classList.contains(cls);
      doc.querySelectorAll(".has-sub.dd-open").forEach(function (x) { if (x !== li) x.classList.remove("dd-open"); });
      li.classList.toggle(cls, open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  doc.addEventListener("click", function () { doc.querySelectorAll(".has-sub.dd-open").forEach(function (x) { x.classList.remove("dd-open"); }); });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") doc.querySelectorAll(".has-sub.dd-open").forEach(function (x) { x.classList.remove("dd-open"); });
  });

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


  /* ---- Actualités : « À l'affiche » (2 mois maximum) / « Archives récentes » ---- */
  var boxA = doc.querySelector("#a-l-affiche .news"), boxB = doc.querySelector("#archives .news");
  if (boxA && boxB) {
    var items = Array.prototype.slice.call(doc.querySelectorAll(".news-item"));
    var nowD = new Date();
    items.forEach(function (el) {
      var d = el.getAttribute("data-date"), recent = true;
      if (d) { var q = d.split("-"); recent = (nowD - new Date(+q[0], +q[1] - 1, +q[2])) / 86400000 <= 62; }
      (recent ? boxA : boxB).appendChild(el);
    });
    [boxA, boxB].forEach(function (b) { var n = b.parentNode.querySelector(".empty-note"); if (n) n.hidden = b.children.length > 0; });
  }

  /* ---- Agenda : calendrier du mois + prochains rendez-vous ---- */
  var cal = doc.getElementById("agenda-cal");
  if (cal) {
    var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    var evs = (window.CLUB_EVENTS || []).map(function (e) { var p = e.date.split("-"); return { d: new Date(+p[0], +p[1] - 1, +p[2]), e: e }; });
    var t0 = new Date(); t0 = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate());
    var view = new Date(t0.getFullYear(), t0.getMonth(), 1);
    var same = function (a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); };
    var draw = function () {
      var y = view.getFullYear(), m = view.getMonth();
      var first = new Date(y, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      var html = '<div class="cal-head"><button type="button" data-n="-1" aria-label="Mois précédent">‹</button><h3>' + MOIS[m] + " " + y +
        '</h3><button type="button" data-n="1" aria-label="Mois suivant">›</button></div><table><thead><tr>';
      JOURS.forEach(function (j) { html += '<th scope="col" abbr="' + j + '">' + j.slice(0, 3) + ".</th>"; });
      html += "</tr></thead><tbody><tr>";
      for (var i = 0; i < lead; i++) html += "<td></td>";
      for (var d = 1; d <= days; d++) {
        var dt = new Date(y, m, d), wd = dt.getDay(), cls = [], label = d + " " + MOIS[m];
        var ev = evs.filter(function (x) { return same(x.d, dt); })[0];
        if (wd === 1 || wd === 3) { cls.push("ronde"); label += " : Ronde de France, 13 h 45"; }
        if (ev) { cls.push("ev"); label += " : " + ev.e.titre; }
        if (same(dt, t0)) cls.push("today");
        html += '<td class="' + cls.join(" ") + '"><span' + (cls.length ? ' title="' + label + '" aria-label="' + label + '"' : "") + ">" + d + "</span></td>";
        if ((lead + d) % 7 === 0 && d < days) html += "</tr><tr>";
      }
      html += "</tr></tbody></table>";
      cal.innerHTML = html;
      cal.querySelectorAll(".cal-head button").forEach(function (b) {
        b.addEventListener("click", function () { view = new Date(y, m + (+b.getAttribute("data-n")), 1); draw(); });
      });
    };
    draw();
    var list = doc.getElementById("agenda-list"), empty = doc.getElementById("agenda-empty");
    var up = evs.filter(function (x) { return x.d >= t0; }).sort(function (a, b) { return a.d - b.d; });
    up.forEach(function (x) {
      var li = doc.createElement("li");
      li.innerHTML = "<strong></strong> <span></span>";
      li.firstChild.textContent = JOURS[(x.d.getDay() + 6) % 7] + " " + x.d.getDate() + " " + MOIS[x.d.getMonth()];
      li.lastChild.textContent = (x.e.heure ? ", " + x.e.heure : "") + " : " + x.e.titre + (x.e.lieu ? " — " + x.e.lieu : "") + (x.e.details ? ". " + x.e.details : "");
      list.insertBefore(li, list.firstChild);
    });
    if (empty) empty.hidden = up.length > 0;
  }

  /* ---- Défilement de photos (accueil) ---- */
  var slider = doc.getElementById("slider");
  if (slider) {
    var slides = slider.querySelectorAll(".slide"), dotsBox = slider.querySelector(".s-dots"), cur = 0, timer = null, paused = reduce;
    var dots = [];
    slides.forEach(function (_, i) { var d = doc.createElement("i"); dotsBox.appendChild(d); dots.push(d); });
    var go = function (n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (sl, i) { sl.classList.toggle("on", i === cur); sl.setAttribute("aria-hidden", i === cur ? "false" : "true"); });
      dots.forEach(function (d, i) { d.classList.toggle("on", i === cur); });
    };
    var play = slider.querySelector(".s-play");
    var start = function () { stop(); if (!paused) timer = setInterval(function () { go(cur + 1); }, 5000); };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    slider.querySelector(".s-prev").addEventListener("click", function () { go(cur - 1); start(); });
    slider.querySelector(".s-next").addEventListener("click", function () { go(cur + 1); start(); });
    play.addEventListener("click", function () {
      paused = !paused; play.setAttribute("aria-pressed", paused ? "true" : "false");
      play.textContent = paused ? "▶" : "❚❚";
      play.setAttribute("aria-label", paused ? "Relancer le défilement" : "Mettre en pause le défilement");
      start();
    });
    slider.addEventListener("mouseenter", stop); slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop); slider.addEventListener("focusout", start);
    if (paused) { play.textContent = "▶"; play.setAttribute("aria-pressed", "true"); play.setAttribute("aria-label", "Relancer le défilement"); }
    go(0); start();
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
