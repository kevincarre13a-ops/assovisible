/* Données générales du site — modifiables sans toucher au HTML */
window.FARFA = window.FARFA || {};
window.FARFA.site = {
  nom: "Les Farfa'Pieds",
  accroche: "On marche, on rit, on papote… et les farfadets suivent !",
  adresse: "27 rue du Boistissandeau, 85500 Saint-Paul-en-Pareds",
  contact: { nom: "Bernard Fontenit", tel: "06 16 96 17 87", telHref: "+33616961787" },
  rendezVous: {
    jour: 2,                     // 0=dimanche … 2=mardi
    heureRdv: "8h50", heureDepart: "9h",
    lieu: "Parking du Prieuré, Saint-Paul-en-Pareds",
    pauseMois: [6, 7]            // juillet et août (mois 0-11)
  },
  // Photo de fond de l'accueil : mettre le chemin d'une vraie photo, ex. "images/groupe.jpg"
  photoAccueil: "",
  reseaux: [
    // { nom: "Facebook", url: "https://…" }   ← à compléter quand l'association aura des pages
  ],
  chiffres: [
    { valeur: 82, suffixe: "", label: "adhérents (chiffre 2019)" },
    { valeur: 3, suffixe: "", label: "niveaux de marche" },
    { valeur: 15, suffixe: " km", label: "pour les plus sportifs" },
    { valeur: 10, suffixe: "", label: "mois d'activité par an" }
  ]
};
