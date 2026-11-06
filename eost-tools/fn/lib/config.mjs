// Pages modifiables depuis l'espace administrateur (identiques en français et en breton).
export const PAGES = [
  { key: 'index', fr: 'Accueil', br: 'Degemer' },
  { key: 'association', fr: "L'association", br: 'Ar gevredigezh' },
  { key: 'activites', fr: 'Activités', br: 'Oberiantizoù' },
  { key: 'agenda', fr: 'Agenda', br: 'Deiziataer' },
  { key: 'galerie', fr: 'Galerie', br: 'Skeudennoù' },
  { key: 'actualites', fr: 'Actualités et ressources', br: 'Keleier ha danvezioù' },
  { key: 'adherer', fr: 'Adhérer / Contact', br: 'Emezelañ / Darempred' },
  { key: 'mentions-legales', fr: 'Mentions légales', br: 'Menegoù lezennel' },
  { key: 'merci', fr: 'Remerciement après envoi du formulaire', br: 'Trugarez goude kas ar follenn' },
];
// Pages servies par la fonction « page » : toutes sont modifiables.
export const SERVED = PAGES.map((p) => p.key);
export const LANGS = ['fr', 'br'];

export const isLang = (l) => LANGS.includes(l);
export const isPage = (p) => SERVED.includes(p);
export const isEditable = (p) => PAGES.some((x) => x.key === p);

export const env = (k, d = '') => (typeof process !== 'undefined' && process.env && process.env[k]) || d;

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });
