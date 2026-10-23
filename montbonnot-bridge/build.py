#!/usr/bin/env python3
"""Génère les pages HTML statiques du site du Club de Bridge de Montbonnot dans ./public.

Usage : python3 build.py
Le menu, l'en-tête et le pied de page sont définis une seule fois ici et injectés dans toutes les pages.
"""
import os
import re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

SITE = "Club de Bridge de Montbonnot"
PHONE_RAW = "0610721178"
PHONE = "06 10 72 11 78"
EMAIL = "alain.tosi@sfr.fr"
ADDR1 = "Salle Saint-Exupéry — 980 chemin de la Laurelle"
ADDR2 = "38330 Montbonnot-Saint-Martin"
OFFICIAL = "https://montbonnotbridge.fr/"
AGENDA = "https://montbonnotbridge.fr/index.php/accueil/agenda"
FFB = "https://www.ffbridge.fr/"
FFB_RESULTS = "https://licencie.ffbridge.fr/#/home"
BRIDGEPLUS = "https://www.bridgeplus.com/"
CDS = "https://www.cdsbridge.fr/"
MAPS = "https://www.google.com/maps/search/?api=1&query=980+chemin+de+la+Laurelle+38330+Montbonnot-Saint-Martin"
MAP_EMBED = "https://maps.google.com/maps?q=980+chemin+de+la+Laurelle+38330+Montbonnot-Saint-Martin&output=embed&hl=fr"

NAV = [
    ("index.html", "Accueil", "spade"),
    ("le-club.html", "Le club", "heart"),
    ("jouer.html", "Jouer avec nous", "diamond"),
    ("cours.html", "Cours &amp; initiation", "club"),
    ("tournois.html", "Tournois &amp; résultats", "spade"),
    ("galerie.html", "Galerie", "heart"),
    ("actualites.html", "Actualités", "diamond"),
    ("adherer-contact.html", "Adhérer / Contact", "club"),
]
LEGAL = ("mentions-legales.html", "Mentions légales")

SPRITE = """<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
<symbol id="spade" viewBox="0 0 24 24"><path d="M12 1.5C9 6 3.8 9 3.8 13.6c0 2.5 2 4.5 4.5 4.5 1.3 0 2.4-.5 3.2-1.4-.1 1.6-.7 3.1-1.9 4.4h4.8c-1.2-1.3-1.8-2.8-1.9-4.4.8.9 1.9 1.4 3.2 1.4 2.5 0 4.5-2 4.5-4.5C20.2 9 15 6 12 1.5z"/></symbol>
<symbol id="heart" viewBox="0 0 24 24"><path d="M12 21.6C5 15.6 2.4 12.1 2.4 8.5c0-2.8 2.2-5 5-5 1.9 0 3.5 1 4.6 2.7 1.1-1.7 2.7-2.7 4.6-2.7 2.8 0 5 2.2 5 5 0 3.6-2.6 7.1-9.6 13.1z"/></symbol>
<symbol id="diamond" viewBox="0 0 24 24"><path d="M12 1.5 20.6 12 12 22.5 3.4 12z"/></symbol>
<symbol id="club" viewBox="0 0 24 24"><path d="M12 2.2a4.4 4.4 0 0 0-3.9 6.4 4.6 4.6 0 1 0 2.6 6.6c.2 1.9-.5 3.8-2 5.6h6.6c-1.5-1.8-2.2-3.7-2-5.6a4.6 4.6 0 1 0 2.6-6.6A4.4 4.4 0 0 0 12 2.2z"/></symbol>
</svg>"""


def suit(name, cls=""):
    c = f' class="suit {cls}"' if cls else ' class="suit"'
    return f'<svg{c} aria-hidden="true"><use href="#{name}"/></svg>'


def head(page, title, desc):
    full = f"{title} | {SITE}" if page != "index.html" else f"{SITE} — Bridge à Montbonnot-Saint-Martin (Isère)"
    return f"""<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#07291f">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="img/montagnes.jpg">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
{SPRITE}
"""


def header(page):
    items = []
    for f, label, s in NAV:
        cur = ' aria-current="page"' if f == page else ""
        items.append(f'<li><a href="{f}"{cur}>{suit(s)}<span>{label}</span></a></li>')
    f, label = LEGAL
    cur = ' aria-current="page"' if f == page else ""
    items.append(f'<li class="sub"><a href="{f}"{cur}><span>{label}</span></a></li>')
    return f"""<header class="site-header">
<div class="wrap">
<a class="brand" href="index.html" aria-label="{SITE} — accueil">
<img src="img/logo-montbonnot-bridge.png" alt="" width="54" height="46">
<span>Club de Bridge<br>de Montbonnot<small>Montbonnot-Saint-Martin · Isère</small></span>
</a>
<button class="nav-toggle" aria-expanded="false" aria-controls="menu"><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="label">Menu</span></button>
<nav class="main-nav" id="menu" aria-label="Navigation principale">
<ul>
{chr(10).join(items)}
</ul>
</nav>
</div>
</header>
"""


def footer():
    links = "".join(
        f'<li><a href="{f}">{l}</a></li>' for f, l, _ in NAV
    )
    return f"""<footer class="site-footer">
<div class="wrap">
<div class="foot-grid">
<div class="foot-brand">
<img src="img/logo-montbonnot-bridge.png" alt="Logo du Bridge Club de Montbonnot" width="120" height="101" loading="lazy">
<p>Un club détendu et convivial au cœur du Grésivaudan. Débutants bienvenus.</p>
</div>
<div>
<h2>Nous trouver</h2>
<address style="font-style:normal">
{ADDR1}<br>{ADDR2}<br>
<small>Derrière la maison des Arts</small>
</address>
<p style="margin-top:.8rem"><strong>Rondes de France</strong><br>lundi et mercredi · 13 h 45 – 18 h 00</p>
<p><a href="tel:{PHONE_RAW}">{PHONE}</a> <small>(Alain Tosi, président)</small></p>
</div>
<div>
<h2>Le site</h2>
<ul>{links}</ul>
</div>
<div>
<h2>Sur le web</h2>
<div class="social">
<a href="{OFFICIAL}" target="_blank" rel="noopener">{suit('spade')} Site officiel du club</a>
<a href="{FFB}" target="_blank" rel="noopener">{suit('heart')} Fédération Française de Bridge</a>
<a href="{CDS}" target="_blank" rel="noopener">{suit('diamond')} Comité Dauphiné-Savoie</a>
</div>
</div>
</div>
<div class="legal-bar">
<span>© {SITE} — Association loi 1901</span>
<a href="mentions-legales.html">Mentions légales</a>
</div>
</div>
</footer>
<script src="js/events.js"></script>
<script src="js/main.js"></script>
</body>
</html>
"""


RIDGE = """<div class="ridge" aria-hidden="true"><svg viewBox="0 0 1440 70" preserveAspectRatio="none"><path fill="#f8f4e9" d="M0 70V48L70 38 150 52 240 22 310 40 400 14 480 44 560 30 650 50 740 20 830 42 920 12 1010 40 1100 26 1190 48 1280 30 1360 44 1440 34V70z"/><path fill="none" stroke="#c9a24b" stroke-width="1.5" opacity=".7" d="M0 48 70 38 150 52 240 22 310 40 400 14 480 44 560 30 650 50 740 20 830 42 920 12 1010 40 1100 26 1190 48 1280 30 1360 44 1440 34"/></svg></div>"""


def page_hero(title, lead, crumb):
    return f"""<main id="contenu">
<div class="page-hero">
<div class="ghost-suits" aria-hidden="true">{suit('spade')}{suit('heart')}</div>
<div class="wrap">
<div class="crumbs"><a href="index.html">Accueil</a> · {crumb}</div>
<h1>{title}</h1>
<p>{lead}</p>
</div>
{RIDGE}
</div>
"""


def sec_head(kicker, title, s="spade"):
    return f'<div class="sec-head reveal"><span class="kicker">{suit(s)} {kicker}</span><h2>{title}</h2></div>'


def write(name, content):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(content)


def nbsp(html):
    """Évite les retours à la ligne au milieu d'une heure (« 13 h 45 »)."""
    return re.sub(r"(\d{1,2}) h (\d{2})", "\\1&nbsp;h&nbsp;\\2", html)


def build_page(page, title, desc, body):
    write(page, nbsp(head(page, title, desc) + header(page) + body + "</main>\n" + footer()))


# --------------------------------------------------------------------------------------
# Héro : mains de cartes
# --------------------------------------------------------------------------------------
HANDS = {
    "n": ("Nord", [("A", "spade"), ("K", "spade"), ("Q", "heart"), ("J", "diamond"), ("10", "club")]),
    "e": ("Est", [("K", "heart"), ("Q", "club"), ("9", "spade"), ("8", "diamond"), ("A", "club")]),
    "s": ("Sud", [("A", "heart"), ("J", "spade"), ("K", "diamond"), ("Q", "diamond"), ("7", "club")]),
    "w": ("Ouest", [("A", "diamond"), ("10", "heart"), ("Q", "spade"), ("K", "club"), ("J", "heart")]),
}
DEAL_ORDER = ["n", "e", "s", "w"]


def hand_html(key):
    label, cards = HANDS[key]
    pos = DEAL_ORDER.index(key)
    out = [f'<div class="hand hand-{key}" aria-hidden="true"><span class="label">{label}</span>']
    for i, (rank, s) in enumerate(cards):
        n = i * 4 + pos
        red = " r" if s in ("heart", "diamond") else ""
        out.append(
            f'<div class="pc" style="--i:{i};--n:{n}"><div class="pc-in">'
            f'<div class="face{red}"><b>{rank}</b>{suit(s)}{suit(s, "big")}</div><div class="back"></div></div></div>'
        )
    out.append("</div>")
    return "".join(out)


MOUNTAINS = """<div class="mountains" aria-hidden="true"><svg viewBox="0 0 1440 240" preserveAspectRatio="none">
<path fill="#0f5a43" opacity=".55" d="M0 150 90 110 170 135 260 70 330 105 420 60 520 120 610 90 700 140 790 85 880 125 980 55 1070 110 1160 80 1260 130 1350 95 1440 125V240H0z"/>
<path fill="#0a3a2c" d="M0 190C120 140 200 170 320 130S520 150 640 170 900 110 1040 150 1300 170 1440 140V240H0z"/>
<path fill="none" stroke="#c9a24b" stroke-width="1.6" opacity=".75" d="M0 190C120 140 200 170 320 130S520 150 640 170 900 110 1040 150 1300 170 1440 140"/>
<path fill="#f8f4e9" d="M0 226C200 206 380 236 620 223S1040 206 1240 229 1400 223 1440 219V240H0z"/>
</svg></div>"""


# --------------------------------------------------------------------------------------
# ACCUEIL
# --------------------------------------------------------------------------------------
def page_index():
    hero = f"""<main id="contenu">
<section class="hero" aria-labelledby="titre-hero" style="padding-block-start:calc(var(--header-h) + 10px);padding-block-end:min(16vh,150px)">
{hand_html('n')}
<div class="hero-inner">
<div class="eyebrow">{suit('spade')} Bridge · Montbonnot-Saint-Martin · Isère {suit('heart')}</div>
<h1 id="titre-hero">Club de Bridge<br>de Montbonnot<em>Le club où l’on joue, apprend et trinque, au cœur du Grésivaudan</em></h1>
<p class="lead">Rondes de France deux après-midi par semaine, cours pour tous les niveaux et une ambiance détendue. Les débutants sont les bienvenus.</p>
<div class="btn-row">
<a class="btn btn-gold" href="adherer-contact.html#essayer">Venir essayer — débutants bienvenus</a>
<a class="btn btn-ghost" href="jouer.html">Jouer avec nous</a>
</div>
</div>
{hand_html('s')}
{hand_html('w')}{hand_html('e')}
{MOUNTAINS}
</section>

<section class="next" id="prochain" aria-labelledby="titre-next">
<div class="wrap">
<div class="next-card reveal" id="next-event">
<div class="date-chip" aria-hidden="false">
<span class="d" data-ne="day">Lun</span><span class="m" data-ne="month">&amp; mer</span><span class="w" data-ne="wd">13 h 45</span>
</div>
<div>
<span class="tag red"><span class="pulse" style="display:inline-block;margin-right:6px"></span>Prochain tournoi — <span data-ne="when">chaque lundi et mercredi</span></span>
<h2 id="titre-next" data-ne="title" style="margin-top:.5rem">Ronde de France</h2>
<p data-ne="details">Tournoi par paires — venez avec votre partenaire. Droits de table : 4 € adhérent · 6 € non-adhérent.</p>
<div class="next-meta"><span>{suit('diamond')} <span data-ne="time">13 h 45</span> – 18 h 00</span><span>{suit('club')} <span data-ne="place">Salle Saint-Exupéry</span></span></div>
<p style="margin:.6rem 0 0;font-size:1rem" data-ne="special"></p>
</div>
<div>
<a class="btn btn-red" href="jouer.html">Infos pratiques</a>
</div>
</div>
</div>
</section>

<section class="dark" aria-labelledby="titre-chiffres">
<div class="wrap">
<div class="sec-head reveal"><span class="kicker">{suit('club')} Le club en chiffres</span><h2 id="titre-chiffres">Un club vivant, ouvert toute l’année</h2></div>
<div class="stats">
<div class="stat reveal">{suit('spade')}<div class="num" data-count="147">147</div><p>adhérents</p></div>
<div class="stat reveal" data-d="1">{suit('heart')}<div class="num" data-count="105">105</div><p>joueurs licenciés</p></div>
<div class="stat reveal" data-d="2">{suit('diamond')}<div class="num" data-count="2">2</div><p>rondes par semaine, lundi et mercredi</p></div>
<div class="stat reveal" data-d="3">{suit('club')}<div class="num" data-count="5">5</div><p>niveaux de cours, des premiers pas au perfectionnement</p></div>
<div class="stat reveal" data-d="3">{suit('spade')}<div class="num" data-count="56">56</div><p>joueurs au Tournoi des Dindes 2024</p></div>
</div>
<p class="source">Chiffres publiés par le club : adhérents et licenciés de la saison 2022-2023, Tournoi des Dindes du 9 décembre 2024.</p>
</div>
</section>

<section aria-labelledby="titre-apercu">
<div class="wrap">
<div class="sec-head reveal"><span class="kicker">{suit('heart')} Explorez le club</span><h2 id="titre-apercu">Tout ce qu’il faut savoir, en un coup d’œil</h2></div>
<div class="grid g3">
<article class="card pill-card hover-lift reveal"><div class="icon-badge">{suit('heart')}</div><h3>Le club</h3><p>Une équipe d’animation très dynamique, un esprit convivial, un événement chaque mois : tournoi à thème, repas, sortie…</p><a class="btn btn-outline" href="le-club.html">Découvrir le club</a></article>
<article class="card pill-card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('diamond')}</div><h3>Jouer avec nous</h3><p>Rondes de France le lundi et le mercredi de 13 h 45 à 18 h 00, toute l’année, salle Saint-Exupéry.</p><a class="btn btn-outline" href="jouer.html">Horaires et formules</a></article>
<article class="card pill-card hover-lift reveal" data-d="2"><div class="icon-badge">{suit('club')}</div><h3>Cours &amp; initiation</h3><p>Du premier jour au perfectionnement, avec des moniteurs diplômés de la Fédération Française de Bridge.</p><a class="btn btn-outline" href="cours.html">Voir les cours</a></article>
<article class="card pill-card hover-lift reveal"><div class="icon-badge red">{suit('spade')}</div><h3>Tournois &amp; résultats</h3><p>Calendrier, interclubs, palmarès et liens vers les résultats officiels de la Fédération.</p><a class="btn btn-outline" href="tournois.html">Calendrier et résultats</a></article>
<article class="card pill-card hover-lift reveal" data-d="1"><div class="icon-badge">{suit('heart')}</div><h3>Galerie</h3><p>Tournoi des Dindes, notre salle, compétitions : les bons moments en images.</p><a class="btn btn-outline" href="galerie.html">Voir les photos</a></article>
<article class="card pill-card hover-lift reveal" data-d="2"><div class="icon-badge red">{suit('diamond')}</div><h3>Actualités</h3><p>Sorties festives, tournois caritatifs, distinctions : la vie du club au fil des mois.</p><a class="btn btn-outline" href="actualites.html">Lire les actualités</a></article>
</div>
</div>
</section>

<section class="alt" aria-labelledby="titre-esprit">
<div class="wrap split">
<div class="reveal">
<span class="tag green">Détendu · convivial · accessible</span>
<h2 id="titre-esprit" style="margin-top:.7rem">Un club où l’on joue, où l’on s’amuse, où l’on apprend…</h2>
<p>À Montbonnot, on vient pour le plaisir du jeu autant que pour la compagnie. Chaque mois, le club organise un « événement » : tournoi à thème avec repas (tournoi italien, tournoi breton), voyage à la rencontre d’un autre club ou sortie à la montagne — et toujours au moins un tournoi de bridge.</p>
<p>Envie de compétition ? Le club est l’un des plus compétitifs du département et prend en charge ses équipes d’interclubs. Envie de simplement découvrir ? Les cours démarrent à zéro.</p>
<div class="btn-row"><a class="btn btn-red" href="le-club.html">Notre histoire et notre esprit</a></div>
</div>
<figure class="photo reveal" data-d="1"><img src="img/montagnes.jpg" alt="Prairie fleurie et chaîne de montagnes dans les Alpes" width="1140" height="482" loading="lazy"><figcaption>Montbonnot-Saint-Martin, au cœur de la vallée du Grésivaudan.</figcaption></figure>
</div>
</section>

<section aria-labelledby="titre-photos" style="padding-top:0">
<div class="wrap">
<div class="sec-head reveal"><span class="kicker">{suit('diamond')} Ambiance</span><h2 id="titre-photos">Le Tournoi des Dindes, en quelques sourires</h2></div>
<div class="thumbs reveal" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr))">
""" + "".join(
        f'<a href="galerie.html" style="display:block;aspect-ratio:4/3;border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm)"><img src="img/dindes-{n:02d}.png" alt="Joueurs lors du Tournoi des Dindes 2024" loading="lazy" style="width:100%;height:100%;object-fit:cover"></a>'
        for n in (2, 3, 6, 7)
    ) + f"""
</div>
<div class="btn-row"><a class="btn btn-outline" href="galerie.html">Toute la galerie</a></div>
</div>
</section>

<section class="cta" aria-labelledby="titre-cta">
<div class="wrap reveal">
<h2 id="titre-cta">Venez essayer, vous êtes les bienvenus !</h2>
<p>Pas besoin d’être expert : un lundi ou un mercredi après-midi, passez nous voir. Et si vous n’avez jamais joué, nos cours de première année sont faits pour vous.</p>
<div class="btn-row">
<a class="btn btn-gold" href="adherer-contact.html#essayer">Je viens essayer</a>
<a class="btn btn-ghost" href="cours.html">Je veux apprendre</a>
</div>
</div>
</section>
"""
    build_page(
        "index.html",
        SITE,
        "Club de bridge à Montbonnot-Saint-Martin (Isère) : rondes de France les lundis et mercredis, cours pour débutants et confirmés, ambiance conviviale. Venez essayer !",
        hero,
    )


# --------------------------------------------------------------------------------------
# LE CLUB
# --------------------------------------------------------------------------------------
def page_club():
    team = [
        ("Président", "Alain Tosi"),
        ("Vice-président", "Frédéric Lapierre"),
        ("Trésorière", "Chantal Lenfant"),
        ("Secrétaire", "Catherine Fournié"),
        ("Responsables tournois", "Michel Pinéri · Gérard Besson"),
        ("Informatique", "Maryse Gagou (temporairement)"),
        ("Communication", "Alain Tosi"),
        ("Membres du CA", "Michel Pinéri · Edith Reynaert · René Tur · Pierre Bourgeot · Gérard Besson · André Redon · Mireille Maret"),
    ]
    team_html = "".join(
        f'<div class="person reveal"><small>{r}</small><b>{n}</b></div>' for r, n in team
    )
    teachers = "Jean-Yves Delacoux · Danièle Falque · Bernard Planque · Guy Stumpel · Chantal Gosset · André Redon · Hélène Miscoria"
    body = page_hero(
        "Le club",
        "Un club détendu et convivial au cœur du Grésivaudan, à deux pas de Grenoble.",
        "Le club",
    ) + f"""
<section aria-labelledby="t-pres">
<div class="wrap split">
<div class="reveal">
<span class="tag green">Présentation</span>
<h2 id="t-pres" style="margin-top:.7rem">Montbonnot Bridge</h2>
<p>Le Club de Bridge de Montbonnot, fort d’une équipe d’animation très dynamique, organise des Rondes de France les lundis et mercredis après-midi, toute l’année. D’autres tournois rythment la vie du club : tournoi de rentrée, Tournoi des Dindes, tournois au profit d’associations caritatives comme Espoir Isère contre le Cancer.</p>
<p>Ici, on joue au bridge <strong>dans de bonnes conditions</strong> et on progresse <strong>dans la bonne humeur</strong>.</p>
<div class="btn-row"><a class="btn btn-red" href="jouer.html">Jouer avec nous</a><a class="btn btn-outline" href="adherer-contact.html">Adhérer</a></div>
</div>
<figure class="photo reveal" data-d="1"><img src="img/salle-2.jpg" alt="Façade en pierre et bois de la salle Saint-Exupéry à Montbonnot" width="1080" height="810" loading="lazy"><figcaption>La salle Saint-Exupéry, où le club se retrouve, au cœur du village.</figcaption></figure>
</div>
</section>

<section class="alt" aria-labelledby="t-esprit">
<div class="wrap">
{sec_head('Notre esprit', 'Quatre façons de vivre le bridge', 'heart').replace('<h2>', '<h2 id="t-esprit">')}
<div class="grid g4">
<article class="card hover-lift reveal"><div class="icon-badge">{suit('heart')}</div><h3>Convivialité</h3><p>Un événement chaque mois : tournoi à thème avec repas (tournoi italien, breton…), sortie ou voyage à la rencontre d’un autre club.</p></article>
<article class="card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('club')}</div><h3>Transmission</h3><p>Une école de bridge avec des moniteurs diplômés FFB, ouverte aux débutants comme à ceux qui reprennent après des années d’arrêt.</p></article>
<article class="card hover-lift reveal" data-d="2"><div class="icon-badge">{suit('spade')}</div><h3>Compétition</h3><p>L’un des clubs les plus « compétitifs » du département, qui engage de nombreuses équipes en interclubs — sans jamais l’imposer.</p></article>
<article class="card hover-lift reveal" data-d="3"><div class="icon-badge red">{suit('diamond')}</div><h3>Solidarité</h3><p>Des tournois organisés au profit d’associations, comme Espoir Isère contre le Cancer, avec les clubs voisins.</p></article>
</div>
</div>
</section>

<section aria-labelledby="t-histoire">
<div class="wrap narrow">
{sec_head('Histoire', 'D’où vient le club ?', 'diamond').replace('<h2>', '<h2 id="t-histoire">')}
<div class="reveal">
<p>Le club s’est construit au fil des saisons autour d’une idée simple : un bridge exigeant mais détendu, où chacun trouve sa place. Il s’appuie aujourd’hui sur une école de bridge partagée avec les clubs voisins de Biviers, Meylan et Saint-Ismier, et sur un réseau de sorties et de tournois conviviaux dans toute la vallée.</p>
<div class="note todo"><strong>Date de création, fondateurs et grandes étapes :</strong> ces informations n’ont pas été retrouvées publiquement. Le club peut les fournir pour compléter ce paragraphe (par exemple : « Fondé en … par … »).</div>
</div>
</div>
</section>

<section class="alt" aria-labelledby="t-bureau">
<div class="wrap">
{sec_head('Bureau et comité', 'Les bénévoles qui font vivre le club', 'club').replace('<h2>', '<h2 id="t-bureau">')}
<div class="team">{team_html}</div>
<div class="person reveal" style="margin-top:16px"><small>Enseignants de l’école de bridge</small><b>{teachers}</b></div>
<p style="margin-top:1.4rem" class="reveal">Composition du conseil d’administration 2023-2024, telle que publiée par le club. Pour joindre l’équipe : <a href="adherer-contact.html">page Contact</a>.</p>
</div>
</section>

<section class="dark" aria-labelledby="t-chiffres">
<div class="wrap">
<div class="sec-head reveal"><span class="kicker">{suit('club')} En chiffres</span><h2 id="t-chiffres">Un club à taille humaine</h2></div>
<div class="stats">
<div class="stat reveal">{suit('spade')}<div class="num" data-count="147">147</div><p>adhérents</p></div>
<div class="stat reveal" data-d="1">{suit('heart')}<div class="num" data-count="105">105</div><p>licenciés</p></div>
<div class="stat reveal" data-d="2">{suit('diamond')}<div class="num" data-count="12">12</div><p>responsables et membres du conseil d’administration</p></div>
</div>
<p class="source">Saison 2022-2023, chiffres publiés par le club. Année de création : à compléter.</p>
</div>
</section>
"""
    build_page(
        "le-club.html",
        "Le club",
        "Présentation du Club de Bridge de Montbonnot : esprit convivial, valeurs, histoire, bureau et comité. Un club détendu au cœur du Grésivaudan.",
        body,
    )


# --------------------------------------------------------------------------------------
# JOUER AVEC NOUS
# --------------------------------------------------------------------------------------
def page_jouer():
    body = page_hero(
        "Jouer avec nous",
        "Deux après-midi par semaine, toute l’année, dans une salle lumineuse au cœur du village.",
        "Jouer avec nous",
    ) + f"""
<section aria-labelledby="t-form">
<div class="wrap">
{sec_head('Tournois et parties', 'Les formules pour jouer', 'diamond').replace('<h2>', '<h2 id="t-form">')}
<div class="grid g2">
<article class="card hover-lift reveal"><div class="icon-badge">{suit('spade')}</div><h3>Rondes de France</h3><p>Le rendez-vous régulier du club : un tournoi par paires, <strong>tous les lundis et mercredis</strong>, de 13 h 45 à 18 h 00, toute l’année.</p><p><span class="tag">Venez avec votre partenaire</span> <span class="tag green">Points d’experts</span></p></article>
<article class="card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('heart')}</div><h3>Un événement chaque mois</h3><p>Tournoi à thème avec repas, voyage à la rencontre d’un autre club, sortie à la montagne… et toujours au moins un tournoi de bridge.</p><p><a href="actualites.html">Voir les dernières sorties</a></p></article>
<article class="card hover-lift reveal"><div class="icon-badge">{suit('club')}</div><h3>Tournois exceptionnels</h3><p>Tournoi de rentrée, Tournoi des Dindes, tournois caritatifs au profit d’associations : un calendrier festif tout au long de la saison.</p><p><a href="tournois.html">Calendrier des tournois</a></p></article>
<article class="card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('diamond')}</div><h3>Parties libres</h3><p>Pour le plaisir de jouer sans enjeu.</p><div class="note todo"><strong>Jours et horaires de jeu libre :</strong> aucune information publiée. À confirmer avec le club.</div></article>
</div>
</div>
</section>

<section class="alt" aria-labelledby="t-horaires">
<div class="wrap">
{sec_head('Horaires et tarifs', 'Quand venir, combien ça coûte', 'club').replace('<h2>', '<h2 id="t-horaires">')}
<div class="table-scroll reveal"><table>
<thead><tr><th scope="col">Jour</th><th scope="col">Horaire</th><th scope="col">Tournoi</th><th scope="col">Lieu</th></tr></thead>
<tbody>
<tr><th scope="row" style="background:none;color:inherit;font-family:inherit">Lundi</th><td>13 h 45 – 18 h 00</td><td>Ronde de France (par paires)</td><td>Salle Saint-Exupéry</td></tr>
<tr><th scope="row" style="background:none;color:inherit;font-family:inherit">Mercredi</th><td>13 h 45 – 18 h 00</td><td>Ronde de France (par paires)</td><td>Salle Saint-Exupéry</td></tr>
</tbody></table></div>
<div class="grid g3" style="margin-top:28px">
<div class="card reveal"><h3>Droits de table</h3><p><strong>4 €</strong> pour un adhérent<br><strong>6 €</strong> pour un non-adhérent</p></div>
<div class="card reveal" data-d="1"><h3>Carte de 9 tournois</h3><p><strong>30 €</strong> pour les adhérents (soit environ 3,33 € le tournoi), valable pour les rondes de France et la régularité.</p></div>
<div class="card reveal" data-d="2"><h3>Fermetures</h3><p>Le club reste ouvert l’été, y compris en juillet, sauf quelques jours fériés : consultez l’<a href="{AGENDA}" target="_blank" rel="noopener">agenda officiel</a> avant de venir.</p></div>
</div>
</div>
</section>

<section aria-labelledby="t-lieu">
<div class="wrap split">
<div class="reveal">
{sec_head('Où jouer', 'Salle Saint-Exupéry', 'heart').replace('<h2>', '<h2 id="t-lieu">').replace(' reveal', '')}
<p>Le club se trouve <strong>au cœur du village de Montbonnot, derrière la maison des Arts</strong>.</p>
<address style="font-style:normal;font-size:1.2rem;margin-bottom:1.2rem"><strong>{ADDR1}</strong><br>{ADDR2}</address>
<p>Selon les annuaires, l’entrée et le parking sont accessibles en fauteuil roulant.</p>
<div class="btn-row"><a class="btn btn-red" href="{MAPS}" target="_blank" rel="noopener">Itinéraire sur Google Maps</a></div>
</div>
<div class="reveal" data-d="1"><iframe class="map" title="Plan : salle Saint-Exupéry, 980 chemin de la Laurelle, Montbonnot-Saint-Martin" src="{MAP_EMBED}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div>
</section>

<section class="alt" aria-labelledby="t-debutants">
<div class="wrap split">
<div class="reveal">
{sec_head('Débutants bienvenus', 'Nos conseils pour une première fois', 'club').replace('<h2>', '<h2 id="t-debutants">').replace(' reveal', '')}
<ul class="checks">
<li><strong>Venez avec votre partenaire</strong> : les rondes se jouent par paires. Pas de partenaire ? Envoyez un SMS à Alain Tosi au <a href="tel:{PHONE_RAW}">{PHONE}</a> en précisant votre nom, la date du tournoi, votre classement et votre numéro de portable : le club lance une recherche de partenaire.</li>
<li><strong>Jamais joué ?</strong> Commencez par les cours de première année, destinés aux personnes n’ayant jamais joué au bridge.</li>
<li><strong>La licence est offerte la première année</strong> (obligatoire pour les compétitions).</li>
<li><strong>Droits de table réduits</strong> et carte de 9 tournois pour les adhérents.</li>
<li><strong>Une question ?</strong> Écrivez-nous, nous vous répondons volontiers.</li>
</ul>
<div class="btn-row"><a class="btn btn-red" href="adherer-contact.html#essayer">Je viens essayer</a><a class="btn btn-outline" href="cours.html">Voir les cours</a></div>
</div>
<figure class="photo reveal" data-d="1"><img src="img/cartes.jpg" alt="Une main de cartes de bridge tenue en éventail sur un tapis vert" width="361" height="241" loading="lazy"><figcaption>Du plaisir des cartes, dès le premier jour.</figcaption></figure>
</div>
</section>
"""
    build_page(
        "jouer.html",
        "Jouer avec nous",
        "Rondes de France les lundis et mercredis de 13 h 45 à 18 h 00 à Montbonnot-Saint-Martin : horaires, tarifs, lieu et conseils pour les débutants.",
        body,
    )


# --------------------------------------------------------------------------------------
# COURS & INITIATION
# --------------------------------------------------------------------------------------
def page_cours():
    rows = [
        ("1ère année", "Mardi", "18 h 00 – 20 h 00", "Centre théologique de Meylan<br><small>chemin de la Caronnerie</small>", "Hélène Miscoria<br>Paolo Biasa", "Pour les personnes n’ayant <strong>jamais joué</strong> au bridge."),
        ("2ème année", "Lundi", "18 h 00 – 20 h 00", "Centre théologique de Meylan<br><small>chemin de la Caronnerie</small>", "Hélène Miscoria<br>Michel Robin", "Pour ceux qui ont déjà joué et veulent reprendre, ou qui ont suivi la 1ère année."),
        ("3ème année", "Jeudi", "18 h 00 – 20 h 00", "Salle polyvalente de Biviers<br><small>chemin de la Moidieu</small>", "André Redon<br>Chantal Lenfant", "Après la 2ème année, ou pour reprendre après une interruption."),
        ("4ème année", "Mercredi", "18 h 00 – 20 h 00", "Salle Saint-Exupéry, Montbonnot<br><small>980 chemin de la Laurelle</small>", "Jean-Yves Delacoux<br>Bernard Planque", "Après la 3ème année, ou pour joueurs réguliers reprenant après une pause."),
        ("Perfectionnement", "Lundi", "18 h 00 – 20 h 00", "Salle Charpentier, Biviers<br><small>chemin de la Moidieu</small>", "Jean-Yves Delacoux<br>Chantal Gosset", "Solides bases : enchères classiques et technique du jeu de la carte."),
    ]
    trs = "".join(
        f'<tr><th scope="row" style="background:none;color:var(--felt-dark)">{a}</th><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td><td>{f}</td></tr>'
        for a, b, c, d, e, f in rows
    )
    body = page_hero(
        "Cours &amp; initiation",
        "Découvrir le bridge, reprendre après des années ou se perfectionner : une école de bridge pour chacun.",
        "Cours &amp; initiation",
    ) + f"""
<section aria-labelledby="t-ecole">
<div class="wrap split">
<div class="reveal">
<span class="tag green">École de bridge</span>
<h2 id="t-ecole" style="margin-top:.7rem">Apprendre avec des moniteurs diplômés</h2>
<p>Les cours du 1er cycle d’enseignement du bridge français sont dispensés par des <strong>moniteurs de la Fédération Française de Bridge</strong> issus des clubs de Montbonnot, Biviers, Meylan et Saint-Ismier. Le programme est celui de l’Université du Bridge de la FFB, pour une progression en douceur.</p>
<p>Les séances durent <strong>2 heures</strong>, en petits groupes, dans une ambiance bienveillante.</p>
<div class="btn-row"><a class="btn btn-red" href="adherer-contact.html?sujet=cours#contact">S’inscrire ou poser une question</a></div>
</div>
<figure class="photo reveal" data-d="1"><img src="img/competition.jpg" alt="Joueurs de bridge autour d’une table avec un écran de séparation" width="500" height="500" loading="lazy"><figcaption>Du cours à la compétition : chacun avance à son rythme.</figcaption></figure>
</div>
</section>

<section class="alt" aria-labelledby="t-niveaux">
<div class="wrap">
{sec_head('Niveaux, jours et lieux', 'Le planning des cours', 'club').replace('<h2>', '<h2 id="t-niveaux">')}
<div class="table-scroll reveal"><table>
<thead><tr><th scope="col">Niveau</th><th scope="col">Jour</th><th scope="col">Horaire</th><th scope="col">Lieu</th><th scope="col">Enseignants</th><th scope="col">Pour qui ?</th></tr></thead>
<tbody>{trs}</tbody></table></div>
<div class="note"><strong>Planning de la saison 2024-2025</strong>, dernier publié par le club. Les dates de reprise (début octobre) et d’éventuels changements de salle ou d’horaire pour la saison en cours sont à confirmer auprès du club.</div>
</div>
</section>

<section aria-labelledby="t-tarifs">
<div class="wrap">
{sec_head('Tarifs', 'Combien coûtent les cours ?', 'diamond').replace('<h2>', '<h2 id="t-tarifs">')}
<div class="grid g3">
<div class="card reveal"><h3>1ère à 3ème année</h3><p style="font-size:2rem;font-family:var(--f-title);color:var(--felt-dark);margin:.2em 0"><strong>70 €</strong> <small style="font-size:1rem;font-family:var(--f-text)">par an</small></p></div>
<div class="card reveal" data-d="1"><h3>4ème année et perfectionnement</h3><p style="font-size:2rem;font-family:var(--f-title);color:var(--felt-dark);margin:.2em 0"><strong>90 €</strong> <small style="font-size:1rem;font-family:var(--f-text)">par an</small></p><p>Comprend une carte de participation à 10 tournois, utilisable dans chacun des clubs de l’école de bridge.</p></div>
<div class="card reveal" data-d="2"><h3>À prévoir en plus</h3><ul style="margin:0"><li>La <strong>licence FFB</strong> — gratuite la première année</li><li>L’<strong>adhésion à un des clubs</strong> (cotisation réduite pour les élèves)</li><li>Les <strong>livres de cours</strong> en 1ère et 2ème année (FFB ou librairies)</li></ul></div>
</div>
<p class="reveal" style="margin-top:1.4rem">Pour la préparation aux compétitions, le montant est précisé ultérieurement par le club.</p>
</div>
</section>

<section class="alt" aria-labelledby="t-intervenants">
<div class="wrap narrow">
{sec_head('Intervenants', 'Ceux qui vous apprennent le bridge', 'heart').replace('<h2>', '<h2 id="t-intervenants">')}
<p class="reveal">Hélène Miscoria, Paolo Biasa, Michel Robin, André Redon, Chantal Lenfant, Jean-Yves Delacoux, Bernard Planque et Chantal Gosset animent les cours de la saison, avec l’appui de l’équipe pédagogique des clubs de Montbonnot, Biviers, Meylan et Saint-Ismier.</p>
</div>
</section>

<section aria-labelledby="t-inscription">
<div class="wrap narrow">
{sec_head('Inscription', 'Comment s’inscrire ?', 'spade').replace('<h2>', '<h2 id="t-inscription">')}
<div class="reveal">
<p>Écrivez-nous via le <a href="adherer-contact.html?sujet=cours#contact">formulaire de contact</a> en précisant le niveau qui vous intéresse, ou appelez directement :</p>
<ul class="contact-list">
<li>{suit('spade')}<span><strong>Jean-Yves Delacoux</strong> (cours) : <a href="tel:0684468992">06 84 46 89 92</a></span></li>
<li>{suit('heart')}<span><strong>Alain Tosi</strong> (président) : <a href="tel:{PHONE_RAW}">{PHONE}</a></span></li>
</ul>
<div class="btn-row"><a class="btn btn-red" href="adherer-contact.html?sujet=cours#contact">Je m’inscris</a></div>
</div>
</div>
</section>
"""
    build_page(
        "cours.html",
        "Cours & initiation",
        "École de bridge de Montbonnot : cours de la 1ère année au perfectionnement, jours, lieux, tarifs et enseignants diplômés de la Fédération Française de Bridge.",
        body,
    )


# --------------------------------------------------------------------------------------
# TOURNOIS & RÉSULTATS
# --------------------------------------------------------------------------------------
def page_tournois():
    honours = [
        ("Finale de comité interclubs D2", "3ème", "Jean-Louis Crochon, Emmanuelle Courot, Marcelle Baumann, Gérard Besson, Andrée Gadelle"),
        ("Mixte par 4 — éliminatoires district", "1ers", "Bernard Planque, Arlette Rat, Maryse Gagou, Michel-César Singer, Danièle Falque, Jacques Bergeri"),
        ("Challenge d’hiver par quatre — finale Isère", "3èmes", "Evelyne Ragusa, Yannik Giovansili, Danièle Galera, Marie-Pierre Derdinger, Richard Boissenot, Marie-Hélène Giraud, Brigitte Theuriau"),
        ("Senior mixte par 2 — éliminatoires district", "1ers", "Jacqueline Yver, Guy Mazare"),
        ("Open par 4 performance — demi-finale de district", "2èmes", "Bernard Planque, Laurent Pivat, Danièle Falque, Marie-Rose Durouge, Arlette Rat, Maryse Gagou"),
    ]
    h = "".join(
        f'<tr><td>{a}</td><td><span class="tag">{b}</span></td><td>{c}</td></tr>' for a, b, c in honours
    )
    body = page_hero(
        "Tournois &amp; résultats",
        "Rondes régulières, événements festifs, interclubs et résultats officiels.",
        "Tournois &amp; résultats",
    ) + f"""
<section aria-labelledby="t-cal">
<div class="wrap">
{sec_head('Calendrier', 'Les rendez-vous du club', 'spade').replace('<h2>', '<h2 id="t-cal">')}
<div class="table-scroll reveal"><table>
<thead><tr><th scope="col">Quand</th><th scope="col">Rendez-vous</th><th scope="col">Détails</th></tr></thead>
<tbody>
<tr><td><strong>Chaque lundi et mercredi</strong><br>13 h 45 – 18 h 00</td><td>Ronde de France<br><span class="tag green">Régulier</span></td><td>Tournoi par paires, toute l’année. 4 € adhérent · 6 € non-adhérent. Salle Saint-Exupéry.</td></tr>
<tr><td><strong>Chaque mois</strong></td><td>Événement du club<br><span class="tag">Convivial</span></td><td>Tournoi à thème avec repas, voyage ou sortie, avec toujours un tournoi de bridge.</td></tr>
<tr><td><strong>Décembre</strong><br>(9 décembre en 2024)</td><td>Tournoi des Dindes<br><span class="tag">Festif</span></td><td>Un bon entraînement avant les fêtes de Noël, suivi d’un repas. Salle Saint-Exupéry. Date 2026 à confirmer.</td></tr>
<tr><td><strong>Été</strong></td><td>Sorties bridge<br><span class="tag">Montagne</span></td><td>Herbeys, Chamrousse, Col de Porte : bridge, balade ou pétanque, et repas. Dates de l’été prochain à confirmer.</td></tr>
<tr><td><strong>Selon l’actualité</strong></td><td>Tournois caritatifs<br><span class="tag red">Solidaire</span></td><td>Par exemple, le tournoi au profit d’Espoir Isère contre le Cancer (29 mars 2025).</td></tr>
</tbody></table></div>
<div class="btn-row reveal"><a class="btn btn-red" href="{AGENDA}" target="_blank" rel="noopener">Agenda officiel du club</a><a class="btn btn-outline" href="actualites.html">Dernières actualités</a></div>
</div>
</section>

<section class="alt" aria-labelledby="t-res">
<div class="wrap">
{sec_head('Résultats et classements', 'Où retrouver les résultats', 'heart').replace('<h2>', '<h2 id="t-res">')}
<div class="grid g3">
<article class="card hover-lift reveal"><div class="icon-badge">{suit('spade')}</div><h3>Résultats FFB</h3><p>Les résultats de nos rondes sont publiés sur l’espace licencié de la Fédération Française de Bridge.</p><a class="btn btn-outline" href="{FFB_RESULTS}" target="_blank" rel="noopener">Espace FFB</a></article>
<article class="card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('diamond')}</div><h3>Bridge+</h3><p>Retrouvez aussi les résultats et les donnes sur la plateforme Bridge+.</p><a class="btn btn-outline" href="{BRIDGEPLUS}" target="_blank" rel="noopener">Bridge+</a></article>
<article class="card hover-lift reveal" data-d="2"><div class="icon-badge">{suit('club')}</div><h3>Comité Dauphiné-Savoie</h3><p>Classements, calendriers et compétitions du comité régional.</p><a class="btn btn-outline" href="{CDS}" target="_blank" rel="noopener">Comité DS</a></article>
</div>
</div>
</section>

<section aria-labelledby="t-hon">
<div class="wrap">
{sec_head('À l’honneur', 'Bravo à nos compétiteurs !', 'diamond').replace('<h2>', '<h2 id="t-hon">')}
<div class="table-scroll reveal"><table>
<thead><tr><th scope="col">Compétition</th><th scope="col">Place</th><th scope="col">Joueurs de Montbonnot</th></tr></thead>
<tbody>{h}</tbody></table></div>
<p class="source" style="color:var(--ink-soft)">Distinctions publiées par le club sur son site officiel. D’autres résultats sont à découvrir sur l’espace FFB.</p>
</div>
</section>

<section class="dark" aria-labelledby="t-inter">
<div class="wrap split">
<div class="reveal">
<span class="kicker" style="color:var(--gold-soft);font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:.9rem">{suit('spade')} Compétitions</span>
<h2 id="t-inter" style="margin-top:.5rem">Interclubs : le club joue le jeu avec vous</h2>
<p>Montbonnot Bridge favorise la participation du plus grand nombre à la vie du club. Il aide à constituer des équipes en match par 4 ou par paires et organise directement les <strong>équipes d’interclubs</strong> qui défendent nos couleurs.</p>
<ul class="checks" style="color:#fff">
<li>Inscriptions et droits de table <strong>pris en charge par le club</strong></li>
<li>Frais de déplacement pris en charge pour les finales hors Isère</li>
<li>Pour les membres d’une équipe : au moins dix tournois du club dans l’année</li>
</ul>
<p>Renseignements : Alain Tosi, responsable des compétitions — <a href="tel:{PHONE_RAW}">{PHONE}</a>.</p>
</div>
<figure class="photo reveal" data-d="1"><img src="img/competition.jpg" alt="Deux équipes de joueurs de bridge en compétition" width="500" height="500" loading="lazy"></figure>
</div>
</section>

<section aria-labelledby="t-arch">
<div class="wrap">
{sec_head('Archives', 'Quelques moments marquants', 'club').replace('<h2>', '<h2 id="t-arch">')}
<ul class="reveal">
<li><strong>Été 2026</strong> — Tournoi festif à la ferme des Charrières (Herbeys, 3 juillet), sortie à Chamrousse (24 juillet) et au Col de Porte (7 août).</li>
<li><strong>29 mars 2025</strong> — Tournoi par paires homologué au profit d’Espoir Isère contre le Cancer, avec les clubs de Montbonnot, Biviers, Saint-Ismier, Grenoble et Meylan.</li>
<li><strong>9 décembre 2024</strong> — Tournoi des Dindes : 56 joueurs, puis repas dans la bonne humeur.</li>
<li><strong>30 septembre 2024</strong> — Tournoi festival des simultanés suivi de l’assemblée générale et d’un cocktail dînatoire.</li>
</ul>
<div class="btn-row"><a class="btn btn-outline" href="galerie.html">Voir les photos</a></div>
</div>
</section>
"""
    build_page(
        "tournois.html",
        "Tournois & résultats",
        "Calendrier des tournois du Club de Bridge de Montbonnot, interclubs, distinctions et liens vers les résultats officiels de la Fédération Française de Bridge.",
        body,
    )


# --------------------------------------------------------------------------------------
# GALERIE
# --------------------------------------------------------------------------------------
def thumbs(items):
    out = []
    for src, alt, cap in items:
        out.append(
            f'<button type="button" data-full="{src}" data-cap="{cap}"><img src="{src}" alt="{alt}" loading="lazy"></button>'
        )
    return "".join(out)


def page_galerie():
    dindes = [(f"img/dindes-{n:02d}.png", "Convives attablés pendant le Tournoi des Dindes 2024", "Tournoi des Dindes — 9 décembre 2024") for n in range(1, 13)]
    salle = [
        ("img/salle-1.jpg", "Vues de la salle Saint-Exupéry et de ses abords, avec la montagne en arrière-plan", "La salle Saint-Exupéry et ses abords"),
        ("img/salle-2.jpg", "Façade en pierre et bois de la salle Saint-Exupéry", "La salle Saint-Exupéry, au cœur de Montbonnot"),
        ("img/salle-3.jpg", "Bardage en acier patiné du bâtiment, avec parking", "Le parking à côté de la salle"),
    ]
    compet = [
        ("img/competition.jpg", "Équipes de bridge en compétition, avec écran de séparation sur la table", "Compétition par équipes"),
        ("img/cartes.jpg", "Main de cartes de bridge sur tapis vert", "Les cartes, au cours de bridge"),
    ]
    espoir = [("img/affiche-espoir.jpg", "Affiche du tournoi de bridge au profit d’Espoir Isère contre le Cancer", "Tournoi au profit d’Espoir Isère contre le Cancer — 29 mars 2025")]
    body = page_hero(
        "Galerie",
        "Les bons moments du club en images, classés par événement.",
        "Galerie",
    ) + f"""
<section aria-labelledby="t-gal">
<div class="wrap">
<h2 id="t-gal" class="sr-only">Albums photo</h2>
<div class="filters" role="group" aria-label="Filtrer les albums">
<button type="button" data-filter="all" aria-pressed="true">Tout voir</button>
<button type="button" data-filter="dindes" aria-pressed="false">Tournoi des Dindes</button>
<button type="button" data-filter="salle" aria-pressed="false">Notre salle</button>
<button type="button" data-filter="compet" aria-pressed="false">Cours &amp; compétitions</button>
<button type="button" data-filter="espoir" aria-pressed="false">Tournoi solidaire</button>
</div>

<div class="album reveal" data-album="dindes">
<h3>{suit('heart', 'red')} Tournoi des Dindes — décembre 2024</h3>
<p class="meta">56 joueurs, un bon entraînement avant Noël puis un repas dans la bonne humeur, salle Saint-Exupéry.</p>
<div class="thumbs">{thumbs(dindes)}</div>
</div>

<div class="album reveal" data-album="salle">
<h3>{suit('spade')} Notre salle — Saint-Exupéry</h3>
<p class="meta">Au cœur du village de Montbonnot, derrière la maison des Arts.</p>
<div class="thumbs">{thumbs(salle)}</div>
</div>

<div class="album reveal" data-album="compet">
<h3>{suit('club')} Cours &amp; compétitions</h3>
<p class="meta">Apprendre, s’entraîner, défendre les couleurs de Montbonnot.</p>
<div class="thumbs">{thumbs(compet)}</div>
</div>

<div class="album reveal" data-album="espoir">
<h3>{suit('diamond', 'red')} Tournoi au profit d’Espoir Isère contre le Cancer</h3>
<p class="meta">Samedi 29 mars 2025, avec les clubs voisins.</p>
<div class="thumbs">{thumbs(espoir)}</div>
</div>

<div class="note">Les photos proviennent du site officiel du club. Vous avez des photos à partager ? Écrivez-nous via la <a href="adherer-contact.html">page Contact</a>.</div>
</div>
</section>

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Visionneuse de photos">
<button class="lb-close" type="button" aria-label="Fermer">×</button>
<button class="lb-nav lb-prev" type="button" aria-label="Photo précédente">‹</button>
<img src="" alt="">
<p></p>
<button class="lb-nav lb-next" type="button" aria-label="Photo suivante">›</button>
</div>
"""
    build_page(
        "galerie.html",
        "Galerie photos",
        "Photos du Club de Bridge de Montbonnot : Tournoi des Dindes, salle Saint-Exupéry, compétitions et tournoi solidaire.",
        body,
    )


# --------------------------------------------------------------------------------------
# ACTUALITÉS
# --------------------------------------------------------------------------------------
def page_actus():
    def item(big, small, title, text, extra=""):
        return f"""<article class="news-item reveal"><div class="when"><b>{big}</b><span>{small}</span></div><div><h3>{title}</h3>{text}{extra}</div></article>"""

    items = [
        item("Été", "2026", "Trois sorties bridge à la montagne et à la campagne",
             "<p>Le club a proposé un tournoi festif à la <strong>ferme des Charrières à Herbeys</strong> (vendredi 3 juillet), une sortie à <strong>Chamrousse</strong> avec les estivants (24 juillet) et une journée au <strong>Col de Porte</strong> (7 août) : petite randonnée ou concours de boules le matin, repas, puis tournoi de bridge l’après-midi.</p>",
             '<p><span class="tag">Dates de l’été prochain : à confirmer</span></p>'),
        item("Bravo", "interclubs", "Nos équipes à l’honneur",
             "<p>Troisième place en finale de comité interclubs D2, victoires en éliminatoires de district, belles places en finale de l’Isère : le club brille en compétition. Retrouvez le détail dans la page <a href=\"tournois.html\">Tournois &amp; résultats</a>.</p>"),
        item("29", "mars 2025", "Tournoi au profit d’Espoir Isère contre le Cancer",
             "<p>Tournoi par paires homologué organisé par les clubs de Montbonnot, Biviers, Saint-Ismier, Grenoble et Meylan : accueil à partir de 13 h, début du tournoi à 13 h 45, remise des prix et cocktail à partir de 18 h 15. Engagement : 25 €, nombreux lots à gagner.</p>",
             '<img src="img/affiche-espoir.jpg" alt="Affiche du tournoi au profit d’Espoir Isère contre le Cancer" width="340" height="362" loading="lazy">'),
        item("9", "déc. 2024", "Tournoi des Dindes",
             "<p>Un bon entraînement pour les fêtes de Noël, salle Saint-Exupéry : <strong>56 joueurs</strong> se sont affrontés, puis ont ripaillé dans la bonne humeur. <a href=\"galerie.html\">Voir les photos</a>.</p>"),
        item("30", "sept. 2024", "Tournoi festival des simultanés et assemblée générale",
             "<p>Le lundi 30 septembre, tournoi suivi de l’assemblée générale du club et d’un cocktail dînatoire.</p>"),
    ]
    body = page_hero(
        "Actualités",
        "La vie du club : sorties, tournois festifs, distinctions et rendez-vous à ne pas manquer.",
        "Actualités",
    ) + f"""
<section aria-labelledby="t-actus">
<div class="wrap narrow">
<h2 id="t-actus" class="sr-only">Dernières nouvelles</h2>
<div class="news">
{''.join(items)}
</div>
<div class="note reveal" style="margin-top:32px"><strong>Toujours plus d’infos :</strong> convocations aux assemblées, comptes rendus du conseil d’administration, règlement des interclubs et agenda complet sont sur le <a href="{OFFICIAL}" target="_blank" rel="noopener">site officiel du club</a>.</div>
<div class="btn-row"><a class="btn btn-red" href="adherer-contact.html">Nous contacter</a><a class="btn btn-outline" href="tournois.html">Calendrier des tournois</a></div>
</div>
</section>
"""
    build_page(
        "actualites.html",
        "Actualités",
        "Dernières nouvelles du Club de Bridge de Montbonnot : sorties festives, tournoi des Dindes, tournoi solidaire, distinctions et assemblée générale.",
        body,
    )


# --------------------------------------------------------------------------------------
# ADHÉRER / CONTACT
# --------------------------------------------------------------------------------------
def page_contact():
    body = page_hero(
        "Adhérer / Contact",
        "Rejoignez un club sympathique et dynamique : on vous accueille avec plaisir.",
        "Adhérer / Contact",
    ) + f"""
<section id="essayer" aria-labelledby="t-essayer" style="padding-bottom:0">
<div class="wrap">
<div class="cta reveal" style="border-radius:26px;padding:44px 28px;box-shadow:var(--shadow)">
<div class="wrap" style="width:100%">
<h2 id="t-essayer">Venez essayer — débutants bienvenus !</h2>
<p>Passez un lundi ou un mercredi après-midi, à partir de 13 h 45, salle Saint-Exupéry. Dites-nous simplement que c’est votre première fois.</p>
<div class="btn-row"><a class="btn btn-gold" href="#contact">Nous écrire</a><a class="btn btn-ghost" href="tel:{PHONE_RAW}">Appeler {PHONE}</a></div>
</div>
</div>
</div>
</section>

<section aria-labelledby="t-adh">
<div class="wrap">
{sec_head('Adhésion et licence', 'Rejoindre le club', 'heart').replace('<h2>', '<h2 id="t-adh">')}
<div class="grid g3">
<div class="card hover-lift reveal"><div class="icon-badge">{suit('heart')}</div><h3>Cotisation au club</h3><p style="font-size:1.9rem;font-family:var(--f-title);color:var(--felt-dark);margin:.1em 0"><strong>20 €</strong> <small style="font-size:1rem;font-family:var(--f-text)">par an</small></p><p>10 € pour les élèves de l’école de bridge.</p></div>
<div class="card hover-lift reveal" data-d="1"><div class="icon-badge red">{suit('spade')}</div><h3>Licence FFB</h3><p style="font-size:1.9rem;font-family:var(--f-title);color:var(--felt-dark);margin:.1em 0"><strong>Gratuite</strong></p><p>la première année. Elle est obligatoire pour participer aux compétitions.</p></div>
<div class="card hover-lift reveal" data-d="2"><div class="icon-badge">{suit('diamond')}</div><h3>Droits de table</h3><p style="font-size:1.9rem;font-family:var(--f-title);color:var(--felt-dark);margin:.1em 0"><strong>4 €</strong> <small style="font-size:1rem;font-family:var(--f-text)">adhérent</small></p><p>6 € pour un non-adhérent. Carte de 9 tournois : 30 €.</p></div>
</div>
<div class="note"><strong>Tarifs de référence : saison 2023-2024</strong> (publiés par le club). Les montants de la saison en cours, la licence des années suivantes et la façon de régler (chèque, espèces…) sont à confirmer auprès du club.</div>
<h3 style="margin-top:2rem" class="reveal">Comment adhérer ?</h3>
<ol class="reveal"><li>Venez jouer un lundi ou un mercredi après-midi, ou écrivez-nous.</li><li>L’équipe du club vous explique les démarches d’adhésion.</li><li>Votre première licence FFB est gratuite.</li></ol>
<div class="note todo"><strong>Bulletin d’adhésion et modalités précises :</strong> à fournir par le club (document à télécharger, lien vers un formulaire, etc.).</div>
</div>
</section>

<section class="alt" id="contact" aria-labelledby="t-contact">
<div class="wrap split" style="align-items:start">
<div class="reveal">
{sec_head('Contact', 'Écrivez-nous', 'diamond').replace('<h2>', '<h2 id="t-contact">').replace(' reveal', '')}
<form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div><label for="nom">Votre nom *</label><input id="nom" name="nom" type="text" required autocomplete="name"></div>
<div><label for="email">Votre e-mail *</label><input id="email" name="email" type="email" required autocomplete="email"></div>
<div><label for="tel">Votre téléphone <small>(facultatif)</small></label><input id="tel" name="telephone" type="tel" autocomplete="tel"></div>
<div><label for="sujet">Votre demande</label>
<select id="sujet" name="sujet">
<option data-key="essayer" value="Venir essayer (débutant)">Venir essayer — je suis débutant</option>
<option data-key="cours" value="Cours / école de bridge">Cours et école de bridge</option>
<option data-key="adhesion" value="Adhésion / licence">Adhésion et licence</option>
<option data-key="partenaire" value="Recherche de partenaire">Recherche de partenaire de jeu</option>
<option data-key="autre" value="Autre question">Autre question</option>
</select></div>
<div><label for="message">Votre message *</label><textarea id="message" name="message" required></textarea></div>
<label class="checkline"><input type="checkbox" name="consentement" required> <span>J’accepte que mes informations soient utilisées pour répondre à ma demande (voir les <a href="mentions-legales.html#donnees">mentions légales</a>).</span></label>
<div><button class="btn btn-red" type="submit">Envoyer mon message</button></div>
</form>
</div>
<div class="reveal" data-d="1">
<h3>Coordonnées</h3>
<ul class="contact-list">
<li>{suit('spade')}<span><strong>Club de Bridge de Montbonnot</strong><br>{ADDR1}<br>{ADDR2}</span></li>
<li>{suit('heart')}<span><strong>Alain Tosi</strong>, président<br><a href="tel:{PHONE_RAW}">{PHONE}</a> <small>(SMS bienvenus)</small><br><a href="mailto:{EMAIL}">{EMAIL}</a></span></li>
<li>{suit('diamond')}<span><strong>Cours de bridge</strong> — Jean-Yves Delacoux<br><a href="tel:0684468992">06 84 46 89 92</a></span></li>
<li>{suit('club')}<span><strong>Rondes de France</strong><br>lundi et mercredi · 13 h 45 – 18 h 00</span></li>
</ul>
<iframe class="map" title="Plan : salle Saint-Exupéry, 980 chemin de la Laurelle, Montbonnot-Saint-Martin" src="{MAP_EMBED}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
<p style="margin-top:1rem"><a href="{MAPS}" target="_blank" rel="noopener">Ouvrir l’itinéraire dans Google Maps</a></p>
</div>
</div>
</section>
"""
    build_page(
        "adherer-contact.html",
        "Adhérer / Contact",
        "Rejoindre le Club de Bridge de Montbonnot : cotisation, licence, venir essayer, formulaire de contact, coordonnées et plan d’accès à Montbonnot-Saint-Martin.",
        body,
    )


# --------------------------------------------------------------------------------------
# MENTIONS LÉGALES, MERCI, 404
# --------------------------------------------------------------------------------------
def page_legal():
    body = page_hero("Mentions légales", "Informations légales et données personnelles.", "Mentions légales") + f"""
<section>
<div class="wrap narrow" style="font-size:1.1rem">
<h2>Éditeur du site</h2>
<p><strong>Club de Bridge de Montbonnot</strong>, association loi 1901.<br>
Siège : salle Saint-Exupéry — 980 chemin de la Laurelle, 38330 Montbonnot-Saint-Martin.<br>
Responsable de la publication : Alain Tosi, président.</p>
<div class="note todo"><strong>Numéro SIRET et numéro RNA :</strong> à vérifier et compléter par le club (le numéro publié sur l’ancien site comporte 13 chiffres au lieu de 14).</div>

<h2>Conception du site</h2>
<div class="note todo"><strong>Nom de l’agence ou du concepteur :</strong> à compléter.</div>

<h2>Hébergement</h2>
<p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>

<h2 id="donnees">Données personnelles</h2>
<p>Le formulaire de contact recueille votre nom, votre e-mail, votre téléphone (facultatif) et votre message, uniquement pour répondre à votre demande. Ces informations sont transmises au club par le service Netlify Forms, ne sont ni vendues ni cédées, et sont conservées le temps nécessaire au traitement de votre demande.</p>
<p>Ce site n’utilise ni cookie publicitaire ni outil de suivi. Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification et de suppression de vos données : écrivez-nous via la <a href="adherer-contact.html#contact">page Contact</a>.</p>

<h2>Propriété intellectuelle</h2>
<p>Le logo, les photographies et les textes sont la propriété du Club de Bridge de Montbonnot ou utilisés avec l’accord de leurs auteurs. Toute reproduction sans autorisation est interdite. Les noms et images des personnes sont publiés avec leur accord ; pour demander un retrait, écrivez-nous.</p>
<div class="note todo"><strong>Droit à l’image :</strong> le club doit confirmer qu’il dispose de l’accord des personnes visibles sur les photos et nommées dans les palmarès.</div>

<h2>Liens externes</h2>
<p>Le site renvoie vers le site officiel du club, la Fédération Française de Bridge, le Comité Dauphiné-Savoie et Bridge+. Le club n’est pas responsable de leur contenu.</p>
</div>
</section>
"""
    build_page("mentions-legales.html", "Mentions légales", "Mentions légales du site du Club de Bridge de Montbonnot : éditeur, hébergement, données personnelles et propriété intellectuelle.", body)


def page_merci():
    body = page_hero("Merci !", "Votre message a bien été envoyé. Nous vous répondons très vite.", "Contact") + f"""
<section><div class="wrap narrow reveal"><p>En attendant, vous pouvez découvrir <a href="jouer.html">comment jouer avec nous</a> ou <a href="galerie.html">parcourir la galerie</a>.</p><div class="btn-row"><a class="btn btn-red" href="index.html">Retour à l’accueil</a></div></div></section>
"""
    build_page("merci.html", "Message envoyé", "Merci pour votre message au Club de Bridge de Montbonnot.", body)


def page_404():
    body = page_hero("Page introuvable", "Cette page n’existe pas ou a été déplacée.", "Erreur 404") + f"""
<section><div class="wrap narrow"><p>Pas de panique : retrouvez votre chemin depuis le menu, ou revenez à l’accueil.</p><div class="btn-row"><a class="btn btn-red" href="/index.html">Retour à l’accueil</a></div></div></section>
"""
    # chemins absolus pour que la page fonctionne depuis n'importe quelle URL
    html = head("404.html", "Page introuvable", "Page introuvable.") + header("404.html") + body + "</main>\n" + footer()
    for a in ('href="css/', 'href="img/', 'href="favicon', 'src="img/', 'src="js/'):
        html = html.replace(a, a.replace('="', '="/'))
    for f, _, _ in NAV + [LEGAL + ("",)]:
        html = html.replace(f'href="{f}"', f'href="/{f}"')
    write("404.html", html)


FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#0d4a37" stroke="#c9a24b" stroke-width="3"/><path fill="#f8f4e9" d="M32 12c-8 9-18 15-18 25 0 6 5 10 11 10 3 0 6-1 8-3-.2 4-1.8 8-4.5 11h7c-2.700-3-4.300-7-4.500-11 2 2 5 3 8 3 6 0 11-4 11-10 0-10-10-16-18-25z" transform="translate(0 -1) scale(1)"/></svg>"""

NETLIFY = """[build]
  publish = "public"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/img/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=3600"
"""

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    page_index(); page_club(); page_jouer(); page_cours(); page_tournois()
    page_galerie(); page_actus(); page_contact(); page_legal(); page_merci(); page_404()
    write("favicon.svg", FAVICON)
    with open(os.path.join(os.path.dirname(OUT), "netlify.toml"), "w", encoding="utf-8") as fh:
        fh.write(NETLIFY)
    with open(os.path.join(OUT, "robots.txt"), "w") as fh:
        fh.write("User-agent: *\nAllow: /\n")
    print("OK", sorted(f for f in os.listdir(OUT) if f.endswith(".html")))
