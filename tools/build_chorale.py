#!/usr/bin/env python3
"""Génère les pages HTML du site de la chorale (en-tête, pied de page et menu communs).
Usage : python3 tools/build_chorale.py   → écrit les .html dans chorale/
Les contenus qui changent (concerts, répertoire, actualités, galerie, coordonnées) sont dans chorale/data/*.json."""
import json, math, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "chorale"
S = json.loads((ROOT / "data/site.json").read_text(encoding="utf8"))
e = html.escape
C, R = S["contact"], S["repetition"]
TEL = C["telephone"]; TEL_HREF = "+33" + TEL.replace(" ", "")[1:]
YEARS = 2026 - S["fondation"]

MENU = [("index.html", "Accueil"), ("la-chorale.html", "La chorale"), ("repertoire.html", "Répertoire"),
        ("concerts.html", "Concerts"), ("repetitions.html", "Répétitions"), ("galerie.html", "Galerie"),
        ("actualites.html", "Actualités"), ("rejoindre.html", "Nous rejoindre")]

def wave(base, amp, k, phase, fill, opacity=1):
    pts = []
    for x in range(0, 2401, 20):
        y = base + amp * math.sin(2 * math.pi * k * x / 1200 + phase) + amp * .35 * math.sin(2 * math.pi * 2 * k * x / 1200 + phase * 2)
        pts.append(f"{x},{y:.1f}")
    d = "M0,200 L" + " L".join(pts) + " L2400,200 Z"
    return f'<svg viewBox="0 0 2400 200" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="{d}" style="fill:{fill};opacity:{opacity}"/></svg>'

def waves(bottom="var(--cream)"):
    return ('<div class="waves">' + wave(110, 26, 1, 0, "rgba(255,255,255,.22)") + wave(135, 22, 2, 1.7, "var(--coral)", .55) +
            wave(160, 18, 1, 3.1, bottom) + '</div>')

def header(cur):
    items = "".join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == cur else ""}>{t}</a></li>' for h, t in MENU)
    items += f'<li class="only-m"><a href="mentions-legales.html"{" aria-current=\"page\"" if cur == "mentions-legales.html" else ""}>Mentions légales</a></li>'
    return f'''<a class="skip" href="#main">Aller au contenu</a>
<header class="hdr"{' data-solid="1"' if cur in ("mentions-legales.html",) else ''}><div class="wrap">
<a class="brand" href="index.html" aria-label="À Chœur Ouvert — accueil"><img src="assets/img/logo-small.png" alt="" width="46" height="31"><span>À Chœur Ouvert<small>Chorale polyphonique</small></span></a>
<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span></button>
<nav class="nav" id="menu" aria-label="Navigation principale"><ul>{items}</ul></nav>
</div></header>'''

def footer():
    r = S["reseaux"]
    links = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in MENU)
    return f'''<footer class="ftr"><div class="wrap">
<div class="ftr-grid">
<div><a class="brand" href="index.html"><img src="assets/img/logo-small.png" alt="" width="46" height="31"><span>À Chœur Ouvert<small>Chorale polyphonique</small></span></a>
<p class="slogan">{e(S["slogan"])}</p>
<div class="social"><a href="{r["youtube"]}" target="_blank" rel="noopener">▶ YouTube</a><a href="{r["facebook"]}" target="_blank" rel="noopener">f Facebook</a></div></div>
<div><h4>Contact</h4><ul><li>{e(C["nom"])} · {e(C["role"])}</li><li><a href="tel:{TEL_HREF}">{TEL}</a></li><li><a href="mailto:{C["email"]}">{C["email"]}</a></li><li>{e(S["adresseContact"])}</li></ul></div>
<div><h4>Répétitions</h4><ul><li>{R["jour"]}, {R["horaire"]}</li><li>{R["lieu"]}</li><li>{e(R["adresse"])}</li><li><a href="rejoindre.html">{R["essaisGratuits"]} séances d’essai offertes</a></li></ul></div>
<div><h4>Le site</h4><ul>{links}<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
</div>
<div class="ftr-bot"><span>© {2026} {e(S["nom"])} — association loi 1901</span><a href="mentions-legales.html">Mentions légales</a></div>
</div></footer>
<div class="lb" role="dialog" aria-modal="true" aria-label="Photo agrandie"><button class="x" aria-label="Fermer">×</button><button class="pv" aria-label="Précédente">‹</button><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><p></p><button class="nx" aria-label="Suivante">›</button></div>'''

def page(fn, title, desc, body, hero=None, og="assets/img/hero-eglise.jpg", extra_head="", noindex=False):
    cur = fn
    head = f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#d4312e">{'<meta name="robots" content="noindex">' if noindex else ''}
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:image" content="{og}">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">{extra_head}</head>
<body data-page="{fn}">
'''
    return head + header(cur) + "\n<main id=\"main\">\n" + (hero or "") + body + "\n</main>\n" + footer() + '\n<script src="assets/js/main.js" defer></script>\n</body></html>\n'

def phero(eyebrow, h1, lead, img):
    return f'''<div class="phero"><img class="hero-bg" src="{img}" alt="" fetchpriority="high"><div class="notes" aria-hidden="true"></div>
<div class="wrap hero-in"><span class="eyebrow">{eyebrow}</span><h1>{h1}</h1><p>{lead}</p></div>{waves()}</div>'''

def cta_join(title="Et si vous chantiez avec nous ?"):
    return f'''<section><div class="wrap"><div class="band rv"><span class="heart" aria-hidden="true">♥</span>
<h2>{title}</h2><p>Venez essayer sans engagement : {R["essaisGratuits"]} séances gratuites avant de vous inscrire. Aucune connaissance du solfège n’est nécessaire.</p>
<div class="btns" style="justify-content:center"><a class="btn btn-ghost" href="rejoindre.html">Venir essayer</a><a class="btn btn-ghost" href="tel:{TEL_HREF}">Appeler {e(C["nom"].split()[0])} · {TEL}</a></div></div></div></section>'''

PAGES = {}

# ---------------- Accueil ----------------
PAGES["index.html"] = page("index.html",
 "Chorale polyphonique À Chœur Ouvert — Notre-Dame-de-Monts, Saint-Jean-de-Monts, Saint-Hilaire-de-Riez",
 "Chorale polyphonique ouverte à tous en Vendée : concerts, répétitions du mercredi, séances d’essai gratuites. Venez chanter à cœur ouvert.",
 f'''
<section class="next" style="padding:0"><div class="wrap"><div class="next-card rv" data-next>
<div class="next-info"><span class="tag heart">Prochain concert</span><h2 data-next-title style="margin-top:.5em">Prochain concert : date à confirmer</h2>
<div class="next-meta" data-next-meta></div><p data-next-text style="color:var(--ink-2)"></p>
<div class="btns"><a class="btn btn-heart" href="concerts.html">Tous les concerts</a><a class="btn btn-line" href="rejoindre.html#contact">Être prévenu</a></div></div>
<div class="next-count"><div data-countdown hidden><div class="count-label">Ouverture du rideau dans</div><div class="count" aria-live="off"><div><b>00</b><small>jours</small></div><div><b>00</b><small>heures</small></div><div><b>00</b><small>min</small></div><div><b>00</b><small>sec</small></div></div></div>
<div class="pending" data-pending><div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>La prochaine date arrive bientôt.<br>Suivez-nous pour ne rien manquer.</p></div></div>
</div></div></section>

<section><div class="wrap split">
<div class="rv"><span class="eyebrow">La chorale</span><h2>Chanter ensemble, <em style="color:var(--heart)">à cœur ouvert</em></h2>
<p>À Chœur Ouvert est une chorale polyphonique née en {S["fondation"]}, installée entre Saint-Hilaire-de-Riez et Saint-Jean-de-Monts, et qui chante aussi à Notre-Dame-de-Monts. Son but : « vulgariser le chant choral » et le faire vivre à tous ceux qui en ont envie.</p>
<ul class="ticks"><li>Pas besoin de savoir lire la musique : le solfège n’est pas indispensable</li><li>{R["essaisGratuits"]} séances d’essai gratuites avant de s’engager</li><li>Des concerts en églises, souvent au profit d’associations</li></ul>
<a class="btn btn-sea" href="la-chorale.html">Découvrir la chorale</a></div>
<div class="photo arch rv d1"><img src="assets/img/choristes-echarpes.jpg" alt="Les choristes en écharpes rouges, regroupés pour la photo" loading="lazy" width="1055" height="417" style="aspect-ratio:4/5;object-position:40% center"></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Explorer</span><h2>Tout pour écouter, venir et chanter</h2></div>
<div class="grid g3">
<a class="tile rv" href="repertoire.html"><img src="assets/img/concert-nef.jpg" alt="" loading="lazy"><div><h3>Répertoire &amp; écoute</h3><p>Sacré, chanson, musiques du monde. Écoutez des extraits.</p><span class="arrow">Écouter →</span></div></a>
<a class="tile rv d1" href="concerts.html"><img src="assets/img/parvis-1.jpg" alt="" loading="lazy"><div><h3>Concerts &amp; agenda</h3><p>Les prochains rendez-vous et les concerts passés.</p><span class="arrow">Voir l’agenda →</span></div></a>
<a class="tile rv d2" href="repetitions.html"><img src="assets/img/cheffe.jpg" alt="" loading="lazy" style="object-position:center 30%"><div><h3>Répétitions</h3><p>{R["jour"]} soir, {R["horaire"]}. Venez essayer.</p><span class="arrow">Les horaires →</span></div></a>
<a class="tile rv" href="galerie.html"><img src="assets/img/public.jpg" alt="" loading="lazy"><div><h3>Galerie</h3><p>Photos et affiches, classées par concert.</p><span class="arrow">Voir les photos →</span></div></a>
<a class="tile rv d1" href="actualites.html"><img src="assets/img/presse-oct-2022.jpg" alt="" loading="lazy"><div><h3>Actualités</h3><p>Les dernières nouvelles de la chorale.</p><span class="arrow">Lire →</span></div></a>
<a class="tile rv d2" href="rejoindre.html"><img src="assets/img/concert-2023-c.jpg" alt="" loading="lazy"><div><h3>Nous rejoindre</h3><p>Séances d’essai offertes, sans solfège.</p><span class="arrow">S’inscrire →</span></div></a>
</div></div></section>

<section class="sea"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">En quelques chiffres</span><h2>Une chorale qui a de la voix</h2></div>
<div class="stats">
<div class="stat rv"><b data-to="{YEARS}">0</b><span>ans d’existence (depuis {S["fondation"]})</span></div>
<div class="stat rv d1"><b data-count-concerts data-to="0">0</b><span>concerts recensés sur ce site</span></div>
<div class="stat rv d2"><b data-to="{R["essaisGratuits"]}">0</b><span>séances d’essai gratuites</span></div>
<div class="stat rv d3"><b data-to="0">0</b><span>connaissance de solfège requise</span></div>
</div></div></section>

<section><div class="wrap split">
<div class="rv"><span class="eyebrow">À écouter</span><h2>Entendez la polyphonie</h2>
<p>Plusieurs voix, une seule émotion. Lancez l’<em>Agnus Dei</em> chanté par la chorale, puis découvrez tous les extraits dans la page répertoire.</p>
<a class="btn btn-heart" href="repertoire.html#ecoute">Tous les extraits</a></div>
<div class="player rv d1"><div class="screen" data-yt="{S["video"]["youtubeId"]}" role="region" aria-label="Vidéo"></div>
<div class="player-bar"><div><b>{e(S["video"]["titre"])}</b><br><small>Chaîne YouTube de la chorale</small></div><a class="btn btn-ghost" href="{S["reseaux"]["youtube"]}" target="_blank" rel="noopener">Chaîne YouTube ↗</a></div></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Actualités</span><h2>Dernières nouvelles</h2></div>
<div class="news" data-news="3"></div>
<p style="margin-top:28px"><a class="btn btn-line" href="actualites.html">Toutes les actualités</a></p></div></section>
{cta_join()}
''',
 hero=f'''<div class="hero"><img class="hero-bg" src="assets/img/hero-eglise.jpg" alt="" fetchpriority="high" width="1800" height="1200"><div class="notes" aria-hidden="true"></div>
<div class="staff" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<div class="wrap hero-in"><span class="eyebrow">Chorale polyphonique · Vendée</span>
<h1>À <em>Chœur</em> Ouvert</h1><p class="lead">Chanter, c’est mieux à plusieurs voix. Venez comme vous êtes : la porte du chœur est ouverte à tous.</p>
<div class="btns"><a class="btn btn-heart" href="rejoindre.html">Venir essayer</a><a class="btn btn-ghost" href="concerts.html">Voir les concerts</a></div></div>{waves()}</div>''')

# ---------------- La chorale ----------------
PAGES["la-chorale.html"] = page("la-chorale.html", "La chorale — À Chœur Ouvert", "Histoire, valeurs, cheffe de chœur et bureau de la chorale polyphonique À Chœur Ouvert, créée en 1999 entre Saint-Hilaire-de-Riez et Saint-Jean-de-Monts.",
 f'''
<section><div class="wrap split">
<div class="rv"><span class="eyebrow">Présentation</span><h2>Une chorale polyphonique ouverte à tous</h2>
<p>La Chorale polyphonique À Chœur Ouvert (A.C.O.) est une association dont le but est de <strong>vulgariser le chant choral</strong>. Elle a été créée en {S["fondation"]} et réunit des choristes de Saint-Hilaire-de-Riez, de Saint-Jean-de-Monts et des environs.</p>
<p>Polyphonique : chacun chante sa ligne, et c’est l’ensemble des voix qui fait la musique. Ici, on vient pour le plaisir de chanter, d’apprendre et de partager avec le public lors de concerts, souvent au profit d’associations.</p></div>
<div class="photo rv d1"><img src="assets/img/concert-choeur.jpg" alt="Les choristes en concert sous la direction de la cheffe" loading="lazy" width="1400" height="788"></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Histoire</span><h2>Plus de vingt-cinq ans de chant</h2></div>
<ol class="steps">
<li class="rv"><div><h3>{S["fondation"]} · La naissance du chœur</h3><p>La chorale est créée à Saint-Hilaire-de-Riez, avec l’envie de rendre le chant choral accessible.</p></div></li>
<li class="rv"><div><h3>Des concerts qui font du bien</h3><p>Au fil des saisons, la chorale chante dans les églises de la côte vendéenne, avec d’autres chorales invitées, au profit de RETINA France, de la SNSM, des Restos du Cœur, des sapeurs-pompiers…</p></div></li>
<li class="rv"><div><h3>Rentrée 2024 · Un nouveau départ</h3><p>Sophie Sebbah prend la direction du chœur. Le répertoire est entièrement renouvelé, pour le plus grand plaisir du public de Saint-Hilaire-de-Riez et de Saint-Jean-de-Monts.</p></div></li>
<li class="rv"><div><h3>31 mai 2026 · Premier concert à Notre-Dame-de-Monts</h3><p>La chorale chante pour la première fois à l’église Notre-Dame-de-l’Assomption, avec un nouveau programme.</p></div></li>
</ol></div></section>

<section><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Nos valeurs</span><h2>Ce qui nous réunit</h2></div>
<div class="grid g3">
<div class="card rv"><h3>L’ouverture</h3><p style="margin:0">Le solfège n’est pas indispensable. On entre dans le chœur avec sa voix et son envie, on progresse ensemble.</p></div>
<div class="card rv d1"><h3>Le partage</h3><p style="margin:0">« Écoutez-les, Regardez-les, Vivez-les. » Chanter pour soi, mais surtout avec les autres et pour le public.</p></div>
<div class="card rv d2"><h3>La solidarité</h3><p style="margin:0">De nombreux concerts sont donnés au profit d’associations caritatives, avec une participation libre.</p></div>
</div></div></section>

<section class="sand"><div class="wrap split">
<div class="rv"><span class="eyebrow">Le nom</span><h2>Chœur ou cœur ? Les deux.</h2>
<p>« À Chœur Ouvert » joue avec une expression bien connue : on parle à <em>cœur ouvert</em> quand on se confie sans détour. Ici, on chante à <em>chœur ouvert</em> : la chorale accueille chacun, et ouvre ses concerts à tous.</p>
<p>Le logo le dit sans mots : une clé de sol qui s’enroule autour d’un cœur rouge, et une portée qui s’envole en notes de musique.</p></div>
<div class="rv d1" style="background:var(--paper);border-radius:var(--radius);padding:28px;box-shadow:var(--shadow)"><img src="assets/img/logo-transparent.png" alt="Logo de la chorale À Chœur Ouvert : une clé de sol et un cœur rouge" width="400" height="267" loading="lazy" style="margin:auto;width:min(100%,380px)"></div>
</div></section>

<section><div class="wrap split">
<div class="photo arch rv"><img src="assets/img/cheffe.jpg" alt="Sophie Sebbah dirige la chorale" loading="lazy" width="1000" height="1000"></div>
<div class="rv d1"><span class="eyebrow">Cheffe de chœur</span><h2>Sophie Sebbah</h2>
<p>De formation classique, Sophie Sebbah a étudié le piano, le chant et la musique de chambre, puis la formation musicale, l’écriture et la musicologie à la Sorbonne. Après une carrière d’artiste lyrique, elle a dirigé une école de musique associative, des chœurs et une harmonie dans l’est de la France.</p>
<p>Ouverte à toutes les cultures, elle aime emmener ses chanteurs vers des horizons inconnus : classique, pop, chanson contemporaine ou musiques du monde, « du moment que ce soit bien écrit et que ça exprime quelque chose ». Elle se perfectionne en direction de chœur auprès de Sabine Aubert et dirige aussi les chorales « Chantons » et « La Bella Vita ».</p></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Le bureau</span><h2>Ceux qui font vivre l’association</h2></div>
<div class="team">
<div class="person rv"><b>Jean Gonnord</b><span>Co-président</span></div>
<div class="person rv d1"><b>Marie-Claire Renoncourt</b><span>Co-présidente et secrétaire</span></div>
<div class="person rv d2"><b>Odile Claveau</b><span>Trésorière</span></div>
<div class="person rv"><b>Marie Renaudat</b><span>Trésorière adjointe</span></div>
<div class="person rv d1"><b>Marie-Aimée Foeillet</b><span>Secrétaire adjointe</span></div>
</div></div></section>
{cta_join()}
''', hero=phero("La chorale", "Des voix, un cœur, une porte ouverte", "Une chorale polyphonique associative, née en 1999 sur la côte vendéenne.", "assets/img/concert-nef.jpg"))

# ---------------- Répertoire ----------------
PAGES["repertoire.html"] = page("repertoire.html", "Répertoire et écoute — À Chœur Ouvert", "Le répertoire de la chorale À Chœur Ouvert : chants sacrés, chansons, musiques du monde. Écoutez des extraits audio et vidéo.",
 f'''
<section><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Univers musical</span><h2>Du sacré à la chanson, sans frontières</h2>
<p>Depuis 2024, le répertoire a été entièrement renouvelé par Sophie Sebbah. La liste de la saison en cours est à confirmer par la chorale.</p></div>
<div class="grid g3" data-univers></div></div></section>

<section class="sea"><div class="wrap narrow" data-quote></div></section>

<section id="ecoute"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Écoute</span><h2>Le lecteur de la chorale</h2><p>Choisissez un morceau dans la liste : vidéos et enregistrements de concerts, tels que la chorale les a publiés.</p></div>
<div class="player rv" data-player>
<div class="screen" data-screen></div>
<div class="player-bar"><div><b data-ptitle></b><br><small data-pnote></small></div><a class="btn btn-ghost" href="{S["reseaux"]["youtube"]}" target="_blank" rel="noopener">Plus de vidéos ↗</a></div>
<ul class="tracks" data-tracks></ul></div></div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Morceaux travaillés</span><h2>Quelques pièces chantées récemment</h2></div>
<div class="filters" role="group" aria-label="Filtrer par univers"><button class="chip" data-filter="all" aria-pressed="true">Tout</button><button class="chip" data-filter="sacre" aria-pressed="false">Sacré</button><button class="chip" data-filter="chanson" aria-pressed="false">Chanson</button><button class="chip" data-filter="monde" aria-pressed="false">Monde</button><button class="chip" data-filter="autre" aria-pressed="false">Autres</button></div>
<ul class="grid g3" style="list-style:none;padding:0;margin:0" data-pieces></ul></div></section>
{cta_join("Envie de chanter ces morceaux ?")}
''', hero=phero("Répertoire &amp; écoute", "Plusieurs voix, mille couleurs", "Chants sacrés, chansons, musiques du monde : le répertoire s’écoute ici.", "assets/img/pupitres.jpg"))

# ---------------- Concerts ----------------
PAGES["concerts.html"] = page("concerts.html", "Concerts et agenda — À Chœur Ouvert", "Prochains concerts et archives de la chorale À Chœur Ouvert : églises de Saint-Jean-de-Monts, Notre-Dame-de-Monts, Saint-Hilaire-de-Riez. Entrée souvent libre.",
 f'''
<section><div class="wrap" data-agenda>
<div class="tabs" role="group" aria-label="Choisir la période"><button class="chip" data-tab="up" aria-pressed="true">À venir</button><button class="chip" data-tab="past" aria-pressed="false">Archives</button></div>
<div class="evlist" data-up></div><div class="evlist" data-past hidden></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head rv"><span class="eyebrow">Informations pratiques</span><h2>Venir au concert</h2></div>
<div class="grid g2" data-infos></div></div></section>
<section><div class="wrap split">
<div class="photo rv"><img src="assets/img/eglise-saint-jean.jpg" alt="Les choristes devant l’église de Saint-Jean-de-Monts" loading="lazy" width="1000" height="1212" style="max-height:560px"></div>
<div class="rv d1"><span class="eyebrow">Les lieux</span><h2>Des églises qui chantent</h2>
<ul class="ticks"><li>Église de Saint-Jean-de-Monts</li><li>Église Notre-Dame-de-l’Assomption, Notre-Dame-de-Monts</li><li>Église Saint-Hilaire, Saint-Hilaire-de-Riez</li><li>Brétignolles-sur-Mer, Givrand, Coëx, Jard-sur-Mer…</li></ul>
<p>Vous voulez inviter la chorale ? <a href="rejoindre.html#contact">Écrivez-nous</a>.</p></div>
</div></section>
{cta_join("Après le concert, pourquoi pas le chœur ?")}
''', hero=phero("Concerts &amp; agenda", "Venez nous écouter", "Prochains rendez-vous, archives et infos pratiques. Entrée souvent libre.", "assets/img/parvis-1.jpg"))

# ---------------- Répétitions ----------------
PAGES["repetitions.html"] = page("repetitions.html", "Répétitions — À Chœur Ouvert", f"Répétitions de la chorale À Chœur Ouvert : le {R['jour'].lower()} de 19h30 à 21h30, à Saint-Hilaire-de-Riez. Deux séances d’essai gratuites.",
 f'''
<section><div class="wrap split">
<div class="rv"><span class="eyebrow">Quand &amp; où</span><h2>Rendez-vous le {R["jour"].lower()} soir</h2>
<ul class="info-list">
<li><span class="ico">🗓</span><span><strong>{R["jour"]}, {R["horaire"]}</strong><br>{R["periode"].capitalize()}</span></li>
<li><span class="ico">📍</span><span><strong>{R["lieu"]}</strong><br>{e(R["adresse"])}</span></li>
<li><span class="ico">🎼</span><span><strong>Cheffe de chœur</strong><br>{S["chefDeChoeur"]}</span></li>
<li><span class="ico">🎟</span><span><strong>{R["essaisGratuits"]} séances d’essai gratuites</strong><br>Le solfège n’est pas indispensable.</span></li></ul>
<div class="btns"><a class="btn btn-heart" href="rejoindre.html">Venir essayer</a><a class="btn btn-line" href="https://www.google.com/maps/search/?api=1&amp;query=70+avenue+des+Azalées+85270+Saint-Hilaire-de-Riez" target="_blank" rel="noopener">Itinéraire ↗</a></div></div>
<div class="photo rv d1"><img src="assets/img/pupitres.jpg" alt="Les choristes réunis par pupitres" loading="lazy" width="1400" height="933"></div>
</div></section>

<section class="alt"><div class="wrap">
<div class="sec-head rv"><span class="eyebrow">Déroulé</span><h2>Une soirée de répétition</h2>
<p><span class="placeholder">Déroulé indicatif, à confirmer et à personnaliser par la chorale.</span></p></div>
<ol class="steps">
<li class="rv"><div><h3>Accueil</h3><p>On se retrouve, on s’installe par pupitre.</p></div></li>
<li class="rv"><div><h3>Échauffement</h3><p>Respiration et vocalises pour mettre la voix en route.</p></div></li>
<li class="rv"><div><h3>Travail des morceaux</h3><p>Chaque voix apprend sa ligne, puis tout le monde chante ensemble.</p></div></li>
<li class="rv"><div><h3>Tous ensemble</h3><p>On assemble les voix et on réécoute le résultat.</p></div></li>
</ol></div></section>

<section><div class="wrap split">
<div class="rv"><span class="eyebrow">Venir essayer</span><h2>Poussez la porte, on vous attend</h2>
<p>Il suffit de venir un mercredi soir, à la mairie annexe de Saint-Hilaire-de-Riez. Vous pouvez assister à <strong>deux séances gratuitement</strong> avant de vous engager. Pas besoin de savoir lire une partition.</p>
<p>Pour être accueilli(e) au mieux, prévenez-nous :  <a href="tel:{TEL_HREF}">{TEL}</a> ({e(C["nom"])}).</p></div>
<div class="map rv d1"><span class="tag sand">Plan</span><h3 style="margin-top:.6em">{R["lieu"]}</h3><p>{e(R["adresse"])}</p>
<div class="btns"><a class="btn btn-sea" href="https://www.google.com/maps/search/?api=1&amp;query=70+avenue+des+Azalées+85270+Saint-Hilaire-de-Riez" target="_blank" rel="noopener">Google Maps</a><a class="btn btn-line" href="https://www.openstreetmap.org/search?query=70%20avenue%20des%20Azal%C3%A9es%2085270%20Saint-Hilaire-de-Riez" target="_blank" rel="noopener">OpenStreetMap</a></div>
<svg viewBox="0 0 200 120" aria-hidden="true"><path d="M0 90 Q25 70 50 90 T100 90 T150 90 T200 90 V120 H0Z" fill="#1f5f7a" opacity=".35"/><path d="M0 100 Q25 80 50 100 T100 100 T150 100 T200 100 V120 H0Z" fill="#1f5f7a" opacity=".5"/></svg></div>
</div></section>
''', hero=phero("Répétitions", "Un mercredi soir pour chanter", f"{R['jour']} de 19h30 à 21h30, de septembre à juin. Deux séances d’essai offertes.", "assets/img/cheffe.jpg"))

# ---------------- Galerie ----------------
PAGES["galerie.html"] = page("galerie.html", "Galerie photos — À Chœur Ouvert", "Photos et affiches des concerts de la chorale À Chœur Ouvert, classées par saison.",
 '''<section><div class="wrap"><div class="filters" data-albums aria-label="Albums"></div><div data-gallery></div></div></section>''',
 hero=phero("Galerie", "Les concerts en images", "Photos, affiches et articles de presse, classés par saison.", "assets/img/concert-2023-a.jpg"))

# ---------------- Actualités ----------------
PAGES["actualites.html"] = page("actualites.html", "Actualités — À Chœur Ouvert", "Les dernières nouvelles de la chorale À Chœur Ouvert : concerts, rendez-vous et vie de l’association.",
 '''<section><div class="wrap"><div class="news" data-news></div></div></section>''' + cta_join(),
 hero=phero("Actualités", "La vie du chœur", "Concerts annoncés, concerts racontés, nouvelles de la chorale.", "assets/img/public.jpg"))

# ---------------- Nous rejoindre / Contact ----------------
PAGES["rejoindre.html"] = page("rejoindre.html", "Nous rejoindre et contact — À Chœur Ouvert", "Rejoindre la chorale À Chœur Ouvert : séances d’essai gratuites le mercredi, contact et formulaire. Notre-Dame-de-Monts, Saint-Jean-de-Monts, Saint-Hilaire-de-Riez.",
 f'''
<section><div class="wrap split" style="align-items:start">
<div class="rv"><span class="eyebrow">Rejoindre le chœur</span><h2>Trois pas pour chanter avec nous</h2>
<ol class="steps">
<li><div><h3>Venez un mercredi</h3><p>{R["horaire"]}, à la mairie annexe de Saint-Hilaire-de-Riez.</p></div></li>
<li><div><h3>Essayez deux fois, gratuitement</h3><p>Deux séances d’essai sans engagement pour vous faire votre idée.</p></div></li>
<li><div><h3>Inscrivez-vous</h3><p><span class="placeholder">Modalités d’inscription et montant de la cotisation : à confirmer par la chorale.</span></p></div></li></ol>
<div class="card" style="margin-top:24px"><h3>Quel niveau faut-il ?</h3><p style="margin:0">Aucune connaissance du solfège n’est requise. <span class="placeholder">Niveau vocal attendu, âge minimum et pièces à fournir : à préciser par la chorale.</span></p></div></div>
<div class="rv d1"><div class="card"><h3>Coordonnées</h3><ul class="info-list">
<li><span class="ico">📞</span><span><strong>{e(C["nom"])}</strong> · {e(C["role"])}<br><a href="tel:{TEL_HREF}">{TEL}</a></span></li>
<li><span class="ico">✉️</span><span><a href="mailto:{C["email"]}">{C["email"]}</a></span></li>
<li><span class="ico">🏠</span><span><strong>Adresse de contact</strong><br>{e(S["adresseContact"])}</span></li>
<li><span class="ico">🎤</span><span><strong>Répétitions</strong><br>{R["lieu"]}, {e(R["adresse"])}</span></li></ul>
<div class="btns"><a class="btn btn-sea" href="https://www.google.com/maps/search/?api=1&amp;query=70+avenue+des+Azalées+85270+Saint-Hilaire-de-Riez" target="_blank" rel="noopener">Plan de la salle de répétition ↗</a></div></div></div>
</div></section>

<section class="alt" id="contact"><div class="wrap narrow">
<div class="sec-head rv"><span class="eyebrow">Écrivez-nous</span><h2>Une question ? Une séance d’essai ?</h2><p>Nous répondons dès que possible.</p></div>
<form class="contact rv" name="contact" method="POST" action="/merci" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir : <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="field"><label for="nom">Votre nom</label><input id="nom" name="nom" required autocomplete="name"></div>
<div class="field"><label for="email">Votre e-mail</label><input id="email" type="email" name="email" required autocomplete="email"></div>
<div class="field"><label for="tel">Téléphone (facultatif)</label><input id="tel" type="tel" name="telephone" autocomplete="tel"></div>
<div class="field"><label for="objet">Objet</label><select id="objet" name="objet"><option value="essai">Je voudrais venir à une séance d’essai</option><option value="contact">Une question sur la chorale</option><option value="concert">Une question sur un concert</option><option value="autre">Autre demande</option></select></div>
<div class="field"><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
<label class="rgpd" style="font-weight:400"><input type="checkbox" name="consentement" required style="width:auto;margin-right:.5em">J’accepte que mes informations servent uniquement à me répondre. Voir les <a href="mentions-legales.html#donnees">mentions légales</a>.</label>
<button class="btn btn-heart" type="submit" style="justify-self:start">Envoyer le message</button></form>
<div class="form-ok" tabindex="-1" role="status"><strong>Merci !</strong> Votre message est bien parti. Nous vous répondons très vite.</div></div></section>
''', hero=phero("Nous rejoindre &amp; contact", "Rejoignez le chœur", "Deux séances d’essai gratuites, une cheffe passionnée et beaucoup de bonne humeur. Appelez, écrivez, venez.", "assets/img/concert-2023-c.jpg"))

# ---------------- Mentions légales ----------------
PAGES["mentions-legales.html"] = page("mentions-legales.html", "Mentions légales — À Chœur Ouvert", "Mentions légales du site de la chorale polyphonique À Chœur Ouvert.",
 f'''<section style="padding-top:calc(var(--hdr) + 40px)"><div class="wrap narrow legal">
<h1 style="font-size:clamp(2rem,5vw,3rem)">Mentions légales</h1>
<h2>Éditeur du site</h2><p>{e(S["nom"])}, association loi 1901.<br>SIRET : {S["siret"]}<br>Adresse de contact : {e(S["adresseContact"])}<br>Salle de répétition : {R["lieu"]}, {e(R["adresse"])}<br>Téléphone : {TEL} · E-mail : <a href="mailto:{C["email"]}">{C["email"]}</a></p>
<p><span class="placeholder">Numéro RNA et date de déclaration en préfecture : à compléter.</span></p>
<h2>Directeur de la publication</h2><p>{e(C["nom"])}, co-président de l’association.</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener">netlify.com</a>.</p>
<h2 id="donnees">Données personnelles</h2><p>Le formulaire de contact recueille votre nom, votre e-mail, éventuellement votre téléphone et votre message, uniquement pour vous répondre. Ces données sont traitées par la chorale et hébergées par Netlify ; elles ne sont ni vendues ni utilisées à d’autres fins. Vous pouvez demander leur consultation ou leur suppression en écrivant à <a href="mailto:{C["email"]}">{C["email"]}</a>. Le site n’utilise pas de cookies publicitaires ni d’outil de mesure d’audience.</p>
<p>Les vidéos YouTube ne se chargent qu’au clic, via le mode « confidentialité renforcée » (youtube-nocookie.com). Les enregistrements audio sont hébergés sur Google Drive.</p>
<h2>Propriété intellectuelle</h2><p>Le logo, les photos, les affiches et les enregistrements appartiennent à la chorale ou à leurs auteurs. Les coupures de presse (Ouest-France) sont reproduites à titre d’information. Toute autre reproduction nécessite l’accord de la chorale.</p>
<h2>Crédits</h2><p>Textes et informations issus du site existant de la chorale et de la presse locale (Ouest-France, Nov Ma Radio, office de tourisme du Pays de Saint-Jean-de-Monts, ville de Saint-Hilaire-de-Riez).</p>
</div></section>''', noindex=False)

PAGES["merci.html"] = page("merci.html", "Merci — À Chœur Ouvert", "Votre message a bien été envoyé.",
 '''<section style="padding-top:calc(var(--hdr) + 80px);min-height:70svh"><div class="wrap narrow" style="text-align:center"><div class="eq" style="margin:0 auto 24px;color:var(--heart)" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><h1 style="font-size:clamp(2rem,6vw,3.4rem)">Merci !</h1><p>Votre message est bien parti. Nous vous répondons très vite.</p><a class="btn btn-heart" href="index.html">Retour à l’accueil</a></div></section>''', noindex=True)

PAGES["404.html"] = page("404.html", "Page introuvable — À Chœur Ouvert", "Cette page n’existe pas.",
 '''<section style="padding-top:calc(var(--hdr) + 80px);min-height:70svh"><div class="wrap narrow" style="text-align:center"><h1 style="font-size:clamp(2rem,6vw,3.4rem)">Fausse note…</h1><p>Cette page n’existe pas (ou plus). Revenez à l’accueil pour reprendre en chœur.</p><a class="btn btn-heart" href="/index.html">Retour à l’accueil</a></div></section>''', noindex=True)

for fn, content in PAGES.items():
    content = content.replace('', '')
    (ROOT / fn).write_text(content, encoding="utf8")
print("pages écrites :", ", ".join(PAGES))
