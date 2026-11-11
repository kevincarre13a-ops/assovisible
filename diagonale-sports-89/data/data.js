/* ============================================================
   DIAGONALE SPORTS 89 — CONTENUS DU SITE
   Ce fichier est le seul à modifier pour mettre à jour le site :
   activités, agenda, résultats, actualités, galerie, bureau, chiffres, histoire.
   Les entrées marquées  placeholder: true  sont des textes d'attente
   à remplacer par les vraies informations du club.
   ============================================================ */
window.DS89 = {
  club: {
    nom: "Diagonale Sports 89",
    creation: 2012,                       /* année de déclaration en préfecture (RNA) */
    adresse: "49 bis rue du Professeur Ramon, 89400 Migennes",
    tel: "06 67 56 00 50",
    email: "jc.charles89@orange.fr",
    rna: "W891003707",
    siren: "819 579 913"
  },

  /* Photo plein écran du héro de l'accueil : ex. "img/hero.jpg" (laisser vide = fond graphique) */
  hero: "",

  /* Chiffres clés : value = nombre ; null = à compléter (affiche « — »).
     calc: "anciennete" = nombre d'années depuis club.creation (se met à jour tout seul). */
  chiffres: [
    { calc: "anciennete", label: "Ans d'existence (depuis 2012)" },
    { value: 89,   label: "Yonne, Bourgogne-Franche-Comté" },
    { calc: "savoirFaire", label: "Animations prévues par nos statuts (loto goal, stages, tournois…)" },
    { value: null, label: "Adhérents — à compléter" },
    { value: null, label: "Séances par semaine — à compléter" }
  ],

  /* Frise : l'histoire réelle du club, d'après le Journal officiel des associations */
  histoire: [
    { annee: "2012", titre: "Naissance du club", texte: "Le 4 mai 2012, l'association est déclarée en préfecture de l'Yonne sous le nom « Foot Événementiel 89 », à Joigny. Son idée : faire vivre le football autrement, par l'événement." },
    { annee: "2014", titre: "Les statuts évoluent", texte: "Une première modification est déclarée à la préfecture. L'association continue d'organiser des rendez-vous autour du football." },
    { annee: "2017", titre: "Diagonale Sports 89, à Migennes", texte: "Le club porte désormais le nom de Diagonale Sports 89 et installe son siège à Migennes." },
    { annee: "2024", titre: "Nouvelle adresse à Migennes", texte: "Le siège s'installe rue du Professeur Ramon. Le club est aujourd'hui aussi présent dans le répertoire des clubs sportifs de la Ville d'Auxerre." },
    { annee: "Aujourd'hui", titre: "Walking football", texte: "Diagonale Sports 89 figure sur la liste des clubs de walking football de l'association française de football en marchant, avec Jean-Claude comme référent." }
  ],

  /* Ce que le club a prévu de proposer (objet déclaré à sa création, 2012) */
  savoirFaire: [
    "Loto goal", "Soirées foot", "Stages de football", "Voyages sportifs",
    "Tournois en salle", "Tournois adultes et jeunes", "Rencontres de football",
    "Location de matériel de foot", "Location de mini-bus", "Web TV foot", "Journal sportif"
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
      lieu: "Migennes / Auxerre — salle ou terrain à confirmer",
      tarif: "À confirmer",
      placeholder: true
    },
    {
      id: "tournois",
      titre: "Tournois & rencontres",
      sous: "Football en salle",
      texte: "Tournois en salle, rencontres entre clubs, tournois adultes et jeunes : le club est né pour faire jouer, se rencontrer et vibrer ensemble.",
      public: "Adultes et jeunes — à confirmer",
      jours: "Selon l'agenda",
      horaires: "Selon l'agenda",
      lieu: "Yonne (89)",
      tarif: "À confirmer",
      placeholder: true
    },
    {
      id: "soirees",
      titre: "Loto goal & soirées foot",
      sous: "Convivialité",
      texte: "Du loto goal aux soirées foot, le club mêle sport et bonne ambiance pour rassembler supporters, joueurs et familles.",
      public: "Tous publics",
      jours: "Selon l'agenda",
      horaires: "Selon l'agenda",
      lieu: "Migennes et alentours — à confirmer",
      tarif: "À confirmer",
      placeholder: true
    },
    {
      id: "stages",
      titre: "Stages & voyages sportifs",
      sous: "Progresser, découvrir",
      texte: "Stages de football et voyages sportifs : l'association a prévu de faire bouger ses membres au-delà du terrain habituel.",
      public: "À confirmer",
      jours: "Selon l'agenda",
      horaires: "Selon l'agenda",
      lieu: "À confirmer",
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
      titre: "Un club qui a plus de dix ans",
      date: null,
      texte: "Déclarée en 2012, l'association a plus de dix ans d'existence : une histoire de football, d'événements et de rencontres dans l'Yonne.",
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
    { categorie: "Événements", titre: "Tournoi en salle", src: "", alt: "" },
    { categorie: "Événements", titre: "Loto goal", src: "", alt: "" },
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
