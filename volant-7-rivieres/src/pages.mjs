// Pages du site. Chaque page lit ses contenus dans /data (JSON) : le club modifie les données, pas la mise en page.
import { esc, wave } from './layout.mjs';

const hero = ({ kicker, title, lead, image, img, alt = '' }) => `
<section class="phead">
  <div class="phead__bg">${img(image, alt, { lazy: false, eager: true })}</div>
  <div class="phead__shade"></div>
  <div class="container phead__in">
    <p class="kicker reveal">${esc(kicker)}</p>
    <h1 class="reveal" style="--d:.08s">${title}</h1>
    ${lead ? `<p class="lead reveal" style="--d:.16s">${lead}</p>` : ''}
  </div>
  ${wave('wave--paper', 1)}
</section>`;

const btn = (href, label, cls = '') => `<a class="btn ${cls}" href="${href}">${esc(label)}</a>`;
const monthFmt = d => d;

/* ───────────────────────── ACCUEIL ───────────────────────── */
function accueil({ site, data, img }) {
  const posts = [...data.actualites.posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const ne = site.nextEvent;
  const cards = [
    { href: 'le-club.html', t: 'Le club', d: 'Histoire, valeurs, bureau et coach.', i: 'presidents.webp' },
    { href: 'creneaux-tarifs.html', t: 'Créneaux & tarifs', d: 'Où et quand jouer cette saison.', i: 'noel-jeunes.webp' },
    { href: 'tournois-evenements.html', t: 'Tournois & événements', d: 'Rendez-vous à venir et souvenirs.', i: 'tournoi-panorama.webp' },
    { href: 'resultats-competitions.html', t: 'Résultats', d: 'Podiums, interclubs, jeunes.', i: 'smash-podium-duo.webp' },
    { href: 'galerie.html', t: 'Galerie', d: 'Le club en photos, par activité.', i: 'interclub-groupe.webp' },
    { href: 'actualites.html', t: 'Actualités', d: 'Les dernières nouvelles du V7R.', i: 'raclette-groupe.webp' }
  ];
  return {
    title: 'Accueil',
    description: 'Le Volant des 7 Rivières, club de badminton à Courthézon, Bédarrides et Châteauneuf-du-Pape (Vaucluse) : jeu libre, jeunes, compétition, tournois et bonne ambiance. Venez essayer !',
    script: 'home.js',
    body: `
<section class="hero" id="hero">
  <div class="hero__bg">${img('hero-club.webp', 'Joueurs et joueuses du V7R rassemblés dans la salle, bras en l\'air', { lazy: false, eager: true })}</div>
  <div class="hero__shade"></div>
  <div class="hero__aurora" aria-hidden="true"></div>
  <img class="hero__shuttle" id="shuttle" src="assets/img/volant.png" width="360" height="360" alt="" aria-hidden="true">
  <svg class="hero__trail" id="trail" aria-hidden="true"><path id="trailPath" d="" /></svg>
  <div class="container hero__in">
    <p class="kicker reveal">${esc(site.hero.kicker)} · Vaucluse</p>
    <h1 class="hero__title reveal" style="--d:.1s"><span>Le Volant</span> <span>des 7 Rivières</span></h1>
    <p class="hero__tag reveal" style="--d:.2s">${esc(site.hero.tagline)}</p>
    <div class="hero__cta reveal" style="--d:.3s">
      ${btn('contact.html#essai', 'Venir essayer', 'btn--coral')}
      ${btn('creneaux-tarifs.html', 'Voir les créneaux', 'btn--ghost')}
    </div>
  </div>
  <a class="hero__scroll" href="#prochain" aria-label="Descendre"><span></span></a>
  ${wave('wave--paper', 1)}
</section>

<section class="next" id="prochain">
  <div class="container">
    <article class="next__card reveal">
      <div class="next__badge"><span class="pulse"></span>${esc(ne.label)}</div>
      <div class="next__main">
        <h2>${esc(ne.title)}</h2>
        <p class="next__meta"><strong>${esc(ne.when)}</strong> · ${esc(ne.where)}</p>
        <p>${esc(ne.text)}</p>
      </div>
      <div class="next__act">${btn(ne.cta.href, ne.cta.label, 'btn--coral')}<a class="link" href="tournois-evenements.html">Tournois & événements →</a></div>
    </article>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Explorer</p><h2>Le club, section par section</h2></header>
    <div class="cards">
      ${cards.map((c, i) => `
      <a class="card tilt reveal" href="${c.href}" style="--d:${(i % 3) * .08}s">
        <div class="card__img">${img(c.i, '')}</div>
        <div class="card__body"><h3>${esc(c.t)}</h3><p>${esc(c.d)}</p><span class="card__go" aria-hidden="true">→</span></div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="stats" id="chiffres">
  ${wave('wave--stats-top', 2)}
  <div class="stats__in">
    <div class="container">
      <header class="sec-head sec-head--light reveal"><p class="kicker">Chiffres clés</p><h2>Un club qui bouge</h2></header>
      <ul class="stats__grid">
        ${site.stats.map((s, i) => `
        <li class="stat reveal" style="--d:${i * .08}s">
          <span class="stat__n"><span data-count="${s.value}">${s.value}</span><span class="stat__suf">${esc(s.suffix)}</span></span>
          <span class="stat__l">${esc(s.label)}</span>
          <span class="stat__note">${esc(s.note)}</span>
        </li>`).join('')}
      </ul>
      <p class="stats__foot">${esc(site.statsNote)}</p>
    </div>
  </div>
  ${wave('wave--paper', 1)}
</section>

<section class="section">
  <div class="container">
    <header class="sec-head sec-head--row reveal"><div><p class="kicker kicker--dark">À la une</p><h2>Dernières actualités</h2></div><a class="link" href="actualites.html">Toutes les actualités →</a></header>
    <div class="news">
      ${posts.map((p, i) => `
      <article class="news__item reveal" style="--d:${i * .08}s">
        ${p.image ? `<div class="news__img">${img(p.image, '')}</div>` : `<div class="news__img news__img--blank"><img src="assets/img/silhouette.png" alt="" width="500" height="500" loading="lazy"></div>`}
        <div class="news__body"><p class="meta"><span class="tag">${esc(p.tag)}</span> ${esc(p.dateLabel)}</p><h3><a href="actualites.html#${p.date}">${esc(p.title)}</a></h3><p>${esc(p.excerpt)}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="band">
  <div class="band__bg">${img('tournoi-panorama.webp', 'Terrains de badminton remplis lors d\'un tournoi')}</div>
  <div class="band__shade"></div>
  <div class="container band__in reveal">
    <p class="band__q">« Du loisir à la compétition, chacun avance à son rythme. »</p>
    <p class="band__s">Interclubs, tournois jeunes, soirées du club : le V7R joue sur trois communes.</p>
  </div>
</section>

<section class="cta">
  <div class="container cta__in reveal">
    <img class="cta__sil" src="assets/img/silhouette.png" width="500" height="500" alt="" loading="lazy">
    <div>
      <h2>Envie de taper dans le volant&nbsp;?</h2>
      <p>Venez essayer un mercredi soir à Châteauneuf-du-Pape. Prêtez-nous quelques minutes, on vous répond vite.</p>
    </div>
    ${btn('contact.html#essai', 'Je veux essayer', 'btn--coral btn--lg')}
  </div>
</section>`
  };
}

/* ───────────────────────── LE CLUB ───────────────────────── */
function leClub({ site, data, img }) {
  const b = data.bureau;
  return {
    title: 'Le club',
    description: 'Présentation du Volant des 7 Rivières : histoire depuis 2016, valeurs, bureau et coach du club de badminton de Courthézon, Bédarrides et Châteauneuf-du-Pape.',
    body: `
${hero({ kicker: 'Le club', title: 'Trois villages,<br>une équipe', lead: 'Association de badminton née en 2016 entre Bédarrides, Courthézon et Châteauneuf-du-Pape.', image: 'interclub-groupe.webp', img, alt: 'Joueurs du V7R réunis dans un gymnase' })}
<section class="section">
  <div class="container split">
    <div class="split__txt reveal">
      <p class="kicker kicker--dark">Qui sommes-nous</p>
      <h2>Faire pratiquer le badminton, ensemble</h2>
      <p>Le Volant des 7 Rivières est une association loi 1901 créée en 2016. Son objet : faire pratiquer le badminton, mais aussi diriger, encourager, organiser et développer la pratique sur le territoire de Bédarrides, Courthézon et Châteauneuf-du-Pape, et aux alentours.</p>
      <p>Licencié à la Fédération française de badminton, le club engage des équipes en interclubs, accompagne ses jeunes sur les tournois départementaux et organise toute l'année des rendez-vous conviviaux : galette, raclette, soirée de Noël, loto.</p>
    </div>
    <figure class="split__img reveal" style="--d:.1s">${img('jeu-gymnase.webp', 'Joueurs sur les terrains lors de la journée d\'intégration')}<figcaption>Journée d'intégration, gymnase du collège de Bédarrides</figcaption></figure>
  </div>
</section>

<section class="section section--foam">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Notre histoire</p><h2>Quelques repères</h2></header>
    <ol class="timeline">
      ${b.histoire.map((h, i) => `<li class="timeline__item reveal" style="--d:${i * .06}s"><span class="timeline__y">${esc(h.year)}</span><p>${esc(h.text)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Nos valeurs</p><h2>Ce qui nous réunit sur le terrain</h2></header>
    <div class="values">
      ${b.valeurs.map((v, i) => `<article class="value tilt reveal" style="--d:${i * .06}s"><span class="value__n">0${i + 1}</span><h3>${esc(v.title)}</h3><p>${esc(v.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--foam">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Les bénévoles</p><h2>Bureau &amp; encadrement</h2><p class="sec-head__p">${esc(b.intro)}</p></header>
    <div class="team">
      ${b.members.map((m, i) => `
      <article class="member reveal" style="--d:${i * .06}s">
        ${m.photo ? `<div class="member__img">${img(m.photo, 'Les co-présidents du club, en maillot turquoise')}</div>` : ''}
        <h3>${esc(m.role)}</h3>
        <p>${m.names.map(esc).join(' · ')}</p>
      </article>`).join('')}
      ${b.coaches.map(c => `<article class="member member--coach reveal"><h3>${esc(c.role)}</h3><p><strong>${esc(c.name)}</strong></p><p class="member__txt">${esc(c.text)}</p></article>`).join('')}
    </div>
  </div>
</section>

<section class="cta">
  <div class="container cta__in reveal">
    <img class="cta__sil" src="assets/img/silhouette.png" width="500" height="500" alt="" loading="lazy">
    <div><h2>Rejoignez l'équipe</h2><p>Joueur, joueuse, parent ou bénévole : il y a une place pour vous.</p></div>
    ${btn('contact.html', 'Nous contacter', 'btn--coral btn--lg')}
  </div>
</section>`
  };
}

/* ───────────────────────── CRÉNEAUX & TARIFS ───────────────────────── */
function creneaux({ site, data, img }) {
  const c = data.creneaux;
  const statusCls = { open: 'chip--open', paused: 'chip--paused', pending: 'chip--pending' };
  return {
    title: 'Créneaux & tarifs',
    description: 'Créneaux de badminton du Volant des 7 Rivières pour la saison 2026-2027 : jeu libre adultes le mercredi à Châteauneuf-du-Pape, tarifs, licence et modalités d\'inscription.',
    body: `
${hero({ kicker: `Saison ${c.season}`, title: 'Créneaux<br>&amp; tarifs', lead: 'Où et quand jouer, ce que ça coûte et comment s\'inscrire.', image: 'noel-jeunes.webp', img, alt: 'Jeunes jouant au badminton à la salle Dufays' })}
<section class="section">
  <div class="container">
    <aside class="alert reveal" role="note">
      <span class="alert__ico" aria-hidden="true">!</span>
      <div><h2>${esc(c.alert.title)}</h2><p>${esc(c.alert.text)}</p></div>
    </aside>
    <header class="sec-head reveal"><p class="kicker kicker--dark">Planning</p><h2>Les créneaux de la saison</h2></header>
    <div class="slots">
      ${c.slots.map((s, i) => `
      <article class="slot slot--${s.status} reveal" style="--d:${i * .07}s" id="${s.id}" tabindex="0">
        <div class="slot__face">
          <p class="slot__cat">${esc(s.category)}</p>
          <h3>${esc(s.title)}</h3>
          <p class="slot__when"><strong>${esc(s.day)}</strong><br>${esc(s.time)}</p>
          <p class="slot__where">${esc(s.place)}</p>
          <p class="slot__aud">${esc(s.audience)}</p>
          <span class="chip ${statusCls[s.status]}">${esc(s.statusLabel)}</span>
          <button class="slot__more" type="button" aria-expanded="false">Détails</button>
        </div>
        <div class="slot__back">
          <ul>${s.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
          <a class="btn btn--small" href="${s.cta.href}">${esc(s.cta.label)}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--foam" id="tarifs">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Tarifs</p><h2>Cotisation ${c.season}</h2></header>
    <div class="prices">
      ${c.tarifs.map((t, i) => `<article class="price tilt reveal" style="--d:${i * .08}s"><p class="price__v"><span data-count="${t.price}">${t.price}</span><small>${esc(t.unit)}</small></p><h3>${esc(t.label)}</h3><p>${esc(t.note)}</p></article>`).join('')}
      <article class="price price--pending reveal" style="--d:.16s"><p class="price__v">?</p><h3>Jeunes</h3><p>${esc(c.tarifsPending)}</p></article>
    </div>
  </div>
</section>

<section class="section" id="inscription">
  <div class="container split split--top">
    <div class="reveal">
      <p class="kicker kicker--dark">Inscription</p>
      <h2>${esc(c.inscription.title)}</h2>
      <ol class="steps">${c.inscription.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <p>${btn('contact.html#essai', 'Demander une séance d\'essai', 'btn--coral')}</p>
    </div>
    <div class="mapbox reveal" style="--d:.1s">
      <h3>Où jouer cette saison&nbsp;?</h3>
      <p><strong>${esc(site.gym.name)}</strong>, ${esc(site.gym.town)}</p>
      <iframe title="Plan : ${esc(site.gym.name)}, ${esc(site.gym.town)}" src="${site.gym.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <a class="link" href="${site.gym.mapLink}" target="_blank" rel="noopener">Ouvrir dans Google Maps →</a>
    </div>
  </div>
</section>`
  };
}

/* ───────────────────────── TOURNOIS & ÉVÉNEMENTS ───────────────────────── */
function tournois({ site, data, img }) {
  const t = data.tournois;
  const types = [...new Set(t.archives.map(a => a.type))];
  return {
    title: 'Tournois & événements',
    description: 'Tournois, soirées et rendez-vous du Volant des 7 Rivières : prochains événements, rythme d\'une saison et archives (Smash du Triomphe, TDJ, raclette, tournoi de Noël).',
    script: 'filters.js',
    body: `
${hero({ kicker: 'Tournois & événements', title: 'Jouer, gagner,<br>se retrouver', lead: 'Les rendez-vous qui font vivre le club, de la compétition à la raclette.', image: 'tournoi-panorama.webp', img, alt: 'Terrains pleins lors d\'un tournoi' })}
<section class="section">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">À venir</p><h2>Prochains rendez-vous</h2><p class="sec-head__p">${esc(t.upcomingNote)}</p></header>
    <div class="events">
      ${t.upcoming.map(e => `
      <article class="event ${e.placeholder ? 'event--pending' : ''} reveal">
        <div class="event__date">${esc(e.dateLabel)}</div>
        <div><span class="tag">${esc(e.tag || '')}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p><p class="meta">${esc(e.place)}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--foam">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Au fil des mois</p><h2>${esc(t.seasonRhythm.title)}</h2><p class="sec-head__p">${esc(t.seasonRhythm.note)}</p></header>
    <div class="months">
      ${t.seasonRhythm.months.map((m, i) => `<article class="month tilt reveal" style="--d:${(i % 3) * .06}s"><h3>${esc(m.month)}</h3><ul>${m.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Archives</p><h2>Ils ont fait la saison</h2></header>
    <div class="filters reveal" role="group" aria-label="Filtrer les archives">
      <button class="filter is-on" data-filter="*" type="button">Tout</button>
      ${types.map(x => `<button class="filter" data-filter="${esc(x)}" type="button">${esc(x)}</button>`).join('')}
    </div>
    <div class="archive" data-filterable>
      ${[...t.archives].sort((a, b) => b.date.localeCompare(a.date)).map(a => `
      <article class="arch reveal" data-type="${esc(a.type)}">
        ${a.image ? `<div class="arch__img">${img(a.image, '')}</div>` : `<div class="arch__img arch__img--blank"><img src="assets/img/silhouette.png" alt="" width="500" height="500" loading="lazy"></div>`}
        <div class="arch__body"><p class="meta"><span class="tag">${esc(a.type)}</span> ${esc(a.dateLabel)}</p><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>`
  };
}

/* ───────────────────────── RÉSULTATS ───────────────────────── */
function resultats({ site, data, img }) {
  const r = data.resultats;
  const medal = n => `<span class="medal medal--${n}" aria-label="${n === 1 ? '1re place' : n === 2 ? '2e place' : '3e place'}">${n}</span>`;
  return {
    title: 'Résultats & compétitions',
    description: 'Résultats du Volant des 7 Rivières : podiums du Smash du Triomphe, tournois départementaux jeunes (TDJ) et interclubs R4, D3 et D4 de la saison 2025-2026.',
    body: `
${hero({ kicker: 'Résultats & compétitions', title: 'Les podiums<br>du V7R', lead: `Saison ${r.season} : tournois adultes, tournois jeunes et interclubs.`, image: 'smash-podium-duo.webp', img, alt: 'Duo victorieux sur la première marche du podium' })}
<section class="section">
  <div class="container">
    <p class="note reveal">${esc(r.note)} <a href="${r.source.url}" target="_blank" rel="noopener">${esc(r.source.label)}</a>.</p>
    <header class="sec-head reveal"><p class="kicker kicker--dark">Tournois</p><h2>Podiums de la saison</h2></header>
    <div class="results">
      ${r.highlights.map((h, i) => `
      <article class="res tilt reveal" style="--d:${(i % 2) * .08}s">
        <div class="res__img">${img(h.image, '')}</div>
        <div class="res__body">
          <h3>${esc(h.title)}</h3><p class="meta">${esc(h.meta)}</p>
          <ul class="medals">${h.medals.map(m => `<li>${medal(m.rank)}<span>${esc(m.text)}</span></li>`).join('')}</ul>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--foam">
  <div class="container">
    <header class="sec-head reveal"><p class="kicker kicker--dark">Interclubs</p><h2>Les équipes en championnat</h2></header>
    <div class="teams">
      ${r.interclubs.map((t, i) => `
      <article class="tm reveal" style="--d:${i * .06}s">
        <div class="tm__img">${img(t.image, `Équipe ${t.team} du V7R`)}</div>
        <div><h3>${esc(t.team)}</h3><p>${esc(t.text)}</p></div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <figure class="split__img reveal">${img(r.regional.image, 'Podium du championnat régional')}</figure>
    <div class="split__txt reveal" style="--d:.1s"><p class="kicker kicker--dark">Mise à l'honneur</p><h2>${esc(r.regional.title)}</h2><p>${esc(r.regional.text)}</p><p>${btn('contact.html#essai', 'Rejoindre le club', 'btn--coral')}</p></div>
  </div>
</section>`
  };
}

/* ───────────────────────── GALERIE ───────────────────────── */
function galerie({ site, data, img }) {
  const g = data.galerie;
  return {
    title: 'Galerie',
    description: 'Galerie photo du Volant des 7 Rivières : jeu libre, tournois et podiums, jeunes, interclubs et soirées conviviales du club de badminton.',
    script: 'gallery.js',
    body: `
${hero({ kicker: 'Galerie', title: 'Le club<br>en images', lead: g.note, image: 'raclette-groupe.webp', img, alt: 'Tablée du club lors de la soirée raclette' })}
<section class="section">
  <div class="container">
    <div class="filters reveal" role="group" aria-label="Choisir un album">
      <button class="filter is-on" data-filter="*" type="button">Tout</button>
      ${g.albums.map(a => `<button class="filter" data-filter="${a.id}" type="button">${esc(a.title)}</button>`).join('')}
    </div>
    <div class="gallery" data-filterable>
      ${g.albums.map(a => a.photos.map(p => `
      <figure class="shot reveal ${p.portrait ? 'shot--tall' : ''}" data-type="${a.id}">
        <a href="assets/img/${p.src}" class="shot__a" data-album="${esc(a.title)}" data-cap="${esc(p.caption)}">${img(p.src, p.alt)}<figcaption><span>${esc(a.title)}</span>${esc(p.caption)}</figcaption></a>
      </figure>`).join('')).join('')}
    </div>
  </div>
</section>
<dialog class="lightbox" id="lightbox" aria-label="Photo agrandie">
  <button class="lightbox__x" type="button" aria-label="Fermer">×</button>
  <button class="lightbox__p" type="button" aria-label="Photo précédente">‹</button>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button class="lightbox__n" type="button" aria-label="Photo suivante">›</button>
</dialog>`
  };
}

/* ───────────────────────── ACTUALITÉS ───────────────────────── */
function actualites({ site, data, img }) {
  const posts = [...data.actualites.posts].sort((a, b) => b.date.localeCompare(a.date));
  const tags = [...new Set(posts.map(p => p.tag))];
  return {
    title: 'Actualités',
    description: 'Les actualités du Volant des 7 Rivières : rentrée 2026-2027, travaux du gymnase de Bédarrides, résultats, tournois jeunes et événements du club.',
    script: 'filters.js',
    body: `
${hero({ kicker: 'Actualités', title: 'Les nouvelles<br>du volant', lead: 'Rentrée, résultats, soirées : tout ce qui bouge au V7R.', image: 'podium-tdj-bedarrides.webp', img, alt: 'Podiums du tournoi jeunes de Bédarrides' })}
<section class="section">
  <div class="container">
    <div class="filters reveal" role="group" aria-label="Filtrer par thème">
      <button class="filter is-on" data-filter="*" type="button">Tout</button>
      ${tags.map(x => `<button class="filter" data-filter="${esc(x)}" type="button">${esc(x)}</button>`).join('')}
    </div>
    <div class="posts" data-filterable>
      ${posts.map((p, i) => `
      <article class="post reveal" id="${p.date}" data-type="${esc(p.tag)}" style="--d:${(i % 2) * .06}s">
        ${p.image ? `<div class="post__img">${img(p.image, '')}</div>` : `<div class="post__img post__img--blank"><img src="assets/img/silhouette.png" alt="" width="500" height="500" loading="lazy"></div>`}
        <div class="post__body">
          <p class="meta"><span class="tag">${esc(p.tag)}</span> ${esc(p.dateLabel)}</p>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.excerpt)}</p>
          ${p.body ? `<details><summary>Lire la suite</summary><p>${esc(p.body)}</p></details>` : ''}
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`
  };
}

/* ───────────────────────── CONTACT ───────────────────────── */
function contact({ site, data, img }) {
  const c = site.contact;
  const field = (id, label, type = 'text', extra = '') => `<p class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${extra}></p>`;
  const honey = `<p class="hidden" aria-hidden="true"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>`;
  return {
    title: 'Nous rejoindre / Contact',
    description: 'Rejoindre le Volant des 7 Rivières : demande de séance d\'essai, formulaire de contact, coordonnées du club et plan de la salle Dufays à Châteauneuf-du-Pape.',
    body: `
${hero({ kicker: 'Nous rejoindre', title: 'Venez<br>essayer&nbsp;!', lead: 'Une raquette, des baskets propres et l\'envie de jouer : le reste, on s\'en occupe.', image: 'hero-club.webp', img, alt: 'Joueurs du V7R rassemblés dans la salle' })}
<section class="section" id="essai">
  <div class="container split split--top">
    <div class="reveal">
      <p class="kicker kicker--dark">Séance d'essai</p>
      <h2>Demander une séance d'essai</h2>
      <p>Le jeu libre adultes se joue le <strong>mercredi, de 18h30 à 20h30</strong>, à la ${esc(site.gym.name)} (${esc(site.gym.town)}), sur demande. Chacun apporte ses volants. Dites-nous qui vous êtes et on vous met en relation avec le groupe de joueurs.</p>
      <form class="form" name="essai" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="essai">
        <input type="hidden" name="subject" value="Demande de séance d'essai (V7R)">
        ${honey}
        ${field('nom', 'Nom et prénom', 'text', 'required autocomplete="name"')}
        ${field('email', 'E-mail', 'email', 'required autocomplete="email"')}
        ${field('telephone', 'Téléphone (facultatif)', 'tel', 'autocomplete="tel"')}
        <p class="field"><label for="niveau">Votre niveau</label><select id="niveau" name="niveau"><option>Débutant</option><option>Je joue de temps en temps</option><option>Joueur régulier</option><option>Compétiteur</option></select></p>
        <p class="field"><label for="msg-essai">Un mot sur vous (facultatif)</label><textarea id="msg-essai" name="message" rows="3"></textarea></p>
        <button class="btn btn--coral" type="submit">Envoyer ma demande</button>
      </form>
    </div>
    <aside class="infobox reveal" style="--d:.1s">
      <h3>Coordonnées</h3>
      <p><a href="mailto:${c.email}">${c.email}</a></p>
      <p><a href="tel:${c.phoneHref}">${c.phone}</a><br><small>Secrétariat du club</small></p>
      <p><a href="tel:${c.referent.phoneHref}">${c.referent.phone}</a><br><small>${esc(c.referent.name)}, ${esc(c.referent.role.toLowerCase())}</small></p>
      <p>${esc(c.address)}<br><small>${esc(c.addressNote)}</small></p>
      <ul class="social social--dark">${site.socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
    </aside>
  </div>
</section>

<section class="section section--foam" id="message">
  <div class="container split split--top">
    <div class="reveal">
      <p class="kicker kicker--dark">Une question&nbsp;?</p>
      <h2>Écrivez-nous</h2>
      <form class="form" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="Message depuis le site du V7R">
        ${honey}
        ${field('c-nom', 'Nom', 'text', 'required autocomplete="name"').replace('name="c-nom"', 'name="nom"')}
        ${field('c-email', 'E-mail', 'email', 'required autocomplete="email"').replace('name="c-email"', 'name="email"')}
        <p class="field"><label for="c-message">Message</label><textarea id="c-message" name="message" rows="5" required></textarea></p>
        <button class="btn btn--coral" type="submit">Envoyer</button>
      </form>
    </div>
    <div class="mapbox reveal" style="--d:.1s">
      <h3>Plan : ${esc(site.gym.name)}</h3>
      <p>${esc(site.gym.town)}, créneau du mercredi</p>
      <iframe title="Plan : ${esc(site.gym.name)}, ${esc(site.gym.town)}" src="${site.gym.mapEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      <a class="link" href="${site.gym.mapLink}" target="_blank" rel="noopener">Itinéraire →</a>
      <p class="note">Gymnase de Bédarrides : en reconstruction, créneaux suspendus pour la saison 2026-2027.</p>
    </div>
  </div>
</section>`
  };
}

/* ───────────────────────── MENTIONS LÉGALES ───────────────────────── */
function mentions({ site, img }) {
  const c = site.contact;
  return {
    title: 'Mentions légales',
    description: 'Mentions légales du site du Volant des 7 Rivières, association loi 1901 de badminton : éditeur, hébergeur, données personnelles et cookies.',
    body: `
${hero({ kicker: 'Informations', title: 'Mentions<br>légales', lead: '', image: 'jeu-gymnase.webp', img, alt: '' })}
<section class="section">
  <div class="container prose">
    <h2>1. Éditeur</h2>
    <p><strong>${esc(site.name)}</strong>, association loi 1901 (RNA W842006493).<br>Siège social : ${esc(c.address)}.<br>Téléphone : ${c.phone}. E-mail : <a href="mailto:${c.email}">${c.email}</a>.<br>Directrice de la publication : Delphine Trouche.</p>
    <h2>2. Conception</h2>
    <p>Maquette réalisée par AssoVisible. Les textes, résultats et photographies proviennent du site officiel et des publications du club, à valider par le bureau avant mise en ligne définitive.</p>
    <h2>3. Hébergement</h2>
    <p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
    <h2>4. Propriété intellectuelle</h2>
    <p>Le contenu du site (textes, images, logo) est la propriété de ${esc(site.name)}, sauf mention contraire. Toute reproduction sans accord écrit du club est interdite.</p>
    <h2>5. Responsabilité</h2>
    <p>Les informations sont aussi précises que possible et mises à jour régulièrement, mais peuvent contenir des inexactitudes. Merci de signaler toute erreur à <a href="mailto:${c.email}">${c.email}</a>.</p>
    <h2>6. Données personnelles</h2>
    <p>Les informations saisies dans les formulaires (nom, e-mail, téléphone, message) sont utilisées uniquement pour répondre à votre demande et gérer les activités du club. Elles sont destinées au bureau de l'association et conservées trois ans. Conformément à la loi « Informatique et libertés » et au RGPD, vous pouvez exercer vos droits d'accès, de rectification et de suppression en écrivant à <a href="mailto:${c.email}">${c.email}</a>.</p>
    <h2>7. Cookies</h2>
    <p>Ce site ne dépose pas de cookie publicitaire. Les polices sont chargées depuis Google Fonts et la carte depuis Google Maps, qui peuvent déposer leurs propres traceurs.</p>
    <h2>8. Liens hypertextes</h2>
    <p>Le club ne saurait être tenu responsable du contenu des sites vers lesquels il renvoie.</p>
    <h2>9. Droit applicable</h2>
    <p>Le droit français s'applique. Les tribunaux d'Avignon sont seuls compétents en cas de litige.</p>
  </div>
</section>`
  };
}

function merci({ img }) {
  return {
    title: 'Merci',
    description: 'Votre message a bien été envoyé au Volant des 7 Rivières.',
    noindex: true,
    body: `
${hero({ kicker: 'Message envoyé', title: 'Merci&nbsp;!', lead: 'On revient vers vous très vite.', image: 'hero-club.webp', img, alt: '' })}
<section class="section"><div class="container center"><p>En attendant, jetez un œil aux créneaux ou à nos dernières actualités.</p><p><a class="btn btn--coral" href="creneaux-tarifs.html">Voir les créneaux</a> <a class="btn" href="actualites.html">Actualités</a></p></div></section>`
  };
}

function notFound({ img }) {
  return {
    title: 'Page introuvable',
    description: 'Cette page n\'existe pas.',
    noindex: true,
    body: `
${hero({ kicker: 'Erreur 404', title: 'Volant<br>perdu&nbsp;!', lead: 'Cette page est sortie du terrain.', image: 'jeu-gymnase.webp', img, alt: '' })}
<section class="section"><div class="container center"><p><a class="btn btn--coral" href="index.html">Retour à l'accueil</a></p></div></section>`
  };
}

export const PAGES = [
  { file: 'index.html', slug: 'accueil', build: accueil },
  { file: 'le-club.html', slug: 'club', build: leClub },
  { file: 'creneaux-tarifs.html', slug: 'creneaux', build: creneaux },
  { file: 'tournois-evenements.html', slug: 'tournois', build: tournois },
  { file: 'resultats-competitions.html', slug: 'resultats', build: resultats },
  { file: 'galerie.html', slug: 'galerie', build: galerie },
  { file: 'actualites.html', slug: 'actualites', build: actualites },
  { file: 'contact.html', slug: 'contact', build: contact },
  { file: 'mentions-legales.html', slug: 'mentions', build: mentions },
  { file: 'merci.html', slug: 'merci', build: merci, hidden: true },
  { file: '404.html', slug: 'notfound', build: notFound, hidden: true }
];
