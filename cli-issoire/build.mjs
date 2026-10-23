/* ==========================================================================
   CLI Issoire — générateur du site statique
   Lit les données dans /data (JSON) et écrit les pages HTML dans /dist.
   Aucune dépendance : `node build.mjs`
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));
const listJSON = (dir) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.json')).sort();

/* ---------- données ---------- */
const site = readJSON('data', 'site.json');
const themes = readJSON('data', 'themes.json');
const activites = listJSON('data/activites').map((f) => readJSON('data', 'activites', f)).sort((a, b) => a.ordre - b.ordre);
const calendrier = readJSON('data', 'calendrier.json');
const equipe = readJSON('data', 'equipe.json');
const galerie = readJSON('data', 'galerie.json');
const themeBySlug = Object.fromEntries(themes.map((t) => [t.slug, t]));
const actBySlug = Object.fromEntries(activites.map((a) => [a.slug, a]));
const NEUTRAL = { couleur: '#5A3422', teinte: '#F1EBE2', image: site.panorama };
const CLUB = { slug: 'club', titre: 'Vie du club', theme: 'club', icone: 'people' };
const labelFor = (slug) => actBySlug[slug] || CLUB;
const themeOf = (slug) => themeBySlug[labelFor(slug).theme] || { slug: 'club', couleur: '#2A2725', teinte: '#F1EBE2', court: 'Club' };

const news = listJSON('data/actualites')
  .flatMap((f) => {
    const slug = f.replace('.json', '');
    return readJSON('data', 'actualites', f).map((n) => ({ ...n, activite: slug }));
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

/* ---------- utilitaires ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const IMG = (p) => (/^(https?:|\/)/.test(p) ? p : site.imageBase + p.split('/').map(encodeURIComponent).join('/'));
const isExternal = (u) => /^https?:/.test(u);
const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const todayISO = new Date().toISOString().slice(0, 10);
const cvars = (t) => `--c:${t.couleur};--t:${t.teinte}`;
const NEWTAB = ' target="_blank" rel="noopener"';
const link = (l, cls = '') =>
  `<a href="${esc(l.url)}"${isExternal(l.url) ? NEWTAB : ''}${cls ? ` class="${cls}"` : ''}>${esc(l.texte)}${isExternal(l.url) ? '<span class="sr-only"> (nouvel onglet)</span>' : ''}</a>`;

const ICONS = {
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2.5 4 2.5S16 14 16 14"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  heart: '<path d="M12 20.5s-8-4.8-8-10.8A4.6 4.6 0 0112 7a4.6 4.6 0 018 2.7c0 6-8 10.8-8 10.8z"/>',
  mountain: '<path d="M2.5 19.5l6.2-11 3.6 6 2.6-3.6 6.6 8.6z"/><path d="M8.7 8.5l1.7 2.4"/>',
  palette: '<path d="M12 3a9 9 0 100 18c1.6 0 2.3-1.2 1.7-2.4-.6-1.2.1-2.6 1.5-2.6H17a4 4 0 004-4C21 6.8 17 3 12 3z"/><path d="M7.5 11h.01M10 7.5h.01M14.5 7.5h.01"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',
  dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19l8-8"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21"/>',
  bike: '<circle cx="6" cy="16.5" r="3.5"/><circle cx="18" cy="16.5" r="3.5"/><path d="M6 16.5l4-8h5l3 8M10 8.5L8.5 6H11"/>',
  basket: '<path d="M3.5 10h17l-2 10h-13z"/><path d="M8 10l2.5-6M16 10l-2.5-6"/>',
  vase: '<path d="M9 3h6M10 3v3c-3 2-4.5 5-4.5 8a6.5 6.5 0 0013 0c0-3-1.5-6-4.5-8V3"/>',
  brush: '<path d="M18.5 3.5l2 2-9 9-3-3z"/><path d="M8.5 11.5C5.5 11.5 4.5 14 4.5 16c0 1.5-1 2.5-2 3 3.5 1.5 8 .5 8-3.5"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.8 10.6c.7.7 1.1 1.4 1.1 2.4h5.4c0-1 .4-1.7 1.1-2.4A6 6 0 0012 3z"/>',
  ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5"/>',
  euro: '<circle cx="12" cy="12" r="9"/><path d="M15.5 9a4 4 0 100 6M8 11h5M8 13.5h5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
  camera: '<path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-5.5 6.5-5.5S15.5 16.4 15.5 20"/><circle cx="17" cy="9" r="2.8"/><path d="M17 14.5c2.6 0 4.5 1.6 4.5 4.5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 016.5 3H20v16H6.5A2.5 2.5 0 004 21.5z"/><path d="M4 19V5.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>'
};
const icon = (n, cls = '') => `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n] || ICONS.sparkle}</svg>`;
const img = (src, alt = '', extra = '') =>
  `<img src="${esc(IMG(src))}" alt="${esc(alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="imgFail(this)"${extra ? ' ' + extra : ''}>`;
const todo = (txt = 'À compléter') => `<span class="todo">${esc(txt)}</span>`;
const reveal = (i = 0) => `reveal d${i % 6}`;

/* ---------- gabarit commun ---------- */
const nav = (current, mobile = false) =>
  `<ul class="nav-list">${site.pagesMenu
    .map(([href, label]) => {
      const th = themeBySlug[href.replace('.html', '')];
      const dot = th ? `<span class="dot" style="--dot:${th.couleur}" aria-hidden="true"></span>` : '';
      return `<li><a class="nav-link" href="${href}"${current === href ? ' aria-current="page"' : ''}>${dot}${esc(label)}</a></li>`;
    })
    .join('')}</ul>`;

function layout({ file, title, description, body, hero = '', bodyClass = '' }) {
  const url = `${site.url}/${file === 'index.html' ? '' : file}`;
  const fullTitle = file === 'index.html' ? `${site.sigle} Issoire — ${site.nom}, culture et loisirs pour seniors` : `${title} | ${site.sigle} Issoire`;
  const a = site.adresse;
  const member = site.espaceAdherent.url;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#2A2725">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(site.nom)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(IMG(site.panorama))}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/fraunces-600-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/atkinson-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/css/style.css">
<script>document.documentElement.classList.add('js');window.imgFail=function(i){var p=i.closest('[data-img]')||i.parentNode;p.classList.add('noimg');i.remove()}</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="container">
    <div class="header-top">
      <a class="brand" href="index.html" data-img aria-label="${esc(site.nom)} — retour à l'accueil">
        <img class="brand__logo" src="${esc(IMG(site.logo))}" alt="" referrerpolicy="no-referrer" onerror="imgFail(this)">
        <span class="brand__logo-fallback" aria-hidden="true">${esc(site.sigle)}</span>
        <span class="brand__text"><span class="brand__name">${esc(site.nom)}</span><span class="brand__sub">${esc(site.baseline)}</span></span>
      </a>
      <div class="header-actions">
        <a class="btn btn--stone btn--member" href="${esc(member)}"${NEWTAB}>${icon('key')}Espace adhérent<span class="sr-only"> (nouvel onglet)</span></a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu">${icon('menu', 'ico--open')}${icon('close', 'ico--close')}<span class="burger__label">Menu</span></button>
      </div>
    </div>
    <nav class="nav" aria-label="Navigation principale">${nav(file)}</nav>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-label="Menu de navigation">
  <nav aria-label="Navigation mobile">${nav(file, true)}</nav>
  <div style="max-width:560px;margin:0 auto">
    <a class="btn btn--stone" href="${esc(member)}"${NEWTAB}>${icon('key')}Espace adhérent</a>
    <p class="mm-tel">${icon('phone')} <a href="tel:${site.telephonePermanence.replace(/\s/g, '')}">${esc(site.telephonePermanence)}</a></p>
  </div>
</div>
<main id="contenu">
${hero}
${body}
</main>
<footer class="site-footer">
  <div class="volcans" aria-hidden="true"></div>
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand" data-img>
          <span class="plate"><img src="${esc(IMG(site.logo))}" alt="Logo du ${esc(site.nom)}" loading="lazy" referrerpolicy="no-referrer" onerror="imgFail(this)"><span class="brand__logo-fallback" aria-hidden="true">${esc(site.sigle)}</span></span>
          <strong>${esc(site.nom)}</strong>
        </div>
        <p>${esc(site.baseline)}. Une association pour seniors actifs, au cœur d'Issoire.</p>
        <a class="btn btn--light" href="${esc(member)}"${NEWTAB}>${icon('key')}Espace adhérent<span class="sr-only"> (nouvel onglet)</span></a>
      </div>
      <div>
        <h2>Coordonnées</h2>
        <address style="font-style:normal">
          ${esc(a.lieu)}<br>${esc(a.rue)}<br>${esc(a.codePostal)} ${esc(a.ville)}<br>
          <a href="tel:${site.telephone.replace(/\s/g, '')}">${esc(site.telephone)}</a><br>
          <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
        </address>
        <p style="margin-top:.8em">Permanence ${esc(site.permanence)}.</p>
      </div>
      <div>
        <h2>Nos 5 thèmes</h2>
        <ul class="footer-list">${themes.map((t) => `<li><a href="${t.page}"><span class="dot" style="--dot:${t.couleur}" aria-hidden="true"></span>${esc(t.court)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>Le club</h2>
        <ul class="footer-list">
          <li><a href="le-club.html">Présentation et équipe</a></li>
          <li><a href="actualites.html">Actualités</a></li>
          <li><a href="galerie.html">Galerie photos</a></li>
          <li><a href="contact.html">Contact et inscription</a></li>
          <li><a href="${esc(member)}"${NEWTAB}>Espace adhérent<span class="sr-only"> (nouvel onglet)</span></a></li>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(site.nom)} — Issoire (Puy-de-Dôme)</span><span>Site sans cookie ni suivi.</span></div>
  </div>
</footer>
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}

/* ---------- briques ---------- */
function pageHero({ eyebrow, title, lead, theme, icone, photos = [] }) {
  const t = theme || { couleur: '#2A2725', teinte: '#F1EBE2' };
  const tiles = photos
    .slice(0, 4)
    .map((p, i) => `<figure class="tile" style="--c:${t.couleur};--d:${-i * 1.3}s">${img(p.src, '')}</figure>`)
    .join('');
  return `<section class="page-hero" style="--c:${t.couleur}">
  ${t.image ? `<div class="page-hero__bg" style="background-image:url('${esc(IMG(t.image))}')" aria-hidden="true"></div>` : ''}
  <div class="container page-hero__inner">
    <div>
      ${icone ? `<span class="page-hero__icon" aria-hidden="true">${icon(icone)}</span><br>` : ''}
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h1>${esc(title)}</h1>
      <p class="lead">${esc(lead)}</p>
    </div>
    ${tiles ? `<div class="page-hero__photos" aria-hidden="true">${tiles}</div>` : ''}
  </div>
  <div class="volcans" aria-hidden="true"></div>
</section>`;
}

const seanceRow = (ico, label, val) =>
  `<div class="row">${icon(ico)}<div><dt>${label}</dt><dd>${val ? esc(val) : todo()}</dd></div></div>`;

function seance(s) {
  return `<div class="seance">
    <h3>${esc(s.intitule)}</h3>
    ${s.description ? `<p class="seance__desc">${esc(s.description)}</p>` : ''}
    <dl>
      ${seanceRow('calendar', 'Jours', s.jours)}
      ${seanceRow('clock', 'Horaires', s.horaires)}
      ${seanceRow('pin', 'Lieu', s.lieu)}
      ${seanceRow('user', 'Animateur', s.animateur)}
      ${seanceRow('euro', 'Tarif', s.tarif)}
    </dl>
    ${s.note ? `<p class="seance__note">${esc(s.note)}</p>` : ''}
  </div>`;
}

function niveaux(a) {
  return `<div>
    <h3>${esc(a.niveauxTitre || 'Les niveaux')}</h3>
    ${a.niveauxIntro ? `<p>${esc(a.niveauxIntro)}</p>` : ''}
    <div class="levels">${a.niveaux
      .map(
        (n) => `<div class="level"><span class="level__name" aria-hidden="true">${esc(n.nom)}</span>
        <h4><span class="sr-only">Niveau </span>${esc(n.nom)} · ${esc(n.titre)}</h4>
        <div class="meter" role="img" aria-label="Difficulté ${n.rang} sur 4">${[1, 2, 3, 4].map((i) => `<i${i <= n.rang ? ' class="on"' : ''}></i>`).join('')}</div>
        <ul>${n.details.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></div>`
      )
      .join('')}</div>
  </div>`;
}

function tableau(a) {
  const t = a.tableau;
  return `<div>
    <h3>${esc(a.tableauTitre || 'Tableau')}</h3>
    <div class="table-wrap"><table class="table">
      <thead><tr>${t.colonnes.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${t.lignes.map((l) => `<tr>${l.map((c, i) => `<td data-label="${esc(t.colonnes[i])}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
  </div>`;
}

function fiche(a, idx = 0) {
  const th = themeBySlug[a.theme];
  const photos = (a.photos || []).slice(0, 6);
  return `<article class="fiche ${reveal(0)}" id="${a.slug}" style="${cvars(th)}">
  <header class="fiche__head">
    <span class="fiche__icon" aria-hidden="true">${icon(a.icone)}</span>
    <div><h2>${esc(a.titre)}</h2><p>${esc(a.resume)}</p></div>
  </header>
  <div class="fiche__body fiche__body--split">
    <div class="fiche__text">
      ${a.description.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${a.faits ? `<div class="facts" style="margin:22px 0">${a.faits.map((f) => `<div class="fact"><b data-count="${f.valeur}"${f.format === 'annee' ? ' data-plain="1"' : ''}>${f.valeur}</b><span>${esc(f.label)}</span></div>`).join('')}</div>` : ''}
      ${a.points ? `<h3>${esc(a.pointsTitre || 'À savoir')}</h3><ul class="points">${a.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      ${photos.length ? `<div class="photos" style="margin-top:22px">${photos.map((p) => `<figure class="shot">${img(p, `${a.titre} : photo du club`)}</figure>`).join('')}</div>` : ''}
    </div>
    <div class="fiche__practical">
      <h3>Infos pratiques</h3>
      ${a.seances.map(seance).join('')}
    </div>
  </div>
  ${a.niveaux || a.tableau || a.participer ? `<div class="fiche__body">${a.niveaux ? niveaux(a) : ''}${a.tableau ? tableau(a) : ''}${a.participer ? participer(a) : ''}</div>` : ''}
  <div class="fiche__foot">
    <a class="btn btn--theme" href="contact.html?activite=${a.slug}#formulaire">Venir essayer ${icon('arrow')}</a>
    ${a.liens && a.liens.length ? `<ul class="fiche__links">${a.liens.map((l) => `<li>${link(l)}</li>`).join('')}</ul>` : ''}
  </div>
  ${a.source ? `<details><summary>D'où viennent ces informations ?</summary><p>${esc(a.source)}</p></details>` : ''}
</article>`;
}

function participer(a) {
  const p = a.participer;
  return `<div>
    <h3>${esc(p.titre)}</h3>
    <div class="duo">
      <div><h3 style="margin-top:0">${icon('mic')} Participer</h3><p>${esc(p.participer)}</p><a class="btn btn--theme" href="contact.html?activite=${a.slug}#formulaire">Rejoindre le groupe ${icon('arrow')}</a></div>
      <div><h3 style="margin-top:0">${icon('book')} En bénéficier</h3><p>${esc(p.beneficier)}</p>${a.liens && a.liens[0] ? `<a class="btn btn--ghost" href="${esc(a.liens[0].url)}"${NEWTAB}>${esc(a.liens[0].texte)} ${icon('external')}</a>` : ''}</div>
    </div>
  </div>`;
}

function newsCard(n, i = 0) {
  const act = labelFor(n.activite);
  const th = themeOf(n.activite);
  const links = n.liens || (n.lien ? [] : []);
  return `<article class="news-card ${reveal(i % 3)}" data-activite="${n.activite}" style="--c:${th.couleur}">
    <div class="news-card__meta"><span class="tag">${icon(act.icone)}${esc(act.titre)}</span><span class="news-card__date">${esc(n.dateLabel || fmtDate(n.date))}</span></div>
    <h3>${esc(n.titre)}</h3>
    <p>${esc(n.texte)}</p>
    ${links.length ? `<ul class="news-card__links">${links.map((l) => `<li>${link(l)}</li>`).join('')}</ul>` : ''}
    ${n.lien ? `${link(n.lien, 'btn btn--theme')}` : ''}
  </article>`;
}

function memberBand() {
  return `<section class="section" style="padding-block:0 clamp(48px,7vw,80px)"><div class="container"><div class="member-band ${reveal(0)}">
    <div><h2>Vous êtes adhérent ?</h2><p>Retrouvez votre espace personnel : il est géré à part de ce site.</p></div>
    <a class="btn btn--big" href="${esc(site.espaceAdherent.url)}"${NEWTAB}>${icon('key')}Espace adhérent<span class="sr-only"> (nouvel onglet)</span></a>
  </div></div></section>`;
}

function tryBand(text) {
  return `<section class="try">
  <div class="container try__inner">
    <div class="${reveal(0)}">
      <h2>${esc(text || 'Envie d\'essayer ? Venez nous rencontrer !')}</h2>
      <p class="lead" style="color:var(--ink)">Passez à la permanence ${esc(site.permanence)}. On vous présente les activités, vous choisissez celle qui vous plaît.</p>
    </div>
    <div class="try__actions ${reveal(1)}">
      <a class="btn btn--stone btn--big" href="contact.html#formulaire">${icon('mail')}Nous écrire</a>
      <a class="btn btn--light btn--big" href="tel:${site.telephonePermanence.replace(/\s/g, '')}">${icon('phone')}${esc(site.telephonePermanence)}</a>
    </div>
  </div>
</section>`;
}

/* ---------- pages ---------- */
const pages = {};

/* Accueil */
{
  const tiles = [
    ['p/pho/photos-de-groupe.jpg', 'Randonnée', 'sorties'],
    ['j/jeu/Jeux-Societe-1-.JPG', 'Jeux de société', 'convivialite'],
    ['d/dan/Danse-groupe1.png', 'Danse', 'convivialite'],
    ['c/cli/cli-section-velo-sejour-2026-cantal.jpg', 'Vélo', 'sorties'],
    ['f/for/formation-numerique-cli.jpeg', 'Informatique', 'nouvelles-technologies'],
    ['g/grp/grptrav3.jpg', 'Remue-méninges', 'ateliers'],
    ['a/ala/a-l-action1.jpg', 'Peinture', 'ateliers'],
    ['r/r1v/R1-vielle-brioude-5.jpg', 'Randonnée pédestre', 'sorties']
  ];
  const hero = `<section class="hero" aria-labelledby="titre-accueil">
  <div class="hero__bg" style="background-image:url('${esc(IMG(site.panorama))}')" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div>
      <span class="hero__badge">${icon('sun')} Issoire · Puy-de-Dôme · Auvergne</span>
      <h1 id="titre-accueil">Club Culture et Loisirs <em>Issoirien</em></h1>
      <p class="hero__lead">Des loisirs, de la culture et des amis à Issoire : ${site.chiffres.activites} activités pour bien vivre chaque jour.</p>
      <div class="hero__cta">
        <a class="btn btn--big" href="#themes">Découvrir nos activités ${icon('arrow')}</a>
        <a class="btn btn--ghost btn--big" href="contact.html#formulaire">Venir essayer</a>
      </div>
    </div>
    <div class="mosaic" aria-hidden="true">
      ${tiles.map(([src, cap, th]) => `<figure class="tile" style="--c:${themeBySlug[th].couleur}">${img(src, '')}<figcaption>${esc(cap)}</figcaption></figure>`).join('')}
    </div>
  </div>
  <div class="volcans" aria-hidden="true"></div>
</section>`;

  const themeCards = themes
    .map((t, i) => {
      const acts = activites.filter((a) => a.theme === t.slug);
      return `<article class="theme-card ${reveal(i % 3)}" style="${cvars(t)}">
      <div class="theme-card__top"><div class="theme-card__img${t.image ? '' : ' noimg'}">${t.image ? img(t.image, '') : icon(t.icone, 'ico--big')}</div>
      <span class="theme-card__badge" aria-hidden="true">${icon(t.icone)}</span></div>
      <div class="theme-card__body">
        <h3>${esc(t.nom)}</h3>
        <p>${esc(t.accroche)}</p>
        <ul class="theme-card__list" aria-label="Activités">${acts.map((a) => `<li>${esc(a.titre)}</li>`).join('')}</ul>
        <a class="theme-card__more" href="${t.page}">Découvrir ${esc(t.court.toLowerCase())} ${icon('arrow')}</a>
      </div>
    </article>`;
    })
    .join('');

  const c = site.chiffres;
  const counters = [
    [c.adherents, 'adhérents cette année'],
    [c.activites, 'activités'],
    [c.themes, 'thèmes'],
    [c.niveauxRando, 'niveaux de randonnée']
  ];
  const body = `
<section class="section" id="themes">
  <div class="container">
    <div class="${reveal(0)}" style="max-width:760px;margin-bottom:40px">
      <span class="eyebrow">Nos activités</span>
      <h2>Cinq univers, quatorze activités</h2>
      <p class="lead">Chaque thème a sa couleur. Choisissez celui qui vous ressemble, ou essayez-les tous !</p>
    </div>
    <div class="themes">${themeCards}</div>
  </div>
</section>

<section class="section section--stone" style="position:relative" aria-labelledby="chiffres">
  <div class="container">
    <h2 id="chiffres" class="${reveal(0)}" style="text-align:center;margin-bottom:36px">Le CLI en chiffres</h2>
    <div class="counters">${counters.map(([n, l], i) => `<div class="counter ${reveal(i)}"><span class="counter__num" data-count="${n}">${n}</span><span class="counter__label">${esc(l)}</span></div>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="${reveal(0)}" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:16px;margin-bottom:32px">
      <div><span class="eyebrow">Dernières actualités</span><h2 style="margin:0">Ça se passe au club</h2></div>
      <a class="btn btn--stone" href="actualites.html">Toutes les actualités ${icon('arrow')}</a>
    </div>
    <div class="news-grid news-grid--3">${news.slice(0, 3).map((n, i) => newsCard(n, i)).join('')}</div>
  </div>
</section>

${memberBand()}
${tryBand()}`;
  pages['index.html'] = layout({
    file: 'index.html',
    title: site.nom,
    description: `${site.nom} à Issoire : ${site.chiffres.activites} activités de culture et de loisirs pour seniors (gym, danse, randonnées, ateliers, informatique…). ${site.chiffres.adherents} adhérents.`,
    hero,
    body
  });
}

/* Pages de thèmes */
function themePage(t) {
  const acts = activites.filter((a) => a.theme === t.slug);
  const photos = acts.flatMap((a) => (a.photos || []).map((src) => ({ src })));
  const hero = pageHero({ eyebrow: 'Notre thème', title: t.nom, lead: t.intro, theme: { ...t }, icone: t.icone, photos });
  let extra = '';
  if (t.slug === 'sorties') {
    const ev = calendrier.evenements.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    const item = (e) => {
      const th = themeOf(e.activite);
      const d = new Date(e.date + 'T12:00:00');
      const past = (e.fin || e.date) < todayISO;
      const range = e.fin && e.fin !== e.date ? `${fmtDate(e.date)} au ${fmtDate(e.fin)}` : fmtDate(e.date);
      return `<li class="cal__item${past ? ' is-past' : ''}" data-fin="${e.fin || e.date}" style="--c:${th.couleur};--t:${th.teinte}">
        <div class="cal__date"><b>${d.getDate()}</b><span>${d.toLocaleDateString('fr-FR', { month: 'short' })} ${d.getFullYear()}</span></div>
        <div><h3>${esc(e.titre)}</h3><p>${esc(range)}${e.lieu ? ' · ' + esc(e.lieu) : ''}${past ? ' · <strong>terminé</strong>' : ''}</p>${e.lien ? `<p>${link(e.lien)}</p>` : ''}</div></li>`;
    };
    const up = ev.filter((e) => (e.fin || e.date) >= todayISO);
    const past = ev.filter((e) => (e.fin || e.date) < todayISO);
    extra = `<section class="section section--tint" id="calendrier" style="position:relative;--c:${t.couleur};--t:${t.teinte}">
  <div class="container">
    <div class="${reveal(0)}" style="max-width:760px;margin-bottom:30px"><span class="eyebrow">Calendrier</span><h2>Le calendrier des sorties</h2>
    <p class="lead">Les programmes détaillés sont publiés par les animateurs. Les dates ci-dessous sont modifiables dans <code>data/calendrier.json</code>.</p></div>
    <ul class="cal" style="list-style:none;padding:0;margin:0 0 28px">
      ${calendrier.rythme.map((r) => {
        const th = themeOf(r.activite);
        return `<li class="cal__item cal__item--rhythm" style="--c:${th.couleur};--t:${th.teinte}"><div class="cal__rhythm-ico">${icon('calendar')}</div><div><h3>${esc(r.quand)} · ${esc(labelFor(r.activite).titre)}</h3><p>${esc(r.quoi)}</p></div></li>`;
      }).join('')}
    </ul>
    <h3>À venir</h3>
    ${up.length ? `<ul class="cal" style="list-style:none;padding:0;margin:0 0 28px">${up.map(item).join('')}</ul>` : `<p class="empty">${icon('calendar')}<br><strong>Aucune sortie exceptionnelle n'est annoncée pour le moment.</strong><br>Le prochain programme sera publié ici par les animateurs. ${todo('Calendrier à compléter')}</p>`}
    <h3 style="margin-top:32px">Déjà passées</h3>
    <ul class="cal" style="list-style:none;padding:0;margin:0">${past.map(item).join('')}</ul>
  </div>
  <div class="volcans" aria-hidden="true"></div>
</section>`;
  }
  const body = `
<section class="section" style="padding-bottom:20px">
  <div class="container">
    <ul class="quicknav" style="--c:${t.couleur}" aria-label="Aller directement à une activité">${acts.map((a) => `<li><a href="#${a.slug}">${icon(a.icone)}${esc(a.titre)}</a></li>`).join('')}${t.slug === 'sorties' ? `<li><a href="#calendrier">${icon('calendar')}Calendrier</a></li>` : ''}</ul>
    ${acts.map((a, i) => fiche(a, i)).join('')}
  </div>
</section>
${extra}
${tryBand()}`;
  const desc = `${t.nom} au CLI Issoire : ${acts.map((a) => a.titre.toLowerCase()).join(', ')}. Jours, horaires, lieux et animateurs.`;
  pages[t.page] = layout({ file: t.page, title: `${t.court} : ${acts.map((a) => (/^Les |^[A-Z]{2,}/.test(a.titre) ? a.titre : a.titre.toLowerCase())).join(', ')}`, description: desc, hero, body });
}
themes.forEach(themePage);

/* Le club */
{
  const hero = pageHero({
    eyebrow: 'Le club', title: 'Un club chaleureux, au cœur d\'Issoire',
    lead: 'Le Club Culture et Loisirs Issoirien réunit chaque semaine des adhérents venus partager des activités, des sorties et de bons moments.',
    theme: NEUTRAL, icone: 'people',
    photos: [{ src: 'p/pho/photo-de-groupe-1.jpg' }, { src: 'j/jeu/Jeux-Societe-6-.JPG' }, { src: 'd/dan/Danse-groupe2.png' }, { src: 'f/for/formation-numerique-cli.jpeg' }]
  });
  const valeurs = [
    ['smile', 'Convivialité', 'Le club est animé dans un esprit convivial : on vient pour s\'amuser, apprendre et rencontrer du monde.', 'convivialite'],
    ['heart', 'Solidarité', 'Un esprit solidaire, jusque dans l\'activité Les Voix d\'Yss qui prête sa voix aux personnes empêchées de lire.', 'solidarite'],
    ['palette', 'Culture et loisirs', 'Le but de l\'association : organiser des activités culturelles et de loisirs pour tous.', 'ateliers'],
    ['people', 'Entraide', 'Dans les ateliers, les plus expérimentés aident les débutants : on avance ensemble, sans compétition.', 'sorties']
  ];
  const body = `
<section class="section">
  <div class="container split">
    <div class="${reveal(0)}">
      <span class="eyebrow">Présentation</span>
      <h2>Qui sommes-nous ?</h2>
      <p>Le <strong>Club Culture et Loisirs Issoirien (CLI)</strong> est une association pour seniors, bien connue des Issoiriens. Elle a pour but d'organiser, dans un esprit convivial et solidaire, des activités culturelles et de loisirs.</p>
      <p>Responsables et animateurs se donnent pour mission d'assurer un rôle d'acteur social au cœur de la cité. Cette année, le club compte <strong>${site.chiffres.adherents} adhérents</strong> et propose <strong>${site.chiffres.activites} activités</strong>, regroupées en ${site.chiffres.themes} thèmes.</p>
      <p>Le club est installé à la <strong>${esc(site.adresse.lieu)}</strong>, ${esc(site.adresse.rue)}, ${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)}.</p>
      <a class="btn btn--stone" href="contact.html">Nous rejoindre ${icon('arrow')}</a>
    </div>
    <div class="photos ${reveal(1)}" style="--c:#2A2725">
      <figure class="shot" style="grid-column:1/-1;aspect-ratio:16/9">${img('p/pho/photos-de-groupe.jpg', 'Photo de groupe des adhérents du CLI')}</figure>
      <figure class="shot">${img('j/jeu/Jeux-Societe-13-.JPG', 'Jeux de société')}</figure>
      <figure class="shot">${img('d/dan/danse1.JPG', 'Séance de danse')}</figure>
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    <div class="${reveal(0)}" style="max-width:700px;margin-bottom:34px"><span class="eyebrow">Nos valeurs</span><h2>Ce qui nous rassemble</h2></div>
    <div class="values">${valeurs.map(([ic, ti, tx, th], i) => `<div class="value ${reveal(i)}" style="--c:${themeBySlug[th].couleur}">${icon(ic)}<h3>${ti}</h3><p>${tx}</p></div>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container split" style="align-items:start">
    <div class="${reveal(0)}">
      <span class="eyebrow">Histoire</span>
      <h2>Quelques repères</h2>
      <p>Le CLI est une association très ancienne et très ancrée dans la vie locale. Cette page attend le récit de son histoire, écrit par ceux qui l'ont vécue.</p>
      <p>${todo('Texte de l\'histoire du club à compléter')}</p>
    </div>
    <ol class="timeline ${reveal(1)}" style="list-style:none">
      <li><b>${todo('Année de création')}</b><br>Fondation du Club Culture et Loisirs Issoirien.</li>
      <li><b>Mars 2004</b><br>Naissance des Voix d'Yss, à l'initiative d'Andrée Malet, avec l'aide logistique de Michel Denoux.</li>
      <li><b>Aujourd'hui</b><br>${site.chiffres.adherents} adhérents, ${site.chiffres.activites} activités et des bénévoles qui animent le club toute la semaine.</li>
    </ol>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    <div class="${reveal(0)}" style="max-width:760px;margin-bottom:34px"><span class="eyebrow">Bureau et équipe</span><h2>Ceux qui font vivre le club</h2>
    <p class="lead">Le club fonctionne grâce à ses bénévoles. Voici les responsables et animateurs des activités.</p></div>
    <h3>Le bureau</h3>
    <div class="people" style="margin-bottom:34px">${equipe.bureau.map((b, i) => `<div class="person ${reveal(i)}" style="--c:#2A2725"><b>${b.nom ? esc(b.nom) : todo('Nom à compléter')}</b><span>${esc(b.role)}</span></div>`).join('')}</div>
    <h3>Responsables et animateurs d'activités</h3>
    <div class="people">${equipe.responsables.map((r, i) => {
      const a = actBySlug[r.activite];
      const th = themeBySlug[a.theme];
      return `<div class="person ${reveal(i % 4)}" style="--c:${th.couleur}"><b>${esc(r.nom)}</b><span>${esc(r.role)}</span></div>`;
    }).join('')}</div>
    <h3 style="margin-top:34px">Les animateurs informatique</h3>
    <p>${equipe.informatique.map(esc).join(' · ')}</p>
  </div>
</section>
${tryBand('Envie de nous rejoindre ?')}`;
  pages['le-club.html'] = layout({ file: 'le-club.html', title: 'Le club : présentation, histoire, valeurs et équipe', description: `Découvrez le ${site.nom} : une association pour seniors à Issoire, ses valeurs, son histoire, son bureau et ses animateurs.`, hero, body });
}

/* Actualités */
{
  const hero = pageHero({ eyebrow: 'Actualités', title: 'Les nouvelles du club', lead: 'Chaque activité a ses propres publications. Filtrez par activité pour ne voir que ce qui vous intéresse.', theme: NEUTRAL, icone: 'sparkle' });
  const slugs = [...new Set(news.map((n) => n.activite))];
  const chips = [`<li><button class="chip" type="button" data-filter="tout" aria-pressed="true">Toutes <span class="chip__n">${news.length}</span></button></li>`]
    .concat(slugs.map((s) => `<li><button class="chip" type="button" data-filter="${s}" style="--c:${themeOf(s).couleur}" aria-pressed="false">${esc(labelFor(s).titre)} <span class="chip__n">${news.filter((n) => n.activite === s).length}</span></button></li>`))
    .join('');
  const body = `
<section class="section">
  <div class="container">
    <div data-filter-root data-target=".news-card" data-status="news-status" data-empty="news-empty">
      <p id="filtre-label" style="font-weight:700">Afficher les actualités de :</p>
      <ul class="chips" aria-labelledby="filtre-label">${chips}</ul>
    </div>
    <p id="news-status" class="sr-only" aria-live="polite"></p>
    <div class="news-grid">${news.map((n, i) => newsCard(n, i)).join('')}</div>
    <p id="news-empty" class="empty" hidden>Aucune actualité pour cette activité pour le moment.</p>
  </div>
</section>
${tryBand()}`;
  pages['actualites.html'] = layout({ file: 'actualites.html', title: 'Actualités du club, par activité', description: 'Toutes les actualités du CLI Issoire, filtrables par activité : informatique, randonnée pédestre, randonnée cycliste, ateliers…', hero, body });
}

/* Galerie */
{
  const hero = pageHero({ eyebrow: 'Galerie', title: 'Le club en images', lead: 'Sorties, ateliers, danse, jeux : les moments forts de nos adhérents, classés par activité.', theme: NEUTRAL, icone: 'camera' });
  const slugs = [...new Set(galerie.map((g) => g.activite))];
  const chips = [`<li><button class="chip" type="button" data-filter="tout" aria-pressed="true">Toutes <span class="chip__n">${galerie.length}</span></button></li>`]
    .concat(slugs.map((s) => `<li><button class="chip" type="button" data-filter="${s}" style="--c:${themeOf(s).couleur}" aria-pressed="false">${esc(labelFor(s).titre)} <span class="chip__n">${galerie.filter((g) => g.activite === s).length}</span></button></li>`))
    .join('');
  const albums = news.flatMap((n) => (n.liens || []).filter((l) => /photos\.app\.goo\.gl/.test(l.url)).map((l) => ({ ...l, groupe: n.dateLabel })));
  const body = `
<section class="section">
  <div class="container">
    <div data-filter-root data-target=".masonry__item" data-status="gal-status">
      <p id="filtre-label" style="font-weight:700">Voir les photos de :</p>
      <ul class="chips" aria-labelledby="filtre-label">${chips}</ul>
    </div>
    <p id="gal-status" class="sr-only" aria-live="polite"></p>
    <div class="masonry">${galerie.map((g) => {
      const act = labelFor(g.activite);
      const th = themeOf(g.activite);
      return `<figure class="masonry__item" data-activite="${g.activite}" style="--c:${th.couleur}"><button type="button" class="photo-btn" data-full="${esc(IMG(g.src))}" data-alt="${esc(g.alt)}" aria-label="Agrandir : ${esc(g.alt)}">${img(g.src, g.alt)}<span class="tag">${esc(act.titre)}</span></button></figure>`;
    }).join('')}</div>
    <p class="lead" style="margin-top:20px">${icon('camera')} Les photos du club s'enrichissent au fil des activités : les responsables peuvent en ajouter dans <code>data/galerie.json</code>.</p>
  </div>
</section>
<section class="section section--tint">
  <div class="container">
    <h2>Albums photo des voyages</h2>
    <p class="lead">Les albums complets des voyages des randonneurs, jour après jour.</p>
    ${['Voyage 2025', '17 au 23 juin 2024'].map((g) => `<h3 style="margin-top:24px">${esc(g === 'Voyage 2025' ? 'Voyage 2025' : 'Voyage 2024, Alpes du Sud (' + g + ')')}</h3><div class="albums">${albums.filter((a) => a.groupe === g).map((a) => `<a href="${esc(a.url)}"${NEWTAB}>${icon('camera')}${esc(a.texte)}<span class="sr-only"> (nouvel onglet)</span></a>`).join('')}</div>`).join('')}
  </div>
</section>
<dialog class="lightbox" id="lightbox" aria-label="Photo agrandie">
  <div class="lightbox__inner">
    <button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer">${icon('close')}</button>
    <button class="lightbox__btn lightbox__prev" type="button" aria-label="Photo précédente">${icon('arrow')}</button>
    <img src="" alt="">
    <p class="lightbox__cap"></p>
    <button class="lightbox__btn lightbox__next" type="button" aria-label="Photo suivante">${icon('arrow')}</button>
  </div>
</dialog>
${tryBand()}`;
  pages['galerie.html'] = layout({ file: 'galerie.html', title: 'Galerie photos, classées par activité', description: 'Les photos du CLI Issoire par activité : randonnées, danse, jeux de société, peinture, informatique, voyages.', hero, body });
}

/* Contact */
{
  const a = site.adresse;
  const hero = pageHero({ eyebrow: 'Contact et adhésion', title: 'Nous contacter, nous rejoindre', lead: 'Une question ? Une envie de venir essayer ? Écrivez-nous, appelez-nous ou passez le samedi matin.', theme: NEUTRAL, icone: 'mail', photos: [{ src: 'p/pho/photo-de-groupe-1.jpg' }, { src: 'j/jeu/Jeux-Societe-9-.JPG' }] });
  const opts = themes.map((t) => `<optgroup label="${esc(t.court)}">${activites.filter((x) => x.theme === t.slug).map((x) => `<option value="${x.slug}">${esc(x.titre)}</option>`).join('')}</optgroup>`).join('');
  const bbox = `${(a.longitude - 0.006).toFixed(4)},${(a.latitude - 0.003).toFixed(4)},${(a.longitude + 0.006).toFixed(4)},${(a.latitude + 0.003).toFixed(4)}`;
  const body = `
<section class="section">
  <div class="container contact-grid">
    <div>
      <div class="card ${reveal(0)}">
        <h2 style="font-size:1.7rem">Coordonnées</h2>
        <ul class="info-list">
          <li><span class="bubble">${icon('pin')}</span><div><b>${esc(a.lieu)}</b>${esc(a.rue)}<br>${esc(a.codePostal)} ${esc(a.ville)}</div></li>
          <li><span class="bubble">${icon('phone')}</span><div><b>Téléphone</b><a href="tel:${site.telephone.replace(/\s/g, '')}">${esc(site.telephone)}</a> (Maison des associations)<br><a href="tel:${site.telephonePermanence.replace(/\s/g, '')}">${esc(site.telephonePermanence)}</a> (permanence)</div></li>
          <li><span class="bubble">${icon('mail')}</span><div><b>Courriel</b><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></div></li>
          <li><span class="bubble">${icon('clock')}</span><div><b>Permanence</b>${esc(site.permanence.charAt(0).toUpperCase() + site.permanence.slice(1))}</div></li>
          <li><span class="bubble">${icon('user')}</span><div><b>Personne à contacter</b>${esc(site.contactPrincipal.nom)}, ${esc(site.contactPrincipal.role.toLowerCase())}</div></li>
        </ul>
      </div>
      <div class="card ${reveal(1)}">
        <h2 style="font-size:1.7rem">Où nous trouver ?</h2>
        <iframe class="map" title="Plan : Maison des associations, 20 rue du Palais, Issoire" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${a.latitude}%2C${a.longitude}"></iframe>
        <p style="margin-top:14px"><a class="btn btn--stone" href="https://www.openstreetmap.org/?mlat=${a.latitude}&amp;mlon=${a.longitude}#map=17/${a.latitude}/${a.longitude}"${NEWTAB}>${icon('pin')}Ouvrir le plan<span class="sr-only"> (nouvel onglet)</span></a></p>
      </div>
      <div class="card ${reveal(2)}" style="border-top:10px solid var(--sun)">
        <h2 style="font-size:1.7rem">Pour rejoindre le club</h2>
        <ol class="steps">
          <li><strong>Venez nous rencontrer</strong> à la permanence ${esc(site.permanence)}.</li>
          <li><strong>Essayez une activité</strong> : indiquez celle qui vous tente, nous vous orienterons.</li>
          <li><strong>Inscrivez-vous</strong> : les inscriptions ont lieu à la rentrée, fin août et début septembre.</li>
        </ol>
        <p>Cotisation annuelle, pièces à fournir et modalités d'inscription : ${todo('Texte d\'attente — à compléter par le bureau')}</p>
        <p style="margin-bottom:0"><a class="btn btn--stone" href="${esc(site.espaceAdherent.url)}"${NEWTAB}>${icon('key')}Espace adhérent<span class="sr-only"> (nouvel onglet)</span></a></p>
      </div>
    </div>
    <div class="card ${reveal(1)}" id="formulaire">
      <h2 style="font-size:1.9rem">Écrivez-nous</h2>
      <p>Remplissez le formulaire : nous vous répondrons dès que possible.</p>
      <form class="form" name="contact" method="POST" action="/merci.html" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p class="trap" aria-hidden="true"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="field"><label for="f-nom">Votre nom et prénom</label><input id="f-nom" name="nom" type="text" required autocomplete="name"></div>
        <div class="field"><label for="f-email">Votre adresse e-mail</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="f-tel">Votre téléphone <span class="hint">(facultatif)</span></label><input id="f-tel" name="telephone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-activite">Activité concernée</label>
          <select id="f-activite" name="activite"><option value="general">Une question générale</option>${opts}</select></div>
        <div class="field"><label for="f-message">Votre message</label><textarea id="f-message" name="message" required></textarea></div>
        <div class="check"><input id="f-rgpd" name="consentement" type="checkbox" required><label for="f-rgpd">J'accepte que ces informations soient utilisées pour répondre à ma demande (voir les <a href="mentions-legales.html#donnees">mentions légales</a>).</label></div>
        <button class="btn btn--stone btn--big" type="submit">${icon('mail')}Envoyer mon message</button>
      </form>
    </div>
  </div>
</section>`;
  pages['contact.html'] = layout({ file: 'contact.html', title: 'Contact et adhésion', description: `Contactez le ${site.nom} : formulaire, adresse (${a.rue}, ${a.ville}), téléphone, permanence du samedi et informations pour rejoindre le club.`, hero, body });
}

/* Mentions légales */
{
  const hero = pageHero({ eyebrow: 'Informations légales', title: 'Mentions légales', lead: 'Éditeur, hébergement, données personnelles et droits de chacun.', theme: NEUTRAL, icone: 'book' });
  const a = site.adresse;
  const body = `
<section class="section">
  <div class="container" style="max-width:860px">
    <div class="card legal">
      <h2>Éditeur du site</h2>
      <p><strong>${esc(site.nom)} (${esc(site.sigle)})</strong>, association.<br>${esc(a.lieu)}, ${esc(a.rue)}, ${esc(a.codePostal)} ${esc(a.ville)}<br>Téléphone : ${esc(site.telephone)} · Courriel : <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
      <p>Directeur de la publication : ${todo('Nom du président ou de la présidente — à compléter')}<br>Identifiant de l'association (numéro RNA ou SIRET) : ${todo('À compléter')}</p>
      <h2>Hébergement</h2>
      <p>Site hébergé par Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com"${NEWTAB}>netlify.com</a>.</p>
      <h2 id="donnees">Données personnelles</h2>
      <p>Le formulaire de contact recueille votre nom, votre adresse e-mail, votre téléphone (facultatif) et votre message. Ces données servent uniquement à répondre à votre demande. Elles ne sont ni vendues ni cédées, et sont conservées le temps nécessaire au traitement de votre demande. Le formulaire est traité par le service Netlify Forms.</p>
      <p>Conformément au règlement général sur la protection des données (RGPD) et à la loi « Informatique et libertés », vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité. Pour l'exercer, écrivez à <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr/fr/plaintes"${NEWTAB}>cnil.fr</a>).</p>
      <h2>Cookies et suivi</h2>
      <p>Ce site n'utilise aucun cookie de suivi ni outil de mesure d'audience. Le plan de la page Contact est fourni par OpenStreetMap, et certaines photos sont chargées depuis les archives de l'ancien site du club (Internet Archive) : ces services peuvent recevoir votre adresse IP lors de l'affichage.</p>
      <h2>Photographies</h2>
      <p>Les photos présentent des activités du club. Toute personne reconnaissable qui souhaite le retrait d'une image peut écrire à <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> : elle sera retirée rapidement.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les textes et images du site appartiennent au ${esc(site.nom)} ou à leurs auteurs. Le logo et les contenus proviennent de l'ancien site www.cli63.com du club. Polices : Fraunces et Atkinson Hyperlegible (licence SIL OFL).</p>
    </div>
  </div>
</section>`;
  pages['mentions-legales.html'] = layout({ file: 'mentions-legales.html', title: 'Mentions légales', description: `Mentions légales du site du ${site.nom} : éditeur, hébergeur, données personnelles, cookies et droit à l'image.`, hero, body });
}

/* Merci + 404 */
pages['merci.html'] = layout({
  file: 'merci.html', title: 'Message envoyé', description: 'Votre message a bien été envoyé au CLI Issoire.',
  body: `<section class="section"><div class="container" style="max-width:760px;text-align:center"><span class="page-hero__icon" style="background:var(--sun);color:var(--ink)" aria-hidden="true">${icon('mail')}</span><h1>Merci, votre message est envoyé !</h1><p class="lead" style="margin-inline:auto">Nous vous répondrons dès que possible. En attendant, découvrez nos activités.</p><p><a class="btn btn--stone btn--big" href="index.html">Retour à l'accueil</a></p></div></section>`
});
pages['404.html'] = layout({
  file: '404.html', title: 'Page introuvable', description: 'Cette page n\'existe pas.',
  body: `<section class="section"><div class="container" style="max-width:760px;text-align:center"><h1>Oups, cette page est introuvable</h1><p class="lead" style="margin-inline:auto">Le lien est peut-être ancien. Retournez à l'accueil ou choisissez un thème.</p><p><a class="btn btn--stone btn--big" href="/index.html">Retour à l'accueil</a></p></div></section>`
});

/* ---------- écriture ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(ROOT, 'public'), DIST, { recursive: true });
for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(DIST, file), html);

const urls = site.pagesMenu.map(([f]) => (f === 'index.html' ? '' : f));
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`OK : ${Object.keys(pages).length} pages écrites dans dist/`);
