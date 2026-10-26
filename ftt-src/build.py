#!/usr/bin/env python3
"""Genere les pages HTML de ftt-site/ avec en-tete et pied de page communs.
Usage : python3 ftt-src/build.py   (depuis la racine du depot)
Les contenus evolutifs (equipes, matchs, actualites...) vivent dans ftt-site/data/*.json."""
import os, html

OUT = os.path.join(os.path.dirname(__file__), "..", "ftt-site")
SITE = "Football Terrasses du Tarn"
FB = "https://www.facebook.com/FootballTerrassesduTarn/"

NAV = [
    ("index.html", "Accueil"),
    ("le-club.html", "Le club"),
    ("equipes.html", "Équipes"),
    ("matchs-resultats.html", "Matchs &amp; résultats"),
    ("actualites-evenements.html", "Actualités &amp; événements"),
    ("galerie.html", "Galerie"),
    ("partenaires.html", "Partenaires"),
    ("contact.html", "Nous rejoindre"),
    ("mentions-legales.html", "Mentions légales"),
]

def header(cur):
    links = []
    for f, label in NAV:
        cls = []
        if f == "contact.html": cls.append("nav-cta")
        if f == "mentions-legales.html": cls.append("nav-minor")
        a = f' aria-current="page"' if f == cur else ""
        c = f' class="{" ".join(cls)}"' if cls else ""
        links.append(f'<a href="{f}"{c}{a}>{label}</a>')
    return f'''<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header">
  <a class="brand" href="index.html" aria-label="Football Terrasses du Tarn, accueil"><img src="assets/img/logo.png" alt="" width="40" height="44"><span><b>F.T.T</b><small>Terrasses du Tarn</small></span></a>
  <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span></button>
  <nav class="nav" id="nav" aria-label="Navigation principale">{"".join(links)}</nav>
</header>'''

FOOTER = f'''<footer class="site-footer">
  <div class="container">
    <div class="cols">
      <div>
        <div class="fbrand"><img src="assets/img/logo.png" alt="" width="56" height="61"><b>Football Terrasses du Tarn</b></div>
        <p>« Ensemble, pour le club ! » Un club de football qui réunit 9 communes du Tarn-et-Garonne depuis 2005.</p>
        <div class="social"><a href="{FB}" target="_blank" rel="noopener">Facebook</a><a href="https://ftt.sportsregions.fr/" target="_blank" rel="noopener">Site actuel du club</a></div>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li>Jérémy Mothes, président</li>
          <li><a href="tel:+33686526824">06 86 52 68 24</a></li>
          <li><a href="mailto:jeremy.mothes@sfr.fr">jeremy.mothes@sfr.fr</a></li>
          <li>9 Rue Grand-rue<br>82100 Labastide-du-Temple</li>
        </ul>
      </div>
      <div>
        <h4>Le site</h4>
        <ul>
          <li><a href="le-club.html">Le club</a></li><li><a href="equipes.html">Équipes</a></li><li><a href="matchs-resultats.html">Matchs &amp; résultats</a></li>
          <li><a href="actualites-evenements.html">Actualités &amp; événements</a></li><li><a href="galerie.html">Galerie</a></li><li><a href="partenaires.html">Partenaires</a></li>
          <li><a href="contact.html">Nous rejoindre</a></li><li><a href="mentions-legales.html">Mentions légales</a></li>
        </ul>
      </div>
    </div>
    <div class="legal"><span>© Football Terrasses du Tarn · Photos et visuels : club, crédits indiqués</span><span>Maquette réalisée par <a href="https://assovisible.fr" target="_blank" rel="noopener">AssoVisible</a></span></div>
  </div>
</footer>
<script src="assets/js/app.js" defer></script>'''

def page(fname, title, desc, body, hero=None, extra_head=""):
    h = header(fname)
    hero_html = ""
    if hero:
        k, t, s = hero
        hero_html = f'''<section class="page-hero"><div class="container"><p class="eyebrow">{k}</p><h1>{t}</h1><p>{s}</p></div><div class="pitch-line"></div></section>'''
    title = html.escape(title, quote=False)
    full_title = f"{title} | {SITE}" if fname != "index.html" else f"{SITE} (F.T.T) | Club de football des Terrasses du Tarn"
    out = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full_title}</title>
<meta name="description" content="{html.escape(desc, quote=True)}">
<meta name="theme-color" content="#061a3f">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{html.escape(desc, quote=True)}">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/img/logo.png">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
{extra_head}
</head>
<body>
{h}
<main id="main">
{hero_html}
{body}
</main>
{FOOTER}
</body>
</html>
'''
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(out)

CTA = '''<section class="cta-band"><div class="container reveal">
  <p class="eyebrow">Ensemble, pour le club !</p>
  <h2>Chausse les crampons, rejoins la famille FTT</h2>
  <p>Venez essayer le foot : filles et garçons, de U6 à U17, et une équipe vétérans pour l'ambiance du vendredi soir.</p>
  <a class="btn btn-primary" href="contact.html">Nous rejoindre</a>
</div></section>'''

# ---------------- Accueil ----------------
terraces = '''<svg class="terraces" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 150 C 180 90 300 120 460 100 S 760 60 940 96 S 1260 120 1440 70 V260 H0Z" fill="#0f3d86" opacity=".55"/>
  <path d="M0 185 C 200 140 330 170 520 150 S 820 120 1010 150 S 1300 170 1440 130 V260 H0Z" fill="#0a2a66" opacity=".8"/>
  <path d="M0 215 C 240 190 420 215 640 200 S 1020 175 1200 200 S 1380 205 1440 190 V260 H0Z" fill="#061a3f"/>
  <path d="M0 232 C 300 214 520 240 800 226 S 1250 216 1440 230 V260 H0Z" fill="#1f8a4c"/>
  <path d="M-20 205 C 260 175 470 210 720 196 S 1160 170 1460 198" fill="none" stroke="#19d3ff" stroke-width="3" opacity=".55"/>
</svg>'''

index_body = f'''
<section class="hero">
  <div class="hero-photos" data-render="hero" aria-hidden="true"></div>
  <div class="beam l"></div><div class="beam r"></div>
  <div class="container hero-inner">
    <div>
      <p class="eyebrow">Labastide-du-Temple · 9 communes · depuis 2005</p>
      <h1>Football <span>Terrasses du Tarn</span></h1>
      <p class="hero-lead">Ensemble, pour le club ! Du ballon des U6 aux matchs du vendredi soir des vétérans, on joue pour le plaisir.</p>
      <div class="hero-actions"><a class="btn btn-primary" href="contact.html">Rejoindre le club</a><a class="btn btn-ghost" href="equipes.html">Voir les équipes</a></div>
    </div>
    <img class="hero-logo" src="assets/img/logo.png" alt="Écusson du club Football Terrasses du Tarn" width="240" height="263">
  </div>
  <span class="scroll-cue" aria-hidden="true"></span>
  {terraces}
</section>

<section class="next"><div class="container" data-render="next"></div></section>

<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Le club</p><h2>Un club, neuf villages</h2><p>Albefeuille, Barry, Les Barthes, Labastide, Lafrançaise, Lavilledieu-du-Temple, Meauzac, Saint-Porquier et Villemade se sont unies pour que chaque enfant puisse jouer au foot près de chez lui.</p></div>
    <div class="grid c3">
      <a class="tile reveal" href="equipes.html"><img src="assets/img/photos/u13-equipe1.jpg" alt="" loading="lazy"><div><h3>Les équipes</h3><p>De l'école de foot aux U17, filles et garçons.</p></div></a>
      <a class="tile reveal" href="matchs-resultats.html"><img src="assets/img/photos/u14-u15-match-10-octobre.jpg" alt="" loading="lazy"><div><h3>Matchs &amp; résultats</h3><p>Calendrier, scores, classements.</p></div></a>
      <a class="tile reveal" href="galerie.html"><img src="assets/img/photos/feminines-u9-u11.jpg" alt="" loading="lazy"><div><h3>La galerie</h3><p>Les équipes et les plateaux en images.</p></div></a>
    </div>
  </div>
</section>

<section class="block dark">
  <div class="container"><div class="counters" data-render="counters"></div></div>
</section>

<section class="block alt">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Dernières actualités</p><h2>La vie du club</h2></div>
    <div class="news three" data-render="news" data-limit="3"></div>
    <p style="margin-top:1.5rem"><a class="btn btn-outline" href="actualites-evenements.html">Toutes les actualités</a></p>
  </div>
</section>

<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Partenaires</p><h2>Ils font vivre le club</h2><p>Les neuf communes et les entreprises locales soutiennent le FTT. Et si c'était vous ?</p></div>
    <div class="partners" data-render="partners"></div>
    <p class="hint" id="partners-note" style="margin-top:1rem"></p>
    <p><a class="btn btn-outline" href="partenaires.html">Devenir partenaire</a></p>
  </div>
</section>
{CTA}
'''
page("index.html", "Accueil",
     "Football Terrasses du Tarn (F.T.T) : club de football de Labastide-du-Temple et de 9 communes du Tarn-et-Garonne. École de foot, jeunes, féminines, vétérans. Rejoignez-nous !",
     index_body)

# ---------------- Le club ----------------
club_body = f'''
<section class="block">
  <div class="container split">
    <div class="reveal prose">
      <p class="eyebrow" style="color:var(--blue)">Présentation</p>
      <h2>Un club pour les enfants de nos villages</h2>
      <p>Le Football Terrasses du Tarn est né d'une idée simple : dans le milieu rural, il est difficile de réunir assez de joueurs d'une même catégorie dans un même village. En unissant leurs forces, plusieurs communes permettent à chaque enfant de pratiquer le football près de chez lui.</p>
      <p>Aujourd'hui, le club accueille des filles et des garçons de l'école de foot (U6) jusqu'aux U17, et une équipe de vétérans qui joue des matchs amicaux le vendredi soir.</p>
    </div>
    <div class="reveal"><img class="shot" src="assets/img/photos/u12-u13-parents-plateau.jpg" alt="Équipe U12-U13 et parents lors d'un plateau" loading="lazy"><p class="credit">Photo : Football Terrasses du Tarn (site officiel du club)</p></div>
  </div>
</section>

<section class="block alt">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow" style="color:var(--blue)">Histoire</p><h2>Une histoire qui grandit</h2>
      <ol class="timeline">
        <li><b>2005</b>Création du Football Terrasses du Tarn par les villages d'Albefeuille-Lagarde, Barry-d'Islemade, Les Barthes, Labastide-du-Temple, Lavilledieu-du-Temple, Meauzac et Saint-Porquier.</li>
        <li><b>2018</b>Création d'une équipe 100 % filles et après-midi découverte ouverte aux garçons et aux filles lors de l'assemblée générale.</li>
        <li><b>2024</b>Jérémy Mothes devient président du club.</li>
        <li><b>2025</b>Neuf communes unies : Lafrançaise et Villemade rejoignent le projet. Campagne de recrutement des féminines, U9 à U17.</li>
        <li><b>2026</b>Saison 2026-2027 : 8 équipes de U6 à U17 et des vétérans. Jérémy Mothes est élu meilleur dirigeant sportif.</li>
      </ol>
      <p class="hint" style="margin-top:1rem">Dates issues du site historique du club et de la presse locale (Le Petit Journal). Le club peut compléter cette frise.</p>
    </div>
    <div class="reveal quote">« Détourner un tir, inscrire un but, brandir une coupe et <em>savourer le plaisir de la victoire</em>. »<p class="credit" style="color:rgba(13,27,51,.6);font-family:var(--font-body);text-transform:none;font-weight:400;font-size:.9rem;margin-top:1rem">Esprit du club, d'après le site historique du FTT</p></div>
  </div>
</section>

<section class="block dark">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Valeurs</p><h2>Dévoués, disponibles, désintéressés</h2></div>
    <div class="grid c4" id="valeurs"></div>
  </div>
</section>

<section class="block" id="bureau">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Le bureau</p><h2>Celles et ceux qui font vivre le club</h2></div>
    <div class="bureau" data-render="bureau"></div>
    <h3 style="margin-top:2.5rem">Les éducateurs</h3>
    <div id="educateurs"></div>
  </div>
</section>
{CTA}
'''
page("le-club.html", "Le club",
     "Présentation, histoire, valeurs et bureau du Football Terrasses du Tarn : un club né en 2005 qui réunit 9 communes du Tarn-et-Garonne.",
     club_body, ("Le club", "Un club, neuf villages", "Notre histoire, nos valeurs et les bénévoles qui font vivre le FTT."))

# ---------------- Equipes ----------------
eq_body = f'''
<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Saison 2026-2027</p><h2>Choisis ton équipe</h2><p>Survole (ou touche) une carte pour voir les jours, horaires et lieux d'entraînement.</p></div>
    <div class="filters" id="team-filters" role="group" aria-label="Filtrer par catégorie"></div>
    <div class="teams" data-render="teams"></div>
    <p class="hint" style="margin-top:1rem">Horaires d'après le planning officiel 2026-2027. Les éducateurs seront indiqués par le club.</p>
  </div>
</section>
<section class="block alt" id="planning">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Planning</p><h2>Entraînements de la semaine</h2></div>
    <div class="table-wrap reveal" data-render="schedule"></div>
    <div class="reveal" style="margin-top:2rem"><a href="assets/img/planning-2026-2027.jpg" data-lightbox data-title="Planning des entraînements 2026-2027" data-credit="Visuel : Football Terrasses du Tarn"><img class="planning-img" src="assets/img/planning-2026-2027.jpg" alt="Planning officiel des entraînements 2026-2027" loading="lazy"></a><p class="credit">Visuel : Football Terrasses du Tarn</p></div>
  </div>
</section>
{CTA}
'''
page("equipes.html", "Équipes",
     "Les équipes du Football Terrasses du Tarn : école de foot U6-U9, U10 à U17 filles et garçons, vétérans. Jours, horaires et lieux d'entraînement 2026-2027.",
     eq_body, ("Équipes", "Du premier ballon aux U17", "École de foot, catégories jeunes, féminines et vétérans : trouve ta place."))

# ---------------- Matchs ----------------
m_body = '''
<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Calendrier</p><h2>Prochains matchs</h2></div>
    <div class="grid" data-render="matches"></div>
  </div>
</section>
<section class="block alt">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Résultats</p><h2>Derniers scores</h2><p>Résultats connus publiquement (saison précédente). Les scores de la saison en cours seront ajoutés par le club.</p></div>
    <div class="grid" id="results"></div>
  </div>
</section>
<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Classement</p><h2>Où en sont nos équipes ?</h2></div>
    <div class="empty pending" id="ranking"></div>
    <p style="margin-top:1.5rem" id="match-links"></p>
  </div>
</section>
'''
page("matchs-resultats.html", "Matchs & résultats",
     "Calendrier, résultats et classements des équipes du Football Terrasses du Tarn, district de Tarn-et-Garonne.",
     m_body, ("Matchs & résultats", "Sur le terrain", "Le calendrier des rencontres, les scores et les classements."))

# ---------------- Actualités & événements ----------------
a_body = '''
<section class="block" id="evenements">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">À venir</p><h2>Les prochains rendez-vous</h2><p>Lotos, vide-greniers, soirées, tournois : chaque événement aide le club à financer sa saison.</p></div>
    <div class="events" data-render="events" data-mode="upcoming"></div>
    <div class="reveal" style="margin-top:1.5rem"><a href="assets/img/affiche-evenements-oct-nov-2026.jpg" data-lightbox data-title="Les évènements du club, octobre-novembre 2026" data-credit="Visuel : Football Terrasses du Tarn" class="btn btn-outline">Voir l'affiche octobre-novembre</a></div>
  </div>
</section>
<section class="block alt" id="actus">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Actualités</p><h2>Dernières nouvelles</h2></div>
    <div class="filters" id="news-filters" role="group" aria-label="Filtrer les actualités"></div>
    <div class="news" data-render="news" data-filters="#news-filters"></div>
  </div>
</section>
<section class="block" id="archives">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Archives</p><h2>Événements passés</h2></div>
    <div class="events" data-render="events" data-mode="past"></div>
  </div>
</section>
'''
page("actualites-evenements.html", "Actualités & événements",
     "Actualités du Football Terrasses du Tarn : lotos, vide-grenier, Octobre Rose, recrutement, vie du club. Agenda et archives.",
     a_body, ("Actualités &amp; événements", "La vie du club", "Tournois, lotos, soirées et nouvelles : tout ce qui bouge au FTT."))

# ---------------- Galerie ----------------
g_body = '''
<section class="block">
  <div class="container">
    <div class="filters" id="gallery-filters" role="group" aria-label="Filtrer par catégorie"></div>
    <div class="mosaic" data-render="gallery"></div>
    <p class="hint" style="margin-top:1.5rem">Photos et visuels issus du site officiel du club : l'auteur ou la source est toujours indiqué. Pour retirer ou ajouter une image, contactez le club.</p>
  </div>
</section>
'''
page("galerie.html", "Galerie",
     "Galerie photos du Football Terrasses du Tarn : équipes U6 à U17, féminines, plateaux et affiches d'événements.",
     g_body, ("Galerie", "Le club en images", "Équipes, plateaux et affiches classés par catégorie. Touche une photo pour l'agrandir."))

# ---------------- Partenaires ----------------
p_body = '''
<section class="block">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Sponsors et soutiens</p><h2>Merci à nos partenaires</h2></div>
    <div class="partners" data-render="partners"></div>
    <p class="hint" id="partners-note" style="margin-top:1rem"></p>
  </div>
</section>
<section class="block dark">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow">Les communes du projet</p><h2>Neuf villages, un seul club</h2></div>
    <ul class="chips" id="soutiens"></ul>
  </div>
</section>
<section class="cta-band"><div class="container reveal">
  <p class="eyebrow">Devenir partenaire</p>
  <h2>Votre entreprise aux couleurs du FTT</h2>
  <p>Maillots, panneaux au stade, lotos, tournois : soutenir le club, c'est de la visibilité locale et un coup de pouce pour des dizaines d'enfants. Contact : Michael Porta Benache, responsable sponsoring.</p>
  <a class="btn btn-primary" href="contact.html?sujet=partenaire#formulaire">Devenir partenaire</a>
</div></section>
'''
page("partenaires.html", "Partenaires",
     "Partenaires et sponsors du Football Terrasses du Tarn. Devenez partenaire du club et soutenez le football des Terrasses du Tarn.",
     p_body, ("Partenaires", "Ils jouent avec nous", "Communes, entreprises et commerçants qui soutiennent le club."))

# ---------------- Contact ----------------
c_body = f'''
<section class="block">
  <div class="container cols-2">
    <div class="reveal prose">
      <p class="eyebrow" style="color:var(--blue)">Inscriptions et licences</p>
      <h2>Rejoindre le FTT</h2>
      <div data-render="inscription"></div>
      <h3>Coordonnées</h3>
      <ul class="info-list">
        <li><b>Président</b>Jérémy Mothes</li>
        <li><b>Téléphone</b><a href="tel:+33686526824">06 86 52 68 24</a></li>
        <li><b>E-mail</b><a href="mailto:jeremy.mothes@sfr.fr">jeremy.mothes@sfr.fr</a></li>
        <li><b>Adresse</b>9 Rue Grand-rue, 82100 Labastide-du-Temple</li>
        <li><b>Facebook</b><a href="{FB}" target="_blank" rel="noopener">Football Terrasses du Tarn</a></li>
      </ul>
    </div>
    <div class="reveal card" id="formulaire">
      <h3>Écrivez-nous</h3>
      <form class="contact" name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <label>Nom et prénom<input name="nom" required autocomplete="name"></label>
        <label>E-mail<input type="email" name="email" required autocomplete="email"></label>
        <label>Téléphone (facultatif)<input type="tel" name="telephone" autocomplete="tel"></label>
        <label>Votre demande
          <select name="sujet" id="sujet">
            <option value="inscription">Inscription / séance d'essai</option>
            <option value="veterans">Rejoindre les vétérans</option>
            <option value="partenaire">Devenir partenaire</option>
            <option value="benevole">Devenir bénévole ou éducateur</option>
            <option value="autre">Autre question</option>
          </select>
        </label>
        <label>Message<textarea name="message" required></textarea></label>
        <label class="check"><input type="checkbox" name="consentement" required> J'accepte que le club utilise ces informations pour répondre à ma demande (aucune autre utilisation).</label>
        <button class="btn btn-dark" type="submit">Envoyer</button>
      </form>
    </div>
  </div>
</section>
<section class="block alt" id="stades">
  <div class="container">
    <div class="section-head reveal"><p class="eyebrow" style="color:var(--blue)">Plan des stades</p><h2>Où nous trouver ?</h2><p>Siège : 9 Rue Grand-rue, Labastide-du-Temple. Les entraînements ont lieu sur plusieurs terrains selon les catégories.</p></div>
    <div class="card reveal" data-render="stades"></div>
    <p class="hint" style="margin-top:1rem">Liens de plan générés par adresse : le club peut confirmer ou corriger chaque lieu dans <code>data/club.json</code>.</p>
  </div>
</section>
<script>
  (function(){{ try {{ var s=new URLSearchParams(location.search).get("sujet"); if(s) document.getElementById("sujet").value=s; }} catch(e){{}} }})();
</script>
'''
page("contact.html", "Nous rejoindre / Contact",
     "Rejoindre le Football Terrasses du Tarn : inscriptions, séance d'essai, contact du président, formulaire et plan des stades (Labastide-du-Temple, 82).",
     c_body, ("Nous rejoindre", "Viens essayer le foot !", "Une question, une inscription, un partenariat ? Écris-nous ou appelle le président."))

# ---------------- Merci ----------------
page("merci.html", "Message envoyé", "Merci pour votre message au Football Terrasses du Tarn.",
     '''<section class="block"><div class="container prose" style="padding-top:5rem"><h1 style="color:var(--blue)">Merci !</h1><p>Votre message a bien été envoyé. Le club vous répondra rapidement.</p><a class="btn btn-dark" href="index.html">Retour à l'accueil</a></div></section>''',
     extra_head='<meta name="robots" content="noindex">')

# ---------------- Mentions ----------------
ml_body = f'''
<section class="block"><div class="container prose">
<h2>Éditeur du site</h2>
<p><strong>Football Terrasses du Tarn (F.T.T)</strong>, association sportive.<br>Siège : 9 Rue Grand-rue, 82100 Labastide-du-Temple.<br>Directeur de la publication : Jérémy Mothes, président.<br>Contact : <a href="mailto:jeremy.mothes@sfr.fr">jeremy.mothes@sfr.fr</a> · 06 86 52 68 24.</p>
<p class="notice"><span class="pending"></span>Numéro d'affiliation FFF, numéro RNA/SIRET et forme juridique exacte à confirmer par le club.</p>
<h2>Conception</h2>
<p>Maquette conçue par <a href="https://assovisible.fr" target="_blank" rel="noopener">AssoVisible</a>.</p>
<h2>Hébergement</h2>
<p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Droits d'auteur et crédits des images</h2>
<p>Les photographies, visuels, planning, affiches et le logo (écusson « Football Terrasses du Tarn ») sont la propriété du club ou de leurs auteurs. Ils proviennent du site officiel du club (ftt.sportsregions.fr) et sont crédités à chaque affichage. Toute reproduction sans autorisation est interdite.</p>
<p>Droit à l'image : les photos représentant des mineurs doivent faire l'objet d'une autorisation des représentants légaux. Le club s'engage à retirer sans délai toute image sur simple demande à <a href="mailto:jeremy.mothes@sfr.fr">jeremy.mothes@sfr.fr</a>.</p>
<p>Les informations d'actualité citent leurs sources (site du club, Le Petit Journal, SportCorico, FFF).</p>
<h2>Données personnelles</h2>
<p>Le formulaire de contact collecte nom, e-mail, téléphone (facultatif) et message, uniquement pour répondre à votre demande. Les données sont reçues via Netlify Forms et conservées le temps nécessaire au traitement. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données auprès du club. Ce site n'utilise aucun cookie de suivi ni outil de mesure d'audience.</p>
<h2>Services tiers</h2>
<p>Polices Google Fonts. Liens de plan vers OpenStreetMap et Google Maps, ouverts uniquement au clic.</p>
</div></section>
'''
page("mentions-legales.html", "Mentions légales",
     "Mentions légales, crédits photos, droit à l'image et données personnelles du site du Football Terrasses du Tarn.",
     ml_body, ("Informations", "Mentions légales", "Éditeur, hébergeur, droits d'auteur et protection des données."))

# ---------------- 404 ----------------
page("404.html", "Page introuvable", "Page introuvable.",
     '''<section class="block"><div class="container prose" style="padding-top:5rem"><h1 style="color:var(--blue)">Hors-jeu !</h1><p>Cette page n'existe pas (ou plus).</p><a class="btn btn-dark" href="index.html">Retour à l'accueil</a></div></section>''',
     extra_head='<meta name="robots" content="noindex">')

print("pages generees dans", os.path.abspath(OUT))
