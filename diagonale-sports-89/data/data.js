/* ============================================================
   DIAGONALE SPORTS 89 — CONTENUS DU SITE
   Ce fichier est le seul à modifier pour mettre à jour le site :
   activités, agenda, résultats, actualités, galerie, bureau, chiffres.
   Les entrées marquées  placeholder: true  sont des textes d'attente
   à remplacer par les vraies informations du club.
   ============================================================ */
window.DS89 = {
  club: {
    nom: "Diagonale Sports 89",
    adresse: "49 bis rue du Professeur Ramon, 89400 Migennes",
    tel: "06 67 56 00 50",
    telLien: "+33667560050",
    email: "jc.charles89@orange.fr",
    liens: [
      { label: "Fiche du club — Walking Football France", url: "https://www.walkingfootballfrance.com/club/association-diagonale-sport-89" },
      { label: "Annuaire des associations de Migennes", url: "https://www.ville-migennes.fr/annuaire/28/" }
    ]
  },

  /* Chiffres clés : value = nombre ; null = à compléter (affiche « — »). */
  chiffres: [
    { value: 89,   label: "Yonne, Bourgogne-Franche-Comté", suffix: "" },
    { value: 1,    label: "Club référencé par la fédération du walking football", suffix: "" },
    { value: 2,    label: "Équipes de France de walking football (+50 ans et +60 ans)", suffix: "" },
    { value: null, label: "Adhérents — à compléter", suffix: "" },
    { value: null, label: "Séances par semaine — à compléter", suffix: "" }
  ],

  activites: [
    {
      id: "walking-football",
      titre: "Walking football",
      sous: "Le football en marchant",
      texte: "Le jeu du football, sans course : on marche, on touche le ballon, on rit, on marque. Un sport de rassemblement, mixte et convivial, accessible à tous les niveaux.",
      public: "Ouvert à toutes et tous — public précis à confirmer avec le club",
      jours: "À confirmer",
      horaires: "À confirmer",
      lieu: "Migennes (89) — salle ou terrain à confirmer",
      tarif: "À confirmer",
      placeholder: true
    },
    {
      id: "evenements",
      titre: "Événements sportifs & culturels",
      sous: "Animer le territoire",
      texte: "L'association a pour objet d'animer et d'organiser des événements sportifs et culturels dans l'Yonne. Le détail des rendez-vous sera publié dans l'agenda.",
      public: "Tous publics",
      jours: "Selon l'agenda",
      horaires: "Selon l'agenda",
      lieu: "Yonne (89)",
      tarif: "À confirmer",
      placeholder: true
    }
  ],

  /* Agenda : date au format AAAA-MM-JJ (ou null si à confirmer). archive: true => « Archives » */
  agenda: [
    {
      titre: "Prochaine séance ou rendez-vous",
      date: null,
      lieu: "Migennes (89)",
      texte: "Date, horaire et lieu à confirmer par le club. Remplacez cette entrée dans data/data.js.",
      archive: false,
      placeholder: true
    }
  ],

  resultats: [
    /* exemple :
    { date: "2026-03-14", competition: "Tournoi amical", score: "Diagonale 4 – 3 Adversaire", texte: "Compte rendu…" } */
  ],

  actus: [
    {
      titre: "Diagonale Sports 89 est référencé parmi les clubs de walking football en France",
      date: null,
      texte: "Le club, basé à Migennes, figure sur la liste officielle des clubs de l'association française de football en marchant. Jean-Claude en est le référent.",
      lien: "https://www.walkingfootballfrance.com/club/association-diagonale-sport-89",
      lienTexte: "Voir la fiche du club",
      placeholder: false
    },
    {
      titre: "Bientôt : les prochaines nouvelles du club",
      date: null,
      texte: "Les actualités (séances, tournois, rencontres) seront publiées ici. Texte d'attente à remplacer.",
      placeholder: true
    }
  ],

  /* Galerie : src = chemin d'image (ex. "img/seance-01.jpg"). Sans src, une vignette d'attente est affichée. */
  galerie: [
    { categorie: "Séances", titre: "Séance de walking football", src: "", alt: "" },
    { categorie: "Séances", titre: "Échauffement collectif", src: "", alt: "" },
    { categorie: "Événements", titre: "Tournoi amical", src: "", alt: "" },
    { categorie: "Événements", titre: "Rencontre inter-clubs", src: "", alt: "" },
    { categorie: "Le club", titre: "Les membres", src: "", alt: "" },
    { categorie: "Le club", titre: "Troisième mi-temps", src: "", alt: "" }
  ],

  bureau: [
    { nom: "Jean-Claude Charles-Félicité", role: "Président et référent du club" },
    { nom: "À compléter", role: "Trésorier" },
    { nom: "À compléter", role: "Secrétaire" },
    { nom: "À compléter", role: "Encadrant(e) sportif(ve)" }
  ]
};
