#!/usr/bin/env python3
"""Générateur du site statique « Gan Mémoire et Patrimoine ».

Usage : python3 site-src/build.py   (depuis la racine du dépôt)
Produit les pages HTML dans ./site/ (images et assets déjà présents).
Le contenu éditable (textes, programme, bureau…) est regroupé dans ce fichier.
"""
import datetime
import html
import json
import os
import urllib.parse

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site")
IMG = os.path.join(OUT, "img")
TODAY = datetime.date.today()

OFF = "https://gan-memoire-patrimoine.jimdofree.com"  # site historique de l'association
EMAIL = "daniel.trallero@orange.fr"
NAME = "Gan Mémoire et Patrimoine"
ADDR = "2 rue Pierre de Marca, 64290 Gan"

NAV = [
    ("index.html", "Accueil", "Accueil"),
    ("association.html", "L’association", "L’association"),
    ("histoire-patrimoine.html", "Histoire", "Histoire &amp; patrimoine"),
    ("memoire-temoignages.html", "Mémoire", "Mémoire &amp; témoignages"),
    ("evenements.html", "Événements", "Expositions, conférences &amp; visites"),
    ("publications.html", "Publications", "Publications &amp; ressources"),
    ("galerie.html", "Galerie", "Galerie"),
    ("adherer-contact.html", "Adhérer / Contact", "Adhérer / Contact"),
    ("mentions-legales.html", "Mentions légales", "Mentions légales"),
]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

_dims = {}


def dims(name):
    if name not in _dims:
        with Image.open(os.path.join(IMG, name)) as im:
            _dims[name] = im.size
    return _dims[name]


def e(s):
    return html.escape(s, quote=True)


def img(name, alt, cls="", lazy=True, style=""):
    w, h = dims(name)
    return (f'<img src="img/{name}" alt="{e(alt)}" width="{w}" height="{h}"'
            f'{" loading=\"lazy\" decoding=\"async\"" if lazy else " fetchpriority=\"high\""}'
            f'{f" class=\"{cls}\"" if cls else ""}{f" style=\"{style}\"" if style else ""}>')


def off(path):
    """URL d'une page du site historique (accents encodés)."""
    return OFF + urllib.parse.quote(path, safe="/-")


# ---------------------------------------------------------------- gabarit
def layout(filename, title, description, body, hero=None, og_image="og-image.jpg", extra_head="", is_home=False):
    nav_html = ""
    for href, short, long_ in NAV:
        cur = ' aria-current="page"' if href == filename else ""
        cls = ' class="nav-cta"' if href == "adherer-contact.html" else ""
        nav_html += f'<a href="{href}"{cls}{cur}><span class="l-short">{short}</span><span class="l-long">{long_}</span></a>\n        '
    full_title = f"{title} — {NAME}" if not is_home else f"{NAME} — la mémoire et le patrimoine de Gan (Béarn)"
    foot_nav = "".join(f'<li><a href="{h}">{l.replace("&amp;", "&amp;")}</a></li>' for h, _, l in NAV)
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full_title)}</title>
<meta name="description" content="{e(description)}">
<meta name="theme-color" content="#12291f">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="{NAME}">
<meta property="og:title" content="{e(full_title)}">
<meta property="og:description" content="{e(description)}">
<meta property="og:image" content="img/{og_image}">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="img/logo-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&amp;family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500;1,600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script>document.documentElement.className+=' js'</script>
{extra_head}
</head>
<body>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html" aria-label="{NAME} — accueil">
      <img src="img/logo-180.png" alt="" width="56" height="58">
      <span class="brand-text">Gan<small>Mémoire &amp; Patrimoine</small></span>
    </a>
    <nav class="nav" id="menu" aria-label="Menu principal">
        {nav_html}</nav>
    <div class="header-tools">
      <div class="fs-ctrl" role="group" aria-label="Taille du texte">
        <button type="button" data-fs-step="-1" aria-label="Réduire la taille du texte">A−</button>
        <button type="button" data-fs-step="1" aria-label="Agrandir la taille du texte">A+</button>
      </div>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="contenu">
{hero}
{body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-brand"><img src="img/logo-180.png" alt="Logo de l’association" width="64" height="66"><strong>{NAME}</strong></div>
        <p>Association loi 1901 pour faire connaître et mettre en valeur le patrimoine historique, géographique et culturel de Gan, en Béarn.</p>
      </div>
      <div>
        <h2>Le site</h2>
        <ul>{foot_nav}</ul>
      </div>
      <div class="footer-contact">
        <h2>Nous écrire</h2>
        <ul>
          <li>Daniel Trallero, président</li>
          <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
          <li>{ADDR}</li>
          <li><a href="adherer-contact.html#contact">Formulaire de contact</a></li>
        </ul>
      </div>
      <div>
        <h2>Sur le web</h2>
        <ul>
          <li><a href="{OFF}/" target="_blank" rel="noopener">Site historique de l’association</a><br><span class="small" style="color:#cfc4a8">Archives complètes 2008–2026</span></li>
          <li><a href="https://gan.pau.fr/home/Commune" target="_blank" rel="noopener">Ville de Gan</a></li>
          <li><a href="https://bastides64.org/" target="_blank" rel="noopener">Bastides 64</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© {TODAY.year} {NAME} — Tous droits réservés.</span>
      <a href="mentions-legales.html">Mentions légales</a>
    </div>
  </div>
</footer>
<button class="to-top" type="button" aria-label="Retour en haut de la page">↑</button>
<script src="assets/js/main.js" defer></script>
</body>
</html>
"""


def page_hero(crumb, h1, lead, bg, pos="center"):
    return f"""<section class="page-hero">
  <div class="page-hero-bg">{img(bg, "", lazy=False, style=f"object-position:{pos}")}</div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › {crumb}</nav>
    <h1>{h1}</h1>
    <p>{lead}</p>
  </div>
</section>"""


def section_head(eyebrow, title, lead="", center=False):
    return f"""<div class="section-head{' center' if center else ''} reveal">
  <span class="eyebrow">{eyebrow}</span>
  <h2>{title}</h2>
  {f'<p class="lead">{lead}</p>' if lead else ''}
</div>"""


def compare_block(uid="cmp"):
    return f"""<div class="compare" data-compare>
  {img("bains-1975.jpg", "Les Bains du Broca en 1975 : une voûte de pierre qui s’effondre, en pleine prairie", "before")}
  {img("bains-bassin.jpg", "Les Bains du Broca après leur restauration et l’aménagement d’un bassin, en 1997", "after")}
  <span class="tag l">En 1975</span><span class="tag r">Après restauration (1997)</span>
  <div class="handle"></div>
  <input type="range" min="0" max="100" value="92" aria-label="Faire glisser pour comparer les Bains du Broca en 1975 et après leur restauration">
</div>"""


POSTMARK = """<svg class="postmark" viewBox="0 0 120 120" aria-hidden="true" style="{s}"><g fill="none" stroke="currentColor" stroke-width="3"><circle cx="60" cy="60" r="50"/><circle cx="60" cy="60" r="38"/><path d="M10 60h100" stroke-width="2"/></g><text x="60" y="44" text-anchor="middle" font-family="serif" font-size="13" fill="currentColor" font-weight="700">GAN</text><text x="60" y="80" text-anchor="middle" font-family="serif" font-size="11" fill="currentColor">BÉARN</text></svg>"""

# ---------------------------------------------------------------- données
FICHES = [
    (1, "Les bains du Broca", "1-les-bains-du-broca", "bains", "Bulletin municipal de Gan, janvier 2009"),
    (2, "La vigne de Gaye et le baptême d’Henri IV", "2-la-vigne-de-gaye-et-le-baptême-d-henri-iv", "vigne", "Bulletin municipal de Gan, mai 2009"),
    (3, "Les canaux de Gan", "3-les-canaux-de-gan", "canaux", "Bulletin municipal de Gan, octobre 2009"),
    (4, "La Marbrerie", "4-la-marbrerie", "marbrerie", "Bulletin municipal de Gan, janvier 2010"),
    (5, "Pierre de Marca", "5-pierre-de-marca", "marca", "Bulletin municipal de Gan, avril 2010"),
    (6, "La scierie Bourdeu", "6-la-scierie-bourdeu", None, None),
    (7, "Le pavillon Baltard « gantois »", "7-le-pavillon-baltard-gantois", "baltard", "Bulletin municipal de Gan, janvier 2011"),
    (8, "La Tuilerie", "8-la-tuilerie", "tuilerie", "Bulletin municipal de Gan, mai 2011"),
    (9, "Louis Bidau", "9-louis-bidau", None, None),
    (10, "Le choléra en 1855", "10-le-choléra-en-1855", None, None),
    (11, "La Miellerie Michaud", "11-la-miellerie-michaud", None, None),
    (12, "Le Dr Pierre Baudot", "12-le-dr-pierre-baudot", None, None),
    (13, "Le commandant Cazendres", "13-le-commandant-cazendres", None, None),
    (14, "Les Castors", "14-les-castors", None, None),
    (15, "Gan et la guerre 1914-18", "15-gan-et-la-guerre-1914-18", "guerre", "Bulletin municipal de Gan, décembre 2014"),
    (16, "L’École de Gan-Larrouy", "16-l-ecole-de-gan-larrouy", None, None),
    (17, "La maison d’Andoins (1593)", "17-la-maison-d-andoins-1593", "andoins", "Bulletin municipal de Gan, juin 2016"),
    (18, "Pierre Emmanuel", "18-pierre-emmanuel", "emmanuel", "Bulletin municipal de Gan, juin 2017"),
    (19, "Les Filtres de Guindalos", "19-les-filtres-de-guindalos", None, None),
    (20, "La ferme-école Tolou", "20-la-ferme-école-tolou", None, None),
    (21, "La boulangerie Anglade-Chabat", "21-la-boulangerie-anglade-chabat", None, None),
    (22, "Inondations du 21 juin 1932", "22-inondations-du-21-juin-1932", None, None),
    (23, "Le Gan-Olympique et sa cavalcade", "23-le-gan-olympique-et-sa-cavalcade", "cavalcade", "Bulletin municipal de Gan, juin 2022"),
    (24, "Le chemin de fer de Pau à Bélair", "24-le-chemin-de-fer-de-pau-à-bélair", "train", "Bulletin municipal de Gan, juin 2023"),
    (25, "La place de Gan au fil des ans", "25-la-place-de-gan-au-fil-des-ans", None, None),
    (26, "La faïencerie et le moulin Bonnafon", "26-la-faïencerie-et-le-moulin-bonnafon", None, None),
    (27, "Le sanatorium du Béarn", "27-le-sanatorium-du-béarn", "sanatorium", "Bulletin municipal de Gan, juin 2025"),
]


def fiche_url(slug):
    return off(f"/gan-et-son-histoire/{slug}/")


def fiche_cards(only_with_doc=False):
    out = []
    for n, title, slug, cover, pub in FICHES:
        thumb = img(f"doc-{cover}.jpg", f"Première page de la fiche « {title} »") if cover else f"<span>{n}</span>"
        pub_txt = f"Première version : {pub}." if pub else "Fiche à lire et à télécharger sur le site de l’association."
        out.append(f"""<div class="reveal" style="--d:{(n % 3) * .08:.2f}s"><a class="doc-card" href="{fiche_url(slug)}" target="_blank" rel="noopener">
  <div class="doc-thumb">{thumb}</div>
  <div><span class="num">Fiche n° {n}</span><h3>{title}</h3><p>{pub_txt}</p></div>
</a></div>""")
    return "\n".join(out)


TIMELINE = [
    dict(year="1335", label="Naissance de la bastide", title="Gaston II de Foix-Béarn fonde la bastide de Gan",
         text="La bastide est fondée en 1335 par Gaston II de Foix-Béarn, qui lui donne le nom de Gand en souvenir de la campagne de Flandre à laquelle il avait participé. Gan devient vite un important lieu de passage de la transhumance.",
         img="img/maquette-bastide.jpg", alt="Maquette en bois de la bastide de Gan", cap="Maquette de la bastide, réalisée par Jean Boutin et Yves Coup pour l’association.", src="Wikipédia, article « Gan (Pyrénées-Atlantiques) »"),
    dict(year="1385", label="Plus grande que Pau", title="175 feux : Gan dépasse Pau",
         text="En 1385, la bastide compte 175 feux (foyers) et dépasse alors Pau en importance.", src="Wikipédia, article « Gan (Pyrénées-Atlantiques) »"),
    dict(year="XIVe", label="La porte de Gan", title="Une porte médiévale classée monument historique",
         text="La porte de la prison, qui date du XIVe siècle, a été classée monument historique en 1994.", img="img/porte-gan.jpg", alt="La porte médiévale de Gan vue depuis la rue", cap="La porte de Gan. Photo Capbourrut, Wikimedia Commons, CC BY-SA 4.0.", src="Wikipédia, article « Gan (Pyrénées-Atlantiques) »"),
    dict(year="1593", label="Maison d’Andoins", title="La maison d’Andoins, dite « maison Jeanne d’Albret »",
         text="La date de 1593 se lit sur le linteau de la porte de la tour et dans l’inscription latine gravée sur le manteau de la cheminée. Jeanne d’Albret étant morte en 1572, son nom ne vient que d’une légende, née au XIXe siècle et reprise sur les premières cartes postales de Gan.",
         img="img/andoins-aquarelle.jpg", alt="Aquarelle de la maison d’Andoins de Gan, avec sa tourelle", cap="Aquarelle de la maison d’Andoins, reproduite dans la fiche n° 17.", href=fiche_url("17-la-maison-d-andoins-1593")),
    dict(year="1594", label="Pierre de Marca", title="Naissance de Pierre de Marca",
         text="Pierre de Marca naît à Gan le 24 janvier 1594. Docteur en droit à 21 ans, président du Parlement de Navarre, auteur de l’« Histoire de Béarn », il meurt en 1662 après une carrière à la cour de Louis XIII et de Louis XIV.",
         img="img/marca-portrait.jpg", alt="Portrait gravé de Pierre de Marca", cap="Portrait gravé de Pierre de Marca (1594-1662).", href=fiche_url("5-pierre-de-marca")),
    dict(year="1748", label="Bains du Broca", title="La date 1748 gravée sur la clef de voûte",
         text="Si l’on lève les yeux à l’intérieur de la voûte des « bains romains », on lit la date de 1748. Ce n’est donc pas un vestige antique, même si les Romains étaient bien présents près de Gan : la villa gallo-romaine du « Pont d’Oly », du IVe siècle, s’élevait à Jurançon.",
         img="img/bains-1975.jpg", alt="Les bains du Broca en 1975", cap="Les Bains du Broca en 1975, avant leur restauration.", href=fiche_url("1-les-bains-du-broca")),
    dict(year="1855", label="Le choléra", title="Le choléra en 1855",
         text="Un épisode sanitaire de l’histoire de Gan, raconté dans la fiche n° 10 de l’association.", href=fiche_url("10-le-choléra-en-1855")),
    dict(year="1883", label="Le train arrive", title="Le chemin de fer de Pau à Oloron traverse Gan",
         text="Les travaux démarrent fin 1879 et la ligne est mise en service en 1883. Sur le territoire de Gan se trouvent les principaux ouvrages : pont de Baragat, tunnel du Ten, viaducs de Magendie, de Las Hies, de Cambus et de Lhoste.",
         img="img/doc-train.jpg", alt="Première page de la fiche sur le chemin de fer de Pau à Bélair", cap="Fiche n° 24, parue au Bulletin municipal de Gan en juin 2023.", href=fiche_url("24-le-chemin-de-fer-de-pau-à-bélair")),
    dict(year="1914", label="Gan et la Grande Guerre", title="Gan et la guerre de 1914-1918",
         text="Une fiche consacrée à la commune pendant la Grande Guerre, parue au Bulletin municipal de Gan en décembre 2014.", img="img/doc-guerre.jpg", alt="Première page de la fiche Gan et la guerre 1914-18", cap="Première page de la fiche n° 15.", href=fiche_url("15-gan-et-la-guerre-1914-18")),
    dict(year="1933", label="Sanatorium du Béarn", title="Le sanatorium Le Béarn ouvre à Gan",
         text="Dans les années 1930, de nombreux établissements voient le jour sur les coteaux de Jurançon et de Gan. Le sanatorium Le Béarn (1933) a été désaffecté vers 1972, puis totalement rasé en 1998-2000.", img="img/sanatorium.jpg", alt="Carte postale ancienne : l’entrée du sanatorium du Béarn à Gan", cap="Carte postale ancienne : l’entrée du sanatorium du Béarn.", href=fiche_url("27-le-sanatorium-du-béarn")),
    dict(year="1946", label="Gan-Olympique", title="Naissance du Gan-Olympique et de sa cavalcade",
         text="L’assemblée générale constitutive du club a lieu le 26 janvier 1946. Dès le 9 février, on décide de monter une cavalcade pour alimenter la trésorerie : la première a lieu le 31 mars 1946. Le premier match, le 10 février, est une victoire 5 à 3 contre Laruns.",
         img="img/rugby-1946.jpg", alt="Équipe de rugby du Gan-Olympique en 1946", cap="Match Gan-Laruns (5-3) le 10 février 1946.", href=fiche_url("23-le-gan-olympique-et-sa-cavalcade")),
    dict(year="1993", label="Les bains sauvés", title="Les Bains du Broca restaurés",
         text="En janvier 1993, Jean-Pierre Lacoste pose la dernière pierre du nouveau fronton en plein cintre, sauvant de la ruine les « bains romains ». Un bassin est aménagé en 1997.", img="img/bains-bassin.jpg", alt="Les bains du Broca restaurés, avec leur bassin", cap="Les Bains du Broca après la restauration et l’aménagement d’un bassin (1997).", href=fiche_url("1-les-bains-du-broca")),
    dict(year="1999", label="Dernière cavalcade", title="Le 1er mai 1999, la 50e cavalcade",
         text="Faute de bénévoles pour confectionner les chars et avec l’évolution des loisirs, la dernière cavalcade a lieu le 1er mai 1999, après 50 éditions. Plus de 10 000 personnes avaient applaudi les chars en 1961 et en 1965.", img="img/cavalcade-coquille.jpg", alt="Char de la coquille Saint-Jacques lors de la cavalcade de 1975", cap="Le char de la coquille Saint-Jacques, 6 avril 1975.", href=fiche_url("23-le-gan-olympique-et-sa-cavalcade")),
    dict(year="2003", label="Pavillon Baltard", title="Le pavillon Baltard « gantois »",
         text="Construit en août 2003 sur la place Henri IV, à l’entrée de Gan, il rappelle la scierie Bourdeu. Il abrite les joueurs de boules les jours de pluie et le marché de l’AMAP le mercredi soir.", img="img/baltard-hangar.jpg", alt="Le hangar de séchage des planches de la scierie Bourdeu en 1999", cap="Le hangar de séchage de la scierie Bourdeu en 1999 (photo Ariane Bruneton).", href=fiche_url("7-le-pavillon-baltard-gantois")),
]

# type: conf | visite | expo | autre
EVENTS = [
    ("2027", None, "expo", "Exposition « Fer, fonte, bois »", "Date et lieu à confirmer."),
    ("2026", "2026-10-01", "visite", "Visite : les Sentiers du Roy", ""),
    ("2026", "2026-09-24", "conf", "Conférence : L’intelligence artificielle", ""),
    ("2026", "2026-09-10", "conf", "Conférence : Deux Gantoises écrivent", ""),
    ("2026", "2026-07-02", "visite", "Visite : Vianne et Nérac", ""),
    ("2026", "2026-06-18", "conf", "Conférence : Les abeilles sauvages et les pollinisateurs", ""),
    ("2026", "2026-05-21", "conf", "Conférence : L’épopée de la mâture dans les Pyrénées béarnaises", ""),
    ("2026", "2026-04-30", "visite", "Visite : Lectoure et La Romieu", ""),
    ("2026", "2026-04-16", "visite", "Visite : la chèvrerie de Lasseube", ""),
    ("2026", "2026-04-09", "visite", "Visite : le jardin de KOFU", ""),
    ("2026", "2026-02-26", "conf", "Conférence : Le Béarn autrefois", ""),
    ("2026", "2026-02-12", "visite", "Visite : la ferme spiruline", ""),
    ("2026", None, "expo", "Exposition photographique « La neige à Gan »", ""),
    ("2025", "2025-05-17", "autre", "Concert à l’église de Gan", "Organisé avec l’Institut béarnais et gascon, entrée libre, par les Chanteurs du Faget d’Oloron."),
    ("2025", None, "expo", "Exposition photographique « Les lumières de Gan »", ""),
    ("2024", "2024-11-21", "visite", "Sortie à Rébénacq", "Maquette animée d’une papeterie et visite de l’église."),
    ("2024", "2024-11-14", "conf", "Conférence sur la tectonique des plaques et la formation des Pyrénées", "Avec présentation du gisement fossilifère de Gan."),
    ("2024", "2024-11-12", "visite", "Visite de la synagogue de Pau", ""),
    ("2024", None, "expo", "Exposition photographique « La vie quotidienne à Gan »", ""),
    ("2023", None, "expo", "Exposition photographique « Les fleurs à Gan »", ""),
    ("2022", None, "expo", "Exposition photographique « Les arbres à Gan »", ""),
    ("2021", None, "expo", "Exposition photographique « La vie sauvage à Gan »", ""),
    ("2020", None, "expo", "Exposition photographique « La vigne et le vin à Gan »", ""),
    ("2019", None, "expo", "Exposition photographique « Les routes et chemins à Gan »", ""),
    ("2018", None, "expo", "Exposition photographique « Les vieilles pierres à Gan »", ""),
    ("2017", None, "expo", "Exposition « Gan hier et aujourd’hui »", ""),
    ("2016", None, "expo", "Expositions « Gan à portée de main » et « L’eau à Gan dans tous ses états »", ""),
    ("2015", None, "expo", "Exposition « Votre vision de Gan »", ""),
    ("2013", None, "expo", "Exposition « Tuilerie et site fossilifère »", ""),
    ("2012", None, "expo", "Exposition « Fontaines et sources du Piémont béarnais »", ""),
    ("2010", None, "expo", "Exposition « 50 années de Cavalcade »", ""),
]
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
KIND_LABEL = {"conf": "Conférence", "visite": "Visite", "expo": "Exposition", "autre": "Animation"}


def fr_date(iso):
    d = datetime.date.fromisoformat(iso)
    return f"{d.day}{'er' if d.day == 1 else ''} {MOIS[d.month - 1]} {d.year}"


def ev_state(year, iso):
    if iso:
        return "upcoming" if datetime.date.fromisoformat(iso) >= TODAY else "past"
    return "upcoming" if int(year) > TODAY.year else "past"


def events_html():
    years = []
    for y, *_ in EVENTS:
        if y not in years:
            years.append(y)
    out = []
    for y in years:
        items = []
        for yy, iso, kind, title, note in EVENTS:
            if yy != y:
                continue
            when = fr_date(iso) if iso else (f"Année {yy} — date à confirmer" if ev_state(yy, iso) == "upcoming" else f"Année {yy}")
            st = ev_state(yy, iso)
            attrs = f'data-kind="{kind}" data-year="{yy}"' + (f' data-date="{iso}"' if iso else "") + f' data-state="{st}"'
            items.append(f"""<li class="ev" {attrs}>
  <div class="when"><span class="kind kind-{kind}">{KIND_LABEL[kind]}</span>{when}<span class="state">À venir</span></div>
  <div class="what">{title}</div>
  {f'<p class="small">{note}</p>' if note else ''}
</li>""")
        label = f"{y}" + (" — à venir" if int(y) > TODAY.year else "")
        out.append(f'<div class="year-block"><h3 class="year-title">{label}</h3><ul class="ev-list">{"".join(items)}</ul></div>')
    return "\n".join(out)


GALLERY = [
    # (type, groupe, fichier, légende, texte alt, crédit)
    ("lieu", "Les Bains du Broca", "bains-1975.jpg", "Les Bains du Broca en 1975, avant restauration.", "Les bains du Broca en 1975, voûte effondrée", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-ruine.jpg", "La voûte extérieure s’écroule, 1975.", "Détail de la voûte en pierre des bains du Broca, en ruine", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-1992.jpg", "Fin 1992 : l’édifice sous bâche, avant l’intervention d’urgence.", "Les bains du Broca sous bâche, fin 1992", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-chantier.jpg", "Pendant la restauration effectuée par Jean-Pierre Lacoste en 1993.", "Échafaudage autour de la voûte pendant la restauration de 1993", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-macon.jpg", "Taille des pierres du nouveau fronton.", "Un tailleur de pierre au travail", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-bassin.jpg", "Après la restauration et l’aménagement d’un bassin, 1997.", "Les bains du Broca restaurés et leur bassin", "Fiche n° 1, site de l’association"),
    ("lieu", "Les Bains du Broca", "bains-2000.jpg", "Les Bains du Broca restaurés, sous le ciel du Béarn.", "Les bains du Broca restaurés sous un ciel bleu", "Fiche n° 1, site de l’association"),
    ("lieu", "La bastide et ses monuments", "hauteurs-gan.jpg", "Depuis les hauteurs de Gan : le Pic du Midi d’Ossau et, au centre, le viaduc de Las Hies.", "Panorama sur les Pyrénées et le Pic du Midi d’Ossau depuis les hauteurs de Gan", "Photo Capbourrut, Wikimedia Commons, CC BY-SA 4.0"),
    ("lieu", "La bastide et ses monuments", "porte-gan.jpg", "La porte de Gan (XIVe siècle), classée monument historique en 1994.", "La porte médiévale de Gan", "Photo Capbourrut, Wikimedia Commons, CC BY-SA 4.0"),
    ("lieu", "La bastide et ses monuments", "mairie-gan.jpg", "La mairie de Gan, où se tiennent habituellement les expositions.", "La mairie de Gan sous un ciel bleu", "Photo Capbourrut, Wikimedia Commons, CC BY-SA 4.0"),
    ("lieu", "La bastide et ses monuments", "eglise-haut-gan.jpg", "L’église du Haut-de-Gan.", "L’église du Haut-de-Gan en pierre, avec son clocher", "Photo Jean Michel Etchecolonea, Wikimedia Commons, CC BY-SA 3.0"),
    ("lieu", "La bastide et ses monuments", "maquette-bastide.jpg", "La maquette en bois de la bastide, par Jean Boutin et Yves Coup.", "Maquette en bois de la bastide de Gan", "Association Gan Mémoire et Patrimoine"),
    ("lieu", "La maison d’Andoins et le château de Marca", "andoins-aquarelle.jpg", "La maison d’Andoins (1593), aquarelle.", "Aquarelle de la maison d’Andoins", "Fiche n° 17, site de l’association"),
    ("lieu", "La maison d’Andoins et le château de Marca", "andoins-gravure.jpg", "Dessin de Charles Houbigant, XIXe siècle, qui a lancé la légende de la « maison de Corisande ».", "Dessin ancien de la maison d’Andoins", "Fiche n° 17, site de l’association"),
    ("lieu", "La maison d’Andoins et le château de Marca", "andoins-linteau.jpg", "Le linteau de la porte de la tour : 1593.", "Linteau de pierre gravé de la date 1593", "Fiche n° 17, site de l’association"),
    ("lieu", "La maison d’Andoins et le château de Marca", "marca-chateau.jpg", "Le château où est né Pierre de Marca.", "Le château de Marca, en pierre claire, avec ses tours", "Fiche n° 5, site de l’association"),
    ("lieu", "La maison d’Andoins et le château de Marca", "marca-portrait.jpg", "Portrait gravé de Pierre de Marca (1594-1662).", "Gravure : portrait de Pierre de Marca", "Fiche n° 5, site de l’association"),
    ("lieu", "Lieux disparus ou transformés", "sanatorium.jpg", "Carte postale ancienne : l’entrée du sanatorium du Béarn.", "Carte postale ancienne du sanatorium du Béarn", "Fiche n° 27, site de l’association"),
    ("lieu", "Lieux disparus ou transformés", "baltard-hangar.jpg", "Le hangar de séchage de la scierie Bourdeu, 1999.", "Hangar de séchage de la scierie Bourdeu", "Fiche n° 7, photo Ariane Bruneton"),
    ("lieu", "Lieux disparus ou transformés", "baltard-nogent.jpg", "Le pavillon Baltard de Nogent-sur-Marne, qui a donné son nom au pavillon gantois.", "Le pavillon Baltard de Nogent-sur-Marne", "Fiche n° 7, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-foule.jpg", "« Ganach’Circus », 11 mars 1956 : l’immense foule sur la place de la mairie.", "Foule sur la place de la mairie de Gan pendant la cavalcade de 1956", "Fiche n° 23, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-sandwichs.jpg", "Les hommes-sandwichs dans les rues de Pau, 25 mars 1957.", "Gantois déguisés portant des pancartes dans les rues de Pau", "Fiche n° 23, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-provinces.jpg", "Les provinces de France, 20 mars 1955.", "Groupe en costumes régionaux", "Fiche n° 23, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-cowboys.jpg", "Les cow-boys, 11 mars 1956.", "Enfants déguisés en cow-boys sur un char", "Fiche n° 23, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-voiture.jpg", "« Edmond, il faut pousser… », 31 mars 1957 (?).", "Vieille automobile poussée par des participants", "Fiche n° 23, site de l’association"),
    ("evenement", "La Cavalcade de Gan (1946-1999)", "cavalcade-coquille.jpg", "La coquille Saint-Jacques, 6 avril 1975.", "Char rose en forme de coquille Saint-Jacques", "Fiche n° 23, site de l’association"),
    ("evenement", "Le Gan-Olympique", "rugby-1946.jpg", "Match Gan-Laruns (5-3), 10 février 1946.", "Équipe de rugby du Gan-Olympique en 1946", "Fiche n° 23, site de l’association"),
]


def gallery_html():
    groups = []
    for t, g, *_ in GALLERY:
        if (t, g) not in groups:
            groups.append((t, g))
    out = []
    n = 0
    for t, g in groups:
        items = []
        for tt, gg, f, cap, alt, cred in GALLERY:
            if (tt, gg) != (t, g):
                continue
            w, h = dims(f)
            items.append(f"""<button type="button" class="gal-item" data-full="img/{f}" data-cap="{e(cap)}" data-alt="{e(alt)}" data-credit="{e(cred)}">
  <img src="img/{f}" alt="{e(alt)}" width="{w}" height="{h}" loading="lazy" decoding="async"><span>{cap}</span></button>""")
        label = {"lieu": "Lieu", "evenement": "Événement"}[t]
        out.append(f'<section class="gal-group" data-type="{t}" aria-label="{e(g)}"><h3><small>{label}</small> {g}</h3><div class="gal-grid">{"".join(items)}</div></section>')
    out.append("""<section class="gal-group" data-type="exposition" aria-label="Expositions photographiques"><h3><small>Exposition</small> Les expositions photographiques</h3>
<div class="placeholder"><strong>Photos à ajouter.</strong> Chaque année depuis 2010, l’association présente une exposition (« La neige à Gan », « Les lumières de Gan », « La vie quotidienne à Gan »…). Les clichés exposés pourront être rassemblés ici, exposition par exposition, avec l’accord de leurs auteurs. <em>[Texte d’attente à modifier]</em></div></section>""")
    return "\n".join(out)


def write(name, content):
    with open(os.path.join(OUT, name), "w", encoding="utf8") as f:
        f.write(content)
    print("écrit", name, len(content) // 1024, "ko")


# ================================================================ PAGES
def page_index():
    hero = f"""<section class="hero">
  <div class="hero-bg">{img("hauteurs-gan.jpg", "Panorama sur la chaîne des Pyrénées et le Pic du Midi d’Ossau depuis les hauteurs de Gan", lazy=False)}</div>
  <div class="wrap"><div class="hero-inner">
    <span class="eyebrow fade-up">Association loi 1901 · Gan, Béarn</span>
    <h1><span class="hero-title-line"><span>Gan</span></span><span class="hero-title-line"><span><em>Mémoire</em> et Patrimoine</span></span></h1>
    <p class="lead fade-up d2">Faire connaître et mettre en valeur le patrimoine historique, géographique et culturel de Gan : une bastide béarnaise née en 1335, face aux Pyrénées.</p>
    <div class="btn-row fade-up d3">
      <a class="btn" href="histoire-patrimoine.html">Découvrir l’histoire de Gan {ARROW}</a>
      <a class="btn btn--outline-light" href="adherer-contact.html">Rejoindre l’association</a>
    </div>
  </div></div>
  <p class="hero-caption">Depuis les hauteurs de Gan, le Pic du Midi d’Ossau. Photo Capbourrut, Wikimedia Commons (CC BY-SA 4.0).</p>
  <span class="scroll-cue" aria-hidden="true"></span>
</section>"""

    previews = [
        ("association.html", "maquette-bastide.jpg", "Maquette en bois de la bastide", "L’association", "Qui nous sommes", "Une association de passionnés, des missions simples : visiter, raconter, exposer, transmettre.", "Découvrir l’association"),
        ("histoire-patrimoine.html", "porte-gan.jpg", "La porte médiévale de Gan", "Histoire &amp; patrimoine", "De 1335 à nos jours", "Une frise à parcourir, des monuments, des figures marquantes et 27 fiches illustrées.", "Explorer l’histoire"),
        ("memoire-temoignages.html", "cavalcade-foule.jpg", "La foule de la cavalcade de Gan en 1956", "Mémoire &amp; témoignages", "Souvenirs et archives", "La cavalcade, les photographies anciennes, les documents d’archives et vos souvenirs.", "Entrer dans la mémoire"),
        ("evenements.html", "mairie-gan.jpg", "La mairie de Gan", "Expositions, conférences &amp; visites", "Le programme", "Chaque année : expositions, conférences et visites guidées, et les archives des rendez-vous passés.", "Voir le programme"),
        ("publications.html", "andoins-aquarelle.jpg", "Aquarelle de la maison d’Andoins", "Publications &amp; ressources", "À lire et à télécharger", "Les fiches parues au Bulletin municipal, le bulletin d’adhésion et des liens utiles.", "Consulter les ressources"),
        ("galerie.html", "bains-bassin.jpg", "Les Bains du Broca restaurés", "Galerie", "Photos par lieu et par événement", "Les Bains du Broca, la maison d’Andoins, la cavalcade… à regarder en grand.", "Ouvrir la galerie"),
    ]
    cards = ""
    for i, (href, im, alt, tag, ttl, txt, cta) in enumerate(previews):
        cards += f"""<div class="reveal" style="--d:{(i % 3) * .1:.1f}s"><a class="card-link" href="{href}"><article class="card">
  <div class="card-img">{img(im, alt)}</div>
  <div class="card-body"><span class="tag">{tag}</span><h3>{ttl}</h3><p>{txt}</p><span class="link-arrow">{cta} {ARROW}</span></div>
</article></a></div>"""

    body = f"""
<section class="section">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Notre mission</span>
      <h2>Que vivent la mémoire et le patrimoine de Gan</h2>
      <p class="lead">Nichée entre deux coteaux verdoyants, le long d’une rivière « parfois capricieuse », Gan a le Pic du Midi d’Ossau pour décor et Pau pour voisine.</p>
      <p>Notre association fait connaître et met en valeur le patrimoine historique, géographique et culturel de la commune, puis, plus largement, de l’environnement proche : le Béarn, le Pays basque et le versant espagnol des Pyrénées.</p>
      <p><strong>Comment ?</strong> Par des visites guidées, des conférences sur les thèmes locaux, des expositions et des animations. Tout le monde est le bienvenu.</p>
      <a class="btn btn--green" href="association.html">En savoir plus {ARROW}</a>
    </div>
    <figure class="print reveal-right">
      {img("maquette-bastide.jpg", "Maquette en bois de la bastide de Gan : maisons, rues, tours et fossés")}
      <figcaption>La bastide de Gan en maquette, œuvre de Jean Boutin et Yves Coup. Elle sert à présenter la bastide aux enfants avant de leur faire visiter la ville.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--green" aria-label="Quelques repères">
  <div class="wrap">
    <div class="stats">
      <div class="stat reveal"><b data-count="1335">1335</b><span>naissance de la bastide, fondée par Gaston II de Foix-Béarn</span></div>
      <div class="stat reveal" style="--d:.1s"><b data-count="27">27</b><span>fiches d’histoire locale rédigées et illustrées</span></div>
      <div class="stat reveal" style="--d:.2s"><b data-count="16">16</b><span>expositions présentées entre 2010 et 2026</span></div>
      <div class="stat reveal" style="--d:.3s"><b data-count="2008">2008</b><span>première année de conférences archivée sur notre site</span></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    {section_head("Le site en un coup d’œil", "Six portes pour entrer dans Gan", "Choisissez la rubrique qui vous attire : chaque bouton mène à une page détaillée.", True)}
    <div class="grid grid-3">{cards}</div>
  </div>
</section>

<section class="section section--stone">
  <div class="wrap split rev">
    <div class="reveal-left">
      {compare_block()}
      <p class="small" style="margin-top:.8rem">Faites glisser la poignée. Photos : fiche n° 1 de l’association.</p>
    </div>
    <div class="reveal-right">
      <span class="eyebrow">Avant / après</span>
      <h2>Les Bains du Broca, sauvés de la ruine</h2>
      <p class="lead">En 1975, la voûte extérieure commence à s’écrouler. En janvier 1993, Jean-Pierre Lacoste pose la dernière pierre du nouveau fronton.</p>
      <p>Ces « bains romains » datent en réalité de 1748, date gravée sur leur clef de voûte. Aujourd’hui restaurés, ils se visitent en contrebas de l’avenue des Pyrénées.</p>
      <a class="btn btn--green" href="histoire-patrimoine.html#avant-apres">Toute l’histoire des bains {ARROW}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    {section_head("Prochain rendez-vous", "À noter dans votre agenda")}
    <!-- À MODIFIER : prochain événement (voir aussi la page « Expositions, conférences & visites ») -->
    <article class="event-card reveal">
      <div class="event-date"><span class="y">2027</span><span class="m">Exposition</span></div>
      <div class="event-info">
        <h3>« Fer, fonte, bois »</h3>
        <p>La prochaine exposition de l’association est annoncée pour 2027. Les expositions se tiennent habituellement à la mairie de Gan ; pour confirmer l’accès, appelez la mairie au 05&nbsp;59&nbsp;21&nbsp;61&nbsp;31.</p>
        <p class="placeholder"><strong>Dates et horaires à confirmer.</strong> <em>[Texte d’attente à modifier dès que le calendrier est connu.]</em></p>
        <a class="link-arrow" href="evenements.html">Voir tout le programme {ARROW}</a>
      </div>
    </article>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="cta-band reveal">
      <span class="eyebrow">Rejoignez-nous</span>
      <h2>Gan a besoin de vos souvenirs et de votre curiosité</h2>
      <p>Adhérer, venir à une conférence, confier une vieille photographie ou raconter un souvenir : chacun peut aider à garder vivante la mémoire de Gan.</p>
      <div class="btn-row">
        <a class="btn btn--light" href="adherer-contact.html#adhesion">Adhérer à l’association {ARROW}</a>
        <a class="btn btn--outline-light" href="adherer-contact.html#temoigner">Apporter un témoignage</a>
      </div>
    </div>
  </div>
</section>
"""
    ld = {
        "@context": "https://schema.org", "@type": "Organization", "name": NAME,
        "description": "Association de sauvegarde et de valorisation de la mémoire et du patrimoine de Gan (Pyrénées-Atlantiques).",
        "email": EMAIL, "address": {"@type": "PostalAddress", "streetAddress": "2 rue Pierre de Marca", "postalCode": "64290", "addressLocality": "Gan", "addressCountry": "FR"},
    }
    extra = f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>'
    write("index.html", layout("index.html", "Accueil", "Gan Mémoire et Patrimoine : association pour faire connaître et mettre en valeur le patrimoine historique, géographique et culturel de Gan (Béarn). Histoire, expositions, conférences, visites.", body, hero, extra_head=extra, is_home=True))


def page_association():
    hero = page_hero("L’association", "L’association", "Des Gantois et des amis de Gan, réunis pour faire connaître et aimer le patrimoine de leur commune.", "maquette-bastide.jpg", "center 55%")
    pr = "".join(f"""<div class="reveal" style="--d:{i * .08:.2f}s"><div class="value"><h3>{t}</h3><p>{p}</p></div></div>""" for i, (t, p) in enumerate([
        ("Transmettre", "Des ateliers pour les jeunes depuis 2011, une maquette de la bastide pour expliquer Gan aux enfants avant de leur faire visiter la ville."),
        ("Documenter", "27 fiches d’histoire locale, d’abord parues au Bulletin municipal de Gan, puis mises à disposition de tous sur notre site."),
        ("Partager", "Des conférences, des visites guidées et une exposition chaque année : le patrimoine se découvre mieux ensemble."),
        ("S’ouvrir", "Du Béarn au Pays basque et jusqu’au versant espagnol des Pyrénées : notre regard ne s’arrête pas aux limites de la commune."),
    ]))
    acts = "".join(f"""<div class="reveal" style="--d:{i * .08:.2f}s"><article class="card"><div class="card-body"><h3>{t}</h3><p>{p}</p></div></article></div>""" for i, (t, p) in enumerate([
        ("Visites guidées", "Menées par des professionnels ou des amateurs éclairés : ferme, jardin, villes et villages du Béarn et des alentours (archives depuis 2009)."),
        ("Conférences", "Sur des thèmes locaux : histoire, nature, métiers d’autrefois, écriture… (archives depuis 2008)."),
        ("Expositions", "Chaque année, une exposition de photographies centrées sur Gan, ouverte aux adhérents et aux habitants, « sans esprit de concurrence »."),
        ("Ateliers jeunes", "Des ateliers pour faire découvrir le patrimoine local aux enfants, notamment autour du bois du Brougnat et des Bains du Broca."),
        ("Randonnées", "Plus de 60 itinéraires décrits et classés par distance, à retrouver sur le site historique de l’association."),
        ("Culture béarnaise", "Cours, danse, cantère (chants) et traditions : la langue et la culture du Béarn ont aussi leur place."),
    ]))
    body = f"""
<section class="section">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Présentation</span>
      <h2>Une vitrine et une mémoire</h2>
      <p class="lead">Gan Mémoire et Patrimoine est une association de Gan (Pyrénées-Atlantiques), à quelques kilomètres de Pau, au cœur du vignoble du Jurançon.</p>
      <p>Son but : <strong>faire connaître et mettre en valeur le patrimoine historique, géographique et culturel de la ville de Gan</strong>, puis, plus largement, l’environnement proche en Béarn, au Pays basque et sur le versant espagnol des Pyrénées.</p>
      <p>Elle y travaille par des visites guidées, des conférences, des expositions et des animations diverses.</p>
    </div>
    <div class="reveal-right">
      <blockquote class="quote">« La vitrine et la mémoire de notre association. »<cite>Ainsi se présente le site historique de l’association</cite></blockquote>
      <div style="height:1.6rem"></div>
      <figure class="print r2">{img("mairie-gan.jpg", "La mairie de Gan")}<figcaption>La mairie de Gan : on y organise habituellement les expositions.</figcaption></figure>
    </div>
  </div>
</section>

<section class="section section--stone">
  <div class="wrap">
    {section_head("Missions &amp; actions", "Ce que nous faisons, toute l’année", "", True)}
    <div class="grid grid-3">{acts}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    {section_head("Nos valeurs", "Quatre engagements qui guident nos activités", "Ils se lisent dans ce que l’association fait depuis plus de quinze ans.", True)}
    <div class="grid grid-4">{pr}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Notre histoire</span>
      <h2>Quelques repères</h2>
      <p>L’association est active depuis au moins 2008 : c’est l’année de la première assemblée générale et de la première conférence archivées sur son site.</p>
      <div class="placeholder"><strong>Date de fondation à confirmer.</strong> Les registres consultés donnent des indications divergentes ; le texte retracera ici la création de l’association dès qu’elle sera confirmée par le bureau. <em>[Texte d’attente à modifier]</em></div>
    </div>
    <ul class="facts reveal-right">
      <li><b>2008</b><span>Première assemblée générale et première conférence archivées.</span></li>
      <li><b>2009</b><span>Premières visites archivées ; début de la série de fiches « Gan et son histoire » au Bulletin municipal.</span></li>
      <li><b>2010</b><span>Première exposition archivée : « 50 années de Cavalcade ».</span></li>
      <li><b>2011</b><span>Premiers ateliers pour les jeunes archivés (bois du Brougnat).</span></li>
      <li><b>2020</b><span>Dernière déclaration de modification en préfecture (15 décembre).</span></li>
      <li><b>2025</b><span>27ᵉ fiche d’histoire : « Le sanatorium du Béarn ».</span></li>
    </ul>
  </div>
</section>

<section class="section" id="bureau">
  <div class="wrap">
    {section_head("Le bureau", "Une équipe de neuf membres", "Le bureau de l’association est composé de neuf membres.", True)}
    <div class="grid grid-3" style="max-width:900px;margin-inline:auto">
      <div class="person reveal"><div class="avatar">DT</div><h3>Daniel Trallero</h3><p>Président<br><a href="mailto:{EMAIL}">{EMAIL}</a></p></div>
      <div class="reveal" style="grid-column: span 2"><div class="placeholder"><strong>Autres membres du bureau : noms et fonctions à compléter.</strong> Les huit autres membres figurent sur la <a href="{off('/l-association/bureau/')}" target="_blank" rel="noopener">page « Bureau » du site historique</a>. <em>[Texte d’attente à modifier]</em><br><br>Membres d’honneur, statuts, règlement intérieur et comptes rendus d’assemblées générales : <a href="{off('/l-association/')}" target="_blank" rel="noopener">voir la rubrique « L’association »</a>.</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="cta-band reveal">
      <span class="eyebrow">Nous rejoindre</span>
      <h2>Vous aimez Gan ? Venez nous le dire.</h2>
      <p>Les nouveaux membres sont les bienvenus. Il suffit de remplir le bulletin d’adhésion.</p>
      <div class="btn-row"><a class="btn btn--light" href="adherer-contact.html#adhesion">Adhérer {ARROW}</a></div>
    </div>
  </div>
</section>
"""
    write("association.html", layout("association.html", "L’association", "Présentation de l’association Gan Mémoire et Patrimoine : missions, actions, valeurs, repères historiques et bureau.", body, hero))


def page_histoire():
    hero = page_hero("Histoire &amp; patrimoine", "Histoire &amp; patrimoine", "De la bastide fondée en 1335 aux lieux que nous croisons chaque jour : un voyage dans le temps, à votre rythme.", "porte-gan.jpg", "center 40%")
    tl = f"""<script type="application/json" id="tl-data">{json.dumps(TIMELINE, ensure_ascii=False)}</script>"""
    lieux = [
        ("porte-gan.jpg", "La porte de Gan", "XIVe siècle", "La porte de la prison date du XIVe siècle et a été classée monument historique en 1994.", "La porte médiévale de Gan", None),
        ("andoins-aquarelle.jpg", "La maison d’Andoins", "1593", "L’une des trois belles maisons du XVIe siècle à tourelle et escalier en vis de la bastide. On l’appelle à tort « maison Jeanne d’Albret » : la date de 1593 est gravée sur le linteau.", "Aquarelle de la maison d’Andoins", fiche_url("17-la-maison-d-andoins-1593")),
        ("marca-chateau.jpg", "Le château de Marca", "Avant 1600", "Maison natale de Pierre de Marca, l’enfant le plus illustre de Gan.", "Le château où est né Pierre de Marca", fiche_url("5-pierre-de-marca")),
        ("bains-bassin.jpg", "Les Bains du Broca", "1748", "Des « bains romains » qui ne le sont pas : la date de 1748 est gravée sur la clef de voûte. Sauvés en 1993, ils se visitent en contrebas de l’avenue des Pyrénées.", "Les bains du Broca restaurés et leur bassin", fiche_url("1-les-bains-du-broca")),
        ("eglise-haut-gan.jpg", "L’église du Haut-de-Gan", "1838", "L’église Saint-Pierre du Haut-de-Gan date de 1838, mais elle est attestée dès 1759. L’église Saint-Barthélemy se trouve, elle, dans le bourg.", "L’église du Haut-de-Gan", None),
        ("baltard-hangar.jpg", "Le pavillon Baltard « gantois »", "2003", "Une petite halle de fer bâtie place Henri IV, en souvenir de la scierie Bourdeu dont elle reprend la charpente métallique.", "Le hangar de séchage de la scierie Bourdeu en 1999", fiche_url("7-le-pavillon-baltard-gantois")),
    ]
    lcards = "".join(f"""<div class="reveal" style="--d:{(i % 3) * .1:.1f}s"><article class="card"><div class="card-img">{img(im, alt)}</div>
<div class="card-body"><span class="tag">{when}</span><h3>{t}</h3><p>{p}</p>{f'<a class="link-arrow" href="{h}" target="_blank" rel="noopener">Lire la fiche {ARROW}</a>' if h else ''}</div></article></div>""" for i, (im, t, when, p, alt, h) in enumerate(lieux))

    body = f"""
<section class="section">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Gan, bastide du Béarn</span>
      <h2>Une « ville neuve » baptisée en souvenir de Gand</h2>
      <p class="lead">La bastide a été fondée en 1335 par Gaston II de Foix-Béarn, qui lui donna le nom de la ville de Flandre dont il gardait le souvenir.</p>
      <p>Gan devint vite un important lieu de passage de la transhumance. En 1385, elle comptait 175 feux et dépassait alors Pau en importance. Aujourd’hui, la commune compte un peu plus de 5&nbsp;600 habitants et fait partie des zones d’appellation du vignoble du Jurançon et de l’AOC Béarn.</p>
      <p class="small">Sources : Wikipédia (article « Gan (Pyrénées-Atlantiques) ») et fiches de l’association.</p>
    </div>
    <figure class="print reveal-right">{img("hauteurs-gan.jpg", "Panorama sur les Pyrénées et le Pic du Midi d’Ossau depuis les hauteurs de Gan")}<figcaption>Le Pic du Midi d’Ossau, depuis les hauteurs de Gan. Photo Capbourrut, Wikimedia Commons, CC BY-SA 4.0.</figcaption></figure>
  </div>
</section>

<section class="section section--stone" id="frise">
  <div class="wrap">
    {section_head("Frise chronologique", "Parcourez les siècles", "Touchez une date pour découvrir ce qui s’est passé à Gan. Vous pouvez aussi utiliser les flèches du clavier ou les boutons « Précédent » et « Suivant ».", False)}
    <div class="timeline">
      <div class="tl-track-wrap"><div class="tl-track" aria-label="Dates de l’histoire de Gan"></div></div>
      <div class="tl-panel" id="tl-panel" role="tabpanel" aria-live="polite"></div>
      <div class="tl-nav">
        <button class="btn btn--ghost" id="tl-prev" type="button">← Précédent</button>
        <button class="btn btn--green" id="tl-next" type="button">Suivant →</button>
        <span class="tl-count" id="tl-count" aria-hidden="true"></span>
      </div>
      <noscript><p class="placeholder">La frise interactive nécessite JavaScript. Les fiches complètes sont disponibles plus bas sur cette page.</p></noscript>
    </div>
    {tl}
  </div>
</section>

<section class="section" id="avant-apres">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Avant / après</span>
      <h2>Les Bains du Broca : retour aux sources</h2>
      <p class="lead">« Lorsqu’en janvier 1993, Jean-Pierre Lacoste immobilisa la dernière pierre tout en haut du nouveau fronton en plein-cintre, il ne pensa peut-être pas que ces mêmes gestes avaient déjà été exécutés plus de deux siècles avant lui par un autre artisan-maçon de Gan. »</p>
      <p class="small">Fiche n° 1 de l’association, par Daniel Trallero. Depuis 1975, la voûte extérieure s’était mise à s’écrouler ; la restauration a été menée en urgence pendant l’hiver 1992-1993.</p>
      <a class="link-arrow" href="{fiche_url('1-les-bains-du-broca')}" target="_blank" rel="noopener">Lire la fiche complète {ARROW}</a>
    </div>
    <div class="reveal-right">{compare_block()}<p class="small" style="margin-top:.8rem">Faites glisser la poignée (ou utilisez les flèches du clavier).</p></div>
  </div>
</section>

<section class="section section--paper2" id="lieux">
  <div class="wrap">
    {section_head("Lieux &amp; monuments remarquables", "Ce que l’on peut voir à Gan", "Six lieux à repérer lors d’une promenade.", True)}
    <div class="grid grid-3">{lcards}</div>
    <div class="reveal" style="margin-top:2.4rem"><div class="placeholder"><strong>D’autres lieux à venir :</strong> la Marbrerie, la Tuilerie, les canaux, la faïencerie et le moulin Bonnafon, la ferme-école Tolou… Chacun a sa fiche ci-dessous. <em>[Rubrique à compléter avec l’association]</em></div></div>
  </div>
</section>

<section class="section" id="personnages">
  <div class="wrap">
    {section_head("Personnages", "Ceux qui ont fait parler de Gan", "", True)}
    <div class="grid grid-2">
      <div class="reveal-left"><article class="card"><div class="card-img" style="aspect-ratio:16/10">{img("marca-portrait.jpg", "Portrait gravé de Pierre de Marca", style="object-fit:contain;background:#efe3c8")}</div><div class="card-body"><span class="tag">1594 – 1662</span><h3>Pierre de Marca</h3><p>Né à Gan le 24 janvier 1594, docteur à 21 ans, président du Parlement de Navarre, il écrit l’« Histoire de Béarn », référence encore aujourd’hui sur le Béarn avant le XIVe siècle. Conseiller d’État de Louis XIII en 1640, il choisit ensuite la carrière ecclésiastique et devient archevêque. Il parlait le latin, le grec, l’espagnol, le béarnais et plus tard le catalan.</p><a class="link-arrow" href="{fiche_url('5-pierre-de-marca')}" target="_blank" rel="noopener">Lire la fiche {ARROW}</a></div></article></div>
      <div class="reveal-right"><article class="card"><div class="card-img" style="aspect-ratio:16/10">{img("doc-emmanuel.jpg", "Première page de la fiche consacrée à Pierre Emmanuel", style="object-position:top")}</div><div class="card-body"><span class="tag">1916 – 1984</span><h3>Pierre Emmanuel</h3><p>Le poète est né Noël Mathieu à Gan, le 3 mai 1916. « Gan, à huit kilomètres de Pau, est un gros bourg entouré de collines », écrivait-il ; « tout cela se retrouve dans mes livres ». Notre fiche n° 18, « De Noël Mathieu à Pierre Emmanuel », revient sur ses racines gantoises.</p><a class="link-arrow" href="{fiche_url('18-pierre-emmanuel')}" target="_blank" rel="noopener">Lire la fiche {ARROW}</a></div></article></div>
    </div>
    <div class="reveal" style="margin-top:2rem"><p><strong>Autres figures à découvrir dans les fiches :</strong> Henri IV et la vigne de Gaye (n° 2), Louis Bidau (n° 9), le Dr Pierre Baudot (n° 12), le commandant Cazendres (n° 13). Parmi les personnalités nées ou attachées à Gan, on compte aussi l’écrivaine Paule Constant, prix Goncourt 1998.</p></div>
  </div>
</section>

<section class="section section--stone" id="fiches">
  <div class="wrap">
    {section_head("Fiches illustrées", "« Gan et son histoire » : 27 fiches à lire", "Textes parus ou inédits sur différents thèmes de l’histoire de Gan. Chaque fiche s’ouvre sur le site de l’association, où elle se lit à l’écran ou se télécharge en PDF.", True)}
    <div class="grid grid-3">{fiche_cards()}</div>
  </div>
</section>
"""
    write("histoire-patrimoine.html", layout("histoire-patrimoine.html", "Histoire & patrimoine", "L’histoire de Gan (Béarn) en une frise interactive : bastide de 1335, monuments, personnages et 27 fiches illustrées de l’association Gan Mémoire et Patrimoine.", body, hero))


def page_memoire():
    hero = page_hero("Mémoire &amp; témoignages", "Mémoire &amp; témoignages", "Photographies anciennes, documents d’archives et souvenirs d’habitants : ce que Gan se raconte.", "cavalcade-foule.jpg", "center 40%")
    body = f"""
<section class="section">
  <div class="wrap narrow reveal">
    <span class="eyebrow">Les souvenirs d’un village</span>
    <h2>La mémoire se transmet de main en main</h2>
    <p class="lead">Un village, c’est aussi ce que ses habitants s’en racontent : les fêtes, les métiers, les inondations, les écoles, les équipes de rugby. L’association collecte, classe et partage ces souvenirs.</p>
  </div>
</section>

<section class="section section--stone" id="cavalcade">
  <div class="wrap">
    {section_head("Un souvenir partagé", "La cavalcade de Gan, 1946-1999", "Cinquante éditions d’un défilé de chars qui attirait la foule de toute la vallée.", False)}
    <div class="split">
      <div class="reveal-left">
        <p>Tout commence en 1946, avec la création du Gan-Olympique. Dès le 9 février, avant même le premier match, les dirigeants décident de monter une cavalcade pour alimenter la trésorerie du club. La première a lieu le 31 mars 1946, et c’est un beau succès populaire.</p>
        <p>Après une interruption de 1951 à 1953, la cavalcade réapparaît en 1954. L’entrée devient payante en 1956. Plus de <strong>10&nbsp;000 personnes</strong> viennent applaudir les chars en 1961 et en 1965 ; des navettes en bus sont organisées de 1955 à 1975 pour désengorger la route de Pau.</p>
        <p>Les derniers temps, il devient difficile de trouver des bénévoles pour confectionner les chars. La dernière cavalcade a lieu le <strong>1er mai 1999</strong>, pour la 50e édition.</p>
        <p class="small">D’après la fiche n° 23, par Daniel Trallero (Bulletin municipal de Gan, juin 2022).</p>
        <a class="link-arrow" href="{fiche_url('23-le-gan-olympique-et-sa-cavalcade')}" target="_blank" rel="noopener">Lire la fiche complète {ARROW}</a>
      </div>
      <div class="reveal-right" style="position:relative">
        <figure class="print">{img("cavalcade-foule.jpg", "Foule sur la place de la mairie de Gan lors de la cavalcade du 11 mars 1956")}<figcaption>« Ganach’Circus », 11 mars 1956 : au micro, Laurent Castagné, et toujours l’immense foule qui envahit la place de la mairie.</figcaption></figure>
      </div>
    </div>
    <div class="grid grid-3" style="margin-top:3.4rem">
      <figure class="print r2 reveal">{img("cavalcade-sandwichs.jpg", "Hommes-sandwichs déguisés dans les rues de Pau")}<figcaption>Les hommes-sandwichs à Pau, 25 mars 1957.</figcaption></figure>
      <figure class="print r3 reveal" style="--d:.1s">{img("cavalcade-cowboys.jpg", "Enfants en cow-boys sur un char")}<figcaption>Les cow-boys, 11 mars 1956.</figcaption></figure>
      <figure class="print r4 reveal" style="--d:.2s">{img("cavalcade-coquille.jpg", "Char rose en forme de coquille Saint-Jacques")}<figcaption>La coquille Saint-Jacques, 6 avril 1975.</figcaption></figure>
    </div>
    <p class="reveal" style="margin-top:2rem;text-align:center"><a class="btn btn--green" href="galerie.html#evenement">Toutes les photos de la cavalcade {ARROW}</a></p>
  </div>
</section>

<section class="section" id="archives">
  <div class="wrap">
    {section_head("Documents d’archives", "Cartes postales, photographies, articles", "Les fiches de l’association reproduisent des documents rares. En voici quelques-uns.", True)}
    <div class="grid grid-3">
      <figure class="print reveal">{img("sanatorium.jpg", "Carte postale ancienne : l’entrée du sanatorium du Béarn à Gan")}<figcaption>Carte postale : l’entrée du sanatorium du Béarn, au-dessus du rond-point d’entrée nord de Gan. Rasé en 1998-2000.</figcaption></figure>
      <figure class="print r2 reveal" style="--d:.1s">{img("rugby-1946.jpg", "L’équipe de rugby du Gan-Olympique, 10 février 1946")}<figcaption>L’équipe du Gan-Olympique, match Gan-Laruns (5-3), 10 février 1946.</figcaption></figure>
      <figure class="print r3 reveal" style="--d:.2s">{img("andoins-gravure.jpg", "Dessin ancien de la maison d’Andoins par Charles Houbigant")}<figcaption>La maison d’Andoins vue par Charles Houbigant, lors de ses voyages en Béarn (1841-1855).</figcaption></figure>
    </div>
    <div class="grid grid-3" style="margin-top:2.6rem">
      <a class="doc-card reveal" href="{fiche_url('15-gan-et-la-guerre-1914-18')}" target="_blank" rel="noopener"><div class="doc-thumb">{img('doc-guerre.jpg', 'Fiche Gan et la guerre 1914-18')}</div><div><span class="num">Fiche n° 15</span><h3>Gan et la guerre 1914-18</h3><p>Les Gantois dans la Grande Guerre.</p></div></a>
      <a class="doc-card reveal" href="{fiche_url('22-inondations-du-21-juin-1932')}" target="_blank" rel="noopener"><div class="doc-thumb"><span>22</span></div><div><span class="num">Fiche n° 22</span><h3>Inondations du 21 juin 1932</h3><p>Quand la rivière « parfois capricieuse » sort de son lit.</p></div></a>
      <a class="doc-card reveal" href="{OFF}/photos-de-classe/" target="_blank" rel="noopener"><div class="doc-thumb"><span>📷</span></div><div><span class="num">Rubrique</span><h3>Photos de classe</h3><p>Retrouvez-vous (ou vos parents) sur les bancs de l’école.</p></div></a>
    </div>
  </div>
</section>

<section class="section section--paper2" id="recits">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Récits d’habitants</span>
      <h2>Vos souvenirs ont leur place ici</h2>
      <p class="lead">Les conférences « Le Béarn autrefois » (26 février 2026) et « Deux Gantoises écrivent » (10 septembre 2026) ont montré combien les souvenirs et les écrits des habitants passionnent.</p>
      <div class="placeholder"><strong>Témoignages à publier.</strong> Aucun récit d’habitant n’est encore publié en ligne sur ce site. Les premiers témoignages recueillis, avec l’accord de leurs auteurs, seront présentés ici. <em>[Texte d’attente à modifier]</em></div>
    </div>
    <div class="reveal-right">
      <h3>Comment participer ?</h3>
      <ul>
        <li>Racontez un souvenir de Gan, par écrit ou de vive voix.</li>
        <li>Confiez des photographies, cartes postales ou documents : ils pourront être copiés et rendus.</li>
        <li>Identifiez des personnes ou des lieux sur nos photos anciennes.</li>
      </ul>
      <p><a class="btn" href="adherer-contact.html#temoigner">Apporter mon témoignage {ARROW}</a></p>
    </div>
  </div>
</section>
"""
    write("memoire-temoignages.html", layout("memoire-temoignages.html", "Mémoire & témoignages", "Souvenirs d’habitants, cavalcade de Gan, cartes postales et documents d’archives : la mémoire vivante de Gan, collectée par l’association Gan Mémoire et Patrimoine.", body, hero))


def page_evenements():
    hero = page_hero("Expositions, conférences &amp; visites", "Expositions, conférences &amp; visites", "Le programme de l’association et les archives des rendez-vous passés.", "mairie-gan.jpg", "center 45%")
    chips = "".join(f'<button type="button" class="chip" data-ev-filter="{k}" aria-pressed="{"true" if k == "all" else "false"}">{l}</button>' for k, l in [("all", "Tout"), ("conf", "Conférences"), ("visite", "Visites"), ("expo", "Expositions"), ("autre", "Autres animations")])
    body = f"""
<section class="section">
  <div class="wrap">
    <div class="split">
      <div class="reveal-left">
        <span class="eyebrow">Au programme</span>
        <h2>Un rendez-vous tout au long de l’année</h2>
        <p class="lead">Chaque année, l’association propose des conférences sur des thèmes locaux, des visites guidées et une exposition de photographies centrées sur Gan.</p>
        <p>Les expositions se tiennent habituellement à la mairie de Gan ; pour confirmer l’accès, appelez la mairie au 05&nbsp;59&nbsp;21&nbsp;61&nbsp;31.</p>
      </div>
      <div class="reveal-right">
        <article class="event-card" style="grid-template-columns:150px 1fr">
          <div class="event-date"><span class="y">2027</span><span class="m">Exposition</span></div>
          <div class="event-info" style="padding:1.4rem 1.5rem 1.6rem 2rem"><h3 style="font-size:1.6rem">« Fer, fonte, bois »</h3><p class="small" style="margin:0">Prochaine exposition annoncée. <strong>Date et lieu à confirmer.</strong></p></div>
        </article>
        <p id="upcoming-count" class="small" style="margin-top:1rem"></p>
      </div>
    </div>
  </div>
</section>

<section class="section section--stone" id="programme">
  <div class="wrap">
    {section_head("Programme &amp; archives", "Tous les rendez-vous, du plus récent au plus ancien", "Les rendez-vous « à venir » sont signalés par une pastille bordeaux. Utilisez les boutons pour ne garder qu’un type de rendez-vous.")}
    <div class="chips" role="group" aria-label="Filtrer le programme">{chips}</div>
    {events_html()}
    <div class="tabs-note reveal" style="margin-top:2.4rem">
      <strong>Archives plus anciennes :</strong> conférences depuis 2008, visites depuis 2009, assemblées générales depuis 2008 — le site historique de l’association les conserve toutes.<br>
      <a href="{OFF}/conférences/" target="_blank" rel="noopener">Conférences</a> · <a href="{OFF}/visites/" target="_blank" rel="noopener">Visites</a> · <a href="{OFF}/expositions/" target="_blank" rel="noopener">Expositions</a> · <a href="{OFF}/ateliers-jeunes/" target="_blank" rel="noopener">Ateliers jeunes</a> · <a href="{OFF}/actualités/" target="_blank" rel="noopener">Actualités</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="cta-band reveal">
      <span class="eyebrow">Ne manquez rien</span>
      <h2>Recevoir les annonces</h2>
      <p>Écrivez-nous pour être prévenu des prochaines conférences, visites et expositions.</p>
      <div class="btn-row"><a class="btn btn--light" href="adherer-contact.html#contact">Nous écrire {ARROW}</a></div>
    </div>
  </div>
</section>
"""
    write("evenements.html", layout("evenements.html", "Expositions, conférences & visites", "Programme des conférences, visites guidées et expositions de l’association Gan Mémoire et Patrimoine, et archives des événements passés (2010-2026).", body, hero))


def page_publications():
    hero = page_hero("Publications &amp; ressources", "Publications &amp; ressources", "Fiches d’histoire, bulletin d’adhésion, liens utiles : de quoi lire, télécharger et approfondir.", "eglise-haut-gan.jpg", "center 55%")
    rows = "".join(f'<tr><td>n° {n}</td><td><a href="{fiche_url(slug)}" target="_blank" rel="noopener">{t}</a></td><td>{pub}</td></tr>' for n, t, slug, _, pub in FICHES if pub)
    links = [
        ("Ville de Gan", "https://gan.pau.fr/home/Commune", "Le site de la commune."),
        ("Amis du Musée d’Ossau", "https://www.amis-musee-ossau.com/", "Association amie, vallée d’Ossau."),
        ("Geolval", "https://www.geolval.fr/", "Géologie du Béarn."),
        ("Biarn Toustem", "http://biarn-toustem.blogspot.com/", "Culture et langue béarnaises."),
        ("Bastides 64", "https://bastides64.org/", "Les bastides des Pyrénées-Atlantiques."),
        ("Institut béarnais et gascon", "https://www.institut-bearnaisgascon.com/", "Langue, culture et patrimoine du Béarn."),
    ]
    lk = "".join(f'<div class="reveal"><a class="doc-card" href="{u}" target="_blank" rel="noopener" style="grid-template-columns:1fr"><div><h3>{t}</h3><p>{d}</p></div></a></div>' for t, u, d in links)
    body = f"""
<section class="section">
  <div class="wrap">
    {section_head("Les fiches « Gan et son histoire »", "27 fiches à lire à l’écran ou à télécharger", "Textes parus ou inédits sur différents thèmes de l’histoire de Gan. Les premières versions ont paru au Bulletin municipal de Gan.", False)}
    <div class="grid grid-3">{fiche_cards()}</div>
  </div>
</section>

<section class="section section--stone">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Bulletin municipal de Gan</span>
      <h2>Où et quand ont paru les fiches ?</h2>
      <p>Les fiches ont d’abord paru dans le Bulletin municipal de Gan, de janvier 2009 à juin 2025. Voici les parutions que nous avons pu référencer.</p>
    </div>
    <div class="reveal-right" style="overflow-x:auto">
      <table style="border-collapse:collapse;width:100%;font-size:1rem">
        <thead><tr style="text-align:left;border-bottom:3px solid var(--sepia)"><th style="padding:.5rem">Fiche</th><th style="padding:.5rem">Titre</th><th style="padding:.5rem">Première version</th></tr></thead>
        <tbody>{rows.replace('<td>', '<td style="padding:.55rem .5rem;border-bottom:1px dashed rgba(122,90,52,.5)">')}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    {section_head("Documents à télécharger", "Bulletin d’adhésion, statuts, comptes rendus", "", True)}
    <div class="grid grid-3">
      <div class="reveal"><a class="doc-card" href="{OFF}/app/download/13518859899/Bulletin+d%27Ad%C3%A9sion.pdf" target="_blank" rel="noopener"><div class="doc-thumb"><span>PDF</span></div><div><span class="num">À télécharger</span><h3>Bulletin d’adhésion</h3><p>Format PDF, à remplir et à renvoyer à l’association.</p></div></a></div>
      <div class="reveal" style="--d:.1s"><a class="doc-card" href="{off('/l-association/statuts/')}" target="_blank" rel="noopener"><div class="doc-thumb"><span>§</span></div><div><span class="num">Document officiel</span><h3>Statuts</h3><p>Les statuts de l’association.</p></div></a></div>
      <div class="reveal" style="--d:.2s"><a class="doc-card" href="{off('/l-association/assemblées-générales/')}" target="_blank" rel="noopener"><div class="doc-thumb"><span>AG</span></div><div><span class="num">Archives</span><h3>Assemblées générales</h3><p>Comptes rendus de 2008 à 2026.</p></div></a></div>
    </div>
    <div class="reveal" style="margin-top:2rem"><div class="placeholder"><strong>Livrets et ouvrages :</strong> aucun livret imprimé n’a été identifié lors de nos recherches. Si l’association a publié des brochures, elles seront présentées ici avec leur prix et leur mode de commande. <em>[Texte d’attente à modifier]</em></div></div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    {section_head("Liens utiles", "Pour aller plus loin", "Des sites amis, choisis par l’association.", True)}
    <div class="grid grid-3">{lk}</div>
    <p class="reveal" style="margin-top:2rem;text-align:center"><a class="btn btn--green" href="{OFF}/randonnées/" target="_blank" rel="noopener">Plus de 60 randonnées à Gan et alentours {ARROW}</a></p>
  </div>
</section>
"""
    write("publications.html", layout("publications.html", "Publications & ressources", "Fiches d’histoire locale, bulletin d’adhésion, statuts et liens utiles de l’association Gan Mémoire et Patrimoine.", body, hero))


def page_galerie():
    hero = page_hero("Galerie", "Galerie", "Photographies, cartes postales et documents, classés par lieu et par événement.", "hauteurs-gan.jpg", "center 40%")
    chips = "".join(f'<button type="button" class="chip" data-gal-filter="{k}" aria-pressed="{"true" if k == "all" else "false"}">{l}</button>' for k, l in [("all", "Tout voir"), ("lieu", "Par lieu"), ("evenement", "Par événement"), ("exposition", "Par exposition")])
    body = f"""
<section class="section">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Photos classées</span><h2>Cliquez sur une image pour l’agrandir</h2>
    <p class="lead">Les images viennent des fiches de l’association et de Wikimedia Commons. Les crédits s’affichent sous chaque photo agrandie.</p></div>
    <div class="chips" role="group" aria-label="Filtrer la galerie">{chips}</div>
    {gallery_html()}
  </div>
</section>
<dialog class="lightbox" id="lightbox" aria-label="Photo agrandie">
  <div class="lb-inner">
    <img id="lb-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
    <p class="lb-cap" id="lb-cap"></p>
  </div>
  <button type="button" class="lb-btn lb-close" aria-label="Fermer">✕</button>
  <button type="button" class="lb-btn lb-prev" aria-label="Photo précédente">‹</button>
  <button type="button" class="lb-btn lb-next" aria-label="Photo suivante">›</button>
</dialog>
"""
    write("galerie.html", layout("galerie.html", "Galerie", "Galerie photo de Gan : Bains du Broca, maison d’Andoins, cavalcade, sanatorium… des images classées par lieu et par événement.", body, hero))


def page_contact():
    hero = page_hero("Adhérer / Contact", "Adhérer &amp; nous contacter", "Que vous soyez Gantois de toujours, nouvel arrivant ou simple curieux : ici, vous êtes chez vous.", "eglise-haut-gan.jpg", "center 60%")
    body = f"""
<section class="section">
  <div class="wrap narrow reveal" style="text-align:center">
    <p class="welcome">Soyez les bienvenus : chacun a quelque chose à nous apprendre sur Gan.</p>
  </div>
</section>

<section class="section section--stone" id="adhesion">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Adhérer</span>
      <h2>Devenir membre de l’association</h2>
      <p class="lead">Les nouveaux membres sont les bienvenus. Pour vous inscrire, il suffit de renseigner le bulletin d’adhésion.</p>
      <p><a class="btn" href="{OFF}/app/download/13518859899/Bulletin+d%27Ad%C3%A9sion.pdf" target="_blank" rel="noopener">Télécharger le bulletin d’adhésion (PDF) {ARROW}</a></p>
      <div class="placeholder"><strong>Cotisation et modalités de paiement à confirmer :</strong> le montant annuel et l’adresse d’envoi du bulletin ne figurent pas sur le site historique ; ils sont indiqués sur le bulletin PDF. <em>[Texte d’attente à modifier]</em></div>
    </div>
    <div class="reveal-right">
      <h3>Pourquoi adhérer ?</h3>
      <ul>
        <li>Participer aux conférences et aux visites guidées.</li>
        <li>Exposer vos photographies de Gan lors de l’exposition annuelle.</li>
        <li>Rencontrer des passionnés de l’histoire locale.</li>
        <li>Soutenir la sauvegarde de la mémoire de Gan.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section" id="temoigner">
  <div class="wrap split">
    <div class="reveal-left">
      <span class="eyebrow">Appel à témoignages et dons de documents</span>
      <h2>Racontez Gan, confiez vos archives</h2>
      <p class="lead">Une photographie de classe, une carte postale, un carnet, un souvenir d’inondation ou de cavalcade : ce qui vous semble ordinaire est peut-être précieux.</p>
      <p>Écrivez-nous en indiquant ce que vous possédez ou ce que vous aimeriez raconter ; nous vous répondrons pour convenir de la suite.</p>
      <div class="placeholder"><strong>Conditions de dépôt et de restitution à confirmer</strong> (numérisation, copie, don ou prêt, droit à l’image). <em>[Texte d’attente à modifier]</em></div>
    </div>
    <figure class="print reveal-right r2">{img("andoins-gravure.jpg", "Dessin ancien de la maison d’Andoins")}<figcaption>Un dessin du XIXe siècle conservé dans les fiches de l’association : et chez vous, que garde-t-on ?</figcaption></figure>
  </div>
</section>

<section class="section section--paper2" id="contact">
  <div class="wrap">
    {section_head("Nous écrire", "Une question, une suggestion, un souvenir ?", "Remplissez le formulaire : votre message arrive directement à l’association.", False)}
    <div class="split" style="align-items:start">
      <div class="reveal-left">
        <form class="form" id="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="contact">
          <input type="hidden" name="subject" value="Message du site Gan Mémoire et Patrimoine (%{{submissionId}})">
          <p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
          <div class="field"><label for="f-nom">Votre nom *</label><input id="f-nom" name="nom" type="text" required autocomplete="name"></div>
          <div class="field"><label for="f-email">Votre adresse e-mail *</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
          <div class="field"><label for="f-objet">Objet de votre message</label>
            <select id="f-objet" name="objet"><option>Question générale</option><option>Adhésion</option><option>Témoignage ou souvenir</option><option>Don ou prêt de documents</option><option>Suggestion</option></select></div>
          <div class="field"><label for="f-message">Votre message *</label><textarea id="f-message" name="message" required></textarea></div>
          <div><button class="btn" type="submit">Envoyer mon message {ARROW}</button></div>
          <div id="form-status" class="form-status" role="status" tabindex="-1"></div>
          <p class="small">* champs obligatoires. Vos données ne servent qu’à répondre à votre message (voir les <a href="mentions-legales.html#donnees">mentions légales</a>).</p>
        </form>
      </div>
      <div class="reveal-right">
        <h3>Coordonnées</h3>
        <ul class="facts">
          <li><b>Association</b><span>Gan Mémoire et Patrimoine</span></li>
          <li><b>Président</b><span>Daniel Trallero</span></li>
          <li><b>E-mail</b><span><a href="mailto:{EMAIL}">{EMAIL}</a></span></li>
          <li><b>Siège</b><span>{ADDR}</span></li>
          <li><b>Expositions</b><span>Mairie de Gan, 05&nbsp;59&nbsp;21&nbsp;61&nbsp;31 (pour confirmer l’accès)</span></li>
        </ul>
        <h3 style="margin-top:2rem">Où nous trouver</h3>
        <div class="map-frame"><iframe title="Carte : rue Pierre de Marca à Gan" loading="lazy" referrerpolicy="no-referrer" src="https://www.openstreetmap.org/export/embed.html?bbox=-0.4010%2C43.2190%2C-0.3700%2C43.2330&amp;layer=mapnik&amp;marker=43.2261%2C-0.3856"></iframe></div>
        <p class="small" style="margin-top:.6rem"><a href="https://www.openstreetmap.org/?mlat=43.2261&amp;mlon=-0.3856#map=16/43.2261/-0.3856" target="_blank" rel="noopener">Agrandir la carte</a> · © contributeurs OpenStreetMap. Pierre Emmanuel écrivait que Gan est « à huit kilomètres de Pau ».</p>
      </div>
    </div>
  </div>
</section>
"""
    write("adherer-contact.html", layout("adherer-contact.html", "Adhérer / Contact", "Adhérez à Gan Mémoire et Patrimoine, apportez un témoignage, donnez des documents ou écrivez-nous : formulaire de contact, coordonnées et plan.", body, hero))


def page_mentions():
    hero = page_hero("Mentions légales", "Mentions légales", "Informations légales et gestion des données personnelles.", "hauteurs-gan.jpg", "center 35%")
    body = f"""
<section class="section">
  <div class="wrap narrow legal">
    <h2>Éditeur du site</h2>
    <p><strong>Association Gan – Mémoire et Patrimoine</strong>, association régie par la loi du 1er juillet 1901.<br>
    Siège social : {ADDR}.<br>
    Déclarée à la préfecture des Pyrénées-Atlantiques sous le numéro RNA W643003433 ; SIREN 897 638 979.<br>
    Représentant légal et directeur de la publication : Daniel Trallero, président.<br>
    Contact : <a href="mailto:{EMAIL}">{EMAIL}</a></p>

    <h2>Hébergement</h2>
    <p>Ce site est hébergé par Netlify, Inc. (netlify.com).</p>

    <h2>Propriété intellectuelle et crédits</h2>
    <p>Les textes, photographies et documents de l’association sont publiés sous sa responsabilité. Les images et fiches reproduites proviennent du site historique de l’association et du Bulletin municipal de Gan.</p>
    <p>Les photographies suivantes proviennent de Wikimedia Commons : « Hauteurs Gan », « Porte Gan » et « Marie Gan » par Capbourrut (CC BY-SA 4.0) ; « Haut-Gan église 001 » par Jean Michel Etchecolonea (CC BY-SA 3.0).</p>
    <p>Si un contenu (texte, photo, etc.) vous semble porter atteinte à vos droits à l’image ou de propriété intellectuelle, merci de contacter l’association, qui le retirera dans les meilleurs délais.</p>

    <h2 id="donnees">Données personnelles</h2>
    <p>Le formulaire de contact recueille votre nom, votre adresse e-mail et votre message, uniquement pour y répondre. Ils sont traités par la fonction « Netlify Forms » de l’hébergeur et transmis à l’association ; ils ne sont ni vendus ni utilisés à d’autres fins. Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
    <p>Ce site n’utilise ni cookies publicitaires ni outil de mesure d’audience. Le plan de la page « Adhérer / Contact » est fourni par OpenStreetMap, et les polices de caractères par Google Fonts : ces services peuvent recevoir votre adresse IP lors du chargement de la page.</p>
    <p>La taille du texte choisie avec les boutons A− / A+ est mémorisée dans votre navigateur, sans être transmise.</p>

    <h2>Conception</h2>
    <p>Site conçu comme vitrine de l’association. Les informations historiques proviennent des fiches de l’association et de sources publiques ; toute erreur peut être signalée à l’adresse ci-dessus.</p>
  </div>
</section>
"""
    write("mentions-legales.html", layout("mentions-legales.html", "Mentions légales", "Mentions légales du site de l’association Gan Mémoire et Patrimoine : éditeur, hébergement, crédits photographiques et données personnelles.", body, hero))


def page_404():
    hero = page_hero("Page introuvable", "Page introuvable", "Cette page s’est perdue comme un vieux document dans un grenier.", "hauteurs-gan.jpg", "center 40%")
    body = f"""<section class="section"><div class="wrap narrow" style="text-align:center"><p class="lead">Pas d’inquiétude : retournons à l’accueil ou choisissons une rubrique dans le menu.</p><p><a class="btn" href="index.html">Retour à l’accueil {ARROW}</a></p></div></section>"""
    html404 = layout("404.html", "Page introuvable", "Page introuvable.", body, hero).replace("<head>", '<head>\n<base href="/">', 1)
    write("404.html", html404)


if __name__ == "__main__":
    page_index()
    page_association()
    page_histoire()
    page_memoire()
    page_evenements()
    page_publications()
    page_galerie()
    page_contact()
    page_mentions()
    page_404()
