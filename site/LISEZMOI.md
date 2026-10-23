# Site du Club Photo de Morestel — mode d'emploi

Site de 5 pages (Accueil, Le club, Galerie, Contact, Adhérent), sans base de données ni logiciel à installer.
**Tout le contenu qui change vit dans le dossier `data/`** (fichiers `.json`) : on ne touche jamais aux pages HTML pour mettre à jour le site.

```
index.html  le-club.html  galerie.html  contact.html  adherent.html   ← les 5 pages
data/
  club.json         textes du club, histoire, valeurs, bureau, coordonnées, mentions légales, chiffres
  auteurs.json      les auteurs (portrait, rôle, présentation)
  reportages.json   les reportages
  sorties.json      les sorties photo
  programme.json    programme du mercredi soir + prochaine sortie
  cours.json        cours et supports de l'espace adhérents
assets/img/         photos (reportages/, sorties/, auteurs/, logo/)
supports/           fichiers PDF et PPTX de l'espace adhérents
```

## Règles d'or pour modifier un fichier `.json`

- Respecter la structure : guillemets `"..."` autour des textes, **virgule entre deux blocs** `{ ... },` (mais pas après le dernier).
- Pour une apostrophe, utiliser `’` ou `'` normalement ; pour un guillemet dans un texte, écrire `\"`.
- Avant d'enregistrer, vérifier le fichier sur <https://jsonlint.com> (copier-coller, « Validate »). Une erreur de virgule empêche la page de s'afficher.
- Dates au format `AAAA-MM-JJ` (ex. `2026-11-04`).

---

## 1. Ajouter un reportage

1. **Préparer les photos** : JPG ou WebP, 1 600 px maximum sur le grand côté, 150 à 300 Ko chacune (8 à 15 photos suffisent : la visionneuse n'est pas là pour tout montrer).
2. **Les déposer** dans un nouveau dossier `assets/img/reportages/AAAA-MM-JJ_nom-court/` (ex. `2026-11-11_commemoration`), nommées `01.jpg`, `02.jpg`…
3. **Ajouter un bloc au début** de la liste `"items"` dans `data/reportages.json` :

```json
{
  "id": "2026-11-11_commemoration",
  "titre": "Commémoration du 11 novembre 1918",
  "date": "2026-11-11",
  "lieu": "Morestel",
  "categorie": "patrimoine",
  "auteurs": ["jacques-vanneuville", "denis-madaule"],
  "dossier": "assets/img/reportages/2026-11-11_commemoration",
  "photos": ["01.jpg", "02.jpg", "03.jpg"],
  "lien": ""
}
```

- `id` : identique au nom du dossier, sans espace ni accent.
- `categorie` : `patrimoine`, `evenement`, `culture` ou `sport` (pour ajouter une catégorie : l'ajouter dans la liste `"categories"` en haut du fichier).
- `auteurs` : les **identifiants** de `data/auteurs.json` (voir plus bas). Un clic sur un auteur affichera ce reportage dans sa vue.
- `photos` : liste des noms de fichiers. Pour créditer chaque photo ou la légender, on peut écrire à la place `{ "f": "01.jpg", "a": "denis-madaule", "l": "Légende" }`.
- `lien` (facultatif) : adresse d'une page externe avec le reportage complet ; le bouton « Voir le reportage complet » n'apparaît que s'il est rempli.
- Sans vignettes (cas simple ci-dessus), la page utilise directement les photos. Pour un site plus rapide, créer des versions réduites (500 px) nommées `01-t.jpg`… et ajouter `"vignettes": true`.
- Pour afficher les chiffres exacts : `"total": 120` (nombre de photos du reportage complet) est facultatif.

L'ordre de la liste n'a pas d'importance : le site trie par date.

## 2. Ajouter une sortie photo

Même principe, dans `data/sorties.json` et le dossier `assets/img/sorties/AAAA-MM-JJ_nom-court/`.
Catégories : `nature`, `nuit`, `visites`. Pour une sortie, on peut ajouter `"note": "Guide : Dominique Baptiste"`.

```json
{
  "id": "2026-12-02_sortie-nuit",
  "titre": "Sortie de nuit à Morestel",
  "date": "2026-12-02",
  "lieu": "Morestel",
  "categorie": "nuit",
  "auteurs": ["denis-madaule", "laurent-mathieu"],
  "dossier": "assets/img/sorties/2026-12-02_sortie-nuit",
  "photos": ["01.jpg", "02.jpg"]
}
```

## 3. Ajouter un auteur

1. Dans `data/auteurs.json`, ajouter un bloc (l'`id` = prénom-nom en minuscules, sans accent, avec des tirets) :

```json
{
  "id": "marie-dupont",
  "nom": "Marie Dupont",
  "role": "Auteure du club",
  "bio": "Passionnée de macrophotographie.",
  "portrait": "assets/img/auteurs/marie-dupont.jpg",
  "site": "",
  "vedette": true
}
```

2. Déposer le portrait (carré ou 4/3, 400 px suffisent) dans `assets/img/auteurs/`. Sans portrait : `"portrait": ""` (les initiales s'affichent).
3. `"vedette": true` → l'auteur apparaît dans la grille « Nos auteurs » de la page Le club. `false` → il n'apparaît que dans les filtres de la galerie.
4. Utiliser cet `id` dans le champ `"auteurs"` des reportages et sorties : sa carte renvoie automatiquement vers la galerie filtrée.

Composition du bureau : bloc `"bureau"` de `data/club.json` (identifiant de l'auteur + rôle).

## 4. Ajouter un cours (espace adhérents)

1. Déposer le fichier **PDF ou PPTX** dans le dossier `supports/`.
2. Ajouter un bloc dans `"items"` de `data/cours.json` :

```json
{
  "id": "composition-2026",
  "titre": "La composition photographique",
  "theme": "Prise de vue",
  "date": "2026-11-04",
  "fichier": "supports/composition-2026.pdf",
  "type": "pdf",
  "taille": "1,2 Mo",
  "description": "Règle des tiers, lignes de fuite, cadrage."
}
```

- `type` : `pdf` ou `pptx`. `theme` : un des thèmes de la liste `"themes"` en haut du fichier (qu'on peut modifier). Les adhérents choisissent un classement **par thème** ou **par date**.
- **Supprimer les deux lignes « exemple »** (`exemple-pdf`, `exemple-pptx`) et les fichiers `supports/exemple-*` dès que de vrais supports sont en ligne.

### Protéger l'espace adhérents par mot de passe

La page `adherent.html`, les fichiers de `supports/` et `data/cours.json` sont protégés par une fonction Netlify (`netlify/edge-functions/adherent-auth.ts`) **dès qu'un mot de passe est défini** :

1. Netlify → le site → *Site configuration* → *Environment variables* → *Add a variable*.
2. `ADHERENT_PASSWORD` = le mot de passe choisi (portée : **Functions**, cocher « Contains secret values »). Facultatif : `ADHERENT_USER` pour l'identifiant (par défaut : `adherent`).
3. Relancer un déploiement (*Deploys* → *Trigger deploy*). Le navigateur demande alors identifiant + mot de passe.

Tant que `ADHERENT_PASSWORD` n'est pas défini, **l'espace est ouvert à tous**. Pour changer le mot de passe : modifier la variable puis redéployer.

## 5. Changer le programme du mercredi soir

Dans `data/programme.json`, bloc `"mercredi"` → liste `"soirees"`. Ajouter une soirée :

```json
{
  "date": "2026-11-04",
  "theme": "Le portrait en lumière naturelle",
  "intervenant": "Eric Fabre",
  "texte": "Apportez votre appareil et deux ou trois portraits à commenter.",
  "lieu": "",
  "horaire": ""
}
```

- Le site affiche **automatiquement la prochaine soirée** (date ≥ aujourd'hui) à l'accueil et dans le bandeau sous le menu. `lieu` et `horaire` laissés vides = valeurs par défaut du bloc (Maison Claret, 20h00 – 22h00).
- Les soirées passées disparaissent de l'affichage principal ; la dernière reste mentionnée en bas du bloc.
- Quand aucune soirée à venir n'est saisie, le **texte d'attente** s'affiche (champ `"attente"` : « Date à confirmer », « Thème à annoncer »…). Il se modifie dans le même fichier.
- Même logique pour la **prochaine sortie** (bloc `"prochaine_sortie"` : renseigner `date`, `lieu`, `theme` ; tant qu'ils sont vides, le texte `attente` s'affiche).

---

## Autres textes modifiables (`data/club.json`)

| Je veux changer… | Champ |
|---|---|
| e-mail, adresse, téléphone (affiché sur la page Contact s'il est renseigné) | `email`, `adresse`, `telephone` |
| contact du club | `contact` |
| liens du pied de page (réseaux sociaux…) | `reseaux` (ajouter `{ "nom": "Facebook", "url": "https://…" }`) |
| histoire, valeurs, activités | `histoire`, `valeurs`, `activites` |
| cotisation, modalités d'inscription | `rejoindre` |
| chiffres clés de l'accueil | `chiffres` (`adherents` : écrire un nombre pour faire apparaître le compteur) |
| mentions légales | `mentions` |
| photos du diaporama d'accueil | `hero` (chemin d'une photo déjà en ligne, légende, crédit, lien) |

Les compteurs « reportages », « sorties » et « auteurs » se calculent seuls à partir des fichiers de données ; « ans d'existence » à partir de `annee_creation`.

## Formulaire de contact

Le formulaire utilise **Netlify Forms** (aucun serveur à gérer). Les messages arrivent dans Netlify → *Forms* → `contact`.
Pour les recevoir **par e-mail** : *Forms* → *Form notifications* → *Add notification* → *Email notification* → saisir l'adresse du club.
Les messages jugés indésirables sont dans l'onglet *Spam* (à vérifier de temps en temps).

## Points à valider par le club

- **Bureau** : la composition affichée vient de la page « Le bureau » du site actuel (Laurent Mathieu, président). La fiche du club sur le site de la Fédération Photographique de France indique d'autres fonctions (présidente : Cassandra Bellot, secrétaire : Laurent Mathieu) et des horaires de 20h30 à 22h30. À confirmer, puis corriger `bureau`, `rejoindre.reunions` et `programme.json`.
- **Hivernales** : le compteur affiche 17 éditions (2010 → 2026), déduit de la numérotation officielle (15e édition en 2024). À ajuster dans `chiffres`.
- **Réseaux sociaux** : aucune page Facebook / Instagram du club n'a été trouvée ; à ajouter dans `reseaux`.
- **Téléphone** et **modalités d'inscription** : non trouvés, textes d'attente en place.
- **Photos** : issues du site actuel (photomorestel.com, rubriques Reportages 2023-2026 et Sorties photo 2016-2020), publiées avec le nom de leur auteur. Pour les sorties 2016-2019 de l'ancien site, la liste des auteurs est celle de la sortie (les photos n'y sont pas attribuées une à une). Chaque reportage renvoie vers sa version complète sur l'ancien site.
- **Catégories** des reportages (Patrimoine, Événement, Expos & culture, Sport) : proposées pour le site, à ajuster.

## Mettre en ligne une modification

- **Site relié à GitHub** : modifier les fichiers sur GitHub (bouton ✏️), valider (*Commit changes*) : Netlify republie en 1 minute.
- **Sans GitHub** : <https://app.netlify.com> → le site → *Deploys* → glisser-déposer le dossier du site complet.

Les fichiers `data/*.json` ne sont pas mis en cache : une modification est visible dès la fin du déploiement.
