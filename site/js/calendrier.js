// =========================================================
// Calendrier des rendez-vous — SEUL fichier à modifier pour mettre à jour
// les dates affichées sur l'accueil et la page « Tournois & résultats ».
//
// Une ligne = un rendez-vous :
//   date     : "AAAA-MM-JJ" (jour du rendez-vous, ou premier jour s'il dure plusieurs jours)
//   dateFin  : (facultatif) "AAAA-MM-JJ" pour un rendez-vous de plusieurs jours
//   titre    : intitulé affiché
//   lieu     : où se déroule le rendez-vous
//   ici      : true  = rendez-vous organisé à Besançon (mis en avant sur l'accueil)
//              false = rendez-vous ailleurs en Franche-Comté
//
// Source : calendrier prévisionnel 2026-2027 du comité Franche-Comté (FFSc),
// transmis par le président du club. Calendrier provisoire : des dates peuvent évoluer.
// Les rendez-vous passés sont masqués automatiquement.
// =========================================================
window.CALENDRIER = [
  { date: "2026-09-13", titre: "Assemblée générale du comité + tournoi TH2 au profit du scolaire", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2026-09-27", titre: "Qualification séries 1-2-3 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2026-10-11", titre: "Qualification série 4 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2026-11-14", titre: "Qualification Vermeils, Diamants, Rubis + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2026-11-22", titre: "Championnat départemental du Jura (TH2)", lieu: "Jura", ici: false },
  { date: "2026-11-28", titre: "Qualification séries 5-6-7 + Open", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2027-01-31", titre: "TH3 de Besançon (multiplex)", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2027-02-07", titre: "Qualification Interclubs classique", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2027-02-14", titre: "TH3 de Pontarlier", lieu: "Pontarlier", ici: false },
  { date: "2027-03-07", titre: "Championnat régional individuel", lieu: "Salle Jean Zay, Besançon", ici: true },
  { date: "2027-03-14", titre: "Championnat régional classique", lieu: "Lieu à préciser", ici: false },
  { date: "2027-03-21", titre: "Qualification Interclubs", lieu: "Valentigney", ici: false },
  { date: "2027-04-11", titre: "TH3 de Réchésy (multiplex)", lieu: "Réchésy", ici: false },
  { date: "2027-04-25", titre: "Simultané mondial semi-rapide", lieu: "Audincourt", ici: false },
  { date: "2027-05-16", titre: "TH3 de Lons-le-Saunier", lieu: "Lons-le-Saunier", ici: false },
  { date: "2027-05-23", titre: "Championnat régional par paires", lieu: "Morteau", ici: false },
  { date: "2027-05-31", dateFin: "2027-06-04", titre: "Semaine fédérale de simultanés", lieu: "Malbuisson", ici: false },
  { date: "2027-08-07", dateFin: "2027-08-15", titre: "Festival de Valentigney", lieu: "Valentigney", ici: false }
];
