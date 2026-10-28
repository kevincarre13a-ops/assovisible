// Génère les pages HTML du site à partir d'un en-tête / pied de page communs.
import { writeFileSync } from 'node:fs';
const OUT = new URL('../site/', import.meta.url).pathname;
const ORIGIN = 'https://societe-histoire-kingersheim-maquette.netlify.app';
const nav = [
  ['index.html', 'Accueil'], ['la-societe.html', 'La société'], ['histoire-de-kingersheim.html', 'Histoire'],
  ['publications.html', 'Publications'], ['conferences-expositions-sorties.html', 'Rendez-vous'],
  ['galerie.html', 'Galerie'], ['actualites.html', 'Actualités'], ['nous-rejoindre.html', 'Nous rejoindre', 'cta'],
];
const header = f => `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header"><div class="wrap">
  <a class="brand" href="index.html" aria-label="Société d'Histoire de Kingersheim, accueil"><img src="assets/img/shk/logo-histoire-blanc.png" alt="" width="105" height="69"><span>Société d'Histoire<small>de Kingersheim</small></span></a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  <nav class="nav" id="nav" aria-label="Navigation principale"><ul>
${nav.map(([h, l, c]) => `    <li${c ? ` class="${c}"` : ''}><a href="${h}"${h === f ? ' aria-current="page"' : ''}>${l}</a></li>`).join('\n')}
  </ul></nav>
</div></header>`;
const footer = `<footer class="site-footer"><div class="wrap">
  <div class="foot-grid">
    <div class="foot-brand"><img src="assets/img/shk/logo-histoire-blanc.png" alt="Logo de la Société d'Histoire de Kingersheim" width="96" height="63">
      <p><strong style="color:#fff">Société d'Histoire et d'Archéologie de Kingersheim</strong><br>Garder en mémoire le souvenir du passé de nos ancêtres.</p></div>
    <div><h2>Coordonnées</h2><address style="font-style:normal">Jean-Claude Louis, président<br>3A rue de Lyon<br>68260 Kingersheim<br>
      <a href="tel:+33636602469">06 36 60 24 69</a><br><a href="mailto:histoire-kingersheim@hotmail.com">histoire-kingersheim@hotmail.com</a></address></div>
    <div><h2>Le site</h2><ul>
      <li><a href="index.html">Accueil</a></li><li><a href="la-societe.html">La société</a></li><li><a href="histoire-de-kingersheim.html">Histoire de Kingersheim</a></li>
      <li><a href="publications.html">Publications</a></li><li><a href="conferences-expositions-sorties.html">Rendez-vous</a></li><li><a href="galerie.html">Galerie</a></li>
      <li><a href="actualites.html">Actualités</a></li><li><a href="nous-rejoindre.html">Nous rejoindre &amp; contact</a></li></ul></div>
    <div><h2>Sur le web</h2><ul>
      <li><a href="https://societe-histoire-kingersheim.com/" rel="noopener">Site actuel de la société</a></li>
      <li><a href="https://www.ville-kingersheim.fr/" rel="noopener">Ville de Kingersheim</a></li>
      <li><a href="https://chr.grandest.fr/acteurs/societe-dhistoire-et-darcheologie-de-kingersheim/" rel="noopener">Comité d'histoire régionale Grand Est</a></li>
      <li class="note" style="color:#d9c3ba">Aucune page de réseau social officielle n'a été trouvée.</li></ul></div>
  </div>
  <div class="legal"><span>© ${new Date().getFullYear()} Société d'Histoire de Kingersheim</span>
    <span><a href="mentions-legales.html">Mentions légales</a> · Maquette réalisée par <a href="https://assovisible.fr" rel="noopener">AssoVisible</a></span></div>
</div></footer>`;

const page = ({ file, title, desc, body, hero, pageKey, pos, img }) => `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#4d1424">
<link rel="canonical" href="${ORIGIN}/${file === 'index.html' ? '' : file}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR">
<meta property="og:image" content="${ORIGIN}/assets/img/shk/societe-dhistoire-de-kingersheim.jpg">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="${pageKey || ''}" class="${hero ? 'has-hero' : 'no-hero'}">
${header(file)}
<main id="contenu">
${body}
</main>
${footer}
<script src="assets/js/main.js" defer></script>
</body></html>`;

const phero = (crumb, h1, lead, pos = 'center') => `<section class="page-hero" style="--pos:${pos}"><div class="wrap">
  <p class="crumbs"><a href="index.html">Accueil</a> › ${crumb}</p><h1>${h1}</h1><p class="lead">${lead}</p></div></section>`;

const pages = [];

/* ---------- ACCUEIL ---------- */
pages.push({ file: 'index.html', hero: true, pageKey: 'home',
  title: "Société d'Histoire de Kingersheim | Huit siècles d'histoire locale",
  desc: "Société d'Histoire et d'Archéologie de Kingersheim (Haut-Rhin) : bulletins, livres, expositions et mémoire locale depuis 1195. Venez découvrir et rejoindre la société.",
  body: `<section class="hero"><div class="hero-bg" role="img" aria-label="Dessin ancien d'une rue de Kingersheim avec l'église et des maisons à colombages"></div>
  <div class="wrap"><span class="eyebrow">Kingersheim · Haut-Rhin</span>
    <h1>Huit siècles d'histoire, <em>rue après rue</em></h1>
    <p class="lead">Depuis sa première mention en 1195, Kingersheim a beaucoup changé. La Société d'Histoire garde la trace de ces visages et de ces lieux. Venez la découvrir.</p>
    <div class="row"><a class="btn light" href="histoire-de-kingersheim.html">Explorer l'histoire</a><a class="btn outline-light" href="nous-rejoindre.html">Rejoindre la société</a></div></div>
  <span class="scroll-cue" aria-hidden="true">Défiler ↓</span></section>
<div id="next-event"></div>

<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Découvrir</span><h2>Une société d'histoire vivante</h2>
  <p class="lead">Expositions, bulletins, ateliers de mémoire, sorties : on y partage ce que Kingersheim a de plus précieux, ses souvenirs.</p></div>
  <div class="grid g3">
    <a class="tile reveal" style="--img:url(/assets/img/shk/hero-kingersheim.jpg)" href="histoire-de-kingersheim.html"><div><h3>Histoire de Kingersheim</h3><p>Frise chronologique, lieux et personnages.</p></div></a>
    <a class="tile reveal" style="--img:url(/assets/img/shk/bulletin-3.jpg)" href="publications.html"><div><h3>Publications</h3><p>Bulletins et livres à commander.</p></div></a>
    <a class="tile reveal" style="--img:url(/assets/img/shk/IMG_1662-scaled-e1752219767627.jpg)" href="conferences-expositions-sorties.html"><div><h3>Expositions &amp; sorties</h3><p>Les rendez-vous de la société.</p></div></a>
  </div>
  <div class="row" style="margin-top:22px"><a class="btn ghost" href="la-societe.html">Qui sommes-nous ?</a><a class="btn ghost" href="galerie.html">Voir la galerie</a><a class="btn ghost" href="actualites.html">Les actualités</a></div>
</div></section>

<section class="section dark"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">En chiffres</span><h2>Une mémoire qui se transmet</h2></div>
  <div class="counters">
    <div class="counter reveal"><b data-count="0" data-years-since="1195">0</b><span>ans depuis la première mention de Kingersheim (1195)</span></div>
    <div class="counter reveal"><b data-count="11">0</b><span>publications : 6 bulletins et 5 ouvrages</span></div>
    <div class="counter reveal"><b data-count="0" data-years-since="1995">0</b><span>ans depuis le premier bulletin (1995)</span></div>
    <div class="counter reveal"><b data-count="13354">0</b><span>habitants en 2023</span></div>
  </div>
  <p class="note" style="color:#e8d3cb;text-align:center;margin-top:24px">Sources : m2A, société d'histoire, Wikipédia. Nombre de membres : à compléter par la société.</p>
</div></section>

<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">À la une</span><h2>Dernières actualités</h2></div>
  <div class="grid g3" id="home-news"></div>
  <p style="margin-top:22px"><a class="btn ghost" href="actualites.html">Toutes les actualités</a></p>
  <noscript><p class="placeholder">Activez JavaScript pour afficher les actualités.</p></noscript>
</div></section>

<section class="section alt"><div class="wrap" style="display:grid;gap:28px;align-items:center">
  <div class="reveal" style="max-width:720px"><span class="eyebrow">Rejoignez-nous</span><h2>Votre grenier garde peut-être un morceau d'histoire</h2>
  <p class="lead">Photos de famille, cartes postales, vieux papiers, souvenirs : la société les accueille, les numérise et les fait vivre. Adhérer, c'est aussi venir aux expositions et aux sorties.</p>
  <div class="row"><a class="btn" href="nous-rejoindre.html">Adhérer ou donner des documents</a><a class="btn ghost" href="nous-rejoindre.html#contact">Nous écrire</a></div></div>
</div></section>` });

/* ---------- LA SOCIÉTÉ ---------- */
pages.push({ file: 'la-societe.html', pageKey: 'societe',
  title: "La société | Société d'Histoire de Kingersheim", desc: "Présentation de la Société d'Histoire et d'Archéologie de Kingersheim : missions, valeurs, histoire de l'association et membres du bureau.",
  body: `${phero('La société', "Une société d'histoire et d'archéologie", "Faire connaître, conserver et transmettre le patrimoine de Kingersheim.", 'left')}
<section class="section"><div class="wrap" style="display:grid;gap:36px">
  <div class="reveal" style="max-width:780px"><span class="eyebrow">Présentation</span><h2>Garder en mémoire le souvenir du passé de nos ancêtres</h2>
  <p>La Société d'Histoire et d'Archéologie de Kingersheim mène des actions de mémoire pour conserver le patrimoine de la commune et lui apporter le rayonnement nécessaire. Elle marque les événements locaux ou nationaux par des expositions, en partenariat avec les services de la mairie : mines de potasse, usine textile, écoles, les deux conflits du XXe siècle et les combats pour la libération de Kingersheim.</p>
  <p class="note">Sources : site de la société ; annuaire des associations de la ville de Kingersheim.</p></div>
</div></section>
<section class="section alt"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Missions</span><h2>Ce que fait la société</h2></div>
  <div class="grid g3">
    <article class="card reveal"><h3>Diffuser</h3><p>Partager entre ses membres les connaissances en histoire, topographie, archéologie et généalogie.</p></article>
    <article class="card reveal"><h3>Publier</h3><p>Éditer des documents historiques et géographiques sur Kingersheim, dont le bulletin historique « S'Kingerscherblättla ».</p></article>
    <article class="card reveal"><h3>Collectionner</h3><p>Acquérir ou rassembler archives, cartes postales, timbres, enveloppes oblitérées, objets et produits archéologiques liés à la commune.</p></article>
    <article class="card reveal"><h3>Fouiller &amp; chercher</h3><p>Participer à des fouilles archéologiques sur le ban de Kingersheim et à des recherches généalogiques.</p></article>
    <article class="card reveal"><h3>Exposer</h3><p>Présenter des expositions à la Maison de la Citoyenneté et animer la vie de la commune (fête des rues, journées du patrimoine).</p></article>
    <article class="card reveal"><h3>Sortir &amp; visiter</h3><p>Organiser des sorties, des visites et des ateliers de mémoire avec les habitants.</p></article>
  </div>
  <p class="note" style="margin-top:14px">Sources : site de la société ; annuaire des associations ; Comité d'histoire régionale Grand Est (la société est affiliée à la Fédération des Sociétés d'Histoire et d'Archéologie d'Alsace).</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Notre histoire</span><h2>L'histoire de l'association</h2></div>
  <div class="grid g2"><div class="reveal"><p>Le premier numéro du bulletin historique paraît en <strong>1995</strong>. Six numéros se succèdent jusqu'en 2010, puis la société développe ses expositions, ses ateliers de mémoire et ses ouvrages.</p>
  <p class="placeholder">Date de fondation, circonstances de la création et grandes étapes à fournir par la société.</p></div>
  <div class="card reveal"><h3>Valeurs</h3><ul style="margin:0;padding-left:1.2rem"><li>Transmettre la mémoire locale à tous les âges</li><li>Rigueur : citer ses sources</li><li>Partager : chacun peut apporter un souvenir</li></ul>
  <p class="placeholder" style="margin-top:12px">Valeurs à valider avec la société.</p></div></div>
</div></section>
<section class="section alt"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Bureau et équipe</span><h2>Ceux qui font vivre la société</h2></div>
  <div class="grid g3" id="bureau"></div>
  <p class="note" style="margin-top:14px">Source : site de la société (comité). Photos des membres : à fournir avec leur accord.</p>
</div></section>` });

/* ---------- HISTOIRE ---------- */
pages.push({ file: 'histoire-de-kingersheim.html', pageKey: 'histoire',
  title: "Histoire de Kingersheim | Société d'Histoire de Kingersheim", desc: "Frise chronologique, grandes périodes, lieux et personnages marquants de Kingersheim, avec leurs sources, et comparaison entre vue ancienne et vue actuelle.",
  body: `${phero('Histoire de Kingersheim', "Huit siècles à parcourir", "De « Kemingsen » en 1195 à la ville d'aujourd'hui : chaque fait est accompagné de sa source.", '70% center')}
<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Frise chronologique</span><h2>Parcourez les dates clés</h2><p class="lead">Touchez une date, ou utilisez les flèches du clavier.</p></div>
  <div class="tl reveal"><div class="tl-rail" id="tl-rail" role="tablist" aria-label="Dates clés"></div>
    <div class="tl-panel" id="tl-panel" role="tabpanel" aria-live="polite"></div>
    <div class="tl-nav"><button class="btn ghost" id="tl-prev" type="button">← Précédent</button><button class="btn ghost" id="tl-next" type="button">Suivant →</button></div></div>
  <noscript><p class="placeholder">La frise nécessite JavaScript. Les mêmes informations figurent dans la section « Grandes périodes ».</p></noscript>
</div></section>
<section class="section alt"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Hier et aujourd'hui</span><h2>Glissez pour comparer</h2></div>
  <figure class="reveal" style="margin:0"><div class="compare" role="group" aria-label="Comparaison entre un dessin ancien et une vue actuelle de Kingersheim">
    <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Kingersheim_-_place_de_la_Libert%C3%A9.jpg?width=1400" alt="Vue actuelle de la place de la Liberté à Kingersheim" loading="lazy">
    <img class="old" src="assets/img/shk/hero-kingersheim.jpg" alt="Dessin ancien d'une rue de Kingersheim avec l'église et des maisons à colombages">
    <span class="tag l">Autrefois</span><span class="tag r">Aujourd'hui</span><div class="handle"></div>
    <input type="range" min="0" max="100" value="50" aria-label="Déplacer le curseur entre la vue ancienne et la vue actuelle"><span class="focus-ring"></span></div>
  <figcaption>À gauche : dessin d'archive (Société d'Histoire de Kingersheim). À droite : place de la Liberté, photo Yzergues, 2023, Wikimedia Commons, CC BY-SA 4.0.</figcaption></figure>
  <p class="placeholder" style="margin-top:14px">Maquette de démonstration : les deux vues ne montrent pas le même endroit. La société peut fournir de vraies paires « avant / après » (carte postale ancienne et photo actuelle du même lieu) pour les remplacer.</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Grandes périodes</span><h2>Quatre temps forts</h2></div><div class="grid g2" id="periodes"></div>
</div></section>
<section class="section alt"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Lieux marquants</span><h2>Là où l'histoire s'est écrite</h2></div><div class="grid g3" id="lieux"></div>
</div></section>
<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Personnages</span><h2>Des noms à retenir</h2></div><div class="grid g4" id="personnages"></div>
  <p class="placeholder" style="margin-top:20px">D'autres personnages et lieux seront ajoutés avec les textes de la société (mines de potasse, usine textile, écoles...).</p>
</div></section>` });

/* ---------- PUBLICATIONS ---------- */
pages.push({ file: 'publications.html', pageKey: 'publications',
  title: "Publications | Société d'Histoire de Kingersheim", desc: "Bulletins historiques (1995-2010) et ouvrages de la Société d'Histoire de Kingersheim : couvertures, tarifs et moyen de les obtenir.",
  body: `${phero('Publications', "Bulletins et livres", "Six bulletins historiques et cinq ouvrages sur Kingersheim, à demander directement à la société.", 'right')}
<section class="section"><div class="wrap">
  <div class="card reveal" style="margin-bottom:28px;border-left:6px solid var(--burgundy)"><h2 style="font-size:1.4rem">Comment se les procurer ?</h2>
  <p style="margin:0">Sur demande par courriel à <a href="mailto:histoire-kingersheim@hotmail.com">histoire-kingersheim@hotmail.com</a> ou par téléphone au <a href="tel:+33389539359">03 89 53 93 59</a>. Aucun paiement n'est géré sur ce site. Toutes les archives de la société sont disponibles sur demande.</p></div>
  <div class="filters" role="group" aria-label="Filtrer les publications"><button type="button" data-f="all" aria-pressed="true">Tout</button><button type="button" data-f="bulletin" aria-pressed="false">Bulletins</button><button type="button" data-f="ouvrage" aria-pressed="false">Ouvrages</button></div>
  <div class="grid g2" id="pubs"></div>
  <noscript><p class="placeholder">Activez JavaScript pour afficher le catalogue.</p></noscript>
  <p class="note" style="margin-top:20px">Sources : site de la société (tarifs relevés, à confirmer) ; catalogue du CID DRAC Grand Est pour « Le Dollerbaechlein ». Les résumés manquants sont à fournir par la société.</p>
</div></section>` });

/* ---------- RENDEZ-VOUS ---------- */
pages.push({ file: 'conferences-expositions-sorties.html', pageKey: 'rendezvous',
  title: "Conférences, expositions & sorties | Société d'Histoire de Kingersheim", desc: "Prochains rendez-vous de la Société d'Histoire de Kingersheim (permanences, réunions) et archives des expositions, conférences, ateliers et sorties.",
  body: `${phero('Conférences, expositions &amp; sorties', "Les rendez-vous de la société", "Permanences, expositions, ateliers de mémoire et sorties : voici ce qui se passe, et ce qui s'est passé.", '30% center')}
<section class="section"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">À venir</span><h2>Prochains rendez-vous</h2></div>
  <div class="list" id="upcoming"></div>
</div></section>
<section class="section alt"><div class="wrap">
  <div class="sec-head reveal"><span class="eyebrow">Archives</span><h2>Ils ont eu lieu</h2></div>
  <div class="filters" role="group" aria-label="Filtrer les archives"><button type="button" data-f="all" aria-pressed="true">Tout</button><button type="button" data-f="Exposition" aria-pressed="false">Expositions</button><button type="button" data-f="Conférence" aria-pressed="false">Conférences</button><button type="button" data-f="Visite" aria-pressed="false">Visites</button><button type="button" data-f="Sortie" aria-pressed="false">Sorties</button></div>
  <div class="list" id="archives"></div>
  <p class="note" style="margin-top:20px">Sources : site de la société, Comité d'histoire régionale Grand Est, Kingersheim Magazine. Les actions autour des Journées européennes du patrimoine seront ajoutées avec la société.</p>
</div></section>` });

/* ---------- GALERIE ---------- */
pages.push({ file: 'galerie.html', pageKey: 'galerie',
  title: "Galerie | Société d'Histoire de Kingersheim", desc: "Dessins d'archives, expositions, publications et vues actuelles de Kingersheim, avec visionneuse plein écran et crédits.",
  body: `${phero('Galerie', "Images de Kingersheim", "Archives, expositions, couvertures et vues d'aujourd'hui : chaque image est créditée.", 'center 30%')}
<section class="section"><div class="wrap">
  <div class="filters" role="group" aria-label="Filtrer par thème"><button type="button" data-f="all" aria-pressed="true">Tout</button><button type="button" data-f="archives" aria-pressed="false">Archives</button><button type="button" data-f="expositions" aria-pressed="false">Expositions</button><button type="button" data-f="publications" aria-pressed="false">Publications</button><button type="button" data-f="aujourdhui" aria-pressed="false">Aujourd'hui</button></div>
  <div class="gallery" id="gallery"></div>
  <p class="placeholder">Cartes postales et photos anciennes : à fournir par la société, avec leur statut de droits. Rien n'est publié sans source.</p>
  <dialog class="lightbox" id="lightbox" aria-label="Visionneuse d'image"><div class="lb"><div class="lb-img"><img id="lb-img" alt="">
    <button class="lb-btn lb-close" id="lb-close" type="button" aria-label="Fermer">✕</button><button class="lb-btn lb-prev" id="lb-prev" type="button" aria-label="Image précédente">‹</button><button class="lb-btn lb-next" id="lb-next" type="button" aria-label="Image suivante">›</button></div>
    <div class="lb-cap" id="lb-cap"></div></div></dialog>
</div></section>` });

/* ---------- ACTUALITÉS ---------- */
pages.push({ file: 'actualites.html', pageKey: 'actualites',
  title: "Actualités | Société d'Histoire de Kingersheim", desc: "Les dernières nouvelles de la Société d'Histoire de Kingersheim : expositions, ateliers, visites et participations aux événements de la commune.",
  body: `${phero('Actualités', "Les dernières nouvelles", "Ce que fait la société, du plus récent au plus ancien.", 'center 70%')}
<section class="section"><div class="wrap" style="max-width:860px"><div class="list" id="news"></div></div></section>` });

/* ---------- REJOINDRE / CONTACT ---------- */
pages.push({ file: 'nous-rejoindre.html', pageKey: 'rejoindre',
  title: "Nous rejoindre & contact | Société d'Histoire de Kingersheim", desc: "Adhérer à la Société d'Histoire de Kingersheim, venir aux permanences, donner des documents anciens ou nous écrire.",
  body: `${phero('Nous rejoindre', "Rejoignez la société", "Adhérer, apporter un souvenir, poser une question : il y a mille façons de participer.", 'center')}
<section class="section"><div class="wrap"><div class="grid g3">
  <article class="card reveal"><h2 style="font-size:1.5rem">Adhérer</h2><p>Devenir membre, c'est soutenir la mémoire locale et participer aux expositions, sorties et recherches.</p><p class="placeholder">Montant de la cotisation et modalités d'adhésion à fournir par la société.</p><a class="btn" href="#contact">Demander l'adhésion</a></article>
  <article class="card reveal"><h2 style="font-size:1.5rem">Nous rencontrer</h2><p>Permanence : <strong>les lundis de 9 h à 11 h</strong>, à la Maison de la Citoyenneté, pendant l'exposition en cours (à confirmer auprès de la société).</p><p>Réunion mensuelle : le premier lundi du mois à 17 h, selon l'annuaire de la ville.</p></article>
  <article class="card reveal"><h2 style="font-size:1.5rem">Témoigner &amp; donner</h2><p>Vous avez des photos, cartes postales, courriers ou objets anciens ? Racontez-nous : la société les copie, les identifie et les conserve. Un souvenir, même modeste, éclaire l'histoire de Kingersheim.</p><a class="btn ghost" href="?objet=Don%20ou%20pr%C3%AAt%20de%20documents%20anciens#contact">Proposer des documents</a></article>
</div></div></section>
<section class="section alt" id="contact"><div class="wrap grid g2" style="align-items:start">
  <div class="reveal"><span class="eyebrow">Contact</span><h2>Écrivez-nous</h2>
  <form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact">
    <p class="hidden"><label>Ne pas remplir : <input name="bot-field"></label></p>
    <div class="field"><label for="nom">Votre nom</label><input id="nom" name="nom" autocomplete="name" required></div>
    <div class="field"><label for="email">Votre courriel</label><input id="email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="objet">Votre demande</label><select id="objet" name="objet"><option>Adhésion</option><option>Don ou prêt de documents anciens</option><option>Commande d'une publication</option><option>Recherche généalogique ou historique</option><option>Autre</option></select></div>
    <div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
    <button class="btn" type="submit">Envoyer le message</button>
    <p class="note" style="margin-top:12px">Les données saisies servent uniquement à vous répondre. Voir les <a href="mentions-legales.html">mentions légales</a>.</p>
  </form></div>
  <div class="reveal"><span class="eyebrow">Coordonnées</span><h2>Où nous trouver</h2>
  <p><strong>Société d'Histoire et d'Archéologie de Kingersheim</strong><br>Jean-Claude Louis<br>3A rue de Lyon, 68260 Kingersheim<br>Téléphone : <a href="tel:+33636602469">06 36 60 24 69</a><br>Commande de publications : <a href="tel:+33389539359">03 89 53 93 59</a><br>Courriel : <a href="mailto:histoire-kingersheim@hotmail.com">histoire-kingersheim@hotmail.com</a></p>
  <iframe class="map" title="Carte : Maison de la Citoyenneté, Kingersheim" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=7.3290%2C47.7865%2C7.3400%2C47.7925&amp;layer=mapnik&amp;marker=47.7894426%2C7.3343462"></iframe>
  <p class="note">Les expositions ont lieu à la Maison de la Citoyenneté. <a href="https://www.openstreetmap.org/?mlat=47.7894426&amp;mlon=7.3343462#map=17/47.7894/7.3343" rel="noopener">Agrandir le plan</a></p></div>
</div></section>` });

/* ---------- MENTIONS LÉGALES ---------- */
pages.push({ file: 'mentions-legales.html', pageKey: 'legal',
  title: "Mentions légales | Société d'Histoire de Kingersheim", desc: "Mentions légales, hébergement, données personnelles et crédits photographiques du site de la Société d'Histoire de Kingersheim.",
  body: `${phero('Mentions légales', "Mentions légales", "Éditeur, hébergement, données personnelles et crédits.", 'center')}
<section class="section"><div class="wrap" style="max-width:820px">
  <h2>Éditeur</h2><p>Société d'Histoire et d'Archéologie de Kingersheim, 3A rue de Lyon, 68260 Kingersheim. Président : Jean-Claude Louis. Téléphone : 06 36 60 24 69. Courriel : histoire-kingersheim@hotmail.com.</p>
  <p class="placeholder">Statut juridique (association de droit local d'Alsace-Moselle, inscrite au registre des associations du tribunal judiciaire) et numéro d'inscription : à confirmer par la société.</p>
  <h2>Conception</h2><p>Maquette réalisée à titre gracieux par AssoVisible, sans valeur contractuelle. Contenus repris de sources publiques citées dans le site ; ils restent à valider par la société.</p>
  <h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
  <h2>Données personnelles</h2><p>Le formulaire de contact recueille votre nom, votre courriel et votre message pour répondre à votre demande. Ces données sont transmises à la société via le service Netlify Forms et ne sont ni vendues ni utilisées à d'autres fins. Vous pouvez demander leur suppression à tout moment en écrivant à la société. Le site n'utilise pas de cookie de suivi. Le plan intégré est fourni par OpenStreetMap et les polices par Google Fonts.</p>
  <h2>Crédits et droits</h2><ul>
  <li>Logo, dessin d'archive, couvertures et photo de l'exposition « Les Monnaies » : Société d'Histoire de Kingersheim, reprises de son site actuel (droits à confirmer par la société).</li>
  <li>Photographies actuelles « place de la Liberté », « rue de Hirschau » et « faubourg de Mulhouse » : Yzergues, 2023, <a href="https://commons.wikimedia.org/wiki/Category:Kingersheim" rel="noopener">Wikimedia Commons</a>, licence <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" rel="noopener">CC BY-SA 4.0</a>.</li>
  <li>Textes historiques : m2A, Wikipédia, Ville de Kingersheim, France-Voyage, Comité d'histoire régionale Grand Est, catalogue du CID DRAC Grand Est, chacun cité à l'endroit utilisé.</li>
  <li>Pour toute demande de retrait ou de correction, contactez la société.</li></ul>
</div></section>` });

/* ---------- MERCI + 404 ---------- */
pages.push({ file: 'merci.html', pageKey: 'merci', title: "Message envoyé | Société d'Histoire de Kingersheim", desc: "Votre message a bien été transmis à la Société d'Histoire de Kingersheim.",
  body: `${phero('Message envoyé', "Merci !", "Votre message a bien été transmis. La société vous répondra dès que possible.")}
<section class="section"><div class="wrap"><a class="btn" href="index.html">Retour à l'accueil</a></div></section>` });
pages.push({ file: '404.html', pageKey: 'err', title: "Page introuvable | Société d'Histoire de Kingersheim", desc: "Cette page n'existe pas.",
  body: `${phero('Page introuvable', "Cette page s'est perdue dans les archives", "Le lien est peut-être ancien. Retournez à l'accueil ou utilisez le menu.")}
<section class="section"><div class="wrap"><a class="btn" href="index.html">Retour à l'accueil</a></div></section>` });

for (const p of pages) writeFileSync(OUT + p.file, page(p));
console.log(pages.length, 'pages');
