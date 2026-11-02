#!/usr/bin/env python3
"""Génère les pages HTML du site TPO (en-tête / pied de page communs). Usage : python3 build.py"""
import os, html
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tpo-site")
SITE = "Toum Porte Océane"

NAV = [("index.html","Accueil"),("association.html","L'association"),("tai-chi-chuan.html","Le Tai Chi Chuan"),
       ("cours-planning.html","Cours & planning"),("tarifs-inscription.html","Tarifs & inscription"),
       ("stages-evenements.html","Stages & événements"),("galerie.html","Galerie"),("actualites.html","Actualités"),
       ("nous-rejoindre.html","Nous rejoindre")]

WAVE = '<svg viewBox="0 0 2880 130" preserveAspectRatio="none" aria-hidden="true"><path fill="#f8f6f0" d="M0 60q180-60 360 0t360 0t360 0t360 0t360 0t360 0t360 0t360 0V130H0z"/></svg>'
WAVES = '<div class="waves" aria-hidden="true">'+WAVE*3+'</div>'

def header(cur):
    items = ""
    for href, label in NAV:
        cta = ' class="cta"' if href=="nous-rejoindre.html" else ""
        ac = ' aria-current="page"' if href==cur else ""
        items += f'<li{cta}><a href="{href}"{ac}>{html.escape(label)}</a></li>\n'
    return f'''<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header"><div class="wrap nav">
<a class="brand" href="index.html" aria-label="{SITE}, accueil"><img src="img/logo-tpo.jpg" alt="" width="140" height="52"><span>{SITE}<small>Taichi Chuan · Niort · Châtelaillon</small></span></a>
<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span></button>
<nav aria-label="Navigation principale"><ul id="menu" class="menu">
{items}</ul></nav></div></header>'''

FOOTER = '''<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><img class="foot-logo" src="img/logo-tpo.jpg" alt="Toum Porte Océane" width="200" height="75" loading="lazy">
<p>Association de Taichi Chuan, style Yang de Maître Tung Kai Ying. Affiliée à la Fédération Française des Arts Énergétiques et Martiaux Chinois.</p></div>
<div><h2>Contact</h2><ul>
<li>Liliane Lapomme<br><a href="tel:+33689866484">06 89 86 64 84</a></li>
<li><a href="mailto:lilianelapomme@gmail.com">lilianelapomme@gmail.com</a></li>
<li>Trésorerie : Nathalie Ménakovski<br><a href="tel:+33619697959">06 19 69 79 59</a></li></ul></div>
<div><h2>Le site</h2><ul>
<li><a href="association.html">L'association</a></li><li><a href="tai-chi-chuan.html">Le Tai Chi Chuan</a></li>
<li><a href="cours-planning.html">Cours &amp; planning</a></li><li><a href="tarifs-inscription.html">Tarifs &amp; inscription</a></li>
<li><a href="stages-evenements.html">Stages &amp; événements</a></li><li><a href="galerie.html">Galerie</a></li>
<li><a href="actualites.html">Actualités</a></li><li><a href="nous-rejoindre.html">Nous rejoindre</a></li></ul></div>
<div><h2>Liens utiles</h2><ul>
<li><a href="https://toum.asso.fr/" target="_blank" rel="noopener">Associations Toum <span class="sr" style="position:absolute;left:-999px">(nouvel onglet)</span></a></li>
<li><a href="https://www.tungkaiying.com" target="_blank" rel="noopener">Maître Tung Kai Ying <span class="sr" style="position:absolute;left:-999px">(nouvel onglet)</span></a></li>
<li><a href="https://www.ffaemc.fr" target="_blank" rel="noopener">FFAEMC <span class="sr" style="position:absolute;left:-999px">(nouvel onglet)</span></a></li>
<li><a href="mentions-legales.html">Mentions légales</a></li></ul>
<p style="margin-top:1rem;font-size:.92rem">Réseaux sociaux : liens à ajouter ici dès leur création.</p></div>
</div>
<div class="copy"><span>© 2026 Toum Porte Océane — Salles mises à disposition par les municipalités de Niort, Châtelaillon-Plage et Les Fosses.</span><a href="mentions-legales.html">Mentions légales</a></div>
</div></footer>'''

def page(fname, title, desc, body, hero=None, img="img/hero.jpg", extra_end="", home=False):
    cur = fname
    if hero:
        eyebrow, h1, lead = hero
        top = f'''<div class="page-hero"><div class="hero-bg" style="background-image:url({img})" role="presentation"></div>
<div class="wrap"><span class="eyebrow">{eyebrow}</span><h1>{h1}</h1><p>{lead}</p></div>{WAVES}</div>'''
    else:
        top = ""
    return f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:type" content="website"><meta property="og:image" content="img/groupe-parc.jpg">
<meta name="theme-color" content="#133457">
<link rel="icon" href="img/logo-tpo.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head><body>
{header(cur)}
<main id="contenu">
{top}{body}
</main>
{FOOTER}
{extra_end}
<script src="data/data.js"></script><script src="js/main.js"></script>
</body></html>'''

def write(name, content):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f: f.write(content)

CTA = '''<section class="bg-ink center"><div class="narrow rv"><h2>Envie d'essayer&nbsp;?</h2>
<p class="lead" style="color:#d6e6f1">Venez découvrir le Taichi Chuan dans l'un de nos trois lieux. Contactez-nous pour convenir d'une séance.</p>
<div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="nous-rejoindre.html">Venir essayer</a><a class="btn btn-ghost btn-ghost-light" href="cours-planning.html">Voir les horaires</a></div></div></section>'''

# ---------------- ACCUEIL ----------------
home = f'''<section class="hero"><div class="hero-bg" role="presentation"></div>
<div class="wrap"><span class="eyebrow">Taichi Chuan · Niort · Châtelaillon-Plage · Forêt de Chizé</span>
<h1>Le geste juste, lentement.</h1>
<p class="lead">Toum Porte Océane vous invite à pratiquer le Taichi Chuan, style Yang de Maître Tung Kai Ying, à tout âge, depuis plus de 40 ans.</p>
<div class="btn-row"><a class="btn btn-primary" href="nous-rejoindre.html">Venir essayer</a><a class="btn btn-ghost btn-ghost-light" href="cours-planning.html">Cours et horaires</a></div></div>
<span class="scroll-cue" aria-hidden="true"></span>{WAVES}</section>

<div class="next"><div class="wrap"><div class="next-card rv">
<div><span class="eyebrow" id="next-label">Prochaine séance</span><h2 id="next-title">…</h2><p id="next-sub" class="lead" style="margin-bottom:1rem"></p><a id="next-link" class="arrow-link" href="cours-planning.html">Détails et lieu</a></div>
<div class="countdown" role="timer" aria-label="Compte à rebours avant la prochaine séance"><div><b id="cd-d">00</b><span>jours</span></div><div><b id="cd-h">00</b><span>heures</span></div><div><b id="cd-m">00</b><span>min</span></div><div><b id="cd-s">00</b><span>sec</span></div></div>
</div></div></div>

<section><div class="wrap split">
<div class="rv"><span class="eyebrow">L'association</span><h2>Un art du mouvement, à tout âge</h2>
<p class="lead">Le Taichi Chuan est un art martial chinois interne : un enchaînement de mouvements lents ou rapides, sans interruption, au rythme du Yin et du Yang.</p>
<p>Toum Porte Océane est présente depuis plus de 40 ans à Niort et dans plusieurs villes et villages du Poitou-Charentes. Quatre enseignantes diplômées animent les cours, du premier pas au perfectionnement.</p>
<div class="btn-row"><a class="btn btn-ghost" href="association.html">Découvrir l'association</a><a class="btn btn-ghost" href="tai-chi-chuan.html">Le Tai Chi Chuan</a></div></div>
<div class="photo blob rv d1"><img src="img/groupe-parc.jpg" alt="Pratiquants de Taichi Chuan dans un parc" width="638" height="455" loading="lazy"></div></div></section>

<section class="bg-mist"><div class="wrap"><div class="center rv" style="margin-bottom:2.5rem"><span class="eyebrow">Les cours</span><h2>Chacun son rythme</h2><p class="lead">Touchez ou survolez une carte pour en savoir plus.</p></div>
<div class="grid g3" id="niveaux-cards"></div>
<div class="center" style="margin-top:2.5rem"><a class="btn btn-primary" href="cours-planning.html">Planning de la semaine</a></div></div></section>

<section class="bg-ink" style="overflow:hidden"><div class="motif" aria-hidden="true"></div><div class="wrap stats">
<div class="stat rv"><b data-to="40" data-suffix="+">0</b><span>années de pratique à Niort</span></div>
<div class="stat rv d1"><b data-count="lieux" data-to="3">0</b><span>lieux de pratique</span></div>
<div class="stat rv d2"><b data-count="cours" data-to="12">0</b><span>cours par semaine</span></div>
<div class="stat rv d3"><b data-count="ens" data-to="4">0</b><span>enseignantes diplômées</span></div></div></section>

<section><div class="wrap"><div class="rv" style="margin-bottom:2.5rem"><span class="eyebrow">Actualités</span><h2>Dernières nouvelles</h2></div>
<div class="grid g3" id="news-home"></div>
<p style="margin-top:2rem"><a class="arrow-link" href="actualites.html">Toutes les actualités</a></p></div></section>

<section class="bg-mist"><div class="wrap"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Aperçu</span><h2>Explorer le site</h2></div>
<div class="grid g4">
<a class="card rv" href="tarifs-inscription.html" style="text-decoration:none"><h3>Tarifs &amp; inscription</h3><p>Adhésion, licence, cours : tout est détaillé.</p></a>
<a class="card rv d1" href="stages-evenements.html" style="text-decoration:none"><h3>Stages &amp; événements</h3><p>Matinées de pratique, stages, démonstrations.</p></a>
<a class="card rv d2" href="galerie.html" style="text-decoration:none"><h3>Galerie</h3><p>Les cours en images, au parc comme en salle.</p></a>
<a class="card rv d3" href="nous-rejoindre.html" style="text-decoration:none"><h3>Nous rejoindre</h3><p>Une question ? Une séance d'essai ?</p></a></div></div></section>
{CTA}'''
write("index.html", page("index.html", "Toum Porte Océane — Taichi Chuan à Niort et Châtelaillon-Plage",
 "Association de Taichi Chuan (style Yang, Maître Tung Kai Ying) à Niort, Châtelaillon-Plage et Vaubalier. Cours pour tous les âges, essai possible.", home))

# ---------------- ASSOCIATION ----------------
assoc = f'''<section><div class="wrap split">
<div class="rv"><span class="eyebrow">Notre histoire</span><h2>Plus de 40 ans à Niort</h2>
<p class="lead">Toum Porte Océane pratique et transmet le Taichi Chuan depuis plus de 40 ans à Niort, et dans diverses villes et villages de Poitou-Charentes.</p>
<p>L'association est affiliée à la Fédération Française des Arts Énergétiques et Martiaux Chinois (FFAEMC) et soutenue par les municipalités de Niort et de Châtelaillon-Plage.</p>
<p class="placeholder">Année de création, anecdotes et moments marquants : à compléter par l'association.</p></div>
<div class="photo tall hover rv d1"><img src="img/pratique-1.jpg" alt="Pratiquante de Taichi Chuan dans un parc" width="157" height="281" loading="lazy" style="object-position:center top"></div></div></section>

<section class="bg-mist"><div class="wrap"><div class="center rv" style="margin-bottom:2.5rem"><span class="eyebrow">Ce qui nous réunit</span><h2>Nos valeurs</h2></div>
<div class="grid g3">
<div class="card rv"><h3>Patience</h3><p>Le Taichi Chuan est « une école de patience et de découverte de soi » : on progresse à son rythme, avec plaisir.</p></div>
<div class="card rv d1"><h3>Ouverture</h3><p>Une pratique qui apprend à se centrer et à s'ouvrir à l'autre, ouverte à tous les âges.</p></div>
<div class="card rv d2"><h3>Transmission</h3><p>Des enseignantes diplômées d'État ou fédérales, et une pratique fidèle au style Tung.</p></div></div></div></section>

<section><div class="wrap split rev">
<div class="rv"><span class="eyebrow">Le réseau</span><h2>Le lien avec l'école TOUM</h2>
<p>Toum Paris, fondée par Anya Méot en 1983, a donné naissance à plusieurs associations Toum en France et à l'étranger. Toum Porte Océane en fait partie.</p>
<p>Les associations Toum diffusent le style Yang de Maître Tung Kai Ying. Au cours de leurs voyages, les pratiquants Toum peuvent être accueillis pour une soirée de pratique par une autre association Toum.</p>
<div class="btn-row"><a class="btn btn-ghost" href="https://toum.asso.fr/" target="_blank" rel="noopener">toum.asso.fr<span style="position:absolute;left:-999px"> (nouvel onglet)</span></a><a class="btn btn-ghost" href="https://www.tungkaiying.com" target="_blank" rel="noopener">tungkaiying.com<span style="position:absolute;left:-999px"> (nouvel onglet)</span></a></div></div>
<div class="photo hover rv d1"><img src="img/file-parc.jpg" alt="Pratiquants alignés dans un parc" width="572" height="1000" loading="lazy"></div></div></section>

<section class="bg-mist"><div class="wrap"><div class="center rv" style="margin-bottom:2.5rem"><span class="eyebrow">L'équipe</span><h2>Les enseignantes</h2><p class="lead">Toutes les enseignantes de Toum Porte Océane ont un diplôme de Taichi Chuan reconnu par l'État.</p></div>
<div class="grid g4" id="team"></div></div></section>

<section><div class="narrow rv"><span class="eyebrow">Bureau</span><h2>Le bureau</h2>
<ul class="contact-list" id="bureau"></ul>
<p class="note" style="margin-top:1.5rem">Composition du bureau : à compléter par l'association.</p></div></section>
{CTA}'''
write("association.html", page("association.html","L'association — Toum Porte Océane",
 "Histoire, valeurs, lien avec l'école Toum, enseignantes et bureau de l'association Toum Porte Océane (Niort, Châtelaillon-Plage).", assoc,
 ("L'association","Une pratique partagée","Plus de 40 ans de Taichi Chuan à Niort et en Poitou-Charentes."), "img/file-parc.jpg"))

# ---------------- TAI CHI CHUAN ----------------
tcc = f'''<section><div class="wrap split">
<div class="rv"><span class="eyebrow">La discipline</span><h2>Un art martial interne</h2>
<p class="lead">Le Taichi Chuan est un art martial chinois interne. Art du mouvement, il se pratique à tout âge.</p>
<p>Vous pouvez croiser ses pratiquants seuls ou en groupe dans les parcs ; il se pratique également en salle. La pratique repose sur l'enchaînement de mouvements lents ou rapides, sans interruption, selon l'alternance du Yin et du Yang. Les mouvements ressemblent à un combat au ralenti, chaque geste ayant une application martiale.</p>
<p>À partir du <b>Tao Lu</b>, forme lente et base de l'apprentissage, le Taichi Chuan est riche de multiples pratiques à mains nues et avec armes, en solo, en groupe ou en jeux à deux.</p></div>
<div class="photo hover rv d1"><img src="img/mains.jpg" alt="Mains en mouvement devant un plan d'eau" width="572" height="196" loading="lazy" style="aspect-ratio:4/3;object-fit:cover"></div></div></section>

<section class="bg-mist"><div class="wrap split rev">
<div class="rv"><span class="eyebrow">Notre style</span><h2>Yang, école de Maître Tung Kai Ying</h2>
<p>Notre Taichi Chuan est de forme Yang, de Maître Tung Kai Ying. Le style Tung est riche d'une grande diversité de pratiques, pour le plaisir et l'approfondissement du Taichi Chuan.</p>
<p>L'accent est mis sur la circulation de l'énergie qui développe la conscience du corps, l'équilibre et la vitalité.</p></div>
<div class="photo hover rv d1"><img src="img/eventails-detail.jpg" alt="Éventails rouge et bleu ouverts" width="379" height="300" loading="lazy" style="aspect-ratio:4/3;object-fit:cover"></div></div></section>

<section><div class="narrow"><div class="rv"><span class="eyebrow">Ce que l'on y cherche</span><h2>Des bienfaits, avec prudence</h2>
<p class="lead">Dans le plaisir et l'approfondissement de la pratique, chacun peut chercher aisance et mobilité corporelle, détente et relaxation, méditation en mouvement, disponibilité à l'action, qualité de relation aux autres.</p>
<p>C'est une école de patience et de découverte de soi, qui apprend à se centrer et à s'ouvrir à l'autre à travers les infinies richesses de la quête du geste juste.</p>
<p class="note">Le Taichi Chuan est proposé ici comme une discipline de bien-être et de souplesse. Les ressentis varient d'une personne à l'autre et la pratique ne remplace pas un avis médical. Un certificat médical est demandé à la première inscription.</p></div></div></section>

<section class="bg-mist"><div class="wrap"><div class="center rv" style="margin-bottom:2.5rem"><span class="eyebrow">À qui s'adresse-t-il ?</span><h2>À tout âge, à tout niveau</h2></div>
<div class="grid g3">
<div class="card rv"><h3>Aux débutants</h3><p>Aucun prérequis. Des cours « Débutants et bases » existent sur chaque lieu.</p></div>
<div class="card rv d1"><h3>Aux seniors comme aux plus jeunes</h3><p>La pratique se déroule à son rythme : mouvements lents, enchaînés, sans compétition.</p></div>
<div class="card rv d2"><h3>Aux pratiquants confirmés</h3><p>Approfondissement, perfectionnement, armes et jeux à deux pour poursuivre.</p></div></div></div></section>

<section><div class="narrow"><div class="rv"><span class="eyebrow">En pratique</span><h2>Déroulé d'un cours</h2>
<p class="placeholder">Texte d'attente : le déroulé détaillé sera rédigé avec les enseignantes. En général, un cours alterne mise en train, travail de la forme (Tao Lu), pratiques complémentaires et retour au calme. À confirmer.</p>
<p>Tenue souple et confortable conseillée. La durée varie de 1h15 à 1h30 selon les cours, voir le <a href="cours-planning.html">planning</a>.</p></div></div></section>
{CTA}'''
write("tai-chi-chuan.html", page("tai-chi-chuan.html","Le Tai Chi Chuan — Toum Porte Océane",
 "Découvrez le Taichi Chuan style Yang (école Tung) : art du mouvement lent, pour tous les âges. À qui il s'adresse et comment se déroule un cours.", tcc,
 ("La discipline","Le Tai Chi Chuan","Un art du mouvement, lent et continu, qui se pratique à tout âge."), "img/groupe-parc.jpg"))

# ---------------- COURS & PLANNING ----------------
cours = f'''<section><div class="wrap"><div class="rv"><span class="eyebrow">Saison 2026-2027</span><h2>Planning hebdomadaire</h2>
<p class="lead">Touchez un créneau pour voir le lieu, le public et le niveau.</p></div>
<div class="filters" role="group" aria-label="Filtrer par lieu">
<button class="chip" data-lieu="tous" aria-pressed="true">Tous les lieux</button><button class="chip" data-lieu="niort" aria-pressed="false">Niort</button>
<button class="chip" data-lieu="vaubalier" aria-pressed="false">Forêt de Chizé</button><button class="chip" data-lieu="chatelaillon" aria-pressed="false">Châtelaillon-Plage</button></div>
<div class="plan" id="planning" aria-live="polite"><noscript>Le planning interactif nécessite JavaScript : consultez le <a href="docs/lieux-et-horaires-2026-2027.pdf">PDF des horaires</a>.</noscript></div>
<div class="legend"><span><i style="background:#1f4e8c"></i>Niort</span><span><i style="background:#2f6b52"></i>Forêt de Chizé</span><span><i style="background:#b3362d"></i>Châtelaillon-Plage</span></div>
<p style="margin-top:1.5rem"><a class="btn btn-ghost" href="docs/lieux-et-horaires-2026-2027.pdf" target="_blank" rel="noopener">Télécharger les horaires (PDF)<span style="position:absolute;left:-999px"> (nouvel onglet)</span></a></p></div>
<dialog id="slot-dialog" aria-label="Détail du cours"></dialog></section>

<section class="bg-mist"><div class="wrap"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Les fiches</span><h2>Un cours pour chaque niveau</h2>
<p class="note">Enseignante par créneau : à confirmer. Les quatre enseignantes (Françoise, Liliane, Monique, Nathalie) interviennent selon les cours.</p></div>
<div class="grid g2" id="fiches"></div></div></section>

<section><div class="wrap"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Où pratiquer</span><h2>Nos trois lieux</h2><p>Salles mises à disposition par les municipalités.</p></div>
<div class="grid g3" id="lieux"></div></div></section>
{CTA}'''
write("cours-planning.html", page("cours-planning.html","Cours & planning — Toum Porte Océane",
 "Cours de Taichi Chuan à Niort, Forêt de Chizé (Vaubalier) et Châtelaillon-Plage : horaires, lieux, niveaux. Planning hebdomadaire 2026-2027.", cours,
 ("Saison 2026-2027","Cours & planning","Douze cours par semaine, sur trois lieux, du débutant au perfectionnement."), "img/file-parc.jpg"))

# ---------------- TARIFS ----------------
tarifs = f'''<section id="tarifs"><div class="wrap"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Saison 2026-2027</span><h2>Les tarifs</h2>
<p class="lead">Un tarif annuel, composé de l'adhésion, de la licence fédérale et du cours.</p></div>
<div class="grid g4">
<div class="card price rv"><h3>Adhésion</h3><div class="amt"><span id="t-adh">15</span><small> €</small></div><p>à l'association</p></div>
<div class="card price rv d1"><h3>Licence FFAEMC</h3><div class="amt"><span id="t-lic">37</span><small> €</small></div><p>assurance comprise</p></div>
<div class="card price rv d2"><h3>Cours, plein tarif</h3><div class="amt"><span id="t-plein">210</span><small> €</small></div><p>à l'année</p></div>
<div class="card price hl rv d3"><h3>Cours, tarif réduit</h3><div class="amt"><span id="t-reduit">170</span><small> €</small></div><p>couples, familles, étudiants ; autre cas : sur demande</p></div></div>
<p style="margin-top:1.5rem">Soit au total, <b>adhésion et licence comprises</b> : <b><span id="t-total-plein">262</span> €</b> en plein tarif ou <b><span id="t-total-reduit">222</span> €</b> en tarif réduit.</p>
<p class="note">Aucun paiement n'est géré sur ce site. Le règlement se fait <b>par chèque bancaire</b>, avec le bulletin d'inscription.</p></div></section>

<section class="bg-mist"><div class="narrow"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Marche à suivre</span><h2>S'inscrire en 4 étapes</h2></div>
<ol class="steps">
<li class="rv"><div><b>Venir essayer</b><br>Contactez-nous pour une séance d'essai.</div></li>
<li class="rv"><div><b>Télécharger le bulletin</b><br>Choisissez le(s) lieu(x), jour(s) et l'enseignante, et indiquez votre accord (ou non) pour le droit à l'image.</div></li>
<li class="rv"><div><b>Réunir les pièces</b><br>Pour une nouvelle inscription : un certificat médical de l'année en cours et 2 photos d'identité.</div></li>
<li class="rv"><div><b>Régler par chèque</b><br>Le règlement se fait par chèque bancaire (adhésion, licence, cours).</div></li></ol>
<div class="btn-row"><a class="btn btn-primary" href="docs/bulletin-inscription-2026-2027.pdf" target="_blank" rel="noopener">Bulletin d'inscription (PDF)<span style="position:absolute;left:-999px"> (nouvel onglet)</span></a><a class="btn btn-ghost" href="nous-rejoindre.html">Nous contacter</a></div>
<p class="placeholder" style="margin-top:1.5rem">À compléter : où et quand remettre le bulletin et le chèque (en début de cours ou par courrier).</p></div></section>

<section><div class="narrow rv"><span class="eyebrow">Séance d'essai</span><h2>Venir essayer</h2>
<p class="placeholder">Texte d'attente : modalités de la séance d'essai (gratuité, nombre de séances, tenue) à confirmer par l'association. Contactez Liliane Lapomme au 06 89 86 64 84.</p>
<div class="btn-row"><a class="btn btn-primary" href="nous-rejoindre.html">Demander une séance d'essai</a></div></div></section>'''
write("tarifs-inscription.html", page("tarifs-inscription.html","Tarifs & inscription — Toum Porte Océane",
 "Tarifs 2026-2027 : adhésion 15 €, licence 37 €, cours 210 € (170 € en tarif réduit). Modalités d'inscription et bulletin à télécharger.", tarifs,
 ("Saison 2026-2027","Tarifs & inscription","Des tarifs clairs, un bulletin simple, et une séance d'essai pour commencer."), "img/pratique-3.jpg"))

# ---------------- STAGES & EVENEMENTS ----------------
stages = f'''<section><div class="narrow"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">À venir</span><h2>Stages, démonstrations, portes ouvertes</h2>
<p class="note">Les dates ne sont pas encore communiquées : elles apparaîtront ici dès qu'elles seront confirmées (texte d'attente).</p></div>
<div class="grid" id="events-up" style="gap:1.2rem"></div></div></section>
<section class="bg-mist"><div class="narrow"><div class="rv" style="margin-bottom:2rem"><span class="eyebrow">Archives</span><h2>Événements passés</h2></div>
<div class="grid" id="events-arch" style="gap:1.2rem"></div>
<p style="margin-top:2rem">Stages nationaux et régionaux du réseau Toum : <a href="https://toum.asso.fr/" target="_blank" rel="noopener">toum.asso.fr<span style="position:absolute;left:-999px"> (nouvel onglet)</span></a></p></div></section>
{CTA}'''
write("stages-evenements.html", page("stages-evenements.html","Stages & événements — Toum Porte Océane",
 "Matinées de pratique mensuelles, stages, démonstrations et portes ouvertes de l'association Toum Porte Océane.", stages,
 ("Rendez-vous","Stages & événements","Pratiquer autrement : matinées thématiques, stages, démonstrations."), "img/eventail.jpg"))

# ---------------- GALERIE ----------------
lb = '<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button type="button" aria-label="Fermer">✕</button><img src="" alt=""><p></p></div>'
gal = '''<section><div class="wrap"><div class="rv"><span class="eyebrow">Photos</span><h2>La pratique en images</h2></div>
<div class="filters" id="gal-filters" role="group" aria-label="Filtrer les photos"></div>
<div class="gallery" id="gallery"></div></div></section>
<section class="bg-mist"><div class="narrow"><div class="rv"><span class="eyebrow">Vidéos</span><h2>Vidéos</h2></div><div id="videos"></div></div></section>'''
write("galerie.html", page("galerie.html","Galerie — Toum Porte Océane",
 "Photos des cours et de la pratique du Taichi Chuan avec Toum Porte Océane : parc, jardin, éventail, salle.", gal,
 ("Galerie","En images","Des moments de pratique, en plein air et en salle."), "img/pratique-4.jpg", lb))

# ---------------- ACTUALITES ----------------
act = '''<section><div class="wrap"><div class="grid g3" id="news-all"></div></div></section>'''
write("actualites.html", page("actualites.html","Actualités — Toum Porte Océane",
 "Les dernières nouvelles de l'association de Taichi Chuan Toum Porte Océane.", act,
 ("Actualités","Dernières nouvelles","La vie de l'association, saison après saison."), "img/duo.jpg"))

# ---------------- CONTACT ----------------
contact = f'''<section><div class="wrap split" style="align-items:start">
<div class="rv"><span class="eyebrow">Séance d'essai</span><h2>Écrivez-nous</h2>
<p class="lead">Une question, une envie d'essayer ? Remplissez ce formulaire, nous vous répondrons.</p>
<p id="sent" class="note" hidden role="status">Merci, votre message a bien été envoyé.</p>
<form name="contact" method="POST" action="nous-rejoindre.html?envoye=1" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div><label for="nom">Nom et prénom</label><input id="nom" name="nom" autocomplete="name" required></div>
<div><label for="email">Courriel</label><input id="email" name="email" type="email" autocomplete="email" required></div>
<div><label for="tel">Téléphone (facultatif)</label><input id="tel" name="telephone" type="tel" autocomplete="tel"></div>
<div><label for="sujet">Votre demande</label><select id="sujet" name="sujet"><option>Séance d'essai</option><option>Renseignements sur les cours</option><option>Inscription</option><option>Autre</option></select></div>
<div><label for="lieu">Lieu qui vous intéresse</label><select id="lieu" name="lieu"><option>Niort</option><option>Forêt de Chizé (Vaubalier)</option><option>Châtelaillon-Plage</option><option>Je ne sais pas encore</option></select></div>
<div><label for="msg">Message</label><textarea id="msg" name="message" required></textarea></div>
<label class="check"><input type="checkbox" name="consentement" required><span>J'accepte que mes informations soient utilisées pour répondre à ma demande (voir <a href="mentions-legales.html">mentions légales</a>).</span></label>
<button class="btn btn-primary" type="submit">Envoyer ma demande</button></form></div>
<div class="rv d1"><div class="card"><h3>Coordonnées</h3>
<ul class="contact-list">
<li><b>Liliane Lapomme</b><a href="tel:+33689866484">06 89 86 64 84</a><br><a href="mailto:lilianelapomme@gmail.com">lilianelapomme@gmail.com</a></li>
<li><b>Trésorerie : Nathalie Ménakovski</b><a href="tel:+33619697959">06 19 69 79 59</a></li></ul>
<h3 style="margin-top:1.5rem">Où nous trouver</h3><div class="map-links" id="map-links"></div>
<p class="placeholder" style="margin-top:1rem">Adresse postale du siège : à compléter.</p></div></div></div></section>'''
write("nous-rejoindre.html", page("nous-rejoindre.html","Nous rejoindre / Contact — Toum Porte Océane",
 "Contactez Toum Porte Océane pour une séance d'essai de Taichi Chuan à Niort, Châtelaillon-Plage ou Vaubalier.", contact,
 ("Nous rejoindre","Venez essayer","Une séance pour découvrir, sans engagement."), "img/groupe-parc.jpg"))

# ---------------- MENTIONS ----------------
ment = '''<section class="legal"><div class="narrow">
<p class="note">Les informations marquées « à compléter » sont des textes d'attente à confirmer par l'association.</p>
<h2>Éditeur du site</h2><p>Association Toum Porte Océane (association déclarée, Taichi Chuan), Niort.<br>
Siège social : <span class="placeholder">à compléter</span><br>N° RNA / SIRET : <span class="placeholder">à compléter</span><br>
Directeur de la publication : <span class="placeholder">à compléter</span><br>
Contact : Liliane Lapomme, 06 89 86 64 84, <a href="mailto:lilianelapomme@gmail.com">lilianelapomme@gmail.com</a></p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2><p>Le formulaire de contact collecte nom, courriel, téléphone (facultatif) et message, uniquement pour répondre à votre demande. Ils sont traités via Netlify Forms et ne sont pas cédés. Vous pouvez demander leur accès, rectification ou suppression en écrivant à l'adresse de contact ci-dessus. Ce site n'utilise pas de cookies de suivi publicitaire.</p>
<h2>Images</h2><p>Les photographies du site proviennent de la brochure de l'association. Les adhérents peuvent refuser l'utilisation de leur image sur le bulletin d'inscription. Pour demander le retrait d'une photo, contactez l'association.</p>
<h2>Santé</h2><p>Le Taichi Chuan est présenté comme discipline de bien-être et de souplesse ; il ne remplace pas un avis médical.</p>
<h2>Liens externes</h2><p>L'association n'est pas responsable du contenu des sites vers lesquels pointent les liens (toum.asso.fr, tungkaiying.com, ffaemc.fr, cartes en ligne).</p>
</div></section>'''
write("mentions-legales.html", page("mentions-legales.html","Mentions légales — Toum Porte Océane",
 "Mentions légales du site de l'association Toum Porte Océane.", ment,
 ("Informations","Mentions légales","Éditeur, hébergement et données personnelles."), "img/hero.jpg"))

# 404 + netlify.toml
write("404.html", page("404.html","Page introuvable — Toum Porte Océane","Page introuvable.",
 '<section style="padding-top:10rem"><div class="narrow center"><h1>Page introuvable</h1><p class="lead">Cette page n\'existe pas.</p><a class="btn btn-primary" href="index.html">Retour à l\'accueil</a></div></section>'))
print("ok")
