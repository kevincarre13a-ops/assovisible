// Génère les pages HTML de public/ avec l'en-tête et le pied de page communs.
// Usage : node src/build.mjs   (les contenus se modifient dans public/data/*.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const site = JSON.parse(readFileSync(join(root, 'data', 'site.json'), 'utf8'));

const NAV = [
  ['index.html', 'Accueil'],
  ['association.html', 'L’association'],
  ['jeux.html', 'Nos jeux'],
  ['evenements.html', 'Animations & événements'],
  ['galerie.html', 'Galerie'],
  ['actualites.html', 'Actualités'],
  ['contact.html', 'Nous rejoindre'],
];

const logo = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#F6C945" stroke="#4A2F1A" stroke-width="3"/><rect x="11" y="13" width="14" height="14" rx="3" fill="#C93D22" transform="rotate(-12 18 20)"/><circle cx="18" cy="20" r="1.8" fill="#fff"/><circle cx="35" cy="17" r="7" fill="#2A78B5"/><ellipse cx="29" cy="35" rx="11" ry="5" fill="#5E9E4A"/><ellipse cx="29" cy="32" rx="11" ry="5" fill="#8cc774"/></svg>`;

const floaters = (extra = '') => `<div class="floaters" aria-hidden="true">
<svg class="fl f1" viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="40" ry="14" fill="#8a5a2b"/><ellipse cx="50" cy="56" rx="40" ry="14" fill="#E4572E"/><ellipse cx="50" cy="56" rx="26" ry="8" fill="#F6C945"/></svg>
<svg class="fl f2" viewBox="0 0 100 100"><rect x="14" y="14" width="72" height="72" rx="16" fill="#fff" stroke="#4A2F1A" stroke-width="4"/><g fill="#C93D22"><circle cx="34" cy="34" r="7"/><circle cx="66" cy="34" r="7"/><circle cx="50" cy="50" r="7"/><circle cx="34" cy="66" r="7"/><circle cx="66" cy="66" r="7"/></g></svg>
<svg class="fl f3" viewBox="0 0 100 100"><path d="M50 8c12 0 16 12 10 22 12 6 16 20 16 34H24c0-14 4-28 16-34-6-10-2-22 10-22z" fill="#5E9E4A"/><rect x="18" y="68" width="64" height="18" rx="9" fill="#35702C"/></svg>
<svg class="fl f4" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#2A78B5"/><circle cx="50" cy="50" r="24" fill="#5aa4d8"/></svg>
<svg class="fl f5" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="12" fill="#E9B44C" stroke="#4A2F1A" stroke-width="4" transform="rotate(18 50 50)"/><g fill="#4A2F1A" transform="rotate(18 50 50)"><circle cx="38" cy="38" r="6"/><circle cx="62" cy="62" r="6"/></g></svg>${extra}</div>`;

const wave = `<svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30c120 30 240 30 360 10s240-30 360-10 240 30 360 10 240-30 360-10v30H0z" fill="#FFF6E3"/></svg>`;

const socials = Object.entries(site.social).filter(([, v]) => v);
const labels = { facebook: 'Facebook', instagram: 'Instagram', helloasso: 'HelloAsso' };

function layout({ file, title, desc, body, hero = true, extraHead = '' }) {
  const nav = NAV.map(([f, l]) => `<li><a href="${f}"${f === file ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  const foot = NAV.map(([f, l]) => `<li><a href="${f}">${l}</a></li>`).join('');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta name="theme-color" content="#A8672F">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">${extraHead}
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap nav">
<a class="brand" href="index.html" aria-label="Jeux de Tout Bois, accueil">${logo}<span>Jeux de <b>Tout Bois</b></span></a>
<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span><span></span><span></span></button>
<ul class="menu" id="menu">${nav}</ul>
</div></header>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="wrap">
<div class="fgrid">
<div><h3>Jeux de Tout Bois</h3><p>Association de prêt de jeux en bois géants et d’animations à Igny (Essonne).</p></div>
<div><h3>Nous trouver</h3><ul><li>${site.address}<br>${site.postalCode} ${site.city}</li><li><a href="mailto:${site.email}">${site.email}</a></li>${socials.map(([k, v]) => `<li><a href="${v}" rel="noopener" target="_blank">${labels[k] || k}</a></li>`).join('')}</ul></div>
<div><h3>Le site</h3><ul>${foot}<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
</div>
<p class="copy">© ${new Date().getFullYear()} Jeux de Tout Bois · Association loi 1901 · SIREN ${site.siren}</p>
</div></footer>
<div class="lightbox" id="lb" role="dialog" aria-label="Photo agrandie"><button type="button" aria-label="Fermer">×</button><img alt=""></div>
<script src="js/main.js" defer></script>
</body>
</html>
`;
}

const pageHero = (h1, p) => `<section class="page-hero">${floaters()}<div class="wrap"><span class="eyebrow">Jeux de Tout Bois</span><h1>${h1}</h1><p>${p}</p></div>${wave}</section>`;

const pages = [];

pages.push({
  file: 'index.html',
  title: 'Jeux de Tout Bois — Jeux en bois géants à Igny (91)',
  desc: 'Association de prêt de jeux en bois géants et d’animations à Igny, en Essonne. Venez jouer, emprunter, rejoindre l’équipe !',
  body: `<section class="hero has-photo-slot">${floaters()}
<div class="wrap"><span class="eyebrow">Association · Igny (91)</span>
<h1>Jeux de <em>Tout Bois</em></h1>
<p>${site.tagline}</p>
<div class="cta"><a class="btn" href="jeux.html">Découvrir les jeux</a><a class="btn light" href="contact.html#adhesion">Venir jouer avec nous</a></div></div>${wave}</section>

<section><div class="wrap"><div class="next rv" data-render="next"></div></div></section>

<section class="band"><div class="wrap">
<div class="center"><span class="eyebrow">Ce qu’on fait</span><h2>Jouer, ça se partage</h2><p class="lead">Des jeux d’adresse, de stratégie et d’équilibre en bois, assez grands pour jouer ensemble, dehors comme dedans.</p></div>
<div class="grid" style="margin-top:30px">
<a class="card link rv" href="jeux.html"><div class="ico">🎲</div><h3>Nos jeux</h3><p>Un catalogue de jeux en bois géants à emprunter.</p></a>
<a class="card link rv" href="evenements.html"><div class="ico">🎪</div><h3>Animations</h3><p>Fêtes, écoles, mairies, particuliers : on installe, on explique, on joue.</p></a>
<a class="card link rv" href="galerie.html"><div class="ico">📸</div><h3>Galerie</h3><p>Les parties en images.</p></a>
<a class="card link rv" href="contact.html"><div class="ico">🤝</div><h3>Nous rejoindre</h3><p>Adhérer, donner un coup de main, demander un prêt.</p></a>
</div></div></section>

<section class="stripe"><div class="wrap center"><span class="eyebrow">En chiffres</span><h2>Une asso qui a du jeu</h2><div class="stats" data-render="stats" style="margin-top:26px"></div></div></section>

<section><div class="wrap"><div class="center"><span class="eyebrow">À l’honneur</span><h2>Quelques-uns de nos jeux</h2><p class="lead">Survolez une carte (ou touchez-la) pour la retourner.</p></div>
<div class="grid" data-render="games" data-limit="3" style="margin-top:30px"></div>
<p class="center" style="margin-top:28px"><a class="btn green" href="jeux.html">Voir tout le catalogue</a></p></div></section>

<section class="band"><div class="wrap"><h2>Dernières actualités</h2><div class="list" data-render="news" data-limit="3"></div>
<p style="margin-top:22px"><a href="actualites.html">Toutes les actualités →</a></p></div></section>

<section class="band-wood"><div class="wrap center"><h2>Envie de venir jouer ?</h2><p class="lead" style="color:#fff">Que vous veniez pour une partie, pour emprunter un jeu ou pour donner un coup de main : il y a toujours une place autour du plateau.</p>
<a class="btn" href="contact.html">Contactez-nous</a></div></section>`,
});

pages.push({
  file: 'association.html',
  title: 'L’association — Jeux de Tout Bois, Igny',
  desc: 'Découvrez l’association Jeux de Tout Bois à Igny : nos valeurs, notre histoire et notre équipe.',
  body: `${pageHero('L’association', 'Des passionnés de jeux en bois, à Igny, pour faire jouer petits et grands.')}
<section><div class="wrap prose"><span class="eyebrow">Qui sommes-nous</span><h2>Jeux de Tout Bois</h2>
<p>Jeux de Tout Bois est une association loi 1901 basée à Igny, en Essonne. Elle prête des jeux en bois géants et propose des animations pour que chacun puisse jouer ensemble, dans la bonne humeur.</p>
<p class="todo">✏️ Texte de présentation à compléter par l’association (création, projet, public accueilli…).</p>
<h2>Notre histoire</h2><p class="todo">✏️ L’histoire de l’association (année de création, premières parties, anecdotes) reste à écrire.</p></div></section>
<section class="band"><div class="wrap"><div class="center"><span class="eyebrow">Nos valeurs</span><h2>Ce qui nous anime</h2></div>
<div class="val" style="margin-top:26px">
<div class="card rv"><div class="ico">🌳</div><h3>Le bois, simplement</h3><p>Des jeux robustes, naturels et agréables à manipuler.</p></div>
<div class="card rv"><div class="ico">👨‍👩‍👧‍👦</div><h3>Tous âges</h3><p>Enfants, parents, grands-parents : on joue à égalité.</p></div>
<div class="card rv"><div class="ico">🤝</div><h3>Convivialité</h3><p>Le plaisir de se retrouver, loin des écrans.</p></div>
<div class="card rv"><div class="ico">🔁</div><h3>Partage</h3><p>Prêter plutôt qu’acheter : les jeux circulent.</p></div></div></div></section>
<section><div class="wrap"><div class="center"><span class="eyebrow">Le bureau</span><h2>L’équipe</h2></div><div class="grid" data-render="team" style="margin-top:26px"></div></div></section>
<section class="band-wood"><div class="wrap center"><h2>Envie de nous aider ?</h2><a class="btn" href="contact.html#benevole">Devenir bénévole</a></div></section>`,
});

pages.push({
  file: 'jeux.html',
  title: 'Nos jeux en bois géants — Jeux de Tout Bois',
  desc: 'Le catalogue des jeux en bois de l’association Jeux de Tout Bois à Igny : nombre de joueurs, âge, description.',
  body: `${pageHero('Nos jeux', 'Retournez les cartes pour découvrir chaque jeu : joueurs, âge, règle en un coup d’œil.')}
<section><div class="wrap"><p class="todo">✏️ Les jeux affichés sont des exemples. L’association peut les remplacer dans le fichier <code>data/games.json</code> (nom, joueurs, âge, description, photo).</p>
<div class="grid" data-render="games" style="margin-top:26px"></div>
<p class="center" style="margin-top:34px"><a class="btn" href="contact.html#pret">Demander un prêt de jeux</a></p></div></section>`,
});

pages.push({
  file: 'evenements.html',
  title: 'Animations & événements — Jeux de Tout Bois',
  desc: 'Prochains rendez-vous et archives de Jeux de Tout Bois, animations pour fêtes, écoles, mairies et particuliers à Igny et alentours.',
  body: `${pageHero('Animations & événements', 'Venez jouer avec nous, ou invitez-nous chez vous.')}
<section><div class="wrap"><h2>Prochains rendez-vous</h2><div class="list" data-render="events"></div></div></section>
<section class="band"><div class="wrap"><div class="center"><span class="eyebrow">On vient chez vous</span><h2>Nos animations</h2></div>
<div class="grid" style="margin-top:26px">
<div class="card rv"><div class="ico">🎉</div><h3>Fêtes &amp; kermesses</h3><p>Des jeux géants pour animer votre événement.</p></div>
<div class="card rv"><div class="ico">🏫</div><h3>Écoles</h3><p>Un après-midi jeux pour la classe ou la fête de l’école.</p></div>
<div class="card rv"><div class="ico">🏛️</div><h3>Mairies &amp; associations</h3><p>Fêtes de quartier, marchés, rencontres entre voisins.</p></div>
<div class="card rv"><div class="ico">🎂</div><h3>Particuliers</h3><p>Anniversaires, mariages, repas de famille.</p></div></div>
<p class="todo" style="margin-top:22px">✏️ Conditions et tarifs d’intervention à compléter. En attendant : <a href="contact.html#animation">demandez un devis ou un renseignement</a>.</p></div></section>
<section><div class="wrap"><h2>Archives</h2><div class="list" data-render="archives"></div></div></section>`,
});

pages.push({
  file: 'galerie.html',
  title: 'Galerie photos — Jeux de Tout Bois',
  desc: 'Les photos des jeux, des animations et des événements de l’association Jeux de Tout Bois.',
  body: `${pageHero('Galerie', 'Des parties, des rires, des palets qui volent.')}
<section><div class="wrap"><p class="todo">✏️ Photos à ajouter : déposez-les dans <code>images/</code> et listez-les dans <code>data/gallery.json</code>.</p><div data-render="gallery" style="margin-top:22px"></div></div></section>`,
});

pages.push({
  file: 'actualites.html',
  title: 'Actualités — Jeux de Tout Bois',
  desc: 'Les dernières nouvelles de l’association Jeux de Tout Bois à Igny.',
  body: `${pageHero('Actualités', 'Les dernières nouvelles de l’association.')}
<section><div class="wrap"><div class="list" data-render="news" data-full="1"></div></div></section>`,
});

pages.push({
  file: 'contact.html',
  title: 'Nous rejoindre & contact — Jeux de Tout Bois',
  desc: 'Adhérer à Jeux de Tout Bois, devenir bénévole, demander un prêt de jeux ou une animation à Igny. Formulaire de contact et coordonnées.',
  body: `${pageHero('Nous rejoindre', 'Adhérer, aider, emprunter, inviter : écrivez-nous !')}
<section><div class="wrap">
<div class="grid">
<div class="card rv" id="adhesion"><div class="ico">🪪</div><h3>Adhésion</h3><p>Rejoignez l’association pour jouer et participer à la vie du projet.</p><p class="todo">✏️ Montant et modalités à compléter.</p></div>
<div class="card rv" id="benevole"><div class="ico">🙌</div><h3>Bénévolat</h3><p>Installer, expliquer les règles, fabriquer, ranger : chaque coup de main compte.</p></div>
<div class="card rv" id="pret"><div class="ico">📦</div><h3>Prêt de jeux</h3><p>Empruntez des jeux en bois géants pour vos événements à Igny et alentours.</p><p class="todo">✏️ Conditions et tarifs à compléter.</p></div>
<div class="card rv" id="animation"><div class="ico">🎪</div><h3>Demande d’animation</h3><p>Fête d’école, de quartier, anniversaire : parlons de votre projet.</p></div>
</div></div></section>
<section class="band"><div class="wrap two wide-l">
<div><h2>Écrivez-nous</h2>
<form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hidden"><label>Ne pas remplir <input name="bot-field"></label></p>
<div class="f"><label for="nom">Votre nom</label><input id="nom" name="nom" required autocomplete="name"></div>
<div class="f"><label for="email">Votre e-mail</label><input id="email" type="email" name="email" required autocomplete="email"></div>
<div class="f"><label for="sujet">Sujet</label><select id="sujet" name="sujet"><option>Renseignement</option><option>Adhésion</option><option>Bénévolat</option><option>Prêt de jeux</option><option>Demande d’animation</option></select></div>
<div class="f"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
<button class="btn" type="submit">Envoyer</button>
</form></div>
<div><h2>Coordonnées</h2>
<div class="card"><p><strong>Jeux de Tout Bois</strong><br>${site.address}<br>${site.postalCode} ${site.city}</p><p>✉️ <a href="mailto:${site.email}">${site.email}</a></p></div>
<div class="map" style="margin-top:20px"><iframe title="Carte d’Igny" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${site.map.lon - 0.012}%2C${site.map.lat - 0.007}%2C${site.map.lon + 0.012}%2C${site.map.lat + 0.007}&amp;layer=mapnik&amp;marker=${site.map.lat}%2C${site.map.lon}"></iframe></div>
<p class="hint">Localisation approximative : Igny (91430).</p></div>
</div></section>`,
});

pages.push({
  file: 'merci.html',
  title: 'Merci — Jeux de Tout Bois',
  desc: 'Votre message a bien été envoyé à l’association Jeux de Tout Bois.',
  extraHead: '\n<meta name="robots" content="noindex">',
  body: `${pageHero('Merci !', 'Votre message est bien parti. Nous vous répondons vite.')}
<section><div class="wrap center"><a class="btn" href="index.html">Retour à l’accueil</a></div></section>`,
});

pages.push({
  file: 'mentions-legales.html',
  title: 'Mentions légales — Jeux de Tout Bois',
  desc: 'Mentions légales du site de l’association Jeux de Tout Bois, Igny.',
  body: `${pageHero('Mentions légales', 'Informations légales sur l’association et ce site.')}
<section><div class="wrap prose">
<h2>Éditeur du site</h2><p>Association Jeux de Tout Bois (loi 1901)<br>${site.address}, ${site.postalCode} ${site.city}<br>SIREN : ${site.siren}<br>E-mail : <a href="mailto:${site.email}">${site.email}</a></p>
<h2>Directeur de la publication</h2><p>${site.president}, président.</p>
<h2>Hébergement</h2><p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2><p>Les informations saisies dans le formulaire de contact servent uniquement à répondre à votre demande. Vous pouvez demander leur suppression à tout moment en écrivant à <a href="mailto:${site.email}">${site.email}</a>.</p>
<h2>Propriété intellectuelle</h2><p>Les textes, illustrations et photos du site appartiennent à l’association ou à leurs auteurs. Toute reproduction sans accord est interdite.</p>
</div></section>`,
});

for (const p of pages) writeFileSync(join(root, p.file), layout(p));
console.log(`${pages.length} pages générées`);
