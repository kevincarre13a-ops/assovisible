import { configurationOk, cookieEfface, json, lireSession } from "../lib/auth.mjs";

export default async (req) => {
  const chemin = new URL(req.url).pathname.replace(/\/+$/, "");

  if (chemin === "/api/session" && req.method === "GET") {
    return json({ connecte: Boolean(lireSession(req)), configure: configurationOk() });
  }
  if (chemin === "/api/deconnexion" && req.method === "POST") {
    return json({ ok: true }, 200, { "set-cookie": cookieEfface() });
  }
  return json({ erreur: "Méthode non autorisée." }, 405);
};

export const config = {
  path: ["/api/session", "/api/deconnexion"]
};
