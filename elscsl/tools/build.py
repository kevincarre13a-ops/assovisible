#!/usr/bin/env python3
"""Génère les pages HTML (en-tête / pied de page communs) à partir de data/club.json.
Usage : python3 tools/build.py   (depuis le dossier elscsl/)
Le contenu éditable (matchs, équipes, actualités…) reste dans data/*.json."""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
club = json.loads((ROOT / "data/club.json").read_text(encoding="utf-8"))
e = html.escape
SITE = "https://elscsl.netlify.app"

NAV = [
    ("index.html", "Accueil", "accueil"),
    ("le-club.html", "Le club", "club"),
    ("equipes.html", "Équipes", "equipes"),
    ("matchs.html", "Matchs &amp; résultats", "matchs"),
    ("actualites.html", "Actualités", "actualites"),
    ("galerie.html", "Galerie", "galerie"),
    ("partenaires.html", "Partenaires", "partenaires"),
    ("contact.html", "Nous rejoindre", "contact"),
]

ICONS = {
    "club": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.3 7.8 8 9 4.7-1.2 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    "equipes": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.4 2.7-6 6-6s6 2.600 6 6M15.500 14.200c2.800-.5 5.500 1.400 5.500 4.800"/></svg>',
    "matchs": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m12 8 3.600 2.600-1.400 4.200H9.800L8.400 10.600 12 8ZM12 8V3M15.600 10.600l5-1.600M14.200 14.800l3 4.100M9.800 14.800l-3 4.100M8.400 10.600 3.400 9"/></svg>',
    "actualites": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/></svg>',
    "galerie": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.800"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>',
    "partenaires": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 12l4-4 4 2 4-2 6 5-5 5-3-1-3 2-6-5 3-3"/></svg>',
}

SKYLINE = """<svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" fill="currentColor">
<path d="M0 240V190h60v-18h40v18h50v-40l16-22 16 22v40h60v-24h50v24h40V120l10-26 10 26v70h70v-30h60v30h40V70l18-40 18 40v120h50v-36h46v36h90v-26h50V90l14-20 14 20v74h40v-18h60V90l10-40 10 40v56h44v44h60v-20h46v20h92v50Z"/>
</svg>"""


def head(title, desc, page):
    url = f"{SITE}/" if page == "index.html" else f"{SITE}/{page}"
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#0b1f16">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;600;700&display=swap">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
"""


def header(active):
    cur = ' aria-current="page"'
    items = "".join(
        f'<li><a href="{h}"{cur if k == active else ""}>{t}</a></li>' for h, t, k in NAV
    )
    return f"""<header class="site-header">
<div class="wrap">
<a class="brand" href="index.html" aria-label="ELSCSL, retour à l'accueil"><span class="brand-badge">ELSCSL</span><span class="brand-sub">Entente sportive<br>Seine-et-Marne</span></a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu"><span></span></button>
<nav class="site-nav" id="menu" aria-label="Navigation principale"><ul>{items}</ul></nav>
</div>
</header>
<main id="contenu">
"""


def footer():
    c = club["contact"]
    tel = e(c["telephone"]) if c["telephone"] else '<span class="todo">Téléphone à compléter</span>'
    mail = e(c["email"]) if c["email"] else '<span class="todo">E-mail à compléter</span>'
    links = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t, k in NAV[:7])
    s = club["social"]
    return f"""</main>
<footer class="site-footer">
<div class="wrap">
<div class="foot">
<div>
<a class="brand" href="index.html"><span class="brand-badge">ELSCSL</span></a>
<p style="margin-top:18px">{e(club["nomOfficiel"])}.<br>Club de football du district de Seine-et-Marne, créé en {club["fondation"]}.</p>
</div>
<div><h2>Coordonnées</h2><ul>
<li>{e(c["adresse"])}</li><li>{tel}</li><li>{mail}</li>
<li>Président : {e(club["president"])}</li></ul></div>
<div><h2>Le site</h2><ul>{links}<li><a href="contact.html">Nous rejoindre / Contact</a></li><li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
<div><h2>Suivez-nous</h2><ul>
<li><a href="{e(s["facebook"])}" rel="noopener" target="_blank">Facebook</a></li>
<li><a href="{e(s["fff"])}" rel="noopener" target="_blank">Fiche FFF</a></li>
<li><a href="{e(s["scorenco"])}" rel="noopener" target="_blank">Résultats Score'n'co</a></li>
<li><a href="{e(s["footeo"])}" rel="noopener" target="_blank">Ancien site Footeo</a></li></ul></div>
</div>
<div class="foot-bottom"><span>© 2026 ELSCSL — Tous droits réservés</span><span>Maquette de démonstration réalisée par AssoVisible</span></div>
</div>
</footer>
<script src="js/app.js" defer></script>
</body>
</html>
"""


def page_hero(eyebrow, title, text):
    return f"""<section class="page-hero"><div class="wrap">
<p class="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p>
</div></section>
"""


CTA = """<section class="cta green"><div class="wrap reveal">
<p class="eyebrow" style="justify-content:center;color:var(--sun)">Rejoignez l'entente</p>
<h2>Un maillot, quatre villages, une famille</h2>
<p>Enfant, ado, adulte, joueur, éducateur, bénévole ou supporter : il y a une place pour vous dans le club.</p>
<div class="hero-actions"><a class="btn btn-sun" href="contact.html">Nous rejoindre</a><a class="btn btn-line" href="equipes.html">Voir les équipes</a></div>
</div></section>
"""

PAGES = {}

# ---------------------------------------------------------------- ACCUEIL
cards = [
    ("le-club.html", "club", "Le club", "Notre histoire, nos valeurs et nos quatre communes réunies sous un même maillot."),
    ("equipes.html", "equipes", "Équipes", "De l'école de foot aux seniors : une fiche par équipe."),
    ("matchs.html", "matchs", "Matchs & résultats", "Calendrier, résultats et classements de la saison."),
    ("actualites.html", "actualites", "Actualités", "Les nouvelles du club, tournois et soirées."),
    ("galerie.html", "galerie", "Galerie", "Les photos des équipes, des stades et des événements."),
    ("partenaires.html", "partenaires", "Partenaires", "Ceux qui soutiennent le club, et comment les rejoindre."),
]
cards_html = "".join(
    f'<a class="card reveal" href="{h}"><div class="ico">{ICONS[i]}</div><h3>{e(t)}</h3><p>{e(d)}</p><span class="more">Découvrir →</span></a>'
    for h, i, t, d in cards
)
PAGES["index.html"] = (
    "ELSCSL · Entente sportive Longueville – Sainte-Colombe – Saint-Loup-de-Naud",
    "Le club de football de l'entente Longueville, Sainte-Colombe, Saint-Loup-de-Naud et Soisy-Bouy (77) : équipes, matchs, actualités et inscriptions.",
    "accueil",
    f"""<section class="hero" style="padding-top:calc(var(--header-h) + 40px)">
<div class="hero-scene" aria-hidden="true">
<div class="hero-photo"></div>
<div class="hero-layer stars" data-speed="0.05"></div>
<div class="hero-layer sunset" data-speed="0.1"></div>
<div class="hero-layer"><div class="beam l"></div><div class="beam r"></div></div>
<div class="hero-layer skyline" data-speed="0.16">{SKYLINE}</div>
<div class="hero-layer pitch" data-speed="0.05"><i></i></div>
<div class="hero-fade"></div>
</div>
<div class="wrap"><div class="hero-inner">
<p class="eyebrow">Football · Seine-et-Marne (77)</p>
<h1>ELSCSL<em>Un club, un maillot, nos villages</em></h1>
<ul class="chips"><li>Longueville</li><li>Sainte-Colombe</li><li>Saint-Loup-de-Naud</li><li>Soisy-Bouy</li></ul>
<p class="lead">Trois villages du Provinois et leur voisin de Soisy-Bouy jouent ensemble. Ici, le foot se vit en famille, du premier ballon aux vétérans.</p>
<div class="hero-actions"><a class="btn btn-sun" href="contact.html">Nous rejoindre</a><a class="btn btn-line" href="matchs.html">Matchs &amp; résultats</a></div>
</div></div>
<span class="scroll-cue" aria-hidden="true"></span>
</section>

<section class="match-band"><div class="wrap">
<div class="match-card reveal" id="next-match">
<div><p class="match-label">Prochain match</p></div>
<div><p class="match-title" id="nm-title">Chargement…</p><p class="match-meta" id="nm-meta"></p></div>
<div class="countdown" id="cd-box" aria-live="off"></div>
</div></div></section>

<section><div class="wrap">
<p class="eyebrow">Le site du club</p><h2>Tout le club, en un coup d'œil</h2>
<p class="lead" style="margin-bottom:34px">Un site simple pour réunir joueurs, parents, bénévoles et habitants des communes.</p>
<div class="grid c3">{cards_html}</div>
</div></section>

<section class="dark"><div class="wrap">
<p class="eyebrow" style="color:var(--sun)">Le club en chiffres</p><h2>Ensemble depuis {club["fondation"]}</h2>
<div class="stats" id="stats" style="margin-top:36px"></div>
</div></section>

<section><div class="wrap">
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:12px;margin-bottom:28px">
<div><p class="eyebrow">Dernières nouvelles</p><h2 style="margin:0">Actualités</h2></div>
<a class="btn btn-pitch" href="actualites.html">Toutes les actualités</a></div>
<div class="news" id="news" data-limit="2"></div>
</div></section>

<section style="background:var(--chalk)"><div class="wrap">
<p class="eyebrow">Ils nous soutiennent</p><h2>Nos partenaires</h2>
<p class="lead" id="partner-intro" style="margin-bottom:28px"></p>
<div class="logos" id="logos" data-min="3"></div>
<p style="margin-top:26px"><a class="btn btn-pitch" href="partenaires.html">Devenir partenaire</a></p>
</div></section>
{CTA}""",
)

# ---------------------------------------------------------------- LE CLUB
communes_html = "".join(
    f'<div class="commune reveal" data-n="{i + 1}"><small>{e(c["role"])}</small><h3>{e(c["nom"])}</h3><p>{e(c["texte"])}</p></div>'
    for i, c in enumerate(club["communes"])
)
PAGES["le-club.html"] = (
    "Le club · ELSCSL, entente de football du Provinois",
    "Histoire, valeurs, bureau et communes de l'entente sportive Longueville – Sainte-Colombe – Saint-Loup-de-Naud – Soisy-Bouy.",
    "club",
    page_hero("Le club", "Un club de village, à plusieurs voix", "Une entente de football créée pour que les enfants et les adultes de nos communes jouent sous le même maillot.")
    + f"""<section><div class="wrap two">
<div class="reveal"><p class="eyebrow">Présentation</p><h2>L'entente sportive</h2>
<p>L'ELSCSL est une association de football déclarée le {club["dateDeclaration"]}, dont le siège est à Longueville (Seine-et-Marne). Elle réunit les licenciés de Longueville, Sainte-Colombe, Saint-Loup-de-Naud et Soisy-Bouy et dépend du district de Seine-et-Marne.</p>
<p>Elle engage des équipes de l'école de foot, des jeunes, des féminines et des seniors dans les compétitions du district.</p>
<p><span class="todo">À compléter</span> Le club pourra ajouter ici son mot du président et sa présentation en quelques lignes.</p></div>
<div class="reveal"><p class="eyebrow">Histoire</p><h2>De 2012 à aujourd'hui</h2>
<ul class="timeline"><li><b>{club["fondation"]}</b><br>Déclaration de l'association (RNA {e(club["rna"])}).</li>
<li><b>Au fil des saisons</b><br>L'entente aligne des équipes de jeunes, féminines et seniors en championnat et en Coupe de Seine-et-Marne.</li>
<li><b>Saison 2026-2027</b><br>Les seniors M1 (Critérium 45 ans) et M2 (CDM D2, Coupe 77) ont repris la compétition.</li></ul>
<p><span class="todo">À compléter</span> Dates clés, anecdotes et anciens à ajouter avec le club.</p></div>
</div></section>

<section class="green"><div class="wrap">
<p class="eyebrow" style="color:var(--sun)">Valeurs</p><h2>Ce qui nous rassemble</h2>
<div class="grid c3">
<div class="card reveal" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff"><h3 style="color:var(--sun)">Plaisir</h3><p style="color:rgba(255,255,255,.85)">Jouer d'abord, gagner ensuite. Le ballon est une fête.</p></div>
<div class="card reveal" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff"><h3 style="color:var(--sun)">Solidarité</h3><p style="color:rgba(255,255,255,.85)">Quatre communes, un seul groupe, des bénévoles qui se serrent les coudes.</p></div>
<div class="card reveal" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff"><h3 style="color:var(--sun)">Respect</h3><p style="color:rgba(255,255,255,.85)">Des partenaires, des arbitres, des adversaires et des éducateurs.</p></div>
</div>
<p class="notice" style="margin-top:28px">Valeurs proposées à titre d'exemple : le club peut les reformuler.</p>
</div></section>

<section><div class="wrap">
<p class="eyebrow">Bureau &amp; éducateurs</p><h2>Ceux qui font vivre le club</h2>
<div class="grid c3">
<div class="card reveal"><h3>{e(club["president"])}</h3><p>Président</p></div>
<div class="card reveal"><h3><span class="todo">À compléter</span></h3><p>Secrétaire</p></div>
<div class="card reveal"><h3><span class="todo">À compléter</span></h3><p>Trésorier</p></div>
<div class="card reveal"><h3><span class="todo">À compléter</span></h3><p>Responsable école de foot</p></div>
<div class="card reveal"><h3><span class="todo">À compléter</span></h3><p>Éducateurs jeunes</p></div>
<div class="card reveal"><h3><span class="todo">À compléter</span></h3><p>Entraîneurs seniors</p></div>
</div></div></section>

<section class="dark"><div class="wrap">
<p class="eyebrow" style="color:var(--sun)">Les communes</p><h2>Réunies autour du terrain</h2>
<div class="bridge" aria-hidden="true"><b></b><i></i><b></b><i></i><b></b><i></i><b></b></div>
<div class="communes">{communes_html}</div>
</div></section>
{CTA}""",
)

# ---------------------------------------------------------------- EQUIPES
PAGES["equipes.html"] = (
    "Équipes · École de foot, jeunes, féminines et seniors | ELSCSL",
    "Toutes les équipes de l'ELSCSL : école de foot, jeunes, féminines, seniors et vétérans, avec leurs compétitions.",
    "equipes",
    page_hero("Équipes", "Une équipe pour chacun", "Survolez ou touchez une carte pour découvrir l'éducateur, les jours, les horaires et le lieu d'entraînement.")
    + """<section><div class="wrap">
<p class="notice">Les catégories et compétitions viennent des sites officiels (FFF, Score'n'co, SportCorico). Éducateurs et horaires sont à compléter par le club dans <code>data/equipes.json</code>.</p>
<div id="teams"></div>
</div></section>
""" + CTA,
)

# ---------------------------------------------------------------- MATCHS
PAGES["matchs.html"] = (
    "Matchs & résultats · Calendrier de l'ELSCSL",
    "Calendrier, résultats et classements des équipes de l'entente ELSCSL, saison 2026-2027.",
    "matchs",
    page_hero("Matchs &amp; résultats", "Le terrain, chaque dimanche", "Les rencontres de la saison 2026-2027 relevées sur les sites officiels.")
    + """<section><div class="wrap">
<h2>Calendrier &amp; résultats</h2>
<div class="tabs" role="group" aria-label="Filtrer les rencontres">
<button class="tab" type="button" data-mode="tous" aria-pressed="true">Toutes</button>
<button class="tab" type="button" data-mode="avenir" aria-pressed="false">À venir</button>
<button class="tab" type="button" data-mode="passes" aria-pressed="false">Jouées</button></div>
<div class="fixtures" id="fixtures"></div>
<p class="notice" style="margin-top:22px">Les scores et certains adversaires sont à renseigner dans <code>data/matchs.json</code> ou à consulter sur les liens officiels ci-dessous.</p>
</div></section>
<section style="background:var(--chalk)"><div class="wrap">
<p class="eyebrow">Classements</p><h2>Classement</h2><div id="classement"></div>
</div></section>
""" + CTA,
)

# ---------------------------------------------------------------- ACTUALITES
PAGES["actualites.html"] = (
    "Actualités & événements · ELSCSL",
    "Dernières nouvelles du club, tournois, soirées et archives de l'entente ELSCSL.",
    "actualites",
    page_hero("Actualités &amp; événements", "La vie du club", "Nouvelles, tournois, soirées : tout ce qui se passe entre nos quatre communes.")
    + """<section><div class="wrap">
<h2>À la une</h2><div class="news" id="news"></div>
</div></section>
<section style="background:var(--chalk)"><div class="wrap">
<p class="eyebrow">Archives</p><h2>Mémoire du club</h2><ul class="timeline" id="archives"></ul>
</div></section>
""" + CTA,
)

# ---------------------------------------------------------------- GALERIE
PAGES["galerie.html"] = (
    "Galerie photos · ELSCSL",
    "Photos des équipes, des stades, des tournois et des bénévoles de l'entente ELSCSL.",
    "galerie",
    page_hero("Galerie", "Le club en images", "Équipes, stades, tournois et bénévoles : les albums du club.")
    + """<section><div class="wrap">
<p class="notice">Aucune photo n'a pu être reprise librement : les emplacements sont prêts. Déposer les images dans <code>assets/photos/</code> puis les déclarer dans <code>data/galerie.json</code>.</p>
<div class="tabs" id="gal-tabs" role="group" aria-label="Filtrer par album"></div>
<div class="gallery" id="gallery"></div>
</div></section>
<div class="lightbox" id="lightbox" role="dialog" aria-label="Photo agrandie"><button type="button" aria-label="Fermer">×</button><img alt=""></div>
""" + CTA,
)

# ---------------------------------------------------------------- PARTENAIRES
PAGES["partenaires.html"] = (
    "Partenaires & sponsors · ELSCSL",
    "Les sponsors et soutiens de l'entente ELSCSL, et comment devenir partenaire du club.",
    "partenaires",
    page_hero("Partenaires", "Ils jouent avec nous", "Un club vit grâce à ses bénévoles, ses communes et ses partenaires locaux.")
    + """<section><div class="wrap">
<h2>Nos soutiens</h2><p class="lead" id="partner-intro" style="margin-bottom:28px"></p>
<div class="logos" id="logos" data-min="6"></div>
</div></section>
<section class="dark"><div class="wrap two">
<div class="reveal"><p class="eyebrow" style="color:var(--sun)">Devenir partenaire</p><h2>Votre enseigne sur nos maillots ?</h2>
<p class="lead">Commerçant, artisan, entreprise : soutenir l'entente, c'est être visible auprès de quatre communes et de leurs familles.</p></div>
<div class="reveal"><ul class="info-list"><li><span>⚽</span><div><strong>Visibilité</strong>Logo sur le site et, selon accord, sur les équipements.</div></li>
<li><span>🤝</span><div><strong>Proximité</strong>Une présence aux tournois et temps forts du club.</div></li>
<li><span>📩</span><div><strong>Contact</strong>Écrivez-nous via le formulaire.</div></li></ul>
<p style="margin-top:22px"><a class="btn btn-sun" href="contact.html#formulaire">Proposer un partenariat</a></p>
<p><span class="todo">À compléter</span> Formules et tarifs de partenariat à définir par le club.</p></div>
</div></section>
""",
)

# ---------------------------------------------------------------- CONTACT
stades_html = "".join(
    f'<li><span>📍</span><div><strong>{e(s["nom"])}</strong>{e(s["adresse"])}'
    f'{" · " + e(s["surface"]) if s["surface"] else ""}<br><a href="{e(s["carte"])}" rel="noopener" target="_blank">Voir sur la carte</a></div></li>'
    for s in club["stades"]
)
c = club["contact"]
PAGES["contact.html"] = (
    "Nous rejoindre & contact · ELSCSL",
    "Inscriptions, licences, contact et plan des stades de l'entente ELSCSL (Longueville, Sainte-Colombe, Saint-Loup-de-Naud, Soisy-Bouy).",
    "contact",
    page_hero("Nous rejoindre / Contact", "Prêt à chausser les crampons ?", "Inscription, licence, partenariat ou simple question : écrivez-nous.")
    + f"""<section><div class="wrap two">
<div class="reveal" id="formulaire"><h2>Écrivez-nous</h2>
<form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<label>Votre nom<input name="nom" required autocomplete="name"></label>
<label>Votre e-mail<input type="email" name="email" required autocomplete="email"></label>
<label>Votre téléphone <input type="tel" name="telephone" autocomplete="tel"></label>
<label>Votre demande<select name="sujet"><option>Inscription / licence</option><option>Devenir bénévole</option><option>Devenir partenaire</option><option>Autre question</option></select></label>
<label>Message<textarea name="message" required></textarea></label>
<button class="btn btn-pitch" type="submit">Envoyer le message</button>
</form></div>
<div class="reveal"><h2>Coordonnées</h2>
<ul class="info-list">
<li><span>🏛️</span><div><strong>Siège</strong>{e(c["adresse"])}</div></li>
<li><span>📞</span><div><strong>Téléphone</strong>{e(c["telephone"]) if c["telephone"] else '<span class="todo">À compléter</span>'}</div></li>
<li><span>✉️</span><div><strong>E-mail</strong>{e(c["email"]) if c["email"] else '<span class="todo">À compléter</span>'}</div></li>
<li><span>👤</span><div><strong>Président</strong>{e(club["president"])}</div></li>
<li><span>👍</span><div><strong>Facebook</strong><a href="{e(club["social"]["facebook"])}" rel="noopener" target="_blank">Page du club</a></div></li></ul></div>
</div></section>

<section style="background:var(--chalk)"><div class="wrap two">
<div class="reveal"><p class="eyebrow">Inscriptions &amp; licences</p><h2>Comment s'inscrire</h2>
<p><span class="todo">Texte d'attente</span></p>
<p>Le club précisera ici les périodes d'inscription, les pièces à fournir (certificat médical, photo, pièce d'identité), les tarifs de licence et les catégories d'âge par saison.</p>
<p>En attendant, utilisez le formulaire : un dirigeant vous répondra.</p></div>
<div class="reveal"><p class="eyebrow">Plan des stades</p><h2>Où nous trouver</h2>
<ul class="info-list">{stades_html}</ul></div>
</div></section>
<section style="padding-top:0;background:var(--chalk)"><div class="wrap">
<iframe class="map" title="Carte du secteur de Longueville, Sainte-Colombe et Saint-Loup-de-Naud" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=3.17%2C48.51%2C3.29%2C48.58&amp;layer=mapnik"></iframe>
</div></section>
""",
)

# ---------------------------------------------------------------- MERCI (hors menu)
PAGES["merci.html"] = (
    "Message envoyé · ELSCSL",
    "Merci, votre message a bien été transmis à l'entente ELSCSL.",
    "contact",
    page_hero("Merci", "Message bien reçu !", "Un dirigeant du club vous répondra rapidement.")
    + '<section><div class="wrap" style="text-align:center"><a class="btn btn-pitch" href="index.html">Retour à l\'accueil</a></div></section>',
)

# ---------------------------------------------------------------- MENTIONS
PAGES["mentions-legales.html"] = (
    "Mentions légales · ELSCSL",
    "Mentions légales du site de l'entente sportive ELSCSL : éditeur, hébergeur, données personnelles.",
    "",
    page_hero("Mentions légales", "Informations légales", "Éditeur, hébergement et protection des données.")
    + f"""<section><div class="wrap prose">
<h2>Éditeur du site</h2>
<p>{e(club["nomOfficiel"])}, association déclarée le {club["dateDeclaration"]} (loi du 1<sup>er</sup> juillet 1901), RNA {e(club["rna"])}, SIREN {e(club["siren"])}.<br>Siège : {e(c["adresse"])}.<br>Directeur de la publication : {e(club["president"])}, président.</p>
<p><span class="todo">À compléter</span> Téléphone et e-mail officiels du club.</p>
<h2>Conception</h2><p>Maquette de démonstration conçue par AssoVisible, sans reprise de contenu protégé.</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2>
<p>Les informations saisies dans le formulaire de contact (nom, e-mail, téléphone, message) servent uniquement à répondre à votre demande. Elles sont reçues via Netlify Forms et ne sont ni vendues ni cédées. Vous pouvez demander leur suppression ou leur rectification à l'adresse du siège.</p>
<h2>Cookies</h2><p>Le site n'utilise aucun cookie de suivi ni outil de mesure d'audience. Il charge des polices depuis Google Fonts et une carte OpenStreetMap sur la page Contact.</p>
<h2>Droits sur les contenus</h2>
<p>Le sigle ELSCSL est présenté sous forme de bloc-marque typographique. Les logos, photos et textes du club fournis ultérieurement restent la propriété de l'association ou de leurs auteurs.</p>
</div></section>
""",
)


def main():
    for name, (title, desc, active, body) in PAGES.items():
        out = head(title, desc, name) + header(active) + body + footer()
        (ROOT / name).write_text(out, encoding="utf-8")
    urls = [n for n in PAGES if n != "merci.html"]
    sm = "".join(f"<url><loc>{SITE}/{'' if n == 'index.html' else n}</loc></url>" for n in urls)
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{sm}</urlset>', encoding="utf-8")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n", encoding="utf-8")
    print("pages:", ", ".join(PAGES))


if __name__ == "__main__":
    main()
