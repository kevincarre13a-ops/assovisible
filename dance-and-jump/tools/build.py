#!/usr/bin/env python3
"""Génère les pages HTML du site (en-tête, menu et pied de page communs) dans ../site."""
import os
OUT = os.path.join(os.path.dirname(__file__), '..', 'site')
FB = "https://www.facebook.com/p/Association-Dance-and-Jump-100054577384773/"
MENU = [("index.html","Accueil"),("association.html","L'association"),("cours.html","Cours & activités"),
        ("planning-tarifs.html","Planning & tarifs"),("evenements.html","Événements"),("galerie.html","Galerie"),
        ("actualites.html","Actualités"),("contact.html","Nous rejoindre")]
WAVE = '<svg class="vague" viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46V20Q180 -10 360 18T720 20T1080 18T1440 20V46Z"/></svg>'

def page(fname, title, desc, body, hero=None, noindex=False):
    nav = "".join('<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == fname else "", t) for h, t in MENU)
    html = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{desc}">
{'<meta name="robots" content="noindex">' if noindex else ''}
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:type" content="website"><meta property="og:image" content="assets/img/affiche-reprise-2026.jpg">
<meta name="theme-color" content="#e5007d"><link rel="icon" href="assets/img/logo-carre.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Rubik:wght@900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css"></head><body>
<a class="skip" href="#main">Aller au contenu</a>
<header class="hdr"><div class="wrap"><a class="brand" href="index.html" aria-label="Dance &amp; Jump, accueil"><img src="assets/img/logo-carre.jpg" alt="" width="46" height="46"><span>Dance <b>&amp;</b> Jump</span></a>
<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i></i><i></i><i></i></button>
<nav class="nav" id="nav" aria-label="Navigation principale">{nav}</nav></div></header>
<main id="main">{body}</main>
<footer class="ftr"><div class="wrap"><div class="grid">
<div><h3>Dance &amp; Jump</h3><p>Danse et jumping fitness à Chaux (90330). Bougez, dansez, vibrez !</p></div>
<div><h3>Contact</h3><a href="tel:+33689048143">06 89 04 81 43</a><a href="mailto:laura.bulliard@hotmail.fr">laura.bulliard@hotmail.fr</a><a href="{FB}" target="_blank" rel="noopener">Facebook : Association Dance and Jump</a></div>
<div><h3>Le site</h3><a href="association.html">L'association</a><a href="cours.html">Cours &amp; activités</a><a href="planning-tarifs.html">Planning &amp; tarifs</a><a href="evenements.html">Événements</a></div>
<div><h3>Et aussi</h3><a href="galerie.html">Galerie</a><a href="actualites.html">Actualités</a><a href="contact.html">Nous rejoindre</a><a href="mentions-legales.html">Mentions légales</a></div>
</div><small>© 2026 Association Dance and Jump, Chaux (90330)</small></div></footer>
<div class="lb" role="dialog" aria-label="Image agrandie"><img alt=""></div>
<script src="assets/js/app.js" defer></script></body></html>'''
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(html)

def ph(h1, p, cls=""):
    return f'<section class="ph {cls}" style="padding-bottom:84px"><div class="wrap"><h1 class="rv">{h1}</h1><p class="rv">{p}</p></div></section>{WAVE}'

MARQ = "".join(f"<span>{w}</span>" for w in ["Danse","Jumping fitness","Bougez","Dansez","Vibrez","Fun","Cardio","Énergie","Plaisir"]*2)

# 1 Accueil
page("index.html","Dance & Jump — Danse et jumping fitness à Chaux (90)",
 "Association Dance and Jump à Chaux (90330) : cours de danse pour enfants, ados et adultes et jumping fitness sur mini-trampoline. Venez faire un cours d'essai !",
 f'''<section class="hero"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span><span class="blob b4"></span>
<div class="wrap"><div><h1><span>Bougez,</span><span class="o">dansez,</span><span class="v">vibrez !</span></h1>
<p class="lead">Danse et jumping fitness à Chaux : on se dépense dans une ambiance chaleureuse et conviviale.</p>
<div class="cta"><a class="btn" href="contact.html">Cours d'essai</a><a class="btn blanc" href="cours.html">Découvrir les cours</a></div></div>
<div class="poster"><img src="assets/img/affiche-reprise-2026.jpg" alt="Affiche de la reprise des cours de danse et jumping fitness, saison 2026/2027" width="640" height="905" fetchpriority="high"><div class="sticker">Saison<br>2026<br>2027</div></div></div></section>
<div class="marq" aria-hidden="true"><div>{MARQ}{MARQ}</div></div>
<section><div class="wrap"><div class="sec-t rv"><h2>Prochain <em>rendez-vous</em></h2></div><div data-render="prochain" data-src="evenements"></div></div></section>
<section style="background:#fff"><div class="wrap"><div class="sec-t rv"><h2>Deux façons de <em>vibrer</em></h2><p>Danse pour tous les âges et jumping fitness pour les adultes. Débutants et curieux bienvenus.</p></div>
<div class="grid" data-render="cours" data-src="cours"></div><p style="text-align:center;margin-top:30px" class="rv"><a class="btn rose" href="cours.html">Toutes les fiches</a></p></div></section>
<section class="stats"><div class="wrap"><div class="sec-t rv"><h2 style="color:#fff">L'asso en <em style="color:var(--orange)">chiffres</em></h2></div><div class="grid" data-render="chiffres" data-src="site"></div></div></section>
<section><div class="wrap"><div class="sec-t rv"><h2>Dernières <em>actualités</em></h2></div><div class="news" data-render="actus" data-src="actus" data-max="3"></div><p style="text-align:center;margin-top:30px" class="rv"><a class="btn" href="actualites.html">Toutes les actus</a></p></div></section>
<section style="padding-top:0"><div class="wrap"><div class="evt rv" style="text-align:center;justify-items:center"><h2>Envie d'essayer ?</h2><p style="font-weight:700;font-size:1.15rem">Les inscriptions sont ouvertes. Venez faire un cours d'essai, sans prise de tête.</p><a class="btn blanc" href="contact.html">Je réserve mon essai</a></div></div></section>''')

# 2 Association
page("association.html","L'association — Dance & Jump, Chaux",
 "Découvrez l'histoire, les valeurs et l'équipe de l'association Dance and Jump, créée en 2015 à Chaux (Territoire de Belfort).",
 ph("L'association","Une passion pour la danse, partagée depuis 2015.")+f'''
<section><div class="wrap split"><div class="rv"><h2>Notre histoire</h2><p style="margin-top:14px">« Passionnée de danse depuis toujours », la fondatrice a créé l'association Dance and Jump en 2015, après plus de 15 ans d'expérience dans la création de spectacles associatifs.</p><p style="margin-top:12px">Elle a découvert le Jumping Fitness à cette période et s'est formée au centre officiel de Mulhouse. Les cours sont animés sur la base du bénévolat.</p></div>
<img class="rv" src="assets/img/affiche-portes-ouvertes-2026.jpg" alt="Affiche des portes ouvertes 2026 de l'association Dance and Jump" loading="lazy"></div></section>
<section style="background:#fff"><div class="wrap"><div class="sec-t rv"><h2>Nos <em>valeurs</em></h2></div><div class="grid">
<div class="card rose rv"><span class="emo">🤝</span><h3>Convivialité</h3><p>Une ambiance chaleureuse où chacun trouve sa place.</p></div>
<div class="card vert rv"><span class="emo">🌈</span><h3>Pour tous</h3><p>Enfants, ados et adultes, de tous niveaux. Débutants et curieux bienvenus.</p></div>
<div class="card orange rv"><span class="emo">⚡</span><h3>Énergie</h3><p>Plaisir, cardio et dépassement de soi, en musique.</p></div></div></div></section>
<section><div class="wrap"><div class="sec-t rv"><h2>Bureau &amp; <em>équipe</em></h2></div><div class="grid">
<div class="card rose rv"><span class="emo">💃</span><h3>Laura</h3><p>Fondatrice et animatrice bénévole des cours de danse et de jumping fitness. Contact de l'association.</p></div>
<div class="card rv"><span class="emo">👥</span><h3>Composition du bureau</h3><p>Texte d'attente : président(e), trésorier(e) et secrétaire à renseigner par l'association.</p></div></div></div></section>''')

# 3 Cours
page("cours.html","Cours & activités — Dance & Jump, Chaux",
 "Cours de danse pour enfants, ados et adultes et jumping fitness pour adultes à Chaux (90330) : public, niveau, jours, lieu et professeur.",
 ph("Cours & activités","Une fiche par discipline : trouvez votre rythme.","o")+'''<section><div class="wrap"><div class="grid" data-render="cours" data-src="cours" data-full="1"></div><p class="note rv">Horaires et salle : textes d'attente, à confirmer auprès de l'association.</p></div></section>''')

# 4 Planning & tarifs
page("planning-tarifs.html","Planning & tarifs — Dance & Jump, Chaux",
 "Planning hebdomadaire des cours (lundi, mercredi, vendredi), tarifs et modalités d'inscription de l'association Dance and Jump à Chaux.",
 ph("Planning &amp; tarifs","Votre semaine en un coup d'œil.","v")+'''<section><div class="wrap"><div class="plan" data-render="planning" data-src="planning"></div><p class="note" id="plan-note"></p></div></section>
<section style="background:#fff"><div class="wrap"><div class="sec-t rv"><h2>Tarifs &amp; <em>inscription</em></h2></div><div data-render="tarifs" data-src="tarifs"></div><p style="margin-top:24px"><a class="btn rose" href="contact.html">S'inscrire ou essayer</a></p></div></section>''')

# 5 Evenements
page("evenements.html","Événements & spectacles — Dance & Jump, Chaux",
 "Cours d'essai, portes ouvertes, démonstrations et spectacles de l'association Dance and Jump : à venir et archives des éditions passées.",
 ph("Événements &amp; spectacles","Portes ouvertes, démonstrations, spectacles : on se retrouve !","o")+'''<section><div class="wrap"><div class="sec-t rv"><h2>À <em>venir</em></h2></div><div class="grid" data-render="avenir" data-src="evenements"></div></div></section>
<section style="background:#fff"><div class="wrap"><div class="sec-t rv"><h2>Les <em>archives</em></h2></div><div class="arch" data-render="archives" data-src="evenements"></div></div></section>''')

# 6 Galerie
page("galerie.html","Galerie — Dance & Jump, Chaux",
 "Photos, affiches et vidéos de l'association Dance and Jump, classées par cours et par événement.",
 ph("Galerie","Ça saute, ça danse, ça se voit !")+'<section><div class="wrap" data-render="galerie" data-src="galerie"></div></section>')

# 7 Actualités
page("actualites.html","Actualités — Dance & Jump, Chaux",
 "Les dernières nouvelles de l'association Dance and Jump : reprise des cours, nouveaux créneaux, portes ouvertes.",
 ph("Actualités","Les dernières nouvelles de l'asso.","v")+'<section><div class="wrap"><div class="news" data-render="actus" data-src="actus"></div></div></section>')

# 8 Contact
page("contact.html","Nous rejoindre & contact — Dance & Jump, Chaux",
 "Inscription, cours d'essai et contact de l'association Dance and Jump à Chaux (90330) : formulaire, téléphone, e-mail et localisation.",
 ph("Nous rejoindre","Un cours d'essai ? Une question ? Écrivez-nous !","o")+'''<section><div class="wrap split" style="align-items:start"><div class="rv"><h2>Inscription &amp; essai</h2><ul class="check" style="margin:18px 0"><li>Les inscriptions 2026/2027 sont ouvertes.</li><li>Débutants et curieux bienvenus pour un cours d'essai.</li><li>Pièces à fournir et modalités de paiement : à confirmer auprès de l'association.</li></ul>
<div class="card rose"><h3>Coordonnées</h3><p><b>Laura</b><br>📞 <a href="tel:+33689048143">06 89 04 81 43</a><br>✉️ <a href="mailto:laura.bulliard@hotmail.fr">laura.bulliard@hotmail.fr</a><br>📍 Chaux (90330), Territoire de Belfort<br>📘 <a href="'''+FB+'''" target="_blank" rel="noopener">Facebook</a></p></div></div>
<div class="rv"><h2>Écrivez-nous</h2><form name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field" style="margin-top:18px">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Ne pas remplir <input name="bot-field"></label></p>
<label>Nom<input name="nom" required autocomplete="name"></label>
<label>E-mail<input type="email" name="email" required autocomplete="email"></label>
<label>Téléphone (facultatif)<input type="tel" name="telephone" autocomplete="tel"></label>
<label>Je souhaite<select name="sujet"><option>Faire un cours d'essai</option><option>M'inscrire</option><option>Poser une question</option></select></label>
<label>Message<textarea name="message" rows="5" required></textarea></label>
<button class="btn rose" type="submit">Envoyer</button></form></div></div></section>
<section style="padding-top:0"><div class="wrap"><h2 class="rv" style="margin-bottom:18px">Où nous trouver ?</h2><div class="rv" style="border:3px solid var(--noir);border-radius:22px;overflow:hidden;box-shadow:6px 6px 0 var(--noir)"><iframe title="Carte de Chaux (90330)" loading="lazy" style="width:100%;height:340px;border:0" src="https://www.openstreetmap.org/export/embed.html?bbox=6.78%2C47.64%2C6.90%2C47.72&amp;layer=mapnik"></iframe></div><p class="note">Commune de Chaux (90330) — <a href="https://www.openstreetmap.org/search?query=Chaux%2090330" target="_blank" rel="noopener">ouvrir la carte</a>. Adresse exacte de la salle : texte d'attente, à confirmer auprès de l'association.</p></div></section>''')

# 9 Mentions légales
page("mentions-legales.html","Mentions légales — Dance & Jump",
 "Mentions légales du site de l'association Dance and Jump, Chaux (90330).",
 ph("Mentions légales","Informations légales du site.")+'''<section><div class="wrap" style="max-width:760px"><h2 style="font-size:1.6rem">Éditeur</h2><p>Association Dance and Jump, association loi 1901, Chaux (90330), Territoire de Belfort.<br>Contact : laura.bulliard@hotmail.fr, 06 89 04 81 43.<br>Directeur de la publication : texte d'attente, à compléter par l'association. N° RNA : à compléter.</p>
<h2 style="font-size:1.6rem;margin-top:28px">Hébergement</h2><p>Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis.</p>
<h2 style="font-size:1.6rem;margin-top:28px">Données personnelles</h2><p>Les informations saisies dans le formulaire de contact sont utilisées uniquement pour répondre à votre demande. Vous pouvez demander leur suppression à tout moment en écrivant à l'adresse ci-dessus.</p>
<h2 style="font-size:1.6rem;margin-top:28px">Crédits</h2><p>Affiches et visuels : association Dance and Jump (publiés sur le site de la mairie de Chaux). Polices : Rubik et Nunito (Google Fonts). Carte : © contributeurs OpenStreetMap.</p></div></section>''')

# Merci
page("merci.html","Merci ! — Dance & Jump","Votre message a bien été envoyé.",
 ph("Merci !","Votre message est bien parti, Laura vous répond vite.","v")+'<section><div class="wrap" style="text-align:center"><a class="btn" href="index.html">Retour à l\'accueil</a></div></section>', noindex=True)
