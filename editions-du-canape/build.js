#!/usr/bin/env node
/*
 * Générateur du site des éditions du Canapé.
 * Lit les fichiers data/*.json et fabrique toutes les pages dans dist/.
 * Aucune dépendance : il suffit de Node.js (« node build.js »).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const RACINE = __dirname;
const DIST = path.join(RACINE, 'dist');
const lire = (f) => JSON.parse(fs.readFileSync(path.join(RACINE, 'data', f), 'utf8'));

const site = lire('site.json');
// Sur Netlify, la variable URL contient l'adresse principale du site (netlify.app, puis le nom de domaine une fois branché).
if (process.env.URL && /^https?:\/\//.test(process.env.URL)) site.url = process.env.URL.replace(/\/$/, '');
const livres = lire('livres.json').sort((a, b) => (a.ordre || 99) - (b.ordre || 99));
const projets = lire('projets.json');
const carnet = lire('carnet.json').sort((a, b) => b.date.localeCompare(a.date));
const librairies = lire('librairies.json');
const carte = JSON.parse(fs.readFileSync(path.join(RACINE, 'src', 'carte.json'), 'utf8'));

const AP = 'à préciser';
const CATEGORIES = {
  jeunesse: 'Jeunesse',
  poesie: 'Poésie',
  'photo-art': 'Photographie et art',
  bilingue: 'Bilingue',
  ateliers: 'Livres d’ateliers',
  recherche: 'Recherche'
};
const THEMES = { fabrication: 'Fabrication', rencontres: 'Rencontres', expositions: 'Expositions', ateliers: 'Ateliers' };
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const VERSION = Date.now().toString(36);

/* ---------- outils ---------- */
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Mise en forme légère : *italique*, [texte](lien), <br> autorisé
function md(s) {
  if (s == null) return '';
  let t = esc(s).replace(/&lt;br&gt;/g, '<br>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, url) => `<a href="${url}"${/^https?:/.test(url) ? ' rel="noopener"' : ''}>${txt}</a>`);
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return t;
}
const plain = (s) => String(s || '').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/<br>/g, ' ');
const paras = (arr, cls) => (arr || []).map((p) => `<p${cls ? ` class="${cls}"` : ''}>${md(p)}</p>`).join('\n');
const aPreciser = (v) => (v == null || v === '' || v === AP ? `<span class="a-preciser" title="Information à compléter dans les fichiers de données">${AP}</span>` : md(v));
const prixTexte = (l) => (l.prix != null ? `${String(l.prix.toFixed(2)).replace(/\.00$/, '').replace('.', ',')} €` : l.disponibilite === 'hors commerce' ? 'hors commerce' : l.disponibilite === 'épuisé' ? 'épuisé' : AP);
const dateLongue = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d === 1 ? '1er' : d} ${MOIS[m - 1]} ${y}`; };
const dateCourte = (iso) => { const [y, m, d] = iso.split('-').map(Number); return { j: String(d).padStart(2, '0'), m: MOIS[m - 1], a: y }; };
const titreCourt = (l) => l.titreCourt || l.titre;
const livre = (slug) => livres.find((l) => l.slug === slug);
const projet = (slug) => projets.find((p) => p.slug === slug);
const lib = (id) => librairies.find((l) => l.id === id);

/* ---------- images : <picture> avec WebP, vignettes et dimensions ---------- */
function tailleImage(fichier) {
  try {
    const b = fs.readFileSync(fichier);
    if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if ((m >= 0xc0 && m <= 0xc3) || (m >= 0xc5 && m <= 0xc7) || (m >= 0xc9 && m <= 0xcb) || (m >= 0xcd && m <= 0xcf)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        i += 2 + len;
      }
    }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const t = b.toString('ascii', 12, 16);
      if (t === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
      if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      if (t === 'VP8L') { const n = b.readUInt32LE(21); return { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) }; }
    }
  } catch (e) { /* image manquante */ }
  return null;
}
const existe = (rel) => fs.existsSync(path.join(RACINE, rel));
const imagesManquantes = [];
function img(image, opts = {}) {
  if (!image || !image.src) return '';
  const src = image.src;
  const t = tailleImage(path.join(RACINE, src));
  if (!t) imagesManquantes.push(src);
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  const petit = existe(`${base}-640${ext}`);
  const webp = existe(`${base}.webp`);
  const petitWebp = existe(`${base}-640.webp`);
  const sizes = opts.sizes || '(max-width: 700px) 100vw, 50vw';
  const lazy = opts.eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  const w = t ? t.w : 800, h = t ? t.h : 800;
  const pw = Math.min(640, w), ph = Math.round(h * pw / w);
  const srcset = (b, e, hasSmall) => (hasSmall && w > 640 ? `/${b}-640${e} 640w, /${b}${e} ${w}w` : `/${b}${e} ${w}w`);
  const sources = webp ? `<source type="image/webp" srcset="${srcset(base, '.webp', petitWebp)}" sizes="${sizes}">` : '';
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  const fallback = opts.small && petit ? `/${base}-640${ext}` : `/${src}`;
  return `<picture${cls}>${sources}<img src="${fallback}" srcset="${srcset(base, ext, petit)}" sizes="${sizes}" width="${opts.small && petit ? pw : w}" height="${opts.small && petit ? ph : h}" alt="${esc(image.alt || '')}" ${lazy}></picture>`;
}
const urlImage = (src) => `${site.url}/${src}`;

/* ---------- gabarit commun ---------- */
const NAV = [
  ['/', 'Accueil'],
  ['/catalogue/', 'Catalogue'],
  ['/a-paraitre/', 'À paraître'],
  ['/livres-en-partage/', 'Livres en partage'],
  ['/carnet/', 'Carnet'],
  ['/la-maison/', 'La maison'],
  ['/contact/', 'Contact']
];

const CANAPE_SVG = `<svg class="picto-canape" viewBox="0 0 64 36" aria-hidden="true" focusable="false"><path d="M8 20V11c0-3 2-5 5-5h38c3 0 5 2 5 5v9M4 20c0-2 1.5-3.5 3.5-3.5S11 18 11 20v6h42v-6c0-2 1.5-3.5 3.5-3.5S60 18 60 20v8c0 1.5-1 2.5-2.5 2.5h-51C5 30.5 4 29.5 4 28v-8zM11 22h42M10 30.5v3M54 30.5v3M32 6v16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function page({ chemin, titre, description, contenu, jsonld = [], image, classe = '', type = 'website' }) {
  const url = site.url + chemin;
  const titreComplet = chemin === '/' ? `${site.nom} · maison d’édition associative entre Gascogne et Touraine` : `${titre} · éditions du Canapé`;
  const og = image ? urlImage(image) : urlImage('images/livres/miette-la-mouette/couverture.jpg');
  const nav = NAV.map(([href, label]) => {
    const actif = href === '/' ? chemin === '/' : chemin.startsWith(href) || (href === '/catalogue/' && chemin.startsWith('/livres/'));
    return `<li><a href="${href}"${actif ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('');
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titreComplet)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="éditions du Canapé">
<meta property="og:title" content="${esc(titre)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f3ecdf">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/fraunces-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrumentsans-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css?v=${VERSION}">
<script>document.documentElement.classList.add('js')</script>
${ld}
</head>
<body class="${classe}">
<a class="lien-evitement" href="#contenu">Aller au contenu</a>
<header class="entete">
  <div class="entete__inner">
    <a class="marque" href="/">${CANAPE_SVG}<span class="marque__texte"><span class="marque__petit">les éditions du</span> <span class="marque__grand">Canapé</span><span class="visuellement-cache"> — accueil</span></span></a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Menu"><span class="burger__barres" aria-hidden="true"></span><span class="burger__label">Menu</span></button>
    <nav class="nav" id="menu-principal" aria-label="Navigation principale">
      <ul>${nav}</ul>
    </nav>
    <a class="bouton bouton--encre bouton--commander" href="/contact/?sujet=commande#formulaire">Commander</a>
  </div>
</header>
<main id="contenu" tabindex="-1">
${contenu}
</main>
<footer class="pied">
  <div class="pied__inner grille">
    <div class="pied__marque">
      <a class="marque marque--pied" href="/">${CANAPE_SVG}<span class="marque__texte"><span class="marque__petit">les éditions du</span> <span class="marque__grand">Canapé</span></span></a>
      <p>${md(site.presentation[0])}</p>
      <p class="tampon tampon--petit" aria-hidden="true">éditions du Canapé · association loi 1901</p>
    </div>
    <div>
      <h2 class="pied__titre">Nous écrire</h2>
      <address>
        ${esc(site.nom)}<br>${esc(site.adresse.rue)}<br>${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)}<br>
        <a href="mailto:${site.email}">${site.email}</a>
      </address>
      <p><a href="/contact/">Formulaire de contact et de commande</a></p>
    </div>
    <div>
      <h2 class="pied__titre">Le Canapé</h2>
      <ul class="pied__liens">
        <li><a href="/contact/#librairies">Où trouver nos livres</a></li>
        <li><a href="/livres-en-partage/">Faire un livre avec une classe</a></li>
        <li><a href="/carnet/">Le Carnet</a></li>
        <li><a href="/mentions-legales/">Mentions légales et confidentialité</a></li>
      </ul>
    </div>
    <p class="pied__legal">${esc(site.nom)} · ${esc(site.adresse.rue)}, ${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)} · ${esc(site.statut)} · RNA ${esc(site.rna)} · SIRET ${esc(site.siret)}</p>
  </div>
</footer>
<script src="/assets/js/main.js?v=${VERSION}" defer></script>
</body>
</html>`;
}

/* ---------- données structurées ---------- */
const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.url}/#organisation`,
  name: 'éditions du Canapé',
  alternateName: 'les éditions du Canapé',
  url: site.url,
  logo: `${site.url}/assets/favicon.svg`,
  email: site.email,
  description: site.description,
  foundingDate: '2023',
  address: { '@type': 'PostalAddress', streetAddress: site.adresse.rue, postalCode: site.adresse.codePostal, addressLocality: site.adresse.ville, addressCountry: 'FR' },
  identifier: [{ '@type': 'PropertyValue', propertyID: 'RNA', value: site.rna }, { '@type': 'PropertyValue', propertyID: 'SIRET', value: site.siret.replace(/\s/g, '') }],
  nonprofitStatus: 'Nonprofit'
};
const personnes = (noms) => noms.map((n) => ({ '@type': /^(la|les|l’)\s/.test(n) ? 'Organization' : 'Person', name: n }));
function bookLD(l) {
  const o = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${site.url}/livres/${l.slug}/#livre`,
    name: l.titre,
    alternativeHeadline: l.sousTitre,
    url: `${site.url}/livres/${l.slug}/`,
    image: urlImage(l.couverture.src),
    description: plain(l.presentation[0]),
    inLanguage: l.langues || 'fr',
    author: personnes(l.auteurs),
    publisher: { '@id': `${site.url}/#organisation`, '@type': 'Organization', name: 'éditions du Canapé' },
    datePublished: l.dateISO,
    numberOfPages: l.pages,
    bookFormat: l.reliure && l.reliure.includes('rigide') ? 'https://schema.org/Hardcover' : 'https://schema.org/Paperback'
  };
  if (l.illustrateurs && l.illustrateurs.length) o.illustrator = personnes(l.illustrateurs);
  if (l.isbn && l.isbn !== AP) o.isbn = l.isbn;
  if (l.prix != null) {
    o.offers = { '@type': 'Offer', price: l.prix.toFixed(2), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${site.url}/contact/?sujet=commande&livre=${l.slug}`, seller: { '@id': `${site.url}/#organisation` } };
  }
  return o;
}
const fil = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: site.url + u })) });

/* ---------- composants ---------- */
const filAriane = (items) => `<nav class="ariane" aria-label="Fil d’Ariane"><ol>${items.map(([n, u], i) => (i < items.length - 1 ? `<li><a href="${u}">${esc(n)}</a></li>` : `<li aria-current="page">${esc(n)}</li>`)).join('')}</ol></nav>`;
const reperes = '<span class="reperes" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';

function lienCommande(l, cls = '') {
  if (l.disponibilite === 'en vente') return `<a class="bouton bouton--vermillon ${cls}" href="/contact/?sujet=commande&amp;livre=${l.slug}#formulaire">Commander ce livre</a>`;
  if (l.disponibilite === 'hors commerce') return `<a class="bouton bouton--contour ${cls}" href="/contact/?sujet=autre&amp;livre=${l.slug}#formulaire">Demander un exemplaire</a>`;
  return `<a class="bouton bouton--contour ${cls}" href="/contact/?sujet=autre&amp;livre=${l.slug}#formulaire">Nous écrire</a>`;
}

function livreObjet(l, opts = {}) {
  return `<div class="livre-objet${opts.grand ? ' livre-objet--grand' : ''}">${img(l.couverture, { sizes: opts.sizes || '(max-width: 700px) 70vw, 320px', eager: opts.eager, small: !opts.grand })}</div>`;
}

function carteLivre(l) {
  const cats = (l.categories || []).join(' ');
  const auteurs = l.credits.map((c) => `<span>${md(c.role)} : ${md(c.noms)}</span>`).slice(0, 2).join('');
  return `<li class="carte-livre revele" data-categories="${cats}" data-recherche="${esc((l.titre + ' ' + (l.sousTitre || '') + ' ' + l.credits.map((c) => c.noms).join(' ')).toLowerCase())}">
  <a class="carte-livre__lien" href="/livres/${l.slug}/">
    ${livreObjet(l)}
    <span class="carte-livre__texte">
      <span class="carte-livre__titre">${esc(l.titre)}</span>
      ${l.sousTitre ? `<span class="carte-livre__sous">${esc(l.sousTitre)}</span>` : ''}
      <span class="carte-livre__credits">${auteurs}</span>
    </span>
  </a>
  <div class="carte-livre__pied">
    <span class="prix${l.prix == null ? ' prix--hc' : ''}">${prixTexte(l)}</span>
    <a class="lien-fleche" href="/livres/${l.slug}/" aria-label="Voir le livre ${esc(l.titre)}">Voir le livre</a>
  </div>
  <ul class="etiquettes" aria-label="Catégories">${(l.categories || []).map((c) => `<li>${CATEGORIES[c]}</li>`).join('')}</ul>
</li>`;
}

function statutBadge(s) {
  const cls = { 'sous presse': 'presse', 'en préparation': 'prepa', 'bientôt disponible': 'bientot', 'à paraître': 'aparaitre' }[s] || 'apreciser';
  return `<span class="statut statut--${cls}">${s === AP ? 'statut à préciser' : esc(s)}</span>`;
}

function carteProjet(p, niveau = 'h3') {
  const art = carnet.filter((a) => (a.projets || []).includes(p.slug));
  return `<li class="carte-projet revele">
  <a class="carte-projet__visuel" href="/a-paraitre/${p.slug}/" tabindex="-1" aria-hidden="true">${img(p.vignette, { sizes: '(max-width: 700px) 90vw, 360px', small: true })}${reperes}</a>
  <div class="carte-projet__texte">
    ${statutBadge(p.statut)}
    <${niveau} class="carte-projet__titre"><a href="/a-paraitre/${p.slug}/">${esc(p.titreCourt || p.titre)}</a></${niveau}>
    <p class="carte-projet__auteurs">${md(p.auteurs)}</p>
    ${p.partenaires && p.partenaires.length ? `<p class="carte-projet__partenaires"><span class="petites-caps">Avec</span> ${p.partenaires.map(esc).join(', ')}</p>` : ''}
    ${p.statutNote ? `<p class="carte-projet__note">${md(p.statutNote)}</p>` : ''}
    ${art.length ? `<p class="carte-projet__carnet">Au Carnet : ${art.map((a) => `<a href="/carnet/${a.slug}/">${esc(a.titre)}</a>`).join(', ')}</p>` : ''}
  </div>
</li>`;
}

function carteArticle(a, opts = {}) {
  const d = dateCourte(a.date);
  const lies = [...(a.livres || []).map((s) => livre(s)).filter(Boolean).map((l) => `<a href="/livres/${l.slug}/">${esc(titreCourt(l))}</a>`), ...(a.projets || []).map((s) => projet(s)).filter(Boolean).map((p) => `<a href="/a-paraitre/${p.slug}/">${esc(p.titreCourt || p.titre)}</a>`)];
  return `<li class="entree revele" data-themes="${a.themes.join(' ')}">
  <time class="entree__date" datetime="${a.date}"><span class="entree__jour">${d.j}</span> <span class="entree__mois">${d.m}</span> <span class="entree__annee">${d.a}</span></time>
  <article class="entree__corps">
    <a class="entree__image" href="/carnet/${a.slug}/" tabindex="-1" aria-hidden="true">${img(a.photos[0], { sizes: '(max-width: 700px) 90vw, 260px', small: true })}</a>
    <div>
      <p class="entree__themes">${a.themes.map((t) => THEMES[t]).join(' · ')}</p>
      <${opts.niveau || 'h2'} class="entree__titre"><a href="/carnet/${a.slug}/">${esc(a.titre)}</a></${opts.niveau || 'h2'}>
      <p class="entree__extrait">${md(a.texte[0])}</p>
      ${lies.length ? `<p class="entree__lies"><span class="petites-caps">Livres liés</span> ${lies.join(' · ')}</p>` : ''}
    </div>
  </article>
</li>`;
}

function listeLibrairies(ids, opts = {}) {
  const ls = (ids || librairies.map((l) => l.id)).map(lib).filter(Boolean);
  return `<ul class="librairies${opts.compact ? ' librairies--compact' : ''}">${ls.map((l) => {
    const titres = livres.filter((b) => b.librairies.includes(l.id));
    return `<li class="librairie">
    <h3 class="librairie__nom">${l.site ? `<a href="${l.site}" rel="noopener">${esc(l.nom)}<span class="visuellement-cache"> (site de la librairie)</span></a>` : esc(l.nom)}</h3>
    <p class="librairie__lieu">${esc(l.type)} · ${esc(l.adresse)}, ${esc(l.codePostal)} ${esc(l.ville)}</p>
    ${opts.compact ? '' : `<p class="librairie__titres">${titres.map((b) => `<a href="/livres/${b.slug}/">${esc(titreCourt(b))}</a>`).join(' · ')}</p>`}
  </li>`;
  }).join('')}</ul>`;
}

function carteLibrairies() {
  const P = (lat, lon) => [((lon - carte.lon0) * carte.cos * carte.k).toFixed(1), ((carte.lat0 - lat) * carte.k).toFixed(1)];
  const villes = {};
  librairies.forEach((l) => { (villes[l.ville] = villes[l.ville] || { lat: l.lat, lon: l.lon, noms: [] }).noms.push(l.nom); });
  const siege = P(45.3147, -0.5394);
  const points = Object.entries(villes).map(([v, o]) => { const [x, y] = P(o.lat, o.lon); const gauche = +x > carte.w * .55; const tx = gauche ? +x - 10 : +x + 10; const ta = gauche ? ' text-anchor="end"' : '';
    return `<g class="carte__point"><circle cx="${x}" cy="${y}" r="5"/><circle cx="${x}" cy="${y}" r="11" class="carte__halo"/><text x="${tx}" y="${+y - 8}"${ta}>${esc(v)}</text>${o.noms.map((n, k) => `<text x="${tx}" y="${+y + 6 + k * 11}" class="carte__noms"${ta}>${esc(n)}</text>`).join('')}</g>`; }).join('');
  return `<figure class="carte">
  <svg viewBox="0 0 ${carte.w} ${carte.h}" role="img" aria-labelledby="carte-titre carte-desc">
    <title id="carte-titre">Carte des librairies où trouver nos livres</title>
    <desc id="carte-desc">Les librairies se trouvent à ${Object.keys(villes).join(', ')}. Le Canapé est installé à Boisredon, en Charente-Maritime.</desc>
    <defs><pattern id="trame" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".7"/></pattern></defs>
    <g class="carte__regions">${carte.regions.map((r) => `<path d="${r.d}"><title>${esc(r.nom)}</title></path>`).join('')}</g>
    <g class="carte__siege"><path d="M${siege[0]} ${+siege[1] - 9}l7 13h-14z"/><text x="${+siege[0] + 10}" y="${+siege[1] + 4}">le Canapé (Boisredon)</text></g>
    ${points}
  </svg>
  <figcaption>Fond de carte : régions de France (données ouvertes). Les points indiquent les villes des librairies.</figcaption>
</figure>`;
}

function galerie(images, titre, opts = {}) {
  if (!images || !images.length) return '';
  return `<div class="feuilletage${opts.classe ? ' ' + opts.classe : ''}" data-feuilletage>
  <ul class="feuilletage__planche">${images.map((im, i) => `<li><button type="button" class="feuilletage__vignette" data-index="${i}" data-src="/${im.src}" data-webp="${existe(im.src.replace(/\.\w+$/, '.webp')) ? '/' + im.src.replace(/\.\w+$/, '.webp') : ''}" aria-label="Agrandir l’image ${i + 1} sur ${images.length} : ${esc(im.alt)}">${img(im, { sizes: '(max-width: 700px) 45vw, 220px', small: true })}</button></li>`).join('')}</ul>
  <p class="feuilletage__aide">${esc(titre)} — touchez une image pour feuilleter en plein écran.</p>
</div>`;
}

const ctaFinal = (titre = 'Un projet de livre ? Écrivez-nous.', texte = site.contact.projet, lien = '/contact/?sujet=projet#formulaire', bouton = 'Proposer un projet') => `<section class="appel">
  <div class="appel__inner">${reperes}
    <h2 class="appel__titre">${esc(titre)}</h2>
    <p>${md(texte)}</p>
    <a class="bouton bouton--vermillon" href="${lien}">${esc(bouton)}</a>
  </div>
</section>`;

/* ---------- pages ---------- */
const pages = [];
const ajouter = (chemin, html) => pages.push({ chemin, html });

/* Accueil */
(function accueil() {
  const miette = livres.find((l) => l.nouveaute) || livres[0];
  const etagere = livres.map((l) => `<li class="etagere__livre"><a href="/livres/${l.slug}/" aria-label="${esc(l.titre)}${l.sousTitre ? ' — ' + esc(l.sousTitre) : ''}">${livreObjet(l, { eager: l.ordre <= 3, sizes: '(max-width: 700px) 46vw, 240px' })}<span class="etagere__titre" aria-hidden="true">${esc(titreCourt(l))}</span></a></li>`).join('');
  const projetsAccueil = projets.filter((p) => !p.archive).slice(0, 4);
  const contenu = `
<section class="heros">
  <div class="heros__texte grille">
    <p class="surtitre">Maison d’édition associative · depuis 2023</p>
    <h1 class="heros__titre"><span class="heros__les">les éditions du</span> Canapé</h1>
    <p class="heros__chapo">${md(site.presentation[0]).replace('entre Gascogne et Touraine', '<em>entre Gascogne et Touraine</em>')}</p>
    <p class="heros__mots"><span>livres illustrés</span><span>micro-édition auto-diffusée</span><span>livres faits à plusieurs</span></p>
    <div class="heros__actions"><a class="bouton bouton--encre" href="/catalogue/">Feuilleter le catalogue</a><a class="lien-fleche" href="/la-maison/">Qui sommes-nous ?</a></div>
  </div>
  <div class="etagere" data-etagere>
    <h2 class="visuellement-cache">L’étagère du Canapé</h2>
    <ul class="etagere__rang" tabindex="0" aria-label="Étagère des ${livres.length} livres du catalogue, défilement horizontal">${etagere}</ul>
    <div class="etagere__planche" aria-hidden="true"></div>
  </div>
</section>

<section class="section grille presentation">
  <div class="presentation__col">
    <h2 class="titre-section"><span class="petites-caps">Le Canapé</span> Tout le monde s’y assied côte à côte</h2>
  </div>
  <div class="presentation__texte lettrine">${paras(site.presentation.slice(1))}</div>
</section>

<section class="section nouveaute" aria-labelledby="nouveaute-titre">
  <div class="grille nouveaute__grille">
    <div class="nouveaute__visuel revele">${livreObjet(miette, { grand: true, sizes: '(max-width: 700px) 80vw, 420px' })}
      <div class="nouveaute__gravures">${(miette.images || []).slice(0, 3).map((im) => img(im, { sizes: '160px', small: true })).join('')}</div>
    </div>
    <div class="nouveaute__texte">
      <p class="surtitre"><span class="tampon">Nouveauté</span> ${esc(miette.date)}</p>
      <h2 id="nouveaute-titre" class="titre-livre">${esc(miette.titre)}</h2>
      <p class="nouveaute__credits">${miette.credits.slice(0, 2).map((c) => `${md(c.role)} : ${md(c.noms)}`).join(' · ')}</p>
      <p class="chapo">${md(miette.accroche)}</p>
      <p>${md(miette.presentation[0])}</p>
      <p class="nouveaute__prix"><span class="prix prix--grand">${prixTexte(miette)}</span> <span class="nouveaute__fiche">${esc(miette.reliure)} · ${miette.pages} pages · ${esc(miette.format)}</span></p>
      <div class="actions">${lienCommande(miette)}<a class="lien-fleche" href="/livres/${miette.slug}/">Feuilleter le livre</a></div>
    </div>
  </div>
</section>

<section class="section grille" aria-labelledby="aparaitre-titre">
  <div class="entete-section">
    <h2 id="aparaitre-titre" class="titre-section"><span class="petites-caps">Dans les cartons</span> À paraître</h2>
    <p>${site.accroches.aParaitre.map(esc).join(' ')}</p>
    <a class="lien-fleche" href="/a-paraitre/">Tous les projets</a>
  </div>
  <ul class="grille-projets grille-projets--accueil">${projetsAccueil.map((p) => carteProjet(p)).join('')}</ul>
</section>

<section class="section partage-accroche" aria-labelledby="partage-titre">
  <div class="grille partage-accroche__grille">
    <div class="partage-accroche__images" aria-hidden="true">
      ${img(livre('bestiaire-monstrueux').images[2], { sizes: '200px', small: true, cls: 'pa-1' })}
      ${img(livre('chroniques-botaniques').images[0], { sizes: '200px', small: true, cls: 'pa-2' })}
      ${img(livre('serie-b').images[1], { sizes: '200px', small: true, cls: 'pa-3' })}
    </div>
    <div>
      <p class="surtitre">Livres en partage</p>
      <h2 id="partage-titre" class="titre-section">Des livres faits avec des classes et des chercheurs</h2>
      <p class="chapo">« On fera de l’éducation populaire, des projets pédagogiques qui mettront en relation des élèves éloignés du livre et le monde universitaire. »</p>
      <p>Le <em>Bestiaire Monstrueux</em>, <em>Série B</em> et les <em>Chroniques Botaniques</em> sont nés dans les classes du CFAE de Reignac et de l’école de Pleine-Selve ; <em>Miette la mouette</em>, l’<em>Atelier de lecture de planches</em> ou <em>Monet, peindre le temps</em> avec le laboratoire InTRu de l’université de Tours.</p>
      <a class="bouton bouton--contour" href="/livres-en-partage/">Découvrir la démarche</a>
    </div>
  </div>
</section>

<section class="section grille" aria-labelledby="carnet-titre">
  <div class="entete-section">
    <h2 id="carnet-titre" class="titre-section"><span class="petites-caps">Journal de bord</span> Le Carnet</h2>
    <p>${esc(site.accroches.carnet)}</p>
    <a class="lien-fleche" href="/carnet/">Tout le Carnet</a>
  </div>
  <ol class="journal journal--court">${carnet.slice(0, 3).map((a) => carteArticle(a, { niveau: 'h3' })).join('')}</ol>
</section>

<section class="section grille" id="librairies" aria-labelledby="librairies-titre">
  <div class="entete-section">
    <h2 id="librairies-titre" class="titre-section"><span class="petites-caps">En librairie</span> Où trouver nos livres</h2>
    <p>${md(site.contact.ouTrouver)}</p>
    <a class="lien-fleche" href="/contact/#librairies">La carte des librairies</a>
  </div>
  ${listeLibrairies()}
</section>
${ctaFinal()}`;
  ajouter('/', page({ chemin: '/', titre: 'les éditions du Canapé', description: site.description, contenu, jsonld: [ORG, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'éditions du Canapé', url: site.url, inLanguage: 'fr', publisher: { '@id': `${site.url}/#organisation` } }], classe: 'p-accueil' }));
})();

/* Catalogue */
(function catalogue() {
  const filtres = Object.entries(CATEGORIES).map(([k, v]) => `<button type="button" class="filtre" data-filtre="${k}" aria-pressed="false">${v} <span class="filtre__nb">${livres.filter((l) => l.categories.includes(k)).length}</span></button>`).join('');
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['Catalogue', '/catalogue/']])}
  <h1 class="titre-page">Catalogue</h1>
  <p class="chapo">${esc(site.accroches.catalogue)} ${esc(site.accroches.bibliotheque)}</p>
  <img class="entete-page__sticker" src="/images/maison/sticker-catalogue-640.webp" width="300" height="343" alt="" aria-hidden="true" loading="lazy">
</header>
<section class="section grille" aria-label="Livres du catalogue">
  <div class="outils" role="search">
    <div class="outils__recherche">
      <label for="recherche-livre">Rechercher un titre ou un auteur</label>
      <input id="recherche-livre" type="search" placeholder="Miette, Gerbier, Reignac…" autocomplete="off" data-recherche>
    </div>
    <div class="outils__filtres" role="group" aria-label="Filtrer par catégorie">
      <button type="button" class="filtre" data-filtre="tous" aria-pressed="true">Tous <span class="filtre__nb">${livres.length}</span></button>${filtres}
    </div>
  </div>
  <p class="outils__resultat" role="status" aria-live="polite" data-resultat>${livres.length} livres</p>
  <ul class="grille-livres" data-liste>${livres.map(carteLivre).join('')}</ul>
  <p class="vide" hidden data-vide>Aucun livre ne correspond à votre recherche. <button type="button" class="lien" data-reinit>Tout afficher</button></p>
</section>
${ctaFinal('Où acheter nos livres ?', 'Directement auprès du Canapé grâce au formulaire de commande, ou dans les librairies qu’on aime. Le paiement et l’envoi se règlent ensuite par courriel.', '/contact/?sujet=commande#formulaire', 'Commander un livre')}`;
  const ld = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Catalogue des éditions du Canapé', itemListElement: livres.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/livres/${l.slug}/`, name: l.titre })) };
  ajouter('/catalogue/', page({ chemin: '/catalogue/', titre: 'Catalogue', description: `Les ${livres.length} livres des éditions du Canapé : livres illustrés, jeunesse, poésie, photographie, livres bilingues et livres faits avec des classes. Prix, librairies et commande.`, contenu, jsonld: [ld, fil([['Accueil', '/'], ['Catalogue', '/catalogue/']])], classe: 'p-catalogue' }));
})();

/* Fiches livres */
livres.forEach((l, idx) => {
  const chemin = `/livres/${l.slug}/`;
  const articles = carnet.filter((a) => (a.livres || []).includes(l.slug)).sort((a, b) => a.date.localeCompare(b.date));
  const proches = livres.filter((o) => o.slug !== l.slug).map((o) => ({ o, s: o.categories.filter((c) => l.categories.includes(c)).length })).sort((a, b) => b.s - a.s || a.o.ordre - b.o.ordre).slice(0, 3).map((x) => x.o);
  const lignes = [
    ...l.credits.map((c) => [c.role, `${md(c.noms)}${c.lien ? ` (<a href="${c.lien.url}" rel="noopener">${esc(c.lien.texte)}</a>)` : ''}`]),
    ['Format', aPreciser(l.format)],
    ['Pages', aPreciser(l.pages)],
    ['Reliure', aPreciser(l.reliure)],
    ['Prix', l.prix != null ? `<strong>${prixTexte(l)}</strong>` : esc(prixTexte(l))],
    ['ISBN', aPreciser(l.isbn)],
    [l.dateLibelle || 'Parution', aPreciser(l.date)],
    ['Impression', aPreciser(l.impression)]
  ];
  if (l.techniques) lignes.splice(l.credits.length, 0, ['Technique', esc(l.techniques)]);
  if (l.langues) lignes.splice(l.credits.length, 0, ['Langues', l.langues.map((x) => ({ fr: 'français', it: 'italien' }[x] || x)).join(' et ')]);
  const ou = l.disponibilite === 'en vente'
    ? `<p>${md(l.commande)} Le paiement et l’envoi se règlent ensuite par échange de courriels.</p>${lienCommande(l)}${l.librairies.length ? `<h3 class="petit-titre">En librairie</h3>${listeLibrairies(l.librairies, { compact: true })}` : ''}`
    : `<p>${md(l.commande)}</p>${l.disponibilite === 'épuisé' ? '<p class="note">Ce livre est épuisé.</p>' : '<p class="note">Ce livre est hors commerce : il n’est pas vendu en librairie.</p>'}${lienCommande(l)}`;
  const contenu = `
<article class="fiche" itemscope>
  <header class="fiche__entete grille">
    ${filAriane([['Accueil', '/'], ['Catalogue', '/catalogue/'], [l.titre, chemin]])}
    <div class="fiche__couverture">${livreObjet(l, { grand: true, eager: true, sizes: '(max-width: 700px) 80vw, 460px' })}</div>
    <div class="fiche__titres">
      <ul class="etiquettes">${l.categories.map((c) => `<li><a href="/catalogue/?filtre=${c}">${CATEGORIES[c]}</a></li>`).join('')}</ul>
      <h1 class="titre-livre">${esc(l.titre)}</h1>
      ${l.sousTitre ? `<p class="fiche__sous">${esc(l.sousTitre)}</p>` : ''}
      <p class="fiche__credits">${l.credits.filter((c) => !/maquette/i.test(c.role)).map((c) => `<span class="petites-caps">${md(c.role)}</span> ${md(c.noms)}`).join('<br>')}</p>
      ${l.public ? `<p class="fiche__public">${md(l.public)}</p>` : ''}
      ${l.avertissement ? `<p class="note">${md(l.avertissement)}</p>` : ''}
      <div class="fiche__achat">
        <p class="prix prix--grand">${prixTexte(l)}</p>
        <p class="fiche__mini">${[l.reliure, l.pages ? l.pages + ' pages' : '', l.format].filter(Boolean).map(esc).join(' · ')}</p>
        ${lienCommande(l)}
        ${l.disponibilite === 'en vente' && l.librairies.length ? `<p class="fiche__libs">Aussi chez ${l.librairies.map(lib).filter(Boolean).map((x) => esc(x.nom)).join(', ')} — <a href="#ou-acheter">où l’acheter</a></p>` : ''}
      </div>
    </div>
  </header>

  ${(l.images && l.images.length) ? `<section class="section grille" aria-labelledby="feuilleter">
    <h2 id="feuilleter" class="titre-section"><span class="petites-caps">Feuilleter</span> Quelques pages</h2>
    ${galerie(l.images, l.titre)}
  </section>` : ''}

  <div class="section grille fiche__corps">
    <section class="fiche__texte" aria-labelledby="presentation">
      <h2 id="presentation" class="titre-section">Présentation</h2>
      ${l.epigraphe ? `<blockquote class="epigraphe"><p>« ${md(l.epigraphe.texte)} »</p><footer>${md(l.epigraphe.source)}</footer></blockquote>` : ''}
      <div class="lettrine">${paras(l.presentation)}</div>
      ${l.citation ? `<blockquote class="citation">${paras(l.citation)}</blockquote>` : ''}
      ${l.actualite ? `<aside class="encart"><h3>${md(l.actualite.titre)}</h3><p class="note">${md(l.actualite.sousTitre)}</p>${paras(l.actualite.texte)}</aside>` : ''}
    </section>
    <aside class="fiche__technique" aria-labelledby="technique">
      <div class="cartouche">${reperes}
        <h2 id="technique" class="cartouche__titre">Fiche technique</h2>
        <dl>${lignes.map(([k, v]) => `<div><dt>${md(k)}</dt><dd>${v}</dd></div>`).join('')}<div><dt>Éditeur</dt><dd>éditions du Canapé</dd></div></dl>
      </div>
      <section class="cartouche" id="ou-acheter" aria-labelledby="ou-acheter-titre">
        <h2 id="ou-acheter-titre" class="cartouche__titre">Où l’acheter</h2>
        ${ou}
      </section>
    </aside>
  </div>

  ${articles.length ? `<section class="section grille" aria-labelledby="histoire">
    <h2 id="histoire" class="titre-section"><span class="petites-caps">Au Carnet</span> L’histoire de ce livre</h2>
    <ol class="journal journal--court journal--chrono">${articles.map((a) => carteArticle(a, { niveau: 'h3' })).join('')}</ol>
  </section>` : ''}

  <section class="section grille" aria-labelledby="proches">
    <h2 id="proches" class="titre-section"><span class="petites-caps">Sur le même rayon</span> Livres proches</h2>
    <ul class="grille-livres grille-livres--3">${proches.map(carteLivre).join('')}</ul>
    <nav class="suivant-precedent" aria-label="Livre précédent et suivant">
      ${idx > 0 ? `<a href="/livres/${livres[idx - 1].slug}/" rel="prev"><span class="petites-caps">Livre précédent</span> ${esc(livres[idx - 1].titre)}</a>` : '<span></span>'}
      ${idx < livres.length - 1 ? `<a href="/livres/${livres[idx + 1].slug}/" rel="next"><span class="petites-caps">Livre suivant</span> ${esc(livres[idx + 1].titre)}</a>` : '<span></span>'}
    </nav>
  </section>
</article>`;
  const desc = `${l.titre}${l.sousTitre ? ', ' + l.sousTitre : ''} — ${plain(l.credits.slice(0, 2).map((c) => `${c.role.toLowerCase()} : ${c.noms}`).join(', '))}. ${l.prix != null ? prixTexte(l) + ', ' : ''}${l.pages} pages. ${plain(l.accroche)}`.slice(0, 300);
  ajouter(chemin, page({ chemin, titre: `${l.titre}${l.sousTitre ? ' — ' + l.sousTitre : ''}`, description: desc, contenu, image: l.couverture.src, type: 'book', jsonld: [bookLD(l), fil([['Accueil', '/'], ['Catalogue', '/catalogue/'], [l.titre, chemin]])], classe: 'p-livre' }));
});

/* À paraître */
(function aParaitre() {
  const actifs = projets.filter((p) => !p.archive);
  const archives = projets.filter((p) => p.archive);
  const options = actifs.map((p) => `<option value="${esc(p.titre)}">${esc(p.titre)}</option>`).join('');
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['À paraître', '/a-paraitre/']])}
  <h1 class="titre-page">À paraître</h1>
  <p class="chapo">${site.accroches.aParaitre.map(esc).join('<br>')}</p>
  <img class="entete-page__sticker" src="/images/maison/sticker-fatigue-640.webp" width="300" height="495" alt="" aria-hidden="true" loading="lazy">
</header>
<section class="section grille" aria-label="Projets en cours">
  <ul class="grille-projets">${actifs.map((p) => carteProjet(p, 'h2')).join('')}</ul>
</section>
<section class="section grille" aria-labelledby="alerte-titre">
  <div class="cartouche cartouche--large">${reperes}
    <h2 id="alerte-titre" class="cartouche__titre">Être prévenu de la sortie</h2>
    <p>Laissez-nous votre adresse : nous vous écrirons quand le livre sortira des cartons.</p>
    <form class="formulaire formulaire--ligne" name="alerte-parution" method="POST" action="/contact/merci/" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="alerte-parution">
      <p class="visuellement-cache"><label>Ne pas remplir ce champ : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="champ"><label for="alerte-projet">Livre attendu</label><select id="alerte-projet" name="projet" required><option value="">Choisir…</option>${options}<option value="Tous les projets">Tous les projets</option></select></div>
      <div class="champ"><label for="alerte-nom">Votre nom</label><input id="alerte-nom" name="nom" autocomplete="name"></div>
      <div class="champ"><label for="alerte-email">Votre e-mail <span aria-hidden="true">*</span></label><input id="alerte-email" type="email" name="email" required autocomplete="email"></div>
      <button class="bouton bouton--vermillon" type="submit">Me prévenir</button>
    </form>
  </div>
</section>
${archives.length ? `<section class="section grille" aria-labelledby="archives-titre">
  <h2 id="archives-titre" class="titre-section"><span class="petites-caps">Ancienne page « Bientôt »</span> Encore dans les cartons</h2>
  <p>Ces projets étaient présentés sur l’ancienne page « Bientôt disponible au Canapé ». Leur calendrier est à préciser.</p>
  <ul class="grille-projets grille-projets--petit">${archives.map((p) => carteProjet(p, 'h3')).join('')}</ul>
</section>` : ''}
${ctaFinal()}`;
  ajouter('/a-paraitre/', page({ chemin: '/a-paraitre/', titre: 'À paraître', description: 'Les prochains livres des éditions du Canapé : Kavafis, Atelier de lecture de planches, Street Iconotextes, Monet peindre le temps, Reconnaissances de Shanghai, Indignations, Système D.', contenu, jsonld: [fil([['Accueil', '/'], ['À paraître', '/a-paraitre/']])], classe: 'p-projets' }));

  projets.forEach((p) => {
    const chemin = `/a-paraitre/${p.slug}/`;
    const art = carnet.filter((a) => (a.projets || []).includes(p.slug));
    const contenu = `
<article class="fiche fiche--projet">
  <header class="fiche__entete grille">
    ${filAriane([['Accueil', '/'], ['À paraître', '/a-paraitre/'], [p.titre, chemin]])}
    <div class="fiche__couverture fiche__couverture--projet">${img(p.vignette, { eager: true, sizes: '(max-width: 700px) 90vw, 460px' })}${reperes}</div>
    <div class="fiche__titres">
      ${statutBadge(p.statut)}
      <h1 class="titre-livre">${esc(p.titre)}</h1>
      ${p.sousTitre ? `<p class="fiche__sous">${esc(p.sousTitre)}</p>` : ''}
      <p class="fiche__credits">${p.credits.map((c) => `<span class="petites-caps">${md(c.role)}</span> ${md(c.noms)}`).join('<br>')}</p>
      ${p.langues ? `<p class="fiche__public">${esc(p.langues)}</p>` : ''}
      ${p.partenaires.length ? `<p class="fiche__public"><span class="petites-caps">Partenaires</span> ${p.partenaires.map(esc).join(', ')}</p>` : ''}
      <div class="actions"><a class="bouton bouton--vermillon" href="/a-paraitre/#alerte-titre">Être prévenu de la sortie</a><a class="lien-fleche" href="/contact/?sujet=autre#formulaire">Nous écrire</a></div>
    </div>
  </header>
  <div class="section grille fiche__corps fiche__corps--simple">
    <section class="fiche__texte"><h2 class="titre-section">Le projet</h2><div class="lettrine">${paras(p.presentation)}</div>
    ${p.ancienTexte ? `<aside class="encart"><h3>${esc(p.ancienTexte.titre)}</h3><p class="note">Texte de l’ancienne page « Bientôt ».</p><p>${md(p.ancienTexte.texte)}</p></aside>` : ''}
    <p class="note">${md(p.contact)}</p></section>
  </div>
  ${p.images.length ? `<section class="section grille"><h2 class="titre-section"><span class="petites-caps">Images</span> En avant-première</h2>${galerie(p.images, p.titre)}</section>` : ''}
  ${art.length ? `<section class="section grille"><h2 class="titre-section"><span class="petites-caps">Au Carnet</span> L’histoire de ce projet</h2><ol class="journal journal--court">${art.map((a) => carteArticle(a, { niveau: 'h3' })).join('')}</ol></section>` : ''}
</article>`;
    ajouter(chemin, page({ chemin, titre: `${p.titre} — à paraître`, description: `${p.titre}, à paraître aux éditions du Canapé. ${plain(p.auteurs)}. ${plain(p.presentation[0])}`.slice(0, 300), contenu, image: p.vignette.src, jsonld: [{ '@context': 'https://schema.org', '@type': 'Book', name: p.titre, publisher: { '@id': `${site.url}/#organisation`, '@type': 'Organization', name: 'éditions du Canapé' }, image: urlImage(p.vignette.src), description: plain(p.presentation[0]), creativeWorkStatus: p.statut }, fil([['Accueil', '/'], ['À paraître', '/a-paraitre/'], [p.titre, chemin]])], classe: 'p-projet' }));
  });
})();

/* Livres en partage */
(function partage() {
  const classes = livres.filter((l) => l.categories.includes('ateliers'));
  const recherche = [...livres.filter((l) => l.categories.includes('recherche')), ...projets.filter((p) => p.partage && p.categories.includes('recherche'))];
  const carteMixte = (x) => (x.couverture ? carteLivre(x) : carteProjet(x));
  const etapes = site.frise.map((e, i) => `<li class="frise__etape revele">
    <span class="frise__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
    <div class="frise__contenu">
      <h3 class="frise__titre">${esc(e.etape)}</h3>
      <p>${md(e.texte)}</p>
      <a class="lien-fleche" href="/${e.lien}/">${e.lien === 'la-maison' ? 'Notre histoire' : 'Lire au Carnet'}</a>
    </div>
    <div class="frise__image">${img(e.image, { sizes: '(max-width: 700px) 60vw, 240px', small: true })}</div>
  </li>`).join('');
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['Livres en partage', '/livres-en-partage/']])}
  <h1 class="titre-page">Livres en partage</h1>
  <p class="chapo">Des livres faits avec des élèves, des enseignants et des chercheurs : c’est l’originalité du Canapé, et une bonne part de son catalogue.</p>
</header>
<section class="section grille presentation">
  <div><h2 class="titre-section"><span class="petites-caps">La démarche</span> Éducation populaire et beaux objets</h2></div>
  <div class="lettrine">
    <p>${md(site.histoire.split('. ').slice(3).join('. '))}</p>
    <p>Le Canapé travaille « avec des élèves en alternance […], avec des chercheurs italiens […], avec des traductrices bénévoles ». Le <em>Bestiaire Monstrueux</em>, qui a permis de lancer les éditions du Canapé, est le fruit d’un projet pédagogique mené par Thomas et Anouck Gerbier avec des élèves de CAP et de maternelle ; les <em>Chroniques Botaniques</em> sont un « projet fou mené par la classe de terminale BAC Pro du CFAE de Reignac », dont les élèves ont ensuite vendu leur livre en librairie et au cinéma.</p>
    <p>Côté recherche, <em>Miette la mouette</em> est l’un des résultats d’une année de recherche-création au sein du laboratoire InTRu de l’université de Tours, et le Canapé participe au programme franco-italien « Science(fiction) politique ».</p>
  </div>
</section>

<section class="section grille" aria-labelledby="classes-titre">
  <div class="entete-section">
    <h2 id="classes-titre" class="titre-section"><span class="petites-caps">Avec des classes</span> CFAE de Reignac · école de Pleine-Selve</h2>
    <p>Des élèves de CAP, de BAC Pro et de maternelle de Gironde, auteurs et illustrateurs de leurs livres.</p>
  </div>
  <ul class="grille-livres grille-livres--3">${classes.map(carteLivre).join('')}</ul>
  <figure class="photo-legende revele">${img(livre('chroniques-botaniques').images[4], { sizes: '(max-width: 700px) 90vw, 50vw' })}<figcaption>Dans l’atelier des <em>Chroniques Botaniques</em>.</figcaption></figure>
  <aside class="encart">
    <h3>${md(livre('chroniques-botaniques').actualite.titre)}</h3>
    ${paras(livre('chroniques-botaniques').actualite.texte)}
  </aside>
</section>

<section class="section grille" aria-labelledby="recherche-titre">
  <div class="entete-section">
    <h2 id="recherche-titre" class="titre-section"><span class="petites-caps">Avec des chercheurs</span> InTRu · université de Tours · « Science(fiction) politique »</h2>
    <p>Recherche-création, journées d’études, ateliers de lecture : des livres pour garder la trace de la recherche qui se fait.</p>
  </div>
  <ul class="grille-livres grille-livres--mixte">${recherche.map(carteMixte).join('')}</ul>
</section>

<section class="section frise-section" aria-labelledby="frise-titre">
  <div class="grille">
    <h2 id="frise-titre" class="titre-section"><span class="petites-caps">Du carnet à la librairie</span> Comment naît un livre</h2>
    <ol class="frise" data-frise><svg class="frise__trait" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 10 100"><path d="M5 0 C 9 12, 1 25, 5 37 S 9 62, 5 75 S 1 92, 5 100" pathLength="1"/></svg>${etapes}</ol>
  </div>
</section>
${ctaFinal('Vous aimeriez faire un livre avec votre classe ?', 'Enseignants, médiathèques, structures : le Canapé est friand de nouveaux projets. Décrivez-nous le vôtre, et nous en discuterons ensemble.', '/contact/?sujet=atelier#formulaire', 'Nous écrire')}`;
  ajouter('/livres-en-partage/', page({ chemin: '/livres-en-partage/', titre: 'Livres en partage — des livres faits avec des classes et des chercheurs', description: 'Le Bestiaire Monstrueux, Série B, les Chroniques Botaniques, Miette la mouette : des livres faits avec les classes du CFAE de Reignac, l’école de Pleine-Selve et le laboratoire InTRu de l’université de Tours.', contenu, jsonld: [fil([['Accueil', '/'], ['Livres en partage', '/livres-en-partage/']])], classe: 'p-partage' }));
})();

/* Carnet */
(function pagesCarnet() {
  const parAnnee = {};
  carnet.forEach((a) => (parAnnee[a.date.slice(0, 4)] = parAnnee[a.date.slice(0, 4)] || []).push(a));
  const filtres = Object.entries(THEMES).map(([k, v]) => `<button type="button" class="filtre" data-filtre="${k}" aria-pressed="false">${v} <span class="filtre__nb">${carnet.filter((a) => a.themes.includes(k)).length}</span></button>`).join('');
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['Carnet', '/carnet/']])}
  <h1 class="titre-page">Le Carnet</h1>
  <p class="chapo">${esc(site.accroches.carnet)}</p>
  <img class="entete-page__sticker" src="/images/maison/sticker-rouages-640.webp" width="300" height="268" alt="" aria-hidden="true" loading="lazy">
</header>
<section class="section grille" aria-label="Articles du Carnet">
  <div class="outils"><div class="outils__filtres" role="group" aria-label="Filtrer par thème"><button type="button" class="filtre" data-filtre="tous" aria-pressed="true">Tout <span class="filtre__nb">${carnet.length}</span></button>${filtres}</div></div>
  <p class="outils__resultat" role="status" aria-live="polite" data-resultat>${carnet.length} articles</p>
  ${Object.keys(parAnnee).sort().reverse().map((an) => `<section class="annee" data-annee><h2 class="annee__titre">${an}</h2><ol class="journal" data-liste>${parAnnee[an].map((a) => carteArticle(a, { niveau: 'h3' })).join('')}</ol></section>`).join('')}
</section>`;
  ajouter('/carnet/', page({ chemin: '/carnet/', titre: 'Le Carnet — journal de bord', description: 'Le journal de bord des éditions du Canapé : fabrication des livres, gravures, impression, rencontres en librairie et au cinéma, ateliers avec les classes.', contenu, jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: 'Le Carnet des éditions du Canapé', url: `${site.url}/carnet/`, publisher: { '@id': `${site.url}/#organisation` }, blogPost: carnet.map((a) => ({ '@type': 'BlogPosting', headline: a.titre, datePublished: a.date, url: `${site.url}/carnet/${a.slug}/` })) }, fil([['Accueil', '/'], ['Carnet', '/carnet/']])], classe: 'p-carnet' }));

  carnet.forEach((a, i) => {
    const chemin = `/carnet/${a.slug}/`;
    const plusRecent = carnet[i - 1], plusAncien = carnet[i + 1];
    const lies = (a.livres || []).map(livre).filter(Boolean);
    const liesP = (a.projets || []).map(projet).filter(Boolean);
    const contenu = `
<article class="article">
  <header class="entete-page grille">
    ${filAriane([['Accueil', '/'], ['Carnet', '/carnet/'], [a.titre, chemin]])}
    <p class="article__date"><time datetime="${a.date}">${dateLongue(a.date)}</time> · ${a.themes.map((t) => THEMES[t]).join(' · ')}</p>
    <h1 class="titre-page titre-page--article">${esc(a.titre)}</h1>
  </header>
  <div class="section grille article__corps">
    <div class="article__texte lettrine">${paras(a.texte)}</div>
    <div class="article__photos">${a.photos.length > 1 ? galerie(a.photos, a.titre) : `<figure class="photo-legende">${img(a.photos[0], { eager: true, sizes: '(max-width: 700px) 90vw, 560px' })}<figcaption>${esc(a.photos[0].alt)}</figcaption></figure>`}</div>
  </div>
  ${lies.length || liesP.length ? `<section class="section grille" aria-labelledby="lies"><h2 id="lies" class="titre-section"><span class="petites-caps">Dans cet article</span> ${lies.length ? 'Livres liés' : 'Projet lié'}</h2>
    ${lies.length ? `<ul class="grille-livres grille-livres--3">${lies.map(carteLivre).join('')}</ul>` : ''}
    ${liesP.length ? `<ul class="grille-projets grille-projets--petit">${liesP.map((p) => carteProjet(p)).join('')}</ul>` : ''}
  </section>` : ''}
  <nav class="section grille suivant-precedent" aria-label="Articles précédent et suivant">
    ${plusAncien ? `<a href="/carnet/${plusAncien.slug}/" rel="prev"><span class="petites-caps">Article précédent · ${dateLongue(plusAncien.date)}</span> ${esc(plusAncien.titre)}</a>` : '<span></span>'}
    ${plusRecent ? `<a href="/carnet/${plusRecent.slug}/" rel="next"><span class="petites-caps">Article suivant · ${dateLongue(plusRecent.date)}</span> ${esc(plusRecent.titre)}</a>` : '<span></span>'}
  </nav>
</article>`;
    ajouter(chemin, page({ chemin, titre: `${a.titre} — Carnet`, description: `${dateLongue(a.date)} · ${plain(a.texte.join(' '))}`.slice(0, 300), contenu, image: a.photos[0].src, type: 'article', jsonld: [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: a.titre, datePublished: a.date, image: urlImage(a.photos[0].src), articleBody: plain(a.texte.join(' ')), author: { '@id': `${site.url}/#organisation`, '@type': 'Organization', name: 'éditions du Canapé' }, publisher: { '@id': `${site.url}/#organisation`, '@type': 'Organization', name: 'éditions du Canapé' }, mainEntityOfPage: site.url + chemin }, fil([['Accueil', '/'], ['Carnet', '/carnet/'], [a.titre, chemin]])], classe: 'p-article' }));
  });
})();

/* La maison */
(function maison() {
  const portrait = (nom) => {
    const ini = nom.split(/[\s,]+/).filter((x) => /^[A-ZÀ-Ý]/.test(x)).slice(0, 2).map((x) => x[0]).join('');
    return `<svg class="portrait" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="38" class="portrait__fond"/><path d="M40 18c-8 0-13 6-13 14 0 9 6 16 13 16s13-7 13-16c0-8-5-14-13-14zM18 70c3-11 12-17 22-17s19 6 22 17" class="portrait__trait"/><path d="M27 30c4-4 10-6 17-4 4 1 7 3 9 6" class="portrait__trait"/><text x="66" y="74" class="portrait__ini">${esc(ini)}</text></svg>`;
  };
  const personne = (p) => `<li class="personne revele">${portrait(p.nom)}<div><h3 class="personne__nom">${esc(p.nom)}</h3><p class="personne__role">${esc(p.role)}</p><p>${md(p.texte)}</p>${p.liens ? `<p class="personne__liens">${p.liens.map((u) => { const s = u.split('/')[1]; const x = livre(s) || projet(s); return x ? `<a href="/${u}/">${esc(titreCourt(x))}</a>` : ''; }).join(' · ')}</p>` : ''}</div></li>`;
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['La maison', '/la-maison/']])}
  <h1 class="titre-page">La maison</h1>
  <p class="chapo">${md(site.presentation[0])}</p>
</header>
<section class="section grille presentation" aria-labelledby="qui">
  <div><h2 id="qui" class="titre-section"><span class="petites-caps">Qui sommes-nous</span> Un canapé où tout le monde s’assied</h2>
  <img class="maison__pile" src="/images/maison/pile-de-livres-640.webp" width="252" height="640" alt="Dessin au trait d’une haute pile de livres où l’on lit « Liber », « Boek », « Buch », « Book »." loading="lazy"></div>
  <div class="lettrine">${paras(site.presentation.slice(1))}
  <h3 class="petit-titre">Une histoire de frangins</h3>
  <p>${md(site.histoire)}</p></div>
</section>
<section class="section grille" aria-labelledby="equipe">
  <h2 id="equipe" class="titre-section"><span class="petites-caps">L’équipe</span> Ceux qui tiennent le Canapé</h2>
  <ul class="personnes personnes--equipe">${site.equipe.map(personne).join('')}</ul>
  <h2 class="titre-section titre-section--second"><span class="petites-caps">Les complices</span> Auteurs, autrices, illustrateurs et illustratrices</h2>
  <ul class="personnes">${site.complices.map(personne).join('')}</ul>
  <h2 class="titre-section titre-section--second"><span class="petites-caps">Les chercheurs</span> Avec l’université</h2>
  <ul class="personnes">${site.chercheurs.map(personne).join('')}</ul>
</section>
<section class="section grille" aria-labelledby="fabrication">
  <div class="presentation">
    <div><h2 id="fabrication" class="titre-section"><span class="petites-caps">L’atelier</span> La fabrication</h2></div>
    <div class="lettrine">
      <p>On sera petit, mais on fera des beaux livres, des objets. Les gravures de <a href="/livres/miette-la-mouette/"><em>Miette la mouette</em></a> sont tirées sur Tétrapak® par Axelle Tamby-Bernage, puis numérisées au scanner avant d’imaginer la maquette ; les livres partent ensuite chez « notre imprimeur italien ».</p>
      <p>Pour le port-folio <a href="/a-paraitre/kavafis/">Kavafis</a>, le texte composé au plomb est tiré sur « la Gavotte », la vénérable presse Stanhope de 1828 de L’Enseigne absente, à Bréhémont. Et quand le stock s’épuise, comme pour les <a href="/livres/chroniques-botaniques/"><em>Chroniques Botaniques</em></a>, on repart chez l’imprimeur pour 100 nouveaux exemplaires.</p>
      <p><a class="lien-fleche" href="/livres-en-partage/#frise-titre">Comment naît un livre, étape par étape</a></p>
    </div>
  </div>
  <ul class="bandeau-images">${[carnet.find((a) => a.slug.includes('gravures')), carnet.find((a) => a.slug.includes('kavafis')), carnet.find((a) => a.slug.includes('miette-est-arrivee'))].filter(Boolean).map((a) => `<li><a href="/carnet/${a.slug}/">${img(a.photos[0], { sizes: '(max-width: 700px) 90vw, 30vw', small: true })}<span>${esc(a.titre)}</span></a></li>`).join('')}</ul>
</section>
<section class="section grille" aria-labelledby="lieux">
  <h2 id="lieux" class="titre-section"><span class="petites-caps">Les lieux</span> Partenaires et compagnons de route</h2>
  <ul class="partenaires">${site.partenaires.map((p) => `<li class="revele"><h3>${p.url ? `<a href="${p.url}" rel="noopener">${esc(p.nom)}</a>` : esc(p.nom)}</h3><p>${md(p.texte)}</p></li>`).join('')}</ul>
  <h3 class="petit-titre">Les librairies</h3>
  ${listeLibrairies()}
</section>
<section class="section grille" aria-labelledby="statut">
  <div class="cartouche cartouche--large">${reperes}
    <h2 id="statut" class="cartouche__titre">Statut associatif</h2>
    <p>Les éditions du Canapé sont une association loi 1901, sans but lucratif.</p>
    <dl class="dl-ligne"><div><dt>Siège</dt><dd>${esc(site.adresse.rue)}, ${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)}</dd></div><div><dt>RNA</dt><dd>${esc(site.rna)}</dd></div><div><dt>SIRET</dt><dd>${esc(site.siret)}</dd></div><div><dt>Contact</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div></dl>
  </div>
</section>
${ctaFinal()}`;
  ajouter('/la-maison/', page({ chemin: '/la-maison/', titre: 'La maison — qui sommes-nous', description: 'Les éditions du Canapé : une maison d’édition associative fondée en 2023 par Thomas et Laurent Gerbier, ses auteurs, illustrateurs, chercheurs, librairies et lieux partenaires.', contenu, jsonld: [ORG, fil([['Accueil', '/'], ['La maison', '/la-maison/']])], classe: 'p-maison' }));
})();

/* Contact */
(function contact() {
  const opt = livres.map((l) => `<option value="${l.slug}" data-prix="${l.prix != null ? l.prix : ''}">${esc(l.titre)} — ${prixTexte(l)}</option>`).join('');
  const contenu = `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['Contact', '/contact/']])}
  <h1 class="titre-page">Contact &amp; commande</h1>
  <div class="chapo">${site.contact.intro.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
</header>
<div class="section grille contact">
  <section class="contact__form" aria-labelledby="formulaire">
    <h2 id="formulaire" class="titre-section" tabindex="-1">Nous écrire</h2>
    <p>${md(site.contact.commande)}</p>
    <p class="note">Aucun paiement en ligne : pour une commande, le paiement et l’envoi sont réglés ensuite par échange de courriels.</p>
    <form class="formulaire" name="contact" method="POST" action="/contact/merci/" data-netlify="true" netlify-honeypot="bot-field" data-formulaire-contact>
      <input type="hidden" name="form-name" value="contact">
      <p class="visuellement-cache"><label>Ne pas remplir ce champ : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <fieldset class="champ champ--sujets">
        <legend>Votre demande concerne <span aria-hidden="true">*</span></legend>
        ${[['commande', 'Commander un livre'], ['projet', 'Projet de livre'], ['atelier', 'Atelier avec une classe'], ['librairie', 'Librairie ou point de vente'], ['presse', 'Presse'], ['autre', 'Autre']].map(([v, t], i) => `<label class="pastille"><input type="radio" name="sujet" value="${v}"${i === 0 ? ' checked' : ''} required> <span>${t}</span></label>`).join('')}
      </fieldset>
      <div class="bloc-commande" data-bloc-commande>
        <div class="champ champ--2">
          <div><label for="livre">Livre</label><select id="livre" name="livre"><option value="">Choisir un livre…</option>${opt}</select></div>
          <div><label for="quantite">Quantité</label><input id="quantite" name="quantite" type="number" min="1" max="99" value="1" inputmode="numeric"></div>
        </div>
        <p class="note" data-total aria-live="polite"></p>
        <div class="champ"><label for="adresse">Adresse de livraison</label><textarea id="adresse" name="adresse" rows="3" autocomplete="street-address"></textarea></div>
      </div>
      <div class="champ champ--2">
        <div><label for="nom">Votre nom <span aria-hidden="true">*</span></label><input id="nom" name="nom" required autocomplete="name"></div>
        <div><label for="email">Votre e-mail <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" required autocomplete="email"></div>
      </div>
      <div class="champ"><label for="message">Votre message</label><textarea id="message" name="message" rows="6"></textarea></div>
      <p class="note">Les champs marqués d’un astérisque sont obligatoires. Vos informations servent uniquement à vous répondre (voir la <a href="/mentions-legales/#confidentialite">politique de confidentialité</a>).</p>
      <button class="bouton bouton--vermillon" type="submit">Envoyer</button>
    </form>
  </section>
  <aside class="contact__infos">
    <div class="cartouche">${reperes}
      <h2 class="cartouche__titre">Faire les choses à l’ancienne ?</h2>
      <p>${md(site.contact.ancienne)}</p>
      <address class="adresse-postale">Éditions du Canapé<br>${esc(site.adresse.rue)}<br>${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)}</address>
      <p><a href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <div class="cartouche">
      <h2 class="cartouche__titre">Comment proposer un projet ?</h2>
      <p>${md(site.contact.projet)}</p>
    </div>
    <div class="cartouche">
      <h2 class="cartouche__titre">Et faire simplement un coucou ?</h2>
      <p>${md(site.contact.coucou)}</p>
    </div>
  </aside>
</div>
<section class="section grille" id="librairies" aria-labelledby="ou-trouver">
  <h2 id="ou-trouver" class="titre-section"><span class="petites-caps">En librairie</span> Où trouver nos livres ?</h2>
  <p class="chapo">${md(site.contact.ouTrouver)}</p>
  <div class="ou-trouver">${carteLibrairies()}${listeLibrairies()}</div>
</section>`;
  ajouter('/contact/', page({ chemin: '/contact/', titre: 'Contact et commande', description: 'Commander un livre des éditions du Canapé, proposer un projet, organiser un atelier avec une classe ou trouver une librairie. 3 la Poterie, 17150 Boisredon · lecanape@jungleprod.com', contenu, jsonld: [ORG, fil([['Accueil', '/'], ['Contact', '/contact/']])], classe: 'p-contact' }));

  ajouter('/contact/merci/', page({ chemin: '/contact/merci/', titre: 'Merci !', description: 'Votre message a bien été envoyé aux éditions du Canapé.', contenu: `
<section class="entete-page grille merci">
  <p class="tampon tampon--grand" aria-hidden="true">Reçu</p>
  <h1 class="titre-page">Merci !</h1>
  <p class="chapo">Votre message est bien arrivé sur le Canapé. Nous vous répondrons à la vitesse de la lumière.</p>
  <p>Pour une commande, nous vous écrirons pour régler le paiement et l’envoi ; dès réception de votre règlement, nous vous enverrons votre commande grâce à la magie de la Poste !</p>
  <div class="actions"><a class="bouton bouton--encre" href="/catalogue/">Retour au catalogue</a><a class="lien-fleche" href="/carnet/">Lire le Carnet</a></div>
</section>`, classe: 'p-merci' }));
})();

/* Mentions légales */
ajouter('/mentions-legales/', page({ chemin: '/mentions-legales/', titre: 'Mentions légales et politique de confidentialité', description: 'Mentions légales et politique de confidentialité du site des éditions du Canapé.', contenu: `
<header class="entete-page grille">
  ${filAriane([['Accueil', '/'], ['Mentions légales', '/mentions-legales/']])}
  <h1 class="titre-page">Mentions légales</h1>
</header>
<div class="section grille texte-courant">
  <section aria-labelledby="ml-editeur">
    <h2 id="ml-editeur">Éditeur du site</h2>
    <p>${esc(site.nom)}, ${esc(site.statut)}<br>Siège : ${esc(site.adresse.rue)}, ${esc(site.adresse.codePostal)} ${esc(site.adresse.ville)}, France<br>RNA : ${esc(site.rna)} · SIRET : ${esc(site.siret)}<br>Contact : <a href="mailto:${site.email}">${site.email}</a></p>
    <p>Directeur ou directrice de la publication : ${aPreciser(site.directeurPublication)}</p>
  </section>
  <section aria-labelledby="ml-hebergeur">
    <h2 id="ml-hebergeur">Hébergeur</h2>
    <p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" rel="noopener">www.netlify.com</a></p>
  </section>
  <section aria-labelledby="ml-propriete">
    <h2 id="ml-propriete">Propriété intellectuelle</h2>
    <p>Les textes, photographies, gravures, dessins et couvertures reproduits sur ce site appartiennent à leurs auteurs et autrices et aux éditions du Canapé. Toute reproduction sans autorisation est interdite. Pour toute demande, écrivez-nous.</p>
    <p>Fond de carte des régions : données ouvertes issues du projet « france-geojson », d’après les contours administratifs publiés par l’IGN.</p>
  </section>
  <section aria-labelledby="confidentialite" id="confidentialite">
    <h2 id="confidentialite-titre">Politique de confidentialité</h2>
    <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience, et n’utilise aucun service tiers de suivi. Les polices de caractères sont hébergées sur le site lui-même.</p>
    <p>Les informations saisies dans les formulaires (nom, e-mail, adresse, message, livre et quantité commandés) sont transmises par le service Netlify Forms aux éditions du Canapé. Elles servent uniquement à répondre à votre demande, à traiter votre commande ou à vous prévenir de la sortie d’un livre. Elles ne sont ni vendues ni cédées. Elles sont conservées le temps nécessaire au traitement de votre demande.</p>
    <p>Conformément au Règlement général sur la protection des données (RGPD), vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:${site.email}">${site.email}</a> ou par courrier à l’adresse du siège. Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" rel="noopener">www.cnil.fr</a>).</p>
  </section>
</div>`, jsonld: [fil([['Accueil', '/'], ['Mentions légales', '/mentions-legales/']])], classe: 'p-legal' }));

/* 404 */
const page404 = page({ chemin: '/404.html', titre: 'Page introuvable', description: 'Cette page n’existe pas ou plus.', contenu: `
<section class="entete-page grille merci">
  <p class="tampon tampon--grand" aria-hidden="true">404</p>
  <h1 class="titre-page">Page introuvable</h1>
  <p class="chapo">Cette page a dû glisser entre deux coussins du Canapé.</p>
  <div class="actions"><a class="bouton bouton--encre" href="/">Retour à l’accueil</a><a class="lien-fleche" href="/catalogue/">Voir le catalogue</a></div>
</section>`, classe: 'p-404' });

/* ---------- écriture ---------- */
function copier(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) { fs.mkdirSync(dst, { recursive: true }); for (const f of fs.readdirSync(src)) copier(path.join(src, f), path.join(dst, f)); }
  else fs.copyFileSync(src, dst);
}
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
copier(path.join(RACINE, 'assets'), path.join(DIST, 'assets'));
copier(path.join(RACINE, 'images'), path.join(DIST, 'images'));
for (const p of pages) {
  const f = path.join(DIST, p.chemin, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, p.html);
}
fs.writeFileSync(path.join(DIST, '404.html'), page404);
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter((p) => !p.chemin.includes('/merci/')).map((p) => `  <url><loc>${site.url}${p.chemin}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /contact/merci/\n\nSitemap: ${site.url}/sitemap.xml\n`);
// Redirections depuis les adresses de l'ancien site Wix
const anciennes = { '/catalogue': '/catalogue/', '/bibliotheque': '/catalogue/', '/projets': '/a-paraitre/', '/bientot': '/a-paraitre/', '/copie-de-bient%C3%B4t': '/a-paraitre/', '/carnet': '/carnet/', '/actualites': '/carnet/', '/contact': '/contact/', '/mlkjhg': '/contact/', '/about-4': '/la-maison/', '/shanghai': '/a-paraitre/reconnaissances-de-shanghai/', '/system-d': '/a-paraitre/systeme-d/', '/street-iconotextes': '/a-paraitre/street-iconotextes/' };
livres.forEach((l) => (anciennes['/' + l.slug] = `/livres/${l.slug}/`));
projets.forEach((p) => { if (!anciennes['/' + p.slug] && p.slug !== 'reconnaissances-de-shanghai' && p.slug !== 'systeme-d') anciennes['/' + p.slug] = `/a-paraitre/${p.slug}/`; });
fs.writeFileSync(path.join(DIST, '_redirects'), Object.entries(anciennes).map(([a, b]) => `${a}  ${b}  301`).join('\n') + '\n');

console.log(`✓ ${pages.length + 1} pages générées dans dist/`);
if (imagesManquantes.length) console.warn('⚠ Images introuvables :\n  ' + [...new Set(imagesManquantes)].join('\n  '));
