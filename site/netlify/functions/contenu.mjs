import { getStore } from "@netlify/blobs";
import { exigerAdmin, json } from "../lib/auth.mjs";
import { ErreurValidation, SECTIONS, valider } from "../lib/schemas.mjs";

const magasin = () => getStore({ name: "cbs-contenu", consistency: "strong" });

export default async (req, context) => {
  const section = context.params?.section ||
    (new URL(req.url).pathname.match(/^\/api\/contenu\/([A-Za-z]+)(?:\/|$)/) || [])[1];

  try {
    // Lecture publique de tous les contenus modifiés
    if (req.method === "GET" && !section) {
      const store = magasin();
      const lus = await Promise.all(SECTIONS.map(async (s) => [s, await store.get(s, { type: "json" })]));
      const sections = {};
      for (const [s, valeur] of lus) if (valeur !== null) sections[s] = valeur;
      return json({ sections });
    }

    if (!section) return json({ erreur: "Méthode non autorisée." }, 405);
    if (!SECTIONS.includes(section)) return json({ erreur: "Section inconnue." }, 404);

    // Enregistrement d'une section
    if (req.method === "PUT") {
      const refus = exigerAdmin(req);
      if (refus) return refus;
      let corps;
      try {
        corps = await req.json();
      } catch {
        return json({ erreur: "Les données envoyées sont illisibles." }, 400);
      }
      let propre;
      try {
        propre = valider(section, corps?.valeur);
      } catch (e) {
        if (e instanceof ErreurValidation) return json({ erreur: e.message }, 400);
        throw e;
      }
      await magasin().setJSON(section, propre);
      return json({ ok: true, valeur: propre });
    }

    // Retour au contenu d'origine d'une section
    if (req.method === "DELETE") {
      const refus = exigerAdmin(req);
      if (refus) return refus;
      await magasin().delete(section);
      return json({ ok: true });
    }

    return json({ erreur: "Méthode non autorisée." }, 405);
  } catch (e) {
    console.error("contenu:", e);
    return json({ erreur: "Le serveur n'a pas pu traiter la demande. Réessayez dans un instant." }, 500);
  }
};

export const config = {
  path: ["/api/contenu", "/api/contenu/:section"]
};
