// Déclenchée automatiquement par Netlify après chaque message VALIDE du formulaire « contact »
// (les spams sont écartés par Netlify). Envoie le message par e-mail via Resend.
// Variable secrète requise sur Netlify : RESEND_API_KEY.
// Variables facultatives : CONTACT_TO (destinataire), CONTACT_FROM (expéditeur vérifié chez Resend).
const TO = process.env.CONTACT_TO || 'yannber.kemener1@orange.fr';
const FROM = process.env.CONTACT_FROM || 'Site EOST <contact@eost-telgruc.fr>';

const clean = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');
const isEmail = (v) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(v);

export default async (req) => {
  let payload;
  try {
    ({ payload } = await req.json());
  } catch {
    return new Response('Requête illisible', { status: 400 });
  }
  if (!payload || payload.form_name !== 'contact') return new Response('Formulaire ignoré', { status: 200 });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY manquante : e-mail non envoyé.');
    return new Response('Configuration manquante', { status: 500 });
  }

  const d = payload.data || {};
  const nom = oneLine(d.nom, 120);
  const email = oneLine(d.email, 200);
  const sujet = oneLine(d.sujet, 80) || 'Autre';
  const message = clean(d.message, 5000);

  const text = [
    'Nouveau message depuis le formulaire de contact du site EOST.',
    '',
    `Nom : ${nom}`,
    `E-mail : ${email}`,
    `Sujet : ${sujet}`,
    '',
    'Message :',
    message,
    '',
    '--',
    `Message n° ${payload.number ?? '?'} reçu le ${payload.created_at ?? ''}.`,
    'Pour répondre au visiteur, utilisez simplement « Répondre ».',
  ].join('\n');

  const mail = { from: FROM, to: [TO], subject: `Site EOST – nouveau message (${sujet})`, text };
  if (isEmail(email)) mail.reply_to = email;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `eost-contact-${payload.id || payload.number || Date.now()}`,
    },
    body: JSON.stringify(mail),
  });

  if (!res.ok) {
    console.error('Resend a refusé l\'envoi', res.status, (await res.text()).slice(0, 300));
    return new Response('Envoi refusé', { status: 502 });
  }
  console.log('E-mail du formulaire envoyé pour le message', payload.number ?? payload.id);
  return new Response('OK', { status: 200 });
};
