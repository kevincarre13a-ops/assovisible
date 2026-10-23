# Site de la SIALB — mode d'emploi pour alimenter le site

Société Internationale des Amis de La Boétie · maquette multi-pages, sans aucune page « figée » : toutes les rubriques sont des **listes de blocs** lues dans des fichiers de données (`data/`). Pour ajouter, modifier ou supprimer un bloc, on modifie **uniquement le fichier de données** de la liste concernée. On ne touche jamais à la mise en page (HTML / CSS / JS).

- **Contact technique** : Thomas — thomas@jungleprod.com
- **Hébergement** : Netlify (site statique, aucune étape de build)
- **Formulaire de contact** : Netlify Forms (voir « Formulaire » plus bas)

## Règles communes à tous les fichiers `.json`

1. Un fichier = une liste. Chaque bloc est un objet `{ ... }` ; les blocs sont séparés par une virgule ; la liste est entourée de `[` et `]`.
2. Les textes sont entre guillemets `"..."`. Une apostrophe `'` est autorisée ; pour un guillemet droit dans un texte, écrire `\"`. Pour séparer deux paragraphes dans un champ `texte`, écrire `\n\n`.
3. Les dates techniques s'écrivent `AAAA-MM-JJ` (ex. `2026-11-12`). Le champ `dateLibelle` est le texte affiché (ex. « 12 et 13 novembre 2026 »).
4. Un lien s'écrit `{ "label": "Texte du bouton", "url": "https://..." }`. Un fichier à télécharger s'écrit pareil, avec une url relative : `{ "label": "Télécharger le programme", "url": "files/programmes/mon-fichier.pdf" }`.
5. Les images et PDF se déposent dans `assets/img/...` et `files/...`, puis on indique leur chemin dans le champ voulu.
6. Un champ inutile peut être laissé vide (`""`) ou `null` (pour un lien), il n'est alors pas affiché.
7. Après modification, vérifier que le fichier reste valide (virgules, guillemets) : un éditeur comme VS Code souligne les erreurs. En cas d'erreur, la liste affiche « momentanément indisponible ».
8. Les blocs marqués `"attente": true` sont des **textes d'attente** : ils s'affichent avec une pastille « Texte d'attente » et un cadre en pointillés. Les remplacer par le contenu réel (et supprimer la ligne `"attente": true`).

## Liste par liste

### Rencontres — `data/rencontres.json`
Page **Rencontres** et mise en avant automatique sur l'**Accueil** : la rencontre dont `dateDebut` est la plus récente est affichée en tête et sur l'accueil (« Dernière rencontre », ou « Prochaine rencontre » si sa date est dans le futur). L'ordre dans le fichier n'a pas d'importance.

| Champ | Contenu |
|---|---|
| `id` | numéro de la rencontre (ex. `"12"`) |
| `numero` | « Douzièmes Rencontres La Boétie » |
| `titre`, `sousTitre` | thème de la rencontre |
| `dateDebut`, `dateFin` | `AAAA-MM-JJ` (sert au tri) |
| `dateLibelle` | date affichée |
| `lieu` | lieu |
| `organisateurs` | qui organise |
| `texte` | présentation, programme résumé |
| `affiche` | image de l'affiche (ex. `assets/img/affiches/rencontre-12.jpg`) ; vide = numéro en chiffres romains |
| `fichier` | programme PDF `{label, url}` |
| `liens` | liste de liens supplémentaires `[{label, url}]` |

### Agenda — `data/agenda.json`
Page **Agenda** : les événements à venir (ou sans date) sont en premier, les événements passés ensuite. Le classement est automatique d'après `date`.

| Champ | Contenu |
|---|---|
| `id` | identifiant libre, unique |
| `date`, `dateFin` | `AAAA-MM-JJ` (`dateFin` facultatif) ; `date` vide = « à venir » |
| `dateLibelle` | date affichée |
| `precision` | `"mois"` si seul le mois est connu |
| `titre`, `lieu`, `description` | texte de la carte |
| `lien` | bouton `{label, url}` |

### Bureau — `data/bureau.json`
Bloc « Le bureau de la SIALB » (page SIALB). Champs : `nom`, `role`, `groupe` (« Bureau », « Membre d'honneur », « Présidents d'honneur » : les groupes s'affichent dans l'ordre d'apparition), `photo` (chemin de l'image, vide = initiales), `texte` (présentation), `lien` (facultatif).

### Histoire — `data/histoire.json`
Bloc « Histoire de la SIALB » (texte simple, du plus récent au plus ancien). Champs : `annee`, `texte`.

### Partenaires — `data/partenaires.json`
Grille « Les partenaires de la SIALB » (page SIALB ; les universités sont aussi reprises sur l'Accueil). Champs : `nom`, `groupe` (« À Sarlat », « Organismes universitaires »… un nouveau nom crée un nouveau groupe), `logo` (déposer le fichier dans `assets/img/partenaires/`), `url`.

### Présentation de la page SIALB — `data/sialb-blocs.json`
Blocs « Présentation », « Avec le Lycée Pré de Cordy », « Adhérer ». Champs : `id`, `titre`, `texte`, `image` (facultatif), `lien`.

### Frise chronologique (Accueil) — `data/frise.json`
Champs : `annee`, `categorie` (`"vie"` = vie de La Boétie 1530-1563 ; `"oeuvre"` ou `"reception"` = œuvre et réception ; `"sialb"` = histoire de l'association), `titre`, `texte`. Les repères s'affichent dans l'ordre du fichier.

### Études & outils — `data/etudes/`
Chaque liste est un fichier distinct, géré séparément (page **Études & outils**).

| Fichier | Contenu | Champs principaux |
|---|---|---|
| `etudes.json` | Études (biographie, textes de référence) | `titre`, `auteur`, `categorie`, `texte`, `image`, `lien` |
| `manuscrits.json` | Manuscrits et éditions imprimées anciennes | `numero`, `categorie` (« Manuscrit » ou « Édition imprimée du XVIe siècle » : crée les filtres), `titre`, `cote`, `texte`, `image`, `lien`, `mention` (ex. « Non consultable en ligne ») |
| `publications.json` | Publications de la SIALB | `collection` (regroupe les volumes), `numero`, `date`, `titre`, `auteur`, `texte`, `lien` |
| `articles.json` | Articles, thèses et mémoires | `titre`, `auteur`, `date`, `dateLibelle`, `texte`, `lien`, `fichier` |
| `outils.json` | Outils (bibliographie, ressources en ligne) | `titre`, `categorie`, `texte`, `lien` |

### Carnets — `data/carnets/`
Mêmes cinq listes que Études & outils, avec leur propre contenu : `etudes.json`, `manuscrits.json`, `publications.json`, `articles.json`, `outils.json` (mêmes champs que ci-dessus). Pour ajouter un texte des Carnets, ajouter un bloc dans `articles.json` avec `fichier` : `{ "label": "Télécharger l'article (PDF)", "url": "files/carnets/mon-article.pdf" }`, après avoir déposé le PDF dans `files/carnets/`.

### Mentions légales — `data/mentions.json`
Champs : `titre`, `texte`. Chaque bloc est une section de la page.

### Titres, introductions et coordonnées
- `data/pages.json` : titre, accroche (`lead`), image d'en-tête et titres de sections de chaque page, texte du héro de l'Accueil (dont la citation).
- `data/site.json` : nom, adresse, courriel, téléphone (laisser vide tant qu'il n'est pas connu), lien d'adhésion HelloAsso, entrées du menu et du pied de page.

## Formulaire de contact (Netlify Forms)
Le formulaire `contact` est détecté automatiquement par Netlify au déploiement (anti-spam « honeypot » intégré). À faire dans l'interface Netlify : *Project configuration → Forms → Form notifications → Add notification → Email* et renseigner l'adresse qui doit recevoir les messages (ex. contact@sialb.fr). Les messages sont aussi consultables dans l'onglet *Forms*.

## Mettre à jour le site
Tout dossier `sialb/` modifié se redéploie tel quel sur Netlify (glisser-déposer du dossier ou déploiement en ligne de commande). Aucune compilation n'est nécessaire.

## Reprise du contenu du site actuel (sialb.fr) : choix et points à valider

Contenus repris du site Wix actuel : bureau, histoire, partenaires, Rencontres (programmes PDF, affiches), manuscrits et imprimés, publications, biographie, Carnets, coordonnées. Les logos, dessins du bureau, scans du manuscrit Mériadeck et affiches viennent du site actuel ; les gravures (bandeau, lettrine) de l'édition Bonnefon de 1892 (domaine public) ; la statue et la maison natale proviennent de Wikimedia Commons (licence CC BY-SA 4.0, crédits dans les mentions légales).

**Non repris, volontairement**
- L'ancien « Agenda » ne contenait que des articles de démonstration du modèle Wix (faux titres, « lorem ipsum »). Il a été remplacé par de vraies dates issues des Rencontres.
- Le téléphone « 06 00 00 00 00 » et l'adresse « 14 rue de la SIALB » du site actuel sont des valeurs de démonstration : seule l'adresse de l'Hôtel de Ville de Sarlat et contact@sialb.fr sont utilisés.

**À valider par le bureau**
- *Date de fondation* : le texte de présentation (conservé tel quel) dit « fondée en 2003 », alors que l'historique indique une création en 2001 (enregistrée au Journal officiel le 29 décembre 2001) et une première assemblée générale en 2002.
- *Date de la mort de La Boétie* : le texte d'origine disait « le 18 janvier 1563 » après avoir indiqué qu'il tombe malade en juillet 1563. La date retenue est **le 18 août 1563** (date historique usuelle) ; à confirmer par l'auteur de la biographie.
- *3es Rencontres* : le site actuel les intitule « Servitude volontaire et psychiatrie », le programme PDF « Servitude volontaire et psychanalyse » (titre retenu).
- *Lieu des 11es Rencontres* : non précisé sur le site actuel ; « Bordeaux » est repris du programme PDF.
- *Mentions légales* : le SIREN et le directeur de la publication sont des textes d'attente à confirmer.
- *Portraits du bureau* : les dessins d'origine ont été repris dans l'ordre d'affichage du site actuel ; à vérifier.
- *Affiche des 9es Rencontres* : aucun visuel exploitable ; une carte typographique la remplace.
- Quelques coquilles du site actuel ont été corrigées (ex. « éditins », « manucrit », « Sécrétaire », « Vejdova » → Vejvoda, « Nicolà » → Nicola Panichi).
- Les listes « Articles, thèses et mémoires », « Sitographie » et les listes des Carnets (hors la recension de Sylvia Giocanti) étaient vides sur le site actuel : elles contiennent des textes d'attente.
- Le menu comporte 7 entrées ; **Mentions légales** est accessible depuis le pied de page de toutes les pages.
