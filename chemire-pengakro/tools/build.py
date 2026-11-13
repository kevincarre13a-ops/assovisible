#!/usr/bin/env python3
"""Génère les pages HTML statiques du site (en-tête et pied de page communs).

Usage : python3 tools/build.py   (depuis le dossier chemire-pengakro)
Les contenus « vivants » (projets, événements, actualités, galerie, chiffres)
sont dans js/data.js et n'exigent pas de relancer ce script.
"""
import json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAP = json.loads((ROOT / "tools" / "map.json").read_text())

SITE = "Comité de Solidarité Chemiré-le-Gaudin – Pengakro"
PHONE = "06 87 15 91 06"
PHONE_HREF = "+33687159106"
EMAIL = "foucault.michel.luc@wanadoo.fr"

NAV = [
    ("index.html", "Accueil"),
    ("comite.html", "Le comité"),
    ("pengakro.html", "Pengakro"),
    ("projets.html", "Nos projets"),
    ("evenements.html", "Événements"),
    ("actualites.html", "Actualités"),
    ("galerie.html", "Galerie"),
    ("soutenir.html", "Nous soutenir"),
    ("partenaires.html", "Partenaires"),
    ("contact.html", "Contact"),
]
DESKTOP_NAV = [n for n in NAV if n[0] != "soutenir.html"]

ICON = {
    "heart": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.1 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4.7-1.3 2.2-2.4 4.3-2.4 3.6 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>',
    "hands": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 17l-1.5 1.5a2.1 2.1 0 01-3 0L3 15V9l3-3 4 1"/><path d="M13 17l1.5 1.5a2.1 2.1 0 003 0L21 15V9l-3-3-4 1-3 3a1.4 1.4 0 002 2l2-1.5"/></svg>',
    "home": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    "people": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5"/><path d="M14 15.2c.9-.5 1.9-.7 3-.7 2.3 0 4 1.7 4.5 4.5"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    "user": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "seed": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 14c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5z"/></svg>',
}

ROUTE_MINI = ('<svg class="route-mini" viewBox="0 0 300 160" aria-hidden="true"><path d="M20 140 C 90 20, 200 10, 280 40"/>'
              '<circle cx="20" cy="140" r="7"/><circle cx="280" cy="40" r="7"/></svg>')


def head(title, desc, page):
    full = f"{title} | {SITE}" if page != "index.html" else f"{SITE} — Solidarité entre la Sarthe et la Côte d'Ivoire"
    return f"""<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#13223f">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="img/marche-couvert.webp">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
"""


def header(page):
    def cur(href):
        return ' aria-current="page"' if href == page else ""
    desk = "".join(f'<li><a href="{h}"{cur(h)}>{l}</a></li>' for h, l in DESKTOP_NAV)
    mob = "".join(f'<li><a href="{h}"{cur(h)}>{l}</a></li>' for h, l in NAV)
    return f"""<body>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="Accueil — {SITE}">
      <img src="img/logo-400.png" alt="Logo du Comité de Solidarité Chemiré-le-Gaudin – Pengakro" width="400" height="273">
      <span class="brand-text">Chemiré – Pengakro<small>Comité de solidarité</small></span>
    </a>
    <nav class="main-nav" aria-label="Menu principal"><ul>{desk}</ul></nav>
    <div class="header-actions">
      <a class="btn btn--primary btn-support" href="soutenir.html"{cur("soutenir.html")}><span class="heart">{ICON["heart"]}</span><span>Nous soutenir</span></a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<nav class="mobile-menu" id="mobile-menu" aria-label="Menu mobile">
  <ul>{mob}<li><a href="mentions-legales.html"{cur("mentions-legales.html")}>Mentions légales</a></li></ul>
  <a class="btn btn--primary" href="soutenir.html">{ICON["heart"]} Nous soutenir</a>
  <p class="mobile-contact">Une question ? <a href="tel:{PHONE_HREF}">{PHONE}</a></p>
</nav>
<main id="contenu" tabindex="-1">
"""


def footer():
    links1 = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l in NAV[:5])
    links2 = "".join(f'<li><a href="{h}">{l}</a></li>' for h, l in NAV[5:]) + '<li><a href="mentions-legales.html">Mentions légales</a></li>'
    return f"""</main>
<footer class="site-footer">
  <div class="wax-band" aria-hidden="true"></div>
  <div class="footer-top">
    <div class="container footer-grid">
      <div>
        <a class="footer-brand" href="index.html"><img src="img/logo-400.png" alt="Comité de Solidarité Chemiré-le-Gaudin – Pengakro" width="400" height="273" loading="lazy"></a>
        <p>Association loi 1901 qui relie, depuis 2006, la commune de Chemiré-le-Gaudin (Sarthe) et le village de Pengakro (Côte d'Ivoire).</p>
        <a class="btn btn--primary" href="soutenir.html">{ICON["heart"]} Nous soutenir</a>
      </div>
      <div>
        <h2>Le comité</h2>
        <ul class="footer-links">{links1}</ul>
      </div>
      <div>
        <h2>Agir avec nous</h2>
        <ul class="footer-links">{links2}</ul>
      </div>
      <div class="footer-contact">
        <h2>Nous joindre</h2>
        <p><strong>Michel Foucault</strong>, président</p>
        <p><a href="tel:{PHONE_HREF}">{PHONE}</a></p>
        <p><a href="mailto:{EMAIL}">{EMAIL}</a></p>
        <p>Siège : Mairie<br>72210 Chemiré-le-Gaudin</p>
        <div class="social">
          <a href="https://chemire-pengakro.asso-web.com/" target="_blank" rel="noopener">Ancien site du comité <span class="sr-only">(nouvel onglet)</span></a>
          <a href="https://www.chemire-le-gaudin.fr/vie-locale/associations/" target="_blank" rel="noopener">Commune <span class="sr-only">(nouvel onglet)</span></a>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>© <span data-year>2026</span> Comité de Solidarité Chemiré-le-Gaudin – Pengakro</span>
      <span><a href="mentions-legales.html">Mentions légales</a> · <a href="contact.html">Contact</a></span>
    </div>
  </div>
</footer>
<script src="js/data.js"></script>
<script src="js/main.js"></script>
</body>
</html>
"""


def page_hero(title, lead, img, crumb, eyebrow=""):
    eb = f'<p class="eyebrow">{eyebrow}</p>' if eyebrow else ""
    return f"""<section class="page-hero">
  <div class="page-hero-bg" style="background-image:url('{img}')" aria-hidden="true"></div>
  {ROUTE_MINI}
  <div class="container">
    <nav class="breadcrumb" aria-label="Fil d'Ariane"><a href="index.html">Accueil</a><span aria-hidden="true">›</span><span aria-current="page">{crumb}</span></nav>
    {eb}
    <h1>{title}</h1>
    <p class="lead">{lead}</p>
  </div>
</section>
<div class="wax-band" aria-hidden="true"></div>
"""


def cta_band(title="Rejoignez l'aventure Chemiré – Pengakro",
             text="Adhérer, donner, prêter main-forte lors d'une soirée ou faire connaître le comité : chaque geste compte pour faire vivre ce partenariat entre deux villages."):
    return f"""<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <svg class="cta-hands" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2" aria-hidden="true"><path d="M11 17l-1.5 1.5a2.1 2.1 0 01-3 0L3 15V9l3-3 4 1"/><path d="M13 17l1.5 1.5a2.1 2.1 0 003 0L21 15V9l-3-3-4 1-3 3a1.4 1.4 0 002 2l2-1.5"/></svg>
      <h2>{title}</h2>
      <p>{text}</p>
      <div class="btn-row"><a class="btn btn--navy" href="soutenir.html">{ICON["heart"]} Nous soutenir</a><a class="btn btn--ghost" href="contact.html">Nous contacter</a></div>
    </div>
  </div>
</section>
"""


def hero_map():
    m = MAP
    cx, cy = m["chem"]
    px, py = m["pen"]
    route = f"M{cx:.1f} {cy:.1f} Q {cx + 150:.1f} {(cy + py) / 2:.1f} {px:.1f} {py:.1f}"
    return f"""<div class="map-card reveal">
  <svg class="map-svg" viewBox="0 0 {m['W']} {m['H']}" role="img" aria-labelledby="map-title">
    <title id="map-title">Carte : une ligne relie Chemiré-le-Gaudin, en France, à Pengakro, en Côte d'Ivoire, à environ 4 500 km</title>
    <defs><linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb4dc"/><stop offset=".5" stop-color="#f0a24b"/><stop offset="1" stop-color="#7fc47a"/></linearGradient>
      <radialGradient id="fadeGrad" cx=".5" cy=".5" r=".62"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
      <mask id="fade"><rect width="{m['W']}" height="{m['H']}" fill="url(#fadeGrad)"/></mask></defs>
    <g mask="url(#fade)"><path class="land" d="{m['others']}"/></g>
    <path class="land land-fr" d="{m['france']}"/>
    <path class="land land-ci" d="{m['ci']}"/>
    <path class="route" id="route" d="{route}"/>
    <path class="route-dash" d="{route}"/>
    <circle class="pulse pulse--fr" cx="{cx:.1f}" cy="{cy:.1f}" r="7"/>
    <circle class="pulse pulse--ci" cx="{px:.1f}" cy="{py:.1f}" r="7"/>
    <circle class="pin" cx="{cx:.1f}" cy="{cy:.1f}" r="6"/>
    <circle class="pin" cx="{px:.1f}" cy="{py:.1f}" r="6"/>
    <g class="traveller"><circle r="5" fill="#f0a24b" stroke="#fff" stroke-width="2"><animateMotion dur="5s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"><mpath href="#route"/></animateMotion></circle></g>
  </svg>
  <div class="map-label map-label--fr">Chemiré-le-Gaudin<small>Sarthe, France</small></div>
  <div class="map-label map-label--ci">Pengakro<small>Gontougo, Côte d'Ivoire</small></div>
  <div class="map-distance">≈ 4 500 km</div>
</div>"""


def write(name, title, desc, body):
    html = head(title, desc, name) + header(name) + body + footer()
    (ROOT / name).write_text(html, encoding="utf-8")
    print("écrit", name)


# =====================================================================
# ACCUEIL
# =====================================================================
index = f"""<section class="hero">
  <div class="hero-bg" style="background-image:url('img/marche-couvert.webp')" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div>
      <div class="hero-badges reveal">
        <span class="badge"><span class="dot" style="background:#9fb4dc"></span>Sarthe</span>
        <span class="badge"><span class="dot" style="background:#f0a24b"></span>Côte d'Ivoire</span>
        <span class="badge">Depuis 2006</span>
      </div>
      <h1 class="reveal">Chemiré-le-Gaudin<span class="amp">&amp; main dans la main avec</span>Pengakro</h1>
      <p class="lead reveal reveal-delay-1">Depuis vingt ans, notre comité relie un village du bocage sarthois et un village ivoirien. Ensemble, avec les habitants de Pengakro, nous construisons des projets utiles&nbsp;: maternité, bibliothèque, marché couvert, magasins de stockage…</p>
      <div class="btn-row reveal reveal-delay-2">
        <a class="btn btn--primary" href="soutenir.html">{ICON["heart"]} Nous soutenir</a>
        <a class="btn btn--ghost" href="projets.html">Découvrir nos projets {ICON["arrow"]}</a>
      </div>
    </div>
    {hero_map()}
  </div>
  <a class="scroll-hint" href="#le-comite"><span></span>Découvrir</a>
</section>
<div class="wax-band" aria-hidden="true"></div>

<section class="section section--pattern" id="le-comite">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">Le comité en 3 points</p>
      <h2>Deux villages, une même envie d'avancer</h2>
    </div>
    <div class="grid grid-3">
      <article class="card pillar reveal">
        <div class="pillar-icon">{ICON["hands"]}</div>
        <h3>Une amitié née d'une lettre</h3>
        <p>En 2006, Pengakro écrit à Chemiré-le-Gaudin pour proposer un jumelage. Le conseil municipal dit oui, et l'association voit le jour la même année.</p>
      </article>
      <article class="card pillar reveal reveal-delay-1">
        <div class="pillar-icon">{ICON["people"]}</div>
        <h3>Des projets décidés avec Pengakro</h3>
        <p>Chaque projet est porté sur place par la Mutuelle de développement de Pengakro (MUDEP), qui exprime les besoins des habitants et suit les chantiers.</p>
      </article>
      <article class="card pillar reveal reveal-delay-2">
        <div class="pillar-icon">{ICON["seed"]}</div>
        <h3>Des bénévoles engagés en Sarthe</h3>
        <p>Soirées africaines, bric-à-brac, fêtes au village&nbsp;: les manifestations organisées à Chemiré financent une partie des projets.</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--navy" aria-labelledby="chiffres-titre">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">Chiffres clés</p>
      <h2 id="chiffres-titre">Vingt ans de solidarité, en quelques chiffres</h2>
    </div>
    <div class="stats" data-render="chiffres"></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Projets phares</p>
      <h2>Ce que nous avons construit ensemble</h2>
      <p class="lead">Du premier bâtiment de la maternité aux magasins de stockage inaugurés en 2026, chaque réalisation répond à un besoin exprimé par les habitants.</p>
    </div>
    <div class="grid grid-3" data-render="projets-phares" data-limit="3"></div>
    <p class="text-center mt-2"><a class="btn btn--outline" href="projets.html">Voir tous les projets {ICON["arrow"]}</a></p>
  </div>
</section>

<section class="section section--cream2">
  <div class="container split">
    <div class="split-media reveal">
      <img src="img/delegation-2022.webp" alt="La délégation de Chemiré-le-Gaudin entourée d'habitants de Pengakro, en 2022" loading="lazy" width="800" height="527">
      <img class="float-img" src="img/inauguration-marche.webp" alt="Inauguration du marché couvert de Pengakro" loading="lazy" width="800" height="600" style="object-fit:cover">
    </div>
    <div class="reveal reveal-delay-1">
      <p class="eyebrow">Notre histoire</p>
      <h2>Tout a commencé par une lettre</h2>
      <p>En 2006, la commune de Pengakro écrit à Chemiré-le-Gaudin pour proposer un jumelage. Le conseil municipal accepte le 21&nbsp;avril&nbsp;2006 et le comité est déclaré dans la foulée.</p>
      <p>En 2016, une convention de coopération décentralisée est signée entre les deux communes. En 2023, le comité de jumelage devient comité de solidarité. En 2026, il fête ses 20 ans.</p>
      <ul class="check-list">
        <li>Une délégation de Chemiré à Pengakro en 2022, puis en 2026</li>
        <li>Un partenaire sur place : la MUDEP</li>
        <li>Le soutien de la commune, du Département et de la Région</li>
      </ul>
      <a class="btn btn--navy" href="comite.html">Découvrir le comité {ICON["arrow"]}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Prochain événement</p>
      <h2>On se retrouve bientôt à Chemiré</h2>
    </div>
    <div data-render="prochain-evenement"></div>
  </div>
</section>

<section class="section section--pattern">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Actualités</p>
      <h2>Des nouvelles des deux villages</h2>
    </div>
    <div class="grid grid-3" data-render="actualites" data-limit="3"></div>
    <p class="text-center mt-2"><a class="btn btn--outline" href="actualites.html">Toutes les actualités {ICON["arrow"]}</a></p>
  </div>
</section>
""" + cta_band()

write("index.html", "Accueil",
      "Le Comité de Solidarité Chemiré-le-Gaudin – Pengakro relie depuis 2006 une commune de la Sarthe et un village de Côte d'Ivoire : projets, événements, adhésion et dons.",
      index)

# =====================================================================
# LE COMITÉ
# =====================================================================
TIMELINE = [
    ("2006", "Une lettre, puis une association", "Pengakro propose un jumelage à Chemiré-le-Gaudin. Le conseil municipal accepte le 21 avril 2006 et le comité de jumelage est déclaré en préfecture de la Sarthe (publication au Journal officiel le 11 novembre 2006)."),
    ("2012", "La maternité", "Construction d'un bâtiment pour que la sage-femme dispose d'une salle distincte de l'infirmerie. Les lits sont offerts par l'association Bokalé du Mans."),
    ("2013", "L'eau et le football", "Participation à l'adduction d'eau potable depuis le château d'eau ; maillots et chaussures pour l'équipe de football."),
    ("2014", "La bibliothèque", "Une bibliothèque ouverte aux élèves et aux habitants, gérée par le directeur de l'école."),
    ("2015", "600 kg de livres", "Collectés auprès d'écoles, du Rotary Club de Château-du-Loir et de particuliers, puis acheminés jusqu'à Pengakro."),
    ("2016", "La convention de coopération", "Le 23 février, le conseil municipal de Chemiré-le-Gaudin signe une convention de coopération décentralisée avec Pengakro et en confie la mise en œuvre au comité."),
    ("2017 – 2021", "Le chantier du marché couvert", "Quatre ans de travail commun avec la MUDEP pour bâtir un marché abrité pour les vendeuses de Pengakro et des villages voisins."),
    ("2022", "Inauguration du marché", "Fin octobre – début novembre, une délégation de Chemiré se rend à Pengakro pour l'inauguration."),
    ("2023", "Le comité de solidarité", "Le comité de jumelage devient comité de solidarité, afin de pouvoir solliciter l'Agence des micro-projets. Le 23 septembre, grande fête au village à Chemiré."),
    ("2025", "Les magasins de stockage", "Depuis le 1er octobre, les producteurs déposent leurs récoltes de cacao et de café dans les nouveaux magasins."),
    ("2026", "Vingt ans !", "Soirée africaine des 20 ans le 7 mars ; une délégation de quatre personnes passe dix jours à Pengakro pour l'inauguration des magasins."),
]
tl = "".join(f'<li class="tl-item reveal"><span class="tl-dot" aria-hidden="true"></span><div class="tl-year">{y}</div><div class="tl-card"><h3>{t}</h3><p>{d}</p></div></li>' for y, t, d in TIMELINE)

BUREAU = [
    ("Michel Foucault", "Président"),
    ("Ginette Puisset", "Trésorière"),
    ("Martine Delahaye", "Trésorière adjointe"),
    ("Alain Lechêne-Papillon", "Secrétaire et chargé de communication"),
    ("Marcel N'Damité", "Président fondateur"),
    ("Michel Pavard", "Président d'honneur"),
    ("Nicole N'Damité", "Membre"),
    ("Catherine Pavard", "Membre"),
    ("Serge Moreau", "Membre"),
    ("Dominique Pineau", "Membre"),
    ("Stéphane Postrzech", "Membre"),
]
def initials(n):
    parts = n.replace("N'", "N").split()
    return (parts[0][0] + parts[-1][0]).upper()
people = "".join(f'<div class="person reveal"><span class="avatar" aria-hidden="true">{initials(n)}</span><div><strong>{n}</strong><span>{r}</span></div></div>' for n, r in BUREAU)

comite = page_hero("Le comité", "Une association de bénévoles sarthois qui, depuis 2006, construit avec les habitants de Pengakro des projets utiles et durables.",
                   "img/delegation-2022.webp", "Le comité", "Qui sommes-nous ?") + f"""
<section class="section">
  <div class="container split">
    <div class="reveal">
      <p class="eyebrow">Notre histoire</p>
      <h2>D'un jumelage à un vrai partenariat</h2>
      <p>Tout part d'une démarche de Pengakro : en 2006, la commune ivoirienne écrit à Chemiré-le-Gaudin pour proposer un jumelage. Le conseil municipal l'accepte le 21 avril 2006, sans engagement financier, et l'association « Comité de jumelage Chemiré-le-Gaudin / Pengakro » est créée dans la foulée, à l'initiative de Marcel N'Damité, son président fondateur.</p>
      <p>En 2016, les deux communes signent une convention de coopération décentralisée dont la mise en œuvre est confiée au comité. En 2023, le comité devient <strong>Comité de Solidarité Chemiré-le-Gaudin – Pengakro</strong>.</p>
    </div>
    <div class="split-media reveal reveal-delay-1">
      <img src="img/bilan-2025.webp" alt="Membres du comité et élus lors de la journée bilan d'octobre 2025" loading="lazy" width="800" height="600">
    </div>
  </div>
</section>

<section class="section section--pattern">
  <div class="container">
    <div class="section-head center reveal">
      <p class="eyebrow">Frise chronologique</p>
      <h2>Vingt ans de partenariat</h2>
    </div>
    <ol class="timeline">{tl}</ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Nos valeurs</p>
      <h2>Ce qui nous guide</h2>
      <p class="lead">Elles reprennent les objectifs inscrits par le comité dans son histoire et ses statuts.</p>
    </div>
    <div class="grid grid-4">
      <article class="card pillar reveal"><h3>Partenariat</h3><p>Les projets naissent des besoins exprimés à Pengakro, portés sur place par la MUDEP, dans une relation Nord/Sud d'égal à égal.</p></article>
      <article class="card pillar reveal reveal-delay-1"><h3>Développement durable</h3><p>Soutenir un développement durable et solidaire du village, dans le temps long.</p></article>
      <article class="card pillar reveal reveal-delay-2"><h3>Échanges</h3><p>Favoriser les échanges sociaux, culturels, économiques et touristiques entre les deux communes et les villages voisins.</p></article>
      <article class="card pillar reveal reveal-delay-3" style="border-top-color:var(--red)"><h3>Paix</h3><p>Contribuer, à notre échelle, à la paix dans le monde par l'amitié entre les peuples.</p></article>
    </div>
  </div>
</section>

<section class="section section--cream2">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Fonctionnement</p>
      <h2>Comment fonctionne le comité ?</h2>
    </div>
    <div class="grid grid-3">
      <div class="card pillar reveal"><h3>Une association loi 1901</h3><p>Déclarée en préfecture de la Sarthe en 2006, son siège est à la mairie de Chemiré-le-Gaudin. Elle réunit chaque année ses membres en assemblée générale.</p></div>
      <div class="card pillar reveal reveal-delay-1"><h3>Un conseil d'administration</h3><p>Le conseil d'administration, renouvelé lors de l'assemblée générale, élit un bureau qui suit les projets et prépare les manifestations.</p></div>
      <div class="card pillar reveal reveal-delay-2"><h3>Des financements variés</h3><p>Adhésions, recettes des manifestations, fonds propres, bénévolat et subventions (commune, Département de la Sarthe, Région, Agence des micro-projets).</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Bureau et conseil d'administration</p>
      <h2>Les visages du comité</h2>
      <p class="note-src">Composition publiée sur le site du comité. <span class="tag-edit">À vérifier</span> après l'assemblée générale de novembre 2026.</p>
    </div>
    <div class="people">{people}</div>
  </div>
</section>

<section class="section section--pattern" id="statuts">
  <div class="container prose">
    <p class="eyebrow">Statuts</p>
    <h2>Objet de l'association</h2>
    <p>Tel que publié au Journal officiel (annonce n°&nbsp;1088 du 11&nbsp;novembre&nbsp;2006) : « développer des relations entre Chemiré-le-Gaudin et Pengakro, ainsi que les villages voisins, dans le cadre de la coopération internationale décentralisée, dans les domaines culturels, sanitaires, sociaux, économiques, éducatifs, sportifs ou touristiques, dans une logique de développement durable ».</p>
    <div class="placeholder-note"><strong>Texte d'attente :</strong> les statuts complets (PDF) pourront être mis en téléchargement ici après validation par le conseil d'administration.</div>
  </div>
</section>
""" + cta_band()
write("comite.html", "Le comité",
      "Histoire, valeurs, fonctionnement et bureau du Comité de Solidarité Chemiré-le-Gaudin – Pengakro, association loi 1901 créée en 2006.", comite)

# =====================================================================
# PENGAKRO
# =====================================================================
pengakro = page_hero("Pengakro, notre village partenaire", "Un village d'environ 1 000 habitants dans l'est de la Côte d'Ivoire, entre Tankessé et Agnibilékrou, au cœur d'une région de café et de cacao.",
                     "img/marche-traditionnel.webp", "Pengakro", "Côte d'Ivoire") + f"""
<section class="section">
  <div class="container">
    <dl class="info-grid">
      <div class="info reveal"><dt>Pays</dt><dd>Côte d'Ivoire</dd></div>
      <div class="info reveal"><dt>District / Région</dt><dd>Zanzan / Gontougo</dd></div>
      <div class="info reveal"><dt>Département</dt><dd>Koun-Fao</dd></div>
      <div class="info reveal"><dt>Sous-préfecture</dt><dd>Tankessé</dd></div>
      <div class="info reveal"><dt>Population</dt><dd>1 013 hab. (recensement 2014)</dd></div>
      <div class="info reveal"><dt>Distance de Chemiré</dt><dd>≈ 4 500 km</dd></div>
    </dl>
    <p class="note-src mt-2">Sources : recensement ivoirien de 2014 (via citypopulation.de), Agence ivoirienne de presse, site du comité.</p>
  </div>
</section>

<section class="section section--cream2">
  <div class="container split">
    <div class="split-media reveal">
      <img src="img/pengakro-plantation.webp" alt="Cultures dans les environs de Pengakro" loading="lazy" width="410" height="307">
      <img class="float-img" src="img/pengakro-habitat.webp" alt="Une maison du village à l'ombre d'un manguier" loading="lazy" width="384" height="288" style="object-fit:cover">
    </div>
    <div class="reveal reveal-delay-1">
      <p class="eyebrow">Le village et ses habitants</p>
      <h2>Un village qui prend son avenir en main</h2>
      <p>Situé à environ 250 km au nord-est d'Abidjan, sous un climat tropical, Pengakro vit principalement de la culture du café et du cacao. Le développement de l'agriculture passe aussi par l'irrigation et le maraîchage.</p>
      <p>Dès les années 1970, les villageois ont créé une mutuelle d'entraide et de développement. Aujourd'hui, la <strong>Mutuelle de développement de Pengakro (MUDEP)</strong> porte les projets du village : elle a notamment construit le premier collège de Pengakro, inauguré le 8&nbsp;août&nbsp;2026.</p>
      <ul class="check-list">
        <li>Une école d'environ 200 élèves (selon le comité)</li>
        <li>Un collège ouvert à la rentrée 2026-2027</li>
        <li>Une coopérative de producteurs de maïs créée par les villageois</li>
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Localisation</p>
      <h2>Où se trouve Pengakro ?</h2>
      <p class="lead">Dans l'est de la Côte d'Ivoire, dans la région du Gontougo. Coordonnées indiquées par le comité : 7°19′48″ N, 3°15′41″ O.</p>
    </div>
    <div class="split">
      <iframe class="map-frame reveal" title="Carte OpenStreetMap de la région de Pengakro" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-3.75%2C7.0%2C-2.75%2C7.65&amp;layer=mapnik&amp;marker=7.33%2C-3.2614"></iframe>
      <div class="reveal reveal-delay-1">
        <img src="img/carte-pengakro.webp" alt="Carte de l'est de la Côte d'Ivoire situant Pengakro par rapport à Abidjan, Yamoussoukro et Bouaké" loading="lazy" width="269" height="344" style="border-radius:18px;box-shadow:var(--shadow);margin-bottom:1rem">
        <p><a href="https://www.openstreetmap.org/?mlat=7.33&amp;mlon=-3.2614#map=11/7.33/-3.2614" target="_blank" rel="noopener">Ouvrir la carte en grand <span class="sr-only">(nouvel onglet)</span></a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section--pattern">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Partenaires sur place</p>
      <h2>Nos interlocuteurs à Pengakro</h2>
    </div>
    <div class="grid grid-3">
      <article class="card partner reveal"><span class="partner-logo" style="background:var(--orange)">M</span><p class="partner-type">Partenaire principal</p><h3>La MUDEP</h3><p>Mutuelle de développement de Pengakro. Elle exprime les besoins des habitants, porte les projets et les gère sur place. Président : Ernest Kouakou Brou (AIP, 2026).</p></article>
      <article class="card partner reveal reveal-delay-1"><span class="partner-logo" style="background:var(--green)">V</span><p class="partner-type">Chefferie</p><h3>Le chef du village</h3><p>Nanan Kouassi Kra Rémi, chef du village, cité lors de l'inauguration du collège en août 2026.</p></article>
      <article class="card partner reveal reveal-delay-2"><span class="partner-logo">É</span><p class="partner-type">Éducation</p><h3>L'école et le collège</h3><p>L'école du village, dont le directeur gère la bibliothèque, et le nouveau collège construit par la MUDEP.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Nouvelles de Pengakro</p>
      <h2>Ce qui se passe là-bas</h2>
    </div>
    <div class="grid grid-3" data-render="actualites" data-cote="ci" data-limit="3"></div>
  </div>
</section>
""" + cta_band()
write("pengakro.html", "Pengakro",
      "Pengakro, village d'environ 1 000 habitants de la région du Gontougo (Côte d'Ivoire), partenaire de Chemiré-le-Gaudin : localisation, vie du village, MUDEP.", pengakro)

# =====================================================================
# PROJETS
# =====================================================================
projets = page_hero("Nos projets", "Une fiche par projet : objectif, lieu, période, avancement et résultats. Tous ont été menés avec la Mutuelle de développement de Pengakro.",
                    "img/magasins-terrain.webp", "Nos projets", "Réalisés et en cours") + f"""
<section class="section">
  <div class="container">
    <div class="filters" role="group" aria-label="Filtrer les projets" data-filter-target="#liste-projets" data-filter-attr="data-statut">
      <button class="filter-btn" type="button" data-value="all" aria-pressed="true">Tous les projets</button>
      <button class="filter-btn" type="button" data-value="realise" aria-pressed="false">Réalisés</button>
      <button class="filter-btn" type="button" data-value="attente" aria-pressed="false">À venir</button>
    </div>
    <div class="grid" id="liste-projets" data-render="projets" style="gap:2.5rem"></div>
  </div>
</section>
""" + cta_band("Parrainez le prochain projet", "Les magasins de stockage attendent encore leurs balances et l'équipement de leur bureau. Votre soutien peut faire la différence.")
write("projets.html", "Nos projets",
      "Maternité, bibliothèque, eau potable, marché couvert, magasins de stockage : les projets réalisés à Pengakro par le comité et la MUDEP depuis 2012.", projets)

# =====================================================================
# ÉVÉNEMENTS
# =====================================================================
evenements = page_hero("Événements", "Soirées africaines, fêtes au village, bric-à-brac : nos rendez-vous à Chemiré-le-Gaudin font vivre l'amitié et financent les projets.",
                       "img/soiree-2024-danse.webp", "Événements", "Agenda en Sarthe") + f"""
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">À venir</p>
      <h2>Prochains rendez-vous</h2>
    </div>
    <div class="event-list" data-render="evenements-a-venir"></div>
    <div class="mt-3" data-render="prochain-evenement"></div>
  </div>
</section>
<section class="section section--pattern">
  <div class="container">
    <div class="section-head reveal">
      <p class="eyebrow">Archives</p>
      <h2>Ils ont eu lieu</h2>
    </div>
    <div class="event-list" data-render="evenements-archives"></div>
  </div>
</section>
""" + cta_band("Envie de donner un coup de main ?", "Installer la salle, servir le repas, tenir un stand : les bénévoles sont toujours les bienvenus lors de nos manifestations.")
write("evenements.html", "Événements",
      "Agenda et archives des manifestations du comité Chemiré-Pengakro en Sarthe : soirée africaine, fête au village, bric-à-brac, fête de la musique.", evenements)

# =====================================================================
# ACTUALITÉS
# =====================================================================
actualites = page_hero("Actualités", "Des nouvelles des deux côtés : la vie du comité à Chemiré-le-Gaudin et l'avancée des projets à Pengakro.",
                       "img/bilan-2025.webp", "Actualités", "Ici et là-bas") + f"""
<section class="section">
  <div class="container">
    <div class="filters" role="group" aria-label="Filtrer les actualités" data-filter-target="#liste-actus" data-filter-attr="data-side">
      <button class="filter-btn" type="button" data-value="all" aria-pressed="true">Toutes</button>
      <button class="filter-btn" type="button" data-value="fr" aria-pressed="false">À Chemiré</button>
      <button class="filter-btn" type="button" data-value="ci" aria-pressed="false">À Pengakro</button>
    </div>
    <div class="grid grid-3" id="liste-actus" data-render="actualites"></div>
  </div>
</section>
""" + cta_band()
write("actualites.html", "Actualités",
      "Les dernières nouvelles du Comité de Solidarité Chemiré-Pengakro et du village de Pengakro : 20 ans du comité, magasins de stockage, nouveau collège.", actualites)

# =====================================================================
# GALERIE
# =====================================================================
galerie = page_hero("Galerie", "Les chantiers, les inaugurations, les fêtes : vingt ans de souvenirs partagés entre la Sarthe et la Côte d'Ivoire.",
                    "img/inauguration-marche.webp", "Galerie", "En images") + """
<section class="section">
  <div class="container">
    <div class="filters" role="group" aria-label="Filtrer les photos" data-filter-target="#galerie" data-filter-attr="data-cat">
      <button class="filter-btn" type="button" data-value="all" aria-pressed="true">Toutes les photos</button>
      <button class="filter-btn" type="button" data-value="projets" aria-pressed="false">Par projet</button>
      <button class="filter-btn" type="button" data-value="evenements" aria-pressed="false">Par événement</button>
      <button class="filter-btn" type="button" data-value="pengakro" aria-pressed="false">Pengakro</button>
    </div>
    <div class="gallery" id="galerie" data-render="galerie"></div>
    <p class="note-src">Photos : Comité de Solidarité Chemiré-Pengakro. Ajoutez vos photos dans le dossier <code>img/</code> et dans la rubrique « galerie » de <code>js/data.js</code>.</p>
  </div>
</section>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse de photos">
  <button class="lb-btn lb-close" type="button" aria-label="Fermer">✕</button>
  <button class="lb-btn lb-prev" type="button" aria-label="Photo précédente">‹</button>
  <figure><img src="" alt=""><figcaption></figcaption></figure>
  <button class="lb-btn lb-next" type="button" aria-label="Photo suivante">›</button>
</div>
"""
write("galerie.html", "Galerie",
      "Galerie photos du comité Chemiré-Pengakro : chantiers des magasins de stockage, marché couvert, maternité, bibliothèque, soirées et fêtes en Sarthe.", galerie)

# =====================================================================
# NOUS SOUTENIR
# =====================================================================
def form_support():
    return f"""<form class="form" name="soutien" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="soutien">
  <p class="hidden-field"><label>Ne pas remplir : <input name="bot-field"></label></p>
  <fieldset class="field">
    <legend>Je souhaite…</legend>
    <div class="choices">
      <label class="choice"><input type="radio" name="souhait" value="Adhérer" checked><span>Adhérer</span></label>
      <label class="choice"><input type="radio" name="souhait" value="Faire un don"><span>Faire un don</span></label>
      <label class="choice"><input type="radio" name="souhait" value="Devenir bénévole"><span>Devenir bénévole</span></label>
      <label class="choice"><input type="radio" name="souhait" value="Parrainer un projet"><span>Parrainer un projet</span></label>
      <label class="choice"><input type="radio" name="souhait" value="Mécénat d'entreprise"><span>Mécénat d'entreprise</span></label>
    </div>
  </fieldset>
  <div class="form-row">
    <div class="field"><label for="s-nom">Nom et prénom</label><input id="s-nom" name="nom" autocomplete="name" required></div>
    <div class="field"><label for="s-commune">Commune</label><input id="s-commune" name="commune" autocomplete="address-level2"></div>
  </div>
  <div class="form-row">
    <div class="field"><label for="s-email">Adresse e-mail</label><input id="s-email" type="email" name="email" autocomplete="email" required></div>
    <div class="field"><label for="s-tel">Téléphone <span style="font-weight:400">(facultatif)</span></label><input id="s-tel" type="tel" name="telephone" autocomplete="tel"></div>
  </div>
  <div class="field"><label for="s-msg">Votre message</label><textarea id="s-msg" name="message" placeholder="Disponibilités, entreprise, projet que vous souhaitez soutenir…"></textarea></div>
  <label class="consent"><input type="checkbox" name="consentement" value="oui" required><span>J'accepte que le comité utilise ces informations pour me recontacter. Elles ne seront jamais transmises à des tiers.</span></label>
  <button class="btn btn--primary" type="submit">{ICON["heart"]} Envoyer ma demande</button>
</form>"""

soutenir = page_hero("Nous soutenir", "Adhérer, donner, aider lors d'une manifestation, parrainer un besoin précis ou engager votre entreprise : choisissez votre façon d'agir.",
                     "img/fete-2023-public.webp", "Nous soutenir", "Agir avec nous") + f"""
<section class="section">
  <div class="container">
    <div class="grid grid-3">
      <article class="card support-card reveal" id="adherer">
        <p class="partner-type">Adhérer</p>
        <h2 style="font-size:1.8rem">Devenez membre</h2>
        <p class="price">15 €</p>
        <p>L'adhésion permet de participer à l'assemblée générale et de soutenir la vie du comité. Contact : Ginette Puisset, trésorière — <a href="tel:+33662242641">06 62 24 26 41</a>, <a href="mailto:ginette.puisset@orange.fr">ginette.puisset@orange.fr</a>.</p>
        <a class="btn btn--navy" href="#formulaire">J'adhère</a>
      </article>
      <article class="card support-card reveal reveal-delay-1" id="don">
        <p class="partner-type">Faire un don</p>
        <h2 style="font-size:1.8rem">Soutenez les projets</h2>
        <p>Chaque don aide à financer les projets portés avec la MUDEP à Pengakro.</p>
        <div class="placeholder-note"><strong>Texte d'attente :</strong> lien de don en ligne à créer (par exemple sur HelloAsso). Modalités du don par chèque à préciser par le comité.</div>
        <a class="btn btn--navy" href="#formulaire">Je fais un don</a>
      </article>
      <article class="card support-card reveal reveal-delay-2" id="benevole">
        <p class="partner-type">Devenir bénévole</p>
        <h2 style="font-size:1.8rem">Donnez un peu de temps</h2>
        <p>Préparer une soirée africaine, tenir un stand au bric-à-brac, aider à la communication : chacun peut apporter ses talents, quelques heures par an.</p>
        <a class="btn btn--navy" href="#formulaire">Je propose mon aide</a>
      </article>
      <article class="card support-card reveal" id="parrainer">
        <p class="partner-type">Parrainer un projet</p>
        <h2 style="font-size:1.8rem">Financez un besoin précis</h2>
        <p>Besoin actuel identifié par le comité : <strong>l'équipement du bureau des magasins de stockage et l'achat de balances</strong>, qui n'ont pas encore pu être financés.</p>
        <a class="btn btn--navy" href="#formulaire">Je parraine</a>
      </article>
      <article class="card support-card reveal reveal-delay-1" id="mecenat">
        <p class="partner-type">Mécénat d'entreprise</p>
        <h2 style="font-size:1.8rem">Engagez votre entreprise</h2>
        <p>Entreprises du Val de Sarthe et d'ailleurs : soutien financier, don de matériel, aide logistique ou compétences. Parlons-en ensemble.</p>
        <a class="btn btn--navy" href="#formulaire">Contacter le comité</a>
      </article>
      <article class="card support-card reveal reveal-delay-2">
        <p class="partner-type">Faire connaître</p>
        <h2 style="font-size:1.8rem">Parlez de nous</h2>
        <p>Venez à nos manifestations avec vos proches, partagez ce site et nos actualités : c'est aussi une belle façon de soutenir Pengakro.</p>
        <a class="btn btn--navy" href="evenements.html">Voir l'agenda</a>
      </article>
    </div>
  </div>
</section>
<section class="section section--pattern" id="formulaire">
  <div class="container" style="max-width:900px">
    <div class="section-head reveal">
      <p class="eyebrow">Formulaire</p>
      <h2>Je veux agir avec le comité</h2>
      <p class="lead">Remplissez ce formulaire : un membre du bureau vous recontactera rapidement.</p>
    </div>
    <div class="card form-card reveal">{form_support()}</div>
  </div>
</section>
"""
write("soutenir.html", "Nous soutenir",
      "Adhérer (15 €), faire un don, devenir bénévole, parrainer un projet ou faire du mécénat : soutenez le Comité de Solidarité Chemiré-le-Gaudin – Pengakro.", soutenir)

# =====================================================================
# PARTENAIRES
# =====================================================================
PARTS = [
    ("Collectivités", [
        ("C", "var(--navy)", "Commune de Chemiré-le-Gaudin", "Siège du comité, signataire de la convention de coopération décentralisée de 2016 et soutien du projet des magasins de stockage."),
        ("72", "var(--green)", "Département de la Sarthe", "Soutien financier aux projets du comité, dont les magasins de stockage."),
        ("PL", "var(--red)", "Région Pays de la Loire", "Soutien financier au projet des magasins de stockage."),
        ("VS", "var(--ochre)", "Communauté de communes du Val de Sarthe", "Territoire d'appartenance de Chemiré-le-Gaudin, cité comme partenaire par le comité."),
    ]),
    ("Solidarité internationale", [
        ("M", "var(--orange)", "MUDEP — Mutuelle de développement de Pengakro", "Partenaire sur place : définit les besoins, porte et gère les projets à Pengakro."),
        ("AM", "var(--navy)", "Agence des micro-projets", "Soutien au projet des magasins de stockage. C'est pour solliciter cette agence que le comité est devenu comité de solidarité en 2023."),
    ]),
    ("Associations amies", [
        ("FI", "var(--green)", "Fleur des Îles", "Association solidaire de Madagascar, qui a préparé le repas de la soirée africaine de 2024."),
        ("WD", "var(--red)", "Les Enfants de Walou Dekendo", "Danseuses et percussionnistes présents à la fête au village 2023 et aux soirées africaines."),
        ("PT", "var(--ochre)", "Prospéro Théâtre", "Lecture de « Propos noirs sur blancs » lors de la fête au village 2023."),
        ("B", "var(--navy)", "Association Bokalé (Le Mans)", "A offert les lits de la maternité de Pengakro en 2012."),
        ("R", "var(--orange)", "Rotary Club de Château-du-Loir", "Don de livres pour la bibliothèque de Pengakro en 2015, avec des écoles du Mans et du Lude."),
    ]),
    ("Entreprises", [
        ("CA", "var(--green)", "Crédit Agricole", "Partenaire bancaire du projet des magasins de stockage."),
        ("SC", "var(--navy)", "Carrière de Chemiré-le-Gaudin (S.C.T.H.)", "Carrière de sables et graviers du Belvédère, citée parmi les partenaires du comité."),
        ("D", "var(--red)", "Entreprise Duval", "A assuré en 2015 le transport des livres jusqu'à Toulon."),
    ]),
]
psec = ""
for title, items in PARTS:
    cards = "".join(f'<article class="card partner reveal"><span class="partner-logo" style="background:{c}" aria-hidden="true">{ab}</span><h3>{n}</h3><p>{d}</p></article>' for ab, c, n, d in items)
    psec += f'<h2 class="reveal mt-3" style="font-size:1.9rem">{title}</h2><div class="grid grid-3">{cards}</div>'

partenaires = page_hero("Partenaires", "Collectivités, associations, entreprises : ils rendent possibles les projets menés avec Pengakro. Merci à eux !",
                        "img/fete-2023-theatre.webp", "Partenaires", "Ils nous soutiennent") + f"""
<section class="section">
  <div class="container">
    <div class="placeholder-note reveal"><strong>À compléter :</strong> logos officiels des partenaires à ajouter après accord de chacun. Les pastilles de couleur sont provisoires.</div>
    {psec}
  </div>
</section>
""" + cta_band("Votre entreprise ou votre collectivité souhaite s'engager ?", "Mécénat, don de matériel, compétences : contactez le comité pour imaginer ensemble votre soutien à Pengakro.")
write("partenaires.html", "Partenaires",
      "Commune de Chemiré-le-Gaudin, Département de la Sarthe, Région Pays de la Loire, Agence des micro-projets, MUDEP et associations amies : les partenaires du comité.", partenaires)

# =====================================================================
# CONTACT
# =====================================================================
contact = page_hero("Contact", "Une question, une envie d'aider, une idée ? Écrivez-nous ou appelez le président du comité.",
                    "img/magasins-murs.webp", "Contact", "Parlons-en") + f"""
<section class="section">
  <div class="container split" style="align-items:start">
    <div class="reveal">
      <h2>Nos coordonnées</h2>
      <ul class="contact-list">
        <li><span class="contact-ico">{ICON["user"]}</span><div><strong>Michel Foucault</strong>Président du comité</div></li>
        <li><span class="contact-ico">{ICON["phone"]}</span><div><strong>Téléphone</strong><a href="tel:{PHONE_HREF}">{PHONE}</a></div></li>
        <li><span class="contact-ico">{ICON["mail"]}</span><div><strong>E-mail</strong><a href="mailto:{EMAIL}">{EMAIL}</a></div></li>
        <li><span class="contact-ico">{ICON["pin"]}</span><div><strong>Siège social</strong>Mairie<br>72210 Chemiré-le-Gaudin</div></li>
      </ul>
      <h2 class="mt-3">Plan d'accès</h2>
      <iframe class="map-frame" title="Plan OpenStreetMap de Chemiré-le-Gaudin" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-0.040%2C47.915%2C0.012%2C47.940&amp;layer=mapnik&amp;marker=47.9274%2C-0.0139"></iframe>
      <p class="note-src"><a href="https://www.openstreetmap.org/?mlat=47.9274&amp;mlon=-0.0139#map=15/47.9274/-0.0139" target="_blank" rel="noopener">Ouvrir le plan en grand <span class="sr-only">(nouvel onglet)</span></a> — Chemiré-le-Gaudin se situe à une vingtaine de kilomètres au sud-ouest du Mans.</p>
    </div>
    <div class="card form-card reveal reveal-delay-1">
      <h2>Écrivez-nous</h2>
      <form class="form" name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p class="hidden-field"><label>Ne pas remplir : <input name="bot-field"></label></p>
        <div class="field"><label for="c-nom">Nom et prénom</label><input id="c-nom" name="nom" autocomplete="name" required></div>
        <div class="field"><label for="c-email">Adresse e-mail</label><input id="c-email" type="email" name="email" autocomplete="email" required></div>
        <div class="field"><label for="c-tel">Téléphone <span style="font-weight:400">(facultatif)</span></label><input id="c-tel" type="tel" name="telephone" autocomplete="tel"></div>
        <div class="field"><label for="c-objet">Objet</label>
          <select id="c-objet" name="objet"><option>Question générale</option><option>Adhésion</option><option>Don</option><option>Bénévolat</option><option>Partenariat / mécénat</option><option>Presse</option></select></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea></div>
        <label class="consent"><input type="checkbox" name="consentement" value="oui" required><span>J'accepte que le comité utilise ces informations pour répondre à ma demande.</span></label>
        <button class="btn btn--primary" type="submit">{ICON["mail"]} Envoyer le message</button>
      </form>
    </div>
  </div>
</section>
"""
write("contact.html", "Contact",
      "Contacter le Comité de Solidarité Chemiré-le-Gaudin – Pengakro : Michel Foucault, 06 87 15 91 06, siège à la mairie de Chemiré-le-Gaudin (72210).", contact)

# =====================================================================
# MERCI (retour des formulaires)
# =====================================================================
merci = page_hero("Merci !", "Votre message a bien été envoyé. Un membre du comité vous répondra très prochainement.",
                  "img/inauguration-marche.webp", "Message envoyé") + f"""
<section class="section"><div class="container text-center"><div class="btn-row" style="justify-content:center"><a class="btn btn--navy" href="index.html">Retour à l'accueil</a><a class="btn btn--outline" href="projets.html">Découvrir nos projets</a></div></div></section>
"""
write("merci.html", "Merci", "Votre message a bien été envoyé au Comité de Solidarité Chemiré-le-Gaudin – Pengakro.", merci)

# =====================================================================
# MENTIONS LÉGALES
# =====================================================================
mentions = page_hero("Mentions légales", "Informations légales, données personnelles et crédits du site.",
                     "img/maternite.webp", "Mentions légales") + f"""
<section class="section">
  <div class="container prose">
    <h2>Éditeur du site</h2>
    <p><strong>Comité de Solidarité Chemiré-le-Gaudin – Pengakro</strong><br>Association loi 1901 déclarée en préfecture de la Sarthe — Journal officiel, annonce n°&nbsp;1088 du 11&nbsp;novembre&nbsp;2006.<br>Siège social : Mairie, 72210 Chemiré-le-Gaudin.<br>Téléphone : <a href="tel:{PHONE_HREF}">{PHONE}</a> — E-mail : <a href="mailto:{EMAIL}">{EMAIL}</a></p>
    <p><span class="tag-edit">À compléter</span> Numéro RNA et, le cas échéant, numéro SIRET.</p>
    <h2>Directeur de la publication</h2>
    <p>Michel Foucault, président du comité. <span class="tag-edit">À confirmer</span></p>
    <h2>Hébergement</h2>
    <p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener">www.netlify.com</a></p>
    <h2>Données personnelles</h2>
    <p>Les informations envoyées via les formulaires (nom, e-mail, téléphone, message) sont utilisées uniquement par le comité pour répondre aux demandes et gérer les adhésions. Elles ne sont ni vendues ni transmises à des tiers, et sont conservées le temps nécessaire au traitement de la demande.</p>
    <p>Conformément au Règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données : écrivez à <a href="mailto:{EMAIL}">{EMAIL}</a>. Vous pouvez également saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).</p>
    <h2>Cookies</h2>
    <p>Ce site n'utilise aucun cookie de mesure d'audience ni de publicité. Les cartes intégrées sont fournies par OpenStreetMap et les polices de caractères par Google Fonts.</p>
    <h2>Crédits</h2>
    <p>Photographies : Comité de Solidarité Chemiré-Pengakro. Fonds cartographiques : © les contributeurs d'OpenStreetMap ; carte stylisée réalisée à partir de Natural Earth (domaine public).</p>
    <p>Sources des informations : site du comité, Ouest-France, Agence ivoirienne de presse, Journal officiel des associations.</p>
    <h2>Propriété intellectuelle</h2>
    <p>Les textes, photographies et le logo du comité ne peuvent être reproduits sans autorisation.</p>
  </div>
</section>
"""
write("mentions-legales.html", "Mentions légales",
      "Mentions légales, données personnelles et crédits du site du Comité de Solidarité Chemiré-le-Gaudin – Pengakro.", mentions)

# 404
nf = page_hero("Page introuvable", "Cette page n'existe pas ou a été déplacée.", "img/pengakro-campagne.webp", "Erreur 404") + """
<section class="section"><div class="container text-center"><a class="btn btn--navy" href="index.html">Retour à l'accueil</a></div></section>
"""
write("404.html", "Page introuvable", "Page introuvable.", nf)
