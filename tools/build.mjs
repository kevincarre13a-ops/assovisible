// Génère les pages HTML du site (en-tête/pied communs). Usage: node tools/build.mjs
import { writeFileSync } from "node:fs";
const NAV = [
  ["index.html","Accueil"],["dojang.html","Le dojang"],["cours.html","Cours & créneaux"],["grades.html","Grades"],
  ["competitions.html","Compétitions"],["stages.html","Stages & événements"],["galerie.html","Galerie"],
  ["actualites.html","Actualités"],["contact.html","Nous rejoindre"]];
const GEM = `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,4 90,34 50,96 10,34" fill="#d4af37"/><polygon points="50,4 70,34 50,96 30,34" fill="#f6dd8b"/><polygon points="10,34 90,34 70,34 30,34" fill="#fff" opacity=".4"/><path d="M10 34h80" stroke="#0a0a0f" stroke-width="2"/></svg>`;
const HERO_GEM = `<svg class="hero-gem" viewBox="0 0 200 200" aria-hidden="true"><g stroke="#0a0a0f" stroke-width="1.5" stroke-linejoin="round"><polygon class="f" points="45,50 75,20 125,20 155,50" fill="#f6dd8b"/><polygon class="f" points="45,50 75,20 100,50" fill="#fff3c1"/><polygon class="f" points="125,20 155,50 100,50" fill="#e0bd4a"/><polygon class="f" points="45,50 100,50 100,185" fill="#c9a32f"/><polygon class="f" points="155,50 100,50 100,185" fill="#a8841f"/><polygon class="f" points="45,50 20,50 100,185" fill="#d4af37"/><polygon class="f" points="155,50 180,50 100,185" fill="#8f6f17"/></g></svg>`;
const header = (cur) => `<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap"><a class="brand" href="index.html" aria-label="Keumgang Dojang – accueil">${GEM}<span class="brand-name">Keumgang <b>Dojang</b></span></a>
<button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span></button>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>${NAV.map(([h,l],i)=>`<li><a href="${h}"${h===cur?' aria-current="page"':''}${i===NAV.length-1?' class="cta"':''}>${l}</a></li>`).join("")}</ul></nav></div></header>`;
const footer = `<footer class="site-footer" data-render="footer"><div class="wrap"><p>Keumgang Dojang · Matoury, Guyane · <a href="mailto:taekwondo_guyane@yahoo.fr">taekwondo_guyane@yahoo.fr</a> · <a href="mentions-legales.html">Mentions légales</a></p></div></footer>`;
const cta = `<section class="cta-band"><div class="wrap rv"><h2>Venez essayer le taekwondo</h2><p style="margin:10px 0 24px">Un cours d'essai, un sourire, un dobok : on s'occupe du reste.</p><a class="btn btn-gold" href="contact.html">Réserver un cours d'essai</a></div></section>`;
const head = (cur,title,desc) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} – Keumgang Dojang, taekwondo en Guyane</title><meta name="description" content="${desc}"><meta name="theme-color" content="#0a0a0f"><meta property="og:title" content="${title} – Keumgang Dojang"><meta property="og:description" content="${desc}"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="css/style.css"></head><body>${header(cur)}<main id="main">`;
const tail = `</main>${footer}<script src="js/main.js" defer></script></body></html>`;
const ph = (t,d) => `<section class="page-head"><div class="wrap"><p class="eyebrow" style="color:#d4af37">Keumgang Dojang</p><h1>${t}</h1><p>${d}</p></div></section>`;
const sec = (inner,cls="") => `<section class="${cls}"><div class="wrap">${inner}</div></section>`;
const P = {};

P["index.html"] = [ "Accueil","Keumgang Dojang, club de taekwondo à Matoury en Guyane : cours pour enfants, ados et adultes. Venez essayer !",
`<section class="hero"><canvas id="sparkle" aria-hidden="true"></canvas>${HERO_GEM}<span class="hangul" aria-hidden="true">금강</span>
<div class="wrap"><p class="eyebrow" style="color:#d4af37">Taekwondo · Matoury · Guyane</p><h1>Keumgang<br><span>Dojang</span></h1><p>Le diamant se forge à l'entraînement.</p><div class="actions"><a class="btn btn-red" href="contact.html">Essayer un cours</a><a class="btn btn-ghost" href="cours.html">Voir les cours</a></div></div></section>
<div class="belts"></div>`+
sec(`<div class="cols"><div class="rv"><p class="eyebrow">Prochain rendez-vous</p><h2>Passage de grade</h2></div><div class="card rv" data-render="next"></div></div>`)+
sec(`<div class="sec-head rv"><p class="eyebrow">Découvrir</p><h2>Le dojang en un coup d'œil</h2></div><div class="grid">
<a class="card rv" href="dojang.html"><h3>Le dojang</h3><p>Notre histoire, nos valeurs, notre maître.</p></a>
<a class="card rv" href="cours.html"><h3>Cours & créneaux</h3><p>Baby, enfants, ados, adultes.</p></a>
<a class="card rv" href="grades.html"><h3>Grades</h3><p>Du blanc au noir, pas à pas.</p></a>
<a class="card rv" href="competitions.html"><h3>Compétitions</h3><p>Calendrier et résultats.</p></a>
<a class="card rv" href="stages.html"><h3>Stages & événements</h3><p>Les rendez-vous du dojang.</p></a>
<a class="card rv" href="galerie.html"><h3>Galerie</h3><p>Photos et vidéos.</p></a></div>`,"")
.replace('<section class="">','<section class="dark">')+
sec(`<div class="stats" data-render="counters"></div>`,"blue")+
sec(`<div class="sec-head rv"><p class="eyebrow">À la une</p><h2>Dernières actualités</h2></div><div class="grid" data-render="news" data-limit="3"></div><p style="margin-top:24px"><a class="btn btn-red" href="actualites.html">Toutes les actualités</a></p>`)+cta];

P["dojang.html"] = ["Le dojang","Histoire, valeurs, maître et bureau du Keumgang Dojang, club de taekwondo de Matoury en Guyane.",
ph("Le dojang","Keumgang signifie « diamant » ; dojang, « la salle où l'on étudie la Voie ».")+
sec(`<div class="cols"><div class="rv"><p class="eyebrow">Présentation</p><h2>Un diamant à Matoury</h2><p class="lead">Le Keumgang Dojang est une association loi 1901 déclarée en Guyane en 1987, dédiée à l'enseignement, la pratique et la promotion du taekwondo et des disciplines associées.</p></div><div class="rv card"><h3>Histoire</h3><p>Déclarée en préfecture le 15 juillet 1987, l'association est basée à Matoury. Plus de trente-neuf ans d'existence : le récit détaillé du club (fondateurs, grandes étapes, anecdotes) est à compléter.</p></div></div>`)+
sec(`<div class="sec-head rv"><p class="eyebrow">L'esprit</p><h2>Les cinq valeurs du taekwondo</h2></div><div class="values">
<div class="value rv"><h3>Courtoisie</h3><p>Le respect de l'autre, sur le tatami comme en dehors.</p></div>
<div class="value rv"><h3>Intégrité</h3><p>Être honnête avec soi-même et avec les autres.</p></div>
<div class="value rv"><h3>Persévérance</h3><p>Tomber, se relever, recommencer.</p></div>
<div class="value rv"><h3>Maîtrise de soi</h3><p>Garder le contrôle de sa force et de ses émotions.</p></div>
<div class="value rv"><h3>Esprit indomptable</h3><p>Ne jamais renoncer face à l'adversité.</p></div></div>`,"dark")
.replace('class="values"','class="values" style="color:var(--ink)"')+
sec(`<div class="sec-head rv"><p class="eyebrow">Encadrement</p><h2>Maître et encadrants</h2></div><div data-render="team" class="rv"></div>`)+
sec(`<div class="sec-head rv"><p class="eyebrow">Association</p><h2>Le bureau</h2></div><div class="grid" data-render="board"></div><p class="pending" style="margin-top:20px">Composition du bureau à compléter par le club.</p>`)+cta];

P["cours.html"] = ["Cours & créneaux","Disciplines, publics, horaires, tarifs et équipement : tout savoir sur les cours de taekwondo du Keumgang Dojang à Matoury.",
ph("Cours & créneaux","Baby, enfants, ados, adultes : trouvez votre cours.")+
sec(`<div class="sec-head rv"><p class="eyebrow">Ce qu'on pratique</p><h2>Disciplines</h2></div><div class="grid" data-render="disciplines"></div>`)+
sec(`<div class="sec-head rv"><p class="eyebrow">Pour qui</p><h2>Les publics</h2></div><div class="grid" data-render="publics"></div>`,"dark")+
sec(`<div class="sec-head rv"><p class="eyebrow">Planning</p><h2>Jours, horaires & salles</h2></div><div data-render="slots"></div>`)+
sec(`<div class="cols"><div><div class="sec-head"><p class="eyebrow">Adhésion</p><h2>Tarifs & inscription</h2></div><div data-render="tarifs"></div></div><div class="card"><h3>Équipement nécessaire</h3><ul class="list" data-render="equip"></ul></div></div>`)+cta];

P["grades.html"] = ["Grades & progression","Système des ceintures du blanc au noir, passages de grade et conseils de préparation au Keumgang Dojang.",
ph("Grades & progression","Chaque ceinture est une étape, pas une destination.")+
sec(`<div class="sec-head rv"><p class="eyebrow">Progression</p><h2>Des ceintures du blanc au noir</h2></div><div class="frieze" data-render="belts"></div>`)+
sec(`<div class="sec-head rv"><p class="eyebrow">Calendrier</p><h2>Passages de grade</h2></div><div data-render="passages"></div>`,"dark")+
sec(`<div class="cols"><div class="rv"><p class="eyebrow">Conseils</p><h2>Comment se préparer</h2></div><div class="card"><ul class="list" data-render="prepare"></ul></div></div>`)+cta];

P["competitions.html"] = ["Compétitions & résultats","Calendrier des compétitions, résultats et palmarès du Keumgang Dojang, taekwondo Guyane.",
ph("Compétitions & résultats","Le combat et les poomsé, dans l'esprit du fair-play.")+sec(`<div data-render="comp"></div>`)+cta];

P["stages.html"] = ["Stages & événements","Prochains stages, démonstrations et événements du Keumgang Dojang, avec les archives.",
ph("Stages & événements","Stages, démonstrations, rencontres : les rendez-vous du dojang.")+sec(`<div data-render="events"></div>`)+cta];

P["galerie.html"] = ["Galerie","Photos et vidéos du Keumgang Dojang : cours, passages de grade, compétitions et événements.",
ph("Galerie","Le dojang en images, classées par cours, compétition ou événement.")+sec(`<div data-render="gallery"></div>`)+cta];

P["actualites.html"] = ["Actualités","Les dernières nouvelles du Keumgang Dojang, club de taekwondo de Matoury en Guyane.",
ph("Actualités","Les dernières nouvelles du dojang.")+sec(`<div class="grid" data-render="news"></div>`)+cta];

P["contact.html"] = ["Nous rejoindre & contact","Cours d'essai, inscription et contact du Keumgang Dojang à Matoury, Guyane : écrivez-nous.",
ph("Nous rejoindre","Réservez un cours d'essai : on vous accueille avec plaisir.")+
sec(`<div class="cols" style="align-items:start"><div><h2>Écrivez-nous</h2>
<form id="contact-form" name="contact" method="POST" action="contact.html?envoye=1" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Ne pas remplir <input name="bot-field"></label></p>
<div><label for="nom">Nom</label><input id="nom" name="nom" required autocomplete="name"></div>
<div><label for="email">E-mail</label><input id="email" name="email" type="email" required autocomplete="email"></div>
<div><label for="sujet">Je souhaite</label><select id="sujet" name="sujet"><option>Un cours d'essai</option><option>M'inscrire</option><option>Une information</option></select></div>
<div><label for="message">Message</label><textarea id="message" name="message" rows="5" required></textarea></div>
<button class="btn btn-red" type="submit">Envoyer</button></form></div>
<div><h2>Coordonnées</h2><div data-render="contact"></div><p class="pending">Modalités d'essai et d'inscription à compléter par le club.</p></div></div>`)+
sec(`<h2 style="margin-bottom:20px">Plan</h2><iframe class="map" title="Carte de Matoury" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-52.37%2C4.82%2C-52.28%2C4.88&amp;layer=mapnik"></iframe><p class="pending" style="margin-top:14px">Plan indicatif de Matoury : emplacement exact de la salle à confirmer.</p>`)];

P["mentions-legales.html"] = ["Mentions légales","Mentions légales du site du Keumgang Dojang, association de taekwondo de Matoury (Guyane).",
ph("Mentions légales","Informations légales et données personnelles.")+
sec(`<div class="legal"><h2>Éditeur</h2><p>Keumgang Dojang, association loi 1901 déclarée le 15/07/1987 (JO du 12/08/1987), n° RNA W9C1002478. Siège : 7 impasse des Aciotis, Résidence Pako, 97351 Matoury. E-mail : taekwondo_guyane@yahoo.fr.</p><h2>Directeur de la publication</h2><p>À compléter par le club.</p><h2>Conception</h2><p>Maquette réalisée par AssoVisible.</p><h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, San Francisco, CA 94107, États-Unis.</p><h2>Données personnelles</h2><p>Les informations saisies dans le formulaire de contact servent uniquement à répondre à votre demande. Vous pouvez demander leur suppression en écrivant à taekwondo_guyane@yahoo.fr.</p><h2>Images</h2><p>Aucune photo de personne n'est publiée sans autorisation (et celle des parents pour les mineurs).</p></div>`)];

for (const [f,[t,d,body]] of Object.entries(P)) writeFileSync(`site/${f}`, head(f,t,d)+body+tail);
writeFileSync("site/favicon.svg", GEM.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '));
writeFileSync("site/404.html", head("","Page introuvable","Page introuvable.")+ph("Page introuvable","Retournez à l'accueil.")+tail);
writeFileSync("site/netlify.toml", `[build]\n  publish = "."\n\n[[headers]]\n  for = "/data/*"\n  [headers.values]\n    Cache-Control = "public, max-age=300"\n`);
