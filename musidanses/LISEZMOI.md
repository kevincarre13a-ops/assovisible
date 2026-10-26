# Le site de Musidanses : mode d'emploi très simple

Tout le contenu du site est dans le dossier **data** (fichiers `.json`) et le dossier **affiches**. Vous n'avez jamais besoin de toucher aux pages `.html`.

**Règle d'or** : dans un fichier `.json`, gardez les guillemets `"` et les virgules. Chaque bloc `{ ... }` est séparé du suivant par une virgule, sauf le dernier.

## 1. Ajouter un événement
1. Ouvrez `data/evenements.json`.
2. Copiez un bloc existant (de `{` à `}`) et collez-le **en haut de la liste**.
3. Changez les textes :
   - `"id"` : un nom court sans espace ni accent, unique (ex. `"gala-2027"`)
   - `"titre"`, `"date"` au format `"2027-06-12"` (année-mois-jour), `"debut"` et `"fin"` (ex. `"20:30"`), `"lieu"`, `"tarif"`, `"description"`
   - `"saison"` : ex. `"2026-2027"` (sert à classer les archives)
   - `"affiche"` : laissez `""` pour une affiche créée automatiquement, ou mettez le chemin de votre affiche (voir 2.)
4. Enregistrez. L'événement apparaît sur l'accueil (carrousel, compte à rebours) et sur la page Événements. Quand sa date est passée, il passe tout seul dans les archives de la saison.

Date pas encore connue ? Mettez `"date": ""` et écrivez `"date_texte": "Date à venir"`.

## 2. Remplacer ou ajouter une affiche
1. Mettez votre image (JPG ou PNG, format portrait de préférence) dans le dossier **affiches** (ex. `affiches/gala-2027.jpg`).
2. Dans `data/evenements.json`, sur l'événement concerné, écrivez : `"affiche": "affiches/gala-2027.jpg"`.
3. Le bouton « Télécharger l'affiche » fonctionne automatiquement. Sans image, le site fabrique une affiche avec le titre, la date, le lieu et le tarif : vous pouvez la télécharger en PNG.

## 3. Ajouter une photo
1. Mettez la photo dans `assets/img/` (idéalement moins de 300 Ko, largeur 1200 px maximum).
2. Ouvrez `data/galerie.json`, copiez une ligne de `"medias"` et changez `"fichier"` (ex. `"assets/img/ma-photo.jpg"`), `"legende"` et `"categorie"` (une valeur de la liste `"categories"`).
3. Une vidéo YouTube : `{ "type": "youtube", "categorie": "flamenco", "id": "CODE_DE_LA_VIDEO", "legende": "Titre" }`.

## 4. Modifier un horaire
1. Ouvrez `data/cours.json` et trouvez le cours.
2. Dans `"creneaux"`, changez `"jour"`, `"debut"`, `"fin"` (ex. `"19:15"`).
3. Enregistrez : la fiche, le planning de la semaine et l'accueil sont mis à jour.
Même méthode pour le lieu, le tarif, l'animateur (`"animateur"`) ou pour mettre un cours en pause (`"statut": "pause"`).

## 5. Autres textes
- Actualités : `data/actualites.json`
- Bureau et animateurs : `data/equipe.json` (les « À renseigner » sont à compléter)
- Téléphone, e-mail, adresse, Facebook : `data/site.json`

## 6. Mettre en ligne
Déposez le dossier modifié sur Netlify (glisser-déposer sur l'onglet Deploys), ou envoyez les fichiers modifiés sur GitHub si le site est relié.
Les messages du formulaire de contact arrivent dans Netlify > Forms. Pour les recevoir par e-mail : Site configuration > Forms > Form notifications.
