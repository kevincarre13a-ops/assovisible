/* =========================================================
   SIALB — rendu des pages à partir des fichiers de données.
   Aucune liste n'est écrite dans le HTML : tout est lu dans /data/*.json
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Données ---------- */
const cache = new Map();
function getJSON(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url} : ${r.status}`);
        return r.json();
      })
    );
  }
  return cache.get(url);
}

/* ---------- Petits utilitaires DOM ---------- */
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(kid));
  }
  return el;
}

const ICONS = {
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  dl: '<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  go: '<path d="M4 12h16m0 0-6-6m6 6-6 6"/>',
  prev: '<path d="M20 12H4m0 0 6-6m-6 6 6 6"/>',
};
function icon(name) {
  const t = document.createElement("template");
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
  return t.content.firstChild;
}

/* Texte à paragraphes : une ligne vide = nouveau paragraphe, un retour = saut de ligne */
function paragraphs(text, cls) {
  return String(text || "")
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => {
      const lines = p.split("\n");
      const el = h("p", cls ? { class: cls } : null);
      lines.forEach((l, i) => {
        if (i) el.append(document.createElement("br"));
        el.append(l);
      });
      return el;
    });
}

/* Bouton-lien : fichier à télécharger, lien externe ou lien interne */
function lienBtn(lien, { variant = "", fichier = false } = {}) {
  if (!lien || !lien.url) return null;
  const externe = /^https?:\/\//.test(lien.url);
  const pdf = fichier || /\.pdf($|\?)/i.test(lien.url);
  const nouvelle = externe || pdf;
  const a = h("a", {
    class: `btn btn--small ${variant}`.trim(),
    href: lien.url,
    ...(nouvelle ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  });
  a.append(lien.label || "Voir", icon(pdf ? "dl" : externe ? "ext" : "go"));
  if (nouvelle) a.append(h("span", { class: "sr-only", text: " (nouvelle fenêtre)" }));
  return a;
}
const boutons = (...liens) => {
  const bs = liens.flat().filter(Boolean);
  return bs.length ? h("div", { class: "btns" }, bs) : null;
};

const roman = (n) => {
  const m = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let r = "";
  n = Number(n) || 0;
  for (const [v, s] of m) while (n >= v) { r += s; n -= v; }
  return r || "·";
};
const dateFR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parseISO = (s) => {
  const [y, m = 1, d = 1] = String(s).split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* ---------- Révélations douces + « lire la suite » ---------- */
let revealIO;
function observeReveals(root = document) {
  const els = $$("[data-reveal]:not(.in)", root);
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  revealIO ||= new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting || en.boundingClientRect.top < 0) {
          const t = en.target;
          t.classList.add("in");
          revealIO.unobserve(t);
          setTimeout(() => { t.removeAttribute("data-reveal"); t.classList.remove("in"); t.style.removeProperty("--d"); }, 1500);
        }
      }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  els.forEach((e) => revealIO.observe(e));
}
const stagger = (el, i) => {
  el.setAttribute("data-reveal", "");
  el.style.setProperty("--d", i % 6);
  return el;
};

function initClamps(root = document) {
  const run = () =>
    $$(".clamp:not([data-clamp-ready])", root).forEach((el) => {
      if (el.offsetParent === null) return;
      el.dataset.clampReady = "1";
      if (el.scrollHeight <= el.clientHeight + 2) return;
      const id = "t" + Math.random().toString(36).slice(2, 8);
      el.id ||= id;
      const btn = h("button", { class: "more", type: "button", "aria-expanded": "false", "aria-controls": el.id, text: "Lire la suite" });
      btn.addEventListener("click", () => {
        const open = el.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open);
        btn.textContent = open ? "Réduire" : "Lire la suite";
      });
      el.after(btn);
    });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(run));
}
const clampBlock = (text, extra = "") => h("div", { class: `texte clamp ${extra}`.trim() }, paragraphs(text));

/* ---------- En-tête, pied de page, en-tête de page ---------- */
async function buildChrome() {
  const site = await getJSON("data/site.json");
  const page = document.body.dataset.page;

  const brand = (href) =>
    h("a", { class: "brand", href, "aria-label": `${site.sigle} — ${site.nom}, accueil` },
      h("span", { class: "brand__sigle", text: site.sigle }),
      h("span", { class: "brand__nom", text: site.nom }));

  const header = $("#site-header");
  if (header) {
    header.className = "site-header";
    const burger = h("button", { class: "burger", type: "button", "aria-expanded": "false", "aria-controls": "nav-principal", "aria-label": "Ouvrir le menu" },
      h("span"), h("span"), h("span"));
    const nav = h("nav", { class: "nav", id: "nav-principal", "aria-label": "Navigation principale" },
      h("ul", null, site.nav.map((n) =>
        h("li", null, h("a", { href: n.href, ...(n.id === page ? { "aria-current": "page" } : {}), text: n.label })))));
    header.append(h("div", { class: "container site-header__inner" }, brand("index.html"), nav, burger));

    const setMenu = (open) => {
      document.body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };
    burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    nav.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
    addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
    matchMedia("(min-width: 961px)").addEventListener("change", () => setMenu(false));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-solid", scrollY > 24);
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  $$("[data-adhesion]").forEach((a) => { a.href = site.adhesion.url; a.target = "_blank"; a.rel = "noopener noreferrer"; });

  const footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.append(
      h("div", { class: "container" },
        h("div", { class: "footer__grid" },
          h("div", null, brand("index.html"), h("p", { text: site.piedTexte })),
          h("div", null, h("h2", { text: "Naviguer" }),
            h("ul", null, [...site.nav, ...site.pied].map((n) => h("li", null, h("a", { href: n.href, text: n.label }))))),
          h("div", null, h("h2", { text: "Nous écrire" }),
            h("address", null, site.adresse.map((l, i) => [i ? document.createElement("br") : null, l])),
            h("p", { style: "margin-top:1rem" }, h("a", { href: `mailto:${site.email}`, text: site.email })),
            h("p", null, h("a", { href: site.adhesion.url, target: "_blank", rel: "noopener noreferrer", text: site.adhesion.label })))),
        h("div", { class: "footer__bas" }, h("span", { text: site.copyright }),
          h("a", { href: "mentions-legales.html", text: "Mentions légales" })))
    );
  }
}

async function buildPageHead() {
  const el = $("[data-page-head]");
  if (!el) return;
  const pages = await getJSON("data/pages.json");
  const p = pages[document.body.dataset.page];
  if (!p) return;
  const set = (sel, txt) => { const n = $(sel, el); if (n && txt) n.textContent = txt; };
  set(".kicker", p.kicker);
  set("h1", p.titre);
  set(".lead", p.lead);
  const intro = $("[data-intro]");
  if (intro && p.intro) {
    const d = p.intro[0] === "D";
    intro.replaceChildren(d ? h("img", { class: "lettrine", src: "assets/img/gravures/lettrine-d.jpg", alt: "D", width: 270, height: 300 }) : "", d ? p.intro.slice(1) : p.intro);
    const lien = $("[data-intro-lien]");
    if (lien && p.introLien) lien.append(lienBtn(p.introLien, { variant: "btn--ghost" }));
  }
  if (p.image) {
    const bg = $(".page-head__bg", el);
    if (bg) bg.style.backgroundImage = `url("${p.image}")`;
    const img = $(".arch img", el);
    if (img) img.src = p.image;
  }
}

/* ---------- Têtes de listes ---------- */
function headBlock(info, id) {
  if (!info) return null;
  return h("header", { class: "sec-head", "data-reveal": "" },
    h("h2", { id: id ? `${id}-titre` : null, text: info.titre }),
    info.lead ? h("p", { class: "lead", text: info.lead }) : null,
    h("div", { class: "rule", "aria-hidden": "true" }));
}

/* ---------- Mises en page des listes ---------- */
const LAYOUTS = {};

/* Page SIALB : blocs de présentation */
LAYOUTS.blocs = (el, items) => {
  el.append(h("div", { class: "sialb-blocs" }, items.map((b, i) => {
    const large = b.id === "presentation";
    const bloc = h("article", { class: `card bloc${large ? " bloc--large" : ""}` },
      b.image ? h("img", { class: "bloc__logo", src: b.image, alt: "", loading: "lazy" }) : null,
      h("h3", { text: b.titre }),
      paragraphs(b.texte),
      boutons(lienBtn(b.lien, { variant: "btn--ghost" })));
    return stagger(bloc, i);
  })));
};

/* Bureau */
LAYOUTS.bureau = (el, items) => {
  const groupes = [...new Set(items.map((m) => m.groupe || "Bureau"))];
  groupes.forEach((g) => {
    el.append(h("h3", { class: "groupe-titre", text: g }));
    el.append(h("div", { class: "membres" }, items.filter((m) => (m.groupe || "Bureau") === g).map((m, i) => {
      const initiales = m.nom.split(/[\s-]+/).map((s) => s[0]).slice(0, 2).join("");
      const portrait = h("div", { class: "portrait" },
        m.photo ? h("img", { src: m.photo, alt: `Portrait de ${m.nom}`, loading: "lazy", width: 224, height: 280 })
          : h("span", { class: "portrait__init", "aria-hidden": "true", text: initiales }));
      return stagger(h("article", { class: "card membre" },
        portrait,
        h("div", null,
          h("h3", { text: m.nom }),
          h("p", { class: "role", text: m.role }),
          h("p", { class: "clamp" }, m.texte),
          boutons(lienBtn(m.lien, { variant: "btn--ghost" })))), i);
    })));
  });
};

/* Histoire (texte simple, du plus récent au plus ancien) */
LAYOUTS.histoire = (el, items) => {
  el.append(h("ol", { class: "chrono" }, items.map((e) =>
    stagger(h("li", { class: "chrono__item" },
      h("div", { class: "chrono__annee", text: e.annee }),
      h("div", { class: "chrono__texte" }, clampBlock(e.texte, ""))), 0))));
};

/* Partenaires */
LAYOUTS.partenaires = (el, items) => {
  const groupes = [...new Set(items.map((p) => p.groupe || "Partenaires"))];
  groupes.forEach((g) => {
    el.append(h("h3", { class: "groupe-titre", text: g }));
    el.append(h("div", { class: "logos" }, items.filter((p) => (p.groupe || "Partenaires") === g).map((p, i) => {
      const inner = [
        h("img", { src: p.logo, alt: p.url ? "" : p.nom, loading: "lazy" }),
        h("span", { class: "logo-tile__nom", text: p.nom }),
      ];
      const tile = p.url
        ? h("a", { class: "logo-tile", href: p.url, target: "_blank", rel: "noopener noreferrer", "aria-label": `${p.nom} (nouvelle fenêtre)` }, inner)
        : h("div", { class: "logo-tile" }, inner);
      return stagger(tile, i);
    })));
  });
};

/* Rencontres */
const trieRencontres = (list) => [...list].sort((a, b) => (b.dateDebut || "").localeCompare(a.dateDebut || ""));
const metaRencontre = (r) =>
  h("ul", { class: "meta" },
    h("li", null, icon("cal"), r.dateLibelle),
    r.lieu ? h("li", null, icon("pin"), r.lieu) : null);
const afficheOuNumero = (r, cls) =>
  r.affiche
    ? h("a", { class: cls, href: r.affiche, target: "_blank", rel: "noopener noreferrer", "aria-label": `Affiche : ${r.titre} (nouvelle fenêtre)` },
        h("img", { src: r.affiche, alt: `Affiche des ${r.numero} : ${r.titre}`, loading: "lazy" }))
    : h("div", { class: "rencontre__vide", role: "img", "aria-label": `${r.numero}` },
        h("div", null, h("strong", { text: roman(r.id) }), h("small", { text: "Rencontres La Boétie" })));

LAYOUTS.rencontres = (el, items) => {
  const liste = trieRencontres(items);
  const futur = (r) => (r.dateDebut || "") > todayISO();
  el.append(h("div", { class: "rencontres" }, liste.map((r, i) => {
    const une = i === 0;
    return stagger(h("article", { class: `card rencontre${une ? " rencontre--une" : ""}`, id: `rencontre-${r.id}` },
      afficheOuNumero(r, "rencontre__affiche"),
      h("div", null,
        une ? h("span", { class: "tag tag--plein", text: futur(r) ? "Prochaine rencontre" : "Dernière rencontre" }) : null,
        h("p", { class: "rencontre__num", text: r.numero }),
        h("h3", { text: r.titre }),
        r.sousTitre ? h("p", { class: "rencontre__sous", text: r.sousTitre }) : null,
        metaRencontre(r),
        r.organisateurs ? h("p", { class: "rencontre__orga" }, h("strong", { text: "Organisation : " }), r.organisateurs) : null,
        r.texte ? clampBlock(r.texte, "") : null,
        boutons(lienBtn(r.fichier, { fichier: true }), (r.liens || []).map((l) => lienBtn(l, { variant: "btn--ghost" }))))), i);
  })));
};

/* Agenda */
LAYOUTS.agenda = async (el, items) => {
  const pages = await getJSON("data/pages.json");
  const cfg = pages.agenda || {};
  const today = todayISO();
  const fin = (e) => e.dateFin || e.date || "";
  const avenir = items.filter((e) => !e.date || fin(e) >= today).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
  const passes = items.filter((e) => e.date && fin(e) < today).sort((a, b) => b.date.localeCompare(a.date));

  const carte = (e, i, passe) => {
    let bloc;
    if (!e.date) {
      bloc = h("div", { class: "event__date", "aria-hidden": "true" }, h("b", { text: "—" }), h("span", { text: "à venir" }));
    } else if (e.precision === "mois") {
      const d = parseISO(e.date);
      bloc = h("div", { class: "event__date", "aria-hidden": "true" },
        h("b", { text: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "") }), h("span", { text: d.getFullYear() }));
    } else {
      const d = parseISO(e.date), f = e.dateFin ? parseISO(e.dateFin) : null;
      const memeMois = f && f.getMonth() === d.getMonth() && f.getFullYear() === d.getFullYear();
      bloc = h("div", { class: "event__date", "aria-hidden": "true" },
        h("b", { text: memeMois && f.getDate() !== d.getDate() ? `${d.getDate()}–${f.getDate()}` : d.getDate() }),
        h("span", { text: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "") }),
        h("em", { text: d.getFullYear() }));
    }
    return stagger(h("article", { class: `card event${passe ? " event--passe" : ""}${e.attente ? " card--attente" : ""}` },
      bloc,
      h("div", null,
        e.attente ? h("span", { class: "tag tag--attente", text: "Texte d'attente" }) : null,
        h("p", { class: "event__plage", text: e.dateLibelle || "" }),
        h("h3", { text: e.titre }),
        e.lieu ? h("p", { class: "event__lieu" }, icon("pin"), e.lieu) : null,
        e.description ? h("p", { text: e.description }) : null,
        boutons(lienBtn(e.lien, { variant: "btn--ghost" })))), i);
  };

  if (avenir.length) {
    el.append(h("h2", { class: "agenda-titre", text: cfg.avenir || "À venir" }));
    el.append(h("div", { class: "agenda-grid" }, avenir.map((e, i) => carte(e, i, false))));
  }
  if (passes.length) {
    el.append(h("h2", { class: "agenda-titre", text: cfg.passe || "Rendez-vous passés" }));
    el.append(h("div", { class: "agenda-grid" }, passes.map((e, i) => carte(e, i, true))));
  }
};

/* Cartes génériques (outils) et manuscrits (avec filtres) */
function carteElement(it, i) {
  return stagger(h("article", { class: `card carte${it.attente ? " card--attente" : ""}`, "data-cat": it.categorie || "" },
    it.numero ? h("span", { class: "carte__num", "aria-hidden": "true", text: it.numero }) : null,
    it.attente ? h("span", { class: "tag tag--attente", text: "Texte d'attente" }) : it.categorie ? h("span", { class: "tag", text: it.categorie }) : null,
    h("h3", { text: it.titre }),
    it.cote ? h("p", { class: "carte__cote", text: it.cote }) : null,
    it.image ? h("img", { class: "carte__img", src: it.image, alt: `Première page : ${it.titre}`, loading: "lazy" }) : null,
    it.texte ? clampBlock(it.texte, "") : null,
    it.mention && !it.lien ? h("p", { class: "carte__mention", text: it.mention }) : null,
    boutons(lienBtn(it.lien, { variant: "btn--ghost" }), lienBtn(it.fichier, { fichier: true }))), i);
}
LAYOUTS.cartes = (el, items) => el.append(h("div", { class: "cartes" }, items.map(carteElement)));
LAYOUTS.manuscrits = (el, items) => {
  const cats = [...new Set(items.map((i) => i.categorie).filter(Boolean))];
  const grille = h("div", { class: "cartes" }, items.map(carteElement));
  if (cats.length > 1) {
    const bar = h("div", { class: "filtres", role: "group", "aria-label": "Filtrer la liste" });
    const make = (label, val) => {
      const b = h("button", { class: "filtre", type: "button", "aria-pressed": val === "" ? "true" : "false", text: label });
      b.addEventListener("click", () => {
        $$(".filtre", bar).forEach((x) => x.setAttribute("aria-pressed", x === b));
        $$(".carte", grille).forEach((c) => (c.hidden = val !== "" && c.dataset.cat !== val));
        initClamps(grille);
      });
      return b;
    };
    bar.append(make("Tout afficher", ""), ...cats.map((c) => make(c, c)));
    el.append(bar);
  }
  el.append(grille);
};

/* Publications : groupées par collection */
LAYOUTS.publications = (el, items) => {
  const collections = [...new Set(items.map((p) => p.collection || ""))];
  collections.forEach((c) => {
    const groupe = h("div", { class: "pubs-groupe" });
    if (c) groupe.append(h("h3", { class: "groupe-titre", text: c }));
    items.filter((p) => (p.collection || "") === c).forEach((p, i) => {
      groupe.append(stagger(h("article", { class: "pub" },
        h("div", { class: "pub__ref" }, p.numero || "", p.date ? h("small", { text: p.date }) : null),
        h("div", null,
          h("h4", { text: p.titre }),
          p.auteur ? h("p", { class: "pub__auteur", text: p.auteur }) : null,
          p.texte ? h("p", { class: "pub__texte", text: p.texte }) : null),
        h("div", null, lienBtn(p.lien, { variant: "btn--ghost" }), lienBtn(p.fichier, { fichier: true }))), i));
    });
    el.append(groupe);
  });
};

/* Articles */
LAYOUTS.articles = (el, items) => {
  el.append(h("div", { class: "articles" }, items.map((a, i) => stagger(h("article", { class: `card article${a.attente ? " card--attente" : ""}` },
    h("div", { class: "article__date", text: a.dateLibelle || a.date || "" }),
    h("div", null,
      a.attente ? h("span", { class: "tag tag--attente", text: "Texte d'attente" }) : null,
      h("h3", { text: a.titre }),
      a.auteur ? h("p", { class: "article__auteur", text: a.auteur }) : null,
      a.texte ? clampBlock(a.texte, "") : null,
      boutons(lienBtn(a.fichier, { fichier: true }), lienBtn(a.lien, { variant: "btn--ghost" })))), i))));
};

/* Études (textes longs) */
LAYOUTS.etudes = (el, items) => {
  items.forEach((e, i) => {
    el.append(stagger(h("article", { class: `card etude${e.image ? " etude--img" : ""}` },
      h("div", { class: "etude__corps" },
        e.categorie ? h("span", { class: "tag", text: e.categorie }) : null,
        h("h3", { text: e.titre }),
        e.auteur ? h("p", { class: "article__auteur", text: e.auteur }) : null,
        clampBlock(e.texte, ""),
        boutons(lienBtn(e.lien, { variant: "btn--ghost" }), lienBtn(e.fichier, { fichier: true }))),
      e.image ? h("figure", { class: "etude__fig" }, h("img", { src: e.image, alt: "", loading: "lazy" })) : null), i));
  });
};

/* Mentions légales */
LAYOUTS.mentions = (el, items) => {
  el.append(h("div", { class: "mentions" }, items.map((m, i) =>
    stagger(h("section", null, h("h2", { text: m.titre }), h("div", { class: "prose" }, paragraphs(m.texte))), i))));
};

/* ---------- Hydratation de toutes les listes ---------- */
async function hydrateLists() {
  const pages = await getJSON("data/pages.json");
  const page = pages[document.body.dataset.page] || {};
  await Promise.all($$("[data-liste]").map(async (sec) => {
    const slot = $("[data-head-slot]", sec);
    const body = $("[data-body]", sec) || sec;
    try {
      const data = await getJSON(sec.dataset.liste);
      const group = sec.dataset.head;
      const info = group && page[group] ? page[group][sec.dataset.key || sec.id] : null;
      if (slot) { const hb = headBlock(info, sec.id); hb ? slot.replaceChildren(hb) : slot.remove(); }
      body.replaceChildren();
      await LAYOUTS[sec.dataset.layout](body, data, sec);
    } catch (err) {
      console.error(err);
      body.replaceChildren(h("p", { class: "vide", text: "Cette liste est momentanément indisponible." }));
    }
  }));
  buildSubnav();
  observeReveals();
  initClamps();
}

/* Sous-menu collant (Études & outils, Carnets) */
function buildSubnav() {
  const nav = $("[data-subnav]");
  if (!nav) return;
  const secs = $$("[data-liste]");
  const ul = h("ul", null, secs.map((s) => {
    const t = $("h2", s);
    return h("li", null, h("a", { href: `#${s.id}`, text: s.dataset.label || (t ? t.textContent : s.id) }));
  }));
  nav.append(h("div", { class: "container" }, ul));
  const links = $$("a", ul);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  secs.forEach((s) => io.observe(s));
}

/* ---------- Widgets de l'accueil ---------- */
const WIDGETS = {};

WIDGETS["derniere-rencontre"] = async (el) => {
  const list = trieRencontres(await getJSON("data/rencontres.json"));
  const r = list[0];
  if (!r) return;
  const futur = (r.dateDebut || "") > todayISO();
  let extrait = (r.texte || "").replace(/\s+/g, " ");
  if (extrait.length > 300) extrait = extrait.slice(0, 300).replace(/\s+\S*$/, "") + "…";
  el.append(h("div", { class: "une" },
    afficheOuNumero(r, "une__affiche"),
    h("div", { "data-reveal": "" },
      h("p", { class: "kicker", text: futur ? "Prochaine rencontre" : "Dernière rencontre" }),
      h("p", { class: "une__num", text: r.numero }),
      h("h2", { text: r.titre }),
      metaRencontre(r),
      h("p", { text: extrait }),
      boutons(lienBtn(r.fichier, { variant: "btn--light", fichier: true }),
        lienBtn({ label: "Toutes les Rencontres", url: "les-rencontres.html" }, { variant: "btn--outline-light" })))));
};

WIDGETS.apercu = async (el) => {
  const pages = await getJSON("data/pages.json");
  el.append(h("div", { class: "apercu" }, pages.accueil.apercu.map((c, i) =>
    stagger(h("a", { class: "card", href: c.href }, h("h3", { text: c.titre }), h("p", { text: c.texte }), h("span", { class: "go", text: "Découvrir →" })), i))));
};

WIDGETS.chiffres = async (el) => {
  const [r, m, p] = await Promise.all([getJSON("data/rencontres.json"), getJSON("data/etudes/manuscrits.json"), getJSON("data/etudes/publications.json")]);
  const premiere = r.map((x) => (x.dateDebut || "").slice(0, 4)).filter(Boolean).sort()[0];
  const items = [
    [r.length, `Rencontres internationales depuis ${premiere || "2004"}`],
    [m.filter((x) => x.categorie === "Manuscrit").length, "manuscrits du Discours recensés"],
    [p.length, "volumes publiés chez Classiques Garnier"],
  ];
  const wrap = h("div", { class: "chiffres" }, items.map(([n, l], i) =>
    stagger(h("div", { class: "chiffre" }, h("strong", { "data-count": n, text: n }), h("span", { text: l })), i)));
  el.append(wrap);
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      $$("[data-count]", wrap).forEach((s) => {
        const cible = Number(s.dataset.count), t0 = performance.now();
        s.textContent = 0;
        const step = (t) => {
          const k = Math.min(1, (t - t0) / 1300);
          s.textContent = Math.round(cible * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.4 });
  io.observe(wrap);
};

WIDGETS["partenaires-accueil"] = async (el) => {
  const list = await getJSON("data/partenaires.json");
  const g = el.dataset.groupe;
  el.append(h("div", { class: "partenaires-accueil" }, list.filter((p) => !g || p.groupe === g).map((p) =>
    h("a", { href: p.url || "la-sialb.html#partenaires", target: p.url ? "_blank" : null, rel: p.url ? "noopener noreferrer" : null, "aria-label": p.nom },
      h("img", { src: p.logo, alt: "", loading: "lazy" })))));
};

/* Frise chronologique 1530 → aujourd'hui */
WIDGETS.frise = async (el) => {
  const items = await getJSON("data/frise.json");
  const track = h("div", { class: "frise__track" });
  let chapVie = false, chapSuite = false;
  items.forEach((it, i) => {
    if (it.categorie === "vie" && !chapVie) {
      chapVie = true;
      track.append(h("div", { class: "fr-chap" }, h("span", null, "Une vie", h("b", { text: "1530 — 1563" }))));
    }
    if (it.categorie !== "vie" && !chapSuite) {
      chapSuite = true;
      track.append(h("div", { class: "fr-chap", style: "margin-left:1.5rem" }, h("span", null, "Une œuvre qui circule", h("b", { text: "de 1571 à aujourd'hui" }))));
    }
    track.append(h("article", { class: "fr-item", "data-cat": it.categorie, style: `--i:${Math.min(i, 14)}` },
      h("span", { class: "fr-item__annee", text: it.annee }),
      h("span", { class: "fr-item__dot", "aria-hidden": "true" }),
      h("h3", { text: it.titre }),
      h("p", { text: it.texte })));
  });
  const scroller = h("div", { class: "frise__scroller", tabindex: "0", role: "region", "aria-label": "Frise chronologique, défilement horizontal" }, track);
  const prev = h("button", { class: "frise__btn", type: "button", "aria-label": "Repères précédents" }, icon("prev"));
  const next = h("button", { class: "frise__btn", type: "button", "aria-label": "Repères suivants" }, icon("go"));
  const bar = h("i");
  const legende = h("ul", { class: "legende" },
    h("li", null, h("i", { class: "l-vie" }), "La vie de La Boétie"),
    h("li", null, h("i"), "L'œuvre, ses manuscrits et ses éditions"),
    h("li", null, h("i", { class: "l-sialb" }), "La SIALB"));
  el.append(h("div", { class: "frise" }, legende, scroller,
    h("div", { class: "frise__bar" }, prev, h("div", { class: "frise__progress" }, bar), next)));
  const root = $(".frise", el);

  const maj = () => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    const k = max > 0 ? scroller.scrollLeft / max : 0;
    bar.style.width = `${Math.max(4, k * 100)}%`;
    prev.disabled = scroller.scrollLeft < 4;
    next.disabled = scroller.scrollLeft > max - 4;
  };
  scroller.addEventListener("scroll", () => requestAnimationFrame(maj), { passive: true });
  addEventListener("resize", maj);
  const pas = () => Math.max(260, scroller.clientWidth * 0.8);
  prev.addEventListener("click", () => scroller.scrollBy({ left: -pas(), behavior: reduceMotion ? "auto" : "smooth" }));
  next.addEventListener("click", () => scroller.scrollBy({ left: pas(), behavior: reduceMotion ? "auto" : "smooth" }));

  /* Glisser à la souris */
  let down = false, x0 = 0, s0 = 0;
  scroller.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; x0 = e.clientX; s0 = scroller.scrollLeft; });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    if (Math.abs(e.clientX - x0) > 4) scroller.classList.add("is-drag");
    scroller.scrollLeft = s0 - (e.clientX - x0);
  });
  addEventListener("pointerup", () => { down = false; scroller.classList.remove("is-drag"); });

  maj();
  if (reduceMotion || !("IntersectionObserver" in window)) root.classList.add("in");
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { root.classList.add("in"); io.disconnect(); } }), { threshold: 0.15 });
    io.observe(root);
  }
};

async function hydrateWidgets() {
  await Promise.all($$("[data-widget]").map(async (el) => {
    try { await WIDGETS[el.dataset.widget](el); }
    catch (err) { console.error(err); el.append(h("p", { class: "vide", text: "Ce contenu est momentanément indisponible." })); }
  }));
  observeReveals();
}

/* Texte d'accueil piloté par pages.json */
async function fillHome() {
  const root = $("[data-home]");
  if (!root) return;
  const pages = await getJSON("data/pages.json");
  const a = pages.accueil;
  $$("[data-fill]", root).forEach((n) => { const v = a[n.dataset.fill]; if (v) n.textContent = v; });
  const q = $("[data-citation]", root);
  if (q && a.citation) {
    const cle = "servir";
    q.replaceChildren(...a.citation.split(" ").map((mot, i, arr) => {
      const w = h("span", { class: `w${mot.replace(/[^\p{L}]/gu, "").toLowerCase() === cle ? " cle" : ""}`, style: `--i:${i}` }, mot);
      return [w, i < arr.length - 1 ? " " : ""];
    }).flat());
    q.setAttribute("aria-label", a.citation);
  }
}

/* Coordonnées (page contact) */
async function fillCoord() {
  const el = $("[data-coord]");
  if (!el) return;
  const site = await getJSON("data/site.json");
  el.append(...[
    h("h3", { text: "Coordonnées" }),
    h("address", null, h("strong", { text: site.sigle }), document.createElement("br"),
      site.adresse.map((l, i) => [i ? document.createElement("br") : null, l])),
    h("p", null, "Courriel : ", h("a", { href: `mailto:${site.email}`, text: site.email })),
    site.telephone ? h("p", null, "Téléphone : ", site.telephone) : null,
    h("p", { text: "Pour adhérer à l'association, utilisez la plateforme HelloAsso." }),
    boutons(lienBtn(site.adhesion, { variant: "btn--ghost" })),
  ].filter(Boolean));
}

/* ---------- Héros : la lumière sur le manuscrit ---------- */
function initHero() {
  const hero = $(".hero");
  if (!hero) return;
  let tx = 62, ty = 38, cx = tx, cy = ty, actif = false, visible = true, raf = 0, scrollY0 = 0;
  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 100;
    ty = ((e.clientY - r.top) / r.height) * 100;
    actif = true;
  });
  hero.addEventListener("pointerleave", () => (actif = false));
  addEventListener("scroll", () => { scrollY0 = scrollY; hero.style.setProperty("--py", `${Math.min(scrollY0, 900) * 0.18}px`); }, { passive: true });
  if (reduceMotion) { hero.style.setProperty("--mx", "62%"); hero.style.setProperty("--my", "40%"); return; }
  const t0 = performance.now();
  const frame = (t) => {
    if (!visible) { raf = 0; return; }
    if (!actif) { tx = 62 + Math.sin((t - t0) / 4200) * 16; ty = 40 + Math.cos((t - t0) / 5300) * 14; }
    cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
    hero.style.setProperty("--mx", `${cx.toFixed(2)}%`);
    hero.style.setProperty("--my", `${cy.toFixed(2)}%`);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  if ("IntersectionObserver" in window)
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(hero);
}

/* ---------- Démarrage ---------- */
(async function init() {
  try {
    await Promise.all([buildChrome(), buildPageHead(), fillHome(), fillCoord()]);
  } catch (err) { console.error(err); }
  initHero();
  await Promise.all([hydrateLists(), hydrateWidgets()]);
  observeReveals();
  initClamps();
  document.documentElement.classList.add("ready");
})();
