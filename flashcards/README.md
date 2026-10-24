# Flashcards d'anglais — appli unique

Toutes les flashcards fusionnées en **un seul fichier** : `flashcards/index.html`.
Il fonctionne hors ligne (ouvre-le dans n'importe quel navigateur, sur le téléphone aussi) ;
la progression est enregistrée dans le navigateur.

## Ce que fait l'appli

- **Petits paquets** : chaque catégorie est découpée en paquets de 5, 8 ou 10 cartes (réglable).
  Une carte « à revoir » revient quelques cartes plus loin dans le même paquet ; le paquet est
  terminé quand toutes les cartes ont été validées.
- **Révision du jour** : les cartes connues reviennent à J+1, J+3, J+7, J+14, J+30, J+60
  (répétition espacée). L'accueil affiche ce qu'il y a à revoir et un objectif quotidien.
- **Deux sens** : FR → EN (recommandé : tu dois trouver l'anglais) ou EN → FR.
- **Voix** : synthèse vocale en anglais britannique (en-GB) par défaut, choix de la voix et de la
  vitesse dans les réglages, lecture automatique, bouton 🔊 sur le mot et sur l'exemple.
- **Gestes** : glisser à droite = je savais, à gauche = à revoir, toucher = retourner.
  Clavier : espace, ←, →, S (écouter), Échap.
- **Export / import** de la progression pour changer d'appareil.

## Contenu (2 608 cartes, 21 thèmes)

| Groupe | Thème | Cartes |
|---|---|---|
| ⭐ Mes phrases | Mes phrases & mes règles (issu du prompt texte) | 365 |
| ⭐ Mes phrases | Anglais du quotidien à Chiang Mai (liste collée) | 268 |
| 💬 Parler | Anglais pour voyager · Expressions de base · Anglais en salle de sport · 100 adjectifs · Vocabulaire backpacker | 43 · 68 · 109 · 100 · 52 |
| 📐 Grammaire | 80 connecteurs · FOR vs SINCE · FOR / DURING / WHILE · Present perfect simple · Present perfect continuous · 141 phrasal verbs · 100 verbes irréguliers · Les nombres · L'alphabet | 80 · 29 · 39 · 22 · 22 · 141 · 100 · 71 · 26 |
| 📚 Vocabulaire | Mots les plus courants | 84 |
| 🖼️ Mots en images | 300 noms vol. 1 · vol. 2 · vol. 3 · 100 mots de la salle | 298 · 298 · 295 · 98 |

Les cartes « Mes phrases & mes règles » portent un niveau (débutant / intermédiaire / avancé)
et une source : issu du prompt, ou **exemple complémentaire** (ajouté pour illustrer une règle,
un connecteur, le dialogue à la salle, la prononciation).

## Fichiers

```
flashcards/
  index.html           ← l'appli (fichier unique généré, à ouvrir / partager)
  build.cjs            ← régénère index.html et dist/artifact.html
  src/template.html    ← interface (HTML / CSS / JS)
  data/cards.json      ← toutes les cartes
  data/collections.json← thèmes, catégories, libellés
  data/thumbs.json     ← vignettes embarquées des noms illustrés (optionnel)
  dist/artifact.html   ← même appli sans squelette html/head/body (pour publication)
```

Régénérer après une modification des données ou de l'interface :

```
node flashcards/build.cjs
```

### Format d'une carte (`data/cards.json`)

```json
{"id":"mine:1:je-suis-francais","col":"mine","deck":1,"type":"phrase","tag":"phrase",
 "en":"I'm French.","fr":"Je suis français.","ex":"…","exFr":"…","note":"…","lvl":1,"src":"hist"}
```

`type` : `phrase` (défaut), `noun` (image : `wiki`, `ph`), `verb` (`pret`, `pp`), `num` (`num`),
`alpha`, `rule`, `err` (`bad` = phrase fautive), `pron` (`ph`, `pho`).
`col` + `deck` renvoient à `collections.json`. L'identifiant doit rester stable (il porte la progression).

## Corrections apportées lors de la fusion

- Anglais **britannique** partout : travelling, realised, favourite, colour, practise (verbe),
  « at weekends », films, maths, postman… Nombres à l'anglaise (« a hundred and five »).
  Mots américains remplacés ou annotés : trousers (pants), rubbish / bin, pavement, zebra crossing,
  car park, the tube, motorway, fire engine, crisps, aubergine, courgette, ladybird, doughnut, lorry…
- Phonétique des noms convertie en prononciation britannique (/əʊ/, pas de r final).
- Fautes corrigées : « Bien qu'il pleuve » → « Bien qu'il ait plu », « pour que je puisse » →
  « pour pouvoir », « Je suis content(e) de te rencontrer » (good to see you) → « de te voir »,
  participes passés britanniques (forgotten, got, struck), catégories erronées (personal trainer,
  siège de cinéma), exemples bancals (« I'll buy it though »), etc.
- Doublons stricts supprimés (même anglais, même sens) : 22 cartes, dont 6 connecteurs présents
  deux fois, les mots de la salle présents aussi dans le volume 3, tent / wall / candles en double.
  Les variantes utiles sont conservées (even if / even though, used to / be used to…).
- Noms illustrés : traduction française ajoutée pour les 989 mots ; 46 titres Wikipédia sans image
  remplacés par un article illustré ; mots trop proches d'un autre remplacés (box office, daisy,
  earplugs, kaleidoscope, origami, constellation, paddleboard, credit card).
