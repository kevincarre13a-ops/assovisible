/* ============================================================
   DONNÉES DU SITE — Toum Porte Océane
   Pour mettre à jour le site, modifiez uniquement ce fichier.
   Les textes « À confirmer » sont des textes d'attente.
   ============================================================ */
window.TPO = {
  saison: "2026-2027",
  contact: {
    nom: "Liliane Lapomme",
    tel: "06 89 86 64 84",
    mail: "lilianelapomme@gmail.com",
    tresoriere: { nom: "Nathalie Ménakovski", role: "Trésorière", tel: "06 19 69 79 59" }
  },

  lieux: {
    niort: {
      nom: "Niort", dept: "Deux-Sèvres",
      adresse: "Salle de danse, salle Omnisports, rue Barra, Niort",
      requete: "salle omnisports rue Barra Niort",
      rentree: "15, 16 et 17 septembre 2026"
    },
    vaubalier: {
      nom: "Forêt de Chizé", dept: "Deux-Sèvres",
      adresse: "Salle des Fêtes de Vaubalier, Les Fosses",
      requete: "salle des fêtes Vaubalier Les Fosses",
      rentree: "17 septembre 2026"
    },
    chatelaillon: {
      nom: "Châtelaillon-Plage", dept: "Charente-Maritime",
      adresse: "Salle Multi-activités Malraux et Salle d'Expression Corporelle, 1 rue du Stade, Châtelaillon-Plage",
      requete: "1 rue du Stade Châtelaillon-Plage",
      rentree: "14, 16 et 17 septembre 2026"
    }
  },

  niveaux: {
    debutant: {
      titre: "Débutants et bases", icone: "🌱",
      public: "Toute personne qui découvre le Taichi Chuan, de tout âge, sans prérequis.",
      niveau: "Aucun niveau requis",
      texte: "On apprend les premiers gestes, la posture et la respiration autour du Tao Lu, la forme lente qui est la base de l'apprentissage."
    },
    approfondissement: {
      titre: "Approfondissement", icone: "🌊",
      public: "Pratiquants qui connaissent déjà les bases de la forme lente.",
      niveau: "Niveau intermédiaire",
      texte: "On affine la forme, le rythme et la qualité du mouvement, et on explore d'autres pratiques du style Tung."
    },
    perfectionnement: {
      titre: "Perfectionnement", icone: "🍃",
      public: "Pratiquants expérimentés.",
      niveau: "Niveau avancé",
      texte: "Travail approfondi de la forme, des applications martiales, des armes et des jeux à deux."
    },
    mixte: {
      titre: "Bases et approfondissement", icone: "☯",
      public: "Pratiquants débutants et confirmés dans un même cours.",
      niveau: "Tous niveaux",
      texte: "Un cours du matin qui réunit celles et ceux qui débutent et celles et ceux qui souhaitent poursuivre."
    },
    pratique: {
      titre: "Matinée de pratique mensuelle", icone: "☀",
      public: "Ouvert à tous les pratiquants de l'association.",
      niveau: "Tous niveaux (fin à 11h30 pour les débutants)",
      texte: "Un samedi par mois, la pratique est proposée autour d'un thème. Le programme est envoyé aux adhérents."
    }
  },

  /* jour : 1 = lundi … 6 = samedi */
  cours: [
    { lieu: "niort", jour: 2, debut: "12:05", fin: "13:30", niveau: "debutant", salle: "Salle de danse, salle Omnisports" },
    { lieu: "niort", jour: 2, debut: "18:00", fin: "19:30", niveau: "approfondissement", salle: "Salle de danse, salle Omnisports" },
    { lieu: "niort", jour: 2, debut: "19:00", fin: "20:30", niveau: "perfectionnement", salle: "Salle de danse, salle Omnisports" },
    { lieu: "niort", jour: 3, debut: "19:00", fin: "20:15", niveau: "debutant", salle: "Salle de danse, salle Omnisports" },
    { lieu: "niort", jour: 3, debut: "20:00", fin: "21:00", niveau: "approfondissement", salle: "Salle de danse, salle Omnisports" },
    { lieu: "niort", jour: 4, debut: "10:30", fin: "11:45", niveau: "debutant", salle: "Salle de danse, salle Omnisports" },
    { lieu: "vaubalier", jour: 4, debut: "18:00", fin: "19:15", niveau: "debutant", salle: "Salle des Fêtes de Vaubalier" },
    { lieu: "chatelaillon", jour: 1, debut: "17:30", fin: "18:45", niveau: "approfondissement", titre: "Approfondissement 1", salle: "Salle Multi-activités Malraux" },
    { lieu: "chatelaillon", jour: 1, debut: "18:45", fin: "20:00", niveau: "debutant", titre: "Initiation et bases", salle: "Salle Multi-activités Malraux" },
    { lieu: "chatelaillon", jour: 3, debut: "17:00", fin: "18:30", niveau: "approfondissement", titre: "Approfondissement 2", salle: "Salle Multi-activités Malraux" },
    { lieu: "chatelaillon", jour: 3, debut: "18:30", fin: "20:00", niveau: "perfectionnement", salle: "Salle Multi-activités Malraux" },
    { lieu: "chatelaillon", jour: 4, debut: "10:30", fin: "12:00", niveau: "mixte", salle: "Salle d'Expression Corporelle" }
  ],

  /* Matinée mensuelle (dates communiquées aux adhérents) */
  mensuel: { lieu: "chatelaillon", jour: 6, debut: "09:00", fin: "12:30", salle: "Salle d'Expression Corporelle" },

  enseignantes: [
    { nom: "Liliane Lapomme", diplome: "Diplôme d'État DEJEPS AMCI", role: "Contact de l'association" },
    { nom: "Monique", diplome: "BPAMCI", role: "Enseignante" },
    { nom: "Françoise Portat", diplome: "CMB AMCI", role: "Enseignante" },
    { nom: "Nathalie Ménakovski", diplome: "CMB AMCI", role: "Enseignante et trésorière" }
  ],

  bureau: [
    { nom: "Présidente / Président", detail: "À compléter" },
    { nom: "Secrétaire", detail: "À compléter" },
    { nom: "Nathalie Ménakovski", detail: "Trésorière" }
  ],

  tarifs: {
    adhesion: 15, licence: 37, plein: 210, reduit: 170,
    reduitPour: ["Couples, familles, étudiants", "Cas particulier : sur demande"]
  },

  /* Événements : date au format AAAA-MM-JJTHH:MM (laisser vide si à confirmer) */
  evenements: [
    { type: "Matinée de pratique", titre: "Matinée de pratique mensuelle", date: "", lieu: "Châtelaillon-Plage", detail: "Un samedi par mois, de 9h à 12h30 (fin à 11h30 pour les débutants), autour d'un thème. Dates communiquées aux adhérents.", a_venir: true },
    { type: "Stage", titre: "Stages régionaux", date: "", lieu: "Poitou-Charentes", detail: "Dates et lieux à confirmer. Contactez l'association pour être informé(e).", a_venir: true },
    { type: "Stage", titre: "Stages nationaux Toum", date: "", lieu: "À confirmer", detail: "Rencontres du réseau des associations Toum. Informations sur toum.asso.fr.", a_venir: true },
    { type: "Démonstration", titre: "Démonstrations et portes ouvertes", date: "", lieu: "Niort, Châtelaillon-Plage", detail: "Dates à confirmer (forums des associations, démonstrations publiques).", a_venir: true },
    { type: "Rentrée", titre: "Rentrée 2026-2027", date: "2026-09-15", lieu: "Niort, Vaubalier, Châtelaillon-Plage", detail: "Niort 15, 16, 17 septembre · Vaubalier 17 septembre · Châtelaillon-Plage 14, 16, 17 septembre.", a_venir: false }
  ],

  actualites: [
    { date: "Saison 2026-2027", titre: "Les cours ont repris", texte: "La rentrée a eu lieu à Niort, à Vaubalier (forêt de Chizé) et à Châtelaillon-Plage. Il est encore possible de venir essayer : contactez-nous.", image: "img/groupe-parc.jpg", lien: "nous-rejoindre.html", lienTexte: "Venir essayer" },
    { date: "Saison 2026-2027", titre: "Un samedi par mois à Châtelaillon-Plage", texte: "Une matinée de pratique ouverte à tous les pratiquants, autour d'un thème, de 9h à 12h30. Le programme est envoyé aux adhérents.", image: "img/file-parc.jpg", lien: "stages-evenements.html", lienTexte: "Voir les événements" },
    { date: "Saison 2026-2027", titre: "La brochure de la saison est disponible", texte: "Présentation de l'association, du Taichi Chuan style Tung et des enseignantes, à télécharger ou à demander à l'accueil des cours.", image: "img/eventail.jpg", lien: "docs/brochure-2026-2027.pdf", lienTexte: "Télécharger la brochure" }
  ],

  galerie: [
    { src: "img/groupe-parc.jpg", cat: "plein-air", alt: "Groupe de pratiquants de Taichi Chuan dans un parc, en vêtements bleu marine" },
    { src: "img/file-parc.jpg", cat: "plein-air", alt: "Pratiquants alignés dans un parc, dans le même mouvement" },
    { src: "img/pratique-1.jpg", cat: "plein-air", alt: "Pratiquante en posture de Taichi Chuan, les bras ouverts" },
    { src: "img/pratique-2.jpg", cat: "plein-air", alt: "Gros plan d'une pratiquante, les mains en position de garde" },
    { src: "img/duo.jpg", cat: "plein-air", alt: "Deux pratiquantes en exercice à deux dans un parc" },
    { src: "img/pratique-3.jpg", cat: "jardin", alt: "Pratiquante dans un jardin, bras tendus" },
    { src: "img/pratique-4.jpg", cat: "jardin", alt: "Pratiquante en posture basse dans un jardin de bambous" },
    { src: "img/eventail.jpg", cat: "eventail", alt: "Pratiquante avec un éventail bleu" },
    { src: "img/eventails-detail.jpg", cat: "eventail", alt: "Détail d'éventails rouge et bleu ouverts" },
    { src: "img/mains.jpg", cat: "eventail", alt: "Mains en mouvement devant un plan d'eau" },
    { src: "img/salle.jpg", cat: "salle", alt: "Pratiquante en salle avec un foulard orange à la ceinture" }
  ],
  categories: {
    "plein-air": "Pratique en plein air",
    "jardin": "Dans le jardin",
    "eventail": "Éventail et mouvements",
    "salle": "En salle"
  },
  videos: []
};
