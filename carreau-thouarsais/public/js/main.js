/* Le Carreau Thouarsais — comportements communs (menu, animations, calendrier, galerie, formulaire) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function icon(n) { return '<svg aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; }

  /* ---------- Menu burger + en-tête ---------- */
  var header = $(".site-header"), burger = $(".burger"), nav = $("#menu");
  function setMenu(open) {
    if (!burger || !nav) return;
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector(".sr").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
    document.body.classList.toggle("menu-open", open);
  }
  if (burger && nav) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); burger.focus(); } });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1260) setMenu(false); });
  }
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Taille du texte (confort de lecture) ---------- */
  var sizeBtn = $(".size-btn");
  function applySize(n) { document.documentElement.setAttribute("data-text", String(n)); if (sizeBtn) sizeBtn.setAttribute("aria-label", n < 2 ? "Agrandir le texte" : "Revenir à la taille normale du texte"); }
  var saved = parseInt(store.get("carreau-text") || "0", 10) || 0; applySize(saved);
  if (sizeBtn) sizeBtn.addEventListener("click", function () {
    var cur = parseInt(document.documentElement.getAttribute("data-text") || "0", 10);
    var next = (cur + 1) % 3; applySize(next); store.set("carreau-text", next);
  });

  /* ---------- Apparition au défilement ---------- */
  function initReveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduced) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e, i) {
      if (!e.style.getPropertyValue("--d")) { var sib = e.parentElement ? $$(":scope > .reveal", e.parentElement).indexOf(e) : 0; if (sib > 0) e.style.setProperty("--d", Math.min(sib, 6) * 0.09 + "s"); }
      io.observe(e);
    });
  }

  /* ---------- Compteurs animés ---------- */
  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length) return;
    function fmt(n) { return Math.round(n).toLocaleString("fr-FR"); }
    function run(el) {
      var end = parseFloat(el.getAttribute("data-count")), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "";
      if (reduced) { el.textContent = pre + fmt(end) + suf; return; }
      var t0 = null, dur = 1900;
      (function frame(t) {
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(2, -10 * p);
        el.textContent = pre + fmt(end * (p >= 1 ? 1 : e)) + suf;
        if (p < 1) requestAnimationFrame(frame);
      })(performance.now());
    }
    els.forEach(function (el) { el.textContent = (el.getAttribute("data-prefix") || "") + "0" + (el.getAttribute("data-suffix") || ""); });
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Héros : boules qui roulent ---------- */
  var hc = $("#hero-canvas");
  if (hc && window.CarreauScene) {
    var hs = new CarreauScene(hc, {
      mode: "hero", scale: 0.036,
      target: function (w, h) { return w < 760 ? { x: w * 0.64, y: h * 0.8 } : { x: w * 0.7, y: h * 0.63 }; },
      origin: function (w, h) { return { x: -80, y: h * 1.04 }; }
    });
    var hero = $(".hero");
    hero.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      var r = hc.getBoundingClientRect(); hs.userThrow(e.clientX - r.left, e.clientY - r.top);
    });
  }

  /* ---------- Démo « Le carreau » ---------- */
  var dc = $("#demo-canvas");
  if (dc && window.CarreauScene) {
    var tag = $(".carreau-tag"), shootBtn = $("#demo-shoot"), replayBtn = $("#demo-replay"), msg = $("#demo-msg");
    var demo = new CarreauScene(dc, {
      mode: "demo", scale: 0.07,
      target: function (w, h) { return { x: w * 0.66, y: h * 0.5 }; },
      origin: function (w, h) { return { x: -50, y: h * 1.05 }; },
      onThrow: function () { shootBtn.disabled = true; msg.textContent = "La boule est lancée…"; },
      onCarreau: function () { tag.classList.remove("show"); void tag.offsetWidth; tag.classList.add("show"); msg.textContent = "Carreau ! La boule a pris la place de l'autre."; shootBtn.hidden = true; replayBtn.hidden = false; replayBtn.focus({ preventScroll: true }); },
      onMiss: function () { msg.textContent = "Presque ! Rejouez pour réussir le carreau."; shootBtn.hidden = true; replayBtn.hidden = false; },
      onReset: function () { shootBtn.hidden = false; shootBtn.disabled = false; replayBtn.hidden = true; msg.textContent = "Visez la boule adverse, juste devant le cochonnet."; tag.classList.remove("show"); }
    });
    shootBtn.addEventListener("click", function () { demo.shoot(); });
    dc.addEventListener("pointerdown", function () { if (!shootBtn.hidden && !shootBtn.disabled) demo.shoot(); });
    replayBtn.addEventListener("click", function () { demo.restart(); shootBtn.focus({ preventScroll: true }); });
  }

  /* ---------- Calendrier ---------- */
  var EV = (window.CARREAU_EVENTS || []).slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  function parse(d) { var p = d.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var today = new Date(); today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  var upcoming = EV.filter(function (e) { return parse(e.date) >= today; });
  var fWd = new Intl.DateTimeFormat("fr-FR", { weekday: "long" });
  var fLong = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fMon = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  var fMonL = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
  function when(e) { var days = Math.round((parse(e.date) - today) / 864e5); return days === 0 ? "aujourd'hui" : days === 1 ? "demain" : "dans " + days + " jours"; }
  function stamp(e) {
    var d = parse(e.date);
    return '<div class="stamp" aria-hidden="true"><span class="d">' + String(d.getDate()).padStart(2, "0") + '</span><span class="m">' + esc(fMon.format(d).replace(".", "")) + '</span><span class="y">' + d.getFullYear() + "</span></div>";
  }
  function metaHTML(e) {
    return '<span>' + icon("clock") + esc(e.time ? e.time : "Horaires à confirmer") + "</span>" +
      '<span>' + icon("pin") + esc(e.place ? e.place : "Lieu à confirmer") + "</span>";
  }
  function inscription(e) {
    return "licence-contact.html?sujet=" + (e.kind === "concours" ? "concours" : "autre") + "&evenement=" + encodeURIComponent(e.title + " — " + fLong.format(parse(e.date))) + "#formulaire";
  }

  var nextBox = $("#next-event");
  if (nextBox) {
    var nxt = upcoming.filter(function (e) { return e.kind === "concours"; })[0];
    if (nxt) {
      nextBox.innerHTML =
        '<div class="next-card">' + stamp(nxt) +
        '<div class="next-body"><h2>' + esc(nxt.title) + '</h2>' +
        '<p><time datetime="' + nxt.date + '">' + esc(fLong.format(parse(nxt.date))) + '</time><span class="countdown">' + when(nxt) + "</span></p>" +
        '<div class="next-meta">' + metaHTML(nxt) + "</div></div>" +
        '<div class="btns" style="margin:0"><a class="btn btn-red" href="' + inscription(nxt) + '">Se renseigner</a><a class="btn btn-line" href="concours-calendrier.html">Tout le calendrier</a></div></div>';
    }
    var ag = upcoming.filter(function (e) { return e.kind === "club" && /générale/i.test(e.title) && (parse(e.date) - today) / 864e5 <= 21; })[0];
    if (ag) nextBox.innerHTML += '<div class="alert-ag"><strong>' + esc(ag.title) + '</strong><span>' + esc(fLong.format(parse(ag.date))) + " · " + esc(ag.time) + " · " + esc(ag.place) + "</span></div>";
  }

  var list = $("#events");
  if (list) {
    var active = "all";
    function card(e) {
      var tags = '<span class="tag' + (e.kind === "club" ? " t-club" : "") + '">' + esc(e.format) + "</span>" +
        (e.officiel ? '<span class="tag t-off">Officiel</span>' : "") + (e.solidaire ? '<span class="tag t-sol">Solidaire</span>' : "");
      var img = e.img ? '<img class="ev-img' + (e.wide ? " wide" : "") + '" src="img/' + esc(e.img) + '" alt="" loading="lazy" width="190" height="190">' : "<span></span>";
      return '<article class="ev reveal" data-kind="' + e.kind + '">' + stamp(e) +
        '<div><div class="ev-wd">' + esc(fWd.format(parse(e.date))) + " · " + when(e) + '</div><div class="tags">' + tags + "</div><h3>" + esc(e.title) + "</h3>" +
        '<div class="ev-meta">' + metaHTML(e) + "</div><p>" + esc(e.desc) + '</p><a class="btn btn-sm btn-red" href="' + inscription(e) + '">' + (e.kind === "concours" ? "S'inscrire / se renseigner" : "Nous contacter") + "</a></div>" + img + "</article>";
    }
    function draw() {
      var items = upcoming.filter(function (e) { return active === "all" || e.kind === active; }), html = "", cur = "";
      if (!items.length) html = '<p class="note wait">Aucun rendez-vous à venir dans cette catégorie pour le moment. Revenez bientôt, ou <a href="licence-contact.html">contactez le club</a>.</p>';
      items.forEach(function (e) {
        var m = fMonL.format(parse(e.date));
        if (m !== cur) { cur = m; html += '<h2 class="month">' + esc(m) + "</h2>"; }
        html += card(e);
      });
      list.innerHTML = html; initReveal();
    }
    $$(".chip[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () {
        active = b.getAttribute("data-filter");
        $$(".chip[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        draw();
      });
    });
    draw();
  }

  /* ---------- Galerie : filtres + visionneuse ---------- */
  var shots = $$(".shot");
  if (shots.length) {
    var filter = "all";
    function visible() { return shots.filter(function (s) { return !s.hidden; }); }
    $$(".chip[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-cat");
        $$(".chip[data-cat]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        shots.forEach(function (s) { s.hidden = !(filter === "all" || s.getAttribute("data-cat") === filter); });
        var empty = $("#gallery-empty"); if (empty) empty.hidden = !(filter === "concours");
        var grid = $(".masonry"); if (grid) grid.hidden = (filter === "concours");
      });
    });
    var dlg = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-cap"), idx = 0, list2 = [];
    function show(i) {
      idx = (i + list2.length) % list2.length; var s = list2[idx], im = $("img", s);
      img.src = s.getAttribute("data-full") || im.src; img.alt = im.alt;
      cap.textContent = s.getAttribute("data-caption") || im.alt; $("#lb-count").textContent = (idx + 1) + " / " + list2.length;
    }
    shots.forEach(function (s) {
      s.addEventListener("click", function () { list2 = visible(); show(list2.indexOf(s)); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
    });
    $("#lb-prev").addEventListener("click", function () { show(idx - 1); });
    $("#lb-next").addEventListener("click", function () { show(idx + 1); });
    $("#lb-close").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("lb-stage")) dlg.close(); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    var sx = null;
    dlg.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* ---------- Formulaire : pré-remplissage depuis l'URL ---------- */
  var form = $("#contact-form");
  if (form) {
    var q = new URLSearchParams(location.search), sujet = q.get("sujet"), evt = q.get("evenement");
    if (sujet && form.elements.sujet) { Array.prototype.forEach.call(form.elements.sujet.options, function (o) { if (o.getAttribute("data-key") === sujet) form.elements.sujet.value = o.value; }); }
    if (evt && form.elements.message && !form.elements.message.value) form.elements.message.value = "Bonjour, je souhaite m'inscrire / me renseigner pour : " + evt + ".\n\n";
  }

  /* ---------- Carte : chargée au clic (respect de la vie privée) ---------- */
  $$("[data-map]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".mapbox"), f = document.createElement("iframe");
      f.src = btn.getAttribute("data-map"); f.title = btn.getAttribute("data-title") || "Plan"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade"; f.allowFullscreen = true;
      box.appendChild(f); $$("[data-hide]", box).forEach(function (n) { n.hidden = true; });
    });
  });

  /* ---------- Divers ---------- */
  $$(".js-year").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  var fade = $$(".fade-in"); fade.forEach(function (n, i) { n.style.animationDelay = (0.35 + i * 0.12) + "s"; });
  initReveal(); initCounters();
})();
