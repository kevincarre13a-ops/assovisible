// Génère les pages HTML statiques du site (en-tête et pied de page communs).
// Les contenus (actions, agenda, actualités…) vivent dans site/data/*.json et sont affichés par site/js/main.js.
// Usage : node tools/build-pages.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const site = JSON.parse(readFileSync(join(root, "data", "site.json"), "utf8"));
const NOM = site.nom;
const BASE_DESC = "Association des habitants du quartier Notre-Dame Viosne à Pontoise.";

const NAV = [
  ["index.html", "Accueil"],
  ["association.html", "L’association"],
  ["quartier.html", "Le quartier"],
  ["actions.html", "Nos actions"],
  ["agenda.html", "Agenda"],
  ["galerie.html", "Galerie"],
  ["actualites.html", "Actualités"],
  ["infos-utiles.html", "Infos utiles"],
  ["contact.html", "Nous rejoindre", "cta"],
];

const MARK = `<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#2c5a45"/><path d="M9 30h30v9H9z" fill="#f6f0e2" opacity=".0"/><path d="M10 24l7-8 7 8v9H10zM26 20l6-6 6 6v13H26z" fill="#f6f0e2"/><rect x="14" y="27" width="4" height="6" fill="#a9472c"/><rect x="30" y="25" width="4" height="8" fill="#a9472c"/><path d="M6 38c4-3 6 3 10 0s6 3 10 0 6 3 10 0 4 2 6 0" fill="none" stroke="#7cc3dc" stroke-width="3" stroke-linecap="round"/></svg>`;
const wavePath = (y, a, w) => { let d = `M0 ${y}`; for (let i = 0; i < 4; i++) d += `c100-${a} 200 ${a} 300 0s200-${a} 300 0`; return d + `v${110 - y}H0z`; };
const WAVE = (c) => `<div class="vagues" aria-hidden="true"><svg viewBox="0 0 2400 110" preserveAspectRatio="none"><path fill="${c}" opacity=".55" d="${wavePath(60, 40)}"/></svg><svg viewBox="0 0 2400 110" preserveAspectRatio="none"><path fill="${c}" d="${wavePath(82, 30)}"/></svg></div>`;
// Le motif d'onde est périodique (600 px) : la translation de -50 % de l'animation boucle sans à-coup.

function header(file) {
  const items = NAV.map(([href, label, cls]) => {
    const cur = href === file ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${cls ? ` class="${cls}"` : ""}${cur}>${label}</a></li>`;
  }).join("");
  return `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header"><div class="wrap">
<a class="brand" href="index.html" aria-label="${NOM} — accueil">${MARK}<span class="brand-txt"><strong>Notre-Dame Viosne</strong><span>Habitants du quartier · Pontoise</span></span></a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menu</span></button>
<nav class="nav" id="menu" aria-label="Navigation principale"><ul>${items}</ul></nav>
</div></header>`;
}

function footer(file) {
  const c = site.contact;
  const cur = (h) => (h === file ? ' aria-current="page"' : "");
  const links = NAV.map(([h, l]) => `<li><a href="${h}"${cur(h)}>${l}</a></li>`).join("");
  return `<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><h2>${NOM}</h2><p>Association d’habitants du quartier Notre-Dame, le long de la Viosne, à ${site.ville}.</p>
<p>Objet publié par la Ville : protéger les habitants du « quartier bas », promouvoir la mixité sociale et défendre l’environnement.</p></div>
<div><h2>Coordonnées</h2><ul>
<li><a href="mailto:${c.email}">${c.email}</a></li>
<li><a href="tel:${c.telephone_lien}">${c.telephone}</a></li>
<li>Adresse postale : à compléter</li></ul>
<p><small>${c.source}.</small></p></div>
<div><h2>Le site</h2><ul>${links}</ul></div>
<div><h2>Suivre la vie de Pontoise</h2><ul>
<li><a href="https://www.facebook.com/CommunedePontoise/" target="_blank" rel="noopener">Facebook de la Ville de Pontoise</a></li>
<li><a href="https://www.instagram.com/villepontoise/" target="_blank" rel="noopener">Instagram de la Ville de Pontoise</a></li>
<li><a href="https://www.ville-pontoise.fr/" target="_blank" rel="noopener">ville-pontoise.fr</a></li></ul>
<p><small>Pas encore de page publique de l’association identifiée.</small></p></div>
</div>
<div class="foot-bas"><span>© ${NOM}</span><span><a href="mentions-legales.html"${cur("mentions-legales.html")}>Mentions légales</a> · Maquette réalisée par AssoVisible, contenus à valider par l’association</span></div>
</div></footer>`;
}

function page({ file, title, desc, h1, lead, img = "img/hero-eglise-notre-dame.jpg", body, extraHead = "", home = false, wave = "#f6f0e2" }) {
  const fullTitle = home ? `${NOM} — Pontoise` : `${title} — ${NOM}`;
  const hero = home
    ? body.hero
    : `<div class="page-hero"><img src="${img}" alt="" width="1920" height="1280" fetchpriority="high"><div class="wrap"><h1>${h1}</h1><p>${lead}</p></div>${WAVE(wave)}</div>`;
  const main = home ? body.main : body;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#2c5a45">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap">
<link rel="stylesheet" href="css/style.css">
${extraHead}</head>
<body>
${header(file)}
<main id="contenu">
${hero}
${main}
</main>
${footer(file)}
<script src="js/main.js" defer></script>
</body>
</html>
`;
}

const noscript = `<noscript><p class="note">Ces contenus s’affichent avec JavaScript. Pour les consulter sans, écrivez-nous : ${site.contact.email}.</p></noscript>`;
const out = (f, html) => writeFileSync(join(root, f), html);

/* ---------- Accueil ---------- */
const sections = [
  ["association.html", "L’association", "Qui nous sommes, notre objet, notre bureau.", "maison"],
  ["quartier.html", "Le quartier", "Histoire, patrimoine, la Viosne et les lieux repères.", "arbre"],
  ["actions.html", "Nos actions", "Cadre de vie, dialogue avec la Ville, projets.", "boussole"],
  ["agenda.html", "Agenda", "Réunions et rendez-vous, archives.", "fete"],
  ["galerie.html", "Galerie", "Le quartier en images.", "note"],
  ["infos-utiles.html", "Infos utiles", "Ville, agglomération, signalements, démarches.", "coeur"],
];
const ico = {
  fete: '<path d="M4 20l5-12 7 7-12 5zM14 4l1 3M18 6l-2 2M20 10l-3 0"/>',
  maison: '<path d="M3 11l9-7 9 7v9H3zM9 20v-6h6v6"/>',
  note: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 16l-5-5-8 8"/>',
  coeur: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
  arbre: '<path d="M12 22v-7M12 15c-4 0-6-3-5-6-2-2-1-6 3-6 1-2 5-2 6 0 4 0 5 4 3 6 1 3-1 6-7 6z"/>',
  boussole: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
};
const svg = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ico[n]}</svg>`;

out("index.html", page({
  file: "index.html", home: true,
  desc: "Habitants du quartier Notre-Dame Viosne, à Pontoise : une association pour défendre le cadre de vie, animer le quartier et dialoguer avec la Ville. Informez-vous, participez, rejoignez-nous.",
  extraHead: `<link rel="preload" as="image" href="img/hero-eglise-notre-dame-m.jpg" media="(max-width:700px)"><link rel="preload" as="image" href="img/hero-eglise-notre-dame.jpg" media="(min-width:701px)">\n`,
  body: {
    hero: `<section class="hero" style="padding:0">
<picture><source media="(max-width:700px)" srcset="img/hero-eglise-notre-dame-m.jpg"><img class="hero-img" src="img/hero-eglise-notre-dame.jpg" alt="Le chevet et le clocher de l’église Notre-Dame de Pontoise sous un ciel bleu" width="1920" height="1280" fetchpriority="high"></picture>
<div class="wrap"><span class="eyebrow">Pontoise · quartier Notre-Dame</span>
<h1>Notre quartier, au fil de la Viosne</h1>
<p class="lead">Habiter, partager, protéger : bienvenue chez les habitants du quartier Notre-Dame Viosne.</p>
<div class="btn-row"><a class="btn btn-terre" href="contact.html">Rejoindre l’association</a><a class="btn btn-clair" href="quartier.html">Découvrir le quartier</a></div></div>
<span class="scroll-hint" aria-hidden="true">DÉFILER</span>
${WAVE("#f6f0e2")}</section>`,
    main: `<section class="rdv"><div class="wrap"><div class="rdv-card" data-render="next-rdv" aria-live="polite"><p>Chargement de l’agenda…</p></div></div></section>

<section><div class="wrap">
<div class="sec-head rev"><p class="kicker">Explorer le site</p><h2>Tout sur la vie du quartier</h2><p>Un quartier, une rivière, des voisins. Choisissez par où commencer.</p></div>
<div class="grid g3">
${sections.map(([h, t, d, i]) => `<a class="card rev" href="${h}"><div class="ico">${svg(i)}</div><h3>${t}</h3><p>${d}</p><span class="more">Découvrir →</span></a>`).join("\n")}
</div></div></section>

<section class="vert-bg"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Repères</p><h2>Quelques chiffres autour de nous</h2><p>Ces chiffres situent le quartier dans sa ville. Les chiffres propres à l’association (adhérents, événements…) s’ajouteront ici dès qu’ils seront communiqués.</p></div>
<div class="grid g3">
<div class="compteur rev"><b data-count="31970">0</b><span>habitants à Pontoise</span><small>Insee 2023, via Cergy-Pontoise Agglo</small></div>
<div class="compteur rev"><b data-count="17">0</b><span>associations de quartier recensées par la Ville</span><small>annuaire de ville-pontoise.fr</small></div>
<div class="compteur rev"><b data-count="2006" data-sep="none">0</b><span>Pontoise, Ville d’art et d’histoire depuis</span><small>label national</small></div>
</div></div></section>

<section><div class="wrap">
<div class="sec-head rev"><p class="kicker">Dernières nouvelles</p><h2>Actualités du quartier</h2></div>
<div class="grid g3" data-render="news" data-limit="3">${noscript}</div>
<p style="margin-top:2rem"><a class="btn btn-contour" href="actualites.html">Toutes les actualités</a></p>
</div></section>

<section class="alt"><div class="wrap split">
<figure class="rev" style="margin:0"><img src="img/lavoir-viosne.jpg" alt="Ancien lavoir au toit de tuiles rouges au bord de la Viosne" width="1400" height="1050" loading="lazy"><figcaption>Un lavoir au bord de la Viosne, jardin des Lavandières. Photo : P.poschadel, CC BY-SA 2.0 fr, Wikimedia Commons.</figcaption></figure>
<div class="rev"><p class="kicker" style="color:var(--terre);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.9rem">Rejoignez-nous</p><h2>Un quartier, ça se vit et ça se défend ensemble</h2>
<p>Que vous habitiez ici depuis toujours ou depuis hier, votre voix compte pour le cadre de vie, la mixité sociale et l’environnement du quartier.</p>
<div class="btn-row"><a class="btn btn-terre" href="contact.html">Adhérer ou donner un coup de main</a><a class="btn btn-contour" href="association.html">En savoir plus</a></div></div>
</div></section>`,
  },
}));

/* ---------- L'association ---------- */
out("association.html", page({
  file: "association.html", title: "L’association",
  desc: "Qui sont les Habitants du Quartier Notre-Dame Viosne à Pontoise : objet, histoire, valeurs et bureau de l’association.",
  h1: "L’association", lead: "Des habitants du « quartier bas » de Pontoise qui s’organisent pour leur cadre de vie.",
  img: "img/eglise-clocher.jpg",
  body: `<section><div class="wrap">
<div class="split"><div class="rev"><p class="pill">Notre objet</p><h2>Protéger, rassembler, défendre l’environnement</h2>
<p>Selon la fiche de l’association publiée par la Ville de Pontoise, elle a pour but d’<strong>assurer la protection des Pontoisiens du « quartier bas »</strong> et de <strong>promouvoir la mixité sociale et la défense de l’environnement</strong>.</p>
<p><a href="https://ville-pontoise.fr/habitants-du-quartier-notre-dame-viosne" target="_blank" rel="noopener">Voir la fiche officielle sur ville-pontoise.fr</a></p></div>
<div class="rev card"><h3>En bref</h3><ul style="padding-left:1.2rem;margin:0"><li><strong>Nom :</strong> Habitants du Quartier Notre-Dame Viosne</li><li><strong>Lieu :</strong> Pontoise, quartier Notre-Dame</li><li><strong>Catégorie :</strong> association de quartier</li><li><strong>Dénomination dans la presse :</strong> « Association des habitants du quartier Notre-Dame-Viosne-Gare »</li><li><strong>Année de création :</strong> à compléter</li></ul></div></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Nos valeurs</p><h2>Ce qui nous guide</h2></div>
<div class="grid g3">
<div class="card rev"><div class="ico">${svg("arbre")}</div><h3>Le cadre de vie</h3><p>Préserver l’environnement et la qualité de vie des habitants du quartier, au bord de la Viosne.</p></div>
<div class="card rev"><div class="ico">${svg("coeur")}</div><h3>La mixité sociale</h3><p>Un quartier où chacun a sa place, quel que soit son âge ou son parcours.</p></div>
<div class="card rev"><div class="ico">${svg("maison")}</div><h3>Le dialogue</h3><p>Faire connaître la parole des habitants et échanger avec la Ville, notamment lors des tours de quartier.</p></div>
</div></div></section>

<section><div class="wrap">
<div class="sec-head rev"><p class="kicker">Nos positions</p><h2>Ce que l’association a dit publiquement</h2>
<p>Voici, de façon factuelle, les prises de position que nous avons retrouvées dans la presse et chez la Ville. Elles ne reflètent pas forcément l’ensemble des échanges de l’association.</p></div>
<div class="grid g2">
<article class="card rev"><span class="pill">Octobre 2022 · Actu.fr</span><h3>Révision du Plan local d’urbanisme</h3><p>Après la réunion d’information du 20 octobre 2022, l’association a indiqué que la présentation n’avait pas dissipé toutes ses inquiétudes sur la protection de l’environnement des autres quartiers. Elle a demandé un procès-verbal clarifiant le critère de « taux d’emprise » et l’extension aux autres quartiers des mesures protégeant les habitants de l’Hermitage. Elle a aussi évoqué la circulation et le stationnement.</p><p><a href="https://actu.fr/ile-de-france/pontoise_95500/pontoise-quartier-de-la-gare-400-logements-a-la-place-d-une-friche_54863225.html" target="_blank" rel="noopener">Lire l’article d’Actu.fr</a></p></article>
<article class="card rev"><span class="pill">Décembre 2012 · 95.telif.tv</span><h3>L’ancien site de la Chambre de commerce</h3><p>Un article de la presse locale rapportait l’inquiétude de l’association quant à l’avenir du site de la rue de Rouen après le départ de la Chambre de commerce, et son souhait de mobiliser les habitants.</p><p><a href="http://95.telif.tv/2012/12/20/pontoise-les-habitants-du-quartier-notre-dame-ne-veulent-pas-dun-betonnage/" target="_blank" rel="noopener">Lire l’article</a></p></article>
</div></div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Qui fait vivre l’association</p><h2>Bureau et équipe</h2><p class="note">Aucun nom n’a pu être confirmé publiquement. Les cartes ci-dessous sont des textes d’attente à compléter par l’association.</p></div>
<div class="grid g4" data-render="bureau">${noscript}</div>
<p style="margin-top:2rem"><a class="btn btn-terre" href="contact.html">Nous écrire</a></p>
</div></section>`,
}));

/* ---------- Le quartier ---------- */
out("quartier.html", page({
  file: "quartier.html", title: "Le quartier",
  desc: "Histoire, patrimoine, Viosne et lieux repères du quartier Notre-Dame à Pontoise : frise chronologique et carte interactive.",
  h1: "Le quartier Notre-Dame", lead: "Un ancien faubourg d’eau et de pierre, entre église, lavoirs et rivière.",
  img: "img/lavoir-viosne.jpg",
  body: `<section><div class="wrap split">
<div class="rev"><p class="pill">Histoire</p><h2>Un faubourg né de la rivière</h2>
<p>Au XIIe siècle, le cours de la Viosne est aménagé à des fins économiques : moulins à blé, moulins à tan pour le cuir, moulins foulons pour les draps. La création du faubourg Notre-Dame, hors les murs de la ville, remonte à cette époque.</p>
<p>Aujourd’hui encore, une dérivation de la Viosne traverse la rue de Rouen, où l’on voit d’anciens lavoirs privatifs.</p>
<p><small>Source : <a href="https://fr.wikipedia.org/wiki/Pontoise" target="_blank" rel="noopener">Wikipédia, article « Pontoise »</a>.</small></p></div>
<figure class="rev" style="margin:0"><img src="img/place-notre-dame.jpg" alt="L’église Notre-Dame vue depuis la place Notre-Dame" width="1400" height="933" loading="lazy"><figcaption>La place et l’église Notre-Dame. Photo : GFreihalter, CC BY-SA 3.0, Wikimedia Commons.</figcaption></figure>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Frise</p><h2>Les grandes étapes</h2><p>Les étapes ci-dessous sont sourcées. Les cartes en pointillés sont des textes d’attente.</p></div>
<ol class="frise" data-render="timeline">${noscript}</ol>
</div></section>

<section><div class="wrap">
<div class="sec-head rev"><p class="kicker">Patrimoine</p><h2>L’eau, la pierre, la verdure</h2></div>
<div class="grid g3">
<div class="card rev"><h3>L’église Notre-Dame</h3><p>Son clocher à lanternon et ses toits de tuiles vernissées dominent la place Notre-Dame, cœur du faubourg.</p></div>
<div class="card rev"><h3>La Viosne et ses lavoirs</h3><p>Rivière de la vallée du Vexin, la Viosne traverse Pontoise. Le jardin des Lavandières en conserve d’anciens lavoirs.</p></div>
<div class="card rev"><h3>Une ville d’art et d’histoire</h3><p>Pontoise porte le label Ville d’art et d’histoire depuis 2006 et abrite un Site patrimonial remarquable.</p></div>
</div></div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Carte</p><h2>Les lieux repères</h2><p>Touchez un lieu dans la liste ou un repère sur la carte. Pour zoomer à la molette, cliquez d’abord sur la carte.</p></div>
<div class="map-wrap"><div id="carte" role="region" aria-label="Carte des lieux repères du quartier Notre-Dame"></div><ul class="lieux" data-render="lieux"></ul></div>
<p><small>Les périmètres exacts du quartier restent à préciser par l’association.</small></p>
</div></section>`,
  wave: "#f6f0e2",
}));

/* ---------- Nos actions ---------- */
out("actions.html", page({
  file: "actions.html", title: "Nos actions",
  desc: "Les actions des Habitants du Quartier Notre-Dame Viosne à Pontoise : cadre de vie, dialogue avec la Ville, fêtes, solidarité et projets en cours.",
  h1: "Nos actions", lead: "Ce que nous faisons, ce que nous défendons, ce que nous préparons.",
  img: "img/eglise-clocher.jpg",
  body: `<section><div class="wrap">
<p class="note rev">Les cartes en pointillés sont des <strong>textes d’attente</strong> : l’association pourra les remplacer par ses actions réelles en modifiant simplement le fichier <code>data/actions.json</code>.</p>
<div class="filtres" role="group" aria-label="Filtrer par thème" data-render="actions-filtres" style="margin-top:1.6rem"></div>
<div class="grid g2" data-render="actions">${noscript}</div>
<div class="card rev" style="margin-top:2.5rem"><h3>Vous avez une idée ou un coup de main à proposer ?</h3><p>Un projet pour le quartier, une envie d’animation, quelques heures à donner : parlons-en.</p><a class="btn btn-terre" href="contact.html">Proposer mon aide</a></div>
</div></section>`,
}));

/* ---------- Agenda ---------- */
out("agenda.html", page({
  file: "agenda.html", title: "Agenda & événements",
  desc: "Prochains rendez-vous, réunions et archives des Habitants du Quartier Notre-Dame Viosne à Pontoise.",
  h1: "Agenda & événements", lead: "Réunions, rencontres, animations : retrouvez les dates à retenir.",
  img: "img/place-notre-dame.jpg",
  body: `<section><div class="wrap">
<div class="sec-head rev"><p class="kicker">À venir</p><h2>Prochains rendez-vous</h2></div>
<div class="grid" data-render="events-up">${noscript}</div>
<div class="card rev" style="margin-top:1.6rem"><h3>Réunions de l’association</h3><p data-render="reunions">Rythme et lieu des réunions : à compléter par l’association.</p></div>
</div></section>
<section class="alt"><div class="wrap">
<div class="sec-head rev"><p class="kicker">Archives</p><h2>Ce qui s’est passé</h2><p>Rendez-vous documentés publiquement concernant le quartier.</p></div>
<div class="grid g2" data-render="events-past"></div>
</div></section>`,
}));

/* ---------- Galerie ---------- */
out("galerie.html", page({
  file: "galerie.html", title: "Galerie",
  desc: "Photos du quartier Notre-Dame de Pontoise : église, place, Viosne et lavoirs. Les photos des fêtes et des habitants viendront de l’association.",
  h1: "Galerie photos", lead: "Le quartier en images, classé par thème.",
  img: "img/lavoir-viosne.jpg",
  body: `<section><div class="wrap">
<p class="note rev">Photos du quartier sous licence libre (Wikimedia Commons), créditées sous chaque image. Aucune photo d’habitant n’est publiée sans origine publique claire : les photos des fêtes et de la vie du quartier seront ajoutées avec l’accord des personnes.</p>
<div class="filtres" role="group" aria-label="Filtrer par thème" data-render="gallery-filtres" style="margin-top:1.6rem"></div>
<div class="mosaic" data-render="gallery">${noscript}</div>
</div></section>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button class="close" type="button" aria-label="Fermer">×</button><img src="" alt=""><p></p><div class="nav-l"><button class="prev" type="button">← Précédente</button><button class="next" type="button">Suivante →</button></div></div>`,
}));

/* ---------- Actualités ---------- */
out("actualites.html", page({
  file: "actualites.html", title: "Actualités",
  desc: "Les dernières nouvelles du quartier Notre-Dame à Pontoise : presse locale, comptes rendus de la Ville et informations de l’association.",
  h1: "Actualités", lead: "Presse locale, comptes rendus de la Ville, informations de l’association.",
  img: "img/hero-eglise-notre-dame.jpg",
  body: `<section><div class="wrap">
<p class="note rev">Cette page présente, de façon neutre, ce qui a été publié publiquement sur le quartier. Les actualités propres à l’association s’ajouteront dans <code>data/news.json</code>.</p>
<div class="grid g2" data-render="news" style="margin-top:1.6rem">${noscript}</div>
</div></section>`,
}));

/* ---------- Infos utiles ---------- */
out("infos-utiles.html", page({
  file: "infos-utiles.html", title: "Infos utiles",
  desc: "Liens utiles pour les habitants de Pontoise : Ville, Cergy-Pontoise Agglo, signalements, propreté, urbanisme et démarches.",
  h1: "Infos utiles", lead: "Ville, agglomération, signalements et démarches : les bons liens.",
  img: "img/place-notre-dame.jpg",
  body: `<section><div class="wrap"><div data-render="links">${noscript}</div></div></section>`,
}));

/* ---------- Contact ---------- */
const c = site.contact;
out("contact.html", page({
  file: "contact.html", title: "Nous rejoindre & contact",
  desc: "Rejoindre les Habitants du Quartier Notre-Dame Viosne à Pontoise : adhésion, bénévolat et formulaire de contact.",
  h1: "Nous rejoindre", lead: "Adhérer, donner un coup de main ou simplement poser une question.",
  img: "img/eglise-clocher.jpg",
  body: `<section><div class="wrap">
<div class="grid g3" style="margin-bottom:3rem">
<div class="card rev"><div class="ico">${svg("coeur")}</div><h3>Adhérer</h3><p>Modalités d’adhésion et montant de la cotisation : <strong>texte d’attente</strong>, à compléter par l’association.</p></div>
<div class="card rev"><div class="ico">${svg("fete")}</div><h3>Devenir bénévole</h3><p>Aider à une animation, à une réunion, à la vie du quartier : <strong>texte d’attente</strong>, à compléter.</p></div>
<div class="card rev"><div class="ico">${svg("maison")}</div><h3>Habitants du quartier</h3><p>Vous habitez le quartier Notre-Dame ? Écrivez-nous pour signaler un sujet ou être informé(e) des prochaines réunions.</p></div>
</div>
<div class="split" style="align-items:start">
<div class="rev"><h2>Écrivez-nous</h2>
<form id="form-contact" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<input type="hidden" name="subject" value="Nouveau message depuis le site – %{formName}">
<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="field"><label for="nom">Votre nom</label><input id="nom" name="nom" type="text" required autocomplete="name"></div>
<div class="field"><label for="email">Votre adresse e-mail</label><input id="email" name="email" type="email" required autocomplete="email"></div>
<div class="field"><label for="tel">Téléphone (facultatif)</label><input id="tel" name="telephone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="sujet">Votre demande</label><select id="sujet" name="sujet"><option>Adhérer à l’association</option><option>Devenir bénévole</option><option>Poser une question</option><option>Signaler un sujet dans le quartier</option><option>Autre</option></select></div>
<div class="field"><label for="message">Votre message</label><textarea id="message" name="message" required></textarea></div>
<div class="field check"><input id="rgpd" name="consentement" type="checkbox" required><label for="rgpd" style="margin:0;font-weight:400">J’accepte que l’association utilise ces informations pour me répondre. Elles ne sont pas transmises à des tiers (voir les <a href="mentions-legales.html">mentions légales</a>).</label></div>
<p id="form-msg" class="note" hidden role="alert"></p>
<button class="btn btn-terre" type="submit">Envoyer mon message</button>
</form></div>
<div class="rev card"><h2 style="font-size:1.6rem">Coordonnées</h2>
<ul class="coords" style="list-style:none;padding:0;margin:0">
<li><strong>E-mail :</strong><br><a href="mailto:${c.email}">${c.email}</a></li>
<li><strong>Téléphone :</strong><br><a href="tel:${c.telephone_lien}">${c.telephone}</a></li>
<li><strong>Adresse postale :</strong><br>À compléter</li>
<li><strong>Où nous trouver :</strong><br>Quartier Notre-Dame, Pontoise (Val-d’Oise).<br><a href="https://www.openstreetmap.org/?mlat=49.04941&mlon=2.09236#map=16/49.04941/2.09236" target="_blank" rel="noopener">Voir le quartier sur la carte</a> · <a href="quartier.html#carte">carte des lieux repères</a></li>
<li><strong>Réseaux sociaux :</strong><br>Pas de page publique de l’association identifiée pour l’instant.</li></ul>
<p><small>${c.source}.</small></p></div>
</div></div></section>`,
}));

/* ---------- Merci ---------- */
out("merci.html", page({
  file: "merci.html", title: "Message envoyé",
  desc: "Votre message a bien été envoyé aux Habitants du Quartier Notre-Dame Viosne.",
  h1: "Merci !", lead: "Votre message a bien été envoyé. Nous vous répondrons dès que possible.",
  img: "img/hero-eglise-notre-dame.jpg",
  body: `<section><div class="wrap"><div class="btn-row"><a class="btn btn-vert" href="index.html">Retour à l’accueil</a><a class="btn btn-contour" href="quartier.html">Découvrir le quartier</a></div></div></section>`,
}));

/* ---------- Mentions légales ---------- */
out("mentions-legales.html", page({
  file: "mentions-legales.html", title: "Mentions légales",
  desc: "Mentions légales du site des Habitants du Quartier Notre-Dame Viosne à Pontoise : éditeur, hébergeur, données personnelles, crédits.",
  h1: "Mentions légales", lead: "Éditeur, hébergement, données personnelles et crédits.",
  img: "img/place-notre-dame.jpg",
  body: `<section><div class="wrap" style="max-width:820px">
<p class="note">Ce site est une <strong>maquette de démonstration</strong> réalisée par AssoVisible à partir d’informations publiques. Il n’a pas encore été validé par l’association. Les mentions marquées « à compléter » doivent l’être par elle.</p>
<h2>Éditeur</h2><p>Association Habitants du Quartier Notre-Dame Viosne, Pontoise (Val-d’Oise).<br>Statut : association (loi du 1er juillet 1901) — <em>à confirmer</em>.<br>Numéro RNA / SIRET : à compléter.<br>Directeur·rice de la publication : à compléter.<br>Contact : <a href="mailto:${c.email}">${c.email}</a> · <a href="tel:${c.telephone_lien}">${c.telephone}</a></p>
<h2>Conception</h2><p>Maquette conçue par AssoVisible, agence de sites pour associations.</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2><p>Le formulaire de contact recueille votre nom, votre adresse e-mail, votre message et, si vous le souhaitez, votre téléphone, uniquement pour répondre à votre demande. Les messages sont reçus via le service Netlify Forms. Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à l’adresse ci-dessus. Le site n’utilise pas de cookies de suivi publicitaire.</p>
<h2>Services tiers</h2><p>Polices de caractères Google Fonts, bibliothèque cartographique Leaflet et fonds de carte © contributeurs d’OpenStreetMap, chargés depuis leurs serveurs lors de la consultation.</p>
<h2>Crédits photographiques</h2><ul>
<li>Église Notre-Dame (chevet, place) : GFreihalter, <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.fr" target="_blank" rel="noopener">CC BY-SA 3.0</a>, via <a href="https://commons.wikimedia.org/wiki/File:Pontoise_%C3%89glise_Notre-Dame_004.jpg" target="_blank" rel="noopener">Wikimedia Commons</a>.</li>
<li>Église Notre-Dame (clocher) et lavoir de la Viosne : P.poschadel, <a href="https://creativecommons.org/licenses/by-sa/2.0/fr/deed.fr" target="_blank" rel="noopener">CC BY-SA 2.0 fr</a>, via Wikimedia Commons.</li></ul>
<h2>Sources des informations</h2><p>Fiche de l’association sur ville-pontoise.fr, comptes rendus de tours de quartier de la Ville de Pontoise, Actu.fr, 95.telif.tv, Wikipédia, Cergy-Pontoise Agglo. Les liens sont indiqués à côté de chaque information.</p>
<h2>Propriété intellectuelle</h2><p>Le nom et les contenus de l’association restent sa propriété. Les photos sous licence libre sont réutilisables selon les conditions de leur licence.</p>
</div></section>`,
}));

writeFileSync(join(root, "img", "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="14" fill="#2c5a45"/><path d="M10 24l7-8 7 8v9H10zM26 20l6-6 6 6v13H26z" fill="#f6f0e2"/><rect x="14" y="27" width="4" height="6" fill="#a9472c"/><rect x="30" y="25" width="4" height="8" fill="#a9472c"/><path d="M6 38c4-3 6 3 10 0s6 3 10 0 6 3 10 0 4 2 6 0" fill="none" stroke="#7cc3dc" stroke-width="3" stroke-linecap="round"/></svg>`);

// Formulaire Netlify « statique » : permet la détection du formulaire au déploiement.
console.log("pages générées");
