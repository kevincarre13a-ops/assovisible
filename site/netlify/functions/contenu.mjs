import { exigerAdmin, json } from "../lib/auth.mjs";
import { ErreurValidation, SECTIONS, valider } from "../lib/schemas.mjs";
import { CLE_BROUILLON, lireBrouillons, lirePublie, magasinContenu as magasin } from "../lib/stockage.mjs";

// Deux étapes, comme pour un document :
//  1. chaque enregistrement de l'espace administrateur est gardé en BROUILLON (clé « brouillon/<section> ») ;
//  2. le bouton « Mettre en ligne » (fonction publication.mjs) recopie tous les brouillons sur le site public.
// Le site public ne lit que la version publiée.

export default async (req, context) => {
  const url = new URL(req.url);
  const section = context.params?.section ||
    (url.pathname.match(/^\/api\/contenu\/([A-Za-z]+)(?:\/|$)/) || [])[1];

  try {
    if (req.method === "GET" && !section) {
      const store = magasin();
      // Version de travail (espace administrateur et aperçu) : publié + brouillons
      if (url.searchParams.get("brouillon") === "1") {
        const refus = exigerAdmin(req);
        if (refus) return refus;
        const [sections, brouillons] = await Promise.all([lirePublie(store), lireBrouillons(store)]);
        for (const [s, b] of brouillons) {
          if (b.origine) delete sections[s];
          else sections[s] = b.valeur;
        }
        return json({ sections, enAttente: brouillons.map(([s]) => s) }, 200, { "cache-control": "no-store" });
      }
      // Lecture publique : uniquement ce qui a été mis en ligne
      return json({ sections: await lirePublie(store) });
    }

    if (!section) return json({ erreur: "Méthode non autorisée." }, 405);
    if (!SECTIONS.includes(section)) return json({ erreur: "Section inconnue." }, 404);

    // Enregistrement d'une section (en brouillon)
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
      await magasin().setJSON(CLE_BROUILLON(section), { valeur: propre, date: new Date().toISOString() });
      return json({ ok: true, valeur: propre, enAttente: true });
    }

    // Retour au contenu d'origine d'une section (en brouillon, appliqué à la mise en ligne)
    if (req.method === "DELETE") {
      const refus = exigerAdmin(req);
      if (refus) return refus;
      await magasin().setJSON(CLE_BROUILLON(section), { origine: true, date: new Date().toISOString() });
      return json({ ok: true, enAttente: true });
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
