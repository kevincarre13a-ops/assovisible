# Site de l'Union des Écrivains Vosgiens — mode d'emploi

Le contenu du site est dans le dossier **`data/`**, en fichiers simples. On modifie un fichier, on republie : les pages se mettent à jour toutes seules. Aucune base de données.

> Règle d'or : **ne jamais inventer**. Ce qu'on ne sait pas se laisse vide ou « À renseigner ». Aucune photo d'auteur ni couverture sans accord et sans crédit.

## Comment écrire dans un fichier `.json`
- Chaque fiche est entre `{ }` et séparée de la suivante par une **virgule** (pas de virgule après la dernière).
- Les textes sont entre **guillemets** `"…"`. Pour un guillemet dans un texte, écrire `\"`.
- Tester vos modifications sur https://jsonlint.com avant de publier.

## Ajouter un auteur — `data/auteurs.json`
```json
{
  "id": "marie-dupont",
  "nom": "Marie Dupont",
  "initiales": "MD",
  "role": "",
  "genres": ["Poésie", "Roman"],
  "ville": "Remiremont",
  "bio": "Quelques lignes de biographie.",
  "photo": "img/auteurs/marie-dupont.webp",
  "photoCredit": "Nom du photographe",
  "ouvrages": [],
  "presences": ["Les Imaginales 2026 (Épinal)"],
  "lien": "https://site-de-l-auteur.fr"
}
```
- `id` : en minuscules, sans accents ni espaces (sert dans l'adresse de la fiche).
- `photo` : laisser `null` s'il n'y a pas de portrait (une carte à monogramme s'affiche). Déposer l'image dans `img/auteurs/`, **avec l'accord de l'auteur**, et remplir `photoCredit`.
- `genres` et `ville` alimentent automatiquement les filtres du trombinoscope.

## Ajouter un ouvrage — `data/ouvrages.json`
```json
{
  "id": "les-sapins-parlent",
  "titre": "Les sapins parlent",
  "auteurId": "marie-dupont",
  "auteurLabel": "Marie Dupont",
  "genre": "Roman",
  "annee": "2025",
  "editeur": "Éditions Exemple",
  "prix": "18 €",
  "couverture": "img/ouvrages/les-sapins-parlent.webp",
  "couvertureCredit": "Éditions Exemple",
  "resume": "Résumé en quelques lignes.",
  "lienAchat": "https://lien-de-commande.fr/mon-livre",
  "exemple": false
}
```
- `auteurId` doit être l'`id` de l'auteur (pour relier la fiche). Ajouter aussi l'`id` du livre dans la liste `"ouvrages"` de l'auteur.
- `lienAchat` : lien externe (librairie en ligne, éditeur, site de l'auteur). **Aucun paiement n'est géré sur le site.** Laissé vide, le bouton « Acheter » est grisé.
- Supprimer les fiches `"exemple": true` (fiches modèles) une fois le catalogue rempli.

## Ajouter un événement à l'agenda — `data/evenements.json`
```json
{
  "id": "atelier-ecriture-remiremont",
  "titre": "Atelier d'écriture",
  "type": "atelier",
  "date": "2027-03-20",
  "heure": "14h30",
  "periode": "",
  "lieu": "Médiathèque",
  "ville": "Remiremont",
  "description": "Un atelier pour écrire ensemble.",
  "inscription": true,
  "gratuit": true,
  "statut": "confirme",
  "affiche": "",
  "source": ""
}
```
- `type` : `atelier`, `salon`, `rencontre`, `spectacle`, `conference`, `concours` ou `autre` (le filtre se construit tout seul).
- `date` au format **AAAA-MM-JJ**. Dès qu'un événement daté est dans le futur, le **compte à rebours** de l'accueil s'active sur le plus proche.
- Sans date précise, laisser `"date": null` et décrire la période dans `periode`.
- Les inscriptions arrivent dans **Netlify → Forms → inscription-evenement** (une notification e-mail peut y être configurée).
- Un événement daté passé disparaît de l'agenda : le recopier dans `archives.json`.

## Ajouter une archive — `data/archives.json`
Les archives sont classées par année. Ajouter une ligne dans l'année voulue, ou créer l'année :
```json
{
  "annee": 2027,
  "items": [
    { "type": "evenement", "titre": "Salon du livre", "date": "2027-04-10", "lieu": "Épinal",
      "texte": "Compte rendu en deux lignes.", "lien": "https://…", "source": "Blog de l'UEV" }
  ]
}
```
`type` : `evenement`, `action`, `publication` ou `repere`. Pour une période sans jour précis : `"date": ""` et `"periode": "Juin 2027"`.

## Autres fichiers
| Fichier | Contenu |
|---|---|
| `data/actualites.json` | Actualités (`actualites`) et revue de presse (`presse`) |
| `data/prix.json` | Prix, concours et scènes ouvertes |
| `data/partenaires.json` | Partenaires |
| `data/faq.json` | Questions de la FAQ |
| `data/site.json` | Contact, siège, année de création, **lien du forum** (`forum.url`) |

## À renseigner (textes d'attente)
Bureau (hors président), statuts et cotisation, adresse postale, téléphone, réseaux sociaux (Facebook, Instagram, YouTube), lien du forum, concours, revue de presse, bio / ville / genre des auteurs, liens d'achat.
Origine de l'association : 1968 (annuaires) ou 2006 (immatriculation) — **à confirmer**.

## Pages et technique
- Pages : `index`, `presentation`, `agenda`, `auteurs`, `auteur` (fiche), `ouvrages`, `ouvrage` (fiche), `archives`, `actualites`, `prix-concours`, `contact`, `adherer`, `partenaires`, `admin`, `mentions-legales`.
- Menu et pied de page sont communs : générés par `uev-src/build.py` (`python3 uev-src/build.py`). Pour changer un texte de page, modifier `uev-src/pages/<page>.html` puis relancer ce script.
- Formulaires (contact, inscription, adhésion) : Netlify Forms, détectés au déploiement. Activer *Forms → Enable form detection* sur Netlify si besoin.
- L'espace administrateur est une **maquette** (données fictives, aucune authentification).
- Images venant du blog officiel de l'UEV (stand aux Imaginales, affiches) : à valider par l'association ; chaque image est créditée.
