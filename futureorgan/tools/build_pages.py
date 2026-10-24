#!/usr/bin/env python3
"""Génère les pages HTML du site (en-tête, pied de page et gabarit communs).
Les contenus listés (activités, agenda, actualités, partenaires, galerie, équipe, coordonnées)
vivent dans ../data/*.json et sont affichés par assets/js/main.js.
Usage : python3 tools/build_pages.py   (depuis le dossier futureorgan/)"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
site = json.loads((ROOT / 'data/site.json').read_text(encoding='utf-8'))
e = html.escape
BASE = 'https://futureorgan.netlify.app'  # remplacé par le domaine définitif si besoin

NAV = [('index.html', 'Accueil'), ('association.html', "L'association"), ('activites.html', 'Activités'),
       ('agenda.html', 'Agenda'), ('galerie.html', 'Galerie'), ('actualites.html', 'Actualités'),
       ('partenaires.html', 'Partenaires'), ('contact.html', 'Nous rejoindre')]

def header(cur):
    items = ''.join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == cur else ""}>{e(t)}</a></li>' for h, t in NAV)
    return f'''<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap nav">
<a class="brand" href="index.html" aria-label="Future Organ, accueil"><span class="brand-mark" aria-hidden="true">F</span><span class="brand-name">Future Organ<span class="brand-sub">AMIS DE L'ORGUE DE RIANS</span></span></a>
<nav aria-label="Navigation principale"><ul class="menu" id="menu">{items}</ul></nav>
<button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span></button>
</div></header>'''

def footer():
    c = site['contacts'][0]
    soc = ''.join(f'<li><a href="{e(s["url"])}" target="_blank" rel="noopener">{e(s["label"])}</a></li>' for s in site['social'])
    links = ''.join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in NAV)
    return f'''<footer class="site-footer"><div class="wrap">
<div class="footer-grid">
<div><h2>Future Organ</h2><p>{e(site["tagline"])}.<br>Un grand orgue, des récitals ouverts à tous, des mariages en musique.</p></div>
<div><h2>Le site</h2><ul>{links}</ul></div>
<div><h2>Contact</h2><ul>
<li>{e(site["city"])}</li>
<li><a href="tel:{site["main_phone"].replace(" ", "")}">{e(site["main_phone"])}</a></li>
<li><a href="mailto:{e(site["main_email"])}">{e(site["main_email"])}</a></li></ul></div>
<div><h2>Suivez-nous</h2><ul>{soc}<li><a href="contact.html">Formulaire de contact</a></li></ul></div>
</div>
<div class="copy"><span>© <span id="y">2026</span> Future Organ — Amis de l'orgue de Rians</span><a href="mentions-legales.html">Mentions légales</a></div>
</div></footer>
<script>document.getElementById('y').textContent=new Date().getFullYear()</script>
<script src="assets/js/main.js" defer></script>'''

def page(fname, title, desc, body, head_img=None, h1=None, lead=None, eyebrow=None, hero=None, og='assets/img/orgue-rians-motzkeit.jpg', extra_head=''):
    banner = ''
    if head_img:
        banner = f'''<section class="page-head"><div class="page-head-bg" style="background-image:url({head_img})" role="img" aria-label=""></div>
<div class="wrap"><span class="eyebrow">{e(eyebrow or '')}</span><h1>{h1}</h1><p>{e(lead or '')}</p></div></section>'''
    out = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#14163a">
<link rel="canonical" href="{BASE}/{'' if fname == 'index.html' else fname}">
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{BASE}/{og}">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/Fraunces.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/style.css">
{extra_head}
</head>
<body>
{header(fname)}
<main id="main">
{hero or banner}
{body}
</main>
{footer()}
</body>
</html>
'''
    (ROOT / fname).write_text(out, encoding='utf-8')
    print('écrit', fname)

TEL = lambda n: n.replace(' ', '')

# ---------------------------------------------------------------- ACCUEIL
hero = '''<section class="hero"><div class="hero-bg" style="background-image:url(assets/img/orgue-rians-2008.webp)" role="img" aria-label="Le grand orgue de Rians sous la rosace de l'église"></div>
<div class="wrap"><span class="eyebrow">Future Organ · Rians, Var</span>
<h1>Quand l'orgue ouvre <em>l'avenir</em></h1>
<p class="lead">Un grand orgue conçu et construit par un passionné, des récitals chaque dimanche, des mariages en musique et une technologie née à Rians.</p>
<div class="hero-actions"><a class="btn btn-gold" href="agenda.html">Venir un dimanche</a><a class="btn btn-ghost" href="contact.html#mariage">Réserver un mariage</a></div></div>
<span class="scroll-hint" aria-hidden="true"></span></section>'''
home = '''
<section class="next"><div class="wrap" data-render="next-event"></div></section>

<section class="section"><div class="wrap split">
<div class="reveal"><span class="eyebrow">L'association</span><h2>Un orgue construit à la main, offert à tous</h2>
<p class="lead">De 2004 à 2011, Pascal Leray a conçu, construit et financé seul le grand orgue de l'église de Rians, sans subvention.</p>
<p>Cinq claviers, plus d'un millier de tuyaux, une console mobile pour jouer depuis la nef : l'instrument réunit l'art de la facture d'orgue et l'électronique moderne. L'association des Amis de l'orgue le fait vivre, l'entretient et l'ouvre au public.</p>
<a class="btn btn-dark" href="association.html">Découvrir l'association</a></div>
<img class="reveal" data-d="1" src="assets/img/facade-2016.webp" alt="Façade du grand orgue de Rians, tourelles dorées sous la rosace" width="1200" height="693" loading="lazy">
</div></section>

<section class="section paper"><div class="wrap">
<span class="eyebrow">Ce que nous faisons</span><h2>Des musiques, des visites, des orgues à construire</h2>
<div class="grid c3" data-render="activities" data-mode="home" style="margin-top:2rem"></div>
<p style="margin-top:2rem"><a class="btn btn-line" href="activites.html">Toutes les activités</a></p>
</div></section>

<section class="section dark"><div class="wrap">
<span class="eyebrow">En chiffres</span><h2>L'orgue de Rians</h2>
<div class="counters" data-render="counters" style="margin-top:2rem"></div>
</div></section>

<section class="band" style="background-image:url(assets/img/mariage-rians.webp)"><div class="wrap reveal">
<h2>Votre mariage, en orgue et en voix</h2>
<p>Anne-Marie, soprano, et Pascal, à l'orgue, animent votre cérémonie à Rians ou dans toute la France. Vos dons financent l'orgue et sont déductibles à 66 %.</p>
<a class="btn btn-gold" href="contact.html#mariage" style="margin-top:1rem">Préparer ma cérémonie</a></div></section>

<section class="section"><div class="wrap">
<span class="eyebrow">Dernières nouvelles</span><h2>Actualités</h2>
<div class="grid c3" data-render="news" data-limit="3" style="margin-top:2rem"></div>
<p style="margin-top:2rem"><a class="btn btn-line" href="actualites.html">Toutes les actualités</a></p>
</div></section>

<section class="section dark"><div class="wrap split">
<div class="reveal"><span class="eyebrow">Nous rejoindre</span><h2>Faites vibrer l'orgue avec nous</h2>
<p class="lead">Adhérent, bénévole, mécène ou simple auditeur : il y a une place pour vous.</p>
<a class="btn btn-gold" href="contact.html">Nous rejoindre ou soutenir</a></div>
<img class="reveal" data-d="1" src="assets/img/claviers-eustache.webp" alt="Anciens claviers d'orgue équipés de cartes électroniques" width="1024" height="768" loading="lazy">
</div></section>'''
page('index.html', 'Future Organ — Amis de l\'orgue de Rians (Var)',
     "Grand orgue de Rians, récitals chaque dimanche, mariages avec orgue et soprano dans toute la France, cartes électroniques pour orgues.", home, hero=hero)

# ---------------------------------------------------------------- ASSOCIATION
assoc = '''
<section class="section"><div class="wrap split">
<div class="reveal"><span class="eyebrow">Présentation</span><h2>Une passion devenue instrument</h2>
<p class="lead">Future Organ est l'association des Amis de l'orgue de Rians : elle fait vivre un grand orgue construit bénévolement et soutient la facture d'orgues d'aujourd'hui.</p>
<p>Le grand orgue de l'église de Rians est né de la passion d'un organiste ingénieur, Pascal Leray, soutenu par son épouse Anne-Marie. Conçu, construit et financé sans subvention, c'est un orgue neuf, expressif, qui marie tuyaux réels et électronique.</p>
<p>L'association reçoit des dons (notamment ceux des mariés) pour construire, étendre et entretenir cet orgue, et pour aider à rénover ou construire d'autres orgues, dans des églises comme chez des particuliers.</p>
<p class="notice">Date de création, numéro RNA et siège social : <strong>à compléter</strong> (informations absentes de l'ancien site).</p></div>
<img class="reveal" data-d="1" src="assets/img/orgue-rians-motzkeit.webp" alt="Le grand orgue de Rians sous la rosace" width="1280" height="870" loading="lazy">
</div></section>

<section class="section paper"><div class="wrap">
<span class="eyebrow">Histoire</span><h2>Les grandes étapes</h2>
<ol class="timeline" style="margin-top:2rem;max-width:760px">
<li class="reveal"><b>À 19 ans</b><br>Pascal Leray construit seul son premier orgue à tuyaux, puis devient organiste liturgique en Bretagne, notamment à l'église Saint-Germain de Rennes.</li>
<li class="reveal"><b>2004</b><br>La grande tribune de l'église de Rians est vide. Le projet de grand orgue commence.</li>
<li class="reveal"><b>2008</b><br>L'instrument prend forme. Le projet est nominé au prix Chéreau-Lavet, qui récompense chaque année un inventeur français.</li>
<li class="reveal"><b>10 avril 2011</b><br>Mgr Rey, évêque de Fréjus-Toulon, bénit le grand orgue et remet à Pascal Leray l'Ordre du Mérite diocésain. <span class="verify" title="Une page de l'ancien site indique 2014">date à vérifier</span></li>
<li class="reveal"><b>2020</b><br>Extension de l'orgue et de sa console mobile.</li>
<li class="reveal"><b>Aujourd'hui</b><br>Récitals chaque dimanche, mariages dans toute la France et cartes électroniques pour d'autres orgues.</li>
</ol></div></section>

<section class="section"><div class="wrap">
<span class="eyebrow">Nos missions</span><h2>Ce qui nous guide</h2>
<div class="grid c3" style="margin-top:2rem">
<article class="card reveal"><div class="card-body"><div class="icon-badge" aria-hidden="true">♪</div><h3>Faire vivre l'orgue</h3><p>Entretenir et étendre le grand orgue de Rians pour qu'il serve les cérémonies et les concerts.</p></div></article>
<article class="card reveal" data-d="1"><div class="card-body"><div class="icon-badge" aria-hidden="true">☼</div><h3>L'ouvrir à tous</h3><p>Récitals et visites gratuits chaque dimanche, conférences, démonstrations.</p></div></article>
<article class="card reveal" data-d="2"><div class="card-body"><div class="icon-badge" aria-hidden="true">⚙</div><h3>Construire d'autres orgues</h3><p>Partager une technologie économique pour bâtir ou rénover des orgues, y compris transportables.</p></div></article>
</div></div></section>

<section class="section dark"><div class="wrap">
<span class="eyebrow">Valeurs</span><h2>Bénévolat, transmission, liberté</h2>
<div class="cols-2" style="margin-top:2rem"><ul class="list-clean tick reveal">
<li><strong>Démarche non commerciale.</strong> Aucun lien avec une marque ou une société.</li>
<li><strong>Bénévolat.</strong> L'orgue est construit et joué sans subvention.</li></ul>
<ul class="list-clean tick reveal" data-d="1">
<li><strong>Transmission.</strong> Les plans et les techniques sont partagés avec les organistes amateurs.</li>
<li><strong>Liberté des mariés.</strong> Ils ont le droit de choisir leurs musiciens, conformément à la charte des organistes liturgiques.</li></ul></div>
</div></section>

<section class="section"><div class="wrap">
<span class="eyebrow">Bureau et équipe</span><h2>Les visages de Future Organ</h2>
<div class="grid c3" data-render="team" style="margin-top:2rem"></div>
</div></section>'''
page('association.html', "L'association — Future Organ", "Présentation, histoire, missions et équipe de Future Organ, l'association des Amis de l'orgue de Rians (Var).",
     assoc, head_img='assets/img/orgue-rians-motzkeit.webp', h1="L'association", eyebrow='Qui sommes-nous',
     lead="Des passionnés, un grand orgue construit à Rians et l'envie de le partager.")

# ---------------------------------------------------------------- ACTIVITES
act = '''
<section class="section"><div class="wrap" data-render="activities" data-mode="full"></div></section>
<section class="section paper"><div class="wrap split">
<div class="reveal"><span class="eyebrow">Répertoire</span><h2>Toute la musique de votre cérémonie</h2>
<p class="lead">De la musique ancienne aux compositeurs contemporains, dans toutes les langues, selon vos souhaits.</p>
<ul class="list-clean tick"><li>Entrée : Aria de Bach, Canon de Pachelbel, Trumpet Voluntary de Clarke</li>
<li>Bouquet à la Vierge : Ave Maria de Schubert, Gounod, Caccini… (350 versions possibles)</li>
<li>Signature des registres : Cantate 147 de Bach</li>
<li>Sortie : Toccata de Widor, Marche nuptiale de Mendelssohn</li></ul></div>
<img class="reveal" data-d="1" src="assets/img/pontigny-2.webp" alt="Anne-Marie Leray chantant à l'abbaye de Pontigny" width="1024" height="810" loading="lazy">
</div></section>'''
page('activites.html', 'Activités — Future Organ', "Récitals du dimanche, mariages avec orgue et soprano, service liturgique, construction d'orgues et instruments transportables.",
     act, head_img='assets/img/claviers-eustache.webp', h1='Activités', eyebrow='Ce que nous proposons',
     lead="Récitals, mariages, liturgie, construction d'orgues : tout ce que fait l'association.")

# ---------------------------------------------------------------- AGENDA
agenda = '''
<section class="section"><div class="wrap cols-2">
<div><h2>Rendez-vous réguliers</h2><div id="rec"></div>
<h2 style="margin-top:2.5rem">Prochaines dates</h2><div id="up"></div></div>
<div><h2>Archives</h2><div id="past"></div></div>
</div><div data-render="agenda"></div></section>
<section class="section paper"><div class="wrap"><p class="notice" style="margin:0">Pour éviter un déplacement pour rien, merci de prévenir au préalable par mail ou SMS : <a href="contact.html">nous contacter</a>.</p></div></section>'''
page('agenda.html', 'Agenda & événements — Future Organ', "Récitals chaque dimanche de 15 h à 18 h à Rians, messe à l'orgue, rendez-vous exceptionnels et archives.",
     agenda, head_img='assets/img/facade-2016.webp', h1='Agenda & événements', eyebrow='Rendez-vous',
     lead="Chaque dimanche à Rians, et quelques temps forts dans l'année.")

# ---------------------------------------------------------------- GALERIE
gal = '''
<section class="section"><div class="wrap"><div class="filters" id="filters" role="group" aria-label="Filtrer les photos"></div>
<div class="gallery" data-render="gallery"></div></div>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button class="lb-btn" type="button" aria-label="Fermer">×</button><button class="lb-nav lb-prev" type="button" aria-label="Photo précédente">‹</button><img alt=""><p></p><button class="lb-nav lb-next" type="button" aria-label="Photo suivante">›</button></div>
</section>'''
page('galerie.html', 'Galerie photos — Future Organ', "Photos du grand orgue de Rians, de sa construction, de l'église, des mariages et des instruments.",
     gal, head_img='assets/img/rose.webp', h1='Galerie', eyebrow='En images',
     lead="L'orgue, l'église de Rians, les cérémonies et les coulisses de la construction.")

# ---------------------------------------------------------------- ACTUALITES
news = '''<section class="section"><div class="wrap"><div class="grid c3" data-render="news"></div>
<p class="notice" style="margin-top:2rem">Les actualités se modifient dans <code>data/news.json</code> : ajoutez un bloc en haut de la liste.</p></div></section>'''
page('actualites.html', 'Actualités — Future Organ', "Dernières nouvelles de l'orgue de Rians et de l'association Future Organ.",
     news, head_img='assets/img/orgue-744.webp', h1='Actualités', eyebrow='Dernières nouvelles',
     lead="La vie de l'orgue, de l'association et de ses musiciens.")

# ---------------------------------------------------------------- PARTENAIRES
part = '''
<section class="section"><div class="wrap"><h2>Partenaires et soutiens</h2><div class="grid c3" data-render="partners" style="margin-top:1.5rem"></div></div></section>
<section class="section paper"><div class="wrap cols-2">
<div class="reveal"><h2>Ils ont construit l'orgue</h2><ul class="list-clean tick" id="contrib"></ul></div>
<div class="reveal" data-d="1"><h2>Dans la presse</h2><ul class="list-clean" id="press"></ul></div>
</div></section>
<section class="section"><div class="wrap cols-2">
<div class="reveal"><h2>Organistes venus l'écouter</h2><ul class="list-clean" id="visitors"></ul><p class="meta">Liste reprise de l'ancien site, à confirmer.</p></div>
<div class="reveal" data-d="1"><span class="eyebrow">Soutenir</span><h2>Devenez partenaire de l'orgue</h2>
<p class="lead">Entreprise, commune, artisan ou particulier : votre soutien aide à entretenir l'orgue et à construire d'autres instruments.</p>
<p>Les dons à l'association ouvrent droit à une réduction d'impôt de 66 %.</p>
<a class="btn btn-dark" href="contact.html#don">Soutenir l'association</a></div>
</div></section>'''
page('partenaires.html', 'Partenaires & soutiens — Future Organ', "Partenaires, artisans, presse et soutiens de l'association Future Organ. Soutenir l'orgue de Rians.",
     part, head_img='assets/img/claviers-eustache.webp', h1='Partenaires', eyebrow='Soutiens',
     lead="Ceux qui ont construit, relayé et soutenu l'orgue de Rians.")

# ---------------------------------------------------------------- CONTACT
contacts = ''.join(
    f'''<div class="contact-card reveal"><h3>{e(c["name"])}</h3><p class="meta">{e(c["role"])}</p><p>{"<br>".join(f'<a href="tel:{TEL(p)}">{e(p)}</a>' for p in c["phones"])}<br>{"<br>".join(f'<a href="mailto:{e(m)}">{e(m)}</a>' for m in c["emails"])}</p></div>'''
    for c in site['contacts'])
contact = f'''
<section class="section" id="rejoindre"><div class="wrap cols-2">
<div class="reveal"><span class="eyebrow">Adhésion</span><h2>Adhérer à l'association</h2>
<p class="notice">Montant de la cotisation et bulletin d'adhésion : <strong>à compléter</strong> (non publiés sur l'ancien site). En attendant, écrivez-nous.</p></div>
<div class="reveal" data-d="1"><span class="eyebrow">Bénévolat</span><h2>Donner un coup de main</h2>
<p class="notice">Missions de bénévolat (accueil des visiteurs, entretien, communication…) : <strong>à compléter</strong> avec l'équipe. Dites-nous ce que vous savez faire.</p></div>
</div></section>

<section class="section paper" id="don"><div class="wrap"><span class="eyebrow">Dons</span><h2>Un don déductible à 66 %</h2>
<p class="lead">L'association reçoit des dons déductibles des impôts au titre des dons aux œuvres. Un reçu fiscal peut être établi.</p>
<div class="donation reveal"><div><b>300 €</b><small>vous reviennent à 102 €</small></div><div><b>400 €</b><small>vous reviennent à 136 €</small></div><div><b>500 €</b><small>vous reviennent à 170 €</small></div></div>
<p>Pour un mariage, l'association peut déposer le chèque plusieurs mois après la cérémonie. L'association est assurée comme membre sociétaire de la MAIF.</p></div></section>

<section class="section" id="mariage"><div class="wrap cols-2">
<div><span class="eyebrow">Contact</span><h2>Écrivez-nous</h2>
<p>Mariage, visite, don, question sur la construction d'un orgue : nous vous répondons rapidement. Nous nous déplaçons dans toute la France ; sans orgue dans votre église, nous apportons un orgue liturgique transportable.</p>
<form class="contact" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="two"><div class="field"><label for="nom">Nom *</label><input id="nom" name="nom" required autocomplete="name"></div>
<div class="field"><label for="email">E-mail *</label><input id="email" name="email" type="email" required autocomplete="email"></div></div>
<div class="two"><div class="field"><label for="tel">Téléphone</label><input id="tel" name="telephone" type="tel" autocomplete="tel"></div>
<div class="field"><label for="sujet">Sujet</label><select id="sujet" name="sujet"><option>Mariage</option><option>Visite ou récital</option><option>Adhésion</option><option>Bénévolat</option><option>Don ou partenariat</option><option>Construction d'un orgue</option><option>Autre</option></select></div></div>
<div class="field"><label for="lieu">Lieu et date (pour un mariage)</label><input id="lieu" name="lieu_date"></div>
<div class="field"><label for="msg">Message *</label><textarea id="msg" name="message" required></textarea></div>
<p class="meta">Vos données servent uniquement à vous répondre (voir les <a href="mentions-legales.html">mentions légales</a>).</p>
<button class="btn btn-dark" type="submit">Envoyer le message</button></form></div>
<div><span class="eyebrow">Coordonnées</span><h2>Nous trouver</h2>{contacts}
<p class="meta">{e(site["email_note"])}</p>
<div class="contact-card reveal"><h3>Église de Rians</h3><p class="meta">{e(site["city"])} · presbytère : <a href="tel:{TEL(site["presbytery_phone"])}">{e(site["presbytery_phone"])}</a> <span class="verify" title="Numéro repris de l'ancien site">à vérifier</span></p>
<p>Visites le dimanche à partir de 15 h, ou sur rendez-vous.</p></div>
<iframe class="map" title="Carte de Rians" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=5.7200%2C43.5980%2C5.7700%2C43.6260&amp;layer=mapnik"></iframe>
<p><a href="https://www.openstreetmap.org/search?query=%C3%89glise%20de%20Rians%2C%20Var" target="_blank" rel="noopener">Ouvrir la carte en grand</a></p></div>
</div></section>'''
page('contact.html', 'Nous rejoindre & contact — Future Organ', "Adhérer, devenir bénévole, faire un don ou réserver un mariage avec orgue et soprano : contactez Future Organ à Rians (Var).",
     contact, head_img='assets/img/eglise-voutes.webp', h1='Nous rejoindre & contact', eyebrow='Parlons-nous',
     lead="Adhésion, bénévolat, dons, mariages et visites : un seul formulaire.")

# ---------------------------------------------------------------- MERCI
page('merci.html', 'Message envoyé — Future Organ', 'Merci pour votre message.',
     '<section class="section"><div class="wrap" style="text-align:center;max-width:640px"><h2>Merci !</h2><p class="lead" style="margin-inline:auto">Votre message est bien parti. Nous vous répondons dès que possible.</p><a class="btn btn-dark" href="index.html">Retour à l\'accueil</a></div></section>',
     head_img='assets/img/orgue-744.webp', h1='Message envoyé', eyebrow='Merci', lead='')

# ---------------------------------------------------------------- MENTIONS
ml = '''<section class="section"><div class="wrap" style="max-width:780px">
<h2>Éditeur du site</h2>
<p>Future Organ — Association des Amis de l'orgue de Rians, association loi 1901.<br>
Siège social : <strong>à compléter</strong><br>N° RNA / SIRET : <strong>à compléter</strong><br>
Directeur de la publication : <strong>à confirmer</strong> (Pascal Leray, auteur de l'ancien site)<br>
Contact : <a href="mailto:futureorgan@protonmail.com">futureorgan@protonmail.com</a> · 06 87 46 55 85</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Conception</h2><p>Refonte du site existant (futureorgan.org et mariageeglise.org).</p>
<h2>Propriété intellectuelle</h2><p>Textes et photographies reprennent et reformulent le contenu des anciens sites de l'association. Toute reproduction sans accord est interdite. Les crédits photo (ex. M. Motzkeit, Gilles Perbal) sont <strong>à confirmer</strong>.</p>
<h2>Données personnelles</h2><p>Le formulaire de contact collecte les informations que vous saisissez (nom, e-mail, téléphone, message) pour répondre à votre demande, via le service Netlify Forms. Elles ne sont ni revendues ni utilisées pour du démarchage. Vous pouvez demander leur accès, rectification ou suppression à l'adresse ci-dessus.</p>
<h2>Cookies</h2><p>Ce site ne dépose aucun cookie de suivi et n'utilise aucun outil de mesure d'audience. Les polices sont hébergées sur le site. La carte de la page contact est fournie par OpenStreetMap lorsqu'elle s'affiche.</p>
</div></section>'''
page('mentions-legales.html', 'Mentions légales — Future Organ', "Mentions légales, hébergement et données personnelles du site Future Organ.",
     ml, head_img='assets/img/eglise-nef.webp', h1='Mentions légales', eyebrow='Informations légales', lead='')

# robots / sitemap
pages = [h for h, _ in NAV] + ['mentions-legales.html']
(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{BASE}/{"" if p == "index.html" else p}</loc></url>\n' for p in pages) + '</urlset>\n')
(ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n')
