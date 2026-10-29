#!/usr/bin/env python3
"""Génère les pages HTML (en-tête/pied communs) à partir de data/site.json.
Usage : python3 tools/build.py   (depuis le dossier lucioles/)"""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
S = json.loads((ROOT / "data/site.json").read_text(encoding="utf-8"))
e = html.escape
NAV = [("index.html", "Accueil"), ("association.html", "L'association"), ("projets.html", "Nos projets"),
       ("evenements.html", "Événements"), ("galerie.html", "Galerie"), ("contact.html", "Nous aider & contact")]
WAVE = '<svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path fill="%s" d="M0 30C240 70 480 0 720 25s480 40 720 0V60H0z"/></svg>'


def social(cls=""):
    out = []
    for key, label in (("facebook", "Facebook"), ("instagram", "Instagram")):
        u = S.get(key)
        out.append(f'<a href="{e(u)}" target="_blank" rel="noopener">{label}</a>' if u else f'<span title="Lien à venir">{label} (bientôt)</span>')
    return '<div class="social">' + "".join(out) + "</div>"


def don_btn(cls="btn btn-gold"):
    u = S.get("helloasso")
    if u:
        return f'<a class="{cls}" href="{e(u)}" target="_blank" rel="noopener">💛 Faire un don</a>'
    return f'<a class="{cls}" href="contact.html#don">💛 Faire un don</a>'


def page(fname, title, desc, hero, body, big=False):
    nav = "".join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == fname else ""}>{e(t)}</a></li>' for h, t in NAV)
    cls = "hero" if big else "hero hero-sm"
    hero_html = f'''<header class="{cls}"><span class="glow g1"></span><span class="glow g2"></span><span class="glow g3"></span>
<div class="hero-inner">{hero}</div>{WAVE % ("#fbf8ef")}</header>'''
    doc = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#12263d">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="assets/logo-lucioles.jpeg">
<link rel="icon" href="assets/logo-lucioles.jpeg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;700;800&display=swap">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<div class="fireflies" aria-hidden="true"></div>
<div class="site-header"><div class="wrap">
<a class="brand" href="index.html"><img src="assets/logo-lucioles.jpeg" alt="" width="44" height="44">Lucioles</a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="menu"><span></span></button>
<nav aria-label="Navigation principale"><ul class="nav" id="menu">{nav}</ul></nav>
</div></div>
<main id="contenu">
{hero_html}
{body}
</main>
<footer class="site-footer"><div class="wrap">
<div class="foot">
<div><h2>Association Lucioles</h2><p>Association loi 1901 fondée en 1998 à Aix-les-Bains, pour le quotidien des enfants malades hospitalisés.</p>{social()}</div>
<div><h2>Le site</h2><ul>{"".join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in NAV)}<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
<div><h2>Nous contacter</h2><ul><li>📍 {e(S["address"])}</li><li>📞 <a href="tel:{S["phone"].replace(" ", "")}">{e(S["phone"])}</a></li><li>✉️ <a href="mailto:{e(S["email"])}">{e(S["email"])}</a></li></ul></div>
</div>
<p class="copy">© <span id="y">{2026}</span> Association Lucioles · Site réalisé bénévolement avec ♥</p>
</div></footer>
<script src="js/app.js"></script>
</body></html>'''
    (ROOT / fname).write_text(doc, encoding="utf-8")


R = ' class="reveal"'

# ---------------- Accueil
page("index.html", "Association Lucioles – Des lumières pour les enfants hospitalisés",
     "Depuis 1998, l'association Lucioles d'Aix-les-Bains apporte du matériel ludique aux services de pédiatrie pour améliorer le quotidien des enfants malades.",
     f'''<img class="hero-logo" src="assets/logo-lucioles.jpeg" alt="Logo de l'association Lucioles : une luciole verte tenant une lanterne devant un cœur bleu" width="200" height="200">
<span class="eyebrow">Association loi 1901 · Aix-les-Bains</span>
<h1>Faire briller des <em>lumières</em> dans les yeux des enfants</h1>
<p class="lead">Depuis 1998, nous offrons jeux, livres et loisirs aux enfants hospitalisés, pour qu'ils puissent s'évader le temps d'un instant.</p>
<div class="btns">{don_btn()}<a class="btn btn-ghost" href="evenements.html">Voir nos événements</a></div>''',
     f'''
<section><div class="wrap"><div class="sec-head"{R}><span class="eyebrow" style="color:var(--blue)">Prochain rendez-vous</span><h2>On se retrouve bientôt ?</h2></div>
<div class="next reveal" id="next-event"><p>Chargement…</p></div></div></section>

<section class="alt"><div class="wrap"><div class="sec-head center reveal"><h2>Une petite lumière dans l'hôpital</h2>
<p>Lucioles fournit du matériel ludique aux services de pédiatrie et d'animation des hôpitaux, grâce à la générosité de celles et ceux qui participent à nos événements.</p></div>
<div class="grid g3">
<a class="card reveal" href="projets.html" style="text-decoration:none;color:inherit"><span class="ico">🏥</span><h3>Nos projets dans les hôpitaux</h3><p>Belley, Albertville, Chambéry, Annecy, Lyon… découvrez où brillent nos lucioles.</p></a>
<a class="card reveal" href="evenements.html" style="text-decoration:none;color:inherit"><span class="ico">💃</span><h3>Nos événements</h3><p>Repas dansants, tournois de foot, thés dansants : venez faire la fête pour la bonne cause.</p></a>
<a class="card reveal" href="association.html" style="text-decoration:none;color:inherit"><span class="ico">🪔</span><h3>Notre histoire</h3><p>Née en 1998 d'un élan de générosité, l'association n'a jamais cessé de grandir.</p></a>
</div></div></section>

<section class="dark"><div class="wrap"><div class="sec-head center reveal"><h2>Lucioles en quelques chiffres</h2></div>
<div class="stats reveal">
<div class="stat"><b data-years="1998">0</b><span>ans d'engagement</span></div>
<div class="stat"><b data-count="7">0</b><span>hôpitaux soutenus</span></div>
<div class="stat"><b data-count="4">0</b><span>formats d'événements</span></div>
</div></div></section>

<section><div class="wrap split"><div class="reveal"><h2>Et si vous deveniez une luciole ?</h2>
<p>Un don, une présence à nos animations, une fête organisée à notre profit : chaque geste compte et fait briller un sourire.</p>
<div class="btns left">{don_btn("btn btn-blue")}<a class="btn btn-ghost" style="color:var(--blue);border-color:var(--blue)" href="contact.html">Nous contacter</a></div></div>
<div class="photo-ph reveal"><img src="assets/logo-lucioles.jpeg" alt=""><small>Photo de l'association à ajouter</small></div></div></section>
''', big=True)

# ---------------- Association
page("association.html", "L'association – Lucioles",
     "Histoire, valeurs et équipe de l'association Lucioles, fondée en 1998 à Aix-les-Bains.",
     '<span class="eyebrow">Qui sommes-nous ?</span><h1>L\'association</h1><p class="lead">Une histoire de générosité, née en 1998.</p>',
     f'''
<section><div class="wrap split"><div class="reveal"><h2>Notre histoire</h2>
<div class="timeline">
<div class="t"><b>12 octobre 1998</b><p>Marie-Neige Machuel fonde l'association Lucioles, à 18 ans, pour poursuivre ses actions de collecte de jouets neufs pour enfants hospitalisés.</p></div>
<div class="t"><b>Au fil des années</b><p>Une équipe de bénévoles se constitue, des événements festifs voient le jour et les hôpitaux soutenus se multiplient en Savoie, Haute-Savoie, dans l'Ain et à Lyon.</p></div>
<div class="t"><b>Aujourd'hui</b><p>L'association poursuit sa mission : améliorer le quotidien des enfants gravement malades hospitalisés.</p></div></div></div>
<div class="photo-ph reveal"><img src="assets/logo-lucioles.jpeg" alt="Logo Lucioles"><small>Photo à ajouter</small></div></div></section>

<section class="alt"><div class="wrap"><div class="sec-head center reveal"><h2>Notre mission</h2>
<p>Apporter du matériel ludique aux services de pédiatrie et d'animation des hôpitaux, pour que chaque enfant puisse s'évader de sa chambre le temps d'un jeu.</p></div>
<div class="grid g3">
<div class="card reveal"><span class="ico">✨</span><h3>Lumière</h3><p>Faire briller des lumières dans les yeux des enfants.</p></div>
<div class="card reveal"><span class="ico">🤝</span><h3>Solidarité</h3><p>Une chaîne de bénévoles, de donateurs et de partenaires.</p></div>
<div class="card reveal"><span class="ico">🎈</span><h3>Joie</h3><p>Des événements conviviaux pour financer nos actions.</p></div></div></div></section>

<section class="dark"><div class="wrap"><p class="quote reveal">Pourquoi « Lucioles » ? Parce qu'une petite lumière suffit à <em>éclairer la nuit</em> : comme un jeu, un livre ou un sourire dans une chambre d'hôpital.</p></div></section>

<section><div class="wrap"><div class="sec-head reveal"><h2>Le bureau et l'équipe</h2></div>
<div class="notice reveal">Composition du bureau et de l'équipe de bénévoles : <strong>texte d'attente à compléter par l'association</strong> (noms, rôles, photos).</div></div></section>
''')

# ---------------- Projets
page("projets.html", "Nos projets dans les hôpitaux – Lucioles",
     "Les hôpitaux et services de pédiatrie soutenus par l'association Lucioles : Belley, Albertville, Chambéry, Annecy, Lyon.",
     '<span class="eyebrow">Nos actions</span><h1>Projets dans les hôpitaux</h1><p class="lead">Là où nos lucioles s\'allument.</p>',
     '''
<section><div class="wrap"><div class="sec-head reveal"><h2>Ce que nous offrons</h2><p>Le matériel est choisi selon les besoins exprimés par les équipes soignantes et d'animation, et selon les fonds récoltés.</p></div>
<div class="grid g2" id="materials"></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head reveal"><h2>Les hôpitaux soutenus</h2><p>Liste susceptible d'évoluer : l'association peut la modifier dans <code>data/projects.json</code>.</p></div>
<div class="grid g3" id="hospitals"></div></div></section>
<section><div class="wrap"><div class="notice reveal">Jours, horaires et détails des interventions : <strong>texte d'attente à compléter par l'association</strong> (un texte plus long est en préparation).</div></div></section>
''')

# ---------------- Evenements
page("evenements.html", "Agenda & événements – Lucioles",
     "Prochains rendez-vous et archives des événements de l'association Lucioles : repas dansants, tournois de foot, thés dansants.",
     '<span class="eyebrow">Agenda</span><h1>Événements</h1><p class="lead">Venez faire la fête pour la bonne cause.</p>',
     '''
<section><div class="wrap"><div class="sec-head reveal"><h2>Prochains rendez-vous</h2></div><div class="grid g2" id="events-upcoming"></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head reveal"><h2>Nos formats d'événements</h2></div><div class="grid g3" id="formats"></div></div></section>
<section><div class="wrap"><div class="sec-head reveal"><h2>Archives</h2></div><div class="grid g2" id="events-archive"></div></div></section>
''')

# ---------------- Galerie
page("galerie.html", "Galerie photos – Lucioles",
     "Photos des événements, des actions dans les hôpitaux et des bénévoles de l'association Lucioles.",
     '<span class="eyebrow">En images</span><h1>Galerie</h1><p class="lead">Des sourires, des lumières, des souvenirs.</p>',
     '''
<section><div class="wrap"><div class="chips" id="chips" role="group" aria-label="Filtrer par album"></div><div class="gal" id="gallery"></div></div></section>
<div class="lightbox" id="lightbox" role="dialog" aria-label="Photo agrandie"><button aria-label="Fermer">✕</button><img alt=""></div>
''')

# ---------------- Contact
page("contact.html", "Nous aider & contact – Lucioles",
     "Faire un don, participer ou organiser une fête au profit de l'association Lucioles. Contactez-nous.",
     '<span class="eyebrow">Rejoignez la lumière</span><h1>Nous aider &amp; contact</h1><p class="lead">Un geste, une idée, une fête : tout compte.</p>',
     f'''
<section><div class="wrap"><div class="sec-head reveal" id="don"><h2>Comment nous aider ?</h2></div>
<div class="grid g3">
<div class="card reveal"><span class="ico">💛</span><h3>Faire un don</h3><p>Chaque euro devient un jeu, un livre ou un sourire. Le lien de don en ligne HelloAsso arrive prochainement.</p><br>{don_btn("btn btn-blue")}</div>
<div class="card reveal"><span class="ico">🎉</span><h3>Participer à nos animations</h3><p>Repas dansants, tournois de foot, thés dansants : consultez l'agenda.</p><br><a class="btn btn-blue" href="evenements.html">Voir l'agenda</a></div>
<div class="card reveal"><span class="ico">🎈</span><h3>Organiser une festivité</h3><p>Vous voulez organiser un événement au bénéfice de Lucioles ? Écrivez-nous !</p></div></div>
<div class="notice reveal" style="margin-top:24px">Adhésion et bénévolat : <strong>texte d'attente à compléter par l'association</strong>.</div></div></section>

<section class="alt"><div class="wrap split"><div class="reveal"><h2>Écrivez-nous</h2>
<form id="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Ne pas remplir <input name="bot-field"></label></p>
<div><label for="n">Nom</label><input id="n" name="nom" required autocomplete="name"></div>
<div><label for="m">E-mail</label><input id="m" name="email" type="email" required autocomplete="email"></div>
<div><label for="o">Objet</label><input id="o" name="objet" required></div>
<div><label for="t">Message</label><textarea id="t" name="message" required></textarea></div>
<button class="btn btn-blue" type="submit">Envoyer le message</button><p id="form-status" role="status" aria-live="polite"></p></form></div>
<div class="reveal"><h2>Coordonnées</h2><ul class="info">
<li>📍 <span>{e(S["address"])}</span></li><li>📞 <a href="tel:{S["phone"].replace(" ", "")}">{e(S["phone"])}</a></li><li>✉️ <a href="mailto:{e(S["email"])}">{e(S["email"])}</a></li></ul>
{social()}<br><p class="notice">{e(S["contactNote"])}</p>
<iframe title="Plan : Aix-les-Bains" loading="lazy" style="width:100%;height:260px;border:0;border-radius:24px;margin-top:16px" src="https://www.openstreetmap.org/export/embed.html?bbox=5.89%2C45.68%2C5.94%2C45.71&amp;layer=mapnik"></iframe></div></div></section>
''')

# ---------------- Mentions légales
page("mentions-legales.html", "Mentions légales – Lucioles",
     "Mentions légales du site de l'association Lucioles.",
     '<h1>Mentions légales</h1>',
     f'''<section><div class="wrap legal" style="max-width:780px">
<h2>Éditeur du site</h2><p>Association Lucioles, association loi 1901 déclarée à la préfecture de la Savoie (création déclarée le 17/09/1998, publiée au Journal officiel le 10/10/1998).<br>Siège : {e(S["address"])}.<br>Contact : {e(S["email"])} – {e(S["phone"])}.</p>
<h2>Direction de la publication</h2><p><em>À compléter par l'association.</em></p>
<h2>Conception du site</h2><p>Site réalisé bénévolement par l'équipe de l'association.</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2><p>Les informations saisies dans le formulaire de contact servent uniquement à répondre à votre message. Pour exercer vos droits (accès, rectification, suppression), écrivez à {e(S["email"])}.</p>
<h2>Crédits</h2><p>Logo : association Lucioles. Polices : Fredoka et Nunito (Google Fonts). Carte : © contributeurs OpenStreetMap.</p>
</div></section>''')
print("ok")
