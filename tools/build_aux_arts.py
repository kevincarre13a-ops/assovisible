#!/usr/bin/env python3
"""Génère les pages HTML de la maquette « Aux Arts ! en Avignon » dans maquette-aux-arts/.
Usage : python3 tools/build_aux_arts.py
Tout le contenu provient de https://auxartsavignon.fr (affiches, pages) et de la page HelloAsso de l'association.
Les textes d'attente sont repérables à la classe .tbc / .todo."""
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'maquette-aux-arts')
SITE = 'https://auxartsavignon.fr'
TEL = '06 83 20 26 60'
TEL_HREF = '+33683202660'
MAIL = 'contact@auxartsavignon.fr'
INSTA = 'https://www.instagram.com/aux.arts.avignon/'
FB = 'https://www.facebook.com/profile.php?id=61588325346107'
HA = 'https://www.helloasso.com/associations/aux-arts-avignon'
HA_ADH = HA + '/adhesions/adhesions-2026'
HA_MECENE = HA + '/formulaires/2'

NAV = [
    ('index.html', 'Accueil'), ('le-projet.html', 'Le projet'), ('ateliers.html', 'Ateliers'),
    ('agenda.html', 'Agenda'), ('intervenants.html', 'Intervenants'), ('galerie.html', 'Galerie'),
    ('actualites.html', 'Actualités'), ('partenaires.html', 'Partenaires'),
    ('nous-rejoindre.html', 'Nous rejoindre'), ('mentions-legales.html', 'Mentions légales'),
]
E = html.escape


def ext(url, label, cls=''):
    c = f' class="{cls}"' if cls else ''
    return f'<a{c} href="{E(url)}" target="_blank" rel="noopener noreferrer">{label}<span class="sr"> (nouvel onglet)</span></a>'


def nav_links(page, drawer=False):
    out = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == page else ''
        out.append(f'<a href="{href}"{cur}>{label}</a>')
    return '\n'.join(out)


def head(page, title, desc, img='img/place-pasteur.jpg', preload=''):
    full = f'{title} · Aux Arts ! en Avignon' if page != 'index.html' else 'Aux Arts ! en Avignon · ateliers, expositions et concerts place Louis Pasteur'
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(full)}</title>
<meta name="description" content="{E(desc)}">
<meta name="theme-color" content="#B42029">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{E(full)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{img}">
<link rel="icon" href="img/logo.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Caveat+Brush&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,800;1,6..12,400&display=swap" rel="stylesheet">
{preload}<link rel="stylesheet" href="style.css">
<style>.sr{{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}.ring.init{{display:grid;place-items:center;background:var(--sun);font-family:var(--f-display);font-size:3.4rem;color:var(--brick)}}</style>
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
'''


def header(page):
    return f'''<header class="site-header">
  <div class="hd">
    <a class="brand" href="index.html" aria-label="Aux Arts ! en Avignon — accueil">
      <img src="img/logo.png" width="52" height="52" alt="">
      <span><b>Aux Arts !</b><small>en Avignon</small></span>
    </a>
    <nav class="nav" aria-label="Navigation principale">
{nav_links(page)}
    </nav>
    <div class="hd-right">
      <a class="btn sm sun" href="nous-rejoindre.html#inscription">S'inscrire</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Ouvrir le menu"><span></span></button>
    </div>
  </div>
</header>
<nav class="drawer" id="drawer" aria-label="Menu mobile">
{nav_links(page, True)}
  <a class="btn sun" href="nous-rejoindre.html#inscription">S'inscrire</a>
</nav>
'''


def footer():
    foot_nav = '\n'.join(f'<li><a href="{h}">{l}</a></li>' for h, l in NAV[:-1])
    return f'''<footer class="site-footer">
  <div class="scallop" aria-hidden="true"></div>
  <div class="wrap ft">
    <div>
      <a class="brand" href="index.html"><img src="img/logo.png" width="52" height="52" alt=""><span><b>Aux Arts !</b></span></a>
      <p>Un lieu associatif au service des artistes et de la créativité, en plein cœur d'Avignon.</p>
      <div class="social">
        {ext(INSTA, 'Instagram')}
        {ext(FB, 'Facebook')}
        {ext(HA, 'HelloAsso')}
      </div>
    </div>
    <div>
      <h2>Le lieu</h2>
      <address>
        <span>3 place Louis Pasteur<br>84000 Avignon</span>
        <a href="tel:{TEL_HREF}">{TEL}</a>
        <a href="mailto:{MAIL}">{MAIL}</a>
        <span>Sur place du mardi au vendredi,<br>10 h – 17 h 30 environ, sur rendez-vous</span>
      </address>
    </div>
    <div>
      <h2>Le site</h2>
      <ul>
{foot_nav}
      </ul>
    </div>
    <div>
      <h2>Rejoindre l'aventure</h2>
      <p>Adhérer, s'inscrire à un atelier, proposer une exposition ou un spectacle : écrivez-nous.</p>
      <a class="btn sun sm" href="nous-rejoindre.html#inscription">S'inscrire</a>
    </div>
  </div>
  <div class="wrap legal">
    <span>© 2026 Association Aux Arts ! · Avignon</span>
    <a href="mentions-legales.html">Mentions légales</a>
    <span>Maquette de présentation — textes et visuels issus du site auxartsavignon.fr</span>
  </div>
</footer>
<script src="main.js" defer></script>
</body>
</html>
'''


def curve(color='var(--paper)'):
    return f'<svg class="curve" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" style="color:{color}"><path fill="currentColor" d="M0 60V30C120 0 240 0 360 24s240 34 360 20 240-44 360-34 240 30 360 30V60z"/></svg>'


def page_hero(crumb, h1, lede, bg):
    return f'''<header class="page-hero" style="--bg:url({bg})">
  <img class="mark" src="img/couronne.png" alt="" width="300" height="219">
  <div class="wrap">
    <p class="crumb"><a href="index.html">Accueil</a> · {crumb}</p>
    <h1>{h1}</h1>
    <p>{lede}</p>
  </div>
  {curve()}
</header>
'''


def write(name, content):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        f.write(content)
    print('écrit', name, len(content) // 1024, 'ko')


def poster_btn(src, cap, alt=None):
    alt = alt or f'Affiche : {cap}'
    return f'<button type="button" data-zoom="img/affiches/{src}.webp" data-alt="{E(alt)}" data-cap="{E(cap)}"><img src="img/affiches/{src}.webp" width="820" height="1160" loading="lazy" alt="{E(alt)}"></button>'


LIGHTBOX = '''<dialog class="lb" aria-label="Agrandissement de l'image"><div class="lb-in"><button class="lb-x" type="button" aria-label="Fermer">✕</button><div><img src="" alt=""><p></p></div></div></dialog>
'''

# ───────────────────────── Données ─────────────────────────
NEWS = [
    dict(d='2026-10-22', dl='22 octobre 2026', tag='Agenda', t="L'agenda d'automne est en ligne",
         p="Ateliers, stages, cours, causeries et concerts d'octobre à décembre 2026 : le programme a été mis à jour le 22 octobre.", img='img/affiches/programme.webp'),
    dict(d='2026-09-30', dl='Septembre 2026 → mai 2027', tag='Défi', t="Défi de création « Chacun-Ensemble » : à vos créations !",
         p="Thème commun : la métamorphose. Toutes les formes artistiques sont bienvenues, pour les artistes pro ou non. Les œuvres seront partagées lors de Fest'in Arts, fin mai 2027 au Théâtre du 11.", img='img/affiches/defi-chacun-ensemble.webp'),
    dict(d='2026-11-05', dl='Jeudi 5 novembre 2026', tag='Exposition', t='Vernissage de Clémentine Mathieu',
         p="Peintures abstraites à l'acrylique, à découvrir au local. Rendez-vous à 19 h. Prochain vernissage : Rodrigo Arias Perez, le jeudi 3 décembre.", img='img/affiches/evenements.webp'),
    dict(d='2026-10-14', dl='Octobre 2026', tag='Exposition', t='Christian de Héricourt expose Aux Arts',
         p="Photographies de danse au local en octobre, avec un vernissage le 1er octobre. L'exposition a aussi été relayée par le média Avignon et Moi.", img='img/galerie/danse-1.webp'),
    dict(d='2026-11-01', dl='Dimanche 1er novembre 2026', tag='Concert', t='Le Bal des Saints Animés au Théâtre du 11',
         p="IOANES (chanson métèque) à 19 h, puis Mon Cœur Balbeat à 21 h pour une musique à danser. Buvette et petite restauration sur place.", img='img/affiches/bal-saints-animes.webp'),
    dict(d='2026-11-21', dl='Samedi 21 novembre 2026', tag='Concert', t='Musiques de tradition soufie, danse derviche et cuisine syrienne',
         p="Repas syrien dès 19 h 30 (sur réservation), puis concert à 21 h avec AbdulRahman Modawar. Billetterie sur HelloAsso.", img='img/affiches/concert-syrien.webp'),
    dict(d='2026-12-11', dl='Vendredi 11 décembre 2026', tag='Concert', t='Monsieur Parallèle en quatuor',
         p="Chanson française portée par la voix et le violon, entre voyage et onirisme. 20 h 30 au Théâtre du 11.", img='img/affiches/monsieur-parallele.webp'),
    dict(d='2026-10-05', dl='Appel ouvert', tag='Appel aux artistes', t='Programmation du Théâtre du 11, janvier – juin 2027',
         p="Artistes, envoyez vos propositions à contact@auxartsavignon.fr avec « PROG TH11 » en objet.", img='img/affiches/scene-ouverte-2.webp'),
    dict(d='2026-05-21', dl='21 mai 2026 · octobre 2026', tag='Médias', t='Aux Arts ! à la radio',
         p="Stéphanie Berger a présenté le lieu et la scène ouverte du festival sur Osmose Radio ; une interview RCF est annoncée pour octobre 2026.", img='img/place-pasteur.jpg'),
    dict(d='2026-04-14', dl='14 avril 2026', tag='Presse', t='Vaucluse Matin : « Aux Arts !, un nouveau lieu dédié à la création et aux artistes »',
         p="Le quotidien présente l'ouverture du lieu place Pasteur et sa coordinatrice, Stéphanie Berger.", img='img/galerie/presse-vaucluse-matin.webp'),
    dict(d='2026-07-01', dl='1er – 26 juillet 2026', tag='Festival', t='Scène ouverte extérieure en plein cœur du Festival',
         p="Chaque soir de 18 h à 21 h 30, 15 minutes par artiste devant le local, dans le cadre des « Rencontres artistes publics hors les murs ».", img='img/affiches/scene-ouverte.webp'),
    dict(d='2026-03-20', dl='20 mars 2026', tag='Le lieu', t='Inauguration du lieu',
         p="Présentation du projet et du local à 18 h 30, puis concert avec le Caba's Band (afrobeat, latino funk) à 20 h.", img='img/affiches/inauguration.webp'),
]


for _i, _n in enumerate(NEWS):
    _n['id'] = f'actu-{_i + 1}'


def news_card(n, tag_el='h3', page='index'):
    href = 'actualites.html#' + n['id'] if page == 'index' else '#' + n['id']
    return f'''<article class="rv" id="{n['id'] if page != 'index' else 'i-' + n['id']}"><a class="news" href="{href}" aria-label="{E(n['t'])}">
  <div class="th" style="--img:url({n['img']})"><b>{E(n['tag'])}</b></div>
  <div class="bd"><time>{E(n['dl'])}</time><{tag_el}>{E(n['t'])}</{tag_el}><p>{E(n['p'])}</p></div></a></article>'''


# Ateliers : (id, titre, icône, couleur, tags, intervenant, photo, résumé, détails)
A = [
    dict(id='makeup', t='Atelier make-up', ico='💄', c='#F2A7A0', tags='ponctuel', who='Agnès Fogli', img='agnes-fogli',
         sum="Atelier unique de partage de connaissances : maîtriser l'auto-maquillage pour le casting, la photo, la scène… ou simplement se sentir bien.",
         det=[('Public', 'Artistes (casting, photos, spectacle) · habitant·es (conseils)'), ('Intervenante', 'Agnès Fogli, comédienne et maquilleuse professionnelle'), ('Date', 'Mercredi 18 novembre 2026'), ('Horaire', '17 h 30 – 20 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '5 € / h · 6 personnes maximum')],
         note="Mettre le maquillage au service de ses qualités physiques ou d'un personnage : points forts, points faibles.", mail='agnes.fogli@orange.fr', feat=True),
    dict(id='couture', t='Couture', ico='🧵', c='#F7C93E', tags='regulier', who='Joëlle', img='joelle',
         sum="Ajuster un vêtement, faire un ourlet, recoudre des boutons… « Ensemble on peut ! »",
         det=[('Public', 'Adultes, tous besoins en couture'), ('Intervenante', 'Joëlle'), ('Dates', 'Un samedi par mois : 24/10 · 14/11 · 05/12'), ('Horaire', '14 h – 17 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '10 € / h')],
         note='', mail='jowelle84@yahoo.com'),
    dict(id='dessin', t='Dessin', ico='✏️', c='#FBE08A', tags='regulier', who='Nijazi Hashani', img='nijazi-hashani',
         sum="Les bases du dessin et de la peinture en maîtrisant la perspective, avec un accompagnement personnalisé.",
         det=[('Public', 'Débutant·es comme initié·es · tous niveaux'), ('Intervenant', 'Nijazi Hashani, artiste peintre'), ('Dates', 'Un mardi sur 2 : 03/11 · 17/11 · 01/12 · 15/12'), ('Horaire', '18 h – 20 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '15 € / h · 6 personnes maximum')],
         note='', mail='mledoze3@gmail.com'),
    dict(id='peinture', t='Peinture & bien-être', ico='🎨', c='#EF8F1B', tags='regulier', who='Magali Le Doze', img='magali-le-doze',
         sum="Libérez votre potentiel créateur : laissez parler les couleurs, explorez vos émotions dans une ambiance conviviale.",
         det=[('Public', 'Sans pré-requis artistique · tous niveaux'), ('Intervenante', 'Magali Le Doze, artiste peintre et arthérapeute'), ('Dates', 'Un mardi sur 2 : 10/11 · 24/11 · 08/12 · 22/12'), ('Horaire', '18 h – 20 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '15 € / h · 6 personnes maximum')],
         note='', mail='mledoze3@gmail.com'),
    dict(id='art-des-mots', t="L'Art des mots", ico='✍️', c='#F2A7A0', tags='regulier', who='Raphaëlle Garcia', img='raphaelle-garcia',
         sum="Et si tous les arts menaient à l'écriture ? Cinéma, photographie, musique, danse… autant de portes pour voir le monde et l'écrire.",
         det=[('Public', 'Adultes · tous niveaux · 6 maximum'), ('Intervenante', 'Raphaëlle Garcia, enseignante et autrice'), ('Dates', 'Deux lundis par mois : 02/11 · 16/11 · 07/12 · 14/12'), ('Horaire', '18 h – 20 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '27 € la séance · 75 € les 3 · 140 € les 6')],
         note="Tarifs de l'affiche d'automne ; un autre flyer indique 22 € / 63 € / 100 € — à confirmer avec l'intervenante.", mail='raphaellegabrielle.garcia@gmail.com', tel='06 80 21 94 52'),
    dict(id='plaisir-des-mots', t='Le Plaisir des mots', ico='📝', c='#FBE08A', tags='regulier', who='Raphaëlle Garcia', img='raphaelle-garcia',
         sum="Libérer l'écriture en s'amusant : des propositions ludiques et accessibles pour renouer avec le plaisir de jouer avec les mots.",
         det=[('Public', 'Adultes · sans prérequis'), ('Intervenante', 'Raphaëlle Garcia'), ('Dates', 'Un samedi par mois : 07/11 · 05/12'), ('Horaire', '10 h – 12 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '27 € la séance · 75 € les 3 · 140 € les 6')],
         note="Une entrée en écriture surprenante et décomplexante.", mail='raphaellegabrielle.garcia@gmail.com', tel='06 80 21 94 52'),
    dict(id='salon', t="P'tit Salon Littéraire Populaire", ico='📖', c='#F7C93E', tags='causerie', who='Stéphanie Berger', img='stephanie-berger',
         sum="Partager ses écrits, écrire sur un thème (novembre : « avenir »), écouter celles et ceux des autres. Toute forme littéraire est bienvenue.",
         det=[('Public', 'Toutes celles et ceux qui aiment écrire librement'), ('Animatrice', 'Stéphanie Berger, coordinatrice du projet'), ('Dates', 'Un mercredi par mois : 25/11 · 16/12'), ('Horaire', '18 h 30 – 20 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', 'Entrée libre')],
         note="Une production n'excédant pas une feuille A4 recto-verso.", mail=MAIL),
    dict(id='histoire-art', t="Histoire de l'art", ico='🖼️', c='#C6826C', tags='causerie', who='Eva Nonna Sederstam', img='eva-nonna-sederstam',
         sum="Cycle de causeries sur Giacometti et Michel-Ange : observer, ressentir et débattre autour d'œuvres qui constituent nos cultures.",
         det=[('Public', 'Curieux·ses, sans prérequis'), ('Intervenante', 'Eva Nonna Sederstam, artiste plasticienne et historienne de l\'art'), ('Dates', 'Un vendredi par mois : 20/11 · 18/12'), ('Horaire', '19 h 30 – 21 h'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '5 € l\'atelier')],
         note='', mail='eva.nonna.sederstam@gmail.com'),
    dict(id='guitare', t='Cours de guitare', ico='🎸', c='#EF8F1B', tags='musique', who='Fabrice Meddouri, dit « Fabio »', img='fabrice-meddouri',
         sum="Cours individuel sur demande : jazz, bossa-nova, rock, funk, blues… avec une approche fondée sur l'écoute.",
         det=[('Public', 'Cours individuel, sur demande'), ('Intervenant', 'Fabrice Meddouri, dit « Fabio »'), ('Date', 'Sur demande'), ('Horaire', 'À convenir'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '25 € / h')],
         note='', mail='fabricemeddouri63@gmail.com', tel='06 51 13 71 00'),
    dict(id='saxo-piano', t='Saxo, piano & batucada', ico='🎷', c='#F2A7A0', tags='musique', who='Raphaël Aissa Richebe', img='raphael-aissa-richebe',
         sum="Cours individuels de saxo et de piano (jazz, blues…), et un atelier de batucada : fabriquer des instruments de percussion en objets de récupération.",
         det=[('Public', 'Cours individuel, sur demande'), ('Intervenant', 'Raphaël Aissa Richebe'), ('Date', 'Sur demande'), ('Horaire', 'À convenir'), ('Lieu', 'Au local, 3 place Louis Pasteur'), ('Tarif', '20 € / h')],
         note="Donner le goût aux plaisirs de jouer ensemble et des clés pour ouvrir des portes vers cette vocation.", mail='raphaelaissarichebe@gmail.com'),
    dict(id='meisner', t='Méthode Meisner', ico='🎬', c='#FBE08A', tags='ponctuel', who='Patrick Séminor', img=None,
         sum="« Jeu face caméra » : un partage de connaissances par un comédien professionnel, réservé aux professionnel·les et semi-professionnel·les.",
         det=[('Public', 'Pro / semi-pro · 6 places'), ('Intervenant', 'Patrick Séminor, comédien professionnel'), ('Date', 'Samedi 21 novembre 2026'), ('Horaire', '9 h 30 – 17 h'), ('Lieu', "Au local (à confirmer)"), ('Tarif', '30 €')],
         note='', mail='pat.seminor@gmail.com'),
    dict(id='com-pro', t='Communication pro', ico='🗣️', c='#C6826C', tags='ponctuel', who='Caroline Saugier', img=None,
         sum="Un atelier mensuel de 2 h à destination des artistes et acteurs culturels : une alternative à l'IA pour penser posément sa communication.",
         det=[('Public', 'Artistes et acteurs culturels'), ('Intervenante', 'Caroline Saugier'), ('Dates', 'À partir de novembre — dates à venir'), ('Horaire', 'Atelier de 2 h · 6 séances'), ('Lieu', 'Au local (à confirmer)'), ('Tarif', "20 € l'atelier")],
         note='', mail=MAIL),
]


def atelier_card(a):
    who_img = f'<img src="img/portraits/{a["img"]}.webp" width="46" height="46" alt="" loading="lazy">' if a['img'] else '<span class="ring init" style="width:46px;height:46px;font-size:1.2rem;border:2.5px solid var(--brick)" aria-hidden="true">' + a['who'][0] + '</span>'
    meta = {k: v for k, v in a['det']}
    dates = meta.get('Dates') or meta.get('Date')
    dl = ''.join(f'<dt>{E(k)}</dt><dd>{E(v)}</dd>' for k, v in a['det'])
    note = f'<p>{E(a["note"])}</p>' if a['note'] else ''
    tel = f' · <a href="tel:{a["tel"].replace(" ", "")}">{a["tel"]}</a>' if a.get('tel') else ''
    feat = ' feat' if a.get('feat') else ''
    return f'''<div class="rv flip{feat}" id="{a['id']}" data-tags="{a['tags']}" style="--c:{a['c']}">
  <div class="fl-in">
    <div class="fl-f">
      <div class="ico" aria-hidden="true">{a['ico']}</div>
      <h3>{E(a['t'])}</h3>
      <div class="who">{who_img}<span>{E(a['who'])}</span></div>
      <p>{E(a['sum'])}</p>
      <div class="meta"><span>🗓 {E(dates)}</span><span>💶 {E(meta.get('Tarif', ''))}</span></div>
      <button class="flip-btn" type="button" aria-expanded="false">Voir la fiche complète ↻</button>
    </div>
    <div class="fl-b">
      <h3>{E(a['t'])}</h3>
      <dl>{dl}</dl>
      {note}
      <p><strong>Inscription :</strong> <a href="mailto:{a['mail']}">{a['mail']}</a>{tel}<br><small>Adhésion annuelle à l'association nécessaire.</small></p>
      <a class="btn sun sm" href="nous-rejoindre.html?atelier={a['id']}#inscription">S'inscrire</a>
      <button class="flip-btn" type="button" aria-expanded="false" style="color:#fff">← Retour</button>
    </div>
  </div>
</div>'''


# ───────────────────────── Pages ─────────────────────────

def build_index():
    p = 'index.html'
    tiles = [
        ('le-projet.html', '🎭', 'Le projet', "Un lieu consacré aux arts, en plein cœur de la ville, comme une place de village."),
        ('ateliers.html', '🎨', 'Ateliers', 'Écriture, dessin, peinture, couture, make-up, musique…'),
        ('agenda.html', '🗓', 'Agenda', 'Vernissages, concerts, causeries : tous les prochains rendez-vous.'),
        ('intervenants.html', '🧑‍🎨', 'Intervenants', 'Celles et ceux qui animent les ateliers et les scènes.'),
        ('galerie.html', '📸', 'Galerie', 'Expositions, scènes ouvertes et affiches en images.'),
        ('actualites.html', '📰', 'Actualités', 'Les dernières nouvelles, la presse et la radio.'),
        ('partenaires.html', '🤝', 'Partenaires', 'Théâtre du 11, associations du lieu, soutiens.'),
        ('nous-rejoindre.html', '👋', 'Nous rejoindre', "Adhérer, s'inscrire, être bénévole, nous écrire."),
    ]
    tiles_html = '\n'.join(f'<a class="tile rv" href="{h}"><span class="ico" aria-hidden="true">{i}</span><h3>{t}</h3><p>{d}</p></a>' for h, i, t, d in tiles)
    slides = [('inauguration', 'Inauguration · 20 mars'), ('scene-ouverte', 'Scène ouverte · juillet'), ('rentree', 'Rentrée · 12 septembre'),
              ('defi-chacun-ensemble', 'Défi Chacun-Ensemble'), ('programme', 'Programme oct. – déc.'), ('evenements', 'Événements oct. – déc.'),
              ('bal-saints-animes', 'Bal des Saints Animés · 1er nov.'), ('concert-syrien', 'Concert soufi · 21 nov.'), ('monsieur-parallele', 'Monsieur Parallèle · 11 déc.')]
    slides_html = '\n'.join(f'<figure class="slide">{poster_btn(s, c)}<figcaption>{c}</figcaption></figure>' for s, c in slides)
    news3 = '\n'.join(news_card(n) for n in [NEWS[0], NEWS[1], NEWS[2]])
    logos = f'''<a class="logo-box" href="partenaires.html"><img src="img/partenaires-theatre-du-11.png" alt="Théâtre du 11" width="54" height="86" loading="lazy"><span>Théâtre du 11</span></a>
<a class="logo-box" href="partenaires.html"><img src="img/partenaires-booste.png" alt="Association Booste" width="76" height="76" loading="lazy"><span>Booste</span></a>
<a class="logo-box" href="partenaires.html"><img src="img/partenaires-correspondance.png" alt="Correspondance, art et innovation sociale" width="200" height="55" loading="lazy"><span>Correspondance</span></a>
<a class="logo-box" href="partenaires.html"><img src="img/partenaires-arthisseo.png" alt="Collectif ArtHisséo" width="200" height="51" loading="lazy"><span>ArtHisséo</span></a>
<a class="logo-box" href="partenaires.html"><img src="img/partenaires-label-cites-dor.png" alt="Label des Cités d'Or" width="76" height="76" loading="lazy"><span>Label des Cités d'Or</span></a>'''
    marq = ['Écriture', 'Dessin', 'Peinture', 'Couture', 'Make-up', 'Musique', 'Théâtre', 'Danse', 'Vernissages', 'Concerts', 'Causeries', 'Scène ouverte']
    mq = ''.join(f'<span>{m}</span>' for m in marq)
    body = f'''<div class="curtain" aria-hidden="true"><i></i><i></i></div>
<main id="contenu">
<section class="hero" aria-labelledby="h1">
  <div class="hero-bg" role="img" aria-label="La place Louis Pasteur et sa fontaine, à Avignon"></div>
  <div class="spot" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <img class="crown" src="img/couronne.png" width="92" height="67" alt="">
    <h1 id="h1">Aux <em>Arts</em> !</h1>
    <p class="tag">en Avignon</p>
    <p class="sub">Associations, compagnies, artistes et habitant·es réunis dans un lieu consacré aux arts : ateliers, expositions, concerts et rencontres, en plein cœur de la ville.</p>
    <div class="cta-row">
      <a class="btn sun" href="ateliers.html">Découvrir les ateliers</a>
      <a class="btn light" href="nous-rejoindre.html#inscription">S'inscrire</a>
    </div>
    <p class="addr">📍 3 place Louis Pasteur, 84000 Avignon</p>
  </div>
  <div class="marquee" aria-hidden="true"><div>{mq}{mq}</div></div>
</section>

<section class="sec" id="next-block" aria-labelledby="h-next">
  <div class="wrap">
    <div class="next rv">
      <div class="poster"><img id="next-img" src="img/affiches/couture-makeup.webp" width="820" height="1160" alt="Affiche du prochain atelier" loading="lazy"></div>
      <div>
        <span class="eyebrow" style="color:var(--sun)">Prochain atelier à ne pas manquer</span>
        <h2 id="h-next"><span id="next-title">Atelier make-up avec Agnès Fogli</span></h2>
        <p class="when" id="next-when">Mercredi 18 novembre 2026 · 17h30 – 20h</p>
        <div class="cd" id="countdown" role="timer" aria-label="Compte à rebours avant le prochain atelier">
          <div><b data-u="d">00</b><span>jours</span></div><div><b data-u="h">00</b><span>heures</span></div><div><b data-u="m">00</b><span>minutes</span></div><div><b data-u="s">00</b><span>secondes</span></div>
        </div>
        <ul><li>💄 Partage de connaissances pour l'auto-maquillage : casting, photo, spectacle</li><li>👥 6 personnes maximum · 5 € / h · adhésion à l'association nécessaire</li><li>📍 Au local, 3 place Louis Pasteur</li></ul>
        <div class="cta-row"><a class="btn sun" id="next-cta" href="ateliers.html#makeup">S'inscrire à l'atelier</a><a class="btn light" href="agenda.html">Tout l'agenda</a></div>
      </div>
    </div>
  </div>
</section>

<section class="sec cream" aria-labelledby="h-apercu">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Entrez, c'est ouvert</span><h2 id="h-apercu">Un lieu où l'on pratique les arts ensemble</h2>
    <p class="lead">Un lieu associatif au service des artistes et de la créativité, pour se rencontrer, s'entraider et créer, avec les arts comme liant.</p></div>
    <div class="grid g4">
{tiles_html}
    </div>
  </div>
</section>

<section class="sec sun" aria-labelledby="h-chiffres">
  <div class="wrap">
    <div class="sec-head center rv"><span class="eyebrow">En quelques chiffres</span><h2 id="h-chiffres" style="color:var(--brick-d)">Une première saison bien remplie</h2></div>
    <div class="stats">
      <div class="stat rv"><b data-count="12">0</b><span>ateliers, cours et causeries à l'agenda d'automne</span></div>
      <div class="stat rv"><b data-count="11">0</b><span>intervenant·es et animateur·rices</span></div>
      <div class="stat rv"><b data-count="26">0</b><span>jours de scène ouverte en juillet 2026</span></div>
      <div class="stat rv"><b data-count="8">0</b><span>rendez-vous culturels d'octobre à décembre</span></div>
    </div>
    <p class="muted rv" style="text-align:center;margin-top:20px;font-size:.9rem">Chiffres établis d'après les affiches 2026 — à valider avec l'association.</p>
  </div>
</section>

<section class="sec" aria-labelledby="h-aff">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Sur les murs du lieu</span><h2 id="h-aff">Les affiches</h2></div>
    <div class="car rv">
      <div class="car-btns"><button class="round" type="button" data-prev aria-label="Affiches précédentes">←</button><button class="round" type="button" data-next aria-label="Affiches suivantes">→</button></div>
      <div class="track" tabindex="0" aria-label="Carrousel d'affiches, défilement horizontal">
{slides_html}
      </div>
    </div>
  </div>
</section>

<section class="sec cream" aria-labelledby="h-news">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Ça bouge</span><h2 id="h-news">Dernières actualités</h2></div>
    <div class="grid g3">
{news3}
    </div>
    <p style="margin-top:28px"><a class="btn ghost" href="actualites.html">Toutes les actualités</a></p>
  </div>
</section>

<section class="sec" aria-labelledby="h-part">
  <div class="wrap">
    <div class="sec-head center rv"><span class="eyebrow">Ils font vivre le lieu</span><h2 id="h-part">Partenaires et associations du lieu</h2></div>
    <div class="logos rv">
{logos}
    </div>
  </div>
</section>

<section class="call" aria-labelledby="h-call">
  <div class="wrap in">
    <div class="rv"><h2 id="h-call">Artiste, musicien·ne pro ?</h2>
    <p>Besoin d'un lieu pour animer des ateliers, des stages ou donner des cours ? Nous construisons l'agenda 2027 : contactez-nous !</p></div>
    <div class="cta-row rv" style="margin:0"><a class="btn" href="nous-rejoindre.html#contact">Proposer un projet</a><a class="btn ghost" href="nous-rejoindre.html#inscription">S'inscrire</a></div>
  </div>
</section>
</main>
{LIGHTBOX}'''
    write(p, head(p, 'Accueil', "Aux Arts ! : un lieu associatif au 3 place Louis Pasteur à Avignon. Ateliers d'écriture, dessin, peinture, couture, make-up et musique, vernissages, concerts et rencontres.",
                  preload='<link rel="preload" as="image" href="img/place-pasteur.jpg">\n') + header(p) + body + footer())


def build_projet():
    p = 'le-projet.html'
    todo = lambda t: f'<p class="tbc">{t}</p>'
    faire = [('🎨', 'Ateliers artistiques', 'Dessin, peinture, écriture, couture…'), ('🎸', 'Cours de musique', 'Cours individuels et ateliers.'),
             ('🎤', 'Événements', 'Causeries, expositions, lectures, concerts.'), ('🕸', 'Mise en réseaux', 'Artistes, compagnies, associations et habitant·es.'),
             ('🧰', 'Mutualisation', 'Des savoirs et des outils.'), ('🏠', 'Le lieu pour vos stages', 'Mise à disposition sur 1, 2 ou 3 jours.'),
             ('🎭', 'Rencontres pro', 'Entre acteurs du spectacle vivant.'), ('🤲', 'Entraide', 'Soutien administratif dans les univers associatif et artistique.')]
    faire_html = '\n'.join(f'<div class="card rv"><span style="font-size:2rem" aria-hidden="true">{i}</span><h3>{t}</h3><p>{d}</p></div>' for i, t, d in faire)
    tl = [('Début 2026', 'Naissance du projet', "Aux Arts ! est créée pour mettre en lumière et en réseaux les artistes, pro et amateurs, et les habitant·es, dans un lieu identifié et accessible au cœur d'Avignon."),
          ('20 mars 2026', 'Inauguration', "Présentation du projet et du local à 18 h 30, suivie d'un concert avec le Caba's Band."),
          ('14 avril 2026', 'La presse en parle', "Vaucluse Matin publie « Aux Arts !, un nouveau lieu dédié à la création et aux artistes »."),
          ('1er – 26 juillet 2026', 'Scène ouverte extérieure', "Chaque soir devant le local, en plein Festival d'Avignon, dans le cadre des « Rencontres artistes publics hors les murs »."),
          ('6 et 12 septembre 2026', 'Rentrée', "Présence au forum des associations, puis « Après l'été, sous les marronniers… » : ateliers découverte, rencontre des artistes et lancement du défi Chacun-Ensemble."),
          ('Octobre – décembre 2026', 'Saison d\'automne', "Ateliers réguliers, trois vernissages, concerts au Théâtre du 11, causeries."),
          ('Janvier 2027', 'Assemblée générale', "Les adhérent·es sont invité·es à la première réunion d'organisation et à l'AG de janvier 2027."),
          ('Fin mai 2027', "Fest'in Arts", "Exposition, scènes ouvertes et rencontres au Théâtre du 11 : partage des œuvres du défi de création.")]
    tl_html = '\n'.join(f'<li class="rv"><time>{d}</time><h3>{t}</h3><p>{x}</p></li>' for d, t, x in tl)
    vals = [('Lier l\'art et l\'humain', "Témoigner de la nécessité de l'art au quotidien."), ('Liberté d\'expression', "Favoriser l'expression libre pour accompagner nos humanités à traverser les défis de l'époque."),
            ('Pro et amateur', "Un lieu consacré à nourrir et soutenir nos élans créateurs, professionnels comme amateurs."), ('Entraide et mutualisation', "Partager outils, compétences et visibilité entre professionnels du spectacle vivant et artistes visuels."),
            ('Penser le monde ensemble', "Se réunir, créer et penser le monde librement, autrement, et ensemble.")]
    vals_html = '\n'.join(f'<div class="card rv"><h3>{t}</h3><p>{d}</p></div>' for t, d in vals)
    body = page_hero('Le projet', 'Le projet Aux Arts !', "Un lieu associatif consacré à nourrir et soutenir nos élans créateurs, où se rencontrer et s'entraider avec les arts comme liant.", 'img/place-pasteur.jpg') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-pres">
  <div class="wrap grid g2" style="align-items:center;gap:44px">
    <div class="rv"><span class="eyebrow">Présentation</span><h2 id="h-pres">Comme une place de village</h2>
      <p class="lead">En plein cœur de la ville, un écrin sensible aux multiples langages. Aux Arts ! réunit associations, compagnies, artistes et habitant·es dans un lieu consacré.</p>
      <p>Créée début 2026, l'association veut mettre en lumière et en réseaux les artistes, pro et amateurs, et les habitant·es. Elle imagine la mutualisation d'outils et de compétences entre professionnels du spectacle vivant et artistes visuels, et, par l'emplacement idéal du local, offre de la visibilité à plusieurs acteurs associatifs qui mettent l'art au service de l'humain.</p></div>
    <div class="rv"><blockquote class="quote">« Un arbre qui tombe fait beaucoup de bruit, une forêt qui pousse ne s'entend pas. »</blockquote></div>
  </div>
</section>

<section class="sec cream" aria-labelledby="h-faire">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Au programme</span><h2 id="h-faire">Ce qu'on fait ici</h2></div>
  <div class="grid g4">
{faire_html}
  </div></div>
</section>

<section class="sec" aria-labelledby="h-hist">
  <div class="wrap grid g2" style="gap:44px">
    <div class="rv" style="position:sticky;top:calc(var(--hh) + 20px);align-self:start"><span class="eyebrow">Depuis 2026</span><h2 id="h-hist">L'histoire du projet</h2>
      <p class="lead">De l'inauguration en mars 2026 au rendez-vous Fest'in Arts de mai 2027.</p>
      <img src="img/galerie/place-fontaine.webp" width="799" height="446" loading="lazy" alt="La place Louis Pasteur et sa fontaine" style="border-radius:var(--r);border:4px solid #fff;box-shadow:var(--shadow)"></div>
    <ol class="tl">
{tl_html}
    </ol>
  </div>
</section>

<section class="sec sun" aria-labelledby="h-val">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Ce qui nous guide</span><h2 id="h-val" style="color:var(--brick-d)">Nos valeurs</h2></div>
  <div class="grid g3">
{vals_html}
  </div></div>
</section>

<section class="sec" aria-labelledby="h-team">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Les personnes</span><h2 id="h-team">Équipe et coordination</h2></div>
    <div class="person rv">
      <img class="ring" src="img/portraits/stephanie-berger.webp" width="190" height="190" alt="Portrait de Stéphanie Berger" loading="lazy">
      <div><h3>Stéphanie Berger</h3><p class="chip red">Coordinatrice du projet</p>
      <p>Suite à une reconversion professionnelle dans le milieu du spectacle vivant, Stéphanie développe une partie de ses activités dans le soutien administratif, tout en poursuivant ses propres explorations artistiques. Longtemps impliquée dans le tissu associatif, elle coordonne le projet Aux Arts !, la vie de son local et le partenariat avec le Théâtre du 11.</p>
      <p>Pour prendre rendez-vous, rejoindre l'association ou poser une question sur l'accompagnement administratif : <a href="mailto:{MAIL}">{MAIL}</a> · <a href="tel:{TEL_HREF}">{TEL}</a></p></div>
    </div>
    <div class="grid g2" style="margin-top:34px">
      <div class="todo rv"><h3>Bureau de l'association</h3>{todo("Composition du bureau (présidence, trésorerie, secrétariat) à renseigner par l'association.")}</div>
      <div class="todo rv"><h3>Soutien administratif</h3><p>Entraide dans les univers associatif et artistique : création et gestion d'association, partenariats, dossiers. Renseignements par mail.</p></div>
    </div>
  </div>
</section>

<section class="call" aria-labelledby="h-c2"><div class="wrap in"><div class="rv"><h2 id="h-c2">Envie de participer ?</h2><p>Ateliers, expositions, scènes ouvertes : le lieu est fait pour être habité.</p></div><div class="cta-row rv" style="margin:0"><a class="btn" href="ateliers.html">Voir les ateliers</a><a class="btn ghost" href="nous-rejoindre.html">Nous rejoindre</a></div></div></section>
</main>
'''
    write(p, head(p, 'Le projet', "Découvrez le projet Aux Arts ! : un lieu associatif au service des artistes et de la créativité au 3 place Louis Pasteur à Avignon, son histoire, ses valeurs et son équipe.", 'img/place-pasteur.jpg') + header(p) + body + footer())


def build_ateliers():
    p = 'ateliers.html'
    cards = '\n'.join(atelier_card(a) for a in A)
    body = page_hero('Ateliers', 'Les ateliers', "Écriture, dessin, peinture, couture, make-up, musique, théâtre : une fiche par atelier. Survolez ou touchez une carte pour la retourner.", 'img/galerie/peinture-3.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-liste">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Automne 2026</span><h2 id="h-liste">Choisissez votre atelier</h2>
    <p class="lead">Infos et inscription préalable par mail auprès de chaque intervenant·e, ou via le formulaire. Une adhésion annuelle à l'association est nécessaire.</p></div>
    <div class="filters rv" role="group" aria-label="Filtrer les ateliers" data-filter-group=".flip">
      <button type="button" data-f="all" aria-pressed="true">Tous</button><button type="button" data-f="regulier" aria-pressed="false">Réguliers</button>
      <button type="button" data-f="ponctuel" aria-pressed="false">Ponctuels</button><button type="button" data-f="causerie" aria-pressed="false">Causeries</button><button type="button" data-f="musique" aria-pressed="false">Musique</button>
    </div>
    <div class="grid g3 ateliers-grid">
{cards}
    </div>
  </div>
</section>
<section class="sec cream" aria-labelledby="h-defi">
  <div class="wrap grid g2" style="align-items:center;gap:40px">
    <div class="rv"><span class="eyebrow">De septembre 2026 à mai 2027</span><h2 id="h-defi">Défi de création « Chacun-Ensemble »</h2>
      <p class="lead">Laissez-vous inspirer et entrez en création : toutes les formes artistiques sont acceptées.</p>
      <p>Le thème commun : la <strong>métamorphose</strong>. Ouvert à tous les artistes, pro ou non — seule condition : être soigneux·se de sa création. Les œuvres seront partagées lors de <strong>Fest'in Arts</strong>, fin mai 2027 au Théâtre du 11 (exposition, scènes ouvertes et rencontres sur deux jours).</p>
      <p>Inscription gratuite sur onparticipe.fr, ou en demandant le lien à <a href="mailto:{MAIL}">{MAIL}</a>.</p>
      <a class="btn" href="nous-rejoindre.html#contact">Rejoindre le défi</a></div>
    <div class="rv" style="max-width:340px;margin-inline:auto">{poster_btn('defi-chacun-ensemble', 'Défi de création Chacun-Ensemble')}</div>
  </div>
</section>
<section class="sec" aria-labelledby="h-stage">
  <div class="wrap grid g2" style="gap:30px">
    <div class="card rv"><span style="font-size:2rem" aria-hidden="true">🏠</span><h3 id="h-stage">Vous animez des stages ?</h3><p>Le local peut être mis à disposition pour des stages sur 1, 2 ou 3 jours. Nous construisons l'agenda 2027.</p><a class="btn ghost sm" href="nous-rejoindre.html#contact">Nous contacter</a></div>
    <div class="card rv"><span style="font-size:2rem" aria-hidden="true">✍️</span><h3>Ateliers d'écriture : les tarifs</h3><p>Deux documents de l'association indiquent des grilles différentes (27 € / 75 € / 140 € et 22 € / 63 € / 100 €). Tarif définitif à confirmer avec l'intervenante.</p></div>
  </div>
</section>
</main>
{LIGHTBOX}'''
    write(p, head(p, 'Ateliers', "Ateliers à Avignon : écriture, dessin, peinture, couture, make-up, guitare, saxo, piano, méthode Meisner et causeries au 3 place Louis Pasteur. Dates, horaires, tarifs et inscription.", 'img/affiches/programme.webp') + header(p) + body + footer())


def build_agenda():
    p = 'agenda.html'
    evs = [
        ('5', 'nov.', 'Vernissage · Clémentine Mathieu', "Peintures abstraites à l'acrylique.", 'Jeudi 5 novembre · 19 h', 'Au local, 3 place Louis Pasteur', 'vernissage', 'vernissage'),
        ('12', 'nov.', 'Association Kino-A', "Comédien·nes, figurant·es, curieux·ses… une soirée autour du court-métrage amateur.", 'Jeudi 12 novembre · 20 h', 'Théâtre du 11 · entrée libre', 'rencontre', 'rencontre'),
        ('14', 'nov.', 'Atelier couture', "Ajuster, ourler, recoudre : l'atelier de Joëlle.", 'Samedi 14 novembre · 14 h – 17 h', 'Au local · 10 € / h', 'atelier', 'atelier'),
        ('18', 'nov.', 'Atelier make-up · Agnès Fogli', "Atelier unique, 6 personnes maximum.", 'Mercredi 18 novembre · 17 h 30 – 20 h', 'Au local · 5 € / h', 'atelier', 'atelier'),
        ('20', 'nov.', "Causerie · Histoire de l'art", "Cycle Giacometti et Michel-Ange avec Eva Nonna Sederstam.", 'Vendredi 20 novembre · 19 h 30 – 21 h', "Au local · 5 € l'atelier", 'atelier', 'atelier'),
        ('21', 'nov.', 'Musiques de tradition soufie · danse derviche', "Cuisine syrienne dès 19 h 30 (sur réservation, 35 € repas + concert), concert à 21 h (20 € sans repas).", 'Samedi 21 novembre · 19 h 30 / 21 h', 'Théâtre du 11 · billetterie HelloAsso', 'concert', 'concert'),
        ('21', 'nov.', 'Stage · Méthode Meisner', "Jeu face caméra avec Patrick Séminor, pour pro et semi-pro (6 places).", 'Samedi 21 novembre · 9 h 30 – 17 h', 'Lieu à confirmer · 30 €', 'atelier', 'atelier'),
        ('25', 'nov.', "P'tit Salon Littéraire Populaire", "Thème de la séance : « avenir ». Une feuille A4 recto-verso maximum.", 'Mercredi 25 novembre · 18 h 30 – 20 h', 'Au local · entrée libre', 'atelier', 'atelier'),
        ('3', 'déc.', 'Vernissage · Rodrigo Arias Perez', "Peintures : expressionnisme figuratif et vifs contrastes de couleurs.", 'Jeudi 3 décembre · 19 h', 'Au local, 3 place Louis Pasteur', 'vernissage', 'vernissage'),
        ('11', 'déc.', 'Monsieur Parallèle', "Chanson française, voix et violon, en quatuor.", 'Vendredi 11 décembre · 20 h 30', 'Théâtre du 11 · billetterie HelloAsso', 'concert', 'concert'),
        ('16', 'déc.', "P'tit Salon Littéraire Populaire", "Dernière séance de l'année.", 'Mercredi 16 décembre · 18 h 30 – 20 h', 'Au local · entrée libre', 'atelier', 'atelier'),
        ('18', 'déc.', "Causerie · Histoire de l'art", "Suite du cycle avec Eva Nonna Sederstam.", 'Vendredi 18 décembre · 19 h 30 – 21 h', "Au local · 5 € l'atelier", 'atelier', 'atelier'),
    ]
    evs_html = '\n'.join(f'''<article class="ev rv" data-tags="{tg}"><div class="d"><b>{d}</b><small>{m}</small></div><div><span class="chip {'red' if tg=='concert' else ''}">{E(chip.capitalize())}</span><h3>{E(t)}</h3><p>{E(x)}</p><p class="info">🕒 {E(w)}<br>📍 {E(l)}</p></div></article>''' for d, m, t, x, w, l, tg, chip in evs)
    cal = [('Novembre', [('Lun 2', '18 h – 20 h', "L'Art des mots", 'Raphaëlle Garcia'), ('Mar 3', '18 h – 20 h', 'Dessin', 'Nijazi Hashani'), ('Sam 7', '10 h – 12 h', 'Le Plaisir des mots', 'Raphaëlle Garcia'),
                         ('Mar 10', '18 h – 20 h', 'Peinture & bien-être', 'Magali Le Doze'), ('Sam 14', '14 h – 17 h', 'Couture', 'Joëlle'), ('Lun 16', '18 h – 20 h', "L'Art des mots", 'Raphaëlle Garcia'),
                         ('Mar 17', '18 h – 20 h', 'Dessin', 'Nijazi Hashani'), ('Mer 18', '17 h 30 – 20 h', 'Make-up', 'Agnès Fogli'), ('Mar 24', '18 h – 20 h', 'Peinture & bien-être', 'Magali Le Doze')]),
           ('Décembre', [('Mar 1', '18 h – 20 h', 'Dessin', 'Nijazi Hashani'), ('Sam 5', '10 h – 12 h', 'Le Plaisir des mots', 'Raphaëlle Garcia'), ('Sam 5', '14 h – 17 h', 'Couture', 'Joëlle'),
                         ('Lun 7', '18 h – 20 h', "L'Art des mots", 'Raphaëlle Garcia'), ('Mar 8', '18 h – 20 h', 'Peinture & bien-être', 'Magali Le Doze'), ('Lun 14', '18 h – 20 h', "L'Art des mots", 'Raphaëlle Garcia'),
                         ('Mar 15', '18 h – 20 h', 'Dessin', 'Nijazi Hashani'), ('Mar 22', '18 h – 20 h', 'Peinture & bien-être', 'Magali Le Doze')])]
    cal_html = ''
    for mois, rows in cal:
        r = ''.join(f'<tr><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>' for a, b, c, d in rows)
        cal_html += f'<div class="tscroll rv"><table class="cal"><caption class="sr">Ateliers réguliers de {mois} 2026</caption><thead><tr><th colspan="4">{mois} 2026</th></tr></thead><tbody>{r}</tbody></table></div>'
    arch = [('inauguration', 'Inauguration', '20 mars 2026'), ('scene-ouverte', 'Scène ouverte extérieure', '1er – 26 juillet 2026'), ('rentree', 'Après l\'été, sous les marronniers…', '12 septembre 2026'), ('bal-saints-animes', 'Bal des Saints Animés', '1er novembre 2026')]
    arch_html = '\n'.join(f'<figure class="rv">{poster_btn(s, t + " · " + d)}<figcaption>{t}<br><span class="muted">{d}</span></figcaption></figure>' for s, t, d in arch)
    past = '''<ul style="columns:2 280px;padding-left:1.1em"><li><strong>1er octobre 2026</strong> — vernissage, photographies de danse de Christian de Héricourt</li><li><strong>16 et 17 octobre 2026</strong> — récital de harpe celtique, pour la sortie du premier album d'Anaëlle Brossard</li><li><strong>1er novembre 2026</strong> — Bal des Saints Animés au Théâtre du 11</li><li><strong>12 septembre 2026</strong> — rentrée et lancement du défi Chacun-Ensemble</li></ul>'''
    body = page_hero('Agenda & événements', 'Agenda & événements', "Vernissages, concerts, causeries et ateliers : les prochains rendez-vous, et les archives en affiches. Agenda mis à jour le 22 octobre 2026.", 'img/galerie/danse-1.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-next">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">À venir</span><h2 id="h-next">Prochains rendez-vous</h2></div>
    <div class="filters rv" role="group" aria-label="Filtrer l'agenda" data-filter-group=".ev"><button type="button" data-f="all" aria-pressed="true">Tout</button><button type="button" data-f="atelier" aria-pressed="false">Ateliers</button><button type="button" data-f="concert" aria-pressed="false">Concerts</button><button type="button" data-f="vernissage" aria-pressed="false">Vernissages</button><button type="button" data-f="rencontre" aria-pressed="false">Rencontres</button></div>
    <div class="ev-list">
{evs_html}
    </div>
    <p class="muted" style="margin-top:22px">Concerts au Théâtre du 11, 11 boulevard Raspail, Avignon · billetterie en ligne sur HelloAsso ou sur place · buvette et petite restauration. Programmation de janvier à juin 2027 en cours.</p>
  </div>
</section>
<section class="sec cream" aria-labelledby="h-cal">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Jour par jour</span><h2 id="h-cal">Calendrier des ateliers réguliers</h2><p class="lead">Écriture, dessin, peinture et couture de novembre et décembre.</p></div>
    <div class="grid g2">
{cal_html}
    </div>
  </div>
</section>
<section class="sec" aria-labelledby="h-arch">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Déjà passés</span><h2 id="h-arch">Archives 2026</h2><p class="lead">Les affiches des temps forts de l'année. Cliquez pour agrandir.</p></div>
    <div class="poster-grid">
{arch_html}
    </div>
    <div class="rv" style="margin-top:34px">{past}</div>
  </div>
</section>
</main>
{LIGHTBOX}'''
    write(p, head(p, 'Agenda & événements', "L'agenda d'Aux Arts ! à Avignon : vernissages, concerts au Théâtre du 11, causeries, ateliers d'écriture, dessin, peinture et couture. Prochains rendez-vous et archives en affiches.", 'img/affiches/evenements.webp') + header(p) + body + footer())


def build_intervenants():
    p = 'intervenants.html'
    ppl = [
        ('stephanie-berger', 'Stéphanie Berger', 'Coordinatrice · P\'tit Salon', "Amoureuse des mots et des langages, écrits, parlés, mimés, déclamés, dansés, elle coordonne l'association Aux Arts !.", [('Le salon', 'ateliers.html#salon')]),
        ('raphaelle-garcia', 'Raphaëlle Garcia', 'Écriture', "Enseignante et autrice, elle anime « L'Art des mots » et « Le Plaisir des mots » : une entrée en écriture surprenante et décomplexante.", [('Ses ateliers', 'ateliers.html#art-des-mots')]),
        ('nijazi-hashani', 'Nijazi Hashani', 'Dessin', "Artiste peintre franco-albanais et peintre décorateur, diplômé de l'Institut Vander Kellen à Bruxelles. Il a exposé en France et à l'étranger (Belgique, Italie, Suisse, États-Unis, Émirats arabes unis, Chine, Kosovo).", [('Son atelier', 'ateliers.html#dessin')]),
        ('magali-le-doze', 'Magali Le Doze', 'Peinture & bien-être', "Artiste peintre, arthérapeute (AFEDAP-Paris) et psychologue clinicienne. Fresques et peintures murales en France et en Italie, expositions jusqu'à New York et au Kosovo.", [('Son atelier', 'ateliers.html#peinture')]),
        ('agnes-fogli', 'Agnès Fogli', 'Make-up', "Comédienne formée aux arts du cirque (échasses, clown) et maquilleuse professionnelle diplômée, elle crée des maquillages et anime des ateliers d'auto-maquillage pour des compagnies.", [('Son atelier', 'ateliers.html#makeup')]),
        ('eva-nonna-sederstam', 'Eva Nonna Sederstam', "Histoire de l'art", "Artiste plasticienne, avec une carrière de pédagogue dans les matières artistiques, historienne de l'art.", [('Ses causeries', 'ateliers.html#histoire-art')]),
        ('joelle', 'Joëlle', 'Couture', "« L'atelier de Joëlle est là pour vous. Ensemble on peut ! »", [('Son atelier', 'ateliers.html#couture')]),
        ('fabrice-meddouri', 'Fabrice Meddouri, dit « Fabio »', 'Guitare', "Guitariste autodidacte à ses débuts, élève du CIM (Paris), il a joué dans plusieurs formations : jazz, bossa-nova, rock, funk, blues.", [('Ses cours', 'ateliers.html#guitare')]),
        ('raphael-aissa-richebe', 'Raphaël Aissa Richebe', 'Saxo · piano · batucada', "Cours de saxo et de piano pour donner le goût du jeu ensemble, et fabrication d'instruments de percussion en objets de récupération.", [('Ses cours', 'ateliers.html#saxo-piano')]),
        (None, 'Patrick Séminor', 'Méthode Meisner', "Comédien professionnel, il propose un stage de jeu face caméra, réservé aux pro et semi-pro.", [('Le stage', 'ateliers.html#meisner')]),
        (None, 'Caroline Saugier', 'Communication pro', "Elle anime un atelier mensuel pour artistes et acteurs culturels, alternative à l'IA pour penser posément sa communication.", [('L\'atelier', 'ateliers.html#com-pro')]),
    ]

    def pc(img, name, role, bio, links):
        im = f'<img class="ring" src="img/portraits/{img}.webp" width="150" height="150" alt="Portrait de {E(name)}" loading="lazy">' if img else f'<span class="ring init" style="width:150px;height:150px;margin-bottom:18px" aria-hidden="true">{name[0]}</span>'
        ls = ''.join(f'<a class="btn ghost sm" href="{h}">{l}</a>' for l, h in links)
        return f'<article class="card pcard rv">{im}<h3>{E(name)}</h3><p class="role">{E(role)}</p><p>{E(bio)}</p><div class="links">{ls}</div></article>'
    ppl_html = '\n'.join(pc(*x) for x in ppl)
    expo = [('Christian de Héricourt', 'Photographies de danse · octobre 2026', "Un artiste aux multiples vies, l'œil affûté, patient et profondément habité par le mouvement.", ''),
            ('Clémentine Mathieu', 'Peintures · novembre 2026', "Peinture intuitive, abstraite à l'acrylique : « une expression du Soi » en grande liberté.", 'https://www.clementinemathieu.com/clementinemathieu-peintureintuitive'),
            ('Rodrigo Arias Perez', 'Peintures · décembre 2026', "Artiste auteur graphique, expressionnisme figuratif et vifs contrastes de couleurs, entre souvenirs et réalité contemporaine.", 'https://www.artmajeur.com/rodrigo-arias')]
    expo_html = '\n'.join(f'<article class="card rv"><span class="chip">Exposant·e</span><h3>{E(n)}</h3><p class="role" style="font-family:var(--f-script);font-size:1.3rem;color:var(--orange);margin:0 0 .3em">{E(r)}</p><p>{E(b)}</p>' + (ext(u, "Découvrir ses œuvres", 'btn ghost sm') if u else '') + '</article>' for n, r, b, u in expo)
    scene = [('IOANES', "Chanson métèque : « La poésie des rues, des ruelles et des chemins de traverse redemande la parole. »", 'https://ioanes.org'),
             ('Mon Cœur Balbeat', "Une musique à danser, trans-identitaire et éclectique, qui reprend la tradition du bal : contrebasse, accordéon, percussions et saxophones.", ''),
             ('AbdulRahman Modawar', "Né à Damas, chanteur du groupe Sham, il fait découvrir la musique soufie dans de grands festivals et salles, du Louvre à la Brooklyn Academy of Music. Avec Iyad Haimour et le danseur derviche Rifai Hambrouch.", ''),
             ('Monsieur Parallèle', "Chanson française portée par la voix et le violon, depuis 2014. Quatuor avec Luc Hernandez, Dorian Bleuzé et Aurélien Bellanca.", ''),
             ('Anaëlle Brossard', "Récital de harpe celtique à l'occasion de la sortie de son premier album.", ''),
             ('Association Kino-A', "Comédien·nes, figurant·es, curieux·ses : une soirée autour du court-métrage amateur.", '')]
    scene_html = '\n'.join(f'<article class="card rv"><span class="chip red">Sur scène</span><h3>{E(n)}</h3><p>{E(b)}</p>' + (ext(u, 'Site officiel', 'btn ghost sm') if u else '') + '</article>' for n, b, u in scene)
    body = page_hero('Intervenants & artistes', 'Intervenants & artistes', "Les portraits de celles et ceux qui animent les ateliers, exposent et jouent à Aux Arts !.", 'img/galerie/peinture-4.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-int">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Ils animent les ateliers</span><h2 id="h-int">Intervenant·es</h2></div>
  <div class="grid g3">
{ppl_html}
  </div>
  <p class="muted rv" style="margin-top:22px;font-size:.92rem">Présentations issues des affiches de l'association. Photos et biographies à valider avec chaque intervenant·e.</p></div>
</section>
<section class="sec cream" aria-labelledby="h-exp">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Au mur du lieu</span><h2 id="h-exp">Artistes exposé·es</h2><p class="lead">Un vernissage chaque mois, le jeudi à 19 h.</p></div>
  <div class="grid g3">
{expo_html}
  </div></div>
</section>
<section class="sec" aria-labelledby="h-sc">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Sur scène</span><h2 id="h-sc">Artistes invité·es</h2><p class="lead">Concerts et soirées au Théâtre du 11 et sur la place Pasteur.</p></div>
  <div class="grid g3">
{scene_html}
  </div></div>
</section>
<section class="call" aria-labelledby="h-c3"><div class="wrap in"><div class="rv"><h2 id="h-c3">Vous aussi, animez un atelier</h2><p>Artistes, musicien·nes, artisan·es : proposez un atelier, un stage ou un cours dans le lieu.</p></div><div class="cta-row rv" style="margin:0"><a class="btn" href="nous-rejoindre.html#contact">Proposer un atelier</a></div></div></section>
</main>
'''
    write(p, head(p, 'Intervenants & artistes', "Portraits des intervenant·es des ateliers d'Aux Arts ! à Avignon : écriture, dessin, peinture, couture, make-up, musique. Artistes exposé·es et invité·es.", 'img/portraits/agnes-fogli.webp') + header(p) + body + footer())


def build_galerie():
    p = 'galerie.html'
    items = [
        ('galerie/danse-1', 'expositions', "Photographie de danse, exposition d'octobre 2026", 'Exposition de photographies de danse (octobre 2026)'),
        ('galerie/danse-2', 'expositions', "Photographie de danse en noir et blanc", 'Exposition de photographies de danse (octobre 2026)'),
        ('galerie/peinture-1', 'expositions', "Peinture abstraite aux tons orangés, bleus et turquoise", 'Peinture exposée au local · crédit à compléter'),
        ('galerie/peinture-3', 'expositions', "Peinture expressionniste jaune et bleue", 'Peinture exposée au local · crédit à compléter'),
        ('galerie/peinture-4', 'expositions', "Peinture abstraite, éclaboussures de blanc et de bleu", 'Peinture exposée au local · crédit à compléter'),
        ('galerie/place-fontaine', 'lieu', "La fontaine de la place Louis Pasteur à Avignon", 'La place Louis Pasteur, devant le local'),
        ('galerie/ardoise-scene-ouverte', 'lieu', "Ardoise annonçant la scène ouverte extérieure devant le local", 'Scène ouverte extérieure, du 1er au 26 juillet 2026'),
        ('galerie/presse-vaucluse-matin', 'presse', "Article de Vaucluse Matin du 14 avril 2026", 'Vaucluse Matin · 14 avril 2026'),
        ('affiches/inauguration', 'affiches', "Affiche de l'inauguration du 20 mars 2026", 'Inauguration · 20 mars 2026'),
        ('affiches/scene-ouverte', 'affiches', "Affiche de la scène ouverte extérieure", 'Scène ouverte extérieure · juillet 2026'),
        ('affiches/rentree', 'affiches', "Affiche de la rentrée du 12 septembre", 'Rentrée · 12 septembre 2026'),
        ('affiches/bal-saints-animes', 'affiches', "Affiche du Bal des Saints Animés", 'Bal des Saints Animés · 1er novembre'),
        ('affiches/concert-syrien', 'affiches', "Affiche du concert de musiques soufies", 'Concert soufi · 21 novembre'),
        ('affiches/monsieur-parallele', 'affiches', "Affiche du concert de Monsieur Parallèle", 'Monsieur Parallèle · 11 décembre'),
        ('affiches/ecriture-flyer', 'affiches', "Flyer des ateliers d'écriture créative", "Ateliers d'écriture créative"),
        ('affiches/couture-makeup', 'affiches', "Affiche des ateliers couture et make-up", 'Couture et make-up'),
    ]
    figs = []
    for src, cat, alt, cap in items:
        figs.append(f'<figure class="rv" data-tags="{cat}"><button type="button" data-zoom="img/{src}.webp" data-alt="{E(alt)}" data-cap="{E(cap)}"><img src="img/{src}.webp" alt="{E(alt)}" loading="lazy" width="600" height="800"></button><figcaption>{E(cap)}</figcaption></figure>')
    body = page_hero('Galerie', 'Galerie', "Expositions, scène ouverte, presse et affiches : les images du lieu, classées par thème. Cliquez pour agrandir.", 'img/galerie/peinture-1.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-gal">
  <div class="wrap">
    <div class="sec-head rv"><h2 id="h-gal">Les images du lieu</h2></div>
    <div class="filters rv" role="group" aria-label="Filtrer la galerie" data-filter-group=".masonry figure"><button type="button" data-f="all" aria-pressed="true">Tout</button><button type="button" data-f="expositions" aria-pressed="false">Expositions</button><button type="button" data-f="lieu" aria-pressed="false">Le lieu</button><button type="button" data-f="affiches" aria-pressed="false">Affiches</button><button type="button" data-f="presse" aria-pressed="false">Presse</button></div>
    <div class="masonry">
{chr(10).join(figs)}
    </div>
    <div class="card rv" style="margin-top:30px"><h3>Photos & vidéos</h3><p>Plus d'images et de vidéos sur les réseaux de l'association.</p><p>{ext(INSTA, 'Instagram', 'btn ghost sm')} {ext(FB, 'Facebook', 'btn ghost sm')} {ext('https://www.youtube.com/watch?v=9QErLmnLVVg', 'Vidéo YouTube', 'btn ghost sm')}</p>
    <p class="muted" style="font-size:.9rem;margin:0">Aucune photo de personne mineure n'est publiée sur cette maquette. Crédits et légendes à valider avec l'association.</p></div>
  </div>
</section>
</main>
{LIGHTBOX}'''
    write(p, head(p, 'Galerie', "Galerie photo d'Aux Arts ! à Avignon : expositions de photographies et de peintures, scène ouverte extérieure, articles de presse et affiches.", 'img/galerie/peinture-1.webp') + header(p) + body + footer())


def build_actus():
    p = 'actualites.html'
    cards = '\n'.join(news_card(n, page='actus') for n in NEWS)
    body = page_hero('Actualités', 'Actualités', "Les dernières nouvelles du lieu, les annonces d'événements et ce que la presse et la radio en disent.", 'img/galerie/place-fontaine.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-act">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Quoi de neuf ?</span><h2 id="h-act">Toutes les actualités</h2></div>
    <div class="grid g3">
{cards}
    </div>
  </div>
</section>
<section class="sec cream" aria-labelledby="h-presse">
  <div class="wrap grid g2" style="gap:40px;align-items:center">
    <div class="rv"><span class="eyebrow">On parle d'Aux Arts !</span><h2 id="h-presse">Presse et radio</h2>
      <ul><li><strong>Vaucluse Matin</strong>, 14 avril 2026 : « Aux Arts !, un nouveau lieu dédié à la création et aux artistes ».</li><li><strong>Osmose Radio</strong>, interview du 21 mai 2026.</li><li><strong>RCF</strong> : interview annoncée pour octobre 2026.</li><li><strong>Avignon et Moi</strong> : « Christian de Héricourt expose Aux Arts » (octobre 2026).</li></ul>
      <p class="tbc">Liens vers les articles et enregistrements à ajouter.</p></div>
    <div class="rv" style="max-width:380px;margin-inline:auto"><button type="button" class="btn-clear" style="all:unset;cursor:zoom-in;display:block;border:4px solid #fff;border-radius:12px;overflow:hidden;box-shadow:var(--shadow)" data-zoom="img/galerie/presse-vaucluse-matin.webp" data-alt="Article de Vaucluse Matin du 14 avril 2026" data-cap="Vaucluse Matin · 14 avril 2026"><img src="img/galerie/presse-vaucluse-matin.webp" width="548" height="800" loading="lazy" alt="Article de Vaucluse Matin du 14 avril 2026 sur Aux Arts !"></button></div>
  </div>
</section>
<section class="call" aria-labelledby="h-nl"><div class="wrap in"><div class="rv"><h2 id="h-nl">Une lettre d'information ?</h2><p>L'association prévoit une newsletter : écrivez-nous pour la recevoir dès sa parution.</p></div><div class="cta-row rv" style="margin:0"><a class="btn" href="nous-rejoindre.html#contact">Nous écrire</a></div></div></section>
</main>
{LIGHTBOX}'''
    write(p, head(p, 'Actualités', "Actualités d'Aux Arts ! à Avignon : vernissages, concerts, défi de création Chacun-Ensemble, appels aux artistes, presse et radio.", 'img/affiches/programme.webp') + header(p) + body + footer())


def build_partenaires():
    p = 'partenaires.html'
    body = page_hero('Partenaires', 'Partenaires & soutiens', "Un lieu qui vit grâce aux associations, aux artistes, aux structures partenaires et à celles et ceux qui l'accompagnent.", 'img/galerie/peinture-2.webp') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-th">
  <div class="wrap grid g2" style="gap:40px;align-items:center">
    <div class="logo-box rv" style="min-height:240px"><img src="img/partenaires-theatre-du-11.png" width="108" height="171" alt="Théâtre du 11" style="max-height:170px"></div>
    <div class="rv"><span class="eyebrow">Partenaire de programmation</span><h2 id="h-th">Théâtre du 11</h2><p class="lead">Les concerts et soirées de la saison ont lieu au Théâtre du 11, 11 boulevard Raspail à Avignon, en partenariat avec Aux Arts !.</p><p>Artistes, envoyez vos propositions pour la programmation de janvier à juin 2027 à <a href="mailto:{MAIL}">{MAIL}</a> avec « PROG TH11 » en objet.</p></div>
  </div>
</section>
<section class="sec cream" aria-labelledby="h-asso">
  <div class="wrap"><div class="sec-head rv"><span class="eyebrow">Sous le même toit</span><h2 id="h-asso">Les associations du lieu</h2><p class="lead">Plusieurs acteurs associatifs mettent l'art au service de l'humain depuis le local de la place Pasteur.</p></div>
  <div class="grid g2">
    <article class="card rv"><img src="img/partenaires-booste.png" width="110" height="110" loading="lazy" alt="Logo de l'association Booste" style="margin-bottom:12px"><h3>Booste</h3><p>Accompagne les jeunes de 15 à 20 ans vers l'autonomie et la confiance en soi, en trois formules : « Booste ta saison », « Booste ton Bac » avec Phiby, un chien médiateur, et « Booste ta confiance » (stage du 16 au 22 août 2026 aux Vans, en Ardèche). Des ateliers seront prochainement proposés au local.</p></article>
    <article class="card rv"><img src="img/partenaires-correspondance.png" width="260" height="72" loading="lazy" alt="Logo de Correspondance, art et innovation sociale" style="margin-bottom:12px"><h3>Correspondance</h3><p>Créée en 2016 à Sarrians pour déployer l'art social : événements, ateliers de théâtre et d'arts plastiques, stages et trois formations (Orphée en art de la parole, Ishtar en arts plastiques, eurythmie). Ateliers théâtre-ado à Sarrians.</p><p><a href="mailto:marieluce@correspondance.xyz">marieluce@correspondance.xyz</a></p></article>
    <article class="card rv"><img src="img/partenaires-arthisseo.png" width="260" height="66" loading="lazy" alt="Logo du collectif ArtHisséo" style="margin-bottom:12px"><h3>Collectif ArtHisséo</h3><p>Un collectif d'artistes qui crée des stages, des ateliers et des spectacles pour adultes, enfants et adolescents, à Avignon et alentours : des explorations artistiques et sociales pour faire émerger de nouvelles façons d'être à soi et au monde.</p>{ext('https://arthisseo.org/', 'arthisseo.org', 'btn ghost sm')}</article>
    <article class="card rv"><img src="img/partenaires-label-cites-dor.png" width="96" height="96" loading="lazy" alt="Logo de l'association Label des Cités d'Or" style="margin-bottom:12px"><h3>Label des Cités d'Or</h3><p>Projets artistiques, culturels et éducatifs qui favorisent l'expression, le bien-être et le lien social, par le théâtre, l'audiovisuel, le coaching, les ateliers créatifs et la médiation culturelle, auprès de publics variés.</p></article>
  </div></div>
</section>
<section class="sec" aria-labelledby="h-pub">
  <div class="wrap grid g2" style="gap:40px;align-items:center">
    <div class="rv"><span class="eyebrow">Institutions</span><h2 id="h-pub">Soutiens publics et financeurs</h2>
      <p>La scène ouverte extérieure de juillet 2026 s'est déroulée dans le cadre du programme « Rencontres artistes publics hors les murs » de la Ville d'Avignon.</p>
      <p class="tbc">Liste des financeurs et subventions (Ville, Département, Région, fondations, mécènes) à renseigner par l'association.</p></div>
    <div class="logo-box rv" style="min-height:170px"><img src="img/partenaires-avignon.png" width="260" height="74" loading="lazy" alt="Avignon, Ville d'exception"><span>Programme « Rencontres artistes publics hors les murs »</span></div>
  </div>
</section>
<section class="sec sun" aria-labelledby="h-sout">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Un coup de pouce ?</span><h2 id="h-sout" style="color:var(--brick-d)">Soutenir Aux Arts !</h2><p class="lead" style="color:var(--ink)">Adhérer, devenir mécène ponctuel ou mensuel, prêter vos talents : chaque geste fait vivre le lieu.</p></div>
    <div class="grid g3">
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">🎟</span><h3>Adhérer</h3><p>En ligne sur HelloAsso (à partir de 5 €) ou sur place au 3 place Louis Pasteur. L'adhésion donne accès aux activités et à l'assemblée générale.</p>{ext(HA_ADH, "J'adhère en ligne", 'btn sm')}</article>
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">💛</span><h3>Devenir mécène</h3><p>Soutien ponctuel ou mensuel à l'association, via le formulaire HelloAsso.</p>{ext(HA_MECENE, 'Je soutiens', 'btn sm')}</article>
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">🤝</span><h3>Devenir partenaire</h3><p>Entreprise, commerce, structure culturelle : parlons d'un partenariat adapté.</p><a class="btn sm" href="nous-rejoindre.html#contact">Nous contacter</a></article>
    </div>
  </div>
</section>
</main>
'''
    write(p, head(p, 'Partenaires', "Partenaires et soutiens d'Aux Arts ! à Avignon : Théâtre du 11, associations du lieu (Booste, Correspondance, ArtHisséo, Label des Cités d'Or) et façons de soutenir l'association.", 'img/partenaires-theatre-du-11.png') + header(p) + body + footer())


def build_contact():
    p = 'nous-rejoindre.html'
    opts = ''.join(f'<option value="{a["id"]}">{E(a["t"])} — {E(a["who"])}</option>' for a in A)
    body = page_hero('Nous rejoindre', 'Nous rejoindre & contact', "Adhérer, s'inscrire à un atelier, devenir bénévole, proposer un projet ou simplement nous écrire : toutes les portes sont ouvertes.", 'img/place-pasteur.jpg') + f'''<main id="contenu">
<section class="sec" aria-labelledby="h-adh">
  <div class="wrap">
    <div class="sec-head rv"><span class="eyebrow">Étape 1</span><h2 id="h-adh">Adhérer à l'association</h2><p class="lead">L'adhésion annuelle est nécessaire pour participer aux ateliers et donne accès aux événements, vernissages et à l'assemblée générale de janvier 2027.</p></div>
    <div class="grid g3">
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">💻</span><h3>En ligne</h3><p>Paiement sécurisé géré par HelloAsso, hors de ce site.</p>{ext(HA_ADH, "J'adhère sur HelloAsso", 'btn sm')}</article>
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">🏠</span><h3>Sur place</h3><p>3 place Louis Pasteur, du mardi au vendredi de 10 h à 17 h 30 environ, sur rendez-vous.</p><a class="btn ghost sm" href="tel:{TEL_HREF}">{TEL}</a></article>
      <article class="card rv"><span style="font-size:2rem" aria-hidden="true">💛</span><h3>Mécénat</h3><p>Devenir mécène ponctuel ou mensuel de l'association.</p>{ext(HA_MECENE, 'Je soutiens', 'btn ghost sm')}</article>
    </div>
    <p class="muted rv" style="margin-top:14px;font-size:.92rem">Montant : à partir de 5 € sur HelloAsso ; 10 € indiqué sur les affiches d'automne — à confirmer.</p>
  </div>
</section>

<section class="sec cream" id="inscription" aria-labelledby="h-ins">
  <div class="wrap grid g2" style="gap:44px;align-items:start">
    <div class="rv"><span class="eyebrow">Étape 2</span><h2 id="h-ins">S'inscrire à un atelier</h2>
      <p class="lead">Dites-nous quel atelier vous intéresse : l'intervenant·e ou la coordinatrice vous répond pour confirmer votre place.</p>
      <p>Les inscriptions se font par mail auprès de chaque intervenant·e (coordonnées sur chaque fiche). Ce formulaire est une facilité pour nous joindre ; aucun paiement n'est géré sur le site.</p></div>
    <div class="panel rv">
      <form name="inscription-atelier" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="inscription-atelier">
        <p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="row2"><div><label for="f-nom">Nom et prénom *</label><input id="f-nom" name="nom" required autocomplete="name"></div>
        <div><label for="f-mail">E-mail *</label><input id="f-mail" type="email" name="email" required autocomplete="email"></div></div>
        <div class="row2"><div><label for="f-tel">Téléphone</label><input id="f-tel" type="tel" name="telephone" autocomplete="tel"></div>
        <div><label for="f-atelier">Atelier *</label><select id="f-atelier" name="atelier" required><option value="">Choisir…</option>{opts}<option value="autre">Autre / je ne sais pas encore</option></select></div></div>
        <div><label for="f-msg">Message</label><textarea id="f-msg" name="message" placeholder="Votre niveau, vos questions, vos disponibilités…"></textarea></div>
        <label class="check"><input type="checkbox" name="adhesion" value="oui"> <span>Je suis déjà adhérent·e (ou je vais adhérer avant l'atelier).</span></label>
        <label class="check"><input type="checkbox" name="rgpd" value="oui" required> <span>J'accepte que mes données servent à répondre à ma demande (voir les mentions légales). *</span></label>
        <button class="btn" type="submit">Envoyer ma demande</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>

<section class="sec" aria-labelledby="h-ben">
  <div class="wrap grid g2" style="gap:30px">
    <div class="card rv"><span style="font-size:2rem" aria-hidden="true">🙌</span><h3 id="h-ben">Devenir bénévole</h3>
      <p>Accueil du public, montage d'expositions, buvette, communication… le lieu vit grâce à celles et ceux qui donnent un coup de main.</p>
      <p class="tbc">Missions de bénévolat et disponibilités attendues à préciser par l'association.</p>
      <p><strong>Un besoin déjà exprimé :</strong> le site est en construction et cherche une personne pour le faire vivre — « webmaster-euse : le projet vous plaît, bienvenue ! »</p></div>
    <div class="card rv"><span style="font-size:2rem" aria-hidden="true">🎤</span><h3>Proposer un projet</h3>
      <p>Exposition, concert, stage, atelier, cours, spectacle : l'agenda 2027 est en construction. Écrivez-nous en précisant l'objet de votre demande (« PROG TH11 » pour une programmation au Théâtre du 11).</p></div>
  </div>
</section>

<section class="sec cream" id="contact" aria-labelledby="h-ct">
  <div class="wrap grid g2" style="gap:44px;align-items:start">
    <div class="rv"><span class="eyebrow">Une question ?</span><h2 id="h-ct">Nous contacter</h2>
      <ul class="contact-list">
        <li><span class="ci" aria-hidden="true">📍</span><div><strong>3 place Louis Pasteur</strong><br>84000 Avignon (Vaucluse)</div></li>
        <li><span class="ci" aria-hidden="true">📞</span><div><a href="tel:{TEL_HREF}">{TEL}</a><br><span class="muted">Stéphanie Berger, coordinatrice du projet</span></div></li>
        <li><span class="ci" aria-hidden="true">✉️</span><div><a href="mailto:{MAIL}">{MAIL}</a></div></li>
        <li><span class="ci" aria-hidden="true">🕒</span><div>Sur place du mardi au vendredi,<br>10 h – 17 h 30 environ, sur rendez-vous</div></li>
        <li><span class="ci" aria-hidden="true">📱</span><div>{ext(INSTA, 'Instagram')} · {ext(FB, 'Facebook')}</div></li>
      </ul>
      <div class="mapbox" style="margin-top:26px"><img src="img/plan.webp" width="492" height="398" loading="lazy" alt="Plan : le local d'Aux Arts ! rue Louis Pasteur à Avignon, repéré par une couronne"></div>
      <p style="margin-top:12px">{ext('https://www.google.com/maps/search/?api=1&query=3+place+Louis+Pasteur+84000+Avignon', "Ouvrir l'itinéraire dans Google Maps", 'btn ghost sm')}</p>
    </div>
    <div class="panel rv">
      <h3>Écrivez-nous</h3>
      <form name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact">
        <p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="row2"><div><label for="c-nom">Nom *</label><input id="c-nom" name="nom" required autocomplete="name"></div>
        <div><label for="c-mail">E-mail *</label><input id="c-mail" type="email" name="email" required autocomplete="email"></div></div>
        <div><label for="c-sujet">Sujet *</label><select id="c-sujet" name="sujet" required><option value="">Choisir…</option><option>Renseignements généraux</option><option>Devenir bénévole</option><option>Proposer une exposition, un concert ou un spectacle</option><option>Animer un atelier ou un stage</option><option>Soutien administratif</option><option>Partenariat / mécénat</option><option>Autre</option></select></div>
        <div><label for="c-msg">Message *</label><textarea id="c-msg" name="message" required></textarea></div>
        <label class="check"><input type="checkbox" name="rgpd" value="oui" required> <span>J'accepte que mes données servent à répondre à ma demande (voir les mentions légales). *</span></label>
        <button class="btn" type="submit">Envoyer</button>
        <p class="form-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>
</main>
'''
    write(p, head(p, 'Nous rejoindre & contact', "Rejoindre Aux Arts ! à Avignon : adhésion, inscription aux ateliers, bénévolat, contact. 3 place Louis Pasteur, 84000 Avignon · 06 83 20 26 60.", 'img/place-pasteur.jpg') + header(p) + body + footer())


def build_mentions():
    p = 'mentions-legales.html'
    body = page_hero('Mentions légales', 'Mentions légales', "Informations légales, hébergement, données personnelles et crédits de ce site.", 'img/place-pasteur.jpg') + f'''<main id="contenu">
<section class="sec">
  <div class="wrap prose">
    <p class="tbc" style="margin-bottom:2em">Maquette de présentation : les mentions ci-dessous sont à compléter et à valider avant toute mise en ligne définitive.</p>
    <h2>Éditeur du site</h2>
    <p>Association Aux Arts ! (projet « Aux Arts ! en Avignon »)<br>3 place Louis Pasteur, 84000 Avignon<br>Téléphone : <a href="tel:{TEL_HREF}">{TEL}</a><br>E-mail : <a href="mailto:{MAIL}">{MAIL}</a></p>
    <p class="tbc">Forme juridique, numéro RNA / SIREN, nom du ou de la responsable de la publication.</p>
    <h2>Coordination du projet</h2>
    <p>Stéphanie Berger, coordinatrice du projet Aux Arts !.</p>
    <h2>Hébergement</h2>
    <p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis. <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">netlify.com</a></p>
    <h2>Conception de la maquette</h2>
    <p>Maquette réalisée par AssoVisible, à partir du contenu du site auxartsavignon.fr.</p>
    <h2>Données personnelles</h2>
    <p>Les formulaires de contact et d'inscription collectent les informations que vous saisissez (nom, e-mail, téléphone, message) pour répondre à votre demande. Elles sont traitées via le service Netlify Forms, conservées le temps nécessaire au traitement de la demande, et ne sont ni vendues ni cédées. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:{MAIL}">{MAIL}</a>.</p>
    <p>Les adhésions, billetteries et dons sont gérés par HelloAsso, sur son propre site et selon ses propres conditions : aucun paiement n'est traité ici.</p>
    <h2>Cookies et mesure d'audience</h2>
    <p>Ce site n'utilise pas de cookies de suivi. Les polices sont chargées depuis Google Fonts.</p>
    <h2>Propriété intellectuelle et crédits</h2>
    <p>Logo, affiches et textes : association Aux Arts !. Les œuvres présentées (photographies de danse, peintures) restent la propriété de leurs auteur·rices ; la reproduction est interdite sans leur accord. Les portraits des intervenant·es proviennent des affiches publiées par l'association.</p>
    <p class="tbc">Crédits photographiques détaillés à renseigner (photographes, droits à l'image des intervenant·es).</p>
    <h2>Liens externes</h2>
    <p>L'association n'est pas responsable du contenu des sites vers lesquels ce site renvoie (HelloAsso, réseaux sociaux, sites des artistes).</p>
  </div>
</section>
</main>
'''
    write(p, head(p, 'Mentions légales', "Mentions légales du site d'Aux Arts ! à Avignon : éditeur, hébergement, données personnelles et crédits.", 'img/logo.png') + header(p) + body + footer())


def build_misc():
    p = 'merci.html'
    body = page_hero('Merci', 'Merci !', "Votre message est bien parti. Nous vous répondons rapidement.", 'img/place-pasteur.jpg') + '''<main id="contenu"><section class="sec"><div class="wrap" style="text-align:center"><p class="lead" style="margin-inline:auto">En attendant, découvrez l'agenda ou les ateliers.</p><p class="cta-row" style="justify-content:center"><a class="btn" href="agenda.html">Voir l'agenda</a><a class="btn ghost" href="index.html">Retour à l'accueil</a></p></div></section></main>
'''
    write(p, head(p, 'Merci', "Confirmation d'envoi de votre message à Aux Arts ! Avignon.", 'img/logo.png').replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">') + header(p) + body + footer())
    p = '404.html'
    body = page_hero('Page introuvable', 'Oups, rideau !', "Cette page n'existe pas (ou plus). Retournons sur scène.", 'img/place-pasteur.jpg') + '''<main id="contenu"><section class="sec"><div class="wrap" style="text-align:center"><p class="cta-row" style="justify-content:center"><a class="btn" href="index.html">Retour à l'accueil</a><a class="btn ghost" href="agenda.html">Voir l'agenda</a></p></div></section></main>
'''
    write(p, head(p, 'Page introuvable', "Page introuvable sur le site d'Aux Arts ! Avignon.", 'img/logo.png') + header(p) + body + footer())


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    build_index(); build_projet(); build_ateliers(); build_agenda(); build_intervenants(); build_galerie()
    build_actus(); build_partenaires(); build_contact(); build_mentions(); build_misc()
