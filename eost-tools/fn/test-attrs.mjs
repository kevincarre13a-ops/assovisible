import fs from 'node:fs';
import { sanitizeFragment } from './lib/sanitize.mjs';
const root = new URL('../../eost-site/', import.meta.url).pathname;
const names = (h) => { const m = {}; for (const t of h.matchAll(/\s([a-zA-Z:-]+)=("[^"]*"|'[^']*')/g)) { const k = t[1] + '=' + t[2].slice(0, 60); m[k] = (m[k] || 0) + 1; } return m; };
for (const f of ['association.html','br/association.html','br/adherer.html']) {
  const src = fs.readFileSync(root + f, 'utf8').match(/<main id="main">([\s\S]*)<\/main>/)[1];
  const a = names(src), b = names(sanitizeFragment(src));
  for (const k of Object.keys(a)) if (a[k] !== b[k]) console.log(f, 'perdu :', k, a[k], '->', b[k] || 0);
}
