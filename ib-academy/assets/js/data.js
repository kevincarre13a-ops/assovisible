/* =====================================================================
   IB ACADEMY — DONNÉES DU SITE
   ---------------------------------------------------------------------
   Ce fichier est le SEUL à modifier pour mettre à jour les contenus :
   horaires, matchs, résultats, actualités, stages, galerie, partenaires.
   Les pages se mettent à jour automatiquement.

   Règles :
   - Dates au format "AAAA-MM-JJ" et heures "HH:MM".
   - Laisser une liste vide [] affiche un message d'attente propre.
   - Ne publier que des informations confirmées par le club.
   ===================================================================== */

window.IB = {

  /* ---------- Identité du club (sources publiques) ---------- */
  club: {
    nom: "IB Academy",
    ville: "Villejuif",
    departement: "Val-de-Marne (94)",
    email: "ibacademyfootball@gmx.fr",
    telephone: "",                 // à compléter
    creation: 2019,                // déclaration JO du 06/07/2019
    ageMinimum: 7,                 // Guide des sports Villejuif 2025/2026
    lieuEntrainement: "Lieu d'entraînement à confirmer — Villejuif",
    adresseStade: "",              // ex. "Stade …, rue …, 94800 Villejuif"
    reseaux: {                     // coller ici les liens officiels quand ils existent
      facebook: "",
      instagram: "",
      tiktok: "",
      youtube: ""
    }
  },

  /* ---------- Catégories ----------
     Structure indicative selon les catégories d'âge FFF (saison 2026-2027).
     L'accueil "à partir de 7 ans, filles et garçons" est confirmé ;
     jours, horaires, lieux et éducateurs sont À CONFIRMER par le club. */
  categories: [
    { id: "u8-u9",  nom: "U8 – U9",  surnom: "École de foot", naissance: "2018 – 2019", ages: "7 – 8 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Découvrir le ballon, jouer, prendre du plaisir et apprendre les règles du jeu collectif.",
      image: "assets/img/ballons-entrainement.webp" },
    { id: "u10-u11", nom: "U10 – U11", surnom: "Préformation", naissance: "2016 – 2017", ages: "9 – 10 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Technique individuelle, conduite de balle, passes, premiers principes de jeu à 8.",
      image: "assets/img/pied-ballon.webp" },
    { id: "u12-u13", nom: "U12 – U13", surnom: "Formation", naissance: "2014 – 2015", ages: "11 – 12 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Jeu à 8, coordination, intelligence de jeu et esprit d'équipe.",
      image: "assets/img/ballon-crampons.webp" },
    { id: "u14-u15", nom: "U14 – U15", surnom: "Perfectionnement", naissance: "2012 – 2013", ages: "13 – 14 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Jeu à 11, placement, transitions, préparation athlétique adaptée.",
      image: "assets/img/duel.webp" },
    { id: "u16-u18", nom: "U16 – U18", surnom: "Performance", naissance: "2009 – 2011", ages: "15 – 17 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Exigence, compétition, projet personnel et accompagnement vers le niveau supérieur.",
      image: "assets/img/frappe-silhouette.webp" },
    { id: "filles", nom: "Féminines", surnom: "Section filles", naissance: "Selon âge", ages: "Dès 7 ans",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "L'académie encadre filles et garçons : une place pour chaque joueuse, quel que soit son niveau.",
      image: "assets/img/terrain-soleil.webp" },
    { id: "handisport", nom: "Handi-foot", surnom: "Projet 2025-2026", naissance: "Selon âge", ages: "Jeunes en situation de handicap",
      jours: "À confirmer", horaires: "À confirmer", lieu: "À confirmer", educateur: "À confirmer",
      objectif: "Section handisport en projet pour permettre aux jeunes en situation de handicap de pratiquer et de nous rejoindre.",
      image: "assets/img/corner.webp", projet: true }
  ],

  /* ---------- Matchs à venir ----------
     Exemple d'entrée :
     { date: "2026-12-05", heure: "14:00", categorie: "U12 – U13", competition: "Championnat District 94",
       domicile: "IB Academy", exterieur: "Adversaire", lieu: "Stade …, Villejuif",
       statut: "prevu" }   // "prevu" | "reporte" | "annule"
  */
  matchs: [],

  /* ---------- Résultats ----------
     { date: "2026-11-08", categorie: "U14 – U15", domicile: "IB Academy", scoreDom: 2,
       exterieur: "Adversaire", scoreExt: 1, competition: "Amical" }
  */
  resultats: [],

  /* ---------- Actualités ----------
     Seules des informations publiques et sourcées figurent ici. */
  actualites: [
    { date: "2025-09-01", titre: "IB Academy dans le Guide des sports 2025/2026 de Villejuif",
      categorie: "Club",
      resume: "L'académie figure parmi les clubs associés du guide de l'Office municipal des sports : accueil des filles et des garçons dès 7 ans, et un projet de section handisport pour la saison.",
      image: "assets/img/terrain-vue-haut.webp",
      source: "https://www.villejuif.fr/fileadmin/mediatheque/villejuif/Au-quotidien/sport/Guide-sports-2025-2026.pdf" },
    { date: "2025-09-01", titre: "Un projet de section handisport",
      categorie: "Projet",
      resume: "L'académie envisage de créer une section handisport pour permettre aux jeunes en situation de handicap de pratiquer le football et de rejoindre le groupe.",
      image: "assets/img/corner.webp",
      source: "https://www.villejuif.fr/fileadmin/mediatheque/villejuif/Au-quotidien/sport/Guide-sports-2025-2026.pdf" },
    { date: "2024-02-25", titre: "« Donner au football ce que le football me donne »",
      categorie: "Presse",
      resume: "Dans une interview à Nasopresse, le fondateur Ismaël Bamba explique avoir créé IB Academy pour que les jeunes sans structure professionnelle puissent continuer à s'entraîner et être encadrés gratuitement.",
      image: "assets/img/hero-nuit.webp",
      source: "https://nasopresse.com/2024/02/25/france-bamba-ismael-directeur-technique-du-club-de-villejuif-en-region-parisienne-a-propos-du-football-ivoirienne-en-cote-divoire-malheureusement-depuis-une-quinzaine-da/" },
    { date: "2019-07-06", titre: "Naissance officielle de l'association",
      categorie: "Histoire",
      resume: "Création d'IB Academy, association loi 1901, publiée au Journal officiel : la pratique du football, de l'initiation des plus jeunes jusqu'à la compétition.",
      image: "assets/img/ligne-terrain.webp",
      source: "https://www.net1901.org/association/IB-ACADEMY,3557484.html" }
  ],

  /* ---------- Stages & événements ----------
     { type: "Stage" | "Tournoi" | "Portes ouvertes", titre: "", dateDebut: "2027-02-16", dateFin: "2027-02-20",
       public: "U8 à U13", lieu: "", tarif: "", description: "", inscription: true } */
  evenements: [],

  /* ---------- Galerie ----------
     Visuels d'illustration libres de droits (Unsplash) en attendant les
     photos du club. Remplacer par les photos officielles (autorisations
     parentales obligatoires pour les mineurs). */
  galerie: [
    { src: "assets/img/hero-nuit.webp", alt: "Entraînement en nocturne sous les projecteurs", album: "Entraînements" },
    { src: "assets/img/ballons-entrainement.webp", alt: "Ballons alignés sur la pelouse avant la séance", album: "Entraînements" },
    { src: "assets/img/duel.webp", alt: "Duel au ballon, vue sur les jambes des joueurs", album: "Matchs" },
    { src: "assets/img/frappe-silhouette.webp", alt: "Joueur de loin frappant le ballon", album: "Entraînements" },
    { src: "assets/img/corner.webp", alt: "Chaussures de football posées au point de corner", album: "Matériel" },
    { src: "assets/img/terrain-vue-haut.webp", alt: "Terrain de football vu du ciel", album: "Terrains" },
    { src: "assets/img/ballon-ombre.webp", alt: "Ballon en plein soleil sur le gazon", album: "Matériel" },
    { src: "assets/img/terrain-soleil.webp", alt: "Terrain synthétique sous le soleil", album: "Terrains" },
    { src: "assets/img/pied-ballon.webp", alt: "Pied posé sur le ballon", album: "Matchs" },
    { src: "assets/img/ballon-chaussures.webp", alt: "Ballon et chaussures de football", album: "Matériel" },
    { src: "assets/img/ligne-terrain.webp", alt: "Ligne blanche sur la pelouse", album: "Terrains" },
    { src: "assets/img/ballon-crampons.webp", alt: "Ballon au pied d'un joueur", album: "Matchs" }
  ],

  /* ---------- Partenaires ----------
     { nom: "", logo: "assets/img/partenaires/xxx.svg", url: "https://…", type: "Partenaire officiel" } */
  partenaires: []
};
