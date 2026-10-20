#!/usr/bin/env python3
"""Génère les pages HTML du site de l'Association Yin Yang (Besançon).

Usage : python3 tools/build_yinyang.py
Sortie : yinyang/*.html (dossier à publier tel quel sur Netlify).
Les contenus proviennent du site historique asso-yinyang.fr (publications de l'association).
"""
import html
import os
import re
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'yinyang')
SITE = 'https://association-yin-yang-besancon.netlify.app'
FB = 'https://www.facebook.com/p/Association-Yin-Yang-100084397008641/'
OLD_SITE = 'https://www.asso-yinyang.fr/'
PAY = 'https://www.monetico-online-asso.com/association-yin-yang/accueil'
PHONE_DISPLAY = '06 32 59 63 03'
PHONE_TEL = '+33632596303'

NAV = [
    ('index.html', 'Accueil'),
    ('association.html', 'L’association'),
    ('activites.html', 'Activités'),
    ('galerie.html', 'Galerie'),
    ('actualites.html', 'Actualités'),
]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
ICON_CARD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>'
ICON_FB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/></svg>'

RING = ('<svg class="ring" viewBox="0 0 200 200" aria-hidden="true" focusable="false">'
        '<circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="1.5"/>'
        '<path d="M100 4a48 48 0 0 1 0 96 48 48 0 0 0 0 96A96 96 0 0 1 100 4z" fill="currentColor"/>'
        '<circle cx="100" cy="52" r="9" fill="#15110f"/><circle cx="100" cy="148" r="9" fill="currentColor"/></svg>')

WAVE = ('<div class="divider divider--{c}" aria-hidden="true"><svg viewBox="0 0 1440 80" preserveAspectRatio="none">'
        '<path d="M0 46C150 86 330 6 540 34s390 62 600 14c110-25 220-24 300 6V80H0z"/></svg></div>')

# --------------------------------------------------------------------------
# Données
# --------------------------------------------------------------------------
# (jour, heure, lieu, précision, pratique, moment, nouveauté)
COURSES = [
    ('Lundi', '10h00', 'Saint-Claude', 'rue Francis Clerc', 'tc', 'matin', False),
    ('Lundi', '18h45', 'Salle de l’Aiglon', 'Chaprais · 21 rue de l’Église', 'tc', 'soir', False),
    ('Lundi', '19h15', 'Maison de quartier des Montboucons', '', 'tc', 'soir', False),
    ('Mardi', '9h00', 'Maison de quartier de Bregille', '', 'mix', 'matin', False),
    ('Mardi', '9h15', 'Avanne', '', 'tc', 'matin', True),
    ('Mardi', '17h30', 'Maison de quartier de Bregille', '', 'tc', 'soir', False),
    ('Mercredi', '8h45', 'Saint-Claude', 'rue Francis Clerc', 'tc', 'matin', False),
    ('Mercredi', '18h00', 'Maison de quartier de la Grette', '', 'tc', 'soir', False),
    ('Jeudi', '14h00', 'La Cassotte', 'Chaprais', 'qg', 'apres-midi', False),
    ('Vendredi', '14h30', 'Maison de quartier de Montrapon', '', 'tc', 'apres-midi', False),
    ('Samedi', '10h00', 'Parc Micaud', 'en plein air', 'tc', 'matin', False),
]
PRACTICE = {
    'tc': ('Tai Chi', 'tai-chi', 'pill--tc'),
    'qg': ('Qi Gong', 'qi-gong', 'pill--qg'),
    'mix': ('Tai Chi &amp; Qi Gong', 'tai-chi qi-gong', 'pill--mix'),
}
DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

# (fichier, légende, catégories)
GALLERY = [
    ('micaud-journee-mondiale', 'Journée mondiale du Tai Chi au Parc Micaud — 21 mars 2026', 'evenements plein-air'),
    ('stage-ateliers-resal', 'Stage en ateliers au gymnase Résal — 28 mars 2026', 'stages'),
    ('trouve-ton-sport-taichi', 'Démonstration de Tai Ji Quan, « Trouve ton sport » — 29 août 2026', 'evenements plein-air'),
    ('stage-eventail-shan', 'Tai Ji Shan (éventail) — stage du 28 mars 2026', 'stages'),
    ('gare-eau-cercles', 'Qi Gong des cercles à la Gare d’eau — été 2026', 'plein-air'),
    ('stage-taichi-mains-nues', 'Tai Ji Quan à mains nues — stage du 28 mars 2026', 'stages'),
    ('trouve-ton-sport-stand', 'Le stand Yin Yang au stade Léo-Lagrange — 29 août 2026', 'evenements'),
    ('grette-decouverte-1', 'Séance découverte gratuite à la Grette — août 2026', 'plein-air'),
    ('stage-epee-jian', 'Tai Ji Jian (épée) — stage du 28 mars 2026', 'stages'),
    ('gare-eau-eventail', 'Tai Chi avec éventail à la Gare d’eau — été 2026', 'plein-air'),
    ('ag-qigong', 'Qi Gong lors de la 18e assemblée générale, à Bregille — 7 février 2026', 'evenements salle'),
    ('trouve-ton-sport-baton', 'Tai Ji Gun (bâton) — 29 août 2026', 'evenements plein-air'),
    ('stage-serpent-rodolphe', 'Stage de Tai Chi, style du serpent — janvier 2025', 'stages salle'),
    ('trouve-ton-sport-epee', 'Tai Ji Jian (épée) — 29 août 2026', 'evenements plein-air'),
    ('gare-eau-saisir', '« Saisir la queue de l’oiseau » à la Gare d’eau — été 2026', 'plein-air'),
    ('cours-singe-2023', 'Cours de Tai Chi, posture du singe — mars 2023', 'salle'),
    ('trouve-ton-sport-eventail', 'Tai Ji Shan (éventail) — 29 août 2026', 'evenements plein-air'),
    ('grette-decouverte-2', 'Séance découverte à la Grette — août 2026', 'plein-air'),
    ('stage-grette-2024', 'Stage en ateliers à la Grette — novembre 2024', 'stages salle'),
    ('journee-olympique-baton', 'Journée Olympique avec des classes — 31 mars 2026', 'evenements salle'),
    ('cours-bregille', 'Cours à la maison de quartier de Bregille — 2021', 'salle'),
    ('forum-bregille', 'Accueil et inscriptions au Forum de Bregille — 5 septembre 2026', 'evenements'),
]

# (iso, date affichée, cat, titre, texte, image|None, jour/mois pour la tuile, à venir)
NEWS = [
    ('2026-10-26', '26 → 28 octobre 2026', 'stage', 'Stage de Taiji quan, style Yang du serpent',
     'Stage tous niveaux avec Thierry Baë à Châteauneuf-de-Gadagne (Vaucluse), organisé hors association. Programme et inscription sur hua-bae.fr/stages.',
     None, ('26', 'oct.'), True),
    ('2026-10-03', 'Samedi 3 octobre 2026', 'stage', 'Stage en ateliers ouvert à tous',
     'Un après-midi d’ateliers au gymnase Résal pour découvrir ou approfondir Qi Gong, Tai Chi et pratiques avec armes.',
     None, ('3', 'oct.'), False),
    ('2026-09-14', '14 septembre 2026', 'pratique', 'La nouvelle saison est lancée',
     'Reprise des cours dans toute la ville, un nouveau cours de Tai Chi à Avanne et la possibilité de régler sa participation en ligne.',
     None, ('14', 'sept.'), False),
    ('2026-08-29', 'Samedi 29 août 2026', 'evt', '« Trouve ton sport » au stade Léo-Lagrange',
     'De 10 h à 17 h, rencontres avec les animateurs, essais, démonstrations de Tai Ji Quan, bâton, épée et éventail, inscriptions.',
     'trouve-ton-sport-stand', None, False),
    ('2026-08-19', '19 et 26 août 2026', 'evt', 'Séances découverte gratuites à la Grette',
     'Deux soirées en plein air, à partir de 17 h 30, pour découvrir la richesse du Wu Shu : Qi Gong, Tai Chi, armes.',
     'grette-decouverte-1', None, False),
    ('2026-07-04', 'Été 2026', 'pratique', 'L’été en plein air',
     'Tous les samedis à 10 h à la Gare d’eau, et les lundis de 16 h 30 à 19 h 30 pour « Quartier d’été » à Montrapon.',
     'gare-eau-saisir', None, False),
    ('2026-06-13', '13 et 14 juin 2026', 'stage', 'Stage de Tai Chi, style du serpent',
     'Deux journées de 9 h à 17 h au gymnase Jean Zay (Palente) pour découvrir ou approfondir les principes du style du serpent.',
     None, ('13', 'juin'), False),
    ('2026-04-15', 'Mercredi 15 avril 2026', 'evt', 'Kids Run à Montrapon',
     'L’association participe à cette opération qui fait découvrir aux enfants différentes activités sportives.',
     None, ('15', 'avril'), False),
    ('2026-03-31', 'Mardi 31 mars 2026', 'evt', 'Journée Olympique avec les écoles',
     'Plusieurs membres ont initié des classes au Tai Chi et au travail du bâton lors de la Journée Olympique.',
     'journee-olympique-baton', None, False),
    ('2026-03-28', 'Samedi 28 mars 2026', 'stage', 'Stage : 9 ateliers au gymnase Résal',
     'Qi Gong, Tai Ji Quan à mains nues, épée, éventail… un stage pour goûter à différentes facettes du Wu Shu.',
     'stage-ateliers-resal', None, False),
    ('2026-03-21', 'Samedi 21 mars 2026', 'evt', 'Journée mondiale du Tai Chi',
     'Démonstrations et ateliers de découverte au Parc Micaud, de 10 h à midi.',
     'micaud-journee-mondiale', None, False),
    ('2026-02-07', '7 et 18 février 2026', 'vie', '18e assemblée générale et nouvelle équipe',
     'Une cinquantaine d’adhérents à Bregille pour l’AG, la pratique et le Nouvel An chinois. Maria Craveiro devient présidente.',
     'ag-qigong', None, False),
]
CAT = {
    'evt': ('Événement', 'tag--evt'),
    'stage': ('Stage', 'tag--stage'),
    'vie': ('Vie de l’association', 'tag--vie'),
    'pratique': ('Pratique', ''),
}

VENUES = [
    ('Saint-Claude (rue Francis Clerc)', 'Saint-Claude rue Francis Clerc Besançon'),
    ('Salle de l’Aiglon (21 rue de l’Église)', 'Salle de l\'Aiglon 21 rue de l\'Église Besançon'),
    ('Maison de quartier des Montboucons', 'Maison de quartier des Montboucons Besançon'),
    ('Maison de quartier de Bregille', 'Maison de quartier de Bregille Besançon'),
    ('Avanne', 'Avanne-Aveney'),
    ('Maison de quartier de la Grette', 'Maison de quartier de la Grette Besançon'),
    ('La Cassotte (Chaprais)', 'La Cassotte Chaprais Besançon'),
    ('Maison de quartier de Montrapon', 'Maison de quartier de Montrapon Besançon'),
    ('Parc Micaud', 'Parc Micaud Besançon'),
    ('Gymnase Résal (stages)', 'Gymnase Résal Besançon'),
    ('Gymnase Jean Zay, Palente (stages)', 'Gymnase Jean Zay Palente Besançon'),
]

# --------------------------------------------------------------------------
# Outils
# --------------------------------------------------------------------------
def esc(s):
    return html.escape(s, quote=True)


def img(name, alt, cls='', lazy=True, ext='webp', extra=''):
    path = os.path.join(ROOT, 'img', f'{name}.{ext}')
    w, h = Image.open(path).size
    return (f'<img src="img/{name}.{ext}" alt="{esc(alt)}" width="{w}" height="{h}"'
            f'{" class=" + chr(34) + cls + chr(34) if cls else ""}'
            f'{" loading=" + chr(34) + "lazy" + chr(34) + " decoding=" + chr(34) + "async" + chr(34) if lazy else ""}{extra}>')


def typo(s):
    """Espaces insécables de la typographie française, appliquées au texte uniquement."""
    def fix(m):
        t = m.group(1)
        t = t.replace(' :', ' :').replace(' ;', ' ;').replace(' ?', ' ?').replace(' !', ' !')
        t = t.replace('« ', '« ').replace(' »', ' »').replace(' €', ' €').replace('&laquo; ', '&laquo; ')
        return '>' + t + '<'
    return re.sub(r'>([^<>]+)<', fix, s)


def reveal(extra='', d=None):
    style = f' style="--d:{d}s"' if d else ''
    return f'class="reveal{(" " + extra) if extra else ""}"{style}'


def head(title, desc, page, og_img='img/micaud-journee-mondiale.webp', robots=''):
    url = f'{SITE}/{"" if page == "index.html" else page}'
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="theme-color" content="#15110f">
{f'<meta name="robots" content="{robots}">' if robots else ''}
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Association Yin Yang">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/{og_img}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" href="img/favicon.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preload" href="fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/nunito-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.add('js')</script>
</head>'''


def header(page):
    items = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == page else ''
        items.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    cur = ' aria-current="page"' if page == 'contact.html' else ''
    items.append(f'<li><a class="btn" href="contact.html"{cur}>Nous rejoindre</a></li>')
    return f'''<body>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="Association Yin Yang — accueil">
      <img src="img/logo-yinyang-128.png" alt="" width="50" height="50">
      <span class="brand__txt"><span class="brand__name">Yin Yang</span><span class="brand__sub">Tai Ji &amp; Qi Gong · Besançon</span></span>
    </a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    <nav class="nav" id="menu" aria-label="Navigation principale">
      <ul>
        {chr(10).join("        " + i for i in items).strip()}
      </ul>
    </nav>
  </div>
</header>
<main id="contenu">
'''


def footer(page):
    links = ''.join(f'<li><a href="{h}"{" aria-current=" + chr(34) + "page" + chr(34) if h == page else ""}>{l}</a></li>' for h, l in NAV)
    links += f'<li><a href="contact.html"{" aria-current=" + chr(34) + "page" + chr(34) if page == "contact.html" else ""}>Contact &amp; adhésion</a></li>'
    legal_cur = ' aria-current="page"' if page == 'mentions-legales.html' else ''
    return f'''</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html"><img src="img/logo-yinyang-128.png" alt="" width="50" height="50" loading="lazy"><span class="brand__txt"><span class="brand__name">Yin Yang</span><span class="brand__sub">Association · Besançon</span></span></a>
        <p>Tai Ji Quan et Qi Gong : l’art du mouvement en harmonie avec la nature. Association loi 1901, animée par des bénévoles depuis 2008.</p>
      </div>
      <div>
        <h2>Le site</h2>
        <ul>{links}</ul>
      </div>
      <div>
        <h2>Pratiquer</h2>
        <ul>
          <li><a href="activites.html#planning">Horaires des cours</a></li>
          <li><a href="activites.html#tarifs">Tarifs &amp; inscription</a></li>
          <li><a href="{PAY}" rel="noopener" target="_blank">Payer en ligne</a></li>
          <li><a href="{OLD_SITE}" rel="noopener" target="_blank">Archives : asso-yinyang.fr</a></li>
        </ul>
      </div>
      <div>
        <h2>Nous joindre</h2>
        <ul>
          <li>Maria Craveiro, présidente<br><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a></li>
          <li><a href="contact.html">Écrire à l’association</a></li>
          <li><a href="{FB}" rel="noopener" target="_blank">Facebook</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">2026</span> Association Yin Yang — Besançon</span>
      <span><a href="mentions-legales.html"{legal_cur}>Mentions légales &amp; confidentialité</a></span>
    </div>
  </div>
</footer>
<script src="js/main.js" defer></script>
</body>
</html>
'''


def page_hero(title, lead, crumb, bg=None, cjk=''):
    bgimg = f'<div class="page-hero__bg">{img(bg, "", lazy=False, extra=" fetchpriority=" + chr(34) + "high" + chr(34))}</div>' if bg else '<div class="page-hero__bg"></div>'
    plain = '' if bg else ' page-hero--plain'
    mark = f'<span class="cjk-mark" aria-hidden="true">{cjk}</span>' if cjk else ''
    return f'''<section class="page-hero{plain}">
  {bgimg}
  {RING}
  {mark}
  <div class="container">
    <ol class="crumbs" aria-label="Fil d’Ariane"><li><a href="index.html">Accueil</a></li><li aria-current="page">{crumb}</li></ol>
    <h1>{title}</h1>
    <p class="page-hero__lead">{lead}</p>
  </div>
  {WAVE.format(c='paper')}
</section>
'''


def write(name, content):
    with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
        f.write(typo(content))
    print('écrit', name)


def schedule_rows():
    out = []
    for day, hour, place, detail, pr, moment, new in COURSES:
        label, key, cls = PRACTICE[pr]
        det = f'<small>{detail}</small>' if detail else ''
        nw = '<span class="new">Nouveau</span>' if new else ''
        out.append(f'<tr data-practice="{key}" data-moment="{moment}"><th scope="row">{day}</th>'
                   f'<td class="time">{hour}</td><td>{place}{nw}{det}</td>'
                   f'<td class="pr"><span class="pill {cls}">{label}</span></td></tr>')
    out.append('<tr class="stage-row" data-practice="tai-chi qi-gong" data-moment="apres-midi"><th scope="row">Samedi</th>'
               '<td class="time">Après-midi</td><td>Stages en ateliers<small>Gymnase Résal ou Jean Zay · ouverts à tous</small></td>'
               '<td class="pr"><span class="pill pill--mix">Tai Chi &amp; Qi Gong</span></td></tr>')
    return '\n'.join(out)


def week_grid():
    cols = []
    for day in DAYS:
        lis = ''.join(f'<li><time>{h}</time><span>{p}</span></li>' for d, h, p, *_ in COURSES if d == day)
        cols.append(f'<div class="week__day reveal" style="--d:{DAYS.index(day) * .07:.2f}s"><h3>{day}</h3><ul>{lis}</ul></div>')
    return '\n'.join(cols)


def news_card(n, compact=False):
    iso, date, cat, title, text, image, tile, soon = n
    label, cls = CAT[cat]
    if image:
        media = f'<div class="news-card__media">{img(image, "")}</div>'
    else:
        d, m = tile
        media = f'<div class="news-card__media news-card__media--date" aria-hidden="true"><div><b>{d}</b><small>{m}</small></div></div>'
    soon_tag = '<span class="tag tag--soon">À venir</span>' if soon else ''
    return (f'<article class="news-card reveal" data-cat="{cat}">{media}<div class="news-card__body">'
            f'<div class="news-card__meta"><span class="tag {cls}">{label}</span>{soon_tag}<time datetime="{iso}">{date}</time></div>'
            f'<h3>{title}</h3><p>{text}</p></div></article>')


# --------------------------------------------------------------------------
# Pages
# --------------------------------------------------------------------------
def build_index():
    p = 'index.html'
    ld = f'''<script type="application/ld+json">{{"@context":"https://schema.org","@type":"SportsOrganization","name":"Association Yin Yang","description":"Association de Tai Ji Quan et de Qi Gong à Besançon.","url":"{SITE}/","logo":"{SITE}/img/logo-yinyang.png","foundingDate":"2008","address":{{"@type":"PostalAddress","addressLocality":"Besançon","postalCode":"25000","addressCountry":"FR"}},"areaServed":"Besançon","sameAs":["{FB}","{OLD_SITE}"]}}</script>'''
    h = head('Association Yin Yang — Tai Chi & Qi Gong à Besançon',
             'Association Yin Yang à Besançon : 11 cours hebdomadaires de Tai Ji Quan (Tai Chi) et de Qi Gong pour adultes de tous niveaux. Cours d’essai, stages et événements.',
             p).replace('</head>', ld + '\n</head>')
    body = h + header(p) + f'''
<section class="hero">
  <div class="hero__bg"></div>
  {RING}
  <div class="container hero__grid">
    <div>
      <p class="eyebrow">Association Yin Yang · Besançon</p>
      <h1><span class="line"><span>Tai Chi &amp; Qi Gong</span></span><span class="line"><span><em>à Besançon</em></span></span></h1>
      <svg class="brush" viewBox="0 0 430 22" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14C70 4 150 18 230 10s140-4 196 4"/></svg>
      <p class="hero__lead" style="margin-top:1.4rem">L’art du mouvement en harmonie avec la nature. Onze cours par semaine, dans toute la ville, pour retrouver l’énergie, l’équilibre et le plaisir de pratiquer ensemble.</p>
      <div class="hero__cta">
        <a class="btn" href="contact.html">Venir faire un cours d’essai {ARROW}</a>
        <a class="btn btn--ghost" href="activites.html#planning">Voir les horaires</a>
      </div>
      <ul class="hero__badges">
        <li>Depuis 2008</li><li>Adultes · tous niveaux</li><li>Cours d’essai</li><li>Association 100&nbsp;% bénévole</li>
      </ul>
    </div>
    <div class="hero__art" aria-hidden="false">
      <div class="arch arch--a" data-speed=".05">{img('trouve-ton-sport-taichi', 'Démonstration de Tai Ji Quan en plein air', lazy=False, extra=' style="object-position:72% 50%"')}</div>
      <div class="arch arch--b" data-speed=".11">{img('stage-eventail-shan', 'Pratique du Tai Ji Shan avec des éventails rouges', lazy=False, extra=' style="object-position:55% 50%"')}</div>
      <div class="arch arch--c" data-speed=".02">{img('micaud-journee-mondiale', 'Pratiquants de Tai Chi sous le kiosque du Parc Micaud', lazy=False, extra=' style="object-position:38% 50%"')}</div>
      <div class="seal cjk" aria-hidden="true">阴<br>阳</div>
    </div>
  </div>
  <a class="hero__scroll" href="#presentation" aria-label="Découvrir la suite"><span>Découvrir</span><i></i></a>
  {WAVE.format(c='paper')}
</section>

<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    {"".join('<span><b class="cjk">太极拳</b></span><span>Tai Ji Quan</span><span><b class="cjk">气功</b></span><span>Qi Gong</span><span><b class="cjk">阴阳</b></span><span>Besançon</span>' for _ in range(4))}
  </div>
</div>

<section class="section on-paper" id="presentation">
  <div class="container">
    <div class="section__head section__head--center reveal">
      <p class="eyebrow">Deux pratiques, un équilibre</p>
      <h2>Le calme du Yin, la force du Yang</h2>
      <p>À l’association Yin Yang, le Qi Gong et le Tai Ji Quan se complètent : l’un travaille le souffle et le relâchement, l’autre l’énergie en mouvement. On y vient pour sa santé, par curiosité ou pour l’art martial.</p>
    </div>
    <div class="yy reveal reveal--zoom">
      <article class="yy__panel yy__panel--yin">
        {img('ag-qigong', '')}
        <span class="yy__char cjk" aria-hidden="true">阴</span>
        <span class="yy__tag">Yin · 气功</span>
        <h3>Qi Gong, le souffle et la douceur</h3>
        <p>Postures, relâchement, assouplissement : des exercices relativement statiques pour être en harmonie avec la nature et équilibrer Yin et Yang.</p>
        <ul><li>Bon pour la santé et la détente</li><li>Accessible dès le premier cours</li><li>Chaque jeudi après-midi à la Cassotte</li></ul>
      </article>
      <article class="yy__panel yy__panel--yang">
        {img('trouve-ton-sport-epee', '')}
        <span class="yy__char cjk" aria-hidden="true">阳</span>
        <span class="yy__tag">Yang · 太极拳</span>
        <h3>Tai Ji Quan, l’énergie en mouvement</h3>
        <p>Un art martial dynamique à mains nues puis avec armes — épée, sabre, bâton, éventail — dans le style du serpent de la famille Yang.</p>
        <ul><li>Enchaînements, déplacements, application</li><li>Une progression à son rythme</li><li>Stages et ateliers toute l’année</li></ul>
      </article>
    </div>
  </div>
</section>

<section class="section section--ink" aria-labelledby="chiffres">
  <div class="container">
    <h2 id="chiffres" class="visually-hidden">L’association en chiffres</h2>
    <div class="stats">
      <div class="stat reveal"><span class="stat__num" data-count="11">11</span><span class="stat__label">cours chaque semaine</span></div>
      <div class="stat reveal" style="--d:.1s"><span class="stat__num" data-count="144">144</span><span class="stat__label">adhérents en 2025</span></div>
      <div class="stat reveal" style="--d:.2s"><span class="stat__num" data-count="18">18</span><span class="stat__label">ans d’existence (depuis 2008)</span></div>
      <div class="stat reveal" style="--d:.3s"><span class="stat__num" data-count="50" data-suffix="+">50+</span><span class="stat__label">nouveaux pratiquants en 2025‑2026</span></div>
    </div>
  </div>
  {WAVE.format(c='paper')}
</section>

<section class="section on-paper">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Découvrir le site</p>
      <h2>Tout savoir sur Yin Yang</h2>
    </div>
    <div class="grid grid--4">
      <a class="tile reveal" href="association.html">{img('ag-qigong', 'Adhérents pratiquant le Qi Gong lors de l’assemblée générale')}<div class="tile__body"><span class="tile__num">01</span><h3>L’association</h3><p>Notre histoire, nos valeurs et l’équipe bénévole.</p><span class="tile__more">Découvrir {ARROW}</span></div></a>
      <a class="tile reveal" style="--d:.08s" href="activites.html">{img('gare-eau-saisir', 'Pratique du Tai Chi à la Gare d’eau')}<div class="tile__body"><span class="tile__num">02</span><h3>Activités</h3><p>Jours, horaires, lieux et tarifs des cours.</p><span class="tile__more">Voir le planning {ARROW}</span></div></a>
      <a class="tile reveal" style="--d:.16s" href="galerie.html">{img('trouve-ton-sport-eventail', 'Démonstration de Tai Ji Shan')}<div class="tile__body"><span class="tile__num">03</span><h3>Galerie</h3><p>Cours, stages et rencontres en images.</p><span class="tile__more">Voir les photos {ARROW}</span></div></a>
      <a class="tile reveal" style="--d:.24s" href="actualites.html">{img('micaud-journee-mondiale', 'Journée mondiale du Tai Chi au Parc Micaud')}<div class="tile__body"><span class="tile__num">04</span><h3>Actualités</h3><p>Stages, événements et vie de l’association.</p><span class="tile__more">Lire les actus {ARROW}</span></div></a>
    </div>
  </div>
</section>

<section class="section section--white">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Une semaine type</p>
      <h2>Chaque jour, un cours près de chez vous</h2>
      <p>Matin, après-midi ou soir, dans les maisons de quartier et les salles de Besançon. Horaires de la rentrée 2026.</p>
    </div>
    <div class="week">
{week_grid()}
    </div>
    <p style="margin-top:2rem"><a class="btn btn--outline" href="activites.html#planning">Planning détaillé et filtres {ARROW}</a></p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Actualités</p>
      <h2>Ça bouge chez Yin Yang</h2>
    </div>
    <div class="news">
      {news_card(NEWS[0])}
      {news_card(NEWS[2])}
      {news_card(NEWS[3])}
    </div>
    <p style="margin-top:2.2rem"><a class="btn btn--outline" href="actualites.html">Toutes les actualités {ARROW}</a></p>
  </div>
</section>

<section class="cta-band">
  <div class="cta-band__bg">{img('grette-decouverte-2', '')}</div>
  <div class="container reveal">
    <p class="eyebrow">Rejoignez-nous</p>
    <h2>Et si vous veniez essayer&nbsp;?</h2>
    <p>Aucun niveau requis. Choisissez un cours près de chez vous, venez faire un essai et rencontrez notre équipe d’animateurs.</p>
    <div class="cta-band__btns">
      <a class="btn" href="contact.html">Nous rejoindre {ARROW}</a>
      <a class="btn btn--ghost" href="tel:{PHONE_TEL}">Appeler la présidente</a>
    </div>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_association():
    p = 'association.html'
    persons = [
        ('Maria Craveiro', 'Présidente', 'MC', True),
        ('Véronique Bévalot', 'Vice-présidente', 'VB', False),
        ('Anne-Claire Ponçot', 'Secrétaire', 'AP', False),
        ('Éric Alsruhe', 'Secrétaire adjoint', 'EA', False),
        ('Isabelle Cousson', 'Trésorière', 'IC', False),
        ('Estelle Renaud', 'Trésorière adjointe', 'ER', False),
    ]
    pc = ''.join(f'<div class="person{" person--lead" if lead else ""} reveal" style="--d:{i * .07:.2f}s"><div class="person__mono" aria-hidden="true">{mono}</div><h3>{n}</h3><p>{r}</p></div>'
                 for i, (n, r, mono, lead) in enumerate(persons))
    values = [
        ('和', 'Harmonie', 'Yin et Yang, Qi Gong de santé et Tai Chi martial : nous tenons à l’unité et à la complémentarité de toutes nos pratiques.'),
        ('传', 'Transmission', 'Un enseignement fidèle aux principes de la famille Yang, dans le style du serpent, et une priorité donnée à la formation des animateurs.'),
        ('友', 'Esprit associatif', 'Des bénévoles, une assemblée générale annuelle, des décisions prises ensemble. Ici on partage, on ne se contente pas de consommer.'),
        ('自', 'Indépendance', 'Aucune subvention, des tarifs modestes et pas de sélection par l’argent : l’association est ouverte à toutes et à tous.'),
    ]
    vc = ''.join(f'<article class="value reveal" style="--d:{i * .08:.2f}s"><span class="value__char cjk" aria-hidden="true">{c}</span><h3>{t}</h3><p>{d}</p></article>' for i, (c, t, d) in enumerate(values))
    tl = [
        ('Mars 2008', 'La déclaration au Journal officiel', 'L’association Yin Yang est déclarée : le début d’une aventure collective autour du Tai Ji Quan et du Qi Gong à Besançon.'),
        ('2019', 'Une fédération, un cadre', 'Les pratiquants sont licenciés à la fédération Sports Pour Tous (assurance incluse) et les cours se déroulent dans onze salles de la ville.'),
        ('Mars 2020', 'Pratiquer malgré tout', 'Lors du premier confinement, tous les cours en salle sont suspendus : l’association propose de continuer à la maison grâce à des vidéos.'),
        ('2023', 'Se former pour mieux transmettre', 'Une équipe d’enseignants, d’animateurs et d’assistants encadre quinze cours hebdomadaires et les ateliers des stages.'),
        ('2025', 'Une année de réussite', '144 adhérents, douze cours hebdomadaires, des animations avec les enfants (Kids Run, Journée Olympique) et des séances découverte en plein air.'),
        ('Février 2026', 'Un nouveau chapitre', 'Lors de la 18e assemblée générale, une nouvelle équipe prend la tête de l’association : Maria Craveiro en devient la présidente.'),
        ('Septembre 2026', 'Une nouvelle saison', 'Un nouveau cours à Avanne, le paiement en ligne et plus de dix cours hebdomadaires pour la rentrée.'),
    ]
    tlh = ''.join(f'<li class="reveal"><time>{t}</time><h3>{h}</h3><p>{d}</p></li>' for t, h, d in tl)
    h = head('L’association — Association Yin Yang, Besançon',
             'Découvrez l’association Yin Yang de Besançon : son histoire depuis 2008, ses valeurs, son bureau et l’esprit de ses cours de Tai Ji Quan et de Qi Gong.', p, 'img/ag-qigong.webp')
    body = h + header(p) + page_hero('Une association de pratiquants', 'Des bénévoles qui partagent, depuis 2008, un art énergétique et martial venu de Chine.', 'L’association', 'ag-qigong', '阴阳') + f'''
<section class="section on-paper">
  <div class="container split">
    <div class="reveal reveal--left">
      <p class="eyebrow">Qui sommes-nous&nbsp;?</p>
      <h2>Une association, avant tout</h2>
      <p class="lead">Nous ne sommes ni une entreprise, ni un organisme de soin. Nous réunissons des personnes de tout âge qui souhaitent découvrir et pratiquer ensemble un art martial et énergétique qui a fait ses preuves en Chine depuis des siècles.</p>
      <p>L’association fonctionne grâce à des bénévoles : des enseignants et animateurs, et d’autres qui coordonnent les tâches administratives. Tout s’organise démocratiquement lors d’une assemblée générale annuelle et des réunions du conseil d’administration.</p>
      <blockquote class="pullquote">Nous ne sommes pas un lieu où l’on vient consommer. Nous y croyons encore : l’esprit associatif.</blockquote>
      <a class="btn btn--outline" href="activites.html">Découvrir nos cours {ARROW}</a>
    </div>
    <div class="split__media reveal reveal--right">{img('micaud-journee-mondiale', 'Les pratiquants de Yin Yang sous le kiosque du Parc Micaud', lazy=False)}</div>
  </div>
</section>

<section class="section section--white">
  <div class="container split split--rev">
    <div class="split__media reveal reveal--left">{img('trouve-ton-sport-baton', 'Démonstration de Tai Ji Gun, le bâton')}</div>
    <div class="reveal reveal--right">
      <p class="eyebrow">Ce que nous pratiquons</p>
      <h2>Un Tai Chi qui est aussi un art martial</h2>
      <p>Le Tai Ji Quan n’est pas qu’une gymnastique douce : c’est un art martial (<i>quan</i> veut dire « boxe » en chinois). Nous suivons les enseignements de la famille Yang dans un style singulier, le <strong>style du serpent</strong> : on se déplace avec la colonne vertébrale, sans avoir besoin de grands gestes.</p>
      <p>À côté, nous pratiquons différents Qi Gong, pour être en harmonie avec la nature et équilibrer Yin et Yang. Le Tai Chi se travaille à mains nues, seul ou avec partenaire, et avec armes : épée, sabre, bâton, éventail.</p>
      <p>Les débutants sont les bienvenus : la découverte se fait progressivement, chacun selon son parcours.</p>
    </div>
  </div>
</section>

<section class="section on-paper">
  <div class="container">
    <div class="section__head section__head--center reveal">
      <p class="eyebrow">Nos valeurs</p>
      <h2>Ce qui nous réunit</h2>
    </div>
    <div class="grid grid--4">{vc}</div>
  </div>
</section>

<section class="section section--deep">
  <div class="container">
    <div class="section__head section__head--center reveal">
      <p class="eyebrow">Notre histoire</p>
      <h2>Dix-huit ans de pratique partagée</h2>
    </div>
    <ol class="timeline">{tlh}</ol>
  </div>
</section>

<section class="section on-paper" id="bureau">
  <div class="container">
    <div class="section__head section__head--center reveal">
      <p class="eyebrow">Le bureau</p>
      <h2>Les bénévoles qui font vivre Yin Yang</h2>
      <p>Équipe issue du conseil d’administration du 18 février 2026, installée à la suite de la 18e assemblée générale.</p>
    </div>
    <div class="grid grid--3">{pc}</div>
    <p class="note reveal" style="margin-top:2rem;text-align:center">Un grand merci à Christian Renard, président jusqu’en février 2026, et à Jeannine Reboul, secrétaire, qui ont passé le relais. Les cours sont animés par Maria, Christian, Alexandre, Aline, Isabelle, Anne, Éric et d’autres bénévoles.</p>
    <p style="text-align:center;margin-top:2rem" class="reveal"><a class="btn" href="contact.html">Rejoindre l’aventure {ARROW}</a></p>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_activites():
    p = 'activites.html'
    venues = ''.join(f'<li><span>{n}</span><a href="https://www.openstreetmap.org/search?query={esc(q.replace(chr(32), "+"))}" target="_blank" rel="noopener">Voir sur la carte<span class="visually-hidden"> : {n}</span></a></li>' for n, q in VENUES)
    h = head('Activités et horaires — Association Yin Yang, Besançon',
             'Horaires, lieux et tarifs des cours de Tai Chi et de Qi Gong de l’association Yin Yang à Besançon : 11 cours hebdomadaires du lundi au samedi, rentrée 2026.', p, 'img/gare-eau-saisir.webp')
    body = h + header(p) + page_hero('Activités &amp; horaires', 'Onze cours par semaine, du lundi au samedi, dans les maisons de quartier et les salles de Besançon.', 'Activités', 'gare-eau-saisir', '太极拳') + f'''
<section class="section on-paper">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Nos pratiques</p>
      <h2>Qi Gong, Tai Ji Quan et armes</h2>
      <p>Des cours pour adultes de tous niveaux. Aucun prérequis : un animateur vous guide dès la première séance.</p>
    </div>
    <div class="grid grid--3">
      <article class="practice reveal"><span class="cjk" aria-hidden="true">气功</span><h3>Qi Gong</h3><p>Le travail du souffle et de l’énergie : postures, relâchement, assouplissement. Pour la santé, la détente et l’équilibre.</p></article>
      <article class="practice reveal" style="--d:.1s"><span class="cjk" aria-hidden="true">太极拳</span><h3>Tai Ji Quan</h3><p>Un art martial à mains nues, dans le style du serpent de la famille Yang : enchaînements, déplacements, application martiale.</p></article>
      <article class="practice reveal" style="--d:.2s"><span class="cjk" aria-hidden="true">器械</span><h3>Armes traditionnelles</h3><p>Pour aller plus loin : épée (Tai Ji Jian), sabre (Tai Ji Dao), bâton (Tai Ji Gun) et éventail (Tai Ji Shan), surtout en stages.</p></article>
    </div>
  </div>
</section>

<section class="section section--white" id="planning">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Planning de la rentrée 2026</p>
      <h2>Trouvez le cours qui vous convient</h2>
      <p>Filtrez par pratique ou par moment de la journée. Les horaires peuvent évoluer : en cas de doute, appelez la présidente au <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>.</p>
    </div>
    <div class="filters reveal">
      <div data-group="practice"><span class="filters__label" id="lbl-pratique">Pratique</span>
        <div class="chips" role="group" aria-labelledby="lbl-pratique">
          <button class="chip" type="button" data-filter="all" aria-pressed="true">Toutes</button>
          <button class="chip" type="button" data-filter="tai-chi" aria-pressed="false">Tai Chi</button>
          <button class="chip" type="button" data-filter="qi-gong" aria-pressed="false">Qi Gong</button>
        </div></div>
      <div data-group="moment"><span class="filters__label" id="lbl-moment">Moment</span>
        <div class="chips" role="group" aria-labelledby="lbl-moment">
          <button class="chip" type="button" data-filter="all" aria-pressed="true">Toute la journée</button>
          <button class="chip" type="button" data-filter="matin" aria-pressed="false">Matin</button>
          <button class="chip" type="button" data-filter="apres-midi" aria-pressed="false">Après-midi</button>
          <button class="chip" type="button" data-filter="soir" aria-pressed="false">Soir</button>
        </div></div>
    </div>
    <div class="reveal">
    <table class="schedule" id="planning-table">
      <caption class="visually-hidden">Planning hebdomadaire des cours de Tai Chi et de Qi Gong</caption>
      <thead><tr><th scope="col">Jour</th><th scope="col">Heure</th><th scope="col">Lieu</th><th scope="col">Pratique</th></tr></thead>
      <tbody>
{schedule_rows()}
      </tbody>
    </table>
    <p class="empty-msg" id="planning-empty" hidden>Aucun cours ne correspond à ces filtres. Essayez une autre combinaison.</p>
    </div>
    <p class="note" style="margin-top:1.2rem">Les cours sont animés par des bénévoles formés par l’association. Certains horaires peuvent être ajustés en cours de saison : consultez les <a href="actualites.html">actualités</a>.</p>
  </div>
</section>

<section class="section on-paper" id="tarifs">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Tarifs &amp; inscription</p>
      <h2>Une participation modeste, sans sélection par l’argent</h2>
      <p>L’association ne reçoit aucune subvention. Le montant dépend du lieu : certains cours ont lieu dans des structures partenaires qui peuvent demander leur propre adhésion.</p>
    </div>
    <div class="grid grid--4">
      <article class="price reveal"><h3>Saint-Claude</h3><span class="price__amount">60&nbsp;€</span><p>à Yin Yang, plus un règlement distinct à l’Atelier de la danse.</p></article>
      <article class="price reveal" style="--d:.08s"><h3>Maison de la Grette</h3><span class="price__amount">120&nbsp;€ <small>/ an</small></span><p>Forfait annuel, ou 75&nbsp;€ avec la Carte Avantages Jeunes.</p></article>
      <article class="price reveal" style="--d:.16s"><h3>La Cassotte</h3><span class="price__amount">60&nbsp;€</span><p>à Yin Yang, plus 60&nbsp;€ à l’association Vivre aux Chaprais.</p></article>
      <article class="price price--accent reveal" style="--d:.24s"><h3>Autres cours</h3><span class="price__amount">Sur demande</span><p>Montboucons, Avanne, Montrapon, Micaud : contactez Maria, la présidente, puis réglez en ligne.</p></article>
    </div>
    <ol class="steps" style="margin-top:3.2rem">
      <li class="reveal"><h3>Venir essayer</h3><p>Contactez-nous pour choisir un groupe et faire un cours d’essai, sans engagement de niveau.</p></li>
      <li class="reveal" style="--d:.1s"><h3>Rencontrer le référent</h3><p>Lors de votre premier cours, le ou la référent·e du groupe vous explique les démarches et les tarifs de votre lieu.</p></li>
      <li class="reveal" style="--d:.2s"><h3>S’inscrire</h3><p>Réglez votre participation en ligne, simple et sécurisée, ou selon les modalités de votre lieu. Chaque pratiquant est licencié à la fédération Sports Pour Tous (assurance).</p></li>
    </ol>
    <p style="margin-top:2.4rem" class="reveal"><a class="btn" href="{PAY}" target="_blank" rel="noopener">Régler ma participation en ligne {ARROW}</a> <a class="btn btn--outline" href="contact.html" style="margin-left:.6rem">Poser une question</a></p>
  </div>
</section>

<section class="section section--deep">
  <div class="container split">
    <div class="reveal reveal--left">
      <p class="eyebrow">Les stages</p>
      <h2>Aller plus loin, un samedi après-midi</h2>
      <p>Plusieurs fois par an, l’association organise des stages ouverts à tous, sous forme d’ateliers : Qi Gong, Tai Ji Quan, épée, éventail, bâton… Un moment pour apprendre des aspects nouveaux et rencontrer les autres groupes. Des intervenants extérieurs peuvent venir enrichir le programme.</p>
      <p>Les dates sont publiées dans les <a href="actualites.html">actualités</a>.</p>
    </div>
    <div class="split__media reveal reveal--right">{img('stage-ateliers-resal', 'Stage en ateliers au gymnase Résal en mars 2026')}</div>
  </div>
</section>

<section class="section section--white">
  <div class="container">
    <div class="section__head reveal">
      <p class="eyebrow">Où pratiquer</p>
      <h2>Des cours dans toute la ville</h2>
      <p>L’association n’a pas de local propre : les cours ont lieu dans des maisons de quartier, des salles et des parcs.</p>
    </div>
    <ul class="venues reveal">{venues}</ul>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_galerie():
    p = 'galerie.html'
    figs = ''.join(
        f'<figure class="gallery__item" data-cat="{cats}" data-full="img/{n}.webp" data-caption="{esc(cap)}" role="button" tabindex="0" aria-label="Agrandir : {esc(cap)}">{img(n, cap)}<figcaption>{cap}</figcaption></figure>'
        for n, cap, cats in GALLERY)
    h = head('Galerie photos — Association Yin Yang, Besançon',
             'Photos des cours, stages et événements de l’association Yin Yang à Besançon : Tai Chi, Qi Gong, épée, bâton, éventail, journée mondiale du Tai Chi.', p, 'img/trouve-ton-sport-eventail.webp')
    body = h + header(p) + page_hero('Galerie', 'Cours en plein air, stages en ateliers, démonstrations : la vie de Yin Yang en images.', 'Galerie', 'trouve-ton-sport-eventail', '图') + f'''
<section class="section on-paper">
  <div class="container">
    <div class="filters reveal" data-group="gallery">
      <div><span class="filters__label" id="lbl-gal">Filtrer</span>
      <div class="chips" role="group" aria-labelledby="lbl-gal">
        <button class="chip" type="button" data-filter="all" aria-pressed="true">Tout</button>
        <button class="chip" type="button" data-filter="stages" aria-pressed="false">Stages</button>
        <button class="chip" type="button" data-filter="evenements" aria-pressed="false">Événements</button>
        <button class="chip" type="button" data-filter="plein-air" aria-pressed="false">En plein air</button>
        <button class="chip" type="button" data-filter="salle" aria-pressed="false">En salle</button>
      </div></div>
    </div>
    <div class="gallery" id="gallery">{figs}</div>
    <p class="note" style="margin-top:2rem">Photos : association Yin Yang et ses adhérents (dont Maurice). Plus de 2&nbsp;800 photos et de nombreuses vidéos sont à retrouver sur <a href="{OLD_SITE}" target="_blank" rel="noopener">asso-yinyang.fr</a>.</p>
  </div>
</section>
<dialog class="lightbox" id="lightbox" aria-label="Visionneuse de photos">
  <div class="lightbox__inner">
    <img src="" alt="">
    <p class="lightbox__cap"></p>
  </div>
  <button class="lightbox__btn lightbox__close" type="button" aria-label="Fermer">×</button>
  <button class="lightbox__btn lightbox__prev" type="button" aria-label="Photo précédente">‹</button>
  <button class="lightbox__btn lightbox__next" type="button" aria-label="Photo suivante">›</button>
</dialog>
''' + footer(p)
    write(p, body)


def build_actualites():
    p = 'actualites.html'
    cards = ''.join(news_card(n) for n in NEWS)
    h = head('Actualités et événements — Association Yin Yang, Besançon',
             'Stages, démonstrations, assemblée générale, rentrée : toutes les actualités de l’association Yin Yang de Besançon (Tai Chi et Qi Gong).', p, 'img/micaud-journee-mondiale.webp')
    body = h + header(p) + page_hero('Actualités &amp; événements', 'Stages, démonstrations, rentrée, assemblée générale : la vie de l’association, mois après mois.', 'Actualités', 'micaud-journee-mondiale', '动') + f'''
<section class="section on-paper">
  <div class="container">
    <!-- À MODIFIER : texte d’attente, à remplacer par les prochaines dates dès qu’elles sont connues -->
    <aside class="info-card info-card--dark reveal" style="margin-bottom:3rem">
      <p class="eyebrow">Prochains rendez-vous</p>
      <h2 style="margin-bottom:.5rem">Les prochaines dates arrivent bientôt</h2>
      <p>Les prochains stages, la date de l’assemblée générale et les animations de l’année seront annoncés ici dès qu’ils seront fixés. Pour ne rien manquer, contactez-nous ou suivez l’association sur Facebook.</p>
      <p style="margin:0"><a class="btn" href="contact.html">Nous contacter {ARROW}</a> <a class="btn btn--ghost" href="{FB}" target="_blank" rel="noopener" style="margin-left:.5rem">Facebook</a></p>
    </aside>
    <div class="filters reveal" data-group="news">
      <div><span class="filters__label" id="lbl-news">Catégorie</span>
      <div class="chips" role="group" aria-labelledby="lbl-news">
        <button class="chip" type="button" data-filter="all" aria-pressed="true">Tout</button>
        <button class="chip" type="button" data-filter="evt" aria-pressed="false">Événements</button>
        <button class="chip" type="button" data-filter="stage" aria-pressed="false">Stages</button>
        <button class="chip" type="button" data-filter="pratique" aria-pressed="false">Pratique</button>
        <button class="chip" type="button" data-filter="vie" aria-pressed="false">Vie de l’association</button>
      </div></div>
    </div>
    <div class="news" id="news-list">{cards}</div>
    <p class="note" style="margin-top:2.4rem">Retrouvez les archives complètes (480 articles depuis plus de dix ans) sur le site historique de l’association : <a href="{OLD_SITE}" target="_blank" rel="noopener">asso-yinyang.fr</a>.</p>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_contact():
    p = 'contact.html'
    opts = ''.join(f'<option>{d} {h} — {pl}</option>' for d, h, pl, *_ in COURSES)
    h = head('Contact et adhésion — Association Yin Yang, Besançon',
             'Contactez l’association Yin Yang de Besançon, demandez un cours d’essai de Tai Chi ou de Qi Gong et rejoignez-nous : formulaire, téléphone, paiement en ligne.', p, 'img/grette-decouverte-1.webp')
    body = h + header(p) + page_hero('Nous rejoindre', 'Une question, une envie d’essayer ? Écrivez-nous : nous vous répondrons avec plaisir.', 'Contact', 'grette-decouverte-1', '联') + f'''
<section class="section on-paper">
  <div class="container contact-grid">
    <div class="form-card reveal reveal--left">
      <h2 style="font-size:1.8rem">Écrivez-nous</h2>
      <p class="note">Les champs marqués d’un astérisque (*) sont obligatoires.</p>
      <form name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <input type="hidden" name="subject" value="Nouveau message depuis le site Yin Yang">
        <p class="hp"><label>Ne pas remplir si vous êtes humain·e <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="form-grid">
          <div><label for="nom">Nom et prénom *</label><input type="text" id="nom" name="nom" autocomplete="name" required></div>
          <div><label for="email">Adresse e-mail *</label><input type="email" id="email" name="email" autocomplete="email" required></div>
          <div><label for="tel">Téléphone <span class="opt">(facultatif)</span></label><input type="tel" id="tel" name="telephone" autocomplete="tel"></div>
          <div><label for="objet">Votre demande *</label>
            <select id="objet" name="objet" required>
              <option value="">Choisir…</option>
              <option>Je souhaite faire un cours d’essai</option>
              <option>Je souhaite m’inscrire</option>
              <option>Renseignements sur les cours</option>
              <option>Renseignements sur les stages</option>
              <option>Autre demande</option>
            </select></div>
          <div class="full"><label for="cours">Cours qui m’intéresse <span class="opt">(facultatif)</span></label>
            <select id="cours" name="cours"><option value="">Je ne sais pas encore</option>{opts}</select></div>
          <div class="full"><label for="message">Votre message *</label><textarea id="message" name="message" required></textarea></div>
          <div class="full"><label class="check"><input type="checkbox" name="consentement" required><span>J’accepte que mes informations soient utilisées pour répondre à ma demande, conformément aux <a href="mentions-legales.html#donnees">mentions légales</a>. *</span></label></div>
          <div class="full"><button class="btn" type="submit">Envoyer mon message {ARROW}</button></div>
        </div>
      </form>
    </div>
    <aside class="reveal reveal--right">
      <div class="info-card">
        <h2>Coordonnées</h2>
        <ul class="info-list">
          <li>{ICON_PHONE}<span><b>Maria Craveiro, présidente</b><a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a><br><small>Pour les cours de Montboucons, Avanne, Montrapon et Micaud.</small></span></li>
          <li>{ICON_PIN}<span><b>À Besançon et Avanne</b>Cours dans onze lieux : <a href="activites.html#planning">voir les horaires</a>.</span></li>
          <li>{ICON_CLOCK}<span><b>Reprise des cours</b>Depuis le 8 septembre 2026. Il est possible de rejoindre un cours en cours d’année.</span></li>
          <li>{ICON_CARD}<span><b>Inscription</b><a href="{PAY}" target="_blank" rel="noopener">Paiement en ligne sécurisé</a></span></li>
          <li>{ICON_FB}<span><b>Suivez-nous</b><a href="{FB}" target="_blank" rel="noopener">Page Facebook</a></span></li>
        </ul>
        <div class="map" role="region" aria-label="Carte de Besançon">
          <div><p>La carte se charge uniquement sur demande, pour respecter votre vie privée.</p><button class="btn btn--sm" type="button" id="load-map">Afficher la carte de Besançon</button></div>
        </div>
      </div>
    </aside>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_merci():
    p = 'merci.html'
    h = head('Message envoyé — Association Yin Yang', 'Merci pour votre message : l’association Yin Yang vous répondra rapidement.', p, robots='noindex')
    body = h + header(p) + page_hero('Merci&nbsp;!', 'Votre message est bien parti.', 'Message envoyé') + f'''
<section class="section on-paper">
  <div class="container thanks reveal">
    <span class="cjk" aria-hidden="true">谢谢</span>
    <h2>Nous vous répondrons très vite</h2>
    <p class="lead">Un membre du bureau reviendra vers vous. En attendant, découvrez les cours et les prochains rendez-vous.</p>
    <p><a class="btn" href="activites.html">Voir les horaires {ARROW}</a> <a class="btn btn--outline" href="index.html" style="margin-left:.6rem">Retour à l’accueil</a></p>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_404():
    p = '404.html'
    h = head('Page introuvable — Association Yin Yang', 'Cette page n’existe pas ou n’existe plus.', p, robots='noindex')
    body = h + header(p) + page_hero('Page introuvable', 'Comme dans le Tai Chi, parfois on perd l’équilibre. Reprenons ensemble le chemin.', 'Erreur 404') + f'''
<section class="section on-paper">
  <div class="container thanks reveal">
    <span class="cjk" aria-hidden="true">道</span>
    <p><a class="btn" href="index.html">Retour à l’accueil {ARROW}</a> <a class="btn btn--outline" href="activites.html" style="margin-left:.6rem">Horaires des cours</a></p>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_legal():
    p = 'mentions-legales.html'
    todo = lambda t: f'<span class="todo">[{t}]</span>'
    h = head('Mentions légales — Association Yin Yang, Besançon',
             'Mentions légales, hébergement et politique de confidentialité du site de l’association Yin Yang de Besançon.', p)
    body = h + header(p) + page_hero('Mentions légales', 'Éditeur, hébergement, propriété intellectuelle et protection des données.', 'Mentions légales') + f'''
<section class="section on-paper">
  <div class="container prose">
    <!-- À COMPLÉTER par l’association : les champs surlignés ci-dessous -->
    <h2 style="margin-top:0">Éditeur du site</h2>
    <p><strong>Association Yin Yang</strong>, association régie par la loi du 1er juillet 1901, dont la déclaration a été publiée au Journal officiel (n° 9 du 1er mars 2008, page 907, article 426).</p>
    <p>Activité : pratique et enseignement du Tai Ji Quan et du Qi Gong à Besançon.<br>
    Siège social : {todo('adresse du siège social à compléter')}<br>
    N° RNA / SIREN : {todo('à compléter')}<br>
    Contact : via le <a href="contact.html">formulaire de contact</a> ou par téléphone au <a href="tel:{PHONE_TEL}">{PHONE_DISPLAY}</a>.</p>
    <p><strong>Directrice de la publication :</strong> Maria Craveiro, présidente.</p>

    <h2>Hébergement</h2>
    <p>Ce site est hébergé par <strong>Netlify, Inc.</strong>, 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener">www.netlify.com</a>.</p>

    <h2>Propriété intellectuelle</h2>
    <p>Les textes, photographies et le logo présentés sur ce site appartiennent à l’association Yin Yang et à ses adhérents, auteurs des photos (dont Maurice). Toute reproduction ou réutilisation sans autorisation préalable est interdite, sauf usage privé.</p>
    <p>Les personnes photographiées sont des adhérents ou participants aux activités de l’association. Toute personne souhaitant que sa photo soit retirée peut en faire la demande via le formulaire de contact.</p>

    <h2 id="donnees">Données personnelles et confidentialité</h2>
    <h3>Formulaire de contact</h3>
    <p>Les informations saisies (nom, adresse e-mail, téléphone facultatif, message) sont utilisées uniquement pour répondre à votre demande. Elles sont traitées par les membres du bureau chargés des relations avec les adhérents et transitent par le service de formulaires de l’hébergeur, Netlify.</p>
    <p>Base légale : votre consentement. Durée de conservation : le temps nécessaire au traitement de votre demande, puis au maximum {todo('12 mois — durée à confirmer par l’association')}.</p>
    <p>Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de limitation du traitement. Pour l’exercer, écrivez-nous via le <a href="contact.html">formulaire de contact</a>. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).</p>
    <h3>Cookies et mesure d’audience</h3>
    <p>Ce site n’utilise ni cookie de suivi, ni outil de mesure d’audience, ni police de caractères externe. La carte de Besançon (OpenStreetMap) n’est chargée qu’après votre clic.</p>

    <h2>Liens externes</h2>
    <p>Ce site contient des liens vers d’autres sites (paiement en ligne Monetico, site historique asso-yinyang.fr, Facebook, OpenStreetMap, etc.). L’association n’est pas responsable de leur contenu ni de leurs pratiques de confidentialité.</p>

    <h2>Responsabilité</h2>
    <p>Les horaires, lieux et tarifs sont donnés à titre indicatif et peuvent évoluer en cours de saison ; en cas de doute, contactez l’association. La pratique du Tai Chi et du Qi Gong ne se substitue pas à un avis médical.</p>
  </div>
</section>
''' + footer(p)
    write(p, body)


def build_static():
    pages = ['', 'association', 'activites', 'galerie', 'actualites', 'contact', 'mentions-legales']
    urls = ''.join(f'<url><loc>{SITE}/{p}</loc></url>' for p in pages)
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    with open(os.path.join(ROOT, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
    with open(os.path.join(ROOT, '_headers'), 'w', encoding='utf-8') as f:
        f.write('''/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/img/*
  Cache-Control: public, max-age=2592000
/css/*
  Cache-Control: public, max-age=3600
/js/*
  Cache-Control: public, max-age=3600
''')


if __name__ == '__main__':
    build_index()
    build_association()
    build_activites()
    build_galerie()
    build_actualites()
    build_contact()
    build_merci()
    build_404()
    build_legal()
    build_static()
