# Site Graines de Cabane : mode d'emploi

Site statique multi-pages (HTML, CSS, JavaScript sans framework), hébergé sur Netlify.
Les formulaires passent par Netlify Forms (aucun serveur à gérer).

## Organisation des fichiers

```
graines-de-cabane/
├── build.mjs            ← assemble les pages (en-tête, pied de page, icônes) dans dist/
├── netlify.toml         ← réglages Netlify (commande « node build.mjs », dossier « dist »)
├── src/pages/*.html     ← le contenu de chaque page (textes à modifier ici)
└── static/
    ├── css/style.css    ← couleurs, polices, animations
    ├── js/main.js       ← interactions (agenda, carrousel, carte, compteurs…)
    ├── data/*.json      ← LES DONNÉES À METTRE À JOUR (agenda, témoignages…)
    ├── fonts/           ← Fredoka et Nunito, hébergées sur le site
    └── images/          ← toutes les images (voir la liste ci-dessous)
```

Après chaque modification envoyée sur GitHub, Netlify reconstruit le site tout seul.
Pour tester sur votre ordinateur : `node build.mjs` puis ouvrez le dossier `dist/` avec un petit serveur
(par exemple `npx serve dist`).

---

## Mettre à jour les données (sans toucher à la mise en page)

Les fichiers sont dans `static/data/`. Respectez bien les guillemets et les virgules du format JSON
(un vérificateur en ligne comme jsonlint.com aide à repérer une erreur).

### L'agenda : `agenda.json`

Une ligne par rendez-vous :

```json
{ "date": "2027-03-06", "titre": "Des jeux pour rêver", "type": "permanence" }
```

- `date` : au format AAAA-MM-JJ.
- `fin` (facultatif) : pour un événement sur plusieurs jours, par exemple le défi du 4 au 31 janvier.
- `type` : `permanence` (turquoise), `evenement` (corail), `atelier` (orange), `defi` (vert).
- `lieu` et `horaires` (facultatifs) : sinon, « salle Tourren » et « 9h30 à 12h30 » s'appliquent.
- `description` (facultatif) : une phrase de détail (tarif, inscription…).

Tout le reste est automatique : le bouton « Prochain RDV ! » de l'accueil, les 3 prochaines dates des
cartes, le calendrier, la liste « À venir » et les archives se calculent avec la date du jour.

### Les témoignages : `temoignages.json`

```json
{ "prenom": "Justine", "qualite": "maman", "contexte": "Tyrosse, septembre 2026", "texte": "Un vrai moment…" }
```

Ils défilent dans l'ordre du fichier. Ajoutez, retirez ou réordonnez librement.

### Les lieux de récolte : `lieux-recolte.json`

Une entrée par commune, avec la liste des lieux et la position du repère sur la carte (`lat`, `lng`).
Pour trouver ces coordonnées : clic droit sur Google Maps, la première ligne affiche « 43.66, -1.30 ».
Cette liste alimente les pages Seconde vie, Point de récolte et Contact.

### Les pays : `pays.json`

```json
{ "nom": "Sénégal", "iso": "686", "continent": "Afrique" }
```

`iso` est le code numérique du pays (norme ISO 3166, à trouver sur Wikipédia, article « ISO 3166-1 »).
Le pays s'allume automatiquement sur la carte du monde et apparaît dans la légende. Pensez aussi à
mettre à jour la mention « 15 pays » dans les textes si le nombre change.

### La jauge du défi 300 kg : `defi.json`

Changez `"kgRecoltes": 0` par le poids récolté (un nombre, sans guillemets) et `"miseAJour"` par la date
(texte libre, ex. `"15 janvier 2027"`). La jauge se remplit toute seule. Par défaut elle est à 0 :
aucun chiffre n'est inventé.

### Les grands jeux : `grands-jeux.json`

Les 42 jeux (numéro, nom, photo). La grille de la page Prêt et location et les cases à cocher du
formulaire de location sont générées à partir de ce fichier.

### La galerie : `galerie.json`

```json
{ "src": "images/galerie/fete-magescq-1.jpg", "alt": "Grands jeux en bois à la fête de Magescq", "categorie": "animations" }
```

Catégories : `permanences`, `animations`, `grands-jeux`, `collecte`, `monde`. Tant qu'une catégorie n'a
pas de photo, des cases illustrées « Photos bientôt en ligne » s'affichent.

### Les affiches programme : `affiches.json`

Liste des affiches affichées en vignettes cliquables (Agenda, Permanences). Mettez la plus récente en premier.

---

## Images à fournir

Toutes les images actuelles sont des visuels d'attente illustrés (aucune image cassée). Remplacez
chaque fichier **en gardant exactement le même nom**. Formats conseillés : JPG qualité 75 à 80 pour les
photos, PNG pour le logo et les affiches.

| Fichier | Taille conseillée | Page(s) | État actuel |
|---|---|---|---|
| `images/logo-gdc.png` | 640 × 294 px, fond transparent | Toutes (en-tête, pied de page) | Logo officiel en place |
| `images/favicon.png` | 64 × 64 px | Onglet du navigateur | En place |
| `images/hero.jpg` | 1900 × 1270 px, paysage | Accueil (grand bandeau) | Photo provisoire de plateau de jeu (Unsplash) |
| `images/qui-sommes-nous-abdel.jpg` | 900 × 1125 px, portrait | Accueil, « Qui sommes-nous ? » | Visuel d'attente |
| `images/illustration-plateau.jpg` | 1200 × 800 px | L'association (mission) | Photo provisoire de plateau (Unsplash) |
| `images/og-graines-de-cabane.jpg` | 1200 × 630 px | Aperçu lors des partages (Facebook…) | Visuel au logo |
| `images/affiche-programme-sept-dec-2026.png` | 1024 × 1536 px | Agenda, Permanences | Affiche fournie |
| `images/affiche-programme-dec-2026-fev-2027.png` | 1024 × 1536 px | Agenda, Permanences | Affiche fournie |
| `images/affiche-ambassadeur.png` + `.pdf` | 1054 × 1492 px | Ambassadeur (agrandissement + PDF) | Affiche « Vos jeux déjà dans le monde / Devenez ambassadeurs ! » |
| `images/affiche-point-de-recolte.png` | 1054 × 1492 px | Point de récolte | Affiche fournie |
| `images/affiche-nouvelle-vie-jeux.png` | 1054 × 1492 px | Seconde vie des jeux | Affiche fournie |
| `images/affiche-jeux-dans-le-monde.png` | 1054 × 1492 px | Réserve (même affiche que l'ambassadeur) | Affiche fournie |
| `images/vignettes/*.webp` | 520 px de large | Vignettes des affiches | Générées depuis les affiches |
| `images/grands-jeux/01.jpg` à `42.jpg` | 800 × 600 px, paysage 4:3 | Prêt et location | Visuels d'attente numérotés |
| `images/galerie/…` | 1200 px max sur le grand côté | Galerie | À ajouter + déclarer dans `galerie.json` |
| Photos d'équipe (facultatif) | 400 × 400 px, carré | L'association | Silhouettes en attente |

Quand vous remplacez une affiche, pensez à régénérer sa vignette (520 px de large, format WebP ou JPG)
ou à pointer `vignette` vers l'image en grand dans `affiches.json`.

Rappel : pas de photo d'enfant identifiable sans autorisation écrite des parents.

---

## Formulaires (Netlify Forms)

Quatre formulaires : `contact`, `location`, `ambassadeur`, `point-de-recolte`. Les messages arrivent
dans l'interface Netlify (onglet **Forms**). Pour les recevoir par e-mail :
Netlify › Project configuration › Notifications › Emails and webhooks › Form submission notifications.
Un champ piège invisible bloque les robots ; la page `merci.html` s'affiche après l'envoi.

Le sujet du formulaire de contact peut être présélectionné par l'adresse :
`contact.html?sujet=devis` (devis, location, adhesion, don, point-de-recolte, ambassadeur, benevolat,
temoignage, autre).

## Nom de domaine

Le site est en ligne sur l'adresse Netlify. Le domaine grainesdecabanes.org n'a pas été modifié :
pour le brancher plus tard, Netlify › Domain management › Add a domain, puis suivre les instructions DNS.
Les adresses des pages (`/association`, `/animations`, `/agenda`…) sont les mêmes que sur l'ancien site.

## Accessibilité et animations

Toutes les animations se coupent automatiquement si le visiteur a activé « Réduire les animations »
sur son appareil. Les couleurs respectent les contrastes, tout se pilote au clavier.
