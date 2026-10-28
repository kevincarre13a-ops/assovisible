# Site vitrine — Photo Ciné Club Sénonais

Site statique multi-pages (HTML/CSS/JS, sans backend), publié depuis le dossier `site/`.

## Mettre à jour les contenus (sans toucher à la mise en page)
Tout se trouve dans `site/data/*.json` :
- `club.json` : coordonnées, réunion mensuelle, bureau, chiffres clés, tarif et séance d'essai
- `authors.json` : auteurs (nom, travaux, présentation, portrait optionnel)
- `gallery.json` : photos (fichier, miniature, titre, auteur, thème, album)
- `events.json` : expositions et événements (les dates décident de « à venir » / « archives »)
- `news.json` : actualités
- `films.json` : films YouTube / Vimeo (liste vide pour l'instant, voir le bloc `modele`)

Les textes marqués « À compléter » dans le site (histoire, cotisation, séance d'essai, cinéma/vidéo, statut juridique) attendent l'information du club.

## Régénérer les pages
`python3 tools/build.py` (en-tête, menu et pied de page communs).

## Droits d'auteur
Les photos proviennent des pages publiques du club (blog et galerie Piwigo) et sont créditées à leurs auteurs. Leur accord est à confirmer avant mise en ligne définitive.
