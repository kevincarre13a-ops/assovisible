// Affiche une page du site : le HTML d'origine, avec le contenu modifié depuis l'espace administrateur s'il y en a.
import pages from './pages.generated.json' with { type: 'json' };
import { isLang, isPage, isEditable } from './lib/config.mjs';
import { pagesStore } from './lib/store.mjs';
import { readSession } from './lib/auth.mjs';

export function splice(html, main, footer) {
  let out = html;
  if (typeof main === 'string') out = out.replace(/(<main id="main">)[\s\S]*(<\/main>)/, (_, a, b) => a + main + b);
  if (typeof footer === 'string') out = out.replace(/(<footer>)[\s\S]*?(<\/footer>)/, (_, a, b) => a + footer + b);
  return out;
}

export default async (req) => {
  const url = new URL(req.url);
  let l = url.searchParams.get('l'), p = url.searchParams.get('p');
  if (!(isLang(l) && isPage(p))) {
    // Netlify garde l'adresse d'origine : on en déduit la langue et la page.
    const path = url.pathname.replace(/\/+$/, '');
    if (path.startsWith('/.netlify/')) { /* appel direct sans paramètres */ } else {
      l = /^\/br(\/|$)/.test(path) ? 'br' : 'fr';
      p = path.replace(/^\/br(?=\/|$)/, '').replace(/^\//, '').replace(/\.html$/, '') || 'index';
    }
  }
  const base = isLang(l) && isPage(p) ? pages[`${l}:${p}`] : null;
  if (!base) return new Response('Page introuvable', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  let html = base;
  // Aperçu des brouillons : réservé à l'administrateur connecté (jamais mis en cache).
  const preview = url.searchParams.get('draft') === '1' && !!readSession(req);
  try {
    const st = pagesStore();
    const get = (k) => st.get(k, { type: 'json' });
    let [m, f] = await Promise.all([isEditable(p) ? get(`page:${l}:${p}`) : null, get(`footer:${l}`)]);
    if (preview) {
      const [dm, df] = await Promise.all([isEditable(p) ? get(`draft:${l}:${p}`) : null, get(`draftfooter:${l}`)]);
      if (dm) m = dm.reset ? null : dm;
      if (df) f = df.reset ? null : df;
    }
    html = splice(base, m && m.html, f && f.html);
  } catch (e) {
    console.error('Lecture des modifications impossible, page d\'origine affichée :', e && e.message);
  }
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': preview ? 'no-store' : 'public, max-age=0, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
