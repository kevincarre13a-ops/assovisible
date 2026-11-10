// Formulaire de contact : enregistre le message (consultable dans l'espace administrateur) puis l'envoie par e-mail via Resend.
import { env } from './lib/config.mjs';
import { rateState, registerFail, clientIp } from './lib/auth.mjs';
import { randomUUID } from 'node:crypto';

const TO = () => env('CONTACT_TO', 'yannber.kemener1@orange.fr');
const FROM = () => env('CONTACT_FROM', 'Site EOST <contact@eost-telgruc.fr>');
const clean = (v, max) => String(v ?? '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');
const isEmail = (v) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to, 'Cache-Control': 'no-store' } });
const page = (lang, title, body, status = 200) => new Response(
  `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title></head><body style="font:18px/1.6 system-ui,sans-serif;max-width:640px;margin:12vh auto;padding:0 20px;color:#0d2236"><h1 style="font-family:Georgia,serif">${esc(title)}</h1><p>${body}</p><p><a href="${lang === 'br' ? '/br/adherer' : '/adherer'}" style="color:#a8432b">&larr; ${lang === 'br' ? 'Distro' : 'Retour'}</a></p></body></html>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });

async function sendMail(m) {
  const key = env('RESEND_API_KEY');
  if (!key) return { ok: false, why: 'clé RESEND_API_KEY manquante' };
  const text = [
    'Nouveau message depuis le formulaire de contact du site EOST.', '',
    `Nom : ${m.nom}`, `E-mail : ${m.email}`, `Sujet : ${m.sujet}`, `Langue de la page : ${m.lang === 'br' ? 'breton' : 'français'}`, '',
    'Message :', m.message, '', '--',
    `Message envoyé depuis le formulaire du site le ${m.at}.`,
    'Pour répondre au visiteur, utilisez simplement « Répondre ».',
  ].join('\n');
  const mail = { from: FROM(), to: [TO()], subject: `Site EOST – nouveau message (${m.sujet})`, text };
  if (isEmail(m.email)) mail.reply_to = m.email;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `eost-msg-${m.id}` },
      body: JSON.stringify(mail),
    });
    if (!res.ok) return { ok: false, why: `Resend ${res.status} ${(await res.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (e) { return { ok: false, why: String(e && e.message) }; }
}

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Méthode non autorisée', { status: 405, headers: { Allow: 'POST' } });
  let form;
  try { form = await req.formData(); } catch { return new Response('Requête illisible', { status: 400 }); }
  const lang = form.get('lang') === 'br' ? 'br' : 'fr';
  const done = lang === 'br' ? '/br/merci' : '/merci';

  // Anti-robots : champ piège rempli ou envoi instantané => on fait semblant que tout va bien.
  const ts = Number(form.get('ts'));
  if (clean(form.get('bot-field'), 50) || (ts && Date.now() - ts < 2500)) return redirect(done);

  const nom = oneLine(form.get('nom'), 120), email = oneLine(form.get('email'), 200);
  const sujet = oneLine(form.get('sujet'), 80) || 'Autre', message = clean(form.get('message'), 5000);
  if (!nom || !message || !isEmail(email)) {
    return page(lang, lang === 'br' ? 'Mankout a ra un tamm traoù' : 'Message incomplet',
      lang === 'br' ? 'Leugnit an anv, ur postel mat ha ur gemennadenn, mar plij.' : 'Merci de renseigner votre nom, une adresse e-mail valide et votre message.', 400);
  }

  const rate = await rateState(clientIp(req, context), 'msg');
  if (rate.blocked) {
    return page(lang, lang === 'br' ? 'Re a gemennadennoù' : 'Trop de messages', lang === 'br' ? 'Klaskit en-dro un tamm diwezhatoc, mar plij.' : 'Merci de réessayer un peu plus tard, ou de nous appeler au 06 64 96 45 50.', 429);
  }

  const rec = { id: randomUUID().replace(/-/g, '').slice(0, 12), at: new Date().toISOString(), nom, email, sujet, message, lang };
  const r = await sendMail(rec);
  if (!r.ok) {
    console.error('Envoi de l\'e-mail impossible :', r.why);
    return page(lang, lang === 'br' ? 'Ur gudenn zo bet' : 'Un problème est survenu', lang === 'br' ? 'N\'eo ket bet kaset ho kemennadenn. Telefonit d\'ar 06 64 96 45 50, mar plij.' : 'Votre message n\'a pas pu être envoyé. Merci de téléphoner au 06 64 96 45 50 ou d\'écrire à yannber.kemener1@orange.fr.', 500);
  }
  try { await registerFail(rate); } catch { /* sans effet pour le visiteur */ }
  return redirect(done);
};
