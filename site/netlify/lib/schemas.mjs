// Contrôle des données envoyées par l'espace administrateur, section par section.
// Tout champ inconnu est ignoré ; tout champ invalide provoque un refus avec un message clair.

export class ErreurValidation extends Error {}

const RE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_ID = /^[a-z0-9-]{6,64}$/;
const RE_CLE_TEXTE = /^[a-z0-9.-]{2,60}$/;

export const PAGES_LIENS = ["", "le-club.html", "jouer-avec-nous.html", "tournois-resultats.html",
  "galerie.html", "actualites.html", "adherer-contact.html"];
export const CATEGORIES_PHOTOS = ["tournois", "seances", "remises", "vie"];

function refus(chemin, message) {
  throw new ErreurValidation(chemin ? `${chemin} : ${message}` : message);
}

function texte(max, { requis = false } = {}) {
  return (v, chemin) => {
    if (v === undefined || v === null) v = "";
    if (typeof v === "number") v = String(v);
    if (typeof v !== "string") refus(chemin, "un texte est attendu.");
    v = v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
    if (v.length > max) refus(chemin, `le texte est trop long (${max} caractères au maximum).`);
    if (requis && !v) refus(chemin, "ce champ est obligatoire.");
    return v;
  };
}

function dateIso({ requis = false } = {}) {
  return (v, chemin) => {
    if (v === undefined || v === null || v === "") {
      if (requis) refus(chemin, "la date est obligatoire.");
      return "";
    }
    if (typeof v !== "string" || !RE_DATE.test(v)) refus(chemin, "la date n'est pas valide.");
    const [a, m, j] = v.split("-").map(Number);
    const d = new Date(Date.UTC(a, m - 1, j));
    if (d.getUTCFullYear() !== a || d.getUTCMonth() !== m - 1 || d.getUTCDate() !== j) refus(chemin, "la date n'existe pas.");
    if (a < 1950 || a > 2100) refus(chemin, "l'année n'est pas valide.");
    return v;
  };
}

function booleen() {
  return (v) => v === true || v === "true" || v === 1;
}

function entier(min, max) {
  return (v, chemin) => {
    const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
    if (typeof n !== "number" || !Number.isInteger(n) || n < min || n > max) {
      refus(chemin, `un nombre entier entre ${min} et ${max} est attendu.`);
    }
    return n;
  };
}

function choix(valeurs) {
  return (v, chemin) => {
    if (v === undefined || v === null) v = valeurs[0];
    if (!valeurs.includes(v)) refus(chemin, "valeur non autorisée.");
    return v;
  };
}

function identifiant({ requis = false } = {}) {
  return (v, chemin) => {
    if (v === undefined || v === null || v === "") {
      if (requis) refus(chemin, "identifiant manquant.");
      return "";
    }
    if (typeof v !== "string" || !RE_ID.test(v)) refus(chemin, "identifiant invalide.");
    return v;
  };
}

function objet(champs, controle) {
  return (v, chemin) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) refus(chemin, "données invalides.");
    const r = {};
    for (const [cle, valider] of Object.entries(champs)) r[cle] = valider(v[cle], chemin ? `${chemin}, ${cle}` : cle);
    if (controle) controle(r, chemin);
    return r;
  };
}

function listeDe(element, max) {
  return (v, chemin) => {
    if (!Array.isArray(v)) refus(chemin, "une liste est attendue.");
    if (v.length > max) refus(chemin, `trop d'éléments (${max} au maximum).`);
    return v.map((x, i) => element(x, `Élément n°${i + 1}`));
  };
}

function dictionnaireTextes(max) {
  return (v) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) refus("", "données invalides.");
    const cles = Object.keys(v);
    if (cles.length > max) refus("", "trop de textes.");
    const r = {};
    for (const cle of cles) {
      if (!RE_CLE_TEXTE.test(cle)) refus("", "nom de texte invalide.");
      r[cle] = texte(4000)(v[cle], `Texte « ${cle} »`);
    }
    return r;
  };
}

export const SCHEMAS = {
  contact: objet({
    nom: texte(100, { requis: true }),
    fonction: texte(60),
    email: texte(120, { requis: true }),
    telephone: texte(30),
    adresse1: texte(150),
    adresse2: texte(150),
    licencies: entier(0, 9999)
  }),
  seances: listeDe(objet({
    jour: texte(30, { requis: true }),
    horaire: texte(30),
    lieu: texte(300),
    formule: texte(100)
  }), 14),
  calendrier: listeDe(objet({
    date: dateIso({ requis: true }),
    dateFin: dateIso(),
    titre: texte(200, { requis: true }),
    lieu: texte(200),
    ici: booleen()
  }, (r, chemin) => {
    if (r.dateFin && r.dateFin < r.date) refus(chemin, "la date de fin est avant la date de début.");
    if (r.dateFin === r.date) r.dateFin = "";
  }), 300),
  calendrierDoc: objet({
    fichier: identifiant(),
    nom: texte(150)
  }),
  actualites: listeDe(objet({
    id: identifiant({ requis: true }),
    date: dateIso({ requis: true }),
    titre: texte(200, { requis: true }),
    texte: texte(6000),
    photo: identifiant(),
    lien: choix(PAGES_LIENS)
  }), 300),
  galerie: listeDe(objet({
    id: identifiant({ requis: true }),
    photo: identifiant({ requis: true }),
    legende: texte(200),
    categorie: choix(CATEGORIES_PHOTOS)
  }), 500),
  tarifs: listeDe(objet({
    libelle: texte(100, { requis: true }),
    precision: texte(100),
    prix: texte(20)
  }), 40),
  bureau: listeDe(objet({
    nom: texte(100, { requis: true }),
    role: texte(60),
    telephone: texte(30),
    email: texte(120),
    note: texte(200)
  }), 30),
  classement: listeDe(objet({
    nom: texte(100, { requis: true }),
    serie: texte(10)
  }), 200),
  palmares: listeDe(objet({
    annee: texte(20, { requis: true })
  }), 50),
  archives: listeDe(objet({
    date: dateIso({ requis: true }),
    tournoi: texte(250, { requis: true }),
    lieu: texte(250)
  }), 200),
  textes: dictionnaireTextes(300)
};

export const SECTIONS = Object.keys(SCHEMAS);

export function valider(section, valeur) {
  const schema = SCHEMAS[section];
  if (!schema) throw new ErreurValidation("Section inconnue.");
  return schema(valeur, "");
}
