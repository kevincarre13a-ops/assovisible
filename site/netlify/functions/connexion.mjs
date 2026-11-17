import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { configurationOk, cookieSession, creerJeton, env, json, verifierMotDePasse } from "../lib/auth.mjs";

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// Protection contre les essais répétés : après ESSAIS_MAX erreurs en FENETRE,
// les tentatives depuis la même connexion sont refusées jusqu'à la fin de la fenêtre.
const ESSAIS_MAX = 8;
const FENETRE = 15 * 60 * 1000;
const securite = () => getStore({ name: "cbs-securite", consistency: "strong" });

function cleIp(context, req) {
  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "inconnue";
  return "echecs/" + createHash("sha256").update(ip + env("CBS_SESSION_SECRET")).digest("hex").slice(0, 32);
}

async function lireEchecs(cle) {
  const e = await securite().get(cle, { type: "json" });
  if (!e || typeof e.n !== "number" || Date.now() - e.debut > FENETRE) return { n: 0, debut: Date.now() };
  return e;
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ erreur: "Méthode non autorisée." }, 405);
  if (!configurationOk()) {
    return json({ erreur: "L'espace administrateur n'est pas encore configuré." }, 503);
  }
  if (req.headers.get("x-cbs") !== "1") return json({ erreur: "Requête refusée." }, 403);

  const cle = cleIp(context, req);
  let echecs;
  try {
    echecs = await lireEchecs(cle);
  } catch (e) {
    console.error("connexion (lecture sécurité):", e);
    echecs = { n: 0, debut: Date.now() };
  }
  if (echecs.n >= ESSAIS_MAX) {
    const minutes = Math.max(1, Math.ceil((echecs.debut + FENETRE - Date.now()) / 60000));
    return json({ erreur: `Trop d'essais de mot de passe. Pour votre sécurité, patientez ${minutes} minute${minutes > 1 ? "s" : ""} avant de réessayer.` }, 429);
  }

  let corps;
  try {
    corps = await req.json();
  } catch {
    return json({ erreur: "Les données envoyées sont illisibles." }, 400);
  }

  // Identifiant sans tenir compte des majuscules ni des espaces autour ; mot de passe sans espaces autour.
  const identifiant = String(corps?.identifiant ?? "").trim().toLowerCase();
  const motDePasse = String(corps?.motdepasse ?? "").trim();
  const identifiantOk = identifiant === env("CBS_ADMIN_IDENTIFIANT").trim().toLowerCase();
  const motDePasseOk = verifierMotDePasse(motDePasse, env("CBS_ADMIN_MDP_HASH"));

  if (!identifiantOk || !motDePasseOk) {
    try {
      await securite().setJSON(cle, { n: echecs.n + 1, debut: echecs.debut });
    } catch (e) {
      console.error("connexion (écriture sécurité):", e);
    }
    await pause(800);
    return json({ erreur: "Identifiant ou mot de passe incorrect." }, 401);
  }

  try {
    if (echecs.n) await securite().delete(cle);
  } catch (e) {
    console.error("connexion (remise à zéro sécurité):", e);
  }
  return json({ ok: true }, 200, { "set-cookie": cookieSession(creerJeton(identifiant)) });
};

export const config = {
  path: "/api/connexion",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip", "domain"],
    windowSize: 60,
    windowLimit: 10
  }
};
