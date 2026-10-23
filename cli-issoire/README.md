# Site du CLI — Club Culture et Loisirs Issoirien

Site vitrine statique (HTML/CSS/JS, sans backend), généré à partir de fichiers de données.

## Où modifier quoi ?

| Je veux… | Fichier à modifier |
|---|---|
| Changer les horaires, le lieu, l'animateur ou le texte d'une activité | `data/activites/<activite>.json` (un fichier par activité) |
| Publier une actualité | `data/actualites/<activite>.json` (un fichier par activité, plus `club.json`) |
| Ajouter une sortie au calendrier | `data/calendrier.json` |
| Ajouter une photo à la galerie | `data/galerie.json` |
| Changer adresse, téléphone, e-mail, lien « Espace adhérent », chiffres clés | `data/site.json` |
| Compléter le bureau et les responsables | `data/equipe.json` |

Les champs `null` ou vides s'affichent « À compléter » sur le site.

### Publier une actualité (exemple)
Ouvrir `data/actualites/informatique.json` et ajouter, en tête de liste :

```json
{
  "id": "info-nouveau-module",
  "date": "2026-11-05",
  "titre": "Titre de l'actualité",
  "texte": "Quelques lignes de texte.",
  "lien": { "texte": "En savoir plus", "url": "https://..." }
}
```
Champs facultatifs : `dateLabel` (texte libre à la place de la date), `lien` (un bouton), `liens` (une liste de liens).
Pour une activité sans fichier d'actualités, créer `data/actualites/<slug-de-l-activite>.json` contenant `[ ... ]`.

## Photos
Les photos viennent de l'ancien site `cli63.com` via les archives web (`imageBase` dans `data/site.json`).
Pour utiliser des photos hébergées avec le site : les déposer dans `public/img/` puis, dans les fichiers de données, mettre `"/img/mon-image.jpg"` (une adresse commençant par `http` ou `/` est utilisée telle quelle).

## Fabriquer le site
```
node build.mjs
```
Écrit les pages dans `dist/`. Netlify exécute cette commande à chaque déploiement (`netlify.toml`).

## Formulaire de contact
Le formulaire utilise Netlify Forms (nom : `contact`). Pour recevoir un e-mail à chaque message :
Netlify → Forms → contact → Settings & usage → Form notifications.
