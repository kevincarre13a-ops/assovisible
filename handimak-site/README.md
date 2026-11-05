# Site Les Amis d'HandiMak
Site statique multi-pages (HTML/CSS/JS, sans backend).
- Contenus modifiables : dossier `data/*.json` (site, événements, actualités, partenaires, galerie, chiffres).
- Lien de don : `data/site.json` → `lienDon`. Montant/objectif : `cagnotte`.
- Gabarit commun (menu, pied de page) : `tools/build.py`, puis `python3 tools/build.py` pour régénérer les pages.
- Formulaire : Netlify Forms (activé au déploiement).
