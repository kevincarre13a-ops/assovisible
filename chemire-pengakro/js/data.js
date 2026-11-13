/* ==================================================================
   DONNÉES DU SITE — à modifier ici, sans toucher à la mise en page.
   ------------------------------------------------------------------
   • Projets, événements, actualités, galerie et chiffres clés.
   • Chaque information vient d'une source publique indiquée dans
     le champ "source". Les éléments marqués "aCompleter: true" sont
     des textes d'attente à remplacer par le comité.
   • Dates au format AAAA-MM-JJ. Images : dossier /img/.
   ================================================================== */
window.SITE_DATA = {

  /* ---------- Prochain événement (compte à rebours sur l'accueil) ----------
     Renseignez "date" (ex. "2027-03-06T20:00") pour activer le compte à
     rebours. Laissez null tant que la date n'est pas fixée. */
  prochainEvenement: {
    aCompleter: true,
    titre: "Prochain rendez-vous du comité",
    date: null,
    lieu: "Salle des fêtes de Chemiré-le-Gaudin (à confirmer)",
    texte: "La date de la prochaine manifestation sera annoncée ici. Chaque année, la soirée africaine du comité réunit les amis de Pengakro autour d'un repas, de danses et de percussions.",
    image: "img/soiree-2024-tamtam.webp",
    imageAlt: "Soirée africaine du comité : spectacle de danse sur scène"
  },

  /* ---------- Chiffres clés (compteurs animés) ---------- */
  chiffres: [
    { valeur: 20, unite: "ans", label: "de partenariat entre Chemiré-le-Gaudin et Pengakro", source: "Comité créé en 2006" },
    { valeur: 7, unite: "", label: "réalisations menées avec la MUDEP depuis 2012", source: "Site du comité" },
    { valeur: 600, unite: "kg", label: "de livres envoyés à Pengakro en 2015", source: "Site du comité" },
    { valeur: 200, unite: "", label: "femmes de Pengakro et de 6 villages concernées par le marché couvert", source: "Dossier du marché couvert" }
  ],

  /* ---------- Projets ----------
     statut : "realise" | "encours" | "attente" */
  projets: [
    {
      id: "magasins",
      titre: "Les magasins de stockage",
      resume: "Des magasins où les producteurs de Pengakro et des villages voisins déposent leurs récoltes de cacao et de café.",
      statut: "realise", statutLabel: "Opérationnels depuis octobre 2025",
      periode: "2022 – 2026", lieu: "Pengakro (Côte d'Ivoire)", annee: "2025",
      avancement: 90,
      objectif: "Construire des magasins de stockage pour les productions agricoles de 5 villages, former les futurs utilisateurs et créer une coopérative qui gère les locaux via un comité de gestion.",
      details: [
        "Formation prise en charge par la MUDEP : prix, comptabilité et vente, techniques culturales (vivrier et maraîchage), entrepreneuriat et gestion coopérative.",
        "55 futurs utilisateurs inscrits aux formations : 23 femmes et 32 hommes, en grande majorité des agriculteurs.",
        "Chantier suivi étape par étape : implantation et fouilles, béton de propreté, soubassement et chaînage, murs et poteaux, pignon.",
        "Financements : Agence des micro-projets, Région Pays de la Loire, Département de la Sarthe, commune de Chemiré-le-Gaudin, MUDEP, fonds propres du comité et recettes des manifestations."
      ],
      resultats: "Les magasins sont opérationnels depuis le 1er octobre 2025 : les producteurs y déposent leurs récoltes. Une journée de bilan avec exposition a réuni les partenaires financiers à Chemiré le 25 octobre 2025, et l'inauguration à Pengakro a marqué l'année des 20 ans du comité.",
      reste: "Reste à financer : l'équipement du bureau des magasins et l'achat de balances.",
      images: ["img/magasins-terrain.webp", "img/magasins-murs.webp", "img/magasins-pignon.webp", "img/magasins-beton.webp"],
      alts: ["Terrain et bâtiments des magasins de stockage à Pengakro", "Murs en élévation des magasins", "Pignon des magasins en construction", "Béton de propreté sur le chantier"],
      source: "Site du comité (pages « Magasins de stockage »), Ouest-France (oct. 2025 et nov. 2026)"
    },
    {
      id: "marche",
      titre: "Le marché couvert",
      resume: "Un lieu abrité et unique pour que les femmes de Pengakro et des villages voisins vendent et stockent leurs produits.",
      statut: "realise", statutLabel: "Réalisé — inauguré en 2022",
      periode: "2016 – 2022", lieu: "Pengakro (Côte d'Ivoire)", annee: "2022",
      avancement: 100,
      objectif: "Éviter aux vendeuses des trajets jusqu'à 30 km vers d'autres marchés, améliorer leurs conditions de travail et favoriser les échanges entre villages.",
      details: [
        "Environ 200 m² : espace de vente avec étals, bureau du gestionnaire, stockage des marchandises, stockage réfrigéré, bassins de récupération d'eau de pluie.",
        "Environ 200 femmes de Pengakro et de 6 villages concernées, pour un bassin de vie d'environ 7 500 personnes.",
        "Formation des futures utilisatrices : gestion des étals, valorisation des produits agricoles, regroupement et transformation, sécurité des manutentions.",
        "Budget prévisionnel du dossier : 62 000 € (construction, formation, valorisation du bénévolat, évaluation et déplacements)."
      ],
      resultats: "Chantier commencé en 2017 et achevé en novembre 2021. Inauguré fin octobre – début novembre 2022 en présence d'une délégation de Chemiré (chacun ayant payé son voyage). Le marché est devenu un lieu de vie sociale pour les habitants.",
      reste: "",
      images: ["img/marche-couvert.webp", "img/marche-maquette.webp", "img/inauguration-marche.webp"],
      alts: ["Le marché couvert de Pengakro", "Maquette 3D du projet de marché couvert", "Cérémonie d'inauguration du marché couvert"],
      source: "Site du comité (pages « Marché couvert », « Inauguration du marché », « Notre voyage à Pengakro »)"
    },
    {
      id: "livres",
      titre: "600 kg de livres pour Pengakro",
      resume: "Des livres collectés en Sarthe et acheminés jusqu'à la bibliothèque du village.",
      statut: "realise", statutLabel: "Réalisé",
      periode: "2015", lieu: "Sarthe → Pengakro", annee: "2015",
      avancement: 100,
      objectif: "Garnir les rayonnages de la nouvelle bibliothèque de Pengakro.",
      details: [
        "Livres donnés par des écoles du Mans et du Lude, le Rotary Club de Château-du-Loir, La Chartre-sur-le-Loir et des particuliers.",
        "Transport assuré par l'entreprise Duval jusqu'à Toulon, puis par l'armée, grâce à l'appui de Sylvie Tolmont, alors députée de la Sarthe."
      ],
      resultats: "600 kg de livres acheminés jusqu'à Pengakro.",
      reste: "",
      images: [], alts: [],
      source: "Site du comité (page « Historique »)"
    },
    {
      id: "bibliotheque",
      titre: "La bibliothèque",
      resume: "Une bibliothèque ouverte aux élèves et aux habitants, gérée par le directeur de l'école.",
      statut: "realise", statutLabel: "Réalisé",
      periode: "2014", lieu: "Pengakro (Côte d'Ivoire)", annee: "2014",
      avancement: 100,
      objectif: "Donner accès à la lecture aux élèves de l'école et à tous les habitants.",
      details: [ "Coût de la construction : 6 411 €.", "Gestion assurée par le directeur de l'école." ],
      resultats: "Bibliothèque construite en 2014, visitée à nouveau par la délégation du comité en 2026.",
      reste: "",
      images: ["img/bibliotheque.webp"], alts: ["Le bâtiment de la bibliothèque de Pengakro, avant et après travaux"],
      source: "Site du comité (page « Historique »), Ouest-France (nov. 2026)"
    },
    {
      id: "eau",
      titre: "L'eau potable au village",
      resume: "Une participation à l'adduction d'eau potable depuis le château d'eau.",
      statut: "realise", statutLabel: "Réalisé",
      periode: "2013", lieu: "Pengakro (Côte d'Ivoire)", annee: "2013",
      avancement: 100,
      objectif: "Amener l'eau potable dans le village à partir du château d'eau.",
      details: [ "Participation du comité : 1 000 €." ],
      resultats: "Le village est alimenté en eau potable depuis le château d'eau.",
      reste: "",
      images: [], alts: [],
      source: "Site du comité (page « Historique »)"
    },
    {
      id: "football",
      titre: "Maillots pour l'équipe de football",
      resume: "Des maillots et des chaussures pour l'équipe de football de Pengakro.",
      statut: "realise", statutLabel: "Réalisé",
      periode: "2013", lieu: "Pengakro (Côte d'Ivoire)", annee: "2013",
      avancement: 100,
      objectif: "Équiper l'équipe de football du village.",
      details: [ "Don de maillots et de chaussures : 500 €." ],
      resultats: "L'équipe du village a été équipée.",
      reste: "",
      images: [], alts: [],
      source: "Site du comité (page « Historique »)"
    },
    {
      id: "maternite",
      titre: "La maternité",
      resume: "Un bâtiment pour que la sage-femme dispose d'une salle distincte de l'infirmerie.",
      statut: "realise", statutLabel: "Réalisé",
      periode: "2012", lieu: "Pengakro (Côte d'Ivoire)", annee: "2012",
      avancement: 100,
      objectif: "Offrir à la sage-femme une salle séparée de l'infirmerie.",
      details: [ "Coût de la construction : 6 380 €.", "Lits offerts par l'association Bokalé du Mans." ],
      resultats: "Maternité construite et équipée en 2012, toujours visitée par les délégations du comité.",
      reste: "",
      images: ["img/maternite.webp", "img/maternite-salle.webp"], alts: ["Le bâtiment de la maternité de Pengakro", "Salle de soins de la maternité"],
      source: "Site du comité (pages « Historique » et « La maternité terminée ! »)"
    },
    {
      id: "prochain-projet",
      titre: "Le prochain projet",
      resume: "Texte d'attente : le prochain projet sera défini avec la MUDEP et présenté ici.",
      statut: "attente", statutLabel: "À définir",
      periode: "À compléter", lieu: "Pengakro (Côte d'Ivoire)", annee: "…",
      avancement: 0,
      aCompleter: true,
      objectif: "[À compléter par le comité] Objectif du prochain projet.",
      details: [ "[À compléter] Besoins exprimés par la MUDEP.", "[À compléter] Budget et plan de financement." ],
      resultats: "[À compléter]",
      reste: "",
      images: [], alts: [],
      source: "Texte d'attente — à remplacer"
    }
  ],

  /* ---------- Événements ----------
     "a_venir: true" pour un événement futur. Les autres sont archivés. */
  evenements: [
    {
      a_venir: true, aCompleter: true,
      date: null, dateTexte: "Date à confirmer",
      titre: "Prochaine manifestation du comité",
      lieu: "Chemiré-le-Gaudin",
      texte: "[Texte d'attente] Soirée, bric-à-brac, fête… Ajoutez ici la prochaine date, le lieu, l'heure et les tarifs.",
      image: "img/soiree-2024-danse.webp", imageAlt: "Danseuses sur scène lors d'une soirée africaine du comité"
    },
    {
      date: "2026-11-06", dateTexte: "Novembre 2026", jourIncertain: true,
      titre: "Assemblée générale : retour sur l'année des 20 ans",
      lieu: "Chemiré-le-Gaudin",
      texte: "Le président Michel Foucault est revenu sur les 20 ans du comité et l'inauguration des magasins de stockage à Pengakro. Une délégation de quatre personnes a passé dix jours en Côte d'Ivoire et visité l'école, le collège, la maternité et la bibliothèque. Les membres sortants du conseil d'administration ont été réélus.",
      image: "img/magasins-terrain.webp", imageAlt: "Les magasins de stockage de Pengakro",
      source: "Ouest-France, 12 novembre 2026"
    },
    {
      date: "2026-09-06", dateTexte: "6 septembre", anneeIncertaine: true,
      titre: "Bric-à-brac du comité",
      lieu: "Chemiré-le-Gaudin",
      texte: "« Notre bric-à-brac a rencontré un franc succès. »",
      image: "", imageAlt: "",
      source: "Site du comité — année à confirmer"
    },
    {
      date: "2026-03-07", dateTexte: "7 mars 2026",
      titre: "Soirée africaine des 20 ans",
      lieu: "Salle des fêtes de Chemiré-le-Gaudin, 20 h",
      texte: "Le comité a fêté ses 20 ans lors de sa traditionnelle soirée africaine, animée par les danseuses et percussionnistes des Enfants de Walou Dekendo, puis par DJ Benj. Repas : 27 € adulte, 15 € (8-12 ans), 7 € (moins de 8 ans).",
      image: "img/soiree-2024-danse.webp", imageAlt: "Danseuses en tenue colorée sur scène",
      source: "Ouest-France, mars 2026"
    },
    {
      date: "2025-10-25", dateTexte: "25 octobre 2025",
      titre: "Journée bilan des magasins de stockage",
      lieu: "Chemiré-le-Gaudin",
      texte: "Exposition et bilan présentés aux partenaires financiers, en présence d'élus. Les magasins sont opérationnels depuis le 1er octobre.",
      image: "img/bilan-2025.webp", imageAlt: "Élus et membres du comité lors de la journée bilan",
      source: "Site du comité / Ouest-France, 31 octobre 2025"
    },
    {
      date: "2024-03-02", dateTexte: "2 mars 2024",
      titre: "Soirée africaine",
      lieu: "Chemiré-le-Gaudin",
      texte: "Repas préparé par l'association Fleur des Îles, danses des Enfants de Wallou Dekendo, présence de deux associations sarthoises solidaires du Mali et du Burkina Faso. Les bénéfices ont soutenu le projet des magasins de stockage.",
      image: "img/soiree-2024-tamtam.webp", imageAlt: "Spectacle de danse et percussions",
      source: "Site du comité"
    },
    {
      date: "2023-09-23", dateTexte: "23 septembre 2023",
      titre: "Fête au village",
      lieu: "Chemiré-le-Gaudin",
      texte: "Danses des Enfants de Walou Dekendo, vente de tissus et d'artisanat africain, exposition retraçant le travail du comité depuis sa création, témoignage d'un habitant de Chemiré, lecture de « Propos noirs sur blancs » par Prospéro Théâtre et chansons d'Yves Potiron.",
      image: "img/fete-2023-theatre.webp", imageAlt: "Lecture théâtrale devant un décor en tissu wax",
      source: "Site du comité / Ouest-France"
    },
    {
      date: "2022-10-30", dateTexte: "Fin octobre – début novembre 2022", jourIncertain: true,
      titre: "Voyage à Pengakro et inauguration du marché",
      lieu: "Pengakro, Côte d'Ivoire",
      texte: "Une délégation de Chemiré (élus et membres du comité) a assisté à l'inauguration du marché couvert : discours, musique et danses.",
      image: "img/delegation-2022.webp", imageAlt: "La délégation de Chemiré avec les habitants de Pengakro",
      source: "Site du comité"
    },
    {
      date: "2020-08-31", dateTexte: "31 août 2020",
      titre: "Le maire en visite à Pengakro",
      lieu: "Pengakro, Côte d'Ivoire",
      texte: "Visite du maire de Chemiré-le-Gaudin à Pengakro.",
      image: "", imageAlt: "",
      source: "Site du comité"
    },
    {
      date: "2009-06-21", dateTexte: "Juin 2009", jourIncertain: true,
      titre: "Fête de la musique",
      lieu: "Chemiré-le-Gaudin",
      texte: "La fête de la musique a longtemps été organisée par le comité de jumelage.",
      image: "img/fete-musique-2009.webp", imageAlt: "Musiciens sur scène pour la fête de la musique 2009",
      source: "Site du comité"
    }
  ],

  /* ---------- Actualités ----------
     cote : "fr" (Chemiré) ou "ci" (Pengakro) */
  actualites: [
    {
      date: "2026-11-12", cote: "fr",
      titre: "Le comité revient sur l'année de ses 20 ans",
      texte: "Lors de l'assemblée générale, le président Michel Foucault a rappelé les deux temps forts de l'année : les 20 ans du comité et l'inauguration des magasins de stockage à Pengakro.",
      image: "img/bilan-2025.webp", imageAlt: "Membres du comité et élus à Chemiré-le-Gaudin",
      source: "Ouest-France", lien: "https://www.ouest-france.fr/pays-de-la-loire/chemire-le-gaudin-72210/chemire-le-gaudin-pengakro-le-comite-de-solidarite-revient-sur-lannee-de-ses-20-ans-58805f97-63af-42ff-8255-49d2a9c48ab1"
    },
    {
      date: "2026-08-08", cote: "ci",
      titre: "Pengakro inaugure son premier collège",
      texte: "Construit par la MUDEP, le collège a été inauguré le 8 août 2026 et remis à l'État. Une cinquantaine d'élèves de sixième étaient attendus pour la rentrée 2026-2027.",
      image: "img/pengakro-campagne.webp", imageAlt: "Paysage de Pengakro",
      source: "Agence ivoirienne de presse (AIP)", lien: "https://www.aip.ci/cote-divoire-aip-le-premier-college-de-pengakro-inaugure/"
    },
    {
      date: "2026-03-07", cote: "fr",
      titre: "20 ans de solidarité fêtés en musique",
      texte: "Le comité a soufflé ses 20 bougies lors de sa traditionnelle soirée africaine à la salle des fêtes de Chemiré-le-Gaudin.",
      image: "img/soiree-2024-danse.webp", imageAlt: "Danseuses sur scène",
      source: "Ouest-France", lien: "https://www.ouest-france.fr/pays-de-la-loire/chemire-le-gaudin-72210/le-comite-solidaire-chemire-pengakro-a-20-ans-d926fde5-6373-494e-97e8-2076d2055764"
    },
    {
      date: "2025-10-31", cote: "ci",
      titre: "Les magasins de stockage sont opérationnels",
      texte: "Depuis le 1er octobre 2025, les producteurs déposent leurs récoltes de cacao et de café dans les nouveaux magasins. Pour le président de la MUDEP, les infrastructures ont un impact significatif sur la vie des habitants.",
      image: "img/magasins-pignon.webp", imageAlt: "Bâtiment des magasins de stockage",
      source: "Site du comité / Ouest-France", lien: "https://www.ouest-france.fr/pays-de-la-loire/chemire-le-gaudin-72210/chemire-pengakro-la-mise-en-service-des-magasins-de-stockage-fetee-aecb284b-8084-4051-828e-00b98696e0dc"
    },
    {
      date: "2023-09-23", cote: "ci",
      titre: "Une coopérative de producteurs de maïs à Pengakro",
      texte: "Les villageois ont créé une coopérative de producteurs de maïs : un travail collectif du débroussaillage à la récolte, avec la construction d'un silo.",
      image: "img/pengakro-plantation.webp", imageAlt: "Cultures à Pengakro",
      source: "Site du comité", lien: ""
    },
    {
      date: "2022-11-05", cote: "ci",
      titre: "Le marché couvert est inauguré",
      texte: "Après quatre ans de travail commun avec la MUDEP, le marché couvert a été inauguré en présence d'une délégation de Chemiré. Il est devenu un lieu de vie pour les habitants.",
      image: "img/inauguration-marche.webp", imageAlt: "Cérémonie d'inauguration du marché",
      source: "Site du comité", lien: ""
    }
  ],

  /* ---------- Galerie ----------
     cat : "projets" | "evenements" | "pengakro" ; groupe = sous-titre */
  galerie: [
    { src: "img/magasins-terrain.webp", alt: "Les magasins de stockage achevés", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/magasins-fouilles.webp", alt: "Implantation et fouilles des magasins", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/magasins-beton.webp", alt: "Béton de propreté", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/magasins-soubassement.webp", alt: "Murs de soubassement et chaînage", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/magasins-murs.webp", alt: "Murs en élévation et poteaux", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/magasins-pignon.webp", alt: "Le pignon des magasins", cat: "projets", groupe: "Magasins de stockage" },
    { src: "img/marche-couvert.webp", alt: "Le marché couvert", cat: "projets", groupe: "Marché couvert" },
    { src: "img/marche-maquette.webp", alt: "Maquette du marché couvert", cat: "projets", groupe: "Marché couvert" },
    { src: "img/inauguration-marche.webp", alt: "Inauguration du marché couvert", cat: "projets", groupe: "Marché couvert" },
    { src: "img/maternite.webp", alt: "La maternité", cat: "projets", groupe: "Maternité" },
    { src: "img/maternite-salle.webp", alt: "Salle de soins de la maternité", cat: "projets", groupe: "Maternité" },
    { src: "img/bibliotheque.webp", alt: "La bibliothèque", cat: "projets", groupe: "Bibliothèque" },
    { src: "img/delegation-2022.webp", alt: "La délégation de Chemiré à Pengakro", cat: "evenements", groupe: "Voyage 2022" },
    { src: "img/bilan-2025.webp", alt: "Journée bilan des magasins", cat: "evenements", groupe: "Bilan 2025" },
    { src: "img/soiree-2024-danse.webp", alt: "Danses lors de la soirée africaine", cat: "evenements", groupe: "Soirée africaine 2024" },
    { src: "img/soiree-2024-tamtam.webp", alt: "Spectacle lors de la soirée africaine", cat: "evenements", groupe: "Soirée africaine 2024" },
    { src: "img/fete-2023-theatre.webp", alt: "Lecture par Prospéro Théâtre", cat: "evenements", groupe: "Fête au village 2023" },
    { src: "img/fete-2023-public.webp", alt: "Le public de la fête au village", cat: "evenements", groupe: "Fête au village 2023" },
    { src: "img/fete-musique-2009.webp", alt: "Fête de la musique 2009", cat: "evenements", groupe: "Fête de la musique" },
    { src: "img/fete-musique.webp", alt: "Concert sous chapiteau", cat: "evenements", groupe: "Fête de la musique" },
    { src: "img/pengakro-campagne.webp", alt: "La campagne autour de Pengakro", cat: "pengakro", groupe: "Le village" },
    { src: "img/pengakro-plantation.webp", alt: "Cultures à Pengakro", cat: "pengakro", groupe: "Le village" },
    { src: "img/pengakro-habitat.webp", alt: "Une maison sous un manguier", cat: "pengakro", groupe: "Le village" },
    { src: "img/marche-traditionnel.webp", alt: "Un marché de plein air de la région", cat: "pengakro", groupe: "La vie locale" },
    { src: "img/transport-recoltes.webp", alt: "Transport de régimes de bananes en tricycle", cat: "pengakro", groupe: "La vie locale" }
  ]
};
