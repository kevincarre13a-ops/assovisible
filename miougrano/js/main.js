/* La Miougrano de Fréjus — scripts communs (sans dépendance) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- En-tête : fond au défilement ---- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Menu burger ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  function closeNav() {
    document.body.classList.remove("nav-open");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Ouvrir le menu"); }
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("nav-open")) { closeNav(); toggle.focus(); } });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1380) closeNav(); });
  }

  /* ---- Apparitions douces ---- */
  var revealEls = document.querySelectorAll(".reveal,.reveal-l,.reveal-r");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Héro : diaporama ---- */
  var slides = document.querySelectorAll(".hero-slides figure");
  var dots = document.querySelectorAll(".hero-dots button");
  if (slides.length > 1) {
    var cur = 0, timer;
    var go = function (n) {
      slides[cur].classList.remove("active"); if (dots[cur]) dots[cur].removeAttribute("aria-current");
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add("active"); if (dots[cur]) dots[cur].setAttribute("aria-current", "true");
    };
    var play = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 6500); };
    dots.forEach(function (d, i) { d.addEventListener("click", function () { go(i); play(); }); });
    play();
  }

  /* ---- Graines / étincelles du héro ---- */
  var sp = document.querySelector(".sparkles");
  if (sp && !reduce) {
    for (var i = 0; i < 22; i++) {
      var s = document.createElement("i");
      s.style.left = (Math.random() * 100) + "%";
      s.style.animationDuration = (9 + Math.random() * 12) + "s";
      s.style.animationDelay = (-Math.random() * 20) + "s";
      sp.appendChild(s);
    }
  }

  /* ---- Compte à rebours Foire aux santons ---- */
  document.querySelectorAll("[data-countdown]").forEach(function (box) {
    var start = new Date(box.getAttribute("data-start")).getTime();
    var end = new Date(box.getAttribute("data-end")).getTime();
    var status = box.querySelector(".cd-status");
    var units = { d: box.querySelector("[data-u=d]"), h: box.querySelector("[data-u=h]"), m: box.querySelector("[data-u=m]"), s: box.querySelector("[data-u=s]") };
    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function tick() {
      var now = Date.now();
      if (now >= start && now <= end) {
        box.classList.add("is-open");
        if (status) status.textContent = "✨ La foire est ouverte ! Entrée libre, salle Riculphe.";
        ["d", "h", "m", "s"].forEach(function (k) { if (units[k]) units[k].textContent = "--"; });
        return;
      }
      if (now > end) {
        if (status) status.textContent = "La prochaine édition sera annoncée bientôt — restez à l'écoute !";
        ["d", "h", "m", "s"].forEach(function (k) { if (units[k]) units[k].textContent = "00"; });
        return;
      }
      var diff = Math.max(0, start - now);
      var d = Math.floor(diff / 864e5), h = Math.floor(diff % 864e5 / 36e5), m = Math.floor(diff % 36e5 / 6e4), s = Math.floor(diff % 6e4 / 1e3);
      if (units.d) units.d.textContent = d; if (units.h) units.h.textContent = pad(h);
      if (units.m) units.m.textContent = pad(m); if (units.s) units.s.textContent = pad(s);
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---- Santons qui se retournent (tactile / clavier) ---- */
  document.querySelectorAll(".flip").forEach(function (f) {
    f.addEventListener("click", function () {
      var on = f.classList.toggle("flipped");
      f.setAttribute("aria-pressed", on ? "true" : "false");
    });
  });

  /* ---- Carrousels ---- */
  document.querySelectorAll(".carousel").forEach(function (c) {
    var track = c.querySelector(".carousel-track");
    var scope = c.closest("section") || c;
    var prev = scope.querySelector("[data-dir=prev]"), next = scope.querySelector("[data-dir=next]");
    function step() { var it = track.querySelector(".carousel-item"); return it ? it.getBoundingClientRect().width + 20 : 300; }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  });

  /* ---- Galerie : filtres + visionneuse ---- */
  var gal = document.querySelector(".masonry");
  if (gal) {
    var figs = Array.prototype.slice.call(gal.querySelectorAll("figure"));
    document.querySelectorAll(".filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        var f = b.getAttribute("data-filter");
        figs.forEach(function (fig) { fig.classList.toggle("hide", f !== "all" && fig.getAttribute("data-cat") !== f); });
      });
    });
    var lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), idx = 0, lastFocus;
    function visible() { return figs.filter(function (f) { return !f.classList.contains("hide"); }); }
    function show(i) {
      var v = visible(); idx = (i + v.length) % v.length;
      var img = v[idx].querySelector("img");
      lbImg.src = img.getAttribute("data-full") || img.src; lbImg.alt = img.alt;
      lbCap.textContent = v[idx].querySelector("figcaption") ? v[idx].querySelector("figcaption").textContent : "";
    }
    figs.forEach(function (fig) {
      fig.querySelector("button").addEventListener("click", function () {
        lastFocus = document.activeElement; show(visible().indexOf(fig));
        lb.classList.add("open"); lb.querySelector(".lb-close").focus();
      });
    });
    function close() { lb.classList.remove("open"); if (lastFocus) lastFocus.focus(); }
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Année du pied de page ---- */
  document.querySelectorAll("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
