# Archive du site Wix de la SIALB — 18 novembre 2026

Sauvegarde complète du site **www.sialb.fr** (Société Internationale des Amis de La Boétie), réalisée le **18 novembre 2026**, le jour de la résiliation du forfait Wix demandée par Thomas Gerbier. Après la résiliation, le site reste visible à l'adresse gratuite `thomas92115.wixsite.com/sialb` ; au moment de l'archivage, cette adresse redirigeait encore vers www.sialb.fr.

Cette archive contient tout ce qui est visible publiquement sur le site, sous une forme lisible et exploitable sans Wix. Elle sert de source pour le nouveau site, dont la maquette se trouve dans le dossier `sialb/` de ce dépôt.

## En bref

| | |
|---|---|
| Pages archivées | 7 pages du menu + 6 articles de l'Agenda (fictifs) |
| Images originales (pleine résolution) | 32, dont 22 propres à la SIALB |
| Documents | 12 PDF (11 programmes de Rencontres, 1 texte des Carnets) |
| Fichiers au total | 157 (environ 65 Mo) ; chacun est recensé dans `inventaire.csv` avec sa source et son empreinte SHA-256 |
| Contrôles | toutes les pages ont répondu normalement (HTTP 200) sur ordinateur et sur mobile ; tous les fichiers ont été téléchargés |

Pour **lire tout le texte du site d'un seul tenant**, ouvrir `CONTENU-COMPLET.md`.

## Organisation du dossier

```
sialb-wix-2026-11-18/
├── LISEZMOI.md                 ce document
├── CONTENU-COMPLET.md          texte intégral des 7 pages, dans l'ordre du menu
├── inventaire.csv              liste de tous les fichiers : source, page d'origine, texte alternatif, taille, SHA-256
├── pages/
│   ├── 01-accueil/ … 07-contact/        une page = un dossier (voir ci-dessous)
│   └── blog-demo-wix/                   les 6 articles fictifs de l'Agenda
├── medias/images/
│   ├── logo/                            logo SIALB d'origine
│   ├── bureau-portraits/                les 8 dessins du bureau, nommés par personne
│   ├── partenaires-logos/               les 10 logos des partenaires
│   ├── manuscrit-meriadeck-bandeaux/    les 3 scans du manuscrit Mériadeck (bandeaux)
│   ├── elements-graphiques-site/        bouton « Haut de page » du gabarit
│   ├── icones-reseaux-wix/              icônes Facebook / Twitter / LinkedIn du modèle Wix
│   └── agenda-articles-fictifs/         images des articles fictifs (photos de banque d'images Wix)
├── documents/
│   ├── rencontres-programmes/           programmes des Rencontres 1 à 11 (2004-2025)
│   └── carnets/                         recension de Sylvia Giocanti (novembre 2025)
└── technique/
    ├── sitemaps/                        plans du site et robots.txt publiés par Wix
    └── recap-navigateur.json            journal de l'archivage (médias et documents vus par page)
```

### Contenu de chaque dossier de page

| Fichier | Rôle |
|---|---|
| `LISEZ-MOI-page.md` | texte de la page, structure des titres, documents et liens externes, champs de formulaire |
| `capture-ordinateur.jpg` | capture pleine page à 1440 px de large |
| `capture-mobile.jpg` | capture pleine page à 390 px de large (affichage téléphone) |
| `page.pdf` | version imprimable de la page telle qu'affichée |
| `page-rendue.html` | HTML de la page après affichage complet dans le navigateur |
| `source-serveur.html` | HTML brut envoyé par Wix |
| `texte.txt` | texte brut |
| `details.json` | métadonnées (titre, description), liens, titres, polices et couleurs, champs de formulaire |

## Méthode

1. Inventaire des pages à partir des plans du site publiés par Wix (`sitemap.xml`, pages, articles, catégories), pour ne pas oublier de page absente du menu.
2. Affichage de chaque page dans un vrai navigateur (Chromium), sur ordinateur puis sur mobile, avec défilement complet pour charger les images différées.
3. Relevé de toutes les images (balises, arrière-plans, données Wix) et de tous les documents, recoupé avec le HTML brut, puis téléchargement des **fichiers originaux en pleine résolution**, sans les versions réduites affichées par Wix.
4. Nommage lisible, classement par usage, calcul d'une empreinte SHA-256 par fichier pour pouvoir en vérifier l'intégrité.
5. Comparaison du texte archivé avec le contenu repris dans la maquette : **rien ne manque**. Les écarts sont des intertitres de navigation, des coquilles corrigées dans la maquette ou les contenus fictifs écartés.

## Correspondance avec la maquette du nouveau site (`sialb/`)

| Contenu du site Wix | Où il se trouve dans la maquette |
|---|---|
| Présentation, activités avec le lycée, adhésion | `sialb/data/sialb-blocs.json` |
| Bureau (8 membres + Grand Stratéguerre) | `sialb/data/bureau.json` ; dessins dans `sialb/assets/img/portraits/` (attribution vérifiée sur la capture de l'archive) |
| Historique 2001-2021 | `sialb/data/histoire.json` |
| Partenaires (10 logos et liens) | `sialb/data/partenaires.json` |
| Rencontres 1 à 11 + programmes PDF | `sialb/data/rencontres.json`, `sialb/files/programmes/` |
| Biographie, Montaigne éditeur | `sialb/data/etudes/etudes.json` |
| Manuscrits (10) et éditions du XVIe siècle (4) | `sialb/data/etudes/manuscrits.json` |
| Publications (Cahiers La Boétie, Études montaignistes) | `sialb/data/etudes/publications.json` |
| Carnets (recension Giocanti) | `sialb/data/carnets/articles.json`, `sialb/files/carnets/` |
| Coordonnées | `sialb/data/site.json` |

## Points d'attention

**Contenus à ne pas reprendre**
- Les 6 articles de l'**Agenda** (« viandard ou flexitarien ? », « le SMS qui met le feu aux poudres »…) sont des contenus fictifs posés sur les articles de démonstration du modèle Wix (« lorem ipsum »). Ils sont archivés pour être complet, dans `pages/blog-demo-wix/`.
- L'adresse « **14 rue de la SIALB** » (page Contact) et le téléphone « **06 00 00 00 00** » (pied de page) sont des valeurs de démonstration du modèle Wix. La seule adresse réelle est celle de l'Hôtel de Ville de Sarlat.
- Les liens Facebook, Twitter et LinkedIn du pied de page pointent vers les comptes de **Wix**, pas vers ceux de la SIALB.

**Charte graphique d'origine** (relevée sur le site) : titres en *Oswald*, texte courant en *Avenir Light*, texte noir sur fond clair ; logo « SIALB » en capitales espacées avec la mention « Société Internationale des Amis de La Boétie — Sarlat ».

## Ce que cette archive ne peut pas contenir : à récupérer par Thomas dans l'espace d'administration Wix

L'archive couvre tout ce qui est **public**. Les éléments ci-dessous ne sont visibles que depuis le compte Wix ; **à exporter avant la fin de l'abonnement** :

1. **Messages reçus par le formulaire de contact** (*Boîte de réception* et *Contacts* : export CSV).
2. **Médiathèque** (*Media Manager*) : fichiers téléversés mais non publiés sur une page (photos, documents de travail). L'archive ne contient que les fichiers visibles sur le site.
3. **Pages masquées ou brouillons** éventuels, non visibles publiquement.
4. **Film documentaire sur la SIALB** (2021, mentionné dans l'historique) : il n'apparaît sur aucune page du site, à récupérer auprès de son auteur.

## Nom de domaine sialb.fr et adresse contact@sialb.fr : à vérifier d'urgence

Relevés publics du 18 novembre 2026 :

- **Le domaine `sialb.fr` a été acheté via Wix** (bureau d'enregistrement EPAG Domainservices, utilisé par Wix). Il est **payé jusqu'au 18 novembre 2027**. Ses serveurs DNS sont ceux de Wix (`ns8/ns9.wixdns.net`).
  - La résiliation du **forfait du site** n'entraîne pas celle du **domaine**, qui est un abonnement distinct : **ne pas supprimer le domaine ni le compte Wix**.
  - Pour brancher sialb.fr sur le nouveau site, deux solutions : (a) garder le domaine chez Wix et modifier ses enregistrements DNS pour pointer vers le nouvel hébergeur ; (b) transférer le domaine chez un autre bureau d'enregistrement en demandant à Wix le **code de transfert (code d'autorisation)**.
- **Aucun serveur de messagerie (enregistrement MX) n'est déclaré pour `sialb.fr`.** En l'état, l'adresse `contact@sialb.fr`, affichée sur le site, **ne peut a priori pas recevoir de courriels**. À confirmer en envoyant un message de test, puis à mettre en place (redirection vers une boîte existante) en même temps que le nouveau site.
