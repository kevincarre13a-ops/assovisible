// =========================================================
// Contenus d'origine du site.
// Ils s'affichent tant qu'aucune modification n'a été enregistrée
// depuis l'espace administrateur (/admin/). Les modifications faites
// dans l'espace administrateur remplacent ces valeurs, section par section.
// =========================================================
window.CONTENU_DEFAUT = {
  contact: {
    nom: "Frédéric Bartier",
    fonction: "Président",
    email: "bartier.frederic@wanadoo.fr",
    telephone: "06 80 13 22 23",
    adresse1: "Centre Pierre Mendès-France",
    adresse2: "3 rue Beauregard, 25000 Besançon",
    licencies: 39
  },

  seances: [
    { jour: "Mercredi", horaire: "14h30", lieu: "Centre Pierre Mendès-France\n3 rue Beauregard, 25000 Besançon", formule: "Scrabble Duplicate" },
    { jour: "Jeudi", horaire: "20h00", lieu: "Centre Pierre Mendès-France\n3 rue Beauregard, 25000 Besançon", formule: "Scrabble Duplicate" }
  ],

  calendrier: [
    { date: "2026-09-13", dateFin: "", titre: "Assemblée générale du comité + tournoi TH2 au profit du scolaire", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2026-09-27", dateFin: "", titre: "Qualification séries 1-2-3 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2026-10-11", dateFin: "", titre: "Qualification série 4 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2026-11-14", dateFin: "", titre: "Qualification Vermeils, Diamants, Rubis + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2026-11-22", dateFin: "", titre: "Championnat départemental du Jura (TH2)", lieu: "Jura", ici: false },
    { date: "2026-11-28", dateFin: "", titre: "Qualification séries 5-6-7 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2027-01-31", dateFin: "", titre: "TH3 de Besançon (multiplex)", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2027-02-07", dateFin: "", titre: "Qualification Interclubs classique", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2027-02-14", dateFin: "", titre: "TH3 de Pontarlier", lieu: "Pontarlier", ici: false },
    { date: "2027-03-07", dateFin: "", titre: "Championnat régional individuel", lieu: "Salle Jean Zay, Besançon", ici: true },
    { date: "2027-03-14", dateFin: "", titre: "Championnat régional classique", lieu: "Lieu à préciser", ici: false },
    { date: "2027-03-21", dateFin: "", titre: "Qualification Interclubs", lieu: "Valentigney", ici: false },
    { date: "2027-04-11", dateFin: "", titre: "TH3 de Réchésy (multiplex)", lieu: "Réchésy", ici: false },
    { date: "2027-04-25", dateFin: "", titre: "Simultané mondial semi-rapide", lieu: "Audincourt", ici: false },
    { date: "2027-05-16", dateFin: "", titre: "TH3 de Lons-le-Saunier", lieu: "Lons-le-Saunier", ici: false },
    { date: "2027-05-23", dateFin: "", titre: "Championnat régional par paires", lieu: "Morteau", ici: false },
    { date: "2027-05-31", dateFin: "2027-06-04", titre: "Semaine fédérale de simultanés", lieu: "Malbuisson", ici: false },
    { date: "2027-08-07", dateFin: "2027-08-15", titre: "Festival de Valentigney", lieu: "Valentigney", ici: false }
  ],

  calendrierDoc: { fichier: "", nom: "" },

  actualites: [
    {
      id: "actu-calendrier-2026",
      date: "2026-11-05",
      titre: "Le calendrier 2026-2027 est en ligne",
      texte: "Le comité Franche-Comté a publié le calendrier prévisionnel de la saison : qualifications et Open à la Salle Jean Zay de Besançon, TH3 de Besançon le 31 janvier 2027, championnats régionaux, festivals… Retrouvez tous les rendez-vous, avec le calendrier complet à télécharger.",
      photo: "",
      lien: "tournois-resultats.html"
    },
    {
      id: "actu-nouveau-site",
      date: "2026-10-18",
      titre: "Le club se dote d'un nouveau site internet",
      texte: "Le Club Bisontin de Scrabble lance son nouveau site pour mieux présenter ses séances, ses tournois et faciliter l'accueil des nouveaux joueurs. Vous êtes curieux du Scrabble duplicate ? Toutes les informations pratiques sont désormais réunies ici.",
      photo: "",
      lien: "jouer-avec-nous.html"
    },
    {
      id: "actu-championnat-2026",
      date: "2026-02-01",
      titre: "Championnat Régional de Franche-Comté à Besançon",
      texte: "Besançon a accueilli le Championnat Régional Franche-Comté open 2025-2026 à la Salle Jean Zay : trois parties ouvertes à tous les licenciés de la région, avec gratuité pour les jeunes et les poussins.",
      photo: "",
      lien: "tournois-resultats.html"
    },
    {
      id: "actu-multiplex-2026",
      date: "2026-01-18",
      titre: "Un multiplex national à Besançon",
      texte: "Le Besançon TH3, étape du Grand Prix, s'est disputé simultanément avec cinq autres clubs de toute la France, avec buvette et restauration sur réservation pour les joueurs venus de toute la région.",
      photo: "",
      lien: "tournois-resultats.html"
    }
  ],

  galerie: [],

  tarifs: [
    { libelle: "Licence Découverte", precision: "1ère inscription", prix: "45" },
    { libelle: "Licence Loisir", precision: "", prix: "60" },
    { libelle: "Licence Premium", precision: "", prix: "70" },
    { libelle: "Licence 18-25 ans", precision: "", prix: "32" },
    { libelle: "Licence moins de 18 ans", precision: "", prix: "28" }
  ],

  bureau: [
    { nom: "Frédéric Bartier", role: "Président", telephone: "06 80 13 22 23", email: "bartier.frederic@wanadoo.fr", note: "" },
    { nom: "Eric Lemeasle", role: "Vice-président", telephone: "", email: "", note: "Contact via le président du club." },
    { nom: "Annie Romero", role: "Trésorière", telephone: "", email: "annie.romero@orange.fr", note: "" }
  ],

  classement: [
    { nom: "Weill Jean-Baptiste", serie: "2A" },
    { nom: "Bartier Frédéric", serie: "2A" },
    { nom: "Buda Brigitte", serie: "3A" },
    { nom: "Arizzi Agnès", serie: "3B" },
    { nom: "David Christiane", serie: "4A" },
    { nom: "Lemeasle Eric", serie: "4B" },
    { nom: "Villequez Jérôme", serie: "5C" },
    { nom: "Grammont Philippe", serie: "6C" },
    { nom: "Marcaud Jacqueline", serie: "7" }
  ],

  palmares: [
    { annee: "2001" },
    { annee: "2010" },
    { annee: "2012" },
    { annee: "2016" }
  ],

  archives: [
    { date: "2026-02-01", tournoi: "Championnat Régional Franche-Comté open 2025-2026 (TH3)", lieu: "Salle Jean Zay, 97 rue des Cras, Besançon" },
    { date: "2026-01-18", tournoi: "Besançon TH3 (multiplex national à 6 clubs, étape du Grand Prix)", lieu: "Salle Jean Zay, 97 rue des Cras, Besançon" },
    { date: "2022-01-16", tournoi: "Besançon TH3 (multiplex à 6 clubs)", lieu: "Salle polyvalente de la Malcombe, avenue François Mitterrand, Besançon" }
  ],

  // Textes modifiés depuis l'espace administrateur (les textes d'origine sont dans les pages).
  textes: {}
};
