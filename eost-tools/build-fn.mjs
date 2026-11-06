// Assemble les fonctions Netlify (fichiers autonomes) et la configuration des pages.
//   node build.cjs && node build-fn.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { SERVED } from './fn/lib/config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(here, '..', 'eost-site');
const fnOut = path.join(site, 'netlify', 'functions');
fs.mkdirSync(fnOut, { recursive: true });

// 1. HTML d'origine de chaque page (embarqué dans la fonction « page »)
const pages = {};
for (const lang of ['fr', 'br']) {
  for (const key of SERVED) {
    const file = path.join(site, lang === 'br' ? 'br' : '', key === 'index' ? 'index.html' : `${key}.html`);
    pages[`${lang}:${key}`] = fs.readFileSync(file, 'utf8');
  }
}
fs.writeFileSync(path.join(here, 'fn', 'pages.generated.json'), JSON.stringify(pages));

// 2. Fonctions autonomes
for (const old of fs.readdirSync(fnOut)) fs.rmSync(path.join(fnOut, old), { force: true });
const banner = "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);";
for (const name of ['page', 'media', 'contact', 'admin-api']) {
  await build({
    entryPoints: [path.join(here, 'fn', `${name}.mjs`)],
    outfile: path.join(fnOut, `${name}.mjs`),
    bundle: true, platform: 'node', format: 'esm', target: 'node20', minify: false, legalComments: 'none', banner: { js: banner },
    logLevel: 'warning',
  });
}

// 3. Espace administrateur (fichiers statiques)
const adminSrc = path.join(here, 'admin-src');
if (fs.existsSync(adminSrc)) {
  fs.mkdirSync(path.join(site, 'admin'), { recursive: true });
  for (const f of fs.readdirSync(adminSrc)) fs.copyFileSync(path.join(adminSrc, f), path.join(site, 'admin', f));
}

// 4. Configuration Netlify : aiguillage des pages vers la fonction « page »
const rules = [];
const add = (from, to) => rules.push(`[[redirects]]\n  from = "${from}"\n  to = "${to}"\n  status = 200\n  force = true\n`);
for (const key of SERVED) {
  const fr = `/.netlify/functions/page?l=fr&p=${key}`, br = `/.netlify/functions/page?l=br&p=${key}`;
  if (key === 'index') { add('/', fr); add('/index.html', fr); add('/index', fr); add('/br', br); add('/br/', br); add('/br/index.html', br); add('/br/index', br); }
  else { add(`/${key}`, fr); add(`/${key}.html`, fr); add(`/br/${key}`, br); add(`/br/${key}.html`, br); }
}
add('/media/*', '/.netlify/functions/media?f=:splat');
const toml = `# Fichier généré par eost-tools/build-fn.mjs : ne pas modifier à la main.
[build]
  publish = "."

[functions]
  directory = "netlify/functions"

# Le code des fonctions n'a pas à être servi comme page du site.
[[redirects]]
  from = "/netlify/*"
  to = "/404.html"
  status = 404
  force = true

# Pages du site : servies par la fonction « page » (contenu d'origine + modifications de l'espace administrateur).
${rules.join('\n')}
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow"
    Cache-Control = "no-store"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "same-origin"
`;
fs.writeFileSync(path.join(site, 'netlify.toml'), toml);
fs.writeFileSync(path.join(site, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://eost-telgruc.fr/sitemap.xml\n');
console.log('fonctions :', fs.readdirSync(fnOut).join(', '));
