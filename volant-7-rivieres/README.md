# Le Volant des 7 Rivières : site vitrine (maquette AssoVisible)

Site statique multi-pages, sans backend. Les contenus sont dans `data/*.json`, la mise en page dans `src/` et `assets/`.

- `data/site.json` : coordonnées, chiffres clés, prochain rendez-vous, réseaux
- `data/creneaux.json` : créneaux, tarifs, inscription
- `data/tournois.json`, `resultats.json`, `actualites.json`, `galerie.json`, `bureau.json`
- Les textes « à confirmer » sont des textes d'attente à remplacer par le bureau.

Générer le site : `node build.mjs` (résultat dans `dist/`). Netlify le fait automatiquement (`netlify.toml`).
Formulaires : Netlify Forms (`essai` et `contact`), page de confirmation `/merci`.
