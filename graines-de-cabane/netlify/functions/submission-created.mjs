// Envoi d'un e-mail via Resend à chaque formulaire validé du site (Netlify Forms).
// Netlify appelle automatiquement cette fonction après chaque envoi accepté (hors spam).
// Variables d'environnement à définir dans Netlify (portée « Functions ») :
//   RESEND_API_KEY  clé API Resend (obligatoire)
//   MAIL_FROM       expéditeur, sur le domaine validé dans Resend
//                   ex. « Site Graines de Cabane <site@grainesdecabanes.org> »
//   MAIL_TO         destinataire(s), séparés par des virgules (défaut : grainesde@hotmail.fr)

const FORMS = {
  contact: 'Message du formulaire de contact',
  location: 'Demande de location de jeux',
  ambassadeur: 'Candidature ambassadeur',
  'point-de-recolte': 'Demande pour devenir point de récolte'
};

const SUJETS = {
  devis: 'Devis animation', location: 'Location de jeux', adhesion: 'Adhésion', don: 'Don de jeux',
  'point-de-recolte': 'Devenir point de récolte', ambassadeur: 'Devenir ambassadeur',
  benevolat: 'Bénévolat', temoignage: 'Témoignage', autre: 'Autre'
};

const LABELS = {
  nom: 'Nom', structure: 'Structure', type_structure: 'Type de structure', email: 'E-mail',
  telephone: 'Téléphone', adresse: 'Adresse', sujet: 'Sujet', message: 'Message',
  jeux_souhaites: 'Grands jeux souhaités', autres_jeux: 'Autres jeux souhaités', dates: 'Dates',
  duree: 'Durée', public_vise: 'Public visé', retrait_soustons: 'Retrait à Soustons',
  destination: 'Destination', dates_voyage: 'Dates du voyage',
  emporter_des_jeux: 'Emporter des jeux', creer_des_liens: 'Créer des liens',
  developper_la_collecte: 'Développer la collecte', partager_une_idee: 'Partager une idée',
  accord_publication_temoignage: 'Accord pour publier le témoignage'
};

const IGNORE = new Set(['form-name', 'bot-field', 'ip', 'user_agent', 'referrer']);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async (req) => {
  const apiKey = Netlify.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY manquante : aucun e-mail envoyé.');
    return new Response('Configuration manquante', { status: 500 });
  }

  const { payload = {} } = await req.json();
  const form = payload.form_name || payload.data?.['form-name'] || 'formulaire';
  const data = payload.data || {};

  const lignes = Object.entries(data)
    .filter(([k, v]) => !IGNORE.has(k) && String(v ?? '').trim() !== '')
    .map(([k, v]) => [LABELS[k] || k, k === 'sujet' ? (SUJETS[v] || v) : v]);

  const titre = FORMS[form] || `Formulaire « ${form} »`;
  const qui = data.nom || data.structure || data.email || 'un visiteur';
  const sujet = form === 'contact' && data.sujet ? `${SUJETS[data.sujet] || data.sujet} : ${qui}` : `${titre} : ${qui}`;

  const html = `<div style="font-family:Arial,sans-serif;color:#1F3A63;max-width:640px">
  <h2 style="color:#1F3A63;margin:0 0 6px">${esc(titre)}</h2>
  <p style="color:#49627E;margin:0 0 18px">Reçu depuis grainesdecabanes.org le ${esc(new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }))}</p>
  <table style="border-collapse:collapse;width:100%">${lignes.map(([l, v]) => `
    <tr><td style="padding:8px 10px;border-bottom:1px solid #C7DCE8;font-weight:bold;vertical-align:top;width:34%">${esc(l)}</td>
    <td style="padding:8px 10px;border-bottom:1px solid #C7DCE8;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}
  </table>
  <p style="color:#49627E;font-size:13px;margin-top:18px">Pour répondre, utilisez simplement « Répondre » : la réponse partira vers la personne qui a rempli le formulaire.</p>
</div>`;
  const text = `${titre}\n\n` + lignes.map(([l, v]) => `${l} : ${v}`).join('\n');

  const body = {
    from: Netlify.env.get('MAIL_FROM') || 'Site Graines de Cabane <site@grainesdecabanes.org>',
    to: (Netlify.env.get('MAIL_TO') || 'grainesde@hotmail.fr').split(',').map((s) => s.trim()).filter(Boolean),
    subject: sujet,
    html,
    text
  };
  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) body.reply_to = data.email;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    console.error('Échec Resend', res.status, await res.text());
    return new Response('Échec de l\'envoi', { status: 502 });
  }
  console.log('E-mail envoyé pour le formulaire', form);
  return new Response('ok');
};
