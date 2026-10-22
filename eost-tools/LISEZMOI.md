# Site EOST bilingue (FR / BR)

- `eost-site/` : site publié (FR à la racine, BR dans `eost-site/br/`).
- `eost-tools/build.cjs` : génère toutes les pages (`node eost-tools/build.cjs`).
- `eost-tools/br.json` : traductions bretonnes (clé = texte français exact, valeur = breton).
  Les entrées actuelles (menu, boutons, titre d'accueil) sont PROVISOIRES, à valider par J.-P. Quéméner.
- `eost-tools/textes-a-traduire.txt` : liste des textes français à traduire, à retourner complétée.
- Quand une page est entièrement traduite, ajouter son fichier (ex. "agenda.html") à `__pages_done` dans `br.json` : le bandeau « traduction en cours » disparaît.
