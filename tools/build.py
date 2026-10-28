#!/usr/bin/env python3
"""Génère les pages HTML du site (en-tête, menu et pied de page communs).
Usage : python3 tools/build.py
Les contenus (auteurs, galerie, films, événements, actualités, coordonnées) vivent dans site/data/*.json :
ils se modifient sans toucher à ce script."""
import json, math, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site"
D = lambda n: json.load(open(ROOT / "data" / f"{n}.json", encoding="utf-8"))
club, gal = D("club"), D("gallery")
P = gal["photos"]
heroes = [p for p in P if p.get("hero")]
e = html.escape

NAV = [
    ("index.html", "Accueil", "home"),
    ("le-club.html", "Le club", "club"),
    ("activites.html", "Activités", "activites"),
    ("galerie.html", "Galerie", "galerie"),
    ("films-videos.html", "Films & vidéos", "films"),
    ("expositions-evenements.html", "Expos & événements", "expos"),
    ("actualites.html", "Actualités", "actus"),
    ("nous-rejoindre.html", "Nous rejoindre", "contact"),
]


def iris(cls=""):
    cx = cy = 24
    r_out, r_in = 21, 8.5
    paths = []
    for k in range(6):
        a = math.radians(-90 + 60 * k)
        b = math.radians(-90 + 60 * k + 52)
        x1, y1 = cx + r_in * math.cos(a), cy + r_in * math.sin(a)
        x2, y2 = cx + r_out * math.cos(b), cy + r_out * math.sin(b)
        paths.append(f"M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}")
    hexa = "M" + "L".join(
        f"{cx + r_in * math.cos(math.radians(-90 + 60 * k)):.1f} {cy + r_in * math.sin(math.radians(-90 + 60 * k)):.1f}" for k in range(6)) + "Z"
    return (f'<svg class="{cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="21"/>'
            f'<path d="{hexa}"/><path d="{" ".join(paths)}"/></svg>')


def header(active):
    items = []
    for href, label, key in NAV:
        cur = ' aria-current="page"' if key == active else ""
        cls = ' class="cta"' if key == "contact" else ""
        items.append(f'<li{cls}><a href="{href}"{cur}>{e(label)}</a></li>')
    cur = ' aria-current="page"' if active == "legal" else ""
    items.append(f'<li class="only-mobile"><a href="mentions-legales.html"{cur}>Mentions légales</a></li>')
    return f'''<a class="skip" href="#main">Aller au contenu</a>
<header class="site-header"><div class="wrap">
<a class="brand" href="index.html" aria-label="Photo Ciné Club Sénonais — accueil">{iris()}<span><b>Photo Ciné Club Sénonais</b><small>Sens · Yonne</small></span></a>
<button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu"><span></span></button>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>{"".join(items)}</ul></nav>
</div></header>'''


def footer():
    a = club["adresse"]
    links = "".join(f'<li><a href="{h}">{e(l)}</a></li>' for h, l, _ in NAV)
    L = club["liens"]
    return f'''<footer class="site-footer"><div class="wrap">
<div class="fgrid">
<div><a class="brand" href="index.html">{iris()}<span><b>Photo Ciné Club Sénonais</b><small>Sens · Yonne</small></span></a>
<p class="muted" style="margin-top:1.2rem;max-width:22rem">{e(club["accroche"])}. Photographier, projeter, partager.</p></div>
<div><h4>Coordonnées</h4><address>{e(club["nom"])}<br>{e(a["ligne1"])}<br>{e(a["ligne2"])}<br>{e(a["cp"])} {e(a["ville"])}<br>
<a href="tel:+33{club["telephone"].replace(" ", "")[1:]}">{e(club["telephone"])}</a> <span class="muted">({e(club["telephone_note"])})</span><br>
<a href="mailto:{club["email"]}">{club["email"]}</a></address></div>
<div><h4>Le club en ligne</h4><ul>
<li><a href="{L["blog"]}" target="_blank" rel="noopener">Le blog du club ↗</a></li>
<li><a href="{L["galerie"]}" target="_blank" rel="noopener">Toutes les galeries photo ↗</a></li>
<li><a href="{L["newsletter"]}" target="_blank" rel="noopener">Lettre d'information ↗</a></li>
<li><a href="{L["fpf"]}" target="_blank" rel="noopener">Fédération Photographique de France ↗</a></li></ul></div>
<div><h4>Le site</h4><ul>{links}<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
</div>
<div class="legal"><span>© Photo Ciné Club Sénonais. Toutes les photographies restent la propriété de leurs auteurs.</span><a href="mentions-legales.html">Mentions légales &amp; droits d'auteur</a></div>
</div></footer>'''


def head(title, desc, extra=""):
    full = f"{title} — Photo Ciné Club Sénonais" if title != "Photo Ciné Club Sénonais" else "Photo Ciné Club Sénonais — le club photo de Sens (Yonne)"
    return f'''<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(full)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#0b0b0d">
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:site_name" content="Photo Ciné Club Sénonais">
<meta property="og:title" content="{e(full)}"><meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{heroes[0]["file"]}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/Jost-300-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/CormorantGaramond-300-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css"><link rel="stylesheet" href="css/style.css">{extra}
</head>'''


def page_head(idx, kicker, title, intro, crumb):
    h = heroes[idx]
    return f'''<section class="page-head"><img class="bg" src="{h["file"]}" alt="" fetchpriority="high">
<span class="credit">Photo : {e(h["author"])}</span>
<div class="wrap"><div class="crumbs"><a href="index.html">Accueil</a> / {e(crumb)}</div>
<div class="kicker">{e(kicker)}</div><h1>{title}</h1><p class="lead" style="margin:0">{intro}</p></div></section>'''


def shell(fname, key, title, desc, body, extra_head=""):
    s = (head(title, desc, extra_head) + f'\n<body data-page="{key}">\n' + header(key) +
         f'\n<main id="main">\n{body}\n</main>\n' + footer() +
         '\n<noscript><div class="noscript">Certaines sections (galerie, agenda) nécessitent JavaScript.</div></noscript>\n<script src="js/app.js" defer></script>\n</body></html>\n')
    (ROOT / fname).write_text(s, encoding="utf-8")
    print("écrit", fname)


STRIP = '<div class="strip" aria-hidden="true"></div>'
TODO = lambda t: f'<div class="todo">{t}</div>'
tel = f'<a href="tel:+33{club["telephone"].replace(" ", "")[1:]}">{e(club["telephone"])}</a>'
a = club["adresse"]
addr_line = f'{a["ligne1"]}, {a["ligne2"].replace("Entrée ", "entrée ")}, {a["cp"]} {a["ville"]}'

# ---------------------------------------------------------------- ACCUEIL
slides = []
dots = []
for i, h in enumerate(heroes):
    src = f'src="{h["file"]}" fetchpriority="high"' if i == 0 else f'data-src="{h["file"]}"'
    slides.append(f'<div class="slide{" on" if i == 0 else ""}" data-credit="Photo : {e(h["author"])} — {e(h["title"])}"><img {src} alt="{e(h["alt"])}"></div>')
    dots.append(f'<button aria-label="Photo {i + 1}"{" class=on" if i == 0 else ""}></button>')
sens = [p for p in P if p["theme"] == "sens"]
sens_pick = [next(p for p in sens if k in p["title"]) for k in ("Rose du concert", "Tour sud", "brouillard")]

home = f'''<section class="hero" aria-roledescription="diaporama" aria-label="Photographies des membres du club">
{"".join(slides)}
<div class="hero-body"><div class="wrap"><div class="kicker">Le club photo de Sens et du Sénonais</div>
<h1>Photo <em>Ciné</em><br>Club Sénonais</h1>
<p class="lead">Photographier, projeter, partager. Réunions mensuelles, six à sept expositions par an et des milliers de photos à découvrir.</p>
<div class="btns"><a class="btn primary" href="galerie.html">Découvrir la galerie</a><a class="btn" href="nous-rejoindre.html">Rejoindre le club</a></div></div></div>
<div class="dots" role="group" aria-label="Choisir une photo">{"".join(dots)}</div>
<div class="hero-credit"></div><span class="scroll-cue" aria-hidden="true"></span>
<div class="lbx bot"><span>Cadre 2,39 : 1</span><span id="frameno">01 / {len(heroes):02d}</span></div>
</section>
<section class="section" style="padding-bottom:0"><div class="wrap"><div class="kicker rv">Prochains rendez-vous</div>
<div class="rdv rv" id="rdv"><article><div><h3>Chargement…</h3></div></article></div>
<p id="data-error" class="todo" hidden>Les données n'ont pas pu être chargées. Rechargez la page.</p></div></section>
<section class="section"><div class="wrap split">
<div class="rv"><div class="kicker">Le club</div><h2>Un regard, une soirée, une exposition à la fois</h2>
<p class="lead">Le Photo Ciné Club Sénonais réunit à Sens des passionnés de photographie, débutants ou confirmés. On y apprend, on y montre ses images, on y discute composition autour d'un écran et d'un vidéoprojecteur.</p>
<p>Chaque mois, les membres présentent leurs « photos du mois ». Chaque année, le club crée, organise et gère lui-même six à sept expositions, dont l'exposition d'automne à la mezzanine du marché de Sens.</p>
<div class="btns"><a class="btn" href="le-club.html">Découvrir le club</a><a class="btn" href="activites.html">Nos activités</a></div></div>
<figure class="frame poster-frame rv d1"><a href="expositions-evenements.html"><img src="img/affiche-automne-2026.jpg" alt="Affiche de l'exposition d'automne 2026 du club, à la mezzanine du marché de Sens" width="600" height="900" loading="lazy"></a><figcaption>Affiche de l'exposition d'automne 2026 — photo : Éric Reneau</figcaption></figure>
</div></section>
{STRIP}
<section class="section alt" style="padding-bottom:clamp(40px,6vw,80px)"><div class="wrap" style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:1rem"><div class="rv"><div class="kicker">Derniers travaux</div><h2 style="margin:0">Les photos du mois</h2></div><a class="btn rv" href="galerie.html?theme=pdm">Toute la galerie</a></div>
<div class="works" id="works" style="margin-top:2rem" aria-label="Dernières photos des membres"></div>
<p class="wrap muted" style="font-size:.85rem;margin-top:.6rem">Chaque photo est créditée à son auteur. Faites défiler, puis cliquez pour agrandir.</p></section>
<section class="section"><div class="wrap"><div class="counters" id="counters"></div></div></section>
{STRIP}
<section class="section"><div class="wrap split"><div class="rv"><div class="kicker">Sens, ville de lumière</div><h2>La cathédrale Saint-Étienne, les quais de l'Yonne, la mezzanine du marché…</h2>
<p class="lead">Le club puise une partie de son inspiration dans son territoire : la première cathédrale gothique, ses vitraux, les rues du centre, la campagne du Sénonais.</p></div>
<div class="grid g3 rv d1" style="grid-template-columns:repeat(3,1fr);gap:8px">{"".join(f'<figure class="frame" style="padding:4px;margin:0"><img src="{p["thumb"]}" alt="{e(p["alt"])}" loading="lazy" style="aspect-ratio:3/4;object-fit:cover"><figcaption>© {e(p["author"])}</figcaption></figure>' for p in sens_pick)}</div></div></section>
<section class="section alt" style="text-align:center"><div class="wrap rv"><div class="kicker" style="justify-content:center">Rejoindre le club</div>
<h2>Venez voir comment le club travaille</h2>
<p class="lead" style="margin-inline:auto">Réunion le dernier mercredi du mois à 20 h, permanence le samedi de 11 h à 12 h. Écrivez-nous ou passez nous voir : on vous explique tout.</p>
<div class="btns" style="justify-content:center"><a class="btn primary" href="nous-rejoindre.html">Adhésion & séance d'essai</a><a class="btn" href="mailto:{club["email"]}">{club["email"]}</a></div></div></section>'''
ld = json.dumps({"@context": "https://schema.org", "@type": "Organization", "name": club["nom"], "email": club["email"],
                 "telephone": club["telephone"], "address": {"@type": "PostalAddress", "streetAddress": "Espace Saint Savinien, 3 place Étienne Dolet", "postalCode": a["cp"], "addressLocality": a["ville"], "addressCountry": "FR"}}, ensure_ascii=False)
shell("index.html", "home", "Photo Ciné Club Sénonais",
      "Photo Ciné Club Sénonais, le club photo de Sens (Yonne) : réunions mensuelles, expositions, concours, stages et sorties. Découvrez le travail des membres.",
      home, f'<script type="application/ld+json">{ld}</script>')

# ---------------------------------------------------------------- LE CLUB
club_body = f'''{page_head(3, "Le club", "Un club photo vivant,<br>au cœur de Sens", "Réunions, expositions, stages et concours : le Photo Ciné Club Sénonais anime la photographie dans le Sénonais.", "Le club")}
<section class="section"><div class="wrap split"><div class="rv"><div class="kicker">Présentation</div><h2>Apprendre, montrer, partager</h2>
<p class="lead">Le Photo Ciné Club Sénonais est le photo club de Sens, dans l'Yonne. Il rassemble des photographes de tous niveaux autour d'un même plaisir : faire de belles images, et les regarder ensemble.</p>
<p>Le club est adhérent à la Fédération Photographique de France (Union Régionale 24 — Bourgogne, club n° 1775). Il participe ainsi aux concours régionaux et nationaux, et ses membres bénéficient des formations proposées par la fédération.</p>
<p>Son blog, sa galerie en ligne et sa lettre d'information permettent de suivre toute son actualité, des expositions aux photos du mois.</p></div>
<div class="rv d1"><ul class="timeline"><li><b>Repères</b><span class="muted">Quelques dates tirées du blog et de la galerie du club</span></li>
<li><b>2011</b>Ouverture du blog du club : actualités, expositions et travaux des membres.</li>
<li><b>2012 – 2014</b>Trois éditions du concours photo. Les photos primées en 2014 sont exposées à l'Hôtel de Ville de Sens.</li>
<li><b>2023</b>Exposition « La Musique » : plus de 160 photos réunies dans la galerie du club.</li>
<li><b>2025</b>Exposition de printemps, marché aux plantes, « Juste après la pluie » à la Maison Jean-Cousin, exposition d'automne : 25 exposants, 260 photos.</li>
<li><b>2026</b>Street art et photo de rue, exposition d'automne (20 exposants, 230 photos), puis « Ma photo préférée ».</li></ul>
{TODO("Année de fondation et histoire complète du club à compléter par ses membres.")}</div></div></section>
{STRIP}
<section class="section alt"><div class="wrap"><div class="kicker rv">Nos valeurs</div><h2 class="rv">Ce qui nous rassemble</h2>
<div class="grid g3">
<div class="card rv"><span class="num">01</span><h3>Apprendre ensemble</h3><p class="muted" style="margin:0">Initiation à la prise de vue, labo numérique, réunions d'analyse d'image : chacun progresse à son rythme.</p></div>
<div class="card rv d1"><span class="num">02</span><h3>Montrer son travail</h3><p class="muted" style="margin:0">Six à sept expositions par an, créées, organisées et gérées par le club lui-même.</p></div>
<div class="card rv d2"><span class="num">03</span><h3>Partager et échanger</h3><p class="muted" style="margin:0">Photos du mois, conseils techniques, nouveautés : une réunion mensuelle pour se retrouver.</p></div>
<div class="card rv d3"><span class="num">04</span><h3>S'ouvrir aux autres</h3><p class="muted" style="margin:0">Concours, expositions communes avec les clubs de Paron et de Joigny, liens avec la Fédération Photographique de France.</p></div>
</div></div></section>
<section class="section"><div class="wrap"><div class="kicker rv">Le bureau</div><h2 class="rv">Ceux qui font tourner le club</h2>
<div class="grid g3" id="bureau"></div><p class="muted" id="bureau-note" style="margin-top:1.2rem;font-size:.9rem"></p></div></section>
{STRIP}
<section class="section alt" id="auteurs-section"><div class="wrap"><div class="kicker rv">Nos auteurs</div><h2 class="rv">Une vingtaine de regards</h2>
<p class="lead rv">Chaque membre a son univers : oiseaux et paysages, street photography, macro, cathédrale et vitraux, voyages… Découvrez-les, puis plongez dans leurs galeries.</p>
<div class="authors" id="auteurs" style="margin-top:2.4rem"></div>
<p id="data-error" class="todo" hidden>Les données n'ont pas pu être chargées. Rechargez la page.</p>
<p class="muted" style="margin-top:1.5rem;font-size:.88rem">Les portraits et présentations s'ajoutent dans <code>data/authors.json</code>, avec l'accord de chaque auteur. Les photos sont créditées à leur auteur.</p></div></section>'''
shell("le-club.html", "club", "Le club",
      "Présentation du Photo Ciné Club Sénonais : valeurs, repères, bureau et auteurs du club photo de Sens (Yonne).", club_body)

# ---------------------------------------------------------------- ACTIVITES
def act(n, t, txt):
    return f'<div class="card rv"><span class="num">{n}</span><h3>{t}</h3><p class="muted" style="margin:0">{txt}</p></div>'

act_body = f'''{page_head(1, "Activités", "Se former, sortir,<br>projeter, exposer", "Une saison riche et variée pour progresser en photographie, du premier déclenchement à l'exposition.", "Activités")}
<section class="section"><div class="wrap"><div class="grid g3">
{act("01", "Initiation et formation", "Initiation théorique et pratique à la prise de vue : prise en main du matériel, bases de la photo, techniques avancées, labo numérique.")}
{act("02", "Soirées d'analyse d'image", "Réunions d'analyse d'image pour travailler la composition et regarder les photos autrement.")}
{act("03", "Réunion mensuelle", "Le dernier mercredi du mois à 20 h : photos des membres, conseils techniques et nouveautés.")}
{act("04", "Sorties et stages", "Sorties et stages à thèmes, techniques ou artistiques, théoriques ou pratiques.")}
{act("05", "Projections et diaporamas", "Montage de diaporamas numériques, avec ordinateur et vidéoprojecteur mis à disposition par le club.")}
{act("06", "Initiation studio", "Séances d'initiation en studio avec le matériel adéquat : flashes, boîte à lumière, fonds.")}
{act("07", "Expositions", "Six à sept expositions par an, créées, organisées et gérées par le club, à Sens et dans le Sénonais.")}
{act("08", "Concours", "Participation possible aux concours régionaux et nationaux, le club étant adhérent à la Fédération Photographique de France.")}
<div class="card rv"><span class="num">09</span><h3>Cinéma et vidéo</h3><p class="muted">Le nom du club fait la part belle à l'image animée.</p>{TODO("Activités cinéma / vidéo (séances, ateliers, réalisations) à confirmer par le club.")}</div>
</div></div></section>
{STRIP}
<section class="section alt"><div class="wrap split"><div class="rv"><div class="kicker">Jours, horaires, lieu</div><h2>Où et quand nous retrouver</h2>
<p class="lead">{e(club["reunion"]["texte"])}</p><p>{e(club["permanence"])}</p>
<p><strong>Lieu :</strong> {e(addr_line)}.</p>
<p class="muted" style="font-size:.92rem">{e(club["reunion"]["lieu"])}</p>
<div class="btns"><a class="btn primary" href="nous-rejoindre.html">Essayer une séance</a><a class="btn" href="expositions-evenements.html">Voir les expositions</a></div></div>
<div class="rv d1"><table style="width:100%;border-collapse:collapse;font-size:1rem">
<tbody>
<tr style="border-bottom:1px solid var(--line)"><th style="text-align:left;padding:1rem 0;font-weight:500">Réunion mensuelle</th><td style="padding:1rem 0">Dernier mercredi du mois, 20 h</td></tr>
<tr style="border-bottom:1px solid var(--line)"><th style="text-align:left;padding:1rem 0;font-weight:500">Permanence au local</th><td style="padding:1rem 0">Samedi, 11 h – 12 h, ou sur rendez-vous</td></tr>
<tr style="border-bottom:1px solid var(--line)"><th style="text-align:left;padding:1rem 0;font-weight:500">Expositions</th><td style="padding:1rem 0">En général tous les jours, 10 h – 12 h et 14 h – 18 h, entrée libre</td></tr>
<tr><th style="text-align:left;padding:1rem 0;font-weight:500">Contact</th><td style="padding:1rem 0">{tel} · <a href="mailto:{club["email"]}">{club["email"]}</a></td></tr>
</tbody></table></div></div></section>'''
shell("activites.html", "activites", "Activités",
      "Initiation, réunions mensuelles, sorties, stages, projections, expositions et concours : toutes les activités du Photo Ciné Club Sénonais à Sens.", act_body)

# ---------------------------------------------------------------- GALERIE
gal_body = f'''{page_head(5, "Galerie", "Le travail des membres,<br>en grand", "Photos classées par thème ou par auteur. Cliquez sur une image pour la voir en plein écran, avec le crédit de son auteur.", "Galerie")}
<section class="section"><div class="wrap">
<div class="filter-row"><div class="filters" id="filters" role="group" aria-label="Filtrer par thème"></div>
<div style="display:flex;gap:1rem;align-items:center"><label for="author" style="margin:0">Auteur</label><select id="author"></select></div></div>
<p class="count" id="count" aria-live="polite"></p>
<div class="mos" id="mos"></div>
<p id="data-error" class="todo" hidden>La galerie n'a pas pu être chargée. Rechargez la page.</p>
<div class="rv" style="margin-top:3rem;text-align:center"><p class="muted">Sélection de photos publiées par le club. Chaque image est © de son auteur — toute reproduction est soumise à son accord.</p>
<a class="btn" href="{club["liens"]["galerie"]}" target="_blank" rel="noopener">Toutes les galeries du club ↗</a></div>
</div></section>'''
shell("galerie.html", "galerie", "Galerie",
      "Galerie photo du Photo Ciné Club Sénonais : paysages, nature, rue, noir et blanc, macro. Photos classées par thème et par auteur, avec visionneuse plein écran.", gal_body)

# ---------------------------------------------------------------- FILMS
films_body = f'''{page_head(4, "Films & vidéos", "La salle de projection", "Diaporamas, courts-métrages et extraits : l'image en mouvement au Photo Ciné Club Sénonais.", "Films & vidéos")}
<section class="screen-wrap"><div class="wrap"><div class="kicker rv">Séance du jour</div><h2 class="rv">Diaporama : la sélection du club</h2>
<div class="screen rv" id="screen" role="region" aria-label="Diaporama de photos du club"><div class="frames"></div>
<button class="big" aria-label="Lancer le diaporama"><span>▶</span></button>
<div class="cap"></div>
<div class="ctl"><button id="prev" aria-label="Photo précédente">‹</button><button id="pp" aria-label="Lecture">▶</button><button id="next" aria-label="Photo suivante">›</button><div class="bar"><i></i></div><button id="fs" aria-label="Plein écran">⛶</button></div></div>
<p class="muted rv" style="text-align:center;margin-top:1.6rem;font-size:.9rem">Chaque image est créditée à son auteur. Les diaporamas numériques sont une activité du club, avec ordinateur et vidéoprojecteur mis à disposition.</p></div></section>
{STRIP}
<section class="section"><div class="wrap"><div class="kicker rv">Films & extraits</div><h2 class="rv">Courts-métrages et vidéos des membres</h2>
<div class="grid g2" id="films" style="margin-top:2rem"></div></div></section>
<section class="section alt"><div class="wrap split"><div class="rv"><div class="kicker">Soirées de projection</div><h2>Voir ensemble, commenter ensemble</h2>
<p class="lead">Lors des réunions, les images des membres sont projetées sur grand écran pour être regardées, commentées et améliorées.</p>
{TODO("Programme des soirées de projection, courts-métrages et ateliers vidéo : à compléter par le club.")}</div>
<figure class="frame rv d1"><img src="{heroes[4]["file"]}" alt="{e(heroes[4]["alt"])}" loading="lazy"><figcaption>Photo : {e(heroes[4]["author"])}</figcaption></figure></div></section>'''
shell("films-videos.html", "films", "Films & vidéos",
      "Salle de projection du Photo Ciné Club Sénonais : diaporamas de photos du club, courts-métrages et extraits vidéo des membres.", films_body)

# ---------------------------------------------------------------- EXPOSITIONS
expo_body = f'''{page_head(0, "Expositions & événements", "Les images<br>s'accrochent aux murs", "Expositions annuelles, salons et concours : retrouvez les prochains rendez-vous et les archives du club.", "Expositions & événements")}
<section class="section"><div class="wrap"><div class="kicker rv">À venir</div><h2 class="rv">Prochains rendez-vous</h2>
<div class="events" id="upcoming"></div>
<p id="data-error" class="todo" hidden>L'agenda n'a pas pu être chargé. Rechargez la page.</p></div></section>
{STRIP}
<section class="section alt"><div class="wrap split"><div class="rv"><div class="kicker">En marge des grandes expositions</div><h2>Des accrochages toute l'année</h2>
<p class="lead">Le club expose aussi dans le cadre d'autres manifestations à Sens et aux alentours.</p></div>
<ul class="rv d1" id="autres" style="margin:0;padding-left:1.2rem;font-size:1.1rem"></ul></div></section>
<section class="section"><div class="wrap"><div class="kicker rv">Archives</div><h2 class="rv">Les expositions passées</h2><div class="events" id="archives"></div></div></section>
<section class="section alt"><div class="wrap"><div class="kicker rv">Concours</div><h2 class="rv">Le concours photo du club</h2>
<p class="lead rv">Le club a organisé son concours à l'occasion de son exposition d'automne, avec un jury et des lots offerts par des partenaires locaux.</p>
<div class="grid g2" id="concours" style="margin-top:2rem"></div>
<div class="btns"><a class="btn" href="http://www.photoclubsenonais.fr/blog/index.php?category/Concours" target="_blank" rel="noopener">Archives des concours ↗</a></div></div></section>'''
shell("expositions-evenements.html", "expos", "Expositions & événements",
      "Expositions, salons et concours du Photo Ciné Club Sénonais à Sens : prochains rendez-vous, exposition d'automne, « Ma photo préférée » et archives.", expo_body)

# ---------------------------------------------------------------- ACTUALITES
news_body = f'''{page_head(2, "Actualités", "Les dernières<br>nouvelles du club", "Expositions, photos du mois, programme de l'année : l'actualité du Photo Ciné Club Sénonais.", "Actualités")}
<section class="section"><div class="wrap"><div class="news" id="news"></div>
<p id="data-error" class="todo" hidden>Les actualités n'ont pas pu être chargées. Rechargez la page.</p>
<div class="rv" style="margin-top:2.6rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;justify-content:space-between"><p class="muted" style="margin:0">Toutes les nouvelles plus anciennes sont sur le blog du club.</p>
<span style="display:flex;gap:.8rem;flex-wrap:wrap"><a class="btn" href="{club["liens"]["blog"]}" target="_blank" rel="noopener">Le blog du club ↗</a><a class="btn" href="{club["liens"]["newsletter"]}" target="_blank" rel="noopener">Lettre d'information ↗</a></span></div></div></section>'''
shell("actualites.html", "actus", "Actualités",
      "Les actualités du Photo Ciné Club Sénonais : exposition d'automne, photos du mois, programme des expositions 2026 à Sens.", news_body)

# ---------------------------------------------------------------- CONTACT
osm = "https://www.openstreetmap.org/search?query=" + "3%20place%20%C3%89tienne%20Dolet%2C%20Sens"
gmaps = "https://www.google.com/maps/search/?api=1&query=" + "3%20place%20%C3%89tienne%20Dolet%2C%2089100%20Sens"
contact_body = f'''{page_head(1, "Nous rejoindre", "Rejoignez<br>le club", "Adhésion, séance d'essai, une question ? Écrivez-nous ou passez à la permanence du samedi.", "Nous rejoindre")}
<section class="section"><div class="wrap split" style="align-items:start">
<div class="rv"><div class="kicker">Adhésion</div><h2>Pourquoi nous rejoindre</h2>
<ul style="padding-left:1.2rem"><li>Réunion mensuelle et analyses d'image</li><li>Initiation à la prise de vue, labo numérique, studio</li><li>Six à sept expositions par an pour montrer vos photos</li><li>Concours régionaux et nationaux via la Fédération Photographique de France</li></ul>
<h3 style="margin-top:2rem">Cotisation</h3><p id="tarif" class="todo">{e(club["adhesion"]["tarif"])}</p>
<h3 style="margin-top:1.5rem">Séance d'essai</h3><p id="essai" class="todo">{e(club["adhesion"]["essai"])}</p>
<h3 style="margin-top:1.5rem">Coordonnées</h3>
<address style="font-style:normal"><strong>{e(club["nom"])}</strong><br>{e(a["ligne1"])}<br>{e(a["ligne2"])}<br>{e(a["cp"])} {e(a["ville"])}<br>
Tél. {tel} ({e(club["telephone_note"])})<br>E-mail : <a href="mailto:{club["email"]}">{club["email"]}</a></address>
<p class="muted" style="margin-top:1rem">{e(club["permanence"])}</p>
<div class="btns"><a class="btn sm" href="{osm}" target="_blank" rel="noopener">Plan OpenStreetMap ↗</a><a class="btn sm" href="{gmaps}" target="_blank" rel="noopener">Itinéraire Google Maps ↗</a></div></div>
<div class="rv d1"><div class="card"><h3>Écrire au club</h3>
<form class="contact" name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir : <input name="bot-field"></label></p>
<div><label for="nom">Nom et prénom</label><input type="text" id="nom" name="nom" required autocomplete="name"></div>
<div><label for="email">E-mail</label><input type="email" id="email" name="email" required autocomplete="email"></div>
<div><label for="tel">Téléphone (facultatif)</label><input type="tel" id="tel" name="telephone" autocomplete="tel"></div>
<div><label for="sujet">Votre demande</label><select class="f" id="sujet" name="sujet"><option>Adhésion</option><option>Séance d'essai</option><option>Exposition / événement</option><option>Autre question</option></select></div>
<div><label for="message">Message</label><textarea id="message" name="message" required></textarea></div>
<label class="check"><input type="checkbox" name="consentement" required> J'accepte que le club utilise ces informations pour me répondre (voir les <a href="mentions-legales.html#donnees">mentions légales</a>).</label>
<button class="btn primary" type="submit">Envoyer le message</button></form></div></div></div></section>'''
shell("nous-rejoindre.html", "contact", "Nous rejoindre",
      "Rejoindre le Photo Ciné Club Sénonais à Sens : adhésion, séance d'essai, coordonnées et formulaire de contact.", contact_body)

# ---------------------------------------------------------------- MENTIONS
authors_cred = sorted({p["author"] for p in P})
legal = f'''{page_head(3, "Informations", "Mentions légales", "Éditeur, hébergement, données personnelles et droits d'auteur sur les images.", "Mentions légales")}
<section class="section"><div class="wrap" style="max-width:860px">
<h2>Éditeur du site</h2><p><strong>{e(club["nom"])}</strong><br>{e(a["ligne1"])}, {e(a["ligne2"])}, {e(a["cp"])} {e(a["ville"])}<br>E-mail : <a href="mailto:{club["email"]}">{club["email"]}</a> · Tél. {tel}</p>
{TODO("Statut juridique et numéro RNA/SIRET de l'association, et nom du directeur de publication : à compléter par le club (l'annuaire fédéral cite Guy Eichelberger comme président).")}
<h2 style="margin-top:3rem">Hébergement</h2><p>Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener">netlify.com</a>.</p>
<h2 style="margin-top:3rem">Droits d'auteur sur les images</h2>
<p>Toutes les photographies présentées sur ce site sont la propriété exclusive de leurs auteurs et sont créditées à proximité de chaque image. Toute reproduction, représentation, modification ou diffusion, même partielle, sans l'autorisation écrite de l'auteur, est interdite.</p>
<p>Les images proviennent des pages publiques du club (blog et galeries en ligne). L'accord de chaque auteur est à confirmer avant toute mise en ligne définitive ; tout auteur peut demander le retrait ou la modification de ses images en écrivant à <a href="mailto:{club["email"]}">{club["email"]}</a>.</p>
<p class="muted">Auteurs crédités sur ce site : {e(", ".join(authors_cred))}. Affiche de l'exposition d'automne 2026 : photo d'Éric Reneau.</p>
<h2 id="donnees" style="margin-top:3rem">Données personnelles</h2>
<p>Le formulaire de contact recueille votre nom, votre e-mail, éventuellement votre téléphone et votre message, uniquement pour répondre à votre demande. Les messages sont reçus via le service Netlify Forms et ne sont pas utilisés à d'autres fins ni transmis à des tiers. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:{club["email"]}">{club["email"]}</a>.</p>
<h2 style="margin-top:3rem">Cookies et traceurs</h2><p>Ce site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Les vidéos YouTube ou Vimeo, lorsqu'elles sont ajoutées, ne se chargent qu'après votre clic.</p>
<h2 style="margin-top:3rem">Conception</h2><p>Maquette réalisée par AssoVisible pour le Photo Ciné Club Sénonais. Typographies : Cormorant Garamond et Jost (licence SIL Open Font).</p>
</div></section>'''
shell("mentions-legales.html", "legal", "Mentions légales",
      "Mentions légales du Photo Ciné Club Sénonais : éditeur, hébergeur, données personnelles et droits d'auteur sur les photographies.", legal)

# ---------------------------------------------------------------- MERCI
merci = f'''<section class="page-head" style="min-height:60vh"><div class="wrap"><div class="kicker">Message envoyé</div><h1>Merci !</h1>
<p class="lead">Votre message est bien parti. Le club vous répondra rapidement.</p><div class="btns"><a class="btn primary" href="index.html">Retour à l'accueil</a><a class="btn" href="galerie.html">Voir la galerie</a></div></div></section>'''
shell("merci.html", "merci", "Merci", "Confirmation d'envoi de votre message au Photo Ciné Club Sénonais.", merci, '<meta name="robots" content="noindex">')

inner = iris().split('aria-hidden="true">')[1].replace("</svg>", "")
(ROOT / "favicon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0b0b0d"/>'
    '<g transform="translate(6 6) scale(.75)" fill="none" stroke="#ff7d68" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
    + inner + '</g></svg>', encoding="utf-8")
