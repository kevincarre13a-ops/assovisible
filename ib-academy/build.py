#!/usr/bin/env python3
"""
IB Academy — assemble les pages du site.

Chaque page de src/pages/*.html commence par un bloc de métadonnées :

    <!--
    title: Titre de l'onglet
    description: Description pour Google
    hero: assets/img/xxx.webp        (facultatif : en-tête visuel)
    hero_title: Ligne 1|Ligne 2      (facultatif)
    hero_text: Phrase d'accroche     (facultatif)
    -->

L'en-tête et le pied de page communs sont ajoutés automatiquement.
Usage :  python3 build.py   →   génère les fichiers HTML dans dist/
Les contenus qui changent souvent (matchs, résultats, horaires, actus…)
se modifient dans assets/js/data.js, sans relancer ce script.
"""
import html, re, shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC, DIST = ROOT / "src" / "pages", ROOT / "dist"
SITE_URL = "https://ib-academy-villejuif.netlify.app"

NAV = [
    ("index.html", "Accueil"),
    ("club.html", "Le club"),
    ("categories.html", "Catégories"),
    ("matchs.html", "Matchs"),
    ("stages.html", "Stages"),
    ("actualites.html", "Actus"),
    ("galerie.html", "Galerie"),
    ("inscriptions.html", "Inscriptions"),
    ("partenaires.html", "Partenaires"),
    ("contact.html", "Contact"),
]

HEAD = """<!DOCTYPE html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
{base}<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="IB Academy">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="{site}/{og}">
<meta property="og:locale" content="fr_FR">
<meta name="theme-color" content="#0b0d0c">{robots}
<link rel="icon" href="assets/img/logo-ib.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
{preload}
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="IB Academy — accueil">
      <img src="assets/img/logo-ib.svg" alt="" width="44" height="52">
      <span>IB Academy<small>Football · Villejuif</small></span>
    </a>
    <nav class="nav" id="menu" aria-label="Navigation principale">
{nav}
    </nav>
    <div class="header-cta">
      <a class="btn" href="inscriptions.html">S’inscrire</a>
      <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="contenu">
"""

PAGE_HERO = """<section class="page-hero">
  <div class="page-hero__bg" style="background-image:url('{img}')" role="img" aria-label="{alt}"></div>
  <div class="pitch-lines" aria-hidden="true"></div>
  <div class="container">
    <p class="breadcrumb"><a href="index.html">Accueil</a> / {crumb}</p>
    <h1>{lines}</h1>
    <p>{text}</p>
  </div>
</section>
"""

FOOT = """</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html"><img src="assets/img/logo-ib.svg" alt="" width="44" height="52"><span>IB Academy<small>Football · Villejuif</small></span></a>
        <p class="muted" style="margin-top:1rem">Académie de football associative (loi 1901) à Villejuif, Val-de-Marne. Filles et garçons dès 7 ans : progresser sur le terrain et grandir en dehors.</p>
        <div class="socials" data-socials></div>
      </div>
      <div>
        <h3>Le club</h3>
        <ul>
          <li><a href="club.html">Présentation</a></li>
          <li><a href="categories.html">Catégories &amp; horaires</a></li>
          <li><a href="matchs.html">Matchs &amp; résultats</a></li>
          <li><a href="stages.html">Stages &amp; événements</a></li>
        </ul>
      </div>
      <div>
        <h3>Suivre</h3>
        <ul>
          <li><a href="actualites.html">Actualités</a></li>
          <li><a href="galerie.html">Galerie</a></li>
          <li><a href="partenaires.html">Partenaires</a></li>
          <li><a href="inscriptions.html">Inscriptions</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul>
          <li><a href="mailto:ibacademyfootball@gmx.fr">ibacademyfootball@gmx.fr</a></li>
          <li>Villejuif (94800), Val-de-Marne</li>
          <li><a href="contact.html">Formulaire de contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-big" aria-hidden="true">IB Academy</div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> IB Academy — Association loi 1901</span>
      <span><a href="mentions-legales.html">Mentions légales</a> · <a href="contact.html">Contact</a></span>
    </div>
  </div>
</footer>
<button class="to-top" type="button" aria-label="Revenir en haut">↑</button>
<script src="assets/js/data.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
"""


def parse(text):
    m = re.match(r"\s*<!--(.*?)-->\s*", text, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def build():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copytree(ROOT / "assets", DIST / "assets")
    for extra in ("robots.txt", "_redirects"):
        if (ROOT / extra).exists():
            shutil.copy(ROOT / extra, DIST / extra)
    pages = sorted(SRC.glob("*.html"))
    sitemap = []
    for p in pages:
        meta, body = parse(p.read_text(encoding="utf-8"))
        name = p.name
        nav = "\n".join(
            f'      <a href="{href}"{" aria-current=\"page\"" if href == name else ""}>{label}</a>'
            for href, label in NAV
        )
        hero = meta.get("hero")
        preload = f'<link rel="preload" as="image" href="{hero}">' if hero else ""
        out = HEAD.format(
            title=html.escape(meta["title"]),
            description=html.escape(meta["description"]),
            url=f"{SITE_URL}/{'' if name == 'index.html' else name}",
            site=SITE_URL,
            og=hero or "assets/img/hero-nuit.webp",
            nav=nav,
            preload=preload,
            base='<base href="/">\n' if name == '404.html' else '',
            robots='\n<meta name="robots" content="noindex">' if meta.get('noindex') else '',
        )
        if meta.get("hero_title"):
            lines = "".join(f'<span class="line"><span>{l}</span></span>' for l in meta["hero_title"].split("|"))
            out += PAGE_HERO.format(img=hero, alt=html.escape(meta.get("hero_alt", "")), crumb=meta.get("crumb", ""), lines=lines, text=meta.get("hero_text", ""))
        out += body + FOOT
        (DIST / name).write_text(out, encoding="utf-8")
        if not meta.get("noindex"):
            sitemap.append(f"{SITE_URL}/{'' if name == 'index.html' else name}")
    (DIST / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{u}</loc></url>\n" for u in sitemap) + "</urlset>\n", encoding="utf-8")
    print(f"{len(pages)} pages générées dans {DIST}")


if __name__ == "__main__":
    build()
