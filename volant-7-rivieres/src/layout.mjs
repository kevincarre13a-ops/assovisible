// Gabarit commun : en-tête fixe, menu, pied de page, pastilles et vagues.
export const NAV = [
  { href: 'index.html', label: 'Accueil' },
  { href: 'le-club.html', label: 'Le club' },
  { href: 'creneaux-tarifs.html', label: 'Créneaux & tarifs' },
  { href: 'tournois-evenements.html', label: 'Tournois & événements', short: 'Tournois' },
  { href: 'resultats-competitions.html', label: 'Résultats & compétitions', short: 'Résultats' },
  { href: 'galerie.html', label: 'Galerie' },
  { href: 'actualites.html', label: 'Actualités' },
  { href: 'contact.html', label: 'Nous rejoindre / Contact', short: 'Nous rejoindre' },
  { href: 'mentions-legales.html', label: 'Mentions légales', minor: true }
];

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const wave = (cls = '', variant = 1) => {
  const paths = [
    'M0,64 C180,110 360,20 600,56 C840,92 1020,18 1200,62 L1200,120 L0,120 Z',
    'M0,40 C200,0 400,100 640,60 C880,20 1040,90 1200,40 L1200,120 L0,120 Z'
  ];
  return `<svg class="wave ${cls}" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${paths[variant - 1]}"/></svg>`;
};

export function makeImg(meta) {
  return (name, alt = '', { cls = '', lazy = true, sizes = '', eager = false } = {}) => {
    const d = meta[name];
    const wh = d ? ` width="${d[0]}" height="${d[1]}"` : '';
    return `<img src="assets/img/${name}"${wh} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : lazy ? ' loading="lazy"' : ''} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
  };
}

export function layout({ site, page, body, meta }) {
  const current = page.file;
  const fullNav = NAV.map(n => {
    const active = n.href === current;
    return `<li><a href="${n.href}"${active ? ' aria-current="page"' : ''}><span class="l-full">${esc(n.label)}</span><span class="l-short" aria-hidden="true">${esc(n.short || n.label)}</span></a></li>`;
  }).join('');
  const url = `${site.siteUrl}/${page.file === 'index.html' ? '' : page.file}`;
  const title = page.file === 'index.html' ? `${site.name} · Club de badminton à Courthézon, Bédarrides et Châteauneuf-du-Pape` : `${page.title} · ${site.name}`;
  const c = site.contact;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="theme-color" content="#062a40">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="assets/img/volant.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.siteUrl}/assets/img/og.jpg">
<script>document.documentElement.classList.add("js")</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&family=Barlow:wght@400;500;600&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SportsClub', name: site.name, sport: 'Badminton', foundingDate: String(site.founded), email: c.email, telephone: c.phone, address: { '@type': 'PostalAddress', streetAddress: 'Boulevard Jean Henri Fabre', postalCode: '84350', addressLocality: 'Courthézon', addressCountry: 'FR' }, sameAs: site.socials.map(s => s.url), url: site.siteUrl })}</script>
</head>
<body class="page-${page.slug}">
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="header" id="header">
  <div class="container header__in">
    <a class="brand" href="index.html" aria-label="${esc(site.name)} : accueil">
      <img class="brand__logo" src="assets/img/logo-vr.png" width="600" height="395" alt="" decoding="async">
      <span class="brand__txt"><span class="brand__l1">Le Volant des</span><span class="brand__l2">7 Rivières</span></span>
    </a>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <ul class="nav__list">${fullNav}</ul>
    </nav>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  </div>
</header>
<main id="contenu">
${body}
</main>
<footer class="footer">
  ${wave('wave--footer', 2)}
  <div class="footer__main">
    <div class="container footer__grid">
      <div class="footer__brand">
        <img src="assets/img/logo-vr.png" width="600" height="395" alt="" class="footer__logo" loading="lazy">
        <p class="footer__name">${esc(site.name)}</p>
        <p class="footer__base">${esc(site.baseline)}</p>
        <ul class="social">${site.socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="footer__h">Nous joindre</h2>
        <address>
          <a href="mailto:${c.email}">${c.email}</a><br>
          <a href="tel:${c.phoneHref}">${c.phone}</a><br>
          ${esc(c.address)}
        </address>
        <p class="footer__small">Jeu libre : mercredi 18h30 – 20h30, ${esc(site.gym.name)}, ${esc(site.gym.town)}.</p>
      </div>
      <div>
        <h2 class="footer__h">Le site</h2>
        <ul class="footer__links">${NAV.map(n => `<li><a href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="footer__h">Partenaires</h2>
        <ul class="footer__links">${site.partners.map(p => `<li><a href="${p.url}" target="_blank" rel="noopener">${esc(p.name)}</a></li>`).join('')}${site.federation.map(p => `<li><a href="${p.url}" target="_blank" rel="noopener">${esc(p.label)}</a></li>`).join('')}</ul>
      </div>
    </div>
    <div class="container footer__bar">
      <span>© ${new Date().getFullYear()} ${esc(site.name)}, association loi 1901</span>
      <a href="mentions-legales.html">Mentions légales</a>
      <span>Maquette réalisée par AssoVisible</span>
    </div>
  </div>
</footer>
<script src="assets/js/main.js" defer></script>
${page.script ? `<script src="assets/js/${page.script}" defer></script>` : ''}
</body>
</html>`;
}
