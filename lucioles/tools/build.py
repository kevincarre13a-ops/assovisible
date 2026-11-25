#!/usr/bin/env python3
"""Génère les pages HTML (en-tête, pied de page et icônes communs) à partir de data/site.json.
Usage : python3 tools/build.py   (depuis le dossier lucioles/)
Les contenus qui changent souvent (agenda, hôpitaux, galerie, partenaires) sont lus
directement par js/app.js dans data/*.json : pas besoin de relancer ce script pour eux."""
import json, html, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
S = json.loads((ROOT / "data/site.json").read_text(encoding="utf-8"))
e = html.escape
NAV = [("index.html", "Accueil"), ("association.html", "L'association"), ("projets.html", "Nos projets"),
       ("evenements.html", "Événements"), ("galerie.html", "Galerie"), ("contact.html", "Nous aider & contact")]
TEL = S["phone"].replace(" ", "")

# Jeu d'icônes au trait (24×24), réutilisées via <use href="#i-nom">
ICONS = {
    "heart": "M12 20.5s-7.5-4.6-9.6-9.4A5.3 5.3 0 0 1 12 6.2a5.3 5.3 0 0 1 9.6 4.9C19.5 15.9 12 20.5 12 20.5z",
    "hospital": "M4 21V8l8-4.5L20 8v13M3 21h18M9.5 21v-4.5h5V21M12 8v5M9.5 10.5h5",
    "calendar": "M4 6h16v15H4zM4 10.5h16M8.5 3v4M15.5 3v4M8 14h2M14 14h2M8 17.5h2",
    "music": "M9 18V5.5l11-2.5v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
    "ball": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4zM12 3v4.5M20.4 9.5l-4.6.8M17.5 19l-3.1-4.3M6.5 19l3.1-4.3M3.6 9.5l4.6.8",
    "utensils": "M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 3v18M18 21V3c-2.5 1.5-3.5 4.5-3.5 8.5H18",
    "star": "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z",
    "palette": "M12 3a9 9 0 1 0 0 18c1.3 0 1.8-1.1 1.1-2.1-.8-1.2 0-2.6 1.4-2.6H17a4 4 0 0 0 4-4C21 7 17 3 12 3zM7.5 12h.01M9.5 8h.01M14.5 8h.01",
    "book": "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M8.5 7.5h7",
    "gamepad": "M7 8.5h10a4.5 4.5 0 0 1 4.5 4.5v1a3 3 0 0 1-5.4 1.8L14.7 14H9.3l-1.4 1.8A3 3 0 0 1 2.5 14v-1A4.5 4.5 0 0 1 7 8.5zM7.5 10.5v4M5.5 12.5h4M15.5 11.5h.01M17.5 13.5h.01",
    "gift": "M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7s-1.5-4-4.3-3.6C5.5 3.7 6.3 7 12 7zm0 0s1.5-4 4.3-3.6C18.5 3.7 17.7 7 12 7z",
    "users": "M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-1.5a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
    "sparkle": "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM5 3.5l.5 1.5 1.5.5-1.5.5L5 7.5 4.5 6 3 5.5 4.5 5z",
    "lantern": "M9.5 2.5h5M12 2.5v2M8 6.5h8l-.8 11.5H8.8zM6.5 6.5h11M6.5 18h11M12 10v4.5",
    "pin": "M12 21.5s-7-6.1-7-11.5a7 7 0 0 1 14 0c0 5.4-7 11.5-7 11.5zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "phone": "M21.5 16.5v3a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6A2 2 0 0 1 3.8 1.7h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.7 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 1.9z",
    "mail": "M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7",
    "facebook": "M14.5 8.5h3V4.5h-3a4.5 4.5 0 0 0-4.5 4.5v2H7.5v4H10V22h4v-7h3l1-4h-4V9a.5.5 0 0 1 .5-.5z",
    "instagram": "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.3 6.7h.01",
    "arrow": "M5 12h14M13 6l6 6-6 6",
    "cart": "M2.5 3.5h2.3l2.4 11h11.2L21 7H6.2M9 20.5h.01M18 20.5h.01",
    "message": "M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5zM8 10h8M8 13.5h5",
    "smile": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2.2 4 2.2 4-2.2 4-2.2M9 9.5h.01M15 9.5h.01",
    "camera": "M3 7.5h4l2-3h6l2 3h4V20H3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "handshake": "M11 17l2 2a1.5 1.5 0 0 0 2.1-2.1M14 16l2.5 2.5a1.5 1.5 0 0 0 2.1-2.1L15 12.8M2 12l4-4 3 1 3-2 4 1 3.5-1.5L22 11l-3.5 2.5M2 12l3 3M10 9.5l-2.5 2.5a1.5 1.5 0 0 0 2.1 2.1l2.4-2",
}
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' + "".join(
    f'<symbol id="i-{k}" viewBox="0 0 24 24"><path d="{v}"/></symbol>' for k, v in ICONS.items()) + "</defs></svg>"


def ico(name, cls="i"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"/></svg>'


MOUNTAINS = '''<svg class="mountains" viewBox="0 0 1440 240" preserveAspectRatio="none" aria-hidden="true">
<path class="m1" d="M0 150 L90 105 L150 125 L260 52 L340 112 L420 88 L520 140 L640 60 L730 120 L800 98 L900 30 L1010 118 L1090 84 L1180 130 L1290 66 L1380 112 L1440 96 V240 H0Z"/>
<path class="m2" d="M0 180 L120 136 L210 168 L330 118 L470 178 L590 128 L700 170 L820 120 L960 182 L1090 132 L1210 170 L1330 140 L1440 166 V240 H0Z"/>
<path class="m3" d="M0 222 C220 196 470 238 720 214 S1210 192 1440 222 V240 H0Z"/>
</svg>'''


def social(big=False):
    out = []
    for key, label in (("facebook", "Facebook"), ("instagram", "Instagram")):
        u = S.get(key)
        if u:
            out.append(f'<a class="soc soc-{key}" href="{e(u)}" target="_blank" rel="noopener" aria-label="{label} (nouvel onglet)">{ico(key)}<span>{label}</span></a>')
    return '<div class="social">' + "".join(out) + "</div>"


def don_btn(cls="btn btn-gold"):
    u = S.get("helloasso")
    if u:
        return f'<a class="{cls}" href="{e(u)}" target="_blank" rel="noopener">{ico("heart")}Faire un don</a>'
    return f'<a class="{cls}" href="contact.html#don">{ico("heart")}Faire un don</a>'


def jsonld():
    d = {"@context": "https://schema.org", "@type": "NGO", "name": S["name"], "url": S["url"],
         "logo": S["url"] + "/assets/logo-lucioles.jpeg", "foundingDate": "1998", "email": S["email"],
         "telephone": "+33" + TEL[1:], "description": S["tagline"],
         "address": {"@type": "PostalAddress", "streetAddress": "49 avenue du Grand Port", "postalCode": "73100",
                     "addressLocality": "Aix-les-Bains", "addressCountry": "FR"},
         "sameAs": [u for u in (S.get("facebook"), S.get("instagram")) if u]}
    return '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>"


def page(fname, title, desc, hero, body, big=False, extra_head="", base=""):
    nav = "".join(f'<li><a href="{h}"{" aria-current=\"page\"" if h == fname else ""}>{e(t)}</a></li>' for h, t in NAV)
    hero_html = f'''<header class="hero{' hero-big' if big else ''}">
<div class="sky" aria-hidden="true"><div class="stars"></div><span class="moon"></span><span class="glow glow-a"></span><span class="glow glow-b"></span><span class="glow glow-c"></span></div>
<div class="hero-inner">{hero}</div>
{MOUNTAINS}
</header>'''
    canon = S["url"] + "/" + ("" if fname == "index.html" else fname)
    doc = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">{base}
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{canon}">
<meta name="theme-color" content="#0f2236">
<meta property="og:site_name" content="{e(S["name"])}"><meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="website">
<meta property="og:url" content="{canon}"><meta property="og:image" content="{S["url"]}/assets/og-lucioles.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png"><link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Nunito:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){{if(!window.__lucioles)document.documentElement.classList.remove('js')}},2500)</script>
{extra_head}</head>
<body>
{SPRITE}
<a class="skip" href="#contenu">Aller au contenu</a>
<div class="progress" aria-hidden="true"></div>
<div class="fireflies" aria-hidden="true"></div>
<div class="site-header"><div class="wrap">
<a class="brand" href="index.html"><img src="assets/logo-lucioles.jpeg" alt="" width="46" height="46"><span>Les Lucioles</span></a>
<button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu"><span></span></button>
<nav aria-label="Navigation principale"><ul class="nav" id="menu">{nav}</ul></nav>
</div></div>
<main id="contenu">
{hero_html}
{body}
</main>
<footer class="site-footer">
<svg class="foot-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60V28C240 0 480 50 720 30s480-40 720-8v38z"/></svg>
<div class="wrap">
<div class="foot">
<div class="foot-brand"><a class="brand" href="index.html"><img src="assets/logo-lucioles.jpeg" alt="" width="54" height="54"><span>Les Lucioles</span></a>
<p>Association loi 1901 fondée en 1998 à Aix-les-Bains. Nous achetons le matériel ludique demandé par les services de pédiatrie, pour les enfants hospitalisés.</p>{social()}</div>
<div><h2>Le site</h2><ul>{"".join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in NAV)}<li><a href="mentions-legales.html">Mentions légales</a></li></ul></div>
<div><h2>Nous contacter</h2><ul class="foot-contact"><li>{ico("pin")}<span>{e(S["address"])}</span></li><li>{ico("phone")}<a href="tel:{TEL}">{e(S["phone"])}</a></li><li>{ico("mail")}<a href="mailto:{e(S["email"])}">{e(S["email"])}</a></li></ul></div>
</div>
<p class="copy">© <span data-year>2026</span> Association Les Lucioles · Site réalisé bénévolement avec <span class="heart">♥</span></p>
</div></footer>
<script src="js/app.js" defer></script>
</body></html>'''
    (ROOT / fname).write_text(doc, encoding="utf-8")


def card(icon, title, text, href=None, color=""):
    inner = f'<span class="badge {color}">{ico(icon)}</span><h3>{title}</h3><p>{text}</p>'
    if href:
        return f'<a class="card link-card reveal" href="{href}">{inner}<span class="more">Découvrir {ico("arrow")}</span></a>'
    return f'<div class="card reveal">{inner}</div>'


MAP_SECTION = '''<div class="map-wrap reveal"><div class="map" id="map" role="img" aria-label="Carte des hôpitaux aidés régulièrement par Les Lucioles, au départ d'Aix-les-Bains"></div></div>'''

STEPS = f'''<ol class="steps">
<li class="step reveal"><span class="step-n">1</span><span class="badge">{ico("message")}</span><h3>Un hôpital nous sollicite</h3><p>Un service de pédiatrie ou d'animation nous fait part de ses besoins.</p></li>
<li class="step reveal"><span class="step-n">2</span><span class="badge green">{ico("heart")}</span><h3>Nous récoltons des fonds</h3><p>Grâce à nos événements, à vos dons et aux fêtes organisées à notre profit.</p></li>
<li class="step reveal"><span class="step-n">3</span><span class="badge gold">{ico("cart")}</span><h3>Nous achetons le matériel</h3><p>Aucun argent n'est versé aux hôpitaux : nous achetons nous-mêmes ce qui est demandé.</p></li>
<li class="step reveal"><span class="step-n">4</span><span class="badge">{ico("smile")}</span><h3>Les enfants s'évadent</h3><p>Jeux, livres et loisirs rejoignent les services pour égayer le quotidien des enfants.</p></li>
</ol>'''

# ---------------- Accueil
page("index.html", "Association Les Lucioles – Des lumières pour les enfants hospitalisés",
     "Depuis 1998, l'association Les Lucioles d'Aix-les-Bains achète le matériel ludique demandé par les services de pédiatrie pour améliorer le quotidien des enfants hospitalisés.",
     f'''<div class="hero-logo-wrap"><img class="hero-logo" src="assets/logo-lucioles.jpeg" alt="Logo de l'association Les Lucioles : une luciole verte tenant une lanterne devant un cœur bleu" width="220" height="220"></div>
<span class="eyebrow">Association loi 1901 · Aix-les-Bains · depuis 1998</span>
<h1 class="split-words">Faire briller des <em>lumières</em> dans les yeux des enfants</h1>
<p class="lead">Nous offrons jeux, livres et loisirs aux enfants hospitalisés, pour qu'ils puissent s'évader le temps d'un instant.</p>
<div class="btns">{don_btn()}<a class="btn btn-ghost" href="evenements.html">{ico("calendar")}Nos événements</a></div>
<a class="scroll-hint" href="#decouvrir" aria-label="Découvrir l'association"><span></span></a>''',
     f'''
<section id="decouvrir"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Notre mission</span><h2>Une petite lumière dans l'hôpital</h2>
<p>Les Lucioles achètent le matériel ludique demandé par les services de pédiatrie et d'animation des hôpitaux, grâce à la générosité de celles et ceux qui participent à nos événements. Nous intervenons partout, dès qu'un hôpital nous adresse une demande.</p></div>
<div class="grid g3">
{card("hospital", "Nos projets dans les hôpitaux", "Belley, Albertville, Chambéry, Lyon… et plus de 15 hôpitaux aidés depuis nos débuts.", "projets.html")}
{card("music", "Nos événements", "Repas dansants, tournois de foot, thés dansants : venez faire la fête pour la bonne cause.", "evenements.html", "green")}
{card("lantern", "Notre histoire", "Née en 1998 à la suite d'une expérience personnelle, l'association n'a jamais cessé de grandir.", "association.html", "gold")}
</div></div></section>

<section class="dark how"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Comment ça marche ?</span><h2>De votre don au sourire d'un enfant</h2>
<p><strong class="hl">Nous ne versons pas d'argent aux hôpitaux</strong> : nous achetons directement le matériel qu'ils nous demandent.</p></div>
{STEPS}</div></section>

<section class="stats-sec"><div class="wrap"><div class="stats">
<div class="stat reveal"><b data-years="1998">28</b><span>ans d'existence</span></div>
<div class="stat reveal"><b data-count="15" data-plus>15</b><span>hôpitaux aidés</span></div>
<div class="stat reveal"><b data-count="4">4</b><span>formats d'événements</span></div>
</div></div></section>

<section class="alt"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Sur la carte</span><h2>Là où brillent les Lucioles</h2>
<p>Au départ d'Aix-les-Bains, nos lucioles rejoignent régulièrement ces hôpitaux de Savoie, de l'Ain et de Lyon.</p></div>
{MAP_SECTION}
<div class="btns reveal" style="margin-top:28px"><a class="btn btn-blue" href="projets.html">Voir nos projets {ico("arrow")}</a></div></div></section>

<section><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Prochain rendez-vous</span><h2>On se retrouve bientôt ?</h2></div>
<div class="next reveal" id="next-event"><p>Chargement…</p></div></div></section>

<section class="cta-band"><div class="wrap"><div class="cta reveal">
<div><h2>Et si vous deveniez une luciole ?</h2><p>Un don, une présence à nos animations, une fête organisée à notre profit : chaque geste compte et fait briller un sourire.</p></div>
<div class="btns">{don_btn()}<a class="btn btn-ghost" href="contact.html">Nous contacter</a></div></div></div></section>

<section><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Suivez-nous</span><h2>Les Lucioles sur les réseaux</h2><p>Photos, coulisses et annonces de nos prochains événements.</p></div>
<div class="grid g2 socials-big">
<a class="soc-card fb reveal" href="{e(S["facebook"])}" target="_blank" rel="noopener">{ico("facebook")}<span><strong>Facebook</strong><small>Association Lucioles</small></span>{ico("arrow", "i go")}</a>
<a class="soc-card ig reveal" href="{e(S["instagram"])}" target="_blank" rel="noopener">{ico("instagram")}<span><strong>Instagram</strong><small>@association_lucioles</small></span>{ico("arrow", "i go")}</a>
</div></div></section>

<section class="alt" id="partenaires"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Espace partenaires</span><h2>Ils font briller les Lucioles avec nous</h2>
<p>Entreprises, commerces, collectivités, clubs : merci à celles et ceux qui soutiennent nos actions.</p></div>
<div class="partners" id="partners"></div>
<div class="btns reveal" style="margin-top:30px"><a class="btn btn-blue" href="contact.html?objet=partenariat#ecrire">{ico("handshake")}Devenir partenaire</a></div></div></section>
''', big=True, extra_head=jsonld())

# ---------------- Association
page("association.html", "L'association – Les Lucioles",
     "Histoire, mission et valeurs de l'association Les Lucioles, fondée en 1998 à Aix-les-Bains pour les enfants hospitalisés.",
     '<span class="eyebrow">Qui sommes-nous ?</span><h1>L\'association</h1><p class="lead">Une histoire née d\'une expérience personnelle, en 1998.</p>',
     f'''
<section><div class="wrap split"><div class="reveal"><span class="eyebrow">Depuis 1998</span><h2>Notre histoire</h2>
<div class="timeline">
<div class="t reveal"><b>12 octobre 1998</b><p>Marie-Neige Machuel fonde l'association Les Lucioles à Aix-les-Bains, à la suite d'une expérience personnelle.</p></div>
<div class="t reveal"><b>Au fil des années</b><p>Une équipe de bénévoles se constitue, des événements festifs voient le jour et les hôpitaux qui nous sollicitent se multiplient, en Savoie comme à Lyon et au-delà.</p></div>
<div class="t reveal"><b>Aujourd'hui</b><p>Plus de 15 hôpitaux aidés et toujours la même mission : améliorer le quotidien des enfants gravement malades hospitalisés.</p></div></div></div>
<div class="logo-stage reveal" aria-hidden="true"><img src="assets/logo-lucioles.jpeg" alt=""><span class="orbit o1"></span><span class="orbit o2"></span><span class="orbit o3"></span></div></div></section>

<section class="alt"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Notre mission</span><h2>Acheter ce dont les enfants ont besoin</h2>
<p>Nous achetons le matériel ludique demandé par les services de pédiatrie et d'animation des hôpitaux, pour que chaque enfant puisse s'évader de sa chambre le temps d'un jeu. <strong>Nous ne donnons pas d'argent aux hôpitaux : nous achetons ce dont ils ont besoin.</strong></p></div>
<div class="grid g3">
{card("sparkle", "Lumière", "Faire briller des lumières dans les yeux des enfants.", color="gold")}
{card("users", "Solidarité", "Une chaîne de bénévoles, de donateurs et de partenaires.")}
{card("music", "Joie", "Des événements conviviaux pour financer nos actions.", color="green")}</div></div></section>

<section class="dark quote-sec"><div class="wrap"><p class="quote reveal">Pourquoi « Les Lucioles » ? Parce qu'une petite lumière suffit à <em>éclairer la nuit</em> : comme un jeu, un livre ou un sourire dans une chambre d'hôpital.</p></div></section>

<section><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">L'équipe</span><h2>Le bureau et les bénévoles</h2>
<p>Les Lucioles, ce sont avant tout des bénévoles engagés. La présentation de l'équipe arrive très bientôt.</p></div>
<div class="btns reveal"><a class="btn btn-blue" href="contact.html#ecrire">{ico("handshake")}Rejoindre l'aventure</a></div></div></section>
''')

# ---------------- Projets
page("projets.html", "Nos projets dans les hôpitaux – Les Lucioles",
     "Les hôpitaux aidés régulièrement par l'association Les Lucioles (Belley, Albertville, Chambéry, Lyon) et le matériel ludique que nous achetons pour les enfants.",
     '<span class="eyebrow">Nos actions</span><h1>Projets dans les hôpitaux</h1><p class="lead">Là où les Lucioles s\'allument.</p>',
     f'''
<section><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Ce que nous offrons</span><h2>Du matériel choisi avec les soignants</h2><p><strong>Nous ne donnons pas d'argent aux hôpitaux : nous achetons le matériel qu'ils nous demandent</strong>, selon les besoins exprimés par les équipes soignantes et d'animation et selon les fonds récoltés.</p></div>
<div class="grid g4" id="materials"></div></div></section>

<section class="dark how"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Comment ça marche ?</span><h2>Une demande, un achat, un sourire</h2></div>{STEPS}</div></section>

<section class="alt"><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Nos hôpitaux</span><h2>Les hôpitaux que nous aidons régulièrement</h2>
<p>Nous intervenons aussi partout ailleurs, dès qu'un hôpital nous adresse une demande : plus de 15 établissements aidés depuis nos débuts.</p></div>
<div class="map-split">{MAP_SECTION}<div class="hosp-list" id="hospitals"></div></div></div></section>

<section><div class="wrap"><div class="cta reveal"><div><h2>Vous travaillez dans un service de pédiatrie ?</h2><p>Faites-nous part de vos besoins : nous étudions chaque demande.</p></div>
<div class="btns"><a class="btn btn-gold" href="contact.html#ecrire">{ico("message")}Nous écrire</a></div></div></div></section>
''')

# ---------------- Evenements
page("evenements.html", "Agenda & événements – Les Lucioles",
     "Prochains rendez-vous et archives des événements de l'association Les Lucioles : repas dansants, tournois de foot, thés dansants, cabarets.",
     '<span class="eyebrow">Agenda</span><h1>Événements</h1><p class="lead">Venez faire la fête pour la bonne cause.</p>',
     f'''
<section><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">À venir</span><h2>Prochains rendez-vous</h2></div><div class="grid g2" id="events-upcoming"></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head center reveal"><span class="eyebrow">Nos formats</span><h2>Des fêtes au service des enfants</h2></div><div class="grid g4" id="formats"></div></div></section>
<section><div class="wrap"><div class="sec-head reveal"><span class="eyebrow">Ils l'ont fait</span><h2>Archives</h2></div><div class="grid g2" id="events-archive"></div>
<div class="cta reveal" style="margin-top:40px"><div><h2>Organisez une fête à notre profit</h2><p>Association, club, entreprise ou particulier : vous avez une idée ? Parlons-en.</p></div><div class="btns"><a class="btn btn-gold" href="contact.html#ecrire">{ico("message")}Nous écrire</a></div></div></div></section>
''')

# ---------------- Galerie
page("galerie.html", "Galerie photos – Les Lucioles",
     "Photos des événements, des actions dans les hôpitaux et des bénévoles de l'association Les Lucioles.",
     '<span class="eyebrow">En images</span><h1>Galerie</h1><p class="lead">Des sourires, des lumières, des souvenirs.</p>',
     f'''
<section><div class="wrap"><div class="chips" id="chips" role="group" aria-label="Filtrer par album"></div><div class="gal" id="gallery"></div>
<p class="gal-follow reveal">En attendant, retrouvez nos photos sur <a href="{e(S["instagram"])}" target="_blank" rel="noopener">Instagram</a> et <a href="{e(S["facebook"])}" target="_blank" rel="noopener">Facebook</a>.</p></div></section>
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie" hidden>
<button class="lb-close" aria-label="Fermer">✕</button><button class="lb-prev" aria-label="Photo précédente">‹</button>
<figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Photo suivante">›</button></div>
''')

# ---------------- Contact
page("contact.html", "Nous aider & contact – Les Lucioles",
     "Faire un don, participer à nos animations ou organiser une fête au profit de l'association Les Lucioles. Contactez-nous.",
     '<span class="eyebrow">Rejoignez la lumière</span><h1>Nous aider &amp; contact</h1><p class="lead">Un geste, une idée, une fête : tout compte.</p>',
     f'''
<section><div class="wrap"><div class="sec-head center reveal" id="don"><span class="eyebrow">Comment nous aider ?</span><h2>Trois façons de faire briller les Lucioles</h2></div>
<div class="grid g3 help">
<div class="card reveal"><span class="badge gold">{ico("heart")}</span><h3>Faire un don</h3><p>Chaque euro devient un jeu, un livre ou un sourire. Le don en ligne arrive très prochainement ; en attendant, contactez-nous.</p><a class="btn btn-blue" href="#ecrire">Nous contacter</a></div>
<div class="card reveal"><span class="badge green">{ico("music")}</span><h3>Participer à nos animations</h3><p>Repas dansants, tournois de foot, thés dansants : consultez l'agenda et venez nombreux.</p><a class="btn btn-blue" href="evenements.html">Voir l'agenda</a></div>
<div class="card reveal"><span class="badge">{ico("star")}</span><h3>Organiser une festivité</h3><p>Vous voulez organiser un événement au bénéfice des Lucioles ? Écrivez-nous, nous vous accompagnons.</p><a class="btn btn-blue" href="#ecrire">Proposer un projet</a></div></div>
<div class="soft-note reveal">{ico("users")}<p><strong>Adhésion et bénévolat :</strong> les modalités seront bientôt présentées ici. Envie de nous rejoindre dès maintenant ? Laissez-nous un message.</p></div></div></section>

<section class="alt"><div class="wrap split top"><div class="reveal form-card" id="ecrire"><h2>Écrivez-nous</h2>
<form id="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact"><p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div class="row2"><div><label for="n">Nom</label><input id="n" name="nom" required autocomplete="name"></div>
<div><label for="m">E-mail</label><input id="m" name="email" type="email" required autocomplete="email"></div></div>
<div><label for="o">Objet</label><input id="o" name="objet" required list="objets"><datalist id="objets"><option value="Faire un don"><option value="Devenir bénévole"><option value="Devenir partenaire des Lucioles"><option value="Organiser un événement à votre profit"><option value="Demande d'un service hospitalier"></datalist></div>
<div><label for="t">Message</label><textarea id="t" name="message" required></textarea></div>
<button class="btn btn-gold" type="submit">{ico("mail")}Envoyer le message</button><p id="form-status" class="form-status" role="status" aria-live="polite"></p></form></div>
<div class="reveal"><h2>Coordonnées</h2><ul class="info">
<li><span class="badge">{ico("pin")}</span><span>{e(S["address"])}</span></li><li><span class="badge green">{ico("phone")}</span><a href="tel:{TEL}">{e(S["phone"])}</a></li><li><span class="badge gold">{ico("mail")}</span><a href="mailto:{e(S["email"])}">{e(S["email"])}</a></li></ul>
{social()}
<iframe class="osm" title="Plan d'accès : hôpital d'Aix-les-Bains, 49 avenue du Grand Port" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=5.895%2C45.682%2C5.925%2C45.698&amp;layer=mapnik"></iframe></div></div></section>
''')

# ---------------- Mentions légales
page("mentions-legales.html", "Mentions légales – Les Lucioles",
     "Mentions légales du site de l'association Les Lucioles.",
     '<h1>Mentions légales</h1>',
     f'''<section><div class="wrap legal">
<h2>Éditeur du site</h2><p>Association Les Lucioles, association loi 1901 déclarée à la préfecture de la Savoie (création déclarée le 17/09/1998, publiée au Journal officiel le 10/10/1998).<br>Siège : {e(S["address"])}.<br>Contact : {e(S["email"])} – {e(S["phone"])}.</p>
<h2>Directrice de la publication</h2><p>{e(S["publicationDirector"])}.</p>
<h2>Conception du site</h2><p>Site réalisé bénévolement pour l'association.</p>
<h2>Hébergement</h2><p>Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Données personnelles</h2><p>Les informations saisies dans le formulaire de contact servent uniquement à répondre à votre message et ne sont jamais cédées à des tiers. Pour exercer vos droits (accès, rectification, suppression), écrivez à {e(S["email"])}.</p>
<h2>Droit à l'image</h2><p>Les photos publiées sur ce site le sont avec l'accord des personnes concernées ou, pour les mineurs, de leurs représentants légaux. Pour demander le retrait d'une photo, écrivez à {e(S["email"])}.</p>
<h2>Crédits</h2><p>Logo : association Les Lucioles. Polices : Fredoka et Nunito (Google Fonts). Plan : © contributeurs OpenStreetMap.</p>
</div></section>''')

# ---------------- 404
page("404.html", "Page introuvable – Les Lucioles", "Cette page n'existe pas ou a été déplacée.",
     f'''<span class="eyebrow">Erreur 404</span><h1>Cette luciole s'est envolée…</h1><p class="lead">La page demandée n'existe pas ou a été déplacée.</p>
<div class="btns"><a class="btn btn-gold" href="index.html">Retour à l'accueil</a></div>''', "", big=True, base='<base href="/">')

# ---------------- Sitemap / robots
pages = [h for h, _ in NAV] + ["mentions-legales.html"]
(ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    f'  <url><loc>{S["url"]}/{"" if p == "index.html" else p}</loc></url>\n' for p in pages) + "</urlset>\n", encoding="utf-8")
(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {S['url']}/sitemap.xml\n", encoding="utf-8")
print("ok")
