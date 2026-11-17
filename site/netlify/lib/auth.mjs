import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

const COOKIE = "cbs_session";
const DUREE_SESSION = 7 * 24 * 60 * 60; // 7 jours, en secondes

export function env(nom) {
  const viaNetlify = globalThis.Netlify?.env?.get(nom);
  return String(viaNetlify ?? process.env[nom] ?? "");
}

export function json(objet, statut = 200, entetes = {}) {
  return new Response(JSON.stringify(objet), {
    status: statut,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
      ...entetes
    }
  });
}

export function configurationOk() {
  return Boolean(
    env("CBS_ADMIN_IDENTIFIANT").trim() &&
    env("CBS_ADMIN_MDP_HASH").startsWith("scrypt$") &&
    env("CBS_SESSION_SECRET").length >= 32
  );
}

// Empreinte au format : scrypt$<sel en base64>$<empreinte en base64>
export function verifierMotDePasse(motDePasse, empreinte) {
  const morceaux = String(empreinte).split("$");
  if (morceaux.length !== 3 || morceaux[0] !== "scrypt") return false;
  const sel = Buffer.from(morceaux[1], "base64");
  const attendu = Buffer.from(morceaux[2], "base64");
  if (!sel.length || !attendu.length) return false;
  const calcule = scryptSync(String(motDePasse), sel, attendu.length, { N: 16384, r: 8, p: 1 });
  return calcule.length === attendu.length && timingSafeEqual(calcule, attendu);
}

function signer(charge) {
  return createHmac("sha256", env("CBS_SESSION_SECRET")).update(charge).digest("base64url");
}

export function creerJeton(identifiant) {
  const charge = Buffer.from(JSON.stringify({
    u: identifiant,
    exp: Math.floor(Date.now() / 1000) + DUREE_SESSION
  })).toString("base64url");
  return `${charge}.${signer(charge)}`;
}

function lireCookie(req, nom) {
  const brut = req.headers.get("cookie") || "";
  for (const morceau of brut.split(";")) {
    const i = morceau.indexOf("=");
    if (i > -1 && morceau.slice(0, i).trim() === nom) return morceau.slice(i + 1).trim();
  }
  return "";
}

export function lireSession(req) {
  if (!configurationOk()) return null;
  const jeton = lireCookie(req, COOKIE);
  const [charge, signature] = jeton.split(".");
  if (!charge || !signature) return null;
  const attendu = Buffer.from(signer(charge));
  const recu = Buffer.from(signature);
  if (attendu.length !== recu.length || !timingSafeEqual(attendu, recu)) return null;
  try {
    const donnees = JSON.parse(Buffer.from(charge, "base64url").toString("utf8"));
    if (!donnees || typeof donnees.exp !== "number" || donnees.exp < Date.now() / 1000) return null;
    if (donnees.u !== env("CBS_ADMIN_IDENTIFIANT").trim().toLowerCase()) return null;
    return donnees;
  } catch {
    return null;
  }
}

export function cookieSession(jeton) {
  return `${COOKIE}=${jeton}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${DUREE_SESSION}`;
}

export function cookieEfface() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

// Toute requête qui modifie quelque chose doit venir de l'espace administrateur
// (en-tête x-cbs, impossible à poser depuis un autre site) et d'une session valide.
export function exigerAdmin(req) {
  if (req.headers.get("x-cbs") !== "1") {
    return json({ erreur: "Requête refusée." }, 403);
  }
  if (!lireSession(req)) {
    return json({ erreur: "Votre session a expiré. Merci de vous reconnecter.", session: false }, 401);
  }
  return null;
}
