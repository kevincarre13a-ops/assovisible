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

## Photos et logo
Toutes les images sont hébergées avec le site, dans `public/img/` :
- `club/` : photos des albums du club (voyages 2024 et 2025) ;
- `activites/` : images issues des contenus du club (vidéo informatique, séjour vélo) ;
- `illustrations/` : photos libres de droits (Unsplash) affichées avec la mention « Photo d'illustration », à remplacer par des photos des séances dès qu'elles existent ;
- `logo-cli.png` et `logo-cli@2x.png` : le logo du club sur fond transparent.

Chaque photo existe en deux tailles : `nom-m.jpg` (720 px) et `nom.jpg` (1600 px). Dans les données, on écrit le chemin sans extension, par exemple `"club/der24-25"`.
Pour remplacer une illustration par une vraie photo : déposer les deux fichiers dans `public/img/…`, mettre le chemin dans `photos` de l'activité et passer `"illustration"` à `false`.

## Couleurs
Les couleurs des thèmes sont celles du logo (`data/themes.json`) : rouge (Convivialité), orange (Solidarité, mélange du rouge et du jaune du logo), vert (Sorties), jaune (Ateliers), bleu (Nouvelles technologies). Chaque thème a une couleur vive (`couleur`), une version foncée lisible pour le texte (`fonce`) et une teinte claire (`teinte`).

## Fabriquer le site
```
node build.mjs
```
Écrit les pages dans `dist/`. Netlify exécute cette commande à chaque déploiement (`netlify.toml`).

## Formulaire de contact
Le formulaire utilise Netlify Forms (nom : `contact`). Pour recevoir un e-mail à chaque message :
Netlify → Forms → contact → Settings & usage → Form notifications.
