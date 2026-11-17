import { exigerAdmin, json } from "../lib/auth.mjs";
import { CLE_BROUILLON, lireBrouillons, lirePublie, magasinContenu, magasinFichiers } from "../lib/stockage.mjs";

// POST /api/publier                 : met en ligne, en une seule fois, toutes les modifications en brouillon.
// POST /api/annuler-modifications   : abandonne les modifications pas encore mises en ligne.
const RE_FICHIER = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const DELAI_ORPHELIN = 60 * 60 * 1000; // un fichier non utilisé n'est supprimé qu'après 1 heure

function fichiersUtilises(...objets) {
  const ids = new Set();
  for (const o of objets) for (const id of JSON.stringify(o || {}).match(RE_FICHIER) || []) ids.add(id);
  return ids;
}

// Supprime les photos et documents qui ne servent plus ni en ligne ni en brouillon.
// Ceux qui étaient en ligne juste avant sont supprimés tout de suite ; les autres
// (envoyés puis jamais publiés) seulement après un délai, pour ne pas gêner un envoi en cours.
async function nettoyerFichiers(store, etaientEnLigne) {
  const [publie, brouillons] = await Promise.all([lirePublie(store), lireBrouillons(store)]);
  const utilises = fichiersUtilises(publie, brouillons);
  const fichiers = magasinFichiers();
  const { blobs } = await fichiers.list();
  let supprimes = 0;
  for (const { key } of blobs) {
    if (utilises.has(key)) continue;
    const meta = await fichiers.getMetadata(key);
    const date = Date.parse(meta?.metadata?.date || "");
    if (etaientEnLigne.has(key) || !date || Date.now() - date > DELAI_ORPHELIN) {
      await fichiers.delete(key);
      supprimes++;
    }
  }
  return supprimes;
}

export default async (req) => {
  if (req.method !== "POST") return json({ erreur: "Méthode non autorisée." }, 405);
  const refus = exigerAdmin(req);
  if (refus) return refus;
  const action = new URL(req.url).pathname.replace(/\/+$/, "").split("/").pop();
  const store = magasinContenu();

  try {
    const brouillons = await lireBrouillons(store);

    if (action === "publier") {
      const etaientEnLigne = fichiersUtilises(await lirePublie(store));
      for (const [section, b] of brouillons) {
        if (b.origine) await store.delete(section);
        else await store.setJSON(section, b.valeur);
        await store.delete(CLE_BROUILLON(section));
      }
      try { await nettoyerFichiers(store, etaientEnLigne); } catch (e) { console.error("nettoyage fichiers:", e); }
      return json({ ok: true, publies: brouillons.map(([s]) => s) });
    }

    if (action === "annuler-modifications") {
      for (const [section] of brouillons) await store.delete(CLE_BROUILLON(section));
      return json({ ok: true, annules: brouillons.map(([s]) => s) });
    }

    return json({ erreur: "Action inconnue." }, 404);
  } catch (e) {
    console.error("publication:", e);
    return json({ erreur: "La mise en ligne n'a pas pu se faire. Réessayez dans un instant : vos modifications sont toujours gardées." }, 500);
  }
};

export const config = {
  path: ["/api/publier", "/api/annuler-modifications"]
};
