/* ==========================================================
   CONTENU MODIFIABLE — Tope Là !
   Pour ajouter un événement ou une actualité : copier un bloc
   { ... } ci-dessous, changer les textes et la date (AAAA-MM-JJ).
   Le site classe tout seul : à venir / archives, et choisit
   le "prochain événement" de l'accueil.
   ========================================================== */
window.TOPELA = {
  contact: { nom: "Claude Grajeon", tel: "06 03 90 51 31", telHref: "+33603905131", email: "c.grajeon@wanadoo.fr" },

  evenements: [
    {
      date: "2025-03-16", titre: "Grand loto de Tope Là !", lieu: "Salle des fêtes, 2 rue Sainte-Anne, Jouars-Pontchartrain",
      horaires: "Ouverture 12h · début des jeux 14h30",
      texte: "25 parties, 25 lots (vélo électrique, téléviseur, ordinateur portable…), buvette et restauration sur place, parking gratuit. Réservations : 06 03 90 51 31.",
      tarif: "Carton 5 € · 4 grilles 20 € · 6 grilles 25 € · 8 grilles 35 € · 12 grilles 40 €", type: "Soirée & loto"
    },
    {
      date: "2024-03-16", titre: "Soirée Rock'n'Roll & Rhythm and Blues", lieu: "Grande salle du Foyer rural, Jouars-Pontchartrain",
      horaires: "Ouverture des portes 19h · concert 21h · fin 0h30",
      texte: "Une soirée pour les amateurs de rock'n'roll et de rhythm & blues avec The Red Roosters et Richard Nola. Bar, sandwicherie et food truck sur place.",
      tarif: "15 € par personne, une boisson sans alcool comprise", type: "Concert", image: "img/affiche-soiree-rock-2024.jpg"
    },
    {
      date: "2024-02-13", dateLabel: "Mardi Gras 2024", titre: "Voyage en Louisiane pour Mardi Gras", lieu: "Louisiane (États-Unis)",
      texte: "Un voyage authentique à la rencontre des Louisianais, dans leur quotidien et pendant leurs festivités de Mardi Gras. 13 places seulement. Programme et bulletin d'inscription : « Vivez les Mardi Gras de Louisiane 2024 ».",
      lien: { href: "https://jouars-pontchartrain.fr/wp-content/uploads/2023/12/Vivez_les_Mardi_Gras_de_Louisiane_2024-1.pdf", texte: "Voir le programme (PDF)" }, type: "Voyage"
    },
    {
      date: "2023-05-18", fin: "2023-05-20", titre: "7ᵉ Festival Cajun & Zydeco — Un pont vers la Louisiane", lieu: "Foyer rural, Jouars-Pontchartrain",
      horaires: "Trois jours de concerts, bals et scènes ouvertes",
      texte: "Avec Leroy Thomas & The Zydeco Roadrunners, Zarico Nouveau, The Fabulous Cornfritters, Cajun Express, Bélisaire, Les Récolteurs et Ton ton Gris-Gris. Scènes ouvertes, démonstration de square dance.",
      type: "Festival", image: "img/affiche-festival-2023.jpg"
    },
    {
      date: "2018-11-09", fin: "2018-11-11", titre: "Les 20 ans de Tope Là !", lieu: "Jouars-Pontchartrain",
      texte: "Week-end d'anniversaire avec les délégations de Cella et de Hammond, hébergées en familles : journée à Paris, réception au Foyer rural, soirée Tope Là entre amis.",
      type: "Anniversaire", image: "img/dix-ans.jpg"
    },
    { date: "2018-05-20", dateLabel: "Édition 2018", titre: "5ᵉ Festival Cajun & Zydeco", lieu: "Jouars-Pontchartrain", texte: "Cinquième édition du festival « Un pont vers la Louisiane ». Les meilleurs moments sont à revoir en vidéo.", lien: { href: "https://www.youtube.com/watch?v=QH63rtr15ds", texte: "Revoir le festival (YouTube)" }, type: "Festival" },
    { date: "2016-05-15", dateLabel: "Édition 2016", titre: "Festival Cajun & Zydeco 2016", lieu: "Jouars-Pontchartrain", texte: "Une édition de plus du festival « Un pont vers la Louisiane ».", type: "Festival" },
    { date: "2014-06-08", dateLabel: "Édition 2014", titre: "Festival Cajun & Zydeco 2014", lieu: "Jouars-Pontchartrain", texte: "Une édition de plus du festival « Un pont vers la Louisiane ».", type: "Festival" },
    { date: "2013-05-15", dateLabel: "Mai 2013", titre: "Voyage en Louisiane", lieu: "Hammond et Louisiane", texte: "Un groupe de Tope Là ! rend visite à la ville jumelle de Hammond.", type: "Voyage", image: "img/louisiane-2013.jpg" },
    { date: "2012-05-25", fin: "2012-05-27", titre: "2ᵉ Festival Cajun & Zydeco", lieu: "Jouars-Pontchartrain", texte: "Savoy Family Band (Louisiane), Front Row Zydeco, Colin and the Crawfish, Bayou Chicot, Bal de Maison, Bélisaire, Pain d'Maïs, Zarico Playboys. Ateliers musique et danse, cuisine cajun, cinéma, exposition.", type: "Festival" },
    { date: "2010-09-15", dateLabel: "Septembre 2010", titre: "Voyage à Cella", lieu: "Cella (Espagne)", texte: "Des membres rejoignent la ville jumelle de Cella pour ses fêtes médiévales.", type: "Voyage" }
  ],

  actualites: [
    { date: "Février 2025", titre: "Le grand loto revient le 16 mars", texte: "Vélo électrique, téléviseur, ordinateur portable… 25 parties pour tenter sa chance en bonne compagnie. Renseignements et réservations au 06 03 90 51 31.", image: "img/dix-ans.jpg" },
    { date: "Janvier 2024", titre: "Soirée rock'n'roll & rhythm and blues", texte: "The Red Roosters et Richard Nola font monter la température au Foyer rural, le samedi 16 mars 2024.", image: "img/affiche-soiree-rock-2024.jpg" },
    { date: "Décembre 2023", titre: "Mardi Gras en Louisiane : 13 places", texte: "Tope Là ! propose un voyage pour vivre Mardi Gras avec les Louisianais. Le programme est disponible en PDF.", image: "img/louisiane-2013.jpg" },
    { date: "Mai 2023", titre: "7ᵉ festival Cajun & Zydeco : trois jours de fête", texte: "Leroy Thomas & The Zydeco Roadrunners en tête d'affiche, du 18 au 20 mai au Foyer rural.", image: "img/affiche-festival-2023.jpg" },
    { date: "À compléter", titre: "Votre prochaine actualité ici", texte: "Ce bloc est un texte d'attente : l'équipe peut le remplacer en deux minutes dans le fichier data/site.js.", attente: true }
  ]
};
