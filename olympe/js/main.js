(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- En-tête : état au défilement ---- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu burger ---- */
  const burger = $(".burger");
  const nav = $("#menu");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }
  };
  if (burger && nav) {
    burger.addEventListener("click", () => setNav(!document.body.classList.contains("nav-open")));
    $$("a", nav).forEach((a) => a.addEventListener("click", () => setNav(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });
    window.matchMedia("(min-width: 981px)").addEventListener("change", () => setNav(false));
  }

  /* ---- Étoiles scintillantes (décor) ---- */
  $$(".stars").forEach((box) => {
    if (reduceMotion) return;
    const n = parseInt(box.dataset.stars || "28", 10);
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.className = "star";
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
        `--s:${(6 + Math.random() * 14).toFixed(1)}px;--d:${(3 + Math.random() * 5).toFixed(1)}s;` +
        `--delay:${(Math.random() * 6).toFixed(1)}s;--o:${(0.35 + Math.random() * 0.65).toFixed(2)}`;
      box.appendChild(s);
    }
  });

  /* ---- Titre du héro lettre par lettre ---- */
  const title = $("[data-letters]");
  if (title) {
    const text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.textContent = "";
    [...text].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch"; s.setAttribute("aria-hidden", "true"); s.style.setProperty("--i", i); s.textContent = c;
      title.appendChild(s);
    });
  }

  /* ---- Apparition au défilement ---- */
  const reveals = $$(".reveal");
  $$("[data-stagger]").forEach((group) => {
    $$(".reveal", group).forEach((el, i) => el.style.setProperty("--delay", `${i * 110}ms`));
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Compteurs animés ---- */
  const counters = $$("[data-count]");
  const run = (el) => {
    const end = parseInt(el.dataset.count, 10);
    if (reduceMotion) { el.textContent = end; return; }
    const dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach(run);

  /* ---- Galerie : filtres + lightbox ---- */
  const grid = $("#gallery");
  if (grid) {
    const shots = $$(".shot", grid);
    const chips = $$(".chip[data-filter]");
    chips.forEach((chip) => chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      const f = chip.dataset.filter;
      shots.forEach((s) => { s.hidden = !(f === "all" || s.dataset.cat === f); });
    }));

    const dlg = $("#lightbox");
    const img = $("img", dlg), cap = $(".lb-cap", dlg);
    let idx = 0;
    const visible = () => shots.filter((s) => !s.hidden);
    const show = (i) => {
      const list = visible();
      idx = (i + list.length) % list.length;
      const s = list[idx];
      img.src = s.dataset.full; img.alt = $("img", s).alt; cap.textContent = $("figcaption", s).textContent;
    };
    shots.forEach((s) => s.addEventListener("click", () => {
      show(visible().indexOf(s));
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    }));
    $(".lb-close", dlg).addEventListener("click", () => dlg.close());
    $(".lb-prev", dlg).addEventListener("click", () => show(idx - 1));
    $(".lb-next", dlg).addEventListener("click", () => show(idx + 1));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Année du pied de page ---- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
