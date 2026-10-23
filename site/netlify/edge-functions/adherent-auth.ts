// Protège l'espace adhérents par mot de passe (authentification HTTP « Basic »).
// Active uniquement si la variable ADHERENT_PASSWORD est définie dans Netlify
// (Site configuration > Environment variables, portée « Functions »). Sinon : accès libre.
// Identifiant : ADHERENT_USER si défini, sinon « adherent ».
import type { Config, Context } from "@netlify/edge-functions";

const same = (a: string, b: string) => {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
};

export default async (request: Request, _context: Context) => {
  const password = Netlify.env.get("ADHERENT_PASSWORD");
  if (!password) return; // protection non activée : on laisse passer
  const user = Netlify.env.get("ADHERENT_USER") || "adherent";

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0)));
      const i = decoded.indexOf(":");
      if (i >= 0 && same(decoded.slice(0, i), user) && same(decoded.slice(i + 1), password)) return;
    } catch (_) { /* en-tête invalide : on redemande le mot de passe */ }
  }
  return new Response("Espace réservé aux adhérents du Club Photo de Morestel.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Espace adhérents", charset="UTF-8"',
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

export const config: Config = {
  path: ["/adherent", "/adherent.html", "/supports/*", "/data/cours.json"],
  onError: "fail", // en cas d'erreur, on ferme l'accès plutôt que de l'ouvrir
};
