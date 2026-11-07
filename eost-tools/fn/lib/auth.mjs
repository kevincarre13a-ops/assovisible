import { createHmac, randomBytes, scrypt as _scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { env } from './config.mjs';
import { authStore } from './store.mjs';

const scrypt = promisify(_scrypt);
const COOKIE = 'eost_admin';
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 heures

const b64u = (b) => Buffer.from(b).toString('base64url');
const sign = (secret, data) => createHmac('sha256', secret).update(data).digest('base64url');

export async function hashPassword(password, saltBuf = randomBytes(16)) {
  const N = 16384, r = 8, p = 1;
  const key = await scrypt(password.normalize('NFKC'), saltBuf, 32, { N, r, p });
  return `scrypt$${N}$${r}$${p}$${saltBuf.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [alg, N, r, p, salt, hash] = String(stored).split('$');
    if (alg !== 'scrypt') return false;
    const expected = Buffer.from(hash, 'base64');
    const key = await scrypt(String(password).normalize('NFKC'), Buffer.from(salt, 'base64'), expected.length, { N: +N, r: +r, p: +p });
    return key.length === expected.length && timingSafeEqual(key, expected);
  } catch { return false; }
}

/** Identifiants : ceux modifiés par l'utilisateur (Blobs) sinon ceux de l'environnement Netlify. */
// Identifiant et mot de passe : uniquement dans les variables d'environnement Netlify (modifiables par l'agence seulement).
export async function getCredentials() {
  return { user: env('ADMIN_USER'), hash: env('ADMIN_PASSWORD_HASH') };
}

export function makeSession(user) {
  const secret = env('SESSION_SECRET');
  if (!secret) throw new Error('SESSION_SECRET manquant');
  const payload = b64u(JSON.stringify({ u: user, exp: Date.now() + SESSION_MS }));
  return `${payload}.${sign(secret, payload)}`;
}

export function readSession(req) {
  const secret = env('SESSION_SECRET');
  if (!secret) return null;
  const cookie = req.headers.get('cookie') || '';
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig) return null;
  const good = sign(secret, payload);
  const a = Buffer.from(sig), b = Buffer.from(good);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return s.exp > Date.now() ? s : null;
  } catch { return null; }
}

export const sessionCookie = (value, maxAgeSec = SESSION_MS / 1000) =>
  `${COOKIE}=${value}; Path=/; Max-Age=${maxAgeSec}; HttpOnly; Secure; SameSite=Strict`;
export const clearCookie = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;

/** Les écritures exigent un en-tête propre à l'application et une origine identique au site (anti-CSRF). */
export function sameOriginWrite(req) {
  if (req.headers.get('x-requested-with') !== 'eost-admin') return false;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(req.url).host || new URL(origin).host === (req.headers.get('host') || ''); } catch { return false; }
}

/** Limitation des essais : 5 échecs par quart d'heure et par adresse IP. */
const WINDOW_MS = 15 * 60 * 1000, MAX_FAILS = 5;
const ipKey = (ip, prefix) => `${prefix}:${createHash('sha256').update(String(ip || 'inconnue')).digest('hex').slice(0, 24)}`;

export async function rateState(ip, prefix = 'fail') {
  const st = authStore(), key = ipKey(ip, prefix);
  let rec = null;
  try { rec = await st.get(key, { type: 'json' }); } catch { /* aucun historique */ }
  if (!rec || Date.now() - rec.t > WINDOW_MS) rec = { n: 0, t: Date.now() };
  return { st, key, rec, blocked: rec.n >= MAX_FAILS, retryMin: Math.max(1, Math.ceil((rec.t + WINDOW_MS - Date.now()) / 60000)) };
}
export async function registerFail(state) { state.rec.n += 1; await state.st.setJSON(state.key, state.rec); }
export async function clearFails(state) { try { await state.st.delete(state.key); } catch { /* rien */ } }
export const clientIp = (req, context) => (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
