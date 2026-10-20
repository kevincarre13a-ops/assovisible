/* Tetraktys — interactions du site (aucune dépendance) */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.add("js");

  /* ---------- En-tête : ombre au défilement + menu burger ---------- */
  var header = document.querySelector(".site-header");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("menu");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger && nav) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1140) setMenu(false); });
  }

  /* ---------- Apparition au défilement ---------- */
  var revealEls = [].slice.call(document.querySelectorAll(".reveal"));
  [].forEach.call(document.querySelectorAll(".stagger"), function (g) {
    [].forEach.call(g.children, function (c, i) { c.classList.add("reveal"); c.style.setProperty("--d", (i * 0.09).toFixed(2) + "s"); revealEls.push(c); });
  });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- Compteurs animés ---------- */
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  function runCounter(el) {
    var end = parseInt(el.getAttribute("data-count"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    if (reduce) { el.textContent = prefix + end; return; }
    var dur = 1800, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(end * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { c.textContent = (c.getAttribute("data-prefix") || "") + "0"; co.observe(c); });
    } else { counters.forEach(runCounter); }
  }

  /* ---------- Année du pied de page ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Filtres de l'agenda ---------- */
  var chips = [].slice.call(document.querySelectorAll("[data-filter]"));
  var items = [].slice.call(document.querySelectorAll("[data-cat]"));
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      items.forEach(function (it) { it.hidden = !(f === "all" || it.getAttribute("data-cat").split(" ").indexOf(f) > -1); });
    });
  });

  /* ---------- Galerie : visionneuse ---------- */
  var dlg = document.querySelector("dialog.lightbox");
  if (dlg) {
    var dImg = dlg.querySelector("img"), dCap = dlg.querySelector("p"), cur = 0, list = [];
    var figs = [].slice.call(document.querySelectorAll(".gallery figure"));
    var show = function (i) {
      list = figs.filter(function (f) { return !f.hidden; });
      cur = (i + list.length) % list.length;
      var b = list[cur].querySelector("button");
      dImg.src = b.getAttribute("data-full");
      dImg.alt = b.getAttribute("data-alt");
      dCap.textContent = b.getAttribute("data-cap");
    };
    figs.forEach(function (f) {
      f.querySelector("button").addEventListener("click", function () {
        list = figs.filter(function (x) { return !x.hidden; });
        show(list.indexOf(f));
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      });
    });
    dlg.querySelector(".lightbox__prev").addEventListener("click", function () { show(cur - 1); });
    dlg.querySelector(".lightbox__next").addEventListener("click", function () { show(cur + 1); });
    dlg.querySelector(".lightbox__close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("lightbox__inner")) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  }

  /* ---------- Tétraktys sonore : octave, quinte, quarte ---------- */
  var tkFig = document.querySelector(".tkplay__fig");
  var intervalBtns = [].slice.call(document.querySelectorAll(".intervals button"));
  if (tkFig && intervalBtns.length) {
    var ac = null;
    var BASE = 220;
    var play = function (a, b, rows, btn) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = ac || new AC();
      if (ac.state === "suspended") ac.resume();
      var now = ac.currentTime;
      var master = ac.createGain();
      master.gain.value = 0.22;
      master.connect(ac.destination);
      [[a, 0], [b, 0.9]].forEach(function (n) {
        var f = BASE * n[0] / a;
        [["sine", 1], ["triangle", 0.35]].forEach(function (w) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = w[0]; o.frequency.value = f;
          var t = now + n[1];
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(w[1], t + 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);
          o.connect(g); g.connect(master);
          o.start(t); o.stop(now + 3.2);
        });
      });
      intervalBtns.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      tkFig.className = tkFig.className.replace(/\bglow-\d\b/g, "").trim();
      rows.forEach(function (r) { tkFig.classList.add("glow-" + r); });
      setTimeout(function () {
        btn.setAttribute("aria-pressed", "false");
        rows.forEach(function (r) { tkFig.classList.remove("glow-" + r); });
      }, 3100);
    };
    intervalBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = parseFloat(btn.getAttribute("data-a")), b = parseFloat(btn.getAttribute("data-b"));
        // le rapport b:a avec a la fondamentale (ex. 3:2 -> quinte)
        play(b > a ? a : b, b > a ? b : a, btn.getAttribute("data-rows").split(",").map(Number), btn);
      });
    });
  }

  /* ---------- Héros : dix points → triangle → nom ---------- */
  var hero = document.querySelector(".hero");
  if (!hero) return;
  var canvas = hero.querySelector(".hero__canvas");
  var title = hero.querySelector(".hero__title");
  var replayBtn = hero.querySelector(".hero__replay");
  var failsafe = setTimeout(function () { hero.classList.add("formed"); }, 9000);
  function finish() { clearTimeout(failsafe); hero.classList.add("formed"); }
  if (reduce || !canvas || !canvas.getContext) { finish(); return; }

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, dpr = 1, parts = [], tri = [], edges = [];
  var t0 = 0, raf = 0, onScreen = true, ready = false, formedFlag = false;
  var isSmall = function () { return window.innerWidth < 700; };

  var ease = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var easeOut = function (p) { return 1 - Math.pow(1 - p, 3); };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var hr = hero.getBoundingClientRect();
    W = hr.width; H = hr.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var tr = title.getBoundingClientRect();
    var cx = tr.left - hr.left + tr.width / 2;
    var cy = tr.top - hr.top + tr.height / 2;
    var cs = getComputedStyle(title);
    var fs = parseFloat(cs.fontSize);

    /* cibles : échantillonnage des lettres du titre */
    var off = document.createElement("canvas");
    off.width = Math.ceil(tr.width + 40); off.height = Math.ceil(tr.height + 40);
    var o = off.getContext("2d");
    o.fillStyle = "#fff";
    o.font = cs.fontWeight + " " + fs + "px " + cs.fontFamily;
    o.textBaseline = "alphabetic";
    [].forEach.call(title.querySelectorAll(".ch"), function (ch) {
      var r = ch.getBoundingClientRect();
      var m = o.measureText(ch.textContent);
      var asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
      var base = (asc && desc) ? (r.top - tr.top) + 20 + (r.height - (asc + desc)) / 2 + asc : (r.top - tr.top) + 20 + fs * 0.82;
      o.fillText(ch.textContent, r.left - tr.left + 20, base);
    });
    var data = o.getImageData(0, 0, off.width, off.height).data;
    var step = Math.max(3, Math.round(fs / 24));
    var pts = [];
    for (var yy = 0; yy < off.height; yy += step) {
      for (var xx = 0; xx < off.width; xx += step) {
        if (data[(yy * off.width + xx) * 4 + 3] > 140) pts.push([xx - 20 + tr.left - hr.left, yy - 20 + tr.top - hr.top]);
      }
    }
    for (var i = pts.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0; var t = pts[i]; pts[i] = pts[j]; pts[j] = t; }
    var N = Math.min(pts.length, isSmall() ? 650 : 1250);
    pts = pts.slice(0, N);
    var minX = Infinity, maxX = -Infinity;
    pts.forEach(function (p) { if (p[0] < minX) minX = p[0]; if (p[0] > maxX) maxX = p[0]; });

    /* le triangle de dix points */
    var Ht = Math.min(H * 0.4, isSmall() ? 190 : 300), Wt = Ht * 1.16;
    tri = []; edges = [];
    for (var r = 0; r < 4; r++) for (var k = 0; k <= r; k++) {
      tri.push({ r: r, k: k, x: cx + (k - r / 2) * (Wt / 3), y: cy - Ht / 2 + r * (Ht / 3) });
    }
    var idx = function (r, k) { return r * (r + 1) / 2 + k; };
    for (var r2 = 0; r2 < 4; r2++) for (var k2 = 0; k2 <= r2; k2++) {
      if (k2 < r2) edges.push([idx(r2, k2), idx(r2, k2 + 1)]);
      if (r2 < 3) { edges.push([idx(r2, k2), idx(r2 + 1, k2)]); edges.push([idx(r2, k2), idx(r2 + 1, k2 + 1)]); }
    }

    parts = pts.map(function (p, n) {
      var c = tri[n % 10];
      var a = Math.random() * Math.PI * 2, rad = Math.pow(Math.random(), 0.7) * (isSmall() ? 9 : 13);
      var edge = Math.random();
      return {
        sx: Math.random() * W, sy: edge < 0.5 ? (Math.random() < 0.5 ? -20 : H + 20) : Math.random() * H,
        cx: c.x + Math.cos(a) * rad, cy: c.y + Math.sin(a) * rad,
        tx: p[0], ty: p[1],
        d1: Math.random() * 0.45,
        d3: ((p[0] - minX) / Math.max(1, maxX - minX)) * 0.55 + Math.random() * 0.2,
        size: 0.8 + Math.random() * 1.5, ph: Math.random() * 6.28,
        keep: n % 9 === 0, sw: (Math.random() - 0.5) * 70
      };
    });
    ready = true;
  }

  var T1 = 1500, T2 = 1500, T3 = 2000, TF = 4600;   /* durées des phases (ms) */
  function frame(ts) {
    raf = 0;
    if (!ready) return;
    if (!t0) t0 = ts;
    var t = ts - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    var p1 = clamp(t / T1);
    var tStart2 = T1, tStart3 = T1 + T2;
    var linesA = clamp((t - 700) / 1200) * (1 - clamp((t - tStart3) / 900));

    /* lignes du triangle */
    if (linesA > 0) {
      ctx.strokeStyle = "rgba(243,217,149," + (0.5 * linesA).toFixed(3) + ")";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      edges.forEach(function (e, n) {
        var a = tri[e[0]], b = tri[e[1]];
        var pr = clamp(linesA * 1.4 - (n / edges.length) * 0.4);
        ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x) * pr, a.y + (b.y - a.y) * pr);
      });
      ctx.stroke();
    }

    /* halos des dix points */
    if (t < tStart3 + 500) {
      var halo = clamp(p1) * (1 - clamp((t - tStart3) / 500));
      tri.forEach(function (c, n) {
        var pulse = 1 + 0.12 * Math.sin(t / 260 + n);
        var rad = 26 * pulse * halo + 2;
        var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, rad);
        g.addColorStop(0, "rgba(255,240,200," + (0.95 * halo).toFixed(3) + ")");
        g.addColorStop(0.35, "rgba(227,191,106," + (0.45 * halo).toFixed(3) + ")");
        g.addColorStop(1, "rgba(227,191,106,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, rad, 0, 6.2832); ctx.fill();
      });
    }

    /* particules */
    var fade = clamp((t - TF) / 1100);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], x, y, a = 1, s = p.size;
      if (t < tStart3) {
        var q = easeOut(clamp((t - p.d1 * 600) / (T1 - 200)));
        x = p.sx + (p.cx - p.sx) * q; y = p.sy + (p.cy - p.sy) * q;
        if (t > tStart2) { x += Math.sin(t / 300 + p.ph) * 1.2; y += Math.cos(t / 280 + p.ph) * 1.2; }
        a = 0.25 + 0.75 * q;
      } else {
        var q3 = ease(clamp((t - tStart3 - p.d3 * 900) / (T3 - 700)));
        x = p.cx + (p.tx - p.cx) * q3 + Math.sin(q3 * Math.PI) * p.sw * 0.5;
        y = p.cy + (p.ty - p.cy) * q3 - Math.sin(q3 * Math.PI) * Math.abs(p.sw) * 0.6;
        if (p.keep) { a = 1 - 0.65 * fade; x += Math.sin(t / 1400 + p.ph) * 5 * fade; y += Math.cos(t / 1700 + p.ph) * 5 * fade; }
        else a = 1 - fade;
      }
      if (a <= 0.01) continue;
      ctx.fillStyle = "rgba(243,217,149," + a.toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, y, s, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    if (!formedFlag && t > TF - 500) { formedFlag = true; finish(); }
    /* après la fin : seules les étoiles « keep » vivent, on ralentit la boucle */
    if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    t0 = 0; formedFlag = false;
    hero.classList.remove("formed");
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function kick() { if (!raf && onScreen && !document.hidden && ready) raf = requestAnimationFrame(frame); }

  var begin = function () { try { build(); start(); } catch (e) { finish(); } };
  var fontsReady = (document.fonts && document.fonts.load)
    ? Promise.race([document.fonts.load('700 80px "Cormorant Garamond"'), new Promise(function (r) { setTimeout(r, 1800); })])
    : Promise.resolve();
  fontsReady.then(function () { requestAnimationFrame(begin); });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; kick(); }, { threshold: 0.05 }).observe(hero);
  }
  document.addEventListener("visibilitychange", kick);
  var rz;
  window.addEventListener("resize", function () {
    clearTimeout(rz);
    rz = setTimeout(function () {
      if (!ready) return;
      var elapsed = t0 ? performance.now() - t0 : 0;
      build();
      if (formedFlag) { t0 = performance.now() - (TF + 1500); } else { t0 = performance.now() - elapsed; }
      kick();
    }, 200);
  });
  if (replayBtn) replayBtn.addEventListener("click", function () { if (ready) { build(); start(); } });
})();
