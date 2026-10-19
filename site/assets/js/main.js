// Baie de Douarnenez Environnement — scripts communs
(function () {
  "use strict";

  /* Header: fond au scroll */
  var header = document.querySelector(".site-header");
  var burger = document.querySelector(".burger");
  var mobileNav = document.querySelector(".mobile-nav");

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else if (!header.classList.contains("menu-open")) header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Burger menu */
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      burger.classList.toggle("is-active", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      header.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        burger.classList.remove("is-active");
        header.classList.remove("menu-open");
        document.body.style.overflow = "";
      });
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-open");
        burger.classList.remove("is-active");
        header.classList.remove("menu-open");
        document.body.style.overflow = "";
      }
    });
  }

  /* Reveal au scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--i", i % 6);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Années depuis la création (calcul dynamique) — doit précéder la
     sélection des compteurs ci-dessous pour être inclus dans l'animation */
  document.querySelectorAll("[data-years-since]").forEach(function (el) {
    var since = parseInt(el.getAttribute("data-years-since"), 10);
    var years = new Date().getFullYear() - since;
    el.setAttribute("data-count", years);
  });

  /* Compteurs animés */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toString();
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterIo.observe(el); });
  }

  /* Galerie : filtres */
  var filterBtns = document.querySelectorAll(".gallery-filters button");
  var galleryItems = document.querySelectorAll(".gallery-item");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-filter");
        galleryItems.forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-category") === cat;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Carte simple de la baie (Leaflet) */
  var mapEl = document.getElementById("baie-map");
  if (mapEl && window.L) {
    var map = L.map("baie-map", { scrollWheelZoom: false }).setView([48.168, -4.33], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 17,
    }).addTo(map);

    var waveIcon = L.divIcon({
      className: "bdze-marker",
      html: '<span style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:#0f6184;box-shadow:0 0 0 4px rgba(15,97,132,0.25);color:#fff;font-size:14px;">🌊</span>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    var points = [
      { name: "Douarnenez", lat: 48.0927, lng: -4.333, desc: "Siège historique de l'association, port, plage du Ris." },
      { name: "Telgruc-sur-Mer", lat: 48.227, lng: -4.373, desc: "Rive nord de la baie, presqu'île de Crozon." },
      { name: "Plonévez-Porzay", lat: 48.139, lng: -4.246, desc: "Plage de Kervel, anse de Tréfeuntec — secteur très touché par les algues vertes." },
      { name: "Locronan", lat: 48.0994, lng: -4.2061, desc: "Commune du bassin versant, en amont de la baie." },
      { name: "Crozon", lat: 48.247, lng: -4.491, desc: "Pointe nord de la baie, Parc naturel marin d'Iroise." },
    ];
    points.forEach(function (p) {
      L.marker([p.lat, p.lng], { icon: waveIcon })
        .addTo(map)
        .bindPopup("<strong>" + p.name + "</strong><br>" + p.desc);
    });
  }

  /* Année courante dans le footer */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
