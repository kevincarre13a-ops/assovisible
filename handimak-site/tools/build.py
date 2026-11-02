#!/usr/bin/env python3
"""Génère les pages HTML du site (en-tête/pied de page communs). Usage : python3 tools/build.py"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NAV = [("index.html","Accueil"),("association.html","L'association"),("notre-action.html","Notre action"),
       ("evenements.html","Événements"),("galerie.html","Galerie"),("actualites.html","Actualités"),
       ("faire-un-don.html","Faire un don"),("partenaires.html","Partenaires"),("contact.html","Nous rejoindre"),
       ("mentions-legales.html","Mentions légales")]
NAV_HEADER = [n for n in NAV if n[0] not in ("faire-un-don.html","mentions-legales.html")]

SPRITE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-coeur" viewBox="0 0 48 48"><path d="M24 41S6 30 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 13-18 24-18 24z"/></symbol>
<symbol id="i-ble" viewBox="0 0 48 48"><path d="M24 44V14M24 14c-5-1-7-5-7-9 5 0 7 4 7 9zm0 0c5-1 7-5 7-9-5 0-7 4-7 9zM24 26c-5-1-8-4-8-8 5 0 8 3 8 8zm0 0c5-1 8-4 8-8-5 0-8 3-8 8zM24 38c-5-1-8-4-8-8 5 0 8 3 8 8zm0 0c5-1 8-4 8-8-5 0-8 3-8 8z"/></symbol>
<symbol id="i-atelier" viewBox="0 0 48 48"><path d="M8 40c6 0 8-3 8-6a4 4 0 0 1 8 0c0 5-5 6-16 6zM22 30L40 8l3 3-18 22z"/></symbol>
<symbol id="i-sport" viewBox="0 0 48 48"><circle cx="24" cy="24" r="17"/><path d="M24 7v34M7 24h34M12 12c8 6 8 18 0 24M36 12c-8 6-8 18 0 24"/></symbol>
<symbol id="i-flashmob" viewBox="0 0 48 48"><circle cx="14" cy="12" r="4"/><circle cx="34" cy="12" r="4"/><circle cx="24" cy="20" r="4"/><path d="M6 26l8 6 6-8M42 26l-8 6-6-8M18 44l6-14 6 14"/></symbol>
<symbol id="i-animal" viewBox="0 0 48 48"><ellipse cx="24" cy="32" rx="10" ry="8"/><circle cx="10" cy="22" r="4"/><circle cx="19" cy="12" r="4"/><circle cx="29" cy="12" r="4"/><circle cx="38" cy="22" r="4"/></symbol>
<symbol id="i-femme" viewBox="0 0 48 48"><circle cx="24" cy="20" r="5"/><path d="M24 15c-2-8-10-8-10-2s6 7 10 7zM24 15c2-8 10-8 10-2s-6 7-10 7zM24 25c-2 8-10 8-10 2s6-7 10-7zM24 25c2 8 10 8 10 2s-6-7-10-7zM24 30v14"/></symbol>
<symbol id="i-arbre" viewBox="0 0 48 48"><path d="M24 44V28M24 30c-4-3-6-6-8-8M24 26c4-3 6-6 8-8"/><circle cx="24" cy="15" r="10"/><circle cx="19" cy="13" r="1.5"/><circle cx="28" cy="16" r="1.5"/></symbol>
<symbol id="i-fete" viewBox="0 0 48 48"><ellipse cx="24" cy="18" rx="12" ry="14"/><path d="M24 32l-3 5h6zM24 37c-3 3 3 5 0 8"/></symbol>
<symbol id="i-note" viewBox="0 0 48 48"><path d="M18 36V10l22-4v26"/><circle cx="12" cy="36" r="6"/><circle cx="34" cy="32" r="6"/></symbol>
<symbol id="i-mains" viewBox="0 0 48 48"><path d="M6 26l10-10 8 4 8-4 10 10-16 16z"/><path d="M24 20v10"/></symbol>
<symbol id="i-fusee" viewBox="0 0 48 48"><path d="M24 4c8 6 10 18 6 28H18C14 22 16 10 24 4zM18 32l-6 6 8-1M30 32l6 6-8-1"/><circle cx="24" cy="18" r="3"/></symbol>
<symbol id="i-pin" viewBox="0 0 48 48"><path d="M24 44S10 30 10 20a14 14 0 0 1 28 0c0 10-14 24-14 24z"/><circle cx="24" cy="20" r="5"/></symbol>
<symbol id="i-mail" viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="4"/><path d="M6 14l18 14 18-14"/></symbol>
<symbol id="i-tel" viewBox="0 0 48 48"><path d="M12 6l6 10-4 4c3 6 7 10 14 14l4-4 10 6-2 6c-14 2-34-18-30-32z"/></symbol>
<symbol id="i-chaise" viewBox="0 0 48 48"><path d="M14 6v22h20M14 28l-4 14M34 28l4 14M34 28v14M14 16h8"/></symbol>
<symbol id="i-sante" viewBox="0 0 48 48"><rect x="6" y="14" width="36" height="26" rx="5"/><path d="M18 14V9h12v5M24 21v12M18 27h12"/></symbol>
<symbol id="i-cafe" viewBox="0 0 48 48"><path d="M8 18h26v10a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 28zM34 21h4a5 5 0 0 1 0 10h-4M14 6c-2 3 2 4 0 7M22 6c-2 3 2 4 0 7"/></symbol>
</defs></svg>'''

def icon(name, cls="c1"):
    return f'<div class="ico {cls}"><svg aria-hidden="true"><use href="#i-{name}"/></svg></div>'

def head(file, title, desc):
    full = f"{title} | Les Amis d'Handimak, Rognac"
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#16243b">
<meta property="og:title" content="{full}"><meta property="og:description" content="{desc}"><meta property="og:type" content="website"><meta property="og:image" content="assets/logo.png"><meta property="og:locale" content="fr_FR">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Baloo+2:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
{SPRITE}
<a class="skip" href="#contenu">Aller au contenu</a>
'''

def header(file):
    items = "".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if h==file else ""}>{t}</a></li>' for h,t in NAV_HEADER)
    items += "".join(f'<li class="only-mob"><a href="{h}"{" aria-current=\"page\"" if h==file else ""}>{t}</a></li>' for h,t in NAV if h in ("faire-un-don.html","mentions-legales.html"))
    return f'''<header class="hdr"><div class="wrap">
<a class="brand" href="index.html" aria-label="Les Amis d'Handimak, accueil"><img src="assets/logo.png" alt="Les Amis d'Handimak" width="88" height="52"></a>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>{items}</ul></nav>
<a class="btn coral sm" data-don href="faire-un-don.html"{' aria-current="page"' if file=="faire-un-don.html" else ""}>♥ Faire un don</a>
<button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>
<main id="contenu">
'''

def footer():
    links = "".join(f'<li><a href="{h}">{t}</a></li>' for h,t in NAV if h!="faire-un-don.html")
    return f'''</main>
<footer class="ftr"><div class="wrap">
<div class="cols">
<div><img class="logo" src="assets/logo.png" alt="Les Amis d'Handimak" width="210" height="111" loading="lazy">
<p>« La différence nous rend plus riches »</p>
<a class="btn sm" data-don href="faire-un-don.html">♥ Faire un don</a></div>
<div><h2>Nous contacter</h2>
<address style="font-style:normal">Centre d'Animation Municipal<br>120 boulevard des Jeunes<br>13340 Rognac<br>
<a href="mailto:lesamisdhandimak@hotmail.com">lesamisdhandimak@hotmail.com</a><br>
<a href="tel:+33627033080">06 27 03 30 80</a> · <a href="tel:+33631840521">06 31 84 05 21</a> · <a href="tel:+33651861335">06 51 86 13 35</a></address>
<h2 style="margin-top:1rem">Suivez-nous</h2>
<ul><li><a href="https://www.facebook.com/p/Les-Amis-dHandiMak-100090082867432/" rel="noopener" target="_blank">Facebook (nouvel onglet)</a></li></ul></div>
<div><h2>Le site</h2><ul>{links}</ul></div>
</div>
<small>© <span id="an">2026</span> Les Amis d'Handimak · Association loi 1901 · RNA W134010967 · Rognac (Bouches-du-Rhône) · <a href="mentions-legales.html">Mentions légales et confidentialité</a></small>
</div></footer>
<script src="assets/app.js" defer></script>
<script>document.getElementById('an').textContent=new Date().getFullYear()</script>
</body></html>
'''

def pagehead(title, lead, crumb):
    return f'''<div class="pagehead"><svg class="dots" viewBox="0 0 200 120" aria-hidden="true"><circle cx="30" cy="30" r="14" fill="#f6b81a"/><circle cx="90" cy="70" r="20" fill="#fff" opacity=".8"/><circle cx="160" cy="30" r="10" fill="#d23a2b"/><circle cx="150" cy="95" r="16" fill="#0b8a63" opacity=".8"/><circle cx="40" cy="95" r="9" fill="#b94a96"/></svg>
<div class="wrap"><p class="crumb"><a href="index.html">Accueil</a> › {crumb}</p><h1>{title}</h1><p class="lead">{lead}</p></div></div>
'''

def don_strip(txt="Chaque geste compte : un don, du temps, un partage."):
    return f'''<section style="padding-top:0"><div class="wrap"><div class="strip reveal"><div><h2>{txt}</h2><p>Ensemble, finançons les équipements qui changent le quotidien d'un enfant.</p></div>
<div class="cta" style="margin:0"><a class="btn" data-don href="faire-un-don.html">♥ Faire un don</a><a class="btn alt" href="contact.html#benevole">Devenir bénévole</a></div></div></div></section>
'''

CAG = '''<div data-cagnotte class="reveal"><h3 style="margin-bottom:.4rem">Collecte en cours</h3>
<div class="progress unknown" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Avancement de la collecte"><i></i></div>
<p class="cag-txt wait-txt" style="margin-top:12px">Montant et objectif à renseigner.</p></div>'''

HERO_SVG = '''<svg class="scene" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
<circle cx="1230" cy="150" r="90" fill="#f6b81a"/><circle cx="1230" cy="150" r="125" fill="#f6b81a" opacity=".25"/>
<g class="cloud"><path d="M60 170h190a38 38 0 0 0-8-72 50 50 0 0 0-96-8 42 42 0 0 0-86 80z" fill="#fff" opacity=".95"/></g>
<g class="cloud b"><path d="M560 120h210a36 36 0 0 0-6-66 54 54 0 0 0-104-4 40 40 0 0 0-100 70z" fill="#fff" opacity=".9"/></g>
<g fill="none" stroke-width="22" opacity=".9" stroke-linecap="round"><path d="M820 600a380 380 0 0 1 760 0" stroke="#d23a2b" transform="translate(-130 0)"/><path d="M842 600a358 358 0 0 1 716 0" stroke="#f6b81a" transform="translate(-130 0)"/><path d="M864 600a336 336 0 0 1 672 0" stroke="#0b8a63" transform="translate(-130 0)"/><path d="M886 600a314 314 0 0 1 628 0" stroke="#1d5aa6" transform="translate(-130 0)"/></g>
<g transform="translate(1040 300) rotate(35)"><g class="rocket"><ellipse cx="0" cy="0" rx="46" ry="110" fill="#1d5aa6" stroke="#16243b" stroke-width="6"/><path d="M-46 -20C-40 -80 -20 -110 0 -125C20 -110 40 -80 46 -20z" fill="#d23a2b" stroke="#16243b" stroke-width="6"/><circle cx="0" cy="10" r="24" fill="#f4f7fb" stroke="#0b8a63" stroke-width="8"/><path d="M-44 60l-34 44 34-8zM44 60l34 44-34-8z" fill="#0b8a63" stroke="#16243b" stroke-width="6"/><path d="M-22 108q22 70 44 0z" fill="#f6b81a" stroke="#d23a2b" stroke-width="6"/></g></g>
<path d="M0 640c180-60 360-40 560 10s420 60 880-30V800H0z" fill="#9be3c6"/>
<path d="M0 700c240-50 460-20 700 20s520 20 740-30V800H0z" fill="#0b8a63" opacity=".9"/>
<path d="M0 760c300-30 600-10 900 10s360 0 540-14V800H0z" fill="#fff"/>
<g fill="#b94a96"><circle cx="140" cy="690" r="9"/><circle cx="330" cy="720" r="7"/><circle cx="980" cy="715" r="8"/></g><g fill="#f6b81a"><circle cx="210" cy="705" r="7"/><circle cx="1180" cy="700" r="9"/></g>
<g fill="#d23a2b"><circle cx="620" cy="728" r="8"/><circle cx="1300" cy="722" r="7"/></g>
</svg>'''

def write(file, title, desc, body):
    html = head(file,title,desc) + header(file) + body + footer()
    with open(os.path.join(ROOT,file),"w",encoding="utf-8") as f: f.write(html)

# ---------- ACCUEIL
home = f'''<section class="hero" aria-labelledby="h1">{HERO_SVG}
<div class="wrap">
<p class="eyebrow" style="background:#fff;display:inline-block;padding:.2rem .9rem;border-radius:999px">Association rognacaise · depuis 2023</p>
<h1 id="h1">Ensemble, offrons aux enfants <em>l'équipement</em> qui change tout</h1>
<p class="lead">Les Amis d'Handimak organisent des événements solidaires pour financer le matériel essentiel, mais coûteux, des enfants en situation de handicap.</p>
<div class="cta"><a class="btn coral" data-don href="faire-un-don.html">♥ Faire un don</a><a class="btn" href="contact.html#benevole">Devenir bénévole</a></div>
</div></section>

<section><div class="wrap next">
<div class="reveal"><p class="eyebrow">Prochain rendez-vous</p><h2 data-ev-title>Blé de la Sainte-Barbe</h2>
<p class="meta"><span data-ev-date></span> · <span data-ev-lieu></span></p>
<div class="countdown" data-countdown role="timer" aria-label="Compte à rebours avant le prochain événement"><div><b>--</b><span>jours</span></div><div><b>--</b><span>heures</span></div><div><b>--</b><span>minutes</span></div><div><b>--</b><span>secondes</span></div></div>
<p class="wait-txt" data-ev-note></p>
<p style="margin-top:1rem"><a class="btn alt sm" href="evenements.html">Tous les événements</a></p></div>
<div class="card reveal" style="background:var(--cream)">{icon("ble","c1")}{CAG}
<p style="margin-top:1rem"><a class="btn sm" data-don href="faire-un-don.html">♥ Participer à la collecte</a></p></div>
</div></section>

<section class="sky"><div class="wrap">
<p class="eyebrow">Ce que nous faisons</p><h2>Des actions concrètes, tout au long de l'année</h2>
<div class="grid">
<article class="card reveal">{icon("chaise","c2")}<h3>Financer des équipements</h3><p>Siège de bain, assise adaptée, attelles, stages d'ergothérapie : du matériel peu ou pas pris en charge.</p><a href="notre-action.html">Découvrir notre action</a></article>
<article class="card reveal">{icon("atelier","c1")}<h3>Ateliers en inclusion</h3><p>Un samedi après-midi par mois, des ateliers créatifs pour tous les enfants, leur fratrie et leurs parents.</p><a href="evenements.html">Voir les ateliers</a></article>
<article class="card reveal">{icon("ble","c4")}<h3>Blé de la Sainte-Barbe</h3><p>Des sachets confectionnés par nos bénévoles et vendus dans les commerces de Rognac.</p><a href="evenements.html">En savoir plus</a></article>
<article class="card reveal">{icon("cafe","c3")}<h3>Un espace pour les parents</h3><p>Écoute, échanges, café offert, aide aux dossiers MDPH : un lieu bienveillant, sans jugement.</p><a href="association.html">L'association</a></article>
</div></div></section>

<section><div class="wrap"><p class="eyebrow">En chiffres</p><h2>Une communauté qui grandit</h2><div class="stats" data-stats></div></div></section>

<section class="tint"><div class="wrap"><p class="eyebrow">À venir</p><h2>Les prochains projets</h2><div class="grid" data-events-home></div>
<p style="margin-top:1.5rem"><a class="btn alt" href="evenements.html">Voir tous les événements</a></p></div></section>

<section><div class="wrap"><p class="eyebrow">Actualités</p><h2>Les dernières nouvelles</h2><div class="grid" data-news data-limit="3"></div>
<p style="margin-top:1.5rem"><a class="btn alt" href="actualites.html">Toutes les actualités</a></p></div></section>

<section class="sky"><div class="wrap"><p class="eyebrow">Ils nous soutiennent</p><h2>Partenaires et relais</h2><div class="grid" data-partners data-limit="3"></div>
<p style="margin-top:1.5rem"><a class="btn alt" href="partenaires.html">Tous nos partenaires</a></p></div></section>
{don_strip()}
'''
write("index.html","Accueil","Les Amis d'Handimak, association de Rognac : événements solidaires pour financer les équipements des enfants en situation de handicap.",home)

# ---------- ASSOCIATION
asso = pagehead("Une histoire de solidarité née à Rognac","Depuis le 5 janvier 2023, une poignée de bénévoles transforment les petits gestes en grands soutiens pour les enfants en situation de handicap.","L'association") + f'''
<section><div class="wrap split">
<div class="reveal"><p class="eyebrow">Notre histoire</p><h2>De 2 membres à une vraie communauté</h2>
<p>L'association Les Amis d'Handimak est née le <strong>5 janvier 2023</strong> à Rognac. Elle comptait deux membres de bureau la première année, quatre en 2024, et le bureau s'est étoffé depuis.</p>
<p>D'une quarantaine d'adhérents en 2023, elle en compte <strong>116 sur la saison 2024/2025</strong>. Depuis septembre 2024, elle dispose d'un local municipal, accessible en fauteuil roulant, où se déroulent ateliers et rencontres.</p>
<p>Notre association commence à être reconnue : les parents ont moins de difficultés à venir demander de l'aide.</p></div>
<div class="reveal"><div class="card" style="background:var(--cream)">{icon("fusee","c1")}<h3>L'origine du nom « Handimak »</h3><p class="wait-txt">Texte à renseigner par l'association : histoire et signification du nom « Handimak ».</p></div></div>
</div></section>

<section class="sky"><div class="wrap"><p class="eyebrow">Nos valeurs</p><h2>Ce qui nous guide</h2>
<div class="grid">
<article class="card reveal">{icon("coeur","c3")}<h3>Solidarité</h3><p>« La solidarité est notre mot d'ordre. » Chaque petit geste apporte de l'espoir aux parents et des sourires aux enfants.</p></article>
<article class="card reveal">{icon("mains","c2")}<h3>Inclusion</h3><p>Des ateliers pour les enfants porteurs de handicap, leur fratrie et tous les enfants, pour défaire les idées reçues.</p></article>
<article class="card reveal">{icon("sante","c4")}<h3>Respect et discrétion</h3><p>Beaucoup d'actions sont menées à l'abri des regards pour préserver la pudeur des familles.</p></article>
<article class="card reveal">{icon("cafe","c1")}<h3>Bienveillance</h3><p>Un accueil sans jugement, de l'écoute et de la convivialité pour les parents comme pour les enfants.</p></article>
</div></div></section>

<section><div class="wrap split">
<div class="reveal"><p class="eyebrow">Nos missions</p><h2>Ce que disent nos statuts</h2>
<ul class="list"><li>Organiser des événements, actions solidaires, manifestations et collectes pour permettre aux enfants porteurs de handicap de bénéficier d'une aide financière : matériel, équipements coûteux, dispositifs facilitant l'autonomie.</li>
<li>Sensibiliser le public au handicap et à l'inclusion.</li><li>Développer des partenariats avec les acteurs publics et privés qui poursuivent un objet compatible.</li><li>Offrir ou recevoir des dons de produits et de services en lien avec l'objet de l'association.</li></ul></div>
<div class="reveal"><p class="eyebrow">Parrain</p><h2>Un artiste à nos côtés</h2><p>Le chanteur <strong>Naestro</strong> est le parrain de l'association.</p>
<p class="quote">« La différence nous rend plus riches »</p></div>
</div></section>

<section class="tint"><div class="wrap"><p class="eyebrow">Bureau et équipe</p><h2>Celles qui font vivre l'association</h2>
<div class="grid">
<article class="card person reveal">{icon("coeur","c3")}<h3>Laurie Marafico</h3><p class="meta">Présidente</p></article>
<article class="card person reveal">{icon("atelier","c1")}<h3>Sabrina Gourre</h3><p class="meta">Secrétaire</p></article>
<article class="card person reveal">{icon("sante","c4")}<h3>Laurène Corral</h3><p class="meta">Trésorière</p></article>
<article class="card person reveal">{icon("mains","c2")}<h3>Nos bénévoles</h3><p class="meta">Retraitées assidues et volontaires : confection d'objets décoratifs à partir de matériel recyclé, couture, sachets de blé.</p></article>
</div>
<p class="wait-txt" style="margin-top:1.5rem">Bureau d'après le procès-verbal de l'assemblée générale du 14 mars 2026. Photos et autres membres à ajouter avec leur accord.</p></div></section>
{don_strip()}
'''
write("association.html","L'association","Histoire, valeurs, missions et bureau des Amis d'Handimak, association rognacaise créée en 2023 pour les enfants en situation de handicap.",asso)

# ---------- NOTRE ACTION
action = pagehead("Du matériel qui change le quotidien","Les équipements nécessaires aux enfants en situation de handicap sont peu ou pas pris en charge. Nous aidons les familles à y accéder.","Notre action") + f'''
<section><div class="wrap"><p class="eyebrow">Deux façons d'aider</p><h2>Comment l'association agit</h2>
<div class="grid">
<article class="card reveal">{icon("mains","c1")}<h3>Participer à l'achat pour un enfant</h3><p>Nous contribuons directement à l'achat du matériel dont un enfant a besoin : un appareil d'aide à l'autonomie, des soins non remboursés, un stage d'ergothérapie…</p></article>
<article class="card reveal">{icon("chaise","c2")}<h3>Acheter du matériel au nom de l'association</h3><p>Le matériel est ensuite prêté, selon l'âge et le profil, à plusieurs enfants, tant qu'ils en ont besoin. Ainsi un siège de bain de 600 € a déjà servi à plusieurs enfants.</p></article>
</div></div></section>

<section class="sky"><div class="wrap"><p class="eyebrow">Équipements financés</p><h2>Exemples de matériel</h2>
<div class="grid">
<article class="card reveal">{icon("chaise","c2")}<h3>Siège de bain</h3><p>Acheté en 2024 pour 600 €, prêté à tour de rôle.</p></article>
<article class="card reveal">{icon("chaise","c4")}<h3>Assise, siège toilette, attelles</h3><p>Assise de type « Laloo », siège toilette enfant, attelles adaptées.</p></article>
<article class="card reveal">{icon("sante","c3")}<h3>Stages et soins</h3><p>Stage intensif d'ergothérapie (400 €), stage pluridisciplinaire, soins non pris en charge.</p></article>
<article class="card reveal">{icon("coeur","c1")}<h3>Aide à l'autonomie</h3><p>Participation de 200 € à l'achat d'un appareil pour gagner en autonomie lors des déplacements.</p></article>
</div>
<p class="meta" style="margin-top:1rem">Pour respecter les familles, aucun nom, aucune photo et aucune information médicale d'enfant n'est publié sur ce site.</p></div></section>

<section><div class="wrap split">
<div class="reveal"><p class="eyebrow">Comment les projets sont choisis</p><h2>Écouter d'abord, puis agir</h2>
<ul class="list"><li>Chaque situation familiale est accueillie par les membres, dans une relation de confiance.</li><li>Nous étudions chaque besoin de façon individuelle et la façon d'y répondre.</li><li>Nous nous engageons dans le respect et la discrétion : aucune famille ne doit se sentir redevable.</li></ul>
<p class="wait-txt">Critères détaillés et procédure de demande d'aide : à valider et compléter par l'association.</p></div>
<div class="reveal"><p class="eyebrow">Au-delà du matériel</p><h2>Un soutien aux parents</h2>
<ul class="list"><li>Un espace d'écoute et d'échange, café offert, sans jugement.</li><li>Partage de contacts, thérapeutes, méthodes et outils.</li><li>Aide pour les dossiers MDPH par une maman expérimentée dans ce domaine.</li><li>Don de couches à des familles dans le besoin, pour les enfants plus grands.</li></ul></div>
</div></section>

<section class="tint"><div class="wrap split">
<div class="reveal"><p class="eyebrow">Transparence</p><h2>L'utilisation des fonds</h2>
<p>Les comptes sont présentés chaque année à l'assemblée générale. Les fonds collectés par les ventes et les événements sont reversés à l'association, qui les consacre aux équipements et aux actions pour les enfants.</p>
<p class="wait-txt">Synthèse chiffrée de l'emploi des fonds (recettes, dépenses, répartition) : à publier après validation par la trésorière et le bureau.</p></div>
{CAG.replace('class="reveal"','class="card reveal"',1)}
</div></section>
{don_strip()}
'''
write("notre-action.html","Notre action","Comment Les Amis d'Handimak financent des équipements pour les enfants en situation de handicap : choix des projets, exemples et transparence.",action)

# ---------- EVENEMENTS
ev = pagehead("Des rendez-vous solidaires toute l'année","Ateliers, ventes, sensibilisation : venez partager un moment et soutenir les enfants.","Événements") + '''
<section><div class="wrap"><p class="eyebrow">Prochains événements</p><h2>À venir</h2><div class="grid" data-events-next></div>
<p class="wait-txt" style="margin-top:1.5rem">Les dates sont à confirmer par l'association : elles se modifient dans <code>data/evenements.json</code>.</p></div></section>
<section class="tint"><div class="wrap"><p class="eyebrow">Archives</p><h2>Les éditions passées</h2><div class="grid" data-events-arch></div></div></section>
''' + don_strip()
write("evenements.html","Événements","Prochains événements de collecte et archives des Amis d'Handimak à Rognac : ateliers, blé de la Sainte-Barbe, sensibilisation.",ev)

# ---------- GALERIE
gal = pagehead("L'action en images","Du matériel, des mains, des objets faits main : nous privilégions les images de l'action plutôt que les portraits d'enfants.","Galerie") + f'''
<section><div class="wrap"><div class="notice reveal">{icon("sante","c1")}<div><strong>Protection des enfants.</strong> Aucune photo d'enfant n'est publiée sans que sa diffusion publique soit clairement établie et respectueuse. Les photos de l'association s'ajoutent dans <code>data/galerie.json</code>.</div></div>
<div class="grid" style="margin-top:28px" data-gallery></div></div></section>
''' + don_strip()
write("galerie.html","Galerie","Galerie des Amis d'Handimak classée par événement, dans le respect de la protection des enfants et des familles.",gal)

# ---------- ACTUALITES
act = pagehead("Les dernières nouvelles","Assemblée générale, projets, médias : suivez la vie de l'association.","Actualités") + '''
<section><div class="wrap"><div class="grid" data-news></div>
<p class="wait-txt" style="margin-top:1.5rem">Plus d'actualités sur notre <a href="https://www.facebook.com/p/Les-Amis-dHandiMak-100090082867432/" target="_blank" rel="noopener">page Facebook</a>.</p></div></section>
''' + don_strip()
write("actualites.html","Actualités","Les dernières nouvelles des Amis d'Handimak : assemblée générale, projets, médias et vie de l'association à Rognac.",act)

# ---------- DON
don = pagehead("Un don, un équipement, un sourire","Votre soutien finance directement du matériel pour des enfants en situation de handicap.","Faire un don") + f'''
<section id="don"><div class="wrap split">
<div class="card reveal" style="background:var(--cream)">{icon("coeur","c3")}<h2>Donner en ligne</h2>
<p>Le don se fait sur une plateforme sécurisée externe (HelloAsso ou équivalent). Aucun paiement n'est géré sur ce site.</p>
<p><a class="btn coral" data-don-external href="#don">Donner en ligne</a></p>
<p class="wait-txt" data-don-note></p>{CAG}</div>
<div class="reveal"><p class="eyebrow">Mention fiscale</p><h2>Reçu fiscal et déduction</h2>
<p class="wait-txt">Texte à valider par l'association une fois son statut confirmé (éligibilité au reçu fiscal). Aucun avantage fiscal n'est annoncé en l'état.</p>
<p class="eyebrow" style="margin-top:2rem">Par chèque ou en espèces</p>
<p class="wait-txt">Modalités (ordre du chèque, adresse d'envoi) à renseigner.</p></div></div></section>
<section class="sky"><div class="wrap"><p class="eyebrow">Autres façons d'aider</p><h2>Il n'y a pas que l'argent</h2>
<div class="grid">
<article class="card reveal">{icon("ble","c1")}<h3>Dons en nature</h3><p>Matériel recyclé, tissus pour nos pochettes, lots pour les tombolas. Contactez-nous avant d'apporter.</p></article>
<article class="card reveal">{icon("mains","c4")}<h3>Devenir bénévole</h3><p>Quelques heures en semaine ou lors d'un événement : chacun choisit le temps qu'il donne.</p><a href="contact.html#benevole">Je rejoins l'équipe</a></article>
<article class="card reveal">{icon("note","c2")}<h3>Relayer</h3><p>Partagez nos événements, parlez de nous à votre commerce, votre école, votre association.</p></article>
<article class="card reveal">{icon("coeur","c3")}<h3>Adhérer</h3><p>10 € par an, valable un an, pour suivre chaque événement et participer aux ateliers.</p><a href="contact.html#adhesion">Adhérer</a></article>
</div></div></section>
'''
write("faire-un-don.html","Faire un don","Soutenez Les Amis d'Handimak à Rognac : don en ligne, dons en nature, bénévolat et relais pour financer les équipements d'enfants en situation de handicap.",don)

# ---------- PARTENAIRES
par = pagehead("Merci à celles et ceux qui nous soutiennent","Institutions, associations, commerçants et artistes : sans eux, rien ne serait possible.","Partenaires") + f'''
<section><div class="wrap"><div class="grid" data-partners></div>
<p class="wait-txt" style="margin-top:1.5rem">Logos et noms des commerces partenaires à ajouter avec leur accord dans <code>data/partenaires.json</code>.</p></div></section>
<section class="tint"><div class="wrap split"><div class="reveal"><p class="eyebrow">Devenir partenaire</p><h2>Entreprises, commerces, mécènes</h2>
<p>Nous avons beaucoup d'idées, mais nous manquons parfois de moyens. Les partenariats sont les bienvenus : relais de nos ventes, soutien d'un événement, don de lots ou de matériel.</p>
<p><a class="btn" href="contact.html#contact">Nous contacter</a></p></div>
<div class="reveal"><p class="wait-txt">Avantages fiscaux du mécénat : texte à valider par l'association, après confirmation de son statut.</p></div></div></section>
''' + don_strip()
write("partenaires.html","Partenaires & mécènes","Partenaires, commerces et mécènes des Amis d'Handimak à Rognac, et comment devenir partenaire de l'association.",par)

# ---------- CONTACT
con = pagehead("Rejoignez l'aventure","Bénévole, adhérent, partenaire ou simplement curieux : écrivez-nous.","Nous rejoindre / Contact") + f'''
<section id="benevole"><div class="wrap split">
<div class="reveal"><p class="eyebrow">Bénévolat</p><h2>Donnez le temps que vous voulez</h2>
<p>Chacun est libre du temps et des actions qu'il veut donner. Les bénévoles se retrouvent en semaine au local pour confectionner des objets décoratifs, coudre ou préparer les sachets de blé.</p>
<ul class="list"><li>Ateliers du samedi après-midi</li><li>Confection et vente de sachets de blé</li><li>Organisation et logistique des événements</li></ul>
<div id="adhesion"><p class="eyebrow" style="margin-top:2rem">Adhésion</p><h3>10 € par an, valable un an</h3>
<p>L'adhésion est effective à partir de septembre. Elle permet d'être informé de chaque événement, d'échanger avec nous et de participer aux ateliers. Nous sommes présents chaque année au forum des associations de Rognac.</p>
<p><a class="btn alt" href="assets/bulletin-adhesion.pdf" download>Télécharger le bulletin d'adhésion (PDF)</a></p>
<p class="wait-txt">Adhésion en ligne : à renseigner si l'association ouvre une billetterie ou une adhésion HelloAsso. Le bulletin joint porte encore l'ancienne adresse et l'orthographe « Andimac » : à mettre à jour.</p></div></div>
<div class="card reveal" id="contact"><h2>Écrire à l'association</h2>
<form name="contact" method="POST" action="merci.html" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact">
<p class="hp"><label>Ne pas remplir <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<div><label for="nom">Nom et prénom</label><input id="nom" name="nom" required autocomplete="name"></div>
<div><label for="email">Adresse e-mail</label><input id="email" name="email" type="email" required autocomplete="email"></div>
<div><label for="sujet">Sujet</label><select id="sujet" name="sujet"><option>Devenir bénévole</option><option>Adhérer</option><option>Devenir partenaire</option><option>Proposer un don en nature</option><option>Autre demande</option></select></div>
<div><label for="message">Votre message</label><textarea id="message" name="message" required></textarea></div>
<div style="display:flex;gap:12px;align-items:flex-start"><input id="rgpd" name="consentement" type="checkbox" required style="width:28px;min-height:28px;margin-top:4px"><label for="rgpd" style="font-weight:400">J'accepte que mes informations soient utilisées pour répondre à ma demande (voir la <a href="mentions-legales.html#confidentialite">politique de confidentialité</a>).</label></div>
<button class="btn" type="submit">Envoyer le message</button></form></div>
</div></section>
<section class="sky"><div class="wrap split">
<div class="reveal"><p class="eyebrow">Coordonnées</p><h2>Nous trouver</h2>
<ul class="list"><li><strong>Adresse :</strong> Centre d'Animation Municipal, 120 boulevard des Jeunes, 13340 Rognac</li>
<li><strong>E-mail :</strong> <a href="mailto:lesamisdhandimak@hotmail.com">lesamisdhandimak@hotmail.com</a></li>
<li><strong>Téléphone :</strong> <a href="tel:+33627033080">06 27 03 30 80</a> · <a href="tel:+33631840521">06 31 84 05 21</a> · <a href="tel:+33651861335">06 51 86 13 35</a></li>
<li><strong>Facebook :</strong> <a href="https://www.facebook.com/p/Les-Amis-dHandiMak-100090082867432/" target="_blank" rel="noopener">Notre page (nouvel onglet)</a></li></ul>
<p class="meta">Local accessible en fauteuil roulant, cour sécurisée.</p></div>
<div class="map reveal"><iframe title="Plan : Rognac" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=5.2150%2C43.4830%2C5.2420%2C43.4980&amp;layer=mapnik&amp;marker=43.4905%2C5.2285"></iframe>
<p style="margin:10px 14px"><a href="https://www.openstreetmap.org/?mlat=43.4905&amp;mlon=5.2285#map=15/43.4905/5.2285" target="_blank" rel="noopener">Agrandir le plan (nouvel onglet)</a></p></div>
</div></section>
'''
write("contact.html","Nous rejoindre / Contact","Rejoignez Les Amis d'Handimak à Rognac : bénévolat, adhésion à 10 €, formulaire de contact et coordonnées de l'association.",con)

# ---------- MENTIONS
men = pagehead("Mentions légales et confidentialité","Informations réglementaires de l'association.","Mentions légales") + '''
<section><div class="wrap" style="max-width:860px">
<h2>Éditeur du site</h2>
<ul class="list"><li><strong>Dénomination :</strong> Les Amis d'Handimak</li><li><strong>Forme :</strong> association loi 1901, créée le 5 janvier 2023</li><li><strong>Numéro RNA :</strong> W134010967</li>
<li><strong>Siège social :</strong> Centre d'Animation Municipal, 120 boulevard des Jeunes, 13340 Rognac</li><li><strong>Contact :</strong> lesamisdhandimak@hotmail.com</li>
<li><strong>Directrice de la publication :</strong> Laurie Marafico, présidente</li><li><strong>SIRET :</strong> <span class="wait-txt">à renseigner (si attribué)</span></li></ul>
<p class="wait-txt">Autres informations réglementaires (statut d'intérêt général, assurance, conditions de reçu fiscal) : à compléter et valider par l'association.</p>
<h2 style="margin-top:2rem">Hébergement</h2><p>Site hébergé par Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis.</p>
<h2>Conception</h2><p class="wait-txt">Crédit du prestataire de conception à renseigner.</p>
<h2>Propriété intellectuelle</h2><p>Le logo et les contenus appartiennent à l'association. Toute reproduction nécessite son accord.</p>
<h2>Protection des enfants et des familles</h2><p>Ce site ne publie aucun nom, aucune photo ni aucune information médicale concernant un enfant sans accord clair des familles.</p>
<h2 id="confidentialite" style="margin-top:2rem">Politique de confidentialité</h2>
<ul class="list"><li><strong>Responsable du traitement :</strong> Les Amis d'Handimak.</li>
<li><strong>Données collectées :</strong> nom, adresse e-mail et message saisis dans le formulaire de contact, traités via Netlify Forms.</li>
<li><strong>Finalité :</strong> répondre à votre demande. Les données ne sont ni vendues ni utilisées à d'autres fins.</li>
<li><strong>Durée de conservation :</strong> <span class="wait-txt">à fixer par l'association (par exemple 12 mois).</span></li>
<li><strong>Vos droits :</strong> accès, rectification, effacement : écrivez à lesamisdhandimak@hotmail.com.</li>
<li><strong>Cookies :</strong> ce site n'utilise aucun traceur publicitaire ni outil de mesure d'audience. Il charge des polices Google Fonts et, sur la page Contact, un plan OpenStreetMap, qui peuvent recevoir votre adresse IP.</li>
<li><strong>Dons :</strong> traités sur la plateforme externe indiquée sur la page « Faire un don », qui a sa propre politique.</li></ul>
</div></section>
'''
write("mentions-legales.html","Mentions légales","Mentions légales, informations réglementaires (RNA W134010967) et politique de confidentialité des Amis d'Handimak, Rognac.",men)

# ---------- MERCI
mer = pagehead("Merci pour votre message !","Nous vous répondrons dès que possible.","Merci") + f'''
<section><div class="wrap"><div class="card" style="max-width:640px">{icon("coeur","c3")}<p>Votre message a bien été envoyé à l'association.</p><p><a class="btn" href="index.html">Retour à l'accueil</a></p></div></div></section>
'''
write("merci.html","Message envoyé","Votre message a été envoyé aux Amis d'Handimak.",mer)
print("pages générées")
