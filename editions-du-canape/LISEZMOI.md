# Site des éditions du Canapé — mode d’emploi

Ce dossier contient tout le site. Les **textes** sont rangés dans le dossier `data/`, les **images** dans `images/`. La mise en page se fabrique toute seule à partir de ces fichiers : vous n’avez jamais besoin de toucher au HTML.

```
data/
  livres.json       ← les livres du catalogue
  projets.json      ← les livres à paraître
  carnet.json       ← les articles du Carnet
  librairies.json   ← les librairies où trouver les livres
  site.json         ← textes de la maison, équipe, partenaires, frise, adresse
images/
  livres/<nom-du-livre>/    couverture, pages intérieures
  projets/<nom-du-projet>/  visuels des projets
  carnet/                   une photo (ou plus) par article
  maison/                   logo, stickers, dessins
```

## Comment ça marche

1. Vous modifiez un fichier de `data/` et/ou vous déposez des images dans `images/`.
2. Vous envoyez la modification sur le dépôt (GitHub) ou sur Netlify.
3. Netlify lance tout seul `node build.js` : les pages, fiches, filtres, liens entre livres et articles, vignettes de l’accueil, plan du site (`sitemap.xml`) et données pour Google sont recréés.

Pour voir le site sur votre ordinateur avant de publier (il faut [Node.js](https://nodejs.org)) :

```bash
node build.js
npx serve dist
```

puis ouvrez l’adresse affichée (souvent http://localhost:3000).

### Les fichiers `.json` en trois règles

- Le texte est toujours **entre guillemets droits** `"…"`. Pour écrire un guillemet dans un texte, utilisez les guillemets français « … ».
- Les éléments d’une liste sont séparés par des **virgules**, mais il n’y a **pas de virgule après le dernier**.
- Pour mettre un titre en italique, entourez-le d’astérisques : `*Miette la mouette*`. Pour un lien : `[texte du lien](https://adresse.fr)`.

En cas d’erreur de virgule ou de guillemet, Netlify refuse de publier et l’ancien site reste en ligne : rien ne casse. Vous pouvez vérifier un fichier sur https://jsonlint.com.

### Les informations « à préciser »

Quand une information manque (ISBN, imprimeur, directeur de publication…), écrivez simplement `"à préciser"`. Elle s’affichera sur le site dans un petit encadré jaune hachuré, bien visible, pour ne pas l’oublier. Remplacez-la par la bonne valeur dès que vous l’avez.

---

## Ajouter un livre au catalogue

1. Créez un dossier `images/livres/nom-du-livre/` (minuscules, tirets, sans accent ni espace) et déposez-y :
   - `couverture.jpg` (la couverture, idéalement 1500 px de haut) ;
   - `page-01.jpg`, `page-02.jpg`… (les pages intérieures, facultatives : elles forment le feuilletage).
2. Ouvrez `data/livres.json`, copiez un livre existant (de `{` à `}`), collez-le à la fin de la liste (après une virgule) et changez les valeurs :

```json
{
  "slug": "nom-du-livre",
  "titre": "Titre du livre",
  "sousTitre": "sous-titre",
  "accroche": "Une ou deux phrases pour donner envie.",
  "ordre": 9,
  "categories": ["jeunesse", "poesie"],
  "auteurs": ["Prénom Nom"],
  "illustrateurs": ["Prénom Nom"],
  "credits": [
    { "role": "Texte", "noms": "Prénom Nom" },
    { "role": "Illustrations", "noms": "Prénom Nom" },
    { "role": "Maquette et conception graphique", "noms": "Thomas Gerbier" }
  ],
  "presentation": ["Premier paragraphe.", "Deuxième paragraphe."],
  "reliure": "livre broché",
  "pages": 64,
  "format": "17 cm × 24 cm",
  "prix": 12,
  "disponibilite": "en vente",
  "isbn": "978-2-9591989-?-?",
  "date": "janvier 2027",
  "dateISO": "2027-01",
  "impression": "à préciser",
  "librairies": ["bedelire", "jeux-de-pages"],
  "commande": "Pour commander *Titre du livre*, utilisez le formulaire de contact.",
  "couverture": { "src": "images/livres/nom-du-livre/couverture.jpg", "alt": "Description de la couverture pour les personnes aveugles." },
  "vignette": { "src": "images/livres/nom-du-livre/couverture.jpg", "alt": "Couverture de Titre du livre." },
  "images": [
    { "src": "images/livres/nom-du-livre/page-01.jpg", "alt": "Ce que l’on voit sur la page." }
  ]
}
```

- **`slug`** : le nom du dossier, il sert aussi d’adresse de la page (`/livres/nom-du-livre/`).
- **`ordre`** : la place du livre dans le catalogue et sur l’étagère de l’accueil (1 = en premier).
- **`categories`** : choisissez parmi `jeunesse`, `poesie`, `photo-art`, `bilingue`, `ateliers` (livres faits avec des classes), `recherche`. Un livre `ateliers` ou `recherche` apparaît aussi dans la rubrique « Livres en partage ».
- **`prix`** : un nombre avec un point (`14.9` pour 14,90 €), ou `null` si le livre n’est pas vendu.
- **`disponibilite`** : `"en vente"` (bouton « Commander ce livre »), `"hors commerce"` (bouton « Demander un exemplaire ») ou `"épuisé"`.
- **`librairies`** : les identifiants de `data/librairies.json`.
- **`nouveaute": true`** : met le livre en avant sur l’accueil (à n’utiliser que pour un seul livre ; enlevez-le de l’ancien).
- Facultatifs : `"public"`, `"techniques"`, `"langues": ["fr", "it"]`, `"epigraphe"`, `"citation"`, `"avertissement"`, `"partage": true`.
- **`alt`** : décrivez l’image en une phrase. C’est indispensable pour l’accessibilité et pour Google.

Le livre apparaîtra automatiquement dans le catalogue, l’étagère de l’accueil, la liste déroulante du bon de commande, les « livres proches », la carte des librairies et le plan du site.

## Ajouter un projet « À paraître »

1. Déposez le visuel dans `images/projets/nom-du-projet/vignette.jpg` (et éventuellement `image-01.jpg`, `image-02.jpg`…).
2. Dans `data/projets.json`, copiez un projet existant et adaptez-le. Le champ **`statut`** accepte : `"en préparation"`, `"sous presse"`, `"bientôt disponible"`, `"à paraître"` ou `"à préciser"`. Ajoutez `"archive": true` pour ranger un projet dans « Encore dans les cartons ».
3. Le projet apparaît sur la page « À paraître », sur l’accueil (les 4 premiers de la liste) et dans le formulaire « Être prévenu de la sortie ».

Quand le livre paraît : supprimez-le de `projets.json` et ajoutez-le dans `livres.json`.

## Ajouter un article au Carnet

1. Déposez la photo dans `images/carnet/` en la nommant avec la date, par exemple `2027-01-15-salon-du-livre.jpg`.
2. Dans `data/carnet.json`, ajoutez au **début** de la liste :

```json
{
  "slug": "2027-01-15-salon-du-livre",
  "date": "2027-01-15",
  "titre": "Le Canapé au salon du livre",
  "themes": ["rencontres"],
  "texte": ["Premier paragraphe.", "Deuxième paragraphe."],
  "livres": ["chroniques-botaniques"],
  "projets": [],
  "photos": [
    { "src": "images/carnet/2027-01-15-salon-du-livre.jpg", "alt": "Description de la photo." }
  ]
},
```

- **`themes`** : `fabrication`, `rencontres`, `expositions`, `ateliers` (un ou plusieurs).
- **`livres`** / **`projets`** : les `slug` des livres ou projets dont parle l’article. L’article apparaîtra automatiquement dans « L’histoire de ce livre » sur leur fiche.
- Plusieurs photos ? Ajoutez-les dans `photos` : elles formeront une galerie à feuilleter.

Les articles sont triés par date tout seuls ; les 3 plus récents apparaissent sur l’accueil.

## Ajouter une librairie

Dans `data/librairies.json`, copiez une librairie :

```json
{
  "id": "nom-court",
  "nom": "Nom de la librairie",
  "type": "librairie",
  "adresse": "12 rue des Livres",
  "codePostal": "33000",
  "ville": "Bordeaux",
  "site": "https://…",
  "lat": 44.8378,
  "lon": -0.5792
}
```

Les coordonnées `lat` et `lon` placent le point sur la carte : cherchez l’adresse sur https://www.openstreetmap.org, clic droit → « Afficher l’adresse », et recopiez les deux nombres. Ajoutez ensuite `"nom-court"` dans la liste `librairies` des livres concernés.

## Remplacer une image

Déposez la nouvelle image **avec exactement le même nom** au même endroit et supprimez les anciennes versions qui portent le même nom avec `.webp` ou `-640` (par exemple `couverture.webp`, `couverture-640.jpg`, `couverture-640.webp`).

### Optimiser les images (recommandé)

Pour que le site reste rapide, un petit outil fabrique les versions WebP et les vignettes. Il faut Python 3 et Pillow :

```bash
pip install Pillow
python3 outils/optimiser-images.py
```

Il ne traite que les nouvelles images. Sans cet outil, le site fonctionne quand même avec vos JPG.

## Textes de la maison, équipe, adresse

Tout est dans `data/site.json` : présentation, histoire, textes de la page contact, équipe et complices (avec les livres liés), partenaires, étapes de la frise « Comment naît un livre », adresse, RNA, SIRET, directeur de publication.

## Formulaires

Les formulaires (contact/commande et « Être prévenu de la sortie ») utilisent **Netlify Forms**. Les messages arrivent dans l’interface Netlify (rubrique *Forms*). Pour les recevoir par e-mail : *Forms → Form notifications → Add notification → Email notification*. Un champ caché anti-spam est déjà en place.

## Nom de domaine

Le site est publié sur une adresse Netlify. Le jour où vous voudrez y brancher `editionsducanape.fr` : *Netlify → Domain management → Add a domain*. Les anciennes adresses du site Wix (`/miette-la-mouette`, `/projets`, `/bibliotheque`…) sont déjà redirigées vers les nouvelles pages (fichier `_redirects` généré automatiquement).
