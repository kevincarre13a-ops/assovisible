// Génère le site statique dans ./dist à partir de /data (JSON), /src (gabarits) et /assets.
// Usage : node build.mjs
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout, makeImg } from './src/layout.mjs';
import { PAGES } from './src/pages.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const readJson = f => JSON.parse(readFileSync(join(root, f), 'utf8'));

const site = readJson('data/site.json');
const data = {};
for (const f of readdirSync(join(root, 'data'))) if (f.endsWith('.json') && f !== 'site.json') data[f.replace('.json', '')] = readJson(`data/${f}`);
const img = makeImg(readJson('src/imgmeta.json'));

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });

for (const p of PAGES) {
  const built = p.build({ site, data, img });
  const page = { ...p, ...built };
  let html = layout({ site, page, body: built.body });
  if (built.noindex) html = html.replace('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"');
  writeFileSync(join(dist, p.file), html);
}

const urls = PAGES.filter(p => !p.hidden).map(p => `  <url><loc>${site.siteUrl}/${p.file === 'index.html' ? '' : p.file}</loc></url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
console.log(`✔ ${PAGES.length} pages générées dans dist/`);
