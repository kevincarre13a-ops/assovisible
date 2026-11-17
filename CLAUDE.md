# AssoVisible — consignes permanentes pour tous les sites d'associations

Ces règles valent pour **chaque site** réalisé pour un client, pas seulement pour le Club Bisontin de Scrabble.

## Espace administrateur : mise en ligne en une seule fois (obligatoire)

- Un enregistrement dans l'espace administrateur **ne met jamais le site en ligne automatiquement**.
- Chaque « Enregistrer » est gardé en **brouillon**. Le site public ne change pas.
- Un bouton unique **« 🚀 Mettre en ligne »** publie toutes les modifications en attente **en une seule fois**.
- Il doit toujours y avoir :
  - une barre visible en haut de l'espace administrateur, qui liste les rubriques modifiées et pas encore en ligne ;
  - un **aperçu privé** du site avec les modifications (réservé à l'administrateur connecté) ;
  - un lien « Annuler ces modifications », qui abandonne les brouillons et laisse le site tel qu'il est en ligne.
- Les photos et documents remplacés ou supprimés ne disparaissent du site qu'au moment de la mise en ligne.
- Le guide PDF du client doit expliquer cette étape : un chapitre « La mise en ligne », et un rappel dans chaque procédure.

Implémentation de référence (Netlify Functions + Netlify Blobs) dans ce dépôt :

- `site/netlify/functions/contenu.mjs` : écriture en brouillon (`brouillon/<section>`) et lecture `?brouillon=1` pour l'administrateur.
- `site/netlify/functions/publication.mjs` : `POST /api/publier` et `POST /api/annuler-modifications`.
- `site/netlify/lib/stockage.mjs`
- `site/public/admin/admin.js` : barre de publication, messages « pas encore en ligne ».
- `site/public/js/cms.js` : aperçu `?apercu=1`.

## Autres habitudes de l'agence

- Mettre un lien « 🔒 Espace administrateur » en bas de page du site public.
- Identifiant et mot de passe faciles à retenir, à l'image de l'association, utilisables par une personne âgée.
- Espace administrateur très simple : grands boutons, un message clair après chaque action, textes en français simple.
- Livrer un guide PDF illustré de captures d'écran, pas à pas, aux couleurs de l'association.
- Ne jamais versionner le guide : il contient les accès. Il va dans `livrables/`, qui est ignoré par git.
- Dans les e-mails et les guides destinés aux clients, ne pas donner de numéro de téléphone : contact par e-mail ou via assovisible.fr/contact.
