#!/usr/bin/env node
// Génère flashcards/index.html (fichier unique, utilisable hors ligne) à partir de :
//   - src/template.html   (interface)
//   - data/cards.json     (toutes les cartes)
//   - data/collections.json (thèmes, catégories, libellés)
// Usage : node flashcards/build.cjs
const fs = require('fs');
const path = require('path');
const root = __dirname;
const tpl = fs.readFileSync(path.join(root, 'src/template.html'), 'utf8');
const cards = JSON.parse(fs.readFileSync(path.join(root, 'data/cards.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(root, 'data/collections.json'), 'utf8'));

// contrôles de cohérence
const colIds = new Set(meta.collections.map(c => c.id));
const ids = new Set();
for (const c of cards) {
  if (!colIds.has(c.col)) throw new Error(`Carte ${c.id}: collection inconnue ${c.col}`);
  const col = meta.collections.find(x => x.id === c.col);
  if (!(c.deck >= 1 && c.deck <= col.decks.length)) throw new Error(`Carte ${c.id}: catégorie ${c.deck} hors limites`);
  if (ids.has(c.id)) throw new Error(`Identifiant en double: ${c.id}`);
  ids.add(c.id);
  if (!c.en && !c.bad) throw new Error(`Carte sans anglais: ${c.id}`);
  if (!c.fr) throw new Error(`Carte sans français: ${c.id}`);
}
const thumbsPath = path.join(root, 'data/thumbs.json');
const thumbs = fs.existsSync(thumbsPath) ? JSON.parse(fs.readFileSync(thumbsPath, 'utf8')) : {};
const data = { cards, collections: meta.collections, groups: meta.groups, thumbs };
const json = JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
const out = tpl.replace('/*__DATA__*/null', json);
fs.writeFileSync(path.join(root, 'index.html'), out);
// Variante "artifact" (sans squelette html/head/body : la plateforme l'ajoute elle-même)
const inner = out.replace(/^[\s\S]*?<head>/, '').replace(/<\/head>\s*<body>/, '').replace(/<\/body>\s*<\/html>\s*$/, '')
  .replace(/<meta charset="UTF-8">\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/artifact.html'), inner);
console.log(`OK → flashcards/index.html (${cards.length} cartes, ${meta.collections.length} thèmes, ${(out.length / 1024 / 1024).toFixed(1)} Mo, ${Object.keys(thumbs).length} vignettes) + dist/artifact.html`);
