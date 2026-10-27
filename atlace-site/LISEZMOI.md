# Site ATLACE — mode d'emploi très simple

Tout ce qui change régulièrement (événements, activités, actualités, photos) se trouve dans le dossier **`data`**.
Vous n'avez jamais besoin de toucher aux pages `.html`.

Chaque fichier de `data` est une liste de « blocs » entre accolades `{ ... }`, séparés par une virgule.
**Astuce : copiez un bloc existant, collez-le juste après (n'oubliez pas la virgule entre deux blocs) et changez les textes.**
Gardez toujours les guillemets `"` autour des textes. Pour afficher un guillemet dans un texte, écrivez `\"`.

> Après chaque modification, enregistrez le fichier et republiez le site (glisser-déposer du dossier sur Netlify, ou « commit » si le site est relié à GitHub).

---

## 1. Ajouter un événement → `data/events.json`

Copiez ce bloc dans la liste `"evenements"` :

```json
{
  "id": "sortie-theatre-2027",
  "titre": "Soirée théâtre",
  "date": "2027-03-12",
  "dateTexte": "Vendredi 12 mars 2027 à 20h",
  "lieu": "Boulogne-Billancourt",
  "categorie": "Sortie",
  "image": "affiche-theatre.jpg",
  "resume": "Une courte phrase qui donne envie.",
  "tarif": "15 € (adhérents)"
}
```

- `id` : un mot sans espace ni accent, unique pour chaque événement.
- `date` : toujours au format **AAAA-MM-JJ**. C'est elle qui classe l'événement.
- `dateTexte` : la date telle qu'elle s'affichera (vous écrivez ce que vous voulez).
- `image` : le nom du fichier de l'affiche ou de la photo (voir le point 2). Facultatif : retirez la ligne si vous n'en avez pas (pensez alors à la virgule de la ligne précédente).
- `tarif`, `lieu` : facultatifs.
- Pour une sortie sur plusieurs jours, ajoutez `"dateFin": "2027-03-14"`.

**Rien d'autre à faire :** l'événement le plus proche apparaît automatiquement sur l'accueil avec son compte à rebours, et passe tout seul dans les **archives** une fois la date dépassée.

## 2. Ajouter une affiche ou une photo

1. Mettez le fichier (`.jpg`, `.png`) dans le dossier **`assets/img`**. Nom simple, sans espace ni accent : `affiche-theatre.jpg`.
   Idéalement 1600 px de large et moins de 300 Ko (plus l'image est grande et nette, plus le site est beau).
2. **Affiche d'un événement :** écrivez ce nom dans la ligne `"image"` de l'événement (point 1).
3. **Photo dans la galerie :** ouvrez `data/gallery.json` et ajoutez une ligne dans le bon groupe :

```json
{ "fichier": "affiche-theatre.jpg", "legende": "Soirée théâtre 2027" }
```

Pour créer un nouveau groupe (une nouvelle expédition par exemple), copiez un bloc `{ "id": ..., "titre": ..., "photos": [ ... ] }` entier.

## 3. Ajouter une actualité → `data/news.json`

Ajoutez un bloc **en haut** de la liste (les plus récentes d'abord) :

```json
{
  "titre": "Notre prochain voyage est ouvert aux inscriptions",
  "texte": "Deux ou trois phrases pour expliquer.",
  "image": "photo.jpg",
  "categorie": "Voyage",
  "date": "2027-01-15"
}
```

`image` et `date` sont facultatifs (mettez `"image": ""` pour ne pas en avoir).

## 4. Modifier une activité, un horaire ou un tarif → `data/activities.json`

Chaque activité a `quand` (jours/horaires), `lieu` et `tarif` : changez simplement le texte entre guillemets.
Les locations de vacances sont dans `data/locations.json`.

## 5. Autres informations

| Je veux modifier… | Fichier |
|---|---|
| téléphone, e-mail, adresses, réseaux sociaux, chiffres clés, menu | `data/site.json` |
| bureau, équipe, partenaires | `data/team.json` |
| tarifs d'adhésion, texte « bénévolat » | `contact.html` (cherchez le texte) |
| bulletin d'adhésion (PDF) | remplacez `assets/doc/bulletin-adhesion.pdf` |

## 6. Formulaire de contact

Il utilise **Netlify Forms** (aucun serveur à gérer). Les messages arrivent dans Netlify > *Forms* > *contact*.
Pour les recevoir par e-mail : Netlify > *Forms* > *Form notifications* > *Add notification* > *Email* (atlace@orange.fr).

## 7. En cas d'erreur

Si une page affiche un contenu vide, c'est presque toujours une virgule oubliée ou en trop, ou un guillemet manquant dans un fichier de `data`.
Vous pouvez vérifier le fichier sur https://jsonlint.com (copier-coller le contenu) : le site indique la ligne fautive.

## Pour mémoire

- Textes marqués **« à confirmer » / « à compléter »** : membres du bureau, texte bénévolat, tarif des cours, responsable de publication des mentions légales.
- Les photos récupérées sur l'ancien site (www.atlace.com) sont de petite taille : n'hésitez pas à fournir des photos plus grandes, notamment pour le grand visuel de l'accueil (`assets/img/hero-*.jpg`).
- Le logo d'origine (globe et visage) a été conservé tel quel (`assets/img/logo-atlace.png`).
