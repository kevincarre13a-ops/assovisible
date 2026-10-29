// Génère le site statique AK Dance dans dist/ à partir de data/*.json.
// Usage : node build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const load = (n) => JSON.parse(readFileSync(join(ROOT, 'data', `${n}.json`), 'utf8'));

const site = load('site');
const disc = load('disciplines');
const planning = load('planning');
const tarifs = load('tarifs');
const events = load('events');
const news = load('news');
const gallery = load('gallery');
const team = load('team');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tbc = (v) => (v && String(v).trim() ? esc(v) : `<span class="tbc">${esc(site.placeholder)}</span>`);
const fmtDate = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const c = site.contact;
const fullAddr = `${c.address}, ${c.zip} ${c.city}`;

const danse = disc.items.filter((d) => d.famille === 'danse');
const bienEtre = disc.items.filter((d) => d.famille === 'bien-etre');

/* ---------- éléments communs ---------- */
const roseMark = (cls = '') => `<svg class="mark ${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <g transform="translate(24 24)">
    <ellipse rx="7" ry="16" transform="rotate(0) translate(0 -9)" fill="#E0346F"/>
    <ellipse rx="7" ry="16" transform="rotate(72) translate(0 -9)" fill="#FF6B4A" opacity=".92"/>
    <ellipse rx="7" ry="16" transform="rotate(144) translate(0 -9)" fill="#E0346F" opacity=".85"/>
    <ellipse rx="7" ry="16" transform="rotate(216) translate(0 -9)" fill="#FF8A5C" opacity=".9"/>
    <ellipse rx="7" ry="16" transform="rotate(288) translate(0 -9)" fill="#3E9C90" opacity=".92"/>
    <circle r="5.5" fill="#FFF6EE"/>
  </g></svg>`;

const brand = (cls = '') => `<span class="brand ${cls}">${roseMark()}<span class="brand-text">AK<em> Dance</em></span></span>`;

const icon = {
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.6V21h2.9z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm5-2.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.5 7H4v.4l8 5.6 8-5.6V7h-.5L12 12.2z"/></svg>'
};

const header = (file) => `<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header" id="top">
  <div class="bar">
    <a class="brand-link" href="index.html" aria-label="AK Dance, accueil">${brand()}</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    <nav id="menu" class="menu" aria-label="Navigation principale">
      <ul>
${site.nav.map((n) => `        <li><a href="${n.href}"${n.href === file ? ' class="is-active" aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('\n')}
      </ul>
    </nav>
  </div>
</header>`;

const footer = () => `<footer class="site-footer">
  <svg class="footer-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C240,100 480,0 720,40 C960,80 1200,10 1440,50 L1440,90 L0,90Z" fill="currentColor"/></svg>
  <div class="wrap footer-grid">
    <div>
      ${brand('on-dark')}
      <p class="foot-tag">${esc(site.baseline)}.<br>Dès 4 ans, tous niveaux.</p>
      <p class="social">
        <a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram AK Dance">${icon.ig}</a>
        <a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook AK Dance">${icon.fb}</a>
      </p>
    </div>
    <div>
      <h2>Contact</h2>
      <ul class="plain">
        <li>${icon.pin}<span>${esc(c.address)}<br>${esc(c.zip)} ${esc(c.city)}</span></li>
        <li>${icon.tel}<a href="tel:${c.phoneHref}">${esc(c.phone)}</a></li>
        <li>${icon.mail}<a href="mailto:${c.email}">${esc(c.email)}</a></li>
      </ul>
    </div>
    <div>
      <h2>Le site</h2>
      <ul class="plain links">
${site.nav.map((n) => `        <li><a href="${n.href}">${esc(n.label)}</a></li>`).join('\n')}
      </ul>
    </div>
  </div>
  <div class="wrap legal">
    <span>© ${new Date().getFullYear()} AK Dance · Association loi 1901 · Mandres-les-Roses (94)</span>
    <a href="mentions-legales.html">Mentions légales</a>
  </div>
</footer>`;

const wave = (flip) => `<svg class="divider ${flip ? 'flip' : ''}" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,30 C200,90 420,-10 700,35 C980,80 1200,0 1440,40 L1440,80 L0,80Z" fill="currentColor"/></svg>`;

function layout({ file, title, description, hero, body, bodyClass = '', extraHead = '' }) {
  const url = `${site.url}/${file === 'index.html' ? '' : file}`;
  const fullTitle = file === 'index.html' ? title : `${title} · AK Dance`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#E0346F">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="AK Dance">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'DanceGroup',
    name: 'AK Dance',
    description: 'Association de danse et de bien-être à Mandres-les-Roses',
    url: site.url,
    telephone: c.phone,
    email: c.email,
    address: { '@type': 'PostalAddress', streetAddress: c.address, postalCode: c.zip, addressLocality: c.city, addressCountry: 'FR' },
    sameAs: [site.social.facebook, site.social.instagram]
  })}</script>
${extraHead}
</head>
<body class="${bodyClass}">
${header(file)}
<main id="contenu">
${hero}
${body}
</main>
${footer()}
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

const pageHero = ({ kicker, h1, lead, tone = 'dance' }) => `<section class="page-hero tone-${tone}">
  <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap">
    <p class="kicker" data-reveal>${esc(kicker)}</p>
    <h1 data-reveal>${h1}</h1>
    <p class="lead" data-reveal>${esc(lead)}</p>
  </div>
  ${wave()}
</section>`;

/* ---------- blocs réutilisables ---------- */
const disciplineCard = (d) => `<article class="card fam-${d.famille}" data-reveal id="${d.id}">
  <div class="card-face">
    <span class="chip">${d.famille === 'danse' ? 'Danse' : 'Bien-être'}</span>
    <h3>${esc(d.nom)}</h3>
    <p class="accroche">${esc(d.accroche)}</p>
    <p class="desc">${esc(d.description)}</p>
    <dl class="facts">
      <div><dt>Public</dt><dd>${tbc(d.public)}</dd></div>
      ${d.famille === 'danse' ? `<div><dt>Niveau</dt><dd>${tbc(d.niveau)}</dd></div>` : ''}
      <div><dt>Jours</dt><dd>${tbc(d.jours)}</dd></div>
      <div><dt>Horaires</dt><dd>${tbc(d.horaires)}</dd></div>
      <div><dt>Lieu</dt><dd>${esc(d.lieu || disc.lieuParDefaut)}</dd></div>
      <div><dt>${d.famille === 'danse' ? 'Professeur' : 'Intervenant'}</dt><dd>${tbc(d.prof)}</dd></div>
    </dl>
    ${d.note ? `<p class="note">${esc(d.note)}</p>` : ''}
    <a class="link-arrow" href="contact.html#essai">Cours d'essai gratuit <span aria-hidden="true">→</span></a>
  </div>
</article>`;

const previewTile = (d) => `<a class="tile fam-${d.famille}" href="${d.famille === 'danse' ? 'danse' : 'bien-etre'}.html#${d.id}" data-reveal><span>${esc(d.nom)}</span></a>`;

const eventCard = (e, past) => `<article class="event ${past ? 'past' : ''}" data-reveal>
  <div class="date" aria-hidden="true"><b>${new Date(e.date + 'T12:00:00').getDate()}</b><span>${new Date(e.date + 'T12:00:00').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span></div>
  <div>
    <h3>${esc(e.titre)}</h3>
    <p class="meta">${esc(fmtDate(e.date))}${e.dateFin ? ' → ' + esc(fmtDate(e.dateFin)) : ''}${e.lieu ? ' · ' + esc(e.lieu) : ''}</p>
    <p>${esc(e.resume || '')}</p>
  </div>
</article>`;

const newsCard = (n) => `<article class="news-card" data-reveal>
  <time datetime="${n.date}">${esc(fmtDate(n.date))}</time>
  <h3>${esc(n.titre)}</h3>
  <p>${esc(n.resume)}</p>
  ${n.lien ? `<a class="link-arrow" href="${esc(n.lien)}" target="_blank" rel="noopener">${esc(n.libelleLien || 'En savoir plus')} <span aria-hidden="true">→</span></a>` : ''}
</article>`;

const futureEvents = events.avenir.filter((e) => new Date(e.date + 'T23:59:59') >= new Date()).sort((a, b) => a.date.localeCompare(b.date));
const nextEvent = futureEvents[0];

const joinCta = `<section class="cta-band">
  <div class="wrap">
    <h2 data-reveal>Venez essayer, c'est gratuit.</h2>
    <p data-reveal>Un cours d'essai gratuit vous attend, dès 4 ans et pour tous les niveaux.</p>
    <p data-reveal><a class="btn btn-light" href="contact.html#essai">Réserver mon cours d'essai</a> <a class="btn btn-ghost" href="tel:${c.phoneHref}">Appeler ${esc(c.phone)}</a></p>
  </div>
</section>`;

/* ---------- planning ---------- */
const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const planningHtml = () => {
  const has = planning.cours.length > 0;
  const cols = jours.map((j) => {
    const slots = planning.cours.filter((s) => s.jour === j).sort((a, b) => a.debut.localeCompare(b.debut));
    return `<div class="day"><h3>${j[0].toUpperCase() + j.slice(1)}</h3>${
      slots.length
        ? slots.map((s) => `<div class="slot fam-${s.famille}" data-fam="${s.famille}"><b>${esc(s.debut)} – ${esc(s.fin)}</b><span>${esc(s.activite)}</span><small>${esc([s.public, s.prof, s.lieu].filter(Boolean).join(' · '))}</small></div>`).join('')
        : '<p class="empty">—</p>'
    }</div>`;
  }).join('');
  return `<div class="plan-tools" role="group" aria-label="Filtrer le planning">
    <button class="pill is-on" data-plan-filter="all" type="button">Tout</button>
    <button class="pill" data-plan-filter="danse" type="button">Danse</button>
    <button class="pill" data-plan-filter="bien-etre" type="button">Bien-être</button>
  </div>
  <div class="week" id="week">${cols}</div>
  ${has ? '' : `<p class="callout" data-reveal><strong>Planning ${esc(planning.saison)} : à confirmer.</strong> ${esc(planning.note)} <a href="${site.social.instagram}" target="_blank" rel="noopener">Voir sur Instagram</a> ou <a href="contact.html">nous écrire</a>.</p>`}`;
};

const priceTable = (rows) => `<table class="prices"><thead><tr><th scope="col">Durée hebdomadaire</th><th scope="col">Tarif annuel</th></tr></thead><tbody>${rows.map((r) => `<tr><th scope="row">${esc(r.duree)}</th><td>${r.prix} €</td></tr>`).join('')}</tbody></table>`;

/* ---------- pages ---------- */
const pages = {};
const nbCours = planning.cours.length;

pages['index.html'] = layout({
  file: 'index.html',
  title: 'AK Dance · Danse et bien-être à Mandres-les-Roses',
  description: 'AK Dance, association de danse et de bien-être à Mandres-les-Roses (94) : hip-hop, street-jazz, classique, contemporain, yoga, pilates… dès 4 ans, cours d’essai gratuit.',
  bodyClass: 'home',
  hero: `<section class="hero" id="hero">
  ${site.hero.video ? `<video class="hero-media" autoplay muted loop playsinline ${site.hero.poster ? `poster="${esc(site.hero.poster)}"` : ''}><source src="${esc(site.hero.video)}"></video>` : site.hero.image ? `<img class="hero-media" src="${esc(site.hero.image)}" alt="" fetchpriority="high">` : ''}
  <div class="hero-bg" aria-hidden="true">
    <i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i>
    <svg class="ribbon r1" viewBox="0 0 1440 400" preserveAspectRatio="none"><path d="M-20,260 C220,60 420,420 720,230 C1000,50 1220,380 1470,170" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
    <svg class="ribbon r2" viewBox="0 0 1440 400" preserveAspectRatio="none"><path d="M-20,320 C260,140 480,400 760,280 C1040,160 1240,400 1470,240" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    ${Array.from({ length: 9 }, (_, i) => `<b class="petal p${i + 1}"></b>`).join('')}
  </div>
  <div class="wrap hero-inner">
    <p class="kicker" data-reveal>Mandres-les-Roses · Val-de-Marne</p>
    <h1 data-reveal><span class="h-ak">AK</span> <span class="h-dance">Dance</span></h1>
    <p class="hero-sub" data-reveal>${esc(site.baseline)}.<br><em>Dès 4 ans, tous niveaux, dans une ambiance chaleureuse.</em></p>
    <p class="hero-cta" data-reveal><a class="btn btn-primary" href="contact.html#essai">Cours d'essai gratuit</a> <a class="btn btn-ghost-dark" href="planning-tarifs.html">Voir le planning</a></p>
  </div>
  <a class="scroll-hint" href="#apercu" aria-label="Découvrir la suite"><span></span></a>
</section>`,
  body: `
<section class="section" id="apercu">
  <div class="wrap">
    <div class="duo">
      <div class="duo-card dance" data-reveal>
        <p class="kicker">Énergie</p>
        <h2>La danse</h2>
        <p>Hip-hop, street-jazz, classique, moderne, contemporain, dancehall, heels… ${danse.length} disciplines pour bouger, s'exprimer et briller.</p>
        <div class="tiles">${danse.slice(0, 6).map(previewTile).join('')}</div>
        <a class="link-arrow" href="danse.html">Toutes les disciplines de danse <span aria-hidden="true">→</span></a>
      </div>
      <div class="duo-card well" data-reveal>
        <p class="kicker">Douceur</p>
        <h2>Le bien-être</h2>
        <p>Yoga, pilates, barre au sol, renfo… ${bienEtre.length} activités pour respirer, s'étirer et se recentrer.</p>
        <div class="tiles">${bienEtre.slice(0, 6).map(previewTile).join('')}</div>
        <a class="link-arrow" href="bien-etre.html">Toutes les activités bien-être <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="stats" aria-label="AK Dance en chiffres">
  <div class="wrap stats-grid">
    <div data-reveal><b data-count="${site.stats.adherents}">0</b><span>adhérents</span></div>
    <div data-reveal><b data-count="${disc.items.length}">0</b><span>disciplines</span></div>
    <div data-reveal><b data-count="${team.professeurs.length}">0</b><span>professeurs</span></div>
    ${nbCours > 0 ? `<div data-reveal><b data-count="${nbCours}">0</b><span>cours par semaine</span></div>` : `<div data-reveal><b data-count="${site.stats.joursDeCours}">0</b><span>jours de cours (lun → sam)</span></div>`}
    ${site.stats.foundedYear ? `<div data-reveal><b data-count="${new Date().getFullYear() - site.stats.foundedYear}">0</b><span>années d'existence</span></div>` : ''}
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    <div data-reveal>
      <p class="kicker">Prochain rendez-vous</p>
      <h2>${nextEvent ? esc(nextEvent.titre) : 'Spectacle, stages, portes ouvertes'}</h2>
      ${nextEvent ? `<p class="meta">${esc(fmtDate(nextEvent.date))}${nextEvent.lieu ? ' · ' + esc(nextEvent.lieu) : ''}</p><p>${esc(nextEvent.resume || '')}</p>` : `<p>${esc(events.attente.gala)} Suivez nos annonces sur Instagram et Facebook.</p>`}
      <a class="btn btn-primary" href="evenements.html">Tous les événements</a>
    </div>
    <div class="news-stack">
      <p class="kicker" data-reveal>Dernières actualités</p>
      ${news.items.slice(0, 3).map(newsCard).join('')}
      <a class="link-arrow" href="actualites.html">Toutes les actualités <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>
${joinCta}`
});

pages['association.html'] = layout({
  file: 'association.html',
  title: 'L’association',
  description: 'AK Dance, association de danse et de bien-être à Mandres-les-Roses : notre histoire, nos valeurs, le bureau et l’équipe de professeurs.',
  hero: pageHero({ kicker: 'Qui sommes-nous ?', h1: 'Une asso qui <em>danse</em>, ensemble', lead: 'Une équipe motivée, une ambiance chaleureuse, de 4 ans à… tous les âges.' }),
  body: `
<section class="section">
  <div class="wrap two-col">
    <div data-reveal>
      <h2>Présentation</h2>
      <p>AK Dance est une association de danse et de bien-être installée à Mandres-les-Roses, dans le Val-de-Marne. Elle propose des cours de danse pour les enfants, les ados et les adultes (hip-hop, street-jazz, classique, moderne, contemporain, dancehall…), ainsi que des activités de bien-être (yoga, pilates, barre au sol…).</p>
      <p>Avec environ <strong>${site.stats.adherents} adhérents</strong>, elle s'appuie sur une équipe motivée et sur une ambiance chaleureuse : <em>« Dès 4 ans, et pour tous les niveaux, rejoignez-nous. »</em></p>
      <blockquote class="quote">« ${esc(site.tagline)} »<cite>${esc(site.taglineSource)}</cite></blockquote>
    </div>
    <div data-reveal>
      <h2>Notre histoire</h2>
      <p class="callout">${site.stats.foundedYear ? `Association créée en ${site.stats.foundedYear}.` : `Date de création et grandes étapes de l'association : <span class="tbc">à compléter</span> par l'association (modifiable dans <code>data/site.json</code> et dans ce texte).`}</p>
      <p>Au fil des saisons, AK Dance anime la vie locale : cours hebdomadaires du lundi au samedi, week-ends danse, spectacles et rencontres avec les habitants de Mandres-les-Roses.</p>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap">
    <h2 class="center" data-reveal>Nos valeurs</h2>
    <div class="values">${team.valeurs.map((v) => `<div class="value" data-reveal><h3>${esc(v.titre)}</h3><p>${esc(v.texte)}</p></div>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2 data-reveal>Le bureau</h2>
    <div class="people">${team.bureau.map((p) => `<div class="person" data-reveal><span class="avatar" aria-hidden="true">${esc((p.nom || '?')[0])}</span><b>${tbc(p.nom)}</b><small>${esc(p.role)}</small></div>`).join('')}</div>
    <h2 data-reveal style="margin-top:3rem">Les professeurs</h2>
    <div class="people">${team.professeurs.map((p, i) => `<div class="person" data-reveal><span class="avatar a${i % 4}" aria-hidden="true">${esc(p.nom[0])}</span><b>${esc(p.nom)}</b><small>${esc(p.role)}${p.discipline ? ' · ' + esc(p.discipline) : ''}</small>${p.lien ? `<a href="${esc(p.lien)}" target="_blank" rel="noopener">${esc(p.libelleLien || 'En savoir plus')}</a>` : ''}</div>`).join('')}</div>
    <p class="muted" data-reveal>Prénoms des professeurs issus de l'ancien site de l'association ; disciplines et membres du bureau à compléter.</p>
  </div>
</section>
${joinCta}`
});

pages['danse.html'] = layout({
  file: 'danse.html',
  title: 'Danse',
  description: 'Cours de danse à Mandres-les-Roses dès 4 ans : éveil, classique, moderne, contemporain, street-jazz, hip-hop, dancehall, heels. Cours d’essai gratuit.',
  hero: pageHero({ kicker: 'Énergie', h1: 'La <em>danse</em>', lead: `${danse.length} disciplines, de l'éveil dès 4 ans aux danses urbaines. Survolez une carte pour voir le détail.` }),
  body: `<section class="section"><div class="wrap"><div class="cards">${danse.map(disciplineCard).join('')}</div></div></section>${joinCta}`
});

pages['bien-etre.html'] = layout({
  file: 'bien-etre.html',
  title: 'Bien-être',
  description: 'Yoga hatha et vinyasa, pilates, barre au sol, renfo, fitness : les activités bien-être d’AK Dance à Mandres-les-Roses.',
  hero: pageHero({ kicker: 'Douceur', h1: 'Le <em>bien-être</em>', lead: 'Respirer, s’étirer, se renforcer : des cours pour prendre soin de soi, à son rythme.', tone: 'well' }),
  body: `<section class="section"><div class="wrap"><div class="cards">${bienEtre.map(disciplineCard).join('')}</div></div></section>${joinCta}`
});

pages['planning-tarifs.html'] = layout({
  file: 'planning-tarifs.html',
  title: 'Planning & tarifs',
  description: 'Planning hebdomadaire des cours AK Dance à Mandres-les-Roses, tarifs, modalités d’inscription et cours d’essai gratuit.',
  hero: pageHero({ kicker: `Saison ${planning.saison}`, h1: 'Planning &amp; <em>tarifs</em>', lead: 'Les cours ont lieu du lundi au samedi, au 22-24 rue François Coppée.' }),
  body: `
<section class="section" id="planning">
  <div class="wrap">
    <h2 data-reveal>Planning hebdomadaire</h2>
    ${planningHtml()}
  </div>
</section>

<section class="section tint" id="tarifs">
  <div class="wrap">
    <h2 data-reveal>Tarifs</h2>
    <p class="callout" data-reveal>${esc(tarifs.avertissement)}</p>
    <div class="price-grid">
      <div data-reveal><h3 class="fam-title danse">Danse</h3>${priceTable(tarifs.danse)}</div>
      <div data-reveal><h3 class="fam-title well">Yoga &amp; pilates</h3>${priceTable(tarifs.bienEtre)}
        <h3 class="fam-title open">${esc(tarifs.coursOpen.titre)}</h3>
        <p><b>${tarifs.coursOpen.adherent} €</b> adhérent · <b>${tarifs.coursOpen.nonAdherent} €</b> non-adhérent<br><small>${esc(tarifs.coursOpen.detail)}</small></p>
      </div>
      <div data-reveal>
        <h3 class="fam-title">Adhésion</h3>
        <ul class="plain-list">${tarifs.adhesion.map((a) => `<li><b>${esc(a.prix)}</b> ${esc(a.label)}${a.detail ? `<br><small>${esc(a.detail)}</small>` : ''}</li>`).join('')}</ul>
        <h3 class="fam-title">${esc(tarifs.famille.titre)}</h3>
        <p><small>${esc(tarifs.famille.detail)}</small></p>
        <ul class="plain-list">${tarifs.famille.paliers.map((p) => `<li><b>${esc(p.prix)}</b> pour ${esc(p.membres)}</li>`).join('')}</ul>
      </div>
    </div>
  </div>
</section>

<section class="section" id="inscription">
  <div class="wrap two-col">
    <div data-reveal>
      <h2>S'inscrire</h2>
      <ol class="steps">${tarifs.inscription.etapes.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
      <p class="callout">${esc(tarifs.inscription.attente)}</p>
    </div>
    <div data-reveal class="essai-box">
      <h2>Cours d'essai</h2>
      <p>${esc(tarifs.essai)}</p>
      <a class="btn btn-primary" href="contact.html#essai">Réserver mon essai</a>
    </div>
  </div>
</section>`
});

const archivesHtml = events.archives.length ? events.archives.map((e) => eventCard(e, true)).join('') : '<p class="muted">Les éditions passées apparaîtront ici.</p>';
pages['evenements.html'] = layout({
  file: 'evenements.html',
  title: 'Événements & gala',
  description: 'Spectacle de fin d’année, stages, portes ouvertes et week-ends d’AK Dance à Mandres-les-Roses : prochains rendez-vous et archives.',
  hero: pageHero({ kicker: 'Vivre la danse', h1: 'Événements &amp; <em>gala</em>', lead: 'Spectacle, stages, week-ends, portes ouvertes : nos rendez-vous.' }),
  body: `
<section class="section">
  <div class="wrap">
    <h2 data-reveal>Prochains rendez-vous</h2>
    ${futureEvents.length ? futureEvents.map((e) => eventCard(e, false)).join('') : ''}
    <div class="wait-grid">
      <div class="wait" data-reveal><h3>Gala &amp; spectacle</h3><p>${esc(events.attente.gala)}</p></div>
      <div class="wait" data-reveal><h3>Stages</h3><p>${esc(events.attente.stages)}</p></div>
      <div class="wait" data-reveal><h3>Portes ouvertes</h3><p>${esc(events.attente.portesOuvertes)}</p></div>
    </div>
  </div>
</section>
<section class="section tint">
  <div class="wrap">
    <h2 data-reveal>Archives</h2>
    ${archivesHtml}
  </div>
</section>
${joinCta}`
});

pages['galerie.html'] = layout({
  file: 'galerie.html',
  title: 'Galerie',
  description: 'Photos et vidéos des cours, des spectacles et des stages d’AK Dance à Mandres-les-Roses.',
  hero: pageHero({ kicker: 'En images', h1: 'La <em>galerie</em>', lead: 'Cours, gala, stages, équipe : l’association en mouvement.', tone: 'mix' }),
  body: `
<section class="section">
  <div class="wrap">
    <div class="plan-tools" role="group" aria-label="Filtrer la galerie">
      <button class="pill is-on" data-gal-filter="all" type="button">Tout</button>
      ${gallery.categories.map((k) => `<button class="pill" data-gal-filter="${k.id}" type="button">${esc(k.label)}</button>`).join('')}
    </div>
    ${gallery.photos.length
      ? `<div class="masonry">${gallery.photos.map((p) => `<figure data-cat="${esc(p.categorie)}" data-reveal><button type="button" class="zoom" data-full="${esc(p.src)}" data-alt="${esc(p.alt)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy"></button>${p.credit ? `<figcaption>${esc(p.credit)}</figcaption>` : ''}</figure>`).join('')}</div>`
      : `<div class="masonry empty-gal">${gallery.categories.map((k, i) => `<figure class="ph ph${i % 4}" data-cat="${k.id}" data-reveal><div><span>${esc(k.label)}</span><small>Photos à ajouter</small></div></figure>`).join('')}</div>
         <p class="callout" data-reveal>Les photos de l'association arrivent bientôt. Pour l'instant, retrouvez-les sur <a href="${site.social.instagram}" target="_blank" rel="noopener">Instagram</a> et <a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a>.</p>`}
    <h2 data-reveal style="margin-top:3rem">Vidéos</h2>
    <div class="videos">${gallery.videos.map((v) => `<a class="video" data-cat="${esc(v.categorie)}" href="${esc(v.lien)}" target="_blank" rel="noopener" data-reveal><span class="play" aria-hidden="true">▶</span><b>${esc(v.titre)}</b><small>${esc(v.legende)}</small></a>`).join('')}</div>
  </div>
</section>
<div class="lightbox" id="lightbox" hidden><button type="button" class="lb-close" aria-label="Fermer">×</button><img alt=""></div>`
});

pages['actualites.html'] = layout({
  file: 'actualites.html',
  title: 'Actualités',
  description: 'Les dernières nouvelles d’AK Dance, association de danse et de bien-être à Mandres-les-Roses, et nos réseaux sociaux.',
  hero: pageHero({ kicker: 'Quoi de neuf ?', h1: 'Les <em>actualités</em>', lead: 'Nouveautés, annonces et coups de projecteur.', tone: 'mix' }),
  body: `
<section class="section">
  <div class="wrap two-col">
    <div class="news-list">${news.items.map(newsCard).join('')}</div>
    <aside class="social-box" data-reveal>
      <h2>Suivez-nous</h2>
      <p>Photos, vidéos, coulisses : l'actualité au jour le jour se passe sur nos réseaux.</p>
      <a class="btn btn-primary" href="${site.social.instagram}" target="_blank" rel="noopener">${icon.ig} Instagram</a>
      <a class="btn btn-ghost-dark" href="${site.social.facebook}" target="_blank" rel="noopener">${icon.fb} Facebook</a>
    </aside>
  </div>
</section>`
});

pages['contact.html'] = layout({
  file: 'contact.html',
  title: 'Nous rejoindre & contact',
  description: 'Rejoindre AK Dance à Mandres-les-Roses : cours d’essai gratuit, inscription, coordonnées et formulaire de contact.',
  hero: pageHero({ kicker: 'À bientôt !', h1: 'Nous <em>rejoindre</em>', lead: 'Cours d’essai gratuit, inscription, question : écrivez-nous ou appelez-nous.' }),
  body: `
<section class="section" id="essai">
  <div class="wrap two-col">
    <div data-reveal>
      <h2>Cours d'essai &amp; inscription</h2>
      <p>${esc(tarifs.essai)}</p>
      <ol class="steps">${tarifs.inscription.etapes.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
      <p class="callout">${esc(tarifs.inscription.attente)}</p>
      <h2 style="margin-top:2rem">Coordonnées</h2>
      <ul class="plain contact-list">
        <li>${icon.pin}<span>${esc(c.address)}<br>${esc(c.zip)} ${esc(c.city)}</span></li>
        <li>${icon.tel}<a href="tel:${c.phoneHref}">${esc(c.phone)}</a></li>
        <li>${icon.mail}<a href="mailto:${c.email}">${esc(c.email)}</a></li>
      </ul>
      <p class="muted">Présidente : ${esc(c.president)}</p>
    </div>
    <div data-reveal>
      <h2>Écrivez-nous</h2>
      <form class="form" name="contact" method="POST" action="merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="Message depuis le site AK Dance (%{submissionId})">
        <p class="hidden"><label>Ne pas remplir : <input name="bot-field" autocomplete="off" tabindex="-1"></label></p>
        <label>Votre nom<input type="text" name="nom" required autocomplete="name"></label>
        <label>Votre e-mail<input type="email" name="email" required autocomplete="email"></label>
        <label>Téléphone (facultatif)<input type="tel" name="telephone" autocomplete="tel"></label>
        <label>Votre demande
          <select name="sujet">
            <option>Cours d'essai gratuit</option>
            <option>Inscription</option>
            <option>Planning et tarifs</option>
            <option>Autre question</option>
          </select>
        </label>
        <label>Discipline qui vous intéresse (facultatif)<input type="text" name="discipline" placeholder="Ex. street-jazz, yoga…"></label>
        <label>Message<textarea name="message" rows="5" required></textarea></label>
        <button class="btn btn-primary" type="submit">Envoyer</button>
        <p class="muted">Vos données ne servent qu’à répondre à votre demande.</p>
      </form>
    </div>
  </div>
</section>
<section class="section tint" id="plan">
  <div class="wrap">
    <h2 data-reveal>Où nous trouver ?</h2>
    <p data-reveal>${esc(fullAddr)} · cours du lundi au samedi.</p>
    <div class="map" data-reveal>
      <iframe title="Carte : AK Dance, ${esc(fullAddr)}" loading="lazy" referrerpolicy="no-referrer"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${c.lon - 0.006}%2C${c.lat - 0.0035}%2C${c.lon + 0.006}%2C${c.lat + 0.0035}&amp;layer=mapnik&amp;marker=${c.lat}%2C${c.lon}"></iframe>
    </div>
    <p><a class="link-arrow" href="https://www.openstreetmap.org/?mlat=${c.lat}&amp;mlon=${c.lon}#map=17/${c.lat}/${c.lon}" target="_blank" rel="noopener">Ouvrir la carte en grand <span aria-hidden="true">→</span></a></p>
  </div>
</section>`
});

pages['mentions-legales.html'] = layout({
  file: 'mentions-legales.html',
  title: 'Mentions légales',
  description: 'Mentions légales du site d’AK Dance, association de danse et de bien-être à Mandres-les-Roses.',
  hero: pageHero({ kicker: 'Informations', h1: 'Mentions <em>légales</em>', lead: 'Éditeur, hébergeur, données personnelles.', tone: 'mix' }),
  body: `
<section class="section">
  <div class="wrap prose">
    <h2>Éditeur du site</h2>
    <p><strong>AK Dance</strong>, association régie par la loi du 1<sup>er</sup> juillet 1901.<br>Siège : ${esc(fullAddr)}.<br>Présidente et directrice de la publication : ${esc(c.president)}.<br>Contact : <a href="mailto:${c.email}">${esc(c.email)}</a> · ${esc(c.phone)}</p>
    <p>Numéro RNA / SIRET : <span class="tbc">à compléter par l'association</span></p>
    <h2>Hébergement</h2>
    <p>Netlify, Inc. · 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis · <a href="https://www.netlify.com" target="_blank" rel="noopener">netlify.com</a></p>
    <h2>Données personnelles</h2>
    <p>Les informations saisies dans le formulaire de contact (nom, e-mail, téléphone, message) sont utilisées uniquement pour répondre à votre demande. Elles sont traitées par l'association et conservées le temps nécessaire à cette réponse. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:${c.email}">${esc(c.email)}</a>.</p>
    <p>Le site n'utilise pas de cookies de suivi publicitaire. Il charge des polices depuis Google Fonts et, sur la page Contact, une carte OpenStreetMap.</p>
    <h2>Propriété intellectuelle &amp; images</h2>
    <p>Les textes, le nom et le logo d'AK Dance appartiennent à l'association. Les photographies publiées le sont avec l'accord des personnes représentées (et de leurs représentants légaux pour les mineurs). Pour demander le retrait d'une image, écrivez à <a href="mailto:${c.email}">${esc(c.email)}</a>.</p>
    <h2>Liens externes</h2>
    <p>Le site renvoie vers Instagram et Facebook. L'association n'est pas responsable du contenu de ces sites tiers.</p>
  </div>
</section>`
});

const merci = layout({
  file: 'merci.html',
  title: 'Message envoyé',
  description: 'Merci pour votre message : AK Dance vous répondra rapidement.',
  hero: pageHero({ kicker: 'Merci !', h1: 'Message <em>envoyé</em>', lead: 'Nous vous répondons dès que possible.' }),
  body: `<section class="section"><div class="wrap center"><p><a class="btn btn-primary" href="index.html">Retour à l'accueil</a></p></div></section>`
}).replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"');

const notFound = layout({
  file: '404.html',
  title: 'Page introuvable',
  description: 'Cette page n’existe pas.',
  hero: pageHero({ kicker: 'Oups', h1: 'Page <em>introuvable</em>', lead: 'On a dansé un peu trop loin…' }),
  body: `<section class="section"><div class="wrap center"><p><a class="btn btn-primary" href="/index.html">Retour à l'accueil</a></p></div></section>`
}).replace(/(href|src)="(assets\/[^"]+|[a-z-]+\.html)"/g, '$1="/$2"');

/* ---------- écriture ---------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'src', 'assets'), join(DIST, 'assets'), { recursive: true });
for (const [f, html] of Object.entries(pages)) writeFileSync(join(DIST, f), html);
writeFileSync(join(DIST, 'merci.html'), merci);
writeFileSync(join(DIST, '404.html'), notFound);

const urls = Object.keys(pages).map((f) => `  <url><loc>${site.url}/${f === 'index.html' ? '' : f}</loc></url>`).join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(DIST, '_headers'), `/assets/*\n  Cache-Control: public, max-age=3600\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`);
if (existsSync(join(ROOT, 'src', 'assets', 'img', 'galerie'))) { /* photos copiées avec assets */ }
console.log(`OK : ${Object.keys(pages).length + 2} pages générées dans dist/`);
