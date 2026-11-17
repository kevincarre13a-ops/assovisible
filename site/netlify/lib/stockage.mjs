import { getStore } from "@netlify/blobs";
import { SECTIONS } from "./schemas.mjs";

// Contenus du site : version publiée (clé « <section> ») et brouillon (clé « brouillon/<section> »).
export const magasinContenu = () => getStore({ name: "cbs-contenu", consistency: "strong" });
export const magasinFichiers = () => getStore({ name: "cbs-fichiers", consistency: "strong" });
export const CLE_BROUILLON = (s) => "brouillon/" + s;

export async function lirePublie(store) {
  const lus = await Promise.all(SECTIONS.map(async (s) => [s, await store.get(s, { type: "json" })]));
  const sections = {};
  for (const [s, valeur] of lus) if (valeur !== null) sections[s] = valeur;
  return sections;
}

// Liste des brouillons : [[section, { valeur } | { origine: true }], …]
export async function lireBrouillons(store) {
  const lus = await Promise.all(SECTIONS.map(async (s) => [s, await store.get(CLE_BROUILLON(s), { type: "json" })]));
  return lus.filter(([, b]) => b !== null);
}
