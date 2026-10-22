/* ==========================================================================
   CALENDRIER DU CLUB — le seul fichier à modifier pour mettre à jour les concours.
   Chaque ligne = un rendez-vous. Les dates passées disparaissent toutes seules.
   Le « prochain concours » de l'accueil est choisi automatiquement.

   date    : "AAAA-MM-JJ"
   kind    : "concours" (compétition) ou "club" (vie du club : sortie, vide-grenier, AG…)
   format  : texte court affiché en étiquette (ex. "Doublette")
   time    : horaires (ou null → « Horaires à confirmer »)
   place   : lieu (ou null → « Lieu à confirmer »)
   desc    : une ou deux phrases
   img     : visuel (dossier img/events/) ou null
   solidaire : true pour les concours au profit d'une cause
   ========================================================================== */
window.CARREAU_EVENTS = [
  { date: "2026-10-24", kind: "club", format: "Vie du club", title: "Assemblée générale du club",
    time: "19h30", place: "Salle Michel Olivier, près du local",
    desc: "Rendez-vous annuel de tous les licenciés : bilan de la saison et projets du club.", img: null },

  { date: "2026-12-04", kind: "concours", format: "Doublette", solidaire: true, title: "Concours en doublette — Téléthon",
    time: null, place: null,
    desc: "Grande tombola et vente de crêpes au profit du Téléthon. Premier lot de la tombola : des entrées pour le Puy du Fou.",
    img: "events/telethon-2026.webp" },

  { date: "2026-12-27", kind: "concours", format: "Triplette mixte", title: "Coupe de Noël Lilian Lavault",
    time: "14h à 20h", place: "Espace Club, rue Denfert Rochereau",
    desc: "Triplette mixte : phase de poules puis phase ABC. Les indemnités sont intégralement remises en jeu sous forme de lots.",
    img: "events/coupe-noel.webp", portrait: true },

  { date: "2027-05-17", kind: "concours", format: "Doublette", title: "Challenge inter-entreprises de Thouars",
    time: "9h à 18h", place: null,
    desc: "Doublette : un seul licencié par équipe. 4 parties comptant pour le classement, plus une partie de classement.",
    img: "events/inter-entreprises.webp" },

  { date: "2027-06-05", kind: "concours", format: "Jeu provençal", title: "Officiel triplette provençal",
    time: "8h à 19h", place: null, officiel: true,
    desc: "Concours officiel en triplette, jeu provençal : 4 parties de 1h45 maximum, plus une mène supplémentaire.",
    img: "events/provencal.webp" },

  { date: "2027-07-04", kind: "club", format: "Vie du club", title: "Journée détente à la mer",
    time: "7h30 à 19h30", place: "Bord de mer (destination à confirmer)",
    desc: "Une journée entre licenciés pour mieux se connaître… sans pétanque, uniquement de la bonne humeur !",
    img: "events/journee-mer.webp", wide: true },

  { date: "2027-07-09", kind: "concours", format: "Doublette", title: "Concours en doublette",
    time: null, place: null, desc: "4 parties, ouvert à tous.", img: "events/doublette.webp" },

  { date: "2027-07-18", kind: "club", format: "Vie du club", title: "Vide-grenier du Carreau",
    time: "8h30 à 18h", place: null,
    desc: "1,50 € le mètre linéaire, 4 mètres maximum par exposant. Vendeurs professionnels non admis.",
    img: "events/vide-grenier.webp", wide: true },

  { date: "2027-07-23", kind: "concours", format: "Doublette", title: "Concours en doublette",
    time: null, place: null, desc: "4 parties.", img: "events/doublette.webp" },

  { date: "2027-08-06", kind: "concours", format: "Doublette", title: "Concours en doublette",
    time: null, place: null, desc: "4 parties.", img: "events/doublette.webp" },

  { date: "2027-08-21", kind: "concours", format: "Triplette mixte", title: "Concours en triplette mixte",
    time: "14h à 20h30", place: null, desc: "En 4 parties, triplette mixte.", img: "events/triplette-mixte.webp" },

  { date: "2027-10-17", kind: "concours", format: "Triplette mixte", solidaire: true, title: "Concours en triplette mixte — Octobre Rose",
    time: "14h à 20h30", place: null,
    desc: "Triplette mixte en 4 parties, organisée pour la sensibilisation dans le cadre d'Octobre Rose.",
    img: "events/octobre-rose.webp" },

  { date: "2027-12-03", kind: "concours", format: "Doublette", solidaire: true, title: "Concours en doublette — Téléthon",
    time: null, place: null, desc: "Grande tombola et vente de crêpes au profit du Téléthon.", img: "events/telethon.webp" }
];
