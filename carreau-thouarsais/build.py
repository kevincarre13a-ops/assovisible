#!/usr/bin/env python3
"""Assemble les pages du site « Le Carreau Thouarsais ».

Les pages sont écrites dans src/pages/*.html (un petit en-tête « clé: valeur », une ligne ---,
puis le contenu). Ce script y ajoute l'en-tête, le menu, le pied de page et les scripts communs,
puis écrit le résultat dans public/. Lancer :  python3 build.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "public"

SITE = "Le Carreau Thouarsais"
URL_HOME = "index.html"

NAV = [  # (clé, fichier, libellé)
    ("accueil", "index.html", "Accueil"),
    ("club", "le-club.html", "Le club"),
    ("jouer", "jouer-avec-nous.html", "Jouer avec nous"),
    ("concours", "concours-calendrier.html", "Concours &amp; calendrier|Concours"),
    ("resultats", "resultats-palmares.html", "Résultats &amp; palmarès|Résultats"),
    ("galerie", "galerie.html", "Galerie"),
    ("actus", "actualites-partenaires.html", "Actualités &amp; partenaires|Actualités"),
    ("contact", "licence-contact.html", "Licence / Contact"),
]

FACEBOOK = "https://www.facebook.com/Carreau%20Thouarsais%20Petanque"
TWITTER = "https://twitter.com/Carro_Thouars"

ICONS = {
    "pin": '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
    "calendar": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    "heart": '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
    "trophy": '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17c0 .6-.5 1-1.1 1.2C7.8 18.7 7 20.2 7 22M14 14.7V17c0 .6.5 1 1.1 1.2 1.1.5 1.9 2 1.9 3.8M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    "smile": '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "mail": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
    "x": '<path d="M4 4l16 16M20 4 4 20"/>',
    "school": '<path d="M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 3 9 3 12 0v-5"/>',
    "access": '<circle cx="12" cy="4.5" r="1.6"/><path d="M8 9h8M12 9v5l3 5M9.5 12.5A5 5 0 1 0 15 18"/>',
    "camera": '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
}


def sprite():
    syms = "".join(f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>'
                   for k, v in ICONS.items())
    return f'<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>{syms}</defs></svg>'


def icon(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<svg{c} aria-hidden="true" focusable="false"><use href="#i-{name}"/></svg>'


def header(active):
    items = []
    for key, href, label in NAV:
        cur = ' aria-current="page"' if key == active else ""
        cls = ' class="nav-cta"' if key == "contact" else ""
        if "|" in label:
            long, short = label.split("|")
            inner = f'<span class="long">{long}</span><span class="short">{short}</span>'
        else:
            inner = label
        items.append(f'<li{cls}><a href="{href}"{cur}>{inner}</a></li>')
    cur = ' aria-current="page"' if active == "mentions" else ""
    items.append(f'<li class="nav-only-mobile"><a href="mentions-legales.html"{cur}>Mentions légales</a></li>')
    return f'''<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="{URL_HOME}" aria-label="{SITE} — retour à l'accueil">
      <img class="brand-logo" src="img/logo-120.webp" width="58" height="58" alt="">
      <span class="brand-text"><b>Le Carreau</b><i>Thouarsais</i></span>
    </a>
    <nav id="menu" class="nav" aria-label="Navigation principale"><ul>{"".join(items)}</ul></nav>
    <div class="tools">
      <button class="size-btn" type="button" aria-label="Agrandir le texte">Aa</button>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu"><span class="sr">Ouvrir le menu</span><span class="burger-lines" aria-hidden="true"></span></button>
    </div>
  </div>
</header>'''


def footer():
    links = "".join(f'<li><a href="{h}">{l.split("|")[0]}</a></li>' for _, h, l in NAV)
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-brand"><img src="img/logo-120.webp" width="90" height="90" alt="" loading="lazy"><div><b>Le Carreau</b><i>Thouarsais</i></div></div>
        <p>Club de pétanque de Thouars (Deux-Sèvres), fondé en 2001. Entraînements, concours, école de pétanque et Handi-Pétanque.</p>
        <p class="script" style="margin:0;font-size:1.7rem">Un club, une famille, une passion&nbsp;!</p>
      </div>
      <div>
        <h2>Coordonnées</h2>
        <ul>
          <li>4 rue Jules Renard<br>79100 Thouars</li>
          <li><a href="tel:+33771626468">07 71 62 64 68</a></li>
          <li><a href="licence-contact.html#formulaire">Écrire au club</a></li>
        </ul>
        <div class="social">
          <a href="{FACEBOOK}" target="_blank" rel="noopener" aria-label="Page Facebook du club (s'ouvre dans un nouvel onglet)">{icon("facebook")}</a>
          <a href="{TWITTER}" target="_blank" rel="noopener" aria-label="Compte X (Twitter) du club (s'ouvre dans un nouvel onglet)">{icon("x")}</a>
        </div>
      </div>
      <div>
        <h2>Où jouer ?</h2>
        <ul>
          <li><b>Hiver :</b> Espace Club, rue Denfert Rochereau</li>
          <li><b>Été :</b> Stade Philippe Morin</li>
          <li><a href="jouer-avec-nous.html">Horaires &amp; lieux</a></li>
        </ul>
      </div>
      <div>
        <h2>Le site</h2>
        <ul>{links}</ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span class="js-year">2026</span> Le Carreau Thouarsais — association loi 1901 affiliée à la FFPJP</span>
      <a href="mentions-legales.html">Mentions légales</a>
    </div>
  </div>
</footer>'''


def parse(path):
    raw = path.read_text(encoding="utf-8")
    head, body = raw.split("\n---\n", 1)
    meta = {}
    for line in head.splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, body.strip()


def ld_json():
    return '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"SportsClub","name":"Le Carreau Thouarsais","sport":"Pétanque et jeu provençal","description":"Club de pétanque de Thouars (Deux-Sèvres) : entraînements, concours, école de pétanque et Handi-Pétanque.","foundingDate":"2001-10-29","telephone":"+33771626468","address":{"@type":"PostalAddress","streetAddress":"4 rue Jules Renard","postalCode":"79100","addressLocality":"Thouars","addressCountry":"FR"},"sameAs":["%s","%s"]}</script>''' % (FACEBOOK, TWITTER)


def render(meta, body):
    title = meta["title"]
    full_title = title if title.startswith(SITE) else f"{title} — {SITE}"
    desc = meta["desc"].replace('"', "&quot;")
    page = meta["file"]
    extra_scripts = ""
    if meta.get("events") == "yes":
        extra_scripts += '<script src="js/evenements.js" defer></script>\n'
    if meta.get("scene") == "yes":
        extra_scripts += '<script src="js/boules.js" defer></script>\n'
    ld = ld_json() if page == "index.html" else ""
    base = '<base href="/">\n' if page == "404.html" else ""
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
{base}<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#13294B">
<!-- MAQUETTE : supprimer la ligne « robots » ci-dessous quand le club valide le site pour la mise en ligne définitive. -->
<meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{full_title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://le-carreau-thouarsais.netlify.app/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preload" href="fonts/barlow-condensed-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/atkinson-hyperlegible-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.add("js")</script>
{ld}
</head>
<body class="{meta.get("body", "")}">
{sprite()}
{header(meta["nav"])}
<main id="contenu">
{body}
</main>
{footer()}
{extra_scripts}<script src="js/main.js" defer></script>
</body>
</html>
'''


def main():
    OUT.mkdir(exist_ok=True)
    count = 0
    for path in sorted((SRC / "pages").glob("*.html")):
        meta, body = parse(path)
        # {{icon:nom}} -> svg inline
        body = re.sub(r"\{\{icon:([a-z]+)\}\}", lambda m: icon(m.group(1)), body)
        body = body.replace("{{FACEBOOK}}", FACEBOOK).replace("{{TWITTER}}", TWITTER)
        (OUT / meta["file"]).write_text(render(meta, body), encoding="utf-8")
        count += 1
        print("✓", meta["file"])
    print(f"{count} pages générées dans {OUT}")


if __name__ == "__main__":
    sys.exit(main())
