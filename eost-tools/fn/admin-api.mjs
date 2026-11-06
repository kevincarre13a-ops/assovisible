// API de l'espace administrateur (connexion, enregistrement des pages, photos, messages…).
import { randomUUID } from 'node:crypto';
import { json, env, isLang, isEditable, PAGES } from './lib/config.mjs';
import { pagesStore, mediaStore, messagesStore, authStore } from './lib/store.mjs';
import { getCredentials, verifyPassword, hashPassword, makeSession, readSession, sessionCookie, clearCookie, sameOriginWrite, rateState, registerFail, clearFails, clientIp } from './lib/auth.mjs';
import { sanitizeFragment } from './lib/sanitize.mjs';

const MAX_HTML = 700 * 1024, MAX_IMG = 3 * 1024 * 1024, MAX_DOC = 4 * 1024 * 1024, KEEP_VERSIONS = 20;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 17);

const MAGIC = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8, png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  gif: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46, webp: (b) => b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP',
  pdf: (b) => b.slice(0, 4).toString() === '%PDF', doc: (b) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0,
  docx: (b) => b[0] === 0x50 && b[1] === 0x4b, odt: (b) => b[0] === 0x50 && b[1] === 0x4b, xlsx: (b) => b[0] === 0x50 && b[1] === 0x4b,
};
const IMG_EXT = ['jpg', 'png', 'gif', 'webp'], DOC_EXT = ['pdf', 'doc', 'docx', 'odt', 'xlsx'];
const bad = (msg, status = 400) => json({ ok: false, error: msg }, status);

async function keepRecent(st, prefix) {
  try {
    const { blobs } = await st.list({ prefix });
    const keys = blobs.map((b) => b.key).sort().reverse();
    for (const k of keys.slice(KEEP_VERSIONS)) await st.delete(k);
  } catch { /* le nettoyage n'est pas essentiel */ }
}

async function saveWithHistory(st, key, histPrefix, html, by) {
  const prev = await st.get(key, { type: 'json' });
  if (prev && typeof prev.html === 'string') await st.setJSON(`${histPrefix}${stamp()}-${randomUUID().slice(0, 4)}`, prev);
  await st.setJSON(key, { html, at: new Date().toISOString(), by });
  await keepRecent(st, histPrefix);
}

const actions = {
  async me(ctx) {
    let unread = 0;
    try {
      const { blobs } = await messagesStore().list({ prefix: 'm:' });
      const recent = blobs.map((b) => b.key).sort().reverse().slice(0, 100);
      const recs = await Promise.all(recent.map((k) => messagesStore().get(k, { type: 'json' })));
      unread = recs.filter((r) => r && !r.read).length;
    } catch { /* compteur facultatif */ }
    return json({ ok: true, user: ctx.session.u, unread });
  },

  async pages() {
    const st = pagesStore();
    const out = [];
    for (const lang of ['fr', 'br']) {
      for (const p of PAGES) {
        let at = null;
        try { const r = await st.get(`page:${lang}:${p.key}`, { type: 'json' }); at = r && r.at; } catch { /* page d'origine */ }
        out.push({ lang, key: p.key, name: p[lang], modified: at });
      }
    }
    return json({ ok: true, pages: out });
  },

  async 'save-page'(ctx) {
    const { lang, page, main, footer } = ctx.body;
    if (!isLang(lang) || !isEditable(page)) return bad('Page inconnue.');
    if (typeof main !== 'string' || main.length > MAX_HTML) return bad('Le contenu est trop gros ou vide.');
    const html = sanitizeFragment(main);
    if (html.replace(/<[^>]*>/g, '').trim().length < 20 || !/<section/.test(html)) return bad("Le contenu envoyé semble incomplet : rien n'a été enregistré.");
    const st = pagesStore();
    await saveWithHistory(st, `page:${lang}:${page}`, `hist:${lang}:${page}:`, html, ctx.session.u);
    let footerSaved = false;
    if (typeof footer === 'string' && footer.length <= MAX_HTML) {
      const f = sanitizeFragment(footer);
      if (f.replace(/<[^>]*>/g, '').trim().length >= 10) { await saveWithHistory(st, `footer:${lang}`, `histfooter:${lang}:`, f, ctx.session.u); footerSaved = true; }
    }
    return json({ ok: true, footerSaved, at: new Date().toISOString() });
  },

  async history(ctx) {
    const { lang, page } = ctx.body;
    if (!isLang(lang) || !isEditable(page)) return bad('Page inconnue.');
    const st = pagesStore();
    const { blobs } = await st.list({ prefix: `hist:${lang}:${page}:` });
    const items = [];
    for (const b of blobs.map((x) => x.key).sort().reverse().slice(0, KEEP_VERSIONS)) {
      const r = await st.get(b, { type: 'json' });
      if (r) items.push({ id: b.slice(`hist:${lang}:${page}:`.length), at: r.at, by: r.by });
    }
    return json({ ok: true, items });
  },

  async restore(ctx) {
    const { lang, page, id } = ctx.body;
    if (!isLang(lang) || !isEditable(page) || !/^[\w-]+$/.test(String(id))) return bad('Demande invalide.');
    const st = pagesStore();
    const old = await st.get(`hist:${lang}:${page}:${id}`, { type: 'json' });
    if (!old || typeof old.html !== 'string') return bad('Cette ancienne version est introuvable.', 404);
    await saveWithHistory(st, `page:${lang}:${page}`, `hist:${lang}:${page}:`, old.html, ctx.session.u);
    return json({ ok: true });
  },

  async 'reset-page'(ctx) {
    const { lang, page } = ctx.body;
    if (!isLang(lang) || !isEditable(page)) return bad('Page inconnue.');
    const st = pagesStore();
    const prev = await st.get(`page:${lang}:${page}`, { type: 'json' });
    if (prev && typeof prev.html === 'string') await st.setJSON(`hist:${lang}:${page}:${stamp()}-${randomUUID().slice(0, 4)}`, prev);
    await st.delete(`page:${lang}:${page}`);
    return json({ ok: true });
  },

  async 'reset-footer'(ctx) {
    const { lang } = ctx.body;
    if (!isLang(lang)) return bad('Langue inconnue.');
    await pagesStore().delete(`footer:${lang}`);
    return json({ ok: true });
  },

  async upload(ctx) {
    const { kind, name, data, thumb } = ctx.body;
    const raw = Buffer.from(String(data || ''), 'base64');
    if (!raw.length) return bad('Fichier vide.');
    const m = String(name || '').toLowerCase().match(/\.([a-z0-9]{2,5})$/);
    let ext = m && m[1];
    if (ext === 'jpeg') ext = 'jpg';
    const allowed = kind === 'image' ? IMG_EXT : kind === 'doc' ? DOC_EXT : null;
    if (!allowed || !allowed.includes(ext)) return bad(kind === 'image' ? 'Format de photo accepté : JPG, PNG, GIF ou WEBP.' : 'Format accepté : PDF, Word (doc, docx), LibreOffice (odt) ou Excel (xlsx).');
    if (raw.length > (kind === 'image' ? MAX_IMG : MAX_DOC)) return bad(kind === 'image' ? 'Cette photo est trop lourde (3 Mo maximum).' : 'Ce document est trop lourd (4 Mo maximum).');
    if (!MAGIC[ext](raw)) return bad("Ce fichier n'est pas du bon type.");
    const id = randomUUID().replace(/-/g, '').slice(0, 14);
    const st = mediaStore();
    const ab = (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    await st.set(`f/${id}.${ext}`, ab(raw), { metadata: { name: String(name).slice(0, 120) } });
    const out = { ok: true, url: `/media/${id}.${ext}` };
    if (kind === 'image' && thumb) {
      const t = Buffer.from(String(thumb), 'base64');
      if (t.length && t.length <= MAX_IMG && MAGIC[ext](t)) { await st.set(`f/${id}-s.${ext}`, ab(t), { metadata: { name: 'miniature' } }); out.thumb = `/media/${id}-s.${ext}`; }
    }
    return json(out);
  },

  async messages() {
    const st = messagesStore();
    const { blobs } = await st.list({ prefix: 'm:' });
    const keys = blobs.map((b) => b.key).sort().reverse().slice(0, 200);
    const items = (await Promise.all(keys.map((k) => st.get(k, { type: 'json' }).then((r) => r && { ...r, key: k })))).filter(Boolean);
    return json({ ok: true, items });
  },
  async 'message-read'(ctx) {
    const { key, read } = ctx.body;
    if (!/^m:[\w-]+$/.test(String(key))) return bad('Message inconnu.');
    const st = messagesStore(), r = await st.get(key, { type: 'json' });
    if (!r) return bad('Message introuvable.', 404);
    await st.setJSON(key, { ...r, read: read !== false });
    return json({ ok: true });
  },
  async 'message-delete'(ctx) {
    const { key } = ctx.body;
    if (!/^m:[\w-]+$/.test(String(key))) return bad('Message inconnu.');
    await messagesStore().delete(key);
    return json({ ok: true });
  },

  async 'change-password'(ctx) {
    const { current, next } = ctx.body;
    const cred = await getCredentials();
    if (!(await verifyPassword(String(current || ''), cred.hash))) { await sleep(500); return bad('Le mot de passe actuel n\'est pas le bon.', 403); }
    if (typeof next !== 'string' || next.length < 8) return bad('Le nouveau mot de passe doit faire au moins 8 caractères.');
    await authStore().setJSON('cred', { user: cred.user, hash: await hashPassword(next) });
    return json({ ok: true });
  },
};

export default async (req, context) => {
  const url = new URL(req.url);
  const action = url.searchParams.get('a') || '';

  if (action === 'login') {
    if (req.method !== 'POST' || !sameOriginWrite(req)) return bad('Requête refusée.', 403);
    let body; try { body = await req.json(); } catch { return bad('Requête illisible.'); }
    const rate = await rateState(clientIp(req, context));
    if (rate.blocked) return bad(`Trop d'essais. Merci de réessayer dans ${rate.retryMin} minute${rate.retryMin > 1 ? 's' : ''}.`, 429);
    const cred = await getCredentials();
    const okUser = String(body.user || '').trim().toLowerCase() === String(cred.user || '').toLowerCase() && !!cred.user;
    const okPass = await verifyPassword(String(body.password || ''), cred.hash);
    if (!(okUser && okPass)) {
      await registerFail(rate);
      await sleep(700);
      return bad('Identifiant ou mot de passe incorrect.', 401);
    }
    await clearFails(rate);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(makeSession(cred.user)) });
  }

  const session = readSession(req);
  if (!session) return bad('Veuillez vous connecter.', 401);
  if (action === 'logout') return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });

  const fn = Object.prototype.hasOwnProperty.call(actions, action) ? actions[action] : null;
  if (!fn) return bad('Action inconnue.', 404);
  let body = {};
  if (req.method === 'POST') {
    if (!sameOriginWrite(req)) return bad('Requête refusée.', 403);
    try { body = await req.json(); } catch { return bad('Requête illisible.'); }
  }
  try {
    const res = await fn({ req, session, body });
    // Session glissante : chaque action prolonge la connexion de 12 heures.
    try { res.headers.append('Set-Cookie', sessionCookie(makeSession(session.u))); } catch { /* sans effet */ }
    return res;
  } catch (e) {
    console.error(`admin-api ${action}:`, e && e.stack || e);
    return bad('Une erreur est survenue. Rien n\'a été perdu ; réessayez, ou contactez AssoVisible.', 500);
  }
};
