// Sert les photos et documents ajoutés depuis l'espace administrateur.
import { mediaStore } from './lib/store.mjs';

const TYPES = { jpg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', odt: 'application/vnd.oasis.opendocument.text', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

export default async (req) => {
  const f = new URL(req.url).searchParams.get('f') || '';
  const m = f.match(/^([a-z0-9]{8,40}(?:-s)?)\.(jpg|png|gif|webp|pdf|doc|docx|odt|xlsx)$/);
  if (!m) return new Response('Introuvable', { status: 404 });
  try {
    const r = await mediaStore().getWithMetadata(`f/${f}`, { type: 'arrayBuffer' });
    if (!r || !r.data) return new Response('Introuvable', { status: 404 });
    const headers = {
      'Content-Type': TYPES[m[2]], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    };
    const name = r.metadata && r.metadata.name;
    if (name && m[2] !== 'jpg' && m[2] !== 'png' && m[2] !== 'gif' && m[2] !== 'webp') headers['Content-Disposition'] = `inline; filename="${String(name).replace(/[^\w. -]/g, '_')}"`;
    return new Response(r.data, { headers });
  } catch (e) {
    console.error('media', e && e.message);
    return new Response('Erreur', { status: 500 });
  }
};
