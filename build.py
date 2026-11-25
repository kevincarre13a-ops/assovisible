#!/usr/bin/env python3
"""Génère les pages HTML du site L'Albarelle dans ./site (en-tête et pied de page communs).

Usage : python3 build.py
Les contenus qui évoluent (événements, actualités, collections, horaires, tarifs, bureau)
sont dans site/data/*.json et n'ont pas besoin de ce script.
"""
from html import escape
from pathlib import Path

OUT = Path(__file__).parent / "site"
URL = "https://lalbarelle-hotel-dieu-belleville.fr"

NAV = [
    ("association.html", "L’association"),
    ("activites.html", "Nos activités"),
    ("publications.html", "Publications"),
    ("hotel-dieu.html", "L’Hôtel-Dieu"),
    ("galerie.html", "Galerie"),
    ("contact.html", "Contacts / Adhésions"),
    ("mentions-legales.html", "Mentions légales"),
]

EMAIL = "lalbarelle@wanadoo.fr"
ICO_POT = '<svg viewBox="0 0 36 52" fill="none" stroke="#1d4c8f" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="1" width="18" height="4" rx="1.6"/><path d="M10 5H26C24.5 13 24 18 24 26C24 34 24.5 39 26.5 47H9.5C11.5 39 12 34 12 26C12 18 11.5 13 10 5Z"/><ellipse cx="18" cy="26" rx="3.6" ry="5"/></svg>'
ICO_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>'
ICO_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
ICO_TEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>'
OSM = ("https://www.openstreetmap.org/export/embed.html?bbox=4.7425%2C46.1065%2C4.7525%2C46.1117"
       "&amp;layer=mapnik&amp;marker=46.109184%2C4.747553")
OSM_GRAND = "https://www.openstreetmap.org/?mlat=46.109184&amp;mlon=4.747553#map=17/46.109184/4.747553"


def header(current):
    items = []
    for f, label in NAV:
        cur = ' aria-current="page"' if f == current else ""
        items.append(f'<li><a href="{f}"{cur}>{escape(label)}</a></li>')
    return f'''<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="nav-wrap">
    <a class="marque" href="index.html" aria-label="L’Albarelle, retour à l’accueil">
      <img src="assets/img/logo-albarelle.png" width="52" height="45" alt="">
      <span class="marque-nom">L’Albarelle<small>Hôtel-Dieu de Belleville</small></span>
    </a>
    <nav aria-label="Navigation principale">
      <ul class="menu" id="menu-principal">
        {"".join(items)}
      </ul>
    </nav>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu-principal" aria-label="Ouvrir le menu"><span></span></button>
  </div>
</header>'''


def footer():
    liens = "".join(f'<li><a href="{f}">{escape(l)}</a></li>' for f, l in NAV[:-1])
    return f'''<footer class="site-footer">
  <div class="frise" role="presentation"></div>
  <div class="wrap">
    <div class="pied-grille">
      <div>
        <div class="pied-marque"><img src="assets/img/logo-albarelle.png" width="64" height="55" alt="" loading="lazy"><strong>L’Albarelle</strong></div>
        <p>Association pour la mise en valeur de l’Hôtel-Dieu de Belleville-en-Beaujolais.</p>
      </div>
      <div>
        <h2>Contact</h2>
        <ul>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li>Hôtel-Dieu<br>68 rue de la République<br>69220 Belleville-en-Beaujolais</li>
          <li>Adresse postale :<br>27 rue du Moulin<br>69220 Belleville-en-Beaujolais</li>
        </ul>
      </div>
      <div>
        <h2>Le site</h2>
        <ul>{liens}</ul>
      </div>
      <div>
        <h2>Suivre l’Hôtel-Dieu</h2>
        <ul>
          <li><a href="https://www.facebook.com/hoteldieudebelleville/" target="_blank" rel="noopener">Facebook<span class="sr-only"> (nouvelle fenêtre)</span></a></li>
          <li><a href="https://www.instagram.com/hotel_dieu_belleville/" target="_blank" rel="noopener">Instagram<span class="sr-only"> (nouvelle fenêtre)</span></a></li>
          <li><a href="https://hoteldieu-belleville.fr/" target="_blank" rel="noopener">Site du musée<span class="sr-only"> (nouvelle fenêtre)</span></a></li>
        </ul>
        <p style="margin-top:.8rem;font-size:.9rem">Comptes du musée de l’Hôtel-Dieu ; l’association n’a pas encore de compte propre référencé.</p>
      </div>
    </div>
    <div class="copy">
      <span>© {2026} L’Albarelle, association loi 1901</span>
      <a href="mentions-legales.html">Mentions légales</a>
    </div>
  </div>
</footer>'''


def page(fichier, titre, desc, corps, hero=None, home=False, extra_head="", base=False):
    ouverture = "" if not hero else hero
    nom = "L’Albarelle, Hôtel-Dieu de Belleville-en-Beaujolais"
    t = nom if home else f"{titre} · L’Albarelle"
    canon = f"{URL}/" if fichier == "index.html" else f"{URL}/{fichier}"
    html = f'''<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
{'<base href="/">' if base else ""}
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(t)}</title>
<meta name="description" content="{escape(desc)}">
<meta name="theme-color" content="#102a52">
<link rel="canonical" href="{canon}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{escape(t)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:image" content="{URL}/assets/img/vue-aerienne.jpg">
<meta property="og:url" content="{canon}">
<link rel="preload" href="assets/fonts/cormorant.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
{extra_head}</head>
<body>
{header(fichier)}
<main id="contenu">
{ouverture}
{corps}
</main>
{footer()}
<script src="assets/js/main.js" defer></script>
</body>
</html>
'''
    (OUT / fichier).write_text(html, encoding="utf-8")


def page_hero(eyebrow, h1, lead, img, alt=""):
    return f'''<section class="page-hero">
  <img src="{img}" alt="{alt}" fetchpriority="high">
  <div class="wrap"><span class="eyebrow">{eyebrow}</span><h1>{h1}</h1><p>{lead}</p></div>
</section>'''


FRISE = '<div class="frise douce" role="presentation"></div>'


# ---------------------------------------------------------------- ACCUEIL
home_hero = '''<section class="hero" aria-label="Présentation">
  <div class="hero-fond" aria-hidden="true">
    <img class="actif" src="assets/img/photo-a-salle-grille.jpg" alt="" fetchpriority="high">
    <img src="assets/img/photo-b-salle-soeurs.jpg" alt="" loading="lazy">
    <img src="assets/img/photo-c-albarelles.jpg" alt="" loading="lazy">
  </div>
  <div class="wrap hero-contenu">
    <h1>L’Albarelle</h1>
    <p class="accroche">Faisons vivre l’Hôtel-Dieu ensemble</p>
    <p class="sous-accroche">Trois siècles de soins, de remèdes et de mémoire.</p>
  </div>
  <a class="defiler" href="#prochain">Découvrir</a>
  <div class="frise hero-pots" role="presentation"></div>
</section>'''

home = '''
<section class="prochain" id="prochain" aria-label="Événements en cours">
  <div class="wrap">
    <div class="prochain-carte seule reveal" data-prochain>
      <div class="gauche"><span class="eyebrow">Événements</span><h2>Programme à venir</h2><p>Les prochains rendez-vous seront annoncés prochainement.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap deux-col">
    <div class="reveal">
      <span class="eyebrow">L’association</span>
      <h2>L’Albarelle, association pour la mise en valeur de l’Hôtel-Dieu de Belleville-en-Beaujolais</h2>
      <p class="lead">Depuis plus de trente ans, un groupe de passionnés du patrimoine s’implique activement dans la protection, l’embellissement et l’animation de ce site incomparable.</p>
      <div class="btns"><a class="btn btn-contour" href="association.html">Découvrir l’association</a></div>
    </div>
    <div class="cadre reveal" data-d="1"><img src="assets/img/photo-1-facade.jpg" width="1600" height="1323" alt="Façade de l’Hôtel-Dieu de Belleville-en-Beaujolais et son clocher" loading="lazy"></div>
  </div>
</section>
''' + FRISE + '''

<section class="section alt" aria-labelledby="t-apercu">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Explorer</span><h2 id="t-apercu">Entrez dans l’Hôtel-Dieu</h2></div>
    <div class="grille g3" style="margin-top:2.4rem">
      <a class="carte reveal" href="association.html"><div class="vignette"><img src="assets/img/salle-du-conseil.jpg" alt="" loading="lazy"></div><div class="corps"><h3>L’association</h3><p>Notre histoire, notre mission, nos valeurs et celles et ceux qui font l’Albarelle.</p><span class="plus">Qui sommes-nous</span></div></a>
      <a class="carte reveal" data-d="1" href="activites.html"><div class="vignette"><img src="assets/img/expo-visiteurs.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Nos activités</h3><p>Événements, inventaires, visites : ce que nous faisons tout au long de l’année.</p><span class="plus">Voir nos activités</span></div></a>
      <a class="carte reveal" data-d="2" href="publications.html"><div class="vignette"><img src="assets/img/photo-c-albarelles.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Publications</h3><p>Livres, extraits et miscellanées sur l’histoire de l’Hôtel-Dieu.</p><span class="plus">Lire nos publications</span></div></a>
      <a class="carte reveal" href="hotel-dieu.html"><div class="vignette"><img src="assets/img/salle-malades-poele.jpg" alt="" loading="lazy"></div><div class="corps"><h3>L’Hôtel-Dieu</h3><p>Un site historique : salles, chapelles, apothicairerie et nos créations.</p><span class="plus">Parcourir le site</span></div></a>
      <a class="carte reveal" data-d="1" href="galerie.html"><div class="vignette"><img src="assets/img/photo-b-salle-soeurs.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Galerie</h3><p>Le bâtiment, les salles, l’apothicairerie, le jardin et nos activités en images.</p><span class="plus">Voir les photos</span></div></a>
      <a class="carte reveal" data-d="2" href="contact.html"><div class="vignette"><img src="assets/img/jardin-bugle.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Contacts &amp; adhésions</h3><p>Nous écrire, adhérer, devenir bénévole ou nous soutenir.</p><span class="plus">Nous rejoindre</span></div></a>
    </div>
  </div>
</section>

<section class="section bleu" aria-labelledby="t-chiffres">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">En quelques chiffres</span><h2 id="t-chiffres">Un patrimoine, des bénévoles</h2></div>
    <div class="compteurs" style="margin-top:2.6rem">
      <div class="compteur reveal"><strong data-depuis="1733">293</strong><span>années d’histoire depuis l’ouverture en 1733</span></div>
      <div class="compteur reveal" data-d="1"><strong data-depuis="1993">33</strong><span>ans d’engagement de l’Albarelle depuis 1993</span></div>
      <div class="compteur reveal" data-d="2"><strong data-cible="20">20</strong><span>bénévoles actifs<small>presse locale, 2023</small></span></div>
      <div class="compteur reveal" data-d="3"><strong data-cible="10">10</strong><span>massifs de plantes médicinales dans le jardin de l’Albarelle</span></div>
      <div class="compteur reveal" data-d="3"><strong data-cible="3">3</strong><span>salles de malades et leurs lits à ruelle</span></div>
    </div>
  </div>
  <div class="frise douce" role="presentation" style="margin-top:3rem"></div>
</section>
'''
page("index.html", "Accueil",
     "L’Albarelle, association pour la mise en valeur de l’Hôtel-Dieu de Belleville-en-Beaujolais (Rhône) : faisons vivre l’Hôtel-Dieu ensemble, trois siècles de soins, de remèdes et de mémoire.",
     home, hero=home_hero, home=True)

# ---------------------------------------------------------------- ASSOCIATION
asso = '''
<section class="section">
  <div class="wrap deux-col">
    <div class="reveal">
      <span class="eyebrow">Présentation</span>
      <h2>Sauver, étudier, faire connaître</h2>
      <p class="lead">L’Albarelle est une association loi 1901 fondée en 1993, peu après la fermeture de l’hospice, pour protéger le patrimoine architectural, mobilier et documentaire de l’Hôtel-Dieu de Belleville-en-Beaujolais.</p>
      <p>Elle conserve et étudie les archives encore présentes sur le site, mène des recherches sur le passé pharmaceutique, médical, chirurgical et religieux de l’établissement, et participe à l’animation du lieu : expositions, conférences, entretien du jardin de plantes médicinales.</p>
    </div>
    <div class="cadre reveal" data-d="1"><img src="assets/img/salle-du-conseil.jpg" width="900" height="1350" alt="La salle du conseil de l’Hôtel-Dieu, avec ses boiseries et son lustre" loading="lazy" style="max-height:560px"></div>
  </div>
</section>
''' + FRISE + '''
<section class="section alt" aria-labelledby="t-hist">
  <div class="wrap narrow">
    <span class="eyebrow">Notre histoire</span>
    <h2 id="t-hist">Trente ans d’engagement</h2>
    <div class="reveal">
      <p>L’hospice de Belleville ferme ses portes en 1991. Quelques années plus tard, en 1993, des habitants créent l’Albarelle pour que ce témoin de la vie hospitalière ne disparaisse pas.</p>
      <p>En collaboration étroite avec la communauté de communes Saône-Beaujolais (CCSB), l’association a participé à la conception du musée de l’Hôtel-Dieu et à la mise au point du discours des visites, élaboré à partir des archives retrouvées. Elle est aussi à l’initiative de nombreuses expositions et de l’entretien du jardin de simples.</p>
      <p>Le 13 octobre 2023, elle a fêté ses trente ans, en présence du maire de Belleville et de délégués de la Fondation du patrimoine. Ses bénévoles préparaient alors un article sur l’histoire de l’Hôtel-Dieu pour la revue en ligne de la Société française d’histoire de la médecine.</p>
      <p class="note">Sources : presse locale (Le Patriote Beaujolais, octobre 2023) et site du musée. Texte à compléter par l’association avec ses propres souvenirs et dates clés.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="t-miss">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Notre mission</span><h2 id="t-miss">Quatre manières d’agir</h2></div>
    <div class="grille g2" style="margin-top:2.4rem">
      <div class="bloc reveal"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Protéger</h3><p>Veiller sur le bâtiment, le mobilier et les collections de l’Hôtel-Dieu, classé Monument historique.</p></div>
      <div class="bloc bleu-bord reveal" data-d="1"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Étudier</h3><p>Conserver les archives et mener des recherches sur le passé pharmaceutique, médical, chirurgical et religieux du lieu.</p></div>
      <div class="bloc vin-bord reveal"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Animer</h3><p>Organiser des expositions et des conférences gratuites, entretenir le jardin de plantes médicinales créé par l’association.</p></div>
      <div class="bloc reveal" data-d="1"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Transmettre</h3><p>Contribuer au contenu des visites et faire connaître l’histoire hospitalière à tous les publics.</p></div>
    </div>
  </div>
</section>

<section class="section alt" aria-labelledby="t-val">
  <div class="wrap deux-col">
    <div class="reveal">
      <span class="eyebrow">Nos valeurs</span>
      <h2 id="t-val">Ce qui nous guide</h2>
      <ul class="liste-coches">
        <li><strong>La mémoire :</strong> rendre hommage à celles et ceux qui ont soigné et été soignés ici.</li>
        <li><strong>Le partage :</strong> des événements ouverts et souvent gratuits, pour tous les âges.</li>
        <li><strong>L’engagement bénévole :</strong> une équipe d’une vingtaine de bénévoles actifs.</li>
        <li><strong>La rigueur :</strong> un travail fondé sur les archives.</li>
      </ul>
      <p class="note">Formulation proposée à partir des missions de l’association : à valider ou reformuler par ses membres.</p>
    </div>
    <div class="cadre reveal" data-d="1"><img src="assets/img/salle-malades-lit.jpg" width="1600" height="747" alt="Un lit à rideaux et un mortier dans une salle de malades" loading="lazy"></div>
  </div>
</section>

<section class="section bleu" aria-labelledby="t-nom">
  <div class="wrap deux-col">
    <div class="reveal">
      <span class="eyebrow">Pourquoi « Albarelle » ?</span>
      <h2 id="t-nom">Un pot d’apothicaire pour emblème</h2>
      <p class="lead">L’albarelle est un pot de pharmacie cylindrique, resserré en son milieu pour être saisi d’une main, qui servait à conserver onguents et drogues.</p>
      <p>Probablement originaire de Perse, il apparaît en France au XIVe siècle. Son nom rappelle l’apothicairerie de l’Hôtel-Dieu, qui conserve une riche collection de pots en faïence, en verre et en porcelaine. Le logo de l’association l’associe à l’image du bâtiment.</p>
    </div>
    <div class="reveal center" data-d="1"><img src="assets/img/logo-albarelle.png" width="150" height="130" alt="Logo de l’Albarelle : un pot d’apothicaire devant l’Hôtel-Dieu" style="margin-inline:auto;background:var(--creme);border-radius:18px;padding:14px;width:min(240px,60%);height:auto"></div>
  </div>
</section>

<section class="section" aria-labelledby="t-bur">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Bureau &amp; équipe</span><h2 id="t-bur">Celles et ceux qui font l’Albarelle</h2>
      <p class="lead">Une vingtaine de bénévoles actifs, dont un bureau de cinq membres.</p></div>
    <div class="grille g3" style="margin-top:2.2rem" data-bureau></div>
    <p class="note center narrow" style="margin-top:1.6rem" data-bureau-note></p>
    <div class="attente center narrow" style="margin-top:1.6rem"><strong>À compléter :</strong> photo de l’équipe, noms des autres bénévoles, présentation du contact de l’association (prénom).</div>
  </div>
</section>

<section class="section alt" aria-labelledby="t-part">
  <div class="wrap narrow center">
    <span class="eyebrow">Ils nous accompagnent</span>
    <h2 id="t-part">Nos partenaires</h2>
    <ul class="liste-coches" style="display:inline-block;text-align:left">
      <li>Commune de Belleville-en-Beaujolais, qui gère le musée</li>
      <li>Communauté de communes Saône-Beaujolais (CCSB)</li>
      <li>Fondation du patrimoine (délégations Val de Saône et Rhône-Alpes)</li>
      <li>Ligue pour la protection des oiseaux (ateliers au jardin de simples)</li>
    </ul>
    <p class="note">Mécènes et autres partenaires : à compléter par l’association.</p>
  </div>
</section>
'''
page("association.html", "L’association",
     "L’Albarelle, association fondée en 1993 pour protéger et faire connaître l’Hôtel-Dieu de Belleville-en-Beaujolais : histoire, missions, signification du nom, bureau.",
     asso, hero=page_hero("L’association", "L’Albarelle", "Des bénévoles passionnés au service d’un patrimoine hospitalier unique.", "assets/img/salle-malades-lit.jpg"))


# ---------------------------------------------------------------- NOS ACTIVITES
act = '''
<nav class="sommaire wrap" aria-label="Dans cette page"><a href="#evenements">Événements</a><a href="#permanentes">Activités permanentes</a><a href="#inventaires">Inventaires</a><a href="#perfectionnement">Perfectionnement des visites</a><a href="#visites">Visites</a></nav>
<section class="section" id="evenements" aria-labelledby="t-evt">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">Événements</span><h2 id="t-evt">Nos prochains rendez-vous</h2>
      <p class="lead">Conférences, expositions, ateliers et Journées du patrimoine. Les événements passés rejoignent automatiquement les archives.</p></div>
    <ul class="filtres" data-filtres-evt aria-label="Filtrer par type" style="margin-top:1.6rem"></ul>
    <div class="liste-evt" data-evenements aria-live="polite"><p>Chargement…</p></div>
    <div class="archives narrow" style="margin:3rem auto 0">
      <h3>Archives</h3>
      <div data-archives></div>
    </div>
  </div>
</section>
''' + FRISE + '''
<section class="section alt" id="permanentes" aria-labelledby="t-perm">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Toute l’année</span><h2 id="t-perm">Nos activités permanentes</h2>
      <p class="lead">En coulisses, les bénévoles de l’Albarelle travaillent sans relâche à connaître, conserver et transmettre le patrimoine de l’Hôtel-Dieu.</p></div>
    <div class="grille g3" style="margin-top:2.4rem">
      <article class="bloc reveal" id="inventaires"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Inventaires</h3>
        <p>Recenser, décrire et documenter les objets, le mobilier et les archives conservés sur le site.</p>
        <p class="attente"><strong>À développer :</strong> méthode, nombre d’objets inventoriés, partenaires, photos des séances de travail.</p></article>
      <article class="bloc bleu-bord reveal" data-d="1" id="perfectionnement"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Perfectionnement des visites</h3>
        <p>Les recherches menées dans les archives nourrissent le discours des visites de l’Hôtel-Dieu, auquel l’association a contribué dès la conception du musée.</p>
        <p class="attente"><strong>À développer :</strong> formations des guides, nouvelles fiches de visite, recherches en cours.</p></article>
      <article class="bloc vin-bord reveal" data-d="2" id="visites"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Visites</h3>
        <p>Faire découvrir les salles de malades, les chapelles, l’apothicairerie et le jardin à tous les publics.</p>
        <p class="attente"><strong>À développer :</strong> rôle des bénévoles dans les visites, visites pour groupes proposées par l’association.</p></article>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="t-pratique">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">Venir à l’Hôtel-Dieu</span><h2 id="t-pratique">Horaires du musée</h2>
      <p class="lead" data-horaires-note>Nouveau en 2026 : ouverture du mercredi après-midi au samedi.</p></div>
    <div class="grille g2" style="margin-top:2rem" data-horaires></div>
    <p class="note" style="margin-top:1.4rem">Visites, tarifs et réservations sont gérés par le musée de l’Hôtel-Dieu (commune de Belleville-en-Beaujolais) : 68 rue de la République, <a href="tel:+33474664467">04 74 66 44 67</a>, <a href="https://hoteldieu-belleville.fr/votre-visite/infos-pratiques/" target="_blank" rel="noopener">site du musée<span class="sr-only"> (nouvelle fenêtre)</span></a>. Vérifiez les horaires avant de vous déplacer.</p>
  </div>
</section>
'''
page("activites.html", "Nos activités",
     "Les activités de l’Albarelle à l’Hôtel-Dieu de Belleville-en-Beaujolais : événements, conférences, expositions, inventaires, perfectionnement des visites et visites.",
     act, hero=page_hero("Agir pour le patrimoine", "Nos activités", "Événements, inventaires, visites : l’Albarelle en action.", "assets/img/expo-visiteurs.jpg"))

# ---------------------------------------------------------------- PUBLICATIONS
pub = '''
<nav class="sommaire wrap" aria-label="Dans cette page"><a href="#livres">Livres</a><a href="#extraits">Extraits</a><a href="#miscellanees">Miscellanées</a></nav>
<section class="section" id="livres" aria-labelledby="t-livres">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">Publications</span><h2 id="t-livres">Livres</h2>
      <p class="lead">Les ouvrages publiés par l’association ou consacrés à l’Hôtel-Dieu de Belleville.</p></div>
    <div class="grille g3" style="margin-top:2rem" data-publications="livres"></div>
  </div>
</section>
''' + FRISE + '''
<section class="section alt" id="extraits" aria-labelledby="t-extraits">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">À lire</span><h2 id="t-extraits">Extraits</h2>
      <p class="lead">Quelques pages choisies, tirées de nos ouvrages et de nos recherches dans les archives.</p></div>
    <div class="grille g2" style="margin-top:2rem" data-publications="extraits"></div>
  </div>
</section>

<section class="section" id="miscellanees" aria-labelledby="t-misc">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">Curiosités</span><h2 id="t-misc">Miscellanées</h2>
      <p class="lead">Anecdotes, documents d’archives et petites histoires de l’Hôtel-Dieu.</p></div>
    <div class="grille g2" style="margin-top:2rem" data-publications="miscellanees"></div>
  </div>
</section>
'''
page("publications.html", "Publications",
     "Livres, extraits et miscellanées de l’Albarelle sur l’histoire de l’Hôtel-Dieu de Belleville-en-Beaujolais.",
     pub, hero=page_hero("Publications", "Publications", "Livres, extraits et miscellanées sur l’histoire de l’Hôtel-Dieu.", "assets/img/photo-c-albarelles.jpg"))

# ---------------------------------------------------------------- HOTEL-DIEU
hd = '''
<nav class="sommaire wrap" aria-label="Dans cette page"><a href="#site-historique">Un site historique</a><a href="#parties-classees">Parties classées</a><a href="#creations">Nos créations</a></nav>
<section class="section" id="site-historique">
  <div class="wrap deux-col">
    <div class="reveal">
      <span class="eyebrow">Un site historique</span>
      <h2>Un des plus beaux Hôtels-Dieu de France</h2>
      <p class="lead">Construit au début du XVIIIe siècle pour accueillir les pauvres de Belleville et des paroisses environnantes, l’Hôtel-Dieu a fermé en 1991. Successivement lieu d’accueil, centre de soins puis hospice, il témoigne de la vie hospitalière du XVIIIe siècle à nos jours.</p>
      <p>Les premiers locaux sont inaugurés en 1733. L’établissement s’agrandit au XIXe siècle : seconde salle de malades et chapelle des malades en 1826, troisième salle en 1850, chapelle des Sœurs en 1851. Il est classé Monument historique.</p>
    </div>
    <div class="cadre reveal" data-d="1"><img src="assets/img/photo-1-facade.jpg" width="1600" height="1323" alt="Façade de l’Hôtel-Dieu sur la rue de la République" loading="lazy"></div>
  </div>
  <div class="wrap">
    <ol class="chrono" data-chrono></ol>
    <p class="note narrow" style="margin:1rem auto 0">Sources : site du musée de l’Hôtel-Dieu, Journées européennes du patrimoine, presse locale.</p>
  </div>
</section>
''' + FRISE + '''
<section class="section alt" id="parties-classees" aria-labelledby="t-classees">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Parties classées</span><h2 id="t-classees">Salles, chapelles et apothicairerie</h2></div>
    <div class="deux-col" style="margin-top:2.4rem" id="salles">
      <div class="reveal">
        <h3>Les salles et les chapelles</h3>
        <p>Trois salles de malades garnies de leurs lits à ruelle, avec poêles, armoires à linge et objets du quotidien et de soin, racontent la vie hospitalière jusqu’en 1991.</p>
        <p>Deux chapelles les accompagnent : celle des malades (1826) et celle des Sœurs (1851).</p>
      </div>
      <div class="cadre reveal" data-d="1" data-groupe><button type="button" class="zoomable" data-src="assets/img/photo-b-salle-soeurs.jpg" data-alt="Sœurs hospitalières dans une salle de malades" data-legende="Une salle de malades et ses lits à ruelle"><img src="assets/img/photo-b-salle-soeurs.jpg" width="1800" height="1445" alt="Mannequins de sœurs hospitalières dans une salle de malades aux lits à ruelle" loading="lazy" style="border-radius:14px"><span class="loupe" aria-hidden="true">+</span></button></div>
    </div>
    <div class="deux-col inverse" style="margin-top:3.5rem" id="apothicairerie">
      <div class="reveal">
        <h3>L’apothicairerie</h3>
        <p>Ancienne pharmacie de l’hôpital, datée de 1754 par le musée (une pharmacie est mentionnée dès 1749). Elle conserve une riche collection de pots en faïence, en verre et en porcelaine, et les instruments pour fabriquer les remèdes : appareil à cachets, pilulier, balances…</p>
        <p>C’est à ces pots, les albarelles, que l’association doit son nom. L’apothicairerie se visite uniquement en visite guidée.</p>
      </div>
      <div class="cadre reveal" data-d="1" data-groupe><button type="button" class="zoomable" data-src="assets/img/photo-c-albarelles.jpg" data-alt="Albarelles en faïence bleue" data-legende="Albarelles en faïence dans les boiseries de l’apothicairerie"><img src="assets/img/photo-c-albarelles.jpg" width="1800" height="1205" alt="Albarelles en faïence bleue et blanche dans les niches de l’apothicairerie" loading="lazy" style="border-radius:14px"><span class="loupe" aria-hidden="true">+</span></button></div>
    </div>
  </div>
</section>

<section class="section" id="creations" aria-labelledby="t-crea">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Nos créations</span><h2 id="t-crea">Ce que l’Albarelle a fait renaître</h2></div>
    <div class="grille g3" style="margin-top:2.4rem">
      <article class="carte reveal" id="bloc-operatoire"><div class="vignette"><img src="assets/img/apothicairerie-balance.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Le bloc opératoire</h3><p>Un bloc chirurgical du début du XXe siècle, visible en visite guidée.</p><p class="attente"><strong>À développer :</strong> histoire de sa reconstitution, photo du bloc.</p></div></article>
      <article class="carte reveal" data-d="1" id="maternite"><div class="vignette"><img src="assets/img/salle-malades-lit.jpg" alt="" loading="lazy"></div><div class="corps"><h3>La maternité</h3><p class="attente"><strong>À développer :</strong> présentation de la maternité, dates, photos.</p></div></article>
      <article class="carte reveal" data-d="2" id="jardin"><div class="vignette"><img src="assets/img/jardin-bugle.jpg" alt="" loading="lazy"></div><div class="corps"><h3>Le jardin de l’Albarelle</h3><p>Dans la cour Saint-Antoine, dix massifs présentent les plantes autrefois cultivées par les Sœurs de Sainte-Marthe, regroupées par vertus : fébrifuges, toniques, dépuratives, anti-douleurs… Le sureau voisin est labellisé « Arbre remarquable » depuis 2023.</p></div></article>
    </div>
  </div>
</section>
'''
page("hotel-dieu.html", "L’Hôtel-Dieu",
     "L’Hôtel-Dieu de Belleville-en-Beaujolais : un site historique, ses parties classées (salles, chapelles, apothicairerie) et les créations de l’Albarelle (bloc opératoire, maternité, jardin).",
     hd, hero=page_hero("Le monument", "L’Hôtel-Dieu", "Trois siècles de vie hospitalière, de 1733 à nos jours.", "assets/img/photo-a-salle-grille.jpg"))

# ---------------------------------------------------------------- GALERIE
gal = '''
<section class="section">
  <div class="wrap">
    <div class="narrow reveal"><span class="eyebrow">En images</span><h2>L’Hôtel-Dieu côté lumière</h2>
      <p class="lead">Choisissez un thème, puis cliquez sur une photo pour l’agrandir.</p></div>
    <ul class="filtres" data-filtres-gal aria-label="Filtrer par thème" style="margin-top:1.6rem"></ul>
    <div class="mosaique" data-galerie data-groupe aria-live="polite"></div>
    <p class="note" style="margin-top:1.6rem">Les droits d’utilisation des photographies sont à confirmer avant mise en ligne définitive.</p>
  </div>
</section>
'''
page("galerie.html", "Galerie",
     "Galerie photo de l’Hôtel-Dieu de Belleville-en-Beaujolais : le bâtiment, les salles, les chapelles, l’apothicairerie, le jardin et les activités de l’Albarelle.",
     gal, hero=page_hero("Galerie", "Galerie photos", "Le bâtiment, les salles, l’apothicairerie, le jardin et nos activités.", "assets/img/apothicairerie-panorama.jpg"))

# ---------------------------------------------------------------- CONTACT
con = '''
<section class="section" id="formulaire">
  <div class="wrap deux-col" style="align-items:start">
    <div class="reveal">
      <span class="eyebrow">Écrivez-nous</span>
      <h2>Une question, une envie de nous rejoindre ?</h2>
      <form class="formulaire" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="Message du site L’Albarelle (%{formName})">
        <p class="cache"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="ligne">
          <div><label for="nom">Nom <span class="requis" aria-hidden="true">*</span></label><input id="nom" name="nom" type="text" autocomplete="name" required></div>
          <div><label for="email">Courriel <span class="requis" aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div><label for="sujet">Sujet</label>
          <select id="sujet" name="sujet">
            <option value="information">Une information</option>
            <option value="visite">Une visite ou un groupe</option>
            <option value="adhesion">Adhérer à l’association</option>
            <option value="benevolat">Devenir bénévole</option>
            <option value="mecenat">Don ou mécénat</option>
            <option value="autre">Autre</option>
          </select></div>
        <div><label for="message">Message <span class="requis" aria-hidden="true">*</span></label><textarea id="message" name="message" required></textarea></div>
        <label class="coche"><input type="checkbox" name="consentement" required> <span>J’accepte que mes données soient utilisées par l’association pour répondre à ma demande (voir les <a href="mentions-legales.html#donnees">mentions légales</a>). <span class="requis" aria-hidden="true">*</span></span></label>
        <div><button class="btn btn-primaire" type="submit">Envoyer le message</button></div>
        <p id="statut-formulaire" class="statut" role="status" tabindex="-1"></p>
      </form>
    </div>
    <div class="reveal" data-d="1">
      <span class="eyebrow">Coordonnées</span>
      <h2>L’association</h2>
      <ul class="coordonnees">
        <li>''' + ICO_MAIL + '''<div><strong>Courriel</strong><a href="mailto:lalbarelle@wanadoo.fr">lalbarelle@wanadoo.fr</a></div></li>
        <li>''' + ICO_PIN + '''<div><strong>Hôtel-Dieu</strong>68 rue de la République<br>69220 Belleville-en-Beaujolais</div></li>
        <li>''' + ICO_PIN + '''<div><strong>Adresse postale</strong>27 rue du Moulin<br>69220 Belleville-en-Beaujolais</div></li>
        <li>''' + ICO_TEL + '''<div><strong>Accueil du musée (visites)</strong><a href="tel:+33474664467">04 74 66 44 67</a></div></li>
      </ul>
      <p class="attente" style="margin-top:1rem"><strong>À compléter :</strong> prénom du contact de l’association et éventuel numéro de téléphone.</p>
      <iframe class="carte-osm" title="Plan : Hôtel-Dieu de Belleville-en-Beaujolais" loading="lazy" style="margin-top:1.2rem;min-height:300px" src="''' + OSM + '''"></iframe>
    </div>
  </div>
</section>
'''
con += '''
<section class="section alt" id="adhesion" aria-labelledby="t-adh">
  <div class="wrap">
    <div class="center narrow reveal"><span class="eyebrow">Adhésions</span><h2 id="t-adh">Rejoindre l’Albarelle</h2>
      <p class="lead">Aucun paiement n’est géré sur ce site : les liens renverront vers des services externes que l’association renseignera.</p></div>
    <div class="grille g3" style="margin-top:2.4rem">
      <article class="bloc reveal"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Adhérer</h3>
        <p>Participez à la vie de l’association et soutenez ses actions.</p>
        <p class="attente"><strong>À compléter :</strong> montant de la cotisation, bulletin d’adhésion à télécharger ou lien d’adhésion en ligne.</p>
        <a class="btn btn-primaire" href="?sujet=adhesion#formulaire" style="margin-top:1rem">Demander à adhérer</a></article>
      <article class="bloc bleu-bord reveal" data-d="1" id="benevolat"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Devenir bénévole</h3>
        <p>Inventaires, visites, jardin, recherches dans les archives, événements : chacun peut trouver sa place.</p>
        <a class="btn btn-primaire" href="?sujet=benevolat#formulaire" style="margin-top:1rem">Proposer mon aide</a></article>
      <article class="bloc vin-bord reveal" data-d="2" id="dons"><span class="puce-pot">''' + ICO_POT + '''</span><h3>Dons &amp; mécénat</h3>
        <p>Un don ou un mécénat d’entreprise finance la recherche, les expositions et l’entretien du jardin.</p>
        <p class="attente"><strong>À compléter :</strong> modalités du don, reçu fiscal éventuel, plateforme choisie.</p>
        <a class="btn btn-primaire" href="?sujet=mecenat#formulaire" style="margin-top:1rem">Nous contacter</a></article>
    </div>
  </div>
</section>
'''
con_extra = '''<script>
(function(){var p=new URLSearchParams(location.search).get("sujet");document.addEventListener("DOMContentLoaded",function(){
var s=document.getElementById("sujet");if(p&&s&&s.querySelector('option[value="'+p+'"]'))s.value=p;
});})();
</script>
'''
page("contact.html", "Contacts / Adhésions",
     "Contacter l’Albarelle et adhérer à l’association de l’Hôtel-Dieu de Belleville-en-Beaujolais : formulaire, adhésion, bénévolat, dons, adresses et plan.",
     con + con_extra, hero=page_hero("Contacts / Adhésions", "Contacts &amp; adhésions", "Une question, l’envie d’adhérer ou de rejoindre l’équipe ? Écrivez-nous.", "assets/img/salle-du-conseil.jpg"))

# ---------------------------------------------------------------- MENTIONS
men = '''
<section class="section">
  <div class="wrap narrow">
    <div class="note" style="margin-bottom:2rem">Page à valider par l’association : les champs entre crochets sont des textes d’attente.</div>
    <h2>Éditeur du site</h2>
    <p>Association L’Albarelle, association loi 1901 pour la mise en valeur de l’Hôtel-Dieu de Belleville-en-Beaujolais.<br>
    Adresse postale : 27 rue du Moulin, 69220 Belleville-en-Beaujolais.<br>
    Siège de visite : Hôtel-Dieu, 68 rue de la République, 69220 Belleville-en-Beaujolais.<br>
    Courriel : <a href="mailto:lalbarelle@wanadoo.fr">lalbarelle@wanadoo.fr</a><br>
    Numéro RNA / SIRET : [À COMPLÉTER]<br>
    Directeur ou directrice de la publication : [À COMPLÉTER : nom et fonction]</p>
    <h2>Conception du site</h2>
    <p>[À COMPLÉTER : nom du prestataire]. Maquette réalisée à partir d’informations publiques.</p>
    <h2>Hébergement</h2>
    <p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis. <a href="https://www.netlify.com" target="_blank" rel="noopener">netlify.com<span class="sr-only"> (nouvelle fenêtre)</span></a></p>
    <h2>Propriété intellectuelle et crédits</h2>
    <p>Le logo « L’Albarelle » appartient à l’association. Les photographies proviennent des communications publiques du musée de l’Hôtel-Dieu et de la commune de Belleville-en-Beaujolais ; les droits d’utilisation sont à confirmer avant publication définitive. Crédits à compléter : [À COMPLÉTER : photographes].</p>
    <p>Les informations pratiques (horaires, tarifs) sont celles du musée de l’Hôtel-Dieu, gestionnaire des visites, et peuvent évoluer : <a href="https://hoteldieu-belleville.fr/votre-visite/infos-pratiques/" target="_blank" rel="noopener">consultez leur site<span class="sr-only"> (nouvelle fenêtre)</span></a>.</p>
    <h2 id="donnees">Données personnelles</h2>
    <p>Le formulaire de contact collecte votre nom, votre courriel et votre message, uniquement pour répondre à votre demande. Ces données sont traitées par l’association et stockées par le service Netlify Forms. Elles ne sont ni vendues ni utilisées à d’autres fins, et sont conservées le temps nécessaire au traitement de votre demande. Conformément au RGPD, vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:lalbarelle@wanadoo.fr">lalbarelle@wanadoo.fr</a>. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr<span class="sr-only"> (nouvelle fenêtre)</span></a>).</p>
    <h2>Cookies et mesure d’audience</h2>
    <p>Ce site n’utilise aucun cookie de suivi ni outil de mesure d’audience. Les polices de caractères sont hébergées sur le site lui-même. Le plan intégré provient d’OpenStreetMap et peut déposer ses propres informations techniques lors de son affichage.</p>
    <h2>Accessibilité</h2>
    <p>Le site vise la conformité avec le référentiel WCAG 2.1 niveau AA (navigation clavier, contrastes, textes alternatifs, respect de la préférence « réduire les animations »). Signalez toute difficulté à <a href="mailto:lalbarelle@wanadoo.fr">lalbarelle@wanadoo.fr</a>.</p>
  </div>
</section>
'''
page("mentions-legales.html", "Mentions légales",
     "Mentions légales du site de l’Albarelle, association pour la mise en valeur de l’Hôtel-Dieu de Belleville-en-Beaujolais.",
     men, hero=page_hero("Informations légales", "Mentions légales", "Éditeur, hébergement, données personnelles et crédits.", "assets/img/vue-aerienne.jpg"))

# ---------------------------------------------------------------- MERCI + 404
merci = '''
<section class="section" style="padding-top:calc(var(--entete) + 5rem)">
  <div class="wrap narrow center">
    <span class="eyebrow">Message envoyé</span><h1 style="font-size:clamp(2.2rem,5vw,3.4rem)">Merci !</h1>
    <p class="lead">Votre message a bien été transmis à l’association. Nous vous répondrons dès que possible.</p>
    <div class="btns" style="justify-content:center"><a class="btn btn-primaire" href="index.html">Retour à l’accueil</a><a class="btn btn-contour" href="activites.html#evenements">Voir nos activités</a></div>
  </div></section>'''
page("merci.html", "Message envoyé", "Confirmation d’envoi de votre message à l’Albarelle.", merci,
     extra_head='<meta name="robots" content="noindex">')
nf = '''
<section class="section" style="padding-top:calc(var(--entete) + 5rem)">
  <div class="wrap narrow center">
    <span class="eyebrow">Erreur 404</span><h1 style="font-size:clamp(2.2rem,5vw,3.4rem)">Page introuvable</h1>
    <p class="lead">Cette page n’existe pas ou a été déplacée.</p>
    <div class="btns" style="justify-content:center"><a class="btn btn-primaire" href="/">Retour à l’accueil</a></div>
  </div></section>'''
page("404.html", "Page introuvable", "Page introuvable.", nf, extra_head='<meta name="robots" content="noindex">', base=True)

# ---------------------------------------------------------------- sitemap, robots
pages = ["index.html"] + [f for f, _ in NAV]
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    f"  <url><loc>{URL}/{'' if f == 'index.html' else f}</loc></url>\n" for f in pages) + "</urlset>\n"
(OUT / "sitemap.xml").write_text(sm)
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {URL}/sitemap.xml\n")
print("pages générées :", len(list(OUT.glob("*.html"))))
