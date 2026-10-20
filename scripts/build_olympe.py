#!/usr/bin/env python3
"""Génère les pages HTML statiques du site Olympe dans ./olympe.

Usage : python3 scripts/build_olympe.py
Les pages partagent le même en-tête / pied de page ; modifiez le contenu ici
puis relancez le script, ou éditez directement les fichiers HTML générés.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "olympe"

TEL = "03 80 41 47 83"
TEL_HREF = "+33380414783"
MOBILE = "06 06 62 32 79"
MOBILE_HREF = "+33606623279"
MAIL = "michel.agostini21@orange.fr"
FB = "https://www.facebook.com/p/Plombi%C3%A8res-Olympe-100063717665253/"
LIEU = "Gymnase municipal – rue du Moulin, 21370 Plombières-lès-Dijon"

NAV = [
    ("index.html", "Accueil"),
    ("association.html", "L’association"),
    ("activites.html", "Activités"),
    ("galerie.html", "Galerie"),
    ("actualites.html", "Actualités"),
]
NAV_CTA = ("contact.html", "Contact")

# ---------------------------------------------------------------- logo SVG
def star(cx, cy, r, fill):
    import math
    pts = []
    for k in range(10):
        ang = -math.pi / 2 + k * math.pi / 5
        rr = r if k % 2 == 0 else r * 0.45
        pts.append(f"{cx + rr * math.cos(ang):.1f},{cy + rr * math.sin(ang):.1f}")
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'

LOGO_SYMBOL = (
    '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><defs>'
    '<symbol id="logo" viewBox="0 0 100 100">'
    '<rect x="4" y="4" width="92" height="92" rx="9" fill="#2a3d9c" stroke="#0b1544" stroke-width="4"/>'
    '<path d="M8 8h30c6 28 10 52 14 84H8z" fill="#e4675f"/>'
    + star(22, 30, 7, "#f6d68f") + star(20, 52, 6, "#fbe3c8") + star(26, 76, 9, "#2a3d9c")
    + star(78, 20, 6.5, "#ffffff") + star(80, 56, 5, "#f4a79f") + star(66, 80, 7, "#e4675f") + star(86, 38, 4, "#f6d68f")
    + '<circle cx="47" cy="25" r="7" fill="#fff7ec"/>'
    '<g fill="none" stroke="#fff7ec" stroke-linecap="round" stroke-linejoin="round">'
    '<path d="M47 35c0 14 2 26 6 38" stroke-width="9"/>'
    '<path d="M44 38 30 14" stroke-width="5"/>'
    '<path d="M49 40c13 1 23-1 33-5" stroke-width="5"/>'
    '<path d="M53 71c10-2 20 0 30 10" stroke-width="6"/>'
    '<path d="M51 73c-2 9-3 15-5 21" stroke-width="6"/></g>'
    '</symbol></defs></svg>'
)

ICONS = {
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    "info": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    "heart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/></svg>',
    "spark": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>',
    "hands": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="7" r="2.6"/><circle cx="17" cy="8" r="2.2"/><path d="M3 20c0-3.6 2.4-6 5-6s5 2.4 5 6M14 15.2c.9-.7 1.9-1.1 3-1.1 2.2 0 4 2 4 5.9"/></svg>',
    "globe": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
    "lotus": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5c2.4 2.2 3.2 5 0 9-3.2-4-2.4-6.800 0-9zM3.500 10c3.200.2 5.600 2.300 6.500 6-3.700.5-6.300-1.700-6.500-6zM20.500 10c-.2 4.300-2.800 6.500-6.500 6 .9-3.700 3.300-5.800 6.500-6zM6 19.500c4 .8 8 .8 12 0"/></svg>',
    "bolt": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 3 5 13h6l-1 8 8-10h-6z"/></svg>',
    "fb": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.500h2.600l.4-3h-3V8.600c0-.9.3-1.500 1.600-1.500h1.600V4.400c-.3 0-1.200-.1-2.300-.1-2.300 0-3.900 1.400-3.900 4v2.200H7.900v3h2.600V21z"/></svg>',
    "wave": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><path d="M3 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity=".5"/></svg>',
}

WAVE = ('<svg class="wave wave--{c}" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">'
        '<path d="M0 64c120 34 240 48 360 34s240-62 360-60 240 52 360 62 240-4 360-40v60H0z"/></svg>')


def wave(c="cream"):
    return WAVE.replace("{c}", c)


# ---------------------------------------------------------------- gabarit
def page(slug, title, desc, body, *, active=None, hero_img=None, crumb=None, h1=None, lead=None, eyebrow=None, extra_head="", plain_hero=False, noindex=False):
    cur = lambda h: ' aria-current="page"' if h == active else ""
    nav_links = "".join(f'<a href="{h}"{cur(h)}>{l}</a>' for h, l in NAV)
    cta = f'<a class="nav-cta" href="{NAV_CTA[0]}"{cur(NAV_CTA[0])}>{NAV_CTA[1]} · Nous rejoindre</a>'
    legal_nav = f'<a class="nav-legal" href="mentions-legales.html"{cur("mentions-legales.html")}>Mentions légales</a>'

    header = f'''<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Olympe — retour à l’accueil">
      <svg class="logo" viewBox="0 0 100 100" role="img" aria-hidden="true"><use href="#logo"/></svg>
      <span><span class="brand-name">Olympe</span><span class="brand-sub">Danse · Plombières-lès-Dijon</span></span>
    </a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    <nav class="nav" id="menu" aria-label="Navigation principale">{nav_links}{cta}{legal_nav}</nav>
  </div>
</header>'''

    footer = f'''<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="index.html"><svg class="logo" viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg><span><span class="brand-name">Olympe</span><span class="brand-sub">Danse · Plombières-lès-Dijon</span></span></a>
        <p>Association de danse et de loisirs chorégraphiques, ouverte à tous dès 4 ans. Fondée en 1984 par Martine Agostini.</p>
        <div class="socials">
          <a href="{FB}" target="_blank" rel="noopener" aria-label="Page Facebook d’Olympe (nouvel onglet)">{ICONS["fb"]}</a>
          <a href="mailto:{MAIL}" aria-label="Écrire à Olympe">{ICONS["mail"]}</a>
          <a href="tel:{TEL_HREF}" aria-label="Appeler Olympe">{ICONS["phone"]}</a>
        </div>
      </div>
      <div>
        <h4>Le site</h4>
        <ul>
          {"".join(f'<li><a href="{h}">{l}</a></li>' for h, l in NAV)}
          <li><a href="{NAV_CTA[0]}">Contact / Nous rejoindre</a></li>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
        </ul>
      </div>
      <div>
        <h4>Nous joindre</h4>
        <ul>
          <li>Martine Agostini, fondatrice et présidente</li>
          <li><a href="tel:{TEL_HREF}">{TEL}</a> · <a href="tel:{MOBILE_HREF}">{MOBILE}</a></li>
          <li><a href="mailto:{MAIL}">{MAIL}</a></li>
          <li>{LIEU}</li>
          <li><a href="{FB}" target="_blank" rel="noopener">Olympe sur Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <span data-year>2026</span> Association Olympe (loi 1901) · Plombières-lès-Dijon, Côte-d’Or</span>
      <span><a href="mentions-legales.html">Mentions légales</a> · Fait avec ♥ pour ceux qui dansent</span>
    </div>
  </div>
</footer>'''

    if plain_hero:
        hero = f'''<section class="page-hero"><div class="stars" data-stars="22"></div>
  <div class="wrap"><nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span>{crumb}</nav>
  <h1>{h1}</h1></div>{wave("cream")}</section>'''
    elif hero_img:
        hero = f'''<section class="page-hero">
  <div class="page-hero-bg" style="background-image:url('{hero_img}')" role="img" aria-label=""></div>
  <div class="stars" data-stars="26"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a><span>›</span>{crumb}</nav>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{h1}</h1>
    <p class="lead">{lead}</p>
  </div>
  {wave("cream")}
</section>'''
    else:
        hero = ""

    robots = '<meta name="robots" content="noindex">' if noindex else ""
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0b1544">
{robots}
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Olympe — danse à Plombières-lès-Dijon">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add("js")</script>
<link rel="stylesheet" href="css/style.css">
{extra_head}
</head>
<body>
{LOGO_SYMBOL}
{header}
<main id="contenu">
{hero}
{body}
</main>
{footer}
<script src="js/main.js" defer></script>
</body>
</html>
'''


def cta_band(title="Envie de danser avec nous ?", text=None, wave_from="cream"):
    text = text or "Une séance d’essai est possible sur simple prise de contact avec Martine Agostini. Venez comme vous êtes : le plaisir de bouger fait le reste."
    return f'''<section class="section cta">
  <div class="stars" data-stars="30"></div>
  <div class="wrap reveal">
    <span class="eyebrow">Rejoindre Olympe</span>
    <h2>{title}</h2>
    <p>{text}</p>
    <div class="btns">
      <a class="btn" href="contact.html">Nous rejoindre <span class="arrow">→</span></a>
      <a class="btn btn--ghost" href="tel:{TEL_HREF}">Appeler le {TEL}</a>
    </div>
  </div>
</section>'''


def card(img, alt, tag, title, text, href=None, label="En savoir plus"):
    link = f'<a class="link-arrow" href="{href}">{label} <span class="arrow">→</span></a>' if href else ""
    return f'''<article class="card reveal">
  <div class="card-media"><img src="img/{img}" alt="{alt}" loading="lazy" width="1400" height="1050">{f'<span class="tag">{tag}</span>' if tag else ""}</div>
  <div class="card-body"><h3>{title}</h3><p>{text}</p>{link}</div>
</article>'''


# ---------------------------------------------------------------- ACCUEIL
def home():
    ribbon_items = ["Éveil à la danse", "Danse classique", "Modern’jazz", "Hip-hop", "Danse fusion", "Danses du monde", "Danse en ligne", "Yoga", "Pilates", "Gym détente"]
    ribbon = "".join(f"<span>{i}</span>" for i in ribbon_items * 2)

    body = f'''
<section class="hero" id="top">
  <div class="hero-bg" style="background-image:url('img/voiles.jpg')" role="img" aria-label="Danseuses aux voiles colorés sur scène lors du gala d’Olympe"></div>
  <div class="hero-rays" aria-hidden="true"></div>
  <div class="stars" data-stars="46" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <span class="eyebrow">Association de danse · Plombières-lès-Dijon</span>
    <h1 class="hero-title" data-letters>Olympe</h1>
    <p class="hero-tag">Là où la danse nous <em class="gold">élève</em>.</p>
    <p class="hero-sub">Éveil, classique, hip-hop, danses du monde, pilates… Depuis 1984, on danse, on se dépasse et on se retrouve à Plombières-lès-Dijon — dès 4 ans, quel que soit l’âge.</p>
    <div class="hero-actions">
      <a class="btn" href="activites.html">Découvrir les activités <span class="arrow">→</span></a>
      <a class="btn btn--ghost" href="contact.html">Nous rejoindre</a>
    </div>
    <a class="hero-chip" href="actualites.html"><b>42<sup>e</sup> gala</b> « La malle aux souvenirs » · 20 juin 2026</a>
  </div>
  <span class="scroll-cue" aria-hidden="true"></span>
  {wave("cream")}
</section>

<section class="section section--tight" style="padding-top:0">
  <div class="wrap">
    <div class="stats" data-stagger>
      <div class="stat reveal"><div class="stat-num"><span data-count="42">42</span></div><div class="stat-label">années de danse à Plombières-lès-Dijon<br>(depuis 1984)</div></div>
      <div class="stat reveal"><div class="stat-num"><span data-count="10">10</span></div><div class="stat-label">disciplines : danses, yoga, pilates, gym détente</div></div>
      <div class="stat reveal"><div class="stat-num"><small>dès</small><span data-count="4">4</span></div><div class="stat-label">ans : des tout-petits aux adultes, tout le monde danse</div></div>
      <div class="stat reveal"><div class="stat-num"><span data-count="42">42</span><small style="margin-left:.15em">e</small></div><div class="stat-label">gala annuel présenté en juin 2026</div></div>
    </div>
  </div>
</section>

<div class="ribbon" aria-hidden="true"><div class="ribbon-track">{ribbon}</div></div>

<section class="section">
  <div class="wrap split">
    <div class="reveal reveal--left">
      <span class="eyebrow">Notre histoire</span>
      <h2>Huit fillettes, une envie folle de danser… et <em class="gold">quarante-deux ans</em> plus tard.</h2>
      <p class="lead">Tout a commencé en 1984 avec une seule activité et huit fillettes de 8 ans. Aujourd’hui, Olympe fait danser les petits, les ados et les adultes de Plombières-lès-Dijon et des environs.</p>
      <p>Chaque année, un gala sur un thème différent met en scène le travail de toute la saison : un moment de joie partagé entre élèves, familles et amis. Et derrière, une équipe de bénévoles et une fondatrice passionnée.</p>
      <a class="btn btn--ink" href="association.html">Découvrir l’association <span class="arrow">→</span></a>
    </div>
    <div class="photo-stack reveal reveal--right">
      <svg class="ornament" viewBox="0 0 100 100" aria-hidden="true"><g fill="currentColor"><path d="M50 2l7 31 31-7-24 21 24 21-31-7-7 31-7-31-31 7 24-21L12 26l31 7z" opacity=".9"/></g></svg>
      <div class="photo"><img src="img/finale-malle.jpg" alt="Les danseurs d’Olympe réunis sur scène autour de la malle du gala 2026" loading="lazy" width="1400" height="1050"></div>
      <div class="photo"><img src="img/classique-robes-blanches.jpg" alt="Jeunes danseuses en robes blanches à plumes" loading="lazy" width="1400" height="1050"></div>
    </div>
  </div>
</section>

<section class="section section--peach">
  <div class="wrap">
    <div class="reveal" style="text-align:center;max-width:720px;margin:0 auto 54px">
      <span class="eyebrow">Explorer</span>
      <h2>Tout Olympe, en quatre pas</h2>
      <p class="lead" style="margin-inline:auto">Une association, des activités pour tous les goûts, des souvenirs plein les yeux et des rendez-vous à ne pas manquer.</p>
    </div>
    <div class="cards cards--4" data-stagger>
      {card("scene-banniere.jpg", "Scène de la salle des fêtes avec la banderole Olympe", "L’association", "Une histoire de passion", "Fondée en 1984, portée par Martine Agostini et son conseil d’administration.", "association.html", "Découvrir")}
      {card("hiphop-groupe.jpg", "Élèves de hip-hop sur scène", "Activités", "Dix façons de bouger", "Éveil, classique, modern’jazz, hip-hop, danses du monde, yoga, pilates…", "activites.html", "Voir les activités")}
      {card("fusion-duo.jpg", "Deux danseuses en duo sur scène", "Galerie", "Des souvenirs en lumière", "Les plus beaux instants du gala, classés par activité.", "galerie.html", "Ouvrir la galerie")}
      {card("danse-en-ligne.jpg", "Groupe d’adultes en danse en ligne sur scène", "Actualités", "Les rendez-vous d’Olympe", "Galas, reprises, nouvelles : suivez la vie de l’association.", "actualites.html", "Lire les actualités")}
    </div>
  </div>
</section>

<section class="section founder">
  <div class="stars" data-stars="24"></div>
  <div class="wrap founder-grid">
    <div class="portrait reveal reveal--zoom" role="img" aria-label="Emplacement du portrait de Martine Agostini">
      <svg viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg>
      <b>Martine Agostini</b>
    </div>
    <div class="reveal reveal--right">
      <span class="eyebrow">La fondatrice</span>
      <h2>Martine Agostini, <em class="gold">quarante ans</em> au service de la danse</h2>
      <div class="medal">
        <span class="medal-disc" aria-hidden="true">★</span>
        <div><strong>Médaille d’Argent de la Jeunesse, des Sports et de l’Engagement associatif</strong><span>Une longévité exemplaire, saluée en 2010 et 2019</span></div>
      </div>
      <blockquote><p class="big-quote">« J’aime la danse depuis l’enfance… Ce fut une révélation. »</p>
      <p class="cite">Martine Agostini, au <em>Bien Public</em> (juin 2024)</p></blockquote>
      <a class="btn" href="association.html#fondatrice">Son parcours <span class="arrow">→</span></a>
    </div>
  </div>
  {wave("cream")}
</section>

<section class="section">
  <div class="wrap">
    <div class="reveal" style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;margin-bottom:34px">
      <div><span class="eyebrow">À la une</span><h2 style="margin:0">Dernières actualités</h2></div>
      <a class="link-arrow" href="actualites.html">Toutes les actualités <span class="arrow">→</span></a>
    </div>
    <div class="news-list" data-stagger>
      {news_item("20", "juin 2026", "Gala annuel", "42<sup>e</sup> gala : « La malle aux souvenirs »", "Salle des fêtes Eugène Vadot, 19 h. Éveil, danse fusion, hip-hop, classique et danse en ligne ont ouvert la malle à souvenirs.", "actualites.html#gala-2026")}
      {news_item("21", "juin 2025", "Gala annuel", "Gala de danse Olympe 2025", "Rendez-vous annuel de fin de saison à la salle des fêtes Eugène Vadot, à Plombières-lès-Dijon.", "actualites.html#gala-2025")}
      {news_item("03", "juin 2024", "Dans la presse", "« À 72 ans, elle préside depuis 40 ans son association de danse »", "Le Bien Public dresse le portrait de Martine Agostini, fondatrice d’Olympe, médaillée de la Jeunesse, des Sports et de l’Engagement associatif.", "actualites.html#presse-2024")}
    </div>
  </div>
</section>

{cta_band("Rejoignez la danse, on vous attend !")}
'''
    ld = '''<script type="application/ld+json">{"@context":"https://schema.org","@type":"SportsOrganization","name":"Olympe","description":"Association de danse et de loisirs chorégraphiques à Plombières-lès-Dijon","foundingDate":"1984","founder":{"@type":"Person","name":"Martine Agostini"},"telephone":"+33380414783","email":"michel.agostini21@orange.fr","address":{"@type":"PostalAddress","addressLocality":"Plombières-lès-Dijon","postalCode":"21370","addressRegion":"Bourgogne-Franche-Comté","addressCountry":"FR"},"sameAs":["https://www.facebook.com/p/Plombi%C3%A8res-Olympe-100063717665253/"]}</script>'''
    return page("index.html", "Olympe — Association de danse à Plombières-lès-Dijon",
                "Olympe, association de danse et de loisirs chorégraphiques à Plombières-lès-Dijon depuis 1984 : éveil, classique, hip-hop, danses du monde, pilates… dès 4 ans.",
                body, active="index.html", extra_head=ld)


def news_item(day, month, tag, title, text, href):
    return f'''<a class="news reveal" href="{href}" style="text-decoration:none">
  <div class="news-date"><b>{day}</b><span>{month}</span></div>
  <div><span class="meta">{tag}</span><h3>{title}</h3><p>{text}</p></div>
  <span class="link-arrow">Lire <span class="arrow">→</span></span>
</a>'''


# ---------------------------------------------------------------- L'ASSOCIATION
def association():
    tl = [
        ("1984", "Naissance d’Olympe", "L’association est créée sous le nom « USP Danse », avec une seule activité et huit fillettes de 8 ans. Martine Agostini la fonde en marge de sa carrière dans l’administration militaire."),
        ("2010", "Première distinction", "Martine Agostini est décorée de la médaille de la Jeunesse et des Sports et de l’Engagement associatif."),
        ("2014", "30 ans et un gala « Cabaret »", "Vingt chorégraphies enchaînées pendant trois heures à la salle Eugène-Vadot, pour fêter les trente ans de l’association."),
        ("2019", "Nouvelle reconnaissance", "La médaille de la Jeunesse, des Sports et de l’Engagement associatif vient de nouveau saluer l’engagement de la présidente."),
        ("2022", "« L’aventure humaine »", "Le gala du samedi 18 juin met en scène le thème de l’aventure humaine."),
        ("2024", "40e gala, 40 ans de présidence", "Olympe fête quarante ans d’une même présidente et un 40e gala réussi."),
        ("2026", "« La malle aux souvenirs »", "Le 42e gala, le 20 juin, ouvre la malle des souvenirs devant une salle des fêtes comble de familles et d’amis."),
    ]
    tl_html = "".join(f'<div class="tl-item reveal"><div class="tl-year">{y}</div><h3>{t}</h3><p>{p}</p></div>' for y, t, p in tl)
    values = [
        ("heart", "Le plaisir avant tout", "On danse parce que ça fait du bien : à 4 ans comme à 70, le corps et le cœur se mettent en mouvement."),
        ("hands", "Le lien", "Élèves, parents, monitrices, bénévoles : Olympe est d’abord un lieu où l’on se retrouve et où l’on se connaît."),
        ("spark", "Le dépassement", "Chaque saison se prépare pour monter sur scène au gala. Se surpasser, ensemble, avec bienveillance."),
        ("globe", "L’ouverture", "Classique, hip-hop, danses du monde, fusion, pilates : toutes les envies et tous les rythmes ont leur place."),
    ]
    values_html = "".join(f'<div class="value reveal">{ICONS[i]}<h3>{t}</h3><p>{p}</p></div>' for i, t, p in values)

    body = f'''
<section class="section">
  <div class="wrap split">
    <div class="reveal reveal--left">
      <span class="eyebrow">Qui sommes-nous</span>
      <h2>Une association de danse <em class="gold">pour tous</em>, au cœur de Plombières</h2>
      <p class="lead">Olympe a pour objet de promouvoir, d’exercer et de développer la pratique d’activités artistiques, chorégraphiques et de détente pour tout public.</p>
      <p>Association loi 1901 basée à Plombières-lès-Dijon, en Côte-d’Or, Olympe accueille les enfants dès 4 ans, les adolescents et les adultes autour de la danse — classique, modern’jazz, hip-hop, fusion, danses du monde, danse en ligne — mais aussi du yoga, du pilates et de la gym détente.</p>
      <p>Son grand rendez-vous : le gala annuel, chaque mois de juin, à la salle des fêtes Eugène Vadot.</p>
    </div>
    <div class="reveal reveal--right"><div class="photo"><img src="img/scene-groupe.jpg" alt="Le groupe d’Olympe sur la scène de la salle des fêtes" loading="lazy" width="1400" height="1050"></div><p class="photo-caption">Gala « La malle aux souvenirs », 20 juin 2026 · Photo : association Olympe</p></div>
  </div>
</section>

<section class="section section--night" id="valeurs">
  <div class="stars" data-stars="26"></div>
  <div class="wrap">
    <div class="reveal" style="max-width:640px;margin-bottom:44px"><span class="eyebrow">Nos valeurs</span><h2>Ce qui nous porte, sur scène comme en coulisses</h2></div>
    <div class="values" data-stagger>{values_html}</div>
  </div>
  {wave("cream")}
</section>

<section class="section" id="histoire">
  <div class="wrap split">
    <div class="reveal reveal--left" style="position:sticky;top:110px;align-self:start">
      <span class="eyebrow">Notre histoire</span>
      <h2>De huit fillettes à <em class="gold">des centaines de souvenirs</em></h2>
      <p class="lead">Quarante-deux ans de galas, de répétitions, de fous rires et de costumes cousus main.</p>
      <p class="todo"><span class="todo-label">À compléter par l’association</span>Souvenirs, anecdotes, chiffres (nombre d’adhérents, de monitrices…) : ce texte d’attente peut être enrichi à tout moment.</p>
    </div>
    <div class="timeline">{tl_html}</div>
  </div>
</section>

<section class="section founder" id="fondatrice">
  <div class="stars" data-stars="24"></div>
  <div class="wrap founder-grid">
    <div class="portrait reveal reveal--zoom" role="img" aria-label="Emplacement du portrait de Martine Agostini"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#logo"/></svg><b>Martine Agostini</b></div>
    <div class="reveal reveal--right">
      <span class="eyebrow">Le mot de la fondatrice</span>
      <h2>Martine Agostini, fondatrice et présidente</h2>
      <div class="medal">
        <span class="medal-disc" aria-hidden="true">★</span>
        <div><strong>Médaille d’Argent de la Jeunesse, des Sports et de l’Engagement associatif</strong><span>Distinctions reçues en 2010 et 2019</span></div>
      </div>
      <blockquote>
        <p class="big-quote">« J’aime la danse depuis l’enfance mais petite, je n’ai jamais pu la pratiquer. Ma mère m’avait dit qu’une fois adulte, je paierais mes cours. C’est ce que j’ai fait à 25 ans en rejoignant une école de danse classique à Chenôve. Ce fut une révélation. »</p>
        <p class="cite">Martine Agostini, propos recueillis par <em>Le Bien Public</em>, 3 juin 2024</p>
      </blockquote>
      <p>Plombiéroise d’origine, elle a dansé sept ans dans un corps de ballet, pratiqué la danse classique, la mazurka, la tarentelle, les danses indienne et égyptienne… et même la country line dance ! Elle préside Olympe depuis plus de quarante ans, en parallèle d’une carrière dans l’administration militaire.</p>
      <p class="todo"><span class="todo-label">Mot de bienvenue — texte d’attente</span>Martine, ce cadre est à vous : quelques lignes de bienvenue à votre image pourront remplacer ce texte.</p>
    </div>
  </div>
  {wave("cream")}
</section>

<section class="section" id="conseil">
  <div class="wrap">
    <div class="reveal" style="max-width:700px;margin-bottom:44px">
      <span class="eyebrow">Le conseil d’administration</span>
      <h2>Celles et ceux qui font vivre Olympe toute l’année</h2>
      <p class="lead">Organisation de l’association, préparation du gala, accueil des familles : le conseil d’administration accompagne Martine Agostini avec un travail considérable, tout au long de la saison.</p>
    </div>
    <div class="team" data-stagger>
      <div class="member reveal"><div class="avatar">MA</div><h3>Martine Agostini</h3><span class="role">Fondatrice et présidente</span></div>
      <div class="member member--ph reveal"><div class="avatar">?</div><h3>Nom à renseigner</h3><span class="role">Vice-présidente / Vice-président</span></div>
      <div class="member member--ph reveal"><div class="avatar">?</div><h3>Nom à renseigner</h3><span class="role">Secrétaire</span></div>
      <div class="member member--ph reveal"><div class="avatar">?</div><h3>Nom à renseigner</h3><span class="role">Trésorière / Trésorier</span></div>
    </div>
    <p class="reveal signature">— Martine Agostini, fondatrice et présidente, et le Conseil d’Administration d’Olympe</p>
    <div class="notice reveal" style="margin-top:34px">{ICONS["info"]}<p><strong>Envie de donner un coup de main ?</strong> Olympe est toujours à la recherche de bonnes volontés pour étoffer son équipe de bénévoles. <a href="contact.html#benevolat" style="color:var(--royal);font-weight:700">Proposer mon aide →</a></p></div>
  </div>
</section>

{cta_band()}
'''
    return page("association.html", "L’association Olympe — histoire, valeurs et fondatrice",
                "Découvrez Olympe, association de danse de Plombières-lès-Dijon fondée en 1984 par Martine Agostini, médaillée de la Jeunesse, des Sports et de l’Engagement associatif.",
                body, active="association.html", hero_img="img/scene-banniere.jpg", crumb="L’association",
                h1="L’<em class='gold'>association</em>", eyebrow="Notre histoire, nos valeurs",
                lead="Quarante-deux ans de danse partagée, portée par une fondatrice passionnée et une équipe de bénévoles.")


# ---------------------------------------------------------------- ACTIVITES
def activites():
    cards = [
        ("eveil-robes-jaunes.jpg", "Petites danseuses en robes jaunes lors du gala", "Dès 4 ans", "Éveil à la danse", "Premiers pas en musique : découvrir son corps, le rythme et le plaisir de danser avec les autres.", "Dès 4 ans"),
        ("classique-adage.jpg", "Danseuses classiques en tenues blanches", "Classique", "Initiation & danse classique", "Posture, grâce, musicalité : les bases de la danse classique, à partir de 7 ans.", "7 ans et plus"),
        ("fusion-ados.jpg", "Adolescents et monitrice en cours de danse sur scène", "Jazz", "Modern’jazz", "Énergie, souplesse et expression sur des musiques d’aujourd’hui — enfants, ados et adultes.", "Enfants · ados · adultes"),
        ("hiphop-groupe.jpg", "Groupe de hip-hop sur scène", "Hip-hop", "Hip-hop", "Rythme, groove et créativité en groupe, avec des cours selon les tranches d’âge.", "Enfants · ados · adultes"),
        ("fusion-duo.jpg", "Duo de danseuses en tenues pailletées", "Fusion", "Danse fusion", "Un mélange de styles pour inventer ses propres chorégraphies — enfants et adultes.", "Enfants · adultes"),
        ("danse-du-monde-rouge.jpg", "Danseuses en jupes rouges lors d’une danse du monde", "Voyage", "Danses du monde", "Israël, Irlande et bien d’autres : voyager sur des rythmes venus d’ailleurs.", "Adultes"),
        ("danse-en-ligne.jpg", "Groupe d’adultes en danse en ligne", "Convivialité", "Danse en ligne", "Des enchaînements en rangs, sans partenaire, dans la bonne humeur.", "Adultes"),
    ]
    cards_html = "".join(
        f'''<article class="card reveal"><div class="card-media"><img src="img/{i}" alt="{a}" loading="lazy" width="1400" height="1050"><span class="tag">{t}</span></div>
<div class="card-body"><span class="age-chip">{age}</span><h3>{h}</h3><p>{p}</p></div></article>'''
        for i, a, t, h, p, age in cards)
    icon_cards = [
        ("lotus", "Yoga", "Respirer, s’étirer, se recentrer : un moment de calme dans la semaine.", "Ados · adultes"),
        ("wave", "Pilates & Énergie Pilates", "Renforcer le centre du corps en douceur ou plus dynamique, avec deux créneaux le mercredi soir.", "Ados · adultes"),
        ("bolt", "Gym détente & renforcement", "Se dépenser, tonifier ses muscles et se détendre, sans pression.", "Adultes"),
    ]
    icon_html = "".join(
        f'''<article class="card card--icon reveal"><div class="card-media">{ICONS[ic]}</div><div class="card-body"><span class="age-chip">{age}</span><h3>{h}</h3><p>{p}</p></div></article>'''
        for ic, h, p, age in icon_cards)

    body = f'''
<section class="section">
  <div class="wrap">
    <div class="reveal" style="max-width:760px;margin-bottom:44px">
      <span class="eyebrow">Ce qu’on vous propose</span>
      <h2>Dix façons de <em class="gold">bouger, créer et se retrouver</em></h2>
      <p class="lead">Danse, bien-être, remise en forme : à Olympe, chacun trouve son rythme. L’offre exacte peut varier d’une saison à l’autre — demandez-nous la liste à jour.</p>
    </div>
    <div class="cards" data-stagger>{cards_html}{icon_html}</div>
  </div>
</section>

<section class="section section--peach" id="horaires">
  <div class="wrap">
    <div class="reveal" style="max-width:760px;margin-bottom:38px">
      <span class="eyebrow">Jours &amp; horaires</span>
      <h2>Quand et où danser ?</h2>
      <p class="todo"><span class="todo-label">À préciser par l’association</span>Horaires de la saison 2026-2027 : à confirmer auprès de Martine Agostini. Le tableau ci-dessous rappelle l’affiche de la saison 2025-2026 (reprise le lundi 15 septembre 2025) à titre indicatif.</p>
    </div>
    <div class="schedule-wrap reveal">
      <table class="schedule">
        <thead><tr><th>Jour</th><th>Activité</th><th>Public</th><th>Horaire</th><th>Lieu</th></tr></thead>
        <tbody>
          <tr><td class="day">Lundi</td><td>Cours ados / adultes</td><td>Ados · adultes</td><td>18 h 45 – 19 h 45</td><td>Salle de danse ou Centre social et culturel <em>(à confirmer)</em></td></tr>
          <tr><td class="day">Mercredi</td><td>Danse classique</td><td>7 ans et plus</td><td>13 h 15 – 14 h 30</td><td>Salle de danse</td></tr>
          <tr><td class="day">Mercredi</td><td>Pilates</td><td>Ados · adultes</td><td>18 h 20 – 19 h 20</td><td>Salle de danse</td></tr>
          <tr><td class="day">Mercredi</td><td>Énergie Pilates</td><td>Ados · adultes</td><td>19 h 30 – 20 h 30</td><td>Salle de danse</td></tr>
          <tr><td class="day">Jeudi</td><td>Gym détente</td><td>Adultes</td><td>17 h 50 – 18 h 50</td><td>Salle de danse</td></tr>
          <tr><td class="day"><em>Jour à confirmer</em></td><td>Hip-hop</td><td>13 ans et plus</td><td>8 h 45 – 10 h 15</td><td>Salle de danse</td></tr>
          <tr><td class="day"><em>Jour à confirmer</em></td><td>Hip-hop</td><td>6 – 12 ans</td><td>10 h 25 – 11 h 55</td><td>Salle de danse</td></tr>
        </tbody>
      </table>
    </div>
    <p class="photo-caption reveal">D’après l’affiche « Reprise des activités – saison 2025-2026 » publiée par la mairie. Les autres cours (éveil, modern’jazz, danse fusion, danses du monde, danse en ligne, yoga…) : horaires à demander à l’association.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="info-grid" data-stagger>
      <div class="info reveal"><h3>{ICONS["pin"]} Lieux</h3>
        <ul>
          <li><strong>Salle de danse</strong> — gymnase municipal, rue du Moulin, 21370 Plombières-lès-Dijon <em>(adresse de l’annuaire départemental, à confirmer)</em></li>
          <li><strong>Centre social et culturel</strong> de Plombières-lès-Dijon (certains cours)</li>
          <li><strong>Gala annuel</strong> — salle des fêtes « Eugène Vadot », rue du Château d’Eau</li>
        </ul>
      </div>
      <div class="info reveal"><h3>{ICONS["spark"]} Tarifs &amp; inscription</h3>
        <p class="todo"><span class="todo-label">À préciser par l’association</span>Tarifs de cotisation, pièces à fournir et dates d’inscription : à renseigner.</p>
        <ul><li>Séance d’essai possible : prenez d’abord contact avec Martine Agostini.</li><li>Chèques-Vacances acceptés <em>(selon le guide ANCV)</em>.</li></ul>
      </div>
      <div class="info reveal"><h3>{ICONS["clock"]} Rentrée</h3>
        <p>Les cours reprennent chaque année à la mi-septembre. Les dates de la saison en cours sont à demander à l’association, ou à suivre sur la page Facebook.</p>
        <a class="link-arrow" href="{FB}" target="_blank" rel="noopener">Suivre Olympe sur Facebook <span class="arrow">→</span></a>
      </div>
    </div>
  </div>
</section>

<section class="section section--night" id="gala">
  <div class="stars" data-stars="28"></div>
  <div class="wrap split">
    <div class="reveal reveal--left">
      <span class="eyebrow">Le grand rendez-vous</span>
      <h2>Le gala annuel : <em class="gold">toute la saison sur scène</em></h2>
      <p class="lead">Chaque mois de juin, Olympe présente un gala sur un thème nouveau à la salle des fêtes Eugène Vadot, pour mettre en scène le travail de l’année.</p>
      <p>Pour l’édition 2026 (« La malle aux souvenirs », 20 juin à 19 h) : <strong>6 € pour les adultes, 3 € pour les enfants de 5 à 14 ans</strong>. Places limitées : il est conseillé de réserver.</p>
      <a class="btn" href="actualites.html#gala-2026">Revoir le gala 2026 <span class="arrow">→</span></a>
    </div>
    <div class="reveal reveal--right" style="display:grid;justify-items:center"><img class="poster" src="img/affiche-gala-2026.jpg" alt="Affiche du gala « La malle aux souvenirs », samedi 20 juin 2026 à 19 h, salle des fêtes Eugène Vadot" loading="lazy" width="683" height="1024"></div>
  </div>
  {wave("cream")}
</section>

{cta_band("Un cours d’essai, ça vous dit ?")}
'''
    return page("activites.html", "Activités, horaires et lieux — Olympe, danse à Plombières-lès-Dijon",
                "Éveil à la danse, classique, modern’jazz, hip-hop, danse fusion, danses du monde, danse en ligne, yoga, pilates et gym détente avec Olympe à Plombières-lès-Dijon.",
                body, active="activites.html", hero_img="img/classique-robes-blanches.jpg", crumb="Activités",
                h1="Nos <em class='gold'>activités</em>", eyebrow="Danse · bien-être · plaisir",
                lead="Des premiers pas des tout-petits aux cours d’adultes : trouvez le vôtre.")


# ---------------------------------------------------------------- GALERIE
GALLERY = [
    # (fichier, catégorie, légende, alt)
    ("scene-malle.jpg", "gala", "Gala 2026 — la malle aux souvenirs sur scène", "La scène du gala avec la grande malle et le globe"),
    ("classique-robes-blanches.jpg", "classique", "Classique — robes blanches à plumes", "Jeunes danseuses en robes blanches à plumes"),
    ("fusion-duo.jpg", "fusion", "Danse fusion — duo", "Deux danseuses en duo sur scène"),
    ("eveil-robes-jaunes.jpg", "classique", "Éveil — petites robes jaunes", "Enfants en robes jaunes pendant leur chorégraphie"),
    ("danse-en-ligne.jpg", "adultes", "Danse en ligne — adultes", "Adultes en rangs pour une danse en ligne"),
    ("hiphop-groupe.jpg", "hiphop", "Hip-hop — le groupe", "Élèves de hip-hop en tenues sombres"),
    ("voiles.jpg", "fusion", "Voiles colorés", "Danseuses avec des voiles rouges et bleus"),
    ("classique-adage.jpg", "classique", "Classique — adage", "Danseuses en blanc, à genoux et bras tendus"),
    ("finale-malle.jpg", "gala", "Le final autour de la malle", "Tous les danseurs réunis sur scène pour le final"),
    ("danse-du-monde-rouge.jpg", "hiphop", "Danses du monde — jupes rouges", "Deux danseuses en jupes rouges à côté de la malle"),
    ("eveil-ronde.jpg", "classique", "Éveil — la ronde", "Petites filles en robes bleues, assises et debout"),
    ("hiphop-trio.jpg", "hiphop", "Hip-hop — le trio", "Trois danseurs en pleine chorégraphie hip-hop"),
    ("fusion-ados.jpg", "fusion", "Modern’jazz — les ados et leur monitrice", "Ados dansant avec leur monitrice"),
    ("scene-groupe.jpg", "gala", "Le groupe en tenues rouges et noires", "Groupe en tenues rouges et noires devant la malle"),
    ("danse-en-ligne-2.jpg", "adultes", "Danse en ligne — en rythme", "Groupe d’adultes en danse en ligne"),
    ("eveil-danse.jpg", "classique", "Éveil — premières chorégraphies", "Enfants dansant en robes pastel"),
    ("fusion-adultes.jpg", "fusion", "Danse fusion — adultes", "Danseuses et danseurs adultes en pleine action"),
    ("scene-banniere.jpg", "gala", "La banderole Olympe", "Danseurs sur scène sous la banderole Olympe"),
    ("eveil-assises.jpg", "classique", "Éveil — assises sur scène", "Enfants assises et à genoux sur scène"),
    ("finale-rouge.jpg", "gala", "Finale en rouge", "Groupe en tenues rouges pour le final"),
]


def galerie():
    shots = "".join(
        f'''<figure class="shot reveal" data-cat="{c}" data-full="img/{f}" tabindex="0" role="button" aria-label="Agrandir : {cap}"><img src="img/{f}" alt="{alt}" loading="lazy" width="1400" height="1050"><figcaption>{cap}</figcaption></figure>'''
        for f, c, cap, alt in GALLERY)
    body = f'''
<section class="section">
  <div class="wrap">
    <div class="reveal" style="max-width:720px;margin-bottom:30px">
      <span class="eyebrow">Souvenirs</span>
      <h2>Le gala 2026 « La malle aux souvenirs », en images</h2>
      <p class="lead">Photos classées par activité. Cliquez sur une image pour l’agrandir, puis naviguez avec les flèches.</p>
    </div>
    <div class="filters reveal" role="group" aria-label="Filtrer les photos par activité">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">Toutes</button>
      <button class="chip" type="button" data-filter="classique" aria-pressed="false">Éveil &amp; classique</button>
      <button class="chip" type="button" data-filter="fusion" aria-pressed="false">Fusion &amp; modern’jazz</button>
      <button class="chip" type="button" data-filter="hiphop" aria-pressed="false">Hip-hop &amp; danses du monde</button>
      <button class="chip" type="button" data-filter="adultes" aria-pressed="false">Danse en ligne</button>
      <button class="chip" type="button" data-filter="gala" aria-pressed="false">Gala &amp; scène</button>
    </div>
    <div class="masonry" id="gallery">{shots}</div>
    <p class="photo-caption">Photos : association Olympe, gala du 20 juin 2026 (salle des fêtes Eugène Vadot). <span class="todo">À compléter : ajoutez vos propres photos dans le dossier <code>img/</code> et dans la liste de cette page.</span></p>
  </div>
</section>

<dialog class="lightbox" id="lightbox" aria-label="Visionneuse photo">
  <div class="lb-inner"><img src="" alt=""><p class="lb-cap"></p></div>
  <button class="lb-btn lb-close" type="button" aria-label="Fermer">✕</button>
  <button class="lb-btn lb-prev" type="button" aria-label="Photo précédente">‹</button>
  <button class="lb-btn lb-next" type="button" aria-label="Photo suivante">›</button>
</dialog>

{cta_band("Vous aussi, montez sur scène !")}
'''
    return page("galerie.html", "Galerie photos — Olympe, danse à Plombières-lès-Dijon",
                "Les photos du gala d’Olympe « La malle aux souvenirs » (juin 2026), classées par activité : éveil, classique, hip-hop, danses du monde, danse en ligne.",
                body, active="galerie.html", hero_img="img/finale-malle.jpg", crumb="Galerie",
                h1="La <em class='gold'>galerie</em>", eyebrow="Des souvenirs en lumière",
                lead="Les plus beaux moments du gala, classés par activité.")


# ---------------------------------------------------------------- ACTUALITES
def actualites():
    body = f'''
<section class="section">
  <div class="wrap">
    <div class="reveal" style="max-width:720px;margin-bottom:34px"><span class="eyebrow">Prochains rendez-vous</span><h2>À noter dans l’agenda</h2></div>
    <div class="info-grid" data-stagger>
      <div class="info reveal"><h3>{ICONS["clock"]} Saison 2026-2027</h3><p class="todo"><span class="todo-label">À confirmer</span>Cours en cours : séance d’essai possible sur contact préalable avec Martine Agostini. Dates et horaires à préciser.</p></div>
      <div class="info reveal"><h3>{ICONS["spark"]} Prochain gala</h3><p class="todo"><span class="todo-label">Date à annoncer</span>Le gala annuel a lieu chaque année en juin, à la salle des fêtes Eugène Vadot. Thème et date de la prochaine édition à communiquer.</p></div>
      <div class="info reveal"><h3>{ICONS["heart"]} Rejoindre l’équipe</h3><p>Bénévoles et nouveaux adhérents sont toujours les bienvenus.</p><a class="link-arrow" href="contact.html">Nous contacter <span class="arrow">→</span></a></div>
    </div>
  </div>
</section>

<section class="section section--peach">
  <div class="wrap">
    <div class="reveal" style="max-width:720px;margin-bottom:34px"><span class="eyebrow">Dernières nouvelles</span><h2>La vie d’Olympe</h2></div>
    <div class="news-list" data-stagger>
      <article class="news reveal" id="gala-2026"><div class="news-date"><b>20</b><span>juin 2026</span></div>
        <div><span class="meta">Gala annuel</span><h3>42<sup>e</sup> gala : « La malle aux souvenirs »</h3><p>Samedi 20 juin 2026, 19 h, salle des fêtes Eugène Vadot. Éveil, danse fusion enfants, hip-hop, classique, danse fusion adultes et danse en ligne. Entrée 6 € (adultes) / 3 € (enfants de 5 à 14 ans).</p></div>
        <a class="link-arrow" href="galerie.html">Voir les photos <span class="arrow">→</span></a></article>
      <article class="news reveal" id="rentree-2025"><div class="news-date"><b>15</b><span>sept. 2025</span></div>
        <div><span class="meta">Rentrée</span><h3>Reprise des activités 2025-2026</h3><p>Reprise des cours le lundi 15 septembre 2025 : danse classique, pilates, énergie pilates, gym détente, hip-hop et plus encore.</p></div>
        <a class="link-arrow" href="activites.html#horaires">Horaires <span class="arrow">→</span></a></article>
      <article class="news reveal" id="gala-2025"><div class="news-date"><b>21</b><span>juin 2025</span></div>
        <div><span class="meta">Gala annuel</span><h3>Gala de danse Olympe 2025</h3><p>Le rendez-vous de fin de saison, à 19 h, à la salle des fêtes Eugène Vadot de Plombières-lès-Dijon.</p></div>
        <a class="link-arrow" href="https://plombieres-les-dijon.fr/event/gala-de-danse-olympe-3/" target="_blank" rel="noopener">Fiche mairie <span class="arrow">→</span></a></article>
      <article class="news reveal" id="gala-2024"><div class="news-date"><b>04</b><span>sept. 2024</span></div>
        <div><span class="meta">Rentrée</span><h3>Après un 40<sup>e</sup> gala réussi, on reprend !</h3><p>Olympe invitait à la rejoindre dès le lundi 9 septembre 2024 pour une nouvelle saison, avec séance d’essai possible sur contact préalable.</p></div>
        <a class="link-arrow" href="{FB}" target="_blank" rel="noopener">Facebook <span class="arrow">→</span></a></article>
      <article class="news reveal" id="presse-2024"><div class="news-date"><b>03</b><span>juin 2024</span></div>
        <div><span class="meta">Dans la presse</span><h3>« À 72 ans, elle préside depuis 40 ans son association de danse »</h3><p>Le Bien Public fait le portrait de Martine Agostini, fondatrice d’Olympe, décorée de la médaille de la Jeunesse et des Sports et de l’Engagement associatif.</p></div>
        <a class="link-arrow" href="https://www.bienpublic.com/societe/2024/06/03/a-72-ans-elle-preside-depuis-40-ans-son-association-de-danse" target="_blank" rel="noopener">Lire l’article <span class="arrow">→</span></a></article>
      <article class="news reveal" id="gala-2014"><div class="news-date"><b>04</b><span>juin 2014</span></div>
        <div><span class="meta">Dans la presse</span><h3>30 ans d’Olympe : « ils ont dansé comme des dieux »</h3><p>Vingt chorégraphies sur le thème « Cabaret » pour fêter le trentième anniversaire de l’association.</p></div>
        <a class="link-arrow" href="https://www.bienpublic.com/edition-dijon-agglo/2014/06/04/plombieres-les-dijon-ils-ont-danse-comme-des-dieux" target="_blank" rel="noopener">Lire l’article <span class="arrow">→</span></a></article>
    </div>
  </div>
</section>

<section class="section section--night">
  <div class="stars" data-stars="24"></div>
  <div class="wrap split">
    <div class="reveal reveal--left"><span class="eyebrow">Suivre Olympe</span><h2>Toute l’actualité sur Facebook</h2><p class="lead">Reprises, galas, photos : la page Facebook d’Olympe est mise à jour au fil de la saison.</p><a class="btn" href="{FB}" target="_blank" rel="noopener">Ouvrir la page Facebook <span class="arrow">→</span></a></div>
    <div class="reveal reveal--right" style="display:grid;justify-items:center"><img class="poster" src="img/affiche-gala-2026.jpg" alt="Affiche du gala du 20 juin 2026" loading="lazy" width="683" height="1024"></div>
  </div>
  {wave("cream")}
</section>

{cta_band()}
'''
    return page("actualites.html", "Actualités et événements — Olympe, danse à Plombières-lès-Dijon",
                "Prochains rendez-vous et dernières nouvelles d’Olympe : gala annuel, reprise des cours, articles de presse sur l’association de danse de Plombières-lès-Dijon.",
                body, active="actualites.html", hero_img="img/scene-groupe.jpg", crumb="Actualités",
                h1="<em class='gold'>Actualités</em> &amp; événements", eyebrow="La vie de l’association",
                lead="Prochains rendez-vous, galas et nouvelles d’Olympe.")


# ---------------------------------------------------------------- CONTACT
def contact():
    body = f'''
<section class="section">
  <div class="wrap">
    <div class="welcome reveal">« Bienvenue chez Olympe ! Que vous ayez 4 ans ou 70, que vous n’ayez jamais dansé ou que vous rêviez de remonter sur scène, il y a une place pour vous. N’hésitez pas : appelez-nous, écrivez-nous, venez essayer. » <span style="display:block;font:600 .95rem var(--font-body);margin-top:.6em;color:var(--muted)">— Martine Agostini et le Conseil d’Administration</span></div>
  </div>
</section>

<section class="section" style="padding-top:0" id="adhesion">
  <div class="wrap">
    <div class="info-grid" data-stagger>
      <div class="info reveal"><h3>{ICONS["spark"]} Adhésion &amp; séance d’essai</h3><p>Une séance d’essai est possible : prenez d’abord contact avec Martine Agostini, puis venez tester le cours qui vous tente.</p>
        <p class="todo"><span class="todo-label">À préciser par l’association</span>Modalités d’adhésion : dates d’inscription, tarifs de cotisation, pièces à fournir (certificat médical, etc.).</p></div>
      <div class="info reveal" id="benevolat"><h3>{ICONS["hands"]} Bénévolat</h3><p>L’association fonctionne grâce à l’énergie de ses bénévoles et de son conseil d’administration. Organisation du gala, accueil, costumes, logistique… chaque coup de main compte.</p>
        <p class="todo"><span class="todo-label">À préciser par l’association</span>Missions proposées et disponibilités recherchées.</p></div>
    </div>
  </div>
</section>

<section class="section section--peach" id="formulaire">
  <div class="wrap contact-grid">
    <div class="reveal reveal--left">
      <span class="eyebrow">Écrivez-nous</span>
      <h2>Un message, une question ?</h2>
      <form class="form" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="Nouveau message du site Olympe (%{{submissionId}})">
        <p class="hidden"><label>Ne pas remplir : <input name="bot-field"></label></p>
        <div class="field-row">
          <div class="field"><label for="nom">Votre nom *</label><input id="nom" name="nom" type="text" autocomplete="name" required></div>
          <div class="field"><label for="email">Votre e-mail *</label><input id="email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="tel">Téléphone (facultatif)</label><input id="tel" name="telephone" type="tel" autocomplete="tel"></div>
          <div class="field"><label for="objet">Votre demande</label>
            <select id="objet" name="objet">
              <option>Adhésion / séance d’essai</option><option>Bénévolat</option><option>Gala / réservation</option><option>Autre question</option>
            </select></div>
        </div>
        <div class="field"><label for="message">Votre message *</label><textarea id="message" name="message" required></textarea></div>
        <label class="check"><input type="checkbox" name="consentement" required> J’accepte que ces informations soient utilisées pour me répondre (voir les <a href="mentions-legales.html#donnees" style="color:var(--royal)">mentions légales</a>).</label>
        <button class="btn" type="submit">Envoyer mon message <span class="arrow">→</span></button>
      </form>
    </div>
    <div class="reveal reveal--right">
      <span class="eyebrow">Coordonnées</span>
      <h2>Parlons-en</h2>
      <div class="coords">
        <div class="coord">{ICONS["phone"]}<div><b>Téléphone</b><a href="tel:{TEL_HREF}">{TEL}</a> · <a href="tel:{MOBILE_HREF}">{MOBILE}</a></div></div>
        <div class="coord">{ICONS["mail"]}<div><b>E-mail</b><a href="mailto:{MAIL}">{MAIL}</a></div></div>
        <div class="coord">{ICONS["pin"]}<div><b>Salle de danse</b>{LIEU}<br><small>(adresse de l’annuaire départemental — à confirmer)</small></div></div>
        <div class="coord">{ICONS["fb"]}<div><b>Facebook</b><a href="{FB}" target="_blank" rel="noopener">Plombières Olympe</a></div></div>
      </div>
      <div class="map" style="margin-top:22px">
        <iframe title="Plan : Plombières-lès-Dijon" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=4.940%2C47.315%2C5.010%2C47.350&amp;layer=mapnik&amp;marker=47.3315%2C4.9740"></iframe>
        <div class="map-foot"><span>Plombières-lès-Dijon (21370)</span><a class="link-arrow" href="https://www.openstreetmap.org/search?query=rue%20du%20Moulin%2C%2021370%20Plombi%C3%A8res-l%C3%A8s-Dijon" target="_blank" rel="noopener">Agrandir le plan <span class="arrow">→</span></a></div>
      </div>
    </div>
  </div>
  {wave("cream")}
</section>
'''
    return page("contact.html", "Contact et adhésion — Olympe, danse à Plombières-lès-Dijon",
                "Rejoignez Olympe : adhésion, séance d’essai, bénévolat. Formulaire de contact, coordonnées et plan de l’association de danse de Plombières-lès-Dijon.",
                body, active="contact.html", hero_img="img/danse-en-ligne-2.jpg", crumb="Contact",
                h1="Nous <em class='gold'>rejoindre</em>", eyebrow="Contact · Adhésion · Bénévolat",
                lead="Une question, une envie d’essayer, un coup de main à proposer ? Écrivez-nous ou appelez-nous.")


def merci():
    body = f'''
<section class="section">
  <div class="wrap" style="text-align:center;max-width:680px">
    <span class="eyebrow">Message envoyé</span>
    <h2>Merci, à très vite sur le parquet !</h2>
    <p class="lead" style="margin-inline:auto">Votre message est bien parti. L’association vous répondra dès que possible.</p>
    <a class="btn btn--ink" href="index.html">Retour à l’accueil <span class="arrow">→</span></a>
  </div>
</section>'''
    return page("merci.html", "Message envoyé — Olympe", "Votre message a bien été envoyé à l’association Olympe.", body,
                plain_hero=True, crumb="Merci", h1="Merci&nbsp;!", noindex=True)


# ---------------------------------------------------------------- MENTIONS LEGALES
def mentions():
    body = f'''
<section class="section">
  <div class="wrap prose">
    <h2>Éditeur du site</h2>
    <p><strong>Association Olympe</strong>, association régie par la loi du 1<sup>er</sup> juillet 1901, dont l’objet est de promouvoir, exercer et développer la pratique d’activités artistiques, chorégraphiques et de détente pour tout public.</p>
    <ul>
      <li>Siège / lieu d’activité : {LIEU} <span class="todo">adresse du siège à confirmer</span></li>
      <li>Directrice de la publication : Martine Agostini, fondatrice et présidente</li>
      <li>Téléphone : <a href="tel:{TEL_HREF}">{TEL}</a> · <a href="tel:{MOBILE_HREF}">{MOBILE}</a></li>
      <li>E-mail : <a href="mailto:{MAIL}">{MAIL}</a></li>
      <li>N° RNA / SIRET : <span class="todo">à renseigner</span></li>
    </ul>
    <h2>Hébergement</h2>
    <p>Ce site est hébergé par Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener">www.netlify.com</a>.</p>
    <h2 id="donnees">Données personnelles</h2>
    <p>Le formulaire de contact recueille votre nom, votre adresse e-mail, éventuellement votre téléphone et votre message, uniquement pour répondre à votre demande (adhésion, séance d’essai, bénévolat, gala…). Ces données sont transmises via le service Netlify Forms, ne sont ni vendues ni cédées, et sont conservées le temps nécessaire au traitement de votre demande.</p>
    <p>Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition, que vous pouvez exercer en écrivant à <a href="mailto:{MAIL}">{MAIL}</a>. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).</p>
    <h2>Cookies et suivi</h2>
    <p>Ce site n’utilise ni cookie publicitaire ni outil de mesure d’audience. Les polices de caractères sont hébergées sur le site lui-même. Le plan de la page Contact est fourni par OpenStreetMap, qui peut déposer ses propres cookies lors de son chargement.</p>
    <h2>Propriété intellectuelle &amp; crédits</h2>
    <p>Le logo, les affiches et les photographies des galas proviennent de l’association Olympe ; leur reproduction sans autorisation est interdite. Les photos du gala 2026 ont été fournies par l’association. Les articles cités (<em>Le Bien Public</em>) restent la propriété de leurs éditeurs : seuls des liens et de courts extraits sont proposés.</p>
    <p>Les personnes photographiées, y compris les enfants, l’ont été dans le cadre d’un spectacle public. Toute personne souhaitant le retrait d’une image peut en faire la demande à l’adresse ci-dessus.</p>
    <p class="todo"><span class="todo-label">À vérifier par l’association</span>Autorisations de droit à l’image des élèves et des parents à confirmer avant toute nouvelle publication de photos.</p>
    <h2>Liens externes</h2>
    <p>Olympe n’est pas responsable du contenu des sites vers lesquels ce site renvoie (Facebook, presse, mairie de Plombières-lès-Dijon…).</p>
  </div>
</section>'''
    return page("mentions-legales.html", "Mentions légales — Olympe, danse à Plombières-lès-Dijon",
                "Mentions légales du site de l’association Olympe, association de danse de Plombières-lès-Dijon : éditeur, hébergeur, données personnelles, crédits.",
                body, active="mentions-legales.html", plain_hero=True, crumb="Mentions légales", h1="Mentions <em class='gold'>légales</em>")


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
           '<rect x="4" y="4" width="92" height="92" rx="9" fill="#2a3d9c" stroke="#0b1544" stroke-width="4"/>'
           '<path d="M8 8h30c6 28 10 52 14 84H8z" fill="#e4675f"/><circle cx="47" cy="25" r="7" fill="#fff7ec"/>'
           '<g fill="none" stroke="#fff7ec" stroke-linecap="round" stroke-linejoin="round">'
           '<path d="M47 35c0 14 2 26 6 38" stroke-width="9"/><path d="M44 38 30 14" stroke-width="5"/>'
           '<path d="M49 40c13 1 23-1 33-5" stroke-width="5"/><path d="M53 71c10-2 20 0 30 10" stroke-width="6"/>'
           '<path d="M51 73c-2 9-3 15-5 21" stroke-width="6"/></g></svg>')

def not_found():
    import re
    html = page("404.html", "Page introuvable — Olympe", "Cette page n’existe pas.",
        '<section class="section"><div class="wrap" style="text-align:center;max-width:640px"><span class="eyebrow">Erreur 404</span><h2>Oups, cette danse n’est pas au programme.</h2><p class="lead" style="margin-inline:auto">La page demandée est introuvable. Retournons sur la piste !</p><a class="btn btn--ink" href="index.html">Retour à l’accueil <span class="arrow">→</span></a></div></section>',
        plain_hero=True, crumb="404", h1="Page <em class='gold'>introuvable</em>", noindex=True)
    # la 404 peut être servie depuis n'importe quel chemin : liens et ressources en absolu
    return re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|/)', r'\1="/', html)


if __name__ == "__main__":
    pages = {
        "index.html": home(), "association.html": association(), "activites.html": activites(),
        "galerie.html": galerie(), "actualites.html": actualites(), "contact.html": contact(),
        "mentions-legales.html": mentions(), "merci.html": merci(), "404.html": not_found(),
    }
    for name, html in pages.items():
        (OUT / name).write_text(html, encoding="utf-8")
    (OUT / "favicon.svg").write_text(FAVICON, encoding="utf-8")
    print("Pages générées :", ", ".join(pages))
