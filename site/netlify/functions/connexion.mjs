import { configurationOk, cookieSession, creerJeton, env, json, verifierMotDePasse } from "../lib/auth.mjs";

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode non autorisée." }, 405);
  if (!configurationOk()) {
    return json({ erreur: "L'espace administrateur n'est pas encore configuré." }, 503);
  }
  if (req.headers.get("x-cbs") !== "1") return json({ erreur: "Requête refusée." }, 403);

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
    await pause(800);
    return json({ erreur: "Identifiant ou mot de passe incorrect." }, 401);
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
