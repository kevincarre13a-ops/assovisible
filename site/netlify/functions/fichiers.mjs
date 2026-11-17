import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { exigerAdmin, json } from "../lib/auth.mjs";

const magasin = () => getStore({ name: "cbs-fichiers", consistency: "strong" });
const RE_ID = /^[a-z0-9-]{6,64}$/;
const TAILLE_MAX = 4 * 1024 * 1024; // 4 Mo (limite des fonctions Netlify)

// Seuls les formats reconnus à leur signature sont acceptés.
function typeReel(octets) {
  const b = new Uint8Array(octets.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf";
  return "";
}

function nomPropre(brut, type) {
  let nom = "";
  try { nom = decodeURIComponent(brut || ""); } catch { nom = ""; }
  nom = nom.replace(/[^\p{L}\p{N} ._()-]/gu, "").trim().slice(0, 120);
  if (!nom) nom = type === "application/pdf" ? "document.pdf" : "photo";
  return nom;
}

export default async (req, context) => {
  const id = context.params?.id ||
    (new URL(req.url).pathname.match(/^\/api\/fichiers\/([^/]+)(?:\/|$)/) || [])[1];

  try {
    if (req.method === "GET" && id) {
      if (!RE_ID.test(id)) return new Response("Fichier introuvable", { status: 404 });
      const entree = await magasin().getWithMetadata(id, { type: "arrayBuffer" });
      if (entree === null) return new Response("Fichier introuvable", { status: 404 });
      const type = entree.metadata?.type || "application/octet-stream";
      const nom = String(entree.metadata?.nom || "fichier").replace(/"/g, "");
      return new Response(entree.data, {
        status: 200,
        headers: {
          "content-type": type,
          "cache-control": "public, max-age=31536000, immutable",
          "content-disposition": `inline; filename*=UTF-8''${encodeURIComponent(nom)}`,
          "x-content-type-options": "nosniff",
          "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox"
        }
      });
    }

    if (req.method === "POST" && !id) {
      const refus = exigerAdmin(req);
      if (refus) return refus;
      const octets = await req.arrayBuffer();
      if (!octets.byteLength) return json({ erreur: "Le fichier est vide." }, 400);
      if (octets.byteLength > TAILLE_MAX) {
        return json({ erreur: "Le fichier est trop lourd (4 Mo au maximum)." }, 413);
      }
      const type = typeReel(octets);
      if (!type) {
        return json({ erreur: "Format non reconnu. Utilisez une photo JPG ou PNG, ou un document PDF." }, 415);
      }
      const nouvelId = randomUUID();
      await magasin().set(nouvelId, octets, {
        metadata: {
          type,
          nom: nomPropre(req.headers.get("x-cbs-nom"), type),
          taille: octets.byteLength,
          date: new Date().toISOString()
        }
      });
      return json({ ok: true, id: nouvelId, url: `/api/fichiers/${nouvelId}`, type });
    }

    if (req.method === "DELETE" && id) {
      const refus = exigerAdmin(req);
      if (refus) return refus;
      if (!RE_ID.test(id)) return json({ erreur: "Fichier introuvable." }, 404);
      await magasin().delete(id);
      return json({ ok: true });
    }

    return json({ erreur: "Méthode non autorisée." }, 405);
  } catch (e) {
    console.error("fichiers:", e);
    return json({ erreur: "Le serveur n'a pas pu traiter le fichier. Réessayez dans un instant." }, 500);
  }
};

export const config = {
  path: ["/api/fichiers", "/api/fichiers/:id"]
};
