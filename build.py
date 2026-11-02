#!/usr/bin/env python3
"""Génère les 9 pages HTML du site (en-tête, menu et pied de page communs) dans ./site.
Les contenus éditables (artistes, ateliers, expositions, galerie, actualités) restent dans site/data/*.json.
Usage : python3 build.py
"""
import html
from pathlib import Path

OUT = Path(__file__).parent / "site"
NAME = "Cercle d'art de Gentilly"
EMAIL = "cercledartdegentilly@free.fr"
TEL = "06 83 52 43 32"

NAV = [
    ("index.html", "Accueil", "accueil"),
    ("le-cercle.html", "Le cercle", "cercle"),
    ("artistes.html", "Artistes", "artistes"),
    ("ateliers.html", "Ateliers & activités", "ateliers"),
    ("expositions.html", "Expositions & événements", "expositions"),
    ("galerie.html", "Galerie", "galerie"),
    ("actualites.html", "Actualités", "actualites"),
    ("nous-rejoindre.html", "Nous rejoindre", "rejoindre"),
]
LEGAL = ("mentions-legales.html", "Mentions légales", "mentions")
e = html.escape


def head(title, desc, page, og_img):
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#16130f">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="{e(NAME)}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{og_img}">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-page="{page}">
<a class="skip" href="#contenu">Aller au contenu</a>
"""


def header(page):
    links = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if k == page else ""}>{e(l)}</a></li>' for h, l, k in NAV
    )
    mlinks = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if k == page else ""}><span>{i + 1:02d}</span>{e(l)}</a></li>'
        for i, (h, l, k) in enumerate(NAV + [LEGAL])
    )
    return f"""<header class="site-header" data-hero="true">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="{e(NAME)} — accueil">
      <img class="logo-b" src="img/logo.png" alt="" width="54" height="54"><img class="logo-w" src="img/logo-blanc.png" alt="" width="54" height="54">
      <span>Cercle d'art<small>Gentilly · depuis 1966</small></span>
    </a>
    <nav class="nav" aria-label="Navigation principale"><ul>{links}</ul></nav>
    <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="Menu mobile"><ul>{mlinks}</ul></nav>
  <p class="mm-foot">{e(EMAIL)}<br>{TEL}<br>Gentilly (94)</p>
</div>
"""


def footer():
    flinks = "".join(f'<li><a href="{h}">{e(l)}</a></li>' for h, l, k in NAV + [LEGAL])
    return f"""<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="img/logo-blanc.png" alt="Logo du Cercle d'art de Gentilly" width="96" height="96" loading="lazy">
        <p>Association loi 1901 fondée en 1966, reconnue d'intérêt général. Peinture, dessin, modelage, sculpture, gravure, modèle vivant et carnets de croquis à Gentilly.</p>
      </div>
      <div>
        <h2>Pages</h2>
        <ul>{flinks}</ul>
      </div>
      <div>
        <h2>Contact</h2>
        <ul>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li><a href="tel:+33683524332">{TEL}</a></li>
          <li>Siège : 70, rue d'Arcueil<br>94250 Gentilly</li>
          <li>Point d'encrage : 25, rue Jean Louis<br>Salle Marcel Paul : 17, rue Raymond Lefèbvre</li>
        </ul>
      </div>
      <div>
        <h2>Suivre le cercle</h2>
        <ul>
          <li><a href="https://www.facebook.com/cercledeartdegentilly" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="http://cercledartdegentilly.blogspot.com" target="_blank" rel="noopener">Blog « Blog-notes »</a></li>
          <li><a href="https://zigzag-gentilly.com" target="_blank" rel="noopener">Zig-Zag à Gentilly</a></li>
          <li><a href="http://cercledartdegentilly.free.fr" target="_blank" rel="noopener">Ancien site (archives)</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span id="yr">2026</span> Cercle d'art de Gentilly — Œuvres et visuels © leurs auteurs</span>
      <a href="mentions-legales.html">Mentions légales &amp; droits d'auteur</a>
    </div>
  </div>
</footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
<script src="js/main.js" defer></script>
</body>
</html>
"""


def page_hero(kicker, title, text, img, alt=""):
    return f"""<section class="page-hero" aria-labelledby="titre-page">
  <div class="bg"><img src="{img}" alt="{e(alt)}" fetchpriority="high"></div>
  <div class="wrap">
    <p class="kicker">{e(kicker)}</p>
    <h1 id="titre-page">{title}</h1>
    <p>{e(text)}</p>
  </div>
</section>
"""


def write(fname, page, title, desc, hero, main, og="img/fresque-2022.jpg", extra_head=""):
    h = head(title, desc, page, og)
    if extra_head:
        h = h.replace("</head>", extra_head + "\n</head>")
    (OUT / fname).write_text(h + header(page) + hero + f'<main id="contenu">\n{main}</main>\n' + footer(), encoding="utf-8")


CTA = """<section class="section dark cta-band">
  <img class="bg-logo" src="img/logo-blanc.png" alt="" loading="lazy">
  <div class="wrap reveal">
    <p class="kicker" style="justify-content:center">Rejoindre le cercle</p>
    <h2>Venez <em class="brush">créer</em> avec nous</h2>
    <p class="lead" style="margin-inline:auto">Le Cercle d'art est un cercle ouvert : enfants dès 4 ans, ados, adultes, débutants ou initiés. Adhésion 23 € par an.</p>
    <div class="btn-row"><a class="btn solid" href="nous-rejoindre.html">Adhérer ou essayer <span class="arr">→</span></a><a class="btn" href="ateliers.html">Voir les ateliers</a></div>
  </div>
</section>
"""

# ------------------------------------------------------------------ ACCUEIL
SLIDES = [
    ("fresque-2022", "Fresque « Le monde est ma maison » — fête de Gentilly 2022, enfants de l'atelier dessin / peinture", "Fresque collective sur la scène de la fête de Gentilly, 2022"),
    ("expo-freiberg", "« Gravir l'Olympe » — exposition à la Petrikirche de Freiberg (Saxe), 2024", "Exposition dans une église du 13e siècle"),
    ("croquis-musee", "Sortie carnets de croquis dans un musée parisien", "Enfants dessinant devant des sculptures"),
    ("fresque-2019", "Fresque « Le jardin d'été » — 2019", "Fresque colorée"),
    ("modele-vivant-atelier", "Atelier libre de modèle vivant, salle Marcel Paul", "Atelier de modèle vivant"),
    ("fresque-2018", "Fresque 2018 — grande scène de la fête de Gentilly", "Fresque en toile sur la scène"),
]
slides_html = "".join(
    f'<div class="hero-slide{" active" if i == 0 else ""}" data-caption="{e(c)}"><img src="img/{n}.jpg" alt="{e(a)}"{" fetchpriority=\"high\"" if i == 0 else " loading=\"lazy\""}></div>'
    for i, (n, c, a) in enumerate(SLIDES)
)
ticker_items = ["Zig-Zag, ateliers d'artistes portes ouvertes", "Fresques pour la fête de Gentilly", "Point d'encrage, atelier de gravure", "Marché de Noël des graveurs", "Carnets de croquis", "Modèle vivant", "Modelage & sculpture", "Peinture & dessin"]
ticker = "".join(f"<span>{e(t)}</span>" for t in ticker_items * 2)

home_hero = f"""<section class="hero" aria-label="Diaporama d'œuvres">
  <div class="hero-slides">{slides_html}</div>
  <div class="hero-content"><div class="wrap">
    <h1><small>Association d'art · Gentilly (94)</small>Cercle d'art <em class="brush">de Gentilly</em></h1>
    <p class="accroche">L'art à Gentilly depuis 1966 : peindre, graver, modeler, dessiner — et regarder ensemble.</p>
    <div class="btn-row on-image"><a class="btn solid" href="ateliers.html">Nos ateliers <span class="arr">→</span></a><a class="btn" href="galerie.html">Voir la galerie</a></div>
  </div></div>
  <div class="scroll-cue" aria-hidden="true">Défiler</div>
  <div class="hero-ui"><div class="wrap"><div class="dots" role="group" aria-label="Choisir une œuvre"></div><span class="hero-caption" aria-live="off"></span></div></div>
</section>
<div class="ticker" aria-hidden="true"><div class="ticker-track">{ticker}</div></div>
"""

home_main = """<section class="section dark" id="prochain" aria-label="Prochain événement"><div class="wrap"><div class="next" id="next-event"><p class="muted">Chargement du prochain rendez-vous…</p></div></div></section>

<section class="section">
  <div class="wrap two-col wide-left">
    <div class="reveal">
      <p class="kicker">Le cercle</p>
      <h2>Un cercle <em class="brush">ouvert</em>, au cœur d'une ville d'artistes</h2>
      <p class="lead">Depuis 1966, l'association fait découvrir les œuvres, favorise les rencontres et guide jeunes et adultes vers la pratique des arts plastiques. Elle a initié Zig-Zag, les portes ouvertes des ateliers d'artistes de Gentilly, et signe chaque année la fresque de la grande scène de la fête de la ville.</p>
      <div class="btn-row"><a class="btn" href="le-cercle.html">Notre histoire <span class="arr">→</span></a></div>
    </div>
    <figure class="figure-frame reveal"><img src="img/fete-2019.jpg" alt="Stand des ateliers du Cercle d'art à la fête de Gentilly, des enfants dessinent sur des chevalets dans un parc" loading="lazy"><figcaption>Les ateliers du Cercle d'art à la fête de Gentilly, 2019 — Photo : Gaëlle</figcaption></figure>
  </div>
</section>

<section class="section tight">
  <div class="wrap">
    <p class="kicker reveal">Explorer</p>
    <h2 class="reveal">Entrez dans <em class="brush">l'atelier</em></h2>
    <div class="tiles">
      <a class="tile big reveal" href="galerie.html"><img src="img/fresque-2023.jpg" alt="" loading="lazy"><div><h3>La galerie</h3><p>Fresques, calendrier des J.O., expositions, carnets de croquis : les œuvres en plein écran, créditées.</p><span class="go">Voir les œuvres →</span></div></a>
      <a class="tile big reveal" href="ateliers.html"><img src="img/modele-vivant-atelier.jpg" alt="" loading="lazy"><div><h3>Ateliers &amp; activités</h3><p>Peinture-dessin, modelage-sculpture, gravure, modèle vivant, carnets de croquis. Jours, horaires, tarifs.</p><span class="go">Découvrir →</span></div></a>
      <a class="tile reveal" href="artistes.html"><img src="img/expo-freiberg.jpg" alt="" loading="lazy"><div><h3>Artistes</h3><p>Ceux qui font vivre le cercle.</p><span class="go">Rencontrer →</span></div></a>
      <a class="tile reveal" href="expositions.html"><img src="img/invitation-esprit-atelier-1.jpg" alt="" loading="lazy"><div><h3>Expositions &amp; événements</h3><p>Vernissages, salons, archives.</p><span class="go">Agenda →</span></div></a>
      <a class="tile reveal" href="le-cercle.html"><img src="img/croquis-musee.jpg" alt="" loading="lazy"><div><h3>Le cercle</h3><p>Histoire, valeurs, bureau.</p><span class="go">En savoir plus →</span></div></a>
    </div>
  </div>
</section>

<section class="section dark" aria-label="Le cercle en chiffres">
  <div class="wrap">
    <p class="kicker reveal">En chiffres</p>
    <div class="stats" id="stats"></div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem">
      <div><p class="kicker reveal">Actualités</p><h2 class="reveal" style="margin:0">Dernières <em class="brush">nouvelles</em></h2></div>
      <a class="link-arrow reveal" href="actualites.html">Toutes les actualités</a>
    </div>
    <div class="cards c3" id="home-news"></div>
  </div>
</section>
""" + CTA

jsonld = """<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Cercle d'art de Gentilly","foundingDate":"1966","email":"cercledartdegentilly@free.fr","telephone":"+33683524332","address":{"@type":"PostalAddress","streetAddress":"70 rue d'Arcueil","postalCode":"94250","addressLocality":"Gentilly","addressCountry":"FR"},"sameAs":["https://www.facebook.com/cercledeartdegentilly"]}</script>"""
write("index.html", "accueil", "Cercle d'art de Gentilly — Ateliers, expositions et artistes à Gentilly (94)",
      "Association d'art à Gentilly depuis 1966 : ateliers de peinture, dessin, sculpture et gravure, expositions, artistes. Rejoignez le Cercle d'art.",
      home_hero, home_main, extra_head=jsonld)

# ---------------------------------------------------------------- LE CERCLE
cercle_main = """<section class="section">
  <div class="wrap two-col wide-left">
    <div class="reveal">
      <p class="kicker">Présentation</p>
      <h2>Maintenir, défendre et promouvoir <em class="brush">les arts</em></h2>
      <p class="lead">Le Cercle d'art de Gentilly est une association loi 1901 créée en 1966, reconnue d'intérêt général depuis 2022, « pour maintenir, défendre et promouvoir les arts, sa libre expression, développer la culture et l'enseignement de l'art ».</p>
      <p>Grâce à la forte implantation d'artistes plasticiens dans la commune, elle mène une animation tournée vers les habitants : faire découvrir les œuvres, permettre des rencontres, guider jeunes et adultes vers la découverte de ces modes d'expression — sans oublier l'ouverture vers d'autres horizons de pratiques, géographiques et conceptuelles.</p>
      <p>Le cercle est subventionné par la Ville de Gentilly et le Département du Val-de-Marne ; les salles où se tiennent les ateliers sont des locaux municipaux gracieusement mis à sa disposition. Il organise des cours d'arts plastiques pour enfants et adultes — dessin-peinture, modelage-sculpture, gravure — ainsi que des journées visites-croquis et des séances de modèle vivant.</p>
    </div>
    <figure class="figure-frame reveal"><img src="img/fresque-2023.jpg" alt="Fresque « Les jeunes unis pour la paix » sur la scène de la fête de Gentilly, 2023" loading="lazy"><figcaption>Fresque « Les jeunes unis pour la paix », 2023 — atelier ados du Cercle d'art et école Käthe Kollwitz de Freiberg</figcaption></figure>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <p class="kicker reveal">Nos valeurs</p>
    <h2 class="reveal">Ce qui nous <em class="brush">anime</em></h2>
    <div class="values">
      <div class="value reveal"><b>La <i>proximité</i></b><p>Favoriser la pratique des arts visuels près de chez soi, à tout âge.</p></div>
      <div class="value reveal"><b>L'<i>autonomie</i></b><p>Apprendre des techniques pour développer le regard, la curiosité, la créativité et la confiance en soi.</p></div>
      <div class="value reveal"><b>La <i>rencontre</i></b><p>Un esprit d'atelier, des artistes invités, des sorties, des expositions pour se retrouver.</p></div>
      <div class="value reveal"><b>L'<i>ouverture</i></b><p>Un cercle ouvert : nous souhaitons l'engagement de nouvelles volontés pour dynamiser une force collective.</p></div>
    </div>
  </div>
</section>

<section class="section dark">
  <div class="wrap two-col">
    <div class="reveal"><p class="kicker">Histoire</p><h2>Soixante ans <em class="brush">d'ateliers</em></h2><p class="lead">Quelques repères tirés des sites du cercle. Les dates précises de certains événements sont à compléter par l'association.</p></div>
    <ol class="timeline" id="timeline"></ol>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="kicker reveal">Bureau &amp; équipe</p>
    <h2 class="reveal">Celles et ceux qui <em class="brush">font vivre</em> le cercle</h2>
    <div class="bureau" id="bureau"></div>
    <p class="note reveal" style="margin-top:1.5rem">Les intervenants et animateurs des ateliers sont présentés sur la page <a href="artistes.html">Artistes</a>. La composition complète du bureau est un texte d'attente à renseigner par le cercle (fichier <code>data/site.json</code>).</p>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <p class="kicker reveal">Partenaires</p>
    <h2 class="reveal">Avec <em class="brush">la ville</em> et au-delà</h2>
    <ul class="partners" id="partners"></ul>
  </div>
</section>
""" + CTA
write("le-cercle.html", "cercle", "Le cercle — histoire, valeurs et bureau | Cercle d'art de Gentilly",
      "Association loi 1901 fondée en 1966 à Gentilly : présentation, histoire, valeurs, bureau et partenaires du Cercle d'art.",
      page_hero("Le cercle", "Un cercle <em class=\"brush\">ouvert</em> depuis 1966", "Association d'art de Gentilly : ateliers, expositions, fresques et portes ouvertes.", "img/fresque-2023.jpg"),
      cercle_main)

# ----------------------------------------------------------------- ARTISTES
art_main = """<section class="section">
  <div class="wrap">
    <p class="lead reveal" style="margin-bottom:2rem">Intervenants, animateurs et artistes du cercle. <b>Survolez ou touchez une carte</b> pour la retourner et découvrir la présentation et quelques œuvres.</p>
    <div class="filters" id="chips" role="group" aria-label="Filtrer par discipline"></div>
    <p class="sr-only" id="artist-live" aria-live="polite"></p>
    <div class="flip-grid" id="flip-grid"><p class="muted">Chargement…</p></div>
    <p class="note reveal" style="margin-top:2.5rem">Aucun portrait ni œuvre n'est affiché sans l'accord de l'artiste. Les cartes sans œuvre attendent les visuels et les textes que le cercle ajoutera dans <code>data/artistes.json</code>.</p>
  </div>
</section>
<section class="section alt" id="names-wrap">
  <div class="wrap">
    <p class="kicker reveal">De près et de loin</p>
    <h2 class="reveal"><span id="names-count">—</span> artistes ont agi avec nous</h2>
    <p class="lead reveal">Une partie des artistes qui ont participé à la vie du cercle depuis plus de 40 ans. Quand c'est possible, un lien renvoie vers leur site. Un oubli ? Dites-le-nous !</p>
    <ul class="names" id="names"></ul>
  </div>
</section>
""" + CTA
write("artistes.html", "artistes", "Artistes adhérents et intervenants | Cercle d'art de Gentilly",
      "Les artistes et intervenants du Cercle d'art de Gentilly : graveurs, peintres, sculpteurs, carnettistes. Filtrer par discipline.",
      page_hero("Artistes", "Ceux qui font <em class=\"brush\">vivre</em> le cercle", "Graveurs, peintres, sculpteurs, carnettistes : des artistes de Gentilly et d'ailleurs.", "img/expo-freiberg.jpg"),
      art_main)

# ----------------------------------------------------------------- ATELIERS
at_main = """<section class="section">
  <div class="wrap">
    <p class="lead reveal">Des ateliers toute l'année à Gentilly, pour tous les âges : <b>enfants dès 4 ans</b> (peinture-dessin), <b>dès 6 ans</b> (modelage-sculpture), <b>dès 8 ans</b> (gravure), ados dès 12 ans, adultes tous âges. Renseignements et inscriptions : <a href="tel:+33683524332">06 83 52 43 32</a>.</p>
    <p class="note" id="ateliers-note"></p>
    <nav class="disc-nav" id="disc-nav" aria-label="Aller à une discipline"></nav>
    <div id="ateliers-list"></div>
  </div>
</section>
<section class="section dark" id="tarifs"><div class="wrap" id="tarifs-body"></div></section>
<section class="section" id="stages">
  <div class="wrap two-col">
    <div id="stages-body" class="reveal"></div>
    <div class="reveal panel">
      <h3>Inscriptions 2026-2027</h3>
      <p>Téléchargez la feuille d'inscription (PDF), complétez-la et envoyez-la avec votre règlement, ou écrivez-nous.</p>
      <div class="btn-row"><a class="btn solid" href="docs/inscription-2026-2027.pdf" target="_blank" rel="noopener">Feuille d'inscription (PDF)</a><a class="btn" href="docs/depliant-2025-2026.pdf" target="_blank" rel="noopener">Dépliant 2025-2026 (PDF)</a></div>
      <p class="form-note" style="margin-top:1rem">Le dépliant 2026-2027 sera ajouté dès sa publication par le cercle.</p>
    </div>
  </div>
</section>
""" + CTA
write("ateliers.html", "ateliers", "Ateliers & activités — peinture, sculpture, gravure | Cercle d'art de Gentilly",
      "Ateliers du Cercle d'art de Gentilly : peinture-dessin, modelage-sculpture, gravure, modèle vivant, carnets de croquis. Jours, horaires, lieux et tarifs.",
      page_hero("Ateliers & activités", "Pratiquer, <em class=\"brush\">ensemble</em>", "Peinture, dessin, modelage, sculpture, gravure, modèle vivant, carnets de croquis : jours, horaires, lieux et tarifs.", "img/modele-vivant-atelier.jpg"),
      at_main)

# -------------------------------------------------------------- EXPOSITIONS
ex_main = """<section class="section">
  <div class="wrap">
    <p class="kicker reveal">À venir</p>
    <h2 class="reveal">Prochains <em class="brush">rendez-vous</em></h2>
    <div id="prochains"></div>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <p class="kicker reveal">Archives</p>
    <h2 class="reveal">Les éditions <em class="brush">passées</em></h2>
    <p class="lead reveal">Expositions, salons, stages et fêtes depuis 2022. Cliquez sur une affiche pour l'agrandir.</p>
    <div id="archives"></div>
  </div>
</section>
""" + CTA
write("expositions.html", "expositions", "Expositions & événements — vernissages, salons, archives | Cercle d'art de Gentilly",
      "Prochains rendez-vous, vernissages, salons et archives des éditions passées du Cercle d'art de Gentilly, avec les affiches.",
      page_hero("Expositions & événements", "Voir, <em class=\"brush\">se rencontrer</em>", "Marché de Noël, Zig-Zag, journées des ateliers d'artistes, salons : l'agenda et les archives du cercle.", "img/invitation-esprit-atelier-1.jpg"),
      ex_main)

# ------------------------------------------------------------------ GALERIE
ga_main = """<section class="section">
  <div class="wrap">
    <div class="filter-bar reveal" role="search" aria-label="Filtrer la galerie">
      <div><label for="f-artiste">Par artiste</label><select id="f-artiste"></select></div>
      <div><label for="f-disc">Par discipline</label><select id="f-disc"></select></div>
      <div><label for="f-expo">Par exposition / série</label><select id="f-expo"></select></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap"><p class="count" id="g-count" aria-live="polite"></p><button class="chip" id="g-reset" type="button">Réinitialiser</button></div>
    <div class="masonry" id="masonry"></div>
    <p class="note" style="margin-top:2rem">Chaque œuvre est créditée dans la visionneuse. Les œuvres collectives sont signées du nom de l'atelier. Reproduction interdite sans l'accord des auteurs — voir les <a href="mentions-legales.html">mentions légales</a>.</p>
  </div>
</section>
""" + CTA
write("galerie.html", "galerie", "Galerie — œuvres, fresques, estampes | Cercle d'art de Gentilly",
      "Galerie du Cercle d'art de Gentilly : fresques, calendrier des J.O., estampes, carnets de croquis. Visionneuse plein écran, œuvres créditées.",
      page_hero("Galerie", "Les œuvres <em class=\"brush\">en grand</em>", "Fresques, estampes, carnets de croquis et expositions — classées par artiste, discipline ou exposition.", "img/fresque-2018.jpg"),
      ga_main)

# --------------------------------------------------------------- ACTUALITES
ac_main = """<section class="section">
  <div class="wrap">
    <div class="filters" id="news-chips" role="group" aria-label="Filtrer par catégorie"></div>
    <div class="cards" id="news-list"></div>
    <p class="note" style="margin-top:2.5rem">Pour annoncer une exposition ou une nouvelle, écrivez-nous : <a href="mailto:cercledartdegentilly@free.fr">cercledartdegentilly@free.fr</a>. Retrouvez aussi le cercle sur <a href="https://www.facebook.com/cercledeartdegentilly" target="_blank" rel="noopener">Facebook</a> et sur le blog <a href="http://cercledartdegentilly.blogspot.com" target="_blank" rel="noopener">Blog-notes</a>.</p>
  </div>
</section>
""" + CTA
write("actualites.html", "actualites", "Actualités du Cercle d'art de Gentilly",
      "Stages, expositions, sorties, marché de Noël : les dernières nouvelles du Cercle d'art de Gentilly.",
      page_hero("Actualités", "Les dernières <em class=\"brush\">nouvelles</em>", "Stages, sorties, expositions et vie du cercle.", "img/fete-2019.jpg"),
      ac_main)

# ----------------------------------------------------------- NOUS REJOINDRE
rj_main = """<section class="section dark">
  <div class="wrap">
    <p class="kicker reveal">Comment ça marche</p>
    <h2 class="reveal">Rejoindre le cercle en <em class="brush">trois pas</em></h2>
    <ol class="steps">
      <li class="reveal"><b>Choisir un atelier</b><p>Peinture-dessin, sculpture, gravure, modèle vivant, carnets de croquis : consultez les <a href="ateliers.html">horaires et tarifs</a>.</p></li>
      <li class="reveal"><b>Essayer</b><p><span class="placeholder-text">Modalités de la séance d'essai à confirmer par le cercle.</span> Écrivez-nous ou appelez le 06 83 52 43 32 : nous vous proposerons une venue dans l'atelier de votre choix.</p></li>
      <li class="reveal"><b>Adhérer</b><p>Adhésion annuelle <b id="adhesion-montant">23 €</b>. <span id="adhesion-detail">Elle donne droit à des tarifs réduits sur les stages et le modèle vivant.</span> <a id="adhesion-pdf" href="docs/inscription-2026-2027.pdf" target="_blank" rel="noopener">Feuille d'inscription (PDF)</a></p></li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="wrap two-col">
    <div class="reveal">
      <p class="kicker">Nous écrire</p>
      <h2>Une question ? <em class="brush">Écrivez-nous</em></h2>
      <p>Pour toute question, une demande d'information ou une proposition d'exposition.</p>
      <div class="alert" id="merci" role="status" tabindex="-1" hidden>Merci ! Votre message a bien été envoyé. Le cercle vous répondra dès que possible.</div>
      <form name="contact" method="POST" action="nous-rejoindre.html?merci=1" data-netlify="true" netlify-honeypot="bot-field" class="form-grid two">
        <input type="hidden" name="form-name" value="contact">
        <p hidden><label>Ne pas remplir : <input name="bot-field"></label></p>
        <div class="field"><label for="c-nom">Nom <span class="req">*</span></label><input id="c-nom" name="nom" required autocomplete="name"></div>
        <div class="field"><label for="c-mail">E-mail <span class="req">*</span></label><input id="c-mail" name="email" type="email" required autocomplete="email"></div>
        <div class="field full"><label for="c-sujet">Sujet</label><select id="c-sujet" name="sujet"><option>Renseignement général</option><option>Ateliers et inscriptions</option><option>Stages</option><option>Exposition / événement</option><option>Autre</option></select></div>
        <div class="field full"><label for="c-msg">Message <span class="req">*</span></label><textarea id="c-msg" name="message" required></textarea></div>
        <p class="form-note full">Les informations saisies servent uniquement à répondre à votre demande (voir <a href="mentions-legales.html">mentions légales</a>).</p>
        <div class="full"><button class="btn solid" type="submit">Envoyer le message <span class="arr">→</span></button></div>
      </form>
    </div>
    <div class="reveal panel" id="adhesion">
      <p class="kicker">Adhésion &amp; séance d'essai</p>
      <h3>Demande d'adhésion ou d'essai</h3>
      <p>Indiquez votre souhait : nous revenons vers vous pour finaliser l'inscription (paiement par chèque ou virement, voir la feuille d'inscription).</p>
      <form name="adhesion-essai" method="POST" action="nous-rejoindre.html?merci=1" data-netlify="true" netlify-honeypot="bot-field" class="form-grid two">
        <input type="hidden" name="form-name" value="adhesion-essai">
        <p hidden><label>Ne pas remplir : <input name="bot-field"></label></p>
        <div class="field"><label for="a-nom">Nom <span class="req">*</span></label><input id="a-nom" name="nom" required autocomplete="family-name"></div>
        <div class="field"><label for="a-prenom">Prénom <span class="req">*</span></label><input id="a-prenom" name="prenom" required autocomplete="given-name"></div>
        <div class="field"><label for="a-mail">E-mail <span class="req">*</span></label><input id="a-mail" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="a-tel">Téléphone</label><input id="a-tel" name="telephone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="a-demande">Ma demande</label><select id="a-demande" name="demande"><option>Séance d'essai</option><option>Adhésion</option><option>Séance d'essai puis adhésion</option><option>Stage découverte</option></select></div>
        <div class="field"><label for="a-disc">Discipline</label><select id="a-disc" name="discipline"><option>Peinture / dessin</option><option>Modelage / sculpture</option><option>Gravure</option><option>Modèle vivant</option><option>Carnets de croquis</option><option>Je ne sais pas encore</option></select></div>
        <div class="field full"><label for="a-public">Pour qui ?</label><select id="a-public" name="public"><option>Enfant 4-6 ans</option><option>Enfant 6-11 ans</option><option>Ado</option><option>Jeune adulte (moins de 25 ans)</option><option>Adulte</option></select></div>
        <div class="field full"><label for="a-msg">Message</label><textarea id="a-msg" name="message" style="min-height:100px"></textarea></div>
        <div class="full"><button class="btn solid" type="submit">Envoyer ma demande <span class="arr">→</span></button></div>
      </form>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="wrap two-col">
    <div class="reveal">
      <p class="kicker">Coordonnées</p>
      <h2>Nous <em class="brush">trouver</em></h2>
      <ul class="contact-list">
        <li><b>E-mail</b><a href="mailto:cercledartdegentilly@free.fr">cercledartdegentilly@free.fr</a></li>
        <li><b>Téléphone</b><a href="tel:+33683524332">06 83 52 43 32</a> · <a href="tel:+33146643059">01 46 64 30 59</a><br><span class="muted">Danielle Rivier, présidente</span></li>
        <li><b>Siège</b>Cercle d'art de Gentilly, 70 rue d'Arcueil, 94250 Gentilly</li>
        <li><b>Réseaux</b><a href="https://www.facebook.com/cercledeartdegentilly" target="_blank" rel="noopener">Facebook</a> · <a href="http://cercledartdegentilly.blogspot.com" target="_blank" rel="noopener">Blog</a></li>
      </ul>
    </div>
    <div class="reveal">
      <iframe class="map" title="Carte de Gentilly (OpenStreetMap)" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=2.3170%2C48.7990%2C2.3720%2C48.8260&amp;layer=mapnik"></iframe>
      <p class="form-note" style="margin-top:.6rem"><a href="https://www.openstreetmap.org/search?query=Gentilly%2094250" target="_blank" rel="noopener">Agrandir la carte</a> · données © contributeurs OpenStreetMap</p>
    </div>
  </div>
  <div class="wrap places">
    <div class="place reveal"><b>Point d'encrage</b>Atelier de gravure — 25, rue Jean Louis (cour de l'ancien collège Pierre Curie, entrée côté parking). Métro 14 / RER B / bus 57, 184, 186 : arrêt Hôpital Bicêtre. <a href="https://www.openstreetmap.org/search?query=25%20rue%20Jean%20Louis%20Gentilly" target="_blank" rel="noopener">Plan</a></div>
    <div class="place reveal"><b>Salle Marcel Paul</b>Peinture-dessin, modèle vivant, carnets de croquis — 17, rue Raymond Lefèbvre. <a href="https://www.openstreetmap.org/search?query=17%20rue%20Raymond%20Lef%C3%A8bvre%20Gentilly" target="_blank" rel="noopener">Plan</a></div>
    <div class="place reveal"><b>CMAC — modelage / sculpture</b>2, rue Jules Ferry, rez-de-jardin, entrée par le jardin du Conservatoire. <a href="https://www.openstreetmap.org/search?query=2%20rue%20Jules%20Ferry%20Gentilly" target="_blank" rel="noopener">Plan</a></div>
  </div>
</section>
"""
write("nous-rejoindre.html", "rejoindre", "Nous rejoindre & contact — adhésion, séance d'essai | Cercle d'art de Gentilly",
      "Adhérer au Cercle d'art de Gentilly, demander une séance d'essai ou nous écrire : formulaires, coordonnées, lieux des ateliers à Gentilly.",
      page_hero("Nous rejoindre / Contact", "Venez <em class=\"brush\">essayer</em>", "Adhésion, séance d'essai, questions : tout pour nous rejoindre à Gentilly.", "img/croquis-musee.jpg"),
      rj_main)

# --------------------------------------------------------------- MENTIONS
ml_main = """<section class="section">
  <div class="wrap legal">
    <h2>Éditeur du site</h2>
    <p><b>Cercle d'art de Gentilly</b> — association loi 1901 fondée en 1966, reconnue d'intérêt général.<br>Siège : 70, rue d'Arcueil, 94250 Gentilly<br>E-mail : <a href="mailto:cercledartdegentilly@free.fr">cercledartdegentilly@free.fr</a> · Tél. : 06 83 52 43 32<br>Directrice de la publication : Danielle Rivier, présidente <span class="placeholder-text">(à confirmer par le cercle)</span>.<br>N° RNA / SIRET : <span class="placeholder-text">à compléter</span></p>
    <h2>Hébergement</h2>
    <p>Site hébergé par Netlify, Inc. (États-Unis). <span class="placeholder-text">Coordonnées complètes de l'hébergeur à compléter si le cercle change d'hébergeur.</span></p>
    <h2>Droits d'auteur sur les œuvres</h2>
    <p>Les œuvres, affiches, photographies et textes présentés sur ce site restent la propriété de leurs auteurs. Chaque œuvre est publiée avec le nom de son auteur ou la mention de l'atelier ou du collectif qui l'a réalisée. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans l'autorisation écrite de l'auteur est interdite (Code de la propriété intellectuelle).</p>
    <p>Un artiste qui souhaite faire ajouter, modifier ou retirer une œuvre ou un portrait peut écrire à <a href="mailto:cercledartdegentilly@free.fr">cercledartdegentilly@free.fr</a> : la demande est traitée dans les meilleurs délais.</p>
    <h2>Crédits</h2>
    <p>Visuels : archives du Cercle d'art de Gentilly (anciens et nouveaux sites de l'association), photographies de ses ateliers et événements. Les affiches sont celles du Cercle d'art de Gentilly ; les mentions de crédit figurent dans la visionneuse de la galerie. Logo : Cercle d'art de Gentilly. Cartographie : © contributeurs OpenStreetMap. Typographies : Fraunces et Inter (Google Fonts).</p>
    <h2>Données personnelles</h2>
    <p>Les formulaires du site (contact, adhésion / séance d'essai) collectent les informations que vous saisissez (nom, e-mail, téléphone, message) uniquement pour répondre à votre demande. Elles sont transmises au cercle via le service Netlify Forms, ne sont ni vendues ni cédées, et sont conservées le temps nécessaire au traitement de la demande. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:cercledartdegentilly@free.fr">cercledartdegentilly@free.fr</a>.</p>
    <p>Ce site n'utilise pas de cookies de suivi publicitaire. Les polices sont chargées depuis Google Fonts et la carte depuis OpenStreetMap, ce qui transmet l'adresse IP du visiteur à ces services.</p>
    <h2>Liens externes</h2>
    <p>Le site renvoie vers des sites tiers (Facebook, Zig-Zag à Gentilly, sites personnels d'artistes). Le cercle n'est pas responsable de leur contenu.</p>
    <h2>À propos de cette maquette</h2>
    <p>Ce site est une proposition de refonte du site du cercle, réalisée à partir de ses contenus existants. Les textes marqués comme « à compléter » ou « à confirmer » sont des textes d'attente à modifier dans le dossier <code>data/</code>.</p>
  </div>
</section>
"""
write("mentions-legales.html", "mentions", "Mentions légales & droits d'auteur | Cercle d'art de Gentilly",
      "Mentions légales du site du Cercle d'art de Gentilly : éditeur, hébergement, droits d'auteur sur les œuvres, données personnelles.",
      page_hero("Informations légales", "Mentions <em class=\"brush\">légales</em>", "Éditeur, hébergement, droits d'auteur sur les œuvres et protection des données.", "img/fresque-2024.jpg"),
      ml_main)
print("pages générées dans", OUT)
