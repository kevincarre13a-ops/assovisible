// Génère les pages HTML du site à partir de site/data/*.json
// Usage : node tools/build.mjs   (les pages sont écrites dans site/)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const load = (n) => JSON.parse(readFileSync(join(ROOT, 'data', n + '.json'), 'utf8'));
const S = load('site'), ACTIONS = load('actions'), COL = load('collectes'), PROJ = load('projets'),
  NEWS = load('actualites'), PART = load('partenaires'), BUR = load('bureau');
const C = S.contact;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wait = (p) => (p ? '<span class="tag wait">À compléter</span>' : '');
const years = Math.floor((Date.now() - new Date(S.creationDate)) / (365.25 * 864e5));

const ICONS = {
  heart: '<path d="M12 21s-7-4.6-9.3-9.2C1 8.300 3 5 6.200 5c1.900 0 3.400 1 4.300 2.600l1.500 2.400 1.500-2.400C14.400 6 15.900 5 17.800 5 21 5 23 8.300 21.300 11.800 19 16.400 12 21 12 21z"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18"/>',
  hand: '<path d="M7 11V6a1.500 1.500 0 013 0v4m0-1V4.500a1.500 1.500 0 013 0V10m0-4.500a1.500 1.500 0 013 0V14c0 4-2.500 7-6.500 7C7.500 21 6 19 4.500 16l-1.500-3a1.500 1.500 0 012.500-1.500L7 13"/>',
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  plane: '<path d="M2 14l20-9-6 16-4-7z"/><path d="M12 14l10-9"/>',
  building: '<path d="M4 21V5l8-2 8 2v16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 3h4l2 5-2.500 1.500a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  gift: '<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8S10 3 7.500 4.500 9 8 12 8zm0 0s2-5 4.500-3.500S15 8 12 8z"/>',
  leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19c3-5 6-8 10-10"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.500"/>',
};
const ico = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const PAGES = [
  { f: 'index.html', nav: 'Accueil' },
  { f: 'association.html', nav: "L'association" },
  { f: 'actions.html', nav: 'Nos actions' },
  { f: 'collectes.html', nav: 'Collectes & besoins' },
  { f: 'projets.html', nav: 'Projets & voyages' },
  { f: 'actualites.html', nav: 'Actualités & galerie' },
  { f: 'mecenat.html', nav: 'Mécénat & entreprises' },
  { f: 'partenaires.html', nav: 'Partenaires & mécènes' },
  { f: 'faire-un-don.html', nav: 'Faire un don' },
  { f: 'nous-rejoindre.html', nav: 'Nous rejoindre' },
  { f: 'contact.html', nav: 'Contact' },
  { f: 'mentions-legales.html', nav: 'Mentions légales' },
];
const MAIN = ['index.html', 'association.html', 'actions.html', 'collectes.html', 'projets.html', 'actualites.html', 'mecenat.html'];
const MORE = ['partenaires.html', 'nous-rejoindre.html', 'contact.html', 'mentions-legales.html'];
const link = (f) => (f === 'index.html' ? '/' : '/' + f.replace('.html', ''));
const navItem = (f, cur, label) => `<a href="${link(f)}"${f === cur ? ' aria-current="page"' : ''}>${esc(label || PAGES.find((p) => p.f === f).nav)}</a>`;
const SHORT = { 'actualites.html': 'Actualités', 'mecenat.html': 'Mécénat', 'collectes.html': 'Collectes & besoins', 'projets.html': 'Projets & voyages' };

const brand = `<a class="brand" href="/" aria-label="${esc(S.name)} – accueil"><img src="/assets/img/logo-mark.svg" width="44" height="44" alt=""><span><b>PrépaPharma<span class="b2">Solidaires</span></b><small>Préparateurs Pharmaceutiques Solidaires</small></span></a>`;

function header(cur) {
  const moreOn = MORE.includes(cur) ? ' on' : '';
  return `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="hd"><div class="wrap">${brand}
<nav class="nav" aria-label="Navigation principale">${MAIN.map((f) => navItem(f, cur, SHORT[f])).join('')}
<div class="dd"><button class="more${moreOn}" aria-expanded="false" aria-haspopup="true">Plus ▾</button><ul>${MORE.map((f) => `<li>${navItem(f, cur)}</li>`).join('')}</ul></div></nav>
<a class="btn btn-don" href="/faire-un-don">${ico('heart', 'sr-ico')}<span>Faire un don</span></a>
<button class="burger" aria-expanded="false" aria-controls="drawer" aria-label="Menu"><i></i><i></i><i></i></button></div></header>
<nav class="drawer" id="drawer" aria-label="Menu mobile">${PAGES.map((p) => navItem(p.f, cur)).join('')}</nav>`;
}

function footer() {
  return `<footer class="ft"><div class="wrap"><div class="cols">
<div><div class="brand"><img src="/assets/img/logo-mark.svg" width="44" height="44" alt=""><span><b>PrépaPharma<span class="b2">Solidaires</span></b></span></div><p>${esc(S.tagline)}</p><a class="btn btn-don" href="/faire-un-don">Faire un don</a></div>
<div><h2>Coordonnées</h2><ul><li>${esc(C.address)}</li><li><a href="tel:${C.phoneHref}">${esc(C.phone)}</a></li><li><a href="mailto:${C.email}">${esc(C.email)}</a></li></ul>
<h2 style="margin-top:1em">Réseaux sociaux</h2>${S.socials.length ? `<ul>${S.socials.map((s) => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a></li>`).join('')}</ul>` : '<p class="hint" style="color:#9db3c9">Liens à renseigner (aucun compte public trouvé à ce jour).</p>'}</div>
<div><h2>Le site</h2><ul>${PAGES.filter((p) => !['mentions-legales.html', 'faire-un-don.html'].includes(p.f)).map((p) => `<li><a href="${link(p.f)}">${esc(p.nav)}</a></li>`).join('')}</ul></div>
</div><div class="bottom"><span>© ${new Date().getFullYear()} ${esc(S.name)} – Association loi 1901</span><a href="/mentions-legales">Mentions légales</a></div></div></footer>`;
}

function layout(p, body) {
  const cur = p.f;
  const url = S.url + (cur === 'index.html' ? '/' : link(cur));
  return `<!doctype html>
<html lang="fr" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}"><meta name="theme-color" content="#0b2a4a">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:url" content="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css">
<style>:root{--hero:url(/${S.heroImage})}</style>
</head><body>
${header(cur)}
<main id="contenu">${body}</main>
${footer()}
<script src="/assets/js/main.js" defer></script>
</body></html>`;
}

const pagehead = (title, lead, crumb) => `<section class="pagehead"><div class="wrap"><p class="crumb"><a href="/">Accueil</a> › ${esc(crumb || title)}</p><h1>${esc(title)}</h1><p>${esc(lead)}</p></div></section>`;
const secH = (eyebrow, h, p = '') => `<div class="sec-h rv"><span class="eyebrow">${esc(eyebrow)}</span><h2>${esc(h)}</h2>${p ? `<p>${p}</p>` : ''}</div>`;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date à renseigner');

function form(name, subject, fields, submit = 'Envoyer') {
  return `<form class="f rv" name="${name}" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field" data-ajax>
<input type="hidden" name="form-name" value="${name}"><input type="hidden" name="subject" value="${esc(subject)} – %{formName}">
<p class="hp" aria-hidden="true"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
${fields}
<label class="check"><input type="checkbox" name="consentement" required> <span>J'accepte que mes données soient utilisées pour traiter ma demande (voir la <a href="/mentions-legales#confidentialite">politique de confidentialité</a>).</span></label>
<button class="btn btn-green" type="submit">${submit}</button><div class="msg" role="status" tabindex="-1"></div></form>`;
}
const fld = (id, label, type = 'text', extra = '') => `<div><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${extra}></div>`;
const area = (id, label, req = true) => `<div><label for="${id}">${label}</label><textarea id="${id}" name="${id}" ${req ? 'required' : ''}></textarea></div>`;
const sel = (id, label, opts, req = true) => `<div><label for="${id}">${label}</label><select id="${id}" name="${id}" ${req ? 'required' : ''}><option value="">Choisir…</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>`;
const identity = (p) => `<div class="fr">${fld(p + 'nom', 'Nom et prénom', 'text', 'required autocomplete="name"')}${fld(p + 'email', 'E-mail', 'email', 'required autocomplete="email"')}</div><div class="fr">${fld(p + 'tel', 'Téléphone', 'tel', 'autocomplete="tel"')}${fld(p + 'ville', 'Ville', 'text', 'autocomplete="address-level2"')}</div>`;

const donateBtn = (cls = 'btn-don') => S.donationUrl
  ? `<a class="btn ${cls}" href="${esc(S.donationUrl)}" rel="noopener" target="_blank">Don en ligne sécurisé ↗</a>`
  : `<span class="notice" style="display:block">Lien de don en ligne (HelloAsso ou équivalent) <b>à renseigner</b> : champ <code>donationUrl</code> dans <code>site/data/site.json</code>. Aucun paiement n'est géré sur ce site.</span>`;

// ---------- Carte ----------
const FR = [[2.5, 51.1], [4.2, 50.0], [5.8, 49.5], [8.2, 49.0], [7.6, 47.6], [6.1, 46.3], [7.0, 45.9], [7.7, 44.1], [7.5, 43.8], [6.2, 43.1], [4.5, 43.4], [3.1, 42.5], [1.5, 42.6], [-0.3, 42.9], [-1.8, 43.4], [-1.2, 45.0], [-1.2, 46.2], [-2.3, 47.2], [-4.7, 47.8], [-4.5, 48.6], [-1.6, 48.7], [-1.3, 49.7], [0.3, 49.5], [1.6, 50.9]];
const CORSE = [[8.6, 42.95], [9.4, 43.0], [9.5, 42.2], [9.2, 41.4], [8.7, 41.6], [8.6, 42.3]];
const proj = ([lo, la]) => `${((lo + 5.2) * 34.7).toFixed(1)},${((51.4 - la) * 50).toFixed(1)}`;
function mapSvg() {
  const pins = ACTIONS.filter((a) => a.lat != null).map((a) => { const [x, y] = proj([a.lon, a.lat]).split(','); return `<a href="/actions#${a.id}" class="pin" aria-label="${esc(a.title)} – ${esc(a.place)}"><circle class="p" cx="${x}" cy="${y}" r="10"/><circle class="c" cx="${x}" cy="${y}" r="8"/></a>`; }).join('');
  const lyon = proj([4.84, 45.76]).split(',');
  return `<svg viewBox="0 0 520 520" role="img" aria-label="Carte de France : actions dans la métropole de Lyon"><polygon class="france" points="${FR.map(proj).join(' ')}"/><polygon class="france" points="${CORSE.map(proj).join(' ')}"/>${pins}<text text-anchor="end" x="${+lyon[0] - 18}" y="${+lyon[1] + 5}" font-family="Nunito,sans-serif" font-weight="700" font-size="15" fill="#0b2a4a">Lyon · Décines-Charpieu</text></svg>`;
}
const intl = `<div class="card" style="margin-top:16px;display:flex;gap:14px;align-items:center"><div class="ico" style="margin:0">${ico('globe')}</div><div><b>International</b><br><span class="hint">Pays et lieux d'action à renseigner par l'association ${wait(true)}</span></div></div>`;

// ---------- Pages ----------
const body = {};

body['index.html'] = () => {
  const stats = S.stats.map((s) => {
    const v = s.key === 'years' ? years : s.value;
    return v == null ? `<div class="stat empty rv"><b>—</b><span>${esc(s.label)}<br><small>à renseigner</small></span></div>`
      : `<div class="stat rv" data-count><b><span data-to="${v}" data-suf="${esc(s.suffix || '')}">0${esc(s.suffix || '')}</span></b><span>${esc(s.label)}</span></div>`;
  }).join('');
  return `<section class="hero"><div class="wrap"><span class="eyebrow">Association loi 1901 · Décines-Charpieu · Lyon</span>
<h1>${esc(S.heroTitle)}</h1><p class="lead">${esc(S.heroText)}</p>
<div class="cta"><a class="btn btn-don" href="/faire-un-don">Faire un don</a><a class="btn btn-line" href="/nous-rejoindre">Devenir bénévole</a></div></div><span class="scroll-ind" aria-hidden="true"></span></section>
<section class="sec"><div class="wrap">${secH('Nos actions', 'Des gestes simples, un vrai impact', 'Parce qu\'un préparateur en pharmacie sait ce qu\'un produit de première nécessité change dans une journée.')}
<div class="grid g3">${ACTIONS.slice(0, 3).map((a, i) => `<a class="card rv" href="/actions#${a.id}" style="text-decoration:none;color:inherit"><div class="ico">${ico(['gift', 'cross', 'hand'][i])}</div><span class="tag">${esc(a.scope)}</span> ${wait(a.placeholder)}<h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><b style="color:var(--green-d)">En savoir plus →</b></a>`).join('')}</div></div></section>
<section class="sec blue"><div class="wrap">${secH('Chiffres clés', 'L\'association en un coup d\'œil', 'Les chiffres non encore communiqués restent masqués : nous n\'affichons que des données vérifiées.')}<div class="stats">${stats}</div></div></section>
<section class="sec"><div class="wrap split"><div class="rv">${secH('Où agissons-nous ?', 'Ancrés à Lyon, ouverts sur le monde')}<p>Le siège de l'association est à Décines-Charpieu, dans la métropole de Lyon. Les autres lieux d'action seront ajoutés au fil des projets.</p><a class="btn btn-out" href="/actions">Voir toutes les actions</a></div><div class="map-box rv">${mapSvg()}</div></div></section>
<section class="sec alt"><div class="wrap">${secH('À venir', PROJ.next.title)}<div class="card rv"><div class="ico">${ico('box')}</div>${wait(PROJ.next.placeholder)}<p>${esc(PROJ.next.text)}</p><a class="btn btn-green" href="/collectes">Voir les besoins</a> <a class="btn btn-out" href="/projets">Projets &amp; voyages</a></div></div></section>
<section class="sec"><div class="wrap">${secH('Actualités', 'Les dernières nouvelles')}<div class="grid g2">${NEWS.posts.slice(0, 2).map(newsCard).join('')}</div><p style="margin-top:20px"><a class="btn btn-out" href="/actualites">Toutes les actualités</a></p></div></section>
<section class="sec alt"><div class="wrap">${secH('Ils nous soutiennent', 'Partenaires & mécènes', esc(PART.intro))}${partnersHtml()}<p style="margin-top:20px"><a class="btn btn-out" href="/mecenat">Devenir mécène</a></p></div></section>
<section class="sec"><div class="wrap"><div class="cta-band rv"><div><h2>Ensemble, faisons passer le soin avant tout</h2><p>Un don, quelques heures ou un colis : chaque geste compte.</p></div><div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="/faire-un-don">Faire un don</a><a class="btn" href="/nous-rejoindre">Nous rejoindre</a></div></div></div></section>`;
};

function newsCard(n) {
  return `<article class="card news rv" data-cat-item="${esc(n.category)}"><div class="im">${n.image ? `<img src="${esc(n.image)}" alt="${esc(n.alt)}" loading="lazy">` : ico('camera')}</div><div class="bd"><span class="tag">${esc(n.category)}</span> ${wait(n.placeholder)}<h3>${esc(n.title)}</h3><time>${esc(fmtDate(n.date))}</time><p>${esc(n.text)}</p></div></article>`;
}
function partnersHtml() {
  return PART.partenaires.length
    ? `<div class="partners">${PART.partenaires.map((p) => `<a class="partner" href="${esc(p.url || '#')}" rel="noopener" target="_blank">${p.logo ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">` : esc(p.name)}</a>`).join('')}</div>`
    : `<div class="partners">${[1, 2, 3, 4].map(() => '<div class="partner">Votre logo ici</div>').join('')}</div><p class="hint" style="margin-top:12px">${esc(PART.empty)}</p>`;
}

body['association.html'] = () => `<section class="sec"><div class="wrap split"><div>${secH('Notre histoire', 'Née de la pharmacie, tournée vers les autres')}
<p>Les Préparateurs Pharmaceutiques Solidaires sont une association loi 1901 déclarée le <b>${esc(S.legal.declared)}</b> à Décines-Charpieu (Rhône), dans la métropole de Lyon. Son objet : <i>« ${esc(S.legal.object.replace(/\.$/, ''))} »</i>.</p>
<p>Elle est portée par des préparateurs en pharmacie, qui mettent leur connaissance des produits de santé au service des personnes en situation de précarité.</p>
<p class="notice">Texte d'attente : l'histoire détaillée (premiers pas, anecdotes, étapes clés) sera rédigée par l'association.</p></div>
<div class="timeline rv"><div><b>8 octobre 2024</b><br>Déclaration de l'association en préfecture du Rhône.</div><div><b>22 octobre 2024</b><br>Publication au Journal officiel des associations.</div><div><b>${new Date().getFullYear()}</b><br>Poursuite des collectes et des projets <span class="tag wait">À compléter</span></div></div></div></section>
<section class="sec alt"><div class="wrap">${secH('Nos valeurs', 'Ce qui nous guide')}<div class="grid g4">
${[['heart', 'Solidarité', 'Agir concrètement auprès de celles et ceux qui en ont le plus besoin.'], ['hand', 'Dignité', 'Donner avec respect : on montre les gestes, jamais la détresse.'], ['leaf', 'Réemploi', 'Donner une seconde vie aux produits et dispositifs médicaux.'], ['cross', 'Rigueur', 'Le sérieux du métier de préparateur au service de chaque don.']].map(([i, t, x]) => `<div class="card rv"><div class="ico">${ico(i)}</div><h3>${t}</h3><p>${x}</p></div>`).join('')}</div>
<p class="hint" style="margin-top:14px">Valeurs proposées d'après l'objet de l'association – à valider ou modifier par ses membres.</p></div></section>
<section class="sec"><div class="wrap">${secH('Nos missions', 'Trois missions', '')}<div class="grid g3">
${[['gift', 'Collecter', 'Rassembler produits de parapharmacie, d\'hygiène et dispositifs médicaux.'], ['box', 'Trier & préparer', 'Contrôler, trier et constituer des kits avec le savoir-faire de la pharmacie.'], ['hand', 'Redistribuer', 'Remettre les dons aux personnes concernées, en France et à l\'international.']].map(([i, t, x], n) => `<div class="card rv"><div class="ico">${ico(i)}</div><span class="tag coral">${n + 1}</span><h3>${t}</h3><p>${x}</p></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap">${secH('Bureau & équipe', 'Les personnes derrière l\'association')}<div class="grid g3">${BUR.membres.map((m) => `<div class="card rv"><div class="ico">${ico('heart')}</div><h3>${esc(m.name)}</h3><p>${esc(m.role)}</p></div>`).join('')}</div><p class="hint" style="margin-top:14px">${esc(BUR.note)}</p></div></section>`;

body['actions.html'] = () => `<section class="sec"><div class="wrap split"><div class="map-box rv">${mapSvg()}${intl}</div><div>${secH('Carte des actions', 'Où nous agissons', 'Cliquez sur un point pour accéder à la fiche de l\'action.')}<ul class="list">${ACTIONS.map((a) => `<li><a href="#${a.id}">${esc(a.title)}</a> – ${esc(a.place)}</li>`).join('')}</ul></div></div></section>
<section class="sec alt"><div class="wrap">${secH('Fiches actions', 'Ce que nous faisons')}<div class="grid g2">${ACTIONS.map((a) => `<article class="card rv" id="${a.id}"><span class="tag">${esc(a.scope)}</span> ${wait(a.placeholder)}<h3>${esc(a.title)}</h3><p><b>${ico('pin', 'sr-ico')} ${esc(a.place)}</b></p><p>${esc(a.text)}</p></article>`).join('')}</div></div></section>`;

body['collectes.html'] = () => `<section class="sec"><div class="wrap">${secH('En cours', 'Collectes')}<div class="grid g2">${COL.collectes.map((c) => `<div class="card rv"><span class="tag coral">${esc(c.status)}</span> ${wait(c.placeholder)}<h3>${esc(c.title)}</h3><p><b>${esc(c.dates)}</b><br>${esc(c.where)}</p><p>${esc(c.text)}</p></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap">${secH('Besoins', 'Ce dont nous avons besoin', 'Liste indicative, à valider par l\'association.')}<div class="grid g3">${COL.besoins.map((b) => `<div class="card rv"><h3>${esc(b.cat)}</h3>${wait(b.placeholder)}<ul class="list">${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div></div></section>
<section class="sec"><div class="wrap">${secH('Déposer un don', 'Comment et où déposer')}<div class="grid g2"><div class="card rv"><h3>Comment ?</h3><p>${esc(COL.deposit.how)}</p><h3>Où ?</h3><p>${esc(COL.deposit.where)}</p></div>
<div class="card rv"><h3>Accepté</h3><ul class="list ok">${COL.deposit.accepted.map((i) => `<li>${esc(i)}</li>`).join('')}</ul><h3>Non accepté</h3><ul class="list no">${COL.deposit.refused.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div></div><p class="notice">${esc(COL.deposit.note)}</p><a class="btn btn-green" href="/faire-un-don#nature">Proposer un don en nature</a></div></section>`;

body['projets.html'] = () => `<section class="sec"><div class="wrap">${secH('À venir', 'Nos projets')}<div class="grid g2">${PROJ.projets.map((p) => `<div class="card flip rv" tabindex="0"><div class="face"><span class="tag coral">${esc(p.type)} · ${esc(p.status)}</span><h3>${esc(p.title)}</h3></div><div class="more"><p>${esc(p.text)}</p>${wait(p.placeholder)}</div></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap">${secH('Retours', 'Voyages passés et futurs')}<div class="grid g2">${PROJ.voyages.map((v) => `<div class="card rv"><span class="tag">${esc(v.year)}</span> ${wait(v.placeholder)}<h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></div>`).join('')}</div>
<div class="cta-band rv" style="margin-top:32px"><div><h2>Soutenez nos prochains projets</h2><p>Un don financier, du matériel ou des compétences.</p></div><a class="btn" href="/mecenat">Devenir mécène</a></div></div></section>`;

body['actualites.html'] = () => `<section class="sec"><div class="wrap">${secH('Actualités & galerie', 'Nos actions en images', 'Photos centrées sur les gestes, les colis et les bénévoles. Aucune personne vulnérable ni aucun mineur n\'est montré sans accord.')}
<div class="filters" role="group" aria-label="Filtrer par action"><button aria-pressed="true" data-cat="*">Tout</button>${NEWS.categories.map((c) => `<button aria-pressed="false" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
<div class="grid g3">${NEWS.posts.map(newsCard).join('')}</div></div></section>`;

body['mecenat.html'] = () => `<section class="sec"><div class="wrap">${secH('Pourquoi nous soutenir ?', 'Un soutien qui se voit et qui se sent', 'Chaque contribution se transforme en kits, en colis et en sourires – avec la rigueur des professionnels de la pharmacie.')}
<div class="grid g3">${[['heart', 'Impact local', 'Des actions concrètes dans la métropole de Lyon.'], ['cross', 'Expertise santé', 'Un tri et une préparation menés par des préparateurs en pharmacie.'], ['globe', 'Ouverture', 'Un projet qui ambitionne aussi des actions à l\'international.']].map(([i, t, x]) => `<div class="card rv"><div class="ico">${ico(i)}</div><h3>${t}</h3><p>${x}</p></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap">${secH('Formes de soutien', 'Entreprises, pharmacies, laboratoires, partenaires')}<div class="grid g3">${[['gift', 'Financier', 'Don ponctuel ou régulier pour financer collectes, kits et transports.'], ['box', 'Matériel & produits', 'Produits d\'hygiène, de parapharmacie, dispositifs médicaux en bon état.'], ['hand', 'Compétences', 'Logistique, communication, formation, mise à disposition de collaborateurs.']].map(([i, t, x]) => `<div class="card rv"><div class="ico">${ico(i)}</div><h3>${t}</h3><p>${x}</p></div>`).join('')}</div>
<div class="notice"><b>Avantages fiscaux – texte d'attente à valider.</b> Le statut d'intérêt général de l'association et la délivrance de reçus fiscaux n'ont pas été confirmés à ce jour. Aucun avantage fiscal ne peut donc être garanti ; l'association indiquera ici la situation exacte une fois vérifiée.</div></div></section>
<section class="sec"><div class="wrap split"><div>${secH('Parlons-en', 'Contacter l\'association en tant que mécène', 'Présentez-nous votre structure et le type de soutien envisagé : nous revenons vers vous rapidement.')}<p><b>${esc(C.president)}</b>, ${esc(C.role.toLowerCase())}<br><a href="tel:${C.phoneHref}">${esc(C.phone)}</a><br><a href="mailto:${C.email}">${esc(C.email)}</a></p></div>
${form('mecenat', 'Nouveau contact mécène', `${fld('structure', 'Structure / entreprise', 'text', 'required')}${sel('type', 'Type de structure', ['Entreprise', 'Pharmacie', 'Laboratoire', 'Collectivité', 'Autre'])}${identity('')}${sel('soutien', 'Soutien envisagé', ['Financier', 'Matériel / produits', 'Compétences', 'Je ne sais pas encore'])}${area('message', 'Votre message')}`)}</div></section>`;

body['partenaires.html'] = () => `<section class="sec"><div class="wrap">${secH('Nos soutiens', 'Partenaires & mécènes', esc(PART.intro))}${partnersHtml()}<div class="cta-band rv" style="margin-top:36px"><div><h2>Vous aussi, rejoignez-les</h2><p>Pharmacies, laboratoires, entreprises : construisons un partenariat.</p></div><a class="btn" href="/mecenat">Devenir mécène</a></div></div></section>`;

body['faire-un-don.html'] = () => `<section class="sec"><div class="wrap split"><div class="rv">${secH('Don financier', 'Faire un don en ligne', 'Le paiement s\'effectue sur une plateforme externe sécurisée. Ce site ne traite aucun paiement.')}${donateBtn()}<p class="notice">Texte d'attente : la réception d'un reçu fiscal dépend du statut de l'association (non confirmé à ce jour). L'association précisera ici les conditions.</p></div>
<div class="card rv"><div class="ico">${ico('heart')}</div><h3>Pourquoi donner ?</h3><p>Chaque don finance des kits d'hygiène, des collectes et des projets solidaires portés par des préparateurs en pharmacie.</p></div></div></section>
<section class="sec alt" id="nature"><div class="wrap split"><div>${secH('Don en nature', 'Proposer un don en nature', 'Décrivez ce que vous souhaitez donner. Nous vous confirmons si nous pouvons l\'accepter, et où le déposer. Consultez d\'abord la <a href="/collectes">liste des besoins</a>.')}</div>
${form('don-nature', 'Proposition de don en nature', `${sel('nature', 'Nature du don', ['Produits d\'hygiène', 'Parapharmacie', 'Dispositifs médicaux', 'Vêtements / textile', 'Autre'])}<div class="fr">${fld('quantite', 'Quantité (approximative)', 'text', 'required')}${fld('localisation', 'Localisation du don (ville)', 'text', 'required')}</div>${area('description', 'Description du don')}${identity('')}`, 'Proposer ce don')}</div></section>`;

body['nous-rejoindre.html'] = () => `<section class="sec"><div class="wrap">${secH('Bénévolat', 'Devenir bénévole', 'Texte d\'attente : missions, disponibilités et profils recherchés seront précisés par l\'association.')}
<div class="grid g3">${[['hand', 'Collecter', 'Tenir un point de collecte, sensibiliser autour de vous.'], ['box', 'Trier & préparer', 'Aider au tri et à la constitution de kits.'], ['plane', 'Voyager', 'Participer aux projets et voyages humanitaires.']].map(([i, t, x]) => `<div class="card rv"><div class="ico">${ico(i)}</div><h3>${t}</h3><p>${x}</p></div>`).join('')}</div></div></section>
<section class="sec alt"><div class="wrap split"><div>${secH('Adhésion', 'Adhérer à l\'association', 'Texte d\'attente : montant de la cotisation, avantages et modalités à renseigner par l\'association.')}<p class="notice">Les informations sur l'adhésion n'ont pas été trouvées publiquement.</p></div>
${form('benevole', 'Candidature bénévole / adhésion', `${sel('demande', 'Je souhaite', ['Devenir bénévole', 'Adhérer', 'Les deux'])}${identity('')}${sel('profil', 'Profil', ['Préparateur / préparatrice en pharmacie', 'Pharmacien(ne)', 'Étudiant(e)', 'Autre'])}${area('message', 'Quelques mots sur vous et vos disponibilités', false)}`, 'Envoyer ma demande')}</div></section>`;

body['contact.html'] = () => `<section class="sec"><div class="wrap split"><div>${secH('Écrivez-nous', 'Nous contacter')}
<ul style="list-style:none;padding:0;display:grid;gap:14px">
<li style="display:flex;gap:12px"><span class="ico" style="margin:0">${ico('pin')}</span><span>${esc(C.address)}</span></li>
<li style="display:flex;gap:12px"><span class="ico" style="margin:0">${ico('phone')}</span><a href="tel:${C.phoneHref}">${esc(C.phone)}</a></li>
<li style="display:flex;gap:12px"><span class="ico" style="margin:0">${ico('mail')}</span><a href="mailto:${C.email}">${esc(C.email)}</a></li></ul>
<p><b>${esc(C.president)}</b>, ${esc(C.role.toLowerCase())}</p><h3>Réseaux sociaux</h3>${S.socials.length ? `<ul class="list">${S.socials.map((s) => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.label)}</a></li>`).join('')}</ul>` : '<p class="hint">Liens à renseigner (aucun compte public trouvé à ce jour).</p>'}</div>
${form('contact', 'Message via le site', `${identity('')}${sel('objet', 'Objet', ['Question générale', 'Collecte / don', 'Presse', 'Autre'])}${area('message', 'Votre message')}`)}</div></section>`;

body['mentions-legales.html'] = () => `<section class="sec"><div class="wrap" style="max-width:820px">
<h2>Éditeur du site</h2><p>${esc(S.name)} (${esc(S.short)}) – ${esc(S.legal.form)}<br>Siège : ${esc(C.address)}<br>RNA : ${esc(S.legal.rna)} · SIREN : ${esc(S.legal.siren)}<br>Déclarée le ${esc(S.legal.declared)} – JOAFE du ${esc(S.legal.joPublication)}<br>Présidente et directrice de la publication : ${esc(C.president)}<br>Contact : <a href="mailto:${C.email}">${esc(C.email)}</a> – ${esc(C.phone)}</p>
<h2>Hébergement</h2><p>Netlify, Inc. – 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2 id="confidentialite">Politique de confidentialité</h2><p>Les formulaires collectent uniquement les informations nécessaires au traitement de votre demande (identité, coordonnées, message). Elles sont reçues par l'association via la plateforme Netlify Forms et ne sont ni vendues ni cédées. Vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à <a href="mailto:${C.email}">${esc(C.email)}</a>. Le site n'utilise aucun traceur publicitaire.</p>
<p class="notice">Texte d'attente à compléter par l'association : durée de conservation, base légale, éventuelle désignation d'un référent données.</p>
<h2>Informations sur les dons</h2><p class="notice">Texte d'attente à compléter par l'association : statut d'intérêt général, conditions de délivrance des reçus fiscaux, utilisation des dons. Aucun avantage fiscal n'est affirmé tant que ce statut n'est pas confirmé. Les dons en ligne sont traités par une plateforme externe, qui en est seule responsable.</p>
<h2>Propriété intellectuelle &amp; crédits</h2><p>Textes et visuels : © ${esc(S.name)}. Polices Fraunces et Nunito sous licence SIL OFL.</p></div></section>`;

body['merci.html'] = () => `<section class="sec"><div class="wrap" style="text-align:center;max-width:640px"><div class="ico" style="margin:0 auto 16px">${ico('heart')}</div><h2>Merci !</h2><p>Votre message a bien été envoyé. L'association vous répondra rapidement.</p><a class="btn btn-green" href="/">Retour à l'accueil</a></div></section>`;
body['404.html'] = () => `<section class="sec"><div class="wrap" style="text-align:center;max-width:640px"><h1>Page introuvable</h1><p>Cette page n'existe pas ou a été déplacée.</p><a class="btn btn-green" href="/">Retour à l'accueil</a></div></section>`;

const META = {
  'index.html': ['PrépaPharmaSolidaires – Préparateurs Pharmaceutiques Solidaires', 'Association de préparateurs en pharmacie : collectes, réemploi de dispositifs médicaux et distributions solidaires, à Lyon et au-delà.'],
  'association.html': ["L'association – PrépaPharmaSolidaires", "Histoire, valeurs, missions et bureau des Préparateurs Pharmaceutiques Solidaires.", "Des préparateurs en pharmacie au service de la solidarité.", "L'association"],
  'actions.html': ['Nos actions – PrépaPharmaSolidaires', 'Actions solidaires en France et à l\'international : carte et fiches par action.', 'Actions solidaires et humanitaires : où et comment nous agissons.', 'Nos actions'],
  'collectes.html': ['Collectes & besoins – PrépaPharmaSolidaires', 'Collectes en cours, besoins en matériel et produits, comment et où déposer vos dons.', 'Ce dont nous avons besoin, et comment nous le confier.', 'Collectes & besoins'],
  'projets.html': ['Projets & voyages humanitaires – PrépaPharmaSolidaires', 'Projets à venir, voyages humanitaires passés et futurs.', 'Les prochains projets et voyages humanitaires.', 'Projets & voyages'],
  'actualites.html': ['Actualités & galerie – PrépaPharmaSolidaires', 'Actualités et photos des actions, collectes et distributions.', 'Collectes, distributions, voyages : la vie de l\'association.', 'Actualités & galerie'],
  'mecenat.html': ['Mécénat & entreprises – PrépaPharmaSolidaires', 'Soutenez l\'association : formes de mécénat pour entreprises, pharmacies et laboratoires.', 'Entreprises, pharmacies, laboratoires : soutenez nos actions.', 'Mécénat & entreprises'],
  'partenaires.html': ['Partenaires & mécènes – PrépaPharmaSolidaires', 'Les partenaires et mécènes qui soutiennent l\'association.', 'Merci à celles et ceux qui nous soutiennent.', 'Partenaires & mécènes'],
  'faire-un-don.html': ['Faire un don – PrépaPharmaSolidaires', 'Faire un don financier ou proposer un don en nature à l\'association.', 'Un don, un geste : financier ou en nature.', 'Faire un don'],
  'nous-rejoindre.html': ['Nous rejoindre – PrépaPharmaSolidaires', 'Devenir bénévole ou adhérer à l\'association.', 'Bénévole ou adhérent : il y a une place pour vous.', 'Nous rejoindre'],
  'contact.html': ['Contact – PrépaPharmaSolidaires', 'Contacter l\'association : formulaire, téléphone, e-mail et adresse.', 'Une question ? Écrivez-nous ou appelez-nous.', 'Contact'],
  'mentions-legales.html': ['Mentions légales – PrépaPharmaSolidaires', 'Mentions légales, politique de confidentialité et informations sur les dons.', 'Informations légales et réglementaires.', 'Mentions légales'],
  'merci.html': ['Merci – PrépaPharmaSolidaires', 'Message envoyé.', '', 'Merci'],
  '404.html': ['Page introuvable – PrépaPharmaSolidaires', 'Page introuvable.', '', 'Introuvable'],
};

for (const [f, m] of Object.entries(META)) {
  let b = body[f]();
  if (f !== 'index.html') b = (m[2] ? pagehead(PAGES.find((p) => p.f === f)?.nav || m[3], m[2], m[3]) : pagehead(m[3], m[1], m[3])) + b;
  writeFileSync(join(ROOT, f), layout({ f, title: m[0], desc: m[1] }, b));
}
// sitemap + robots
const urls = PAGES.map((p) => S.url + (p.f === 'index.html' ? '/' : link(p.f)));
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${S.url}/sitemap.xml\n`);
console.log('Pages générées :', Object.keys(META).length);
