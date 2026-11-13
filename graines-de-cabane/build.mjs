// Construction du site statique Graines de Cabane.
// Usage : node build.mjs  (aucune dépendance). Résultat dans dist/
// Les pages sont dans src/pages : en-tête et pied de page sont ajoutés automatiquement.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const STATIC = path.join(ROOT, 'static');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://grainesdecabanes.org';
const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(STATIC, 'data', f), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- Icônes (traits arrondis, 24x24) ---------- */
const I = {
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="8" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="8" cy="16" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/>',
  puzzle: '<path d="M10 3h4v2.2a1.8 1.8 0 1 0 3.6 0V3H21v6h-2.2a1.8 1.8 0 1 0 0 3.6H21V21h-6v-2.2a1.8 1.8 0 1 0-3.6 0V21H3v-6h2.2a1.8 1.8 0 1 0 0-3.6H3V3h7z"/>',
  meeple: '<path d="M12 2.5a3.2 3.2 0 0 1 3.2 3.2c0 .8-.3 1.5-.7 2.1 2.6.6 6 1.8 6.5 3.4.4 1.2-1.7 1.8-4 2l2.8 6.3c.3.8-.2 1.5-1 1.5h-3.6L12 16.6 8.8 21H5.2c-.8 0-1.3-.7-1-1.5L7 13.2c-2.3-.2-4.4-.8-4-2 .5-1.6 3.9-2.8 6.5-3.4-.4-.6-.7-1.3-.7-2.1A3.2 3.2 0 0 1 12 2.5z"/>',
  pawn: '<circle cx="12" cy="6" r="3.2"/><path d="M9.5 10.5h5l1.5 6h-8z"/><path d="M6.5 20.5h11l-1-4h-9z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/><circle cx="8" cy="17.5" r="1" fill="currentColor"/><circle cx="12" cy="17.5" r="1" fill="currentColor"/>',
  pin: '<path d="M12 21.5s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9.5" r="2.6"/>',
  phone: '<path d="M5 3.5h3.2l1.6 4.4-2.1 1.4a11.5 11.5 0 0 0 7 7l1.4-2.1 4.4 1.6V19a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7a2 2 0 0 1 2-2.2z"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
  facebook: '<path d="M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2H7.5v3.5H10V22h3.5v-7.5H16l.5-3.5h-3V9a.5.5 0 0 1 .5-.5z" fill="currentColor" stroke="none"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  heart: '<path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11z"/>',
  hands: '<path d="M11 13.5l-2-2a2 2 0 0 0-2.8 2.8l3.8 3.8c1 1 2.2 1.4 3.6 1.4H17l3.5-3.5"/><path d="M12.5 8.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L13 15.4"/><path d="M3.5 13l2.7 2.7"/>',
  users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.5-3.5 3-5.6 6.2-5.6s5.7 2.1 6.2 5.6"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.2c2.6.2 4.3 2 4.7 4.8"/>',
  school: '<path d="M2.5 9.5L12 4.5l9.5 5-9.5 5z"/><path d="M6 11.5v4.5c1.6 1.6 3.8 2.5 6 2.5s4.4-.9 6-2.5v-4.5M21.5 9.5V15"/>',
  townhall: '<path d="M3 21h18M4.5 21V10M19.5 21V10M3 10l9-6 9 6z"/><path d="M8.5 21v-7M12 21v-7M15.5 21v-7"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6.5 10-8.5"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 12C12 8 9.5 5.5 5 5.5c0 4.5 2.5 6.5 7 6.5z"/><path d="M12 14c0-4 2.5-6.5 7-6.5 0 4.5-2.5 6.5-7 6.5z"/>',
  home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20"/><path d="M12 8.5C10.5 5 7.5 4.5 7 6.5s2.5 2 5 2zM12 8.5c1.5-3.5 4.5-4 5-2s-2.5 2-5 2z"/>',
  suitcase: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12.5h18"/><path d="M10.5 12.5v2h3v-2"/>',
  truck: '<path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3.5v3h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  recycle: '<path d="M7.5 19.5H5a2 2 0 0 1-1.7-3l2.2-3.8M10.5 5.6l1-1.7a2 2 0 0 1 3.4 0l2 3.4"/><path d="M16.5 19.5H19a2 2 0 0 0 1.7-3l-1.4-2.4"/><path d="M9 21.5l-1.5-2 1.5-2M14 6.5l3 .8.8-3M4 10.5l1.5 2.2 2.4-.8"/><path d="M12 19.5h4.5"/>',
  sparkles: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5 15.5l.6 1.4 1.4.6-1.4.6L5 19.5l-.6-1.4-1.4-.6 1.4-.6z"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5l1-1-2.5-2.5L20 6l-2.5-2.5-2 2-1 1z"/><path d="M14.5 9.5l-10 10a1.8 1.8 0 0 0 2.5 2.5l10-10"/>',
  plane: '<path d="M21 4.5c-.8-.8-2.2-.6-3 .2l-3.6 3.6L5 5.5 3.5 7l7.3 4.4-3.3 3.3-2.8-.4-1.2 1.2 3.5 2 2 3.5 1.2-1.2-.4-2.8 3.3-3.3L17 21l1.5-1.5-2.8-9.4 3.6-3.6c.8-.8 1-2.2.2-3z"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.8.7 1.1 1.5 1.1 2.7h5c0-1.2.3-2 1.1-2.7A6 6 0 0 0 12 3z"/>',
  store: '<path d="M3.5 9.5L5 4.5h14l1.5 5"/><path d="M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.8 0"/><path d="M5 12v8.5h14V12M10 20.5v-5h4v5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1.2-1.6-1.2-2.8 0-1 .8-1.8 1.9-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10" cy="7.3" r="1.2" fill="currentColor"/><circle cx="14.5" cy="7.3" r="1.2" fill="currentColor"/>',
  baby: '<circle cx="12" cy="8" r="4.5"/><path d="M10.4 8.3h.1M13.5 8.3h.1M10.5 10.3c.9.6 2.1.6 3 0"/><path d="M6 21c.5-3.6 3-5.8 6-5.8s5.5 2.2 6 5.8"/>',
  cup: '<path d="M4.5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z"/><path d="M16.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.8M8 3.5c-.8 1 .8 2-.1 3M11.5 3.5c-.8 1 .8 2-.1 3"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>',
  hammer: '<path d="M14 5.5l4.5 4.5M11.5 8l4.5 4.5M10 4l6-1.5L21.5 8 20 13.5 15.5 9"/><path d="M13 10.5l-9 9a1.8 1.8 0 0 0 2.5 2.5l9-9"/>',
  box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
  building: '<rect x="4.5" y="3" width="15" height="18" rx="1.5"/><path d="M9 7h1.5M13.5 7H15M9 11h1.5M13.5 11H15M9 15h1.5M13.5 15H15M10.5 21v-3h3v3"/>',
  senior: '<circle cx="11" cy="5" r="2.4"/><path d="M10 9.5l-2.5 5 2.5 1.5L9 21M11.5 9.5l1.8 4.5 2.7 1M16.5 13v8"/>',
  party: '<path d="M4 20.5l4.8-13 8.2 8.2z"/><path d="M14 4.5c.6 1.3.2 2.6-1 3.2M17.5 9c1.4-.4 2.6.3 3 1.5M18 4l.5 1.5M20.5 6.5L19 7"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
  download: '<path d="M12 3.5v12M7 11l5 5 5-5M4.5 20.5h15"/>',
  boat: '<path d="M3 17.5h18l-2.5 3.5h-13zM12 3v12M12 3l6.5 11H12M12 6L6.5 14H12"/>',
  scale: '<path d="M12 3.5v17M5 20.5h14M5.5 7.5h13M5.5 7.5L3 13.5a3 3 0 0 0 5 0zM18.5 7.5L16 13.5a3 3 0 0 0 5 0z"/>',
  idea: '<path d="M12 2.5v2M4.6 5.6l1.4 1.4M19.4 5.6L18 7M2.5 12.5h2M19.5 12.5h2"/><path d="M8 15.5a5 5 0 1 1 8 0c-.8.9-1 1.6-1 2.5H9c0-.9-.2-1.6-1-2.5zM9.5 21h5"/>'
};
const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[name] || I.dice}</svg>`;

/* Pièces de jeu illustrées (héros, décor) */
const PIECES = {
  pawn: (c) => `<svg viewBox="0 0 60 80" aria-hidden="true"><circle cx="30" cy="16" r="12" fill="${c}"/><path d="M21 30h18l6 26H15z" fill="${c}"/><rect x="8" y="56" width="44" height="12" rx="6" fill="${c}"/><circle cx="25" cy="12" r="4" fill="#fff" opacity=".45"/></svg>`,
  die: (c) => `<svg viewBox="0 0 70 70" aria-hidden="true"><rect x="5" y="5" width="60" height="60" rx="14" fill="${c}"/><g fill="#fff"><circle cx="20" cy="20" r="5.5"/><circle cx="50" cy="20" r="5.5"/><circle cx="35" cy="35" r="5.5"/><circle cx="20" cy="50" r="5.5"/><circle cx="50" cy="50" r="5.5"/></g></svg>`,
  puzzle: (c) => `<svg viewBox="0 0 80 80" aria-hidden="true"><path fill="${c}" d="M28 6h14v8a7 7 0 1 0 14 0V6h18v24h-8a7 7 0 1 0 0 14h8v30H50v-8a7 7 0 1 0-14 0v8H6V46h8a7 7 0 1 0 0-14H6V6z"/></svg>`,
  meeple: (c) => `<svg viewBox="0 0 80 80" aria-hidden="true"><path fill="${c}" d="M40 4a11 11 0 0 1 11 11c0 3-1 5-2.4 7 8.7 2 20 6 21.6 11.5 1.3 4-5.7 6-13.4 6.6l9.4 21.2c1 2.6-.6 5-3.3 5H51L40 56 29 66.3H17.1c-2.7 0-4.3-2.4-3.3-5l9.4-21.2C15.5 39.5 8.5 37.5 9.8 33.5 11.4 28 22.7 24 31.4 22 30 20 29 18 29 15A11 11 0 0 1 40 4z"/></svg>`
};

const BLOB_PATHS = [
  'M42.7,-63.4C54.3,-56.6,61.7,-42.3,68.1,-27.5C74.5,-12.6,80,2.9,76.4,16.3C72.9,29.7,60.3,41,47,50.6C33.6,60.2,19.6,68.1,3.7,71.4C-12.2,74.6,-30,73.2,-43.3,64.6C-56.5,56,-65.2,40.1,-70,23.4C-74.8,6.7,-75.7,-10.9,-69.4,-25.1C-63.1,-39.3,-49.5,-50.2,-35.5,-56.8C-21.5,-63.4,-7.1,-65.8,7.7,-69.3C22.6,-72.9,31.1,-70.3,42.7,-63.4Z',
  'M38.5,-58.6C50.9,-52.2,62.6,-43,68.5,-30.8C74.4,-18.6,74.4,-3.3,70.6,10.5C66.9,24.3,59.3,36.6,48.8,46.9C38.3,57.2,24.9,65.5,10.1,68.9C-4.7,72.3,-20.9,70.7,-34.4,63.9C-47.9,57.1,-58.7,45.1,-64.3,31.2C-69.9,17.3,-70.3,1.6,-66.6,-12.6C-62.9,-26.8,-55.2,-39.5,-44,-46.9C-32.8,-54.3,-18.2,-56.4,-3.6,-51.6C11,-46.9,26.1,-65,38.5,-58.6Z',
  'M45.7,-64.6C57.8,-57.1,64.6,-41,68.5,-25.4C72.5,-9.8,73.6,5.4,69.6,19.4C65.6,33.4,56.5,46.2,44.2,55.9C31.9,65.5,16,72,-0.9,73.2C-17.7,74.4,-35.4,70.3,-47.8,60.2C-60.2,50.1,-67.3,34,-71.2,17.3C-75.1,0.6,-75.8,-16.7,-69.1,-30.4C-62.5,-44.1,-48.5,-54.2,-34.3,-60.9C-20.1,-67.7,-5.6,-71,8.9,-71C23.4,-71,33.7,-72.1,45.7,-64.6Z',
  'M39.8,-59.6C51.3,-52.9,60.1,-41.3,66.5,-28.1C72.9,-14.9,76.8,0,72.5,12.4C68.2,24.8,55.6,34.7,43.9,45.4C32.2,56.1,21.3,67.6,7.6,71.3C-6.1,75,-22.7,70.9,-36.3,62.4C-49.9,53.9,-60.6,41,-66.8,26.3C-73,11.6,-74.7,-4.9,-69.4,-18.4C-64.1,-31.9,-51.9,-42.5,-39,-49.9C-26.1,-57.3,-13.1,-61.6,0.9,-62.9C14.9,-64.2,28.3,-66.3,39.8,-59.6Z'
];
const blob = (i, style, cls = 'floaty') => `<div class="blob ${cls}" style="${style}"><svg viewBox="0 0 200 200"><path fill="currentColor" d="${BLOB_PATHS[i % 4]}" transform="translate(100 100)"/></svg></div>`;
const DECORS = {
  a: blob(0, 'left:-6rem;top:-5rem;--c:var(--lime);--o:.32') + blob(1, 'right:-4rem;top:6rem;--s:16rem;--c:var(--turq);--o:.18', 'floaty-2') + blob(2, 'left:35%;bottom:-6rem;--s:11rem;--c:var(--sun);--o:.28', 'floaty-3'),
  b: blob(2, 'right:-6rem;top:-4rem;--c:var(--coral);--o:.16') + blob(3, 'left:-5rem;bottom:-3rem;--c:var(--wood);--o:.22', 'floaty-2'),
  c: blob(1, 'left:-5rem;top:20%;--s:14rem;--c:var(--lime);--o:.25', 'floaty-2') + blob(0, 'right:-5rem;bottom:-4rem;--s:15rem;--c:var(--sun);--o:.22'),
  d: blob(3, 'right:8%;top:-5rem;--s:13rem;--c:var(--lime);--o:.25') + blob(2, 'left:-4rem;bottom:-5rem;--s:15rem;--c:var(--turq);--o:.14', 'floaty-3'),
  w: blob(0, 'right:-5rem;top:-6rem;--c:#fff;--o:.1') + blob(2, 'left:-5rem;bottom:-6rem;--c:var(--lime);--o:.25', 'floaty-2')
};
const decor = (v) => `<div class="decor" aria-hidden="true">${DECORS[v] || DECORS.a}</div>`;
const wave = (color, bottom = false) => `<svg class="wave${bottom ? ' wave--bottom' : ''}" style="--c:${color}" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true"><path d="M0,18 C120,40 260,4 420,14 C560,23 600,34 760,30 C930,26 1010,6 1180,12 C1290,16 1370,30 1440,22 L1440,48 L0,48 Z"/><path d="M0,30 C180,46 300,26 520,34 C700,40 880,44 1060,36 C1200,30 1330,40 1440,34 L1440,48 L0,48 Z" opacity=".55"/></svg>`;

/* ---------- Navigation ---------- */
const NAV = [
  ['accueil', 'index.html', 'Accueil'],
  ['association', 'association.html', "L'association"],
  ['animations', 'animations.html', 'Animations'],
  ['jeux', 'nos-jeux.html', 'Nos jeux'],
  ['agenda', 'agenda.html', 'Agenda'],
  ['adherer', 'adherer.html', 'Adhérer'],
  ['galerie', 'galerie.html', 'Galerie'],
  ['contact', 'contact.html', 'Contact']
];

const header = (active) => `
<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Graines de Cabane, retour à l'accueil">
      <img src="images/logo-gdc.png" alt="Graines de Cabanes, pour que le jeu devienne rencontre" width="640" height="294">
    </a>
    <nav class="main-nav" id="menu-principal" aria-label="Menu principal" data-nav>
      <ul>
        ${NAV.map(([k, href, label]) => `<li><a href="${href}"${k === active ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n        ')}
        <li class="nav-cta-mobile"><a href="contact.html">Nous contacter</a></li>
      </ul>
    </nav>
    <a class="btn btn--coral btn--sm header-cta" href="contact.html">${icon('mail')}Nous contacter</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Ouvrir le menu" data-burger><span></span><span></span><span></span></button>
  </div>
</header>`;

const footer = () => `
<footer class="site-footer">
  ${wave('var(--navy)')}
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="footer-logo" href="index.html"><img src="images/logo-gdc.png" alt="Graines de Cabanes" width="640" height="294" loading="lazy"></a>
        <p class="footer-baseline">Pour que le jeu devienne rencontre</p>
        <p class="small">Jouer aujourd'hui pour un demain solidaire. Animations, prêts et locations, créations de jeux en bois, collecte et réemploi solidaire des jeux.</p>
        <a class="fb-link" href="https://www.facebook.com/p/Graines-De-Cabane-100087526808549/" target="_blank" rel="noopener">${icon('facebook')}Graines de Cabane sur Facebook</a>
      </div>
      <div>
        <h2>Nous trouver</h2>
        <ul>
          <li><strong>Siège :</strong> Pôle SEVA, 21 place Plaisance, 40230 Saint-Vincent-de-Tyrosse</li>
          <li><a href="tel:+33677797727">06 77 79 77 27</a> · <a href="tel:+33650617677">06 50 61 76 77</a></li>
          <li><a href="mailto:grainesde@hotmail.fr">grainesde@hotmail.fr</a></li>
        </ul>
      </div>
      <div>
        <h2>Permanences</h2>
        <ul>
          <li>1 samedi sur 2, de 9h30 à 12h30</li>
          <li>Salle Tourren, 2 rue du Grand Tourren, Saint-Vincent-de-Tyrosse</li>
          <li>À côté de Canopé et de la Croix-Rouge</li>
          <li><a href="agenda.html#prochain-rendez-vous">Prochain rendez-vous : <span data-next-rdv="short">voir l'agenda</span></a></li>
        </ul>
      </div>
      <div>
        <h2>Le site</h2>
        <ul>
          ${NAV.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}
          <li><a href="seconde-vie.html">Seconde vie des jeux</a></li>
          <li><a href="ambassadeur.html">Devenir ambassadeur</a></li>
          <li><a href="point-de-recolte.html">Devenir point de récolte</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Association loi 1901, agréée ESS, affiliée à la Ligue de l'enseignement. SIREN 538 620 303.</p>
      <nav aria-label="Informations légales"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a></nav>
    </div>
  </div>
</footer>
<dialog class="lightbox" id="lightbox" aria-label="Visionneuse d'images">
  <button class="dlg-close" type="button" data-close aria-label="Fermer">${icon('close')}</button>
  <button class="lb-nav lb-prev" type="button" data-lb-prev aria-label="Image précédente" hidden>${icon('left')}</button>
  <button class="lb-nav lb-next" type="button" data-lb-next aria-label="Image suivante" hidden>${icon('right')}</button>
  <figure><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt=""><figcaption></figcaption></figure>
</dialog>`;

const LD_ORG = {
  '@context': 'https://schema.org', '@type': ['LocalBusiness', 'NGO'], name: 'Graines de Cabane', alternateName: ['Graines de Cabanes', 'GDC'],
  description: "Association de jeux solidaires : animations, prêts et locations de jeux, créations de jeux en bois, collecte et réemploi solidaire des jeux, à Saint-Vincent-de-Tyrosse (Landes).",
  url: SITE_URL + '/', logo: SITE_URL + '/images/logo-gdc.png', image: SITE_URL + '/images/hero.jpg',
  telephone: '+33677797727', email: 'grainesde@hotmail.fr', foundingDate: '2010-05-26', slogan: 'Pour que le jeu devienne rencontre',
  address: { '@type': 'PostalAddress', streetAddress: '21 place Plaisance, Pôle SEVA', postalCode: '40230', addressLocality: 'Saint-Vincent-de-Tyrosse', addressRegion: 'Landes', addressCountry: 'FR' },
  geo: { '@type': 'GeoCoordinates', latitude: 43.6603, longitude: -1.3058 },
  areaServed: ['Landes', 'Nouvelle-Aquitaine', 'France'],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:30', closes: '12:30', description: 'Permanences ludiques un samedi sur deux, salle Tourren' }],
  sameAs: ['https://www.facebook.com/p/Graines-De-Cabane-100087526808549/'], identifier: 'SIREN 538620303'
};

/* ---------- Contenus générés depuis les données ---------- */
function gamesGrid() {
  const { jeux } = readJSON('grands-jeux.json');
  return `<ol class="games-grid" aria-label="Les ${jeux.length} grands jeux en bois">${jeux.map((j, i) => `
  <li class="game reveal-pop" style="--d:${(i % 6) * 0.05}s"><img src="${j.photo}" alt="${esc(j.nom)}, grand jeu en bois n° ${j.numero}" width="800" height="600" loading="lazy"><span class="g-num">${j.numero}</span><h3>${esc(j.nom)}</h3></li>`).join('')}
</ol>`;
}
function gamesChoices() {
  const { jeux } = readJSON('grands-jeux.json');
  return jeux.map((j) => `<label class="choice"><input type="checkbox" value="${j.numero}. ${esc(j.nom)}" data-game><span>${j.numero}. ${esc(j.nom)}</span></label>`).join('');
}
function lieuxList() {
  const { communes } = readJSON('lieux-recolte.json');
  return `<div class="lieux">${communes.map((c, i) => `
  <article class="card lieu reveal" style="--d:${i * 0.07}s"><div class="pin-num"><span>${i + 1}</span></div><div><h3>À ${esc(c.commune)}</h3><ul>${c.lieux.map((l) => `<li>${esc(l)}</li>`).join('')}</ul></div></article>`).join('')}
</div>`;
}
function worldMap(opts = '') {
  const { pays } = readJSON('pays.json');
  const conts = [...new Set(pays.map((p) => p.continent))];
  const colors = { 'Amérique du Sud': 'var(--coral)', Afrique: 'var(--sun)', Europe: 'var(--turq)' };
  return `<div class="world-map" data-world-map ${opts}>
  <div class="world-wrap"><div class="world-holder" aria-hidden="true"></div><div class="zoom-europe" aria-hidden="true"><span class="label">Zoom Europe</span></div></div>
  <p class="world-count" aria-live="polite"><b data-world-count>${pays.length}</b> pays où nos jeux ont déjà trouvé de nouveaux joueurs</p>
  <div class="legend-grid">${conts.map((c) => `
    <div class="card legend-card" data-cont="${esc(c)}" style="--cf:${colors[c] || 'var(--lime)'}"><h3>${esc(c)}</h3><ul>${pays.filter((p) => p.continent === c).map((p) => `<li data-iso="${p.iso}">${esc(p.nom)}</li>`).join('')}</ul></div>`).join('')}
  </div>
</div>`;
}
const honeypot = `<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>`;
const piece = (type, color, style) => `<div class="piece" data-parallax style="${style}">${PIECES[type](color)}</div>`;

/* ---------- Gabarit ---------- */
function layout(meta, body) {
  const canonical = SITE_URL + (meta.slug === 'index' ? '/' : '/' + meta.slug);
  const title = meta.slug === 'index' ? meta.title : `${meta.title} | Graines de Cabane`;
  const ld = [meta.slug === 'index' || meta.slug === 'contact' ? LD_ORG : null, ...(meta.ld || [])].filter(Boolean);
  return `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
${meta.slug === '404' ? '<base href="/">\n' : ''}<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#1F3A63">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Graines de Cabane">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE_URL}/images/${meta.ogImage || 'og-graines-de-cabane.jpg'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="images/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="images/favicon.png">
<link rel="preload" href="fonts/fredoka.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.replace('no-js','js');</script>
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
<script src="js/main.js" defer></script>
</head>
<body class="page-${meta.slug}">
${header(meta.nav)}
<main id="contenu" tabindex="-1">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function render(content) {
  return content
    .replace(/\{\{icon:([a-z]+)(?::([\w-]+))?\}\}/g, (_, n, c) => icon(n, c || ''))
    .replace(/\{\{decor:(\w)\}\}/g, (_, v) => decor(v))
    .replace(/\{\{wave:([^}|]+)(\|bottom)?\}\}/g, (_, c, b) => wave(c, !!b))
    .replace(/\{\{piece:(\w+):([^:]+):([^}]+)\}\}/g, (_, t, c, s) => piece(t, c, s))
    .replace(/\{\{pieceart:(\w+):([^}]+)\}\}/g, (_, t, c) => PIECES[t](c))
    .replace(/\{\{grands-jeux-grid\}\}/g, gamesGrid)
    .replace(/\{\{grands-jeux-choices\}\}/g, gamesChoices)
    .replace(/\{\{lieux-list\}\}/g, lieuxList)
    .replace(/\{\{world-map(?::([^}]*))?\}\}/g, (_, o) => worldMap(o || ''))
    .replace(/\{\{honeypot\}\}/g, honeypot)
    .replace(/\{\{nb-jeux\}\}/g, () => String(readJSON('grands-jeux.json').jeux.length));
}

/* ---------- Construction ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(STATIC, DIST, { recursive: true });
const pages = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html'));
const sitemap = [];
for (const file of pages) {
  const raw = fs.readFileSync(path.join(SRC, 'pages', file), 'utf8');
  const m = raw.match(/^<!--META\s*([\s\S]*?)-->/);
  if (!m) throw new Error('META manquant dans ' + file);
  const meta = { slug: file.replace('.html', ''), ...JSON.parse(m[1]) };
  const html = layout(meta, render(raw.slice(m[0].length)));
  if (/\{\{[a-z-]+/.test(html)) throw new Error('Jeton non remplacé dans ' + file + ' : ' + html.match(/\{\{[^}]*\}\}/)[0]);
  fs.writeFileSync(path.join(DIST, file), html);
  if (!meta.noindex) sitemap.push({ loc: SITE_URL + (meta.slug === 'index' ? '/' : '/' + meta.slug), p: meta.priority || '0.7' });
}
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((u) => `  <url><loc>${u.loc}</loc><changefreq>weekly</changefreq><priority>${u.p}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`${pages.length} pages construites dans dist/`);
