import { writeFileSync } from 'node:fs';
const OUT = new URL('../site/', import.meta.url).pathname;
const SITE = JSON.parse((await import('node:fs')).readFileSync(OUT + 'data/site.json', 'utf8'));
const NAV = [['index.html','Accueil'],['association.html',"L'association"],['action.html','Notre action'],['evenements.html','Événements'],['galerie.html','Galerie'],['actualites.html','Actualités'],['partenaires.html','Partenaires'],['contact.html','Contact']];
const todo = t => `<span class="todo">${t}</span>`;

const header = f => `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header"><div class="wrap">
  <a class="brand" href="index.html" aria-label="Les Amis d'Handimak, accueil"><img src="assets/logo.svg" alt="" width="46" height="46"><span>Les Amis d'Handimak<small>Rognac · Association loi 1901</small></span></a>
  <nav class="nav" aria-label="Navigation principale">
    <ul id="menu">${NAV.map(([h,l]) => `<li><a class="link" href="${h}"${h===f?' aria-current="page"':''}>${l}</a></li>`).join('')}</ul>
    <a class="btn btn-don btn-sm header-don" href="don.html"${f==='don.html'?' aria-current="page"':''}>♥ Faire un don</a>
    <button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span></button>
  </nav>
</div></header>`;

const footer = `<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div><a class="brand" href="index.html"><img src="assets/logo.svg" alt="" width="46" height="46"><span>Les Amis d'Handimak<small>Rognac · Association loi 1901</small></span></a>
      <p style="margin-top:14px">Des événements solidaires pour financer des équipements essentiels aux enfants en situation de handicap.</p>
      <a class="btn btn-don btn-sm" href="don.html">♥ Faire un don</a></div>
    <div><h2>Contact</h2><address style="font-style:normal">${SITE.adresse}<br><a href="mailto:${SITE.email}">${SITE.email}</a><br><span class="note" style="color:#B7CBE0">Téléphone : à compléter</span></address>
      <p><a href="${SITE.facebook}" rel="noopener" target="_blank">Facebook ↗</a></p></div>
    <div><h2>Le site</h2><ul>${NAV.map(([h,l])=>`<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="don.html">Faire un don</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© <span id="yr">2026</span> Les Amis d'Handimak — RNA ${SITE.rna}</span><a href="mentions-legales.html">Mentions légales &amp; confidentialité</a></div>
</div></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
<script src="js/main.js" defer></script>`;

const page = (file, title, desc, body, opts = {}) => {
  const head = opts.hero ? '' : '';
  const html = `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Les Amis d'Handimak, Rognac</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#1D6FB8">
<meta property="og:title" content="${title} — Les Amis d'Handimak"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"><meta property="og:locale" content="fr_FR">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
<link rel="stylesheet" href="css/style.css">
</head><body>
${header(file)}
<main id="contenu">
${body}
</main>
${footer}
</body></html>`;
  writeFileSync(OUT + file, html);
};
const pageHead = (eyebrow, h1, p) => `<div class="page-head"><div class="wrap"><div class="panel"><span class="eyebrow">${eyebrow}</span><h1>${h1}</h1><p>${p}</p></div></div></div>`;
const cta = `<section class="band-sun"><div class="wrap center reveal"><h2>Envie de donner un coup de pouce ?</h2><p class="lead">Un don, quelques heures de bénévolat ou un simple partage : chaque geste compte.</p><div class="actions" style="justify-content:center"><a class="btn btn-don" href="don.html">♥ Faire un don</a><a class="btn btn-ghost" href="contact.html">Devenir bénévole</a></div></div></section>`;

/* ---------- Accueil ---------- */
page('index.html', 'Accueil', "Les Amis d'Handimak, association de Rognac : des événements solidaires pour financer des équipements essentiels aux enfants en situation de handicap.", `
<section class="hero" style="padding-bottom:120px"><div class="wrap"><div class="panel">
  <span class="eyebrow">Association de Rognac · Depuis 2023</span>
  <h1>Ensemble, rendons <em>possible</em> ce qui change le quotidien d'un enfant.</h1>
  <p class="lead" style="color:var(--ink)">Les Amis d'Handimak organisent des événements solidaires pour aider des enfants en situation de handicap à financer des équipements coûteux et essentiels.</p>
  <div class="actions"><a class="btn btn-don" href="don.html">♥ Faire un don</a><a class="btn btn-sun" href="contact.html#benevolat">Devenir bénévole</a></div>
</div></div></section>

<section><div class="wrap"><div class="center reveal"><span class="eyebrow">Prochain rendez-vous</span><h2>Venez nous retrouver</h2></div>
  <div class="next reveal" id="next-event"><p>Chargement…</p></div></div></section>

<section class="band"><div class="wrap"><div class="center reveal"><span class="eyebrow">Notre action</span><h2>Un équipement, une autonomie, un sourire</h2><p class="lead">Fauteuils, aides techniques, matériel adapté : des équipements essentiels mais souvent très chers, que les aides ne couvrent pas toujours entièrement.</p></div>
  <div class="grid g3" style="margin-top:34px">
    <article class="card reveal"><div class="ico y" aria-hidden="true">🎪</div><h3>Des événements qui rassemblent</h3><p>Rencontres festives et solidaires pour collecter des fonds, ensemble.</p><a class="more" href="evenements.html">Voir les événements</a></article>
    <article class="card reveal"><div class="ico b" aria-hidden="true">♿</div><h3>Des équipements essentiels</h3><p>Financer le matériel qui facilite les déplacements, la communication et le quotidien.</p><a class="more" href="action.html">Comprendre notre action</a></article>
    <article class="card reveal"><div class="ico g" aria-hidden="true">🤝</div><h3>Une communauté engagée</h3><p>Bénévoles, commerçants, familles et habitants unis autour d'une même cause.</p><a class="more" href="contact.html">Nous rejoindre</a></article>
  </div></div></section>

<section id="stats-section" class="band-navy"><div class="wrap">
  <div class="center reveal"><span class="eyebrow" style="color:var(--sun)">En chiffres</span><h2>L'association en un coup d'œil</h2></div>
  <div class="grid g4" id="counters" style="margin:26px 0 34px"></div>
  <div class="progress reveal" id="progress-box" style="color:var(--ink)"></div>
</div></section>

<section><div class="wrap"><div class="center reveal"><span class="eyebrow">Actualités</span><h2>Les dernières nouvelles</h2></div>
  <div class="grid g2" id="news-list" data-limit="2" style="margin-top:30px"></div>
  <p class="center" style="margin-top:26px"><a class="btn btn-ghost" href="actualites.html">Toutes les actualités</a></p></div></section>

<section class="band"><div class="wrap"><div class="center reveal"><span class="eyebrow">Ils nous soutiennent</span><h2>Nos partenaires</h2></div>
  <div class="grid g3" id="partners-list" style="margin-top:28px"></div>
  <p class="center" style="margin-top:26px"><a class="btn btn-ghost" href="partenaires.html">Devenir partenaire</a></p></div></section>
${cta}`);

/* ---------- Association ---------- */
page('association.html', "L'association", "Histoire, valeurs, missions et équipe des Amis d'Handimak, association loi 1901 créée à Rognac le 5 janvier 2023.", `
${pageHead('Qui sommes-nous ?', "L'association", "Une association de Rognac née pour que les équipements essentiels ne soient plus un obstacle.")}
<section><div class="wrap split">
  <div class="reveal"><span class="eyebrow">Notre histoire</span><h2>Née à Rognac, en janvier 2023</h2>
    <p>Les Amis d'Handimak est une association loi 1901, déclarée le <strong>5 janvier 2023</strong> à Rognac (RNA ${SITE.rna}). Son objet : <strong>organiser des événements afin de faire bénéficier des enfants porteurs de handicap d'une aide financière</strong> pour acquérir du matériel coûteux mais nécessaire.</p>
    <p>${todo("Texte d'attente — à compléter par l'association : récit de la création, premières rencontres, personnes à l'origine du projet.")}</p></div>
  <div class="art reveal" aria-hidden="true">🌈</div>
</div></section>
<section class="band"><div class="wrap split">
  <div class="art reveal" aria-hidden="true" style="box-shadow:8px 8px 0 var(--sun)">✨</div>
  <div class="reveal"><span class="eyebrow">Le nom</span><h2>Pourquoi « Handimak » ?</h2>
    <p>${todo("Origine du nom à confirmer avec les fondateurs : aucune source publique ne l'explique à ce jour.")}</p>
    <p>Nous préférons attendre leur récit plutôt que d'inventer une explication.</p></div>
</div></section>
<section><div class="wrap"><div class="center reveal"><span class="eyebrow">Valeurs</span><h2>Ce qui nous guide</h2></div>
  <div class="grid g4" style="margin-top:30px">
    <div class="card reveal"><div class="ico y" aria-hidden="true">🤗</div><h3>Solidarité</h3><p>Agir ensemble, à hauteur d'enfant.</p></div>
    <div class="card reveal"><div class="ico b" aria-hidden="true">🕊️</div><h3>Respect</h3><p>De chaque enfant, de chaque famille, de leur intimité.</p></div>
    <div class="card reveal"><div class="ico c" aria-hidden="true">🔍</div><h3>Transparence</h3><p>Dire clairement d'où viennent les fonds et où ils vont.</p></div>
    <div class="card reveal"><div class="ico g" aria-hidden="true">🎉</div><h3>Convivialité</h3><p>Donner, c'est aussi se retrouver et s'amuser.</p></div>
  </div>
  <p class="note center" style="margin-top:16px">${todo("Valeurs proposées à valider par l'association.")}</p></div></section>
<section class="band"><div class="wrap"><div class="center reveal"><span class="eyebrow">Missions</span><h2>Ce que nous faisons</h2></div>
  <div class="grid g3" style="margin-top:30px">
    <div class="card reveal"><h3>Collecter</h3><p>Organiser des événements solidaires pour réunir des fonds.</p></div>
    <div class="card reveal"><h3>Financer</h3><p>Aider à l'achat d'équipements coûteux mais nécessaires à des enfants en situation de handicap.</p></div>
    <div class="card reveal"><h3>Sensibiliser</h3><p>Faire connaître la cause auprès des habitants, des commerçants et des entreprises.</p></div>
  </div></div></section>
<section><div class="wrap"><div class="center reveal"><span class="eyebrow">Équipe</span><h2>Bureau et bénévoles</h2></div>
  <div class="grid g3" style="margin-top:30px">
    ${['Présidence','Trésorerie','Secrétariat'].map(r=>`<div class="card wait reveal center"><div class="ico y" aria-hidden="true" style="margin-inline:auto">👤</div><h3>${r}</h3><p>${todo('Nom à renseigner (avec accord de la personne)')}</p></div>`).join('')}
  </div>
  <p class="center" style="margin-top:24px"><a class="btn btn-sun" href="contact.html#benevolat">Rejoindre l'équipe</a></p></div></section>
${cta}`);

/* ---------- Action ---------- */
page('action.html', 'Notre action', "Comment les Amis d'Handimak aident les enfants en situation de handicap : équipements financés, choix des projets, transparence sur les fonds.", `
${pageHead('Notre action', 'Aider concrètement, avec pudeur', "Des équipements qui ouvrent des portes : se déplacer, communiquer, apprendre, jouer.")}
<section><div class="wrap"><div class="center reveal"><span class="eyebrow">Comment ça marche</span><h2>De l'événement à l'équipement</h2></div>
  <div class="grid g4" style="margin-top:30px">
    <div class="card reveal"><div class="ico y" aria-hidden="true">1</div><h3>On organise</h3><p>Des événements solidaires rassemblent habitants, commerçants et bénévoles.</p></div>
    <div class="card reveal"><div class="ico b" aria-hidden="true">2</div><h3>On collecte</h3><p>Les dons et recettes alimentent l'aide aux familles.</p></div>
    <div class="card reveal"><div class="ico c" aria-hidden="true">3</div><h3>On étudie</h3><p>Chaque demande est examinée avec soin et confidentialité.</p></div>
    <div class="card reveal"><div class="ico g" aria-hidden="true">4</div><h3>On finance</h3><p>Une aide financière contribue à l'achat du matériel nécessaire.</p></div>
  </div>
  <p class="note center" style="margin-top:16px">${todo("Étapes décrites d'après l'objet de l'association — à valider avec elle.")}</p></div></section>
<section class="band"><div class="wrap split">
  <div class="reveal"><span class="eyebrow">Équipements</span><h2>Quels équipements financer ?</h2>
    <p>L'association aide à financer du <strong>matériel coûteux mais nécessaire</strong> aux enfants porteurs de handicap.</p>
    <p>${todo("Exemples d'équipements réellement financés à renseigner (types de matériel, sans nom ni photo d'enfant).")}</p></div>
  <div class="art reveal" aria-hidden="true">🦽</div></div></section>
<section><div class="wrap split">
  <div class="art reveal" aria-hidden="true" style="box-shadow:8px 8px 0 var(--green)">🧭</div>
  <div class="reveal"><span class="eyebrow">Choix des projets</span><h2>Comment les projets sont-ils choisis ?</h2>
    <ul class="check"><li>Besoin identifié avec la famille et les professionnels</li><li>Équipement justifié et chiffré</li><li>Décision collective du bureau</li><li>Confidentialité totale de la situation</li></ul>
    <p>${todo("Critères et processus à valider par l'association.")}</p></div></div></section>
<section class="band"><div class="wrap"><div class="center reveal"><span class="eyebrow">Transparence</span><h2>Où vont les fonds ?</h2></div>
  <div class="grid g2" style="margin-top:28px">
    <div class="card wait reveal"><h3>Utilisation des fonds</h3><p>${todo("Part reversée aux projets, frais de fonctionnement : à renseigner et valider.")}</p></div>
    <div class="card wait reveal"><h3>Comptes et bilans</h3><p>${todo("Publication du bilan annuel : à décider par l'association.")}</p></div>
  </div></div></section>
<section><div class="wrap"><div class="card reveal" style="border-color:var(--green);background:var(--green-soft)"><h3>🔒 Respect des familles</h3><p style="margin:0">Nous ne publions aucune photo, aucun prénom et aucune information médicale d'un enfant sans accord clair et explicite de sa famille. Les histoires sont racontées avec pudeur, jamais pour apitoyer.</p></div></div></section>
${cta}`);

/* ---------- Événements ---------- */
page('evenements.html', 'Événements', "Prochains événements de collecte des Amis d'Handimak à Rognac et archives des éditions passées.", `
${pageHead('Agenda', 'Nos événements', "Tournois, repas, lotos, marchés, concerts… des rendez-vous pour se retrouver et agir.")}
<section><div class="wrap"><h2 class="reveal">À venir</h2><div class="grid g2" id="events-upcoming" style="margin-top:22px"></div></div></section>
<section class="band"><div class="wrap"><h2 class="reveal">Les éditions passées</h2><div class="grid g2" id="events-archive" style="margin-top:22px"></div></div></section>
<section><div class="wrap center reveal"><h2>Un événement à proposer ?</h2><p class="lead">Commerçant, club, école, particulier : organisez une action au profit de l'association.</p><a class="btn btn-sun" href="contact.html">Nous écrire</a></div></section>`);

/* ---------- Galerie ---------- */
page('galerie.html', 'Galerie', "Photos des événements et de l'action des Amis d'Handimak, dans le respect de la vie privée des enfants.", `
${pageHead('En images', 'Galerie', "L'énergie de l'association : événements, bénévoles et matériel.")}
<section><div class="wrap"><div class="card reveal" style="background:var(--green-soft);border-color:var(--green)"><p style="margin:0">🔒 <strong>Protection des enfants :</strong> aucun portrait d'enfant n'est publié sans accord explicite de la famille. Nous montrons l'action : ambiance, bénévoles de dos, mains, matériel.</p></div>
  <div id="gallery-list" style="margin-top:20px"></div></div></section>`);

/* ---------- Actualités ---------- */
page('actualites.html', 'Actualités', "Les dernières nouvelles des Amis d'Handimak : événements, remerciements, équipements financés.", `
${pageHead('Quoi de neuf ?', 'Actualités', 'Les dernières nouvelles de l\'association.')}
<section><div class="wrap"><div class="grid g2" id="news-list"></div>
 <p class="note center" style="margin-top:24px">Suivez aussi l'actualité en direct sur <a href="${SITE.facebook}" target="_blank" rel="noopener">notre page Facebook</a>.</p></div></section>`);

/* ---------- Don ---------- */
page('don.html', 'Faire un don', "Soutenez les Amis d'Handimak : don en ligne via une plateforme sécurisée, dons en nature, bénévolat, relais.", `
${pageHead('Agir', 'Faire un don', "Chaque geste, grand ou petit, aide à financer un équipement essentiel.")}
<section><div class="wrap split">
  <div class="reveal"><span class="eyebrow">Don financier</span><h2>Donner en ligne</h2>
    <p>Le don s'effectue sur une plateforme de paiement sécurisée externe (HelloAsso ou équivalent). <strong>Aucun paiement n'est géré sur ce site.</strong></p>
    <div class="actions"><a id="don-externe" class="btn btn-don" href="#don-externe">♥ Donner maintenant</a></div>
    <p id="don-wait" hidden style="margin-top:14px">${todo("Lien de la cagnotte (HelloAsso ou autre) à renseigner dans data/site.json → donUrl.")}</p></div>
  <div class="progress reveal" id="progress-box"></div>
</div></section>
<section class="band"><div class="wrap"><div class="center reveal"><span class="eyebrow">Autres façons d'aider</span><h2>Il n'y a pas que l'argent</h2></div>
  <div class="grid g3" style="margin-top:30px">
    <div class="card reveal"><div class="ico y" aria-hidden="true">🎁</div><h3>Dons en nature</h3><p>Lots pour une tombola, matériel, denrées pour un événement.</p><a class="more" href="contact.html">Nous contacter</a></div>
    <div class="card reveal"><div class="ico g" aria-hidden="true">🙌</div><h3>Bénévolat</h3><p>Quelques heures suffisent pour faire la différence.</p><a class="more" href="contact.html#benevolat">Devenir bénévole</a></div>
    <div class="card reveal"><div class="ico b" aria-hidden="true">📣</div><h3>Relayer</h3><p>Partagez nos événements autour de vous et sur les réseaux.</p><a class="more" href="${SITE.facebook}" target="_blank" rel="noopener">Page Facebook</a></div>
  </div></div></section>
<section><div class="wrap"><div class="card wait reveal"><h3>Mention fiscale</h3><p style="margin:0">${todo("Texte à valider par l'association : aucun avantage ni reçu fiscal n'est annoncé tant que le statut de l'association n'est pas confirmé.")}</p></div></div></section>`);

/* ---------- Partenaires ---------- */
page('partenaires.html', 'Partenaires & mécènes', "Commerces, entreprises et institutions qui soutiennent les Amis d'Handimak. Devenez partenaire.", `
${pageHead('Ils nous soutiennent', 'Partenaires &amp; mécènes', "Commerçants, entreprises, collectivités : merci à celles et ceux qui rendent nos actions possibles.")}
<section><div class="wrap"><h2 class="reveal">Nos soutiens</h2><div class="grid g3" id="partners-list" style="margin-top:22px"></div></div></section>
<section class="band"><div class="wrap split">
  <div class="reveal"><span class="eyebrow">Appel</span><h2>Devenez partenaire</h2>
    <ul class="check"><li>Offrir un lot ou une prestation pour un événement</li><li>Soutenir financièrement un projet</li><li>Prêter une salle ou du matériel</li><li>Relayer l'association auprès de vos clients</li></ul>
    <p>${todo("Contreparties (visibilité, mention fiscale éventuelle) à valider par l'association.")}</p>
    <a class="btn btn-don" href="contact.html">Proposer un partenariat</a></div>
  <div class="art reveal" aria-hidden="true">🤝</div></div></section>`);

/* ---------- Contact ---------- */
page('contact.html', 'Nous rejoindre / Contact', "Rejoignez les Amis d'Handimak à Rognac : bénévolat, adhésion, formulaire de contact et coordonnées.", `
${pageHead('Parlons-en', 'Nous rejoindre', "Bénévole, adhérent, partenaire ou simplement curieux : écrivez-nous.")}
<section id="benevolat"><div class="wrap grid g2">
  <div class="card reveal"><div class="ico g" aria-hidden="true">🙌</div><h3>Devenir bénévole</h3><p>Préparation d'événements, accueil, logistique, communication : toutes les bonnes volontés sont les bienvenues.</p><p>${todo("Modalités et besoins en bénévoles à renseigner.")}</p></div>
  <div class="card reveal"><div class="ico b" aria-hidden="true">🎫</div><h3>Adhérer</h3><p>Adhérer, c'est soutenir durablement l'association.</p><p>${todo("Montant et modalités d'adhésion à renseigner (aucune information trouvée).")}</p></div>
</div></section>
<section class="band"><div class="wrap split" style="align-items:start">
  <div class="reveal"><h2>Écrivez-nous</h2>
    <form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact">
      <p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field"><label for="nom">Nom et prénom</label><input id="nom" name="nom" autocomplete="name" required></div>
      <div class="field"><label for="email">Adresse e-mail</label><input id="email" type="email" name="email" autocomplete="email" required></div>
      <div class="field"><label for="sujet">Sujet</label><select id="sujet" name="sujet"><option>Bénévolat</option><option>Adhésion</option><option>Partenariat</option><option>Don en nature</option><option>Autre</option></select></div>
      <div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
      <p class="note">Vos données servent uniquement à répondre à votre message (voir la <a href="mentions-legales.html#confidentialite">politique de confidentialité</a>).</p>
      <button class="btn btn-don" type="submit">Envoyer le message</button>
    </form></div>
  <div class="reveal"><h2>Coordonnées</h2>
    <p><strong>Les Amis d'Handimak</strong><br>${SITE.adresse}<br><a href="mailto:${SITE.email}">${SITE.email}</a><br>Téléphone : ${todo('à compléter')}</p>
    <p><a class="btn btn-ghost btn-sm" href="${SITE.facebook}" target="_blank" rel="noopener">Facebook ↗</a></p>
    <div class="map"><iframe title="Carte de Rognac" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=5.2150%2C43.4750%2C5.2600%2C43.5000&amp;layer=mapnik"></iframe></div>
    <p class="note" style="margin-top:8px"><a href="https://www.openstreetmap.org/search?query=Rognac" target="_blank" rel="noopener">Voir Rognac sur OpenStreetMap ↗</a> — position exacte du local à confirmer.</p></div>
</div></section>`);

/* ---------- Merci ---------- */
page('merci.html', 'Message envoyé', "Merci pour votre message à l'association Les Amis d'Handimak.", `
${pageHead('Merci !', 'Message envoyé', "Nous vous répondrons dès que possible.")}
<section><div class="wrap center"><a class="btn btn-sun" href="index.html">Retour à l'accueil</a></div></section>`);

/* ---------- Mentions légales ---------- */
page('mentions-legales.html', 'Mentions légales', "Mentions légales, informations réglementaires et politique de confidentialité des Amis d'Handimak.", `
${pageHead('Informations', 'Mentions légales', "Informations réglementaires et politique de confidentialité.")}
<section class="legal"><div class="wrap" style="max-width:820px">
  <h2 style="margin-top:0">Éditeur du site</h2>
  <p><strong>Les Amis d'Handimak</strong>, association loi 1901<br>Date de déclaration : 5 janvier 2023<br>Numéro RNA : ${SITE.rna}<br>Siège : ${SITE.adresse}<br>E-mail : <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  <p>${todo("À valider : adresse exacte du siège (certains annuaires indiquent 14 avenue de Verdun, 13340 Rognac), SIREN, nom du responsable de publication.")}</p>
  <h2>Hébergement</h2><p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
  <h2>Propriété intellectuelle</h2><p>${todo("Texte à compléter par l'association.")}</p>
  <h2>Dons et statut fiscal</h2><p>${todo("Texte à valider : aucun avantage ni reçu fiscal n'est annoncé tant que le statut est à confirmer.")}</p>
  <h2 id="confidentialite">Politique de confidentialité</h2>
  <p>Ce site ne dépose aucun cookie publicitaire ni de suivi. Le formulaire de contact (traité par Netlify Forms) collecte nom, e-mail et message, uniquement pour répondre à votre demande. Vos données ne sont ni vendues ni cédées.</p>
  <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression en écrivant à <a href="mailto:${SITE.email}">${SITE.email}</a>. ${todo('Durée de conservation à valider par l\'association.')}</p>
  <p>La carte de la page Contact est fournie par OpenStreetMap ; son chargement peut transmettre votre adresse IP à ce service.</p>
  <h2>Protection des enfants</h2><p>Aucune photo, aucun prénom ni information médicale d'un enfant n'est publié sans l'accord clair de sa famille.</p>
</div></section>`);
console.log('pages ok');
